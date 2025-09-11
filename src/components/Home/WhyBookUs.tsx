import { BookIcon, LadduPlate, Swastik, Temple2Icon } from "@/assets/svgs";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import useTrans from "@/customHooks/useTrans";

const WhyBookUs = ({ redux }: DIProps) => {
  const t = useTrans(redux?.common?.language);
  const data = [
    {
      icon: <BookIcon className="whybookus-item--icon_no1" />,
      heading: t("WHY_BOOK_US_HEAD_1"),
      desc: t("WHY_BOOK_US_DESC_1"),
    },
    {
      icon: <LadduPlate className="whybookus-item--icon" />,
      heading: t("WHY_BOOK_US_HEAD_2"),
      desc: t("WHY_BOOK_US_DESC_2"),
    },
    {
      icon:<Swastik className="whybookus-item--icon" />, 
      heading: t("WHY_BOOK_US_HEAD_3"),
      desc: t("WHY_BOOK_US_DESC_3"),
    },
    {
      icon:<Temple2Icon className="whybookus-item--icon" />, 
      heading: t("WHY_BOOK_US_HEAD_4"),
      desc: t("WHY_BOOK_US_DESC_4"),
    },
  ];
  return (
    <div className="upcoming-events">
      <div>
        <h3 className="upcoming-events--heading">{t("WHY_BOOK_US_HEAD")}</h3>
        <p className="upcoming-events--description">{t("WHY_BOOK_US_DESC")}</p>
      </div>
      <div className="whybookus-container ph-mob-16">
        <div className="whybookus ">
          {data.map((item, idx) => (
            <div className="whybookus-item" key={idx}>
              {item?.icon}
              <div className="whybookus-item--data">
                <p className="whybookus-item--heading">{item?.heading}</p>
                <p className="whybookus-item--desc">{item?.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default DI(WhyBookUs);
