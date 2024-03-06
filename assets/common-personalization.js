if (!customElements.get("product-personalization")) {
  const ProductPersonalization = class extends HTMLElement {
    connectedCallback() {
      this.type = this.getAttribute("type");
      this.selectors = {
        injectedFieldsPlaceholder: "[inejcted-fields-placeholder]",
        productForm: ".form.js-product-form",
        dataLineItemName: "[data-line-item-name]",
      };

      this.savedPersonalizations = localStorage.getItem("personalizations")
        ? JSON.parse(localStorage.getItem("personalizations"))
        : {};

      this.personalizationOptions = Array.from(
        this.querySelectorAll("custom-select[id^='personalization_']")
      );

      this.namePreviews = Array.from(this.querySelectorAll("name-preview"));

      this.productForm = document.querySelector(this.selectors.productForm);

      this.injectedFieldsPlaceholder = this.querySelector(
        this.selectors.injectedFieldsPlaceholder
      );

      this.querySelectorAll(this.selectors.dataLineItemName).forEach((el) => {
        el.dataset.lineItemName = el.dataset.lineItemName.replaceAll(": ", "");
        el.dataset.lineItemName = el.dataset.lineItemName.replaceAll(":", "");
      });

      this.templates = {
        initials: "template-initials",
        name: "template-name-preview",
        ringsize: "template-ring-size",
        gemstone: "template-gemstone-type",
      };

      switch (this.type) {
        case "single-initial":
          document.addEventListener("on:variant:change", (event) => {
            this.singleInitial(
              parseFloat(event.detail.variant.option1.split(" ")[0])
            );
          });
          this.singleInitial(
            parseFloat(
              document
                .querySelector("variant-picker")
                .variant.option1.split(" ")[0]
            )
          );
          // this.multipleNameMultipleGemstone();
          break;

        case "single-initial-single-gemstone":
          // this.multipleNameMultipleGemstone();
          break;

        case "single-initial-single-size":
          // this.multipleNameMultipleGemstone();
          break;

        case "multiple-initials-multiple-sizes":
          document.addEventListener("on:variant:change", (event) => {
            this.multipleInitialsMultipleSizes(
              parseFloat(event.detail.variant.option1.split(" ")[0])
            );
          });
          this.multipleInitialsMultipleSizes(
            parseFloat(
              document
                .querySelector("variant-picker")
                .variant.option1.split(" ")[0]
            )
          );

          break;

        case "multiple-initials-single-gemstone":
          document.addEventListener("on:variant:change", (event) => {
            this.multipleInitialsSingleGemstone(
              parseFloat(event.detail.variant.option1.split(" ")[0])
            );
          });
          this.multipleInitialsSingleGemstone(
            parseFloat(
              document
                .querySelector("variant-picker")
                .variant.option1.split(" ")[0]
            )
          );

          break;

        case "multiple-initials-multiple-gemstones":
          document.addEventListener("on:variant:change", (event) => {
            this.multipleInitialsMultipleGemstones(
              parseFloat(event.detail.variant.option1.split(" ")[0])
            );
          });
          this.multipleInitialsMultipleGemstones(
            parseFloat(
              document
                .querySelector("variant-picker")
                .variant.option1.split(" ")[0]
            )
          );

          break;

        case "single-name-single-gemstone":
          // this.multipleNameMultipleGemstone();
          break;

        case "multiple-name-no-stones":
          document.addEventListener("on:variant:change", (event) => {
            this.multipleNameNoGemstone(
              parseFloat(event.detail.variant.option1.split(" ")[0])
            );
          });
          this.multipleNameNoGemstone(
            parseFloat(
              document
                .querySelector("variant-picker")
                .variant.option1.split(" ")[0]
            )
          );

        case "multiple-name-single-gemstone":
          document.addEventListener("on:variant:change", (event) => {
            this.multipleNameSingleGemstone(
              parseFloat(event.detail.variant.option1.split(" ")[0])
            );
          });
          this.multipleNameSingleGemstone(
            parseFloat(
              document
                .querySelector("variant-picker")
                .variant.option1.split(" ")[0]
            )
          );

          break;

        case "multiple-initials-no-stones":
          document.addEventListener("on:variant:change", (event) => {
            this.multipleInitialsNoStones(
              parseFloat(event.detail.variant.option1.split(" ")[0])
            );
          });
          this.multipleInitialsNoStones(
            parseFloat(
              document
                .querySelector("variant-picker")
                .variant.option1.split(" ")[0]
            )
          );
          break;

        case "multiple-name-multiple-gemstone":
          document.addEventListener("on:variant:change", (event) => {
            this.multipleNameMultipleGemstone(
              parseFloat(event.detail.variant.option1.split(" ")[0])
            );
          });
          this.multipleNameMultipleGemstone(
            parseFloat(
              document
                .querySelector("variant-picker")
                .variant.option1.split(" ")[0]
            )
          );
          break;

        case "two-names-field(left & right)":
          // this.multipleNameMultipleGemstone();
          break;

        case "two-names-two-gemstones":
          // this.multipleNameMultipleGemstone();
          break;

        default:
          break;
      }

      this.querySelectorAll(".custom-select__native").forEach((select) => {
        select.addEventListener("change", (e) => {
          this.handleInputChange(e.target);
        });
      });
    }

    convertIntToStringCount(index) {
      switch (index) {
        case 1:
          return "First";
          break;
        case 2:
          return "Second";
          break;
        case 3:
          return "Third";
          break;
        case 4:
          return "Fourth";
          break;
        case 5:
          return "Fifth";
          break;
        case 6:
          return "Sixth";
          break;
        case 7:
          return "Seventh";
          break;

        default:
          break;
      }
    }

    handleInputChange(target) {
      let value = target.value;
      if (target.name.includes("gemstone")) {
        value = target.selectedOptions[0].innerText.trim();
      }

      const lineItem = target
        .closest(this.selectors.dataLineItemName)
        .dataset.lineItemName.replaceAll(":", "")
        .trim();

      if (this.productForm.querySelector(`[name="properties[${lineItem}]"]`)) {
        this.productForm.querySelector(
          `[name="properties[${lineItem}]"]`
        ).value = value;
      } else {
        const lineItemInput = document.createElement("input");
        lineItemInput.type = "hidden";
        lineItemInput.name = `properties[${lineItem}]`;
        lineItemInput.value = value;
        // this.productForm.appendChild(lineItemInput);

        let index = 0;
        this.querySelectorAll("[data-line-item-name]").forEach((el, _index) => {
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
    }

    removeInjectedFields() {
      const lineItemsToRemove = Array.from(
        this.injectedFieldsPlaceholder.querySelectorAll("[data-line-item-name]")
      ).map((el) => el.dataset.lineItemName);

      console.log(lineItemsToRemove);

      lineItemsToRemove.forEach((lineItem) => {
        this.productForm.querySelector(
          `[name="properties[${lineItem}]"]`
        ).value = "";
      });
      this.injectedFieldsPlaceholder.innerHTML = "";
    }

    multipleInitialsMultipleGemstones(itemsToDuplicate) {
      this.removeInjectedFields();
      for (let index = 1; index < itemsToDuplicate; index++) {
        const fieldLabelIndex = this.convertIntToStringCount(index + 1);

        const customFieldLabel = this.dataset.customFieldLabel || "Initial";

        const initialsElHTML = this.querySelector(this.templates.initials)
          .innerHTML.replaceAll(
            "[[FieldLabel]]",
            `${fieldLabelIndex} ${customFieldLabel}`
          )
          .replaceAll(
            "fieldlabel",
            `${fieldLabelIndex.toLowerCase()}-${customFieldLabel.toLowerCase()}`
          )
          .replaceAll(
            "[[LineItemLabel]]",
            `${fieldLabelIndex} ${customFieldLabel}`
          );

        const gemstoneElHTML = this.querySelector(this.templates.gemstone)
          .innerHTML.replaceAll("[[FieldLabel]]", `${fieldLabelIndex} Gemstone`)
          .replaceAll("fieldlabel", `${fieldLabelIndex.toLowerCase()}-gemstone`)
          .replaceAll("[[LineItemLabel]]", `${fieldLabelIndex} Gemstone`);

        const initialsEl = new DOMParser().parseFromString(
          initialsElHTML,
          "text/html"
        );

        const gemstoneEl = new DOMParser().parseFromString(
          gemstoneElHTML,
          "text/html"
        );

        this.injectedFieldsPlaceholder.appendChild(initialsEl.body.firstChild);
        this.injectedFieldsPlaceholder.appendChild(gemstoneEl.body.firstChild);
      }
    }
    multipleNameMultipleGemstone(itemsToDuplicate) {
      this.removeInjectedFields();
      for (let index = 1; index < itemsToDuplicate; index++) {
        const fieldLabelIndex = this.convertIntToStringCount(index + 1);

        const customFieldLabel = this.dataset.customFieldLabel || "Name";

        const customPersonalizationLabel =
          window.theme.personalizations.labels[index];

        let fieldLabel = `${fieldLabelIndex} ${customFieldLabel}`;

        if (customPersonalizationLabel) {
          fieldLabel = customPersonalizationLabel;
        }

        const nameElHTML = this.querySelector(this.templates.name)
          .innerHTML.replaceAll("[[FieldLabel]]", fieldLabel)
          .replaceAll("fieldlabel", fieldLabel)
          .replaceAll("[[LineItemLabel]]", fieldLabel);

        const gemstoneElHTML = this.querySelector(this.templates.gemstone)
          .innerHTML.replaceAll("[[FieldLabel]]", `${fieldLabelIndex} Gemstone`)
          .replaceAll("fieldlabel", `${fieldLabelIndex.toLowerCase()}-gemstone`)
          .replaceAll("[[LineItemLabel]]", `${fieldLabelIndex} Gemstone`);

        const nameEl = new DOMParser().parseFromString(nameElHTML, "text/html");

        const gemstoneEl = new DOMParser().parseFromString(
          gemstoneElHTML,
          "text/html"
        );

        this.injectedFieldsPlaceholder.appendChild(nameEl.body.firstChild);
        this.injectedFieldsPlaceholder.appendChild(gemstoneEl.body.firstChild);
      }
    }

    multipleInitialsNoStones(itemsToDuplicate) {
      this.removeInjectedFields();
      for (let index = 1; index < itemsToDuplicate; index++) {
        const fieldLabelIndex = this.convertIntToStringCount(index + 1);

        const customFieldLabel = this.dataset.customFieldLabel || "Initial";

        const customPersonalizationLabel =
          window.theme.personalizations.labels[index];

        let fieldLabel = `${fieldLabelIndex} ${customFieldLabel}`;

        if (customPersonalizationLabel) {
          fieldLabel = customPersonalizationLabel;
        }

        const initialsElHTML = this.querySelector(this.templates.initials)
          .innerHTML.replaceAll("[[FieldLabel]]", fieldLabel)
          .replaceAll("fieldlabel", fieldLabel)
          .replaceAll("[[LineItemLabel]]", fieldLabel);

        const initialsEl = new DOMParser().parseFromString(
          initialsElHTML,
          "text/html"
        );

        this.injectedFieldsPlaceholder.appendChild(initialsEl.body.firstChild);
      }
    }

    multipleInitialsSingleGemstone(itemsToDuplicate) {
      this.removeInjectedFields();
      for (let index = 1; index < itemsToDuplicate; index++) {
        const fieldLabelIndex = this.convertIntToStringCount(index + 1);

        const customFieldLabel = this.dataset.customFieldLabel || "Initial";

        const initialsElHTML = this.querySelector(this.templates.initials)
          .innerHTML.replaceAll(
            "[[FieldLabel]]",
            `${fieldLabelIndex} ${customFieldLabel}`
          )
          .replaceAll(
            "fieldlabel",
            `${fieldLabelIndex.toLowerCase()}-${customFieldLabel.toLowerCase()}`
          )
          .replaceAll(
            "[[LineItemLabel]]",
            `${fieldLabelIndex} ${customFieldLabel}`
          );

        const initialsEl = new DOMParser().parseFromString(
          initialsElHTML,
          "text/html"
        );

        this.injectedFieldsPlaceholder.appendChild(initialsEl.body.firstChild);
      }
    }

    multipleInitialsMultipleSizes(itemsToDuplicate) {
      this.removeInjectedFields();
      for (let index = 1; index < itemsToDuplicate; index++) {
        const fieldLabelIndex = this.convertIntToStringCount(index + 1);

        const customFieldLabel = this.dataset.customFieldLabel || "Initial";

        const initialsElHTML = this.querySelector(this.templates.initials)
          .innerHTML.replaceAll(
            "[[FieldLabel]]",
            `${fieldLabelIndex} ${customFieldLabel}`
          )
          .replaceAll(
            "fieldlabel",
            `${fieldLabelIndex.toLowerCase()}-${customFieldLabel.toLowerCase()}`
          )
          .replaceAll(
            "[[LineItemLabel]]",
            `${fieldLabelIndex} ${customFieldLabel}`
          );

        const sizesElHTML = this.querySelector(this.templates.ringsize)
          .innerHTML.replaceAll(
            "[[FieldLabel]]",
            `${fieldLabelIndex} Ring Size`
          )
          .replaceAll(
            "fieldlabel",
            `${fieldLabelIndex.toLowerCase()}-Ring-Size`
          )
          .replaceAll("[[LineItemLabel]]", `${fieldLabelIndex} Ring Size`);

        const initialsEl = new DOMParser().parseFromString(
          initialsElHTML,
          "text/html"
        );

        const sizesEl = new DOMParser().parseFromString(
          sizesElHTML,
          "text/html"
        );

        this.injectedFieldsPlaceholder.appendChild(initialsEl.body.firstChild);
        this.injectedFieldsPlaceholder.appendChild(sizesEl.body.firstChild);
      }
    }

    multipleNameSingleGemstone(itemsToDuplicate) {
      this.removeInjectedFields();
      for (let index = 1; index < itemsToDuplicate; index++) {
        const fieldLabelIndex = this.convertIntToStringCount(index + 1);

        const customFieldLabel = this.dataset.customFieldLabel || "Name";

        const customPersonalizationLabel =
          window.theme.personalizations.labels[index];

        let fieldLabel = `${fieldLabelIndex} ${customFieldLabel}`;

        if (customPersonalizationLabel) {
          fieldLabel = customPersonalizationLabel;
        }

        const nameElHTML = this.querySelector(this.templates.name)
          .innerHTML.replaceAll("[[FieldLabel]]", fieldLabel)
          .replaceAll("fieldlabel", fieldLabel)
          .replaceAll("[[LineItemLabel]]", fieldLabel);

        const nameEl = new DOMParser().parseFromString(nameElHTML, "text/html");

        this.injectedFieldsPlaceholder.appendChild(nameEl.body.firstChild);
      }
    }

    multipleNameNoGemstone(itemsToDuplicate) {
      this.removeInjectedFields();
      for (let index = 1; index < itemsToDuplicate; index++) {
        const fieldLabelIndex = this.convertIntToStringCount(index + 1);

        const customFieldLabel = this.dataset.customFieldLabel || "Name";

        const customPersonalizationLabel =
          window.theme.personalizations.labels[index];

        let fieldLabel = `${fieldLabelIndex} ${customFieldLabel}`;

        if (customPersonalizationLabel) {
          fieldLabel = customPersonalizationLabel;
        }

        console.log(fieldLabel);

        const nameElHTML = this.querySelector(this.templates.name)
          .innerHTML.replaceAll("[[FieldLabel]]", fieldLabel)
          .replaceAll("fieldlabel", fieldLabel)
          .replaceAll("[[LineItemLabel]]", fieldLabel.replaceAll(":", ""));

        const nameEl = new DOMParser().parseFromString(nameElHTML, "text/html");

        this.injectedFieldsPlaceholder.appendChild(nameEl.body.firstChild);
      }
    }

    singleInitial(itemsToDuplicate) {
      // const initalsDropdown = document.querySelector(
      //   "[name='personalization[choose-your-initials]']"
      // );
      // initalsDropdown.addEventListener("change", (e) => {
      //   const selectedInitial = e.target.value;
      //   const lineItemName = e.target.closest("[data-line-item-name]").dataset
      //     .lineItemName;
      //   document.querySelector(
      //     `.buy-buttons__custom-line-items [name='properties[${lineItemName}]']`
      //   ).value = selectedInitial;
      // });
      // this.removeInjectedFields();
      // for (let index = 1; index < itemsToDuplicate; index++) {
      //   const fieldLabelIndex = this.convertIntToStringCount(index + 1);
      //   const customFieldLabel = this.dataset.customFieldLabel || "Name";
      //   const initialsElHTML = this.querySelector(this.templates.initials)
      //     .innerHTML.replaceAll(
      //       "[[FieldLabel]]",
      //       `${fieldLabelIndex} ${customFieldLabel}`
      //     )
      //     .replaceAll(
      //       "fieldlabel",
      //       `${fieldLabelIndex.toLowerCase()}-${customFieldLabel.toLowerCase()}`
      //     )
      //     .replaceAll(
      //       "[[LineItemLabel]]",
      //       `${fieldLabelIndex} ${customFieldLabel}`
      //     );
      //   const initialsEl = new DOMParser().parseFromString(
      //     initialsElHTML,
      //     "text/html"
      //   );
      //   this.injectedFieldsPlaceholder.appendChild(initialsEl.body.firstChild);
      // }
    }
  };

  window.customElements.define(
    "product-personalization",
    ProductPersonalization
  );
}
