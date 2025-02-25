import React from 'react'

export default function SearchBar({ handleChangeValue, handleSearch, inputValue, placeholder }) {
    return (
        <div className=' w-full flex justify-end pr-10 pt-5'>
            <input className='w-40 pl-2 outline-none border rounded-l-lg border-orange-500' value={inputValue} onChange={(e) => handleChangeValue(e)} placeholder={placeholder || 'Enter Train Number'} />
            <button type='button' className='bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-r-lg ' onClick={() => handleSearch()}>Search</button>
        </div>
    )
}
