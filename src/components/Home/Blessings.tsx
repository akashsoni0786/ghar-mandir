import { BookIcon, CareerIcon, ChildIcon, LadduPlate, LoveIcon, OmIcon, Swastik, Temple2Icon } from "@/assets/svgs";

const Blessings = () => {
  const data = [
    {
      icon: <OmIcon className="blessing-item--icon" />,
      label: "Peace Mind",
    },
    {
      icon: <ChildIcon className="blessing-item--icon" />,
      label: "Child Blessing",
    },
    
    {
      icon: <LoveIcon className="blessing-item--icon" />,
      label: "Marriage Harmony",
    },
    {
      icon: <CareerIcon className="blessing-item--icon" />,
      label: "Career Growth",
    },
  ];
  
  return (
    <div className="upcoming-events ph-mob-16">
      <div>
        <h3 className="upcoming-events--heading">
          Find spiritual answers to life's challenges
        </h3>
        <p className="upcoming-events--description">
          Here to guide you through your challenges
        </p>
      </div>
      <div className="blessing-container">
        <div className="blessing">
          {data.map((item, idx) => (
            <div className="blessing-item" key={idx}>
              {item.icon}
              <p className="blessing-item--label">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Blessings;