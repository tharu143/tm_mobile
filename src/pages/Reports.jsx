// Reports.jsx (Modified to show deleted services in reports if status is 'completed-paid'; fetches all services, filters by status only)
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
  const themes = {
    light: {
      bgColor: '#ffffff',
      foreground: '#000000',
      textColor: '#1f2937',
      secondaryTextColor: '#6b7280',
      primary: '#3b82f6',
      primaryForeground: '#ffffff',
      accent: '#10b981',
      statusSuccess: '#22c55e',
      warning: '#eab308',
      statusWarning: '#ef4444',
      warningForeground: '#fef2f2',
      cardBg: '#ffffff',
      card: '#f3f4f6',
      input: '#f9fafb',
      border: '#e5e7eb',
      radius: '0.5rem',
      shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      shadowCard: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      buttonOutlineBg: 'transparent',
      buttonOutlineText: '#3b82f6',
      secondary: '#e5e7eb',
      secondaryForeground: '#1f2937',
      dropdownBg: '#ffffff',
      disabledBg: '#e5e7eb',
      mutedForeground: '#9ca3af',
      success: '#dcfce7',
      successForeground: '#166534',
    },
    dark: {
      bgColor: '#1a1a1a',
      foreground: '#ffffff',
      textColor: '#f3f4f6',
      secondaryTextColor: '#9ca3af',
      primary: '#3b82f6',
      primaryForeground: '#ffffff',
      accent: '#10b981',
      statusSuccess: '#22c55e',
      warning: '#eab308',
      statusWarning: '#ef4444',
      warningForeground: '#7f1d1d',
      cardBg: '#ffffff',
      card: '#3f3f46',
      input: '#27272a',
      border: '#3f3f46',
      radius: '0.5rem',
      shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.2)',
      shadowCard: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
      buttonOutlineBg: 'transparent',
      buttonOutlineText: '#3b82f6',
      secondary: '#3f3f46',
      secondaryForeground: '#f3f4f6',
      dropdownBg: '#27272a',
      disabledBg: '#3f3f46',
      mutedForeground: '#6b7280',
      success: '#166534',
      successForeground: '#dcfce7',
    },
    nature: {
      bgColor: '#f0fdf4',
      foreground: '#052e16',
      textColor: '#14532d',
      secondaryTextColor: '#4d7c0f',
      primary: '#16a34a',
      primaryForeground: '#ffffff',
      accent: '#84cc16',
      statusSuccess: '#22c55e',
      warning: '#ca8a04',
      statusWarning: '#b91c1c',
      warningForeground: '#fefce8',
      cardBg: '#ffffff',
      card: '#dcfce7',
      input: '#f0fdf4',
      border: '#86efac',
      radius: '0.5rem',
      shadow: '0 1px 3px 0 rgba(0, 128, 0, 0.1)',
      shadowCard: '0 4px 6px -1px rgba(0, 128, 0, 0.1)',
      buttonOutlineBg: 'transparent',
      buttonOutlineText: '#16a34a',
      secondary: '#bbf7d0',
      secondaryForeground: '#14532d',
      dropdownBg: '#f0fdf4',
      disabledBg: '#bbf7d0',
      mutedForeground: '#4d7c0f',
      success: '#dcfce7',
      successForeground: '#14532d',
    },
    sunset: {
      bgColor: '#fff7ed',
      foreground: '#431407',
      textColor: '#7c2d12',
      secondaryTextColor: '#c2410c',
      primary: '#ea580c',
      primaryForeground: '#ffffff',
      accent: '#f97316',
      statusSuccess: '#16a34a',
      warning: '#d97706',
      statusWarning: '#b91c1c',
      warningForeground: '#fefce8',
      cardBg: '#ffffff',
      card: '#ffedd5',
      input: '#fff7ed',
      border: '#fdba74',
      radius: '0.5rem',
      shadow: '0 1px 3px 0 rgba(194, 65, 12, 0.1)',
      shadowCard: '0 4px 6px -1px rgba(194, 65, 12, 0.1)',
      buttonOutlineBg: 'transparent',
      buttonOutlineText: '#ea580c',
      secondary: '#fed7aa',
      secondaryForeground: '#7c2d12',
      dropdownBg: '#fff7ed',
      disabledBg: '#fed7aa',
      mutedForeground: '#c2410c',
      success: '#dcfce7',
      successForeground: '#14532d',
    },
  };
  const styles = themes[theme] || themes.light;
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
    shopName: "Mobile Shop",
    address: "143 Shop Street, City, Country",
    gstin: "12345g1q2334"
  });
  const [shopColor, setShopColor] = useState("#000000");
  const [enableGstinPrint, setEnableGstinPrint] = useState(true);
  const [enablePanPrint, setEnablePanPrint] = useState(true);
  const [enableTermsPrint, setEnableTermsPrint] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("8921083090");
  const [panNumber, setPanNumber] = useState("AVHPC9999A");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [stockReportData, setStockReportData] = useState(null);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [reportMessage, setReportMessage] = useState("");
  const [servicesData, setServicesData] = useState([]);
  const itemsPerPage = 10;
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const fetchData = async () => {
    try {
      setLoading(true);
      const [salesResponse, printResponse, productsResponse, servicesResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/sales"),
        axios.get("http://localhost:5000/api/print"),
        axios.get("http://localhost:5000/api/products"),
        axios.get("http://localhost:5000/api/services")
      ]);
      setSalesData(salesResponse.data);
      setProductsData(productsResponse.data);
      setServicesData(servicesResponse.data);
      setShopDetails({
        shopName: printResponse.data.shopName || "Mobile Shop",
        address: printResponse.data.address || "143 Shop Street, City, Country",
        gstin: printResponse.data.gstin || "12345g1q2334"
      });
      setShopColor(printResponse.data.shopColor || "#000000");
      setEnableGstinPrint(printResponse.data.enableGstinPrint !== undefined ? printResponse.data.enableGstinPrint : true);
      setEnablePanPrint(printResponse.data.enablePanPrint !== undefined ? printResponse.data.enablePanPrint : true);
      setEnableTermsPrint(printResponse.data.enableTermsPrint !== undefined ? printResponse.data.enableTermsPrint : true);
      setPhoneNumber(printResponse.data.phoneNumber || "8921083090");
      setPanNumber(printResponse.data.panNumber || "AVHPC9999A");
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
  const filteredSalesData = salesData
    .filter((sale) => {
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
    })
    .sort((a, b) => {
      const timeDiff = new Date(b.timestamp) - new Date(a.timestamp);
      if (timeDiff !== 0) return timeDiff;
      return b._id.localeCompare(a._id);
    });
  const filteredPaidServices = servicesData.filter(service => service.status === 'completed-paid');
  const getSalesStats = () => {
    const totalSales = filteredSalesData.reduce((sum, sale) => sum + (sale.manualTotal || sale.total), 0);
    const totalTransactions = filteredSalesData.length;
    const avgTransaction = totalTransactions ? totalSales / totalTransactions : 0;
    const today = new Date().toISOString().slice(0, 10);
    const todaySales = filteredSalesData
      .filter((sale) => sale.timestamp.slice(0, 10) === today)
      .reduce((sum, sale) => sum + (sale.manualTotal || sale.total), 0);
    return {
      totalSales,
      totalTransactions,
      avgTransaction,
      todaySales,
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
      customerPurchases[customer] += (sale.manualTotal || sale.total);
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
  const currentPaidServices = filteredPaidServices.slice(indexOfFirstItem, indexOfLastItem);
  const totalSalesPages = Math.ceil(filteredSalesData.length / itemsPerPage);
  const totalProductPages = Math.ceil(getTopProducts().length / itemsPerPage);
  const totalCustomerPages = Math.ceil(getTopCustomers().length / itemsPerPage);
  const totalServicePages = Math.ceil(filteredPaidServices.length / itemsPerPage);
  const handleNextPage = () => {
    if (selectedReport === "sales" && currentPage < totalSalesPages) {
      setCurrentPage(currentPage + 1);
    } else if (selectedReport === "products" && currentPage < totalProductPages) {
      setCurrentPage(currentPage + 1);
    } else if (selectedReport === "customers" && currentPage < totalCustomerPages) {
      setCurrentPage(currentPage + 1);
    } else if (selectedReport === "services" && currentPage < totalServicePages) {
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
    setReportMessage("Report exported successfully!");
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
  };
  const generatePrintContent = (reportData) => {
    if (!reportData) return '';
    const { type, dateFrom, dateTo, productFilter, customerFilter, timeFrom, timeTo, stats, topProducts, topCustomers, sales, stockReport, reportId, timestamp, singleSale, period } = reportData;
    let reportContent = '';
    const hexToRgba = (hex, alpha = 0.2) => {
      let r = parseInt(hex.slice(1, 3), 16);
      let g = parseInt(hex.slice(3, 5), 16);
      let b = parseInt(hex.slice(5, 7), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    };
    if (type === 'sales' && singleSale) {
      reportContent = `
        <div style="margin-bottom: 15mm;">
          <div style="margin-bottom: 10mm;">
            <p><strong>Customer:</strong> ${singleSale.customer.name}</p>
            <p><strong>Phone:</strong> ${singleSale.customer.phone}</p>
          </div>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Sr. No.</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Items</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Quantity</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Price / Unit</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Tax Rate</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Amount</th>
            </tr>
            ${singleSale.items.map((item, index) => `
              <tr>
                <td style="border: 1px solid #000000; padding: 5mm;">${index + 1}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${item.name}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${item.quantity}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">Rs. ${item.price.toFixed(2)}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${singleSale.gstPercentage}%</td>
                <td style="border: 1px solid #000000; padding: 5mm;">Rs. ${(item.price * item.quantity + item.price * item.quantity * (singleSale.gstPercentage / 100)).toFixed(2)}</td>
              </tr>
            `).join('')}
          </table>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 1rem;">
            <tbody>
              <tr>
                <td style="border: 1px solid #000; padding: 0.5rem; text-align: right"><strong>Sub Total</strong></td>
                <td style="border: 1px solid #000; padding: 0.5rem;"></td>
                <td style="border: 1px solid #000; padding: 0.5rem;"></td>
                <td style="border: 1px solid #000; padding: 0.5rem; text-align: right">Rs. ${singleSale.subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td style="border: 1px solid #000; padding: 0.5rem; text-align: right"><strong>GST</strong></td>
                <td style="border: 1px solid #000; padding: 0.5rem;"></td>
                <td style="border: 1px solid #000; padding: 0.5rem;">Rs. ${singleSale.tax.toFixed(2)}</td>
                <td style="border: 1px solid #000; padding: 0.5rem; text-align: right">Rs. ${singleSale.tax.toFixed(2)}</td>
              </tr>
              <tr style="background-color: ${hexToRgba(shopColor || "#000000", 0.2)}">
                <td style="border: 1px solid #000; padding: 0.5rem"><strong>Grand Total</strong></td>
                <td style="border: 1px solid #000; padding: 0.5rem;"></td>
                <td style="border: 1px solid #000; padding: 0.5rem;"></td>
                <td style="border: 1px solid #000; padding: 0.5rem; text-align: right">Rs. ${singleSale.total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
          ${enableTermsPrint ? `
            <div style="margin-bottom: 1rem;">
              <strong>Terms & Conditions</strong>
              <ol style="margin: 0; padding-left: 1rem;">
                <li>Note: Verbal Deal</li>
                <li>Customer will pay the GST</li>
                <li>Customer will pay the Delivery charges</li>
                <li>Pay due amount within 15 days</li>
              </ol>
            </div>
          ` : ''}
          <div style="text-align: center;">
            <div style="border-bottom: 1px solid #000; width: 200px; margin: 2rem auto 0.5rem;"></div>
            <strong>Authorized Signature for ${shopDetails.shopName}</strong>
          </div>
        </div>
      `;
    } else if (type === 'sales') {
      reportContent = `
        <div style="margin-bottom: 15mm;">
          <h2 style="font-size: 14pt; margin-bottom: 5mm;">Sales Statistics</h2>
          <div style="display: flex; justify-content: space-between; margin: 5mm 0;">
            <span>Total Sales:</span><span>${stats.totalSales.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 5mm 0;">
            <span>Today's Sales:</span><span>${stats.todaySales.toLocaleString()}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 5mm 0;">
            <span>Total Transactions:</span><span>${stats.totalTransactions}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin: 5mm 0;">
            <span>Average Transaction:</span><span>${Math.round(stats.avgTransaction).toLocaleString()}</span>
          </div>
          <h2 style="font-size: 14pt; margin: 10mm 0 5mm;">Sales Transactions</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Invoice ID</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Date</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Customer</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Product</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Quantity</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Amount</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Grand Total</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Manual Total</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Payment</th>
            </tr>
            ${sales.map(sale => `
              <tr>
                <td style="border: 1px solid #000000; padding: 5mm;">${sale.invoiceId}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${new Date(sale.timestamp).toLocaleString()}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${sale.customer.name}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${sale.items.map(item => item.name).join(', ')}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${sale.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${sale.subtotal.toLocaleString()}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${sale.total.toLocaleString()}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${sale.manualTotal ? `${sale.manualTotal.toLocaleString()}` : 'N/A'}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${sale.paymentMethod}</td>
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
                <td style="border: 1px solid #000000; padding: 5mm;">${item.revenue.toLocaleString()}</td>
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
                <td style="border: 1px solid #000000; padding: 5mm;">${item.amount.toLocaleString()}</td>
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
                <td style="border: 1px solid #000000; padding: 5mm;">${item.totalRevenue.toLocaleString()}</td>
              </tr>
            `).join('')}
          </table>
          <p style="margin: 5mm 0;">Total Quantity Sold: ${totalSold}</p>
          <p style="margin: 5mm 0;">Total Revenue: ${totalRevenue.toLocaleString()}</p>
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
    } else if (type === 'services') {
      reportContent = `
        <div style="margin-bottom: 15mm;">
          <h2 style="font-size: 14pt; margin-bottom: 5mm;">Paid Services Report</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Service Number</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Customer Name</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Phone</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Brand</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Model</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Complaint Type</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Description</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Total</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Manual Amount</th>
              <th style="border: 1px solid #000000; padding: 5mm; text-align: left;">Status</th>
            </tr>
            ${filteredPaidServices.map(service => `
              <tr>
                <td style="border: 1px solid #000000; padding: 5mm;">${service.serviceNumber}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${service.customer.name}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${service.customer.phone}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${service.device.brand}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${service.device.model}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${service.problem.complaintType}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${service.problem.description}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${service.total.toLocaleString()}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${service.manualTotal ? `${service.manualTotal.toLocaleString()}` : 'N/A'}</td>
                <td style="border: 1px solid #000000; padding: 5mm;">${service.status}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      `;
    }
    return `
      <html>
        <head>
          <title>${type.charAt(0).toUpperCase() + type.slice(1)} Report ${reportId}</title>
          <style>
            @page { size: A4; margin: 1cm; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 1rem; font-size: 0.875rem; color: #000000; background-color: #ffffff; }
            .report { max-width: 210mm; margin: 0 auto; border: 1px solid #000000; padding: 1rem; background-color: #ffffff; }
            .header { text-align: center; border-bottom: 1px dashed #000000; padding-bottom: 1rem; margin-bottom: 1rem; }
            .header h1 { font-size: 1.5rem; margin: 0.5rem 0; color: ${shopColor || "#000000"}; }
            .details { margin-bottom: 1rem; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #000000; padding: 0.5rem; text-align: left; }
            .footer { text-align: center; border-top: 1px dashed #000000; padding-top: 1rem; margin-top: 1rem; }
            .no-print { display: block; }
            @media print {
              .report { border: none; }
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
              <p>Phone: ${phoneNumber}</p>
              <div style="display: flex; justify-content: space-between;">
                <p>${enableGstinPrint ? `GSTIN: ${shopDetails.gstin}` : ''}</p>
                <p>${enablePanPrint ? `PAN Number: ${panNumber}` : ''}</p>
              </div>
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
          <div style="text-align: center; margin-top: 1rem;" class="no-print">
            <button onclick="window.print()" style="padding: 0.5rem 1rem; background-color: #3b82f6; color: #ffffff; border: none; border-radius: 5px; cursor: pointer;">Print</button>
            <button onclick="window.close()" style="padding: 0.5rem 1rem; background-color: #6b7280; color: #ffffff; border: none; border-radius: 5px; cursor: pointer; margin-left: 0.5rem;">Close</button>
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
              <p style={{ fontSize: "1.5rem", fontWeight: "700", color: styles.textColor }}>{stats.totalSales.toLocaleString()}</p>
            </div>
            <DollarSign size={32} style={{ color: styles.statusSuccess }} />
          </div>
        </div>
        <div style={{ backgroundColor: styles.cardBg, padding: "1rem", borderRadius: styles.radius, boxShadow: styles.shadow, textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: "1rem", color: styles.secondaryTextColor }}>Today's Sales</p>
              <p style={{ fontSize: "1.5rem", fontWeight: "700", color: styles.textColor }}>{stats.todaySales.toLocaleString()}</p>
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
              <p style={{ fontSize: "1.5rem", fontWeight: "700", color: styles.textColor }}>{Math.round(stats.avgTransaction).toLocaleString()}</p>
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
            <div style={{ textAlign: "center", padding: "2rem", color: styles.statusWarning, backgroundColor: styles.warningForeground, borderRadius: styles.radius }}>{error}</div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-striped table-bordered">
                  <thead>
                    <tr>
                      {["Invoice ID", "Date", "Customer", "Product", "Quantity", "Amount", "Grand Total", "Manual Total", "Payment", "Action"].map((header) => (
                        <th key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {currentSales.map((sale) => (
                      <tr key={sale._id}>
                        <td>{sale.invoiceId}</td>
                        <td>{new Date(sale.timestamp).toLocaleString()}</td>
                        <td>{sale.customer.name}</td>
                        <td>
                          {sale.items.map((item, index) => (
                            <div key={index}>{item.name} ({item.price.toLocaleString()} x {item.quantity})</div>
                          ))}
                        </td>
                        <td>{sale.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                        <td>{sale.subtotal.toLocaleString()}</td>
                        <td>{sale.total.toLocaleString()}</td>
                        <td>{sale.manualTotal ? `${sale.manualTotal.toLocaleString()}` : 'N/A'}</td>
                        <td>
                          <span style={{ padding: "0.25rem 0.5rem", borderRadius: styles.radius, backgroundColor: styles.secondary, color: styles.secondaryForeground }}>{sale.paymentMethod}</span>
                        </td>
                        <td>
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
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                {["Product", "Quantity Sold", "Revenue"].map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTopProducts.map((item, index) => (
                <tr key={index}>
                  <td>{item.product}</td>
                  <td>{item.quantity}</td>
                  <td>{item.revenue.toLocaleString()}</td>
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
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                {["Customer", "Total Purchases"].map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTopCustomers.map((item, index) => (
                <tr key={index}>
                  <td>{item.customer}</td>
                  <td>{item.amount.toLocaleString()}</td>
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
      return <div style={{ textAlign: "center", padding: "2rem", color: styles.statusWarning, backgroundColor: styles.warningForeground, borderRadius: styles.radius }}>{error}</div>;
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
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  {["Product", "Quantity Sold", "Revenue"].map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stockReportData.sales.map((item) => (
                  <tr key={item._id}>
                    <td>{productMap[item._id] || 'Unknown Product'}</td>
                    <td>{item.totalSold}</td>
                    <td>{item.totalRevenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ color: styles.textColor, margin: "0.5rem 0" }}>Total Quantity Sold: {totalSold}</p>
          <p style={{ color: styles.textColor, margin: "0.5rem 0" }}>Total Revenue: {totalRevenue.toLocaleString()}</p>
          <h6 style={{ color: styles.textColor, margin: "1rem 0" }}>Stock Added</h6>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  {["Product", "Quantity Added"].map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stockReportData.additions.map((item) => (
                  <tr key={item._id}>
                    <td>{productMap[item._id] || 'Unknown Product'}</td>
                    <td>{item.totalAdded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ color: styles.textColor, margin: "0.5rem 0" }}>Total Quantity Added: {totalAdded}</p>
          <h6 style={{ color: styles.textColor, margin: "1rem 0" }}>Current Stock Balance</h6>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  {["Product", "Stock"].map((header) => (
                    <th key={header}>{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stockReportData.current_stock.map((item) => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>{item.stock}</td>
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
  const renderServiceReport = () => (
    <div style={{ backgroundColor: styles.cardBg, borderRadius: styles.radius, boxShadow: styles.shadowCard, marginTop: "1rem" }}>
      <div style={{ padding: "1rem", borderBottom: `1px solid ${styles.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h5 style={{ fontSize: "1.25rem", fontWeight: "600", margin: 0, color: styles.textColor }}>Paid Services</h5>
        <button style={{ padding: "0.5rem 1rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer" }} onClick={() => handlePrint('services')}>
          Print Report
        </button>
      </div>
      <div style={{ padding: "1.5rem" }}>
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                {["Service Number", "Customer Name", "Phone", "Brand", "Model", "Complaint Type", "Description", "Total", "Manual Amount", "Status"].map((header) => (
                  <th key={header}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentPaidServices.map((service) => (
                <tr key={service._id}>
                  <td>{service.serviceNumber}</td>
                  <td>{service.customer.name}</td>
                  <td>{service.customer.phone}</td>
                  <td>{service.device.brand}</td>
                  <td>{service.device.model}</td>
                  <td>{service.problem.complaintType}</td>
                  <td>{service.problem.description}</td>
                  <td>{service.total.toLocaleString()}</td>
                  <td>{service.manualTotal ? `${service.manualTotal.toLocaleString()}` : 'N/A'}</td>
                  <td>{service.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "1rem" }}>
          <button style={{ padding: "0.5rem 1rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer" }} onClick={handlePrevPage} disabled={currentPage === 1 || loading}>
            Previous
          </button>
          <span style={{ color: styles.textColor }}>Page {currentPage} of {totalServicePages}</span>
          <button style={{ padding: "0.5rem 1rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer" }} onClick={handleNextPage} disabled={currentPage === totalServicePages || loading}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
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
      <div className="container-fluid">
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
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {["sales", "products", "customers", "services", "monthlyStock", "yearlyStock"].map((type) => (
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
                     type === "services" ? "Service Report" :
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
              <div className="row g-2">
                <div className="col-md-3">
                  <input
                    type="date"
                    className="form-control"
                    style={{
                      padding: "0.5rem",
                      border: `1px solid ${styles.border}`,
                      borderRadius: styles.radius,
                      backgroundColor: styles.input,
                      color: styles.foreground
                    }}
                    value={dateFrom}
                    onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="date"
                    className="form-control"
                    style={{
                      padding: "0.5rem",
                      border: `1px solid ${styles.border}`,
                      borderRadius: styles.radius,
                      backgroundColor: styles.input,
                      color: styles.foreground
                    }}
                    value={dateTo}
                    onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="time"
                    className="form-control"
                    style={{
                      padding: "0.5rem",
                      border: `1px solid ${styles.border}`,
                      borderRadius: styles.radius,
                      backgroundColor: styles.input,
                      color: styles.foreground
                    }}
                    value={timeFrom}
                    onChange={(e) => { setTimeFrom(e.target.value); setCurrentPage(1); }}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="time"
                    className="form-control"
                    style={{
                      padding: "0.5rem",
                      border: `1px solid ${styles.border}`,
                      borderRadius: styles.radius,
                      backgroundColor: styles.input,
                      color: styles.foreground
                    }}
                    value={timeTo}
                    onChange={(e) => { setTimeTo(e.target.value); setCurrentPage(1); }}
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    style={{
                      padding: "0.5rem",
                      border: `1px solid ${styles.border}`,
                      borderRadius: styles.radius,
                      backgroundColor: styles.input,
                      color: styles.foreground
                    }}
                    value={productFilter}
                    onChange={(e) => { setProductFilter(e.target.value); setCurrentPage(1); }}
                    placeholder="Filter by Product"
                  />
                </div>
                <div className="col-md-6">
                  <input
                    type="text"
                    className="form-control"
                    style={{
                      padding: "0.5rem",
                      border: `1px solid ${styles.border}`,
                      borderRadius: styles.radius,
                      backgroundColor: styles.input,
                      color: styles.foreground
                    }}
                    value={customerFilter}
                    onChange={(e) => { setCustomerFilter(e.target.value); setCurrentPage(1); }}
                    placeholder="Filter by Customer"
                  />
                </div>
              </div>
            )}
            {(selectedReport === "monthlyStock" || selectedReport === "yearlyStock") && (
              <div className="row g-2 mt-3">
                <div className="col-md-4">
                  <label style={{ marginRight: "0.5rem", color: styles.textColor }}>Year:</label>
                  <select
                    className="form-select"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={{
                      padding: "0.5rem",
                      border: `1px solid ${styles.border}`,
                      borderRadius: styles.radius,
                      backgroundColor: styles.input,
                      color: styles.foreground
                    }}
                  >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
                {selectedReport === "monthlyStock" && (
                  <div className="col-md-4">
                    <label style={{ marginRight: "0.5rem", color: styles.textColor }}>Month:</label>
                    <select
                      className="form-select"
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(e.target.value)}
                      style={{
                        padding: "0.5rem",
                        border: `1px solid ${styles.border}`,
                        borderRadius: styles.radius,
                        backgroundColor: styles.input,
                        color: styles.foreground
                      }}
                    >
                      <option value="">Select Month</option>
                      {monthNames.map((month, index) => (
                        <option key={index} value={index + 1}>{month}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div className="col-md-4">
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
              </div>
            )}
          </div>
        </div>
        {reportMessage && <div style={{ padding: "1rem", backgroundColor: styles.success, color: styles.successForeground, borderRadius: styles.radius, marginBottom: "1rem" }}>{reportMessage}</div>}
        {selectedReport === "sales" && renderSalesReport()}
        {selectedReport === "products" && renderProductReport()}
        {selectedReport === "customers" && renderCustomerReport()}
        {selectedReport === "services" && renderServiceReport()}
        {(selectedReport === "monthlyStock" || selectedReport === "yearlyStock") && renderStockReport()}
      </div>
    </div>
  );
};
export default Reports;