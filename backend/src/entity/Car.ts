import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  licensePlate!: string; // Rendszám

  @Column()
  type!: string; // Típus

  @Column()
  fuel!: string; // Üzemanyag típus

  @Column('float')
  consumption!: number; // Fogyasztás (liter/100km)

  @Column()
  initialOdometer!: number; // Kezdő kilométeróra állás
}
