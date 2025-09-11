import { DarkBgButtonFw } from "../Common/Buttons";
interface Props {
    onClick?: () => void;
    name:string;
}
const BottomPopupButton = (props:Props) => {
    const { onClick, name } = props;
    return (
        <div className="bottom-popup">
            <div className="bottom-popup-details">
                <p className="bottom-popup-details--heading">Time Left for puja:</p>
                <p className="bottom-popup-details--time">2 Days | 2 Hrs | 30 Mins</p>
            </div>
            <div className="bottom-popup-button">
                <DarkBgButtonFw children={name} onClick={() => onClick && onClick()}/>
            </div>
        </div>
    );
};
export default BottomPopupButton;
