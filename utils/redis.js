const { createClient } = require('redis');

// 创建全局的Redis客户端实例
let client;

/**
 * 初始化 Redis 客户端
 */
const redisClient = async () => {
    if (client) return; //如果客户端已经初始化，则不再重复初始化

    client = await createClient()
        .on('error', error =>  console.log(`Redis连接失败`, error))
        .connect();
};

/**
 * 存入数组或对象，并可选地设置过期时间
 *
 */
const setKey = async (key, value, ttl=null) => {
    if (!client) await redisClient(); // 确保客户端已经初始化，则不再重复初始化
    value = JSON.stringify(value); // 将对象转化为JSON字符串
    await client.set(key, value);

    // 如果提供了ttl，则设置过期时间
    if (ttl !== null) {
        await client.expire(key, ttl);
    }
};

/**
 * 读取数组或对象
 */
const getKey = async (key) => {
    if (!client) await redisClient(); // 确保客户端已初始化
    const value = await client.get(key); // 将接受的JSON字符串转化为对象
    return value ? JSON.parse(value) : null;
}

// 清除缓存数据
const delKey = async (key) => {
    if (!client) await redisClient();// 确保客户端已初始化
    await client.del(key);
};

/**
 * 获取匹配模式的所有键名
 */
const getKeysByPattern = async (pattern) => {
    if (!client) await redisClient();
    return await client.keys(pattern);
}

/**
 * 清除所有缓存
 */
const flushAll = async ( ) => {
    if (!client) await redisClient();
    await client.flushAll();
}

module.exports = {redisClient, setKey, getKey, delKey, getKeysByPattern, flushAll};