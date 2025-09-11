import "./Home.css";
import SpiritualGuidanceBanner from "../Common/Banner";
import HomeBanners from "./HomeBanners";
import PujaEvents from "./PujaEvents";
import ChadhavaEvents from "./ChadhavaEvents";
import WhyBookUs from "./WhyBookUs";
import PujaPerform from "./PujaPerform";
import FAQBox from "./FAQBox";
import DeevoteeExp from "./DeevoteeExp";
import Community from "./Community";

const Home = () => {
  return (
    <div>
      <div style={{ margin: "20px 0 20px 0" }}>
        <HomeBanners />
      </div>
      <div className="container ">
        <WhyBookUs />
        <div className="horizontal-line-gray" />
        {/* <Blessings />
        <div className="horizontal-line-gray" /> */}
        {/* <MostExploredPujas />
        <div className="horizontal-line-gray" /> */}
        <PujaEvents />
        <ChadhavaEvents />
        <PujaPerform />
        <div className="horizontal-line-gray" />
      </div>
      {/* <Advisors /> */}
      <div className="container ">
        {/* <div className="horizontal-line-gray" /> */}
        <FAQBox />
        {/* <div className="horizontal-line-gray" /> */}
        <DeevoteeExp />
        <div className="horizontal-line-gray" />
      </div>
      <Community />
      <div className="container ">
        <div className="ph-16">
          <SpiritualGuidanceBanner />
        </div>
      </div>
    </div>
  );
};
export default Home;
