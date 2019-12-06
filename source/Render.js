class Render {
    constructor(lang = undefined, langs = [], separator = '.') {
        this.translator = new Translator(lang, langs, separator);
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
        let minimumLength = "t-translate".length;

        // get just the relevant attributes
        attributes = this.filterAttributes(attributes);

        for(attribute of attributes) {
            let route = node.getAttribute(attribute);
            if(attribute.length === minimumLength ) {
                // let args = this.parseArgs(node.getAttribute('t-args'));
                node.innerText = this.translator.translate(route/*, args*/);
            } else if (attribute.indexOf(':') > minimumLength) {
                // It's a attribute to be translated instead of element inner text
                let parts = attribute.explode(':');
                let target = parts[1];

                // let args = 't-args:' + target;
                // args = this.parseArgs(node.getAttribute(args));

                this.renderAttribute(node, target, route/*, args*/);
            }
        }
    }

    filterAttributes(attributes) {
        let finalAttributes = [];
        let translations = /^t-translate/i;
        let args = /^t-args/i;

        for(attribute of attributes) {
            if(translations.test(attribute.localName) || args.test(attribute.localName))
                finalAttributes.push(attribute);
        }

        return finalAttributes;
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