import React from 'react'

export default function DisplayAdmin({ admin, parseDate, onBtnClick, buttonLabel }) {
    return (
        <div className='border-b border-orange-200 py-4 flex justify-between items-center'>
            <div className='w-full flex flex-col'>
                <div className='text-lg font-semibold text-orange-700'>Username: {admin.username}</div>
                <div className='text-sm text-orange-500'>Created on: {parseDate(admin.createdAt)}</div>
            </div>
            {buttonLabel && <button type='button' onClick={() => onBtnClick(admin)} className='bg-red-500 text-white px-3 py-1.5 text-medium rounded-lg hover:bg-red-600 transition duration-300 ease-in-out'>
                Delete
            </button>}
        </div>
    )
}
