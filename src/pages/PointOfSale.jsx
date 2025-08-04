import { useState, useEffect } from "react";
import axios from "axios";

// Inline SVG Icons
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const MinusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const CreditCardIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
    <line x1="1" y1="10" x2="23" y2="10"></line>
  </svg>
);

const BanknoteIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="2"></rect>
    <circle cx="12" cy="12" r="2"></circle>
    <path d="M6 12h.01"></path>
    <path d="M18 12h.01"></path>
  </svg>
);

const SmartphoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
    <line x1="12" y1="18" x2="12.01" y2="18"></line>
  </svg>
);

const ShoppingCartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"></circle>
    <circle cx="20" cy="21" r="1"></circle>
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
  </svg>
);

const PointOfSale = ({ theme }) => {
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
  const [invoiceData, setInvoiceData] = useState(null);
  const [shopDetails, setShopDetails] = useState({
    shopName: "Your Shop Name",
    address: "123 Shop Street, City, Country",
    gstin: "12ABCDE1234F1Z5",
  });

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
          shopName: printRes.data.shopName || "Your Shop Name",
          address: printRes.data.address || "123 Shop Street, City, Country",
          gstin: printRes.data.gstin || "12ABCDE1234F1Z5",
        });
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
        alert("Not enough stock available!");
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
        alert("Not enough stock available!");
      }
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
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
      alert("Cart is empty!");
      return;
    }
    if (!customerName || !customerPhone) {
      alert("Please enter customer details!");
      return;
    }

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
      total: getTotal(),
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
    } catch (err) {
      console.error("Error processing sale:", err);
      alert("Failed to process sale. Please try again.");
    }
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Invoice ${invoiceData.invoiceId}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              font-size: 12px; 
              background-color: ${theme === "light" ? "#ffffff" : "#1a1a1a"}; 
              color: ${theme === "light" ? "#000000" : "#ffffff"}; 
            }
            .invoice { 
              max-width: 300px; 
              margin: auto; 
              border: 1px solid ${theme === "light" ? "#000000" : "#ffffff"}; 
              padding: 10px; 
              background-color: ${theme === "light" ? "#ffffff" : "#2d2d2d"}; 
            }
            .header { 
              text-align: center; 
              border-bottom: 1px dashed ${theme === "light" ? "#000000" : "#ffffff"}; 
              padding-bottom: 10px; 
              margin-bottom: 10px; 
            }
            .header h1 { 
              font-size: 16px; 
              margin: 5px 0; 
            }
            .details, .items, .totals { 
              margin-bottom: 10px; 
            }
            .items table { 
              width: 100%; 
              border-collapse: collapse; 
            }
            .items th, .items td { 
              border: 1px solid ${theme === "light" ? "#000000" : "#ffffff"}; 
              padding: 5px; 
              text-align: left; 
            }
            .totals div { 
              display: flex; 
              justify-content: space-between; 
              margin: 5px 0; 
            }
            .footer { 
              text-align: center; 
              border-top: 1px dashed ${theme === "light" ? "#000000" : "#ffffff"}; 
              padding-top: 10px; 
              margin-top: 10px; 
            }
            @media print { 
              .no-print { display: none; } 
              body { background-color: #ffffff; color: #000000; }
              .invoice { border: 1px solid #000000; background-color: #ffffff; }
              .header { border-bottom: 1px dashed #000000; }
              .items th, .items td { border: 1px solid #000000; }
              .footer { border-top: 1px dashed #000000; }
            }
          </style>
        </head>
        <body>
          <div class="invoice">
            <div class="header">
              <h1>${shopDetails.shopName}</h1>
              <p>${shopDetails.address}</p>
              <p>GSTIN: ${shopDetails.gstin}</p>
              <p>Invoice: ${invoiceData.invoiceId}</p>
              <p>Date: ${new Date(invoiceData.timestamp).toLocaleString()}</p>
            </div>
            <div class="details">
              <p><strong>Customer:</strong> ${invoiceData.customer.name}</p>
              <p><strong>Phone:</strong> ${invoiceData.customer.phone}</p>
            </div>
            <div class="items">
              <table>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
                ${invoiceData.items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.quantity}</td>
                    <td>₹${item.price.toLocaleString()}</td>
                    <td>₹${(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                `
                  )
                  .join("")}
              </table>
            </div>
            <div class="totals">
              <div><span>Subtotal:</span><span>₹${invoiceData.subtotal.toLocaleString()}</span></div>
              ${
                invoiceData.tax > 0
                  ? `<div><span>GST (${invoiceData.gstPercentage}%):</span><span>₹${invoiceData.tax.toLocaleString()}</span></div>`
                  : ""
              }
              <div><strong>Total:</strong><strong>₹${invoiceData.total.toLocaleString()}</strong></div>
              <div><span>Payment Method:</span><span>${
                invoiceData.paymentMethod.charAt(0).toUpperCase() + invoiceData.paymentMethod.slice(1)
              }</span></div>
            </div>
            <div class="footer">
              <p>Generated by Your Shop POS System</p>
              <p>Thank you for using our services!</p>
            </div>
          </div>
          <button class="no-print" onclick="window.print()">Print</button>
          <button class="no-print" onclick="window.close()">Close</button>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (loading) {
    return <div className={`text-center py-5 ${theme === "light" ? "text-dark" : "text-white"}`}>Loading products...</div>;
  }

  if (error) {
    return <div className={`text-center py-5 ${theme === "light" ? "text-danger" : "text-danger"}`}>{error}</div>;
  }

  return (
    <div className={`d-flex vh-100 ${theme === "light" ? "bg-light text-dark" : "bg-dark text-white"}`}>
      <div className="flex-grow-1 p-4 overflow-auto">
        <div className="mb-4">
          <h1 className={`display-6 fw-bold ${theme === "light" ? "text-dark" : "text-white"}`}>Point of Sale</h1>
          <p className={theme === "light" ? "text-muted" : "text-light"}>
            Select products to add to cart | GST: {enableGst ? `${gstPercentage}%` : "Not Applied"}
          </p>
        </div>
        <div className="mb-4">
          <div className="input-group mb-3">
            <span className={`input-group-text ${theme === "light" ? "bg-white border-dark text-dark" : "bg-dark border-white text-white"}`}>
              <SearchIcon />
            </span>
            <input
              type="text"
              className={`form-control ${theme === "light" ? "bg-white text-dark border-dark" : "bg-dark text-white border-white"}`}
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="d-flex align-items-center gap-2">
            <div className="btn-group">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`btn btn-sm ${
                    selectedCategory === category
                      ? "btn-primary"
                      : theme === "light"
                      ? "btn-outline-dark"
                      : "btn-outline-light"
                  }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedModel("");
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
            {(selectedCategory === "Mobile" || selectedCategory === "Accessories") && (
              <button
                className={`btn btn-sm ${theme === "light" ? "btn-outline-dark" : "btn-outline-light"}`}
                onClick={() => setShowModelPopup(true)}
              >
                Select Model
              </button>
            )}
          </div>
        </div>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-4">
          {filteredProducts.map((product) => (
            <div key={product._id} className="col">
              <div
                className={`card h-100 shadow-sm ${theme === "light" ? "bg-white border-dark" : "bg-dark border-light"}`}
                onClick={() => addToCart(product)}
                style={{ cursor: "pointer" }}
              >
                <div className="card-body p-3">
                  <div className="text-center">
                    <div
                      className={`rounded mb-3 ${theme === "light" ? "bg-light" : "bg-dark"}`}
                      style={{ height: "8rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      {product.image ? (
                        <img
                          src={`http://localhost:5000${product.image}`}
                          alt={product.name}
                          style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                        />
                      ) : (
                        <SmartphoneIcon />
                      )}
                    </div>
                    <h3 className={`h6 fw-bold mb-1 ${theme === "light" ? "text-dark" : "text-white"}`}>{product.name}</h3>
                    <p className="text-primary fw-bold mb-2">₹{product.price.toLocaleString()}</p>
                    <div className="d-flex justify-content-between">
                      <span
                        className={`badge ${
                          product.stock > 10 ? "bg-success" : product.stock > 0 ? "bg-warning" : "bg-danger"
                        }`}
                      >
                        Stock: {product.stock}
                      </span>
                      <span className={`badge ${theme === "light" ? "bg-outline-dark" : "bg-outline-light"}`}>
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`w-25 ${theme === "light" ? "bg-white border-dark" : "bg-dark border-light"}`} style={{ minWidth: "24rem" }}>
        <div className={`p-4 border-bottom ${theme === "light" ? "border-dark" : "border-light"}`}>
          <h2 className={`h5 fw-semibold d-flex align-items-center gap-2 ${theme === "light" ? "text-dark" : "text-white"}`}>
            <ShoppingCartIcon />
            Cart ({cart.length})
          </h2>
        </div>
        <div className={`p-4 border-bottom ${theme === "light" ? "border-dark" : "border-light"}`}>
          <h3 className={`h6 fw-medium ${theme === "light" ? "text-dark" : "text-white"}`}>Customer Details</h3>
          <div className="position-relative">
            <input
              type="text"
              className={`form-control mb-2 ${theme === "light" ? "bg-white text-dark border-dark" : "bg-dark text-white border-white"}`}
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => {
                setCustomerName(e.target.value);
                setSelectedCustomer(null);
              }}
            />
            {customerSuggestions.length > 0 && !selectedCustomer && (
              <ul
                className={`position-absolute w-100 rounded shadow-sm ${
                  theme === "light" ? "bg-white text-dark border-dark" : "bg-dark text-white border-white"
                }`}
                style={{ zIndex: 10, maxHeight: "200px", overflowY: "auto" }}
              >
                {customerSuggestions.map((customer) => (
                  <li
                    key={customer._id}
                    className={`p-2 hover:${theme === "light" ? "bg-gray-200" : "bg-gray-700"} cursor-pointer`}
                    onClick={() => selectCustomer(customer)}
                  >
                    {customer.name} ({customer.phone}) - Balance: ₹{customer.posBalance?.toLocaleString() || 0}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="position-relative">
            <input
              type="text"
              className={`form-control ${theme === "light" ? "bg-white text-dark border-dark" : "bg-dark text-white border-white"}`}
              placeholder="Phone Number"
              value={customerPhone}
              onChange={(e) => {
                setCustomerPhone(e.target.value);
                setSelectedCustomer(null);
              }}
            />
            {customerSuggestions.length > 0 && !selectedCustomer && (
              <ul
                className={`position-absolute w-100 rounded shadow-sm ${
                  theme === "light" ? "bg-white text-dark border-dark" : "bg-dark text-white border-white"
                }`}
                style={{ zIndex: 10, maxHeight: "200px", overflowY: "auto" }}
              >
                {customerSuggestions.map((customer) => (
                  <li
                    key={customer._id}
                    className={`p-2 hover:${theme === "light" ? "bg-gray-200" : "bg-gray-700"} cursor-pointer`}
                    onClick={() => selectCustomer(customer)}
                  >
                    {customer.name} ({customer.phone}) - Balance: ₹{customer.posBalance?.toLocaleString() || 0}
                  </li>
                ))}
              </ul>
            )}
          </div>
          {selectedCustomer && (
            <p className={`mt-2 ${theme === "light" ? "text-muted" : "text-light"}`}>
              POS Balance: ₹{selectedCustomer.posBalance?.toLocaleString() || 0}
            </p>
          )}
        </div>
        <div className="flex-grow-1 overflow-auto p-4">
          {cart.length === 0 ? (
            <div className={`text-center py-5 ${theme === "light" ? "text-muted" : "text-light"}`}>
              <ShoppingCartIcon />
              <p>Cart is empty</p>
              <p className="small">Add products to get started</p>
            </div>
          ) : (
            <div>
              {cart.map((item) => (
                <div
                  key={item.id}
                  className={`d-flex align-items-center gap-3 p-3 border rounded mb-3 ${
                    theme === "light" ? "border-dark" : "border-light"
                  }`}
                >
                  <div
                    className={`rounded ${theme === "light" ? "bg-light" : "bg-dark"}`}
                    style={{ width: "3rem", height: "3rem", display: "flex", alignItems: "center", justifyContent: "center" }}
                  >
                    {item.image ? (
                      <img
                        src={`http://localhost:5000${item.image}`}
                        alt={item.name}
                        style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                      />
                    ) : (
                      <SmartphoneIcon />
                    )}
                  </div>
                  <div className="flex-grow-1">
                    <h4 className={`h6 mb-1 ${theme === "light" ? "text-dark" : "text-white"}`}>{item.name}</h4>
                    <p className={`small ${theme === "light" ? "text-muted" : "text-light"}`}>₹{item.price.toLocaleString()}</p>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <button
                      className={`btn btn-sm ${theme === "light" ? "btn-outline-dark" : "btn-outline-light"}`}
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <MinusIcon />
                    </button>
                    <span className="px-2">{item.quantity}</span>
                    <button
                      className={`btn btn-sm ${theme === "light" ? "btn-outline-dark" : "btn-outline-light"}`}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <PlusIcon />
                    </button>
                    <button
                      className={`btn btn-sm ${theme === "light" ? "btn-outline-danger" : "btn-outline-danger"}`}
                      onClick={() => removeFromCart(item.id)}
                    >
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {cart.length > 0 && (
          <div className={`p-4 border-top ${theme === "light" ? "border-dark" : "border-light"}`}>
            <div className="mb-3">
              <div className="d-flex justify-content-between">
                <span className={theme === "light" ? "text-dark" : "text-white"}>Subtotal:</span>
                <span className={theme === "light" ? "text-dark" : "text-white"}>₹{getSubtotal().toLocaleString()}</span>
              </div>
              {enableGst && (
                <div className="d-flex justify-content-between">
                  <span className={theme === "light" ? "text-dark" : "text-white"}>GST ({gstPercentage}%):</span>
                  <span className={theme === "light" ? "text-dark" : "text-white"}>₹{getTax().toLocaleString()}</span>
                </div>
              )}
              <div className={`d-flex justify-content-between fw-bold pt-2 border-top ${theme === "light" ? "border-dark" : "border-light"}`}>
                <span className={theme === "light" ? "text-dark" : "text-white"}>Total:</span>
                <span className={theme === "light" ? "text-dark" : "text-white"}>₹{getTotal().toLocaleString()}</span>
              </div>
            </div>
            <div className="mb-3">
              <label className={`form-label ${theme === "light" ? "text-dark" : "text-white"}`}>Payment Method:</label>
              <div className="d-flex gap-2">
                <button
                  className={`btn flex-grow-1 ${
                    paymentMethod === "cash"
                      ? "btn-primary"
                      : theme === "light"
                      ? "btn-outline-dark"
                      : "btn-outline-light"
                  }`}
                  onClick={() => setPaymentMethod("cash")}
                >
                  <BanknoteIcon />
                  Cash
                </button>
                <button
                  className={`btn flex-grow-1 ${
                    paymentMethod === "card"
                      ? "btn-primary"
                      : theme === "light"
                      ? "btn-outline-dark"
                      : "btn-outline-light"
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <CreditCardIcon />
                  Card
                </button>
              </div>
            </div>
            <button className="btn btn-primary w-100" onClick={processSale}>
              Complete Sale
            </button>
          </div>
        )}
      </div>
      {showModelPopup && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000 }}
        >
          <div
            className={`rounded p-4 ${theme === "light" ? "bg-white text-dark border-dark" : "bg-dark text-white border-white"}`}
            style={{ width: "400px", maxHeight: "80vh", overflowY: "auto" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className={`h6 fw-bold ${theme === "light" ? "text-dark" : "text-white"}`}>Select Model</h3>
              <button
                className={`btn btn-sm ${theme === "light" ? "btn-outline-dark" : "btn-outline-light"}`}
                onClick={() => setShowModelPopup(false)}
              >
                Close
              </button>
            </div>
            {selectedCategory === "Mobile" && mobiles.length === 0 && (
              <p className={`text-center ${theme === "light" ? "text-muted" : "text-light"}`}>No mobile models found</p>
            )}
            {selectedCategory === "Accessories" && accessories.length === 0 && (
              <p className={`text-center ${theme === "light" ? "text-muted" : "text-light"}`}>No accessory models found</p>
            )}
            {selectedCategory === "Mobile" &&
              mobiles.map((mobile) => (
                <div
                  key={mobile._id}
                  className={`p-2 mb-2 border rounded cursor-pointer hover:${
                    theme === "light" ? "bg-gray-200" : "bg-gray-700"
                  } ${theme === "light" ? "border-dark" : "border-light"}`}
                  onClick={() => selectModel(mobile.name)}
                >
                  {mobile.name}
                </div>
              ))}
            {selectedCategory === "Accessories" &&
              accessories.map((accessory) => (
                <div
                  key={accessory._id}
                  className={`p-2 mb-2 border rounded cursor-pointer hover:${
                    theme === "light" ? "bg-gray-200" : "bg-gray-700"
                  } ${theme === "light" ? "border-dark" : "border-light"}`}
                  onClick={() => selectModel(`${accessory.accessoryModel} - ${accessory.accessoryName}`)}
                >
                  {accessory.accessoryModel} - {accessory.accessoryName}
                </div>
              ))}
          </div>
        </div>
      )}
      {showPrintPreview && invoiceData && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000 }}
        >
          <div
            className={`rounded p-4 ${theme === "light" ? "bg-white text-dark border-dark" : "bg-dark text-white border-white"}`}
            style={{ width: "350px", maxHeight: "80vh", overflowY: "auto" }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3 className={`h6 fw-bold ${theme === "light" ? "text-dark" : "text-white"}`}>Invoice Preview</h3>
              <button
                className={`btn btn-sm ${theme === "light" ? "btn-outline-dark" : "btn-outline-light"}`}
                onClick={() => setShowPrintPreview(false)}
              >
                Close
              </button>
            </div>
            <div
              style={{
                fontFamily: "Arial, sans-serif",
                fontSize: "12px",
                border: `1px solid ${theme === "light" ? "#000000" : "#ffffff"}`,
                padding: "10px",
              }}
            >
              <div
                style={{
                  textAlign: "center",
                  borderBottom: `1px dashed ${theme === "light" ? "#000000" : "#ffffff"}`,
                  paddingBottom: "10px",
                  marginBottom: "10px",
                }}
              >
                <h1 style={{ fontSize: "16px", margin: "5px 0" }}>{shopDetails.shopName}</h1>
                <p>{shopDetails.address}</p>
                <p>GSTIN: {shopDetails.gstin}</p>
                <p>Invoice: {invoiceData.invoiceId}</p>
                <p>Date: {new Date(invoiceData.timestamp).toLocaleString()}</p>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <p>
                  <strong>Customer:</strong> {invoiceData.customer.name}
                </p>
                <p>
                  <strong>Phone:</strong> {invoiceData.customer.phone}
                </p>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <tr>
                    <th style={{ border: `1px solid ${theme === "light" ? "#000000" : "#ffffff"}`, padding: "5px", textAlign: "left" }}>
                      Item
                    </th>
                    <th style={{ border: `1px solid ${theme === "light" ? "#000000" : "#ffffff"}`, padding: "5px", textAlign: "left" }}>
                      Qty
                    </th>
                    <th style={{ border: `1px solid ${theme === "light" ? "#000000" : "#ffffff"}`, padding: "5px", textAlign: "left" }}>
                      Price
                    </th>
                    <th style={{ border: `1px solid ${theme === "light" ? "#000000" : "#ffffff"}`, padding: "5px", textAlign: "left" }}>
                      Total
                    </th>
                  </tr>
                  {invoiceData.items.map((item) => (
                    <tr key={item.id}>
                      <td style={{ border: `1px solid ${theme === "light" ? "#000000" : "#ffffff"}`, padding: "5px" }}>{item.name}</td>
                      <td style={{ border: `1px solid ${theme === "light" ? "#000000" : "#ffffff"}`, padding: "5px" }}>{item.quantity}</td>
                      <td style={{ border: `1px solid ${theme === "light" ? "#000000" : "#ffffff"}`, padding: "5px" }}>
                        ₹{item.price.toLocaleString()}
                      </td>
                      <td style={{ border: `1px solid ${theme === "light" ? "#000000" : "#ffffff"}`, padding: "5px" }}>
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </table>
              </div>
              <div style={{ marginBottom: "10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", margin: "5px 0" }}>
                  <span>Subtotal:</span>
                  <span>₹{invoiceData.subtotal.toLocaleString()}</span>
                </div>
                {invoiceData.tax > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", margin: "5px 0" }}>
                    <span>GST ({invoiceData.gstPercentage}%):</span>
                    <span>₹{invoiceData.tax.toLocaleString()}</span>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", margin: "5px 0", fontWeight: "bold" }}>
                  <span>Total:</span>
                  <span>₹{invoiceData.total.toLocaleString()}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", margin: "5px 0" }}>
                  <span>Payment Method:</span>
                  <span>{invoiceData.paymentMethod.charAt(0).toUpperCase() + invoiceData.paymentMethod.slice(1)}</span>
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  borderTop: `1px dashed ${theme === "light" ? "#000000" : "#ffffff"}`,
                  paddingTop: "10px",
                  marginTop: "10px",
                }}
              >
                <p>Generated by Your Shop POS System</p>
                <p>Thank you for using our services!</p>
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-primary w-100" onClick={handlePrint}>
                Print Invoice
              </button>
              <button
                className={`btn w-100 ${theme === "light" ? "btn-outline-dark" : "btn-outline-light"}`}
                onClick={() => setShowPrintPreview(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointOfSale;