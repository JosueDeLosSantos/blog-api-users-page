import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "../components/Home";
import Posts from "../components/Posts";
import User from "../components/user";
import NotFound from "../features/NotFound";
import Post from "../components/Post";
import ServerError from "../features/ServerError";

const Router = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
      errorElement: <NotFound />,
    },
    {
      path: "posts",
      element: <Posts />,
    },
    {
      path: "server-error",
      element: <ServerError />,
    },
    {
      path: ":name",
      element: <User />,
    },
    {
      path: "posts/post/:name",
      element: <Post />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
