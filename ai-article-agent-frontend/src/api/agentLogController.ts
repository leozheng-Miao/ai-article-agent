// @ts-ignore
/* eslint-disable */
import request from "@/request";

/** 根据任务ID获取智能体执行日志 GET /agentLog/execution-logs/${param0} */
export async function getExecutionLogs(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.getExecutionLogsParams,
  options?: { [key: string]: any }
) {
  const { taskId: param0, ...queryParams } = params;
  return request<API.BaseResponseAgentExecutionStats>(
    `/agentLog/execution-logs/${param0}`,
    {
      method: "GET",
      params: { ...queryParams },
      ...(options || {}),
    }
  );
}
