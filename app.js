import express from 'express'
import os from 'os'
import { createLogger } from './loger.js'

const PORT = parseInt(process.argv[2]) || 8080
const app = express()
app.listen(PORT, () => console.log(`Listening on ${PORT} port.`))

const logger = createLogger()

app.use((req, res, next) => {
    logger.info(`Request recibida ${req.method} con método ${req.path}.`)
    next()
})

app.get('/', (req, res) => {
    res.send({ status: 'success', message: 'Bienvenido!!' })
})

app.get('/error', (req, res) => {
    const { username } = req.query
    if (!username) {
    logger.error(`Parametro de usuario no encontrado ${req.method} con método en ruta ${req.path}.`)
    res.send({ status: 'error', message: 'Parámetro Inválido.' })
} else {
    res.send({ status: 'success', username: username })
}
})

app.get('/info', (req, res) => {
    res.send({
    status: 'success',
    payload: {
        args: process.argv,
        os: process.platform,
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage(),
        execPath: process.execPath,
        processId: process.pid,
        projectFolder: process.cwd(),
        cores: os.cpus().length
    }
})
})

app.use((req, res) => {
    logger.warn(`${req.method} método ${req.path} no implementado.`)
    res.status(404).json({ status: 'error', description: `${req.method} método ${req.path} tampoco implementado.` })
})