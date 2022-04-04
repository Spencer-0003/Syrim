/**
 * @file Error
 * @description Log errors
 * @author Spencer-0003
 */

// Import classes, types & constants
import type { DiscordRESTError } from 'eris';
import { Event } from '@core/Event';
import { COLORS } from '@utilities/Constants';

// Export class
export class ErrorLog extends Event {
  async run(err: DiscordRESTError): Promise<void> {
    if (err.code === 1006 || err.code === 1001) return;

    const webhook = await this.client.getOrCreateWebhook(process.env.NODE_ENV === 'development' ? process.env.DEVELOPMENT_LOGS : process.env.ERROR_LOGS);
    this.client.executeWebhook(webhook.id, webhook.token!, {
      embed: {
        title: 'Error',
        color: COLORS.RED,
        fields: [
          { name: 'Message', value: `\`\`\`${err.message}\`\`\``, inline: false },
          { name: 'Stack', value: `\`\`\`${err.stack}\`\`\``, inline: true }
        ]
      }
    });
  }
}
