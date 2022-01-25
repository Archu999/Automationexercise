'use strict';

const { element } = require("protractor");

//Page Locators identified using CSS for Registration Page


var register = function(){
this.headerLogo =element(by.css('[id="header_logo"]'));
this.emailaddressTxt = element(by.css('[id="email_create"]'));
var email = "testingrocks@gmail.com";
this.createaccountBtn = element(by.css('[value="Create an account"]'));
//Registration Fields
this.genderBtn =element(by.css('[id="id_gender2"]'));
//First Name
this.firstnameTxt =element(by.css('[id="customer_firstname"]'));
this.lastnameTxt =element(by.css('[id="customer_lastname"]'));
this.getemailTxt = element(by.css('[id="email"]'));
this.passwordTxt =  element(by.css('[id="passwd"]'));
//DOB
this.daysdropdown =  element(by.css('[id="days"]'));
this.daysvalue = element(by.css('[value=1]'));
//Contact Info
this.firstnameaddress =  element(by.css('[id="firstname"]'));
this.lastnameaddress =  element(by.css('[id="lastname"]'));
this.addressTxt = element(by.css('[id="address1"]'));
this.cityTxt = element(by.css('[id="city"]'));
//this.state= element(by.css('[id="id_state"]'));
this.stateDrpDwn = function(stateName, message)
  {
    message = message || ' Return moving state Element';
      logger.info('INFO', message);
      return element(by.css('[id="id_state"]' , stateName));  
  }
this.postcode= element(by.css('[id="postcode"]'));
this.mobilenumber = element(by.css('[id="phone_mobile"]'));
this.alias=element(by.css('[id="alias"]'));
this.registerBtn =element(by.css('[id="submitAccount"]'));



}
module.exports = register;
