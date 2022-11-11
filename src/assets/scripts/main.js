((document) => {
  const dataServices = ({ toppingsUrl, sizesUrl }) => {
    let toppings = null;
    let sizes = null;

    const getToppings = () => {
      return new Promise((resolve, reject) => {
        if (toppings === null) {
          toppings = [
            {
              code: "T01",
              name: "Bacon",
              price: 5,
            },
            {
              code: "T02",
              name: "Champiñones",
              price: 3,
            },
            {
              code: "T03",
              name: "Extra de queso",
              price: 3,
            },
            {
              code: "T04",
              name: "Rodajas de tomate",
              price: 3,
            },
            {
              code: "T05",
              name: "Rodajas de tomate",
              price: 3,
            },
            {
              code: "T06",
              name: "Salsa barbacoa",
              price: 3,
            },
          ];
        }
        setTimeout(() => resolve(toppings), 1000);
      });
    };

    const getSizes = () => {
      return new Promise((resolve, reject) => {
        if (sizes === null) {
          sizes = [
            {
              code: "S01",
              name: "Individual",
              price: 5,
            },
            {
              code: "S02",
              name: "Mediana",
              price: 10,
            },
            {
              code: "S03",
              name: "Familiar",
              price: 15,
            },
          ];
        }
        setTimeout(() => resolve(sizes), 3000);
      });
    };

    const getAllData = () => {
      return new Promise((resolve, reject) => {
        Promise.all([getToppings(), getSizes()])
          .then((responses) => {
            resolve({
              toppings: responses[0],
              sizes: responses[1],
            });
          })
          .then((reason) => reject(reason));
      });
    };

    const getPrice = (size, selectedToppings) => {
      const shouldBeAdded = (topping, selected) =>
        selected.filter((x) => x === topping.code).length === 1;

      return new Promise((resolve, reject) => {
        let price = 0;
        getAllData()
          .then(({ toppings, sizes }) => {
            const filteredSizes = sizes.filter((x) => x.code === size);
            if (filteredSizes.length === 1) {
              price += filteredSizes[0].price;
            }
            toppings.forEach((topping) => {
              if (shouldBeAdded(topping, selectedToppings)) {
                price += topping.price;
              }
            });
            resolve(price);
          })
          .catch(reject);
      });
    };

    return {
      data: getAllData,
      price: getPrice,
    };
  };

  const renderServices = () => {
    const errorMessage = (message) => {
      const container = document.createElement("p");
      container.append(message);
      container.classList.add("error-message");
      return container;
    };

    const errorContainer = (name, message) => {
      const parent = document.getElementById(name).parentNode;
      parent.classList.add("has-error");
      parent.appendChild(errorMessage(message));
    };

    const drawPrice = (price) =>
      (document.getElementById("total").innerText = price);

    const drawSize = (size) => {
      const container = document.createElement("div");
      container.classList.add("radio-group-item");
      document.getElementById("size").appendChild(container);

      const input = document.createElement("input");
      input.type = "radio";
      input.classList.add("size");
      input.name = "size";
      input.id = `size_${size.code}`;
      input.value = size.code;
      container.appendChild(input);
      input.addEventListener("change", () =>
        document.dispatchEvent(new Event("UpdateAmount"))
      );

      const label = document.createElement("label");
      label.htmlFor = `size_${size.code}`;
      label.append(size.name);
      container.appendChild(label);

      const price = document.createElement("small");
      price.append(`(+${size.price}€)`);
      label.appendChild(price);
    };

    const drawTopping = (topping) => {
      const container = document.createElement("div");
      container.classList.add("checkbox-group-item");
      document.getElementById("toppings").appendChild(container);

      const input = document.createElement("input");
      input.type = "checkbox";
      input.classList.add("toppings");
      input.name = topping.code;
      input.id = topping.code;
      input.addEventListener("change", () =>
        document.dispatchEvent(new Event("UpdateAmount"))
      );
      container.appendChild(input);

      const label = document.createElement("label");
      label.htmlFor = topping.code;
      label.append(topping.name);
      container.appendChild(label);

      const price = document.createElement("small");
      price.append(`(+${topping.price}€)`);
      label.appendChild(price);
    };

    const setSizes = (data) => {
      const { sizes } = data;

      Array.from(document.getElementsByClassName("size")).forEach((x) =>
        x.remove()
      );

      sizes.forEach(drawSize);

      return data;
    };

    const setToppings = (data) => {
      const { toppings } = data;

      Array.from(document.getElementsByClassName("toppings")).forEach((x) =>
        x.remove()
      );

      toppings.forEach(drawTopping);

      return data;
    };

    const cleanErrors = () => {
      Array.from(document.getElementsByClassName("has-error")).forEach((x) =>
        x.classList.remove("has-error")
      );
      Array.from(document.getElementsByClassName("error-message")).forEach(
        (x) => x.remove()
      );
    };

    const handlerError = (err) => console.log(err);

    return {
      sizes: setSizes,
      toppings: setToppings,
      error: errorContainer,
      clean: cleanErrors,
      price: drawPrice,
      handlerError: handlerError,
    };
  };

  const businessRules = (fields, render) => {
    let pipelineInstance = null;

    const steps = [
      () => atLeastOneSelectedItemValidator(fields.toppings, render),
      () => atLeastOneSelectedItemValidator(fields.size, render),
      () => notEmptyStringValidator(fields.address, render),
      () => notEmptyStringValidator(fields.email, render),
      () => notEmptyStringValidator(fields.phone, render),
      () => notEmptyStringValidator(fields.name, render),
      () => cleanValidations(render),
    ];

    const validationStep = (current, nextStep) => {
      const isFunction = (candidate) => typeof candidate === "function";
      const isStep = (candidate) => typeof candidate === "object";
      const validate = () => {
        const current = validator();

        if (next !== null) {
          return next.validate() && current;
        }

        return current;
      };

      if (!isFunction(current)) {
        throw new Error("invalid current validator");
      }

      const validator = current;
      const next = isStep(nextStep) ? nextStep : null;

      return {
        validate: validate,
      };
    };

    const cleanValidations = ({ clean }) => {
      clean();

      return true;
    };

    const notEmptyStringValidator = ({ name, message }, { error }) => {
      const value = document.getElementById(name).value;
      if (value === "" || value === undefined) {
        error(name, message);
        return false;
      }
      return true;
    };

    const atLeastOneSelectedItemValidator = ({ name, message }, { error }) => {
      const checkedRadios = Array.from(
        document.getElementsByClassName(name)
      ).filter((x) => x.checked);

      if (checkedRadios.length === 0) {
        error(name, message);
        return false;
      }
      return true;
    };

    const pipeline = () => {
      if (pipelineInstance === null) {
        steps.forEach(
          (step) => (pipelineInstance = validationStep(step, pipelineInstance))
        );
      }
      return pipelineInstance;
    };

    return {
      pipeline: pipeline,
    };
  };

  const eventsManager = (render, services, rules) => {
    const onSubmit = (ev) => {
      const isValid = rules.pipeline().validate();
      if (!isValid) {
        ev.preventDefault();
      }

      document.dispatchEvent(new Event("UpdateAmount"));
    };

    const updateAmount = () => {
      render.price("-");
      const sizes = Array.from(document.getElementsByName("size"))
        .filter((x) => x.checked)
        .map((x) => x.value);

      const toppings = Array.from(document.getElementsByClassName("toppings"))
        .filter((x) => x.checked)
        .map((x) => x.name);

      const size = sizes.length === 1 ? sizes[0] : "";

      services.price(size, toppings).then(render.price);
    };

    const onLoad = () => {
      document.addEventListener("UpdateAmount", updateAmount);
      document.getElementById("form").addEventListener("submit", onSubmit);
      document.getElementById("reset-btn").addEventListener("click", onReset);
      services
        .data()
        .then(render.sizes)
        .then(render.toppings)
        .catch(render.handlerError);
    };

    const onReset = () => {
      render.clean();
      render.price("-");
    };

    const initialize = () =>
      document.addEventListener("DOMContentLoaded", onLoad);

    return {
      initialize: initialize,
    };
  };

  const options = {
    toppingsUrl: "/assets/data/toppings.json",
    sizesUrl: "/assets/data/sizes.json",
  };

  const fields = {
    name: {
      name: "name",
      message: "El campo es obligatorio.",
    },
    phone: {
      name: "phone",
      message: "El campo es obligatorio.",
    },
    email: {
      name: "email",
      message: "El campo es obligatorio.",
    },
    address: {
      name: "address",
      message: "El campo es obligatorio.",
    },
    size: {
      name: "size",
      message: "Debe seleccionar un tamaño de pizza.",
    },
    toppings: {
      name: "toppings",
      message: "Debe seleccionar al menos un ingrediente.",
    },
  };

  const render = renderServices();
  const services = dataServices(options);
  const rules = businessRules(fields, render);
  const events = eventsManager(render, services, rules);
  events.initialize();
})(document);
