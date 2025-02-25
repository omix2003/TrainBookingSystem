import React from 'react';
import { Header, AdminOptionBar } from '../../Components/index.js'; 
import { Outlet } from 'react-router-dom';

const AdminDashboard = () => {

    return (
        <div className='w-full h-screen flex flex-col'>
            <Header />
            <div className='w-full h-screen p-0 m-0'>
                <AdminOptionBar />
                <Outlet />
            </div>
        </div>
    );
};

export default AdminDashboard;
