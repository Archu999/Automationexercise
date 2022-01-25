const { protractor } = require("protractor/built/ptor");
const { browser } = require("protractor");
var fs = require("fs");

var EC = protractor.ExpectedConditions;
MAXWAITTIME = 90000;
let visibilityWarningMessage = "oElement taking too long to appear on Page";


var BrowserACtions = function () {

    /**
     * Wait and find element on Page Sub Function of other's
     * @param oElement
     * @param timeout
     * @param message
     */

     

    this.waitAndFindElement = function (oElement, timeout, message) {
        message = message || 'Wait and Find Element';
        self = this;
        return browser.controlFlow().execute(function () {
            timeout = typeof timeout !== 'undefined' ? timeout : 40000;

            browser.wait(function () {
                return oElement.isDisplayed().then(function (displayed) {
                    browser.sleep(500);
                    //logger.info('PASS', message + "...isDisplayed");
                    return displayed;
                }, function (error) {
                    return false;
                })
            }, timeout);

            browser.wait(function () {
                return oElement.isEnabled().then(function (enabled) {
                    browser.sleep(500);
                    //logger.info('PASS', message + " ...isEnabled");
                    return enabled;
                }, function (error) {
                    return false;
                })
            }, timeout);
            if (oElement) {
                self.highlightElement(oElement);
            }
        });

    };

    

    /**
     * DropDown Select Value
     * @param parentEle {element.by any : Root Level Parent Object of the DropDown}
     * @param chileEleValue {any Drop-down Value with element in child node in DOM}
     * @param message {Custom message or default message}
     *  {dropdown should have attribute value after selected the value to return promise of selection}
     */

    this.DropDownSelect = function (parentEle, chileEleValue, message) {
        message = message || 'Select Drop-Down Value';
        try {
            return browser.wait(EC.visibilityOf(parentEle), MAXWAITTIME, 'parent: ' + visibilityWarningMessage).then(function () {
                return parentEle.click().then(function () {
                    browser.sleep(500);
                    browser.wait(EC.presenceOf(chileEleValue), MAXWAITTIME, 'Child: ' + visibilityWarningMessage).then(function () {
                        chileEleValue.click().then(function () {
                            return parentEle.getText().then(function (value) {
                                if (value) {
                                    logger.info('PASS', message + " : " + value);
                                    return true;
                                } else {
                                    logger.error('FAIL', message);
                                    return false;
                                }
                            });
                        });
                    });
                    return true;
                })
            });
        } catch (error) {
            logger.error('FAIL', message + " Error:: " + error);
        }
    };

    /**
     * Validate selected value from dropdown iSDropDownSelected
     * @param oElement {exact element.by,  any such as id, css , xpath ,name etc.. }
     * @param expectedValue { expectedValue as String }
     * @param message { Default Messages }
     */

    this.iSDropDownSelected = function (oElement, expectedValue, message) {
        message = message || 'Drop-Down Selection Validation';
        try {
            return browser.controlFlow().execute(function () {
                browser.wait(function () {
                    return oElement.getAttribute('value').then(function (actualValue) {
                        expect(actualValue).toBe(expectedValue);
                        logger.info('PASS', message + " Actual : " + actualValue + " Expected : " + expectedValue);
                        return true;
                    }, function (error) {
                        logger.info('ERROR', message + " Actual : " + actualValue + " Expected : " + expectedValue);
                        return false;

                    })
                }, MAXWAITTIME);
            });
        } catch (error) {
            logger.error('FAIL', message + " Error:: " + error);
        }
    };

   
    /**
     * Validate the Page URL
     * @param pageUrl { String Part of URL }
     * @param message { Default Messages }
     */

    this.validatePageUrl = function (pageUrl, message) {
        try {
            message = message || `Wait for this : "${pageUrl}"  endpoint url `;
            console.log('pageUrl', pageUrl);
            browser.wait(EC.urlContains(pageUrl), MAXWAITTIME);
            return expect(browser.getCurrentUrl()).toContain(pageUrl).then(async function () {
                logger.info('PASS', message);
                return true;
            });
        } catch (err) {
            logger.error('ERROR', message + " : " + err.message);
            return false;
        }
    }

   

    /**
     * Click the Button on Browsers session
     * @param oElement {exact element.by,  any such as id, css , xpath ,name etc.. }
     * @param message
     */

    this.clickOn = function (oElement, message) {
        this.waitAndFindElement(oElement, MAXWAITTIME);
        try {
            message = message || 'Perform Click Operation on page control';
            return oElement.click().then(function () {
                logger.info('PASS', message);
                return true;
            })
        } catch (err) {
            message = message || 'Perform Click Operation on page control';
            logger.info('ERROR', "Failed to execute  clickOn action due to " + err.message);
            return false;
        }

    };

    
    /**
     *  verify radio/Checkbox is checked on current page
     */

    this.isChecked = function (oElement, message) {
        this.waitAndFindElement(oElement, MAXWAITTIME);
        var result = false
        message = message || 'Perform isChecked Operation verify checked status';
        return oElement.isSelected().then(function (value) {
            expect(value).toBe(true);
            if (value) {
                logger.info('PASS', message);
                result = true;
            } else {
                logger.info('FAIL', message);
                result = false;
            }
            return value;
        });
    };

   
    /**
     * Perform enter Text Operation on Browsers
     * @param oElement
     * @param inputText     { desire value to enter in text box }
     * @param message
     */
    this.enterText = function (oElement, inputText, message) {
        try {
            this.waitAndFindElement(oElement, MAXWAITTIME);
            message = message || 'Perform enterText Operation performed';
            return oElement.clear().then(function () {
                logger.info('INFO', "Text Field Cleared..."  );
                return oElement.sendKeys(inputText).then(function () {
                    logger.info('PASS', message + "  - Entered Value :" + inputText);
                    return true;
                })
            });
        } catch (err) {
            logger.error('FAIL', message + " and Failed while trying to Enter Value : " + inputText);
            logger.error('ERROR', "Failed to execute  enterText action due to " + err.message);
            return false;
        };
    };

    
    /**
     * Gets the isDisplayed property of a link
     * @param oElement
     * @param message
     * @returns link(value of href attribute) of the element
     * @example
     * Driver.getUrl(oLogicalName, oElement, inputText, message);
     * @example
     * Action.getUrl();
     * returns the current URL
     */

    this.getUrl = function (oElement, message) {
        try {
            message = message || "Getting the element link/page url";
            if (oElement) {

                this.waitAndFindElement(oElement, MAXWAITTIME);
                return element(this.locator).getAttribute('href').then(function (url) {
                    logger.info("PASS", message)
                    return url;
                })
            } else {
                return browser.getCurrentUrl().then(function (url) {
                    logger.info("PASS", message)
                    return url;
                });
            }
        } catch (err) {

            logger.info("ERROR", 'Failed to get the element link/page url due to  ' + err.message);
            return false;
        }

    };

    /**
     * restart application
     * @return {boolean}
     */
    this.restartApp = function () {
        try {
            logger.info('INFO', 'restart application ');
            browser.restart.then(function () {
                return true;
            })
        } catch (err) {
            logger.info('ERROR', 'failed to restart application due to' + err.message);
            return false;
        }
    };

    /**
     * refresh browser application
     * @return {boolean}
     */
    this.pageRefresh = function () {
        try {
            logger.info('INFO', 'Refresh application ');
            browser.refresh.then(function () {
                return true;
            })
        } catch (err) {
            logger.info('ERROR', "Failed to refresh application  due to  " + err.message);
            return false;
        }
    };
    /**
     * Goto previous web page based on browser histoty
     * @param {message}
     * @returns {boolean}
     */
    this.browserBack = function (message, onStepFailure) {
        try {
            message = message || 'Performing back operation on browser';
            return browser.navigate().back().then(function () {
                logger.info('PASS', message);
                return true;
            })
        } catch (err) {
            logger.info('ERROR', 'Failed to navigate back due to  ' + err.message);
            return false;
        }
    };

    /**
     * Goto next web page based on browser histoty
     * @param {message}
     * @returns {boolean}
     */
    this.browserForward = function (message, onStepFailure) {
        try {
            message = message || 'Performing forward operation on browser';
            return browser.navigate().forward().then(function () {
                logger.info('PASS', message);
                return true;
            })
        } catch (err) {

            logger.info('ERROR', 'Failed to navigate forward due to  ' + err.message);
            return false;
        }
    };
    
    this.createNewExcelFile = function(tcno,testcase,result) {
        //excelFilePath: Provide path and file name for excel file
        var Excel = require('exceljs');// load exceljs module
        
            var wb = new Excel.Workbook();
		var worksheet = wb.addWorksheet('My Sheet');

		// set the column headers
        worksheet.columns = [
            { header: 'Id', key: 'id' },
            { header: 'TestcaseName', key: 'tcname'},
            { header: 'Status', key: 'status'}
		];

		// add rows
        worksheet.addRow({id: 1, tcname: 'OLS APPLICATION Launch', status: "pass"});
        worksheet.addRow({id: 2, tcname: 'Signup', status: "Pass"});
        return worksheet.addRow({id: tcno, tcname: testcase, status: result});
		//write the file to local system
        wb.xlsx.writeFile('C:/TestLog.xlsx')
    }

    this.resultJson = function(inputData,message){
        let fileName= "output.json";
        message = message||" Updating output json";
        var json={
            scenarios:[]
        };
        try{
            if(!fs.existsSync(fileName)){
                logger.info("FAIL","File does not exist");
                fs.writeFileSync(fileName,JSON.stringify(json),function(err){
                    if (err) throw err;
                    logger.info("File is created Successfully");
                });
            
            }else{
                logger.info("PASS","File Exist");
            }
            fs.readFile("output.json","utf8",function(err,data){
                json2=JSON.parse(data);
                json2.scenarios.push(inputData);
                fs.writeFile("output.json",JSON.stringify(json2),function(err,result){
                    if(err) throw err;
                    logger.info("FAIL",message);
                });
            });

        }catch(error){
            logger.info("Fail ",message+" error::"+error)
        }
    }

}
module.exports = BrowserACtions;
