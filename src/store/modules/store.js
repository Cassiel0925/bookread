const store = {
    state: {
        hotSearchOffsetY: 0,
        flapCardVisible: false,
        isEditMode: false, // 是否处于编辑模式
        shelfList: [], // 书架图书列表
        shelfSelected: [], // 书架图书被选中的列表
        shelfTitleVisible: true,
        currentType: 1, // 书架列表为1 书架分类为2
        shelfCategory: []
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
        'SET_CURRENT_TYPE': (state, currentType) => {
            state.currentType = currentType
        },
        'SET_SHELF_CATEGORY': (state, shelfCategory) => {
            state.shelfCategory = shelfCategory
        },

    }
}

export default store