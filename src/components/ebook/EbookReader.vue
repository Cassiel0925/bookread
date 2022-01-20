<template>
    <div class="ebook-reader">
        <div id="read">
        </div>
        <div class="ebook-reader-mask"
             @click="onMaskClick"
             @touchmove="move"
             @touchend="moveEnd"
             @mousedown.left="onMouseEnter"
             @mousemove.left="onMouseMove"
             @mouseup.left="onMouseEnd"></div>
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
import { flatten } from 'utils/book'
import {getLocalForage} from 'utils/localForage'

export default {
   name:'EbookReader',
   mixins: [ebookMixin],
   methods: {
    //    书签功能实现
        // 1 - 鼠标进入
        // 2 - 鼠标进入后的移动
        // 3 - 鼠标从移动状态松手
        // 4 - 鼠标还原
        // PC端书签的实现
        // 鼠标点击
        onMouseEnter(e) {
            this.mouseState = 1
            this.mouseStartTime = e.timeStamp
            // 禁止调用默认方法
            e.preventDefault()
            // 禁止进行重构
            e.stopPropagation()
        },
        // 鼠标移动
        onMouseMove(e) {
             if (this.mouseState === 1) {
                 this.mouseState = 2
             } else if (this.mouseState === 2) {
                 let offsetY = 0
                 if(this.firstOffsetY) {
                    offsetY = e.clientY - this.firstOffsetY
                    this.setOffsetY(offsetY)
                 } else {
                    this.firstOffsetY = e.clientY
                 }
             }
            // 禁止调用默认方法
            e.preventDefault()
            // 禁止进行重构
            e.stopPropagation()
        },
        // 鼠标松开
        onMouseEnd(e) {
            if (this.mouseState === 2) {
                this.setOffsetY(0)
                this.firstOffsetY = null
                this.mouseState = 3
            } else {
                this.mouseState = 4
            }
            const time = e.timeStamp - this.mouseStartTime
            if (time < 100) {
                this.mouseState = 4
            }
            // 禁止调用默认方法
            e.preventDefault()
            // 禁止进行重构
            e.stopPropagation()
        },
         // 手势移动
        move(e) {
            // console.log(e);
            let offsetY = 0
            if(this.firstOffsetY) {
                offsetY = e.changedTouches[0].clientY - this.firstOffsetY
                this.setOffsetY(offsetY)
            } else {
                this.firstOffsetY = e.changedTouches[0].clientY
            }
            // 禁止调用默认方法
            e.preventDefault()
            // 禁止进行重构
            e.stopPropagation()
        },
        // 手势移动结束 屏幕还原
        moveEnd() {
            this.setOffsetY(0)
            this.firstOffsetY = null
        },
        // 点击左侧 返回上一页；点击中间 显示和隐藏标题栏和菜单栏；点击右侧，返回下一页
        onMaskClick(e) {
            // console.log(this.mouseState);
            if (this.mouseState && (this.mouseState === 2 || this.mouseState ===3)) {
                return
            }
            const offsetX = e.offsetX
            const width = window.innerWidth
            if(offsetX > 0 && offsetX < width * 0.3) {
                this.prevPage()
            } else if(offsetX > 0 && offsetX > width * 0.7) {
                this.nextPage()
            } else {
                this.toggleTitleAndMenu()
            }
        },
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
    //    5. 标题栏和菜单栏的隐藏 在mixin中调用
        // hideTitleAndMenu() {
        //     // this.$store.dispatch('setMenuVisible', false)
        //     this.setMenuVisible(false)
        //     this.setSettingVisible(-1)
        // },
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

        // 解析电子书，获取封面图片和书本的基本信息
        parseBook() {
            // 获取封面
            this.book.loaded.cover.then(cover => {
                this.book.archive.createUrl(cover).then(url => {
                    this.setCover(url)
                })
            })
            // 获取书本基本信息
            this.book.loaded.metadata.then(metadata => {
                this.setMetadata(metadata)
            })
            // 渲染书本章节信息
            this.book.loaded.navigation.then(nav => {
                const navItem = flatten(nav.toc)

                function find(item, level = 0) {
                    if (!item.parent) {
                        return level
                    } else {
                        return find(navItem.filter(parentItem => parentItem.id === item.parent)[0], ++level)
                    }
                }
                navItem.forEach(item => {
                    item.level = find(item)
                })

                this.setNavigation(navItem)
                // console.log(navItem);
            })
        },

    //    1. 阅读器的解析和渲染
       initEpub (url) {
        //  const url = 'http://localhost:9091/epub/' + this.fileName 
        //  console.log(url);
         this.book = new Epub(url)
         this.setCurrentBook(this.book)
        //  console.log(this.book);
         this.initRendition()
        //  iframe 绑定事件
        //this.initGesture()
        this.parseBook()
        // 进度条定位
        // console.log(this.book.locations);
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

        // const fileName = (this.$route.params.fileName).split('|').join('/')
        // this.setFileName(fileName).then(() => {
        //     this.initEpub()
        // })

        // this.$store.dispatch('setFileName', fileName).then (() => {
        //     this.initEpub()
        // })
    
        const books =this.$route.params.fileName.split('|')
        const fileName = books[1]
        getLocalForage(fileName, (err, blob) => {
            if(!err && blob) {
                console.log('find');
                this.setFileName(books.join('/')).then(() => {
                    this.initEpub(blob)
                })
            } else {
                console.log('online');
                this.setFileName(books.join('/')).then(() => {
                    const url = 'http://localhost:9091/epub/' + this.fileName
                    this.initEpub(url)
                })
            }
        })
   }
}
</script>
<style lang="scss" scoped>
@import "assets/styles/global";
    .ebook-reader{
        width: 100%;
        height: 100%;
        overflow: hidden;
        .ebook-reader-mask{
            position: absolute;
            top: 0;
            left: 0;
            background: transparent;
            z-index: 50;
            width: 100%;
            height: 100%;
        }
    }
</style>
