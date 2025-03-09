import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../Provider/AuthProvider";

function LogIn() {
  const [authUser, setAuthUser]= useAuth();
  const navigate = useNavigate(); 

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) =>{
    const user = {
      email: data.email,
      password: data.password,
    };
    
    await axios.post('/api/user/login', user)
    .then((res) => {
      if (res.data) {
        setAuthUser(res.data.user);
        localStorage.setItem("uid", JSON.stringify(res.data.user));
        toast.success(`Welcome to CodeEdu ${res.data.user.name}`);
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      }
    })
    .catch((err) => {
      if (err.response) {
        setTimeout(() => {
          toast.error(err.response.data.message);
        }, 1000);
      }
    });
    }

    
  return (
    <dialog id="my_modal_3" className="modal">
      <div className="modal-box">
        <button
          className="btn btn-sm absolute right-2 top-2 bg-transparent bg-clip-border bg-gradient-to-r from-cyan-300 to-violet-500 z-10"
          type="button" 
          onClick={() => document.getElementById('my_modal_3').close()}
        >
          ✕
        </button>
        <h3 className="font-bold text-lg">Login</h3>
        <div className="card min-w-screen w-full bg-base-100">
          <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered"
                {...register("email", { required: true })}
              />
              {errors.email && <span className="text-red-500">This field is required</span>}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                {...register("password", { required: true })}
              />
              {errors.password && <span className="text-red-500">This field is required</span>}
            </div>
            <div className="card-actions flex justify-between mt-3">
              <button className="btn bg-transparent bg-clip-border bg-gradient-to-r from-cyan-300 to-violet-500 hover:text-white">
                Login
              </button>
              <span className="mt-4">
                Not registered?
                <Link to="/signup">
                  <span className="cursor-pointer text-violet-600"> SignUp!</span>
                </Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </dialog>
  );
}

export default LogIn;
