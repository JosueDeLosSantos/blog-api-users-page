import { Link, useNavigate } from "react-router-dom";
import MenuBar from "../features/MenuBar";
import { IconButton, Menu, MenuItem } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import CommentsBox from "../features/CommentsBox";
import { onePostType } from "../features/posts/types";
import he from "he"; // decodes mongodb encoded HTML
import React, { useState, useEffect } from "react";
import ForumIcon from "@mui/icons-material/Forum";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Badge from "@mui/material/Badge";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { red, grey } from "@mui/material/colors";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../app/store";
import { switchPrivilege } from "../features/posts/privilegeSlice";
import { RootState } from "../app/rootReducer";
import axios, { AxiosError } from "axios";

const theme = createTheme({
	palette: {
		primary: {
			main: red[500]
		},
		secondary: {
			main: grey[900]
		},
		info: {
			main: grey[50]
		}
	}
});

export type commentType = {
	_id: string;
	comment: string;
	author: string;
	date: string;
	email: string;
	name: string;
	post: string;
	__v: number;
};

function Post() {
	const dispatch: AppDispatch = useDispatch();
	const member = useSelector((state: RootState) => state.privilege);
	const initialPost = null as unknown as onePostType;
	const [post, setPost] = useState<onePostType>(initialPost);
	const navigate = useNavigate();
	const [isEditing, setIsEditing] = useState(false);
	const [commentToEdit, setCommentToEdit] = useState<commentType>({
		_id: "",
		comment: "",
		author: "",
		name: "",
		email: "",
		date: "",
		post: "",
		__v: 0
	});

	// position the scroll at the top of the page
	// window.scrollTo(0, 0);

	// keep comments array updated to avoid unnecessary API calls
	function addComment(arg: commentType) {
		// Change array's order to show the most recent one on the top
		if (post) {
			setPost({ ...post, comments: [arg, ...post.comments] });
		}
	}

	// this method is more effective than useRef for scrolling into view
	// though is less React friendly
	function ScrollTo(v: string) {
		const commentsSection = document.getElementById("comments-box");
		const postsSection = document.getElementById("post-header");
		if (commentsSection && postsSection) {
			window.scrollTo({
				top:
					v === "comments"
						? commentsSection?.offsetTop
						: postsSection?.offsetTop,
				behavior: "smooth"
			});
		}
	}

	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	type userType = {
		email: string;
		exp: number;
		first_name: string;
		iat: number;
		last_name: string;
		username: string;
		__v: number;
		_id: string;
	};
	const [user, setUser] = useState<userType>({} as userType);
	useEffect(() => {
		(async function fetchPost() {
			const url = window.location.href;
			const urlId = url.split("/")[5];
			const jwtToken = localStorage.getItem("accessToken");
			const headers: Record<string, string> = {};
			if (jwtToken) {
				headers["Authorization"] = `Bearer ${jwtToken}`;
			}
			try {
				const server = `http://localhost:3000/user/posts/${urlId}`;
				const response = await axios.get(server, {
					headers: headers
				});

				dispatch(switchPrivilege("admin"));
				setUser(response.data.user);
				setPost(response.data.post);
				setCommentToEdit({ ...commentToEdit, post: response.data.post._id });
			} catch (error) {
				const axiosError = error as AxiosError;

				if (
					axiosError?.response?.status === 403 ||
					axiosError?.response?.status === 401
				) {
					type userPostType = { post: onePostType };
					const userData = axiosError?.response?.data as userPostType;
					dispatch(switchPrivilege("user"));
					setPost(userData.post);
				} else {
					navigate("/server-error");
				}
			}
		})();

		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};

		// Add event listener
		window.addEventListener("resize", handleResize);

		// Remove event listener on cleanup
		return () => {
			window.removeEventListener("resize", handleResize);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// MARK: Delete/Edit buttons

	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = (e: React.MouseEvent<Element, MouseEvent>) => {
		const target = e.target as HTMLElement;
		const { innerText } = target;

		switch (innerText) {
			case "Delete":
				deleteComment(anchorEl!.id);
				break;
			case "Edit":
				editComment(anchorEl!.id);
				break;
			default:
				setAnchorEl(null);
		}
	};

	async function deleteComment(commentId: string) {
		const apiUrl = `http://localhost:3000/user/comments/${commentId}`;
		try {
			const jwtToken = localStorage.getItem("accessToken");
			const headers: Record<string, string> = {};
			if (jwtToken) {
				headers["Authorization"] = `Bearer ${jwtToken}`;
			}
			const response = await axios.delete(apiUrl, {
				headers: headers
			});
			setAnchorEl(null);
			setPost(response.data.post);
		} catch (error) {
			const axiosError = error as AxiosError;

			if (
				axiosError?.response?.status === 403 ||
				axiosError?.response?.status === 401
			) {
				navigate("/log-in");
			} else {
				navigate("/server-error");
			}
		}
	}

	function editComment(commentId: string) {
		const selectedComment = post.comments.filter(
			(comment) => comment._id === commentId
		)[0];
		setAnchorEl(null);
		setIsEditing(true);
		setCommentToEdit(selectedComment);

		const commentsBoxSection = document.getElementById("edit-comment-box");
		window.scrollTo({
			top: commentsBoxSection?.offsetTop,
			behavior: "smooth"
		});
	}

	// MARK: return

	return (
		<div className='bg-slate-100 min-h-screen'>
			<MenuBar />
			<main className='pl-5 pr-5 pb-5 pt-24 flex gap-4'>
				{member === "admin" && (
					<ThemeProvider theme={theme}>
						<div
							className={
								windowWidth > 770
									? "pt-10 w-fit h-screen fixed flex flex-col gap-8"
									: "bg-white z-50 p-2 fixed bottom-0 left-0 w-screen shadow-[0px_-0.5px_5px_rgb(148,163,184)] flex justify-around"
							}
						>
							<div>
								<IconButton onClick={() => ScrollTo("comments")}>
									<Badge
										badgeContent={post?.comments.length}
										color='primary'
									>
										<ForumOutlinedIcon
											fontSize='medium'
											color='secondary'
										/>
									</Badge>
								</IconButton>
							</div>

							<div>
								<IconButton onClick={() => ScrollTo("posts")}>
									<KeyboardArrowUpIcon
										fontSize='medium'
										color='secondary'
									/>
								</IconButton>
							</div>
						</div>
					</ThemeProvider>
				)}

				<article className='bg-white sm:max-lg:w-9/12 mx-auto rounded-lg pb-3 border border-solid border-slate-200'>
					<header id='post-header'>
						<div
							className='md:mb-0 w-full  mx-auto relative'
							style={{ height: "24em" }}
						>
							<div
								className='absolute left-0 bottom-0 w-full h-full z-10'
								style={{
									backgroundImage:
										"linear-gradient(180deg,transparent,rgba(0,0,0,.7))"
								}}
							></div>
							<img
								src={`http://localhost:3000/${post?.file.path}`}
								className='absolute left-0 top-0 w-full h-full z-0 object-cover rounded-lg'
							/>
							<div className='p-4 absolute bottom-0 left-0 z-20'>
								<h2 className='text-3xl sm:text-4xl font-semibold text-gray-100 leading-tight'>
									{post?.title && he.decode(post.title)}
								</h2>
								<div className='flex mt-3'>
									<div>
										<p className='font-semibold text-gray-200 text-sm'>
											{" "}
											{post?.author && he.decode(post?.author)}{" "}
										</p>
										<p className='font-semibold text-gray-400 text-xs'>
											{" "}
											{post?.date && he.decode(post?.date)}{" "}
										</p>
									</div>
								</div>
							</div>
						</div>
					</header>
					{/* Post's content */}
					{post?.post && (
						<div
							className='prose max-w-screen-md border-b-[0.5px] border-t-0 border-l-0 border-r-0 border-solid border-slate-200 mx-auto sm:mt-5 md:mt-8 p-5'
							dangerouslySetInnerHTML={{
								__html: he.decode(post.post) // renders decoded HTML
							}}
						/>
					)}
					{/* Comment's box */}
					{member === "admin" && post?.post && (
						<CommentsBox
							formData={commentToEdit}
							setFormData={setCommentToEdit}
							setIsEditing={setIsEditing}
							isEditing={isEditing}
							addComment={addComment}
							setPost={setPost}
							post_id={`${post._id}`}
						/>
					)}
					<div id='comments-box' className='max-w-screen-md mx-auto'>
						{post?.comments?.length > 0 && (
							<div className='text-center mx-auto'>
								<h2>Comments</h2>
							</div>
						)}
						{member === "user" && (
							<div className='mx-auto w-11/12 pt-5 pr-5 pl-5 pb-10 text-slate-600'>
								If you want to leave a comment{" "}
								<Link
									className='text-slate-800 font-bold no-underline'
									to='/log-in'
								>
									Log in
								</Link>
							</div>
						)}
						{/* MARK: comments */}
						{post?.comments.map((comment) => (
							<div
								key={comment._id}
								className='box-border w-11/12 mb-8 mx-auto border-solid border border-slate-300 p-5 rounded-lg'
							>
								<div className='max-[370px]:flex-col max-[370px]:items-start max-[370px]:gap-0 flex gap-2 items-end h-5 mb-5 relative'>
									<div className='max-sm:text-xs sm:text-sm text-slate-500'>
										{comment.name}
									</div>
									<div className='max-[370px]:hidden max-sm:text-2xl sm:text-4xl text-slate-400 '>
										<div>.</div>
									</div>
									<div className='max-sm:text-[0.70rem] max-sm:leading-[1.390] sm:text-[0.80rem] sm:leading-snug text-slate-500'>
										{comment.date}
									</div>
									{member === "admin" &&
										user._id === comment.author && (
											<div>
												<IconButton
													id={comment._id}
													className='absolute top-[-15px] right-[-15px]'
													onClick={handleClick}
												>
													<MoreHorizIcon />
												</IconButton>
												<Menu
													id='basic-menu'
													anchorEl={anchorEl}
													open={open}
													elevation={1}
													onClose={handleClose}
													MenuListProps={{
														"aria-labelledby": "basic-button"
													}}
												>
													<MenuItem
														onClick={(
															e: React.MouseEvent
														) => {
															handleClose(e);
														}}
													>
														Delete
													</MenuItem>
													<MenuItem
														onClick={(
															e: React.MouseEvent
														) => {
															handleClose(e);
														}}
													>
														Edit
													</MenuItem>
												</Menu>
											</div>
										)}
								</div>
								<div className='text-base'>
									{he.decode(comment.comment)}
								</div>
							</div>
						))}
					</div>
				</article>
			</main>
			{member === "user" && (
				<span onClick={() => ScrollTo("comments")}>
					<div className='p-3 bg-neutral-950 w-fit rounded-full fixed bottom-5 left-5'>
						<ThemeProvider theme={theme}>
							{post?.comments && (
								<Badge
									badgeContent={post.comments.length}
									color='primary'
								>
									<ForumIcon fontSize='large' color='info' />
								</Badge>
							)}
						</ThemeProvider>
					</div>
				</span>
			)}
		</div>
	);
}

export default Post;
