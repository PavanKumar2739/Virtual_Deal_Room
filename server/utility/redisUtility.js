const client = require('../controller/redisClient');

async function redisFetchMessages(senderId, receiverId) {
    const redisKey = `messages:${senderId}:${receiverId}`;
    const cached = await client.lrange(redisKey,0,-1);
    if (cached.length > 0) {
        return cached.reverse().map(msg => JSON.parse(msg));
    }

}

async function redisSetAllMessages(senderId,receiverId, messages){
    for(const message of messages){
        await redisSetMessage(senderId,receiverId, message)
    }
}

async function redisSetMessage(senderId,receiverId, message){
    const redisKey = `messages:${senderId}:${receiverId}`
    await client.lpush(`messages:${senderId}:${receiverId}`, JSON.stringify(message));
    await client.expire(redisKey,3600)
}

async function redisUpdateIsRead(){
    //its in hold
}

module.exports = {redisFetchMessages,redisSetAllMessages,redisSetMessage}