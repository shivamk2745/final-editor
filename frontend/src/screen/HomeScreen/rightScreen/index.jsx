import { useContext, useState, useEffect } from "react";
import "./index.scss";
import PlaygroundProvider, {
  PlaygroundContext,
} from "../../../Provider/PlaygroundProvider";
import { ModalContext } from "../../../Provider/ProviderModal";
import { useNavigate } from "react-router-dom";
import questionsData from "../../PlayGroundScreen/data.json";

// Card component for displaying individual questions
const QuestionCard = ({ question }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    // Format the fileName for URL (replace spaces with underscore)
    const formattedFileName = question.fileName.replace(/\s+/g, '_');
    
    // Use the same URL pattern that works for your Card component
    navigate(`/editorpage/playground/${question.id}/practice/${formattedFileName}`);
    
    // For debugging - see if we're navigating correctly
    console.log(`Navigating to: /editorpage/playground/${question.id}/practice/${formattedFileName}`);
  };
  
  // Define color classes based on difficulty
  const difficultyColors = {
    "Easy": "bg-green-900/20 text-green-400",
    "Medium": "bg-yellow-900/20 text-yellow-400",
    "Hard": "bg-red-900/20 text-red-400"
  };

  return (
    <div 
      className="rounded-lg bg-neutral-800 border border-neutral-700 p-4 hover:border-neutral-500 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-3xl font-semibold text-white truncate pr-2">{question.fileName}</h3>
        {question.difficulty && (
          <span className={`text-xl px-2 py-1 rounded-full font-medium ${difficultyColors[question.difficulty]}`}>
            {question.difficulty}
          </span>
        )}
      </div>
      <p className="text-gray-400 text-xl mb-4 line-clamp-2">
        {question.descriptions?.substring(0, 100)}...
      </p>
      <div className="flex flex-wrap gap-2">
        {question.company?.slice(0, 3).map((company, index) => (
          <span key={index} className="text-xl px-2 py-1 bg-neutral-700 text-neutral-300 rounded-full">
            {company}
          </span>
        ))}
        {question.company?.length > 3 && (
          <span className="text-xs px-2 py-1 bg-neutral-700 text-neutral-300 rounded-full">
            +{question.company.length - 3}
          </span>
        )}
      </div>
    </div>
  );
};

// Topic section component
const TopicSection = ({ title, questions }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className="mb-6 border border-neutral-700 rounded-lg overflow-hidden bg-neutral-900">
      <div 
        className="flex justify-between items-center p-4 cursor-pointer hover:bg-neutral-800/50"
        onClick={toggleExpand}
      >
        <div className="flex items-center">
          <span className="material-icons text-yellow-400 mr-3">folder</span>
          <span className="text-3xl font-semibold text-white">{title} ({questions.length})</span>
        </div>
        <span className="material-icons text-gray-400">
          {isExpanded ? "expand_less" : "expand_more"}
        </span>
      </div>

      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-neutral-900/50">
          {questions.map((question) => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      )}
    </div>
  );
};

// Keep your existing Card component
const Card = ({ fileName, language, id, folderId }) => {
  const navigate = useNavigate();
  const modalFeature = useContext(ModalContext);
  const handleCardDelete = () => {
    modalFeature.openModal("delete-folder", { id });
  };
  const handleCardEdit = () => {
    modalFeature.openModal("edit-folder", { id });
  };
  const handleId = () => {
    navigate(`/editorpage/playground/${id}/${folderId}/${fileName}`);
  };
  return (
    <div className="card">
      <div className="card-data" onClick={handleId}>
        <img src="logo.png" alt="logo" />
        <div className="card-header">
          <h4 className="text-size text-white">{fileName}</h4>
          <h4 className="text-size text-white">Language : {language}</h4>
        </div>
      </div>
      <div className="card-tool">
        <span className="material-icons text-white" onClick={handleCardDelete}>
          delete
        </span>
        <span className="material-icons text-white" onClick={handleCardEdit}>
          edit
        </span>
      </div>
    </div>
  );
};

// Keep your existing Folder component
const Folder = ({ folderTitle, cards, id }) => {
  const modalFeature = useContext(ModalContext);
  const { deleteFolder, newPlayground, deleteCard } =
    useContext(PlaygroundContext);
  const handlePlayground = () => {
    modalFeature.openModal("New-playground", { id });
  };
  const handleEdit = () => {
    modalFeature.openModal("edit-folder", { id });
  };
  const handleDelete = () => {
    modalFeature.openModal("delete-folder", { id });
  };

  return (
    <div className="folder">
      <div className="folder-header">
        <div className="folder-title">
          <span className="material-icons" style={{ color: "rgb(255,202,40)" }}>
            folder
          </span>
          <span style={{ fontSize: "1.7rem", fontWeight: "600", color: "white" }}>
            {folderTitle}
          </span>
        </div>
        <div className="folder-tool">
          <span className="material-icons text-white" onClick={handleDelete}>
            delete
          </span>
          <span className="material-icons text-white" onClick={handleEdit}>
            edit
          </span>
          <button onClick={handlePlayground}>
            <span className="material-icons bg-[#1d1d1d] text-white">add</span>
            <span className="text-white">New Playground</span>
          </button>
        </div>
      </div>

      <div className="card-section">
        {cards?.map((card, index) => {
          return (
            <Card
              fileName={card?.fileName}
              language={card?.language}
              folderId={id}
              id={card?.id}
              key={index}
            />
          );
        })}
      </div>
    </div>
  );
};

// Filter component
const FilterDropdown = ({ selectedFilters, toggleFilter, applyFilters }) => {
  return (
    <div className="absolute right-0 top-12 w-48 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-10">
      <div className="p-3">
        <h3 className="text-white text-2xl font-medium mb-2">Difficulty</h3>
        <div className="space-y-2">
          {["Easy", "Medium", "Hard"].map((difficulty) => (
            <label key={difficulty} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFilters.includes(difficulty)}
                onChange={() => toggleFilter(difficulty)}
                className=" text-cyan-500 rounded border-neutral-600 focus:ring-offset-neutral-800 focus:ring-cyan-500 bg-neutral-700"
              />
              <span className="text-gray-300 text-xl">{difficulty}</span>
            </label>
          ))}
        </div>
        <div className="mt-3 flex justify-end">
          <button
            onClick={applyFilters}
            className="px-3 py-1 text-2xl bg-cyan-600 text-white text-sm rounded hover:bg-cyan-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

// Search component
const SearchBar = ({ searchTerm, setSearchTerm, isSearchOpen }) => {
  if (!isSearchOpen) return null;
  
  return (
    <div className="mt-4 mb-6 relative">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by problem name, company, or description..."
          className="w-full bg-neutral-800 border border-neutral-700 rounded-lg py-2 pl-10 pr-4 text-white focus:outline-none focus:border-cyan-500"
        />
        <span className="material-icons absolute left-3 top-2 text-gray-400">search</span>
        {searchTerm && (
          <button
            className="absolute right-3 top-2 text-gray-400 hover:text-gray-200"
            onClick={() => setSearchTerm("")}
          >
            <span className="material-icons">close</span>
          </button>
        )}
      </div>
    </div>
  );
};

const RightScreen = () => {
  const { folders } = useContext(PlaygroundContext);
  const modalFeature = useContext(ModalContext);
  const [topicMap, setTopicMap] = useState({});
  const [activeTab, setActiveTab] = useState("practice"); // "practice" or "playground"
  const [filteredTopicMap, setFilteredTopicMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  useEffect(() => {
    // Group valid questions by topic (filter out entries that don't have topics)
    const validQuestions = questionsData.filter(q => q.topic);
    
    const groupedByTopic = validQuestions.reduce((acc, question) => {
      if (!question.topic) return acc;
      
      if (!acc[question.topic]) {
        acc[question.topic] = [];
      }
      acc[question.topic].push(question);
      return acc;
    }, {});
    
    setTopicMap(groupedByTopic);
    // Initialize filteredTopicMap with all questions at first load
    setFilteredTopicMap(groupedByTopic);
  }, []);
  
  useEffect(() => {
    // Apply filters and search when their values change
    if (searchTerm.trim() !== "" || selectedFilters.length > 0) {
      applyFiltersAndSearch();
    } else {
      // When no filters are applied, show all questions
      setFilteredTopicMap(topicMap);
    }
  }, [searchTerm, selectedFilters, topicMap]);
  
  const toggleFilter = (difficulty) => {
    setSelectedFilters(prev => 
      prev.includes(difficulty)
        ? prev.filter(item => item !== difficulty)
        : [...prev, difficulty]
    );
  };
  
  const applyFiltersAndSearch = () => {
    let filtered = {};
    
    // Make a deep copy of the original topic map
    for (const topic in topicMap) {
      // First apply difficulty filters
      let filteredQuestions = topicMap[topic];
      
      // Apply difficulty filters if any are selected
      if (selectedFilters.length > 0) {
        filteredQuestions = filteredQuestions.filter(question => 
          selectedFilters.includes(question.difficulty)
        );
      }
      
      // Then apply search filter
      if (searchTerm.trim() !== "") {
        const term = searchTerm.toLowerCase();
        filteredQuestions = filteredQuestions.filter(question => 
          // Search in fileName
          question.fileName?.toLowerCase().includes(term) ||
          // Search in description
          question.descriptions?.toLowerCase().includes(term) ||
          // Search in company names
          question.company?.some(company => company.toLowerCase().includes(term))
        );
      }
      
      // Only add topics that have matching questions
      if (filteredQuestions.length > 0) {
        filtered[topic] = filteredQuestions;
      }
    }
    
    setFilteredTopicMap(filtered);
  };
  
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedFilters([]);
    setFilteredTopicMap(topicMap); // Reset to show all questions
  };
  
  const openFolder = () => {
    modalFeature.openModal("New_folder");
  };
  
  return (
    <div className="right-screen">
      {/* Tabs for switching between Practice and Playground */}
      <div className="flex border-b border-neutral-700 mb-6">
        <button 
          className={`py-3 px-5 font-medium text-lg  ${
            activeTab === "practice" 
              ? "text-cyan-400 border-b-2 border-cyan-400" 
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("practice")}
        >
          Practice Problems
        </button>
        <button 
          className={`py-3 px-5 font-medium text-lg${
            activeTab === "playground" 
              ? "text-cyan-400 border-b-2 border-cyan-400" 
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("playground")}
        >
          My Playground
        </button>
      </div>

      {activeTab === "practice" ? (
        <div className="practice-section">
          <div className="right-header mb-6">
            <div className="title text-2xl text-white">
              <span style={{ fontWeight: "400" }}>Practice</span>{" "}
              <span style={{ fontWeight: "700" }}>Problems</span>
            </div>
            <div className="flex gap-3 relative">
              <button 
                className={` text-white text-2xl bg-[#1d1d1d] ${isFilterOpen ? 'bg-neutral-700' : ''}`}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <span className="material-icons ">filter_list</span>
                <span>Filter {selectedFilters.length > 0 ? `(${selectedFilters.length})` : ""}</span>
              </button>
              <button 
                className={` text-white text-2xl bg-[#1d1d1d] ${isSearchOpen ? 'bg-neutral-700' : ''}`}
                onClick={() => setIsSearchOpen(!isSearchOpen)}
              >
                <span className="material-icons">search</span>
                <span>Search</span>
              </button>
              
              {isFilterOpen && (
                <FilterDropdown 
                  selectedFilters={selectedFilters} 
                  toggleFilter={toggleFilter}
                  applyFilters={() => setIsFilterOpen(false)}
                />
              )}
            </div>
          </div>
          
          <SearchBar 
            searchTerm={searchTerm} 
            setSearchTerm={setSearchTerm} 
            isSearchOpen={isSearchOpen} 
          />
          
          {/* Show active filters if any */}
          {(selectedFilters.length > 0 || searchTerm) && (
            <div className="flex items-center mb-4">
              <span className="text-gray-400 mr-2">Active filters:</span>
              <div className="flex flex-wrap gap-2">
                {selectedFilters.map(filter => (
                  <span 
                    key={filter} 
                    className="text-xs px-2 py-1 bg-neutral-700 text-white rounded-full flex items-center"
                  >
                    {filter}
                    <button 
                      className="ml-1 text-gray-400 hover:text-white"
                      onClick={() => toggleFilter(filter)}
                    >
                      <span className="material-icons text-xs">close</span>
                    </button>
                  </span>
                ))}
                
                {searchTerm && (
                  <span className="text-xs px-2 py-1 bg-neutral-700 text-white rounded-full flex items-center">
                    Search: {searchTerm}
                    <button 
                      className="ml-1 text-gray-400 hover:text-white"
                      onClick={() => setSearchTerm("")}
                    >
                      <span className="material-icons text-xs">close</span>
                    </button>
                  </span>
                )}
                
                <button 
                  className="text-xs px-2 py-1 bg-red-900/30 text-red-400 rounded-full hover:bg-red-900/50 ml-2"
                  onClick={resetFilters}
                >
                  Clear all
                </button>
              </div>
            </div>
          )}
          
          {Object.keys(filteredTopicMap).length > 0 ? (
            Object.keys(filteredTopicMap).map((topic) => (
              <TopicSection
                key={topic}
                title={topic}
                questions={filteredTopicMap[topic]}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <span className="material-icons text-5xl mb-4">search_off</span>
              <p className="text-xl mb-2">No problems match your filters</p>
              <p className="text-sm">Try adjusting your search or filters</p>
              {(searchTerm || selectedFilters.length > 0) && (
                <button 
                  onClick={resetFilters}
                  className="mt-4 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-cyan-400 rounded-lg transition-colors"
                >
                  Clear all filters
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="playground-section">
          <div className="right-header">
            <div className="title">
              <span className="text-white">My</span>{" "}
              <span className="text-white">Playground</span>
            </div>
            <button onClick={openFolder}>
              <b>
                <span
                  className="material-icons bg-[#1d1d1d] text-white"
                  style={{ fontWeight: "bold", fontSize: "1.2rem" }}
                >
                  add
                </span>
              </b>
              <span className="bg-[#1d1d1d] text-white">New Folder</span>
            </button>
          </div>

          {folders?.map((folder, index) => {
            return (
              <Folder
                folderTitle={folder?.folderName}
                cards={folder?.files}
                id={folder?.id}
                key={index}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RightScreen;