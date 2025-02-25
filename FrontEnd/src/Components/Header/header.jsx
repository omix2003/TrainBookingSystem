import { Container } from "../index.js";
import React from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import LogoutBtn from "../LogoutBtn.jsx";

export default function Header() {
    const authStatus = useSelector((state) => state.auth.status);
    const isAdmin = useSelector((state) => state.auth.isAdmin)
    const navigate = useNavigate();

    const navItems = [
        {
            name: 'Home',
            slug: isAdmin ? '/admin-dashboard/admin-panel' : '/',
            active: true
        },
        {
            name: 'Login',
            slug: "/login",
            active: !authStatus 
        },
        {
            name: 'Sign Up',
            slug: "/register",
            active: !authStatus 
        },
        {
            name: 'Admin',
            slug: "/admin",
            active: !authStatus 
        }
    ];

    return (
        <header className="w-full bg-white shadow-md">
            <Container>
                <nav className="flex items-center justify-between px-6 py-3">
                    <div className="flex items-center">
                        {/* <Link to='/' className="bg-gray-300"> */}
                        <img src="../../../photos/Yatra.png" className="w-24 aspect-square mix-blend-multiply" alt="Main Logo" />
                        {/* </Link> */}
                    </div>
                    <div className="flex items-center">
                        <ul className="flex items-center gap-x-6">
                            {navItems.map((item) => (
                                item.active && (
                                    <li key={item.name}>
                                        <button onClick={() => navigate(item.slug)} className='px-4 py-2 text-orange-500 text-xl font-medium duration-200 hover:bg-orange-500 hover:text-white hover:scale-110 transition-all rounded-md'>
                                            {item.name}
                                        </button>
                                    </li>
                                )
                            ))}
                            {authStatus && !isAdmin && (
                                <li className="px-4 py-2 text-orange-500 text-xl font-medium duration-200 hover:bg-orange-500 hover:text-white hover:scale-110 transition-all rounded-md">
                                    <Link to={'/profile'} className=' text-orange-500 text-xl font-medium duration-200 hover:text-white hover:scale-110 transition-all rounded-md'>Profile</Link>
                                </li>
                            )}
                            {authStatus && (
                                <li>
                                    <LogoutBtn />
                                </li>
                            )}
                        </ul>
                    </div>
                </nav>
            </Container>
        </header>
    );
}
