import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useEffect } from "react";
import { resetAuthState, switchLoading } from "../../redux/slice/userSlice";
import { Button } from "antd";

const StyledHeader = styled.header`
  background-color: ${({ theme }) => theme.base.colors.bg};
  color: ${({ theme }) => theme.base.colors.font};
  height: 6vh;
  display: flex;
  align-items: center;
  padding: 0 10vw;
  justify-content: space-between;
  a {
    color: ${({ theme }) => theme.base.colors.font};
    font-family: "Silkscreen";
  }
`;
export const Header = () => {
  const { username, loading } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  useEffect(() => {
    const timeOut = setTimeout(() => {
      dispatch(switchLoading());
    }, 3000);
    return () => clearTimeout(timeOut);
  }, [dispatch]);
  return (
    <StyledHeader>
      <Link to={""} style={{fontSize:"2rem"}}> GameCritic </Link>
      {loading || !username ? (
        <div style={{ display: "flex", gap: "1vw" }}>
          <Link to="/sign-up">
            <Button>Регистрация</Button>
          </Link>
          <Link to="/sign-in">
            <Button>Авторизация</Button>
          </Link>
        </div>
      ) : (
        username && (
          <div style={{ display: "flex", gap: "1vw", alignItems: "center" }}>
            Привет, {username}!
            <Button danger onClick={() => dispatch(resetAuthState())}>
              Выйти
            </Button>
          </div>
        )
      )}
    </StyledHeader>
  );
};
