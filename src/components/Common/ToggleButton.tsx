const ToggleButton = ({label,onClick,check}:any) => {
  return (
    <div className="toggle-container">
      <label className="toggle-label">{label}</label>
      <label className="toggle-switch">
        <input checked={check} type="checkbox" className="toggle-input" onChange={onClick}/>
        <span className="toggle-slider"></span>
      </label>
    </div>
  );
};
export default ToggleButton;
