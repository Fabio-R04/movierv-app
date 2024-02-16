import { Outlet, Navigate } from "react-router-dom"
import { useAppSelector } from "../app/hooks"

function PrivateRoutesAuth() {
    const { user } = useAppSelector((state) => state.auth);

    if (user) {
        return <Navigate to="/" />
    }

    return <Outlet />
}

export default PrivateRoutesAuth