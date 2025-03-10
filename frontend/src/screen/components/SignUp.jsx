import React from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Provider/AuthProvider";

function SignUp() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    const user = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    try {
      const res = await axios.post("/api/user/signup", user);
      if (res.data) {
        setAuthUser(res.data.user);
        localStorage.setItem("uid", JSON.stringify(res.data.user));
        toast.success(`Welcome to CodeEdu ${res.data.user.name}`);

        setTimeout(() => {
          navigate("/profile");
        }, 3000);
      }
    } catch (err) {
      if (err.response) {
        setTimeout(() => {
          toast.error(err.response.data.message);
        }, 1000);
      }
    }
  };

  

  return (
    <div className="hero bg-gradient-to-b from-[#1d1d1d] via-[#1d1d1d] to-[#041c31] flex flex-col min-h-screen justify-center items-center md:flex-row-reverse">
      <div className="hero-content flex md:flex-col lg:flex-row-reverse lg:justify-betweenb lg:gap-64">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white p-2">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-500">
              Welcome! 
            </span>
             Thank you for signing up on{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-500">
              CodeEdu
            </span>
          </h1>
          <p className="py-6 m-2 text-white text-2xl sm:text-base">
          Join our community of developers and take your coding skills to the next level. 
          Access hundreds of courses, join live workshops, and connect with peers around the world.
          </p>
        </div>

        <div className="card bg-base-100 shrink-0 shadow-2xl w-full mp-4">
          <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <h2 className="text-2xl font-bold mb-4 text-violet-600">SignUp</h2>
              <label className="label">
                <span className="label-text text-2xl">Name</span>
              </label>
              <input
                type="text"
                placeholder="name"
                className="input input-bordered text-xl p-3"
                name="name"
                {...register("name", { required: true })}
              />
              {errors.name && <span className="text-red-500">This field is required</span>}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-2xl">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered text-xl p-3"
                name="email"
                {...register("email", { required: true })}
              />
              {errors.email && <span className="text-red-500">This field is required</span>}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-2xl">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered text-xl p-3"
                name="password"
                {...register("password", { required: true })}
              />
              {errors.password && <span className="text-red-500">This field is required</span>}
            </div>
            <div className="card-actions flex justify-between mt-6">
              <button className="btn bg-transparent bg-clip-border bg-gradient-to-r from-cyan-300 to-violet-500 text-2xl hover:text-white">
                SignUp
              </button>
              <span className="mt-4 text-xl">
                Already registered?
                <Link to="/" className="text-violet-600 ml-1">
                  Login!
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
