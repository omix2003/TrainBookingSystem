import React from 'react';
import { Button } from '../index.js';

export default function PNRStatus() {
    return (
        <div className='relative top-60 bg-transperant flex rounded-xl justify-center '>
            <div className='w-10/12 bg-custom-background rounded-xl flex flex-row'>
                <div className='w-4/12 h-24 bg-custom-orange rounded-l-xl flex flex-row justify-center items-center gap-x-5 shadow-md pl-3'>
                    <img src='../../../photos/run_status.png' className='w-12 h-12 mix-blend-multiply' alt='PNR Icon' />
                    <p className='text-white font-semibold'>Get live running status of train</p>
                </div>
                <div className='w-8/12 h-24 px-10 flex flex-row justify-between items-center rounded-r-xl bg-white shadow-md'>
                    <div className='flex flex-col gap-y-1.5'>
                        <label htmlFor='pnr' className='text-gray-600 relative right-20 mt-3'>Train Number</label>
                        <input id='pnr' className='w-64 mb-3 p-2 border border-gray-300 rounded-lg shadow-sm' type='number' placeholder='Enter Train number' />
                    </div>
                    <Button className='w-30 px-3 py-1.5 text-xl rounded-lg bg-orange-500 text-white hover:bg-orange-600'>
                        Check Status
                    </Button>
                </div>
            </div>
        </div>
    );
}
