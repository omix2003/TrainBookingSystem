# Yatra.com Travel Booking System (MERN Stack)

A comprehensive travel booking system inspired by Yatra.com, developed using the MERN stack (MongoDB, Express, React, Node.js). It provides an integrated platform for users and administrators to manage train ticket bookings efficiently.

## Features

- **User Authentication**: Secure login system with profile management.
- **Train Ticket Booking**: Search, book, and manage train tickets, check PNR status, and view live train status.
- **Booking Management**: Update or delete bookings from the user dashboard.
- **Payment Gateway Integration**: Secure payment processing for ticket purchases.
- **Admin Dashboard**: Tools for administrators to manage train schedules, details, and stations.
- **Real-Time Data Updates**: Ensures that the latest information is available.

## Technology Stack

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Payment Integration**: Razorpay

## Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    cd yatra-travel-booking-system
    ```

2. Install server-side dependencies:
    ```bash
    cd server
    npm install
    ```

3. Install client-side dependencies:
    ```bash
    cd ../client
    npm install
    ```

4. Configure environment variables:
   - Create a `.env` file in the root directories of both `server` and `client`.
   - Add necessary environment variables (e.g., database URI, payment gateway keys).

5. Run the development server:
    ```bash
    npm run dev
    ```

## How to Use the System

### For Users:
- **Register or Log In**: Create an account or log in to access the platform.
- **Book Tickets**: Search for trains and book tickets for your journey.
- **Check PNR Status**: View the status of your booked tickets.
- **Train Information**: Get detailed information on trains and schedules.
- **Profile Management**: Check and modify your profile information.
- **Booking History**: View your past bookings and booking details.
- **Cancel Booking**: If needed, you can cancel your ticket directly from the user dashboard.

### For Admins:
- **Manage Trains**: Add, delete, or update train details in the system.
- **Schedule Management**: Create, modify, or remove train schedules.
- **Station Management**: Add or delete station details.
- **Admin Access**: Add new administrators or remove existing ones.


## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

<!-- ## License

This project is licensed under the MIT License. -->

## Contact

For any questions or suggestions, please contact Kalp Patel at kalppatel2024@gmail.com.
