<template>
    <div class="detail-title" :class="{'hide-shadow': ifHideShadow}">
        <div class="title-left" @click="back">
            <span class="icon-back icon"></span>
        </div>
        <div class="title-text" v-if="title">{{title}}</div>
        <div class="title-right ">
            <span class="icon-shelf icon"></span>
        </div>
    </div>
</template>
<script>
export default {
   name:'DetailTitle',
   props: {
       title: String
   },
   data () {
       return {
           ifHideShadow: true
       }
   },
   methods: {
       back() {
           this.$emit('back')
       },
       hideShadow() {
           this.ifHideShadow = true
       },
       showShadow() {
           this.ifHideShadow = false
       }
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .detail-title {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: px2rem(42);
        display: flex;
        padding: 0 px2rem(10);
        box-sizing: border-box;
        box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
        &.hide-shadow {
            box-shadow: none;
        }
        .title-left {
            flex: 1;
            @include left;
        }
        .title-right {
            flex: 1;
            @include right;
        }
        .title-text {
            flex: 1;
            font-size: px2rem(16);
            @include center;
        }
    }
</style>
