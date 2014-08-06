TestLink API Client
====
TestLink API Client brings you a pure JavaScript Node-Module for TestLink tool
By default TestLink people are providing XML-RPC.api which can be used to get the response from TestLink.
This can be integrated with any JavaScript automation tools like Selenium-webdriver.js or webdriver.js for 
executing automation testCases and update the Results in TestLink. It can also be integrated with BDD frameworks 
like Cucumber.js and Yadda.js.

Installation
Node based environments 

npm install testlink-api-client

Examples
var TestLinkAPI = require('./testlinkapi'),
	devKey="5f5fa0d9eba136f28e45d1f8a17cbedd",
	RPCUrl="http://localhost:80/testlink/lib/api/xmlrpc/v1/xmlrpc.php",
	testlink=new TestLinkAPI(devKey,RPCUrl),
	testProjectId=12,
	testsuiteid=13;


testlink.getProjects(function(projects){
console.log(projects);
}); 

testlink.getTestCasesForTestSuite({testProjectId:testProjectId,testsuiteid:testsuiteid}, function(result){
	result.map(function(testcases){
	console.log(testcases);
	}); 
}); 

Execution:
H:\...\testlink-api-client\lib>node testlinkclient.js
