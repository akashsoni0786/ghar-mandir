import { environment } from '../environment/environment';
import { prepareHeaders } from './Helper';
import { setSessionStorage } from './storage';

const message = `Sorry, the request was unsuccessful. Please try again later.`;

/**
 * Makes a GET request to the specified endpoint with the provided parameters.
 * @param {string} endpoint - The endpoint to make the GET request to
 * @param {Object} [params={}] - The parameters to include in the request
 * @param {boolean} [fullUrl=false] - Whether the endpoint is a full URL
 * @returns {Promise<object>} The response from the GET request
 */
const GET = (store) => async (endpoint, params = {}, fullUrl = false) => {
  let url = environment.API_ENDPOINT + endpoint;
  if (fullUrl) {
    url = endpoint;
  }
  
  let paramsString = endpoint.includes('?') ? '&' : '?';
  const paramEntries = Object.entries(params);
  
  paramEntries.forEach(([key, value], index) => {
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      paramsString += `${key}=${encodeURIComponent(value)}`;
    }
    if (index < paramEntries.length - 1) paramsString += '&';
  });

  try {
    const res = await fetch(url + paramsString, {
      method: 'GET',
      headers: prepareHeaders(store),
    });
    const data = await res.json();
    
    if (data?.code === 'token_expired') {
      setSessionStorage('token_expired', 'token_expired');
      window.location.href = `${window.location.origin}/token-expire`;
    }
    
    return data;
  } catch (error) {
    return {
      success: false,
      message,
      code: error,
    };
  }
};

/**
 * Makes a POST request to the specified endpoint with the provided body.
 * @param {string} endpoint - The endpoint to make the POST request to
 * @param {Object} body - The body of the POST request
 * @param {boolean} [fullUrl=false] - Whether the endpoint is a full URL
 * @returns {Promise<object>} The response from the POST request
 */

const POST = (store) => async (endpoint, body,login=false, fullUrl = false) => {
  const url = fullUrl ? endpoint : environment.API_ENDPOINT + endpoint;
  
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        ...prepareHeaders(
          store
        ),
        
        'Content-Type': 'application/json',
        ...(login?{"x-api-client":environment.auth_x_key}:{})
      },
      body: JSON.stringify(body),
      
    });
    
    const data = await res.json();
    
    if (data?.code === 'token_expired') {
      setSessionStorage('token_expired', 'token_expired');
      window.location.href = `${window.location.origin}/token-expire`;
    }
    
    return data;
  } catch (error) {
    return {
      success: false,
      message,
      code: error,
    };
  }
};

/**
 * Makes a PUT request to the specified endpoint with the provided body.
 * @param {string} endpoint - The endpoint to make the PUT request to
 * @param {Object} body - The body of the PUT request
 * @param {boolean} [fullUrl=false] - Whether the endpoint is a full URL
 * @returns {Promise<object>} The response from the PUT request
 */
const PUT = (store) => async (endpoint, body, fullUrl = false) => {
  const url = fullUrl ? endpoint : environment.API_ENDPOINT + endpoint;
  
  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: prepareHeaders(store),
      body: JSON.stringify(body),
    });
    
    const data = await res.json();
    
    if (data?.code === 'token_expired') {
      setSessionStorage('token_expired', 'token_expired');
      window.location.href = `${window.location.origin}/token-expire`;
    }
    
    return data;
  } catch (error) {
    return {
      success: false,
      message,
      code: error,
    };
  }
};

/**
 * Makes a PATCH request to the specified endpoint with the provided body.
 * @param {string} endpoint - The endpoint to make the PATCH request to
 * @param {Object} body - The body of the PATCH request
 * @param {boolean} [fullUrl=false] - Whether the endpoint is a full URL
 * @returns {Promise<object>} The response from the PATCH request
 */
const PATCH = (store) => async (endpoint, body, fullUrl = false) => {
  const url = fullUrl ? endpoint : environment.API_ENDPOINT + endpoint;
  
  try {
    const res = await fetch(url, {
      method: 'PATCH',
      headers: prepareHeaders(store),
      body: JSON.stringify(body),
    });
    
    const data = await res.json();
    
    if (data?.code === 'token_expired') {
      setSessionStorage('token_expired', 'token_expired');
      window.location.href = `${window.location.origin}/token-expire`;
    }
    
    return data;
  } catch (error) {
    return {
      success: false,
      message,
      code: error,
    };
  }
};

/**
 * Makes a DELETE request to the specified endpoint.
 * @param {string} endpoint - The endpoint to make the DELETE request to
 * @param {Object} [body] - Optional body for the DELETE request
 * @param {boolean} [fullUrl=false] - Whether the endpoint is a full URL
 * @returns {Promise<object>} The response from the DELETE request
 */
const DELETE = (store) => async (endpoint, body, fullUrl = false) => {
  const url = fullUrl ? endpoint : environment.API_ENDPOINT + endpoint;
  
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: prepareHeaders(store),
      body: body ? JSON.stringify(body) : undefined,
    });
    
    const data = await res.json();
    
    if (data?.code === 'token_expired') {
      setSessionStorage('token_expired', 'token_expired');
      window.location.href = `${window.location.origin}/token-expire`;
    }
    
    return data;
  } catch (error) {
    return {
      success: false,
      message,
      code: error,
    };
  }
};

export const request = {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE,
};