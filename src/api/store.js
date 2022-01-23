import axios from 'axios'
import { setLocalForage } from 'utils/localForage'

export function home() {
    return axios({
        method: 'get',
        url: 'http://localhost:8080/book/home'
    })
}

export function detail(book) {
    return axios({
        method: 'get',
        url: 'http://47.99.166.157:3000/book/detail',
        params: {
            fileName: book.fileName
        }
    })
}

export function list() {
    return axios({
        method: 'get',
        url: 'http://localhost:8080/book/list'
    })
}

export function shelf() {
    return axios({
        method: 'get',
        url: 'http://localhost:8080/book/shelf'
    })
}

export function download(book, onSuccess, onError, onProgress) {
    if (!onProgress) {
        onProgress = onError
        onError = null
    }
    return axios.create({
            baseURL: 'http://localhost:9091/epub',
            method: 'get',
            responseType: 'blob',
            timeout: 180 * 1000,
            onDownloadProgress: progressEvent => {
                if (onProgress) onProgress(progressEvent)
            }
        }).get(`${book.categoryText}/${book.fileName}.epub`)
        .then(res => {
            const blob = new Blob([res.data])
            setLocalForage(book.fileName, blob, () => {
                if (onSuccess) onSuccess(book)
            }, err => {
                if (onError) onError(err)
            })
        }).catch(err => {
            if (onError) onError(err)
        })
}

export function flatList() {
    return axios({
        method: 'get',
        url: 'http://47.99.166.157:3000/book/flat-list'
    })
}