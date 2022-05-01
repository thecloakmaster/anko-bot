const fetch = require(`node-fetch`)

module.exports = {
    async execute(aniTitle) {
        let returnData = null
        let statuses = [`RELEASING`, `NOT_YET_RELEASED`, `FINISHED`, `CANCELLED`]
        for (let s of statuses) {
            let query = `query ($search: String, $status: MediaStatus) { 
                Media(search: $search type: ANIME status: $status) {
                    title {
                        romaji
                        english
                        native
                        userPreferred
                    }
                    season
                    seasonYear
                    status
                    episodes
                    siteUrl
                    nextAiringEpisode {
                        airingAt
                        timeUntilAiring
                        episode
                    }
                    coverImage{
                        extraLarge
                        color  
                    }
                }
            }`;
            let variables = {
                status: s,
                search: aniTitle
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
            if (returnData) {
                break
            }
        }
        if (!returnData) {
            return null
        } else if (returnData) {
            return returnData
        }
    }
}