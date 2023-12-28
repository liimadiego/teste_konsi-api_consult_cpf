import { createMessageChannel } from '../messages/messageChannel'
import { config } from 'dotenv';
import cpfs from '../cpfs.json';

config();

export async function populateQueue(){
    try {
        const message_channel = await createMessageChannel();
        const qty_cpfs: number = parseInt(process.env.QTY_CPFS);
        for(let i = 0; i < qty_cpfs; i++){
            let randomNum = Math.floor(Math.random() * cpfs.length);
            message_channel.sendToQueue(process.env.QUEUE_NAME, Buffer.from(cpfs[randomNum]));
        }
        return true;
    } catch (error) {
        console.log('Err: ', error);
        return false;
    }

};

(async () => {
    const populate_queue: boolean = await populateQueue();
    console.log(populate_queue ? 'CPFs inseridos na Fila' : 'Algo deu errado!');
})();