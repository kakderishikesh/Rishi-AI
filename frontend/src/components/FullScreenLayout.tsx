import { ReactNode, useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar"; 
import Navbar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Menu, ChevronLeft } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

export default function FullScreenLayout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false); // Close sidebar on mobile
      }
    };

    // Run once on mount
    handleResize();

    // Attach event listener
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-screen w-full flex bg-white overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Everything that shifts: NavBar, Toggle, Chat, Footer */}
      <div
        className={`flex flex-col flex-1 transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* NavBar inside the shifting container */}
        <Navbar />

        {/* Toggle Sidebar Button */}
        <div className="px-4 py-2 border-b border-gray-200">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded hover:bg-gray-100 transition text-gray-600"
          aria-label="Toggle Sidebar"
        >
        {sidebarOpen ? (
        <ChevronLeft
          className={`w-5 h-5 transition-transform duration-300 ${
          sidebarOpen ? "rotate-0" : "rotate-180"
          }`}
          />
  ) : (
    <Menu className="w-5 h-5" />
  )}
</button>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}