import { DI } from "@/core/DependencyInjection";
import TestimonialImage from "../PujaDetails/TestimonialImage";
import { static_review } from "@/commonvaribles/constant_variable";
import { DIProps } from "@/core/DI.types";
import useTrans from "@/customHooks/useTrans";
const DeevoteeExp = ({ redux }: DIProps) => {
  const t = useTrans(redux?.common?.language);
  // const [testimonial, setTestimonial] = useState([]);
  // useEffect(() => {
  //   if (request) {
  //     request.GET(devoteeExperience).then((res: any) => {
  //       if (res?.reviews) {
  //         setTestimonial(res?.reviews ?? []);
  //       }
  //     });
  //   }
  // }, []);
  return (
    <div className="upcoming-events">
      <div>
        <h3 className="upcoming-events--heading">{t("DEVOTEE_REVIEWS")}</h3>
      </div>
      <div className="whybookus-container">
        <div className="recommended-puja-rows ph-mob-1">
          {static_review?.map((item: any, idx) => (
            <TestimonialImage key={idx} data={item} />
          ))}
        </div>
      </div>
    </div>
  );
};
export default DI(DeevoteeExp);
