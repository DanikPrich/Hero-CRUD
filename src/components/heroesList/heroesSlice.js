import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const initialState = {
  heroes: [],
  heroesLoadingStatus: 'idle',
}

//Создаем экшн с асинхронной фукнцией
// 1 - название нашего среза / название экшена 
// 2 - функция которая должна вернуть промис 
export const fetchHeroes = createAsyncThunk(
  'heroes/fetchHeroes', 
  async (id, thunkApi) => { //функция принимает 1 аргумент который мы передали при вызове, 2 - thunkAPI (это и dispatch, getState и другие)
    const {request} = useHttp(); //получаем реквест чтобы дальше его использовать
    return await request("http://localhost:3001/heroes") //возвращаем промис - что нам и надо. Эти данные отправятся и обработаются
  }
)


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
  extraReducers: (builder) => { //Он использует builder api
    builder.addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'}) //При пендинге у нас запускается loading
    builder.addCase(fetchHeroes.fulfilled, (state, action) => { // При выполненном запросе, наши данные передадутся в action 
      state.heroesLoadingStatus = 'idle'
      state.heroes = action.payload; 
    })
    builder.addCase(fetchHeroes.rejected, state => {state.heroesLoadingStatus = 'error'})
    builder.addDefaultCase(() => {})
  }
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