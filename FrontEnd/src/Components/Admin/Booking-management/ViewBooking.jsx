import React, { useEffect, useState, useCallback, useId } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import useDebounce from "../../../customHooks/deBounceHook.jsx"
import DisplayBooking from './DisplayBooking.jsx';
import SearchBar from '../SearchBar.jsx';
import LoaderComponent from '../../LoaderComponent.jsx';

export default function ViewBooking() {

    const [bookingData, setBookingData] = useState([])
    const [expandedBooking, setExpandedBooking] = useState(null);
    const [pnrNo, setPnrNo] = useState("")
    const [loading, setLoading] = useState(true)
    // console.log(bookingData);

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

    const fetchBookingData = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/v1/book-ticket/get-all-booking-details', {
                method: 'GET'
            })
            const result = await response.json()
            console.log(result);

            if (!result.success) {
                notify(result.message, 'error')
                return;
            }
            notify(result.message, 'success')
            setBookingData(result.data)

        } catch (error) {
            notify("Server error. Please try again later", 'error')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const debounceFetchBookingData = useDebounce(fetchBookingData, 500)

    useEffect(() => {
        debounceFetchBookingData()
    }, [])

    const handleToggleDetails = (bookingId) => {
        setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
    };

    const handleSearch = () => {
        if (!pnrNo) {
            notify("Enter PNR no to serach booking details", 'error')
            return
        }

        const foundBookingIdx = bookingData.findIndex((booking) => booking.pnrNo === pnrNo)
        if (foundBookingIdx === -1) {
            notify('Please enter a valid 10-digit PNR number', 'error');
            return
        }

        const updatedBookingDetails = [...bookingData]
        const foundBooking = updatedBookingDetails.splice(foundBookingIdx, 1)[0]

        updatedBookingDetails.unshift(foundBooking)
        setBookingData(updatedBookingDetails)
    }

    const handleChangePnrNo = (e) => {
        setPnrNo(e.target.value)
    }

    return (
        <div className='w-full flex flex-col'>
            <ToastContainer />
            <SearchBar
                inputValue={pnrNo}
                handleChangeValue={handleChangePnrNo}
                handleSearch={handleSearch}
                placeholder={"Enter PNR No"}
            />
            {loading ? (
                <LoaderComponent label={'Loading booking details...'} />
            ) : (
                <div className='w-full flex flex-col justify-center items-center gap-y-8 p-6 bg-gray-100'>
                    {bookingData.length > 0 && bookingData.map((booking) => (
                        <DisplayBooking
                            key={booking._id}
                            booking={booking}
                            onBtnClick={handleToggleDetails}
                            expandedBooking={expandedBooking}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
