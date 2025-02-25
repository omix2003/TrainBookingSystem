import React, { useEffect, useState, useCallback, useId } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import useDebounce from '../../customHooks/deBounceHook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import LoaderComponent from '../LoaderComponent';



export default function ViewProfile() {

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNo, setMobileNo] = useState("")
    const [loading, setLoading] = useState(true)
    // console.log("In edit section");

    const id = useId()

    const notify = useCallback((message, state) => {
        if (state === 'success')
            toast.success(message, {
                theme: 'colored',
                autoClose: 2000,
                toastId: id
            });
        else
            toast.error(message, {
                theme: 'colored',
                autoClose: 2000,
                toastId: id
            });
    }, []);

    const fetchUserDetails = async () => {
        try {
            const response = await fetch('/api/v1/users/get-user', {
                method: 'GET'
            });
            // if (!response.ok) throw new Error("Network Error !!!");

            const userData = await response.json();
            // console.log(userData);

            if (!userData?.success)
                notify(userData.message, 'error');
            else {
                notify("User data fetched successfully", 'success')
                setName(userData?.data?.name);
                setUsername(userData?.data?.username);
                setEmail(userData?.data?.email);
                setMobileNo(userData?.data?.mobileNo);
            }
        } catch (error) {
            notify("Server error. Please try again later", 'error')
            // console.error("Error while fetching user details: ", error);
        } finally {
            setLoading(false)
        }
    };

    const debouncedFetchuserDetails = useDebounce(fetchUserDetails, 500)

    useEffect(() => {
        debouncedFetchuserDetails()
    }, []);

    return (
        <div className="flex flex-col items-center mt-20">
            <ToastContainer />

            {loading ? (
                <LoaderComponent label={"Loading profile data..."} />
            ) : (
                <div className="w-full h-full bg-gray-200 flex flex-col items-center justify-center rounded-md px-8 py-12">
                    <p className="text-orange-600 font-bold text-4xl mb-6">
                        Welcome, {username}!
                    </p>
                    <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 space-y-6">
                        <div className="flex flex-col md:flex-row gap-8 mb-6">
                            <div className="flex-1 flex flex-col items-start">
                                <label htmlFor="name" className="text-orange-600 font-semibold flex items-center space-x-2">
                                    <FontAwesomeIcon icon={faUser} className="text-orange-600" />
                                    <span>Name</span>
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    readOnly
                                    className="w-full p-2 border-b-2 border-orange-500 outline-none bg-white text-gray-800 focus:border-orange-700 transition duration-300 ease-in-out"
                                />
                            </div>
                            <div className="flex-1 flex flex-col items-start">
                                <label htmlFor="username" className="text-orange-600 font-semibold flex items-center space-x-2">
                                    <FontAwesomeIcon icon={faUser} className="text-orange-600" />
                                    <span>Username</span>
                                </label>
                                <input
                                    readOnly
                                    type="text"
                                    id="username"
                                    value={username}
                                    className="w-full p-2 border-b-2 border-orange-500 outline-none bg-white text-gray-800 focus:border-orange-700 transition duration-300 ease-in-out"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row gap-8 mb-6">
                            <div className="flex-1 flex flex-col items-start">
                                <label htmlFor="email" className="text-orange-600 font-semibold flex items-center space-x-2">
                                    <FontAwesomeIcon icon={faEnvelope} className="text-orange-600" />
                                    <span>Email</span>
                                </label>
                                <input
                                    readOnly
                                    type="email"
                                    id="email"
                                    value={email}
                                    className="w-full p-2 border-b-2 border-orange-500 outline-none bg-white text-gray-800 focus:border-orange-700 transition duration-300 ease-in-out"
                                />
                            </div>
                            <div className="flex-1 flex flex-col items-start">
                                <label htmlFor="mNo" className="text-orange-600 font-semibold flex items-center space-x-2">
                                    <FontAwesomeIcon icon={faPhone} className="text-orange-600" />
                                    <span>Mobile No.</span>
                                </label>
                                <input
                                    readOnly
                                    type="text"
                                    id="mNo"
                                    value={mobileNo}
                                    className="w-full p-2 border-b-2 border-orange-500 outline-none bg-white text-gray-800 focus:border-orange-700 transition duration-300 ease-in-out"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
