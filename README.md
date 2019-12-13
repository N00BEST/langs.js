# Langs.js
An i18n library to translate text in front end without any backend intervention. Intended to be easy to use and mantain, also to avoid page reloading when the language is changed (This feature is being build yet).
***
### Instalation
To install the library just download the repository and import the classes as follow in your html document:

`<script src="www.yourdomain.com/path-to-download-folder/Langs.min.js">`
***
### Configuration
Configure the library is pretty fast and simple. We'll just need to do as follow to have it running on our website: 

`let Langs = new Langs();`  

`Langs.langsLibrary(LANGS);`

Where *LANGS* is and array of objects having all the needed translations for our website. In the folder */langs* we have an example of how the languages should be declared and how does the population of these files work. 

> We strongly recommend using multiple lang files for ***development porpouse*** but having an unique minified file when going to ***production enviroment*** 

