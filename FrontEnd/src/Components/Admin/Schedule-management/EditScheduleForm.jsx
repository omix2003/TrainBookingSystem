import React from 'react'

export default function EditScheduleForm({ selectedSchedule, handleFareChange, handleSave, handleCancel,farePrices }) {
    return (
        <div className='w-full h-full flex flex-col justify-center items-center bg-gray-100'>
            <div className=' w-full flex flex-col justify-center items-center bg-white p-6 rounded-lg shadow-lg'>
                <form className='w-10/12 flex justify-center items-center'>
                    <div
                        key={selectedSchedule._id}
                        className='w-10/12 bg-orange-100 flex flex-col justify-center items-start border border-orange-500 rounded-lg p-4 m-4'
                    >
                        <div className='w-full flex justify-between items-center mb-4'>
                            <div className='text-orange-700 font-semibold text-3xl'>{selectedSchedule.trainName} - {selectedSchedule.trainNo}</div>
                        </div>
                        <div className='flex flex-row w-full gap-x-3 mb-2'>
                            <span className='text-orange-700 font-medium'>Available days:</span>
                            {selectedSchedule.days.map((day, index) => (
                                <div key={index} className='text-orange-500 ml-2'>{day}</div>
                            ))}
                        </div>
                        <div className='flex flex-row w-full gap-x-3 mb-4'>
                            <span className='text-orange-700 font-medium'>Available Classes:</span>
                            {selectedSchedule.fares[0]?.[0]?.classFares?.map((classFare, index) => (
                                <div key={index} className='text-orange-500 ml-2'>{classFare.className}</div>
                            ))}
                        </div>
                        <div className='flex flex-col w-full gap-y-3'>
                            {selectedSchedule.fares[0]?.map((fare, fareIndex) => (
                                <div key={fareIndex} className='text-orange-500 w-full border border-orange-300 space-y-5 rounded-md p-3'>
                                    <div className='font-semibold text-xl'>{fare.sourceStation} - {fare.destinationStation}</div>
                                    <div className='w-full flex flex-row flex-wrap gap-x-20 justify-start gap-y-5'>
                                        {fare.classFares.map((classFare, classFareIndex) => (
                                            <div key={classFareIndex} className='w-32 flex flex-wrap items-center'>
                                                <div className='text-orange-700'>{classFare.className}:</div>
                                                <input
                                                    type='number'
                                                    className='ml-2 w-20 border rounded-md p-1'
                                                    value={farePrices[`${fareIndex}-${classFareIndex}`] || ''}
                                                    onChange={(e) => handleFareChange(fareIndex, classFareIndex, e.target.value)}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='flex justify-end mt-4'>
                            <button type='button'
                                className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md mr-2'
                                onClick={handleSave}
                            >
                                Save Changes
                            </button>
                            <button type='button'
                                className='bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md'
                                onClick={() => handleCancel()}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}
