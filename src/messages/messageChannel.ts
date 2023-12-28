import { config } from 'dotenv';
import { Channel, connect } from 'amqplib';

export const createMessageChannel = async (): Promise<Channel> => {
    config();

    try {
        const connection = await connect(process.env.AMQP_SERVER);
        const channel = await connection.createChannel();
        await channel.assertQueue(process.env.QUEUE_NAME);
        console.log('Conectado ao RabbitMQ');

        return channel;
    } catch (err) {
        console.log('error', err);
        return null;
    }
} 

export const connectMessageChannel = async ():Promise<Channel> => {
    const connection = await connect(process.env.AMQP_SERVER);
    const channel = await connection.createChannel();

    process.once("SIGINT", async () => {
        await channel.close();
        await connection.close();
    });

    await channel.assertQueue(process.env.QUEUE_NAME);
    return channel;
}