<template>
    <transition name="fade">
        <div class="shelf-title" v-show="shelfTitleVisible" :class="{'hide-shadow': isHideShadow}">

            <div class="shelf-title-text-wrapper">
                <span class="shelf-title-text">{{$t(`shelf.title`)}}</span>
                <span class="shelf-sub-title-text" v-show="isEditMode">{{selectedText}}</span>
            </div>

            <div class="shelf-title-btn-wrapper shelf-left">
                <span class="shelf-title-btn-text" @click="clearCache">{{$t(`shelf.clearCache`)}}</span>
            </div>

            <div class="shelf-title-btn-wrapper shelf-right">
                <span class="shelf-title-btn-text" @click="onEditClick">{{isEditMode ? $t(`shelf.cancel`) : $t(`shelf.edit`)}}</span>
            </div>
        </div>
    </transition>
</template>
<script>
import {storeShelfMixin} from 'utils/mixin'
import {clearLocalStorage} from 'utils/localStorage'
import {clearLocalForage} from 'utils/localForage'
export default {
   name:'ShelfTitle',
   mixins: [storeShelfMixin],
   data () {
       return {
           isHideShadow: true
       }
   },
   watch: {
       offsetY(v) {
           if(v > 0) {
               this.isHideShadow = false
           } else {
               this.isHideShadow = true
           }
       }
   },
   computed: {
       selectedText() {
           const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0
           if (selectedNumber <= 0) {
               return this.$t(`shelf.selectBook`)
           } else if (selectedNumber === 1) {
               return this.$t(`shelf.haveSelectedBook`).replace('$1', selectedNumber)
           } else {
               return this.$t(`shelf.haveSelectedBooks`).replace('$1', selectedNumber)
           }
       }
   },
   methods: {
       // 1. 编辑和取消模式的切换
       onEditClick() {
           // 点击取消 选中列表清空 选中状态全部置为flase
           if(!this.isEditMode) {
               this.setShelfSelected([])
               this.shelfList.forEach(item => item.selected = false)
           }
           this.setIsEditMode(!this.isEditMode)
       },

       // 2. 清除缓存
       clearCache() {
           clearLocalStorage()
           clearLocalForage()
           this.setShelfList([])
           this.setShelfSelected([])
           this.getShelfList()
           this.simpleToast(this.$t('shelf.clearCacheSuccess'))
       }
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .shelf-title {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: px2rem(42);
        z-index: 115;
        background: #fff;
        box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
        &.hide-shadow {
            box-shadow: none;
        }
        .shelf-title-text-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: px2rem(42);
            @include columnCenter;
            .shelf-title-text {
                font-size: px2rem(16);
                line-height: px2rem(20);
                font-weight: 700;
                color: #333;
            }
            .shelf-sub-title-text {
                font-size: px2rem(10);
                color: #333;
            }
        }
        .shelf-title-btn-wrapper {
            position: absolute;
            top: 0;
            box-sizing: border-box;
            height: 100%;
            @include center;
            .shelf-title-btn-text {
                font-size: px2rem(14);
                color: #666;
            }
            &.shelf-left {
                left: 0;
                padding-left: px2rem(10);
            }
            &.shelf-right {
                right: 0;
                padding-right: px2rem(10);
            }
        }
    }
</style>
