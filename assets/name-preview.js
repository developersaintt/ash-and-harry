if (!customElements.get("name-preview")) {
  const NamePreview = class extends HTMLElement {
    constructor() {
      super();

      if (this.dataset.lineItemName.includes("[[")) return;

      this.localeCodes = {
        Afrikaans: "af",
        Albanian: "sq",
        Amharic: "am",
        "Arabic - Algeria": "ar-dz",
        "Arabic - Bahrain": "ar-bh",
        "Arabic - Egypt": "ar-eg",
        "Arabic - Iraq": "ar-iq",
        "Arabic - Jordan": "ar-jo",
        "Arabic - Kuwait": "ar-kw",
        "Arabic - Lebanon": "ar-lb",
        "Arabic - Libya": "ar-ly",
        "Arabic - Morocco": "ar-ma",
        "Arabic - Oman": "ar-om",
        "Arabic - Qatar": "ar-qa",
        "Arabic - Saudi Arabia": "ar-sa",
        Arabic: "ar-sa",
        "Arabic - Syria": "ar-sy",
        "Arabic - Tunisia": "ar-tn",
        "Arabic - United Arab Emirates": "ar-ae",
        "Arabic - Yemen": "ar-ye",
        Armenian: "hy",
        Assamese: "as",
        "Azeri - Cyrillic": "az-az",
        "Azeri - Latin": "az-az",
        Basque: "eu",
        Belarusian: "be",
        Bengali: "bn",
        "Bengali - Bangladesh": "bn",
        "Bengali - India": "bn",
        Bosnian: "bs",
        Bulgarian: "bg",
        Burmese: "my",
        Catalan: "ca",
        Chinese: "zh-cn",
        "Chinese - China": "zh-cn",
        "Chinese - Hong Kong SAR": "zh-hk",
        "Chinese - Macau SAR": "zh-mo",
        "Chinese - Singapore": "zh-sg",
        "Chinese - Taiwan": "zh-tw",
        Croatian: "hr",
        Czech: "cs",
        Danish: "da",
        Divehi: "Maldivian",
        "Dutch - Belgium": "nl-be",
        "Dutch - Netherlands": "nl-nl",
        Edo: "",
        "English - Australia": "en-au",
        "English - Belize": "en-bz",
        "English - Canada": "en-ca",
        "English - Caribbean": "en-cb",
        "English - Great Britain": "en-gb",
        "English - India": "en-in",
        "English - Ireland": "en-ie",
        "English - Jamaica": "en-jm",
        "English - New Zealand": "en-nz",
        "English - Philippines": "en-ph",
        "English - Southern Africa": "en-za",
        "English - Trinidad": "en-tt",
        "English - United States": "en-us",
        English: "en-us",
        "English - Zimbabwe": "",
        Estonian: "et",
        "FYRO Macedonia": "mk",
        Faroese: "fo",
        "Farsi - Persian": "fa",
        Filipino: "",
        Finnish: "fi",
        "French - Belgium": "fr-be",
        "French - Cameroon": "",
        "French - Canada": "fr-ca",
        "French - Congo": "",
        "French - Cote d'Ivoire": "",
        "French - France": "fr-fr",
        "French - Luxembourg": "fr-lu",
        "French - Mali": "",
        "French - Monaco": "",
        "French - Morocco": "",
        "French - Senegal": "",
        "French - Switzerland": "fr-ch",
        "French - West Indies": "",
        "Frisian - Netherlands": "",
        "Gaelic - Ireland": "gd-ie",
        "Gaelic - Scotland": "gd",
        Galician: "",
        Georgian: "",
        "German - Austria": "de-at",
        "German - Germany": "de-de",
        "German - Liechtenstein": "de-li",
        "German - Luxembourg": "de-lu",
        "German - Switzerland": "de-ch",
        Greek: "el",
        "Guarani - Paraguay": "gn",
        Gujarati: "gu",
        "HID (Human Interface Device)": "",
        Hebrew: "he",
        Hindi: "hi",
        Hungarian: "hu",
        Icelandic: "is",
        "Igbo - Nigeria": "",
        Indonesian: "id",
        "Italian - Italy": "it-it",
        "Italian - Switzerland": "it-ch",
        Japanese: "ja",
        Kannada: "kn",
        Kashmiri: "ks",
        Kazakh: "kk",
        Khmer: "km",
        Konkani: "",
        Korean: "ko",
        "Kyrgyz - Cyrillic": "",
        Lao: "lo",
        Latin: "la",
        Latvian: "lv",
        Lithuanian: "lt",
        "Malay - Brunei": "ms-bn",
        "Malay - Malaysia": "ms-my",
        Malayalam: "ml",
        Maltese: "mt",
        Manipuri: "",
        Maori: "mi",
        Marathi: "mr",
        Mongolian: "mn",
        Nepali: "ne",
        "Norwegian - Bokml": "no-no",
        "Norwegian - Nynorsk": "no-no",
        Oriya: "or",
        Polish: "pl",
        "Portuguese - Brazil": "pt-br",
        "Portuguese - Portugal": "pt-pt",
        Punjabi: "pa",
        "Raeto-Romance": "rm",
        "Romanian - Moldova": "ro-mo",
        "Romanian - Romania": "ro",
        Russian: "ru",
        "Russian - Moldova": "ru-mo",
        "Sami Lappish": "",
        Sanskrit: "sa",
        "Serbian - Cyrillic": "sr-sp",
        "Serbian - Latin": "sr-sp",
        "Sesotho (Sutu)": "",
        Setsuana: "tn",
        Sindhi: "sd",
        Sinhala: "si",
        Slovak: "sk",
        Slovenian: "sl",
        Somali: "so",
        Sorbian: "sb",
        "Spanish - Argentina": "es-ar",
        "Spanish - Bolivia": "es-bo",
        "Spanish - Chile": "es-cl",
        "Spanish - Colombia": "es-co",
        "Spanish - Costa Rica": "es-cr",
        "Spanish - Dominican Republic": "es-do",
        "Spanish - Ecuador": "es-ec",
        "Spanish - El Salvador": "es-sv",
        "Spanish - Guatemala": "es-gt",
        "Spanish - Honduras": "es-hn",
        "Spanish - Mexico": "es-mx",
        "Spanish - Nicaragua": "es-ni",
        "Spanish - Panama": "es-pa",
        "Spanish - Paraguay": "es-py",
        "Spanish - Peru": "es-pe",
        "Spanish - Puerto Rico": "es-pr",
        "Spanish - Spain (Traditional)": "es-es",
        "Spanish - Uruguay": "es-uy",
        "Spanish - Venezuela": "es-ve",
        Swahili: "sw",
        "Swedish - Finland": "sv-fi",
        "Swedish - Sweden": "sv-se",
        Syriac: "",
        Tajik: "tg",
        Tamil: "ta",
        Tatar: "tt",
        Telugu: "te",
        Thai: "th",
        Tibetan: "bo",
        Tsonga: "ts",
        Turkish: "tr",
        Turkmen: "tk",
        Ukrainian: "uk",
        Unicode: "UTF-8",
        Urdu: "ur",
        "Uzbek - Cyrillic": "uz-uz",
        "Uzbek - Latin": "uz-uz",
        Venda: "",
        Vietnamese: "vi",
        Welsh: "cy",
        Xhosa: "xh",
        Yiddish: "yi",
        Zulu: "zu",
      };

      this.googleTranslaterApi = `https://translation.googleapis.com/language/translate/v2?key=AIzaSyA4lnXsibx8hC8HinEeYOV5kGXSChttOjU`;

      this.selectors = {
        previewEl: ".name-preview",
        nameLengthEl: ".name-length",
        inputEl: "[name='Custom Name']",
        productForm: ".form.js-product-form",
        languageEl: "[name='personalization[choose-language]']",
      };

      this.productForm = document.querySelector(this.selectors.productForm);

      this.value = "";

      this.inputEl = this.querySelector(this.selectors.inputEl);
      this.previewEl = this.querySelector(this.selectors.previewEl);
      this.nameLengthEl = this.querySelector(this.selectors.nameLengthEl);

      this.maxLength = this.inputEl.getAttribute("maxlength");

      this.language = document.querySelector(
        this.selectors.languageEl
      ).selectedOptions[0].value;

      console.log(this.language);

      document
        .querySelector(this.selectors.languageEl)
        .addEventListener("change", (e) => {
          if (e.target.selectedOptions.length == 0) return;
          const target = e.target.selectedOptions[0].value;
          this.language = target;
          // this.updateLocalStorage("Language", target);
          this.handleInputChange();
        });

      this.inputEl.addEventListener(
        "change",
        debounce(() => {
          this.handleInputChange();
        })
      );
      this.inputEl.addEventListener(
        "keyup",
        debounce(() => {
          this.handleInputChange();
        })
      );

      setTimeout(() => {
        this.loadLastSavedPersonalizations();
      }, 100);
    }

    debounce(func, timeout = 300) {
      let timer;
      return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          func.apply(this, args);
        }, timeout);
      };
    }

    loadLastSavedPersonalizations = () => {
      const savedPersonalizations = localStorage.getItem("personalizations")
        ? JSON.parse(localStorage.getItem("personalizations"))
        : {};

      const lineItem = this.closest("[data-line-item-name]").dataset
        .lineItemName;

      const savedName = savedPersonalizations[lineItem];
      const savedLanguage = savedPersonalizations["Language"];

      if (savedLanguage) {
        setTimeout(() => {
          const languageSelector = document.querySelector(
            "#personalization_choose-language"
          );

          const selectedOption = languageSelector.querySelector(
            `.custom-select__option[data-value="${savedLanguage}"]`
          );

          if (selectedOption) {
            this.language = savedLanguage;
            languageSelector.selectOption(selectedOption);
            languageSelector.dispatchEvent(
              new CustomEvent("change", {
                bubbles: true,
                detail: {
                  selectedValue: this.language,
                },
              })
            );

            console.log(languageSelector);
            console.log(languageSelector.nativeSelect);
            if (languageSelector.nativeSelect) {
              languageSelector.nativeSelect.value = this.language;
              languageSelector.nativeSelect.dispatchEvent(
                new Event("change", { bubbles: true })
              );
            }
          }
        }, 1000);
      }

      if (savedName) {
        this.inputEl.value = savedName;
      }

      this.inputEl.dispatchEvent(new CustomEvent("change"));
    };

    updateLocalStorage = (key, value) => {
      const savedPersonalizations = localStorage.getItem("personalizations")
        ? JSON.parse(localStorage.getItem("personalizations"))
        : {};
      savedPersonalizations[key] = value;
      localStorage.setItem(
        "personalizations",
        JSON.stringify(savedPersonalizations)
      );

      const correspondingFields = ["Inscription", "Engraving", "Charm", "Name"];

      const otherCorrespondingFields = correspondingFields.filter(
        (field) => !key.includes(field) && field !== key
      );
      const index = key.split(" ")[0];

      otherCorrespondingFields.forEach((field) => {
        const lineItem = `${index} ${field}`;
        savedPersonalizations[lineItem] = value;
        localStorage.setItem(
          "personalizations",
          JSON.stringify(savedPersonalizations)
        );
      });
    };

    handleInputChange = () => {
      const name = this.inputEl.value;

      this.nameLengthEl.textContent = `${name.length}/${this.maxLength}`;

      const lineItem = this.closest("[data-line-item-name]")
        .dataset.lineItemName.replaceAll(":", "")
        .trim();

      if (this.productForm.querySelector(`[name="properties[${lineItem}]"]`)) {
        this.productForm.querySelector(
          `[name="properties[${lineItem}]"]`
        ).value = name;
      } else {
        const lineItemInput = document.createElement("input");
        lineItemInput.type = "hidden";
        lineItemInput.name = `properties[${lineItem}]`;
        lineItemInput.value = name;
        // this.productForm.appendChild(lineItemInput);

        let index = 0;
        this.closest("product-personalization")
          .querySelectorAll("[data-line-item-name]")
          .forEach((el, _index) => {
            if (el.dataset.lineItemName.trim() === lineItem.trim()) {
              index = _index;
            }
          });

        if (!lineItem.includes("[[")) {
          theme.insertElement(
            this.productForm.querySelector(".buy-buttons__custom-line-items"),
            lineItemInput,
            index - 1 // considering the langauge input
          );
        }
      }

      if (name) this.updateLocalStorage(lineItem, name);

      if (this.localeCodes[this.language] == "en-us") {
        this.previewEl.textContent = name;
        return;
      }

      fetch(this.googleTranslaterApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: name,
          source: "en",
          target: this.localeCodes[this.language],
          format: "text",
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.value = data.data.translations[0].translatedText;
          this.previewEl.textContent = data.data.translations[0].translatedText;
        })
        .catch((error) => console.error("Error:", error));
    };
  };

  window.customElements.define("name-preview", NamePreview);
}
