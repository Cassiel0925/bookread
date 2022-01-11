import Vue from 'vue'
import VueRouter from 'vue-router'

const Ebook = () =>
    import ('views/ebook/Ebook')
const EbookReader = () =>
    import ('components/ebook/EbookReader')

Vue.use(VueRouter)

const routes = [{
        path: '',
        redirect: '/ebook'
    }, {
        path: '/ebook',
        component: Ebook,
        children: [{
            path: ':fileName',
            component: EbookReader
        }]
    },


]

const router = new VueRouter({
    routes,
    mode: 'history'
})

export default router