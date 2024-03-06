if (!customElements.get("custom-select")) {
  class CustomSelect extends HTMLElement {
    constructor() {
      super();
      this.button = this.querySelector(".custom-select__btn");
      this.listbox = this.querySelector(".custom-select__listbox");
      this.selectedOption = this.querySelector('[aria-selected="true"]');

      // Set the selected option.
      if (!this.selectedOption) {
        this.selectedOption = this.listbox.firstElementChild;
      }

      this.setButtonWidth();
      window.initLazyScript(this, this.init.bind(this));
    }

    init() {
      this.options = this.querySelectorAll(".custom-select__option");
      this.nativeSelect = document.getElementById(`${this.id}-native`);
      this.swatches = "swatch" in this.options[0].dataset;
      this.focusedClass = "is-focused";
      this.searchString = "";
      this.listboxOpen = false;
      this.selectedOption = this.querySelector('[aria-selected="true"]');

      // Set the selected option.
      if (!this.selectedOption) {
        this.selectedOption = this.listbox.firstElementChild;
      }

      this.addEventListener("keydown", this.handleKeydown.bind(this));
      this.button.addEventListener(
        "mousedown",
        this.handleMousedown.bind(this)
      );

      // this.createLineItem();

      setTimeout(() => {
        this.loadLastSavedOption();
      }, 0);
    }

    /**
     * Returns the next visible sibling element
     * @param {Element} elem - The element to search
     * @returns {Element}
     */
    static getNextVisibleSibling(elem) {
      let sibling = elem.nextElementSibling;
      while (sibling) {
        if (sibling.style.display !== "none") return sibling;
        sibling = sibling.nextElementSibling;
      }
      return null;
    }

    /**
     * Returns the previous visible sibling element
     * @param {Element} elem - The element to search
     * @returns {Element}
     */
    static getPreviousVisibleSibling(elem) {
      let sibling = elem.previousElementSibling;
      while (sibling) {
        if (sibling.style.display !== "none") return sibling;
        sibling = sibling.previousElementSibling;
      }
      return null;
    }

    /**
     * Adds event listeners when the options list is open.
     */
    addListboxOpenListeners() {
      this.mouseoverHandler = this.handleMouseover.bind(this);
      this.mouseleaveHandler = this.handleMouseleave.bind(this);
      this.clickHandler = this.handleClick.bind(this);
      this.blurHandler = this.handleBlur.bind(this);

      this.listbox.addEventListener("mouseover", this.mouseoverHandler);
      this.listbox.addEventListener("mouseleave", this.mouseleaveHandler);
      this.listbox.addEventListener("click", this.clickHandler);
      this.listbox.addEventListener("blur", this.blurHandler);
    }

    /**
     * Removes event listeners added when the options list was open.
     */
    removeListboxOpenListeners() {
      this.listbox.removeEventListener("mouseover", this.mouseoverHandler);
      this.listbox.removeEventListener("mouseleave", this.mouseleaveHandler);
      this.listbox.removeEventListener("click", this.clickHandler);
      this.listbox.removeEventListener("blur", this.blurHandler);
    }

    /**
     * Handles 'keydown' events on the custom select element.
     * @param {object} evt - Event object.
     */
    handleKeydown(evt) {
      if (this.listboxOpen) {
        this.handleKeyboardNav(evt);
      } else if (
        evt.key === "ArrowUp" ||
        evt.key === "ArrowDown" ||
        evt.key === " "
      ) {
        evt.preventDefault();
        this.showListbox();
      }
    }

    /**
     * Handles 'mousedown' events on the button element.
     * @param {object} evt - Event object.
     */
    handleMousedown(evt) {
      if (!this.listboxOpen && evt.button === 0) {
        this.showListbox();
      }
    }

    /**
     * Handles 'mouseover' events on the options list.
     * @param {object} evt - Event object.
     */
    handleMouseover(evt) {
      if (evt.target.matches("li")) {
        this.focusOption(evt.target);
      }
    }

    /**
     * Handles 'mouseleave' events on the options list.
     */
    handleMouseleave() {
      this.focusOption(this.selectedOption);
    }

    /**
     * Handles 'click' events on the custom select element.
     * @param {object} evt - Event object.
     */
    handleClick(evt) {
      // mouse down + move + up will trigger a click event on parent - only respond to clicks on LI
      if (evt.target.tagName === "LI") {
        this.selectOption(evt.target);
      }
    }

    /**
     * Handles 'blur' events on the options list.
     */
    handleBlur() {
      if (this.listboxOpen) {
        this.hideListbox();
      }
    }

    /**
     * Handles 'keydown' events on the options list.
     * @param {object} evt - Event object.
     */
    handleKeyboardNav(evt) {
      let optionToFocus;

      // Disable tabbing if options list is open (as per native select element).
      if (evt.key === "Tab") {
        evt.preventDefault();
      }

      switch (evt.key) {
        // Focus an option.
        case "ArrowUp":
        case "ArrowDown":
          evt.preventDefault();

          if (evt.key === "ArrowUp") {
            optionToFocus = CustomSelect.getPreviousVisibleSibling(
              this.focusedOption
            );
          } else {
            optionToFocus = CustomSelect.getNextVisibleSibling(
              this.focusedOption
            );
          }

          if (
            optionToFocus &&
            !optionToFocus.classList.contains("is-disabled")
          ) {
            this.focusOption(optionToFocus);
          }
          break;

        // Select an option.
        case "Enter":
        case " ":
          evt.preventDefault();
          this.selectOption(this.focusedOption);
          break;

        // Cancel and close the options list.
        case "Escape":
          evt.preventDefault();
          this.hideListbox();
          break;

        // Search for an option and focus the first match (if one exists).
        default:
          optionToFocus = this.findOption(evt.key);

          if (optionToFocus) {
            this.focusOption(optionToFocus);
          }
          break;
      }
    }

    /**
     * Sets the button width to the same as the longest option, to prevent
     * the button width from changing depending on the option selected.
     */
    setButtonWidth() {
      // Get the width of an element without side padding.
      const getHorizontalPadding = (el) => {
        const elStyle = getComputedStyle(el);
        return (
          parseFloat(elStyle.paddingLeft) + parseFloat(elStyle.paddingRight)
        );
      };

      const buttonPadding = getHorizontalPadding(this.button);
      const optionPadding = getHorizontalPadding(this.selectedOption);
      const buttonBorder = this.button.offsetWidth - this.button.clientWidth;
      const optionWidth = Math.ceil(
        this.selectedOption.getBoundingClientRect().width
      );

      this.button.style.setProperty(
        "--custom-select-button-width",
        `${optionWidth - optionPadding + buttonPadding + buttonBorder}px`
      );
    }

    /**
     * Shows the options list.
     */
    showListbox() {
      this.listbox.hidden = false;
      this.listboxOpen = true;

      this.classList.add("is-open");
      this.button.setAttribute("aria-expanded", "true");
      this.listbox.setAttribute("aria-hidden", "false");

      // Slight delay required to prevent blur event being fired immediately.
      setTimeout(() => {
        this.focusOption(this.selectedOption);
        this.listbox.focus();

        this.addListboxOpenListeners();
      });
    }

    /**
     * Hides the options list.
     */
    hideListbox() {
      if (!this.listboxOpen) return;

      this.listbox.hidden = true;
      this.listboxOpen = false;

      this.classList.remove("is-open");
      this.button.setAttribute("aria-expanded", "false");
      this.listbox.setAttribute("aria-hidden", "true");

      if (this.focusedOption) {
        this.focusedOption.classList.remove(this.focusedClass);
        this.focusedOption = null;
      }

      this.button.focus();
      this.removeListboxOpenListeners();
    }

    /**
     * Finds a matching option from a typed string.
     * @param {string} key - Key pressed.
     * @returns {?Element}
     */
    findOption(key) {
      this.searchString += key;

      // If there's a timer already running, clear it.
      if (this.searchTimer) {
        clearTimeout(this.searchTimer);
      }

      // Wait 500ms to see if another key is pressed, if not then clear the search string.
      this.searchTimer = setTimeout(() => {
        this.searchString = "";
      }, 500);

      // Find an option that contains the search string (if there is one).
      const matchingOption = Array.from(this.options).find((option) => {
        const label = option.innerText.toLowerCase();
        return (
          label.includes(this.searchString) &&
          !option.classList.contains("is-disabled")
        );
      });

      return matchingOption;
    }

    /**
     * Focuses an option.
     * @param {Element} option - <li> element of the option to focus.
     */
    focusOption(option) {
      // Remove focus on currently focused option (if there is one).
      if (this.focusedOption) {
        this.focusedOption.classList.remove(this.focusedClass);
      }

      // Set focus on the option.
      this.focusedOption = option;
      this.focusedOption.classList.add(this.focusedClass);

      // If option is out of view, scroll the list.
      if (this.listbox.scrollHeight > this.listbox.clientHeight) {
        const scrollBottom = this.listbox.clientHeight + this.listbox.scrollTop;
        const optionBottom = option.offsetTop + option.offsetHeight;

        if (optionBottom > scrollBottom) {
          this.listbox.scrollTop = optionBottom - this.listbox.clientHeight;
        } else if (option.offsetTop < this.listbox.scrollTop) {
          this.listbox.scrollTop = option.offsetTop;
        }
      }
    }

    /**
     * Selects an option.
     * @param {Element} option - Option <li> element.
     */
    selectOption(option) {
      if (option !== this.selectedOption) {
        // Switch aria-selected attribute to selected option.
        option.setAttribute("aria-selected", "true");
        this.selectedOption.setAttribute("aria-selected", "false");

        // Update swatch colour in the button.
        if (this.swatches) {
          this.button.dataset.swatch = option.dataset.swatch;
        }

        // Update the button text and set the option as active.
        if (this.button.dataset.includeHtml == "") {
          this.button.firstElementChild.innerHTML = option.innerHTML;
        } else {
          this.button.firstElementChild.textContent =
            option.firstElementChild.textContent;
        }
        this.listbox.setAttribute("aria-activedescendant", option.id);
        this.selectedOption = document.getElementById(option.id);

        // If a native <select> exists, update its selected value and dispatch a 'change' event.
        if (this.nativeSelect) {
          this.nativeSelect.value = option.dataset.value;
          this.nativeSelect.dispatchEvent(
            new Event("change", { bubbles: true })
          );
        } else {
          // Dispatch a 'change' event on the custom select element.
          const detail = { selectedValue: option.dataset.value };
          this.dispatchEvent(
            new CustomEvent("change", { bubbles: true, detail })
          );
        }

        if (
          !this.closest("product-personalization") ||
          !this.closest("[data-line-item-name]")
        ) {
          this.hideListbox();
          return;
        }

        const lineItemKey = this.closest("[data-line-item-name]")
          .dataset.lineItemName.replace(":", "")
          .trim();

        console.table({
          lineItemKey,
          value: option.dataset.text || option.dataset.value,
        });

        if (!lineItemKey) return;
        const optionValue = option.dataset.text || option.dataset.value;

        if (lineItemKey.toLowerCase().includes("initial")) {
          const selectedLanguage = this.closest(
            "product-personalization"
          ).querySelector('[data-line-item-name="Language"] custom-select')
            .selectedOption.dataset.value;

          this.updateLocalStorage(
            `${selectedLanguage} ${lineItemKey}`,
            optionValue
          );
        } else {
          this.updateLocalStorage(lineItemKey, optionValue);
        }
        this.updateLineItemValue(lineItemKey, optionValue);

        if (lineItemKey == "Language") {
          // console.log(lineItemKey);
          const initials = {
            english: "A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z",
            urdu: "ا,ب,پ,ت,ٹ,ث,ج,چ,ح,خ,د,ڈ,ذ,ر,ڑ,ز,ژ,س,ش,ص,ض,ط,ظ,ع,غ,ف,ق,ک,گ,ل,م,ن,و,ہ,ھ,ء,ی,ے",
            chinese:
              "诶,比,西,迪,伊,艾弗,吉,艾尺,艾,杰,开,艾勒,艾马,艾娜,哦,屁,吉吾,艾儿,艾丝,提,伊吾,维,豆贝尔维,艾克斯,吾艾,贼德",
            japanese:
              "あ,い,う,え,お,か,き,く,け,こ,さ,し,す,せ,そ,た,ち,つ,て,と,な,に,ぬ,ね,の,は,ひ,ふ,へ,ほ,ま,み,む,め,も,や,ゆ,よ,ら,り,る,れ,ろ,わ,を,ん",
            katakana:
              "ア,イ,ウ,エ,オ,カ,キ,ク,ケ,コ,サ,シ,ス,セ,ソ,タ,チ,ツ,テ,ト,ナ,ニ,ヌ,ネ,ノ,ハ,ヒ,フ,ヘ,ホ,マ,ミ,ム,メ,モ,ヤ,ユ,ヨ,ラ,リ,ル,レ,ロ,ワ,ヲ,ン",
            korean: "가,나,다,라,마,바,사,아,자,차,카,타,파,하",
            russian:
              "А,Б,В,Г,Д,Е,Ё,Ж,З,И,Й,К,Л,М,Н,О,П,Р,С,Т,У,Ф,Х,Ц,Ч,Ш,Щ,Ъ,Ы,Ь,Э,Ю,Я",
            arabic: "ا,ب,ت,ث,ج,ح,خ,د,ذ,ر,ز,س,ش,ص,ض,ط,ظ,ع,غ,ف,ق,ك,ل,م,ن,هـ,و,ي",
            bengali:
              "ক,খ,গ,ঘ,ঙ,চ,ছ,জ,ঝ,ঞ,ট,ঠ,ড,ঢ,ণ,ত,থ,দ,ধ,ন,প,ফ,ব,ভ,ম,য,র,ল,শ,ষ,স,হ,য়,ড়,ঢ়",
            hindi:
              "अ,आ,ए,ई,ऍ,ऎ,ऐ,इ,ओ,ऑ,ऒ,ऊ,औ,उ,ब,भ,च,छ,ड,ढ,फ,फ़,ग,घ,ग़,ह,ज,झ,क,ख,ख़,ल,ळ,ऌ,ऴ,ॡ,म,न,ङ,ञ,ण,ऩ,ॐ,प,क़,र,ऋ,ॠ,ऱ,स,श,ष,ट,त,ठ,द,थ,ध,ड़,ढ़,व,य,य़,ज़",
            gujarati:
              "અ,આ,ઇ,ઈ,ઉ,ઊ,ઋ,એ,ઐ,ઓ,ઔ,ઍ,ઑ,ા,િ,ી,ુ,ૂ,ૃ,ે,ૈ,ો,ૌ,ૅ,ૉ,ક,ચ,ટ,ત,પ,ખ,છ,ઠ,થ,ફ,ગ,જ,ડ,દ,બ,ઘ,ઝ,ઢ,ધ,ભ,ઙ,ઞ,ણ,ન,મ,ય,ર,લ,વ,શ,ષ,સ,હ,ળ,ં",
            punjabi:
              "ਓ,ਅ,ੲ,ਸ,ਹ,ਕ,ਖ,ਗ,ਘ,ਙ,ਚ,ਛ,ਜ,ਝ,ਞ,ਟ,ਠ,ਡ,ਢ,ਣ,ਤ,ਥ,ਦ,ਧ,ਨ,ਪ,ਫ,ਬ,ਭ,ਮ,ਯ,ਰ,ਲ,ਵ,ੜ,ਸ਼,ਖ਼,ਗ਼,ਜ਼,ਫ਼,ਲ਼",
          };

          const langaugeInitials =
            initials[optionValue.toLowerCase()].split(",");

          const initialsDropdowns = this.closest(
            "product-personalization"
          ).querySelectorAll("[data-dropdown-type='initials']");

          // const initialsNativeDropdown = this.closest(
          //   "product-personalization"
          // ).querySelector(
          //   "[data-line-item-name='Initial'] .custom-select__native"
          // );

          let options = "";
          langaugeInitials.forEach((langaugeInitial, index) => {
            options += `<li class="custom-select__option flex items-center js-option" id="personalization_choose-your-initials-opt-${langaugeInitial}" role="option" data-value="${langaugeInitial}" aria-selected="${
              index == 0 ? "true" : "false"
            }"><span class="pointer-events-none">${langaugeInitial}</span></li>`;
          });

          let navtiveOptions = "";
          langaugeInitials.forEach((langaugeInitial, index) => {
            navtiveOptions += `<option value="${langaugeInitial}">${langaugeInitial}</option>`;
          });

          let initialsList = "";
          langaugeInitials.forEach((langaugeInitial, index) => {
            initialsList += `<li>${langaugeInitial}</li>`;
          });

          initialsDropdowns.forEach((initialsDropdown) => {
            const initialsNativeDropdown = initialsDropdown.querySelector(
              ".custom-select__native"
            );
            initialsDropdown.querySelector(
              ".custom-select__listbox"
            ).innerHTML = options;

            initialsNativeDropdown.innerHTML = navtiveOptions;

            const savedPersonalizations = localStorage.getItem(
              "personalizations"
            )
              ? JSON.parse(localStorage.getItem("personalizations"))
              : {};

            const selectedLanguage = this.closest(
              "product-personalization"
            ).querySelector('[data-line-item-name="Language"] custom-select')
              .selectedOption.dataset.value;

            const savedValue =
              savedPersonalizations[
                `${selectedLanguage} ${initialsDropdown.dataset.lineItemName}`
              ] || langaugeInitials[0];

            initialsDropdown.querySelector(
              ".custom-select__btn .text-start"
            ).innerText = savedValue;

            // updating popup
            const modalId =
              initialsDropdown.querySelector("modal-opener").dataset.modal;

            const modalDialog = document.getElementById(modalId);
            modalDialog.querySelector(".font-container ul").innerHTML =
              initialsList;

            setTimeout(() => {
              initialsDropdown
                .querySelector("custom-select")
                .selectOption(
                  initialsDropdown.querySelector(
                    `.custom-select__option[data-value="${savedValue}"]`
                  )
                );

              this.updateLineItemValue(
                initialsDropdown.dataset.lineItemName
                  .replaceAll(":", "")
                  .trim(),
                savedValue
              );
            }, 0);
          });
        }
      }

      this.hideListbox();
    }

    updateLocalStorage = (key, value) => {
      const savedPersonalizations = localStorage.getItem("personalizations")
        ? JSON.parse(localStorage.getItem("personalizations"))
        : {};

      savedPersonalizations[key] = value;
      localStorage.setItem(
        "personalizations",
        JSON.stringify(savedPersonalizations)
      );
    };

    updateLineItemValue = (key, value) => {
      const productForm = document.querySelector(".form.js-product-form");
      if (productForm.querySelector(`[name="properties[${key}]"]`)) {
        productForm.querySelector(`[name="properties[${key}]"]`).value = value;
      } else {
        // s;
        const lineItemInput = document.createElement("input");
        lineItemInput.type = "hidden";
        lineItemInput.name = `properties[${key}]`;
        lineItemInput.value = value;
        // productForm.appendChild(lineItemInput);

        let index = 0;
        this.closest("product-personalization")
          .querySelectorAll("[data-line-item-name]")
          .forEach((el, _index) => {
            if (el.dataset.lineItemName.trim() === key.trim()) {
              index = _index;
            }
          });

        if (!key.includes("[[")) {
          theme.insertElement(
            productForm.querySelector(".buy-buttons__custom-line-items"),
            lineItemInput,
            index - 1 // considering the langauge input
          );
        }
      }
    };

    loadLastSavedOption() {
      // debugger;
      if (!this.closest("product-personalization")) return;
      if (!this.closest("[data-line-item-name]")) return;

      const lineItemKey = this.closest("[data-line-item-name]")
        .dataset.lineItemName.replace(":", "")
        .trim();

      const savedPersonalizations = localStorage.getItem("personalizations")
        ? JSON.parse(localStorage.getItem("personalizations"))
        : {};

      let savedValue = savedPersonalizations[lineItemKey];

      if (lineItemKey.toLowerCase().includes("initial")) {
        const selectedLanguage = this.closest(
          "product-personalization"
        ).querySelector("#personalization_choose-language").selectedOption
          .dataset.value;

        savedValue =
          savedPersonalizations[`${selectedLanguage} ${lineItemKey}`];

        console.table({
          type: "Loading Last Saved",
          selectedLanguage,
          lineItemKey,
          savedValue,
        });
      }

      let selectedItem;

      if (savedValue) {
        selectedItem = this.querySelector(
          `.custom-select__option[data-value="${savedValue}"]`
        );
        if (!selectedItem) {
          selectedItem = this.querySelector(
            `.custom-select__option[data-text="${savedValue}"]`
          );
        }
        if (selectedItem) {
          this.selectOption(selectedItem);
        }
      }

      if (!savedValue || !selectedItem)
        savedValue =
          this.selectedOption.dataset.text || this.selectedOption.dataset.value;

      this.updateLineItemValue(lineItemKey, savedValue);

      document.addEventListener("personalizationoption:value:updated", (e) => {
        const { key, value } = e.detail;

        if (key != "Language") return;
        if (!lineItemKey.toLowerCase().includes("initial")) return;

        savedValue = savedPersonalizations[`${value} ${lineItemKey}`];

        setTimeout(() => {
          if (savedValue) {
            let selectedItem = this.querySelector(
              `.custom-select__option[data-value="${savedValue}"]`
            );
            if (!selectedItem) {
              selectedItem = this.querySelector(
                `.custom-select__option[data-text="${savedValue}"]`
              );
            }

            if (selectedItem) {
              this.selectOption(selectedItem);
            }
          }

          if (!savedValue)
            savedValue =
              this.selectedOption.dataset.text ||
              this.selectedOption.dataset.value;

          this.updateLineItemValue(lineItemKey, savedValue);
        }, 1000);
      });

      document.dispatchEvent(
        new CustomEvent("personalizationoption:value:updated", {
          bubbles: true,
          detail: {
            key: lineItemKey,
            value: savedValue,
          },
        })
      );

      // setTimeout(() => {
      //   this.updateLineItemValue(lineItemKey, savedValue);
      // }, 1000);
    }
  }

  customElements.define("custom-select", CustomSelect);
}
