export default function Profile() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center">
      <div className="flex w-[75vw] max-w-[700px] flex-col items-center rounded-xl border-slate-200 bg-white px-10 py-5 shadow-md md:flex-row">
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
    </div>
  );
}
