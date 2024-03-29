import React, {useContext, useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../context/useAuth";
import LogoWhite from "../../assets/images/logos/medical-logo.png";
import "./Login.css";
import axios from "axios";
import {AuthContext} from "../../context/AuthContext";
import {toast} from "react-toastify";
import validator from 'validator';

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
    const { setToken, setUser } = useContext(AuthContext);

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

            if (response.data.token !== undefined) {
                const { token, user } = response.data;

                console.log("TOKEN IS AVAILABLE")
                //localStorage.setItem('token', token);
                console.log(token)
                toast.success("Login successful!")
                navigate("/starter");
                setToken(token);
                setUser(user);
                // localStorage.setItem('token', token);

                //login();
                //console.log(response.data)
                navigate(location.state?.from || "/starter", { replace: true });

            }
            //console.log("API TOKEN: " + token)
        } catch (error) {
            if (error.response.status === 401) {
                //setErrorMessages(error.response.data.errors);

                setErrorMessages("Invalid Password");
                console.log("Unauthorized")
            } else {
                console.error(error)
            }
        }

        setIsLoading(false)
        setDisable(false)
        //const { token } = response.data;
        // localStorage.setItem('token', token);
        // navigate('/protected');
        //console.log(response.data)
        // login();
        // navigate(location.state?.from || "/", { replace: true });
    };

    return (
        <div className="Auth-form-container">
            <form className="Auth-form" onSubmit={handleSubmit} >
                <div className="Auth-form-content">
                    {/*<h3 className="Auth-form-title">Sign In</h3> */}
                    <div className="text-center mb-4 pt-5">
                        <img className="logo" src={LogoWhite} style={{ width: 200, height: 200 }} alt="logo"/>
                        <h4 className="my-4">Hospital System</h4>
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