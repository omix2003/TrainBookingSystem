import React, { useEffect, useState, useCallback, useId } from 'react'
import DisplayAdmin from './DisplayAdmin';
import LoaderComponent from '../../LoaderComponent.jsx';
import useDebounce from '../../../customHooks/deBounceHook.jsx';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function ViewAdmin() {

    const [admins, setAdmins] = useState([])
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
        try {
            const response = await fetch('/api/v1/admin/get-admin', {
                method: 'GET'
            })

            const result = await response.json()

            if (!result.success) {
                notify(result.message, 'error')
                return
            }

            notify(result.message, 'success')
            setAdmins(result.data)

        } catch (error) {
            notify("Server error. Please try again later", 'error')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const debounceFetchAdmin = useDebounce(fetchAdmin, 500)

    useEffect(() => {
        debounceFetchAdmin()
    }, [])

    const parseDate = (date) => {
        const d = new Date(date)
        const year = d.getFullYear()
        const month = d.getMonth()
        const day = d.getDate()

        return `${day}-${month}-${year}`
    }

    return (
        <div className='w-screen h-screen flex justify-center items-start bg-orange-50 p-6'>
            <ToastContainer />
            {loading ? (
                <LoaderComponent label={'Loading admin details...'} />
            ) : (
                <div className='w-full max-w-md mt-10 bg-white rounded-lg shadow-md p-6'>
                    {admins.length > 0 ? (
                        admins.map((admin) =>
                            <DisplayAdmin
                                key={admin._id}
                                admin={admin}
                                parseDate={parseDate}
                            />
                        )
                    ) : (
                        <div className='text-center text-orange-500'>No admins available.</div>
                    )}
                </div>
            )
            }
        </div >


    )
}
