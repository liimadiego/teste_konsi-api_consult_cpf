import elasticsearch from 'elasticsearch';

interface BeneficiaryData {
  cpf: string;
  data: Array<{
    numero_beneficio: string;
    codigo_tipo_beneficio: string;
  }>;
}

async function getClient(): Promise<elasticsearch.Client> {
  const client = new elasticsearch.Client({
    host: 'localhost:9200'
  });

  return client;
}

export async function insertIntoElasticSearch(data: BeneficiaryData): Promise<void> {
  const elastic_search_client = await getClient();

  const cpf_exists = await findByCPF(data.cpf);

  if (!cpf_exists) {
    await elastic_search_client.index({
      index: 'consult_cpf',
      type: 'type_consult_cpf',
      body: data
    });
  }
}

export async function findByCPF(cpf: string): Promise<BeneficiaryData | false | unknown> {
  const elastic_search_client = await getClient();

  const result = await elastic_search_client.search({
    index: 'consult_cpf',
    size: 1,
    body: {
      query: {
        "match_phrase": {
          "cpf": cpf
        }
      }
    }
  });

  return !!result.hits.hits[0] ? result.hits.hits[0]._source : false;
}
