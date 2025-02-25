import React, { useEffect, useState, useCallback, useId } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import useDebounce from "../../../customHooks/deBounceHook.jsx"
import DisplayStation from './DisplayStation.jsx';
import EditStationForm from './EditStationForm.jsx';
import SearchBar from '../SearchBar.jsx';
import LoaderComponent from '../../LoaderComponent.jsx';

export default function EditStation() {
    const [stations, setStations] = useState([]);
    const [stationCode, setStationCode] = useState("");
    const [selectedStation, setSelectedStation] = useState({});
    const [openModal, setOpenModal] = useState(false);
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
        setLoading(true)
        try {
            const response = await fetch('/api/v1/stations/get-station', {
                method: 'GET'
            });
            if (!response.ok) throw new Error("Network Error!!!");

            const result = await response.json();
            if (!result.success) {
                setStations([]);
                throw new Error("Error in fetching stations: " + result.message);
            }

            setStations(result.data);
        } catch (error) {
            setStations([]);
            console.error(error);
        } finally {
            setLoading(false)
        }
    };

    const debounceFetchStations = useDebounce(fetchStations, 500)

    useEffect(() => {
        debounceFetchStations()
    }, []);

    const handleChangeCode = (e) => {
        setStationCode(e.target.value);
    };

    const handleModal = (station) => {
        setSelectedStation(station)
        setOpenModal(true);
    };

    const handleEditStation = (e) => {
        const { name, value } = e.target
        setSelectedStation({ ...selectedStation, [name]: value })
    }

    const handleSearch = () => {
        if (!stationCode) {
            alert('Enter station code to search');
            return;
        }

        const idx = stations.findIndex((station) => station.stationCode === stationCode.toUpperCase());
        if (idx !== -1) {
            const updatedStations = [...stations];
            const foundStation = updatedStations.splice(idx, 1)[0];

            updatedStations.unshift(foundStation);
            setStations(updatedStations);
        } else {
            alert('No station found');
        }
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`/api/v1/stations/update-station/c/${selectedStation._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selectedStation)
            })

            const result = await response.json()

            if (!result.success) {
                notify(result.message, 'error')
                return
            }

            notify(result.message, 'success')
            setOpenModal(false)
            debounceFetchStations()
        } catch (error) {
            console.error(error)
            notify('Server error. Please try again later.', 'error');
        }
    }

    const handleCancel = () => {
        setOpenModal(false);
        setSelectedStation({});
    };

    return (
        <div className='w-screen h-screen flex flex-col bg-white'>
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
                (openModal ? (
                    <EditStationForm
                        selectedStation={selectedStation}
                        handleEditStation={handleEditStation}
                        handleUpdate={handleUpdate}
                        handleCancel={handleCancel}
                    />
                ) : (
                    <div className='w-full h-auto flex items-center justify-center flex-wrap'>
                        {stations.length > 0 && stations.map((station) =>
                            <DisplayStation
                                key={station._id}
                                station={station}
                                button
                                buttonLabel={'Edit'}
                                onButtonClick={handleModal}
                            />)}
                    </div>
                ))
            )}
        </div >
    );
}
