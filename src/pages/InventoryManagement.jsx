import { useState, useEffect, useRef } from "react";
import { Search, PackagePlus, Edit, Trash2, Package, AlertTriangle, X, FileSpreadsheet, FileUp, DollarSign, Grid3x3, Sun, Moon, Leaf, Grid } from "lucide-react";
import axios from "axios";
// Custom Confirmation Modal Component
const ConfirmModal = ({ message, onConfirm, onCancel, theme }) => {
  const themeStyles = {
    light: {
      bgColor: "#ffffff",
      textColor: "#1f2937",
      borderColor: "#d1d5db",
      buttonBgConfirm: "#dc2626",
      buttonBgCancel: "#e5e7eb",
      buttonTextCancel: "#4b5563"
    },
    dark: {
      bgColor: "#374151",
      textColor: "#ffffff",
      borderColor: "#4b5563",
      buttonBgConfirm: "#ef4444",
      buttonBgCancel: "#4b5563",
      buttonTextCancel: "#ffffff"
    },
    nature: {
      bgColor: "#f0f7f4",
      textColor: "#1f2937",
      borderColor: "#a7d4a0",
      buttonBgConfirm: "#dc2626",
      buttonBgCancel: "#e5e7eb",
      buttonTextCancel: "#4b5563"
    },
    sunset: {
      bgColor: "#fff7ed",
      textColor: "#1f2937",
      borderColor: "#fdba74",
      buttonBgConfirm: "#dc2626",
      buttonBgCancel: "#e5e7eb",
      buttonTextCancel: "#4b5563"
    },
  };
  const styles = themeStyles[theme] || themeStyles.light;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ backgroundColor: styles.bgColor, padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", maxWidth: "24rem", width: "100%", textAlign: "center" }}>
        <p style={{ color: styles.textColor, marginBottom: "1rem" }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "space-around" }}>
          <button onClick={onConfirm} style={{ padding: "0.5rem 1rem", backgroundColor: styles.buttonBgConfirm, color: "#ffffff", border: "none", borderRadius: "0.25rem", cursor: "pointer" }}>Confirm</button>
          <button onClick={onCancel} style={{ padding: "0.5rem 1rem", backgroundColor: styles.buttonBgCancel, color: styles.buttonTextCancel, border: "none", borderRadius: "0.25rem", cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
// Custom Alert Modal Component (Repurposed for warnings and errors)
const AlertModal = ({ message, onClose, theme }) => {
  const themeStyles = {
    light: { bgColor: "#ffffff", textColor: "#1f2937", buttonBg: "#3b82f6" },
    dark: { bgColor: "#374151", textColor: "#ffffff", buttonBg: "#2563eb" },
    nature: { bgColor: "#f0f7f4", textColor: "#1f2937", buttonBg: "#4caf50" },
    sunset: { bgColor: "#fff7ed", textColor: "#1f2937", buttonBg: "#ff9800" },
  };
  const styles = themeStyles[theme] || themeStyles.light;
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ backgroundColor: styles.bgColor, padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", maxWidth: "24rem", width: "100%", textAlign: "center" }}>
        <p style={{ color: styles.textColor, marginBottom: "1rem" }}>{message}</p>
        <button onClick={onClose} style={{ padding: "0.5rem 1rem", backgroundColor: styles.buttonBg, color: "#ffffff", border: "none", borderRadius: "0.25rem", cursor: "pointer" }}>OK</button>
      </div>
    </div>
  );
};
// Custom Bulk Delete Modal Component
const BulkDeleteModal = ({ categories, onClose, onDelete, theme }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const themeStyles = {
    light: {
      bgColor: "#ffffff",
      textColor: "#1f2937",
      borderColor: "#d1d5db",
      buttonBg: "#3b82f6",
      buttonText: "#ffffff"
    },
    dark: {
      bgColor: "#374151",
      textColor: "#ffffff",
      borderColor: "#4b5563",
      buttonBg: "#2563eb",
      buttonText: "#ffffff"
    },
    nature: {
      bgColor: "#f0f7f4",
      textColor: "#1f2937",
      borderColor: "#a7d4a0",
      buttonBg: "#4caf50",
      buttonText: "#ffffff"
    },
    sunset: {
      bgColor: "#fff7ed",
      textColor: "#1f2937",
      borderColor: "#fdba74",
      buttonBg: "#ff9800",
      buttonText: "#ffffff"
    },
  };
  const styles = themeStyles[theme] || themeStyles.light;
  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleSelectAll = (e) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      setSelectedCategories(filteredCategories);
    } else {
      setSelectedCategories([]);
    }
  };
  const handleCategorySelect = (e, cat) => {
    if (e.target.checked) {
      setSelectedCategories([...selectedCategories, cat]);
    } else {
      setSelectedCategories(selectedCategories.filter(c => c !== cat));
    }
  };
  const handleDelete = () => {
    if (selectAll) {
      onDelete(['all']);
    } else {
      onDelete(selectedCategories);
    }
    onClose();
  };
  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
      <div style={{ backgroundColor: styles.bgColor, padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 4px 20px rgba(0,0,0,0.2)", maxWidth: "32rem", width: "100%", textAlign: "center" }}>
        <p style={{ color: styles.textColor, marginBottom: "1rem" }}>Select categories to delete:</p>
        <input
          type="text"
          placeholder="Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "200px", overflowY: "auto" }}>
          <label>
            <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
            All Products
          </label>
          {!selectAll && filteredCategories.map((cat) => (
            <label key={cat}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={(e) => handleCategorySelect(e, cat)}
              />
              {cat}
            </label>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "space-around", marginTop: "1rem" }}>
          <button onClick={handleDelete} style={{ padding: "0.5rem 1rem", backgroundColor: "#dc2626", color: "#ffffff", border: "none", borderRadius: "0.25rem", cursor: "pointer" }}>Delete Selected</button>
          <button onClick={onClose} style={{ padding: "0.5rem 1rem", backgroundColor: "#e5e7eb", color: "#4b5563", border: "none", borderRadius: "0.25rem", cursor: "pointer" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
};
const InventoryManagement = ({ theme, setTheme }) => {
  const [products, setProducts] = useState([]);
  const [mobiles, setMobiles] = useState([]);
  const [accessories, setAccessories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [formType, setFormType] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingMobile, setEditingMobile] = useState(null);
  const [editingAccessory, setEditingAccessory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    supplier: "",
    minStock: "",
    barcode: "",
    model: "",
    type: "",
    accessoryType: "",
    newMobile: "",
    newAccessoryName: "",
    newAccessoryModel: "",
    image_id: "",
    image_path: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showMobilePopup, setShowMobilePopup] = useState(false);
  const [showAccessoriesPopup, setShowAccessoriesPopup] = useState(false);
  const [showExcelOptions, setShowExcelOptions] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirmAction, setOnConfirmAction] = useState(null);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const productsPerPage = 4;
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);
  const themeStyles = {
    light: {
      bgColor: "#f8fafc",
      foreground: "#1e293b",
      card: "#ffffff",
      cardForeground: "#1e293b",
      primary: "#3b82f6",
      primaryForeground: "#ffffff",
      secondary: "#f1f5f9",
      secondaryForeground: "#1e293b",
      muted: "#f1f5f9",
      mutedForeground: "#6b7280",
      accent: "#f59e0b",
      accentForeground: "#ffffff",
      success: "#22c55e",
      successForeground: "#ffffff",
      warning: "#f59e0b",
      warningForeground: "#ffffff",
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",
      border: "#e5e7eb",
      input: "#e5e7eb",
      ring: "#3b82f6",
      gradientPrimary: "linear-gradient(135deg, #3b82f6, #60a5fa)",
      gradientAccent: "linear-gradient(135deg, #f59e0b, #fbbf24)",
      shadowElegant: "0 4px 20px -2px rgba(59,130,246,0.15)",
      shadowCard: "0 2px 10px -2px rgba(0,0,0,0.1)",
      radius: "0.75rem",
      textColor: "#1e293b",
      secondaryTextColor: "#6b7280",
      cardBg: "#ffffff",
      borderColor: "rgba(229,231,235,0.5)",
      inputBg: "#ffffff",
      buttonBg: "#3b82f6",
      buttonText: "#ffffff",
      buttonAddMobile: "#3b82f6",
      buttonAddAccessory: "#3b82f6",
      buttonMobileList: "#f1f5f9",
      buttonAccessoriesList: "#f1f5f9",
      buttonExcel: "#3b82f6",
      buttonUploadImage: "#3b82f6",
      dropdownBg: "#ffffff",
      disabledBg: "#f1f5f9",
      shadow: "0 1px 3px rgba(0,0,0,0.1)",
      popupBg: "#ffffff",
      inputReadOnlyBg: "#f1f5f9",
      placeholderImageBg: "#f1f5f9",
      placeholderImageText: "#6b7280",
      statusSuccess: "#22c55e",
      statusWarning: "#f59e0b",
      statusDestructive: "#ef4444",
      cardHoverShadow: "0 4px 20px -2px rgba(59,130,246,0.15)",
      cardHoverTransform: "translateY(-2px)",
      btnGradientBg: "linear-gradient(135deg, #3b82f6, #60a5fa)",
      btnGradientHoverBg: "linear-gradient(135deg, #f59e0b, #fbbf24)",
      btnGradientHoverTransform: "translateY(-1px)",
    },
    dark: {
      bgColor: "#0f172a",
      foreground: "#ffffff",
      card: "#1e293b",
      cardForeground: "#ffffff",
      primary: "#a855f7",
      primaryForeground: "#ffffff",
      secondary: "#334155",
      secondaryForeground: "#ffffff",
      muted: "#334155",
      mutedForeground: "#94a3b8",
      accent: "#10b981",
      accentForeground: "#ffffff",
      success: "#22c55e",
      successForeground: "#ffffff",
      warning: "#f59e0b",
      warningForeground: "#ffffff",
      destructive: "#ef4444",
      destructiveForeground: "#ffffff",
      border: "#334155",
      input: "#334155",
      ring: "#a855f7",
      gradientPrimary: "linear-gradient(135deg, #a855f7, #c084fc)",
      gradientAccent: "linear-gradient(135deg, #10b981, #34d399)",
      shadowElegant: "0 4px 20px -2px rgba(168,85,247,0.25)",
      shadowCard: "0 2px 10px -2px rgba(0,0,0,0.3)",
      radius: "0.75rem",
      textColor: "#ffffff",
      secondaryTextColor: "#94a3b8",
      cardBg: "#1e293b",
      borderColor: "rgba(51,65,85,0.5)",
      inputBg: "#334155",
      buttonBg: "#a855f7",
      buttonText: "#ffffff",
      buttonAddMobile: "#a855f7",
      buttonAddAccessory: "#a855f7",
      buttonMobileList: "#334155",
      buttonAccessoriesList: "#334155",
      buttonExcel: "#a855f7",
      buttonUploadImage: "#a855f7",
      dropdownBg: "#1e293b",
      disabledBg: "#334155",
      shadow: "0 1px 3px rgba(0,0,0,0.3)",
      popupBg: "#1e293b",
      inputReadOnlyBg: "#334155",
      placeholderImageBg: "#334155",
      placeholderImageText: "#94a3b8",
      statusSuccess: "#22c55e",
      statusWarning: "#f59e0b",
      statusDestructive: "#ef4444",
      cardHoverShadow: "0 4px 20px -2px rgba(168,85,247,0.25)",
      cardHoverTransform: "translateY(-2px)",
      btnGradientBg: "linear-gradient(135deg, #a855f7, #c084fc)",
      btnGradientHoverBg: "linear-gradient(135deg, #10b981, #34d399)",
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
      borderColor: "rgba(167,212,160,0.5)",
      inputBg: "#ffffff",
      buttonBg: "#4caf50",
      buttonText: "#ffffff",
      buttonAddMobile: "#4caf50",
      buttonAddAccessory: "#4caf50",
      buttonMobileList: "#e8f5e9",
      buttonAccessoriesList: "#e8f5e9",
      buttonExcel: "#4caf50",
      buttonUploadImage: "#4caf50",
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
      borderColor: "rgba(253,186,116,0.5)",
      inputBg: "#ffffff",
      buttonBg: "#ff9800",
      buttonText: "#ffffff",
      buttonAddMobile: "#ff9800",
      buttonAddAccessory: "#ff9800",
      buttonMobileList: "#ffedd5",
      buttonAccessoriesList: "#ffedd5",
      buttonExcel: "#ff9800",
      buttonUploadImage: "#ff9800",
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
  const showWarning = (message) => {
    setAlertMessage(message);
    setShowAlertModal(true);
  };
  const showConfirmation = (message, action) => {
    setConfirmMessage(message);
    setOnConfirmAction(() => action);
    setShowConfirmModal(true);
  };
  useEffect(() => {
    fetchProducts();
    fetchMobiles();
    fetchAccessories();
  }, []);
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5000/api/products");
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      setError("Failed to fetch products");
      setLoading(false);
      console.error("Error fetching products:", error);
    }
  };
  const fetchMobiles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/mobiles");
      setMobiles(response.data);
    } catch (error) {
      console.error("Error fetching mobiles:", error);
    }
  };
  const fetchAccessories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/accessories");
      setAccessories(response.data);
    } catch (error) {
      console.error("Error fetching accessories:", error);
    }
  };
  const uniqueCategories = [...new Set(products.map((product) => product.category))];
  const filteredProducts = products.filter(
    (product) =>
      (categoryFilter === "all" || product.category === categoryFilter) &&
      (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.supplier && product.supplier.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.model && product.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.type && product.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.accessoryType && product.accessoryType.toLowerCase().includes(searchTerm.toLowerCase())))
  );
  const lowStockProducts = products.filter((product) => product.stock <= product.minStock);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      stock: "",
      category: "",
      supplier: "",
      minStock: "",
      barcode: "",
      model: "",
      type: "",
      accessoryType: "",
      newMobile: "",
      newAccessoryName: "",
      newAccessoryModel: "",
      image_id: "",
      image_path: ""
    });
    setImageFile(null);
    setImagePreview("");
    setShowAddForm(false);
    setFormType("");
    setEditingProduct(null);
    setEditingMobile(null);
    setEditingAccessory(null);
    setShowConfirmModal(false);
    setShowAlertModal(false);
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFormData((prev) => ({ ...prev, image_id: "", image_path: "" }));
    } else {
      setImageFile(null);
      setImagePreview("");
    }
  };
  const handleUploadImages = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    const formData = new FormData();
    files.forEach((file, index) => formData.append(`images[${index}]`, file));
    try {
      const response = await axios.post("http://localhost:5000/api/upload/images", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setUploadedImages((prev) => [...prev, ...response.data.uploadedImages]);
      // No success alert, only warning for errors
    } catch (error) {
      console.error("Error uploading images:", error);
      showWarning(`Failed to upload images. Error: ${error.response?.data?.error || error.message}`);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();
    if (formType === "product") {
      if (!formData.name || !formData.price || !formData.stock || !formData.category) {
        showWarning("Please fill all required fields for product (Name, Price, Stock, Category).");
        return;
      }
      dataToSend.append("name", formData.name);
      dataToSend.append("price", Number(formData.price));
      dataToSend.append("stock", Number(formData.stock));
      dataToSend.append("category", formData.category);
      dataToSend.append("supplier", formData.supplier || "");
      dataToSend.append("minStock", Number(formData.minStock) || 5);
      dataToSend.append("barcode", formData.barcode || `BC${Date.now()}`);
      dataToSend.append("type", formData.type || "");
      if (formData.category === "Mobile") {
        if (formData.newMobile) {
          dataToSend.append("newMobile", formData.newMobile);
          dataToSend.append("model", "");
        } else {
          dataToSend.append("model", formData.model || "");
          dataToSend.append("newMobile", "");
        }
        dataToSend.append("accessoryType", "");
      } else if (formData.category === "Accessories") {
        if (formData.newAccessoryName && formData.newAccessoryModel) {
          dataToSend.append("newAccessoryName", formData.newAccessoryName);
          dataToSend.append("newAccessoryModel", formData.newAccessoryModel);
          dataToSend.append("accessoryType", "");
        } else {
          dataToSend.append("accessoryType", formData.accessoryType || "");
          dataToSend.append("newAccessoryName", "");
          dataToSend.append("newAccessoryModel", "");
        }
        dataToSend.append("model", "");
        dataToSend.append("newMobile", "");
      } else {
        dataToSend.append("model", "");
        dataToSend.append("newMobile", "");
        dataToSend.append("accessoryType", "");
        dataToSend.append("newAccessoryName", "");
        dataToSend.append("newAccessoryModel", "");
      }
      if (imageFile) dataToSend.append("image", imageFile);
      else if (editingProduct && !imagePreview && (editingProduct.image_id || editingProduct.image_path)) dataToSend.append("image_path", "");
    } else if (formType === "accessories") {
      if (!formData.newAccessoryName || !formData.newAccessoryModel) {
        showWarning("Please fill all required fields for accessory (Accessory Name, Accessory Model).");
        return;
      }
      dataToSend.append("accessoryName", formData.newAccessoryName);
      dataToSend.append("accessoryModel", formData.newAccessoryModel);
      dataToSend.append("category", "Accessories");
      dataToSend.append("type", formData.type || "");
    } else if (formType === "mobile") {
      if (!formData.newMobile) {
        showWarning("Mobile name is required.");
        return;
      }
      dataToSend.append("name", formData.newMobile);
      dataToSend.append("category", "Mobile");
    }
    try {
      const endpoint = editingProduct
        ? `http://localhost:5000/api/products/${editingProduct._id}`
        : editingMobile
        ? `http://localhost:5000/api/mobiles/${editingMobile._id}`
        : editingAccessory
        ? `http://localhost:5000/api/accessories/${editingAccessory._id}`
        : `http://localhost:5000/api/${formType === "product" ? "products" : formType === "mobile" ? "mobiles" : "accessories"}`;
      const method = editingProduct || editingMobile || editingAccessory ? "put" : "post";
      await axios[method](endpoint, dataToSend, { headers: { "Content-Type": "multipart/form-data" } });
      // No success alert, only refresh
      fetchProducts();
      fetchMobiles();
      fetchAccessories();
      resetForm();
    } catch (error) {
      console.error("Error saving:", error);
      showWarning(`Failed to save ${formType}. Error: ${error.response?.data?.error || error.message}`);
    }
  };
  const editProduct = (product) => {
    setFormData({
      name: product.name,
      price: product.price.toString(),
      stock: product.stock.toString(),
      category: product.category,
      supplier: product.supplier,
      minStock: product.minStock.toString(),
      barcode: product.barcode,
      model: product.model || "",
      type: product.type || "",
      accessoryType: product.accessoryType || "",
      newMobile: "",
      newAccessoryName: "",
      newAccessoryModel: "",
      image_id: product.image_id || "",
      image_path: product.image_path || "",
    });
    setImagePreview(product.image || "");
    setImageFile(null);
    setEditingProduct(product);
    setFormType("product");
    setShowAddForm(true);
    setShowExcelOptions(false);
  };
  const editMobile = (mobile) => {
    setFormData({
      name: "",
      price: "",
      stock: "",
      supplier: "",
      minStock: "",
      barcode: "",
      category: "Mobile",
      model: "",
      accessoryType: "",
      type: "",
      newMobile: mobile.name,
      newAccessoryName: "",
      newAccessoryModel: "",
      image_id: "",
      image_path: ""
    });
    setImageFile(null);
    setImagePreview("");
    setEditingMobile(mobile);
    setFormType("mobile");
    setShowAddForm(true);
    setShowExcelOptions(false);
  };
  const editAccessory = (accessory) => {
    setFormData({
      name: "",
      price: "",
      stock: "",
      supplier: "",
      minStock: "",
      barcode: "",
      model: "",
      category: "Accessories",
      accessoryType: accessory.accessoryType || "",
      type: accessory.type || "",
      newMobile: "",
      newAccessoryName: accessory.accessoryName,
      newAccessoryModel: accessory.accessoryModel,
      image_id: "",
      image_path: ""
    });
    setImageFile(null);
    setImagePreview("");
    setEditingAccessory(accessory);
    setFormType("accessories");
    setShowAddForm(true);
    setShowExcelOptions(false);
  };
  const deleteProduct = (id) => {
    showConfirmation("Are you sure you want to delete this product?", async () => {
      try {
        await axios.delete(`http://localhost:5000/api/products/${id}`);
        setProducts(products.filter((product) => product._id !== id));
        // No success alert
      } catch (error) {
        console.error("Error deleting product:", error);
        showWarning(`Failed to delete product. Error: ${error.response?.data?.error || error.message}`);
      } finally {
        setShowConfirmModal(false);
      }
    });
  };
  const deleteMobile = (id) => {
    showConfirmation("Are you sure you want to delete this mobile type? This will not remove products using this type.", async () => {
      try {
        await axios.delete(`http://localhost:5000/api/mobiles/${id}`);
        setMobiles(mobiles.filter((mobile) => mobile._id !== id));
        // No success alert
      } catch (error) {
        console.error("Error deleting mobile:", error);
        showWarning(`Failed to delete mobile type. Error: ${error.response?.data?.error || error.message}`);
      } finally {
        setShowConfirmModal(false);
      }
    });
  };
  const deleteAccessory = (id) => {
    showConfirmation("Are you sure you want to delete this accessory type? This will not remove products using this type.", async () => {
      try {
        await axios.delete(`http://localhost:5000/api/accessories/${id}`);
        setAccessories(accessories.filter((accessory) => accessory._id !== id));
        // No success alert
      } catch (error) {
        console.error("Error deleting accessory:", error);
        showWarning(`Failed to delete accessory. Error: ${error.response?.data?.error || error.message}`);
      } finally {
        setShowConfirmModal(false);
      }
    });
  };
  const handleBulkDelete = async (selected) => {
    try {
      if (selected.includes('all')) {
        await axios.delete("http://localhost:5000/api/products/all");
        // No success alert
      } else {
        for (const cat of selected) {
          await axios.delete(`http://localhost:5000/api/products/category/${encodeURIComponent(cat)}`);
        }
        // No success alert
      }
      fetchProducts();
    } catch (error) {
      console.error("Error in bulk delete:", error);
      showWarning(`Failed to bulk delete. Error: ${error.response?.data?.error || error.message}`);
    }
  };
  const updateStock = async (id, newStock) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${id}/stock`, { stock: Number(newStock) });
      setProducts(products.map((product) => (product._id === id ? { ...product, stock: newStock } : product)));
    } catch (error) {
      console.error("Error updating stock:", error);
      showWarning(`Failed to update stock. Error: ${error.response?.data?.error || error.message}`);
    }
  };
  const openAddForm = (type) => {
    setFormType(type);
    setFormData({
      name: "",
      price: "",
      stock: "",
      category: type === "mobile" ? "Mobile" : type === "accessories" ? "Accessories" : "",
      supplier: "",
      minStock: "",
      barcode: "",
      model: "",
      type: "",
      accessoryType: "",
      newMobile: "",
      newAccessoryName: "",
      newAccessoryModel: "",
      image_id: "",
      image_path: ""
    });
    setImageFile(null);
    setImagePreview("");
    setEditingProduct(null);
    setEditingMobile(null);
    setEditingAccessory(null);
    setShowAddForm(true);
    setShowExcelOptions(false);
  };
  const handleExportMobiles = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/export/mobiles", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "mobile_products_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setShowExcelOptions(false);
      // No success alert
    } catch (error) {
      console.error("Error exporting mobile products to Excel:", error);
      showWarning(`Failed to export mobile products template. Error: ${error.response?.data?.error || error.message}`);
    }
  };
  const handleExportAccessories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/export/accessories", { responseType: "blob" });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "accessory_products_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setShowExcelOptions(false);
      // No success alert
    } catch (error) {
      console.error("Error exporting accessory products to Excel:", error);
      showWarning(`Failed to export accessory products template. Error: ${error.response?.data?.error || error.message}`);
    }
  };
  const handleImportExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/import/products", formData, { headers: { "Content-Type": "multipart/form-data" } });
      // No success alert, but refresh
      fetchProducts();
      fetchMobiles();
      fetchAccessories();
    } catch (error) {
      console.error("Error importing products from Excel:", error);
      showWarning(`Failed to import products. Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
      setShowExcelOptions(false);
      event.target.value = "";
    }
  };
  if (loading) return <div style={{ padding: "2rem", color: styles.textColor }}>Loading inventory...</div>;
  if (error) return <div style={{ padding: "2rem", color: styles.destructive }}>{error}</div>;
  const stats = {
    totalProducts: products.length,
    lowStockItems: lowStockProducts.length,
    totalStockValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
    categories: uniqueCategories.length,
  };
  const themeOptions = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "nature", label: "Nature", icon: Leaf },
    { id: "sunset", label: "Sunset", icon: Grid },
  ];
  const selectedTheme = themeOptions.find(t => t.id === theme) || themeOptions[0];
  const SelectedIcon = selectedTheme.icon;
  return (
    <div className="container-fluid" style={{ backgroundColor: styles.bgColor, color: styles.foreground, minHeight: "100vh", padding: "2rem" }}>
      <div className="row justify-content-between align-items-center mb-3">
        <div className="col-auto">
          <h1 style={{ fontSize: "1.875rem", fontWeight: "700", marginBottom: "0.5rem", color: styles.textColor }}>Inventory Management</h1>
          <p style={{ fontSize: "1rem", color: styles.secondaryTextColor, marginBottom: "2rem" }}>Manage your product inventory</p>
        </div>
        <div className="col-auto position-relative">
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
            <SelectedIcon size={16} />
            {selectedTheme.label}
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
              {themeOptions.map((option) => {
                const OptionIcon = option.icon;
                return (
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
                    <OptionIcon size={16} />
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-md-3 col-sm-6">
          <div style={{ backgroundColor: styles.cardBg, padding: "1rem", borderRadius: styles.radius, boxShadow: styles.shadow, textAlign: "center" }}>
            <h3 style={{ fontSize: "1rem", color: styles.secondaryTextColor }}>Total Products</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "700", color: styles.textColor }}>{stats.totalProducts}</p>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div style={{ backgroundColor: styles.cardBg, padding: "1rem", borderRadius: styles.radius, boxShadow: styles.shadow, textAlign: "center" }}>
            <h3 style={{ fontSize: "1rem", color: styles.secondaryTextColor }}>Low Stock Items</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "700", color: styles.textColor }}>{stats.lowStockItems}</p>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div style={{ backgroundColor: styles.cardBg, padding: "1rem", borderRadius: styles.radius, boxShadow: styles.shadow, textAlign: "center" }}>
            <h3 style={{ fontSize: "1rem", color: styles.secondaryTextColor }}>Total Stock Value</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "700", color: styles.textColor }}>₹{stats.totalStockValue.toLocaleString()}</p>
          </div>
        </div>
        <div className="col-md-3 col-sm-6">
          <div style={{ backgroundColor: styles.cardBg, padding: "1rem", borderRadius: styles.radius, boxShadow: styles.shadow, textAlign: "center" }}>
            <h3 style={{ fontSize: "1rem", color: styles.secondaryTextColor }}>Categories</h3>
            <p style={{ fontSize: "1.5rem", fontWeight: "700", color: styles.textColor }}>{stats.categories}</p>
          </div>
        </div>
      </div>
      {lowStockProducts.length > 0 && (
        <div className="mb-4">
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: styles.textColor }}>Low Stock Warnings</h2>
          <div className="row g-3">
            {lowStockProducts.map((product) => (
              <div key={product._id} className="col-lg-3 col-md-4 col-sm-6">
                <div style={{ backgroundColor: styles.cardBg, padding: "1rem", borderRadius: styles.radius, boxShadow: styles.shadowCard, borderLeft: `4px solid ${styles.warning}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                    <AlertTriangle size={16} color={styles.warning} />
                    <h3 style={{ fontSize: "1rem", fontWeight: "600", color: styles.textColor }}>{product.name}</h3>
                  </div>
                  <p style={{ color: styles.secondaryTextColor }}>Stock: {product.stock} (Min: {product.minStock})</p>
                  <p style={{ color: styles.secondaryTextColor }}>Category: {product.category}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="d-flex flex-wrap gap-2 mb-3">
        <button onClick={() => openAddForm("product")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundImage: styles.gradientPrimary, color: styles.buttonText, border: "none", borderRadius: styles.radius, cursor: "pointer", transition: "all 0.2s" }} onMouseEnter={(e) => { e.currentTarget.style.backgroundImage = styles.gradientAccent; e.currentTarget.style.transform = styles.btnGradientHoverTransform; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundImage = styles.gradientPrimary; e.currentTarget.style.transform = "translateY(0)"; }}>
          <PackagePlus size={16} /> Add Product
        </button>
        <button onClick={() => openAddForm("mobile")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: styles.buttonAddMobile, color: styles.buttonText, border: "none", borderRadius: styles.radius, cursor: "pointer" }}>Add Mobile Type</button>
        <button onClick={() => openAddForm("accessories")} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: styles.buttonAddAccessory, color: styles.buttonText, border: "none", borderRadius: styles.radius, cursor: "pointer" }}>Add Accessory Type</button>
        <button onClick={() => setShowMobilePopup(true)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: styles.buttonMobileList, color: styles.secondaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer" }}>Mobile List</button>
        <button onClick={() => setShowAccessoriesPopup(true)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: styles.buttonAccessoriesList, color: styles.secondaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer" }}>Accessories List</button>
        <button onClick={() => { setShowExcelOptions(!showExcelOptions); setShowAddForm(false); }} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: styles.buttonExcel, color: styles.buttonText, border: "none", borderRadius: styles.radius, cursor: "pointer" }}>Excel Options</button>
        <button onClick={() => setShowBulkDeleteModal(true)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1rem", backgroundColor: styles.destructive, color: styles.destructiveForeground, border: "none", borderRadius: styles.radius, cursor: "pointer" }}>Bulk Delete</button>
        {showExcelOptions && (
          <div className="d-flex flex-wrap gap-2">
            <button onClick={handleExportMobiles} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer", justifyContent: "center" }}>Export Mobiles Template</button>
            <button onClick={handleExportAccessories} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer", justifyContent: "center" }}>Export Accessories Template</button>
            <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleImportExcel} accept=".xlsx, .xls" />
            <button onClick={() => fileInputRef.current.click()} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer", justifyContent: "center" }}>Import Products</button>
            <input type="file" ref={imageInputRef} style={{ display: "none" }} onChange={handleUploadImages} accept="image/*" multiple />
            <button onClick={() => imageInputRef.current.click()} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer", justifyContent: "center" }}>Upload Images</button>
          </div>
        )}
      </div>
      {uploadedImages.length > 0 && (
        <div className="mt-4">
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: styles.textColor }}>Uploaded Images</h2>
          <div className="row g-3">
            {uploadedImages.map((img, index) => (
              <div key={index} className="col-md-2 col-sm-4 col-6">
                <div style={{ position: "relative" }}>
                  <div style={{ width: "100%", height: "150px", overflow: "hidden", borderRadius: styles.radius, boxShadow: styles.shadow }}>
                    <img src={img.image_path} alt={`Uploaded ${index}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <p style={{ textAlign: "center", marginTop: "0.5rem", color: styles.secondaryTextColor }}>{img.image_id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="position-relative mb-4">
        <Search style={{ position: "absolute", left: "0.75rem", top: "0.75rem", color: styles.mutedForeground }} size={16} />
        <input placeholder="Search products..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} style={{ paddingLeft: "2.5rem", width: "100%", padding: "0.5rem", border: `1px solid ${styles.border}`, borderRadius: styles.radius, backgroundColor: styles.input, color: styles.foreground }} />
      </div>
      {showAddForm && (
        <form onSubmit={handleSubmit} style={{ backgroundColor: styles.cardBg, padding: "1.5rem", borderRadius: styles.radius, boxShadow: styles.shadow, marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: styles.textColor }}>{editingProduct ? "Edit Product" : editingMobile ? "Edit Mobile Type" : editingAccessory ? "Edit Accessory Type" : formType === "mobile" ? "Add Mobile Type" : formType === "accessories" ? "Add Accessory Type" : "Add Product"}</h2>
          <div className="row g-3">
            {formType === "product" && (
              <>
                <div className="col-md-6 col-lg-4">
                  <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}>Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.border}`, borderRadius: styles.radius, fontSize: "1rem", backgroundColor: styles.input, color: styles.foreground }} />
                </div>
                <div className="col-md-6 col-lg-4">
                  <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}>Price (₹) *</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.border}`, borderRadius: styles.radius, fontSize: "1rem", backgroundColor: styles.input, color: styles.foreground }} />
                </div>
                <div className="col-md-6 col-lg-4">
                  <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}>Stock Quantity *</label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.border}`, borderRadius: styles.radius, fontSize: "1rem", backgroundColor: styles.input, color: styles.foreground }} />
                </div>
                <div className="col-md-6 col-lg-4">
                  <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}>Category *</label>
                  <input type="text" value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value, model: "", accessoryType: "", newMobile: "", newAccessoryName: "", newAccessoryModel: "", type: "" })} required style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.border}`, borderRadius: styles.radius, fontSize: "1rem", backgroundColor: styles.input, color: styles.foreground }} />
                </div>
                {formData.category === "Mobile" && (
                  <>
                    <div className="col-md-6 col-lg-4">
                      <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}>Existing Model</label>
                      <select value={formData.model} onChange={(e) => setFormData({ ...formData, model: e.target.value, newMobile: "" })} style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.border}`, borderRadius: styles.radius, fontSize: "1rem", backgroundColor: styles.input, color: styles.foreground }}>
                        <option value="">Select a model</option>
                        {mobiles.map((mobile) => <option key={mobile._id} value={mobile.name}>{mobile.name}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}>New Mobile Type</label>
                      <input type="text" value={formData.newMobile} onChange={(e) => setFormData({ ...formData, newMobile: e.target.value, model: "" })} style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.border}`, borderRadius: styles.radius, fontSize: "1rem", backgroundColor: styles.input, color: styles.foreground }} />
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}>Type (Brand/General Model)</label>
                      <input type="text" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.border}`, borderRadius: styles.radius, fontSize: "1rem", backgroundColor: styles.input, color: styles.foreground }} />
                    </div>
                  </>
                )}
                {formData.category === "Accessories" && (
                  <>
                    <div className="col-md-6 col-lg-4">
                      <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}>Existing Accessory Type</label>
                      <select value={formData.accessoryType} onChange={(e) => setFormData({ ...formData, accessoryType: e.target.value, newAccessoryName: "", newAccessoryModel: "" })} style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.border}`, borderRadius: styles.radius, fontSize: "1rem", backgroundColor: styles.input, color: styles.foreground }}>
                        <option value="">Select an accessory type</option>
                        {accessories.map((accessory) => <option key={accessory._id} value={accessory.accessoryType}>{accessory.accessoryModel} - {accessory.accessoryName}</option>)}
                      </select>
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}>New Accessory Name</label>
                      <input type="text" value={formData.newAccessoryName} onChange={(e) => setFormData({ ...formData, newAccessoryName: e.target.value, accessoryType: "" })} style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.border}`, borderRadius: styles.radius, fontSize: "1rem", backgroundColor: styles.input, color: styles.foreground }} />
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}>New Accessory Model</label>
                      <input type="text" value={formData.newAccessoryModel} onChange={(e) => setFormData({ ...formData, newAccessoryModel: e.target.value, accessoryType: "" })} style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.border}`, borderRadius: styles.radius, fontSize: "1rem", backgroundColor: styles.input, color: styles.foreground }} />
                    </div>
                    <div className="col-md-6 col-lg-4">
                      <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}>Type (Brand/General Model)</label>
                      <input type="text" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.border}`, borderRadius: styles.radius, fontSize: "1rem", backgroundColor: styles.input, color: styles.foreground }} />
                    </div>
                  </>
                )}
                <div className="col-md-6 col-lg-4">
                  <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}>Supplier</label>
                  <input type="text" value={formData.supplier} onChange={(e) => setFormData({ ...formData, supplier: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.border}`, borderRadius: styles.radius, fontSize: "1rem", backgroundColor: styles.input, color: styles.foreground }} />
                </div>
                <div className="col-md-6 col-lg-4">
                  <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}>Minimum Stock Level</label>
                  <input type="number" value={formData.minStock} onChange={(e) => setFormData({ ...formData, minStock: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.border}`, borderRadius: styles.radius, fontSize: "1rem", backgroundColor: styles.input, color: styles.foreground }} />
                </div>
                <div className="col-md-6 col-lg-4">
                  <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}>Barcode</label>
                  <input type="text" value={formData.barcode} onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.border}`, borderRadius: styles.radius, fontSize: "1rem", backgroundColor: styles.input, color: styles.foreground }} />
                </div>
                <div className="col-md-6 col-lg-4">
                  <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}>Image ID (Read-only)</label>
                  <input type="text" value={formData.image_id} readOnly style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.border}`, borderRadius: styles.radius, fontSize: "1rem", backgroundColor: styles.inputReadOnlyBg, color: styles.foreground }} />
                </div>
                <div className="col-md-6 col-lg-4">
                  <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}>Product Image</label>
                  <input type="file" accept="image/*" onChange={handleImageChange} style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.border}`, borderRadius: styles.radius, fontSize: "1rem", backgroundColor: styles.input, color: styles.foreground }} />
                  {imagePreview && (
                    <div style={{ width: "150px", height: "150px", overflow: "hidden", borderRadius: styles.radius, marginTop: "0.5rem" }}>
                      <img src={imagePreview} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                  )}
                </div>
              </>
            )}
            {formType === "mobile" && (
              <div className="col-md-6 col-lg-4">
                <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}>Mobile Name *</label>
                <input type="text" value={formData.newMobile} onChange={(e) => setFormData({ ...formData, newMobile: e.target.value })} required style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.border}`, borderRadius: styles.radius, fontSize: "1rem", backgroundColor: styles.input, color: styles.foreground }} />
              </div>
            )}
            {formType === "accessories" && (
              <>
                <div className="col-md-6 col-lg-4">
                  <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}>Accessory Name *</label>
                  <input type="text" value={formData.newAccessoryName} onChange={(e) => setFormData({ ...formData, newAccessoryName: e.target.value })} required style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.border}`, borderRadius: styles.radius, fontSize: "1rem", backgroundColor: styles.input, color: styles.foreground }} />
                </div>
                <div className="col-md-6 col-lg-4">
                  <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}>Accessory Model *</label>
                  <input type="text" value={formData.newAccessoryModel} onChange={(e) => setFormData({ ...formData, newAccessoryModel: e.target.value })} required style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.border}`, borderRadius: styles.radius, fontSize: "1rem", backgroundColor: styles.input, color: styles.foreground }} />
                </div>
                <div className="col-md-6 col-lg-4">
                  <label style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}>Type (Brand/General Model)</label>
                  <input type="text" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.border}`, borderRadius: styles.radius, fontSize: "1rem", backgroundColor: styles.input, color: styles.foreground }} />
                </div>
              </>
            )}
          </div>
          <div className="d-flex gap-2 mt-3">
            <button type="submit" style={{ padding: "0.5rem 1rem", backgroundColor: styles.buttonBg, color: styles.buttonText, border: "none", borderRadius: styles.radius, cursor: "pointer" }}>
              {editingProduct ? "Update Product" : editingMobile ? "Update Mobile Type" : editingAccessory ? "Update Accessory Type" : "Add " + (formType === "mobile" ? "Mobile Type" : formType === "accessories" ? "Accessory Type" : "Product")}
            </button>
            <button type="button" onClick={resetForm} style={{ padding: "0.5rem 1rem", backgroundColor: styles.secondary, color: styles.secondaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer" }}>Cancel</button>
          </div>
        </form>
      )}
      <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: styles.textColor }}>Product List</h2>
      <div className="d-flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => { setCategoryFilter("all"); setCurrentPage(1); }}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: categoryFilter === "all" ? styles.primary : styles.secondary,
            color: categoryFilter === "all" ? styles.primaryForeground : styles.secondaryForeground,
            border: "none",
            borderRadius: styles.radius,
            cursor: "pointer"
          }}
        >
          All
        </button>
        {uniqueCategories.map((category) => (
          <button
            key={category}
            onClick={() => { setCategoryFilter(category); setCurrentPage(1); }}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: categoryFilter === category ? styles.primary : styles.secondary,
              color: categoryFilter === category ? styles.primaryForeground : styles.secondaryForeground,
              border: "none",
              borderRadius: styles.radius,
              cursor: "pointer"
            }}
          >
            {category}
          </button>
        ))}
      </div>
      <div className="row g-3">
        {currentProducts.map((product) => (
          <div key={product._id} className="col-lg-3 col-md-4 col-sm-6">
            <div style={{ backgroundColor: styles.cardBg, padding: "1rem", borderRadius: styles.radius, boxShadow: styles.shadowCard, transition: "all 0.2s", height: "100%" }} onMouseEnter={(e) => { e.currentTarget.style.transform = styles.cardHoverTransform; e.currentTarget.style.boxShadow = styles.cardHoverShadow; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = styles.shadowCard; }}>
              <img src={product.image || `https://placehold.co/150x150/${styles.placeholderImageBg.slice(1)}/${styles.placeholderImageText.slice(1)}?text=No+Image`} alt={product.name} style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: styles.radius, marginBottom: "0.5rem", transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"} onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"} onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/150x150/${styles.placeholderImageBg.slice(1)}/${styles.placeholderImageText.slice(1)}?text=No+Image`; }} />
              <h3 style={{ fontSize: "1rem", fontWeight: "600", color: styles.textColor }}>{product.name}</h3>
              <p style={{ color: styles.secondaryTextColor }}>₹{product.price.toLocaleString()}</p>
              <p style={{ color: styles.secondaryTextColor }}>Category: {product.category}</p>
              {product.model && <p style={{ color: styles.secondaryTextColor }}>Model: {product.model}</p>}
              {product.type && <p style={{ color: styles.secondaryTextColor }}>Type: {product.type}</p>}
              {product.accessoryType && <p style={{ color: styles.secondaryTextColor }}>Accessory Type: {product.accessoryType}</p>}
              {product.image_id && <p style={{ color: styles.secondaryTextColor }}>Image ID: {product.image_id}</p>}
              {product.image_path && <p style={{ color: styles.secondaryTextColor }}>Image Path: {product.image_path}</p>}
              <div style={{ marginTop: "0.5rem", padding: "0.25rem 0.5rem", borderRadius: styles.radius, color: product.stock > 20 ? styles.successForeground : product.stock > 0 ? styles.warningForeground : styles.destructiveForeground, backgroundColor: product.stock > 20 ? styles.statusSuccess : product.stock > 0 ? styles.statusWarning : styles.statusDestructive }}>
                {product.stock > 0 ? `Stock ${product.stock}` : "Out of Stock"}
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button onClick={() => editProduct(product)} style={{ padding: "0.25rem 0.5rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius }}><Edit size={16} /></button>
                <button onClick={() => deleteProduct(product._id)} style={{ padding: "0.25rem 0.5rem", backgroundColor: styles.destructive, color: styles.destructiveForeground, border: "none", borderRadius: styles.radius }}><Trash2 size={16} /></button>
              </div>
            </div>
          </div>
        ))}
        {filteredProducts.length === 0 && <p className="col-12 text-center" style={{ color: styles.mutedForeground }}>No products found matching your search.</p>}
      </div>
      {filteredProducts.length > productsPerPage && (
        <div className="d-flex justify-content-center align-items-center gap-3 mt-3">
          <button onClick={handlePrevPage} disabled={currentPage === 1} style={{ padding: "0.5rem 1rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer" }}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={handleNextPage} disabled={currentPage === totalPages} style={{ padding: "0.5rem 1rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius, cursor: "pointer" }}>Next</button>
        </div>
      )}
      {showMobilePopup && (
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: styles.popupBg, padding: "1.5rem", borderRadius: styles.radius, boxShadow: styles.shadowElegant, zIndex: 1000, maxWidth: "24rem", width: "100%" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: styles.textColor }}>Mobile List</h2>
          <button onClick={() => setShowMobilePopup(false)} style={{ background: "none", border: "none", cursor: "pointer", color: styles.mutedForeground }}><X size={20} /></button>
          {mobiles.map((mobile) => (
            <div key={mobile._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span>{mobile.name}</span>
              <div>
                <button onClick={() => editMobile(mobile)} style={{ padding: "0.25rem 0.5rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius }}>Edit</button>
                <button onClick={() => deleteMobile(mobile._id)} style={{ padding: "0.25rem 0.5rem", backgroundColor: styles.destructive, color: styles.destructiveForeground, border: "none", borderRadius: styles.radius }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showAccessoriesPopup && (
        <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: styles.popupBg, padding: "1.5rem", borderRadius: styles.radius, boxShadow: styles.shadowElegant, zIndex: 1000, maxWidth: "24rem", width: "100%" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: styles.textColor }}>Accessories List</h2>
          <button onClick={() => setShowAccessoriesPopup(false)} style={{ background: "none", border: "none", cursor: "pointer", color: styles.mutedForeground }}><X size={20} /></button>
          {accessories.map((accessory) => (
            <div key={accessory._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <span>{accessory.accessoryModel} - {accessory.accessoryName}</span>
              <div>
                <button onClick={() => editAccessory(accessory)} style={{ padding: "0.25rem 0.5rem", backgroundColor: styles.primary, color: styles.primaryForeground, border: "none", borderRadius: styles.radius }}>Edit</button>
                <button onClick={() => deleteAccessory(accessory._id)} style={{ padding: "0.25rem 0.5rem", backgroundColor: styles.destructive, color: styles.destructiveForeground, border: "none", borderRadius: styles.radius }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showBulkDeleteModal && (
        <BulkDeleteModal
          categories={uniqueCategories}
          onClose={() => setShowBulkDeleteModal(false)}
          onDelete={handleBulkDelete}
          theme={theme}
        />
      )}
      {showConfirmModal && <ConfirmModal message={confirmMessage} onConfirm={onConfirmAction} onCancel={() => setShowConfirmModal(false)} theme={theme} />}
      {showAlertModal && <AlertModal message={alertMessage} onClose={() => setShowAlertModal(false)} theme={theme} />}
    </div>
  );
};
export default InventoryManagement;