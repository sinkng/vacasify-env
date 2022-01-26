const { init, env } = require('../build');

(async () => {
  await init({
    stage: 'dev'
  });

  console.log(env('backoffice___BOT_API_USERNAME', 'cook'))

})();