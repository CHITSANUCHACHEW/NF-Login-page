import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";

function Login() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };
      const checkAuthen = async () => {
        const tokenData = await axios.post(
          "http://localhost:3000/authen",
          {},
          config
        );
        if (tokenData.status === 200) {
          window.location = "/page";
        } else {
          window.location = "/";
        }
      };
      checkAuthen();
    }
  }, []);

  const [focusep, setFocusEP] = useState(false);
  const handleFocusEP = () => {
    setFocusEP(true);
  };

  const [focuspass, setFocusP] = useState(false);
  const handleFocusPassword = () => {
    setFocusP(true);
  };

  const [formData, setData] = useState({
    EmailorPhone: "",
    password: "",
  });

  const handleChange = (event) => {
    setData({ ...formData, [event.target.name]: event.target.value });
  };

  const submitForm = async (event) => {
    event.preventDefault();
    let userData = {
      Email: "",
      Phone: "",
      Password: "",
    };
    if (formData.EmailorPhone.match(/^([0-9]{10})$/)) {
      userData = {
        Email: "",
        Phone: formData.EmailorPhone,
        Password: formData.password,
      };
    } else {
      userData = {
        Email: formData.EmailorPhone,
        Phone: "",
        Password: formData.password,
      };
    }

    try {
      const login = await axios.post("http://localhost:3000/login", {
        userData,
      });
      if (login.status === 200) {
        localStorage.setItem("token", login.data.token);
        window.location = "/page";
      }
    } catch (err) {
      console.log(err);
      alert("Login failed");
    }
  };

  return (
    <>
      <div className="bgc-login">
        <div className="container-login">
          <div className="Text-Sign">
            <h1>Sign In</h1>
          </div>
          <form onSubmit={submitForm} method="" action="">
            <div className="box-input">
              <input
                type="text"
                id="inputEmailorPhone"
                placeholder="Email or Phone number"
                name="EmailorPhone"
                aria-describedby="messageError"
                required
                pattern="^([0-9]{10})|([A-Za-z0-9._%\+\-]+@[a-z0-9.\-]+\.[a-z]{2,3})$"
                onChange={handleChange}
                onBlur={handleFocusEP}
                focusep={focusep.toString()}
              />
              <span className="messageError">
                Please enter a valid email or phone number.
              </span>
            </div>
            <div className="box-input">
              <input
                type="password"
                id="inputPassword"
                placeholder="Password"
                name="password"
                required
                pattern="^.{4,60}$"
                onChange={handleChange}
                onBlur={handleFocusPassword}
                focuspass={focuspass.toString()}
              />
              <span>
                Your password must contain between 4 and 60 characters.
              </span>
            </div>
            <button type="submit" className="btn-sign">
              Sing In
            </button>
          </form>
          <div className="container-footer">
            <div className="container-rmb-nh">
              <div className="select-rmb">
                <input type="checkbox" name="" id="Remember" />
                <label htmlFor="Remember"> Remember me</label>
              </div>
              <div>
                <a href="" className="btn-nh">
                  Need help?
                </a>
              </div>
            </div>
            <div className="box-sign-up">
              <p>
                New to Netflix?
                <a href=""> Sign up now.</a>
              </p>
            </div>
            <div className="box-pt">
              <p>
                This page is protected by Google reCAPTCHA to ensure you're not
                a bot. <button>Learn more.</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
