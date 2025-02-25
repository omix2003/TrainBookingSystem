import React, { useState, useEffect, useRef, useCallback, useId } from 'react';
import { Button } from '../Components/index.js';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import useDebounce from '../customHooks/deBounceHook.jsx';
import HighlightedText from '../Components/HighlightedText.jsx';

export default function BookTicketPage() {
    const formInfo = JSON.parse(localStorage.getItem('Info'));
    const navigate = useNavigate()
    const id = useId()

    const today = new Date();
    const maxDate = new Date(today.setDate(today.getDate() + 6)).toISOString().substring(0, 10);

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

    const fromRef = useRef(formInfo.source);
    const toRef = useRef(formInfo.destination);
    const dateRef = useRef(formInfo.dateOfJourney);

    const [trainData, setTrainData] = useState([]);
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [date, setDate] = useState("");
    const [trainFound, setTrainFound] = useState(false);
    const [source, setSource] = useState("")
    const [destination, setDestination] = useState("")


    useEffect(() => {
        setFrom(fromRef.current);
        setTo(toRef.current);
        setDate(dateRef.current);
    }, []);

    useEffect(() => {
        setSource(from || "")
        setDestination(to || "")
    }, [trainFound, trainData])

    useEffect(() => {
        debounceFetchTrainData(formInfo);
    }, []);

    const fetchTrainData = useCallback(async (formData) => {
        try {
            const urlParams = new URLSearchParams(formData).toString();
            const response = await fetch(`/api/v1/trains/search-train-by-journey?${urlParams}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            // if (!response.ok) {
            //     console.error('Network error');
            // }

            const data = await response.json();
            console.log(data);

            if (!data?.success) {
                setTrainFound(false);
                setTrainData([]);
                notify(data.message, 'error')
            } else {
                setTrainFound(true);
                setTrainData(data.data);
            }

        } catch (error) {
            notify("Server error. Please try again later", 'error')
            // console.error(error);
        }
    }, [])

    const debounceFetchTrainData = useDebounce(fetchTrainData, 500)

    const updateTrainDetails = useCallback((train) => {
        if (!train || !trainFound)
            return {}

        let departureTime = '';
        let arrivalTime = '';
        train.route.forEach((station) => {
            if (station.stationName === from) {
                departureTime = station.departureTime;
            } else if (station.stationName === to) {
                arrivalTime = station.arrivalTime;
            }
        });

        const duration = departureTime && arrivalTime ? getTimeDifference(departureTime, arrivalTime) : { hours: 0, minutes: 0 }

        const newSeats = {};
        const newWaiting = {};
        if (train?.availableDays?.seats.length > 0) {
            const seats = train?.availableDays?.seats;
            seats.forEach((seat) => {
                newSeats[seat.className] = seat.seatsAvailable;
                newWaiting[seat.className] = seat.waitingList;
            });
        }

        const newPrices = {};
        if (train?.availableDays?.fares?.length > 0) {
            const fares = train.availableDays.fares;

            const startIdx = fares.findIndex(fare => fare.sourceStation === source);
            const endIdx = fares.findIndex(fare => fare.destinationStation === destination);

            if (startIdx !== -1 && endIdx !== -1) {
                for (let i = 0; i < fares[0].classFares.length; i++) {
                    let totalFare = 0;
                    for (let j = startIdx; j <= endIdx; j++) {
                        if (fares[j] && fares[j].classFares[i]) {
                            totalFare += fares[j].classFares[i].fare;
                        }
                    }
                    newPrices[fares[0].classFares[i].className] = totalFare;
                }
            }

            const trainName = (train?.trainName || '')

            return { arrivalTime, departureTime, duration, prices: newPrices, seats: newSeats, waiting: newWaiting, trainName }
        }
    }, [trainFound, trainData, from, to, source, destination])

    function parseTime(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes; // Convert time to total minutes
    }

    function getTimeDifference(time1, time2) {
        const minutes1 = parseTime(time1);
        const minutes2 = parseTime(time2);

        const diffInMinutes = Math.abs(minutes2 - minutes1);
        const hours = Math.floor(diffInMinutes / 60);
        const minutes = diffInMinutes % 60;

        return { hours, minutes };
    }

    const fetchStationSuggestions = useCallback(async (query, setSuggestions) => {
        try {
            const response = await fetch(`/api/v1/stations/station-suggestions?query=${query}`);
            const result = await response.json();
            setSuggestions(result.data);
        } catch (error) {
            console.log("Error fetching station suggestions: ", error);
        }
    }, []);

    const debounceFetchStationSuggestion = useDebounce(fetchStationSuggestions, 500)

    const handleFrom = useCallback(async (e) => {
        const inputValue = e.target.value;
        setFrom(inputValue);

        if (inputValue.length >= 1) {
            debounceFetchStationSuggestion(inputValue, setFromSuggestions)
        } else {
            setFromSuggestions([]);
        }
    }, [fetchStationSuggestions]);

    const handleTo = useCallback(async (e) => {
        const inputValue = e.target.value;
        setTo(inputValue);
        if (inputValue.length >= 1) {
            debounceFetchStationSuggestion(inputValue, setToSuggestions)
        } else {
            setToSuggestions([]);
        }
    }, [fetchStationSuggestions]);

    const handleFromSuggestionClick = useCallback((suggestion) => {
        setFrom(suggestion.stationName);
        setFromSuggestions([]);
    }, []);

    const handleToSuggestionClick = useCallback((suggestion) => {
        setTo(suggestion.stationName);
        setToSuggestions([]);
    }, []);

    const changeInput = useCallback(() => {
        setFrom(to);
        setTo(from);
    }, [from, to]);

    const handleForm = useCallback(async (e) => {
        e.preventDefault();

        if (from.length === 0 || to.length === 0 || date.length === 0) {
            alert('All fields are required');
            return;
        }

        const formData = {
            source: from,
            destination: to,
            dateOfJourney: date
        };

        debounceFetchTrainData(formData);
    }, [from, to, fetchTrainData, date]);

    const collectData = useCallback((train, type, prices, seats, waiting, departureTime, arrivalTime) => {
        const data = {
            train,
            type,
            prices,
            seats,
            waiting,
            source,
            destination,
            date,
            departureTime,
            arrivalTime
        }
        localStorage.setItem('bookingData', JSON.stringify(data))
        navigate('/add-passenger-details', { replace: true })
    }, [navigate, source, destination, date])

    return (
        <div className="w-full h-screen bg-gray-100 flex flex-col items-center">
            <ToastContainer style={{ width: '480px' }} />
            {/* Train search form */}
            <div className="relative top-0 bg-white shadow-md rounded-lg p-6 w-10/12 mt-10">
                <form onSubmit={handleForm} className="flex flex-col space-y-5">
                    <div className="flex justify-between items-center">
                        <div className="flex flex-col w-1/4">
                            <label htmlFor="source" className="mb-1 relative right-24 text-orange-500">From</label>
                            <input
                                id="source"
                                className="p-2 border border-gray-300 rounded-lg"
                                value={from}
                                onChange={handleFrom}
                                type="text"
                                placeholder="Leaving from"
                            />
                            {fromSuggestions?.length > 0 && (
                                <ul className="absolute top-20 z-10 w-48 max-h-48 overflow-y-auto my-2 bg-white border border-gray-300 rounded-lg shadow-md">
                                    {fromSuggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleFromSuggestionClick(suggestion)}
                                            className="p-2 cursor-pointer hover:bg-gray-100"
                                        >
                                            <HighlightedText text={suggestion.stationName} highlight={from} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <img
                            src="../../../photos/exchange.png"
                            onClick={changeInput}
                            className="w-8 h-8 relative top-4 cursor-pointer self-center"
                            alt="Exchange Icon"
                        />
                        <div className="flex flex-col w-1/4">
                            <label htmlFor="destination" className="mb-1 relative right-24 text-orange-500">To</label>
                            <input
                                id="destination"
                                className="p-2 border border-gray-300 rounded-lg"
                                value={to}
                                onChange={handleTo}
                                type="text"
                                placeholder="Going to"
                            />
                            {toSuggestions?.length > 0 && (
                                <ul className="absolute top-20 z-10 w-48 max-h-48 overflow-y-auto my-2 bg-white border border-gray-300 rounded-lg shadow-md">
                                    {toSuggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleToSuggestionClick(suggestion)}
                                            className="p-2 cursor-pointer hover:bg-gray-100"
                                        >
                                            <HighlightedText text={suggestion.stationName} highlight={to} />
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="flex flex-col w-1/4">
                            <label htmlFor="date" className="mb-1 relative right-16 text-orange-500">Journey date</label>
                            <input
                                id="date"
                                className="p-2 border border-gray-300 rounded-lg"
                                type="date"
                                onChange={(e) => setDate(e.target.value)}
                                value={date}
                                min={new Date().toISOString().substring(0, 10)}
                                max={maxDate}
                            />
                        </div>
                    </div>
                    <Button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600">
                        Search Trains
                    </Button>
                </form>

                {/* Navigate button */}
                <div>
                    <div className='w-full flex items-center justify-around px-20 py-10 gap-10'>
                        <button onClick={() => navigate('/search-train')} className='w-1/3 bg-orange-300 hover:bg-white hover:text-orange-400 transition-all duration-300 ease-in-out px-10 py-5 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex flex-row justify-center items-center gap-5'>
                            Search Train
                            <img src='photos/rightArraow.png' className='w-5 h-5'></img>
                        </button>

                        <button onClick={() => navigate('/pnr-status')} className='w-1/3 bg-orange-300 hover:bg-white hover:text-orange-400 transition-all duration-300 ease-in-out px-10 py-5 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex flex-row justify-center items-center gap-5'>
                            Check PNR Status
                            <img src='photos/rightArraow.png' className='w-5 h-5'></img>
                        </button>
                    </div>
                </div>

            </div>

            {/* fetched train */}
            <div className='w-full h-auto bg-gray-100 flex flex-col items-center'>
                {trainFound ? (trainData.map((train, index) => {
                    const { arrivalTime, departureTime, duration, prices, seats, waiting, trainName } = updateTrainDetails(train);

                    const todayDate = new Date()
                    const journeyDate = new Date(date)
                    if (todayDate.toDateString() === journeyDate.toDateString()) {
                        const hours = todayDate.getHours();
                        const minutes = todayDate.getMinutes();

                        const departureHours = parseInt(departureTime.substring(0, 2));
                        const departureMinutes = parseInt(departureTime.substring(3, 5));

                        let hourDifference = departureHours - hours;
                        let minuteDifference = departureMinutes - minutes;

                        if (minuteDifference < 0) {
                            hourDifference -= 1;
                            minuteDifference += 60;
                        }

                        if (hourDifference < 4 || (hourDifference === 3 && minuteDifference < 60)) {
                            return (
                                <div key={index} className="w-10/12 p-6 mt-10 bg-white shadow-md rounded-lg mb-6">
                                    <div className="border-b border-gray-200 py-4">
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
                                        {/* <ul className="flex gap-x-5 items-center justify-start mt-5">
                                            {Object.keys(prices).map((type, i) => (
                                                <li key={i} className="bg-orange-200 p-4 rounded-lg flex flex-col items-center cursor-pointer">
                                                    <div>{type} | Rs. {prices[type]}</div>
                                                    <div>{`${seats[type] > 0 ? `AVL: ${seats[type]}` : `WL: ${waiting[type]}`}`}</div>
                                                </li>
                                            ))}
                                        </ul> */}
                                        <div className='w-full flex justify-center items-center mt-4'>
                                            <h1 className='text-red-600 font-semibold text-center text-2xl'>
                                                Booking is now closed for this train. Please choose another train.
                                            </h1>
                                        </div>

                                    </div>
                                </div>
                            )
                        }
                    }

                    return (
                        <div key={index} className="w-10/12 p-6 mt-10 bg-white shadow-md rounded-lg mb-6">
                            <div className="border-b border-gray-200 py-4">
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
                                    {Object.keys(prices).map((type, i) => (
                                        <li key={i} onClick={() => collectData(train, type, prices, seats, waiting, departureTime, arrivalTime)} className="bg-orange-200 p-4 rounded-lg flex flex-col items-center cursor-pointer">
                                            <div>{type} | Rs. {prices[type]}</div>
                                            <div>{`${seats[type] > 0 ? `AVL: ${seats[type]}` : `WL: ${waiting[type]}`}`}</div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    );
                })
                ) : (
                    <div className="font-sans bg-custom-background p-5 shadow-lg rounded-lg text-red-500 text-center mt-20 text-lg">
                        <h2 className="text-2xl">Train Not Found</h2>
                        <p>No train is available for the selected journey. Please try with a different source or destination.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
