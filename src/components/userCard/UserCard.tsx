import styled from "styled-components";
import { Link } from "react-router-dom";
import { TopUsers } from "../../axios/requests/gamecriticAPI/passGame.request";
import { SameUsers } from "../../interfaces/users";

const UserWrapper = styled.div`
  max-width: 130px;
  min-width:calc(80px + 30 * (100vw / 1280));
  aspect-ratio: 2 / 3.5;
  background-color: #AB5EF1;
  padding: 0.1em;
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
    font-size:${({theme})=> theme.fontSizes.adaptivSmallText};
    a {
      width: 100%;
    }
  }
`;
export const UserCard: React.FC<{ user: TopUsers | SameUsers }> = ({
  user,
}) => {
  if ("gameCount" in user) {
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
  } else if ("totalSimilarityScore" in user) {
    return (
      <UserWrapper>
        <Link to={`/about/${user.userId}`}>
          <img src={user.img} alt={user.name} />
        </Link>
        <div>
          <Link to={`/about/${user.userId}`}>{user.name}</Link>
         <span style={{fontSize:".9em"}}>Совпадение: {user.totalSimilarityScore * 100}%</span>
        </div>
      </UserWrapper>
    );
  }
};
