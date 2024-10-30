import { Skeleton } from "antd";
import { IGameDis } from "../../interfaces/games";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import styled from "styled-components";
const StyleCoverImage = styled.div<{ $name: string }>`
  position: relative;
  display: block;
  overflow: hidden;
  img {
    transition: filter 0.3s ease;
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
    z-index: 999;
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
  game?: IGameDis;
  loading: boolean;
  id: number | string;
}> = ({ game, loading, id }) => {
  const isDisabled = game?.disabled ?? false;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    disabled: isDisabled
  });
  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging || game?.disabled ? "0.5" : "1",
    boxShadow: isDragging ? "0px 0px 9px 1px #000000" : "none",
    overflow: "hidden",
    minHeight: "12rem",
    maxHeight: "12rem",
    maxWidth: "130px",
    border: "none",
    cursor: isDisabled ? "not-allowed" : "grab",
  };

  return (
    <>
      {loading ? (
        <Skeleton.Image active style={style} />
      ) : (
        game && (
          <StyleCoverImage
            $name={game.name}
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            key={id}
            style={style}
          >
            <img
              style={{ objectFit: "cover", width: "100%" }}
              height={"200vh"}
              alt={game.name}
              src={game.background_image.replace("/media/","/media/crop/600/400/")}
              draggable={!game.disabled}
            />
          </StyleCoverImage>
        )
      )}
    </>
  );
};
