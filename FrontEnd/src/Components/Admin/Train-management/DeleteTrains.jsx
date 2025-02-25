import React, { useEffect, useState, useCallback, useId } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import useDebounce from '../../../customHooks/deBounceHook.jsx';
import DisplayTrain from './DisplayTrain.jsx';
import DeleteModal from '../DeleteModal.jsx';
import SearchBar from '../SearchBar.jsx';
import LoaderComponent from '../../LoaderComponent.jsx';

export default function DeleteTrains() {
    const [trains, setTrains] = useState([]);
    const [selectedTrain, setSelectedTrain] = useState("");
    const [trainNumber, setTrainNumber] = useState("")
    const [openModal, setOpenModal] = useState(false)
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
        setLoading(true)
        try {
            const response = await fetch('/api/v1/trains/get-all-trains', {
                method: "GET"
            });
            // if (!response.ok)
            //     throw new Error("Network Error!!!");

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

    const handleDelete = (train) => {
        setSelectedTrain(train)
        setOpenModal(true)
    }

    const deleteSelectedTrain = async () => {
        try {
            const response = await fetch(`/api/v1/trains/delete-train/c/${selectedTrain._id}`, {
                method: 'DELETE'
            })
            // if (!response.ok) {
            //     throw new Error("Network Error or deletion failed");
            // }

            const data = await response.json()
            console.log(data);
            if (!data?.success) {
                notify(data.message, 'error')
                return;
            }
            notify(data.message, 'success')
            await fetchAllTrains()
            setOpenModal(false)
        } catch (error) {
            console.error(error)
            notify('Server error. Please try again later.', 'error');
        }
    }

    const handleCancel = () => {
        setOpenModal(false)
        setSelectedTrain("")
    }

    return (
        <div className='w-screen h-screen bg-orange-50' >
            <ToastContainer />
            <SearchBar
                handleChangeValue={handleChangeNumber}
                handleSearch={handleSearch}
                inputValue={trainNumber}
            />
            {loading ? (
                <LoaderComponent label={"Loading train details..."} />
            ) : (
                <div className='w-screen h-auto flex justify-center items-center bg-orange-50'>
                    {
                        openModal ? (
                            <DeleteModal
                                onConfirm={deleteSelectedTrain}
                                onCancel={handleCancel}
                                deleteLabel={`Are you sure you want to delete ${selectedTrain?.trainName}?`}
                            />
                        ) : (
                            <div className='w-10/12 p-3'>
                                {trains.map((train) => <DisplayTrain key={train._id} train={train} button buttonLabel={'Delete'} onButtonClick={handleDelete} />)}
                            </div>
                        )}
                </div>
            )
            }
        </div >
    )
}
