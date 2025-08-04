import { useState, useEffect } from "react";
import axios from "axios";
import { SaveIcon, XIcon } from "lucide-react";

const SettingsPage = () => {
  const [gstPercentage, setGstPercentage] = useState("");
  const [enableGst, setEnableGst] = useState(true);
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [gstin, setGstin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("GST");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const [settingsResponse, printResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/settings"),
          axios.get("http://localhost:5000/api/print")
        ]);

        setGstPercentage(settingsResponse.data.gstPercentage || "");
        setEnableGst(settingsResponse.data.enableGst !== undefined ? settingsResponse.data.enableGst : true);
        setShopName(printResponse.data.shopName || "Your Shop Name");
        setAddress(printResponse.data.address || "123 Shop Street, City, Country");
        setGstin(printResponse.data.gstin || "12ABCDE1234F1Z5");
      } catch (err) {
        setError("Failed to fetch settings");
        console.error("Error fetching settings:", err);
      }
    };

    fetchSettings();
  }, []);

  const handleSaveGst = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post("http://localhost:5000/api/settings", {
        gstPercentage: parseFloat(gstPercentage) || 0,
        enableGst: enableGst,
      });

      setSuccess("GST settings saved successfully!");
      setGstPercentage(response.data.gstPercentage);
      setEnableGst(response.data.enableGst);
    } catch (err) {
      setError("Failed to save GST settings");
      console.error("Error saving GST settings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrint = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post("http://localhost:5000/api/print", {
        shopName,
        address,
        gstin
      });

      setSuccess("Print settings saved successfully!");
      setShopName(response.data.shopName);
      setAddress(response.data.address);
      setGstin(response.data.gstin);
    } catch (err) {
      setError("Failed to save print settings");
      console.error("Error saving print settings:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-4">
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search (e.g., userlist)"
        />
      </div>
      <div className="mb-4">
        <button
          className={`btn btn-primary me-2`}
          onClick={() => setActiveTab("GST")}
        >
          GST
        </button>
        <button
          className={`btn btn-primary`}
          onClick={() => setActiveTab("Print")}
        >
          Print
        </button>
      </div>
      {activeTab === "GST" && (
        <div className="card shadow-sm p-4" style={{ maxWidth: "600px" }}>
          <h2 className="h5 fw-semibold mb-3">GST Settings</h2>
          <form onSubmit={handleSaveGst}>
            <div className="mb-3">
              <label htmlFor="gstPercentage" className="form-label">
                GST Percentage (%)
              </label>
              <input
                type="number"
                className="form-control"
                id="gstPercentage"
                value={gstPercentage}
                onChange={(e) => setGstPercentage(e.target.value)}
                placeholder="Enter GST percentage (e.g., 18)"
                min="0"
                step="0.01"
              />
            </div>
            <div className="form-check mb-3">
              <input
                type="checkbox"
                className="form-check-input"
                id="enableGst"
                checked={enableGst}
                onChange={(e) => setEnableGst(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="enableGst">
                Enable GST
              </label>
            </div>
            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                <XIcon size={16} />
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
                <SaveIcon size={16} />
                {success}
              </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save GST Settings"}
            </button>
          </form>
        </div>
      )}
      {activeTab === "Print" && (
        <div className="card shadow-sm p-4" style={{ maxWidth: "600px" }}>
          <h2 className="h5 fw-semibold mb-3">Print Settings</h2>
          <form onSubmit={handleSavePrint}>
            <div className="mb-3">
              <label htmlFor="shopName" className="form-label">
                Shop Name
              </label>
              <input
                type="text"
                className="form-control"
                id="shopName"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Enter shop name"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Address
              </label>
              <textarea
                className="form-control"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter shop address"
                rows="3"
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="gstin" className="form-label">
                GSTIN
              </label>
              <input
                type="text"
                className="form-control"
                id="gstin"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                placeholder="Enter GSTIN (e.g., 12ABCDE1234F1Z5)"
                required
              />
            </div>
            {error && (
              <div className="alert alert-danger d-flex align-items-center gap-2" role="alert">
                <XIcon size={16} />
                {error}
              </div>
            )}
            {success && (
              <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
                <SaveIcon size={16} />
                {success}
              </div>
            )}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Saving..." : "Save Print Settings"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;