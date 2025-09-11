import "./Temple.css";
const MapData = () => {
  return (
    <div>
      <iframe
        className="full-width-map"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56666.32137192671!2d80.902408!3d26.8466937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd991f32b16b%3A0x93ccba8909978be7!2sLucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1717500000000!5m2!1sen!2sin"
        width="100%"
        height="300"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        title="Office Location"
      ></iframe>
    </div>
  );
};
export default MapData;
