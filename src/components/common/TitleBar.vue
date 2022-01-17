<template>
    <div class="title-bar">
        <!-- 左边 -->
        <div class="title-left">{{leftItem}}</div>
        <!-- 右边 -->
        <div class="title-right" @click="click">{{rightItem}}</div>
    </div>
</template>
<script>
export default {
   name:'TitleBar',
   props: {
       leftItem: String,
       rightItem: String
   },
   methods: {
       click() {
           this.$emit('onClick')
       }
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .title-bar {
        width: 100%;
        padding: px2rem(15) px2rem(10);
        box-sizing: border-box;
        @include top;
        .title-left {
            flex: 1;
            font-size: px2rem(18);
            font-weight: 700;
            color: #333;
        }
        .title-right {
            font-size: px2rem(14);
            color: #67cdfe;
        }
    }
</style>
