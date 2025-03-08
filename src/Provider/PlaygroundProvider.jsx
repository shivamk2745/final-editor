import { createContext, useContext, useEffect, useState } from "react";
import { json } from "react-router-dom";
import { v4 } from "uuid";
export const PlaygroundContext = createContext();

const fileData = [
  {
    id: v4(),
    folderName: "MERN",
    files: [
      {
        id: v4(),
        fileName: "Node",
        language: "javascript",
        code: `console.log("hello node");`,
      },
    ],
  },
  {
    id: v4(),
    folderName: "Array",
    files: [
      {
        id: v4(),
        fileName: "2Sum",
        language: "cpp",
        code: `cout<<"hello node";`,
      },
    ],
  },
];

const defaultCode = {
  ["cpp"]: `#include <iostream>
using namespace std;
int main() {
    cout << "hello world";
    return 0;
}`,
  ["java"]: `class HelloWorld {
    public static void main(String[] args) {
        System.out.println("hello world");
    }
}`,
  ["javascript"]: `console.log("hello world")`,
  ["python"]: `print("hello world")`,
};

const PlaygroundProvider = ({ children }) => {
  const [folders, setFolders] = useState(() => {
    const localData = localStorage.getItem("data");
    if (localData) {
      return JSON.parse(localData);
    }
    return fileData;
  });

  const createPlayground = (folderVal) => {
    const { folderName, fileName, language } = folderVal;
    const newFolder = [...folders];
    newFolder.push({
      id: v4(),
      folderName: folderName,
      files: [
        {
          id: v4(),
          fileName: fileName,
          language: language,
          code: defaultCode[language],
        },
      ],
    });
    setFolders(newFolder);
    localStorage.setItem("data", JSON.stringify(newFolder));
    console.log(newFolder);
  };

  const createFolder = (folderName) => {
    const duplicate = folders.some(
      (folder) => folder.folderName === folderName
    );
    if (duplicate) {
      alert("Folder Name already exist");
    } else {
      const newFolder = {
        id: v4(),
        folderName: folderName,
        items: [],
      };
      const updateFolder = [...folders, newFolder];
      localStorage.setItem("data", JSON.stringify(updateFolder));
      setFolders(updateFolder);
    }
  };
  const editFolder = (folderName, id) => {
    const duplicate = folders.some(
      (folder) => folder.folderName === folderName
    );

    if (duplicate) {
      alert("Folder name already exists");
    } else {
      const updateFolder = folders.map((folder) => {
        if (folder.id === id) {
          return {
            ...folder,
            folderName: folderName,
          };
        }
        return folder;
      });
      localStorage.setItem("data", JSON.stringify(updateFolder));
      setFolders(updateFolder);
    }
    // console.log(targetFolder.folderName);
  };

  const editFile = (fileName, id) => {
    const duplicate = folders.some((folder) => {
      return folder.files.some((file) => file.fileName === fileName);
    });
    if (duplicate) {
      alert("File name already exists");
    } else {
      const updateFile = folders.map((folder) => {
        return {
          ...folder,
          files: folder.files.map((file) => {
            if (file.id === id) {
              return {
                ...file,
                fileName: fileName,
              };
            }
            return file;
          }),
        };
      });
      localStorage.setItem("data", JSON.stringify(updateFile));
      setFolders(updateFile);
    }
  };
  const deleteFolder = (id) => {
    // delete id wala folder
    const updateFolder = folders.filter((folder) => {
      return folder.id !== id;
    });
    localStorage.setItem("data", JSON.stringify(updateFolder));
    setFolders(updateFolder);
    // update loaclStorage
  };

  const deleteCard = (id) => {
    const updatedCard = folders.map((folder) => {
      return {
        ...folder,
        files: folder.files.filter((file) => file.id !== id),
      };
    });
    setFolders(updatedCard);
    localStorage.setItem("data", JSON.stringify(updatedCard));
    console.log(updatedCard);
  };

  const newPlayground = ({ fileName, language, id }) => {
    const currFolder = folders.find((folder) => folder.id === id);
    const duplicate = (currFolder.files || []).some(
      (folder) => folder.fileName === fileName
    );
    if (duplicate) {
      alert("Same file name exist");
    } else {
      if (currFolder) {
        const updatedFolder = {
          ...currFolder,
          files: [
            ...(currFolder.files || []),
            {
              id: v4(),
              fileName: fileName,
              language: language,
              code: defaultCode[language],
            },
          ],
        };

        const updatedFolders = folders.map((folder) =>
          folder.id === id ? updatedFolder : folder
        );

        setFolders(updatedFolders);
        localStorage.setItem("data", JSON.stringify(updatedFolders));
        console.log(updatedFolders);
      } else {
        console.error("Folder not found");
      }
    }
  };

  useEffect(() => {
    if (!localStorage.getItem("data")) {
      localStorage.setItem("data", JSON.stringify(folders));
    }
  }, []);

  const getDefaultCode = (fileId, folderId) => {
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].id === folderId) {
        for (let j = 0; j < folders[i].files.length; j++) {
          const currFile = folders[i].files[j];
          if (currFile.id === fileId) {
            return currFile.code;
          }
        }
      }
    }
  };

  const getLanguage = (fileId, folderId) => {
    for (let i = 0; i < folders.length; i++) {
      if (folders[i].id === folderId) {
        for (let j = 0; j < folders[i].files.length; j++) {
          const currFile = folders[i].files[j];
          if (currFile.id === fileId) {
            return currFile.language;
          }
        }
      }
    }
  };

  const updateLanguage = (fileId, folderId, language) => {
    const updateFolder = [...folders];
    for (let i = 0; i < updateFolder.length; i++) {
      if (updateFolder[i].id === folderId) {
        for (let j = 0; j < updateFolder[i].files.length; j++) {
          const currFile = updateFolder[i].files[j];
          if (currFile.id === fileId) {
            updateFolder[i].files[j].code = defaultCode[language];
            updateFolder[i].files[j].language = language;
          }
        }
      }
    }
    setFolders(updateFolder);
    localStorage.setItem("data", JSON.stringify(updateFolder));
  };

  const saveNewCode = (fileId, folderId, code) => {
    // Avoid shallow copy ,Instead create Deep copy of array of objects
    const updatedFolders = folders.map((folder) => {
      if (folder.id === folderId) {
        const updatedFiles = folder.files.map((file) => {
          if (file.id === fileId) {
            return { ...file, code: code };
          }
          return file;
        });
        return { ...folder, files: updatedFiles };
      }
      return folder;
    });

    localStorage.setItem("data", JSON.stringify(updatedFolders));
    setFolders(updatedFolders);
  };

  const submitCode = (code, language) => {
    codeSubmission();
  };
  const playGroundFeature = {
    folders,
    createPlayground,
    createFolder,
    deleteFolder,
    newPlayground,
    deleteCard,
    editFolder,
    editFile,
    getDefaultCode,
    getLanguage,
    updateLanguage,
    saveNewCode,
    submitCode,
  };
  return (
    <PlaygroundContext.Provider value={playGroundFeature}>
      {children}
    </PlaygroundContext.Provider>
  );
};
export default PlaygroundProvider;
