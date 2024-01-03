//Эта функция используется сложнее чем тот же вариант со слайсами 
import { createReducer } from "@reduxjs/toolkit"

//далее нам потребуются action creators которые будут сюда импортированы чтобы мы не копипастили названия действий
//они должны быть созданы при помощи createActions
import {
    heroesFetching,
    heroesFetched,
    heroesFetchingError,
    createHero,
    deleteHeroById,
} from "../actions";

//Начальное значение оставется таким же 
const initialState = {
  heroes: [],
  heroesLoadingStatus: 'idle',
}

/* Первый вариант использования createReducer */

//Первым аргументом входит начальное значение, второе это такой обьект который позволяет строить наш редьюсер при помощи трех методов
// const heroes = createReducer(initialState, builder => {
//     //addCase рассписывает какой то кейс (аналог кейса снизу)
//     //принимает actionCreator и функцию по изменению стейта 
//     builder
//     .addCase(heroesFetching, (state, action) => {
//         //на первый взгляд мы не придерживаемся иммутабельности, потому что мы берем напрямую наш стейт и меняем его
//         //но библиотека immer.js все делает за нас внутри и возвращает новый обьект как мы это делали ниже
//         state.heroesLoadingStatus = 'loading' 
//     })
//     .addCase(heroesFetched, (state, action) => {
//         state.heroesLoadingStatus = 'idle'
//         state.heroes = action.payload;
//     })
//     .addCase(heroesFetchingError, (state, action) => {
//         state.heroesLoadingStatus = 'error' 
//     })
//     .addCase(createHero, (state, action) => {
//         state.heroes.push(action.payload)
//     })
//     .addCase(deleteHeroById, (state, action) => {
//         state.heroes = state.heroes.filter(hero => hero.id !== action.payload)
//     })
//     //дефолтный стейт который никак не меняется, мы его никак не мутируем
//     .addDefaultCase(() => {})
// })

/* второй вариант использования createReducer (НЕ РАБОТАЕТ С TypeScript */

//Способ подобный но использует НЕ buildercallback а обьект
//1 - начальный стейт
//2 - принимает обьект с динамическими ключами в виде экшнов и действием что при этом экшене делаем
//3 - массив сравнения (не нужен)
//4 - функция дефолта если ни один не совпал
const heroes = createReducer(initialState, {
    //Используем {} когда пишем в одну строчку, чтобы не возвращать ничего
    [heroesFetching]: (state, action) => { state.heroesLoadingStatus = 'loading' },
    [heroesFetched]: (state, action) => { 
            state.heroesLoadingStatus = 'idle'
            state.heroes = action.payload; 
        },
    [heroesFetchingError]: (state, action) => { 
            state.heroesLoadingStatus = 'error' 
        },
    [createHero]: (state, action) => { 
            state.heroes.push(action.payload) 
        },
    [deleteHeroById]: (state, action) => { 
                state.heroes = state.heroes.filter(hero => hero.id !== action.payload)
            }
    },
    //массив сравнения (не нужен)
    [], 
    //при дефолте вернем стейт
    state => state
)

// const heroes = (state = initialState, action) => {
//   //Если происходит работа с сервером пишем три action: FETCHING, FETCHED, FETCHING_ERROR
//   switch (action.type) {
//       case 'HEROES_FETCHING':
//           return {
//               ...state,
//               heroesLoadingStatus: 'loading'
//           }
//       case 'HEROES_FETCHED':
//           return {
//               ...state,
//               heroes: action.payload,
//               heroesLoadingStatus: 'idle'
//           }
//       case 'HEROES_FETCHING_ERROR':
//           return {
//               ...state,
//               heroesLoadingStatus: 'error'
//           }
//      case 'HEROES_CREATE':
    //           return {
    //               ...state,
    //               heroes: [...state.heroes, action.payload]
    //           }
//       case 'HEROES_DELETE_BY_ID':
//           return {
//               ...state,
//               heroes: state.heroes.filter(item => item.id !== action.payload)
//           }
//       default: return state
//   }
// }

export default heroes;
