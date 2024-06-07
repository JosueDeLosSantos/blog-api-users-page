import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../app/store";
import { useDispatch } from "react-redux";
import { switchPrivilege } from "../modules/posts/utils/privilegeSlice";

type userType = {
  _id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password: string;
  __v: number;
  iat: number;
  exp: number;
};

export default function Profile() {
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();
  const [selected, setSelected] = useState(true);
  const [user, setUser] = useState({} as userType);

  const [formValues, setFormvalues] = useState({
    first_name: "",
    last_name: "",
    email: "",
    username: "",
    password: "",
    newPassword: "",
    newPasswordConfirmation: "",
  });

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

        setFormvalues({
          ...formValues,
          ...response.data.user,
          password: "",
        });
        setUser(response.data.user);
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
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormvalues({ ...formValues, [name]: value });
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();

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
      console.log(response);
    } catch (error) {
      const axiosError = error as AxiosError;
      if (
        axiosError?.response?.status === 403 ||
        axiosError?.response?.status === 401
      ) {
        // if it's forbidden or unauthorized it will be logged out
        //dispatch(switchPrivilege("user")); // logout
        //navigate("/log-in");
        console.log(axiosError);
      } else {
        //navigate("/server-error");
        console.log(axiosError);
      }
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
            src="https://avatars.githubusercontent.com/u/10110568?v=4"
          />
        </div>
        <div className="flex flex-col-reverse md:flex-col">
          <h3 className="text-2xl antialiased max-md:text-center max-md:text-xl">
            Add a profile picture
          </h3>
          <p className="max-md:text-center max-md:text-sm">Profile-pic.jpg</p>
        </div>
        <div className="md:ml-auto">
          <button className="w-full cursor-pointer rounded border-none bg-white px-[1em] py-[0.5em] text-sm font-semibold text-slate-600 ring-1 ring-slate-400 hover:bg-slate-100 max-md:mt-5 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600">
            Upload
          </button>
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
