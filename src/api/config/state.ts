import {
  PayloadAction,
  configureStore,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import { LetterItem, LetterPartiItem } from '../model/LetterModel';

// 편지 작성한 내용들
const jsonSlice = createSlice({
  name: 'writeData',
  initialState: {
    data: [] as string[],
  },
  reducers: {
    addData: (state, action: PayloadAction<object>) => {
      const stringifiedData = JSON.stringify(action.payload);
      state.data.push(stringifiedData);
    },
    clearData: (state) => {
      state.data = [];
    },
  },
});
const persistConfig = {
  key: 'writeData',
  storage,
};
const persistedReducer = persistReducer(persistConfig, jsonSlice.reducer);

// 편지 작성 순서
const orderSlice = createSlice({
  name: 'orderData',
  initialState: {
    data: [] as string[],
  },
  reducers: {
    setOrderData: (state, action: PayloadAction<object[]>) => {
      const stringifiedData = action.payload.map((item) =>
        JSON.stringify(item),
      );
      state.data = stringifiedData;
    },
    clearOrderData: (state) => {
      state.data = [];
    },
  },
});
const orderPersistConfig = {
  key: 'orderData',
  storage,
};
const orderReducer = persistReducer(orderPersistConfig, orderSlice.reducer);

export const store = configureStore({
  reducer: {
    writeData: persistedReducer,
    orderData: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export const { addData, clearData } = jsonSlice.actions;
export const selectData = (state: { writeData: { data: string[] } }) =>
  state.writeData.data;
export const selectParsedData = createSelector([selectData], (data) =>
  data.map((item) => JSON.parse(item) as LetterItem),
);

export const { setOrderData, clearOrderData } = orderSlice.actions;
export const selectOrderData = (state: { orderData: { data: string[] } }) =>
  state.orderData.data;
export const selectParsedOrderData = createSelector(
  [selectOrderData],
  (orderData) => orderData.map((item) => JSON.parse(item) as LetterPartiItem),
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
