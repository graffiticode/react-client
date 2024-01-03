import bent from "bent";
import { GraphQLClient, gql } from 'graphql-request';

const apiUrl = process.env.NEXT_PUBLIC_GC_API_URL || "https://api.graffiticode.com";

const getApiString = bent(apiUrl, "GET", "string");
const getApiJSON = bent(apiUrl, "GET", "json");
const postApiJSON = bent(apiUrl, "POST", "json");

export const getBaseUrlForApi = () => apiUrl;
export const getLanguageAsset = (lang, file) => getApiString(`/${lang}/${file}`);

export const getApiTask = async ({ auth, id }) => {
  try {
    const headers = { "Authorization": auth.token };
    const { status, error, data: task } = await getApiJSON(`/task?id=${id}`, null, headers);
    if (status !== "success") {
      throw new Error(`failed to get task ${id}: ${error.message}`);
    }
    return task;
  } catch (err) {
    throw err;
  }
};

export const postApiCompile = async ({ accessToken, id, data }) => {
  try {
    const headers = {
      authorization: accessToken,
      "x-graffiticode-storage-type": "persistent",
    };
    const post = bent(apiUrl, "POST", "json", headers);
    const body = { id, data };
    const resp = await post('/compile', body);
    if (resp.status !== "success") {
      throw new Error(`failed to post compile ${id}: ${error.message}`);
    }
    return resp.data;
  } catch (err) {
    throw err;
  }
};

export const postCompile = async ({ id, data }) => {
  const query = gql`
    mutation (id: String!, data: String!) {
      compile(id: $id, data: $data)
    }
  `;
  // const token = await user.getToken();
  const client = new GraphQLClient("/api", {
    headers: {
      // authorization: token,
    }
  });
  return client.request(query, { id, daa }).then(data => data.compile);
};

