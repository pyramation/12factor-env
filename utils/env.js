import { resolve, join } from 'path';
process.env.ENV_SECRETS_PATH = resolve(
  join(__dirname, '/../__fixtures__/secrets')
);
