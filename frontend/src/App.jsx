import AppRoutes from "./routes/AppRoutes";
import ModalProvider from "./context/ModalProvider";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ModalProvider>
      <AppRoutes />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
        }}
      />
    </ModalProvider>
  );
}

export default App;
