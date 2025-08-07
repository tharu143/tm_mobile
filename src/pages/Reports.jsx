import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart3, Download, TrendingUp, DollarSign, Printer, RefreshCw, Sun, Moon, Leaf, Grid } from "lucide-react";

// Inline SVG Icons
const BarChart3Icon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

const Reports = ({ theme, setTheme }) => {
  const [selectedReport, setSelectedReport] = useState("sales");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [customerFilter, setCustomerFilter] = useState("");
  const [timeFrom, setTimeFrom] = useState("");
  const [timeTo, setTimeTo] = useState("");
  const [salesData, setSalesData] = useState([]);
  const [productsData, setProductsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shopDetails, setShopDetails] = useState({
    shopName: "Your Shop Name",
    address: "123 Shop Street, City, Country",
    gstin: "12ABCDE1234F1Z5"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [stockReportData, setStockReportData] = useState(null);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const itemsPerPage = 10;

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

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

  const fetchData = async () => {
    try {
      setLoading(true);
      const [salesResponse, printResponse, productsResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/sales"),
        axios.get("http://localhost:5000/api/print"),
        axios.get("http://localhost:5000/api/products")
      ]);
      setSalesData(salesResponse.data);
      setProductsData(productsResponse.data);
      setShopDetails({
        shopName: printResponse.data.shopName || "Your Shop Name",
        address: printResponse.data.address || "123 Shop Street, City, Country",
        gstin: printResponse.data.gstin || "12ABCDE1234F1Z5"
      });
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch data");
      setLoading(false);
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredSalesData = salesData.filter((sale) => {
    const saleDate = sale.timestamp.slice(0, 10);
    const saleTime = sale.timestamp.slice(11, 16);
    
    if (dateFrom && saleDate < dateFrom) return false;
    if (dateTo && saleDate > dateTo) return false;
    if (timeFrom && saleTime < timeFrom) return false;
    if (timeTo && saleTime > timeTo) return false;
    if (productFilter) {
      const hasProduct = sale.items.some(item => 
        item.name.toLowerCase().includes(productFilter.toLowerCase())
      );
      if (!hasProduct) return false;
    }
    if (customerFilter) {
      if (!sale.customer.name.toLowerCase().includes(customerFilter.toLowerCase())) return false;
    }
    return true;
  });

  const getSalesStats = () => {
    const totalSales = filteredSalesData.reduce((sum, sale) => sum + sale.total, 0);
    const totalTransactions = filteredSalesData.length;
    const avgTransaction = totalTransactions ? totalSales / totalTransactions : 0;
    const today = new Date().toISOString().slice(0, 10);
    const todaySales = filteredSalesData
      .filter((sale) => sale.timestamp.slice(0, 10) === today)
      .reduce((sum, sale) => sum + sale.total, 0);
    const totalStockValue = productsData.reduce((sum, product) => sum + product.price * product.stock, 0);

    return {
      totalSales,
      totalTransactions,
      avgTransaction,
      todaySales,
      totalStockValue,
    };
  };

  const getTopProducts = () => {
    const productSales = {};
    filteredSalesData.forEach((sale) => {
      sale.items.forEach((item) => {
        if (!productSales[item.name]) {
          productSales[item.name] = { quantity: 0, revenue: 0 };
        }
        productSales[item.name].quantity += item.quantity;
        productSales[item.name].revenue += item.price * item.quantity;
      });
    });

    return Object.entries(productSales)
      .map(([product, data]) => ({ product, ...data }))
      .sort((a, b) => b.revenue - a.revenue);
  };

  const getTopCustomers = () => {
    const customerPurchases = {};
    filteredSalesData.forEach((sale) => {
      const customer = sale.customer.name;
      if (!customerPurchases[customer]) {
        customerPurchases[customer] = 0;
      }
      customerPurchases[customer] += sale.total;
    });

    return Object.entries(customerPurchases)
      .map(([customer, amount]) => ({ customer, amount }))
      .sort((a, b) => b.amount - a.amount);
  };

  const fetchMonthlyStock = async (year, month) => {
    const response = await axios.get(`http://localhost:5000/api/reports/monthly?year=${year}&month=${month}`);
    return response.data;
  };

  const fetchYearlyStock = async (year) => {
    const response = await axios.get(`http://localhost:5000/api/reports/yearly?year=${year}`);
    return response.data;
  };

  const generateStockReport = async () => {
    setLoading(true);
    try {
      let data;
      if (selectedReport === "monthlyStock") {
        data = await fetchMonthlyStock(selectedYear, selectedMonth);
      } else if (selectedReport === "yearlyStock") {
        data = await fetchYearlyStock(selectedYear);
      }
      setStockReportData(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to generate stock report");
      console.error("Error generating stock report:", err);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSales = filteredSalesData.slice(indexOfFirstItem, indexOfLastItem);
  const currentTopProducts = getTopProducts().slice(indexOfFirstItem, indexOfLastItem);
  const currentTopCustomers = getTopCustomers().slice(indexOfFirstItem, indexOfLastItem);
  const totalSalesPages = Math.ceil(filteredSalesData.length / itemsPerPage);
  const totalProductPages = Math.ceil(getTopProducts().length / itemsPerPage);
  const totalCustomerPages = Math.ceil(getTopCustomers().length / itemsPerPage);

  const handleNextPage = () => {
    if (selectedReport === "sales" && currentPage < totalSalesPages) {
      setCurrentPage(currentPage + 1);
    } else if (selectedReport === "products" && currentPage < totalProductPages) {
      setCurrentPage(currentPage + 1);
    } else if (selectedReport === "customers" && currentPage < totalCustomerPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const exportReport = () => {
    console.log("Exporting report...", { selectedReport, dateFrom, dateTo, productFilter, customerFilter, timeFrom, timeTo });
    alert("Report exported successfully!");
  };

  const handlePrint = (reportType, sale = null) => {
    const reportData = {
      type: reportType,
      dateFrom,
      dateTo,
      productFilter,
      customerFilter,
      timeFrom,
      timeTo,
      stats: getSalesStats(),
      topProducts: getTopProducts(),
      topCustomers: getTopCustomers(),
      sales: sale ? [sale] : filteredSalesData,
      stockReport: stockReportData,
      timestamp: new Date().toISOString(),
      reportId: `RPT-${Date.now()}`,
      singleSale: sale,
      period: stockReportData?.period || (selectedReport === "monthlyStock" ? `${monthNames[selectedMonth - 1]} ${selectedYear}` : selectedYear),
    };

    const printWindow = window.open('', '_blank');
    printWindow.document.write(generatePrintContent(reportData));
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const generatePrintContent = (reportData) => {
    if (!reportData) return '';

    const { type, dateFrom, dateTo, productFilter, customerFilter, timeFrom, timeTo, stats, topProducts, topCustomers, sales, stockReport, reportId, timestamp, singleSale, period } = reportData;
    let reportContent = '';

    if (type === 'sales' && singleSale) {
      reportContent = `
        <div style="margin-bottom: 15mm;">
          <div style="margin-bottom: 10mm;">
            <p><strong>Customer:</strong> ${singleSale.customer.name}</p>
            <p><strong>Phone:</strong> ${singleSale.customer.phone}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Item</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Qty</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Price</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Total</th>
            </tr>
            ${singleSale.items.map(item => `
              <tr>
                <td style="border: 1px solid #000000; padding: 5mm;">${item.name}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${item.quantity}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">₹${item.price.toLocaleString()}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">₹${(item.price * item.quantity).toLocaleString()}</td>
              </tr>
            `).join('')}
          </table>
          <div style="margin-top: 10mm;">
            <div style="display: flex; justify-content: space-between; margin: 5mm 0;">
              <span>Subtotal:</span><span>₹${singleSale.subtotal.toLocaleString()}</span>
            </div>
            ${singleSale.tax > 0 ? `
              <div style="display: flex; justify-content: space-between; margin: 5mm 0;">
                <span>GST (${singleSale.gstPercentage}%):</span><span>₹${singleSale.tax.toLocaleString()}</span>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; margin: 5mm 0; font-weight: bold;">
              <span>Total:</span><span>₹${singleSale.total.toLocaleString()}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin: 5mm 0;">
              <span>Payment Method:</span><span>${singleSale.paymentMethod.charAt(0).toUpperCase() + singleSale.paymentMethod.slice(1)}</span>
            </div>
          </div>
        </div>
      `;
    } else if (type === 'sales') {
      reportContent = `
        <div style="margin-bottom: 15mm;">
          <h2 style="font-size: 14pt; margin-bottom: 5mm;">Sales Statistics</h2>
          <div style="display: flex; justify-content: space-between; margin: 5mm 0;">
            <span>Total Sales:</span><span>₹${stats.totalSales.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 5mm 0;">
            <span>Total Stock Value:</span><span>₹${stats.totalStockValue.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 5mm 0;">
            <span>Today's Sales:</span><span>₹${stats.todaySales.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 5mm 0;">
            <span>Total Transactions:</span><span>${stats.totalTransactions}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 5mm 0;">
            <span>Average Transaction:</span><span>₹${Math.round(stats.avgTransaction).toLocaleString()}</span>
          </div>
          <h2 style="font-size: 14pt; margin: 10mm 0 5mm;">Sales Transactions</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Invoice ID</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Date</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Customer</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Total</th>
            </tr>
            ${sales.map(sale => `
              <tr>
                <td style="border: 1px solid #000000; padding: 5mm;">${sale.invoiceId}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${new Date(sale.timestamp).toLocaleString()}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${sale.customer.name}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">₹${sale.total.toLocaleString()}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      `;
    } else if (type === 'products') {
      reportContent = `
        <div style="margin-bottom: 15mm;">
          <h2 style="font-size: 14pt; margin-bottom: 5mm;">Top Selling Products</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Product</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Quantity Sold</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Revenue</th>
            </tr>
            ${topProducts.map(item => `
              <tr>
                <td style="border: 1px solid #000000; padding: 5mm;">${item.product}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${item.quantity}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">₹${item.revenue.toLocaleString()}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      `;
    } else if (type === 'customers') {
      reportContent = `
        <div style="margin-bottom: 15mm;">
          <h2 style="font-size: 14pt; margin-bottom: 5mm;">Top Customers</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Customer</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Total Purchases</th>
            </tr>
            ${topCustomers.map(item => `
              <tr>
                <td style="border: 1px solid #000000; padding: 5mm;">${item.customer}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">₹${item.amount.toLocaleString()}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      `;
    } else if (type === 'monthlyStock' || type === 'yearlyStock') {
      const productMap = {};
      stockReport.current_stock.forEach((item) => {
        productMap[item._id] = item.name;
      });
      const totalSold = stockReport.sales.reduce((sum, item) => sum + item.totalSold, 0);
      const totalRevenue = stockReport.sales.reduce((sum, item) => sum + item.totalRevenue, 0);
      const totalAdded = stockReport.additions.reduce((sum, item) => sum + item.totalAdded, 0);
      const totalStock = stockReport.current_stock.reduce((sum, item) => sum + item.stock, 0);

      reportContent = `
        <div style="margin-bottom: 15mm;">
          <h2 style="font-size: 14pt; margin-bottom: 5mm;">${type === 'monthlyStock' ? 'Monthly' : 'Yearly'} Stock Report for ${period}</h2>
          <h3 style="font-size: 12pt; margin: 10mm 0 5mm;">Stock Sold</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Product</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Quantity Sold</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Revenue</th>
            </tr>
            ${stockReport.sales.map(item => `
              <tr>
                <td style="border: 1px solid #000000; padding: 5mm;">${productMap[item._id] || 'Unknown Product'}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${item.totalSold}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">₹${item.totalRevenue.toLocaleString()}</td>
              </tr>
            `).join('')}
          </table>
          <p style="margin: 5mm 0;">Total Quantity Sold: ${totalSold}</p>
          <p style="margin: 5mm 0;">Total Revenue: ₹${totalRevenue.toLocaleString()}</p>
          <h3 style="font-size: 12pt; margin: 10mm 0 5mm;">Stock Added</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Product</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Quantity Added</th>
            </tr>
            ${stockReport.additions.map(item => `
              <tr>
                <td style="border: 1px solid #000000; padding: 5mm;">${productMap[item._id] || 'Unknown Product'}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${item.totalAdded}</td>
              </tr>
            `).join('')}
          </table>
          <p style="margin: 5mm 0;">Total Quantity Added: ${totalAdded}</p>
          <h3 style="font-size: 12pt; margin: 10mm 0 5mm;">Current Stock Balance</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Product</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Stock</th>
            </tr>
            ${stockReport.current_stock.map(item => `
              <tr>
                <td style="border: 1px solid #000000; padding: 5mm;">${item.name}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${item.stock}</td>
              </tr>
            `).join('')}
          </table>
          <p style="margin: 5mm 0;">Total Current Stock: ${totalStock}</p>
        </div>
      `;
    }

    return `
      <html>
        <head>
          <title>${type.charAt(0).toUpperCase() + type.slice(1)} Report ${reportId}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20mm; font-size: 12pt; background-color: #ffffff; color: #000000; min-height: 100vh; }
            .report { width: 170mm; margin: auto; border: 1px solid #000000; padding: 10mm; background-color: #ffffff; }
            .header { text-align: center; border-bottom: 1px dashed #000000; padding-bottom: 10mm; margin-bottom: 10mm; }
            .header h1 { font-size: 16pt; margin: 5mm 0; }
            .details { margin-bottom: 10mm; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000000; padding: 5mm; text-align: left; }
            .footer { text-align: center; border-top: 1px dashed #000000; padding-top: 10mm; margin-top: 10mm; }
            .no-print { display: block; }
            @media print {
              @page { size: A4; margin: 20mm; }
              body { background-color: #ffffff; color: #000000; }
              .report { border: 1px solid #000000; background-color: #ffffff; }
              .header { border-bottom: 1px dashed #000000; }
              th, td { border: 1px solid #000000; }
              .footer { border-top: 1px dashed #000000; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="report">
            <div class="header">
              <h1>${shopDetails.shopName}</h1>
              <p>${shopDetails.address}</p>
              <p>GSTIN: ${shopDetails.gstin}</p>
              <p>${singleSale ? 'Invoice' : 'Report'}: ${reportId}</p>
              <p>Date: ${new Date(timestamp).toLocaleString()}</p>
              ${(type === 'sales' && (dateFrom || dateTo)) ? `<p>Period: ${dateFrom || 'Start'} to ${dateTo || 'Today'}</p>` : ''}
              ${type === 'sales' && productFilter ? `<p>Product Filter: ${productFilter}</p>` : ''}
              ${type === 'sales' && customerFilter ? `<p>Customer Filter: ${customerFilter}</p>` : ''}
              ${type === 'sales' && (timeFrom || timeTo) ? `<p>Time Period: ${timeFrom || '00:00'} to ${timeTo || '23:59'}</p>` : ''}
              ${(type === 'monthlyStock' || type === 'yearlyStock') && period ? `<p>Period: ${period}</p>` : ''}
            </div>
            ${reportContent}
            <div class="footer">
              <p>Generated by Your Shop POS System</p>
              <p>Thank you for using our services!</p>
            </div>
          </div>
          <div style="text-align: center; margin-top: 10mm;" class="no-print">
            <button onclick="window.print()" style="padding: 5mm; background-color: #3b82f6; color: #ffffff; border: none; border-radius: 5px; cursor: pointer;">Print</button>
            <button onclick="window.close()" style="padding: 5mm; background-color: #6b7280; color: #ffffff; border: none; border-radius: 5px; cursor: pointer; margin-left: 5mm;">Close</button>
          </div>
        </body>
      </html>
    `;
  };

  const stats = getSalesStats();
  const topProducts = getTopProducts();
  const topCustomers = getTopCustomers();

  const themeOptions = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "nature", label: "Nature", icon: Leaf },
    { id: "sunset", label: "Sunset", icon: Grid },
  ];

  const selectedTheme = themeOptions.find(t => t.id === theme) || themeOptions[0];

  const renderSalesReport = () => (
    <div style={{ marginTop: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
        <div style={{ backgroundColor: styles.cardBg, padding: "1rem", borderRadius: styles.radius, boxShadow: styles.shadow, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: "1rem", color: styles.secondaryTextColor }}>Total Sales</p>
              <p style={{ fontSize: "1.5rem", fontWeight: "700", color: styles.textColor }}>₹{stats.totalSales.toLocaleString()}</p>
            </div>
            <DollarSign size={32} style={{ color: styles.statusSuccess }} />
          </div>
        </div>
        <div style={{ backgroundColor: styles.cardBg, padding: "1rem", borderRadius: styles.radius, boxShadow: styles.shadow, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: "1rem", color: styles.secondaryTextColor }}>Total Stock Value</p>
              <p style={{ fontSize: "1.5rem", fontWeight: "700", color: styles.textColor }}>₹{stats.totalStockValue.toLocaleString()}</p>
            </div>
            <DollarSign size={32} style={{ color: styles.statusSuccess }} />
          </div>
        </div>
        <div style={{ backgroundColor: styles.cardBg, padding: "1rem", borderRadius: styles.radius, boxShadow: styles.shadow, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: "1rem", color: styles.secondaryTextColor }}>Today's Sales</p>
              <p style={{ fontSize: "1.5rem", fontWeight: "700", color: styles.textColor }}>₹{stats.todaySales.toLocaleString()}</p>
            </div>
            <TrendingUp size={32} style={{ color: styles.primary }} />
          </div>
        </div>
        <div style={{ backgroundColor: styles.cardBg, padding: "1rem", borderRadius: styles.radius, boxShadow: styles.shadow, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: "1rem", color: styles.secondaryTextColor }}>Total Transactions</p>
              <p style={{ fontSize: "1.5rem", fontWeight: "700", color: styles.textColor }}>{stats.totalTransactions}</p>
            </div>
            <BarChart3Icon size={32} style={{ color: styles.accent }} />
          </div>
        </div>
        <div style={{ backgroundColor: styles.cardBg, padding: "1rem", borderRadius: styles.radius, boxShadow: styles.shadow, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: "1rem", color: styles.secondaryTextColor }}>Avg Transaction</p>
              <p style={{ fontSize: "1.5rem", fontWeight: "700", color: styles.textColor }}>₹{Math.round(stats.avgTransaction).toLocaleString()}</p>
            </div>
            <DollarSign size={32} style={{ color: styles.warning }} />
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: styles.cardBg, borderRadius: styles.radius, boxShadow: styles.shadowCard }}>
        <div style={{ padding: "1rem", borderBottom: `1px solid ${styles.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h5 style={{ fontSize: "1.25rem", fontWeight: "600", margin: 0, color: styles.textColor }}>Recent Sales Transactions</h5>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button style={{ padding: "0.5rem 1rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer" }} onClick={() => handlePrint('sales')}>
              Print All Sales
            </button>
            <button style={{ padding: "0.5rem 1rem", backgroundColor: styles.buttonOutlineBg, color: styles.buttonOutlineText, border: `1px solid ${styles.border}`, borderRadius: styles.radius, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }} onClick={fetchData}>
              <RefreshCw size={16} /> Refresh
            </button>
          </div>
        </div>
        <div style={{ padding: "1.5rem" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem", color: styles.textColor }}>Loading sales...</div>
          ) : error ? (
            <div style={{ textAlign: "center", padding: "2rem", color: styles.destructive }}>{error}</div>
          ) : (
            <>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Invoice ID", "Date", "Customer", "Product", "Quantity", "Amount", "Grand Total", "Payment", "Action"].map((header) => (
                        <th key={header} style={{ padding: "0.75rem", textAlign: "left", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentSales.map((sale) => (
                      <tr key={sale._id}>
                        <td style={{ padding: "0.75rem", color: styles.textColor, fontWeight: "500", borderBottom: `1px solid ${styles.border}` }}>{sale.invoiceId}</td>
                        <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>{new Date(sale.timestamp).toLocaleString()}</td>
                        <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>{sale.customer.name}</td>
                        <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>
                          {sale.items.map((item, index) => (
                            <div key={index}>{item.name} (₹{item.price.toLocaleString()} x {item.quantity})</div>
                          ))}
                        </td>
                        <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>{sale.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                        <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>₹{sale.subtotal.toLocaleString()}</td>
                        <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>₹{sale.total.toLocaleString()}</td>
                        <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>
                          <span style={{ padding: "0.25rem 0.5rem", borderRadius: styles.radius, backgroundColor: styles.secondary, color: styles.secondaryForeground }}>{sale.paymentMethod}</span>
                        </td>
                        <td style={{ padding: "0.75rem", borderBottom: `1px solid ${styles.border}` }}>
                          <button style={{ padding: "0.25rem 0.5rem", backgroundColor: styles.buttonOutlineBg, color: styles.buttonOutlineText, border: `1px solid ${styles.border}`, borderRadius: styles.radius, cursor: "pointer" }} onClick={() => handlePrint('sales', sale)}>
                            <Printer size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
                <button style={{ padding: "0.5rem 1rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer" }} onClick={handlePrevPage} disabled={currentPage === 1 || loading}>
                  Previous
                </button>
                <span style={{ color: styles.textColor }}>Page {currentPage} of {totalSalesPages}</span>
                <button style={{ padding: "0.5rem 1rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer" }} onClick={handleNextPage} disabled={currentPage === totalSalesPages || loading}>
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );

  const renderProductReport = () => (
    <div style={{ backgroundColor: styles.cardBg, borderRadius: styles.radius, boxShadow: styles.shadowCard, marginTop: "1rem" }}>
      <div style={{ padding: "1rem", borderBottom: `1px solid ${styles.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h5 style={{ fontSize: "1.25rem", fontWeight: "600", margin: 0, color: styles.textColor }}>Top Selling Products</h5>
        <button style={{ padding: "0.5rem 1rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer" }} onClick={() => handlePrint('products')}>
          Print Report
        </button>
      </div>
      <div style={{ padding: "1.5rem" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Product", "Quantity Sold", "Revenue"].map((header) => (
                  <th key={header} style={{ padding: "0.75rem", textAlign: "left", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTopProducts.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: "0.75rem", color: styles.textColor, fontWeight: "500", borderBottom: `1px solid ${styles.border}` }}>{item.product}</td>
                  <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>{item.quantity}</td>
                  <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>₹{item.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
          <button style={{ padding: "0.5rem 1rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer" }} onClick={handlePrevPage} disabled={currentPage === 1 || loading}>
            Previous
          </button>
          <span style={{ color: styles.textColor }}>Page {currentPage} of {totalProductPages}</span>
          <button style={{ padding: "0.5rem 1rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer" }} onClick={handleNextPage} disabled={currentPage === totalProductPages || loading}>
            Next
          </button>
        </div>
      </div>
    </div>
  );

  const renderCustomerReport = () => (
    <div style={{ backgroundColor: styles.cardBg, borderRadius: styles.radius, boxShadow: styles.shadowCard, marginTop: "1rem" }}>
      <div style={{ padding: "1rem", borderBottom: `1px solid ${styles.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h5 style={{ fontSize: "1.25rem", fontWeight: "600", margin: 0, color: styles.textColor }}>Top Customers</h5>
        <button style={{ padding: "0.5rem 1rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer" }} onClick={() => handlePrint('customers')}>
          Print Report
        </button>
      </div>
      <div style={{ padding: "1.5rem" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                {["Customer", "Total Purchases"].map((header) => (
                  <th key={header} style={{ padding: "0.75rem", textAlign: "left", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTopCustomers.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: "0.75rem", color: styles.textColor, fontWeight: "500", borderBottom: `1px solid ${styles.border}` }}>{item.customer}</td>
                  <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>₹{item.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
          <button style={{ padding: "0.5rem 1rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer" }} onClick={handlePrevPage} disabled={currentPage === 1 || loading}>
            Previous
          </button>
          <span style={{ color: styles.textColor }}>Page {currentPage} of {totalCustomerPages}</span>
          <button style={{ padding: "0.5rem 1rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer" }} onClick={handleNextPage} disabled={currentPage === totalCustomerPages || loading}>
            Next
          </button>
        </div>
      </div>
    </div>
  );

  const renderStockReport = () => {
    if (loading) {
      return <div style={{ textAlign: "center", padding: "2rem", color: styles.textColor }}>Loading stock report...</div>;
    }
    if (error) {
      return <div style={{ textAlign: "center", padding: "2rem", color: styles.destructive }}>{error}</div>;
    }
    if (!stockReportData) {
      return <div style={{ textAlign: "center", padding: "2rem", color: styles.textColor }}>Please generate the stock report</div>;
    }

    const productMap = {};
    stockReportData.current_stock.forEach((item) => {
      productMap[item._id] = item.name;
    });

    const totalSold = stockReportData.sales.reduce((sum, item) => sum + item.totalSold, 0);
    const totalRevenue = stockReportData.sales.reduce((sum, item) => sum + item.totalRevenue, 0);
    const totalAdded = stockReportData.additions.reduce((sum, item) => sum + item.totalAdded, 0);
    const totalStock = stockReportData.current_stock.reduce((sum, item) => sum + item.stock, 0);

    return (
      <div style={{ backgroundColor: styles.cardBg, borderRadius: styles.radius, boxShadow: styles.shadowCard, marginTop: "1rem" }}>
        <div style={{ padding: "1rem", borderBottom: `1px solid ${styles.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h5 style={{ fontSize: "1.25rem", fontWeight: "600", margin: 0, color: styles.textColor }}>
            {selectedReport === "monthlyStock" 
              ? `Monthly Stock Report for ${monthNames[selectedMonth - 1]} ${selectedYear}` 
              : `Yearly Stock Report for ${selectedYear}`}
          </h5>
          <button style={{ padding: "0.5rem 1rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer" }} onClick={() => handlePrint(selectedReport)}>
            Print Report
          </button>
        </div>
        <div style={{ padding: "1.5rem" }}>
          <h6 style={{ color: styles.textColor, marginBottom: "1rem" }}>Stock Sold</h6>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Product", "Quantity Sold", "Revenue"].map((header) => (
                    <th key={header} style={{ padding: "0.75rem", textAlign: "left", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stockReportData.sales.map((item) => (
                  <tr key={item._id}>
                    <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>{productMap[item._id] || 'Unknown Product'}</td>
                    <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>{item.totalSold}</td>
                    <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>₹{item.totalRevenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ color: styles.textColor, margin: "0.5rem 0" }}>Total Quantity Sold: {totalSold}</p>
          <p style={{ color: styles.textColor, margin: "0.5rem 0" }}>Total Revenue: ₹{totalRevenue.toLocaleString()}</p>

          <h6 style={{ color: styles.textColor, margin: "1rem 0" }}>Stock Added</h6>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Product", "Quantity Added"].map((header) => (
                    <th key={header} style={{ padding: "0.75rem", textAlign: "left", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stockReportData.additions.map((item) => (
                  <tr key={item._id}>
                    <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>{productMap[item._id] || 'Unknown Product'}</td>
                    <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>{item.totalAdded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ color: styles.textColor, margin: "0.5rem 0" }}>Total Quantity Added: {totalAdded}</p>

          <h6 style={{ color: styles.textColor, margin: "1rem 0" }}>Current Stock Balance</h6>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Product", "Stock"].map((header) => (
                    <th key={header} style={{ padding: "0.75rem", textAlign: "left", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stockReportData.current_stock.map((item) => (
                  <tr key={item._id}>
                    <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>{item.name}</td>
                    <td style={{ padding: "0.75rem", color: styles.textColor, borderBottom: `1px solid ${styles.border}` }}>{item.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ color: styles.textColor, margin: "0.5rem 0" }}>Total Current Stock: {totalStock}</p>
        </div>
      </div>
    );
  };

  const handleReportTypeChange = (type) => {
    setSelectedReport(type);
    setStockReportData(null);
    setCurrentPage(1);
    setSelectedYear("");
    setSelectedMonth("");
    setError(null);
  };

  const isMonthlyReportReady = selectedReport === "monthlyStock" && selectedYear && selectedMonth;
  const isYearlyReportReady = selectedReport === "yearlyStock" && selectedYear;
  const isReportReady = isMonthlyReportReady || isYearlyReportReady;

  return (
    <div style={{ backgroundColor: styles.bgColor, color: styles.foreground, minHeight: "100vh", padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: styles.textColor }}>Reports & Analytics</h1>
          <p style={{ fontSize: "1rem", color: styles.secondaryTextColor, marginBottom: "1rem" }}>Analyze your business performance and trends</p>
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
      <div style={{ backgroundColor: styles.cardBg, borderRadius: styles.radius, boxShadow: styles.shadowCard, marginBottom: "2rem" }}>
        <div style={{ padding: "1rem", borderBottom: `1px solid ${styles.border}`, display: "flex", alignItems: "center" }}>
          <BarChart3Icon size={20} style={{ marginRight: "0.5rem", color: styles.textColor }} />
          <h5 style={{ fontSize: "1.25rem", fontWeight: "600", margin: 0, color: styles.textColor }}>Report Configuration</h5>
        </div>
        <div style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center", marginBottom: "1rem" }}>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {["sales", "products", "customers", "monthlyStock", "yearlyStock"].map((type) => (
                <button
                  key={type}
                  style={{ 
                    padding: "0.5rem 1rem", 
                    backgroundColor: selectedReport === type ? styles.primary : styles.buttonOutlineBg, 
                    color: selectedReport === type ? styles.primaryForeground : styles.buttonOutlineText, 
                    border: `1px solid ${styles.border}`, 
                    borderRadius: styles.radius, 
                    cursor: "pointer" 
                  }}
                  onClick={() => handleReportTypeChange(type)}
                >
                  {type === "sales" ? "Sales Report" : 
                   type === "products" ? "Product Report" : 
                   type === "customers" ? "Customer Report" : 
                   type === "monthlyStock" ? "Monthly Stock Report" : "Yearly Stock Report"}
                </button>
              ))}
            </div>
            <button 
              style={{ 
                display: "flex", 
                alignItems: "center", 
                gap: "0.5rem", 
                padding: "0.5rem 1rem", 
                backgroundColor: styles.statusSuccess, 
                color: styles.successForeground, 
                border: "none", 
                borderRadius: styles.radius, 
                cursor: "pointer" 
              }} 
              onClick={exportReport}
            >
              <Download size={16} /> Export
            </button>
          </div>
          {selectedReport === "sales" && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="date"
                  style={{ 
                    padding: "0.5rem", 
                    border: `1px solid ${styles.border}`, 
                    borderRadius: styles.radius, 
                    backgroundColor: styles.input, 
                    color: styles.foreground,
                    width: "auto" 
                  }}
                  value={dateFrom}
                  onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                />
                <span style={{ color: styles.textColor }}>to</span>
                <input
                  type="date"
                  style={{ 
                    padding: "0.5rem", 
                    border: `1px solid ${styles.border}`, 
                    borderRadius: styles.radius, 
                    backgroundColor: styles.input, 
                    color: styles.foreground,
                    width: "auto" 
                  }}
                  value={dateTo}
                  onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <input
                  type="time"
                  style={{ 
                    padding: "0.5rem", 
                    border: `1px solid ${styles.border}`, 
                    borderRadius: styles.radius, 
                    backgroundColor: styles.input, 
                    color: styles.foreground,
                    width: "auto" 
                  }}
                  value={timeFrom}
                  onChange={(e) => { setTimeFrom(e.target.value); setCurrentPage(1); }}
                />
                <span style={{ color: styles.textColor }}>to</span>
                <input
                  type="time"
                  style={{ 
                    padding: "0.5rem", 
                    border: `1px solid ${styles.border}`, 
                    borderRadius: styles.radius, 
                    backgroundColor: styles.input, 
                    color: styles.foreground,
                    width: "auto" 
                  }}
                  value={timeTo}
                  onChange={(e) => { setTimeTo(e.target.value); setCurrentPage(1); }}
                />
              </div>
              <input
                type="text"
                style={{ 
                  padding: "0.5rem", 
                  border: `1px solid ${styles.border}`, 
                  borderRadius: styles.radius, 
                  backgroundColor: styles.input, 
                  color: styles.foreground,
                  width: "200px" 
                }}
                value={productFilter}
                onChange={(e) => { setProductFilter(e.target.value); setCurrentPage(1); }}
                placeholder="Filter by Product"
              />
              <input
                type="text"
                style={{ 
                  padding: "0.5rem", 
                  border: `1px solid ${styles.border}`, 
                  borderRadius: styles.radius, 
                  backgroundColor: styles.input, 
                  color: styles.foreground,
                  width: "200px" 
                }}
                value={customerFilter}
                onChange={(e) => { setCustomerFilter(e.target.value); setCurrentPage(1); }}
                placeholder="Filter by Customer"
              />
            </div>
          )}
          {(selectedReport === "monthlyStock" || selectedReport === "yearlyStock") && (
            <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "1rem" }}>
              <div>
                <label style={{ marginRight: "0.5rem", color: styles.textColor }}>Year:</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  style={{ 
                    padding: "0.5rem", 
                    border: `1px solid ${styles.border}`, 
                    borderRadius: styles.radius, 
                    backgroundColor: styles.input, 
                    color: styles.foreground,
                    width: "auto" 
                  }}
                >
                  <option value="">Select Year</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              {selectedReport === "monthlyStock" && (
                <div>
                  <label style={{ marginRight: "0.5rem", color: styles.textColor }}>Month:</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={{ 
                      padding: "0.5rem", 
                      border: `1px solid ${styles.border}`, 
                      borderRadius: styles.radius, 
                      backgroundColor: styles.input, 
                      color: styles.foreground,
                      width: "auto" 
                    }}
                  >
                    <option value="">Select Month</option>
                    {monthNames.map((month, index) => (
                      <option key={index} value={index + 1}>{month}</option>
                    ))}
                  </select>
                </div>
              )}
              <button
                style={{ 
                  padding: "0.5rem 1rem", 
                  backgroundColor: isReportReady ? styles.primary : styles.disabledBg, 
                  color: isReportReady ? styles.primaryForeground : styles.mutedForeground, 
                  border: "none", 
                  borderRadius: styles.radius, 
                  cursor: isReportReady ? "pointer" : "not-allowed" 
                }}
                disabled={!isReportReady}
                onClick={generateStockReport}
              >
                Generate Report
              </button>
            </div>
          )}
        </div>
      </div>
      {selectedReport === "sales" && renderSalesReport()}
      {selectedReport === "products" && renderProductReport()}
      {selectedReport === "customers" && renderCustomerReport()}
      {(selectedReport === "monthlyStock" || selectedReport === "yearlyStock") && renderStockReport()}
    </div>
  );
};

export default Reports;