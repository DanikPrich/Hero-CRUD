import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  filtersLoadingStatus: 'idle',
  filters: [],
  activeFilter: 'all'
}

const heroesFiltersSlice  = createSlice({
  name: 'filters',
  initialState, 
  reducers: {
    filtersFetching: state => {state.filtersLoadingStatus = 'loading'},
    filtersFetched: (state, action) => {
      state.filters = action.payload
      state.filtersLoadingStatus = 'idle'
    },
    filtersFetchingError: state => {state.filtersLoadingStatus = 'error'},
    setActiveFilter: (state, action) => {state.activeFilter = action.payload},
  },
});

const {name, reducer, actions} = heroesFiltersSlice

export default reducer
export const {
  filtersFetching,
  filtersFetched,
  filtersFetchingError,
  setActiveFilter
} = actions
