import Avatar from "antd/es/avatar/avatar";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { device } from "../../styles/size";

export const Item = styled.div`
  width: calc(200px + 100 * (100vw / 1280));
  position: relative;
  flex: none;
  transition: transform 0.3s ease-in-out;
  overflow: hidden;
  @media ${device.mobileS} {
    height: 150px;
  }
  @media ${device.tablet} {
    height: 24vh;
  }
  img {
    object-fit: cover;
    object-position: left top;
    width: 130%;
    height: 100%;
  }
  .bottom-text {
    padding: 1% 5%;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    color: white;
    line-height: 22px;
    background-color: #000000ce;
    height: 25%;
    gap: ${({ theme }) => theme.spacing.sm};
    display: flex;
    align-items: center;
  }
`;
export const UserTemplateCard: React.FC<{
  img: string;
  name: string;
  username: string;
  userid: string;
  id: string | number;
  userImage: string;
}> = ({ img, name, id, username, userid, userImage }) => {
  return (
    <Item>
      <Link to={`/tier-list/${id}/${userid}`} style={{display:"flex",height:"100%"}}>
        <img src={img} alt={name} />
      </Link>
      <div className="bottom-text">
        <Link to={`/about/${userid}`} style={{minWidth:"30px"}}>
          <Avatar
            style={{
              backgroundColor: "white",
            }}
            icon={<img src={userImage} alt={username} />}
          />
        </Link>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textWrap: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          <Link to={`/tier-list/${id}`} style={{ color: "white" }}>
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
