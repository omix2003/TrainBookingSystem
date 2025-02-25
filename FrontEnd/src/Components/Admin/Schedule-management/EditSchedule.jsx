import React, { useState, useEffect, useCallback, useId } from 'react';
import useDebounce from "../../../customHooks/deBounceHook.jsx"
import DisplaySchedule from './DisplaySchedule.jsx';
import EditScheduleForm from './EditScheduleForm.jsx';
import SearchBar from '../SearchBar.jsx';
import LoaderComponent from '../../LoaderComponent.jsx';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function EditSchedule() {
    const [schedules, setSchedules] = useState([]);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [trainNumber, setTrainNumber] = useState("")
    const [farePrices, setFarePrices] = useState({})
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
            notify("Server error. Please try again later", 'error')
            console.error(error.message);
        } finally {
            setLoading(false)
        }
    };

    const debounceFetchSchedules = useDebounce(fetchSchedules, 500)

    useEffect(() => {
        debounceFetchSchedules()
    }, []);

    useEffect(() => {
        if (selectedSchedule) {
            const initialFarePrices = {}
            selectedSchedule.fares[0].forEach((fare, fareIndex) => {
                fare.classFares.forEach((classFare, classFareIndex) => {
                    initialFarePrices[`${fareIndex}-${classFareIndex}`] = classFare.fare
                })
            })
            setFarePrices(initialFarePrices)
        }
    }, [selectedSchedule])

    const handleBtn = (schedule) => {
        setModalOpen(true);
        setSelectedSchedule(schedule);
    };

    const handleFareChange = (fareIndex, classFareIndex, value) => {
        setFarePrices({
            ...farePrices,
            [`${fareIndex}-${classFareIndex}`]: Number(value)
        })
    }

    const handleSave = async () => {
        const updatedFares = selectedSchedule.fares[0].map((fare, fareIndex) => ({
            ...fare,
            classFares: fare.classFares.map((classFare, classFareIndex) => ({
                ...classFare,
                fare: farePrices[`${fareIndex}-${classFareIndex}`]
            }))
        }))
        const updatedSchedule = { ...selectedSchedule, fares: updatedFares }

        const formData = {
            newFares: updatedSchedule.fares
        }

        try {
            const response = await fetch(`/api/v1/schedule/update-schedule/c/${selectedSchedule._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            if (!response.ok)
                throw new Error("Network Error!!!")

            const result = await response.json()
            console.log(result);
            if (!result.success) {
                notify(result.message, 'error')
                return
            }

            notify(result.message, 'success')
            setModalOpen(false)
            debounceFetchSchedules()
        } catch (error) {
            notify("Serever error. Please try again later", 'error')
            console.error(error)
        }
    }

    const handleChangeNumber = (e) => {
        setTrainNumber(e.target.value)
    }

    const handleSearch = () => {
        if (!trainNumber || trainNumber?.length === 0) {
            alert('Enter train no to search')
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
            alert('No schedule found for given train no')
    }

    const handleCancel = () => {
        setSelectedSchedule(null)
        setModalOpen(false)
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
                <div className='flex flex-col justify-center items-center w-full h-auto py-5'>
                    {selectedSchedule && modalOpen ? (
                        <EditScheduleForm
                            selectedSchedule={selectedSchedule}
                            handleFareChange={handleFareChange}
                            handleSave={handleSave}
                            handleCancel={handleCancel}
                            farePrices={farePrices}
                        />
                    ) : (
                        <div className='w-full h-auto flex flex-row justify-center items-center flex-wrap'>
                            {schedules.length > 0 && schedules.map((schedule) =>
                                <DisplaySchedule
                                    key={schedule._id}
                                    schedule={schedule}
                                    button
                                    buttonLabel={'Edit'}
                                    onButtonClick={handleBtn}
                                />
                            )}
                        </div>
                    )}
                </div>
            )
            }
        </div >
    )
}
