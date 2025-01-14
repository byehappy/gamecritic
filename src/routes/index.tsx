import {
  createBrowserRouter,
  LoaderFunctionArgs,
  redirect,
} from "react-router-dom";
import ErrorPage from "../pages/Error";
import Root from "./Route";
import TierPage from "../pages/TierPage";
import { HomePage } from "../pages/HomePage";
import { TemplatesPage } from "../pages/TemplatesPage";
import { SignInPage } from "../pages/auth/SignIn";
import { SignUpPage } from "../pages/auth/SignUp";
import { ProfilePage } from "../pages/Profile";
import { refreshToken } from "../axios";
import { FavoritesPage } from "../pages/FavoritesPage";
import { CreateTierPage } from "../pages/createTemplate/CreateTier";
import { AboutePage } from "../pages/AboutPage";
import { CatalogGamesPage } from "../pages/CatalogGamesPage";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    Component() {
      return <Root />;
    },
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "/tier-list/:tierType/:paramsUserId?",
        element: <TierPage />,
      },
      {
        path: "/all",
        element: <TemplatesPage />,
      },
      {
        path: "/all-tierlits/:userid",
        element: <TemplatesPage />,
      },
      {
        path: "/all-favorites/:userid",
        element: <FavoritesPage />,
      },
      {
        path: "/auth/sign-in",
        element: <SignInPage />,
      },
      {
        path: "/auth/sign-up",
        element: <SignUpPage />,
      },
      {
        path: "/my-profile",
        loader: protectedLoader,
        element: <ProfilePage />,
      },
      {
        path: "/create-tierlist",
        loader: protectedLoader,
        element: <CreateTierPage />,
      },
      {
        path: "/update-tierlist/:tierId",
        loader: protectedLoader,
        element: <CreateTierPage />,
      },
      {
        path: "/all-my-tierlits/:userid",
        element: <TemplatesPage author={true} />,
      },
      {
        path:"/user/:userId",
        element:<ProfilePage/>
      },
      {
        path:"/about-me",
        loader: protectedLoader,
        element:<AboutePage />
      },
      {
        path:"/about/:userId",
        element:<AboutePage />
      },
      {
        path:"/catalog-games",
        element:<CatalogGamesPage />
      },
      {
        path:"/passed-games/:userId",
        element:<CatalogGamesPage />
      },
    ],
  },
]);

async function protectedLoader({ request }: LoaderFunctionArgs) {
  if (!localStorage.getItem("accessToken")) {
    if (localStorage.getItem("refreshToken")) {
      const rs = await refreshToken();
      const { accessToken } = rs.data;
      localStorage.setItem("accessToken", accessToken);
    } else {
      const params = new URLSearchParams();
      params.set("from", new URL(request.url).pathname);
      return redirect("/auth/sign-in?" + params.toString());
    }
  }
  return null;
}
