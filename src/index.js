import {
  cleanEnv,
  makeValidator,
  EnvError,
  EnvMissingError,
  testOnly,
  bool,
  num,
  str,
  json,
  host,
  port,
  url,
  email
} from 'envalid';

import { readFileSync } from 'fs';
import { resolve, join } from 'path';

const ENV_SECRETS_PATH = process.env.ENV_SECRETS_PATH
  ? process.env.ENV_SECRETS_PATH
  : '/run/secrets/';

const secretPath = (name) =>
  name.startsWith('/') ? name : resolve(join(ENV_SECRETS_PATH, name));

const getSecret = (secret) => {
  if (!secret) return;
  try {
    const value = readFileSync(secretPath(secret), 'utf-8');
    return value;
  } catch (e) {
    return;
  }
};

const secretEnv = (env, secretProps) => {
  return Object.keys(secretProps).reduce((m, k) => {
    const secret = getSecret(k);
    if (secret) {
      m[k] = secret;
    } else {
      const secretFileKey = k + '_FILE';
      if (env.hasOwnProperty(secretFileKey)) {
        const secretFileValue = getSecret(env[secretFileKey]);
        if (secretFileValue) {
          m[k] = secretFileValue;
        }
      }
    }
    return m;
  }, {});
};

const secret = (ENV_FILE) => str({ default: getSecret(ENV_FILE) });

const env = (inputEnv, secrets = {}, vars = {}) => {
  const varEnv = cleanEnv(
    inputEnv,
    { ...vars },
    {
      dotEnvPath: null
    }
  );
  const _secrets = secretEnv(varEnv, secrets);
  return cleanEnv(
    { ...varEnv, ..._secrets },
    { ...secrets },
    {
      dotEnvPath: null
    }
  );
};

export {
  env,
  secretEnv,
  secret,
  /* envalid */
  cleanEnv,
  makeValidator,
  EnvError,
  EnvMissingError,
  testOnly,
  bool,
  num,
  str,
  json,
  host,
  port,
  url,
  email
};
