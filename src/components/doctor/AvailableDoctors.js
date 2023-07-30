import {Button, Card, CardBody, CardSubtitle, CardTitle, Table} from "reactstrap";
import {useEffect, useState} from "react";
import axios from "axios";
import {Link, useNavigate} from "react-router-dom";
import {Modal} from "react-bootstrap";
import {toast} from "react-toastify";
import Alert from 'react-s-alert';

const BASE_URL = process.env.REACT_APP_API_URL;

const AvailableDoctors = () => {
    const [listData, setListData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const navigate = useNavigate();

    const fetchAvailableDoctors = () => {
        const currentDate = new Date().toISOString().slice(0, 10); // Get current date in 'YYYY-MM-DD' format
        const currentTime = new Date().toISOString().slice(11, 16); // Get current time in 'HH:mm' format

        axios
            .get(`${BASE_URL}/doctors/available`, {
                params: {
                    appointment_date: currentDate,
                    appointment_time: currentTime,
                },
            })
            .then((response) => {
                setListData(response.data);
                setIsLoaded(true);
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        fetchAvailableDoctors();
    }, []);


    console.log(listData)

    return (
        <div>
            {isLoaded ? (
                <Card>


                    <CardBody>
                        <CardTitle tag="h5">Doctors Available</CardTitle>

                        <CardSubtitle className="mb-2 text-muted" tag="h6">
                            Doctors Available
                        </CardSubtitle>

                        <Table className="no-wrap mt-3 align-middle" responsive borderless>
                            <thead>
                            <tr>
                                <th>Username</th>
                                <th>Start Time</th>
                                <th>End Time</th>

                                {/*<th>Edit</th>*/}
                                {/*<th>Delete</th>*/}

                            </tr>
                            </thead>
                            <tbody>
                            {listData.map((data) => (
                                <tr key={data.id} className="border-top">

                                    <td>{data.username}</td>
                                    <td>{data.availability.start_time}</td>
                                    <td>{data.availability.end_time}</td>

                                    {/*<td><Link to={`/edit-department/${data.id}`} className="btn btn-outline-primary">Edit</Link></td>*/}

                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </CardBody>
                </Card> ) : (<p>Loading...</p>)}

            <Alert stack={{ limit: 5 }} />

        </div>
    )
}

export default AvailableDoctors;