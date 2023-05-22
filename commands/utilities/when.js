const { MessageEmbed } = require("discord.js")
const fetch = require(`node-fetch`)
const MangaChapter = require(`../../database/MangaChapter.js`)

async function timeTillAiring() {
    let returnData = null    
    let query = `query { 
        Media(id: 141391, type: ANIME) {
            status   
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
            query: query            
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
    }
    return returnData
}

module.exports = {
    name: 'when',
    description: 'The answer to next chapter/episode when?',
    usage: ';when <eng || en (For English chapters) || jp (For Japanese raws published in the magazine) || a || anime || episode || ep (For anime episodes)>',
    async execute(message, args, client) {
        let mangaTime = await MangaChapter.findOne({GuildID: message.guild.id, ClientID: client.user.id})
        let rawChp = 'The Japanese raws release every Wednesday at 00:00 JST in the Shuukan Shounen Sunday.'
        // let animeTime = 'The Japanese raws (episode without subtitles) release every Friday at 01:05 JST. The English subtitles usually release an hour later.'
        // let animeFetch = await timeTillAiring()
        // if (animeFetch) {
        //     if (animeFetch?.status === 'FINISHED') {
        //         animeTime = 'The anime has ended, all we can do now is hope for season 2 and support the series in any and every way we can so that season 2 arrives faster.'
        //     } else if (animeFetch?.status === 'RELEASING') {
        //         if (animeFetch.nextAiringEpisode.timeUntilAiring && animeFetch.nextAiringEpisode.episode) {
        //             if (animeFetch.nextAiringEpisode.airingAt) {
        //                 animeTime = `Episode ${animeFetch.nextAiringEpisode.episode} airs in <t:${Math.round(Date.now()/1000 + animeFetch.nextAiringEpisode.timeUntilAiring)}:R> at <t:${animeFetch.nextAiringEpisode.airingAt}:F>. The English subtitles usually release an hour later.`
        //             } else {
        //                 animeTime = `Episode ${animeFetch.nextAiringEpisode.episode} airs in <t:${Math.round(Date.now()/1000 + animeFetch.nextAiringEpisode.timeUntilAiring)}:R>. The English subtitles usually release an hour later.`
        //             }
        //         } else if (animeFetch.nextAiringEpisode.timeUntilAiring && !animeFetch.nextAiringEpisode.episode) {
        //             if (animeFetch.nextAiringEpisode.airingAt) {
        //                 animeTime = `The next episode airs in <t:${Math.round(Date.now()/1000 + animeFetch.nextAiringEpisode.timeUntilAiring)}:R> at <t:${animeFetch.nextAiringEpisode.airingAt}:F>. The English subtitles usually release an hour later.`
        //             } else {
        //                 animeTime = `The next episode airs in <t:${Math.round(Date.now()/1000 + animeFetch.nextAiringEpisode.timeUntilAiring)}:R>. The English subtitles usually release an hour later.`
        //             }
        //         }
        //     }                       
        // }
        if (mangaTime) {
            rawChp = `${rawChp}\n**Timestamps for the release of the raws:** <t:${mangaTime.WednesdayTimestamp}:F> <t:${mangaTime.WednesdayTimestamp}:R>`;
        }
        let embed = new MessageEmbed()
            .setAuthor({name: `${client.user.username}`, iconURL: `${client.user.displayAvatarURL({dynamic: true, size: 1024})}`})
            .setColor(`${process.env.colour}`);

        if (!args[0]) {
            embed.addFields({name: 'Chapters Translated To English', value: `Viz releases the chapter 7 hours after it\'s released in Japan.\n\n**Timestamps for the release of the translated chapter:** <t:${mangaTime.WednesdayTimestamp + 25200}:F>\n<t:${mangaTime.WednesdayTimestamp + 25200}:R>`}, 
            {name: 'Japanese Raw Chapters', value: `${rawChp}`}, {name: "Anime", value: "**No season 2 has been announced.**"});
        } else if (args[0] === 'eng' || args[0] === 'en') {
            embed.setTitle('Viz releases the chapter 7 hours after it\'s released in Japan.');
            embed.setURL('https://cubari.moe/read/gist/cmF3L3RoZWNsb2FrbWFzdGVyL3lvZnVrYXNoaS1uby11dGEvbWFpbi9tYWluLmpzb24/');
            embed.setDescription(`**Timestamps for the release of the translated chapter:** <t:${mangaTime.WednesdayTimestamp + 25200}:F> <t:${mangaTime.WednesdayTimestamp + 25200}:R>`);
        } else if (args[0] === 'jp') {
            embed.setTitle('Wednesday at 00:00 JST')
            embed.setDescription(`${rawChp}`)
        } else if (args[0] === 'a' || args[0] === 'anime' || args[0] === 'episode' || args[0] === 'ep') {
            embed.setTitle('No season 2 has been announced')
            // embed.setDescription(`${animeTime}`)
            // if (animeFetch?.coverImage?.extraLarge) {
            //     embed.setImage(`${animeFetch.coverImage.extraLarge}`)
            // }
            // if (animeFetch?.coverImage?.color) {
            //     embed.setColor(`${animeFetch.coverImage.color}`)
            // }
        } else {
            return message.channel.send('No results for the specified arguments.')
        }
        return message.channel.send({embeds: [embed]})
    }
}