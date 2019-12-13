# Langs.js
An i18n library to translate text in front end without any backend intervention. Intended to be easy to use and mantain, also to avoid page reloading when the language is changed (This feature is under construction).

This way we can have any of the next two syntax examples in our source HTML and will be translated to the given language if a translation exists in our files for the specified key.

Let's asume we have translations for both English and Spanish languages, so, the next HTML tag:

`<div class="welcome-message"><translate page="My Website">customer.welcome-to</translate></div>`

Will render in our website, after being processed by the library, as: 
- *English*:

`<div class="welcome-message">Welcome to My Website!</div>`

- *Spanish*:

`<div class="welcome-message">Bienvenido a My Website!</div>`

This behavior can be achieved also with the with the *`t-translate`* attribute inside our tags defining the elements as follow:

`<div class="welcome-message" t-translate="customer.welcome-to" t-args:page="My Website"></div>`

This will be displayed as the examples above, but keeping the *`t-translate`* and *`t-args`* attributes defined in our div.welcome-message element.

We can also target for a most specific level with the *`t-translate`* attribute inside our tags, so if we have the following input, and we need to translate the placeholder value, we can do: 

`<input t-translate t-translate:placeholder="customer.id">`

It will render as:
- *English*:

`<input placeholder="Identification Number" t-translate t-translate:placeholder="customer.id">`

- *Spanish*:

`<input placeholder="Documento de Identificación" t-translate t-translate:placeholder="customer.id">`
***
### Instalation
To install the library just download the repository and import the classes as follow in your html document:

`<script src="/path-to-download-folder/Langs.min.js">`
***
### Configuration
Configure the library is pretty fast and simple. We'll just need to do as follow to have it running on our website: 

`let Langs = new Langs();`  

`Langs.langsLibrary(LANGS);`

Where *LANGS* is and array of objects having all the needed translations for our website. In the folder */langs* we have an example of how the languages should be declared and how does the population of these files work. 

> We strongly recommend using multiple lang files for ***development porpouse*** but having an unique minified file when going to ***production enviroment*** 

#### Langs Object
The Langs object accepts an object with three configurable options for the translation and renderization to be loaded. 

- **currentLanguage:**
This attribute sets the language the elements will be translated to. This element should be a defined key in the `langsLibrary` array.

- **langsLibrary:**
This defines the languages database with all the respective translations for the website. (See *langsLibrary section* below for more details)

- **separator:**
This parameter tells the translation system if we are using a "dot notation" (.) in our routes system or any other separator we choose to have.