import { HttpMethod } from './HttpMethod';

export interface HttpAction {
  url: string;
  method: HttpMethod;
  isComplete?: boolean;
  failed?: boolean;
  values?: any;
}
