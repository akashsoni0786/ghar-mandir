"use client";
import {
  ChevronIcon,
} from "@/assets/svgs";
import { useState } from "react";
interface Props {
  poojaBenifits: any;
  topBenefits: any;
}
export default function Accordion({ poojaBenifits, topBenefits }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div id="accordion-flush" className="accordion-flush">
      {poojaBenifits.map((item, index) => (
        <div key={`${index}-body`} className="accordion-item">
          <h2 id={item?.id}>
            <button
              type="button"
              className={`accordion-button ${
                activeIndex === index ? "active" : ""
              }`}
              onClick={() => toggleAccordion(index)}
              aria-expanded={activeIndex === index}
              aria-controls={`${item.id}-body`}
            >
              <span>
                <span className="content-heading">
                  {/* {topBenefits?.[index]?.image ? (
                    <img
                      className="benefit-icon"
                      src={topBenefits?.[index]?.image}
                      alt={item?.title}
                    />
                  ) : (
                    <span className="benefit-icon">{icons[index]}</span>
                  )} */}
                  <span className="content-heading-label">
                    {item?.title ?? ""}
                  </span>
                </span>
              </span>
              <ChevronIcon />
            </button>
          </h2>
          <div
            id={`${item?.id}-body`}
            className={`accordion-content ${
              activeIndex === index ? "open" : ""
            }`}
            aria-labelledby={item?.id}
          >
            <div className="accordion-content-inner">
              <p className="mb-2 content-description">
                {item?.description ?? ""}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
