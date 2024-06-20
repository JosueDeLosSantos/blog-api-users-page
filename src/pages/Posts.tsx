import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import PostsTemplate from "../modules/posts/components/PostsTemplate";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import { postsList } from "../modules/posts/utils/postsSlice";
import { switchPrivilege } from "../modules/posts/utils/privilegeSlice";
import { RootState } from "../app/rootReducer";
import { postTypes } from "../modules/posts/types";
import SkeletonPostsPage from "./SkeletonPostsPage";
import { useNavigate } from "react-router-dom";

function Index({ server }: { server: string }) {
  const dispatch: AppDispatch = useDispatch();
  const posts = useSelector((state: RootState) => state.posts);
  const [loadState, setLoadState] = useState("loading");
  const navigate = useNavigate();

  // request all posts
  useEffect(() => {
    // make an API call only if the state array is empty
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
        setLoadState("success");
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
          setLoadState("success");
        } else {
          // logout
          dispatch(switchPrivilege("user"));
          localStorage.removeItem("accessToken");
          navigate("/server-error");
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    (loadState === "loading" && (
      <>
        <SkeletonPostsPage />
      </>
    )) ||
    (loadState === "success" && (
      <>
        <PostsTemplate server={server} posts={posts} />
      </>
    ))
  );
}

export default Index;
