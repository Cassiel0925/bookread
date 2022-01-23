<template>
    <div class="store-category">
        <!-- 标题导航部分 start -->
        <shelf-title :title="shelfCategory.title"/>
        <!-- 标题导航部分 end -->
        
        <!-- 书籍列表部分 start -->
        <scroll class="store-shelf-scroll-wrapper" 
                :top="0"
                :bottom="scrollBottom"
                @onScroll="onScroll"
                ref="scroll"
                v-if="isShowList">
            <shelf-list :top="42" :data="shelfCategory.itemList"/>
        </scroll>
        <!-- 分类列表为空的时候 -->
        <div v-else>
            <div class="store-shelf-empty-view">{{$t('shelf.groupNone')}}</div>
        </div>
        <!-- 书籍列表部分 end -->

        <!-- 底部导航部分 start -->
        <shelf-footer/>
        <!-- 底部导航部分 end -->

    </div>
</template>
<script>
import Scroll from 'components/common/Scroll.vue'
import ShelfFooter from 'components/shelf/ShelfFooter.vue'
import ShelfList from 'components/shelf/ShelfList.vue'
import ShelfTitle from 'components/shelf/ShelfTitle.vue'
import {storeShelfMixin} from 'utils/mixin'
export default {
   name:'StoreCategory',
   components: { 
       ShelfTitle,
      Scroll,
      ShelfList,
      ShelfFooter, 
    },
    mixins: [storeShelfMixin],
    watch: {
        isEditMode(isEditMode) {
            this.scrollBottom = isEditMode ? 48 : 0
            this.$nextTick(() => {
                this.$refs.scroll.refresh()
            })
        }
    },
    data () {
        return {
            scrollBottom: 0
        }
    },
    computed: {
        isShowList() {
            return this.shelfCategory.itemList && this.shelfCategory.itemList.length > 0
        }
    },
    methods: {
        onScroll(offsetY) {
            this.setOffsetY(offsetY)
        }
    },
    mounted () {
        // 获取分类列表数据
        this.getCategoryList(this.$route.query.title)
        this.setCurrentType(2)
    }

}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "assets/styles/global";
    .store-category {
        position: relative;
        z-index: 100;
        width: 100%;
        height: 100%;
        background: #fff;
        .store-shelf-scroll-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 101;
        }
        .store-shelf-empty-view {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            font-size: px2rem(14);
            color: #333;
            @include center;
        }
    }
</style>
