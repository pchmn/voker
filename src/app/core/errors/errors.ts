export enum Errors {
  AuthError = 'errors.authError',
  UnknownError = 'errors.unknownError',
  RoomNotFound = 'errors.roomNotFound'
}

export function getErrorByValue(value: string): Errors | undefined {
  switch (value) {
    case 'errors.authError':
      return Errors.AuthError;
    case 'errors.unknownError':
      return Errors.UnknownError;
    case 'errors.roomNotFound':
      return Errors.RoomNotFound;
    default:
      return undefined;
  }
}
