const config = require('./src/configs')
const log = require('./src/services/logger.service')('Bootstrap')
const Sentry = require('@sentry/node')
const path = require('path')
const fs = require('fs')

let restServer, graphqlServer

const preRun = async () => {
    log.info('Stage: Pre run')
    // load config based on environment
    global.config = config(process.env.NODE_ENV || 'development')
    // load sentry
    Sentry.init({
        dsn: global.config.get('SENTRY_DSN'),
        // perfomance monitoring
        tracesSampleRate: 1.0,
        integrations: [
            new Sentry.Integrations.Http({ tracing: true }),
            new Sentry.Integrations.OnUncaughtException(),
            new Sentry.Integrations.OnUnhandledRejection(),
            new Sentry.Integrations.Console(),
        ],
        environment: global.config.get('NODE_ENV'),
        debug: global.config.get('NODE_ENV') === 'development',
    })
    global.Sentry = Sentry // make Sentry available globally

    // root directory
    global.config.set('ROOT_DIR', __dirname)
    // ffmpeg path
    try {
        // check if ffmpeg path is set
        if (!global.config.get('FFMPEG_PATH')) {
            log.error('FFMPEG_PATH is not set, attempting to set it...')
            // determine the platform
            if (process.platform === 'win32') {
                // set path for windows in __dirname + ffmpeg/windows/ffmpeg.exe
                global.config.set(
                    'FFMPEG_PATH',
                    path.join(__dirname, 'ffmpeg', 'windows', 'ffmpeg.exe')
                )
            } else if (process.platform === 'linux') {
                // set path for linux in __dirname + ffmpeg/linux/ffmpeg
                global.config.set(
                    'FFMPEG_PATH',
                    path.join(__dirname, 'ffmpeg', 'linux', 'ffmpeg')
                )
            } else if (process.platform === 'darwin') {
                // set path for mac in __dirname + ffmpeg/mac/ffmpeg
                global.config.set(
                    'FFMPEG_PATH',
                    path.join(__dirname, 'ffmpeg', 'mac', 'ffmpeg')
                )
            }
            log.info(`FFMPEG_PATH set to ${global.config.get('FFMPEG_PATH')}`)
        }

        // check if ffprobe path is set
        if (!global.config.get('FFPROBE_PATH')) {
            log.error('FFPROBE_PATH is not set, attempting to set it...')
            // determine the platform
            if (process.platform === 'win32') {
                // set path for windows in __dirname + ffmpeg/windows/ffprobe.exe
                global.config.set(
                    'FFPROBE_PATH',
                    path.join(__dirname, 'ffmpeg', 'windows', 'ffprobe.exe')
                )
            } else if (process.platform === 'linux') {
                // set path for linux in __dirname + ffmpeg/linux/ffprobe
                global.config.set(
                    'FFPROBE_PATH',
                    path.join(__dirname, 'ffmpeg', 'linux', 'ffprobe')
                )
            } else if (process.platform === 'darwin') {
                // set path for mac in __dirname + ffmpeg/mac/ffprobe
                global.config.set(
                    'FFPROBE_PATH',
                    path.join(__dirname, 'ffmpeg', 'mac', 'ffprobe')
                )
            }
            log.info(`FFPROBE_PATH set to ${global.config.get('FFPROBE_PATH')}`)
        }

        // check if folder for video processing is set
        if (!global.config.get('VIDEO_PROCESSING_FOLDER')) {
            log.error(
                'VIDEO_PROCESSING_FOLDER is not set, attempting to set it...'
            )
            // set path for video processing folder in __dirname + video-processing
            global.config.set(
                'VIDEO_PROCESSING_FOLDER',
                path.join(__dirname, 'video-processing')
            )
            log.info(
                `VIDEO_PROCESSING_FOLDER set to ${global.config.get(
                    'VIDEO_PROCESSING_FOLDER'
                )}`
            )
        }

        // attempt to clear video processing folder using fs.rm
        log.info('Clearing VIDEO_PROCESSING_FOLDER')
        try {
            fs.rmSync(global.config.get('VIDEO_PROCESSING_FOLDER'), {
                recursive: true,
            })
        } catch (error) {
            log.error(`Error: ${error.message}`)
        }

        // check if folder for video processing is created
        if (!fs.existsSync(global.config.get('VIDEO_PROCESSING_FOLDER'))) {
            log.error(
                'VIDEO_PROCESSING_FOLDER is not found, attempting to create it...'
            )
            // create video processing folder
            fs.mkdirSync(global.config.get('VIDEO_PROCESSING_FOLDER'))
            log.info(
                `VIDEO_PROCESSING_FOLDER created at ${global.config.get(
                    'VIDEO_PROCESSING_FOLDER'
                )}`
            )
        }
    } catch (error) {
        Sentry.captureException(error)
        log.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

const postRun = async () => {
    try {
        log.info('Stage: Post run')
        const restApp = require('./src/apps/rest.app')
        const graphqlApp = require('./src/apps/graphql.app')

        const scheduleService = require('./src/services/schedule.service')
        const videoProcessingService =
            require('./src/services/videoProcessing.service')()
        // create rest server
        restServer = new restApp()
        // create graphql server
        graphqlServer = new graphqlApp()
        // start rest server
        restServer.start()

        // start graphql server
        graphqlServer.start()

        // start payment service
        // paymentService.init()

        // start video processing service
        videoProcessingService.init()

        // start schedule service
        scheduleService.init()
    } catch (error) {
        Sentry.captureException(error)
        log.error(`Error: ${error.stack}`)
        process.exit(1)
    }
}

const afterRun = async () => {
    try {
        log.info('Stage: After run')
        log.info('Exiting... in 5 seconds')
        await new Promise((r) => setTimeout(r, 5000)).then(() => {
            log.info('Exited')
            process.exit(1)
        })
    } catch (error) {
        Sentry.captureException(error)
        log.error('Error', error)
        process.exit(1)
    }
}
const devFunction = async () => {
    try {
        if (process.env.NODE_ENV === 'development') {
            log.info('Dev function')
        }
    } catch (error) {
        Sentry.captureException(error)
        log.error(`Error: ${error.message}`)
    }
}
// IIFE (Immediately Invoked Function Expression)
;(async () => {
    try {
        await preRun()
        await postRun()
        log.info('Bootstrap completed')
        await devFunction()
        process.on('unhandledRejection', async (error) => {
            log.error(`unhandledRejection: ${error.message}`)
            await afterRun()
        })
        // catch uncaughtException event
        process.on('uncaughtException', async (error) => {
            Sentry.captureException(error)
            log.error(`uncaughtException: ${error.message}`)
            await afterRun()
        })
        // catch on exit event
        process.on('exit', async (code) => {
            log.info(`About to exit with code: ${code}`)
            await afterRun()
        })
        // catch CTRL+C event
        process.on('SIGINT', async () => {
            log.info('Caught interrupt signal')
            await afterRun()
        })
    } catch (error) {
        log.error('Error', error)
        await afterRun()
    }
})()
