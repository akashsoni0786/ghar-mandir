import PanditDataCard from "../Common/Cards/PanditDataCard";
import useWindow from "@/customHooks/useWindows";
import BottomDrawer from "../Common/BottomDrawer";
import { useEffect, useState } from "react";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import { urlFetchCalls } from "@/constants/url";
import MobileFooter from "../Common/MobileFooter";
import PujaHeroSection from "../PujaDetails/PujaHeroSection";
import Accordion from "../PujaDetails/BenefitsContent";
import Stepper from "../PujaDetails/Stepper";
import AboutTemple from "../PujaDetails/AboutTemple";
import DivineExperience from "../Common/VideoSlider/DivineExperience";
import FAQs from "../PujaDetails/FAQs";
import OfferingBoxes from "../PackageSelection/OfferingBoxes";
import ChadhavaPacakgeSelection from "../PackageSelection/ChadhavaPacakgeSelection";
import { boxes, static_review } from "@/commonvaribles/constant_variable";
import {
  formatOfferingsMax,
  getCurrencyName,
  getSign,
  packData,
  transformToAddToCartEventChadhava,
} from "@/constants/commonfunctions";
import SpiritualGuidanceBanner from "../Common/Banner";
import { usePoojaContext } from "../PujaDetails/PoojaDetailsContext";
import { button_event, save_event } from "@/constants/eventlogfunctions";
import TestimonialImage from "../PujaDetails/TestimonialImage";
import RecommendedChadhavaListing from "../Common/RecommendedChadhavaCard/RecommendedChadhavaListing";
import useTrans from "@/customHooks/useTrans";
import { pushToDataLayerWithoutEvent } from "@/lib/gtm";
import { convertEarlyDataToaddtocartdata } from "@/constants/jscommonfunction";
import { useRouter } from "next/navigation";
import { addCartData } from "@/store/slices/checkoutSlice";
import { WhatsappColoredIcon } from "@/assets/svgs";
import AccordionComponent from "../Common/Accordian/AccordianComponent";

interface Props extends DIProps {
  data: any;
}
const {
  GET: { devoteeExperience },
  POST: { order_addToCart },
} = urlFetchCalls;

const ChadhavaDetails = (props: Props) => {
  const pujaContext = usePoojaContext();
  const { data, redux, request, toast, dispatch } = props;
  const t = useTrans(redux?.common?.language);
  const currency = getSign();
  const {
    details,
    image,
    aboutTemple,
    addOns,
    chadhawaPerformedBy,
    devineExperience,
    packages,
    chadhaavaBenifits,
    chadhaavaId,
    chadhaavaName,
    chadhaavaEndDate,
    topBenefits,
    status,
    subscription,
    reviewData,
    prasadIncluded,
    pitruNameIncluded,
  } = data[0];
  const router = useRouter();
  const showPrasad = [
    "0f56b4b1-24dd-4e5c-9913-989675805e55",
    "6fbc49ec-d117-491d-aac5-accb4ebf4aef",
  ];
  const currency_name = getCurrencyName();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [testimonial, setTestimonial] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [moreOffer, setMoreOffer] = useState(
    pujaContext.addons?.moreOffer ?? addOns?.moreOffering ?? []
  );
  const [prasadOffer, setPrasadOffer] = useState(
    pujaContext.addons?.prasad ?? addOns?.prasad ?? []
  );
  const [priceData, setPriceData] = useState({
    addOns: "Chadhava",
    total_price: 0,
  });
  const [loading, setLoading] = useState(false);
  const addToCartData = () => {
    setLoading(true);
    const param = convertEarlyDataToaddtocartdata({
      offerings: moreOffer,
      prasad: prasadOffer,
      priceData,
      data: data[0],
      redux,
    });
    if (request && redux?.auth?.authToken && redux?.auth?.authToken != "") {
      request
        .POST(order_addToCart, {
          ...param,
          // member_package_list: packages
        })
        .then((res: any) => {
          if (res?.success) toast?.show(res?.message, "success");
          else toast?.show(res?.message, "warn");
          router.push("/checkout");
        })
        .finally(() => {
          setLoading(false);
          // router.push("/checkout");
        });
    } else {
      if (dispatch)
        dispatch(
          addCartData({
            addToCart: { [param.product.chadhaavaId]: param },
          })
        );
      toast?.show("Added to cart", "success");
      setLoading(false);
      router.push("/checkout");
    }
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
    const arr =
      showPrasad.includes(chadhaavaId) && prasadOffer.length > 0
        ? [...prasadOffer, ...moreOffer]
        : moreOffer;
    const min_price = Math.min(...arr.map((i: any) => i.price));
    setMinPrice(min_price);
  }, [packages]);

  useEffect(() => {
    let offering_count = 0;
    let total_price = 0;
    moreOffer.forEach((val: any) => {
      if (val?.count && val?.count > 0) {
        offering_count++;
        total_price += val?.count * val?.price;
      }
    });
    prasadOffer.forEach((val: any) => {
      if (val?.count && val?.count > 0) {
        offering_count++;
        total_price += val?.count * val?.price;
      }
    });
    setPriceData({
      total_price,
      addOns: packData(0, offering_count),
    });
  }, [moreOffer, prasadOffer]);
  return (
    <div>
      {isDrawerOpen && (
        <BottomDrawer
          setIsDrawerOpen={setIsDrawerOpen}
          isDrawerOpen={isDrawerOpen}
          component={
            <ChadhavaPacakgeSelection
              image={image[0]}
              imageList={image}
              data={addOns}
              chadhaavaId={chadhaavaId}
              details={details}
              showForLogin={() => {}}
              packages={packages}
              moreOffer={moreOffer ?? []}
              chadhaavaName={chadhaavaName}
              prasadOffer={prasadOffer}
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
          type={"Chadhava"}
          reviewData={reviewData}
        />
      </div>

      {showPrasad.includes(chadhaavaId) && prasadOffer.length > 0 && (
        <div className="container ph-1" id="package-data">
          <div className="container-box">
            <h3 className="container-box-heading mb-8">
              {showPrasad.includes(chadhaavaId)
                ? "Prasad Home Delivery"
                : t("ADD_PRASAD")}
            </h3>
            <OfferingBoxes
              moreOffer={prasadOffer}
              setMoreOffer={(e: any) => {
                setPrasadOffer(e);
                pujaContext.setAddons({ ...pujaContext.addons, prasad: e });
              }}
              drawer={false}
              checkActive={status !== "ACTIVE"}
            />
          </div>
          <div className="horizontal-line-gray"></div>
        </div>
      )}
      {moreOffer.length > 0 && (
        <div className="container ph-1" id="package-data">
          <div className="container-box">
            <div style={{ marginTop: "-14px" }}>
              <h3 className="container-box-heading-data ">
                {chadhaavaId == "6fbc49ec-d117-491d-aac5-accb4ebf4aef"
                  ? "Abhishek at Mahakaleshwar"
                  : "Chadhava in your Name & Gotra"}
                {/* //t("ADD_CHADHAVA_IN_THALI")} */}
              </h3>

              <div className=" d-flex-center">
                <p className="container-box-subheading-data">
                  Receive chadhava video📱 with your name and gotra{" "}
                  <span className="whatsapp-wrapper">
                    on WhatsApp{" "}
                    <WhatsappColoredIcon className="text-icon-whatsapp" />
                  </span>{" "}
                </p>
              </div>
            </div>
            <OfferingBoxes
              moreOffer={moreOffer}
              setMoreOffer={(e: any) => {
                setMoreOffer(e);
                pujaContext.setAddons({ ...pujaContext.addons, moreOffer: e });
              }}
              drawer={false}
              checkActive={status !== "ACTIVE"}
              subscription={{ ...subscription, chadhaavaId }}
            />
          </div>
          <div className="horizontal-line-gray"></div>
        </div>
      )}

      <div className="container ph-1">
        <div className="container-box">
          <h3 className="container-box-heading mb-8">
            {t("WHAT_WILL_YOU_GET")}
          </h3>
          <div className="prasad-data">
            {boxes(t).map((box, index) => (
              <div key={index} className="prasad-data--box">
                <div className="prasad-data--box-icon">{box.icon}</div>
                <h3 className="prasad-data--box-heading">{`${box.heading}`}</h3>
              </div>
            ))}
          </div>
        </div>
        <div className="horizontal-line-gray"></div>
      </div>

      <div className="container ph-1">
        <div className="container-box">
          <h3 className="container-box-heading">
            {t("WHY_PERFORM_THIS_PUJA")}
          </h3>
          <Accordion
            poojaBenifits={chadhaavaBenifits}
            topBenefits={topBenefits}
          />
        </div>
      </div>

      <div className="container">
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
            {" "}
            <div className="container-box ph-1" style={{ marginTop: "16px" }}>
              <AboutTemple aboutTemple={aboutTemple} />
            </div>
          </AccordionComponent>
        </div>

        {/* <div className="container-box">
          <h3 className="container-box-heading ph-1">Recommended Pujas</h3>
          <div className="recommended-puja-rows ph-mob-1">
            <RecommendedPujaCard />
            <RecommendedPujaCard />
            <RecommendedPujaCard />
            <RecommendedPujaCard />
          </div>
        </div>

         <div className="container-box">
                  <h3 className="container-box-heading ph-1">Recommended Pujas</h3>
                  <div className="recommended-puja-rows ph-mob-1">
                    {static_chadhava.map((datass: any, idx: number) => {
                      return (
                        <RecommendedChadhavaCard data={datass} index={idx} key={idx} />
                      );
                    })}
                  </div>
                </div> */}

        {/* {chadhawaPerformedBy && chadhawaPerformedBy?.name && (
          <div className="container-box ph-1">
            <AccordionComponent
              title={
                <h3 className="container-box-heading-data">
                  {t("PUJA_PERFORM_BY")}
                </h3>
              }
              defaultOpen={false}
            >
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
            </AccordionComponent>
          </div>
        )} */}

        {/* FAQS */}

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

        {/* PAST POOJA VIDEOS */}
        {devineExperience.length > 0 && (
          <div className="container-box">
            <h3 className="container-box-heading ph-1">
              {t("DIVINE_EXPERIENCE")}
            </h3>
            <DivineExperience devineExperience={devineExperience} />
          </div>
        )}
        {devineExperience.length > 0 && (
          <div className="container ph-1">
            <div className="horizontal-line-gray"></div>
          </div>
        )}

        {/* REVIEWS */}
        <div className="container-box">
          <h3 className="container-box-heading ph-1">{t("DEVOTEE_REVIEWS")}</h3>
          <div className="recommended-puja-rows ph-mob-1">
            {static_review.map((item: any, idx) => (
              <TestimonialImage key={idx} data={item} />
            ))}
          </div>
        </div>

        <div className="container ph-1">
          <div className="horizontal-line-gray"></div>
        </div>

        {/* CROSS SELL */}
        {/* <div style={{ marginTop: "40px" }}>
          <RecommendedChadhavaListing
            chadhaavaId={chadhaavaId}
            priceUpdate={(e) => {
              pujaContext.setRecommendedPrice((prev) => prev + Number(e));
            }}
          />
        </div> */}

        {/* <div className="container ph-1">
          <div className="horizontal-line-gray"></div>
        </div> */}

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
                {t("CHADHAVA_NO_LONGER_AVAILABLE")}
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
          {moreOffer.length > 0 &&
          (moreOffer?.some((i) => i?.count && i?.count > 0) ||
            prasadOffer?.some((i) => i?.count && i?.count > 0)) &&
          priceData?.total_price &&
          priceData?.total_price > 0 ? (
            <MobileFooter
              button_name={t("PARTICIPATE_NOW")}
              left_section={
                <div className="checkout-footerbox">
                  <p className="checkout-footerbox-title">
                    {formatOfferingsMax(
                      showPrasad.includes(chadhaavaId)
                        ? [...prasadOffer, ...moreOffer]
                        : moreOffer,
                      Number(pujaContext.recommendedPrice ?? 0)
                    )
                      ? formatOfferingsMax(
                          showPrasad.includes(chadhaavaId)
                            ? [...prasadOffer, ...moreOffer]
                            : moreOffer,
                          Number(pujaContext.recommendedPrice ?? 0)
                        )
                      : priceData.addOns}
                  </p>
                  <p
                    className="checkout-footerbox-price"
                    style={{ fontSize: "18px" }}
                    translate="no"
                  >
                    {`${currency}${
                      Number(priceData?.total_price ?? 0) +
                      Number(pujaContext.recommendedPrice ?? 0)
                    }/-`}
                  </p>
                </div>
              }
              hideOnScroll={
                moreOffer.length > 0 &&
                (moreOffer?.some((i) => i?.count && i?.count > 0) ||
                  prasadOffer?.some((i) => i?.count && i?.count > 0))
                  ? false
                  : true
              }
              onClick={() => {
                const eventbtn = button_event(
                  "Add to your thali",
                  "Chadhava view : add to cart",
                  "Chadhava View",
                  { additional: { moreOffer, prasadOffer, priceData } }
                );

                save_event(redux?.auth?.authToken, "Chadhava View", [eventbtn]);
                pushToDataLayerWithoutEvent(
                  transformToAddToCartEventChadhava({
                    offerings: moreOffer,
                    prasad: prasadOffer,
                    priceData,
                    data: data[0],
                  })
                );
                if (
                  (currency_name == "USD" ||
                    showPrasad.includes(chadhaavaId)) &&
                  (moreOffer?.some((i) => i?.count && i?.count > 0) ||
                    prasadOffer?.some((i) => i?.count && i?.count > 0))
                ) {
                  addToCartData();
                } else {
                  setIsDrawerOpen(true);
                }
              }}
              loading={loading}
              showTopBanner={true}
              timedata={chadhaavaEndDate}
            />
          ) : (
            <MobileFooter
              button_name={
                showPrasad.includes(chadhaavaId)
                  ? "Add Sewa"
                  : t("ADD_CHADHAVA")
              }
              left_section={
                <div className="checkout-footerbox">
                  <p className="checkout-footerbox-title">
                    {showPrasad.includes(chadhaavaId)
                      ? "Choose your sewa"
                      : t("CHOOSE_YOUR_CHADHAVA")}
                  </p>
                  <p
                    className="checkout-footerbox-price"
                    style={{ fontSize: "18px" }}
                  >
                    {pujaContext.recommendedPrice == 0
                      ? `${currency}${minPrice}/- ${t("ONWARDS")} `
                      : `${currency}${pujaContext.recommendedPrice}/-`}
                  </p>
                </div>
              }
              onClick={() => {
                document.getElementById("package-data")?.scrollIntoView({
                  behavior: "smooth",
                });
                toast?.show(
                  showPrasad.includes(chadhaavaId)
                    ? "Please select your chadhava or prasad!"
                    : "Please select your chadhava!",
                  "error"
                );
              }}
              showTopBanner={true}
              timedata={chadhaavaEndDate}
              hideOnScroll={false}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DI(ChadhavaDetails);
