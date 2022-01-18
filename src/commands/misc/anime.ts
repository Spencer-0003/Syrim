/**
 * @file Anime
 * @description Returns information about the chosen anime
 * @author Spencer-0003
 */

// Import classes & types
import type { CommandInteraction, Message } from 'eris';
import type { SyrimClient } from '@core/Client';
import type { Data } from '@typings/command';
import { Constants } from 'eris';
import { GraphQLClient } from 'graphql-request';
import { COLORS } from '@utilities/Constants';
import { Command } from '@core/Command';

const graphQl = new GraphQLClient('https://graphql.anilist.co/');
const query = `query ($search: String) {
  Media(search: $search, type: ANIME, isAdult: false) {
      id
      siteUrl
      title {
          romaji
      }
      coverImage {
          large
      }
      status(version: 2)
      averageScore
      description
      episodes
  }
}`;

// Export class
export class Anime extends Command {
  constructor(client: SyrimClient) {
    super(client, {
      name: 'anime',
      description: 'Returns information about the chosen anime.',
      category: 'misc',
      options: [
        {
          name: 'anime',
          description: 'The anime to get information about.',
          type: Constants.ApplicationCommandOptionTypes.STRING,
          required: true
        }
      ]
    });
  }

  async run(interaction: CommandInteraction, args: Record<string, string>, data: Data): Promise<Message> {
    const animeData = await graphQl.request(query, { search: args.anime });
    return interaction.createFollowup({
      embeds: [
        {
          title: animeData.Media.title.romaji,
          description: animeData.Media.description.replace(/<br>/g, ''),
          thumbnail: { url: animeData.Media.coverImage.large },
          fields: [
            { name: this.client.locale.translate(data.locale, 'anime.EPISODES'), value: animeData.Media.episodes, inline: true },
            { name: this.client.locale.translate(data.locale, 'anime.AVERAGE_RATING'), value: `${animeData.Media.averageScore}/100`, inline: true },
            { name: this.client.locale.translate(data.locale, 'anime.STATUS'), value: animeData.Media.status, inline: true }
          ],
          color: COLORS.LIGHT_BLUE,
          footer: { icon_url: 'https://anilist.co/favicon.ico', text: this.client.locale.translate(data.locale, 'misc.POWERED_BY_ANILIST') }
        }
      ]
    });
  }
}
