import { createClient } from "redis";

const client = createClient()

client.on("error", (err) => {
    console.log(`Cannot connect ${err}`)
})

const redisConnect = async () => {
    await client.connect()
}
redisConnect()

export { client }