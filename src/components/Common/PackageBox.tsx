import { ActiveCheckIcon, PackageActiveBackgroundIcon } from "@/assets/svgs";
import { getSign } from "@/constants/commonfunctions";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import useWindow from "@/customHooks/useWindows";
import Image from "next/image";
interface Props extends DIProps {
  price: number; // Add the missing 'price' property
  index: number; // Add the missing 'index' property
  img_class: string; // Add the missing 'img_class' property
  name: string; // Add the missing 'name' property
  image: any; // Add the missing 'image' property
  sub_name: string; // Add the missing 'sub_name' property
  active: boolean; // Add the missing 'active' property
  onClick: (data: any) => void; // Add the missing 'onClick' property
  isActive: boolean;
  chadhava: boolean;
  cutPrice: string;
  pitruNameIncluded?: boolean;
  name_p?: string;
  sub_name_p?: string;
  img_class_p?: string;
}
const PackageBox = (props: Props) => {
  const {
    name,
    image,
    sub_name,
    price,
    img_class,
    index,
    active,
    onClick,
    isActive,
    chadhava,
    cutPrice,
    pitruNameIncluded,
    name_p,
    sub_name_p,
    img_class_p,
  } = props;
  const { width } = useWindow();
  const currency = getSign();

  return (
    <div
      className={`package-box-active ${isActive ? "" : "disable-button"}`}
      onClick={() => {
        onClick({});
      }}
    >
      <span>
        <PackageActiveBackgroundIcon className="package-box--bg" />
      </span>
      <span>
        {typeof image == "string" ? (
          <img
            className={`package-box--personImg ${
              pitruNameIncluded ? img_class_p : img_class
            }`}
            src={image}
            alt={name}
          />
        ) : (
          <Image
            className={`package-box--personImg ${
              pitruNameIncluded ? img_class_p : img_class
            }`}
            src={image}
            alt={name}
          />
        )}
      </span>
      <span className="package-box--checkbox">
        <ActiveCheckIcon />
      </span>
      <div className="package-box--details">
        <div
          className={`package-box--details-type-active package-box--details-type-active-${index}`}
        >
          <p className={`package-title-${index}`}>
            {pitruNameIncluded ? name_p : name}
          </p>
          {!(cutPrice && cutPrice != "" && (index == 0 || index == 1)) && (
            <p className={`package-subcontent-${index}`}>
              {pitruNameIncluded ? sub_name_p : sub_name}
            </p>
          )}
        </div>
        <div
          style={{
            display: "flex",
            gap: width < 650 && (index == 1 || index == 0) ? "0px" : "8px",
            flexDirection:
              width < 650 && (index == 1 || index == 0) ? "column" : "row",
            alignItems: "baseline",
          }}
        >
          {cutPrice && cutPrice != "" && (
            <p className="package-box--details-cutprice-active">{`${
              chadhava ? "+" : ""
            }${currency}${cutPrice}`}</p>
          )}
          <p className="package-box--details-price-active">{`${
            chadhava ? "+" : ""
          }${currency}${price}`}</p>
        </div>
      </div>
    </div>
  );
};
export default DI(PackageBox);
