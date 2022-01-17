const store = {
    state: {
        hotSearchOffsetY: 0,
        flapCardVisible: false
    },
    mutations: {
        'SET_HOT_SEARCH_OFFSETY': (state, hotSearchOffsetY) => {
            state.hotSearchOffsetY = hotSearchOffsetY
        },
        'SET_FLAPCARD_VISIBLE': (state, flapCardVisible) => {
            state.flapCardVisible = flapCardVisible
        }
    }
}

export default store