import { ErrorCodes } from "../common/errorCodes";

export type ErrorCodeHook = ReturnType<typeof useErrorCode>;

export const useErrorCode = () => {
  const getMessage = (code: string): string => {
    if (Object.prototype.hasOwnProperty.call(ErrorCodes, code)) {
      return ErrorCodes[code];
    }

    return ErrorCodes.UNKNOWN_ERROR;
  };

  return { getMessage };
};
