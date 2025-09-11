import { Calendar, Edit } from "react-feather";
import TextField from "../Common/TextField";
import { WhatsappColoredIcon } from "@/assets/svgs";
import RadioButton from "../Common/RadioButton";
import TimePicker from "../Common/TimePicker";
import useTrans from "@/customHooks/useTrans";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
interface Props extends DIProps {
  userData: any;
  onChange: any;
  errors: any;
}
const PersonalDetails = ({ userData, onChange, errors, redux }: Props) => {
  const t = useTrans(redux?.common?.language); // Ensure redux is passed if needed

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split("/");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
  };

  return (
    <div className="profile-personalDetails-form ph-16">
      <div className="profile-flex-wrap">
        <span className="max-width-field">
          <TextField
            heading={t("FULL_NAME")}
            value={userData?.name ?? ""}
            onChange={(val) => onChange("name", val)}
            error={!!errors.name}
            helperText={errors.name}
            required
            placeholder={t("ENTER_FULL_NAME")}
          />
        </span>
        <span className="max-width-field">
          <TextField
            heading={t("GOTRA")}
            placeholder={t("ENTER_GOTRA")}
            value={userData?.gotra ?? ""}
            onChange={(val) => onChange("gotra", val)}
          />
        </span>
      </div>
      <div className="profile-flex-wrap">
        <span className="max-width-field">
          <RadioButton
            label={t("GENDER")}
            options={[
              { label: t("MALE"), value: "Male" },
              { label: t("FEMALE"), value: "Female" },
              { label: t("OTHER"), value: "Other" },
            ]}
            selectedValue={userData?.gender ?? ""}
            onChange={(val) => onChange("gender", val)}
            direction="horizontal"
            error={errors.gender}
          />
          {errors.gender && (
            <p
              className="error-text"
              style={{
                marginTop: 5,
                marginBottom: 10,
                color: "#AF1E2E",
                fontSize: "12px",
              }}
            >
              {errors.gender}
            </p>
          )}
        </span>
        <span className="max-width-field">
          <RadioButton
            label={t("MARITAL_STATUS")}
            options={[
              { label: t("MARRIED"), value: "Married" },
              { label: t("UNMARRIED"), value: "Unmarried" },
            ]}
            selectedValue={userData?.maritalStatus ?? ""}
            onChange={(val) => onChange("maritalStatus", val)}
            direction="horizontal"
          />
        </span>
      </div>

      <div className="profile-flex-wrap">
        <span className="max-width-field">
          <TextField
            heading={t("MOBILE_NUMBER")}
            value={userData?.mobileNo ?? ""}
            onChange={(val) => onChange("mobileNo", val)}
            withIcon={true}
            iconPosition="both"
            icon={<WhatsappColoredIcon />}
            rightIcon={<Edit color="#AF1E2E" />}
            type="tel"
            error={!!errors.mobileNo}
            helperText={errors.mobileNo}
            required
            countryCode={userData?.countryCode ?? "+91"}
            onCountryCodeChange={(val) => onChange("countryCode", val)}
            placeholder={t("ENTER_MOBILE_NUMBER")}
          />
        </span>
        <span className="max-width-field">
          <TextField
            heading={t("EMAIL")}
            value={userData?.email ?? ""}
            onChange={(val) => onChange("email", val)}
            type="email"
            error={!!errors.email}
            helperText={errors.email}
            required
            placeholder={t("ENTER_EMAIL")}
          />
        </span>
      </div>

      <div className="profile-flex-wrap">
        <span className="max-width-field">
          <TextField
            heading={t("BIRTH_DATE")}
            type="date"
            value={formatDateForInput(userData?.birthDate) ?? ""}
            onChange={(val) => onChange("birthDate", val)}
            customCalendarIcon={<Calendar color="#AF1E2E" />}
            hideNativeCalendarIcon={true}
            inputId="birth-date-input"
            error={!!errors.birthDate}
            helperText={errors.birthDate}
            required
            placeholder={t("ENTER_BIRTH_DATE")}
          />
        </span>
        <span className="max-width-field">
          <TextField
            heading={t("PLACE_OF_BIRTH")}
            value={userData?.placeOfBirth ?? ""}
            onChange={(val) => onChange("placeOfBirth", val)}
            placeholder={t("ENTER_PLACE_OF_BIRTH")}
            required
            error={!!errors.placeOfBirth}
            helperText={errors.placeOfBirth}
          />
        </span>
      </div>

      <div className="profile-flex-wrap">
        <span className="max-width-field">
          <TimePicker
            heading={t("TIME_OF_BIRTH")}
            value={userData?.timeOfBirth ?? ""}
            onChange={(val) => onChange("timeOfBirth", val)}
            required
            error={!!errors.timeOfBirth}
            helperText={errors.timeOfBirth}
          />
        </span>
        {/* {userData?.maritalStatus === "Married" && (
          <span className="max-width-field">
            <TextField
              heading={t("ANNIVERSARY_DATE")}
              type="date"
              value={formatDateForInput(userData?.anniversaryDate) ?? ""}
              onChange={(val) => onChange("anniversaryDate", val)}
              customCalendarIcon={<Calendar color="#AF1E2E" />}
              hideNativeCalendarIcon={true}
              inputId="anniversary-date-input"
              placeholder={t("ENTER_ANNIVERSARY_DATE")}
            />
          </span>
        )} */}
      </div>
    </div>
  );
};
export default DI(PersonalDetails);
