// Sidebar.jsx (Modified)
import { useState } from "react";
import { Link } from "react-router-dom";
import { Home, ShoppingCart, Package, Users, BarChart3, Settings, Phone, LogOut, ChevronLeft, ChevronRight, Moon, Sun, Wrench } from "lucide-react";

const Sidebar = ({ activePage, setActivePage, isOpen, setIsOpen, theme, toggleTheme }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/" },
    { id: "pos", label: "Point of Sale", icon: ShoppingCart, path: "/pos" },
    { id: "inventory", label: "Inventory", icon: Package, badge: "12", path: "/inventory" },
    { id: "customers", label: "Customers", icon: Users, path: "/customers" },
    { id: "reports", label: "Reports", icon: BarChart3, path: "/reports" },
    { id: "service", label: "Service", icon: Wrench, path: "/service" }, // Added Service menu item
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  const sidebarStyles = {
    position: "fixed",
    top: 0,
    left: 0,
    height: "100%",
    width: isOpen ? "16rem" : "4rem",
    background: theme === "light" ? "linear-gradient(135deg, #2174ea, #2174ea70)" : theme === "dark" ? "linear-gradient(135deg, #7b2cbf, #7b2cbfaa)" : theme === "nature" ? "linear-gradient(135deg, #4caf50, #4caf5070)" : "linear-gradient(135deg, #ff9800, #ff980070)",
    boxShadow: "0 0 20px -2px rgba(0,0,0,0.15)",
    transition: "width 0.3s ease-in-out",
    zIndex: 50,
    overflow: "hidden",
  };

  const logoSectionStyles = {
    padding: "1.5rem",
    borderBottom: "1px solid rgba(255,255,255,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: isOpen ? "space-between" : "center",
  };

  const logoContainerStyles = { display: "flex", alignItems: "center", gap: "0.75rem" };
  const logoIconContainerStyles = { width: "2.5rem", height: "2.5rem", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "0.5rem", display: "flex", alignItems: "center", justifyContent: "center" };
  const titleStyles = { fontSize: "1.25rem", fontWeight: "700", color: "#ffffff", margin: 0 };
  const subtitleStyles = { fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", margin: 0 };
  const toggleButtonStyles = { width: "2rem", height: "2rem", background: "none", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.8)", transition: "color 0.2s" };
  const navStyles = { padding: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" };

  const getMenuItemStyles = (isActive) => ({
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: isOpen ? "flex-start" : "center",
    gap: isOpen ? "0.75rem" : "0",
    padding: isOpen ? "0.75rem 1rem" : "0.75rem",
    borderRadius: "0.5rem",
    textDecoration: "none",
    color: isActive ? "#ffffff" : "rgba(255,255,255,0.8)",
    backgroundColor: isActive ? "rgba(255,255,255,0.2)" : "transparent",
    transition: "all 0.2s ease-in-out",
    fontWeight: "500",
    textAlign: "left",
    boxShadow: isActive ? "0 0 20px -2px rgba(0,0,0,0.25)" : "none",
  });

  const badgeStyles = { marginLeft: "auto", backgroundColor: theme === "light" ? "#f59e0b" : theme === "dark" ? "#22c55e" : theme === "nature" ? "#ff9800" : "#ff5722", color: "#ffffff", fontSize: "0.75rem", padding: "0.25rem 0.5rem", borderRadius: "9999px" };
  const bottomSectionStyles = { position: "absolute", bottom: "1.5rem", left: "1rem", right: "1rem" };
  const userCardStyles = { backgroundColor: "rgba(255,255,255,0.1)", borderRadius: "0.5rem", padding: "1rem", display: "flex", alignItems: "center", gap: "0.75rem" };
  const avatarContainerStyles = { width: "2rem", height: "2rem", backgroundColor: "rgba(255,255,255,0.2)", borderRadius: "9999px", display: "flex", alignItems: "center", justifyContent: "center" };
  const avatarTextStyles = { color: "#ffffff", fontSize: "0.875rem", fontWeight: "600" };
  const userNameStyles = { fontSize: "0.875rem", fontWeight: "500", color: "#ffffff", margin: 0 };
  const userEmailStyles = { fontSize: "0.75rem", color: "rgba(255,255,255,0.7)", margin: 0 };
  const logoutButtonStyles = { width: "100%", height: "2.75rem", display: "flex", alignItems: "center", padding: "0.5rem", background: "none", border: "1px solid #dc2626", borderRadius: "0.25rem", color: "#dc2626", cursor: "pointer", marginTop: "1rem", transition: "background-color 0.2s" };
  const themeToggleButtonStyles = { width: "100%", height: "2.75rem", display: "flex", alignItems: "center", padding: "0.5rem", background: "none", border: `1px solid ${theme === "light" ? "#d1d5db" : "#4b5563"}`, borderRadius: "0.25rem", color: theme === "light" ? "#6b7280" : "#9ca3af", cursor: "pointer", marginBottom: "0.5rem", transition: "background-color 0.2s" };

  return (
    <div style={sidebarStyles}>
      <div style={logoSectionStyles}>
        {isOpen && (
          <div style={logoContainerStyles}>
            <div style={logoIconContainerStyles}>
              <Phone color="#ffffff" size={20} />
            </div>
            <div>
              <h1 style={titleStyles}>MobileShop</h1>
              <p style={subtitleStyles}>Retail Management</p>
            </div>
          </div>
        )}
        <button onClick={() => setIsOpen(!isOpen)} style={toggleButtonStyles}>{isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}</button>
      </div>
      <nav style={navStyles}>
        {menuItems.map((item) => (
          <Link key={item.id} to={item.path} onClick={() => setActivePage(item.id)} style={getMenuItemStyles(activePage === item.id)} onMouseEnter={(e) => { if (activePage !== item.id) { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.transform = "translateX(0.25rem)"; } }} onMouseLeave={(e) => { if (activePage !== item.id) { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.transform = "translateX(0)"; } }}>
            <item.icon size={20} />
            {isOpen && (
              <>
                {item.label}
                {item.badge && <span style={badgeStyles}>{item.badge}</span>}
              </>
            )}
          </Link>
        ))}
      </nav>
      <div style={bottomSectionStyles}>
        {isOpen && (
          <div style={userCardStyles}>
            <div style={avatarContainerStyles}>
              <span style={avatarTextStyles}>SK</span>
            </div>
            <div>
              <h3 style={userNameStyles}>Shop Keeper</h3>
              <p style={userEmailStyles}>admin@mobileshop.com</p>
            </div>
          </div>
        )}
        <button onClick={toggleTheme} style={themeToggleButtonStyles}>
          {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
          {isOpen && `Toggle ${theme === "light" ? "Dark" : "Light"} Mode`}
        </button>
        <button style={logoutButtonStyles}>
          <LogOut size={16} />
          {isOpen && "Logout"}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;