const {
    MessageEmbed
} = require('discord.js');
const {
    MovieDb
} = require('moviedb-promise');
const moviedb = new MovieDb('2c0a43f59500617a56dc48b20a94ef14')

module.exports = {
    name: `tmdb`,
    description: `Searches the TMDB database for a movie or a TV show and gives you the top rated result.`,
    usage: `;tmdb <m(movie)/t(TV series)> <Movie name>`,
    async execute(message, args, client) {
        if (!args) {
            return message.channel.send(`No arguments provided.`)
        }
        if (args[0] === 'm') {
            let movieSearch = await moviedb.searchMovie({
                query: `${args.slice(1).join(" ")}`,
                page: 1
            })
            movieSearch = movieSearch.results
            if (movieSearch.length === 0) {
                return message.channel.send(`No title with the name \`${args.slice(1).join(" ")}\` was found.`)
            }
            movieSearch.sort((a, b) => parseFloat(b.vote_average - a.vote_average))
            let movie = movieSearch[0]
            const embed = new MessageEmbed()
                .setTitle(movie.title)
                .setDescription(movie.overview)
                .setURL(`https://www.themoviedb.org/movie/${movie.id}`)
                .setThumbnail(`https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`)
                .setColor(`${process.env.colour}`)
            if (movie.vote_average) {
                embed.addField(`Rating`, `${movie.vote_average}`, true)
            }
            if (movie.original_language) {
                embed.addField(`Original Language`, `${movie.original_language}`, true)
            }
            if (movie.release_date) {
                embed.addField(`Release Date (YYYY/MM/DD)`, `${movie.release_date}`, true)
            }
            return message.channel.send({
                embeds: [embed]
            })
        } else if (args[0] === 't') {
            let movieSearch = await moviedb.searchTv({
                query: `${args.slice(1).join(" ")}`,
                page: 1
            })
            movieSearch = movieSearch.results
            if (movieSearch.length === 0) {
                return message.channel.send(`No title with the name \`${args.slice(1).join(" ")}\` was found.`)
            }
            movieSearch.sort((a, b) => parseFloat(b.vote_average - a.vote_average))
            let movie = movieSearch[0]
            const embed = new MessageEmbed()
                .setTitle(movie.name)
                .setDescription(movie.overview)
                .setURL(`https://www.themoviedb.org/tv/${movie.id}`)
                .setThumbnail(`https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`)
                .setColor(`${process.env.colour}`)
            if (movie.vote_average) {
                embed.addField(`Rating`, `${movie.vote_average}`, true)
            }
            if (movie.original_language) {
                embed.addField(`Original Language`, `${movie.original_language}`, true)
            }
            if (movie.first_air_date) {
                embed.addField(`First Air Date (YYYY/MM/DD)`, `${movie.first_air_date}`, true)
            }
            return message.channel.send({
                embeds: [embed]
            })
        } else {
            let movieSearch = await moviedb.searchMovie({
                query: `${args.join(" ")}`,
                page: 1
            })
            movieSearch = movieSearch.results
            if (movieSearch.length === 0) {
                return message.channel.send(`No title with the name \`${args.join(" ")}\` was found.`)
            }
            movieSearch.sort((a, b) => parseFloat(b.vote_average - a.vote_average))
            let movie = movieSearch[0]
            const embed = new MessageEmbed()
                .setTitle(movie.title)
                .setDescription(movie.overview)
                .setURL(`https://www.themoviedb.org/movie/${movie.id}`)
                .setThumbnail(`https://image.tmdb.org/t/p/w600_and_h900_bestv2${movie.poster_path}`)
                .setColor(`${process.env.colour}`)
            if (movie.vote_average) {
                embed.addField(`Rating`, `${movie.vote_average}`, true)
            }
            if (movie.original_language) {
                embed.addField(`Original Language`, `${movie.original_language}`, true)
            }
            if (movie.release_date) {
                embed.addField(`Release Date (YYYY/MM/DD)`, `${movie.release_date}`, true)
            }
            return message.channel.send({
                embeds: [embed]
            })
        }
    }
}