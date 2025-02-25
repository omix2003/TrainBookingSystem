import React, { useEffect, useState, useCallback, useId } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import DisplayTrain from './DisplayTrain.jsx';
import useDebounce from '../../../customHooks/deBounceHook.jsx';
import EditTrainForm from './EditTrainForm.jsx';
import SearchBar from '../SearchBar.jsx';
import LoaderComponent from '../../LoaderComponent.jsx';

export default function EditTrains() {
    const [trains, setTrains] = useState([]);
    const [trainNumber, setTrainNumber] = useState("")
    const [selectedTrain, setSelectedTrain] = useState(null);
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

    const fetchAllTrains = async () => {
        try {
            const response = await fetch('/api/v1/trains/get-all-trains', {
                method: "GET"
            });
            if (!response.ok)
                throw new Error("Network Error!!!");

            const data = await response.json();
            if (!data.success) {
                notify(data.message, 'error')
                return
            }

            notify(data.message, 'success')
            setTrains(data.data);
        } catch (error) {
            notify("Server error. Please try again later", 'error')
            console.error(error);
        } finally {
            setLoading(false)
        }
    };

    const debounceFetchAllTrains = useDebounce(fetchAllTrains, 500)

    useEffect(() => {
        debounceFetchAllTrains()
    }, []);

    const handleChangeNumber = (e) => {
        setTrainNumber(e.target.value)
    }

    const handleSearch = () => {
        if (!trainNumber) {
            alert('Please enter train number to search')
            return;
        }

        const foundTrainIndex = trains.findIndex(train => train.trainNo === Number(trainNumber));
        if (foundTrainIndex !== -1) {
            //To remove the found train from the array
            const updatedTrains = [...trains];
            const foundTrain = updatedTrains.splice(foundTrainIndex, 1)[0];
            //To add the found train back to the beginning of the array
            updatedTrains.unshift(foundTrain);
            setTrains(updatedTrains);
        } else {
            alert('No train found');
        }
    }

    const editTrainDetails = (editTrain) => {
        setSelectedTrain(editTrain)
    }

    const handleTrainNameChange = (e) => {
        setSelectedTrain({ ...selectedTrain, trainName: e.target.value });
    };

    const handleTrainNoChange = (e) => {
        setSelectedTrain({ ...selectedTrain, trainNo: e.target.value });
    };

    const handleStationNameChange = (e, index) => {
        const updatedRoute = selectedTrain.route.map((station, i) =>
            i === index ? { ...station, stationName: e.target.value } : station
        );
        setSelectedTrain({ ...selectedTrain, route: updatedRoute });
    };

    const handleArrivalTimeChange = (e, index) => {
        const updatedRoute = selectedTrain.route.map((station, i) =>
            i === index ? { ...station, arrivalTime: e.target.value } : station
        );
        setSelectedTrain({ ...selectedTrain, route: updatedRoute });
    };

    const handleDepartureTimeChange = (e, index) => {
        const updatedRoute = selectedTrain.route.map((station, i) =>
            i === index ? { ...station, departureTime: e.target.value } : station
        );
        setSelectedTrain({ ...selectedTrain, route: updatedRoute });
    };

    const handleForm = async (e) => {
        e.preventDefault()

        const trainName = selectedTrain.trainName
        const trainNo = selectedTrain.trainNo
        const route = selectedTrain.route

        if (!trainName || !trainNo || !route || route.length === 0) {
            notify("All details are required", 'error')
            return;
        }

        for (let i = 0; i < route.length; i++) {
            const station = route[i];

            if (!station.stationName || station.stationName.length === 0 ||
                !station.stationCode || station.stationCode.length === 0 ||
                !station.arrivalTime || station.arrivalTime.length === 0 ||
                !station.departureTime || station.departureTime.length === 0 ||
                !station.stopNumber || station.stopNumber?.length === 0) {
                notify(`Details required for station-${i + 1}`, 'error')
                return
            }
        }

        try {
            const updatedData = {
                trainName,
                trainNo,
                route,
            }

            const response = await fetch(`/api/v1/trains/update-details/c/${selectedTrain._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedData)
            })
            // if (!response.ok)
            //     throw new Error("Network Error !!!")

            const result = await response.json()
            // console.log(result);

            if (!result.success) {
                notify(result.message, 'error')
                return;
            }

            setLoading(true)
            await fetchAllTrains()
            notify(result.message, 'success')
            setSelectedTrain(null)
        } catch (error) {
            console.error(error)
            notify('Server error. Please try again later.', 'error');
        }

    }

    const handleCancel = () => {
        setSelectedTrain(null)
    }

    return (
        <div className='h-screen w-screen flex flex-col bg-orange-50'>
            <ToastContainer />
            <SearchBar
                handleChangeValue={handleChangeNumber}
                handleSearch={handleSearch}
                inputValue={trainNumber}
            />
            {loading ? (
                <LoaderComponent label={"Loading train details..."} />
            ) : (
                <div className='w-screen h-auto flex justify-center items-center bg-orange-50' >
                    {
                        selectedTrain ? (
                            <EditTrainForm
                                selectedTrain={selectedTrain}
                                handleForm={handleForm}
                                handleArrivalTimeChange={handleArrivalTimeChange}
                                handleDepartureTimeChange={handleDepartureTimeChange}
                                handleStationNameChange={handleStationNameChange}
                                handleTrainNameChange={handleTrainNameChange}
                                handleTrainNoChange={handleTrainNoChange}
                                handleCancel={handleCancel}
                            />
                        ) : (
                            trains?.length > 0 ? (
                                <div className='w-10/12 p-3'>
                                    {trains.map((train) => <DisplayTrain key={train._id} train={train} button buttonLabel={'Edit'} onButtonClick={editTrainDetails} />)}
                                </div>
                            ) : (
                                <div className='w-6/12 mt-32 flex justify-center items-center bg-white shadow-md rounded-md px-8 py-3'>
                                    <div className='text-xl font-semibold text-red-600'>No trains available</div>
                                </div>
                            )
                        )
                    }
                </div >
            )
            }
        </div >
    );
}
