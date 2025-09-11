import { DIProps } from "@/core/DI.types";
import "./LanguageSwitcher.css";
import { DI } from "@/core/DependencyInjection";
import { updateLanguage } from "@/store/slices/commonSlice";

const LanguageSwitcher = ({ dispatch, redux }: DIProps) => {
  const languages = [
    { code: "en", name: "English", nativeName: "English" },
    { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
    // { code: "mr", name: "Marathi", nativeName: "मराठी" },
    // { code: "ta", name: "Tamil", nativeName: "தமிழ்" },
    // { code: "bn", name: "Bengali", nativeName: "বাংলা" },
    // { code: "te", name: "Telugu", nativeName: "తెలుగు" },
    // { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ" },
    // { code: "ml", name: "Malayalam", nativeName: "മലയാളം" },
    // { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી" },
    // { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ" },
    // { code: "or", name: "Odia", nativeName: "ଓଡ଼ିଆ" },
    // { code: "as", name: "Assamese", nativeName: "অসমীয়া" },
  ];

  return (
    <div className="language-selector-ui">
      {/* <div className="language-selector-header">Select Language</div> */}
      <div className="language-options">
        {languages.map((lang) => (
          <div
            key={lang.code}
            className={`language-item ${
              localStorage.getItem("language") === lang.code ? "active" : ""
            }`}
            onClick={() => {
              if (dispatch) {
                localStorage.setItem("language", lang.code);
                dispatch(updateLanguage({ language: lang.code }));
                window.location.reload();
              }
            }}
          >
            <span
              className={`language-name ${
                localStorage.getItem("language") === lang.code ? "active" : ""
              }`}
            >{`${lang.nativeName} (${lang.name})`}</span>
            {/* <span className="language-native">{lang.nativeName}</span> */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DI(LanguageSwitcher);
