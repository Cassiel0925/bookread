<template>
    <div class="ebook">
        <ebook-reader/>
        <ebook-title/>
        <ebook-menu/>
    </div>
</template>
<script>
import EbookReader from 'components/ebook/EbookReader.vue'
import EbookTitle from 'components/ebook/ebooktitle/EbookTitle.vue'
import EbookMenu from 'components/ebook/ebookmenu/EbookMenu.vue'

import { getReadTime, saveReadTime } from 'utils/localStorage' 
import { ebookMixin } from 'utils/mixin'

export default {
   name:'Ebook',
   mixins: [ebookMixin],
   components: { 
       EbookReader,
       EbookTitle,
       EbookMenu 
    },
    methods: {
        startLoopReadTime() {
            let readTime = getReadTime(this.fileName)
            if(!readTime) {
                readTime = 0
            }
            this.task = setInterval(() => {
                readTime++
                if(readTime % 30 === 0) {
                    saveReadTime(this.fileName, readTime)
                }
            }, 1000)
        }
    },
    mounted () {
        this.startLoopReadTime()
    },
    beforeDestroy() {
        if (this.task) {
            clearInterval(this.task)
        }
    }

}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "assets/styles/global";

</style>
