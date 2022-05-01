const fetch = require(`node-fetch`)

module.exports = {
    async execute(AniListURL) {
        let returnData = null
        let query = `query ($siteUrl: String) {
            Media(siteUrl: $siteUrl) {
                averageScore
                meanScore
            }
        }`
        let variables = {
            siteUrl: AniListURL
        };
        let accessToken = `${process.env.AniListToken}`
        let url = 'https://graphql.anilist.co'
        let options = {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                query: query,
                variables: variables
            })
        };
        await fetch(url, options).then(handleResponse).then((data) => {
            returnData = data.data.Media
        }).catch(() => {});
        function handleResponse(response) {
            return response.json().then(function (json) {
                return response.ok ? json : Promise.reject(json);
            });
        }
        if (!returnData) {
            return null
        } else if (returnData) {
            return returnData
        }
    }
}