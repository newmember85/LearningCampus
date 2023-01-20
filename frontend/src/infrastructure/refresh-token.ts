const refreshAuthToken = async (token: string): Promise<string> => {
  try {
    const response = await fetch("http://localhost:8080/auth/token", {
      method: "POST",
      body: JSON.stringify({
        refreshToken: token,
      }),
      headers: {
        "Content-Type": "Application/json",
      },
    });

    if (response.ok) {
      response.text().then((token) => {
        return token;
      });
    }
    return "";
  } catch (error) {
    return "";
  }
};

export default refreshAuthToken;
