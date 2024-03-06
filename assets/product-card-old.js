(function () {

  const initProductGridMaterialSwatches = () => {
    const selectors = {
      productBlock: "product-block",
    };

    const productBlocks = document.querySelectorAll(
      `.${selectors.productBlock}`
    );

    if (productBlocks.length == 0) return;

    for (const productBlock of productBlocks) {
      if (!productBlock.querySelector(".product-card__materials-list"))
        continue;

      const ProductMetaObjects = JSON.parse(
        productBlock.querySelector("[id^='ProductMetaObjects']").innerHTML
      );

      const productHandle = productBlock.dataset.productHandle;

      if (Object.entries(ProductMetaObjects).length === 0) continue;

      const activeMaterial = ProductMetaObjects[productHandle].materials.active;
      const activeStoneType =
        ProductMetaObjects[productHandle].stone_type.active;
      const activeGemstoneType =
        ProductMetaObjects[productHandle].gemstone_types.active;
      const activeDiamondSize =
        ProductMetaObjects[productHandle].diamond_sizes.active;

      const inactiveMaterials = ProductMetaObjects[
        productHandle
      ].materials.all.replace(
        ProductMetaObjects[productHandle].materials.active,
        ""
      );
      const inactiveStoneTypes = ProductMetaObjects[
        productHandle
      ].stone_type.all.replace(
        ProductMetaObjects[productHandle].stone_type.active,
        ""
      );
      const inactiveGemstoneTypes = ProductMetaObjects[
        productHandle
      ].gemstone_types.all.replace(
        ProductMetaObjects[productHandle].gemstone_types.active,
        ""
      );
      const inactiveDiamondSizes = ProductMetaObjects[
        productHandle
      ].diamond_sizes.all.replace(
        ProductMetaObjects[productHandle].diamond_sizes.active,
        ""
      );

      const finalLinks = {
        material: {},
        stone_type: {},
        gemstone_type: {},
        diamond_size: {},
      };

      for (const inactiveMaterial of inactiveMaterials.split(", ")) {
        if (inactiveMaterial != "") finalLinks.material[inactiveMaterial] = "";
      }

      for (const inactiveStoneType of inactiveStoneTypes.split(", ")) {
        if (inactiveStoneType != "")
          finalLinks.stone_type[inactiveStoneType] = "";
      }

      for (const inactiveGemstoneType of inactiveGemstoneTypes.split(", ")) {
        if (inactiveGemstoneType != "")
          finalLinks.gemstone_type[inactiveGemstoneType] = "";
      }

      for (const inactiveDiamondSize of inactiveDiamondSizes.split(", ")) {
        if (inactiveDiamondSize != "")
          finalLinks.diamond_size[inactiveDiamondSize] = "";
      }

      for (const productHandle of Object.keys(ProductMetaObjects)) {
        if (productHandle != productBlock.dataset.productHandle) {
          const productMaterials = ProductMetaObjects[productHandle].materials;
          const productStoneTypes =
            ProductMetaObjects[productHandle].stone_type;
          const productGemstoneTypes =
            ProductMetaObjects[productHandle].gemstone_types;
          const productDiamondSizes =
            ProductMetaObjects[productHandle].diamond_sizes;

          // Finding Inactive Material Links
          for (const inactiveMaterial of Object.keys(finalLinks.material)) {
            if (
              productMaterials.active.includes(inactiveMaterial) &&
              productStoneTypes.active.includes(activeStoneType) &&
              productGemstoneTypes.active.includes(activeGemstoneType) &&
              productDiamondSizes.active.includes(activeDiamondSize)
            ) {
              finalLinks.material[inactiveMaterial] = productHandle;
            }
          }

          // Finding Inactive Stone Type Links
          for (const inactiveStoneType of Object.keys(finalLinks.stone_type)) {
            if (
              productMaterials.active.includes(activeMaterial) &&
              productStoneTypes.active.includes(inactiveStoneType) &&
              productGemstoneTypes.active.includes(activeGemstoneType) &&
              productDiamondSizes.active.includes(activeDiamondSize)
            ) {
              finalLinks.stone_type[inactiveStoneType] = productHandle;
            }
          }
        }
      }

      console.log(finalLinks);

      // adding material links
      for (const mat of Object.keys(finalLinks.material)) {
        try {
          console.log(
            productBlock.querySelector(
              `.product-card__materials-list-image[data-product-id='${productBlock.dataset.productId}'][data-title='${mat}']`
            )
          );
          productBlock
            .querySelector(
              `.product-card__materials-list-image[data-product-id='${productBlock.dataset.productId}'][data-title='${mat}']`
            )
            .addEventListener("click", () => {
              if (finalLinks.material[mat] != "")
                fetch(
                  `/products/${finalLinks.material[mat]}?view=card&section_id=product-block`
                )
                  .then((res) => res.text())
                  .then((data) => {
                    console.log(data);
                    const newProductBlock = new DOMParser().parseFromString(
                      data,
                      "text/html"
                    );

                    productBlock.innerHTML = newProductBlock.querySelector(
                      "#shopify-section-product-block"
                    ).innerHTML;

                    setTimeout(() => {
                      initProductGridMaterialSwatches();
                    }, 500);
                  });
              // window.location.href = `/products/${finalLinks.material[mat]}`;
            });
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  document.addEventListener("on:filter:after-ajax-load", () => {
    initProductGridMaterialSwatches();
  });
  initProductGridMaterialSwatches();
})();
