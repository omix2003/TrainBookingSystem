import React from 'react';
import { Button, Input } from '../index.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { loginAdmin } from '../../store/authSlice.js';

export default function AdminLogin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { register, handleSubmit, formState: { errors } } = useForm();

    const loginToAccount = async (data) => {
        try {
            const response = await fetch('/api/v1/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Network Error');

            const result = await response.json();
            if (!result?.success) throw new Error('Something went wrong');

            localStorage.setItem('accessToken', result.data.accessToken)
            dispatch(loginAdmin(result.data));
            navigate('/admin-dashboard/admin-panel');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div
            className="w-full h-screen flex justify-center items-center"
            style={{ backgroundImage: 'linear-gradient(135deg,#ffffff, #f97316)' }}
        >
            <form
                onSubmit={handleSubmit(loginToAccount)}
                className="w-4/12 h-3/5 bg-white shadow-md p-10 flex flex-col items-center justify-between"
            >
                <h2 className="text-orange-600 text-3xl font-semibold">Login to account</h2>
                <div className="w-full flex flex-col items-center justify-center gap-y-4">
                    <div className="w-full h-16 flex flex-col items-start justify-center">
                        <Input
                            label="Username"
                            {...register('username', {
                                required: 'Username is required',
                            })}
                            autoFocus
                            className="w-11/12 border-gray-300 px-2 rounded-lg shadow-inner"
                        />
                        {errors.username && <span className="text-red-600 pl-5 mb-4">{errors.username.message}</span>}
                    </div>
                    <div className="w-full h-16 flex flex-col items-start justify-center">
                        <Input
                            label="Password"
                            type="password"
                            {...register('password', {
                                required: 'Password is required',
                            })}
                            className="w-11/12 border-gray-300 p-2 rounded-lg shadow-inner"
                        />
                        {errors.password && <span className="text-red-600 pl-5">{errors.password.message}</span>}
                    </div>
                </div>
                <Button
                    type="submit"
                    className="mt-3 w-9/12 py-2 bg-orange-500 text-white text-lg rounded-lg hover:bg-orange-600 transition duration-300 shadow-lg"
                >
                    Login
                </Button>
            </form>
        </div>
    );
}
