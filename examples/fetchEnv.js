const { load, env } = require('../build');

(async () => {
  await load({
    stage: 'dev'
  });

  console.log(env('backoffice___API_TOKEN_SALT'));
  console.log(env('backoffice___DB_NAME'));

  console.log(process.env);

})();