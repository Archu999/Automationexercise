//'use strict';

//var Url = require('url-parse');
var using = require('jasmine-data-provider');
const {
  browser
} = require('protractor');
//Loading Test Data File
var dData = require('../../testData/ols/sampletestData.json');


const Actions = require('../../global/action.js');
const { DriverProvider } = require('protractor/built/driverProviders');
var perform = new Actions();



using(dData, async function (data, description) {
  using(data, async function (scenario, description) {
   
    
    envi = (browser.params.appEnv).toUpperCase();

    if (scenario.exeFlag == true) {
      describe(`${scenario.sDes}_${scenario.partner}_${scenario.policyType}_${envi}`, function () {
          //Launch QA Environment URL

        it('TS_01,Load OLS URL', async function () {
          let appUrl;
          
          if (envi =="QA") {
            appUrl = "http://automationpractice.com/";
            console.log("Launching QA Automation Website URL");
          }
          
          browser.get(appUrl);
        });
        
         //Test case for Validating Registration functionality

        it('TS_02,Register with Online Store', async function () {
         // let lan = require("../../PageModules/common/loginPM.js");
          let lan = require("../../PageModules/RegistrationPM.js");
          //lan.loginPM(scenario);
          lan.RegistrationPM(scenario);
          console.log("Registration with Online Store");
        });

        //Test case for Validating Login functionality

        it('TS_03,Login to Online Store', async function () {
          let bill = require("../../PageModules/common/LoginPM");
          bill.LoginPM(scenario);
          console.log("Login");
          
        });
        // Test case for Validating Checkout functionality

        it('TS_04,Verify Checkout', async function () {
          let poli = require("../../PageModules/moving/CheckoutPM.js");
         
          poli.CheckoutPM(scenario);
          console.log("Validate adding product to Cart and Checkout page");
          

        });
        // Close the Browser after each Test
        
         afterAll(async function () {
               await perform.clearbrowserStorage();
          browser.sleep(1000);
         });


      });
    }
  });
});
