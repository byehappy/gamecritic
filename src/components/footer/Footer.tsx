import styled from "styled-components";

const StyledFooter = styled.footer`
  background-color: ${({ theme }) => theme.colors.bg};
  color: ${({ theme }) => theme.colors.font};
  flex-shrink:0;
  min-height:5vh;
  display:flex;
  justify-content: space-around;
  align-items:center;
  a{
    color: ${({theme})=> theme.colors.font}
  }
`;

export const Footer = () => {
    return (
        <StyledFooter>
            GameCrititc
        </StyledFooter>
    )
}
