import {useRoutes} from "react-router-dom";
import Themeroutes from "./routes/Router";
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    const routing = useRoutes(Themeroutes);

    return <div className="dark">{routing} <ToastContainer/>
    </div>;
};

export default App;
