# API Consulta CPF

~ git clone https://github.com/liimadiego/teste_konsi-api_consult_cpf.git<br>
~ npm install

## Para iniciar o projeto

Criar um arquivo .env e inserir as credencias e URL base da API externa.
~ docker compose up (para subir o RabbitMQ, Redis, Elasticsearch e Kibana)

Para popular a fila do RabbitMQ utilize:
~ npm run start_queue

Para consumí-la e popular o Redis e o Elasticsearch
~ npm run consume_queue

Inicie a API
~ npm run start
