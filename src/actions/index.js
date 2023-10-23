export const heroesFetching = () => {
    return {
        type: 'HEROES_FETCHING'
    }
}

export const heroesFetched = (heroes) => {
    return {
        type: 'HEROES_FETCHED',
        payload: heroes
    }
}

export const heroesFetchingError = () => {
    return {
        type: 'HEROES_FETCHING_ERROR'
    }
}

export const filtersFetched = (filters) => {
    return {
        type: 'FILTERS_FETCHED',
        payload: filters
    }
}

export const heroDeleted = (id) => {
    return {
        type: 'HERO_DELETED',
        payload: id
    }
}

export const setActiveFilter = (activeFilter) => {
    return {
        type: 'SET_ACTIVE_FILTER',
        payload: activeFilter
    }
}