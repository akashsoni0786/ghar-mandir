import "./Home.css";
const TrustedDevoteesCount = () => {
  return (
    <div className="upcoming-events">
      <div>
        <h3 className="upcoming-events--heading">
          Trusted by Over 50 Thousand Devotees
        </h3>
        <p className="upcoming-events--description">
          India’s Leading Online Puja & Chadhava Platform
        </p>
      </div>
      <div className="devotees-datas">
        <div className="devotees-data">
          <label className="devotees-data--label">
            Puja and Chadhava offered
          </label>
          <p className="devotees-data--count">20,00,000+</p>
        </div>
        <div className="devotees-data">
          <label className="devotees-data--label">Trusted Users </label>
          <p className="devotees-data--count">50,000+</p>
        </div>
        <div className="devotees-data">
          <label className="devotees-data--label">
            Associated number of Temples
          </label>
          <p className="devotees-data--count">1,00,000+</p>
        </div>
      </div>
    </div>
  );
};
export default TrustedDevoteesCount;
