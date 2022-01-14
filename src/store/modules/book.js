const book = {
    state: {
        fileName: '',
        menuVisible: false,
        settingVisible: -1, //-1 不显示；0：字号；1：主题；2：进度；3：目录
        defaultFontSize: 16,
        currentBook: null,
        defaultFontFamily: 'Default',
        fontFamilyVisible: false,
        defaultTheme: 'Default',
        progress: 0,
        bookAvailable: false,
        section: 0,
        cover: null,
        metadata: null,
        navigation: null,
        offsetY: 0,
        isBookmark: false,
        currentTab: 1,
    },
    mutations: {
        'SET_FILENAME': (state, fileName) => {
            state.fileName = fileName
        },
        'SET_MENUVISIBLE': (state, menuVisible) => {
            state.menuVisible = menuVisible
        },
        'SET_SETTINGVISIBLE': (state, settingVisible) => {
            state.settingVisible = settingVisible
        },
        'SET_DEFAULT_FONT_SIZE': (state, defaultFontSize) => {
            state.defaultFontSize = defaultFontSize
        },
        'SET_CURRENTBOOK': (state, currentBook) => {
            state.currentBook = currentBook
        },
        'SET_DEFAULT_FONT_FAMILY': (state, defaultFontFamily) => {
            state.defaultFontFamily = defaultFontFamily
        },
        'SET_FONT_FAMILY_VISIBLE': (state, fontFamilyVisible) => {
            state.fontFamilyVisible = fontFamilyVisible
        },
        'SET_DEFAULT_THEME': (state, defaultTheme) => {
            state.defaultTheme = defaultTheme
        },
        'SET_PROGRESS': (state, progress) => {
            state.progress = progress
        },
        'SET_BOOKAVAILBLE': (state, bookAvailable) => {
            state.bookAvailable = bookAvailable
        },
        'SET_SECTION': (state, section) => {
            state.section = section
        },
        'SET_COVER': (state, cover) => {
            state.cover = cover
        },
        'SET_METADATA': (state, metadata) => {
            state.metadata = metadata
        },
        'SET_NAVIGATION': (state, navigation) => {
            state.navigation = navigation
        },
        'SET_OFFSET_Y': (state, offsetY) => {
            state.offsetY = offsetY
        },
        'SET_IS_BOOKMARK': (state, isBookmark) => {
            state.isBookmark = isBookmark
        },
        'SET_CURRENTTAB': (state, currentTab) => {
            state.currentTab = currentTab
        },
    }
}



export default book