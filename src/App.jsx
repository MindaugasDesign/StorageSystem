import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Navigation } from "./Components/Navigation/Navigation";
import { Login } from "./Components/Login/Login";
import { Homescreen } from "./Components/Homescreen/Homescreen";
import { ItemDetails } from "./Components/ItemDetails/ItemDetails";
import { NewItem } from "./Components/NewItem/NewItem";

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
              <Homescreen />
            </div>
          }
        />

        <Route
          path="details"
          element={
            <div id="item_Details">
              <ItemDetails />
            </div>
          }
        />
        <Route
          path="new_item"
          element={
            <div id="newItemContainer">
              <NewItem />
            </div>
          }
        />
      </Routes>
      {/* Footer */}
    </>
  );
}
export default App;
