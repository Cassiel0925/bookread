<template>
    <div class="flap-card-wrapper" v-show="flapCardVisible">
        <!-- 翻转卡片 -->
        <div class="flap-card-bg" :class="{'animation': runFlapCardAnimation}" v-show="runFlapCardAnimation">
            <div class="flap-card" v-for="(item, index) in flapCardList" :key="index" :style="{zIndex: item.zIndex}">
                <div class="flap-card-circle">
                    <div class="flap-card-semi-circle flap-card-semi-circle-left"
                         :style="semiCircleStyle(item, 'left')" ref="left"></div>
                    <div class="flap-card-semi-circle flap-card-semi-circle-right"
                         :style="semiCircleStyle(item, 'right')" ref="right"></div>
                </div>
            </div>
            <!-- 烟花效果 -->
            <div class="point-wrapper">
                <div class="point" :class="{'animation': runPointAnimation}" v-for="item in pointList" :key="item"></div>
            </div>
        </div>

        <!-- 随机获取一本书 -->
        <div class="book-card" :class="{'animation': runBookCardAnimation}" v-show="runBookCardAnimation">
            <div class="book-card-wrapper">
                <!-- 图书封面 -->
                <div class="img-wrapper">
                    <img :src="random ? random.cover : ''" >
                </div>
                <!-- 图书详情信息 -->
                <div class="content-wrapper">
                    <div class="content-title">{{random ? random.title : ''}}</div>
                    <div class="content-author sub-title-medium">{{random ? random.author : ''}}</div>
                    <div class="content-category">{{categoryText()}}</div>
                </div>
                <!-- 去阅读 按钮 -->
                <div class="read-btn">
                    <span class="btn-text" @click.stop="showBookDetail(random)">{{$t('home.readNow')}}</span>
                </div>
            </div>
        </div>
        
        <!-- 关闭按钮 -->
        <div class="flab-card-icon-wrapper" @click="close">
            <span class="icon-close" ></span>
        </div>
    </div>
</template>
<script>
import { storeHomeMixin } from 'utils/mixin'
import { flapCardList, categoryText } from 'utils/store'
export default {
   name:'Flapcard',
   mixins: [storeHomeMixin],
   props: {
       random: {
           type: Object,
           default() {
               return {}
           }
       }
   },
   data () {
       return {
           flapCardList,
           front: 0,
           back: 1,
           intervalTime: 25,
           runFlapCardAnimation: false,
           pointList: null,
           runPointAnimation: false,
           runBookCardAnimation: false
       }
   },
   watch: {
     flapCardVisible(v) {
         if(v) {
             this.runAnimation()
         }
     }
   },
   methods: {
       close() {
           this.setFlapCardVisible(false)
           this.stopAnimation()
       },
       semiCircleStyle(item, dir) {
           return {
               backgroundColor: `rgb(${item.r}, ${item.g}, ${item.b})`,
               backgroundSize: item.backgroundSize,
               backgroundImage: dir === 'left' ? item.imgLeft : item.imgRight
           }
       },
       // 半圆旋转
       rotate(index, type) {
           const item = this.flapCardList[index]
           let dom 
           if (type === 'front') {
               dom = this.$refs.right[index]
           } else {
               dom = this.$refs.left[index]
           }
            // 旋转角度    
           dom.style.transform = `rotateY(${item.rotateDegree}deg)`
            // 背景颜色变化    
           dom.style.backgroundColor = `rgb(${item.r}, ${item._g}, ${item.b})`
       },
       // 
       flapCardRotate() {
            const frontFlapCard = this.flapCardList[this.front]
            const backFlapCard = this.flapCardList[this.back]
            frontFlapCard.rotateDegree += 10
            frontFlapCard._g -= 5
            backFlapCard.rotateDegree -= 10
            if (backFlapCard.rotateDegree < 90) {
                backFlapCard._g += 5
            }
            // 当右边前面的半圆转到90°的时候 同时 后面的半圆转动到90°的时候 ，让后面半圆的z-index大于前面的z-index 
            if (frontFlapCard.rotateDegree === 90 && backFlapCard.rotateDegree === 90) {
                backFlapCard.zIndex += 2
            }
            this.rotate(this.front, 'front')
            this.rotate(this.back, 'back')
            // 右边卡片转动到跟左边卡片重叠的时候 下一张卡片归位的时候
            if (frontFlapCard.rotateDegree ===180 && backFlapCard.rotateDegree === 0) {
                this.next()
            }
       },
       next() {
           const frontFlapCard = this.flapCardList[this.front]
           const backFlapCard = this.flapCardList[this.back]
           // 归位
           frontFlapCard.rotateDegree = 0
           backFlapCard.rotateDegree = 0
           frontFlapCard._g = frontFlapCard.g
           backFlapCard._g = backFlapCard.g
           this.rotate(this.front, 'front')
           this.rotate(this.back, 'back')

           this.front++
           this.back++

           const len = this.flapCardList.length
           if(this.front >= len) {
               this.front = 0
           }
           if(this.back >= len) {
               this.back = 0
           }

           // zIndex 
           // 100 -> 96
           // 99 -> 100
           // 98 -> 99
           // 97 -> 98
           // 96 -> 97
           this.flapCardList.forEach((item, index) => {
               item.zIndex = 100 - ((index - this.front + len) % len)
           })
           this.prepare()
       },
       // 让 右边背面的卡片 左半边和右半边重合
       prepare() {
           const backFlapCard = this.flapCardList[this.back]
           backFlapCard.rotateDegree = 180
           backFlapCard._g = backFlapCard.g - 5 * 9
           this.rotate(this.back, 'back')
       },
       // 关闭的时候进行重置
       reset() {
           this.front = 0
           this.back = 1
           this.flapCardList.forEach((item, index) => {
               item.zIndex = 100 - index
               item._g = item.g
               item.rotateDegree = 0
               this.rotate(index, 'front')
               this.rotate(index, 'back')
           })
           this.runBookCardAnimation = false
           this.runPointAnimation = false
           this.runFlapCardAnimation = false
       },
       startFlapCardAnimation() {
           this.prepare()
           this.task = setInterval(() => {
              this.flapCardRotate()
           }, this.intervalTime)
       },
       // 停止动画效果
       stopAnimation() {
           this.runFlapCardAnimation = false
           if(this.task) {
               clearInterval(this.task)
           }
           if (this.timeout) {
               clearInterval(this.timeout)
           }
           if (this.timeout2) {
               clearInterval(this.timeout2)
           }
           this.reset()
       },
       //烟花效果
       startPointAnimation() {
           this.runPointAnimation = true
           setTimeout(() => {
               this.runPointAnimation = false
           }, 750)
       },
       // 动画
       runAnimation() {
            this.runFlapCardAnimation = true

            this.timeout = setTimeout(() => {
                this.startPointAnimation()
                this.startFlapCardAnimation()
            }, 300)

            this.timeout2 = setTimeout(() => {
               this.stopAnimation()
               this.runBookCardAnimation = true
           }, 2500)
       },
       // 分类
       categoryText() {
           if(this.random) {
               return categoryText(this.random.category, this)
           } else {
               return ''
           }
       }
   },
   created() {
      this.pointList = []
      for (let i = 0; i < 18; i++) {
        this.pointList.push(`point${i}`)
      }
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
@import "assets/styles/flapCard";
    .flap-card-wrapper {
        @include absCenter;
        width: 100%;
        height: 100%;
        z-index: 1000;
        background: rgba(0, 0, 0, .6);
        @include center;
        .flap-card-bg {
            position: relative;
            width: px2rem(64);
            height: px2rem(64);
            border-radius: px2rem(5);
            background: #fff;
            transform: scale(0);
            opacity: 0;
            &.animation {
                animation: flap-card-move .3s ease-in both;
            }
            @keyframes flap-card-move {
                0% {
                    transform: scale(0);
                    opacity: 0;
                }
                50% {
                    transform: scale(1.2);
                    opacity: 1;
                }
                75% {
                    transform: scale(.9);
                    opacity: 1;
                }
                100% {
                    transform: scale(1);
                    opacity: 1;
                }
            }
            .flap-card{
                @include absCenter;
                width: px2rem(48);
                height: px2rem(48);
                .flap-card-circle{
                    width: 100%;
                    height: 100%;
                    display: flex;
                    .flap-card-semi-circle{
                        flex: 0 0 50%;
                        width: 50%;
                        height: 100%;
                        background-repeat: no-repeat;
                        // 转动到背面的时候 让半圆隐藏
                        backface-visibility: hidden;
                    }
                    .flap-card-semi-circle-left {
                        border-radius: px2rem(24) 0 0 px2rem(24);
                        background-position: center right;
                        // 转动轴 默认是中轴转动
                        transform-origin: right;
                        
                    }
                    .flap-card-semi-circle-right {
                        border-radius: 0 px2rem(24) px2rem(24) 0;
                        background-position: center left;
                        // 转动轴 默认是中轴转动
                        transform-origin: left;
                    }
                }
            }
            .point-wrapper {
                z-index: 1500;
                @include absCenter;
                .point {
                    border-radius: 50%;
                    @include absCenter;
                    &.animation {
                        @for $i from 1 to length($moves) {
                            &:nth-child(#{$i}) {
                                @include move($i);
                            }
                        }
                    }
                }
            }
        }
        .book-card{
            position: relative;
            width: 65%;
            max-width: px2rem(400);
            box-sizing: border-box;
            border-radius: px2rem(15);
            background: #fff;
            &.animation {
                animation: scale .3s ease-in both;
                @keyframes scale {
                    0% {
                        transform: scale(0);
                        opacity: 0;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
            }
            .book-card-wrapper {
                width: 100%;
                height: 100%;
                margin-bottom: px2rem(30);
                @include columnTop;
                .img-wrapper {
                    width: 100%;
                    margin-top: px2rem(20);
                    @include center;
                    img {
                        width: px2rem(90);
                        height: px2rem(130);
                    }
                }
                .content-wrapper {
                    padding: 0 px2rem(20);
                    margin-top: px2rem(20);
                    .content-title {
                        color: #333;
                        font-size: px2rem(18);
                        font-weight: 700;
                        line-height: px2rem(20);
                        max-height: px2rem(40);
                        text-align: center;
                        @include ellipsis2(2);
                    }
                    .content-author {
                        margin-top: px2rem(10);
                        text-align: center;
                    }
                    .content-category {
                        color: #999;
                        font-size: px2rem(14);
                        margin-top: px2rem(10);
                        text-align: center;
                    }
                }
                .read-btn {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    z-index: 1100;
                    width: 100%;
                    border-radius: 0 0 px2rem(15) px2rem(15);
                    padding: px2rem(15) 0;
                    text-align: center;
                    color: #fff;
                    font-size: px2rem(14);
                    background: $color-blue;
                }
            }
        }
        .flab-card-icon-wrapper {
            position: absolute;
            left: 0;
            bottom: px2rem(30);
            z-index: 1100;
            width: 100%;
            @include center;
            .icon-close {
                width: px2rem(45);
                height: px2rem(45);
                border-radius: 50%;
                background: #333;
                font-size: px2rem(25);
                color: #fff;
                @include center;
            }
        }
    }
</style>
