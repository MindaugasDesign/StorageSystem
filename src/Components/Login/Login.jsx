import { useRef, useEffect, useState } from "react";
import "./Login.css";
import userPass from "/src/assets/key-square-2-svgrepo-com.svg";
import userLogo from "/src/assets/user-rounded-svgrepo-com.svg";
import users from "/src/assets/users.json";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [data, setData] = useState("");
  const isOnline = useRef(false);
  useEffect(() => {
    setData(users);
    console.log(users);
  }, []);

  const loggedUser = (e) => {
    e.preventDefault();
    setUserName("");
    setUserPassword("");
    const matchedUser = data.find(
      (user) => user.login === userName && user.password === userPassword
    );

    if (matchedUser) {
      console.log("Login successful:", matchedUser.name);
      isOnline.current = true;
      if (isOnline) {
        navigate("/main");
        const userPowers = matchedUser.level;
        localStorage.setItem("Power", userPowers);
        window.dispatchEvent(new Event("storage"));
      }
    } else {
      console.log("Invalid credentials");
    }
  };

  return (
    <>
      <div id="login_Container">
        <form id="userLogin">
          <div className="login_userName">
            <label htmlFor="userName">
              <img src={userLogo} alt="Username" />
            </label>
            <input
              type="text"
              name="userName"
              id="userName"
              placeholder="Username"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="login_password">
            <label htmlFor="password">
              <img src={userPass} alt="Password" />
            </label>
            <input
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={userPassword}
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </div>
          <div className="submit_button">
            <button type="submit" onClick={loggedUser}>
              Login
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
