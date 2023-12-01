
import axios from 'axios';
import { IDENTITIES } from '../../config/app.config';
import { getGaScriptURL } from '../../config';

export const getGTagScript = async () => {
  const url = getGaScriptURL(IDENTITIES.GOOGLE_ANALYTICS_MEASUREMENT_ID);
  const response = await axios.get<string>(url, { timeout: 6000 });
  return response.data;
};
