import {useHttp} from '../../hooks/http.hook';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


// import { fetchHeroes } from '../../actions'; //Эта функция идет из экшенов так как мы не можем ее никуда поместить кроме этого
import { deleteHeroById, fetchHeroes, selectAll, filteredHeroesSelector } from './heroesSlice'; //Редьюсер берется из слайса 
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
    //Через селектор достаем целый стейт и деструктурируем значение 
    // const filteredHeroes = useSelector(state => {
    //     return state.heroes.heroes.filter(item => item.element === state.filters.activeFilter || state.filters.activeFilter === 'all')
    // })

    //Мы вырезали функцию селектор отфильтрованных героев из этого файла и поместили в слайс
   
    const filteredHeroes = useSelector(filteredHeroesSelector)
    const heroesLoadingStatus = useSelector(state => state.heroes.heroesLoadingStatus);
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(fetchHeroes())
        // eslint-disable-next-line
    }, []);

    const onHeroDelete = useCallback( async (id) => {
        //Вариант с API
        await request(`http://localhost:3001/heroes/${id}`, 'DELETE')
        dispatch(fetchHeroes(request))

        //Вариант со стором
        // dispatch(deleteHeroById(id))
        //eslint-disable-next-line
    }, [request])

    if (heroesLoadingStatus === "loading") {
        return <Spinner/>;
    } else if (heroesLoadingStatus === "error") {
        return <h5 className="text-center mt-5">Ошибка загрузки</h5>
    }

    const renderHeroesList = (arr) => {
        if (arr.length === 0) {
            return <h5 className="text-center mt-5">Героев пока нет</h5>
        }

        return arr
            
            .map(({id, ...props}) => {
            return <HeroesListItem key={id} {...props} onHeroDelete={() => onHeroDelete(id)}/>
        })
    }

    const elements = renderHeroesList(filteredHeroes);
    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;