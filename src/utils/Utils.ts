export const Utils = {
  parseRequestURL: () => {
    const url = location.hash.slice(1).toLowerCase() || '/';
    const request = url.split('/')[1];
    return request;
  }
};
