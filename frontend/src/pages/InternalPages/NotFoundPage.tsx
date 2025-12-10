import { Link } from "react-router-dom";
import "./home.scss";
import { Button } from "@mui/material";

export default function NotFoundPage() {

  return (
    <div className="page">
      <div className="title">

        <h2>404. This page is not found</h2>
      </div>
      <div className="info">
        <h4>Go to Home page</h4>
      </div >

      <div>
        <Button variant="contained" component={Link} sx={{ backgroundColor: "var(--color-secondary)" }} to="/" >
          Home
        </Button>
      </div>
    </div>
  );
}
