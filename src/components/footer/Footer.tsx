import { Button, Tooltip } from "antd";
import styled from "styled-components";
import { useTheme } from "../../utils/hooks/useTheme";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { device } from "../../styles/size";
const StyledFooter = styled.footer`
  margin: 30px 0 15px;
  color: ${({ theme }) => theme.colors.font};
  flex-shrink: 0;
  min-height: 5vh;
  display: flex;
  justify-content: space-between;
  position:relative;
  @media ${device.mobileS} {
    padding: 5px;
  }
  @media ${device.laptopL} {
    padding: 0 8vw;
  }
  @media ${device.desktop} {
    padding: 0 10vw;
  }
  align-items: center;
  font-family: "Silkscreen";
  font-size: ${({ theme }) => theme.fontSizes.adaptivH1};
  span {
    font-size: 0.85em;
  }
  a {
    color: ${({ theme }) => theme.colors.font};
  }
`;

export const Footer = () => {
  const { themeName, toggleTheme,theme } = useTheme();
  return (
    <StyledFooter>
      <div style={{flex:2}}>GameCrititc</div>
      <span style={{fontSize:theme.fontSizes.adaptivSmallText,flex:3}}>Сделано Разживаловым Евгением 2024г.</span>
      <Tooltip title="Смена темы" style={{flex:1}}>
        <Button
          onClick={() => {
            localStorage.setItem(
              "theme",
              themeName === "light" ? "dark" : "light"
            );
            toggleTheme();
          }}
          style={{ border: "none", background: "tranparent" }}
          icon={themeName === "light" ? <SunOutlined /> : <MoonOutlined />}
          size={"middle"}
        />
      </Tooltip>
    </StyledFooter>
  );
};
