import { IGameDis } from "../../interfaces/games";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import styled from "styled-components";
import { useState } from "react";
import { CardModal } from "./modalCard/Card.modal";
import { isString } from "antd/es/button";
const StyleCoverImage = styled.div<{ $name: string }>`
  position: relative;
  display: block;
  overflow: hidden;
  img {
    transition: filter 0.3s ease;
    height: 12rem;
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
    color: white;
    opacity: 0;
    pointer-events: none;
    z-index: 5;
    text-overflow: ellipsis;
    max-height: 65px;
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
}> = ({ game, id }) => {
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
  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging || game.disabled ? "0.5" : "1",
    boxShadow: isDragging ? "0px 0px 9px 1px #000000" : "none",
    overflow: "hidden",
    minHeight: "12rem",
    maxHeight: "12rem",
    maxWidth: "130px",
    border: "none",
    cursor: isDisabled ? "not-allowed" : "grab",
  };
  function handleClick(game: IGameDis) {
    setOpenModalGameId(game.id);
  }
  return (
    <>
      <StyleCoverImage
        $name={game.name}
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        key={id}
        style={style}
        onClick={() => handleClick(game)}
      >
        <img
          style={{ objectFit: "cover", width: "100%" }}
          alt={game.name}
          src={game.background_image?.replace("/media/", "/media/crop/600/400/")}
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
