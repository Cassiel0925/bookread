import { mapGetters, mapActions } from 'vuex'
import { themeList, addCss, getReadTimeByMinute } from './book'
import { saveLocation, getBookmark } from './localStorage'
import { gotoBookDetail } from './store'

import { appendAddToShelf } from "utils/store";
import { getBookShelf, saveBookShelf } from 'utils/localStorage'
import { shelf } from 'api/store'

export const storeShelfMixin = {
    computed: {
        ...mapGetters([
            'isEditMode',
            'shelfList',
            'shelfSelected',
            'shelfTitleVisible',
            'offsetY'
        ])
    },
    methods: {
        ...mapActions([
            'setIsEditMode',
            'setShelfList',
            'setShelfSelected',
            'setShelfTitleVisible',
            'setOffsetY'
        ]),
        // 去阅读的详情页
        showBookDetail(book) {
            gotoBookDetail(this, book)
        },
        getShelfList() {
            let shelfList = getBookShelf()
            if (!shelfList) {
                shelf().then(response => {
                    if (response.status === 200 && response.data && response.data.bookList) {
                        shelfList = appendAddToShelf(response.data.bookList)
                        saveBookShelf(shelfList)
                        this.setShelfList(shelfList)
                    }
                })
            } else {
                this.setShelfList(shelfList)
            }

        },
    }
}

export const storeHomeMixin = {
    computed: {
        ...mapGetters([
            'offsetY',
            'hotSearchOffsetY',
            'flapCardVisible'
        ])
    },
    methods: {
        ...mapActions([
            'setOffsetY',
            'setHotSearchOffsetY',
            'setFlapCardVisible'
        ]),
        // 去阅读的详情页
        showBookDetail(book) {
            gotoBookDetail(this, book)
        },
        // 查看全部

    }
}

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
            'section',
            'cover',
            'metadata',
            'navigation',
            'offsetY',
            'isBookmark',
            'currentTab'
        ]),
        themeList() {
            return themeList(this)
        },
        // 获取章节名称
        getSectionName() {
            return this.section ? this.navigation[this.section].label : ''
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
            'setSection',
            'setCover',
            'setMetadata',
            'setNavigation',
            'setOffsetY',
            'setIsBookmark',
            'setCurrentTab'
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
            if (currentLocation && currentLocation.start) {
                // console.log(currentLocation);
                const startCfi = currentLocation.start.cfi
                const progress = this.currentBook.locations.percentageFromCfi(startCfi)
                    // console.log(progress);
                this.setProgress(Math.floor(progress * 100))
                    // 获取章节名称
                this.setSection(currentLocation.start.index)
                saveLocation(this.fileName, startCfi)

                // 书签
                const bookmark = getBookmark(this.fileName)
                if (bookmark) {
                    if (bookmark.some(item => item.cfi === startCfi)) {
                        this.setIsBookmark(true)
                    } else {
                        this.setIsBookmark(false)
                    }
                } else {
                    this.setIsBookmark(false)
                }
            }

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
        },
        //    5. 标题栏和菜单栏的隐藏
        hideTitleAndMenu() {
            // this.$store.dispatch('setMenuVisible', false)
            this.setMenuVisible(false)
            this.setSettingVisible(-1)
        },

        // 阅读时间
        getReadTimeText() {
            return this.$t('book.haveRead').replace('$1', getReadTimeByMinute(this.fileName))
        },



    }
}