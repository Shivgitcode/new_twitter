import { createClient } from "redis";

const client = createClient({
    url: process.env.REDIS_URL
})

client.on("error", (err) => {
    console.log(`Cannot connect ${err}`)
})

const redisConnect = async () => {
    await client.connect()
}
redisConnect()

export { client }