import { useCallback, useEffect, useRef, useState } from "react";
import { getTextColor } from "../../utils/textColorWithBg";
import { Tooltip } from "antd";

export const ExampleRow: React.FC<{ name: string; color: string }> = ({
  name,
  color,
}) => {
  const textRef = useRef<HTMLSpanElement>(null);
  const [overflowActive, setOverflowActive] = useState(false);
  const isOverflowActive = useCallback((event: HTMLSpanElement) => {
    return (
      event.offsetHeight < event.scrollHeight-1
    );
  }, []);
  useEffect(() => {
    if (textRef.current && isOverflowActive(textRef.current)) {
      setOverflowActive(true);
      return;
    }
    setOverflowActive(false);
  }, [isOverflowActive,name]);
  return (
    <div
      style={{
        background: color,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        wordBreak: "break-all",
        height: "15vh",
        minWidth:"100%"
      }}
    >
      <span
        style={{
          textAlign: "center",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          textOverflow: "ellipsis",
          WebkitLineClamp: "4",
          overflow: "hidden",
          maxHeight: "4.8em",
          lineHeight: "1.2em",
          color: getTextColor(color),
          padding: "0 1em",
          fontSize:"14px"
        }}
        ref={textRef}
      >
        {overflowActive ? <Tooltip title={name}>{name}</Tooltip> : name}
      </span>
    </div>
  );
};
