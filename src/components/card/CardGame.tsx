import { IGameDis } from "../../interfaces/games";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import styled from "styled-components";
import { useState } from "react";
import { CardModal } from "./modalCard/Card.modal";
import { isString } from "antd/es/button";
const StyleCoverImage = styled.div<{ $name: string; $size: string  }>`
  position: relative;
  display: block;
  overflow: hidden;
  touch-action:none;
  img {
    transition: filter 0.3s ease;
    height: ${(props) => (props.$size === "large" ? "12rem" : "10rem")};
  }
  &:hover img {
    filter: brightness(50%);
  }
  &::before {
    content: "${(props) => props.$name.replace(/'/g, " ")}";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 85%;
    color: white;
    opacity: 0;
    pointer-events: none;
    z-index: 5;
    text-overflow: ellipsis;
    max-height: 7em;
    overflow: hidden;
  }
  &:hover {
    &:before {
      opacity: 1;
    }
  }
`;
export const CardGame: React.FC<{
  game: IGameDis;
  id: number | string;
  size?: "small" | "large";
  onCardClick?: (game: IGameDis) => void;
  cursorValue?: string;
}> = ({ game, id, size = "large", onCardClick, cursorValue }) => {
  const isDisabled = game.disabled ?? false;
  const [openModalGameId, setOpenModalGameId] = useState<
    number | string | null
  >();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    disabled: isDisabled,
  });
  const cursor = onCardClick ? "pointer" : isDisabled ? "not-allowed" : "grab";
  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging || game.disabled ? "0.5" : "1",
    boxShadow: isDragging ? "0px 0px 9px 1px #000000" : "none",
    overflow: "hidden",
    width: "100%",
    maxWidth:"130px",
    border: "none",
    cursor: cursorValue ?? cursor,
    maxHeight: "12rem",
  };
  function handleClick(game: IGameDis) {
    if (onCardClick) {
      onCardClick(game);
    } else {
      setOpenModalGameId(game.id);
    }
  }

  return (
    <>
      <StyleCoverImage
        $name={game.name}
        ref={setNodeRef}
        $size={size}
        {...listeners}
        {...attributes}
        key={id}
        style={style}
        onClick={() => handleClick(game)}
      >
        <img
          style={{ objectFit: "cover", width: "100%" }}
          alt={game.name}
          src={
            game.background_image
              ? game.background_image.replace("/media/", "/media/crop/600/400/")
              : "https://mebeliero.ru/images/photos/medium/no_image.png"
          }
          draggable={!game.disabled}
        />
      </StyleCoverImage>
      {openModalGameId === game.id ? (
        <CardModal
          id={
            isString(openModalGameId)
              ? Number(openModalGameId.replace("disable-", ""))
              : openModalGameId
          }
          setOpenModalGameId={setOpenModalGameId}
        />
      ) : null}
    </>
  );
};
