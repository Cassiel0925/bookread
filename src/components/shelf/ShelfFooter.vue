<template>
    <div class="shelf-footer" v-show="isEditMode">
        <div class="shelf-footer-tab-wrapper" 
             v-for="item in tabs" 
             :key="item.index"
             @click="onTabClick(item)">
            <div class="shelf-footer-tab" :class="{'is-selected': isSelected}">
                <div class="icon-private tab-icon" v-if="item.index ===1 && !isPrivate"></div>
                <div class="icon-private-see tab-icon" v-if="item.index ===1 && isPrivate"></div>

                <div class="icon-download tab-icon" v-if="item.index ===2 && !isDownload"></div>
                <div class="icon-download-remove tab-icon" v-if="item.index ===2 && isDownload"></div>

                <div class="icon-move tab-icon" v-if="item.index ===3"></div>
                <div class="icon-shelf tab-icon" v-if="item.index ===4"></div>
                <div class="tab-text" :class="{'remove-text': item.index === 4}">{{label(item)}}</div>
            </div>
        </div>
    </div>
</template>
<script>
import { storeShelfMixin } from 'utils/mixin';
import {saveBookShelf, removeLocalStorage} from 'utils/localStorage';
import {removeLocalForage} from 'utils/localForage'
import {download} from 'api/store'
export default {
   name:'ShelfFooter',
   mixins: [storeShelfMixin],
   computed: {
       tabs() {
           return [
               {
                   label: this.$t('shelf.private'),
                   label2: this.$t('shelf.noPrivate'),
                   index: 1
               },
               {
                   label: this.$t('shelf.download'),
                   label2: this.$t('shelf.delete'),
                   index: 2
               },
               {
                   label: this.$t('shelf.move'),
                   index: 3
               },
               {
                   label: this.$t('shelf.remove'),
                   index: 4
               },
           ]
       },
       // 底部栏透明度的变化
       isSelected() {
           return this.shelfSelected && this.shelfSelected.length > 0
       },
       // 是否为私密状态
       isPrivate() {
           if(!this.isSelected) {
               return false
           } else {
               // 被选中的书籍全为私密状态，才返回当前为私密状态
               return this.shelfSelected.every(item => item.private)
           }
       },
       // 是否已经离线缓存
       isDownload() {
           if(!this.isSelected) {
               return false
           } else {
               // 被选中的书籍全为缓存状态，
               return this.shelfSelected.every(item => item.cache)
           }
       },
   },
   data () {
       return {
           popupMenu: null
       }
   },
   methods: {
       onTabClick(item) {
           if (!this.isSelected) {
               return 
           } 
           switch (item.index) {
                case 1:
                    this.showPrivate()
                    break
                case 2:
                    this.showDownload()
                    break
                case 3:
                    this.dialog().show()
                    break
                case 4:
                    this.showRemove()
                    break
                default:
                    break
           }
       },

       // 1. 私密阅读的实现
       showPrivate() {
           this.popupMenu = this.popup({
               title: this.isPrivate ? this.$t('shelf.closePrivateTitle') : this.$t('shelf.setPrivateTitle'),
               btn: [
                   {
                       text: this.isPrivate ? this.$t('shelf.close') : this.$t('shelf.open'),
                       click: () => {
                           this.setPrivate()
                       }
                   },
                   {
                       text: this.$t('shelf.cancel'),
                       click: () => {
                           this.hidePopup()
                       }
                   }
               ]
           }).show()
       },
       // 1.1 设置私密阅读
       setPrivate() {
           let isPrivate
           if (this.isPrivate) {
               isPrivate = false
           } else {
               isPrivate = true
           }
           this.shelfSelected.forEach(book => {
               book.private = isPrivate
           })
           this.onComplete()
           if(isPrivate) {
               this.simpleToast(this.$t('shelf.setPrivateSuccess'))
           } else {
               this.simpleToast(this.$t('shelf.closePrivateSuccess'))
           }
       },

       // 2. 开启离线下载
       showDownload() {
           this.popupMenu = this.popup({
               title: this.isDownload ? this.$t('shelf.removeDownloadTitle') : this.$t('shelf.setDownloadTitle'),
               btn: [
                   {
                       text: this.isDownload ? this.$t('shelf.delete') : this.$t('shelf.open'),
                       click: () => {
                           this.setDownload()
                       }
                   },
                   {
                       text: this.$t('shelf.cancel'),
                       click: () => {
                           this.hidePopup()
                       }
                   }
               ]
           }).show()
       },
       //2.1 设置离线缓存
       async setDownload() {
           this.onComplete()
           if(this.isDownload) {
               this.removeSelectedBook()
           } else {
               await this.downloadSelectedBook()
               saveBookShelf(this.shelfList)
               this.simpleToast(this.$t('shelf.setDownloadSuccess'))
           }
       },
       // 2.2 被选中的电子书
       async downloadSelectedBook() {
           for(let i =0; i < this.shelfSelected.length; i++) {
               await this.downloadBook(this.shelfSelected[i]).then(book => {
                   book.cache = true
               })
           }
       },
       // 2.3 下载电子书
       downloadBook(book) {
           let text = ''
           const toast = this.toast({
               text
           })
           toast.continueShow()
           return new Promise((resolve, reject) => {
               download(book, book => {
                   toast.remove()
                   resolve(book)
               }, reject,  progressEvent => {
                   const progress = Math.floor(progressEvent.loaded / progressEvent.total * 100) + '%'
                   const text = this.$t('shelf.progressDownload').replace('$1', `${book.fileName}.epub(${progress})`)
                   toast.updateText(text)
               })
           })
       },
       // 2.4 删除被选中的下载电子书
       removeSelectedBook() {
           Promise.all(this.shelfSelected.map(book => this.removeBook(book)))
           .then(books => {
               books.map(book => {
                   book.cache = false
               })
               saveBookShelf(this.shelfList)
               this.simpleToast(this.$t('shelf.removeDownloadSuccess'))
           })
       },
       // 2.5 删除下载的电子书
       removeBook(book) {
           return new Promise((resolve, reject) => {
               removeLocalStorage(`${book.categoryText}/${book.fileName}-info`)
               removeLocalForage(`${book.fileName}`)
               resolve(book)
           })
       },

       // 3. 移出书架
       showRemove() {
           let title
           if(this.shelfSelected.length === 1) {
               title = this.$t('shelf.removeBookTitle').replace('$1', `《${this.shelfSelected[0].title}》`)
           } else {
                title = this.$t('shelf.removeBookTitle').replace('$1', this.$t('shelf.selectedBooks'))
           }
           this.popupMenu = this.popup({
               title: title,
               btn: [
                   {
                       text: this.$t('shelf.removeBook'),
                       type: 'danger',
                       click: () => {
                           this.removeSelected()
                       }
                   },
                   {
                       text: this.$t('shelf.cancel'),
                       click: () => {
                           this.hidePopup()
                       }
                   }
               ]
           }).show()
       },
       // 3.1 移除所选图书
       removeSelected() {
           this.shelfSelected.forEach(selected => {
               this.setShelfList(this.shelfList.filter(book => book !== selected))
           })
           this.setShelfSelected([])
           this.onComplete()
       },

       // 2 隐藏popup
       hidePopup() {
           this.popupMenu.hide()
       },

       // tab 文本显示
       label(item) {
           switch(item.index) {
                case 1:
                   return this.isPrivate ? item.label2 : item.label
                   break
                case 2:
                   return this.isDownload ? item.label2 : item.label
                   break
                default:
                    return item.label
           }
       },

       // 完成的一些操作
       onComplete() {
           this.hidePopup()
           this.setIsEditMode(false)
           saveBookShelf(this.shelfList)
       }
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .shelf-footer {
        position: fixed;
        bottom: 0;
        left: 0;
        z-index: 120;
        width: 100%;
        height: px2rem(48);
        background: #fff;
        box-shadow: 0 px2rem(-2) px2rem(2) 0 rgba(0, 0, 0, .2);
        display: flex;
        .shelf-footer-tab-wrapper {
            flex: 1;
            width: 25%;
            height: 100%;
            .shelf-footer-tab {
                width: 100%;
                height: 100%;
                @include columnCenter;
                color: #666;
                opacity: .5;
                &.is-selected {
                    opacity: 1;
                }
                .tab-icon {
                    font-size: px2rem(20);
                }
                .tab-text {
                    font-size: px2rem(12);
                    margin-top: px2rem(5);
                    &.remove-text {
                        color: rgb(255, 102, 159);
                    }
                }
                .icon-shelf {
                    color: rgb(255, 102, 159);
                }
            }
        }
    }
</style>
