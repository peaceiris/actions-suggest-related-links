export interface Inputs {
  readonly GithubToken: string;
  readonly Language: string;
  readonly Model: string;
  readonly Repository: string;
  readonly CustomTrainingData: string;
  readonly TrainIssues: boolean;
}

export interface CmdResult {
  exitcode: number;
  output: string;
}
