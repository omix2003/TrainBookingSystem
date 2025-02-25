import React from 'react'

export default function DeleteModal({ deleteLabel, onConfirm, onCancel, buttonLabel }) {
    return (
        <div className='w-full h-auto flex items-center justify-center'>
            <div className='bg-white p-6 mt-10 rounded-lg shadow-lg border border-orange-500'>
                <div className='mb-4'>
                    <h2 className='text-orange-700 font-semibold text-2xl'>
                        {deleteLabel}
                    </h2>
                </div>
                <div className='flex justify-center'>
                    <button
                        type='button'
                        className='bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded mr-2'
                        onClick={() => onConfirm()}
                    >
                        {buttonLabel || 'Confirm Delete'}
                    </button>
                    <button
                        type='button'
                        className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded'
                        onClick={() => onCancel()}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
