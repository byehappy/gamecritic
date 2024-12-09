import { getTextColor } from "../../utils/textColorWithBg";

export const ExampleRow: React.FC<{ name: string; color: string }> = ({
  name,
  color,
}) => {
  return (
    <div
      style={{
        width: "50%",
        background: color,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        wordBreak: "break-all",
        height: "15vh",
      }}
    >
      <span
         style={{
            textAlign: "center",
            display: "inline-block",
            textOverflow: "ellipsis",
            wordWrap: "break-word",
            overflow: "hidden",
            maxHeight: "4.8em",
            lineHeight: "1.2em",
            color: getTextColor(color),
            padding:"0 1em"
          }}
      >
        {name}
      </span>
    </div>
  );
};
