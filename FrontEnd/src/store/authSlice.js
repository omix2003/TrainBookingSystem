import { createSlice } from "@reduxjs/toolkit";

console.log('authStatus:', localStorage.getItem('authStatus'));
console.log('isAdmin:', localStorage.getItem('isAdmin'));
console.log('userData:', JSON.parse(localStorage.getItem('userData')));

const initialState = {
    status: localStorage.getItem('authStatus') === 'true',
    isAdmin: localStorage.getItem('isAdmin') === 'true',
    userData: localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        register: (state, action) => {
            state.status = true;
            state.userData = action.payload;
            state.isAdmin = false;
            localStorage.setItem('authStatus', 'true');
            localStorage.setItem('isAdmin', 'false');
            localStorage.setItem('userData', JSON.stringify(action.payload));
        },
        loginUser: (state, action) => {
            state.status = true;
            state.userData = action.payload;
            state.isAdmin = false;
            localStorage.setItem('authStatus', 'true');
            localStorage.setItem('isAdmin', 'false');
            localStorage.setItem('userData', JSON.stringify(action.payload));
        },
        loginAdmin: (state, action) => {
            state.status = true;
            state.userData = action.payload;
            state.isAdmin = true;
            localStorage.setItem('authStatus', 'true');
            localStorage.setItem('isAdmin', 'true');
            localStorage.setItem('userData', JSON.stringify(action.payload));
        },
        logoutUser: (state) => {
            state.status = false;
            state.userData = null;
            state.isAdmin = false;
            localStorage.removeItem('authStatus');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('userData');
        },
        logoutAdmin: (state) => {
            state.status = false;
            state.userData = null;
            state.isAdmin = true;
            localStorage.removeItem('authStatus');
            localStorage.removeItem('isAdmin');
            localStorage.removeItem('userData');
        }
    }
})

export const { register, loginUser, logoutUser, loginAdmin, logoutAdmin } = authSlice.actions;

export default authSlice.reducer;
