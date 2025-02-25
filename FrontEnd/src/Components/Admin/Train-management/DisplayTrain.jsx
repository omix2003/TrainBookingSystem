import React from 'react'

export default function DisplayTrain({ train, button, buttonLabel, onButtonClick }) {
    return (
        <div className='w-full p-4 my-4 bg-white rounded-lg shadow-lg flex flex-col gap-y-3 border border-orange-200'>
            <div className='w-full flex items-center gap-x-20'>
                <div className='text-xl font-bold mb-2 w-6/12 text-blue-600'>{train.trainName} - {train.trainNo}</div>
                <div className='flex justify-between w-6/12'>
                    <div className='flex flex-col items-start w-1/2'>
                        <div className='text-lg font-semibold text-orange-500'>Departure</div>
                        <div className='text-sm text-gray-600'>{train.route[0].stationName}</div>
                        <div className='text-sm text-gray-600'>{train.route[0].departureTime}</div>
                    </div>
                    <div className='flex flex-col items-end w-1/2 pr-8'>
                        <div className='text-lg font-semibold text-orange-500'>Arrival</div>
                        <div className='text-sm text-gray-600'>{train.route[train.route.length - 1].stationName}</div>
                        <div className='text-sm text-gray-600'>{train.route[train.route.length - 1].arrivalTime}</div>
                    </div>
                </div>
                {button && <button type='button' onClick={() => onButtonClick(train)} className='bg-red-600 text-white px-2.5 py-1 rounded-md'>{buttonLabel}</button>
                }
            </div>
            <hr className='border-orange-200' />
            <div className='w-full flex justify-between'>
                {train.route.map((station, index) => (
                    <div key={index} className='text-center text-sm text-orange-600 w-full flex gap-x-10 justify-center items-center'>
                        <div className='flex flex-col'>
                            <div className='text-lg'>{station.stationName}</div>
                            <div className='text-md'>{station.arrivalTime} - {station.departureTime}</div>
                        </div>
                        {index < train.route.length - 1 && <span className='text-orange-400 text-2xl'>→</span>}
                    </div>
                ))}
            </div>
        </div>
    )
}
