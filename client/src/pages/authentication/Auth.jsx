import { apiClient } from "@/lib/api-client.js";
import { useAppStore } from "@/store";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants.js";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Auth = () => {
  const navigate = useNavigate();

  const { setUserInfo } = useAppStore();

  const [signUp, setSignUp] = useState(false);
  let [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function validateInputs() {
    if (password !== confirmPassword) {
      toast.error("Password doesn't match");
      return false;
    }
    return true;
  }

  async function handleSignup() {
    if (validateInputs()) {
      try {
        const response = await apiClient.post(
          SIGNUP_ROUTE,
          { email, password },
          { withCredentials: true, credentials: 'include' }
        );

        if (response.status === 201) {
          setUserInfo(response.data.user);
          navigate("/profile");
        }
      } catch (error) {
        console.log(error.response.data);
        toast.error(error.response.data);
      }
    }
  }

  async function handleLogin() {
    try {
      const response = await apiClient.post(
        LOGIN_ROUTE,
        { email, password },
        { withCredentials: true, credentials: 'include' }
      );

      if (response.data.user.id) {
        setUserInfo(response.data.user);
        if (response.data.user.profileSetup) navigate("/chat");
        else navigate("/profile");
      }
    } catch (error) {
      console.log(error.response.data);
      toast.error(error.response.data);
    }
  }

  function onSubmitHandler(e) {
    e.preventDefault();

    if (signUp) {
      if (validateInputs) {
        handleSignup();
      }
    } else {
      handleLogin();
    }
  }

  return (
    <div className="bg-[#1b1c24] flex justify-center items-center min-h-[100vh]">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-4 justify-center text-center px-20 py-10 rounded-lg text-white bg-gray-300"
      >
        <h1 className="text-4xl text-black pt-6 pb-4">
          {signUp ? "SignUp" : "Login"}
        </h1>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70 text-black"
          >
            <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
            <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
          </svg>
          <input
            type="email"
            className="grow text-white"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label className="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70 text-black"
          >
            <path
              fillRule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="password"
            className="grow text-white"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {signUp && (
          <label className="input input-bordered flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              className="h-4 w-4 opacity-70 text-black"
            >
              <path
                fillRule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clipRule="evenodd"
              />
            </svg>
            <input
              type="password"
              className="grow text-white"
              placeholder="Confirm Password"
              name="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </label>
        )}
        <button className="btn text-xl mt-4">
          {signUp ? "SignUp" : "Login"}
        </button>
        {signUp && (
          <div className="mt-2 flex items-center gap-4">
            <input
              id="terms"
              className="checkbox checkbox-xs checkbox-primary text-black"
              type="checkbox"
              required
            />
            <label className="select-none text-black" htmlFor="terms">
              Agree to our terms and condition
            </label>
          </div>
        )}
        <div className="mt-1 select-none flex flex-col gap-4 text-black">
          <p className="text-md">
            {signUp ? "Already have an account" : "Create new account"}?{" "}
            <span
              className="underline cursor-pointer"
              onClick={() => setSignUp((prev) => !prev)}
            >
              {signUp ? "Click here." : "Sign Up"}
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Auth;
