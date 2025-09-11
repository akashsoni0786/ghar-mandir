import { DarkBgButton, LightBgButton } from "./Buttons";
import Logo from "../../assets/images/old_logo.png";
import Image from "next/image";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
interface Props extends DIProps {
  setConfirm: (e: boolean) => void;
}
const ConfirmationBox = ({ setConfirm, location }: any) => {
  return (
    <div className="confirmation-card">
      <div className="confirmation-content">
        <div className="confirmation-content--logo"><Image alt="logo" src={Logo} /></div>
        {/* <h3 className="confirmation-title">Confirm Switch</h3> */}
        <p className="confirmation-message">
          You will now redirected to old Ghar Mandir's website
        </p>
        <div className="confirmation-actions">
          <LightBgButton
            color="primary"
            onClick={() => {
              setConfirm(false);
            }}
          >
            {"No"}
          </LightBgButton>
          <DarkBgButton
            children={"Yes"}
            onClick={() => {
              if (location.includes("Mahamrityunjaya_puja")) {
                window.location.href =
                  "https://gharmandir.in/product/mahamrityunjaya-jaap-mahakaleshwar/";
              } else
                window.location.href =
                  "https://gharmandir.in/product/bankey-bihari-kheer-sewa/";
            }}
          />
        </div>
      </div>
    </div>
  );
};
export default DI(ConfirmationBox);
