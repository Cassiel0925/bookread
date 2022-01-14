<template>
    <div class="ebook-slide-contents">
        <!-- 搜索模块 start -->
        <div class="slide-contents-search-wrapper">
            <!-- 搜索 -->
            <div class="slide-contents-search-input-wrapper">
                <!-- 小图标 -->
                <div class="slide-contents-search-icon">
                    <span class="icon-search"></span>
                </div>
                <input type="text"
                       class="slide-contents-search-input"
                       :placeholder="$t('book.searchHint')"
                       v-model="searchText"
                       @keyup.enter.exact="search()"
                       @click="showSearchPage()"
                       >
            </div>
            <!-- 取消 -->
            <div class="slide-contents-search-cancel"
                 v-show="searchVisible"
                 @click="hideSearchPage()">{{$t('book.cancel')}}</div>
        </div>
        <!-- 搜索模块 end -->

        <!-- 图书详细信息 start -->
        <div class="slide-contents-book-wrapper" v-show="!searchVisible">
            <!-- 图书的图片 -->
            <div class="slide-contents-book-img-wrapper">
                <img :src="cover" class="slide-contents-book-img">
            </div>
            <!-- 图书的介绍信息 -->
            <div class="slide-contents-book-info-wrapper">
                <!-- 标题 -->
                <div class="slide-contents-book-title">
                    <span class="slide-contents-book-title-text">{{metadata.title}}</span>
                </div>
                <!-- 作者 -->
                <div class="slide-contents-book-author">
                    <span class="slide-contents-book-author-text">{{metadata.creator}}</span>
                </div>
            </div>
            <!-- 图书阅读进度和阅读时间 -->
            <div class="slide-contents-book-progress-wrapper">
                <!-- 阅读进度 -->
                <div class="slide-contents-book-progress">
                    <span class="progress">{{progress + '%'}}</span>
                    <span class="progress-text">{{$t('book.haveRead2')}}</span>
                </div>
                <!-- 阅读时间 -->
                <div class="slide-contents-book-time">{{getReadTimeText()}}</div>
            </div>
        </div>
        <!-- 图书详细信息 end -->

        <!-- 章节信息 start -->
        <scroll class="slide-contents-list"
                :top="156"
                :bottom="48"
                ref="scroll"
                v-show="!searchVisible"
                >
                <div class="slide-contents-item" 
                     v-for="(item, index) in navigation" 
                     :key="index"
                     @click="displayContent(item.href)">
                    <span class="slide-contents-item-label"
                          :style="contentItemStyle(item)"
                          :class="{'selected': section === index}">{{item.label}}</span>
                    <span class="slide-contents-item-page"></span>
                </div>
        </scroll>
        <!-- 章节信息 end -->

        <!-- 搜索信息 start -->
        <scroll class="slide-search-list"
                :top="66"
                :bottom="48"
                v-show="searchVisible">
            <div class="slide-search-item"
                 v-for="(item, index) in searchList"
                 :key="index"
                 v-html="item.excerpt"
                 @click="displayContent(item.cfi, true)"></div>
        </scroll>
        <!-- 搜索信息 end -->

    </div>
</template>
<script>
import { ebookMixin } from 'utils/mixin'
import Scroll from 'components/common/Scroll.vue'
import { px2rem } from 'utils/utils'
export default {
   name:'EbookSlideContents',
   components: { 
       Scroll 
    },
   mixins: [ebookMixin],
   data () {
       return {
           searchVisible: false,
           searchList: null,
           searchText: ''
       }
   },
   methods: {
    //    1. 隐藏取消文本
       hideSearchPage() {
           this.searchVisible = false
           this.searchText = ''
           this.searchList = null
       },
    //    2. 显示文本
       showSearchPage() {
           this.searchVisible = true
       },
    //    3. 计算章节标题属于几级 进行缩进
        contentItemStyle(item) {
            return {
                marginLeft: `${px2rem(item.level * 15)}rem`
            }
        },
        // 4. 点击章节 进行切换章节 点击搜索列表跳转到相应的页面 并隐藏搜索列表
        displayContent(target, highlight = false) {
            this.display(target, () => {
                this.hideTitleAndMenu()
                this.hideSearchPage()
            })
            if(highlight) {
                // 高亮显示
                this.currentBook.rendition.annotations.highlight(target)
            }
            
            // console.log(item);
        },
        // 5. 全文搜索
        doSearch(q) {
            return Promise.all(
                this.currentBook.spine.spineItems.map(item => 
                    item.load(this.currentBook.load.bind(this.currentBook)).then(item.find.bind(item, q)).finally(item.unload.bind(item)))
            ).then(results => Promise.resolve([].concat.apply([], results)));
        },
        // 6. 搜索关键字+关键字高亮显示
        search() {
            if(this.searchText && this.searchText.length > 0) {
                this.doSearch(this.searchText).then(list => {
                    this.searchList = list
                    this.searchList.map(item => {
                        item.excerpt = item.excerpt.replace(this.searchText, `<span class="content-search-text">${this.searchText}</span>`)
                        return item
                    })
                })
            }
            
        },
       
       
    }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .ebook-slide-contents {
        width: 100%;
        font-size: 0;
        .slide-contents-search-wrapper{
            display: flex;
            width: 100%;
            height: px2rem(36);
            margin: px2rem(20) 0 px2rem(10) 0;
            padding: 0 px2rem(15);
            box-sizing: border-box;
            .slide-contents-search-input-wrapper{
                flex: 1;
                @include center;
                .slide-contents-search-icon{
                    flex: 0 0 px2rem(28);
                    font-size: px2rem(12);
                    @include center;
            }
                 .slide-contents-search-input{
                     flex: 1;
                     width: 100%;
                     height: px2rem(32);
                     font-size: px2rem(14);
                     background: transparent;
                     border: none;
                     outline: none;
                 }
            }       
            .slide-contents-search-cancel{
                flex: 0 0 px2rem(50);
                font-size: px2rem(14);
                @include right;
            }
        }
        .slide-contents-book-wrapper{
            display: flex;
            width: 100%;
            height: px2rem(90);
            padding: px2rem(10) px2rem(15) px2rem(20) px2rem(15);
            box-sizing: border-box;
            .slide-contents-book-img-wrapper{
                flex: 0 0 px2rem(45);
                .slide-contents-book-img{
                    width: px2rem(45);
                    height: px2rem(60);
                }
            }
            .slide-contents-book-info-wrapper{
                flex: 1;
                padding: 0 px2rem(10);
                box-sizing: border-box;
                .slide-contents-book-title{
                    // 375*0.85=318.75-30=288.72-20=268.75-45=223.75-70=153.75
                    // width: px2rem(153.75);
                    font-size: px2rem(14);
                    line-height: px2rem(16);
                    @include left;
                    .slide-contents-book-title-text{
                        @include ellipsis2(3);
                    }
                }
                .slide-contents-book-author{
                    // width: px2rem(153.75);
                    font-size: px2rem(12);
                    line-height: px2rem(14);
                    margin: px2rem(5);
                    @include left;
                    .slide-contents-book-author-text {
                        @include ellipsis2(1);
                    }
                }
            }
            .slide-contents-book-progress-wrapper{
                flex: 0 0 px2rem(70);
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: flex-start;
                .slide-contents-book-progress{
                    .progress{
                        font-size: px2rem(14);
                    }
                    .progress-text{
                        font-size: px2rem(12);
                    }
                }
                .slide-contents-book-time{
                    margin-top: px2rem(5);
                    font-size: px2rem(12);
                }
            }
        }
        .slide-contents-list{
            padding: 0 px2rem(15);
            box-sizing: border-box;
            .slide-contents-item {
                display: flex;
                padding: px2rem(20) 0;
                box-sizing: border-box;
                .slide-contents-item-label{
                    flex: 1;
                    font-size: px2rem(14);
                    line-height: px2rem(16);
                    @include ellipsis;
                }
                .slide-contents-item-page{
                    flex: 0 0 px2rem(30);
                    font-size: px2rem(10);
                    @include right;
                }
            }
        }
        .slide-search-list{
            width: 100%;
            padding: 0 px2rem(15);
            box-sizing: border-box;
            .slide-search-item{
                font-size: px2rem(14);
                line-height: px2rem(16);
                padding: px2rem(20) 0;
                box-sizing: border-box;
            }
        }
    }
</style>
