import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserServiceContext } from "../providers/userService.provider";
import { ApiContext } from "../providers/api.provider";

export default function HomePage() {
  const navigate = useNavigate();
  const { user, onSignout } = useContext(UserServiceContext)!;
  const api = useContext(ApiContext)!;
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

  const handleSignout = () => {
    onSignout();
    navigate("/signin");
  }

  return (
    <div style={{ maxWidth: 600, margin: "50px auto" }}>
      <h2>Hello {user?.name}</h2>
      <h2>Welcome to the application</h2>
      {profile && (
        <>
          <h4>Private Information:</h4>
          <p>
            {profile}
          </p>
        </>
      )}

      <button onClick={() => { GetPrivateInfo(); }}>
        invoke api
      </button>
      <button onClick={() => { handleSignout(); }}>
        Logout
      </button>
    </div>
  );
}
