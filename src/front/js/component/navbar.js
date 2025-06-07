import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../store/appContext";

export const Navbar = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(false);

    const isLoggedIn = () => {
        return localStorage.getItem("token") !== null;
    };

    const handleLogout = () => {
        actions.logout(); 
        setShowToast(true);
    };

    useEffect(() => {
        if (showToast) {
            const timer = setTimeout(() => {
                setShowToast(false);
                navigate("/login");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [showToast, navigate]);

    return (
        <>
            <nav className="navbar navbar-light bg-light">
                <div className="container">
                    <Link to="/">
                        <button className="btn btn-primary me-2">Inicio</button>
                    </Link>

                    <div className="ml-auto">
                        {!isLoggedIn() ? (
                            <>
                                <Link to="/signup">
                                    <button className="btn btn-primary me-2">Registro</button>
                                </Link>
                                <Link to="/login">
                                    <button className="btn btn-success">Iniciar Sesión</button>
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link to="/dashboard">
                                    <button className="btn btn-info me-2">Dashboard</button>
                                </Link>
                                <button className="btn btn-danger" onClick={handleLogout}>
                                    Cerrar Sesión
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </nav>

            {showToast && (
                <div
                    style={{
                        position: "fixed",
                        top: "20px",
                        right: "20px",
                        backgroundColor: "#fff",
                        color: "#000",
                        padding: "16px 24px",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        zIndex: 9999,
                        minWidth: "250px",
                    }}
                >
                    <div className="d-flex justify-content-between align-items-center">
                        <span>Sesión cerrada correctamente.</span>
                        <button
                            className="btn-close"
                            style={{ marginLeft: "16px" }}
                            onClick={() => setShowToast(false)}
                        ></button>
                    </div>
                </div>
            )}
        </>
    );
};
