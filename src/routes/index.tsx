import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/Error";
import Root from "./Route";
import TierPage from "../pages/TierPage";
import { HomePage } from "../pages/HomePage";
import { TemplatesPage } from "../pages/TemplatesPage";


export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    Component() {
      return <Root />;
    },
    children:[
      {
        path:"",
        element:<HomePage/>
      },
      {
        path:"/tier-list/:tierType",
        element: <TierPage/>
      },
      {
        path:"/all",
        element:<TemplatesPage/>
      }
    ]
  },
]);
