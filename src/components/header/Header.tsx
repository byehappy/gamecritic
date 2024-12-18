import { Link, useLocation, useNavigate } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Avatar, Button, Dropdown, MenuProps } from "antd";
import { cloneElement, useCallback } from "react";
import { logout } from "../../redux/slice/authSlice";
import uuid4 from "uuid4";
import useToken from "antd/es/theme/useToken";
import { device } from "../../styles/size";

const StyledHeader = styled.header`
  color: ${({ theme }) => theme.colors.font};
  height: 8vh;
  display: flex;
  align-items: center;
  @media ${device.mobileS} {
    padding: 5px;
  }
  @media ${device.laptopL} {
    padding: 0 8vw;
  }
  @media ${device.desktop} {
    padding: 0 10vw;
  }
  justify-content: space-between;
  border-bottom: 2px #8a2be2 solid;
  .logo {
    color: ${({ theme }) => theme.colors.font};
    font-family: "Silkscreen";
  }
  .profile {
    color: ${({ theme }) => theme.colors.font};
  }
`;
export const Header = () => {
  const  theme  = useTheme();
  const navigate = useNavigate();
  const token = useToken();
  const { user: currentUser } = useAppSelector((state) => state.auth);
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const logOut = useCallback(() => {
    dispatch(logout());
    navigate("/");
    sessionStorage.clear();
  }, [dispatch, navigate]);
  const params = new URLSearchParams();
  params.set("from", pathname);
  const items: MenuProps["items"] = [
    {
      label: (
        <Link className="profile" to={`/my-profile`}>
          Мой профиль
        </Link>
      ),
      key: uuid4(),
    },
    {
      label: (
        <Link className="profile" to={`/about-me`}>
          О себе
        </Link>
      ),
      key: uuid4(),
    },
    {
      label: (
        <Link className="profile" to="/catalog-games">
          Каталог пройденных игр
        </Link>
      ),
      key: uuid4(),
    },
    {
      label: (
        <Link className="profile" to={`/create-tierlist`}>
          Создать свой шаблон
        </Link>
      ),
      key: uuid4(),
    },
    {
      label: (
        <Button danger onClick={logOut}>
          Выйти
        </Button>
      ),
      key: uuid4(),
    },
  ];
  return (
    <StyledHeader>
      <Link
        className="logo"
        to={""}
        style={{ fontSize: theme.fontSizes.adaptivLogo }}
      >
        GameCritic
      </Link>
      {!currentUser ? (
        <div style={{ display: "flex", gap: "1vw" }}>
          <Link to={`/auth/sign-in?${params.toString()}`}>
            <Button>Авторизация</Button>
          </Link>
        </div>
      ) : (
        currentUser.username && (
          <Dropdown
            menu={{ items }}
            placement="bottomRight"
            trigger={["click"]}
            dropdownRender={(originNode) => (
              <div
                style={{
                  backgroundColor: token[1].colorBgElevated,
                  borderRadius: token[1].borderRadiusLG,
                  boxShadow: token[1].boxShadow,
                  display: "flex",
                  flexDirection: "column",
                  paddingTop: "1vh",
                }}
              >
                <span
                  style={{ paddingLeft: "8%" }}
                >{`Привет,${currentUser?.username}!`}</span>
                {cloneElement(originNode as React.ReactElement, {
                  style: { boxShadow: "none" },
                })}
              </div>
            )}
          >
            <Avatar
              size={"large"}
              icon={
                <img
                  src={currentUser.icon}
                  style={{ objectFit: "contain", background: "lightgray" }}
                  alt={`iconUser`}
                />
              }
              style={{ cursor: "pointer", width: "fit-content", height: "75%" }}
            />
          </Dropdown>
        )
      )}
    </StyledHeader>
  );
};
