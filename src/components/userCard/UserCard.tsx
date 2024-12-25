import styled from "styled-components";
import { Link } from "react-router-dom";
import { TopUsers } from "../../axios/requests/gamecriticAPI/passGame.request";
import { SameUsers } from "../../interfaces/users";

const UserWrapper = styled.div`
  max-width: 130px;
  min-width: calc(80px + 10 * (100vw / 1280));
  aspect-ratio: 2 / 3.2;
  height:auto;
  background-color: ${({ theme }) => theme.colors.primary};
  padding: 0.2em;
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding:10px;
  justify-content:space-evenly;
  a {
    display: flex;
    justify-content: center;
    flex-direction: row;
    width: 85%;
    color: white;
    &:hover {
      color: #ffd0a3;
    }
  }
  img {
    width: calc(70px + 20 * (100vw / 1280));
    border-radius: 100%;
  }
  div {
    text-align: center;
    font-size: 100%;
    margin-top: 0.5vw;
    width: 100%;
    color: white;
    font-size: ${({ theme }) => theme.fontSizes.adaptivSmallText};
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
        <Link
          to={`/about/${user.id}`}
          style={{
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <img src={user.img_icon} alt={user.name} />
          {user.name}
        </Link>
        <div>
          <Link to={`/passed-games/${user.id}`}>
            Кол-во игр: {user.gameCount}
          </Link>
        </div>
      </UserWrapper>
    );
  } else if ("totalSimilarityScore" in user) {
    return (
      <UserWrapper>
        <Link
          to={`/about/${user.userId}`}
          style={{
            flexDirection: "column",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <img src={user.img} alt={user.name} />
          {user.name}
        </Link>
        <div>
          <span style={{ fontSize: ".9em" }}>
            Совпадение: {user.totalSimilarityScore * 100}%
          </span>
        </div>
      </UserWrapper>
    );
  }
};
