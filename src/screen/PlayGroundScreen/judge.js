const languageMap = {
  cpp: 54,
  java: 91,
  python: 92,
  javascript: 93,
};

// List of API keys to use
const apiKeys = [
  "a758c6442bmsh20907a51ec7bb0dp1cc96bjsn8515c109e5bd", //dead
  "1d56fec14bmsh7f4afc8d6e5e118p1715a7jsnc60d5d189b15",
  "28b7b8783dmsh7fe2c57a7ddab98p16b860jsnbf34d1ff30d0",
  "6d21534e6fmshad10938a3d99615p1a98fdjsn9a60c03e8f42",
  "c4f2ac8a4dmsh93ab5dcb24d5a74p187994jsnc2e9d6102f70",
  "582f57c26fmsh4fd4f9574baab86p1d80e7jsn86375f3d1ccc",
  "62f82e12b5msh1333820b367da98p1f7d1cjsn9953fc89ff9e",
  "70dc4a16dcmsha4bfc133a3e2b44p1a398ejsnea41d5222a04",
  "78478ed6b5msh10e68c99298238dp1553c0jsn9959db332f59",
  "07d4ef8702msh88eb08a2e76c2c4p133deejsnd9e8fa64eddc",
  // Add more keys as needed
];

const makeRequestWithFallback = async (url, options, keys) => {
  for (const key of keys) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          "x-rapidapi-key": key,
        },
      });

      if (response.ok) {
        return await response.json(); // Successfully got a response
      } else {
        console.log(
          `Key ${key} failed with status ${response.status}. Trying the next key...`
        );
      }
    } catch (error) {
      console.log(
        `Key ${key} failed with error: ${error.message}. Trying the next key...`
      );
    }
  }

  throw new Error("All keys failed.");
};

const getSubmission = async (tokenId, callback) => {
  // console.log(tokenId);

  const url = `https://judge0-ce.p.rapidapi.com/submissions/${tokenId}?base64_encoded=true&fields=*`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
  };

  try {
    const result = await makeRequestWithFallback(url, options, apiKeys);
    console.log(result);
    return result;
  } catch (error) {
    callback({
      apiStatus: "error",
      message: JSON.stringify(error),
    });
  }
};

export const createSubmission = async ({ code, language, stdin, callback }) => {
  const url =
    "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=false&fields=*";
  const options = {
    method: "POST",
    headers: {
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      language_id: languageMap[language],
      source_code: btoa(code),
      stdin: btoa(stdin),
    }),
  };

  try {
    callback({ apiStatus: "loading" });
    const result = await makeRequestWithFallback(url, options, apiKeys);
    let statusCode = 1;
    let submissionResult;
    const tokenId = result.token;
    // console.log(tokenId);

    while (statusCode === 1 || statusCode === 2) {
      try {
        submissionResult = await getSubmission(tokenId, callback);
        statusCode = submissionResult.status.id;
      } catch (error) {
        callback({
          apiStatus: "error",
          message: JSON.stringify(error),
        });
        return;
      }
    }

    if (submissionResult) {
      console.log(submissionResult);
      callback({ apiStatus: "success", data: submissionResult });
    }
  } catch (error) {
    callback({
      apiStatus: "error",
      message: JSON.stringify(error),
    });
  }
};
