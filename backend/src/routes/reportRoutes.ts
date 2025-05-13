import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Car } from '../entity/Car';
import { Trip } from '../entity/Trip';
import { Between } from 'typeorm';

const router = Router();

// Havi jelentés generálása
router.get('/report', async (req: Request, res: Response) => {
  const { year, month, licensePlate } = req.query;

  try {
    // Autó lekérdezése rendszám alapján
    const carRepository = AppDataSource.getRepository(Car);
    const car = await carRepository.findOne({ where: { licensePlate: licensePlate as string } });

    if (!car) {
      return res.status(404).json({ message: 'Autó nem található!' });
    }

    // Hónap első és utolsó napjának kiszámítása
    const y = Number(year);
    const m = Number(month);
    const startDate = new Date(y, m - 1, 1); // hónap 0-indexelt
    const endDate = new Date(y, m, 0); // 0. nap a következő hónapban = előző hónap utolsó napja

    const start = startDate.toISOString().split('T')[0]; // "YYYY-MM-DD"
    const end = endDate.toISOString().split('T')[0];

    // Utak lekérdezése adott időszakra
    const tripRepository = AppDataSource.getRepository(Trip);
    const trips = await tripRepository.find({
      where: {
        car: { id: car.id },
        date: Between(start, end),
      }
    });

    // Debug (opcionális)
    console.log(`Lekérdezett időszak: ${start} - ${end}`);
    console.log(`Talált utak száma: ${trips.length}`);

    // Számítások
    let totalDistance = 0;
    let totalFuelCost = 0;
    let totalFlatCost = 0;

    trips.forEach(trip => {
      totalDistance += trip.distance;
      totalFuelCost += (trip.distance / 100) * car.consumption * 480;
      totalFlatCost += trip.distance * 10;
    });

    const totalCost = totalFuelCost + totalFlatCost;

    // Válasz
    res.json({
      car,
      totalDistance,
      totalFuelCost,
      totalFlatCost,
      totalCost,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Hiba történt a jelentés generálása közben' });
  }
});

export default router;
