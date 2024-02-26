import { configureStore } from '@reduxjs/toolkit'

import authUserSlice from './features/authUser/authUserSlice'
export const makeStore = () => {
  return configureStore({
    reducer: {

      authUser: authUserSlice
    }

  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']