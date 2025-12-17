import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import logo from "/src/assets/Ekornes_logo_desktop.svg";
import logOut from "/src/assets/logout-2-svgrepo-com.svg";
import userIcon from "/src/assets/user-svgrepo-com.svg";
import { useEffect, useState } from "react";
import { DownloadTableExcel } from "react-export-table-to-excel";
import reportIcon from "/src/assets/bill-svgrepo-com.svg";

export function Navigation({ tableRef }) {
  const navigate = useNavigate();

  const [isTableReady, setIsTableReady] = useState(false);

  useEffect(() => {
    if (tableRef.current) {
      setIsTableReady(true);
    }
  }, [tableRef.current]);
  const [userRole, setUserRole] = useState(localStorage.getItem("Power"));

  useEffect(() => {
    const handleStorageChange = () => {
      setUserRole(localStorage.getItem("Power"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (!userRole) return;

    const timer = setTimeout(() => {
      localStorage.removeItem("Power");
      localStorage.removeItem("LoggedUser");
      window.location.href = "/";
    }, 3600000);

    // cleanup when userRole changes or component unmounts
    return () => clearTimeout(timer);
  }, [userRole]);

  const buttonEffects = (action) => {
    if (action === "homepage") {
      if (userRole) {
        navigate("/main");
      } else {
        navigate("/");
      }
    } else if (action === "login") {
      navigate("/");
    } else if (action === "logOut") {
      localStorage.removeItem("Power");
      window.dispatchEvent(new Event("storage"));
      setUserRole(null);
      localStorage.removeItem("LoggedUser");
      navigate("/");
    } else if (action === "scanReport") {
      navigate("/scanning_report");
    } else if (action === "newItem") {
      navigate("/new_item");
    } else if (action === "receiveItems") {
      navigate("receive_items");
    } else if (action === "scanOut") {
      navigate("/scan_out");
    }
  };

  const isLoggedIn = !!userRole;
  const canDownload = ["Admin", "Accounting", "Supervisor"].includes(userRole);
  const canUse = ["Admin", "Accounting", "Supervisor", "Purchaser"].includes(
    userRole
  );

  return (
    <nav id="Main_Navigation">
      <div className="logo_loc" onClick={() => buttonEffects("homepage")}>
        <img src={logo} alt="Ekornes Logo" />
      </div>
      {isLoggedIn && (
        <div className="direct_buttons">
          {userRole === "Admin" && (
            <button
              className="single_button"
              onClick={() => buttonEffects("newItem")}
            >
              Create New Items
            </button>
          )}
          <button
            className="single_button"
            onClick={() => buttonEffects("scanOut")}
          >
            Give to production
          </button>
          <button
            className="single_button"
            onClick={() => buttonEffects("receiveItems")}
          >
            Receive items
          </button>

          {canDownload && isTableReady && (
            <DownloadTableExcel
              filename="warehouse-data"
              sheet="Stock"
              currentTableRef={tableRef.current}
            >
              <button className="single_button">Download Data</button>
            </DownloadTableExcel>
          )}
        </div>
      )}
      <div className="user_spot">
        {canUse && (
          <img
            className="reportBtn"
            onClick={() => buttonEffects("scanReport")}
            src={reportIcon}
            alt=""
          />
        )}
        {/* <img
          src={userIcon}
          alt="User Icon"
          onClick={() => buttonEffects("login")}
        /> */}
        {isLoggedIn && (
          <img
            src={logOut}
            alt="Log Out Icon"
            onClick={() => buttonEffects("logOut")}
          />
        )}
      </div>
    </nav>
  );
}
