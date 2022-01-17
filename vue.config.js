module.exports = {
    configureWebpack: {
        // resolve 解决路径相关的问题
        resolve: {
            //  文件的后缀名可以不写
            // extensions: [],

            // alias 别名
            alias: {
                // 默认的别名
                // '@': 'src'

                'assets': '@/assets',
                'components': '@/components',
                'views': '@/views',
                'utils': '@/utils',
                'api': '@/api'

            }
        }
    },
    devServer: {
        before(app) {
            mock(app, '/book/home', homeData)
            mock(app, '/book/shelf', shelfData)
            mock(app, '/book/list', listData)
            mock(app, '/book/flat-list', flatListData)
        }
    }
}

function mock(app, url, data) {
    app.get(url, (request, response) => {
        response.json(data)
    })
}

const homeData = require('./src/mock/bookHome')
const shelfData = require('./src/mock/bookShelf')
const listData = require('./src/mock/bookList')
const flatListData = require('./src/mock/bookFlatList')