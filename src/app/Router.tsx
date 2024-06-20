import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Navbar from "../components/Navbar";
import Hero from "../pages/Hero";
import Posts from "../pages/Posts";
import NotFound from "../pages/NotFound";
import Post from "../pages/Post";
import ServerError from "../pages/ServerError";
import LogIn from "../pages/log-in";
import SignUp from "../pages/sign-up";
import Profile from "../pages/Profile";

const Router = () => {
  //https://dummy-blog.adaptable.app/
  const server = "http://localhost:3000/";

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Hero />,
    },
    {
      path: "/",
      element: <Navbar />,
      children: [
        {
          path: "posts",
          element: <Posts server={server} />,
        },
        {
          path: "posts/post/:name",
          element: <Post server={server} />,
        },

        {
          path: "profile",
          element: <Profile server={server} />,
        },
      ],
      errorElement: <NotFound />,
    },
    {
      path: "log-in",
      element: <LogIn server={server} />,
    },
    {
      path: "sign-up",
      element: <SignUp server={server} />,
    },
    {
      path: "server-error",
      element: <ServerError />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
