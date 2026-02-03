import axios from "axios";

export const githubAxios = (accessToken: string) => {
  return axios.create({
    baseURL: "https://api.github.com",
    timeout: 10000,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
    },
  });
};
