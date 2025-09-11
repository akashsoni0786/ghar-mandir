// components/Accordion.jsx
"use client";

import { useState } from "react";

const AccordionComponent = ({ title, children, defaultOpen }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="accordion-item">
      <button
        className="accordion-header"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="accordion-header-content">
          <span className="accordion-title">{title}</span>
          <svg
            className={`accordion-icon ${isOpen ? "open" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>
      <div className={`accordion-content ${isOpen ? "open" : ""}`}>
        <div className="accordion-body">{children}</div>
      </div>

      <style jsx>{`
        .accordion-item {
          width: 100%;
          margin-bottom: 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .accordion-item:hover {
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }

        .accordion-header {
          width: 100%;
          padding: 16px 20px;
          text-align: left;
          background-color: #f7fafc;
          border: none;
          cursor: pointer;
          transition: background-color 0.2s ease;
          outline: none;
        }

        .accordion-header:hover {
          background-color: #edf2f7;
        }

        .accordion-header:focus {
          box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.5);
        }

        .accordion-header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .accordion-title {
          font-weight: 600;
          color: #2d3748;
          font-size: 16px;
        }

        .accordion-icon {
          width: 20px;
          height: 20px;
          color: #718096;
          transition: transform 0.3s ease;
        }

        .accordion-icon.open {
          transform: rotate(180deg);
        }

        .accordion-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease, opacity 0.3s ease;
          opacity: 0;
        }

        .accordion-content.open {
          max-height: max-content;
          opacity: 1;
        }

        .accordion-body {
        //   padding: 20px;
          background-color: #ffffff;
          color: #4a5568;
          line-height: 1.6;
        }

        @media (max-width: 640px) {
          .accordion-header {
            padding: 14px 16px;
          }

          .accordion-title {
            font-size: 15px;
          }

          .accordion-body {
            // padding: 16px;
          }
        }
      `}</style>
    </div>
  );
};

AccordionComponent.defaultProps = {
  title: "Accordion Title",
  children:
    "This is the accordion content. You can put any React component or text here.",
  defaultOpen: false,
};

export default AccordionComponent;
