const initialState = {
  heroes: [],
  heroesLoadingStatus: 'idle',
}

const heroes = (state = initialState, action) => {
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
      default: return state
  }
}

export default heroes;
