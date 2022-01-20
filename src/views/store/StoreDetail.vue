<template>
    <div class="store-detail">
        <!-- 标题导航 -->
        <detail-title @back="back" ref="title"/>
        <scroll :top="42"
                :bottom="52"
                ref="scroll"
                @onScroll="onScroll">
            <!-- 图书主要信息展示 -->
            <book-info :cover="cover"
                       :title="title"
                       :author="author"
                       :des="des"/>

            <!-- 版权 -->
            <copy-right :publisher="publisher"
                        :category="categoryText"
                        :lang="lang"
                        :ISBN="ISBN"/>

            <!-- 目录 -->
            <catalog :flatNavigation="flatNavigation"
                     :navigation="navigation"/>

            <!-- 试读 -->
            <div class="try-reading">
                <div class="title">{{$t(`detail.trial`)}}</div>
                <div class="content-list">
                    <div class="loading-text-wrapper" v-if="!this.displayed">
                        <div class="loding-text">{{$t(`detail.loading`)}}</div>
                    </div>
                </div>
                <div id="preview" ref="preview" v-show="this.displayed"></div>
            </div>

            <!-- 底部导航 -->
            <bottom-bar :bookItem="bookItem" @readBook="readBook"/>
        </scroll>
    </div>
</template>
<script>
import DetailTitle from 'components/detail/DetailTitle.vue'
import BookInfo from 'components/detail/BookInfo.vue'
import CopyRight from 'components/detail/CopyRight.vue'
import Catalog from 'components/detail/Catalog.vue'
import BottomBar from 'components/detail/BottomBar.vue'

import Scroll from 'components/common/Scroll.vue'

import {detail} from 'api/store'
import {realPx} from 'utils/utils'

import Epub from 'epubjs'

export default {
   name:'StoreDetail',
   components: {
       DetailTitle,
       BookInfo,
      Scroll,
      CopyRight,
      Catalog,
      BottomBar
   },
   data () {
       return {
           bookItem: null,
           cover: null,
           book: null,
           metadata: null,
           navigation: null,
           description: null,
           categoryText: null,
           displayed: false
       }
   },
   computed: {
       // 书籍名称
       title() {
           return this.metadata ? this.metadata.title : ''
       },
       // 作者
       author() {
           return this.metadata ? this.metadata.creator : ''
       },
       // 简要描述
       des() {
           if(this.description) {
               return this.description.substring(0,100)
           } else {
               return ''
           }
       },
       // 出版社
       publisher() {
           return this.metadata ? this.metadata.publisher : '-'
       },
       // 语言
       lang() {
           return this.metadata ? this.metadata.language : '-'
       },
       // ISBN
       ISBN() {
           return this.metadata ? this.metadata.identifier : '-'
       },
       // 将电子书目录转为一维数组
      flatNavigation() {
            if (this.navigation) {
                return Array.prototype.concat.apply([], Array.prototype.concat.apply([], this.doFlatNavigation(this.navigation.toc)))
            } else {
                return []
            }
      },
   },
   mounted () {
       this.init()
   },
   methods: {
       // 1. 电子书详情页初始化
       init() {
           //获取电子书书名
           this.fileName = this.$route.query.fileName
           //获取电子书的分类
           this.categoryText = this.$route.query.category
           //请求API 获取电子书的数据
           if(this.fileName) {
               detail({
                   fileName: this.fileName
               }).then(response => {
                   if(response.status === 200 && response.data.error_code === 0 && response.data.data) {
                       const data = response.data.data
                       // 保存电子书详情数据
                       this.bookItem = data
                       // 获取封面数据
                       this.cover = this.bookItem.cover
                       // 获取rootFile数据
                       let rootFile = data.rootFile
                       //startswith() 方法用于检查字符串是否是以指定子字符串开头，如果是则返回 True，否则返回 False。
                       if ( rootFile.startsWith('/')) {
                           // substring() 方法用于提取字符串中介于两个指定下标之间的字符。
                           rootFile = rootFile.substring(1, rootFile.length)
                       }
                       // 根据rootFile 拼接出opf文件路径
                       this.opf = `http://47.99.166.157/epub2/${this.fileName}/${rootFile}`
                       // 解析电子书
                       this.parseBook(this.opf)
                   }
               })
           }
       },

       //2. 解析电子书
       parseBook(url) {
           // 通过电子书或opf文件的url生成Book对象
           this.book = new Epub(url)

           // 获取电子书的metadata信息
           this.book.loaded.metadata.then(metadata => {
               this.metadata = metadata
            //    console.log(this.metadata);
           })

           // 获取电子书的目录信息
           this.book.loaded.navigation.then(nav => {
               this.navigation = nav
               // 通过第二章的目录（第一章通常是封面，所以获取第二章）
                if (this.navigation.toc && this.navigation.toc.length > 1) {
                    // 将第二章进行渲染（渲染的内容隐藏在屏幕外，用户是看不见的）
                    const candisplay = this.display(this.navigation.toc[1].href)
                    if (candisplay) {
                    candisplay.then(section => {
                        if (this.$refs.scroll) {
                            this.$refs.scroll.refresh()
                        }
                        this.displayed = true
                        // 渲染成功后通过section获取HTML文本，将HTML标签进行替换，提取纯文本信息
                        const reg = new RegExp('<.+?>', 'g')
                        const text = section.output.replace(reg, '').replace(/\s\s/g, '')
                        // 将纯文本信息保存到description变量中，用于进行摘要信息展示
                        this.description = text
                    })
                }
            }
        })
       },

       // 3. 根据传入的目录信息，渲染电子书
      display(location) {
          if (this.$refs.preview) {
            if (!this.rendition) {
                this.rendition = this.book.renderTo('preview', {
                width: window.innerWidth > 640 ? 640 : window.innerWidth,
                height: window.innerHeight,
                method: 'default'
                })
            }
            if (!location) {
                return this.rendition.display()
            } else {
                return this.rendition.display(location)
            }
          }
      },

      // 4. 将目录从多维转为一维
      doFlatNavigation(content, deep = 1) {
        const arr = []
        content.forEach(item => {
          item.deep = deep
          arr.push(item)
          if (item.subitems && item.subitems.length > 0) {
            arr.push(this.doFlatNavigation(item.subitems, deep + 1))
          }
        })
        return arr
      },

      // 5. 返回
      back() {
           this.$router.go(-1)
       },

       //6.处理用户滚动事件，确定标题阴影的显示状态
      onScroll(offsetY) {
        if (offsetY > realPx(42)) {
          this.$refs.title.showShadow()
        } else {
          this.$refs.title.hideShadow()
        }
      },

      // 7.
      readBook() {
           this.$router.push({
               path: `/ebook/${this.bookItem.categoryText}|${this.fileName}.epub`
           })
       }
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .try-reading {
        width: 100%;
        .title {
            padding: px2rem(20) 0 px2rem(15) px2rem(15);
            box-sizing: border-box;
            font-size: px2rem(20);
            color: #333;
        }
        .content-list {
            .loading-text-wrapper {
                width: 100%;
                .loding-text {
                    font-size: px2rem(14);
                    color: #333;
                }
            }
        }
    }
</style>
