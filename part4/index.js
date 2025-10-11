const app = require("./app")
const config = require("./utils/config")
const logger = require("./utils/logger")
const testingRouter = require('./controllers/testing')

if (process.env.NODE_ENV === 'test') {
    app.use('/api/testing', testingRouter)
}

app.listen(config.PORT, () => {
        logger.info(`Server running on port ${config.PORT}`)
    })
