import Avatar from "antd/es/avatar/avatar";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { UserOutlined } from "@ant-design/icons";
export const Item = styled.div`
  width: 18vw;
  position: relative;
  flex: none;
  height: 20vh;
  transition: transform 0.3s ease-in-out;
  overflow: hidden;
  img {
    object-fit: cover;
    object-position: top;
    width: 110%;
    height: 100%;
  }
  .bottom-text {
    padding: 10px;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    color: white;
    line-height: 22px;
    background-color: black;
    height: 6vh;
    gap: 0.2vw;
    display: flex;
  }
`;
export const UserTemplateCard: React.FC<{
  img: string;
  name: string;
  username: string;
  userid: string;
  id: string | number;
}> = ({ img, name, id, username, userid }) => {
  return (
    <Item>
      <Link to={`/tier-list/${id}/${userid}`}>
        <img src={img} alt={name} />
      </Link>
      <div className="bottom-text">
        <Link to={`/user/${userid}`}>
          <Avatar
            style={{ backgroundColor: "gray" }}
            size={40}
            icon={<UserOutlined />}
          />
        </Link>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link to={`/tier-list/${id}`} style={{color:"white"}}>
            <p>{name}</p>
          </Link>
          <Link to={`/user/${userid}`} style={{ color: "gray" }}>
            {username}
          </Link>
        </div>
      </div>
    </Item>
  );
};
