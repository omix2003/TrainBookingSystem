import React, { useEffect, useState, useCallback, useId } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import useDebounce from '../../customHooks/deBounceHook';
import DisplayBooking from './DisplayBooking.jsx';
import DeleteModal from "../Admin/DeleteModal.jsx"
import LoaderComponent from '../LoaderComponent.jsx';

export default function BookingHistory() {

    const [bookingHistory, setBookingHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedBooking, setSelectedBooking] = useState(null)
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

    const fetchBookingDetails = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/v1/book-ticket/get-booking-by-user', {
                method: 'GET'
            })

            const result = await response.json()
            // console.log(result);

            if (!result.success) {
                notify(result.message, 'error')
                return;
            }

            if (result.data.length === 0) {
                notify("You have not made any bookings yet.", 'success')
                return;
            }

            setBookingHistory(result.data.reverse())
            notify(result.message, 'success')


        } catch (error) {
            notify("Server error. Please try agin later", 'error')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const debounceFetchBookingDetails = useDebounce(fetchBookingDetails, 500)

    useEffect(() => {
        debounceFetchBookingDetails()
    }, [])

    const compareDates = (date, departureTime) => {
        const todayDate = new Date();
        const someDate = new Date(date);

        if (someDate.getFullYear() > todayDate.getFullYear()) return true;
        if (someDate.getFullYear() < todayDate.getFullYear()) return false;

        if (someDate.getMonth() > todayDate.getMonth()) return true;
        if (someDate.getMonth() < todayDate.getMonth()) return false;

        if (someDate.getDate() > todayDate.getDate()) return true;
        if (someDate.getDate() < todayDate.getDate()) return false;

        if (departureTime.substring(0, 2) > todayDate.getHours()) return true;
        if (departureTime.substring(0, 2) < todayDate.getHours()) return false;

        if (departureTime.substring(2, 5) > todayDate.getMinutes()) return true;
        if (departureTime.substring(2, 5) < todayDate.getMinutes()) return false;

        return false;
    }

    const handleCancel = (booking) => {
        setSelectedBooking(booking)
    }

    const cancelBooking = async () => {
        try {
            const response = await fetch(`/api/v1/book-ticket/cancel-booking/c/${selectedBooking?.pnrNo}`, {
                method: 'POST'
            })

            const result = await response.json()
            // console.log(result);

            if (!result.success) {
                notify(result.message, 'error')
                return
            }

            notify(result.message, 'success')
        } catch (error) {
            notify("Server error. Please try again later" + error)
        } finally {
            setSelectedBooking(null)
            debounceFetchBookingDetails()
        }
    }

    const debounceCancelBooking = useDebounce(cancelBooking, 500)

    if (selectedBooking) {
        return (
            <DeleteModal
                deleteLabel={`Are you sure you want to cancel booking on ${new Date(selectedBooking.dateOfJourney).toLocaleDateString()} from ${selectedBooking.source} to ${selectedBooking.destination}?`}
                onConfirm={debounceCancelBooking}
                onCancel={() => setSelectedBooking(null)}
                buttonLabel={'Confirm'}
            />
        )
    }

    return (
        <div className='w-full flex justify-center items-center'>
            <ToastContainer />
            {loading ? (
                <LoaderComponent label={"Loading booking details..."} />
            ) : (
                bookingHistory.length > 0 ? (
                    <div className="w-full bg-gray-300 rounded-lg shadow-lg p-8 space-y-6">
                        <h2 className="text-2xl font-bold text-orange-600">Booking Details</h2>
                        {bookingHistory.map((booking) => (
                            <DisplayBooking
                                key={booking._id}
                                booking={booking}
                                onCancelClick={handleCancel}
                                compareDates={compareDates}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-screen">
                        <div className="flex items-center justify-center">
                            <span className="text-gray-800 font-semibold text-2xl">No Booking History Available</span>
                        </div>
                    </div>
                )
            )}
        </div>
    )
}
