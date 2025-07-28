import "./Navigation.css";
import logo from "/src/assets/Ekornes_logo_desktop.svg";
import logOut from "/src/assets/logout-2-svgrepo-com.svg";
import user from "/src/assets/user-svgrepo-com.svg";
export function Navigation() {
  return (
    <>
      <nav id="Main_Navigation">
        <div className="logo_loc">
          <img src={logo} alt="Ekornes Logo" />
        </div>
        <div className="direct_buttons">
          <button className="single_button" id="Admin_Power">
            Create New Item
          </button>
          <button className="single_button">Give to production</button>
          <button className="single_button">Receive items</button>
          <button className="single_button">Find Item</button>
          <button className="single_button" id="Admin_Power">
            Download Data
          </button>
        </div>
        <div className="user_spot">
          <img src={user} alt="User SVG" />
          <img src={logOut} alt="User SVG" />
        </div>
      </nav>
    </>
  );
}
