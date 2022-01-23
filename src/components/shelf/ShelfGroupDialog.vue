<template>
    <ebook-dialog :title="title" ref="dialog">
      <!-- 中间内容部分 start -->
      <!-- 移动书籍部分 -->
      <div v-if="!isNewGroup">
        <div class="dialog-list-wrapper" 
            v-for="(item, index) in categoryList"
            :key="index">
          <div class="dialog-list-item"
              :class="{'is-add': item.edit === 1}"
              v-if="(item.edit === 2 && isInGroup) || item.edit !==2 || !item.edit"
              @click="onGroupClick(item)">
              <!-- 文本 -->
              <div class="dialog-list-item-text">{{item.title}}</div>
              <!-- check 图标 -->
              <div class="dialog-list-icon-wrapper" v-if="isInGroup && shelfCategory.id === item.id">
                <span class="icon-check"></span>
              </div>
          </div>
        </div>
      </div>
      <!-- 新建分组 -->
      <div class="dialog-new-group-wrapper" v-else>
        <div class="dialog-input-title-wrapper">
          <span class="dialog-input-text">{{$t('shelf.groupName')}}</span>
        </div>
        <div class="dialog-input-wrapper">
          <div class="dialog-input-inner-wrapper">
            <input type="text" class="dialog-input" v-model="newGroupName" ref="dialogInput">
            <div class="dialog-input-clear-wrapper" 
                 v-show="newGroupName && newGroupName.length > 0"
                 @click="clear">
              <span class="icon-close-circle-fill"></span>
            </div>
          </div>
        </div>
      </div>
      <!-- 中间内容部分 end -->

      <!-- 按钮部分 start -->
      <div slot="btn" class="group-dialog-btn-wrapper">
        <div class="dialog-btn" @click="hide">{{$t('shelf.cancel')}}</div>
        <div class="dialog-btn" 
             :class="{'is-empty': newGroupName && newGroupName.length === 0}"
             v-if="isNewGroup"
             @click="createNewGroup">{{$t('shelf.confirm')}}</div>
      </div>
      <!-- 按钮部分 end -->

    </ebook-dialog>
</template>
<script>
import EbookDialog from 'components/common/Dialog.vue'
import {storeShelfMixin} from 'utils/mixin'
import {removeAddFromShelf, appendAddToShelf} from 'utils/store'
import {saveBookShelf} from 'utils/localStorage'
export default {
   name:'ShelfGroupDialog',
   components: { 
        EbookDialog 
    },
    props: {
      showNewGroup: {
        type: Boolean,
        default: false
      },
      groupName: String
    },
    data () {
      return {
        isNewGroup: false,
        newGroupName: ''
      }
    },
    mixins: [storeShelfMixin],
    computed: {
        title() {
            return this.isNewGroup ? this.$t('shelf.newGroup') : this.$t(`shelf.moveBook`)
        },
        defaultCategory() {
          return [
            {
              // 新建分组
              title: this.$t('shelf.newGroup'),
              edit: 1
            },
            {
              // 移出分组
              title: this.$t('shelf.groupOut'),
              edit: 2
            }
          ]
        },
        category() {
          return this.shelfList.filter(item => item.type === 2)
        },
        categoryList() {
          return [...this.defaultCategory, ...this.category]
        },
        // 是否在分类组里面
        isInGroup() {
          return this.currentType === 2
        }
    },
    methods: {
        // 1. 显示dialog
        show() {
            this.isNewGroup = this.showNewGroup
            this.newGroupName = this.groupName
            this.$refs.dialog.show()
        },

        // 2. 新建分组、移除分组、分类名称的点击
        onGroupClick(item) {
          // 2.1 新建分组
          if(item.edit && item.edit === 1) {
            this.isNewGroup = true
          } else if (item.edit && item.edit === 2) {
            //2.2 移除分组
            this.moveOutFromGroup(item)
          } else {
            // 2.3 进入分组
            this.moveToGroup(item)
          }
        },

        // 3. 清除输入框的内容
        clear() {
          this.newGroupName = ''
        },

        // 4. 隐藏dialog
        hide() {
          this.$refs.dialog.hide()
          setTimeout(() => {
            this.isNewGroup = false
          }, 200)
        },

        //5. 移入分类组中
        moveToGroup(group) {
          this.setShelfList(this.shelfList.filter(book => {
            // 选中的图书进行过滤
            if (book.itemList) {
              book.itemList = book.itemList.filter(subBook => this.shelfSelected.indexOf(subBook) < 0)
            }
            return this.shelfSelected.indexOf(book) < 0
          }))
          .then(() => {
            // 将选定的图书加入到我们选定的分类中去
            if(group && group.itemList) {
              group.itemList = [...group.itemList, ...this.shelfSelected]
            }
            // 对添加分组的id 进行排序
            group.itemList.forEach((item, index) => {
              item.id = index + 1
            })
            this.simpleToast(this.$t('shelf.moveBookInSuccess').replace('$1', group.title))
            this.onComplete()
          })
        },

        // 6. 创建新的分组
        createNewGroup() {
          if (!this.newGroupName || this.newGroupName.length === 0) {
             return 
          }
          if (this.showNewGroup) {
            // 修改分组名
            this.shelfCategory.title = this.newGroupName
            this.onComplete()
          } else {
            // 创建一个新的分组
            const group = {
              id: this.shelfList[this.shelfList.length -2].id + 1,
              itemList: [],
              selected: false,
              title: this.newGroupName,
              type: 2
            }
            let list = removeAddFromShelf(this.shelfList)
            list.push(group)
            list = appendAddToShelf(list)
            this.setShelfList(list).then(() => {
              this.moveToGroup(group)
            })
            this.hide()
          }
        },

        // 7. 
        onComplete() {
          saveBookShelf(this.shelfList)
          this.hide()
          this.setIsEditMode(false)
        },

        //8. 移除分组
        moveOutFromGroup() {
          this.moveOutOfGroup(this.onComplete)
        },
    }

}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
  .dialog-list-wrapper {
    width: 100%;
    padding: 0 px2rem(20);
    box-sizing: border-box;
    font-size: px2rem(14);
    @include scroll;
    .dialog-list-item {
      display: flex;
      padding: px2rem(15) 0;
      box-sizing: border-box;
      color: #666;
      &.is-add {
        color: rgb(74, 171, 255);
      }
      .dialog-list-item-text {
        flex: 1;
        
      }
      .dialog-list-icon-wrapper {}
    }
  }
  .dialog-new-group-wrapper {
    width: 100%;
    padding: px2rem(30) px2rem(20) px2rem(40) px2rem(20);
    box-sizing: border-box;
    .dialog-input-title-wrapper {
      font-size: px2rem(10);      
      padding-bottom: px2rem(15);
      box-sizing: border-box;
    }
    .dialog-input-wrapper {
      .dialog-input-inner-wrapper {
        display: flex;
        font-size: px2rem(14);
        padding-bottom: px2rem(10);
        box-sizing: border-box;
        border-bottom: px2rem(1) solid #eee;
        .dialog-input {
          flex: 1;
          outline: none;
          border: none;
        }
        .dialog-input-clear-wrapper {
          flex: 0 0 px2rem(20);
          color: #ccc;
          @include center;
        }
      }
    }
  }

  .group-dialog-btn-wrapper { 
    width: 100%;
    @include center;
    .dialog-btn {
      flex: 1;
      &.is-empty {
        color: rgba(255, 255, 255, .5);
      }
      &:active {
        color: rgba(255, 255, 255, .5)
      }
    }
    
  }
</style>
