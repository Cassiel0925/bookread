<template>
    <div class="category-list">
        <title-bar :leftItem="categoryText(categoryData.category)" :rightItem="$t(`home.seeAll`)" @onClick="showBookCategory"/>
        <div class="list-wrapper">
            <div class="list-item" v-for="(item, index) in categoryData.list" :key="index" @click="showBookDetail(item)">
                <div class="img-wrapper">
                    <img :src="item.cover" alt="">
                </div>
                <div class="content-wrapper">
                    <div class="title title-small">{{item.title}}</div>
                    <div class="author sub-title-tiny">{{item.author}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TitleBar from '../../common/TitleBar.vue'
import {storeHomeMixin} from 'utils/mixin'
import { categoryText, getCategoryName } from 'utils/store'
export default {
   name:'CategoryList',
   components: {
       TitleBar
   },
   mixins: [storeHomeMixin],
   props: {
       categoryData: Object
   },
   methods: {
       categoryText(index) {
           return categoryText(index, this)
       },
       showBookCategory() {
           this.$router.push({
                path: '/store/list',
                query: {
                    category: getCategoryName(this.categoryData.category),
                    categoryText: this.categoryText(this.categoryData.category)
                }
            })
       }
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .category-list {
        .list-wrapper {
            width: 100%;
            @include top;
            // padding: px2rem(10) 0;
            // box-sizing: border-box;
            .list-item { 
                flex: 0 0 25%;
                width: 25%;
                padding: 0 px2rem(8);
                box-sizing: border-box;
                .img-wrapper {
                    @include center;
                    img {
                        width: 100%;
                    }
                }
                .content-wrapper {
                    width: 100%;
                    margin-top: px2rem(10);
                    .title {}
                    .author {
                        margin-top: px2rem(3);
                    }
                }
            }
        }
    }
</style>
