import { ICreatedBy } from './ICreatedBy';
import { ITournament } from './ITournament';

export interface IVenue extends ICreatedBy {
  id: number;
  name: string;
  longitude: string;
  latitude: string;
  address: string;
  rentalCost: number;
  contact: string;
  contactPhone: string;
  contactEmail: string;
  capacity: number;
  tournaments: ITournament[];
}
