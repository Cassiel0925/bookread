<template>
    <div class="shelf-list">
        <div class="shelf-list-item-wrapper"
             v-for="item in shelfList" :key="item.id">
            <shelf-item :data="item" :style="{height: itemHeight}"/>
            <div class="shelf-item-title-wrapper">
                <span class="title-text title-small">{{item.title}}</span>
            </div>
        </div>
    </div>
</template>
<script>
import ShelfItem from './ShelfItem.vue'
import {storeShelfMixin} from 'utils/mixin'
import {realPx} from 'utils/utils'
export default {
   name:'ShelfList',
   components: { 
       ShelfItem 
    },
    mixins: [storeShelfMixin],
    computed: {
        itemHeight() {
            // w /250 = h / 350
            // h = w / 250 * 350
            // 120 -> padding 部分 
            return ((window.innerWidth - realPx(120)) / 3) / 250 * 350 + 'px'
        }
    }

}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .shelf-list {
        position: absolute;
        top: px2rem(94);
        left: 0;
        z-index: 100;
        display: flex;
        flex-flow: row wrap;
        width: 100%;
        padding: 0 px2rem(15);
        box-sizing: border-box;
        .shelf-list-item-wrapper {
            flex: 0 0 33.33%;
            width: 33.33%;
            padding: px2rem(15);
            box-sizing: border-box;
            .shelf-item-title-wrapper {
                margin-top: px2rem(8);
            }
        }
    }
</style>
