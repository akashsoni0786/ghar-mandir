import { DIProps } from "@/core/DI.types";
import { DarkBgButtonFw } from "../Common/Buttons";
import useTrans from "@/customHooks/useTrans";
import { DI } from "@/core/DependencyInjection";
import { getSign } from "@/constants/commonfunctions";
import MostPopular from "../Common/MostPopular/MostPopular";
interface Props extends DIProps {
  prasad: any;
  setPrasad: (e) => void;
}
const PrasadBoxs = ({ prasad, setPrasad, redux }: Props) => {
  const t = useTrans(redux?.common?.language);
  const currency = getSign();
  const handlePrasadInc = (id: string) => {
    const tempPrasad = structuredClone(prasad);
    prasad.forEach((item, idx) => {
      if (item.prasadId == id) {
        if (tempPrasad[idx]["count"]) tempPrasad[idx]["count"] += 1;
        else tempPrasad[idx]["count"] = 1;
      }
    });
    setPrasad(tempPrasad);
  };
  const handlePrasadDec = (id: string) => {
    const tempPrasad = structuredClone(prasad);
    prasad.forEach((item, idx) => {
      if (item.prasadId == id) {
        if (tempPrasad[idx]["count"]) tempPrasad[idx]["count"] -= 1;
        else tempPrasad[idx]["count"] = 1;
      }
    });
    setPrasad(tempPrasad);
  };
  return (
    <div className="package-selection-prasad">
      {prasad?.map((item, index) => {
        return (
          <div className="package-selection-prasad--box" key={item?.prasadId}>
            <div className="package-selection-prasad--box-data">
              <img
                src={
                  item.image ?? "https://demofree.sirv.com/nope-not-here.jpg"
                }
                alt="img-prasad"
                className="package-selection-prasad--box-img"
              />
              <div className="package-selection-prasad--box-content">
                <label className="package-selection-prasad--box-title">
                  {item?.title ?? ""}
                  {item?.mostPopular && item?.mostPopular == true ? (
                    <MostPopular text={"Most Added"} />
                  ) : (
                    <></>
                  )}
                </label>
                <p className="package-selection-prasad--box-subtitle">
                  {item?.description ?? ""}
                </p>
                <p className="package-selection-prasad--box-price">
                  {currency} {item?.price ?? ""}/-
                </p>
              </div>
            </div>
            <div className="package-selection-prasad--box-button">
              {item.count && item.count > 0 ? (
                <span className="triple-data-button">
                  <span
                    className="triple-data-button-3"
                    onClick={() => {
                      handlePrasadDec(item?.prasadId);
                    }}
                  >
                    -
                  </span>
                  <span className="triple-data-button-2">
                    {"  " + item.count + "  "}
                  </span>
                  <span
                    className="triple-data-button-1"
                    onClick={() => {
                      handlePrasadInc(item?.prasadId);
                    }}
                  >
                    +
                  </span>
                </span>
              ) : (
                <DarkBgButtonFw
                  onClick={() => {
                    handlePrasadInc(item?.prasadId);
                  }}
                  className="small-button"
                >
                  {t("ADD_PLUS")}
                </DarkBgButtonFw>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DI(PrasadBoxs);
