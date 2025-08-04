import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  Phone,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun,
} from "lucide-react";

const Sidebar = ({ activePage, setActivePage, isOpen, setIsOpen, theme, toggleTheme }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home, path: "/" },
    { id: "pos", label: "Point of Sale", icon: ShoppingCart, path: "/pos" },
    { id: "inventory", label: "Inventory", icon: Package, badge: "12", path: "/inventory" },
    { id: "customers", label: "Customers", icon: Users, path: "/customers" },
    { id: "reports", label: "Reports", icon: BarChart3, path: "/reports" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100%",
        width: isOpen ? "16rem" : "4rem",
        backgroundColor: theme === "light" ? "#ffffff" : "#1f2937",
        borderRight: `1px solid ${theme === "light" ? "#e5e7eb" : "#374151"}`,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        transition: "width 0.3s",
        zIndex: 50,
      }}
    >
      <div
        style={{
          padding: "1rem",
          borderBottom: `1px solid ${theme === "light" ? "#e5e7eb" : "#374151"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: isOpen ? "space-between" : "center",
        }}
      >
        {isOpen && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                width: "2rem",
                height: "2rem",
                backgroundColor: "#3b82f6",
                borderRadius: "0.25rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginRight: "0.5rem",
              }}
            >
              <Phone size={20} style={{ color: "#ffffff" }} />
            </div>
            <div>
              <h2
                style={{
                  fontWeight: "700",
                  color: theme === "light" ? "#1f2937" : "#ffffff",
                  margin: 0,
                }}
              >
                MobileShop
              </h2>
              <p
                style={{
                  color: theme === "light" ? "#6b7280" : "#9ca3af",
                  fontSize: "0.75rem",
                  margin: 0,
                }}
              >
                Retail Management
              </p>
            </div>
          </div>
        )}
        <button
          style={{
            width: "2rem",
            height: "2rem",
            background: "none",
            border: `1px solid ${theme === "light" ? "#d1d5db" : "#4b5563"}`,
            borderRadius: "0.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: theme === "light" ? "#6b7280" : "#9ca3af",
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>
      <nav style={{ padding: "1rem" }}>
        {menuItems.map((item) => (
          <Link
            key={item.id}
            to={item.path}
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              height: "2.75rem",
              padding: "0.5rem",
              marginBottom: "0.5rem",
              backgroundColor:
                activePage === item.id
                  ? "#3b82f6"
                  : theme === "light"
                  ? "#ffffff"
                  : "#374151",
              color: activePage === item.id ? "#ffffff" : theme === "light" ? "#6b7280" : "#9ca3af",
              border: `1px solid ${activePage === item.id ? "#3b82f6" : theme === "light" ? "#d1d5db" : "#4b5563"}`,
              borderRadius: "0.25rem",
              textDecoration: "none",
              transition: "all 0.2s",
            }}
            onClick={() => setActivePage(item.id)}
          >
            <item.icon size={20} style={{ marginRight: isOpen ? "0.5rem" : 0 }} />
            {isOpen && (
              <>
                <span style={{ flexGrow: 1, textAlign: "left" }}>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      backgroundColor: "#dc2626",
                      color: "#ffffff",
                      padding: "0.25rem 0.5rem",
                      borderRadius: "0.25rem",
                      fontSize: "0.75rem",
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        ))}
      </nav>
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "1rem",
        }}
      >
        <button
          style={{
            width: "100%",
            height: "2.75rem",
            display: "flex",
            alignItems: "center",
            padding: "0.5rem",
            marginBottom: "0.5rem",
            background: "none",
            border: `1px solid ${theme === "light" ? "#d1d5db" : "#4b5563"}`,
            borderRadius: "0.25rem",
            color: theme === "light" ? "#6b7280" : "#9ca3af",
            cursor: "pointer",
          }}
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <Moon size={20} style={{ marginRight: isOpen ? "0.5rem" : 0 }} />
          ) : (
            <Sun size={20} style={{ marginRight: isOpen ? "0.5rem" : 0 }} />
          )}
          {isOpen && (
            <span>Toggle {theme === "light" ? "Dark" : "Light"} Mode</span>
          )}
        </button>
        {isOpen && (
          <div
            style={{
              backgroundColor: theme === "light" ? "#f3f4f6" : "#374151",
              borderRadius: "0.25rem",
              padding: "0.5rem",
              marginBottom: "0.75rem",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: "2rem",
                  height: "2rem",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: "0.5rem",
                }}
              >
                <span
                  style={{
                    color: "#3b82f6",
                    fontSize: "0.75rem",
                    fontWeight: "500",
                  }}
                >
                  SK
                </span>
          </div>
          <div style={{ flexGrow: 1 }}>
            <p
              style={{
                fontWeight: "500",
                fontSize: "0.875rem",
                margin: 0,
                color: theme === "light" ? "#1f2937" : "#ffffff",
              }}
            >
              Shop Keeper
            </p>
            <p
              style={{
                fontSize: "0.75rem",
                color: theme === "light" ? "#6b7280" : "#9ca3af",
                margin: 0,
              }}
            >
              admin@mobileshop.com
            </p>
          </div>
        </div>
      </div>
    )}
    <button
      style={{
        width: "100%",
        height: "2.75rem",
        display: "flex",
        alignItems: "center",
        padding: "0.5rem",
        background: "none",
        border: "1px solid #dc2626",
        borderRadius: "0.25rem",
        color: "#dc2626",
        cursor: "pointer",
      }}
    >
      <LogOut size={20} style={{ marginRight: isOpen ? "0.5rem" : 0 }} />
      {isOpen && <span>Logout</span>}
    </button>
  </div>
</div>
);
};

export default Sidebar;