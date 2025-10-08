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
import ScrollAnimate from "@/components/Common/Animation/ScrollAnimate";

const Home = () => {
  return (
    <div>
      <div style={{ margin: "20px 0 20px 0" }}>
        <ScrollAnimate direction="up">
          <HomeBanners />
        </ScrollAnimate>
      </div>

      <div className="container">
        <ScrollAnimate direction="up">
          <WhyBookUs />
        </ScrollAnimate>
        <div className="horizontal-line-gray" />
        {/* <Blessings /><MostExploredPujas /> */}
        <ScrollAnimate direction="up">
          <PujaEvents />
        </ScrollAnimate>

        <ScrollAnimate direction="up">
          <ChadhavaEvents />
        </ScrollAnimate>

        <ScrollAnimate direction="up">
          <PujaPerform />
        </ScrollAnimate>

        <div className="horizontal-line-gray" />
      </div>

      <div className="container">
        <ScrollAnimate direction="up">
          <FAQBox />
        </ScrollAnimate>

        <ScrollAnimate direction="up">
          <DeevoteeExp />
        </ScrollAnimate>
        <div className="horizontal-line-gray" />
      </div>

      <ScrollAnimate direction="up">
        <Community />
      </ScrollAnimate>

      <div className="container">
        <div className="ph-16">
          <ScrollAnimate direction="up">
            <SpiritualGuidanceBanner />
          </ScrollAnimate>
        </div>
      </div>
    </div>
  );
};

export default Home;
