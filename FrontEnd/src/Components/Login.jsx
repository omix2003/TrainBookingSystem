import React, { useState } from 'react'
import { Input, Button } from "./index.js"
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { loginUser } from '../store/authSlice.js'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

export default function Login() {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors } } = useForm()

    const notify = (message, state) => {
        if (state === true)
            toast.success(message, {
                autoClose: 3000,
                theme: 'colored'
            })
        else
            toast.error(message, {
                autoClose: 3000,
                theme: 'colored'
            })
    }

    const selectErrorType = (message) => {
        if (message === "User does not exist")
            notify("User not found. Please check your username and try again.", false)
        else if (message === "Password is incorrect")
            notify("Incorrect password. Please check your password and try again.", false)
        else
            notify("Login failed due to a server error. Please try again later.", false)
    }

    const loginToAccount = async (data) => {
        try {
            const response = await fetch('/api/v1/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            // if (!response.ok)
            //     throw new Error('network error')

            const result = await response.json();

            if (!result.success)
                selectErrorType(result.message)
            else {
                notify("Login successful. Welcome back!", true)
                dispatch(loginUser(result.data));

                navigate('/');
            }

        } catch (error) {
            console.error("Error: ", error)
        }
    }

    const loginHandler = (data) => {
        setTimeout(() => {
            loginToAccount(data)
        }, 500)
    }

    return (
        <div className='w-full h-screen flex justify-center items-center' style={{ backgroundImage: 'linear-gradient(135deg,#ffffff, #f97316)' }}>
            <ToastContainer style={{ width: "400px" }} />
            <div className='w-7/12 h-5/6 mt-10 flex items-center justify-center bg-white shadow-2xl rounded-lg overflow-hidden'>
                <img src='../../photos/Untitled.png' className='w-5/12 h-full object-cover' />
                <form onSubmit={handleSubmit(loginHandler)} className='w-7/12 h-full p-10 flex flex-col items-center justify-center'>
                    <h2 className='text-orange-600 text-3xl font-semibold mb-8'>Login to account</h2>
                    <div className='w-full flex flex-col items-center justify-center gap-y-4'>
                        <div className='w-full h-16 flex flex-col items-start justify-center'>
                            <Input
                                label="Username"
                                type="text"
                                {...register("username", {
                                    required: "Username is required"
                                })}
                                autoFocus
                                error={errors.username?.message}
                                className="w-11/12 border-gray-300 rounded-lg shadow-inner focus:outline-none focus:border-orange-500"
                            />
                            {errors.username && <span className='text-red-600 pl-5 mb-5'>{errors.username.message}</span>}
                        </div>
                        <div className='w-full h-16 flex flex-col items-start justify-center'>
                            <Input label="Password" type="password"
                                {...register("password", {
                                    required: "Password is required"
                                })}
                                className="w-11/12 border-gray-300 rounded-lg shadow-inner focus:outline-none"
                            />
                            {errors.password && <span className='text-red-600 pl-5 '>{errors.password.message}</span>}
                        </div>
                        <div className='w-full flex flex-col'>
                            <div className='text-center mt-3'>
                                <p className='inline'>Don't have an account? &nbsp;</p>
                                <Link to="/register" className='text-orange-500 hover:font-medium'>
                                    Sign Up
                                </Link>
                            </div>
                            <div className='text-center mt-3'>
                                <p className='inline'>Are you an admin? &nbsp;</p>
                                <Link to="/admin" className='text-orange-500 hover:font-medium'>
                                    Admin Login
                                </Link>
                            </div>
                        </div>

                    </div>
                    <Button type='submit' className='mt-5 w-9/12 py-2 bg-orange-500 text-white text-lg rounded-lg hover:bg-orange-600 transition duration-300 shadow-lg'>
                        Login
                    </Button>
                </form>
            </div>
        </div>

    )
}
