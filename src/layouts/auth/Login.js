import React, {useContext, useState} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../context/useAuth";
import LogoWhite from "../../assets/images/logos/laravel.png";
import "./Login.css";
import axios from "axios";
import {AuthContext} from "../../context/AuthContext";
import {toast} from "react-toastify";
const BASE_URL = process.env.REACT_APP_API_URL;
const Login = () => {
    const [disable, setDisable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState("");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { setToken } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(e)
        setIsLoading(true)
        setDisable(true)
        try {
            const response = await axios.post(`${BASE_URL}/login`, {
                email,
                password,
            });

            console.log(response.data)

            if (response.data.token !== undefined) {
                const token  = response.data.token;

                console.log("TOKEN IS AVAILABLE")
                //localStorage.setItem('token', token);
                console.log(token)
                toast.success("Login successful!")
                navigate("/starter");
                setToken(token);
                localStorage.setItem('token', token);

                //login();
                //console.log(response.data)
                navigate(location.state?.from || "/starter", { replace: true });

            }
            //console.log("API TOKEN: " + token)
        } catch (error) {
            if (error.response.status === 401) {
                setErrorMessages(error.response.data.errors);
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
                        <h4 className="my-4">Hosp System</h4>
                        <p className="my-4 font-weight-normal"></p>
                    </div>
                    <div className="form-group mt-3">
                        <label>Email address</label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="form-control mt-1"
                            placeholder="Enter email"
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