import { useState, useEffect } from "react";
import { Search, UserPlus, Edit, Trash2, Sun, Moon, Leaf, Grid } from "lucide-react";

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

const CustomerManagement = ({ theme, setTheme }) => {
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
  const [success, setSuccess] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const customersPerPage = 10;

  const themeStyles = {
    light: {
      bgColor: "hsl(240 20% 98%)",
      foreground: "hsl(220 25% 15%)",
      card: "#ffffff",
      cardForeground: "hsl(220 25% 15%)",
      primary: "hsl(217 91% 60%)",
      primaryForeground: "#ffffff",
      secondary: "hsl(210 40% 96%)",
      secondaryForeground: "hsl(220 25% 15%)",
      muted: "hsl(220 13% 95%)",
      mutedForeground: "hsl(220 9% 46%)",
      accent: "hsl(38 92% 50%)",
      accentForeground: "#ffffff",
      success: "hsl(120 60% 50%)",
      successForeground: "#ffffff",
      warning: "hsl(38 92% 50%)",
      warningForeground: "#ffffff",
      destructive: "hsl(0 84% 60%)",
      destructiveForeground: "#ffffff",
      border: "hsl(220 13% 91%)",
      input: "hsl(220 13% 91%)",
      ring: "hsl(217 91% 60%)",
      gradientPrimary: "linear-gradient(135deg, hsl(217 91% 60%), hsl(217 91% 70%))",
      shadowElegant: "0 4px 20px -2px hsla(217 91% 60% / 0.15)",
      shadowCard: "0 2px 10px -2px hsla(0 0% 0% / 0.1)",
      radius: "0.75rem",
      textColor: "hsl(220 25% 15%)",
      secondaryTextColor: "hsl(220 9% 46%)",
      cardBg: "#ffffff",
      borderColor: "hsl(220 13% 91%) / 50%",
      inputBg: "#ffffff",
      buttonBg: "hsl(217 91% 60%)",
      buttonText: "#ffffff",
      dropdownBg: "#ffffff",
    },
    dark: {
      bgColor: "hsl(240 10% 8%)",
      foreground: "#ffffff",
      card: "hsl(240 10% 12%)",
      cardForeground: "#ffffff",
      primary: "hsl(262 83% 58%)",
      primaryForeground: "#ffffff",
      secondary: "hsl(240 4% 16%)",
      secondaryForeground: "#ffffff",
      muted: "hsl(240 4% 16%)",
      mutedForeground: "hsl(240 5% 65%)",
      accent: "hsl(142 71% 45%)",
      accentForeground: "#ffffff",
      success: "hsl(120 60% 50%)",
      successForeground: "#ffffff",
      warning: "hsl(38 92% 50%)",
      warningForeground: "#ffffff",
      destructive: "hsl(0 84% 60%)",
      destructiveForeground: "#ffffff",
      border: "hsl(240 4% 16%)",
      input: "hsl(240 4% 16%)",
      ring: "hsl(262 83% 58%)",
      gradientPrimary: "linear-gradient(135deg, hsl(262 83% 58%), hsl(262 83% 68%))",
      shadowElegant: "0 4px 20px -2px hsla(262 83% 58% / 0.25)",
      shadowCard: "0 2px 10px -2px hsla(0 0% 0% / 0.3)",
      radius: "0.75rem",
      textColor: "#ffffff",
      secondaryTextColor: "hsl(240 5% 65%)",
      cardBg: "hsl(240 10% 12%)",
      borderColor: "hsl(240 4% 16%) / 50%",
      inputBg: "hsl(240 4% 16%)",
      buttonBg: "hsl(262 83% 58%)",
      buttonText: "#ffffff",
      dropdownBg: "hsl(240 10% 12%)",
    },
    nature: {
      bgColor: "#f0f7f4",
      foreground: "#1f2937",
      card: "#ffffff",
      cardForeground: "#1f2937",
      primary: "#4caf50",
      primaryForeground: "#ffffff",
      secondary: "#e8f5e9",
      secondaryForeground: "#1f2937",
      muted: "#e0f2f1",
      mutedForeground: "#4b5563",
      accent: "#ff9800",
      accentForeground: "#ffffff",
      success: "#4caf50",
      successForeground: "#ffffff",
      warning: "#ff9800",
      warningForeground: "#ffffff",
      destructive: "#f44336",
      destructiveForeground: "#ffffff",
      border: "#a7d4a0",
      input: "#ffffff",
      ring: "#4caf50",
      gradientPrimary: "linear-gradient(135deg, #4caf50, #66bb6a)",
      shadowElegant: "0 4px 20px -2px rgba(76,175,80,0.15)",
      shadowCard: "0 2px 10px -2px rgba(0,0,0,0.1)",
      radius: "0.75rem",
      textColor: "#1f2937",
      secondaryTextColor: "#4b5563",
      cardBg: "#ffffff",
      borderColor: "#a7d4a0 / 50%",
      inputBg: "#ffffff",
      buttonBg: "#4caf50",
      buttonText: "#ffffff",
      dropdownBg: "#ffffff",
    },
    sunset: {
      bgColor: "#fff7ed",
      foreground: "#1f2937",
      card: "#ffffff",
      cardForeground: "#1f2937",
      primary: "#ff9800",
      primaryForeground: "#ffffff",
      secondary: "#ffedd5",
      secondaryForeground: "#1f2937",
      muted: "#ffe7ba",
      mutedForeground: "#4b5563",
      accent: "#ff5722",
      accentForeground: "#ffffff",
      success: "#4caf50",
      successForeground: "#ffffff",
      warning: "#ff9800",
      warningForeground: "#ffffff",
      destructive: "#f44336",
      destructiveForeground: "#ffffff",
      border: "#fdba74",
      input: "#ffffff",
      ring: "#ff9800",
      gradientPrimary: "linear-gradient(135deg, #ff9800, #ffb74d)",
      shadowElegant: "0 4px 20px -2px rgba(255,152,0,0.15)",
      shadowCard: "0 2px 10px -2px rgba(0,0,0,0.1)",
      radius: "0.75rem",
      textColor: "#1f2937",
      secondaryTextColor: "#4b5563",
      cardBg: "#ffffff",
      borderColor: "#fdba74 / 50%",
      inputBg: "#ffffff",
      buttonBg: "#ff9800",
      buttonText: "#ffffff",
      dropdownBg: "#ffffff",
    },
  };

  const styles = themeStyles[theme] || themeStyles.light;

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
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
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
      setSuccess(editingCustomer ? "Customer updated successfully" : "Customer added successfully");
      resetForm();
    } catch (err) {
      setError(err.message);
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
    setSuccess(null);
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
    setSuccess(null);
  };

  const deleteCustomer = async (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        setCustomers(customers.filter((c) => c._id !== id));
        setSuccess("Customer deleted successfully");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  const themeOptions = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "nature", label: "Nature", icon: Leaf },
    { id: "sunset", label: "Sunset", icon: Grid },
  ];

  const selectedTheme = themeOptions.find(t => t.id === theme) || themeOptions[0];

  return (
    <div style={{ backgroundColor: styles.bgColor, color: styles.foreground, minHeight: "100vh", padding: "1rem" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: "700", color: styles.textColor }}>Customer Management</h1>
          <p style={{ fontSize: "0.875rem", color: styles.secondaryTextColor, marginBottom: "0.5rem" }}>Manage your customer database</p>
        </div>
        <div style={{ position: "relative", width: "100%", maxWidth: "200px" }}>
          <div
            onClick={() => setShowThemeDropdown(!showThemeDropdown)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: styles.card,
              color: styles.primary,
              border: `1px solid ${styles.border}`,
              borderRadius: styles.radius,
              cursor: "pointer",
              fontWeight: "500",
              transition: "all 0.2s ease-in-out"
            }}
          >
            {selectedTheme && <selectedTheme.icon size={16} />}
            {selectedTheme && selectedTheme.label}
          </div>
          {showThemeDropdown && (
            <div style={{
              position: "absolute",
              right: 0,
              top: "100%",
              backgroundColor: styles.dropdownBg,
              border: `1px solid ${styles.border}`,
              borderRadius: styles.radius,
              marginTop: "0.5rem",
              zIndex: 10,
              width: "100%"
            }}>
              {themeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => { setTheme(option.id); setShowThemeDropdown(false); }}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.5rem",
                    backgroundColor: theme === option.id ? styles.primary : "transparent",
                    color: theme === option.id ? styles.primaryForeground : styles.foreground,
                    border: "none",
                    borderRadius: styles.radius,
                    cursor: "pointer",
                    textAlign: "left",
                    width: "100%"
                  }}
                >
                  <option.icon size={16} />
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1rem" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search style={{ position: "absolute", left: "0.75rem", top: "0.75rem", color: styles.mutedForeground }} size={16} />
          <input
            type="text"
            placeholder="Search customers by name, phone, email, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={loading}
            style={{
              paddingLeft: "2.5rem",
              width: "100%",
              padding: "0.5rem",
              border: `1px solid ${styles.border}`,
              borderRadius: styles.radius,
              backgroundColor: styles.input,
              color: styles.foreground
            }}
          />
        </div>
        <button
          onClick={addCustomer}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.5rem 1rem",
            background: styles.gradientPrimary,
            color: styles.buttonText,
            border: "none",
            borderRadius: styles.radius,
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = styles.gradientAccent;
            e.currentTarget.style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = styles.gradientPrimary;
            e.currentTarget.style.transform = "translateY(0)";
          }}
        >
          <UserPlus size={16} /> Add Customer
        </button>
      </div>
      {error && (
        <div style={{
          backgroundColor: styles.destructive,
          color: styles.destructiveForeground,
          padding: "1rem",
          borderRadius: styles.radius,
          marginBottom: "1rem"
        }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{
          backgroundColor: styles.success,
          color: styles.successForeground,
          padding: "1rem",
          borderRadius: styles.radius,
          marginBottom: "1rem"
        }}>
          {success}
        </div>
      )}
      {showAddForm && (
        <div style={{ backgroundColor: styles.cardBg, padding: "1rem", borderRadius: styles.radius, boxShadow: styles.shadowCard, marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "1rem", color: styles.textColor }}>
            {editingCustomer ? "Edit Customer" : "Add New Customer"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))", gap: "0.75rem" }}>
              <div>
                <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor, fontSize: "0.875rem" }}>Customer Name *</label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: `1px solid ${styles.border}`,
                    borderRadius: styles.radius,
                    fontSize: "0.875rem",
                    backgroundColor: styles.input,
                    color: styles.foreground
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor, fontSize: "0.875rem" }}>Phone Number *</label>
                <input
                  type="text"
                  placeholder="+91 9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: `1px solid ${styles.border}`,
                    borderRadius: styles.radius,
                    fontSize: "0.875rem",
                    backgroundColor: styles.input,
                    color: styles.foreground
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor, fontSize: "0.875rem" }}>Email</label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: `1px solid ${styles.border}`,
                    borderRadius: styles.radius,
                    fontSize: "0.875rem",
                    backgroundColor: styles.input,
                    color: styles.foreground
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor, fontSize: "0.875rem" }}>Date of Birth</label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: `1px solid ${styles.border}`,
                    borderRadius: styles.radius,
                    fontSize: "0.875rem",
                    backgroundColor: styles.input,
                    color: styles.foreground
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor, fontSize: "0.875rem" }}>City</label>
                <input
                  type="text"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: `1px solid ${styles.border}`,
                    borderRadius: styles.radius,
                    fontSize: "0.875rem",
                    backgroundColor: styles.input,
                    color: styles.foreground
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor, fontSize: "0.875rem" }}>Pincode</label>
                <input
                  type="text"
                  placeholder="600017"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: `1px solid ${styles.border}`,
                    borderRadius: styles.radius,
                    fontSize: "0.875rem",
                    backgroundColor: styles.input,
                    color: styles.foreground
                  }}
                />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor, fontSize: "0.875rem" }}>Address</label>
                <input
                  type="text"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "0.5rem",
                    border: `1px solid ${styles.border}`,
                    borderRadius: styles.radius,
                    fontSize: "0.875rem",
                    backgroundColor: styles.input,
                    color: styles.foreground
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem", flexWrap: "wrap" }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: styles.buttonBg,
                  color: styles.buttonText,
                  border: "none",
                  borderRadius: styles.radius,
                  cursor: "pointer",
                  minWidth: "120px"
                }}
              >
                {loading ? "Processing..." : (editingCustomer ? "Update Customer" : "Add Customer")}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={loading}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: styles.secondary,
                  color: styles.secondaryForeground,
                  border: "none",
                  borderRadius: styles.radius,
                  cursor: "pointer",
                  minWidth: "120px"
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      <div style={{ backgroundColor: styles.cardBg, borderRadius: styles.radius, boxShadow: styles.shadowCard }}>
        <div style={{ padding: "1rem", borderBottom: `1px solid ${styles.border}`, fontSize: "1.125rem", fontWeight: "600", color: styles.textColor }}>
          Customer List
        </div>
        <div style={{ padding: "1rem" }}>
          {loading && <p style={{ textAlign: "center", color: styles.textColor }}>Loading...</p>}
          {!loading && filteredCustomers.length === 0 ? (
            <p style={{ textAlign: "center", color: styles.mutedForeground }}>No customers found</p>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "800px" }}>
                  <thead>
                    <tr>
                      {["Name", "Phone", "Email", "Address", "City", "Pincode", "Date of Birth", "Purchases", "Total (₹)", "Last Purchase", "Actions"].map((header) => (
                        <th key={header} style={{ padding: "0.5rem", textAlign: "left", color: styles.textColor, borderBottom: `1px solid ${styles.border}`, fontSize: "0.875rem" }}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentCustomers.map((customer) => (
                      <tr key={customer._id}>
                        <td style={{ padding: "0.5rem", color: styles.textColor, fontSize: "0.875rem" }}>{customer.name}</td>
                        <td style={{ padding: "0.5rem", color: styles.textColor, fontSize: "0.875rem" }}>{customer.phone}</td>
                        <td style={{ padding: "0.5rem", color: styles.textColor, fontSize: "0.875rem" }}>{customer.email}</td>
                        <td style={{ padding: "0.5rem", color: styles.textColor, fontSize: "0.875rem" }}>{customer.address}</td>
                        <td style={{ padding: "0.5rem", color: styles.textColor, fontSize: "0.875rem" }}>{customer.city}</td>
                        <td style={{ padding: "0.5rem", color: styles.textColor, fontSize: "0.875rem" }}>{customer.pincode}</td>
                        <td style={{ padding: "0.5rem", color: styles.textColor, fontSize: "0.875rem" }}>{customer.dateOfBirth || "N/A"}</td>
                        <td style={{ padding: "0.5rem", color: styles.textColor, fontSize: "0.875rem" }}>{customer.purchases}</td>
                        <td style={{ padding: "0.5rem", color: styles.textColor, fontSize: "0.875rem" }}>{customer.totalPurchases.toLocaleString()}</td>
                        <td style={{ padding: "0.5rem", color: styles.textColor, fontSize: "0.875rem" }}>{customer.lastPurchase || "N/A"}</td>
                        <td style={{ padding: "0.5rem" }}>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              onClick={() => editCustomer(customer)}
                              disabled={loading}
                              style={{
                                padding: "0.25rem 0.5rem",
                                backgroundColor: styles.primary,
                                color: styles.primaryForeground,
                                border: "none",
                                borderRadius: styles.radius
                              }}
                            >
                              <Edit size={14} />
                            </button>
                            <button
                              onClick={() => deleteCustomer(customer._id)}
                              disabled={loading}
                              style={{
                                padding: "0.25rem 0.5rem",
                                backgroundColor: styles.destructive,
                                color: styles.destructiveForeground,
                                border: "none",
                                borderRadius: styles.radius
                              }}
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1 || loading}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: styles.primary,
                    color: styles.primaryForeground,
                    border: "none",
                    borderRadius: styles.radius,
                    cursor: "pointer",
                    minWidth: "100px"
                  }}
                >
                  Previous
                </button>
                <span style={{ color: styles.textColor, fontSize: "0.875rem" }}>Page {currentPage} of {totalPages}</span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || loading}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: styles.primary,
                    color: styles.primaryForeground,
                    border: "none",
                    borderRadius: styles.radius,
                    cursor: "pointer",
                    minWidth: "100px"
                  }}
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