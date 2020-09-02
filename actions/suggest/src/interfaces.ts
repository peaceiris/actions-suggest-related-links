export interface Inputs {
  readonly GithubToken: string;
  readonly Language: string;
}

export interface CmdResult {
  exitcode: number;
  output: string;
}
