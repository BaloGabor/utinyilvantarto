import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Trip } from '../entity/Trip';
import { Driver } from '../entity/Driver';
import { Car } from '../entity/Car';
import { ParamsDictionary } from 'express-serve-static-core';

const router = Router();

// Útvonalak (tripek) listázása
router.get('/', async (req: Request, res: Response) => {
  const trips = await AppDataSource.getRepository(Trip).find({
    relations: ['driver', 'car'], 
  });
  res.json(trips);
});

// Új utazás hozzáadása
router.post('/', async (req: Request, res: Response) => {
    const { carId, driverId, date, type, startLocation, endLocation, distance, newOdometer, returnTrip } = req.body;
  
    try {
      // Megkeressük az autót és a sofőrt
      const car = await AppDataSource.getRepository(Car).findOne({ where: { id: carId } });
      const driver = await AppDataSource.getRepository(Driver).findOne({ where: { id: driverId } });
  
      if (!car || !driver) {
        return res.status(404).json({ message: 'Autó vagy sofőr nem található!' });
      }
  
      // Új utazás létrehozása
      const trip = new Trip();
      trip.car = car;
      trip.driver = driver;
      trip.date = date;
      trip.type = type;
      trip.startLocation = startLocation;
      trip.endLocation = endLocation;
      trip.distance = distance;
      trip.newOdometer = newOdometer;
  
      // Mentés
      await AppDataSource.getRepository(Trip).save(trip);
  
      // Ha visszaútra van szükség, hozzunk létre egy másik utazást
      if (returnTrip) {
        const returnTripInstance = new Trip();
        returnTripInstance.car = car;
        returnTripInstance.driver = driver;
        returnTripInstance.date = date; // ugyanaz a dátum, de ez későbbi dátumot is kaphat
        returnTripInstance.type = type;
        returnTripInstance.startLocation = endLocation; // az új kiindulási pont
        returnTripInstance.endLocation = startLocation; // az új célpont
        returnTripInstance.distance = distance; // ugyanaz a távolság, de itt is lehetne módosítani
        returnTripInstance.newOdometer = newOdometer + distance; // új kilométeróra állás
  
        // Visszaút mentése
        await AppDataSource.getRepository(Trip).save(returnTripInstance);
      }
  
      res.status(201).json({ message: 'Utazás mentve!', trip, returnTrip: returnTrip ? 'Visszaút mentve!' : null });
  
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Belső szerverhiba' });
    }
  });

// Út törlése ID alapján
router.delete('/:id', async (req: Request<ParamsDictionary & { id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    const tripRepository = AppDataSource.getRepository(Trip);
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(400).json({ message: 'Érvénytelen ID formátum' });
    }

    const trip = await tripRepository.findOneBy({ id: numericId });

    if (!trip) {
      return res.status(404).json({ message: 'Út nem található!' });
    }

    await tripRepository.remove(trip);
    return res.status(200).json({ message: 'Út törölve!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Belső szerverhiba' });
  }
});

router.put('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { carId, driverId, date, type, startLocation, endLocation, distance, newOdometer, returnTrip } = req.body;

  try {
    const tripRepository = AppDataSource.getRepository(Trip);
    const trip = await tripRepository.findOne({
      where: { id: parseInt(id) },
      relations: ['driver', 'car']
    });

    if (!trip) {
      return res.status(404).json({ message: 'Utazás nem található!' });
    }

    // Frissítjük az adatokat
    const car = await AppDataSource.getRepository(Car).findOne({ where: { id: carId } });
    const driver = await AppDataSource.getRepository(Driver).findOne({ where: { id: driverId } });

    if (!car || !driver) {
      return res.status(404).json({ message: 'Autó vagy sofőr nem található!' });
    }

    // Frissítjük a trip-et
    trip.car = car;
    trip.driver = driver;
    trip.date = date;
    trip.type = type;
    trip.startLocation = startLocation;
    trip.endLocation = endLocation;
    trip.distance = distance;
    trip.newOdometer = newOdometer;

    await tripRepository.save(trip);

    // Ha szükséges, létrehozhatunk egy visszaútra vonatkozó trip-et
    if (returnTrip) {
      const returnTripInstance = new Trip();
      returnTripInstance.car = car;
      returnTripInstance.driver = driver;
      returnTripInstance.date = date; // ugyanaz a dátum, vagy későbbi
      returnTripInstance.type = type;
      returnTripInstance.startLocation = endLocation;
      returnTripInstance.endLocation = startLocation;
      returnTripInstance.distance = distance;
      returnTripInstance.newOdometer = newOdometer + distance; // új km-óra állás

      await tripRepository.save(returnTripInstance);
    }

    res.status(200).json({ message: 'Utazás frissítve!', trip });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Belső szerverhiba' });
  }
});

export default router;
