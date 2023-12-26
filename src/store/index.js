import { createStore, combineReducers, compose } from 'redux';
import reducer from '../reducers';
import heroes from '../reducers/heroes';
import filters from '../reducers/filters';

//Создаем усилитель - enhancer
//Помещаем создание стора в функцию которая вернет функцию стора с измененным диспетчем
// ...args это аргументы которые мы поместим в createStore при первом вызове, 
const enhancer = (createStroe) => (...args) => {
  const store = createStore(...args);

  //дальше мы сохраняем старый диспетч, он содержится в store.dispatch
  const oldDispatch = store.dispatch;
  //и меняем диспетч на другую функцию в которую будут приходить экшнс
  store.dispatch = (action) => {
    //если как экшн нам приходит строка то мы возвращаем старый диспетч с обьектом 
    if (typeof action === 'string') {
      return oldDispatch({
        type: action
      })
    }
    //а если пришел обьект то мы ничего по сути не меняем и возвращаем диспетч с обьектом
    return oldDispatch(action)
  }
  //возвращаем стор с измененным диспетчем
  return store;
}

//если вторым аргументом мы помещаем какую то функцию то она усиляет наш стор  
const store = createStore(combineReducers({heroes, filters}), enhancer);


export default store;