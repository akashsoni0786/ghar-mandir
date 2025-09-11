import { useState, useRef, useEffect } from "react";
import { DarkBgButton, DarkBgButtonFw } from "../Common/Buttons";
import "./Profile.css";
import PersonalDetails from "./PersonalDetails";
import AddressDetails from "./AddressDetails";
import MemberDetails from "./MemberDetails";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "react-feather";
import OverlayLoading from "../Common/Loadings/OverlayLoading";
import { urlFetchCalls } from "@/constants/url";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import { environment } from "@/environment/environment";
import {
  uploadImage,
  validateName,
  validatePhone,
} from "@/constants/commonfunctions";
import {
  button_event,
  pageview_event,
  save_event,
} from "@/constants/eventlogfunctions";
import useTrans from "@/customHooks/useTrans";
import { pushToDataLayerWithoutEvent } from "@/lib/gtm";
import { updateVideo } from "@/store/slices/commonSlice";
import { videoSource } from "@/commonvaribles/constant_variable";
import { updateProfileImage } from "@/store/slices/authSlice";

const {
  GET: { users_getUserProfile },
  POST: { users_updateProfile },
} = urlFetchCalls;

const Profile = ({ request, toast, redux, location, dispatch }: DIProps) => {
  const t = useTrans(redux?.common?.language);
  const user_pic =
    "https://media.istockphoto.com/id/1131164548/vector/avatar-5.jpg?s=612x612&w=0&k=20&c=CK49ShLJwDxE4kiroCR42kimTuuhvuo2FH5y_6aSgEo=";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [profileImage, setProfileImage] = useState<string>(user_pic);
  const [userData, setUserData] = useState({
    userId: "",
    mobileNo: "",
    timeOfBirth: "",
    address: {
      streetAddress: "",
      townCity: "",
      stateRegion: "",
      postalCode: "",
    },
    birthDate: "",
    email: "",
    familyMembers: [""],
    name: "",
    gender: "Male",
    maritalStatus: "Unmarried",
    placeOfBirth: "",
    profileImage: "",
    countryCode: "+91",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [loading]);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast?.show(t("IMAGE_FILE_ERROR"), "error");
      setErrors((prev) => ({
        ...prev,
        profileImage: t("IMAGE_FILE_ERROR"),
      }));
      return;
    }

    try {
      setUploading(true);
      const imageUrl = await uploadImage(
        environment?.API_ENDPOINT,
        toast,
        file
      );
      setProfileImage(imageUrl ?? user_pic);
      setUserData((prev) => ({ ...prev, profileImage: imageUrl }));
      setErrors((prev) => ({ ...prev, profileImage: "" }));
    } catch (error) {
      console.error("Upload error:", error);
      toast?.show(t("IMAGE_UPLOAD_ERROR"), "error");
      setErrors((prev) => ({
        ...prev,
        profileImage: t("IMAGE_UPLOAD_ERROR"),
      }));
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = (field: string, value: string | string[]) => {
    setUserData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleAddressChange = (
    field: string,
    value: string,
    field2?: string,
    value2?: string
  ) => {
    setUserData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        ...(field2 ? { [field]: value, [field2]: value2 } : { [field]: value }),
      },
    }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Personal details validation
    if (!userData.name?.trim()) newErrors.name = t("NAME_REQUIRED");
    else if (validateName(userData.name, t) != "")
      newErrors.name = validateName(userData.name, t);
    if (!userData.email?.trim()) newErrors.email = t("EMAIL_REQUIRED");
    else if (!/^\S+@\S+\.\S+$/.test(userData.email))
      newErrors.email = t("INVALID_EMAIL");

    if (!userData.mobileNo?.trim()) {
      newErrors.mobileNo = t("PHONE_REQUIRED");
    } else if (validatePhone(userData.mobileNo, userData.countryCode, t).trim())
      newErrors.mobileNo = validatePhone(
        userData.mobileNo,
        userData.countryCode,
        t
      );

    if (!userData.birthDate?.trim())
      newErrors.birthDate = t("BIRTHDATE_REQUIRED");
    if (!userData.gender?.trim()) newErrors.gender = t("GENDER_REQUIRED");
    if (!userData.placeOfBirth?.trim())
      newErrors.placeOfBirth = t("BIRTHPLACE_REQUIRED");
    if (!userData.timeOfBirth?.trim())
      newErrors.timeOfBirth = t("BIRTHTIME_REQUIRED");

    // Address validation
    if (!userData.address.streetAddress?.trim())
      newErrors.streetAddress = t("STREET_REQUIRED");
    if (!userData.address.postalCode?.trim()) {
      newErrors.postalCode = t("POSTALCODE_REQUIRED");
    } else if (!/^\d{6}$/.test(userData.address.postalCode)) {
      newErrors.postalCode = t("INVALID_POSTALCODE");
    }
    if (!userData.address.townCity?.trim())
      newErrors.townCity = t("CITY_REQUIRED");
    if (!userData.address.stateRegion?.trim())
      newErrors.stateRegion = t("STATE_REQUIRED");

    // Family members validation
    const emptyMembers =
      userData.familyMembers?.filter((member) => !member?.trim()) ?? [];
    const invalidNameMembers =
      userData.familyMembers?.filter(
        (member) => member?.trim() && member?.trim()?.length > 20
      ) ?? [];

    if (emptyMembers.length > 0) {
      newErrors.familyMembers = t("FAMILY_MEMBER_NAME_REQUIRED");
    }
    if (invalidNameMembers.length > 0) {
      newErrors.familyMembers = t("MEMBER_SHDNT_EMPTY_EXCEED_20_CHAR");
    }
    console.log({ newErrors });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    setShowErrors(true);
    const isValid = validateForm();
    if (!isValid) {
      toast?.show(t("PLZ_FILL_REQ_FIELD"), "error");
      const eventbtn = button_event(
        "Save Profile",
        "Profile : Form Submission",
        "Save Profile",
        { additionalData: userData }
      );
      save_event(redux?.auth?.authToken, location ?? "Profile", [eventbtn]);

      const firstErrorKey = Object.keys(errors)[0];
      if (firstErrorKey) {
        const element = document.querySelector(
          `[data-error-field="${firstErrorKey}"]`
        );
        element?.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    setLoading(true);
    try {
      const dataToSave = {
        ...userData,
        profileImage: userData.profileImage || profileImage,
      };

      if (request) {
        await request
          .POST(users_updateProfile, dataToSave)
          .then((res: any) => {
            toast?.show(res.message ?? t("PROFILE_UPDATE_SUCCESS"), "success");
          })
          .finally(() => {
            pushToDataLayerWithoutEvent({
              event: "profile_update",
              ...dataToSave,
              mobile: dataToSave.mobileNo,
            });
            setLoading(false);
          });
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      toast?.show("Failed to update profile", "error");
      setLoading(false);
    }
  };

  const getUserData = () => {
    const eventbtn = pageview_event("Profile");
    save_event(redux?.auth?.authToken, location ?? "Profile", [eventbtn]);
    setLoading(true);

    if (request) {
      request
        .GET(users_getUserProfile + "?userId=" + redux?.auth?.authToken)
        .then((res: any) => {
          if (res?.user) {
            const { createdAt, __v, _id, ...userData } = res.user;
            setUserData(userData);
            setProfileImage(userData.profileImage ?? user_pic);
            if (dispatch) {
              dispatch(
                updateProfileImage({
                  updateProfileImage: userData.profileImage || user_pic || "",
                })
              );
            }
          }
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (!userData.userId) {
      getUserData();
    }
    if (dispatch) {
      dispatch(
        updateVideo({
          video_data: videoSource,
        })
      );
    }
  }, []);

  return (
    <div className="container profile">
      {loading && <OverlayLoading />}
      <div className="container checkout-header">
        <span
          style={{ cursor: "pointer" }}
          onClick={() => router.push("/account")}
        >
          <ChevronLeft className="profile-header--name" />
        </span>
        <p className="profile-header--name">{t("PROFILE_TITLE")}</p>
      </div>

      <div className="profile-user" data-error-field="profileImage">
        <p className="profile-user--heading ph-16">{t("PROFILE_PICTURE")}</p>
        <div className="profile-user--box ph-16">
          <img
            className="profile-user--box-img"
            src={profileImage}
            alt="user-pic"
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            style={{ display: "none" }}
          />
          <DarkBgButton
            isLoading={uploading}
            onClick={handleUploadClick}
            children={t("CHANGE_PICTURE")}
          />
          {showErrors && errors.profileImage && (
            <p className="error-text">{errors.profileImage}</p>
          )}
        </div>
      </div>

      <div
        className="profile-personalDetails"
        data-error-field="personalDetails"
      >
        <p className="profile-user--heading ph-16">{t("PERSONAL_DETAILS")}</p>
        <PersonalDetails
          userData={userData}
          onChange={handleInputChange}
          errors={showErrors ? errors : {}}
        />
      </div>

      <div className="profile-personalDetails" data-error-field="address">
        <p className="profile-user--heading ph-16">{t("ADDRESS")}</p>
        <AddressDetails
          address={userData.address}
          onChange={handleAddressChange}
          errors={showErrors ? errors : {}}
        />
      </div>

      <div className="profile-personalDetails" data-error-field="familyMembers">
        <p className="profile-user--heading ph-16">{t("FAMILY_MEMBERS")}</p>
        <MemberDetails
          familyMembers={userData.familyMembers}
          onChange={(members) => handleInputChange("familyMembers", members)}
          errors={showErrors ? errors : {}}
        />
        {showErrors && errors.familyMembers && (
          <p className="error-text">{errors.familyMembers}</p>
        )}
      </div>

      <div className="profile-save-btn">
        <DarkBgButtonFw
          isLoading={loading}
          onClick={handleSave}
          children={t("SAVE_CHANGES")}
        />
      </div>
    </div>
  );
};

export default DI(Profile);
