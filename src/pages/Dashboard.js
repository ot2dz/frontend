import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './NavigationBar';

const Dashboard = () => {
  const [summary, setSummary] = useState({ drivers: 0, customers: 0, rides: 0 });
  const [notifications, setNotifications] = useState([]);
  //const [setShow] = useState(false);

  useEffect(() => {
    fetchSummary();
    fetchNotifications();
  }, []);

  const fetchSummary = async () => {
    try {
      const res = await API.get('/api/dashboard/summary');
      setSummary(res.data);
    } catch (error) {
      console.error('Error fetching summary:', error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await API.get('/api/notifications');
      setNotifications(res.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // const handleShow = () => setShow(true);
  // const handleClose = () => setShow(false);

  return (
    <Container fluid className="p-0">
      <NavigationBar />

      <Container className="mt-4">
        <Row className="mb-4">
          <Col>
            <h1>Dashboard</h1>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col md={4}>
            <Card className="text-white bg-primary mb-3">
              <Card.Body>
                <Card.Title>Drivers</Card.Title>
                <Card.Text>{summary.drivers}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-white bg-success mb-3">
              <Card.Body>
                <Card.Title>Customers</Card.Title>
                <Card.Text>{summary.customers}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="text-white bg-info mb-3">
              <Card.Body>
                <Card.Title>Rides</Card.Title>
                <Card.Text>{summary.rides}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <h2>Notifications</h2>
            {notifications.map((notification, index) => (
              <Alert key={index} variant="warning">
                {notification.message}
              </Alert>
            ))}
          </Col>
        </Row>
      </Container>
    </Container>
  );
};

export default Dashboard;
