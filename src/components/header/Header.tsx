import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Avatar, Button, Dropdown, MenuProps } from "antd";
import { cloneElement, useCallback } from "react";
import { logout } from "../../redux/slice/authSlice";
import uuid4 from "uuid4";
import useToken from "antd/es/theme/useToken";

const StyledHeader = styled.header`
  color: ${({ theme }) => theme.base.colors.font};
  height: 6vh;
  display: flex;
  align-items: center;
  padding: 0 10vw;
  justify-content: space-between;
  border-bottom: 2px #8a2be2 solid;
  .logo {
    color: ${({ theme }) => theme.base.colors.font};
    font-family: "Silkscreen";
  }
  .profile {
    color: ${({ theme }) => theme.base.colors.font};
  }
`;
export const Header = () => {
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
        <Link className="logo" to={""} style={{ fontSize: "2rem" }}>
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
          <div style={{ display: "flex", gap: "1vw" }}>
            <Dropdown
              menu={{ items }}
              placement="bottomRight"
              trigger={["click"]}
              dropdownRender={(originNode) => (
                <div
                  style={{
                    backgroundColor: token[1].colorBgElevated,
                    borderRadius: token[1].borderRadiusLG,
                    boxShadow: token[1].boxShadowSecondary,
                    display: "flex",
                    flexDirection: "column",
                    paddingTop: "1vh",
                  }}
                >
                  <span
                    style={{ paddingLeft: "9%" }}
                  >{`Привет,${currentUser?.username}!`}</span>
                  {cloneElement(originNode as React.ReactElement, {
                    style: { boxShadow: "none" },
                  })}
                </div>
              )}
            >
              <Avatar
                size={40}
                icon={
                    <img src={currentUser.icon} style={{objectFit:"contain"}} alt={`iconUser`} />
                }
                style={{ cursor: "pointer" }}
              />
            </Dropdown>
          </div>
        )
      )}
    </StyledHeader>
  );
};
