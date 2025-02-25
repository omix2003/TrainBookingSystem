import React, { act, useState } from 'react'
import { BookTicket, PNRStatus, RunningStatus, SearchTrain } from './index.js'

export default function Optionbar() {
    const options = [
        { name: 'Book Ticket' },
        { name: 'Check PNR Status' },
        { name: 'Running Status' },
        { name: 'Search Train' }
    ]

    const [activeOption, setActiveOption] = useState(localStorage.getItem('activeOption') || null);

    const handleClick = (selectedOption) => {
        const newActiveOption = activeOption === selectedOption ? null : selectedOption;
        setActiveOption(newActiveOption);
        localStorage.setItem('activeOption', newActiveOption);
    }

    return (
        <div>
            <ul className='w-full h-18 relative top-44 flex flex-row items-center justify-around bg-white shadow-md'>
                {options.map((option) => (
                    <li key={option.name} className='text-2xl'>
                        <button
                            onClick={() => handleClick(option.name)}
                            className={`px-4 py-2 font-semibold transition-all duration-200 ease-in-out 
                            ${activeOption === option.name
                                    ? 'bg-orange-500 text-white rounded-t-md shadow-lg'
                                    : 'bg-transparent text-orange-500 hover:bg-orange-100 rounded-md'} 
                            focus:outline-none`}
                        >
                            {option.name}
                        </button>
                    </li>
                ))}
            </ul>
            <div className='w-full'>
                {activeOption === 'Book Ticket' && (< BookTicket />)}
                {activeOption === 'Check PNR Status' && (< PNRStatus />)}
                {activeOption === 'Running Status' && (< RunningStatus />)}
                {activeOption === 'Search Train' && (< SearchTrain />)}
            </div>
        </div>
    )
}
