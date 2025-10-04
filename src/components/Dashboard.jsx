import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { DollarSign, Users, AlertTriangle, TrendingUp, ShoppingCart, Eye, Phone, Sun, Moon, Leaf, Grid } from "lucide-react";
import Chart from 'chart.js/auto';

const Dashboard = ({ theme, setTheme }) => {
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
  const [message, setMessage] = useState(null);
  const [showAllSales, setShowAllSales] = useState(false);
  const [salesChartData, setSalesChartData] = useState(null);
  const [inventoryChartData, setInventoryChartData] = useState(null);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);

  const salesChartRef = useRef(null);
  const inventoryChartRef = useRef(null);

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
      gradientAccent: "linear-gradient(135deg, hsl(38 92% 50%), hsl(45 92% 60%))",
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
      buttonOutlineBg: "hsl(210 40% 96%)",
      buttonOutlineText: "hsl(220 25% 15%)",
      dropdownBg: "#ffffff",
      disabledBg: "hsl(220 13% 95%)",
      shadow: "0 1px 3px rgba(0,0,0,0.1)",
      popupBg: "#ffffff",
      inputReadOnlyBg: "hsl(220 13% 95%)",
      placeholderImageBg: "hsl(220 13% 95%)",
      placeholderImageText: "hsl(220 9% 46%)",
      statusSuccess: "hsl(120 60% 50%)",
      statusWarning: "hsl(38 92% 50%)",
      statusDestructive: "hsl(0 84% 60%)",
      cardHoverShadow: "0 4px 20px -2px hsla(217 91% 60% / 0.15)",
      cardHoverTransform: "translateY(-2px)",
      btnGradientBg: "linear-gradient(135deg, hsl(217 91% 60%), hsl(217 91% 70%))",
      btnGradientHoverBg: "linear-gradient(135deg, hsl(38 92% 50%), hsl(45 92% 60%))",
      btnGradientHoverTransform: "translateY(-1px)",
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
      gradientAccent: "linear-gradient(135deg, hsl(142 71% 45%), hsl(142 71% 55%))",
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
      buttonOutlineBg: "hsl(240 4% 16%)",
      buttonOutlineText: "#ffffff",
      dropdownBg: "hsl(240 10% 12%)",
      disabledBg: "hsl(240 4% 16%)",
      shadow: "0 1px 3px rgba(0,0,0,0.3)",
      popupBg: "hsl(240 10% 12%)",
      inputReadOnlyBg: "hsl(240 4% 16%)",
      placeholderImageBg: "hsl(240 4% 16%)",
      placeholderImageText: "hsl(240 5% 65%)",
      statusSuccess: "hsl(120 60% 50%)",
      statusWarning: "hsl(38 92% 50%)",
      statusDestructive: "hsl(0 84% 60%)",
      cardHoverShadow: "0 4px 20px -2px hsla(262 83% 58% / 0.25)",
      cardHoverTransform: "translateY(-2px)",
      btnGradientBg: "linear-gradient(135deg, hsl(262 83% 58%), hsl(262 83% 68%))",
      btnGradientHoverBg: "linear-gradient(135deg, hsl(142 71% 45%), hsl(142 71% 55%))",
      btnGradientHoverTransform: "translateY(-1px)",
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
      gradientAccent: "linear-gradient(135deg, #ff9800, #ffb74d)",
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
      buttonOutlineBg: "#e8f5e9",
      buttonOutlineText: "#1f2937",
      dropdownBg: "#ffffff",
      disabledBg: "#e0f2f1",
      shadow: "0 1px 3px rgba(0,0,0,0.1)",
      popupBg: "#ffffff",
      inputReadOnlyBg: "#e0f2f1",
      placeholderImageBg: "#e0f2f1",
      placeholderImageText: "#4b5563",
      statusSuccess: "#4caf50",
      statusWarning: "#ff9800",
      statusDestructive: "#f44336",
      cardHoverShadow: "0 4px 20px -2px rgba(76,175,80,0.15)",
      cardHoverTransform: "translateY(-2px)",
      btnGradientBg: "linear-gradient(135deg, #4caf50, #66bb6a)",
      btnGradientHoverBg: "linear-gradient(135deg, #ff9800, #ffb74d)",
      btnGradientHoverTransform: "translateY(-1px)",
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
      gradientAccent: "linear-gradient(135deg, #ff5722, #ff8a65)",
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
      buttonOutlineBg: "#ffedd5",
      buttonOutlineText: "#1f2937",
      dropdownBg: "#ffffff",
      disabledBg: "#ffe7ba",
      shadow: "0 1px 3px rgba(0,0,0,0.1)",
      popupBg: "#ffffff",
      inputReadOnlyBg: "#ffe7ba",
      placeholderImageBg: "#ffe7ba",
      placeholderImageText: "#4b5563",
      statusSuccess: "#4caf50",
      statusWarning: "#ff9800",
      statusDestructive: "#f44336",
      cardHoverShadow: "0 4px 20px -2px rgba(255,152,0,0.15)",
      cardHoverTransform: "translateY(-2px)",
      btnGradientBg: "linear-gradient(135deg, #ff9800, #ffb74d)",
      btnGradientHoverBg: "linear-gradient(135deg, #ff5722, #ff8a65)",
      btnGradientHoverTransform: "translateY(-1px)",
    },
  };

  const styles = themeStyles[theme] || themeStyles.light;

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
          borderColor: styles.primary,
          backgroundColor: styles.primary.replace('hsl', 'hsla').replace(')', ', 0.1)'),
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
                color: styles.textColor
              }
            },
            title: { 
              display: true, 
              text: 'Sales Trend (Last 7 Days)', 
              font: { size: 16 },
              color: styles.textColor
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { 
                display: true, 
                text: 'Sales Amount (₹)',
                color: styles.textColor
              },
              ticks: {
                color: styles.secondaryTextColor
              },
              grid: {
                color: styles.borderColor
              }
            },
            x: {
              title: { 
                display: true, 
                text: 'Date',
                color: styles.textColor
              },
              ticks: {
                color: styles.secondaryTextColor
              },
              grid: {
                color: styles.borderColor
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
                color: styles.textColor,
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
              color: styles.textColor
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
              backgroundColor: styles.cardBg,
              titleColor: styles.textColor,
              bodyColor: styles.textColor
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
        setError("Please enter valid quantities for at least one item.");
        return;
      }

      const response = await axios.post("http://localhost:5000/api/dashboard/restock-manual", { items: restockData });
      setMessage(response.data.message);
      fetchDashboardData();
    } catch (err) {
      console.error("Error restocking items:", err);
      setError("Failed to restock items: " + (err.response?.data?.error || "An unexpected error occurred"));
    }
  };

  const handleAutoRestock = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/dashboard/restock");
      setMessage(response.data.message);
      fetchDashboardData();
    } catch (err) {
      console.error("Error restocking items:", err);
      setError("Failed to restock items: " + (err.response?.data?.error || "An unexpected error occurred"));
    }
  };

  const themeOptions = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "nature", label: "Nature", icon: Leaf },
    { id: "sunset", label: "Sunset", icon: Grid },
  ];

  const selectedTheme = themeOptions.find(t => t.id === theme) || themeOptions[0];

  if (loading) {
    return <div style={{ textAlign: "center", padding: "2rem", color: styles.textColor }}>Loading dashboard...</div>;
  }

  return (
    <div className="container-fluid" style={{ backgroundColor: styles.bgColor, color: styles.foreground, minHeight: "100vh", padding: "2rem" }}>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      <div className="row justify-content-between align-items-center mb-3">
        <div className="col-auto">
          <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: styles.textColor }}>Dashboard</h1>
          <p style={{ fontSize: "1rem", color: styles.secondaryTextColor }}>
            Welcome back! Here's what's happening at your shop today.
          </p>
        </div>
        <div className="col-auto d-flex align-items-center gap-3">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: styles.secondaryTextColor, fontSize: "0.875rem" }}>
            <Phone size={16} />
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <div style={{ position: "relative" }}>
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
                zIndex: 10 
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
                      textAlign: "left" 
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
      </div>

      <div className="row g-3 mb-4">
        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
          <div style={{ backgroundColor: styles.cardBg, borderRadius: styles.radius, boxShadow: styles.shadowCard, padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ padding: "0.5rem", borderRadius: "0.5rem", backgroundColor: styles.statusSuccess.replace('hsl', 'hsla').replace(')', ', 0.1)') }}>
                  <DollarSign size={20} style={{ color: styles.statusSuccess }} />
                </div>
                <div>
                  <p style={{ fontSize: "0.875rem", color: styles.secondaryTextColor, marginBottom: "0.25rem" }}>Today's Sales</p>
                  <h5 style={{ fontSize: "1.25rem", fontWeight: "700", color: styles.textColor, margin: 0 }}>₹{stats.todaySales.toLocaleString()}</h5>
                </div>
              </div>
              <span style={{ padding: "0.25rem 0.5rem", borderRadius: styles.radius, backgroundColor: styles.statusSuccess.replace('hsl', 'hsla').replace(')', ', 0.1)'), color: styles.statusSuccess }}>+12%</span>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
          <div style={{ backgroundColor: styles.cardBg, borderRadius: styles.radius, boxShadow: styles.shadowCard, padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ padding: "0.5rem", borderRadius: "0.5rem", backgroundColor: styles.primary.replace('hsl', 'hsla').replace(')', ', 0.1)') }}>
                  <Users size={20} style={{ color: styles.primary }} />
                </div>
                <div>
                  <p style={{ fontSize: "0.875rem", color: styles.secondaryTextColor, marginBottom: "0.25rem" }}>Total Customers</p>
                  <h5 style={{ fontSize: "1.25rem", fontWeight: "700", color: styles.textColor, margin: 0 }}>{stats.totalCustomers}</h5>
                </div>
              </div>
              <span style={{ padding: "0.25rem 0.5rem", borderRadius: styles.radius, backgroundColor: styles.primary.replace('hsl', 'hsla').replace(')', ', 0.1)'), color: styles.primary }}>+5%</span>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
          <div style={{ backgroundColor: styles.cardBg, borderRadius: styles.radius, boxShadow: styles.shadowCard, padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ padding: "0.5rem", borderRadius: "0.5rem", backgroundColor: styles.statusDestructive.replace('hsl', 'hsla').replace(')', ', 0.1)') }}>
                  <AlertTriangle size={20} style={{ color: styles.statusDestructive }} />
                </div>
                <div>
                  <p style={{ fontSize: "0.875rem", color: styles.secondaryTextColor, marginBottom: "0.25rem" }}>Low Stock Items</p>
                  <h5 style={{ fontSize: "1.25rem", fontWeight: "700", color: styles.textColor, margin: 0 }}>{stats.lowStockItems}</h5>
                </div>
              </div>
              <span style={{ padding: "0.25rem 0.5rem", borderRadius: styles.radius, backgroundColor: styles.statusDestructive, color: styles.destructiveForeground }}>Alert</span>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12">
          <div style={{ backgroundColor: styles.cardBg, borderRadius: styles.radius, boxShadow: styles.shadowCard, padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ padding: "0.5rem", borderRadius: "0.5rem", backgroundColor: styles.accent.replace('hsl', 'hsla').replace(')', ', 0.1)') }}>
                  <TrendingUp size={20} style={{ color: styles.accent }} />
                </div>
                <div>
                  <p style={{ fontSize: "0.875rem", color: styles.secondaryTextColor, marginBottom: "0.25rem" }}>Total Revenue</p>
                  <h5 style={{ fontSize: "1.25rem", fontWeight: "700", color: styles.textColor, margin: 0 }}>₹{stats.totalRevenue.toLocaleString()}</h5>
                </div>
              </div>
              <span style={{ padding: "0.25rem 0.5rem", borderRadius: styles.radius, backgroundColor: styles.accent.replace('hsl', 'hsla').replace(')', ', 0.1)'), color: styles.accent }}>+8%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        <div className="col-lg-8 col-md-12">
          <div style={{ backgroundColor: styles.cardBg, borderRadius: styles.radius, boxShadow: styles.shadowCard }}>
            <div style={{ padding: "1rem", borderBottom: `1px solid ${styles.border}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h5 style={{ fontSize: "1.25rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem", color: styles.textColor, margin: 0 }}>
                <ShoppingCart size={20} />
                Recent Sales
              </h5>
              {allTodaySales.length > 3 && (
                <button 
                  style={{ 
                    padding: "0.5rem 1rem", 
                    backgroundColor: styles.buttonOutlineBg, 
                    color: styles.buttonOutlineText, 
                    border: `1px solid ${styles.border}`, 
                    borderRadius: styles.radius, 
                    cursor: "pointer" 
                  }} 
                  onClick={showAllSales ? handleShowLess : handleViewAll}
                >
                  {showAllSales ? "Show Less" : "View All"}
                </button>
              )}
            </div>
            <div style={{ padding: "1rem" }}>
              {recentSales.length === 0 ? (
                <p style={{ textAlign: "center", color: styles.mutedForeground }}>No sales today</p>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover" style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                      <tr>
                        {["Invoice ID", "Date", "Customer", "Product", "Quantity", "Amount", "Grand Total", "Payment", "Actions"].map((header) => (
                          <th key={header} style={{ padding: "0.75rem", textAlign: "left", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentSales.map((sale) => (
                        <tr 
                          key={sale._id}
                          style={{ transition: "background-color 0.2s" }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.muted}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.cardBg}
                        >
                          <td style={{ padding: "0.75rem", color: styles.textColor, fontWeight: "500", borderBottom: `1px solid ${styles.border}` }}>{sale.invoiceId}</td>
                          <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>{new Date(sale.timestamp).toLocaleDateString()}</td>
                          <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>{sale.customer?.name || "N/A"}</td>
                          <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>
                            {sale.items.map((item, index) => (
                              <div key={index}>
                                {item.name} (₹{item.price.toLocaleString()} x {item.quantity})
                              </div>
                            ))}
                          </td>
                          <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>{sale.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                          <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>₹{sale.subtotal.toLocaleString()}</td>
                          <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>₹{sale.total.toLocaleString()}</td>
                          <td style={{ padding: "0.75rem", borderBottom: `1px solid ${styles.border}` }}>
                            <span
                              style={{
                                padding: "0.25rem 0.5rem",
                                borderRadius: styles.radius,
                                backgroundColor: sale.paymentMethod === "cash" ? styles.statusSuccess.replace('hsl', 'hsla').replace(')', ', 0.1)') : styles.secondary,
                                color: sale.paymentMethod === "cash" ? styles.statusSuccess : styles.secondaryForeground
                              }}
                            >
                              {sale.paymentMethod}
                            </span>
                          </td>
                          <td style={{ padding: "0.75rem", borderBottom: `1px solid ${styles.border}` }}>
                            <button 
                              style={{ 
                                padding: "0.25rem 0.5rem", 
                                backgroundColor: styles.buttonOutlineBg, 
                                color: styles.buttonOutlineText, 
                                border: `1px solid ${styles.border}`, 
                                borderRadius: styles.radius,
                                cursor: "pointer"
                              }}
                            >
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
        <div className="col-lg-4 col-md-12">
          <div style={{ backgroundColor: styles.cardBg, borderRadius: styles.radius, boxShadow: styles.shadowCard }}>
            <div style={{ padding: "1rem", borderBottom: `1px solid ${styles.border}` }}>
              <h5 style={{ fontSize: "1.25rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem", color: styles.warning, margin: 0 }}>
                <AlertTriangle size={20} />
                Inventory Alerts
              </h5>
            </div>
            <div style={{ padding: "1rem" }}>
              {lowStockItems.length === 0 ? (
                <p style={{ textAlign: "center", color: styles.mutedForeground }}>No low stock items</p>
              ) : (
                lowStockItems.map((item) => (
                  <div 
                    key={item._id} 
                    style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      justifyContent: "space-between", 
                      padding: "0.75rem", 
                      border: `1px solid ${styles.border}`, 
                      borderRadius: styles.radius, 
                      marginBottom: "0.75rem" 
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      {item.image && (
                        <img
                          src={`http://localhost:5000${item.image}`}
                          alt={item.name}
                          style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "0.25rem" }}
                        />
                      )}
                      <div>
                        <p style={{ fontWeight: "500", marginBottom: "0.25rem", color: styles.textColor }}>{item.name}</p>
                        <p style={{ fontSize: "0.875rem", color: styles.secondaryTextColor, marginBottom: "0.25rem" }}>
                          Units: {item.stock} left
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <input
                            type="number"
                            style={{ 
                              width: "80px", 
                              padding: "0.5rem", 
                              border: `1px solid ${styles.border}`, 
                              borderRadius: styles.radius, 
                              backgroundColor: styles.input, 
                              color: styles.foreground 
                            }}
                            placeholder="Restock Qty"
                            value={stockInputs[item._id] || ''}
                            onChange={(e) => handleStockInputChange(item._id, e.target.value)}
                            min="0"
                          />
                          <input
                            type="number"
                            style={{ 
                              width: "80px", 
                              padding: "0.5rem", 
                              border: `1px solid ${styles.border}`, 
                              borderRadius: styles.radius, 
                              backgroundColor: styles.input, 
                              color: styles.foreground 
                            }}
                            placeholder="Min Stock"
                            value={minStockInputs[item._id] || item.minStock}
                            onChange={(e) => handleMinStockInputChange(item._id, e.target.value)}
                            min="1"
                          />
                        </div>
                      </div>
                    </div>
                    <span 
                      style={{ 
                        padding: "0.25rem 0.5rem", 
                        borderRadius: styles.radius, 
                        backgroundColor: item.stock === 0 ? styles.statusDestructive : styles.statusWarning,
                        color: item.stock === 0 ? styles.destructiveForeground : styles.warningForeground
                      }}
                    >
                      {item.stock === 0 ? "Out of Stock" : "Low Stock"}
                    </span>
                  </div>
                ))
              )}
              <div className="d-flex justify-content-between gap-2 mt-3">
                <button 
                  className="btn flex-fill"
                  style={{ 
                    backgroundColor: styles.primary, 
                    color: styles.primaryForeground, 
                    border: "none", 
                    borderRadius: styles.radius, 
                    cursor: "pointer" 
                  }} 
                  onClick={handleManualRestock}
                >
                  Restock Selected
                </button>
                <button 
                  className="btn flex-fill"
                  style={{ 
                    backgroundColor: styles.buttonOutlineBg, 
                    color: styles.buttonOutlineText, 
                    border: `1px solid ${styles.border}`, 
                    borderRadius: styles.radius, 
                    cursor: "pointer" 
                  }} 
                  onClick={handleAutoRestock}
                >
                  Auto Restock
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mt-3">
        <div className="col-md-6 col-sm-12">
          <div style={{ backgroundColor: styles.cardBg, borderRadius: styles.radius, boxShadow: styles.shadowCard }}>
            <div style={{ padding: "1rem", borderBottom: `1px solid ${styles.border}` }}>
              <h5 style={{ fontSize: "1.25rem", fontWeight: "600", color: styles.textColor, margin: 0 }}>Sales Trend (Last 7 Days)</h5>
            </div>
            <div style={{ padding: "1rem" }}>
              <canvas id="salesChart" style={{ height: '300px' }}></canvas>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-sm-12">
          <div style={{ backgroundColor: styles.cardBg, borderRadius: styles.radius, boxShadow: styles.shadowCard }}>
            <div style={{ padding: "1rem", borderBottom: `1px solid ${styles.border}` }}>
              <h5 style={{ fontSize: "1.25rem", fontWeight: "600", color: styles.textColor, margin: 0 }}>Low Stock Items Distribution</h5>
            </div>
            <div style={{ padding: "1rem" }}>
              <canvas id="inventoryChart" style={{ height: '300px' }}></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;