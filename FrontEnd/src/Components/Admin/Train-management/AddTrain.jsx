import React, { useState, useId, useCallback } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function AddTrain() {
    const [trainName, setTrainName] = useState('');
    const [trainNo, setTrainNo] = useState('');
    const [stations, setStations] = useState([{ stationName: '', stationCode: '', arrivalTime: '', departureTime: '', stopNumber: '' }]);
    const id = useId()
    const notify = useCallback((message, state) => {
        if (state === 'success')
            toast.success(message, {
                theme: 'colored',
                autoClose: 2000,
                toastId: id
            });
        else
            toast.error(message, {
                theme: 'colored',
                autoClose: 2000,
                toastId: id
            });
    }, []);

    const handleChangeTrainName = (e) => {
        setTrainName(e.target.value);
    };

    const handleChangeTrainNo = (e) => {
        setTrainNo(e.target.value);
    };

    const handleChangeStation = (index, e) => {
        const { name, value } = e.target;
        const updatedStations = [...stations];
        updatedStations[index][name] = value
        setStations(updatedStations);
    };

    const handleAddStation = () => {
        setStations([...stations, { stationName: '', stationCode: '', arrivalTime: '', departureTime: '', stopNumber: '' }]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = {
            trainName,
            trainNo,
            route: stations
        };

        if (!formData.trainName || !formData.trainNo || !formData.route) {
            notify("All data is required", 'error')
            return
        }

        for (let i = 0; i < formData.route.length; i++) {
            const station = formData.route[i]
            if (!station.stationName || !station.stationCode || !station.arrivalTime ||
                !station.departureTime || !station.stopNumber || station.stationCode.length === 0 ||
                station.stationName.length === 0 || station.arrivalTime.length === 0 ||
                station.departureTime.length === 0 || station.stopNumber?.length === 0) {
                notify(`Details required for station-${i + 1}`, 'error')
                return
            }
        }

        try {
            const response = await fetch('/api/v1/trains/add-train', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            // if (!response.ok)
            //     throw new Error("Network Error!!!")

            const result = await response.json()
            if (!result?.success) {
                if (result.message === "Train with same number already exist")
                    notify(result.message, 'error')
                else
                    notify(result.message, 'error')
            }
            notify(result.message, 'success')
            setTrainName('');
            setTrainNo('');
            setStations([{ stationName: '', stationCode: '', arrivalTime: '', departureTime: '', stopNumber: '' }]);
        } catch (error) {
            notify(error, 'error')
            // console.error(error)
        }


    };

    return (
        <div className='w-screen h-screen flex justify-center items-center bg-orange-50'>
            <ToastContainer />
            <form className='flex flex-col border px-8 py-8 border-orange-500 rounded-lg' onSubmit={handleSubmit}>
                <div className='flex flex-row'>
                    <div className='w-7/12 flex flex-col items-start'>
                        <label htmlFor='name' className=''>Train Name</label>
                        <input
                            id='name'
                            name='trainName'
                            value={trainName}
                            onChange={handleChangeTrainName}
                            className='w-full border border-gray-300 rounded-md px-2 py-1'
                            required
                        />
                    </div>
                    <div className='flex flex-col items-start ml-4'>
                        <label htmlFor='no' className=''>Train No</label>
                        <input
                            id='no'
                            name='trainNo'
                            type='numeric'
                            value={trainNo}
                            onChange={handleChangeTrainNo}
                            className='w-full border border-gray-300 rounded-md px-2 py-1'
                            required
                        />
                    </div>
                </div>
                <div className='mt-4'>
                    <h3 className='text-lg font-semibold mt-10'>Stations</h3>
                    {stations.map((station, index) => (
                        <div key={index} className='flex flex-row mt-2'>
                            <div className='flex flex-col items-start'>
                                <label htmlFor={`stationName-${index}`} className=''>Station Name</label>
                                <input
                                    id={`stationName-${index}`}
                                    name={`stationName`}
                                    value={station.stationName}
                                    onChange={(e) => handleChangeStation(index, e)}
                                    className='w-full border border-gray-300 rounded-md px-2 py-1'
                                    required
                                />
                            </div>
                            <div className='flex flex-col items-start ml-4'>
                                <label htmlFor={`stationCode-${index}`} className=''>Station Code</label>
                                <input
                                    id={`stationCode-${index}`}
                                    name={`stationCode`}
                                    value={station.stationCode}
                                    onChange={(e) => handleChangeStation(index, e)}
                                    className='w-full border border-gray-300 rounded-md px-2 py-1'
                                    required
                                />
                            </div>
                            <div className='flex flex-col items-start ml-4'>
                                <label htmlFor={`arrivalTime-${index}`} className=''>Arrival Time</label>
                                <input
                                    id={`arrivalTime-${index}`}
                                    name={`arrivalTime`}
                                    value={station.arrivalTime}
                                    onChange={(e) => handleChangeStation(index, e)}
                                    className='w-full border border-gray-300 rounded-md px-2 py-1'
                                    required
                                />
                            </div>
                            <div className='flex flex-col items-start ml-4'>
                                <label htmlFor={`departureTime-${index}`} className=''>Departure Time</label>
                                <input
                                    id={`departureTime-${index}`}
                                    name={`departureTime`}
                                    value={station.departureTime}
                                    onChange={(e) => handleChangeStation(index, e)}
                                    className='w-full border border-gray-300 rounded-md px-2 py-1'
                                    required
                                />
                            </div>
                            <div className='flex flex-col items-start ml-4'>
                                <label htmlFor={`stopNumber-${index}`} className=''>Stop Number</label>
                                <input
                                    id={`stopNumber-${index}`}
                                    name={`stopNumber`}
                                    type='numeric'
                                    value={station.stopNumber}
                                    onChange={(e) => handleChangeStation(index, e)}
                                    className='w-full border border-gray-300 rounded-md px-2 py-1'
                                    required
                                />
                            </div>
                        </div>
                    ))}
                    <button
                        type='button'
                        className='mt-4 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600'
                        onClick={handleAddStation}
                    >
                        Add Station
                    </button>
                </div>
                <button
                    type='submit'
                    className='mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600'
                >
                    Submit
                </button>
            </form>
        </div>
    );
}
