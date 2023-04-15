import {lazy} from "react";
import {Navigate} from "react-router-dom";
import AuthContextProvider from "../context/AuthContext";
import PrivateRoute from "../context/PrivateRoute";

/****Layouts*****/
const FullLayout = lazy(() => import("../layouts/FullLayout.js"));

/***** Pages ****/

const Starter = lazy(() => import("../views/Starter.js"));
const About = lazy(() => import("../views/About.js"));
const Alerts = lazy(() => import("../views/ui/Alerts"));
const Badges = lazy(() => import("../views/ui/Badges"));
const Buttons = lazy(() => import("../views/ui/Buttons"));
const Cards = lazy(() => import("../views/ui/Cards"));
const Grid = lazy(() => import("../views/ui/Grid"));
const Tables = lazy(() => import("../views/ui/Tables"));
const Forms = lazy(() => import("../views/ui/Forms"));
const Breadcrumbs = lazy(() => import("../views/ui/Breadcrumbs"));
const Login = lazy(() => import("../layouts/auth/Login"));
const UserList = lazy(() => import("../components/users/UsersList"));
const NewUser = lazy(() => import("../components/users/NewUser"));
const EditUser = lazy(() => import("../components/users/EditUser"));
const PatientList = lazy(() => import("../components/patient/PatientList"));
const NewPatient = lazy(() => import("../components/patient/NewPatient"));
const EditPatient = lazy(() => import("../components/patient/EditPatient"));
const WardList = lazy(() => import("../components/ward/WardList"));
const NewWard = lazy(() => import("../components/ward/NewWard"));
const EditWard = lazy(() => import("../components/ward/EditWard"));
const InventoryList = lazy(() => import("../components/inventory/InventoryList"));
const NewInventory = lazy(() => import("../components/inventory/NewInventory"));
const EditInventory = lazy(() => import("../components/inventory/EditInventory"));
/*****Routes******/

const ThemeRoutes = [
    {
        path: "/",
        element: <PrivateRoute><FullLayout/></PrivateRoute>,
        children: [
            {path: "/", element: <Navigate to="/starter"/>},
            {path: "/starter", exact: true, element: <Starter/>},
            {path: "/about", exact: true, element: <About/>},
            {path: "/alerts", exact: true, element: <Alerts/>},
            {path: "/badges", exact: true, element: <Badges/>},
            {path: "/buttons", exact: true, element: <Buttons/>},
            {path: "/cards", exact: true, element: <Cards/>},
            {path: "/grid", exact: true, element: <Grid/>},
            {path: "/table", exact: true, element: <Tables/>},
            {path: "/forms", exact: true, element: <Forms/>},
            {path: "/breadcrumbs", exact: true, element: <Breadcrumbs/>},
            {path: "/users", exact: true, element: <UserList/>},
            {path: "/new-user", exact: true, element: <NewUser/>},
            {path: "/edit-user/:id", exact: true, element: <EditUser/>},
            {path: "/patients", exact: true, element: <PatientList/>},
            {path: "/new-patient", exact: true, element: <NewPatient/>},
            {path: "/edit-patient/:id", exact: true, element: <EditPatient/>},
            {path: "/wards", exact: true, element: <WardList/>},
            {path: "/new-ward", exact: true, element: <NewWard/>},
            {path: "/edit-ward/:id", exact: true, element: <EditWard/>},
            {path: "/inventories", exact: true, element: <InventoryList/>},
            {path: "/new-inventory", exact: true, element: <NewInventory/>},
            {path: "/edit-inventory/:id", exact: true, element: <EditInventory/>}
        ],
    },
    {path: "/login", exact: true, element: <Login/>,},
];

export default ThemeRoutes;
