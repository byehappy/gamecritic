import styled from "styled-components";

const StyledHeader = styled.header`
  background-color: ${({ theme }) => theme.base.colors.bg};
  color: ${({ theme }) => theme.base.colors.font};
  height: 50px;
  display:flex;
  align-items:center;
  padding: 0 10vw;
  a{
    color: ${({theme})=> theme.base.colors.font}
  }
`;
export const Header = () => (
  <StyledHeader>
    GameCritic
    <div>

    </div>
  </StyledHeader>
);
