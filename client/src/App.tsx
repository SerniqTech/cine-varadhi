import { BrowserRouter } from "react-router";
import { Router } from "./router";
import { AuthProvider } from "./context/auth-context";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
