import { getReadTime } from './localStorage'
import { realPx } from './utils'
// 字号大小列表
export const FONT_SIZE_LIST = [
    { fontSize: 12 },
    { fontSize: 14 },
    { fontSize: 16 },
    { fontSize: 18 },
    { fontSize: 20 },
    { fontSize: 22 },
    { fontSize: 24 },
]

// 字体列表
export const FONT_FAMILY = [
    { font: 'Default' },
    { font: 'Cabin' },
    { font: 'Days One' },
    { font: 'Montserrat' },
    { font: 'Tangerine' }
]

// 主题列表
export function themeList(vue) {
    return [{
            alias: vue.$t('book.themeDefault'),
            name: 'Default',
            style: {
                body: {
                    'color': '#4c5059',
                    'background': '#cecece',
                    'padding-top': `${realPx(48)}px!important`,
                    'padding-bottom': `${realPx(48)}px!important`
                }
            }
        },
        {
            alias: vue.$t('book.themeEye'),
            name: 'Eye',
            style: {
                body: {
                    'color': '#000',
                    'background': '#ceeaba',
                    'padding-top': `${realPx(48)}px!important`,
                    'padding-bottom': `${realPx(48)}px!important`
                }
            }
        },
        {
            alias: vue.$t('book.themeNight'),
            name: 'Night',
            style: {
                body: {
                    'color': '#fff',
                    'background': '#000',
                    'padding-top': `${realPx(48)}px!important`,
                    'padding-bottom': `${realPx(48)}px!important`
                }
            }
        },
        {
            alias: vue.$t('book.themeGold'),
            name: 'Gold',
            style: {
                body: {
                    'color': '#000',
                    'background': 'rgb(241, 236, 226)',
                    'padding-top': `${realPx(48)}px!important`,
                    'padding-bottom': `${realPx(48)}px!important`
                }
            }
        },
    ]
}

// 实现动态添加CSS
export function addCss(href) {
    let link = document.getElementById('globalTheme')
    if (link) {
        link.setAttribute('href', href)
    } else {
        link = document.createElement('link')
        link.setAttribute('id', 'globalTheme')
        link.setAttribute('rel', 'stylesheet')
        link.setAttribute('type', 'text/css')
        link.setAttribute('href', href)
        document.getElementsByTagName('head')[0].appendChild(link)
    }
}

// 获取阅读时间的分钟数
export function getReadTimeByMinute(fileName) {
    const readTime = getReadTime(fileName)
    if (!readTime) {
        return 0
    } else {
        return Math.ceil(readTime / 60)
    }
}

// 将多维数组转换为一维数组
export function flatten(array) {
    return [].concat(...array.map(item => [].concat(item, ...flatten(item.subitems))))
}