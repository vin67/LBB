/*
This service retrives services based on the category selected or the question asked to Watsons
answerQueriesCat = Returns services based on category
answerQueries = Returns services based on watson
*/

//Declare logger
var log4js = require('log4js');

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/service.log'), 'questionAnswer');
var logger = log4js.getLogger('questionAnswer');
watson = require('watson-developer-cloud');
//var retrieveAnswerModule = require('../utils/retrieveAnswer.js');
//export function to be available in app
// Expecting a GET request like /api/questionAnswer?question=services
// This is a skeleton
var Promise = require('bluebird');
var request = Promise.promisify(require("request"));


// This returns a full list of services & sorts them into their category's
exports.answerQueriesCat = function(req, res) {

 function ClientError(e) {
    return e.code >= 400 && e.code < 500;
  };
  
  // Get service information from api
  var fullUrl = req.protocol + '://' + req.get('host') + '/getServiceInformation';
  request(fullUrl).then(function(contents) {
    var data = JSON.parse(contents[1]);

    var result = [];
    var arrayLength = data['rows'].length;
    for (var i = 0; i < arrayLength; i++) {

        // Add a record for each category that the service has listed
        var c_youth = data['rows'][i]['value']['C_youth'];
        var c_health = data['rows'][i]['value']['C_health'];
        var c_web = data['rows'][i]['value']['C_web'];
        var c_tele = data['rows'][i]['value']['C_tele'];

        var d_youth = data['rows'][i]['value']['D_youth'];
        var d_health = data['rows'][i]['value']['D_health'];
        var d_web = data['rows'][i]['value']['D_web'];
        var d_tele = data['rows'][i]['value']['D_tele']; 
        
        if(c_youth == 1) {
          var record = {};
          record["ServiceName"] = data['rows'][i]['value']['S_name'];
          record["ServiceType"] = 'Youth';
          record["URL"] = data['rows'][i]['value']['S_url'];
          record["TelephoneNumber"] = data['rows'][i]['value']['A_phone'];
          record["AdditionalInfo"] = d_youth;
          result.push(record); 
        }

        if(c_health == 1) {
          var record = {};
          record["ServiceName"] = data['rows'][i]['value']['S_name'];
          record["ServiceType"] = 'Health';
          record["URL"] = data['rows'][i]['value']['S_url'];
          record["TelephoneNumber"] = data['rows'][i]['value']['A_phone'];
          record["AdditionalInfo"] = d_health;
          result.push(record);
        }

        if(c_web == 1) {
          var record = {};
          record["ServiceName"] = data['rows'][i]['value']['S_name'];
          record["ServiceType"] = 'Web';
          record["URL"] = data['rows'][i]['value']['S_url'];
          record["TelephoneNumber"] = data['rows'][i]['value']['A_phone'];
          record["AdditionalInfo"] = d_web;
          result.push(record);
        }

        if(c_tele == 1) {
          var record = {};
          record["ServiceName"] = data['rows'][i]['value']['S_name'];
          record["ServiceType"] = 'Telephone';
          record["URL"] = data['rows'][i]['value']['S_url'];
          record["TelephoneNumber"] = data['rows'][i]['value']['A_phone'];
          record["AdditionalInfo"] = d_tele;
          result.push(record);
        }
    }

    res.json(result);

  }).catch(ClientError, function(e) {
    //A client error like 400 Bad Request happened
  });
}

exports.answerQueries = function(req, res) {
  console.log('service lookup');

  var serviceLookup = {
    Headspace: {
      serviceName: 'headspace',
      serviceType: 'Web',
      url: 'http://headspace.org.au/',
      additionalInfo: 'This website can give you useful information and advise you on where to get help for mental health problems and what to expect when you get there. The site also gives you information on the group programs available.'
    },
    NSWMentalHelpLine: {
      serviceName: 'NSW Mental Health Info Service',
      serviceType: 'Telephone',
      telephoneNumber: '1300 794 991',
      additionalInfo: 'Mon, Tues, Thurs & Fri 9.30am – 5.00pm Wed 12.30pm – 5.00pm'
    },
    Sane: {
      serviceName: 'SANE Australia',
      serviceType: 'Web',
      url: 'https://www.sane.org/',
      additionalInfo: 'Visit the SANE website to access online information and factsheets about mental health problems that you or a member of your family might be experiencing. Go to the information menu and select Factsheets.'
    },
    SalvosCareLine: {
      serviceName: 'SalvosCareLine',
      serviceType: 'Telephone',
      telephoneNumber: '1300 363 622 or 02 9360 3000',
      additionalInfo: '24 hour telephone counselling service.'
    },
    COPMI: {
      serviceName: 'Children of Parents with Mental Illness (COPMI)',
      serviceType: 'Web',
      url: 'http://www.copmi.net.au/',
      additionalInfo: 'This is a great website if you have a parent with mental illness or to pass on if you know someone who does. The site can link you to even more websites and provide tips and information.'
    },
    LawAndLegalAdvice: {
      serviceName: 'Law and legal advice',
      serviceType: 'Web',
      telephoneNumber: 'http://www.lawstuff.org.au/',
      additionalInfo: 'The law is different in each state and territory. Select your state or territory to find out how the law applies to you'
    },
    LifeLine: {
      serviceName: 'LifeLine',
      serviceType: 'Telephone',
      telephoneNumber: '131114',
      additionalInfo: '24 hour telephone counselling for anyone, anywhere, anytime for the cost of a local call.'
    },
    DomesticViolience: {
      serviceName: 'DomesticViolenceLine (over18)',
      serviceType: 'Telephone',
      telephoneNumber: '1800 656 463',
      additionalInfo: '24 hour, 7 days per week telephone service for people affected by domestic violence. Interpreter services can be provided.'
    },
    NSWGovernmentYouthWebsite: {
      serviceName: 'NSW Government Youth Website',
      serviceType: 'Web',
      url: 'http://youth.nsw.gov.au/',
      additionalInfo: 'Youth NSW gives you information'
    },
    BeyondBlue: {
      serviceName: 'Beyond Blue and YBBLUE',
      serviceType: 'Web',
      url: 'http://www.ybblue.com.au/',
      additionalInfo: 'YBBLUE is a website developed specially for young people to access information, resources and stories about depression and other mental health problems.'
    },
    ReachOut: {
      serviceName: 'Reach Out!',
      serviceType: 'Web',
      url: 'http://www.reachout.com.au',
      additionalInfo: 'The ReachOut website has information on issues including drugs, depression and sex. They provide advice on how to get help and have stories from other young people.'
    },
    KidHelpline: {
      serviceName: 'Kids Help Line',
      serviceType: 'Telephone',
      telephoneNumber: '1800 55 1800',
      additionalInfo: 'Australia’s only free, confidential and anonymous, 24 hour phone and online counselling service for young people aged between 5 & 25. This service can also provide telephone contacts from their extensive database and refer to other services.'
    },
    headroom: {
      serviceName: 'Headroom',
      serviceType: 'Web',
      url: 'http://www.headroom.com.au',
      additionalInfo: 'The ReachOut website has information on issues including drugs, depression and sex. They provide advice on how to get help and have stories from other young people.'
    },
    MoodGym: {
      serviceName: 'MoodGym',
      serviceType: 'Web',
      url: 'https://moodgym.anu.edu.au/',
      additionalInfo: 'MoodGYM is a fun, interactive program that helps you identify and overcome problem emotions and shows you how to develop good coping skills for the future.'
    },
    Somazon: {
      serviceName: 'Somazone',
      serviceType: 'Web',
      url: 'http://www.somazone.com.au/',
      additionalInfo: 'Somazone describes itself as “the place to go when you want to know”. The site provides free, confidential advice and information for young people.'
    },
    NSWFamilyAndCommunityServices: {
      serviceName: 'NSW Department of Community Services (DoCS)',
      serviceType: 'Web',
      url: 'http://www.community.nsw.gov.au/action/aliastemplate?svAliasName=DOCS',
      additionalInfo: 'To access information and links about safety issues for young people, go to the parents, carers & families menu and click on for young people.'
    },
    LegalAid: {
      serviceName: 'Legal Aid',
      serviceType: 'Telephone',
      telephoneNumber: '1800 101 810',
      additionalInfo: 'Hotline for under 18. 9:00am to midnight Monday to Friday and 12:00 noon to midnight on weekends. An interpreter service can be arranged.'

    },
    YouthSolution: {
      serviceName: 'YouthSolution',
      serviceType: 'Web',
      url: 'http://www.youthsolutions.com.au',
      additionalInfo: 'Youth solutions can answer questions and give you information about alcohol and other drugs and provide links to more websites'
    },
    Biteback: {
      serviceName: 'Biteback',
      serviceType: 'Web',
      url: 'http://www.biteback.com.au',
      additionalInfo: 'Biteback'
    }
  };

  console.log("answerQueries is invoked");
  var nlClassifier = watson.natural_language_classifier({
      username: 'f65ac6e6-358b-44cd-8e20-b94827076df6',
      password: 'og0G8Mi163dv',
      version: 'v1'
    });
    var params = {
      classifier: process.env.CLASSIFIER_ID || 'BD2B45-nlc-514', // pre-trained classifier
      text: req.query.question
    };
    console.log("Param is: " + req.query.question);
    nlClassifier.classify(params, function(err, results) {
      if (err)
        return res.json({status: 'Unexpected Error'});
      else {
 
        var result = [];
        var totalRows = results.classes.length;
        if (results.classes.length < 3) {
          totalRows = results.classes.length
        }

        for (var i = 0; i < totalRows; ++i) {
          var record = {};
          var className = results.classes[i].class_name;
          console.log(className);
          record["ServiceName"] = serviceLookup[className].serviceName;
          record["ServiceType"] = serviceLookup[className].serviceType;
          if (serviceLookup[className].serviceType == 'Web') {
            record["URL"] = serviceLookup[className].url;
          } else {
            record["TelephoneNumber"] = serviceLookup[className].telephoneNumber;
          }
          record["AdditionalInfo"] = serviceLookup[className].additionalInfo;
          result.push(record);
        }

        res.json(result);
        // var className = results.classes[0].class_name;
        // if (className != null || className != 'undefined') {
        //   var result = serviceLookup[className];
        //   res.json(result);
        // }

      }
    });

    
  
};
