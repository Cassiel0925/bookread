<template>
    <div class="guess-you-like-wrapper">
        <!-- 标题栏 -->
        <title-bar :leftItem="$t(`home.guessYouLike`)" 
                   :rightItem="$t(`home.change`)"
                   @onClick="change"></title-bar>
        <!-- 推荐列表 -->
        <div class="guess-you-like-list">
            <div class="guess-you-like-item" 
                 v-for="(item, index) in showData" 
                 :key="index"
                 @click="showBookDetail(item)">
                <!-- 封面图片 -->
                <div class="item-img">
                    <img :src="item.cover" alt="">
                </div>
                <!-- 书籍名称 作者 等其他信息 -->
                <div class="content-wrapper">
                    <div class="content-title title-big">{{item.title}}</div>
                    <div class="content-author sub-title">{{item.author}}</div>
                    <div class="result third-title">{{resultText(item)}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TitleBar from 'components/common/TitleBar.vue'
import {storeHomeMixin} from 'utils/mixin'
export default {
   name:'GuessYouLike',
   props: {
       guessYouLike: Array
   },
   components: {
       TitleBar
   },
   mixins: [storeHomeMixin],
   data () {
       return {
           index: 0,
           total: 0
       }
   },
   watch: {
       guessYouLike(v) {
           this.total = v.length / 3
       }
   },
   computed: {
       showData() {
           if(this.guessYouLike) {
                return [
                    this.guessYouLike[this.index],
                    this.guessYouLike[this.index + this.total],
                    this.guessYouLike[this.index + this.total * 2]
                ]
           } else {
               return []
           }
           
       },
   },
   methods: {
       resultText(item) {
           if(item && item.type && item.result) {
               switch (item.type) {
                    case 1:
                        return this.$t('home.sameAuthor').replace('$1', item.result)
                    case 2:
                        return this.$t('home.sameReader').replace('$1', item.result)
                    case 3:
                        return this.$t('home.readPercent').replace('$1', item.percent).replace('$2', item.result)
                }
           }
       },
       change() {
           if(this.index + 1 >= this.total) {
               this.index = 0
           } else {
               this.index++
           }
       }
   }
}
      
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .guess-you-like-wrapper {
        .guess-you-like-list {
            width: 100%;
            padding: 0 px2rem(10);
            box-sizing: border-box;
            .guess-you-like-item {
                margin-top: px2rem(15);
                display: flex;
                .item-img {
                    flex: 0 0 20%;
                    padding: px2rem(10) px2rem(10) px2rem(10) 0;
                    box-sizing: border-box;
                    img {
                        width: 100%;
                    }
                }
                .content-wrapper {
                    flex: 1;
                    padding: px2rem(10) 0;
                    .content-title {
                        font-size: px2rem(14);
                    }
                    .content-author {
                        margin-top: px2rem(15);
                    }
                    .result {
                        margin-top: px2rem(5);
                    }
                }
            }
        }
    }
</style>
