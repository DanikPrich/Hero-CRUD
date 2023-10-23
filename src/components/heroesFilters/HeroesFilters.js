import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';

import { setActiveFilter, filtersFetched } from '../../actions';
import { useEffect } from 'react';
import {useHttp} from '../../hooks/http.hook';

const HeroesFilters = () => {

    const filters = useSelector(store => store.filters.filters)
    const activeFilter = useSelector(store => store.filters.activeFilter)
    const {request} = useHttp();

    const dispatch = useDispatch()

    useEffect(() => {
        request('http://localhost:3001/filters')
            .then(data => dispatch(filtersFetched(data)))
    }, []);

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