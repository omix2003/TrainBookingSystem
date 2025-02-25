import React from 'react'

export default function DisplayStation({ station, button, buttonLabel, onButtonClick }) {
    return (
        <div key={station.stationCode} className='w-1/3 p-4'>
            <div className='bg-orange-100 flex flex-col gap-y-5 justify-center items-center border border-orange-500 rounded-lg p-6 m-4 shadow-lg'>
                <div className='w-full flex flex-col gapy-4'>
                    <div className='text-orange-700 font-semibold text-2xl mb-2'>{station.stationName} - {station.stationCode}</div>
                    <div className='w-full flex justify-between'>
                        <div className='text-orange-500 text-xl'>city: {station.city}</div>
                        <div className='text-orange-500 text-xl'>state: {station.state}</div>
                    </div>
                </div>

                {button && <button
                    type='button'
                    onClick={() => onButtonClick(station)}
                    className='py-1 w-20 bg-red-500 text-white text-lg rounded-md hover:bg-red-600'
                >
                    {buttonLabel}
                </button>}
            </div>
        </div>
    )
}
