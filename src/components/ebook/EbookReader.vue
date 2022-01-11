<template>
    <div class="ebook-reader">
        <div id="read">
        </div>
    </div>
</template>
<script>
import Epub from 'epubjs'
import { ebookMixin } from 'utils/mixin'
import { getFontFamily, 
         saveFontFamily,
         getFontSize,
         saveFontSize,
         getTheme,
         saveTheme,
         getLocation } from 'utils/localStorage'

export default {
   name:'EbookReader',
   mixins: [ebookMixin],
   methods: {
    //    2. 上一页
       prevPage() {
           if(this.rendition) {
               this.rendition.prev().then(() => {
                   this.refreshLocation()
               })
               this.hideTitleAndMenu()
           }
       },
    //    3. 下一页
       nextPage() {
           if(this.rendition) {
               this.rendition.next().then(() => {
                   this.refreshLocation()
               })
               this.hideTitleAndMenu()
           }
       },
    //    4. 显示菜单栏和标题栏
       toggleTitleAndMenu() {
           if(this.menuVisible) {
                this.setSettingVisible(-1)
           }
        //    this.$store.dispatch('setMenuVisible', !this.menuVisible)
        this.setMenuVisible(!this.menuVisible)
        this.setFontFamilyVisible(false)
       },
    //    5. 标题栏和菜单栏的隐藏
        hideTitleAndMenu() {
            // this.$store.dispatch('setMenuVisible', false)
            this.setMenuVisible(false)
            this.setSettingVisible(-1)
        },
        // 6.   离线存储字号
        initFontSize() {
            let fontSize = getFontSize(this.fileName)
             if(!fontSize) {
                 saveFontSize(this.fileName, this.defaultFontSize)
             } else {
                 this.rendition.themes.fontSize(fontSize)
                 this.setDefaultFontSize(fontSize)
             }
        },
        // 7. 离线缓存字体
        initFontFamily() {
            let font = getFontFamily(this.fileName)
             if(!font) {
                 saveFontFamily(this.fileName, this.defaultFontFamily)
             } else {
                 this.rendition.themes.font(font)
                 this.setDefaultFontFamily(font)
             }
        },
        // 8. 初始化主题
        initTheme() {
            let defaultTheme = getTheme(this.fileName)
            if(!defaultTheme) {
                defaultTheme = this.themeList[0].name
                saveTheme(this.fileName, defaultTheme)
            }
            this.setDefaultTheme(defaultTheme)
            this.themeList.forEach(theme => {
                this.rendition.themes.register(theme.name, theme.style)
            })
            this.rendition.themes.select(defaultTheme)
        },

        // 抽离出来 rendition
        initRendition() {
            this.rendition = this.book.renderTo('read', {
                width: window.innerWidth,
                height: window.innerHeight,
                //  微信的兼容性配置
                method: 'default'
            })
            const location = getLocation(this.fileName)
            this.display(location, () => {
                this.initTheme()
                this.initGlobalStyle()
                this.initFontSize()
                this.initFontFamily()
            })
            this.rendition.hooks.content.register(contents => {
             Promise.all([
                // contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/daysOne.css`),
                // contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/cabin.css`),
                // contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/montserrat.css`),
                // contents.addStylesheet(`${process.env.VUE_APP_RES_URL}/fonts/tangerine.css`),

                contents.addStylesheet('http://localhost:9091/fonts/daysOne.css'),
                contents.addStylesheet('http://localhost:9091/fonts/cabin.css'),
                contents.addStylesheet('http://localhost:9091/fonts/montserrat.css'),
                contents.addStylesheet('http://localhost:9091/fonts/tangerine.css'),
             ])
         })
        },

        // 抽离出来 gesture
        initGesture() {
            this.rendition.on('touchstart', event => {
                //  获取手指点击屏幕的x轴位置
                this.touchStartX = event.changedTouches[0].clientX
                //  获取手指在屏幕上的点击事件
                this.touchStarTime = event.timeStamp
            })
         this.rendition.on('touchend', event => {
                //  手指离开屏幕时的x轴偏移量
                const offsetX = event.changedTouches[0].clientX - this.touchStartX
                //  手指在屏幕中的点击的时间
                const time = event.timeStamp - this.touchStarTime
                //  console.log(offsetX, time);
                // 手指滑动时间小于0.5s，偏移量大于40时 实现上一页操作； 偏移量小于-40时 实现下一页操作
                if(time < 500 && offsetX > 40) {
                    //  上一页
                    this.prevPage()
                } else if (time < 500 && offsetX < -40) {
                    //  下一页
                    this.nextPage()
                } else {
                    //  显示标题栏和菜单栏
                    this.toggleTitleAndMenu()
                }
                //  禁止默认事件和方法调用
                event.preventDefault()
                event.stopPropagation()
            })
        },

    //    1. 阅读器的解析和渲染
       initEpub () {
         const url = 'http://localhost:9091/epub/' + this.fileName 
        //  console.log(url);
         this.book = new Epub(url)
         this.setCurrentBook(this.book)
        //  console.log(this.book);
         this.initRendition()
        //  iframe 绑定事件
        this.initGesture()
        // 进度条定位
        this.book.ready.then(() => {
            return this.book.locations.generate(750 * (window.innerWidth / 375) * (getFontSize(this.fileName) / 16))
        }).then(locations => {
            this.setBookAvailable(true)
            this.refreshLocation()
        })
         
     }  
   },
   mounted () {
    //    const baseUrl = 'http://localhost:9091/epub/'
    //    const fileName = this.$route.params.fileName.split('|').join('/')
    // const fileName = this.$route.params.fileName
    //    console.log('${baseUrl}${fileName}.epub');
        // console.log(fileName);
        const fileName = (this.$route.params.fileName).split('|').join('/')
        // console.log(this.fileName);
        this.setFileName(fileName).then(() => {
            this.initEpub()
        })
        // this.$store.dispatch('setFileName', fileName).then (() => {
        //     this.initEpub()
        // })
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";

</style>
