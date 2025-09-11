import { DIProps } from "@/core/DI.types";
import TextField from "../Common/TextField";
import { DI } from "@/core/DependencyInjection";
import { urlFetchCalls } from "@/constants/url";
import { useEffect, useState } from "react";
import useDebounce from "@/customHooks/useDebounce";
import useTrans from "@/customHooks/useTrans";
interface Props extends DIProps {
  address: any;
  onChange: any;
  errors: any;
}
const {
  POST: { pooja_city },
} = urlFetchCalls;
const AddressDetails = ({
  address,
  onChange,
  errors,
  request,
  toast,
  redux,
}: Props) => {
  const t = useTrans(redux?.common?.language);
  const [loading, setLoading] = useState(false);
  const fetchCityState = async (pincode: string) => {
    setLoading(true);
    request
      ?.POST?.(pooja_city, {
        pincode: parseInt(pincode),
      })
      .then((res: any) => {
        if (res?.data) {
          onChange(
            "townCity",
            res?.data?.district || "",
            "stateRegion",
            res?.data?.statename || ""
          );
        } else {
          toast?.show(res?.message, "error");
        }
      })
      .catch((error: any) => {
        console.error("Error fetching city/state:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const debouncedPincode = useDebounce(address?.postalCode, 500);
  useEffect(() => {
    if (debouncedPincode?.length === 6 && /^\d+$/.test(debouncedPincode)) {
      fetchCityState(debouncedPincode);
    }
  }, [debouncedPincode]);
  return (
    <div className="profile-personalDetails-form ph-16">
      <div className="profile-flex-wrap">
        <span className="max-width-field">
          <TextField
            heading={t("STREET_ADDRESS")}
            value={address?.streetAddress ?? ""}
            onChange={(val: any) => onChange("streetAddress", val)}
            error={!!errors.streetAddress}
            helperText={errors.streetAddress}
            required
            placeholder={t("HOUSE_NUMBER_STREET_NAME")}
          />
        </span>
        <span className="max-width-field">
          <TextField
            heading={t("POSTAL_CODE")}
            value={address?.postalCode ?? ""}
            onChange={(val: any) => onChange("postalCode", val)}
            error={!!errors.postalCode}
            helperText={errors.postalCode}
            required
            placeholder={t("ENTER_POSTAL_CODE")}
          />
        </span>
      </div>
      <div className="profile-flex-wrap">
        <span className="max-width-field">
          <TextField
            heading={t("TOWN_CITY")}
            value={address?.townCity ?? ""}
            onChange={(val: any) => onChange("townCity", val)}
            error={!!errors.townCity}
            helperText={errors.townCity}
            required
            isLoading={loading}
            placeholder={t("ENTER_CITY")}
          />
        </span>
        <span className="max-width-field">
          <TextField
            heading={t("STATE_REGION")}
            value={address?.stateRegion ?? ""}
            onChange={(val: any) => onChange("stateRegion", val)}
            error={!!errors.stateRegion}
            helperText={errors.stateRegion}
            required
            isLoading={loading}
            placeholder={t("ENTER_STATE")}
          />
        </span>
      </div>
    </div>
  );
};
export default DI(AddressDetails);
