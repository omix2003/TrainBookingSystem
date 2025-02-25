import React, { useState, useEffect, useCallback, useId } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import DisplaySchedule from './DisplaySchedule.jsx';
import useDebounce from '../../../customHooks/deBounceHook.jsx';
import SearchBar from '../SearchBar.jsx';
import LoaderComponent from "../../LoaderComponent.jsx"

export default function DeleteSchedule() {
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedDay, setSelectedDay] = useState("")
    const [trainNumber, setTrainNumber] = useState("")
    const [loading, setLoading] = useState(true)

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

    const fetchSchedules = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/v1/schedule/get-schedule', {
                method: 'GET'
            });
            if (!response.ok) throw new Error("Network Error!!!");

            const result = await response.json();
            if (!result.success) {
                notify(result.message, 'error')
                return
            }

            notify(result.message, 'success')
            setSchedules(result.data);
        } catch (error) {
            notify("Serever error. Please try again later", 'error')
            console.error(error.message);
        } finally {
            setLoading(false)
        }
    };

    const debounceFetchSchedules = useDebounce(fetchSchedules, 500)

    useEffect(() => {
        debounceFetchSchedules()
    }, []);

    const handleBtn = (schedule) => {
        setModalOpen(true);
        setSelectedSchedule(schedule);
    };

    const handleDelete = async () => {

        if (!selectedDay || selectedDay?.length === 0) {
            notify("Day is required to delete schedule", 'error')
            return;
        }

        try {

            const response = await fetch(`/api/v1/schedule/delete-schedule/c/${selectedSchedule._id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ day: selectedDay })
            })
            // if (!response.ok)
            //     throw new Error("Network Error !!!")

            const result = await response.json()
            console.log(result);
            if (!result.success) {
                notify(result.message, 'error')
                return
            }

            notify(result.message, 'success')
            setModalOpen(false);
            setSelectedDay('')

            debounceFetchSchedules()
        } catch (error) {
            notify("Server error. Please try again later", 'error')
            console.error(error)
        }
    };

    const handleChangeNumber = (e) => {
        setTrainNumber(e.target.value)
    }

    const handleSearch = () => {
        if (!trainNumber || trainNumber?.length === 0) {
            notify("Enter Train No to search schedule", 'error')
            return;
        }

        const idx = schedules.findIndex((schedule) => schedule.trainNo === Number(trainNumber))
        if (idx !== -1) {
            //to remove train schedule from fetched schedules.
            const updatedSchedules = [...schedules]
            const foundTrain = updatedSchedules.splice(idx, 1)[0]
            //to attach at first
            updatedSchedules.unshift(foundTrain)
            setSchedules(updatedSchedules)
        } else
            notify("No schedule found for given train no", 'error')
        setTimeout(() => {
            setTrainNumber("")
        }, 1000)
    }

    return (
        <div className='w-screen h-screen flex flex-col bg-white'>
            <ToastContainer />
            <SearchBar
                handleChangeValue={handleChangeNumber}
                handleSearch={handleSearch}
                inputValue={trainNumber}
            />
            {loading ? (
                <LoaderComponent label={"Loading schedule details..."} />
            ) : (
                <div className='flex w-full h-auto py-5'>
                    {
                        modalOpen ? (
                            <div className='w-full h-full flex flex-col justify-center items-center bg-gray-100' >
                                <div className='bg-white p-6 rounded-lg shadow-lg'>
                                    <label htmlFor='days' className='block text-lg font-medium text-gray-700 mb-2'>
                                        Select day of schedule you want to delete
                                    </label>
                                    <select
                                        id='days'
                                        className='w-full p-2 border border-gray-300 rounded-md'
                                        onChange={(e) => setSelectedDay(e.target.value)}
                                        value={selectedDay}
                                    >
                                        <option value='' disabled hidden className='py-1'>Select a day</option>
                                        {selectedSchedule?.days?.map((day, index) => (
                                            <option key={index} value={day} className='py-1'>
                                                {day}
                                            </option>
                                        ))}
                                    </select>
                                    <div className='flex justify-end mt-4'>
                                        <button type='button'
                                            className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md mr-2'
                                            onClick={() => handleDelete()}
                                        >
                                            Delete
                                        </button>
                                        <button type='button'
                                            className='bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md'
                                            onClick={() => setModalOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='w-full h-auto flex flex-row justify-center items-center flex-wrap'>
                                {schedules.length > 0 && schedules.map((schedule) =>
                                    <DisplaySchedule
                                        key={schedule._id}
                                        schedule={schedule}
                                        button
                                        buttonLabel={'Delete'}
                                        onButtonClick={handleBtn}
                                    />
                                )}
                            </div>
                        )
                    }
                </div >
            )}
        </div >
    );
}
