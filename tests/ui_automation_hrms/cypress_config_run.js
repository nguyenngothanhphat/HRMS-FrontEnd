const cypress = require('cypress');

cypress
  .run({
    reporter: 'junit',
    browser: 'chrome',
    config: {
      baseUrl: 'https://stghrms.paxanimi.ai',
      watchForFileChanges: true,
      defaultCommandTimeout: 10000,
      viewportWidth: 1280,
      viewportHeight: 1024,
      chromeWebSecurity: false,
    },
    env: {
      owner_email: 'comp1-superad@mailinator.com',
      hrManager_email: 'comp1-hr-manager@mailinator.com',
      hr_email: 'comp1-employee-hre1@mailinator.com',
      employee_email: 'huu.nguyen@mailinator.com',
      manager_email: 'comp1-manager@mailinator.com',
      password: '12345678@Tc',
      fromDate: '09.29.21',
      toDate: '09.30.21',
    },
  })
  .then((result) => {
    if (result.failures) {
      console.error('Could not execute tests');
      console.error(result.message);
      process.exit(result.failures);
    }

    // print test results and exit
    // with the number of failed tests as exit code
    process.exit(result.totalFailed);
  })
  .catch((err) => {
    console.error(err.message);
    process.exit(1);
  });
