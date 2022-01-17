<template>
    <div>
        <div class="search-bar" :class="{'hide-shadow': !shadowVisible}">
            <!-- 标题 start -->
            <transition name="title-move">
                <div class="search-bar-title-wrapper" v-show="titleVisible">
                    <!-- 标题文本 国际化-->
                    <div class="title-text-wrapper">
                        <span class="titlt-text title">{{$t('home.title')}}</span>
                    </div>
                    <!-- 摇一摇随机图标 -->
                    <div class="title-icon-shake-wrapper"  @click="showFlapCard">
                        <span class="icon-shake icon"></span>
                    </div>
                </div>
            </transition>
            <!-- 标题 end -->

            <!-- 返回按钮 -->
            <div class="title-icon-back-wrapper" 
                 :class="{'hide-title': !titleVisible}"
                 @click="back()">
                <span class="icon-back icon"></span>
            </div>

            <!-- 搜索 start -->
            <div class="search-bar-input-wrapper">
                <!-- 占位用的dom -->
                <div class="search-bar-blank" :class="{'hide-title': !titleVisible}"></div>
                <div class="search-bar-input">
                    <!-- 搜索小图标 -->
                    <span class="icon-search icon"></span>
                    
                    <!-- 搜索框 -->
                    <input class="input" 
                        type="text" 
                        :placeholder="$t('home.hint')"
                        v-model="searchText"
                        @click="showHotSearch()">
                </div>
            </div>
            <!-- 搜索 end -->
        </div>

        <!-- 搜索列表 -->
        <hot-search-list v-show="hotSearchVisible" ref="hotSearch"/>

        
    </div>
</template>
<script>
import {storeHomeMixin} from 'utils/mixin'
import HotSearchList from './HotSearchList.vue'
export default {
   name:'SearchBar',
   components: {
       HotSearchList,
   },
   data () {
        return {
           searchText: '',
           titleVisible: true,
           shadowVisible: false,
           hotSearchVisible: false
       }
   },
   mixins: [storeHomeMixin],
   watch: {
       offsetY(offsetY){
           if(offsetY > 0 ) {
               this.hideTitle()
               this.showShadow()
           } else {
               this.showTitle()
               this.hideShadow()
           }
       },
       hotSearchOffsetY(offsetY) {
           if (offsetY > 0) {
               this.showShadow()
           } else {
               this.hideShadow()
           }
       }
   },
   methods: {
       hideTitle() {
           this.titleVisible = false
       },
        showTitle() {
            this.titleVisible = true
        },
        hideShadow() {
           this.shadowVisible = false
       },
        showShadow() {
            this.shadowVisible = true
        },
        showHotSearch() {
            this.hideTitle()
            this.hideShadow()
            this.hotSearchVisible = true
        },
        hideHotSearch() {
            this.hotSearchVisible = false
            this.$refs.hotSearch.reset()
            if(this.offsetY > 0) {
                this.hideTitle()
                this.showShadow()
            } else {
                this.showTitle()
                this.hideShadow()
            }
        },
        back() {
            if (this.offsetY > 0) {
                this.showShadow()
            } else {
                this.hideShadow()
            }
            this.hideHotSearch()
        },
        // 显示卡片
        showFlapCard() {
            this.setFlapCardVisible(true)
        }
        
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .search-bar {
        position: relative;
        width: 100%;
        box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
        &.hide-shadow {
            box-shadow: none;
        }
        .search-bar-title-wrapper {
            position: relative;
            top: 0;
            left: 0;
            height: px2rem(42);
            width: 100%;
            padding: px2rem(10);
            box-sizing: border-box;
            display: flex;
            .title-text-wrapper {
                flex: 1;
                @include center;
            }
            .title-icon-shake-wrapper {
                flex: 0 0 px2rem(35);
                width: px2rem(35);
                @include right;
            }
        }
        .title-icon-back-wrapper{
            position: absolute;
            top: px2rem(12);
            left: px2rem(12);
            @include center;
            transition: height $animationTime $animationType;
            &.hide-title {
                top: px2rem(16);
            }
        }
        .search-bar-input-wrapper {
            width: 100%;
            height: px2rem(52);
            display: flex;
            padding: 0 px2rem(15);
            box-sizing: border-box;
            transition: top $animationTime $animationType;
            @include center;
            .search-bar-blank {
                flex: 0 0 0;
                width: 0;
                transition: all $animationTime $animationType;
                &.hide-title {
                    flex: 0 0 px2rem(31);
                    width: px2rem(31);
                }
            }
            .search-bar-input {
                width: 100%;
                background: #f4f4f4;
                border-radius: px2rem(20);
                padding: px2rem(5) px2rem(10);
                box-sizing: border-box;
                border: px2rem(1) solid #eee; 
                @include left;
                .icon-search {
                    color: #999;
                }
                .input {
                    width: 100%;
                    height: px2rem(22);
                    border: none;
                    outline: none;
                    background: transparent;
                    margin-left: px2rem(10);
                    font-size: px2rem(12);
                    color: #666;
                    &::-webkit-input-placeholder {
                        color: #ccc;
                    }
                }
            }
        }
            
    }
</style>
