

// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

import { useState, useEffect} from 'react'
import { v4 as uuidv4 } from 'uuid';
import {useHttp} from '../../hooks/http.hook';
import { useDispatch, useSelector } from 'react-redux';
import { fetchHeroes, fetchFilters} from '../../actions';

const HeroesAddForm = () => {
    const {request} = useHttp();
    const dispatch = useDispatch();
    const {filters} = useSelector(state => state.filters)

    const [name, setName] = useState('')
    const [description, setDescripton] = useState('')
    const [element, setElement] = useState('')

    useEffect(() => {
        dispatch(fetchFilters(request))
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const  createHero = async (e) => {
        e.preventDefault()

        const data = {
            id: uuidv4(),
            name,
            description,
            element,
        }

        await request('http://localhost:3001/heroes', 'POST', JSON.stringify(data))
        dispatch(fetchHeroes(request))
        setName('')
        setDescripton('')
        setElement('')
    }

    const filtersOptions = (filters) => {
        return filters
        .filter(elem => elem.value !== 'all')
        .map((elem, index) => <option key={index} value={elem.value}>{elem.text}</option>)
    }

    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={createHero}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Name of the new hero</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    className="form-control" 
                    id="name" 
                    placeholder="What's my name?"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Description</label>
                <textarea
                    required
                    name="text" 
                    className="form-control" 
                    id="text" 
                    placeholder="What can I do?"
                    value={description}
                    onChange={(e) => setDescripton(e.target.value)}
                    style={{"height": '130px'}}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Choose the hero's element</label>
                <select 
                    required
                    className="form-select" 
                    id="element" 
                    name="element"
                    value={element}
                    onChange={(e) => setElement(e.target.value)}
                    >
                    <option hidden value="hello">I wield the element of...</option>
                    {filtersOptions(filters)}
                </select>
            </div>

            <button type="submit" className="btn btn-primary">Create</button>
        </form>
    )
}


export default HeroesAddForm;