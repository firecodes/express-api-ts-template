
export const TUNNEL_PREFIX = '/_tunnel';
export const PROXY_PREFIX = '/_proxy';
export const PROXY_ALLOWLIST_REGEXP = /^https:\/\/([a-z0-9-]+\.)*XXX\.(me|cn)/;

export const getServerPort = () => Number(process.env.PORT || 3000);
export const getOnlineApiURL = () => { return process.env.VITE_API_ONLINE_URL || 'myblog'; };
export const getLocalApiURL = () => { return process.env.VITE_API_LOCAL_URL || 'myblog'; };
export const getStaticURL = () => { return process.env.VITE_STATIC_URL || ''; };

export const getGaScriptURL = (measurementId: string) => {
  return `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
};