const axios = require('axios');
require('dotenv').config();

function getInitChannel(guildId) {
    const data = JSON.stringify({
        "collection": "init_channels",
        "database": "initiatiefnemer",
        "dataSource": "Initiatiefnemer",
        "filter": {
            "_id": guildId
        },
        "projection": {
            "channel": 1
        }
    });

    const config = {
        method: 'post',
        url: 'https://eu-central-1.aws.data.mongodb-api.com/app/data-mjqhl/endpoint/data/v1/action/findOne',
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Request-Headers': '*',
            'api-key': process.env.DBKEY,
        },
        data: data
    };

    axios(config)
        .then(function (response) {
            if (document === null) {
                return null
            }
            return response.data.document.channel
        })
        .catch(function (error) {
            console.log(error);
            return null
        });
}

module.exports = {
    getInitChannel: getInitChannel
};