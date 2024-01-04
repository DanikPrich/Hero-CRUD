import { createSlice, nanoid, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

//Создаем адаптер
const heroesAdapter = createEntityAdapter();

// const initialState = {
//   heroes: [],
//   heroesLoadingStatus: 'idle',
// }

//Этот адаптер в основном используется для инициализации начального значения таким образом 
//Мы создаем начальное значение на основе нашего адаптера
const initialState = heroesAdapter.getInitialState({
  heroesLoadingStatus: 'idle',
})

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
    // heroesFetchingPayload: {
    //   reducer: (state, action) => state.heroes.push(action.payload), //2- этот пейлоад мы берем и помещаем в стор
    //   prepare: (text) => { //1 - Здесь будет нам в редьюсер заходить текст, мы его будем обрабатывать и возвращать пейлоад 
    //     const id = nanoid()
    //     return { payload: {id, text}}
    //   }
    // },
    heroesFetched: (state, action) => { 
      state.heroesLoadingStatus = 'idle'
      // state.heroes = action.payload; 
      heroesAdapter.setAll(state, action.payload)
    },
    heroesFetchingError: (state, action) => { 
      state.heroesLoadingStatus = 'error' 
    },
    createHero: (state, action) => { 
      heroesAdapter.addOne(state, action.payload)
      // state.heroes.push(action.payload) 
    },
    deleteHeroById: (state, action) => { 
      heroesAdapter.removeOne(state, action.payload)
      // state.heroes = state.heroes.filter(hero => hero.id !== action.payload)
    }
  },
  // extraReducers: это дополнительные редьюсеры которые используются для изменения в этом сторе 
  extraReducers: (builder) => { //Он использует builder api
    builder.addCase(fetchHeroes.pending, state => {state.heroesLoadingStatus = 'loading'}) //При пендинге у нас запускается loading
    builder.addCase(fetchHeroes.fulfilled, (state, action) => { // При выполненном запросе, наши данные передадутся в action 
      state.heroesLoadingStatus = 'idle'
      // state.heroes = action.payload; 

      //Устанавливаем все сущности на те что передаем
      // 1 - куда устанавливать
      // 2 - что будет приходить в стейт
      heroesAdapter.setAll(state, action.payload);
    })
    builder.addCase(fetchHeroes.rejected, state => {state.heroesLoadingStatus = 'error'})
    builder.addDefaultCase(() => {})
  }
});

//Функция нам отдаст обьект с тремя полями - имя слайса, редьюсеры и actions 
const {name, actions, reducer} = heroesSlice

//Экспортируем все нужные нам вещи
export default reducer

//Мы экспортируем селекторы (в данном случае один) с помощью функции и говорим что будем исопльзовать их с state.heroes
const {selectAll} = heroesAdapter.getSelectors(state => state.heroes)

//Функция проверяет изменилось ли значение двух этих селекторов и мемоизирует их
//Мы поместили его сюда и экспортируем чтобы переиспользовать этот же функционал в нескольких местах 
export const filteredHeroesSelector = createSelector(
  // state => state.heroes.heroes,
  selectAll, //Эта функция и так нам вернет список героев поэтому ее и передаем
  state => state.filters.activeFilter,
  (heroes, activeFilter) => heroes.filter(item => item.element === activeFilter || activeFilter === 'all')
)

export const {
  heroesFetching,
  heroesFetched,
  heroesFetchingError,
  createHero,
  deleteHeroById
} = actions