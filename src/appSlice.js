import {createSlice}  from "@reduxjs/toolkit"

const initialState ={
    snakebarOpen : false,
    type:'error',
    message:''
}

const appSlice = createSlice({
   name:'app',
   initialState,
    reducers:{
        setSnackbarOpen:(state,action)=>{
            state.snakebarOpen = action.payload.open;
            state.type = action.payload.type;
            state.message = action.payload.message;
        },
        setOpen:(state, action)=>{
            state.snakebarOpen = action.payload.payload;
        }
    }
});

export const {setSnackbarOpen} = appSlice.actions;

export default appSlice.reducer;