import {lazy} from "react";
import {Navigate, Route, Routes, useRoutes} from "react-router-dom";
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
const InventoryList = lazy(() => import("../components/lab-test/LabTestsList"));
const NewInventory = lazy(() => import("../components/lab-test/NewLabTest"));
const EditInventory = lazy(() => import("../components/lab-test/EditLabTest"));
const NewAppointment = lazy(() => import("../components/appointments/NewAppointment"));
const AppointmentList = lazy(() => import("../components/appointments/AppointmentList"));
const EditAppointment = lazy(() => import("../components/appointments/EditAppointment"));
const NewMedicalRecord = lazy(() => import("../components/medical-records/NewMedicalRecord"));
const MedicalRecordList = lazy(() => import("../components/medical-records/MedicalRecordList"));
const EditMedicalRecord = lazy(() => import("../components/medical-records/EditMedicalRecord"));
const NewBilling = lazy(() => import("../components/billings/NewBilling"));
const BillingList = lazy(() => import("../components/billings/BillingList"));
const EditBilling = lazy(() => import("../components/billings/EditBilling"));
const NewPharmacyItem = lazy(() => import("../components/pharmacy/NewPharmacyItem"));
const PharmacyItemList = lazy(() => import("../components/pharmacy/PharmacyItemList"));
const EditPharmacyItem = lazy(() => import("../components/pharmacy/EditPharmacyItem"));
const NewLabTest = lazy(() => import("../components/lab-test/NewLabTest"));
const LabTestsList = lazy(() => import("../components/lab-test/LabTestsList"));
const EditLabTest = lazy(() => import("../components/lab-test/EditLabTest"));
const NewOperationTheatre = lazy(() => import("../components/operation-theatre/NewOperationTheatre"));
const OperationTheatresList = lazy(() => import("../components/operation-theatre/OperationTheatresList"));
const EditOperationTheatre = lazy(() => import("../components/operation-theatre/EditOperationTheatre"));
const NewDepartment = lazy(() => import("../components/department/NewDepartment"));
const DepartmentList = lazy(() => import("../components/department/DepartmentList"));
const EditDepartment = lazy(() => import("../components/department/EditDepartment"));
const NewInsuranceProvider = lazy(() => import("../components/insurance-providers/NewInsuranceProvider"));
const InsuranceProvidersList = lazy(() => import("../components/insurance-providers/InsuranceProvidersList"));
const EditInsuranceProvider = lazy(() => import("../components/insurance-providers/EditInsuranceProvider"));
const ChangePassword = lazy(() => import("../components/auth/ChangePassword"));
const CalendarView = lazy(() => import("../components/appointments/CalendarView"));
const Availability = lazy(() => import("../components/doctor/Availability"));
const SetAvailability = lazy(() => import("../components/doctor/SetAvailability"));
const AvailableDoctors = lazy(() => import("../components/doctor/AvailableDoctors"));
const NewDepartmentService = lazy(() => import("../components/department-services/NewDepartmentService"));
const DepartmentServiceList = lazy(() => import("../components/department-services/DepartmentServiceList"));
const EditDepartmentService = lazy(() => import("../components/department-services/EditDepartmentService"));

/*****Routes******/

const ThemeRoutes = [
    {
        path: "/",
        element: <PrivateRoute><FullLayout/></PrivateRoute>,
        children: [
            {path: "/", element: <Navigate to="/starter"/>},
            {path: "/change-password", exact: true, element: <ChangePassword/>},

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
            {path: "/new-lab-test", exact: true, element: <NewInventory/>},
            {path: "/edit-lab-test/:id", exact: true, element: <EditInventory/>},
            {path: "/new-appointment", exact: true, element: <NewAppointment/>},
            {path: "/appointments", exact: true, element: <AppointmentList/>},
            {path: "/edit-appointment/:id", exact: true, element: <EditAppointment/>},
            {path: "/new-medical-record", exact: true, element: <NewMedicalRecord/>},
            {path: "/medical-records", exact: true, element: <MedicalRecordList/>},
            {path: "/edit-medical-record/:id", exact: true, element: <EditMedicalRecord/>},
            {path: "/new-billing", exact: true, element: <NewBilling/>},
            {path: "/billings", exact: true, element: <BillingList/>},
            {path: "/edit-billing/:id", exact: true, element: <EditBilling/>},

            {path: "/new-pharmacy-item", exact: true, element: <NewPharmacyItem/>},
            {path: "/pharmacy-items", exact: true, element: <PharmacyItemList/>},
            {path: "/edit-pharmacy-item/:id", exact: true, element: <EditPharmacyItem/>},
            {path: "/new-lab-test", exact: true, element: <NewLabTest/>},
            {path: "/lab-tests", exact: true, element: <LabTestsList/>},
            {path: "/edit-lab-test/:id", exact: true, element: <EditLabTest/>},

            {path: "/new-operation-theatre", exact: true, element: <NewOperationTheatre/>},
            {path: "/operation-theatres", exact: true, element: <OperationTheatresList/>},
            {path: "/edit-operation-theatres/:id", exact: true, element: <EditOperationTheatre/>},
            {path: "/new-department", exact: true, element: <NewDepartment/>},
            {path: "/departments", exact: true, element: <DepartmentList/>},
            {path: "/edit-department/:id", exact: true, element: <EditDepartment/>},
            {path: "/new-insurance-provider", exact: true, element: <NewInsuranceProvider/>},
            {path: "/insurance-providers", exact: true, element: <InsuranceProvidersList/>},
            {path: "/edit-insurance-providers/:id", exact: true, element: <EditInsuranceProvider/>},
            {path: "/appointments-calendar", exact: true, element: <CalendarView/>},
            {path: "/availability", exact: true, element: <Availability/>},
            {path: "/edit-availability/:id", exact: true, element: <SetAvailability/>},
            {path: "/available-doctors", exact: true, element: <AvailableDoctors/>},
            {path: "/new-department-service", exact: true, element: <NewDepartmentService/>},
            {path: "/department-services", exact: true, element: <DepartmentServiceList/>},
            {path: "/edit-department-service/:id", exact: true, element: <EditDepartmentService/>},

        ],
    },
    {path: "/login", exact: true, element: <Login/>,},
];

export default ThemeRoutes;
