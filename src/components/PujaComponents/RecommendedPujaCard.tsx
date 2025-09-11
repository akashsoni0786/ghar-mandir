const RecommendedPujaCard = () => {
  return (
    <div
      className="card-viewdata"
      style={
        {
          "--card-bg-url":
            "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQA5-fE5HnZ6f_DfYe2J4hFLTDNFTycBA2nwQ&s')",
        } as React.CSSProperties
      }
    >
      <div className="card-viewdata--data">
        <div className="card-viewdata--title">
          For financial abundance,health and stability
        </div>
        <div className="card-viewdata--line"></div>
        <div className="card-viewdata--btn">View Details</div>
      </div>
    </div>
  );
};

export default RecommendedPujaCard;
