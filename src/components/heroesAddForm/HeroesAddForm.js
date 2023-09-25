import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

import {useHttp} from '../../hooks/http.hook';

import { useDispatch, useSelector } from 'react-redux';
import { heroesFetched, heroesFetchingError } from '../../actions';


// Задача для этого компонента:
// Реализовать создание нового героя с введенными данными. Он должен попадать
// в общее состояние и отображаться в списке + фильтроваться
// Уникальный идентификатор персонажа можно сгенерировать через uiid
// Усложненная задача:
// Персонаж создается и в файле json при помощи метода POST
// Дополнительно:
// Элементы <option></option> желательно сформировать на базе
// данных из фильтров

const HeroesAddForm = () => {
    const {request} = useHttp();

    const [name, setName] = useState('')
    const [text, setText] = useState('')
    const [element, setElement] = useState('')

    const dispatch = useDispatch();

    const { filters } = useSelector(state => state)

    const  onSubmit = async (e) => {
        e.preventDefault()
        const data = {
            id: uuidv4(),
            name: name,
            description: text,
            element: element
        }
        await request('http://localhost:3001/heroes', 'POST', JSON.stringify(data))
        request("http://localhost:3001/heroes")
            .then(data => dispatch(heroesFetched(data)))
            .catch(() => dispatch(heroesFetchingError()))

        setName('')
        setText('')
        setElement('')
    }

    const SelectComponent = () => {
        const Options = () => {
            return filters.map((filter, i) => {
                return <option key={i} value={filter.value}>{filter.title}</option>
            })
        }
        return (
            <select 
                required
                className="form-select" 
                id="element" 
                name="element"
                value={element}
                onChange={(e) => setElement(e.target.value)}
            >
                <option>I have element...</option>
                <Options />
            </select>
        )
    }



    return (
        <form className="border p-4 shadow-lg rounded" onSubmit={onSubmit}>
            <div className="mb-3">
                <label htmlFor="name" className="form-label fs-4">Name for the hero</label>
                <input 
                    required
                    type="text" 
                    name="name" 
                    value={name}
                    className="form-control" 
                    id="name" 
                    placeholder="Как меня зовут?"
                    onChange={(e) => setName(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="text" className="form-label fs-4">Description</label>
                <textarea
                    required
                    name="text" 
                    value={text}
                    className="form-control" 
                    id="text" 
                    placeholder="Что я умею?"
                    style={{"height": '130px'}}
                    onChange={(e) => setText(e.target.value)}/>
            </div>

            <div className="mb-3">
                <label htmlFor="element" className="form-label">Select hero element</label>
                <SelectComponent />
            </div>

            <button type="submit" className="btn btn-primary">Create</button>
        </form>
    )
}

export default HeroesAddForm;