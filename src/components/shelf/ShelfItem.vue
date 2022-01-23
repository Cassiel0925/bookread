<template>
   <div class="shelf-item" 
        :class="{'shelf-item-shadow': data.type !== 3}"
        @click="onItemClick">
      <component class="shelf-item-comp"
                 :is="item" 
                 :data="data"
                 :class="{'is-edit': isEditMode && data.type === 2}"></component>
      <div class="shelf-item-select-icon icon-selected" 
           v-show="isEditMode && data.type ===1"
           :class="{'is-selected': data.selected}"></div>
   </div>
</template>
<script>
import {storeShelfMixin} from 'utils/mixin'
import ShelfItemBook from './ShelfItemBook'
import ShelfItemCategory from './ShelfItemCategory'
import ShelfItemAdd from './ShelfItemAdd'
import { gotoStoreHome } from "utils/store";
export default {
   name:'ShelfItem',
   props: {
      data: Object
   },
   data () {
      return {
         book: ShelfItemBook,
         category: ShelfItemCategory,
         add: ShelfItemAdd,
      }
   },
   mixins: [storeShelfMixin],
   computed: {
      item() {
         if (this.data.type === 1) {
            return this.book
         } else if(this.data.type === 2) {
            return this.category
         } else if(this.data.type ===3) {
            return this.add
         }
      }
   },
   methods: {
      onItemClick() {
         // 处于编辑模式 点击为选中状态；非编辑模式 根据类型跳转到相应的页面
         if(this.isEditMode) {
            this.data.selected = !this.data.selected
            if(this.data.selected) {
               this.shelfSelected.pushWithoutDuplicate(this.data)
            } else {
               this.setShelfSelected(this.shelfSelected.filter(item => item.id !== this.data.id))
            }
         } else {
            if(this.data.type === 1) {
               return this.showBookDetail(this.data)
            } else if(this.data.type === 2) {
               this.$router.push({
                  path: '/store/category',
                  query: {
                     title: this.data.title
                  }
               })
            } else {
               gotoStoreHome(this)
            }
         }
         
      }
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
   .shelf-item {
      position: relative;
      width: 100%;
      height: 100%;
      &.shelf-item-shadow {
         box-shadow: px2rem(2) px2rem(2) px2rem(6) px2rem(2) rgba(200, 200, 200, .3);
      }
      .shelf-item-comp {
         opacity: 1;
         &.is-edit {
            opacity: 50%;
         }
      }
      .shelf-item-select-icon {
         font-size: px2rem(18);
         position: absolute;
         bottom: px2rem(2);
         right: px2rem(2);
         color: rgba(0, 0, 0, .4);
         &.is-selected {
            color: rgb(74, 171, 255);
         }
      }
   }
</style>
