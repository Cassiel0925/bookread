const actions = {
    setFileName: ({ commit }, fileName) => {
        return commit('SET_FILENAME', fileName)
    },
    setMenuVisible: ({ commit }, menuVisible) => {
        return commit('SET_MENUVISIBLE', menuVisible)
    },
    setSettingVisible: ({ commit }, settingVisible) => {
        return commit('SET_SETTINGVISIBLE', settingVisible)
    },
    setDefaultFontSize: ({ commit }, defaultFontSize) => {
        return commit('SET_DEFAULT_FONT_SIZE', defaultFontSize)
    },
    setCurrentBook: ({ commit }, currentBook) => {
        return commit('SET_CURRENTBOOK', currentBook)
    },
    setDefaultFontFamily: ({ commit }, defaultFontFamily) => {
        return commit('SET_DEFAULT_FONT_FAMILY', defaultFontFamily)
    },
    setFontFamilyVisible: ({ commit }, fontFamilyVisible) => {
        return commit('SET_FONT_FAMILY_VISIBLE', fontFamilyVisible)
    },
    setDefaultTheme: ({ commit }, defaultTheme) => {
        return commit('SET_DEFAULT_THEME', defaultTheme)
    },
    setProgress: ({ commit }, progress) => {
        return commit('SET_PROGRESS', progress)
    },
    setBookAvailable: ({ commit }, bookAvailable) => {
        return commit('SET_BOOKAVAILBLE', bookAvailable)
    },
    setSection: ({ commit }, section) => {
        return commit('SET_SECTION', section)
    },
    setCover: ({ commit }, cover) => {
        return commit('SET_COVER', cover)
    },
    setMetadata: ({ commit }, metadata) => {
        return commit('SET_METADATA', metadata)
    },
    setNavigation: ({ commit }, navigation) => {
        return commit('SET_NAVIGATION', navigation)
    },
    setOffsetY: ({ commit }, offsetY) => {
        return commit('SET_OFFSET_Y', offsetY)
    },
    setIsBookmark: ({ commit }, isBookmark) => {
        return commit('SET_IS_BOOKMARK', isBookmark)
    },
    setCurrentTab: ({ commit }, currentTab) => {
        return commit('SET_CURRENTTAB', currentTab)
    },
    // home
    setHotSearchOffsetY: ({ commit }, hotSearchOffsetY) => {
        return commit('SET_HOT_SEARCH_OFFSETY', hotSearchOffsetY)
    },
    setFlapCardVisible: ({ commit }, flapCardVisible) => {
        return commit('SET_FLAPCARD_VISIBLE', flapCardVisible)
    },
    setIsEditMode: ({ commit }, isEditMode) => {
        return commit('SET_IS_EDIT_MODE', isEditMode)
    },
    setShelfList: ({ commit }, shelfList) => {
        return commit('SET_SHELF_LIST', shelfList)
    },
    setShelfSelected: ({ commit }, shelfSelected) => {
        return commit('SET_SHELF_SELECTED', shelfSelected)
    },
    setShelfTitleVisible: ({ commit }, shelfTitleVisible) => {
        return commit('SET_SHELF_TITLE_VISIBLE', shelfTitleVisible)
    },
}

export default actions