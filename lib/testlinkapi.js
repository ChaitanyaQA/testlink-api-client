/**
	Copyright © 2014 Imaginea Technologies Inc. All Rights Reserved.
	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0
	  
	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.
*/

var http 		= 	require('http'),
	fs          = 	require('fs'),
	utilites 	= 	require('./utilities'),
	jsonPath	=	require('JSONPath');
	dom 		= 	require('xmldom').DOMParser;


 module.exports=TestLinkApi=function(devkey,rpcUrl,callback){
	this.url=rpcUrl;
	this.devkey=devkey;	
} 


/**
 * Retrieves Builds Created for TestPlan.
 * 	@param 	 testPlanId
 * 	@param 	 callback
 * 	@return	 JSON Object for Builds
 */
TestLinkApi.prototype.getBuildsForTestPlan = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "getBuildsForTestPlan",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testplanid: {
            value: params.testplanid || "testplanid",
            type: "int"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var buildsfortestplan = utilites.getJsObjectByXmlResponse(response);
        callback(buildsfortestplan);
    });
};

/**
 * Retrieves Platforms Assigned for Project.
 * 	@param 	 testProjectId
 * 	@param 	 callback
 * 	@return	 JSON Object for Project Platforms
 */
TestLinkApi.prototype.getProjectPlatforms = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "getProjectPlatforms",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testprojectid: {
            value: params.testprojectid || "testprojectid",
            type: "int"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var projectPlatforms = utilites.getJsObjectByXmlResponse(response);
        callback(projectPlatforms);
    });
};

/**
 * Retrieves TestPlans Created for Project.
 * 	@param 	 testProjectId
 * 	@param 	 callback
 * 	@return	 JSON Object for Project TestPlan(s)
 */
TestLinkApi.prototype.getProjectTestPlans = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "getProjectTestPlans",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testprojectid: {
            value: params.testprojectid || "testprojectid",
            type: "int"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var projectPlans = utilites.getJsObjectByXmlResponse(response);
        callback(projectPlans);
    });
};

/**
 * Retrieves Created Test Projects.
 * 	@param 	 callback
 * 	@return	 JSON Object for Project(s)
 */
TestLinkApi.prototype.getProjects = function(callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "getProjects",
        devKey: {
            value: this.devkey,
            type: "string"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var projects = utilites.getJsObjectByXmlResponse(response);
        callback(projects);
    });
};

/**
 * Retrieves Created TestCase based on External Id.
 * 	@param 	 callback
 * 	@param 	 testCaseExternalId
 * 	@return	 JSON Object for TestCase
 */
TestLinkApi.prototype.getTestCase = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "getTestCase",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testcaseexternalid: {
            value: params.testcaseexternalid || "testcaseexternalid",
            type: "string"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var testcase = utilites.getJsObjectByXmlResponse(response);
        callback(testcase);
    });
};

/**
 * Get attached files for a TestCase.
 * 	@param 	 testCaseExternalId
 * 	@param 	 downloadPath
 */
TestLinkApi.prototype.getTestCaseAttachments = function(params, downloadpath, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "getTestCaseAttachments",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testcaseexternalid: {
            value: params.testcaseexternalid || "testcaseexternalid",
            type: "string"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var attachments = utilites.getJsObjectByXmlResponse(response),
			component_names = jsonPath.eval(attachments, "$..name"),
			component_contents = jsonPath.eval(attachments, "$..content"),
			index = 0;
        component_contents.map(function(content) {
            var buf = new Buffer(content, 'base64');
            fs.writeFile(downloadpath + component_names[index++], buf, function(err) {
                if (err) throw err;
                console.log('File Has Been Downloaded');
				callback();
            });
        });
    });
};

/**
 * Retrieves Custom Field Design Value Created for TestCase.
 *	@param 	testProjectId
 * 	@param 	testCaseExternalId
 * 	@param 	customFieldName
 * 	@param 	details
 * 	@param 	version
 * 	@param 	callback
 * 	@return	JSON Object for TestCase Custom field Value
 */
TestLinkApi.prototype.getTestCaseCustomFieldDesignValue = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "getTestCaseCustomFieldDesignValue",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testcaseexternalid: {
            value: params.testcaseexternalid || "testcaseexternalid",
            type: "string"
        },
        testprojectid: {
            value: params.testprojectid || "testprojectid",
            type: "int"
        },
        details: {
            value: params.details || "details",
            type: "string"
        },
        version: {
            value: params.version || "version",
            type: "int"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var customFieldValue = utilites.getJsObjectByXmlResponse(response);
        callback(customFieldValue);
    });
};

/**
 * Retrieves Created TestCase(s) for a TestPlan
 *	@param 	testPlanId
 * 	@param 	callback
 * 	@return	JSON Object for TestCases(s)
 */
TestLinkApi.prototype.getTestCasesForTestPlan = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "getTestCasesForTestPlan",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testplanid: {
            value: params.testplanid || "testcaseexternalid",
            type: "int"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var testCases = utilites.getJsObjectByXmlResponse(response);
        callback(testCases);
    });
};

/**
 * Retrieves Created TestCase(s) for a TestSuite
 *	@param 	testProjectId
 *	@param 	testSuiteId
 * 	@param 	callback
 * 	@return	JSON Object for TestCases(s)
 */
TestLinkApi.prototype.getTestCasesForTestSuite = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "getTestCasesForTestSuite",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testprojectid: {
            value: params.testprojectid || "testprojectid",
            type: "int"
        },
        testsuiteid: {
            value: params.testsuiteid || "testsuiteid",
            type: "int"
        },
        deep: {
            value: params.deep || "deep",
            type: "boolean"
        },
        details: {
            value: params.details || "details",
            type: "string"
        },
        getkeywords: {
            value: params.getkeywords || "getkeywords",
            type: "boolean"
        },
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var getsuites = utilites.getJsObjectByXmlResponse(response);
        callback(getsuites);
    });
};

/**
 * Retrieves Created TestCase based on Id
 *	@param 	testCaseName
 * 	@param 	callback
 * 	@return	JSON Object for TestCase
 */
TestLinkApi.prototype.getTestCaseIDByName = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "getTestCaseIDByName",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testcasename: {
            value: params.testcasename || "testcasename",
            type: "string"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var testcaseid = utilites.getJsObjectByXmlResponse(response);
        callback(testcaseid);
    });
};

/**
 * Retrieves TestPlan and its Properties
 *	@param 	testProjectName
 * 	@param 	testPlanName
 * 	@param 	callback
 * 	@return	JSON Object for TestPlan
 */
TestLinkApi.prototype.getTestPlanByName = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "getTestPlanByName",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testprojectname: {
            value: params.testprojectname || "testprojectname",
            type: "string"
        },
        testplanname: {
            value: params.testplanname || "testplanname",
            type: "string"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var planName = utilites.getJsObjectByXmlResponse(response);
        callback(planName);
    });
};

/**
 * Retrieves Platforms Assigned for TestPlan
 *	@param 	testPlanId
 * 	@param 	callback
 * 	@return	JSON Object for Platform
 */
TestLinkApi.prototype.getTestPlanPlatforms = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "getTestPlanPlatforms",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testplanid: {
            value: params.testplanid || "testcasename",
            type: "string"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var platforms = utilites.getJsObjectByXmlResponse(response);
        callback(platforms);
    });
};

/**
 * Retrieves TestProject and its Properties
 *	@param 	testProjectName
 * 	@param 	callback
 * 	@return	JSON Object for Project
 */
TestLinkApi.prototype.getTestProjectByName = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "getTestProjectByName",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testprojectname: {
            value: params.testprojectname || "testprojectname",
            type: "string"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var projectName = utilites.getJsObjectByXmlResponse(response);
        callback(projectName);
    });
};

/**
 * Retrieves TestSuites created for TestPlan(s)
 *	@param 	testPlanId
 * 	@param 	callback
 * 	@return	JSON Object for TestSuite
 */
TestLinkApi.prototype.getTestSuitesForTestPlan = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "getTestSuitesForTestPlan",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testplanid: {
            value: params.testplanid || "testplanid",
            type: "int"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var testSuites = utilites.getJsObjectByXmlResponse(response);
        callback(testSuites);
    });
};

/**
 * Retrieves Child TestSuite(s) created under a TestSuite(s)
 *	@param 	testSuiteId
 * 	@param 	callback
 * 	@return	JSON Object for TestSuite
 */
TestLinkApi.prototype.getTestSuitesForTestSuite = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "getTestSuitesForTestSuite",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testsuiteid: {
            value: params.testsuiteid || "testsuiteid",
            type: "int"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var testsuites = utilites.getJsObjectByXmlResponse(response);
        callback(testsuites);
    });
};

/**
 * Retrieves User and user properties
 *	@param 	userId
 * 	@param 	callback
 * 	@return	JSON Object for User
 */
TestLinkApi.prototype.getUserByID = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "getUserByID",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        userid: {
            value: params.userid || "userid",
            type: "int"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var userByID = utilites.getJsObjectByXmlResponse(response);
        callback(userByID);
    });
};

/**
 * Retrieves LoggedIn User and properties
 *	@param 	user
 * 	@param 	callback
 * 	@return	JSON Object for User
 */
TestLinkApi.prototype.getUserByLogin = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "getUserByLogin",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        user: {
            value: params.user || "userid",
            type: "string"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var userByLogin = utilites.getJsObjectByXmlResponse(response);
        callback(userByLogin);
    });
};

/**
 * Uploads a Given file to TestCase
 *	@param 	testCaseId
 *	@param 	fileName
 * 	@param 	uploadPath
 */
TestLinkApi.prototype.uploadTestCaseAttachment = function(params, callback) {
    var post = utilites.postCompose(this.url),
		bitmap = fs.readFileSync(params.uploadpath + params.filename),
		content = new Buffer(bitmap).toString('base64'),
		inputObject = {
        methodName: "uploadTestCaseAttachment",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testcaseid: {
            value: params.testcaseid || "testcaseid",
            type: "int"
        },
        title: {
            value: params.title || "title",
            type: "string"
        },
        filename: {
            value: params.filename || "title",
            type: "string"
        },
        content: {
            value: content || "title",
            type: "string"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {});
};

/*To Get DevKey*/
TestLinkApi.prototype.getDevKey = function(callback) {
    return this.devkey
};

/*To Get the URL*/
TestLinkApi.prototype.getUrl = function(callback) {
    return this.url
};

/**
 * Retrieves Execution Counters for Build
 *	@param 	testPlanId
 *	@param 	callback
 * 	@return	JSON Object for Execution Counters
 */
TestLinkApi.prototype.getExecCountersByBuild = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "getExecCountersByBuild",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testplanid: {
            value: params.testplanid || "testplanid",
            type: "int"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var execCounters = utilites.getJsObjectByXmlResponse(response);
        callback(execCounters);
    });
};

/**
 * Retrieves First Level of TestSuites in a Project
 *	@param 	testProjectId
 *	@param 	callback
 * 	@return	JSON Object for TestSuite
 */
TestLinkApi.prototype.getFirstLevelTestSuitesForTestProject = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "getFirstLevelTestSuitesForTestProject",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testprojectid: {
            value: params.testprojectid || "userid",
            type: "int"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var firstLevelSuite = utilites.getJsObjectByXmlResponse(response);
        callback(firstLevelSuite);
    });
};
/**
 * Retrieves Full Path for a Node
 *	@param 	nodeId
 *	@param 	callback
 * 	@return	JSON Object for FullPath
 */
TestLinkApi.prototype.getFullPath = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "getFullPath",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        nodeid: {
            value: params.nodeid || "userid",
            type: "int"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var fullpath = utilites.getJsObjectByXmlResponse(response);
        callback(fullpath);
    });
};

/**
 * Retrieves Last Execution Result for a TestCase
 *	@param 	testPlanId
 *	@param 	testCaseExternalId
 *	@param 	callback
 * 	@return	JSON Object for Last Execution Result
 */
TestLinkApi.prototype.getLastExecutionResult = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "getLastExecutionResult",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testplanid: {
            value: params.testplanid || "testplanid",
            type: "int"
        },
        testcaseexternalid: {
            value: params.testcaseexternalid || "testcaseexternalid",
            type: "string"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var lastresult = utilites.getJsObjectByXmlResponse(response);
        callback(lastresult);
    });
};

/**
 * Un-Assign a Platform for a given TestPlan
 *	@param 	testPlanId
 *	@param 	platformName
 *	@param 	callback
 * 	@return	JSON Object for a PlatformTestPlan
 */
TestLinkApi.prototype.removePlatformFromTestPlan = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "removePlatformFromTestPlan",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testplanid: {
            value: params.testplanid || "testplanid",
            type: "int"
        },
        platformname: {
            value: params.platformname || "platformname",
            type: "string"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var removeplatform = utilites.getJsObjectByXmlResponse(response);
        callback(removeplatform);
    });
};

/**
 * Update Result for a given TestCase.
 *	@param 	testPlanId
 *	@param 	testCaseExternalId
 *	@param 	buildId
 *	@param 	notes
 *	@param 	status
 *	@param 	platformName
 *	@param 	user
 *	@param 	bugId
 *	@param 	callback
 * 	@return	JSON Object for TestCase Result
 */
TestLinkApi.prototype.reportTCResult = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "reportTCResult",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testplanid: {
            value: params.testplanid || "testplanid",
            type: "int"
        },
        testcaseid: {
            value: params.testcaseid || "testcaseid",
            type: "string"
        },
        buildid: {
            value: params.buildid || "buildid",
            type: "string"
        },
        notes: {
            value: params.notes || "notes",
            type: "string"
        },
        platformname: {
            value: params.platformname || "platformname",
            type: "string"
        },
        user: {
            value: params.user || "user",
            type: "string"
        },
        bugid: {
            value: params.bugid || "bugid",
            type: "string"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var tcresult = utilites.getJsObjectByXmlResponse(response);
        callback(tcresult);
    });
};

/**
 * Overwrite Result for a given TestCase.
 *	@param 	testPlanId
 *	@param 	testCaseExternalId
 *	@param 	buildId
 *	@param 	notes
 *	@param 	status
 *	@param 	platformName
 *	@param 	overwrite
 *	@param 	user
 *	@param 	bugId
 *	@param 	callback
 * 	@return	JSON Object for TestCase Result
 */
TestLinkApi.prototype.reportTCResultOverwrite = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "reportTCResult",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testplanid: {
            value: params.testplanid || "testplanid",
            type: "int"
        },
        testcaseid: {
            value: params.testcaseid || "testcaseid",
            type: "string"
        },
        buildid: {
            value: params.buildid || "buildid",
            type: "string"
        },
        notes: {
            value: params.notes || "notes",
            type: "string"
        },
        platformname: {
            value: params.platformname || "platformname",
            type: "string"
        },
        user: {
            value: params.user || "user",
            type: "string"
        },
        bugid: {
            value: params.bugid || "bugid",
            type: "string"
        },
        overwrite: {
            value: params.overwrite || "overwrite",
            type: "boolean"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var resultoverwrite = utilites.getJsObjectByXmlResponse(response);
        callback(resultoverwrite);
    });
};


/**
 * 	Set the Execution Type for a given TestCase.
 *	@param 	testProjectId
 *	@param 	testCaseExternalId
 *	@param 	executionType
 *	@param 	callback
 * 	@return	JSON Object for TestCase Execution Type
 */
TestLinkApi.prototype.setTestCaseExecutionType = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "setTestCaseExecutionType",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testprojectid: {
            value: params.testprojectid || "testprojectid",
            type: "int"
        },
        testcaseexternalid: {
            value: params.testcaseexternalid || "testcaseexternalid",
            type: "string"
        },
        version: {
            value: params.version || "version",
            type: "int"
        },
        executiontype: {
            value: params.executiontype || "executiontype",
            type: "int"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var removeplatform = utilites.getJsObjectByXmlResponse(response);
        callback(removeplatform);
    });
};

/**
 * 	Retrieves TestList Version.
 *	@param 	callback
 * 	@return	JSON Object for version
 */
TestLinkApi.prototype.getTestLinkVersion = function(callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "testLinkVersion",
        devKey: {
            value: this.devkey,
            type: "string"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var testlinkversion = utilites.getJsObjectByXmlResponse(response);
        callback(testlinkversion);
    });
};

/**
 * 	Update TestCase Version and Summary.
 *	@param 	testCaseExternalId
 *	@param 	version
 *	@param 	summary
 *	@param 	callback
 * 	@return	JSON Object for TestCase
 */
TestLinkApi.prototype.updateTestCase = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "updateTestCase",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testcaseexternalid: {
            value: params.testcaseexternalid || "testcaseexternalid",
            type: "string"
        },
        version: {
            value: params.version || "version",
            type: "int"
        },
        summary: {
            value: params.summary || "summary",
            type: "string"
        }
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var updatetc = utilites.getJsObjectByXmlResponse(response);
        callback(updatetc);
    });
};

/**
 * 	Update TestCase Custom Field Design Values.
 *	@param 	testProjectId
 *	@param 	testCaseExternalId
 *	@param 	version
 *	@param 	customFieldName
 *	@param 	customFieldValue
 *	@param 	callback
 * 	@return	JSON Object for TestCase
 */
TestLinkApi.prototype.updateTestCaseCustomFieldDesignValue = function(params, callback) {
    var post = utilites.postCompose(this.url),
		inputObject = {
        methodName: "updateTestCaseCustomFieldDesignValue",
        devKey: {
            value: this.devkey,
            type: "string"
        },
        testprojectid: {
            value: params.testprojectid || "testprojectid",
            type: "int"
        },
        testcaseexternalid: {
            value: params.testcaseexternalid || "testcaseexternalid",
            type: "int"
        },
        version: {
            value: params.version || "version",
            type: "string"
        },
        customfields: [{
            name: params.custonfiledname || "custonfiledname",
            value: params.custonfiledvalue || "custonfiledvalue",
            type: "String"
        }]
    },
		body = utilites.getRequestByObject(inputObject);
    utilites.postRequest(post, body, function(response) {
        var customfiled = utilites.getJsObjectByXmlResponse(response);
        callback(customfiled);
    });
};


