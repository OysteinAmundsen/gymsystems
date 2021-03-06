import { HttpMethod } from './http-method';

export interface HttpAction {
  url: string;
  method: HttpMethod;
  isComplete?: boolean;
  failed?: boolean;
  values?: any;
}
