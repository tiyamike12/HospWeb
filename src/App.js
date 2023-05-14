import { useRoutes } from "react-router-dom";
import Themeroutes from "./routes/Router";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const App = () => {
  const routing = useRoutes(Themeroutes);

  return <div className="dark">{routing}</div>;
};

export default App;
