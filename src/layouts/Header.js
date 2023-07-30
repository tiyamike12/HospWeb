import React, {useContext} from "react";
import {Link, useNavigate} from "react-router-dom";
import {
    Navbar,
    Collapse,
    Nav,
    NavItem,
    NavbarBrand,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Dropdown,
    Button,
} from "reactstrap";
import {ReactComponent as LogoWhite} from "../assets/images/logos/xtremelogowhite.svg";
import user1 from "../assets/images/users/user1.jpg";
import {AuthContext} from "../context/AuthContext";
import axios from "axios";
const BASE_URL = process.env.REACT_APP_API_URL;

const Header = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [dropdownOpen, setDropdownOpen] = React.useState(false);
    const {setToken} = useContext(AuthContext);
    const navigate = useNavigate();
    const toggle = () => setDropdownOpen((prevState) => !prevState);
    const Handletoggle = () => {
        setIsOpen(!isOpen);
    };


    const handleLogout = async () => {
        try {
            await axios.post(`${BASE_URL}/logout`);
            setToken(null);
            //localStorage.removeItem('token');
            navigate('/login');
        } catch (error) {
            // Handle errors
            console.error(error)
        }
    };


    const showMobilemenu = () => {
        document.getElementById("sidebarArea").classList.toggle("showSidebar");
    };
    return (
        <Navbar color="success" dark expand="md">
            <div className="d-flex align-items-center">
                <NavbarBrand href="/" className="d-lg-none">
                    <LogoWhite/>
                </NavbarBrand>
                <Button
                    color="primary"
                    className="d-lg-none"
                    onClick={() => showMobilemenu()}
                >
                    <i className="bi bi-list"></i>
                </Button>
            </div>
            <div className="hstack gap-2">
                <Button
                    color="primary"
                    size="sm"
                    className="d-sm-block d-md-none"
                    onClick={Handletoggle}
                >
                    {isOpen ? (
                        <i className="bi bi-x"></i>
                    ) : (
                        <i className="bi bi-three-dots-vertical"></i>
                    )}
                </Button>
            </div>

            <Collapse navbar isOpen={isOpen}>
                <Nav className="me-auto" navbar>
                    <NavItem>
                        <Link to="/starter" className="nav-link">
                            Starter
                        </Link>
                    </NavItem>
                    <NavItem>
                        <Link to="/about" className="nav-link">
                            About
                        </Link>
                    </NavItem>
                    <UncontrolledDropdown inNavbar nav>
                        <DropdownToggle caret nav>
                            DD Menu
                        </DropdownToggle>
                        <DropdownMenu end>
                            <DropdownItem>Option 1</DropdownItem>
                            <DropdownItem>Option 2</DropdownItem>
                            <DropdownItem divider/>
                            <DropdownItem>Reset</DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>
                <Dropdown isOpen={dropdownOpen} toggle={toggle}>
                    <DropdownToggle color="primary">
                        <img
                            src={user1}
                            alt="profile"
                            className="rounded-circle"
                            width="30"
                        ></img>
                    </DropdownToggle>
                    <DropdownMenu>
                        <DropdownItem header>Info</DropdownItem>
                        <DropdownItem>My Account</DropdownItem>
                        <DropdownItem>Edit Profile</DropdownItem>
                        <DropdownItem divider/>
                        <DropdownItem><Link to="/change-password">Change Password</Link></DropdownItem>
                        <DropdownItem onClick={() => handleLogout()}>Logout</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Collapse>
        </Navbar>
    );
};

export default Header;
