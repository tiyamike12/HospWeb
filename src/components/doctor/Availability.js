import {Button, Card, CardBody, CardSubtitle, CardTitle, Table} from "reactstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {Modal} from "react-bootstrap";
import {toast} from "react-toastify";
import Alert from 'react-s-alert';
import useAuth from "../../context/useAuth";

const BASE_URL = process.env.REACT_APP_API_URL;

const Availability = () => {
    const [listData, setListData] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [availability, setAvailability] = useState({
        doctor_id: '',
        start_time: '',
        end_time: ''
    });
    const { user } = useAuth();

    const userId = user?.id;

    useEffect(() => {
        axios.get(  `${BASE_URL}/doctor/availability/${userId}`, )
            .then(response => {
                setListData(response.data);
                setIsLoaded(true);
            })
            .catch(error => console.log(error));
    }, []);


    console.log(listData)

    return (
        <div>
            {isLoaded ? (
                <Card>


                    <CardBody>
                        <CardTitle tag="h5">Availability</CardTitle>
                        <div className="d-flex justify-content-end">
                            <Link to={'/available-doctors'} className="btn btn-primary">Available Doctors</Link>
                        </div>
                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                            Availability
                        </CardSubtitle>

                        <Table className="no-wrap mt-3 align-middle" responsive borderless>
                            <thead>
                            <tr>
                                <th>Start Time</th>
                                <th>End Time</th>

                                <th>Edit</th>

                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{listData.start_time}</td>
                                <td>{listData.end_time}</td>
                                <td>
                                    <Link
                                        to={`/edit-availability/${userId}`}
                                        className="btn btn-outline-primary"
                                    >
                                        Edit
                                    </Link>
                                </td>
                            </tr>
                            </tbody>
                        </Table>
                    </CardBody>
                </Card> ) : (<p>Loading...</p>)}


            <Alert stack={{ limit: 5 }} />

        </div>
    )
}

export default Availability;