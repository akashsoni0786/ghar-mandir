import dynamic from "next/dynamic";
import FullPageLoader from "@/components/Common/Loadings/FullPageLoader";

const PujaPageContent = dynamic(
  () => import("../components/PujaDetails/PujaPage"),
  {
    loading: () => <FullPageLoader />,
    ssr: false,
  }
);

function PujaPage() {
  return <PujaPageContent />;
}

export default PujaPage;
