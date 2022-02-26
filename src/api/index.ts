/**
 * @file Index
 * @description Starts the API server
 * @author Spencer-0003
 * @todo Add routes after expanding API
 */

// Import client & fastify
import type { SyrimClient } from '@core/Client';
import fastify from 'fastify';
import helmet from 'fastify-helmet';

const server = fastify();

server.get('/', async () => 'API Online');

// Export launch
export const launchAPI = (client: SyrimClient): void => {
  server.register(helmet);

  server.get('/api/v1/user/:id', async req => {
    const profile = await client.database.getUserIfExists((req.params as Record<string, string>).id);
    if (!profile) return { success: false, error: { code: 'no_profile', message: "This user doesn't have a profile." } };
    else if (!profile.visibleInAPI) return { success: false, error: { code: 'api_disabled', message: 'This user has disabled API access to their profile.' } };

    return {
      success: true,
      data: {
        attributes: JSON.parse(profile.attributes),
        discord: client.users.get(profile.id) ?? (await client.getRESTUser(profile.id)),
        profile: {
          bio: profile.bio,
          birthday: profile.birthday,
          color: profile.color,
          gender: profile.gender,
          level: profile.level,
          lover: profile.lover,
          money: profile.money,
          reputation: profile.reputation,
          xp: profile.xp
        }
      }
    };
  });

  server.listen(process.env.API_PORT ?? 3000, '0.0.0.0', err => {
    if (err) throw new Error('[API]: Port already in use.');
  });
};
