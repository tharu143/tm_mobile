
import { useState, useEffect } from "react";
import axios from "axios";

// Inline SVG Icons
const BarChart3 = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"></line>
    <line x1="18" y1="20" x2="18" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="16"></line>
  </svg>
);

const Download = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const TrendingUp = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const DollarSign = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const Printer = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 6 2 18 2 18 9"></polyline>
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
    <rect x="6" y="14" width="12" height="8"></rect>
  </svg>
);

const RefreshCw = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"></polyline>
    <polyline points="1 20 1 14 7 14"></polyline>
    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
  </svg>
);

const Reports = ({ theme }) => {
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

  // Pagination logic for sales, products, and customers
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
          <table style="width decyzja: 100%; border-collapse: collapse;">
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

  const renderSalesReport = () => (
    <div className="space-y-4">
      <div className="row row-cols-1 row-cols-md-5 g-4">
        <div className="col">
          <div className={`card h-100 ${theme === 'light' ? 'bg-white border-dark' : 'bg-dark border-light'}`}>
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <p className={theme === 'light' ? 'text-muted' : 'text-light'}>Total Sales</p>
                <p className={`h4 fw-bold mb-0 ${theme === 'light' ? 'text-dark' : 'text-white'}`}>₹{stats.totalSales.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-success" />
            </div>
          </div>
        </div>
        <div className="col">
          <div className={`card h-100 ${theme === 'light' ? 'bg-white border-dark' : 'bg-dark border-light'}`}>
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <p className={theme === 'light' ? 'text-muted' : 'text-light'}>Total Stock Value</p>
                <p className={`h4 fw-bold mb-0 ${theme === 'light' ? 'text-dark' : 'text-white'}`}>₹{stats.totalStockValue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-info" />
            </div>
          </div>
        </div>
        <div className="col">
          <div className={`card h-100 ${theme === 'light' ? 'bg-white border-dark' : 'bg-dark border-light'}`}>
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <p className={theme === 'light' ? 'text-muted' : 'text-light'}>Today's Sales</p>
                <p className={`h4 fw-bold mb-0 ${theme === 'light' ? 'text-dark' : 'text-white'}`}>₹{stats.todaySales.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
        <div className="col">
          <div className={`card h-100 ${theme === 'light' ? 'bg-white border-dark' : 'bg-dark border-light'}`}>
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <p className={theme === 'light' ? 'text-muted' : 'text-light'}>Total Transactions</p>
                <p className={`h4 fw-bold mb-0 ${theme === 'light' ? 'text-dark' : 'text-white'}`}>{stats.totalTransactions}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-purple" />
            </div>
          </div>
        </div>
        <div className="col">
          <div className={`card h-100 ${theme === 'light' ? 'bg-white border-dark' : 'bg-dark border-light'}`}>
            <div className="card-body d-flex align-items-center justify-content-between">
              <div>
                <p className={theme === 'light' ? 'text-muted' : 'text-light'}>Avg Transaction</p>
                <p className={`h4 fw-bold mb-0 ${theme === 'light' ? 'text-dark' : 'text-white'}`}>₹{Math.round(stats.avgTransaction).toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-warning" />
            </div>
          </div>
        </div>
      </div>
      <div className={`card ${theme === 'light' ? 'bg-white border-dark' : 'bg-dark border-light'}`}>
        <div className={`card-header d-flex justify-content-between align-items-center ${theme === 'light' ? 'bg-white border-dark' : 'bg-dark border-light'}`}>
          <h5 className={`card-title mb-0 ${theme === 'light' ? 'text-dark' : 'text-white'}`}>Recent Sales Transactions</h5>
          <div>
            <button className="btn btn-primary btn-sm me-2" onClick={() => handlePrint('sales')}>
              Print All Sales
            </button>
            <button className="btn btn-outline-primary btn-sm" onClick={fetchData}>
              <RefreshCw className="me-1" /> Refresh
            </button>
          </div>
        </div>
        <div className="card-body">
          {loading ? (
            <div className={`text-center py-5 ${theme === 'light' ? 'text-dark' : 'text-white'}`}>Loading sales...</div>
          ) : error ? (
            <div className={`text-center py-5 ${theme === 'light' ? 'text-danger' : 'text-danger'}`}>{error}</div>
          ) : (
            <>
              <div className="table-responsive">
                <table className={`table table-hover ${theme === 'light' ? 'table-light' : 'table-dark'}`}>
                  <thead>
                    <tr>
                      <th style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>Invoice ID</th>
                      <th style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>Date</th>
                      <th style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>Customer</th>
                      <th style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>Product</th>
                      <th style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>Quantity</th>
                      <th style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>Amount</th>
                      <th style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>Grand Total</th>
                      <th style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>Payment</th>
                      <th style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentSales.map((sale) => (
                      <tr key={sale._id}>
                        <td className="fw-medium" style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>{sale.invoiceId}</td>
                        <td style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>{new Date(sale.timestamp).toLocaleString()}</td>
                        <td style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>{sale.customer.name}</td>
                        <td style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>
                          {sale.items.map((item, index) => (
                            <div key={index}>{item.name} (₹{item.price.toLocaleString()} x {item.quantity})</div>
                          ))}
                        </td>
                        <td style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>{sale.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                        <td style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>₹{sale.subtotal.toLocaleString()}</td>
                        <td style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>₹{sale.total.toLocaleString()}</td>
                        <td style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>
                          <span className={`badge ${theme === 'light' ? 'bg-secondary' : 'bg-secondary'}`}>{sale.paymentMethod}</span>
                        </td>
                        <td style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>
                          <button
                            className={`btn btn-sm ${theme === 'light' ? 'btn-outline-dark' : 'btn-outline-light'}`}
                            onClick={() => handlePrint('sales', sale)}
                          >
                            <Printer />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-4">
                <button
                  className={`btn btn-outline-secondary ${theme === 'light' ? 'text-dark border-dark' : 'text-white border-light'}`}
                  onClick={handlePrevPage}
                  disabled={currentPage === 1 || loading}
                >
                  Previous
                </button>
                <span className={theme === 'light' ? 'text-dark' : 'text-white'}>
                  Page {currentPage} of {totalSalesPages}
                </span>
                <button
                  className={`btn btn-outline-secondary ${theme === 'light' ? 'text-dark border-dark' : 'text-white border-light'}`}
                  onClick={handleNextPage}
                  disabled={currentPage === totalSalesPages || loading}
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

  const renderProductReport = () => (
    <div className={`card ${theme === 'light' ? 'bg-white border-dark' : 'bg-dark border-light'}`}>
      <div className={`card-header d-flex justify-content-between align-items-center ${theme === 'light' ? 'bg-white border-dark' : 'bg-dark border-light'}`}>
        <h5 className={`card-title mb-0 ${theme === 'light' ? 'text-dark' : 'text-white'}`}>Top Selling Products</h5>
        <button className="btn btn-primary btn-sm" onClick={() => handlePrint('products')}>
          Print Report
        </button>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className={`table table-hover ${theme === 'light' ? 'table-light' : 'table-dark'}`}>
            <thead>
              <tr>
                <th style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>Product</th>
                <th style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>Quantity Sold</th>
                <th style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {currentTopProducts.map((item, index) => (
                <tr key={index}>
                  <td className="fw-medium" style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>{item.product}</td>
                  <td style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>{item.quantity}</td>
                  <td style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>₹{item.revenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            className={`btn btn-outline-secondary ${theme === 'light' ? 'text-dark border-dark' : 'text-white border-light'}`}
            onClick={handlePrevPage}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </button>
          <span className={theme === 'light' ? 'text-dark' : 'text-white'}>
            Page {currentPage} of {totalProductPages}
          </span>
          <button
            className={`btn btn-outline-secondary ${theme === 'light' ? 'text-dark border-dark' : 'text-white border-light'}`}
            onClick={handleNextPage}
            disabled={currentPage === totalProductPages || loading}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

  const renderCustomerReport = () => (
    <div className={`card ${theme === 'light' ? 'bg-white border-dark' : 'bg-dark border-light'}`}>
      <div className={`card-header d-flex justify-content-between align-items-center ${theme === 'light' ? 'bg-white border-dark' : 'bg-dark border-light'}`}>
        <h5 className={`card-title mb-0 ${theme === 'light' ? 'text-dark' : 'text-white'}`}>Top Customers</h5>
        <button className="btn btn-primary btn-sm" onClick={() => handlePrint('customers')}>
          Print Report
        </button>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className={`table table-hover ${theme === 'light' ? 'table-light' : 'table-dark'}`}>
            <thead>
              <tr>
                <th style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>Customer</th>
                <th style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>Total Purchases</th>
              </tr>
            </thead>
            <tbody>
              {currentTopCustomers.map((item, index) => (
                <tr key={index}>
                  <td className="fw-medium" style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>{item.customer}</td>
                  <td style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>₹{item.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            className={`btn btn-outline-secondary ${theme === 'light' ? 'text-dark border-dark' : 'text-white border-light'}`}
            onClick={handlePrevPage}
            disabled={currentPage === 1 || loading}
          >
            Previous
          </button>
          <span className={theme === 'light' ? 'text-dark' : 'text-white'}>
            Page {currentPage} of {totalCustomerPages}
          </span>
          <button
            className={`btn btn-outline-secondary ${theme === 'light' ? 'text-dark border-dark' : 'text-white border-light'}`}
            onClick={handleNextPage}
            disabled={currentPage === totalCustomerPages || loading}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );

  const renderStockReport = () => {
    if (loading) {
      return <div className={`text-center py-5 ${theme === 'light' ? 'text-dark' : 'text-white'}`}>Loading stock report...</div>;
    }
    if (error) {
      return <div className={`text-center py-5 ${theme === 'light' ? 'text-danger' : 'text-danger'}`}>{error}</div>;
    }
    if (!stockReportData) {
      return <div className={`text-center py-5 ${theme === 'light' ? 'text-dark' : 'text-white'}`}>Please generate the stock report</div>;
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
      <div className={`card ${theme === 'light' ? 'bg-white border-dark' : 'bg-dark border-light'}`}>
        <div className={`card-header d-flex justify-content-between align-items-center ${theme === 'light' ? 'bg-white border-dark' : 'bg-dark border-light'}`}>
          <h5 className={`card-title mb-0 ${theme === 'light' ? 'text-dark' : 'text-white'}`}>
            {selectedReport === "monthlyStock" 
              ? `Monthly Stock Report for ${monthNames[selectedMonth - 1]} ${selectedYear}` 
              : `Yearly Stock Report for ${selectedYear}`}
          </h5>
          <button className="btn btn-primary btn-sm" onClick={() => handlePrint(selectedReport)}>
            Print Report
          </button>
        </div>
        <div className="card-body">
          <h6 className={theme === 'light' ? 'text-dark' : 'text-white'}>Stock Sold</h6>
          <div className="table-responsive">
            <table className={`table table-hover ${theme === 'light' ? 'table-light' : 'table-dark'}`}>
              <thead>
                <tr>
                  <th style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>Product</th>
                  <th style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>Quantity Sold</th>
                  <th style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>Revenue</th>
                </tr>
              </thead>
              <tbody>
                {stockReportData.sales.map((item) => (
                  <tr key={item._id}>
                    <td style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>{productMap[item._id] || 'Unknown Product'}</td>
                    <td style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>{item.totalSold}</td>
                    <td style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>₹{item.totalRevenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={theme === 'light' ? 'text-dark' : 'text-white'}>Total Quantity Sold: {totalSold}</p>
          <p className={theme === 'light' ? 'text-dark' : 'text-white'}>Total Revenue: ₹{totalRevenue.toLocaleString()}</p>

          <h6 className={theme === 'light' ? 'text-dark' : 'text-white'}>Stock Added</h6>
          <div className="table-responsive">
            <table className={`table table-hover ${theme === 'light' ? 'table-light' : 'table-dark'}`}>
              <thead>
                <tr>
                  <th style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>Product</th>
                  <th style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>Quantity Added</th>
                </tr>
              </thead>
              <tbody>
                {stockReportData.additions.map((item) => (
                  <tr key={item._id}>
                    <td style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>{productMap[item._id] || 'Unknown Product'}</td>
                    <td style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>{item.totalAdded}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={theme === 'light' ? 'text-dark' : 'text-white'}>Total Quantity Added: {totalAdded}</p>

          <h6 className={theme === 'light' ? 'text-dark' : 'text-white'}>Current Stock Balance</h6>
          <div className="table-responsive">
            <table className={`table table-hover ${theme === 'light' ? 'table-light' : 'table-dark'}`}>
              <thead>
                <tr>
                  <th style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>Product</th>
                  <th style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>Stock</th>
                </tr>
              </thead>
              <tbody>
                {stockReportData.current_stock.map((item) => (
                  <tr key={item._id}>
                    <td style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>{item.name}</td>
                    <td style={{ borderColor: theme === 'light' ? '#000000' : '#ffffff', color: theme === 'light' ? '#000000' : '#ffffff' }}>{item.stock}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className={theme === 'light' ? 'text-dark' : 'text-white'}>Total Current Stock: {totalStock}</p>
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
    <div className={`container py-4 ${theme === 'light' ? 'bg-light text-dark' : 'bg-dark text-white'}`} style={{ minHeight: '100vh' }}>
      <div className="mb-4">
        <h1 className={`display-6 fw-bold ${theme === 'light' ? 'text-dark' : 'text-white'}`}>Reports & Analytics</h1>
        <p className={theme === 'light' ? 'text-muted' : 'text-light'}>Analyze your business performance and trends</p>
      </div>
      <div className={`card mb-4 ${theme === 'light' ? 'bg-white border-dark' : 'bg-dark border-light'}`}>
        <div className={`card-header d-flex align-items-center ${theme === 'light' ? 'bg-white border-dark' : 'bg-dark border-light'}`}>
          <BarChart3 className="me-2" />
          <h5 className={`card-title mb-0 ${theme === 'light' ? 'text-dark' : 'text-white'}`}>Report Configuration</h5>
        </div>
        <div className="card-body">
          <div className="d-flex flex-wrap gap-3 align-items-center mb-3">
            <div className="btn-group">
              <button
                className={`btn ${selectedReport === "sales" ? "btn-primary" : theme === 'light' ? "btn-outline-dark" : "btn-outline-light"}`}
                onClick={() => handleReportTypeChange("sales")}
              >
                Sales Report
              </button>
              <button
                className={`btn ${selectedReport === "products" ? "btn-primary" : theme === 'light' ? "btn-outline-dark" : "btn-outline-light"}`}
                onClick={() => handleReportTypeChange("products")}
              >
                Product Report
              </button>
              <button
                className={`btn ${selectedReport === "customers" ? "btn-primary" : theme === 'light' ? "btn-outline-dark" : "btn-outline-light"}`}
                onClick={() => handleReportTypeChange("customers")}
              >
                Customer Report
              </button>
              <button
                className={`btn ${selectedReport === "monthlyStock" ? "btn-primary" : theme === 'light' ? "btn-outline-dark" : "btn-outline-light"}`}
                onClick={() => handleReportTypeChange("monthlyStock")}
              >
                Monthly Stock Report
              </button>
              <button
                className={`btn ${selectedReport === "yearlyStock" ? "btn-primary" : theme === 'light' ? "btn-outline-dark" : "btn-outline-light"}`}
                onClick={() => handleReportTypeChange("yearlyStock")}
              >
                Yearly Stock Report
              </button>
            </div>
            <button className="btn btn-outline-success d-flex align-items-center" onClick={exportReport}>
              <Download className="me-2" />
              Export
            </button>
          </div>
          {selectedReport === "sales" && (
            <div className="d-flex flex-wrap gap-3 align-items-center">
              <div className="d-flex align-items-center gap-2">
                <input
                  type="date"
                  className={`form-control ${theme === 'light' ? 'bg-white text-dark border-dark' : 'bg-dark text-white border-white'}`}
                  value={dateFrom}
                  onChange={(e) => { setDateFrom(e.target.value); setCurrentPage(1); }}
                  placeholder="From Date"
                  style={{ width: "auto" }}
                />
                <span className={theme === 'light' ? 'text-dark' : 'text-white'}>to</span>
                <input
                  type="date"
                  className={`form-control ${theme === 'light' ? 'bg-white text-dark border-dark' : 'bg-dark text-white border-white'}`}
                  value={dateTo}
                  onChange={(e) => { setDateTo(e.target.value); setCurrentPage(1); }}
                  placeholder="To Date"
                  style={{ width: "auto" }}
                />
              </div>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="time"
                  className={`form-control ${theme === 'light' ? 'bg-white text-dark border-dark' : 'bg-dark text-white border-white'}`}
                  value={timeFrom}
                  onChange={(e) => { setTimeFrom(e.target.value); setCurrentPage(1); }}
                  placeholder="From Time"
                  style={{ width: "auto" }}
                />
                <span className={theme === 'light' ? 'text-dark' : 'text-white'}>to</span>
                <input
                  type="time"
                  className={`form-control ${theme === 'light' ? 'bg-white text-dark border-dark' : 'bg-dark text-white border-white'}`}
                  value={timeTo}
                  onChange={(e) => { setTimeTo(e.target.value); setCurrentPage(1); }}
                  placeholder="To Time"
                  style={{ width: "auto" }}
                />
              </div>
              <input
                type="text"
                className={`form-control ${theme === 'light' ? 'bg-white text-dark border-dark' : 'bg-dark text-white border-white'}`}
                value={productFilter}
                onChange={(e) => { setProductFilter(e.target.value); setCurrentPage(1); }}
                placeholder="Filter by Product"
                style={{ width: "200px" }}
              />
              <input
                type="text"
                className={`form-control ${theme === 'light' ? 'bg-white text-dark border-dark' : 'bg-dark text-white border-white'}`}
                value={customerFilter}
                onChange={(e) => { setCustomerFilter(e.target.value); setCurrentPage(1); }}
                placeholder="Filter by Customer"
                style={{ width: "200px" }}
              />
            </div>
          )}
          {(selectedReport === "monthlyStock" || selectedReport === "yearlyStock") && (
            <div className="mt-3">
              <label className="me-2">Year:</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className={`form-select d-inline-block w-auto ${theme === 'light' ? 'bg-white text-dark' : 'bg-dark text-white'}`}
              >
                <option value="">Select Year</option>
                {years.map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
              {selectedReport === "monthlyStock" && (
                <>
                  <label className="ms-3 me-2">Month:</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className={`form-select d-inline-block w-auto ${theme === 'light' ? 'bg-white text-dark' : 'bg-dark text-white'}`}
                  >
                    <option value="">Select Month</option>
                    {monthNames.map((month, index) => (
                      <option key={index} value={index + 1}>{month}</option>
                    ))}
                  </select>
                </>
              )}
              <button
                className="btn btn-primary ms-3"
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
