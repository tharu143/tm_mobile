import { useState, useEffect, useRef } from "react";
import { Search, PackagePlus, Edit, Trash2, Package, AlertTriangle, X, FileSpreadsheet, FileUp } from "lucide-react";
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
      buttonTextCancel: "#4b5563",
    },
    dark: {
      bgColor: "#374151",
      textColor: "#ffffff",
      borderColor: "#4b5563",
      buttonBgConfirm: "#ef4444",
      buttonBgCancel: "#4b5563",
      buttonTextCancel: "#ffffff",
    },
  };
  const styles = themeStyles[theme];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          backgroundColor: styles.bgColor,
          borderRadius: "0.5rem",
          padding: "1.5rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          width: "min(90%, 400px)",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "1.125rem", fontWeight: "500", marginBottom: "1.5rem", color: styles.textColor }}>{message}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
          <button
            onClick={onConfirm}
            style={{
              padding: "0.6rem 1.2rem",
              backgroundColor: styles.buttonBgConfirm,
              color: "#ffffff",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "background-color 0.2s ease-in-out",
            }}
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            style={{
              padding: "0.6rem 1.2rem",
              backgroundColor: styles.buttonBgCancel,
              color: styles.buttonTextCancel,
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "0.95rem",
              transition: "background-color 0.2s ease-in-out",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// Custom Alert Modal Component
const AlertModal = ({ message, onClose, theme }) => {
  const themeStyles = {
    light: {
      bgColor: "#ffffff",
      textColor: "#1f2937",
      buttonBg: "#3b82f6",
    },
    dark: {
      bgColor: "#374151",
      textColor: "#ffffff",
      buttonBg: "#2563eb",
    },
  };
  const styles = themeStyles[theme];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.6)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
      }}
    >
      <div
        style={{
          backgroundColor: styles.bgColor,
          borderRadius: "0.5rem",
          padding: "1.5rem",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          width: "min(90%, 400px)",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: "1.125rem", fontWeight: "500", marginBottom: "1.5rem", color: styles.textColor }}>{message}</p>
        <button
          onClick={onClose}
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: styles.buttonBg,
            color: "#ffffff",
            border: "none",
            borderRadius: "0.375rem",
            cursor: "pointer",
            fontWeight: "600",
            fontSize: "0.95rem",
            transition: "background-color 0.2s ease-in-out",
          }}
        >
          OK
        </button>
      </div>
    </div>
  );
};

const InventoryManagement = ({ theme }) => {
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
  const productsPerPage = 8;
  const fileInputRef = useRef(null);
  const categoryOptions = ["Mobile", "Accessories"];

  // Define theme styles
  const themeStyles = {
    light: {
      bgColor: "#f9fafb",
      textColor: "#1f2937",
      secondaryTextColor: "#6b7280",
      cardBg: "#ffffff",
      borderColor: "#d1d5db",
      inputBg: "#ffffff",
      buttonBg: "#3b82f6",
      buttonText: "#ffffff",
      buttonAddMobile: "#10b981",
      buttonAddAccessory: "#8b5cf6",
      buttonMobileList: "#f59e0b",
      buttonAccessoriesList: "#ef4444",
      buttonExcel: "#22c55e",
      dropdownBg: "#ffffff",
      disabledBg: "#e5e7eb",
      shadow: "0 1px 3px rgba(0,0,0,0.1)",
      popupBg: "#ffffff",
      inputReadOnlyBg: "#f3f4f6",
      placeholderImageBg: "#cccccc",
      placeholderImageText: "#ffffff",
    },
    dark: {
      bgColor: "#1f2937",
      textColor: "#ffffff",
      secondaryTextColor: "#9ca3af",
      cardBg: "#374151",
      borderColor: "#4b5563",
      inputBg: "#4b5563",
      buttonBg: "#2563eb",
      buttonText: "#ffffff",
      buttonAddMobile: "#059669",
      buttonAddAccessory: "#7c3aed",
      buttonMobileList: "#d97706",
      buttonAccessoriesList: "#dc2626",
      buttonExcel: "#16a34a",
      dropdownBg: "#374151",
      disabledBg: "#6b7280",
      shadow: "0 1px 3px rgba(0,0,0,0.3)",
      popupBg: "#374151",
      inputReadOnlyBg: "#6b7280",
      placeholderImageBg: "#4b5563",
      placeholderImageText: "#d1d5db",
    },
  };
  const styles = themeStyles[theme];

  const showAlert = (message) => {
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

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.supplier && product.supplier.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.model && product.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.type && product.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (product.accessoryType && product.accessoryType.toLowerCase().includes(searchTerm.toLowerCase()))
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
      image_path: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToSend = new FormData();

    if (formType === "product") {
      if (!formData.name || !formData.price || !formData.stock || !formData.category) {
        showAlert("Please fill all required fields for product (Name, Price, Stock, Category).");
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

      if (imageFile) {
        dataToSend.append("image", imageFile);
      } else if (editingProduct && !imagePreview && (editingProduct.image_id || editingProduct.image_path)) {
        dataToSend.append("image_path", "");
      }
    } else if (formType === "accessories") {
      if (!formData.newAccessoryName || !formData.newAccessoryModel) {
        showAlert("Please fill all required fields for accessory (Accessory Name, Accessory Model).");
        return;
      }
      dataToSend.append("accessoryName", formData.newAccessoryName);
      dataToSend.append("accessoryModel", formData.newAccessoryModel);
      dataToSend.append("category", "Accessories");
      dataToSend.append("type", formData.type || "");
    } else if (formType === "mobile") {
      if (!formData.newMobile) {
        showAlert("Mobile name is required.");
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

      await axios[method](endpoint, dataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showAlert(`${editingProduct ? "Product" : editingMobile ? "Mobile" : editingAccessory ? "Accessory" : formType} ${editingProduct || editingMobile || editingAccessory ? "updated" : "added"} successfully!`);
      fetchProducts();
      fetchMobiles();
      fetchAccessories();
      resetForm();
    } catch (error) {
      console.error("Error saving:", error);
      const errorMsg = error.response?.data?.error || error.message;
      showAlert(`Failed to save ${formType}. Error: ${errorMsg}`);
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
      image_path: "",
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
      image_path: "",
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
        showAlert("Product deleted successfully!");
      } catch (error) {
        console.error("Error deleting product:", error);
        showAlert(`Failed to delete product. Error: ${error.response?.data?.error || error.message}`);
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
        showAlert("Mobile type deleted successfully!");
      } catch (error) {
        console.error("Error deleting mobile:", error);
        showAlert(`Failed to delete mobile type. Error: ${error.response?.data?.error || error.message}`);
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
        showAlert("Accessory type deleted successfully!");
      } catch (error) {
        console.error("Error deleting accessory:", error);
        showAlert(`Failed to delete accessory. Error: ${error.response?.data?.error || error.message}`);
      } finally {
        setShowConfirmModal(false);
      }
    });
  };

  const updateStock = async (id, newStock) => {
    try {
      await axios.put(`http://localhost:5000/api/products/${id}/stock`, { stock: Number(newStock) });
      setProducts(
        products.map((product) => (product._id === id ? { ...product, stock: newStock } : product))
      );
    } catch (error) {
      console.error("Error updating stock:", error);
      showAlert(`Failed to update stock. Error: ${error.response?.data?.error || error.message}`);
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
      image_path: "",
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
      const response = await axios.get("http://localhost:5000/api/export/mobiles", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "mobile_products_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setShowExcelOptions(false);
      showAlert("Mobile products template exported to Excel successfully!");
    } catch (error) {
      console.error("Error exporting mobile products to Excel:", error);
      showAlert(`Failed to export mobile products template. Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleExportAccessories = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/export/accessories", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "accessory_products_template.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setShowExcelOptions(false);
      showAlert("Accessory products template exported to Excel successfully!");
    } catch (error) {
      console.error("Error exporting accessory products to Excel:", error);
      showAlert(`Failed to export accessory products template. Error: ${error.response?.data?.error || error.message}`);
    }
  };

  const handleImportExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:5000/api/import/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showAlert(response.data.message);
      fetchProducts();
      fetchMobiles();
      fetchAccessories();
    } catch (error) {
      console.error("Error importing products from Excel:", error);
      showAlert(`Failed to import products. Error: ${error.response?.data?.error || error.message}`);
    } finally {
      setLoading(false);
      setShowExcelOptions(false);
      event.target.value = "";
    }
  };

  if (loading) return <div style={{ textAlign: "center", padding: "1.25rem", fontSize: "1rem", color: styles.secondaryTextColor }}>Loading inventory...</div>;
  if (error) return <div style={{ textAlign: "center", padding: "1.25rem", fontSize: "1rem", color: "#dc2626" }}>{error}</div>;

  return (
    <div style={{ padding: "1.5rem", backgroundColor: styles.bgColor, color: styles.textColor, fontFamily: "Inter, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: styles.textColor }}>Inventory Management</h1>
          <p style={{ color: styles.secondaryTextColor, fontSize: "1rem" }}>Manage your product inventory</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem", position: "relative", flexWrap: "wrap", justifyContent: "flex-end" }}>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.5rem 1rem",
              backgroundColor: styles.buttonBg,
              color: styles.buttonText,
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              fontWeight: "500",
              minWidth: "120px",
              justifyContent: "center",
            }}
            onClick={() => openAddForm("product")}
          >
            <PackagePlus size={16} style={{ marginRight: "0.5rem" }} />
            Add Product
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.5rem 1rem",
              backgroundColor: styles.buttonAddMobile,
              color: styles.buttonText,
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              fontWeight: "500",
              minWidth: "120px",
              justifyContent: "center",
            }}
            onClick={() => openAddForm("mobile")}
          >
            <PackagePlus size={16} style={{ marginRight: "0.5rem" }} />
            Add Mobile Type
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.5rem 1rem",
              backgroundColor: styles.buttonAddAccessory,
              color: styles.buttonText,
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              fontWeight: "500",
              minWidth: "120px",
              justifyContent: "center",
            }}
            onClick={() => openAddForm("accessories")}
          >
            <PackagePlus size={16} style={{ marginRight: "0.5rem" }} />
            Add Accessory Type
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.5rem 1rem",
              backgroundColor: styles.buttonMobileList,
              color: styles.buttonText,
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              fontWeight: "500",
              minWidth: "100px",
              justifyContent: "center",
            }}
            onClick={() => setShowMobilePopup(true)}
          >
            Mobile List
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.5rem 1rem",
              backgroundColor: styles.buttonAccessoriesList,
              color: styles.buttonText,
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              fontWeight: "500",
              minWidth: "100px",
              justifyContent: "center",
            }}
            onClick={() => setShowAccessoriesPopup(true)}
          >
            Accessories List
          </button>
          <button
            style={{
              display: "flex",
              alignItems: "center",
              padding: "0.5rem 1rem",
              backgroundColor: styles.buttonExcel,
              color: styles.buttonText,
              border: "none",
              borderRadius: "0.25rem",
              cursor: "pointer",
              fontWeight: "500",
              minWidth: "120px",
              justifyContent: "center",
            }}
            onClick={() => {
              setShowExcelOptions(!showExcelOptions);
              setShowAddForm(false);
            }}
          >
            <FileSpreadsheet size={16} style={{ marginRight: "0.5rem" }} />
            Excel Options
          </button>
          {showExcelOptions && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                backgroundColor: styles.dropdownBg,
                borderRadius: "0.25rem",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                marginTop: "0.5rem",
                zIndex: 10,
                padding: "0.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                minWidth: "180px",
              }}
            >
              <button
                onClick={handleExportMobiles}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.5rem 1rem",
                  backgroundColor: theme === "light" ? "#60a5fa" : "#3b82f6",
                  color: styles.buttonText,
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  fontWeight: "500",
                  justifyContent: "center",
                }}
              >
                Export Mobiles Template
              </button>
              <button
                onClick={handleExportAccessories}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.5rem 1rem",
                  backgroundColor: theme === "light" ? "#a78bfa" : "#8b5cf6",
                  color: styles.buttonText,
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  fontWeight: "500",
                  justifyContent: "center",
                }}
              >
                Export Accessories Template
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImportExcel}
                accept=".xlsx, .xls"
                style={{ display: "none" }}
              />
              <button
                onClick={() => fileInputRef.current.click()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.5rem 1rem",
                  backgroundColor: theme === "light" ? "#0ea5e9" : "#0284c7",
                  color: styles.buttonText,
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  fontWeight: "500",
                  justifyContent: "center",
                }}
              >
                <FileUp size={16} style={{ marginRight: "0.5rem" }} />
                Import Products
              </button>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        <div style={{ backgroundColor: styles.cardBg, borderRadius: "0.5rem", boxShadow: styles.shadow, padding: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: styles.secondaryTextColor, fontSize: "0.875rem" }}>Total Products</p>
              <p style={{ fontSize: "1.5rem", fontWeight: "700", color: styles.textColor }}>{products.length}</p>
            </div>
            <Package style={{ height: "2rem", width: "2rem", color: "#2563eb" }} />
          </div>
        </div>
        <div style={{ backgroundColor: styles.cardBg, borderRadius: "0.5rem", boxShadow: styles.shadow, padding: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: styles.secondaryTextColor, fontSize: "0.875rem" }}>Low Stock Items</p>
              <p style={{ fontSize: "1.5rem", fontWeight: "700", color: "#dc2626" }}>{lowStockProducts.length}</p>
            </div>
            <AlertTriangle style={{ height: "2rem", width: "2rem", color: "#dc2626" }} />
          </div>
        </div>
        <div style={{ backgroundColor: styles.cardBg, borderRadius: "0.5rem", boxShadow: styles.shadow, padding: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: styles.secondaryTextColor, fontSize: "0.875rem" }}>Total Stock Value</p>
              <p style={{ fontSize: "1.5rem", fontWeight: "700", color: styles.textColor }}>
                ₹{products.reduce((total, p) => total + p.price * p.stock, 0).toLocaleString()}
              </p>
            </div>
            <Package style={{ height: "2rem", width: "2rem", color: "#16a34a" }} />
          </div>
        </div>
        <div style={{ backgroundColor: styles.cardBg, borderRadius: "0.5rem", boxShadow: styles.shadow, padding: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <p style={{ color: styles.secondaryTextColor, fontSize: "0.875rem" }}>Categories</p>
              <p style={{ fontSize: "1.5rem", fontWeight: "700", color: styles.textColor }}>
                {[...new Set(products.map((p) => p.category))].length}
              </p>
            </div>
            <Package style={{ height: "2rem", width: "2rem", color: "#9333ea" }} />
          </div>
        </div>
      </div>
      <div style={{ position: "relative", marginBottom: "1.5rem" }}>
        <Search style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: styles.secondaryTextColor, height: "1rem", width: "1rem" }} />
        <input
          type="text"
          placeholder="Search products by name, category, supplier, model, type, or accessory type..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            width: "100%",
            padding: "0.5rem 0.5rem 0.5rem 2.25rem",
            border: `1px solid ${styles.borderColor}`,
            borderRadius: "0.25rem",
            fontSize: "1rem",
            color: styles.textColor,
            backgroundColor: styles.inputBg,
          }}
        />
      </div>
      {showAddForm && (
        <div style={{ backgroundColor: styles.cardBg, borderRadius: "0.5rem", boxShadow: styles.shadow, marginBottom: "1.5rem" }}>
          <div style={{ padding: "1rem", borderBottom: `1px solid ${styles.borderColor}` }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: styles.textColor }}>
              {editingProduct
                ? "Edit Product"
                : editingMobile
                ? "Edit Mobile Type"
                : editingAccessory
                ? "Edit Accessory Type"
                : formType === "mobile"
                ? "Add Mobile Type"
                : formType === "accessories"
                ? "Add Accessory Type"
                : "Add Product"}
            </h2>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: "1rem", display: "grid", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {formType === "product" && (
                <>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem", color: styles.textColor }}>Name *</label>
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: styles.inputBg, color: styles.textColor }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem", color: styles.textColor }}>Price (₹) *</label>
                    <input
                      type="number"
                      placeholder="89900"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: styles.inputBg, color: styles.textColor }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem", color: styles.textColor }}>Stock Quantity *</label>
                    <input
                      type="number"
                      placeholder="10"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                      required
                      style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: styles.inputBg, color: styles.textColor }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem", color: styles.textColor }}>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value, model: "", accessoryType: "", newMobile: "", newAccessoryName: "", newAccessoryModel: "", type: "" })}
                      required
                      style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: styles.inputBg, color: styles.textColor }}
                    >
                      <option value="" disabled>Select a category</option>
                      {categoryOptions.map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  {formData.category === "Mobile" && (
                    <>
                      <div>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem", color: styles.textColor }}>Existing Model</label>
                        <select
                          value={formData.model}
                          onChange={(e) => setFormData({ ...formData, model: e.target.value, newMobile: "" })}
                          style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: styles.inputBg, color: styles.textColor }}
                        >
                          <option value="">Select a model</option>
                          {mobiles.map((mobile) => (
                            <option key={mobile._id} value={mobile.name}>{mobile.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem", color: styles.textColor }}>New Mobile Type</label>
                        <input
                          type="text"
                          placeholder="Enter new mobile name (e.g., iPhone 15)"
                          value={formData.newMobile}
                          onChange={(e) => setFormData({ ...formData, newMobile: e.target.value, model: "" })}
                          style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: styles.inputBg, color: styles.textColor }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem", color: styles.textColor }}>Type (Brand/General Model)</label>
                        <input
                          type="text"
                          placeholder="e.g., Apple, Samsung, Oppo"
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: styles.inputBg, color: styles.textColor }}
                        />
                      </div>
                    </>
                  )}
                  {formData.category === "Accessories" && (
                    <>
                      <div>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem", color: styles.textColor }}>Existing Accessory Type</label>
                        <select
                          value={formData.accessoryType}
                          onChange={(e) => setFormData({ ...formData, accessoryType: e.target.value, newAccessoryName: "", newAccessoryModel: "" })}
                          style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: styles.inputBg, color: styles.textColor }}
                        >
                          <option value="">Select an accessory type</option>
                          {accessories.map((accessory) => (
                            <option key={accessory._id} value={`${accessory.accessoryModel} - ${accessory.accessoryName}`}>
                              {accessory.accessoryModel} - {accessory.accessoryName}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem", color: styles.textColor }}>New Accessory Name</label>
                        <input
                          type="text"
                          placeholder="Enter new accessory name (e.g., Clear Case)"
                          value={formData.newAccessoryName}
                          onChange={(e) => setFormData({ ...formData, newAccessoryName: e.target.value, accessoryType: "" })}
                          style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: styles.inputBg, color: styles.textColor }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem", color: styles.textColor }}>New Accessory Model</label>
                        <input
                          type="text"
                          placeholder="Enter new accessory model (e.g., iPhone 14 Pro)"
                          value={formData.newAccessoryModel}
                          onChange={(e) => setFormData({ ...formData, newAccessoryModel: e.target.value, accessoryType: "" })}
                          style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: styles.inputBg, color: styles.textColor }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem", color: styles.textColor }}>Type (Brand/General Model)</label>
                        <input
                          type="text"
                          placeholder="e.g., Apple, Samsung, Generic"
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                          style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: styles.inputBg, color: styles.textColor }}
                        />
                      </div>
                    </>
                  )}
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem", color: styles.textColor }}>Supplier</label>
                    <input
                      type="text"
                      placeholder="Apple Store"
                      value={formData.supplier}
                      onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                      style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: styles.inputBg, color: styles.textColor }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem", color: styles.textColor }}>Minimum Stock Level</label>
                    <input
                      type="number"
                      placeholder="5"
                      value={formData.minStock}
                      onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                      style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: styles.inputBg, color: styles.textColor }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem", color: styles.textColor }}>Barcode</label>
                    <input
                      type="text"
                      placeholder="Auto-generated if empty"
                      value={formData.barcode}
                      onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                      style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: styles.inputBg, color: styles.textColor }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem", color: styles.textColor }}>Image ID (Read-only)</label>
                    <input
                      type="text"
                      value={formData.image_id}
                      readOnly
                      style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: styles.inputReadOnlyBg, color: styles.textColor }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem", color: styles.textColor }}>Product Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: styles.inputBg, color: styles.textColor }}
                    />
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: "100px", marginTop: "0.5rem", borderRadius: "0.25rem" }}
                      />
                    )}
                  </div>
                </>
              )}
              {formType === "mobile" && (
                <div>
                  <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem", color: styles.textColor }}>Mobile Name *</label>
                  <input
                    type="text"
                    placeholder="iPhone 14"
                    value={formData.newMobile}
                    onChange={(e) => setFormData({ ...formData, newMobile: e.target.value })}
                    required
                    style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: styles.inputBg, color: styles.textColor }}
                  />
                </div>
              )}
              {formType === "accessories" && (
                <>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem", color: styles.textColor }}>Accessory Name *</label>
                    <input
                      type="text"
                      placeholder="Phone Case"
                      value={formData.newAccessoryName}
                      onChange={(e) => setFormData({ ...formData, newAccessoryName: e.target.value })}
                      required
                      style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: styles.inputBg, color: styles.textColor }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem", color: styles.textColor }}>Accessory Model *</label>
                    <input
                      type="text"
                      placeholder="iPhone 14"
                      value={formData.newAccessoryModel}
                      onChange={(e) => setFormData({ ...formData, newAccessoryModel: e.target.value })}
                      required
                      style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: styles.inputBg, color: styles.textColor }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.875rem", fontWeight: "500", marginBottom: "0.25rem", color: styles.textColor }}>Type (Brand/General Model)</label>
                    <input
                      type="text"
                      placeholder="e.g., Apple, Samsung, Generic"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      style={{ width: "100%", padding: "0.5rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", fontSize: "1rem", backgroundColor: styles.inputBg, color: styles.textColor }}
                    />
                  </div>
                </>
              )}
            </div>
            <div style={{ display: "flex", gap: "0.5rem", paddingTop: "1rem", flexWrap: "wrap" }}>
              <button
                type="submit"
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: styles.buttonBg,
                  color: styles.buttonText,
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  fontWeight: "500",
                  flexGrow: 1,
                }}
              >
                {editingProduct
                  ? "Update Product"
                  : editingMobile
                  ? "Update Mobile Type"
                  : editingAccessory
                  ? "Update Accessory Type"
                  : "Add " + (formType === "mobile" ? "Mobile Type" : formType === "accessories" ? "Accessory Type" : "Product")}
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: styles.cardBg,
                  color: styles.secondaryTextColor,
                  border: `1px solid ${styles.borderColor}`,
                  borderRadius: "0.25rem",
                  cursor: "pointer",
                  fontWeight: "500",
                  flexGrow: 1,
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {showMobilePopup && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: styles.popupBg, borderRadius: "0.5rem", padding: "1.5rem", width: "min(95%, 500px)", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: styles.textColor }}>Mobile List</h2>
              <button onClick={() => setShowMobilePopup(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={24} color={styles.secondaryTextColor} />
              </button>
            </div>
            {mobiles.length === 0 ? (
              <p style={{ textAlign: "center", color: styles.secondaryTextColor }}>No mobiles found</p>
            ) : (
              mobiles.map((mobile) => (
                <div
                  key={mobile._id}
                  style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  <span style={{ flexGrow: 1, color: styles.textColor }}>{mobile.name}</span>
                  <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                    <button
                      onClick={() => {
                        editMobile(mobile);
                        setShowMobilePopup(false);
                      }}
                      style={{ padding: "0.5rem", backgroundColor: styles.cardBg, border: `1px solid ${styles.buttonBg}`, borderRadius: "0.25rem", cursor: "pointer", color: styles.buttonBg, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteMobile(mobile._id)}
                      style={{ padding: "0.5rem", backgroundColor: styles.cardBg, border: "1px solid #dc2626", borderRadius: "0.25rem", cursor: "pointer", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {showAccessoriesPopup && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: styles.popupBg, borderRadius: "0.5rem", padding: "1.5rem", width: "min(95%, 500px)", maxHeight: "80vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: styles.textColor }}>Accessories List</h2>
              <button onClick={() => setShowAccessoriesPopup(false)} style={{ background: "none", border: "none", cursor: "pointer" }}>
                <X size={24} color={styles.secondaryTextColor} />
              </button>
            </div>
            {accessories.length === 0 ? (
              <p style={{ textAlign: "center", color: styles.secondaryTextColor }}>No accessories found</p>
            ) : (
              accessories.map((accessory) => (
                <div
                  key={accessory._id}
                  style={{ display: "flex", justifyContent: "space-between",  alignItems: "center", padding: "0.75rem", border: `1px solid ${styles.borderColor}`, borderRadius: "0.25rem", marginBottom: "0.5rem", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  <span style={{ flexGrow: 1, color: styles.textColor }}>{accessory.accessoryModel} - {accessory.accessoryName}</span>
                  {accessory.type && <span style={{ flexGrow: 1, color: styles.secondaryTextColor }}>Type: {accessory.type}</span>}
                  <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                    <button
                      onClick={() => {
                        editAccessory(accessory);
                        setShowAccessoriesPopup(false);
                      }}
                      style={{ padding: "0.5rem", backgroundColor: styles.cardBg, border: `1px solid ${styles.buttonBg}`, borderRadius: "0.25rem", cursor: "pointer", color: styles.buttonBg, display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => deleteAccessory(accessory._id)}
                      style={{ padding: "0.5rem", backgroundColor: styles.cardBg, border: "1px solid #dc2626", borderRadius: "0.25rem", cursor: "pointer", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center" }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      <div style={{ backgroundColor: styles.cardBg, borderRadius: "0.5rem", boxShadow: styles.shadow }}>
        <div style={{ padding: "1rem", borderBottom: `1px solid ${styles.borderColor}` }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", color: styles.textColor }}>Product List</h2>
        </div>
        <div style={{ padding: "1rem" }}>
          {currentProducts.length === 0 ? (
            <p style={{ textAlign: "center", color: styles.secondaryTextColor }}>No products found</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem", maxWidth: "1200px", margin: "0 auto" }}>
              {currentProducts.map((product) => (
                <div
                  key={product._id}
                  style={{
                    backgroundColor: styles.cardBg,
                    borderRadius: "0.5rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    padding: "1rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.75rem",
                    height: "100%",
                  }}
                >
                  {product.image ? (
                    <img
                      src={`http://localhost:5000${product.image}`}
                      alt={product.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://placehold.co/150x150/${styles.placeholderImageBg.slice(1)}/${styles.placeholderImageText.slice(1)}?text=No+Image`;
                      }}
                      style={{ width: "100%", height: "150px", objectFit: "cover", borderRadius: "0.25rem", marginBottom: "0.5rem" }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "150px",
                        backgroundColor: styles.placeholderImageBg,
                        borderRadius: "0.25rem",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: styles.placeholderImageText,
                        fontSize: "0.875rem",
                        textAlign: "center",
                        marginBottom: "0.5rem",
                      }}
                    >
                      No Image
                    </div>
                  )}
                  <div style={{ flexGrow: 1 }}>
                    <p style={{ fontWeight: "600", fontSize: "1rem", color: styles.textColor, marginBottom: "0.25rem" }}>{product.name}</p>
                    <p style={{ fontSize: "0.875rem", color: styles.secondaryTextColor, marginBottom: "0.25rem" }}>Price: ₹{product.price.toLocaleString()}</p>
                    <p style={{ fontSize: "0.875rem", color: styles.secondaryTextColor, marginBottom: "0.25rem" }}>Category: {product.category}</p>
                    {product.model && <p style={{ fontSize: "0.875rem", color: styles.secondaryTextColor, marginBottom: "0.25rem" }}>Model: {product.model}</p>}
                    {product.type && <p style={{ fontSize: "0.875rem", color: styles.secondaryTextColor, marginBottom: "0.25rem" }}>Type: {product.type}</p>}
                    {product.accessoryType && <p style={{ fontSize: "0.875rem", color: styles.secondaryTextColor, marginBottom: "0.25rem" }}>Accessory Type: {product.accessoryType}</p>}
                    {product.image_id && <p style={{ fontSize: "0.875rem", color: styles.secondaryTextColor, marginBottom: "0.25rem" }}>Image ID: {product.image_id}</p>}
                    {product.image_path && <p style={{ fontSize: "0.875rem", color: styles.secondaryTextColor, marginBottom: "0.25rem" }}>Image Path: {product.image_path}</p>}
                    <span
                      style={{
                        display: "inline-block",
                        padding: "0.25rem 0.5rem",
                        borderRadius: "0.25rem",
                        fontSize: "0.75rem",
                        color: "#ffffff",
                        backgroundColor: product.stock > 10 ? "#16a34a" : product.stock > 0 ? "#f59e0b" : "#dc2626",
                      }}
                    >
                      Stock: {product.stock}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto" }}>
                    <button
                      onClick={() => editProduct(product)}
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        backgroundColor: styles.buttonBg,
                        color: styles.buttonText,
                        border: "none",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                      }}
                    >
                      <Edit size={16} style={{ marginRight: "0.25rem" }} /> Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(product._id)}
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        backgroundColor: "#dc2626",
                        color: styles.buttonText,
                        border: "none",
                        borderRadius: "0.25rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.875rem",
                        fontWeight: "500",
                      }}
                    >
                      <Trash2 size={16} style={{ marginRight: "0.25rem" }} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {filteredProducts.length > productsPerPage && (
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginTop: "1.5rem" }}>
              <button
                onClick={handlePrevPage}
                disabled={currentPage === 1}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: currentPage === 1 ? styles.disabledBg : styles.buttonBg,
                  color: styles.buttonText,
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: currentPage === 1 ? "not-allowed" : "pointer",
                  fontWeight: "500",
                }}
              >
                Previous
              </button>
              <span style={{ alignSelf: "center", fontSize: "1rem", color: styles.textColor }}>Page {currentPage} of {totalPages}</span>
              <button
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: currentPage === totalPages ? styles.disabledBg : styles.buttonBg,
                  color: styles.buttonText,
                  border: "none",
                  borderRadius: "0.25rem",
                  cursor: currentPage === totalPages ? "not-allowed" : "pointer",
                  fontWeight: "500",
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
      {showConfirmModal && <ConfirmModal message={confirmMessage} onConfirm={onConfirmAction} onCancel={() => setShowConfirmModal(false)} theme={theme} />}
      {showAlertModal && <AlertModal message={alertMessage} onClose={() => setShowAlertModal(false)} theme={theme} />}
    </div>
  );
};

export default InventoryManagement;