import React, { useState, useEffect, useId, useCallback } from 'react'
import useDebounce from "../../../customHooks/deBounceHook.jsx"
import DisplaySchedule from './DisplaySchedule.jsx'
import SearchBar from '../SearchBar.jsx'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import LoaderComponent from '../../LoaderComponent.jsx';


export default function ViewSchedule() {

    const [schedules, setSchedules] = useState([])
    const [loading, setLoading] = useState(true)
    const [trainNumber, setTrainNumber] = useState("")
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
        try {
            const response = await fetch('/api/v1/schedule/get-schedule', {
                method: 'GET'
            })
            if (!response.ok)
                throw new Error("Network Error!!!")

            const result = await response.json()
            if (!result.success) {
                notify(result.message, 'error')
                return
            }

            notify(result.message, 'success')
            setSchedules(result.data)
        } catch (error) {
            notify("Server error. Please try again later", 'error')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const debounceFetchSchedules = useDebounce(fetchSchedules, 500)

    useEffect(() => {
        debounceFetchSchedules()
    }, [])

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
                <div className='w-full h-auto flex flex-row justify-center items-center flex-wrap'>
                    {schedules.length > 0 && schedules.map((schedule) =>
                        <DisplaySchedule
                            key={schedule._id}
                            schedule={schedule}
                        />
                    )}
                </div>
            )
            }
        </div >
    )
}
