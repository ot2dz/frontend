import React, { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { Table, Button, Form } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import NavigationBar from './NavigationBar';

const Rides = () => {
  const [rides, setRides] = useState([]);
  const [filter, setFilter] = useState({ driver: '', driverPhone: '', userPhone: '', date: '' });

  // تعريف `fetchRides` باستخدام `useCallback`
  const fetchRides = useCallback(async () => {
    try {
      const params = {};
      if (filter.driver) params.driver = filter.driver;
      if (filter.driverPhone) params.driverPhone = filter.driverPhone;
      if (filter.userPhone) params.userPhone = filter.userPhone;
      if (filter.date) params.date = filter.date;

      const res = await API.get('/rides', { params });
      setRides(res.data);
    } catch (error) {
      console.error('Error fetching rides:', error);
    }
  }, [filter]); // `useCallback` مع التبعيات الصحيحة

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);  // الآن `fetchRides` موجودة في مصفوفة التبعيات

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const formatDate = (dateString) => {
    return format(parseISO(dateString), 'yyyy-MM-dd');
  };

  const handleDelete = async (rideId) => {
    try {
      await API.delete(`/rides/${rideId}`);
      setRides(rides.filter(ride => ride._id !== rideId));
    } catch (error) {
      console.error('Error deleting ride:', error);
    }
  };

  return (
    <div>
      <NavigationBar />
      <h1>Rides</h1>
      <Form>
        <Form.Group controlId="filterDriver">
          <Form.Label>Filter by Driver</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter driver name"
            name="driver"
            value={filter.driver}
            onChange={handleFilterChange}
          />
        </Form.Group>
        <Form.Group controlId="filterDriverPhone">
          <Form.Label>Filter by Driver Phone</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter driver phone"
            name="driverPhone"
            value={filter.driverPhone}
            onChange={handleFilterChange}
          />
        </Form.Group>
        <Form.Group controlId="filterUserPhone">
          <Form.Label>Filter by User Phone</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter user phone"
            name="userPhone"
            value={filter.userPhone}
            onChange={handleFilterChange}
          />
        </Form.Group>
        <Form.Group controlId="filterDate">
          <Form.Label>Filter by Date</Form.Label>
          <Form.Control
            type="date"
            name="date"
            value={filter.date}
            onChange={handleFilterChange}
          />
        </Form.Group>
        <Button variant="primary" onClick={fetchRides}>Filter</Button>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Driver Name</th>
            <th>Driver Phone</th>
            <th>User Phone</th>
            <th>Pickup Location</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rides.map((ride) => (
            <tr key={ride._id}>
              <td>{ride.driverName}</td>
              <td>{ride.driverPhone}</td>
              <td>{ride.userPhone}</td>
              <td>{ride.userAddress}</td>
              <td>{formatDate(ride.createdAt)}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(ride._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default Rides;
