import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function OAuth2RedirectHandler() {
  const [searchParams] = useSearchParams();
  const navigate       = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("token", token);
      navigate("/dashboard");
    } else {
      // something went wrong
      navigate("/login");
    }
  }, [searchParams, navigate]);

  return null; // nothing to render
}
