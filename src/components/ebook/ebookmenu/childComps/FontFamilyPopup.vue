<template>
   <transition name="popup-slide-up">
      <div class="font-famliy-popup" v-show="fontFamilyVisible">
         <div class="popup-title-wrapper">
            <!-- 点击向下隐藏图标 -->
            <div class="popup-title-icon">
               <span class="icon-down2" @click="hide"></span>
            </div>
            <!-- 标题 -->
            <span class="popup-title-text">{{$t('book.selectFont')}}</span>
         </div>
         <!-- 字体选项 -->
         <div class="popup-item-list-wrapper" 
              v-for="(item, index) in fontFamily" 
              :key="index"
              @click="checkFontFamily(item.font)">
            <!-- 字体名称 -->
            <div class="item-text" :class="{'select': defaultFontFamily === item.font}">{{item.font}}</div> 
            <!-- 字体选择图标 -->
            <div class="item-check" v-show="defaultFontFamily === item.font"
                 :class="{'select': defaultFontFamily === item.font}">
               <span class="icon-check"></span>
            </div>
         </div>
      </div>
   </transition>
</template>
<script>
import { ebookMixin } from 'utils/mixin'
import { FONT_FAMILY } from 'utils/book'
import { saveFontFamily } from 'utils/localStorage'
export default {
   name:'FontFamilyPopup',
   mixins: [ebookMixin],
   data () {
      return {
         fontFamily: FONT_FAMILY
      }
   },
   methods: {
      hide() {
         this.setFontFamilyVisible(false)
      },
      checkFontFamily(font) {
         this.setDefaultFontFamily(font)
         saveFontFamily(this.fileName, font)
         if(font === 'Default') {
            this.currentBook.rendition.themes.font('Times New Roman')
         } else {
            this.currentBook.rendition.themes.font(font)
         }
      }
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
.font-famliy-popup {
   position: absolute;
   left: 0;
   bottom: 0;
   width: 100%;
   z-index: 300;
   background-color: #fff;
   box-shadow: 0 px2rem(-6) px2rem(3) rgba(0, 0 , 0, .3);
   .popup-title-wrapper{
      position: relative;
      padding: px2rem(15);
      box-sizing: border-box;
      border-bottom: px2rem(1) solid #b8b9bb;
      text-align: center;
      @include center;
      .popup-title-icon{
         font-size: px2rem(16);
         position: absolute;
         left: px2rem(15);
         top: 0;
         height: 100%;
         font-weight: 700;
         @include center;
      }
      .popup-title-text{
         font-size: px2rem(14);
         font-weight: 700;
      }
   }
   .popup-item-list-wrapper{
      font-size: px2rem(16);
      display: flex;
      box-sizing: border-box;
      padding: px2rem(8);
      .item-text{
         flex: 1;
         text-align: left;
         &.select {
            font-weight: 700;
            color: #346cb9;
         }
      }
      .item-check{
         flex: 1;
         text-align: right;
         &.select {
            font-weight: 700;
            color: #346cb9;
         }
      }

   }
}
</style>
