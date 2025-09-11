"use client";
import FullPageLoader from "@/components/Common/Loadings/FullPageLoader";
import dynamic from "next/dynamic";
import { PageWrapper } from "../Routes";
import PublicRoute from "@/Routes/PublicRoute";
const BookingsComponent = dynamic(
  () => import("../../components/Bookings/Bookings"),
  {
    loading: () => <FullPageLoader />,
    ssr: false,
  }
);
const Booking = () => {
  return (
    <PublicRoute>
      <PageWrapper>
        <BookingsComponent />
      </PageWrapper>
    </PublicRoute>
  );
};
export default Booking;
