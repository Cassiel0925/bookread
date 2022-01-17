<template>
    <div class="catalog">
        <div class="title-wrapper">
            <div class="title">{{$t(`detail.navigation`)}}</div>
        </div>
        <div class="content-wrapper">
            <div class="loading-text-wrapper" v-if="!navigation">
                <span class="loading-text">{{$t(`detail.loading`)}}</span>
            </div>
            <div class="content-item-wrapper">
                <div class="content-item" 
                     v-for="(item, index) in flatNavigation" 
                     :key="index">
                     <div class="content-item-text"
                          :class="{'is-sub': item.deep > 1}"
                          :style="itemStyle(item)"
                          v-if="item.label">{{item.label}}</div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {px2rem} from 'utils/utils'
export default {
   name:'Catalog',
   props: {
       flatNavigation: Array,
       navigation: Object
   },
   methods: {
       // 电子书目录缩进样式
      itemStyle(item) {
        return {
          marginLeft: (item.deep - 1) * px2rem(20) + 'rem'
        }
      },
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .catalog {
        width: 100%;
        padding: px2rem(20) 0 px2rem(15) px2rem(15);
        box-sizing: border-box;
        border-bottom: px2rem(1) solid #ccc;
        .title-wrapper {
            margin-bottom: px2rem(20);
            .title {
                font-size: px2rem(20);
                color: #333;
            }
        }
        .content-wrapper {
            .loading-text-wrapper {
                .loading-text {
                    font-size: px2rem(14);
                    color: #333;
                }
            }
            .content-item-wrapper {
                .content-item {
                    padding: px2rem(15) 0;
                    box-sizing: border-box;
                    font-size: px2rem(14);
                    line-height: px2rem(16);
                    color: #666;
                    border-bottom: px2rem(1) solid #eee;
                    .content-item-text {
                        width: 100%;
                        @include ellipsis;
                        &.is-sub {
                            color: #666;
                        }
                    }
                }
            }
        }
    }
</style>
