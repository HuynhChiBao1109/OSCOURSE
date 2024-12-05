const log = require('../services/logger.service')('VideoProcessingService')

var supabase = ''
class VideoProcessingService {
    /**
     * Initializes the video processing service.
     * @returns {Promise<void>} A promise that resolves when the initialization is complete.
     */
    async init() {
        try {
            log.info('Initializing video processing service')
            require('../dbs/supabase.db')()
                .init()
                .then((client) => {
                    supabase = client
                    this.realtime()
                })
        } catch (error) {
            log.error(`Error: ${error.message}`)
            global.Sentry.captureException(error)
        }
    }
    /**
     * Subscribes to the 'videoQueue' channel and handles processing of inserted videoQueue records.
     * @returns {Promise<void>} A promise that resolves when the subscription is set up.
     */
    async realtime() {
        try {
            supabase
                .channel('videoQueue')
                .on(
                    'postgres_changes',
                    {
                        event: 'INSERT',
                        schema: 'public',
                        table: 'videoQueue',
                    },
                    this.handleProcessing
                )
                .subscribe()
        } catch (error) {
            log.error(`Error: ${error.message}`)
            global.Sentry.captureException(error)
        }
    }

    /**
     * Handles the processing of a video.
     *
     * @param {Object} payload - The payload containing information about the video.
     * @param {number} payload.new.id - The ID of the video to be processed.
     * @returns {Promise<void>} - A promise that resolves when the video processing is complete.
     * @throws {Error} - If an error occurs during the video processing.
     */
    async handleProcessing(payload) {
        try {
            log.info('Received videoQueue event')
            const { data, error } = await supabase
                .from('videoQueue')
                .update({ status: 'processing' })
                .eq('id', payload.new.id)
            if (error) {
                log.error(`Error: ${error.message}`)
                global.Sentry.captureException(error)
            }
            // process video
            await processVideo(payload)
        } catch (error) {
            log.error(`Error: ${error.message}`)
            global.Sentry.captureException(error)
        }
    }
}

/**
 * Process a video.
 *
 * @param {Object} payload - The payload containing video data.
 * @returns {Promise} A promise that resolves when the video processing is complete.
 * @throws {Error} If an error occurs during video processing.
 */
async function processVideo(payload) {
    try {
        log.info('Processing video')
        const video_ref = payload.new.video_ref
        if (!video_ref) {
            throw new Error('Video reference not found')
        }
        // get video from storage
        const { data, error } = await supabase.storage
            .from('CourseVideos')
            .download(`${video_ref}`)
        if (error) {
            log.error(`Error: ${error.message}`)
            global.Sentry.captureException(error)
        }
        // convert video to array buffer
        const arrayBuffer = await data.arrayBuffer()
        const video = Buffer.from(arrayBuffer)
        // create mpd mainifest with original, 1080p, 720p, 480p, 360p quality. after that, upload to storage as video_ref.mpd and other chunks to storage
        await createMpdManifest(video, video_ref)
    } catch (error) {
        log.error(`Error: ${error.message}`)
        global.Sentry.captureException(error)
    }
}

/**
 * Create an MPD manifest for a video.
 *
 * @param {Buffer} video - The video to create the manifest for.
 * @returns {Promise} A promise that resolves when the manifest is created.
 * @throws {Error} If an error occurs during the manifest creation.
 */
async function createMpdManifest(video, video_ref) {
    try {
        // using child_process to run ffmpeg command
        const { exec } = require('child_process')
        const fs = require('fs')
        log.info('Creating MPD manifest')
        // create temp file for video
        const tempFilePath = `${global.config.get(
            'VIDEO_PROCESSING_FOLDER'
        )}/${video_ref}`
        // directory = video_ref without last segment eg 65f1a1b9d6a6269adddf96dc/65f4603542e3f16925aa74b8/65f463be42e3f16925aa74bc => 65f1a1b9d6a6269adddf96dc/65f4603542e3f16925aa74b8
        const directory =
            global.config.get('VIDEO_PROCESSING_FOLDER') +
            '/' +
            video_ref.split('/').slice(0, -1).join('/')
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true })
        }
        fs.writeFileSync(tempFilePath, video)
        /*
        ffmpeg -i in.video -c:v libvpx-vp9 -keyint_min 150 \
-g 150 -tile-columns 4 -frame-parallel 1 -f webm -dash 1 \
-an -vf scale=160:90 -b:v 250k -dash 1 video_160x90_250k.webm \
-an -vf scale=320:180 -b:v 500k -dash 1 video_320x180_500k.webm \
-an -vf scale=640:360 -b:v 750k -dash 1 video_640x360_750k.webm \
-an -vf scale=640:360 -b:v 1000k -dash 1 video_640x360_1000k.webm \
-an -vf scale=1280:720 -b:v 1500k -dash 1 video_1280x720_1500k.webm
        */

        // run ffmpeg command to create video
        //get the last /
        const video_id = directory.substring(directory.lastIndexOf('/') + 1)
        exec(
            `${global.config.get(
                'FFMPEG_PATH'
            )} -i ${tempFilePath} -c:v libvpx-vp9 -keyint_min 150 -g 150 -tile-columns 4 -frame-parallel 1 -f webm -dash 1 -an -vf scale=160:90 -b:v 250k -dash 1 ${directory}/${video_id}_160x90_250k.webm -an -vf scale=320:180 -b:v 500k -dash 1 ${directory}/${video_id}_320x180_500k.webm -an -vf scale=640:360 -b:v 750k -dash 1 ${directory}/${video_id}_640x360_750k.webm -an -vf scale=640:360 -b:v 1000k -dash 1 ${directory}/${video_id}_640x360_1000k.webm -an -vf scale=1280:720 -b:v 1500k -dash 1 ${directory}/${video_id}_1280x720_1500k.webm`,
            (error, stdout, stderr) => {
                if (error) {
                    log.error(`Error: ${error.message}`)
                    global.Sentry.captureException(error)
                }
                if (stderr) {
                    log.error(`Error: ${stderr}`)
                    global.Sentry.captureException(stderr)
                }
                log.info(`stdout: ${stdout}`)
                log.info('Video processed')
                /*
                ffmpeg \
  -f webm_dash_manifest -i video_160x90_250k.webm \
  -f webm_dash_manifest -i video_320x180_500k.webm \
  -f webm_dash_manifest -i video_640x360_750k.webm \
  -f webm_dash_manifest -i video_1280x720_1500k.webm \
  -f webm_dash_manifest -i my_audio.webm \
  -c copy \
  -map 0 -map 1 -map 2 -map 3 -map 4 \
  -f webm_dash_manifest \
  -adaptation_sets "id=0,streams=0,1,2,3 id=1,streams=4" \
  my_video_manifest.mpd
                */
                // run ffmpeg command to create mpd manifest
                exec(
                    `${global.config.get(
                        'FFMPEG_PATH'
                    )} -f webm_dash_manifest -i ${directory}/${video_id}_160x90_250k.webm -f webm_dash_manifest -i ${directory}/${video_id}_320x180_500k.webm -f webm_dash_manifest -i ${directory}/${video_id}_640x360_750k.webm -f webm_dash_manifest -i ${directory}/${video_id}_1280x720_1500k.webm -c copy -map 0 -map 1 -map 2 -map 3 -f webm_dash_manifest -adaptation_sets "id=0,streams=0,1,2,3" ${directory}/manifest.mpd`,
                    (error, stdout, stderr) => {
                        if (error) {
                            log.error(`Error: ${error.message}`)
                            global.Sentry.captureException(error)
                        }
                        if (stderr) {
                            log.error(`Error: ${stderr}`)
                            global.Sentry.captureException(stderr)
                        }
                        log.info(`stdout: ${stdout}`)

                        log.info('MPD manifest created')
                        // add token to manifest

                        // upload to storage
                        uploadToStorage(directory, video_ref)
                    }
                )
            }
        )
    } catch (error) {
        log.error(`Error: ${error.message}`)
        global.Sentry.captureException(error)
    }
}

/**
 * Uploads a video and its chunks to storage.
 *
 * @param {string} directory - The directory containing the video and its chunks.
 * @param {string} video_ref - The reference to the video.
 * @returns {Promise} A promise that resolves when the upload is complete.
 * @throws {Error} If an error occurs during the upload.
 */
async function uploadToStorage(directory, video_ref) {
    try {
        log.info('Uploading to storage')
        const fs = require('fs')
        const path = require('path')
        const { data, error } = await supabase.storage
            .from('CourseVideos')
            .upload(
                `${video_ref}.mpd`,
                fs.createReadStream(`${directory}/manifest.mpd`),
                {
                    duplex: 'half',
                }
            )
        if (error) {
            log.error(`Error: ${error.message}`)
            global.Sentry.captureException(error)
        }
        const files = fs.readdirSync(directory)
        for (const file of files) {
            const { data, error } = await supabase.storage
                .from('CourseVideos')
                .upload(
                    `${video_ref}/${file}`,
                    fs.createReadStream(path.join(directory, file)),
                    {
                        duplex: 'half',
                    }
                )
            if (error) {
                log.error(`Error: ${error.message}`)
                global.Sentry.captureException(error)
            }
        }
        log.info('Uploaded to storage')
        // get public manifest url from storage
        const { publicURL, error: urlError } = await supabase.storage
            .from('CourseVideos')
            .getPublicUrl(`${video_ref}/manifest.mpd`)
        if (urlError) {
            log.error(`Error: ${urlError.message}`)
            global.Sentry.captureException(urlError)
        }
        // update videoQueue status to complete and add public manifest url
        const { data: updateData, error: updateError } = await supabase
            .from('videoQueue')
            .update({ status: 'done', manifest_url: publicURL })
            .eq('video_ref', video_ref)
        if (updateError) {
            log.error(`Error: ${updateError.message}`)
            global.Sentry.captureException(updateError)
        }
        log.info(`publicURL: ${publicURL}`)
        log.info('Updated videoQueue status to complete')
    } catch (error) {
        log.error(`Error: ${error.message}`)
        global.Sentry.captureException(error)
    }
}

module.exports = () => {
    return new VideoProcessingService()
}
