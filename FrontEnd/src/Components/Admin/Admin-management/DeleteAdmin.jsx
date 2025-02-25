import React, { useState, useCallback, useId, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import useDebounce from "../../../customHooks/deBounceHook.jsx"
import DisplayAdmin from './DisplayAdmin.jsx';
import LoaderComponent from "../../LoaderComponent.jsx"

export default function DeleteAdmin() {
    const [admins, setAdmins] = useState([]);
    const [selectedAdmin, setSelectedAdmin] = useState(null);
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(true)

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

    const fetchAdmin = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/v1/admin/get-admin', {
                method: 'GET',
            });

            const result = await response.json();

            if (!result.success) throw new Error('Error in fetching: ' + result.message);

            setAdmins(result.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false)
        }
    };

    const debounceFetchAdmin = useDebounce(fetchAdmin, 500)

    useEffect(() => {
        debounceFetchAdmin();
    }, []);

    const parseDate = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = d.getMonth() + 1; // Month is 0-based, add 1
        const day = d.getDate();

        return `${day}-${month}-${year}`;
    };

    const handleBtn = (admin) => {
        setSelectedAdmin(admin);
    };

    const handleDelete = async () => {
        if (!selectedAdmin) {
            notify("Select an admin to delete", 'error')
            return;
        }

        if (!password || password.length === 0) {
            notify("Password is required to delete admin", 'error')
            return;
        }

        try {
            const response = await fetch(`/api/v1/admin/delete-admin/c/${selectedAdmin._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ password })
            })

            const result = await response.json()
            console.log(result);
            if (!result.success) {
                notify(result.message, 'error')
                return;
            }

            notify(result.message, 'success')
            setSelectedAdmin(null)
            fetchAdmin()
        } catch (error) {
            notify("Server error. Please try again later", 'error')
            console.error(error)
        }
    }

    return (
        <div className='w-screen h-screen flex justify-center items-start bg-orange-50 p-6'>
            <ToastContainer />
            {loading ? (
                <LoaderComponent label={'Loading admin details...'} />
            ) : (
                <div className='w-full max-w-md mt-10 bg-white rounded-lg shadow-md p-6'>
                    {
                        selectedAdmin ? (
                            <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50' >
                                <div className='bg-white rounded-lg shadow-lg p-6 max-w-sm w-full'>
                                    <div className='text-lg font-semibold text-gray-800 mb-4'>
                                        {`Enter your password to remove the admin account for ${selectedAdmin.username}`}
                                    </div>
                                    <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter password' type='password' className='w-full mb-4 h-10 outline-none border-b-2 border-orange-500 pl-2' />
                                    <div className='flex justify-end gap-x-4'>
                                        <button type='button' onClick={handleDelete} className='bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 ease-in-out'>
                                            Confirm delete
                                        </button>
                                        <button type='button' className='bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition duration-300 ease-in-out' onClick={() => setSelectedAdmin(null)}>
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            admins.length > 0 ? (
                                admins.map((admin) =>
                                    <DisplayAdmin
                                        key={admin._id}
                                        admin={admin}
                                        parseDate={parseDate}
                                        onBtnClick={handleBtn}
                                        buttonLabel={'Delete'}
                                    />
                                )
                            ) : (
                                <div className='text-center text-orange-500'>No admins available.</div>
                            )
                        )
                    }
                </div >
            )}
        </div >
    );
}
