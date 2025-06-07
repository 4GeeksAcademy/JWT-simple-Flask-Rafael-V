import React, { useContext, useEffect, useState } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Dashboard = () => {
    const { store, actions } = useContext(Context);
    const navigate = useNavigate();
    const [dashboardInfo, setDashboardInfo] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        const fetchDashboard = async () => {
            const data = await actions.getDashboardData();
            if (data) {
                setDashboardInfo(data);
            } else {
               
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/login");
            }
            setLoading(false);
        };

        fetchDashboard();
    }, [actions, navigate]);

    if (loading) {
        return <p className="text-center mt-5">Cargando dashboard...</p>;
    }

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4"> Dashboard</h1>
            
            <div className="card p-4 shadow mx-auto" style={{ maxWidth: "600px" }}>
                <h5 className="mb-3">Información del Usuario</h5>
                <p><strong>ID:</strong> {dashboardInfo.user_id}</p>
                <p><strong>Email:</strong> {dashboardInfo.user_email}</p>
                <p><strong>Mensaje:</strong> {dashboardInfo.message}</p>
            </div>
        </div>
    );
};
