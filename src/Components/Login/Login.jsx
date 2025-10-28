import { useRef, useEffect, useState, use } from "react";
import "./Login.css";
import userPass from "/src/assets/key-square-2-svgrepo-com.svg";
import userLogo from "/src/assets/user-rounded-svgrepo-com.svg";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [data, setData] = useState("");
  const isOnline = useRef(false);
  const [emptyUser, setEmptyUser] = useState(false);
  const [emptyPassword, setEmptyPassword] = useState(false);
  const [wrongUser, setWrongUser] = useState(false);

  useEffect(() => {
    fetch("http://localhost:7750/systemusers")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
      });
  }, []);

  const loggedUser = (e) => {
    e.preventDefault();

    if (!userName) {
      setEmptyUser(!userName);

      setTimeout(() => {
        setEmptyUser(userName);
      }, 2000);
    } else if (!userPassword) {
      setEmptyPassword(!userPassword);

      setTimeout(() => {
        setEmptyPassword(userPassword);
      }, 2000);
    } else {
      const matchedUser = data.find(
        (user) => user.login === userName && user.password === userPassword
      );

      if (matchedUser) {
        isOnline.current = true;
        if (isOnline) {
          navigate("/main");
          const userPowers = matchedUser.level;
          localStorage.setItem("Power", userPowers);
          localStorage.setItem("LoggedUser", matchedUser.name);
          setTimeout(() => {
            localStorage.removeItem("Power");
            localStorage.removeItem("LoggedUser");
            navigate("/");
            window.dispatchEvent(new Event("storage"));
          }, 60 * 60 * 1000);
          window.dispatchEvent(new Event("storage"));
        }
      } else {
        setWrongUser(!matchedUser);

        setTimeout(() => {
          setWrongUser(matchedUser);
        }, 2000);
        console.log("Invalid credentials");
      }
      setUserName("");
      setUserPassword("");
    }
  };

  return (
    <>
      <div className="loginWrapper">
        <div className="errorSpot">
          {wrongUser && <p id="loginErrorWU">Invalid user information</p>}
        </div>
        <div id="login_Container">
          <form id="userLogin">
            <div className="section1">
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
              {emptyUser && <p id="loginErrorName">Please enter user name!</p>}
            </div>
            <div className="section2">
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
              {emptyPassword && (
                <p id="loginErrorPass">Please enter user name!</p>
              )}
            </div>
            <div className="submit_button">
              <button type="submit" onClick={loggedUser}>
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
