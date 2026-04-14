import React from "react";
import { useSelector } from 'react-redux'
import { Navigate} from "react-router-dom";

const ProctedRoutes = ({ children , adminOnly = false }) => {
    // const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (user.role !== 'admin' && adminOnly) {
        return <Navigate to="/" />;
    }

    return children;

}

export default ProctedRoutes;
