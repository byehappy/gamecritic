import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Button } from "antd";
import { useCallback, useEffect, useState } from "react";
import { logout } from "../../redux/slice/authSlice";

const StyledHeader = styled.header`
  background-color: ${({ theme }) => theme.base.colors.bg};
  color: ${({ theme }) => theme.base.colors.font};
  height: 6vh;
  display: flex;
  align-items: center;
  padding: 0 10vw;
  justify-content: space-between;
  .logo {
    color: ${({ theme }) => theme.base.colors.font};
    font-family: "Silkscreen";
  }
  .profile {
    color: ${({ theme }) => theme.base.colors.font};
  }
`;
export const Header = () => {
  const [currentUser, setCurrentUser] = useState<{
    username: string;
    id: string;
  } | null>();
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const logOut = useCallback(() => {
    dispatch(logout());
  }, [dispatch]);
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  return (
    <StyledHeader>
      <Link className="logo" to={""} style={{ fontSize: "2rem" }}>
        GameCritic
      </Link>
      {!currentUser ? (
        <div style={{ display: "flex", gap: "1vw" }}>
          <Link to="/auth/sign-up">
            <Button>Регистрация</Button>
          </Link>
          <Link to="/auth/sign-in">
            <Button>Авторизация</Button>
          </Link>
        </div>
      ) : (
        currentUser.username && (
          <div style={{ display: "flex", gap: "1vw", alignItems: "center" }}>
            <div>
              Привет,
              <Link className="profile" to={`/profile/${currentUser.id}`}>
                {currentUser.username}!
              </Link>
            </div>
            <Button danger onClick={logOut}>
              Выйти
            </Button>
          </div>
        )
      )}
    </StyledHeader>
  );
};
