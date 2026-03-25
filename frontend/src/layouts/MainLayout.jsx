import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function MainLayout({ children }) {
  return (
    <div className="bg-bgLight dark:bg-cardDark flex flex-col min-h-screen">
      <Navbar />
      <div>{children}</div>
      <Footer />
    </div>
  );
}

export default MainLayout;