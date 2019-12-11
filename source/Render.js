class Render {

	constructor(conf = {}) {
		let lang = conf.currentLang || undefined; 
		let langs = conf.langs || []; 
		let separator = conf.separator || '.';
		this.translator = new Translator(lang, langs, separator);
	}

	/**
	 * Search for elements to make render
	 */
	renderAll(){
		this.searchTags();
		this.searchAttributes();
	}

	searchTags() {
		let nodes = document.querySelectorAll(Render.translateTag);
		for(let node of nodes){
			this.renderTag(node);
		}
	}

	searchAttributes(){
		let nodes = document.querySelectorAll(`[${Render.attributeTag}]`);

		for(let node of nodes){
			this.renderElement(node);
		}
	}

	/**
	 * Translate the content in tag and replace the same tag.
	 * @param {Node} node 
	 */
	renderTag(node){
		let route = node.innerText;

		let args = this.parseTranslateTagArgs(node);

		node.outerHTML = this.translator.translate(route, args);
	}
	
	/**
	 * Translates the text given in route parameter and sets it
	 * as value for the attribute "attribute" of the given node.
	 * 
	 * @param {Node} node 
	 * @param {string} attribute 
	 * @param {string} route 
	 * @param {object} args 
	 */
	renderAttribute(node, attribute, route, args = {}) {
		let translation = this.translator.translate(route, args);
		node.setAttribute(attribute, translation);
	}

	/**
	 * Render all the node specified attributes into the translated texts
	 * 
	 * @param {Node} node 
	 */
	renderElement(node) {
		let attributes = node.attributes;
		let testRegex = new RegExp(`^${Render.attributeTag}:[a-z]+(-[a-z]+)*$`);

		// get just the relevant attributes
		attributes = this.filterAttributes(attributes);
		for(let attribute of attributes) {
			let route = node.getAttribute(attribute);
			if(attribute === Render.attributeTag) {
				let args = this.parseArgsForAttribute(node, attribute, attributes);
				node.innerText = this.translator.translate(route, args);
			} else if (testRegex.test(attribute)) {
				// It's a attribute to be translated instead of element inner text
				let parts = attribute.split(':');
				let target = parts[1];

				let args = this.parseArgsForAttribute(node, attribute, attributes);

				this.renderAttribute(node, target, route, args);
			}
		}
	}

	filterAttributes(attributes) {
		let finalAttributes = [];
		let translations = /^t-translate/i;
		let args = /^t-args/i;

		for(let attribute of attributes) {
			if(translations.test(attribute.localName) || args.test(attribute.localName))
				finalAttributes.push(attribute.localName);
		}

		return finalAttributes;
	}

	/**
	 * Takes the node of name translate and return the
	 * arg object for it
	 * 
	 * @param {Node} node 
	 */
	parseTranslateTagArgs(node) {
		let args = {};
		let attributesMap = node.attributes;

		for(let attribute of attributesMap) {
			args[attribute.localName] = attribute.value;
		}

		return args;
	}

	/**
	 * Remove element at index position of numeric indexed array
	 * 
	 * @param {array} array 
	 * @param {int} index 
	 * 
	 * @return void
	 */
	arrayRemove (array, index) {
		if(index < array.length)
			array.splice(index, 1);
	}

	/**
	 * Parse the args for attribute in the given node
	 * 
	 * @param {Node} node 
	 * @param {string} attribute 
	 * @param {object} attributesList 
	 */
	parseArgsForAttribute(node, attribute, attributesList = []) {
		let args = {};
		let removeIndexes = [];
		let validAttribute = new RegExp(`^${Render.attributeTag}:[a-z]+(-[a-z]+)*$`);
		let attributeArgs;

		// Parse args for t-translate text
		if(attribute === Render.attributeTag) {
			// Select just the args for this translation
			attributeArgs = attributesList.filter((_attribute, index) => {
				let passes = /t-args/g.test(_attribute) && (_attribute.match(/:/g) || []).length === 1;
				if(passes)
					removeIndexes.push(index);
				return passes;
			});

			for(let value of attributeArgs) {
				let parts = value.split(':');
				let key = parts[1];
				let index = removeIndexes.shift();

				// Unset the attribute for array to get processing faster
				this.arrayRemove(attributesList, index);

				args[key] = node.getAttribute(value);
			}
		} else if (validAttribute.test(attribute)) {
			// This code block was written by God
			// Because I don't know what I'm doing

			// Parse an attribute of element
			let parts = attribute.split(':');
			let target = parts[1];
			let testRegex = new RegExp(`^${Render.attributeArgsTag}:${target}:[a-z]+(-[a-z]+)*$`);

			attributeArgs = attributesList.filter((_attribute, index) => {
				let passes = testRegex.test(_attribute);
				if(passes)
					removeIndexes.push(index);
				return passes;
			});

			for(let value of attributeArgs) {
				parts = value.split(':');
				let key = parts[2];
				let index = removeIndexes.shift();

				this.arrayRemove(attributesList, index);

				args[key] = node.getAttribute(value);
			}
		}

		return args;
	}

	// Define setters 
	set language(lang) {
		if(typeof lang === 'string' && lang.length > 2)
			lang = lang.substr(0, 2);
		this.translator.language = lang;
	}

	// Define getters
	get language() {
		return this.translator.language;
	}
}


Render.translateTag = "translate";
Render.attributeTag = "t-translate";
Render.attributeArgsTag = "t-args";