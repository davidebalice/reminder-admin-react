import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/login");
  }, [navigate]);

  return null;
};

export default NotAuth;
