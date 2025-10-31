Getting Started
Introduction
Welcome to M-Pesa's Developer Portal! The OpenAPI Solution offers RESTful interfaces to help you create a payment solution that meets merchant and business needs. These interfaces enable businesses to incorporate Mobile Money payment functionality into newly developed applications and point of sale devices.

In this web portal, detailed documentation will be provided on how to build and test interfaces against our RESTful API endpoints. The API endpoints that have been exposed allows for:
•	customer to business (C2B) single payment
•	customer to business (C2B) two-step payment
•	business to customer (B2C) 
•	business to business (B2B)
•	payment reversals 
•	query transaction status 
•	direct debit creation and payments
•	query direct debit
•	cancel direct debit
Development Process
The M-Pesa Developer Portal allows developers the following functions:
•	Application Management - View, edit and create new integration services through applications by selecting products, defining their scope and setting limits
•	Rapid Integration - Develop interfaces quickly by following detailed API documentation, examples and library codes
•	Sandbox Testing - Secure and isolated testing environment to test interfaces and confirm responses through pre-determined scenarios
•	Developer and Organisation Linking – Connect with organisations and build new applications to integrate with Mobile Money
•	Push for Review Workflow – Initiate a seamless workflow to hand over integration configuration to linked organisations for testing and go-live
•	Integrated Support Forum - Get help from experts in the field on various topics
•	Dedicated Business Processes - Understand the flow of interfaces / interactions to build better products and inspire future integration services
Developing your API
Overview
The APIs that have been exposed are clearly documented in their respective sections within the API DOCUMENTATION pages.  Following along with the structure and parameters will allow you to rapidly build the correct API package to seamlessly integrate with Mobile Money services, allowing for convenient payment opportunities for businesses.
RESTful APIs
The APIs exposed are RESTful APIs that break down transactions into a series of small modules, each addressing an underlying part of the transaction. The REST APIs provide developers with all the tools to effectively interact with the Mobile Money Payments Gateway by calling specific functions using the API. 

The first functional API call to be initiated will be to generate a Session Key which allows the calling application to be authorised and authenticated in the OpenAPI server. If successful, the developer will receive a valid session key. 

Using the session key, subsequent API calls can be made to initiate the payment transaction needed (business to customer, customer to business, etc.). The session key will only be valid for a finite lifetime and is configured within the Applications page.
Applications
Developers can manage applications and their respective business configuration on the APPLICATIONS page. Each application is a containerised record that lists the integration configuration, product scope that could be called and any/all limitations placed on the API calls. The developer can create new applications, duplicate existing configuration into a new application, edit or remove existing applications.

Applications require the following details:
•	Application Name – human-readable name of the application
•	Version – version number of the application, allowing changes in API products to be managed in different versions
•	Description – Free text field to describe the use of the application
•	API Key – Unique authorisation key used to authenticate the application on the first call. API Keys need to be encrypted in the first “Generate Session API Call” to create a valid session key to be used as an access token for future calls. Encrypting the API Key is documented in the GENERATE SESSION API page
•	Session Lifetime – The session key has a finite lifetime of availability that can be configured. Once a session key has expired, the session is no longer usable, and the caller will need to authenticate again.
•	Trusted Sources – the originating caller can be limited to specific IP address(es) as an additional security measure.
•	Products / Scope / Limits – the required API products for the application can be enabled and limits defined for each call.
API Products
Developers will have access to all API products within the OpenAPI. Each API call needed should be enabled using the toggle. Once enabled, the user can make use of the API call. Businesses will be required to have the product enabled on their M-Pesa account. More details of the API product are listed in the API Documentation pages.

The API scope can be limited by enabling and setting the values on a per API basis. Limits for the API is enforced per session 
•	Usage time – which time of the day the API may be used
•	Single transaction value – value of a single transaction in a given currency 
•	Daily transaction value – accumulated value of all transactions for the day in a given currency 
•	Number of transactions – accumulated number of transactions for the day

Once the session limits are reached for the API, no further transaction can be completed until a new session key is generated.

In addition to session limits, the APIs can be limited on a customer basis by configuring the following limits:
•	Customer daily transaction value – accumulated value of all transactions for a specific customer during the day in a given currency
•	Customer number of transactions – accumulated number of transactions initiated by a specific transaction for the day
Testing within Sandbox
Overview
New and existing applications can be safely tested within the dedicated Sandbox environment. The Sandbox server isolate transaction testing away from the production Mobile Money servers for safe-guarding purposes. The developer can trigger pre-built scenarios to test the following use cases:
•	Successful payments 
•	Rejected payments
•	Timeout on payments
•	Insufficient balance
•	Failed transactions

In addition to pre-built scenarios being triggered, the developer can register test mobile handset numbers (MSISDNs) to trigger USSD Push transactions for C2B payments. Detailed information on testing can be found in the TESTING DOCUMENTATION page.
Linking with Businesses / Organisations
Overview
A developer account needs to be linked to a business/organisation before an application can be taken live.

Developer accounts can create new applications and set the initial configuration. An Organisation is registered on the Mobile Money platform. After the commercial agreement with the Mobile Network Operator (MNO), the organisation user will be able to promote a new application to production.
Linking Process
To link a developer account with an organisation, the organisation user will send an invitation to the developer’s e-mail account from within the Portal. If the developer user already has an account, a notification will be sent to the Developer user to accept the new link. 

If the developer does not yet have an account, an e-mail will be sent to the Developer user’s e-mail account with a link to register onto the Developer Portal. Once the account is created, the developer and the organisation will be linked. The developer will be able to develop on behalf of the organisation.
Handing over for Review
Overview
The developer is responsible for creating and developing integration on behalf of the organisation. Once the development of the integration is completed and testing is concluded, the developer user can hand over the created application to the linked organisation through the Developer Portal.
Send for Review
The developer can only hand over an application to an organisation with whom a link has been established (developer has accepted the invitation of the organisation). From the APPLICATION page, the developer can click on the application and click “Send for Review”. The developer can select the organisation to whom he/she wants to hand over the application and its configuration.

The OpenAPI workflow will move the application to the organisation user’s account who is able to review the application configuration, scope and limits. Once reviewed, the application can be accepted or rejected. Once accepted the application and its scope will be locked for the developer. The developer user will not be able to do any changes on the application.
Support and Documentation
The OpenAPI offers several sections of support and documentation to get help from experts in the field on various topics.
Documentation
Dedicated documentation pages exist to assist in the building of the API interfaces. How to build each API call, including the required parameters for the header and body, and the expected response/result fields are documented in detail. Testing documentation exists to guide the user on how to trigger specific responses to test the application’s interfaces. In addition, each page within the portal consists of a HELP page to provide relevant information, guiding the user what needs to be done at each section.
Support Forum
In addition to the documentation pages, a support forum exists to ask questions and seek help from other developers and operational support teams.


API documentation

Generate SessionKey
API Description
Before you can integrate on the M-Pesa OpenAPI solution, you must exchange your Application Key for a Session Key. The API Key is created with the creation of a new application. The Session Key acts as an access token that authorises the rest of your REST API calls to the system. A valid Session Key is needed to transact on M-Pesa using OpenAPI.
Generating the Session Key
Encrypting the API Key
To generate your Session Key for the sandbox and live environments:
1.	Log into OpenAPI with a developer account
2.	On the APPLICATION page, click Create New Application. Creating an application will generate your unique API Application Key needed to authorise and authenticate your application on the server
3.	Type your name and version number for the application and select the products you wish to use. (The application can be configured any time). Save your new application.
4.	Copy and save the API Key.
5.	Copy the Public Key from the below section.
6.	Generate a decoded Base64 string from the Public Key
7.	Generate an instance of an RSA cipher and use the Base 64 string as the input
8.	Encode the API Key with the RSA cipher and digest as Base64 string format
9.	The result is your encrypted API Key.
Platform Public Key
Use the Public Key associated to the targeted platform to encrypt your API Key:
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArv9yxA69XQKBo24BaF/D+fvlqmGdYjqLQ5WtNBb5tquqGvAvG3WMFETVUSow/LizQalxj2ElMVrUmzu5mGGkxK08bWEXF7a1DEvtVJs6nppIlFJc2SnrU14AOrIrB28ogm58JjAl5BOQawOXD5dfSk7MaAA82pVHoIqEu0FxA8BOKU+RGTihRU+ptw1j4bsAJYiPbSX6i71gfPvwHPYamM0bfI4CmlsUUR3KvCG24rB6FNPcRBhM3jDuv8ae2kC33w9hEq8qNB55uw51vK7hyXoAa+U7IqP1y6nBdlN25gkxEA8yrsl1678cspeXr+3ciRyqoRgj9RD/ONbJhhxFvt1cLBh+qwK2eqISfBb06eRnNeC71oBokDm3zyCnkOtMDGl7IvnMfZfEPFCfg5QgJVk1msPpRvQxmEsrX9MQRyFVzgy2CWNIb7c+jPapyrNwoUbANlN8adU1m6yOuoX7F49x+OjiG2se0EJ6nafeKUXw/+hiJZvELUYgzKUtMAZVTNZfT8jjb58j8GVtuS+6TM2AutbejaCV84ZK58E2CRJqhmjQibEUO6KPdD7oTlEkFy52Y1uOOBXgYpqMzufNPmfdqqqSM4dU70PO8ogyKGiLAIxCetMjjm6FCMEA3Kc8K0Ig7/XtFm9By6VxTJK1Mg36TlHaZKP6VzVLXMtesJECAwEAAQ==
API Header Parameters
The encrypted API Key needs to be added to the Header block that makes up your initial Generate SessionKey API Call in the Authorization-Bearer value. The rest of the header parameters are as follows:

Header Name	Header Value	Header Description
Content-Type	application/json	The content-type of the API
Authorization	Bearer [encrypted-APIKey]	Bearer token authorization is used. The encrypted APIKey needs to be used.
Origin	*	Used to limit the origin of the API caller to specific systems. Use the domain name or IP address. Should match the value(s) defined in your Application.
Sample Header Code
Content-Type: application/json
Authorization: Bearer K2sf0ne61AocJqWxO3kTHMBmLl0fQyBQWV7GfH3z1kMxV qMCB7sMXn+CKigIPIawHoNr2IrGdjBdFugyHNxRnGkrfSDkC9PFBhR/D9ePdw15jgggnG8FItGpw4TEwECgzk0sEmYmKaB9K6lgvs4rs7TMPpTom7uX72+tZ+qMqRVt7LrGsngBrkXjbOxc19fkImVHjehzjVCOSOsROsx4nRlM9wtl4KSLgKCBzmLePRmwu/IOCF3NrIQLVYYqUDDSgYbHURk1L6d4kxJffFM/wa2BPoeuG59gcgldyEaQ5Sv5VnaGKDh1XTBrvKS+J9Efwg7s1CWLQxhtYdr+Z2eorC1QjbxwW+LbiIChiu/wSVRY6/9p41QbXEsBoIEESPD8JIfxGM/HFRhRmiVN2LGiUX8+5O1piXq4JRrBz+VrQ1HXpDKQj4+MAipVPqL4jsQhbbOQ/OvZa3uA18oA9FXpsC41siVApduLOlK8OxJPvygtB1gMlSisOHLWiZGWjY7uEu9CvW9LPlcz4MzHhIg6/Vemj5KyT/Mcn/874K8LgZG8eTnzBac3nvrsl2k5BnMUa/4JoBUOjqrJUe4cckYPIjw2sw9rUFqfOqh9LiG76dCFvgBOKqZU3ZrEGT7/yE+VlMkHV+rON26+XWIet5nGZobPXZFm9gAgIkAav3b//X4=
Origin: 127.0.0.1
Make REST API Call
API Endpoint
Use the following URL as the API service endpoint for the chosen environment:
Site	SSL	HTTP Method	Host	Port	Context
Sandbox	True	GET	openapi.m-pesa.com	443	/sandbox/ipg/v2/[market]/getSession/
OpenAPI	True	GET	openapi.m-pesa.com	443	/openapi/ipg/v2/[market]/getSession/
Replace the [market] and [currency] parameters with the appropriate values from the below table:
Markets
Description	URL Context Value	input_Country Value	input_Currency Value
Vodafone Ghana	vodafoneGHA	GHA	GHS
Vodacom Tanzania	vodacomTZN	TZN	TZS
Vodacom Lesotho	vodacomLES	LES	LSL
Vodacom DR Congo	vodacomDRC	DRC	USD
Vodacom Mozambique	vodacomMOZ	MOZ	MZN
API Setup Example
GET https://openapi.m-pesa.com/sandbox/ipg/v2/vodafoneGHA/getSession/
API Request
No request parameters are needed for the body of the Generate SessionKey call.
API Synchronous Response
After initiating the API call, the system will respond with the following items:

Parameter Name	Parameter Description	Parameter Possible Values
output_ResponseCode	The result code for the transaction.	INS-0
output_ResponseDesc	The result description for the transaction.	Request processed successfully
output_SessionID	The SessionKey that can be used to call other APIs.	AAA6d1f93910052de0534912jbsj1j2kk
Response Codes
HTTP StatusCode	Response Code	Response Description
200	INS-0	Request processed successfully
400	INS-989	Session Creation Failed
Sample Packets
Sample request and response packets.

This API is only available in an end-to-end synchronous flow.
No Request Parameters
Sample Code Snippets
Libraries Download
Libraries to assist with integrations.

APIKey Encryption
This code snippet can be used when you need to only perform APIKey or SessionKey encryption before attempting any API calls 
and you would like to use your own HTTP and API handlers to perform the API calls.

Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below code section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {    
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArv9yxA69XQKBo24BaF/D+fvlqmGdYjqLQ5WtNBb5tquqGvAvG3WMFETVUSow/LizQalxj2ElMVrUmzu5mGGkxK08bWEXF7a1DEvtVJs6nppIlFJc2SnrU14AOrIrB28ogm58JjAl5BOQawOXD5dfSk7MaAA82pVHoIqEu0FxA8BOKU+RGTihRU+ptw1j4bsAJYiPbSX6i71gfPvwHPYamM0bfI4CmlsUUR3KvCG24rB6FNPcRBhM3jDuv8ae2kC33w9hEq8qNB55uw51vK7hyXoAa+U7IqP1y6nBdlN25gkxEA8yrsl1678cspeXr+3ciRyqoRgj9RD/ONbJhhxFvt1cLBh+qwK2eqISfBb06eRnNeC71oBokDm3zyCnkOtMDGl7IvnMfZfEPFCfg5QgJVk1msPpRvQxmEsrX9MQRyFVzgy2CWNIb7c+jPapyrNwoUbANlN8adU1m6yOuoX7F49x+OjiG2se0EJ6nafeKUXw/+hiJZvELUYgzKUtMAZVTNZfT8jjb58j8GVtuS+6TM2AutbejaCV84ZK58E2CRJqhmjQibEUO6KPdD7oTlEkFy52Y1uOOBXgYpqMzufNPmfdqqqSM4dU70PO8ogyKGiLAIxCetMjjm6FCMEA3Kc8K0Ig7/XtFm9By6VxTJK1Mg36TlHaZKP6VzVLXMtesJECAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Api key
            context.setApiKey("6bc4157dbowkdd409118e0978dc6991a");

            // Create a request object
            APIRequest request = new APIRequest(context);

            // Generate BearerToken
            String token = request.createBearerToken();
            Console.WriteLine(token);
        }
    }
}
Generate SessionKey
This API should always be the first call to be used as it will return the SessionKey that needs to be used in conjunction with all of the other API calls from the API documentation.

Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below API section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {    
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArv9yxA69XQKBo24BaF/D+fvlqmGdYjqLQ5WtNBb5tquqGvAvG3WMFETVUSow/LizQalxj2ElMVrUmzu5mGGkxK08bWEXF7a1DEvtVJs6nppIlFJc2SnrU14AOrIrB28ogm58JjAl5BOQawOXD5dfSk7MaAA82pVHoIqEu0FxA8BOKU+RGTihRU+ptw1j4bsAJYiPbSX6i71gfPvwHPYamM0bfI4CmlsUUR3KvCG24rB6FNPcRBhM3jDuv8ae2kC33w9hEq8qNB55uw51vK7hyXoAa+U7IqP1y6nBdlN25gkxEA8yrsl1678cspeXr+3ciRyqoRgj9RD/ONbJhhxFvt1cLBh+qwK2eqISfBb06eRnNeC71oBokDm3zyCnkOtMDGl7IvnMfZfEPFCfg5QgJVk1msPpRvQxmEsrX9MQRyFVzgy2CWNIb7c+jPapyrNwoUbANlN8adU1m6yOuoX7F49x+OjiG2se0EJ6nafeKUXw/+hiJZvELUYgzKUtMAZVTNZfT8jjb58j8GVtuS+6TM2AutbejaCV84ZK58E2CRJqhmjQibEUO6KPdD7oTlEkFy52Y1uOOBXgYpqMzufNPmfdqqqSM4dU70PO8ogyKGiLAIxCetMjjm6FCMEA3Kc8K0Ig7/XtFm9By6VxTJK1Mg36TlHaZKP6VzVLXMtesJECAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Api key
            context.setApiKey("6bc4157dbowkdd409118e0978dc6991a");
            // Use ssl/https
            context.setSsl(true);
            // Method type (can be GET/POST/PUT)
            context.setMethodType(APIMethodTypes.GET);
            // API address
            context.setAddress("openapi.m-pesa.com");
            // API Port
            context.setPort(443);
            // API Path
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/getSession/");

            // Parameters can be added to the call as well that on POST will be in JSON format and on GET will be URL
            // parameters
            // context.addParameter("key", "value");

            // Add/update headers
            context.addHeader("Origin", "*");

            // Create a request object
            APIRequest request = new APIRequest(context);
            
            // Do the API call and put result in a response packet
            APIResponse response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("SessionKey call failed to get result. Please check.");
            }

            // Display results
            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 
        }
    }
}

C2B SINGLE STAGE
API Description
The C2B API call is used as a standard customer-to-business transaction. Funds from the customer’s mobile money wallet will be deducted and be transferred to the mobile money wallet of the business. To authenticate and authorize this transaction, M-Pesa Payments Gateway will initiate a USSD Push message to the customer to gather and verify the mobile money PIN number. This number is not stored and is used only to authorize the transaction.
Make REST API Call
API Endpoint
Use the following URL as the API service endpoint for the chosen environment:

Site	SSL	HTTP Method	Host	Port	Context
Sandbox	True	POST	openapi.m-pesa.com	443	/sandbox/ipg/v2/[market]/c2bPayment/singleStage/
OpenAPI	True	POST	openapi.m-pesa.com	443	/openapi/ipg/v2/[market]/c2bPayment/singleStage/
Replace the [market] and [currency] parameters with the appropriate values from the below table:
API Markets
Description	URL Context Value	input_Country Value	input_Currency Value
Vodafone Ghana	vodafoneGHA	GHA	GHS
Vodacom Tanzania	vodacomTZN	TZN	TZS
Vodacom Lesotho	vodacomLES	LES	LSL
Vodacom DR Congo	vodacomDRC	DRC	USD
Vodacom Mozambique	vodacomMOZ	MOZ	MZN
API Setup Example
POST https://openapi.m-pesa.com/sandbox/ipg/v2/vodafoneGHA/c2bPayment/singleStage/
API Headers
The header of the API call makes use of the Session Key received from the Generate SessionKey API call when authorising and authenticating the calling party.

Header Name	Header Value	Header Description
Content-Type	application/json	The content-type of the API
Authorization	Bearer [encrypted-SessionKey]	Bearer token authorization is used. The encrypted SessionKey needs to be used.
Origin	*	Used to limit the origin of the API caller to specific systems. Use the domain name or IP address. Should match the value(s) defined in your Application.
Content-Type: application/json
Authorization: Bearer K2sf0ne61AocJqWxO3kTHMBmLl0fQyBQWV7GfH3z1kMxV qMCB7sMXn+CKigIPIawHoNr2IrGdjBdFugyHNxRnGkrfSDkC9PFBhR/D9ePdw15jgggnG8FItGpw4TEwECgzk0sEmYmKaB9K6lgvs4rs7TMPpTom7uX72+tZ+qMqRVt7LrGsngBrkXjbOxc19fkImVHjehzjVCOSOsROsx4nRlM9wtl4KSLgKCBzmLePRmwu/IOCF3NrIQLVYYqUDDSgYbHURk1L6d4kxJffFM/wa2BPoeuG59gcgldyEaQ5Sv5VnaGKDh1XTBrvKS+J9Efwg7s1CWLQxhtYdr+Z2eorC1QjbxwW+LbiIChiu/wSVRY6/9p41QbXEsBoIEESPD8JIfxGM/HFRhRmiVN2LGiUX8+5O1piXq4JRrBz+VrQ1HXpDKQj4+MAipVPqL4jsQhbbOQ/OvZa3uA18oA9FXpsC41siVApduLOlK8OxJPvygtB1gMlSisOHLWiZGWjY7uEu9CvW9LPlcz4MzHhIg6/Vemj5KyT/Mcn/874K8LgZG8eTnzBac3nvrsl2k5BnMUa/4JoBUOjqrJUe4cckYPIjw2sw9rUFqfOqh9LiG76dCFvgBOKqZU3ZrEGT7/yE+VlMkHV+rON26+XWIet5nGZobPXZFm9gAgIkAav3b//X4=
Origin: 127.0.0.1
API Requests
The body of the API call is made up of the following parameters and values:
Parameter Name	Parameter Description	Parameter Mandatory	Parameter Regex Validation	Parameter Possible Values
input_Amount	The transaction amount. This amount will be moved from the organization's account to the customer's account.	True	^\d*\.?\d+$	10.00
input_CustomerMSISDN	The MSISDN of the customer where funds will be debitted from.	True	^[0-9]{12,14}$	254707161122
input_Country	The country of the mobile money platform where the transaction needs happen on.	True	N/A	GHA
input_Currency	The currency in which the transaction should take place.	True	^[a-zA-Z]{1,3}$	GHS
input_ServiceProviderCode	The shortcode of the organization where funds will be creditted to.	True	^([0-9A-Za-z]{4,12})$	ORG001
input_TransactionReference	The customer's transaction reference	True	^[0-9a-zA-Z \w+]{1,20}$	T12344C
input_ThirdPartyConversationID	The third party's transaction reference on their system.	True	^[0-9a-zA-Z \w+]{1,40}$	1e9b774d1da34af78412a498cbc28f5e
input_PurchasedItemsDesc	Description of purchased items	True	^[0-9a-zA-Z \w+]{1,256}$	Handbag, Black shoes
API Responses
The response back to the application can either be synchronous or asynchronous, depending the business use case. Synchronous responses will make use of the same session to return the results. For asynchronous responses, the user will need to build a listener to receive the asynchronous response once the transaction has finalised on the payment system.
The response back to the application can either be synchronous or asynchronous, depending the business use case. Synchronous responses will make use of the same session to return the results. For asynchronous responses, the user will need to build a listener to receive responses once the transaction has finalised on the walletting system.
Synchronous Responses
Parameter Name	Parameter Description	Parameter Possible Values
output_ResponseCode	The result code for the transaction.	INS-0
output_ResponseDesc	The result description for the transaction.	Request processed successfully
output_TransactionID	The transaction identifier that gets generated on the Mobile Money platform. This is used to query transactions on the Mobile Money Platform.	hv9ahxcg4ccv
output_ConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
Asynchronous Responses
Once the transaction is initiated, the OpenAPI will respond synchronously with the following information before the session is closed. 

Parameter Name	Parameter Description	Parameter Possible Values
output_ResponseCode	The result code for the transaction.	INS-0
output_ResponseDesc	The result description for the transaction.	Request processed successfully
output_ConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e


The Conversation ID can be used in a Query Transaction Status call to determine the status of the process flow. Once the transaction has been completed, the OpenAPI will provide the result of the transaction in an asynchronous message to the value listed in the Response URL of the request parameter in the body. Please note that the developed application will need to have a separate listener to receive the result. 

Parameter Name	Parameter Description	Parameter Possible Values
input_OriginalConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
input_TransactionID	The transaction identifier that gets generated on the Mobile Money platform. This is used to query transactions on the Mobile Money Platform.	hv9ahxcg4ccv
input_ResultCode	The result code for the transaction.	INS-0
input_ResultDesc	The result description for the transaction.	Request processed successfully
input_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e


It is expected that the listener confirms receipt of the result by responding the below content which closes out the session:
Parameter Name	Parameter Description	Parameter Possible Values
output_OriginalConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ResponseCode	The result code for the transaction.	0
output_ResponseDesc	The result description for the transaction.	 Successfully Accepted Result 
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
Response Codes
HTTP StatusCode	Response Code	Response Description
201	INS-0	Request processed successfully
400	INS-1	Internal Error
401	INS-6	Transaction Failed
408	INS-9	Request timeout
409	INS-10	Duplicate Transaction
400	INS-13	Invalid Shortcode Used
400	INS-15	Invalid Amount Used
400	INS-17	Invalid Transaction Reference. Length Should Be Between 1 and 20.
400	INS-20	Not All Parameters Provided. Please try again.
400	INS-21	Parameter validations failed. Please try again.
400	INS-26	Invalid Currency Used
400	INS-28	Invalid ThirdPartyConversationID Used
400	INS-30	Invalid Purchased Items Description Used
400	INS-990	Customer Transaction Value Limit Breached
400	INS-991	Customer Transaction Count Limit Breached
400	INS-992	Multiple Limits Breached
400	INS-993	Organization Transaction Count Limit Breached
400	INS-994	Organization Transaction Value Limit Breached
400	INS-995	API Single Transaction Limit Breached
400	INS-996	API Being Used Outside Of Usage Time
400	INS-997	API Not Enabled
400	INS-998	Invalid Market
422	INS-2006	Insufficient balance
400	INS-2051	MSISDN invalid.
Sample Packets
Sample request and response packets.

If you want to make use of a end to end synchronous flow, use the following tabs:
Request (Thirdparty -> OpenAPI)
Sync Flow Response (OpenAPI -> Thirdparty)

If you want to make use of a end to end asynchronous flow, use the following tabs:
Request (Thirdparty -> OpenAPI)
Async Flow Response (OpenAPI -> Thirdparty)
OpenAPI Async Flow Request (OpenAPI -> Thirdparty)
ThirdParty Async Flow Response (Thirdparty -> OpenAPI)
{
  "input_Amount": "10", 
  "input_Country": "GHA", 
  "input_Currency": "GHS", 
  "input_CustomerMSISDN": "000000000001", 
  "input_ServiceProviderCode": "000000", 
  "input_ThirdPartyConversationID": "asv02e5958774f7ba228d83d0d689761", 
  "input_TransactionReference": "T1234C",
  "input_PurchasedItemsDesc": "Shoes"
}
Sample Code Snippets
Libraries Download
Libraries to assist with integrations.
C2B Single Stage
This API should always be used in conjunction with a valid SessionKey.
Please refer to the Generate SessionKey API documentation page to see how to generate a SessionKey or see the below combined API code snippet where the Generate SessionKey API is combined with the C2B Single Stage API.


Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below API section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {    
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArv9yxA69XQKBo24BaF/D+fvlqmGdYjqLQ5WtNBb5tquqGvAvG3WMFETVUSow/LizQalxj2ElMVrUmzu5mGGkxK08bWEXF7a1DEvtVJs6nppIlFJc2SnrU14AOrIrB28ogm58JjAl5BOQawOXD5dfSk7MaAA82pVHoIqEu0FxA8BOKU+RGTihRU+ptw1j4bsAJYiPbSX6i71gfPvwHPYamM0bfI4CmlsUUR3KvCG24rB6FNPcRBhM3jDuv8ae2kC33w9hEq8qNB55uw51vK7hyXoAa+U7IqP1y6nBdlN25gkxEA8yrsl1678cspeXr+3ciRyqoRgj9RD/ONbJhhxFvt1cLBh+qwK2eqISfBb06eRnNeC71oBokDm3zyCnkOtMDGl7IvnMfZfEPFCfg5QgJVk1msPpRvQxmEsrX9MQRyFVzgy2CWNIb7c+jPapyrNwoUbANlN8adU1m6yOuoX7F49x+OjiG2se0EJ6nafeKUXw/+hiJZvELUYgzKUtMAZVTNZfT8jjb58j8GVtuS+6TM2AutbejaCV84ZK58E2CRJqhmjQibEUO6KPdD7oTlEkFy52Y1uOOBXgYpqMzufNPmfdqqqSM4dU70PO8ogyKGiLAIxCetMjjm6FCMEA3Kc8K0Ig7/XtFm9By6VxTJK1Mg36TlHaZKP6VzVLXMtesJECAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Session key
            context.setApiKey("6bc4157dbowkdd409118e0978dc6991a");
            // Use ssl/https
            context.setSsl(true);
            // Method type (can be GET/POST/PUT)
            context.setMethodType(APIMethodTypes.POST);
            // API address
            context.setAddress("openapi.m-pesa.com");
            // API Port
            context.setPort(443);
            // API Path
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/c2bPayment/singleStage/");

            // Parameters can be added to the call as well that on POST will be in JSON format and on GET will be URL
            // parameters
            // context.addParameter("key", "value");
            context.addParameter("input_Amount", "10");
            context.addParameter("input_Country", "GHA");
            context.addParameter("input_Currency", "GHS");
            context.addParameter("input_CustomerMSISDN", "000000000001");
            context.addParameter("input_ServiceProviderCode", "000000");
            context.addParameter("input_ThirdPartyConversationID", "asv02e5958774f7ba228d83d0d689761");
            context.addParameter("input_TransactionReference", "T1234C");
            context.addParameter("input_PurchasedItemsDesc", "Shoes");
            
            // Add/update headers
            context.addHeader("Origin", "*");

            // Create a request object
            APIRequest request = new APIRequest(context);
            
            // Do the API call and put result in a response packet
            APIResponse response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
              throw new Exception("API call failed to get result. Please check.");
            }

            // Display results
            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 
        }
    }
}
C2B Single Stage Combined
Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below API section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {    
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArv9yxA69XQKBo24BaF/D+fvlqmGdYjqLQ5WtNBb5tquqGvAvG3WMFETVUSow/LizQalxj2ElMVrUmzu5mGGkxK08bWEXF7a1DEvtVJs6nppIlFJc2SnrU14AOrIrB28ogm58JjAl5BOQawOXD5dfSk7MaAA82pVHoIqEu0FxA8BOKU+RGTihRU+ptw1j4bsAJYiPbSX6i71gfPvwHPYamM0bfI4CmlsUUR3KvCG24rB6FNPcRBhM3jDuv8ae2kC33w9hEq8qNB55uw51vK7hyXoAa+U7IqP1y6nBdlN25gkxEA8yrsl1678cspeXr+3ciRyqoRgj9RD/ONbJhhxFvt1cLBh+qwK2eqISfBb06eRnNeC71oBokDm3zyCnkOtMDGl7IvnMfZfEPFCfg5QgJVk1msPpRvQxmEsrX9MQRyFVzgy2CWNIb7c+jPapyrNwoUbANlN8adU1m6yOuoX7F49x+OjiG2se0EJ6nafeKUXw/+hiJZvELUYgzKUtMAZVTNZfT8jjb58j8GVtuS+6TM2AutbejaCV84ZK58E2CRJqhmjQibEUO6KPdD7oTlEkFy52Y1uOOBXgYpqMzufNPmfdqqqSM4dU70PO8ogyKGiLAIxCetMjjm6FCMEA3Kc8K0Ig7/XtFm9By6VxTJK1Mg36TlHaZKP6VzVLXMtesJECAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Api key
            context.setApiKey("6bc4157dbee34d409118e0978dc6dd17");
            // Use ssl/https
            context.setSsl(true);
            // Method type (can be GET/POST/PUT)
            context.setMethodType(APIMethodTypes.GET);
            // API address
            context.setAddress("openapi.m-pesa.com");
            // API Port
            context.setPort(443);
            // API Path
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/getSession/");

            // Parameters can be added to the call as well that on POST will be in JSON format and on GET will be URL
            // parameters
            // context.addParameter("key", "value");

            // Add/update headers
            context.addHeader("Origin", "*");

            // Create a request object
            APIRequest request = new APIRequest(context);
            
            // Do the API call and put result in a response packet
            APIResponse response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("SessionKey call failed to get result. Please check.");
            }

            // Display results
            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 

            String sessionId = response.getBody()["output_SessionID"];

            // The above call issued a sessionID which will be used as the API key in calls that needs the sessionID
            context = new APIContext();
            context.setPublicKey(publicKey);
            context.setApiKey(sessionId);
            context.setSsl(true);
            context.setMethodType(APIMethodTypes.POST);
            context.setAddress("openapi.m-pesa.com");
            context.setPort(443);
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/c2bPayment/singleStage/");

            context.addParameter("input_Amount", "10");
            context.addParameter("input_Country", "GHA");
            context.addParameter("input_Currency", "GHS");
            context.addParameter("input_CustomerMSISDN", "000000000001");
            context.addParameter("input_ServiceProviderCode", "000000");
            context.addParameter("input_ThirdPartyConversationID", "asv02e5958774f7ba228d83d0d689761");
            context.addParameter("input_TransactionReference", "T1234C");
            context.addParameter("input_PurchasedItemsDesc", "Shoes");
            
            context.addHeader("Origin", "*");

            request = new APIRequest(context);
            
            // SessionID can take up to 30 seconds to become 'live' in the system and will be invalid until it is
            Thread.Sleep(30 * 1000);
            
            response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }

            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 
        }
    }
}
About
|
Forum
|
Contact Support
|
Language:

B2C Single Stage
API Description
The B2C API Call is used as a standard business-to-customer funds disbursement. Funds from the business account’s wallet will be deducted and paid to the mobile money wallet of the customer. Use cases for the B2C includes:
•	Salary payments 
•	Funds transfers from business
•	Charity pay-out
Make REST API Call
API Endpoint
Use the following URL as the API service endpoint for the chosen environment:

Site	SSL	HTTP Method	Host	Port	Context
Sandbox	True	POST	openapi.m-pesa.com	443	/sandbox/ipg/v2/[market]/b2cPayment/
OpenAPI	True	POST	openapi.m-pesa.com	443	/openapi/ipg/v2/[market]/b2cPayment/
Replace the [market] and [currency] parameters with the appropriate values from the below table:
API Markets
Description	URL Context Value	input_Country Value	input_Currency Value
Vodafone Ghana	vodafoneGHA	GHA	GHS
Vodacom Tanzania	vodacomTZN	TZN	TZS
Vodacom Lesotho	vodacomLES	LES	LSL
Vodacom DR Congo	vodacomDRC	DRC	USD
Vodacom Mozambique	vodacomMOZ	MOZ	MZN
API Setup Example
POST https://openapi.m-pesa.com/sandbox/ipg/v2/vodafoneGHA/b2cPayment/
API Header
The header of the API call makes use of the Session Key received from the Generate SessionKey API call when authorising and authenticating the calling party.

Header Name	Header Value	Header Description
Content-Type	application/json	The content-type of the API
Authorization	Bearer [encrypted-SessionKey]	Bearer token authorization is used. The encrypted SessionKey needs to be used.
Origin	*	 Used to limit the origin of the API caller to specific systems. Use the domain name or IP address. Should match the value(s) defined in your Application.
Content-Type: application/json
Authorization: Bearer K2sf0ne61AocJqWxO3kTHMBmLl0fQyBQWV7GfH3z1kMxV qMCB7sMXn+CKigIPIawHoNr2IrGdjBdFugyHNxRnGkrfSDkC9PFBhR/D9ePdw15jgggnG8FItGpw4TEwECgzk0sEmYmKaB9K6lgvs4rs7TMPpTom7uX72+tZ+qMqRVt7LrGsngBrkXjbOxc19fkImVHjehzjVCOSOsROsx4nRlM9wtl4KSLgKCBzmLePRmwu/IOCF3NrIQLVYYqUDDSgYbHURk1L6d4kxJffFM/wa2BPoeuG59gcgldyEaQ5Sv5VnaGKDh1XTBrvKS+J9Efwg7s1CWLQxhtYdr+Z2eorC1QjbxwW+LbiIChiu/wSVRY6/9p41QbXEsBoIEESPD8JIfxGM/HFRhRmiVN2LGiUX8+5O1piXq4JRrBz+VrQ1HXpDKQj4+MAipVPqL4jsQhbbOQ/OvZa3uA18oA9FXpsC41siVApduLOlK8OxJPvygtB1gMlSisOHLWiZGWjY7uEu9CvW9LPlcz4MzHhIg6/Vemj5KyT/Mcn/874K8LgZG8eTnzBac3nvrsl2k5BnMUa/4JoBUOjqrJUe4cckYPIjw2sw9rUFqfOqh9LiG76dCFvgBOKqZU3ZrEGT7/yE+VlMkHV+rON26+XWIet5nGZobPXZFm9gAgIkAav3b//X4=
Origin: 127.0.0.1
API Requests
The body of the API call is made up of the following parameters and values:

Parameter Name	Parameter Description	Parameter Mandatory	Parameter Regex Validation	Parameter Possible Values
input_Amount	The transaction amount. This amount will be moved from the organization's account to the customer's account.	True	^\d*\.?\d+$	10.00
input_CustomerMSISDN	The MSISDN of the customer where funds will be credited to.	True	^[0-9]{12,14}$	254707161122
input_Country	The country of the mobile money platform where the transaction needs happen on.	True	N/A	GHA
input_Currency	The currency in which the transaction should take place.	True	^[a-zA-Z]{1,3}$	GHS
input_ServiceProviderCode	The shortcode of the organization where funds will be creditted to.	True	^([0-9A-Za-z]{4,12})$	ORG001
input_TransactionReference	The customer's transaction reference	True	^[0-9a-zA-Z \w+]{1,20}$	T12344C
input_ThirdPartyConversationID	The third party's transaction reference on their system.	True	^[0-9a-zA-Z \w+]{1,40}$	1e9b774d1da34af78412a498cbc28f5e
input_PaymentItemsDesc	Description of payment items	True	^[0-9a-zA-Z \w+]{1,256}$	Salary payment
API Responses
The response back to the application can either be synchronous or asynchronous, depending the business use case. Synchronous responses will make use of the same session to return the results. For asynchronous responses, the user will need to build a listener to receive the asynchronous response once the transaction has finalised on the payment system.
Synchronous Response
Parameter Name	Parameter Description	Parameter Possible Values
output_ResponseCode	The result code for the transaction.	INS-0
output_ResponseDesc	The result description for the transaction.	Request processed successfully
output_TransactionID	The transaction identifier that gets generated on the Mobile Money platform. This is used to query transactions on the Mobile Money Platform.	hv9ahxcg4ccv
output_ConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
Asynchronous Responses
Once the transaction is initiated, the OpenAPI will respond synchronously with the following information before the session is closed. 

Parameter Name	Parameter Description	Parameter Possible Values
output_ResponseCode	The result code for the transaction.	INS-0
output_ResponseDesc	The result description for the transaction.	Request processed successfully
output_ConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e


The Conversation ID can be used in a Query Transaction Status call to determine the status of the process flow. Once the transaction has been completed, the OpenAPI will provide the result of the transaction in an asynchronous message to the value listed in the Response URL of the request parameter in the body. Please note that the developed application will need to have a separate listener to receive the result. 

Parameter Name	Parameter Description	Parameter Possible Values
input_OriginalConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
input_TransactionID	The transaction identifier that gets generated on the Mobile Money platform. This is used to query transactions on the Mobile Money Platform.	hv9ahxcg4ccv
input_ResultCode	The result code for the transaction.	INS-0
input_ResultDesc	The result description for the transaction.	Request processed successfully
input_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e


It is expected that the listener confirms receipt of the result by responding the below content which closes out the session:
Parameter Name	Parameter Description	Parameter Possible Values
output_OriginalConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ResponseCode	The result code for the transaction.	0
output_ResponseDesc	The result description for the transaction..	 Successfully Accepted Result 
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
Response Codes
HTTP StatusCode	Response Code	Response Description
201	INS-0	Request processed successfully
400	INS-1	Internal Error
401	INS-6	Transaction Failed
408	INS-9	Request timeout
409	INS-10	Duplicate Transaction
400	INS-13	Invalid Shortcode Used
400	INS-15	Invalid Amount Used
400	INS-17	Invalid Transaction Reference. Length Should Be Between 1 and 20.
400	INS-20	Not All Parameters Provided. Please try again.
400	INS-21	Parameter validations failed. Please try again.
400	INS-26	Invalid Currency Used
400	INS-28	Invalid ThirdPartyConversationID Used
400	INS-31	Invalid Payment Items Description Used
400	INS-990	Customer Transaction Value Limit Breached
400	INS-991	Customer Transaction Count Limit Breached
400	INS-992	Multiple Limits Breached
400	INS-993	Organization Transaction Count Limit Breached
400	INS-994	Organization Transaction Value Limit Breached
400	INS-995	API Single Transaction Limit Breached
400	INS-996	API Being Used Outside Of Usage Time
400	INS-997	API Not Enabled
400	INS-998	Invalid Market
422	INS-2006	Insufficient balance
400	INS-2051	MSISDN invalid.
Sample Packets
Sample request and response packets.

If you want to make use of a end to end synchronous flow, use the following tabs:
Request (Thirdparty -> OpenAPI)
Sync Flow Response (OpenAPI -> Thirdparty)

If you want to make use of a end to end asynchronous flow, use the following tabs:
Request (Thirdparty -> OpenAPI)
Async Flow Response (OpenAPI -> Thirdparty)
OpenAPI Async Flow Request (OpenAPI -> Thirdparty)
ThirdParty Async Flow Response (Thirdparty -> OpenAPI)
{
  "input_Amount": "10", 
  "input_Country": "GHA", 
  "input_Currency": "GHS", 
  "input_CustomerMSISDN": "000000000001", 
  "input_ServiceProviderCode": "000000", 
  "input_ThirdPartyConversationID": "asv02e5958774f7ba228d83d0d689761", 
  "input_TransactionReference": "T12344C",
  "input_PaymentItemsDesc": "Salary payment"
}
Sample Code Snippets
Libraries Download
Libraries to assist with integrations.
B2C Single Stage
This API should always be used in conjunction with a valid SessionKey.
Please refer to the Generate SessionKey API documentation page to see how to generate a SessionKey or see the below combined API code snippet where the Generate SessionKey API is combined with the B2C Single Stage API.


Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below API section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {    
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArv9yxA69XQKBo24BaF/D+fvlqmGdYjqLQ5WtNBb5tquqGvAvG3WMFETVUSow/LizQalxj2ElMVrUmzu5mGGkxK08bWEXF7a1DEvtVJs6nppIlFJc2SnrU14AOrIrB28ogm58JjAl5BOQawOXD5dfSk7MaAA82pVHoIqEu0FxA8BOKU+RGTihRU+ptw1j4bsAJYiPbSX6i71gfPvwHPYamM0bfI4CmlsUUR3KvCG24rB6FNPcRBhM3jDuv8ae2kC33w9hEq8qNB55uw51vK7hyXoAa+U7IqP1y6nBdlN25gkxEA8yrsl1678cspeXr+3ciRyqoRgj9RD/ONbJhhxFvt1cLBh+qwK2eqISfBb06eRnNeC71oBokDm3zyCnkOtMDGl7IvnMfZfEPFCfg5QgJVk1msPpRvQxmEsrX9MQRyFVzgy2CWNIb7c+jPapyrNwoUbANlN8adU1m6yOuoX7F49x+OjiG2se0EJ6nafeKUXw/+hiJZvELUYgzKUtMAZVTNZfT8jjb58j8GVtuS+6TM2AutbejaCV84ZK58E2CRJqhmjQibEUO6KPdD7oTlEkFy52Y1uOOBXgYpqMzufNPmfdqqqSM4dU70PO8ogyKGiLAIxCetMjjm6FCMEA3Kc8K0Ig7/XtFm9By6VxTJK1Mg36TlHaZKP6VzVLXMtesJECAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Session key
            context.setApiKey("6bc4157dbowkdd409118e0978dc6991a");
            // Use ssl/https
            context.setSsl(true);
            // Method type (can be GET/POST/PUT)
            context.setMethodType(APIMethodTypes.POST);
            // API address
            context.setAddress("openapi.m-pesa.com");
            // API Port
            context.setPort(443);
            // API Path
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/b2cPayment/");

            // Parameters can be added to the call as well that on POST will be in JSON format and on GET will be URL
            // parameters
            // context.addParameter("key", "value");
            context.addParameter("input_Amount", "10");
            context.addParameter("input_Country", "GHA");
            context.addParameter("input_Currency", "GHS");
            context.addParameter("input_CustomerMSISDN", "000000000001");
            context.addParameter("input_ServiceProviderCode", "000000");
            context.addParameter("input_ThirdPartyConversationID", "asv02e5958774f7ba228d83d0d689761");
            context.addParameter("input_TransactionReference", "T1234C");
            context.addParameter("input_PaymentItemsDesc", "Salary payment");
            
            // Add/update headers
            context.addHeader("Origin", "*");

            // Create a request object
            APIRequest request = new APIRequest(context);
            
            // Do the API call and put result in a response packet
            APIResponse response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("API call failed to get result. Please check.");
            }

            // Display results
            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 
        }
    }
}
B2C Single Stage Combined
Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below API section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {    
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArv9yxA69XQKBo24BaF/D+fvlqmGdYjqLQ5WtNBb5tquqGvAvG3WMFETVUSow/LizQalxj2ElMVrUmzu5mGGkxK08bWEXF7a1DEvtVJs6nppIlFJc2SnrU14AOrIrB28ogm58JjAl5BOQawOXD5dfSk7MaAA82pVHoIqEu0FxA8BOKU+RGTihRU+ptw1j4bsAJYiPbSX6i71gfPvwHPYamM0bfI4CmlsUUR3KvCG24rB6FNPcRBhM3jDuv8ae2kC33w9hEq8qNB55uw51vK7hyXoAa+U7IqP1y6nBdlN25gkxEA8yrsl1678cspeXr+3ciRyqoRgj9RD/ONbJhhxFvt1cLBh+qwK2eqISfBb06eRnNeC71oBokDm3zyCnkOtMDGl7IvnMfZfEPFCfg5QgJVk1msPpRvQxmEsrX9MQRyFVzgy2CWNIb7c+jPapyrNwoUbANlN8adU1m6yOuoX7F49x+OjiG2se0EJ6nafeKUXw/+hiJZvELUYgzKUtMAZVTNZfT8jjb58j8GVtuS+6TM2AutbejaCV84ZK58E2CRJqhmjQibEUO6KPdD7oTlEkFy52Y1uOOBXgYpqMzufNPmfdqqqSM4dU70PO8ogyKGiLAIxCetMjjm6FCMEA3Kc8K0Ig7/XtFm9By6VxTJK1Mg36TlHaZKP6VzVLXMtesJECAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Api key
            context.setApiKey("6bc4157dbee34d409118e0978dc6dd17");
            // Use ssl/https
            context.setSsl(true);
            // Method type (can be GET/POST/PUT)
            context.setMethodType(APIMethodTypes.GET);
            // API address
            context.setAddress("openapi.m-pesa.com");
            // API Port
            context.setPort(443);
            // API Path
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/getSession/");

            // Parameters can be added to the call as well that on POST will be in JSON format and on GET will be URL
            // parameters
            // context.addParameter("key", "value");

            // Add/update headers
            context.addHeader("Origin", "*");

            // Create a request object
            APIRequest request = new APIRequest(context);
            
            // Do the API call and put result in a response packet
            APIResponse response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("SessionKey call failed to get result. Please check.");
            }

            // Display results
            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 

            String sessionId = response.getBody()["output_SessionID"];

            // The above call issued a sessionID which will be used as the API key in calls that needs the sessionID
            context = new APIContext();
            context.setPublicKey(publicKey);
            context.setApiKey(sessionId);
            context.setSsl(true);
            context.setMethodType(APIMethodTypes.POST);
            context.setAddress("openapi.m-pesa.com");
            context.setPort(443);
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/b2cPayment/");

            context.addParameter("input_Amount", "10");
            context.addParameter("input_Country", "GHA");
            context.addParameter("input_Currency", "GHS");
            context.addParameter("input_CustomerMSISDN", "000000000001");
            context.addParameter("input_ServiceProviderCode", "000000");
            context.addParameter("input_ThirdPartyConversationID", "asv02e5958774f7ba228d83d0d689761");
            context.addParameter("input_TransactionReference", "T1234C");
            context.addParameter("input_PaymentItemsDesc", "Salary payment");
            
            context.addHeader("Origin", "*");

            request = new APIRequest(context);

            // SessionID can take up to 30 seconds to become 'live' in the system and will be invalid until it is
            Thread.Sleep(30 * 1000);
            
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("API call failed to get result. Please check.");
            }  

            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 
        }
    }
}

B2B Single Stage
API Description
The B2B API Call is used for business-to-business transactions. Funds from the business’ mobile money wallet will be deducted and transferred to the mobile money wallet of the other business. Use cases for the B2C includes: • Stock purchases • Bill payment • Ad-hoc payment
Make API REST Call
API Endpoint
Use the following URL as the API service endpoint for the chosen environment:

Site	SSL	HTTP Method	Host	Port	Context
Sandbox	True	POST	openapi.m-pesa.com	443	/sandbox/ipg/v2/[market]/b2bPayment/
OpenAPI	True	POST	openapi.m-pesa.com	443	/openapi/ipg/v2/[market]/b2bPayment/
Replace the [market] and [currency] parameters with the appropriate values from the below table:
API Markets
Description	URL Context Value	input_Country Value	input_Currency Value
Vodafone Ghana	vodafoneGHA	GHA	GHS
Vodacom Tanzania	vodacomTZN	TZN	TZS
Vodacom Lesotho	vodacomLES	LES	LSL
Vodacom DR Congo	vodacomDRC	DRC	USD
Vodacom Mozambique	vodacomMOZ	MOZ	MZN
API Setup Example
POST https://openapi.m-pesa.com/sandbox/ipg/v2/vodafoneGHA/b2bPayment/
API Header
Header Name	Header Value	Header Description
Content-Type	application/json	The content-type of the API
Authorization	Bearer [encrypted-SessionKey]	Bearer token authorization is used. The encrypted SessionKey needs to be used.
Origin	*	Used to limit the origin of the API caller to specific systems. Use the domain name or IP address. Should match the value(s) defined in your Application.
Content-Type: application/json
Authorization: Bearer K2sf0ne61AocJqWxO3kTHMBmLl0fQyBQWV7GfH3z1kMxV qMCB7sMXn+CKigIPIawHoNr2IrGdjBdFugyHNxRnGkrfSDkC9PFBhR/D9ePdw15jgggnG8FItGpw4TEwECgzk0sEmYmKaB9K6lgvs4rs7TMPpTom7uX72+tZ+qMqRVt7LrGsngBrkXjbOxc19fkImVHjehzjVCOSOsROsx4nRlM9wtl4KSLgKCBzmLePRmwu/IOCF3NrIQLVYYqUDDSgYbHURk1L6d4kxJffFM/wa2BPoeuG59gcgldyEaQ5Sv5VnaGKDh1XTBrvKS+J9Efwg7s1CWLQxhtYdr+Z2eorC1QjbxwW+LbiIChiu/wSVRY6/9p41QbXEsBoIEESPD8JIfxGM/HFRhRmiVN2LGiUX8+5O1piXq4JRrBz+VrQ1HXpDKQj4+MAipVPqL4jsQhbbOQ/OvZa3uA18oA9FXpsC41siVApduLOlK8OxJPvygtB1gMlSisOHLWiZGWjY7uEu9CvW9LPlcz4MzHhIg6/Vemj5KyT/Mcn/874K8LgZG8eTnzBac3nvrsl2k5BnMUa/4JoBUOjqrJUe4cckYPIjw2sw9rUFqfOqh9LiG76dCFvgBOKqZU3ZrEGT7/yE+VlMkHV+rON26+XWIet5nGZobPXZFm9gAgIkAav3b//X4=
Origin: 127.0.0.1
API Requests
The body of the API call is made up of the following parameters and values:
Parameter Name	Parameter Description	Parameter Mandatory	Parameter Regex Validation	Parameter Possible Values
input_Amount	The transaction amount. This amount will be moved from the organization's account to the customer's account.	True	^\d*\.?\d+$	10.00
input_ReceiverPartyCode	The shortcode of the organization where funds will be credited to.	True	^([0-9A-Za-z]{4,12})$	ORG001
input_Country	The country of the mobile money platform where the transaction needs happen on.	True	N/A	GHA
input_Currency	The currency in which the transaction should take place.	True	^[a-zA-Z]{1,3}$	GHS
input_PrimaryPartyCode	The shortcode of the organization where funds will be debitted from.	True	^([0-9A-Za-z]{4,12})$	ORG002
input_TransactionReference	The customer's transaction reference	True	^[0-9a-zA-Z \w+]{1,20}$	T12344C
input_ThirdPartyConversationID	The third party's transaction reference on their system.	True	^[0-9a-zA-Z \w+]{1,40}$	1e9b774d1da34af78412a498cbc28f5e
input_PurchasedItemsDesc	Description of purchased items	True	^[0-9a-zA-Z \w+]{1,256}$	Handbag, Black shoes
API Responses
The response back to the application can either be synchronous or asynchronous, depending the business use case. Synchronous responses will make use of the same session to return the results. For asynchronous responses, the user will need to build a listener to receive the asynchronous response once the transaction has finalised on the payment system.
Synchronous Responses
Parameter Name	Parameter Description	Parameter Possible Values
output_ResponseCode	The result code for the transaction.	INS-0
output_ResponseDesc	The result description for the transaction.	Request processed successfully
output_TransactionID	The transaction identifier that gets generated on the Mobile Money platform. This is used to query transactions on the Mobile Money Platform.	hv9ahxcg4ccv
output_ConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
Asynchronous Responses
Once the transaction is initiated, the OpenAPI will respond synchronously with the following information before the session is closed. 

Parameter Name	Parameter Description	Parameter Possible Values
output_ResponseCode	The result code for the transaction.	INS-0
output_ResponseDesc	The result description for the transaction.	Request processed successfully
output_ConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e


The Conversation ID can be used in a Query Transaction Status call to determine the status of the process flow. Once the transaction has been completed, the OpenAPI will provide the result of the transaction in an asynchronous message to the value listed in the Response URL of the request parameter in the body. Please note that the developed application will need to have a separate listener to receive the result. 

Parameter Name	Parameter Description	Parameter Possible Values
input_OriginalConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
input_TransactionID	The transaction identifier that gets generated on the Mobile Money platform. This is used to query transactions on the Mobile Money Platform.	hv9ahxcg4ccv
input_ResultCode	The result code for the transaction.	INS-0
input_ResultDesc	The result description for the transaction.	Request processed successfully
input_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e


It is expected that the listener confirms receipt of the result by responding the below content which closes out the session:
Parameter Name	Parameter Description	Parameter Possible Values
output_OriginalConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ResponseCode	The result code for the transaction.	0
output_ResponseDesc	The result description for the transaction.	 Successfully Accepted Result 
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
Response Codes
HTTP StatusCode	Response Code	Response Description
201	INS-0	Request processed successfully
400	INS-1	Internal Error
401	INS-6	Transaction Failed
408	INS-9	Request timeout
409	INS-10	Duplicate Transaction
400	INS-13	Invalid Shortcode Used
400	INS-15	Invalid Amount Used
400	INS-17	Invalid Transaction Reference. Length Should Be Between 1 and 20.
400	INS-20	Not All Parameters Provided. Please try again.
400	INS-21	Parameter validations failed. Please try again.
400	INS-26	Invalid Currency Used
400	INS-28	Invalid ThirdPartyConversationID Used
400	INS-30	Invalid Purchased Items Description Used
400	INS-990	Customer Transaction Value Limit Breached
400	INS-991	Customer Transaction Count Limit Breached
400	INS-992	Multiple Limits Breached
400	INS-993	Organization Transaction Count Limit Breached
400	INS-994	Organization Transaction Value Limit Breached
400	INS-995	API Single Transaction Limit Breached
400	INS-996	API Being Used Outside Of Usage Time
400	INS-997	API Not Enabled
400	INS-998	Invalid Market
422	INS-2006	Insufficient balance
Sample Packets
Sample request and response packets.

If you want to make use of a end to end synchronous flow, use the following tabs:
Request (Thirdparty -> OpenAPI)
Sync Flow Response (OpenAPI -> Thirdparty)

If you want to make use of a end to end asynchronous flow, use the following tabs:
Request (Thirdparty -> OpenAPI)
Async Flow Response (OpenAPI -> Thirdparty)
OpenAPI Async Flow Request (OpenAPI -> Thirdparty)
ThirdParty Async Flow Response (Thirdparty -> OpenAPI)
{
  "input_Amount": "10", 
  "input_Country": "GHA", 
  "input_Currency": "GHS", 
  "input_PrimaryPartyCode": "000000", 
  "input_ReceiverPartyCode": "000001", 
  "input_ThirdPartyConversationID": "asv02e5958774f7ba228d83d0d689761", 
  "input_TransactionReference": "T12344C",
  "input_PurchasedItemsDesc": "Shoes"
}
Sample Code Snippets
Libraries Download
Libraries to assist with integrations.
B2B Single Stage
This API should always be used in conjunction with a valid SessionKey.
Please refer to the Generate SessionKey API documentation page to see how to generate a SessionKey or see the below combined API code snippet where the Generate SessionKey API is combined with the B2B Single Stage API.


Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below API section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {    
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArv9yxA69XQKBo24BaF/D+fvlqmGdYjqLQ5WtNBb5tquqGvAvG3WMFETVUSow/LizQalxj2ElMVrUmzu5mGGkxK08bWEXF7a1DEvtVJs6nppIlFJc2SnrU14AOrIrB28ogm58JjAl5BOQawOXD5dfSk7MaAA82pVHoIqEu0FxA8BOKU+RGTihRU+ptw1j4bsAJYiPbSX6i71gfPvwHPYamM0bfI4CmlsUUR3KvCG24rB6FNPcRBhM3jDuv8ae2kC33w9hEq8qNB55uw51vK7hyXoAa+U7IqP1y6nBdlN25gkxEA8yrsl1678cspeXr+3ciRyqoRgj9RD/ONbJhhxFvt1cLBh+qwK2eqISfBb06eRnNeC71oBokDm3zyCnkOtMDGl7IvnMfZfEPFCfg5QgJVk1msPpRvQxmEsrX9MQRyFVzgy2CWNIb7c+jPapyrNwoUbANlN8adU1m6yOuoX7F49x+OjiG2se0EJ6nafeKUXw/+hiJZvELUYgzKUtMAZVTNZfT8jjb58j8GVtuS+6TM2AutbejaCV84ZK58E2CRJqhmjQibEUO6KPdD7oTlEkFy52Y1uOOBXgYpqMzufNPmfdqqqSM4dU70PO8ogyKGiLAIxCetMjjm6FCMEA3Kc8K0Ig7/XtFm9By6VxTJK1Mg36TlHaZKP6VzVLXMtesJECAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Session key
            context.setApiKey("6bc4157dbowkdd409118e0978dc6991a");
            // Use ssl/https
            context.setSsl(true);
            // Method type (can be GET/POST/PUT)
            context.setMethodType(APIMethodTypes.POST);
            // API address
            context.setAddress("openapi.m-pesa.com");
            // API Port
            context.setPort(443);
            // API Path
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/b2bPayment/");

            // Parameters can be added to the call as well that on POST will be in JSON format and on GET will be URL
            // parameters
            // context.addParameter("key", "value");
            context.addParameter("input_Amount", "10");
            context.addParameter("input_Country", "GHA");
            context.addParameter("input_Currency", "GHS");
            context.addParameter("input_ReceiverPartyCode", "000001");
            context.addParameter("input_PrimaryPartyCode", "000000");
            context.addParameter("input_ThirdPartyConversationID", "asv02e5958774f7ba228d83d0d689761");
            context.addParameter("input_TransactionReference", "T1234C");
            context.addParameter("input_PurchasedItemsDesc", "Shoes");
            
            // Add/update headers
            context.addHeader("Origin", "*");

            // Create a request object
            APIRequest request = new APIRequest(context);
            
            // Do the API call and put result in a response packet
            APIResponse response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("API call failed to get result. Please check.");
            }

            // Display results
            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 
        }
    }
}
B2B Single Stage Combined
Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below API section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {    
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArv9yxA69XQKBo24BaF/D+fvlqmGdYjqLQ5WtNBb5tquqGvAvG3WMFETVUSow/LizQalxj2ElMVrUmzu5mGGkxK08bWEXF7a1DEvtVJs6nppIlFJc2SnrU14AOrIrB28ogm58JjAl5BOQawOXD5dfSk7MaAA82pVHoIqEu0FxA8BOKU+RGTihRU+ptw1j4bsAJYiPbSX6i71gfPvwHPYamM0bfI4CmlsUUR3KvCG24rB6FNPcRBhM3jDuv8ae2kC33w9hEq8qNB55uw51vK7hyXoAa+U7IqP1y6nBdlN25gkxEA8yrsl1678cspeXr+3ciRyqoRgj9RD/ONbJhhxFvt1cLBh+qwK2eqISfBb06eRnNeC71oBokDm3zyCnkOtMDGl7IvnMfZfEPFCfg5QgJVk1msPpRvQxmEsrX9MQRyFVzgy2CWNIb7c+jPapyrNwoUbANlN8adU1m6yOuoX7F49x+OjiG2se0EJ6nafeKUXw/+hiJZvELUYgzKUtMAZVTNZfT8jjb58j8GVtuS+6TM2AutbejaCV84ZK58E2CRJqhmjQibEUO6KPdD7oTlEkFy52Y1uOOBXgYpqMzufNPmfdqqqSM4dU70PO8ogyKGiLAIxCetMjjm6FCMEA3Kc8K0Ig7/XtFm9By6VxTJK1Mg36TlHaZKP6VzVLXMtesJECAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Api key
            context.setApiKey("6bc4157dbee34d409118e0978dc6dd17");
            // Use ssl/https
            context.setSsl(true);
            // Method type (can be GET/POST/PUT)
            context.setMethodType(APIMethodTypes.GET);
            // API address
            context.setAddress("openapi.m-pesa.com");
            // API Port
            context.setPort(443);
            // API Path
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/getSession/");

            // Parameters can be added to the call as well that on POST will be in JSON format and on GET will be URL
            // parameters
            // context.addParameter("key", "value");

            // Add/update headers
            context.addHeader("Origin", "*");

            // Create a request object
            APIRequest request = new APIRequest(context);
            
            // Do the API call and put result in a response packet
            APIResponse response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("SessionKey call failed to get result. Please check.");
            }

            // Display results
            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 

            String sessionId = response.getBody()["output_SessionID"];

            // The above call issued a sessionID which will be used as the API key in calls that needs the sessionID
            context = new APIContext();
            context.setPublicKey(publicKey);
            context.setApiKey(sessionId);
            context.setSsl(true);
            context.setMethodType(APIMethodTypes.POST);
            context.setAddress("openapi.m-pesa.com");
            context.setPort(443);
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/b2bPayment/");

            context.addParameter("input_Amount", "10");
            context.addParameter("input_Country", "GHA");
            context.addParameter("input_Currency", "GHS");
            context.addParameter("input_ReceiverPartyCode", "000001");
            context.addParameter("input_PrimaryPartyCode", "000000");
            context.addParameter("input_ThirdPartyConversationID", "asv02e5958774f7ba228d83d0d689761");
            context.addParameter("input_TransactionReference", "T1234C");
            context.addParameter("input_PurchasedItemsDesc", "Shoes");
            
            context.addHeader("Origin", "*");

            request = new APIRequest(context);

            // SessionID can take up to 30 seconds to become 'live' in the system and will be invalid until it is
            Thread.Sleep(30 * 1000);
            
            response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("API call failed to get result. Please check.");
            } 

            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 
        }
    }
}

Query Transaction Status

API Description
The Query Transaction Status API call is used to query the status of the transaction that has been initiated.
Make REST API Call
API Endpoint
Use the following URL as the API service endpoint for the chosen environment:

Site	SSL	HTTP Method	Host	Port	Context
Sandbox	True	GET	openapi.m-pesa.com	443	/sandbox/ipg/v2/[market]/queryTransactionStatus/
OpenAPI	True	GET	openapi.m-pesa.com	443	/openapi/ipg/v2/[market]/queryTransactionStatus/
Replace the [market] parameter with the appropriate values from the below tables:
API Markets
Description	URL Context Value	input_Country Value	input_Currency Value
Vodafone Ghana	vodafoneGHA	GHA	GHS
Vodacom Tanzania	vodacomTZN	TZN	TZS
Vodacom Lesotho	vodacomLES	LES	LSL
Vodacom DR Congo	vodacomDRC	DRC	USD
Vodacom Mozambique	vodacomMOZ	MOZ	MZN
API Setup Example
GET https://openapi.m-pesa.com/sandbox/ipg/v2/vodafoneGHA/queryTransactionStatus/
API Header
The header of the API call makes use of the Session Key received from the Generate SessionKey API call when authorising and authenticating the calling party.

Header Name	Header Value	Header Description
Content-Type	application/json	The content-type of the API
Authorization	Bearer [encrypted-SessionKey]	Bearer token authorization is used. The encrypted SessionKey needs to be used.
Origin	*	Used to limit the origin of the API caller to specific systems. Use the domain name or IP address. Should match the value(s) defined in your Application.
Content-Type: application/json
Authorization: Bearer K2sf0ne61AocJqWxO3kTHMBmLl0fQyBQWV7GfH3z1kMxV qMCB7sMXn+CKigIPIawHoNr2IrGdjBdFugyHNxRnGkrfSDkC9PFBhR/D9ePdw15jgggnG8FItGpw4TEwECgzk0sEmYmKaB9K6lgvs4rs7TMPpTom7uX72+tZ+qMqRVt7LrGsngBrkXjbOxc19fkImVHjehzjVCOSOsROsx4nRlM9wtl4KSLgKCBzmLePRmwu/IOCF3NrIQLVYYqUDDSgYbHURk1L6d4kxJffFM/wa2BPoeuG59gcgldyEaQ5Sv5VnaGKDh1XTBrvKS+J9Efwg7s1CWLQxhtYdr+Z2eorC1QjbxwW+LbiIChiu/wSVRY6/9p41QbXEsBoIEESPD8JIfxGM/HFRhRmiVN2LGiUX8+5O1piXq4JRrBz+VrQ1HXpDKQj4+MAipVPqL4jsQhbbOQ/OvZa3uA18oA9FXpsC41siVApduLOlK8OxJPvygtB1gMlSisOHLWiZGWjY7uEu9CvW9LPlcz4MzHhIg6/Vemj5KyT/Mcn/874K8LgZG8eTnzBac3nvrsl2k5BnMUa/4JoBUOjqrJUe4cckYPIjw2sw9rUFqfOqh9LiG76dCFvgBOKqZU3ZrEGT7/yE+VlMkHV+rON26+XWIet5nGZobPXZFm9gAgIkAav3b//X4=
Origin: 127.0.0.1
API Requests
The body of the API call is made up of the following parameters and values:

Parameter Name	Parameter Description	Parameter Mandatory	Parameter Regex Validation	Parameter Possible Values
input_QueryReference	The transaction's ID being queried. This can be one of 3 values: 
1. Mobile Money's TransactionID
2. Developer's ThirdPartyConversationID
3. OpenAPI's ConversationID	True	^(?:[A-Za-z0-9]{10,20}|[A-Za-z0-9]{1,9}|[A-Za-z0-9]{21,32})$	5C1400CVRO, 1e9b774d1da34af78412a498cbc28f5e, 1e9b774d1da34af78412a498cbc28ASC
input_Country	The country of the mobile money platform where the transaction needs happen on.	True	N/A	GHA
input_ServiceProviderCode	The shortcode of the organization.	True	^([0-9A-Za-z]{4,12})$	ORG001
input_ThirdPartyConversationID	The third party's transaction reference on their system.	True	^[0-9a-zA-Z \w+]{1,40}$	1e9b774d1da34af78412a498cbc28f5e
API Responses
The response back to the application can either be synchronous or asynchronous, depending the business use case. Synchronous responses will make use of the same session to return the results. For asynchronous responses, the user will need to build a listener to receive the asynchronous response once the transaction has finalised on the payment system.
Synchronous Responses
Parameter Name	Parameter Description	Parameter Possible Values
output_ResponseCode	The result code for the transaction.	INS-0
output_ResponseDesc	The response description for the transaction.	Request processed successfully
output_ResponseTransactionStatus	The status of the transaction.	Completed
output_ConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
output_OriginalTransactionID	The Transaction ID to identify the original transaction on the Mobile Money platform.	4C123GE3
output_Reversed	Indicates if the original transaction has been reversed.	False
Asynchronous Responses
Once the transaction is initiated, the OpenAPI will respond synchronously with the following information before the session is closed. 

Parameter Name	Parameter Description	Parameter Possible Values
output_ResponseCode	The result code for the transaction.	INS-0
output_ResponseDesc	The response description for the transaction.	Request processed successfully
output_ConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e


The Conversation ID can be used in a Query Transaction Status call to determine the status of the process flow. Once the transaction has been completed, the OpenAPI will provide the result of the transaction in an asynchronous message to the value listed in the Response URL of the request parameter in the body. Please note that the developed application will need to have a separate listener to receive the result. 

Parameter Name	Parameter Description	Parameter Possible Values
input_OriginalConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
input_TransactionID	The transaction identifier that gets generated on the Mobile Money platform. This is used to query transactions on the Mobile Money Platform.	hv9ahxcg4ccv
input_ResultCode	The result code for the transaction.	INS-0
input_ResultDesc	The response description for the transaction.	Request processed successfully
input_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
input_OriginalTransactionID	The Transaction ID to identify the original transaction on the Mobile Money platform.	4C123GE3
input_Reversed	Indicates if the original transaction has been reversed.	False


It is expected that the listener confirms receipt of the result by responding the below content which closes out the session:
Parameter Name	Parameter Description	Parameter Possible Values
output_OriginalConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ResponseCode	The result code for the transaction.	0
output_ResponseDesc	The response description for the transaction.	 Successfully Accepted Result 
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
Response Codes
HTTP StatusCode	Response Code	Response Description
200	INS-0	Request processed successfully
400	INS-1	Internal Error
401	INS-6	Transaction Failed
408	INS-9	Request timeout
400	INS-13	Invalid Shortcode Used
400	INS-20	Not All Parameters Provided. Please try again.
400	INS-21	Parameter validations failed. Please try again.
400	INS-23	Transaction not found. Contact M-Pesa Support
400	INS-28	Invalid ThirdPartyConversationID Used
400	INS-996	API Being Used Outside Of Usage Time
400	INS-997	API Not Enabled
400	INS-998	Invalid Market
Sample Packets
Sample request and response packets.

If you want to make use of a end to end synchronous flow, use the following tabs:
Request (Thirdparty -> OpenAPI)
Sync Flow Response (OpenAPI -> Thirdparty)

If you want to make use of a end to end asynchronous flow, use the following tabs:
Request (Thirdparty -> OpenAPI)
Async Flow Response (OpenAPI -> Thirdparty)
OpenAPI Async Flow Request (OpenAPI -> Thirdparty)
ThirdParty Async Flow Response (Thirdparty -> OpenAPI)
?input_QueryReference=000000000000000000001&input_ServiceProviderCode=000000&input_ThirdPartyConversationID=asv02e5958774f7ba228d83d0d689761&input_Country=GHA
Sample Code Snippets
Libraries Download
Libraries to assist with integrations.
Query Transaction Status
This API should always be used in conjunction with a valid SessionKey.
Please refer to the Generate SessionKey API documentation page to see how to generate a SessionKey or see the below combined API code snippet where the Generate SessionKey API is combined with the Query Transaction Status API.


Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below API section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {    
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArv9yxA69XQKBo24BaF/D+fvlqmGdYjqLQ5WtNBb5tquqGvAvG3WMFETVUSow/LizQalxj2ElMVrUmzu5mGGkxK08bWEXF7a1DEvtVJs6nppIlFJc2SnrU14AOrIrB28ogm58JjAl5BOQawOXD5dfSk7MaAA82pVHoIqEu0FxA8BOKU+RGTihRU+ptw1j4bsAJYiPbSX6i71gfPvwHPYamM0bfI4CmlsUUR3KvCG24rB6FNPcRBhM3jDuv8ae2kC33w9hEq8qNB55uw51vK7hyXoAa+U7IqP1y6nBdlN25gkxEA8yrsl1678cspeXr+3ciRyqoRgj9RD/ONbJhhxFvt1cLBh+qwK2eqISfBb06eRnNeC71oBokDm3zyCnkOtMDGl7IvnMfZfEPFCfg5QgJVk1msPpRvQxmEsrX9MQRyFVzgy2CWNIb7c+jPapyrNwoUbANlN8adU1m6yOuoX7F49x+OjiG2se0EJ6nafeKUXw/+hiJZvELUYgzKUtMAZVTNZfT8jjb58j8GVtuS+6TM2AutbejaCV84ZK58E2CRJqhmjQibEUO6KPdD7oTlEkFy52Y1uOOBXgYpqMzufNPmfdqqqSM4dU70PO8ogyKGiLAIxCetMjjm6FCMEA3Kc8K0Ig7/XtFm9By6VxTJK1Mg36TlHaZKP6VzVLXMtesJECAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Session key
            context.setApiKey("6bc4157dbowkdd409118e0978dc6991a");
            // Use ssl/https
            context.setSsl(true);
            // Method type (can be GET/POST/PUT)
            context.setMethodType(APIMethodTypes.GET);
            // API address
            context.setAddress("openapi.m-pesa.com");
            // API Port
            context.setPort(443);
            // API Path
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/queryTransactionStatus/");

            // Parameters can be added to the call as well that on POST will be in JSON format and on GET will be URL
            // parameters
            // context.addParameter("key", "value");
            context.addParameter("input_QueryReference", "000000000000000000001");
            context.addParameter("input_ServiceProviderCode", "000000");            
            context.addParameter("input_ThirdPartyConversationID", "asv02e5958774f7ba228d83d0d689761");
            context.addParameter("input_Country", "GHA");
            
            // Add/update headers
            context.addHeader("Origin", "*");

            // Create a request object
            APIRequest request = new APIRequest(context);
            
            // Do the API call and put result in a response packet
            APIResponse response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("API call failed to get result. Please check.");
            }

            // Display results
            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 
        }
    }
}
Query Transaction Status Combined
Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below API section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {    
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArv9yxA69XQKBo24BaF/D+fvlqmGdYjqLQ5WtNBb5tquqGvAvG3WMFETVUSow/LizQalxj2ElMVrUmzu5mGGkxK08bWEXF7a1DEvtVJs6nppIlFJc2SnrU14AOrIrB28ogm58JjAl5BOQawOXD5dfSk7MaAA82pVHoIqEu0FxA8BOKU+RGTihRU+ptw1j4bsAJYiPbSX6i71gfPvwHPYamM0bfI4CmlsUUR3KvCG24rB6FNPcRBhM3jDuv8ae2kC33w9hEq8qNB55uw51vK7hyXoAa+U7IqP1y6nBdlN25gkxEA8yrsl1678cspeXr+3ciRyqoRgj9RD/ONbJhhxFvt1cLBh+qwK2eqISfBb06eRnNeC71oBokDm3zyCnkOtMDGl7IvnMfZfEPFCfg5QgJVk1msPpRvQxmEsrX9MQRyFVzgy2CWNIb7c+jPapyrNwoUbANlN8adU1m6yOuoX7F49x+OjiG2se0EJ6nafeKUXw/+hiJZvELUYgzKUtMAZVTNZfT8jjb58j8GVtuS+6TM2AutbejaCV84ZK58E2CRJqhmjQibEUO6KPdD7oTlEkFy52Y1uOOBXgYpqMzufNPmfdqqqSM4dU70PO8ogyKGiLAIxCetMjjm6FCMEA3Kc8K0Ig7/XtFm9By6VxTJK1Mg36TlHaZKP6VzVLXMtesJECAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Api key
            context.setApiKey("6bc4157dbee34d409118e0978dc6dd17");
            // Use ssl/https
            context.setSsl(true);
            // Method type (can be GET/POST/PUT)
            context.setMethodType(APIMethodTypes.GET);
            // API address
            context.setAddress("openapi.m-pesa.com");
            // API Port
            context.setPort(443);
            // API Path
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/getSession/");

            // Parameters can be added to the call as well that on POST will be in JSON format and on GET will be URL
            // parameters
            // context.addParameter("key", "value");

            // Add/update headers
            context.addHeader("Origin", "*");

            // Create a request object
            APIRequest request = new APIRequest(context);
            
            // Do the API call and put result in a response packet
            APIResponse response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("SessionKey call failed to get result. Please check.");
            }

            // Display results
            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 

            String sessionId = response.getBody()["output_SessionID"];

            // The above call issued a sessionID which will be used as the API key in calls that needs the sessionID
            context = new APIContext();
            context.setPublicKey(publicKey);
            context.setApiKey(sessionId);
            context.setSsl(true);
            context.setMethodType(APIMethodTypes.GET);
            context.setAddress("openapi.m-pesa.com");
            context.setPort(443);
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/queryTransactionStatus/");

            context.addParameter("input_QueryReference", "000000000000000000001");
            context.addParameter("input_ServiceProviderCode", "000000");            
            context.addParameter("input_ThirdPartyConversationID", "asv02e5958774f7ba228d83d0d689761");
            context.addParameter("input_Country", "GHA");
            
            context.addHeader("Origin", "*");

            request = new APIRequest(context);
            
            // SessionID can take up to 30 seconds to become 'live' in the system and will be invalid until it is
            Thread.Sleep(30 * 1000);
            
            response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("API call failed to get result. Please check.");
            }  

            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 
        }
    }
}


Direct Debit Create
API Description
Direct Debits are payments in M-Pesa that are initiated by the Payee alone without any Payer interaction, but permission must first be granted by the Payer. The granted permission from the Payer to Payee is commonly termed a ‘Mandate’, and M-Pesa must hold details of this Mandate.

The Direct Debit API set allows an organisation to get the initial consent of their customers to create the Mandate that allows the organisation to debit customer's account at an agreed frequency and amount for services rendered. After the initial consent, the debit of the account will not involve any customer interaction. The Direct Debit feature makes use of the following API calls:
•	Create a Direct Debit mandate
•	Pay a mandate

The customer is able to view and cancel the Direct Debit mandate from G2 menu accessible via USSD menu or the Smartphone Application.
Make REST API Call
API Endpoint
In REST API calls, use the following URL as the API service endpoint for the chosen environment:

Site	SSL	HTTP Method	Host	Port	Context
Sandbox	True	POST	openapi.m-pesa.com	443	/sandbox/ipg/v2/[market]/directDebitCreation/
OpenAPI	True	POST	openapi.m-pesa.com	443	/openapi/ipg/v2/[market]/directDebitCreation/
Replace the [market] and [currency] parameters with the appropriate values from the below tables:
API Markets
Description	URL Context Value	input_Country Value	input_Currency Value
Vodafone Ghana	vodafoneGHA	GHA	GHS
Vodacom Tanzania	vodacomTZN	TZN	TZS
Vodacom Lesotho	vodacomLES	LES	LSL
Vodacom DR Congo	vodacomDRC	DRC	USD
Vodacom Mozambique	vodacomMOZ	MOZ	MZN
API Setup Example
POST https://openapi.m-pesa.com/sandbox/ipg/v2/vodafoneGHA/directDebitCreation/
API Header
The header of the API call makes use of the Session Key received from the Generate SessionKey API call when authorising and authenticating the calling party.

Header Name	Header Value	Header Description
Content-Type	application/json	The content-type of the API
Authorization	Bearer [encrypted-SessionKey]	Bearer token authorization is used. The encrypted SessionKey needs to be used.
Origin	*	Used to limit the origin of the API caller to specific systems. Use the domain name or IP address. Should match the value(s) defined in your Application.
Content-Type: application/json
Authorization: Bearer K2sf0ne61AocJqWxO3kTHMBmLl0fQyBQWV7GfH3z1kMxV qMCB7sMXn+CKigIPIawHoNr2IrGdjBdFugyHNxRnGkrfSDkC9PFBhR/D9ePdw15jgggnG8FItGpw4TEwECgzk0sEmYmKaB9K6lgvs4rs7TMPpTom7uX72+tZ+qMqRVt7LrGsngBrkXjbOxc19fkImVHjehzjVCOSOsROsx4nRlM9wtl4KSLgKCBzmLePRmwu/IOCF3NrIQLVYYqUDDSgYbHURk1L6d4kxJffFM/wa2BPoeuG59gcgldyEaQ5Sv5VnaGKDh1XTBrvKS+J9Efwg7s1CWLQxhtYdr+Z2eorC1QjbxwW+LbiIChiu/wSVRY6/9p41QbXEsBoIEESPD8JIfxGM/HFRhRmiVN2LGiUX8+5O1piXq4JRrBz+VrQ1HXpDKQj4+MAipVPqL4jsQhbbOQ/OvZa3uA18oA9FXpsC41siVApduLOlK8OxJPvygtB1gMlSisOHLWiZGWjY7uEu9CvW9LPlcz4MzHhIg6/Vemj5KyT/Mcn/874K8LgZG8eTnzBac3nvrsl2k5BnMUa/4JoBUOjqrJUe4cckYPIjw2sw9rUFqfOqh9LiG76dCFvgBOKqZU3ZrEGT7/yE+VlMkHV+rON26+XWIet5nGZobPXZFm9gAgIkAav3b//X4=
Origin: 127.0.0.1
API Requests
The body of the API call is made up of the following parameters and values:

Parameter Name	Parameter Description	Parameter Mandatory	Parameter Regex Validation	Parameter Possible Values
input_CustomerMSISDN	The MSISDN of the customer where funds will be debitted from.	True	^[0-9]{12,14}$	254707161122
input_Country	The country of the mobile money platform where the transaction needs happen on.	True	N/A	GHA
input_ServiceProviderCode	The shortcode of the organization where funds will be creditted to.	True	^([0-9A-Za-z]{4,12})$	ORG001
input_ThirdPartyReference	The direct debit's mandate reference	True	^[0-9a-zA-Z]{1,32}$	Test123
input_ThirdPartyConversationID	The third party's transaction reference on their system.	True	^[0-9a-zA-Z \w+]{1,40}$	1e9b774d1da34af78412a498cbc28f5e
input_AgreedTC	The customer agreed to the terms and conditions. Can only use 1 or 0.	True	^[0-1]{1}$	1
input_FirstPaymentDate	The Start date of the Mandate.	False	^[0-9]{8}$	20190205
input_Frequency	The frequency of the payments [see table below]	False	^[0-9]{2}$	02
input_StartRangeOfDays	The start range of days in the month.	False	^[0-9]{2}$	01
input_EndRangeOfDays	The end range of days in the month.	False	^[0-9]{2}$	22
input_ExpiryDate	The expiry date of the Mandate.	False	^[0-9]{8}$	20190410


Frequency Period	Value Description
01	Once off
02	Daily
03	Weekly
04	Monthly
05	Quarterly
06	Half Yearly
07	Yearly
08	On Demand


The below needs to be considered when making use of the Frequency parameter:

When Frequency is not used:  FirstPaymentDate ,  StartRangeOfDays , and  EndRangeOfDays  must be left empty.

When Frequency is set to OneOff, Daily, Weekly or On Demand:  FirstPaymentDate  (default value: current day) must be set and  StartRangeOfDays  and  EndRangeOfDays  must be empty.

When Frequency is set to Monthly, Quarterly, HalfYearly, or Yearly:  FirstPaymentDate  (default value: current day) must be set and  StartRangeOfDays  and  EndRangeOfDays  are optional.

API Responses
The response back to the application can either be synchronous or asynchronous, depending the business use case. Synchronous responses will make use of the same session to return the results. For asynchronous responses, the user will need to build a listener to receive the asynchronous response once the transaction has finalised on the payment system.
The response back to the application can either be synchronous or asynchronous, depending the business use case. Synchronous responses will make use of the same session to return the results. For asynchronous responses, the user will need to build a listener to receive responses once the transaction has finalised on the walletting system.
Synchronous Responses
Parameter Name	Parameter Description	Parameter Possible Values
output_ResponseCode	The result code for the transaction.	INS-0
output_ResponseDesc	The result description for the transaction.	Request processed successfully
output_TransactionReference	The transaction reference or mandate from the Mobile Money Platform.	vgisfyn4b22w6tmqjftatq75lyuie6vc
output_MsisdnToken	The encrypted MSISDN Token built from the provided MSISDN. Only returned in successful messages.	cvgwUBZ3lAO9ivwhWAFeng==
output_ConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
output_MandateID	Mandate ID for the Mandate as recorded on the Mobile Money Platform.	15045
Asynchronous Responses
Once the transaction is initiated, the OpenAPI will respond synchronously with the following information before the session is closed.

Parameter Name	Parameter Description	Parameter Possible Values
output_ResponseCode	The result code for the transaction.	INS-0
output_ResponseDesc	The result description for the transaction.	Request processed successfully
output_ConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e


The Conversation ID can be used in a Query Transaction Status call to determine the status of the process flow. Once the transaction has been completed, the OpenAPI will provide the result of the transaction in an asynchronous message to the value listed in the Response URL of the request parameter in the body. Please note that the developed application will need to have a separate listener to receive the result.

Parameter Name	Parameter Description	Parameter Possible Values
input_OriginalConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
input_TransactionReference	The transaction reference or mandate from the Mobile Money Platform.	vgisfyn4b22w6tmqjftatq75lyuie6vc
input_MsisdnToken	The encrypted MSISDN Token built from the provided MSISDN. Only returned in successful messages.	cvgwUBZ3lAO9ivwhWAFeng==
input_ResultCode	The result code for the transaction.	INS-0
input_ResultDesc	The result description for the transaction.	Request processed successfully
input_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
input_MandateID	Mandate ID for the Mandate as recorded on the Mobile Money Platform.	15045


It is expected that the listener confirms receipt of the result by responding the below content which closes out the session:
Parameter Name	Parameter Description	Parameter Possible Values
output_OriginalConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ResponseCode	The result code for the transaction.	0
output_ResponseDesc	The result description for the transaction.	 Successfully Accepted Result 
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
Response Codes
HTTP StatusCode	Response Code	Response Description
201	INS-0	Request processed successfully
400	INS-1	Internal Error
401	INS-6	Transaction Failed
408	INS-9	Request timeout
409	INS-10	Duplicate Transaction
400	INS-13	Invalid Shortcode Used
400	INS-15	Invalid Amount Used
400	INS-17	Invalid Transaction Reference. Length Should Be Between 1 and 20.
400	INS-20	Not All Parameters Provided. Please try again.
400	INS-21	Parameter validations failed. Please try again.
400	INS-26	Invalid Currency Used
400	INS-28	Invalid ThirdPartyConversationID Used
400	INS-30	Invalid Purchased Items Description Used
400	INS-36	Invalid Agreed TC Used
400	INS-39	Invalid First Payment Date Used
400	INS-40	Invalid Frequency Used
400	INS-41	Invalid Start Range Days Used
400	INS-42	Invalid End Range Days Used
400	INS-43	Invalid Expiry Date Used
400	INS-990	Customer Transaction Value Limit Breached
400	INS-991	Customer Transaction Count Limit Breached
400	INS-992	Multiple Limits Breached
400	INS-993	Organization Transaction Count Limit Breached
400	INS-994	Organization Transaction Value Limit Breached
400	INS-995	API Single Transaction Limit Breached
400	INS-996	API Being Used Outside Of Usage Time
400	INS-997	API Not Enabled
400	INS-998	Invalid Market
422	INS-2006	Insufficient balance
400	INS-2051	MSISDN invalid.
Sample Packets
Sample request and response packets.

If you want to make use of a end to end synchronous flow, use the following tabs:
Request (Thirdparty -> OpenAPI)
Sync Flow Response (OpenAPI -> Thirdparty)

If you want to make use of a end to end asynchronous flow, use the following tabs:
Request (Thirdparty -> OpenAPI)
Async Flow Response (OpenAPI -> Thirdparty)
OpenAPI Async Flow Request (OpenAPI -> Thirdparty)
ThirdParty Async Flow Response (Thirdparty -> OpenAPI)
{
  "input_AgreedTC": "1",
  "input_Country": "GHA",
  "input_CustomerMSISDN": "000000000001",
  "input_EndRangeOfDays": "22",
  "input_ExpiryDate": "20161126",
  "input_FirstPaymentDate": "20160324",
  "input_Frequency": "06",
  "input_ServiceProviderCode": "000000",
  "input_StartRangeOfDays": "01",
  "input_ThirdPartyConversationID": "AAA6d1f9391a0052de0b5334a912jbsj1j2kk",
  "input_ThirdPartyReference": "3333"
}
Sample Code Snippets
Libraries Download
Libraries to assist with integrations.
Direct Debit Create
This API should always be used in conjunction with a valid SessionKey.
Please refer to the Generate SessionKey API documentation page to see how to generate a SessionKey or see the below combined API code snippet where the Generate SessionKey API is combined with the Direct Debit Create API.


Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below API section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArv9yxA69XQKBo24BaF/D+fvlqmGdYjqLQ5WtNBb5tquqGvAvG3WMFETVUSow/LizQalxj2ElMVrUmzu5mGGkxK08bWEXF7a1DEvtVJs6nppIlFJc2SnrU14AOrIrB28ogm58JjAl5BOQawOXD5dfSk7MaAA82pVHoIqEu0FxA8BOKU+RGTihRU+ptw1j4bsAJYiPbSX6i71gfPvwHPYamM0bfI4CmlsUUR3KvCG24rB6FNPcRBhM3jDuv8ae2kC33w9hEq8qNB55uw51vK7hyXoAa+U7IqP1y6nBdlN25gkxEA8yrsl1678cspeXr+3ciRyqoRgj9RD/ONbJhhxFvt1cLBh+qwK2eqISfBb06eRnNeC71oBokDm3zyCnkOtMDGl7IvnMfZfEPFCfg5QgJVk1msPpRvQxmEsrX9MQRyFVzgy2CWNIb7c+jPapyrNwoUbANlN8adU1m6yOuoX7F49x+OjiG2se0EJ6nafeKUXw/+hiJZvELUYgzKUtMAZVTNZfT8jjb58j8GVtuS+6TM2AutbejaCV84ZK58E2CRJqhmjQibEUO6KPdD7oTlEkFy52Y1uOOBXgYpqMzufNPmfdqqqSM4dU70PO8ogyKGiLAIxCetMjjm6FCMEA3Kc8K0Ig7/XtFm9By6VxTJK1Mg36TlHaZKP6VzVLXMtesJECAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Session key
            context.setApiKey("6bc4157dbowkdd409118e0978dc6991a");
            // Use ssl/https
            context.setSsl(true);
            // Method type (can be GET/POST/PUT)
            context.setMethodType(APIMethodTypes.POST);
            // API address
            context.setAddress("openapi.m-pesa.com");
            // API Port
            context.setPort(443);
            // API Path
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/directDebitCreation/");

            // Parameters can be added to the call as well that on POST will be in JSON format and on GET will be URL
            // parameters
            // context.addParameter("key", "value");
            context.addParameter("input_AgreedTC", "1");
            context.addParameter("input_Country", "GHA");
            context.addParameter("input_CustomerMSISDN", "000000000001");
            context.addParameter("input_EndRangeOfDays", "22");
            context.addParameter("input_ExpiryDate", "20161126");
            context.addParameter("input_FirstPaymentDate", "20160324");
            context.addParameter("input_Frequency", "06");
            context.addParameter("input_ServiceProviderCode", "000000");
            context.addParameter("input_StartRangeOfDays", "01");
            context.addParameter("input_ThirdPartyConversationID", "AAA6d1f9391a0052de0b5334a912jbsj1j2kk");
            context.addParameter("input_ThirdPartyReference", "3333");

            // Add/update headers
            context.addHeader("Origin", "*");

            // Create a request object
            APIRequest request = new APIRequest(context);

            // Do the API call and put result in a response packet
            APIResponse response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }

            if (response == null) {
                 throw new Exception("API call failed to get result. Please check.");
            }

            // Display results
            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            }

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            }
        }
    }
}
Direct Debit Create Combined
Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below API section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArv9yxA69XQKBo24BaF/D+fvlqmGdYjqLQ5WtNBb5tquqGvAvG3WMFETVUSow/LizQalxj2ElMVrUmzu5mGGkxK08bWEXF7a1DEvtVJs6nppIlFJc2SnrU14AOrIrB28ogm58JjAl5BOQawOXD5dfSk7MaAA82pVHoIqEu0FxA8BOKU+RGTihRU+ptw1j4bsAJYiPbSX6i71gfPvwHPYamM0bfI4CmlsUUR3KvCG24rB6FNPcRBhM3jDuv8ae2kC33w9hEq8qNB55uw51vK7hyXoAa+U7IqP1y6nBdlN25gkxEA8yrsl1678cspeXr+3ciRyqoRgj9RD/ONbJhhxFvt1cLBh+qwK2eqISfBb06eRnNeC71oBokDm3zyCnkOtMDGl7IvnMfZfEPFCfg5QgJVk1msPpRvQxmEsrX9MQRyFVzgy2CWNIb7c+jPapyrNwoUbANlN8adU1m6yOuoX7F49x+OjiG2se0EJ6nafeKUXw/+hiJZvELUYgzKUtMAZVTNZfT8jjb58j8GVtuS+6TM2AutbejaCV84ZK58E2CRJqhmjQibEUO6KPdD7oTlEkFy52Y1uOOBXgYpqMzufNPmfdqqqSM4dU70PO8ogyKGiLAIxCetMjjm6FCMEA3Kc8K0Ig7/XtFm9By6VxTJK1Mg36TlHaZKP6VzVLXMtesJECAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Api key
            context.setApiKey("6bc4157dbowkdd409118e0978dc6991a");
            // Use ssl/https
            context.setSsl(true);
            // Method type (can be GET/POST/PUT)
            context.setMethodType(APIMethodTypes.GET);
            // API address
            context.setAddress("openapi.m-pesa.com");
            // API Port
            context.setPort(443);
            // API Path
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/getSession/");

            // Parameters can be added to the call as well that on POST will be in JSON format and on GET will be URL
            // parameters
            // context.addParameter("key", "value");

            // Add/update headers
            context.addHeader("Origin", "*");

            // Create a request object
            APIRequest request = new APIRequest(context);

            // Do the API call and put result in a response packet
            APIResponse response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }

            if (response == null) {
                 throw new Exception("SessionKey call failed to get result. Please check.");
            }

            // Display results
            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            }

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            }

            String sessionId = response.getBody()["output_SessionID"];

            // The above call issued a sessionID which will be used as the API key in calls that needs the sessionID
            context = new APIContext();
            context.setPublicKey(publicKey);
            context.setApiKey(sessionId);
            context.setSsl(true);
            context.setMethodType(APIMethodTypes.POST);
            context.setAddress("openapi.m-pesa.com");
            context.setPort(443);
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/directDebitCreation/");

            context.addParameter("input_AgreedTC", "1");
            context.addParameter("input_Country", "GHA");
            context.addParameter("input_CustomerMSISDN", "000000000001");
            context.addParameter("input_EndRangeOfDays", "22");
            context.addParameter("input_ExpiryDate", "20161126");
            context.addParameter("input_FirstPaymentDate", "20160324");
            context.addParameter("input_Frequency", "06");
            context.addParameter("input_ServiceProviderCode", "000000");
            context.addParameter("input_StartRangeOfDays", "01");
            context.addParameter("input_ThirdPartyConversationID", "AAA6d1f9391a0052de0b5334a912jbsj1j2kk");
            context.addParameter("input_ThirdPartyReference", "3333");

            context.addHeader("Origin", "*");

            request = new APIRequest(context);

            // SessionID can take up to 30 seconds to become 'live' in the system and will be invalid until it is
            Thread.Sleep(30 * 1000);

            response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }

            if (response == null) {
                 throw new Exception("API call failed to get result. Please check.");
            }

            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            }

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            }
        }
    }
}



Direct Debit Payment
API Description
Direct Debits are payments in M-Pesa that are initiated by the Payee alone without any Payer interaction, but permission must first be granted by the Payer. The granted permission from the Payer to Payee is commonly termed a ‘Mandate’, and M-Pesa must hold details of this Mandate. 

The Direct Debit API set allows an organisation to get the initial consent of their customers to create the Mandate that allows the organisation to debit customer's account at an agreed frequency and amount for services rendered. After the initial consent, the debit of the account will not involve any customer interaction. The Direct Debit feature makes use of the following API calls:
•	Create a Direct Debit mandate
•	Pay a mandate

The customer is able to view and cancel the Direct Debit mandate from G2 menu accessible via USSD menu or the Smartphone Application.
Make REST API Call
API Endpoint
In REST API calls, use the following URL as the API service endpoint for the chosen environment:

Site	SSL	HTTP Method	Host	Port	Context
Sandbox	True	POST	openapi.m-pesa.com	443	/sandbox/ipg/v2/[market]/directDebitPayment/
OpenAPI	True	POST	openapi.m-pesa.com	443	/openapi/ipg/v2/[market]/directDebitPayment/
Replace the [market] and [currency] parameters with the appropriate values from the below table:
API Markets
Description	URL Context Value	input_Country Value	input_Currency Value
Vodafone Ghana	vodafoneGHA	GHA	GHS
Vodacom Tanzania	vodacomTZN	TZN	TZS
Vodacom Lesotho	vodacomLES	LES	LSL
Vodacom DR Congo	vodacomDRC	DRC	USD
Vodacom Mozambique	vodacomMOZ	MOZ	MZN
API Setup Example
POST https://openapi.m-pesa.com/sandbox/ipg/v2/vodafoneGHA/directDebitPayment/
API Header
The header of the API call makes use of the Session Key received from the Generate SessionKey API call when authorising and authenticating the calling party.

Header Name	Header Value	Header Description
Content-Type	application/json	The content-type of the API
Authorization	Bearer [encrypted-SessionKey]	Bearer token authorization is used. The encrypted SessionKey needs to be used.
Origin	*	Used to limit the origin of the API caller to specific systems. Use the domain name or IP address. Should match the value(s) defined in your Application.
API Requests
The body of the API call is made up of the following parameters and values. Either the input_MsisdnToken or input_CustomerMSISDN must be supplied. If both are supplied they must match.

Parameter Name	Parameter Description	Parameter Mandatory	Parameter Regex Validation	Parameter Possible Values
input_MsisdnToken	The previously returned encrypted MSISDN of the customer where funds will be debitted from. 	False	^[0-9a-zA-Z \w=]{1,26}$	cvgwUBZ3lAO9ivwhWAFeng==
input_CustomerMSISDN	The MSISDN of the customer where funds will be debitted from.	False	^[0-9]{12,14}$	254707161122
input_Country	The country of the mobile money platform where the transaction needs happen on.	True	N/A	GHA
input_ServiceProviderCode	The shortcode of the organization where funds will be creditted to.	True	^([0-9A-Za-z]{4,12})$	ORG001
input_ThirdPartyReference	The direct debit's mandate reference	True	^[0-9a-zA-Z]{1,32}$	Test123
input_ThirdPartyConversationID	The third party's transaction reference on their system.	True	^[0-9a-zA-Z \w+]{1,40}$	1e9b774d1da34af78412a498cbc28f5e
input_Amount	The transaction amount. This amount will be moved from the organization's account to the customer's account.	True	^\d*\.?\d+$	10.00
input_Currency	The currency in which the transaction should take place.	True	^[a-zA-Z]{1,3}$	GHS
input_MandateID	Mandate ID for the Mandate as recorded on the Mobile Money Platform.	False	^[0-9]{1,12}$	15045
API Responses
The response back to the application can either be synchronous or asynchronous, depending the business use case. Synchronous responses will make use of the same session to return the results. For asynchronous responses, the user will need to build a listener to receive the asynchronous response once the transaction has finalised on the payment system.
The response back to the application can either be synchronous or asynchronous, depending the business use case. Synchronous responses will make use of the same session to return the results. For asynchronous responses, the user will need to build a listener to receive responses once the transaction has finalised on the walletting system.
Synchronous Responses
Parameter Name	Parameter Description	Parameter Possible Values
output_ResponseCode	The result code for the transaction.	INS-0
output_ResponseDesc	The result description for the transaction.	Request processed successfully
output_TransactionID	The transaction identifier that gets generated on the Mobile Money platform. This is used to query transactions on the Mobile Money Platform.	hv9ahxcg4ccv
output_MsisdnToken	The encrypted MSISDN Token, which can be used as an identifier. Only returned in successful messages.	cvgwUBZ3lAO9ivwhWAFeng==
output_ConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
Asynchronous Responses
Once the transaction is initiated, the OpenAPI will respond synchronously with the following information before the session is closed. 

Parameter Name	Parameter Description	Parameter Possible Values
output_ResponseCode	The result code for the transaction.	INS-0
output_ResponseDesc	The result description for the transaction.	Request processed successfully
output_ConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e


The Conversation ID can be used in a Query Transaction Status call to determine the status of the process flow. Once the transaction has been completed, the OpenAPI will provide the result of the transaction in an asynchronous message to the value listed in the Response URL of the request parameter in the body. Please note that the developed application will need to have a separate listener to receive the result. 

Parameter Name	Parameter Description	Parameter Possible Values
input_OriginalConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
input_TransactionID	The transaction identifier that gets generated on the Mobile Money platform. This is used to query transactions on the Mobile Money Platform.	hv9ahxcg4ccv
input_MsisdnToken	The encrypted MSISDN Token, which can be used as an identifier. Only returned in successful messages.	cvgwUBZ3lAO9ivwhWAFeng==
input_ResultCode	The result code for the transaction.	INS-0
input_ResultDesc	The result description for the transaction.	Request processed successfully
input_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e


It is expected that the listener confirms receipt of the result by responding the below content which closes out the session:
Parameter Name	Parameter Description	Parameter Possible Values
output_OriginalConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ResponseCode	The result code for the transaction.	0
output_ResponseDesc	The result description for the transaction.	 Successfully Accepted Result 
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
Response Codes
HTTP StatusCode	Response Code	Response Description
201	INS-0	Request processed successfully
400	INS-1	Internal Error
401	INS-6	Transaction Failed
408	INS-9	Request timeout
409	INS-10	Duplicate Transaction
400	INS-13	Invalid Shortcode Used
400	INS-15	Invalid Amount Used
400	INS-17	Invalid Transaction Reference. Length Should Be Between 1 and 20.
400	INS-20	Not All Parameters Provided. Please try again.
400	INS-21	Parameter validations failed. Please try again.
400	INS-26	Invalid Currency Used
400	INS-28	Invalid ThirdPartyConversationID Used
400	INS-30	Invalid Purchased Items Description Used
400	INS-50	MSISDN Token and MSISDN provided does not Match
400	INS-51	Invalid MandateID Used
400	INS-52	The MandateID used does not correspond to the ThirdPartyReference used.
400	INS-990	Customer Transaction Value Limit Breached
400	INS-991	Customer Transaction Count Limit Breached
400	INS-992	Multiple Limits Breached
400	INS-993	Organization Transaction Count Limit Breached
400	INS-994	Organization Transaction Value Limit Breached
400	INS-995	API Single Transaction Limit Breached
400	INS-996	API Being Used Outside Of Usage Time
400	INS-997	API Not Enabled
400	INS-998	Invalid Market
422	INS-2006	Insufficient balance
400	INS-2051	MSISDN invalid.
Sample Packets
Sample request and response packets.

If you want to make use of a end to end synchronous flow, use the following tabs:
Request (Thirdparty -> OpenAPI)
Sync Flow Response (OpenAPI -> Thirdparty)

If you want to make use of a end to end asynchronous flow, use the following tabs:
Request (Thirdparty -> OpenAPI)
Async Flow Response (OpenAPI -> Thirdparty)
OpenAPI Async Flow Request (OpenAPI -> Thirdparty)
ThirdParty Async Flow Response (Thirdparty -> OpenAPI)

When making a new payment request, either the input_MsisdnToken or input_CustomerMSISDN must be supplied. If both are supplied they must match.
{
  "input_Amount": "10",
  "input_Country": "GHA",
  "input_Currency": "GHS",
  "input_CustomerMSISDN": "000000000001",
  "input_ServiceProviderCode": "000000",
  "input_ThirdPartyConversationID": "AAA6d1f939c1005v2de053v4912jbasdj1j2kk",
  "input_MandateID": "15045",
  "input_ThirdPartyReference": "5db410b459bd433ca8e5"
}
Sample Code Snippets
Libraries Download
Libraries to assist with integrations.
Direct Debit Payment
This API should always be used in conjunction with a valid SessionKey.
Please refer to the Generate SessionKey API documentation page to see how to generate a SessionKey or see the below combined API code snippet where the Generate SessionKey API is combined with the Direct Debit Payment API.


Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below API section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {    
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArv9yxA69XQKBo24BaF/D+fvlqmGdYjqLQ5WtNBb5tquqGvAvG3WMFETVUSow/LizQalxj2ElMVrUmzu5mGGkxK08bWEXF7a1DEvtVJs6nppIlFJc2SnrU14AOrIrB28ogm58JjAl5BOQawOXD5dfSk7MaAA82pVHoIqEu0FxA8BOKU+RGTihRU+ptw1j4bsAJYiPbSX6i71gfPvwHPYamM0bfI4CmlsUUR3KvCG24rB6FNPcRBhM3jDuv8ae2kC33w9hEq8qNB55uw51vK7hyXoAa+U7IqP1y6nBdlN25gkxEA8yrsl1678cspeXr+3ciRyqoRgj9RD/ONbJhhxFvt1cLBh+qwK2eqISfBb06eRnNeC71oBokDm3zyCnkOtMDGl7IvnMfZfEPFCfg5QgJVk1msPpRvQxmEsrX9MQRyFVzgy2CWNIb7c+jPapyrNwoUbANlN8adU1m6yOuoX7F49x+OjiG2se0EJ6nafeKUXw/+hiJZvELUYgzKUtMAZVTNZfT8jjb58j8GVtuS+6TM2AutbejaCV84ZK58E2CRJqhmjQibEUO6KPdD7oTlEkFy52Y1uOOBXgYpqMzufNPmfdqqqSM4dU70PO8ogyKGiLAIxCetMjjm6FCMEA3Kc8K0Ig7/XtFm9By6VxTJK1Mg36TlHaZKP6VzVLXMtesJECAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Session key
            context.setApiKey("6bc4157dbowkdd409118e0978dc6991a");
            // Use ssl/https
            context.setSsl(true);
            // Method type (can be GET/POST/PUT)
            context.setMethodType(APIMethodTypes.POST);
            // API address
            context.setAddress("openapi.m-pesa.com");
            // API Port
            context.setPort(443);
            // API Path
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/directDebitPayment/");

            // Parameters can be added to the call as well that on POST will be in JSON format and on GET will be URL
            // parameters
            // context.addParameter("key", "value");
            context.addParameter("input_Amount", "10");
            context.addParameter("input_Country", "GHA");
            context.addParameter("input_Currency", "GHS");
            context.addParameter("input_CustomerMSISDN", "000000000001");
            context.addParameter("input_ServiceProviderCode", "000000");
            context.addParameter("input_ThirdPartyConversationID", "asv02e5958774f7ba228d83d0d689761");
            context.addParameter("input_ThirdPartyReference", "5db410b459bd433ca8e5");
            context.addParameter("input_MandateID", "15045");
                          
            // Add/update headers
            context.addHeader("Origin", "*");

            // Create a request object
            APIRequest request = new APIRequest(context);
            
            // Do the API call and put result in a response packet
            APIResponse response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("API call failed to get result. Please check.");
            }

            // Display results
            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 
        }
    }
}
Direct Debit Payment Combined
Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below API section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {    
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArv9yxA69XQKBo24BaF/D+fvlqmGdYjqLQ5WtNBb5tquqGvAvG3WMFETVUSow/LizQalxj2ElMVrUmzu5mGGkxK08bWEXF7a1DEvtVJs6nppIlFJc2SnrU14AOrIrB28ogm58JjAl5BOQawOXD5dfSk7MaAA82pVHoIqEu0FxA8BOKU+RGTihRU+ptw1j4bsAJYiPbSX6i71gfPvwHPYamM0bfI4CmlsUUR3KvCG24rB6FNPcRBhM3jDuv8ae2kC33w9hEq8qNB55uw51vK7hyXoAa+U7IqP1y6nBdlN25gkxEA8yrsl1678cspeXr+3ciRyqoRgj9RD/ONbJhhxFvt1cLBh+qwK2eqISfBb06eRnNeC71oBokDm3zyCnkOtMDGl7IvnMfZfEPFCfg5QgJVk1msPpRvQxmEsrX9MQRyFVzgy2CWNIb7c+jPapyrNwoUbANlN8adU1m6yOuoX7F49x+OjiG2se0EJ6nafeKUXw/+hiJZvELUYgzKUtMAZVTNZfT8jjb58j8GVtuS+6TM2AutbejaCV84ZK58E2CRJqhmjQibEUO6KPdD7oTlEkFy52Y1uOOBXgYpqMzufNPmfdqqqSM4dU70PO8ogyKGiLAIxCetMjjm6FCMEA3Kc8K0Ig7/XtFm9By6VxTJK1Mg36TlHaZKP6VzVLXMtesJECAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Api key
            context.setApiKey("6bc4157dbee34d409118e0978dc6dd17");
            // Use ssl/https
            context.setSsl(true);
            // Method type (can be GET/POST/PUT)
            context.setMethodType(APIMethodTypes.GET);
            // API address
            context.setAddress("openapi.m-pesa.com");
            // API Port
            context.setPort(443);
            // API Path
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/getSession/");

            // Parameters can be added to the call as well that on POST will be in JSON format and on GET will be URL
            // parameters
            // context.addParameter("key", "value");

            // Add/update headers
            context.addHeader("Origin", "*");

            // Create a request object
            APIRequest request = new APIRequest(context);
            
            // Do the API call and put result in a response packet
            APIResponse response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("SessionKey call failed to get result. Please check.");
            }

            // Display results
            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 

            String sessionId = response.getBody()["output_SessionID"];

            // The above call issued a sessionID which will be used as the API key in calls that needs the sessionID
            context = new APIContext();
            context.setPublicKey(publicKey);
            context.setApiKey(sessionId);
            context.setSsl(true);
            context.setMethodType(APIMethodTypes.POST);
            context.setAddress("openapi.m-pesa.com");
            context.setPort(443);
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/directDebitPayment/");

            context.addParameter("input_Amount", "10");
            context.addParameter("input_Country", "GHA");
            context.addParameter("input_Currency", "GHS");
            context.addParameter("input_CustomerMSISDN", "000000000001");
            context.addParameter("input_ServiceProviderCode", "000000");
            context.addParameter("input_ThirdPartyConversationID", "asv02e5958774f7ba228d83d0d689761");
            context.addParameter("input_ThirdPartyReference", "5db410b459bd433ca8e5");
            context.addParameter("input_MandateID", "15045");
            
            context.addHeader("Origin", "*");

            request = new APIRequest(context);

            // SessionID can take up to 30 seconds to become 'live' in the system and will be invalid until it is
            Thread.Sleep(30 * 1000);
            
            response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("API call failed to get result. Please check.");
            } 

            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 
        }
    }
}


Query Beneficiary Name
API Description
The Query Beneficiary Name API call is used to query the details about a customer. Information that can be retrieved when using this API is: 1. Customer First Name 2. Customer Last Name
Make REST API Call
API Endpoint
Use the following URL as the API service endpoint for the chosen environment:

Site	SSL	HTTP Method	Host	Port	Context
Sandbox	True	GET	openapi.m-pesa.com	443	/sandbox/ipg/v2/[market]/queryBeneficiaryName/
OpenAPI	True	GET	openapi.m-pesa.com	443	/openapi/ipg/v2/[market]/queryBeneficiaryName/
Replace the [market] parameters with the appropriate values from the below table:
API Markets
Description	URL Context Value	input_Country Value
Vodafone Ghana	vodafoneGHA	GHA
API Setup Example
GET https://openapi.m-pesa.com/sandbox/ipg/v2/vodafoneGHA/queryBeneficiaryName/
API Header
The header of the API call makes use of the Session Key received from the Generate SessionKey API call when authorising and authenticating the calling party.

Header Name	Header Value	Header Description
Content-Type	application/json	The content-type of the API
Authorization	Bearer [encrypted-SessionKey]	Bearer token authorization is used. The encrypted SessionKey needs to be used.
Origin	*	Used to limit the origin of the API caller to specific systems. Use the domain name or IP address. Should match the value(s) defined in your Application.
Content-Type: application/json
Authorization: Bearer K2sf0ne61AocJqWxO3kTHMBmLl0fQyBQWV7GfH3z1kMxV qMCB7sMXn+CKigIPIawHoNr2IrGdjBdFugyHNxRnGkrfSDkC9PFBhR/D9ePdw15jgggnG8FItGpw4TEwECgzk0sEmYmKaB9K6lgvs4rs7TMPpTom7uX72+tZ+qMqRVt7LrGsngBrkXjbOxc19fkImVHjehzjVCOSOsROsx4nRlM9wtl4KSLgKCBzmLePRmwu/IOCF3NrIQLVYYqUDDSgYbHURk1L6d4kxJffFM/wa2BPoeuG59gcgldyEaQ5Sv5VnaGKDh1XTBrvKS+J9Efwg7s1CWLQxhtYdr+Z2eorC1QjbxwW+LbiIChiu/wSVRY6/9p41QbXEsBoIEESPD8JIfxGM/HFRhRmiVN2LGiUX8+5O1piXq4JRrBz+VrQ1HXpDKQj4+MAipVPqL4jsQhbbOQ/OvZa3uA18oA9FXpsC41siVApduLOlK8OxJPvygtB1gMlSisOHLWiZGWjY7uEu9CvW9LPlcz4MzHhIg6/Vemj5KyT/Mcn/874K8LgZG8eTnzBac3nvrsl2k5BnMUa/4JoBUOjqrJUe4cckYPIjw2sw9rUFqfOqh9LiG76dCFvgBOKqZU3ZrEGT7/yE+VlMkHV+rON26+XWIet5nGZobPXZFm9gAgIkAav3b//X4=
Origin: 127.0.0.1
API Requests
The body of the API call is made up of the following parameters and values:

Parameter Name	Parameter Description	Parameter Mandatory	Parameter Regex Validation	Parameter Possible Values
input_CustomerMSISDN	The MSISDN of the customer being queried.	True	^[0-9]{12,14}$	254707161122
input_Country	The country of the mobile money platform beign queried.	True	N/A	GHA
input_ServiceProviderCode	The shortcode of the organization.	True	^([0-9A-Za-z]{4,12})$	ORG001
input_ThirdPartyConversationID	The third party's transaction reference on their system.	True	^[0-9a-zA-Z \w+]{1,40}$	1e9b774d1da34af78412a498cbc28f5e
input_KycQueryType	The type of KYC information to be queried, currently only "Name" is supported.	True	^(Name)$	Name
API Responses
The response back to the application can either be synchronous or asynchronous, depending the business use case. Synchronous responses will make use of the same session to return the results. For asynchronous responses, the user will need to build a listener to receive the asynchronous response once the transaction has finalised on the payment system.
Synchronous Responses
Parameter Name	Parameter Description	Parameter Possible Values
output_ResponseCode	The result code for the transaction.	INS-0
output_ResponseDesc	The result description for the transaction.	Request processed successfully
output_CustomerFirstName	The Customer's first name	Jiazhen
output_CustomerLastName	The Customer's last name	Wuu
output_ConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
Asynchronous Responses
Once the transaction is initiated, the OpenAPI will respond synchronously with the following information before the session is closed. 

Parameter Name	Parameter Description	Parameter Possible Values
output_ResponseCode	The result code for the transaction.	INS-0
output_ResponseDesc	The result description for the transaction.	Request processed successfully
output_ConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
Once the request has been completed, the OpenAPI will provide the result in an asynchronous message to the value listed in the Response URL of the request parameter in the body. Please note that the developed application will need to have a separate listener to receive the result. 


      Parameter Name
    	
      Parameter Description
    	
      Parameter Possible Values
    
input_OriginalConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
input_CustomerFirstName	The Customer's name information	Jiazhen
input_CustomerLastName	The Customer's address information	Wuu
input_ResultCode	The result code for the transaction.	INS-0
input_ResultDesc	The result description for the transaction.	Request processed successfully
input_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
It is expected that the listener confirms receipt of the result by responding the below content which closes out the session:
Parameter Name	Parameter Description	Parameter Possible Values
output_OriginalConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ResponseCode	The result code for the transaction.	0
output_ResponseDesc	The result description for the transaction.	 Successfully Accepted Result 
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
Response Codes
HTTP StatusCode	Response Code	Response Description
200	INS-0	Request processed successfully
400	INS-1	Internal Error
401	INS-6	Transaction Failed
408	INS-9	Request timeout
400	INS-13	Invalid Shortcode Used
400	INS-20	Not All Parameters Provided. Please try again.
400	INS-2051	2051 MSISDN invalid.
400	INS-21	Parameter validations failed. Please try again.
400	INS-28	Invalid ThirdPartyConversationID Used
400	INS-32	Invalid KYC Query Type Used
400	INS-996	API Being Used Outside Of Usage Time
400	INS-997	API Not Enabled
400	INS-998	Invalid Market
Sample Packets
Sample request and response packets.

If you want to make use of a end to end synchronous flow, use the following tabs:
Request (Thirdparty -> OpenAPI)
Sync Flow Response (OpenAPI -> Thirdparty)

If you want to make use of a end to end asynchronous flow, use the following tabs:
Request (Thirdparty -> OpenAPI)
Async Flow Response (OpenAPI -> Thirdparty)
OpenAPI Async Flow Request (OpenAPI -> Thirdparty)
ThirdParty Async Flow Response (Thirdparty -> OpenAPI)
?input_CustomerMSISDN=254707161122&input_Country=GHA&input_ServiceProviderCode=000000&input_ThirdPartyConversationID=asv02e5958774f7ba228d83d0d689761&input_KYCQueryType=Name
Sample Code Snippets
Libraries Download
Libraries to assist with integrations.
Query Beneficiary Name
This API should always be used in conjunction with a valid SessionKey.
Please refer to the Generate SessionKey API documentation page to see how to generate a SessionKey or see the below combined API code snippet where the Generate SessionKey API is combined with the Query Beneficiary Name API.


Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below API section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {    
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAszE+xAKVB9HRarr6/uHYYAX/RdD6KGVIGlHv98QKDIH26ldYJQ7zOuo9qEscO0M1psSPe/67AWYLEXh13fbtcSKGP6WFjT9OY6uV5ykw9508x1sW8UQ4ZhTRNrlNsKizE/glkBfcF2lwDXJGQennwgickWz7VN+AP/1c4DnMDfcl8iVIDlsbudFoXQh5aLCYl+XOMt/vls5a479PLMkPcZPOgMTCYTCE6ReX3KD2aGQ62uiu2T4mK+7Z6yvKvhPRF2fTKI+zOFWly//IYlyB+sde42cIU/588msUmgr3G9FYyN2vKPVy/MhIZpiFyVc3vuAAJ/mzue5p/G329wzgcz0ztyluMNAGUL9A4ZiFcKOebT6y6IgIMBeEkTwyhsxRHMFXlQRgTAufaO5hiR/usBMkoazJ6XrGJB8UadjH2m2+kdJIieI4FbjzCiDWKmuM58rllNWdBZK0XVHNsxmBy7yhYw3aAIhFS0fNEuSmKTfFpJFMBzIQYbdTgI28rZPAxVEDdRaypUqBMCq4OstCxgGvR3Dy1eJDjlkuiWK9Y9RGKF8HOI5a4ruHyLheddZxsUihziPF9jKTknsTZtF99eKTIjhV7qfTzxXq+8GGoCEABIyu26LZuL8X12bFqtwLAcjfjoB7HlRHtPszv6PJ0482ofWmeH0BE8om7VrSGxsCAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Session key
            context.setApiKey("1bc4157dbee34d409118e0978dc6dd17");
            // Use ssl/https
            context.setSsl(true);
            // Method type (can be GET/POST/PUT)
            context.setMethodType(APIMethodTypes.GET);
            // API address
            context.setAddress("openapi.m-pesa.com");
            // API Port
            context.setPort(443);
            // API Path
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/queryBeneficiaryName/");

            // Parameters can be added to the call as well that on POST will be in JSON format and on GET will be URL
            // parameters
            // context.addParameter("key", "value");
            context.addParameter("input_CustomerMSISDN", "254707161122");
            context.addParameter("input_ServiceProviderCode", "000000");            
            context.addParameter("input_ThirdPartyConversationID", "asv02e5958774f7ba228d83d0d689761");
            context.addParameter("input_Country", "GHA");
            context.addParameter("input_KycQueryType", "Name");
            
            // Add/update headers
            context.addHeader("Origin", "*");

            // Create a request object
            APIRequest request = new APIRequest(context);
            
            // Do the API call and put result in a response packet
            APIResponse response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("API call failed to get result. Please check.");
            }

            // Display results
            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 
        }
    }
}
Query Beneficiary Name Combined
Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below API section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {    
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAszE+xAKVB9HRarr6/uHYYAX/RdD6KGVIGlHv98QKDIH26ldYJQ7zOuo9qEscO0M1psSPe/67AWYLEXh13fbtcSKGP6WFjT9OY6uV5ykw9508x1sW8UQ4ZhTRNrlNsKizE/glkBfcF2lwDXJGQennwgickWz7VN+AP/1c4DnMDfcl8iVIDlsbudFoXQh5aLCYl+XOMt/vls5a479PLMkPcZPOgMTCYTCE6ReX3KD2aGQ62uiu2T4mK+7Z6yvKvhPRF2fTKI+zOFWly//IYlyB+sde42cIU/588msUmgr3G9FYyN2vKPVy/MhIZpiFyVc3vuAAJ/mzue5p/G329wzgcz0ztyluMNAGUL9A4ZiFcKOebT6y6IgIMBeEkTwyhsxRHMFXlQRgTAufaO5hiR/usBMkoazJ6XrGJB8UadjH2m2+kdJIieI4FbjzCiDWKmuM58rllNWdBZK0XVHNsxmBy7yhYw3aAIhFS0fNEuSmKTfFpJFMBzIQYbdTgI28rZPAxVEDdRaypUqBMCq4OstCxgGvR3Dy1eJDjlkuiWK9Y9RGKF8HOI5a4ruHyLheddZxsUihziPF9jKTknsTZtF99eKTIjhV7qfTzxXq+8GGoCEABIyu26LZuL8X12bFqtwLAcjfjoB7HlRHtPszv6PJ0482ofWmeH0BE8om7VrSGxsCAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Api key
            context.setApiKey("6bc4157dbee34d409118e0978dc6dd17");
            // Use ssl/https
            context.setSsl(true);
            // Method type (can be GET/POST/PUT)
            context.setMethodType(APIMethodTypes.GET);
            // API address
            context.setAddress("openapi.m-pesa.com");
            // API Port
            context.setPort(443);
            // API Path
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/getSession/");

            // Parameters can be added to the call as well that on POST will be in JSON format and on GET will be URL
            // parameters
            // context.addParameter("key", "value");

            // Add/update headers
            context.addHeader("Origin", "*");

            // Create a request object
            APIRequest request = new APIRequest(context);
            
            // Do the API call and put result in a response packet
            APIResponse response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("SessionKey call failed to get result. Please check.");
            }

            // Display results
            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 

            String sessionId = response.getBody()["output_SessionID"];

            // The above call issued a sessionID which will be used as the API key in calls that needs the sessionID
            context = new APIContext();
            context.setPublicKey(publicKey);
            context.setApiKey(sessionId);
            context.setSsl(true);
            context.setMethodType(APIMethodTypes.GET);
            context.setAddress("openapi.m-pesa.com");
            context.setPort(443);
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/queryBeneficiaryName/");

            context.addParameter("input_CustomerMSISDN", "254707161122");
            context.addParameter("input_ServiceProviderCode", "000000");            
            context.addParameter("input_ThirdPartyConversationID", "asv02e5958774f7ba228d83d0d689761");
            context.addParameter("input_Country", "GHA");
            context.addParameter("input_KycQueryType", "Name");
            
            context.addHeader("Origin", "*");

            request = new APIRequest(context);
            
            // SessionID can take up to 30 seconds to become 'live' in the system and will be invalid until it is
            Thread.Sleep(30 * 1000);
            
            response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("API call failed to get result. Please check.");
            }  

            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 
        }
    }
}

Query Direct Debit
API Description
M-Pesa Open API allows a merchant/partner to Query the Status of the Mandate in order to verify if the Direct Debit Payment will be approved prior to processing the payment. This API also includes the capability to query the account balance against the payment amount.
Make REST API Call
API Endpoint
Use the following URL as the API service endpoint for the chosen environment:
Site	SSL	HTTP Method	Host	Port	Context
Sandbox	True	GET	openapi.m-pesa.com	443	/sandbox/ipg/v2/[market]/queryDirectDebit/
OpenAPI	True	GET	openapi.m-pesa.com	443	/openapi/ipg/v2/[market]/queryDirectDebit/
Replace the [market] and [currency] parameters with the appropriate values from the below tables:
API Markets
Description	URL Context Value	input_Country Value	input_Currency Value
Vodafone Ghana	vodafoneGHA	GHA	GHS
Vodacom DR Congo	vodacomDRC	DRC	USD
Vodacom Lesotho	vodacomLES	LES	LSL
Vodacom Tanzania	vodacomTZN	TZN	TZS
Vodacom Mozambique	vodacomMOZ	MOZ	MZN
API Setup Example
GET https://openapi.m-pesa.com/sandbox/ipg/v2/vodafoneGHA/queryDirectDebit/
API Header
The header of the API call makes use of the Session Key received from the Generate SessionKey API call when authorising and authenticating the calling party.

Header Name	Header Value	Header Description
Content-Type	application/json	The content-type of the API
Authorization	Bearer [encrypted-SessionKey]	Bearer token authorization is used. The encrypted SessionKey needs to be used.
Origin	*	Used to limit the origin of the API caller to specific systems. Use the domain name or IP address. Should match the value(s) defined in your Application.
Content-Type: application/json
Authorization: Bearer K2sf0ne61AocJqWxO3kTHMBmLl0fQyBQWV7GfH3z1kMxV qMCB7sMXn+CKigIPIawHoNr2IrGdjBdFugyHNxRnGkrfSDkC9PFBhR/D9ePdw15jgggnG8FItGpw4TEwECgzk0sEmYmKaB9K6lgvs4rs7TMPpTom7uX72+tZ+qMqRVt7LrGsngBrkXjbOxc19fkImVHjehzjVCOSOsROsx4nRlM9wtl4KSLgKCBzmLePRmwu/IOCF3NrIQLVYYqUDDSgYbHURk1L6d4kxJffFM/wa2BPoeuG59gcgldyEaQ5Sv5VnaGKDh1XTBrvKS+J9Efwg7s1CWLQxhtYdr+Z2eorC1QjbxwW+LbiIChiu/wSVRY6/9p41QbXEsBoIEESPD8JIfxGM/HFRhRmiVN2LGiUX8+5O1piXq4JRrBz+VrQ1HXpDKQj4+MAipVPqL4jsQhbbOQ/OvZa3uA18oA9FXpsC41siVApduLOlK8OxJPvygtB1gMlSisOHLWiZGWjY7uEu9CvW9LPlcz4MzHhIg6/Vemj5KyT/Mcn/874K8LgZG8eTnzBac3nvrsl2k5BnMUa/4JoBUOjqrJUe4cckYPIjw2sw9rUFqfOqh9LiG76dCFvgBOKqZU3ZrEGT7/yE+VlMkHV+rON26+XWIet5nGZobPXZFm9gAgIkAav3b//X4=
Origin: 127.0.0.1
API Requests
The body of the API call is made up of the following parameters and values. Either the input_MsisdnToken or input_CustomerMSISDN must be supplied. If both are supplied they must match.

Parameter Name	Parameter Description	Parameter Mandatory	Parameter Regex Validation	Parameter Possible Values
input_QueryBalanceAmount	The option to specify an amount to check against the customer's balance. If true set the amount in the BalanceAmount	True	N/A 	True / False
input_BalanceAmount	The amount to query against the customer's balance to verify sufficient remaining balance to perform direct debit payment	False	^\d*.?\d+$ 	200 
input_Country	The country of the mobile money platform where the transaction needs happen on.	True	N/A	GHA
input_CustomerMSISDN	The MSISDN of the customer where funds will be debitted from.	False	^[0-9]{12,14}$	233508729395 
input_MsisdnToken	The previously returned encrypted MSISDN of the customer where funds will be debitted from. 	False	^[0-9a-zA-Z \w=]{1,26}$	cvgwUBZ3lAO9ivwhWAFeng==
input_ServiceProviderCode	The shortcode of the organization where funds will be creditted to.	True	^([0-9A-Za-z]{4,12})$	ORG001
input_ThirdPartyConversationID	The third party's transaction reference on their system.	True	^[0-9a-zA-Z \w+]{1,40}$	1e9b774d1da34af78412a498cbc28f5e
input_ThirdPartyReference	The direct debit's mandate reference	True	^[0-9a-zA-Z]{1,32}$	Test123
input_MandateID	Mandate ID for the Mandate as recorded on the Mobile Money Platform.	False	^[0-9]{1,12}$	15045
input_Currency	The currency in which the transaction should take place.	True	^[a-zA-Z]{1,3}$	GHS
API Responses
The response back to the application can either be synchronous or asynchronous, depending the business use case. Synchronous responses will make use of the same session to return the results. For asynchronous responses, the user will need to build a listener to receive the asynchronous response once the transaction has finalised on the payment system.
Synchronous Responses
Parameter Name	Parameter Description	Parameter Possible Values
output_ResponseCode	The result code for the transaction.	INS-0
output_ResponseDesc	The result description for the transaction.	Request processed successfully
output_TransactionReference	The transaction reference or mandate from the Mobile Money Platform.	vgisfyn4b22w6tmqjftatq75lyuie6vc
output_ConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
output_SufficientBalance	Indicate if the customer account has sufficient balance to perform Direct Debit Payment.	True
output_MsisdnToken	The encrypted MSISDN Token, which can be used as an identifier. Only returned in successful messages.	cvgwUBZ3lAO9ivwhWAFeng==
output_MandateID	Mandate ID for the Mandate as recorded on the Mobile Money Platform.	15132
output_MandateStatus	Return status of the mandate 	Active
output_AccountStatus	Return the customers M-Pesa account status 	Active
output_FirstPaymentDate	The Start date of the Mandate.	20221012
output_Frequency	The frequency of the payments [see table below]	02
output_PaymentDayFrom	The start range of days in the month.	01
output_PaymentDayTo	The end range of days in the month.	25
output_ExpiryDate	The expiry date of the Mandate.	20230410


Frequency Period	Value Description
01	Once off
02	Daily
03	Weekly
04	Monthly
05	Quarterly
06	Half Yearly
07	Yearly
08	On Demand
Asynchronous Responses
Once the transaction is initiated, the OpenAPI will respond synchronously with the following information before the session is closed. 

Parameter Name	Parameter Description	Parameter Possible Values
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	GPO3051656229
output_ConversationID	The OpenAPI platform generates this as a reference to the transaction.	ad5ea49c01a9484c80cefbf4437a756d
output_ResponseCode	The result code for the transaction.	INS-0
output_ResponseDesc	The result description for the transaction.	Request processed successfully


The Conversation ID can be used in a Query Transaction Status call to determine the status of the process flow. Once the transaction has been completed, the OpenAPI will provide the result of the transaction in an asynchronous message to the value listed in the Response URL of the request parameter in the body. Please note that the developed application will need to have a separate listener to receive the result. 

Parameter Name	Parameter Description	Parameter Possible Values
input_ResponseCode	The result code for the transaction.	INS-0
input_ResponseDesc	The result description for the transaction.	Request processed successfully
input_TransactionReference	The transaction reference or mandate from the Mobile Money Platform.	vgisfyn4b22w6tmqjftatq75lyuie6vc
input_OriginalConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
input_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
input_SufficientBalance	Indicate if the customer account has sufficient balance to perform Direct Debit Payment.	True
input_MsisdnToken	The encrypted MSISDN Token, which can be used as an identifier. Only returned in successful messages.	cvgwUBZ3lAO9ivwhWAFeng==
input_MandateID	Mandate ID for the Mandate as recorded on the Mobile Money Platform.	15132
input_MandateStatus	Return status of the mandate 	Active
input_AccountStatus	Return the customers M-Pesa account status 	Active
input_FirstPaymentDate	The Start date of the Mandate.	20221012
input_Frequency	The frequency of the payments [see table below]	02
input_PaymentDayFrom	The start range of days in the month.	01
input_PaymentDayTo	The end range of days in the month.	25
input_ExpiryDate	The expiry date of the Mandate.	20230410


It is expected that the listener confirms receipt of the result by responding the below content which closes out the session:
Parameter Name	Parameter Description	Parameter Possible Values
output_OriginalConversationID	The OpenAPI platform generates this as a reference to the transaction.	ad5ea49c01a9484c80cefbf4437a756d
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	GPO3051656229
output_ResponseCode	The result code for the transaction.	INS-0
output_ResponseDesc	The result description for the transaction.	Successfully Accepted Result
Response Codes
HTTP StatusCode	Response Code	Response Description
200	INS-0	Request processed successfully
400	INS-997	API Not Enabled
400	INS-20	Not All Parameters Provided. Please try again.
400	INS-13	Invalid Shortcode Used
400	INS-998	Invalid Market
400	INS-17	Invalid Transaction Reference. Length Should Be Between 1 and 20.
400	INS-26	Invalid Currency Used
400	INS-21	Parameter validations failed. Please try again.
400	INS-54	Invalid BalanceAmount Used
400	INS-51	Invalid MandateID Used
400	INS-58	No Active Mandate found
400	INS-19	Invalid ThirdPartyReference Used
400	INS-28	Invalid ThirdPartyConversationID Used
400	INS-2051	MSISDN invalid.
400	INS-50	MSISDN Token and MSISDN provided does not Match
401	INS-56	Invalid MSISDNToken Used
401	INS-54	Invalid BalanceAmount Used
401	INS-55	BalanceAmount is Mandatory when QueryBalanceAmount is True
408	INS-9	Request timeout
409	INS-10	Duplicate Transaction
422	INS-2006	Insufficient balance
500	INS-57	Either MSISDN or MSISDNToken required
500	INS-1	Internal Error
500	INS-52	The MandateID used does not correspond to the ThirdPartyReference used.
Sample Packets
Sample request and response packets.

If you want to make use of a end to end synchronous flow, use the following tabs:
Request (Thirdparty -> OpenAPI)
Sync Flow Response (OpenAPI -> Thirdparty)

If you want to make use of a end to end asynchronous flow, use the following tabs:
Request (Thirdparty -> OpenAPI)
Async Flow Response (OpenAPI -> Thirdparty)
OpenAPI Async Flow Request (OpenAPI -> Thirdparty)
ThirdParty Async Flow Response (Thirdparty -> OpenAPI)

When making a new request, either the input_MsisdnToken or input_CustomerMSISDN must be supplied. If both are supplied they must match.
{
  "input_QueryBalanceAmount": "True",
  "input_BalanceAmount": "100",
  "input_Country": "GHA",
  "input_CustomerMSISDN": "255744553111",
  "input_MsisdnToken": "cvgwUBZ3lAO9ivwhWAFeng==",
  "input_ServiceProviderCode": "112244",
  "input_ThirdPartyConversationID": "GPO3051656128",
  "input_ThirdPartyReference": "Test123"
  "input_MandateID": "15045",
  "input_Currency": "GHS"
}
Sample Code Snippets
Libraries Download
Libraries to assist with integrations.
Query Direct Debit
This API should always be used in conjunction with a valid SessionKey.
Please refer to the Generate SessionKey API documentation page to see how to generate a SessionKey or see the below combined API code snippet where the Generate SessionKey API is combined with the Query Direct Debit API.


Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below API section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {    
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArv9yxA69XQKBo24BaF/D+fvlqmGdYjqLQ5WtNBb5tquqGvAvG3WMFETVUSow/LizQalxj2ElMVrUmzu5mGGkxK08bWEXF7a1DEvtVJs6nppIlFJc2SnrU14AOrIrB28ogm58JjAl5BOQawOXD5dfSk7MaAA82pVHoIqEu0FxA8BOKU+RGTihRU+ptw1j4bsAJYiPbSX6i71gfPvwHPYamM0bfI4CmlsUUR3KvCG24rB6FNPcRBhM3jDuv8ae2kC33w9hEq8qNB55uw51vK7hyXoAa+U7IqP1y6nBdlN25gkxEA8yrsl1678cspeXr+3ciRyqoRgj9RD/ONbJhhxFvt1cLBh+qwK2eqISfBb06eRnNeC71oBokDm3zyCnkOtMDGl7IvnMfZfEPFCfg5QgJVk1msPpRvQxmEsrX9MQRyFVzgy2CWNIb7c+jPapyrNwoUbANlN8adU1m6yOuoX7F49x+OjiG2se0EJ6nafeKUXw/+hiJZvELUYgzKUtMAZVTNZfT8jjb58j8GVtuS+6TM2AutbejaCV84ZK58E2CRJqhmjQibEUO6KPdD7oTlEkFy52Y1uOOBXgYpqMzufNPmfdqqqSM4dU70PO8ogyKGiLAIxCetMjjm6FCMEA3Kc8K0Ig7/XtFm9By6VxTJK1Mg36TlHaZKP6VzVLXMtesJECAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Session key
            context.setApiKey("1bc4157dbee34d409118e0978dc6dd17");
            // Use ssl/https
            context.setSsl(true);
            // Method type (can be GET/POST/PUT)
            context.setMethodType(APIMethodTypes.GET);
            // API address
            context.setAddress("openapi.m-pesa.com");
            // API Port
            context.setPort(443);
            // API Path
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/querydirectDebit/");

            // Parameters can be added to the call as well that on POST will be in JSON format and on GET will be URL
            // parameters
            context.addParameter("input_QueryBalanceAmount", "True");
            context.addParameter("input_BalanceAmount", "100");            
            context.addParameter("input_Country", "GHA");
            context.addParameter("input_CustomerMSISDN", "255744553111");
            context.addParameter("input_MsisdnToken", "cvgwUBZ3lAO9ivwhWAFeng=="");
            context.addParameter("input_ServiceProviderCode", "112244");
            context.addParameter("input_ThirdPartyConversationID", "GPO3051656128");
            context.addParameter("input_ThirdPartyReference", "Test123");
            context.addParameter("input_MandateID", "15045");
            context.addParameter("input_Currency", "GHS");
            
            // Add/update headers
            context.addHeader("Origin", "*");

            // Create a request object
            APIRequest request = new APIRequest(context);
            
            // Do the API call and put result in a response packet
            APIResponse response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("API call failed to get result. Please check.");
            }

            // Display results
            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 
        }
    }
}
Query Direct Debit Combined
Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below API section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {    
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArv9yxA69XQKBo24BaF/D+fvlqmGdYjqLQ5WtNBb5tquqGvAvG3WMFETVUSow/LizQalxj2ElMVrUmzu5mGGkxK08bWEXF7a1DEvtVJs6nppIlFJc2SnrU14AOrIrB28ogm58JjAl5BOQawOXD5dfSk7MaAA82pVHoIqEu0FxA8BOKU+RGTihRU+ptw1j4bsAJYiPbSX6i71gfPvwHPYamM0bfI4CmlsUUR3KvCG24rB6FNPcRBhM3jDuv8ae2kC33w9hEq8qNB55uw51vK7hyXoAa+U7IqP1y6nBdlN25gkxEA8yrsl1678cspeXr+3ciRyqoRgj9RD/ONbJhhxFvt1cLBh+qwK2eqISfBb06eRnNeC71oBokDm3zyCnkOtMDGl7IvnMfZfEPFCfg5QgJVk1msPpRvQxmEsrX9MQRyFVzgy2CWNIb7c+jPapyrNwoUbANlN8adU1m6yOuoX7F49x+OjiG2se0EJ6nafeKUXw/+hiJZvELUYgzKUtMAZVTNZfT8jjb58j8GVtuS+6TM2AutbejaCV84ZK58E2CRJqhmjQibEUO6KPdD7oTlEkFy52Y1uOOBXgYpqMzufNPmfdqqqSM4dU70PO8ogyKGiLAIxCetMjjm6FCMEA3Kc8K0Ig7/XtFm9By6VxTJK1Mg36TlHaZKP6VzVLXMtesJECAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Api key
            context.setApiKey("6bc4157dbee34d409118e0978dc6dd17");
            // Use ssl/https
            context.setSsl(true);
            // Method type (can be GET/POST/PUT)
            context.setMethodType(APIMethodTypes.GET);
            // API address
            context.setAddress("openapi.m-pesa.com");
            // API Port
            context.setPort(443);
            // API Path
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/getSession/");

            // Parameters can be added to the call as well that on POST will be in JSON format and on GET will be URL
            // parameters
            // context.addParameter("key", "value");

            // Add/update headers
            context.addHeader("Origin", "*");

            // Create a request object
            APIRequest request = new APIRequest(context);
            
            // Do the API call and put result in a response packet
            APIResponse response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("SessionKey call failed to get result. Please check.");
            }

            // Display results
            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 

            String sessionId = response.getBody()["output_SessionID"];

            // The above call issued a sessionID which will be used as the API key in calls that needs the sessionID
            context = new APIContext();
            context.setPublicKey(publicKey);
            context.setApiKey(sessionId);
            context.setSsl(true);
            context.setMethodType(APIMethodTypes.GET);
            context.setAddress("openapi.m-pesa.com");
            context.setPort(443);
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/queryDirectDebit/");

            context.addParameter("input_QueryBalanceAmount", "True");
            context.addParameter("input_BalanceAmount", "100");            
            context.addParameter("input_Country", "GHA");
            context.addParameter("input_CustomerMSISDN", "255744553111");
            context.addParameter("input_MsisdnToken", "cvgwUBZ3lAO9ivwhWAFeng=="");
            context.addParameter("input_ServiceProviderCode", "112244");
            context.addParameter("input_ThirdPartyConversationID", "GPO3051656128");
            context.addParameter("input_ThirdPartyReference", "Test123");
            context.addParameter("input_MandateID", "15045");
            context.addParameter("input_Currency", "GHS");
            
            context.addHeader("Origin", "*");

            request = new APIRequest(context);
            
            // SessionID can take up to 30 seconds to become 'live' in the system and will be invalid until it is
            Thread.Sleep(30 * 1000);
            
            response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("API call failed to get result. Please check.");
            }  

            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 
        }
    }
}

Cancel Direct Debit
API Description
Direct Debits are payments in M-Pesa that are initiated by the Payee alone without any Payer interaction, but permission must first be granted by the Payer. The granted permission from the Payer to Payee is commonly termed a ‘Mandate’, and M-Pesa must hold details of this Mandate. 

The Direct Debit API set allows an organisation to get the initial consent of their customers to create the Mandate that allows the organisation to debit customer's account at an agreed frequency and amount for services rendered. After the initial consent, the debit of the account will not involve any customer interaction. The Direct Debit feature makes use of the following API calls:
•	Create a Direct Debit mandate
•	Pay a  Direct Debit mandate
•	Query the Status of a  Direct Debit mandate
•	Cancel a  Direct Debit mandate

The customer is able to view and cancel the Direct Debit mandate from G2 menu accessible via USSD menu or the Smartphone Application.
Make REST API Call
API Endpoint
In REST API calls, use the following URL as the API service endpoint for the chosen environment:

Site	SSL	HTTP Method	Host	Port	Context
Sandbox	True	PUT	openapi.m-pesa.com	443	/sandbox/ipg/v2/[market]/directDebitCancel/
OpenAPI	True	PUT	openapi.m-pesa.com	443	/openapi/ipg/v2/[market]/directDebitCancel/
Replace the [market] parameter with the appropriate values from the below tables:
API Markets
Description	URL Context Value	input_Country Value
Vodacom DR Congo	vodacomDRC	DRC
Vodacom Lesotho	vodacomLES	LES
Vodacom Tanzania	vodacomTZN	TZN
Vodafone Ghana	vodafoneGHA	GHA
Vodacom Mozambique	vodacomMOZ	MOZ
API Setup Example
PUT https://openapi.m-pesa.com/sandbox/ipg/v2/vodafoneGHA/directDebitCancel/
API Header
The header of the API call makes use of the Session Key received from the Generate SessionKey API call when authorising and authenticating the calling party.

Header Name	Header Value	Header Description
Content-Type	application/json	The content-type of the API
Authorization	Bearer [encrypted-SessionKey]	Bearer token authorization is used. The encrypted SessionKey needs to be used.
Origin	*	Used to limit the origin of the API caller to specific systems. Use the domain name or IP address. Should match the value(s) defined in your Application.
API Requests
The body of the API call is made up of the following parameters and values. Either the input_MsisdnToken or input_CustomerMSISDN must be supplied. If both are supplied they must match.

Parameter Name	Parameter Description	Parameter Mandatory	Parameter Regex Validation	Parameter Possible Values
input_MsisdnToken	The previously returned encrypted MSISDN of the customer where funds will be debitted from. 	False	^[0-9a-zA-Z \w=]{1,26}$	cvgwUBZ3lAO9ivwhWAFeng==
input_CustomerMSISDN	The MSISDN of the customer where funds will be debitted from.	False	^[0-9]{12,14}$	254707161122
input_Country	The country of the mobile money platform where the transaction needs happen on.	True	N/A	GHA
input_ServiceProviderCode	The shortcode of the organization where funds will be creditted to.	True	^([0-9A-Za-z]{4,12})$	ORG001
input_ThirdPartyReference	The direct debit's mandate reference	True	^[0-9a-zA-Z]{1,32}$	Test123
input_ThirdPartyConversationID	The third party's transaction reference on their system.	True	^[0-9a-zA-Z \w+]{1,40}$	1e9b774d1da34af78412a498cbc28f5e
input_MandateID	Mandate ID for the Mandate as recorded on the Mobile Money Platform.	False	^[0-9]{1,12}$	15045
API Responses
The response back to the application can either be synchronous or asynchronous, depending the business use case. Synchronous responses will make use of the same session to return the results. For asynchronous responses, the user will need to build a listener to receive the asynchronous response once the transaction has finalised on the payment system.
Synchronous Responses
Parameter Name	Parameter Description	Parameter Possible Values
output_ResponseCode	The result code for the transaction.	INS-0
output_ResponseDesc	The result description for the transaction.	Request processed successfully
output_TransactionReference	The transaction reference or mandate from the Mobile Money Platform.	Test123
output_MsisdnToken	The encrypted MSISDN Token, which can be used as an identifier. Only returned in successful messages.	cvgwUBZ3lAO9ivwhWAFeng==
output_ConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
Asynchronous Responses
Once the transaction is initiated, the OpenAPI will respond synchronously with the following information before the session is closed. 

Parameter Name	Parameter Description	Parameter Possible Values
output_ResponseCode	The result code for the transaction.	INS-0
output_ResponseDesc	The result description for the transaction.	Request processed successfully
output_ConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e


The Conversation ID can be used in a Query Transaction Status call to determine the status of the process flow. Once the transaction has been completed, the OpenAPI will provide the result of the transaction in an asynchronous message to the value listed in the Response URL of the request parameter in the body. Please note that the developed application will need to have a separate listener to receive the result. 

Parameter Name	Parameter Description	Parameter Possible Values
input_OriginalConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
input_TransactionReference	The transaction reference or mandate from the Mobile Money Platform.	Test123
input_MsisdnToken	The encrypted MSISDN Token, which can be used as an identifier. Only returned in successful messages.	cvgwUBZ3lAO9ivwhWAFeng==
input_ResultCode	The result code for the transaction.	INS-0
input_ResultDesc	The result description for the transaction.	Request processed successfully
input_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e


It is expected that the listener confirms receipt of the result by responding the below content which closes out the session:
Parameter Name	Parameter Description	Parameter Possible Values
output_OriginalConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ResponseCode	The result code for the transaction.	0
output_ResponseDesc	The result description for the transaction.	 Successfully Accepted Result 
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
Response Codes
HTTP StatusCode	Response Code	Response Description
201	INS-0	Request processed successfully
400	INS-1	Internal Error
401	INS-6	Mandate does not exist
408	INS-9	Request timeout
409	INS-10	Duplicate Transaction
400	INS-13	Invalid Shortcode Used
400	INS-19	Invalid ThirdPartyReference Used.
400	INS-20	Not All Parameters Provided. Please try again.
400	INS-21	Parameter validations failed. Please try again.
400	INS-28	Invalid ThirdPartyConversationID Used
400	INS-30	Invalid Purchased Items Description Used
400	INS-50	MSISDN Token and MSISDN provided does not Match
400	INS-51	Invalid MandateID Used
400	INS-52	The MandateID used does not correspond to the ThirdPartyReference used.
400	INS-990	Customer Transaction Value Limit Breached
400	INS-991	Customer Transaction Count Limit Breached
400	INS-992	Multiple Limits Breached
400	INS-993	Organization Transaction Count Limit Breached
400	INS-994	Organization Transaction Value Limit Breached
400	INS-995	API Single Transaction Limit Breached
400	INS-996	API Being Used Outside Of Usage Time
400	INS-997	API Not Enabled
400	INS-998	Invalid Market
422	INS-2006	Insufficient balance
400	INS-2051	MSISDN invalid.
Sample Packets
Sample request and response packets.

If you want to make use of a end to end synchronous flow, use the following tabs:
Request (Thirdparty -> OpenAPI)
Sync Flow Response (OpenAPI -> Thirdparty)

If you want to make use of a end to end asynchronous flow, use the following tabs:
Request (Thirdparty -> OpenAPI)
Async Flow Response (OpenAPI -> Thirdparty)
OpenAPI Async Flow Request (OpenAPI -> Thirdparty)
ThirdParty Async Flow Response (Thirdparty -> OpenAPI)

When making a new payment request, either the input_MsisdnToken or input_CustomerMSISDN must be supplied. If both are supplied they must match.
{
  "input_Country": "GHA",
  "input_CustomerMSISDN": "000000000001",
  "input_ServiceProviderCode": "000000",
  "input_ThirdPartyConversationID": "AAA6d1f939c1005v2de053v4912jbasdj1j2kk",
  "input_MandateID": "15045",
  "input_ThirdPartyReference": "00000000000000000001"
}
Sample Code Snippets
Libraries Download
Libraries to assist with integrations.
Direct Debit Payment
This API should always be used in conjunction with a valid SessionKey.
Please refer to the Generate SessionKey API documentation page to see how to generate a SessionKey or see the below combined API code snippet where the Generate SessionKey API is combined with the Direct Debit Payment API.


Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below API section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {    
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAszE+xAKVB9HRarr6/uHYYAX/RdD6KGVIGlHv98QKDIH26ldYJQ7zOuo9qEscO0M1psSPe/67AWYLEXh13fbtcSKGP6WFjT9OY6uV5ykw9508x1sW8UQ4ZhTRNrlNsKizE/glkBfcF2lwDXJGQennwgickWz7VN+AP/1c4DnMDfcl8iVIDlsbudFoXQh5aLCYl+XOMt/vls5a479PLMkPcZPOgMTCYTCE6ReX3KD2aGQ62uiu2T4mK+7Z6yvKvhPRF2fTKI+zOFWly//IYlyB+sde42cIU/588msUmgr3G9FYyN2vKPVy/MhIZpiFyVc3vuAAJ/mzue5p/G329wzgcz0ztyluMNAGUL9A4ZiFcKOebT6y6IgIMBeEkTwyhsxRHMFXlQRgTAufaO5hiR/usBMkoazJ6XrGJB8UadjH2m2+kdJIieI4FbjzCiDWKmuM58rllNWdBZK0XVHNsxmBy7yhYw3aAIhFS0fNEuSmKTfFpJFMBzIQYbdTgI28rZPAxVEDdRaypUqBMCq4OstCxgGvR3Dy1eJDjlkuiWK9Y9RGKF8HOI5a4ruHyLheddZxsUihziPF9jKTknsTZtF99eKTIjhV7qfTzxXq+8GGoCEABIyu26LZuL8X12bFqtwLAcjfjoB7HlRHtPszv6PJ0482ofWmeH0BE8om7VrSGxsCAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Session key
            context.setApiKey("1bc4157dbee34d409118e0978dc6dd17");
            // Use ssl/https
            context.setSsl(true);
            // Method type (can be GET/POST/PUT)
            context.setMethodType(APIMethodTypes.POST);
            // API address
            context.setAddress("openapi.m-pesa.com");
            // API Port
            context.setPort(443);
            // API Path
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/directDebitPayment/");

            // Parameters can be added to the call as well that on POST will be in JSON format and on GET will be URL
            // parameters
            // context.addParameter("key", "value");
            context.addParameter("input_Country", "GHA");
            context.addParameter("input_CustomerMSISDN", "000000000001");
            context.addParameter("input_ServiceProviderCode", "000000");
            context.addParameter("input_ThirdPartyConversationID", "asv02e5958774f7ba228d83d0d689761");
            context.addParameter("input_ThirdPartyReference", "00000000000000000001");
                          
            // Add/update headers
            context.addHeader("Origin", "*");

            // Create a request object
            APIRequest request = new APIRequest(context);
            
            // Do the API call and put result in a response packet
            APIResponse response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("API call failed to get result. Please check.");
            }

            // Display results
            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 
        }
    }
}
Direct Debit Payment Combined
Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below API section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {    
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAszE+xAKVB9HRarr6/uHYYAX/RdD6KGVIGlHv98QKDIH26ldYJQ7zOuo9qEscO0M1psSPe/67AWYLEXh13fbtcSKGP6WFjT9OY6uV5ykw9508x1sW8UQ4ZhTRNrlNsKizE/glkBfcF2lwDXJGQennwgickWz7VN+AP/1c4DnMDfcl8iVIDlsbudFoXQh5aLCYl+XOMt/vls5a479PLMkPcZPOgMTCYTCE6ReX3KD2aGQ62uiu2T4mK+7Z6yvKvhPRF2fTKI+zOFWly//IYlyB+sde42cIU/588msUmgr3G9FYyN2vKPVy/MhIZpiFyVc3vuAAJ/mzue5p/G329wzgcz0ztyluMNAGUL9A4ZiFcKOebT6y6IgIMBeEkTwyhsxRHMFXlQRgTAufaO5hiR/usBMkoazJ6XrGJB8UadjH2m2+kdJIieI4FbjzCiDWKmuM58rllNWdBZK0XVHNsxmBy7yhYw3aAIhFS0fNEuSmKTfFpJFMBzIQYbdTgI28rZPAxVEDdRaypUqBMCq4OstCxgGvR3Dy1eJDjlkuiWK9Y9RGKF8HOI5a4ruHyLheddZxsUihziPF9jKTknsTZtF99eKTIjhV7qfTzxXq+8GGoCEABIyu26LZuL8X12bFqtwLAcjfjoB7HlRHtPszv6PJ0482ofWmeH0BE8om7VrSGxsCAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Api key
            context.setApiKey("6bc4157dbee34d409118e0978dc6dd17");
            // Use ssl/https
            context.setSsl(true);
            // Method type (can be GET/POST/PUT)
            context.setMethodType(APIMethodTypes.GET);
            // API address
            context.setAddress("openapi.m-pesa.com");
            // API Port
            context.setPort(443);
            // API Path
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/getSession/");

            // Parameters can be added to the call as well that on POST will be in JSON format and on GET will be URL
            // parameters
            // context.addParameter("key", "value");

            // Add/update headers
            context.addHeader("Origin", "*");

            // Create a request object
            APIRequest request = new APIRequest(context);
            
            // Do the API call and put result in a response packet
            APIResponse response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("SessionKey call failed to get result. Please check.");
            }

            // Display results
            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 

            String sessionId = response.getBody()["output_SessionID"];

            // The above call issued a sessionID which will be used as the API key in calls that needs the sessionID
            context = new APIContext();
            context.setPublicKey(publicKey);
            context.setApiKey(sessionId);
            context.setSsl(true);
            context.setMethodType(APIMethodTypes.POST);
            context.setAddress("openapi.m-pesa.com");
            context.setPort(443);
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/directDebitPayment/");

            context.addParameter("input_Country", "GHA");
            context.addParameter("input_CustomerMSISDN", "000000000001");
            context.addParameter("input_ServiceProviderCode", "000000");
            context.addParameter("input_ThirdPartyConversationID", "asv02e5958774f7ba228d83d0d689761");
            context.addParameter("input_ThirdPartyReference", "00000000000000000001");
            
            context.addHeader("Origin", "*");

            request = new APIRequest(context);

            // SessionID can take up to 30 seconds to become 'live' in the system and will be invalid until it is
            Thread.Sleep(30 * 1000);
            
            response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("API call failed to get result. Please check.");
            } 

            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 
        }
    }
}

Reversal
PI Description
The Reversal API is used to reverse a successful transaction. 
Using the Transaction ID of a previously successful transaction,  the OpenAPI will withdraw the funds from the recipient party’s mobile money wallet and revert the funds to the mobile money wallet of the initiating party of the original transaction.
Make REST API Call
API Endpoint
Use the following URL as the API service endpoint for the chosen environment:

Site	SSL	HTTP Method	Host	Port	Context
Sandbox	True	PUT	openapi.m-pesa.com	443	/sandbox/ipg/v2/[market]/reversal/
OpenAPI	True	PUT	openapi.m-pesa.com	443	/openapi/ipg/v2/[market]/reversal/
Replace the [market] and [currency] parameters with the appropriate values from the below table:
API Markets
Description	URL Context Value	input_Country Value	input_Currency Value
Vodafone Ghana	vodafoneGHA	GHA	GHS
Vodacom Tanzania	vodacomTZN	TZN	TZS
Vodacom Lesotho	vodacomLES	LES	LSL
Vodacom DR Congo	vodacomDRC	DRC	USD
Vodacom Mozambique	vodacomMOZ	MOZ	MZN
API Setup Example
PUT https://openapi.m-pesa.com/sandbox/ipg/v2/vodafoneGHA/reversal/
API Header
The header of the API call makes  use of the Session Key received from the Generate SessionKey API call when authorising and authenticating the calling party.

Header Name	Header Value	Header Description
Content-Type	application/json	The content-type of the API
Authorization	Bearer [encrypted-SessionKey]	Bearer token authorization is used. The encrypted SessionKey needs to be used.
Origin	*	Used to limit the origin of the API caller  to specific systems. Use the domain name or IP address. Should match the value(s) defined in your Application.
Content-Type:  application/json
Authorization: Bearer K2sf0ne61AocJqWxO3kTHMBmLl0fQyBQWV7GfH3z1kMxV qMCB7sMXn+CKigIPIawHoNr2IrGdjBdFugyHNxRnGkrfSDkC9PFBhR/D9ePdw15jgggnG8FItGpw4TEwECgzk0sEmYmKaB9K6lgvs4rs7TMPpTom7uX72+tZ+qMqRVt7LrGsngBrkXjbOxc19fkImVHjehzjVCOSOsROsx4nRlM9wtl4KSLgKCBzmLePRmwu/IOCF3NrIQLVYYqUDDSgYbHURk1L6d4kxJffFM/wa2BPoeuG59gcgldyEaQ5Sv5VnaGKDh1XTBrvKS+J9Efwg7s1CWLQxhtYdr+Z2eorC1QjbxwW+LbiIChiu/wSVRY6/9p41QbXEsBoIEESPD8JIfxGM/HFRhRmiVN2LGiUX8+5O1piXq4JRrBz+VrQ1HXpDKQj4+MAipVPqL4jsQhbbOQ/OvZa3uA18oA9FXpsC41siVApduLOlK8OxJPvygtB1gMlSisOHLWiZGWjY7uEu9CvW9LPlcz4MzHhIg6/Vemj5KyT/Mcn/874K8LgZG8eTnzBac3nvrsl2k5BnMUa/4JoBUOjqrJUe4cckYPIjw2sw9rUFqfOqh9LiG76dCFvgBOKqZU3ZrEGT7/yE+VlMkHV+rON26+XWIet5nGZobPXZFm9gAgIkAav3b//X4=
Origin:  127.0.0.1
API Requests
The body of the API call is made up of the following parameters and values:
Parameter Name	Parameter Description	Parameter Mandatory	Parameter Regex Validation	Parameter Possible Values
input_ReversalAmount	The transaction amount that needs to be reversed. If the full amount for the transaction needs to be reversed, this field can be omitted.	False	^\d*\.?\d+$	10.00
input_Country	The country of the mobile money platform where the transaction needs happen on.	True	N/A	GHA
input_TransactionID	The transaction identifier that needs to be reversed.	True	^[0-9a-zA-Z]{1,20}$	49XCD123F6
input_ServiceProviderCode	The shortcode of the organization where funds will be creditted to.	True	^([0-9A-Za-z]{4,12})$	ORG001
input_ThirdPartyConversationID	The third party's transaction reference on their system.	True	^[0-9a-zA-Z \w+]{1,40}$	1e9b774d1da34af78412a498cbc28f5e
API Responses
The response back to the application can either be synchronous or asynchronous,  depending the business use case. Synchronous responses will make use of the same session to return the results. For asynchronous responses, the user will need to build a listener to receive the asynchronous response once the transaction has finalised on the  payment system.
Synchronous Responses
Parameter Name	Parameter  Description	Parameter Possible Values
output_ResponseCode	The result code for the transaction.	INS-0
output_ResponseDesc	The result description for the transaction.	Request processed successfully
output_TransactionID	The transaction identifier that gets generated on the Mobile Money platform. This is used to query transactions on the Mobile Money  Platform.	hv9ahxcg4ccv
output_ConversationID	The  OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
Asynchronous Responses
Once the transaction is initiated, the OpenAPI will respond  synchronously with the following information before the session is closed. 

Parameter Name	Parameter Description	Parameter Possible Values
output_ResponseCode	The  response code for the transaction.	INS-0
output_ResponseDesc	The result description for the transaction.	Request processed successfully
output_ConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ThirdPartyConversationID	The incoming reference from the third party system. When there are queries about transactions,  this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e


The Conversation ID can be used in a Query Transaction  Status call to determine the status of the process flow. Once the transaction has been completed, the OpenAPI will provide the result of the transaction in an asynchronous message to the value listed in the Response URL of the request parameter in the body.  Please note that the developed application will need to have a separate listener to receive the result. 

Parameter Name	Parameter Description	Parameter Possible Values
input_OriginalConversationID	The  OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
input_TransactionID	The transaction identifier that gets generated on the Mobile Money platform. This is used to query transactions on the Mobile Money Platform.	hv9ahxcg4ccv
input_ResultCode	The result code for the transaction.	INS-0
input_ResultDesc	The result description for the transaction.	Request  processed successfully
input_ThirdPartyConversationID	The incoming reference from the  third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e


It  is expected that the listener confirms receipt of the result by responding the below content which closes out the session:
Parameter Name	Parameter Description	Parameter Possible Values
output_OriginalConversationID	The OpenAPI platform generates this as a reference to the transaction.	fd1e9143d22544459f7c66e1860ef276
output_ResponseCode	The result code for the transaction.	0
output_ResponseDesc	The result description for the transaction.	  Successfully Accepted Result 
output_ThirdPartyConversationID	The incoming reference  from the third party system. When there are queries about transactions, this will usually be used to track a transaction.	1e9b774d1da34af78412a498cbc28f5e
Response Codes
HTTP StatusCode	Response Code	Response Description
201	INS-0	Request processed successfully
400	INS-1	Internal Error
401	INS-6	Transaction Failed
408	INS-9	Request timeout
409	INS-10	Duplicate Transaction
400	INS-13	Invalid Shortcode Used
400	INS-15	Invalid Amount Used
400	INS-18	Invalid TransactionID Used
400	INS-20	Not All Parameters Provided. Please try again.
400	INS-21	Parameter validations failed. Please try again.
400	INS-28	Invalid ThirdPartyConversationID Used
400	INS-35	This transaction do not belong to you
400	INS-996	API Being Used Outside Of Usage Time
400	INS-997	API Not Enabled
400	INS-998	Invalid Market
422	INS-2006	Insufficient balance
Sample Packets
Sample  request and response packets.

If you want to make use of a end to end synchronous flow, use the following tabs:
Request (Thirdparty -> OpenAPI)
Sync Flow Response (OpenAPI -> Thirdparty)

If you want to make use of a end to end asynchronous  flow, use the following tabs:
Request (Thirdparty -> OpenAPI)
Async Flow Response (OpenAPI -> Thirdparty)
OpenAPI Async Flow Request (OpenAPI -> Thirdparty)
ThirdParty Async Flow Response (Thirdparty -> OpenAPI)
{
  "input_Country": "GHA", 
  "input_ReversalAmount": "25", 
  "input_ServiceProviderCode": "000000", 
  "input_ThirdPartyConversationID": "asv02e5958774f7ba228d83d0d689761", 
  "input_TransactionID":  "0000000000001"
}
Sample Code Snippets
Libraries Download
Libraries to assist with integrations.
Reversal
This API should always be used in conjunction with a valid SessionKey.
Please refer to the Generate SessionKey API documentation page to see how to generate a SessionKey or see the below combined API code snippet where the Generate SessionKey API is combined with the Reversal API.


Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below API section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {    
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArv9yxA69XQKBo24BaF/D+fvlqmGdYjqLQ5WtNBb5tquqGvAvG3WMFETVUSow/LizQalxj2ElMVrUmzu5mGGkxK08bWEXF7a1DEvtVJs6nppIlFJc2SnrU14AOrIrB28ogm58JjAl5BOQawOXD5dfSk7MaAA82pVHoIqEu0FxA8BOKU+RGTihRU+ptw1j4bsAJYiPbSX6i71gfPvwHPYamM0bfI4CmlsUUR3KvCG24rB6FNPcRBhM3jDuv8ae2kC33w9hEq8qNB55uw51vK7hyXoAa+U7IqP1y6nBdlN25gkxEA8yrsl1678cspeXr+3ciRyqoRgj9RD/ONbJhhxFvt1cLBh+qwK2eqISfBb06eRnNeC71oBokDm3zyCnkOtMDGl7IvnMfZfEPFCfg5QgJVk1msPpRvQxmEsrX9MQRyFVzgy2CWNIb7c+jPapyrNwoUbANlN8adU1m6yOuoX7F49x+OjiG2se0EJ6nafeKUXw/+hiJZvELUYgzKUtMAZVTNZfT8jjb58j8GVtuS+6TM2AutbejaCV84ZK58E2CRJqhmjQibEUO6KPdD7oTlEkFy52Y1uOOBXgYpqMzufNPmfdqqqSM4dU70PO8ogyKGiLAIxCetMjjm6FCMEA3Kc8K0Ig7/XtFm9By6VxTJK1Mg36TlHaZKP6VzVLXMtesJECAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Session key
            context.setApiKey("6bc4157dbowkdd409118e0978dc6991a");
            // Use ssl/https
            context.setSsl(true);
            // Method type (can be GET/POST/PUT)
            context.setMethodType(APIMethodTypes.PUT);
            // API address
            context.setAddress("openapi.m-pesa.com");
            // API Port
            context.setPort(443);
            // API Path
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/reversal/");

            // Parameters can be added to the call as well that on POST will be in JSON format and on GET will be URL
            // parameters
            // context.addParameter("key", "value");
            context.addParameter("input_ReversalAmount", "25");
            context.addParameter("input_Country", "GHA");
            context.addParameter("input_ServiceProviderCode", "000000");
            context.addParameter("input_ThirdPartyConversationID", "asv02e5958774f7ba228d83d0d689761");
            context.addParameter("input_TransactionID", "0000000000001");
            
            // Add/update headers
            context.addHeader("Origin", "*");

            // Create a request object
            APIRequest request = new APIRequest(context);
            
            // Do the API call and put result in a response packet
            APIResponse response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("API call failed to get result. Please check.");
            }

            // Display results
            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 
        }
    }
}
Reversal Combined
Please ensure that you have downloaded the latest library for your coding language above before attempting to use the below API section
using System;
using System.Collections.Generic;
using System.Threading;
using PortalSDK;

namespace dotnet
{
    class Program
    {
        static void Main(string[] args)
        {    
            // Public key on the API listener used to encrypt keys
            String publicKey = "MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEArv9yxA69XQKBo24BaF/D+fvlqmGdYjqLQ5WtNBb5tquqGvAvG3WMFETVUSow/LizQalxj2ElMVrUmzu5mGGkxK08bWEXF7a1DEvtVJs6nppIlFJc2SnrU14AOrIrB28ogm58JjAl5BOQawOXD5dfSk7MaAA82pVHoIqEu0FxA8BOKU+RGTihRU+ptw1j4bsAJYiPbSX6i71gfPvwHPYamM0bfI4CmlsUUR3KvCG24rB6FNPcRBhM3jDuv8ae2kC33w9hEq8qNB55uw51vK7hyXoAa+U7IqP1y6nBdlN25gkxEA8yrsl1678cspeXr+3ciRyqoRgj9RD/ONbJhhxFvt1cLBh+qwK2eqISfBb06eRnNeC71oBokDm3zyCnkOtMDGl7IvnMfZfEPFCfg5QgJVk1msPpRvQxmEsrX9MQRyFVzgy2CWNIb7c+jPapyrNwoUbANlN8adU1m6yOuoX7F49x+OjiG2se0EJ6nafeKUXw/+hiJZvELUYgzKUtMAZVTNZfT8jjb58j8GVtuS+6TM2AutbejaCV84ZK58E2CRJqhmjQibEUO6KPdD7oTlEkFy52Y1uOOBXgYpqMzufNPmfdqqqSM4dU70PO8ogyKGiLAIxCetMjjm6FCMEA3Kc8K0Ig7/XtFm9By6VxTJK1Mg36TlHaZKP6VzVLXMtesJECAwEAAQ==";
            // Create Context with API to request a Session ID
            APIContext context = new APIContext();
            // Public key
            context.setPublicKey(publicKey);
            // Api key
            context.setApiKey("6bc4157dbee34d409118e0978dc6dd17");
            // Use ssl/https
            context.setSsl(true);
            // Method type (can be GET/POST/PUT)
            context.setMethodType(APIMethodTypes.GET);
            // API address
            context.setAddress("openapi.m-pesa.com");
            // API Port
            context.setPort(443);
            // API Path
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/getSession/");

            // Parameters can be added to the call as well that on POST will be in JSON format and on GET will be URL
            // parameters
            // context.addParameter("key", "value");

            // Add/update headers
            context.addHeader("Origin", "*");

            // Create a request object
            APIRequest request = new APIRequest(context);
            
            // Do the API call and put result in a response packet
            APIResponse response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("SessionKey call failed to get result. Please check.");
            }

            // Display results
            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 

            String sessionId = response.getBody()["output_SessionID"];

            // The above call issued a sessionID which will be used as the API key in calls that needs the sessionID
            context = new APIContext();
            context.setPublicKey(publicKey);
            context.setApiKey(sessionId);
            context.setSsl(true);
            context.setMethodType(APIMethodTypes.PUT);
            context.setAddress("openapi.m-pesa.com");
            context.setPort(443);
            context.setPath("/sandbox/ipg/v2/vodafoneGHA/reversal/");

            context.addParameter("input_ReversalAmount", "25");
            context.addParameter("input_Country", "GHA");
            context.addParameter("input_ServiceProviderCode", "000000");
            context.addParameter("input_ThirdPartyConversationID", "asv02e5958774f7ba228d83d0d689761");
            context.addParameter("input_TransactionID", "0000000000001");
            
            context.addHeader("Origin", "*");

            request = new APIRequest(context);
            
            // SessionID can take up to 30 seconds to become 'live' in the system and will be invalid until it is
            Thread.Sleep(30 * 1000);
            
            response = null;
            try {
               response = request.excecute();
            } catch (Exception e) {
                 Console.WriteLine("Call failed: {0}", e.Message);
            }
            
            if (response == null) {
                 throw new Exception("API call failed to get result. Please check.");
            } 

            Console.WriteLine(response.getStatusCode());
            foreach(KeyValuePair<String, String> header in response.getHeaders())
            {
                 Console.WriteLine(header.Key + ": " + header.Value);
            } 

            foreach(KeyValuePair<String, String> item in response.getBody())
            {
                 Console.WriteLine(item.Key + ": " + item.Value);
            } 
        }
    }
}


Here are the services that I have activated for mpesa:

B2B. SINGLE PAYMENT
B2C single payment
C2B SINGLE PAYMENT
DIRECT DEBIT
QUERY BENEFICIARY NAME
QUERY DIRECT DEBIT
CANCEL DIRECT DEBIT
REVERSAL
TX STATUS QUERY