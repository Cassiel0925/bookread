<template>
   <transition name="fade">
      <div class="dialog" v-show="visible">
         <div class="dialog-wrapper">
            <!-- 标题 start -->
            <div class="dialog-title-wrapper">
               <span class="dialog-title-text">{{title}}</span>
            </div>
            <!-- 标题 end -->

            <!-- 插槽 -->
            <slot></slot>

            <!-- 按钮 start -->
            <div class="dialog-btn-wrapper">
              <slot name="btn">
                <div class="dialog-btn" @click="hide">{{$t('shelf.cancel')}}</div>
                <div class="dialog-btn">{{$t('shelf.confirm')}}</div>
              </slot>
            </div>
            <!-- 按钮 end -->

         </div>
      </div>
   </transition>
</template>
<script>
export default {
   name:'Dialog',
   props: {
      title: String,
   },
   data () {
      return {
         visible: true
      }
   },
   methods: {
      show() {
         this.visible = true
      },
      hide() {
         this.visible = false
      }
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
   .dialog {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 2600;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, .3);
      @include center;
      .dialog-wrapper {
         position: relative;
         display: flex;
         flex-direction: column;
         width: 60%;
         max-height: 80%;
         background: #fff;
         border-radius: px2rem(10);
         .dialog-title-wrapper {
            font-size: px2rem(20);
            font-weight: 700;
            padding: px2rem(30) 0 px2rem(20) 0;
            text-align: center;
            .dialog-title-text {}
         }
         .dialog-btn-wrapper {
            display: flex;
            width: 100%;
            font-size: px2rem(14);
            font-weight: 700;
            color: #fff;
            background: rgb(74, 171, 255);
            text-align: center;
            padding: px2rem(15) 0;
            box-sizing: border-box;
            border-radius: 0 0 px2rem(10) px2rem(10);
            .dialog-btn {
               flex: 1;
            }
         }
      }
   }
</style>

