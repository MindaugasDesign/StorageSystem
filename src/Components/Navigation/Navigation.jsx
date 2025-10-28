import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import logo from "/src/assets/Ekornes_logo_desktop.svg";
import logOut from "/src/assets/logout-2-svgrepo-com.svg";
import userIcon from "/src/assets/user-svgrepo-com.svg";
import { useEffect, useState } from "react";
import { DownloadTableExcel } from "react-export-table-to-excel";

export function Navigation({ tableRef }) {
  const [isTableReady, setIsTableReady] = useState(false);

  useEffect(() => {
    if (tableRef.current) {
      setIsTableReady(true);
    }
  }, [tableRef.current]);
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(localStorage.getItem("Power"));

  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem("Power"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const homePage = () => {
    if (userRole) {
      navigate("/main");
    } else {
      navigate("/");
    }
  };
  const loginScreen = () => navigate("/");
  const logOutBtn = () => {
    localStorage.removeItem("Power");
    window.dispatchEvent(new Event("storage"));
    setUserRole(null);
    navigate("/");
  };
  const newItemPage = () => navigate("/new_item");
  const receiveItemPage = () => navigate("receive_items");
  const scanOut = () => navigate("/scan_out");
  const isLoggedIn = !!userRole;

  return (
    <nav id="Main_Navigation">
      <div className="logo_loc" onClick={homePage}>
        <img src={logo} alt="Ekornes Logo" />
      </div>
      {isLoggedIn && (
        <div className="direct_buttons">
          {userRole === "Admin" && (
            <button className="single_button" onClick={newItemPage}>
              Create New Items
            </button>
          )}
          <button className="single_button" onClick={scanOut}>
            Give to production
          </button>
          <button className="single_button" onClick={receiveItemPage}>
            Receive items
          </button>
          {/* <button className="single_button" onClick={findItem}>
            Find Item
          </button> */}
          {userRole === "Admin" ||
            (userRole === "Accounting" && isTableReady && (
              <DownloadTableExcel
                filename="warehouse-data"
                sheet="Stock"
                currentTableRef={tableRef.current}
              >
                <button className="single_button">Download Data</button>
              </DownloadTableExcel>
            ))}
        </div>
      )}
      <div className="user_spot">
        <img src={userIcon} alt="User Icon" onClick={loginScreen} />
        {isLoggedIn && (
          <img src={logOut} alt="Log Out Icon" onClick={logOutBtn} />
        )}
      </div>
    </nav>
  );
}
