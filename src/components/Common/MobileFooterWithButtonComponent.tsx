import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";

interface Props extends DIProps {
  left_section: React.ReactNode;
  right_section: React.ReactNode;
}

const MobileFooterWithButtonComponent = ({
  left_section,
  right_section,
}: Props) => {
  return (
    <div className={`package-selection-footer`}>
      <div className="container">
        <div className="package-selection-footer-data ">
          <div className="package-selection-footer--box" >{left_section}</div>
          <div className="package-selection-footer--button">
            {right_section}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DI(MobileFooterWithButtonComponent);
