import styled from "styled-components";
import { Link } from "react-router-dom";
import { TopUsers } from "../../axios/requests/gamecriticAPI/passGame.request";

const UserWrapper = styled.div`
  width: 10em;
  height: 20vh;
  background-color: #53377aaa;
  padding: 1%;
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  a{
    width:95%;
    height:65%;
    color:white
  }
  img {
    width: 100%;
    border-radius: 100%;
  }
  div {
    margin-top: 0.5vw;
    width: 100%;
    height: 5vh;
    text-align: center;
    color: white;
  }
`;
export const UserCard: React.FC<{ user: TopUsers }> = ({ user }) => {
  return (
    <UserWrapper>
      <Link to={`/about/${user.id}`}>
        <img src={user.img_icon} alt={user.name} />
      </Link>
      <div>
        <Link to={`/about/${user.id}`}>{user.name}</Link>
        <br />
        <Link to={`/passed-games/${user.id}`}>
          Кол-во игр: {user.gameCount}
        </Link>
      </div>
    </UserWrapper>
  );
};
