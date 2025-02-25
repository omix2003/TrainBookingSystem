import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import useDebounce from '../customHooks/deBounceHook';

export default function PaymentPage() {
    const journeyData = JSON.parse(localStorage.getItem('journeyData'));
    const [paymentMethod, setPaymentMethod] = useState('');
    const navigate = useNavigate()

    const userData = useSelector((state) => state.auth.userData)

    const notify = (message, state) => {
        if (state === 'success')
            toast.success(message, {
                theme: 'colored'
            })
        else
            toast.error(message, {
                theme: 'colored'
            })
    }

    const generateUniquePNR = async () => {
        const res = await fetch('/api/v1/book-ticket/get-pnr', {
            method: 'GET'
        })
        const pnrList = await res.json()
        const existingPNRs = pnrList.data

        let pnr;
        do {
            const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
            const now = Date.now().toString().slice(-4)

            pnr = `${random}${now}`
        } while (existingPNRs.includes(pnr))

        return pnr;
    }

    const handlePaymentSuccess = async (response) => {
        const pnrNo = await generateUniquePNR()
        localStorage.setItem('pnrNo', JSON.stringify(pnrNo))

        const formData = {
            trainId: journeyData.train._id,
            dateOfJourney: journeyData.date,
            pnrNo,
            source: journeyData.source,
            destination: journeyData.destination,
            departureTime: journeyData.departureTime,
            arrivalTime: journeyData.arrivalTime,
            className: journeyData.type,
            passengers: journeyData.passengers,
            totalFare: journeyData.prices[journeyData.type] * journeyData.passengers.length,
            paymentMethod,
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            currency: 'INR'
        };

        const bookingResponse = await fetch('/api/v1/book-ticket/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const result = await bookingResponse.json();
        console.log(result);

        if (!result.success) {
            notify("An unexpected error occurred. Please try again later.", 'error')
            setTimeout(() => {
                navigate('/', { replace: true })
            }, 2000)
        }
        else {
            notify(result.message, 'success')
            setTimeout(() => {
                navigate('/print-ticket', { replace: true })
            }, 2000)
        }
    }

    const createOrder = async () => {
        try {

            const bookingData = {
                amount: journeyData.prices[journeyData.type] * journeyData.passengers.length,
                currency: 'INR'
            }

            const response = await fetch('/api/v1/payments/create-booking', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingData),
            });

            const orderData = await response.json();
            // console.log(orderData);

            if (!orderData.success)
                notify(orderData.message, 'error')

            return orderData.data;

        } catch (error) {
            console.error(error);
        }
    };

    const handlePayment = async () => {
        try {
            const order = await createOrder();

            const options = {
                key: 'rzp_test_wWZaLRITp28ltD',
                amount: order.amount / 100,
                currency: order.currency,
                name: 'Train Booking',
                description: 'Booking Payment',
                order_id: order.id,
                handler: handlePaymentSuccess,
                prefill: {
                    name: userData.name,
                    email: userData.email,
                    contact: userData.mobileNo,
                },
                notes: {
                    address: 'Razorpay Corporate Office',
                },
                theme: {
                    color: '#F37254',
                },
                method: {
                    upi: paymentMethod === 'upi',
                    card: paymentMethod === 'card',
                    netbanking: paymentMethod === 'netbanking'
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
        }
    };

    const debounceHandlePayment = useDebounce(handlePayment, 500)

    return (
        <div className="w-screen flex flex-col justify-center items-center py-8 bg-gray-50">
            <ToastContainer />
            <div className="w-full max-w-lg bg-white p-6 shadow-md rounded-md">
                <h2 className="text-2xl font-bold text-orange-600 mb-6 text-center">Select Payment Method</h2>
                <div className="space-y-4">
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="upi"
                            name="paymentMethod"
                            value="upi"
                            checked={paymentMethod === 'upi'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-orange-300"
                        />
                        <label htmlFor="upi" className="ml-3 text-lg font-medium text-orange-700">UPI</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="card"
                            name="paymentMethod"
                            value="card"
                            checked={paymentMethod === 'card'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-orange-300"
                        />
                        <label htmlFor="card" className="ml-3 text-lg font-medium text-orange-700">Credit/Debit Card</label>
                    </div>
                    <div className="flex items-center">
                        <input
                            type="radio"
                            id="netbanking"
                            name="paymentMethod"
                            value="netbanking"
                            checked={paymentMethod === 'netbanking'}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-orange-300"
                        />
                        <label htmlFor="netbanking" className="ml-3 text-lg font-medium text-orange-700">Net Banking</label>
                    </div>
                </div>
                <button
                    onClick={debounceHandlePayment}
                    className="mt-6 w-full bg-orange-500 text-white text-lg font-semibold py-2 rounded-md hover:bg-orange-600 transition-colors duration-300"
                >
                    Proceed to Pay Rs. {journeyData.prices[journeyData.type] * journeyData.passengers.length}
                </button>
            </div>
        </div>
    );
}
