import styled from "styled-components";
import { Link } from "react-router-dom";
import { TopUsers } from "../../axios/requests/gamecriticAPI/passGame.request";

const UserWrapper = styled.div`
  max-width: 130px;
  min-width:130px;
  height: 200px;
  background-color: #53377aaa;
  padding: .1em;
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  a {
    display: flex;
    justify-content: center;
    flex-direction: row;
    width: 85%;
    color: white;
  }
  img {
    width: 100%;
    border-radius: 100%;
  }
  div {
    text-align: center;
    font-size: 100%;
    margin-top: 0.5vw;
    width: 100%;
    color: white;
    a {
      width: 100%;
    }
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
        <Link to={`/passed-games/${user.id}`}>
          Кол-во игр: {user.gameCount}
        </Link>
      </div>
    </UserWrapper>
  );
};
