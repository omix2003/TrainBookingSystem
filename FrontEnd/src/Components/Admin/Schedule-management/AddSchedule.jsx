import React, { useState } from "react";
// import axios from "axios";

const AddSchedule = () => {
    const [formData, setFormData] = useState({
        trainNumber: "",
        departureStation: "",
        arrivalStation: "",
        departureTime: "",
        arrivalTime: "",
        date: "",
    });

    const [message, setMessage] = useState("");

    // Handle input changes
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Submit form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); // Reset message

        try {
            const response = await axios.post("http://localhost:8800/api/schedules/add", formData);
            setMessage(response.data.message || "Schedule added successfully!");
            setFormData({ trainNumber: "", departureStation: "", arrivalStation: "", departureTime: "", arrivalTime: "", date: "" });
        } catch (error) {
            setMessage(error.response?.data?.message || "Error adding schedule.");
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Add Train Schedule</h2>
            {message && <p className="mb-4 text-center text-blue-600">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="trainNumber" value={formData.trainNumber} onChange={handleChange} placeholder="Train Number" required className="w-full p-2 border rounded" />
                <input type="text" name="departureStation" value={formData.departureStation} onChange={handleChange} placeholder="Departure Station" required className="w-full p-2 border rounded" />
                <input type="text" name="arrivalStation" value={formData.arrivalStation} onChange={handleChange} placeholder="Arrival Station" required className="w-full p-2 border rounded" />
                <input type="time" name="departureTime" value={formData.departureTime} onChange={handleChange} required className="w-full p-2 border rounded" />
                <input type="time" name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} required className="w-full p-2 border rounded" />
                <input type="date" name="date" value={formData.date} onChange={handleChange} required className="w-full p-2 border rounded" />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Add Schedule</button>
            </form>
        </div>
    );
};

export default AddSchedule;
