import "./About.css";
import D1 from "../../assets/images/devotee.png";
import D2 from "../../assets/images/devotee_2.png";
import D3 from "../../assets/images/devotee_3.png";
import Root1 from "../../assets/images/root-1.png";
import Root2 from "../../assets/images/root-2.png";
import Root3 from "../../assets/images/root-3.png";
import Apurva from "../../assets/images/apurva.jpg";
import { LinkedIcon, ThumbIcon } from "@/assets/svgs";
import Image from "next/image";
import { TextButton } from "../Common/Buttons";
import useTrans from "@/customHooks/useTrans";
import { useEffect } from "react";
import { updateMobFooter } from "@/store/slices/commonSlice";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";

const About = ({dispatch}:DIProps) => {
  const t = useTrans("");
  const handleEmailClick = () => {
    const emailUrl = `mailto:hiring@gharmandir.in?subject=${encodeURIComponent(
      ""
    )}&body=${encodeURIComponent("")}`;
    window.location.href = emailUrl;
  };
   useEffect(() => {
    if (dispatch)
      dispatch(
        updateMobFooter({
          showMobFooter: {
            mobFooter: false,
            timeBanner: false,
          },
        })
      );
  }, []);
  return (
    <div className="about">
      {/* {loading && <OverlayLoading />} */}
      <div className="container about-header ">
        <p className="about-header--name">{t("ABOUT_US")}</p>
      </div>

      <div className="about-gm">
        <div className="about-gm--box container">
          <h4 className="about-gm--heading">{t("HOW_GM_STARTED")}</h4>
          <div className="about-gm--paras ">
            <p className="about-gm--para">
              {t("CONTENT_1")},
              <span className="about-gm--para-bold">{t("CONTENT_2")}</span>
            </p>
            <p className="about-gm--para">{t("CONTENT_3")}</p>
          </div>
        </div>
      </div>

      <div className="about-founder container">
        <h4 className="about-heading  ph-16">{t("CONTENT_4")}</h4>
        <p className="about-subheading  ph-16">{t("CONTENT_5")}</p>
        <div className="about-founder--boxes">
          <div className="about-founder--box">
            <img
              className="about-founder--box-img"
              src={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7rt7AvB6R-vZNvfB5p_z5cz-rM6wW6QNmig&s"
              }
              alt="samya-mittal"
            />
            <div className="about-founder--box-info">
              <div className="about-founder--box-info-data">
                <p className="about-founder--box-info-cofndr">Co- Founder</p>
                <h5 className="about-founder--box-info-name">Samya Mittal</h5>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  window.open(
                    "https://www.linkedin.com/in/samya-mittal",
                    "_blank"
                  );
                }}
              >
                <LinkedIcon />
              </div>
            </div>

            {/* <p className="about-founder--box-desc">
              “I lead with intention, rooted in culture and a passion to serve”
            </p> */}
          </div>
          <div className="about-founder--box">
            <Image
              className="about-founder--box-img"
              src={Apurva}
              alt="apurva-shah"
            />
            <div className="about-founder--box-info">
              <div className="about-founder--box-info-data">
                <p className="about-founder--box-info-cofndr">Co- Founder</p>
                <h5 className="about-founder--box-info-name">Apurva Shah</h5>
              </div>
              <div
                className="cursor-pointer"
                onClick={() => {
                  window.open(
                    "https://www.linkedin.com/in/shah-apurva/",
                    "_blank"
                  );
                }}
              >
                <LinkedIcon />
              </div>
            </div>

            {/* <p className="about-founder--box-desc">
              “I lead with intention, rooted in culture and a passion to serve”
            </p> */}
          </div>
        </div>
      </div>

      {/* <div className="about-founder container">
        <h4 className="about-heading ph-16">Meet the team</h4>
        <p className="about-subheading ph-16">
          Know more about the people behind Ghar Mandir
        </p>
        <div className="about-team--container">
          <div className="about-team--boxes">
            <div className="about-team--card first-card">
              <img
                className="about-team--card-img"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNz4X_qYcv9481XeY6fYC38spds4NNhNTMGA&s"
                alt="samya-mittal"
              />
              <div>
                <h4 className="about-team--card-name">Apurva Shah</h4>
                <p className="about-team--card-post">Co-Founder</p>
              </div>
            </div>
            <div className="about-team--card">
              <img
                className="about-team--card-img"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNz4X_qYcv9481XeY6fYC38spds4NNhNTMGA&s"
                alt="samya-mittal"
              />
              <div>
                <h4 className="about-team--card-name">Apurva Shah</h4>
                <p className="about-team--card-post">Co-Founder</p>
              </div>
            </div>
            <div className="about-team--card">
              <img
                className="about-team--card-img"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNz4X_qYcv9481XeY6fYC38spds4NNhNTMGA&s"
                alt="samya-mittal"
              />
              <div>
                <h4 className="about-team--card-name">Apurva Shah</h4>
                <p className="about-team--card-post">Co-Founder</p>
              </div>
            </div>
            <div className="about-team--card last-card">
              <img
                className="about-team--card-img"
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNz4X_qYcv9481XeY6fYC38spds4NNhNTMGA&s"
                alt="samya-mittal"
              />
              <div>
                <h4 className="about-team--card-name">Apurva Shah</h4>
                <p className="about-team--card-post">Co-Founder</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}

      <div className="about-founder container">
        <h4 className="about-heading ph-16">{t("DIVINE_JOURNEY_HEADING")}</h4>
        <div className="about-journeycount">
          <div className="about-journeycount--card">
            <p className="about-journeycount--card-name">
              {t("PUJA_CHADHAWA_OFFERED")}
            </p>
            <p className="about-journeycount--card-count">
              {t("PUJA_CHADHAWA_COUNT")}
            </p>
            <p className="about-journeycount--card-desc">
              {t("PUJA_CHADHAWA_DESC")}
            </p>
          </div>

          <div className="about-journeycount--card">
            <p className="about-journeycount--card-name">
              {t("TRUSTED_USERS")}
            </p>
            <p className="about-journeycount--card-count">
              {t("TRUSTED_USERS_COUNT")}
            </p>
            <p className="about-journeycount--card-desc">
              {t("TRUSTED_USERS_DESC")}
            </p>
          </div>

          <div className="about-journeycount--card">
            <p className="about-journeycount--card-name">
              {t("ASSOCIATED_TEMPLES")}
            </p>
            <p className="about-journeycount--card-count">
              {t("ASSOCIATED_TEMPLES_COUNT")}
            </p>
            <p className="about-journeycount--card-desc">
              {t("ASSOCIATED_TEMPLES_DESC")}
            </p>
          </div>
        </div>
      </div>

      {/* <div className="about-founder container">
        <h4 className="about-heading ph-16 mb-16">
          Authentic Prasad, Straight from the Temple
        </h4>
        <div className="about-prasads">
          <div className="about-prasads--imgs">
            <Image
              className="about-prasads--imgs-prasad"
              src={Prasad2}
              alt="prasad2"
            />
            <Image
              className="about-prasads--imgs-prasad"
              src={Prasad1}
              alt="prasad1"
            />
          </div>
          <p className="about-prasads--desc">
            We deliver the same prasad offered at the temple no substitutes, no
            third-party sourcing.
            <br style={{ marginTop: "20px" }} /> What you receive is directly
            from the sacred place where your puja or chadhawa was performed.
          </p>
        </div>
      </div> */}

      <div className="about-founder container">
        <h4 className="about-heading ph-16">{t("ROOTED_IN_HINDUISM")}</h4>
        <div className="about-roots ph-16">
          <div className="about-roots--card">
            <Image className="about-roots--card-img" src={Root3} alt="mandir" />
            <div className="about-roots--card-content">
              <h5 className="about-roots--card-heading">
                {t("WHO_WE_ARE_HEADING")}
              </h5>
              <div className="about-roots--card-content-hr" />
              <p className="about-roots--card-desc">{t("WHO_WE_ARE_DESC")}</p>
            </div>
          </div>

          <div className="about-roots--card about-roots--card-rev">
            <div className="about-roots--card-content">
              <h5 className="about-roots--card-heading">
                {t("OUR_PHILOSOPHY_HEADING")}
              </h5>
              <div className="about-roots--card-content-hr" />
              <p className="about-roots--card-desc">
                {t("OUR_PHILOSOPHY_DESC")}
              </p>
            </div>
            <Image className="about-roots--card-img" src={Root2} alt="mandir" />
          </div>

          <div className="about-roots--card">
            <Image className="about-roots--card-img" src={Root1} alt="mandir" />
            <div className="about-roots--card-content">
              <h5 className="about-roots--card-heading">
                {t("CULTURE_WE_CHERISH_HEADING")}
              </h5>
              <div className="about-roots--card-content-hr" />
              <p className="about-roots--card-desc">
                {t("CULTURE_WE_CHERISH_DESC")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-founder container">
        <h4 className="about-heading ph-16 mb-16">
          {t("DEVOTEES_THOUGHTS_HEADING")}
        </h4>
        <div className="about-devotee">
          <div className="about-devotee--small">
            <Image
              src={D3}
              alt="mini-devotee"
              className="about-devotee--small-img"
            />
            <div className="about-devotee--small-data">
              <ThumbIcon />
              <p className="about-devotee--comment">{t("DEVOTEE_1_COMMENT")}</p>
              <p className="about-devotee--comment-name">
                {t("DEVOTEE_1_NAME")}
              </p>
            </div>
          </div>

          <div className="about-devotee--big">
            <Image
              src={D1}
              alt="mini-devotee"
              className="about-devotee--big-img"
            />
            <div className="about-devotee--big-data">
              <ThumbIcon />
              <p className="about-devotee--comment-big">
                {t("DEVOTEE_2_COMMENT")}
              </p>
              <p className="about-devotee--comment-name-big">
                {t("DEVOTEE_2_NAME")}
              </p>
            </div>
          </div>

          <div className="about-devotee--small">
            <Image
              src={D2}
              alt="mini-devotee"
              className="about-devotee--small-img"
            />
            <div className="about-devotee--small-data">
              <ThumbIcon />
              <p className="about-devotee--comment">{t("DEVOTEE_3_COMMENT")}</p>
              <p className="about-devotee--comment-name">
                {t("DEVOTEE_3_NAME")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="about-founder container">
        <h4 className="about-heading ph-16">{t("WE_ARE_LOOKING_HEADING")}</h4>
        <p className="about-subheading ph-16">
          {t("WE_ARE_LOOKING_SUBHEADING")}
          <span className="about-subheading-btn">
            <TextButton onClick={handleEmailClick}>
              {t("HIRING_EMAIL")}{" "}
            </TextButton>
          </span>
        </p>
      </div>
    </div>
  );
};
export default DI(About);
