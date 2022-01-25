const DescribeFailureReporter = require('protractor-stop-describe-on-failure');

exports.config = {

 seleniumAddress: 'http://localhost:8080/wd/hub',
  
 //directConnect: true,
 //For Launching Test in Chrome Browser
  capabilities: {
    'browserName': 'chrome',
    'shardTestFiles': true,
    'maxInstances': 1,
    'chromeOptions': {
      args: ["--disable-gpu"],
      
    }
   },
  // Config for Edge browser
  // capabilities: {
    
      
  //     'browserName': 'MicrosoftEdge',

  // // //     'version':'91',
  //     'platform': 'Windows',
  // // //     //'record_network': true,
  // // //    // 'shardTestFiles': true,
  // // //    // 'maxInstances': 1,
  // // //     //'record_video' : true,         
  //   },
  
// //For Launching Test Parallel - in Chrome Browser,Edge,Firefox


  multicapabilities: [
      
      {'browsername': 'chrome',
     'shardtestfiles': true,
     'maxinstances': 2,
     'chromeoptions': {
      'args': ['--disable-gpu']
     },
    },
  //config for edge browser
   {
         
      'browsername': 'microsoftedge',
        'platform': 'windows',
        'shardtestfiles': true,
     'maxinstances': 2,
}
  ],
    capabilities:{
      'browsername': 'firefox',
   'shardtestfiles': true,
  'maxinstances': 2,
    'moz:firefoxoptions': {
      'args': ['--safe-mode']
    },
  },
  

  

  beforeLaunch: function () {
    var rimraf = require("rimraf");
    try {
      rimraf(`${__dirname}\\temp`, async function () {
        console.log("Removing temp Folder");
        return true
      });
    } catch (error) {
      console.log("Error Removing temp Folder" + error);
    }
  },


  

  onPrepare: function () {
    restartBrowserBetweenTests: true;
    SELENIUM_PROMISE_MANAGER: false;
    browser.waitForAngularEnabled(false);
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    jasmine.getEnv().addReporter(DescribeFailureReporter(jasmine.getEnv()));

    let NewDBConnect = require("./Utils/NewDBConnect.js");
    global.dbConnect = new NewDBConnect();

   



    /*********************************************************
    * ALLURE HTML Reporter
    **********************************************************/

    var AllureReporter = require('jasmine-allure-reporter');
    jasmine.getEnv().addReporter(new AllureReporter({
      resultsDir: 'allure-results'
    }))

    jasmine.getEnv().afterEach(function (done) {
      browser.takeScreenshot().then(function (png) {
        allure.createAttachment('Screenshot', function () {
          return new Buffer(png, 'base64')
        }, 'image/png')();
        done();
      })
    });



    /*********************************************************
    * HTML Reporter
    **********************************************************/

    var Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter');
    jasmine.getEnv().addReporter(new Jasmine2HtmlReporter({
      //cleanDestination: true,
      savePath: './Log/Html/'
    }))

    /*********************************************************
    * Spec Reporter For Command Log
    **********************************************************/

    let SpecReporter = require('jasmine-spec-reporter').SpecReporter;
    jasmine.getEnv().addReporter(new SpecReporter({

      spec: {
        displayStacktrace: 'all',      // Display stacktrace for each failed assertion, values: (all|specs|summary|none)
        displayPending: 'true',
        displaySuccessful: 'true'
      }
    }));

    /**************************************
        **** Junit Reporter
    *************************************/

    var jasmineReporters = require('jasmine-reporters');
    var junitReporter = new jasmineReporters.JUnitXmlReporter({
      // setup the output path for the junit reports
      savePath: './Log/junit/',
      consolidateAll: false,

    });

    jasmine.getEnv().addReporter(junitReporter);

    //=========Log4J Configuration==================
    // logger.trace();logger.debug();logger.info();logger.warn();logger.error();logger.fatal();
    //============================================

    log4js = require('log4js');
    log4js.configure({
      appenders: { Homesite: { type: 'file', filename: './Log/Logger/executionLog.log' } },
      categories: { default: { appenders: ['Homesite'], level: 'ALL' } }
    });

    logger = log4js.getLogger('Homesite');
    //========= End Of Log4J Configuration =======================================================

    let path = require('path');
    var jasmineReporters = require('jasmine-reporters');
    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
      savePath: path.join(process.cwd(), './Log/junitResults/'),
      consolidateAll: false
    }));

    //=========================================================================================

    /*************************
    * Basic Set-up on prepare
    * ************************ */

    MAXWAITTIME = 40000;
    MINWAITTIME = 3000;
    browser.driver.manage().window().maximize();
  },
  params: {
    'appEnv': 'uat',
    'experienceId': '7092',
    'domain': 'choiceui.homesitep2.com',
    'dSet': process.env.npm_lifecycle_event,
  },
  allScriptsTimeout: 20000,

  specs: [
    
     //'scenario/help/helpscenario.js'
     'scenario/moving/scenario.js',
    //  'scenario/Login/loginscenario.js',
    //  'scenario/Help/helpscenario.js',
    //  'scenario/moving/sigunupscenario.js'
],
// specs: ['async_await.js'],
  

  suites: {

    smokeTest: [],
    
   AutoRegression: ['scenario/moving/Autoscenario.js'],    
  },

  //framework: 'jasmine2',
  framework:'jasmine',
  jasmineNodeOpts: {
    stopSpecOnExpectationFailure: true,
    realtimeFailure: true,
    print: function () { },
    showColors: true,
    isVerbose: true,
    includeStackTrace: true,
    defaultTimeoutInterval: 5 * 700000
  },

  // 'onComplete': function () {

  // }
  'onComplete': function () {
    var browserName, browserVersion;
    var capsPromise = browser.getCapabilities();
    const testFolder = './Log/junitResults/';
    const fs = require('fs');
 
    capsPromise.then(function (caps) {
      browserName = caps.get('browserName');
      browserVersion = caps.get('version');
      platform = caps.get('platform');
 
      var HTMLReport = require('protractor-html-reporter-2');
 
      testConfig = {
        reportTitle: 'Protractor Test Execution Report',
        outputPath: './Log/',
        outputFilename: 'ProtractorTestReport',
        screenshotPath: './screenshots',
        testBrowser: browserName,
        browserVersion: browserVersion,
        modifiedSuiteName: false,
        screenshotsOnlyOnFailure: true,
        testPlatform: platform
      };
   

      fs.readdir(testFolder, (err, files) => {
        files.forEach(file => {
          console.log(file);
            new HTMLReport().from(testFolder+file,testConfig)});

        });
      });

      
  }

};
