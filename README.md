# angularschemaformcreator
===============================================

# Background
Angular schema form creator is a project designed to be added to other existing Java projects to facilitate the creation of questionnaires and responses, the forms and responses are saved to a postgres database and the are linked to services. Code is in place to now allow for the adding of responses to services without approved forms with effective dates that have already passed. When a service has multiple active forms the form with the most recent effective date will be chosen. Currently who created the response is not saved. 

Install Guide Found Below
install using bower: bower install uiowaFormCreator
