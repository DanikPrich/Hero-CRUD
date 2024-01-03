import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  heroes: [],
  heroesLoadingStatus: 'idle',
}

//Создаем slice через функцию 
//Принимает 4 аргумента: 
// 1 - имя или пространство имен создаваемых действий 
// 2 - начальное состояние редьюсера 
// 3 - reducers - обьект с обрабочиками 
// 4 - extra reducers - обьект с редьюсерами другого слайса - например для того чтобы поменять значение другого редьюсера
const heroesSlice  = createSlice({
  name: 'heroes',
  initialState,
  
  reducers: { //Здесь будут записываться action creators
    //название состоит из названия слайса + действие - heroes Fetching
    heroesFetching: state => {
      state.heroesLoadingStatus = 'loading' // не забываем что с immerJs мы можем вот так мутабельно записывать
    }, 
    //Для того чтобы подготовить какие то данные к отправке в стор, мы можем записывать обьект с reducer и prepare 
    heroesFetchingPayload: {
      reducer: (state, action) => state.heroes.push(action.payload), //2- этот пейлоад мы берем и помещаем в стор
      prepare: (text) => { //1 - Здесь будет нам в редьюсер заходить текст, мы его будем обрабатывать и возвращать пейлоад 
        const id = nanoid()
        return { payload: {id, text}}
      }
    },
    heroesFetched: (state, action) => { 
      state.heroesLoadingStatus = 'idle'
      state.heroes = action.payload; 
    },
    heroesFetchingError: (state, action) => { 
      state.heroesLoadingStatus = 'error' 
    },
    createHero: (state, action) => { 
      state.heroes.push(action.payload) 
    },
    deleteHeroById: (state, action) => { 
      state.heroes = state.heroes.filter(hero => hero.id !== action.payload)
    }
  },
  // extraReducers: это дополнительные редьюсеры которые используются для изменения в этом сторе 
});

//Функция нам отдаст обьект с тремя полями - имя слайса, редьюсеры и actions 
const {name, actions, reducer} = heroesSlice

//Экспортируем все нужные нам вещи
export default reducer
export const {
  heroesFetching,
  heroesFetched,
  heroesFetchingError,
  createHero,
  deleteHeroById
} = actions