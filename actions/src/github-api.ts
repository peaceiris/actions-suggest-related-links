import {getOctokit} from '@actions/github';
import {context, GitHub} from '@actions/github/lib/utils';

export class GitHubAPI {
  private readonly githubToken: string;
  private readonly githubClient: InstanceType<typeof GitHub>;
  private readonly owner: string;
  private readonly repo: string;

  constructor(githubToken: string, owner: string, repo: string) {
    this.githubToken = githubToken;
    this.githubClient = getOctokit(this.githubToken);
    this.owner = owner;
    this.repo = repo;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getIssues(): Promise<any> {
    return await this.githubClient.paginate(this.githubClient.issues.listForRepo, {
      owner: this.owner,
      repo: this.repo,
      state: 'all'
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getComments(): Promise<any> {
    return await this.githubClient.paginate(this.githubClient.issues.listCommentsForRepo, {
      owner: this.owner,
      repo: this.repo
    });
  }

  createComment(body: string): void {
    this.githubClient.issues.createComment({
      issue_number: context.issue.number,
      owner: context.repo.owner,
      repo: context.repo.repo,
      body: body
    });
  }
}
