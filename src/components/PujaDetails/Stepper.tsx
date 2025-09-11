import {
  BoxIcon,
  ExamBoardIcon,
  KamalSvg,
  MonkIcon,
  PicVideoIcon,
} from "@/assets/svgs";
import { DI } from "@/core/DependencyInjection";
import { DIProps } from "@/core/DI.types";
import useTrans from "@/customHooks/useTrans";
import React from "react";

const Stepper = ({ redux }: DIProps) => {
  const t = useTrans(redux?.common?.language);
  const steps = [
    {
      title: t("HOW_WORK_HEAD_1"),
      description: t("HOW_WORK_DESC_1"),
      icon: <BoxIcon className="step-icon" />,
    },
    {
      title: t("HOW_WORK_HEAD_2"),
      description: t("HOW_WORK_DESC_2"),
      icon: <ExamBoardIcon className="step-icon" />,
    },
    {
      title: t("HOW_WORK_HEAD_3"),
      description: t("HOW_WORK_DESC_3"),
      icon: <MonkIcon className="step-icon" />,
    },
    {
      title: t("HOW_WORK_HEAD_4"),
      description: t("HOW_WORK_DESC_4"),
      icon: <PicVideoIcon className="step-icon" />,
    },
  ];

  return (
    <div className=" stepper-container">
      <div className="stepper-bg-svg">
        <KamalSvg />
      </div>
      {/* <h1 className="stepper-title">How it works?</h1> */}
      <div className="stepper">
        {steps.map((step, index) => (
          <div key={index} className="step-container">
            <div className="step">
              <div className="step-icon-container">{step.icon}</div>
              <div className="step-content">
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            </div>
            {index < steps.length - 1 && <div className="step-connector"></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DI(Stepper);
