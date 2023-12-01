import Redis from 'ioredis';

const NODE = "hsa1013-redis:6373";

/**
 * Get an existing Redis client instance. Build one if necessary
 * @return {Cluster|null} redis client
 * */
function buildRedisClient() {
    try {
        const client = new Redis({
            host: NODE.split(":")[0],
            port: NODE.split(":")[1]
        });

        client.on('error', error => {
            console.error('Redis Error', error);
        });

        client.on('connect', () => {
            console.log('Redis Connection stablished');
        });

        client.on('ready', () => {
            console.log('Redis client ready');
        });

        client.on('end', () => {
            console.log('Redis client connection ended');
        });

        // Emits when an error occurs when connecting 
        // to a node when using Redis in Cluster mode
        client.on('node error', (error, node) => {
            console.error(`Redis error in node ${node}`, error);
        });

        return client;
    } catch (error) {
        console.error('Could not create a Redis client, error: ', error);

        return null;
    }
}

export default buildRedisClient;