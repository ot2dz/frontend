import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Table, Button, Form, Modal } from 'react-bootstrap';
import NavigationBar from './NavigationBar';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({ name: '', phoneNumber: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      setUsers(res.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentUser({ ...currentUser, [name]: value });
  };

  const handleSaveUser = async () => {
    if (currentUser._id) {
      await API.put(`/users/${currentUser._id}`, currentUser);
    } else {
      await API.post('/users', currentUser);
    }
    fetchUsers();
    setShowModal(false);
  };

  const handleEditUser = (user) => {
    setCurrentUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (id) => {
    await API.delete(`/users/${id}`);
    fetchUsers();
  };

  return (
    <div>
      <NavigationBar />
      <h1>Users</h1>
      <Button variant="primary" onClick={() => setShowModal(true)}>Add User</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.phoneNumber}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditUser(user)}>Edit</Button>
                <Button variant="danger" onClick={() => handleDeleteUser(user._id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentUser._id ? 'Edit User' : 'Add User'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="userName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={currentUser.name}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="userPhone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={currentUser.phoneNumber}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleSaveUser}>Save changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;
