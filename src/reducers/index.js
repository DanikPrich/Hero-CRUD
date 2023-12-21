const initialState = {
    heroes: [],
    heroesLoadingStatus: 'idle',
    filtersLoadingStatus: 'idle',
    filters: [],
    activeFilter: 'all'
}

const reducer = (state = initialState, action) => {
    //Если происходит работа с сервером пишем три action: FETCHING, FETCHED, FETCHING_ERROR
    switch (action.type) {
        case 'HEROES_FETCHING':
            return {
                ...state,
                heroesLoadingStatus: 'loading'
            }
        case 'HEROES_FETCHED':
            return {
                ...state,
                heroes: action.payload,
                heroesLoadingStatus: 'idle'
            }
        case 'HEROES_FETCHING_ERROR':
            return {
                ...state,
                heroesLoadingStatus: 'error'
            }
        case 'HEROES_DELETE_BY_ID':
            return {
                ...state,
                heroes: state.heroes.filter(item => item.id !== action.payload)
            }
        case 'FILTERS_FETCHING':
            return {
                ...state,
                filtersLoadingStatus: 'loading'
            }
        case 'FILTERS_FETCHED':
            return {
                ...state,
                filters: action.payload,
                filtersLoadingStatus: 'idle'
            }
        case 'FILTERS_FETCHING_ERROR':
            return {
                ...state,
                filtersLoadingStatus: 'error'
            }
        case 'SET_ACTIVE_FILTER':
            return {
                ...state,
                activeFilter: action.payload
            }
        default: return state
    }
}

export default reducer;