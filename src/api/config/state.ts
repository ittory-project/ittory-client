import { createSlice, PayloadAction, configureStore } from '@reduxjs/toolkit';
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';

export interface LetterItem {
  elementId: string,
  imageUrl?: string,
  content?: string,
  nickname?: string,
  elementSequence?: number,
  writeSequence?: number,
}

const jsonSlice = createSlice({
  name: 'jsonData',
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
  key: 'root',
  storage,
};

const persistedReducer = persistReducer(persistConfig, jsonSlice.reducer);

export const store = configureStore({
  reducer: {
    jsonData: persistedReducer,
  },
});

export const persistor = persistStore(store);
export const { addData, clearData } = jsonSlice.actions;
export const selectData = (state: { jsonData: { data: string[] } }) => state.jsonData.data;

export const selectParsedData = (state: { jsonData: { data: string[] } }) => 
  state.jsonData.data.map(item => JSON.parse(item) as LetterItem);