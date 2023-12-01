
import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';
import { VALUABLE_LINKS } from '../../config/app.config';

export const getMyGoogleMap = () => {
  const parser = new XMLParser({
    ignoreAttributes: false,
    allowBooleanAttributes: true,
    attributeNamePrefix: '@',
  });

  // return axios
  //   .get<any>(VALUABLE_LINKS.GOOGLE_MY_MAP_KML, { timeout: 6000 })
  //   .then((response) => parser.parse(response.data).kml.Document);
  let response: string | Buffer = '{}';
  return parser.parse(response).kml.Document;
};
