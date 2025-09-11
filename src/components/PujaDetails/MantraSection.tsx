import Image from "next/image";
import Panditji from "../../assets/images/panditji.png";
interface Props {
  poojaVidhi: any;
}
const MantraSection = ({ poojaVidhi }: Props) => {
  return (
    <div className=" mantra-section">
      <div className="mantra-container">
        <h4 className="mantra-heading">{poojaVidhi?.heading ?? ""}</h4>
        {poojaVidhi?.image ? (
          <img
            src={poojaVidhi?.image}
            alt="Descriptive text"
            className="mantra-image"
          />
        ) : (
          <Image
            src={Panditji}
            alt="Descriptive text"
            className="mantra-image"
          />
        )}
        <div className="mantra-text">
          <h3 className="mantra-text--heading">{poojaVidhi?.heading ?? ""}</h3>

          {poojaVidhi?.vidhis?.length > 0 && (
            <div className="mantra-box">
              {poojaVidhi?.vidhis?.map((item,index) => (
                <div className="mantra-textContainer" key={`${index}-${item?.title ?? ""}`}>
                  <label className="mantra-textContainer--label">
                    {`${item?.title ?? ""}`}
                  </label>
                  <p className="mantra-textContainer--description">
                    {`${item?.description ?? ""}`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MantraSection;
