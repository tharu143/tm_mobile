// Service.jsx (No changes, but full code provided for completeness. Edit navigates to /service/add with state)
import React, { useState, useEffect } from 'react';
import { Button, Table, message, Popconfirm, Input } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const { Search } = Input;

const Service = ({ theme }) => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('/api/services');
      const activeServices = response.data.filter(service => !service.deleted);
      setServices(activeServices);
      setFilteredServices(activeServices);
    } catch (error) {
      console.error('Error fetching services:', error);
      message.error('Failed to fetch services');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/services/${id}`);
      message.success('Service deleted successfully');
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      message.error('Failed to delete service');
    }
  };

  const handleSearch = (value) => {
    const searchTerm = value.toLowerCase();
    const filtered = services.filter(
      (service) =>
        service.serviceNumber.toLowerCase().includes(searchTerm) ||
        service.customer.name.toLowerCase().includes(searchTerm)
    );
    setFilteredServices(filtered);
  };

  const columns = [
    { title: 'Service Number', dataIndex: 'serviceNumber', key: 'serviceNumber' },
    { title: 'Customer Name', dataIndex: ['customer', 'name'], key: 'customerName' },
    { title: 'Phone', dataIndex: ['customer', 'phone'], key: 'phone' },
    { title: 'Brand', dataIndex: ['device', 'brand'], key: 'brand' },
    { title: 'Model', dataIndex: ['device', 'model'], key: 'model' },
    { title: 'Complaint Type', dataIndex: ['problem', 'complaintType'], key: 'complaintType' },
    { title: 'Description', dataIndex: ['problem', 'description'], key: 'description' },
    { title: 'Total', dataIndex: 'total', key: 'total' },
    { title: 'Manual Amount', dataIndex: 'manualTotal', key: 'manualTotal', render: (text) => text || 'N/A' },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => (
        <span style={{ color: text.startsWith('completed') ? 'green' : 'black' }}>{text}</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <>
          <Button
            type="link"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/service/add`, { state: { service: record } });
            }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this service?"
            onConfirm={() => handleDelete(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="link"
              danger
              onClick={(e) => e.stopPropagation()}
            >
              Delete
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className={`service-page ${theme}`}>
      <h1>Service Management</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <Button type="primary" onClick={() => navigate('/service/add')}>
          Add Service
        </Button>
        <Search
          placeholder="Search by Customer Name or Service Number"
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
          style={{ width: 300 }}
          allowClear
        />
      </div>
      <Table
        dataSource={filteredServices}
        columns={columns}
        rowKey="_id"
        onRow={(record) => ({
          onClick: () => navigate(`/service/${record._id}`),
        })}
      />
    </div>
  );
};

export default Service;