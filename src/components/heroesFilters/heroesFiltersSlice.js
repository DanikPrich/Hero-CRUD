import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import { useHttp } from "../../hooks/http.hook";

const filtersAdapter = createEntityAdapter()

// const initialState = {
//   filtersLoadingStatus: 'idle',
//   filters: [],
//   activeFilter: 'all'
// }

const initialState = filtersAdapter.getInitialState({
  filtersLoadingStatus: 'idle',
  activeFilter: 'all'
})

export const fetchFilters = createAsyncThunk(
  'filters/fetchFilters',
  async () => {
    const {request} = useHttp()
    return await request('http://localhost:3001/filters')
  }
)

const heroesFiltersSlice  = createSlice({
  name: 'filters',
  initialState, 
  reducers: {
    filtersFetching: state => {state.filtersLoadingStatus = 'loading'},
    filtersFetched: (state, action) => {
      filtersAdapter.setAll(state, action.payload)
      state.filtersLoadingStatus = 'idle'
    },
    filtersFetchingError: state => {state.filtersLoadingStatus = 'error'},
    setActiveFilter: (state, action) => { state.activeFilter = action.payload },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFilters.pending, state => {state.filtersLoadingStatus = 'loading'})
    builder.addCase(fetchFilters.fulfilled, (state, action) => {
      filtersAdapter.setAll(state, action.payload);
      state.filtersLoadingStatus = 'idle'
    })
    builder.addCase(fetchFilters.rejected, state => {state.filtersLoadingStatus = 'error'})
  }
});

const {name, reducer, actions} = heroesFiltersSlice

export default reducer
export const {selectAll} = filtersAdapter.getSelectors(state => state.filters);
export const {
  filtersFetching,
  filtersFetched,
  filtersFetchingError,
  setActiveFilter
} = actions
