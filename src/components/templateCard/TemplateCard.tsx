import { Item } from "./TemplateCard.style";

export const TemplateCard: React.FC<{
  img: string;
  name: string;
  id: string;
}> = ({ img, name, id }) => {
  return (
    <Item to={`/tier-list/${id}`}>
      <img src={img} alt={name} />
      <span>{name}</span>
    </Item>
  );
};
