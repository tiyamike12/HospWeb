import {Button, Nav, NavItem} from "reactstrap";
import Logo from "./Logo";
import {Link, useLocation} from "react-router-dom";
import useAuth from "../context/useAuth";

const navigation = [
    {
        title: "Dashboard",
        href: "/starter",
        icon: "bi bi-speedometer2",
        showForRoles: ["system_administrator"]
    },
    {
        title: "Patients",
        href: "/patients",
        icon: "bi bi-bell",
        showForRoles: ["system_administrator", "doctor"]

    },
    {
        title: "Availability",
        href: "/availability",
        icon: "bi bi-patch-check",
        showForRoles: ["system_administrator", "doctor", "nurse"]

    },
    // {
    //     title: "Inventory",
    //     href: "/inventories",
    //     icon: "bi bi-hdd-stack",
    // },
    {
        title: "Appointments",
        href: "/appointments",
        icon: "bi bi-card-text",
        showForRoles: ["system_administrator", "doctor", "nurse"]

    },
    {
        title: "Medical Records",
        href: "/medical-records",
        icon: "bi bi-columns",
        showForRoles: ["system_administrator", "doctor", "nurse"]

    },
    {
        title: "Billings",
        href: "/billings",
        icon: "bi bi-layout-split",
        showForRoles: ["system_administrator", "finance_manager"]

    },
    {
        title: "Pharmacy Items",
        href: "/pharmacy-items",
        icon: "bi bi-textarea-resize",
        showForRoles: ["system_administrator", "pharmacist"]

    },
    // {
    //     title: "Lab Tests",
    //     href: "/lab-tests",
    //     icon: "bi bi-link",
    //     showForRoles: ["system_administrator", "nurse"]
    //
    // },
    // {
    //     title: "Operation Theatres",
    //     href: "/operation-theatres",
    //     icon: "bi bi-people",
    // },
    {
        title: "Departments",
        href: "/departments",
        icon: "bi bi-people",
        showForRoles: ["system_administrator"]

    },

    {
        title: "Insurance Providers",
        href: "/insurance-providers",
        icon: "bi bi-people",
        showForRoles: ["system_administrator", "finance_manager"]

    },
    {
        title: "Users",
        href: "/users",
        icon: "bi bi-people",
        showForRoles: ["system_administrator"]
    },
    {
        title: "Activity Logs",
        href: "/activity-logs",
        icon: "bi bi-people",
        showForRoles: ["system_administrator"]
    },
];

const Sidebar = () => {
    const { user } = useAuth();

    const roleName = user?.role?.name;

    const filteredNavigation = navigation.filter(
        (navi) => !navi.showForRoles || navi.showForRoles.includes(roleName)
    );

    const showMobilemenu = () => {
        document.getElementById("sidebarArea").classList.toggle("showSidebar");
    };
    let location = useLocation();

    return (
        <div className="p-1">
            <div className="d-flex align-items-center">
                <Logo/>
                <Button
                    close
                    size="sm"
                    className="ms-auto d-lg-none"
                    onClick={() => showMobilemenu()}
                ></Button>
            </div>
            <div className="pt-4 mt-2">
                <Nav vertical className="sidebarNav">
                    {filteredNavigation.map((navi, index) => (
                        <NavItem key={index} className="sidenav-bg">
                            <Link
                                to={navi.href}
                                className={
                                    location.pathname === navi.href
                                        ? "text-primary nav-link py-3"
                                        : "nav-link text-secondary py-3"
                                }
                            >
                                <i className={navi.icon}></i>
                                <span className="ms-3 d-inline-block">{navi.title}</span>
                            </Link>
                        </NavItem>
                    ))}

                </Nav>
            </div>
        </div>
    );
};

export default Sidebar;
