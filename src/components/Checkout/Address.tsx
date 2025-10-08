import { WhatsappColoredIcon } from "@/assets/svgs";
import TextField from "../Common/TextField";
import { useState, useEffect } from "react";
import { Edit, XCircle } from "react-feather";
import {
  generateId,
  getCurrencyName,
  getSign,
  hasOfferingsWithCountOrMultiplePujas,
  needForMemberAndPitruNames,
  needOfAddresss,
  needOfNormalNames,
  needOfPitruNames,
  trimObjectToCount,
  validateAddressField,
  validateEmail,
  validateGotra,
  validateMember,
  validateName,
  validatePhone,
} from "@/constants/commonfunctions";
import useDebounce from "@/customHooks/useDebounce";
import { DI } from "@/core/DependencyInjection";
import { urlFetchCalls } from "@/constants/url";
import { DIProps } from "@/core/DI.types";
import AlertBox from "../Common/AlertBox/AlertBox";
import useTrans from "@/customHooks/useTrans";

const {
  POST: { pooja_city, leads_addLead },
} = urlFetchCalls;

interface AddressData {
  phone_no: string;
  phone_code: string;
  username: string; // Added username property
  members: Record<string, string>;
  gotra: string;
  gotra_not_know: boolean;
  address: {
    street_address: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  prayer: string;
  email: string;
  pitruNames: any;
}

interface AddressProps extends DIProps {
  userData: AddressData;
  setUserdata: (e: any) => void;
  errors: any;
  setErrors: (e: any) => void;
  packageData: any;
  showAddress: boolean;
  cartData: any;
  cartArray?: any;
}

const Address = (props: AddressProps) => {
  const {
    userData,
    setUserdata,
    setErrors,
    errors,
    request,
    packageData,
    showAddress,
    toast,
    cartData,
    redux,
    cartArray,
  } = props;
  const currency = getSign();
  const currency_name = getCurrencyName();
  const t = useTrans(redux?.common?.language);
  const [loading, setLoading] = useState(false);
  const [checkPitruName, setCheckPitruName] = useState(0);
  const [checkNormalName, setCheckNormalName] = useState(0);
  const [checkOnlyPitruName, setCheckOnlyPitruName] = useState(false);
  const debouncedPincode = useDebounce(userData?.address?.pincode, 500);
  useEffect(() => {
    if (debouncedPincode.length === 6 && /^\d+$/.test(debouncedPincode)) {
      fetchCityState(debouncedPincode);
    }
  }, [debouncedPincode]);
  const debouncedName = useDebounce(userData?.username, 3000);
  const debouncedMonNo = useDebounce(userData?.phone_no, 3000);
  
  useEffect(() => {
    const mobCheck = validatePhone(debouncedMonNo, userData?.phone_code, t);
    if (
      !mobCheck &&
      (!redux?.auth?.authToken || redux?.auth?.authToken == "")
    ) {
      handleLeadData(
        debouncedName,
        `${userData?.phone_code}-${debouncedMonNo}`
      );
    }
  }, [debouncedName, debouncedMonNo, userData?.phone_code]);

  const fetchCityState = async (pincode: string) => {
    setLoading(true);
    request
      ?.POST?.(pooja_city, {
        pincode: parseInt(pincode),
      })
      .then((res: any) => {
        if (res?.data) {
          setUserdata((prev) => ({
            ...prev,
            address: {
              ...prev.address,
              city: res?.data?.district || "",
              state: res?.data?.statename || "",
            },
          }));
        } else {
          toast?.show(t("CITY_NOT_FOUND"), "error");
        }
      })
      .catch((error: any) => {
        console.error("Error fetching city/state:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleLeadData = async (name: string, mobileNumber: string) => {
    request
      ?.POST?.(leads_addLead, {
        mobileNumber: mobileNumber,
        userName: name,
        cart: cartArray,
      })
      .catch((error: any) => {
        console.error("Lead data issue : ", error);
      });
  };
  const addMember = () => {
    const checkType = needOfNormalNames(cartData);
    const currentCount = Object.keys(userData?.members ?? {}).length;
    const packageLimit = packageData?.member || 1;

    if (currentCount >= packageLimit && checkType == 2) {
      return; // Don't allow adding more than package limit
    }
    const id = generateId();
    const tempData = structuredClone(userData);
    tempData.members[id] = "";
    setUserdata(tempData);

    setErrors((prev: any) => ({
      ...prev,
      members: {
        ...prev.members,
        [id]: "",
      },
    }));
  };
  const addPitru = () => {
    const checkType = needOfPitruNames(cartData);
    const currentCount = Object.keys(userData?.pitruNames ?? {}).length;
    const packageLimit = packageData?.pitruNamesCount || 1;

    if (currentCount >= packageLimit && checkType == 2) {
      return; // Don't allow adding more than package limit
    }

    const id = generateId();
    const tempData = structuredClone(userData);
    tempData.pitruNames[id] = "";
    setUserdata(tempData);

    setErrors((prev: any) => ({
      ...prev,
      pitruNames: {
        ...prev.members,
        [id]: "",
      },
    }));
  };
  const removePitru = (id: string) => {
    const checkType = needOfPitruNames(cartData);
    const packageType = userData?.pitruNames;
    // For Individual (1), Couple (2), don't allow removal
    if (packageType.length === 1 && checkType == 2) {
      return;
    }

    const tempData = structuredClone(userData);
    delete tempData.pitruNames[id];
    setUserdata(tempData);

    setErrors((prev: any) => {
      const newErrors = { ...prev.pitruNames };
      delete newErrors[id];
      return {
        ...prev,
        pitruNames: newErrors,
      };
    });
  };
  const removeMember = (id: string) => {
    const packageType = packageData?.member;

    // For Individual (1), Couple (2), don't allow removal
    if (packageType.length === 1 && cartData.Puja?.length > 0) {
      return;
    }

    const tempData = structuredClone(userData);
    delete tempData.members[id];
    setUserdata(tempData);

    setErrors((prev: any) => {
      const newErrors = { ...prev.members };
      delete newErrors[id];
      return {
        ...prev,
        members: newErrors,
      };
    });
  };

  useEffect(() => {
    const result = needOfPitruNames(cartData);
    const normalRes = needOfNormalNames(cartData);
    setCheckNormalName(normalRes);
    setCheckPitruName(result);
    setUserdata((prev: any) => ({
      ...prev,
      pitruNames: result ? prev.pitruNames : {},
      members: checkOnlyPitruName ? {} : prev.members,
    }));

    setCheckOnlyPitruName(needForMemberAndPitruNames(cartData));
  }, [cartData]);
  return (
    <div className="checkout-userData">
      {/* Whatsapp number Section */}
      <div className="checkout-userData--member">
        <div className="checkout-userData--member-headingwrap">
          <h4 className="checkout-userData--member-heading">
            {t("ENTER_WHATSAPP_DETAILS")}
          </h4>
          <p className="checkout-userData--member-subheading">
            {t("WILL_BE_USED_FOR_SENDING_VIDEO_OF_SEVA")}
          </p>
        </div>

        <div className="checkout-userData--member-textfield checkout-userData--whatsapp-textfield">
          <TextField
            maxLength={10}
            value={userData.phone_no ?? ""}
            onChange={(e) => {
              setUserdata((prev: any) => ({
                ...prev,
                phone_no: e,
              }));
              setErrors((prev: any) => ({
                ...prev,
                phone_no: validatePhone(e, userData?.phone_code, t),
              }));
            }}
            withIcon={true}
            iconPosition="both"
            icon={<WhatsappColoredIcon />}
            // rightIcon={<Edit color="#AF1E2E" />}
            type="tel"
            helperText={errors.phone_no}
            error={errors.phone_no}
            required
            countryCode={
              userData?.phone_code ?? (currency_name == "USD" ? "+1" : "+91")
            }
            onCountryCodeChange={(val) => {
              setUserdata((prev: any) => ({
                ...prev,
                phone_code: val,
              }));
            }}
            placeholder={t("ENTER_MOBILE_NUMBER")}
          />
        </div>
      </div>

      {/* Email Section */}
      {currency_name == "USD" && (
        <div className="checkout-userData--member">
          <div className="checkout-userData--member-headingwrap">
            <h4 className="checkout-userData--member-heading">
              {t("ENTER_EMAIL")}
            </h4>
            {/* <p className="checkout-userData--member-subheading">
            {t("WILL_BE_RICTED_DURING_SEVA")}
          </p> */}
          </div>

          <div className="checkout-userData--member-textfield">
            <TextField
              value={userData?.email ?? ""}
              type="email"
              error={!!errors.email}
              helperText={errors.email}
              placeholder={t("ENTER_EMAIL")}
              onChange={(e) => {
                setUserdata((prev: any) => ({
                  ...prev,
                  email: e,
                }));
                setErrors((prev: any) => ({
                  ...prev,
                  email: validateEmail(e, t),
                }));
              }}
            />
          </div>
        </div>
      )}

      {/* Name Section */}
      <div className="checkout-userData--member">
        <div className="checkout-userData--member-headingwrap">
          <h4 className="checkout-userData--member-heading">
            {t("ENTER_YOUR_NAME")}
          </h4>
          <p className="checkout-userData--member-subheading">
            {t("WILL_BE_RICTED_DURING_SEVA")}
          </p>
        </div>

        <div className="checkout-userData--member-textfield">
          <TextField
            placeholder={t("ENTER_YOUR_NAME")}
            value={userData.username ?? ""}
            onChange={(e) => {
              setUserdata((prev: any) => ({
                ...prev,
                username: e,
              }));
              setErrors((prev: any) => ({
                ...prev,
                username: validateName(e, t),
              }));
            }}
            error={errors.username}
            helperText={errors.username}
          />
        </div>
      </div>

      {/* Pitru Section */}
      {(checkPitruName == 1 ||
        (packageData?.pitruNamesCount > 1 && checkPitruName == 2)) && (
        <div className="checkout-userData--member">
          <div className="checkout-userData--member-headingwrap">
            <h4 className="checkout-userData--member-heading">
              {checkPitruName == 1
                ? `Pitru Names - ${currency}${
                    currency_name == "INR" ? "50" : "5"
                  }`
                : "Pitru Names"}
            </h4>
            <p className="checkout-userData--member-subheading">
              Seva will be performed for pitru names
            </p>
          </div>

          {Object.keys(userData.pitruNames).length == 0 &&
          checkPitruName == 1 ? (
            <div style={{ paddingTop: "16px" }}>
              <AlertBox
                type="warning"
                // closable
                onClose={() => {
                  // setAlertShow(false);
                }}
              >
                {t("ADD_PITRU_WITH_50_RUPEE")}.
              </AlertBox>
            </div>
          ) : (
            Object.keys(userData.pitruNames).map((item: any) => {
              const showRemoveButton =
                Object.keys(userData.pitruNames).length !== 1;
              return (
                <div className="checkout-userData--member-textfield" key={item}>
                  <TextField
                    placeholder={"Enter Pitru Name"}
                    value={userData?.pitruNames[item]}
                    onChange={(e: any) => {
                      setUserdata((prev: any) => ({
                        ...prev,
                        pitruNames: {
                          ...userData?.pitruNames,
                          [item]: e,
                        },
                      }));
                      setErrors((prev: any) => ({
                        ...prev,
                        pitruNames: {
                          ...prev.pitruNames,
                          [item]: validateMember(e, t),
                        },
                      }));
                    }}
                    withIcon={true}
                    iconPosition="right"
                    icon={
                      checkPitruName == 1 ||
                      (checkPitruName == 2 && showRemoveButton) ? (
                        <span onClick={() => removePitru(item)}>
                          <XCircle color="#AF1E2E" cursor={"pointer"} />
                        </span>
                      ) : (
                        <span>
                          <XCircle color="#D18F96" cursor={"not-allowed"} />
                        </span>
                      )
                    }
                    error={errors.pitruNames[item]}
                    helperText={errors.pitruNames[item]}
                  />
                </div>
              );
            })
          )}
          {checkPitruName == 1 &&
            Object.keys(userData.pitruNames).length > 0 && (
              <label className="checkout-userData--member-checkbox-label">
                {t("ADD_PITRU_WITH_50_RUPEE")}
              </label>
            )}

          {/* Show "Add member" button only for 4 and 6+ members when not at max */}
          {checkPitruName == 1 ||
          (checkPitruName == 2 &&
            Object.keys(userData.pitruNames)?.length <
              (packageData?.pitruNamesCount ?? 1) - 1) ? (
            <div className="checkout-userData--member-addmorebtn">
              <div
                className="checkout-package--pricebox-btn"
                onClick={addPitru}
              >
                +Add Pitru
              </div>
            </div>
          ) : (
            <></>
          )}
        </div>
      )}

      {/* Member Section */}
      {checkNormalName > 0 &&
        ((checkNormalName == 2 && packageData.member > 1) ||
          checkNormalName == 1) && (
          <div className="checkout-userData--member">
            <div className="checkout-userData--member-headingwrap">
              <h4 className="checkout-userData--member-heading">
                {checkNormalName == 1
                  ? `${t("ADD_FAMILY_MEMBER")} - ${currency}${
                      currency_name == "INR" ? "50" : "5"
                    }`
                  : t("MEMBER_PARTICIPATING")}
              </h4>
              <p className="checkout-userData--member-subheading">
                {t("SEVA_PERFORM_BY_THIS_NAME")}
              </p>
            </div>

            {Object.keys(userData.members).length == 0 &&
            checkNormalName == 1 ? (
              <div style={{ paddingTop: "16px" }}>
                <AlertBox
                  type="warning"
                  // closable
                  onClose={() => {
                    // setAlertShow(false);
                  }}
                >
                  {t("ADD_MEMBER_WITH_50_RUPEE")}.
                </AlertBox>
              </div>
            ) : (
              Object.keys(userData.members).map((item: any) => {
                const showRemoveButton =
                  Object.keys(userData.members).length !== 1;
                return (
                  <div
                    className="checkout-userData--member-textfield"
                    key={item}
                  >
                    <TextField
                      placeholder={t("ENTER_FAMILY_MEMBER_NAME")}
                      value={userData?.members[item]}
                      onChange={(e: any) => {
                        setUserdata((prev: any) => ({
                          ...prev,
                          members: {
                            ...userData?.members,
                            [item]: e,
                          },
                        }));
                        setErrors((prev: any) => ({
                          ...prev,
                          members: {
                            ...prev.members,
                            [item]: validateMember(e, t),
                          },
                        }));
                      }}
                      withIcon={true}
                      iconPosition="right"
                      icon={
                        checkNormalName == 1 ||
                        (checkNormalName == 2 && showRemoveButton) ? (
                          <span onClick={() => removeMember(item)}>
                            <XCircle color="#AF1E2E" cursor={"pointer"} />
                          </span>
                        ) : (
                          <span>
                            <XCircle color="#D18F96" cursor={"not-allowed"} />
                          </span>
                        )
                      }
                      error={errors.members[item]}
                      helperText={errors.members[item]}
                    />
                  </div>
                );
              })
            )}
            {checkNormalName == 1 &&
              Object.keys(userData.members ?? [])?.length > 0 && (
                <label className="checkout-userData--member-checkbox-label">
                  {t("ADD_MEMBER_WITH_50_RUPEE")}
                </label>
              )}

            {/* Show "Add member" button only for 4 and 6+ members when not at max */}
            {checkNormalName == 1 ||
            (Object.keys(userData.members)?.length <
              (packageData?.member ?? 1) - 1 &&
              checkNormalName == 2) ? (
              <div className="checkout-userData--member-addmorebtn">
                <div
                  className="checkout-package--pricebox-btn"
                  onClick={addMember}
                >
                  {t("ADD_MEMBER")}
                </div>
              </div>
            ) : (
              <></>
            )}
          </div>
        )}

      {/* Gotra Section */}
      {hasOfferingsWithCountOrMultiplePujas(cartData) && (
        <div className="checkout-userData--member">
          <div className="checkout-userData--member-headingwrap">
            <h4 className="checkout-userData--member-heading">
              {t("GOTRA_OF_MEBMBER")}
            </h4>
            <p className="checkout-userData--member-subheading">
              {t("WILL_BE_RICTED_DURING_SEVA")}
            </p>
          </div>

          <div className="checkout-userData--member-textfield">
            <TextField
              placeholder={t("ENTER_GOTRA")}
              value={userData.gotra ?? ""}
              onChange={(e) => {
                setUserdata((prev: any) => ({
                  ...prev,
                  gotra: e,
                }));
                setErrors((prev: any) => ({
                  ...prev,
                  gotra: validateGotra(e),
                }));
              }}
              disabled={userData.gotra_not_know}
              error={errors.gotra}
              helperText={errors.gotra}
            />
          </div>
          <div className="checkout-userData--member-checkbox">
            <input
              checked={userData?.gotra_not_know ?? false}
              type="checkbox"
              className="checkout-userData--member-checkbox-box"
              onChange={(e) => {
                const isChecked = e.target.checked;
                setUserdata((prev: any) => ({
                  ...prev,
                  gotra_not_know: isChecked,
                  gotra: "Kashyap",
                }));
              }}
            />
            <label className="checkout-userData--member-checkbox-label">
              {t("NOT_KNOW_GOTRA")}
            </label>
          </div>
        </div>
      )}

      {/* Address Section */}
      {showAddress && (
        <div className="checkout-userData--member">
          <div className="checkout-userData--member-headingwrap">
            <h4 className="checkout-userData--member-heading">
              {t("ADDRESS")}
            </h4>
            <p className="checkout-userData--member-subheading">
              {t("ADDRESS_DESC")}
            </p>
          </div>

          <div className="checkout-userData--member-address">
            <TextField
              heading={t("STREET_ADDRESS")}
              placeholder={t("HOUSE_NUMBER_STREET_NAME")}
              value={userData.address.street_address}
              onChange={(e) => {
                setUserdata((prev: any) => ({
                  ...prev,
                  address: {
                    ...prev.address,
                    street_address: e,
                  },
                }));
                setErrors((prev: any) => ({
                  ...prev,
                  address: {
                    ...prev.address,
                    street_address: validateAddressField(
                      e,
                      "Street address",
                      t
                    ),
                  },
                }));
              }}
              error={errors.address.street_address}
              helperText={errors.address.street_address}
            />

            <TextField
              heading={t("POSTAL_CODE")}
              placeholder={t("POSTAL_CODE")}
              type="number"
              value={userData?.address?.pincode ?? ""}
              isLoading={loading}
              onChange={(e) => {
                const numericValue = e.replace(/\D/g, "").slice(0, 6);
                setUserdata((prev: any) => ({
                  ...prev,
                  address: {
                    ...prev.address,
                    pincode: numericValue,
                  },
                }));
                setErrors((prev: any) => ({
                  ...prev,
                  address: {
                    ...prev.address,
                    pincode: validateAddressField(
                      numericValue,
                      "Postal code",
                      t
                    ),
                  },
                }));
              }}
              error={errors.address.pincode}
              helperText={errors.address.pincode}
              maxLength={6}
              disabled={loading}
              withIcon={loading}
              iconPosition="right"
            />

            <div className="divide-into-50">
              <div className="divide-into-50-item">
                <TextField
                  heading={t("TOWN_CITY")}
                  placeholder={t("ENTER_CITY")}
                  value={userData?.address?.city ?? ""}
                  onChange={(e) => {
                    setUserdata((prev: any) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        city: e,
                      },
                    }));
                    setErrors((prev: any) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        city: validateAddressField(e, "City", t),
                      },
                    }));
                  }}
                  error={errors.address.city}
                  helperText={errors.address.city}
                />
              </div>

              <div className="divide-into-50-item">
                <TextField
                  heading={t("STATE_REGION")}
                  placeholder={t("ENTER_STATE")}
                  value={userData?.address?.state ?? ""}
                  onChange={(e) => {
                    setUserdata((prev: any) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        state: e,
                      },
                    }));
                    setErrors((prev: any) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        state: validateAddressField(e, "State", t),
                      },
                    }));
                  }}
                  error={errors.address.state}
                  helperText={errors.address.state}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DI(Address);
