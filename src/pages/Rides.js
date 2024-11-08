import React, { useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { Table, Button, Form, Row, Col } from 'react-bootstrap';
import { format, parseISO } from 'date-fns';
import NavigationBar from './NavigationBar';
import ReactPaginate from 'react-paginate';
import './Rides.css';

const Rides = () => {
  const [rides, setRides] = useState([]);
  const [filter, setFilter] = useState({ driver: '', driverPhone: '', userPhone: '', date: '' });
  const [currentPage, setCurrentPage] = useState(0);
  const ridesPerPage = 50;

  const fetchRides = useCallback(async () => {
    try {
      const params = {};
      if (filter.driver) params.driver = filter.driver;
      if (filter.driverPhone) params.driverPhone = filter.driverPhone;
      if (filter.userPhone) params.userPhone = filter.userPhone;
      if (filter.date) params.date = filter.date;

      const res = await API.get('/rides', { params });
      console.log(res.data);
      // ترتيب البيانات من الأحدث إلى الأقدم
      const sortedRides = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setRides(sortedRides);
    } catch (error) {
      console.error('Error fetching rides:', error);
    }
  }, [filter]);

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

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

  // حساب بيانات الرحلات المعروضة في الصفحة الحالية
  const offset = currentPage * ridesPerPage;
  const currentRides = rides.slice(offset, offset + ridesPerPage);
  const pageCount = Math.ceil(rides.length / ridesPerPage);

  return (
    <div>
      <NavigationBar />
      <h1>Rides</h1>
      <Form className="filter-form">
        <Row className="align-items-center">
          <Col md={3}>
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
          </Col>
          <Col md={3}>
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
          </Col>
          <Col md={3}>
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
          </Col>
          <Col md={3}>
            <Form.Group controlId="filterDate">
              <Form.Label>Filter by Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={filter.date}
                onChange={handleFilterChange}
              />
            </Form.Group>
          </Col>
          <Col md="auto" className="d-flex align-items-end">
            <Button variant="primary" onClick={fetchRides} className="filter-button">Filter</Button>
          </Col>
        </Row>
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Driver Name</th>
            <th>Driver Phone</th>
            <th>User Name</th>
            <th>User Phone</th>
            <th>Pickup Location</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentRides.map((ride) => (
            <tr key={ride._id}>
              <td>{ride.driverName}</td>
              <td>{ride.driverPhone}</td>
              <td>{ride.userName}</td>
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
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </div>
  );
};

export default Rides;
