import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Provider } from 'react-redux';
import store from './store/store.js';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import {
  Login,
  SignUp,
  AuthLayout,
  AdminLogin,
  AddAdmin,
  DeleteAdmin,
  ViewAdmin,
  ViewBooking,
  AddSchedule,
  DeleteSchedule,
  ViewSchedule,
  EditSchedule,
  AddStation,
  DeleteStation,
  ViewStations,
  EditStation,
  AddTrain,
  DeleteTrains,
  ViewTrains,
  EditTrains,
  BookingHistory,
  ChangePassword,
  EditProfile,
  ViewProfile,
  Profile
} from "./Components/index.js";
import {
  AdminDashboard,
  AdminInfo,
  BookTicketPage,
  Home,
  PassengerDetails,
  PaymentPage,
  PNRStatusPage,
  PrintTicket,
  SearchTrainPage
} from "./Pages/index.js"


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: (
          <AuthLayout authentication={false}>
            <Login />
          </AuthLayout>
        )
      },
      {
        path: "/register",
        element: (
          <AuthLayout authentication={false}>
            <SignUp />
          </AuthLayout>
        )
      },
      {
        path: "/admin",
        element: (
          <AuthLayout authentication={false}>
            <AdminLogin />
          </AuthLayout>
        )
      },
      {
        path: "/admin-dashboard",
        element: (
          <AuthLayout >
            <AdminDashboard />
          </AuthLayout>
        ),
        children: [
          {
            path: "admin-panel",
            element: (
              <AuthLayout>
                <AdminInfo />
              </AuthLayout>
            )
          },
          {
            path: "train-management/add-train",
            element: (
              <AuthLayout>
                <AddTrain />
              </AuthLayout>
            )
          },
          {
            path: "train-management/edit-train",
            element: (
              <AuthLayout>
                <EditTrains />
              </AuthLayout>
            )
          },
          {
            path: "train-management/remove-train",
            element: (
              <AuthLayout>
                <DeleteTrains />
              </AuthLayout>
            )
          },
          {
            path: "train-management/view-trains",
            element: (
              <AuthLayout>
                <ViewTrains />
              </AuthLayout>
            )
          },
          {
            path: "schedule-management/view-schedules",
            element: (
              <AuthLayout >
                <ViewSchedule />
              </AuthLayout>
            )
          },
          {
            path: "schedule-management/remove-schedule",
            element: (
              <AuthLayout>
                <DeleteSchedule />
              </AuthLayout>
            )
          },
          {
            path: "schedule-management/edit-schedule",
            element: (
              <AuthLayout>
                <EditSchedule />
              </AuthLayout>
            )
          },
          {
            path: "station-management/view-stations",
            element: (
              <AuthLayout>
                <ViewStations />
              </AuthLayout>
            )
          },
          {
            path: "station-management/remove-station",
            element: (
              <AuthLayout>
                <DeleteStation />
              </AuthLayout>
            )
          },
          {
            path: "station-management/edit-station",
            element: (
              <AuthLayout>
                <EditStation />
              </AuthLayout>
            )
          },
          {
            path: "station-management/add-station",
            element: (
              <AuthLayout>
                <AddStation />
              </AuthLayout>
            )
          },
          {
            path: "admin-management/view-admins",
            element: (
              <AuthLayout>
                <ViewAdmin />
              </AuthLayout>
            )
          },
          {
            path: "admin-management/add-admin",
            element: (
              <AuthLayout>
                <AddAdmin />
              </AuthLayout>
            )
          },
          {
            path: "admin-management/delete-admin",
            element: (
              <AuthLayout>
                <DeleteAdmin />
              </AuthLayout>
            )
          },
          {
            path: "booking-management/view-bookings",
            element: (
              <AuthLayout>
                <ViewBooking />
              </AuthLayout>
            )
          }
        ]
      },
      {
        path: "/book-ticket",
        element: <BookTicketPage />
      },
      {
        path: "/pnr-status",
        element: <PNRStatusPage />
      },
      {
        path: "/search-train",
        element: <SearchTrainPage />
      },
      {
        path: "/profile",
        element: (
          <AuthLayout>
            <Profile />
          </AuthLayout>
        ),
        children: [
          {
            path: "profile-overview",
            element: (
              <AuthLayout>
                <ViewProfile />
              </AuthLayout>
            )
          },
          {
            path: "edit-profile",
            element: (
              <AuthLayout>
                <EditProfile />
              </AuthLayout>
            )
          },
          {
            path: "change-password",
            element: (
              <AuthLayout>
                <ChangePassword />
              </AuthLayout>
            )
          },
          {
            path: "booking-history",
            element: (
              <AuthLayout>
                <BookingHistory />
              </AuthLayout>
            )
          }
        ]
      },
      {
        path: "/add-passenger-details",
        element: (
          <AuthLayout>
            <PassengerDetails />
          </AuthLayout>
        )
      },
      {
        path: "/payment",
        element: (
          <AuthLayout>
            <PaymentPage />
          </AuthLayout>
        )
      },
      {
        path: "/print-ticket",
        element: (
          <AuthLayout>
            <PrintTicket />
          </AuthLayout>
        )
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>,
);
