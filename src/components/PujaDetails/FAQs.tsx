import { ChevronIcon } from "@/assets/svgs";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import useTrans from "@/customHooks/useTrans";
import { useState } from "react";

const FAQs = ({ redux }: DIProps) => {
  const t = useTrans(redux?.common?.language);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const accordionItems = [
    {
      id: "accordion-flush-heading-1",
      title: (
        <span className="content-heading">
          <span className="content-heading-label">{t("FAQ_QUES_1")}</span>
        </span>
      ),
      content: <p className="mb-2 content-description">{t("FAQ_ANS_1")}</p>,
    },
    {
      id: "accordion-flush-heading-2",
      title: (
        <span className="content-heading">
          <span className="content-heading-label">{t("FAQ_QUES_2")}</span>
        </span>
      ),
      content: <p className="mb-2 content-description">{t("FAQ_ANS_2")}</p>,
    },
    {
      id: "accordion-flush-heading-3",
      title: (
        <span className="content-heading">
          <span className="content-heading-label">{t("FAQ_QUES_3")}</span>
        </span>
      ),
      content: <p className="mb-2 content-description">{t("FAQ_ANS_3")}</p>,
    },
  ];

  return (
    <div id="accordion-flush" className="accordion-flush">
      {accordionItems.map((item, index) => (
        <div key={item.id} className="accordion-item">
          <h4 id={item.id}>
            <button
              type="button"
              className={`accordion-button ${
                activeIndex === index ? "active" : ""
              }`}
              onClick={() => toggleAccordion(index)}
              aria-expanded={activeIndex === index}
              aria-controls={`${item.id}-body`}
            >
              <span>{item.title}</span>
              <ChevronIcon />
            </button>
          </h4>
          <div
            id={`${item.id}-body`}
            className={`accordion-content ${
              activeIndex === index ? "open" : ""
            }`}
            aria-labelledby={item.id}
          >
            <div className="accordion-content-inner">{item.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
export default DI(FAQs);
