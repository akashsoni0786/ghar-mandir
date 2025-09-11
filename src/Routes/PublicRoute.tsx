import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function PublicRoute({ children }) {
  const { authToken } = useSelector((state: any) => state.auth);
  const router = useRouter();
  // const [loginCheck, setLoginCheck] = useState(false);
  useEffect(() => {
    if (authToken && authToken != "") {
    } else {
      // setLoginCheck(true);
      router.push("/");
    }
  }, [authToken, router]);
  // if (loginCheck)
  //   return <Login setLoginCheck={setLoginCheck} showPopup={loginCheck} />;

  return children;
}
