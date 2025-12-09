import { useContext, useEffect, useState } from "react";
import "./home.scss";
import { UserServiceContext } from "../../context/userService.provider";
import { api } from "../../api/api";
import { Button } from "@mui/material";

export default function HomePage() {
  const { user } = useContext(UserServiceContext)!;

  const [profile, setProfile] = useState<string | null>(null);

  const GetPrivateInfo = async () => {
    try {
      const res: string | null = await api.Get("/private-info");
      setProfile(res);
    } catch (err) {
      console.error("Failed to fetch private info", err);
    }
  };

  useEffect(() => {
    GetPrivateInfo();
  }, []);

  return (
    <div className="page">
      <div className="title">

        <h2>Hello {user?.name}</h2>
        <h2>Welcome to the application</h2>
      </div>
      {profile && (
        <div className="info">
          <h4>Private Information:</h4>
          <p>
            {profile}
          </p>
        </div >
      )}

      <div>
        <Button variant="contained" sx={{ backgroundColor: "var(--color-secondary)" }} onClick={GetPrivateInfo}>
          invoke api
        </Button>
      </div>
    </div>
  );
}
