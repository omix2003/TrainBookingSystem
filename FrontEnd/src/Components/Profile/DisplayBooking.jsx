import React from 'react'
import TicketDocument from '../TicketDocument/TicketDocument.jsx';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay, faTrain, faMapMarkerAlt, faCreditCard, faTimesCircle, faCheckCircle, faClock, faTag } from '@fortawesome/free-solid-svg-icons';

export default function DisplayBooking({ booking, compareDates, onCancelClick }) {
    return (
        <div className='w-full bg-white shadow-md rounded-lg'>
            <div className="w-full flex flex-col md:flex-row gap-y-6 gap-x-12 justify-between p-6">
                <div className="w-full flex-1 flex flex-col">
                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faCalendarDay} className="text-orange-600 mr-2" />
                        <span className="text-gray-800 font-medium">Journey Date:</span>
                        <span className="ml-2 text-gray-600">{new Date(booking?.dateOfJourney).toLocaleDateString() || "N.A."}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faCalendarDay} className="text-orange-600 mr-2" />
                        <span className="text-gray-800 font-medium">Booking Date:</span>
                        <span className="ml-2 text-gray-600">{new Date(booking?.bookingDate).toLocaleDateString() || "N.A."}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faTrain} className="text-orange-600 mr-2" />
                        <span className="text-gray-800 font-medium text-nowrap">Train Name:</span>
                        <span className="ml-2 text-wrap text-gray-600">{booking?.trainName[0] || "N.A."}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faTrain} className="text-orange-600 mr-2" />
                        <span className="text-gray-800 font-medium text-nowrap">Train No:</span>
                        <span className="ml-2 text-wrap text-gray-600">{booking?.trainNo[0] || "N.A."}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-orange-600 mr-2" />
                        <span className="text-gray-800 font-medium">Source:</span>
                        <span className="ml-2 text-gray-600">{booking?.source || "N.A."}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faClock} className="text-orange-600 mr-2" />
                        <span className="text-gray-800 font-medium">Departure Time:</span>
                        <span className="ml-2 text-gray-600">{booking?.departureTime || "N.A."}</span>
                    </div>
                </div>
                <div className="w-full flex-1 flex flex-col">

                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faCreditCard} className="text-orange-600 mr-2" />
                        <span className="text-gray-800 font-medium">PNR Number:</span>
                        <span className="ml-2 text-gray-600">{booking?.pnrNo || "N.A."}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={booking?.isCancelled ? faTimesCircle : faCheckCircle} className={`text-${booking?.isCancelled ? 'red' : 'green'}-600 mr-2`} />
                        <span className="text-gray-800 font-medium">Status:</span>
                        <span className="ml-2 text-gray-600">{booking?.isCancelled ? 'Cancelled' : 'Confirm'}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faCreditCard} className="text-orange-600 mr-2" />
                        <span className="text-gray-800 font-medium">Total Fare:</span>
                        <span className="ml-2 text-gray-600">₹{booking?.totalFare?.toLocaleString() || "N.A."}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faCreditCard} className="text-orange-600 mr-2" />
                        <span className="text-gray-800 font-medium">Payment ID:</span>
                        <span className="ml-2 text-gray-600">{booking?.paymentId || "N.A."}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faMapMarkerAlt} className="text-orange-600 mr-2" />
                        <span className="text-gray-800 font-medium">Destination:</span>
                        <span className="ml-2 text-gray-600">{booking?.destination || "N.A."}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faClock} className="text-orange-600 mr-2" />
                        <span className="text-gray-800 font-medium">Arrival Time:</span>
                        <span className="ml-2 text-gray-600">{booking?.arrivalTime || "N.A."}</span>
                    </div>
                    <div className="flex items-center mb-4">
                        <FontAwesomeIcon icon={faTag} className="text-orange-600 mr-2" />
                        <span className="text-gray-800 font-medium">Class:</span>
                        <span className="ml-2 text-gray-600">{booking?.className[0] || "N.A."}</span>
                    </div>
                </div>
            </div>
            {compareDates(booking?.dateOfJourney, String(booking?.departureTime)) && !booking?.isCancelled &&
                <div className='w-full pb-4 pr-12 flex justify-end gap-x-6'>
                    <PDFDownloadLink
                        document={<TicketDocument bookingDetails={booking} pnrNo={booking.pnrNo} />}
                        fileName={`${booking.pnrNo}.pdf`}
                    >
                        {({ loading }) => (
                            <button type='button' className='bg-orange-500 hover:bg-orange-600 text-white text-xl rounded-md px-6 py-2 flex items-center'>
                                {loading ? 'Generating PDF...' : 'Print Ticket'}
                            </button>
                        )}
                    </PDFDownloadLink>
                    <button type='button' onClick={() => onCancelClick(booking)} className='bg-orange-500 text-xl text-white px-2.5 py-1.5 rounded-md hover:bg-orange-600'>Cancel Booking</button>
                </div>
            }
        </div>
    )
}
