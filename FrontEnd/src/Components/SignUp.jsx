import React from 'react'
import { Input, Button } from "./index.js"
import { Link, useNavigate } from 'react-router-dom'
import { register as registerUser } from '../store/authSlice.js'
import { useDispatch } from 'react-redux'
import { useForm } from 'react-hook-form'
import { ToastContainer, toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";

export default function SignUp() {
    const dispatch = useDispatch()
    const { register, handleSubmit, formState: { errors } } = useForm()

    const navigate = useNavigate()

    const notify = (message, state) => {
        if (state === true)
            toast.success(message, {
                autoClose: 3000
            })
        else
            toast.error(message, {
                autoClose: 3000
            })
    }

    const selectErrorType = (message) => {
        if (message === "User already exist with same username or Mobile No or email")
            notify(message, false)
        else
            notify("Sign Up failed due to a server error. Please try again later.", false)
    }

    const createAccount = async (data) => {
        try {
            const response = await fetch('/api/v1/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            // if (!response.ok) {
            //     throw new Error('Network error');
            // }

            const result = await response.json();

            if (!result.success)
                selectErrorType(result.message)
            else {
                notify(result.message, true)
                dispatch(registerUser(result.data));
                navigate('/')
            }

        } catch (error) {
            console.error('Error:', error);
        }
    }

    const accountHandler = (data) => {
        setTimeout(() => {
            createAccount(data)
        }, 500)
    }


    return (
        <div className='w-full h-screen flex justify-center items-center' style={{ backgroundImage: 'linear-gradient(135deg,#ffffff, #f97316)' }}>
            <ToastContainer style={{ width: "480px" }} />
            <div className='w-10/12 h-screen p-10 pb-20 flex justify-center items-center flex-col gap-y-6' >
                <div className='h-full w-full flex justify-center items-center'>
                    <img className='w-4/12 h-full rounded-l-xl shadow-lg' src="../../photos/Untitled.png" />
                    <form className='w-8/12 h-full px-16 rounded-r-xl flex justify-center items-center flex-col border-2 border-gray-300 bg-white shadow-2xl gap-4' onSubmit={handleSubmit(accountHandler)}>
                        <h2 className='text-center mt-4 text-orange-600 text-3xl font-semibold'>Sign Up to Create Account</h2>
                        <div className='w-full flex flex-col justify-center items-center mt-6 gap-4'>
                            <div className='flex justify-between gap-10'>
                                <div className='flex h-16 flex-col w-full items-start justify-center'>
                                    <Input label="Full Name"
                                        autoFocus
                                        {...register("name", {
                                            required: "Full name is required"
                                        })}
                                        className="w-full border-gray-300 p-2 rounded-lg shadow-inner"
                                    />
                                    {errors.name && <span className=' text-red-600 pl-5'>{errors.name.message}</span>}
                                </div>
                                <div className='flex h-16 flex-col w-full items-start justify-center'>
                                    <Input label="Username"
                                        {...register("username", {
                                            required: "Username is required"
                                        })}
                                        className="w-full border-gray-300 p-2 rounded-lg shadow-inner "
                                    />
                                    {errors.username && <span className=' text-red-600 pl-5'>{errors.username.message}</span>}
                                </div>
                            </div>
                            <div className='flex h-16 flex-col mt-2 w-full items-start justify-center'>
                                <Input label="Email" type="email"
                                    {...register("email", {
                                        required: "Email is required",
                                        validate: {
                                            matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                                "Email address must be in valid format",
                                        }
                                    })}
                                    className="w-full border-gray-300 p-2 rounded-lg shadow-inner"
                                />
                                {errors.email && <span className=' text-red-600 pl-5'>{errors.email.message}</span>}
                            </div>
                            <div className='w-full flex justify-between gap-x-10'>
                                <div className='flex h-28 flex-col w-1/2 items-start justify-center'>
                                    <Input label="Password" type="password"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: { value: 6, message: "Password should contain atleast 6 characters" }
                                        })}
                                        className="w-full border-gray-300 p-2 rounded-lg shadow-inner"
                                    />
                                    {errors.password && <span className='w-full text-wrap text-left text-red-600 pl-5'>{errors.password.message}</span>}
                                </div>
                                <div className='flex h-28 flex-col w-1/2 items-start justify-center'>
                                    <Input label="Mobile No" type="numeric"
                                        {...register("mobileNo", {
                                            required: "Mobile number is required",
                                            minLength: { value: 10, message: "Mobile no must be 10 digits" },
                                            maxLength: { value: 10, message: "Mobile no must be 10 digits" }
                                        })}
                                        className="w-full border-gray-300 p-2 rounded-lg shadow-inner"
                                    />
                                    {errors.mobileNo && <span className=' text-red-600 pl-5'>{errors.mobileNo.message}</span>}
                                </div>
                            </div>
                        </div>
                        <Button type='submit' className='mt-4 w-full pt-2 pb-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-300 shadow-lg'>Create Account</Button>
                        <div className='mb-2'>
                            <p className='text-center'>Already have an account? <Link to="/login" className=' text-orange-700 hover:font-medium'>Sign In</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>

    )
}
