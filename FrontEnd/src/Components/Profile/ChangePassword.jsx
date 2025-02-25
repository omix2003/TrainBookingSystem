import React, { useState, useId, useCallback } from 'react'
import useDebounce from "../../customHooks/deBounceHook.jsx"
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function ChangePassword() {
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

    const updatePassword = async () => {
        try {
            const response = await fetch('/api/v1/users/change-password', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            });
            // if (!response.ok) {
            //     throw new Error(errorData?.message || "Network Error !!!");
            // }

            const data = await response.json();
            if (data?.success) {
                notify(data.message, 'success')
                document.getElementById('password').value = "";
            } else {
                notify(data.message, 'error')
                setPassword("")
            }
        } catch (error) {
            notify(error, 'error')
            // console.error("Error while updating password:", error);
        }
    };

    const debouncedupdatePassword = useDebounce(updatePassword, 500)

    const handlePasswordBtn = async () => {
        if (!password || password.length === 0) {
            notify("Enter new password", 'error')
            return
        }

        if (password.length < 6) {
            notify("Password should contain at least 6 characters", 'error')
            return
        }

        setPassword(password);
        debouncedupdatePassword()
    };

    return (
        <div className="flex flex-col items-center px-4 py-8 mt-16">
            <ToastContainer />
            <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 space-y-6">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                    <div className="flex-1 flex flex-col items-start">
                        <label htmlFor="password" className="text-orange-600 font-semibold mb-2 pl-2">
                            Password
                        </label>
                        <input
                            autoFocus
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full md:w-8/12 p-3 border-b-2 border-orange-500 outline-none bg-white text-gray-800 focus:border-orange-700 transition duration-300 ease-in-out"
                            placeholder="Enter your new password"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handlePasswordBtn}
                        className="bg-orange-500 text-white px-6 py-3 font-semibold rounded-lg shadow-md hover:bg-orange-600 transition duration-300 ease-in-out"
                    >
                        Change Password
                    </button>
                </div>
            </div>
        </div>

    )
}
