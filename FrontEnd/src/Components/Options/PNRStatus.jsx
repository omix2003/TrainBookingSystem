import React, { useState, useCallback, useId } from 'react';
import { Button } from '../index.js';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function PNRStatus() {
    const [pnrNo, setPnrNo] = useState("")
    const navigate = useNavigate()
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

        if (pnrNo.trim().length === 0 || pnrNo.trim().length !== 10) {
            notify("Enter 10 digit PNR number", 'error')
            return
        }

        localStorage.setItem('pnrFormData', JSON.stringify(pnrNo))
        navigate('/pnr-status')
    }

    return (
        <div className='relative top-60 bg-transperant flex rounded-xl justify-center '>
            <ToastContainer />
            <div className='w-10/12 bg-custom-background rounded-xl flex flex-row'>
                <div className='w-5/12 h-24 bg-custom-orange rounded-l-xl flex flex-row justify-center items-center gap-x-5 shadow-md pl-3'>
                    <img src='../../../photos/pnr.png' className='w-12 h-12 mix-blend-multiply' alt='PNR Icon' />
                    <p className='text-white font-semibold'>Know current status of your train ticket</p>
                </div>
                <form onSubmit={handleForm} className='w-7/12 h-24 px-10 flex flex-row justify-between items-center rounded-r-xl bg-white shadow-md gap-x-10'>
                    <div className='flex flex-col gap-y-1.5' >
                        <label htmlFor='pnr' className='text-gray-600 relative right-20 mt-3'>PNR Number</label>
                        <input id='pnr' autoFocus onChange={(e) => setPnrNo(e.target.value)} className='w-64 mb-3 p-2 border border-gray-300 rounded-lg shadow-sm' type='number' value={pnrNo} placeholder='Enter 10 digit PNR number' />
                    </div>
                    <Button type='submit' className='w-30 px-3 py-1.5 text-xl rounded-lg bg-orange-500 text-white hover:bg-orange-600'>
                        Check Status
                    </Button>
                </form>
            </div>
        </div>
    );
}
