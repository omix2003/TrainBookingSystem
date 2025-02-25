import React, { useEffect, useState } from 'react'
import useDebounce from '../../customHooks/deBounceHook'

export default function AdminInfo() {

    const [details, setDetails] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    const fetchDetails = async () => {
        const response = await fetch('/api/v1/admin/admin-panel-details', {
            method: 'GET'
        })

        const result = await response.json()

        if (!result.success)
            throw new Error("Error in fetching details: " + result.message)

        setDetails(result.data)
        setIsLoading(false)
    }

    function formatCurrency(amount) {
        if (amount)
            return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
    }

    const deBouncingfetchDetails = useDebounce(fetchDetails, 500)

    useEffect(() => {
        deBouncingfetchDetails()
    }, [])

    if (isLoading) {
        return (
            <div className="w-full flex justify-center items-center mt-40">
                <div className="w-6/12 flex justify-center items-center bg-orange-100 shadow-md rounded-md text-center py-8 text-2xl font-medium">
                    <div>Fetching Admin Dashboard Data...</div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100 p-8">
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h1 className="text-3xl font-bold text-orange-500 mb-6">Admin Dashboard</h1>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* <!-- No of Trains --> */}
                        <div className="bg-orange-100 rounded-lg p-4 shadow-md">
                            <h2 className="text-xl font-semibold text-orange-600">Total Trains</h2>
                            <p className="text-3xl font-bold text-orange-800">{details?.noOfTrains?.trains}</p>
                        </div>

                        {/* <!-- No of bookings --> */}
                        <div className="bg-orange-100 rounded-lg p-4 shadow-md">
                            <h2 className="text-xl font-semibold text-orange-600">Total Bookings For Today</h2>
                            <p className="text-3xl font-bold text-orange-800">{details?.noOfBookings[0]?.bookings || "-"}</p>
                        </div>

                        {/* <!-- Active Users --> */}
                        <div className="bg-orange-100 rounded-lg p-4 shadow-md">
                            <h2 className="text-xl font-semibold text-orange-600">Active Users</h2>
                            <p className="text-3xl font-bold text-orange-800">{details?.activeUser[0]?.activeUsers || "-"}</p>
                        </div>

                        {/* <!-- Monthly Revenue --> */}
                        <div className="bg-orange-100 rounded-lg p-4 shadow-md">
                            <h2 className="text-xl font-semibold text-orange-600">Daily Revenue</h2>
                            <p className="text-3xl font-bold text-orange-800">{formatCurrency(details?.dailyRevenue[0]?.dailyRevenue) || '-'}</p>
                        </div>

                        {/* <!-- Monthly Revenue --> */}
                        <div className="bg-orange-100 rounded-lg p-4 shadow-md">
                            <h2 className="text-xl font-semibold text-orange-600">Monthly Revenue</h2>
                            <p className="text-3xl font-bold text-orange-800">{formatCurrency(details?.monthlyRevenue[0]?.monthlyRevenue) || "-"}</p>
                        </div>

                        {/* <!-- Yearly Revenue --> */}
                        <div className="bg-orange-100 rounded-lg p-4 shadow-md">
                            <h2 className="text-xl font-semibold text-orange-600">Yearly Revenue</h2>
                            <p className="text-3xl font-bold text-orange-800">{formatCurrency(details?.yeralyRevenue[0]?.annualRevenue) || "-"}</p>
                        </div>

                        {/* new users in last 30 days */}
                        <div className="bg-orange-50 rounded-lg p-6 shadow-lg col-span-1 md:col-span-2 lg:col-span-3">
                            <h2 className="text-2xl font-semibold text-orange-600 mb-6">New Users in Last 30 Days</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white rounded-lg">
                                    <thead className="bg-orange-500 text-white">
                                        <tr>
                                            <th className="py-3 px-4 text-center">Username</th>
                                            <th className="py-3 px-4 text-center">Email</th>
                                            <th className="py-3 px-4 text-center">Joined Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {details?.newUsers.map((user, index) => (
                                            <tr key={user._id} className={`border-t ${index % 2 === 0 ? 'bg-orange-100' : 'bg-white'} hover:bg-orange-200 transition-colors`}>
                                                <td className="py-3 px-4">{user?.username || "-"}</td>
                                                <td className="py-3 px-4">{user?.email || "-"}</td>
                                                <td className="py-3 px-4">{new Date(user?.createdAt).toLocaleDateString() || "-"}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}
