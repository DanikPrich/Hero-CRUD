import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';

import { setActiveFilter } from '../../actions';


// Задача для этого компонента:
// Фильтры должны формироваться на основании загруженных данных
// Фильтры должны отображать только нужных героев при выборе
// Активный фильтр имеет класс active
// Изменять json-файл для удобства МОЖНО!
// Представьте, что вы попросили бэкенд-разработчика об этом

const HeroesFilters = () => {

    const filters = useSelector(store => store.filters)
    const activeFilter = useSelector(store => store.activeFilter)

    const dispatch = useDispatch()

    const renderButtons = (filters) => {
        return filters.map((filter, i) => {
            
    const btnClass = classNames('btn', {
        'btn-danger': filter.value === 'fire',
        'btn-primary': filter.value === 'water',
        'btn-success': filter.value === 'wind',
        'btn-secondary': filter.value === 'earth',
        'btn-outline-dark': filter.value === 'all',
        'active': activeFilter === filter.value
    })

            return <button 
                    className={btnClass} 
                    key={i} 
                    data-value={filter.value} 
                    onClick={(e) => dispatch(setActiveFilter(e.target.getAttribute('data-value')))}
                   >
                    {filter.title}
                   </button>
        })
    }

    const buttons = renderButtons(filters)

    return (
        <div className="card shadow-lg mt-4">
            <div className="card-body">
                <p className="card-text">Filtering heroes by elememt</p>
                <div className="btn-group">
                    {buttons}
                </div>
            </div>
        </div>
    )
}

export default HeroesFilters;