<template>
    <div class="store-shelf">
        <shelf-title :title="$t('shelf.title')"/>
        <scroll class="store-shelf-scroll-wrapper"
                :top="0"
                :bottom="scrollBottom"
                @onScroll="onScroll"
                ref="scroll">
            <shelf-search/>
            <shelf-list :data="shelfList"/>
        </scroll>
        <shelf-footer/>
    </div>
</template>
<script>
import ShelfTitle from 'components/shelf/ShelfTitle.vue'
import Scroll from 'components/common/Scroll.vue'
import ShelfSearch from 'components/shelf/ShelfSearch.vue'
import ShelfList from 'components/shelf/ShelfList.vue'
import ShelfFooter from 'components/shelf/ShelfFooter.vue'

import {storeShelfMixin} from 'utils/mixin'

export default {
   name:'StoreShelf',
   components: { 
       ShelfTitle,
       Scroll,
       ShelfSearch,
       ShelfList,
       ShelfFooter 
    },
    data () {
        return {
            scrollBottom: 0
        }
    },
    watch: {
        isEditMode(isEditMode) {
            this.scrollBottom = isEditMode ? 48 : 0
            this.$nextTick(() => {
                this.$refs.scroll.refresh()
            })
        }
    },
    mixins: [storeShelfMixin],
    methods: {
        
        onScroll(offsetY) {
            this.setOffsetY(offsetY)
        }
    },
    mounted () {
        this.getShelfList()
        this.setShelfCategory([])
        this.setCurrentType(1)
    }

}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .store-shelf {
        width: 100%;
        height: 100%;
        background: #fff;
        .store-shelf-scroll-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 105;
            background: #fff;
        }
    }
</style>
