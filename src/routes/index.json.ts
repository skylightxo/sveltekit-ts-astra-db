import { createClient } from "@astrajs/collections";
import type { Developer } from '../types/data.type'

const db = async () => {
  const astraClient = await createClient({
    astraDatabaseId: process.env["ASTRA_DB_ID"],
    astraDatabaseRegion: process.env["ASTRA_DB_REGION"],
    applicationToken: process.env["ASTRA_DB_APPLICATION_TOKEN"],
    baseUrl: `api/rest/v2/namespaces/${process.env["ASTRA_DB_NAMESPACE"]}/collections/${process.env["ASTRA_DB_COLLECTION"]}`
  });
  const collection = astraClient
    .namespace(process.env["ASTRA_DB_NAMESPACE"])
    .collection(process.env["ASTRA_DB_COLLECTION"]);

  return collection;
};

export async function get(req: any, res: Response): Promise<{ status: number, body: Developer[] }> {
  const client = await db();
  const keyword = req.query.get("keyword");

  let developers: Developer[] = [];
  if (keyword) {
    developers = await client.find({ name: { $eq: keyword } });
  } else {
    developers = await client.find({});
  }

  return {
    status: 200,
    body: Object.keys(developers).map((key) => {
      return {
        id: key,
        ...developers[key],
      };
    }),
  };
}

export async function post(req: any, res: Response): Promise<{ status: number, body: Developer }> {
  const client = await db();
  const data = req.body;

  const response = await client.create(data);

  return {
    status: 201,
    body: { id: response.documentId, ...data },
  };
}

export async function del(req: any, res: Response): Promise<{ status: number }> {
  const client = await db();
  const id = req.query.get("id");

  await client.delete(id);

  return {
    status: 204,
  };
}
