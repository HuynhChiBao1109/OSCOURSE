const moment = require('moment');


const getNow = () => {
    return moment().format('YYYY-MM-DD HH:mm:ss')
}

const getNowDate = () => {
    return moment().format('YYYY-MM-DD')
}

const getNowTime = () => {
    return moment().format('HH:mm:ss')
}

const convertToNormalDate = (date) => {
    return moment(date).format('YYYY-MM-DD')
}

function addMonthsToDate(date, months) {
    // Create a copy of the original date to avoid modifying it directly
    const newDate = new Date(date.getTime());

    // Get the current month (0-indexed)
    const currentMonth = newDate.getMonth();

    // Add the desired months
    newDate.setMonth(currentMonth + months);

    // Handle overflowing months (e.g., December + 3 becomes March of next year)
    if (newDate.getMonth() !== (currentMonth + months) % 12) {
        newDate.setFullYear(newDate.getFullYear() + 1);
    }

    // Return the modified date
    return newDate;
}

module.exports = {
    getNow,
    getNowDate,
    getNowTime,
    convertToNormalDate,
    addMonthsToDate
}