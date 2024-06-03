export default function Profile() {
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
        <form className="mt-5 flex flex-col gap-5">
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="flex-1">
              <label htmlFor="first_name">
                First Name
                <span className="text-red-500 dark:text-red-300">*</span>
              </label>
              <input
                className="py focus:shadow-outline mt-1 box-border h-10 w-full  cursor-pointer appearance-none rounded border  border-slate-400 bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-purple-400 focus:outline-none dark:border-slate-400 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-300"
                name="first_name"
                type="text"
                placeholder="Your first name"
                maxLength={40}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="last_name">
                Last Name
                <span className="text-red-500 dark:text-red-300">*</span>
              </label>
              <input
                className="py focus:shadow-outline mt-1 box-border h-10 w-full  cursor-pointer appearance-none rounded border  border-slate-400 bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-purple-400 focus:outline-none dark:border-slate-400 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-300"
                name="last_name"
                type="text"
                placeholder="Your last name"
                maxLength={70}
              />
            </div>
          </div>
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="flex-1">
              <label htmlFor="email">
                Email<span className="text-red-500 dark:text-red-300">*</span>
              </label>
              <input
                className="py focus:shadow-outline mt-1 box-border h-10 w-full  cursor-pointer appearance-none rounded border  border-slate-400 bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-purple-400 focus:outline-none dark:border-slate-400 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-300"
                name="email"
                type="email"
                placeholder="Your email address"
                maxLength={120}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="username">
                Username
                <span className="text-red-500 dark:text-red-300">*</span>
              </label>
              <input
                className="py focus:shadow-outline mt-1 box-border h-10 w-full  cursor-pointer appearance-none rounded border  border-slate-400 bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-purple-400 focus:outline-none dark:border-slate-400 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-300"
                name="username"
                type="text"
                placeholder="Your username"
                maxLength={80}
              />
            </div>
          </div>
          <div className="flex flex-col gap-5 md:flex-row">
            <div className="flex-1">
              <label htmlFor="password">
                Password
                <span className="text-red-500 dark:text-red-300">*</span>
              </label>
              <input
                className="py focus:shadow-outline mt-1 box-border h-10 w-full  cursor-pointer appearance-none rounded border  border-slate-400 bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-purple-400 focus:outline-none dark:border-slate-400 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-300"
                name="password"
                type="password"
                placeholder="Your password"
                maxLength={70}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="passwordConfirmation">
                Confirm Password
                <span className="text-red-500 dark:text-red-300">*</span>
              </label>
              <input
                className="py focus:shadow-outline mt-1 box-border h-10  w-full cursor-pointer appearance-none rounded  border border-slate-400 bg-gray-200 px-2 text-sm leading-tight text-gray-700 focus:border-purple-400 focus:outline-none dark:border-slate-400 dark:bg-gray-900 dark:text-gray-200 dark:focus:border-blue-300"
                name="passwordConfirmation"
                type="password"
                placeholder="Confirm your password"
                maxLength={70}
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
