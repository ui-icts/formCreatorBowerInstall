# Uiowa Form Creator
===============================================

# Background
Uiowa Form Creator is a project designed to be added to other existing Java projects to facilitate the creation of questionnaires and responses, the forms and responses are saved to a postgres database and the are linked to services. Code is in place to now allow for the adding of responses to services without approved forms with effective dates that have already passed. When a service has multiple active forms the form with the most recent effective date will be chosen. Currently who created the response is not saved. 

# Bower install
bower install uiowaFormCreator


Install Guide Found Below
https://www.icts.uiowa.edu/confluence/display/IA/Adding+Angular+Schema+Form+Project+to+Your+Java+Project

# Javascript resources
	<script src="bower_components/resources/angular/angular.js" />"></script>
	<script src="bower_components/angular-resource/angular-resource.js" />"></	script>
	<script src="bower_components/angular-sanitize/angular-sanitize.min.js" />"></script>
	<script src="bower_components/resources/tv4/tv4.js" />"></script>
	<script src="bower_components/objectpath/lib/ObjectPath.js" />"></script>
	<script src="bower_components/angular-schema-form/dist/schema-form.min.js" />"></script>
	<script src="bower_components/angular-schema-form/dist/bootstrap-decorator.min.js" />"></script>
	<script src="bower_components/angular-strap/dist/angular-strap.min.js" />"></script>
	<script src="bower_components/angular-strap/dist/angular-strap.tpl.min.js" />"></script>
	<script src="bower_components/schema-form-datetimepicker/schema-form-date-time-picker.min.js" />"></script>
	<script src="bower_components/uiowaFormCreator/js/uiowaFormCreator.js" />"></script>


