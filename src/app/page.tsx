"use client";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { visitedUserDataLayerCheck } from "@/constants/commonfunctions";
import { PageWrapper } from "./Routes";
import { getSessionStorage } from "@/services/storage";
import { pushToDataLayer } from "@/lib/gtm";
import HomeSkeleton from "@/skeletons/home/HomeSkeleton";

export default function Page() {
  const HomePage = dynamic(
    () => import("../components/Home/Home"),
    {
      loading: () => <HomeSkeleton />,
      ssr: false,
    }
  );

  useEffect(() => {

    const userData = visitedUserDataLayerCheck();
    const userId = userData?.authToken || null;
    const user_type = userId ? "user" : "guest";
    
    const localKey = userData?.authToken ? `visited_${userData.authToken}` : `visited_guest`;
    const sessionKey = userId ? `fired_revisit_${userId}` : `fired_revisit_guest`;
    const visitedBefore = localStorage.getItem(localKey);
    const alreadyFiredThisSession = getSessionStorage(sessionKey);

    if (!alreadyFiredThisSession) {
      if (visitedBefore) {
        pushToDataLayer("User_Revisited_Web", {
          user_type,
          user_id: userId,
          mobile: userData?.mobileNo || userData?.mobile || null,
        });
      } else {
        localStorage.setItem(localKey, "true");
        pushToDataLayer("User_Visited_FirstTime_Web", {
          user_type,
          user_id: userId,
          mobile: userData?.mobileNo || userData?.mobile || null,
        });
      }
      sessionStorage.setItem(sessionKey, "true");
    }
  }, []);

  return (
    <PageWrapper>
      <HomePage />
    </PageWrapper>
  );
}
