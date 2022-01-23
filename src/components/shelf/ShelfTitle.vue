<template>
    <transition name="fade">
        <div class="shelf-title" v-show="shelfTitleVisible" :class="{'hide-shadow': isHideShadow}">
            <!-- 中间标题文本 -->
            <div class="shelf-title-text-wrapper">
                <span class="shelf-title-text">{{title}}</span>
                <span class="shelf-sub-title-text" v-show="isEditMode">{{selectedText}}</span>
            </div>
            <!-- 清除缓存 -->
            <div class="shelf-title-btn-wrapper shelf-left" v-if="showClear">
                <span class="shelf-title-btn-text" @click="clearCache">{{$t(`shelf.clearCache`)}}</span>
            </div>
            <!-- 返回图标 -->
            <div class="shelf-title-btn-wrapper shelf-left" v-if="showBack">
                <span class="icon-back" @click="back"></span>
            </div>
            <!-- 取消和编辑按钮 -->
            <div class="shelf-title-btn-wrapper shelf-right" v-if="showEdit">
                <span class="shelf-title-btn-text" @click="onEditClick">{{isEditMode ? $t(`shelf.cancel`) : $t(`shelf.edit`)}}</span>
            </div>
            <!-- 修改分组 -->
            <div class="shelf-title-btn-wrapper"
                 :class="{'shelf-left': changeGroupLeft, 'shelf-right': changeGroupRight}"
                 v-if="showChangeGroup"
                 @click="changeGroup">
                <span class="shelf-title-btn-text">{{$t('shelf.editGroup')}}</span>
            </div>
        </div>
    </transition>
</template>
<script>
import {storeShelfMixin} from 'utils/mixin'
import {clearLocalStorage, saveBookShelf} from 'utils/localStorage'
import {clearLocalForage} from 'utils/localForage'
export default {
   name:'ShelfTitle',
   mixins: [storeShelfMixin],
   data () {
       return {
           isHideShadow: true
       }
   },
   props: {
       title: String
   },
   watch: {
       offsetY(v) {
           if(v > 0) {
               this.isHideShadow = false
           } else {
               this.isHideShadow = true
           }
       }
   },
   computed: {
       selectedText() {
           const selectedNumber = this.shelfSelected ? this.shelfSelected.length : 0
           if (selectedNumber <= 0) {
               return this.$t(`shelf.selectBook`)
           } else if (selectedNumber === 1) {
               return this.$t(`shelf.haveSelectedBook`).replace('$1', selectedNumber)
           } else {
               return this.$t(`shelf.haveSelectedBooks`).replace('$1', selectedNumber)
           }
       },
        // 空的分组
       emptyCategory() {
           return !this.shelfCategory || !this.shelfCategory.itemList || this.shelfCategory.itemList.length === 0
       },
       // 显示清除缓存
       showClear() {
           return this.currentType === 1
       },
       // 显示返回按钮
       showBack() {
           return this.currentType === 2 && !this.isEditMode
       },
       // 显示或隐藏 编辑和取消按钮
       showEdit() {
           return this.currentType === 1 || !this.emptyCategory
       },
       // 显示修改分组
       showChangeGroup() {
           return this.currentType === 2 && (this.isEditMode || this.emptyCategory)
       },
       // 左边显示修改分组
       changeGroupLeft() {
           return !this.emptyCategory
       },
       // 右边显示修改分组
       changeGroupRight() {
           return this.emptyCategory
       },
       // 取消
       popupCancelBtn() {
           return this.createPopupBtn(
                this.$t('shelf.cancel'),
                () => {
                    this.hidePopup()
                }
            )
       }
   },
   methods: {
       // 1. 编辑和取消模式的切换
       onEditClick() {
           // 点击取消 选中列表清空 选中状态全部置为flase
           if(!this.isEditMode) {
               this.setShelfSelected([])
               this.shelfList.forEach(item => {
                   item.selected = false
                   if(item.itemList) {
                       item.itemList.forEach(subItem => {
                           subItem.selected = false
                       })
                   }
               })
           }
           this.setIsEditMode(!this.isEditMode)
       },

       // 2. 清除缓存
       clearCache() {
           clearLocalStorage()
           clearLocalForage()
           this.setShelfList([])
           this.setShelfSelected([])
           this.getShelfList()
           this.simpleToast(this.$t('shelf.clearCacheSuccess'))
       },

       //3. 返回按钮
       back() {
           this.$router.go(-1)
       },

       //4. 修改分组
       changeGroup() {
           this.popupMenu = this.popup({
               btn: [
                   this.createPopupBtn(
                       this.$t('shelf.editGroupName'),
                       () => {
                           this.changeGroupName()
                       }
                   ),
                   this.createPopupBtn(
                       this.$t('shelf.deleteGroup'),
                       () => {
                           this.showDeleteGroup()
                       },
                       'danger'
                   ),
                   this.popupCancelBtn
                   
               ]
           }).show()
       },
       // 4.1 popupBtn 按钮
       createPopupBtn(text, onClick, type = 'normal') {
           return {
               text: text,
               type: type,
               click: onClick
           }
       },
       // 4.2 修改分组名
       changeGroupName() {
           this.hidePopup()
           this.dialog({
               showNewGroup: true,
               groupName: this.shelfCategory.title
           }).show()
       },
       // 4.3 删除分组
       showDeleteGroup() {
           this.hidePopup()
           setTimeout(() => {
               this.popupMenu = this.popup({
                   title: this.$t('shelf.deleteGroupTitle'),
                   btn: [
                       this.createPopupBtn(
                           this.$t('shelf.confirm'),
                           () => {
                               this.deleteGroup()
                            },
                            'danger'
                       ),
                       this.popupCancelBtn
                   ]
                }).show()
           }, 200)
       },
       // 4.4 取消 隐藏popup
       hidePopup() {
           this.popupMenu.hide()
       },
       // 4.5 删除分组
       deleteGroup() {
           // 当前分组不为空 将分组内的所有书籍置为选中状态，将书籍移除分组至书架，然后删除该分组；如果分组为空，则直接将分组删除
           if(!this.emptyCategory) {
               this.setShelfSelected(this.shelfCategory.itemList)
               this.moveOutOfGroup(this.onComplete)
           } else {
               this.onComplete()
           }
       },
       // 4.6 将分组彻底删除
       onComplete() {
           this.hidePopup()
           this.setShelfList(this.shelfList.filter(book => book.id !== this.shelfCategory.id))
           .then(() => {
               saveBookShelf(this.shelfList)
               this.$router.go(-1)
               this.setIsEditMode(false)
           })
       },
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .shelf-title {
        position: relative;
        top: 0;
        left: 0;
        width: 100%;
        height: px2rem(42);
        z-index: 115;
        background: #fff;
        box-shadow: 0 px2rem(2) px2rem(2) 0 rgba(0, 0, 0, .1);
        &.hide-shadow {
            box-shadow: none;
        }
        .shelf-title-text-wrapper {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: px2rem(42);
            @include columnCenter;
            .shelf-title-text {
                font-size: px2rem(16);
                line-height: px2rem(20);
                font-weight: 700;
                color: #333;
            }
            .shelf-sub-title-text {
                font-size: px2rem(10);
                color: #333;
            }
        }
        .shelf-title-btn-wrapper {
            position: absolute;
            top: 0;
            box-sizing: border-box;
            height: 100%;
            @include center;
            .shelf-title-btn-text {
                font-size: px2rem(14);
                color: #666;
            }
            &.shelf-left {
                left: 0;
                padding-left: px2rem(10);
                .icon-back {
                    font-size: px2rem(18);
                }
            }
            &.shelf-right {
                right: 0;
                padding-right: px2rem(10);
            }
        }
    }
</style>
