import axios from "axios";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../../assets/img/logo.png";
import logoReact from "../../assets/img/react.jpg";
import { Context } from "../../context/UserContext";

const Login = () => {
  const { login } = useContext(Context);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loginHandle = () => {
    axios
      .post(process.env.REACT_APP_API_BASE_URL + "/api/login", {
        email: formData.email,
        password: formData.password,
      })
      .then((response) => {

        if (response.data.status === "success") {
          Swal.fire("Login success", "", "success");

          const token = response.data.token;
          localStorage.setItem("authToken", token);

          login(response.data.user);

          navigate("/");
        } else {
          Swal.fire("Login failed", response.data.message, "error");
          localStorage.removeItem("authToken");
        }
      })
      .catch((error) => {
        console.error("Error login:", error);
        Swal.fire("Login failed", "Data incorrect", "error");
        localStorage.removeItem("authToken");
      });
  };

  const handleInput = (event) => {
    const { name, value } = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };


  return (
    <>
      <div className="loginContainer">
        <div
          className="row justify-content-center align-items-center jumbotron"
          style={{ height: "65vh" }}
        >
          <div className="col-md-5 loginCard">
            <div className="card">
              <div className="loginLogoContainer">
                <img src={logo} alt="db logo" />
                <img src={logoReact} alt="react logo" />
              </div>
              <div className="card-header border-bottom text-center">
                <h3>Reminder App</h3>
              </div>
              <div className="card-body">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleInput}
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  className="form-control my-3"
                  value={formData.password}
                  onChange={handleInput}
                />
                <button
                  type="sumit"
                  onClick={loginHandle}
                  className="btn btn-primary mt-2 w-100"
                >
                  Login
                </button>
                {/*
                 <Link to="/forgot-password">
                  <p>Forgot Password</p>
                </Link>
                */}

                <div className="loginDemoData">
                  <b>Demo data:</b>
                  <br />
                  mario@rossi.it
                  <br />
                  12345678
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
