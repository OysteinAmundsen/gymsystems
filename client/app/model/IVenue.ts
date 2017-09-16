import { ICreatedBy } from './ICreatedBy';
import { ITournament } from './ITournament';

export interface IVenue extends ICreatedBy {
  id: number;
  name: string;
  longitude: number;
  latitude: number;
  address: string;
  rentalCost: number;
  contact: string;
  contactPhone: number;
  contactEmail: string;
  capacity: number;
  tournaments: ITournament[];
}
