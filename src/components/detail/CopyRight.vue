<template>
    <div class="copy-right">
        <div class="title-wrapper">
            <div class="title">{{$t(`detail.copyright`)}}</div>
        </div>
        <div class="content-wrapper">
            <div class="content-row">
                <div class="content-label">{{$t(`detail.publisher`)}}</div>
                <div class="content-text">{{publisher}}</div>
            </div>
            <div class="content-row">
                <div class="content-label">{{$t(`detail.category`)}}</div>
                <div class="content-text">{{category}}</div>
            </div>
            <div class="content-row">
                <div class="content-label">{{$t(`detail.lang`)}}</div>
                <div class="content-text">{{lang}}</div>
            </div>
            <div class="content-row">
                <div class="content-label">{{$t(`detail.ISBN`)}}</div>
                <div class="content-text">{{ISBN}}</div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
   name:'CopyRight',
   props: {
       publisher: String,
       category: String,
       lang: String,
       ISBN: String
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .copy-right {
        width: 100%;
        padding: px2rem(20) 0 px2rem(10) px2rem(15);
        box-sizing: border-box;
        border-bottom: px2rem(1) solid #ccc;
        .title-wrapper {
            margin-bottom: px2rem(15);
            .title {
                font-size: px2rem(20);
                color: #333;
            }
        }
        .content-wrapper {
            .content-row {
                display: flex;
                margin-bottom: px2rem(10);
                box-sizing: border-box;
                .content-label {
                    flex: 0 0 px2rem(70);
                    font-size: px2rem(14);
                    color: #666;
                }
                .content-text {
                    flex: 1;
                    font-size: px2rem(14);
                    color: #333;
                }
            }
        }
    }
</style>
