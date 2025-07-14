export enum EventType {
  WORKFLOW_EXECUTION_STARTED = "EVENT_TYPE_WORKFLOW_EXECUTION_STARTED",
  WORKFLOW_TASK_SCHEDULED = "EVENT_TYPE_WORKFLOW_TASK_SCHEDULED",
  WORKFLOW_TASK_STARTED = "EVENT_TYPE_WORKFLOW_TASK_STARTED",
  WORKFLOW_TASK_COMPLETED = "EVENT_TYPE_WORKFLOW_TASK_COMPLETED",
  ACTIVITY_TASK_SCHEDULED = "EVENT_TYPE_ACTIVITY_TASK_SCHEDULED",
  ACTIVITY_TASK_STARTED = "EVENT_TYPE_ACTIVITY_TASK_STARTED",
  ACTIVITY_TASK_COMPLETED = "EVENT_TYPE_ACTIVITY_TASK_COMPLETED",
  ACTIVITY_TASK_FAILED = "EVENT_TYPE_ACTIVITY_TASK_FAILED",
  ACTIVITY_TASK_TIMED_OUT = "EVENT_TYPE_ACTIVITY_TASK_TIMED_OUT",
  ACTIVITY_TASK_CANCELED = "EVENT_TYPE_ACTIVITY_TASK_CANCELED",
  WORKFLOW_EXECUTION_COMPLETED = "EVENT_TYPE_WORKFLOW_EXECUTION_COMPLETED",
  WORKFLOW_EXECUTION_FAILED = "EVENT_TYPE_WORKFLOW_EXECUTION_FAILED",
  WORKFLOW_EXECUTION_TIMED_OUT = "EVENT_TYPE_WORKFLOW_EXECUTION_TIMED_OUT",
  WORKFLOW_EXECUTION_CANCELED = "EVENT_TYPE_WORKFLOW_EXECUTION_CANCELED",
  WORKFLOW_EXECUTION_TERMINATED = "EVENT_TYPE_WORKFLOW_EXECUTION_TERMINATED",
  START_CHILD_WORKFLOW_EXECUTION_INITIATED = "EVENT_TYPE_START_CHILD_WORKFLOW_EXECUTION_INITIATED",
  CHILD_WORKFLOW_EXECUTION_STARTED = "EVENT_TYPE_CHILD_WORKFLOW_EXECUTION_STARTED",
  CHILD_WORKFLOW_EXECUTION_COMPLETED = "EVENT_TYPE_CHILD_WORKFLOW_EXECUTION_COMPLETED",
  CHILD_WORKFLOW_EXECUTION_FAILED = "EVENT_TYPE_CHILD_WORKFLOW_EXECUTION_FAILED",
  START_CHILD_WORKFLOW_EXECUTION_FAILED = "EVENT_TYPE_START_CHILD_WORKFLOW_EXECUTION_FAILED",
  TIMER_STARTED = "EVENT_TYPE_TIMER_STARTED",
  TIMER_FIRED = "EVENT_TYPE_TIMER_FIRED",
  TIMER_CANCELED = "EVENT_TYPE_TIMER_CANCELED",
  WORKFLOW_EXECUTION_SIGNALED = "EVENT_TYPE_WORKFLOW_EXECUTION_SIGNALED",
  SIGNAL_EXTERNAL_WORKFLOW_EXECUTION_INITIATED = "EVENT_TYPE_SIGNAL_EXTERNAL_WORKFLOW_EXECUTION_INITIATED",
  EXTERNAL_WORKFLOW_EXECUTION_SIGNALED = "EVENT_TYPE_EXTERNAL_WORKFLOW_EXECUTION_SIGNALED",
  SIGNAL_EXTERNAL_WORKFLOW_EXECUTION_FAILED = "EVENT_TYPE_SIGNAL_EXTERNAL_WORKFLOW_EXECUTION_FAILED",
}

export type TaskQueue = {
  name: string;
  kind: string;
};

export type Payload = {
  metadata?: Record<string, string>;
  data?: string;
};

export type RetryPolicy = {
  initialInterval: string;
  backoffCoefficient: number;
  maximumInterval: string;
  maximumAttempts: number;
  nonRetryableErrorTypes: string[];
};

export type Workflow = {
  type: "workflow" | "childWorkflow";
  workflowId: string;
  runId: string;
  workflowType: string;
  namespace: string;
  startTime: string;
  endTime?: string;
  status: string;
  parentWorkflowId?: string;
  parentWorkflowRunId?: string;
  parentWorkflowNamespace?: string;
  input?: string;
  result?: string;
  taskQueue: TaskQueue;
  payload?: Payload[];
  header?: Record<string, any>;
  memo?: Record<string, any>;
  searchAttributes?: Record<string, any>;
  retryPolicy?: RetryPolicy;
  startToCloseTimeout?: string;
  attempts?: number;
  relatedEventIds?: string[];
  workflowTaskCompletedEventId: string;
  originalExecutionRunId?: string;
  firstExecutionRunId?: string;
  workflowRunTimeout?: string;
  workflowTaskTimeout?: string;
  workflowReusePolicy?: string;
  taskId?: string;
  sortEventTime: string;
  sortEventId: string;
};

export type Activity = {
  type: "activity";
  activityId: string;
  activityType?: string;
  workflowId: string;
  workflowRunId: string;
  namespace?: string;
  scheduleTime?: string;
  startTime: string;
  endTime?: string;
  status: string;
  taskQueue: TaskQueue;
  input?: string;
  result?: string;
  header?: Record<string, any>;
  retryPolicy?: RetryPolicy;
  heartbeatTimeout?: string;
  scheduleToCloseTimeout?: string;
  scheduleToStartTimeout?: string;
  startToCloseTimeout?: string;
  relatedEventIds?: string[];
  workflowTaskCompletedEventId?: string;
  attempts?: number;
  requestId?: string;
  failure?: string;
  lastFailure?: string;
  lastStartedTime?: string;
  lastAttemptCompleteTime?: string;
  lastWorkerIdentity?: string;
  lastFailureMessage?: string;
  lastFailureStackTrace?: string;
  lastFailureCause?: string;
  lastFailureServerFailureInfo?: Record<string, any>;
  lastFailureType?: string;
  taskId?: string;
  sortEventTime: string;
  sortEventId?: string;
};

export type Timer = {
  type: "timer";
  timerId: string;
  fireTime: string;
  workflowId: string;
  workflowRunId: string;
  status: string;
  startTime: string;
  endTime?: string;
  taskQueue?: {
    name: string;
  };
  sortEventTime: string;
  sortEventId: string;
  workflowTaskCompletedEventId?: string;
};

export type Signal = {
  type: "signal";
  signalId: string;
  signalName: string;
  workflowId: string;
  workflowRunId: string;
  sourceWorkflowId?: string;
  sourceWorkflowRunId?: string;
  targetWorkflowId?: string;
  targetWorkflowRunId?: string;
  status: string;
  startTime: string;
  endTime?: string;
  taskQueue?: {
    name: string;
  };
  sortEventTime: string;
  sortEventId: string;
  workflowTaskCompletedEventId?: string;
};

export type ChronologicalItem = Workflow | Activity | Timer | Signal;

// Event attribute interfaces
export interface WorkflowExecutionStartedEventAttributes {
  workflowType: { name: string };
  taskQueue: { name: string; kind: string };
  input?: { payloads?: Payload[] };
  workflowTaskTimeout: string;
  workflowRunTimeout: string;
  originalExecutionRunId: string;
  identity: string;
  firstExecutionRunId: string;
  attempt: number;
  firstWorkflowTaskBackoff: string;
  header: Record<string, any>;
  memo: Record<string, any>;
  searchAttributes: Record<string, any>;
  workflowId: string;
  parentWorkflowNamespace?: string;
  parentWorkflowExecution?: {
    workflowId: string;
    runId: string;
  };
  rootWorkflowExecution?: {
    workflowId: string;
    runId: string;
  };
}

export interface WorkflowExecutionCompletedEventAttributes {
  result: {
    payloads: Payload[];
  };
  workflowTaskCompletedEventId: string;
}

export interface WorkflowExecutionFailedEventAttributes {
  failure?: unknown;
  retryState?: string;
  workflowTaskCompletedEventId: string;
}

export interface ActivityTaskScheduledEventAttributes {
  activityId: string;
  activityType: { name: string };
  taskQueue: { name: string; kind: string; normalName?: string };
  header: Record<string, unknown>;
  input?: { payloads?: Payload[] };
  scheduleToCloseTimeout: string;
  scheduleToStartTimeout: string;
  startToCloseTimeout: string;
  heartbeatTimeout: string;
  workflowTaskCompletedEventId: string;
  retryPolicy: {
    initialInterval: string;
    backoffCoefficient: number;
    maximumInterval: string;
    maximumAttempts: number;
    nonRetryableErrorTypes: string[];
  };
}

export interface ActivityTaskStartedEventAttributes {
  scheduledEventId: string;
  identity: string;
  requestId: string;
  attempt: number;
  workerVersion: {
    buildId: string;
  };
  lastFailure?: Record<string, any>;
}

export interface ActivityTaskCompletedEventAttributes {
  result?: {
    payloads?: Payload[];
  };
  scheduledEventId: string;
  startedEventId: string;
  identity: string;
}

export interface ActivityTaskFailedEventAttributes {
  scheduledEventId: string;
  startedEventId: string;
  failure?: {
    message: string;
    stackTrace: string;
    applicationFailureInfo?: { type: string };
  };
}

export interface TimerStartedEventAttributes {
  timerId: string;
  startToFireTimeout: string;
  workflowTaskCompletedEventId: string;
}

export interface TimerFiredEventAttributes {
  timerId: string;
  startedEventId: string;
}

export interface WorkflowExecutionSignaledEventAttributes {
  signalName: string;
  input?: { payloads?: Payload[] };
  identity: string;
  header?: Record<string, any>;
}

export interface TemporalEvent {
  eventId: string;
  eventTime: string;
  eventType: EventType;
  version: string;
  taskId: string;
  scheduledEventId: string;
  taskQueue: TaskQueue;

  workflowExecutionStartedEventAttributes?: WorkflowExecutionStartedEventAttributes;
  workflowExecutionCompletedEventAttributes?: WorkflowExecutionCompletedEventAttributes;
  workflowExecutionFailedEventAttributes?: WorkflowExecutionFailedEventAttributes;
  activityTaskScheduledEventAttributes?: ActivityTaskScheduledEventAttributes;
  activityTaskStartedEventAttributes?: ActivityTaskStartedEventAttributes;
  activityTaskCompletedEventAttributes?: ActivityTaskCompletedEventAttributes;
  activityTaskFailedEventAttributes?: ActivityTaskFailedEventAttributes;
  timerStartedEventAttributes?: TimerStartedEventAttributes;
  timerFiredEventAttributes?: TimerFiredEventAttributes;
  workflowExecutionSignaledEventAttributes?: WorkflowExecutionSignaledEventAttributes;
}

// Add more types as needed for the mappers and endpoints
