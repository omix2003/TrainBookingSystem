import './App.css'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { register, loginUser, loginAdmin, logoutUser, logoutAdmin } from './store/authSlice.js'
import { Outlet } from 'react-router-dom'

function App() {

    return (
        <div className='w-full h-screen p-0 m-0'>
            <main className='w-full h-screen flex justify-center items-center p-0 m-0'>
                <Outlet />
            </main>
        </div>
    )
}

export default App
