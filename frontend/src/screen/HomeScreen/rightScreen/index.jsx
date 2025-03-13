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
          <h4 className="text-size">{fileName}</h4>
          <h4 className="text-size">Language : {language}</h4>
        </div>
      </div>
      <div className="card-tool">
        <span className="material-icons" onClick={handleCardDelete}>
          delete
        </span>
        <span className="material-icons" onClick={handleCardEdit}>
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
          <span style={{ fontSize: "1.7rem", fontWeight: "600" }}>
            {folderTitle}
          </span>
        </div>
        <div className="folder-tool">
          <span className="material-icons" onClick={handleDelete}>
            delete
          </span>
          <span className="material-icons" onClick={handleEdit}>
            edit
          </span>
          <button className="button-header" onClick={handlePlayground}>
            <span className="material-icons">add</span>
            <span>New Playground</span>
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

const RightScreen = () => {
  const { folders } = useContext(PlaygroundContext);
  const modalFeature = useContext(ModalContext);
  const [topicMap, setTopicMap] = useState({});
  const [activeTab, setActiveTab] = useState("practice"); // "practice" or "playground"
  
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
  }, []);
  
  const openFolder = () => {
    modalFeature.openModal("New_folder");
  };
  
  return (
    <div className="right-screen">
      {/* Tabs for switching between Practice and Playground */}
      <div className="flex border-b border-neutral-700 mb-6">
        <button 
          className={`py-3 px-5 font-medium text-4xl ${
            activeTab === "practice" 
              ? "text-cyan-400 border-b-2 border-cyan-400" 
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("practice")}
        >
          Practice Problems
        </button>
        <button 
          className={`py-3 px-5 font-medium text-4xl ${
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
            <div className="title text-xl">
              <span style={{ fontWeight: "400" }}>Practice</span>{" "}
              <span style={{ fontWeight: "700" }}>Problems</span>
            </div>
            <div className="flex gap-3">
              <button className="button-header">
                <span className="material-icons">filter_list</span>
                <span >Filter</span>
              </button>
              <button className="button-header">
                <span className="material-icons">search</span>
                <span>Search</span>
              </button>
            </div>
          </div>
          
          {Object.keys(topicMap).map((topic) => (
            <TopicSection
              key={topic}
              title={topic}
              questions={topicMap[topic]}
            />
          ))}
        </div>
      ) : (
        <div className="playground-section">
          <div className="right-header">
            <div className="title">
              <span style={{ fontWeight: "400" }}>My</span>{" "}
              <span style={{ fontWeight: "700" }}>Playground</span>
            </div>
            <button className="button-header" onClick={openFolder}>
              <b>
                <span
                  className="material-icons"
                  style={{ fontWeight: "bold", fontSize: "1.2rem" }}
                >
                  add
                </span>
              </b>
              <span>New Folder</span>
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