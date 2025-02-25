import React, { useEffect, useState, useCallback, useId } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import useDebounce from '../../customHooks/deBounceHook';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import LoaderComponent from '../LoaderComponent';


export default function EditProfile() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNo, setMobileNo] = useState("")
    const [loading, setLoading] = useState(true)

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
        setLoading(true)
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

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        switch (id) {
            case 'name':
                setName(value);
                break;
            case 'username':
                setUsername(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'mNo':
                setMobileNo(value);
                break;
            default:
                break;
        }
    };

    const updateUserData = async () => {
        try {
            const data = { name, email, username, mobileNo };

            Object.values(data).forEach((value) => {
                if (!value || value?.length === 0) {
                    notify("All fields are required", 'error')
                }
            });

            const response = await fetch('/api/v1/users/update-details', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error("Network Error !!");
            }

            const updatedData = await response.json();
            // console.log(updatedData);
            if (!updatedData?.success) {
                notify(updatedData.message, 'error')
            } else {
                notify(updatedData.message, 'success')
                setEmail(updatedData?.data?.email);
                setMobileNo(updatedData?.data?.mobileNo);
                setName(updatedData?.data?.name);
                setUsername(updatedData?.data?.username);
            }

        } catch (error) {
            notify("Serever error. Please try again later", 'error')
            console.error("Error while updating details: ", error);
        }
    }

    const debouncedUpdateData = useDebounce(updateUserData, 1000)

    const handleForm = async (e) => {
        e.preventDefault();

        debouncedUpdateData()
    };

    return (
        <div className="flex flex-col items-center mt-16">
            <ToastContainer />

            {loading ? (
                <LoaderComponent label={"Loading profile data..."} />
            ) : (
                <div className="w-full h-full bg-gray-200 rounded-md flex flex-col items-center justify-center px-8 py-12">
                    <p className="text-orange-600 font-bold text-4xl mb-6">
                        Welcome, {username}!
                    </p>
                    <form
                        onSubmit={handleForm}
                        className="w-9/12 max-w-4xl bg-white rounded-lg shadow-lg p-8 space-y-6"
                    >
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
                                    onChange={handleInputChange}
                                    className="w-full p-2 border-b-2 border-orange-500 outline-none bg-white text-gray-800 focus:border-orange-700 transition duration-300 ease-in-out"
                                />
                            </div>
                            <div className="flex-1 flex flex-col items-start">
                                <label htmlFor="username" className="text-orange-600 font-semibold flex items-center space-x-2">
                                    <FontAwesomeIcon icon={faUser} className="text-orange-600" />
                                    <span>Username</span>
                                </label>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={handleInputChange}
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
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border-b-2 border-orange-500 outline-none bg-white text-gray-800 focus:border-orange-700 transition duration-300 ease-in-out"
                                />
                            </div>
                            <div className="flex-1 flex flex-col items-start">
                                <label htmlFor="mNo" className="text-orange-600 font-semibold flex items-center space-x-2">
                                    <FontAwesomeIcon icon={faPhone} className="text-orange-600" />
                                    <span>Mobile No.</span>
                                </label>
                                <input
                                    type="text"
                                    id="mNo"
                                    value={mobileNo}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border-b-2 border-orange-500 outline-none bg-white text-gray-800 focus:border-orange-700 transition duration-300 ease-in-out"
                                />
                            </div>
                        </div>
                        <button
                            id="updateBtn"
                            type="submit"
                            className="w-full h-12 bg-orange-500 text-white font-semibold text-xl rounded-lg hover:bg-orange-600 transition duration-300 ease-in-out"
                        >
                            Update Details
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
