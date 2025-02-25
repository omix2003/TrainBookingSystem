import React, { useState, useCallback, useId } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddSchedule() {
    const [trainNo, setTrainNo] = useState('');
    const [day, setDay] = useState('');
    const [fares, setFares] = useState([{ sourceStation: '', destinationStation: '', distance: '', classFares: [{ className: '', fare: '' }] }]);
    const [seats, setSeats] = useState([{ className: '', seatsAvailable: '', totalSeats: '' }]);

    const id = useId();
    const notify = useCallback((message, state) => {
        if (state === 'success')
            toast.success(message, { theme: 'colored', autoClose: 2000, toastId: id });
        else
            toast.error(message, { theme: 'colored', autoClose: 2000, toastId: id });
    }, []);

    const handleCancel = () => {
        setTrainNo('');
        setDay('');
        setFares([{ sourceStation: '', destinationStation: '', distance: '', classFares: [{ className: '', fare: '' }] }]);
        setSeats([{ className: '', seatsAvailable: '', totalSeats: '' }]);
    };

    const handleForm = async (e) => {
        e.preventDefault();
        if (!trainNo || !day || fares.length === 0 || seats.length === 0) {
            notify('All details are required', 'error');
            return;
        }

        try {
            const formData = { trainNo, day, fares, seats };
            const response = await fetch('/api/v1/schedule/add-schedule', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if (!result.success) {
                notify(result.message, 'error');
                return;
            }
            notify(result.message, 'success');
            handleCancel();
        } catch (error) {
            console.error(error);
            notify('Server error. Please try again later.', 'error');
        }
    };

    return (
        <div className='w-screen h-auto mt-32 flex justify-center items-center'>
            <ToastContainer />
            <div className='w-5/12 flex flex-col justify-center items-center rounded-2xl border bg-white shadow-md border-orange-500'>
                <form onSubmit={handleForm} className='w-full flex flex-col items-start justify-center gap-y-6 rounded-t-xl'>
                    <div className='flex flex-col items-start w-full px-6 pt-6'>
                        <label className='text-gray-700 font-medium'>Train Number</label>
                        <input value={trainNo} onChange={(e) => setTrainNo(e.target.value)} className='outline-none w-full border-b-2 border-orange-500 py-2 text-lg focus:border-orange-700' />
                    </div>
                    <div className='flex flex-col items-start w-full px-6'>
                        <label className='text-gray-700 font-medium'>Day</label>
                        <input value={day} onChange={(e) => setDay(e.target.value)} className='outline-none w-full border-b-2 border-orange-500 py-2 text-lg focus:border-orange-700' />
                    </div>
                    <div className='w-full flex'>
                        <button type='submit' className='bg-red-500 hover:bg-red-600 text-white w-6/12 p-3 rounded-bl-2xl text-xl'>Add Schedule</button>
                        <button type='button' onClick={handleCancel} className='bg-gray-400 hover:bg-gray-500 text-gray-800 w-6/12 p-3 rounded-br-2xl text-xl'>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
