import {getOctokit} from '@actions/github';
import {GitHub} from '@actions/github/lib/utils';

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
}
