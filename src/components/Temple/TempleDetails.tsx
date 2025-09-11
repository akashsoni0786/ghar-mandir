import useWindow from "@/customHooks/useWindows";
import BottomDrawer from "../Common/BottomDrawer";
import { useEffect, useState } from "react";
import Login from "../Login/Login";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import { urlFetchCalls } from "@/constants/url";
import MobileFooter from "../Common/MobileFooter";
import PrasadPackageSelection from "../PackageSelection/PujaPackageSelection";
import { removeExtraKeys } from "@/constants/commonfunctions";
import PujaHeroSection from "../PujaDetails/PujaHeroSection";
import AboutTemple from "../PujaDetails/AboutTemple";
import FAQs from "../PujaDetails/FAQs";
import TestimonialCard from "../PujaDetails/Experience";
import "./Temple.css";
import VideoSliderWithStaticData from "../Common/VideoSlider/VideoSliderWithStaticData";
import DetailPanditMwCard from "../Common/Cards/DetailedPanditMwCard";
import SpiritualGuidanceBanner from "../Common/Banner";
import MapData from "./MapData";
import ToggleTab from "../Common/ToggleTab/ToggleTab";
import "../../styles/PujaDetails.css";
import PujaCard from "../Common/PujaCard";
import useTrans from "@/customHooks/useTrans";
interface Props extends DIProps {
  data: any;
}
const {
  GET: { devoteeExperience },
} = urlFetchCalls;
const TempleDetails = (props: Props) => {
  const { data, redux, request } = props;
  const {
    details,
    image,
    aboutTemple,
    addOns,
    chadhawaPerformedBy,
    devineExperience,
    packages,
    poojaBenifits,
    poojaId,
    poojaVidhi,
    poojaEndDate,
    poojaName,
    topBenefits,
    status,
  } = data[0];
  const t = useTrans(redux?.common?.language);
  const { width } = useWindow();
  const [activePackage, setActivePackage] = useState<any>({});
  const [loginCheck, setLoginCheck] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [testimonial, setTestimonial] = useState([]);
  const pujaObj = {
    image:
      "https://d28wmhrn813hkk.cloudfront.net/uploads/1746870541018-t390v7.jpeg",
    heading:
      "Mahadev Raksha Kavach – 11,000 Mahamrityunjaya Jaap & Sanjeevani Yagya",
    poojaTemple: "Mahakaleshwar Jyotirlinga, Ujjain",
    poojaDay: "16th June, Monday",
    description:
      "On Somvati Amavasya, Monday, 16th June, a powerful 11,000-times Jaap of the Mahamrityunjaya Mantra and a Sanjeevani Mahayagya will be performed in your name and gotra at the sacred premises of Mahakaleshwar Jyotirlinga, Ujjain. 🕉️ The Mahamrityunjaya Mantra is one of the most potent Vedic mantras — traditionally chanted for protection from untimely death, serious illness, and long-standing suffering.\n🔱 The ritual will include: Mantra jaap and a havan (yagya) invoking Lord Mahadev’s Sanjeevani Shakti\nThis is a shield of prayer — to invoke strength, healing, and divine protection. 🔔 Book Now – Is Somwar Mahakaal Ko Smaran Kijiye\n🙏 Jai Mahakaal",
    prasad: null,
    offerings: [
      {
        offeringId: "offering001",
        image:
          "https://gharmandirassets.s3.ap-south-1.amazonaws.com/uploads/1746791376218-q8c67c.png",
        title: "Milk",
        description:
          "Offering milk is a symbol of purity, devotion, and spiritual nourishment in worship.",
        price: 100,
      },
      {
        offeringId: "offering002",
        image:
          "https://gharmandirassets.s3.ap-south-1.amazonaws.com/uploads/1746729107955-dii3k.png",
        title: "Milk + Bel Patra + Ganga Jal + Panchmitra",
        description:
          "Offering milk, Bel Patra, Ganga Jal, and Panchamrit symbolizes purity, devotion, cleansing, and divine nourishment",
        price: 250,
      },
    ],
    categoryImage:
      "https://d28wmhrn813hkk.cloudfront.net/uploads/1748260928362-65vwwl.webp",
    tag: ["Jyotirling"],
    poojaId: "fe3f60eb-a59e-4a50-8af6-804faaac88b4",
    poojaName: "Mahamrityunjaya_puja",
    poojaEndDate: {
      year: 2025,
      month: 6,
      day: 16,
      hour: 14,
      min: 30,
    },
  };
  useEffect(() => {
    if (request) {
      request.GET(devoteeExperience).then((res: any) => {
        if (res?.reviews) {
          setTestimonial(res?.reviews ?? []);
        }
      });
    }
  }, []);

  useEffect(() => {
    const min_price = Math.min(...packages.map((i: any) => i.price));
    setMinPrice(min_price);
  }, [packages]);

  useEffect(() => {
    const prev_data = redux?.checkout?.selected_data?.puja[poojaId];
    setActivePackage(prev_data?.package ?? {});
  }, [redux?.checkout]);

  const [isActive, setIsActive] = useState("Puja");
  const tabs = ["Puja", "Chadhava"];
  return (
    <div>
      {/* <div className="container">
        <PujaHeroSection
          details={details}
          image={image}
          topBenefits={topBenefits}
          type={"Puja"}
        />
      </div> */}
      <div className="container">
        <h4 className="heading ph-16">Upcoming Events</h4>
        <div className="ph-16">
          <ToggleTab
            tabs={tabs}
            isActive={isActive}
            setIsActive={setIsActive}
          />
        </div>
        <div className="event-list">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((obj: any, idx: number) => {
            return <PujaCard key={idx} data={pujaObj} index={idx} path={""} />;
          })}
        </div>
      </div>

      <div className="container">
        <div className="container-box ph-1">
          <h3 className="container-box-heading">About Temple</h3>
          <AboutTemple aboutTemple={aboutTemple} />
        </div>
        <div className="container-box ph-1">
          <h3 className="container-box-heading">How to reach</h3>
          <MapData />
        </div>

        {true && (
          <div className="container-box ph-1">
            <h3 className="container-box-heading">Puja performed by</h3>
            <div className="temple-pandit--boxes">
              <DetailPanditMwCard
                imageSrc={
                  "https://i.fbcd.co/products/original/c-1000-designbundle-indian-pandit-19-09-c8a9cc9a82dbdb20aefac3ca28cbeb82a05609a36cbcbb3789590c2f058581cd.jpg"
                }
                title={"Pandit Omkar Tiwari"}
                subtitle={"Tirupati Balaji Temple"}
                description={`"With a vast knowledge of Vishnu Sahasranamam and Balaji Seva, Pandit Omkar Ji ensures every ritual is done with utmost sincerity."`}
              />
              <DetailPanditMwCard
                imageSrc={
                  "https://i.fbcd.co/products/original/c-1000-designbundle-indian-pandit-19-09-c8a9cc9a82dbdb20aefac3ca28cbeb82a05609a36cbcbb3789590c2f058581cd.jpg"
                }
                title={"Pandit Omkar Tiwari"}
                subtitle={"Tirupati Balaji Temple"}
                description={`"With a vast knowledge of Vishnu Sahasranamam and Balaji Seva, Pandit Omkar Ji ensures every ritual is done with utmost sincerity."`}
              />
              <DetailPanditMwCard
                imageSrc={
                  "https://i.fbcd.co/products/original/c-1000-designbundle-indian-pandit-19-09-c8a9cc9a82dbdb20aefac3ca28cbeb82a05609a36cbcbb3789590c2f058581cd.jpg"
                }
                title={"Pandit Omkar Tiwari"}
                subtitle={"Tirupati Balaji Temple"}
                description={`"With a vast knowledge of Vishnu Sahasranamam and Balaji Seva, Pandit Omkar Ji ensures every ritual is done with utmost sincerity."`}
              />
              <DetailPanditMwCard
                imageSrc={
                  "https://i.fbcd.co/products/original/c-1000-designbundle-indian-pandit-19-09-c8a9cc9a82dbdb20aefac3ca28cbeb82a05609a36cbcbb3789590c2f058581cd.jpg"
                }
                title={"Pandit Omkar Tiwari"}
                subtitle={"Tirupati Balaji Temple"}
                description={`"With a vast knowledge of Vishnu Sahasranamam and Balaji Seva, Pandit Omkar Ji ensures every ritual is done with utmost sincerity."`}
              />
            </div>
          </div>
        )}
        <div className="container-box">
          <h3 className="container-box-heading ph-1">Divine Experiences</h3>
          <div className="ph-des-16 vt--16">
            <VideoSliderWithStaticData devineExperience={devineExperience} />
          </div>
        </div>
        <div className="container-box ph-1">
          <h3 className="container-box-heading">
            Frequently asked questions (FAQs)
          </h3>
          <FAQs />
        </div>

        <div className="container-box">
          <h3 className="container-box-heading ph-1">
            {t("DIVINE_EXPERIENCE")}
          </h3>
          <div className="recommended-puja-rows ph-mob-1">
            {testimonial.map((item: any, idx) => (
              <TestimonialCard key={`${item?.title}-${idx}`} data={item} />
            ))}
          </div>
        </div>

        <div className="ph-1">
          {" "}
          <SpiritualGuidanceBanner />{" "}
        </div>
      </div>
    </div>
  );
};

export default DI(TempleDetails);
