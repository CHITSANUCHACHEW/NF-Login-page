import React, { useEffect, useState } from "react";
import axios from "axios";
import "./userPage.css";

function UserPage() {
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
          const getData = async () => {
            const userData = await axios.get("http://localhost:3000/page");
            setData(userData.data.response);
          };
          getData();
        } else {
          window.location = "/";
        }
      };
      checkAuthen();
    } else {
      window.location = "/";
    }
  }, []);

  const [userData, setData] = useState({});
  const { Email, Phone } = userData;

  const handlesubmit = (event) => {
    event.preventDefault();
    localStorage.removeItem("token");
    window.location = "/";
  };

  return (
    <>
      <div className="bgc-login">
        <div className="container-show">
          <div>
            <h1>Email : {Email}</h1>
          </div>
          <div>
            <h1>Phone : {Phone}</h1>
          </div>
          <button className="btn-out" onClick={handlesubmit}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
}

export default UserPage;
