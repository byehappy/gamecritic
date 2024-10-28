import { Card } from "antd";
import { IGame } from "../../interfaces/games";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

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
    isDragging, } = useSortable({
    id: id,
  });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? "0.5" : "1",
    boxShadow: isDragging ? "0px 0px 9px 1px #000000" : "none",
    width: 150,
    overflow: "hidden",
    minHeight: "9.5rem",
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
          <img height={"150rem"} alt={game.name} src={game.background_image} />
        )
      }
    />
  );
};
