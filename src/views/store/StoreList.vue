<template>
   <div class="store-list">
      <detail-title :title="title" @back="back" ref="title"/>
      <scroll :top="42"
              ref="scroll"
              @onScroll="onScroll">
         <features :titleText="titleText ? titleText : getCategoryText(key)" 
                   :btnText="''"
                   v-for="(value, key, index) in list"
                   :key="index"
                   :features="value"/>
      </scroll>
   </div>
</template>
<script>
import DetailTitle from 'components/detail/DetailTitle.vue'
import Features from 'components/home/childComps/Features.vue'

import Scroll from 'components/common/Scroll.vue'

import {list} from 'api/store'
import {realPx} from 'utils/utils' 
import { categoryList, categoryText } from 'utils/store'

export default {
   name:'StoreList',
   components: {
      DetailTitle,
      Scroll,
      Features 
   },
   data () {
      return {
         list: null,
         total: null
      }
   },
   computed: {
      // 动态生成标题数据
      title() {
         if(this.list) {
            return this.total && this.$t(`home.allBook`).replace('$1', this.totalNumber)
         } else {
            return null
         }
      },

      // 获取当前列表中电子书总数
      totalNumber() {
         let num = 0
         Object.keys(this.list).forEach(key => {
            num += this.list[key].length
         })
         return num
      },
   },
   methods: {
      // 1. 通过API获取分类列表
      getList() {
         list().then(response => {
            console.log(response);
            this.list = response.data.data
            this.total = response.data.total
            const category = this.$route.query.category
            const keyword = this.$route.query.keyword
            if(category) {
               // 如果用户传入了分类数据，则从结果中搜索相应的分类数据并进行展示
               const key = Object.keys(this.list).filter(item => item === category)[0]
               const data = this.list[key]
               this.list = {}
               this.list[key] = data
            } else if(keyword) {
               // 如果用户输入了关键字，则通过书名进行关键字匹配（搜索算法）
               Object.keys(this.list).filter(key => {
                  this.list[key] = this.list[key].filter(book => book.fileName.indexOf(keyword) >= 0)
                  return this.list[key].length > 0
               })
            }
         })
      },

      // 2. 返回上一层
      back() {
         this.$router.go(-1)
      },

      //3. 标题栏阴影的显示和隐藏
      onScroll(offsetY) {
         if(offsetY > realPx(42)) {
            this.$refs.title.showShadow()
         } else {
            this.$refs.title.hideShadow()
         }
      },

      //4. 获取分类文本
      getCategoryText(key) {
         return `${categoryText(categoryList[key], this)}(${this.list[key].length})`
      }

   },
   mounted () {
      this.getList()
      this.titleText = this.$route.query.categoryText
   }

}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";

</style>
