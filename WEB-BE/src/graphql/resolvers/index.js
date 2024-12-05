const { userQueries, userMutations } = require('./user')
const { courseQueries, courseMutations } = require('./course')
const { courseChapterQueries, courseChapterMutations, } = require('./courseChapter')
const { courseLessonMutations } = require('./courseLesson')
const { progressCourseQueries, progressCourseMutations } = require('./progress')
const { commentQueries, commentMutations } = require('./comment')
const { transactionQueries } = require('./transaction')
const { authenMutaions, authenQueries } = require('./authen')
const { collectionQueries } = require('./collection')
const { paymentMutaions, paymentQueries } = require('./payment')
const { certificateQueries, certificateMutations } = require('./certificate')
const { notificationQueries } = require('./notification')

const resolvers = {
    Query: {
        ...userQueries,
        ...courseQueries,
        ...courseChapterQueries,
        ...progressCourseQueries,
        ...commentQueries,
        ...transactionQueries,
        ...authenQueries,
        ...collectionQueries,
        ...certificateQueries,
        ...notificationQueries,
        ...paymentQueries,
    },

    Mutation: {
        ...userMutations,
        ...courseMutations,
        ...courseChapterMutations,
        ...courseLessonMutations,
        ...commentMutations,
        ...authenMutaions,
        ...paymentMutaions,
        ...certificateMutations,
        ...progressCourseMutations,
    },
}

module.exports = resolvers
