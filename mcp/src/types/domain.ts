export interface WorkflowInstanceId {
  workflowId: string;
  workflowRunId: string;
}

export interface ActivityInstanceId {
  workflowId: string;
  workflowRunId: string;
  activityId: string;
}

export interface TimerInstanceId {
  workflowId: string;
  workflowRunId: string;
  timerId: string;
}

export interface SignalInstanceId {
  workflowId: string;
  workflowRunId: string;
  signalId: string;
}

export type ReferencedBatchInstanceId =
  | WorkflowInstanceId
  | ActivityInstanceId
  | TimerInstanceId
  | SignalInstanceId;
