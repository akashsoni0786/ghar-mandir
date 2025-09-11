import { url } from "inspector";
import "./Advisor.css";
const Advisors = () => {
  return (
    <div className="upcoming-events-bg">
      <div className="container ph-16">
        <h3 className="upcoming-events--heading">Spiritual Advisors</h3>
        <p className="upcoming-events--description">
          Gharnandir is a trusted platform for authentic puja services,
          performed by certified Vedic priests. From sanctified Prasad to
          personalized guidance, we bring the true temple experience to your
          home with purity and devotion.
        </p>
      </div>
      <div className="whybookus-container ">
        <div className="advice-box-container">
          <div className="advice-box">
            <div
              className="advice-1"
              
            >
              <p className="advice-data">
                Gharmandir's pandits are certified experts who perform every
                ritual with Vedic precision and heartfelt devotion
              </p>
            </div>
            <div className="advice-2">
              <p className="advice-data">
                Gharmandir's Puja and Chadhava follow Rigveda, Samaveda,
                Yajurveda, Atharvaveda, and Upaveda for true spiritual
                authenticity
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Advisors;
