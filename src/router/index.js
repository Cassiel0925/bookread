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
        redirect: '/store/home',
        children: [{
                path: 'home',
                component: StoreHome
            },
            {
                path: 'detail',
                component: StoreDetail
            },
        ]
    }


]

const router = new VueRouter({
    routes,
    mode: 'history'
})

export default router