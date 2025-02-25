import React, { useState, useId, useCallback } from 'react';
import { Button } from '../index.js';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import useDebounce from '../../customHooks/deBounceHook.jsx';
import HighlightedText from "../HighlightedText.jsx"

export default function SearchTrain() {
    const [field, setField] = useState("");
    const [trainSuggestions, setTrainSuggestions] = useState([]);

    const navigate = useNavigate()
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

    const handleField = (e) => {
        const value = e.target.value;
        setField(value);

        if (value.length === 0) {
            setTrainSuggestions([])
            return
        }

        if (!isNaN(field)) {
            setTrainSuggestions([]);
        } else {
            debounceFetchTrainSuggestions(value)
        }
    };

    const getTrainSuggestions = async (query) => {
        try {
            const response = await fetch(`/api/v1/trains/train-suggestions?query=${query}`);
            const result = await response.json();

            if (result?.success)
                setTrainSuggestions(result.data);
        } catch (error) {
            console.error("Error while getting suggestions: ", error);
        }
    };

    const debounceFetchTrainSuggestions = useDebounce(getTrainSuggestions, 500)

    const handleSuggestionClick = (suggestion) => {
        setField(suggestion.trainName);
        setTrainSuggestions([]);
    };

    const handleForm = async (e) => {
        e.preventDefault();

        if (field.trim().length === 0) {
            notify("Train No or name is required", 'error')
            return;
        }

        localStorage.setItem('searchTrainQuery', JSON.stringify(field))

        navigate('/search-train')
    };

    return (
        <div className='relative top-60 bg-transperant rounded-xl flex flex-row justify-center'>
            <ToastContainer />
            <div className='w-10/12 bg-custom-background rounded-xl flex flex-row'>
                <div className='w-4/12 h-24 bg-custom-orange rounded-l-xl flex flex-row justify-center items-center gap-x-5 shadow-md'>
                    <img src='../../../photos/train_detail.png' className='w-12 h-12 mix-blend-multiply' alt='PNR Icon' />
                    <p className='text-white font-semibold'>Get live running status of train</p>
                </div>
                <form onSubmit={handleForm} className='w-8/12 h-24 px-10  rounded-r-xl flex flex-row justify-between items-center bg-white shadow-md'>
                    <div className='flex flex-col gap-y-1.5'>
                        <label htmlFor='ser' className='text-gray-600 relative right-12 mt-3'>Train Name/Number</label>
                        <input
                            id='ser'
                            autoFocus
                            value={field}
                            onChange={handleField}
                            className='w-64 mb-3 p-2 border border-gray-300 rounded-lg shadow-sm'
                            type='text'
                            placeholder='Enter Train name/number'
                        />
                        {trainSuggestions?.length > 0 && (
                            <ul className='absolute w-64 max-h-48 z-10 overflow-y-auto mt-20 bg-white border border-gray-300 rounded-lg shadow-md'>
                                {trainSuggestions?.map((suggestion, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className='pl-2 pr-4 py-2 cursor-pointer hover:bg-orange-100'
                                    >
                                        <HighlightedText text={suggestion.trainName} highlight={field} />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <Button
                        type='submit'
                        className='w-30 px-3 py-1.5 text-xl rounded-lg bg-orange-500 text-white hover:bg-orange-600'
                    >
                        Check Status
                    </Button>
                </form>
            </div>
        </div>
    );
}
