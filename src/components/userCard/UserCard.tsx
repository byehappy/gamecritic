import styled from "styled-components";
import { Link } from "react-router-dom";
import { TopUsers } from "../../axios/requests/gamecriticAPI/passGame.request";

const UserWrapper = styled(Link)`
  width: 10em;
  height: 20vh;
  background-color: gray;
  padding: 1%;
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 100%;
    height: 65%;
    border-radius:100%;
  }
  div {
    margin-top:.5vw;
    width: 100%;
    height: 5vh;
    text-align: center;
    color:white;
  }
`;
export const UserCard:React.FC<{user:TopUsers}> = ({user}) => {
  return (
    <UserWrapper to={`/about/${user.id}`}>
      <img src={user.img_icon} alt={user.name}/>
      <div>{user.name}<br/>Кол-во игр: {user.gameCount}</div>
    </UserWrapper>
  );
};
