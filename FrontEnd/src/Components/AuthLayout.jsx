import { isDraft } from '@reduxjs/toolkit'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Protected({ children, authentication = true }) {

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector((state) => state.auth.status)
    const isAdmin = useSelector((state) => state.auth.isAdmin)

    useEffect(() => {
        if (authentication) {
            // If the route is protected and the user is not authenticated, navigate to login
            if (!authStatus) {
                isAdmin ? navigate("/")  : navigate("/login")
            }
        } else {
            // If the route is public
            if (authStatus) {
                // If admin, navigate to admin dashboard else  navigate to home
                isAdmin ? navigate("/admin-dashboard/admin-panel") : navigate("/")
            }
        }
        setLoader(false)
    }, [authStatus, authentication, navigate, isAdmin])

    return loader ? <h1>Loading...</h1> : <>{children}</>
}
