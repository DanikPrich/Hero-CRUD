
// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

import { useDispatch, useSelector } from "react-redux";
import classNames from 'classnames/bind';
import { selectAll, setActiveFilter } from "./heroesFiltersSlice";
import Spinner from "../spinner/Spinner";
import store from "../../store";


const HeroesFilters = () => {

    const { activeFilter, filtersLoadingStatus } = useSelector(state => state.filters)
    const filters = selectAll(store.getState())
    const dispatch = useDispatch()
    
    const setButtonClass = (elemValue) => {
        return classNames('btn', {
            'btn-outline-dark': elemValue === 'all',
            'btn-outline-danger': elemValue === 'fire',
            'btn-outline-primary': elemValue === 'water',
            'btn-outline-success': elemValue === 'wind',
            'btn-outline-secondary': elemValue === 'earth',
            'active': activeFilter === elemValue,
         })
    }

    const onFilterChanged = (newActiveFilter) => {
        dispatch(setActiveFilter(newActiveFilter))
    }

    const filtersBtnGroup = (filters) => {
        return filters.map((elem, i) => {
            return <button key={i} className={setButtonClass(elem.value)} onClick={() => onFilterChanged(elem.value)}>{elem.text}</button>
        })
    }

    const filtersGroup = (filters, loadingStatus) => {
        const buttons = filtersBtnGroup(filters)
        if(loadingStatus === 'loading') {
            return <Spinner/>
        } else if(loadingStatus === 'error') {
            return <div>Something went wrong</div>
        }
        
        return <div className="btn-group"> {buttons} </div>
    }

    
    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Filter the characters by elements</p>
                {filtersGroup(filters, filtersLoadingStatus)}
            </div>
        </div>
    )
}

export default HeroesFilters;