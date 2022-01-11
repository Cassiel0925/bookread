import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss } from './book'
import { saveLocation } from 'utils/localStorage'

export const ebookMixin = {
    computed: {
        ...mapGetters([
            'fileName',
            'menuVisible',
            'settingVisible',
            'defaultFontSize',
            'currentBook',
            'defaultFontFamily',
            'fontFamilyVisible',
            'defaultTheme',
            'progress',
            'bookAvailable',
            'section'
        ]),
        themeList() {
            return themeList(this)
        }
    },
    methods: {
        ...mapActions([
            'setFileName',
            'setMenuVisible',
            'setSettingVisible',
            'setDefaultFontSize',
            'setCurrentBook',
            'setDefaultFontFamily',
            'setFontFamilyVisible',
            'setDefaultTheme',
            'setProgress',
            'setBookAvailable',
            'setSection'
        ]),
        // 9. 全局主题设置
        initGlobalStyle() {
            switch (this.defaultTheme) {
                case 'Default':
                    addCss('http://localhost:9091/theme/default.css')
                    break
                case 'Eye':
                    addCss('http://localhost:9091/theme/eye.css')
                    break
                case 'Gold':
                    addCss('http://localhost:9091/theme/gold.css')
                    break
                case 'Night':
                    addCss('http://localhost:9091/theme/night.css')
                    break
                default:
                    addCss('http://localhost:9091/theme/default.css')
                    break
            }
        },
        // 章节切换和进度同步
        refreshLocation() {
            // 当前进度的对象
            const currentLocation = this.currentBook.rendition.currentLocation()
                // console.log(currentLocation);
            const startCfi = currentLocation.start.cfi
            const progress = this.currentBook.locations.percentageFromCfi(startCfi)
                // console.log(progress);
            this.setProgress(Math.floor(progress * 100))
                // 获取章节名称
            this.setSection(currentLocation.start.index)
            saveLocation(this.fileName, startCfi)
        },
        // display 方法
        display(target, cb) {
            if (target) {
                this.currentBook.rendition.display(target).then(() => {
                    this.refreshLocation()
                    if (cb) cb()
                })
            } else {
                this.currentBook.rendition.display().then(() => {
                    this.refreshLocation()
                    if (cb) cb()
                })
            }
        }
    }
}