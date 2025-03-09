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
    <div className="min-h-screen bg-gradient-to-b from-[#1d1d1d] via-[#1d1d1d] to-[#041c31] flex items-center justify-center p-4">
      <div className="container mx-auto p-6 bg-white shadow-md rounded-md max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 flex flex-col items-center">
            <img
              src="https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?t=st=1718279448~exp=1718283048~hmac=c8f69237246c4edaed512b0eee5b8c202a23c13f6a00716aca2bb63f272f9634&w=826"
              alt="Profile avatar"
              className="rounded-full w-40 h-40 mb-4"
            />
          </div>

          <div className="col-span-2">
            <div className="grid grid-cols-2 gap-6">
              <div className="form-control col-span-2">
                <label className="label font-semibold text-gray-600">First Name</label>
                <p className="text-gray-800 py-2 px-4 bg-gray-100 rounded-md">
                  {profile.name}
                </p>
              </div>
              <div className="form-control col-span-2">
                <label className="label font-semibold text-gray-600">Email</label>
                <p className="text-gray-800 py-2 px-4 bg-gray-100 rounded-md">
                  {profile.email}
                </p>
              </div>
              <div className="form-control">
                <label className="label font-semibold text-gray-600">College</label>
                <p className="text-gray-800 py-2 px-4 bg-gray-100 rounded-md">
                  {profile.college}
                </p>
              </div>
              <div className="form-control">
                <label className="label font-semibold text-gray-600">Pronoun</label>
                <p className="text-gray-800 py-2 px-4 bg-gray-100 rounded-md">
                  {profile.pronoun}
                </p>
              </div>

        
              <div className="form-control col-span-2">
                <label className="label font-semibold text-gray-600">Skills</label>
                <div className="text-gray-800 py-2 px-4 bg-gray-100 rounded-md">
                  {profile.skills ? (
                    <ul className="list-disc list-inside">
                      {profile.skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No skills listed</p>
                  )}
                </div>
              </div>

              
              <div className="form-control col-span-2">
                <label className="label font-semibold text-gray-600">Languages</label>
                <div className="text-gray-800 py-2 px-4 bg-gray-100 rounded-md">
                  {profile.languages ? (
                    <ul className="list-disc list-inside">
                      {profile.languages.map((language, index) => (
                        <li key={index}>{language}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>No languages listed</p>
                  )}
                </div>
              </div>

              <div className="form-control col-span-2">
                <label className="label font-semibold text-gray-600">Bio</label>
                <p className="text-gray-800 py-2 px-4 bg-gray-100 rounded-md">
                  {profile.bio}
                </p>
              </div>
              <div className="form-control col-span-2">
                <label className="label font-semibold text-gray-600">LinkedIn</label>
                <a className="text-gray-800 py-2 px-4 bg-gray-100 rounded-md">
                  {profile.linkdin}
                </a>
              </div>
              <div className="form-control col-span-2">
                <label className="label font-semibold text-gray-600">GitHub</label>
                <a className="text-gray-800 py-2 px-4 bg-gray-100 rounded-md">
                  {profile.github}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowProfile;
