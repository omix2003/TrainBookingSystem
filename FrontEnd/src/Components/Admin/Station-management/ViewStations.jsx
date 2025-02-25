import React, { useEffect, useState, useCallback, useId } from 'react'
import DisplayStation from './DisplayStation.jsx'
import useDebounce from "../../../customHooks/deBounceHook.jsx"
import SearchBar from '../SearchBar.jsx'
import LoaderComponent from '../../LoaderComponent.jsx'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function ViewStations() {
    const [stations, setStations] = useState([])
    const [stationCode, setStationCode] = useState("")
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

    const fetchStations = async () => {
        try {
            const response = await fetch('/api/v1/stations/get-station', {
                method: 'GET'
            })
            if (!response.ok)
                throw new Error(400, "Network Error !!!")

            const result = await response.json()
            // console.log(result);
            if (!result.success) {
                notify(result.message, 'error')
            }
            notify(result.message, 'success')
            setStations(result.data)
        } catch (error) {
            notify("Serever error. Please try again later", 'error')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const debounceFetchStations = useDebounce(fetchStations, 500)

    useEffect(() => {
        debounceFetchStations()
    }, [])

    const handleChangeCode = (e) => {
        setStationCode(e.target.value)
    }

    const handleSearch = () => {
        if (!stationCode) {
            alert('Enter satation code to search')
            return
        }

        const idx = stations.findIndex((station) => station.stationCode === stationCode.toUpperCase())
        if (idx !== -1) {
            const updatedStations = [...stations]
            const foundStation = updatedStations.splice(idx, 1)[0]

            updatedStations.unshift(foundStation)
            setStations(updatedStations)
        } else
            alert('No station found')
    }

    return (
        <div className='w-screen flex flex-col bg-white'>
            <ToastContainer />
            <SearchBar
                handleChangeValue={handleChangeCode}
                handleSearch={handleSearch}
                inputValue={stationCode}
                placeholder={"Enter station code"}
            />
            {loading ? (
                <LoaderComponent label={"Loading station details..."} />
            ) : (
                <div className='w-full h-auto flex items-center justify-center flex-wrap'>
                    {stations.length > 0 && stations.map((station) => <DisplayStation key={station._id} station={station} />)}
                </div>
            )
            }
        </div >

    )
}
