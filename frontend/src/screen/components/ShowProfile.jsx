import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../Provider/AuthProvider";

function ShowProfile() {
  const [authUser] = useAuth();
  const [profile, setProfile] = useState({});

  useEffect(() => {
    const getProfile = async () => {
      try {
        if (authUser) {
          await axios
            .get(`/api/profile/showProfile/${authUser.id}`)
            .then((res) => {
              setProfile({
                name: res.data.user.name,
                email: res.data.user.email,
                college: res.data.user.college,
                pronoun: res.data.user.pronoun,
                linkdin: res.data.user.linkdin,
                skills: res.data.user.skills,
                bio: res.data.user.bio,
                languages: res.data.user.languages,
                github: res.data.user.github,
              });
            });
        }
      } catch (error) {
        console.log(error);
      }
    };

    getProfile();
  }, [authUser]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-300 to-violet-500 flex items-center justify-center p-6">
      <div className="container mx-auto bg-white bg-opacity-95 shadow-xl rounded-2xl overflow-hidden max-w-5xl backdrop-blur-sm">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar with profile image and key info */}
          <div className="md:w-1/3 bg-gradient-to-b from-cyan-500 to-violet-600 text-white p-8 flex flex-col items-center justify-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-300 to-violet-500 blur-md transform scale-110"></div>
              <img
                src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1718279448~exp=1718283048~hmac=c8f69237246c4edaed512b0eee5b8c202a23c13f6a00716aca2bb63f272f9634&w=826"
                alt="Profile avatar"
                className="relative rounded-full w-40 h-40 object-cover border-4 border-white shadow-md"
              />
            </div>
            <h1 className="text-2xl font-bold mb-2">{profile.name}</h1>
            <p className="text-cyan-100 mb-6">{profile.pronoun}</p>
            
            <div className="w-full space-y-4 mt-6">
              <a href={profile.linkdin} className="flex items-center justify-center w-full py-2 px-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </a>
              <a href={profile.github} className="flex items-center justify-center w-full py-2 px-4 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
            </div>
          </div>

          {/* Main content area */}
          <div className="md:w-2/3 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-cyan-300 pb-2">About Me</h2>
              <p className="text-gray-700 leading-relaxed">{profile.bio || "No bio provided"}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-cyan-300 pb-2">Contact</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800 font-medium">{profile.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">College</p>
                    <p className="text-gray-800 font-medium">{profile.college || "Not specified"}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-cyan-300 pb-2">Skills</h3>
                {profile.skills && profile.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-gradient-to-r from-cyan-300 to-violet-500 text-white rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-700">No skills listed</p>
                )}
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 border-b-2 border-cyan-300 pb-2">Languages</h3>
              {profile.languages && profile.languages.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((language, index) => (
                    <span key={index} className="px-3 py-1 bg-gradient-to-r from-violet-500 to-cyan-300 text-white rounded-full text-sm">
                      {language}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-700">No languages listed</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowProfile;