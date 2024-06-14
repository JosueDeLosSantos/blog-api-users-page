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

/* // POSTS
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import { postsList } from "../modules/posts/utils/postsSlice";
import { switchPrivilege } from "../modules/posts/utils/privilegeSlice";
import { RootState } from "../app/rootReducer";
import { postTypes } from "../modules/posts/types";
import axios, { AxiosError } from "axios";
import { useEffect } from "react"; */

const Router = () => {
  /* // MARK: posts preloader
  const dispatch: AppDispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts);

  // http://localhost:3000/
  // https://dummy-blog.adaptable.app/
  const server = "http://localhost:3000/";

  useEffect(() => {
    if (!posts.length) {
      (async function fetchPosts() {
        // get security token
        const jwtToken = localStorage.getItem("accessToken");
        const headers: Record<string, string> = {};
        if (jwtToken) {
          headers["Authorization"] = `Bearer ${jwtToken}`;
        }
        try {
          const response = await axios.get(server, {
            headers: headers,
          });

          dispatch(switchPrivilege("admin"));
          dispatch(postsList(response.data.posts));
        } catch (error) {
          const axiosError = error as AxiosError;

          if (
            axiosError?.response?.status === 403 ||
            axiosError?.response?.status === 401
          ) {
            type dataType = {
              posts: postTypes[];
            };
            const userData = axiosError?.response?.data as dataType;

            if (userData.posts) {
              dispatch(postsList(userData.posts));
            }
          } else {
            // logout
            dispatch(switchPrivilege("user"));
            localStorage.removeItem("accessToken");
          }
        }
      })();
    }
  }, [posts, dispatch]); */

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Navbar />,
      children: [
        {
          index: true,
          element: <Hero />,
        },
        {
          path: "posts",
          element: <Posts />,
        },
        {
          path: "posts/post/:name",
          element: <Post />,
        },
        {
          path: "log-in",
          element: <LogIn />,
        },
        {
          path: "sign-up",
          element: <SignUp />,
        },
        {
          path: "profile",
          element: <Profile />,
        },
        {
          path: "server-error",
          element: <ServerError />,
        },
      ],
      errorElement: <NotFound />,
    },
  ]);
  return <RouterProvider router={router} />;
};

export default Router;
