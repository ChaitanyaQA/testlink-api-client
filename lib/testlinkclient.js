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

var TestLinkAPI = require('./testlinkapi');
var jsonPath = require('JSONPath');
var devKey="5f5fa0d9eba136f28e45d1f8a17cbedd";
var RPCUrl="http://localhost:80/testlink/lib/api/xmlrpc/v1/xmlrpc.php"; 
var testlink=new TestLinkAPI(devKey,RPCUrl);
var testProjectId=12;
var testsuiteid=13;

/* Examples: */

/* testlink.getBuildsForTestPlan({testplanid:testplanid},function(builds){
console.log(builds);
});
 
testlink.getProjectPlatforms({testprojectid:testprojectid},function(platforms){
console.log(platforms);
});
 
testlink.getProjectTestPlans({testprojectid:testprojectid},function(platforms){
console.log(platforms);
});
 
testlink.getTestCasesForTestSuite({testprojectid:testprojectid,testsuiteid:testsuiteid}, function(testcases){
console.log(testcases);
}); 

testlink.getProjects(function(projects){
console.log(projects);
}); */

testlink.getTestCasesForTestSuite({testProjectId:testProjectId,testsuiteid:testsuiteid}, function(result){
	result.map(function(testcases){
	console.log(testcases.struct.external_id);
	}); 
	
}); 

 