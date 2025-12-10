export interface ILogging {
  SigninError(
    request: any,
    startTime: number,
    message: string,
    trace?: string,
    context?: string,
  ): Promise<void>;

  EndPoint(request: any, trace?: string, context?: string): Promise<void>;

  Exceptions(
    request: any,
    startTime: number,
    message: string,
    trace?: string,
    context?: string,
  ): Promise<void>;

  OnUnhandledExecptions(): void;
}
