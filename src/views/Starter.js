import {Col, Row} from "reactstrap";
import SalesChart from "../components/dashboard/SalesChart";
import Feeds from "../components/dashboard/Feeds";
import ProjectTables from "../components/dashboard/ProjectTable";
import TopCards from "../components/dashboard/TopCards";
import Blog from "../components/dashboard/Blog";
import bg1 from "../assets/images/bg/bg1.jpg";
import bg2 from "../assets/images/bg/bg2.jpg";
import bg3 from "../assets/images/bg/bg3.jpg";
import bg4 from "../assets/images/bg/bg4.jpg";
import {useContext, useEffect, useState} from "react";
import axios from "axios";
import useAuth from "../context/useAuth";
import AppointmentsOverallChart from "../components/dashboard/AppointmentsOverallChart";
import BillingsOverallChart from "../components/dashboard/BillingsOverallChart";
import BillingChart from "../components/dashboard/BillingChart";
import BillingTotalsBarChart from "../components/dashboard/BillingTotalsBarChart";

const BASE_URL = process.env.REACT_APP_API_URL;

const BlogData = [
    {
        image: bg1,
        title: "This is simple blog",
        subtitle: "2 comments, 1 Like",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content.",
        btnbg: "primary",
    },
    {
        image: bg2,
        title: "Lets be simple blog",
        subtitle: "2 comments, 1 Like",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content.",
        btnbg: "primary",
    },
    {
        image: bg3,
        title: "Don't Lamp blog",
        subtitle: "2 comments, 1 Like",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content.",
        btnbg: "primary",
    },
    {
        image: bg4,
        title: "Simple is beautiful",
        subtitle: "2 comments, 1 Like",
        description:
            "This is a wider card with supporting text below as a natural lead-in to additional content.",
        btnbg: "primary",
    },
];

const Starter = () => {
    const [scheduledData, setScheduledData] = useState([]);
    const {user} = useAuth();
    const userId = user?.id;
    const roleName = user?.role?.name;

    useEffect(() => {
        axios.get(`${BASE_URL}/appointments/scheduled/${userId}`)
            .then(response => {
                setScheduledData(response.data);
                // setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, []);

    return (
        <div>
            {/***Top Cards***/}
            {roleName === 'system_administrator' && (
                <div>
                    <Row>
                        <h5>My Appointments</h5>
                        <Col sm="8" lg="4">
                            <TopCards
                                bg="bg-light-success text-success"
                                title="Scheduled"
                                subtitle="Appointments Scheduled"
                                earning={scheduledData.scheduled}
                                icon="bi bi-wallet"
                            />
                        </Col>
                        <Col sm="8" lg="4">
                            <TopCards
                                bg="bg-light-danger text-danger"
                                title="Completed"
                                subtitle="Appointments Completed"
                                earning={scheduledData.scheduled}
                                icon="bi bi-coin"
                            />
                        </Col>
                        <Col sm="8" lg="4">
                            <TopCards
                                bg="bg-light-warning text-warning"
                                title="Canceled"
                                subtitle="Appointments Canceled"
                                earning={scheduledData.scheduled}
                                icon="bi bi-basket3"
                            />
                        </Col>

                    </Row>


                    <Row>
                        <Col sm="6" lg="6" xl="6" xxl="6">
                            <AppointmentsOverallChart/>
                        </Col>
                        <Col sm="6" lg="6" xl="6" xxl="6">
                            <BillingsOverallChart/>
                        </Col>
                    </Row>
                </div>
            )}
            {/*<Row>*/}
            {/*    <h5>My Appointments</h5>*/}
            {/*    <Col sm="6" lg="3">*/}
            {/*        <TopCards*/}
            {/*            bg="bg-light-success text-success"*/}
            {/*            title="Scheduled"*/}
            {/*            subtitle="Appointments Scheduled"*/}
            {/*            earning="55"*/}
            {/*            icon="bi bi-wallet"*/}
            {/*        />*/}
            {/*    </Col>*/}
            {/*    <Col sm="6" lg="3">*/}
            {/*        <TopCards*/}
            {/*            bg="bg-light-danger text-danger"*/}
            {/*            title="Completed"*/}
            {/*            subtitle="Appointments Completed"*/}
            {/*            earning="4"*/}
            {/*            icon="bi bi-coin"*/}
            {/*        />*/}
            {/*    </Col>*/}
            {/*    <Col sm="6" lg="3">*/}
            {/*        <TopCards*/}
            {/*            bg="bg-light-warning text-warning"*/}
            {/*            title="Canceled"*/}
            {/*            subtitle="Appointments Canceled"*/}
            {/*            earning="45"*/}
            {/*            icon="bi bi-basket3"*/}
            {/*        />*/}
            {/*    </Col>*/}
            {/*    <Col sm="6" lg="3">*/}
            {/*        <TopCards*/}
            {/*            bg="bg-light-info text-into"*/}
            {/*            title="Sales"*/}
            {/*            subtitle="Weekly Sales"*/}
            {/*            earning="210"*/}
            {/*            icon="bi bi-bag"*/}
            {/*        />*/}
            {/*    </Col>*/}
            {/*</Row>*/}
            {/***Sales & Feed***/}
            <Row>
                {/*<Col sm="6" lg="6" xl="7" xxl="8">*/}
                {/*    <SalesChart/>*/}
                {/*</Col>*/}
                {/*<Col sm="6" lg="6" xl="5" xxl="4">*/}
                {/*<Feeds/>*/}
                <Col lg="12">
                    <BillingChart/>
                </Col>

            </Row>

            <Row>

                <Col lg="12">
                    <BillingTotalsBarChart/>
                </Col>

            </Row>
            {/***Table ***/}
            <Row>
                <Col lg="12">
                    <ProjectTables/>
                </Col>
            </Row>
            {/***Blog Cards***/}
            {/*<Row>*/}
            {/*    {BlogData.map((blg, index) => (*/}
            {/*        <Col sm="6" lg="6" xl="3" key={index}>*/}
            {/*            <Blog*/}
            {/*                image={blg.image}*/}
            {/*                title={blg.title}*/}
            {/*                subtitle={blg.subtitle}*/}
            {/*                text={blg.description}*/}
            {/*                color={blg.btnbg}*/}
            {/*            />*/}
            {/*        </Col>*/}
            {/*    ))}*/}
            {/*</Row>*/}
        </div>
    );
};

export default Starter;
