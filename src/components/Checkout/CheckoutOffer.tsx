import { ActiveCheckIconLight, CalenderIcon, TempleIcon } from "@/assets/svgs";
import { DarkBgButtonFw } from "../Common/Buttons";

const CheckoutOffer = () => {
  return (
    <div className=" checkout-offer ">
      <h3 className=" checkout-offer--heading ">
        Make a Special Offer to the Divine!
      </h3>
      <div className="checkout-offer--cards">
        {[1, 2, 3].map((item: number) => {
          return (
            <div className="checkout-offer--card" key={item}>
              <h4 className="checkout-offer--card-heading">
              Chadhava for family and growth problems
              </h4>
              <div className="checkout-offer--card-hr" />
              <p className="checkout-offer--card-subheading">Your offerings</p>
              <div className="checkout-offer--card-values">
                <div className="checkout-offer--card-value">
                  <ActiveCheckIconLight className="checkout-offer--card-value-icon" />
                  <p className="checkout-offer--card-value-name">Flowers</p>
                </div>
                <div className="checkout-offer--card-value">
                  <ActiveCheckIconLight className="checkout-offer--card-value-icon" />
                  <p className="checkout-offer--card-value-name">Ganga Jal</p>
                </div>
              </div>

              <div className="checkout-offer--card-temple-date">
                <div className="checkout-offer--card-temple">
                  <TempleIcon className="checkout-offer--card-templeicon" />
                  <p className="checkout-offer--card-templename">
                    Shani Shingnapur Premises
                  </p>
                </div>
                <div className="checkout-offer--card-date">
                  <CalenderIcon className="checkout-offer--card-dateicon" />
                  <p className="checkout-offer--card-datename">
                    11th March, Tuesday, 2025
                  </p>
                </div>
              </div>

              <div className="checkout-offer--card-addbtn">
                <DarkBgButtonFw children="Add now" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default CheckoutOffer;
