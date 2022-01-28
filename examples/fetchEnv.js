const { load, env } = require('../build');

(async () => {
  await load({
    stage: 'dev'
  });

  console.log(
    'backoffice___API_TOKEN_SALT: ',
    env('backoffice___API_TOKEN_SALT'),
  );

  console.log(
    'process.env.API_TOKEN_SALT: ',
    process.env['API_TOKEN_SALT'],
  );

  console.log(
    'backoffice___JWT_SECRET: ',
    env('backoffice___JWT_SECRET'),
  );

  console.log(
    'alias.JWT_SECRET: ',
    env('JWT_SECRET'),
  );

  console.log(
    'process.env.JWT_SECRET: ',
    process.env['JWT_SECRET'],
  );


  console.log(
    'backoffice___DB_NAME: ',
    env('backoffice___DB_NAME'),
  );

})();