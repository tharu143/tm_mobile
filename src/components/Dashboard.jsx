import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { DollarSign, Users, AlertTriangle, TrendingUp, ShoppingCart, Eye, Phone } from "lucide-react";
import Chart from 'chart.js/auto';

const Dashboard = ({ theme }) => {
  const [stats, setStats] = useState({
    todaySales: 0,
    totalCustomers: 0,
    lowStockItems: 0,
    totalRevenue: 0,
  });
  const [recentSales, setRecentSales] = useState([]);
  const [allTodaySales, setAllTodaySales] = useState([]);
  const [allSales, setAllSales] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [stockInputs, setStockInputs] = useState({});
  const [minStockInputs, setMinStockInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllSales, setShowAllSales] = useState(false);
  const [salesChartData, setSalesChartData] = useState(null);
  const [inventoryChartData, setInventoryChartData] = useState(null);

  const salesChartRef = useRef(null);
  const inventoryChartRef = useRef(null);

  // Fetch dashboard data from backend
  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      const statsResponse = await axios.get("http://localhost:5000/api/dashboard/stats");
      setStats(statsResponse.data);

      const salesResponse = await axios.get("http://localhost:5000/api/sales");
      setAllSales(salesResponse.data);
      const today = new Date().toISOString().split("T")[0];
      const todaySales = salesResponse.data.filter((sale) => {
        const saleDate = new Date(sale.timestamp).toISOString().split("T")[0];
        return saleDate === today;
      });
      setAllTodaySales(todaySales);
      setRecentSales(todaySales.slice(0, 3));

      const lowStockResponse = await axios.get("http://localhost:5000/api/dashboard/low-stock");
      setLowStockItems(lowStockResponse.data);

      const initialStockInputs = {};
      const initialMinStockInputs = {};
      lowStockResponse.data.forEach(item => {
        initialStockInputs[item._id] = '';
        initialMinStockInputs[item._id] = item.minStock.toString();
      });
      setStockInputs(initialStockInputs);
      setMinStockInputs(initialMinStockInputs);

      const customersResponse = await axios.get("http://localhost:5000/api/customers");
      setStats((prevStats) => ({
        ...prevStats,
        totalCustomers: customersResponse.data.length,
      }));

      const todayDate = new Date();
      const sevenDaysAgo = new Date(todayDate.getTime() - 7 * 24 * 60 * 60 * 1000);
      const salesLast7Days = salesResponse.data.filter(sale => new Date(sale.timestamp) >= sevenDaysAgo);
      const labels = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date(todayDate.getTime() - i * 24 * 60 * 60 * 1000);
        labels.push(date.toISOString().split('T')[0]);
      }
      const data = labels.map(label => {
        const dailySales = salesLast7Days.filter(sale => sale.timestamp.split('T')[0] === label);
        return dailySales.reduce((sum, sale) => sum + sale.total, 0);
      });
      setSalesChartData({
        labels: labels,
        datasets: [{
          label: 'Sales',
          data: data,
          borderColor: theme === "light" ? '#007bff' : '#ffffff', // White line in dark theme
          backgroundColor: theme === "light" ? 'rgba(0, 123, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)',
          fill: true,
          tension: 0.4,
        }]
      });

      const inventoryLabels = lowStockResponse.data.map(item => item.name);
      const inventoryData = lowStockResponse.data.map(item => item.stock);
      const backgroundColors = [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
      ];
      const borderColors = backgroundColors.map(color => color.replace('0.6', '1'));
      setInventoryChartData({
        labels: inventoryLabels,
        datasets: [{
          label: 'Stock Level',
          data: inventoryData,
          backgroundColor: backgroundColors.slice(0, inventoryLabels.length),
          borderColor: borderColors.slice(0, inventoryLabels.length),
          borderWidth: 1
        }]
      });

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch dashboard data");
      setLoading(false);
      console.error("Error fetching dashboard data:", err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (salesChartData) {
      const ctx = document.getElementById('salesChart').getContext('2d');
      if (salesChartRef.current) {
        salesChartRef.current.destroy();
      }
      salesChartRef.current = new Chart(ctx, {
        type: 'line',
        data: salesChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { 
              position: 'top',
              labels: {
                color: theme === "light" ? "#1f2937" : "#ffffff"
              }
            },
            title: { 
              display: true, 
              text: 'Sales Trend (Last 7 Days)', 
              font: { size: 16 },
              color: theme === "light" ? "#1f2937" : "#ffffff"
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { 
                display: true, 
                text: 'Sales Amount (₹)',
                color: theme === "light" ? "#1f2937" : "#ffffff"
              },
              ticks: {
                color: theme === "light" ? "#6b7280" : "#ffffff" // White ticks in dark theme
              },
              grid: {
                color: theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"
              }
            },
            x: {
              title: { 
                display: true, 
                text: 'Date',
                color: theme === "light" ? "#1f2937" : "#ffffff"
              },
              ticks: {
                color: theme === "light" ? "#6b7280" : "#ffffff" // White ticks in dark theme
              },
              grid: {
                color: theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)"
              }
            }
          }
        }
      });
    }
  }, [salesChartData, theme]);

  useEffect(() => {
    if (inventoryChartData) {
      const ctx = document.getElementById('inventoryChart').getContext('2d');
      if (inventoryChartRef.current) {
        inventoryChartRef.current.destroy();
      }
      inventoryChartRef.current = new Chart(ctx, {
        type: 'pie',
        data: inventoryChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'right',
              labels: {
                boxWidth: 20,
                padding: 20,
                color: theme === "light" ? "#1f2937" : "#ffffff",
                generateLabels: function(chart) {
                  const data = chart.data;
                  if (data.labels.length && data.datasets.length) {
                    return data.labels.map((label, i) => {
                      const value = data.datasets[0].data[i];
                      const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                      const percentage = ((value / total) * 100).toFixed(1);
                      return {
                        text: `${label} (${percentage}%)`,
                        fillStyle: data.datasets[0].backgroundColor[i],
                        hidden: isNaN(value) || value === 0,
                        index: i
                      };
                    });
                  }
                  return [];
                }
              }
            },
            title: {
              display: true,
              text: 'Low Stock Items Distribution',
              font: { size: 16 },
              color: theme === "light" ? "#1f2937" : "#ffffff"
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed || 0;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${label}: ${value} units (${percentage}%)`;
                }
              },
              backgroundColor: theme === "light" ? "#1f2937" : "#ffffff",
              titleColor: theme === "light" ? "#ffffff" : "#1f2937",
              bodyColor: theme === "light" ? "#ffffff" : "#1f2937"
            }
          }
        }
      });
    }
  }, [inventoryChartData, theme]);

  const handleViewAll = () => {
    setRecentSales(allTodaySales);
    setShowAllSales(true);
  };

  const handleShowLess = () => {
    setRecentSales(allTodaySales.slice(0, 3));
    setShowAllSales(false);
  };

  const handleStockInputChange = (itemId, value) => {
    setStockInputs(prev => ({ ...prev, [itemId]: value }));
  };

  const handleMinStockInputChange = (itemId, value) => {
    setMinStockInputs(prev => ({ ...prev, [itemId]: value }));
  };

  const handleManualRestock = async () => {
    try {
      const restockData = Object.entries(stockInputs)
        .filter(([_, quantity]) => quantity !== '' && !isNaN(quantity) && parseInt(quantity) > 0)
        .map(([itemId, quantity]) => ({
          itemId,
          quantity: parseInt(quantity),
          minStock: parseInt(minStockInputs[itemId]) || undefined
        }));

      if (restockData.length === 0) {
        alert("Please enter valid quantities for at least one item.");
        return;
      }

      const response = await axios.post("http://localhost:5000/api/dashboard/restock-manual", { items: restockData });
      alert(response.data.message);
      fetchDashboardData();
    } catch (err) {
      console.error("Error restocking items:", err);
      alert("Failed to restock items: " + (err.response?.data?.error || "An unexpected error occurred"));
    }
  };

  const handleAutoRestock = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/dashboard/restock");
      alert(response.data.message);
      fetchDashboardData();
    } catch (err) {
      console.error("Error restocking items:", err);
      alert("Failed to restock items: " + (err.response?.data?.error || "An unexpected error occurred"));
    }
  };

  if (loading) {
    return <div className="text-center py-5">Loading dashboard...</div>;
  }

  if (error) {
    return <div className="text-center py-5 text-danger">{error}</div>;
  }

  return (
    <div className={`container-fluid p-4 ${theme === "light" ? "bg-light" : "bg-dark text-white"}`}>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h1 className="h3 fw-bold">Dashboard</h1>
          <p className={theme === "light" ? "text-muted" : "text-light"}>Welcome back! Here's what's happening at your shop today.</p>
        </div>
        <div className={`d-flex align-items-center ${theme === "light" ? "text-muted" : "text-light"} small`}>
          <Phone size={16} className="me-2" />
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-3 col-md-6">
          <div className={`card shadow-sm h-100 ${theme === "light" ? "bg-white" : "bg-dark border-light"}`}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div className="p-2 rounded bg-success bg-opacity-10 me-3">
                    <DollarSign size={20} className="text-success" />
                  </div>
                  <div>
                    <p className={theme === "light" ? "text-muted small mb-1" : "text-white small mb-1"}>Today's Sales</p>
                    <h5 className={`fw-bold mb-0 ${theme === "light" ? "text-dark" : "text-white"}`}>₹{stats.todaySales.toLocaleString()}</h5>
                  </div>
                </div>
                <span className={`badge bg-success bg-opacity-10 ${theme === "light" ? "text-success" : "text-white"}`}>+12%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className={`card shadow-sm h-100 ${theme === "light" ? "bg-white" : "bg-dark border-light"}`}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div className="p-2 rounded bg-primary bg-opacity-10 me-3">
                    <Users size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className={theme === "light" ? "text-muted small mb-1" : "text-white small mb-1"}>Total Customers</p>
                    <h5 className={`fw-bold mb-0 ${theme === "light" ? "text-dark" : "text-white"}`}>{stats.totalCustomers}</h5>
                  </div>
                </div>
                <span className={`badge bg-primary bg-opacity-10 ${theme === "light" ? "text-primary" : "text-white"}`}>+5%</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className={`card shadow-sm h-100 ${theme === "light" ? "bg-white" : "bg-dark border-light"}`}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div className="p-2 rounded bg-danger bg-opacity-10 me-3">
                    <AlertTriangle size={20} className="text-danger" />
                  </div>
                  <div>
                    <p className={theme === "light" ? "text-muted small mb-1" : "text-white small mb-1"}>Low Stock Items</p>
                    <h5 className={`fw-bold mb-0 ${theme === "light" ? "text-dark" : "text-white"}`}>{stats.lowStockItems}</h5>
                  </div>
                </div>
                <span className={`badge ${theme === "light" ? "bg-danger text-white" : "bg-danger text-white"}`}>Alert</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <div className={`card shadow-sm h-100 ${theme === "light" ? "bg-white" : "bg-dark border-light"}`}>
            <div className="card-body p-4">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div className="p-2 rounded me-3" style={{ backgroundColor: "rgba(128, 0, 128, 0.1)" }}>
                    <TrendingUp size={20} style={{ color: "purple" }} />
                  </div>
                  <div>
                    <p className={theme === "light" ? "text-muted small mb-1" : "text-white small mb-1"}>Total Revenue</p>
                    <h5 className={`fw-bold mb-0 ${theme === "light" ? "text-dark" : "text-white"}`}>₹{stats.totalRevenue.toLocaleString()}</h5>
                  </div>
                </div>
                <span className={`badge ${theme === "light" ? "text-purple" : "text-white"}`} style={{ backgroundColor: "rgba(128, 0, 128, 0.1)" }}>+8%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className={`card shadow-sm ${theme === "light" ? "bg-white" : "bg-dark border-light"}`}>
            <div className={`card-header border-bottom d-flex align-items-center justify-content-between ${theme === "light" ? "bg-white" : "bg-dark"}`}>
              <h5 className={`mb-0 d-flex align-items-center ${theme === "light" ? "text-dark" : "text-white"}`}>
                <ShoppingCart size={20} className="me-2" />
                Recent Sales
              </h5>
              {allTodaySales.length > 3 && (
                <button className={`btn btn-outline-primary btn-sm ${theme === "light" ? "" : "text-light border-light"}`} onClick={showAllSales ? handleShowLess : handleViewAll}>
                  {showAllSales ? "Show Less" : "View All"}
                </button>
              )}
            </div>
            <div className="card-body p-4">
              {recentSales.length === 0 ? (
                <p className={theme === "light" ? "text-center text-muted" : "text-center text-white"}>No sales today</p>
              ) : (
                <div className="table-responsive">
                  <table className={`table table-hover ${theme === "light" ? "" : "table-dark"}`}>
                    <thead>
                      <tr>
                        <th className={theme === "light" ? "text-dark" : "text-white"}>Invoice ID</th>
                        <th className={theme === "light" ? "text-dark" : "text-white"}>Date</th>
                        <th className={theme === "light" ? "text-dark" : "text-white"}>Customer</th>
                        <th className={theme === "light" ? "text-dark" : "text-white"}>Product</th>
                        <th className={theme === "light" ? "text-dark" : "text-white"}>Quantity</th>
                        <th className={theme === "light" ? "text-dark" : "text-white"}>Amount</th>
                        <th className={theme === "light" ? "text-dark" : "text-white"}>Grand Total</th>
                        <th className={theme === "light" ? "text-dark" : "text-white"}>Payment</th>
                        <th className={theme === "light" ? "text-dark" : "text-white"}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentSales.map((sale) => (
                        <tr
                          key={sale._id}
                          style={{ transition: "background-color 0.2s" }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = theme === "light" ? "#f8f9fa" : "#4b5563")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = theme === "light" ? "white" : "#343a40")}
                        >
                          <td className={`fw-medium ${theme === "light" ? "text-dark" : "text-white"}`}>{sale.invoiceId}</td>
                          <td className={theme === "light" ? "text-dark" : "text-white"}>{new Date(sale.timestamp).toLocaleDateString()}</td>
                          <td className={theme === "light" ? "text-dark" : "text-white"}>{sale.customer?.name || "N/A"}</td>
                          <td className={theme === "light" ? "text-dark" : "text-white"}>
                            {sale.items.map((item, index) => (
                              <div key={index}>
                                {item.name} (₹{item.price.toLocaleString()} x {item.quantity})
                              </div>
                            ))}
                          </td>
                          <td className={theme === "light" ? "text-dark" : "text-white"}>{sale.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                          <td className={theme === "light" ? "text-dark" : "text-white"}>₹{sale.subtotal.toLocaleString()}</td>
                          <td className={theme === "light" ? "text-dark" : "text-white"}>₹{sale.total.toLocaleString()}</td>
                          <td>
                            <span
                              className={`badge ${
                                sale.paymentMethod === "cash"
                                  ? "bg-success bg-opacity-10 text-success"
                                  : "bg-secondary bg-opacity-10 text-secondary"
                              }`}
                            >
                              {sale.paymentMethod}
                            </span>
                          </td>
                          <td>
                            <button className={`btn btn-outline-secondary btn-sm ${theme === "light" ? "" : "text-light border-light"}`}>
                              <Eye size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className={`card shadow-sm ${theme === "light" ? "bg-white" : "bg-dark border-light"}`}>
            <div className={`card-header border-bottom ${theme === "light" ? "bg-white" : "bg-dark"}`}>
              <h5 className={`mb-0 d-flex align-items-center ${theme === "light" ? "text-warning" : "text-warning"}`}>
                <AlertTriangle size={20} className="me-2" />
                Inventory Alerts
              </h5>
            </div>
            <div className="card-body p-4">
              {lowStockItems.length === 0 ? (
                <p className={theme === "light" ? "text-center text-muted" : "text-center text-white"}>No low stock items</p>
              ) : (
                lowStockItems.map((item) => (
                  <div key={item._id} className={`d-flex align-items-center justify-content-between p-3 border rounded mb-3 ${theme === "light" ? "border-light" : "border-dark"}`}>
                    <div className="d-flex align-items-center">
                      {item.image && (
                        <img
                          src={`http://localhost:5000${item.image}`}
                          alt={item.name}
                          style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "0.25rem", marginRight: "0.75rem" }}
                        />
                      )}
                      <div>
                        <p className={`fw-medium mb-1 ${theme === "light" ? "text-dark" : "text-white"}`}>{item.name}</p>
                        <p className={theme === "light" ? "text-muted small mb-1" : "text-white small mb-1"}>
                          Units: {item.stock} left
                        </p>
                        <div className="d-flex align-items-center">
                          <input
                            type="number"
                            className={`form-control form-control-sm me-2 ${theme === "light" ? "" : "bg-dark text-white border-light"}`}
                            style={{ width: "80px" }}
                            placeholder="Restock Qty"
                            value={stockInputs[item._id] || ''}
                            onChange={(e) => handleStockInputChange(item._id, e.target.value)}
                            min="0"
                          />
                          <input
                            type="number"
                            className={`form-control form-control-sm ${theme === "light" ? "" : "bg-dark text-white border-light"}`}
                            style={{ width: "80px" }}
                            placeholder="Min Stock"
                            value={minStockInputs[item._id] || item.minStock}
                            onChange={(e) => handleMinStockInputChange(item._id, e.target.value)}
                            min="1"
                          />
                        </div>
                      </div>
                    </div>
                    <span className={`badge ${item.stock === 0 ? "bg-danger text-white" : "bg-warning text-dark"}`}>
                      {item.stock === 0 ? "Out of Stock" : "Low Stock"}
                    </span>
                  </div>
                ))
              )}
              <div className="d-flex justify-content-between">
                <button className={`btn btn-outline-primary w-100 me-2 mt-3 ${theme === "light" ? "" : "text-light border-light"}`} onClick={handleManualRestock}>
                  Restock Selected
                </button>
                <button className={`btn btn-outline-secondary w-100 mt-3 ${theme === "light" ? "" : "text-light border-light"}`} onClick={handleAutoRestock}>
                  Auto Restock
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4 mt-4">
        <div className="col-lg-6">
          <div className={`card shadow-sm ${theme === "light" ? "bg-white" : "bg-dark border-light"}`}>
            <div className={`card-header border-bottom ${theme === "light" ? "bg-white" : "bg-dark"}`}>
              <h5 className={`mb-0 ${theme === "light" ? "text-dark" : "text-white"}`}>Sales Trend (Last 7 Days)</h5>
            </div>
            <div className="card-body">
              <canvas id="salesChart" style={{ height: '300px' }}></canvas>
            </div>
          </div>
        </div>
        <div className="col-lg-6">
          <div className={`card shadow-sm ${theme === "light" ? "bg-white" : "bg-dark border-light"}`}>
            <div className={`card-header border-bottom ${theme === "light" ? "bg-white" : "bg-dark"}`}>
              <h5 className={`mb-0 ${theme === "light" ? "text-dark" : "text-white"}`}>Low Stock Items Distribution</h5>
            </div>
            <div className="card-body">
              <canvas id="inventoryChart" style={{ height: '300px' }}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;