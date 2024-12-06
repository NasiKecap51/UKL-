import express from 'express';
import cors from 'cors';
import userRT from './router/userRT';
import itemRT from './router/itemRT';
import peminjamanRT from './router/peminjamanRT';
import pengembalianRT from './router/pengembalianRT';
import penggunaan from './router/penggunaan';
import dataanalysis from './router/dataanalysis';




const PORT: number = 3000; 
const app = express();


app.use(cors());
app.use(express.json()); 
app.use('/user', userRT);
app.use('/iventory', itemRT);
app.use('/pinjam', peminjamanRT);
app.use('/kembali', pengembalianRT);
app.use('/usage', penggunaan);
app.use('/analis', dataanalysis);

app.listen(PORT, () => {
    console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
