import { useState, useEffect } from "react";
import axios from "axios";
import { Save, X, Sun, Moon, Leaf, Grid, Search, Mail, Download } from "lucide-react";

const SettingsPage = ({ theme, setTheme }) => {
  const [gstPercentage, setGstPercentage] = useState("");
  const [enableGst, setEnableGst] = useState(true);
  const [shopName, setShopName] = useState("");
  const [address, setAddress] = useState("");
  const [gstin, setGstin] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [shopColor, setShopColor] = useState("#000000");
  const [enableGstinPrint, setEnableGstinPrint] = useState(true);
  const [enablePanPrint, setEnablePanPrint] = useState(true);
  const [enableTermsPrint, setEnableTermsPrint] = useState(true);
  const [emailAddress, setEmailAddress] = useState("");
  const [fromEmailAddress, setFromEmailAddress] = useState("");
  const [appPassword, setAppPassword] = useState("");
  const [savedEmailSettings, setSavedEmailSettings] = useState(null);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [backupEmail, setBackupEmail] = useState("");
  const [backupOptions, setBackupOptions] = useState({ daily: false, weekly: false, monthly: false });
  const [dailyInterval, setDailyInterval] = useState(24);
  const [weeklyDay, setWeeklyDay] = useState("mon");
  const [monthlyDay, setMonthlyDay] = useState(1);
  const [savedBackupSettings, setSavedBackupSettings] = useState(null);
  const [isEditingBackup, setIsEditingBackup] = useState(false);
  const [newBackupEmail, setNewBackupEmail] = useState("");
  const [backupEmails, setBackupEmails] = useState([]);
  const [lastBackupDate, setLastBackupDate] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState("GST");
  const [showThemeDropdown, setShowThemeDropdown] = useState(false);
  const [backupUrl, setBackupUrl] = useState(null);
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
    const fetchSettings = async () => {
      try {
        const [settingsResponse, printResponse, emailResponse, backupResponse, lastBackupResponse] = await Promise.all([
          axios.get("http://localhost:5000/api/settings"),
          axios.get("http://localhost:5000/api/print"),
          axios.get("http://localhost:5000/api/email"),
          axios.get("http://localhost:5000/api/backup/settings"),
          axios.get("http://localhost:5000/api/backup/last"),
        ]);
        setGstPercentage(settingsResponse.data.gstPercentage || "");
        setEnableGst(settingsResponse.data.enableGst !== undefined ? settingsResponse.data.enableGst : true);
        setShopName(printResponse.data.shopName || "Your Shop Name");
        setAddress(printResponse.data.address || "123 Shop Street, City, Country");
        setGstin(printResponse.data.gstin || "12ABCDE1234F1Z5");
        setPhoneNumber(printResponse.data.phoneNumber || "");
        setPanNumber(printResponse.data.panNumber || "");
        setShopColor(printResponse.data.shopColor || "#000000");
        setEnableGstinPrint(printResponse.data.enableGstinPrint !== undefined ? printResponse.data.enableGstinPrint : true);
        setEnablePanPrint(printResponse.data.enablePanPrint !== undefined ? printResponse.data.enablePanPrint : true);
        setEnableTermsPrint(printResponse.data.enableTermsPrint !== undefined ? printResponse.data.enableTermsPrint : true);
        setSavedEmailSettings(emailResponse.data);
        setEmailAddress("");
        setFromEmailAddress("");
        setAppPassword("");
        setSavedBackupSettings(backupResponse.data);
        setBackupEmails([]);
        setNewBackupEmail("");
        setBackupOptions({ daily: false, weekly: false, monthly: false });
        setDailyInterval(24);
        setWeeklyDay("mon");
        setMonthlyDay(1);
        setLastBackupDate(lastBackupResponse.data.lastBackupDate || "Never");
      } catch (err) {
        setError(`Failed to fetch settings: ${err.message}`);
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
      setGstPercentage(response.data.gstPercentage);
      setEnableGst(response.data.enableGst);
    } catch (err) {
      setError(`Failed to save GST settings: ${err.response?.data?.error || err.message}`);
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
        gstin,
        phoneNumber,
        panNumber,
        shopColor,
        enableGstinPrint,
        enablePanPrint,
        enableTermsPrint,
      });
      setShopName(response.data.shopName);
      setAddress(response.data.address);
      setGstin(response.data.gstin);
      setPhoneNumber(response.data.phoneNumber);
      setPanNumber(response.data.panNumber);
      setShopColor(response.data.shopColor);
      setEnableGstinPrint(response.data.enableGstinPrint);
      setEnablePanPrint(response.data.enablePanPrint);
      setEnableTermsPrint(response.data.enableTermsPrint);
    } catch (err) {
      setError(`Failed to save print settings: ${err.response?.data?.error || err.message}`);
      console.error("Error saving print settings:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleSaveEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post("http://localhost:5000/api/email", {
        emailAddress,
        fromEmailAddress,
        appPassword,
      });
      setSavedEmailSettings(response.data);
      setEmailAddress("");
      setFromEmailAddress("");
      setAppPassword("");
      setIsEditingEmail(false);
    } catch (err) {
      setError(`Failed to save email settings: ${err.response?.data?.error || err.message}`);
      console.error("Error saving email settings:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteEmail = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.delete("http://localhost:5000/api/email");
      setSavedEmailSettings(null);
      setEmailAddress("");
      setFromEmailAddress("");
      setAppPassword("");
      setIsEditingEmail(false);
    } catch (err) {
      setError(`Failed to delete email settings: ${err.response?.data?.error || err.message}`);
      console.error("Error deleting email settings:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleSaveBackupSettings = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post("http://localhost:5000/api/backup/settings", {
        backupEmail: backupEmails.join(","),
        backupOptions,
        dailyInterval,
        weeklyDay,
        monthlyDay,
      });
      setSavedBackupSettings(response.data);
      setBackupEmails([]);
      setNewBackupEmail("");
      setBackupOptions({ daily: false, weekly: false, monthly: false });
      setDailyInterval(24);
      setWeeklyDay("mon");
      setMonthlyDay(1);
      setIsEditingBackup(false);
    } catch (err) {
      setError(`Failed to save backup settings: ${err.response?.data?.error || err.message}`);
      console.error("Error saving backup settings:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteBackup = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await axios.delete("http://localhost:5000/api/backup/settings");
      setSavedBackupSettings(null);
      setBackupEmails([]);
      setNewBackupEmail("");
      setBackupOptions({ daily: false, weekly: false, monthly: false });
      setDailyInterval(24);
      setWeeklyDay("mon");
      setMonthlyDay(1);
      setIsEditingBackup(false);
    } catch (err) {
      setError(`Failed to delete backup settings: ${err.response?.data?.error || err.message}`);
      console.error("Error deleting backup settings:", err);
    } finally {
      setLoading(false);
    }
  };
  const handleBackup = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setBackupUrl(null);
    try {
      const response = await axios.get("http://localhost:5000/api/backup");
      setBackupUrl(response.data.downloadUrl);
      // Refresh last backup date
      const lastResponse = await axios.get("http://localhost:5000/api/backup/last");
      setLastBackupDate(lastResponse.data.lastBackupDate || "Never");
    } catch (err) {
      setError(`Failed to create backup: ${err.response?.data?.error || err.message}`);
      console.error("Error creating backup:", err);
    } finally {
      setLoading(false);
    }
  };
  const themeOptions = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "nature", label: "Nature", icon: Leaf },
    { id: "sunset", label: "Sunset", icon: Grid },
  ];
  const dayOfWeekOptions = [
    { value: "mon", label: "Monday" },
    { value: "tue", label: "Tuesday" },
    { value: "wed", label: "Wednesday" },
    { value: "thu", label: "Thursday" },
    { value: "fri", label: "Friday" },
    { value: "sat", label: "Saturday" },
    { value: "sun", label: "Sunday" },
  ];
  const selectedTheme = themeOptions.find((t) => t.id === theme) || themeOptions[0];
  return (
    <div style={{ backgroundColor: styles.bgColor, color: styles.foreground, minHeight: "100vh", padding: "2rem" }} className="container">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <div>
          <h1 style={{ fontSize: "1.875rem", fontWeight: "700", color: styles.textColor }}>Settings</h1>
          <p style={{ fontSize: "1rem", color: styles.secondaryTextColor, marginBottom: "1rem" }}>
            Configure your shop settings
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
              transition: "all 0.2s ease-in-out",
            }}
          >
            {selectedTheme && <selectedTheme.icon size={16} />}
            {selectedTheme && selectedTheme.label}
          </div>
          {showThemeDropdown && (
            <div
              style={{
                position: "absolute",
                right: 0,
                top: "100%",
                backgroundColor: styles.dropdownBg,
                border: `1px solid ${styles.border}`,
                borderRadius: styles.radius,
                marginTop: "0.5rem",
                zIndex: 10,
              }}
            >
              {themeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    setTheme(option.id);
                    setShowThemeDropdown(false);
                  }}
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
                    textAlign: "left",
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
        <div
          style={{
            position: "relative",
            maxWidth: "600px",
            display: "flex",
            alignItems: "center",
            border: `1px solid ${styles.border}`,
            borderRadius: styles.radius,
            backgroundColor: styles.input,
          }}
        >
          <Search style={{ marginLeft: "0.75rem", color: styles.mutedForeground }} size={16} />
          <input
            type="text"
            style={{
              flex: 1,
              padding: "0.5rem 0.75rem",
              border: "none",
              borderRadius: styles.radius,
              backgroundColor: "transparent",
              color: styles.foreground,
            }}
            placeholder="Search (e.g., userlist)"
          />
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
        <button
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: activeTab === "GST" ? styles.primary : styles.buttonOutlineBg,
            color: activeTab === "GST" ? styles.primaryForeground : styles.buttonOutlineText,
            border: `1px solid ${styles.border}`,
            borderRadius: styles.radius,
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("GST")}
        >
          GST
        </button>
        <button
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: activeTab === "Print" ? styles.primary : styles.buttonOutlineBg,
            color: activeTab === "Print" ? styles.primaryForeground : styles.buttonOutlineText,
            border: `1px solid ${styles.border}`,
            borderRadius: styles.radius,
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("Print")}
        >
          Print
        </button>
        <button
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: activeTab === "Email" ? styles.primary : styles.buttonOutlineBg,
            color: activeTab === "Email" ? styles.primaryForeground : styles.buttonOutlineText,
            border: `1px solid ${styles.border}`,
            borderRadius: styles.radius,
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("Email")}
        >
          Email
        </button>
        <button
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: activeTab === "Backup" ? styles.primary : styles.buttonOutlineBg,
            color: activeTab === "Backup" ? styles.primaryForeground : styles.buttonOutlineText,
            border: `1px solid ${styles.border}`,
            borderRadius: styles.radius,
            cursor: "pointer",
          }}
          onClick={() => setActiveTab("Backup")}
        >
          Backup
        </button>
      </div>
      {activeTab === "GST" && (
        <div
          style={{
            backgroundColor: styles.cardBg,
            borderRadius: styles.radius,
            boxShadow: styles.shadowCard,
            padding: "1.5rem",
            maxWidth: "600px",
          }}
        >
          <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: styles.textColor }}>
            GST Settings
          </h2>
          <form onSubmit={handleSaveGst}>
            <div style={{ marginBottom: "1rem" }}>
              <label
                style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}
                htmlFor="gstPercentage"
              >
                GST Percentage (%)
              </label>
              <input
                type="number"
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: `1px solid ${styles.border}`,
                  borderRadius: styles.radius,
                  backgroundColor: styles.input,
                  color: styles.foreground,
                }}
                id="gstPercentage"
                value={gstPercentage}
                onChange={(e) => setGstPercentage(e.target.value)}
                placeholder="Enter GST percentage (e.g., 18)"
                min="0"
                step="0.01"
              />
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: styles.secondaryTextColor }}>
                <input
                  type="checkbox"
                  style={{ margin: 0 }}
                  id="enableGst"
                  checked={enableGst}
                  onChange={(e) => setEnableGst(e.target.checked)}
                />
                Enable GST
              </label>
            </div>
            {error && (
              <div
                style={{
                  backgroundColor: styles.statusWarning,
                  color: styles.warningForeground,
                  padding: "0.75rem",
                  borderRadius: styles.radius,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                <X size={16} />
                Warning: {error}
              </div>
            )}
            <button
              type="submit"
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: styles.primary,
                color: styles.primaryForeground,
                border: "none",
                borderRadius: styles.radius,
                cursor: loading ? "not-allowed" : "pointer",
              }}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save GST Settings"}
            </button>
          </form>
        </div>
      )}
      {activeTab === "Print" && (
        <div
          style={{
            backgroundColor: styles.cardBg,
            borderRadius: styles.radius,
            boxShadow: styles.shadowCard,
            padding: "1.5rem",
            maxWidth: "1200px",
          }}
        >
          <div className="row">
            <div className="col-md-6">
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: styles.textColor }}>
                Print Settings
              </h2>
              <form onSubmit={handleSavePrint}>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}
                    htmlFor="shopName"
                  >
                    Shop Name
                  </label>
                  <input
                    type="text"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: `1px solid ${styles.border}`,
                      borderRadius: styles.radius,
                      backgroundColor: styles.input,
                      color: styles.foreground,
                    }}
                    id="shopName"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Enter shop name"
                    required
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}
                    htmlFor="address"
                  >
                    Address
                  </label>
                  <textarea
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: `1px solid ${styles.border}`,
                      borderRadius: styles.radius,
                      backgroundColor: styles.input,
                      color: styles.foreground,
                      minHeight: "80px",
                    }}
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter shop address"
                    rows="3"
                    required
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}
                    htmlFor="gstin"
                  >
                    GSTIN
                  </label>
                  <input
                    type="text"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: `1px solid ${styles.border}`,
                      borderRadius: styles.radius,
                      backgroundColor: styles.input,
                      color: styles.foreground,
                    }}
                    id="gstin"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    placeholder="Enter GSTIN (e.g., 12ABCDE1234F1Z5)"
                    required
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}
                    htmlFor="phoneNumber"
                  >
                    Phone Number
                  </label>
                  <input
                    type="text"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: `1px solid ${styles.border}`,
                      borderRadius: styles.radius,
                      backgroundColor: styles.input,
                      color: styles.foreground,
                    }}
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number (e.g., +91 9811278197)"
                    required
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}
                    htmlFor="panNumber"
                  >
                    PAN Number
                  </label>
                  <input
                    type="text"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: `1px solid ${styles.border}`,
                      borderRadius: styles.radius,
                      backgroundColor: styles.input,
                      color: styles.foreground,
                    }}
                    id="panNumber"
                    value={panNumber}
                    onChange={(e) => setPanNumber(e.target.value)}
                    placeholder="Enter PAN number (e.g., AVHPC9999A)"
                    required
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}
                    htmlFor="shopColor"
                  >
                    Shop Name Color
                  </label>
                  <input
                    type="color"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: `1px solid ${styles.border}`,
                      borderRadius: styles.radius,
                      backgroundColor: styles.input,
                      color: styles.foreground,
                    }}
                    id="shopColor"
                    value={shopColor}
                    onChange={(e) => setShopColor(e.target.value)}
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: styles.secondaryTextColor }}>
                    <input
                      type="checkbox"
                      style={{ margin: 0 }}
                      checked={enableGstinPrint}
                      onChange={(e) => setEnableGstinPrint(e.target.checked)}
                    />
                    Show GSTIN in Print
                  </label>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: styles.secondaryTextColor }}>
                    <input
                      type="checkbox"
                      style={{ margin: 0 }}
                      checked={enablePanPrint}
                      onChange={(e) => setEnablePanPrint(e.target.checked)}
                    />
                    Show PAN Number in Print
                  </label>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: styles.secondaryTextColor }}>
                    <input
                      type="checkbox"
                      style={{ margin: 0 }}
                      checked={enableTermsPrint}
                      onChange={(e) => setEnableTermsPrint(e.target.checked)}
                    />
                    Show Terms & Conditions in Print
                  </label>
                </div>
                {error && (
                  <div
                    style={{
                      backgroundColor: styles.statusWarning,
                      color: styles.warningForeground,
                      padding: "0.75rem",
                      borderRadius: styles.radius,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <X size={16} />
                    Warning: {error}
                  </div>
                )}
                <button
                  type="submit"
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: styles.primary,
                    color: styles.primaryForeground,
                    border: "none",
                    borderRadius: styles.radius,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  disabled={loading}
                >
                  {loading ? "Saving..." : "Save Print Settings"}
                </button>
              </form>
            </div>
            <div className="col-md-6">
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: styles.textColor }}>
                Invoice Preview
              </h2>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  padding: "1rem",
                  border: "1px solid #000",
                  borderRadius: "0.25rem",
                  fontFamily: "Arial, sans-serif",
                  fontSize: "0.875rem",
                  color: "#000000",
                  maxWidth: "500px",
                  margin: "0 auto",
                }}
              >
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                  <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", color: shopColor || "#000000" }}>{shopName || "Akash Enterprises"}</h1>
                  <p style={{ margin: 0 }}>{address || "Ajmer Road, Jaipur, Rajasthan 302020"}</p>
                  <p style={{ margin: 0 }}>Phone: {phoneNumber || "+91 9811278197"}</p>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    {enableGstinPrint && <p style={{ margin: 0 }}>GSTIN: {gstin || "08AALCR2857A1ZD"}</p>}
                    {enablePanPrint && <p style={{ margin: 0 }}>PAN Number: {panNumber || "AVHPC9999A"}</p>}
                  </div>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
                  <tbody>
                    <tr>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>
                        <strong>BILL TO</strong><br />
                        Sampath Singh<br />
                        04, KK Buildings, Ajmer Gate, Jodhpur, Rajasthan, 304582<br />
                        Phone: +91 9811028177<br />
                        PAN Number: BBHPC9999A<br />
                        GSTIN: 08HULMP2839A1AB<br />
                        Place of Supply: Rajasthan
                      </td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>
                        <strong>Invoice No</strong><br />
                        501
                      </td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>
                        <strong>Invoice Date</strong><br />
                        11 August 2023
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
                  <thead>
                    <tr style={{ backgroundColor: hexToRgba(shopColor || "#000000", 0.2) }}>
                      <th style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "left" }}>Sr. No.</th>
                      <th style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "left" }}>Items</th>
                      <th style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "left" }}>Quantity</th>
                      <th style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "left" }}>Price / Unit</th>
                      <th style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "left" }}>Tax / Unit</th>
                      <th style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "left" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>1</td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>Apple normal</td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>5 KG</td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>Rs. 100.00</td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>Rs. 5.00 (5%)</td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>Rs. 525.00</td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>2</td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>Orange</td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>10 KG</td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>Rs. 40.00</td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>Rs. 2.00 (5%)</td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>Rs. 420.00</td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>3</td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>Orange</td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>5 KG</td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>Rs. 40.00</td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>Rs. 2.00 (5%)</td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>Rs. 210.00</td>
                    </tr>
                  </tbody>
                </table>
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1rem" }}>
                  <tbody>
                    <tr>
                      <td style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "right" }}><strong>Sub Total</strong></td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>20 KG</td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}></td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "right" }}>Rs. 1100.00</td>
                    </tr>
                    <tr>
                      <td style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "right" }}><strong>GST</strong></td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}></td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}>Rs. 55.00</td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "right" }}>Rs. 55.00</td>
                    </tr>
                    <tr style={{ backgroundColor: hexToRgba(shopColor || "#000000", 0.2) }}>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}><strong>Grand Total</strong></td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}></td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem" }}></td>
                      <td style={{ border: "1px solid #000", padding: "0.5rem", textAlign: "right" }}>Rs. 1155.00</td>
                    </tr>
                  </tbody>
                </table>
                {enableTermsPrint && (
                  <div style={{ marginBottom: "1rem" }}>
                    <strong>Terms & Conditions</strong>
                    <ol style={{ margin: 0, paddingLeft: "1rem" }}>
                      <li>Note: Verbal Deal</li>
                      <li>Customer will pay the GST</li>
                      <li>Customer will pay the Delivery charges</li>
                      <li>Pay due amount within 15 days</li>
                    </ol>
                  </div>
                )}
                <div style={{ textAlign: "center" }}>
                  <div style={{ borderBottom: "1px solid #000", width: "200px", margin: "2rem auto 0.5rem" }}></div>
                  <strong>Authorized Signature for {shopName || "Akash Enterprises"}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {activeTab === "Email" && (
        <div
          style={{
            backgroundColor: styles.cardBg,
            borderRadius: styles.radius,
            boxShadow: styles.shadowCard,
            padding: "1.5rem",
            maxWidth: "600px",
          }}
        >
          <div className="row">
            <div className="col-md-6">
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: styles.textColor }}>
                Email Settings
              </h2>
              <form onSubmit={handleSaveEmail}>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}
                    htmlFor="emailAddress"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: `1px solid ${styles.border}`,
                      borderRadius: styles.radius,
                      backgroundColor: styles.input,
                      color: styles.foreground,
                    }}
                    id="emailAddress"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="Enter email address (e.g., manojmanoj88680@gmail.com)"
                    required
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}
                    htmlFor="fromEmailAddress"
                  >
                    From Email Address
                  </label>
                  <input
                    type="email"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: `1px solid ${styles.border}`,
                      borderRadius: styles.radius,
                      backgroundColor: styles.input,
                      color: styles.foreground,
                    }}
                    id="fromEmailAddress"
                    value={fromEmailAddress}
                    onChange={(e) => setFromEmailAddress(e.target.value)}
                    placeholder="Enter from email address (e.g., manojmanoj88680@gmail.com)"
                    required
                  />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}
                    htmlFor="appPassword"
                  >
                    App Password
                  </label>
                  <input
                    type="password"
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      border: `1px solid ${styles.border}`,
                      borderRadius: styles.radius,
                      backgroundColor: styles.input,
                      color: styles.foreground,
                    }}
                    id="appPassword"
                    value={appPassword}
                    onChange={(e) => setAppPassword(e.target.value)}
                    placeholder="Enter your app password"
                    required
                  />
                  <p style={{ fontSize: "0.875rem", color: styles.secondaryTextColor, marginTop: "0.25rem" }}>
                    For Gmail, use an App Password from your Google Account settings.{" "}
                    <a
                      href="https://myaccount.google.com/security"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: styles.primary, textDecoration: "underline" }}
                    >
                      Learn more
                    </a>
                  </p>
                </div>
                {error && (
                  <div
                    style={{
                      backgroundColor: styles.statusWarning,
                      color: styles.warningForeground,
                      padding: "0.75rem",
                      borderRadius: styles.radius,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <X size={16} />
                    Warning: {error}
                  </div>
                )}
                <button
                  type="submit"
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: styles.primary,
                    color: styles.primaryForeground,
                    border: "none",
                    borderRadius: styles.radius,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  disabled={loading}
                >
                  {loading ? "Saving..." : isEditingEmail ? "Update Email Settings" : "Save Email Settings"}
                </button>
              </form>
            </div>
            <div className="col-md-6">
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: styles.textColor }}>
                Saved Email Settings
              </h2>
              {savedEmailSettings ? (
                <div
                  style={{
                    backgroundColor: styles.cardBg,
                    padding: "1rem",
                    borderRadius: styles.radius,
                    boxShadow: styles.shadow,
                  }}
                >
                  <p>
                    <strong>Email Address:</strong> {savedEmailSettings.emailAddress}
                  </p>
                  <p>
                    <strong>From Email Address:</strong> {savedEmailSettings.fromEmailAddress}
                  </p>
                  <p>
                    <strong>App Password:</strong> ********
                  </p>
                  <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                    <button
                      onClick={() => {
                        setIsEditingEmail(true);
                        setEmailAddress(savedEmailSettings.emailAddress);
                        setFromEmailAddress(savedEmailSettings.fromEmailAddress);
                        setAppPassword(savedEmailSettings.appPassword);
                      }}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: styles.primary,
                        color: styles.primaryForeground,
                        border: "none",
                        borderRadius: styles.radius,
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDeleteEmail}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: styles.destructive,
                        color: styles.destructiveForeground,
                        border: "none",
                        borderRadius: styles.radius,
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <p style={{ color: styles.secondaryTextColor }}>No email settings saved yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
      {activeTab === "Backup" && (
        <div
          style={{
            backgroundColor: styles.cardBg,
            borderRadius: styles.radius,
            boxShadow: styles.shadowCard,
            padding: "1.5rem",
            maxWidth: "600px",
          }}
        >
          <div className="row">
            <div className="col-md-6">
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: styles.textColor }}>
                Backup Settings
              </h2>
              <p style={{ fontSize: "1rem", color: styles.secondaryTextColor, marginBottom: "1rem" }}>
                Configure automatic backups sent to email.
              </p>
              <form onSubmit={handleSaveBackupSettings}>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}
                  >
                    Add Backup Email
                  </label>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="text"
                      style={{
                        flex: 1,
                        padding: "0.5rem",
                        border: `1px solid ${styles.border}`,
                        borderRadius: styles.radius,
                        backgroundColor: styles.input,
                        color: styles.foreground,
                      }}
                      value={newBackupEmail}
                      onChange={(e) => setNewBackupEmail(e.target.value)}
                      placeholder="Enter email"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (newBackupEmail.trim()) {
                          setBackupEmails([...backupEmails, newBackupEmail.trim()]);
                          setNewBackupEmail("");
                        }
                      }}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: styles.primary,
                        color: styles.primaryForeground,
                        border: "none",
                        borderRadius: styles.radius,
                        cursor: "pointer",
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label
                    style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}
                  >
                    Current Backup Emails
                  </label>
                  {backupEmails.length > 0 ? (
                    <ul style={{ listStyle: "none", padding: 0 }}>
                      {backupEmails.map((email, index) => (
                        <li
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "0.5rem",
                            padding: "0.5rem",
                            backgroundColor: styles.secondary,
                            borderRadius: styles.radius,
                          }}
                        >
                          {email}
                          <button
                            type="button"
                            onClick={() => setBackupEmails(backupEmails.filter((_, i) => i !== index))}
                            style={{
                              background: "transparent",
                              border: "none",
                              cursor: "pointer",
                              color: styles.destructive,
                            }}
                          >
                            <X size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p style={{ color: styles.mutedForeground }}>No backup emails added.</p>
                  )}
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: styles.secondaryTextColor }}>
                    <input
                      type="checkbox"
                      checked={backupOptions.daily}
                      onChange={(e) => setBackupOptions({ ...backupOptions, daily: e.target.checked })}
                    />
                    Daily Backup
                  </label>
                  {backupOptions.daily && (
                    <div style={{ marginLeft: "1.5rem", marginTop: "0.5rem" }}>
                      <label
                        style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}
                        htmlFor="dailyInterval"
                      >
                        Interval (hours)
                      </label>
                      <input
                        type="number"
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: `1px solid ${styles.border}`,
                          borderRadius: styles.radius,
                          backgroundColor: styles.input,
                          color: styles.foreground,
                        }}
                        id="dailyInterval"
                        value={dailyInterval}
                        onChange={(e) => setDailyInterval(parseInt(e.target.value) || 24)}
                        min="1"
                        max="24"
                      />
                    </div>
                  )}
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: styles.secondaryTextColor }}>
                    <input
                      type="checkbox"
                      checked={backupOptions.weekly}
                      onChange={(e) => setBackupOptions({ ...backupOptions, weekly: e.target.checked })}
                    />
                    Weekly Backup
                  </label>
                  {backupOptions.weekly && (
                    <div style={{ marginLeft: "1.5rem", marginTop: "0.5rem" }}>
                      <label
                        style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}
                        htmlFor="weeklyDay"
                      >
                        Day of Week
                      </label>
                      <select
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: `1px solid ${styles.border}`,
                          borderRadius: styles.radius,
                          backgroundColor: styles.input,
                          color: styles.foreground,
                        }}
                        id="weeklyDay"
                        value={weeklyDay}
                        onChange={(e) => setWeeklyDay(e.target.value)}
                      >
                        {dayOfWeekOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: styles.secondaryTextColor }}>
                    <input
                      type="checkbox"
                      checked={backupOptions.monthly}
                      onChange={(e) => setBackupOptions({ ...backupOptions, monthly: e.target.checked })}
                    />
                    Monthly Backup
                  </label>
                  {backupOptions.monthly && (
                    <div style={{ marginLeft: "1.5rem", marginTop: "0.5rem" }}>
                      <label
                        style={{ display: "block", marginBottom: "0.25rem", color: styles.secondaryTextColor }}
                        htmlFor="monthlyDay"
                      >
                        Day of Month (1-31)
                      </label>
                      <input
                        type="number"
                        style={{
                          width: "100%",
                          padding: "0.5rem",
                          border: `1px solid ${styles.border}`,
                          borderRadius: styles.radius,
                          backgroundColor: styles.input,
                          color: styles.foreground,
                        }}
                        id="monthlyDay"
                        value={monthlyDay}
                        onChange={(e) => setMonthlyDay(parseInt(e.target.value) || 1)}
                        min="1"
                        max="31"
                      />
                    </div>
                  )}
                </div>
                {error && (
                  <div
                    style={{
                      backgroundColor: styles.statusWarning,
                      color: styles.warningForeground,
                      padding: "0.75rem",
                      borderRadius: styles.radius,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                    }}
                  >
                    <X size={16} />
                    Warning: {error}
                  </div>
                )}
                <button
                  type="submit"
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: styles.primary,
                    color: styles.primaryForeground,
                    border: "none",
                    borderRadius: styles.radius,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                  disabled={loading}
                >
                  {loading ? "Saving..." : isEditingBackup ? "Update Backup Settings" : "Save Backup Settings"}
                </button>
              </form>
            </div>
            <div className="col-md-6">
              <h2 style={{ fontSize: "1.25rem", fontWeight: "600", marginBottom: "1rem", color: styles.textColor }}>
                Saved Backup Settings
              </h2>
              {savedBackupSettings ? (
                <div
                  style={{
                    backgroundColor: styles.cardBg,
                    padding: "1rem",
                    borderRadius: styles.radius,
                    boxShadow: styles.shadow,
                  }}
                >
                  <p>
                    <strong>Backup Emails:</strong>
                  </p>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {savedBackupSettings.backupEmail
                      ? savedBackupSettings.backupEmail.split(",").map((email, index) => (
                          <li key={index} style={{ marginBottom: "0.5rem" }}>
                            {email.trim()}
                          </li>
                        ))
                      : <p>No emails</p>}
                  </ul>
                  <p>
                    <strong>Backup Options:</strong>
                  </p>
                  <ul style={{ listStyle: "none", padding: 0 }}>
                    {savedBackupSettings.backupOptions.daily && (
                      <li>Daily every {savedBackupSettings.dailyInterval} hours</li>
                    )}
                    {savedBackupSettings.backupOptions.weekly && (
                      <li>Weekly on {dayOfWeekOptions.find((o) => o.value === savedBackupSettings.weeklyDay)?.label}</li>
                    )}
                    {savedBackupSettings.backupOptions.monthly && (
                      <li>Monthly on day {savedBackupSettings.monthlyDay}</li>
                    )}
                    {!savedBackupSettings.backupOptions.daily && !savedBackupSettings.backupOptions.weekly && !savedBackupSettings.backupOptions.monthly && (
                      <li>No options selected</li>
                    )}
                  </ul>
                  <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                    <button
                      onClick={() => {
                        setIsEditingBackup(true);
                        setBackupEmails(
                          savedBackupSettings.backupEmail
                            ? savedBackupSettings.backupEmail.split(",").map((e) => e.trim()).filter((e) => e)
                            : []
                        );
                        setBackupOptions(savedBackupSettings.backupOptions);
                        setDailyInterval(savedBackupSettings.dailyInterval);
                        setWeeklyDay(savedBackupSettings.weeklyDay);
                        setMonthlyDay(savedBackupSettings.monthlyDay);
                      }}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: styles.primary,
                        color: styles.primaryForeground,
                        border: "none",
                        borderRadius: styles.radius,
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={handleDeleteBackup}
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: styles.destructive,
                        color: styles.destructiveForeground,
                        border: "none",
                        borderRadius: styles.radius,
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ) : (
                <p style={{ color: styles.secondaryTextColor }}>No backup settings saved yet.</p>
              )}
            </div>
          </div>
          <hr style={{ margin: "1rem 0" }} />
          <h3 style={{ fontSize: "1.125rem", fontWeight: "600", marginBottom: "0.5rem", color: styles.textColor }}>
            Manual Backup
          </h3>
          <p style={{ fontSize: "1rem", color: styles.secondaryTextColor, marginBottom: "0.5rem" }}>
            Last backup: {lastBackupDate ? new Date(lastBackupDate).toLocaleString() : 'Never'}
          </p>
          <p style={{ fontSize: "1rem", color: styles.secondaryTextColor, marginBottom: "1rem" }}>
            Create a backup of all your data as an Excel file and send to configured emails.
          </p>
          <button
            onClick={handleBackup}
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: styles.primary,
              color: styles.primaryForeground,
              border: "none",
              borderRadius: styles.radius,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
            disabled={loading}
          >
            <Download size={16} />
            {loading ? "Creating and Sending Backup..." : "Create and Send Backup"}
          </button>
          {error && (
            <div
              style={{
                backgroundColor: styles.statusWarning,
                color: styles.warningForeground,
                padding: "0.75rem",
                borderRadius: styles.radius,
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                marginTop: "1rem",
              }}
            >
              <X size={16} />
              Warning: {error}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default SettingsPage;