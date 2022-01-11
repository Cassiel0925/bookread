export const FONT_SIZE_LIST = [
    { fontSize: 12 },
    { fontSize: 14 },
    { fontSize: 16 },
    { fontSize: 18 },
    { fontSize: 20 },
    { fontSize: 22 },
    { fontSize: 24 },
]

export const FONT_FAMILY = [
    { font: 'Default' },
    { font: 'Cabin' },
    { font: 'Days One' },
    { font: 'Montserrat' },
    { font: 'Tangerine' }
]

export function themeList(vue) {
    return [{
            alias: vue.$t('book.themeDefault'),
            name: 'Default',
            style: {
                body: {
                    'color': '#4c5059',
                    'background': '#cecece'
                }
            }
        },
        {
            alias: vue.$t('book.themeEye'),
            name: 'Eye',
            style: {
                body: {
                    'color': '#000',
                    'background': '#ceeaba'
                }
            }
        },
        {
            alias: vue.$t('book.themeNight'),
            name: 'Night',
            style: {
                body: {
                    'color': '#fff',
                    'background': '#000'
                }
            }
        },
        {
            alias: vue.$t('book.themeGold'),
            name: 'Gold',
            style: {
                body: {
                    'color': '#000',
                    'background': 'rgb(241, 236, 226)'
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