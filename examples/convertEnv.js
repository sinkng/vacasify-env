const { init, env } = require('../build');

(async () => {
  init({
    // 'TEST1': 'false',
    // 'TEST2': true,
    // 'TEST3': 'a123',
    // 'TEST4': '0',
    // 'TEST5': '1',
    // 'TEST6': 1,
    'TEST7': 0,
    'TEST8': false,
  });

  // console.log(env.bool('TEST1'))
  // console.log(env.bool('TEST2'))
  // console.log(env.bool('TEST3'))
  // console.log(env.bool('TEST4'))
  // console.log(env.bool('TEST5'))
  // console.log(env.bool('TEST6'))
  console.log(env.bool('TEST7'))
  console.log(env.bool('TEST8'))

})();