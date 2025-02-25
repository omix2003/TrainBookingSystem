import React from 'react'

export default function TrainDetails({ trainName, source, destination, departureTime, duration, arrivalTime, prices, seats }) {
    return (
        <div className="w-10/12 p-6 mt-10 bg-white shadow-md rounded-lg">
            <div className="flex justify-between items-center mb-5">
                <div className="w-1/2 bg-orange-200 p-4 rounded-lg">
                    <h2 className="text-lg font-bold mb-2">{trainName}</h2>
                    <div className="flex justify-around">
                        <span>Departure: {source}</span>
                        <span>Arrival: {destination}</span>
                    </div>
                </div>
                <div className="w-1/2 flex justify-center items-center">
                    <span className='text-3xl pr-3'>{departureTime}</span>
                    <span>------</span>
                    <span className="text-xl px-3">{`${duration.hours}:${duration.minutes}`} hours</span>
                    <span>------</span>
                    <span className='text-3xl pl-3'>{arrivalTime}</span>
                </div>
            </div>
            <hr />
            <ul className="flex gap-x-5 items-center justify-start mt-5">
                {Object.entries(prices).map(([type, fare]) => (
                    <li key={type} className="bg-orange-200 p-4 rounded-lg flex flex-col items-center cursor-pointer">
                        <div>{type} | Rs. {fare}</div>
                        <div>AVL: {seats[0].seatsAvailable}</div>
                    </li>
                ))}
            </ul>
        </div>
  )
}
