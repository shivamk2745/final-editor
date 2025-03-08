import React from "react";
// import { useAuth } from "../context/AuthProvider";
// import toast from "react-hot-toast";
// import axios from "axios";

function Logout() {
  //   const [authUser, setAuthUser] = useAuth();

  //   const handleLogout = async () => {
  //     try {
  //       setAuthUser(null);
  //       localStorage.removeItem("uid");
  //       await axios.post("/api/user/logout").then((res) => {
  //         toast.success(res.data.message);
  //       });

  //       setTimeout(() => {
  //         window.location.reload();
  //       }, 3000);
  //     } catch (err) {
  //       console.log(err);
  //       toast.error("Something went wrong " + err.message);
  //     }
  //   };

  return (
    <div>
      <button
                  className="px-5 py-3 rounded-md text-2xl font-medium bg-gradient-to-r from-cyan-300 to-violet-500 hover:from-cyan-400 hover:to-violet-600 text-neutral-900 hover:text-white transition-colors duration-300"
    
        // onClick={() => handleLogout()}
      >
        Logout
      </button>
    </div>
  );
}

export default Logout;
