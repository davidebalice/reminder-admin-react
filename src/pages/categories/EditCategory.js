import { useState, useEffect, useContext } from "react";
import { Context } from "../../context/UserContext";
import axios from "axios";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/breadcrumb/index";
import { Link, useParams, useNavigate } from "react-router-dom";
import Divider from "../../components/divider/index";
import NotPermission from "../Auth/notPermission";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFloppyDisk,
  faCircleChevronLeft,
} from "@fortawesome/free-solid-svg-icons";

const EditCategory = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const title = "Edit user";
  const brad = [
    {
      name: "home",
    },
    {
      name: title,
    },
  ];
  const { id } = useParams();
  const { userData, demo } = useContext(Context);
  const [responseData, setResponseData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
  });

  const handleInput = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/category/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        console.log("response.data.category");
        console.log(response.data.category);
        console.log(response.data.category[0].name);
        //console.log(response.data.category.data);

        setFormData(response.data.category[0]);
      })
      .catch((error) => {
        console.error("Error:", error);
        Swal.fire("Error", error, "error");
      });
  }, []);

  const submitForm = (e) => {
    e.preventDefault();
    if (demo) {
      Swal.fire({
        title: "Demo mode",
        text: "Crud operations are not allowed",
        icon: "error",
        cancelButtonText: "Close",
      });
    } else {
      axios
        .post(
          `${process.env.REACT_APP_API_BASE_URL}/api/update/category/${id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
        )
        .then((response) => {
          console.log("response.data");
          console.log(response.data);
          setResponseData(response.data.message);

          Swal.fire({
            title: "Category updated",
            text: "",
            icon: "success",
            showCancelButton: true,
            confirmButtonText: "Back to categories",
            cancelButtonText: "Close",
          }).then((result) => {
            if (result.isConfirmed) {
              if (response.data.status === "success") {
                navigate(`/categories`);
              }
            }
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <>
      {userData && userData.role === "admin" ? (
        <>
          <div className="page">
            <div class="row">
              <Link to={`/categories`}>
                <div class="backButton bg-primary col-sm-4 col-md-4 col-lg-3">
                  <FontAwesomeIcon
                    icon={faCircleChevronLeft}
                    className="backButtonIcon"
                  />
                  <div class="card-body d-flex px-1">Back</div>
                </div>
              </Link>
            </div>
            <Breadcrumb title={title} brad={brad} />
            {responseData}
            <div className="card">
              <div className="card-body">
                <form className="row justify-content-start formContainer">
                  <div className="col-md-6 mt-3">
                    <label for="name">
                      <b>Category</b>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInput}
                    />
                  </div>
                  <div className="col-md-6 mt-3"></div>

                  <div className="col-md-6 mt-3">
                    <button
                      onClick={submitForm}
                      className="btn btn-sm saveButton mt-3"
                    >
                      <FontAwesomeIcon
                        icon={faFloppyDisk}
                        className="saveButtonIcon"
                      />{" "}
                      Save
                    </button>
                  </div>
                </form>

                <Divider
                  marginTop={60}
                  marginBottom={60}
                  borderSize={1}
                  borderType={"solid"}
                  borderColor={"#ddd"}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <NotPermission />
        </>
      )}
    </>
  );
};

export default EditCategory;
