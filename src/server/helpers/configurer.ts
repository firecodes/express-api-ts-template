
import { isNodeDev } from '../../server/environment';
import { getLocalApiURL, getOnlineApiURL } from '../../config';

import path from 'path';
export const ROOT_PATH = process.cwd();
export const DIST_PATH = path.join(ROOT_PATH, 'dist');
export const PRDO_CLIENT_PATH = path.join(DIST_PATH, 'client');
export const PRDO_SERVER_PATH = path.join(DIST_PATH, 'server');

export const PUBLIC_PATH = path.join(ROOT_PATH, 'public');


export const getNodePressAPI = () => {
  const local = getLocalApiURL();
  const online = getOnlineApiURL();
  return isNodeDev ? local : online;
};