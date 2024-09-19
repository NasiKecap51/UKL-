import express from 'express'
import { createMenu, getAllMenus } from '../controller/ctr';

const app = express()
app.use(express.json())

app.get('/', getAllMenus)
app.post('/', createMenu)

export default app