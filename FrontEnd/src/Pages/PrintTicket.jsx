// PrintTicket.js
import React, { useEffect, useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faFilePdf, faCalendarDay, faTrain, faMapMarkerAlt, faDollarSign, faCreditCard, } from '@fortawesome/free-solid-svg-icons';
import TicketDocument from '../Components/TicketDocument/TicketDocument.jsx';
import { Link } from 'react-router-dom';
import useDebounce from '../customHooks/deBounceHook.jsx';

export default function PrintTicket() {
    const [pnrNo, setPnrNo] = useState(localStorage.getItem('pnrNo') ? JSON.parse(localStorage.getItem('pnrNo')) : "");
    const [bookingDetails, setBookingDetails] = useState({});
    const [loading, setLoading] = useState(false);

    const fetchBookingDetails = async (pnr) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/v1/book-ticket/booking-details/c/${pnr}`, {
                method: 'GET',
            });

            const result = await response.json();
            // console.log(result);

            if (!result.success) throw new Error(result.message);

            setBookingDetails(result.data);
        } catch (error) {
            console.error("Server error: " + error);
        } finally {
            setLoading(false);
        }
    };

    const debounceFetchBookingDetails = useDebounce(fetchBookingDetails, 500)

    useEffect(() => {
        if (pnrNo) {
            debounceFetchBookingDetails(pnrNo);
        }
    }, []);

    return (
        <div className='w-screen h-screen flex flex-col justify-center items-center bg-gray-50 p-6'>
            <div className='w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg'>
                <h1 className='text-3xl font-bold text-center text-orange-500 mb-6'>
                    Print Your Ticket
                </h1>
                {loading ? (
                    <div className='flex flex-col items-center'>
                        <div className='border-4 border-t-4 border-orange-500 border-solid rounded-full w-12 h-12 mb-4'></div>
                        <p className='text-xl font-semibold text-orange-500'>Generating PDF...</p>
                    </div>
                ) : (
                    <>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
                            <div className='flex items-center mb-2'>
                                <FontAwesomeIcon icon={faCalendarDay} className='text-orange-500 mr-2' />
                                <span className='text-orange-500 font-semibold'>PNR:</span>
                                <span className='text-black ml-2'>{pnrNo}</span>
                            </div>
                            <div className='flex items-center mb-2'>
                                <FontAwesomeIcon icon={faCalendarDay} className='text-orange-500 mr-2' />
                                <span className='text-orange-500 font-semibold'>Booking Date:</span>
                                <span className='text-black ml-2'>{new Date(bookingDetails?.bookingDate).toLocaleString() || "N/A"}</span>
                            </div>
                            <div className='flex items-center mb-2'>
                                <FontAwesomeIcon icon={faTrain} className='text-orange-500 mr-2' />
                                <span className='text-orange-500 font-semibold'>Train No./Name:</span>
                                <span className='text-black ml-2'>{bookingDetails?.trainNo || "N/A"} / {bookingDetails?.trainName || "N/A"}</span>
                            </div>
                            <div className='flex items-center mb-2'>
                                <FontAwesomeIcon icon={faCalendarDay} className='text-orange-500 mr-2' />
                                <span className='text-orange-500 font-semibold'>Date of Journey:</span>
                                <span className='text-black ml-2'>{new Date(bookingDetails?.dateOfJourney).toLocaleDateString() || "N/A"}</span>
                            </div>
                            <div className='flex items-center mb-2'>
                                <FontAwesomeIcon icon={faMapMarkerAlt} className='text-orange-500 mr-2' />
                                <span className='text-orange-500 font-semibold'>From:</span>
                                <span className='text-black ml-2'>{bookingDetails?.source || "N/A"}</span>
                            </div>
                            <div className='flex items-center mb-2'>
                                <FontAwesomeIcon icon={faMapMarkerAlt} className='text-orange-500 mr-2' />
                                <span className='text-orange-500 font-semibold'>To:</span>
                                <span className='text-black ml-2'>{bookingDetails?.destination || "N/A"}</span>
                            </div>
                            <div className='flex items-center mb-2'>
                                <FontAwesomeIcon icon={faDollarSign} className='text-orange-500 mr-2' />
                                <span className='text-orange-500 font-semibold'>Total Fare:</span>
                                <span className='text-black ml-2'>{bookingDetails?.totalFare || "N/A"} Rs.</span>
                            </div>
                            <div className='flex items-center mb-2'>
                                <FontAwesomeIcon icon={faCreditCard} className='text-orange-500 mr-2' />
                                <span className='text-orange-500 font-semibold'>Transaction ID:</span>
                                <span className='text-black ml-2'>{bookingDetails?.paymentId || "N/A"}</span>
                            </div>
                        </div>
                        <div className='flex justify-between items-center'>
                            <Link to='/' replace className='bg-orange-500 hover:bg-orange-600 text-white text-xl rounded-md px-6 py-2 flex items-center'>
                                <FontAwesomeIcon icon={faHome} className='mr-2' />
                                Home
                            </Link>
                            <PDFDownloadLink
                                document={<TicketDocument bookingDetails={bookingDetails} pnrNo={pnrNo} />}
                                fileName={`${pnrNo}.pdf`}
                            >
                                {({ loading }) => (
                                    <button type='button' className='bg-orange-500 hover:bg-orange-600 text-white text-xl rounded-md px-6 py-2 flex items-center'>
                                        <FontAwesomeIcon icon={faFilePdf} className='mr-2' />
                                        {loading ? 'Generating PDF...' : 'Print Ticket'}
                                    </button>
                                )}
                            </PDFDownloadLink>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
