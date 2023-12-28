import { config } from 'dotenv';
import axios from 'axios';
import { createClient } from 'redis';
import { connectMessageChannel } from '../messages/messageChannel';
import { getClient, insertIntoElasticSearch } from './elasticsearch';

config();

const getBenefitByCPF = async (cpf: string): Promise<object> => {
    try {
        const redis_client = createClient();
        redis_client.on('error', err => console.log('Redis Client Error', err));
        
        await redis_client.connect();
    
        const data_from_redis = await redis_client.get(cpf);

        if(!!data_from_redis){
          await insertIntoElasticSearch(JSON.parse(data_from_redis));
          return JSON.parse(data_from_redis);
        }

        //registro não encontrado no Redis
    
        const token = await getToken();

        const result = await axios.get(`${process.env.URL_BASE_API}/api/v1/inss/consulta-beneficios?cpf=${cpf}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        await redis_client.set(cpf, JSON.stringify({cpf, data: result.data.data.beneficios}));

        await insertIntoElasticSearch(JSON.parse(await redis_client.get(cpf)));
        return JSON.parse(await redis_client.get(cpf));
        

    } catch (error) {
      console.error('Erro:', error);
      throw error;
    }
};

const getToken = async (): Promise<string> => {
    try {
      const token_result = await axios.post(`${process.env.URL_BASE_API}/api/v1/token`, {
        username: process.env.USER_API,
        password: process.env.PASSWORD_API,
      });
    
      return token_result.data.data.token;
    } catch (error) {
      console.error('Erro ao obter o token:', error);
      throw error;
    }
};

(async() => {
  console.log('Script iniciado')
  const elastic_search_client = await getClient();
  let index_exists = await elastic_search_client.indices.exists({ index: 'consult_cpf' });
  if(!index_exists){
    await elastic_search_client.index({
      index: 'consult_cpf',
      type: 'type_consult_cpf',
      body: {}
    });
    console.log('index criado')
  }
  const message_channel = await connectMessageChannel();

  await message_channel.consume(
      process.env.QUEUE_NAME,
      async (message) => {
        if (message) {
          console.log(`Consumindo CPF ${message.content.toString()}`)
          await getBenefitByCPF(message.content.toString());
        }
      },
      { noAck: true }
  );
  

})();