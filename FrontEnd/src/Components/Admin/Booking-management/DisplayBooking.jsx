import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faTrain, faCalendarAlt, faMapMarkerAlt, faTimesCircle, faCheckCircle, faUser, faTicketAlt, faMoneyBillWave } from '@fortawesome/free-solid-svg-icons';


export default function DisplayBooking({ booking, onBtnClick, expandedBooking }) {
    return (
        <div className='w-full py-6 px-6 sm:px-12 bg-white rounded-lg shadow-lg'>
            <div className='w-full mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center'>
                <div className='text-lg text-gray-700 mb-4 sm:mb-0'>
                    <FontAwesomeIcon icon={faIdCard} className='mr-2 text-orange-600' />
                    Booking ID: <span className='text-orange-600 font-semibold'>{booking._id}</span>
                </div>
                <div className='text-lg text-gray-700'>
                    <FontAwesomeIcon icon={faTrain} className='mr-2 text-orange-600' />
                    {booking?.trainDetails?.trainNo} - {booking?.trainDetails?.trainName}
                </div>
            </div>
            <div className='w-full mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0'>
                <div className='text-lg text-gray-700'>
                    <FontAwesomeIcon icon={faTicketAlt} className='mr-2 text-orange-600' />
                    PNR: <span className='text-orange-600 font-semibold'>{booking.pnrNo}</span>
                </div>
                <div className='text-lg text-gray-700'>
                    <FontAwesomeIcon icon={faCalendarAlt} className='mr-2 text-orange-600' />
                    Date of Journey: <span className='text-orange-600 font-semibold'>{new Date(booking.dateOfJourney).toLocaleDateString()}</span>
                </div>
                <div className='text-lg text-gray-700'>
                    <FontAwesomeIcon icon={faMapMarkerAlt} className='mr-2 text-orange-600' />
                    {booking.source} - {booking.destination}
                </div>
                <div className='text-lg text-gray-700'>
                    <FontAwesomeIcon icon={booking.isCancelled ? faTimesCircle : faCheckCircle} className={`mr-2 ${booking.isCancelled ? 'text-red-600' : 'text-green-600'}`} />
                    Status: <span className={`${booking.isCancelled ? 'text-red-600' : 'text-green-600'} font-semibold`}>{booking.isCancelled ? 'Cancelled' : 'Confirmed'}</span>
                </div>
            </div>
            <div className='w-full mb-6'>
                <button
                    className='text-orange-600 hover:underline text-lg font-semibold'
                    onClick={() => onBtnClick(booking._id)}
                >
                    {expandedBooking === booking._id ? 'Hide Details' : 'View More Details'}
                </button>
            </div>

            {expandedBooking === booking._id && (
                <div className='mt-6 p-6 bg-gray-50 rounded-lg'>
                    <table className='min-w-full text-left text-lg text-gray-800'>
                        <tbody>
                            <tr className='border-b'>
                                <th className='px-6 py-3 font-semibold text-orange-600'>Booked by</th>
                                <td className='px-6 py-3'>
                                    <div className='flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-8'>
                                        <span className='text-gray-800'><strong>Username:</strong> {booking.userDetails.username}</span>
                                        <span className='text-gray-800'><strong>Email:</strong> {booking.userDetails.email}</span>
                                        <span className='text-gray-800'><strong>Contact No:</strong> {booking.userDetails.mobileNo}</span>
                                    </div>
                                </td>
                            </tr>
                            <tr className='border-b'>
                                <th className='px-6 py-3 font-semibold text-orange-600'>Passenger Details</th>
                                <td className='px-6 py-3'>
                                    <table className='w-full border-collapse'>
                                        <thead>
                                            <tr>
                                                <th className='px-2 sm:px-4 py-2 text-center'>Name</th>
                                                <th className='px-2 sm:px-4 py-2 text-center'>Age</th>
                                                <th className='px-2 sm:px-4 py-2 text-center'>Gender</th>
                                                <th className='px-2 sm:px-4 py-2 text-center'>Current Status</th>
                                                <th className='px-2 sm:px-4 py-2 text-center'>Seat No</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {booking.passengerDetails.passengerDetails.map((passenger, index) => (
                                                <tr key={index} className='border-t'>
                                                    <td className='px-2 sm:px-4 py-2 text-center'>{passenger.name}</td>
                                                    <td className='px-2 sm:px-4 py-2 text-center'>{passenger.age}</td>
                                                    <td className='px-2 sm:px-4 py-2 text-center'>{passenger.gender}</td>
                                                    <td className='px-2 sm:px-4 py-2 text-center'>{passenger.currentStatus}</td>
                                                    <td className='px-2 sm:px-4 py-2 text-center'>{passenger.seatNo ? passenger.seatNo : '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                            <tr className='border-b'>
                                <th className='px-6 py-3 font-semibold text-orange-600'>Class</th>
                                <td className='px-6 py-3'>{booking.passengerDetails.className}</td>
                            </tr>
                            <tr className='border-b'>
                                <th className='px-6 py-3 font-semibold text-orange-600'>Total Fare</th>
                                <td className='px-6 py-3'>{booking.totalFare} Rs.</td>
                            </tr>
                            <tr className='border-b'>
                                <th className='px-6 py-3 font-semibold text-orange-600'>Payment ID</th>
                                <td className='px-6 py-3'>{booking?.paymentDetails?.paymentId || '-'}</td>
                            </tr>
                            <tr className='border-b'>
                                <th className='px-6 py-3 font-semibold text-orange-600'>Payment Method</th>
                                <td className='px-6 py-3'>{booking?.paymentDetails?.paymentMethod.toUpperCase() || '-'}</td>
                            </tr>
                            <tr className='border-b'>
                                <th className='px-6 py-3 font-semibold text-orange-600'>Payment Status</th>
                                <td className='px-6 py-3'>{booking?.paymentDetails?.status.toUpperCase() || '-'}</td>
                            </tr>
                            <tr className='border-b'>
                                <th className='px-6 py-3 font-semibold text-orange-600'>Booking Date</th>
                                <td className='px-6 py-3'>{new Date(booking.createdAt).toLocaleString()}</td>
                            </tr>
                            <tr className='border-b'>
                                <th className='px-6 py-3 font-semibold text-orange-600'>Train Route</th>
                                <td className='px-4 py-3'>
                                    <div className='flex flex-wrap space-x-4'>
                                        {booking.trainDetails?.route?.map((station, index) => (
                                            <div key={index} className='text-center mb-2'>
                                                <div>{station.stationName}</div>
                                                <div className='text-sm text-gray-600'>{station.arrivalTime} - {station.departureTime}</div>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
