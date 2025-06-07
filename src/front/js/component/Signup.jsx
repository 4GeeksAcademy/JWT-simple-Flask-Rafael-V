import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
    const { actions } = useContext(Context);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        last_name: "",
        email: "",
        password: "",
        direction: ""
    });
    const [error, setError] = useState(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.register(formData);
        if (success) {
            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                navigate("/login");
            }, 3000);
        } else {
            setError("No se pudo registrar. ¿Email ya en uso?");
        }
    };

    return (
        <div className="container mt-5 position-relative">
            <h2 className="text-center mb-4">Registro</h2>

            {showSuccess && (
                <div className="custom-tooltip">
                    Usuario registrado exitosamente
                </div>
            )}

            <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "500px" }}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                    <label>Nombre</label>
                    <input type="text" name="name" className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>Apellido</label>
                    <input type="text" name="last_name" className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>Ciudad</label>
                    <input type="text" name="direction" className="form-control" onChange={handleChange} />
                </div>
                <div className="mb-3">
                    <label>Email</label>
                    <input type="email" name="email" className="form-control" onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>Contraseña</label>
                    <input type="password" name="password" className="form-control" onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-primary w-100">Registrarse</button>
            </form>

            <style>{`
                .custom-tooltip {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background-color: #ffffff;
                    color: #333333;
                    padding: 12px 24px;
                    border-radius: 12px;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                    font-weight: 600;
                    font-size: 1rem;
                    opadirection: 0;
                    animation: fadeInOut 3s forwards;
                    z-index: 1050;
                    pointer-events: none;
                    user-select: none;
                }

                @keyframes fadeInOut {
                    0% {
                        opadirection: 0;
                        transform: translateY(-10px);
                    }
                    10%, 90% {
                        opadirection: 1;
                        transform: translateY(0);
                    }
                    100% {
                        opadirection: 0;
                        transform: translateY(-10px);
                    }
                }
            `}</style>
        </div>
    );
};
