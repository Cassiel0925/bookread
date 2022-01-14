<template>
    <div class="ebook-bookmark" ref="bookmark">
        <div class="ebook-bookmark-text-wrapper">
            <div class="ebook-bookmark-down-wrapper" ref="iconDown">
                <!-- 下拉小图标 -->
                <span class="icon-down" ></span>
            </div>
            <div class="ebook-bookmark-text">{{text}}</div>
        </div>
        <!-- 书签图标 -->
        <div class="ebook-bookmark-icon-wrapper"
             :style="isFixed ? fixedStyle : {}">
            <bookmark :color="color" :width="15" :height="35"/>
        </div>
    </div>
</template>
<script>
import { realPx } from 'utils/utils'
import { ebookMixin } from 'utils/mixin'
import Bookmark from 'components/common/Bookmark.vue'
import {getBookmark, saveBookmark} from 'utils/localStorage'

const BLUE = '#346cbc'
const WHITE = '#fff'
export default {
   name:'EbookBookmark',
   components: { 
       Bookmark 
    },
    mixins: [ebookMixin],
    data () {
       return {
           text: this.$t('book.pulldownAddMark'),
           color: WHITE,
           isFixed: false
       }
   },
   computed: {
     height() {
         return realPx(35)
     },
    //  零界值
    threshold() {
        return realPx(55)
    },
    fixedStyle() {
        return {
            position: 'fixed',
            top: 0,
            // right: `${(window.innerWidth - this.$refs.bookmask.clientWidth) / 2}px`
            right: 0
        }
    }  
   },
    watch: {
       offsetY(v) {
           if(!this.bookAvailable || this.menuVisible || this.settingVisible >=0) {
               return 
           }
           if(v >= this.height && v < this.threshold){
               this.beforeThreshold(v)
           } else if( v >= this.threshold) {
               this.afterThreshold(v)
           } else if(v > 0 && v < this.height){
               this.beforeHeight()
           } else if(v === 0) {
               this.restore()
           }
       },
       isBookmark(isBookmark) {
           this.isFixed = isBookmark
           if(isBookmark) {
               this.color = BLUE
           } else {
               this.color = WHITE
           }
       }
   },
   methods: {
        // 状态1：
        beforeHeight() {
            // 判断是否有书签，确定下拉的动作是删除书签还是创造书签
            if(this.isBookmark) {
                this.text = this.$t('book.pulldownDeleteMark')
                this.color = BLUE
                this.isFixed = true
            } else {
                this.text = this.$t('book.pulldownAddMark')
                this.color = WHITE
                this.isFixed = false
            }
        },
        // 状态2：未达到零界状态    
       beforeThreshold(v) {
            this.$refs.bookmark.style.top = `${-v}px`
            // 判断是否有书签，确定下拉的动作是删除书签还是创造书签
            if(this.isBookmark) {
                this.text = this.$t('book.pulldownDeleteMark')
                this.color = BLUE
                this.isFixed = true
            } else {
                this.text = this.$t('book.pulldownAddMark')
                this.color = WHITE
                this.isFixed = false
            }
            const iconDown = this.$refs.iconDown
            if(iconDown.style.transform === 'rotate(180deg)') {
                iconDown.style.transform = 'rotate(0deg)'
            }
       },
        // 状态3： 超越零界状态
       afterThreshold(v) {
            this.$refs.bookmark.style.top = `${-v}px`
            if(this.isBookmark) {
                this.text = this.$t('book.releaseDeleteMark')
                this.color = WHITE
                this.isFixed = false
            } else {
                this.text = this.$t('book.releaseAddMark')
                this.color = BLUE
                this.isFixed = true
            }
            
            const iconDown = this.$refs.iconDown
            if(iconDown.style.transform === '' || iconDown.style.transform === 'rotate(0deg)') {
                iconDown.style.transform = 'rotate(180deg)'
            }
       },
        // 状态4： 归位
        restore() {
            setTimeout(() => {
                this.$refs.bookmark.style.top = `${-this.height}px`
                this.$refs.iconDown.style.transform = 'rotate(0deg)'
            }, 200)
            if(this.isFixed) {
                this.setIsBookmark(true)
                this.addBookmark()
            } else {
                this.setIsBookmark(false)
                this.removeBookmark()
            }
        },
        // 添加书签
        addBookmark() {
            this.bookmark = getBookmark(this.fileName)
            if(!this.bookmark) {
                this.bookmark = []
            }
            const currentLocation = this.currentBook.rendition.currentLocation()
            const cfibase = currentLocation.start.cfi.replace(/!,*/, '')
            const cfistart = currentLocation.start.cfi.replace(/.*!/, '').replace(/\)$/, '')
            const cfiend = currentLocation.end.cfi.replace(/.*!/, '').replace(/\)$/, '')
            const cfirange = `${cfibase}!,${cfistart},${cfiend})`
            this.currentBook.getRange(cfirange).then(range => {
                const text = range.toString().replace(/\s\s/g, '')
                this.bookmark.push({
                    cfi: currentLocation.start.cfi,
                    text: text
                })
                saveBookmark(this.fileName, this.bookmark)
            })
        },
        // 移除书签 
        removeBookmark() {
            const currentLocation = this.currentBook.rendition.currentLocation()
            const cfi = currentLocation.start.cfi
            this.bookmark = getBookmark(this.fileName)
            if(this.bookmark) {
                this.bookmark = this.bookmark.filter(item => item.cfi != cfi)
                saveBookmark(this.fileName, this.bookmark)
                this.setIsBookmark(false)
            }
        },
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .ebook-bookmark {
        position: absolute;
        top: px2rem(-35);
        left: 0;
        z-index: 50;
        width: 100%;
        height: px2rem(35);
        .ebook-bookmark-text-wrapper{
            position: absolute;
            right: px2rem(45);
            bottom: 0;
            display: flex;
            .ebook-bookmark-down-wrapper{
                font-size: px2rem(14);
                color: #fff;
                transition: all .2s linear;
                @include center;
            }
            .ebook-bookmark-text{
                font-size: px2rem(14);
                color: #fff;
            }
        }
        .ebook-bookmark-icon-wrapper{
            position: absolute;
            right: 0;
            bottom: 0;
            margin-right: px2rem(15);
        }
    }
</style>
