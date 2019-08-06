(function () {
  'use strict';

  /* Riot v4.3.7, @license MIT */
  const COMPONENTS_IMPLEMENTATION_MAP = new Map(),
        DOM_COMPONENT_INSTANCE_PROPERTY = Symbol('riot-component'),
        PLUGINS_SET = new Set(),
        IS_DIRECTIVE = 'is',
        VALUE_ATTRIBUTE = 'value',
        ATTRIBUTES_KEY_SYMBOL = Symbol('attributes'),
        TEMPLATE_KEY_SYMBOL = Symbol('template');

  var globals = /*#__PURE__*/Object.freeze({
    COMPONENTS_IMPLEMENTATION_MAP: COMPONENTS_IMPLEMENTATION_MAP,
    DOM_COMPONENT_INSTANCE_PROPERTY: DOM_COMPONENT_INSTANCE_PROPERTY,
    PLUGINS_SET: PLUGINS_SET,
    IS_DIRECTIVE: IS_DIRECTIVE,
    VALUE_ATTRIBUTE: VALUE_ATTRIBUTE,
    ATTRIBUTES_KEY_SYMBOL: ATTRIBUTES_KEY_SYMBOL,
    TEMPLATE_KEY_SYMBOL: TEMPLATE_KEY_SYMBOL
  });

  /**
   * Remove the child nodes from any DOM node
   * @param   {HTMLElement} node - target node
   * @returns {undefined}
   */
  function cleanNode(node) {
    clearChildren(node, node.childNodes);
  }
  /**
   * Clear multiple children in a node
   * @param   {HTMLElement} parent - parent node where the children will be removed
   * @param   {HTMLElement[]} children - direct children nodes
   * @returns {undefined}
   */


  function clearChildren(parent, children) {
    Array.from(children).forEach(n => parent.removeChild(n));
  }

  const EACH = 0;
  const IF = 1;
  const SIMPLE = 2;
  const TAG = 3;
  const SLOT = 4;
  var bindingTypes = {
    EACH,
    IF,
    SIMPLE,
    TAG,
    SLOT
  };
  /**
   * Create the template meta object in case of <template> fragments
   * @param   {TemplateChunk} componentTemplate - template chunk object
   * @returns {Object} the meta property that will be passed to the mount function of the TemplateChunk
   */

  function createTemplateMeta(componentTemplate) {
    const fragment = componentTemplate.dom.cloneNode(true);
    return {
      avoidDOMInjection: true,
      fragment,
      children: Array.from(fragment.childNodes)
    };
  }
  /* get rid of the @ungap/essential-map polyfill */


  const append = (get, parent, children, start, end, before) => {
    const isSelect = 'selectedIndex' in parent;
    let selectedIndex = -1;

    while (start < end) {
      const child = get(children[start], 1);
      if (isSelect && selectedIndex < 0 && child.selected) selectedIndex = start;
      parent.insertBefore(child, before);
      start++;
    }

    if (isSelect && -1 < selectedIndex) parent.selectedIndex = selectedIndex;
  };

  const eqeq = (a, b) => a == b;

  const identity = O => O;

  const indexOf = (moreNodes, moreStart, moreEnd, lessNodes, lessStart, lessEnd, compare) => {
    const length = lessEnd - lessStart;
    /* istanbul ignore if */

    if (length < 1) return -1;

    while (moreEnd - moreStart >= length) {
      let m = moreStart;
      let l = lessStart;

      while (m < moreEnd && l < lessEnd && compare(moreNodes[m], lessNodes[l])) {
        m++;
        l++;
      }

      if (l === lessEnd) return moreStart;
      moreStart = m + 1;
    }

    return -1;
  };

  const isReversed = (futureNodes, futureEnd, currentNodes, currentStart, currentEnd, compare) => {
    while (currentStart < currentEnd && compare(currentNodes[currentStart], futureNodes[futureEnd - 1])) {
      currentStart++;
      futureEnd--;
    }

    return futureEnd === 0;
  };

  const next = (get, list, i, length, before) => i < length ? get(list[i], 0) : 0 < i ? get(list[i - 1], -0).nextSibling : before;

  const remove = (get, parent, children, start, end) => {
    if (end - start < 2) parent.removeChild(get(children[start], -1));else {
      const range = parent.ownerDocument.createRange();
      range.setStartBefore(get(children[start], -1));
      range.setEndAfter(get(children[end - 1], -1));
      range.deleteContents();
    }
  }; // - - - - - - - - - - - - - - - - - - -
  // diff related constants and utilities
  // - - - - - - - - - - - - - - - - - - -


  const DELETION = -1;
  const INSERTION = 1;
  const SKIP = 0;
  const SKIP_OND = 50;

  const HS = (futureNodes, futureStart, futureEnd, futureChanges, currentNodes, currentStart, currentEnd, currentChanges) => {
    let k = 0;
    /* istanbul ignore next */

    let minLen = futureChanges < currentChanges ? futureChanges : currentChanges;
    const link = Array(minLen++);
    const tresh = Array(minLen);
    tresh[0] = -1;

    for (let i = 1; i < minLen; i++) tresh[i] = currentEnd;

    const keymap = new Map();

    for (let i = currentStart; i < currentEnd; i++) keymap.set(currentNodes[i], i);

    for (let i = futureStart; i < futureEnd; i++) {
      const idxInOld = keymap.get(futureNodes[i]);

      if (idxInOld != null) {
        k = findK(tresh, minLen, idxInOld);
        /* istanbul ignore else */

        if (-1 < k) {
          tresh[k] = idxInOld;
          link[k] = {
            newi: i,
            oldi: idxInOld,
            prev: link[k - 1]
          };
        }
      }
    }

    k = --minLen;
    --currentEnd;

    while (tresh[k] > currentEnd) --k;

    minLen = currentChanges + futureChanges - k;
    const diff = Array(minLen);
    let ptr = link[k];
    --futureEnd;

    while (ptr) {
      const {
        newi,
        oldi
      } = ptr;

      while (futureEnd > newi) {
        diff[--minLen] = INSERTION;
        --futureEnd;
      }

      while (currentEnd > oldi) {
        diff[--minLen] = DELETION;
        --currentEnd;
      }

      diff[--minLen] = SKIP;
      --futureEnd;
      --currentEnd;
      ptr = ptr.prev;
    }

    while (futureEnd >= futureStart) {
      diff[--minLen] = INSERTION;
      --futureEnd;
    }

    while (currentEnd >= currentStart) {
      diff[--minLen] = DELETION;
      --currentEnd;
    }

    return diff;
  }; // this is pretty much the same petit-dom code without the delete map part
  // https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L556-L561


  const OND = (futureNodes, futureStart, rows, currentNodes, currentStart, cols, compare) => {
    const length = rows + cols;
    const v = [];
    let d, k, r, c, pv, cv, pd;

    outer: for (d = 0; d <= length; d++) {
      /* istanbul ignore if */
      if (d > SKIP_OND) return null;
      pd = d - 1;
      /* istanbul ignore next */

      pv = d ? v[d - 1] : [0, 0];
      cv = v[d] = [];

      for (k = -d; k <= d; k += 2) {
        if (k === -d || k !== d && pv[pd + k - 1] < pv[pd + k + 1]) {
          c = pv[pd + k + 1];
        } else {
          c = pv[pd + k - 1] + 1;
        }

        r = c - k;

        while (c < cols && r < rows && compare(currentNodes[currentStart + c], futureNodes[futureStart + r])) {
          c++;
          r++;
        }

        if (c === cols && r === rows) {
          break outer;
        }

        cv[d + k] = c;
      }
    }

    const diff = Array(d / 2 + length / 2);
    let diffIdx = diff.length - 1;

    for (d = v.length - 1; d >= 0; d--) {
      while (c > 0 && r > 0 && compare(currentNodes[currentStart + c - 1], futureNodes[futureStart + r - 1])) {
        // diagonal edge = equality
        diff[diffIdx--] = SKIP;
        c--;
        r--;
      }

      if (!d) break;
      pd = d - 1;
      /* istanbul ignore next */

      pv = d ? v[d - 1] : [0, 0];
      k = c - r;

      if (k === -d || k !== d && pv[pd + k - 1] < pv[pd + k + 1]) {
        // vertical edge = insertion
        r--;
        diff[diffIdx--] = INSERTION;
      } else {
        // horizontal edge = deletion
        c--;
        diff[diffIdx--] = DELETION;
      }
    }

    return diff;
  };

  const applyDiff = (diff, get, parentNode, futureNodes, futureStart, currentNodes, currentStart, currentLength, before) => {
    const live = new Map();
    const length = diff.length;
    let currentIndex = currentStart;
    let i = 0;

    while (i < length) {
      switch (diff[i++]) {
        case SKIP:
          futureStart++;
          currentIndex++;
          break;

        case INSERTION:
          // TODO: bulk appends for sequential nodes
          live.set(futureNodes[futureStart], 1);
          append(get, parentNode, futureNodes, futureStart++, futureStart, currentIndex < currentLength ? get(currentNodes[currentIndex], 0) : before);
          break;

        case DELETION:
          currentIndex++;
          break;
      }
    }

    i = 0;

    while (i < length) {
      switch (diff[i++]) {
        case SKIP:
          currentStart++;
          break;

        case DELETION:
          // TODO: bulk removes for sequential nodes
          if (live.has(currentNodes[currentStart])) currentStart++;else remove(get, parentNode, currentNodes, currentStart++, currentStart);
          break;
      }
    }
  };

  const findK = (ktr, length, j) => {
    let lo = 1;
    let hi = length;

    while (lo < hi) {
      const mid = (lo + hi) / 2 >>> 0;
      if (j < ktr[mid]) hi = mid;else lo = mid + 1;
    }

    return lo;
  };

  const smartDiff = (get, parentNode, futureNodes, futureStart, futureEnd, futureChanges, currentNodes, currentStart, currentEnd, currentChanges, currentLength, compare, before) => {
    applyDiff(OND(futureNodes, futureStart, futureChanges, currentNodes, currentStart, currentChanges, compare) || HS(futureNodes, futureStart, futureEnd, futureChanges, currentNodes, currentStart, currentEnd, currentChanges), get, parentNode, futureNodes, futureStart, currentNodes, currentStart, currentLength, before);
  };
  /*! (c) 2018 Andrea Giammarchi (ISC) */


  const domdiff = (parentNode, // where changes happen
  currentNodes, // Array of current items/nodes
  futureNodes, // Array of future items/nodes
  options // optional object with one of the following properties
  //  before: domNode
  //  compare(generic, generic) => true if same generic
  //  node(generic) => Node
  ) => {
    if (!options) options = {};
    const compare = options.compare || eqeq;
    const get = options.node || identity;
    const before = options.before == null ? null : get(options.before, 0);
    const currentLength = currentNodes.length;
    let currentEnd = currentLength;
    let currentStart = 0;
    let futureEnd = futureNodes.length;
    let futureStart = 0; // common prefix

    while (currentStart < currentEnd && futureStart < futureEnd && compare(currentNodes[currentStart], futureNodes[futureStart])) {
      currentStart++;
      futureStart++;
    } // common suffix


    while (currentStart < currentEnd && futureStart < futureEnd && compare(currentNodes[currentEnd - 1], futureNodes[futureEnd - 1])) {
      currentEnd--;
      futureEnd--;
    }

    const currentSame = currentStart === currentEnd;
    const futureSame = futureStart === futureEnd; // same list

    if (currentSame && futureSame) return futureNodes; // only stuff to add

    if (currentSame && futureStart < futureEnd) {
      append(get, parentNode, futureNodes, futureStart, futureEnd, next(get, currentNodes, currentStart, currentLength, before));
      return futureNodes;
    } // only stuff to remove


    if (futureSame && currentStart < currentEnd) {
      remove(get, parentNode, currentNodes, currentStart, currentEnd);
      return futureNodes;
    }

    const currentChanges = currentEnd - currentStart;
    const futureChanges = futureEnd - futureStart;
    let i = -1; // 2 simple indels: the shortest sequence is a subsequence of the longest

    if (currentChanges < futureChanges) {
      i = indexOf(futureNodes, futureStart, futureEnd, currentNodes, currentStart, currentEnd, compare); // inner diff

      if (-1 < i) {
        append(get, parentNode, futureNodes, futureStart, i, get(currentNodes[currentStart], 0));
        append(get, parentNode, futureNodes, i + currentChanges, futureEnd, next(get, currentNodes, currentEnd, currentLength, before));
        return futureNodes;
      }
    }
    /* istanbul ignore else */
    else if (futureChanges < currentChanges) {
        i = indexOf(currentNodes, currentStart, currentEnd, futureNodes, futureStart, futureEnd, compare); // outer diff

        if (-1 < i) {
          remove(get, parentNode, currentNodes, currentStart, i);
          remove(get, parentNode, currentNodes, i + futureChanges, currentEnd);
          return futureNodes;
        }
      } // common case with one replacement for many nodes
    // or many nodes replaced for a single one

    /* istanbul ignore else */


    if (currentChanges < 2 || futureChanges < 2) {
      append(get, parentNode, futureNodes, futureStart, futureEnd, get(currentNodes[currentStart], 0));
      remove(get, parentNode, currentNodes, currentStart, currentEnd);
      return futureNodes;
    } // the half match diff part has been skipped in petit-dom
    // https://github.com/yelouafi/petit-dom/blob/bd6f5c919b5ae5297be01612c524c40be45f14a7/src/vdom.js#L391-L397
    // accordingly, I think it's safe to skip in here too
    // if one day it'll come out like the speediest thing ever to do
    // then I might add it in here too
    // Extra: before going too fancy, what about reversed lists ?
    //        This should bail out pretty quickly if that's not the case.


    if (currentChanges === futureChanges && isReversed(futureNodes, futureEnd, currentNodes, currentStart, currentEnd, compare)) {
      append(get, parentNode, futureNodes, futureStart, futureEnd, next(get, currentNodes, currentEnd, currentLength, before));
      return futureNodes;
    } // last resort through a smart diff


    smartDiff(get, parentNode, futureNodes, futureStart, futureEnd, futureChanges, currentNodes, currentStart, currentEnd, currentChanges, currentLength, compare, before);
    return futureNodes;
  };
  /**
   * Check if a value is null or undefined
   * @param   {*}  value - anything
   * @returns {boolean} true only for the 'undefined' and 'null' types
   */


  function isNil(value) {
    return value == null;
  }
  /**
   * Check if an element is a template tag
   * @param   {HTMLElement}  el - element to check
   * @returns {boolean} true if it's a <template>
   */


  function isTemplate(el) {
    return !isNil(el.content);
  }

  const EachBinding = Object.seal({
    // dynamic binding properties
    childrenMap: null,
    node: null,
    root: null,
    condition: null,
    evaluate: null,
    template: null,
    isTemplateTag: false,
    nodes: [],
    getKey: null,
    indexName: null,
    itemName: null,
    afterPlaceholder: null,
    placeholder: null,

    // API methods
    mount(scope, parentScope) {
      return this.update(scope, parentScope);
    },

    update(scope, parentScope) {
      const {
        placeholder
      } = this;
      const collection = this.evaluate(scope);
      const items = collection ? Array.from(collection) : [];
      const parent = placeholder.parentNode; // prepare the diffing

      const {
        newChildrenMap,
        batches,
        futureNodes
      } = createPatch(items, scope, parentScope, this); // patch the DOM only if there are new nodes

      if (futureNodes.length) {
        domdiff(parent, this.nodes, futureNodes, {
          before: placeholder,
          node: patch(Array.from(this.childrenMap.values()), parentScope)
        });
      } else {
        // remove all redundant templates
        unmountRedundant(this.childrenMap);
      } // trigger the mounts and the updates


      batches.forEach(fn => fn()); // update the children map

      this.childrenMap = newChildrenMap;
      this.nodes = futureNodes;
      return this;
    },

    unmount(scope, parentScope) {
      unmountRedundant(this.childrenMap, parentScope);
      this.childrenMap = new Map();
      this.nodes = [];
      return this;
    }

  });
  /**
   * Patch the DOM while diffing
   * @param   {TemplateChunk[]} redundant - redundant tepmplate chunks
   * @param   {*} parentScope - scope of the parent template
   * @returns {Function} patch function used by domdiff
   */

  function patch(redundant, parentScope) {
    return (item, info) => {
      if (info < 0) {
        const {
          template,
          context
        } = redundant.pop(); // notice that we pass null as last argument because
        // the root node and its children will be removed by domdiff

        template.unmount(context, parentScope, null);
      }

      return item;
    };
  }
  /**
   * Unmount the remaining template instances
   * @param   {Map} childrenMap - map containing the children template to unmount
   * @param   {*} parentScope - scope of the parent template
   * @returns {TemplateChunk[]} collection containing the template chunks unmounted
   */


  function unmountRedundant(childrenMap, parentScope) {
    return Array.from(childrenMap.values()).map((_ref) => {
      let {
        template,
        context
      } = _ref;
      return template.unmount(context, parentScope, true);
    });
  }
  /**
   * Check whether a template must be filtered from a loop
   * @param   {Function} condition - filter function
   * @param   {Object} context - argument passed to the filter function
   * @returns {boolean} true if this item should be skipped
   */


  function mustFilterItem(condition, context) {
    return condition ? Boolean(condition(context)) === false : false;
  }
  /**
   * Extend the scope of the looped template
   * @param   {Object} scope - current template scope
   * @param   {string} options.itemName - key to identify the looped item in the new context
   * @param   {string} options.indexName - key to identify the index of the looped item
   * @param   {number} options.index - current index
   * @param   {*} options.item - collection item looped
   * @returns {Object} enhanced scope object
   */


  function extendScope(scope, _ref2) {
    let {
      itemName,
      indexName,
      index,
      item
    } = _ref2;
    scope[itemName] = item;
    if (indexName) scope[indexName] = index;
    return scope;
  }
  /**
   * Loop the current template items
   * @param   {Array} items - expression collection value
   * @param   {*} scope - template scope
   * @param   {*} parentScope - scope of the parent template
   * @param   {EeachBinding} binding - each binding object instance
   * @returns {Object} data
   * @returns {Map} data.newChildrenMap - a Map containing the new children template structure
   * @returns {Array} data.batches - array containing the template lifecycle functions to trigger
   * @returns {Array} data.futureNodes - array containing the nodes we need to diff
   */


  function createPatch(items, scope, parentScope, binding) {
    const {
      condition,
      template,
      childrenMap,
      itemName,
      getKey,
      indexName,
      root,
      isTemplateTag
    } = binding;
    const newChildrenMap = new Map();
    const batches = [];
    const futureNodes = [];
    items.forEach((item, index) => {
      const context = extendScope(Object.create(scope), {
        itemName,
        indexName,
        index,
        item
      });
      const key = getKey ? getKey(context) : index;
      const oldItem = childrenMap.get(key);

      if (mustFilterItem(condition, context)) {
        return;
      }

      const componentTemplate = oldItem ? oldItem.template : template.clone();
      const el = oldItem ? componentTemplate.el : root.cloneNode();
      const mustMount = !oldItem;
      const meta = isTemplateTag && mustMount ? createTemplateMeta(componentTemplate) : {};

      if (mustMount) {
        batches.push(() => componentTemplate.mount(el, context, parentScope, meta));
      } else {
        componentTemplate.update(context, parentScope);
      } // create the collection of nodes to update or to add
      // in case of template tags we need to add all its children nodes


      if (isTemplateTag) {
        futureNodes.push(...(meta.children || componentTemplate.children));
      } else {
        futureNodes.push(el);
      } // delete the old item from the children map


      childrenMap.delete(key); // update the children map

      newChildrenMap.set(key, {
        template: componentTemplate,
        context,
        index
      });
    });
    return {
      newChildrenMap,
      batches,
      futureNodes
    };
  }

  function create(node, _ref3) {
    let {
      evaluate,
      condition,
      itemName,
      indexName,
      getKey,
      template
    } = _ref3;
    const placeholder = document.createTextNode('');
    const parent = node.parentNode;
    const root = node.cloneNode();
    parent.insertBefore(placeholder, node);
    parent.removeChild(node);
    return Object.assign({}, EachBinding, {
      childrenMap: new Map(),
      node,
      root,
      condition,
      evaluate,
      isTemplateTag: isTemplate(root),
      template: template.createDOM(node),
      getKey,
      indexName,
      itemName,
      placeholder
    });
  }
  /**
   * Binding responsible for the `if` directive
   */


  const IfBinding = Object.seal({
    // dynamic binding properties
    node: null,
    evaluate: null,
    parent: null,
    isTemplateTag: false,
    placeholder: null,
    template: null,

    // API methods
    mount(scope, parentScope) {
      this.parent.insertBefore(this.placeholder, this.node);
      this.parent.removeChild(this.node);
      return this.update(scope, parentScope);
    },

    update(scope, parentScope) {
      const value = !!this.evaluate(scope);
      const mustMount = !this.value && value;
      const mustUnmount = this.value && !value;

      switch (true) {
        case mustMount:
          this.parent.insertBefore(this.node, this.placeholder);
          this.template = this.template.clone();
          this.template.mount(this.node, scope, parentScope);
          break;

        case mustUnmount:
          this.unmount(scope);
          break;

        default:
          if (value) this.template.update(scope, parentScope);
      }

      this.value = value;
      return this;
    },

    unmount(scope, parentScope) {
      this.template.unmount(scope, parentScope, true);
      return this;
    }

  });

  function create$1(node, _ref4) {
    let {
      evaluate,
      template
    } = _ref4;
    return Object.assign({}, IfBinding, {
      node,
      evaluate,
      parent: node.parentNode,
      placeholder: document.createTextNode(''),
      template: template.createDOM(node)
    });
  }

  const ATTRIBUTE = 0;
  const EVENT = 1;
  const TEXT = 2;
  const VALUE = 3;
  var expressionTypes = {
    ATTRIBUTE,
    EVENT,
    TEXT,
    VALUE
  };
  const REMOVE_ATTRIBUTE = 'removeAttribute';
  const SET_ATTIBUTE = 'setAttribute';
  /**
   * Add all the attributes provided
   * @param   {HTMLElement} node - target node
   * @param   {Object} attributes - object containing the attributes names and values
   * @returns {undefined} sorry it's a void function :(
   */

  function setAllAttributes(node, attributes) {
    Object.entries(attributes).forEach((_ref5) => {
      let [name, value] = _ref5;
      return attributeExpression(node, {
        name
      }, value);
    });
  }
  /**
   * Remove all the attributes provided
   * @param   {HTMLElement} node - target node
   * @param   {Object} attributes - object containing all the attribute names
   * @returns {undefined} sorry it's a void function :(
   */


  function removeAllAttributes(node, attributes) {
    Object.keys(attributes).forEach(attribute => node.removeAttribute(attribute));
  }
  /**
   * This methods handles the DOM attributes updates
   * @param   {HTMLElement} node - target node
   * @param   {Object} expression - expression object
   * @param   {string} expression.name - attribute name
   * @param   {*} value - new expression value
   * @param   {*} oldValue - the old expression cached value
   * @returns {undefined}
   */


  function attributeExpression(node, _ref6, value, oldValue) {
    let {
      name
    } = _ref6;

    // is it a spread operator? {...attributes}
    if (!name) {
      // is the value still truthy?
      if (value) {
        setAllAttributes(node, value);
      } else if (oldValue) {
        // otherwise remove all the old attributes
        removeAllAttributes(node, oldValue);
      }

      return;
    } // handle boolean attributes


    if (typeof value === 'boolean') {
      node[name] = value;
    }

    node[getMethod(value)](name, normalizeValue(name, value));
  }
  /**
   * Get the attribute modifier method
   * @param   {*} value - if truthy we return `setAttribute` othewise `removeAttribute`
   * @returns {string} the node attribute modifier method name
   */


  function getMethod(value) {
    return isNil(value) || value === false || value === '' || typeof value === 'object' ? REMOVE_ATTRIBUTE : SET_ATTIBUTE;
  }
  /**
   * Get the value as string
   * @param   {string} name - attribute name
   * @param   {*} value - user input value
   * @returns {string} input value as string
   */


  function normalizeValue(name, value) {
    // be sure that expressions like selected={ true } will be always rendered as selected='selected'
    if (value === true) return name;
    return value;
  }
  /**
   * Set a new event listener
   * @param   {HTMLElement} node - target node
   * @param   {Object} expression - expression object
   * @param   {string} expression.name - event name
   * @param   {*} value - new expression value
   * @returns {undefined}
   */


  function eventExpression(node, _ref7, value) {
    let {
      name
    } = _ref7;
    node[name] = value;
  }
  /**
   * This methods handles a simple text expression update
   * @param   {HTMLElement} node - target node
   * @param   {Object} expression - expression object
   * @param   {number} expression.childNodeIndex - index to find the text node to update
   * @param   {*} value - new expression value
   * @returns {undefined}
   */


  function textExpression(node, _ref8, value) {
    let {
      childNodeIndex
    } = _ref8;
    const target = node.childNodes[childNodeIndex];
    const val = normalizeValue$1(value); // replace the target if it's a placeholder comment

    if (target.nodeType === Node.COMMENT_NODE) {
      const textNode = document.createTextNode(val);
      node.replaceChild(textNode, target);
    } else {
      target.data = normalizeValue$1(val);
    }
  }
  /**
   * Normalize the user value in order to render a empty string in case of falsy values
   * @param   {*} value - user input value
   * @returns {string} hopefully a string
   */


  function normalizeValue$1(value) {
    return value != null ? value : '';
  }
  /**
   * This methods handles the input fileds value updates
   * @param   {HTMLElement} node - target node
   * @param   {Object} expression - expression object
   * @param   {*} value - new expression value
   * @returns {undefined}
   */


  function valueExpression(node, expression, value) {
    node.value = value;
  }

  var expressions = {
    [ATTRIBUTE]: attributeExpression,
    [EVENT]: eventExpression,
    [TEXT]: textExpression,
    [VALUE]: valueExpression
  };
  const Expression = Object.seal({
    // Static props
    node: null,
    value: null,

    // API methods

    /**
     * Mount the expression evaluating its initial value
     * @param   {*} scope - argument passed to the expression to evaluate its current values
     * @returns {Expression} self
     */
    mount(scope) {
      // hopefully a pure function
      this.value = this.evaluate(scope); // IO() DOM updates

      apply(this, this.value);
      return this;
    },

    /**
     * Update the expression if its value changed
     * @param   {*} scope - argument passed to the expression to evaluate its current values
     * @returns {Expression} self
     */
    update(scope) {
      // pure function
      const value = this.evaluate(scope);

      if (this.value !== value) {
        // IO() DOM updates
        apply(this, value);
        this.value = value;
      }

      return this;
    },

    /**
     * Expression teardown method
     * @returns {Expression} self
     */
    unmount() {
      return this;
    }

  });
  /**
   * IO() function to handle the DOM updates
   * @param {Expression} expression - expression object
   * @param {*} value - current expression value
   * @returns {undefined}
   */

  function apply(expression, value) {
    return expressions[expression.type](expression.node, expression, value, expression.value);
  }

  function create$2(node, data) {
    return Object.assign({}, Expression, {}, data, {
      node
    });
  }
  /**
   * Create a flat object having as keys a list of methods that if dispatched will propagate
   * on the whole collection
   * @param   {Array} collection - collection to iterate
   * @param   {Array<string>} methods - methods to execute on each item of the collection
   * @param   {*} context - context returned by the new methods created
   * @returns {Object} a new object to simplify the the nested methods dispatching
   */


  function flattenCollectionMethods(collection, methods, context) {
    return methods.reduce((acc, method) => {
      return Object.assign({}, acc, {
        [method]: scope => {
          return collection.map(item => item[method](scope)) && context;
        }
      });
    }, {});
  }

  function create$3(node, _ref9) {
    let {
      expressions
    } = _ref9;
    return Object.assign({}, flattenCollectionMethods(expressions.map(expression => create$2(node, expression)), ['mount', 'update', 'unmount']));
  }

  const SlotBinding = Object.seal({
    // dynamic binding properties
    node: null,
    name: null,
    template: null,

    // API methods
    mount(scope, parentScope) {
      const templateData = scope.slots ? scope.slots.find((_ref10) => {
        let {
          id
        } = _ref10;
        return id === this.name;
      }) : false;
      const {
        parentNode
      } = this.node;
      this.template = templateData && create$6(templateData.html, templateData.bindings).createDOM(parentNode);

      if (this.template) {
        this.template.mount(this.node, parentScope);
        moveSlotInnerContent(this.node);
      }

      parentNode.removeChild(this.node);
      return this;
    },

    update(scope, parentScope) {
      if (this.template && parentScope) {
        this.template.update(parentScope);
      }

      return this;
    },

    unmount(scope, parentScope, mustRemoveRoot) {
      if (this.template) {
        this.template.unmount(parentScope, null, mustRemoveRoot);
      }

      return this;
    }

  });
  /**
   * Move the inner content of the slots outside of them
   * @param   {HTMLNode} slot - slot node
   * @returns {undefined} it's a void function
   */

  function moveSlotInnerContent(slot) {
    if (slot.firstChild) {
      slot.parentNode.insertBefore(slot.firstChild, slot);
      moveSlotInnerContent(slot);
    }
  }
  /**
   * Create a single slot binding
   * @param   {HTMLElement} node - slot node
   * @param   {string} options.name - slot id
   * @returns {Object} Slot binding object
   */


  function createSlot(node, _ref11) {
    let {
      name
    } = _ref11;
    return Object.assign({}, SlotBinding, {
      node,
      name
    });
  }
  /**
   * Create a new tag object if it was registered before, otherwise fallback to the simple
   * template chunk
   * @param   {Function} component - component factory function
   * @param   {Array<Object>} slots - array containing the slots markup
   * @param   {Array} attributes - dynamic attributes that will be received by the tag element
   * @returns {TagImplementation|TemplateChunk} a tag implementation or a template chunk as fallback
   */


  function getTag(component, slots, attributes) {
    if (slots === void 0) {
      slots = [];
    }

    if (attributes === void 0) {
      attributes = [];
    }

    // if this tag was registered before we will return its implementation
    if (component) {
      return component({
        slots,
        attributes
      });
    } // otherwise we return a template chunk


    return create$6(slotsToMarkup(slots), [...slotBindings(slots), {
      // the attributes should be registered as binding
      // if we fallback to a normal template chunk
      expressions: attributes.map(attr => {
        return Object.assign({
          type: ATTRIBUTE
        }, attr);
      })
    }]);
  }
  /**
   * Merge all the slots bindings into a single array
   * @param   {Array<Object>} slots - slots collection
   * @returns {Array<Bindings>} flatten bindings array
   */


  function slotBindings(slots) {
    return slots.reduce((acc, _ref12) => {
      let {
        bindings
      } = _ref12;
      return acc.concat(bindings);
    }, []);
  }
  /**
   * Merge all the slots together in a single markup string
   * @param   {Array<Object>} slots - slots collection
   * @returns {string} markup of all the slots in a single string
   */


  function slotsToMarkup(slots) {
    return slots.reduce((acc, slot) => {
      return acc + slot.html;
    }, '');
  }

  const TagBinding = Object.seal({
    // dynamic binding properties
    node: null,
    evaluate: null,
    name: null,
    slots: null,
    tag: null,
    attributes: null,
    getComponent: null,

    mount(scope) {
      return this.update(scope);
    },

    update(scope, parentScope) {
      const name = this.evaluate(scope); // simple update

      if (name === this.name) {
        this.tag.update(scope);
      } else {
        // unmount the old tag if it exists
        this.unmount(scope, parentScope, true); // mount the new tag

        this.name = name;
        this.tag = getTag(this.getComponent(name), this.slots, this.attributes);
        this.tag.mount(this.node, scope);
      }

      return this;
    },

    unmount(scope, parentScope, keepRootTag) {
      if (this.tag) {
        // keep the root tag
        this.tag.unmount(keepRootTag);
      }

      return this;
    }

  });

  function create$4(node, _ref13) {
    let {
      evaluate,
      getComponent,
      slots,
      attributes
    } = _ref13;
    return Object.assign({}, TagBinding, {
      node,
      evaluate,
      slots,
      attributes,
      getComponent
    });
  }

  var bindings = {
    [IF]: create$1,
    [SIMPLE]: create$3,
    [EACH]: create,
    [TAG]: create$4,
    [SLOT]: createSlot
  };
  /**
   * Bind a new expression object to a DOM node
   * @param   {HTMLElement} root - DOM node where to bind the expression
   * @param   {Object} binding - binding data
   * @returns {Expression} Expression object
   */

  function create$5(root, binding) {
    const {
      selector,
      type,
      redundantAttribute,
      expressions
    } = binding; // find the node to apply the bindings

    const node = selector ? root.querySelector(selector) : root; // remove eventually additional attributes created only to select this node

    if (redundantAttribute) node.removeAttribute(redundantAttribute); // init the binding

    return (bindings[type] || bindings[SIMPLE])(node, Object.assign({}, binding, {
      expressions: expressions || []
    }));
  }
  /**
   * Check if an element is part of an svg
   * @param   {HTMLElement}  el - element to check
   * @returns {boolean} true if we are in an svg context
   */


  function isSvg(el) {
    const owner = el.ownerSVGElement;
    return !!owner || owner === null;
  } // in this case a simple innerHTML is enough


  function createHTMLTree(html, root) {
    const template = isTemplate(root) ? root : document.createElement('template');
    template.innerHTML = html;
    return template.content;
  } // for svg nodes we need a bit more work


  function creteSVGTree(html, container) {
    // create the SVGNode
    const svgNode = container.ownerDocument.importNode(new window.DOMParser().parseFromString(`<svg xmlns="http://www.w3.org/2000/svg">${html}</svg>`, 'application/xml').documentElement, true);
    return svgNode;
  }
  /**
   * Create the DOM that will be injected
   * @param {Object} root - DOM node to find out the context where the fragment will be created
   * @param   {string} html - DOM to create as string
   * @returns {HTMLDocumentFragment|HTMLElement} a new html fragment
   */


  function createDOMTree(root, html) {
    if (isSvg(root)) return creteSVGTree(html, root);
    return createHTMLTree(html, root);
  }
  /**
   * Move all the child nodes from a source tag to another
   * @param   {HTMLElement} source - source node
   * @param   {HTMLElement} target - target node
   * @returns {undefined} it's a void method ¯\_(ツ)_/¯
   */
  // Ignore this helper because it's needed only for svg tags

  /* istanbul ignore next */


  function moveChildren(source, target) {
    if (source.firstChild) {
      target.appendChild(source.firstChild);
      moveChildren(source, target);
    }
  }
  /**
   * Inject the DOM tree into a target node
   * @param   {HTMLElement} el - target element
   * @param   {HTMLFragment|SVGElement} dom - dom tree to inject
   * @returns {undefined}
   */


  function injectDOM(el, dom) {
    switch (true) {
      case isSvg(el):
        moveChildren(dom, el);
        break;

      case isTemplate(el):
        el.parentNode.replaceChild(dom, el);
        break;

      default:
        el.appendChild(dom);
    }
  }
  /**
   * Create the Template DOM skeleton
   * @param   {HTMLElement} el - root node where the DOM will be injected
   * @param   {string} html - markup that will be injected into the root node
   * @returns {HTMLFragment} fragment that will be injected into the root node
   */


  function createTemplateDOM(el, html) {
    return html && (typeof html === 'string' ? createDOMTree(el, html) : html);
  }
  /**
   * Template Chunk model
   * @type {Object}
   */


  const TemplateChunk = Object.freeze({
    // Static props
    bindings: null,
    bindingsData: null,
    html: null,
    isTemplateTag: false,
    fragment: null,
    children: null,
    dom: null,
    el: null,

    /**
     * Create the template DOM structure that will be cloned on each mount
     * @param   {HTMLElement} el - the root node
     * @returns {TemplateChunk} self
     */
    createDOM(el) {
      // make sure that the DOM gets created before cloning the template
      this.dom = this.dom || createTemplateDOM(el, this.html);
      return this;
    },

    // API methods

    /**
     * Attach the template to a DOM node
     * @param   {HTMLElement} el - target DOM node
     * @param   {*} scope - template data
     * @param   {*} parentScope - scope of the parent template tag
     * @param   {Object} meta - meta properties needed to handle the <template> tags in loops
     * @returns {TemplateChunk} self
     */
    mount(el, scope, parentScope, meta) {
      if (meta === void 0) {
        meta = {};
      }

      if (!el) throw new Error('Please provide DOM node to mount properly your template');
      if (this.el) this.unmount(scope); // <template> tags require a bit more work
      // the template fragment might be already created via meta outside of this call

      const {
        fragment,
        children,
        avoidDOMInjection
      } = meta; // <template> bindings of course can not have a root element
      // so we check the parent node to set the query selector bindings

      const {
        parentNode
      } = children ? children[0] : el;
      this.isTemplateTag = isTemplate(el); // create the DOM if it wasn't created before

      this.createDOM(el);

      if (this.dom) {
        // create the new template dom fragment if it want already passed in via meta
        this.fragment = fragment || this.dom.cloneNode(true);
      } // store root node
      // notice that for template tags the root note will be the parent tag


      this.el = this.isTemplateTag ? parentNode : el; // create the children array only for the <template> fragments

      this.children = this.isTemplateTag ? children || Array.from(this.fragment.childNodes) : null; // inject the DOM into the el only if a fragment is available

      if (!avoidDOMInjection && this.fragment) injectDOM(el, this.fragment); // create the bindings

      this.bindings = this.bindingsData.map(binding => create$5(this.el, binding));
      this.bindings.forEach(b => b.mount(scope, parentScope));
      return this;
    },

    /**
     * Update the template with fresh data
     * @param   {*} scope - template data
     * @param   {*} parentScope - scope of the parent template tag
     * @returns {TemplateChunk} self
     */
    update(scope, parentScope) {
      this.bindings.forEach(b => b.update(scope, parentScope));
      return this;
    },

    /**
     * Remove the template from the node where it was initially mounted
     * @param   {*} scope - template data
     * @param   {*} parentScope - scope of the parent template tag
     * @param   {boolean|null} mustRemoveRoot - if true remove the root element,
     * if false or undefined clean the root tag content, if null don't touch the DOM
     * @returns {TemplateChunk} self
     */
    unmount(scope, parentScope, mustRemoveRoot) {
      if (this.el) {
        this.bindings.forEach(b => b.unmount(scope, parentScope, mustRemoveRoot));

        if (mustRemoveRoot && this.el.parentNode) {
          this.el.parentNode.removeChild(this.el);
        }

        if (mustRemoveRoot !== null) {
          if (this.children) {
            clearChildren(this.children[0].parentNode, this.children);
          } else {
            cleanNode(this.el);
          }
        }

        this.el = null;
      }

      return this;
    },

    /**
     * Clone the template chunk
     * @returns {TemplateChunk} a clone of this object resetting the this.el property
     */
    clone() {
      return Object.assign({}, this, {
        el: null
      });
    }

  });
  /**
   * Create a template chunk wiring also the bindings
   * @param   {string|HTMLElement} html - template string
   * @param   {Array} bindings - bindings collection
   * @returns {TemplateChunk} a new TemplateChunk copy
   */

  function create$6(html, bindings) {
    if (bindings === void 0) {
      bindings = [];
    }

    return Object.assign({}, TemplateChunk, {
      html,
      bindingsData: bindings
    });
  }

  /**
   * Quick type checking
   * @param   {*} element - anything
   * @param   {string} type - type definition
   * @returns {boolean} true if the type corresponds
   */
  function checkType(element, type) {
    return typeof element === type;
  }
  /**
   * Check that will be passed if its argument is a function
   * @param   {*} value - value to check
   * @returns {boolean} - true if the value is a function
   */

  function isFunction(value) {
    return checkType(value, 'function');
  }

  /* eslint-disable fp/no-mutating-methods */
  /**
   * Throw an error
   * @param {string} error - error message
   * @returns {undefined} it's a IO void function
   */

  function panic(error) {
    throw new Error(error);
  }
  /**
   * Call the first argument received only if it's a function otherwise return it as it is
   * @param   {*} source - anything
   * @returns {*} anything
   */

  function callOrAssign(source) {
    return isFunction(source) ? source.prototype && source.prototype.constructor ? new source() : source() : source;
  }
  /**
   * Convert a string from camel case to dash-case
   * @param   {string} string - probably a component tag name
   * @returns {string} component name normalized
   */

  function camelToDashCase(string) {
    return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
  }
  /**
   * Convert a string containing dashes to camel case
   * @param   {string} string - input string
   * @returns {string} my-string -> myString
   */

  function dashToCamelCase(string) {
    return string.replace(/-(\w)/g, (_, c) => c.toUpperCase());
  }
  /**
   * Define default properties if they don't exist on the source object
   * @param   {Object} source - object that will receive the default properties
   * @param   {Object} defaults - object containing additional optional keys
   * @returns {Object} the original object received enhanced
   */

  function defineDefaults(source, defaults) {
    Object.entries(defaults).forEach((_ref) => {
      let [key, value] = _ref;
      if (!source[key]) source[key] = value;
    });
    return source;
  } // doese simply nothing

  function noop() {
    return this;
  }
  /**
   * Autobind the methods of a source object to itself
   * @param   {Object} source - probably a riot tag instance
   * @param   {Array<string>} methods - list of the methods to autobind
   * @returns {Object} the original object received
   */

  function autobindMethods(source, methods) {
    methods.forEach(method => {
      source[method] = source[method].bind(source);
    });
    return source;
  }
  /**
   * Helper function to set an immutable property
   * @param   {Object} source - object where the new property will be set
   * @param   {string} key - object key where the new property will be stored
   * @param   {*} value - value of the new property
   * @param   {Object} options - set the propery overriding the default options
   * @returns {Object} - the original object modified
   */

  function defineProperty(source, key, value, options) {
    if (options === void 0) {
      options = {};
    }

    Object.defineProperty(source, key, Object.assign({
      value,
      enumerable: false,
      writable: false,
      configurable: true
    }, options));
    return source;
  }
  /**
   * Define multiple properties on a target object
   * @param   {Object} source - object where the new properties will be set
   * @param   {Object} properties - object containing as key pair the key + value properties
   * @param   {Object} options - set the propery overriding the default options
   * @returns {Object} the original object modified
   */

  function defineProperties(source, properties, options) {
    Object.entries(properties).forEach((_ref2) => {
      let [key, value] = _ref2;
      defineProperty(source, key, value, options);
    });
    return source;
  }
  /**
   * Evaluate a list of attribute expressions
   * @param   {Array} attributes - attribute expressions generated by the riot compiler
   * @returns {Object} key value pairs with the result of the computation
   */

  function evaluateAttributeExpressions(attributes) {
    return attributes.reduce((acc, attribute) => {
      const {
        value,
        type
      } = attribute;

      switch (true) {
        // spread attribute
        case !attribute.name && type === expressionTypes.ATTRIBUTE:
          return Object.assign({}, acc, {}, value);
        // value attribute

        case type === expressionTypes.VALUE:
          acc[VALUE_ATTRIBUTE] = attribute.value;
          break;
        // normal attributes

        default:
          acc[dashToCamelCase(attribute.name)] = attribute.value;
      }

      return acc;
    }, {});
  }

  /**
   * Converts any DOM node/s to a loopable array
   * @param   { HTMLElement|NodeList } els - single html element or a node list
   * @returns { Array } always a loopable object
   */
  function domToArray(els) {
    // can this object be already looped?
    if (!Array.isArray(els)) {
      // is it a node list?
      if (/^\[object (HTMLCollection|NodeList|Object)\]$/.test(Object.prototype.toString.call(els)) && typeof els.length === 'number') return Array.from(els);else // if it's a single node
        // it will be returned as "array" with one single entry
        return [els];
    } // this object could be looped out of the box


    return els;
  }

  /**
   * Normalize the return values, in case of a single value we avoid to return an array
   * @param   { Array } values - list of values we want to return
   * @returns { Array|string|boolean } either the whole list of values or the single one found
   * @private
   */

  const normalize = values => values.length === 1 ? values[0] : values;
  /**
   * Parse all the nodes received to get/remove/check their attributes
   * @param   { HTMLElement|NodeList|Array } els    - DOM node/s to parse
   * @param   { string|Array }               name   - name or list of attributes
   * @param   { string }                     method - method that will be used to parse the attributes
   * @returns { Array|string } result of the parsing in a list or a single value
   * @private
   */


  function parseNodes(els, name, method) {
    const names = typeof name === 'string' ? [name] : name;
    return normalize(domToArray(els).map(el => {
      return normalize(names.map(n => el[method](n)));
    }));
  }
  /**
   * Set any attribute on a single or a list of DOM nodes
   * @param   { HTMLElement|NodeList|Array } els   - DOM node/s to parse
   * @param   { string|Object }              name  - either the name of the attribute to set
   *                                                 or a list of properties as object key - value
   * @param   { string }                     value - the new value of the attribute (optional)
   * @returns { HTMLElement|NodeList|Array } the original array of elements passed to this function
   *
   * @example
   *
   * import { set } from 'bianco.attr'
   *
   * const img = document.createElement('img')
   *
   * set(img, 'width', 100)
   *
   * // or also
   * set(img, {
   *   width: 300,
   *   height: 300
   * })
   *
   */


  function set(els, name, value) {
    const attrs = typeof name === 'object' ? name : {
      [name]: value
    };
    const props = Object.keys(attrs);
    domToArray(els).forEach(el => {
      props.forEach(prop => el.setAttribute(prop, attrs[prop]));
    });
    return els;
  }
  /**
   * Get any attribute from a single or a list of DOM nodes
   * @param   { HTMLElement|NodeList|Array } els   - DOM node/s to parse
   * @param   { string|Array }               name  - name or list of attributes to get
   * @returns { Array|string } list of the attributes found
   *
   * @example
   *
   * import { get } from 'bianco.attr'
   *
   * const img = document.createElement('img')
   *
   * get(img, 'width') // => '200'
   *
   * // or also
   * get(img, ['width', 'height']) // => ['200', '300']
   *
   * // or also
   * get([img1, img2], ['width', 'height']) // => [['200', '300'], ['500', '200']]
   */

  function get(els, name) {
    return parseNodes(els, name, 'getAttribute');
  }

  /**
   * Get all the element attributes as object
   * @param   {HTMLElement} element - DOM node we want to parse
   * @returns {Object} all the attributes found as a key value pairs
   */

  function DOMattributesToObject(element) {
    return Array.from(element.attributes).reduce((acc, attribute) => {
      acc[dashToCamelCase(attribute.name)] = attribute.value;
      return acc;
    }, {});
  }
  /**
   * Get the tag name of any DOM node
   * @param   {HTMLElement} element - DOM node we want to inspect
   * @returns {string} name to identify this dom node in riot
   */

  function getName(element) {
    return get(element, IS_DIRECTIVE) || element.tagName.toLowerCase();
  }

  /**
   * Simple helper to find DOM nodes returning them as array like loopable object
   * @param   { string|DOMNodeList } selector - either the query or the DOM nodes to arraify
   * @param   { HTMLElement }        ctx      - context defining where the query will search for the DOM nodes
   * @returns { Array } DOM nodes found as array
   */

  function $(selector, ctx) {
    return domToArray(typeof selector === 'string' ? (ctx || document).querySelectorAll(selector) : selector);
  }

  const CSS_BY_NAME = new Map();
  const STYLE_NODE_SELECTOR = 'style[riot]'; // memoized curried function

  const getStyleNode = (style => {
    return () => {
      // lazy evaluation:
      // if this function was already called before
      // we return its cached result
      if (style) return style; // create a new style element or use an existing one
      // and cache it internally

      style = $(STYLE_NODE_SELECTOR)[0] || document.createElement('style');
      set(style, 'type', 'text/css');
      /* istanbul ignore next */

      if (!style.parentNode) document.head.appendChild(style);
      return style;
    };
  })();
  /**
   * Object that will be used to inject and manage the css of every tag instance
   */


  var cssManager = {
    CSS_BY_NAME,

    /**
     * Save a tag style to be later injected into DOM
     * @param { string } name - if it's passed we will map the css to a tagname
     * @param { string } css - css string
     * @returns {Object} self
     */
    add(name, css) {
      if (!CSS_BY_NAME.has(name)) {
        CSS_BY_NAME.set(name, css);
        this.inject();
      }

      return this;
    },

    /**
     * Inject all previously saved tag styles into DOM
     * innerHTML seems slow: http://jsperf.com/riot-insert-style
     * @returns {Object} self
     */
    inject() {
      getStyleNode().innerHTML = [...CSS_BY_NAME.values()].join('\n');
      return this;
    },

    /**
     * Remove a tag style from the DOM
     * @param {string} name a registered tagname
     * @returns {Object} self
     */
    remove(name) {
      if (CSS_BY_NAME.has(name)) {
        CSS_BY_NAME.delete(name);
        this.inject();
      }

      return this;
    }

  };

  /**
   * Function to curry any javascript method
   * @param   {Function}  fn - the target function we want to curry
   * @param   {...[args]} acc - initial arguments
   * @returns {Function|*} it will return a function until the target function
   *                       will receive all of its arguments
   */
  function curry(fn) {
    for (var _len = arguments.length, acc = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      acc[_key - 1] = arguments[_key];
    }

    return function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      args = [...acc, ...args];
      return args.length < fn.length ? curry(fn, ...args) : fn(...args);
    };
  }

  const COMPONENT_CORE_HELPERS = Object.freeze({
    // component helpers
    $(selector) {
      return $(selector, this.root)[0];
    },

    $$(selector) {
      return $(selector, this.root);
    }

  });
  const COMPONENT_LIFECYCLE_METHODS = Object.freeze({
    shouldUpdate: noop,
    onBeforeMount: noop,
    onMounted: noop,
    onBeforeUpdate: noop,
    onUpdated: noop,
    onBeforeUnmount: noop,
    onUnmounted: noop
  });
  const MOCKED_TEMPLATE_INTERFACE = {
    update: noop,
    mount: noop,
    unmount: noop,
    clone: noop,
    createDOM: noop
    /**
     * Factory function to create the component templates only once
     * @param   {Function} template - component template creation function
     * @param   {Object} components - object containing the nested components
     * @returns {TemplateChunk} template chunk object
     */

  };

  function componentTemplateFactory(template, components) {
    return template(create$6, expressionTypes, bindingTypes, name => {
      return components[name] || COMPONENTS_IMPLEMENTATION_MAP.get(name);
    });
  }
  /**
   * Create the component interface needed for the @riotjs/dom-bindings tag bindings
   * @param   {string} options.css - component css
   * @param   {Function} options.template - functon that will return the dom-bindings template function
   * @param   {Object} options.exports - component interface
   * @param   {string} options.name - component name
   * @returns {Object} component like interface
   */


  function createComponent(_ref) {
    let {
      css,
      template,
      exports,
      name
    } = _ref;
    const templateFn = template ? componentTemplateFactory(template, exports ? createSubcomponents(exports.components) : {}) : MOCKED_TEMPLATE_INTERFACE;
    return (_ref2) => {
      let {
        slots,
        attributes,
        props
      } = _ref2;
      const componentAPI = callOrAssign(exports) || {};
      const component = defineComponent({
        css,
        template: templateFn,
        componentAPI,
        name
      })({
        slots,
        attributes,
        props
      }); // notice that for the components create via tag binding
      // we need to invert the mount (state/parentScope) arguments
      // the template bindings will only forward the parentScope updates
      // and never deal with the component state

      return {
        mount(element, parentScope, state) {
          return component.mount(element, state, parentScope);
        },

        update(parentScope, state) {
          return component.update(state, parentScope);
        },

        unmount(preserveRoot) {
          return component.unmount(preserveRoot);
        }

      };
    };
  }
  /**
   * Component definition function
   * @param   {Object} implementation - the componen implementation will be generated via compiler
   * @param   {Object} component - the component initial properties
   * @returns {Object} a new component implementation object
   */

  function defineComponent(_ref3) {
    let {
      css,
      template,
      componentAPI,
      name
    } = _ref3;
    // add the component css into the DOM
    if (css && name) cssManager.add(name, css);
    return curry(enhanceComponentAPI)(defineProperties( // set the component defaults without overriding the original component API
    defineDefaults(componentAPI, Object.assign({}, COMPONENT_LIFECYCLE_METHODS, {
      state: {}
    })), Object.assign({
      // defined during the component creation
      slots: null,
      root: null
    }, COMPONENT_CORE_HELPERS, {
      name,
      css,
      template
    })));
  }
  /**
   * Evaluate the component properties either from its real attributes or from its attribute expressions
   * @param   {HTMLElement} element - component root
   * @param   {Array}  attributeExpressions - attribute values generated via createAttributeBindings
   * @returns {Object} attributes key value pairs
   */

  function evaluateProps(element, attributeExpressions) {
    if (attributeExpressions === void 0) {
      attributeExpressions = [];
    }

    return Object.assign({}, DOMattributesToObject(element), {}, evaluateAttributeExpressions(attributeExpressions));
  }
  /**
   * Create the bindings to update the component attributes
   * @param   {HTMLElement} node - node where we will bind the expressions
   * @param   {Array} attributes - list of attribute bindings
   * @returns {TemplateChunk} - template bindings object
   */


  function createAttributeBindings(node, attributes) {
    if (attributes === void 0) {
      attributes = [];
    }

    const expressions = attributes.map(a => create$2(node, a));
    const binding = {};

    const updateValues = method => scope => {
      expressions.forEach(e => e[method](scope));
      return binding;
    };

    return Object.assign(binding, {
      expressions,
      mount: updateValues('mount'),
      update: updateValues('update'),
      unmount: updateValues('unmount')
    });
  }
  /**
   * Create the subcomponents that can be included inside a tag in runtime
   * @param   {Object} components - components imported in runtime
   * @returns {Object} all the components transformed into Riot.Component factory functions
   */


  function createSubcomponents(components) {
    if (components === void 0) {
      components = {};
    }

    return Object.entries(callOrAssign(components)).reduce((acc, _ref4) => {
      let [key, value] = _ref4;
      acc[camelToDashCase(key)] = createComponent(value);
      return acc;
    }, {});
  }
  /**
   * Run the component instance through all the plugins set by the user
   * @param   {Object} component - component instance
   * @returns {Object} the component enhanced by the plugins
   */


  function runPlugins(component) {
    return [...PLUGINS_SET].reduce((c, fn) => fn(c) || c, component);
  }
  /**
   * Compute the component current state merging it with its previous state
   * @param   {Object} oldState - previous state object
   * @param   {Object} newState - new state givent to the `update` call
   * @returns {Object} new object state
   */


  function computeState(oldState, newState) {
    return Object.assign({}, oldState, {}, callOrAssign(newState));
  }
  /**
   * Add eventually the "is" attribute to link this DOM node to its css
   * @param {HTMLElement} element - target root node
   * @param {string} name - name of the component mounted
   * @returns {undefined} it's a void function
   */


  function addCssHook(element, name) {
    if (getName(element) !== name) {
      set(element, 'is', name);
    }
  }
  /**
   * Component creation factory function that will enhance the user provided API
   * @param   {Object} component - a component implementation previously defined
   * @param   {Array} options.slots - component slots generated via riot compiler
   * @param   {Array} options.attributes - attribute expressions generated via riot compiler
   * @returns {Riot.Component} a riot component instance
   */


  function enhanceComponentAPI(component, _ref5) {
    let {
      slots,
      attributes,
      props
    } = _ref5;
    const initialProps = callOrAssign(props);
    return autobindMethods(runPlugins(defineProperties(Object.create(component), {
      mount(element, state, parentScope) {
        if (state === void 0) {
          state = {};
        }

        this[ATTRIBUTES_KEY_SYMBOL] = createAttributeBindings(element, attributes).mount(parentScope);
        this.props = Object.freeze(Object.assign({}, initialProps, {}, evaluateProps(element, this[ATTRIBUTES_KEY_SYMBOL].expressions)));
        this.state = computeState(this.state, state);
        this[TEMPLATE_KEY_SYMBOL] = this.template.createDOM(element).clone(); // link this object to the DOM node

        element[DOM_COMPONENT_INSTANCE_PROPERTY] = this; // add eventually the 'is' attribute

        component.name && addCssHook(element, component.name); // define the root element

        defineProperty(this, 'root', element); // define the slots array

        defineProperty(this, 'slots', slots); // before mount lifecycle event

        this.onBeforeMount(this.props, this.state); // mount the template

        this[TEMPLATE_KEY_SYMBOL].mount(element, this, parentScope);
        this.onMounted(this.props, this.state);
        return this;
      },

      update(state, parentScope) {
        if (state === void 0) {
          state = {};
        }

        if (parentScope) {
          this[ATTRIBUTES_KEY_SYMBOL].update(parentScope);
        }

        const newProps = evaluateProps(this.root, this[ATTRIBUTES_KEY_SYMBOL].expressions);
        if (this.shouldUpdate(newProps, this.props) === false) return;
        this.props = Object.freeze(Object.assign({}, initialProps, {}, newProps));
        this.state = computeState(this.state, state);
        this.onBeforeUpdate(this.props, this.state);
        this[TEMPLATE_KEY_SYMBOL].update(this, parentScope);
        this.onUpdated(this.props, this.state);
        return this;
      },

      unmount(preserveRoot) {
        this.onBeforeUnmount(this.props, this.state);
        this[ATTRIBUTES_KEY_SYMBOL].unmount(); // if the preserveRoot is null the template html will be left untouched
        // in that case the DOM cleanup will happen differently from a parent node

        this[TEMPLATE_KEY_SYMBOL].unmount(this, {}, preserveRoot === null ? null : !preserveRoot);
        this.onUnmounted(this.props, this.state);
        return this;
      }

    })), Object.keys(component).filter(prop => isFunction(component[prop])));
  }
  /**
   * Component initialization function starting from a DOM node
   * @param   {HTMLElement} element - element to upgrade
   * @param   {Object} initialProps - initial component properties
   * @param   {string} componentName - component id
   * @returns {Object} a new component instance bound to a DOM node
   */

  function mountComponent(element, initialProps, componentName) {
    const name = componentName || getName(element);
    if (!COMPONENTS_IMPLEMENTATION_MAP.has(name)) panic(`The component named "${name}" was never registered`);
    const component = COMPONENTS_IMPLEMENTATION_MAP.get(name)({
      props: initialProps
    });
    return component.mount(element);
  }

  const {
    DOM_COMPONENT_INSTANCE_PROPERTY: DOM_COMPONENT_INSTANCE_PROPERTY$1,
    COMPONENTS_IMPLEMENTATION_MAP: COMPONENTS_IMPLEMENTATION_MAP$1,
    PLUGINS_SET: PLUGINS_SET$1
  } = globals;
  /**
   * Riot public api
   */

  /**
   * Register a custom tag by name
   * @param   {string} name - component name
   * @param   {Object} implementation - tag implementation
   * @returns {Map} map containing all the components implementations
   */

  function register(name, _ref) {
    let {
      css,
      template,
      exports
    } = _ref;
    if (COMPONENTS_IMPLEMENTATION_MAP$1.has(name)) panic(`The component "${name}" was already registered`);
    COMPONENTS_IMPLEMENTATION_MAP$1.set(name, createComponent({
      name,
      css,
      template,
      exports
    }));
    return COMPONENTS_IMPLEMENTATION_MAP$1;
  }
  /**
   * Mounting function that will work only for the components that were globally registered
   * @param   {string|HTMLElement} selector - query for the selection or a DOM element
   * @param   {Object} initialProps - the initial component properties
   * @param   {string} name - optional component name
   * @returns {Array} list of nodes upgraded
   */

  function mount(selector, initialProps, name) {
    return $(selector).map(element => mountComponent(element, initialProps, name));
  }
  /**
   * Define a riot plugin
   * @param   {Function} plugin - function that will receive all the components created
   * @returns {Set} the set containing all the plugins installed
   */

  function install(plugin) {
    if (!isFunction(plugin)) panic('Plugins must be of type function');
    if (PLUGINS_SET$1.has(plugin)) panic('This plugin was already install');
    PLUGINS_SET$1.add(plugin);
    return PLUGINS_SET$1;
  }

  var jicon = {
    'css': null,
    'exports': null,

    'template': function(template, expressionTypes, bindingTypes, getComponent) {
      return template('<i expr106></i>', [{
        'redundantAttribute': 'expr106',
        'selector': '[expr106]',

        'expressions': [{
          'type': expressionTypes.ATTRIBUTE,
          'name': 'class',

          'evaluate': function(scope) {
            return scope.selectIcon(scope.props.field);
          }
        }]
      }]);
    },

    'name': 'jicon'
  };

  var jaddon = {
    'css': null,

    'exports': {
      components: {
          jicon
      }
    },

    'template': function(template, expressionTypes, bindingTypes, getComponent) {
      return template(
        '<div expr76 class="h-100 input-group-prepend"></div><div expr78 class="h-100 input-group-append"></div>',
        [{
          'type': bindingTypes.IF,

          'evaluate': function(scope) {
            return scope.props.placement=='left' && scope.props.field.icon!='none';
          },

          'redundantAttribute': 'expr76',
          'selector': '[expr76]',

          'template': template(
            '<span class="input-group-text" id="basic-addon1"><jicon expr77></jicon></span>',
            [{
              'type': bindingTypes.TAG,
              'getComponent': getComponent,

              'evaluate': function(scope) {
                return 'jicon';
              },

              'slots': [],

              'attributes': [{
                'type': expressionTypes.ATTRIBUTE,
                'name': 'field',

                'evaluate': function(scope) {
                  return scope.props.field;
                }
              }],

              'redundantAttribute': 'expr77',
              'selector': '[expr77]'
            }]
          )
        }, {
          'type': bindingTypes.IF,

          'evaluate': function(scope) {
            return scope.props.placement=='right' && scope.props.field.buttons;
          },

          'redundantAttribute': 'expr78',
          'selector': '[expr78]',

          'template': template('<ibutton expr79></ibutton>', [{
            'type': bindingTypes.EACH,
            'getKey': null,
            'condition': null,

            'template': template(null, [{
              'type': bindingTypes.TAG,
              'getComponent': getComponent,

              'evaluate': function(scope) {
                return 'ibutton';
              },

              'slots': [],

              'attributes': [{
                'type': expressionTypes.ATTRIBUTE,
                'name': 'field',

                'evaluate': function(scope) {
                  return scope.button;
                }
              }]
            }]),

            'redundantAttribute': 'expr79',
            'selector': '[expr79]',
            'itemName': 'button',
            'indexName': null,

            'evaluate': function(scope) {
              return scope.props.field.buttons;
            }
          }])
        }]
      );
    },

    'name': 'jaddon'
  };

  var jhelp = {
    'css': null,
    'exports': null,

    'template': function(template, expressionTypes, bindingTypes, getComponent) {
      return template('<small expr61 class="text-muted mb-1 mr-1"></small>', [{
        'type': bindingTypes.IF,

        'evaluate': function(scope) {
          return scope.props.help;
        },

        'redundantAttribute': 'expr61',
        'selector': '[expr61]',

        'template': template('<!---->', [{
          'expressions': [{
            'type': expressionTypes.TEXT,
            'childNodeIndex': 0,

            'evaluate': function(scope) {
              return scope.i18n(scope.props.help);
            }
          }]
        }])
      }]);
    },

    'name': 'jhelp'
  };

  var jlabel = {
    'css': `jlabel .label,[is="jlabel"] .label{ font-size:1.3rem; } jlabel .inputRequired,[is="jlabel"] .inputRequired{ color: red; }`,
    'exports': null,

    'template': function(template, expressionTypes, bindingTypes, getComponent) {
      return template(
        '<label expr94 class="label fucfirst"><!----></label><span expr95 class="inputRequired mx-1"></span>',
        [{
          'redundantAttribute': 'expr94',
          'selector': '[expr94]',

          'expressions': [{
            'type': expressionTypes.TEXT,
            'childNodeIndex': 0,

            'evaluate': function(scope) {
              return scope.i18n(scope.props.field.label);
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'for',

            'evaluate': function(scope) {
              return scope.props.field.id;
            }
          }]
        }, {
          'type': bindingTypes.IF,

          'evaluate': function(scope) {
            return scope.props.field.required;
          },

          'redundantAttribute': 'expr95',
          'selector': '[expr95]',
          'template': template('<i class="fas fa-asterisk fa-fw" aria-hidden="true"></i>', [])
        }]
      );
    },

    'name': 'jlabel'
  };

  var jtooltip = {
    'css': `jtooltip .ftooltip,[is="jtooltip"] .ftooltip{ position: relative; display: inline-block; } jtooltip .ftooltip .ftooltipText,[is="jtooltip"] .ftooltip .ftooltipText{ font-size:1rem!important; visibility: hidden; width: 12rem; background-color: #ffc107; color: white; text-align: center; border: thin solid lightgray; border-radius: 6px; padding: 5px 0; position: absolute; z-index: 10; bottom: 125%; left: 0%; margin-left: -60px; } jtooltip .ftooltip:hover .ftooltipText,[is="jtooltip"] .ftooltip:hover .ftooltipText{ visibility: visible; }`,
    'exports': null,

    'template': function(template, expressionTypes, bindingTypes, getComponent) {
      return template('<div expr107 class="ftooltip"></div>', [{
        'type': bindingTypes.IF,

        'evaluate': function(scope) {
          return scope.props.tip;
        },

        'redundantAttribute': 'expr107',
        'selector': '[expr107]',

        'template': template(
          '<i class="far fa-question-circle mx-1"></i><div expr108 class="ftooltipText"><!----></div>',
          [{
            'redundantAttribute': 'expr108',
            'selector': '[expr108]',

            'expressions': [{
              'type': expressionTypes.TEXT,
              'childNodeIndex': 0,

              'evaluate': function(scope) {
                return scope.i18n(scope.props.tip);
              }
            }]
          }]
        )
      }]);
    },

    'name': 'jtooltip'
  };

  var ialert = {
    'css': `ialert .alert div,[is="ialert"] .alert div{ font-size: 2rem; }`,

    'exports': {
      components: {
          jaddon,
          jhelp,
          jicon,
          jlabel,
          jtooltip
      }
    },

    'template': function(template, expressionTypes, bindingTypes, getComponent) {
      return template(
        '<div expr13 role="alert"><div expr14><jicon expr15></jicon><!----><jtooltip expr16></jtooltip></div><jhelp expr17></jhelp></div>',
        [{
          'redundantAttribute': 'expr13',
          'selector': '[expr13]',

          'expressions': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'class',

            'evaluate': function(scope) {
              return [
                'alert alert-',
                scope.props.field.color||'info',
                ' ',
                scope.props.field.class
              ].join('');
            }
          }]
        }, {
          'redundantAttribute': 'expr14',
          'selector': '[expr14]',

          'expressions': [{
            'type': expressionTypes.TEXT,
            'childNodeIndex': 1,

            'evaluate': function(scope) {
              return [' ', scope.i18n(scope.props.field.message), '\r\n            '].join('');
            }
          }]
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jicon';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'field',

            'evaluate': function(scope) {
              return scope.props.field;
            }
          }],

          'redundantAttribute': 'expr15',
          'selector': '[expr15]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jtooltip';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'tip',

            'evaluate': function(scope) {
              return scope.props.field.tip;
            }
          }],

          'redundantAttribute': 'expr16',
          'selector': '[expr16]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jhelp';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'help',

            'evaluate': function(scope) {
              return scope.props.field.help;
            }
          }],

          'redundantAttribute': 'expr17',
          'selector': '[expr17]'
        }]
      );
    },

    'name': 'ialert'
  };

  var ibutton = {
    'css': null,

    'exports': {
      components: {
          jaddon,
          jhelp,
          jicon,
          jlabel,
          jtooltip
      },

      click(ev) { //not used
          action = ev.target.getAttribute('action');
          param = ev.target.getAttribute('param');
          console.log(action, param, this);
          if (typeof action == "function") action(event, param);
          if (typeof this[action] == "function") this[action](event, param);
      },

      dosomething(ev, param) //test action
      {
          alert('dosomething');
      }
    },

    'template': function(template, expressionTypes, bindingTypes, getComponent) {
      return template(
        '<button expr9 type="button" style="text-transform: capitalize;"><jicon expr10></jicon><!----><jtooltip expr11></jtooltip></button><jhelp expr12></jhelp>',
        [{
          'redundantAttribute': 'expr9',
          'selector': '[expr9]',

          'expressions': [{
            'type': expressionTypes.TEXT,
            'childNodeIndex': 1,

            'evaluate': function(scope) {
              return [' ', scope.i18n(scope.props.field.title), '\r\n        '].join('');
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': null,

            'evaluate': function(scope) {
              return scope.props.field;
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'class',

            'evaluate': function(scope) {
              return [
                'btn btn-',
                scope.props.field.color?scope.props.field.color:'outline-primary',
                ' ',
                scope.props.field.class
              ].join('');
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'name',

            'evaluate': function(scope) {
              return scope.props.field.id;
            }
          }, {
            'type': expressionTypes.EVENT,
            'name': 'onclick',

            'evaluate': function(scope) {
              return scope[scope.props.field.onclick];
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'id',

            'evaluate': function(scope) {
              return [].join('');
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'disabled',

            'evaluate': function(scope) {
              return scope.props.field.waitValid || scope.props.field.disabled;
            }
          }]
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jicon';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'field',

            'evaluate': function(scope) {
              return scope.props.field;
            }
          }],

          'redundantAttribute': 'expr10',
          'selector': '[expr10]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jtooltip';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'tip',

            'evaluate': function(scope) {
              return scope.props.field.tip;
            }
          }],

          'redundantAttribute': 'expr11',
          'selector': '[expr11]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jhelp';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'help',

            'evaluate': function(scope) {
              return scope.props.field.help;
            }
          }],

          'redundantAttribute': 'expr12',
          'selector': '[expr12]'
        }]
      );
    },

    'name': 'ibutton'
  };

  var icheckbox = {
    'css': `icheckbox .fswitch,[is="icheckbox"] .fswitch{ display: block; position: relative; padding-left: 3.2rem; margin-bottom: 12px; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } icheckbox .fswitch input,[is="icheckbox"] .fswitch input{ position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; } icheckbox .fswitchslider,[is="icheckbox"] .fswitchslider{ position: absolute; top: 3px; left: 0; height: 1.5rem; width: 2.75rem; background-color: #eee; -webkit-transition: .4s; transition: .4s; } icheckbox .fswitch:hover input~.fswitchslider,[is="icheckbox"] .fswitch:hover input~.fswitchslider{ background-color: #ccc; } icheckbox .fswitch input:checked~.fswitchslider,[is="icheckbox"] .fswitch input:checked~.fswitchslider{ background-color: #2196F3; } icheckbox .fswitchslider:before,[is="icheckbox"] .fswitchslider:before{ position: absolute; content: ""; height: 1.35rem; width: 1.35rem; left: 0.1rem; bottom: 0.1rem; background-color: white; -webkit-transition: .4s; transition: .4s; } icheckbox .fswitch input:checked~.fswitchslider,[is="icheckbox"] .fswitch input:checked~.fswitchslider{ background-color: blue; } icheckbox .fswitch input:checked~.fswitchslider:before,[is="icheckbox"] .fswitch input:checked~.fswitchslider:before{ background-image: radial-gradient(#ffffff, rgb(210, 210, 210)); } icheckbox .fswitch input:focus~.fswitchslider,[is="icheckbox"] .fswitch input:focus~.fswitchslider{ --box-shadow: 0 0 1px var(--navBarBg-backgroundColor); box-shadow: 0 0 4px blue; } icheckbox .fswitch input:checked~.fswitchslider:before,[is="icheckbox"] .fswitch input:checked~.fswitchslider:before{ -webkit-transform: translateX(1.25rem); -ms-transform: translateX(1.25rem); transform: translateX(1.25rem); } icheckbox .fswitch input[disabled]~.fswitchslider,[is="icheckbox"] .fswitch input[disabled]~.fswitchslider{ opacity: 0.5; cursor: not-allowed; } icheckbox .fswitchround,[is="icheckbox"] .fswitchround{ border-radius: 3.4rem; } icheckbox .fswitchround:before,[is="icheckbox"] .fswitchround:before{ border-radius: 50%; } icheckbox .fcheck,[is="icheckbox"] .fcheck{ display: block; position: relative; padding-left: 35px; margin-bottom: 12px; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } icheckbox .fcheck input,[is="icheckbox"] .fcheck input{ position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; } icheckbox .fcheckmark,[is="icheckbox"] .fcheckmark{ position: absolute; top: 0; left: 0; height: 25px; width: 25px; background-color: #eee; -webkit-transition: .4s; transition: .4s; } icheckbox .fcheck:hover input~.fcheckmark,[is="icheckbox"] .fcheck:hover input~.fcheckmark{ background-color: #ccc; } icheckbox .fcheck input:checked~.fcheckmark,[is="icheckbox"] .fcheck input:checked~.fcheckmark{ background-color: #2196F3; } icheckbox .fcheckmark:after,[is="icheckbox"] .fcheckmark:after{ content: ""; position: absolute; display: none; } icheckbox .fcheck input:checked~.fcheckmark:after,[is="icheckbox"] .fcheck input:checked~.fcheckmark:after{ display: block; } icheckbox .fcheck .fcheckmark:after,[is="icheckbox"] .fcheck .fcheckmark:after{ left: 9px; top: 5px; width: 6px; height: 12px; border: solid white; border-width: 0 3px 3px 0; -webkit-transform: rotate(45deg); -ms-transform: rotate(45deg); transform: rotate(45deg); }`,

    'exports': {
      components: {
          jaddon,
          jhelp,
          jicon,
          jlabel,
          jtooltip
      },

      isChecked(option) {
          return (option.checked || option.value == option.checkedValue || option.value == true)
      },

      ctrlToString(option, which) {
          if (option.ctrl && option.ctrl[which]) return option.ctrl[which].join()
          else return false
      },

      buildId(option) {
          if (option.id) return this.props.field.id + '.' + option.id
          else return this.props.field.id
      }
    },

    'template': function(template, expressionTypes, bindingTypes, getComponent) {
      return template(
        '<jlabel expr62></jlabel><jtooltip expr63></jtooltip><jhelp expr64></jhelp><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><div class="aaad-inline"><template expr65></template></div>',
        [{
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jlabel';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'field',

            'evaluate': function(scope) {
              return scope.props.field;
            }
          }],

          'redundantAttribute': 'expr62',
          'selector': '[expr62]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jtooltip';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'tip',

            'evaluate': function(scope) {
              return scope.props.field.tip;
            }
          }],

          'redundantAttribute': 'expr63',
          'selector': '[expr63]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jhelp';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'help',

            'evaluate': function(scope) {
              return scope.props.field.help;
            }
          }],

          'redundantAttribute': 'expr64',
          'selector': '[expr64]'
        }, {
          'type': bindingTypes.EACH,
          'getKey': null,
          'condition': null,

          'template': template(
            '<div class="row"><div expr66 class="fucfirst col-auto mb-2"></div><div class="col-auto"><label expr67><span expr68 class="mr-1"></span><jtooltip expr69></jtooltip><jhelp expr70></jhelp><input expr71 class="form-control"/><span expr72></span></label></div><div expr73 class="fucfirst col-auto mb-2"></div><div class="fucfirst col-auto mb-2"><jtooltip expr74></jtooltip><jhelp expr75></jhelp></div></div>',
            [{
              'type': bindingTypes.IF,

              'evaluate': function(scope) {
                return scope.option.uncheckedLabel;
              },

              'redundantAttribute': 'expr66',
              'selector': '[expr66]',

              'template': template('<!---->', [{
                'expressions': [{
                  'type': expressionTypes.TEXT,
                  'childNodeIndex': 0,

                  'evaluate': function(scope) {
                    return scope.i18n(scope.option.uncheckedLabel);
                  }
                }]
              }])
            }, {
              'redundantAttribute': 'expr67',
              'selector': '[expr67]',

              'expressions': [{
                'type': expressionTypes.ATTRIBUTE,
                'name': 'class',

                'evaluate': function(scope) {
                  return ['ucfirst ', scope.props.field.type=='switch' ?'fswitch':'fcheck'].join('');
                }
              }]
            }, {
              'type': bindingTypes.IF,

              'evaluate': function(scope) {
                return !scope.option.checkedLabel;
              },

              'redundantAttribute': 'expr68',
              'selector': '[expr68]',

              'template': template('<!---->', [{
                'expressions': [{
                  'type': expressionTypes.TEXT,
                  'childNodeIndex': 0,

                  'evaluate': function(scope) {
                    return [' ', scope.i18n(scope.option.label)].join('');
                  }
                }]
              }])
            }, {
              'type': bindingTypes.IF,

              'evaluate': function(scope) {
                return !scope.option.checkedLabel;
              },

              'redundantAttribute': 'expr69',
              'selector': '[expr69]',

              'template': template(null, [{
                'type': bindingTypes.TAG,
                'getComponent': getComponent,

                'evaluate': function(scope) {
                  return 'jtooltip';
                },

                'slots': [],

                'attributes': [{
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'tip',

                  'evaluate': function(scope) {
                    return scope.option.tip;
                  }
                }]
              }])
            }, {
              'type': bindingTypes.IF,

              'evaluate': function(scope) {
                return !scope.option.checkedLabel;
              },

              'redundantAttribute': 'expr70',
              'selector': '[expr70]',

              'template': template(null, [{
                'type': bindingTypes.TAG,
                'getComponent': getComponent,

                'evaluate': function(scope) {
                  return 'jhelp';
                },

                'slots': [],

                'attributes': [{
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'help',

                  'evaluate': function(scope) {
                    return scope.option.help;
                  }
                }]
              }])
            }, {
              'redundantAttribute': 'expr71',
              'selector': '[expr71]',

              'expressions': [{
                'type': expressionTypes.ATTRIBUTE,
                'name': null,

                'evaluate': function(scope) {
                  return scope.props.field;
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'type',

                'evaluate': function(scope) {
                  return "checkbox";
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'checkedValue',

                'evaluate': function(scope) {
                  return scope.option.checkedValue;
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'unCheckedValue',

                'evaluate': function(scope) {
                  return scope.option.uncheckedValue;
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'checked',

                'evaluate': function(scope) {
                  return scope.isChecked(scope.option);
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'ctrlChecked',

                'evaluate': function(scope) {
                  return scope.ctrlToString(scope.option,'checked');
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'ctrlUnchecked',

                'evaluate': function(scope) {
                  return scope.ctrlToString(scope.option,'unchecked');
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'name',

                'evaluate': function(scope) {
                  return scope.buildId(scope.option);
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'id',

                'evaluate': function(scope) {
                  return [].join('');
                }
              }]
            }, {
              'redundantAttribute': 'expr72',
              'selector': '[expr72]',

              'expressions': [{
                'type': expressionTypes.ATTRIBUTE,
                'name': 'class',

                'evaluate': function(scope) {
                  return scope.props.field.type=='switch' ?'fswitchslider fswitchround':'fcheckmark';
                }
              }]
            }, {
              'type': bindingTypes.IF,

              'evaluate': function(scope) {
                return scope.option.checkedLabel;
              },

              'redundantAttribute': 'expr73',
              'selector': '[expr73]',

              'template': template('<!---->', [{
                'expressions': [{
                  'type': expressionTypes.TEXT,
                  'childNodeIndex': 0,

                  'evaluate': function(scope) {
                    return [
                      '\r\n                    ',
                      scope.i18n(scope.option.checkedLabel),
                      '\r\n                '
                    ].join('');
                  }
                }]
              }])
            }, {
              'type': bindingTypes.IF,

              'evaluate': function(scope) {
                return scope.option.checkedLabel;
              },

              'redundantAttribute': 'expr74',
              'selector': '[expr74]',

              'template': template(null, [{
                'type': bindingTypes.TAG,
                'getComponent': getComponent,

                'evaluate': function(scope) {
                  return 'jtooltip';
                },

                'slots': [],

                'attributes': [{
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'tip',

                  'evaluate': function(scope) {
                    return scope.option.tip;
                  }
                }]
              }])
            }, {
              'type': bindingTypes.IF,

              'evaluate': function(scope) {
                return scope.option.checkedLabel;
              },

              'redundantAttribute': 'expr75',
              'selector': '[expr75]',

              'template': template(null, [{
                'type': bindingTypes.TAG,
                'getComponent': getComponent,

                'evaluate': function(scope) {
                  return 'jhelp';
                },

                'slots': [],

                'attributes': [{
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'help',

                  'evaluate': function(scope) {
                    return scope.option.help;
                  }
                }]
              }])
            }]
          ),

          'redundantAttribute': 'expr65',
          'selector': '[expr65]',
          'itemName': 'option',
          'indexName': null,

          'evaluate': function(scope) {
            return scope.props.field.options;
          }
        }]
      );
    },

    'name': 'icheckbox'
  };

  var icolorpicker = {
    'css': `icolorpicker .pickr .pcr-button,[is="icolorpicker"] .pickr .pcr-button{ height: 4em; width: 4em; }`,

    'exports': {
      components: {
          jaddon,
          jhelp,
          jicon,
          jlabel,
          jtooltip
      },

      onMounted() {
          let formId = this.props.attr.id;
          //https://github.com/Simonwep/pickr
          const pickr = Pickr.create({
              el: '[name="' + formId + '_colorpicker_' + this.props.field.id + '"]',
              theme: 'nano', // or 'monolith', or 'nano'
              //default:'rgba(239, 1, 5, 1)',
              // default:'#16D92A',

              comparison: false,

              swatches: [
                  'rgba(244, 67, 54, 1)',
                  'rgba(233, 30, 99, 0.95)',
                  'rgba(156, 39, 176, 0.9)',
                  'rgba(103, 58, 183, 0.85)',
                  'rgba(63, 81, 181, 0.8)',
                  'rgba(33, 150, 243, 0.75)',
                  'rgba(3, 169, 244, 0.7)',
                  'rgba(0, 188, 212, 0.7)',
                  'rgba(0, 150, 136, 0.75)',
                  'rgba(76, 175, 80, 0.8)',
                  'rgba(139, 195, 74, 0.85)',
                  'rgba(205, 220, 57, 0.9)',
                  'rgba(255, 235, 59, 0.95)',
                  'rgba(255, 193, 7, 1)'
              ],

              components: {

                  // Main components
                  preview: true,
                  opacity: true,
                  hue: true,

                  // Input / output Options
                  interaction: {
                      hex: true,
                      rgba: true,
                      hsla: false,
                      hsva: false,
                      cmyk: false,
                      input: true,
                      clear: false,
                      save: true,
                      cancel: true
                  }
              },
              strings: {
                  save: 'Select', // Default for save button
                  clear: 'Clear', // Default for clear button
                  cancel: 'Cancel' // Default for cancel button
              }
          });

          pickr.on('init', instance => {
              //console.log(instance)
              let setColor = instance._root.root.closest(".form-group").querySelector("[type='hidden']").value;
              pickr.setColor(setColor, true);
          });

          pickr.on('save', (color, instance) => {
              let rgba = color.toRGBA().toString();
              instance._root.root.closest(".form-group").querySelector("[type='hidden']").value = rgba;
          }).on('cancel', () => {
              pickr.hide();
          });

          document.addEventListener(this.props.attr.id + '_setColor_' + this.props.field.id, function(ev) {
              pickr.setColor(ev.detail.color, true);
          });
      }
    },

    'template': function(template, expressionTypes, bindingTypes, getComponent) {
      return template(
        '<jlabel expr23></jlabel><jtooltip expr24></jtooltip><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><jhelp expr25></jhelp><div expr26></div><input expr27 type="hidden" class="form-control"/>',
        [{
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jlabel';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'field',

            'evaluate': function(scope) {
              return scope.props.field;
            }
          }],

          'redundantAttribute': 'expr23',
          'selector': '[expr23]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jtooltip';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'tip',

            'evaluate': function(scope) {
              return scope.props.field.tip;
            }
          }],

          'redundantAttribute': 'expr24',
          'selector': '[expr24]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jhelp';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'help',

            'evaluate': function(scope) {
              return scope.props.field.help;
            }
          }],

          'redundantAttribute': 'expr25',
          'selector': '[expr25]'
        }, {
          'redundantAttribute': 'expr26',
          'selector': '[expr26]',

          'expressions': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'name',

            'evaluate': function(scope) {
              return scope.props.attr.id +"_colorpicker_" + scope.props.field.id;
            }
          }]
        }, {
          'redundantAttribute': 'expr27',
          'selector': '[expr27]',

          'expressions': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'name',

            'evaluate': function(scope) {
              return scope.props.field.id;
            }
          }, {
            'type': expressionTypes.VALUE,

            'evaluate': function(scope) {
              return scope.props.field.value;
            }
          }]
        }]
      );
    },

    'name': 'icolorpicker'
  };

  var ihidden = {
    'css': null,
    'exports': null,

    'template': function(template, expressionTypes, bindingTypes, getComponent) {
      return template('<input expr8 type="hidden"/>', [{
        'redundantAttribute': 'expr8',
        'selector': '[expr8]',

        'expressions': [{
          'type': expressionTypes.ATTRIBUTE,
          'name': null,

          'evaluate': function(scope) {
            return scope.props.field;
          }
        }, {
          'type': expressionTypes.ATTRIBUTE,
          'name': 'class',

          'evaluate': function(scope) {
            return ['form-control ', scope.props.field.class].join('');
          }
        }, {
          'type': expressionTypes.ATTRIBUTE,
          'name': 'name',

          'evaluate': function(scope) {
            return scope.props.field.id;
          }
        }, {
          'type': expressionTypes.VALUE,

          'evaluate': function(scope) {
            return scope.props.field.value;
          }
        }, {
          'type': expressionTypes.ATTRIBUTE,
          'name': 'id',

          'evaluate': function(scope) {
            return [].join('');
          }
        }]
      }]);
    },

    'name': 'ihidden'
  };

  var ihr = {
    'css': `ihr .fhrlabel,[is="ihr"] .fhrlabel{ font-size: 1.3rem; } ihr hr,[is="ihr"] hr{ margin: 0; }`,

    'exports': {
      components: {
          jaddon,
          jhelp,
          jicon,
          jlabel,
          jtooltip
      }
    },

    'template': function(template, expressionTypes, bindingTypes, getComponent) {
      return template(
        '<div expr18><jicon expr19></jicon><span expr20><!----></span><jtooltip expr21></jtooltip><hr/><jhelp expr22></jhelp></div>',
        [{
          'redundantAttribute': 'expr18',
          'selector': '[expr18]',

          'expressions': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'name',

            'evaluate': function(scope) {
              return scope.props.field.id;
            }
          }]
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jicon';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'field',

            'evaluate': function(scope) {
              return scope.props.field;
            }
          }],

          'redundantAttribute': 'expr19',
          'selector': '[expr19]'
        }, {
          'redundantAttribute': 'expr20',
          'selector': '[expr20]',

          'expressions': [{
            'type': expressionTypes.TEXT,
            'childNodeIndex': 0,

            'evaluate': function(scope) {
              return [' ', scope.i18n(scope.props.field.label)].join('');
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'class',

            'evaluate': function(scope) {
              return ['fhrlabel ', scope.props.field.class].join('');
            }
          }]
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jtooltip';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'tip',

            'evaluate': function(scope) {
              return scope.props.field.tip;
            }
          }],

          'redundantAttribute': 'expr21',
          'selector': '[expr21]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jhelp';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'help',

            'evaluate': function(scope) {
              return scope.props.field.help;
            }
          }],

          'redundantAttribute': 'expr22',
          'selector': '[expr22]'
        }]
      );
    },

    'name': 'ihr'
  };

  var ipassword = {
    'css': null,

    'exports': {
      components: {
          jaddon,
          jhelp,
          jicon,
          jlabel,
          jtooltip
      }
    },

    'template': function(template, expressionTypes, bindingTypes, getComponent) {
      return template(
        '<jlabel expr35></jlabel><jtooltip expr36></jtooltip><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><div class="input-group"><jaddon expr37 placement="left"></jaddon><input expr38 type="password" placeholder="Password"/><jaddon expr39 placement="right"></jaddon></div><jhelp expr40></jhelp>',
        [{
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jlabel';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'field',

            'evaluate': function(scope) {
              return scope.props.field;
            }
          }],

          'redundantAttribute': 'expr35',
          'selector': '[expr35]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jtooltip';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'tip',

            'evaluate': function(scope) {
              return scope.props.field.tip;
            }
          }],

          'redundantAttribute': 'expr36',
          'selector': '[expr36]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jaddon';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'field',

            'evaluate': function(scope) {
              return scope.props.field;
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'placement',

            'evaluate': function() {
              return 'left';
            }
          }],

          'redundantAttribute': 'expr37',
          'selector': '[expr37]'
        }, {
          'redundantAttribute': 'expr38',
          'selector': '[expr38]',

          'expressions': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': null,

            'evaluate': function(scope) {
              return scope.props.field;
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'class',

            'evaluate': function(scope) {
              return ['form-control ', scope.props.field.class].join('');
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'name',

            'evaluate': function(scope) {
              return scope.props.field.id;
            }
          }, {
            'type': expressionTypes.VALUE,

            'evaluate': function(scope) {
              return scope.props.field.value;
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'size',

            'evaluate': function(scope) {
              return scope.props.field.size;
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'id',

            'evaluate': function(scope) {
              return [].join('');
            }
          }]
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jaddon';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'field',

            'evaluate': function(scope) {
              return scope.props.field;
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'placement',

            'evaluate': function() {
              return 'right';
            }
          }],

          'redundantAttribute': 'expr39',
          'selector': '[expr39]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jhelp';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'help',

            'evaluate': function(scope) {
              return scope.props.field.help;
            }
          }],

          'redundantAttribute': 'expr40',
          'selector': '[expr40]'
        }]
      );
    },

    'name': 'ipassword'
  };

  var iradio = {
    'css': `iradio .fradio,[is="iradio"] .fradio{ display: block; position: relative; padding-left: 35px; margin-bottom: 12px; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; } iradio .fradio input,[is="iradio"] .fradio input{ position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; } iradio .fradiomark,[is="iradio"] .fradiomark{ position: absolute; top: 0; left: 0; height: 25px; width: 25px; background-color: #eee; border-radius: 50%; -webkit-transition: .4s; transition: .4s; } iradio .fradio:hover input~.fradiomark,[is="iradio"] .fradio:hover input~.fradiomark{ background-color: #ccc; } iradio .fradio input:checked~.fradiomark,[is="iradio"] .fradio input:checked~.fradiomark{ background-color: #2196F3; } iradio .fradiomark:after,[is="iradio"] .fradiomark:after{ content: ""; position: absolute; display: none; } iradio .fradio input:checked~.fradiomark:after,[is="iradio"] .fradio input:checked~.fradiomark:after{ display: block; } iradio .fradio .fradiomark:after,[is="iradio"] .fradio .fradiomark:after{ top: 8px; left: 8px; width: 9px; height: 9px; border-radius: 50%; background: white; }`,

    'exports': {
      components: {
          jaddon,
          jhelp,
          jicon,
          jlabel,
          jtooltip
      },

      isChecked(option) {
          return (option.checked || option.id == this.props.field.value)
      }
    },

    'template': function(template, expressionTypes, bindingTypes, getComponent) {
      return template(
        '<jlabel expr53></jlabel><jtooltip expr54></jtooltip><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><jhelp expr55></jhelp><div class="aaad-inline"><template expr56></template></div>',
        [{
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jlabel';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'field',

            'evaluate': function(scope) {
              return scope.props.field;
            }
          }],

          'redundantAttribute': 'expr53',
          'selector': '[expr53]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jtooltip';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'tip',

            'evaluate': function(scope) {
              return scope.props.field.tip;
            }
          }],

          'redundantAttribute': 'expr54',
          'selector': '[expr54]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jhelp';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'help',

            'evaluate': function(scope) {
              return scope.props.field.help;
            }
          }],

          'redundantAttribute': 'expr55',
          'selector': '[expr55]'
        }, {
          'type': bindingTypes.EACH,
          'getKey': null,
          'condition': null,

          'template': template(
            '<label expr57 class="fradio"><!----><jtooltip expr58></jtooltip><jhelp expr59></jhelp><input expr60 type="radio" class="form-control"/><span class="fradiomark"></span></label>',
            [{
              'redundantAttribute': 'expr57',
              'selector': '[expr57]',

              'expressions': [{
                'type': expressionTypes.TEXT,
                'childNodeIndex': 0,

                'evaluate': function(scope) {
                  return [scope.i18n(scope.option.label), '\r\n                '].join('');
                }
              }]
            }, {
              'type': bindingTypes.TAG,
              'getComponent': getComponent,

              'evaluate': function(scope) {
                return 'jtooltip';
              },

              'slots': [],

              'attributes': [{
                'type': expressionTypes.ATTRIBUTE,
                'name': 'tip',

                'evaluate': function(scope) {
                  return scope.option.tip;
                }
              }],

              'redundantAttribute': 'expr58',
              'selector': '[expr58]'
            }, {
              'type': bindingTypes.TAG,
              'getComponent': getComponent,

              'evaluate': function(scope) {
                return 'jhelp';
              },

              'slots': [],

              'attributes': [{
                'type': expressionTypes.ATTRIBUTE,
                'name': 'help',

                'evaluate': function(scope) {
                  return scope.option.help;
                }
              }],

              'redundantAttribute': 'expr59',
              'selector': '[expr59]'
            }, {
              'redundantAttribute': 'expr60',
              'selector': '[expr60]',

              'expressions': [{
                'type': expressionTypes.ATTRIBUTE,
                'name': null,

                'evaluate': function(scope) {
                  return scope.props.field;
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'checked',

                'evaluate': function(scope) {
                  return scope.isChecked(scope.option);
                }
              }, {
                'type': expressionTypes.VALUE,

                'evaluate': function(scope) {
                  return scope.option.id;
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'name',

                'evaluate': function(scope) {
                  return scope.props.field.id;
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'id',

                'evaluate': function(scope) {
                  return [].join('');
                }
              }]
            }]
          ),

          'redundantAttribute': 'expr56',
          'selector': '[expr56]',
          'itemName': 'option',
          'indexName': null,

          'evaluate': function(scope) {
            return scope.props.field.options;
          }
        }]
      );
    },

    'name': 'iradio'
  };

  var irange = {
    'css': `irange input[type=range]::-webkit-slider-thumb,[is="irange"] input[type=range]::-webkit-slider-thumb{ background: red; } irange input[type=range]::-moz-range-thumb,[is="irange"] input[type=range]::-moz-range-thumb{ background: red; } irange input[type=range]::-ms-thumb,[is="irange"] input[type=range]::-ms-thumb{ background: red; }`,

    'exports': {
      components: {
          jaddon,
          jhelp,
          jicon,
          jlabel,
          jtooltip
      }
    },

    'template': function(template, expressionTypes, bindingTypes, getComponent) {
      return template(
        '<jlabel expr31></jlabel><jtooltip expr32></jtooltip><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><div class="input-group"><input expr33 type="range"/></div><jhelp expr34></jhelp>',
        [{
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jlabel';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'field',

            'evaluate': function(scope) {
              return scope.props.field;
            }
          }],

          'redundantAttribute': 'expr31',
          'selector': '[expr31]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jtooltip';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'tip',

            'evaluate': function(scope) {
              return scope.props.field.tip;
            }
          }],

          'redundantAttribute': 'expr32',
          'selector': '[expr32]'
        }, {
          'redundantAttribute': 'expr33',
          'selector': '[expr33]',

          'expressions': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': null,

            'evaluate': function(scope) {
              return scope.props.field;
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'class',

            'evaluate': function(scope) {
              return ['form-control custom-range ', scope.props.field.class].join('');
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'name',

            'evaluate': function(scope) {
              return scope.props.field.id;
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'min',

            'evaluate': function(scope) {
              return scope.props.field.min;
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'max',

            'evaluate': function(scope) {
              return scope.props.field.max;
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'step',

            'evaluate': function(scope) {
              return scope.props.field.step;
            }
          }, {
            'type': expressionTypes.VALUE,

            'evaluate': function(scope) {
              return scope.props.field.value;
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'id',

            'evaluate': function(scope) {
              return [].join('');
            }
          }]
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jhelp';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'help',

            'evaluate': function(scope) {
              return scope.props.field.help;
            }
          }],

          'redundantAttribute': 'expr34',
          'selector': '[expr34]'
        }]
      );
    },

    'name': 'irange'
  };

  var irow = {
    'css': null,

    'exports': {
      checkField(field,i){
      field.id = field.id || 'ffield'+i;
      return field
  }
    },

    'template': function(template, expressionTypes, bindingTypes, getComponent) {
      return template('<div class="row"><template expr28></template></div>', [{
        'type': bindingTypes.EACH,
        'getKey': null,
        'condition': null,

        'template': template('<div expr29><div expr30></div></div>', [{
          'redundantAttribute': 'expr29',
          'selector': '[expr29]',

          'expressions': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'class',

            'evaluate': function(scope) {
              return ['col form-group ', scope.field.class].join('');
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'name',

            'evaluate': function(scope) {
              return ['fgroup_', scope.field.id || scope.i].join('');
            }
          }]
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'i'+scope.callType(scope.field.type);
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'field',

            'evaluate': function(scope) {
              return scope.checkField(scope.field,scope.i);
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'attr',

            'evaluate': function(scope) {
              return scope.props.attr;
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'index',

            'evaluate': function(scope) {
              return scope.i;
            }
          }],

          'redundantAttribute': 'expr30',
          'selector': '[expr30]'
        }]),

        'redundantAttribute': 'expr28',
        'selector': '[expr28]',
        'itemName': 'field',
        'indexName': 'i',

        'evaluate': function(scope) {
          return scope.props.field.desc;
        }
      }]);
    },

    'name': 'irow'
  };

  var iselect = {
    'css': null,

    'exports': {
      components: {
          jaddon,
          jhelp,
          jicon,
          jlabel,
          jtooltip
      },

      onMounted() {
          let formId = this.props.attr.id;
          if (this.props.field.multiple) {
              const choices = new Choices('[name="' + this.props.field.id + '"]', {
                  silent: true,
                  aaitems: [],
                  aachoices: [],
                  renderChoiceLimit: -1,
                  maxItemCount: -1,
                  addItems: true,
                  addItemFilterFn: null,
                  removeItems: true,
                  removeItemButton: true,
                  editItems: false,
                  duplicateItemsAllowed: false,
                  aaadelimiter: ',',
                  paste: true,
                  aaaasearchEnabled: true,
                  aaaaasearchChoices: true,
                  searchFloor: 1,
                  searchResultLimit: 4,
                  searchFields: ['label', 'value'],
                  position: 'auto',
                  resetScrollPosition: true,
                  shouldSort: false,
                  shouldSortItems: false,
                  sortFn: () => {},
                  placeholder: true,
                  placeholderValue: this.props.field.placeholder,
                  searchPlaceholderValue: null,
                  prependValue: null,
                  appendValue: null,
                  renderSelectedChoices: 'auto',
                  loadingText: 'Loading...',
                  noResultsText: 'No results found',
                  noChoicesText: 'No choices to choose from',
                  itemSelectText: 'Press to select',
                  addItemText: (value) => {
                      return `Press Enter to add <b>"${value}"</b>`;
                  },
                  maxItemText: (maxItemCount) => {
                      return `Only ${maxItemCount} values can be added`;
                  },
                  itemComparer: (choice, item) => {
                      return choice === item;
                  },
                  classNames: {
                      containerOuter: 'choices',
                      containerInner: 'choices__inner',
                      input: 'choices__input',
                      inputCloned: 'choices__input--cloned',
                      list: 'choices__list',
                      listItems: 'choices__list--multiple',
                      listSingle: 'choices__list--single',
                      listDropdown: 'choices__list--dropdown',
                      item: 'choices__item',
                      itemSelectable: 'choices__item--selectable',
                      itemDisabled: 'choices__item--disabled',
                      itemChoice: 'choices__item--choice',
                      placeholder: 'choices__placeholder',
                      group: 'choices__group',
                      groupHeading: 'choices__heading',
                      button: 'choices__button',
                      activeState: 'is-active',
                      focusState: 'is-focused',
                      openState: 'is-open',
                      disabledState: 'is-disabled',
                      highlightedState: 'is-highlighted',
                      hiddenState: 'is-hidden',
                      flippedState: 'is-flipped',
                      loadingState: 'is-loading',
                      noResults: 'has-no-results',
                      noChoices: 'has-no-choices'
                  },
                  // Choices uses the great Fuse library for searching. You
                  // can find more options here: https://github.com/krisk/Fuse#options
                  fuseOptions: {
                      include: 'score'
                  },
                  callbackOnInit: null,
                  callbackOnCreateTemplates: null
              });
          }
      },

      isSelected(option) {
          //console.log(option)
          return (option.selected || option.value == this.props.field.value || (Array.isArray(this.props.field.value) && this.props.field.value.indexOf(option.value) > -1))
      }
    },

    'template': function(template, expressionTypes, bindingTypes, getComponent) {
      return template(
        '<jlabel expr96></jlabel><jtooltip expr97></jtooltip><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><div expr98></div><div expr99></div><div class="input-group mb-3"><jaddon expr100 placement="left"></jaddon><select expr101><template expr102></template></select><jaddon expr104 placement="right"></jaddon></div><jhelp expr105></jhelp>',
        [{
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jlabel';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'field',

            'evaluate': function(scope) {
              return scope.props.field;
            }
          }],

          'redundantAttribute': 'expr96',
          'selector': '[expr96]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jtooltip';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'tip',

            'evaluate': function(scope) {
              return scope.props.field.tip;
            }
          }],

          'redundantAttribute': 'expr97',
          'selector': '[expr97]'
        }, {
          'redundantAttribute': 'expr98',
          'selector': '[expr98]',

          'expressions': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'name',

            'evaluate': function(scope) {
              return "colorpicker_" + scope.props.field.id;
            }
          }]
        }, {
          'redundantAttribute': 'expr99',
          'selector': '[expr99]',

          'expressions': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'name',

            'evaluate': function(scope) {
              return scope.props.attr.id +"_select_" + scope.props.field.id;
            }
          }]
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jaddon';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'field',

            'evaluate': function(scope) {
              return scope.props.field;
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'placement',

            'evaluate': function() {
              return 'left';
            }
          }],

          'redundantAttribute': 'expr100',
          'selector': '[expr100]'
        }, {
          'redundantAttribute': 'expr101',
          'selector': '[expr101]',

          'expressions': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': null,

            'evaluate': function(scope) {
              return scope.props.field;
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'multiple',

            'evaluate': function(scope) {
              return scope.props.field.multiple;
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'class',

            'evaluate': function(scope) {
              return ['form-control ', scope.props.field.class].join('');
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'name',

            'evaluate': function(scope) {
              return scope.props.field.id;
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'id',

            'evaluate': function(scope) {
              return [].join('');
            }
          }]
        }, {
          'type': bindingTypes.EACH,
          'getKey': null,
          'condition': null,

          'template': template('<option expr103><!----></option>', [{
            'redundantAttribute': 'expr103',
            'selector': '[expr103]',

            'expressions': [{
              'type': expressionTypes.TEXT,
              'childNodeIndex': 0,

              'evaluate': function(scope) {
                return [
                  '\r\n                    ',
                  scope.i18n(scope.option.label),
                  '\r\n                '
                ].join('');
              }
            }, {
              'type': expressionTypes.VALUE,

              'evaluate': function(scope) {
                return scope.option.value;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'selected',

              'evaluate': function(scope) {
                return scope.isSelected(scope.option);
              }
            }]
          }]),

          'redundantAttribute': 'expr102',
          'selector': '[expr102]',
          'itemName': 'option',
          'indexName': null,

          'evaluate': function(scope) {
            return scope.props.field.options;
          }
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jaddon';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'field',

            'evaluate': function(scope) {
              return scope.props.field;
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'placement',

            'evaluate': function() {
              return 'right';
            }
          }],

          'redundantAttribute': 'expr104',
          'selector': '[expr104]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jhelp';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'help',

            'evaluate': function(scope) {
              return scope.props.field.help;
            }
          }],

          'redundantAttribute': 'expr105',
          'selector': '[expr105]'
        }]
      );
    },

    'name': 'iselect'
  };

  var itext = {
    'css': null,

    'exports': {
      components: {
          jaddon,
          jhelp,
          jicon,
          jlabel,
          jtooltip
      },

      onBeforeMount() {
          this.state.currentLang = this.props.attr.langs[0];
          this.state.defaultLang = this.props.attr.langs[0];
          if (this.props.field.multilang) {
              this.state.langs = this.props.attr.langs;
          } else {
              this.state.langs = [''];
          }
          if (this.props.type == 'datetime') this.state.type = 'datetime-local';
          else this.state.type = this.props.field.type;
      },

      btnLangColor(lang) {
          return lang == this.state.currentLang ? 'btn-secondary' : 'btn-light'
      },

      buildId(lang) {
          return this.props.field.multilang ? this.props.field.id + '.' + lang : this.props.field.id
      },

      defaultValue() {
          if (this.state.currentLang == this.props.attr.langs[0]) return this.props.field.value
          else return null
      },

      selectLang(ev) {
          this.state.currentLang = ev.target.attributes.idLang.value;
          this.update();
      }
    },

    'template': function(template, expressionTypes, bindingTypes, getComponent) {
      return template(
        '<jlabel expr41></jlabel><jtooltip expr42></jtooltip><template expr43></template><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><div expr45></div><jhelp expr52></jhelp>',
        [{
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jlabel';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'field',

            'evaluate': function(scope) {
              return scope.props.field;
            }
          }],

          'redundantAttribute': 'expr41',
          'selector': '[expr41]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jtooltip';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'tip',

            'evaluate': function(scope) {
              return scope.props.field.tip;
            }
          }],

          'redundantAttribute': 'expr42',
          'selector': '[expr42]'
        }, {
          'type': bindingTypes.EACH,
          'getKey': null,

          'condition': function(scope) {
            return scope.props.field.multilang;
          },

          'template': template(
            '<button expr44 type="button" style="text-transform: capitalize;"><!----><span class="aaainputFeedback"></span></button>',
            [{
              'redundantAttribute': 'expr44',
              'selector': '[expr44]',

              'expressions': [{
                'type': expressionTypes.TEXT,
                'childNodeIndex': 0,

                'evaluate': function(scope) {
                  return [scope.langName(scope.lang), ' '].join('');
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'class',

                'evaluate': function(scope) {
                  return ['btn ', scope.btnLangColor(scope.lang), ' btn-sm ml-1'].join('');
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'idLang',

                'evaluate': function(scope) {
                  return scope.lang;
                }
              }, {
                'type': expressionTypes.EVENT,
                'name': 'onclick',

                'evaluate': function(scope) {
                  return scope.selectLang;
                }
              }]
            }]
          ),

          'redundantAttribute': 'expr43',
          'selector': '[expr43]',
          'itemName': 'lang',
          'indexName': null,

          'evaluate': function(scope) {
            return scope.props.attr.langs;
          }
        }, {
          'type': bindingTypes.EACH,
          'getKey': null,
          'condition': null,

          'template': template(
            '<jaddon expr46 placement="left"></jaddon><input expr47/><textarea expr48></textarea><div expr49 class="h-100 input-group-append"></div><jaddon expr51 placement="right"></jaddon>',
            [{
              'expressions': [{
                'type': expressionTypes.ATTRIBUTE,
                'name': 'class',

                'evaluate': function(scope) {
                  return [
                    'input-group ',
                    scope.lang==scope.state.currentLang || !scope.lang?'':'hide'
                  ].join('');
                }
              }]
            }, {
              'type': bindingTypes.TAG,
              'getComponent': getComponent,

              'evaluate': function(scope) {
                return 'jaddon';
              },

              'slots': [],

              'attributes': [{
                'type': expressionTypes.ATTRIBUTE,
                'name': 'field',

                'evaluate': function(scope) {
                  return scope.props.field;
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'placement',

                'evaluate': function() {
                  return 'left';
                }
              }],

              'redundantAttribute': 'expr46',
              'selector': '[expr46]'
            }, {
              'type': bindingTypes.IF,

              'evaluate': function(scope) {
                return scope.props.field.type!='textarea';
              },

              'redundantAttribute': 'expr47',
              'selector': '[expr47]',

              'template': template(null, [{
                'expressions': [{
                  'type': expressionTypes.ATTRIBUTE,
                  'name': null,

                  'evaluate': function(scope) {
                    return scope.props.field;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'aaatabindex',

                  'evaluate': function(scope) {
                    return scope.props.index;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'type',

                  'evaluate': function(scope) {
                    return scope.state.type;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'class',

                  'evaluate': function(scope) {
                    return ['form-control ', scope.props.field.class].join('');
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'defaultLang',

                  'evaluate': function(scope) {
                    return scope.state.defaultLang;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'lang',

                  'evaluate': function(scope) {
                    return scope.lang;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'baseId',

                  'evaluate': function(scope) {
                    return scope.props.field.id;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'name',

                  'evaluate': function(scope) {
                    return scope.buildId(scope.lang);
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'value',

                  'evaluate': function(scope) {
                    return scope.props.field.value;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'id',

                  'evaluate': function(scope) {
                    return [].join('');
                  }
                }]
              }])
            }, {
              'type': bindingTypes.IF,

              'evaluate': function(scope) {
                return scope.props.field.type=='textarea';
              },

              'redundantAttribute': 'expr48',
              'selector': '[expr48]',

              'template': template('<!---->', [{
                'expressions': [{
                  'type': expressionTypes.TEXT,
                  'childNodeIndex': 0,

                  'evaluate': function(scope) {
                    return scope.props.field.value;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': null,

                  'evaluate': function(scope) {
                    return scope.props.field;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'aaatabindex',

                  'evaluate': function(scope) {
                    return scope.props.index;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'class',

                  'evaluate': function(scope) {
                    return ['form-control ', scope.props.field.class].join('');
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'rows',

                  'evaluate': function(scope) {
                    return scope.props.field.rows || 8;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'defaultLang',

                  'evaluate': function(scope) {
                    return scope.state.defaultLang;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'lang',

                  'evaluate': function(scope) {
                    return scope.lang;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'baseId',

                  'evaluate': function(scope) {
                    return scope.props.field.id;
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'name',

                  'evaluate': function(scope) {
                    return scope.buildId(scope.lang);
                  }
                }, {
                  'type': expressionTypes.ATTRIBUTE,
                  'name': 'id',

                  'evaluate': function(scope) {
                    return [].join('');
                  }
                }]
              }])
            }, {
              'type': bindingTypes.IF,

              'evaluate': function(scope) {
                return scope.props.field.multilang && scope.props.attr.proposeTranslate && scope.state.defaultLang !=scope.lang;
              },

              'redundantAttribute': 'expr49',
              'selector': '[expr49]',

              'template': template(
                '<button expr50 type="button" class="btn btn-info"><i class="fas fa-language"></i></button>',
                [{
                  'redundantAttribute': 'expr50',
                  'selector': '[expr50]',

                  'expressions': [{
                    'type': expressionTypes.EVENT,
                    'name': 'onclick',

                    'evaluate': function(scope) {
                      return scope.translate;
                    }
                  }]
                }]
              )
            }, {
              'type': bindingTypes.TAG,
              'getComponent': getComponent,

              'evaluate': function(scope) {
                return 'jaddon';
              },

              'slots': [],

              'attributes': [{
                'type': expressionTypes.ATTRIBUTE,
                'name': 'field',

                'evaluate': function(scope) {
                  return scope.props.field;
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'placement',

                'evaluate': function() {
                  return 'right';
                }
              }],

              'redundantAttribute': 'expr51',
              'selector': '[expr51]'
            }]
          ),

          'redundantAttribute': 'expr45',
          'selector': '[expr45]',
          'itemName': 'lang',
          'indexName': null,

          'evaluate': function(scope) {
            return scope.state.langs;
          }
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jhelp';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'help',

            'evaluate': function(scope) {
              return scope.props.field.help;
            }
          }],

          'redundantAttribute': 'expr52',
          'selector': '[expr52]'
        }]
      );
    },

    'name': 'itext'
  };

  var itexteditor = {
    'css': null,

    'exports': {
      components: {
          jaddon,
          jhelp,
          jicon,
          jlabel,
          jtooltip
      },

      onBeforeMount() {
          this.state.currentLang = this.props.attr.langs[0];
          this.state.defaultLang = this.props.attr.langs[0];
          if (this.props.field.multilang) {
              this.state.langs = this.props.attr.langs;
          } else {
              this.state.langs = [''];
          }
          if (this.props.type == 'datetime') this.state.type = 'datetime-local';
          else this.state.type = this.props.field.type;
      },

      onMounted() {
              //https://quilljs.com/

              var container = '.texteditor';
              var editor = new Quill(container, {
                  modules: {
                      toolbar: [
                          [{
                              header: [1, 2, false]
                          }],
                          ['bold', 'italic', 'underline'],
                          ['image', 'code-block']
                      ]
                  },
                  theme: 'snow'
              });
          },

      btnLangColor(lang) {
          return lang == this.state.currentLang ? 'btn-secondary' : 'btn-light'
      },

      buildId(lang) {
          return this.props.field.multilang ? this.props.field.id + '.' + lang : this.props.field.id
      },

      defaultValue() {
          if (this.state.currentLang == this.props.attr.langs[0]) return this.props.field.value
          else return null
      },

      selectLang(ev) {
          this.state.currentLang = ev.target.attributes.idLang.value;
          this.update();
      }
    },

    'template': function(template, expressionTypes, bindingTypes, getComponent) {
      return template(
        '<jlabel expr80></jlabel><jtooltip expr81></jtooltip><template expr82></template><span class="inputFeedback"></span><small class="inputFeedbackMsg"></small><div expr84></div><jhelp expr89></jhelp>',
        [{
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jlabel';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'field',

            'evaluate': function(scope) {
              return scope.props.field;
            }
          }],

          'redundantAttribute': 'expr80',
          'selector': '[expr80]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jtooltip';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'tip',

            'evaluate': function(scope) {
              return scope.props.field.tip;
            }
          }],

          'redundantAttribute': 'expr81',
          'selector': '[expr81]'
        }, {
          'type': bindingTypes.EACH,
          'getKey': null,

          'condition': function(scope) {
            return scope.props.field.multilang;
          },

          'template': template(
            '<button expr83 type="button" style="text-transform: capitalize;"><!----><span class="aaainputFeedback"></span></button>',
            [{
              'redundantAttribute': 'expr83',
              'selector': '[expr83]',

              'expressions': [{
                'type': expressionTypes.TEXT,
                'childNodeIndex': 0,

                'evaluate': function(scope) {
                  return [scope.langName(scope.lang), ' '].join('');
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'class',

                'evaluate': function(scope) {
                  return ['btn ', scope.btnLangColor(scope.lang), ' btn-sm ml-1'].join('');
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'idLang',

                'evaluate': function(scope) {
                  return scope.lang;
                }
              }, {
                'type': expressionTypes.EVENT,
                'name': 'onclick',

                'evaluate': function(scope) {
                  return scope.selectLang;
                }
              }]
            }]
          ),

          'redundantAttribute': 'expr82',
          'selector': '[expr82]',
          'itemName': 'lang',
          'indexName': null,

          'evaluate': function(scope) {
            return scope.props.attr.langs;
          }
        }, {
          'type': bindingTypes.EACH,
          'getKey': null,
          'condition': null,

          'template': template(
            '<div class="texteditor"></div><input expr85 type="hidden" class="form-control"/><input id="x" value="Editor content goes here" type="hidden" name="content"/><trix-editor expr86 input="x"></trix-editor><div expr87 class="h-100 input-group-append"></div>',
            [{
              'expressions': [{
                'type': expressionTypes.ATTRIBUTE,
                'name': 'class',

                'evaluate': function(scope) {
                  return [
                    'ianput-group ',
                    scope.lang==scope.state.currentLang || !scope.lang?'':'hide'
                  ].join('');
                }
              }]
            }, {
              'redundantAttribute': 'expr85',
              'selector': '[expr85]',

              'expressions': [{
                'type': expressionTypes.ATTRIBUTE,
                'name': 'defaultLang',

                'evaluate': function(scope) {
                  return scope.state.defaultLang;
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'lang',

                'evaluate': function(scope) {
                  return scope.lang;
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'baseId',

                'evaluate': function(scope) {
                  return scope.props.field.id;
                }
              }, {
                'type': expressionTypes.ATTRIBUTE,
                'name': 'name',

                'evaluate': function(scope) {
                  return scope.buildId(scope.lang);
                }
              }, {
                'type': expressionTypes.VALUE,

                'evaluate': function(scope) {
                  return scope.props.field.value;
                }
              }]
            }, {
              'type': bindingTypes.TAG,
              'getComponent': getComponent,

              'evaluate': function(scope) {
                return 'trix-editor';
              },

              'slots': [],

              'attributes': [{
                'type': expressionTypes.ATTRIBUTE,
                'name': 'input',

                'evaluate': function() {
                  return 'x';
                }
              }],

              'redundantAttribute': 'expr86',
              'selector': '[expr86]'
            }, {
              'type': bindingTypes.IF,

              'evaluate': function(scope) {
                return scope.props.field.multilang && scope.props.attr.proposeTranslate && scope.state.defaultLang !=scope.lang;
              },

              'redundantAttribute': 'expr87',
              'selector': '[expr87]',

              'template': template(
                '<button expr88 type="button" class="btn btn-info"><i class="fas fa-language"></i></button>',
                [{
                  'redundantAttribute': 'expr88',
                  'selector': '[expr88]',

                  'expressions': [{
                    'type': expressionTypes.EVENT,
                    'name': 'onclick',

                    'evaluate': function(scope) {
                      return scope.translate;
                    }
                  }]
                }]
              )
            }]
          ),

          'redundantAttribute': 'expr84',
          'selector': '[expr84]',
          'itemName': 'lang',
          'indexName': null,

          'evaluate': function(scope) {
            return scope.state.langs;
          }
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jhelp';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'help',

            'evaluate': function(scope) {
              return scope.props.field.help;
            }
          }],

          'redundantAttribute': 'expr89',
          'selector': '[expr89]'
        }]
      );
    },

    'name': 'itexteditor'
  };

  var ititle = {
    'css': `ititle .ftitle,[is="ititle"] .ftitle{ font-size:3rem; }`,

    'exports': {
      components: {
          jaddon,
          jhelp,
          jicon,
          jlabel,
          jtooltip
      }
    },

    'template': function(template, expressionTypes, bindingTypes, getComponent) {
      return template(
        '<div expr90><jicon expr91></jicon><!----><small><jtooltip expr92></jtooltip></small></div><jhelp expr93></jhelp>',
        [{
          'redundantAttribute': 'expr90',
          'selector': '[expr90]',

          'expressions': [{
            'type': expressionTypes.TEXT,
            'childNodeIndex': 1,

            'evaluate': function(scope) {
              return ['\r\n        ', scope.i18n(scope.props.field.title), '\r\n        '].join('');
            }
          }, {
            'type': expressionTypes.ATTRIBUTE,
            'name': 'class',

            'evaluate': function(scope) {
              return ['ftitle ', scope.props.field.class].join('');
            }
          }]
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jicon';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'field',

            'evaluate': function(scope) {
              return scope.props.field;
            }
          }],

          'redundantAttribute': 'expr91',
          'selector': '[expr91]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jtooltip';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'tip',

            'evaluate': function(scope) {
              return scope.props.field.tip;
            }
          }],

          'redundantAttribute': 'expr92',
          'selector': '[expr92]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'jhelp';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'help',

            'evaluate': function(scope) {
              return scope.props.field.help;
            }
          }],

          'redundantAttribute': 'expr93',
          'selector': '[expr93]'
        }]
      );
    },

    'name': 'ititle'
  };

  //import {getFormValues,setFormValues} from './formr.js'

  var Formr = {
    'css': `formr .out,[is="formr"] .out{ -webkit-transition: height 1s; -moz-transition: height 1s; -ms-transition: height 1s; -o-transition: height 1s; transition: height 1s; height: 0; } formr .hide,[is="formr"] .hide,formr .form-inline .hide,[is="formr"] .form-inline .hide{ display: none; } formr .form-group,[is="formr"] .form-group{ margin-bottom: 1.5rem; } formr label,[is="formr"] label{ font-size: 1.1rem; font-weight: 500; } formr button:disabled,[is="formr"] button:disabled{ cursor: not-allowed; } formr button:focus,[is="formr"] button:focus,formr input:focus,[is="formr"] input:focus,formr textarea:focus,[is="formr"] textarea:focus{ outline: none !important; border-color: #719ECE !important; box-shadow: 0 0 10px #719ECE !important; } formr .fucfirst:first-letter,[is="formr"] .fucfirst:first-letter{ text-transform: capitalize; }`,

    'exports': {
      components: {
  				ialert,ibutton,icheckbox,icolorpicker,ihidden,ihr,ipassword,iradio,irange,irow,iselect,itext,itexteditor,ititle,jaddon,jhelp,jicon,jlabel,jtooltip
        },

      checkField(field, i) {
          field.id = field.id || 'ffield' + i;
          return field
      },

      onBeforeMount() {
      console.log(window);
          this.state.desc = window.fields[this.props.id].desc;
          this.state.attr = window.fields[this.props.id].attr;
          this.state.attr.id = this.props.id;
      },

      onMounted(){
          this.ctrlRun(this.props.id);
      },

      callType(type) {
          let types = ['textarea', 'date', 'color', 'datetime', 'datetime-local', 'email', 'month', 'number', 'tel', 'time', 'url', 'week'];
          if (types.indexOf(type) > -1) return 'text'
          else return type
      },

      click() {
          this.fields.push({
              type: 'text',
              size: 10,
              value: 'First item'
          });
          this.update();
      },

      validate(ev) {
          let targetForm=ev.target.closest("form");
          this.ctrlRun(targetForm.name);
          let invalidFeedback = '<i class="text-danger fas fa-times fa-fw mx-2" aria-hidden="true"></i>';
          let invalidFeedbackMsg = '<i class="text-danger fas fa-exclamation-triangle fa-fw mx-2" aria-hidden="true"></i>';
          let validFeedback = '<i class="text-success fas fa-check fa-fw mx-2" aria-hidden="true"></i>';
          let feedBackElt = ev.target.closest(".form-group").querySelector(".inputFeedback");
          let feedBackMsgElt = ev.target.closest(".form-group").querySelector(".inputFeedbackMsg");
          let field = ev.target;
          let validity = ev.target.validity;
          if (!validity) return
          let isValid = validity.valid;

          let msgs = [];
          let msg = '';
          if (field.disabled || field.type == 'file') return
          if (validity.valueMissing) msgs.push('valueMissing');
          if (validity.typeMismatch && field.type == 'email') msgs.push('invalid email');
          if (validity.typeMismatch && field.type == 'url') msgs.push('invalid URL');
          if (validity.tooShort) msgs.push('Lengthen this text to ' + field.minLength + ' characters or more. You are currently using ' + field.value.length + ' characters');
          if (validity.tooLong) msgs.push('Shorten this text to no more than ' + field.maxLength + ' characters. You are currently using ' + field.value.length + ' characters');
          if (validity.badInput) msgs.push('invalid number');
          if (validity.stepMismatch) msgs.push('invalid step');
          if (validity.rangeOverflow) msgs.push('Select a value that is no more than ' + field.max);
          if (validity.rangeUnderflow) msgs.push('Select a value that is no less than ' + field.min);
          if (validity.patternMismatch && field.getAttribute('patternInfo')) msgs.push(field.getAttribute('patternInfo')); // If pattern info is included, return custom error
          if (validity.patternMismatch && !field.getAttribute('patternInfo')) msgs.push("Didn't the requested format");
          let self = this;
          msgs.forEach(function(m) {
              msg += invalidFeedbackMsg + self.i18n(m) + '. ';
          });
          // If all else fails, msg is a generic catchall error
          if (!isValid && !msg) msg = 'The value you entered for this field is invalid. ';
          feedBackElt.innerHTML = (isValid ? validFeedback : invalidFeedback);
          feedBackMsgElt.innerHTML = isValid ? '' : msg;

          //enable buttons with attributes 'waitValid' if all fields in the form is valid
          let nbInvalidFields = targetForm.querySelectorAll('.form-control:invalid');
          let nwaitValid = targetForm.querySelectorAll('[waitvalid]');
          nwaitValid.forEach(function(e) {
              e.disabled = nbInvalidFields.length;
          });
      },

      ctrlRun(formName) {
  				let node; 
          document.getElementsByName(formName)[0].querySelectorAll("input[ctrlChecked][ctrlUnchecked]").forEach(function(elt) {
              elt.getAttribute("ctrlChecked").split(',').forEach(function(name) {
                  //node = '[name=fgroup_' + name+']'
                  name = 'fgroup_' + name;
                  node = document.getElementsByName(name)[0];
                  if (elt.checked) node.classList.remove('hide');
                  else node.classList.add('hide');
              });
              elt.getAttribute("ctrlUnchecked").split(',').forEach(function(name) {
                  name = 'fgroup_' + name;
                  node = document.getElementsByName(name)[0];
                  if (elt.checked) node.classList.add('hide');
                  else node.classList.remove('hide');
              });
          });
      },

      er() {
          console.log(getFormValues('form1'));
      },

      seter() {
          console.log(setFormValues('form1',data));
      }
    },

    'template': function(template, expressionTypes, bindingTypes, getComponent) {
      return template(
        '<form expr2 novalidate><button expr3 type="button">Go</button><button expr4 type="button">set</button><div expr5></div></form>',
        [{
          'redundantAttribute': 'expr2',
          'selector': '[expr2]',

          'expressions': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'name',

            'evaluate': function(scope) {
              return scope.props.id;
            }
          }, {
            'type': expressionTypes.EVENT,
            'name': 'onchange',

            'evaluate': function(scope) {
              return scope.validate;
            }
          }, {
            'type': expressionTypes.EVENT,
            'name': 'oninput',

            'evaluate': function(scope) {
              return scope.validate;
            }
          }]
        }, {
          'redundantAttribute': 'expr3',
          'selector': '[expr3]',

          'expressions': [{
            'type': expressionTypes.EVENT,
            'name': 'onclick',

            'evaluate': function(scope) {
              return scope.er;
            }
          }]
        }, {
          'redundantAttribute': 'expr4',
          'selector': '[expr4]',

          'expressions': [{
            'type': expressionTypes.EVENT,
            'name': 'onclick',

            'evaluate': function(scope) {
              return scope.seter;
            }
          }]
        }, {
          'type': bindingTypes.EACH,
          'getKey': null,
          'condition': null,

          'template': template('<div expr6 class="form-group"><div expr7></div></div>', [{
            'redundantAttribute': 'expr6',
            'selector': '[expr6]',

            'expressions': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'name',

              'evaluate': function(scope) {
                return ['fgroup_', scope.field.id || scope.i].join('');
              }
            }]
          }, {
            'type': bindingTypes.TAG,
            'getComponent': getComponent,

            'evaluate': function(scope) {
              return 'i'+scope.callType(scope.field.type);
            },

            'slots': [],

            'attributes': [{
              'type': expressionTypes.ATTRIBUTE,
              'name': 'field',

              'evaluate': function(scope) {
                return scope.checkField(scope.field,scope.i);
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'attr',

              'evaluate': function(scope) {
                return scope.state.attr;
              }
            }, {
              'type': expressionTypes.ATTRIBUTE,
              'name': 'index',

              'evaluate': function(scope) {
                return scope.i;
              }
            }],

            'redundantAttribute': 'expr7',
            'selector': '[expr7]'
          }]),

          'redundantAttribute': 'expr5',
          'selector': '[expr5]',
          'itemName': 'field',
          'indexName': 'i',

          'evaluate': function(scope) {
            return scope.state.desc;
          }
        }]
      );
    },

    'name': 'formr'
  };

  var App = {
    'css': null,

    'exports': {
      components: {
          Formr
      }
    },

    'template': function(template, expressionTypes, bindingTypes, getComponent) {
      return template(
        '<div class="container"><formr expr0 id="form1"></formr><formr expr1 id="form2"></formr></div>',
        [{
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'formr';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'id',

            'evaluate': function() {
              return 'form1';
            }
          }],

          'redundantAttribute': 'expr0',
          'selector': '[expr0]'
        }, {
          'type': bindingTypes.TAG,
          'getComponent': getComponent,

          'evaluate': function(scope) {
            return 'formr';
          },

          'slots': [],

          'attributes': [{
            'type': expressionTypes.ATTRIBUTE,
            'name': 'id',

            'evaluate': function() {
              return 'form2';
            }
          }],

          'redundantAttribute': 'expr1',
          'selector': '[expr1]'
        }]
      );
    },

    'name': 'app'
  };

  install(function (component) {
      window.addEventListener('updateAll', () => {
          component.update();
      });
      component.updateAll = function () {
          window.dispatchEvent(new Event('updateAll'));
      };
      component.i18n = function (id) {
          return id
      };
      component.langName = function (id) {
          const langs = {
              fr: 'français',
              en: 'English'
          };
          return langs[id] || id
      };
      component.selectIcon = function (field) {
          var ret, id = '',
              type = '';
          if (field.icon && field.icon != 'none') return field.icon
          if (field.id) id = field.id.toLowerCase();
          if (field.type) type = field.type;
          if (field.onclick && !type) type = 'button';
          let autoIcons = {
              tags: 'fas fa-tags',
              logon: 'fas fa-user',
              address: 'fas fa-map-marker-alt',
              name: 'fas fa-user',
              url: 'fas fa-user',
              lang: 'fas fa-language',
              google: 'fab fa-google',
              twitter: 'twitter',
              facebook: 'fab fa-facebook',
              datetimepicker: 'fas fa-calendar-alt',
              date: 'fas fa-calendar-alt',
              month: 'fas fa-calendar-alt',
              datetime: 'fas fa-calendar-alt',
              tel: 'fas fa-phone',
              mail: 'fas fa-envelope',
              email: 'fas fa-envelope',
              password: 'fas fa-key',
              number: 'fas fa-list-ol',
              button: 'fas fa-mouse-pointer'
          };
          for (var possibleId in autoIcons) {
              if (id.indexOf(possibleId) != -1 ||
                  type.indexOf(possibleId) != -1
              ) return autoIcons[possibleId]
          }
          if (!ret) ret = 'fas fa-greater-than';
          return ret
      };
      component.callType = function (type) {
          let types = {
              text: ['text', 'textarea', 'date', 'color', 'datetime', 'datetime-local', 'email', 'month', 'number', 'tel', 'time', 'url', 'week'],
              checkbox: ['checkbox', 'switch']
          };
          if (types.text.indexOf(type) > -1) return 'text'
          if (types.checkbox.indexOf(type) > -1) return 'checkbox'
          return type
      };
      component.translate = function (ev) {
          let elt = ev.target.closest(".input-group").querySelector(".form-control");
          let defaultLang = elt.getAttribute('defaultLang');
          let lang = elt.getAttribute('lang');
          let eltFromId = elt.getAttribute('baseId') + '.' + defaultLang;
          console.log(eltFromId, defaultLang, lang);
          let eltFromValue = ev.target.closest(".form-group").querySelector('[name="' + eltFromId + '"]').value;
          //console.log(ev.target.closest(".form-group").querySelector('[name="'+eltFromId+'"]').getAttribute('name'))
          elt.value = 'Transalion : ' + defaultLang + ' to ' + lang + ':' + eltFromValue;
      };
  });


  function getFormValues$1(formId) {
      var data = {};
      let inputs = document.getElementsByName(formId)[0].querySelectorAll('.form-control');
      inputs.forEach(function (input) {
          let type = input.type;
          switch (type) {
              case 'checkbox':
                  if (input.checked) field(data, input.name, input.getAttribute('checkedValue') || true);
                  else field(data, input.name, input.getAttribute('uncheckedValue') || false);
                  break
              case 'select-multiple': //this is a special type property of dom  : https://www.w3schools.com/jsref/prop_select_type.asp
                  field(data, input.name, [...input.options].filter((x) => x.selected).map((x) => x.value));
                  break
              case 'radio':
                  if (input.checked) field(data, input.name, input.value);
                  if (!field(data, input.name)) field(data, input.name, null);
                  break
              default: //text, select-one, password, hidden, email, tel, textarea...... all others
                  field(data, input.name, input.value);
          }
      });
      return data
  }

  function setFormValues$1(formId, data) {
      let inputs = document.getElementsByName(formId)[0].querySelectorAll('.form-control');
      inputs.forEach(function (input) {
          let type = input.type;
          let val = field(data, input.name);
          switch (type) {
              case 'checkbox':
                  input.checked = (input.checkedValue == val && input.uncheckedValue != val) || val;
                  break
              case 'select-multiple':
                  Array.prototype.forEach.call(input.options, function (opt) {
                      opt.selected = (val.indexOf(opt.value) > -1);
                  });
                  break
              default: //radio, select-one' text, password, hidden, email, tel, textarea...... all others
                  input.value = val;

                  //console.log(input.closest(".form-group").querySelector(".pcr-button").setColor(val,true))
                  var setColorEvent = new CustomEvent(formId + '_setColor_' + input.name, {
                      detail: {
                          color: val
                      }
                  });
                  document.dispatchEvent(setColorEvent);
                  //+color, editor, image
          }
      });
      return data
  }

  function field(obj, fieldPath, value) {
      // split the field into tokens
      if (obj === undefined || fieldPath === undefined || obj === null) return
      var tokens = fieldPath.split('.');
      // if there's more than one token, this field is an object
      if (tokens.length > 1) {
          var subObj = tokens[0];
          // define the object
          if (!obj[subObj]) obj[subObj] = {};
          // call field again on the embedded object
          var firstDot = fieldPath.indexOf('.');
          return field(obj[subObj], fieldPath.substr(firstDot + 1), value);
      } else {
          var arr = fieldPath.split('[');
          if (arr.length > 1) {
              if (!obj[arr[0]]) obj[arr[0]] = [];
              if (value !== undefined) obj[arr[0]].push(value);
              else return obj[arr[0]][arr[1].slice(0, -1)] //remove last char or arr[1] that must be a ']'
          } else {
              if (value !== undefined) obj[fieldPath] = value; // no embedded objects, just fieldPath assignment
              else return obj[fieldPath]
          }
      }
  }

  var exports$1 = /*#__PURE__*/Object.freeze({
    getFormValues: getFormValues$1,
    setFormValues: setFormValues$1,
    field: field
  });

  Object.entries(exports$1).forEach(([name, exported]) => window[name] = exported);


   
          window.data = {
              checboxTransport: {
                  car: false,
                  bus: true
              },
              emailInrRow: "emailInrRow changed",
              fallDescription: {
                  fr: "fallDescription fr",
                  en: "fallDescription en"
              },
              mayrange: 10,
              flyDescription: {
                  fr: "flyDescriptionf fr",
                  en: "flyDescription en"
              },
              genre: "boy",
              music: ["piano"],
              mycolor: "blue",
              mydate: "date changed",
              mypassword: "mypassword changrd",
              mytextarea: {
                  fr: "mytextarea fr",
                  en: "mytextarea en"
              },
              mytextedit: {
                  fr: "mytextedit fr",
                  en: "mytextedit en"
              },
              mytextwithbuttons: "mytextwithbuttons changed",
              passwordInRow: "passwordInRow changed",
              radioAnimal: "cat",
              switchTest: {
                  bird: "fall",
                  snake: false,
                  elephant: true
              },
              switchTestAlone: "fall_alone"
          };








          window.fields = {
              form1: {
                  attr: {
                      lang: 'fr',
                      langs: ['fr', 'en'],
                      proposeTranslate: true
                  },
                  desc: [{
                          type: 'title',
                          title: 'Hello',
                          icon: 'fas fa-skull-crossbones',
                          help: 'Help Please verify your info before',
                      },
                      {
                          type: 'alert',
                          color: 'danger',
                          message: "Ceci est un message d'alerte",
                          icon: 'fas fa-exclamation-triangle',
                          tip: 'Tip Please verify your info before',
                          help: 'Help Please verify your info before',
                      },
                      {
                          id: 'genre',
                          type: 'select',
                          label: 'Genre',
                          value: 'girl',
                          tip: 'Tip Please verify your info before',
                          help: 'Help Please verify your info before',
                          options: [{
                                  label: 'Garcon',
                                  value: 'boy'
                              },
                              {
                                  label: 'Fille',
                                  value: 'girl'
                              }
                          ]
                      },
                      {
                          id: 'music',
                          type: 'select',
                          multiple: true,
                          label: 'Musique',
                          required: true,
                          value: ['guitar'],
                          tip: 'Tip Please verify your info before',
                          help: 'Help Please verify your info before',
                          options: [{
                                  label: 'Piano',
                                  value: 'piano'
                              },
                              {
                                  label: 'Guitare',
                                  value: 'guitar',
                                  aaaselected: true
                              }
                          ]
                      },
                      {
                          id: 'mycolor',
                          label: 'Couleur principale',
                          type: 'colorpicker',
                          tip: 'Tip Please verify your info before',
                          help: 'Help Please verify your info before',
                          value: 'red'
                      },
                      {
                          id: 'mytextedit',
                          label: 'Texte principal',
                          type: 'texteditor',
                          multilang: true,
                          proposeTranslate: true,
                          tip: 'Tip Please verify your info before',
                          help: 'Help Please verify your info before',
                          value: 'Mon premier text'
                      },
                      {
                          id: 'mytextarea',
                          type: 'textarea',
                          rows: 8,
                          value: 'Eheh l\'ami quoi de neuf c\'est long tout ce tete sinon <h2>ca va? la fa</h2>mille? les amis? la santé? bonsoir enfin au revoir anticonstitutionnelement ;) bisous',
                          label: 'Lettre pour chirac',
                          multilang: true,
                          required: true,
                          icon: 'fas fa-running',
                          tip: 'Il faut bien écrire vous avez affaire avec un président',
                          help: 'Help Please verify your info before'
                      },
                      {
                          id: 'mayrange',
                          icon: 'fas fa-running',
                          type: 'range',
                          label: 'Zoom',
                          tip: 'select the right zoom',
                          help: 'select the right zoom',
                          onchange: 'alert("zoom")',
                          oninput: 'alert("zoom")',
                      },

                      {
                          id: 'mytextwithbuttons',
                          type: 'text',
                          required: true,
                          size: 10,
                          value: 'First item',
                          label: 'Id de l\'ambulance',
                          icon: 'fas fa-ambulance',
                          minlength: 4,
                          buttons: [{
                              icon: 'fas fa-running',
                              onclick: 'dosomething'
                          }, {
                              title: 'do it',
                              onclick: 'dosomething'
                          }],
                          tip: 'Il faut bien écrire vous avez affaire avec un président',
                          help: 'Help Please verify your info before',
                      },
                      {
                          id: 'row0',
                          type: 'row',
                          desc: [{
                                  id: 'emailInrRow',
                                  type: 'email',
                                  size: 10,
                                  value: 'First item',
                                  label: 'Id de l\'ambulance',
                                  buttons: [{
                                      icon: 'fas fa-running',
                                      onclick: 'dosomething'
                                  }, {
                                      title: 'test',
                                      onclick: 'dosomething'
                                  }]
                              },
                              {
                                  id: 'passwordInRow',
                                  type: 'password',
                                  //pattern:'(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}',
                                  //required:true,
                                  value: 'Second item',
                                  label: 'Mot de passe'
                              },
                          ]
                      },
                      {
                          id: 'mypassword',
                          type: 'password',
                          pattern: '(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z]).{8,}',
                          patternInfo: '8 characters, 1 upper, 1 number',
                          //required:true,
                          value: 'Second item',
                          label: 'Mot de passe secure',
                          buttons: [{
                              icon: 'fas fa-running',
                              onclick: 'dosomething'
                          }, {
                              title: 'Do it',
                              onclick: 'dosomething'
                          }],
                          tip: 'Tip Please verify your info before',
                          help: 'Help Please verify your info before',
                      },
                      {
                          id: 'mydate',
                          type: 'datetime',
                          size: 10,
                          value: 'Third item',
                          label: 'date',
                          buttons: [{
                              icon: 'fas fa-running',
                              onclick: 'dosomething'
                          }, {
                              title: 'Do it',
                              onclick: 'dosomething'
                          }],
                          tip: 'Tip Please verify your info before',
                          help: 'Help Please verify your info before',
                      },
                      {
                          id: 'radioAnimal',
                          type: 'radio',
                          label: 'Choix animal',
                          value: 'dog',
                          options: [{
                                  label: 'chien',
                                  id: 'dog',
                                  tip: 'Il faut bien écrire vous avez affaire avec un président'
                              },
                              {
                                  label: 'chat',
                                  achecked: true,
                                  id: 'cat',
                                  help: 'Help Please verify your info before'
                              }
                          ]
                      },
                      {
                          id: 'checboxTransport',
                          type: 'checkbox',
                          label: 'Choix transport',
                          options: [{
                                  label: 'Voiture',
                                  id: 'car',
                                  help: 'Il faut bien écrire vous avez affaire avec un président'
                              },
                              {
                                  label: 'Bus',
                                  id: 'bus',
                                  tip: 'ça pique',
                                  value: true
                              }
                          ]
                      },
                      {
                          id: 'switchTest',
                          type: 'switch',
                          label: 'Choix animal',
                          options: [{
                                  checkedLabel: 'vole',
                                  uncheckedLabel: 'tombe',
                                  checkedValue: 'fly',
                                  uncheckedValue: 'fall',
                                  value: 'fly',
                                  label: 'Oiseau',
                                  id: 'bird',
                                  help: 'Il faut bien écrire vous avez affaire avec un président',
                                  ctrl: {
                                      checked: ["flyDescription"],
                                      unchecked: ["fallDescription"]
                                  }
                              },
                              {
                                  label: 'Serpent',
                                  id: 'snake',
                                  tip: 'ça pique',
                                  checked: true,
                              },
                              {
                                  label: 'Elephant',
                                  id: 'elephant',
                                  tip: 'ça pique',
                                  value: 'yes'
                              }

                          ]
                      },
                      {
                          id: 'switchTestAlone',
                          type: 'switch',
                          label: 'Choix animal alone',
                          options: [{
                              checkedLabel: 'vole alone',
                              uncheckedLabel: 'tombe alone',
                              checkedValue: 'fly_alone',
                              uncheckedValue: 'fall_alone',
                              value: 'fly_alone',
                              label: 'Oiseau alone',
                              help: 'Il faut bien écrire vous avez affaire avec un président',
                              ctrl: {
                                  checked: ["flyDescription"],
                                  unchecked: ["fallDescription"]
                              }
                          }]
                      },
                      {
                          type: 'textarea',
                          id: "flyDescription",
                          rows: 10,
                          value: 'Un très beau vol que nous avons la, tout à fait aérodynamique cette chouette!',
                          label: 'Description du vol',
                          multilang: true,
                          required: true,
                          icon: 'fas fa-kiwi-bird',
                          tip: 'Précisez l\'oiseau svp',
                          help: 'Help Please verify your info before',
                      },
                      {
                          type: 'textarea',
                          id: "fallDescription",
                          rows: 10,
                          value: 'Quelle chute c\'est fantastique l\'oiseau a littéralement EXPLOSé wow!',
                          label: 'Description de la chute',
                          multilang: true,
                          required: true,
                          icon: 'fas fa-bomb',
                          tip: 'Précisez l\'oiseau svp',
                          help: 'Help Please verify your info before',

                      },
                      {
                          type: 'hr',
                          icon: 'fas fa-plane',
                          label: 'Take your plane',
                          help: 'Please verify your info before'
                      },
                      {
                          icon: 'fas fa-running',
                          type: 'button',
                          color: 'danger',
                          class: 'btn-block btn-lg',
                          title: 'GO !',
                          onclick: 'dosomething',
                          waitValid: true,
                          tip: 'Tip Please verify your info before',
                          help: 'Help Please verify your info before',
                      },
                      {
                          id: 'i4',
                          type: 'button',
                          size: 23,
                          title: 'Fourth item',
                          icon: 'fas fa-restroom',
                          onclick: 'dosomething'
                      },
                  ]
              },
              form2: {
                  attr: {
                      lang: 'fr',
                      langs: ['fr', 'en'],
                      proposeTranslate: true
                  },
                  desc: [{
                          id: 'switchTestAlone',
                          type: 'switch',
                          label: 'Choix animal alone',
                          options: [{
                              checkedLabel: 'vole alone',
                              uncheckedLabel: 'tombe alone',
                              checkedValue: 'fly_alone',
                              uncheckedValue: 'fall_alone',
                              value: 'fly_alone',
                              label: 'Oiseau alone',
                              help: 'Il faut bien écrire vous avez affaire avec un président',
                              ctrl: {
                                  checked: ["flyDescription"],
                                  unchecked: ["fallDescription"]
                              }
                          }]
                      },
                      {
                          type: 'textarea',
                          id: "flyDescription",
                          rows: 10,
                          value: 'Un très beau vol que nous avons la, tout à fait aérodynamique cette chouette!',
                          label: 'Description du vol',
                          multilang: true,
                          required: true,
                          icon: 'fas fa-kiwi-bird',
                          tip: 'Précisez l\'oiseau svp',
                          help: 'Help Please verify your info before',
                      },
                      {
                          type: 'textarea',
                          id: "fallDescription",
                          rows: 10,
                          value: 'Quelle chute c\'est fantastique l\'oiseau a littéralement EXPLOSé wow!',
                          label: 'Description de la chute',
                          multilang: true,
                          required: true,
                          icon: 'fas fa-bomb',
                          tip: 'Précisez l\'oiseau svp',
                          help: 'Help Please verify your info before',
                      }
                  ]
              }
          };

      register('app',App);
      mount('app');

}());
