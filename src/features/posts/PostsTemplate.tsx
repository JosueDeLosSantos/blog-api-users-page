import MenuBar from "../MenuBar";
import { SyntheticEvent, useEffect, useRef, useState, Suspense } from "react";
import { postTypes } from "./types";
import ColorThief from "colorthief";
import { useNavigate } from "react-router-dom";
import he from "he"; // decodes mongodb encoded HTML
import postsAmountController from "./postsAmountController";
import SkeletonPostsPage from "../SkeletonPostsPage";

function postsInitialValue(v: postTypes[]) {
  if (v.length) {
    if (v.length >= 5) {
      return v.slice(0, 5);
    } else {
      return v;
    }
  } else {
    return [];
  }
}

function PostsTemplate({
  server,
  posts,
}: {
  server: string;
  posts: postTypes[];
}) {
  const [postsCopy, setPostCopy] = useState(postsInitialValue(posts));

  const listImgRef = useRef(Array(posts?.length).fill(null));

  /* returns color white or black depending on the image dominant color */
  function contraster(img: HTMLImageElement) {
    const colorThief = new ColorThief();
    const color = colorThief.getColor(img); // dominant color
    const brightness = Math.round(
      (parseInt(color[0].toString()) * 299 +
        parseInt(color[1].toString()) * 587 +
        parseInt(color[2].toString()) * 114) /
        1000,
    );
    const textColor =
      brightness > 125
        ? {
            color: "black",
            // text outline effect
            shadow:
              "1px -1px 0 white, -1px 1px 0 white, -1px -1px 0 white, 1px 1px 0 white",
            // eslint-disable-next-line no-mixed-spaces-and-tabs
          }
        : {
            color: "white",
            // text outline effect
            shadow:
              "1px -1px 0 black, -1px 1px 0 black, 1px 1px 0 black, -1px -1px 0 black",
            // eslint-disable-next-line no-mixed-spaces-and-tabs
          };
    return textColor;
  }

  function setTitleColor(e: SyntheticEvent<HTMLImageElement, Event>) {
    const image = e.target as HTMLImageElement;
    listImgRef.current.forEach((element, index) => {
      if (element?.dataset.imgid === image.id) {
        listImgRef.current[index].style.color = contraster(image).color;
        listImgRef.current[index].style.textShadow = contraster(image).shadow;
      }
    });
  }

  const parentRef = useRef(Array(posts?.length).fill(null));
  const navigate = useNavigate();

  const postClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    parentRef.current.forEach((el) => {
      if (el && el.contains(e.target)) {
        navigate(`/posts/post/${el.id}`);
      }
    });
  };

  useEffect(() => {
    /* This function triggers when the user reaches the bottom
		of the page. */
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;

      const scrollTop = window.scrollY;

      const clientHeight = window.innerHeight;

      const isAtBottom = scrollHeight - scrollTop === clientHeight;

      if (isAtBottom) {
        if (posts.length - postsCopy.length) {
          const newPostsCopy = postsAmountController(postsCopy, posts);
          setPostCopy(newPostsCopy); // lazy loader
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [postsCopy, posts]);

  // MARK: return
  return (
    <div className="max-h-auto min-h-screen bg-slate-100 dark:bg-slate-950">
      <MenuBar />

      <div className="mx-auto w-fit pt-24">
        <Suspense fallback={<SkeletonPostsPage />}>
          {postsCopy &&
            postsCopy.map((post, index) => (
              <div
                id={post._id}
                ref={(el) => (parentRef.current[index] = el)}
                onClick={(e) => postClick(e)}
                className="mx-5 mb-2 flex max-w-screen-lg flex-col rounded-lg border border-solid border-slate-200 bg-white p-2 sm:gap-1 md:flex-col md:gap-2 lg:flex-row lg:gap-4 dark:border-slate-950 dark:bg-slate-800"
                key={post._id}
              >
                <div className="relative w-full md:w-full lg:w-1/2">
                  {post.file !== null && (
                    <img
                      onLoad={(e) => setTitleColor(e)}
                      id={post._id}
                      className="sm:mx-h-60 max-h-40 w-full object-cover md:max-h-64 lg:max-h-72"
                      src={`${server}${post.file.path}`}
                      crossOrigin="anonymous"
                      alt=""
                    />
                  )}
                  <div
                    ref={(el) => (listImgRef.current[index] = el)}
                    data-imgid={post._id}
                    className={`absolute bottom-0 left-1 lg:hidden`}
                  >
                    <h2 className="except max-sm:text-xl">
                      {he.decode(post.title)}
                    </h2>
                  </div>
                </div>

                <div className="w-full md:w-full  lg:w-1/2">
                  <h2 className="sm:text-1xl mb-2 mt-1 hidden text-xl md:text-2xl lg:block lg:text-3xl">
                    {he.decode(post.title)}
                  </h2>
                  <span className="text-xs italic text-gray-500 sm:text-sm md:text-base dark:text-gray-300">
                    {post.date}
                  </span>
                  <div className="mt-2">
                    <p className="md:text-1xl prose line-clamp-4 text-lg max-lg:mt-0 sm:text-xl lg:text-2xl dark:text-white">
                      {he.decode(post.description)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
        </Suspense>
      </div>
    </div>
  );
}

export default PostsTemplate;
