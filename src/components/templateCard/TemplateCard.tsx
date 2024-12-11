import { Button } from "antd";
import { Item } from "./TemplateCard.style";
import { DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export const TemplateCard: React.FC<{
  img: string | null;
  name: string;
  id?: string;
  del: false | ((tierId: string) => void);
  disable?:boolean;
}> = ({ img, name, id, del,disable = false }) => {
  let itemImg, itemName;
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
    <Item $IsDisabled={!id || disable}>
      {id && del && (
        <Button
          onClick={() => del(id)}
          style={{
            zIndex: 2,
            position: "absolute",
            right: 1,
            top: 1,
            border: "none",
          }}
        >
          <DeleteOutlined style={{ color: "white", fontSize: "1rem" }} />
        </Button>
      )}
      <Link to={`/tier-list/${id}`}>
        <img src={itemImg} alt={name} />
        <span>{itemName}</span>
      </Link>
    </Item>
  );
};
