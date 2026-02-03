import prisma from "@/lib/db";
import { githubAxios } from "@/lib/axios";

export const getGithubToken = async (userId: string) => {
  const account = await prisma.account.findFirst({
    where: {
      userId,
      providerId: "github",
    },
    select: {
      accessToken: true,
    },
  });

  return account?.accessToken;
};

export const getUserRepos = async (
  accessToken: string,
  page: number = 1,
  perPage: number = 10
) => {
  try {
    const api = githubAxios(accessToken);
    const response = await api.get("/user/repos", {
      params: {
        sort: "updated",
        per_page: perPage,
        page: page,
        affiliation: "owner,collaborator,organization_member",
      },
    });

    // Parse link header for pagination info if needed,
    // but for now we'll just return data and assume next page exists if length == perPage
    return response.data;
  } catch (error) {
    console.error("Error fetching repos:", error);
    return [];
  }
};
