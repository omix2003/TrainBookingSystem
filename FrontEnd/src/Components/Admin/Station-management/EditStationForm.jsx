import React from 'react'

export default function EditStationForm({ selectedStation, handleEditStation, handleUpdate, handleCancel }) {
    return (
        <div className='w-full h-auto mt-10 pb-10 flex items-center justify-center bg-gray-100 '>
            <div className='bg-white p-8 mt-10 rounded-lg shadow-xl border border-orange-500 max-w-md w-full'>
                <div className='w-auto h-auto mb-6 flex flex-col gap-y-6'>
                    <div className='flex flex-col items-start'>
                        <label htmlFor='name' className='text-gray-700 font-medium mb-2'>Station Name</label>
                        <input
                            id='name'
                            name='stationName'
                            className='text-orange-700 font-semibold text-lg border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500'
                            value={selectedStation.stationName}
                            onChange={(e) => handleEditStation(e)}
                        />
                    </div>
                    <div className='flex flex-col items-start'>
                        <label htmlFor='code' className='text-gray-700 font-medium mb-2'>Station Code</label>
                        <input
                            id='code'
                            name='stationCode'
                            className='text-orange-700 font-semibold text-lg border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500'
                            value={selectedStation.stationCode}
                            onChange={(e) => handleEditStation(e)}
                        />
                    </div>
                    <div className='flex flex-col items-start'>
                        <label htmlFor='city' className='text-gray-700 font-medium mb-2'>City</label>
                        <input
                            id='city'
                            name='city'
                            className='text-orange-700 font-semibold text-lg border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500'
                            value={selectedStation.city}
                            onChange={(e) => handleEditStation(e)}
                        />
                    </div>
                    <div className='flex flex-col items-start'>
                        <label htmlFor='state' className='text-gray-700 font-medium mb-2'>State</label>
                        <input
                            id='state'
                            name='state'
                            className='text-orange-700 font-semibold text-lg border border-gray-300 rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-orange-500'
                            value={selectedStation.state}
                            onChange={(e) => handleEditStation(e)}
                        />
                    </div>
                </div>
                <div className='flex justify-center gap-x-4'>
                    <button
                        type='button'
                        className='bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-6 rounded transition duration-300 ease-in-out'
                        onClick={() => handleUpdate()}
                    >
                        Save changes
                    </button>
                    <button
                        type='button'
                        className='bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-6 rounded transition duration-300 ease-in-out'
                        onClick={() => handleCancel()}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}
