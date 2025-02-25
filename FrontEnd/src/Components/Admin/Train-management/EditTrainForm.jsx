import React from 'react'

export default function EditTrainForm({
  selectedTrain,
  handleForm,
  handleTrainNameChange,
  handleTrainNoChange,
  handleArrivalTimeChange,
  handleDepartureTimeChange,
  handleCancel,
  handleStationNameChange
}) {

  return (
    <div className='w-full flex justify-center items-center'>
      <form onSubmit={(e) => handleForm(e)} className='w-10/12 p-6 mt-10 bg-white rounded-lg shadow-lg flex flex-col gap-y-4 ' >
        <div className='w-full flex items-start gap-x-10'>
          <div className='w-7/12 flex flex-col'>
            <label htmlFor='trainName' className='text-lg font-semibold text-orange-500'>Train name</label>
            <input
              id='trainName'
              value={selectedTrain.trainName}
              onChange={(e) => handleTrainNameChange(e)}
              className='w-full p-2 border border-orange-300 rounded-md'
            />
          </div>
          <div className='w-5/12 flex flex-col'>
            <label htmlFor='trainNo' className='text-lg font-semibold text-orange-500'>Train no</label>
            <input
              id='trainNo'
              value={selectedTrain.trainNo}
              onChange={(e) => handleTrainNoChange(e)}
              className='w-full p-2 border border-orange-300 rounded-md'
            />
          </div>
        </div>
        <div className='w-full flex flex-row flex-wrap gap-y-4 gap-x-10'>
          {selectedTrain?.route?.map((station, index) => (
            <div key={index} className='text-sm w-3/12 border px-4 py-1.5 rounded-md border-orange-300 flex flex-col justify-start'>
              <div className='w-full flex flex-col'>
                <label htmlFor={`station-${index}`} className='text-lg font-semibold text-orange-500'>{`Station-${index + 1}`}</label>
                <input
                  id={`station-${index}`}
                  value={station.stationName}
                  onChange={(e) => handleStationNameChange(e, index)}
                  className='w-full p-2 border border-orange-300 rounded-md'
                />
              </div>
              <div className='flex flex-row gap-x-4'>
                <div className='w-1/2 flex flex-col'>
                  <label htmlFor={`arrivalTime-${index}`} className='text-orange-600'>Arrival time</label>
                  <input
                    id={`arrivalTime-${index}`}
                    value={station.arrivalTime}
                    onChange={(e) => handleArrivalTimeChange(e, index)}
                    className='w-full p-2 border border-orange-300 rounded-md'
                  />
                </div>
                <div className='w-1/2 flex flex-col'>
                  <label htmlFor={`departureTime-${index}`} className='text-orange-600'>Departure time</label>
                  <input
                    id={`departureTime-${index}`}
                    value={station.departureTime}
                    onChange={(e) => handleDepartureTimeChange(e, index)}
                    className='w-full p-2 border border-orange-300 rounded-md'
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className='w-full flex gap-x-4'>
          <button
            type='submit'
            className='w-6/12 mt-4 p-2 px-4 py-1.5 text-xl bg-orange-500 hover:bg-orange-600 text-white rounded-md'
          >
            Update Details
          </button>
          <button
            onClick={() => handleCancel()}
            type='button'
            className='w-6/12 mt-4 p-2 px-4 py-1.5 text-xl bg-gray-200 hover:bg-gray-300 text-orange-600 rounded-md'
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
