import { PackageBackgroundIcon, UncheckIcon } from "@/assets/svgs";
import { getSign } from "@/constants/commonfunctions";
import useWindow from "@/customHooks/useWindows";
import Image from "next/image";
const PackageBoxUn = ({
  name,
  image,
  sub_name,
  price,
  img_class,
  index,
  onClick,
  active,
  isActive,
  chadhava,
  cutPrice,
  pitruNameIncluded,
  name_p,
  sub_name_p,
  img_class_p
}: any) => {
  const { width } = useWindow();
  const currency = getSign();

  return (
    <div
      className={`package-box  ${isActive ? "" : "disable-button"}`}
      onClick={() => {
        onClick({
          name: name + " " + sub_name,
          image,
          price: Number(price),
          img_class,
          index,
          active,
        });
      }}
    >
      <span>
        <PackageBackgroundIcon className="package-box--bg" />
      </span>
      <span>
        {typeof image == "string" ? (
          <img
            className={`package-box--personImg ${pitruNameIncluded ? img_class_p : img_class}`}
            src={image}
            alt={name}
          />
        ) : (
          <Image
            className={`package-box--personImg ${pitruNameIncluded ? img_class_p : img_class}`}
            src={image}
            alt={name}
          />
        )}
      </span>
      <span className="package-box--checkbox">
        <UncheckIcon />
      </span>
      <div className="package-box--details">
        <div
          className={`package-box--details-type package-box--details-type-${index}`}
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
            <p className="package-box--details-cutprice">{`${
              chadhava ? "+" : ""
            }${currency}${price}`}</p>
          )}
          <p className="package-box--details-price">{`${
            chadhava ? "+" : ""
          }${currency}${price}`}</p>
        </div>
      </div>
    </div>
  );
};
export default PackageBoxUn;
