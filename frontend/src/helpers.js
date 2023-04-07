import config from './config.json'
const BACKEND_PORT = config.BACKEND_PORT;

// api call function
export async function apiCall (path, method, body) {
  const options = {
    method,
    headers: {
      'Content-type': 'application/json',
    },
  };
  if (method === 'GET') {
    path += '?';
    for (const key in body) {
      path += key + '=' + body[key] + '&';
    }
    path = path.substring(0, path.length - 1);
  } else if (body) {
    options.body = JSON.stringify(body);
  }
  if (localStorage.getItem('token')) {
    options.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }

  try {
    const response = await fetch(`http://localhost:${BACKEND_PORT}/` + path, options);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Failed to fetch, have you started the backend?');
  }
}
