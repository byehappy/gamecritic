import { Button } from "antd";
import { Item } from "./TemplateCard.style";
import { DeleteOutlined, RollbackOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

export const TemplateCard: React.FC<{
  img: string;
  name: string;
  id?: string;
  del?: false | ((tierId: string, name: string) => void);
  disable?: boolean;
  userId?: string;
}> = ({ img = "", name, id, del = false, disable = false, userId = "" }) => {
  let itemName;
  if (name !== "" && name !== null) {
    itemName = name;
  } else {
    itemName = "Ваш шаблон";
  }
  return (
    <Item $IsDisabled={disable} $notClick={!id}>
      {id && del && (
        <Button
          onClick={() => del(id, name)}
          style={{
            zIndex: 2,
            position: "absolute",
            right: 0,
            top: -2,
            border: "none",
          }}
        >
          {!disable ? (
            <DeleteOutlined style={{ color: "white", fontSize: "1rem" }} />
          ) : (
            <RollbackOutlined style={{ color: "white", fontSize: "1rem" }} />
          )}
        </Button>
      )}
      <Link to={`/tier-list/${id}/${userId}`} style={{ display: "flex" }}>
        <img src={img} alt={name} />
        <span>{itemName}</span>
      </Link>
    </Item>
  );
};
