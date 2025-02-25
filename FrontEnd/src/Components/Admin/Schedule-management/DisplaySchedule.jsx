import React from 'react'

export default function DisplaySchedule({ schedule, button, buttonLabel ,onButtonClick}) {
    return (
        <div
            key={schedule._id}
            className='w-10/12 bg-orange-100 flex flex-col justify-center items-center border border-orange-500 rounded-lg p-4 m-4'
        >
            <div className='w-full flex justify-between items-center mb-4'>
                <div className='text-orange-700 font-semibold text-3xl'>{schedule.trainName} - {schedule.trainNo}</div>
                {button &&
                    <button type='button' onClick={() => onButtonClick(schedule)} className='w-16 h-8 rounded-md text-white px-2 py-1 text-center bg-red-600'>
                        {buttonLabel}
                    </button>
                }
            </div>
            <div className='flex flex-row w-full gap-x-3 mb-4'>
                <span className='text-orange-700 font-medium'>Available days:</span>
                {schedule.days.map((day, index) => (
                    <div key={index} className='text-orange-500 ml-2'>{day}</div>
                ))}
            </div>
            <div className='flex flex-row w-full gap-x-3 mb-4'>
                <span className='text-orange-700 font-medium'>Available Classes:</span>
                {schedule.fares[0]?.[0]?.classFares?.map((classFare, index) => (
                    <div key={index} className='text-orange-500 ml-2'>{classFare.className}</div>
                ))}
            </div>
            <div className='flex flex-col w-full gap-y-3'>
                {schedule.fares[0]?.map((fare, index) => (
                    <div key={index} className='text-orange-500 border border-orange-300 space-y-5 rounded-md p-3'>
                        <div className='font-semibold text-xl'>{fare.sourceStation} - {fare.destinationStation}</div>
                        <div className='flex flex-row gap-x-20 justify-start'>
                            {fare.classFares.map((classFare, idx) => (
                                <div key={idx} className='flex items-center'>
                                    <div className='text-orange-700'>{classFare.className}:</div>
                                    <div className='ml-2'>{classFare.fare} Rs.</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
