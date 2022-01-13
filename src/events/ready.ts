/**
 * @file Ready
 * @description Event ran on launch
 * @author Spencer-0003
 */

// Import types, classes & environment variables
import { ApplicationCommandStructure, Constants } from 'eris';
import { Event } from '@core/Event';

const { NODE_ENV, DEVELOPMENT_GUILD } = process.env;

// Export class
export class Ready extends Event {
  async run(): Promise<void> {
    this.client.editStatus('dnd', { name: 'Starting...', type: Constants.ActivityTypes.WATCHING });

    const commands = await (NODE_ENV === 'development' ? this.client.getGuildCommands(DEVELOPMENT_GUILD) : this.client.getCommands());
    const newCommands = this.client.commands.filter(cmd => !commands.some(c => c.name === cmd.name));
    const deletedCommands = commands.filter(cmd => !this.client.commands.some(c => c.name === cmd.name));

    // Add/delete commands
    if (newCommands.length || deletedCommands.length)
      if (NODE_ENV === 'development') (await this.client.getRESTGuild(DEVELOPMENT_GUILD)).bulkEditCommands(this.client.commands as ApplicationCommandStructure[]);
      else this.client.bulkEditCommands(this.client.commands as ApplicationCommandStructure[]);

    setInterval(() => {
      this.client.editStatus('online', {
        name: `${this.client.guilds.size} guilds | v${this.client.version}`,
        type: Constants.ActivityTypes.WATCHING
      });
    }, 30000);

    this.client.editStatus('online', {
      name: `${this.client.guilds.size} guilds | v${this.client.version}`,
      type: Constants.ActivityTypes.WATCHING
    });
    console.log("[Syrim]: I'm online.");
  }
}
