import { XCircle } from "react-feather";
import TextField from "../Common/TextField";
import { TextButton } from "../Common/Buttons";
import { useEffect, useState } from "react";
import { formatMembersWithButton } from "@/constants/commonfunctions";
import useTrans from "@/customHooks/useTrans";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";

interface MemberDetailsProps extends DIProps {
  familyMembers: string[];
  onChange: (members: string[]) => void;
  errors?: {
    familyMembers?: string;
  };
  showSaveErrors?: boolean; // New prop to distinguish save-time validation
}

const MemberDetails = ({
  familyMembers,
  onChange,
  errors,
  redux,
  showSaveErrors = false,
}: MemberDetailsProps) => {
  const t = useTrans(redux?.common?.language);
  const [membersGrid, setMembersGrid] = useState<any[][]>([]);
  const [memberErrors, setMemberErrors] = useState<boolean[]>([]);
  const [touchedMembers, setTouchedMembers] = useState<boolean[]>([]);

  // Format members into grid (2 per row) with Add button
  useEffect(() => {
    setMembersGrid(formatMembersWithButton(familyMembers));
    // Initialize member states
    setMemberErrors(familyMembers?.map((member) => !member.trim()) || []);
    setTouchedMembers(familyMembers?.map(() => false) || []);
  }, [familyMembers]);

  const handleAddMember = () => {
    const updatedMembers = [...familyMembers, ""];
    onChange(updatedMembers);
    setMemberErrors([...memberErrors, true]);
    setTouchedMembers([...touchedMembers, false]);
  };

  const handleRemoveMember = (index: number) => {
    const updated = [...familyMembers];
    updated.splice(index, 1);
    onChange(updated);

    setMemberErrors((prev) => prev.filter((_, i) => i !== index));
    setTouchedMembers((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMemberChange = (index: number, value: string) => {
    const updated = [...familyMembers];
    updated[index] = value;
    onChange(updated);

    setMemberErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = !value.trim();
      return newErrors;
    });

    setTouchedMembers((prev) => {
      const newTouched = [...prev];
      newTouched[index] = true;
      return newTouched;
    });
  };

  // Determine error display based on context
  const getErrorState = (index: number) => {
    const isInvalid = memberErrors[index];
    const showErrorIndicator = showSaveErrors || touchedMembers[index];

    return {
      showError: showErrorIndicator && isInvalid,
      showHelperText: !showSaveErrors && touchedMembers[index] && isInvalid,
    };
  };

  return (
    <div className="profile-personalDetails-form ph-16">
      {membersGrid.map((row, rowIndex) => (
        <div key={rowIndex} className="profile-flex-wrap">
          {row.map((item, colIndex) => {
            const memberIndex = rowIndex * 2 + colIndex;
            const { showError, showHelperText } = getErrorState(memberIndex);
            return (
              <span key={`${rowIndex}-${colIndex}`} className="max-width-field">
                {item === "Add-button" ? (
                  <div style={{ width: "100%", textAlign: "end" }}>
                    <TextButton onClick={handleAddMember}>
                      {t("ADD_MEMBER")}
                    </TextButton>
                  </div>
                ) : item == null ? (
                  <></>
                ) : (
                  <TextField
                    value={item}
                    withIcon={true}
                    iconPosition="right"
                    icon={
                      <span
                        className="cursor-pointer"
                        onClick={() => handleRemoveMember(memberIndex)}
                      >
                        <XCircle color="#af1e2e" />
                      </span>
                    }
                    onChange={(val) => handleMemberChange(memberIndex, val)}
                    error={showError}
                    helperText={showHelperText ? "Name cannot be empty" : ""}
                    placeholder={t("ENTER_FAMILY_MEMBER_NAME")}
                  />
                )}
              </span>
            );
          })}
        </div>
      ))}
      {showSaveErrors && errors?.familyMembers && (
        <p
          className="error-text"
          style={{
            color: "#AF1E2E",
            fontSize: "10px",
            marginTop: "8px",
            marginLeft: "12px",
          }}
        >
          {errors.familyMembers}
        </p>
      )}
    </div>
  );
};

export default DI(MemberDetails);
