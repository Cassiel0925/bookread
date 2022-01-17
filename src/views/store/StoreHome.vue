<template>
    <div class="store-home">
        <search-bar/>
        <!-- 随机推荐 -->
        <flap-card :random="random"/>
        <!-- 首页内容滚动区域 -->
        <scroll :top="scrollTop" @onScroll="onScroll" ref="scroll">
            <!-- banner区域 start -->
            <div class="banner-wrapper">
                <div class="banner-img" :style="{backgroundImage: `url('${banner}')`}"></div>
            </div>
            <!-- banner区域 end -->

            <!-- 猜你喜欢 start -->
            <guess-you-like :guessYouLike="guessYouLike"></guess-you-like>
            <!-- 猜你喜欢 end -->

            <!-- 热门推荐 -->
            <home-recommend :recommend="recommend"/>

            <!-- 精选 -->
            <features :features="features" class="features"/>

            <!-- 分类列表 -->
            <div class="category-list-wrapper" v-for="(item, index) in categoryList" :key="index">
                <category-list :categoryData="item"/>
            </div>

            <!-- 分类 -->
            <categories :categories="categories" class="category"/>

        </scroll>
    </div>
</template>
<script>
import Scroll from 'components/common/Scroll.vue'

import SearchBar from 'components/home/SearchBar.vue'
import FlapCard from 'components/home/FlapCard.vue'

import GuessYouLike from 'components/home/childComps/GuessYouLike.vue'
import HomeRecommend from 'components/home/childComps/HomeRecommend.vue'
import Features from 'components/home/childComps/Features.vue'
import CategoryList from 'components/home/childComps/CategoryList.vue'
import Categories from 'components/home/childComps/Categories.vue'

import { storeHomeMixin } from 'utils/mixin'
import { home } from 'api/store'
export default {
   name:'StoreHome',
   components: { 
       SearchBar,
       Scroll,
      FlapCard,
      GuessYouLike,
      HomeRecommend,
      Features,
      CategoryList,
      Categories
    },
    data () {
        return {
            scrollTop: 94,
            random: null,
            banner: null,
            guessYouLike: null,
            recommend: null,
            features: null,
            categoryList: null,
            categories: null
        }
    },
    mixins: [storeHomeMixin],
    methods: {
        onScroll(offsetY) {
            this.setOffsetY(offsetY)
            // 解决滚动内容部分 bottom 留白部分
            if(offsetY > 0) {
                this.scrollTop = 52
            } else {
                this.scrollTop = 94
            }
            this.$refs.scroll.refresh()
        }
    },
    mounted () {
        home().then(response => {
            if (response && response.status === 200) {
                const data = response.data
                console.log(data);
                // banner
                this.banner = data.banner
                // guessYouLike
                this.guessYouLike = data.guessYouLike
                // recommend
                this.recommend = data.recommend
                // features
                this.features = data.featured
                // categoryList
                this.categoryList = data.categoryList
                // categories
                this.categories = data.categories
                // 随机获取一本书
                const randomIndex = Math.floor(Math.random() * data.random.length)
                this.random = data.random[randomIndex]
            }
        })
    }

}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .store-home {
        width: 100%;
        height: 100%;
        .banner-wrapper {
            width: 100%;
            padding: px2rem(10);
            box-sizing: border-box;
            .banner-img {
                width: 100%;
                height: px2rem(150);
                // 适应屏幕的宽高
                background-repeat: no-repeat;
                background-size: 100% 100%;
            }
        }
        .features,
        .category-list-wrapper,
        .category {
            margin-top: px2rem(20);
        }
    }
</style>
