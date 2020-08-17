
/*
  var params = {Bucket: 'bucket', Key: 'key'};
  const url = s3.getSignedUrl('putObject', params);
*/

import md5 from 'js-md5';
import { fetch } from './api';

let kabob = (str) => {
  return str.toLowerCase()
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-');
};

const getHashCodeAsync = async (blob) => {
  return new Promise((resolve) => {
    const blobreader = new FileReader();
    blobreader.onloadend = () => {
      const hashCode = md5(blobreader.result);
      resolve(hashCode);
    }
    blobreader.readAsArrayBuffer(blob);
  });
};

/**
 * 
 * @param {string} room_code 
 * @param {string} title 
 * @param {HTMLCanvasElement} canvas 
 */
export const upload = async (room_code, title, blob) => {
   const hashCode = (await getHashCodeAsync(blob)).substring(0, 8);

  // get signed url for key
  const key = `${room_code}/${kabob(title)}-${hashCode}.png`;
  
  // url: https://netstrations.s3.amazon.com/{room_code}/{title}-{hash}.png
  const res = await fetch('/api/signedUrl', { params: { key }});
  const { url, putUrl } = await res.json();

  // const data = new FormData();
  // data.append('file', blob);

  await fetch(putUrl, {
    method: 'PUT',
    body: blob,
    headers: { 'content-type': 'image/png' }
  });

  return url;
};
