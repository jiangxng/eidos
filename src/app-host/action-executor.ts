import { createActionRequest } from "../runtime/action.js";
import type { ActionRequestV010, JsonValue } from "../runtime/contracts.js";
import type { AppHostLoadedPageV010 } from "./contracts.js";

export interface AppHostActionContextV010 {
  readonly experienceId: string;
  readonly packageId: string;
  readonly featureId: string;
  readonly pageId: string;
  readonly routePath: string;
}

export interface AppHostActionExecutor {
  execute(
    request: ActionRequestV010,
    context: AppHostActionContextV010
  ): Promise<unknown>;
}

export interface AppHostActionExecutionV010 {
  readonly request: ActionRequestV010;
  readonly result: unknown;
}

export async function executeAppHostPageAction(
  page: AppHostLoadedPageV010,
  values: Record<string, JsonValue>,
  executor: AppHostActionExecutor
): Promise<AppHostActionExecutionV010> {
  const request = createActionRequest(page.definition, values);

  const result = await executor.execute(request, {
    experienceId: page.experienceId,
    packageId: page.packageId,
    featureId: page.featureId,
    pageId: page.page.id,
    routePath: page.route.path
  });

  return { request, result };
}
