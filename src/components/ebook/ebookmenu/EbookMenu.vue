<template>
    <div class="ebook-reader">
        <transition name="slide-up">
                <div class="meau-bar-wrapper" v-show="menuVisible" :class="{'no-shadow': !menuVisible || settingVisible !== -1}">
                    <!-- 目录 -->
                    <div class="icon-wrapper">
                        <span class="icon-menu" @click="settingShow(3)"></span>
                    </div>
                    <!-- 进度条 -->
                    <div class="icon-wrapper">
                        <span class="icon-progress" @click="settingShow(2)"></span>
                    </div>
                    <!-- 主体设置 -->
                    <div class="icon-wrapper">
                        <span class="icon-bright" @click="settingShow(1)"></span>
                    </div>
                    <!-- 字体大小设置 -->
                    <div class="icon-wrapper">
                        <span class="icon-A" @click="settingShow(0)"></span>
                    </div>
                </div>
            </transition>

        <transition name="slide-up">
            <div class="setting-wrapper" v-show=" settingVisible !== -1 && settingVisible !== 3">
                <!-- 字体设置 -->
                <setting-font-size v-show="menuVisible && settingVisible === 0"/>
                <!-- 主题设置 -->
                <setting-theme v-show="menuVisible && settingVisible === 1"/>
                <!-- 进度设置 -->
                <setting-progress v-show="menuVisible && settingVisible === 2"/>
            </div>
        </transition>
        <font-family-popup/>
        <ebook-slide v-show="menuVisible && settingVisible === 3"/>
    </div>
   
</template>
<script>
import { ebookMixin } from 'utils/mixin'
import SettingFontSize from './childComps/SettingFontSize.vue'
import FontFamilyPopup from './childComps/FontFamilyPopup.vue'
import SettingTheme from './childComps/SettingTheme.vue'
import SettingProgress from './childComps/SettingProgress.vue'
import EbookSlide from './childComps/EbookSlide.vue'
export default {
   name:'EbookMenu',
   components: { 
       SettingFontSize,
      FontFamilyPopup,
      SettingTheme,
      SettingProgress,
      EbookSlide 
    },
   mixins: [ebookMixin],
   methods: {
      settingShow(key) {
          this.setSettingVisible(key)
      }
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
.ebook-reader {
    // position: relative;
    .meau-bar-wrapper {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: px2rem(49);
        box-shadow: 0 px2rem(-8) px2rem(4) rgba(100, 100, 100, .15);
        background-color: #fff;
        display: flex;
        z-index: 101;
        font-size: px2rem(22);
        .icon-wrapper {
            flex: 1;
            @include center;
        }
        &.no-shadow {
            box-shadow: none;
        }
    }
    .setting-wrapper {
        position: absolute;
        bottom: px2rem(49);
        left: 0;
        z-index: 100;
        width: 100%;
        height: px2rem(90);
        box-shadow: 0 px2rem(-8) px2rem(4) rgba(100, 100, 100, .15);
        background-color: #fff;
    }
}

</style>
