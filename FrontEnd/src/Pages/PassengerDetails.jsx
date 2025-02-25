import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PassengerDetails() {
    const bookingData = JSON.parse(localStorage.getItem('bookingData'));
    console.log(bookingData);
    const navigate = useNavigate()

    const [passengers, setPassengers] = useState([{ name: '', age: '', gender: '', type: '' }]);

    const addPassenger = useCallback(() => {
        if (passengers.length < 4)
            setPassengers([...passengers, { name: '', age: '', gender: '', type: '' }]);
        else
            window.alert("You can only book ticket for 4 passengers at a time.")
    }, [passengers]);

    const handleChangePassenger = useCallback((idx, e) => {
        const { name, value } = e.target;
        const updatedPassengers = [...passengers];
        updatedPassengers[idx][name] = value;
        setPassengers(updatedPassengers);
    }, [passengers]);

    const handlePassengerData = useCallback((e) => {
        e.preventDefault()
        bookingData.passengers = passengers
        // console.log(bookingData);
        localStorage.setItem('journeyData', JSON.stringify(bookingData))
        navigate('/payment', { replace: true })
    }, [bookingData, passengers, navigate])

    return (
        <div className="w-screen bg-gray-50 flex flex-col justify-center items-center gap-y-16 py-8">
            {/* trainInfo */}
            <div className="w-full bg-white pb-6 shadow-md flex flex-col justify-center items-center fixed top-0 left-0 right-0 z-50">
                <div className="w-2/3 mt-4 flex flex-col items-center justify-center gap-y-8 text-center">
                    <div className="text-2xl font-bold text-orange-600">
                        {bookingData.train.trainName} - {bookingData.train.trainNo}
                    </div>
                    <div className="w-full flex justify-center items-center p-4 bg-orange-100 shadow-md rounded-lg">
                        <div className="w-1/5 text-lg font-semibold text-orange-700">Date of journey: {bookingData.date}</div>
                        <div className="w-3/5 flex gap-x-6 mt-2 px-10 items-center justify-center">
                            <div className="text-xl font-semibold text-orange-700">{bookingData.source}</div>
                            <span className="text-2xl text-orange-700">{`→`}</span>
                            <div className="text-xl font-semibold text-orange-700">{bookingData.destination}</div>
                        </div>
                        <div className="w-1/5 mt-2 text-lg font-semibold text-orange-700">Class: {bookingData.type}</div>
                    </div>
                </div>
            </div>

            {/* PassengerDetails */}
            <form onSubmit={handlePassengerData} className='h-auto w-full flex flex-col items-center justify-start pt-32 mt-36 mb-20'>
                {passengers.length > 0 && passengers.map((passenger, idx) => (
                    <div key={idx} className='w-full h-auto flex items-center justify-center mb-4 px-10'>
                        <div className='w-full flex flex-row gap-x-16'>
                            <div className='w-1/2 flex flex-col mb-2 items-start'>
                                <label htmlFor={`name-${idx}`} className="text-orange-600 font-semibold pl-1">Name</label>
                                <input
                                    id={`name-${idx}`}
                                    name='name'
                                    type='text'
                                    required
                                    value={passenger.name}
                                    onChange={(e) => handleChangePassenger(idx, e)}
                                    className="w-full p-2 border-b-2 outline-none bg-gray-50 border-orange-500 focus:border-orange-600 transition-colors duration-300"
                                />
                            </div>
                            <div className='w-1/4 flex flex-col mb-4 items-start'>
                                <label htmlFor={`age-${idx}`} className="text-orange-600 font-semibold pl-1">Age</label>
                                <input
                                    id={`age-${idx}`}
                                    name='age'
                                    type='number'
                                    required
                                    value={passenger.age}
                                    onChange={(e) => handleChangePassenger(idx, e)}
                                    className="w-full p-2 border-b-2 outline-none bg-gray-50 border-orange-500 focus:border-orange-600 transition-colors duration-300"
                                />
                            </div>
                        </div>
                        <div className='w-full flex flex-row gap-x-16'>
                            <div className='w-1/2 flex flex-col items-start'>
                                <label htmlFor={`gender-${idx}`} className="text-orange-600 font-semibold mb-1">Gender</label>
                                <select
                                    id={`gender-${idx}`}
                                    name='gender'
                                    value={passenger.gender}
                                    required
                                    onChange={(e) => handleChangePassenger(idx, e)}
                                    className="w-full p-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
                                >
                                    <option value="" hidden>Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className='w-1/2 flex flex-col items-start'>
                                <label htmlFor={`type-${idx}`} className="text-orange-600 font-semibold mb-1">Type</label>
                                <select
                                    id={`type-${idx}`}
                                    name='type'
                                    value={passenger.type}
                                    required
                                    onChange={(e) => handleChangePassenger(idx, e)}
                                    className="w-full p-2 border border-orange-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition duration-300"
                                >
                                    <option value="" hidden>Select Type</option>
                                    <option value="Normal">Normal</option>
                                    <option value="Person with disability">Person with disability</option>
                                </select>
                            </div>
                        </div>
                    </div>
                ))}
                <button
                    onClick={() => addPassenger()}
                    className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition-colors duration-300"
                >
                    Add Passenger
                </button>
                <div className='w-full fixed bottom-0 left-0 right-0 py-4 pr-12 bg-white flex justify-end'>
                    <button type='submit' className='bg-orange-500 hover:bg-orange-600 text-white text-lg px-4 py-2 rounded-md'>Proceed Payment </button>
                </div>
            </form>
        </div>
    );
}
