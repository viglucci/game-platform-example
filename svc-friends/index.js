const process = require('process');
const closeWithGrace = require('close-with-grace');
const { start, stop } = require('./src/server');
const pino = require('pino');
const logger = pino();

start()
    .then(() => {
        logger.info("server started...");
        closeWithGrace(async (error, signal) => {
            if (error) {
                logger.error(error);
            }
            setTimeout(() => {
                logger.warn("Process has failed to exit after 2 seconds. Forcing exit.");
                process.exit(signal);
            }, 2000);
            await stop();
        }); 
    })
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
