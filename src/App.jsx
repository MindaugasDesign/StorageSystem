import { Route, Routes } from "react-router-dom";
import "./App.css";
import { Navigation } from "./Components/Navigation/Navigation";
import { Login } from "./Components/Login/Login";
import { Homescreen } from "./Components/Homescreen/Homescreen";
import { ItemDetails } from "./Components/ItemDetails/ItemDetails";
import { NewItem } from "./Components/NewItem/NewItem";
import { ReceiveItems } from "./Components/ReceiveItems/ReceiveItems";
import { useRef } from "react";
import { ReceiveItemLog } from "./Components/ReceivedItemLog/ReceivedItemLog";
import { GiveToProduction } from "./Components/GiveToProduction/GiveToProduction";
import { FindItem } from "./Components/FindItem/FindItem";

function App() {
  const tableRef = useRef(null); // ✅ create ref ONCE

  return (
    <>
      <Navigation tableRef={tableRef} />
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
          path="/item_log"
          element={
            <div id="testx">
              <ReceiveItemLog />
            </div>
          }
        />
        <Route
          path="main"
          element={
            <div id="home_Page">
              <Homescreen tableRef={tableRef} />
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
        <Route
          path="receive_items"
          element={
            <div id="receive__Items">
              <ReceiveItems />
            </div>
          }
        />
        <Route
          path="/scan_out"
          element={
            <div id="gtp_page">
              <GiveToProduction />
            </div>
          }
        />
        <Route
          path="/find_item"
          element={
            <div id="findItem_page">
              <FindItem />
            </div>
          }
        />
      </Routes>
      {/* Footer */}
    </>
  );
}
export default App;
