# API Consulta CPF

~ git clone https://github.com/liimadiego/teste_konsi-api_consult_cpf.git<br>
~ cd teste_konsi-api_consult_cpf<br>
~ npm install

## Para iniciar o projeto

Criar um arquivo .env e inserir as credencias e URL base da API externa.<br><br>
~ docker compose up -d<br>
(para subir o RabbitMQ, Redis, Elasticsearch e Kibana)<br>
<br>
Para popular a fila do RabbitMQ utilize:<br>
~ npm run start_queue<br>
<br>
Para consumí-la e popular o Redis e o Elasticsearch<br>
~ npm run consume_queue<br>
<br>
Inicie a API<br>
~ npm run start<br>
