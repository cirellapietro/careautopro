import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import BottomNav from "../components/BottomNav";

export default function AppLayout() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) navigate("/login");
      setLoading(false);
    });
  }, []);

  if (loading) return null;

  return (
    <>
      <Outlet />
      <BottomNav />
    </>
  );
}
