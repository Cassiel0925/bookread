<template>
    <div class="features">
        <title-bar :leftItem="titleText" :rightItem="btnText" v-if="features && features.length > 0"/>
        <div class="features-list">
            <div class="features-item-wrapper">
                <div class="features-item" v-for="(item, index) in features" :key="index" @click="showBookDetail(item)">
                    <div class="img-wrapper">
                        <img :src="item.cover" alt="">
                    </div>
                    <div class="content-wrapper">
                        <div class="title title-small">{{item.title}}</div>
                        <div class="author sub-title-tiny">{{item.author}}</div>
                        <div class="category third-title-tiny">{{categoryText(item.category)}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import TitleBar from '../../common/TitleBar.vue'
import {storeHomeMixin} from 'utils/mixin'
import { categoryText } from 'utils/store'
export default {
   name:'Features',
   components: { 
       TitleBar 
    },
    mixins: [storeHomeMixin],
   props: {
       features: Array,
       titleText: {
           type: String,
           default: ''
       },
       btnText: {
           type: String,
           default: ''
       }
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
    .features {
        .features-list {
            width: 100%;
            padding: 0 px2rem(10);
            box-sizing: border-box;
            .features-item-wrapper {
                width: 100%;
                display: flex;
                flex-flow: row wrap;
                justify-content: flex-start;
                align-items: flex-start;
                .features-item {
                    flex: 0 0 50%;
                    width: 50%;
                    padding: px2rem(5) 0;
                    @include top;
                    .img-wrapper {
                        flex: 0 0 30%;
                        width: 30%;
                        img {
                            width: 100%;
                        }
                    }
                    .content-wrapper {
                        flex: 1;
                        padding: 0 px2rem(5);
                        box-sizing: border-box;
                        .title {
                        }
                        .author {
                            margin-top: px2rem(10);
                        }
                        .category {
                            margin-top: px2rem(5);
                        }
                    }
            }
            }
            
        }
    }
</style>
