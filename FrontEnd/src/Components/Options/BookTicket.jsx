import React, { useState, useId } from 'react';
import { Button } from '../index.js';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import useDebounce from '../../customHooks/deBounceHook.jsx';
import HighlightedText from '../HighlightedText.jsx';


export default function BookTicket() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
    const today = new Date();
    const maxDate = new Date(today.setDate(today.getDate() + 6)).toISOString().substring(0, 10);

    const navigate = useNavigate();
    const id = useId()

    const notify = (message, type) => {
        if (type === 'success') {
            toast.success(message, {
                theme: 'colored',
                autoClose: 3000,
                toastId: id
            });
        } else {
            toast.error(message, {
                theme: 'colored',
                autoClose: 3000,
                toastId: id
            });
        }
    };

    const handleFrom = async (e) => {
        const inputValue = e.target.value;
        setFrom(inputValue);

        if (inputValue?.length >= 1) {
            debounceFetchStationSuggestions(inputValue, setFromSuggestions);
        } else {
            setFromSuggestions([]);
        }
    };

    const handleTo = async (e) => {
        const inputValue = e.target.value;
        setTo(inputValue);

        if (inputValue?.length >= 1) {
            debounceFetchStationSuggestions(inputValue, setToSuggestions);
        } else {
            setToSuggestions([]);
        }
    };

    const changeInput = () => {
        setFrom(to);
        setTo(from);
    };

    const fetchStationSuggestions = async (query, suggestionList) => {
        try {
            const response = await fetch(`/api/v1/stations/station-suggestions?query=${query}`);
            const result = await response.json();
            suggestionList(result.data);
        } catch (error) {
            console.log("Error fetching station suggestions: ", error);
        }
    };

    const debounceFetchStationSuggestions = useDebounce(fetchStationSuggestions, 500)

    const handleFromSuggestionClick = (suggestion) => {
        setFrom(suggestion.stationName);
        setFromSuggestions([]);
    };

    const handleToSuggestionClick = (suggestion) => {
        setTo(suggestion.stationName);
        setToSuggestions([]);
    };

    const handleForm = async (e) => {
        e.preventDefault();

        const requiredFields = [
            { id: 'source', value: from },
            { id: 'destination', value: to },
            { id: 'date', value: date },
        ];

        requiredFields.forEach(field => {
            if (field.value.length === 0) {
                notify(`${field.id} is required`, 'error')
                return;
            }
        });

        if (from.length === 0 || to.length === 0 || date.length === 0) {
            notify("All fields are required", 'error')
            return;
        }

        const formData = {
            source: from,
            destination: to,
            dateOfJourney: date
        };

        localStorage.setItem('Info', JSON.stringify(formData));
        navigate('/book-ticket');
    };

    return (
        <div className='min-h-screen relative top-40 bg-transparent flex flex-col items-center'>
            <ToastContainer stacked />
            <form onSubmit={handleForm} className='bg-white p-6 shadow-md rounded-lg mt-10 w-11/12 md:w-2/3 lg:w-1/2'>
                <div className='flex flex-col md:flex-row justify-between mb-4'>
                    <div className='flex flex-col mb-4 md:mb-0 '>
                        <label htmlFor='source' className='text-orange-500 mb-2 relative right-20 pl-2'>From</label>
                        <input
                            id='source'
                            autoFocus
                            className='p-2 border border-gray-300 rounded-lg shadow-md'
                            value={from}
                            onChange={handleFrom}
                            type='text'
                            placeholder='Leaving from'
                        />
                        {fromSuggestions?.length > 0 && (
                            <ul className='absolute top-36 z-10 w-48 max-h-48 overflow-y-auto mt-2 bg-white border border-gray-300 rounded-lg shadow-md'>
                                {fromSuggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleFromSuggestionClick(suggestion)}
                                        className='p-2 cursor-pointer hover:bg-gray-100'
                                    >
                                        <HighlightedText text={suggestion.stationName} highlight={from} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className='flex items-center justify-center mb-4 md:mb-0'>
                        <img
                            src='../../../photos/exchange.png'
                            onClick={changeInput}
                            className='w-8 h-8 relative top-4 cursor-pointer'
                            alt='Exchange Icon'
                        />
                    </div>
                    <div className='flex flex-col '>
                        <label htmlFor='destination' className='text-orange-500 mb-2 relative right-20'>To</label>
                        <input
                            id='destination'
                            className='p-2 border border-gray-300 rounded-lg shadow-md'
                            value={to}
                            onChange={handleTo}
                            type='text'
                            placeholder='Going to'
                        />
                        {toSuggestions?.length > 0 && (
                            <ul className='absolute top-36 z-10 w-48 max-h-48 overflow-y-auto mt-2 bg-white border border-gray-300 rounded-lg shadow-md'>
                                {toSuggestions.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleToSuggestionClick(suggestion)}
                                        className='p-2 cursor-pointer hover:bg-gray-100'
                                    >
                                        <HighlightedText text={suggestion.stationName} highlight={to} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div className='flex flex-col mb-4 '>
                    <label htmlFor='date' className='text-orange-500 mb-2 relative right-56' >Journey date</label>
                    <input
                        id='date'
                        className='p-2 border border-gray-300 rounded-lg shadow-md'
                        type='date'
                        onChange={(e) => setDate(e.target.value)}
                        value={date}
                        min={new Date().toISOString().substring(0, 10)}
                        max={maxDate}
                    />
                </div>
                <Button type='submit' className='bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600'>
                    Search Trains
                </Button>
            </form>
            {/* <div className='w-11/12 md:w-2/3 lg:w-1/2 p-6 mt-10 bg-orange-200 rounded-lg shadow-md'>
                <div className='flex items-center justify-center'>
                    <input
                        type='checkbox'
                        id='check'
                        className='w-4 h-4 focus:ring-orange-400 focus:ring-offset-orange-200 mr-2'
                    />
                    <label htmlFor='check' className='text-gray-700'>Opt for free cancellation</label>
                </div>
                <div className='flex justify-between mt-2'>
                    <p className='text-gray-600'>Rs.0 cancellation fee</p>
                    <p className='text-gray-600'>Instant refunds</p>
                    <p className='text-gray-600'>No documentation required</p>
                </div>
            </div> */}
        </div>
    );
}
