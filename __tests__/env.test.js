import '../utils/env';
import { resolve, join } from 'path';
import { env, secret, secretEnv, cleanEnv, port, str } from '../src';
const SECRETS_PATH = resolve(join(__dirname, '/../__fixtures__/secrets'));

process.env.GITHUB_TOKEN_FILE = join(SECRETS_PATH, 'GITHUB_TOKEN');

const processEnv = {};
it('defaults', () => {
  const myEnv = cleanEnv(processEnv, {
    PORT: port({ default: 10101 })
  });
  expect(myEnv).toEqual({ PORT: 10101 });
});

it('use env first', () => {
  const myEnv = cleanEnv(
    {
      PORT: 9000
    },
    {
      PORT: port({ default: 10101 })
    }
  );
  expect(myEnv).toEqual({ PORT: 9000 });
});

it('secretEnv', () => {
  const myEnv = secretEnv({}, { NPM_TOKEN: str() });
  expect(myEnv).toEqual({ NPM_TOKEN: 'hereismysecret' });
});

it('env', () => {
  // this option uses the KEY to look and see if the secret exists with that name
  const myEnv = env(
    processEnv,
    { NPM_TOKEN: str() },
    { PORT: port({ default: 10101 }) }
  );
  const { NPM_TOKEN, PORT } = myEnv;

  expect(NPM_TOKEN).toEqual('hereismysecret');
  expect(PORT).toEqual(10101);
});

it('env 2', () => {
  //  in this case
  // * MAILGUN_KEY doesn't exist, but we specify a secret type, so the default is used which
  // we've already mapped to the secret name
  const myEnv = env(
    processEnv,
    { MAILGUN_KEY: secret('GITHUB_TOKEN') },
    { PORT: port({ default: 10101 }) }
  );
  const { MAILGUN_KEY, PORT } = myEnv;

  expect(MAILGUN_KEY).toEqual('herewego!');
  expect(PORT).toEqual(10101);
});

it('file env using only envalid', () => {
  const myEnv = cleanEnv(processEnv, {
    PORT: port({ default: 10101 }),
    GITHUB_TOKEN: secret(process.env.GITHUB_TOKEN_FILE)
  });
  expect(myEnv).toEqual({
    GITHUB_TOKEN: 'herewego!',
    PORT: 10101
  });
});

it('secret file', () => {
  const myEnv = cleanEnv(processEnv, {
    PORT: port({ default: 10101 }),
    GITHUB_TOKEN: secret('github_token.txt')
  });
  expect(myEnv).toEqual({
    GITHUB_TOKEN: 'herewego!',
    PORT: 10101
  });
});

it('secret file DNE', () => {
  const myEnv = env(
    {
      GITHUB_TOKEN_FILE: process.env.GITHUB_TOKEN_FILE
    },
    {
      GITHUB_TOKEN: str()
    },
    {
      PORT: port({ default: 10101 })
    }
  );

  const { GITHUB_TOKEN, PORT } = myEnv;

  expect(GITHUB_TOKEN).toEqual('herewego!');
  expect(PORT).toEqual(10101);
});
