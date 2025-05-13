import { Router, Request, Response } from 'express';
import { AppDataSource } from '../data-source';
import { Driver } from '../entity/Driver';
import { ParamsDictionary } from 'express-serve-static-core';

const router = Router();

// Sofőrök listázása
router.get('/', async (req: Request, res: Response) => {
  const drivers = await AppDataSource.getRepository(Driver).find();
  res.json(drivers);
});

// Új sofőr hozzáadása
router.post('/', async (req: Request, res: Response) => {
  const { name, birthDate, address, licenseNumber, licenseExpiry } = req.body;
  const driver = new Driver();
  driver.name = name;
  driver.birthDate = birthDate;
  driver.address = address;
  driver.licenseNumber = licenseNumber;
  driver.licenseExpiry = licenseExpiry;

  await AppDataSource.getRepository(Driver).save(driver);
  res.status(201).json(driver); // <-- itt fontos, kisbetűs driver!
});

// Sofőr módosítása
router.put('/:id', async (
    req: Request<ParamsDictionary & { id: string }>,
    res: Response
  ) => {
    const { id } = req.params;
    const { name, birthDate, address, licenseNumber, licenseExpiry } = req.body;
  
    try {
      const driverRepository = AppDataSource.getRepository(Driver);
      const numericId = parseInt(id, 10);
  
      if (isNaN(numericId)) {
        return res.status(400).json({ message: 'Érvénytelen ID formátum' });
      }
  
      const driver = await driverRepository.findOneBy({ id: numericId });
  
      if (!driver) {
        return res.status(404).json({ message: 'Sofőr nem található!' });
      }
  
      // Adatok frissítése
      driver.name = name ?? driver.name;
      driver.birthDate = birthDate ?? driver.birthDate;
      driver.address = address ?? driver.address;
      driver.licenseNumber = licenseNumber ?? driver.licenseNumber;
      driver.licenseExpiry = licenseExpiry ?? driver.licenseExpiry;
  
      await driverRepository.save(driver);
  
      return res.status(200).json(driver);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Belső szerverhiba' });
    }
  });

// Sofőr törlése ID alapján
router.delete('/:id', async (req: Request<ParamsDictionary & { id: string }>, res: Response) => {
  const { id } = req.params;

  try {
    const driverRepository = AppDataSource.getRepository(Driver);
    const numericId = parseInt(id, 10);

    if (isNaN(numericId)) {
      return res.status(400).json({ message: 'Érvénytelen ID formátum' });
    }

    const driver = await driverRepository.findOneBy({ id: numericId });

    if (!driver) {
      return res.status(404).json({ message: 'Sofőr nem található!' }); // <-- szövegek is javítva
    }

    await driverRepository.remove(driver);
    return res.status(200).json({ message: 'Sofőr törölve!' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Belső szerverhiba' });
  }
});

export default router;
