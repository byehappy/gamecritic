import { Link, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate()
  const [currentUser, setCurrentUser] = useState<{
    username: string;
    id: string;
  } | null>();
  const { user } = useAppSelector((state) => state.auth);
  const {pathname} = useLocation()
  const dispatch = useAppDispatch();
  const logOut = useCallback(() => {
    dispatch(logout());
    navigate('/')
    sessionStorage.clear()
  }, [dispatch, navigate]);
  useEffect(() => {
    setCurrentUser(user);
  }, [user]);
  const params = new URLSearchParams();
  params.set("from", pathname);
  
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
          <div style={{ display: "flex", gap: "1vw", alignItems: "center" }}>
            <div>
              Привет,
              <Link className="profile" to={`/my-profile`}>
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
