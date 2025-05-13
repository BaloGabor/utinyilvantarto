import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Car } from '../entity/Car';
import { ParamsDictionary } from 'express-serve-static-core';

const router = Router();

// Autók listázása
router.get('/', async (req: Request, res: Response) => {
  const cars = await AppDataSource.getRepository(Car).find();
  res.json(cars);
});

// Új autó hozzáadása
router.post('/', async (req: Request, res: Response) => {
  const { licensePlate, type, fuel, consumption, initialOdometer } = req.body;
  const car = new Car();
  car.licensePlate = licensePlate;
  car.type = type;
  car.fuel = fuel;
  car.consumption = consumption;
  car.initialOdometer = initialOdometer;

  await AppDataSource.getRepository(Car).save(car);
  res.status(201).json(car);
});

// Autó törlése ID alapján
router.delete('/:id', async (
  req: Request<ParamsDictionary & { id: string }>, // Kombinált típus
  res: Response
) => {
  const { id } = req.params;

  try {
    const carRepository = AppDataSource.getRepository(Car);
    const numericId = parseInt(id, 10);
    
    if (isNaN(numericId)) {
      return res.status(400).json({ message: 'Érvénytelen ID formátum' });
    }

    const car = await carRepository.findOneBy({ id: numericId });
    
    if (!car) {
      return res.status(404).json({ message: 'Autó nem található!' });
    }

    await carRepository.remove(car);
    return res.status(200).json({ message: 'Autó törölve!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Belső szerverhiba' });
  }
});


export default router;
