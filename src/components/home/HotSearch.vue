<template>
    <div>
        <!-- 标题部分 start -->
        <div class="hot-search-title">
            <span class="label">{{label}}</span>
            <span class="btn">{{btn}}</span>
        </div>
        <!-- 标题部分 end -->

        <!-- 列表部分 start -->
        <div class="hot-search-list">
            <div class="hot-search-item" v-for="(item, index) in hotSearch" :key="index"> 
                <!-- 小图标 -->
                <div class="icon-wrapper">
                    <span class="icon-book icon" v-if="item.type === 1"></span>
                    <span class="icon-search icon" v-if="item.type === 2"></span>
                </div>
                <!-- 列表文本 -->
                <div class="hot-search-text-wrapper">
                    <div class="text">{{item.text}}</div>
                    <div class="num" v-if="item.num">{{item.num}}人搜索</div>
                </div>
            </div>
        </div>
        <!-- 列表部分 end -->

    </div>
</template>
<script>
export default {
   name:'HotSearchList',
   props: {
       label: String,
       btn: String,
       hotSearch: Array
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .hot-search-title {
        display: flex;
        margin: px2rem(8);
        font-weight: bold;
        .label {
            flex: 1;
            text-align: left;
            font-size: px2rem(12);
        }
        .btn {
            flex: 1;
            text-align: right;
            font-size: px2rem(10);
            color: #468bdb;
        }
    }
    .hot-search-list{
        width: 100%;
        padding: 0 px2rem(10);
        box-sizing: border-box;
        .hot-search-item {
            padding: px2rem(10);
            display: flex;
            .icon-wrapper{
                flex: 0 0 px2rem(40);
                @include center;
            }
            .hot-search-text-wrapper{
                flex: 1;
                height: px2rem(35);
                @include columnLeft;
                .text {
                    font-size: px2rem(14);
                    font-weight: 700;
                }
                .num {
                    padding-top: px2rem(5);
                    font-size: px2rem(12);
                    color: #ccc;
                }
            }
        }
    }
</style>
