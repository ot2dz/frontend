import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import NavigationBar from './NavigationBar';

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentDriver, setCurrentDriver] = useState({ name: '', phoneNumber: '', carType: '' });

  useEffect(() => {
    fetchDrivers();
  }, []);

  const fetchDrivers = async () => {
    try {
      const res = await API.get('/drivers');
      setDrivers(res.data);
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentDriver({ ...currentDriver, [name]: value });
  };

  const handleSaveDriver = async () => {
    if (currentDriver._id) {
      await API.put(`/drivers/${currentDriver._id}`, currentDriver);
    } else {
      await API.post('/drivers', currentDriver);
    }
    fetchDrivers();
    setShowModal(false);
  };

  const handleEditDriver = (driver) => {
    setCurrentDriver(driver);
    setShowModal(true);
  };

  const handleDeleteDriver = async (id) => {
    await API.delete(`/drivers/${id}`);
    fetchDrivers();
  };

  return (
    
    <div>
      <NavigationBar />
      <h1>Drivers</h1>
      <Button variant="primary" onClick={() => setShowModal(true)}>Add Driver</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Car Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((driver) => (
            <tr key={driver._id}>
              <td>{driver.name}</td>
              <td>{driver.phoneNumber}</td>
              <td>{driver.carType}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditDriver(driver)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDeleteDriver(driver._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentDriver._id ? 'Edit Driver' : 'Add Driver'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="driverName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentDriver.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="driverPhone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={currentDriver.phoneNumber}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="driverCarType">
              <Form.Label>Car Type</Form.Label>
              <Form.Control
                type="text"
                name="carType"
                value={currentDriver.carType}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSaveDriver}>Save changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Drivers;
