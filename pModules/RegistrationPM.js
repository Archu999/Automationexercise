const registerPageObject = require("../../pLocators/moving/Registration");
var obj = new registerPageObject();
//Utility Package for Common functions
const Actions = require('../../global/action.js');
const { browser } = require("protractor");
var perform = new Actions();
//Loading test data
var gData = require('./../../testData/common/sampletestData.json');

global.driver = require('protractor');

async function registerPM(scenario) {
    
    console.log("Entered Registration Page");
    //Enter Email Address
    await perform.enterText(obj.emailaddressTxt,gData.credential.user1.username);
   //Click on Create Account Button
   await perform.clickOn(obj.createaccountBtn);
    
    //await perform.validatePageUrl(obj.registerUrl);
}module.exports.registerPM = registerPM;
