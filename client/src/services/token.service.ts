export const setAccessToken = (accessToken: string) => {
  const now = new Date();

  const item = {
    value: accessToken,
    expiry: now.getTime() + import.meta.env.VITE_ACCESS_TOKEN_EXPIRY,
  };

  localStorage.setItem("accessToken", JSON.stringify(item));
};

export const getAccessToken = () => {
  const item: string | null = localStorage.getItem("accessToken");

  if (!item) {
    return null;
  }

  const accessToken = JSON.parse(item);
  const now = new Date();

  if (now.getTime() > accessToken.expiry) {
    localStorage.removeItem("accessToken");
    return null;
  }

  return accessToken.value;
};
