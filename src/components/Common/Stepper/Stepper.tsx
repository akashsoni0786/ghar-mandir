import "./Stepper.css";
import useWindow from "@/customHooks/useWindows";
const Stepper = ({steps}) => {
  const { width } = useWindow();
  // const steps = [
  //   {
  //     title: "Prasad has been packed",
  //     description: "Prasad with divine blessings has been packed",
  //     status: true,
  //   },
  //   {
  //     title: "Prasad is in transit",
  //     description: "",
  //     status: false,
  //   },
  //   {
  //     title: "Delivered",
  //     description: "(ETA by 3rd May by 6PM)",
  //     status: false,
  //   },
  // ];

  return (
    <div>
      <div className="tracker-container">
        {steps.map((step, index) => (
          <div key={index} className="tracker">
            <div className="tracker-icon">
              {step.status ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={width > 480 ? "42" : "24"}
                  height={width > 480 ? "42" : "24"}
                  viewBox={"0 0 42 42"}
                  fill="none"
                >
                  <path
                    d="M29.75 5.84481C32.3895 7.36881 34.5851 9.55573 36.1197 12.1891C37.6542 14.8224 38.4744 17.8109 38.499 20.8587C38.5236 23.9064 37.7518 26.9077 36.26 29.5655C34.7682 32.2233 32.6082 34.4454 29.9937 36.0119C27.3792 37.5783 24.4009 38.4348 21.3537 38.4964C18.3065 38.5581 15.296 37.8229 12.6202 36.3635C9.94448 34.9041 7.69627 32.7712 6.09817 30.176C4.50006 27.5807 3.60747 24.6131 3.50875 21.5668L3.5 20.9998L3.50875 20.4328C3.60676 17.4105 4.48621 14.4652 6.06137 11.8841C7.63653 9.30286 9.85364 7.17385 12.4966 5.70461C15.1395 4.23536 18.118 3.47601 21.1418 3.50058C24.1655 3.52515 27.1313 4.33281 29.75 5.84481ZM27.4872 16.2626C27.1859 15.9613 26.785 15.7803 26.3597 15.7535C25.9344 15.7268 25.514 15.8561 25.1772 16.1173L25.0128 16.2626L19.25 22.0236L16.9872 19.7626L16.8228 19.6173C16.486 19.3563 16.0656 19.2271 15.6405 19.2539C15.2153 19.2808 14.8145 19.4618 14.5132 19.763C14.212 20.0643 14.0309 20.4651 14.0041 20.8903C13.9773 21.3155 14.1065 21.7358 14.3675 22.0726L14.5128 22.2371L18.0128 25.7371L18.1772 25.8823C18.4842 26.1204 18.8616 26.2497 19.25 26.2497C19.6384 26.2497 20.0158 26.1204 20.3228 25.8823L20.4872 25.7371L27.4872 18.7371L27.6325 18.5726C27.8937 18.2359 28.023 17.8154 27.9963 17.3901C27.9696 16.9648 27.7886 16.5639 27.4872 16.2626Z"
                    fill="#5BA61A"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width={width > 480 ? "42" : "24"}
                  height={width > 480 ? "42" : "24"}
                  viewBox={"0 0 42 42"}
                  fill="none"
                >
                  <circle
                    cx="21"
                    cy="21"
                    r="16.5"
                    fill="white"
                    stroke="#999999"
                    strokeWidth="2"
                  />
                </svg>
              )}
            </div>
            <div className="tracker-content">
              <h3
                className={`tracker-title ${step.status ? "done-title" : ""}`}
              >
                {step.title}
              </h3>
              <p
                className={`tracker-description ${
                  step.status ? "done-desc" : ""
                } `}
              >
                {step.description}
              </p>
            </div>
             {index < steps.length - 1 && (
              <div className={`tracker-connector ${step.status ? "done-step" : ""}`}></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default Stepper;
