import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Car } from './entity/Car';
import { Driver } from './entity/Driver';
import { Trip } from './entity/Trip';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'utinyilvantarto.db', // itt hozza létre az adatbázist a projekted gyökerében
  synchronize: true, // automatikusan létrehozza/frissíti a táblákat
  logging: true,     // hasznos fejlesztés közben, látod mit csinál az SQL
  entities: [Car, Driver, Trip],
});
