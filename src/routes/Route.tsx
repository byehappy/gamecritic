import { Outlet } from "react-router-dom";
import { Header } from "../components/header/Header";
import { Footer } from "../components/footer/Footer";
import { useEffect } from "react";
import { refreshToken } from "../axios";
import { decodeToken } from "../utils/expiredToken";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/slice/authSlice";

function Root() {
  const dispacth = useAppDispatch();
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  useEffect(() => {
    let refreshAccessTokenTimerId: NodeJS.Timeout | undefined;
    const refreshAndSetTokenExp = async () => {
      try {
        const rs = await refreshToken();
        const { accessToken } = rs.data;
        localStorage.setItem("accessToken", accessToken);
        const newTokenData = decodeToken();
        if (newTokenData) {
          refreshAccessTokenTimerId = setTimeout(
            refreshAndSetTokenExp,
            (newTokenData.exp - Math.floor(Date.now() / 1000)) * 1000
          );
        }
      } catch {
        dispacth(logout());
      }
    };

    const dataToken = decodeToken();
    if (isLoggedIn && dataToken) {
      refreshAccessTokenTimerId = setTimeout(
        refreshAndSetTokenExp,
        (dataToken.exp - Math.floor(Date.now() / 1000)) * 1000
      );
    }

    return () => {
      clearTimeout(refreshAccessTokenTimerId);
    };
  }, [dispacth, isLoggedIn]);
  return (
    <>
      <Header />
      <div id="content">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default Root;
