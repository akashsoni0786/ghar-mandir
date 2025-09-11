import { DI } from "@/core/DependencyInjection";
import FAQs from "../PujaDetails/FAQs";
import { DIProps } from "@/core/DI.types";
import useTrans from "@/customHooks/useTrans";

const FAQBox = ({ redux }: DIProps) => {
  const t = useTrans(redux?.common?.language);
  return (
    <div className="upcoming-events">
      <div>
        <h3 className="upcoming-events--heading">{t("FAQ_HEAD")}</h3>
      </div>
      <div className="whybookus-container ph-mob-16">
        <FAQs />
      </div>
    </div>
  );
};
export default DI(FAQBox);
