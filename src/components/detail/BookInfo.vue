<template>
    <div class="book-info">
        <div class="img-wrapper">
            <img :src="cover" alt="">
        </div>
        <div class="content-wrapper">
            <div class="title">{{title}}</div>
            <div class="author">{{author}}</div>
            <div class="des">{{des}}</div>
        </div>
    </div>
</template>
<script>
export default {
   name:'BookInfo',
   props: {
       cover: String,
       title: String,
       author: String,
       des: String
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .book-info {
        display: flex;
        width: 100%;
        padding: px2rem(15) 0 px2rem(10) px2rem(15);
        box-sizing: border-box;
        border-bottom: px2rem(1) solid #eee;
        .img-wrapper {
            flex: 0 0 30%;
            width: 30%;
            padding-right: px2rem(10);
            box-sizing: border-box;
            img {
                width: 100%;
            }
        }
        .content-wrapper {
            flex: 1;
            padding-left: px2rem(15);
            box-sizing: border-box;
            .title {
                font-size: px2rem(24);
                line-height: px2rem(26);
                color: #333;
            }
            .author {
                margin-top: px2rem(8);
                font-size: px2rem(14);
                line-height: px2rem(16);
                color: rgb(74, 171, 255);
            }
            .des {
                margin-top: px2rem(8);
                font-size: px2rem(14);
                line-height: px2rem(16);
                color: #999;
            }
        }
    }
</style>
