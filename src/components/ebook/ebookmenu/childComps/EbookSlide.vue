<template>
    <transition name="fade">
        <div class="slide-content-wrapper">
            <!-- 目录内容部分 -->
            <transition name="slide-right">
                <div class="content" v-show="settingVisible === 3">
                    <!-- 目录加载完显示此部分 -->
                    <div class="content-page-wrapper" v-if="bookAvailable">
                        <!-- 目录内容展示部分 -->
                        <div class="content-page">
                            <component :is="E_currentTab === 1 ? content : bookMark"></component>
                        </div>
                        <!-- 目录和书签切换 -->
                        <div class="content-page-tab">
                            <div class="content-page-tab-item" 
                                 :class="{'selected': E_currentTab === 1}"
                                 @click="selectTab(1)">{{$t('book.navigation')}}</div>
                            <div class="content-page-tab-item" 
                                 :class="{'selected': E_currentTab === 2}"
                                 @click="selectTab(2)">{{$t('book.bookmark')}}</div>
                        </div>
                    </div>
                    <!-- 目录未加载完显示的动画 -->
                    <div class="ebook-empty" v-else>
                        <ebook-loading/>
                    </div>
                </div>
            </transition>
            <!-- 目录背景部分 -->
            <div class="content-bg" @click="hide()"></div>
        </div>
    </transition>
</template>
<script>
import { ebookMixin } from 'utils/mixin'
import EbookSlideContents from './EbookSlideContents.vue'
import EbookLoading from './EbookLoading.vue'
import EbookSlideBookmark from './EbookSlideBookmark.vue'
export default {
   name:'EbookSlide',
   mixins: [ebookMixin],
   components: {
       EbookSlideContents,
      EbookLoading,
      EbookSlideBookmark
   },
   data () {
       return {
           E_currentTab: 1,
           content: EbookSlideContents,
           bookMark: EbookSlideBookmark
       }
   },
   watch: {
     currentTab(newVal, oldVal) {
         this.changeCurrentTab()
     }  
   },
   methods: {
       selectTab(tab) {
           this.E_currentTab = tab
           this.setCurrentTab(tab)
       },
       hide() {
           this.hideTitleAndMenu()
           this.selectTab(1)
       },
       changeCurrentTab() {
           this.E_currentTab = this.currentTab
       }
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .slide-content-wrapper{
        position: absolute;
        top: 0;
        left: 0;
        display: flex;
        z-index: 900;
        width: 100%;
        height: 100%;
        .content{
            flex: 0 0 85%;
            width: 85%;
            height: 100%;
            .content-page-wrapper{
                display: flex;
                flex-direction: column;
                width: 100%;
                height: 100%;
                .content-page{
                    flex: 1;
                    width: 100%;
                    overflow: hidden;
                }
                .content-page-tab{
                    flex: 0 0 px2rem(48);
                    width: 100%;
                    height: px2rem(48);
                    display: flex;
                    font-size: px2rem(16);
                    .content-page-tab-item {
                        flex: 1;
                        @include center;
                    }
                }
            }
            .ebook-empty{
                width: 100%;
                height: 100%;
                @include center;
            }
        }
        .content-bg{
            flex: 0 0 15%;
            width: 15%;
            height: 100%;
        }
    }
</style>
