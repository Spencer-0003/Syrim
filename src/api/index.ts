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
    if (!profile) return { StatusCode: 400, Message: "This user doesn't have a profile." };
    else if (!profile.visibleInAPI) return { StatusCode: 400, Message: 'This user has disabled API access to their profile.' };

    return {
      id: profile.id,
      bio: profile.bio,
      birthday: profile.birthday,
      color: profile.color,
      gender: profile.gender,
      level: profile.level,
      lover: profile.lover,
      money: profile.money,
      reputation: profile.reputation,
      xp: profile.xp,
      attributes: JSON.parse(profile.attributes)
    };
  });

  server.listen(process.env.API_PORT ?? 3000, '0.0.0.0', (err, address) => {
    if (err) throw new Error('[API]: Port already in use.');
    console.log(`Server running at: ${address}`); // remove later
  });
};
