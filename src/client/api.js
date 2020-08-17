import { ServiceEndpoint } from './stack.json';

export const fetch = async (url, options) => {
  const _base = ServiceEndpoint.endsWith('/') ? ServiceEndpoint : ServiceEndpoint + '/';
  const _url = url.replace(/^\//, '');
  const uri = new URL(_url, _base);
  const { params, ...otherOptions } = options;
  if (params) {
    Object.entries(params).forEach(([k,v]) => {
      uri.searchParams.set(k, v);
    });
  }
  return global.fetch(uri, otherOptions);
};

export const getRoomInfo = async (room_code) => {
  try {
    const res = await fetch('/api/roomInfo', {
      params: { room_code }
    });
    const roomInfo = await res.json();
    console.log('[API] room info:', roomInfo);
    return roomInfo;

  } catch (e) {
    console.log(`[API Failure] Unable to create a room`);
    console.log(e);
    return null;
  }
};

export const createRoom = async () => {
  try {
    const res = await fetch('/api/games', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        origin: window.location.href
      },
      body: JSON.stringify({})
    });
    return await res.json();

  } catch (e) {
    console.log(`[API Failure] Unable to create a room`);
    console.log(e);
    return null;
  }
};

