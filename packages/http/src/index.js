const buildUrlWithParams = (url, data) => {
  const u = new URL(url);
  if (data) {
    url.search = data instanceof URLSearchParams || typeof data === 'string' ? data : '';
  }
  return u;
};

/**
 * @typedef {Omit<RequestInit, 'method'>} RequestConfig
 *
 * @typedef {Omit<RequestInit, 'body' | 'method'>} BodylessRequestConfig
 */

/**
 * An object with an API to perform HTTP requests of various supported HTTP methods
 */
const HttpClient = {
  /**
   * Create a GET request
   *
   * @param {URL | string} url The URL of the resource to fetch
   * @param {URLSearchParams | string} [data] Optional URL param data to append to {@link url}
   * @param {BodylessRequestConfig} [options] Configuration options for the request
   * @returns {Promise<Response>} A Promise-wrapped Response
   */
  get(url, data = null, options = {}) {
    const u = buildUrlWithParams(url, data);
    return fetch(u, {
      ...options,
      method: 'GET',
    });
  },
  /**
   * Create a HEAD request
   *
   * @param {URL | string} url The URL of the resource to fetch
   * @param {URLSearchParams | string} [data] Optional URL param data to append to {@link url}
   * @param {BodylessRequestConfig} [options] Configuration options for the request
   * @returns {Promise<Response>} A Promise-wrapped Response
   */
  head(url, data = null, options = {}) {
    const u = buildUrlWithParams(url, data);
    return fetch(u, {
      ...options,
      method: 'HEAD',
    });
  },
  /**
   * Create an OPTIONS request
   *
   * @param {URL | string} url The URL of the resource to fetch
   * @param {URLSearchParams | string} [data] Optional URL param data to append to {@link url}
   * @param {BodylessRequestConfig} [options] Configuration options for the request
   * @returns {Promise<Response>} A Promise-wrapped Response
   */
  options(url, data = null, options = {}) {
    const u = buildUrlWithParams(url, data);
    return fetch(u, {
      ...options,
      method: 'OPTIONS',
    });
  },
  /**
   * Create a POST request
   *
   * @param {URL | string} url The URL of the resource to fetch
   * @param {Blob | ArrayBuffer | TypedArray | DataView | FormData | URLSearchParams | String | string | ReadableStream} body Request body data
   * @param {RequestConfig} [options] Configuration options for the request
   * @returns {Promise<Response>} A Promise-wrapped Response
   */
  post(url, data = null, options = {}) {
    return fetch(url, {
      ...options,
      method: 'POST',
      body: data,
    });
  },
  /**
   * Create a PUT request
   *
   * @param {URL | string} url The URL of the resource to fetch
   * @param {Blob | ArrayBuffer | TypedArray | DataView | FormData | URLSearchParams | String | string | ReadableStream} body Request body data
   * @param {RequestConfig} [options] Configuration options for the request
   * @returns {Promise<Response>} A Promise-wrapped Response
   */
  put(url, data = null, options = {}) {
    return fetch(url, {
      ...options,
      method: 'PUT',
      body: data,
    });
  },
  /**
   * Create a PATCH request
   *
   * @param {URL | string} url The URL of the resource to fetch
   * @param {Blob | ArrayBuffer | TypedArray | DataView | FormData | URLSearchParams | String | string | ReadableStream} body Request body data
   * @param {RequestConfig} [options] Configuration options for the request
   * @returns {Promise<Response>} A Promise-wrapped Response
   */
  patch(url, data = null, options = {}) {
    return fetch(url, {
      ...options,
      method: 'PATCH',
      body: data,
    });
  },
  /**
   * Create a DELETE request
   *
   * @param {URL | string} url The URL of the resource to fetch
   * @param {Blob | ArrayBuffer | TypedArray | DataView | FormData | URLSearchParams | String | string | ReadableStream} body Request body data
   * @param {RequestConfig} [options] Configuration options for the request
   * @returns {Promise<Response>} A Promise-wrapped Response
   */
  delete(url, data = null, options = {}) {
    return fetch(url, {
      ...options,
      method: 'DELETE',
      body: data,
    });
  },
};

export { HttpClient as Http };
