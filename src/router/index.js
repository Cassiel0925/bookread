import Vue from 'vue'
import VueRouter from 'vue-router'

const Ebook = () =>
    import ('views/ebook/Ebook')
const EbookReader = () =>
    import ('components/ebook/EbookReader')
const Index = () =>
    import ('views/store/Index')
const StoreHome = () =>
    import ('views/store/StoreHome')
const StoreDetail = () =>
    import ('views/store/StoreDetail')
const StoreList = () =>
    import ('views/store/StoreList')
const StoreShelf = () =>
    import ('views/store/StoreShelf')
const StoreCategory = () =>
    import ('views/store/StoreCategory')
const StoreSpeaking = () =>
    import ('views/store/StoreSpeaking')

Vue.use(VueRouter)

const routes = [{
        path: '',
        redirect: '/store'
    },
    {
        path: '/ebook',
        component: Ebook,
        children: [{
            path: ':fileName',
            component: EbookReader
        }]
    },
    {
        path: '/store',
        component: Index,
        redirect: '/store/shelf',
        children: [{
                path: 'home',
                component: StoreHome
            },
            {
                path: 'detail',
                component: StoreDetail
            },
            {
                path: 'list',
                component: StoreList
            },
            {
                path: 'shelf',
                component: StoreShelf
            },
            {
                path: 'category',
                component: StoreCategory
            },
            {
                path: 'speaking',
                component: StoreSpeaking
            }
        ]
    }


]

const router = new VueRouter({
    routes,
    mode: 'history'
})

export default router