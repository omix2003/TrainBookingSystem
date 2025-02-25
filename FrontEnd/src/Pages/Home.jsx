import React from 'react'
import { Header, Optionbar } from '../Components/index.js'
import AboutUs from '../Components/AboutUs.jsx'

export default function Home() {
    return (
        <>
            <div className='w-full h-screen flex flex-col'>
                <Header />
                <div className='w-full h-screen bg-[url("../../photos/background1.jpg")] bg-cover bg-opacity-50 bg-no-repeat p-0 m-0' >
                    <Optionbar />
                </div>
                <AboutUs />
            </div>
        </>
    )
}
