import express from 'express';
import { AppDataSource } from './data-source';
import carRoutes from './routes/carRoutes';
import driverRoutes from './routes/driverRoutes';
import tripRoutes from './routes/tripRoutes'; 
import reportRoutes from './routes/reportRoutes';
import cors from 'cors';

const app = express();
const port = 3000;

// CORS engedélyezése
app.use(cors());

// JSON body parsing middleware
app.use(express.json());

app.use('/cars', carRoutes);
app.use('/drivers', driverRoutes);
app.use('/trips', tripRoutes);
app.use('/', reportRoutes);


// Az adatbázis inicializálása
AppDataSource.initialize()
  .then(() => {
    console.log('Adatbázis kapcsolat sikeresen létrejött!');
    
    // Szerver elindítása
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Adatbázis kapcsolat hiba:', error);
  });
