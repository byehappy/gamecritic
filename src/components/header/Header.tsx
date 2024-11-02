import { Link } from "react-router-dom";
import styled from "styled-components";

const StyledHeader = styled.header`
  background-color: ${({ theme }) => theme.base.colors.bg};
  color: ${({ theme }) => theme.base.colors.font};
  height: 6vh;
  display: flex;
  align-items: center;
  padding: 0 10vw;
  font-family: "Silkscreen";
  font-size:2rem;
  a {
    color: ${({ theme }) => theme.base.colors.font};
  }
`;
export const Header = () => (
  <StyledHeader>
    <Link to={''}> GameCritic </Link>
    <div></div>
  </StyledHeader>
);
