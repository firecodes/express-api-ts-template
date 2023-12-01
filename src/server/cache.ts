// import { LRUCache } from 'lru-cache';
import { createClient } from 'redis';

export type Seconds = number;

export interface CacheClient {
  set(key: string, value: any, ttl?: Seconds): Promise<void>
  get<T = any>(key: string): Promise<T>
  has(key: string): Promise<boolean>
  del(key: string): Promise<any>
  clear(): Promise<void>
}

// const getLRUClient = (): CacheClient => {
//   // https://github.com/isaacs/node-lru-cache
//   const lruCache = new LRUCache<string, any>({ max: 500 });
//   const set = async (key: string, value: any, ttl?: number) => {
//     if (ttl) {
//       await lruCache.set(key, value, { ttl: ttl * 1000 });
//     } else {
//       await lruCache.set(key, value);
//     }
//   };

//   return {
//     set,
//     get: async (key) => lruCache.get(key),
//     has: async (key) => lruCache.has(key),
//     del: async (key) => lruCache.delete(key),
//     clear: async () => lruCache.clear(),
//   };
// };

const getRedisClient = async (options?: CacheClientOptions): Promise<CacheClient> => {
  // https://github.com/redis/node-redis
  const client = createClient();
  client.on('connect', () => console.info('[Redis]', 'connecting...'));
  client.on('reconnecting', () => console.info('[Redis]', 'reconnecting...'));
  client.on('ready', () => console.info('[Redis]', 'readied.'));
  client.on('error', (error: any) => console.warn('[Redis]', 'client error!', error.message || error));
  await client.connect();

  const getCacheKey = (key: string) => {
    let $namespace = options?.namespace ?? 'ssr_app';
    return `${$namespace}:${key}`;
  };

  const set: CacheClient['set'] = async (key, value, ttl) => {
    let $value = value ? JSON.stringify(value) : '';
    if (ttl) {
      // EX — Set the specified expire time, in seconds.
      await client.set(getCacheKey(key), $value, { EX: ttl });
    } else {
      await client.set(getCacheKey(key), $value);
    }
  };

  const get: CacheClient['get'] = async (key) => {
    const value = await client.get(getCacheKey(key));
    return value ? JSON.parse(value) : value;
  };

  const has: CacheClient['has'] = async (key) => {
    const value = await client.exists(getCacheKey(key));
    return Boolean(value);
  };

  const del: CacheClient['del'] = (key) => client.del(getCacheKey(key));

  const clear: CacheClient['clear'] = async () => {
    const keys = await client.keys(getCacheKey('*'));
    if (keys.length) {
      await client.del(keys);
    }
  };

  return { set, get, has, del, clear };
};

export interface CacheClientOptions {
  namespace?: string
}

export const createCacheClient = async (options?: CacheClientOptions) => {
  let cacheClient: CacheClient | null = null;
  try {
    cacheClient = await getRedisClient(options);
    console.info('[cache]', 'Redis store readied.');
  } catch (error) {
    // cacheClient = getLRUClient();
    console.info('[cache]', 'LRU store readied.');
  }
  await cacheClient?.clear();
  return cacheClient;
};


export const createCacheClientMap = () => {
  return new Map();
};