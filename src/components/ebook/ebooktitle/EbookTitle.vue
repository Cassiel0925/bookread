<template>
    <transition name="slide-down">
        <div class="tab-bar" v-show="menuVisible">
            <div class="left">
                <span class="icon-back" @click="backClick"></span>
            </div>
            <div class="right">
                <div class="icon-wrapper">
                    <span class="icon-shelf"></span>
                </div>
                <div class="icon-wrapper">
                    <span class="icon-cart"></span>
                </div>
                <div class="icon-wrapper">
                    <span class="icon-more"></span>
                </div>
            </div>
        </div>
    </transition>
</template>
<script>
import { ebookMixin } from 'utils/mixin'
export default {
   name:'EbookTitle',
   mixins: [ebookMixin],
   methods: {
       backClick() {
           this.$router.go(-1)
       }
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
.tab-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: px2rem(45);
    z-index: 100;
    background-color: #fff;
    box-shadow: 0 px2rem(8) px2rem(5) rgba(100,100,100,.3);
    display: flex;
    font-size: px2rem(22);
    .left {
        flex: 0 0 px2rem(60);
        @include center;
    }
    .right {
        flex: 1;
        justify-content: flex-end;
        display: flex;
        .icon-wrapper {
            flex: 0 0 px2rem(40);
            @include center;
        }
    }
}
</style>
