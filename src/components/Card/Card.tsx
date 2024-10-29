import { Card } from "antd";
import { IGame } from "../../interfaces/games";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import styled from "styled-components";
const StyleCoverImage = styled.div<{$name: string}>`
      position:relative;
      display:block;
      overflow:hidden;
      img{
        transition: filter 0.3s ease;
      }
      &:hover img {
        filter: brightness(50%)
      }
      &::before{
        content: '${props => props.$name.replace(/'/g," ")}';
        position:absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        color:white;
        opacity:0;
        pointer-events: none;
        z-index:999;
        text-overflow: ellipsis;
        max-height:65px;
        overflow:hidden;
      }
      &:hover{
        &:before{
          opacity: 1;
        }
      }
  `
export const CardGame: React.FC<{
  game?: IGame;
  loading: boolean;
  id: number;
}> = ({ game, loading, id }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? "0.5" : "1",
    boxShadow: isDragging ? "0px 0px 9px 1px #000000" : "none",
    overflow: "hidden",
    minHeight: "12rem",
    maxHeight: "12rem",
    maxWidth: "130px",
    border: "none",
  };
  

  return (
    <Card
      key={id}
      loading={loading}
      style={style}
      styles={{
        body: {
          display: "none",
        },
      }}
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      hoverable
      cover={
        !game || game === undefined ? null : (
          <StyleCoverImage $name={game.name}>
            <img
              style={{ objectFit: "cover",width:"100%" }}
              height={"200vh"}
              alt={game.name}
              src={game.background_image}
            />
          </StyleCoverImage>
        )
      }
    />
  );
};