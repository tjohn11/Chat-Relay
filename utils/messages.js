const moment = require('moment');

const format = (user, text) => {
    return {
        user,
        text,
        time: moment().format('MM/DD/YYYY h:mm a')
    }
};

module.exports = format;