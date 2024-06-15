import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
import { switchPrivilege } from "../modules/posts/utils/privilegeSlice";
import ProfilePicUploader from "../components/ProfilePicUploader";

export default function Profile() {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(true);
  const initialProfilePic = {
    src: "/images/profile-pic-placeholder.webp",
    file: undefined as File | undefined,
    trash: undefined as undefined | string,
  };
  const [profilePic, setProfilePic] = useState(initialProfilePic);

  function onProfilePicChange(src?: string, file?: File) {
    if (src === undefined) {
      photoDeletion(profilePic.trash as string);
    } else {
      const newProfile = { ...profilePic, src: src, file: file };
      photoUpload(newProfile);
    }
  }

  const [formValues, setFormvalues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    newPassword: "",
    newPasswordConfirmation: "",
  });

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    newPassword: "",
    newPasswordConfirmation: "",
  });

  async function photoUpload(newProfile: typeof initialProfilePic) {
    const jwtToken = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {};
    if (jwtToken) {
      headers["Authorization"] = `Bearer ${jwtToken}`;
    }
    const url = "http://localhost:3000/user/profile/photo";
    try {
      const response = await axios.putForm(url, newProfile, {
        headers: headers,
      });

      setProfilePic({
        file: response.data.photo,
        src: `http://localhost:3000/${response.data.photo.path}`,
        trash: response.data.photo.filename,
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      if (
        axiosError?.response?.status === 403 ||
        axiosError?.response?.status === 401
      ) {
        // if it's forbidden or unauthorized it will be logged out
        dispatch(switchPrivilege("user")); // logout
        navigate("/log-in");
      } else {
        navigate("/server-error");
      }
    }
  }

  async function photoDeletion(toDelete: string) {
    const jwtToken = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {};
    if (jwtToken) {
      headers["Authorization"] = `Bearer ${jwtToken}`;
    }
    const url = "http://localhost:3000/user/profile/photo";
    try {
      await axios.putForm(
        url,
        { trash: toDelete },
        {
          headers: headers,
        },
      );

      setProfilePic(initialProfilePic);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (
        axiosError?.response?.status === 403 ||
        axiosError?.response?.status === 401
      ) {
        // if it's forbidden or unauthorized it will be logged out
        dispatch(switchPrivilege("user")); // logout
        navigate("/log-in");
      } else {
        navigate("/server-error");
      }
    }
  }

  function onSelect(event: ChangeEvent<HTMLSelectElement>) {
    const selectedOption = (event.target as HTMLSelectElement).value;
    if (selectedOption === "Yes") {
      setSelected(false);
    } else {
      setSelected(true);
      setFormvalues({
        ...formValues,
        password: "",
        newPassword: "",
        newPasswordConfirmation: "",
      });
      setErrors({
        ...errors,
        password: "",
        newPassword: "",
        newPasswordConfirmation: "",
      });
    }
  }

  useEffect(() => {
    (async function fetchPost() {
      const jwtToken = localStorage.getItem("accessToken");
      const headers: Record<string, string> = {};
      if (jwtToken) {
        headers["Authorization"] = `Bearer ${jwtToken}`;
      }
      try {
        const url = `http://localhost:3000/user/profile`;
        const response = await axios.get(url, {
          headers: headers,
        });

        if (response.data.user.photo) {
          setProfilePic({
            ...profilePic,
            src: `http://localhost:3000/${response.data.user.photo.path}`,
            trash: response.data.user.photo.filename,
          });
        }

        setFormvalues({
          ...formValues,
          ...response.data.user,
          password: "",
        });
      } catch (error) {
        const axiosError = error as AxiosError;
        if (
          axiosError?.response?.status === 403 ||
          axiosError?.response?.status === 401
        ) {
          // if it's forbidden or unauthorized it will be logged out
          dispatch(switchPrivilege("user")); // logout
          navigate("/log-in");
        } else {
          dispatch(switchPrivilege("user"));
          navigate("/server-error");
        }
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormvalues({ ...formValues, [name]: value });
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    /* this is required to keep errors updated */
    setErrors({
      first_name: "",
      last_name: "",
      email: "",
      username: "",
      password: "",
      newPassword: "",
      newPasswordConfirmation: "",
    });

    if (!selected) {
      // password changed
      if (!formValues.password.length) {
        setErrors({
          ...errors,
          password: "Current password has not been entered",
          newPassword: "",
          newPasswordConfirmation: "",
        });
        return;
      }
      if (formValues.password.length && !formValues.newPassword.length) {
        setErrors({
          ...errors,
          password: "",
          newPassword: "new password has not been entered",
          newPasswordConfirmation: "",
        });
        return;
      }
    }

    // http://localhost:3000/user/profile
    //https://dummy-blog.adaptable.app/user/profile
    const apiUrl = "http://localhost:3000/user/profile";
    // get security token
    const jwtToken = localStorage.getItem("accessToken");
    const headers: Record<string, string> = {};
    if (jwtToken) {
      headers["Authorization"] = `Bearer ${jwtToken}`;
    }
    try {
      const response = await axios.put(apiUrl, formValues, {
        headers: headers,
      });

      if (response.data.errors) {
        /* fix form's error management */
        const newErrors = {
          first_name: "",
          last_name: "",
          email: "",
          username: "",
          password: "",
          newPassword: "",
          newPasswordConfirmation: "",
        };
        while (response.data.errors.length > 0) {
          const error = response.data.errors.shift();
          switch (error.path) {
            case "first_name":
              newErrors.first_name = error.msg;
              break;
            case "last_name":
              newErrors.last_name = error.msg;
              break;
            case "email":
              newErrors.email = error.msg;
              break;
            case "username":
              newErrors.username = error.msg;
              break;
            case "password":
              newErrors.password = error.msg;
              break;
            case "newPassword":
              newErrors.newPassword = error.msg;
              break;
            case "newPasswordConfirmation":
              newErrors.newPasswordConfirmation = error.msg;
              break;
            default:
              break;
          }
        }
        setErrors(newErrors);
      } else {
        // logout
        dispatch(switchPrivilege("user"));
        localStorage.removeItem("accessToken");
        navigate("/log-in");
      }
    } catch (error) {
      // logout
      dispatch(switchPrivilege("user"));
      localStorage.removeItem("accessToken");
      navigate("/server-error");
    }
  }

  return (
    <div className="mb-[5vh] mt-[10vh] flex w-full flex-col items-center justify-center gap-5">
      {/*MARK: Profile-pic */}
      <div className="flex w-[75vw] max-w-[800px] flex-col items-center rounded-xl border-slate-200 bg-white px-10 py-5 shadow-md md:flex-row dark:border-slate-900 dark:bg-slate-800">
        <div className="md:mr-5">
          <img
            className="rounded-full max-md:size-[80px]"
            width={100}
            height={100}
            src={profilePic.src}
          />
        </div>
        <div className="flex flex-col-reverse md:flex-col">
          {profilePic.src === "/images/profile-pic-placeholder.webp" && (
            <h3 className="text-2xl antialiased max-md:text-center max-md:text-xl">
              Add a profile picture
            </h3>
          )}
          {profilePic.src !== "/images/profile-pic-placeholder.webp" && (
            <h3 className="text-2xl antialiased max-md:text-center max-md:text-xl">
              Update profile picture
            </h3>
          )}

          {/* <p className="max-md:text-center max-md:text-sm">Profile-pic.jpg</p> */}
        </div>
        <div className="md:ml-auto">
          <ProfilePicUploader
            profilePic={profilePic}
            onProfilePicChange={onProfilePicChange}
          />
        </div>
      </div>
      {/* MARK: Profile-info */}
      <div className="flex w-[75vw] max-w-[800px] flex-col rounded-xl border-slate-200 bg-white px-10 py-5 shadow-md dark:border-slate-900 dark:bg-slate-800">
        <div className="my-5">
          <h2 className="antialiased max-md:text-center md:text-3xl">
            Update your information here
          </h2>
        </div>
        <form onSubmit={onSubmit} className="mt-5 flex flex-col gap-5">
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="flex-1">
              <label htmlFor="first_name">First Name</label>
              <input
                onChange={handleInputChange}
                className="py focus:shadow-outline mt-1 box-border h-10 w-full  cursor-pointer appearance-none rounded border  border-slate-400 bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-purple-400 focus:outline-none dark:border-slate-400 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-300"
                name="first_name"
                type="text"
                placeholder="Your first name"
                maxLength={40}
                value={formValues.first_name}
              />
              <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
                {errors.first_name}
              </span>
            </div>
            <div className="flex-1">
              <label htmlFor="last_name">Last Name</label>
              <input
                onChange={handleInputChange}
                className="py focus:shadow-outline mt-1 box-border h-10 w-full  cursor-pointer appearance-none rounded border  border-slate-400 bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-purple-400 focus:outline-none dark:border-slate-400 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-300"
                name="last_name"
                type="text"
                placeholder="Your last name"
                maxLength={70}
                value={formValues.last_name}
              />
              <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
                {errors.last_name}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="flex-1">
              <label htmlFor="email">Email</label>
              <input
                onChange={handleInputChange}
                className="py focus:shadow-outline mt-1 box-border h-10 w-full  cursor-pointer appearance-none rounded border  border-slate-400 bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-purple-400 focus:outline-none dark:border-slate-400 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-300"
                name="email"
                type="email"
                placeholder="Your email address"
                maxLength={120}
                value={formValues.email}
              />
              <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
                {errors.email}
              </span>
            </div>
            <div className="flex-1">
              <label htmlFor="username">Username</label>
              <input
                onChange={handleInputChange}
                className="py focus:shadow-outline mt-1 box-border h-10 w-full  cursor-pointer appearance-none rounded border  border-slate-400 bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-purple-400 focus:outline-none dark:border-slate-400 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-300"
                name="username"
                type="text"
                placeholder="Your username"
                maxLength={80}
                value={formValues.username}
              />
              <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
                {errors.username}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="flex-1">
              <label htmlFor="new_password">Update password</label>
              <select
                onChange={onSelect}
                className="py focus:shadow-outline mt-1 box-border h-10 w-full cursor-pointer appearance-none rounded border  border-slate-400 bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-purple-400 focus:outline-none dark:border-slate-400 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-300"
              >
                <option defaultValue={""}>Select an option</option>
                <option>Yes</option>
                <option>No</option>
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="password">Current Password</label>
              <input
                className="py focus:shadow-outline mt-1 box-border h-10 w-full  cursor-pointer appearance-none rounded border  border-slate-400 bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-purple-400 focus:outline-none dark:border-slate-400 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-300"
                name="password"
                type="password"
                placeholder="Your current password"
                maxLength={70}
                value={formValues.password}
                onChange={handleInputChange}
                disabled={selected}
              />
              <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
                {errors.password}
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="flex-1">
              <label htmlFor="newPassword">New Password</label>
              <input
                className="py focus:shadow-outline mt-1 box-border h-10  w-full cursor-pointer appearance-none rounded  border border-slate-400 bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-purple-400 focus:outline-none dark:border-slate-400 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-300"
                name="newPassword"
                type="password"
                placeholder="Your new password"
                maxLength={70}
                onChange={handleInputChange}
                disabled={selected}
                value={formValues.newPassword}
              />
              <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
                {errors.newPassword}
              </span>
            </div>
            <div className="flex-1">
              <label htmlFor="newPasswordConfirmation">
                Confirm new password
              </label>
              <input
                className="py focus:shadow-outline mt-1 box-border h-10 w-full  cursor-pointer appearance-none rounded border  border-slate-400 bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-purple-400 focus:outline-none dark:border-slate-400 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-300"
                name="newPasswordConfirmation"
                type="password"
                placeholder="Your new password"
                maxLength={70}
                onChange={handleInputChange}
                disabled={selected}
                value={formValues.newPasswordConfirmation}
              />
              <span className="text-red-600 max-sm:text-xs sm:text-sm dark:text-red-300">
                {errors.newPasswordConfirmation}
              </span>
            </div>
          </div>

          <div className="mt-5 flex w-full">
            <button
              className="h-10 w-full cursor-pointer rounded border border-[#461c5f]  bg-[#721ea3] px-2 py-2 text-sm font-semibold text-slate-100 hover:bg-[#540d7d] dark:bg-purple-500 dark:hover:bg-purple-600"
              type="submit"
            >
              Update Information
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
