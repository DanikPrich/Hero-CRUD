import {useHttp} from '../../hooks/http.hook';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { heroesFetching, heroesFetched, heroesFetchingError, deleteHeroById } from '../../actions';
import HeroesListItem from "../heroesListItem/HeroesListItem";
import Spinner from '../spinner/Spinner';

// Задача для этого компонента:
// При клике на "крестик" идет удаление персонажа из общего состояния
// Усложненная задача:
// Удаление идет и с json файла при помощи метода DELETE

const HeroesList = () => {
    //Через селектор достаем целый стейт и деструктурируем значение 
    const {heroes, heroesLoadingStatus} = useSelector(state => state);
    const activeFilter = useSelector(state => state.activeFilter)
    const dispatch = useDispatch();
    const {request} = useHttp();

    useEffect(() => {
        dispatch(heroesFetching());
        request("http://localhost:3001/heroes")
            .then(data => dispatch(heroesFetched(data)))
            .catch(() => dispatch(heroesFetchingError()))

        // eslint-disable-next-line
    }, []);

    const onHeroDelete = useCallback((id) => {
        //Вариант с API
        // await request(`http://localhost:3001/heroes/${id}`, 'DELETE')

        // dispatch(heroesFetching())
        // request('http://localhost:3001/heroes')
        //     .then(data => dispatch(heroesFetched(data)))
        //     .catch(heroesFetchingError())

        //Вариант со стором
        dispatch(deleteHeroById(id))
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
            .filter(item => item.element === activeFilter || activeFilter === 'all')
            .map(({id, ...props}) => {
            return <HeroesListItem key={id} {...props} onHeroDelete={() => onHeroDelete(id)}/>
        })
    }

    const elements = renderHeroesList(heroes);
    return (
        <ul>
            {elements}
        </ul>
    )
}

export default HeroesList;