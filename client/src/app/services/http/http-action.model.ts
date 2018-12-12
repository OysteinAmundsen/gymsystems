import { HttpMethod } from './http-method.enum';

export interface HttpAction {
  url: string;
  method: HttpMethod;
  isComplete?: boolean;
  failed?: boolean;
  values?: any;
}
