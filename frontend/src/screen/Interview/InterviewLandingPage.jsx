import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const InterviewLandingPage = () => {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState('');
  const [copiedId, setCopiedId] = useState('');
  const navigate = useNavigate();

  const handleJoinInterview = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    if (!roomId.trim()) {
      setError('Please enter a room ID');
      return;
    }
    
    // Join the interview with the provided roomId
    navigate(`/interview/${roomId}`, { 
      state: { 
        name, 
        roomId, 
        isHost: false 
      } 
    });
  };

  const handleCreateInterview = (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    
    // Generate a unique roomId
    const newRoomId = uuidv4();
    
    // Copy to clipboard
    navigator.clipboard.writeText(newRoomId)
      .then(() => {
        setCopiedId(newRoomId);
        setTimeout(() => setCopiedId(''), 2000); // Reset after 2 seconds
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });

    // Navigate to the interview page as a host
    navigate(`/interview/${newRoomId}`, { 
      state: { 
        name, 
        roomId: newRoomId, 
        isHost: true 
      } 
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyan-300 to-violet-500 p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-600">
            {isCreating ? 'Create Interview' : 'Join Interview'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isCreating 
              ? 'Create a new interview session and share the ID' 
              : 'Enter your details to join an existing interview'}
          </p>
        </div>

        <form className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-md font-medium text-gray-700">Your Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
              placeholder="Enter your name"
              required
            />
          </div>

          {!isCreating && (
            <div>
              <label htmlFor="roomId" className="block text-md font-medium text-gray-700">Room ID</label>
              <input
                type="text"
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500"
                placeholder="Enter room ID shared by interviewer"
                required
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            {isCreating ? (
              <>
                <button
                  type="submit"
                  onClick={handleCreateInterview}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-violet-500 text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 relative"
                >
                  {copiedId ? 'Copied!' : 'Create & Copy ID'}
                  {copiedId && (
                    <span className="absolute top-0 right-0 -mt-2 -mr-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                      ✓
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Back to Join
                </button>
              </>
            ) : (
              <>
                <button
                  type="submit"
                  onClick={handleJoinInterview}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-violet-500 text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                >
                  Join Interview
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Create Interview
                </button>
              </>
            )}
          </div>
        </form>

        <div className="mt-8 text-center">
          <p className="text-md text-gray-600">
            {isCreating 
              ? 'After creating, share the generated ID with participants' 
              : 'Don\'t have a Room ID? Create your own interview session'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InterviewLandingPage;