import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faHistory, faEdit, faKey, faHome, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function Profile() {

    const username = useSelector((state) => state.auth?.userData?.user?.username)
    const [shrinked, setShrinked] = useState(false)

    const options = [
        {
            name: "Profile Overview",
            slug: '/profile/profile-overview',
            icon: faUser
        },
        {
            name: "Booking History",
            slug: '/profile/booking-history',
            icon: faHistory
        },
        {
            name: "Edit Profile",
            slug: '/profile/edit-profile',
            icon: faEdit
        },
        {
            name: "Change Password",
            slug: '/profile/change-password',
            icon: faKey
        },
        {
            name: "Home",
            slug: '/',
            icon: faHome
        }
    ]

    return (
        <div className="flex w-screen h-screen overflow-x-hidden transition-all duration-300">
            <div className={`${shrinked ? 'w-1/12' : 'w-1/4'} bg-orange-100 shadow-lg h-screen p-6 overflow-y-hidden transition-all duration-300`}>
                <div className='w-full flex justify-between items-center gap-x-4'>
                    <div className={`flex ${shrinked ? 'flex-col items-start' : 'flex-row pl-4 gap-x-4 items-center'} mb-6`}>
                        <FontAwesomeIcon icon={faUser} size='2x' style={{ color: "#f57c19" }} />
                        {!shrinked && (
                            <div className="ml-4">
                                <p className="font-semibold text-2xl text-orange-800">{username ? username : '-'}</p>
                            </div>
                        )}
                        {/* {shrinked && (
                            <div className="">
                                <p className="font-semibold text-xl text-orange-800">{username ? username : '-'}</p>
                            </div>
                        )} */}
                    </div>
                    <button
                        type='button'
                        onClick={() => setShrinked((prev) => (!prev))}
                        className='mb-6'
                    >
                        <FontAwesomeIcon icon={shrinked ? faChevronRight : faChevronLeft} size='2x' style={{ color: "#f57c19" }} />
                    </button>
                </div>
                <ul className="space-y-6 mt-20">
                    {options.map((option, idx) => (
                        <li key={idx} className='transition-all duration-300'>
                            <Link
                                to={option.slug}
                                className="flex items-center py-3 px-5 rounded-md text-gray-800 bg-white shadow-md hover:bg-orange-200 hover:text-orange-700 transition-colors duration-300 ease-in-out font-medium text-lg"
                            >
                                <FontAwesomeIcon icon={option.icon} className="mr-4" />
                                {!shrinked && option.name}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={`${shrinked ? 'w-11/12' : 'w-3/4'} p-6 bg-white overflow-y-auto transition-all duration-300`}>
                <Outlet />
            </div>
        </div>
    );
};
