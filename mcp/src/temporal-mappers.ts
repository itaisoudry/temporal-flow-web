import {
  EventType,
  ChronologicalItem,
  TemporalEvent,
  Workflow,
  Activity,
  Timer,
  Signal,
  Payload,
} from "./types/events";

// ... (import types as needed)

export function parsePayloads(
  payloads?: { metadata?: Record<string, string>; data?: string }[]
): string | undefined {
  if (!payloads || payloads.length === 0) {
    return undefined;
  }

  // If single payload, return decoded string
  if (payloads.length === 1) {
    return payloads[0]?.data ? atob(payloads[0].data) : "null";
  }

  // If multiple payloads, convert to JSON array string
  const decodedPayloads = payloads
    .map((payload) => (payload?.data ? atob(payload.data) : "null"))
    .filter((payload): payload is string => payload !== undefined);

  return decodedPayloads.length > 0
    ? `[${decodedPayloads.join(", ")}]`
    : undefined;
}

export function convertEventTypeToStatus(eventType: string): string {
  switch (eventType) {
    case EventType.WORKFLOW_EXECUTION_STARTED:
      return "Running";
    case EventType.WORKFLOW_EXECUTION_COMPLETED:
      return "Completed";
    case EventType.WORKFLOW_EXECUTION_FAILED:
      return "Failed";
    case EventType.WORKFLOW_EXECUTION_TIMED_OUT:
      return "TimedOut";
    case EventType.WORKFLOW_EXECUTION_CANCELED:
      return "Canceled";
    case EventType.WORKFLOW_EXECUTION_TERMINATED:
      return "Terminated";
    case EventType.ACTIVITY_TASK_SCHEDULED:
      return "Scheduled";
    case EventType.ACTIVITY_TASK_STARTED:
      return "Started";
    case EventType.ACTIVITY_TASK_COMPLETED:
      return "Completed";
    case EventType.ACTIVITY_TASK_FAILED:
      return "Failed";
    case EventType.ACTIVITY_TASK_TIMED_OUT:
      return "TimedOut";
    case EventType.ACTIVITY_TASK_CANCELED:
      return "Canceled";
    case EventType.TIMER_STARTED:
      return "Started";
    case EventType.TIMER_FIRED:
      return "Fired";
    case EventType.TIMER_CANCELED:
      return "Canceled";
    default:
      return "Unknown";
  }
}

export function extractRootWorkflow(
  events: TemporalEvent[],
  namespace: string,
  runId: string
): Workflow {
  const startEvent = events.find(
    (event) => event.eventType === EventType.WORKFLOW_EXECUTION_STARTED
  );

  if (!startEvent || !startEvent.workflowExecutionStartedEventAttributes) {
    throw new Error("Workflow execution started event not found");
  }

  const attrs = startEvent.workflowExecutionStartedEventAttributes;

  return {
    type: "workflow",
    workflowId: attrs.workflowId,
    runId: runId,
    workflowType: attrs.workflowType.name,
    namespace: namespace,
    startTime: startEvent.eventTime,
    status: "Running",
    input: parsePayloads(attrs.input?.payloads),
    taskQueue: attrs.taskQueue,
    header: attrs.header,
    memo: attrs.memo,
    searchAttributes: attrs.searchAttributes,
    workflowTaskCompletedEventId: startEvent.eventId,
    originalExecutionRunId: attrs.originalExecutionRunId,
    firstExecutionRunId: attrs.firstExecutionRunId,
    workflowRunTimeout: attrs.workflowRunTimeout,
    workflowTaskTimeout: attrs.workflowTaskTimeout,
    sortEventTime: startEvent.eventTime,
    sortEventId: startEvent.eventId,
    parentWorkflowId: attrs.parentWorkflowExecution?.workflowId,
    parentWorkflowRunId: attrs.parentWorkflowExecution?.runId,
    parentWorkflowNamespace: attrs.parentWorkflowNamespace,
    relatedEventIds: [startEvent.eventId],
  };
}

export async function parseTemporalHistory(
  events: TemporalEvent[],
  namespace: string,
  rootWorkflowRunId: string
): Promise<ChronologicalItem[]> {
  const chronologicalList: ChronologicalItem[] = [];
  const childWorkflowsMap: Record<string, Workflow> = {};
  const activityMap: Record<string, Activity> = {};
  const timerMap: Record<string, Timer> = {};
  const signalMap: Record<string, Signal> = {};

  // Extract root workflow
  const rootWorkflow = extractRootWorkflow(
    events,
    namespace,
    rootWorkflowRunId
  );
  chronologicalList.push(rootWorkflow);

  for (const event of events) {
    switch (event.eventType) {
      case EventType.WORKFLOW_EXECUTION_COMPLETED:
      case EventType.WORKFLOW_EXECUTION_FAILED:
      case EventType.WORKFLOW_EXECUTION_TIMED_OUT:
      case EventType.WORKFLOW_EXECUTION_CANCELED:
      case EventType.WORKFLOW_EXECUTION_TERMINATED: {
        const wf = chronologicalList[0] as Workflow;
        if (wf) {
          wf.endTime = event.eventTime;
          wf.relatedEventIds = wf.relatedEventIds || [];
          wf.relatedEventIds.push(event.eventId);
          wf.status = convertEventTypeToStatus(event.eventType);
        }

        if (event.eventType === EventType.WORKFLOW_EXECUTION_COMPLETED) {
          wf.result = parsePayloads(
            event.workflowExecutionCompletedEventAttributes?.result?.payloads
          );
        }
        if (event.eventType === EventType.WORKFLOW_EXECUTION_FAILED) {
          wf.result = JSON.stringify(
            event.workflowExecutionFailedEventAttributes
          );
        }
        break;
      }

      case EventType.ACTIVITY_TASK_SCHEDULED: {
        const attrs = event.activityTaskScheduledEventAttributes;
        if (!attrs) break;

        const activity: Activity = {
          type: "activity",
          activityId: attrs.activityId,
          activityType: attrs.activityType.name,
          workflowId: rootWorkflow.workflowId,
          workflowRunId: rootWorkflowRunId,
          namespace: namespace,
          scheduleTime: event.eventTime,
          startTime: event.eventTime,
          status: "Scheduled",
          taskQueue: attrs.taskQueue,
          input: parsePayloads(attrs.input?.payloads),
          header: attrs.header,
          retryPolicy: attrs.retryPolicy,
          heartbeatTimeout: attrs.heartbeatTimeout,
          scheduleToCloseTimeout: attrs.scheduleToCloseTimeout,
          scheduleToStartTimeout: attrs.scheduleToStartTimeout,
          startToCloseTimeout: attrs.startToCloseTimeout,
          workflowTaskCompletedEventId: attrs.workflowTaskCompletedEventId,
          sortEventTime: event.eventTime,
          sortEventId: event.eventId,
          relatedEventIds: [event.eventId],
        };

        activityMap[event.eventId] = activity;
        chronologicalList.push(activity);
        break;
      }

      case EventType.ACTIVITY_TASK_STARTED: {
        const attrs = event.activityTaskStartedEventAttributes;
        if (!attrs) break;

        const activity = Object.values(activityMap).find(
          (a) => a.sortEventId === attrs.scheduledEventId
        );

        if (activity) {
          activity.status = "Started";
          activity.startTime = event.eventTime;
          activity.attempts = attrs.attempt;
          activity.requestId = attrs.requestId;
          activity.relatedEventIds?.push(event.eventId);
        }
        break;
      }

      case EventType.ACTIVITY_TASK_COMPLETED: {
        const attrs = event.activityTaskCompletedEventAttributes;
        if (!attrs) break;

        const activity = Object.values(activityMap).find(
          (a) => a.sortEventId === attrs.scheduledEventId
        );

        if (activity) {
          activity.status = "Completed";
          activity.endTime = event.eventTime;
          activity.result = parsePayloads(attrs.result?.payloads);
          activity.relatedEventIds?.push(event.eventId);
        }
        break;
      }

      case EventType.ACTIVITY_TASK_FAILED: {
        const attrs = event.activityTaskFailedEventAttributes;
        if (!attrs) break;

        const activity = Object.values(activityMap).find(
          (a) => a.sortEventId === attrs.scheduledEventId
        );

        if (activity) {
          activity.status = "Failed";
          activity.endTime = event.eventTime;
          activity.failure = JSON.stringify(attrs.failure);
          activity.relatedEventIds?.push(event.eventId);
        }
        break;
      }

      case EventType.TIMER_STARTED: {
        const attrs = event.timerStartedEventAttributes;
        if (!attrs) break;

        const timer: Timer = {
          type: "timer",
          timerId: attrs.timerId,
          fireTime: attrs.startToFireTimeout,
          workflowId: rootWorkflow.workflowId,
          workflowRunId: rootWorkflowRunId,
          status: "Started",
          startTime: event.eventTime,
          sortEventTime: event.eventTime,
          sortEventId: event.eventId,
          workflowTaskCompletedEventId: attrs.workflowTaskCompletedEventId,
        };

        timerMap[attrs.timerId] = timer;
        chronologicalList.push(timer);
        break;
      }

      case EventType.TIMER_FIRED: {
        const attrs = event.timerFiredEventAttributes;
        if (!attrs) break;

        const timer = timerMap[attrs.timerId];
        if (timer) {
          timer.status = "Fired";
          timer.endTime = event.eventTime;
        }
        break;
      }

      case EventType.TIMER_CANCELED: {
        const attrs = event.timerFiredEventAttributes; // Note: using fired attributes as they have the same structure
        if (!attrs) break;

        const timer = timerMap[attrs.timerId];
        if (timer) {
          timer.status = "Canceled";
          timer.endTime = event.eventTime;
        }
        break;
      }

      case EventType.WORKFLOW_EXECUTION_SIGNALED: {
        const attrs = event.workflowExecutionSignaledEventAttributes;
        if (!attrs) break;

        const signal: Signal = {
          type: "signal",
          signalId: event.eventId,
          signalName: attrs.signalName,
          workflowId: rootWorkflow.workflowId,
          workflowRunId: rootWorkflowRunId,
          status: "Received",
          startTime: event.eventTime,
          sortEventTime: event.eventTime,
          sortEventId: event.eventId,
        };

        signalMap[event.eventId] = signal;
        chronologicalList.push(signal);
        break;
      }
    }
  }

  // Sort chronologically
  chronologicalList.sort((a, b) => {
    const timeA = new Date(a.sortEventTime).getTime();
    const timeB = new Date(b.sortEventTime).getTime();
    if (timeA !== timeB) {
      return timeA - timeB;
    }
    const idA = parseInt(a.sortEventId || "0");
    const idB = parseInt(b.sortEventId || "0");
    return idA - idB;
  });

  return chronologicalList;
}
