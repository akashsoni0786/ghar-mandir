import { ChevronsRight } from "react-feather";
import { useRouter } from "next/navigation";
import { DIProps } from "@/core/DI.types";
import { DI } from "@/core/DependencyInjection";
import useTrans from "@/customHooks/useTrans";
interface Props extends DIProps {
  path: string;
  eventData: any;
}
const ShowMoreCard = ({ path, eventData, redux }: Props) => {
  const route = useRouter();
  const t = useTrans(redux?.common?.language);

  return (
    <div
      className="card-participate  scrollable-boxes--child"
      style={{
        background: `
        linear-gradient(0deg, rgba(19, 33, 2, 0.5) 30%, rgba(19, 33, 2, 0.2) 60%, rgba(19, 33, 2, 0) 69%),
        url(https://imgcdn.stablediffusionweb.com/2024/9/8/8faf36ba-e785-45a2-b7ed-f2fd03334594.jpg)`,
        cursor: "pointer",
        border: "2px solid gray",
        backgroundColor: "currentcolor",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      onClick={() => {
        if (eventData) {
          eventData();
        }
        route.push(`/${path}`);
      }}
    >
      <div
        className="card-participate--data"
        style={{
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            gap: "1rem",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "white",
              backgroundColor: "gray",
              padding: "16px",
              cursor: "pointer",
              borderRadius: "50%",
              marginBottom: "-10px",
            }}
          >
            <ChevronsRight size={20} color="#fff" />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              color: "white",
            }}
          >
            <span>{t("VIEW_ALL")}</span>
          </div>
          <h3
            className="card-participate--title"
            style={{ textAlign: "center" }}
          >
            {path == "puja"
              ? t("EXPLORE_MORE_PUJA")
              : t("EXPLORE_MORE_CHADHAVA")}
          </h3>
        </div>
      </div>
    </div>
  );
};

export default DI(ShowMoreCard);
