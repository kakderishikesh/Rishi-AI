
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import RishiAIChat from "../components/RishiAIChat";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-black">
      <NavBar />
      <main className="flex flex-1 flex-col justify-center">
        <RishiAIChat />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
