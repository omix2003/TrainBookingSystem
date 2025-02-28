import React from 'react';
import { Header, Optionbar } from '../Components/index.js';
import AboutUs from '../Components/AboutUs.jsx';
import backgroundImage from "../assets/photos/background1.jpg"; // ✅ Ensure correct file extension

export default function Home() {
    return (
        <>
            <div className='w-full h-screen flex flex-col'>
                <Header />
                {/* ✅ Correct way to use background image */}
                <div
                    className="w-full h-screen bg-cover bg-opacity-50 bg-no-repeat p-0 m-0"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                >
                    <Optionbar />
                </div>
                <AboutUs />
            </div>
        </>
    );
}
