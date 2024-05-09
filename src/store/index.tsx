import { createSlice, configureStore, createAsyncThunk } from '@reduxjs/toolkit';

export const incrementAsync = createAsyncThunk(
  'counter/increment', 
  async (params, {dispatch}) => {
    console.log(params)
    await new Promise(rosolve => setTimeout(rosolve, 1000))
    dispatch(increment())
  }
)

export const counterSlice = createSlice({
  name: 'counter',
  initialState: {
    value: 0
  },
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(incrementAsync.fulfilled, (state, action) => {
      console.log(state, action)
    });
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions

// const reducer = counterSlice.reducer

export default configureStore({
  reducer: {
    counter: counterSlice.reducer
  }
})
