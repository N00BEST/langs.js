class Translator {
    constructor(lang = 'en', langs = [], separator = '.') {
        if(!lang)
            lang = navigator.language || navigator.browserLanguage;

        if(lang.length > 2)
            lang = lang.substr(0, 2);

        this.lang = lang;
        this.langs = langs || [];
        this.separator = separator || '.';
    }

    /**
     * Translates a given route and replace the parameters, if exists,
     * with args given. If translation is found, returns the translated
     * text to current language; if translation is not found, returns the
     * string that was originally given.
     * 
     * @param {string} route 
     * @param {object} args
     * 
     * @return string 
     */
    translate(route, args = {}) {
        let lang = this.lang;

        if (lang === null)
            // No need to search for translation
            return route;

        let pathParts = route.split(this.separator);
        let text = this.langs[lang];

        let i = 0;
        while(i < pathParts.length && text !== undefined) {
            // Get through the route until target is reached
            // or when undefined is reached
            text = text[pathParts[i]];
            i++;
        }

        if(text === undefined)
            // Translation not found
            return route;

        // replace parameters in text
        for(let key in args) {
            let regex = new RegExp(`:${key}`, 'gm');
            text = text.replace(regex, args[key]);
        }

        // Translation was found
        return text;
    }

    /**
     * Translates and writes down to document a given route and replace 
     * the parameters, if exists, with args given. 
     * If translation is found, returns the translated text to current
     * language; if translation is not found, returns the string that 
     * was originally given.
     * 
     * @param {string} route 
     * @param {object} args
     * 
     * @return string 
     */
    write(route, args = {}) {
        let lang = this.lang;

        if (lang === null) {
            // No need to search for translation
            document.write(route);
            return;
        }

        let pathParts = route.split(this.separator);
        let text = this.langs[lang];

        let i = 0;
        while(i < pathParts.length && text !== undefined) {
            // Get through the route until target is reached
            // or when undefined is reached
            text = text[pathParts[i]];
            i++;
        }

        if(text === undefined) {
            // Translation not found
            document.write(route);
            return;
        }

        // replace parameters in text
        for(let key in args) {
            let regex = new RegExp(`:${key}`, 'gm');
            text = text.replace(regex, args[key]);
        }

        // Translation was found
        document.write(text);
    }

    /**
     * Adds a new translation entry for translations array
     * 
     * @param {string} key 
     * @param {string} content 
     * 
     * @return true if the translation was successfully added,
     *          false otherwise
     */
    addTranslations(key, content) {
        if (this.langs[key] !== undefined)
            return false;

        this.langs[key] = content;
        return true;
    }

    /**
     * Updates an existing translation entry for translations array
     * 
     * @param {string} key 
     * @param {string} content 
     * 
     * @return true if the translation was successfully updated,
     *          false otherwise
     */
    updateTranslations(key, content) {
        if (this.langs[key] === undefined)
            return false;

        this.langs[key] = content;
        return true;
    }

    saveSessionLang() {
        localStorage.setItem('langsjs.lang', this.lang);
    }

    restoreSessionLang(lang = 'en') {
        this.lang = localStorage.getItem('langsjs.lang') || lang;
    }

    // Define setters 
    set language(lang) {
        if(typeof lang === 'string' && lang.length > 2)
            lang = lang.substr(0, 2);
        this.lang = lang;
    }

    // Define getters
    get language() {
        return this.lang;
    }
}