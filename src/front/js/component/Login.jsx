
import React, { useState, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";

export const Login = () => {
    const { actions, store } = useContext(Context);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await actions.login(email, password);

        if (success) {
            navigate("/dashboard");
        } else {
            setError("Credenciales incorrectas o error en el servidor.");
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: "400px" }}>
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                    <label>Email</label>
                    <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label>Contraseña</label>
                    <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-success w-100">Entrar</button>
            </form>
        </div>
    );
};