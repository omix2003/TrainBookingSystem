import React, { useState, useCallback, useId } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function AddAdmin() {

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const id = useId()

    const notify = useCallback((message, state) => {
        if (state === 'success')
            toast.success(message, {
                theme: 'colored',
                autoClose: 2000,
                toastId: id
            });
        else
            toast.error(message, {
                theme: 'colored',
                autoClose: 2000,
                toastId: id
            });
    }, []);

    const handleForm = async (e) => {
        e.preventDefault()

        if (!username || !password) {
            notify("Username and password is required", 'error')
            return;
        }

        try {
            const formData = {
                username,
                password
            }
            const response = await fetch('/api/v1/admin/add-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const result = await response.json()
            console.log(result);
            if (!result.success) {
                notify(result.message, 'error')
                return;
            }

            notify(result.message, 'success')
            setPassword('')
            setUsername('')
        } catch (error) {
            notify("Server error. Please try again later", 'error')
            console.error(error)
        }
    }

    return (
        <div className='w-screen h-screen flex justify-center bg-orange-50 p-6'>
            <ToastContainer />
            <div className='w-full max-w-md h-3/5 bg-white mt-20 rounded-lg shadow-md p-6'>
                <h2 className='text-xl font-semibold text-orange-700 mb-6'>Add Admin</h2>
                <form onSubmit={handleForm} className='w-full flex flex-col items-start justify-center gap-y-4'>
                    <div className='flex flex-col items-start w-full'>
                        <label htmlFor='username' className='text-gray-700 font-medium'>Username</label>
                        <input
                            id='username'
                            type='text'
                            className='outline-none w-full border-b-2 border-orange-500 py-2 text-lg transition duration-300 ease-in-out focus:border-orange-700'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className='flex flex-col items-start w-full'>
                        <label htmlFor='password' className='text-gray-700 font-medium'>Password</label>
                        <input
                            id='password'
                            type='password'
                            className='outline-none w-full border-b-2 border-orange-500 py-2 text-lg transition duration-300 ease-in-out focus:border-orange-700'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type='submit' className='w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded transition duration-300 ease-in-out mt-4'>Add Admin</button>
                </form>
            </div>
        </div>
    )
}
