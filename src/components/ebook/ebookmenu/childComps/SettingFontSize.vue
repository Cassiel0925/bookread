<template>
    <div class="setting-font">
        <div class="setting-font-size">
            <div class="preview" :style="{fontSize: firstFontSize}">A</div>
            
            <div class="select">
                <div class="select-wrapper" 
                    v-for="(item, index) in fontSizeList" :key="index"
                    @click="setFontSize(item.fontSize)">
                    <div class="line"></div>
                    <div class="point-wrapper">
                        <div class="point" v-show="defaultFontSize === item.fontSize">
                            <div class="small-point"></div>
                        </div>
                    </div>
                    <div class="line"></div>
                </div>
            </div>
            
            <div class="preview" :style="{fontSize: lastFontSize}">A</div>
        </div>
        <setting-font-family class="setting-font-family"/>
    </div>
    
</template>
<script>
import { FONT_SIZE_LIST } from 'utils/book'
import { ebookMixin } from 'utils/mixin'
import SettingFontFamily from './SettingFontFamily.vue'
import { saveFontSize } from 'utils/localStorage'
export default {
   name:'SettingFontSize',
   components: { 
       SettingFontFamily,
    }, 
   mixins: [ebookMixin],
   data () {
       return {
           fontSizeList: FONT_SIZE_LIST
       }
   },
   methods: {
       setFontSize(fontSize) {
           this.setDefaultFontSize(fontSize)
           saveFontSize(this.fileName, fontSize)
           this.currentBook.rendition.themes.fontSize(fontSize)
       },
       
   },
   computed: {
       firstFontSize() {
           return this.fontSizeList[0].fontSize + 'px'
       },
       lastFontSize() {
           return this.fontSizeList[this.fontSizeList.length -1 ].fontSize + 'px'
       }
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
.setting-font {
    display: flex;
    flex-direction: column;
    height: px2rem(90);
    .setting-font-size{
        display: flex;
        flex: 2;
        height: 100%;
        .preview{
            flex: 0 0 px2rem(40);
            @include center;
        }
        .select {
            display: flex;
            flex: 1;
            .select-wrapper {
                flex: 1;
                display: flex;
                align-items: center;
                &:first-child{
                    .line {
                        &:first-child {
                            border-top: none;
                        }
                    }
                }
                &:last-child{
                    .line {
                        &:last-child {
                            border-top: none;
                        }
                    }
                }
                .line {
                    flex: 1;
                    height: 0;
                    border-top: px2rem(1) solid #ccc;
                }
                .point-wrapper {
                    height: px2rem(7);
                    border-left: px2rem(1) solid #ccc;
                    position: relative;
                    .point{
                        position: absolute;
                        top: px2rem(-8);
                        left: px2rem(-10);
                        width: px2rem(20);
                        height: px2rem(20);
                        border-radius: 50%;
                        background-color: #fff;
                        border: px2rem(1) solid #ccc;
                        @include center;
                        .small-point{
                            height: px2rem(5);
                            width: px2rem(5);
                            border-radius: 50%;
                            background-color: #000;
                        }
                    }
                }
            }
            
        }
    }
    .setting-font-family {
        flex: 1;
    }
}

</style>
