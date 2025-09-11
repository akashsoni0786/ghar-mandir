import Accordion from "./BenefitsContent";
import Stepper from "./Stepper";
import AboutTemple from "./AboutTemple";
import DivineExperience from "../Common/VideoSlider/DivineExperience";
import FAQs from "./FAQs";
import PackageBox from "../Common/PackageBox";
import PackageBoxUn from "../Common/PackageBoxUn";
import MantraSection from "./MantraSection";
import PujaHeroSection from "./PujaHeroSection";
import BottomDrawer from "../Common/BottomDrawer";
import { useEffect, useState } from "react";
import {
  boxes,
  packageList,
  static_review,
} from "@/commonvaribles/constant_variable";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import { urlFetchCalls } from "@/constants/url";
import MobileFooter from "../Common/MobileFooter";
import PrasadPackageSelection from "../PackageSelection/PujaPackageSelection";
import {
  getCurrencyName,
  getSign,
  removeExtraKeys,
  transformToAddToCartEventPuja,
} from "@/constants/commonfunctions";
import SpiritualGuidanceBanner from "../Common/Banner";
import { usePoojaContext } from "./PoojaDetailsContext";
import { button_event, save_event } from "@/constants/eventlogfunctions";
import "../../styles/Listing.css";
import TestimonialImage from "./TestimonialImage";
import useTrans from "@/customHooks/useTrans";
import { pushToDataLayerWithoutEvent } from "@/lib/gtm";
import AccordionComponent from "../Common/Accordian/AccordianComponent";
import PrasadIncluded from "../Common/MostPopular/PrasadIncluded";

interface Props extends DIProps {
  data: any;
}
const {
  GET: { devoteeExperience },
} = urlFetchCalls;
const PujaDetails = (props: Props) => {
  const { data, request, redux, toast } = props;
  const t = useTrans(redux?.common?.language);
  const pujaContext = usePoojaContext();
  const {
    details,
    image,
    aboutTemple,
    addOns,
    devineExperience,
    packages,
    poojaBenifits,
    poojaId,
    poojaVidhi,
    poojaEndDate,
    poojaName,
    topBenefits,
    status,
    reviewData,
    prasadIncluded,
    pitruNameIncluded,
  } = data[0];
  const currency_name = getCurrencyName();

  const currency = getSign();
  const [activePackage, setActivePackage] = useState<any>({});
  const [loginCheck, setLoginCheck] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [testimonial, setTestimonial] = useState([]);

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
    if (!pujaContext.activePackage) {
      // setActivePackage({
      //   img_class: "package-box--img-1",
      //   index: 0,
      //   active: false,
      //   ...packages[0],
      //   name: packages[0].title,
      // });
    } else setActivePackage(pujaContext.activePackage ?? {});
  }, [pujaContext.activePackage]);
  return (
    <div>
      {Object.keys(activePackage)?.length > 0 &&
        !loginCheck &&
        isDrawerOpen && (
          <BottomDrawer
            setIsDrawerOpen={setIsDrawerOpen}
            isDrawerOpen={isDrawerOpen}
            component={
              <PrasadPackageSelection
                image={image[0]}
                data={addOns}
                poojaId={poojaId}
                details={details}
                activePackage={{
                  ...removeExtraKeys(activePackage, details, image),
                  member_package_list: packages,
                }}
                showForLogin={() => {
                  setLoginCheck(true);
                }}
                poojaName={poojaName}
                packages={packages}
                afterlogin={false}
                prasadIncluded={prasadIncluded}
                pitruNameIncluded={pitruNameIncluded}
              />
            }
          />
        )}
      <div className="container">
        <PujaHeroSection
          details={details}
          image={image}
          topBenefits={topBenefits}
          type={"Puja"}
          reviewData={reviewData}
        />
        <div className="container-box ph-1" id="package-data">
          <div style={{ display: "flex", gap: "8px", alignItems: "start" }}>
            <h3 className="container-box-heading">
              {t("SELECT_PACKAGE")} {"    "}
            </h3>
            {prasadIncluded && currency_name == "INR" && (
              <div style={{ marginTop: "2px" }}>
                <PrasadIncluded text={"Prasad Included"} />
              </div>
            )}
          </div>

          <div className="package">
            {packageList.map((item, index) => {
              const name_data = packages[index]?.title?.split(" ");
              let idx = name_data?.length - 1;
              const subtitle = name_data[idx] ?? "";
              name_data.splice(idx, 1);
              const title = name_data.join(" ");
              if (
                activePackage?.index == index ||
                packages[index]?.title?.includes(activePackage?.name)
              )
                return (
                  <PackageBox
                    cutPrice={packages[index]?.cutPrice ?? ""}
                    chadhava={false}
                    isActive={status == "ACTIVE"}
                    key={index}
                    index={index}
                    name={title ?? item.name}
                    sub_name={subtitle ?? item.sub_name}
                    image={
                      pitruNameIncluded
                        ? item.image_p
                        : packages[index]?.image ?? item.image
                    }
                    price={packages[index]?.price ?? ""}
                    img_class={item.img_class}
                    onClick={(e) => {
                      if (status == "ACTIVE") {
                        pujaContext.setActivePackage(e);
                        setActivePackage(e);
                      }
                    }}
                    active={item.active}
                    pitruNameIncluded={pitruNameIncluded}
                    name_p={item.name_p}
                    sub_name_p={item.sub_name_p}
                    img_class_p={item.img_class_p}
                  />
                );
              else
                return (
                  <PackageBoxUn
                    cutPrice={packages[index]?.cutPrice ?? ""}
                    chadhava={false}
                    isActive={status == "ACTIVE"}
                    key={index}
                    index={index}
                    name={title ?? item.name}
                    sub_name={subtitle ?? item.sub_name}
                    image={
                      pitruNameIncluded
                        ? item.image_p
                        : packages[index]?.image ?? item.image
                    }
                    price={packages[index]?.price ?? ""}
                    img_class={item.img_class}
                    onClick={(e) => {
                      if (status == "ACTIVE") {
                        setActivePackage(e);
                        pujaContext.setActivePackage(e);
                      }
                    }}
                    active={item.active}
                    pitruNameIncluded={pitruNameIncluded}
                    name_p={item.name_p}
                    sub_name_p={item.sub_name_p}
                    img_class_p={item.img_class_p}
                  />
                );
            })}
          </div>
          <div className="horizontal-line-gray"></div>

          <h4 className="container-box-subheading">{t("WHAT_WILL_YOU_GET")}</h4>
          <div className="prasad-data">
            {boxes(t).map((box, index) => (
              <div key={index} className="prasad-data--box">
                <div className="prasad-data--box-icon">{box.icon}</div>
                <h3 className="prasad-data--box-heading">{`${box.heading}`}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container ph-1">
        <div className="container-box">
          <h3 className="container-box-heading">
            {t("WHY_PERFORM_THIS_PUJA")}
          </h3>
          <Accordion poojaBenifits={poojaBenifits} topBenefits={topBenefits} />
        </div>
      </div>

      <div className="container">
        <div className="container-box ph-1">
          <AccordionComponent
            title={
              <h3 className="container-box-heading-data">
                {poojaVidhi?.heading ?? "Puja Vidhi & Mantras"}
              </h3>
            }
            defaultOpen={false}
          >
            <MantraSection poojaVidhi={poojaVidhi} />
          </AccordionComponent>
        </div>

        <div className="container-box ph-1">
          <AccordionComponent
            title={
              <h3 className="container-box-heading-data">
                {t("How it works?")}
              </h3>
            }
            defaultOpen={false}
          >
            <Stepper />
          </AccordionComponent>
        </div>
      </div>

      <div className="container">
        <div className="container-box ph-1">
          <AccordionComponent
            title={
              <h3 className="container-box-heading-data">
                {t("ABOUT_TEMPLE")}
              </h3>
            }
            defaultOpen={false}
          >
            <div className="container-box ph-1" style={{ marginTop: "16px" }}>
              <AboutTemple aboutTemple={aboutTemple} />
            </div>
          </AccordionComponent>
        </div>

        {/* <div className="container-box">
          <h3 className="container-box-heading ph-1">Recommended Pujas</h3>
          <div className="recommended-puja-rows ph-mob-1">
            {static_chadhava_data.map((datass: any, idx: number) => {
              return (
                <RecommendedChadhavaCard data={datass} index={idx} key={idx} />
              );
            })}
          </div>
        </div> */}

        {/* {chadhawaPerformedBy && chadhawaPerformedBy?.name && (
          <div className="container-box ph-1">
            <h3 className="container-box-heading">{t("PUJA_PERFORM_BY")}</h3>
            <PanditDataCard
              imageSrc={
                chadhawaPerformedBy?.image
                  ? chadhawaPerformedBy?.image
                  : "https://as1.ftcdn.net/v2/jpg/06/51/52/56/1000_F_651525680_DERm3VNypYv6Sav4cmeZZuQoZ6YN8Ksq.jpg"
              }
              title={chadhawaPerformedBy?.name ?? ""}
              subtitle={chadhawaPerformedBy?.temple ?? ""}
              description={chadhawaPerformedBy?.description ?? ""}
            />
          </div>
        )} */}

        {/* FAQ Section */}
        <div className="container-box ph-1">
          <AccordionComponent
            title={
              <h3 className="container-box-heading-data">{t("FAQ_HEAD")}</h3>
            }
            defaultOpen={false}
          >
            <div className="container-box ph-1" style={{ marginTop: "16px" }}>
              <FAQs />
            </div>
          </AccordionComponent>
        </div>

        {/* REVIEWS */}
        <div className="container-box">
          <h3 className="container-box-heading ph-1">{t("DEVOTEE_REVIEWS")}</h3>
          <div className="recommended-puja-rows ph-mob-1">
            {static_review.map((item: any, idx) => (
              <TestimonialImage key={idx} data={item} />
            ))}
          </div>
          <div className="container ph-1">
            <div className="horizontal-line-gray"></div>
          </div>
        </div>

        {/* PAST POOJA VIDEOS */}
        {devineExperience.length > 0 && (
          <div className="container-box">
            <h3 className="container-box-heading ph-1">
              {t("DIVINE_EXPERIENCE")}
            </h3>
            <DivineExperience devineExperience={devineExperience} />
            <div className="container ph-1">
              <div className="horizontal-line-gray"></div>
            </div>
          </div>
        )}

        <div className="ph-1">
          {" "}
          <SpiritualGuidanceBanner />{" "}
        </div>
      </div>

      {status !== "ACTIVE" ? (
        <MobileFooter
          button_name={t("OUT_OF_STOCK")}
          disabled_btn={true}
          left_section={
            <div className="checkout-footerbox">
              <p className="checkout-footerbox-title">
                {t("PUJA_NO_LONGER_AVAILABLE")}
              </p>
              <p
                className="checkout-footerbox-price"
                style={{ fontSize: "18px" }}
              >
                {t("UNAVAILABLE")}
              </p>
            </div>
          }
          hideOnScroll={true}
          showTopBanner={false}
        />
      ) : (
        <>
          {Object.keys(activePackage)?.length > 0 ? (
            <MobileFooter
              button_name={t("PARTICIPATE_NOW")}
              left_section={
                <div className="checkout-footerbox">
                  <p className="checkout-footerbox-title">
                    {/* {t("PACKAGE_PRICE")} */}
                    {activePackage.name ?? activePackage.title + " selected"}
                  </p>
                  <p className="checkout-footerbox-price" translate="no">
                    {currency}
                    {activePackage?.price ?? ""}/-{" "}
                  </p>
                </div>
              }
              onClick={() => {
                const eventbtn = button_event(
                  "Add offerings",
                  "Puja view : add to cart",
                  "Puja View",
                  { additional: { activePackage } }
                );
                save_event(redux?.auth?.authToken, "Puja View", [eventbtn]);
                setIsDrawerOpen(true);
                pushToDataLayerWithoutEvent(
                  transformToAddToCartEventPuja({
                    activePackage,
                    data: data[0],
                  })
                );
              }}
              hideOnScroll={false}
              timedata={poojaEndDate}
              showTopBanner={true}
            />
          ) : (
            <MobileFooter
              button_name={t("SELECT_PACKAGE")}
              left_section={
                <div className="checkout-footerbox">
                  <p className="checkout-footerbox-title">
                    {t("CHOOSE_YOUR_PACKAGE")}
                  </p>
                  <p
                    className="checkout-footerbox-price"
                    style={{ fontSize: "18px" }}
                  >
                    {`${currency}${minPrice} ${t("ONWARDS")} `}
                  </p>
                </div>
              }
              hideOnScroll={false}
              onClick={() => {
                toast?.show("Please select your puja package", "error");
                document.getElementById("package-data")?.scrollIntoView({
                  behavior: "smooth",
                });
              }}
              showTopBanner={true}
              timedata={poojaEndDate}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DI(PujaDetails);
