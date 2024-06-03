import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import he from "he";
import axios, { AxiosError } from "axios";
import { commentType } from "../../../pages/Post";
import { onePostType } from "../types";
import TextareaAutosize from "react-textarea-autosize";

function CommentsBox({
  post_id,
  formData,
  isEditing,
  setIsEditing,
  setFormData,
  addComment,
  setPost,
}: {
  post_id: string;
  formData: commentType;
  isEditing: boolean;
  setIsEditing: (arg: boolean) => void;
  setFormData: (arg: commentType) => void;
  addComment: (arg: commentType) => void;
  setPost: (arg: onePostType) => void;
}) {
  const navigate = useNavigate();

  const handleCommentChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const [commentError, setCommentError] = useState("");
  // MARK: onSubmit
  async function onSubmit(e: FormEvent) {
    e.preventDefault();

    // get security token
    const jwtToken = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {};
    if (jwtToken) {
      headers["Authorization"] = `Bearer ${jwtToken}`;
    }
    // http://localhost:3000/
    // https://dummy-blog.adaptable.app/comments
    const apiUrl = "http://localhost:3000/user/comments";

    if (isEditing) {
      const target = e.target as HTMLElement;
      if (target.innerText === "Cancel") {
        setIsEditing(false);
        setFormData({
          _id: "",
          comment: "",
          author: "",
          name: "",
          email: "",
          date: "",
          post: post_id,
          __v: 0,
        });
        setCommentError("");
      } else {
        try {
          const response = await axios.put(apiUrl, formData, {
            headers: headers,
          });

          /* If no errors are returned, add a date and id to the most recent added comment to keep 
					the page updated */
          if (!response.data.errors) {
            // clear errors
            setCommentError("");
            // update post
            setPost(response.data.post);
            setIsEditing(false);
            // clear form fields
            setFormData({
              _id: "",
              comment: "",
              author: "",
              name: "",
              email: "",
              date: "",
              post: post_id,
              __v: 0,
            });
          } else {
            setCommentError(response.data.errors[0].msg);
          }
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
    } else {
      try {
        const response = await axios.post(apiUrl, formData, {
          headers: headers,
        });

        /* If no errors are returned, add a date and id to the most recent added comment to keep 
			the page updated */
        if (!response.data.errors) {
          formData.date = response.data.post.comments[0].date;
          formData.author = response.data.user._id;
          formData._id = response.data.post.comments[0]._id;
          formData.name = `${response.data.user.first_name} ${response.data.user.last_name}`;
          formData.email = response.data.user.email;

          // update comments array
          addComment(formData);
          // clear form fields
          setFormData({
            _id: "",
            comment: "",
            author: "",
            name: "",
            email: "",
            date: "",
            post: post_id,
            __v: 0,
          });
          // clear errors
          setCommentError("");
        } else {
          setCommentError(response.data.errors[0].msg);
        }
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
  }
  // MARK: Form
  return (
    <div
      id="edit-comment-box"
      className="mx-auto box-border flex max-w-screen-md items-center justify-center border-0 border-solid"
    >
      <div className="mx-auto mb-8 mt-14 box-border w-11/12">
        <form className="box-border w-full rounded p-4 " onSubmit={onSubmit}>
          <h2 className="font-lighter mb-4 text-xl tracking-wider ">
            Leave a Comment
          </h2>
          <div className="w-full">
            <TextareaAutosize
              name="comment"
              onInput={handleCommentChange}
              maxLength={3000}
              className="box-border w-full resize-none rounded-sm border border-solid border-slate-300 bg-slate-100 px-3 py-2  focus:border-blue-300  focus:outline-none dark:bg-slate-950"
              placeholder="Type Comment...*"
              minRows={5}
              value={he.decode(formData.comment)}
              required
            ></TextareaAutosize>
            <span className="text-sm text-gray-400">{`${formData.comment.length}/3000`}</span>
            <br />
            <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
              {commentError}
            </span>
          </div>

          {!isEditing && (
            <div className="box-border flex">
              <button
                type="submit"
                className="mt-5 cursor-pointer rounded-sm bg-black px-6 py-4 text-white hover:bg-slate-700 focus:outline-none focus:ring-offset-2 active:border-blue-300 dark:border dark:hover:bg-slate-900"
              >
                Post Comment →
              </button>
            </div>
          )}
          {isEditing && (
            <div className="mt-4 box-border flex gap-2 sm:gap-3">
              <button
                onClick={onSubmit}
                type="button"
                className="cursor-pointer rounded-sm border-0 bg-green-100 px-2 py-1 text-slate-600 ring-2 ring-green-400 hover:bg-green-200 dark:bg-green-400 dark:text-slate-800 dark:ring-green-800"
              >
                Accept
              </button>
              <button
                onClick={onSubmit}
                type="button"
                className="cursor-pointer rounded-sm border-0 bg-slate-50 px-2 py-1 text-slate-500 ring-2 ring-slate-400 hover:bg-slate-100 dark:border dark:border-blue-300 dark:bg-slate-900 dark:text-slate-50 dark:ring-0 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default CommentsBox;