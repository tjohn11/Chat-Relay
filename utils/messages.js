const moment = require('moment');

const formatMessage = (user, text) => {
    console.log(user, text);
    return {
        user,
        text,
        time: moment().format('MM/DD/YYYY h:mm a')
    }
};

module.exports = formatMessage;