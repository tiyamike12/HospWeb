import React, {useContext, useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LogoWhite from "../../assets/images/logos/laravel.png";
import "./Login.css";
import axios from "axios";
import Cookies from 'js-cookie';
import useAuth from "../../context/useAuth";

import {toast} from "react-toastify";

const BASE_URL = process.env.REACT_APP_API_URL;
const Login = () => {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState("");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    //const { setToken } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(e)
        setIsLoading(true)
        setDisable(true)
        try {
            const response = await axios.post(`${BASE_URL}/login`, {
                username,
                password,
            });

            console.log(response.data)

            // Assuming the API returns a token on successful login
            const token = response.data.token;
            if (token) {
                // Set the token in cookies
                Cookies.set('token', token, { expires: 7 }); // Cookie expires after 7 days

                // Call the login function from the AuthContext to set isAuthenticated to true and store the token.
                login(token);

                // Redirect to /starter after successful login
                navigate('/starter');
            }
        } catch (error) {
            console.error(error)
            setErrorMessages('Invalid credentials. Please try again.');

        }

        setIsLoading(false)
        setDisable(false)

    };

    return (
        <div className="Auth-form-container">
            <form className="Auth-form" onSubmit={handleSubmit} >
                <div className="Auth-form-content">
                    {/*<h3 className="Auth-form-title">Sign In</h3> */}
                    <div className="text-center mb-4 pt-5">
                        <img className="logo" src={LogoWhite} style={{ width: 200, height: 200 }} alt="logo"/>
                        <h4 className="my-4">Hosp System</h4>
                        <p className="my-4 font-weight-normal"></p>
                    </div>
                    <div className="form-group mt-3">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="form-control mt-1"
                            placeholder="Enter username"
                            required
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="form-control mt-1"
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    {errorMessages &&
                    <div className="alert alert-danger mt-2">{errorMessages}</div>}


                    <div className="d-grid gap-2 mt-3 mb-5">
                        <button type="submit" className="btn btn-success"  disabled={disable}>
                            Login&emsp;
                            {isLoading && <span className="spinner-border spinner-border-sm me-1"></span> }
                        </button>
                    </div>

                </div>
            </form>
        </div>
    );
};

export default Login;