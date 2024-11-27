import { Item } from "./TemplateCard.style";

export const TemplateCard: React.FC<{
  img: string | null;
  name: string;
  id?: string;
}> = ({ img, name, id }) => {
  let itemImg,itemName;
  if (name !== "" && name !== null) {
    itemName = name;
  } else {
    itemName = "Ваш шаблон";
  }
  if (img !== "" && img !== null) {
    itemImg = img;
  } else {
    itemImg = "https://mebeliero.ru/images/photos/medium/no_image.png";
  }
  return (
    <Item to={`/tier-list/${id}`} $IsDisabled={!id}>
      <img src={itemImg} alt={name} />
      <span>{itemName}</span>
    </Item>
  );
};
