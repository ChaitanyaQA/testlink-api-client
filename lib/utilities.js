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

var http 				= 	require('http'),
	xpath 				= 	require('xpath'),
	SimpleConvertXML 	= 	require('simpleConvert-XML'),
	dom 				= 	require('xmldom').DOMParser;

/**
* To Convert the XMl Response to Json Object
*
* @class Utilities
*/
module.exports = {
	
    postCompose: function(url) {
        var re = /http:\/\/([^:]*):([^\/]*)([^$]*)/
        var tokens = url.match(re);
		var	theWholeUrl = tokens[0];
		var	host = tokens[1];
		var	port = tokens[2];
		var	path = tokens[3];

        return {
            host: host,
            path: path,
            port: port,
            method: "POST",
            headers: {
                'Cookie': "cookie",
                'Content-Type': 'text/xml',
            }
        };
    },
    postRequest: function(post, body, callback) {
        var req = http.request(post, function(res) {
            var buffer = "";
            res.on("data", function(data) {
                buffer = buffer + data;
            });
            res.on("end", function(data) {
                callback(buffer);
            });
        });
        req.write(body);
        req.end();
    },

/**
 * Retrieves Json Object from XML Response.
 *
 *	@method getJsObjectByXmlResponse
 * 	@param 	{object}	 response
 * 	@return	{Json Object}JSON Object
 */
    getJsObjectByXmlResponse: function(response) {
        var parser = new dom().parseFromString(response);
        if (xpath.select("//data", parser).length > 0)
            response = xpath.select("//data", parser)[0].toString();
        parser = new dom().parseFromString(response);
        if (xpath.select("//param", parser).length > 0)
            response = xpath.select("//param", parser)[0].toString();
        var changeAttrToTag = /<member><name>(.*)<\/name><value><(string|int)>((.|[\r\n])*?)<\/\2><\/value><\/member>/;
        var nullyfy = /<member><name>.*?<string\/>.*?<\/member>/;
        if (nullyfy.test(response))
            response = response.replace(/<member><name>.*?<string\/>.*?<\/member>/g, '');
        var flag = changeAttrToTag.test(response);
        var changedTagResponse = "";
        if (flag) {
            response = response.replace(/<member><name>(.*)<\/name><value><(string|int)>((.|[\r\n])*?)<\/\2><\/value><\/member>/g, "<$1>$3</$1>");
            var recusiveRegx = /<member><name>(.*)?<\/name><value><struct>(((.|[\r\n])(?!<struct>))*?)<\/struct><\/value><\/member>/;
            var recursiveFlag = recusiveRegx.test(response);
            while (recursiveFlag) {
                response = response.replace(/<member><name>(.*)?<\/name><value><struct>(((.|[\r\n])(?!<struct>))*?)<\/struct><\/value><\/member>/, "<_$1>$2</_$1>");
                recursiveFlag = recusiveRegx.test(response);
            }
            response = response.replace(/<member><name>(.*)?<\/name><value><struct>(((.|[\r\n])(?!<struct>))*?)<\/struct><\/value><\/member>/, "<$1>$2</$1>");
        }

        var xmlNode = new dom().parseFromString(response),
			json = SimpleConvertXML.getXMLAsObj(xmlNode);
		var returnObject;
        if (json.data) {
            returnObject = json.data.value;
        }
        else {
            if (json.param) {
                returnObject = json.param.value;
            }
        }

        return returnObject;
    },
/**
 * Converts the Response to Object.
 *
 *	@method getRequestByObject
 * 	@param 	{object}	 response
 * 	@return	{Json Object}JSON Object
 */
    getRequestByObject: function(object) {
        var xmlResponse 	= "",
			methodCall 		= "",
			parallelTag 	= "",
			oneLabelArray 	= "";
        for (property in object) {
            if (property === "methodName") {
                methodCall = '<methodName>tl.' + object[property] + '</methodName>\n';
            }
            else
            {
                if (Array.isArray(object[property])) {
                    var recursiveTags = "";
                    object[property].map(function(tag) {
                        recursiveTags = recursiveTags + '<member><name>' + tag.type + '</name><value><' + tag.name + '>' + tag.value + '</' + tag.type + '></value></member>\n';
                    });

                    oneLabelArray = oneLabelArray + '<member><name>' + property + '</name><value><struct>\n' + recursiveTags + '</struct></value></member>';
                }
                else {
                    parallelTag = parallelTag + '<member><name>' + property + '</name><value>' +
                        '<' + object[property]['type'] + '>' + object[property]['value'] + '</' + object[property]['type'] + '></value></member>\n';
                }
            }

        } //End of loop

        xmlResponse = '<?xml version="1.0"?>\n' +
            '<methodCall>\n' +
            methodCall +
            '<params>' +
            '<param><value><struct>\n' +
            parallelTag +
            oneLabelArray +
            '</struct></value></param>\n' +
            '</params></methodCall>';
        return xmlResponse;
    }

};