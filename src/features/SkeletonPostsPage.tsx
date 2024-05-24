import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import useWindowSize from "./windowSize";

function SkeletonPostsPage() {
  const { windowWidth } = useWindowSize();

  return (
    <div className="max-h-auto min-h-screen bg-slate-100 dark:bg-slate-950">
      <Box>
        <AppBar
          className="border border-solid border-slate-200 bg-white shadow-none dark:border-slate-900 dark:bg-slate-800"
          position="fixed"
        >
          <Toolbar>
            <IconButton
              className="icons"
              size="large"
              edge="start"
              aria-label="menu"
              sx={{ mr: 2, color: "black" }}
            >
              <MenuIcon fontSize={windowWidth > 350 ? "large" : "medium"} />
            </IconButton>

            <Typography
              variant="h6"
              component="div"
              className="logo mx-sm:text-xl w-full text-center font-PressStart2P lg:text-3xl"
              sx={{
                color: "black",
              }}
            >
              {"<JCODER>"}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <div className="mx-auto w-fit pt-24">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            className="mx-5 mb-2 flex max-w-screen-lg animate-pulse flex-col rounded-lg border border-solid border-slate-200 bg-white p-2 sm:gap-1 md:flex-col md:gap-2 lg:flex-row lg:gap-4 dark:border-slate-600 dark:bg-slate-800"
            key={i}
          >
            <div className="relative w-full md:w-full lg:w-1/2">
              {/* fake image */}
              <div className="size-40  bg-slate-400 sm:size-60 md:min-h-64 md:min-w-96 lg:min-h-72 lg:min-w-96"></div>

              <div className={`absolute bottom-2 left-1 lg:hidden`}>
                <div className="w-[9.5rem] rounded-full bg-white max-lg:bg-white max-sm:h-3 sm:h-4 sm:w-[14.5rem] md:h-5 md:w-[23.5rem]"></div>
              </div>
            </div>
            <div className="w-full md:w-full  lg:w-1/2">
              <div className="mb-2 mt-1 hidden h-10 w-96 rounded-full bg-slate-500 lg:block"></div>
              <div className="h-2 w-20 rounded-full bg-slate-400 max-sm:mt-1 sm:h-3 sm:w-24 md:h-4 md:w-44 lg:h-5 lg:w-52"></div>
              <div className="mt-3 sm:mt-4 md:mt-5 lg:mt-8">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="my-1 h-2 w-[9.5rem] rounded-full bg-slate-400 sm:h-3 sm:w-[14.5rem] md:h-4 md:w-[23.5rem] lg:h-5 lg:w-96"
                  ></div>
                ))}
              </div>
              <div className="my-1 h-2 w-20 rounded-full bg-slate-400 sm:h-3 sm:w-24 md:h-4 md:w-44 lg:h-5 lg:w-44"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkeletonPostsPage;
