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
                'utils': '@/utils'

            }
        }
    }
}