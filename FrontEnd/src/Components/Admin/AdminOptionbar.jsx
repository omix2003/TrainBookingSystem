import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminOptionBar = () => {
    const navigate = useNavigate();
    const options = [
        { name: 'Train Management', subOptions: ['Add Train', 'Edit Train', 'Remove Train', 'View Trains'] },
        { name: 'Schedule Management', subOptions: ['Add Schedule', 'Edit Schedule', 'Remove Schedule', 'View Schedules'] },
        { name: 'Station Management', subOptions: ['Add Station', 'Edit Station', 'Remove Station', 'View Stations'] },
        { name: 'Booking Management', subOptions: ['View Bookings', 'Cancel Booking'] },
        { name: 'Admin Management', subOptions: ['View Admins', 'Add Admin', 'Delete Admin'] },
    ];

    const handleSubOptionClick = (option, subOption) => {
        const optionPath = option.toLowerCase().replace(/ /g, '-');
        const subOptionPath = subOption.toLowerCase().replace(/ /g, '-');
        const fullPath = `/admin-dashboard/${optionPath}/${subOptionPath}`;
        navigate(fullPath);
    };


    return (
        <div className="bg-orange-500 text-white p-4 flex justify-around w-screen">
            {options.map((option, index) => (
                <div key={index} className="relative group">
                    <button className="text-lg h-full font-semibold">{option.name}</button>
                    <ul className="absolute left-0 z-10 hidden group-hover:block bg-white text-orange-600 mt-2 shadow-lg rounded-lg w-48 transition-opacity duration-300">
                        {option.subOptions.map((subOption, subIndex) => (
                            <li key={subIndex} className="hover:bg-orange-100 px-4 py-2 rounded">
                                <button
                                    className="w-full text-left"
                                    onClick={() => handleSubOptionClick(option.name, subOption)}
                                >
                                    {subOption}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default AdminOptionBar;
