<template>
    <div class="setting-font-family" @click="showFontFamilyPopup">
        <div class="font-family-text-wrapper">
            <span class="text">{{defaultFontFamily}}</span>
        </div>
        <div class="font-family-icon-wrapper">
            <span class="icon-forward"></span>
        </div>
    </div>
</template>
<script>
import {ebookMixin} from 'utils/mixin'
export default {
   name:'SettingFontFamily',
   mixins: [ebookMixin],
   methods: {
       showFontFamilyPopup() {
           this.setFontFamilyVisible(true)
       }
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
.setting-font-family {
    @include center;
    font-size: px2rem(14);
    .font-family-text-wrapper {
        @include center;
    }
    .font-family-icon-wrapper {
        @include center;
    }
    
}
</style>
