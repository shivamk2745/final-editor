import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Provider/AuthProvider";

function CreateProfile() {
  const navigate = useNavigate();
  const [authUser, setAuthUser] = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {

    const skillsArray = data.skills.split(" ").filter(skill => skill);
    const languagesArray = data.languages.split(" ").filter(language => language);

    const user = {
      name: data.name,
      email: data.email,
      pronoun: data.pronoun,
      college: data.college,
      linkdin: data.linkdin,
      github: data.github,
      languages: languagesArray,
      skills: skillsArray,
      bio: data.bio,
    };


    try {
      const res = await axios.post("/api/profile/CreateProfile", user);
      if (res.data) {
        setTimeout(() => {
          toast.success("Profile created successfully");
          navigate("/");
        }, 3000);
      }
    } catch (err) {
      if (err.response) {
        console.log(err.response.data.message);
      }
    }
  };

  return (
    <div className="hero bg-gradient-to-b from-[#1d1d1d] via-[#1d1d1d] to-[#041c31] flex flex-col min-h-screen justify-center items-center md:flex-row-reverse">
      <div className="hero-content flex md:flex-col lg:flex-row-reverse lg:gap-64">
      <div className="text-center mx-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-500">
              Welcome!
            </span>
            You are just one step away from being a part of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-violet-500">
              CodeEdu
            </span>
          </h1>
        </div>

        <div className="card bg-base-100 shrink-0 shadow-2xl w-full max-w-screen-md p-4">
          <form className="card-body" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <h2 className="text-3xl font-bold mb-4 text-violet-600">
                Profile
              </h2>
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
              {errors.name && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-2xl">Email</span>
              </label>
              <input
                type="email"
                placeholder="email"
                className="input input-bordered text-xl p-3"
                value={authUser.email}
                name="email"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-2xl">Pronoun</span>
              </label>
              <select 
              type="text"
              name="pronoun" 
              className="input input-bordered text-xl p-3" 
              {...register("pronoun", { required: true })}>
                <option value="He/Him">He/Him</option>
                <option value="She/Her">She/Her</option>
                <option value="Other">Other</option>
              </select>
              {errors.pronoun && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-2xl">College</span>
              </label>
              <input
                type="text"
                placeholder="college name"
                className="input input-bordered text-xl p-3"
                name="college"
                {...register("college", { required: true })}
              />
              {errors.college && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-2xl">Linkedln</span>
              </label>
              <input
                type="text"
                placeholder="url"
                className="input input-bordered text-xl p-3"
                name="linkdin"
                {...register("linkdin", { required: true })}
              />
              {errors.linkdin && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-2xl">Github</span>
              </label>
              <input
                type="text"
                placeholder="url"
                className="input input-bordered text-xl p-3"
                name="github"
                {...register("github", { required: true })}
              />
              {errors.github && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-2xl">Skills</span>
              </label>
              <input
                type="text"
                placeholder="leave space between skills"
                className="input input-bordered text-xl p-3"
                name="skills"
                {...register("skills", { required: true })}
              />
              {errors.skills && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-2xl">Languages</span>
              </label>
              <input
                type="text"
                placeholder="leave space between skills"
                className="input input-bordered text-xl p-3"
                name="languages"
                {...register("languages", { required: true })}
              />
              {errors.languages && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text text-2xl">About You</span>
              </label>
              <textarea
                type="text"
                placeholder="Bio"
                className="input input-bordered text-xl p-3"
                name="bio"
                {...register("bio", { required: true })}
              />
              {errors.bio && (
                <span className="text-red-500">This field is required</span>
              )}
            </div>
            <div className="card-actions flex justify-between mt-6">
              <button className="btn bg-transparent bg-clip-border bg-gradient-to-r from-cyan-300 to-violet-500 text-2xl hover:text-white">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateProfile;
