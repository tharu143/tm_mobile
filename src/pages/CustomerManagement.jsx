import { useState, useEffect } from "react";
import { Search, UserPlus, Edit, Trash2 } from "lucide-react";

// Simulated initial customer data
const initialCustomers = [
  {
    _id: "1",
    name: "Tharun",
    phone: "6381360779",
    email: "tharun@gmail.com",
    address: "dcgf, fggjhg",
    city: "Theni",
    pincode: "600025",
    dateOfBirth: "2025-02-15",
    purchases: 1,
    totalPurchases: 11800,
    lastPurchase: "2025-06-23",
    posBalance: 0,
  },
  {
    _id: "2",
    name: "Manoj",
    phone: "6381360779",
    email: "manoj@gmail.com",
    address: "dfghh, dhdg, fgyfg",
    city: "Theni",
    pincode: "600021",
    dateOfBirth: "2025-06-23",
    purchases: 6,
    totalPurchases: 16596,
    lastPurchase: "2025-07-30",
    posBalance: 0,
  },
];

const CustomerManagement = ({ theme }) => {
  const [customers, setCustomers] = useState(initialCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    pincode: "",
    dateOfBirth: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const customersPerPage = 10;

  // Simulated API fetch
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      setCustomers(initialCustomers); // Using provided data for demo
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Input validation
  const validateForm = () => {
    if (!formData.name || formData.name.length < 2) {
      return "Name is required and must be at least 2 characters";
    }
    if (!formData.phone || !/^\+?\d{10,12}$/.test(formData.phone)) {
      return "Valid phone number is required (10-12 digits)";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "Invalid email format";
    }
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      return "Pincode must be 6 digits";
    }
    return null;
  };

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.phone.includes(searchTerm) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );
  const totalPages = Math.ceil(filteredCustomers.length / customersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      pincode: "",
      dateOfBirth: "",
    });
    setShowAddForm(false);
    setEditingCustomer(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const customerData = {
        ...formData,
        purchases: editingCustomer ? editingCustomer.purchases : 0,
        totalPurchases: editingCustomer ? editingCustomer.totalPurchases : 0,
        lastPurchase: editingCustomer
          ? editingCustomer.lastPurchase
          : new Date().toISOString().split("T")[0],
        posBalance: editingCustomer ? editingCustomer.posBalance : 0,
      };

      let updatedCustomers;
      if (editingCustomer) {
        updatedCustomers = customers.map((c) =>
          c._id === editingCustomer._id ? { ...customerData, _id: c._id } : c
        );
      } else {
        customerData._id = String(customers.length + 1);
        updatedCustomers = [...customers, customerData];
      }

      setCustomers(updatedCustomers);
      alert(editingCustomer ? "Customer updated successfully" : "Customer added successfully");
      resetForm();
    } catch (err) {
      setError(err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addCustomer = () => {
    setShowAddForm(true);
    setEditingCustomer(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      address: "",
      city: "",
      pincode: "",
      dateOfBirth: "",
    });
    setError(null);
  };

  const editCustomer = (customer) => {
    setFormData({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
      address: customer.address,
      city: customer.city,
      pincode: customer.pincode,
      dateOfBirth: customer.dateOfBirth,
    });
    setEditingCustomer(customer);
    setShowAddForm(true);
    setError(null);
  };

  const deleteCustomer = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setLoading(true);
      try {
        setCustomers(customers.filter((c) => c._id !== id));
        alert("Customer deleted successfully");
      } catch (err) {
        setError(err.message);
        alert(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={`container p-4 ${theme === "dark" ? "bg-dark text-white" : "bg-light text-dark"}`}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className={`display-6 fw-bold ${theme === "dark" ? "text-white" : "text-dark"}`}>Customer Management</h1>
          <p className={`small ${theme === "dark" ? "text-white" : "text-muted"}`}>Manage your customer database</p>
        </div>
        <button
          className={`btn btn-primary d-flex align-items-center ${theme === "dark" ? "bg-primary text-white" : ""}`}
          onClick={addCustomer}
          disabled={loading}
        >
          <UserPlus size={16} className="me-2" />
          Add Customer
        </button>
      </div>

      <div className="input-group mb-4">
        <span className={`input-group-text ${theme === "dark" ? "bg-dark text-white border-light" : "bg-light text-dark"}`}>
          <Search size={16} />
        </span>
        <input
          type="text"
          className={`form-control ${theme === "dark" ? "bg-dark text-white border-light" : "bg-white text-dark"}`}
          placeholder="Search customers by name, phone, email, or city..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
      </div>

      {error && (
        <div className={`alert ${theme === "dark" ? "alert-dark text-white" : "alert-danger text-dark"}`} role="alert">
          {error}
        </div>
      )}

      {showAddForm && (
        <div className={`card shadow-sm mb-4 ${theme === "dark" ? "bg-dark text-white border-light" : "bg-white text-dark"}`}>
          <div className={`card-header border-bottom ${theme === "dark" ? "bg-dark text-white border-light" : "bg-light text-dark"}`}>
            <h5 className={`card-title ${theme === "dark" ? "text-white" : "text-dark"}`}>
              {editingCustomer ? "Edit Customer" : "Add New Customer"}
            </h5>
          </div>
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className={`form-label fw-medium ${theme === "dark" ? "text-white" : "text-dark"}`}>
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${theme === "dark" ? "bg-dark text-white border-light" : "bg-white text-dark"}`}
                    placeholder="Enter name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="col-md-6">
                  <label className={`form-label fw-medium ${theme === "dark" ? "text-white" : "text-dark"}`}>
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    className={`form-control ${theme === "dark" ? "bg-dark text-white border-light" : "bg-white text-dark"}`}
                    placeholder="+91 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="col-md-6">
                  <label className={`form-label fw-medium ${theme === "dark" ? "text-white" : "text-dark"}`}>
                    Email
                  </label>
                  <input
                    type="email"
                    className={`form-control ${theme === "dark" ? "bg-dark text-white border-light" : "bg-white text-dark"}`}
                    placeholder="example@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div className="col-md-6">
                  <label className={`form-label fw-medium ${theme === "dark" ? "text-white" : "text-dark"}`}>
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    className={`form-control ${theme === "dark" ? "bg-dark text-white border-light" : "bg-white text-dark"}`}
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div className="col-md-6">
                  <label className={`form-label fw-medium ${theme === "dark" ? "text-white" : "text-dark"}`}>
                    City
                  </label>
                  <input
                    type="text"
                    className={`form-control ${theme === "dark" ? "bg-dark text-white border-light" : "bg-white text-dark"}`}
                    placeholder="Enter city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div className="col-md-6">
                  <label className={`form-label fw-medium ${theme === "dark" ? "text-white" : "text-dark"}`}>
                    Pincode
                  </label>
                  <input
                    type="text"
                    className={`form-control ${theme === "dark" ? "bg-dark text-white border-light" : "bg-white text-dark"}`}
                    placeholder="600017"
                    value={formData.pincode}
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    disabled={loading}
                  />
                </div>
                <div className="col-12">
                  <label className={`form-label fw-medium ${theme === "dark" ? "text-white" : "text-dark"}`}>
                    Address
                  </label>
                  <input
                    type="text"
                    className={`form-control ${theme === "dark" ? "bg-dark text-white border-light" : "bg-white text-dark"}`}
                    placeholder="Enter address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    disabled={loading}
                  />
                </div>
              </div>
              <div className="d-flex gap-2 pt-4">
                <button
                  type="submit"
                  className={`btn btn-primary ${theme === "dark" ? "bg-primary text-white" : ""}`}
                  disabled={loading}
                >
                  {loading ? "Processing..." : (editingCustomer ? "Update Customer" : "Add Customer")}
                </button>
                <button
                  type="button"
                  className={`btn btn-outline-secondary ${theme === "dark" ? "text-white border-light" : "text-dark border-dark"}`}
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={`card shadow-sm ${theme === "dark" ? "bg-dark text-white border-light" : "bg-white text-dark"}`}>
        <div className={`card-header border-bottom ${theme === "dark" ? "bg-dark text-white border-light" : "bg-light text-dark"}`}>
          <h5 className={`card-title ${theme === "dark" ? "text-white" : "text-dark"}`}>Customer List</h5>
        </div>
        <div className="card-body p-4">
          {loading && <p className={`text-center ${theme === "dark" ? "text-white" : "text-dark"}`}>Loading...</p>}
          {!loading && filteredCustomers.length === 0 ? (
            <p className={`text-center ${theme === "dark" ? "text-white" : "text-muted"}`}>No customers found</p>
          ) : (
            <>
              <div className="table-responsive">
                <table className={`table ${theme === "dark" ? "table-dark" : "table-light"}`}>
                  <thead>
                    <tr>
                      <th className={theme === "dark" ? "text-white" : "text-dark"}>Name</th>
                      <th className={theme === "dark" ? "text-white" : "text-dark"}>Phone</th>
                      <th className={theme === "dark" ? "text-white" : "text-dark"}>Email</th>
                      <th className={theme === "dark" ? "text-white" : "text-dark"}>Address</th>
                      <th className={theme === "dark" ? "text-white" : "text-dark"}>City</th>
                      <th className={theme === "dark" ? "text-white" : "text-dark"}>Pincode</th>
                      <th className={theme === "dark" ? "text-white" : "text-dark"}>Date of Birth</th>
                      <th className={theme === "dark" ? "text-white" : "text-dark"}>Purchases</th>
                      <th className={theme === "dark" ? "text-white" : "text-dark"}>Total (₹)</th>
                      <th className={theme === "dark" ? "text-white" : "text-dark"}>Last Purchase</th>
                      <th className={theme === "dark" ? "text-white" : "text-dark"}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCustomers.map((customer) => (
                      <tr key={customer._id}>
                        <td className={theme === "dark" ? "text-white" : "text-dark"}>{customer.name}</td>
                        <td className={theme === "dark" ? "text-white" : "text-dark"}>{customer.phone}</td>
                        <td className={theme === "dark" ? "text-white" : "text-dark"}>{customer.email}</td>
                        <td className={theme === "dark" ? "text-white" : "text-dark"}>{customer.address}</td>
                        <td className={theme === "dark" ? "text-white" : "text-dark"}>{customer.city}</td>
                        <td className={theme === "dark" ? "text-white" : "text-dark"}>{customer.pincode}</td>
                        <td className={theme === "dark" ? "text-white" : "text-dark"}>{customer.dateOfBirth || "N/A"}</td>
                        <td className={theme === "dark" ? "text-white" : "text-dark"}>{customer.purchases}</td>
                        <td className={theme === "dark" ? "text-white" : "text-dark"}>{customer.totalPurchases.toLocaleString()}</td>
                        <td className={theme === "dark" ? "text-white" : "text-dark"}>{customer.lastPurchase || "N/A"}</td>
                        <td>
                          <div className="d-flex gap-2">
                            <button
                              className={`btn btn-outline-primary btn-sm ${theme === "dark" ? "text-white border-light" : "text-dark border-dark"}`}
                              onClick={() => editCustomer(customer)}
                              disabled={loading}
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              className={`btn btn-outline-danger btn-sm ${theme === "dark" ? "text-white border-light" : "text-dark border-dark"}`}
                              onClick={() => deleteCustomer(customer._id)}
                              disabled={loading}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-4">
                <button
                  className={`btn btn-outline-secondary ${theme === "dark" ? "text-white border-light" : "text-dark border-dark"}`}
                  onClick={handlePrevPage}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </button>
                <span className={theme === "dark" ? "text-white" : "text-dark"}>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className={`btn btn-outline-secondary ${theme === "dark" ? "text-white border-light" : "text-dark border-dark"}`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || loading}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerManagement;