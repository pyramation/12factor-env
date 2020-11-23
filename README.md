# 12factor

Secrets meant for usage with docker-based applications.

Uses envalid under the hood, but considers secrets for true integration of 12factor apps.

# default secret path

defaults to `/run/secrets/<secret_name>`

You must set `process.env.ENV_SECRETS_PATH` to change this, for example, 

```js
process.env.ENV_SECRETS_PATH='/var/run/your/secrets/folder/';
```

or

```sh
ENV_SECRETS_PATH='/var/run/your/secrets/folder/' node yourapp.js
```

# Recommended Usage

Using `_FILE` convention, include `SECRET_NAME_FILE` as a config var

```js
const myEnv = env(
  process.env
  {
    // put all secrets here
    SECRET_NAME: str()
  },
  {
    // all config vars here
    PORT: port({ default: 10101 })
  }
);
```

If you haven't specified the value, you can enter it inside of a `secret()` call


```js
const myEnv = env(
  process.env
  {
    // put all secrets here
    SECRET_NAME: secret('secret.txt') // will look in /run/secrets/secret.txt
  },
  {
    // all config vars here
    PORT: port({ default: 10101 })
  }
);
```

# Examples

## basic usage with envalid

if you use the `_FILE` standard:

```js
  const myEnv = cleanEnv(
  process.env,
  {
    PORT: port({ default: 10101 }),
    GITHUB_TOKEN: secret(process.env.GITHUB_TOKEN_FILE)
  });
```

or you can specify the name of the secret file as it is stored

```js
  const myEnv = cleanEnv(
  process.env,
  {
    PORT: port({ default: 10101 }),
    GITHUB_TOKEN: secret('github_token.txt')
  });
```

Better yet, just ensure that you use the `env` shortcut and it handles it for you

```js
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
```


## env shortcut

Here `env()` expects 2 args, secrets and env vars.

In this example, it will look for `/var/run/secrets/MAILGUN_KEY`, and populate the final env with everything in one object.

```js
  const myEnv = env(
    process.env,
    { MAILGUN_KEY: str() },
    { PORT: port({ default: 10101 }) }
  );
```

## secret field

The `secret` object let's you specify the secret name as it is saved in the `/var/run/secrets` folder.

```js
  const myEnv = env(
    process.env,
    { MAILGUN_KEY: secret('MAILGUN_KEY') },
    { PORT: port({ default: 10101 }) }
  );
```

