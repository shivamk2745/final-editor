const languageMap = {
  cpp: 54,
  java: 91,
  python: 92,
  javascript: 93,
};

// Load API keys from environment variables
const loadApiKeys = () => {
  const keys = [];

  // Loop through potential environment variables
  for (let i = 1; i <= 20; i++) {
    const key = import.meta.env[`VITE_JUDGE0_API_KEY_${i}`];
    if (key) {
      keys.push(key);
    }
  }

  if (keys.length === 0) {
    console.error("No API keys found in environment variables!");
  }

  return keys;
};

const apiKeys = loadApiKeys();

const makeRequestWithFallback = async (url, options, keys) => {
  if (keys.length === 0) {
    throw new Error("No API keys available");
  }

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
          `API key failed with status ${response.status}. Trying the next key...`
        );
      }
    } catch (error) {
      console.log(
        `API request failed with error: ${error.message}. Trying the next key...`
      );
    }
  }

  throw new Error("All API keys failed.");
};

const getSubmission = async (tokenId, callback) => {
  const url = `https://judge0-ce.p.rapidapi.com/submissions/${tokenId}?base64_encoded=true&fields=*`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
    },
  };

  try {
    const result = await makeRequestWithFallback(url, options, apiKeys);
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

    while (statusCode === 1 || statusCode === 2) {
      try {
        submissionResult = await getSubmission(tokenId, callback);
        statusCode = submissionResult.status.id;

        // Add a short delay to avoid hammering the API
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        callback({
          apiStatus: "error",
          message: JSON.stringify(error),
        });
        return;
      }
    }

    if (submissionResult) {
      callback({ apiStatus: "success", data: submissionResult });
    }
  } catch (error) {
    callback({
      apiStatus: "error",
      message: JSON.stringify(error),
    });
  }
};
