import { ReactComponent as LogoDark } from "../assets/images/logos/medical-logo.svg";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/">
      <LogoDark style={{ width: "100%", height: "100%" }}/>
    </Link>
  );
};

export default Logo;
