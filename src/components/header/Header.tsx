import styled from "styled-components";

const StyledHeader = styled.header`
  background-color: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.font};
  height: 50px;
  display:flex;
  align-items:center;
  padding: 0 10vw;
  a{
    color: ${({theme})=> theme.colors.font}
  }
`;
export const Header = () => (
  <StyledHeader>
    GameCritic
    <div>

    </div>
  </StyledHeader>
);
