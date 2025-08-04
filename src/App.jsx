import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import PointOfSale from "./pages/PointOfSale";
import CustomerManagement from "./pages/CustomerManagement";
import InventoryManagement from "./pages/InventoryManagement";
import Reports from "./pages/Reports";
import SettingsPage from "./pages/SettingsPage";

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState("dashboard");
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <BrowserRouter>
      <div
        className={`d-flex ${theme}`}
        style={{
          minHeight: "100%",
          backgroundColor: theme === "light" ? "#f8f9fa" : "#1a1a1a",
        }}
      >
        <style>
          {`
            html, body {
              height: 100%;
              margin: 0;
              padding: 0;
              background-color: ${theme === "light" ? "#f8f9fa" : "#1a1a1a"};
            }
            .dark {
              background-color: #1a1a1a;
              color: #ffffff;
            }
            .light {
              background-color: #f8f9fa;
              color: #000000;
            }
          `}
        </style>
        <Sidebar
          isOpen={isSidebarOpen}
          setIsOpen={setIsSidebarOpen}
          activePage={activePage}
          setActivePage={setActivePage}
          theme={theme}
          toggleTheme={toggleTheme}
        />
        <main
          className={`flex-grow-1 p-4 ${theme === "light" ? "bg-light text-dark" : "bg-dark text-white"}`}
          style={{
            marginLeft: isSidebarOpen ? "250px" : "70px",
            transition: "margin-left 0.3s",
            minHeight: "100vh",
          }}
        >
          <Routes>
            <Route path="/" element={<Dashboard theme={theme} />} />
            <Route path="/pos" element={<PointOfSale theme={theme} />} />
            <Route path="/customers" element={<CustomerManagement theme={theme} />} />
            <Route path="/inventory" element={<InventoryManagement theme={theme} />} />
            <Route path="/reports" element={<Reports theme={theme} />} />
            <Route path="/settings" element={<SettingsPage theme={theme} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;