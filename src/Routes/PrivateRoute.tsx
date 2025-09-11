// components/PrivateRoute.js
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function PrivateRoute({ children }) {
  const { authToken } = useSelector((state: any) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (authToken && authToken != "") {
    } else router.push("/");
  }, [authToken, router]);

  return children;
}
