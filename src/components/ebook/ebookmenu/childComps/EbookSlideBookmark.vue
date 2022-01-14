<template>
    <div class="ebook-slide-bookmark">
        <!-- 书签数量 -->
        <div class="slide-bookmark-title">{{$t('book.bookmark')}} · {{bookmark ? bookmark.length : 0}}</div>
        <!-- 书签内容 -->
        <scroll class="slide-bookmark-list" :top="48" :bottom="48">
            <div class="slide-bookmark-item" v-for="(item, index) in bookmark" :key="index" @click="displayBookmark(item.cfi)">
                <!-- 小图标 -->
                <div class="slide-bookmark-item-icon">
                    <div class="icon-bookmark"></div>
                </div>
                <!-- 书签内容部分展示 -->
                <div class="slide-bookmark-item-text">{{item.text}}</div>
            </div>
        </scroll>
    </div>
</template>
<script>
import Scroll from 'components/common/Scroll'
import { getBookmark } from 'utils/localStorage'
import { ebookMixin } from 'utils/mixin'
export default {
   name:'EbookSlideBookmark',
   components: {
       Scroll
   },
   mixins: [ebookMixin],
   data () {
       return {
           bookmark: null
       }
   },
   mounted () {
       this.bookmark = getBookmark(this.fileName)
   },
   methods: {
       displayBookmark(target) {
           this.display(target, () => {
               this.hideTitleAndMenu()
           })
           this.setCurrentTab(1)
           console.log(this.bookmark);
       }
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .ebook-slide-bookmark{
        width: 100%;
        height: 100%;
        .slide-bookmark-title{
            width: 100%;
            height: px2rem(48);
            font-size: px2rem(20);
            padding: px2rem(12);
            box-sizing: border-box;
        }
        .slide-bookmark-list {
            padding: 0 px2rem(15);
            box-sizing: border-box;
            .slide-bookmark-item{
                display: flex;
                padding: px2rem(15) 0;
                box-sizing: border-box;
                .slide-bookmark-item-icon{
                    flex: 0 0 px2rem(29);
                    @include left;
                    .icon-bookmark {
                        width: px2rem(20);
                        height: px2rem(20);
                        font-size: px2rem(12);
                        border-radius: 50%;
                        background: #bbb;
                        @include center;
                    }
                }
                .slide-bookmark-item-text{
                    font-size: px2rem(14);
                    line-height: px2rem(15);
                    max-height: pxp2rem(15);
                    @include ellipsis2(3);
                }
            }
        }
    }
</style>
