import heroes from '../reducers/heroes';
import filters from '../reducers/filters';
import { configureStore } from '@reduxjs/toolkit';

//Создаем усилитель - enhancer
//Помещаем создание стора в функцию которая вернет функцию стора с измененным диспетчем
// ...args это аргументы которые мы поместим в createStore при первом вызове, 
// const enhancer = (createStroe) => (...args) => {
//   const store = createStore(...args);

//   //дальше мы сохраняем старый диспетч, он содержится в store.dispatch
//   const oldDispatch = store.dispatch;
//   //и меняем диспетч на другую функцию в которую будут приходить экшнс
//   store.dispatch = (action) => {
//     //если как экшн нам приходит строка то мы возвращаем старый диспетч с обьектом 
//     if (typeof action === 'string') {
//       return oldDispatch({
//         type: action
//       })
//     }
//     //а если пришел обьект то мы ничего по сути не меняем и возвращаем диспетч с обьектом
//     return oldDispatch(action)
//   }
//   //возвращаем стор с измененным диспетчем
//   return store;
// }


//создаем middleware который меняет dispatch
//middleware возвращает стор (точнее его две сущности - dispatch и getState), если вдруг мы бы хотели достать значение стейта и что то с ним сделать
//Согласен что тут сложная структура где функции возращаются три раза, но это реальный пример который применяется
//Это создано для того чтобы в цепочке middleware-ов когда они запускаются друг за другом, они запускались последовательно и возвращали каждый раз диспетч
//Таким образом в итоге образуется мощная функци
//Если мы понимаем что вместо диспетч будет вызываться следующая функция у следующего middleware, мы заменяем dispatch на next
const stringMiddleware = (store) => (next) => (action) => {
  if (typeof action === 'string') {
    return next({
      type: action
    })
  }
  //а если пришел обьект то мы ничего по сути не меняем и возвращаем диспетч с обьектом
  return next(action)
}

//если вторым аргументом мы помещаем какую то функцию то она усиляет наш стор (используем компоуз для обьеденения)
//Для того чтобы применить несколько middleware мы используем функцию applyMiddleware(...middleware)
// const store = createStore(
//   combineReducers({heroes, filters}),
//   // applyMiddleware(stringMiddleware), мы можем добавить вот таким образом миддлвееры или
//   compose(applyMiddleware(thunk, stringMiddleware),  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
//   // compose(enhancer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
// );

//новая команда которая создает стор и принимает обьект параметров
const store  = configureStore({
  reducer: {heroes, filters}, // Комбинируем два редьюсера 
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(stringMiddleware), //[thunk, stringMiddleware], //подключаем дефолтные мидлвейры в массиве и добавляем новый наш мидлвейр
  devTools: process.env.NODE_ENV !== 'production', //Вместо большой строки мы просто включаем девтулз, НО если мы оставим true то в проде у нас он тоже будет активен, поэтому проверяем проект на состояние (dev, prod)
})
export default store;