import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import ContentArea from "./components/ContentArea";
import Settings from "./components/Settings";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "settings":
        return <Settings />;
      default:
        return <ContentArea />;
    }
  };

  return (
    <div>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <Header setSidebarOpen={setSidebarOpen} />
      {renderPage()}
    </div>
  );
}
