<template>
    <div class="home-recommend">
        <title-bar :leftItem="$t(`home.recommend`)" :rightItem="$t(`home.seeAll`)" />

        <div class="recommend-list">
            <div class="list-item" v-for="(item, index) in recommend" :key="index" @click="showBookDetail(item)">
                <div class="img-wrapper">
                    <img :src="item.cover" alt="">
                </div>
                <div class="content-wrapper">
                    <div class="title title-medium">{{item.title}}</div>
                    <div class="readerNum sub-title">{{readersText(item)}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TitleBar from '../../common/TitleBar.vue'
import {storeHomeMixin} from 'utils/mixin'
export default {
   name:'HomeRecommend',
   props: {
       recommend: Array
   },
   mixins: [storeHomeMixin],
   components: {
       TitleBar
   },
   methods: {
       readersText(item) {
           return this.$t(`home.readers`).replace('$1', item.readers)
       }
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .home-recommend {
        .recommend-list {
            @include top;
            width: 100%;
            padding: 0 px2rem(5);
            box-sizing: border-box;
            .list-item {
                flex: 0 0 33.33%;
                width: 33.33%;
                padding: 0 px2rem(5);
                box-sizing: border-box;
                .img-wrapper {
                    @include center;
                    img {
                        width: 80%;
                    }
                }
                .content-wrapper {
                    width: 100%;
                    margin-top: px2rem(10);
                    @include columnCenter;
                  .title {
                      text-align: center;
                  }
                  .readerNum {
                      margin-top: px2rem(5);
                  }  
                }
            }
        }
    }
</style>
