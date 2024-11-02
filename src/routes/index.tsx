import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/Error";
import Root from "./Route";
import TierPage from "../pages/TierPage";
import { HomePage } from "../pages/HomePage";


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
        path:"/:tierType",
        element: <TierPage/>
      }
    ]
  },
]);
