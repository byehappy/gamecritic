import styled from "styled-components";

const StyledFooter = styled.footer`
  color: ${({ theme }) => theme.base.colors.font};
  flex-shrink:0;
  min-height:5vh;
  display:flex;
  justify-content: space-around;
  align-items:center;
  font-family: "Silkscreen";
  font-size:2rem;
  a{
    color: ${({theme})=> theme.base.colors.font}
  }
`;

export const Footer = () => {
    return (
        <StyledFooter>
            GameCrititc
        </StyledFooter>
    )
}
