import Avatar from "antd/es/avatar/avatar";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const Item = styled.div`
  width: 18vw;
  position: relative;
  flex: none;
  height: 24vh;
  transition: transform 0.3s ease-in-out;
  overflow: hidden;
  img {
    object-fit: cover;
    object-position: left top;
    width: 130%;
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
    background-color: #000000ce;
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
  userImage:string;
}> = ({ img, name, id, username, userid,userImage }) => {
  return (
    <Item>
      <Link to={`/tier-list/${id}/${userid}`}>
        <img src={img} alt={name} />
      </Link>
      <div className="bottom-text">
        <Link to={`/about/${userid}`}>
          <Avatar
            style={{ backgroundColor: "gray" }}
            size={40}
            icon={<img src={userImage} alt={username} />}
          />
        </Link>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Link to={`/tier-list/${id}`} style={{color:"white"}}>
            <p>{name}</p>
          </Link>
          <Link to={`/about/${userid}`} style={{ color: "gray" }}>
            {username}
          </Link>
        </div>
      </div>
    </Item>
  );
};
