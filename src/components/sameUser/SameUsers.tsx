import styled from "styled-components";
import { SameUsers } from "../../interfaces/users";
import { UserCard } from "../userCard/UserCard";
const ContainerTopUsersItems = styled.div`
  display: flex;
  gap: 1vw;
  height: 100%;
  overflow-x: visible;
  margin:2% 0;
  @media (max-width: 425px) {
    div{
      max-height:160px;
    }
  }
`;
const HeaderTemplate = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  margin-top: 3vh;
  a {
    font-size: 1.5em;
  }
`;
export const SameUsersOnTier: React.FC<{ sameUsers: SameUsers[] }> = ({
  sameUsers,
}) => {
  return (
    <div>
      <HeaderTemplate>
        <h1>У вас есть схожие оценки с ними!</h1>
      </HeaderTemplate>
      <ContainerTopUsersItems>
        {sameUsers?.map((e) => (
          <UserCard user={e} key={e.userId} />
        ))}
      </ContainerTopUsersItems>
    </div>
  );
};
