// App.jsx (Updated with new routes for ServiceAdd and ServiceDetails)
import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import PointOfSale from "./pages/PointOfSale";
import CustomerManagement from "./pages/CustomerManagement";
import InventoryManagement from "./pages/InventoryManagement";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/SettingsPage";
import Loginpage from "./components/Loginpage"; // Import Loginpage
import Service from "./pages/Service"; // Service list page
import ServiceAdd from "./pages/service add"; // New add service page
import ServiceDetails from "./pages/serviceDetails"; // New service details/edit page

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [theme, setTheme] = useState("light");
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('loggedIn') === 'true');

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : theme === "dark" ? "nature" : theme === "nature" ? "sunset" : "light";
    setTheme(newTheme);
    document.body.classList.remove("light", "dark", "nature", "sunset");
    document.body.classList.add(newTheme);
  };

  return (
    <BrowserRouter>
      <div
        className={`d-flex ${theme}`}
        style={{
          minHeight: "100%",
          backgroundColor: theme === "light" ? "#f8f9fa" : theme === "dark" ? "#1a1a1a" : theme === "nature" ? "#f0f7f4" : "#fff7ed",
        }}
      >
        <style>
          {`
            html, body {
              height: 100%;
              margin: 0;
              padding: 0;
              background-color: ${theme === "light" ? "#f8f9fa" : theme === "dark" ? "#1a1a1a" : theme === "nature" ? "#f0f7f4" : "#fff7ed"};
            }
            .light {
              background-color: #f8f9fa;
              color: #000000;
            }
            .dark {
              background-color: #1a1a1a;
              color: #ffffff;
            }
            .nature {
              background-color: #f0f7f4;
              color: #1f2937;
            }
            .sunset {
              background-color: #fff7ed;
              color: #1f2937;
            }
          `}
        </style>
        {isLoggedIn ? (
          <>
            <Sidebar
              isOpen={isSidebarOpen}
              setIsOpen={setIsSidebarOpen}
              activePage={activePage}
              setActivePage={setActivePage}
              theme={theme}
              toggleTheme={toggleTheme}
            />
            <main
              className={`flex-grow-1 p-4 ${theme === "light" ? "bg-light text-dark" : theme === "dark" ? "bg-dark text-white" : theme === "nature" ? "bg-nature text-dark" : "bg-sunset text-dark"}`}
              style={{
                marginLeft: isSidebarOpen ? "250px" : "70px",
                transition: "margin-left 0.3s",
                minHeight: "100vh",
              }}
            >
              <Routes>
                <Route path="/" element={<Dashboard theme={theme} setTheme={setTheme} />} />
                <Route path="/pos" element={<PointOfSale theme={theme} setTheme={setTheme} />} />
                <Route path="/customers" element={<CustomerManagement theme={theme} setTheme={setTheme} />} />
                <Route path="/inventory" element={<InventoryManagement theme={theme} setTheme={setTheme} />} />
                <Route path="/reports" element={<Reports theme={theme} setTheme={setTheme} />} />
                <Route path="/service" element={<Service theme={theme} />} /> // Service list
                <Route path="/service/add" element={<ServiceAdd theme={theme} />} /> // Add service page
                <Route path="/service/:id" element={<ServiceDetails theme={theme} />} /> // Details/edit page
                <Route path="/settings" element={<SettingsPage theme={theme} setTheme={setTheme} />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
          </>
        ) : (
          <Loginpage setIsLoggedIn={setIsLoggedIn} theme={theme} toggleTheme={toggleTheme} />
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;