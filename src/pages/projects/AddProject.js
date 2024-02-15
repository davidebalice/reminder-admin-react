import { useState, useEffect, useContext } from "react";
import { Context } from "../../context/UserContext";
import axios from "axios";
import Swal from "sweetalert2";
import Breadcrumb from "../../components/breadcrumb/index";
import Spacer from "../../components/spacer";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleChevronLeft,
  faCirclePlus,
} from "@fortawesome/free-solid-svg-icons";

const AddProject = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const { userData, demo } = useContext(Context);
  const title = "Add project";
  const brad = [
    {
      name: "home",
    },
    {
      name: title,
    },
  ];
  const [responseData, setResponseData] = useState(null);
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    budget: "",
    client: "",
    summary: "",
    description: "",
    owner: "",
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
      .get(process.env.REACT_APP_API_BASE_URL + "/api/add/project", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      })
      .then((response) => {
        setData(response.data);
        const owner = response.data.owner;
        setFormData({
          ...formData,
          owner: owner,
        });
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
          process.env.REACT_APP_API_BASE_URL + "/api/add/project",
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
          const owner = data.owner;
          setFormData({
            ...formData,
            owner: owner,
          });

          if (response.data.create === "success") {
            navigate("/projects");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  return (
    <>
      <div className="page">
        <div class="row">
          <Link to={`/projects`}>
            <div class="backButton col-sm-4 col-md-4 col-lg-3">
              <FontAwesomeIcon
                icon={faCircleChevronLeft}
                className="backButtonIcon"
              />
              <div class="card-body d-flex px-1">Back</div>
            </div>
          </Link>
        </div>
        <Breadcrumb title={title} brad={brad} />
        <div className="card pageContainerFull">
          <div className="card-body">
            <div className="row justify-content-center formContainer">
              <div className="col-md-6 mt-3">
                <label for="name">
                  <b>Project name</b>
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
              <div className="col-md-6 mt-3">
                <label for="budget">
                  <b>Budget</b>
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="budget"
                  value={formData.budget}
                  onChange={handleInput}
                />
              </div>
              <div className="col-md-6 mt-3">
                <label for="client">
                  <b>Client</b>
                </label>
                <select
                  className="form-control"
                  name="client"
                  value={formData.client}
                  required
                  onChange={handleInput}
                >
                  {data.clients ? (
                    data.clients.map((client) => (
                      <option key={client._id} value={client._id}>
                        {client.companyName}
                      </option>
                    ))
                  ) : (
                    <option value="">Loading clients...</option>
                  )}
                  <option value=""> - Select client - </option>
                </select>
              </div>
              <div className="col-md-6 mt-3"></div>

              <Spacer height={40} />

              <div className="col-md-12">
                <label for="summary">
                  <b>Summary</b>
                </label>
                <textarea
                  className="form-control"
                  name="summary"
                  value={formData.summary}
                  onChange={handleInput}
                ></textarea>
              </div>

              <Spacer height={40} />

              <div className="col-md-12">
                <label for="description">
                  <b>Full description</b>
                </label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInput}
                  style={{ height: "150px" }}
                ></textarea>
              </div>
            </div>
            <button
              onClick={submitForm}
              className="btn btn-primary btn-sm addButtonSm mt-5"
            >
              <FontAwesomeIcon icon={faCirclePlus} className="addButtonIcon" />
              Add project
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProject;
