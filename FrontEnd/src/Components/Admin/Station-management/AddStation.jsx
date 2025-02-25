import React, { useState, useCallback, useId } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function AddStation() {

    const [stationName, setStationName] = useState("")
    const [stationCode, setStationCode] = useState("")
    const [state, setState] = useState("")
    const [city, setCity] = useState("")

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

    const handleCancel = () => {
        setStationCode("")
        setStationName("")
        setCity("")
        setState("")
    }

    const handleForm = async (e) => {
        e.preventDefault();

        if (!stationCode || stationCode.length === 0 || !state || state.length === 0 ||
            !stationName || stationName.length === 0 || !city || city / length === 0) {
            notify("All details are required", 'error')
            return;
        }

        try {
            const formData = {
                stationCode,
                stationName,
                city,
                state
            }

            const response = await fetch('/api/v1/stations/add-station', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const result = await response.json()

            if (!result.success) {
                notify(result.message, 'error')
                return;
            }

            notify(result.message, 'success')
            handleCancel()
        } catch (error) {
            console.error(error)
            notify('Server error. Please try again later.', 'error');
        }
    }


    return (
        <div className='w-screen h-auto mt-32 flex justify-center items-center'>
            <ToastContainer />
            <div className='w-5/12 flex flex-col justify-center items-center rounded-2xl border bg-white shadow-md border-orange-500'>
                <form onSubmit={handleForm} className='w-full flex flex-col items-start justify-center gap-y-6 rounded-t-xl'>
                    <div className='flex flex-col items-start w-full px-6 pt-6'>
                        <label htmlFor='name' className='text-gray-700 font-medium '>Station Name</label>
                        <input
                            value={stationName}
                            onChange={(e) => setStationName(e.target.value)}
                            id='name'
                            className='outline-none w-full border-b-2 border-orange-500 py-2 text-lg transition duration-300 ease-in-out focus:border-orange-700'
                        />
                    </div>
                    <div className='flex flex-col items-start w-full px-6'>
                        <label htmlFor='code' className='text-gray-700 font-medium '>Station Code</label>
                        <input
                            value={stationCode}
                            onChange={(e) => setStationCode(e.target.value)}
                            id='code'
                            className='outline-none w-full border-b-2 border-orange-500 py-2 text-lg transition duration-300 ease-in-out focus:border-orange-700'
                        />
                    </div>
                    <div className='w-full flex justify-center items-center gap-x-4'>
                        <div className='flex flex-col items-start w-1/2 px-6 pt-6'>
                            <label htmlFor='city' className='text-gray-700 font-medium '>City</label>
                            <input
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                id='city'
                                className='outline-none w-full border-b-2 border-orange-500 py-2 text-lg transition duration-300 ease-in-out focus:border-orange-700'
                            />
                        </div>
                        <div className='flex flex-col items-start w-1/2 px-6 pt-6'>
                            <label htmlFor='state' className='text-gray-700 font-medium '>State</label>
                            <input
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                id='state'
                                className='outline-none w-full border-b-2 border-orange-500 py-2 text-lg transition duration-300 ease-in-out focus:border-orange-700'
                            />
                        </div>
                    </div>
                    <div className='w-full flex '>
                        <button type='submit' className='bg-red-500 hover:bg-red-600 text-white w-6/12 p-3 rounded-bl-2xl transition duration-300 ease-in-out text-xl'>Add Station</button>
                        <button type='button' onClick={handleCancel} className='bg-gray-400 hover:bg-gray-500 text-gray-800 w-6/12 p-3 rounded-br-2xl transition duration-300 ease-in-out text-xl'>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
