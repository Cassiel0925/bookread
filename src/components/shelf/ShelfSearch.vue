<template>
    <div class="shelf-search-wrapper" :class="{'search-top': isInputClicked ,'hide-shadow': isHideShadow}">
        <!-- 搜索栏区域 -->
        <div class="shelf-search" :class="{'search-top': isInputClicked}">
            <!-- 搜索 start -->
            <div class="search-wrapper">
                <div class="search-icon-wrapper">
                    <span class="icon-search icon"></span>
                </div>
                <div class="search-input-wrapper">
                    <input class="search-input" 
                           type="text"
                           :placeholder="$t(`shelf.search`)"
                           @click="onSearchClick"
                           v-model="searchText">
                </div>
                <div class="icon-clear-wrapper" 
                     v-show="searchText.length > 0"
                     @click="clearSearchText">
                    <span class="icon-close-circle-fill"></span>
                </div>
            </div>
            <!-- 搜索 end -->

            <!-- 中英文切换 start -->
            <div class="icon-locale-wrapper" v-if="!isInputClicked" @click="switchLacale">
                <span class="icon-cn icon" v-if="lang === 'cn'"></span>
                <span class="icon-en icon" v-else></span>
            </div>
            <!-- 中英文切换 end -->

            <!-- 取消 start -->
            <div class="cancel-btn-wrapper" v-else @click="onCancelClick">
                <span class="cancel-text">{{$t(`shelf.cancel`)}}</span>
            </div>
            <!-- 取消 end -->

        </div>
        <transition name="hot-search-move">
            <!-- 导航栏区域 -->
            <div class="shelf-search-tab-wrapper" v-show="isInputClicked">
                <div class="shelf-search-tab-item" 
                    v-for="item in tab" 
                    :key="item.id"
                    @click="onTabClick(item.id)">
                    <span class="shelf-search-tab-text" :class="{'is-selected': item.id === selectedTab}">{{item.text}}</span>
                </div>
            </div>
        </transition>
    </div>
</template>
<script>
import {storeShelfMixin} from 'utils/mixin'
import {setLocalStorage} from 'utils/localStorage'
export default {
   name:'ShelfSearch',
   mixins: [storeShelfMixin],
   data () {
       return {
           isInputClicked: false,
           searchText: '',
           selectedTab: 1,
           isHideShadow: true
       }
   },
   watch: {
       offsetY(v) {
           if(v > 0 && this.isInputClicked) {
               this.isHideShadow = false
           } else {
               this.isHideShadow = true
           }
       }
   },
   computed: {
       lang() {
           return this.$i18n.locale
       },
       // tab 数组
       tab() {
           return [
               {
                   id: 1,
                   text: this.$t(`shelf.default`)
               },
               {
                   id: 2,
                   text: this.$t(`shelf.progress`)
               },
               {
                   id: 3,
                   text: this.$t(`shelf.purchase`)
               }
           ]
       }
   },
   methods: {
       // 点击 input 
       onSearchClick() {
           this.isInputClicked = true
           this.setShelfTitleVisible(false)
       },
       // 点击取消
       onCancelClick() {
           this.isInputClicked = false
           this.setShelfTitleVisible(true)
       },
       // 切换语言方式
       switchLacale() {
           if(this.lang === 'en') {
               this.$i18n.locale = 'cn'
           } else {
               this.$i18n.locale = 'en'
           }
           setLocalStorage('locale', this.$i18n.locale)
       },
       // 清除输入框的内容
       clearSearchText() {
           this.searchText = ''
       },
       // 点击切换
       onTabClick(id) {
           this.selectedTab = id
       }
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .shelf-search-wrapper {
        position: relative;
        z-index: 105;
        width: 100%;
        height: px2rem(94);
        background: #fff;
        box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
        &.search-top {
            position: fixed;
            top: 0;
            left: 0;
        }
        &.hide-shadow {
            box-shadow: none;
        }
        .shelf-search {
            position: absolute;
            z-index: 105;
            top: px2rem(42);
            left: 0;
            width: 100%;
            height: px2rem(52);
            display: flex;
            background: #fff;
            transition: top .2s linear;
            &.search-top {
                top: 0;
            }
            .search-wrapper {
                flex: 1;
                display: flex;
                margin: px2rem(8) 0 px2rem(8) px2rem(10);
                border: px2rem(1) solid #ccc;
                border-radius: px2rem(3);
                .search-icon-wrapper {
                    flex: 0 0 px2rem(22);
                    @include right;
                    .icon-search {
                        font-size: px2rem(12);
                    }
                }
                .search-input-wrapper {
                    flex: 1;
                    padding: 0 px2rem(10);
                    box-sizing: border-box;
                    @include center;
                    .search-input {
                        width: 100%;
                        font-size: px2rem(14);
                        color: #333;
                        border: none;
                        outline: none;
                        &::-webkit-input-placeholder {
                            font-size: px2rem(14);
                            color: #ccc;
                        }
                    }
                }
                .icon-clear-wrapper  {
                    flex: 0 0 px2rem(24);
                    @include left;
                    .icon-close-circle-fill {
                        font-size: px2rem(14);
                        color: #999;
                    }
                }
            }
            .icon-locale-wrapper {
                flex: 0 0 px2rem(55);
                @include center;
                .icon-en, .icon-cn {
                    font-size: px2rem(20);
                    color: #666;
                }
            }
            .cancel-btn-wrapper {
                flex: 0 0 px2rem(55);
                @include center;
                .cancel-text {
                    font-size: px2rem(14);
                    color: rgb(74, 171, 255);
                }
            }
        }
        .shelf-search-tab-wrapper {
            position: absolute;
            top: px2rem(52);
            left: 0;
            width: 100%;
            height: px2rem(42);
            background: #fff;
            display: flex;
            .shelf-search-tab-item {
                font-size: px2rem(12);
                flex: 1;
                @include center;
                .shelf-search-tab-text {
                    color: #999;
                    &.is-selected {
                        color: rgb(74, 171, 255);
                        font-weight: 700;
                    }
                }
            }
        }
    }
</style>
