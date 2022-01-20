const store = {
    state: {
        hotSearchOffsetY: 0,
        flapCardVisible: false,
        isEditMode: false, // 是否处于编辑模式
        shelfList: [], // 书架图书列表
        shelfSelected: [], // 书架图书被选中的列表
        shelfTitleVisible: true
    },
    mutations: {
        'SET_HOT_SEARCH_OFFSETY': (state, hotSearchOffsetY) => {
            state.hotSearchOffsetY = hotSearchOffsetY
        },
        'SET_FLAPCARD_VISIBLE': (state, flapCardVisible) => {
            state.flapCardVisible = flapCardVisible
        },
        'SET_IS_EDIT_MODE': (state, isEditMode) => {
            state.isEditMode = isEditMode
        },
        'SET_SHELF_LIST': (state, shelfList) => {
            state.shelfList = shelfList
        },
        'SET_SHELF_SELECTED': (state, shelfSelected) => {
            state.shelfSelected = shelfSelected
        },
        'SET_SHELF_TITLE_VISIBLE': (state, shelfTitleVisible) => {
            state.shelfTitleVisible = shelfTitleVisible
        },

    }
}

export default store