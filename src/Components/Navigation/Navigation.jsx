import { useNavigate } from "react-router-dom";
import "./Navigation.css";
import logo from "/src/assets/Ekornes_logo_desktop.svg";
import logOut from "/src/assets/logout-2-svgrepo-com.svg";
import user from "/src/assets/user-svgrepo-com.svg";
import { useEffect } from "react";
export function Navigation() {
  const navigate = useNavigate();
  const homePage = () => {
    const loggedIn = localStorage.getItem("Power");
    if (loggedIn) {
      navigate("/main");
    } else {
      navigate("/");
    }
    // navigate("/main");
  };
  const loginScreen = () => {
    navigate("/");
  };
  const logOutBtn = () => {
    localStorage.removeItem("Power");
    window.dispatchEvent(new Event("storage"));
    navigate("/");
  };

  useEffect(() => {
    const updateButtons = () => {
      const user = localStorage.getItem("Power");
      const adminButton1 = document.querySelector("#Admin1_Power");
      const adminButton2 = document.querySelector("#Admin2_Power");

      if (user === "Admin") {
        adminButton1.style.display = "inline-block";
        adminButton2.style.display = "inline-block";
      } else if (user === "Accounting") {
        adminButton1.style.display = "inline-block";
      } else {
        adminButton1.style.display = "none";
        adminButton2.style.display = "none";
      }
    };

    updateButtons();
    window.addEventListener("storage", updateButtons);

    return () => {
      window.removeEventListener("storage", updateButtons);
    };
  }, [user]);

  return (
    <>
      <nav id="Main_Navigation">
        <div className="logo_loc" onClick={() => homePage()}>
          <img src={logo} alt="Ekornes Logo" />
        </div>
        <div className="direct_buttons">
          <button className="single_button" id="Admin2_Power">
            Create New Item
          </button>
          <button className="single_button">Give to production</button>
          <button className="single_button">Receive items</button>
          <button className="single_button">Find Item</button>
          <button className="single_button" id="Admin1_Power">
            Download Data
          </button>
        </div>
        <div className="user_spot">
          <img src={user} alt="User SVG" onClick={() => loginScreen()} />
          <img src={logOut} alt="User SVG" onClick={() => logOutBtn()} />
        </div>
      </nav>
    </>
  );
}
