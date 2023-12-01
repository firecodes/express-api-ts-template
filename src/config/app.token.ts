

import yargs from 'yargs';
const argv: any = yargs(process.argv.slice(2)).argv;
// const argv = {
//   github_token: '',
//   instagram_token: '',
//   youtube_token: '',
//   sotwe_scraper_token: '',
// };
export const GITHUB_BEARER_TOKEN = argv.github_token;
export const INSTAGRAM_TOKEN = argv.instagram_token;
export const YOUTUBE_API_KEY = argv.youtube_token;
export const SOTWE_SCRAPER_TOKEN = argv.sotwe_scraper_token;
