import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, ShoppingCart, Sun, Moon, Leaf, Grid } from "lucide-react";
// Inline SVG Icons
const SearchIcon = ({ style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={style}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);
const PointOfSale = ({ theme, setTheme }) => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [gstPercentage, setGstPercentage] = useState(18);
  const [enableGst, setEnableGst] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobiles, setMobiles] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [showModelPopup, setShowModelPopup] = useState(false);
  const [selectedModel, setSelectedModel] = useState("");
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [invoiceData, setInvoiceData] = useState(null);
  const [shopDetails, setShopDetails] = useState({
    shopName: "Mobile Shop",
    address: "143 Shop Street, City, Country",
    gstin: "12345g1q2334",
  });
  const [shopColor, setShopColor] = useState("#000000");
  const [enableGstinPrint, setEnableGstinPrint] = useState(true);
  const [enablePanPrint, setEnablePanPrint] = useState(true);
  const [enableTermsPrint, setEnableTermsPrint] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState("8921083090");
  const [panNumber, setPanNumber] = useState("AVHPC9999A");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [warning, setWarning] = useState("");
  const [manualTotal, setManualTotal] = useState("");
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
  const hexToRgba = (hex, alpha = 0.2) => {
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  };
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsRes, mobilesRes, accessoriesRes, settingsRes, printRes] = await Promise.all([
          axios.get("http://localhost:5000/api/products"),
          axios.get("http://localhost:5000/api/mobiles"),
          axios.get("http://localhost:5000/api/accessories"),
          axios.get("http://localhost:5000/api/settings"),
          axios.get("http://localhost:5000/api/print"),
        ]);
        setProducts(productsRes.data);
        setMobiles(mobilesRes.data);
        setAccessories(accessoriesRes.data);
        setGstPercentage(settingsRes.data.gstPercentage || 18);
        setEnableGst(settingsRes.data.enableGst !== undefined ? settingsRes.data.enableGst : true);
        setShopDetails({
          shopName: printRes.data.shopName || "Mobile Shop",
          address: printRes.data.address || "143 Shop Street, City, Country",
          gstin: printRes.data.gstin || "12345g1q2334",
        });
        setShopColor(printRes.data.shopColor || "#000000");
        setEnableGstinPrint(printRes.data.enableGstinPrint !== undefined ? printRes.data.enableGstinPrint : true);
        setEnablePanPrint(printRes.data.enablePanPrint !== undefined ? printRes.data.enablePanPrint : true);
        setEnableTermsPrint(printRes.data.enableTermsPrint !== undefined ? printRes.data.enableTermsPrint : true);
        setPhoneNumber(printRes.data.phoneNumber || "8921083090");
        setPanNumber(printRes.data.panNumber || "AVHPC9999A");
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data");
        setLoading(false);
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const fetchCustomerSuggestions = async () => {
      if (customerName.trim() || customerPhone.trim()) {
        try {
          const response = await axios.get("http://localhost:5000/api/customers/search", {
            params: { query: customerName || customerPhone },
          });
          setCustomerSuggestions(response.data);
        } catch (err) {
          console.error("Error fetching customer suggestions:", err);
          setCustomerSuggestions([]);
        }
      } else {
        setCustomerSuggestions([]);
      }
    };
    fetchCustomerSuggestions();
  }, [customerName, customerPhone]);
  const showWarning = (msg) => {
    setWarning(msg);
    setTimeout(() => setWarning(""), 5000);
  };
  const categories = ["All", ...new Set(products.map((p) => p.category))];
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesModel =
      !selectedModel ||
      (selectedCategory === "Mobile" && product.model === selectedModel) ||
      (selectedCategory === "Accessories" && product.accessoryType === selectedModel);
    return matchesSearch && matchesCategory && matchesModel;
  });
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product._id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) {
        setCart((cartItems) =>
          cartItems.map((item) =>
            item.id === product._id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      } else {
        showWarning("Not enough stock available!");
      }
    } else {
      setCart([...cart, { ...product, id: product._id, quantity: 1 }]);
    }
  };
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity === 0) {
      setCart(cart.filter((item) => item.id !== id));
    } else {
      const product = products.find((p) => p._id === id);
      if (newQuantity <= product.stock) {
        setCart((cartItems) =>
          cartItems.map((item) =>
            item.id === id ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        showWarning("Not enough stock available!");
      }
    }
  };
  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id === id));
  };
  const selectCustomer = (customer) => {
    setCustomerName(customer.name);
    setCustomerPhone(customer.phone);
    setSelectedCustomer(customer);
    setCustomerSuggestions([]);
  };
  const selectModel = (model) => {
    setSelectedModel(model);
    setShowModelPopup(false);
  };
  const getSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  const getTax = () => {
    if (!enableGst) return 0;
    return getSubtotal() * (gstPercentage / 100);
  };
  const getTotal = () => {
    return getSubtotal() + getTax();
  };
  const processSale = async () => {
    if (cart.length === 0) {
      showWarning("Cart is empty!");
      return;
    }
    if (!customerName || !customerPhone) {
      showWarning("Please enter customer details!");
      return;
    }
    const calculatedTotal = getTotal();
    const finalTotal = manualTotal ? parseFloat(manualTotal) : calculatedTotal;
    const saleData = {
      customer: {
        name: customerName,
        phone: customerPhone,
        id: selectedCustomer ? selectedCustomer._id : null,
      },
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      subtotal: getSubtotal(),
      tax: getTax(),
      total: calculatedTotal,
      manualTotal: manualTotal ? parseFloat(manualTotal) : null,
      paymentMethod: paymentMethod,
      timestamp: new Date().toISOString(),
      invoiceId: `INV-${Date.now()}`,
      gstPercentage: enableGst ? gstPercentage : 0,
    };
    try {
      await axios.post("http://localhost:5000/api/sales", saleData);
      setProducts((prevProducts) =>
        prevProducts.map((product) => {
          const cartItem = cart.find((item) => item.id === product._id);
          if (cartItem) {
            return { ...product, stock: product.stock - cartItem.quantity };
          }
          return product;
        })
      );
      setInvoiceData(saleData);
      setShowPrintPreview(true);
      setCart([]);
      setCustomerName("");
      setCustomerPhone("");
      setSelectedCustomer(null);
      setCustomerSuggestions([]);
      setSelectedModel("");
      setManualTotal("");
    } catch (err) {
      console.error("Error processing sale:", err);
      showWarning("Failed to process sale. Please try again.");
    }
  };
  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoiceData.invoiceId}</title>
          <style>
            @page {
              size: A4;
              margin: 1cm;
            }
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 1rem;
              font-size: 0.875rem;
              color: #000000;
              background-color: #ffffff;
            }
            .invoice {
              max-width: 210mm;
              margin: 0 auto;
              border: 1px solid #000;
              border-radius: 0.25rem;
              padding: 1rem;
            }
            .header {
              text-align: center;
              margin-bottom: 1rem;
            }
            .header h1 {
              font-size: 1.5rem;
              font-weight: bold;
              color: ${shopColor || "#000000"};
            }
            .header p {
              margin: 0;
            }
            .details {
              display: flex;
              justify-content: space-between;
              margin-bottom: 1rem;
            }
            .bill-to {
              border: 1px solid #000;
              padding: 0.5rem;
            }
            .invoice-info {
              border: 1px solid #000;
              padding: 0.5rem;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 1rem;
            }
            th, td {
              border: 1px solid #000;
              padding: 0.5rem;
              text-align: left;
            }
            th {
              background-color: ${hexToRgba(shopColor || "#000000", 0.2)};
            }
            .totals tr:last-child {
              background-color: ${hexToRgba(shopColor || "#000000", 0.2)};
            }
            .terms {
              margin-bottom: 1rem;
            }
            .signature {
              text-align: center;
            }
            .signature-line {
              border-bottom: 1px solid #000;
              width: 200px;
              margin: 2rem auto 0.5rem;
            }
            @media print {
              .invoice {
                border: none;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice">
            <div class="header">
              <h1>${shopDetails.shopName}</h1>
              <p>${shopDetails.address}</p>
              <p>Phone: ${phoneNumber}</p>
              <div class="details">
                ${enableGstinPrint ? `<p>GSTIN: ${shopDetails.gstin}</p>` : ''}
                ${enablePanPrint ? `<p>PAN Number: ${panNumber}</p>` : ''}
              </div>
            </div>
            <table>
              <tbody>
                <tr>
                  <td class="bill-to">
                    <strong>BILL TO</strong><br />
                    ${invoiceData.customer.name}<br />
                    Phone: ${invoiceData.customer.phone}
                  </td>
                  <td class="invoice-info">
                    <strong>Invoice No</strong><br />
                    ${invoiceData.invoiceId}
                  </td>
                  <td class="invoice-info">
                    <strong>Invoice Date</strong><br />
                    ${new Date(invoiceData.timestamp).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
            <table>
              <thead>
                <tr>
                  <th>Sr. No.</th>
                  <th>Items</th>
                  <th>Quantity</th>
                  <th>Price / Unit</th>
                  <th>Tax Rate</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${invoiceData.items.map((item, index) => `
                  <tr>
                    <td>${index + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>Rs. ${item.price.toFixed(2)}</td>
                    <td>${gstPercentage}%</td>
                    <td>Rs. ${(item.price * item.quantity + item.price * item.quantity * (gstPercentage / 100)).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
            <table class="totals">
              <tbody>
                <tr>
                  <td style="text-align: right"><strong>Sub Total</strong></td>
                  <td></td>
                  <td></td>
                  <td style="text-align: right">Rs. ${invoiceData.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="text-align: right"><strong>GST</strong></td>
                  <td></td>
                  <td>Rs. ${invoiceData.tax.toFixed(2)}</td>
                  <td style="text-align: right">Rs. ${invoiceData.tax.toFixed(2)}</td>
                </tr>
                <tr>
                  <td><strong>Grand Total</strong></td>
                  <td></td>
                  <td></td>
                  <td style="text-align: right">Rs. ${invoiceData.total.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
            ${enableTermsPrint ? `
              <div class="terms">
                <strong>Terms & Conditions</strong>
                <ol>
                  <li>Note: Verbal Deal</li>
                  <li>Customer will pay the GST</li>
                  <li>Customer will pay the Delivery charges</li>
                  <li>Pay due amount within 15 days</li>
                </ol>
              </div>
            ` : ''}
            <div class="signature">
              <div class="signature-line"></div>
              <strong>Authorized Signature for ${shopDetails.shopName}</strong>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };
  const themeOptions = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "nature", label: "Nature", icon: Leaf },
    { id: "sunset", label: "Sunset", icon: Grid },
  ];
  const selectedTheme = themeOptions.find((t) => t.id === theme) || themeOptions[0];
  if (loading) {
    return <div style={{ textAlign: "center", padding: "2rem", color: styles.textColor }}>Loading products...</div>;
  }
  if (error) {
    return <div style={{ textAlign: "center", padding: "2rem", color: styles.destructive }}>{error}</div>;
  }
  return (
    <div style={{ backgroundColor: styles.bgColor, color: styles.foreground, minHeight: "100vh", display: "flex", flexDirection: isMobile ? "column" : "row", overflowX: "hidden" }}>
      <div style={{ flexGrow: 1, padding: "2rem", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
          <div>
            <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: styles.textColor }}>Point of Sale</h1>
            <p style={{ fontSize: "1rem", color: styles.secondaryTextColor }}>
              Select products to add to cart | GST: {enableGst ? `${gstPercentage}%` : "Not Applied"}
            </p>
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
        <div style={{ marginBottom: "1rem" }}>
          <div style={{ position: "relative", marginBottom: "1rem" }}>
            <SearchIcon style={{ position: "absolute", left: "0.75rem", top: "0.75rem", color: styles.mutedForeground }} />
            <input
              type="text"
              style={{
                paddingLeft: "2.5rem",
                width: "100%",
                padding: "0.5rem",
                border: `1px solid ${styles.border}`,
                borderRadius: styles.radius,
                backgroundColor: styles.input,
                color: styles.foreground
              }}
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {categories.map((category) => (
              <button
                key={category}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: selectedCategory === category ? styles.primary : styles.buttonOutlineBg,
                  color: selectedCategory === category ? styles.primaryForeground : styles.buttonOutlineText,
                  border: `1px solid ${styles.border}`,
                  borderRadius: styles.radius,
                  cursor: "pointer"
                }}
                onClick={() => {
                  setSelectedCategory(category);
                  setSelectedModel("");
                }}
              >
                {category}
              </button>
            ))}
            {(selectedCategory === "Mobile" || selectedCategory === "Accessories") && (
              <button
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: styles.buttonOutlineBg,
                  color: styles.buttonOutlineText,
                  border: `1px solid ${styles.border}`,
                  borderRadius: styles.radius,
                  cursor: "pointer"
                }}
                onClick={() => setShowModelPopup(true)}
              >
                Select Model
              </button>
            )}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))", gap: "1rem" }}>
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                style={{
                  backgroundColor: styles.cardBg,
                  borderRadius: styles.radius,
                  boxShadow: styles.shadowCard,
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onClick={() => addToCart(product)}
                onMouseEnter={(e) => { e.currentTarget.style.transform = styles.cardHoverTransform; e.currentTarget.style.boxShadow = styles.cardHoverShadow; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = styles.shadowCard; }}
              >
                <div style={{ padding: "1rem" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{
                      height: "8rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                      backgroundColor: styles.muted
                    }}>
                      {product.image ? (
                        <img
                          src={`http://localhost:5000${product.image}`}
                          alt={product.name}
                          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                        />
                      ) : (
                        <Smartphone size={48} style={{ color: styles.mutedForeground }} />
                      )}
                    </div>
                    <h3 style={{ fontSize: "1rem", fontWeight: "600", marginBottom: "0.5rem", color: styles.textColor }}>{product.name}</h3>
                    <p style={{ color: styles.primary, fontWeight: "600", marginBottom: "0.5rem" }}>₹{product.price.toLocaleString()}</p>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.5rem",
                          borderRadius: styles.radius,
                          backgroundColor: product.stock > 10 ? styles.statusSuccess : product.stock > 0 ? styles.statusWarning : styles.statusDestructive,
                          color: product.stock > 10 ? styles.successForeground : product.stock > 0 ? styles.warningForeground : styles.destructiveForeground
                        }}
                      >
                        Stock: {product.stock}
                      </span>
                      <span style={{ padding: "0.25rem 0.5rem", borderRadius: styles.radius, backgroundColor: styles.secondary, color: styles.secondaryForeground }}>
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ width: isMobile ? "100%" : "25rem", minWidth: isMobile ? "auto" : "24rem", backgroundColor: styles.cardBg, borderLeft: isMobile ? "none" : `1px solid ${styles.border}`, borderTop: isMobile ? `1px solid ${styles.border}` : "none" }}>
        <div style={{ padding: "1rem", borderBottom: `1px solid ${styles.border}` }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "0.5rem", color: styles.textColor }}>
            <ShoppingCart size={20} />
            Cart ({cart.length || 0})
          </h2>
        </div>
        <div style={{ padding: "1rem", borderBottom: `1px solid ${styles.border}` }}>
          <h3 style={{ fontSize: "1rem", fontWeight: "500", color: styles.textColor }}>Customer Details</h3>
          <div style={{ position: "relative", marginBottom: "0.5rem" }}>
            <input
              type="text"
              style={{
                width: "100%",
                padding: "0.5rem",
                border: `1px solid ${styles.border}`,
                borderRadius: styles.radius,
                backgroundColor: styles.input,
                color: styles.foreground
              }}
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                setSelectedCustomer(null);
              }}
            />
            {customerSuggestions.length > 0 && !selectedCustomer && (
              <ul
                style={{
                  position: "absolute",
                  width: "100%",
                  backgroundColor: styles.dropdownBg,
                  border: `1px solid ${styles.border}`,
                  borderRadius: styles.radius,
                  maxHeight: "200px",
                  overflowY: "auto",
                  zIndex: 10
                }}
              >
                {customerSuggestions.map((customer) => (
                  <li
                    key={customer._id}
                    style={{
                      padding: "0.5rem",
                      cursor: "pointer",
                      color: styles.textColor,
                      transition: "background-color 0.2s"
                    }}
                    onClick={() => selectCustomer(customer)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.muted}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.dropdownBg}
                  >
                    {customer.name} ({customer.phone}) - Balance: ₹{customer.posBalance?.toLocaleString() || 0}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              style={{
                width: "100%",
                padding: "0.5rem",
                border: `1px solid ${styles.border}`,
                borderRadius: styles.radius,
                backgroundColor: styles.input,
                color: styles.foreground
              }}
              placeholder="Phone Number"
              value={customerPhone}
              onChange={(e) => {
                setCustomerPhone(e.target.value);
                setSelectedCustomer(null);
              }}
            />
            {customerSuggestions.length > 0 && !selectedCustomer && (
              <ul
                style={{
                  position: "absolute",
                  width: "100%",
                  backgroundColor: styles.dropdownBg,
                  border: `1px solid ${styles.border}`,
                  borderRadius: styles.radius,
                  maxHeight: "200px",
                  overflowY: "auto",
                  zIndex: 10
                }}
              >
                {customerSuggestions.map((customer) => (
                  <li
                    key={customer._id}
                    style={{
                      padding: "0.5rem",
                      cursor: "pointer",
                      color: styles.textColor,
                      transition: "background-color 0.2s"
                    }}
                    onClick={() => selectCustomer(customer)}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.muted}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.dropdownBg}
                  >
                    {customer.name} ({customer.phone}) - Balance: ₹{customer.posBalance?.toLocaleString() || 0}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {selectedCustomer && (
            <p style={{ marginTop: "0.5rem", color: styles.secondaryTextColor }}>
              POS Balance: ₹{selectedCustomer.posBalance?.toLocaleString() || 0}
            </p>
          )}
        </div>
        <div style={{ flexGrow: 1, overflow: "auto", padding: "1rem" }}>
          {cart.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: styles.mutedForeground }}>
              <ShoppingCart size={20} />
              <p>Cart is empty</p>
              <p style={{ fontSize: "0.875rem" }}>Add products to get started</p>
            </div>
          ) : (
            <div>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    padding: "0.75rem",
                    border: `1px solid ${styles.border}`,
                    borderRadius: styles.radius,
                    marginBottom: "0.75rem"
                  }}
                >
                  <div
                    style={{
                      width: "3rem",
                      height: "3rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: styles.radius,
                      backgroundColor: styles.muted
                    }}
                  >
                    {item.image ? (
                      <img
                        src={`http://localhost:5000${item.image}`}
                        alt={item.name}
                        style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                      />
                    ) : (
                      <Smartphone size={24} style={{ color: styles.mutedForeground }} />
                    )}
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <h4 style={{ fontSize: "1rem", marginBottom: "0.25rem", color: styles.textColor }}>{item.name}</h4>
                    <p style={{ fontSize: "0.875rem", color: styles.secondaryTextColor }}>₹{item.price.toLocaleString()}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <button
                      style={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: styles.buttonOutlineBg,
                        color: styles.buttonOutlineText,
                        border: `1px solid ${styles.border}`,
                        borderRadius: styles.radius,
                        cursor: "pointer"
                      }}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ padding: "0 0.5rem" }}>{item.quantity}</span>
                    <button
                      style={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: styles.buttonOutlineBg,
                        color: styles.buttonOutlineText,
                        border: `1px solid ${styles.border}`,
                        borderRadius: styles.radius,
                        cursor: "pointer"
                      }}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus size={12} />
                    </button>
                    <button
                      style={{
                        padding: "0.25rem 0.5rem",
                        backgroundColor: styles.destructive,
                        color: styles.destructiveForeground,
                        border: "none",
                        borderRadius: styles.radius,
                        cursor: "pointer"
                      }}
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div style={{ padding: "1rem", borderTop: `1px solid ${styles.border}` }}>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: styles.textColor }}>Subtotal:</span>
                <span style={{ color: styles.textColor }}>₹{getSubtotal().toLocaleString()}</span>
              </div>
              {enableGst && (
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ color: styles.textColor }}>GST ({gstPercentage}%):</span>
                  <span style={{ color: styles.textColor }}>₹{getTax().toLocaleString()}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", paddingTop: "0.5rem", borderTop: `1px solid ${styles.border}` }}>
                <span style={{ color: styles.textColor }}>Total:</span>
                <span style={{ color: styles.textColor }}>₹{getTotal().toLocaleString()}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ color: styles.textColor }}>Manual Total:</span>
                <input
                  type="number"
                  style={{
                    width: "100px",
                    padding: "0.25rem",
                    border: `1px solid ${styles.border}`,
                    borderRadius: styles.radius,
                    backgroundColor: styles.input,
                    color: styles.foreground
                  }}
                  value={manualTotal}
                  onChange={(e) => setManualTotal(e.target.value)}
                />
              </div>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", color: styles.textColor }}>Payment Method:</label>
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  style={{
                    flexGrow: 1,
                    padding: "0.5rem",
                    backgroundColor: paymentMethod === "cash" ? styles.primary : styles.buttonOutlineBg,
                    color: paymentMethod === "cash" ? styles.primaryForeground : styles.buttonOutlineText,
                    border: `1px solid ${styles.border}`,
                    borderRadius: styles.radius,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem"
                  }}
                  onClick={() => setPaymentMethod("cash")}
                >
                  <Banknote size={16} />
                  Cash
                </button>
                <button
                  style={{
                    flexGrow: 1,
                    padding: "0.5rem",
                    backgroundColor: paymentMethod === "card" ? styles.primary : styles.buttonOutlineBg,
                    color: paymentMethod === "card" ? styles.primaryForeground : styles.buttonOutlineText,
                    border: `1px solid ${styles.border}`,
                    borderRadius: styles.radius,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem"
                  }}
                  onClick={() => setPaymentMethod("card")}
                >
                  <CreditCard size={16} />
                  Card
                </button>
              </div>
            </div>
            <button
              style={{
                width: "100%",
                padding: "0.5rem",
                backgroundColor: styles.primary,
                color: styles.primaryForeground,
                border: "none",
                borderRadius: styles.radius,
                cursor: "pointer"
              }}
              onClick={processSale}
            >
              Complete Sale
            </button>
          </div>
        )}
      </div>
      {showModelPopup && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: styles.popupBg,
              borderRadius: styles.radius,
              padding: "1rem",
              width: isMobile ? "90%" : "400px",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: styles.shadowElegant
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "600", color: styles.textColor }}>Select Model</h3>
              <button
                style={{
                  padding: "0.25rem 0.5rem",
                  backgroundColor: styles.buttonOutlineBg,
                  color: styles.buttonOutlineText,
                  border: `1px solid ${styles.border}`,
                  borderRadius: styles.radius,
                  cursor: "pointer"
                }}
                onClick={() => setShowModelPopup(false)}
              >
                Close
              </button>
            </div>
            {selectedCategory === "Mobile" && mobiles.length === 0 && (
              <p style={{ textAlign: "center", color: styles.mutedForeground }}>No mobile models found</p>
            )}
            {selectedCategory === "Accessories" && accessories.length === 0 && (
              <p style={{ textAlign: "center", color: styles.mutedForeground }}>No accessory models found</p>
            )}
            {selectedCategory === "Mobile" &&
              mobiles.map((mobile) => (
                <div
                  key={mobile._id}
                  style={{
                    padding: "0.5rem",
                    border: `1px solid ${styles.border}`,
                    borderRadius: styles.radius,
                    marginBottom: "0.5rem",
                    cursor: "pointer",
                    color: styles.textColor,
                    transition: "background-color 0.2s"
                  }}
                  onClick={() => selectModel(mobile.name)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.muted}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.popupBg}
                >
                  {mobile.name}
                </div>
              ))}
            {selectedCategory === "Accessories" &&
              accessories.map((accessory) => (
                <div
                  key={accessory._id}
                  style={{
                    padding: "0.5rem",
                    border: `1px solid ${styles.border}`,
                    borderRadius: styles.radius,
                    marginBottom: "0.5rem",
                    cursor: "pointer",
                    color: styles.textColor,
                    transition: "background-color 0.2s"
                  }}
                  onClick={() => selectModel(`${accessory.accessoryModel} - ${accessory.accessoryName}`)}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = styles.muted}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = styles.popupBg}
                >
                  {accessory.accessoryModel} - {accessory.accessoryName}
                </div>
              ))}
          </div>
        </div>
      )}
      {showPrintPreview && invoiceData && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000
          }}
        >
          <div
            style={{
              backgroundColor: styles.popupBg,
              borderRadius: styles.radius,
              padding: "1rem",
              width: isMobile ? "90%" : "500px",
              height: "auto",
              overflowY: "visible",
              boxShadow: styles.shadowElegant
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "600", color: styles.textColor }}>Invoice Preview</h3>
              <button
                style={{
                  padding: "0.25rem 0.5rem",
                  backgroundColor: styles.buttonOutlineBg,
                  color: styles.buttonOutlineText,
                  border: `1px solid ${styles.border}`,
                  borderRadius: styles.radius,
                  cursor: "pointer"
                }}
                onClick={() => setShowPrintPreview(false)}
              >
                Close
              </button>
            </div>
            <div
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "12px",
                border: `1px solid ${styles.border}`,
                padding: "10px",
                backgroundColor: styles.cardBg,
                color: styles.textColor
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  borderBottom: `1px dashed ${styles.border}`,
                  paddingBottom: "10px",
                  marginBottom: "10px",
                }}
              >
                <h1 style={{ fontSize: "16px", margin: "5px 0", color: styles.textColor }}>${shopDetails.shopName}</h1>
                <p style={{ color: styles.textColor }}>${shopDetails.address}</p>
                <p style={{ color: styles.textColor }}>Phone: ${phoneNumber}</p>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <p style={{ color: styles.textColor }}>${enableGstinPrint ? `GSTIN: ${shopDetails.gstin}` : ''}</p>
                  <p style={{ color: styles.textColor }}>${enablePanPrint ? `PAN Number: ${panNumber}` : ''}</p>
                </div>
                <p style={{ color: styles.textColor }}>Invoice: ${invoiceData.invoiceId}</p>
                <p style={{ color: styles.textColor }}>Date: ${new Date(invoiceData.timestamp).toLocaleString()}</p>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <p style={{ color: styles.textColor }}>
                  <strong>Customer:</strong> ${invoiceData.customer.name}
                </p>
                <p style={{ color: styles.textColor }}>
                  <strong>Phone:</strong> ${invoiceData.customer.phone}
                </p>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tr>
                    <th style={{ border: `1px solid ${styles.border}`, padding: "5px", textAlign: "left", color: styles.textColor }}>Item</th>
                    <th style={{ border: `1px solid ${styles.border}`, padding: "5px", textAlign: "left", color: styles.textColor }}>Qty</th>
                    <th style={{ border: `1px solid ${styles.border}`, padding: "5px", textAlign: "left", color: styles.textColor }}>Price</th>
                    <th style={{ border: `1px solid ${styles.border}`, padding: "5px", textAlign: "left", color: styles.textColor }}>Tax Rate</th>
                    <th style={{ border: `1px solid ${styles.border}`, padding: "5px", textAlign: "left", color: styles.textColor }}>Total</th>
                  </tr>
                  ${invoiceData.items
                    .map(
                      (item) => `
                  <tr>
                    <td style={{ border: \`1px solid \${styles.border}\`, padding: "5px", color: styles.textColor }}>${item.name}</td>
                    <td style={{ border: \`1px solid \${styles.border}\`, padding: "5px", color: styles.textColor }}>${item.quantity}</td>
                    <td style={{ border: \`1px solid \${styles.border}\`, padding: "5px", color: styles.textColor }}>
                      ₹${item.price.toLocaleString()}
                    </td>
                    <td style={{ border: \`1px solid \${styles.border}\`, padding: "5px", color: styles.textColor }}>
                      ${invoiceData.gstPercentage}%
                    </td>
                    <td style={{ border: \`1px solid \${styles.border}\`, padding: "5px", color: styles.textColor }}>
                      ₹${(item.price * item.quantity + item.price * item.quantity * (invoiceData.gstPercentage / 100)).toLocaleString()}
                    </td>
                  </tr>
                `
                  )
                    .join("")}
                </table>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", margin: "5px 0", color: styles.textColor }}>
                  <span>Subtotal:</span>
                  <span>₹${invoiceData.subtotal.toLocaleString()}</span>
                </div>
                ${invoiceData.tax > 0 ? `
                  <div style={{ display: "flex", justifyContent: "space-between", margin: "5px 0", color: styles.textColor }}>
                    <span>GST (${invoiceData.gstPercentage}%):</span>
                    <span>₹${invoiceData.tax.toLocaleString()}</span>
                  </div>
                ` : ""}
                <div style={{ display: "flex", justifyContent: "space-between", margin: "5px 0", fontWeight: "bold", color: styles.textColor }}>
                  <span>Calculated Total:</span>
                  <span>₹${invoiceData.total.toLocaleString()}</span>
                </div>
                ${invoiceData.manualTotal ? `
                  <div style={{ display: "flex", justifyContent: "space-between", margin: "5px 0", fontWeight: "bold", color: styles.textColor }}>
                    <span>Manual Total:</span>
                    <span>₹${invoiceData.manualTotal.toLocaleString()}</span>
                  </div>
                ` : ""}
                <div style={{ display: "flex", justifyContent: "space-between", margin: "5px 0", color: styles.textColor }}>
                  <span>Payment Method:</span>
                  <span>${invoiceData.paymentMethod.charAt(0).toUpperCase() + invoiceData.paymentMethod.slice(1)}</span>
                </div>
              </div>
              ${enableTermsPrint ? `
                <div style={{ marginBottom: "1rem" }}>
                  <strong>Terms & Conditions</strong>
                  <ol>
                    <li>Note: Verbal Deal</li>
                    <li>Customer will pay the GST</li>
                    <li>Customer will pay the Delivery charges</li>
                    <li>Pay due amount within 15 days</li>
                  </ol>
                </div>
              ` : ''}
              <div
                style={{
                  textAlign: "center",
                  borderTop: `1px dashed ${styles.border}`,
                  paddingTop: "10px",
                  marginTop: "10px",
                  color: styles.textColor
                }}
              >
                <p>Generated by Your Shop POS System</p>
                <p>Thank you for using our services!</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
              <button
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  backgroundColor: styles.primary,
                  color: styles.primaryForeground,
                  border: "none",
                  borderRadius: styles.radius,
                  cursor: "pointer"
                }}
                onClick={handlePrint}
              >
                Print Invoice
              </button>
              <button
                style={{
                  flex: 1,
                  padding: "0.5rem",
                  backgroundColor: styles.buttonOutlineBg,
                  color: styles.buttonOutlineText,
                  border: `1px solid ${styles.border}`,
                  borderRadius: styles.radius,
                  cursor: "pointer"
                }}
                onClick={() => setShowPrintPreview(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {warning && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            backgroundColor: styles.warning,
            color: styles.warningForeground,
            padding: "1rem",
            borderRadius: styles.radius,
            boxShadow: styles.shadow,
            zIndex: 1001,
            maxWidth: "300px"
          }}
        >
          {warning}
        </div>
      )}
    </div>
  );
};
export default PointOfSale;