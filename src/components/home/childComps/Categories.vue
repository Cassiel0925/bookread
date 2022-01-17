<template>
    <div class="categories">
        <title-bar :leftItem="$t(`home.category`)" :rightItem="$t(`home.seeAll`)"/>
        <div class="categories-list">
            <div class="list-item" v-for="(item, index) in categories" :key="index">
                <div class="category-wrapper">
                    <div class="category-content">
                        <div class="category-name title-medium">{{categoryText(item.category)}}</div>
                        <div class="total-num sub-title-tiny">{{item.num + '' +$t(`home.books`)}}</div>
                    </div>
                    <div class="img-wrapper">
                        <div class="img-group">
                            <img class="img1" :src="item.img1">
                            <img class="img2" :src="item.img2">
                        </div>
                </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TitleBar from '../../common/TitleBar.vue'
import {categoryText} from 'utils/store'
export default {
   name:'Categories',
   components: {
       TitleBar
   },
   props: {
       categories: Array
   },
   methods: {
       categoryText(index) {
           return categoryText(index, this)
       }
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .categories {
        .categories-list {
            display: flex;
            flex-flow: row wrap;
            width: 100%;
            .list-item {
                flex: 0 0 50%;
                width: 50%;
                padding: 0 px2rem(5) px2rem(10) px2rem(5);
                box-sizing: border-box;
                &:nth-child(odd) {
                padding-left: px2rem(10);
                }
                &:nth-child(even) {
                padding-right: px2rem(10);
                }
                .category-wrapper {
                    display: flex;
                    width: 100%;
                    background: #eee;
                    .category-content {
                        flex: 0 0 50%;
                        width: 50%;
                        @include columnCenter;
                        .category-name {
                            text-align: center;
                        }
                        .total-num {
                            text-align: center;
                            margin-top: px2rem(5);
                        }
                    }
                    .img-wrapper {
                        flex: 0 0 50%;
                        width: 50%;
                        padding: px2rem(20) px2rem(10);
                        box-sizing: border-box;
                        .img-group {
                            position: relative;
                            width: 100%;
                            height: px2rem(60);
                            @include left;
                            .img1 {
                                position: absolute;
                                left: 0;
                                top: 0;
                                z-index: 100;
                                width: px2rem(45);
                                height: px2rem(60);
                            }
                            .img2 {
                                position: absolute;
                                left: px2rem(30);
                                top: px2rem(7.5);
                                z-index: 99;
                                width: px2rem(30);
                                height: px2rem(45);
                            }
                        }
                    }
                }
                
            }
            
        }
    }
</style>
