import './Bookings.css';
const StatusBox = ({ status }: { status: string }) => {
  const GreenDot = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="9"
      viewBox="0 0 8 9"
      fill="none"
    >
      <circle cx="3.87017" cy="4.37187" r="3.2" fill="#5BA61A" />
    </svg>
  );
  const RedDot = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="8"
      height="9"
      viewBox="0 0 8 9"
      fill="none"
    >
      <circle cx="3.87017" cy="4.37187" r="3.2" fill="#D64724" />
    </svg>
  );
  return (
    <div
      className={`booking-boxes--item--status ${
        status == "Active" ? "active" : "completed"
      }`}
    >
      {status == "Active" ? <GreenDot /> : <RedDot />}
      <p className="booking-boxes--item--status--text">{status}</p>
    </div>
  );
};
export default StatusBox;