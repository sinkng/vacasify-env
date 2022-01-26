const { load, env } = require('../build');

(async () => {
  await load({
    stage: 'dev'
  });

  console.log(env('backoffice___BOT_API_USERNAME', 'cook'))

})();