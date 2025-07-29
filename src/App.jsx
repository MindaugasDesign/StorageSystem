import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Navigation } from "./Components/Navigation/Navigation";
import { Login } from "./Components/Login/Login";

function App() {
  return (
    <>
      <Navigation />
      {/* Route to every page */}
      <Routes>
        <Route
          path="/"
          element={
            <div id="login_page">
              <Login />
            </div>
          }
        />
        <Route
          path="main"
          element={
            <div id="home_Page">
              <h1>Home Page</h1>
            </div>
          }
        />
      </Routes>
      {/* Footer */}
    </>
  );
}
export default App;
