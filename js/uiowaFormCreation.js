function validSchema(schemaText){
	if(! isJson(schemaText)){return false;}
	var json = JSON.parse(schemaText);
	if(!json.form || !json.schema || !json.schema.properties || !json.schema.required){return false;}
	return true;
}

function isJson(str) {
	if(str){
		try {JSON.parse(str);
			return true;
		} 
		catch (e) {}
	}
	return false;
}



var response = function(schemaForm, answers){
	var that = {};
	
	var model = ( isJson(answers)) ? JSON.parse(answers) : {};
	
	that.model = model;
	
	if(validSchema(schemaForm)){
		var parsedSchema = JSON.parse(schemaForm);
		that.schema = parsedSchema.schema
		that.form = parsedSchema.form
	}
	
	var reponse_text = function(){return JSON.stringify(model);}
	that.reponse_text = reponse_text;
	
	return that;
	
}


var formBuilder = function(schemaText){
	that = {};
	
	that.protectedKeys = [];
	
	function setProtectedKeys(pks){
		if(pks.constructor === Array){
			that.protectedKeys = pks;
		}else{
			console.log("Protected keys must be an array.");
		}
	}
	that.setProtectedKeys = setProtectedKeys;
	
	var activeQuestion = {};
	var questions = {};
	
	var questionTypes = {
		    text: 'Text',
		    textarea : 'Text Area',
		    radiobuttons: 'Radiobuttons',
		    checkbox: 'Checkbox',
		    checkboxes: 'Checkboxes',
		    yesNo: 'Yes/No',
		    email: 'Email',
		    datepicker : 'Date',
		    number: 'Number',
		    zipcode : 'Zipcode',
		    state : 'State',
		    country : "Country",
		    time : "Time",
		    phone : "Phone",
		    dropdown : "Dropdown",
		  /*multiDropdown : "Multiple Dropdown" */
		};
	that.questionTypes = questionTypes;
	
	var counties = [{"value" : "US" ,"name" : "United States"}, {"value" : "AF" ,"name" : "Afghanistan"}, {"value" : "AX" ,"name" : "Åland Islands"}, {"value" : "AL" ,"name" : "Albania"}, {"value" : "DZ" ,"name" : "Algeria"}, {"value" : "AS" ,"name" : "American Samoa"}, 
	                {"value" : "AD" ,"name" : "Andorra"}, {"value" : "AO" ,"name" : "Angola"}, {"value" : "AI" ,"name" : "Anguilla"}, {"value" : "AQ" ,"name" : "Antarctica"}, {"value" : "AG" ,"name" : "Antigua and Barbuda"}, {"value" : "AR" ,"name" : "Argentina"}, {"value" : "AM" ,"name" : "Armenia"}, 
	                {"value" : "AW" ,"name" : "Aruba"}, {"value" : "AU" ,"name" : "Australia"}, {"value" : "AT" ,"name" : "Austria"}, {"value" : "AZ" ,"name" : "Azerbaijan"}, {"value" : "BS" ,"name" : "Bahamas"}, {"value" : "BH" ,"name" : "Bahrain"}, {"value" : "BD" ,"name" : "Bangladesh"}, 
	                {"value" : "BB" ,"name" : "Barbados"}, {"value" : "BY" ,"name" : "Belarus"}, {"value" : "BE" ,"name" : "Belgium"}, {"value" : "BZ" ,"name" : "Belize"}, {"value" : "BJ" ,"name" : "Benin"}, {"value" : "BM" ,"name" : "Bermuda"}, {"value" : "BT" ,"name" : "Bhutan"}, 
	                {"value" : "BO" ,"name" : "Bolivia, Plurinational State Of"}, {"value" : "BQ" ,"name" : "Bonaire, Sint Eustatius and Saba"}, {"value" : "BA" ,"name" : "Bosnia and Herzegovina"}, {"value" : "BW" ,"name" : "Botswana"}, {"value" : "BV" ,"name" : "Bouvet Island"}, 
	                {"value" : "BR" ,"name" : "Brazil"}, {"value" : "IO" ,"name" : "British Indian Ocean Territory"}, {"value" : "BN" ,"name" : "Brunei Darussalam"}, {"value" : "BG" ,"name" : "Bulgaria"}, {"value" : "BF" ,"name" : "Burkina Faso"}, {"value" : "BI" ,"name" : "Burundi"}, 
	                {"value" : "KH" ,"name" : "Cambodia"}, {"value" : "CM" ,"name" : "Cameroon"}, {"value" : "CA" ,"name" : "Canada"}, {"value" : "CV" ,"name" : "Cape Verde"}, {"value" : "KY" ,"name" : "Cayman Islands"}, {"value" : "CF" ,"name" : "Central African Republic"}, {"value" : "TD" ,"name" : "Chad"}, 
	                {"value" : "CL" ,"name" : "Chile"}, {"value" : "CN" ,"name" : "China"}, {"value" : "CX" ,"name" : "Christmas Island"}, {"value" : "CC" ,"name" : "Cocos (Keeling) Islands"}, {"value" : "CO" ,"name" : "Colombia"}, {"value" : "KM" ,"name" : "Comoros"}, {"value" : "CG" ,"name" : "Congo"}, 
	                {"value" : "CD" ,"name" : "Congo, The Democratic Republic Of The"}, {"value" : "CK" ,"name" : "Cook Islands"}, {"value" : "CR" ,"name" : "Costa Rica"}, {"value" : "CI" ,"name" : "Côte D'Ivoire"}, {"value" : "HR" ,"name" : "Croatia"}, {"value" : "CU" ,"name" : "Cuba"}, {"value" : "CW" ,"name" : "Curaçao"}, 
	                {"value" : "CY" ,"name" : "Cyprus"}, {"value" : "CZ" ,"name" : "Czech Republic"}, {"value" : "DK" ,"name" : "Denmark"}, {"value" : "DJ" ,"name" : "Djibouti"}, {"value" : "DM" ,"name" : "Dominica"}, {"value" : "DO" ,"name" : "Dominican Republic"}, {"value" : "EC" ,"name" : "Ecuador"}, {"value" : "EG" ,"name" : "Egypt"}, 
	                {"value" : "SV" ,"name" : "El Salvador"}, {"value" : "GQ" ,"name" : "Equatorial Guinea"}, {"value" : "ER" ,"name" : "Eritrea"}, {"value" : "EE" ,"name" : "Estonia"}, {"value" : "ET" ,"name" : "Ethiopia"}, {"value" : "FK" ,"name" : "Falkland Islands (Malvinas)"}, {"value" : "FO" ,"name" : "Faroe Islands"}, 
	                {"value" : "FJ" ,"name" : "Fiji"}, {"value" : "FI" ,"name" : "Finland"}, {"value" : "FR" ,"name" : "France"}, {"value" : "GF" ,"name" : "French Guiana"}, {"value" : "PF" ,"name" : "French Polynesia"}, {"value" : "TF" ,"name" : "French Southern Territories"}, {"value" : "GA" ,"name" : "Gabon"}, 
	                {"value" : "GM" ,"name" : "Gambia"}, {"value" : "GE" ,"name" : "Georgia"}, {"value" : "DE" ,"name" : "Germany"}, {"value" : "GH" ,"name" : "Ghana"}, {"value" : "GI" ,"name" : "Gibraltar"}, {"value" : "GR" ,"name" : "Greece"}, {"value" : "GL" ,"name" : "Greenland"}, {"value" : "GD" ,"name" : "Grenada"}, 
	                {"value" : "GP" ,"name" : "Guadeloupe"}, {"value" : "GU" ,"name" : "Guam"}, {"value" : "GT" ,"name" : "Guatemala"}, {"value" : "GG" ,"name" : "Guernsey"}, {"value" : "GN" ,"name" : "Guinea"}, {"value" : "GW" ,"name" : "Guinea-Bissau"}, {"value" : "GY" ,"name" : "Guyana"}, 
	                {"value" : "HT" ,"name" : "Haiti"}, {"value" : "HM" ,"name" : "Heard Island and Mcdonald Islands"}, {"value" : "VA" ,"name" : "Holy See (Vatican City State)"}, {"value" : "HN" ,"name" : "Honduras"}, {"value" : "HK" ,"name" : "Hong Kong"}, {"value" : "HU" ,"name" : "Hungary"}, 
	                {"value" : "IS" ,"name" : "Iceland"}, {"value" : "IN" ,"name" : "India"}, {"value" : "ID" ,"name" : "Indonesia"}, {"value" : "IR" ,"name" : "Iran, Islamic Republic Of"}, {"value" : "IQ" ,"name" : "Iraq"}, {"value" : "IE" ,"name" : "Ireland"}, {"value" : "IM" ,"name" : "Isle Of Man"}, 
	                {"value" : "IL" ,"name" : "Israel"}, {"value" : "IT" ,"name" : "Italy"}, {"value" : "JM" ,"name" : "Jamaica"}, {"value" : "JP" ,"name" : "Japan"}, {"value" : "JE" ,"name" : "Jersey"}, {"value" : "JO" ,"name" : "Jordan"}, {"value" : "KZ" ,"name" : "Kazakhstan"}, {"value" : "KE" ,"name" : "Kenya"}, 
	                {"value" : "KI" ,"name" : "Kiribati"}, {"value" : "KP" ,"name" : "Korea, Democratic People's Republic Of"}, {"value" : "KR" ,"name" : "Korea, Republic Of"}, {"value" : "KW" ,"name" : "Kuwait"}, {"value" : "KG" ,"name" : "Kyrgyzstan"}, {"value" : "LA" ,"name" : "Lao People's Democratic Republic"}, 
	                {"value" : "LV" ,"name" : "Latvia"}, {"value" : "LB" ,"name" : "Lebanon"}, {"value" : "LS" ,"name" : "Lesotho"}, {"value" : "LR" ,"name" : "Liberia"}, {"value" : "LY" ,"name" : "Libya"}, {"value" : "LI" ,"name" : "Liechtenstein"}, {"value" : "LT" ,"name" : "Lithuania"}, {"value" : "LU" ,"name" : "Luxembourg"}, 
	                {"value" : "MO" ,"name" : "Macao"}, {"value" : "MK" ,"name" : "Macedonia, The Former Yugoslav Republic Of"}, {"value" : "MG" ,"name" : "Madagascar"}, {"value" : "MW" ,"name" : "Malawi"}, {"value" : "MY" ,"name" : "Malaysia"}, {"value" : "MV" ,"name" : "Maldives"}, {"value" : "ML" ,"name" : "Mali"}, 
	                {"value" : "MT" ,"name" : "Malta"}, {"value" : "MH" ,"name" : "Marshall Islands"}, {"value" : "MQ" ,"name" : "Martinique"}, {"value" : "MR" ,"name" : "Mauritania"}, {"value" : "MU" ,"name" : "Mauritius"}, {"value" : "YT" ,"name" : "Mayotte"}, {"value" : "MX" ,"name" : "Mexico"}, 
	                {"value" : "FM" ,"name" : "Micronesia, Federated States Of"}, {"value" : "MD" ,"name" : "Moldova, Republic Of"}, {"value" : "MC" ,"name" : "Monaco"}, {"value" : "MN" ,"name" : "Mongolia"}, {"value" : "ME" ,"name" : "Montenegro"}, {"value" : "MS" ,"name" : "Montserrat"}, {"value" : "MA" ,"name" : "Morocco"}, 
	                {"value" : "MZ" ,"name" : "Mozambique"}, {"value" : "MM" ,"name" : "Myanmar"}, {"value" : "NA" ,"name" : "Namibia"}, {"value" : "NR" ,"name" : "Nauru"}, {"value" : "NP" ,"name" : "Nepal"}, {"value" : "NL" ,"name" : "Netherlands"}, {"value" : "NC" ,"name" : "New Caledonia"}, 
	                {"value" : "NZ" ,"name" : "New Zealand"}, {"value" : "NI" ,"name" : "Nicaragua"}, {"value" : "NE" ,"name" : "Niger"}, {"value" : "NG" ,"name" : "Nigeria"}, {"value" : "NU" ,"name" : "Niue"}, {"value" : "NF" ,"name" : "Norfolk Island"}, {"value" : "MP" ,"name" : "Northern Mariana Islands"}, 
	                {"value" : "NO" ,"name" : "Norway"}, {"value" : "OM" ,"name" : "Oman"}, {"value" : "PK" ,"name" : "Pakistan"}, {"value" : "PW" ,"name" : "Palau"}, {"value" : "PS" ,"name" : "Palestine, State Of"}, {"value" : "PA" ,"name" : "Panama"}, {"value" : "PG" ,"name" : "Papua New Guinea"}, {"value" : "PY" ,"name" : "Paraguay"}, 
	                {"value" : "PE" ,"name" : "Peru"}, {"value" : "PH" ,"name" : "Philippines"}, {"value" : "PN" ,"name" : "Pitcairn"}, {"value" : "PL" ,"name" : "Poland"}, {"value" : "PT" ,"name" : "Portugal"}, {"value" : "PR" ,"name" : "Puerto Rico"}, {"value" : "QA" ,"name" : "Qatar"}, {"value" : "RE" ,"name" : "Réunion"}, 
	                {"value" : "RO" ,"name" : "Romania"}, {"value" : "RU" ,"name" : "Russian Federation"}, {"value" : "RW" ,"name" : "Rwanda"}, {"value" : "BL" ,"name" : "Saint Barthélemy"}, {"value" : "SH" ,"name" : "Saint Helena, Ascension and Tristan Da Cunha"}, {"value" : "KN" ,"name" : "Saint Kitts and Nevis"}, 
	                {"value" : "LC" ,"name" : "Saint Lucia"}, {"value" : "MF" ,"name" : "Saint Martin (French Part)"}, {"value" : "PM" ,"name" : "Saint Pierre and Miquelon"}, {"value" : "VC" ,"name" : "Saint Vincent and The Grenadines"}, {"value" : "WS" ,"name" : "Samoa"}, {"value" : "SM" ,"name" : "San Marino"}, 
	                {"value" : "ST" ,"name" : "Sao Tome and Principe"}, {"value" : "SA" ,"name" : "Saudi Arabia"}, {"value" : "SN" ,"name" : "Senegal"}, {"value" : "RS" ,"name" : "Serbia"}, {"value" : "SC" ,"name" : "Seychelles"}, {"value" : "SL" ,"name" : "Sierra Leone"}, {"value" : "SG" ,"name" : "Singapore"}, 
	                {"value" : "SX" ,"name" : "Sint Maarten (Dutch Part)"}, {"value" : "SK" ,"name" : "Slovakia"}, {"value" : "SI" ,"name" : "Slovenia"}, {"value" : "SB" ,"name" : "Solomon Islands"}, {"value" : "SO" ,"name" : "Somalia"}, {"value" : "ZA" ,"name" : "South Africa"}, 
	                {"value" : "GS" ,"name" : "South Georgia and The South Sandwich Islands"}, {"value" : "SS" ,"name" : "South Sudan"}, {"value" : "ES" ,"name" : "Spain"}, {"value" : "LK" ,"name" : "Sri Lanka"}, {"value" : "SD" ,"name" : "Sudan"}, {"value" : "SR" ,"name" : "Suriname"}, 
	                {"value" : "SJ" ,"name" : "Svalbard and Jan Mayen"}, {"value" : "SZ" ,"name" : "Swaziland"}, {"value" : "SE" ,"name" : "Sweden"}, {"value" : "CH" ,"name" : "Switzerland"}, {"value" : "SY" ,"name" : "Syrian Arab Republic"}, {"value" : "TW" ,"name" : "Taiwan, Province Of China"}, 
	                {"value" : "TJ" ,"name" : "Tajikistan"}, {"value" : "TZ" ,"name" : "Tanzania, United Republic Of"}, {"value" : "TH" ,"name" : "Thailand"}, {"value" : "TL" ,"name" : "Timor-Leste"}, {"value" : "TG" ,"name" : "Togo"}, {"value" : "TK" ,"name" : "Tokelau"}, {"value" : "TO" ,"name" : "Tonga"}, 
	                {"value" : "TT" ,"name" : "Trinidad and Tobago"}, {"value" : "TN" ,"name" : "Tunisia"}, {"value" : "TR" ,"name" : "Turkey"}, {"value" : "TM" ,"name" : "Turkmenistan"}, {"value" : "TC" ,"name" : "Turks and Caicos Islands"}, {"value" : "TV" ,"name" : "Tuvalu"}, {"value" : "UG" ,"name" : "Uganda"}, 
	                {"value" : "UA" ,"name" : "Ukraine"}, {"value" : "AE" ,"name" : "United Arab Emirates"}, {"value" : "GB" ,"name" : "United Kingdom"}, {"value" : "UM" ,"name" : "United States Minor Outlying Islands"}, {"value" : "UY" ,"name" : "Uruguay"}, {"value" : "UZ" ,"name" : "Uzbekistan"}, 
	                {"value" : "VU" ,"name" : "Vanuatu"}, {"value" : "VE" ,"name" : "Venezuela, Bolivarian Republic Of"}, {"value" : "VN" ,"name" : "Vietnam"}, {"value" : "VG" ,"name" : "Virgin Islands, British"}, {"value" : "VI" ,"name" : "Virgin Islands, U.S."}, {"value" : "WF" ,"name" : "Wallis and Futuna"}, 
	                {"value" : "EH" ,"name" : "Western Sahara"}, {"value" : "YE" ,"name" : "Yemen"}, {"value" : "ZM" ,"name" : "Zambia"}, {"value" : "ZW" ,"name" : "Zimbabwe"}];
	
	var states = [{'value' : 'AL','name' : 'Alabama'},{'value' : 'AK','name' : 'Alaska'},{'value' : 'AZ','name' : 'Arizona'},{'value' : 'AR','name' : 'Arkansas'},
                  {'value' : 'CA','name' : 'California'},{'value' : 'CO','name' : 'Colorado'},{'value' : 'CT','name' : 'Connecticut'},{'value' : 'DE','name' : 'Delaware'},
                  {'value' : 'DC','name' : 'District of Columbia'},{'value' : 'FL','name' : 'Florida'},{'value' : 'GA','name' : 'Georgia'},{'value' : 'HI','name' : 'Hawaii'},
                  {'value' : 'ID','name' : 'Idaho'},{'value' : 'IL','name' : 'Illinois'},{'value' : 'IN','name' : 'Indiana'},{'value' : 'IA','name' : 'Iowa'},
                  {'value' : 'KS','name' : 'Kansas'},{'value' : 'KY','name' : 'Kentucky'},{'value' : 'LA','name' : 'Louisiana'},{'value' : 'ME','name' : 'Maine'},
                  {'value' : 'MT','name' : 'Montana'},{'value' : 'NE','name' : 'Nebraska'},{'value' : 'NV','name' : 'Nevada'},{'value' : 'NH','name' : 'New Hampshire'},
                  {'value' : 'NJ','name' : 'New Jersey'},{'value' : 'NM','name' : 'New Mexico'},{'value' : 'NY','name' : 'New York'},{'value' : 'NC','name' : 'North Carolina'},
                  {'value' : 'ND','name' : 'North Dakota'},{'value' : 'OH','name' : 'Ohio'},{'value' : 'OK','name' : 'Oklahoma'},{'value' : 'OR','name' : 'Oregon'},
                  {'value' : 'MD','name' : 'Maryland'},{'value' : 'MA','name' : 'Massachusetts'},{'value' : 'MI','name' : 'Michigan'},{'value' : 'MN','name' : 'Minnesota'},
                  {'value' : 'MS','name' : 'Mississippi'},{'value' : 'MO','name' : 'Missouri'},{'value' : 'PA','name' : 'Pennsylvania'},{'value' : 'RI','name' : 'Rhode Island'},
                  {'value' : 'SC','name' : 'South Carolina'},{'value' : 'SD','name' : 'South Dakota'},{'value' : 'TN','name' : 'Tennessee'},{'value' : 'TX','name' : 'Texas'},
                  {'value' : 'UT','name' : 'Utah'},{'value' : 'VT','name' : 'Vermont'},{'value' : 'VA','name' : 'Virginia'},{'value' : 'WA','name' : 'Washington'},{'value' : 'WV','name' : 'West Virginia'},
                  {'value' : 'WI','name' : 'Wisconsin'},{'value' : 'WY','name' : 'Wyoming'}];
	
	schemaText = (schemaText && validSchema(schemaText)) ?  schemaText : '{"form": [], "schema": {"type": "object", "required": [], "properties": {}}}';
	
	var typesWithValues = ['radiobuttons','checkboxes','dropdown','multiDropdown'];
	that.typesWithValues = typesWithValues;
	
	questions = textToQuestions(schemaText);
	that.questions = questions;

	function exportSchema(){
		return JSON.stringify(schema());
	}
	that.exportSchema = exportSchema;
	
	function textToQuestions(questionsText){
		var questions = [];
		var json = JSON.parse(questionsText);
		for(var i=0; i<json.form.length; i++){
			//get form data
			var form = json.form[i];
			form.id = form.id || uuid.v1();
			//get schema data
			var schema = json.schema.properties[form.key];	
			//combine hashes			
			var question = $.extend({}, form, schema);
			
			if( validQuestion(question)){questions.push(question);}
		}
		return questions;
	}

	function questionsToText(){
		return JSON.stringify(questions);
	}
	that.questionsToText = questionsToText;
		
	function move(question, up, runOnSuccess, runOnFailed){
		var id = question.id || question;
		var moved = false;
	
		angular.forEach(questions, function(question, i){
			if(question.id == id){
				if(up==true && i != 0){
					var oldValue = questions[i-1];
					questions[i-1] = question;
					questions[i] = oldValue;
				}
				else if(up == false && i+1 != questions.length){
					var oldValue = questions[i+1];
					questions[i+1] = question;
					questions[i] = oldValue;
				}
				moved = true;
				if(runOnSuccess){runOnSuccess(question);}
			}
		});
		if(!moved && runOnFailed){runOnFailed(question);}
	}
	
	function up(question,runOnSuccess, runOnFailed){move(question, true,runOnSuccess, runOnFailed);};
	that.up = up;
	
	function down(question,runOnSuccess, runOnFailed){move(question, false,runOnSuccess, runOnFailed);};
	that.down = down;
		
	function deleteQuestion(question, runOnSucess,runOnFailed){
		var id = question.id || question;
		var deleted = false;
		for(var i=0; i<questions.length; i++){
			if(questions[i].id == id){
				questions.splice(i,1);
				if(runOnSucess){runOnSucess(question);}
				deleted = true;
				
			}
		}
		if(!deleted && runOnFailed){runOnFailed(question);}
		
	}
	that.deleteQuestion = deleteQuestion;
	
	function saveQuestion(ques, runOnSucess,runOnFailed){
		var question = clone(ques);
		if(validQuestion(question)){
			if(question.id){
				questions.forEach(function(part, index){
					if(part.id == question.id){
						questions[index] = question;}
				});
			}else{
				question.id = uuid.v1();
				questions.push(question);
			}
			if(runOnSucess){runOnSucess(question);}
		}else{
			if(runOnFailed){runOnFailed(question);}
		}
	}
	that.saveQuestion = saveQuestion;
	
	function getQuestionByKey(key){
		for(var i=0; i<questions.length; i++){
			var question = questions[i];
			if(question.key == key){return getQuestion(question.id);}
		}
		return null;
	}
	that.getQuestionByKey = getQuestionByKey;
	
	function getQuestion(id){
		for(var i=0; i< questions.length; i++){
			var question = questions[i];
			if(question.id == id){return question;}
		}
		return null;
	}
	that.getQuestion = getQuestion;
	
	
	function validQuestion(question){
		return Object.keys(getErrors(question)).length == 0;
	}
	that.validQuestion = validQuestion;
	
	function invalidQuestion(question){
		return !validQuestion(question);
	}
	that.invalidQuestion = invalidQuestion;
	
	function getErrors(question){
		question = question || {}
		var errors = {};
		if(!question.title){errors.title = "Question required."}
		if(question.min && question.max && question.min > question.max){errors.min = "Mininum must be less then maximum."}
		if(!question.kind){errors.kind = "Question must have a type."}
		if(question.key){
			var restricted= [' ','`','~','@','#','$','%','^','&','*','(',')','+','=','-','|','\\',"'",'"',']','[','{','}',':',';','<',',','>','?','/','!',];
			if(question.key.contains(restricted)){
				errors.key = "Key can only use A-z, 0-9, and _"
			}
			if(that.protectedKeys.indexOf(question.key) > -1){
				errors.key = "The following keys are protected and cannot be used: "+that.protectedKeys.toString();
			}
			
			var questionByKey = getQuestionByKey(question.key);
			if(questionByKey && question.id != questionByKey.id){
				errors.key = "Key already exists."
			}
		}else{
			errors.key = "Key required."
		}
		if(!question.values && question.kind && question.kind.contains(typesWithValues)){
			errors.values = "Values needed, please seperate with commas.";
		}
		return errors;
	}
	that.getErrors = getErrors;
	
	// returns a Form object to be added to the list of form fields.
	 function getForm(field){
  		 var hash = {key: field.key, kind : field.kind, style: {'selected': 'btn-success',  'unselected': 'btn-default'}};
		 hash.values = field.values;
		 hash.id = field.id;
     /* logic for conditional questions is not ready to be used because it needs fine tuning and testing  */
		 if(field.conditionId){
			 var questionType = $scope.getQuestion(field.conditionId).kind;
			 hash.conditionId = field.conditionId;
			 if(field.conditionValue){
				 if(questionType=="checkbox"){
					 hash.condition = "showByBoolean('"+field.conditionId+"','"+field.conditionValue + "')";
				 }
				 else{
					 hash.condition = "showByAnswer('"+field.conditionId+"','"+field.conditionValue + "')";
				 }
				 hash.conditionValue = field.conditionValue;
			 }
			 //If is number create conditional show based on min and max values
			 else if(field.conditionValueMin || field.conditionValueMax){
				 if(field.conditionValueMin && !field.conditionValueMax){
					 hash.condition = "showByAnswerGreaterThen('"+field.conditionId+"',"+field.conditionValueMin+","+field.minInclusive+")";
				 }
				 else if(!field.conditionValueMin && field.conditionValueMax){
					 hash.condition = "showByAnswerLessThen('"+field.conditionId+"',"+field.conditionValueMax+","+field.maxInclusive+")";
				 }
				 else{
					 hash.condition = "showByAnswerRange('"+field.conditionId+"',"+field.conditionValueMin+","+field.conditionValueMax+","+field.minInclusive+","+field.maxInclusive+")";
				 }
				 hash.conditionValueMin = field.conditionValueMin;
				 hash.conditionValueMax = field.conditionValueMax;
				 hash.minInclusive = field.minInclusive;
				 hash.maxInclusive = field.maxInclusive;
			 }
			 else if(field.conditionStartDate || field.conditionEndDate){
				 hash.condition = "showByDateRange('"+field.conditionId+"','"+field.conditionStartDate+"','"+field.conditionEndDate+"')";
				 hash.conditionStartDate = field.conditionStartDate;
				 hash.conditionEndDate = field.conditionEndDate;
			 }
		 }
		 		 
		 if(field.kind == "yesNo"){
			 hash.type = "radiobuttons";
			 hash.values ="yes,no";
			 hash.titleMap= [{"value": "yes","name": "Yes"},{"value": "no","name": "No"}];
			 hash.description =  field.description ? field.description+" ("+(field.required ? "required" : "optional")+")" : field.required ? "Required" : "Optional";
			 return hash; 
		 } else if(field.kind == "state"){
			 hash.placeholder="Select One";
			 hash.type = "select";
			 hash.titleMap = states;
			 return hash;
		 } else if(field.kind == 'country'){
			 hash.placeholder="Select One";
			 hash.type = "select";
			 hash.titleMap = counties;
			 return hash;
		 } 
		 else if(field.kind == "email"){
			 hash.type = "string";
			 hash.placeholder ="ex. youremail@email.com";
			 return hash;
		 }
		 else if(field.kind =="dropdown"){
			 hash.type = "select";
			 hash.placeholder="Select One";
			 hash.titleMap = getTileMap(cleanSplit(field.values)); 
			 return hash;
			 }
		 else if(field.kind == "phone"){
			 hash.type = "string";
			 hash.placeholder = "ex. 555-555-5555";
			 return hash;
		 }
		 /* else if(field.kind == "multiDropdown"){
			 hash.type = "strapselect";
			 hash.options = {multiple : true}; 
			 hash.placeholder="Select One or More";
			 hash.titleMap = getTileMap((field.values) ? cleanSplit(field.values) : []);
			 return hash
		 } */
		 else if(field.kind == "datepicker"){
			 hash.type = "datepicker";
			 hash.dateOptions = { "dateFormat" : "MM/dd/yyyy"  };
			 return hash;
		 }
		 else if(field.kind == "number"){
			 hash.type = "number";
			 return hash;
		 }
		 else if(field.kind == "time"){
			 hash.type = "timepicker";
			 hash.timeOptions= {
					title : field.title,
				    minuteStep: 1,
				  };
			 return hash;
		 }
		 else if(field.kind == "zipcode"){
			 hash.type = "string";
			 hash.placeholder = "ex. 55555 or 55555-5555";
			 return hash;
		 }
		 else if(field.kind == "checkboxes"){
			hash.type = field.kind;
			hash.titleMap = getTileMap((field.values) ? cleanSplit(field.values) : []);
			hash.description =  field.description;
			return hash;
		 }
		 else if(field.kind == "radiobuttons"){
			 hash.type = field.kind;
			 hash.titleMap = getTileMap((field.values) ? cleanSplit(field.values) : []);
			 hash.description =  field.description;
			 return hash;
		 }
		 else if(field.kind == "checkbox"){
			 hash.type =field.kind;
			 hash.values = "true, false"
			 return hash;
		 }
		 else{
			 hash.type =field.kind;
			 return hash;
		 }
	 };
	 
	 function cleanSplit(value){
		 var list = value.split(","); 
		 var cleanList=[];
		 for(var i=0; i<list.length; i++){
			 var e = list[i].trim();
			 if(e != ''){
				 cleanList.push(e);
			 }
		 }
		 return cleanList;
	 }
	 
	 function pretty(){
		 return JSON.stringify(schema(), null, '\t' );
	 }
	 that.pretty = pretty;
	
	 function getTileMap(list){
		 var tileMap =[];
		 for(var i=0; i<list.length; i++){
			 var tile = {value : list[i], name : list[i]};
			 tileMap.push(tile);	 
		 }
		 return tileMap;
	 }
	 
	 var schema = function(){
		var form = []; var required = []; var properties = {};
		for(var i=0; i<questions.length; i++){
			var question = questions[i];
			form.push(getForm(question));
			if(question.required){required.push(question.key);}
			properties[question.key] = getQuestionSchema(question);
		}
		return {'form': form, schema: {'required': required, type: 'object', 'properties' : properties }};
	}
	 that.schema = schema;
	 
	 // returns a form input field's schema definition with default configuration values for specific types (e.g., Yes/No, date picker)
	 function getQuestionSchema(field){
		var hash = {title: field.title, description : field.description};
	 	 if(field.kind =="datepicker") {
	 		 hash.type = "string"; 
	 		 hash.format = "datepicker"; 
	 		 hash.validationMessage = "Please enter a valid date ex. 06/13/2015";	 			
	 	 }
	 	 else if(field.kind == "text" || field.kind == "textarea"){
	 		hash.type = "string";
	 		if(field.min != null){
	 			hash.minLength = field.min;
	 		}
	 		if(field.max != null){
	 			hash.maxLength = field.max;
	 		}
	 	 }
		 else if(field.kind == "yesNo"){
			 hash["enum"] = ["yes","no"]; 
			 hash.type="string";	
		 }
		 else if(field.kind == "state"){
			 hash["enum"]  = listByProperty(states, 'value');
			 hash.type = "string"; 
		 }
		 else if(field.kind == "country"){
			 hash["enum"]  = listByProperty(counties, 'value');
			 hash.type = "string";
		 }
		 else if(field.kind == "multiDropdown"){
			 hash.items = {"type": "string"}; 
			 hash.type = "array"; 
		 }
		 else if(field.kind == "phone"){
			hash.type = "string"; 
			hash.pattern = "^[0-9]{3}-[0-9]{3}-[0-9]{4}$"; 
			hash.validationMessage = "Please enter a valid phone number.";	
		 }
		 else if(field.kind == "radiobuttons"){
			 hash["enum"] = (field.values) ? cleanSplit(field.values)  : [];
			 hash.type = "string"; 	
		 }
		else if(field.kind == "file"){
			hash.type = "string";	
		}
		else if(field.kind == "dropdown"){
			 hash.type = "string";
		}
		else if(field.kind =="checkboxes"){
			hash.items = {"type": "string", "enum": (field.values) ? cleanSplit(field.values)  : []};
			hash.type = "array";
		}
		else if(field.kind == "email"){
			hash.type = "string"; 
			hash.pattern = "^\\S+@\\S+$"; 
			hash.validationMessage = "Please enter a valid email.";
		}
		else if(field.kind == "zipcode"){
			hash.type = "string"; 
			hash.pattern = "^[0-9]{5}(-[0-9]{4})?$"; 
			hash.validationMessage = "Please enter a valid zip code.";
		}
		else if(field.kind == "time"){
			hash.validationMessage = "Please enter a valid time ex. 12:00 AM"; 
			hash.type = "string";
			hash.format = "timepicker";
		}
		else if(field.kind == "checkbox"){
			hash.type = "boolean";
		}
		else if(field.kind == "number"){
	 		if(field.min != null){
	 			hash.minimum = field.min;
	 		}
	 		if(field.max != null){
	 			hash.maximum = field.max;
	 		}
			hash.type = "integer";
		}
		else if(field.kind == "range"){
			if(field.min != null){
				hash.minimum = field.min;
			}
	 		if(field.max != null){
	 			hash.maximum = field.max;
	 		}
	 		hash.type = field.kind;	
		}
		else{
			hash.type = "string";
		}
	 	 return hash;
	 };
	
	
	
	return that;
}