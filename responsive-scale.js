(function (global) {
  const DEFAULTS = {
    designWidth: 1920,
    container: ".container",
    fixed: "[data-scale-fixed], .scale-fixed",
    minScale: 0,
    maxScale: 1,
    autoHeight: true,
    bodySetup: true,
    scaleVar: "--responsive-scale",
  };

  const scriptEl = document.currentScript;

  function toNumber(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function toBoolean(value, fallback) {
    if (value == null) return fallback;
    return value !== "false";
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function optionsFromScript() {
    if (!scriptEl) return {};

    return {
      designWidth: toNumber(scriptEl.dataset.designWidth, DEFAULTS.designWidth),
      container: scriptEl.dataset.container || DEFAULTS.container,
      fixed: scriptEl.dataset.fixed || DEFAULTS.fixed,
      minScale: toNumber(scriptEl.dataset.minScale, DEFAULTS.minScale),
      maxScale: toNumber(scriptEl.dataset.maxScale, DEFAULTS.maxScale),
      autoHeight: toBoolean(scriptEl.dataset.autoHeight, DEFAULTS.autoHeight),
      bodySetup: toBoolean(scriptEl.dataset.bodySetup, DEFAULTS.bodySetup),
    };
  }

  function setEarlyScale(options) {
    const scale = clamp(
      global.innerWidth / options.designWidth,
      options.minScale,
      options.maxScale
    );

    document.documentElement.style.setProperty(
      DEFAULTS.scaleVar,
      scale.toFixed(4)
    );
  }

  function init(userOptions) {
    const options = Object.assign({}, DEFAULTS, optionsFromScript(), userOptions);
    const root = document.documentElement;
    const body = document.body;
    const container =
      document.querySelector("[data-scale-container]") ||
      document.querySelector(options.container);

    if (!root || !body || !container) return null;

    const fixedElements = Array.from(document.querySelectorAll(options.fixed));
    let resizeTimer = null;

    function getScale() {
      return clamp(
        global.innerWidth / options.designWidth,
        options.minScale,
        options.maxScale
      );
    }

    function applyBaseStyles() {
      if (options.bodySetup) {
        const bodyDisplay = getComputedStyle(body).display;

        if (bodyDisplay === "block") {
          body.style.display = "flex";
          body.style.flexDirection = "column";
        }

        body.style.overflowX = "hidden";
        body.style.minHeight = "100vh";

        if (bodyDisplay === "block" || bodyDisplay === "flex") {
          body.style.justifyContent = "flex-start";
          body.style.alignItems = "center";
        }
      }

      if (!container.style.width) {
        container.style.width = options.designWidth + "px";
      }

      container.style.transformOrigin = "top center";
      container.style.transform = "scale(var(" + options.scaleVar + ", 1))";

      fixedElements.forEach(function (element) {
        element.style.transformOrigin = "top center";
        element.style.transform = "scale(var(" + options.scaleVar + ", 1))";
      });
    }

    function applyScale() {
      root.style.setProperty(options.scaleVar, getScale().toFixed(4));
    }

    function applyHeight() {
      applyScale();

      if (!options.autoHeight) return;

      const rect = container.getBoundingClientRect();
      const documentBottom = Math.ceil(rect.bottom + global.scrollY);
      const newHeight = documentBottom + "px";

      if (body.style.height !== newHeight) {
        body.style.height = newHeight;
      }

      body.style.marginBottom = "0";
    }

    function scheduleApply() {
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(applyHeight, 60);
    }

    applyBaseStyles();
    applyScale();
    requestAnimationFrame(applyHeight);

    global.addEventListener("load", function () {
      applyHeight();
      setTimeout(applyHeight, 500);
    });

    global.addEventListener("resize", scheduleApply);
    global.addEventListener("orientationchange", scheduleApply);

    const mutationObserver = new MutationObserver(function () {
      requestAnimationFrame(applyHeight);
    });

    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
      characterData: true,
    });

    return {
      refresh: applyHeight,
      destroy: function () {
        mutationObserver.disconnect();
        global.removeEventListener("resize", scheduleApply);
        global.removeEventListener("orientationchange", scheduleApply);
      },
    };
  }

  const scriptOptions = Object.assign({}, DEFAULTS, optionsFromScript());
  setEarlyScale(scriptOptions);

  global.ResponsiveScaleLayout = {
    init: init,
  };

  if (!scriptEl || scriptEl.dataset.auto !== "false") {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        global.ResponsiveScaleLayout.instance = init();
      });
    } else {
      global.ResponsiveScaleLayout.instance = init();
    }
  }
})(window);
