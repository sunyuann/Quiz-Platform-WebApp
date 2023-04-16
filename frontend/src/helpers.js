import config from './config.json'
export const BACKEND_PORT = config.BACKEND_PORT;

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
    if (!response.ok && !data.error) {
      response.error = `${method} ${response.status}(${response.statusText}): ${response.url}`;
      return response;
    }
    return data;
  } catch (error) {
    console.log('Failed to fetch, have you started the backend?');
  }
}

// Image file to base64
export async function fileToDataUrl (file) {
  const validFileTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  const valid = validFileTypes.find((type) => type === file.type);
  // Bad data, let's walk away.
  if (!valid) {
    throw new Error('provided file is not a png, jpg or jpeg image.');
  }

  const reader = new FileReader();

  const dataUrlPromise = new Promise((resolve, reject) => {
    reader.onerror = reject;
    reader.onload = () => resolve(reader.result);
  });

  reader.readAsDataURL(file);
  const dataUrl = await dataUrlPromise;
  return dataUrl;
}
