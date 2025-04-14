const buildQuery = (params) => new URLSearchParams(params).toString();

const buildHeaders = (headers, token) => ({
  ...(token && { Authorization: `Bearer ${token}` }),
  'Content-Type': headers?.['Content-Type'] || 'application/json',
  ...headers,
});

const handleResponse = async (response) => {
  try {
    const stringResponse = await response.text();
    try {
      return JSON.parse(stringResponse);
    } catch {
      console.log('response was not json');
      return stringResponse;
    }
  } catch (e) {
    console.error(e);
    return { status: 500, message: 'unable to parse response\n' + e };
  }
};

const request = async ({ method, data, params, endpoint, token, headers }) => {
  const query = params ? `?${buildQuery(params)}` : '';
  const target = `${endpoint}${query}`;
  const jsonStringify = !headers?.['Content-Type'] || headers['Content-Type'] === 'application/json';

  const response = await fetch(target, {
    method,
    headers: buildHeaders(headers, token),
    body: ['GET', 'DELETE'].includes(method) ? undefined : (jsonStringify ? JSON.stringify(data) : data),
  });

  return await handleResponse(response);
};

export const get = (options) => request({ ...options, method: 'GET' });
export const post = (options) => request({ ...options, method: 'POST' });
export const put = (options) => request({ ...options, method: 'PUT' });
export const patch = (options) => request({ ...options, method: 'PATCH' });
export const del = (options) => request({ ...options, method: 'DELETE' });
export const postNoAuth = ({ data, endpoint, headers }) =>
  request({ method: 'POST', data, endpoint, headers });
