import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Car } from './Car';
import { Driver } from './Driver';

@Entity()
export class Trip {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Car)
  @JoinColumn({ name: 'carId' })
  car!: Car;

  @ManyToOne(() => Driver)
  @JoinColumn({ name: 'driverId' })
  driver!: Driver;

  @Column()
  date!: string; // vagy Date típus

  @Column()
  type!: string; // 'magán' vagy 'céges'

  @Column()
  startLocation!: string;

  @Column()
  endLocation!: string;

  @Column()
  distance!: number; // Megtett km

  @Column()
  newOdometer!: number; // Új kilométeróra-állás
}
