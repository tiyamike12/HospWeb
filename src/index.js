import React, {Suspense} from "react";
import ReactDOM from "react-dom";
import "./assets/scss/style.scss";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {BrowserRouter, HashRouter, Routes} from "react-router-dom";
import Loader from "./layouts/loader/Loader";
import AuthContextProvider from "./context/AuthContext";
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.render(<Suspense fallback={<Loader/>}>
        <HashRouter>
            <AuthContextProvider>
                <App/>
            </AuthContextProvider>
        </HashRouter>
    </Suspense>,
    document.getElementById("root"));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
