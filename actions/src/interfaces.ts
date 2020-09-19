export interface Inputs {
  readonly GithubToken: string;
  readonly Mode: string;
  readonly Language: string;
  readonly Threshold: string;
  readonly MaxLinks: string;
  readonly Repository: string;
  readonly CustomTrainingData: string;
  readonly TrainIssues: boolean;
  readonly Unclickable: boolean;
}

export interface CmdResult {
  exitcode: number;
  output: string;
}

export interface Repository {
  owner: string;
  name: string;
  issues: Issues;
  comments: Comments;
}

export interface Issues {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Array<any>;
  fileName: string;
  location: string;
  fullPath: string;
}

export type Comments = Issues;

export interface Issue {
  html_url: string;
  number: number;
  title: string;
  body: string;
}
