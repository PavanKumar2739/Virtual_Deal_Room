import { configureStore } from "@reduxjs/toolkit";
import appSlice from '../appSlice';
import pageSlice from '../pages/pageSlice';
const store = configureStore({
    reducer:{
        app: appSlice,
        page:pageSlice,
    }
});

export default store;