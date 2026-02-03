import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getGithubToken, getUserRepos } from "@/lib/github";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Star, GitFork, Eye } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

// Define repository interface based on GitHub API response
interface Repository {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  language: string | null;
  updated_at: string;
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page = async (props: PageProps) => {
  const searchParams = await props.searchParams;
  const page = Number(searchParams.page) || 1;
  const perPage = 9; // Display 9 repos per page (3x3 grid)

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">
          Please log in to view repositories.
        </p>
      </div>
    );
  }

  const token = await getGithubToken(session.user.id);

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <p className="text-muted-foreground">
          No GitHub account connected found.
        </p>
        <p className="text-sm text-muted-foreground">
          Please connect your GitHub account in settings.
        </p>
      </div>
    );
  }

  const repos: Repository[] = await getUserRepos(token, page, perPage);

  // Simple check for next page availability (if we got full page, assume there might be more)
  const hasNextPage = repos.length === perPage;
  const hasPrevPage = page > 1;

  return (
    <div className="space-y-6 container mx-auto p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Repositories</h1>
        <p className="text-muted-foreground">
          Manage and view your GitHub repositories.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {repos.map((repo) => (
          <Card
            key={repo.id}
            className="flex flex-col h-full hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex justify-between items-start gap-2">
                <CardTitle className="text-xl break-all">
                  <Link
                    href={repo.html_url}
                    target="_blank"
                    className="hover:underline hover:text-primary"
                  >
                    {repo.name}
                  </Link>
                </CardTitle>
              </div>
              <CardDescription className="line-clamp-2 min-h-[2.5rem]">
                {repo.description || "No description available"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                {repo.language && (
                  <div className="flex items-center gap-1">
                    <span className="w-3 h-3 rounded-full bg-primary/80"></span>
                    {repo.language}
                  </div>
                )}
                <div className="flex items-center gap-4 ml-auto">
                  <div className="flex items-center gap-1" title="Stars">
                    <Star className="w-4 h-4" />
                    {repo.stargazers_count}
                  </div>
                  <div className="flex items-center gap-1" title="Forks">
                    <GitFork className="w-4 h-4" />
                    {repo.forks_count}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground border-t pt-4 mt-auto">
              Updated {new Date(repo.updated_at).toLocaleDateString()}
            </CardFooter>
          </Card>
        ))}
        {repos.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No repositories found.
          </div>
        )}
      </div>

      <div className="mt-8">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={
                  hasPrevPage ? `/dashboard/repositories?page=${page - 1}` : "#"
                }
                aria-disabled={!hasPrevPage}
                className={!hasPrevPage ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            <PaginationItem>
              <PaginationLink isActive>{page}</PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                href={
                  hasNextPage ? `/dashboard/repositories?page=${page + 1}` : "#"
                }
                aria-disabled={!hasNextPage}
                className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default Page;
