<template>
    <div class="bottom-bar">
        <div class="bottom-btn" @click.stop.prevent="readBook()">{{$t('detail.read')}}</div>
        <div class="bottom-btn" @click.stop.prevent="trialListening()">{{$t('detail.listen')}}</div>
        <div class="bottom-btn" @click.stop.prevent="addOrRemoveShelf()">{{inBookShelf ? $t('detail.isAddedToShelf') : $t('detail.addOrRemoveShelf')}}</div>
    </div>
</template>
<script>
export default {
   name:'BottomBar',
   props: {
       bookItem: Object,
       inBookShelf: Boolean
   },
   methods: {
       readBook() {
           this.$emit('readBook')
       },
       trialListening() {
           this.$emit('trialListening')
       },
       addOrRemoveShelf() {
           this.$emit('addOrRemoveShelf')
       }
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .bottom-bar {
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        height: px2rem(52);
        display: flex;
        box-shadow: 0 px2rem(-2) px2rem(2) rgba(0, 0, 0, .1);
        .bottom-btn {
            flex: 1;
            font-size: px2rem(14);
            font-weight: 700;
            color: rgb(74, 171, 255);
            @include center;
        }
    }
</style>
