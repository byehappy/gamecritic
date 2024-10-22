import { createBrowserRouter } from "react-router-dom";
import ErrorPage from "../pages/Error";
import Root from "./Route";
import MainPage from "../pages/Main";


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
        element: <MainPage/>
      }
    ]
  },
]);
