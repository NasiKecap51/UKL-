import express from 'express'
import { getAllMenus } from '../controller/ctr';

const app = express()
app.use(express.json())

app.get('/', getAllMenus)

export default app