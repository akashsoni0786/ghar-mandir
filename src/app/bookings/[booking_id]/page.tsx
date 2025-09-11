"use client";
import { PageWrapper } from "@/app/Routes";
import FullPageLoader from "@/components/Common/Loadings/FullPageLoader";
import PublicRoute from "@/Routes/PublicRoute";
import dynamic from "next/dynamic";
const BookingViewComponent = dynamic(
  () => import("../../../components/Bookings/ViewBooking"),
  {
    loading: () => <FullPageLoader />,
    ssr: false,
  }
);
const Booking = () => {
  return (
    <PublicRoute>
      <PageWrapper>
        <BookingViewComponent />
      </PageWrapper>
    </PublicRoute>
  );
};
export default Booking;
