import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser, logoutAdmin } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


export default function LogoutBtn() {
    const isAdmin = useSelector((state) => state.auth.isAdmin);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isTokenExpired = () => {
        try {
            const token = localStorage.getItem('accessToken');
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decodedToken.exp < currentTime;
        } catch (error) {
            console.error('Error decoding token:', error);
            return true;
        }
    };

    const logOutHandler = async () => {
        // if (isTokenExpired()) {
        //     console.log("Token expired");
        //     if (!isAdmin) {
        //         dispatch(logoutUser());
        //     } else {
        //         dispatch(logoutAdmin());
        //     }
        //     navigate('/');
        // } else {
        try {
            if (!isAdmin) {
                const response = await fetch('/api/v1/users/logout', {
                    method: 'POST',
                });
                const result = await response.json();
                // console.log(result);
                if (result.success) {
                    dispatch(logoutUser());
                    navigate('/');
                }
            } else {
                const response = await fetch('/api/v1/admin/logout', {
                    method: 'POST',
                });
                const result = await response.json();
                // console.log(result);
                if (result.success) {
                    dispatch(logoutAdmin());
                    navigate('/');
                }
            }
        } catch (error) {
            console.error('Logout request error:', error);
        }
        // }
    };

    return (
        <div>
            <button
                type='button'
                onClick={logOutHandler}
                className="px-4 py-2 text-white bg-orange-500 text-xl font-medium duration-200 hover:text-white hover:scale-110 transition-all rounded-md"
            >
                Logout
            </button>
        </div>
    );
}
