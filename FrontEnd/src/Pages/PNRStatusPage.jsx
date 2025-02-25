import React, { useState, useEffect, useId } from 'react';
import { Button } from '../Components/index.js';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import useDebounce from '../customHooks/deBounceHook.jsx';
import { useNavigate } from 'react-router-dom';

export default function PNRStatusPage() {

    const [pnrNo, setPnrNo] = useState("");
    const [pnrData, setPnrData] = useState(null);
    const [loadingData, setLoadingData] = useState(true);
    const navigate = useNavigate()

    const id = useId()

    const notify = (message, type) => {
        if (type === 'success') {
            toast.success(message, {
                theme: 'colored',
                toastId: id
            });
        } else {
            toast.error(message, {
                theme: 'colored',
                toastId: id
            });
        }
    };

    const fetchTravellerData = async (pnr) => {

        if (pnr.trim().length !== 10) {
            notify('Please enter a valid 10-digit PNR number', 'error');
            setLoadingData(false)
            return;
        }
        try {
            const response = await fetch(`/api/v1/book-ticket/booking-details/c/${pnr}`, {
                method: 'GET'
            });
            console.log(response);

            const data = await response.json();
            // console.log(data);

            if (!data.success) {
                setLoadingData(false)
                notify(`Booking details not found for PNR No: ${pnr}`, 'error');
            } else {
                setPnrData(data.data);
                notify('PNR details fetched successfully', 'success');
            }
        } catch (error) {
            console.error('Error fetching PNR details: ', error);
            notify('Server error. Please try again later.', 'error');
        } finally {
            setLoadingData(false);
        }
    };

    const debounceFetchTravellerData = useDebounce(fetchTravellerData, 500)

    function formatDate(inputDate) {
        const date = new Date(inputDate);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();

        return `${day}-${month}-${year}`;
    }

    const handleForm = async (e) => {
        e.preventDefault();

        debounceFetchTravellerData(pnrNo);
    };

    useEffect(() => {
        const storedPnrData = JSON.parse(localStorage.getItem('pnrFormData'));
        if (storedPnrData) {
            setPnrNo(storedPnrData);
            debounceFetchTravellerData(storedPnrData);
        }
    }, []);

    // if (loadingData) {
    //     return (
    //         <div role="status">
    //             <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-red-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
    //                 <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
    //                 <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
    //             </svg>
    //             <span className="sr-only">Fetching PNR data...</span>
    //         </div>)
    // }

    return (
        <div className='w-full h-screen flex flex-col items-center'>
            <ToastContainer />
            <div className='w-full bg-orange-100 p-5 pb-10 flex flex-col items-center'>
                {/* PNR Status Form */}
                <form onSubmit={handleForm} className='w-9/12 p-8 bg-white shadow-lg rounded-xl flex flex-col items-center'>
                    <h1 className='text-4xl font-semibold mb-6 text-orange-600'>PNR Status</h1>
                    <div className='w-full flex items-center justify-center mb-6'>
                        <input
                            id='pnr'
                            onChange={(e) => setPnrNo(e.target.value)}
                            className='w-80 px-5 py-3 text-lg font-medium border border-gray-300 rounded-l-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500'
                            type='text'
                            value={pnrNo}
                            placeholder='Enter 10-digit PNR number'
                        />
                        <Button
                            type='submit'
                            className='w-40 py-3 text-lg font-medium rounded-r-lg bg-orange-500 text-white hover:bg-orange-600 transition-all duration-300 ease-in-out'
                        >
                            Check Status
                        </Button>
                    </div>
                </form>

                {/* Navigation Buttons */}
                <div className='w-full flex items-center justify-around px-20 py-10 gap-10'>
                    {/* Search Train Button */}
                    <button
                        onClick={() => navigate('/search-train')}
                        className='w-1/3 bg-orange-400 hover:bg-white hover:text-orange-500 text-white transition-all duration-300 ease-in-out px-10 py-5 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex flex-row justify-center items-center gap-5'
                    >
                        Search Train
                        <img src='photos/rightArraow.png' className='w-6 h-6'></img>
                    </button>

                    {/* Book Ticket Button */}
                    <button
                        onClick={() => navigate('/book-ticket')}
                        className='w-1/3 bg-orange-400 hover:bg-white hover:text-orange-500 text-white transition-all duration-300 ease-in-out px-10 py-5 text-lg font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 flex flex-row justify-center items-center gap-5'
                    >
                        Book Ticket
                        <img src='photos/rightArraow.png' className='w-6 h-6'></img>
                    </button>
                </div>
            </div>


            {loadingData ? (
                <div className="w-full flex justify-center items-center mt-40">
                    <div className="w-6/12 flex justify-center items-center bg-orange-100 shadow-md rounded-md text-center py-8 text-2xl font-medium">
                        <div>Fetching PNR Data...</div>
                    </div>
                </div>
            ) : (
                (pnrData ? (
                    <div className='w-full max-w-4xl mt-10 flex flex-col justify-center items-center gap-y-16'>
                        <div className='flex flex-col items-center gap-y-4'>
                            <h1 className='text-3xl font-medium text-orange-500'>Trip Overview</h1>
                            <div className='flex flex-row items-center text-lg text-gray-700'>
                                <span>{pnrData?.trainName[0] || ""}-{pnrData?.trainNo[0] || ""}</span>
                                <span className='px-2'>|</span>
                                <span>{pnrData?.className[0]}</span>
                            </div>
                        </div>
                        <div className='w-full flex flex-row items-center justify-around gap-x-10'>
                            <div className='flex flex-col items-center text-center'>
                                <div className='text-4xl font-bold text-gray-800'>{pnrData?.source || "N.A."}</div>
                                <div className='text-lg text-gray-500'>Departure: {pnrData?.departureTime || "N.A."}</div>
                            </div>
                            <div className='flex items-center flex-col'>
                                <div className='flex flex-row'>
                                    <span className='text-2xl text-gray-400'>----</span>
                                    <div className='mx-5 text-xl text-gray-700'>{`${pnrData?.duration.hours || '00'}Hr ${pnrData?.duration.minutes || '00'}Min`}</div>
                                    <span className='text-2xl text-gray-400'>----</span>
                                </div>
                                <div>Date of Journey : {formatDate(pnrData.dateOfJourney)}</div>
                            </div>
                            <div className='flex flex-col items-center text-center'>
                                <div className='text-4xl font-bold text-gray-800'>{pnrData?.destination || "N.A."}</div>
                                <div className='text-lg text-gray-500'>Arrival: {pnrData?.arrivalTime || "N.A."}</div>
                            </div>
                        </div>
                        {pnrData?.passengerDetails[0].length > 0 && (
                            <div className="w-full max-w-4xl mt-10">
                                <h2 className="text-2xl font-medium text-orange-500 mb-4">Passenger Details</h2>
                                <div className="bg-white shadow-md rounded-lg p-5">
                                    <div className="grid grid-cols-7 gap-x-5 font-semibold mb-3 text-gray-600">
                                        <div>Name</div>
                                        <div>Age</div>
                                        <div>Gender</div>
                                        <div>Type</div>
                                        <div>Booking Status</div>
                                        <div>Current Status</div>
                                        <div>Seat No</div>
                                    </div>
                                    <ul>
                                        {pnrData?.passengerDetails[0].map((passenger, idx) => (
                                            <li key={idx} className="grid grid-cols-7 gap-x-5 py-2 border-b border-gray-200">
                                                <div className="text-gray-700">{passenger.name}</div>
                                                <div className="text-gray-700">{passenger.age}</div>
                                                <div className="text-gray-700">{passenger.gender}</div>
                                                <div className="text-gray-700">{passenger.passengerType}</div>
                                                <div className="text-gray-700">{passenger.bookingStatus}</div>
                                                <div className={`text-center font-medium ${passenger.currentStatus === "Confirm" ? 'text-green-500' : 'text-red-600'}`}>
                                                    {passenger.currentStatus}
                                                </div>
                                                <div className='text-gray-700'>{passenger?.seatNo ? passenger.seatNo : '-'}</div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                        <div className='w-full flex flex-col items-center mt-10 mb-10'>
                            <h1 className='text-2xl font-medium text-orange-500'>Fare Details</h1>
                            <h1 className='text-xl text-gray-700'>Fare charges: {pnrData?.totalFare || ""}  Rs.</h1>
                            <p className="text-sm text-gray-600 mt-2">
                                <span>For cancellation and refund policy, please visit </span>
                                <a href="https://www.irctc.co.in/nget/train-cancel" className='text-orange-500'>IRCTC Cancellation & Refund Policy</a>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center h-screen'>
                        <h1 className='text-3xl font-medium text-gray-600'>No PNR data found</h1>
                        <p className='text-lg text-gray-600 mt-4'>Please enter a valid 10 digit PNR number to check status.</p>
                    </div>
                ))
            )}
        </div>
    );
}
