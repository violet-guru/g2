// https://stackoverflow.com/a/14570614/6227407
var observeDOM = (function () {
  var MutationObserver =
    window.MutationObserver || window.WebKitMutationObserver;

  return function (obj, callback) {
    if (!obj || obj.nodeType !== 1) return;

    if (MutationObserver) {
      // define a new observer
      var mutationObserver = new MutationObserver(callback);

      // have the observer observe for changes in children
      mutationObserver.observe(obj, { childList: true, subtree: true });
      return mutationObserver;
    }

    // browser support fallback
    else if (window.addEventListener) {
      obj.addEventListener("DOMNodeInserted", callback, false);
      obj.addEventListener("DOMNodeRemoved", callback, false);
    }
  };
})();

const listElm = document.querySelector("body");
observeDOM(listElm, function (m) {
  //console.log("Element body changed");

  // When body changes, add current queryStrings to the anchor links, except for some links in the header
  document
    .querySelectorAll("a:not(.stringQuery):not([lang])")
    .forEach((tag) => {
      tag.addEventListener("click", (e) => {
        e.preventDefault();
        let urlPath = tag.href;
        let urlQuery = "";
        if (tag.href.indexOf("?") >= 0) {
          urlPath = tag.href.slice(0, tag.href.indexOf("?"));
          urlQuery = tag.href.slice(tag.href.indexOf("?") + 1);
        }

        const myClasses = [
          "nav-logo-wrap",
          "nav-drop-down-wrap",
          "nav-link-text",
          "post-item-image-wrap",
        ];
        const isSamePage = [...tag.classList].some((x) =>
          myClasses.includes(x)
        );

        const mySearch = window.location.search;
        const mySeparator = mySearch.length > 0 ? "&" : "?";
        const myPath =
          urlPath + mySearch + (urlQuery.length > 0 ? mySeparator : "") + urlQuery;
        if (isSamePage) {
          window.location.href = myPath;
        } else {
          window.open(myPath, "_blank");
        }
      });
      tag.classList.add("stringQuery");
    });
});
