#!/usr/bin/env node
import { createRequire as __bsfCreateRequire } from 'node:module';
const require = __bsfCreateRequire(import.meta.url);
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});
var __esm = (fn, res, err) => function __init() {
  if (err) throw err[0];
  try {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  } catch (e) {
    throw err = [e], e;
  }
};
var __commonJS = (cb, mod) => function __require2() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../node_modules/yaml/dist/nodes/identity.js
var require_identity = __commonJS({
  "../node_modules/yaml/dist/nodes/identity.js"(exports) {
    "use strict";
    var ALIAS = /* @__PURE__ */ Symbol.for("yaml.alias");
    var DOC = /* @__PURE__ */ Symbol.for("yaml.document");
    var MAP = /* @__PURE__ */ Symbol.for("yaml.map");
    var PAIR = /* @__PURE__ */ Symbol.for("yaml.pair");
    var SCALAR = /* @__PURE__ */ Symbol.for("yaml.scalar");
    var SEQ = /* @__PURE__ */ Symbol.for("yaml.seq");
    var NODE_TYPE = /* @__PURE__ */ Symbol.for("yaml.node.type");
    var isAlias = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === ALIAS;
    var isDocument = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === DOC;
    var isMap = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === MAP;
    var isPair = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === PAIR;
    var isScalar = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SCALAR;
    var isSeq = (node) => !!node && typeof node === "object" && node[NODE_TYPE] === SEQ;
    function isCollection(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case MAP:
          case SEQ:
            return true;
        }
      return false;
    }
    function isNode(node) {
      if (node && typeof node === "object")
        switch (node[NODE_TYPE]) {
          case ALIAS:
          case MAP:
          case SCALAR:
          case SEQ:
            return true;
        }
      return false;
    }
    var hasAnchor = (node) => (isScalar(node) || isCollection(node)) && !!node.anchor;
    exports.ALIAS = ALIAS;
    exports.DOC = DOC;
    exports.MAP = MAP;
    exports.NODE_TYPE = NODE_TYPE;
    exports.PAIR = PAIR;
    exports.SCALAR = SCALAR;
    exports.SEQ = SEQ;
    exports.hasAnchor = hasAnchor;
    exports.isAlias = isAlias;
    exports.isCollection = isCollection;
    exports.isDocument = isDocument;
    exports.isMap = isMap;
    exports.isNode = isNode;
    exports.isPair = isPair;
    exports.isScalar = isScalar;
    exports.isSeq = isSeq;
  }
});

// ../node_modules/yaml/dist/visit.js
var require_visit = __commonJS({
  "../node_modules/yaml/dist/visit.js"(exports) {
    "use strict";
    var identity = require_identity();
    var BREAK = /* @__PURE__ */ Symbol("break visit");
    var SKIP = /* @__PURE__ */ Symbol("skip children");
    var REMOVE = /* @__PURE__ */ Symbol("remove node");
    function visit(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = visit_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        visit_(null, node, visitor_, Object.freeze([]));
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    function visit_(key, node, visitor, path2) {
      const ctrl = callVisitor(key, node, visitor, path2);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path2, ctrl);
        return visit_(key, ctrl, visitor, path2);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path2 = Object.freeze(path2.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = visit_(i, node.items[i], visitor, path2);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path2 = Object.freeze(path2.concat(node));
          const ck = visit_("key", node.key, visitor, path2);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = visit_("value", node.value, visitor, path2);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    async function visitAsync(node, visitor) {
      const visitor_ = initVisitor(visitor);
      if (identity.isDocument(node)) {
        const cd = await visitAsync_(null, node.contents, visitor_, Object.freeze([node]));
        if (cd === REMOVE)
          node.contents = null;
      } else
        await visitAsync_(null, node, visitor_, Object.freeze([]));
    }
    visitAsync.BREAK = BREAK;
    visitAsync.SKIP = SKIP;
    visitAsync.REMOVE = REMOVE;
    async function visitAsync_(key, node, visitor, path2) {
      const ctrl = await callVisitor(key, node, visitor, path2);
      if (identity.isNode(ctrl) || identity.isPair(ctrl)) {
        replaceNode(key, path2, ctrl);
        return visitAsync_(key, ctrl, visitor, path2);
      }
      if (typeof ctrl !== "symbol") {
        if (identity.isCollection(node)) {
          path2 = Object.freeze(path2.concat(node));
          for (let i = 0; i < node.items.length; ++i) {
            const ci = await visitAsync_(i, node.items[i], visitor, path2);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              node.items.splice(i, 1);
              i -= 1;
            }
          }
        } else if (identity.isPair(node)) {
          path2 = Object.freeze(path2.concat(node));
          const ck = await visitAsync_("key", node.key, visitor, path2);
          if (ck === BREAK)
            return BREAK;
          else if (ck === REMOVE)
            node.key = null;
          const cv = await visitAsync_("value", node.value, visitor, path2);
          if (cv === BREAK)
            return BREAK;
          else if (cv === REMOVE)
            node.value = null;
        }
      }
      return ctrl;
    }
    function initVisitor(visitor) {
      if (typeof visitor === "object" && (visitor.Collection || visitor.Node || visitor.Value)) {
        return Object.assign({
          Alias: visitor.Node,
          Map: visitor.Node,
          Scalar: visitor.Node,
          Seq: visitor.Node
        }, visitor.Value && {
          Map: visitor.Value,
          Scalar: visitor.Value,
          Seq: visitor.Value
        }, visitor.Collection && {
          Map: visitor.Collection,
          Seq: visitor.Collection
        }, visitor);
      }
      return visitor;
    }
    function callVisitor(key, node, visitor, path2) {
      if (typeof visitor === "function")
        return visitor(key, node, path2);
      if (identity.isMap(node))
        return visitor.Map?.(key, node, path2);
      if (identity.isSeq(node))
        return visitor.Seq?.(key, node, path2);
      if (identity.isPair(node))
        return visitor.Pair?.(key, node, path2);
      if (identity.isScalar(node))
        return visitor.Scalar?.(key, node, path2);
      if (identity.isAlias(node))
        return visitor.Alias?.(key, node, path2);
      return void 0;
    }
    function replaceNode(key, path2, node) {
      const parent = path2[path2.length - 1];
      if (identity.isCollection(parent)) {
        parent.items[key] = node;
      } else if (identity.isPair(parent)) {
        if (key === "key")
          parent.key = node;
        else
          parent.value = node;
      } else if (identity.isDocument(parent)) {
        parent.contents = node;
      } else {
        const pt = identity.isAlias(parent) ? "alias" : "scalar";
        throw new Error(`Cannot replace node with ${pt} parent`);
      }
    }
    exports.visit = visit;
    exports.visitAsync = visitAsync;
  }
});

// ../node_modules/yaml/dist/doc/directives.js
var require_directives = __commonJS({
  "../node_modules/yaml/dist/doc/directives.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    var escapeChars = {
      "!": "%21",
      ",": "%2C",
      "[": "%5B",
      "]": "%5D",
      "{": "%7B",
      "}": "%7D"
    };
    var escapeTagName = (tn) => tn.replace(/[!,[\]{}]/g, (ch) => escapeChars[ch]);
    var Directives = class _Directives {
      constructor(yaml, tags) {
        this.docStart = null;
        this.docEnd = false;
        this.yaml = Object.assign({}, _Directives.defaultYaml, yaml);
        this.tags = Object.assign({}, _Directives.defaultTags, tags);
      }
      clone() {
        const copy = new _Directives(this.yaml, this.tags);
        copy.docStart = this.docStart;
        return copy;
      }
      /**
       * During parsing, get a Directives instance for the current document and
       * update the stream state according to the current version's spec.
       */
      atDocument() {
        const res = new _Directives(this.yaml, this.tags);
        switch (this.yaml.version) {
          case "1.1":
            this.atNextDocument = true;
            break;
          case "1.2":
            this.atNextDocument = false;
            this.yaml = {
              explicit: _Directives.defaultYaml.explicit,
              version: "1.2"
            };
            this.tags = Object.assign({}, _Directives.defaultTags);
            break;
        }
        return res;
      }
      /**
       * @param onError - May be called even if the action was successful
       * @returns `true` on success
       */
      add(line, onError) {
        if (this.atNextDocument) {
          this.yaml = { explicit: _Directives.defaultYaml.explicit, version: "1.1" };
          this.tags = Object.assign({}, _Directives.defaultTags);
          this.atNextDocument = false;
        }
        const parts = line.trim().split(/[ \t]+/);
        const name = parts.shift();
        switch (name) {
          case "%TAG": {
            if (parts.length !== 2) {
              onError(0, "%TAG directive should contain exactly two parts");
              if (parts.length < 2)
                return false;
            }
            const [handle, prefix2] = parts;
            this.tags[handle] = prefix2;
            return true;
          }
          case "%YAML": {
            this.yaml.explicit = true;
            if (parts.length !== 1) {
              onError(0, "%YAML directive should contain exactly one part");
              return false;
            }
            const [version] = parts;
            if (version === "1.1" || version === "1.2") {
              this.yaml.version = version;
              return true;
            } else {
              const isValid = /^\d+\.\d+$/.test(version);
              onError(6, `Unsupported YAML version ${version}`, isValid);
              return false;
            }
          }
          default:
            onError(0, `Unknown directive ${name}`, true);
            return false;
        }
      }
      /**
       * Resolves a tag, matching handles to those defined in %TAG directives.
       *
       * @returns Resolved tag, which may also be the non-specific tag `'!'` or a
       *   `'!local'` tag, or `null` if unresolvable.
       */
      tagName(source, onError) {
        if (source === "!")
          return "!";
        if (source[0] !== "!") {
          onError(`Not a valid tag: ${source}`);
          return null;
        }
        if (source[1] === "<") {
          const verbatim = source.slice(2, -1);
          if (verbatim === "!" || verbatim === "!!") {
            onError(`Verbatim tags aren't resolved, so ${source} is invalid.`);
            return null;
          }
          if (source[source.length - 1] !== ">")
            onError("Verbatim tags must end with a >");
          return verbatim;
        }
        const [, handle, suffix] = source.match(/^(.*!)([^!]*)$/s);
        if (!suffix)
          onError(`The ${source} tag has no suffix`);
        const prefix2 = this.tags[handle];
        if (prefix2) {
          try {
            return prefix2 + decodeURIComponent(suffix);
          } catch (error) {
            onError(String(error));
            return null;
          }
        }
        if (handle === "!")
          return source;
        onError(`Could not resolve tag: ${source}`);
        return null;
      }
      /**
       * Given a fully resolved tag, returns its printable string form,
       * taking into account current tag prefixes and defaults.
       */
      tagString(tag) {
        for (const [handle, prefix2] of Object.entries(this.tags)) {
          if (tag.startsWith(prefix2))
            return handle + escapeTagName(tag.substring(prefix2.length));
        }
        return tag[0] === "!" ? tag : `!<${tag}>`;
      }
      toString(doc) {
        const lines = this.yaml.explicit ? [`%YAML ${this.yaml.version || "1.2"}`] : [];
        const tagEntries = Object.entries(this.tags);
        let tagNames;
        if (doc && tagEntries.length > 0 && identity.isNode(doc.contents)) {
          const tags = {};
          visit.visit(doc.contents, (_key, node) => {
            if (identity.isNode(node) && node.tag)
              tags[node.tag] = true;
          });
          tagNames = Object.keys(tags);
        } else
          tagNames = [];
        for (const [handle, prefix2] of tagEntries) {
          if (handle === "!!" && prefix2 === "tag:yaml.org,2002:")
            continue;
          if (!doc || tagNames.some((tn) => tn.startsWith(prefix2)))
            lines.push(`%TAG ${handle} ${prefix2}`);
        }
        return lines.join("\n");
      }
    };
    Directives.defaultYaml = { explicit: false, version: "1.2" };
    Directives.defaultTags = { "!!": "tag:yaml.org,2002:" };
    exports.Directives = Directives;
  }
});

// ../node_modules/yaml/dist/doc/anchors.js
var require_anchors = __commonJS({
  "../node_modules/yaml/dist/doc/anchors.js"(exports) {
    "use strict";
    var identity = require_identity();
    var visit = require_visit();
    function anchorIsValid(anchor) {
      if (/[\x00-\x19\s,[\]{}]/.test(anchor)) {
        const sa = JSON.stringify(anchor);
        const msg = `Anchor must not contain whitespace or control characters: ${sa}`;
        throw new Error(msg);
      }
      return true;
    }
    function anchorNames(root) {
      const anchors = /* @__PURE__ */ new Set();
      visit.visit(root, {
        Value(_key, node) {
          if (node.anchor)
            anchors.add(node.anchor);
        }
      });
      return anchors;
    }
    function findNewAnchor(prefix2, exclude) {
      for (let i = 1; true; ++i) {
        const name = `${prefix2}${i}`;
        if (!exclude.has(name))
          return name;
      }
    }
    function createNodeAnchors(doc, prefix2) {
      const aliasObjects = [];
      const sourceObjects = /* @__PURE__ */ new Map();
      let prevAnchors = null;
      return {
        onAnchor: (source) => {
          aliasObjects.push(source);
          prevAnchors ?? (prevAnchors = anchorNames(doc));
          const anchor = findNewAnchor(prefix2, prevAnchors);
          prevAnchors.add(anchor);
          return anchor;
        },
        /**
         * With circular references, the source node is only resolved after all
         * of its child nodes are. This is why anchors are set only after all of
         * the nodes have been created.
         */
        setAnchors: () => {
          for (const source of aliasObjects) {
            const ref = sourceObjects.get(source);
            if (typeof ref === "object" && ref.anchor && (identity.isScalar(ref.node) || identity.isCollection(ref.node))) {
              ref.node.anchor = ref.anchor;
            } else {
              const error = new Error("Failed to resolve repeated object (this should not happen)");
              error.source = source;
              throw error;
            }
          }
        },
        sourceObjects
      };
    }
    exports.anchorIsValid = anchorIsValid;
    exports.anchorNames = anchorNames;
    exports.createNodeAnchors = createNodeAnchors;
    exports.findNewAnchor = findNewAnchor;
  }
});

// ../node_modules/yaml/dist/doc/applyReviver.js
var require_applyReviver = __commonJS({
  "../node_modules/yaml/dist/doc/applyReviver.js"(exports) {
    "use strict";
    function applyReviver(reviver, obj, key, val) {
      if (val && typeof val === "object") {
        if (Array.isArray(val)) {
          for (let i = 0, len = val.length; i < len; ++i) {
            const v0 = val[i];
            const v1 = applyReviver(reviver, val, String(i), v0);
            if (v1 === void 0)
              delete val[i];
            else if (v1 !== v0)
              val[i] = v1;
          }
        } else if (val instanceof Map) {
          for (const k of Array.from(val.keys())) {
            const v0 = val.get(k);
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              val.delete(k);
            else if (v1 !== v0)
              val.set(k, v1);
          }
        } else if (val instanceof Set) {
          for (const v0 of Array.from(val)) {
            const v1 = applyReviver(reviver, val, v0, v0);
            if (v1 === void 0)
              val.delete(v0);
            else if (v1 !== v0) {
              val.delete(v0);
              val.add(v1);
            }
          }
        } else {
          for (const [k, v0] of Object.entries(val)) {
            const v1 = applyReviver(reviver, val, k, v0);
            if (v1 === void 0)
              delete val[k];
            else if (v1 !== v0)
              val[k] = v1;
          }
        }
      }
      return reviver.call(obj, key, val);
    }
    exports.applyReviver = applyReviver;
  }
});

// ../node_modules/yaml/dist/nodes/toJS.js
var require_toJS = __commonJS({
  "../node_modules/yaml/dist/nodes/toJS.js"(exports) {
    "use strict";
    var identity = require_identity();
    function toJS(value, arg, ctx) {
      if (Array.isArray(value))
        return value.map((v, i) => toJS(v, String(i), ctx));
      if (value && typeof value.toJSON === "function") {
        if (!ctx || !identity.hasAnchor(value))
          return value.toJSON(arg, ctx);
        const data = { aliasCount: 0, count: 1, res: void 0 };
        ctx.anchors.set(value, data);
        ctx.onCreate = (res2) => {
          data.res = res2;
          delete ctx.onCreate;
        };
        const res = value.toJSON(arg, ctx);
        if (ctx.onCreate)
          ctx.onCreate(res);
        return res;
      }
      if (typeof value === "bigint" && !ctx?.keep)
        return Number(value);
      return value;
    }
    exports.toJS = toJS;
  }
});

// ../node_modules/yaml/dist/nodes/Node.js
var require_Node = __commonJS({
  "../node_modules/yaml/dist/nodes/Node.js"(exports) {
    "use strict";
    var applyReviver = require_applyReviver();
    var identity = require_identity();
    var toJS = require_toJS();
    var NodeBase = class {
      constructor(type) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: type });
      }
      /** Create a copy of this node.  */
      clone() {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** A plain JavaScript representation of this node. */
      toJS(doc, { mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        if (!identity.isDocument(doc))
          throw new TypeError("A document argument is required");
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc,
          keep: true,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this, "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
    };
    exports.NodeBase = NodeBase;
  }
});

// ../node_modules/yaml/dist/nodes/Alias.js
var require_Alias = __commonJS({
  "../node_modules/yaml/dist/nodes/Alias.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var visit = require_visit();
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var Alias = class extends Node.NodeBase {
      constructor(source) {
        super(identity.ALIAS);
        this.source = source;
        Object.defineProperty(this, "tag", {
          set() {
            throw new Error("Alias nodes cannot have tags");
          }
        });
      }
      /**
       * Resolve the value of this alias within `doc`, finding the last
       * instance of the `source` anchor before this node.
       */
      resolve(doc, ctx) {
        if (ctx?.maxAliasCount === 0)
          throw new ReferenceError("Alias resolution is disabled");
        let nodes;
        if (ctx?.aliasResolveCache) {
          nodes = ctx.aliasResolveCache;
        } else {
          nodes = [];
          visit.visit(doc, {
            Node: (_key, node) => {
              if (identity.isAlias(node) || identity.hasAnchor(node))
                nodes.push(node);
            }
          });
          if (ctx)
            ctx.aliasResolveCache = nodes;
        }
        let found = void 0;
        for (const node of nodes) {
          if (node === this)
            break;
          if (node.anchor === this.source)
            found = node;
        }
        if (found && ctx) {
          const { anchors: anchors2, doc: doc2, maxAliasCount } = ctx;
          let data = anchors2.get(found);
          if (!data) {
            toJS.toJS(found, null, ctx);
            data = anchors2.get(found);
          }
          if (data?.res === void 0) {
            const msg = "This should not happen: Alias anchor was not resolved?";
            throw new ReferenceError(msg);
          }
          if (maxAliasCount >= 0) {
            data.count += 1;
            if (data.aliasCount === 0)
              data.aliasCount = getAliasCount(doc2, found, anchors2);
            if (data.count * data.aliasCount > maxAliasCount) {
              const msg = "Excessive alias count indicates a resource exhaustion attack";
              throw new ReferenceError(msg);
            }
          }
        }
        return found;
      }
      toJSON(_arg, ctx) {
        if (!ctx)
          return { source: this.source };
        const source = this.resolve(ctx.doc, ctx);
        if (!source) {
          const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
          throw new ReferenceError(msg);
        }
        return ctx.anchors.get(source).res;
      }
      toString(ctx, _onComment, _onChompKeep) {
        const src = `*${this.source}`;
        if (ctx) {
          anchors.anchorIsValid(this.source);
          if (ctx.options.verifyAliasOrder && !ctx.anchors.has(this.source)) {
            const msg = `Unresolved alias (the anchor must be set before the alias): ${this.source}`;
            throw new Error(msg);
          }
          if (ctx.implicitKey)
            return `${src} `;
        }
        return src;
      }
    };
    function getAliasCount(doc, node, anchors2) {
      if (identity.isAlias(node)) {
        const source = node.resolve(doc);
        const anchor = anchors2 && source && anchors2.get(source);
        return anchor ? anchor.count * anchor.aliasCount : 0;
      } else if (identity.isCollection(node)) {
        let count = 0;
        for (const item of node.items) {
          const c = getAliasCount(doc, item, anchors2);
          if (c > count)
            count = c;
        }
        return count;
      } else if (identity.isPair(node)) {
        const kc = getAliasCount(doc, node.key, anchors2);
        const vc = getAliasCount(doc, node.value, anchors2);
        return Math.max(kc, vc);
      }
      return 1;
    }
    exports.Alias = Alias;
  }
});

// ../node_modules/yaml/dist/nodes/Scalar.js
var require_Scalar = __commonJS({
  "../node_modules/yaml/dist/nodes/Scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Node = require_Node();
    var toJS = require_toJS();
    var isScalarValue = (value) => !value || typeof value !== "function" && typeof value !== "object";
    var Scalar = class extends Node.NodeBase {
      constructor(value) {
        super(identity.SCALAR);
        this.value = value;
      }
      toJSON(arg, ctx) {
        return ctx?.keep ? this.value : toJS.toJS(this.value, arg, ctx);
      }
      toString() {
        return String(this.value);
      }
    };
    Scalar.BLOCK_FOLDED = "BLOCK_FOLDED";
    Scalar.BLOCK_LITERAL = "BLOCK_LITERAL";
    Scalar.PLAIN = "PLAIN";
    Scalar.QUOTE_DOUBLE = "QUOTE_DOUBLE";
    Scalar.QUOTE_SINGLE = "QUOTE_SINGLE";
    exports.Scalar = Scalar;
    exports.isScalarValue = isScalarValue;
  }
});

// ../node_modules/yaml/dist/doc/createNode.js
var require_createNode = __commonJS({
  "../node_modules/yaml/dist/doc/createNode.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var defaultTagPrefix = "tag:yaml.org,2002:";
    function findTagObject(value, tagName, tags) {
      if (tagName) {
        const match2 = tags.filter((t) => t.tag === tagName);
        const tagObj = match2.find((t) => !t.format) ?? match2[0];
        if (!tagObj)
          throw new Error(`Tag ${tagName} not found`);
        return tagObj;
      }
      return tags.find((t) => t.identify?.(value) && !t.format);
    }
    function createNode(value, tagName, ctx) {
      if (identity.isDocument(value))
        value = value.contents;
      if (identity.isNode(value))
        return value;
      if (identity.isPair(value)) {
        const map = ctx.schema[identity.MAP].createNode?.(ctx.schema, null, ctx);
        map.items.push(value);
        return map;
      }
      if (value instanceof String || value instanceof Number || value instanceof Boolean || typeof BigInt !== "undefined" && value instanceof BigInt) {
        value = value.valueOf();
      }
      const { aliasDuplicateObjects, onAnchor, onTagObj, schema, sourceObjects } = ctx;
      let ref = void 0;
      if (aliasDuplicateObjects && value && typeof value === "object") {
        ref = sourceObjects.get(value);
        if (ref) {
          ref.anchor ?? (ref.anchor = onAnchor(value));
          return new Alias.Alias(ref.anchor);
        } else {
          ref = { anchor: null, node: null };
          sourceObjects.set(value, ref);
        }
      }
      if (tagName?.startsWith("!!"))
        tagName = defaultTagPrefix + tagName.slice(2);
      let tagObj = findTagObject(value, tagName, schema.tags);
      if (!tagObj) {
        if (value && typeof value.toJSON === "function") {
          value = value.toJSON();
        }
        if (!value || typeof value !== "object") {
          const node2 = new Scalar.Scalar(value);
          if (ref)
            ref.node = node2;
          return node2;
        }
        tagObj = value instanceof Map ? schema[identity.MAP] : Symbol.iterator in Object(value) ? schema[identity.SEQ] : schema[identity.MAP];
      }
      if (onTagObj) {
        onTagObj(tagObj);
        delete ctx.onTagObj;
      }
      const node = tagObj?.createNode ? tagObj.createNode(ctx.schema, value, ctx) : typeof tagObj?.nodeClass?.from === "function" ? tagObj.nodeClass.from(ctx.schema, value, ctx) : new Scalar.Scalar(value);
      if (tagName)
        node.tag = tagName;
      else if (!tagObj.default)
        node.tag = tagObj.tag;
      if (ref)
        ref.node = node;
      return node;
    }
    exports.createNode = createNode;
  }
});

// ../node_modules/yaml/dist/nodes/Collection.js
var require_Collection = __commonJS({
  "../node_modules/yaml/dist/nodes/Collection.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var identity = require_identity();
    var Node = require_Node();
    function collectionFromPath(schema, path2, value) {
      let v = value;
      for (let i = path2.length - 1; i >= 0; --i) {
        const k = path2[i];
        if (typeof k === "number" && Number.isInteger(k) && k >= 0) {
          const a = [];
          a[k] = v;
          v = a;
        } else {
          v = /* @__PURE__ */ new Map([[k, v]]);
        }
      }
      return createNode.createNode(v, void 0, {
        aliasDuplicateObjects: false,
        keepUndefined: false,
        onAnchor: () => {
          throw new Error("This should not happen, please report a bug.");
        },
        schema,
        sourceObjects: /* @__PURE__ */ new Map()
      });
    }
    var isEmptyPath = (path2) => path2 == null || typeof path2 === "object" && !!path2[Symbol.iterator]().next().done;
    var Collection = class extends Node.NodeBase {
      constructor(type, schema) {
        super(type);
        Object.defineProperty(this, "schema", {
          value: schema,
          configurable: true,
          enumerable: false,
          writable: true
        });
      }
      /**
       * Create a copy of this collection.
       *
       * @param schema - If defined, overwrites the original's schema
       */
      clone(schema) {
        const copy = Object.create(Object.getPrototypeOf(this), Object.getOwnPropertyDescriptors(this));
        if (schema)
          copy.schema = schema;
        copy.items = copy.items.map((it) => identity.isNode(it) || identity.isPair(it) ? it.clone(schema) : it);
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /**
       * Adds a value to the collection. For `!!map` and `!!omap` the value must
       * be a Pair instance or a `{ key, value }` object, which may not have a key
       * that already exists in the map.
       */
      addIn(path2, value) {
        if (isEmptyPath(path2))
          this.add(value);
        else {
          const [key, ...rest] = path2;
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.addIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
      /**
       * Removes a value from the collection.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path2) {
        const [key, ...rest] = path2;
        if (rest.length === 0)
          return this.delete(key);
        const node = this.get(key, true);
        if (identity.isCollection(node))
          return node.deleteIn(rest);
        else
          throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path2, keepScalar) {
        const [key, ...rest] = path2;
        const node = this.get(key, true);
        if (rest.length === 0)
          return !keepScalar && identity.isScalar(node) ? node.value : node;
        else
          return identity.isCollection(node) ? node.getIn(rest, keepScalar) : void 0;
      }
      hasAllNullValues(allowScalar) {
        return this.items.every((node) => {
          if (!identity.isPair(node))
            return false;
          const n = node.value;
          return n == null || allowScalar && identity.isScalar(n) && n.value == null && !n.commentBefore && !n.comment && !n.tag;
        });
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       */
      hasIn(path2) {
        const [key, ...rest] = path2;
        if (rest.length === 0)
          return this.has(key);
        const node = this.get(key, true);
        return identity.isCollection(node) ? node.hasIn(rest) : false;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path2, value) {
        const [key, ...rest] = path2;
        if (rest.length === 0) {
          this.set(key, value);
        } else {
          const node = this.get(key, true);
          if (identity.isCollection(node))
            node.setIn(rest, value);
          else if (node === void 0 && this.schema)
            this.set(key, collectionFromPath(this.schema, rest, value));
          else
            throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
        }
      }
    };
    exports.Collection = Collection;
    exports.collectionFromPath = collectionFromPath;
    exports.isEmptyPath = isEmptyPath;
  }
});

// ../node_modules/yaml/dist/stringify/stringifyComment.js
var require_stringifyComment = __commonJS({
  "../node_modules/yaml/dist/stringify/stringifyComment.js"(exports) {
    "use strict";
    var stringifyComment = (str) => str.replace(/^(?!$)(?: $)?/gm, "#");
    function indentComment(comment, indent) {
      if (/^\n+$/.test(comment))
        return comment.substring(1);
      return indent ? comment.replace(/^(?! *$)/gm, indent) : comment;
    }
    var lineComment = (str, indent, comment) => str.endsWith("\n") ? indentComment(comment, indent) : comment.includes("\n") ? "\n" + indentComment(comment, indent) : (str.endsWith(" ") ? "" : " ") + comment;
    exports.indentComment = indentComment;
    exports.lineComment = lineComment;
    exports.stringifyComment = stringifyComment;
  }
});

// ../node_modules/yaml/dist/stringify/foldFlowLines.js
var require_foldFlowLines = __commonJS({
  "../node_modules/yaml/dist/stringify/foldFlowLines.js"(exports) {
    "use strict";
    var FOLD_FLOW = "flow";
    var FOLD_BLOCK = "block";
    var FOLD_QUOTED = "quoted";
    function foldFlowLines(text, indent, mode = "flow", { indentAtStart, lineWidth = 80, minContentWidth = 20, onFold, onOverflow } = {}) {
      if (!lineWidth || lineWidth < 0)
        return text;
      if (lineWidth < minContentWidth)
        minContentWidth = 0;
      const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
      if (text.length <= endStep)
        return text;
      const folds = [];
      const escapedFolds = {};
      let end = lineWidth - indent.length;
      if (typeof indentAtStart === "number") {
        if (indentAtStart > lineWidth - Math.max(2, minContentWidth))
          folds.push(0);
        else
          end = lineWidth - indentAtStart;
      }
      let split = void 0;
      let prev = void 0;
      let overflow = false;
      let i = -1;
      let escStart = -1;
      let escEnd = -1;
      if (mode === FOLD_BLOCK) {
        i = consumeMoreIndentedLines(text, i, indent.length);
        if (i !== -1)
          end = i + endStep;
      }
      for (let ch; ch = text[i += 1]; ) {
        if (mode === FOLD_QUOTED && ch === "\\") {
          escStart = i;
          switch (text[i + 1]) {
            case "x":
              i += 3;
              break;
            case "u":
              i += 5;
              break;
            case "U":
              i += 9;
              break;
            default:
              i += 1;
          }
          escEnd = i;
        }
        if (ch === "\n") {
          if (mode === FOLD_BLOCK)
            i = consumeMoreIndentedLines(text, i, indent.length);
          end = i + indent.length + endStep;
          split = void 0;
        } else {
          if (ch === " " && prev && prev !== " " && prev !== "\n" && prev !== "	") {
            const next = text[i + 1];
            if (next && next !== " " && next !== "\n" && next !== "	")
              split = i;
          }
          if (i >= end) {
            if (split) {
              folds.push(split);
              end = split + endStep;
              split = void 0;
            } else if (mode === FOLD_QUOTED) {
              while (prev === " " || prev === "	") {
                prev = ch;
                ch = text[i += 1];
                overflow = true;
              }
              const j = i > escEnd + 1 ? i - 2 : escStart - 1;
              if (escapedFolds[j])
                return text;
              folds.push(j);
              escapedFolds[j] = true;
              end = j + endStep;
              split = void 0;
            } else {
              overflow = true;
            }
          }
        }
        prev = ch;
      }
      if (overflow && onOverflow)
        onOverflow();
      if (folds.length === 0)
        return text;
      if (onFold)
        onFold();
      let res = text.slice(0, folds[0]);
      for (let i2 = 0; i2 < folds.length; ++i2) {
        const fold = folds[i2];
        const end2 = folds[i2 + 1] || text.length;
        if (fold === 0)
          res = `
${indent}${text.slice(0, end2)}`;
        else {
          if (mode === FOLD_QUOTED && escapedFolds[fold])
            res += `${text[fold]}\\`;
          res += `
${indent}${text.slice(fold + 1, end2)}`;
        }
      }
      return res;
    }
    function consumeMoreIndentedLines(text, i, indent) {
      let end = i;
      let start = i + 1;
      let ch = text[start];
      while (ch === " " || ch === "	") {
        if (i < start + indent) {
          ch = text[++i];
        } else {
          do {
            ch = text[++i];
          } while (ch && ch !== "\n");
          end = i;
          start = i + 1;
          ch = text[start];
        }
      }
      return end;
    }
    exports.FOLD_BLOCK = FOLD_BLOCK;
    exports.FOLD_FLOW = FOLD_FLOW;
    exports.FOLD_QUOTED = FOLD_QUOTED;
    exports.foldFlowLines = foldFlowLines;
  }
});

// ../node_modules/yaml/dist/stringify/stringifyString.js
var require_stringifyString = __commonJS({
  "../node_modules/yaml/dist/stringify/stringifyString.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var foldFlowLines = require_foldFlowLines();
    var getFoldOptions = (ctx, isBlock) => ({
      indentAtStart: isBlock ? ctx.indent.length : ctx.indentAtStart,
      lineWidth: ctx.options.lineWidth,
      minContentWidth: ctx.options.minContentWidth
    });
    var containsDocumentMarker = (str) => /^(%|---|\.\.\.)/m.test(str);
    function lineLengthOverLimit(str, lineWidth, indentLength) {
      if (!lineWidth || lineWidth < 0)
        return false;
      const limit = lineWidth - indentLength;
      const strLen = str.length;
      if (strLen <= limit)
        return false;
      for (let i = 0, start = 0; i < strLen; ++i) {
        if (str[i] === "\n") {
          if (i - start > limit)
            return true;
          start = i + 1;
          if (strLen - start <= limit)
            return false;
        }
      }
      return true;
    }
    function doubleQuotedString(value, ctx) {
      const json2 = JSON.stringify(value);
      if (ctx.options.doubleQuotedAsJSON)
        return json2;
      const { implicitKey } = ctx;
      const minMultiLineLength = ctx.options.doubleQuotedMinMultiLineLength;
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      let str = "";
      let start = 0;
      for (let i = 0, ch = json2[i]; ch; ch = json2[++i]) {
        if (ch === " " && json2[i + 1] === "\\" && json2[i + 2] === "n") {
          str += json2.slice(start, i) + "\\ ";
          i += 1;
          start = i;
          ch = "\\";
        }
        if (ch === "\\")
          switch (json2[i + 1]) {
            case "u":
              {
                str += json2.slice(start, i);
                const code = json2.substr(i + 2, 4);
                switch (code) {
                  case "0000":
                    str += "\\0";
                    break;
                  case "0007":
                    str += "\\a";
                    break;
                  case "000b":
                    str += "\\v";
                    break;
                  case "001b":
                    str += "\\e";
                    break;
                  case "0085":
                    str += "\\N";
                    break;
                  case "00a0":
                    str += "\\_";
                    break;
                  case "2028":
                    str += "\\L";
                    break;
                  case "2029":
                    str += "\\P";
                    break;
                  default:
                    if (code.substr(0, 2) === "00")
                      str += "\\x" + code.substr(2);
                    else
                      str += json2.substr(i, 6);
                }
                i += 5;
                start = i + 1;
              }
              break;
            case "n":
              if (implicitKey || json2[i + 2] === '"' || json2.length < minMultiLineLength) {
                i += 1;
              } else {
                str += json2.slice(start, i) + "\n\n";
                while (json2[i + 2] === "\\" && json2[i + 3] === "n" && json2[i + 4] !== '"') {
                  str += "\n";
                  i += 2;
                }
                str += indent;
                if (json2[i + 2] === " ")
                  str += "\\";
                i += 1;
                start = i + 1;
              }
              break;
            default:
              i += 1;
          }
      }
      str = start ? str + json2.slice(start) : json2;
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_QUOTED, getFoldOptions(ctx, false));
    }
    function singleQuotedString(value, ctx) {
      if (ctx.options.singleQuote === false || ctx.implicitKey && value.includes("\n") || /[ \t]\n|\n[ \t]/.test(value))
        return doubleQuotedString(value, ctx);
      const indent = ctx.indent || (containsDocumentMarker(value) ? "  " : "");
      const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&
${indent}`) + "'";
      return ctx.implicitKey ? res : foldFlowLines.foldFlowLines(res, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function quotedString(value, ctx) {
      const { singleQuote } = ctx.options;
      let qs;
      if (singleQuote === false)
        qs = doubleQuotedString;
      else {
        const hasDouble = value.includes('"');
        const hasSingle = value.includes("'");
        if (hasDouble && !hasSingle)
          qs = singleQuotedString;
        else if (hasSingle && !hasDouble)
          qs = doubleQuotedString;
        else
          qs = singleQuote ? singleQuotedString : doubleQuotedString;
      }
      return qs(value, ctx);
    }
    var blockEndNewlines;
    try {
      blockEndNewlines = new RegExp("(^|(?<!\n))\n+(?!\n|$)", "g");
    } catch {
      blockEndNewlines = /\n+(?!\n|$)/g;
    }
    function blockString({ comment, type, value }, ctx, onComment, onChompKeep) {
      const { blockQuote, commentString, lineWidth } = ctx.options;
      if (!blockQuote || /\n[\t ]+$/.test(value)) {
        return quotedString(value, ctx);
      }
      const indent = ctx.indent || (ctx.forceBlockIndent || containsDocumentMarker(value) ? "  " : "");
      const literal2 = blockQuote === "literal" ? true : blockQuote === "folded" || type === Scalar.Scalar.BLOCK_FOLDED ? false : type === Scalar.Scalar.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, lineWidth, indent.length);
      if (!value)
        return literal2 ? "|\n" : ">\n";
      let chomp;
      let endStart;
      for (endStart = value.length; endStart > 0; --endStart) {
        const ch = value[endStart - 1];
        if (ch !== "\n" && ch !== "	" && ch !== " ")
          break;
      }
      let end = value.substring(endStart);
      const endNlPos = end.indexOf("\n");
      if (endNlPos === -1) {
        chomp = "-";
      } else if (value === end || endNlPos !== end.length - 1) {
        chomp = "+";
        if (onChompKeep)
          onChompKeep();
      } else {
        chomp = "";
      }
      if (end) {
        value = value.slice(0, -end.length);
        if (end[end.length - 1] === "\n")
          end = end.slice(0, -1);
        end = end.replace(blockEndNewlines, `$&${indent}`);
      }
      let startWithSpace = false;
      let startEnd;
      let startNlPos = -1;
      for (startEnd = 0; startEnd < value.length; ++startEnd) {
        const ch = value[startEnd];
        if (ch === " ")
          startWithSpace = true;
        else if (ch === "\n")
          startNlPos = startEnd;
        else
          break;
      }
      let start = value.substring(0, startNlPos < startEnd ? startNlPos + 1 : startEnd);
      if (start) {
        value = value.substring(start.length);
        start = start.replace(/\n+/g, `$&${indent}`);
      }
      const indentSize = indent ? "2" : "1";
      let header = (startWithSpace ? indentSize : "") + chomp;
      if (comment) {
        header += " " + commentString(comment.replace(/ ?[\r\n]+/g, " "));
        if (onComment)
          onComment();
      }
      if (!literal2) {
        const foldedValue = value.replace(/\n+/g, "\n$&").replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, "$1$2").replace(/\n+/g, `$&${indent}`);
        let literalFallback = false;
        const foldOptions = getFoldOptions(ctx, true);
        if (blockQuote !== "folded" && type !== Scalar.Scalar.BLOCK_FOLDED) {
          foldOptions.onOverflow = () => {
            literalFallback = true;
          };
        }
        const body = foldFlowLines.foldFlowLines(`${start}${foldedValue}${end}`, indent, foldFlowLines.FOLD_BLOCK, foldOptions);
        if (!literalFallback)
          return `>${header}
${indent}${body}`;
      }
      value = value.replace(/\n+/g, `$&${indent}`);
      return `|${header}
${indent}${start}${value}${end}`;
    }
    function plainString(item, ctx, onComment, onChompKeep) {
      const { type, value } = item;
      const { actualString, implicitKey, indent, indentStep, inFlow } = ctx;
      if (implicitKey && value.includes("\n") || inFlow && /[[\]{},]/.test(value)) {
        return quotedString(value, ctx);
      }
      if (/^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
        return implicitKey || inFlow || !value.includes("\n") ? quotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
      }
      if (!implicitKey && !inFlow && type !== Scalar.Scalar.PLAIN && value.includes("\n")) {
        return blockString(item, ctx, onComment, onChompKeep);
      }
      if (containsDocumentMarker(value)) {
        if (indent === "") {
          ctx.forceBlockIndent = true;
          return blockString(item, ctx, onComment, onChompKeep);
        } else if (implicitKey && indent === indentStep) {
          return quotedString(value, ctx);
        }
      }
      const str = value.replace(/\n+/g, `$&
${indent}`);
      if (actualString) {
        const test = (tag) => tag.default && tag.tag !== "tag:yaml.org,2002:str" && tag.test?.test(str);
        const { compat, tags } = ctx.doc.schema;
        if (tags.some(test) || compat?.some(test))
          return quotedString(value, ctx);
      }
      return implicitKey ? str : foldFlowLines.foldFlowLines(str, indent, foldFlowLines.FOLD_FLOW, getFoldOptions(ctx, false));
    }
    function stringifyString(item, ctx, onComment, onChompKeep) {
      const { implicitKey, inFlow } = ctx;
      const ss = typeof item.value === "string" ? item : Object.assign({}, item, { value: String(item.value) });
      let { type } = item;
      if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
        if (/[\x00-\x08\x0b-\x1f\x7f-\x9f\u{D800}-\u{DFFF}]/u.test(ss.value))
          type = Scalar.Scalar.QUOTE_DOUBLE;
      }
      const _stringify = (_type) => {
        switch (_type) {
          case Scalar.Scalar.BLOCK_FOLDED:
          case Scalar.Scalar.BLOCK_LITERAL:
            return implicitKey || inFlow ? quotedString(ss.value, ctx) : blockString(ss, ctx, onComment, onChompKeep);
          case Scalar.Scalar.QUOTE_DOUBLE:
            return doubleQuotedString(ss.value, ctx);
          case Scalar.Scalar.QUOTE_SINGLE:
            return singleQuotedString(ss.value, ctx);
          case Scalar.Scalar.PLAIN:
            return plainString(ss, ctx, onComment, onChompKeep);
          default:
            return null;
        }
      };
      let res = _stringify(type);
      if (res === null) {
        const { defaultKeyType, defaultStringType } = ctx.options;
        const t = implicitKey && defaultKeyType || defaultStringType;
        res = _stringify(t);
        if (res === null)
          throw new Error(`Unsupported default string type ${t}`);
      }
      return res;
    }
    exports.stringifyString = stringifyString;
  }
});

// ../node_modules/yaml/dist/stringify/stringify.js
var require_stringify = __commonJS({
  "../node_modules/yaml/dist/stringify/stringify.js"(exports) {
    "use strict";
    var anchors = require_anchors();
    var identity = require_identity();
    var stringifyComment = require_stringifyComment();
    var stringifyString = require_stringifyString();
    function createStringifyContext(doc, options) {
      const opt = Object.assign({
        blockQuote: true,
        commentString: stringifyComment.stringifyComment,
        defaultKeyType: null,
        defaultStringType: "PLAIN",
        directives: null,
        doubleQuotedAsJSON: false,
        doubleQuotedMinMultiLineLength: 40,
        falseStr: "false",
        flowCollectionPadding: true,
        indentSeq: true,
        lineWidth: 80,
        minContentWidth: 20,
        nullStr: "null",
        simpleKeys: false,
        singleQuote: null,
        trailingComma: false,
        trueStr: "true",
        verifyAliasOrder: true
      }, doc.schema.toStringOptions, options);
      let inFlow;
      switch (opt.collectionStyle) {
        case "block":
          inFlow = false;
          break;
        case "flow":
          inFlow = true;
          break;
        default:
          inFlow = null;
      }
      return {
        anchors: /* @__PURE__ */ new Set(),
        doc,
        flowCollectionPadding: opt.flowCollectionPadding ? " " : "",
        indent: "",
        indentStep: typeof opt.indent === "number" ? " ".repeat(opt.indent) : "  ",
        inFlow,
        options: opt
      };
    }
    function getTagObject(tags, item) {
      if (item.tag) {
        const match2 = tags.filter((t) => t.tag === item.tag);
        if (match2.length > 0)
          return match2.find((t) => t.format === item.format) ?? match2[0];
      }
      let tagObj = void 0;
      let obj;
      if (identity.isScalar(item)) {
        obj = item.value;
        let match2 = tags.filter((t) => t.identify?.(obj));
        if (match2.length > 1) {
          const testMatch = match2.filter((t) => t.test);
          if (testMatch.length > 0)
            match2 = testMatch;
        }
        tagObj = match2.find((t) => t.format === item.format) ?? match2.find((t) => !t.format);
      } else {
        obj = item;
        tagObj = tags.find((t) => t.nodeClass && obj instanceof t.nodeClass);
      }
      if (!tagObj) {
        const name = obj?.constructor?.name ?? (obj === null ? "null" : typeof obj);
        throw new Error(`Tag not resolved for ${name} value`);
      }
      return tagObj;
    }
    function stringifyProps(node, tagObj, { anchors: anchors$1, doc }) {
      if (!doc.directives)
        return "";
      const props = [];
      const anchor = (identity.isScalar(node) || identity.isCollection(node)) && node.anchor;
      if (anchor && anchors.anchorIsValid(anchor)) {
        anchors$1.add(anchor);
        props.push(`&${anchor}`);
      }
      const tag = node.tag ?? (tagObj.default ? null : tagObj.tag);
      if (tag)
        props.push(doc.directives.tagString(tag));
      return props.join(" ");
    }
    function stringify(item, ctx, onComment, onChompKeep) {
      if (identity.isPair(item))
        return item.toString(ctx, onComment, onChompKeep);
      if (identity.isAlias(item)) {
        if (ctx.doc.directives)
          return item.toString(ctx);
        if (ctx.resolvedAliases?.has(item)) {
          throw new TypeError(`Cannot stringify circular structure without alias nodes`);
        } else {
          if (ctx.resolvedAliases)
            ctx.resolvedAliases.add(item);
          else
            ctx.resolvedAliases = /* @__PURE__ */ new Set([item]);
          item = item.resolve(ctx.doc);
        }
      }
      let tagObj = void 0;
      const node = identity.isNode(item) ? item : ctx.doc.createNode(item, { onTagObj: (o) => tagObj = o });
      tagObj ?? (tagObj = getTagObject(ctx.doc.schema.tags, node));
      const props = stringifyProps(node, tagObj, ctx);
      if (props.length > 0)
        ctx.indentAtStart = (ctx.indentAtStart ?? 0) + props.length + 1;
      const str = typeof tagObj.stringify === "function" ? tagObj.stringify(node, ctx, onComment, onChompKeep) : identity.isScalar(node) ? stringifyString.stringifyString(node, ctx, onComment, onChompKeep) : node.toString(ctx, onComment, onChompKeep);
      if (!props)
        return str;
      return identity.isScalar(node) || str[0] === "{" || str[0] === "[" ? `${props} ${str}` : `${props}
${ctx.indent}${str}`;
    }
    exports.createStringifyContext = createStringifyContext;
    exports.stringify = stringify;
  }
});

// ../node_modules/yaml/dist/stringify/stringifyPair.js
var require_stringifyPair = __commonJS({
  "../node_modules/yaml/dist/stringify/stringifyPair.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyPair({ key, value }, ctx, onComment, onChompKeep) {
      const { allNullValues, doc, indent, indentStep, options: { commentString, indentSeq, simpleKeys } } = ctx;
      let keyComment = identity.isNode(key) && key.comment || null;
      if (simpleKeys) {
        if (keyComment) {
          throw new Error("With simple keys, key nodes cannot have comments");
        }
        if (identity.isCollection(key) || !identity.isNode(key) && typeof key === "object") {
          const msg = "With simple keys, collection cannot be used as a key value";
          throw new Error(msg);
        }
      }
      let explicitKey = !simpleKeys && (!key || keyComment && value == null && !ctx.inFlow || identity.isCollection(key) || (identity.isScalar(key) ? key.type === Scalar.Scalar.BLOCK_FOLDED || key.type === Scalar.Scalar.BLOCK_LITERAL : typeof key === "object"));
      ctx = Object.assign({}, ctx, {
        allNullValues: false,
        implicitKey: !explicitKey && (simpleKeys || !allNullValues),
        indent: indent + indentStep
      });
      let keyCommentDone = false;
      let chompKeep = false;
      let str = stringify.stringify(key, ctx, () => keyCommentDone = true, () => chompKeep = true);
      if (!explicitKey && !ctx.inFlow && str.length > 1024) {
        if (simpleKeys)
          throw new Error("With simple keys, single line scalar must not span more than 1024 characters");
        explicitKey = true;
      }
      if (ctx.inFlow) {
        if (allNullValues || value == null) {
          if (keyCommentDone && onComment)
            onComment();
          return str === "" ? "?" : explicitKey ? `? ${str}` : str;
        }
      } else if (allNullValues && !simpleKeys || value == null && explicitKey) {
        str = `? ${str}`;
        if (keyComment && !keyCommentDone) {
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        } else if (chompKeep && onChompKeep)
          onChompKeep();
        return str;
      }
      if (keyCommentDone)
        keyComment = null;
      if (explicitKey) {
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
        str = `? ${str}
${indent}:`;
      } else {
        str = `${str}:`;
        if (keyComment)
          str += stringifyComment.lineComment(str, ctx.indent, commentString(keyComment));
      }
      let vsb, vcb, valueComment;
      if (identity.isNode(value)) {
        vsb = !!value.spaceBefore;
        vcb = value.commentBefore;
        valueComment = value.comment;
      } else {
        vsb = false;
        vcb = null;
        valueComment = null;
        if (value && typeof value === "object")
          value = doc.createNode(value);
      }
      ctx.implicitKey = false;
      if (!explicitKey && !keyComment && identity.isScalar(value))
        ctx.indentAtStart = str.length + 1;
      chompKeep = false;
      if (!indentSeq && indentStep.length >= 2 && !ctx.inFlow && !explicitKey && identity.isSeq(value) && !value.flow && !value.tag && !value.anchor) {
        ctx.indent = ctx.indent.substring(2);
      }
      let valueCommentDone = false;
      const valueStr = stringify.stringify(value, ctx, () => valueCommentDone = true, () => chompKeep = true);
      let ws = " ";
      if (keyComment || vsb || vcb) {
        ws = vsb ? "\n" : "";
        if (vcb) {
          const cs = commentString(vcb);
          ws += `
${stringifyComment.indentComment(cs, ctx.indent)}`;
        }
        if (valueStr === "" && !ctx.inFlow) {
          if (ws === "\n" && valueComment)
            ws = "\n\n";
        } else {
          ws += `
${ctx.indent}`;
        }
      } else if (!explicitKey && identity.isCollection(value)) {
        const vs0 = valueStr[0];
        const nl0 = valueStr.indexOf("\n");
        const hasNewline = nl0 !== -1;
        const flow = ctx.inFlow ?? value.flow ?? value.items.length === 0;
        if (hasNewline || !flow) {
          let hasPropsLine = false;
          if (hasNewline && (vs0 === "&" || vs0 === "!")) {
            let sp0 = valueStr.indexOf(" ");
            if (vs0 === "&" && sp0 !== -1 && sp0 < nl0 && valueStr[sp0 + 1] === "!") {
              sp0 = valueStr.indexOf(" ", sp0 + 1);
            }
            if (sp0 === -1 || nl0 < sp0)
              hasPropsLine = true;
          }
          if (!hasPropsLine)
            ws = `
${ctx.indent}`;
        }
      } else if (valueStr === "" || valueStr[0] === "\n") {
        ws = "";
      }
      str += ws + valueStr;
      if (ctx.inFlow) {
        if (valueCommentDone && onComment)
          onComment();
      } else if (valueComment && !valueCommentDone) {
        str += stringifyComment.lineComment(str, ctx.indent, commentString(valueComment));
      } else if (chompKeep && onChompKeep) {
        onChompKeep();
      }
      return str;
    }
    exports.stringifyPair = stringifyPair;
  }
});

// ../node_modules/yaml/dist/log.js
var require_log = __commonJS({
  "../node_modules/yaml/dist/log.js"(exports) {
    "use strict";
    var node_process = __require("process");
    function debug(logLevel, ...messages) {
      if (logLevel === "debug")
        console.log(...messages);
    }
    function warn(logLevel, warning) {
      if (logLevel === "debug" || logLevel === "warn") {
        if (typeof node_process.emitWarning === "function")
          node_process.emitWarning(warning);
        else
          console.warn(warning);
      }
    }
    exports.debug = debug;
    exports.warn = warn;
  }
});

// ../node_modules/yaml/dist/schema/yaml-1.1/merge.js
var require_merge = __commonJS({
  "../node_modules/yaml/dist/schema/yaml-1.1/merge.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var MERGE_KEY = "<<";
    var merge = {
      identify: (value) => value === MERGE_KEY || typeof value === "symbol" && value.description === MERGE_KEY,
      default: "key",
      tag: "tag:yaml.org,2002:merge",
      test: /^<<$/,
      resolve: () => Object.assign(new Scalar.Scalar(Symbol(MERGE_KEY)), {
        addToJSMap: addMergeToJSMap
      }),
      stringify: () => MERGE_KEY
    };
    var isMergeKey = (ctx, key) => (merge.identify(key) || identity.isScalar(key) && (!key.type || key.type === Scalar.Scalar.PLAIN) && merge.identify(key.value)) && ctx?.doc.schema.tags.some((tag) => tag.tag === merge.tag && tag.default);
    function addMergeToJSMap(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (identity.isSeq(source))
        for (const it of source.items)
          mergeValue(ctx, map, it);
      else if (Array.isArray(source))
        for (const it of source)
          mergeValue(ctx, map, it);
      else
        mergeValue(ctx, map, source);
    }
    function mergeValue(ctx, map, value) {
      const source = resolveAliasValue(ctx, value);
      if (!identity.isMap(source))
        throw new Error("Merge sources must be maps or map aliases");
      const srcMap = source.toJSON(null, ctx, Map);
      for (const [key, value2] of srcMap) {
        if (map instanceof Map) {
          if (!map.has(key))
            map.set(key, value2);
        } else if (map instanceof Set) {
          map.add(key);
        } else if (!Object.prototype.hasOwnProperty.call(map, key)) {
          Object.defineProperty(map, key, {
            value: value2,
            writable: true,
            enumerable: true,
            configurable: true
          });
        }
      }
      return map;
    }
    function resolveAliasValue(ctx, value) {
      return ctx && identity.isAlias(value) ? value.resolve(ctx.doc, ctx) : value;
    }
    exports.addMergeToJSMap = addMergeToJSMap;
    exports.isMergeKey = isMergeKey;
    exports.merge = merge;
  }
});

// ../node_modules/yaml/dist/nodes/addPairToJSMap.js
var require_addPairToJSMap = __commonJS({
  "../node_modules/yaml/dist/nodes/addPairToJSMap.js"(exports) {
    "use strict";
    var log = require_log();
    var merge = require_merge();
    var stringify = require_stringify();
    var identity = require_identity();
    var toJS = require_toJS();
    function addPairToJSMap(ctx, map, { key, value }) {
      if (identity.isNode(key) && key.addToJSMap)
        key.addToJSMap(ctx, map, value);
      else if (merge.isMergeKey(ctx, key))
        merge.addMergeToJSMap(ctx, map, value);
      else {
        const jsKey = toJS.toJS(key, "", ctx);
        if (map instanceof Map) {
          map.set(jsKey, toJS.toJS(value, jsKey, ctx));
        } else if (map instanceof Set) {
          map.add(jsKey);
        } else {
          const stringKey = stringifyKey(key, jsKey, ctx);
          const jsValue = toJS.toJS(value, stringKey, ctx);
          if (stringKey in map)
            Object.defineProperty(map, stringKey, {
              value: jsValue,
              writable: true,
              enumerable: true,
              configurable: true
            });
          else
            map[stringKey] = jsValue;
        }
      }
      return map;
    }
    function stringifyKey(key, jsKey, ctx) {
      if (jsKey === null)
        return "";
      if (typeof jsKey !== "object")
        return String(jsKey);
      if (identity.isNode(key) && ctx?.doc) {
        const strCtx = stringify.createStringifyContext(ctx.doc, {});
        strCtx.anchors = /* @__PURE__ */ new Set();
        for (const node of ctx.anchors.keys())
          strCtx.anchors.add(node.anchor);
        strCtx.inFlow = true;
        strCtx.inStringifyKey = true;
        const strKey = key.toString(strCtx);
        if (!ctx.mapKeyWarned) {
          let jsonStr = JSON.stringify(strKey);
          if (jsonStr.length > 40)
            jsonStr = jsonStr.substring(0, 36) + '..."';
          log.warn(ctx.doc.options.logLevel, `Keys with collection values will be stringified due to JS Object restrictions: ${jsonStr}. Set mapAsMap: true to use object keys.`);
          ctx.mapKeyWarned = true;
        }
        return strKey;
      }
      return JSON.stringify(jsKey);
    }
    exports.addPairToJSMap = addPairToJSMap;
  }
});

// ../node_modules/yaml/dist/nodes/Pair.js
var require_Pair = __commonJS({
  "../node_modules/yaml/dist/nodes/Pair.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyPair = require_stringifyPair();
    var addPairToJSMap = require_addPairToJSMap();
    var identity = require_identity();
    function createPair(key, value, ctx) {
      const k = createNode.createNode(key, void 0, ctx);
      const v = createNode.createNode(value, void 0, ctx);
      return new Pair(k, v);
    }
    var Pair = class _Pair {
      constructor(key, value = null) {
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.PAIR });
        this.key = key;
        this.value = value;
      }
      clone(schema) {
        let { key, value } = this;
        if (identity.isNode(key))
          key = key.clone(schema);
        if (identity.isNode(value))
          value = value.clone(schema);
        return new _Pair(key, value);
      }
      toJSON(_, ctx) {
        const pair2 = ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        return addPairToJSMap.addPairToJSMap(ctx, pair2, this);
      }
      toString(ctx, onComment, onChompKeep) {
        return ctx?.doc ? stringifyPair.stringifyPair(this, ctx, onComment, onChompKeep) : JSON.stringify(this);
      }
    };
    exports.Pair = Pair;
    exports.createPair = createPair;
  }
});

// ../node_modules/yaml/dist/stringify/stringifyCollection.js
var require_stringifyCollection = __commonJS({
  "../node_modules/yaml/dist/stringify/stringifyCollection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyCollection(collection, ctx, options) {
      const flow = ctx.inFlow ?? collection.flow;
      const stringify2 = flow ? stringifyFlowCollection : stringifyBlockCollection;
      return stringify2(collection, ctx, options);
    }
    function stringifyBlockCollection({ comment, items }, ctx, { blockItemPrefix, flowChars, itemIndent, onChompKeep, onComment }) {
      const { indent, options: { commentString } } = ctx;
      const itemCtx = Object.assign({}, ctx, { indent: itemIndent, type: null });
      let chompKeep = false;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment2 = null;
        if (identity.isNode(item)) {
          if (!chompKeep && item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, chompKeep);
          if (item.comment)
            comment2 = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (!chompKeep && ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, chompKeep);
          }
        }
        chompKeep = false;
        let str2 = stringify.stringify(item, itemCtx, () => comment2 = null, () => chompKeep = true);
        if (comment2)
          str2 += stringifyComment.lineComment(str2, itemIndent, commentString(comment2));
        if (chompKeep && comment2)
          chompKeep = false;
        lines.push(blockItemPrefix + str2);
      }
      let str;
      if (lines.length === 0) {
        str = flowChars.start + flowChars.end;
      } else {
        str = lines[0];
        for (let i = 1; i < lines.length; ++i) {
          const line = lines[i];
          str += line ? `
${indent}${line}` : "\n";
        }
      }
      if (comment) {
        str += "\n" + stringifyComment.indentComment(commentString(comment), indent);
        if (onComment)
          onComment();
      } else if (chompKeep && onChompKeep)
        onChompKeep();
      return str;
    }
    function stringifyFlowCollection({ items }, ctx, { flowChars, itemIndent }) {
      const { indent, indentStep, flowCollectionPadding: fcPadding, options: { commentString } } = ctx;
      itemIndent += indentStep;
      const itemCtx = Object.assign({}, ctx, {
        indent: itemIndent,
        inFlow: true,
        type: null
      });
      let reqNewline = false;
      let linesAtValue = 0;
      const lines = [];
      for (let i = 0; i < items.length; ++i) {
        const item = items[i];
        let comment = null;
        if (identity.isNode(item)) {
          if (item.spaceBefore)
            lines.push("");
          addCommentBefore(ctx, lines, item.commentBefore, false);
          if (item.comment)
            comment = item.comment;
        } else if (identity.isPair(item)) {
          const ik = identity.isNode(item.key) ? item.key : null;
          if (ik) {
            if (ik.spaceBefore)
              lines.push("");
            addCommentBefore(ctx, lines, ik.commentBefore, false);
            if (ik.comment)
              reqNewline = true;
          }
          const iv = identity.isNode(item.value) ? item.value : null;
          if (iv) {
            if (iv.comment)
              comment = iv.comment;
            if (iv.commentBefore)
              reqNewline = true;
          } else if (item.value == null && ik?.comment) {
            comment = ik.comment;
          }
        }
        if (comment)
          reqNewline = true;
        let str = stringify.stringify(item, itemCtx, () => comment = null);
        reqNewline || (reqNewline = lines.length > linesAtValue || str.includes("\n"));
        if (i < items.length - 1) {
          str += ",";
        } else if (ctx.options.trailingComma) {
          if (ctx.options.lineWidth > 0) {
            reqNewline || (reqNewline = lines.reduce((sum, line) => sum + line.length + 2, 2) + (str.length + 2) > ctx.options.lineWidth);
          }
          if (reqNewline) {
            str += ",";
          }
        }
        if (comment)
          str += stringifyComment.lineComment(str, itemIndent, commentString(comment));
        lines.push(str);
        linesAtValue = lines.length;
      }
      const { start, end } = flowChars;
      if (lines.length === 0) {
        return start + end;
      } else {
        if (!reqNewline) {
          const len = lines.reduce((sum, line) => sum + line.length + 2, 2);
          reqNewline = ctx.options.lineWidth > 0 && len > ctx.options.lineWidth;
        }
        if (reqNewline) {
          let str = start;
          for (const line of lines)
            str += line ? `
${indentStep}${indent}${line}` : "\n";
          return `${str}
${indent}${end}`;
        } else {
          return `${start}${fcPadding}${lines.join(" ")}${fcPadding}${end}`;
        }
      }
    }
    function addCommentBefore({ indent, options: { commentString } }, lines, comment, chompKeep) {
      if (comment && chompKeep)
        comment = comment.replace(/^\n+/, "");
      if (comment) {
        const ic = stringifyComment.indentComment(commentString(comment), indent);
        lines.push(ic.trimStart());
      }
    }
    exports.stringifyCollection = stringifyCollection;
  }
});

// ../node_modules/yaml/dist/nodes/YAMLMap.js
var require_YAMLMap = __commonJS({
  "../node_modules/yaml/dist/nodes/YAMLMap.js"(exports) {
    "use strict";
    var stringifyCollection = require_stringifyCollection();
    var addPairToJSMap = require_addPairToJSMap();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    function findPair(items, key) {
      const k = identity.isScalar(key) ? key.value : key;
      for (const it of items) {
        if (identity.isPair(it)) {
          if (it.key === key || it.key === k)
            return it;
          if (identity.isScalar(it.key) && it.key.value === k)
            return it;
        }
      }
      return void 0;
    }
    var YAMLMap = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:map";
      }
      constructor(schema) {
        super(identity.MAP, schema);
        this.items = [];
      }
      /**
       * A generic collection parsing method that can be extended
       * to other node classes that inherit from YAMLMap
       */
      static from(schema, obj, ctx) {
        const { keepUndefined, replacer } = ctx;
        const map = new this(schema);
        const add = (key, value) => {
          if (typeof replacer === "function")
            value = replacer.call(obj, key, value);
          else if (Array.isArray(replacer) && !replacer.includes(key))
            return;
          if (value !== void 0 || keepUndefined)
            map.items.push(Pair.createPair(key, value, ctx));
        };
        if (obj instanceof Map) {
          for (const [key, value] of obj)
            add(key, value);
        } else if (obj && typeof obj === "object") {
          for (const key of Object.keys(obj))
            add(key, obj[key]);
        }
        if (typeof schema.sortMapEntries === "function") {
          map.items.sort(schema.sortMapEntries);
        }
        return map;
      }
      /**
       * Adds a value to the collection.
       *
       * @param overwrite - If not set `true`, using a key that is already in the
       *   collection will throw. Otherwise, overwrites the previous value.
       */
      add(pair2, overwrite) {
        let _pair;
        if (identity.isPair(pair2))
          _pair = pair2;
        else if (!pair2 || typeof pair2 !== "object" || !("key" in pair2)) {
          _pair = new Pair.Pair(pair2, pair2?.value);
        } else
          _pair = new Pair.Pair(pair2.key, pair2.value);
        const prev = findPair(this.items, _pair.key);
        const sortEntries = this.schema?.sortMapEntries;
        if (prev) {
          if (!overwrite)
            throw new Error(`Key ${_pair.key} already set`);
          if (identity.isScalar(prev.value) && Scalar.isScalarValue(_pair.value))
            prev.value.value = _pair.value;
          else
            prev.value = _pair.value;
        } else if (sortEntries) {
          const i = this.items.findIndex((item) => sortEntries(_pair, item) < 0);
          if (i === -1)
            this.items.push(_pair);
          else
            this.items.splice(i, 0, _pair);
        } else {
          this.items.push(_pair);
        }
      }
      delete(key) {
        const it = findPair(this.items, key);
        if (!it)
          return false;
        const del = this.items.splice(this.items.indexOf(it), 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const it = findPair(this.items, key);
        const node = it?.value;
        return (!keepScalar && identity.isScalar(node) ? node.value : node) ?? void 0;
      }
      has(key) {
        return !!findPair(this.items, key);
      }
      set(key, value) {
        this.add(new Pair.Pair(key, value), true);
      }
      /**
       * @param ctx - Conversion context, originally set in Document#toJS()
       * @param {Class} Type - If set, forces the returned collection type
       * @returns Instance of Type, Map, or Object
       */
      toJSON(_, ctx, Type) {
        const map = Type ? new Type() : ctx?.mapAsMap ? /* @__PURE__ */ new Map() : {};
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const item of this.items)
          addPairToJSMap.addPairToJSMap(ctx, map, item);
        return map;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        for (const item of this.items) {
          if (!identity.isPair(item))
            throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
        }
        if (!ctx.allNullValues && this.hasAllNullValues(false))
          ctx = Object.assign({}, ctx, { allNullValues: true });
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "",
          flowChars: { start: "{", end: "}" },
          itemIndent: ctx.indent || "",
          onChompKeep,
          onComment
        });
      }
    };
    exports.YAMLMap = YAMLMap;
    exports.findPair = findPair;
  }
});

// ../node_modules/yaml/dist/schema/common/map.js
var require_map = __commonJS({
  "../node_modules/yaml/dist/schema/common/map.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLMap = require_YAMLMap();
    var map = {
      collection: "map",
      default: true,
      nodeClass: YAMLMap.YAMLMap,
      tag: "tag:yaml.org,2002:map",
      resolve(map2, onError) {
        if (!identity.isMap(map2))
          onError("Expected a mapping for this tag");
        return map2;
      },
      createNode: (schema, obj, ctx) => YAMLMap.YAMLMap.from(schema, obj, ctx)
    };
    exports.map = map;
  }
});

// ../node_modules/yaml/dist/nodes/YAMLSeq.js
var require_YAMLSeq = __commonJS({
  "../node_modules/yaml/dist/nodes/YAMLSeq.js"(exports) {
    "use strict";
    var createNode = require_createNode();
    var stringifyCollection = require_stringifyCollection();
    var Collection = require_Collection();
    var identity = require_identity();
    var Scalar = require_Scalar();
    var toJS = require_toJS();
    var YAMLSeq = class extends Collection.Collection {
      static get tagName() {
        return "tag:yaml.org,2002:seq";
      }
      constructor(schema) {
        super(identity.SEQ, schema);
        this.items = [];
      }
      add(value) {
        this.items.push(value);
      }
      /**
       * Removes a value from the collection.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       *
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return false;
        const del = this.items.splice(idx, 1);
        return del.length > 0;
      }
      get(key, keepScalar) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          return void 0;
        const it = this.items[idx];
        return !keepScalar && identity.isScalar(it) ? it.value : it;
      }
      /**
       * Checks if the collection includes a value with the key `key`.
       *
       * `key` must contain a representation of an integer for this to succeed.
       * It may be wrapped in a `Scalar`.
       */
      has(key) {
        const idx = asItemIndex(key);
        return typeof idx === "number" && idx < this.items.length;
      }
      /**
       * Sets a value in this collection. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       *
       * If `key` does not contain a representation of an integer, this will throw.
       * It may be wrapped in a `Scalar`.
       */
      set(key, value) {
        const idx = asItemIndex(key);
        if (typeof idx !== "number")
          throw new Error(`Expected a valid index, not ${key}.`);
        const prev = this.items[idx];
        if (identity.isScalar(prev) && Scalar.isScalarValue(value))
          prev.value = value;
        else
          this.items[idx] = value;
      }
      toJSON(_, ctx) {
        const seq = [];
        if (ctx?.onCreate)
          ctx.onCreate(seq);
        let i = 0;
        for (const item of this.items)
          seq.push(toJS.toJS(item, String(i++), ctx));
        return seq;
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        return stringifyCollection.stringifyCollection(this, ctx, {
          blockItemPrefix: "- ",
          flowChars: { start: "[", end: "]" },
          itemIndent: (ctx.indent || "") + "  ",
          onChompKeep,
          onComment
        });
      }
      static from(schema, obj, ctx) {
        const { replacer } = ctx;
        const seq = new this(schema);
        if (obj && Symbol.iterator in Object(obj)) {
          let i = 0;
          for (let it of obj) {
            if (typeof replacer === "function") {
              const key = obj instanceof Set ? it : String(i++);
              it = replacer.call(obj, key, it);
            }
            seq.items.push(createNode.createNode(it, void 0, ctx));
          }
        }
        return seq;
      }
    };
    function asItemIndex(key) {
      let idx = identity.isScalar(key) ? key.value : key;
      if (idx && typeof idx === "string")
        idx = Number(idx);
      return typeof idx === "number" && Number.isInteger(idx) && idx >= 0 ? idx : null;
    }
    exports.YAMLSeq = YAMLSeq;
  }
});

// ../node_modules/yaml/dist/schema/common/seq.js
var require_seq = __commonJS({
  "../node_modules/yaml/dist/schema/common/seq.js"(exports) {
    "use strict";
    var identity = require_identity();
    var YAMLSeq = require_YAMLSeq();
    var seq = {
      collection: "seq",
      default: true,
      nodeClass: YAMLSeq.YAMLSeq,
      tag: "tag:yaml.org,2002:seq",
      resolve(seq2, onError) {
        if (!identity.isSeq(seq2))
          onError("Expected a sequence for this tag");
        return seq2;
      },
      createNode: (schema, obj, ctx) => YAMLSeq.YAMLSeq.from(schema, obj, ctx)
    };
    exports.seq = seq;
  }
});

// ../node_modules/yaml/dist/schema/common/string.js
var require_string = __commonJS({
  "../node_modules/yaml/dist/schema/common/string.js"(exports) {
    "use strict";
    var stringifyString = require_stringifyString();
    var string = {
      identify: (value) => typeof value === "string",
      default: true,
      tag: "tag:yaml.org,2002:str",
      resolve: (str) => str,
      stringify(item, ctx, onComment, onChompKeep) {
        ctx = Object.assign({ actualString: true }, ctx);
        return stringifyString.stringifyString(item, ctx, onComment, onChompKeep);
      }
    };
    exports.string = string;
  }
});

// ../node_modules/yaml/dist/schema/common/null.js
var require_null = __commonJS({
  "../node_modules/yaml/dist/schema/common/null.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var nullTag = {
      identify: (value) => value == null,
      createNode: () => new Scalar.Scalar(null),
      default: true,
      tag: "tag:yaml.org,2002:null",
      test: /^(?:~|[Nn]ull|NULL)?$/,
      resolve: () => new Scalar.Scalar(null),
      stringify: ({ source }, ctx) => typeof source === "string" && nullTag.test.test(source) ? source : ctx.options.nullStr
    };
    exports.nullTag = nullTag;
  }
});

// ../node_modules/yaml/dist/schema/core/bool.js
var require_bool = __commonJS({
  "../node_modules/yaml/dist/schema/core/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var boolTag = {
      identify: (value) => typeof value === "boolean",
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
      resolve: (str) => new Scalar.Scalar(str[0] === "t" || str[0] === "T"),
      stringify({ source, value }, ctx) {
        if (source && boolTag.test.test(source)) {
          const sv = source[0] === "t" || source[0] === "T";
          if (value === sv)
            return source;
        }
        return value ? ctx.options.trueStr : ctx.options.falseStr;
      }
    };
    exports.boolTag = boolTag;
  }
});

// ../node_modules/yaml/dist/stringify/stringifyNumber.js
var require_stringifyNumber = __commonJS({
  "../node_modules/yaml/dist/stringify/stringifyNumber.js"(exports) {
    "use strict";
    function stringifyNumber({ format: format2, minFractionDigits, tag, value }) {
      if (typeof value === "bigint")
        return String(value);
      const num = typeof value === "number" ? value : Number(value);
      if (!isFinite(num))
        return isNaN(num) ? ".nan" : num < 0 ? "-.inf" : ".inf";
      let n = Object.is(value, -0) ? "-0" : JSON.stringify(value);
      if (!format2 && minFractionDigits && (!tag || tag === "tag:yaml.org,2002:float") && /^-?\d/.test(n) && !n.includes("e")) {
        let i = n.indexOf(".");
        if (i < 0) {
          i = n.length;
          n += ".";
        }
        let d = minFractionDigits - (n.length - i - 1);
        while (d-- > 0)
          n += "0";
      }
      return n;
    }
    exports.stringifyNumber = stringifyNumber;
  }
});

// ../node_modules/yaml/dist/schema/core/float.js
var require_float = __commonJS({
  "../node_modules/yaml/dist/schema/core/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+(?:\.[0-9]*)?)[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:\.[0-9]+|[0-9]+\.[0-9]*)$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str));
        const dot = str.indexOf(".");
        if (dot !== -1 && str[str.length - 1] === "0")
          node.minFractionDigits = str.length - dot - 1;
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// ../node_modules/yaml/dist/schema/core/int.js
var require_int = __commonJS({
  "../node_modules/yaml/dist/schema/core/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    var intResolve = (str, offset, radix, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str.substring(offset), radix);
    function intStringify(node, radix, prefix2) {
      const { value } = node;
      if (intIdentify(value) && value >= 0)
        return prefix2 + value.toString(radix);
      return stringifyNumber.stringifyNumber(node);
    }
    var intOct = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^0o[0-7]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 8, opt),
      stringify: (node) => intStringify(node, 8, "0o")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: (value) => intIdentify(value) && value >= 0,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^0x[0-9a-fA-F]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// ../node_modules/yaml/dist/schema/core/schema.js
var require_schema = __commonJS({
  "../node_modules/yaml/dist/schema/core/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.boolTag,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float
    ];
    exports.schema = schema;
  }
});

// ../node_modules/yaml/dist/schema/json/schema.js
var require_schema2 = __commonJS({
  "../node_modules/yaml/dist/schema/json/schema.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var map = require_map();
    var seq = require_seq();
    function intIdentify(value) {
      return typeof value === "bigint" || Number.isInteger(value);
    }
    var stringifyJSON = ({ value }) => JSON.stringify(value);
    var jsonScalars = [
      {
        identify: (value) => typeof value === "string",
        default: true,
        tag: "tag:yaml.org,2002:str",
        resolve: (str) => str,
        stringify: stringifyJSON
      },
      {
        identify: (value) => value == null,
        createNode: () => new Scalar.Scalar(null),
        default: true,
        tag: "tag:yaml.org,2002:null",
        test: /^null$/,
        resolve: () => null,
        stringify: stringifyJSON
      },
      {
        identify: (value) => typeof value === "boolean",
        default: true,
        tag: "tag:yaml.org,2002:bool",
        test: /^true$|^false$/,
        resolve: (str) => str === "true",
        stringify: stringifyJSON
      },
      {
        identify: intIdentify,
        default: true,
        tag: "tag:yaml.org,2002:int",
        test: /^-?(?:0|[1-9][0-9]*)$/,
        resolve: (str, _onError, { intAsBigInt }) => intAsBigInt ? BigInt(str) : parseInt(str, 10),
        stringify: ({ value }) => intIdentify(value) ? value.toString() : JSON.stringify(value)
      },
      {
        identify: (value) => typeof value === "number",
        default: true,
        tag: "tag:yaml.org,2002:float",
        test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
        resolve: (str) => parseFloat(str),
        stringify: stringifyJSON
      }
    ];
    var jsonError = {
      default: true,
      tag: "",
      test: /^/,
      resolve(str, onError) {
        onError(`Unresolved plain scalar ${JSON.stringify(str)}`);
        return str;
      }
    };
    var schema = [map.map, seq.seq].concat(jsonScalars, jsonError);
    exports.schema = schema;
  }
});

// ../node_modules/yaml/dist/schema/yaml-1.1/binary.js
var require_binary = __commonJS({
  "../node_modules/yaml/dist/schema/yaml-1.1/binary.js"(exports) {
    "use strict";
    var node_buffer = __require("buffer");
    var Scalar = require_Scalar();
    var stringifyString = require_stringifyString();
    var binary = {
      identify: (value) => value instanceof Uint8Array,
      // Buffer inherits from Uint8Array
      default: false,
      tag: "tag:yaml.org,2002:binary",
      /**
       * Returns a Buffer in node and an Uint8Array in browsers
       *
       * To use the resulting buffer as an image, you'll want to do something like:
       *
       *   const blob = new Blob([buffer], { type: 'image/jpeg' })
       *   document.querySelector('#photo').src = URL.createObjectURL(blob)
       */
      resolve(src, onError) {
        if (typeof node_buffer.Buffer === "function") {
          return node_buffer.Buffer.from(src, "base64");
        } else if (typeof atob === "function") {
          const str = atob(src.replace(/[\n\r]/g, ""));
          const buffer = new Uint8Array(str.length);
          for (let i = 0; i < str.length; ++i)
            buffer[i] = str.charCodeAt(i);
          return buffer;
        } else {
          onError("This environment does not support reading binary tags; either Buffer or atob is required");
          return src;
        }
      },
      stringify({ comment, type, value }, ctx, onComment, onChompKeep) {
        if (!value)
          return "";
        const buf = value;
        let str;
        if (typeof node_buffer.Buffer === "function") {
          str = buf instanceof node_buffer.Buffer ? buf.toString("base64") : node_buffer.Buffer.from(buf.buffer).toString("base64");
        } else if (typeof btoa === "function") {
          let s = "";
          for (let i = 0; i < buf.length; ++i)
            s += String.fromCharCode(buf[i]);
          str = btoa(s);
        } else {
          throw new Error("This environment does not support writing binary tags; either Buffer or btoa is required");
        }
        type ?? (type = Scalar.Scalar.BLOCK_LITERAL);
        if (type !== Scalar.Scalar.QUOTE_DOUBLE) {
          const lineWidth = Math.max(ctx.options.lineWidth - ctx.indent.length, ctx.options.minContentWidth);
          const n = Math.ceil(str.length / lineWidth);
          const lines = new Array(n);
          for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
            lines[i] = str.substr(o, lineWidth);
          }
          str = lines.join(type === Scalar.Scalar.BLOCK_LITERAL ? "\n" : " ");
        }
        return stringifyString.stringifyString({ comment, type, value: str }, ctx, onComment, onChompKeep);
      }
    };
    exports.binary = binary;
  }
});

// ../node_modules/yaml/dist/schema/yaml-1.1/pairs.js
var require_pairs = __commonJS({
  "../node_modules/yaml/dist/schema/yaml-1.1/pairs.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLSeq = require_YAMLSeq();
    function resolvePairs(seq, onError) {
      if (identity.isSeq(seq)) {
        for (let i = 0; i < seq.items.length; ++i) {
          let item = seq.items[i];
          if (identity.isPair(item))
            continue;
          else if (identity.isMap(item)) {
            if (item.items.length > 1)
              onError("Each pair must have its own sequence indicator");
            const pair2 = item.items[0] || new Pair.Pair(new Scalar.Scalar(null));
            if (item.commentBefore)
              pair2.key.commentBefore = pair2.key.commentBefore ? `${item.commentBefore}
${pair2.key.commentBefore}` : item.commentBefore;
            if (item.comment) {
              const cn = pair2.value ?? pair2.key;
              cn.comment = cn.comment ? `${item.comment}
${cn.comment}` : item.comment;
            }
            item = pair2;
          }
          seq.items[i] = identity.isPair(item) ? item : new Pair.Pair(item);
        }
      } else
        onError("Expected a sequence for this tag");
      return seq;
    }
    function createPairs(schema, iterable, ctx) {
      const { replacer } = ctx;
      const pairs2 = new YAMLSeq.YAMLSeq(schema);
      pairs2.tag = "tag:yaml.org,2002:pairs";
      let i = 0;
      if (iterable && Symbol.iterator in Object(iterable))
        for (let it of iterable) {
          if (typeof replacer === "function")
            it = replacer.call(iterable, String(i++), it);
          let key, value;
          if (Array.isArray(it)) {
            if (it.length === 2) {
              key = it[0];
              value = it[1];
            } else
              throw new TypeError(`Expected [key, value] tuple: ${it}`);
          } else if (it && it instanceof Object) {
            const keys = Object.keys(it);
            if (keys.length === 1) {
              key = keys[0];
              value = it[key];
            } else {
              throw new TypeError(`Expected tuple with one key, not ${keys.length} keys`);
            }
          } else {
            key = it;
          }
          pairs2.items.push(Pair.createPair(key, value, ctx));
        }
      return pairs2;
    }
    var pairs = {
      collection: "seq",
      default: false,
      tag: "tag:yaml.org,2002:pairs",
      resolve: resolvePairs,
      createNode: createPairs
    };
    exports.createPairs = createPairs;
    exports.pairs = pairs;
    exports.resolvePairs = resolvePairs;
  }
});

// ../node_modules/yaml/dist/schema/yaml-1.1/omap.js
var require_omap = __commonJS({
  "../node_modules/yaml/dist/schema/yaml-1.1/omap.js"(exports) {
    "use strict";
    var identity = require_identity();
    var toJS = require_toJS();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var pairs = require_pairs();
    var YAMLOMap = class _YAMLOMap extends YAMLSeq.YAMLSeq {
      constructor() {
        super();
        this.add = YAMLMap.YAMLMap.prototype.add.bind(this);
        this.delete = YAMLMap.YAMLMap.prototype.delete.bind(this);
        this.get = YAMLMap.YAMLMap.prototype.get.bind(this);
        this.has = YAMLMap.YAMLMap.prototype.has.bind(this);
        this.set = YAMLMap.YAMLMap.prototype.set.bind(this);
        this.tag = _YAMLOMap.tag;
      }
      /**
       * If `ctx` is given, the return type is actually `Map<unknown, unknown>`,
       * but TypeScript won't allow widening the signature of a child method.
       */
      toJSON(_, ctx) {
        if (!ctx)
          return super.toJSON(_);
        const map = /* @__PURE__ */ new Map();
        if (ctx?.onCreate)
          ctx.onCreate(map);
        for (const pair2 of this.items) {
          let key, value;
          if (identity.isPair(pair2)) {
            key = toJS.toJS(pair2.key, "", ctx);
            value = toJS.toJS(pair2.value, key, ctx);
          } else {
            key = toJS.toJS(pair2, "", ctx);
          }
          if (map.has(key))
            throw new Error("Ordered maps must not include duplicate keys");
          map.set(key, value);
        }
        return map;
      }
      static from(schema, iterable, ctx) {
        const pairs$1 = pairs.createPairs(schema, iterable, ctx);
        const omap2 = new this();
        omap2.items = pairs$1.items;
        return omap2;
      }
    };
    YAMLOMap.tag = "tag:yaml.org,2002:omap";
    var omap = {
      collection: "seq",
      identify: (value) => value instanceof Map,
      nodeClass: YAMLOMap,
      default: false,
      tag: "tag:yaml.org,2002:omap",
      resolve(seq, onError) {
        const pairs$1 = pairs.resolvePairs(seq, onError);
        const seenKeys = [];
        for (const { key } of pairs$1.items) {
          if (identity.isScalar(key)) {
            if (seenKeys.includes(key.value)) {
              onError(`Ordered maps must not include duplicate keys: ${key.value}`);
            } else {
              seenKeys.push(key.value);
            }
          }
        }
        return Object.assign(new YAMLOMap(), pairs$1);
      },
      createNode: (schema, iterable, ctx) => YAMLOMap.from(schema, iterable, ctx)
    };
    exports.YAMLOMap = YAMLOMap;
    exports.omap = omap;
  }
});

// ../node_modules/yaml/dist/schema/yaml-1.1/bool.js
var require_bool2 = __commonJS({
  "../node_modules/yaml/dist/schema/yaml-1.1/bool.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function boolStringify({ value, source }, ctx) {
      const boolObj = value ? trueTag : falseTag;
      if (source && boolObj.test.test(source))
        return source;
      return value ? ctx.options.trueStr : ctx.options.falseStr;
    }
    var trueTag = {
      identify: (value) => value === true,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
      resolve: () => new Scalar.Scalar(true),
      stringify: boolStringify
    };
    var falseTag = {
      identify: (value) => value === false,
      default: true,
      tag: "tag:yaml.org,2002:bool",
      test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/,
      resolve: () => new Scalar.Scalar(false),
      stringify: boolStringify
    };
    exports.falseTag = falseTag;
    exports.trueTag = trueTag;
  }
});

// ../node_modules/yaml/dist/schema/yaml-1.1/float.js
var require_float2 = __commonJS({
  "../node_modules/yaml/dist/schema/yaml-1.1/float.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var stringifyNumber = require_stringifyNumber();
    var floatNaN = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^(?:[-+]?\.(?:inf|Inf|INF)|\.nan|\.NaN|\.NAN)$/,
      resolve: (str) => str.slice(-3).toLowerCase() === "nan" ? NaN : str[0] === "-" ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
      stringify: stringifyNumber.stringifyNumber
    };
    var floatExp = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "EXP",
      test: /^[-+]?(?:[0-9][0-9_]*)?(?:\.[0-9_]*)?[eE][-+]?[0-9]+$/,
      resolve: (str) => parseFloat(str.replace(/_/g, "")),
      stringify(node) {
        const num = Number(node.value);
        return isFinite(num) ? num.toExponential() : stringifyNumber.stringifyNumber(node);
      }
    };
    var float = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      test: /^[-+]?(?:[0-9][0-9_]*)?\.[0-9_]*$/,
      resolve(str) {
        const node = new Scalar.Scalar(parseFloat(str.replace(/_/g, "")));
        const dot = str.indexOf(".");
        if (dot !== -1) {
          const f = str.substring(dot + 1).replace(/_/g, "");
          if (f[f.length - 1] === "0")
            node.minFractionDigits = f.length;
        }
        return node;
      },
      stringify: stringifyNumber.stringifyNumber
    };
    exports.float = float;
    exports.floatExp = floatExp;
    exports.floatNaN = floatNaN;
  }
});

// ../node_modules/yaml/dist/schema/yaml-1.1/int.js
var require_int2 = __commonJS({
  "../node_modules/yaml/dist/schema/yaml-1.1/int.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    var intIdentify = (value) => typeof value === "bigint" || Number.isInteger(value);
    function intResolve(str, offset, radix, { intAsBigInt }) {
      const sign = str[0];
      if (sign === "-" || sign === "+")
        offset += 1;
      str = str.substring(offset).replace(/_/g, "");
      if (intAsBigInt) {
        switch (radix) {
          case 2:
            str = `0b${str}`;
            break;
          case 8:
            str = `0o${str}`;
            break;
          case 16:
            str = `0x${str}`;
            break;
        }
        const n2 = BigInt(str);
        return sign === "-" ? BigInt(-1) * n2 : n2;
      }
      const n = parseInt(str, radix);
      return sign === "-" ? -1 * n : n;
    }
    function intStringify(node, radix, prefix2) {
      const { value } = node;
      if (intIdentify(value)) {
        const str = value.toString(radix);
        return value < 0 ? "-" + prefix2 + str.substr(1) : prefix2 + str;
      }
      return stringifyNumber.stringifyNumber(node);
    }
    var intBin = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "BIN",
      test: /^[-+]?0b[0-1_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 2, opt),
      stringify: (node) => intStringify(node, 2, "0b")
    };
    var intOct = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "OCT",
      test: /^[-+]?0[0-7_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 1, 8, opt),
      stringify: (node) => intStringify(node, 8, "0")
    };
    var int = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      test: /^[-+]?[0-9][0-9_]*$/,
      resolve: (str, _onError, opt) => intResolve(str, 0, 10, opt),
      stringify: stringifyNumber.stringifyNumber
    };
    var intHex = {
      identify: intIdentify,
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "HEX",
      test: /^[-+]?0x[0-9a-fA-F_]+$/,
      resolve: (str, _onError, opt) => intResolve(str, 2, 16, opt),
      stringify: (node) => intStringify(node, 16, "0x")
    };
    exports.int = int;
    exports.intBin = intBin;
    exports.intHex = intHex;
    exports.intOct = intOct;
  }
});

// ../node_modules/yaml/dist/schema/yaml-1.1/set.js
var require_set = __commonJS({
  "../node_modules/yaml/dist/schema/yaml-1.1/set.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSet = class _YAMLSet extends YAMLMap.YAMLMap {
      constructor(schema) {
        super(schema);
        this.tag = _YAMLSet.tag;
      }
      add(key) {
        let pair2;
        if (identity.isPair(key))
          pair2 = key;
        else if (key && typeof key === "object" && "key" in key && "value" in key && key.value === null)
          pair2 = new Pair.Pair(key.key, null);
        else
          pair2 = new Pair.Pair(key, null);
        const prev = YAMLMap.findPair(this.items, pair2.key);
        if (!prev)
          this.items.push(pair2);
      }
      /**
       * If `keepPair` is `true`, returns the Pair matching `key`.
       * Otherwise, returns the value of that Pair's key.
       */
      get(key, keepPair) {
        const pair2 = YAMLMap.findPair(this.items, key);
        return !keepPair && identity.isPair(pair2) ? identity.isScalar(pair2.key) ? pair2.key.value : pair2.key : pair2;
      }
      set(key, value) {
        if (typeof value !== "boolean")
          throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
        const prev = YAMLMap.findPair(this.items, key);
        if (prev && !value) {
          this.items.splice(this.items.indexOf(prev), 1);
        } else if (!prev && value) {
          this.items.push(new Pair.Pair(key));
        }
      }
      toJSON(_, ctx) {
        return super.toJSON(_, ctx, Set);
      }
      toString(ctx, onComment, onChompKeep) {
        if (!ctx)
          return JSON.stringify(this);
        if (this.hasAllNullValues(true))
          return super.toString(Object.assign({}, ctx, { allNullValues: true }), onComment, onChompKeep);
        else
          throw new Error("Set items must all have null values");
      }
      static from(schema, iterable, ctx) {
        const { replacer } = ctx;
        const set2 = new this(schema);
        if (iterable && Symbol.iterator in Object(iterable))
          for (let value of iterable) {
            if (typeof replacer === "function")
              value = replacer.call(iterable, value, value);
            set2.items.push(Pair.createPair(value, null, ctx));
          }
        return set2;
      }
    };
    YAMLSet.tag = "tag:yaml.org,2002:set";
    var set = {
      collection: "map",
      identify: (value) => value instanceof Set,
      nodeClass: YAMLSet,
      default: false,
      tag: "tag:yaml.org,2002:set",
      createNode: (schema, iterable, ctx) => YAMLSet.from(schema, iterable, ctx),
      resolve(map, onError) {
        if (identity.isMap(map)) {
          if (map.hasAllNullValues(true))
            return Object.assign(new YAMLSet(), map);
          else
            onError("Set items must all have null values");
        } else
          onError("Expected a mapping for this tag");
        return map;
      }
    };
    exports.YAMLSet = YAMLSet;
    exports.set = set;
  }
});

// ../node_modules/yaml/dist/schema/yaml-1.1/timestamp.js
var require_timestamp = __commonJS({
  "../node_modules/yaml/dist/schema/yaml-1.1/timestamp.js"(exports) {
    "use strict";
    var stringifyNumber = require_stringifyNumber();
    function parseSexagesimal(str, asBigInt) {
      const sign = str[0];
      const parts = sign === "-" || sign === "+" ? str.substring(1) : str;
      const num = (n) => asBigInt ? BigInt(n) : Number(n);
      const res = parts.replace(/_/g, "").split(":").reduce((res2, p) => res2 * num(60) + num(p), num(0));
      return sign === "-" ? num(-1) * res : res;
    }
    function stringifySexagesimal(node) {
      let { value } = node;
      let num = (n) => n;
      if (typeof value === "bigint")
        num = (n) => BigInt(n);
      else if (isNaN(value) || !isFinite(value))
        return stringifyNumber.stringifyNumber(node);
      let sign = "";
      if (value < 0) {
        sign = "-";
        value *= num(-1);
      }
      const _60 = num(60);
      const parts = [value % _60];
      if (value < 60) {
        parts.unshift(0);
      } else {
        value = (value - parts[0]) / _60;
        parts.unshift(value % _60);
        if (value >= 60) {
          value = (value - parts[0]) / _60;
          parts.unshift(value);
        }
      }
      return sign + parts.map((n) => String(n).padStart(2, "0")).join(":").replace(/000000\d*$/, "");
    }
    var intTime = {
      identify: (value) => typeof value === "bigint" || Number.isInteger(value),
      default: true,
      tag: "tag:yaml.org,2002:int",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+$/,
      resolve: (str, _onError, { intAsBigInt }) => parseSexagesimal(str, intAsBigInt),
      stringify: stringifySexagesimal
    };
    var floatTime = {
      identify: (value) => typeof value === "number",
      default: true,
      tag: "tag:yaml.org,2002:float",
      format: "TIME",
      test: /^[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*$/,
      resolve: (str) => parseSexagesimal(str, false),
      stringify: stringifySexagesimal
    };
    var timestamp = {
      identify: (value) => value instanceof Date,
      default: true,
      tag: "tag:yaml.org,2002:timestamp",
      // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
      // may be omitted altogether, resulting in a date format. In such a case, the time part is
      // assumed to be 00:00:00Z (start of day, UTC).
      test: RegExp("^([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})(?:(?:t|T|[ \\t]+)([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?)?$"),
      resolve(str) {
        const match2 = str.match(timestamp.test);
        if (!match2)
          throw new Error("!!timestamp expects a date, starting with yyyy-mm-dd");
        const [, year, month, day, hour, minute, second] = match2.map(Number);
        const millisec = match2[7] ? Number((match2[7] + "00").substr(1, 3)) : 0;
        let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec);
        const tz = match2[8];
        if (tz && tz !== "Z") {
          let d = parseSexagesimal(tz, false);
          if (Math.abs(d) < 30)
            d *= 60;
          date -= 6e4 * d;
        }
        return new Date(date);
      },
      stringify: ({ value }) => value?.toISOString().replace(/(T00:00:00)?\.000Z$/, "") ?? ""
    };
    exports.floatTime = floatTime;
    exports.intTime = intTime;
    exports.timestamp = timestamp;
  }
});

// ../node_modules/yaml/dist/schema/yaml-1.1/schema.js
var require_schema3 = __commonJS({
  "../node_modules/yaml/dist/schema/yaml-1.1/schema.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var binary = require_binary();
    var bool = require_bool2();
    var float = require_float2();
    var int = require_int2();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var set = require_set();
    var timestamp = require_timestamp();
    var schema = [
      map.map,
      seq.seq,
      string.string,
      _null.nullTag,
      bool.trueTag,
      bool.falseTag,
      int.intBin,
      int.intOct,
      int.int,
      int.intHex,
      float.floatNaN,
      float.floatExp,
      float.float,
      binary.binary,
      merge.merge,
      omap.omap,
      pairs.pairs,
      set.set,
      timestamp.intTime,
      timestamp.floatTime,
      timestamp.timestamp
    ];
    exports.schema = schema;
  }
});

// ../node_modules/yaml/dist/schema/tags.js
var require_tags = __commonJS({
  "../node_modules/yaml/dist/schema/tags.js"(exports) {
    "use strict";
    var map = require_map();
    var _null = require_null();
    var seq = require_seq();
    var string = require_string();
    var bool = require_bool();
    var float = require_float();
    var int = require_int();
    var schema = require_schema();
    var schema$1 = require_schema2();
    var binary = require_binary();
    var merge = require_merge();
    var omap = require_omap();
    var pairs = require_pairs();
    var schema$2 = require_schema3();
    var set = require_set();
    var timestamp = require_timestamp();
    var schemas = /* @__PURE__ */ new Map([
      ["core", schema.schema],
      ["failsafe", [map.map, seq.seq, string.string]],
      ["json", schema$1.schema],
      ["yaml11", schema$2.schema],
      ["yaml-1.1", schema$2.schema]
    ]);
    var tagsByName = {
      binary: binary.binary,
      bool: bool.boolTag,
      float: float.float,
      floatExp: float.floatExp,
      floatNaN: float.floatNaN,
      floatTime: timestamp.floatTime,
      int: int.int,
      intHex: int.intHex,
      intOct: int.intOct,
      intTime: timestamp.intTime,
      map: map.map,
      merge: merge.merge,
      null: _null.nullTag,
      omap: omap.omap,
      pairs: pairs.pairs,
      seq: seq.seq,
      set: set.set,
      timestamp: timestamp.timestamp
    };
    var coreKnownTags = {
      "tag:yaml.org,2002:binary": binary.binary,
      "tag:yaml.org,2002:merge": merge.merge,
      "tag:yaml.org,2002:omap": omap.omap,
      "tag:yaml.org,2002:pairs": pairs.pairs,
      "tag:yaml.org,2002:set": set.set,
      "tag:yaml.org,2002:timestamp": timestamp.timestamp
    };
    function getTags(customTags, schemaName, addMergeTag) {
      const schemaTags = schemas.get(schemaName);
      if (schemaTags && !customTags) {
        return addMergeTag && !schemaTags.includes(merge.merge) ? schemaTags.concat(merge.merge) : schemaTags.slice();
      }
      let tags = schemaTags;
      if (!tags) {
        if (Array.isArray(customTags))
          tags = [];
        else {
          const keys = Array.from(schemas.keys()).filter((key) => key !== "yaml11").map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown schema "${schemaName}"; use one of ${keys} or define customTags array`);
        }
      }
      if (Array.isArray(customTags)) {
        for (const tag of customTags)
          tags = tags.concat(tag);
      } else if (typeof customTags === "function") {
        tags = customTags(tags.slice());
      }
      if (addMergeTag)
        tags = tags.concat(merge.merge);
      return tags.reduce((tags2, tag) => {
        const tagObj = typeof tag === "string" ? tagsByName[tag] : tag;
        if (!tagObj) {
          const tagName = JSON.stringify(tag);
          const keys = Object.keys(tagsByName).map((key) => JSON.stringify(key)).join(", ");
          throw new Error(`Unknown custom tag ${tagName}; use one of ${keys}`);
        }
        if (!tags2.includes(tagObj))
          tags2.push(tagObj);
        return tags2;
      }, []);
    }
    exports.coreKnownTags = coreKnownTags;
    exports.getTags = getTags;
  }
});

// ../node_modules/yaml/dist/schema/Schema.js
var require_Schema = __commonJS({
  "../node_modules/yaml/dist/schema/Schema.js"(exports) {
    "use strict";
    var identity = require_identity();
    var map = require_map();
    var seq = require_seq();
    var string = require_string();
    var tags = require_tags();
    var sortMapEntriesByKey = (a, b) => a.key < b.key ? -1 : a.key > b.key ? 1 : 0;
    var Schema = class _Schema {
      constructor({ compat, customTags, merge, resolveKnownTags, schema, sortMapEntries, toStringDefaults }) {
        this.compat = Array.isArray(compat) ? tags.getTags(compat, "compat") : compat ? tags.getTags(null, compat) : null;
        this.name = typeof schema === "string" && schema || "core";
        this.knownTags = resolveKnownTags ? tags.coreKnownTags : {};
        this.tags = tags.getTags(customTags, this.name, merge);
        this.toStringOptions = toStringDefaults ?? null;
        Object.defineProperty(this, identity.MAP, { value: map.map });
        Object.defineProperty(this, identity.SCALAR, { value: string.string });
        Object.defineProperty(this, identity.SEQ, { value: seq.seq });
        this.sortMapEntries = typeof sortMapEntries === "function" ? sortMapEntries : sortMapEntries === true ? sortMapEntriesByKey : null;
      }
      clone() {
        const copy = Object.create(_Schema.prototype, Object.getOwnPropertyDescriptors(this));
        copy.tags = this.tags.slice();
        return copy;
      }
    };
    exports.Schema = Schema;
  }
});

// ../node_modules/yaml/dist/stringify/stringifyDocument.js
var require_stringifyDocument = __commonJS({
  "../node_modules/yaml/dist/stringify/stringifyDocument.js"(exports) {
    "use strict";
    var identity = require_identity();
    var stringify = require_stringify();
    var stringifyComment = require_stringifyComment();
    function stringifyDocument(doc, options) {
      const lines = [];
      let hasDirectives = options.directives === true;
      if (options.directives !== false && doc.directives) {
        const dir = doc.directives.toString(doc);
        if (dir) {
          lines.push(dir);
          hasDirectives = true;
        } else if (doc.directives.docStart)
          hasDirectives = true;
      }
      if (hasDirectives)
        lines.push("---");
      const ctx = stringify.createStringifyContext(doc, options);
      const { commentString } = ctx.options;
      if (doc.commentBefore) {
        if (lines.length !== 1)
          lines.unshift("");
        const cs = commentString(doc.commentBefore);
        lines.unshift(stringifyComment.indentComment(cs, ""));
      }
      let chompKeep = false;
      let contentComment = null;
      if (doc.contents) {
        if (identity.isNode(doc.contents)) {
          if (doc.contents.spaceBefore && hasDirectives)
            lines.push("");
          if (doc.contents.commentBefore) {
            const cs = commentString(doc.contents.commentBefore);
            lines.push(stringifyComment.indentComment(cs, ""));
          }
          ctx.forceBlockIndent = !!doc.comment;
          contentComment = doc.contents.comment;
        }
        const onChompKeep = contentComment ? void 0 : () => chompKeep = true;
        let body = stringify.stringify(doc.contents, ctx, () => contentComment = null, onChompKeep);
        if (contentComment)
          body += stringifyComment.lineComment(body, "", commentString(contentComment));
        if ((body[0] === "|" || body[0] === ">") && lines[lines.length - 1] === "---") {
          lines[lines.length - 1] = `--- ${body}`;
        } else
          lines.push(body);
      } else {
        lines.push(stringify.stringify(doc.contents, ctx));
      }
      if (doc.directives?.docEnd) {
        if (doc.comment) {
          const cs = commentString(doc.comment);
          if (cs.includes("\n")) {
            lines.push("...");
            lines.push(stringifyComment.indentComment(cs, ""));
          } else {
            lines.push(`... ${cs}`);
          }
        } else {
          lines.push("...");
        }
      } else {
        let dc = doc.comment;
        if (dc && chompKeep)
          dc = dc.replace(/^\n+/, "");
        if (dc) {
          if ((!chompKeep || contentComment) && lines[lines.length - 1] !== "")
            lines.push("");
          lines.push(stringifyComment.indentComment(commentString(dc), ""));
        }
      }
      return lines.join("\n") + "\n";
    }
    exports.stringifyDocument = stringifyDocument;
  }
});

// ../node_modules/yaml/dist/doc/Document.js
var require_Document = __commonJS({
  "../node_modules/yaml/dist/doc/Document.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var Collection = require_Collection();
    var identity = require_identity();
    var Pair = require_Pair();
    var toJS = require_toJS();
    var Schema = require_Schema();
    var stringifyDocument = require_stringifyDocument();
    var anchors = require_anchors();
    var applyReviver = require_applyReviver();
    var createNode = require_createNode();
    var directives = require_directives();
    var Document = class _Document {
      constructor(value, replacer, options) {
        this.commentBefore = null;
        this.comment = null;
        this.errors = [];
        this.warnings = [];
        Object.defineProperty(this, identity.NODE_TYPE, { value: identity.DOC });
        let _replacer = null;
        if (typeof replacer === "function" || Array.isArray(replacer)) {
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const opt = Object.assign({
          intAsBigInt: false,
          keepSourceTokens: false,
          logLevel: "warn",
          prettyErrors: true,
          strict: true,
          stringKeys: false,
          uniqueKeys: true,
          version: "1.2"
        }, options);
        this.options = opt;
        let { version } = opt;
        if (options?._directives) {
          this.directives = options._directives.atDocument();
          if (this.directives.yaml.explicit)
            version = this.directives.yaml.version;
        } else
          this.directives = new directives.Directives({ version });
        this.setSchema(version, options);
        this.contents = value === void 0 ? null : this.createNode(value, _replacer, options);
      }
      /**
       * Create a deep copy of this Document and its contents.
       *
       * Custom Node values that inherit from `Object` still refer to their original instances.
       */
      clone() {
        const copy = Object.create(_Document.prototype, {
          [identity.NODE_TYPE]: { value: identity.DOC }
        });
        copy.commentBefore = this.commentBefore;
        copy.comment = this.comment;
        copy.errors = this.errors.slice();
        copy.warnings = this.warnings.slice();
        copy.options = Object.assign({}, this.options);
        if (this.directives)
          copy.directives = this.directives.clone();
        copy.schema = this.schema.clone();
        copy.contents = identity.isNode(this.contents) ? this.contents.clone(copy.schema) : this.contents;
        if (this.range)
          copy.range = this.range.slice();
        return copy;
      }
      /** Adds a value to the document. */
      add(value) {
        if (assertCollection(this.contents))
          this.contents.add(value);
      }
      /** Adds a value to the document. */
      addIn(path2, value) {
        if (assertCollection(this.contents))
          this.contents.addIn(path2, value);
      }
      /**
       * Create a new `Alias` node, ensuring that the target `node` has the required anchor.
       *
       * If `node` already has an anchor, `name` is ignored.
       * Otherwise, the `node.anchor` value will be set to `name`,
       * or if an anchor with that name is already present in the document,
       * `name` will be used as a prefix for a new unique anchor.
       * If `name` is undefined, the generated anchor will use 'a' as a prefix.
       */
      createAlias(node, name) {
        if (!node.anchor) {
          const prev = anchors.anchorNames(this);
          node.anchor = // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          !name || prev.has(name) ? anchors.findNewAnchor(name || "a", prev) : name;
        }
        return new Alias.Alias(node.anchor);
      }
      createNode(value, replacer, options) {
        let _replacer = void 0;
        if (typeof replacer === "function") {
          value = replacer.call({ "": value }, "", value);
          _replacer = replacer;
        } else if (Array.isArray(replacer)) {
          const keyToStr = (v) => typeof v === "number" || v instanceof String || v instanceof Number;
          const asStr = replacer.filter(keyToStr).map(String);
          if (asStr.length > 0)
            replacer = replacer.concat(asStr);
          _replacer = replacer;
        } else if (options === void 0 && replacer) {
          options = replacer;
          replacer = void 0;
        }
        const { aliasDuplicateObjects, anchorPrefix, flow, keepUndefined, onTagObj, tag } = options ?? {};
        const { onAnchor, setAnchors, sourceObjects } = anchors.createNodeAnchors(
          this,
          // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
          anchorPrefix || "a"
        );
        const ctx = {
          aliasDuplicateObjects: aliasDuplicateObjects ?? true,
          keepUndefined: keepUndefined ?? false,
          onAnchor,
          onTagObj,
          replacer: _replacer,
          schema: this.schema,
          sourceObjects
        };
        const node = createNode.createNode(value, tag, ctx);
        if (flow && identity.isCollection(node))
          node.flow = true;
        setAnchors();
        return node;
      }
      /**
       * Convert a key and a value into a `Pair` using the current schema,
       * recursively wrapping all values as `Scalar` or `Collection` nodes.
       */
      createPair(key, value, options = {}) {
        const k = this.createNode(key, null, options);
        const v = this.createNode(value, null, options);
        return new Pair.Pair(k, v);
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      delete(key) {
        return assertCollection(this.contents) ? this.contents.delete(key) : false;
      }
      /**
       * Removes a value from the document.
       * @returns `true` if the item was found and removed.
       */
      deleteIn(path2) {
        if (Collection.isEmptyPath(path2)) {
          if (this.contents == null)
            return false;
          this.contents = null;
          return true;
        }
        return assertCollection(this.contents) ? this.contents.deleteIn(path2) : false;
      }
      /**
       * Returns item at `key`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      get(key, keepScalar) {
        return identity.isCollection(this.contents) ? this.contents.get(key, keepScalar) : void 0;
      }
      /**
       * Returns item at `path`, or `undefined` if not found. By default unwraps
       * scalar values from their surrounding node; to disable set `keepScalar` to
       * `true` (collections are always returned intact).
       */
      getIn(path2, keepScalar) {
        if (Collection.isEmptyPath(path2))
          return !keepScalar && identity.isScalar(this.contents) ? this.contents.value : this.contents;
        return identity.isCollection(this.contents) ? this.contents.getIn(path2, keepScalar) : void 0;
      }
      /**
       * Checks if the document includes a value with the key `key`.
       */
      has(key) {
        return identity.isCollection(this.contents) ? this.contents.has(key) : false;
      }
      /**
       * Checks if the document includes a value at `path`.
       */
      hasIn(path2) {
        if (Collection.isEmptyPath(path2))
          return this.contents !== void 0;
        return identity.isCollection(this.contents) ? this.contents.hasIn(path2) : false;
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      set(key, value) {
        if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, [key], value);
        } else if (assertCollection(this.contents)) {
          this.contents.set(key, value);
        }
      }
      /**
       * Sets a value in this document. For `!!set`, `value` needs to be a
       * boolean to add/remove the item from the set.
       */
      setIn(path2, value) {
        if (Collection.isEmptyPath(path2)) {
          this.contents = value;
        } else if (this.contents == null) {
          this.contents = Collection.collectionFromPath(this.schema, Array.from(path2), value);
        } else if (assertCollection(this.contents)) {
          this.contents.setIn(path2, value);
        }
      }
      /**
       * Change the YAML version and schema used by the document.
       * A `null` version disables support for directives, explicit tags, anchors, and aliases.
       * It also requires the `schema` option to be given as a `Schema` instance value.
       *
       * Overrides all previously set schema options.
       */
      setSchema(version, options = {}) {
        if (typeof version === "number")
          version = String(version);
        let opt;
        switch (version) {
          case "1.1":
            if (this.directives)
              this.directives.yaml.version = "1.1";
            else
              this.directives = new directives.Directives({ version: "1.1" });
            opt = { resolveKnownTags: false, schema: "yaml-1.1" };
            break;
          case "1.2":
          case "next":
            if (this.directives)
              this.directives.yaml.version = version;
            else
              this.directives = new directives.Directives({ version });
            opt = { resolveKnownTags: true, schema: "core" };
            break;
          case null:
            if (this.directives)
              delete this.directives;
            opt = null;
            break;
          default: {
            const sv = JSON.stringify(version);
            throw new Error(`Expected '1.1', '1.2' or null as first argument, but found: ${sv}`);
          }
        }
        if (options.schema instanceof Object)
          this.schema = options.schema;
        else if (opt)
          this.schema = new Schema.Schema(Object.assign(opt, options));
        else
          throw new Error(`With a null YAML version, the { schema: Schema } option is required`);
      }
      // json & jsonArg are only used from toJSON()
      toJS({ json: json2, jsonArg, mapAsMap, maxAliasCount, onAnchor, reviver } = {}) {
        const ctx = {
          anchors: /* @__PURE__ */ new Map(),
          doc: this,
          keep: !json2,
          mapAsMap: mapAsMap === true,
          mapKeyWarned: false,
          maxAliasCount: typeof maxAliasCount === "number" ? maxAliasCount : 100
        };
        const res = toJS.toJS(this.contents, jsonArg ?? "", ctx);
        if (typeof onAnchor === "function")
          for (const { count, res: res2 } of ctx.anchors.values())
            onAnchor(res2, count);
        return typeof reviver === "function" ? applyReviver.applyReviver(reviver, { "": res }, "", res) : res;
      }
      /**
       * A JSON representation of the document `contents`.
       *
       * @param jsonArg Used by `JSON.stringify` to indicate the array index or
       *   property name.
       */
      toJSON(jsonArg, onAnchor) {
        return this.toJS({ json: true, jsonArg, mapAsMap: false, onAnchor });
      }
      /** A YAML representation of the document. */
      toString(options = {}) {
        if (this.errors.length > 0)
          throw new Error("Document with errors cannot be stringified");
        if ("indent" in options && (!Number.isInteger(options.indent) || Number(options.indent) <= 0)) {
          const s = JSON.stringify(options.indent);
          throw new Error(`"indent" option must be a positive integer, not ${s}`);
        }
        return stringifyDocument.stringifyDocument(this, options);
      }
    };
    function assertCollection(contents) {
      if (identity.isCollection(contents))
        return true;
      throw new Error("Expected a YAML collection as document contents");
    }
    exports.Document = Document;
  }
});

// ../node_modules/yaml/dist/errors.js
var require_errors = __commonJS({
  "../node_modules/yaml/dist/errors.js"(exports) {
    "use strict";
    var YAMLError = class extends Error {
      constructor(name, pos, code, message) {
        super();
        this.name = name;
        this.code = code;
        this.message = message;
        this.pos = pos;
      }
    };
    var YAMLParseError = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLParseError", pos, code, message);
      }
    };
    var YAMLWarning = class extends YAMLError {
      constructor(pos, code, message) {
        super("YAMLWarning", pos, code, message);
      }
    };
    var prettifyError = (src, lc) => (error) => {
      if (error.pos[0] === -1)
        return;
      error.linePos = error.pos.map((pos) => lc.linePos(pos));
      const { line, col } = error.linePos[0];
      error.message += ` at line ${line}, column ${col}`;
      let ci = col - 1;
      let lineStr = src.substring(lc.lineStarts[line - 1], lc.lineStarts[line]).replace(/[\n\r]+$/, "");
      if (ci >= 60 && lineStr.length > 80) {
        const trimStart = Math.min(ci - 39, lineStr.length - 79);
        lineStr = "\u2026" + lineStr.substring(trimStart);
        ci -= trimStart - 1;
      }
      if (lineStr.length > 80)
        lineStr = lineStr.substring(0, 79) + "\u2026";
      if (line > 1 && /^ *$/.test(lineStr.substring(0, ci))) {
        let prev = src.substring(lc.lineStarts[line - 2], lc.lineStarts[line - 1]);
        if (prev.length > 80)
          prev = prev.substring(0, 79) + "\u2026\n";
        lineStr = prev + lineStr;
      }
      if (/[^ ]/.test(lineStr)) {
        let count = 1;
        const end = error.linePos[1];
        if (end?.line === line && end.col > col) {
          count = Math.max(1, Math.min(end.col - col, 80 - ci));
        }
        const pointer = " ".repeat(ci) + "^".repeat(count);
        error.message += `:

${lineStr}
${pointer}
`;
      }
    };
    exports.YAMLError = YAMLError;
    exports.YAMLParseError = YAMLParseError;
    exports.YAMLWarning = YAMLWarning;
    exports.prettifyError = prettifyError;
  }
});

// ../node_modules/yaml/dist/compose/resolve-props.js
var require_resolve_props = __commonJS({
  "../node_modules/yaml/dist/compose/resolve-props.js"(exports) {
    "use strict";
    function resolveProps(tokens, { flow, indicator, next, offset, onError, parentIndent, startOnNewline }) {
      let spaceBefore = false;
      let atNewline = startOnNewline;
      let hasSpace = startOnNewline;
      let comment = "";
      let commentSep = "";
      let hasNewline = false;
      let reqSpace = false;
      let tab = null;
      let anchor = null;
      let tag = null;
      let newlineAfterProp = null;
      let comma = null;
      let found = null;
      let start = null;
      for (const token of tokens) {
        if (reqSpace) {
          if (token.type !== "space" && token.type !== "newline" && token.type !== "comma")
            onError(token.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
          reqSpace = false;
        }
        if (tab) {
          if (atNewline && token.type !== "comment" && token.type !== "newline") {
            onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
          }
          tab = null;
        }
        switch (token.type) {
          case "space":
            if (!flow && (indicator !== "doc-start" || next?.type !== "flow-collection") && token.source.includes("	")) {
              tab = token;
            }
            hasSpace = true;
            break;
          case "comment": {
            if (!hasSpace)
              onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
            const cb = token.source.substring(1) || " ";
            if (!comment)
              comment = cb;
            else
              comment += commentSep + cb;
            commentSep = "";
            atNewline = false;
            break;
          }
          case "newline":
            if (atNewline) {
              if (comment)
                comment += token.source;
              else if (!found || indicator !== "seq-item-ind")
                spaceBefore = true;
            } else
              commentSep += token.source;
            atNewline = true;
            hasNewline = true;
            if (anchor || tag)
              newlineAfterProp = token;
            hasSpace = true;
            break;
          case "anchor":
            if (anchor)
              onError(token, "MULTIPLE_ANCHORS", "A node can have at most one anchor");
            if (token.source.endsWith(":"))
              onError(token.offset + token.source.length - 1, "BAD_ALIAS", "Anchor ending in : is ambiguous", true);
            anchor = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          case "tag": {
            if (tag)
              onError(token, "MULTIPLE_TAGS", "A node can have at most one tag");
            tag = token;
            start ?? (start = token.offset);
            atNewline = false;
            hasSpace = false;
            reqSpace = true;
            break;
          }
          case indicator:
            if (anchor || tag)
              onError(token, "BAD_PROP_ORDER", `Anchors and tags must be after the ${token.source} indicator`);
            if (found)
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.source} in ${flow ?? "collection"}`);
            found = token;
            atNewline = indicator === "seq-item-ind" || indicator === "explicit-key-ind";
            hasSpace = false;
            break;
          case "comma":
            if (flow) {
              if (comma)
                onError(token, "UNEXPECTED_TOKEN", `Unexpected , in ${flow}`);
              comma = token;
              atNewline = false;
              hasSpace = false;
              break;
            }
          // else fallthrough
          default:
            onError(token, "UNEXPECTED_TOKEN", `Unexpected ${token.type} token`);
            atNewline = false;
            hasSpace = false;
        }
      }
      const last = tokens[tokens.length - 1];
      const end = last ? last.offset + last.source.length : offset;
      if (reqSpace && next && next.type !== "space" && next.type !== "newline" && next.type !== "comma" && (next.type !== "scalar" || next.source !== "")) {
        onError(next.offset, "MISSING_CHAR", "Tags and anchors must be separated from the next token by white space");
      }
      if (tab && (atNewline && tab.indent <= parentIndent || next?.type === "block-map" || next?.type === "block-seq"))
        onError(tab, "TAB_AS_INDENT", "Tabs are not allowed as indentation");
      return {
        comma,
        found,
        spaceBefore,
        comment,
        hasNewline,
        anchor,
        tag,
        newlineAfterProp,
        end,
        start: start ?? end
      };
    }
    exports.resolveProps = resolveProps;
  }
});

// ../node_modules/yaml/dist/compose/util-contains-newline.js
var require_util_contains_newline = __commonJS({
  "../node_modules/yaml/dist/compose/util-contains-newline.js"(exports) {
    "use strict";
    function containsNewline(key) {
      if (!key)
        return null;
      switch (key.type) {
        case "alias":
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          if (key.source.includes("\n"))
            return true;
          if (key.end) {
            for (const st of key.end)
              if (st.type === "newline")
                return true;
          }
          return false;
        case "flow-collection":
          for (const it of key.items) {
            for (const st of it.start)
              if (st.type === "newline")
                return true;
            if (it.sep) {
              for (const st of it.sep)
                if (st.type === "newline")
                  return true;
            }
            if (containsNewline(it.key) || containsNewline(it.value))
              return true;
          }
          return false;
        default:
          return true;
      }
    }
    exports.containsNewline = containsNewline;
  }
});

// ../node_modules/yaml/dist/compose/util-flow-indent-check.js
var require_util_flow_indent_check = __commonJS({
  "../node_modules/yaml/dist/compose/util-flow-indent-check.js"(exports) {
    "use strict";
    var utilContainsNewline = require_util_contains_newline();
    function flowIndentCheck(indent, fc, onError) {
      if (fc?.type === "flow-collection") {
        const end = fc.end[0];
        if (end.indent === indent && (end.source === "]" || end.source === "}") && utilContainsNewline.containsNewline(fc)) {
          const msg = "Flow end indicator should be more indented than parent";
          onError(end, "BAD_INDENT", msg, true);
        }
      }
    }
    exports.flowIndentCheck = flowIndentCheck;
  }
});

// ../node_modules/yaml/dist/compose/util-map-includes.js
var require_util_map_includes = __commonJS({
  "../node_modules/yaml/dist/compose/util-map-includes.js"(exports) {
    "use strict";
    var identity = require_identity();
    function mapIncludes(ctx, items, search) {
      const { uniqueKeys } = ctx.options;
      if (uniqueKeys === false)
        return false;
      const isEqual = typeof uniqueKeys === "function" ? uniqueKeys : (a, b) => a === b || identity.isScalar(a) && identity.isScalar(b) && a.value === b.value;
      return items.some((pair2) => isEqual(pair2.key, search));
    }
    exports.mapIncludes = mapIncludes;
  }
});

// ../node_modules/yaml/dist/compose/resolve-block-map.js
var require_resolve_block_map = __commonJS({
  "../node_modules/yaml/dist/compose/resolve-block-map.js"(exports) {
    "use strict";
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    var utilMapIncludes = require_util_map_includes();
    var startColMsg = "All mapping items must start at the same column";
    function resolveBlockMap({ composeNode, composeEmptyNode }, ctx, bm, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLMap.YAMLMap;
      const map = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      let offset = bm.offset;
      let commentEnd = null;
      for (const collItem of bm.items) {
        const { start, key, sep: sep3, value } = collItem;
        const keyProps = resolveProps.resolveProps(start, {
          indicator: "explicit-key-ind",
          next: key ?? sep3?.[0],
          offset,
          onError,
          parentIndent: bm.indent,
          startOnNewline: true
        });
        const implicitKey = !keyProps.found;
        if (implicitKey) {
          if (key) {
            if (key.type === "block-seq")
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "A block sequence may not be used as an implicit map key");
            else if ("indent" in key && key.indent !== bm.indent)
              onError(offset, "BAD_INDENT", startColMsg);
          }
          if (!keyProps.anchor && !keyProps.tag && !sep3) {
            commentEnd = keyProps.end;
            if (keyProps.comment) {
              if (map.comment)
                map.comment += "\n" + keyProps.comment;
              else
                map.comment = keyProps.comment;
            }
            continue;
          }
          if (keyProps.newlineAfterProp || utilContainsNewline.containsNewline(key)) {
            onError(key ?? start[start.length - 1], "MULTILINE_IMPLICIT_KEY", "Implicit keys need to be on a single line");
          }
        } else if (keyProps.found?.indent !== bm.indent) {
          onError(offset, "BAD_INDENT", startColMsg);
        }
        ctx.atKey = true;
        const keyStart = keyProps.end;
        const keyNode = key ? composeNode(ctx, key, keyProps, onError) : composeEmptyNode(ctx, keyStart, start, null, keyProps, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bm.indent, key, onError);
        ctx.atKey = false;
        if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
          onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
        const valueProps = resolveProps.resolveProps(sep3 ?? [], {
          indicator: "map-value-ind",
          next: value,
          offset: keyNode.range[2],
          onError,
          parentIndent: bm.indent,
          startOnNewline: !key || key.type === "block-scalar"
        });
        offset = valueProps.end;
        if (valueProps.found) {
          if (implicitKey) {
            if (value?.type === "block-map" && !valueProps.hasNewline)
              onError(offset, "BLOCK_AS_IMPLICIT_KEY", "Nested mappings are not allowed in compact mappings");
            if (ctx.options.strict && keyProps.start < valueProps.found.offset - 1024)
              onError(keyNode.range, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit block mapping key");
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : composeEmptyNode(ctx, offset, sep3, null, valueProps, onError);
          if (ctx.schema.compat)
            utilFlowIndentCheck.flowIndentCheck(bm.indent, value, onError);
          offset = valueNode.range[2];
          const pair2 = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair2.srcToken = collItem;
          map.items.push(pair2);
        } else {
          if (implicitKey)
            onError(keyNode.range, "MISSING_CHAR", "Implicit map keys need to be followed by map values");
          if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair2 = new Pair.Pair(keyNode);
          if (ctx.options.keepSourceTokens)
            pair2.srcToken = collItem;
          map.items.push(pair2);
        }
      }
      if (commentEnd && commentEnd < offset)
        onError(commentEnd, "IMPOSSIBLE", "Map comment with trailing content");
      map.range = [bm.offset, offset, commentEnd ?? offset];
      return map;
    }
    exports.resolveBlockMap = resolveBlockMap;
  }
});

// ../node_modules/yaml/dist/compose/resolve-block-seq.js
var require_resolve_block_seq = __commonJS({
  "../node_modules/yaml/dist/compose/resolve-block-seq.js"(exports) {
    "use strict";
    var YAMLSeq = require_YAMLSeq();
    var resolveProps = require_resolve_props();
    var utilFlowIndentCheck = require_util_flow_indent_check();
    function resolveBlockSeq({ composeNode, composeEmptyNode }, ctx, bs, onError, tag) {
      const NodeClass = tag?.nodeClass ?? YAMLSeq.YAMLSeq;
      const seq = new NodeClass(ctx.schema);
      if (ctx.atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = bs.offset;
      let commentEnd = null;
      for (const { start, value } of bs.items) {
        const props = resolveProps.resolveProps(start, {
          indicator: "seq-item-ind",
          next: value,
          offset,
          onError,
          parentIndent: bs.indent,
          startOnNewline: true
        });
        if (!props.found) {
          if (props.anchor || props.tag || value) {
            if (value?.type === "block-seq")
              onError(props.end, "BAD_INDENT", "All sequence items must start at the same column");
            else
              onError(offset, "MISSING_CHAR", "Sequence item without - indicator");
          } else {
            commentEnd = props.end;
            if (props.comment)
              seq.comment = props.comment;
            continue;
          }
        }
        const node = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, start, null, props, onError);
        if (ctx.schema.compat)
          utilFlowIndentCheck.flowIndentCheck(bs.indent, value, onError);
        offset = node.range[2];
        seq.items.push(node);
      }
      seq.range = [bs.offset, offset, commentEnd ?? offset];
      return seq;
    }
    exports.resolveBlockSeq = resolveBlockSeq;
  }
});

// ../node_modules/yaml/dist/compose/resolve-end.js
var require_resolve_end = __commonJS({
  "../node_modules/yaml/dist/compose/resolve-end.js"(exports) {
    "use strict";
    function resolveEnd(end, offset, reqSpace, onError) {
      let comment = "";
      if (end) {
        let hasSpace = false;
        let sep3 = "";
        for (const token of end) {
          const { source, type } = token;
          switch (type) {
            case "space":
              hasSpace = true;
              break;
            case "comment": {
              if (reqSpace && !hasSpace)
                onError(token, "MISSING_CHAR", "Comments must be separated from other tokens by white space characters");
              const cb = source.substring(1) || " ";
              if (!comment)
                comment = cb;
              else
                comment += sep3 + cb;
              sep3 = "";
              break;
            }
            case "newline":
              if (comment)
                sep3 += source;
              hasSpace = true;
              break;
            default:
              onError(token, "UNEXPECTED_TOKEN", `Unexpected ${type} at node end`);
          }
          offset += source.length;
        }
      }
      return { comment, offset };
    }
    exports.resolveEnd = resolveEnd;
  }
});

// ../node_modules/yaml/dist/compose/resolve-flow-collection.js
var require_resolve_flow_collection = __commonJS({
  "../node_modules/yaml/dist/compose/resolve-flow-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Pair = require_Pair();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    var utilContainsNewline = require_util_contains_newline();
    var utilMapIncludes = require_util_map_includes();
    var blockMsg = "Block collections are not allowed within flow collections";
    var isBlock = (token) => token && (token.type === "block-map" || token.type === "block-seq");
    function resolveFlowCollection({ composeNode, composeEmptyNode }, ctx, fc, onError, tag) {
      const isMap = fc.start.source === "{";
      const fcName = isMap ? "flow map" : "flow sequence";
      const NodeClass = tag?.nodeClass ?? (isMap ? YAMLMap.YAMLMap : YAMLSeq.YAMLSeq);
      const coll = new NodeClass(ctx.schema);
      coll.flow = true;
      const atRoot = ctx.atRoot;
      if (atRoot)
        ctx.atRoot = false;
      if (ctx.atKey)
        ctx.atKey = false;
      let offset = fc.offset + fc.start.source.length;
      for (let i = 0; i < fc.items.length; ++i) {
        const collItem = fc.items[i];
        const { start, key, sep: sep3, value } = collItem;
        const props = resolveProps.resolveProps(start, {
          flow: fcName,
          indicator: "explicit-key-ind",
          next: key ?? sep3?.[0],
          offset,
          onError,
          parentIndent: fc.indent,
          startOnNewline: false
        });
        if (!props.found) {
          if (!props.anchor && !props.tag && !sep3 && !value) {
            if (i === 0 && props.comma)
              onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
            else if (i < fc.items.length - 1)
              onError(props.start, "UNEXPECTED_TOKEN", `Unexpected empty item in ${fcName}`);
            if (props.comment) {
              if (coll.comment)
                coll.comment += "\n" + props.comment;
              else
                coll.comment = props.comment;
            }
            offset = props.end;
            continue;
          }
          if (!isMap && ctx.options.strict && utilContainsNewline.containsNewline(key))
            onError(
              key,
              // checked by containsNewline()
              "MULTILINE_IMPLICIT_KEY",
              "Implicit keys of flow sequence pairs need to be on a single line"
            );
        }
        if (i === 0) {
          if (props.comma)
            onError(props.comma, "UNEXPECTED_TOKEN", `Unexpected , in ${fcName}`);
        } else {
          if (!props.comma)
            onError(props.start, "MISSING_CHAR", `Missing , between ${fcName} items`);
          if (props.comment) {
            let prevItemComment = "";
            loop: for (const st of start) {
              switch (st.type) {
                case "comma":
                case "space":
                  break;
                case "comment":
                  prevItemComment = st.source.substring(1);
                  break loop;
                default:
                  break loop;
              }
            }
            if (prevItemComment) {
              let prev = coll.items[coll.items.length - 1];
              if (identity.isPair(prev))
                prev = prev.value ?? prev.key;
              if (prev.comment)
                prev.comment += "\n" + prevItemComment;
              else
                prev.comment = prevItemComment;
              props.comment = props.comment.substring(prevItemComment.length + 1);
            }
          }
        }
        if (!isMap && !sep3 && !props.found) {
          const valueNode = value ? composeNode(ctx, value, props, onError) : composeEmptyNode(ctx, props.end, sep3, null, props, onError);
          coll.items.push(valueNode);
          offset = valueNode.range[2];
          if (isBlock(value))
            onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
        } else {
          ctx.atKey = true;
          const keyStart = props.end;
          const keyNode = key ? composeNode(ctx, key, props, onError) : composeEmptyNode(ctx, keyStart, start, null, props, onError);
          if (isBlock(key))
            onError(keyNode.range, "BLOCK_IN_FLOW", blockMsg);
          ctx.atKey = false;
          const valueProps = resolveProps.resolveProps(sep3 ?? [], {
            flow: fcName,
            indicator: "map-value-ind",
            next: value,
            offset: keyNode.range[2],
            onError,
            parentIndent: fc.indent,
            startOnNewline: false
          });
          if (valueProps.found) {
            if (!isMap && !props.found && ctx.options.strict) {
              if (sep3)
                for (const st of sep3) {
                  if (st === valueProps.found)
                    break;
                  if (st.type === "newline") {
                    onError(st, "MULTILINE_IMPLICIT_KEY", "Implicit keys of flow sequence pairs need to be on a single line");
                    break;
                  }
                }
              if (props.start < valueProps.found.offset - 1024)
                onError(valueProps.found, "KEY_OVER_1024_CHARS", "The : indicator must be at most 1024 chars after the start of an implicit flow sequence key");
            }
          } else if (value) {
            if ("source" in value && value.source?.[0] === ":")
              onError(value, "MISSING_CHAR", `Missing space after : in ${fcName}`);
            else
              onError(valueProps.start, "MISSING_CHAR", `Missing , or : between ${fcName} items`);
          }
          const valueNode = value ? composeNode(ctx, value, valueProps, onError) : valueProps.found ? composeEmptyNode(ctx, valueProps.end, sep3, null, valueProps, onError) : null;
          if (valueNode) {
            if (isBlock(value))
              onError(valueNode.range, "BLOCK_IN_FLOW", blockMsg);
          } else if (valueProps.comment) {
            if (keyNode.comment)
              keyNode.comment += "\n" + valueProps.comment;
            else
              keyNode.comment = valueProps.comment;
          }
          const pair2 = new Pair.Pair(keyNode, valueNode);
          if (ctx.options.keepSourceTokens)
            pair2.srcToken = collItem;
          if (isMap) {
            const map = coll;
            if (utilMapIncludes.mapIncludes(ctx, map.items, keyNode))
              onError(keyStart, "DUPLICATE_KEY", "Map keys must be unique");
            map.items.push(pair2);
          } else {
            const map = new YAMLMap.YAMLMap(ctx.schema);
            map.flow = true;
            map.items.push(pair2);
            const endRange = (valueNode ?? keyNode).range;
            map.range = [keyNode.range[0], endRange[1], endRange[2]];
            coll.items.push(map);
          }
          offset = valueNode ? valueNode.range[2] : valueProps.end;
        }
      }
      const expectedEnd = isMap ? "}" : "]";
      const [ce, ...ee] = fc.end;
      let cePos = offset;
      if (ce?.source === expectedEnd)
        cePos = ce.offset + ce.source.length;
      else {
        const name = fcName[0].toUpperCase() + fcName.substring(1);
        const msg = atRoot ? `${name} must end with a ${expectedEnd}` : `${name} in block collection must be sufficiently indented and end with a ${expectedEnd}`;
        onError(offset, atRoot ? "MISSING_CHAR" : "BAD_INDENT", msg);
        if (ce && ce.source.length !== 1)
          ee.unshift(ce);
      }
      if (ee.length > 0) {
        const end = resolveEnd.resolveEnd(ee, cePos, ctx.options.strict, onError);
        if (end.comment) {
          if (coll.comment)
            coll.comment += "\n" + end.comment;
          else
            coll.comment = end.comment;
        }
        coll.range = [fc.offset, cePos, end.offset];
      } else {
        coll.range = [fc.offset, cePos, cePos];
      }
      return coll;
    }
    exports.resolveFlowCollection = resolveFlowCollection;
  }
});

// ../node_modules/yaml/dist/compose/compose-collection.js
var require_compose_collection = __commonJS({
  "../node_modules/yaml/dist/compose/compose-collection.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var resolveBlockMap = require_resolve_block_map();
    var resolveBlockSeq = require_resolve_block_seq();
    var resolveFlowCollection = require_resolve_flow_collection();
    function resolveCollection(CN, ctx, token, onError, tagName, tag) {
      const coll = token.type === "block-map" ? resolveBlockMap.resolveBlockMap(CN, ctx, token, onError, tag) : token.type === "block-seq" ? resolveBlockSeq.resolveBlockSeq(CN, ctx, token, onError, tag) : resolveFlowCollection.resolveFlowCollection(CN, ctx, token, onError, tag);
      const Coll = coll.constructor;
      if (tagName === "!" || tagName === Coll.tagName) {
        coll.tag = Coll.tagName;
        return coll;
      }
      if (tagName)
        coll.tag = tagName;
      return coll;
    }
    function composeCollection(CN, ctx, token, props, onError) {
      const tagToken = props.tag;
      const tagName = !tagToken ? null : ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg));
      if (token.type === "block-seq") {
        const { anchor, newlineAfterProp: nl } = props;
        const lastProp = anchor && tagToken ? anchor.offset > tagToken.offset ? anchor : tagToken : anchor ?? tagToken;
        if (lastProp && (!nl || nl.offset < lastProp.offset)) {
          const message = "Missing newline after block sequence props";
          onError(lastProp, "MISSING_CHAR", message);
        }
      }
      const expType = token.type === "block-map" ? "map" : token.type === "block-seq" ? "seq" : token.start.source === "{" ? "map" : "seq";
      if (!tagToken || !tagName || tagName === "!" || tagName === YAMLMap.YAMLMap.tagName && expType === "map" || tagName === YAMLSeq.YAMLSeq.tagName && expType === "seq") {
        return resolveCollection(CN, ctx, token, onError, tagName);
      }
      let tag = ctx.schema.tags.find((t) => t.tag === tagName && t.collection === expType);
      if (!tag) {
        const kt = ctx.schema.knownTags[tagName];
        if (kt?.collection === expType) {
          ctx.schema.tags.push(Object.assign({}, kt, { default: false }));
          tag = kt;
        } else {
          if (kt) {
            onError(tagToken, "BAD_COLLECTION_TYPE", `${kt.tag} used for ${expType} collection, but expects ${kt.collection ?? "scalar"}`, true);
          } else {
            onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, true);
          }
          return resolveCollection(CN, ctx, token, onError, tagName);
        }
      }
      const coll = resolveCollection(CN, ctx, token, onError, tagName, tag);
      const res = tag.resolve?.(coll, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg), ctx.options) ?? coll;
      const node = identity.isNode(res) ? res : new Scalar.Scalar(res);
      node.range = coll.range;
      node.tag = tagName;
      if (tag?.format)
        node.format = tag.format;
      return node;
    }
    exports.composeCollection = composeCollection;
  }
});

// ../node_modules/yaml/dist/compose/resolve-block-scalar.js
var require_resolve_block_scalar = __commonJS({
  "../node_modules/yaml/dist/compose/resolve-block-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    function resolveBlockScalar(ctx, scalar, onError) {
      const start = scalar.offset;
      const header = parseBlockScalarHeader(scalar, ctx.options.strict, onError);
      if (!header)
        return { value: "", type: null, comment: "", range: [start, start, start] };
      const type = header.mode === ">" ? Scalar.Scalar.BLOCK_FOLDED : Scalar.Scalar.BLOCK_LITERAL;
      const lines = scalar.source ? splitLines(scalar.source) : [];
      let chompStart = lines.length;
      for (let i = lines.length - 1; i >= 0; --i) {
        const content = lines[i][1];
        if (content === "" || content === "\r")
          chompStart = i;
        else
          break;
      }
      if (chompStart === 0) {
        const value2 = header.chomp === "+" && lines.length > 0 ? "\n".repeat(Math.max(1, lines.length - 1)) : "";
        let end2 = start + header.length;
        if (scalar.source)
          end2 += scalar.source.length;
        return { value: value2, type, comment: header.comment, range: [start, end2, end2] };
      }
      let trimIndent = scalar.indent + header.indent;
      let offset = scalar.offset + header.length;
      let contentStart = 0;
      for (let i = 0; i < chompStart; ++i) {
        const [indent, content] = lines[i];
        if (content === "" || content === "\r") {
          if (header.indent === 0 && indent.length > trimIndent)
            trimIndent = indent.length;
        } else {
          if (indent.length < trimIndent) {
            const message = "Block scalars with more-indented leading empty lines must use an explicit indentation indicator";
            onError(offset + indent.length, "MISSING_CHAR", message);
          }
          if (header.indent === 0)
            trimIndent = indent.length;
          contentStart = i;
          if (trimIndent === 0 && !ctx.atRoot) {
            const message = "Block scalar values in collections must be indented";
            onError(offset, "BAD_INDENT", message);
          }
          break;
        }
        offset += indent.length + content.length + 1;
      }
      for (let i = lines.length - 1; i >= chompStart; --i) {
        if (lines[i][0].length > trimIndent)
          chompStart = i + 1;
      }
      let value = "";
      let sep3 = "";
      let prevMoreIndented = false;
      for (let i = 0; i < contentStart; ++i)
        value += lines[i][0].slice(trimIndent) + "\n";
      for (let i = contentStart; i < chompStart; ++i) {
        let [indent, content] = lines[i];
        offset += indent.length + content.length + 1;
        const crlf = content[content.length - 1] === "\r";
        if (crlf)
          content = content.slice(0, -1);
        if (content && indent.length < trimIndent) {
          const src = header.indent ? "explicit indentation indicator" : "first line";
          const message = `Block scalar lines must not be less indented than their ${src}`;
          onError(offset - content.length - (crlf ? 2 : 1), "BAD_INDENT", message);
          indent = "";
        }
        if (type === Scalar.Scalar.BLOCK_LITERAL) {
          value += sep3 + indent.slice(trimIndent) + content;
          sep3 = "\n";
        } else if (indent.length > trimIndent || content[0] === "	") {
          if (sep3 === " ")
            sep3 = "\n";
          else if (!prevMoreIndented && sep3 === "\n")
            sep3 = "\n\n";
          value += sep3 + indent.slice(trimIndent) + content;
          sep3 = "\n";
          prevMoreIndented = true;
        } else if (content === "") {
          if (sep3 === "\n")
            value += "\n";
          else
            sep3 = "\n";
        } else {
          value += sep3 + content;
          sep3 = " ";
          prevMoreIndented = false;
        }
      }
      switch (header.chomp) {
        case "-":
          break;
        case "+":
          for (let i = chompStart; i < lines.length; ++i)
            value += "\n" + lines[i][0].slice(trimIndent);
          if (value[value.length - 1] !== "\n")
            value += "\n";
          break;
        default:
          value += "\n";
      }
      const end = start + header.length + scalar.source.length;
      return { value, type, comment: header.comment, range: [start, end, end] };
    }
    function parseBlockScalarHeader({ offset, props }, strict, onError) {
      if (props[0].type !== "block-scalar-header") {
        onError(props[0], "IMPOSSIBLE", "Block scalar header not found");
        return null;
      }
      const { source } = props[0];
      const mode = source[0];
      let indent = 0;
      let chomp = "";
      let error = -1;
      for (let i = 1; i < source.length; ++i) {
        const ch = source[i];
        if (!chomp && (ch === "-" || ch === "+"))
          chomp = ch;
        else {
          const n = Number(ch);
          if (!indent && n)
            indent = n;
          else if (error === -1)
            error = offset + i;
        }
      }
      if (error !== -1)
        onError(error, "UNEXPECTED_TOKEN", `Block scalar header includes extra characters: ${source}`);
      let hasSpace = false;
      let comment = "";
      let length = source.length;
      for (let i = 1; i < props.length; ++i) {
        const token = props[i];
        switch (token.type) {
          case "space":
            hasSpace = true;
          // fallthrough
          case "newline":
            length += token.source.length;
            break;
          case "comment":
            if (strict && !hasSpace) {
              const message = "Comments must be separated from other tokens by white space characters";
              onError(token, "MISSING_CHAR", message);
            }
            length += token.source.length;
            comment = token.source.substring(1);
            break;
          case "error":
            onError(token, "UNEXPECTED_TOKEN", token.message);
            length += token.source.length;
            break;
          /* istanbul ignore next should not happen */
          default: {
            const message = `Unexpected token in block scalar header: ${token.type}`;
            onError(token, "UNEXPECTED_TOKEN", message);
            const ts = token.source;
            if (ts && typeof ts === "string")
              length += ts.length;
          }
        }
      }
      return { mode, indent, chomp, comment, length };
    }
    function splitLines(source) {
      const split = source.split(/\n( *)/);
      const first = split[0];
      const m = first.match(/^( *)/);
      const line0 = m?.[1] ? [m[1], first.slice(m[1].length)] : ["", first];
      const lines = [line0];
      for (let i = 1; i < split.length; i += 2)
        lines.push([split[i], split[i + 1]]);
      return lines;
    }
    exports.resolveBlockScalar = resolveBlockScalar;
  }
});

// ../node_modules/yaml/dist/compose/resolve-flow-scalar.js
var require_resolve_flow_scalar = __commonJS({
  "../node_modules/yaml/dist/compose/resolve-flow-scalar.js"(exports) {
    "use strict";
    var Scalar = require_Scalar();
    var resolveEnd = require_resolve_end();
    function resolveFlowScalar(scalar, strict, onError) {
      const { offset, type, source, end } = scalar;
      let _type;
      let value;
      const _onError = (rel2, code, msg) => onError(offset + rel2, code, msg);
      switch (type) {
        case "scalar":
          _type = Scalar.Scalar.PLAIN;
          value = plainValue(source, _onError);
          break;
        case "single-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_SINGLE;
          value = singleQuotedValue(source, _onError);
          break;
        case "double-quoted-scalar":
          _type = Scalar.Scalar.QUOTE_DOUBLE;
          value = doubleQuotedValue(source, _onError);
          break;
        /* istanbul ignore next should not happen */
        default:
          onError(scalar, "UNEXPECTED_TOKEN", `Expected a flow scalar value, but found: ${type}`);
          return {
            value: "",
            type: null,
            comment: "",
            range: [offset, offset + source.length, offset + source.length]
          };
      }
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, strict, onError);
      return {
        value,
        type: _type,
        comment: re.comment,
        range: [offset, valueEnd, re.offset]
      };
    }
    function plainValue(source, onError) {
      let badChar = "";
      switch (source[0]) {
        /* istanbul ignore next should not happen */
        case "	":
          badChar = "a tab character";
          break;
        case ",":
          badChar = "flow indicator character ,";
          break;
        case "%":
          badChar = "directive indicator character %";
          break;
        case "|":
        case ">": {
          badChar = `block scalar indicator ${source[0]}`;
          break;
        }
        case "@":
        case "`": {
          badChar = `reserved character ${source[0]}`;
          break;
        }
      }
      if (badChar)
        onError(0, "BAD_SCALAR_START", `Plain value cannot start with ${badChar}`);
      return unfoldLines(source);
    }
    function singleQuotedValue(source, onError) {
      if (source[source.length - 1] !== "'" || source.length === 1)
        onError(source.length, "MISSING_CHAR", "Missing closing 'quote");
      return unfoldLines(source.slice(1, -1)).replace(/''/g, "'");
    }
    function unfoldLines(source) {
      const line = /(.*?)\r?\n/sy;
      let match2 = line.exec(source);
      if (!match2)
        return source;
      let trimEnd, trimBoth;
      try {
        trimEnd = new RegExp("(?<![ 	])[ 	]+$");
        trimBoth = new RegExp("^[ 	]+|(?<![ 	])[ 	]+$", "g");
      } catch {
        trimEnd = /[ \t]+$/;
        trimBoth = /^[ \t]+|[ \t]+$/g;
      }
      let res = match2[1].replace(trimEnd, "");
      let sep3 = " ";
      let pos = line.lastIndex;
      while (match2 = line.exec(source)) {
        const lm = match2[1].replace(trimBoth, "");
        if (lm === "") {
          if (sep3 === "\n")
            res += sep3;
          else
            sep3 = "\n";
        } else {
          res += sep3 + lm;
          sep3 = " ";
        }
        pos = line.lastIndex;
      }
      const last = /[ \t]*(.*)/sy;
      last.lastIndex = pos;
      match2 = last.exec(source);
      return res + sep3 + (match2?.[1] ?? "");
    }
    function doubleQuotedValue(source, onError) {
      let res = "";
      for (let i = 1; i < source.length - 1; ++i) {
        const ch = source[i];
        if (ch === "\r" && source[i + 1] === "\n")
          continue;
        if (ch === "\n") {
          const { fold, offset } = foldNewline(source, i);
          res += fold;
          i = offset;
        } else if (ch === "\\") {
          let next = source[++i];
          const cc = escapeCodes[next];
          if (cc)
            res += cc;
          else if (next === "\n") {
            next = source[i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "\r" && source[i + 1] === "\n") {
            next = source[++i + 1];
            while (next === " " || next === "	")
              next = source[++i + 1];
          } else if (next === "x" || next === "u" || next === "U") {
            const length = next === "x" ? 2 : next === "u" ? 4 : 8;
            res += parseCharCode(source, i + 1, length, onError);
            i += length;
          } else {
            const raw = source.substr(i - 1, 2);
            onError(i - 1, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
            res += raw;
          }
        } else if (ch === " " || ch === "	") {
          const wsStart = i;
          let next = source[i + 1];
          while (next === " " || next === "	")
            next = source[++i + 1];
          if (next !== "\n" && !(next === "\r" && source[i + 2] === "\n"))
            res += i > wsStart ? source.slice(wsStart, i + 1) : ch;
        } else {
          res += ch;
        }
      }
      if (source[source.length - 1] !== '"' || source.length === 1)
        onError(source.length, "MISSING_CHAR", 'Missing closing "quote');
      return res;
    }
    function foldNewline(source, offset) {
      let fold = "";
      let ch = source[offset + 1];
      while (ch === " " || ch === "	" || ch === "\n" || ch === "\r") {
        if (ch === "\r" && source[offset + 2] !== "\n")
          break;
        if (ch === "\n")
          fold += "\n";
        offset += 1;
        ch = source[offset + 1];
      }
      if (!fold)
        fold = " ";
      return { fold, offset };
    }
    var escapeCodes = {
      "0": "\0",
      // null character
      a: "\x07",
      // bell character
      b: "\b",
      // backspace
      e: "\x1B",
      // escape character
      f: "\f",
      // form feed
      n: "\n",
      // line feed
      r: "\r",
      // carriage return
      t: "	",
      // horizontal tab
      v: "\v",
      // vertical tab
      N: "\x85",
      // Unicode next line
      _: "\xA0",
      // Unicode non-breaking space
      L: "\u2028",
      // Unicode line separator
      P: "\u2029",
      // Unicode paragraph separator
      " ": " ",
      '"': '"',
      "/": "/",
      "\\": "\\",
      "	": "	"
    };
    function parseCharCode(source, offset, length, onError) {
      const cc = source.substr(offset, length);
      const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
      const code = ok ? parseInt(cc, 16) : NaN;
      try {
        return String.fromCodePoint(code);
      } catch {
        const raw = source.substr(offset - 2, length + 2);
        onError(offset - 2, "BAD_DQ_ESCAPE", `Invalid escape sequence ${raw}`);
        return raw;
      }
    }
    exports.resolveFlowScalar = resolveFlowScalar;
  }
});

// ../node_modules/yaml/dist/compose/compose-scalar.js
var require_compose_scalar = __commonJS({
  "../node_modules/yaml/dist/compose/compose-scalar.js"(exports) {
    "use strict";
    var identity = require_identity();
    var Scalar = require_Scalar();
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    function composeScalar(ctx, token, tagToken, onError) {
      const { value, type, comment, range: range2 } = token.type === "block-scalar" ? resolveBlockScalar.resolveBlockScalar(ctx, token, onError) : resolveFlowScalar.resolveFlowScalar(token, ctx.options.strict, onError);
      const tagName = tagToken ? ctx.directives.tagName(tagToken.source, (msg) => onError(tagToken, "TAG_RESOLVE_FAILED", msg)) : null;
      let tag;
      if (ctx.options.stringKeys && ctx.atKey) {
        tag = ctx.schema[identity.SCALAR];
      } else if (tagName)
        tag = findScalarTagByName(ctx.schema, value, tagName, tagToken, onError);
      else if (token.type === "scalar")
        tag = findScalarTagByTest(ctx, value, token, onError);
      else
        tag = ctx.schema[identity.SCALAR];
      let scalar;
      try {
        const res = tag.resolve(value, (msg) => onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg), ctx.options);
        scalar = identity.isScalar(res) ? res : new Scalar.Scalar(res);
      } catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        onError(tagToken ?? token, "TAG_RESOLVE_FAILED", msg);
        scalar = new Scalar.Scalar(value);
      }
      scalar.range = range2;
      scalar.source = value;
      if (type)
        scalar.type = type;
      if (tagName)
        scalar.tag = tagName;
      if (tag.format)
        scalar.format = tag.format;
      if (comment)
        scalar.comment = comment;
      return scalar;
    }
    function findScalarTagByName(schema, value, tagName, tagToken, onError) {
      if (tagName === "!")
        return schema[identity.SCALAR];
      const matchWithTest = [];
      for (const tag of schema.tags) {
        if (!tag.collection && tag.tag === tagName) {
          if (tag.default && tag.test)
            matchWithTest.push(tag);
          else
            return tag;
        }
      }
      for (const tag of matchWithTest)
        if (tag.test?.test(value))
          return tag;
      const kt = schema.knownTags[tagName];
      if (kt && !kt.collection) {
        schema.tags.push(Object.assign({}, kt, { default: false, test: void 0 }));
        return kt;
      }
      onError(tagToken, "TAG_RESOLVE_FAILED", `Unresolved tag: ${tagName}`, tagName !== "tag:yaml.org,2002:str");
      return schema[identity.SCALAR];
    }
    function findScalarTagByTest({ atKey, directives, schema }, value, token, onError) {
      const tag = schema.tags.find((tag2) => (tag2.default === true || atKey && tag2.default === "key") && tag2.test?.test(value)) || schema[identity.SCALAR];
      if (schema.compat) {
        const compat = schema.compat.find((tag2) => tag2.default && tag2.test?.test(value)) ?? schema[identity.SCALAR];
        if (tag.tag !== compat.tag) {
          const ts = directives.tagString(tag.tag);
          const cs = directives.tagString(compat.tag);
          const msg = `Value may be parsed as either ${ts} or ${cs}`;
          onError(token, "TAG_RESOLVE_FAILED", msg, true);
        }
      }
      return tag;
    }
    exports.composeScalar = composeScalar;
  }
});

// ../node_modules/yaml/dist/compose/util-empty-scalar-position.js
var require_util_empty_scalar_position = __commonJS({
  "../node_modules/yaml/dist/compose/util-empty-scalar-position.js"(exports) {
    "use strict";
    function emptyScalarPosition(offset, before, pos) {
      if (before) {
        pos ?? (pos = before.length);
        for (let i = pos - 1; i >= 0; --i) {
          let st = before[i];
          switch (st.type) {
            case "space":
            case "comment":
            case "newline":
              offset -= st.source.length;
              continue;
          }
          st = before[++i];
          while (st?.type === "space") {
            offset += st.source.length;
            st = before[++i];
          }
          break;
        }
      }
      return offset;
    }
    exports.emptyScalarPosition = emptyScalarPosition;
  }
});

// ../node_modules/yaml/dist/compose/compose-node.js
var require_compose_node = __commonJS({
  "../node_modules/yaml/dist/compose/compose-node.js"(exports) {
    "use strict";
    var Alias = require_Alias();
    var identity = require_identity();
    var composeCollection = require_compose_collection();
    var composeScalar = require_compose_scalar();
    var resolveEnd = require_resolve_end();
    var utilEmptyScalarPosition = require_util_empty_scalar_position();
    var CN = { composeNode, composeEmptyNode };
    function composeNode(ctx, token, props, onError) {
      const atKey = ctx.atKey;
      const { spaceBefore, comment, anchor, tag } = props;
      let node;
      let isSrcToken = true;
      switch (token.type) {
        case "alias":
          node = composeAlias(ctx, token, onError);
          if (anchor || tag)
            onError(token, "ALIAS_PROPS", "An alias node must not specify any properties");
          break;
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "block-scalar":
          node = composeScalar.composeScalar(ctx, token, tag, onError);
          if (anchor)
            node.anchor = anchor.source.substring(1);
          break;
        case "block-map":
        case "block-seq":
        case "flow-collection":
          try {
            node = composeCollection.composeCollection(CN, ctx, token, props, onError);
            if (anchor)
              node.anchor = anchor.source.substring(1);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            onError(token, "RESOURCE_EXHAUSTION", message);
          }
          break;
        default: {
          const message = token.type === "error" ? token.message : `Unsupported token (type: ${token.type})`;
          onError(token, "UNEXPECTED_TOKEN", message);
          isSrcToken = false;
        }
      }
      node ?? (node = composeEmptyNode(ctx, token.offset, void 0, null, props, onError));
      if (anchor && node.anchor === "")
        onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      if (atKey && ctx.options.stringKeys && (!identity.isScalar(node) || typeof node.value !== "string" || node.tag && node.tag !== "tag:yaml.org,2002:str")) {
        const msg = "With stringKeys, all keys must be strings";
        onError(tag ?? token, "NON_STRING_KEY", msg);
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        if (token.type === "scalar" && token.source === "")
          node.comment = comment;
        else
          node.commentBefore = comment;
      }
      if (ctx.options.keepSourceTokens && isSrcToken)
        node.srcToken = token;
      return node;
    }
    function composeEmptyNode(ctx, offset, before, pos, { spaceBefore, comment, anchor, tag, end }, onError) {
      const token = {
        type: "scalar",
        offset: utilEmptyScalarPosition.emptyScalarPosition(offset, before, pos),
        indent: -1,
        source: ""
      };
      const node = composeScalar.composeScalar(ctx, token, tag, onError);
      if (anchor) {
        node.anchor = anchor.source.substring(1);
        if (node.anchor === "")
          onError(anchor, "BAD_ALIAS", "Anchor cannot be an empty string");
      }
      if (spaceBefore)
        node.spaceBefore = true;
      if (comment) {
        node.comment = comment;
        node.range[2] = end;
      }
      return node;
    }
    function composeAlias({ options }, { offset, source, end }, onError) {
      const alias = new Alias.Alias(source.substring(1));
      if (alias.source === "")
        onError(offset, "BAD_ALIAS", "Alias cannot be an empty string");
      if (alias.source.endsWith(":"))
        onError(offset + source.length - 1, "BAD_ALIAS", "Alias ending in : is ambiguous", true);
      const valueEnd = offset + source.length;
      const re = resolveEnd.resolveEnd(end, valueEnd, options.strict, onError);
      alias.range = [offset, valueEnd, re.offset];
      if (re.comment)
        alias.comment = re.comment;
      return alias;
    }
    exports.composeEmptyNode = composeEmptyNode;
    exports.composeNode = composeNode;
  }
});

// ../node_modules/yaml/dist/compose/compose-doc.js
var require_compose_doc = __commonJS({
  "../node_modules/yaml/dist/compose/compose-doc.js"(exports) {
    "use strict";
    var Document = require_Document();
    var composeNode = require_compose_node();
    var resolveEnd = require_resolve_end();
    var resolveProps = require_resolve_props();
    function composeDoc(options, directives, { offset, start, value, end }, onError) {
      const opts = Object.assign({ _directives: directives }, options);
      const doc = new Document.Document(void 0, opts);
      const ctx = {
        atKey: false,
        atRoot: true,
        directives: doc.directives,
        options: doc.options,
        schema: doc.schema
      };
      const props = resolveProps.resolveProps(start, {
        indicator: "doc-start",
        next: value ?? end?.[0],
        offset,
        onError,
        parentIndent: 0,
        startOnNewline: true
      });
      if (props.found) {
        doc.directives.docStart = true;
        if (value && (value.type === "block-map" || value.type === "block-seq") && !props.hasNewline)
          onError(props.end, "MISSING_CHAR", "Block collection cannot start on same line with directives-end marker");
      }
      doc.contents = value ? composeNode.composeNode(ctx, value, props, onError) : composeNode.composeEmptyNode(ctx, props.end, start, null, props, onError);
      const contentEnd = doc.contents.range[2];
      const re = resolveEnd.resolveEnd(end, contentEnd, false, onError);
      if (re.comment)
        doc.comment = re.comment;
      doc.range = [offset, contentEnd, re.offset];
      return doc;
    }
    exports.composeDoc = composeDoc;
  }
});

// ../node_modules/yaml/dist/compose/composer.js
var require_composer = __commonJS({
  "../node_modules/yaml/dist/compose/composer.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var directives = require_directives();
    var Document = require_Document();
    var errors = require_errors();
    var identity = require_identity();
    var composeDoc = require_compose_doc();
    var resolveEnd = require_resolve_end();
    function getErrorPos(src) {
      if (typeof src === "number")
        return [src, src + 1];
      if (Array.isArray(src))
        return src.length === 2 ? src : [src[0], src[1]];
      const { offset, source } = src;
      return [offset, offset + (typeof source === "string" ? source.length : 1)];
    }
    function parsePrelude(prelude) {
      let comment = "";
      let atComment = false;
      let afterEmptyLine = false;
      for (let i = 0; i < prelude.length; ++i) {
        const source = prelude[i];
        switch (source[0]) {
          case "#":
            comment += (comment === "" ? "" : afterEmptyLine ? "\n\n" : "\n") + (source.substring(1) || " ");
            atComment = true;
            afterEmptyLine = false;
            break;
          case "%":
            if (prelude[i + 1]?.[0] !== "#")
              i += 1;
            atComment = false;
            break;
          default:
            if (!atComment)
              afterEmptyLine = true;
            atComment = false;
        }
      }
      return { comment, afterEmptyLine };
    }
    var Composer = class {
      constructor(options = {}) {
        this.doc = null;
        this.atDirectives = false;
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
        this.onError = (source, code, message, warning) => {
          const pos = getErrorPos(source);
          if (warning)
            this.warnings.push(new errors.YAMLWarning(pos, code, message));
          else
            this.errors.push(new errors.YAMLParseError(pos, code, message));
        };
        this.directives = new directives.Directives({ version: options.version || "1.2" });
        this.options = options;
      }
      decorate(doc, afterDoc) {
        const { comment, afterEmptyLine } = parsePrelude(this.prelude);
        if (comment) {
          const dc = doc.contents;
          if (afterDoc) {
            doc.comment = doc.comment ? `${doc.comment}
${comment}` : comment;
          } else if (afterEmptyLine || doc.directives.docStart || !dc) {
            doc.commentBefore = comment;
          } else if (identity.isCollection(dc) && !dc.flow && dc.items.length > 0) {
            let it = dc.items[0];
            if (identity.isPair(it))
              it = it.key;
            const cb = it.commentBefore;
            it.commentBefore = cb ? `${comment}
${cb}` : comment;
          } else {
            const cb = dc.commentBefore;
            dc.commentBefore = cb ? `${comment}
${cb}` : comment;
          }
        }
        if (afterDoc) {
          for (let i = 0; i < this.errors.length; ++i)
            doc.errors.push(this.errors[i]);
          for (let i = 0; i < this.warnings.length; ++i)
            doc.warnings.push(this.warnings[i]);
        } else {
          doc.errors = this.errors;
          doc.warnings = this.warnings;
        }
        this.prelude = [];
        this.errors = [];
        this.warnings = [];
      }
      /**
       * Current stream status information.
       *
       * Mostly useful at the end of input for an empty stream.
       */
      streamInfo() {
        return {
          comment: parsePrelude(this.prelude).comment,
          directives: this.directives,
          errors: this.errors,
          warnings: this.warnings
        };
      }
      /**
       * Compose tokens into documents.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *compose(tokens, forceDoc = false, endOffset = -1) {
        for (const token of tokens)
          yield* this.next(token);
        yield* this.end(forceDoc, endOffset);
      }
      /** Advance the composer by one CST token. */
      *next(token) {
        if (node_process.env.LOG_STREAM)
          console.dir(token, { depth: null });
        switch (token.type) {
          case "directive":
            this.directives.add(token.source, (offset, message, warning) => {
              const pos = getErrorPos(token);
              pos[0] += offset;
              this.onError(pos, "BAD_DIRECTIVE", message, warning);
            });
            this.prelude.push(token.source);
            this.atDirectives = true;
            break;
          case "document": {
            const doc = composeDoc.composeDoc(this.options, this.directives, token, this.onError);
            if (this.atDirectives && !doc.directives.docStart)
              this.onError(token, "MISSING_CHAR", "Missing directives-end/doc-start indicator line");
            this.decorate(doc, false);
            if (this.doc)
              yield this.doc;
            this.doc = doc;
            this.atDirectives = false;
            break;
          }
          case "byte-order-mark":
          case "space":
            break;
          case "comment":
          case "newline":
            this.prelude.push(token.source);
            break;
          case "error": {
            const msg = token.source ? `${token.message}: ${JSON.stringify(token.source)}` : token.message;
            const error = new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg);
            if (this.atDirectives || !this.doc)
              this.errors.push(error);
            else
              this.doc.errors.push(error);
            break;
          }
          case "doc-end": {
            if (!this.doc) {
              const msg = "Unexpected doc-end without preceding document";
              this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", msg));
              break;
            }
            this.doc.directives.docEnd = true;
            const end = resolveEnd.resolveEnd(token.end, token.offset + token.source.length, this.doc.options.strict, this.onError);
            this.decorate(this.doc, true);
            if (end.comment) {
              const dc = this.doc.comment;
              this.doc.comment = dc ? `${dc}
${end.comment}` : end.comment;
            }
            this.doc.range[2] = end.offset;
            break;
          }
          default:
            this.errors.push(new errors.YAMLParseError(getErrorPos(token), "UNEXPECTED_TOKEN", `Unsupported token ${token.type}`));
        }
      }
      /**
       * Call at end of input to yield any remaining document.
       *
       * @param forceDoc - If the stream contains no document, still emit a final document including any comments and directives that would be applied to a subsequent document.
       * @param endOffset - Should be set if `forceDoc` is also set, to set the document range end and to indicate errors correctly.
       */
      *end(forceDoc = false, endOffset = -1) {
        if (this.doc) {
          this.decorate(this.doc, true);
          yield this.doc;
          this.doc = null;
        } else if (forceDoc) {
          const opts = Object.assign({ _directives: this.directives }, this.options);
          const doc = new Document.Document(void 0, opts);
          if (this.atDirectives)
            this.onError(endOffset, "MISSING_CHAR", "Missing directives-end indicator line");
          doc.range = [0, endOffset, endOffset];
          this.decorate(doc, false);
          yield doc;
        }
      }
    };
    exports.Composer = Composer;
  }
});

// ../node_modules/yaml/dist/parse/cst-scalar.js
var require_cst_scalar = __commonJS({
  "../node_modules/yaml/dist/parse/cst-scalar.js"(exports) {
    "use strict";
    var resolveBlockScalar = require_resolve_block_scalar();
    var resolveFlowScalar = require_resolve_flow_scalar();
    var errors = require_errors();
    var stringifyString = require_stringifyString();
    function resolveAsScalar(token, strict = true, onError) {
      if (token) {
        const _onError = (pos, code, message) => {
          const offset = typeof pos === "number" ? pos : Array.isArray(pos) ? pos[0] : pos.offset;
          if (onError)
            onError(offset, code, message);
          else
            throw new errors.YAMLParseError([offset, offset + 1], code, message);
        };
        switch (token.type) {
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return resolveFlowScalar.resolveFlowScalar(token, strict, _onError);
          case "block-scalar":
            return resolveBlockScalar.resolveBlockScalar({ options: { strict } }, token, _onError);
        }
      }
      return null;
    }
    function createScalarToken(value, context) {
      const { implicitKey = false, indent, inFlow = false, offset = -1, type = "PLAIN" } = context;
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey,
        indent: indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      const end = context.end ?? [
        { type: "newline", offset: -1, indent, source: "\n" }
      ];
      switch (source[0]) {
        case "|":
        case ">": {
          const he = source.indexOf("\n");
          const head = source.substring(0, he);
          const body = source.substring(he + 1) + "\n";
          const props = [
            { type: "block-scalar-header", offset, indent, source: head }
          ];
          if (!addEndtoBlockProps(props, end))
            props.push({ type: "newline", offset: -1, indent, source: "\n" });
          return { type: "block-scalar", offset, indent, props, source: body };
        }
        case '"':
          return { type: "double-quoted-scalar", offset, indent, source, end };
        case "'":
          return { type: "single-quoted-scalar", offset, indent, source, end };
        default:
          return { type: "scalar", offset, indent, source, end };
      }
    }
    function setScalarValue(token, value, context = {}) {
      let { afterKey = false, implicitKey = false, inFlow = false, type } = context;
      let indent = "indent" in token ? token.indent : null;
      if (afterKey && typeof indent === "number")
        indent += 2;
      if (!type)
        switch (token.type) {
          case "single-quoted-scalar":
            type = "QUOTE_SINGLE";
            break;
          case "double-quoted-scalar":
            type = "QUOTE_DOUBLE";
            break;
          case "block-scalar": {
            const header = token.props[0];
            if (header.type !== "block-scalar-header")
              throw new Error("Invalid block scalar header");
            type = header.source[0] === ">" ? "BLOCK_FOLDED" : "BLOCK_LITERAL";
            break;
          }
          default:
            type = "PLAIN";
        }
      const source = stringifyString.stringifyString({ type, value }, {
        implicitKey: implicitKey || indent === null,
        indent: indent !== null && indent > 0 ? " ".repeat(indent) : "",
        inFlow,
        options: { blockQuote: true, lineWidth: -1 }
      });
      switch (source[0]) {
        case "|":
        case ">":
          setBlockScalarValue(token, source);
          break;
        case '"':
          setFlowScalarValue(token, source, "double-quoted-scalar");
          break;
        case "'":
          setFlowScalarValue(token, source, "single-quoted-scalar");
          break;
        default:
          setFlowScalarValue(token, source, "scalar");
      }
    }
    function setBlockScalarValue(token, source) {
      const he = source.indexOf("\n");
      const head = source.substring(0, he);
      const body = source.substring(he + 1) + "\n";
      if (token.type === "block-scalar") {
        const header = token.props[0];
        if (header.type !== "block-scalar-header")
          throw new Error("Invalid block scalar header");
        header.source = head;
        token.source = body;
      } else {
        const { offset } = token;
        const indent = "indent" in token ? token.indent : -1;
        const props = [
          { type: "block-scalar-header", offset, indent, source: head }
        ];
        if (!addEndtoBlockProps(props, "end" in token ? token.end : void 0))
          props.push({ type: "newline", offset: -1, indent, source: "\n" });
        for (const key of Object.keys(token))
          if (key !== "type" && key !== "offset")
            delete token[key];
        Object.assign(token, { type: "block-scalar", indent, props, source: body });
      }
    }
    function addEndtoBlockProps(props, end) {
      if (end)
        for (const st of end)
          switch (st.type) {
            case "space":
            case "comment":
              props.push(st);
              break;
            case "newline":
              props.push(st);
              return true;
          }
      return false;
    }
    function setFlowScalarValue(token, source, type) {
      switch (token.type) {
        case "scalar":
        case "double-quoted-scalar":
        case "single-quoted-scalar":
          token.type = type;
          token.source = source;
          break;
        case "block-scalar": {
          const end = token.props.slice(1);
          let oa = source.length;
          if (token.props[0].type === "block-scalar-header")
            oa -= token.props[0].source.length;
          for (const tok of end)
            tok.offset += oa;
          delete token.props;
          Object.assign(token, { type, source, end });
          break;
        }
        case "block-map":
        case "block-seq": {
          const offset = token.offset + source.length;
          const nl = { type: "newline", offset, indent: token.indent, source: "\n" };
          delete token.items;
          Object.assign(token, { type, source, end: [nl] });
          break;
        }
        default: {
          const indent = "indent" in token ? token.indent : -1;
          const end = "end" in token && Array.isArray(token.end) ? token.end.filter((st) => st.type === "space" || st.type === "comment" || st.type === "newline") : [];
          for (const key of Object.keys(token))
            if (key !== "type" && key !== "offset")
              delete token[key];
          Object.assign(token, { type, indent, source, end });
        }
      }
    }
    exports.createScalarToken = createScalarToken;
    exports.resolveAsScalar = resolveAsScalar;
    exports.setScalarValue = setScalarValue;
  }
});

// ../node_modules/yaml/dist/parse/cst-stringify.js
var require_cst_stringify = __commonJS({
  "../node_modules/yaml/dist/parse/cst-stringify.js"(exports) {
    "use strict";
    var stringify = (cst) => "type" in cst ? stringifyToken(cst) : stringifyItem(cst);
    function stringifyToken(token) {
      switch (token.type) {
        case "block-scalar": {
          let res = "";
          for (const tok of token.props)
            res += stringifyToken(tok);
          return res + token.source;
        }
        case "block-map":
        case "block-seq": {
          let res = "";
          for (const item of token.items)
            res += stringifyItem(item);
          return res;
        }
        case "flow-collection": {
          let res = token.start.source;
          for (const item of token.items)
            res += stringifyItem(item);
          for (const st of token.end)
            res += st.source;
          return res;
        }
        case "document": {
          let res = stringifyItem(token);
          if (token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
        default: {
          let res = token.source;
          if ("end" in token && token.end)
            for (const st of token.end)
              res += st.source;
          return res;
        }
      }
    }
    function stringifyItem({ start, key, sep: sep3, value }) {
      let res = "";
      for (const st of start)
        res += st.source;
      if (key)
        res += stringifyToken(key);
      if (sep3)
        for (const st of sep3)
          res += st.source;
      if (value)
        res += stringifyToken(value);
      return res;
    }
    exports.stringify = stringify;
  }
});

// ../node_modules/yaml/dist/parse/cst-visit.js
var require_cst_visit = __commonJS({
  "../node_modules/yaml/dist/parse/cst-visit.js"(exports) {
    "use strict";
    var BREAK = /* @__PURE__ */ Symbol("break visit");
    var SKIP = /* @__PURE__ */ Symbol("skip children");
    var REMOVE = /* @__PURE__ */ Symbol("remove item");
    function visit(cst, visitor) {
      if ("type" in cst && cst.type === "document")
        cst = { start: cst.start, value: cst.value };
      _visit(Object.freeze([]), cst, visitor);
    }
    visit.BREAK = BREAK;
    visit.SKIP = SKIP;
    visit.REMOVE = REMOVE;
    visit.itemAtPath = (cst, path2) => {
      let item = cst;
      for (const [field, index] of path2) {
        const tok = item?.[field];
        if (tok && "items" in tok) {
          item = tok.items[index];
        } else
          return void 0;
      }
      return item;
    };
    visit.parentCollection = (cst, path2) => {
      const parent = visit.itemAtPath(cst, path2.slice(0, -1));
      const field = path2[path2.length - 1][0];
      const coll = parent?.[field];
      if (coll && "items" in coll)
        return coll;
      throw new Error("Parent collection not found");
    };
    function _visit(path2, item, visitor) {
      let ctrl = visitor(item, path2);
      if (typeof ctrl === "symbol")
        return ctrl;
      for (const field of ["key", "value"]) {
        const token = item[field];
        if (token && "items" in token) {
          for (let i = 0; i < token.items.length; ++i) {
            const ci = _visit(Object.freeze(path2.concat([[field, i]])), token.items[i], visitor);
            if (typeof ci === "number")
              i = ci - 1;
            else if (ci === BREAK)
              return BREAK;
            else if (ci === REMOVE) {
              token.items.splice(i, 1);
              i -= 1;
            }
          }
          if (typeof ctrl === "function" && field === "key")
            ctrl = ctrl(item, path2);
        }
      }
      return typeof ctrl === "function" ? ctrl(item, path2) : ctrl;
    }
    exports.visit = visit;
  }
});

// ../node_modules/yaml/dist/parse/cst.js
var require_cst = __commonJS({
  "../node_modules/yaml/dist/parse/cst.js"(exports) {
    "use strict";
    var cstScalar = require_cst_scalar();
    var cstStringify = require_cst_stringify();
    var cstVisit = require_cst_visit();
    var BOM = "\uFEFF";
    var DOCUMENT = "";
    var FLOW_END = "";
    var SCALAR = "";
    var isCollection = (token) => !!token && "items" in token;
    var isScalar = (token) => !!token && (token.type === "scalar" || token.type === "single-quoted-scalar" || token.type === "double-quoted-scalar" || token.type === "block-scalar");
    function prettyToken(token) {
      switch (token) {
        case BOM:
          return "<BOM>";
        case DOCUMENT:
          return "<DOC>";
        case FLOW_END:
          return "<FLOW_END>";
        case SCALAR:
          return "<SCALAR>";
        default:
          return JSON.stringify(token);
      }
    }
    function tokenType(source) {
      switch (source) {
        case BOM:
          return "byte-order-mark";
        case DOCUMENT:
          return "doc-mode";
        case FLOW_END:
          return "flow-error-end";
        case SCALAR:
          return "scalar";
        case "---":
          return "doc-start";
        case "...":
          return "doc-end";
        case "":
        case "\n":
        case "\r\n":
          return "newline";
        case "-":
          return "seq-item-ind";
        case "?":
          return "explicit-key-ind";
        case ":":
          return "map-value-ind";
        case "{":
          return "flow-map-start";
        case "}":
          return "flow-map-end";
        case "[":
          return "flow-seq-start";
        case "]":
          return "flow-seq-end";
        case ",":
          return "comma";
      }
      switch (source[0]) {
        case " ":
        case "	":
          return "space";
        case "#":
          return "comment";
        case "%":
          return "directive-line";
        case "*":
          return "alias";
        case "&":
          return "anchor";
        case "!":
          return "tag";
        case "'":
          return "single-quoted-scalar";
        case '"':
          return "double-quoted-scalar";
        case "|":
        case ">":
          return "block-scalar-header";
      }
      return null;
    }
    exports.createScalarToken = cstScalar.createScalarToken;
    exports.resolveAsScalar = cstScalar.resolveAsScalar;
    exports.setScalarValue = cstScalar.setScalarValue;
    exports.stringify = cstStringify.stringify;
    exports.visit = cstVisit.visit;
    exports.BOM = BOM;
    exports.DOCUMENT = DOCUMENT;
    exports.FLOW_END = FLOW_END;
    exports.SCALAR = SCALAR;
    exports.isCollection = isCollection;
    exports.isScalar = isScalar;
    exports.prettyToken = prettyToken;
    exports.tokenType = tokenType;
  }
});

// ../node_modules/yaml/dist/parse/lexer.js
var require_lexer = __commonJS({
  "../node_modules/yaml/dist/parse/lexer.js"(exports) {
    "use strict";
    var cst = require_cst();
    function isEmpty(ch) {
      switch (ch) {
        case void 0:
        case " ":
        case "\n":
        case "\r":
        case "	":
          return true;
        default:
          return false;
      }
    }
    var hexDigits = new Set("0123456789ABCDEFabcdef");
    var tagChars = new Set("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-#;/?:@&=+$_.!~*'()");
    var flowIndicatorChars = new Set(",[]{}");
    var invalidAnchorChars = new Set(" ,[]{}\n\r	");
    var isNotAnchorChar = (ch) => !ch || invalidAnchorChars.has(ch);
    var Lexer = class {
      constructor() {
        this.atEnd = false;
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        this.buffer = "";
        this.flowKey = false;
        this.flowLevel = 0;
        this.indentNext = 0;
        this.indentValue = 0;
        this.lineEndPos = null;
        this.next = null;
        this.pos = 0;
      }
      /**
       * Generate YAML tokens from the `source` string. If `incomplete`,
       * a part of the last line may be left as a buffer for the next call.
       *
       * @returns A generator of lexical tokens
       */
      *lex(source, incomplete = false) {
        if (source) {
          if (typeof source !== "string")
            throw TypeError("source is not a string");
          this.buffer = this.buffer ? this.buffer + source : source;
          this.lineEndPos = null;
        }
        this.atEnd = !incomplete;
        let next = this.next ?? "stream";
        while (next && (incomplete || this.hasChars(1)))
          next = yield* this.parseNext(next);
      }
      atLineEnd() {
        let i = this.pos;
        let ch = this.buffer[i];
        while (ch === " " || ch === "	")
          ch = this.buffer[++i];
        if (!ch || ch === "#" || ch === "\n")
          return true;
        if (ch === "\r")
          return this.buffer[i + 1] === "\n";
        return false;
      }
      charAt(n) {
        return this.buffer[this.pos + n];
      }
      continueScalar(offset) {
        let ch = this.buffer[offset];
        if (this.indentNext > 0) {
          let indent = 0;
          while (ch === " ")
            ch = this.buffer[++indent + offset];
          if (ch === "\r") {
            const next = this.buffer[indent + offset + 1];
            if (next === "\n" || !next && !this.atEnd)
              return offset + indent + 1;
          }
          return ch === "\n" || indent >= this.indentNext || !ch && !this.atEnd ? offset + indent : -1;
        }
        if (ch === "-" || ch === ".") {
          const dt = this.buffer.substr(offset, 3);
          if ((dt === "---" || dt === "...") && isEmpty(this.buffer[offset + 3]))
            return -1;
        }
        return offset;
      }
      getLine() {
        let end = this.lineEndPos;
        if (typeof end !== "number" || end !== -1 && end < this.pos) {
          end = this.buffer.indexOf("\n", this.pos);
          this.lineEndPos = end;
        }
        if (end === -1)
          return this.atEnd ? this.buffer.substring(this.pos) : null;
        if (this.buffer[end - 1] === "\r")
          end -= 1;
        return this.buffer.substring(this.pos, end);
      }
      hasChars(n) {
        return this.pos + n <= this.buffer.length;
      }
      setNext(state) {
        this.buffer = this.buffer.substring(this.pos);
        this.pos = 0;
        this.lineEndPos = null;
        this.next = state;
        return null;
      }
      peek(n) {
        return this.buffer.substr(this.pos, n);
      }
      *parseNext(next) {
        switch (next) {
          case "stream":
            return yield* this.parseStream();
          case "line-start":
            return yield* this.parseLineStart();
          case "block-start":
            return yield* this.parseBlockStart();
          case "doc":
            return yield* this.parseDocument();
          case "flow":
            return yield* this.parseFlowCollection();
          case "quoted-scalar":
            return yield* this.parseQuotedScalar();
          case "block-scalar":
            return yield* this.parseBlockScalar();
          case "plain-scalar":
            return yield* this.parsePlainScalar();
        }
      }
      *parseStream() {
        let line = this.getLine();
        if (line === null)
          return this.setNext("stream");
        if (line[0] === cst.BOM) {
          yield* this.pushCount(1);
          line = line.substring(1);
        }
        if (line[0] === "%") {
          let dirEnd = line.length;
          let cs = line.indexOf("#");
          while (cs !== -1) {
            const ch = line[cs - 1];
            if (ch === " " || ch === "	") {
              dirEnd = cs - 1;
              break;
            } else {
              cs = line.indexOf("#", cs + 1);
            }
          }
          while (true) {
            const ch = line[dirEnd - 1];
            if (ch === " " || ch === "	")
              dirEnd -= 1;
            else
              break;
          }
          const n = (yield* this.pushCount(dirEnd)) + (yield* this.pushSpaces(true));
          yield* this.pushCount(line.length - n);
          this.pushNewline();
          return "stream";
        }
        if (this.atLineEnd()) {
          const sp = yield* this.pushSpaces(true);
          yield* this.pushCount(line.length - sp);
          yield* this.pushNewline();
          return "stream";
        }
        yield cst.DOCUMENT;
        return yield* this.parseLineStart();
      }
      *parseLineStart() {
        const ch = this.charAt(0);
        if (!ch && !this.atEnd)
          return this.setNext("line-start");
        if (ch === "-" || ch === ".") {
          if (!this.atEnd && !this.hasChars(4))
            return this.setNext("line-start");
          const s = this.peek(3);
          if ((s === "---" || s === "...") && isEmpty(this.charAt(3))) {
            yield* this.pushCount(3);
            this.indentValue = 0;
            this.indentNext = 0;
            return s === "---" ? "doc" : "stream";
          }
        }
        this.indentValue = yield* this.pushSpaces(false);
        if (this.indentNext > this.indentValue && !isEmpty(this.charAt(1)))
          this.indentNext = this.indentValue;
        return yield* this.parseBlockStart();
      }
      *parseBlockStart() {
        const [ch0, ch1] = this.peek(2);
        if (!ch1 && !this.atEnd)
          return this.setNext("block-start");
        if ((ch0 === "-" || ch0 === "?" || ch0 === ":") && isEmpty(ch1)) {
          const n = (yield* this.pushCount(1)) + (yield* this.pushSpaces(true));
          this.indentNext = this.indentValue + 1;
          this.indentValue += n;
          return "block-start";
        }
        return "doc";
      }
      *parseDocument() {
        yield* this.pushSpaces(true);
        const line = this.getLine();
        if (line === null)
          return this.setNext("doc");
        let n = yield* this.pushIndicators();
        switch (line[n]) {
          case "#":
            yield* this.pushCount(line.length - n);
          // fallthrough
          case void 0:
            yield* this.pushNewline();
            return yield* this.parseLineStart();
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel = 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            return "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "doc";
          case '"':
          case "'":
            return yield* this.parseQuotedScalar();
          case "|":
          case ">":
            n += yield* this.parseBlockScalarHeader();
            n += yield* this.pushSpaces(true);
            yield* this.pushCount(line.length - n);
            yield* this.pushNewline();
            return yield* this.parseBlockScalar();
          default:
            return yield* this.parsePlainScalar();
        }
      }
      *parseFlowCollection() {
        let nl, sp;
        let indent = -1;
        do {
          nl = yield* this.pushNewline();
          if (nl > 0) {
            sp = yield* this.pushSpaces(false);
            this.indentValue = indent = sp;
          } else {
            sp = 0;
          }
          sp += yield* this.pushSpaces(true);
        } while (nl + sp > 0);
        const line = this.getLine();
        if (line === null)
          return this.setNext("flow");
        if (indent !== -1 && indent < this.indentNext && line[0] !== "#" || indent === 0 && (line.startsWith("---") || line.startsWith("...")) && isEmpty(line[3])) {
          const atFlowEndMarker = indent === this.indentNext - 1 && this.flowLevel === 1 && (line[0] === "]" || line[0] === "}");
          if (!atFlowEndMarker) {
            this.flowLevel = 0;
            yield cst.FLOW_END;
            return yield* this.parseLineStart();
          }
        }
        let n = 0;
        while (line[n] === ",") {
          n += yield* this.pushCount(1);
          n += yield* this.pushSpaces(true);
          this.flowKey = false;
        }
        n += yield* this.pushIndicators();
        switch (line[n]) {
          case void 0:
            return "flow";
          case "#":
            yield* this.pushCount(line.length - n);
            return "flow";
          case "{":
          case "[":
            yield* this.pushCount(1);
            this.flowKey = false;
            this.flowLevel += 1;
            return "flow";
          case "}":
          case "]":
            yield* this.pushCount(1);
            this.flowKey = true;
            this.flowLevel -= 1;
            return this.flowLevel ? "flow" : "doc";
          case "*":
            yield* this.pushUntil(isNotAnchorChar);
            return "flow";
          case '"':
          case "'":
            this.flowKey = true;
            return yield* this.parseQuotedScalar();
          case ":": {
            const next = this.charAt(1);
            if (this.flowKey || isEmpty(next) || next === ",") {
              this.flowKey = false;
              yield* this.pushCount(1);
              yield* this.pushSpaces(true);
              return "flow";
            }
          }
          // fallthrough
          default:
            this.flowKey = false;
            return yield* this.parsePlainScalar();
        }
      }
      *parseQuotedScalar() {
        const quote = this.charAt(0);
        let end = this.buffer.indexOf(quote, this.pos + 1);
        if (quote === "'") {
          while (end !== -1 && this.buffer[end + 1] === "'")
            end = this.buffer.indexOf("'", end + 2);
        } else {
          while (end !== -1) {
            let n = 0;
            while (this.buffer[end - 1 - n] === "\\")
              n += 1;
            if (n % 2 === 0)
              break;
            end = this.buffer.indexOf('"', end + 1);
          }
        }
        const qb = this.buffer.substring(0, end);
        let nl = qb.indexOf("\n", this.pos);
        if (nl !== -1) {
          while (nl !== -1) {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = qb.indexOf("\n", cs);
          }
          if (nl !== -1) {
            end = nl - (qb[nl - 1] === "\r" ? 2 : 1);
          }
        }
        if (end === -1) {
          if (!this.atEnd)
            return this.setNext("quoted-scalar");
          end = this.buffer.length;
        }
        yield* this.pushToIndex(end + 1, false);
        return this.flowLevel ? "flow" : "doc";
      }
      *parseBlockScalarHeader() {
        this.blockScalarIndent = -1;
        this.blockScalarKeep = false;
        let i = this.pos;
        while (true) {
          const ch = this.buffer[++i];
          if (ch === "+")
            this.blockScalarKeep = true;
          else if (ch > "0" && ch <= "9")
            this.blockScalarIndent = Number(ch) - 1;
          else if (ch !== "-")
            break;
        }
        return yield* this.pushUntil((ch) => isEmpty(ch) || ch === "#");
      }
      *parseBlockScalar() {
        let nl = this.pos - 1;
        let indent = 0;
        let ch;
        loop: for (let i2 = this.pos; ch = this.buffer[i2]; ++i2) {
          switch (ch) {
            case " ":
              indent += 1;
              break;
            case "\n":
              nl = i2;
              indent = 0;
              break;
            case "\r": {
              const next = this.buffer[i2 + 1];
              if (!next && !this.atEnd)
                return this.setNext("block-scalar");
              if (next === "\n")
                break;
            }
            // fallthrough
            default:
              break loop;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("block-scalar");
        if (indent >= this.indentNext) {
          if (this.blockScalarIndent === -1)
            this.indentNext = indent;
          else {
            this.indentNext = this.blockScalarIndent + (this.indentNext === 0 ? 1 : this.indentNext);
          }
          do {
            const cs = this.continueScalar(nl + 1);
            if (cs === -1)
              break;
            nl = this.buffer.indexOf("\n", cs);
          } while (nl !== -1);
          if (nl === -1) {
            if (!this.atEnd)
              return this.setNext("block-scalar");
            nl = this.buffer.length;
          }
        }
        let i = nl + 1;
        ch = this.buffer[i];
        while (ch === " ")
          ch = this.buffer[++i];
        if (ch === "	") {
          while (ch === "	" || ch === " " || ch === "\r" || ch === "\n")
            ch = this.buffer[++i];
          nl = i - 1;
        } else if (!this.blockScalarKeep) {
          do {
            let i2 = nl - 1;
            let ch2 = this.buffer[i2];
            if (ch2 === "\r")
              ch2 = this.buffer[--i2];
            const lastChar = i2;
            while (ch2 === " ")
              ch2 = this.buffer[--i2];
            if (ch2 === "\n" && i2 >= this.pos && i2 + 1 + indent > lastChar)
              nl = i2;
            else
              break;
          } while (true);
        }
        yield cst.SCALAR;
        yield* this.pushToIndex(nl + 1, true);
        return yield* this.parseLineStart();
      }
      *parsePlainScalar() {
        const inFlow = this.flowLevel > 0;
        let end = this.pos - 1;
        let i = this.pos - 1;
        let ch;
        while (ch = this.buffer[++i]) {
          if (ch === ":") {
            const next = this.buffer[i + 1];
            if (isEmpty(next) || inFlow && flowIndicatorChars.has(next))
              break;
            end = i;
          } else if (isEmpty(ch)) {
            let next = this.buffer[i + 1];
            if (ch === "\r") {
              if (next === "\n") {
                i += 1;
                ch = "\n";
                next = this.buffer[i + 1];
              } else
                end = i;
            }
            if (next === "#" || inFlow && flowIndicatorChars.has(next))
              break;
            if (ch === "\n") {
              const cs = this.continueScalar(i + 1);
              if (cs === -1)
                break;
              i = Math.max(i, cs - 2);
            }
          } else {
            if (inFlow && flowIndicatorChars.has(ch))
              break;
            end = i;
          }
        }
        if (!ch && !this.atEnd)
          return this.setNext("plain-scalar");
        yield cst.SCALAR;
        yield* this.pushToIndex(end + 1, true);
        return inFlow ? "flow" : "doc";
      }
      *pushCount(n) {
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos += n;
          return n;
        }
        return 0;
      }
      *pushToIndex(i, allowEmpty) {
        const s = this.buffer.slice(this.pos, i);
        if (s) {
          yield s;
          this.pos += s.length;
          return s.length;
        } else if (allowEmpty)
          yield "";
        return 0;
      }
      *pushIndicators() {
        let n = 0;
        loop: while (true) {
          switch (this.charAt(0)) {
            case "!":
              n += yield* this.pushTag();
              n += yield* this.pushSpaces(true);
              continue loop;
            case "&":
              n += yield* this.pushUntil(isNotAnchorChar);
              n += yield* this.pushSpaces(true);
              continue loop;
            case "-":
            // this is an error
            case "?":
            // this is an error outside flow collections
            case ":": {
              const inFlow = this.flowLevel > 0;
              const ch1 = this.charAt(1);
              if (isEmpty(ch1) || inFlow && flowIndicatorChars.has(ch1)) {
                if (!inFlow)
                  this.indentNext = this.indentValue + 1;
                else if (this.flowKey)
                  this.flowKey = false;
                n += yield* this.pushCount(1);
                n += yield* this.pushSpaces(true);
                continue loop;
              }
            }
          }
          break loop;
        }
        return n;
      }
      *pushTag() {
        if (this.charAt(1) === "<") {
          let i = this.pos + 2;
          let ch = this.buffer[i];
          while (!isEmpty(ch) && ch !== ">")
            ch = this.buffer[++i];
          return yield* this.pushToIndex(ch === ">" ? i + 1 : i, false);
        } else {
          let i = this.pos + 1;
          let ch = this.buffer[i];
          while (ch) {
            if (tagChars.has(ch))
              ch = this.buffer[++i];
            else if (ch === "%" && hexDigits.has(this.buffer[i + 1]) && hexDigits.has(this.buffer[i + 2])) {
              ch = this.buffer[i += 3];
            } else
              break;
          }
          return yield* this.pushToIndex(i, false);
        }
      }
      *pushNewline() {
        const ch = this.buffer[this.pos];
        if (ch === "\n")
          return yield* this.pushCount(1);
        else if (ch === "\r" && this.charAt(1) === "\n")
          return yield* this.pushCount(2);
        else
          return 0;
      }
      *pushSpaces(allowTabs) {
        let i = this.pos - 1;
        let ch;
        do {
          ch = this.buffer[++i];
        } while (ch === " " || allowTabs && ch === "	");
        const n = i - this.pos;
        if (n > 0) {
          yield this.buffer.substr(this.pos, n);
          this.pos = i;
        }
        return n;
      }
      *pushUntil(test) {
        let i = this.pos;
        let ch = this.buffer[i];
        while (!test(ch))
          ch = this.buffer[++i];
        return yield* this.pushToIndex(i, false);
      }
    };
    exports.Lexer = Lexer;
  }
});

// ../node_modules/yaml/dist/parse/line-counter.js
var require_line_counter = __commonJS({
  "../node_modules/yaml/dist/parse/line-counter.js"(exports) {
    "use strict";
    var LineCounter = class {
      constructor() {
        this.lineStarts = [];
        this.addNewLine = (offset) => this.lineStarts.push(offset);
        this.linePos = (offset) => {
          let low = 0;
          let high = this.lineStarts.length;
          while (low < high) {
            const mid = low + high >> 1;
            if (this.lineStarts[mid] < offset)
              low = mid + 1;
            else
              high = mid;
          }
          if (this.lineStarts[low] === offset)
            return { line: low + 1, col: 1 };
          if (low === 0)
            return { line: 0, col: offset };
          const start = this.lineStarts[low - 1];
          return { line: low, col: offset - start + 1 };
        };
      }
    };
    exports.LineCounter = LineCounter;
  }
});

// ../node_modules/yaml/dist/parse/parser.js
var require_parser = __commonJS({
  "../node_modules/yaml/dist/parse/parser.js"(exports) {
    "use strict";
    var node_process = __require("process");
    var cst = require_cst();
    var lexer = require_lexer();
    function includesToken(list, type) {
      for (let i = 0; i < list.length; ++i)
        if (list[i].type === type)
          return true;
      return false;
    }
    function findNonEmptyIndex(list) {
      for (let i = 0; i < list.length; ++i) {
        switch (list[i].type) {
          case "space":
          case "comment":
          case "newline":
            break;
          default:
            return i;
        }
      }
      return -1;
    }
    function isFlowToken(token) {
      switch (token?.type) {
        case "alias":
        case "scalar":
        case "single-quoted-scalar":
        case "double-quoted-scalar":
        case "flow-collection":
          return true;
        default:
          return false;
      }
    }
    function getPrevProps(parent) {
      switch (parent.type) {
        case "document":
          return parent.start;
        case "block-map": {
          const it = parent.items[parent.items.length - 1];
          return it.sep ?? it.start;
        }
        case "block-seq":
          return parent.items[parent.items.length - 1].start;
        /* istanbul ignore next should not happen */
        default:
          return [];
      }
    }
    function getFirstKeyStartProps(prev) {
      if (prev.length === 0)
        return [];
      let i = prev.length;
      loop: while (--i >= 0) {
        switch (prev[i].type) {
          case "doc-start":
          case "explicit-key-ind":
          case "map-value-ind":
          case "seq-item-ind":
          case "newline":
            break loop;
        }
      }
      while (prev[++i]?.type === "space") {
      }
      return prev.splice(i, prev.length);
    }
    function arrayPushArray(target, source) {
      if (source.length < 1e5)
        Array.prototype.push.apply(target, source);
      else
        for (let i = 0; i < source.length; ++i)
          target.push(source[i]);
    }
    function fixFlowSeqItems(fc) {
      if (fc.start.type === "flow-seq-start") {
        for (const it of fc.items) {
          if (it.sep && !it.value && !includesToken(it.start, "explicit-key-ind") && !includesToken(it.sep, "map-value-ind")) {
            if (it.key)
              it.value = it.key;
            delete it.key;
            if (isFlowToken(it.value)) {
              if (it.value.end)
                arrayPushArray(it.value.end, it.sep);
              else
                it.value.end = it.sep;
            } else
              arrayPushArray(it.start, it.sep);
            delete it.sep;
          }
        }
      }
    }
    var Parser = class {
      /**
       * @param onNewLine - If defined, called separately with the start position of
       *   each new line (in `parse()`, including the start of input).
       */
      constructor(onNewLine) {
        this.atNewLine = true;
        this.atScalar = false;
        this.indent = 0;
        this.offset = 0;
        this.onKeyLine = false;
        this.stack = [];
        this.source = "";
        this.type = "";
        this.lexer = new lexer.Lexer();
        this.onNewLine = onNewLine;
      }
      /**
       * Parse `source` as a YAML stream.
       * If `incomplete`, a part of the last line may be left as a buffer for the next call.
       *
       * Errors are not thrown, but yielded as `{ type: 'error', message }` tokens.
       *
       * @returns A generator of tokens representing each directive, document, and other structure.
       */
      *parse(source, incomplete = false) {
        if (this.onNewLine && this.offset === 0)
          this.onNewLine(0);
        for (const lexeme of this.lexer.lex(source, incomplete))
          yield* this.next(lexeme);
        if (!incomplete)
          yield* this.end();
      }
      /**
       * Advance the parser by the `source` of one lexical token.
       */
      *next(source) {
        this.source = source;
        if (node_process.env.LOG_TOKENS)
          console.log("|", cst.prettyToken(source));
        if (this.atScalar) {
          this.atScalar = false;
          yield* this.step();
          this.offset += source.length;
          return;
        }
        const type = cst.tokenType(source);
        if (!type) {
          const message = `Not a YAML token: ${source}`;
          yield* this.pop({ type: "error", offset: this.offset, message, source });
          this.offset += source.length;
        } else if (type === "scalar") {
          this.atNewLine = false;
          this.atScalar = true;
          this.type = "scalar";
        } else {
          this.type = type;
          yield* this.step();
          switch (type) {
            case "newline":
              this.atNewLine = true;
              this.indent = 0;
              if (this.onNewLine)
                this.onNewLine(this.offset + source.length);
              break;
            case "space":
              if (this.atNewLine && source[0] === " ")
                this.indent += source.length;
              break;
            case "explicit-key-ind":
            case "map-value-ind":
            case "seq-item-ind":
              if (this.atNewLine)
                this.indent += source.length;
              break;
            case "doc-mode":
            case "flow-error-end":
              return;
            default:
              this.atNewLine = false;
          }
          this.offset += source.length;
        }
      }
      /** Call at end of input to push out any remaining constructions */
      *end() {
        while (this.stack.length > 0)
          yield* this.pop();
      }
      get sourceToken() {
        const st = {
          type: this.type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
        return st;
      }
      *step() {
        const top = this.peek(1);
        if (this.type === "doc-end" && top?.type !== "doc-end") {
          while (this.stack.length > 0)
            yield* this.pop();
          this.stack.push({
            type: "doc-end",
            offset: this.offset,
            source: this.source
          });
          return;
        }
        if (!top)
          return yield* this.stream();
        switch (top.type) {
          case "document":
            return yield* this.document(top);
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return yield* this.scalar(top);
          case "block-scalar":
            return yield* this.blockScalar(top);
          case "block-map":
            return yield* this.blockMap(top);
          case "block-seq":
            return yield* this.blockSequence(top);
          case "flow-collection":
            return yield* this.flowCollection(top);
          case "doc-end":
            return yield* this.documentEnd(top);
        }
        yield* this.pop();
      }
      peek(n) {
        return this.stack[this.stack.length - n];
      }
      *pop(error) {
        const token = error ?? this.stack.pop();
        if (!token) {
          const message = "Tried to pop an empty stack";
          yield { type: "error", offset: this.offset, source: "", message };
        } else if (this.stack.length === 0) {
          yield token;
        } else {
          const top = this.peek(1);
          if (token.type === "block-scalar") {
            token.indent = "indent" in top ? top.indent : 0;
          } else if (token.type === "flow-collection" && top.type === "document") {
            token.indent = 0;
          }
          if (token.type === "flow-collection")
            fixFlowSeqItems(token);
          switch (top.type) {
            case "document":
              top.value = token;
              break;
            case "block-scalar":
              top.props.push(token);
              break;
            case "block-map": {
              const it = top.items[top.items.length - 1];
              if (it.value) {
                top.items.push({ start: [], key: token, sep: [] });
                this.onKeyLine = true;
                return;
              } else if (it.sep) {
                it.value = token;
              } else {
                Object.assign(it, { key: token, sep: [] });
                this.onKeyLine = !it.explicitKey;
                return;
              }
              break;
            }
            case "block-seq": {
              const it = top.items[top.items.length - 1];
              if (it.value)
                top.items.push({ start: [], value: token });
              else
                it.value = token;
              break;
            }
            case "flow-collection": {
              const it = top.items[top.items.length - 1];
              if (!it || it.value)
                top.items.push({ start: [], key: token, sep: [] });
              else if (it.sep)
                it.value = token;
              else
                Object.assign(it, { key: token, sep: [] });
              return;
            }
            /* istanbul ignore next should not happen */
            default:
              yield* this.pop();
              yield* this.pop(token);
          }
          if ((top.type === "document" || top.type === "block-map" || top.type === "block-seq") && (token.type === "block-map" || token.type === "block-seq")) {
            const last = token.items[token.items.length - 1];
            if (last && !last.sep && !last.value && last.start.length > 0 && findNonEmptyIndex(last.start) === -1 && (token.indent === 0 || last.start.every((st) => st.type !== "comment" || st.indent < token.indent))) {
              if (top.type === "document")
                top.end = last.start;
              else
                top.items.push({ start: last.start });
              token.items.splice(-1, 1);
            }
          }
        }
      }
      *stream() {
        switch (this.type) {
          case "directive-line":
            yield { type: "directive", offset: this.offset, source: this.source };
            return;
          case "byte-order-mark":
          case "space":
          case "comment":
          case "newline":
            yield this.sourceToken;
            return;
          case "doc-mode":
          case "doc-start": {
            const doc = {
              type: "document",
              offset: this.offset,
              start: []
            };
            if (this.type === "doc-start")
              doc.start.push(this.sourceToken);
            this.stack.push(doc);
            return;
          }
        }
        yield {
          type: "error",
          offset: this.offset,
          message: `Unexpected ${this.type} token in YAML stream`,
          source: this.source
        };
      }
      *document(doc) {
        if (doc.value)
          return yield* this.lineEnd(doc);
        switch (this.type) {
          case "doc-start": {
            if (findNonEmptyIndex(doc.start) !== -1) {
              yield* this.pop();
              yield* this.step();
            } else
              doc.start.push(this.sourceToken);
            return;
          }
          case "anchor":
          case "tag":
          case "space":
          case "comment":
          case "newline":
            doc.start.push(this.sourceToken);
            return;
        }
        const bv = this.startBlockValue(doc);
        if (bv)
          this.stack.push(bv);
        else {
          yield {
            type: "error",
            offset: this.offset,
            message: `Unexpected ${this.type} token in YAML document`,
            source: this.source
          };
        }
      }
      *scalar(scalar) {
        if (this.type === "map-value-ind") {
          const prev = getPrevProps(this.peek(2));
          const start = getFirstKeyStartProps(prev);
          let sep3;
          if (scalar.end) {
            sep3 = scalar.end;
            sep3.push(this.sourceToken);
            delete scalar.end;
          } else
            sep3 = [this.sourceToken];
          const map = {
            type: "block-map",
            offset: scalar.offset,
            indent: scalar.indent,
            items: [{ start, key: scalar, sep: sep3 }]
          };
          this.onKeyLine = true;
          this.stack[this.stack.length - 1] = map;
        } else
          yield* this.lineEnd(scalar);
      }
      *blockScalar(scalar) {
        switch (this.type) {
          case "space":
          case "comment":
          case "newline":
            scalar.props.push(this.sourceToken);
            return;
          case "scalar":
            scalar.source = this.source;
            this.atNewLine = true;
            this.indent = 0;
            if (this.onNewLine) {
              let nl = this.source.indexOf("\n") + 1;
              while (nl !== 0) {
                this.onNewLine(this.offset + nl);
                nl = this.source.indexOf("\n", nl) + 1;
              }
            }
            yield* this.pop();
            break;
          /* istanbul ignore next should not happen */
          default:
            yield* this.pop();
            yield* this.step();
        }
      }
      *blockMap(map) {
        const it = map.items[map.items.length - 1];
        switch (this.type) {
          case "newline":
            this.onKeyLine = false;
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              it.start.push(this.sourceToken);
            }
            return;
          case "space":
          case "comment":
            if (it.value) {
              map.items.push({ start: [this.sourceToken] });
            } else if (it.sep) {
              it.sep.push(this.sourceToken);
            } else {
              if (this.atIndentedComment(it.start, map.indent)) {
                const prev = map.items[map.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  map.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
        }
        if (this.indent >= map.indent) {
          const atMapIndent = !this.onKeyLine && this.indent === map.indent;
          const atNextItem = atMapIndent && (it.sep || it.explicitKey) && this.type !== "seq-item-ind";
          let start = [];
          if (atNextItem && it.sep && !it.value) {
            const nl = [];
            for (let i = 0; i < it.sep.length; ++i) {
              const st = it.sep[i];
              switch (st.type) {
                case "newline":
                  nl.push(i);
                  break;
                case "space":
                  break;
                case "comment":
                  if (st.indent > map.indent)
                    nl.length = 0;
                  break;
                default:
                  nl.length = 0;
              }
            }
            if (nl.length >= 2)
              start = it.sep.splice(nl[1]);
          }
          switch (this.type) {
            case "anchor":
            case "tag":
              if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start });
                this.onKeyLine = true;
              } else if (it.sep) {
                it.sep.push(this.sourceToken);
              } else {
                it.start.push(this.sourceToken);
              }
              return;
            case "explicit-key-ind":
              if (!it.sep && !it.explicitKey) {
                it.start.push(this.sourceToken);
                it.explicitKey = true;
              } else if (atNextItem || it.value) {
                start.push(this.sourceToken);
                map.items.push({ start, explicitKey: true });
              } else {
                this.stack.push({
                  type: "block-map",
                  offset: this.offset,
                  indent: this.indent,
                  items: [{ start: [this.sourceToken], explicitKey: true }]
                });
              }
              this.onKeyLine = true;
              return;
            case "map-value-ind":
              if (it.explicitKey) {
                if (!it.sep) {
                  if (includesToken(it.start, "newline")) {
                    Object.assign(it, { key: null, sep: [this.sourceToken] });
                  } else {
                    const start2 = getFirstKeyStartProps(it.start);
                    this.stack.push({
                      type: "block-map",
                      offset: this.offset,
                      indent: this.indent,
                      items: [{ start: start2, key: null, sep: [this.sourceToken] }]
                    });
                  }
                } else if (it.value) {
                  map.items.push({ start: [], key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start, key: null, sep: [this.sourceToken] }]
                  });
                } else if (isFlowToken(it.key) && !includesToken(it.sep, "newline")) {
                  const start2 = getFirstKeyStartProps(it.start);
                  const key = it.key;
                  const sep3 = it.sep;
                  sep3.push(this.sourceToken);
                  delete it.key;
                  delete it.sep;
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: start2, key, sep: sep3 }]
                  });
                } else if (start.length > 0) {
                  it.sep = it.sep.concat(start, this.sourceToken);
                } else {
                  it.sep.push(this.sourceToken);
                }
              } else {
                if (!it.sep) {
                  Object.assign(it, { key: null, sep: [this.sourceToken] });
                } else if (it.value || atNextItem) {
                  map.items.push({ start, key: null, sep: [this.sourceToken] });
                } else if (includesToken(it.sep, "map-value-ind")) {
                  this.stack.push({
                    type: "block-map",
                    offset: this.offset,
                    indent: this.indent,
                    items: [{ start: [], key: null, sep: [this.sourceToken] }]
                  });
                } else {
                  it.sep.push(this.sourceToken);
                }
              }
              this.onKeyLine = true;
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (atNextItem || it.value) {
                map.items.push({ start, key: fs, sep: [] });
                this.onKeyLine = true;
              } else if (it.sep) {
                this.stack.push(fs);
              } else {
                Object.assign(it, { key: fs, sep: [] });
                this.onKeyLine = true;
              }
              return;
            }
            default: {
              const bv = this.startBlockValue(map);
              if (bv) {
                if (bv.type === "block-seq") {
                  if (!it.explicitKey && it.sep && !includesToken(it.sep, "newline")) {
                    yield* this.pop({
                      type: "error",
                      offset: this.offset,
                      message: "Unexpected block-seq-ind on same line with key",
                      source: this.source
                    });
                    return;
                  }
                } else if (atMapIndent) {
                  map.items.push({ start });
                }
                this.stack.push(bv);
                return;
              }
            }
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *blockSequence(seq) {
        const it = seq.items[seq.items.length - 1];
        switch (this.type) {
          case "newline":
            if (it.value) {
              const end = "end" in it.value ? it.value.end : void 0;
              const last = Array.isArray(end) ? end[end.length - 1] : void 0;
              if (last?.type === "comment")
                end?.push(this.sourceToken);
              else
                seq.items.push({ start: [this.sourceToken] });
            } else
              it.start.push(this.sourceToken);
            return;
          case "space":
          case "comment":
            if (it.value)
              seq.items.push({ start: [this.sourceToken] });
            else {
              if (this.atIndentedComment(it.start, seq.indent)) {
                const prev = seq.items[seq.items.length - 2];
                const end = prev?.value?.end;
                if (Array.isArray(end)) {
                  arrayPushArray(end, it.start);
                  end.push(this.sourceToken);
                  seq.items.pop();
                  return;
                }
              }
              it.start.push(this.sourceToken);
            }
            return;
          case "anchor":
          case "tag":
            if (it.value || this.indent <= seq.indent)
              break;
            it.start.push(this.sourceToken);
            return;
          case "seq-item-ind":
            if (this.indent !== seq.indent)
              break;
            if (it.value || includesToken(it.start, "seq-item-ind"))
              seq.items.push({ start: [this.sourceToken] });
            else
              it.start.push(this.sourceToken);
            return;
        }
        if (this.indent > seq.indent) {
          const bv = this.startBlockValue(seq);
          if (bv) {
            this.stack.push(bv);
            return;
          }
        }
        yield* this.pop();
        yield* this.step();
      }
      *flowCollection(fc) {
        const it = fc.items[fc.items.length - 1];
        if (this.type === "flow-error-end") {
          let top;
          do {
            yield* this.pop();
            top = this.peek(1);
          } while (top?.type === "flow-collection");
        } else if (fc.end.length === 0) {
          switch (this.type) {
            case "comma":
            case "explicit-key-ind":
              if (!it || it.sep)
                fc.items.push({ start: [this.sourceToken] });
              else
                it.start.push(this.sourceToken);
              return;
            case "map-value-ind":
              if (!it || it.value)
                fc.items.push({ start: [], key: null, sep: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                Object.assign(it, { key: null, sep: [this.sourceToken] });
              return;
            case "space":
            case "comment":
            case "newline":
            case "anchor":
            case "tag":
              if (!it || it.value)
                fc.items.push({ start: [this.sourceToken] });
              else if (it.sep)
                it.sep.push(this.sourceToken);
              else
                it.start.push(this.sourceToken);
              return;
            case "alias":
            case "scalar":
            case "single-quoted-scalar":
            case "double-quoted-scalar": {
              const fs = this.flowScalar(this.type);
              if (!it || it.value)
                fc.items.push({ start: [], key: fs, sep: [] });
              else if (it.sep)
                this.stack.push(fs);
              else
                Object.assign(it, { key: fs, sep: [] });
              return;
            }
            case "flow-map-end":
            case "flow-seq-end":
              fc.end.push(this.sourceToken);
              return;
          }
          const bv = this.startBlockValue(fc);
          if (bv)
            this.stack.push(bv);
          else {
            yield* this.pop();
            yield* this.step();
          }
        } else {
          const parent = this.peek(2);
          if (parent.type === "block-map" && (this.type === "map-value-ind" && parent.indent === fc.indent || this.type === "newline" && !parent.items[parent.items.length - 1].sep)) {
            yield* this.pop();
            yield* this.step();
          } else if (this.type === "map-value-ind" && parent.type !== "flow-collection") {
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            fixFlowSeqItems(fc);
            const sep3 = fc.end.splice(1, fc.end.length);
            sep3.push(this.sourceToken);
            const map = {
              type: "block-map",
              offset: fc.offset,
              indent: fc.indent,
              items: [{ start, key: fc, sep: sep3 }]
            };
            this.onKeyLine = true;
            this.stack[this.stack.length - 1] = map;
          } else {
            yield* this.lineEnd(fc);
          }
        }
      }
      flowScalar(type) {
        if (this.onNewLine) {
          let nl = this.source.indexOf("\n") + 1;
          while (nl !== 0) {
            this.onNewLine(this.offset + nl);
            nl = this.source.indexOf("\n", nl) + 1;
          }
        }
        return {
          type,
          offset: this.offset,
          indent: this.indent,
          source: this.source
        };
      }
      startBlockValue(parent) {
        switch (this.type) {
          case "alias":
          case "scalar":
          case "single-quoted-scalar":
          case "double-quoted-scalar":
            return this.flowScalar(this.type);
          case "block-scalar-header":
            return {
              type: "block-scalar",
              offset: this.offset,
              indent: this.indent,
              props: [this.sourceToken],
              source: ""
            };
          case "flow-map-start":
          case "flow-seq-start":
            return {
              type: "flow-collection",
              offset: this.offset,
              indent: this.indent,
              start: this.sourceToken,
              items: [],
              end: []
            };
          case "seq-item-ind":
            return {
              type: "block-seq",
              offset: this.offset,
              indent: this.indent,
              items: [{ start: [this.sourceToken] }]
            };
          case "explicit-key-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            start.push(this.sourceToken);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, explicitKey: true }]
            };
          }
          case "map-value-ind": {
            this.onKeyLine = true;
            const prev = getPrevProps(parent);
            const start = getFirstKeyStartProps(prev);
            return {
              type: "block-map",
              offset: this.offset,
              indent: this.indent,
              items: [{ start, key: null, sep: [this.sourceToken] }]
            };
          }
        }
        return null;
      }
      atIndentedComment(start, indent) {
        if (this.type !== "comment")
          return false;
        if (this.indent <= indent)
          return false;
        return start.every((st) => st.type === "newline" || st.type === "space");
      }
      *documentEnd(docEnd) {
        if (this.type !== "doc-mode") {
          if (docEnd.end)
            docEnd.end.push(this.sourceToken);
          else
            docEnd.end = [this.sourceToken];
          if (this.type === "newline")
            yield* this.pop();
        }
      }
      *lineEnd(token) {
        switch (this.type) {
          case "comma":
          case "doc-start":
          case "doc-end":
          case "flow-seq-end":
          case "flow-map-end":
          case "map-value-ind":
            yield* this.pop();
            yield* this.step();
            break;
          case "newline":
            this.onKeyLine = false;
          // fallthrough
          case "space":
          case "comment":
          default:
            if (token.end)
              token.end.push(this.sourceToken);
            else
              token.end = [this.sourceToken];
            if (this.type === "newline")
              yield* this.pop();
        }
      }
    };
    exports.Parser = Parser;
  }
});

// ../node_modules/yaml/dist/public-api.js
var require_public_api = __commonJS({
  "../node_modules/yaml/dist/public-api.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var errors = require_errors();
    var log = require_log();
    var identity = require_identity();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    function parseOptions(options) {
      const prettyErrors = options.prettyErrors !== false;
      const lineCounter$1 = options.lineCounter || prettyErrors && new lineCounter.LineCounter() || null;
      return { lineCounter: lineCounter$1, prettyErrors };
    }
    function parseAllDocuments(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      const docs = Array.from(composer$1.compose(parser$1.parse(source)));
      if (prettyErrors && lineCounter2)
        for (const doc of docs) {
          doc.errors.forEach(errors.prettifyError(source, lineCounter2));
          doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
        }
      if (docs.length > 0)
        return docs;
      return Object.assign([], { empty: true }, composer$1.streamInfo());
    }
    function parseDocument(source, options = {}) {
      const { lineCounter: lineCounter2, prettyErrors } = parseOptions(options);
      const parser$1 = new parser.Parser(lineCounter2?.addNewLine);
      const composer$1 = new composer.Composer(options);
      let doc = null;
      for (const _doc of composer$1.compose(parser$1.parse(source), true, source.length)) {
        if (!doc)
          doc = _doc;
        else if (doc.options.logLevel !== "silent") {
          doc.errors.push(new errors.YAMLParseError(_doc.range.slice(0, 2), "MULTIPLE_DOCS", "Source contains multiple documents; please use YAML.parseAllDocuments()"));
          break;
        }
      }
      if (prettyErrors && lineCounter2) {
        doc.errors.forEach(errors.prettifyError(source, lineCounter2));
        doc.warnings.forEach(errors.prettifyError(source, lineCounter2));
      }
      return doc;
    }
    function parse3(src, reviver, options) {
      let _reviver = void 0;
      if (typeof reviver === "function") {
        _reviver = reviver;
      } else if (options === void 0 && reviver && typeof reviver === "object") {
        options = reviver;
      }
      const doc = parseDocument(src, options);
      if (!doc)
        return null;
      doc.warnings.forEach((warning) => log.warn(doc.options.logLevel, warning));
      if (doc.errors.length > 0) {
        if (doc.options.logLevel !== "silent")
          throw doc.errors[0];
        else
          doc.errors = [];
      }
      return doc.toJS(Object.assign({ reviver: _reviver }, options));
    }
    function stringify(value, replacer, options) {
      let _replacer = null;
      if (typeof replacer === "function" || Array.isArray(replacer)) {
        _replacer = replacer;
      } else if (options === void 0 && replacer) {
        options = replacer;
      }
      if (typeof options === "string")
        options = options.length;
      if (typeof options === "number") {
        const indent = Math.round(options);
        options = indent < 1 ? void 0 : indent > 8 ? { indent: 8 } : { indent };
      }
      if (value === void 0) {
        const { keepUndefined } = options ?? replacer ?? {};
        if (!keepUndefined)
          return void 0;
      }
      if (identity.isDocument(value) && !_replacer)
        return value.toString(options);
      return new Document.Document(value, _replacer, options).toString(options);
    }
    exports.parse = parse3;
    exports.parseAllDocuments = parseAllDocuments;
    exports.parseDocument = parseDocument;
    exports.stringify = stringify;
  }
});

// ../node_modules/yaml/dist/index.js
var require_dist = __commonJS({
  "../node_modules/yaml/dist/index.js"(exports) {
    "use strict";
    var composer = require_composer();
    var Document = require_Document();
    var Schema = require_Schema();
    var errors = require_errors();
    var Alias = require_Alias();
    var identity = require_identity();
    var Pair = require_Pair();
    var Scalar = require_Scalar();
    var YAMLMap = require_YAMLMap();
    var YAMLSeq = require_YAMLSeq();
    var cst = require_cst();
    var lexer = require_lexer();
    var lineCounter = require_line_counter();
    var parser = require_parser();
    var publicApi = require_public_api();
    var visit = require_visit();
    exports.Composer = composer.Composer;
    exports.Document = Document.Document;
    exports.Schema = Schema.Schema;
    exports.YAMLError = errors.YAMLError;
    exports.YAMLParseError = errors.YAMLParseError;
    exports.YAMLWarning = errors.YAMLWarning;
    exports.Alias = Alias.Alias;
    exports.isAlias = identity.isAlias;
    exports.isCollection = identity.isCollection;
    exports.isDocument = identity.isDocument;
    exports.isMap = identity.isMap;
    exports.isNode = identity.isNode;
    exports.isPair = identity.isPair;
    exports.isScalar = identity.isScalar;
    exports.isSeq = identity.isSeq;
    exports.Pair = Pair.Pair;
    exports.Scalar = Scalar.Scalar;
    exports.YAMLMap = YAMLMap.YAMLMap;
    exports.YAMLSeq = YAMLSeq.YAMLSeq;
    exports.CST = cst;
    exports.Lexer = lexer.Lexer;
    exports.LineCounter = lineCounter.LineCounter;
    exports.Parser = parser.Parser;
    exports.parse = publicApi.parse;
    exports.parseAllDocuments = publicApi.parseAllDocuments;
    exports.parseDocument = publicApi.parseDocument;
    exports.stringify = publicApi.stringify;
    exports.visit = visit.visit;
    exports.visitAsync = visit.visitAsync;
  }
});

// ../node_modules/ajv/dist/compile/codegen/code.js
var require_code = __commonJS({
  "../node_modules/ajv/dist/compile/codegen/code.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
    var _CodeOrName = class {
    };
    exports._CodeOrName = _CodeOrName;
    exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    var Name = class extends _CodeOrName {
      constructor(s) {
        super();
        if (!exports.IDENTIFIER.test(s))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = s;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return false;
      }
      get names() {
        return { [this.str]: 1 };
      }
    };
    exports.Name = Name;
    var _Code = class extends _CodeOrName {
      constructor(code) {
        super();
        this._items = typeof code === "string" ? [code] : code;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return false;
        const item = this._items[0];
        return item === "" || item === '""';
      }
      get str() {
        var _a;
        return (_a = this._str) !== null && _a !== void 0 ? _a : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
      }
      get names() {
        var _a;
        return (_a = this._names) !== null && _a !== void 0 ? _a : this._names = this._items.reduce((names2, c) => {
          if (c instanceof Name)
            names2[c.str] = (names2[c.str] || 0) + 1;
          return names2;
        }, {});
      }
    };
    exports._Code = _Code;
    exports.nil = new _Code("");
    function _(strs, ...args) {
      const code = [strs[0]];
      let i = 0;
      while (i < args.length) {
        addCodeArg(code, args[i]);
        code.push(strs[++i]);
      }
      return new _Code(code);
    }
    exports._ = _;
    var plus = new _Code("+");
    function str(strs, ...args) {
      const expr = [safeStringify(strs[0])];
      let i = 0;
      while (i < args.length) {
        expr.push(plus);
        addCodeArg(expr, args[i]);
        expr.push(plus, safeStringify(strs[++i]));
      }
      optimize(expr);
      return new _Code(expr);
    }
    exports.str = str;
    function addCodeArg(code, arg) {
      if (arg instanceof _Code)
        code.push(...arg._items);
      else if (arg instanceof Name)
        code.push(arg);
      else
        code.push(interpolate(arg));
    }
    exports.addCodeArg = addCodeArg;
    function optimize(expr) {
      let i = 1;
      while (i < expr.length - 1) {
        if (expr[i] === plus) {
          const res = mergeExprItems(expr[i - 1], expr[i + 1]);
          if (res !== void 0) {
            expr.splice(i - 1, 3, res);
            continue;
          }
          expr[i++] = "+";
        }
        i++;
      }
    }
    function mergeExprItems(a, b) {
      if (b === '""')
        return a;
      if (a === '""')
        return b;
      if (typeof a == "string") {
        if (b instanceof Name || a[a.length - 1] !== '"')
          return;
        if (typeof b != "string")
          return `${a.slice(0, -1)}${b}"`;
        if (b[0] === '"')
          return a.slice(0, -1) + b.slice(1);
        return;
      }
      if (typeof b == "string" && b[0] === '"' && !(a instanceof Name))
        return `"${a}${b.slice(1)}`;
      return;
    }
    function strConcat(c1, c2) {
      return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
    }
    exports.strConcat = strConcat;
    function interpolate(x) {
      return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
    }
    function stringify(x) {
      return new _Code(safeStringify(x));
    }
    exports.stringify = stringify;
    function safeStringify(x) {
      return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    exports.safeStringify = safeStringify;
    function getProperty(key) {
      return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
    }
    exports.getProperty = getProperty;
    function getEsmExportName(key) {
      if (typeof key == "string" && exports.IDENTIFIER.test(key)) {
        return new _Code(`${key}`);
      }
      throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
    }
    exports.getEsmExportName = getEsmExportName;
    function regexpCode(rx) {
      return new _Code(rx.toString());
    }
    exports.regexpCode = regexpCode;
  }
});

// ../node_modules/ajv/dist/compile/codegen/scope.js
var require_scope = __commonJS({
  "../node_modules/ajv/dist/compile/codegen/scope.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
    var code_1 = require_code();
    var ValueError = class extends Error {
      constructor(name) {
        super(`CodeGen: "code" for ${name} not defined`);
        this.value = name.value;
      }
    };
    var UsedValueState;
    (function(UsedValueState2) {
      UsedValueState2[UsedValueState2["Started"] = 0] = "Started";
      UsedValueState2[UsedValueState2["Completed"] = 1] = "Completed";
    })(UsedValueState || (exports.UsedValueState = UsedValueState = {}));
    exports.varKinds = {
      const: new code_1.Name("const"),
      let: new code_1.Name("let"),
      var: new code_1.Name("var")
    };
    var Scope = class {
      constructor({ prefixes, parent } = {}) {
        this._names = {};
        this._prefixes = prefixes;
        this._parent = parent;
      }
      toName(nameOrPrefix) {
        return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
      }
      name(prefix2) {
        return new code_1.Name(this._newName(prefix2));
      }
      _newName(prefix2) {
        const ng = this._names[prefix2] || this._nameGroup(prefix2);
        return `${prefix2}${ng.index++}`;
      }
      _nameGroup(prefix2) {
        var _a, _b;
        if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix2)) || this._prefixes && !this._prefixes.has(prefix2)) {
          throw new Error(`CodeGen: prefix "${prefix2}" is not allowed in this scope`);
        }
        return this._names[prefix2] = { prefix: prefix2, index: 0 };
      }
    };
    exports.Scope = Scope;
    var ValueScopeName = class extends code_1.Name {
      constructor(prefix2, nameStr) {
        super(nameStr);
        this.prefix = prefix2;
      }
      setValue(value, { property, itemIndex }) {
        this.value = value;
        this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
      }
    };
    exports.ValueScopeName = ValueScopeName;
    var line = (0, code_1._)`\n`;
    var ValueScope = class extends Scope {
      constructor(opts) {
        super(opts);
        this._values = {};
        this._scope = opts.scope;
        this.opts = { ...opts, _n: opts.lines ? line : code_1.nil };
      }
      get() {
        return this._scope;
      }
      name(prefix2) {
        return new ValueScopeName(prefix2, this._newName(prefix2));
      }
      value(nameOrPrefix, value) {
        var _a;
        if (value.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const name = this.toName(nameOrPrefix);
        const { prefix: prefix2 } = name;
        const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
        let vs = this._values[prefix2];
        if (vs) {
          const _name = vs.get(valueKey);
          if (_name)
            return _name;
        } else {
          vs = this._values[prefix2] = /* @__PURE__ */ new Map();
        }
        vs.set(valueKey, name);
        const s = this._scope[prefix2] || (this._scope[prefix2] = []);
        const itemIndex = s.length;
        s[itemIndex] = value.ref;
        name.setValue(value, { property: prefix2, itemIndex });
        return name;
      }
      getValue(prefix2, keyOrRef) {
        const vs = this._values[prefix2];
        if (!vs)
          return;
        return vs.get(keyOrRef);
      }
      scopeRefs(scopeName, values = this._values) {
        return this._reduceValues(values, (name) => {
          if (name.scopePath === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return (0, code_1._)`${scopeName}${name.scopePath}`;
        });
      }
      scopeCode(values = this._values, usedValues, getCode) {
        return this._reduceValues(values, (name) => {
          if (name.value === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return name.value.code;
        }, usedValues, getCode);
      }
      _reduceValues(values, valueCode, usedValues = {}, getCode) {
        let code = code_1.nil;
        for (const prefix2 in values) {
          const vs = values[prefix2];
          if (!vs)
            continue;
          const nameSet = usedValues[prefix2] = usedValues[prefix2] || /* @__PURE__ */ new Map();
          vs.forEach((name) => {
            if (nameSet.has(name))
              return;
            nameSet.set(name, UsedValueState.Started);
            let c = valueCode(name);
            if (c) {
              const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
              code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
            } else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name)) {
              code = (0, code_1._)`${code}${c}${this.opts._n}`;
            } else {
              throw new ValueError(name);
            }
            nameSet.set(name, UsedValueState.Completed);
          });
        }
        return code;
      }
    };
    exports.ValueScope = ValueScope;
  }
});

// ../node_modules/ajv/dist/compile/codegen/index.js
var require_codegen = __commonJS({
  "../node_modules/ajv/dist/compile/codegen/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
    var code_1 = require_code();
    var scope_1 = require_scope();
    var code_2 = require_code();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return code_2._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return code_2.str;
    } });
    Object.defineProperty(exports, "strConcat", { enumerable: true, get: function() {
      return code_2.strConcat;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return code_2.nil;
    } });
    Object.defineProperty(exports, "getProperty", { enumerable: true, get: function() {
      return code_2.getProperty;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return code_2.stringify;
    } });
    Object.defineProperty(exports, "regexpCode", { enumerable: true, get: function() {
      return code_2.regexpCode;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return code_2.Name;
    } });
    var scope_2 = require_scope();
    Object.defineProperty(exports, "Scope", { enumerable: true, get: function() {
      return scope_2.Scope;
    } });
    Object.defineProperty(exports, "ValueScope", { enumerable: true, get: function() {
      return scope_2.ValueScope;
    } });
    Object.defineProperty(exports, "ValueScopeName", { enumerable: true, get: function() {
      return scope_2.ValueScopeName;
    } });
    Object.defineProperty(exports, "varKinds", { enumerable: true, get: function() {
      return scope_2.varKinds;
    } });
    exports.operators = {
      GT: new code_1._Code(">"),
      GTE: new code_1._Code(">="),
      LT: new code_1._Code("<"),
      LTE: new code_1._Code("<="),
      EQ: new code_1._Code("==="),
      NEQ: new code_1._Code("!=="),
      NOT: new code_1._Code("!"),
      OR: new code_1._Code("||"),
      AND: new code_1._Code("&&"),
      ADD: new code_1._Code("+")
    };
    var Node = class {
      optimizeNodes() {
        return this;
      }
      optimizeNames(_names, _constants) {
        return this;
      }
    };
    var Def = class extends Node {
      constructor(varKind, name, rhs) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.rhs = rhs;
      }
      render({ es5, _n }) {
        const varKind = es5 ? scope_1.varKinds.var : this.varKind;
        const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${varKind} ${this.name}${rhs};` + _n;
      }
      optimizeNames(names2, constants) {
        if (!names2[this.name.str])
          return;
        if (this.rhs)
          this.rhs = optimizeExpr(this.rhs, names2, constants);
        return this;
      }
      get names() {
        return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
      }
    };
    var Assign = class extends Node {
      constructor(lhs, rhs, sideEffects) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
        this.sideEffects = sideEffects;
      }
      render({ _n }) {
        return `${this.lhs} = ${this.rhs};` + _n;
      }
      optimizeNames(names2, constants) {
        if (this.lhs instanceof code_1.Name && !names2[this.lhs.str] && !this.sideEffects)
          return;
        this.rhs = optimizeExpr(this.rhs, names2, constants);
        return this;
      }
      get names() {
        const names2 = this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names };
        return addExprNames(names2, this.rhs);
      }
    };
    var AssignOp = class extends Assign {
      constructor(lhs, op, rhs, sideEffects) {
        super(lhs, rhs, sideEffects);
        this.op = op;
      }
      render({ _n }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
      }
    };
    var Label = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        return `${this.label}:` + _n;
      }
    };
    var Break = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        const label = this.label ? ` ${this.label}` : "";
        return `break${label};` + _n;
      }
    };
    var Throw = class extends Node {
      constructor(error) {
        super();
        this.error = error;
      }
      render({ _n }) {
        return `throw ${this.error};` + _n;
      }
      get names() {
        return this.error.names;
      }
    };
    var AnyCode = class extends Node {
      constructor(code) {
        super();
        this.code = code;
      }
      render({ _n }) {
        return `${this.code};` + _n;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(names2, constants) {
        this.code = optimizeExpr(this.code, names2, constants);
        return this;
      }
      get names() {
        return this.code instanceof code_1._CodeOrName ? this.code.names : {};
      }
    };
    var ParentNode = class extends Node {
      constructor(nodes = []) {
        super();
        this.nodes = nodes;
      }
      render(opts) {
        return this.nodes.reduce((code, n) => code + n.render(opts), "");
      }
      optimizeNodes() {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i].optimizeNodes();
          if (Array.isArray(n))
            nodes.splice(i, 1, ...n);
          else if (n)
            nodes[i] = n;
          else
            nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      optimizeNames(names2, constants) {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i];
          if (n.optimizeNames(names2, constants))
            continue;
          subtractNames(names2, n.names);
          nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((names2, n) => addNames(names2, n.names), {});
      }
    };
    var BlockNode = class extends ParentNode {
      render(opts) {
        return "{" + opts._n + super.render(opts) + "}" + opts._n;
      }
    };
    var Root = class extends ParentNode {
    };
    var Else = class extends BlockNode {
    };
    Else.kind = "else";
    var If = class _If extends BlockNode {
      constructor(condition, nodes) {
        super(nodes);
        this.condition = condition;
      }
      render(opts) {
        let code = `if(${this.condition})` + super.render(opts);
        if (this.else)
          code += "else " + this.else.render(opts);
        return code;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const cond = this.condition;
        if (cond === true)
          return this.nodes;
        let e = this.else;
        if (e) {
          const ns = e.optimizeNodes();
          e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
        }
        if (e) {
          if (cond === false)
            return e instanceof _If ? e : e.nodes;
          if (this.nodes.length)
            return this;
          return new _If(not(cond), e instanceof _If ? [e] : e.nodes);
        }
        if (cond === false || !this.nodes.length)
          return void 0;
        return this;
      }
      optimizeNames(names2, constants) {
        var _a;
        this.else = (_a = this.else) === null || _a === void 0 ? void 0 : _a.optimizeNames(names2, constants);
        if (!(super.optimizeNames(names2, constants) || this.else))
          return;
        this.condition = optimizeExpr(this.condition, names2, constants);
        return this;
      }
      get names() {
        const names2 = super.names;
        addExprNames(names2, this.condition);
        if (this.else)
          addNames(names2, this.else.names);
        return names2;
      }
    };
    If.kind = "if";
    var For = class extends BlockNode {
    };
    For.kind = "for";
    var ForLoop = class extends For {
      constructor(iteration) {
        super();
        this.iteration = iteration;
      }
      render(opts) {
        return `for(${this.iteration})` + super.render(opts);
      }
      optimizeNames(names2, constants) {
        if (!super.optimizeNames(names2, constants))
          return;
        this.iteration = optimizeExpr(this.iteration, names2, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iteration.names);
      }
    };
    var ForRange = class extends For {
      constructor(varKind, name, from, to) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.from = from;
        this.to = to;
      }
      render(opts) {
        const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
        const { name, from, to } = this;
        return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
      }
      get names() {
        const names2 = addExprNames(super.names, this.from);
        return addExprNames(names2, this.to);
      }
    };
    var ForIter = class extends For {
      constructor(loop, varKind, name, iterable) {
        super();
        this.loop = loop;
        this.varKind = varKind;
        this.name = name;
        this.iterable = iterable;
      }
      render(opts) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
      }
      optimizeNames(names2, constants) {
        if (!super.optimizeNames(names2, constants))
          return;
        this.iterable = optimizeExpr(this.iterable, names2, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iterable.names);
      }
    };
    var Func = class extends BlockNode {
      constructor(name, args, async) {
        super();
        this.name = name;
        this.args = args;
        this.async = async;
      }
      render(opts) {
        const _async = this.async ? "async " : "";
        return `${_async}function ${this.name}(${this.args})` + super.render(opts);
      }
    };
    Func.kind = "func";
    var Return = class extends ParentNode {
      render(opts) {
        return "return " + super.render(opts);
      }
    };
    Return.kind = "return";
    var Try = class extends BlockNode {
      render(opts) {
        let code = "try" + super.render(opts);
        if (this.catch)
          code += this.catch.render(opts);
        if (this.finally)
          code += this.finally.render(opts);
        return code;
      }
      optimizeNodes() {
        var _a, _b;
        super.optimizeNodes();
        (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNodes();
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNodes();
        return this;
      }
      optimizeNames(names2, constants) {
        var _a, _b;
        super.optimizeNames(names2, constants);
        (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNames(names2, constants);
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNames(names2, constants);
        return this;
      }
      get names() {
        const names2 = super.names;
        if (this.catch)
          addNames(names2, this.catch.names);
        if (this.finally)
          addNames(names2, this.finally.names);
        return names2;
      }
    };
    var Catch = class extends BlockNode {
      constructor(error) {
        super();
        this.error = error;
      }
      render(opts) {
        return `catch(${this.error})` + super.render(opts);
      }
    };
    Catch.kind = "catch";
    var Finally = class extends BlockNode {
      render(opts) {
        return "finally" + super.render(opts);
      }
    };
    Finally.kind = "finally";
    var CodeGen = class {
      constructor(extScope, opts = {}) {
        this._values = {};
        this._blockStarts = [];
        this._constants = {};
        this.opts = { ...opts, _n: opts.lines ? "\n" : "" };
        this._extScope = extScope;
        this._scope = new scope_1.Scope({ parent: extScope });
        this._nodes = [new Root()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(prefix2) {
        return this._scope.name(prefix2);
      }
      // reserves unique name in the external scope
      scopeName(prefix2) {
        return this._extScope.name(prefix2);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(prefixOrName, value) {
        const name = this._extScope.value(prefixOrName, value);
        const vs = this._values[name.prefix] || (this._values[name.prefix] = /* @__PURE__ */ new Set());
        vs.add(name);
        return name;
      }
      getScopeValue(prefix2, keyOrRef) {
        return this._extScope.getValue(prefix2, keyOrRef);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(scopeName) {
        return this._extScope.scopeRefs(scopeName, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(varKind, nameOrPrefix, rhs, constant) {
        const name = this._scope.toName(nameOrPrefix);
        if (rhs !== void 0 && constant)
          this._constants[name.str] = rhs;
        this._leafNode(new Def(varKind, name, rhs));
        return name;
      }
      // `const` declaration (`var` in es5 mode)
      const(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
      }
      // `var` declaration with optional assignment
      var(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
      }
      // assignment code
      assign(lhs, rhs, sideEffects) {
        return this._leafNode(new Assign(lhs, rhs, sideEffects));
      }
      // `+=` code
      add(lhs, rhs) {
        return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
      }
      // appends passed SafeExpr to code or executes Block
      code(c) {
        if (typeof c == "function")
          c();
        else if (c !== code_1.nil)
          this._leafNode(new AnyCode(c));
        return this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...keyValues) {
        const code = ["{"];
        for (const [key, value] of keyValues) {
          if (code.length > 1)
            code.push(",");
          code.push(key);
          if (key !== value || this.opts.es5) {
            code.push(":");
            (0, code_1.addCodeArg)(code, value);
          }
        }
        code.push("}");
        return new code_1._Code(code);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(condition, thenBody, elseBody) {
        this._blockNode(new If(condition));
        if (thenBody && elseBody) {
          this.code(thenBody).else().code(elseBody).endIf();
        } else if (thenBody) {
          this.code(thenBody).endIf();
        } else if (elseBody) {
          throw new Error('CodeGen: "else" body without "then" body');
        }
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(condition) {
        return this._elseNode(new If(condition));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new Else());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(If, Else);
      }
      _for(node, forBody) {
        this._blockNode(node);
        if (forBody)
          this.code(forBody).endFor();
        return this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(iteration, forBody) {
        return this._for(new ForLoop(iteration), forBody);
      }
      // `for` statement for a range of values
      forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
        const name = this._scope.toName(nameOrPrefix);
        if (this.opts.es5) {
          const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
          return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
            this.var(name, (0, code_1._)`${arr}[${i}]`);
            forBody(name);
          });
        }
        return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
        if (this.opts.ownProperties) {
          return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
        }
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(For);
      }
      // `label` statement
      label(label) {
        return this._leafNode(new Label(label));
      }
      // `break` statement
      break(label) {
        return this._leafNode(new Break(label));
      }
      // `return` statement
      return(value) {
        const node = new Return();
        this._blockNode(node);
        this.code(value);
        if (node.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(Return);
      }
      // `try` statement
      try(tryBody, catchCode, finallyCode) {
        if (!catchCode && !finallyCode)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const node = new Try();
        this._blockNode(node);
        this.code(tryBody);
        if (catchCode) {
          const error = this.name("e");
          this._currNode = node.catch = new Catch(error);
          catchCode(error);
        }
        if (finallyCode) {
          this._currNode = node.finally = new Finally();
          this.code(finallyCode);
        }
        return this._endBlockNode(Catch, Finally);
      }
      // `throw` statement
      throw(error) {
        return this._leafNode(new Throw(error));
      }
      // start self-balancing block
      block(body, nodeCount) {
        this._blockStarts.push(this._nodes.length);
        if (body)
          this.code(body).endBlock(nodeCount);
        return this;
      }
      // end the current self-balancing block
      endBlock(nodeCount) {
        const len = this._blockStarts.pop();
        if (len === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const toClose = this._nodes.length - len;
        if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) {
          throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
        }
        this._nodes.length = len;
        return this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(name, args = code_1.nil, async, funcBody) {
        this._blockNode(new Func(name, args, async));
        if (funcBody)
          this.code(funcBody).endFunc();
        return this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(Func);
      }
      optimize(n = 1) {
        while (n-- > 0) {
          this._root.optimizeNodes();
          this._root.optimizeNames(this._root.names, this._constants);
        }
      }
      _leafNode(node) {
        this._currNode.nodes.push(node);
        return this;
      }
      _blockNode(node) {
        this._currNode.nodes.push(node);
        this._nodes.push(node);
      }
      _endBlockNode(N1, N2) {
        const n = this._currNode;
        if (n instanceof N1 || N2 && n instanceof N2) {
          this._nodes.pop();
          return this;
        }
        throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
      }
      _elseNode(node) {
        const n = this._currNode;
        if (!(n instanceof If)) {
          throw new Error('CodeGen: "else" without "if"');
        }
        this._currNode = n.else = node;
        return this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const ns = this._nodes;
        return ns[ns.length - 1];
      }
      set _currNode(node) {
        const ns = this._nodes;
        ns[ns.length - 1] = node;
      }
    };
    exports.CodeGen = CodeGen;
    function addNames(names2, from) {
      for (const n in from)
        names2[n] = (names2[n] || 0) + (from[n] || 0);
      return names2;
    }
    function addExprNames(names2, from) {
      return from instanceof code_1._CodeOrName ? addNames(names2, from.names) : names2;
    }
    function optimizeExpr(expr, names2, constants) {
      if (expr instanceof code_1.Name)
        return replaceName(expr);
      if (!canOptimize(expr))
        return expr;
      return new code_1._Code(expr._items.reduce((items, c) => {
        if (c instanceof code_1.Name)
          c = replaceName(c);
        if (c instanceof code_1._Code)
          items.push(...c._items);
        else
          items.push(c);
        return items;
      }, []));
      function replaceName(n) {
        const c = constants[n.str];
        if (c === void 0 || names2[n.str] !== 1)
          return n;
        delete names2[n.str];
        return c;
      }
      function canOptimize(e) {
        return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names2[c.str] === 1 && constants[c.str] !== void 0);
      }
    }
    function subtractNames(names2, from) {
      for (const n in from)
        names2[n] = (names2[n] || 0) - (from[n] || 0);
    }
    function not(x) {
      return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
    }
    exports.not = not;
    var andCode = mappend(exports.operators.AND);
    function and(...args) {
      return args.reduce(andCode);
    }
    exports.and = and;
    var orCode = mappend(exports.operators.OR);
    function or(...args) {
      return args.reduce(orCode);
    }
    exports.or = or;
    function mappend(op) {
      return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
    }
    function par(x) {
      return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
    }
  }
});

// ../node_modules/ajv/dist/compile/util.js
var require_util = __commonJS({
  "../node_modules/ajv/dist/compile/util.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
    var codegen_1 = require_codegen();
    var code_1 = require_code();
    function toHash(arr) {
      const hash = {};
      for (const item of arr)
        hash[item] = true;
      return hash;
    }
    exports.toHash = toHash;
    function alwaysValidSchema(it, schema) {
      if (typeof schema == "boolean")
        return schema;
      if (Object.keys(schema).length === 0)
        return true;
      checkUnknownRules(it, schema);
      return !schemaHasRules(schema, it.self.RULES.all);
    }
    exports.alwaysValidSchema = alwaysValidSchema;
    function checkUnknownRules(it, schema = it.schema) {
      const { opts, self } = it;
      if (!opts.strictSchema)
        return;
      if (typeof schema === "boolean")
        return;
      const rules = self.RULES.keywords;
      for (const key in schema) {
        if (!rules[key])
          checkStrictMode(it, `unknown keyword: "${key}"`);
      }
    }
    exports.checkUnknownRules = checkUnknownRules;
    function schemaHasRules(schema, rules) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (rules[key])
          return true;
      return false;
    }
    exports.schemaHasRules = schemaHasRules;
    function schemaHasRulesButRef(schema, RULES) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (key !== "$ref" && RULES.all[key])
          return true;
      return false;
    }
    exports.schemaHasRulesButRef = schemaHasRulesButRef;
    function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
      if (!$data) {
        if (typeof schema == "number" || typeof schema == "boolean")
          return schema;
        if (typeof schema == "string")
          return (0, codegen_1._)`${schema}`;
      }
      return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
    }
    exports.schemaRefOrVal = schemaRefOrVal;
    function unescapeFragment(str) {
      return unescapeJsonPointer(decodeURIComponent(str));
    }
    exports.unescapeFragment = unescapeFragment;
    function escapeFragment(str) {
      return encodeURIComponent(escapeJsonPointer(str));
    }
    exports.escapeFragment = escapeFragment;
    function escapeJsonPointer(str) {
      if (typeof str == "number")
        return `${str}`;
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
    exports.escapeJsonPointer = escapeJsonPointer;
    function unescapeJsonPointer(str) {
      return str.replace(/~1/g, "/").replace(/~0/g, "~");
    }
    exports.unescapeJsonPointer = unescapeJsonPointer;
    function eachItem(xs, f) {
      if (Array.isArray(xs)) {
        for (const x of xs)
          f(x);
      } else {
        f(xs);
      }
    }
    exports.eachItem = eachItem;
    function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
      return (gen, from, to, toName) => {
        const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
        return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
      };
    }
    exports.mergeEvaluated = {
      props: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
          gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
        }),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
          if (from === true) {
            gen.assign(to, true);
          } else {
            gen.assign(to, (0, codegen_1._)`${to} || {}`);
            setEvaluated(gen, to, from);
          }
        }),
        mergeValues: (from, to) => from === true ? true : { ...from, ...to },
        resultToName: evaluatedPropsToName
      }),
      items: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
        mergeValues: (from, to) => from === true ? true : Math.max(from, to),
        resultToName: (gen, items) => gen.var("items", items)
      })
    };
    function evaluatedPropsToName(gen, ps) {
      if (ps === true)
        return gen.var("props", true);
      const props = gen.var("props", (0, codegen_1._)`{}`);
      if (ps !== void 0)
        setEvaluated(gen, props, ps);
      return props;
    }
    exports.evaluatedPropsToName = evaluatedPropsToName;
    function setEvaluated(gen, props, ps) {
      Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
    }
    exports.setEvaluated = setEvaluated;
    var snippets = {};
    function useFunc(gen, f) {
      return gen.scopeValue("func", {
        ref: f,
        code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
      });
    }
    exports.useFunc = useFunc;
    var Type;
    (function(Type2) {
      Type2[Type2["Num"] = 0] = "Num";
      Type2[Type2["Str"] = 1] = "Str";
    })(Type || (exports.Type = Type = {}));
    function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
      if (dataProp instanceof codegen_1.Name) {
        const isNumber = dataPropType === Type.Num;
        return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
      }
      return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
    }
    exports.getErrorPath = getErrorPath;
    function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
      if (!mode)
        return;
      msg = `strict mode: ${msg}`;
      if (mode === true)
        throw new Error(msg);
      it.self.logger.warn(msg);
    }
    exports.checkStrictMode = checkStrictMode;
  }
});

// ../node_modules/ajv/dist/compile/names.js
var require_names = __commonJS({
  "../node_modules/ajv/dist/compile/names.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var names2 = {
      // validation function arguments
      data: new codegen_1.Name("data"),
      // data passed to validation function
      // args passed from referencing schema
      valCxt: new codegen_1.Name("valCxt"),
      // validation/data context - should not be used directly, it is destructured to the names below
      instancePath: new codegen_1.Name("instancePath"),
      parentData: new codegen_1.Name("parentData"),
      parentDataProperty: new codegen_1.Name("parentDataProperty"),
      rootData: new codegen_1.Name("rootData"),
      // root data - same as the data passed to the first/top validation function
      dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
      // used to support recursiveRef and dynamicRef
      // function scoped variables
      vErrors: new codegen_1.Name("vErrors"),
      // null or array of validation errors
      errors: new codegen_1.Name("errors"),
      // counter of validation errors
      this: new codegen_1.Name("this"),
      // "globals"
      self: new codegen_1.Name("self"),
      scope: new codegen_1.Name("scope"),
      // JTD serialize/parse name for JSON string and position
      json: new codegen_1.Name("json"),
      jsonPos: new codegen_1.Name("jsonPos"),
      jsonLen: new codegen_1.Name("jsonLen"),
      jsonPart: new codegen_1.Name("jsonPart")
    };
    exports.default = names2;
  }
});

// ../node_modules/ajv/dist/compile/errors.js
var require_errors2 = __commonJS({
  "../node_modules/ajv/dist/compile/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    exports.keywordError = {
      message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation`
    };
    exports.keyword$DataError = {
      message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)`
    };
    function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) {
        addError(gen, errObj);
      } else {
        returnErrors(it, (0, codegen_1._)`[${errObj}]`);
      }
    }
    exports.reportError = reportError;
    function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      addError(gen, errObj);
      if (!(compositeRule || allErrors)) {
        returnErrors(it, names_1.default.vErrors);
      }
    }
    exports.reportExtraError = reportExtraError;
    function resetErrorsCount(gen, errsCount) {
      gen.assign(names_1.default.errors, errsCount);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
    }
    exports.resetErrorsCount = resetErrorsCount;
    function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
      if (errsCount === void 0)
        throw new Error("ajv implementation error");
      const err = gen.name("err");
      gen.forRange("i", errsCount, names_1.default.errors, (i) => {
        gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
        gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
        gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
        if (it.opts.verbose) {
          gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
          gen.assign((0, codegen_1._)`${err}.data`, data);
        }
      });
    }
    exports.extendErrors = extendErrors;
    function addError(gen, errObj) {
      const err = gen.const("err", errObj);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
      gen.code((0, codegen_1._)`${names_1.default.errors}++`);
    }
    function returnErrors(it, errs) {
      const { gen, validateName, schemaEnv } = it;
      if (schemaEnv.$async) {
        gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
        gen.return(false);
      }
    }
    var E = {
      keyword: new codegen_1.Name("keyword"),
      schemaPath: new codegen_1.Name("schemaPath"),
      // also used in JTD errors
      params: new codegen_1.Name("params"),
      propertyName: new codegen_1.Name("propertyName"),
      message: new codegen_1.Name("message"),
      schema: new codegen_1.Name("schema"),
      parentSchema: new codegen_1.Name("parentSchema")
    };
    function errorObjectCode(cxt, error, errorPaths) {
      const { createErrors } = cxt.it;
      if (createErrors === false)
        return (0, codegen_1._)`{}`;
      return errorObject(cxt, error, errorPaths);
    }
    function errorObject(cxt, error, errorPaths = {}) {
      const { gen, it } = cxt;
      const keyValues = [
        errorInstancePath(it, errorPaths),
        errorSchemaPath(cxt, errorPaths)
      ];
      extraErrorProps(cxt, error, keyValues);
      return gen.object(...keyValues);
    }
    function errorInstancePath({ errorPath }, { instancePath }) {
      const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
      return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
    }
    function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
      let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
      if (schemaPath) {
        schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
      }
      return [E.schemaPath, schPath];
    }
    function extraErrorProps(cxt, { params, message }, keyValues) {
      const { keyword, data, schemaValue, it } = cxt;
      const { opts, propertyName, topSchemaRef, schemaPath } = it;
      keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
      if (opts.messages) {
        keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
      }
      if (opts.verbose) {
        keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
      }
      if (propertyName)
        keyValues.push([E.propertyName, propertyName]);
    }
  }
});

// ../node_modules/ajv/dist/compile/validate/boolSchema.js
var require_boolSchema = __commonJS({
  "../node_modules/ajv/dist/compile/validate/boolSchema.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
    var errors_1 = require_errors2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var boolError = {
      message: "boolean schema is false"
    };
    function topBoolOrEmptySchema(it) {
      const { gen, schema, validateName } = it;
      if (schema === false) {
        falseSchemaError(it, false);
      } else if (typeof schema == "object" && schema.$async === true) {
        gen.return(names_1.default.data);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, null);
        gen.return(true);
      }
    }
    exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
    function boolOrEmptySchema(it, valid) {
      const { gen, schema } = it;
      if (schema === false) {
        gen.var(valid, false);
        falseSchemaError(it);
      } else {
        gen.var(valid, true);
      }
    }
    exports.boolOrEmptySchema = boolOrEmptySchema;
    function falseSchemaError(it, overrideAllErrors) {
      const { gen, data } = it;
      const cxt = {
        gen,
        keyword: "false schema",
        data,
        schema: false,
        schemaCode: false,
        schemaValue: false,
        params: {},
        it
      };
      (0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
    }
  }
});

// ../node_modules/ajv/dist/compile/rules.js
var require_rules = __commonJS({
  "../node_modules/ajv/dist/compile/rules.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRules = exports.isJSONType = void 0;
    var _jsonTypes = ["string", "number", "integer", "boolean", "null", "object", "array"];
    var jsonTypes = new Set(_jsonTypes);
    function isJSONType(x) {
      return typeof x == "string" && jsonTypes.has(x);
    }
    exports.isJSONType = isJSONType;
    function getRules() {
      const groups = {
        number: { type: "number", rules: [] },
        string: { type: "string", rules: [] },
        array: { type: "array", rules: [] },
        object: { type: "object", rules: [] }
      };
      return {
        types: { ...groups, integer: true, boolean: true, null: true },
        rules: [{ rules: [] }, groups.number, groups.string, groups.array, groups.object],
        post: { rules: [] },
        all: {},
        keywords: {}
      };
    }
    exports.getRules = getRules;
  }
});

// ../node_modules/ajv/dist/compile/validate/applicability.js
var require_applicability = __commonJS({
  "../node_modules/ajv/dist/compile/validate/applicability.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
    function schemaHasRulesForType({ schema, self }, type) {
      const group = self.RULES.types[type];
      return group && group !== true && shouldUseGroup(schema, group);
    }
    exports.schemaHasRulesForType = schemaHasRulesForType;
    function shouldUseGroup(schema, group) {
      return group.rules.some((rule) => shouldUseRule(schema, rule));
    }
    exports.shouldUseGroup = shouldUseGroup;
    function shouldUseRule(schema, rule) {
      var _a;
      return schema[rule.keyword] !== void 0 || ((_a = rule.definition.implements) === null || _a === void 0 ? void 0 : _a.some((kwd) => schema[kwd] !== void 0));
    }
    exports.shouldUseRule = shouldUseRule;
  }
});

// ../node_modules/ajv/dist/compile/validate/dataType.js
var require_dataType = __commonJS({
  "../node_modules/ajv/dist/compile/validate/dataType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
    var rules_1 = require_rules();
    var applicability_1 = require_applicability();
    var errors_1 = require_errors2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var DataType;
    (function(DataType2) {
      DataType2[DataType2["Correct"] = 0] = "Correct";
      DataType2[DataType2["Wrong"] = 1] = "Wrong";
    })(DataType || (exports.DataType = DataType = {}));
    function getSchemaTypes(schema) {
      const types = getJSONTypes(schema.type);
      const hasNull = types.includes("null");
      if (hasNull) {
        if (schema.nullable === false)
          throw new Error("type: null contradicts nullable: false");
      } else {
        if (!types.length && schema.nullable !== void 0) {
          throw new Error('"nullable" cannot be used without "type"');
        }
        if (schema.nullable === true)
          types.push("null");
      }
      return types;
    }
    exports.getSchemaTypes = getSchemaTypes;
    function getJSONTypes(ts) {
      const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
      if (types.every(rules_1.isJSONType))
        return types;
      throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
    }
    exports.getJSONTypes = getJSONTypes;
    function coerceAndCheckDataType(it, types) {
      const { gen, data, opts } = it;
      const coerceTo = coerceToTypes(types, opts.coerceTypes);
      const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
      if (checkTypes) {
        const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
        gen.if(wrongType, () => {
          if (coerceTo.length)
            coerceData(it, types, coerceTo);
          else
            reportTypeError(it);
        });
      }
      return checkTypes;
    }
    exports.coerceAndCheckDataType = coerceAndCheckDataType;
    var COERCIBLE = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
    function coerceToTypes(types, coerceTypes) {
      return coerceTypes ? types.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
    }
    function coerceData(it, types, coerceTo) {
      const { gen, data, opts } = it;
      const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
      const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
      if (opts.coerceTypes === "array") {
        gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
      }
      gen.if((0, codegen_1._)`${coerced} !== undefined`);
      for (const t of coerceTo) {
        if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") {
          coerceSpecificType(t);
        }
      }
      gen.else();
      reportTypeError(it);
      gen.endIf();
      gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
        gen.assign(data, coerced);
        assignParentData(it, coerced);
      });
      function coerceSpecificType(t) {
        switch (t) {
          case "string":
            gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
            return;
          case "number":
            gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "integer":
            gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "boolean":
            gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
            return;
          case "null":
            gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
            gen.assign(coerced, null);
            return;
          case "array":
            gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
        }
      }
    }
    function assignParentData({ gen, parentData, parentDataProperty }, expr) {
      gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
    }
    function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
      const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
      let cond;
      switch (dataType) {
        case "null":
          return (0, codegen_1._)`${data} ${EQ} null`;
        case "array":
          cond = (0, codegen_1._)`Array.isArray(${data})`;
          break;
        case "object":
          cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
          break;
        case "integer":
          cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
          break;
        case "number":
          cond = numCond();
          break;
        default:
          return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
      }
      return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
      function numCond(_cond = codegen_1.nil) {
        return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
      }
    }
    exports.checkDataType = checkDataType;
    function checkDataTypes(dataTypes, data, strictNums, correct) {
      if (dataTypes.length === 1) {
        return checkDataType(dataTypes[0], data, strictNums, correct);
      }
      let cond;
      const types = (0, util_1.toHash)(dataTypes);
      if (types.array && types.object) {
        const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
        cond = types.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
        delete types.null;
        delete types.array;
        delete types.object;
      } else {
        cond = codegen_1.nil;
      }
      if (types.number)
        delete types.integer;
      for (const t in types)
        cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
      return cond;
    }
    exports.checkDataTypes = checkDataTypes;
    var typeError = {
      message: ({ schema }) => `must be ${schema}`,
      params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`
    };
    function reportTypeError(it) {
      const cxt = getTypeErrorContext(it);
      (0, errors_1.reportError)(cxt, typeError);
    }
    exports.reportTypeError = reportTypeError;
    function getTypeErrorContext(it) {
      const { gen, data, schema } = it;
      const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
      return {
        gen,
        keyword: "type",
        data,
        schema: schema.type,
        schemaCode,
        schemaValue: schemaCode,
        parentSchema: schema,
        params: {},
        it
      };
    }
  }
});

// ../node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults = __commonJS({
  "../node_modules/ajv/dist/compile/validate/defaults.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assignDefaults = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function assignDefaults(it, ty) {
      const { properties, items } = it.schema;
      if (ty === "object" && properties) {
        for (const key in properties) {
          assignDefault(it, key, properties[key].default);
        }
      } else if (ty === "array" && Array.isArray(items)) {
        items.forEach((sch, i) => assignDefault(it, i, sch.default));
      }
    }
    exports.assignDefaults = assignDefaults;
    function assignDefault(it, prop, defaultValue) {
      const { gen, compositeRule, data, opts } = it;
      if (defaultValue === void 0)
        return;
      const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
      if (compositeRule) {
        (0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
        return;
      }
      let condition = (0, codegen_1._)`${childData} === undefined`;
      if (opts.useDefaults === "empty") {
        condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
      }
      gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
    }
  }
});

// ../node_modules/ajv/dist/vocabularies/code.js
var require_code2 = __commonJS({
  "../node_modules/ajv/dist/vocabularies/code.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    var util_2 = require_util();
    function checkReportMissingProp(cxt, prop) {
      const { gen, data, it } = cxt;
      gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
        cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
        cxt.error();
      });
    }
    exports.checkReportMissingProp = checkReportMissingProp;
    function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
      return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
    }
    exports.checkMissingProp = checkMissingProp;
    function reportMissingProp(cxt, missing) {
      cxt.setParams({ missingProperty: missing }, true);
      cxt.error();
    }
    exports.reportMissingProp = reportMissingProp;
    function hasPropFunc(gen) {
      return gen.scopeValue("func", {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        ref: Object.prototype.hasOwnProperty,
        code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
      });
    }
    exports.hasPropFunc = hasPropFunc;
    function isOwnProperty(gen, data, property) {
      return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
    }
    exports.isOwnProperty = isOwnProperty;
    function propertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
      return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
    }
    exports.propertyInData = propertyInData;
    function noPropertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
      return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
    }
    exports.noPropertyInData = noPropertyInData;
    function allSchemaProperties(schemaMap) {
      return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
    }
    exports.allSchemaProperties = allSchemaProperties;
    function schemaProperties(it, schemaMap) {
      return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
    }
    exports.schemaProperties = schemaProperties;
    function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
      const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
      const valCxt = [
        [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
        [names_1.default.parentData, it.parentData],
        [names_1.default.parentDataProperty, it.parentDataProperty],
        [names_1.default.rootData, names_1.default.rootData]
      ];
      if (it.opts.dynamicRef)
        valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
      const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
      return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
    }
    exports.callValidateCode = callValidateCode;
    var newRegExp = (0, codegen_1._)`new RegExp`;
    function usePattern({ gen, it: { opts } }, pattern) {
      const u = opts.unicodeRegExp ? "u" : "";
      const { regExp } = opts.code;
      const rx = regExp(pattern, u);
      return gen.scopeValue("pattern", {
        key: rx.toString(),
        ref: rx,
        code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
      });
    }
    exports.usePattern = usePattern;
    function validateArray(cxt) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      if (it.allErrors) {
        const validArr = gen.let("valid", true);
        validateItems(() => gen.assign(validArr, false));
        return validArr;
      }
      gen.var(valid, true);
      validateItems(() => gen.break());
      return valid;
      function validateItems(notValid) {
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        gen.forRange("i", 0, len, (i) => {
          cxt.subschema({
            keyword,
            dataProp: i,
            dataPropType: util_1.Type.Num
          }, valid);
          gen.if((0, codegen_1.not)(valid), notValid);
        });
      }
    }
    exports.validateArray = validateArray;
    function validateUnion(cxt) {
      const { gen, schema, keyword, it } = cxt;
      if (!Array.isArray(schema))
        throw new Error("ajv implementation error");
      const alwaysValid = schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch));
      if (alwaysValid && !it.opts.unevaluated)
        return;
      const valid = gen.let("valid", false);
      const schValid = gen.name("_valid");
      gen.block(() => schema.forEach((_sch, i) => {
        const schCxt = cxt.subschema({
          keyword,
          schemaProp: i,
          compositeRule: true
        }, schValid);
        gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
        const merged = cxt.mergeValidEvaluated(schCxt, schValid);
        if (!merged)
          gen.if((0, codegen_1.not)(valid));
      }));
      cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
    }
    exports.validateUnion = validateUnion;
  }
});

// ../node_modules/ajv/dist/compile/validate/keyword.js
var require_keyword = __commonJS({
  "../node_modules/ajv/dist/compile/validate/keyword.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var code_1 = require_code2();
    var errors_1 = require_errors2();
    function macroKeywordCode(cxt, def) {
      const { gen, keyword, schema, parentSchema, it } = cxt;
      const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
      const schemaRef = useKeyword(gen, keyword, macroSchema);
      if (it.opts.validateSchema !== false)
        it.self.validateSchema(macroSchema, true);
      const valid = gen.name("valid");
      cxt.subschema({
        schema: macroSchema,
        schemaPath: codegen_1.nil,
        errSchemaPath: `${it.errSchemaPath}/${keyword}`,
        topSchemaRef: schemaRef,
        compositeRule: true
      }, valid);
      cxt.pass(valid, () => cxt.error(true));
    }
    exports.macroKeywordCode = macroKeywordCode;
    function funcKeywordCode(cxt, def) {
      var _a;
      const { gen, keyword, schema, parentSchema, $data, it } = cxt;
      checkAsyncKeyword(it, def);
      const validate2 = !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate;
      const validateRef = useKeyword(gen, keyword, validate2);
      const valid = gen.let("valid");
      cxt.block$data(valid, validateKeyword);
      cxt.ok((_a = def.valid) !== null && _a !== void 0 ? _a : valid);
      function validateKeyword() {
        if (def.errors === false) {
          assignValid();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => cxt.error());
        } else {
          const ruleErrs = def.async ? validateAsync() : validateSync();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => addErrs(cxt, ruleErrs));
        }
      }
      function validateAsync() {
        const ruleErrs = gen.let("ruleErrs", null);
        gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
        return ruleErrs;
      }
      function validateSync() {
        const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
        gen.assign(validateErrs, null);
        assignValid(codegen_1.nil);
        return validateErrs;
      }
      function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
        const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
        const passSchema = !("compile" in def && !$data || def.schema === false);
        gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
      }
      function reportErrs(errors) {
        var _a2;
        gen.if((0, codegen_1.not)((_a2 = def.valid) !== null && _a2 !== void 0 ? _a2 : valid), errors);
      }
    }
    exports.funcKeywordCode = funcKeywordCode;
    function modifyData(cxt) {
      const { gen, data, it } = cxt;
      gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
    }
    function addErrs(cxt, errs) {
      const { gen } = cxt;
      gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
        (0, errors_1.extendErrors)(cxt);
      }, () => cxt.error());
    }
    function checkAsyncKeyword({ schemaEnv }, def) {
      if (def.async && !schemaEnv.$async)
        throw new Error("async keyword in sync schema");
    }
    function useKeyword(gen, keyword, result) {
      if (result === void 0)
        throw new Error(`keyword "${keyword}" failed to compile`);
      return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : { ref: result, code: (0, codegen_1.stringify)(result) });
    }
    function validSchemaType(schema, schemaType, allowUndefined = false) {
      return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema) : st === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st || allowUndefined && typeof schema == "undefined");
    }
    exports.validSchemaType = validSchemaType;
    function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
      if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) {
        throw new Error("ajv implementation error");
      }
      const deps = def.dependencies;
      if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) {
        throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
      }
      if (def.validateSchema) {
        const valid = def.validateSchema(schema[keyword]);
        if (!valid) {
          const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
          if (opts.validateSchema === "log")
            self.logger.error(msg);
          else
            throw new Error(msg);
        }
      }
    }
    exports.validateKeywordUsage = validateKeywordUsage;
  }
});

// ../node_modules/ajv/dist/compile/validate/subschema.js
var require_subschema = __commonJS({
  "../node_modules/ajv/dist/compile/validate/subschema.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
      if (keyword !== void 0 && schema !== void 0) {
        throw new Error('both "keyword" and "schema" passed, only one allowed');
      }
      if (keyword !== void 0) {
        const sch = it.schema[keyword];
        return schemaProp === void 0 ? {
          schema: sch,
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}`
        } : {
          schema: sch[schemaProp],
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
        };
      }
      if (schema !== void 0) {
        if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) {
          throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
        }
        return {
          schema,
          schemaPath,
          topSchemaRef,
          errSchemaPath
        };
      }
      throw new Error('either "keyword" or "schema" must be passed');
    }
    exports.getSubschema = getSubschema;
    function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
      if (data !== void 0 && dataProp !== void 0) {
        throw new Error('both "data" and "dataProp" passed, only one allowed');
      }
      const { gen } = it;
      if (dataProp !== void 0) {
        const { errorPath, dataPathArr, opts } = it;
        const nextData = gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true);
        dataContextProps(nextData);
        subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
        subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
        subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
      }
      if (data !== void 0) {
        const nextData = data instanceof codegen_1.Name ? data : gen.let("data", data, true);
        dataContextProps(nextData);
        if (propertyName !== void 0)
          subschema.propertyName = propertyName;
      }
      if (dataTypes)
        subschema.dataTypes = dataTypes;
      function dataContextProps(_nextData) {
        subschema.data = _nextData;
        subschema.dataLevel = it.dataLevel + 1;
        subschema.dataTypes = [];
        it.definedProperties = /* @__PURE__ */ new Set();
        subschema.parentData = it.data;
        subschema.dataNames = [...it.dataNames, _nextData];
      }
    }
    exports.extendSubschemaData = extendSubschemaData;
    function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
      if (compositeRule !== void 0)
        subschema.compositeRule = compositeRule;
      if (createErrors !== void 0)
        subschema.createErrors = createErrors;
      if (allErrors !== void 0)
        subschema.allErrors = allErrors;
      subschema.jtdDiscriminator = jtdDiscriminator;
      subschema.jtdMetadata = jtdMetadata;
    }
    exports.extendSubschemaMode = extendSubschemaMode;
  }
});

// ../node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "../node_modules/fast-deep-equal/index.js"(exports, module) {
    "use strict";
    module.exports = function equal(a, b) {
      if (a === b) return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor) return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0; )
            if (!equal(a[i], b[i])) return false;
          return true;
        }
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal(a[key], b[key])) return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// ../node_modules/json-schema-traverse/index.js
var require_json_schema_traverse = __commonJS({
  "../node_modules/json-schema-traverse/index.js"(exports, module) {
    "use strict";
    var traverse = module.exports = function(schema, opts, cb) {
      if (typeof opts == "function") {
        cb = opts;
        opts = {};
      }
      cb = opts.cb || cb;
      var pre = typeof cb == "function" ? cb : cb.pre || function() {
      };
      var post = cb.post || function() {
      };
      _traverse(opts, pre, post, schema, "", schema);
    };
    traverse.keywords = {
      additionalItems: true,
      items: true,
      contains: true,
      additionalProperties: true,
      propertyNames: true,
      not: true,
      if: true,
      then: true,
      else: true
    };
    traverse.arrayKeywords = {
      items: true,
      allOf: true,
      anyOf: true,
      oneOf: true
    };
    traverse.propsKeywords = {
      $defs: true,
      definitions: true,
      properties: true,
      patternProperties: true,
      dependencies: true
    };
    traverse.skipKeywords = {
      default: true,
      enum: true,
      const: true,
      required: true,
      maximum: true,
      minimum: true,
      exclusiveMaximum: true,
      exclusiveMinimum: true,
      multipleOf: true,
      maxLength: true,
      minLength: true,
      pattern: true,
      format: true,
      maxItems: true,
      minItems: true,
      uniqueItems: true,
      maxProperties: true,
      minProperties: true
    };
    function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
      if (schema && typeof schema == "object" && !Array.isArray(schema)) {
        pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
        for (var key in schema) {
          var sch = schema[key];
          if (Array.isArray(sch)) {
            if (key in traverse.arrayKeywords) {
              for (var i = 0; i < sch.length; i++)
                _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema, i);
            }
          } else if (key in traverse.propsKeywords) {
            if (sch && typeof sch == "object") {
              for (var prop in sch)
                _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
            }
          } else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) {
            _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
          }
        }
        post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
      }
    }
    function escapeJsonPtr(str) {
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
  }
});

// ../node_modules/ajv/dist/compile/resolve.js
var require_resolve = __commonJS({
  "../node_modules/ajv/dist/compile/resolve.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
    var util_1 = require_util();
    var equal = require_fast_deep_equal();
    var traverse = require_json_schema_traverse();
    var SIMPLE_INLINED = /* @__PURE__ */ new Set([
      "type",
      "format",
      "pattern",
      "maxLength",
      "minLength",
      "maxProperties",
      "minProperties",
      "maxItems",
      "minItems",
      "maximum",
      "minimum",
      "uniqueItems",
      "multipleOf",
      "required",
      "enum",
      "const"
    ]);
    function inlineRef(schema, limit = true) {
      if (typeof schema == "boolean")
        return true;
      if (limit === true)
        return !hasRef(schema);
      if (!limit)
        return false;
      return countKeys(schema) <= limit;
    }
    exports.inlineRef = inlineRef;
    var REF_KEYWORDS = /* @__PURE__ */ new Set([
      "$ref",
      "$recursiveRef",
      "$recursiveAnchor",
      "$dynamicRef",
      "$dynamicAnchor"
    ]);
    function hasRef(schema) {
      for (const key in schema) {
        if (REF_KEYWORDS.has(key))
          return true;
        const sch = schema[key];
        if (Array.isArray(sch) && sch.some(hasRef))
          return true;
        if (typeof sch == "object" && hasRef(sch))
          return true;
      }
      return false;
    }
    function countKeys(schema) {
      let count = 0;
      for (const key in schema) {
        if (key === "$ref")
          return Infinity;
        count++;
        if (SIMPLE_INLINED.has(key))
          continue;
        if (typeof schema[key] == "object") {
          (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
        }
        if (count === Infinity)
          return Infinity;
      }
      return count;
    }
    function getFullPath(resolver, id = "", normalize3) {
      if (normalize3 !== false)
        id = normalizeId(id);
      const p = resolver.parse(id);
      return _getFullPath(resolver, p);
    }
    exports.getFullPath = getFullPath;
    function _getFullPath(resolver, p) {
      const serialized = resolver.serialize(p);
      return serialized.split("#")[0] + "#";
    }
    exports._getFullPath = _getFullPath;
    var TRAILING_SLASH_HASH = /#\/?$/;
    function normalizeId(id) {
      return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
    }
    exports.normalizeId = normalizeId;
    function resolveUrl(resolver, baseId, id) {
      id = normalizeId(id);
      return resolver.resolve(baseId, id);
    }
    exports.resolveUrl = resolveUrl;
    var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
    function getSchemaRefs(schema, baseId) {
      if (typeof schema == "boolean")
        return {};
      const { schemaId, uriResolver } = this.opts;
      const schId = normalizeId(schema[schemaId] || baseId);
      const baseIds = { "": schId };
      const pathPrefix = getFullPath(uriResolver, schId, false);
      const localRefs = {};
      const schemaRefs = /* @__PURE__ */ new Set();
      traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
        if (parentJsonPtr === void 0)
          return;
        const fullPath = pathPrefix + jsonPtr;
        let innerBaseId = baseIds[parentJsonPtr];
        if (typeof sch[schemaId] == "string")
          innerBaseId = addRef.call(this, sch[schemaId]);
        addAnchor.call(this, sch.$anchor);
        addAnchor.call(this, sch.$dynamicAnchor);
        baseIds[jsonPtr] = innerBaseId;
        function addRef(ref) {
          const _resolve = this.opts.uriResolver.resolve;
          ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref);
          if (schemaRefs.has(ref))
            throw ambiguos(ref);
          schemaRefs.add(ref);
          let schOrRef = this.refs[ref];
          if (typeof schOrRef == "string")
            schOrRef = this.refs[schOrRef];
          if (typeof schOrRef == "object") {
            checkAmbiguosRef(sch, schOrRef.schema, ref);
          } else if (ref !== normalizeId(fullPath)) {
            if (ref[0] === "#") {
              checkAmbiguosRef(sch, localRefs[ref], ref);
              localRefs[ref] = sch;
            } else {
              this.refs[ref] = fullPath;
            }
          }
          return ref;
        }
        function addAnchor(anchor) {
          if (typeof anchor == "string") {
            if (!ANCHOR.test(anchor))
              throw new Error(`invalid anchor "${anchor}"`);
            addRef.call(this, `#${anchor}`);
          }
        }
      });
      return localRefs;
      function checkAmbiguosRef(sch1, sch2, ref) {
        if (sch2 !== void 0 && !equal(sch1, sch2))
          throw ambiguos(ref);
      }
      function ambiguos(ref) {
        return new Error(`reference "${ref}" resolves to more than one schema`);
      }
    }
    exports.getSchemaRefs = getSchemaRefs;
  }
});

// ../node_modules/ajv/dist/compile/validate/index.js
var require_validate = __commonJS({
  "../node_modules/ajv/dist/compile/validate/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
    var boolSchema_1 = require_boolSchema();
    var dataType_1 = require_dataType();
    var applicability_1 = require_applicability();
    var dataType_2 = require_dataType();
    var defaults_1 = require_defaults();
    var keyword_1 = require_keyword();
    var subschema_1 = require_subschema();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var errors_1 = require_errors2();
    function validateFunctionCode(it) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          topSchemaObjCode(it);
          return;
        }
      }
      validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
    }
    exports.validateFunctionCode = validateFunctionCode;
    function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
      if (opts.code.es5) {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
          gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
          destructureValCxtES5(gen, opts);
          gen.code(body);
        });
      } else {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
      }
    }
    function destructureValCxt(opts) {
      return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
    }
    function destructureValCxtES5(gen, opts) {
      gen.if(names_1.default.valCxt, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
        gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
      }, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.rootData, names_1.default.data);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
      });
    }
    function topSchemaObjCode(it) {
      const { schema, opts, gen } = it;
      validateFunction(it, () => {
        if (opts.$comment && schema.$comment)
          commentKeyword(it);
        checkNoDefault(it);
        gen.let(names_1.default.vErrors, null);
        gen.let(names_1.default.errors, 0);
        if (opts.unevaluated)
          resetEvaluated(it);
        typeAndKeywords(it);
        returnResults(it);
      });
      return;
    }
    function resetEvaluated(it) {
      const { gen, validateName } = it;
      it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
    }
    function funcSourceUrl(schema, opts) {
      const schId = typeof schema == "object" && schema[opts.schemaId];
      return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
    }
    function subschemaCode(it, valid) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          subSchemaObjCode(it, valid);
          return;
        }
      }
      (0, boolSchema_1.boolOrEmptySchema)(it, valid);
    }
    function schemaCxtHasRules({ schema, self }) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (self.RULES.all[key])
          return true;
      return false;
    }
    function isSchemaObj(it) {
      return typeof it.schema != "boolean";
    }
    function subSchemaObjCode(it, valid) {
      const { schema, gen, opts } = it;
      if (opts.$comment && schema.$comment)
        commentKeyword(it);
      updateContext(it);
      checkAsyncSchema(it);
      const errsCount = gen.const("_errs", names_1.default.errors);
      typeAndKeywords(it, errsCount);
      gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
    }
    function checkKeywords(it) {
      (0, util_1.checkUnknownRules)(it);
      checkRefsAndKeywords(it);
    }
    function typeAndKeywords(it, errsCount) {
      if (it.opts.jtd)
        return schemaKeywords(it, [], false, errsCount);
      const types = (0, dataType_1.getSchemaTypes)(it.schema);
      const checkedTypes = (0, dataType_1.coerceAndCheckDataType)(it, types);
      schemaKeywords(it, types, !checkedTypes, errsCount);
    }
    function checkRefsAndKeywords(it) {
      const { schema, errSchemaPath, opts, self } = it;
      if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) {
        self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
      }
    }
    function checkNoDefault(it) {
      const { schema, opts } = it;
      if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) {
        (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
      }
    }
    function updateContext(it) {
      const schId = it.schema[it.opts.schemaId];
      if (schId)
        it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
    }
    function checkAsyncSchema(it) {
      if (it.schema.$async && !it.schemaEnv.$async)
        throw new Error("async schema in sync schema");
    }
    function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
      const msg = schema.$comment;
      if (opts.$comment === true) {
        gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
      } else if (typeof opts.$comment == "function") {
        const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
        const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
        gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
      }
    }
    function returnResults(it) {
      const { gen, schemaEnv, validateName, ValidationError, opts } = it;
      if (schemaEnv.$async) {
        gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
        if (opts.unevaluated)
          assignEvaluated(it);
        gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
      }
    }
    function assignEvaluated({ gen, evaluated, props, items }) {
      if (props instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.props`, props);
      if (items instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.items`, items);
    }
    function schemaKeywords(it, types, typeErrors, errsCount) {
      const { gen, schema, data, allErrors, opts, self } = it;
      const { RULES } = self;
      if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
        gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
        return;
      }
      if (!opts.jtd)
        checkStrictTypes(it, types);
      gen.block(() => {
        for (const group of RULES.rules)
          groupKeywords(group);
        groupKeywords(RULES.post);
      });
      function groupKeywords(group) {
        if (!(0, applicability_1.shouldUseGroup)(schema, group))
          return;
        if (group.type) {
          gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
          iterateKeywords(it, group);
          if (types.length === 1 && types[0] === group.type && typeErrors) {
            gen.else();
            (0, dataType_2.reportTypeError)(it);
          }
          gen.endIf();
        } else {
          iterateKeywords(it, group);
        }
        if (!allErrors)
          gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
      }
    }
    function iterateKeywords(it, group) {
      const { gen, schema, opts: { useDefaults } } = it;
      if (useDefaults)
        (0, defaults_1.assignDefaults)(it, group.type);
      gen.block(() => {
        for (const rule of group.rules) {
          if ((0, applicability_1.shouldUseRule)(schema, rule)) {
            keywordCode(it, rule.keyword, rule.definition, group.type);
          }
        }
      });
    }
    function checkStrictTypes(it, types) {
      if (it.schemaEnv.meta || !it.opts.strictTypes)
        return;
      checkContextTypes(it, types);
      if (!it.opts.allowUnionTypes)
        checkMultipleTypes(it, types);
      checkKeywordTypes(it, it.dataTypes);
    }
    function checkContextTypes(it, types) {
      if (!types.length)
        return;
      if (!it.dataTypes.length) {
        it.dataTypes = types;
        return;
      }
      types.forEach((t) => {
        if (!includesType(it.dataTypes, t)) {
          strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
        }
      });
      narrowSchemaTypes(it, types);
    }
    function checkMultipleTypes(it, ts) {
      if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) {
        strictTypesError(it, "use allowUnionTypes to allow union type keyword");
      }
    }
    function checkKeywordTypes(it, ts) {
      const rules = it.self.RULES.all;
      for (const keyword in rules) {
        const rule = rules[keyword];
        if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
          const { type } = rule.definition;
          if (type.length && !type.some((t) => hasApplicableType(ts, t))) {
            strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
          }
        }
      }
    }
    function hasApplicableType(schTs, kwdT) {
      return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
    }
    function includesType(ts, t) {
      return ts.includes(t) || t === "integer" && ts.includes("number");
    }
    function narrowSchemaTypes(it, withTypes) {
      const ts = [];
      for (const t of it.dataTypes) {
        if (includesType(withTypes, t))
          ts.push(t);
        else if (withTypes.includes("integer") && t === "number")
          ts.push("integer");
      }
      it.dataTypes = ts;
    }
    function strictTypesError(it, msg) {
      const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
      msg += ` at "${schemaPath}" (strictTypes)`;
      (0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
    }
    var KeywordCxt = class {
      constructor(it, def, keyword) {
        (0, keyword_1.validateKeywordUsage)(it, def, keyword);
        this.gen = it.gen;
        this.allErrors = it.allErrors;
        this.keyword = keyword;
        this.data = it.data;
        this.schema = it.schema[keyword];
        this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
        this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
        this.schemaType = def.schemaType;
        this.parentSchema = it.schema;
        this.params = {};
        this.it = it;
        this.def = def;
        if (this.$data) {
          this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
        } else {
          this.schemaCode = this.schemaValue;
          if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) {
            throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
          }
        }
        if ("code" in def ? def.trackErrors : def.errors !== false) {
          this.errsCount = it.gen.const("_errs", names_1.default.errors);
        }
      }
      result(condition, successAction, failAction) {
        this.failResult((0, codegen_1.not)(condition), successAction, failAction);
      }
      failResult(condition, successAction, failAction) {
        this.gen.if(condition);
        if (failAction)
          failAction();
        else
          this.error();
        if (successAction) {
          this.gen.else();
          successAction();
          if (this.allErrors)
            this.gen.endIf();
        } else {
          if (this.allErrors)
            this.gen.endIf();
          else
            this.gen.else();
        }
      }
      pass(condition, failAction) {
        this.failResult((0, codegen_1.not)(condition), void 0, failAction);
      }
      fail(condition) {
        if (condition === void 0) {
          this.error();
          if (!this.allErrors)
            this.gen.if(false);
          return;
        }
        this.gen.if(condition);
        this.error();
        if (this.allErrors)
          this.gen.endIf();
        else
          this.gen.else();
      }
      fail$data(condition) {
        if (!this.$data)
          return this.fail(condition);
        const { schemaCode } = this;
        this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
      }
      error(append, errorParams, errorPaths) {
        if (errorParams) {
          this.setParams(errorParams);
          this._error(append, errorPaths);
          this.setParams({});
          return;
        }
        this._error(append, errorPaths);
      }
      _error(append, errorPaths) {
        ;
        (append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
      }
      $dataError() {
        (0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
      }
      reset() {
        if (this.errsCount === void 0)
          throw new Error('add "trackErrors" to keyword definition');
        (0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
      }
      ok(cond) {
        if (!this.allErrors)
          this.gen.if(cond);
      }
      setParams(obj, assign) {
        if (assign)
          Object.assign(this.params, obj);
        else
          this.params = obj;
      }
      block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
        this.gen.block(() => {
          this.check$data(valid, $dataValid);
          codeBlock();
        });
      }
      check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
        if (!this.$data)
          return;
        const { gen, schemaCode, schemaType, def } = this;
        gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
        if (valid !== codegen_1.nil)
          gen.assign(valid, true);
        if (schemaType.length || def.validateSchema) {
          gen.elseIf(this.invalid$data());
          this.$dataError();
          if (valid !== codegen_1.nil)
            gen.assign(valid, false);
        }
        gen.else();
      }
      invalid$data() {
        const { gen, schemaCode, schemaType, def, it } = this;
        return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
        function wrong$DataType() {
          if (schemaType.length) {
            if (!(schemaCode instanceof codegen_1.Name))
              throw new Error("ajv implementation error");
            const st = Array.isArray(schemaType) ? schemaType : [schemaType];
            return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
          }
          return codegen_1.nil;
        }
        function invalid$DataSchema() {
          if (def.validateSchema) {
            const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
            return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
          }
          return codegen_1.nil;
        }
      }
      subschema(appl, valid) {
        const subschema = (0, subschema_1.getSubschema)(this.it, appl);
        (0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
        (0, subschema_1.extendSubschemaMode)(subschema, appl);
        const nextContext = { ...this.it, ...subschema, items: void 0, props: void 0 };
        subschemaCode(nextContext, valid);
        return nextContext;
      }
      mergeEvaluated(schemaCxt, toName) {
        const { it, gen } = this;
        if (!it.opts.unevaluated)
          return;
        if (it.props !== true && schemaCxt.props !== void 0) {
          it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
        }
        if (it.items !== true && schemaCxt.items !== void 0) {
          it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
        }
      }
      mergeValidEvaluated(schemaCxt, valid) {
        const { it, gen } = this;
        if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
          gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
          return true;
        }
      }
    };
    exports.KeywordCxt = KeywordCxt;
    function keywordCode(it, keyword, def, ruleType) {
      const cxt = new KeywordCxt(it, def, keyword);
      if ("code" in def) {
        def.code(cxt, ruleType);
      } else if (cxt.$data && def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      } else if ("macro" in def) {
        (0, keyword_1.macroKeywordCode)(cxt, def);
      } else if (def.compile || def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      }
    }
    var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
    var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
    function getData($data, { dataLevel, dataNames, dataPathArr }) {
      let jsonPointer;
      let data;
      if ($data === "")
        return names_1.default.rootData;
      if ($data[0] === "/") {
        if (!JSON_POINTER.test($data))
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        jsonPointer = $data;
        data = names_1.default.rootData;
      } else {
        const matches = RELATIVE_JSON_POINTER.exec($data);
        if (!matches)
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        const up = +matches[1];
        jsonPointer = matches[2];
        if (jsonPointer === "#") {
          if (up >= dataLevel)
            throw new Error(errorMsg("property/index", up));
          return dataPathArr[dataLevel - up];
        }
        if (up > dataLevel)
          throw new Error(errorMsg("data", up));
        data = dataNames[dataLevel - up];
        if (!jsonPointer)
          return data;
      }
      let expr = data;
      const segments = jsonPointer.split("/");
      for (const segment of segments) {
        if (segment) {
          data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
          expr = (0, codegen_1._)`${expr} && ${data}`;
        }
      }
      return expr;
      function errorMsg(pointerType, up) {
        return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
      }
    }
    exports.getData = getData;
  }
});

// ../node_modules/ajv/dist/runtime/validation_error.js
var require_validation_error = __commonJS({
  "../node_modules/ajv/dist/runtime/validation_error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValidationError = class extends Error {
      constructor(errors) {
        super("validation failed");
        this.errors = errors;
        this.ajv = this.validation = true;
      }
    };
    exports.default = ValidationError;
  }
});

// ../node_modules/ajv/dist/compile/ref_error.js
var require_ref_error = __commonJS({
  "../node_modules/ajv/dist/compile/ref_error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var resolve_1 = require_resolve();
    var MissingRefError = class extends Error {
      constructor(resolver, baseId, ref, msg) {
        super(msg || `can't resolve reference ${ref} from id ${baseId}`);
        this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
        this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
      }
    };
    exports.default = MissingRefError;
  }
});

// ../node_modules/ajv/dist/compile/index.js
var require_compile = __commonJS({
  "../node_modules/ajv/dist/compile/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
    var codegen_1 = require_codegen();
    var validation_error_1 = require_validation_error();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var validate_1 = require_validate();
    var SchemaEnv = class {
      constructor(env) {
        var _a;
        this.refs = {};
        this.dynamicAnchors = {};
        let schema;
        if (typeof env.schema == "object")
          schema = env.schema;
        this.schema = env.schema;
        this.schemaId = env.schemaId;
        this.root = env.root || this;
        this.baseId = (_a = env.baseId) !== null && _a !== void 0 ? _a : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
        this.schemaPath = env.schemaPath;
        this.localRefs = env.localRefs;
        this.meta = env.meta;
        this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
        this.refs = {};
      }
    };
    exports.SchemaEnv = SchemaEnv;
    function compileSchema(sch) {
      const _sch = getCompilingSchema.call(this, sch);
      if (_sch)
        return _sch;
      const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
      const { es5, lines } = this.opts.code;
      const { ownProperties } = this.opts;
      const gen = new codegen_1.CodeGen(this.scope, { es5, lines, ownProperties });
      let _ValidationError;
      if (sch.$async) {
        _ValidationError = gen.scopeValue("Error", {
          ref: validation_error_1.default,
          code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
        });
      }
      const validateName = gen.scopeName("validate");
      sch.validateName = validateName;
      const schemaCxt = {
        gen,
        allErrors: this.opts.allErrors,
        data: names_1.default.data,
        parentData: names_1.default.parentData,
        parentDataProperty: names_1.default.parentDataProperty,
        dataNames: [names_1.default.data],
        dataPathArr: [codegen_1.nil],
        // TODO can its length be used as dataLevel if nil is removed?
        dataLevel: 0,
        dataTypes: [],
        definedProperties: /* @__PURE__ */ new Set(),
        topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? { ref: sch.schema, code: (0, codegen_1.stringify)(sch.schema) } : { ref: sch.schema }),
        validateName,
        ValidationError: _ValidationError,
        schema: sch.schema,
        schemaEnv: sch,
        rootId,
        baseId: sch.baseId || rootId,
        schemaPath: codegen_1.nil,
        errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
        errorPath: (0, codegen_1._)`""`,
        opts: this.opts,
        self: this
      };
      let sourceCode;
      try {
        this._compilations.add(sch);
        (0, validate_1.validateFunctionCode)(schemaCxt);
        gen.optimize(this.opts.code.optimize);
        const validateCode = gen.toString();
        sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
        if (this.opts.code.process)
          sourceCode = this.opts.code.process(sourceCode, sch);
        const makeValidate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode);
        const validate2 = makeValidate(this, this.scope.get());
        this.scope.value(validateName, { ref: validate2 });
        validate2.errors = null;
        validate2.schema = sch.schema;
        validate2.schemaEnv = sch;
        if (sch.$async)
          validate2.$async = true;
        if (this.opts.code.source === true) {
          validate2.source = { validateName, validateCode, scopeValues: gen._values };
        }
        if (this.opts.unevaluated) {
          const { props, items } = schemaCxt;
          validate2.evaluated = {
            props: props instanceof codegen_1.Name ? void 0 : props,
            items: items instanceof codegen_1.Name ? void 0 : items,
            dynamicProps: props instanceof codegen_1.Name,
            dynamicItems: items instanceof codegen_1.Name
          };
          if (validate2.source)
            validate2.source.evaluated = (0, codegen_1.stringify)(validate2.evaluated);
        }
        sch.validate = validate2;
        return sch;
      } catch (e) {
        delete sch.validate;
        delete sch.validateName;
        if (sourceCode)
          this.logger.error("Error compiling schema, function code:", sourceCode);
        throw e;
      } finally {
        this._compilations.delete(sch);
      }
    }
    exports.compileSchema = compileSchema;
    function resolveRef(root, baseId, ref) {
      var _a;
      ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
      const schOrFunc = root.refs[ref];
      if (schOrFunc)
        return schOrFunc;
      let _sch = resolve2.call(this, root, ref);
      if (_sch === void 0) {
        const schema = (_a = root.localRefs) === null || _a === void 0 ? void 0 : _a[ref];
        const { schemaId } = this.opts;
        if (schema)
          _sch = new SchemaEnv({ schema, schemaId, root, baseId });
      }
      if (_sch === void 0)
        return;
      return root.refs[ref] = inlineOrCompile.call(this, _sch);
    }
    exports.resolveRef = resolveRef;
    function inlineOrCompile(sch) {
      if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs))
        return sch.schema;
      return sch.validate ? sch : compileSchema.call(this, sch);
    }
    function getCompilingSchema(schEnv) {
      for (const sch of this._compilations) {
        if (sameSchemaEnv(sch, schEnv))
          return sch;
      }
    }
    exports.getCompilingSchema = getCompilingSchema;
    function sameSchemaEnv(s1, s2) {
      return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
    }
    function resolve2(root, ref) {
      let sch;
      while (typeof (sch = this.refs[ref]) == "string")
        ref = sch;
      return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
    }
    function resolveSchema(root, ref) {
      const p = this.opts.uriResolver.parse(ref);
      const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
      let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, void 0);
      if (Object.keys(root.schema).length > 0 && refPath === baseId) {
        return getJsonPointer.call(this, p, root);
      }
      const id = (0, resolve_1.normalizeId)(refPath);
      const schOrRef = this.refs[id] || this.schemas[id];
      if (typeof schOrRef == "string") {
        const sch = resolveSchema.call(this, root, schOrRef);
        if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object")
          return;
        return getJsonPointer.call(this, p, sch);
      }
      if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object")
        return;
      if (!schOrRef.validate)
        compileSchema.call(this, schOrRef);
      if (id === (0, resolve_1.normalizeId)(ref)) {
        const { schema } = schOrRef;
        const { schemaId } = this.opts;
        const schId = schema[schemaId];
        if (schId)
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        return new SchemaEnv({ schema, schemaId, root, baseId });
      }
      return getJsonPointer.call(this, p, schOrRef);
    }
    exports.resolveSchema = resolveSchema;
    var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
      "properties",
      "patternProperties",
      "enum",
      "dependencies",
      "definitions"
    ]);
    function getJsonPointer(parsedRef, { baseId, schema, root }) {
      var _a;
      if (((_a = parsedRef.fragment) === null || _a === void 0 ? void 0 : _a[0]) !== "/")
        return;
      for (const part of parsedRef.fragment.slice(1).split("/")) {
        if (typeof schema === "boolean")
          return;
        const partSchema = schema[(0, util_1.unescapeFragment)(part)];
        if (partSchema === void 0)
          return;
        schema = partSchema;
        const schId = typeof schema === "object" && schema[this.opts.schemaId];
        if (!PREVENT_SCOPE_CHANGE.has(part) && schId) {
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        }
      }
      let env;
      if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
        const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
        env = resolveSchema.call(this, root, $ref);
      }
      const { schemaId } = this.opts;
      env = env || new SchemaEnv({ schema, schemaId, root, baseId });
      if (env.schema !== env.root.schema)
        return env;
      return void 0;
    }
  }
});

// ../node_modules/ajv/dist/refs/data.json
var require_data = __commonJS({
  "../node_modules/ajv/dist/refs/data.json"(exports, module) {
    module.exports = {
      $id: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
      description: "Meta-schema for $data reference (JSON AnySchema extension proposal)",
      type: "object",
      required: ["$data"],
      properties: {
        $data: {
          type: "string",
          anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }]
        }
      },
      additionalProperties: false
    };
  }
});

// ../node_modules/fast-uri/lib/utils.js
var require_utils = __commonJS({
  "../node_modules/fast-uri/lib/utils.js"(exports, module) {
    "use strict";
    var isUUID = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu);
    var isIPv4 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
    var isPort = RegExp.prototype.test.bind(/^\d*$/u);
    var isHexPair = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu);
    var isUnreserved = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu);
    var isPathCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/]$/u);
    var isQueryFragmentCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/?]$/u);
    var isUserinfoCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:]$/u);
    var BYTE_HEX = new Array(256);
    {
      const HEX_DIGITS = "0123456789ABCDEF";
      for (let i = 0; i < 256; i++) {
        BYTE_HEX[i] = "%" + HEX_DIGITS[i >> 4] + HEX_DIGITS[i & 15];
      }
    }
    function percentEncodeNonAscii(cp) {
      if (cp < 2048) {
        return BYTE_HEX[192 | cp >> 6] + BYTE_HEX[128 | cp & 63];
      }
      if (cp < 65536) {
        return BYTE_HEX[224 | cp >> 12] + BYTE_HEX[128 | cp >> 6 & 63] + BYTE_HEX[128 | cp & 63];
      }
      return BYTE_HEX[240 | cp >> 18] + BYTE_HEX[128 | cp >> 12 & 63] + BYTE_HEX[128 | cp >> 6 & 63] + BYTE_HEX[128 | cp & 63];
    }
    function stringArrayToHexStripped(input) {
      let acc = "";
      let code = 0;
      let i = 0;
      for (i = 0; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (code === 48) {
          continue;
        }
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
        break;
      }
      for (i += 1; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
      }
      return acc;
    }
    var isHextet = RegExp.prototype.test.bind(/^[\dA-Fa-f]{1,4}$/);
    var isIPvFuture = RegExp.prototype.test.bind(/^[vV][\dA-Fa-f]+\.[A-Za-z\d\-._~!$&'()*+,;=:]+$/);
    var isZoneCharacter = RegExp.prototype.test.bind(/^[A-Za-z\d\-._~]$/);
    var nonSimpleDomain = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
    function isZoneIdentifier(zone) {
      if (zone.length === 0) return false;
      for (let i = 0; i < zone.length; i++) {
        if (isZoneCharacter(zone[i])) continue;
        if (zone[i] === "%" && i + 2 < zone.length && isHexPair(zone.slice(i + 1, i + 3))) {
          i += 2;
          continue;
        }
        return false;
      }
      return true;
    }
    function compressIPv6ZeroRun(hextets) {
      let bestStart = -1;
      let bestLength = 0;
      let runStart = -1;
      let runLength = 0;
      for (let i = 0; i < hextets.length; i++) {
        if (hextets[i] === "0") {
          if (runStart === -1) runStart = i;
          runLength++;
          if (runLength > bestLength) {
            bestLength = runLength;
            bestStart = runStart;
          }
        } else {
          runStart = -1;
          runLength = 0;
        }
      }
      if (bestLength < 2) return hextets.join(":");
      const head = hextets.slice(0, bestStart).join(":");
      const tail2 = hextets.slice(bestStart + bestLength).join(":");
      return head + "::" + tail2;
    }
    function normalizeIPv6Address(input) {
      const compression = input.indexOf("::");
      if (compression !== -1 && input.indexOf("::", compression + 1) !== -1) return void 0;
      const left = compression === -1 ? input.split(":") : input.slice(0, compression).split(":");
      const right = compression === -1 ? [] : input.slice(compression + 2).split(":");
      if (compression !== -1) {
        if (left.length === 1 && left[0] === "") left.length = 0;
        if (right.length === 1 && right[0] === "") right.length = 0;
      }
      const parts = left.concat(right);
      let hextetCount = 0;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part === "") return void 0;
        if (part.indexOf(".") !== -1) {
          if (i !== parts.length - 1 || compression !== -1 && right.length === 0 || !isIPv4(part)) return void 0;
          hextetCount += 2;
          continue;
        }
        if (!isHextet(part)) return void 0;
        parts[i] = parseInt(part, 16).toString(16);
        hextetCount++;
      }
      if (compression === -1) {
        if (hextetCount !== 8) return void 0;
        return compressIPv6ZeroRun(parts);
      }
      if (hextetCount >= 8) return void 0;
      const expanded = parts.slice(0, left.length);
      for (let i = hextetCount; i < 8; i++) expanded.push("0");
      for (let i = left.length; i < parts.length; i++) expanded.push(parts[i]);
      return compressIPv6ZeroRun(expanded);
    }
    function normalizeIPv6(host) {
      const bracketed = host[0] === "[" && host[host.length - 1] === "]";
      const hasBracket = host[0] === "[" || host[host.length - 1] === "]";
      if (hasBracket && !bracketed) return { host, isIPV6: false, error: true };
      let input = bracketed ? host.slice(1, -1) : host;
      if (bracketed && isIPvFuture(input)) {
        input = input.toLowerCase();
        return { host: `[${input}]`, escapedHost: input, isIPV6: false, isIPVFuture: true };
      }
      if (findToken(input, ":") < 2) {
        return { host, isIPV6: false, error: bracketed };
      }
      let zoneIdentifier = "";
      const zoneSeparator = input.indexOf("%");
      if (zoneSeparator !== -1) {
        const separatorLength = input.slice(zoneSeparator, zoneSeparator + 3).toLowerCase() === "%25" ? 3 : 1;
        zoneIdentifier = input.slice(zoneSeparator + separatorLength);
        if (!isZoneIdentifier(zoneIdentifier)) return { host, isIPV6: false, error: true };
        input = input.slice(0, zoneSeparator);
      }
      const address = normalizeIPv6Address(input);
      if (address === void 0) return { host, isIPV6: false, error: true };
      return {
        host: address + (zoneIdentifier ? "%" + zoneIdentifier : ""),
        escapedHost: address + (zoneIdentifier ? "%25" + zoneIdentifier : ""),
        isIPV6: true
      };
    }
    function findToken(str, token) {
      let ind = 0;
      for (let i = 0; i < str.length; i++) {
        if (str[i] === token) ind++;
      }
      return ind;
    }
    function removeDotSegments(path2) {
      let input = path2;
      const output = [];
      let nextSlash = -1;
      let len = 0;
      while (len = input.length) {
        if (len === 1) {
          if (input === ".") {
            break;
          } else if (input === "/") {
            output.push("/");
            break;
          } else {
            output.push(input);
            break;
          }
        } else if (len === 2) {
          if (input[0] === ".") {
            if (input[1] === ".") {
              break;
            } else if (input[1] === "/") {
              input = input.slice(2);
              continue;
            }
          } else if (input[0] === "/") {
            if (input[1] === "." || input[1] === "/") {
              output.push("/");
              break;
            }
          }
        } else if (len === 3) {
          if (input === "/..") {
            if (output.length !== 0) {
              output.pop();
            }
            output.push("/");
            break;
          }
        }
        if (input[0] === ".") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(3);
              continue;
            }
          } else if (input[1] === "/") {
            input = input.slice(2);
            continue;
          }
        } else if (input[0] === "/") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(2);
              continue;
            } else if (input[2] === ".") {
              if (input[3] === "/") {
                input = input.slice(3);
                if (output.length !== 0) {
                  output.pop();
                }
                continue;
              }
            }
          }
        }
        if ((nextSlash = input.indexOf("/", 1)) === -1) {
          output.push(input);
          break;
        } else {
          output.push(input.slice(0, nextSlash));
          input = input.slice(nextSlash);
        }
      }
      return output.join("");
    }
    function removeDotSegmentsRelative(path2) {
      if (path2 === "" || path2[0] === "/") {
        return removeDotSegments(path2);
      }
      const segments = path2.split("/");
      const last = segments.length - 1;
      const output = [];
      let trailingDirectory = false;
      for (let i = 0; i <= last; i++) {
        const segment = segments[i];
        if (segment === "." || segment === "..") {
          if (segment === "..") {
            if (output.length !== 0 && output[output.length - 1] !== "..") {
              output.pop();
            } else {
              output.push("..");
            }
          }
          trailingDirectory = i === last;
        } else {
          output.push(segment);
        }
      }
      if (trailingDirectory && output[output.length - 1] !== "..") {
        output.push("");
      }
      if (output.length === 0 || output[0] === "" || output[0].includes(":")) {
        output.unshift(".");
      }
      return output.join("/");
    }
    var HOST_DELIMS = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" };
    var HOST_DELIM_RE = /[@/?#:]/g;
    var HOST_DELIM_NO_COLON_RE = /[@/?#]/g;
    function reescapeHostDelimiters(host, isIP) {
      const re = isIP ? HOST_DELIM_NO_COLON_RE : HOST_DELIM_RE;
      re.lastIndex = 0;
      return host.replace(re, (ch) => HOST_DELIMS[ch]);
    }
    function normalizePercentEncoding(input, decodeUnreserved = false) {
      if (input.indexOf("%") === -1) {
        return input;
      }
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (decodeUnreserved && isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        output += input[i];
      }
      return output;
    }
    function normalizePathEncoding(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (decoded !== "." && isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        if (isPathCharacter(ch)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += isEscapeSafe(code) ? ch : BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function serializePathEncoding(input, pathNoScheme = false) {
      let output = "";
      let firstSegment = pathNoScheme && input[0] !== "/";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        if (ch === "/") {
          firstSegment = false;
        }
        if (isPathCharacter(ch) && (ch !== ":" || !firstSegment)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function encodeComponent(input, isAllowed) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        if (isAllowed(ch)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function encodeUserinfo(input) {
      return encodeComponent(input, isUserinfoCharacter);
    }
    function encodeQuery(input) {
      return encodeComponent(input, isQueryFragmentCharacter);
    }
    function encodeFragment(input) {
      return encodeComponent(input, isQueryFragmentCharacter);
    }
    function isEscapeSafe(cp) {
      return cp >= 48 && cp <= 57 || cp >= 65 && cp <= 90 || cp >= 97 && cp <= 122 || cp === 42 || cp === 43 || cp === 45 || cp === 46 || cp === 47 || cp === 64 || cp === 95;
    }
    function normalizeQueryFragmentEncoding(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        if (isQueryFragmentCharacter(ch)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += isEscapeSafe(code) ? ch : BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function escapePreservingEscapes(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        output += escape(input[i]);
      }
      return output;
    }
    function recomposeAuthority(component) {
      const uriTokens = [];
      if (component.userinfo !== void 0) {
        uriTokens.push(encodeUserinfo(component.userinfo));
        uriTokens.push("@");
      }
      if (component.host !== void 0) {
        let host = component.host;
        if (!isIPv4(host)) {
          let ipV6res = normalizeIPv6(host);
          if (ipV6res.isIPV6 !== true && ipV6res.isIPVFuture !== true) {
            host = normalizePercentEncoding(host, true);
            ipV6res = normalizeIPv6(host);
          }
          if (ipV6res.isIPV6 === true || ipV6res.isIPVFuture === true) {
            host = `[${ipV6res.escapedHost}]`;
          } else {
            host = reescapeHostDelimiters(host, false);
          }
        }
        uriTokens.push(host);
      }
      if (typeof component.port === "number" || typeof component.port === "string") {
        const port = String(component.port);
        if (!isPort(port)) {
          throw new TypeError("URI port is malformed.");
        }
        uriTokens.push(":");
        uriTokens.push(port);
      }
      return uriTokens.length ? uriTokens.join("") : void 0;
    }
    module.exports = {
      nonSimpleDomain,
      recomposeAuthority,
      reescapeHostDelimiters,
      normalizePercentEncoding,
      normalizePathEncoding,
      serializePathEncoding,
      normalizeQueryFragmentEncoding,
      encodeUserinfo,
      encodeQuery,
      encodeFragment,
      escapePreservingEscapes,
      removeDotSegments,
      removeDotSegmentsRelative,
      isIPv4,
      isUUID,
      normalizeIPv6,
      stringArrayToHexStripped
    };
  }
});

// ../node_modules/fast-uri/lib/schemes.js
var require_schemes = __commonJS({
  "../node_modules/fast-uri/lib/schemes.js"(exports, module) {
    "use strict";
    var { isUUID } = require_utils();
    var URN_REG = /^([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-./:;=@]|%[\da-f]{2})+)$/iu;
    var supportedSchemeNames = (
      /** @type {const} */
      [
        "http",
        "https",
        "ws",
        "wss",
        "urn",
        "urn:uuid"
      ]
    );
    function isValidSchemeName(name) {
      return supportedSchemeNames.indexOf(
        /** @type {*} */
        name
      ) !== -1;
    }
    function wsIsSecure(wsComponent) {
      if (wsComponent.secure === true) {
        return true;
      } else if (wsComponent.secure === false) {
        return false;
      } else if (wsComponent.scheme) {
        return wsComponent.scheme.length === 3 && (wsComponent.scheme[0] === "w" || wsComponent.scheme[0] === "W") && (wsComponent.scheme[1] === "s" || wsComponent.scheme[1] === "S") && (wsComponent.scheme[2] === "s" || wsComponent.scheme[2] === "S");
      } else {
        return false;
      }
    }
    function httpParse(component) {
      if (!component.host) {
        component.error = component.error || "HTTP URIs must have a host.";
      }
      return component;
    }
    function httpSerialize(component) {
      const secure = String(component.scheme).toLowerCase() === "https";
      if (component.port === (secure ? 443 : 80) || component.port === "") {
        component.port = void 0;
      }
      if (!component.path) {
        component.path = "/";
      }
      return component;
    }
    function wsParse(wsComponent) {
      wsComponent.secure = wsIsSecure(wsComponent);
      wsComponent.resourceName = (wsComponent.path || "/") + (wsComponent.query ? "?" + wsComponent.query : "");
      wsComponent.path = void 0;
      wsComponent.query = void 0;
      return wsComponent;
    }
    function wsSerialize(wsComponent) {
      if (wsComponent.port === (wsIsSecure(wsComponent) ? 443 : 80) || wsComponent.port === "") {
        wsComponent.port = void 0;
      }
      if (typeof wsComponent.secure === "boolean") {
        wsComponent.scheme = wsComponent.secure ? "wss" : "ws";
        wsComponent.secure = void 0;
      }
      if (wsComponent.resourceName) {
        const queryIndex = wsComponent.resourceName.indexOf("?");
        const path2 = queryIndex === -1 ? wsComponent.resourceName : wsComponent.resourceName.slice(0, queryIndex);
        wsComponent.path = path2 && path2 !== "/" ? path2 : void 0;
        wsComponent.query = queryIndex === -1 ? void 0 : wsComponent.resourceName.slice(queryIndex + 1);
        wsComponent.resourceName = void 0;
      }
      wsComponent.fragment = void 0;
      return wsComponent;
    }
    function urnParse(urnComponent, options) {
      if (!urnComponent.path) {
        urnComponent.error = "URN can not be parsed";
        return urnComponent;
      }
      const matches = urnComponent.path.match(URN_REG);
      if (matches && matches[0] === urnComponent.path) {
        const scheme = options.scheme || urnComponent.scheme || "urn";
        urnComponent.nid = matches[1].toLowerCase();
        urnComponent.nss = matches[2];
        const urnScheme = `${scheme}:${options.nid || urnComponent.nid}`;
        const schemeHandler = getSchemeHandler(urnScheme);
        urnComponent.path = void 0;
        if (schemeHandler) {
          urnComponent = schemeHandler.parse(urnComponent, options);
        }
      } else {
        urnComponent.error = urnComponent.error || "URN can not be parsed.";
      }
      return urnComponent;
    }
    function urnSerialize(urnComponent, options) {
      if (urnComponent.nid === void 0) {
        throw new Error("URN without nid cannot be serialized");
      }
      const scheme = options.scheme || urnComponent.scheme || "urn";
      const nid = urnComponent.nid.toLowerCase();
      const urnScheme = `${scheme}:${options.nid || nid}`;
      const schemeHandler = getSchemeHandler(urnScheme);
      if (schemeHandler) {
        urnComponent = schemeHandler.serialize(urnComponent, options);
      }
      const uriComponent = urnComponent;
      const nss = urnComponent.nss;
      uriComponent.path = `${nid || options.nid}:${nss}`;
      options.skipEscape = true;
      return uriComponent;
    }
    function urnuuidParse(urnComponent, options) {
      const uuidComponent = urnComponent;
      uuidComponent.uuid = uuidComponent.nss;
      uuidComponent.nss = void 0;
      if (!options.tolerant && (!uuidComponent.uuid || !isUUID(uuidComponent.uuid))) {
        uuidComponent.error = uuidComponent.error || "UUID is not valid.";
      }
      return uuidComponent;
    }
    function urnuuidSerialize(uuidComponent) {
      const urnComponent = uuidComponent;
      urnComponent.nss = (uuidComponent.uuid || "").toLowerCase();
      return urnComponent;
    }
    var http = (
      /** @type {SchemeHandler} */
      {
        scheme: "http",
        domainHost: true,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var https = (
      /** @type {SchemeHandler} */
      {
        scheme: "https",
        domainHost: http.domainHost,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var ws = (
      /** @type {SchemeHandler} */
      {
        scheme: "ws",
        domainHost: true,
        parse: wsParse,
        serialize: wsSerialize
      }
    );
    var wss = (
      /** @type {SchemeHandler} */
      {
        scheme: "wss",
        domainHost: ws.domainHost,
        parse: ws.parse,
        serialize: ws.serialize
      }
    );
    var urn = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn",
        parse: urnParse,
        serialize: urnSerialize,
        skipNormalize: true
      }
    );
    var urnuuid = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn:uuid",
        parse: urnuuidParse,
        serialize: urnuuidSerialize,
        skipNormalize: true
      }
    );
    var SCHEMES = (
      /** @type {Record<SchemeName, SchemeHandler>} */
      {
        http,
        https,
        ws,
        wss,
        urn,
        "urn:uuid": urnuuid
      }
    );
    Object.setPrototypeOf(SCHEMES, null);
    function getSchemeHandler(scheme) {
      return scheme && (SCHEMES[
        /** @type {SchemeName} */
        scheme
      ] || SCHEMES[
        /** @type {SchemeName} */
        scheme.toLowerCase()
      ]) || void 0;
    }
    module.exports = {
      wsIsSecure,
      SCHEMES,
      isValidSchemeName,
      getSchemeHandler
    };
  }
});

// ../node_modules/fast-uri/index.js
var require_fast_uri = __commonJS({
  "../node_modules/fast-uri/index.js"(exports, module) {
    "use strict";
    var { normalizeIPv6, removeDotSegments, removeDotSegmentsRelative, recomposeAuthority, normalizePercentEncoding, normalizePathEncoding, serializePathEncoding, normalizeQueryFragmentEncoding, encodeQuery, encodeFragment, reescapeHostDelimiters, isIPv4, nonSimpleDomain } = require_utils();
    var { SCHEMES, getSchemeHandler } = require_schemes();
    var VALID_SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*$/u;
    var MALFORMED_SCHEME_ERROR = "URI scheme is malformed.";
    var MALFORMED_HOST_ERROR = "URI host is malformed.";
    var FORBIDDEN_DOMAIN_HOST_CHARACTER = /[\0-\x20"#/:<>?@[\\\]^`{|}\x7F]/u;
    function validateScheme(scheme) {
      const stringScheme = String(scheme);
      if (!VALID_SCHEME.test(stringScheme)) {
        throw new TypeError(MALFORMED_SCHEME_ERROR);
      }
      return stringScheme;
    }
    function normalize3(uri, options) {
      if (typeof uri === "string") {
        uri = /** @type {T} */
        normalizeString(uri, options);
      } else if (typeof uri === "object") {
        uri = /** @type {T} */
        parse3(serialize(uri, options), options);
      }
      return uri;
    }
    function resolve2(baseURI, relativeURI, options) {
      const schemelessOptions = options ? Object.assign({ scheme: "null" }, options) : { scheme: "null" };
      const {
        parsed: baseParsed,
        malformedAuthorityOrPort: baseMalformed,
        malformedPercentEncoding: baseMalformedPercentEncoding,
        malformedSchemeSpecific: baseMalformedSchemeSpecific,
        malformedHost: baseMalformedHost,
        malformedScheme: baseMalformedScheme
      } = parseWithStatus(baseURI, schemelessOptions);
      const {
        parsed: relativeParsed,
        malformedAuthorityOrPort: relativeMalformed,
        malformedPercentEncoding: relativeMalformedPercentEncoding,
        malformedSchemeSpecific: relativeMalformedSchemeSpecific,
        malformedHost: relativeMalformedHost,
        malformedScheme: relativeMalformedScheme
      } = parseWithStatus(relativeURI, schemelessOptions);
      if (baseMalformed || relativeMalformed || baseMalformedPercentEncoding || relativeMalformedPercentEncoding || baseMalformedSchemeSpecific || relativeMalformedSchemeSpecific || baseMalformedHost || relativeMalformedHost || baseMalformedScheme || relativeMalformedScheme) {
        throw new Error(baseParsed.error || relativeParsed.error || "URI is malformed.");
      }
      const resolved = resolveComponent(baseParsed, relativeParsed, schemelessOptions, true);
      const resolvedSchemeHandler = getSchemeHandler(options && options.scheme || resolved.scheme);
      const resolvedHost = resolved.host;
      const resolvedHostIsIP = resolvedHost !== void 0 && resolvedHost !== "" && (isIPv4(resolvedHost) || normalizeIPv6(resolvedHost).isIPV6);
      if (hasForbiddenDomainHost(resolved, options || {}, resolvedSchemeHandler, resolvedHostIsIP)) {
        throw new Error(MALFORMED_HOST_ERROR);
      }
      canonicalizeHost(resolved, options || {}, resolvedSchemeHandler, resolvedHostIsIP);
      const encodedASCIIHost = resolvedHost && resolvedHost.indexOf("%") !== -1 && !new RegExp("\\P{ASCII}", "u").test(resolvedHost);
      if (resolved.error && !encodedASCIIHost) {
        throw new Error(resolved.error);
      }
      schemelessOptions.skipEscape = true;
      return serialize(resolved, schemelessOptions);
    }
    function resolveComponent(base, relative3, options, skipNormalization) {
      const target = {};
      if (!skipNormalization) {
        base = parse3(serialize(base, options), options);
        relative3 = parse3(serialize(relative3, options), options);
      }
      options = options || {};
      if (!options.tolerant && relative3.scheme) {
        target.scheme = relative3.scheme;
        target.userinfo = relative3.userinfo;
        target.host = relative3.host;
        target.port = relative3.port;
        target.path = removeDotSegments(relative3.path || "");
        target.query = relative3.query;
      } else {
        if (relative3.userinfo !== void 0 || relative3.host !== void 0 || relative3.port !== void 0) {
          target.userinfo = relative3.userinfo;
          target.host = relative3.host;
          target.port = relative3.port;
          target.path = removeDotSegments(relative3.path || "");
          target.query = relative3.query;
        } else {
          if (!relative3.path) {
            target.path = base.path;
            if (relative3.query !== void 0) {
              target.query = relative3.query;
            } else {
              target.query = base.query;
            }
          } else {
            if (relative3.path[0] === "/") {
              target.path = removeDotSegments(relative3.path);
            } else {
              const baseHasAuthority = base.userinfo !== void 0 || base.host !== void 0 || base.port !== void 0;
              if (baseHasAuthority && !base.path) {
                target.path = "/" + relative3.path;
              } else if (!base.path) {
                target.path = relative3.path;
              } else {
                target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative3.path;
              }
              target.path = base.scheme === void 0 && !baseHasAuthority && target.path[0] !== "/" ? removeDotSegmentsRelative(target.path) : removeDotSegments(target.path);
            }
            target.query = relative3.query;
          }
          target.userinfo = base.userinfo;
          target.host = base.host;
          target.port = base.port;
        }
        target.scheme = base.scheme;
      }
      target.fragment = relative3.fragment;
      return target;
    }
    function equal(uriA, uriB, options) {
      const normalizedA = normalizeComparableURI(uriA, options);
      const normalizedB = normalizeComparableURI(uriB, options);
      return normalizedA !== void 0 && normalizedB !== void 0 && normalizedA === normalizedB;
    }
    function serialize(cmpts, opts) {
      const component = {
        host: cmpts.host,
        scheme: cmpts.scheme,
        userinfo: cmpts.userinfo,
        port: cmpts.port,
        path: cmpts.path,
        query: cmpts.query,
        nid: cmpts.nid,
        nss: cmpts.nss,
        uuid: cmpts.uuid,
        fragment: cmpts.fragment,
        reference: cmpts.reference,
        resourceName: cmpts.resourceName,
        secure: cmpts.secure,
        error: ""
      };
      const options = Object.assign({}, opts);
      const uriTokens = [];
      if (component.scheme) {
        component.scheme = validateScheme(component.scheme);
      }
      const schemeHandler = getSchemeHandler(options.scheme || component.scheme);
      if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(component, options);
      const hasAuthority = component.userinfo !== void 0 || component.host !== void 0 || component.port !== void 0;
      const schemelessReference = (component.scheme === void 0 || options.reference === "suffix") && !hasAuthority;
      const pathNoScheme = !options.skipEscape && schemelessReference;
      if (component.path !== void 0) {
        if (!options.skipEscape) {
          component.path = serializePathEncoding(component.path, pathNoScheme);
        } else {
          component.path = normalizePercentEncoding(component.path);
        }
      }
      if (options.reference !== "suffix" && component.scheme) {
        component.scheme = validateScheme(component.scheme);
        uriTokens.push(component.scheme, ":");
      }
      const authority = recomposeAuthority(component);
      if (authority !== void 0) {
        if (options.reference !== "suffix") {
          uriTokens.push("//");
        }
        uriTokens.push(authority);
        if (component.path && component.path[0] !== "/") {
          uriTokens.push("/");
        }
      }
      if (component.path !== void 0) {
        let s = component.path;
        if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
          s = schemelessReference && s[0] !== "/" ? removeDotSegmentsRelative(s) : removeDotSegments(s);
        }
        if (schemelessReference) {
          s = serializePathEncoding(s, true);
        }
        if (authority === void 0 && s[0] === "/" && s[1] === "/") {
          s = "/%2F" + s.slice(2);
        }
        uriTokens.push(s);
      }
      if (component.query !== void 0) {
        uriTokens.push("?", encodeQuery(component.query));
      }
      if (component.fragment !== void 0) {
        uriTokens.push("#", encodeFragment(component.fragment));
      }
      return uriTokens.join("");
    }
    var URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
    var AUTHORITY_PREFIX = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/;
    var AUTHORITY_INTRODUCER_REGION = /^(?:[^#/:?]+:)?([/\\\t\n\r]*)/;
    function getParseError(parsed, matches) {
      if (matches[2] !== void 0 && parsed.path && parsed.path[0] !== "/") {
        return 'URI path must start with "/" when authority is present.';
      }
      if (typeof parsed.port === "number" && (parsed.port < 0 || parsed.port > 65535)) {
        return "URI port is malformed.";
      }
      return void 0;
    }
    function hasMalformedPercentEncoding(component) {
      if (component === void 0) return false;
      let percent = component.indexOf("%");
      while (percent !== -1) {
        if (percent + 2 >= component.length || !/^[\da-f]{2}$/iu.test(component.slice(percent + 1, percent + 3))) {
          return true;
        }
        percent = component.indexOf("%", percent + 3);
      }
      return false;
    }
    function isIPLiteral(host) {
      return host[0] === "[" && host[host.length - 1] === "]";
    }
    function hasMalformedComponentPercentEncoding(matches) {
      const host = matches[4];
      return hasMalformedPercentEncoding(matches[3]) || host !== void 0 && !isIPLiteral(host) && hasMalformedPercentEncoding(host) || hasMalformedPercentEncoding(matches[6]) || hasMalformedPercentEncoding(matches[7]) || hasMalformedPercentEncoding(matches[8]);
    }
    function canonicalizeHost(parsed, options, schemeHandler, isIP) {
      if (hasForbiddenDomainHost(parsed, options, schemeHandler, isIP)) {
        parsed.error = parsed.error || MALFORMED_HOST_ERROR;
        return true;
      }
      if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport) && parsed.host && !isIPLiteral(parsed.host) && (options.domainHost || schemeHandler && schemeHandler.domainHost) && isIP === false && nonSimpleDomain(parsed.host)) {
        let url;
        try {
          url = new URL("http://" + parsed.host);
        } catch (e) {
          parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
          return true;
        }
        if (!isHostOnlyURL(url)) {
          parsed.error = parsed.error || MALFORMED_HOST_ERROR;
          return true;
        }
        parsed.host = url.hostname;
      }
      return false;
    }
    function hasForbiddenDomainHost(parsed, options, schemeHandler, isIP) {
      return Boolean(
        parsed.host && isIP === false && !isIPLiteral(parsed.host) && (options.domainHost || schemeHandler && schemeHandler.domainHost) && FORBIDDEN_DOMAIN_HOST_CHARACTER.test(parsed.host)
      );
    }
    function isHostOnlyURL(url) {
      return url.username === "" && url.password === "" && url.port === "" && url.pathname === "/" && url.search === "" && url.hash === "" && url.hostname !== "";
    }
    function parseWithStatus(uri, opts) {
      const options = Object.assign({}, opts);
      const parsed = {
        scheme: void 0,
        userinfo: void 0,
        host: "",
        port: void 0,
        path: "",
        query: void 0,
        fragment: void 0
      };
      let malformedAuthorityOrPort = false;
      let malformedPercentEncoding = false;
      let malformedSchemeSpecific = false;
      let malformedHost = false;
      let malformedIPLiteral = false;
      let malformedScheme = false;
      let isIP = false;
      if (options.reference === "suffix") {
        if (options.scheme) {
          uri = options.scheme + ":" + uri;
        } else {
          uri = "//" + uri;
        }
      }
      const authorityMatch = uri.match(AUTHORITY_PREFIX);
      if (authorityMatch !== null && authorityMatch[1].indexOf("\\") !== -1) {
        parsed.error = "URI authority must not contain a literal backslash.";
        malformedAuthorityOrPort = true;
      }
      const introducerMatch = uri.match(AUTHORITY_INTRODUCER_REGION);
      if (introducerMatch !== null) {
        const region = introducerMatch[1];
        const normalizedRegion = region.replace(/[\t\n\r]/g, "");
        if (normalizedRegion.length >= 2) {
          if (normalizedRegion.slice(0, 2) !== "//") {
            parsed.error = parsed.error || "URI authority must not contain a literal backslash.";
            malformedAuthorityOrPort = true;
          } else if (region.length !== normalizedRegion.length) {
            parsed.error = parsed.error || "URI authority introducer must not contain whitespace.";
            malformedAuthorityOrPort = true;
          }
        }
      }
      const matches = uri.match(URI_PARSE);
      if (matches) {
        parsed.scheme = matches[1];
        parsed.userinfo = matches[3];
        parsed.host = matches[4];
        parsed.port = parseInt(matches[5], 10);
        parsed.path = matches[6] || "";
        parsed.query = matches[7];
        parsed.fragment = matches[8];
        if (parsed.scheme !== void 0) {
          if (VALID_SCHEME.test(parsed.scheme)) {
            parsed.scheme = parsed.scheme.toLowerCase();
          } else {
            parsed.error = parsed.error || MALFORMED_SCHEME_ERROR;
            malformedScheme = true;
          }
        }
        malformedPercentEncoding = hasMalformedComponentPercentEncoding(matches);
        if (malformedPercentEncoding) {
          parsed.error = parsed.error || "URI contains malformed percent-encoding.";
        }
        if (isNaN(parsed.port)) {
          parsed.port = matches[5];
        }
        const parseError = getParseError(parsed, matches);
        if (parseError !== void 0) {
          parsed.error = parsed.error || parseError;
          malformedAuthorityOrPort = true;
        }
        if (parsed.host) {
          const ipv4result = isIPv4(parsed.host);
          if (ipv4result === false) {
            const bracketedIPLiteral = isIPLiteral(parsed.host);
            const hasIPLiteralBracket = parsed.host.indexOf("[") !== -1 || parsed.host.indexOf("]") !== -1;
            const ipv6result = normalizeIPv6(parsed.host);
            isIP = ipv6result.isIPV6 || ipv6result.isIPVFuture === true;
            malformedIPLiteral = hasIPLiteralBracket && (!bracketedIPLiteral || ipv6result.error === true);
            parsed.host = isIP ? ipv6result.host : ipv6result.host.toLowerCase();
            if (malformedIPLiteral) {
              parsed.error = parsed.error || MALFORMED_HOST_ERROR;
              malformedAuthorityOrPort = true;
            }
          } else {
            isIP = true;
          }
        }
        if (parsed.scheme === void 0 && parsed.userinfo === void 0 && parsed.host === void 0 && parsed.port === void 0 && parsed.query === void 0 && !parsed.path) {
          parsed.reference = "same-document";
        } else if (parsed.scheme === void 0) {
          parsed.reference = "relative";
        } else if (parsed.fragment === void 0) {
          parsed.reference = "absolute";
        } else {
          parsed.reference = "uri";
        }
        if (options.reference && options.reference !== "suffix" && options.reference !== parsed.reference) {
          parsed.error = parsed.error || "URI is not a " + options.reference + " reference.";
        }
        const schemeHandler = getSchemeHandler(options.scheme || parsed.scheme);
        if (!malformedIPLiteral) {
          malformedHost = canonicalizeHost(parsed, options, schemeHandler, isIP);
        }
        if (uri.indexOf("%") !== -1 && parsed.host !== void 0 && !malformedIPLiteral) {
          let host = isIP ? parsed.host : normalizePercentEncoding(parsed.host, true);
          if (!isIP) {
            host = normalizePercentEncoding(host.toLowerCase());
          }
          parsed.host = isIP || options.scheme !== "null" ? reescapeHostDelimiters(host, isIP) : host;
        }
        if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
          if (parsed.path) {
            parsed.path = normalizePathEncoding(parsed.path);
          }
          if (parsed.query) {
            parsed.query = normalizeQueryFragmentEncoding(parsed.query);
          }
          if (parsed.fragment) {
            parsed.fragment = normalizeQueryFragmentEncoding(parsed.fragment);
          }
        }
        if (schemeHandler && schemeHandler.parse) {
          schemeHandler.parse(parsed, options);
          if (schemeHandler === SCHEMES.urn && parsed.nid === void 0) {
            malformedSchemeSpecific = true;
          }
        }
      } else {
        parsed.error = parsed.error || "URI can not be parsed.";
      }
      return { parsed, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme };
    }
    function parse3(uri, opts) {
      return parseWithStatus(uri, opts).parsed;
    }
    function normalizeString(uri, opts) {
      return normalizeStringWithStatus(uri, opts).normalized;
    }
    function normalizeStringWithStatus(uri, opts) {
      const { parsed, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = parseWithStatus(uri, opts);
      return {
        normalized: malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? uri : serialize(parsed, opts),
        malformedAuthorityOrPort,
        malformedPercentEncoding,
        malformedSchemeSpecific,
        malformedHost,
        malformedScheme
      };
    }
    function normalizeComparableURI(uri, opts) {
      if (typeof uri !== "string" && typeof uri !== "object") {
        return void 0;
      }
      let value;
      try {
        value = typeof uri === "string" ? uri : serialize(uri, opts);
      } catch {
        return void 0;
      }
      const { normalized, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = normalizeStringWithStatus(value, opts);
      return malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? void 0 : normalized;
    }
    var fastUri = {
      SCHEMES,
      normalize: normalize3,
      resolve: resolve2,
      resolveComponent,
      equal,
      serialize,
      parse: parse3
    };
    module.exports = fastUri;
    module.exports.default = fastUri;
    module.exports.fastUri = fastUri;
  }
});

// ../node_modules/ajv/dist/runtime/uri.js
var require_uri = __commonJS({
  "../node_modules/ajv/dist/runtime/uri.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var uri = require_fast_uri();
    uri.code = 'require("ajv/dist/runtime/uri").default';
    exports.default = uri;
  }
});

// ../node_modules/ajv/dist/core.js
var require_core = __commonJS({
  "../node_modules/ajv/dist/core.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    var ref_error_1 = require_ref_error();
    var rules_1 = require_rules();
    var compile_1 = require_compile();
    var codegen_2 = require_codegen();
    var resolve_1 = require_resolve();
    var dataType_1 = require_dataType();
    var util_1 = require_util();
    var $dataRefSchema = require_data();
    var uri_1 = require_uri();
    var defaultRegExp = (str, flags) => new RegExp(str, flags);
    defaultRegExp.code = "new RegExp";
    var META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
    var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]);
    var removedOptions = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    };
    var deprecatedOptions = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    };
    var MAX_EXPRESSION = 200;
    function requiredOptions(o) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
      const s = o.strict;
      const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
      const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
      const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
      const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
      return {
        strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
        strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
        strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
        strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
        strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
        code: o.code ? { ...o.code, optimize, regExp } : { optimize, regExp },
        loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
        loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
        meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
        messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
        inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
        schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
        addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
        validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
        validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
        unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
        int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
        uriResolver
      };
    }
    var Ajv = class {
      constructor(opts = {}) {
        this.schemas = {};
        this.refs = {};
        this.formats = /* @__PURE__ */ Object.create(null);
        this._compilations = /* @__PURE__ */ new Set();
        this._loading = {};
        this._cache = /* @__PURE__ */ new Map();
        opts = this.opts = { ...opts, ...requiredOptions(opts) };
        const { es5, lines } = this.opts.code;
        this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
        this.logger = getLogger(opts.logger);
        const formatOpt = opts.validateFormats;
        opts.validateFormats = false;
        this.RULES = (0, rules_1.getRules)();
        checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
        checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
        this._metaOpts = getMetaSchemaOptions.call(this);
        if (opts.formats)
          addInitialFormats.call(this);
        this._addVocabularies();
        this._addDefaultMetaSchema();
        if (opts.keywords)
          addInitialKeywords.call(this, opts.keywords);
        if (typeof opts.meta == "object")
          this.addMetaSchema(opts.meta);
        addInitialSchemas.call(this);
        opts.validateFormats = formatOpt;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data, meta, schemaId } = this.opts;
        let _dataRefSchema = $dataRefSchema;
        if (schemaId === "id") {
          _dataRefSchema = { ...$dataRefSchema };
          _dataRefSchema.id = _dataRefSchema.$id;
          delete _dataRefSchema.$id;
        }
        if (meta && $data)
          this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
      }
      defaultMeta() {
        const { meta, schemaId } = this.opts;
        return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
      }
      validate(schemaKeyRef, data) {
        let v;
        if (typeof schemaKeyRef == "string") {
          v = this.getSchema(schemaKeyRef);
          if (!v)
            throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
        } else {
          v = this.compile(schemaKeyRef);
        }
        const valid = v(data);
        if (!("$async" in v))
          this.errors = v.errors;
        return valid;
      }
      compile(schema, _meta) {
        const sch = this._addSchema(schema, _meta);
        return sch.validate || this._compileSchemaEnv(sch);
      }
      compileAsync(schema, meta) {
        if (typeof this.opts.loadSchema != "function") {
          throw new Error("options.loadSchema should be a function");
        }
        const { loadSchema } = this.opts;
        return runCompileAsync.call(this, schema, meta);
        async function runCompileAsync(_schema, _meta) {
          await loadMetaSchema.call(this, _schema.$schema);
          const sch = this._addSchema(_schema, _meta);
          return sch.validate || _compileAsync.call(this, sch);
        }
        async function loadMetaSchema($ref) {
          if ($ref && !this.getSchema($ref)) {
            await runCompileAsync.call(this, { $ref }, true);
          }
        }
        async function _compileAsync(sch) {
          try {
            return this._compileSchemaEnv(sch);
          } catch (e) {
            if (!(e instanceof ref_error_1.default))
              throw e;
            checkLoaded.call(this, e);
            await loadMissingSchema.call(this, e.missingSchema);
            return _compileAsync.call(this, sch);
          }
        }
        function checkLoaded({ missingSchema: ref, missingRef }) {
          if (this.refs[ref]) {
            throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
          }
        }
        async function loadMissingSchema(ref) {
          const _schema = await _loadSchema.call(this, ref);
          if (!this.refs[ref])
            await loadMetaSchema.call(this, _schema.$schema);
          if (!this.refs[ref])
            this.addSchema(_schema, ref, meta);
        }
        async function _loadSchema(ref) {
          const p = this._loading[ref];
          if (p)
            return p;
          try {
            return await (this._loading[ref] = loadSchema(ref));
          } finally {
            delete this._loading[ref];
          }
        }
      }
      // Adds schema to the instance
      addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
        if (Array.isArray(schema)) {
          for (const sch of schema)
            this.addSchema(sch, void 0, _meta, _validateSchema);
          return this;
        }
        let id;
        if (typeof schema === "object") {
          const { schemaId } = this.opts;
          id = schema[schemaId];
          if (id !== void 0 && typeof id != "string") {
            throw new Error(`schema ${schemaId} must be string`);
          }
        }
        key = (0, resolve_1.normalizeId)(key || id);
        this._checkUnique(key);
        this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
        return this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
        this.addSchema(schema, key, true, _validateSchema);
        return this;
      }
      //  Validate schema against its meta-schema
      validateSchema(schema, throwOrLogError) {
        if (typeof schema == "boolean")
          return true;
        let $schema;
        $schema = schema.$schema;
        if ($schema !== void 0 && typeof $schema != "string") {
          throw new Error("$schema must be a string");
        }
        $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
        if (!$schema) {
          this.logger.warn("meta-schema not available");
          this.errors = null;
          return true;
        }
        const valid = this.validate($schema, schema);
        if (!valid && throwOrLogError) {
          const message = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(message);
          else
            throw new Error(message);
        }
        return valid;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(keyRef) {
        let sch;
        while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
          keyRef = sch;
        if (sch === void 0) {
          const { schemaId } = this.opts;
          const root = new compile_1.SchemaEnv({ schema: {}, schemaId });
          sch = compile_1.resolveSchema.call(this, root, keyRef);
          if (!sch)
            return;
          this.refs[keyRef] = sch;
        }
        return sch.validate || this._compileSchemaEnv(sch);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(schemaKeyRef) {
        if (schemaKeyRef instanceof RegExp) {
          this._removeAllSchemas(this.schemas, schemaKeyRef);
          this._removeAllSchemas(this.refs, schemaKeyRef);
          return this;
        }
        switch (typeof schemaKeyRef) {
          case "undefined":
            this._removeAllSchemas(this.schemas);
            this._removeAllSchemas(this.refs);
            this._cache.clear();
            return this;
          case "string": {
            const sch = getSchEnv.call(this, schemaKeyRef);
            if (typeof sch == "object")
              this._cache.delete(sch.schema);
            delete this.schemas[schemaKeyRef];
            delete this.refs[schemaKeyRef];
            return this;
          }
          case "object": {
            const cacheKey = schemaKeyRef;
            this._cache.delete(cacheKey);
            let id = schemaKeyRef[this.opts.schemaId];
            if (id) {
              id = (0, resolve_1.normalizeId)(id);
              delete this.schemas[id];
              delete this.refs[id];
            }
            return this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(definitions) {
        for (const def of definitions)
          this.addKeyword(def);
        return this;
      }
      addKeyword(kwdOrDef, def) {
        let keyword;
        if (typeof kwdOrDef == "string") {
          keyword = kwdOrDef;
          if (typeof def == "object") {
            this.logger.warn("these parameters are deprecated, see docs for addKeyword");
            def.keyword = keyword;
          }
        } else if (typeof kwdOrDef == "object" && def === void 0) {
          def = kwdOrDef;
          keyword = def.keyword;
          if (Array.isArray(keyword) && !keyword.length) {
            throw new Error("addKeywords: keyword must be string or non-empty array");
          }
        } else {
          throw new Error("invalid addKeywords parameters");
        }
        checkKeyword.call(this, keyword, def);
        if (!def) {
          (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
          return this;
        }
        keywordMetaschema.call(this, def);
        const definition = {
          ...def,
          type: (0, dataType_1.getJSONTypes)(def.type),
          schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
        };
        (0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
        return this;
      }
      getKeyword(keyword) {
        const rule = this.RULES.all[keyword];
        return typeof rule == "object" ? rule.definition : !!rule;
      }
      // Remove keyword
      removeKeyword(keyword) {
        const { RULES } = this;
        delete RULES.keywords[keyword];
        delete RULES.all[keyword];
        for (const group of RULES.rules) {
          const i = group.rules.findIndex((rule) => rule.keyword === keyword);
          if (i >= 0)
            group.rules.splice(i, 1);
        }
        return this;
      }
      // Add format
      addFormat(name, format2) {
        if (typeof format2 == "string")
          format2 = new RegExp(format2);
        this.formats[name] = format2;
        return this;
      }
      errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
        if (!errors || errors.length === 0)
          return "No errors";
        return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text, msg) => text + separator + msg);
      }
      $dataMetaSchema(metaSchema, keywordsJsonPointers) {
        const rules = this.RULES.all;
        metaSchema = JSON.parse(JSON.stringify(metaSchema));
        for (const jsonPointer of keywordsJsonPointers) {
          const segments = jsonPointer.split("/").slice(1);
          let keywords = metaSchema;
          for (const seg of segments)
            keywords = keywords[seg];
          for (const key in rules) {
            const rule = rules[key];
            if (typeof rule != "object")
              continue;
            const { $data } = rule.definition;
            const schema = keywords[key];
            if ($data && schema)
              keywords[key] = schemaOrData(schema);
          }
        }
        return metaSchema;
      }
      _removeAllSchemas(schemas, regex) {
        for (const keyRef in schemas) {
          const sch = schemas[keyRef];
          if (!regex || regex.test(keyRef)) {
            if (typeof sch == "string") {
              delete schemas[keyRef];
            } else if (sch && !sch.meta) {
              this._cache.delete(sch.schema);
              delete schemas[keyRef];
            }
          }
        }
      }
      _addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
        let id;
        const { schemaId } = this.opts;
        if (typeof schema == "object") {
          id = schema[schemaId];
        } else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          else if (typeof schema != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let sch = this._cache.get(schema);
        if (sch !== void 0)
          return sch;
        baseId = (0, resolve_1.normalizeId)(id || baseId);
        const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
        sch = new compile_1.SchemaEnv({ schema, schemaId, meta, baseId, localRefs });
        this._cache.set(sch.schema, sch);
        if (addSchema && !baseId.startsWith("#")) {
          if (baseId)
            this._checkUnique(baseId);
          this.refs[baseId] = sch;
        }
        if (validateSchema)
          this.validateSchema(schema, true);
        return sch;
      }
      _checkUnique(id) {
        if (this.schemas[id] || this.refs[id]) {
          throw new Error(`schema with key or id "${id}" already exists`);
        }
      }
      _compileSchemaEnv(sch) {
        if (sch.meta)
          this._compileMetaSchema(sch);
        else
          compile_1.compileSchema.call(this, sch);
        if (!sch.validate)
          throw new Error("ajv implementation error");
        return sch.validate;
      }
      _compileMetaSchema(sch) {
        const currentOpts = this.opts;
        this.opts = this._metaOpts;
        try {
          compile_1.compileSchema.call(this, sch);
        } finally {
          this.opts = currentOpts;
        }
      }
    };
    Ajv.ValidationError = validation_error_1.default;
    Ajv.MissingRefError = ref_error_1.default;
    exports.default = Ajv;
    function checkOptions(checkOpts, options, msg, log = "error") {
      for (const key in checkOpts) {
        const opt = key;
        if (opt in options)
          this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
      }
    }
    function getSchEnv(keyRef) {
      keyRef = (0, resolve_1.normalizeId)(keyRef);
      return this.schemas[keyRef] || this.refs[keyRef];
    }
    function addInitialSchemas() {
      const optsSchemas = this.opts.schemas;
      if (!optsSchemas)
        return;
      if (Array.isArray(optsSchemas))
        this.addSchema(optsSchemas);
      else
        for (const key in optsSchemas)
          this.addSchema(optsSchemas[key], key);
    }
    function addInitialFormats() {
      for (const name in this.opts.formats) {
        const format2 = this.opts.formats[name];
        if (format2)
          this.addFormat(name, format2);
      }
    }
    function addInitialKeywords(defs) {
      if (Array.isArray(defs)) {
        this.addVocabulary(defs);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const keyword in defs) {
        const def = defs[keyword];
        if (!def.keyword)
          def.keyword = keyword;
        this.addKeyword(def);
      }
    }
    function getMetaSchemaOptions() {
      const metaOpts = { ...this.opts };
      for (const opt of META_IGNORE_OPTIONS)
        delete metaOpts[opt];
      return metaOpts;
    }
    var noLogs = { log() {
    }, warn() {
    }, error() {
    } };
    function getLogger(logger) {
      if (logger === false)
        return noLogs;
      if (logger === void 0)
        return console;
      if (logger.log && logger.warn && logger.error)
        return logger;
      throw new Error("logger must implement log, warn and error methods");
    }
    var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
    function checkKeyword(keyword, def) {
      const { RULES } = this;
      (0, util_1.eachItem)(keyword, (kwd) => {
        if (RULES.keywords[kwd])
          throw new Error(`Keyword ${kwd} is already defined`);
        if (!KEYWORD_NAME.test(kwd))
          throw new Error(`Keyword ${kwd} has invalid name`);
      });
      if (!def)
        return;
      if (def.$data && !("code" in def || "validate" in def)) {
        throw new Error('$data keyword must have "code" or "validate" function');
      }
    }
    function addRule(keyword, definition, dataType) {
      var _a;
      const post = definition === null || definition === void 0 ? void 0 : definition.post;
      if (dataType && post)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES } = this;
      let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
      if (!ruleGroup) {
        ruleGroup = { type: dataType, rules: [] };
        RULES.rules.push(ruleGroup);
      }
      RULES.keywords[keyword] = true;
      if (!definition)
        return;
      const rule = {
        keyword,
        definition: {
          ...definition,
          type: (0, dataType_1.getJSONTypes)(definition.type),
          schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
        }
      };
      if (definition.before)
        addBeforeRule.call(this, ruleGroup, rule, definition.before);
      else
        ruleGroup.rules.push(rule);
      RULES.all[keyword] = rule;
      (_a = definition.implements) === null || _a === void 0 ? void 0 : _a.forEach((kwd) => this.addKeyword(kwd));
    }
    function addBeforeRule(ruleGroup, rule, before) {
      const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
      if (i >= 0) {
        ruleGroup.rules.splice(i, 0, rule);
      } else {
        ruleGroup.rules.push(rule);
        this.logger.warn(`rule ${before} is not defined`);
      }
    }
    function keywordMetaschema(def) {
      let { metaSchema } = def;
      if (metaSchema === void 0)
        return;
      if (def.$data && this.opts.$data)
        metaSchema = schemaOrData(metaSchema);
      def.validateSchema = this.compile(metaSchema, true);
    }
    var $dataRef = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function schemaOrData(schema) {
      return { anyOf: [schema, $dataRef] };
    }
  }
});

// ../node_modules/ajv/dist/vocabularies/core/id.js
var require_id = __commonJS({
  "../node_modules/ajv/dist/vocabularies/core/id.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var def = {
      keyword: "id",
      code() {
        throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/core/ref.js
var require_ref = __commonJS({
  "../node_modules/ajv/dist/vocabularies/core/ref.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.callRef = exports.getValidate = void 0;
    var ref_error_1 = require_ref_error();
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var compile_1 = require_compile();
    var util_1 = require_util();
    var def = {
      keyword: "$ref",
      schemaType: "string",
      code(cxt) {
        const { gen, schema: $ref, it } = cxt;
        const { baseId, schemaEnv: env, validateName, opts, self } = it;
        const { root } = env;
        if (($ref === "#" || $ref === "#/") && baseId === root.baseId)
          return callRootRef();
        const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
        if (schOrEnv === void 0)
          throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
        if (schOrEnv instanceof compile_1.SchemaEnv)
          return callValidate(schOrEnv);
        return inlineRefSchema(schOrEnv);
        function callRootRef() {
          if (env === root)
            return callRef(cxt, validateName, env, env.$async);
          const rootName = gen.scopeValue("root", { ref: root });
          return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
        }
        function callValidate(sch) {
          const v = getValidate(cxt, sch);
          callRef(cxt, v, sch, sch.$async);
        }
        function inlineRefSchema(sch) {
          const schName = gen.scopeValue("schema", opts.code.source === true ? { ref: sch, code: (0, codegen_1.stringify)(sch) } : { ref: sch });
          const valid = gen.name("valid");
          const schCxt = cxt.subschema({
            schema: sch,
            dataTypes: [],
            schemaPath: codegen_1.nil,
            topSchemaRef: schName,
            errSchemaPath: $ref
          }, valid);
          cxt.mergeEvaluated(schCxt);
          cxt.ok(valid);
        }
      }
    };
    function getValidate(cxt, sch) {
      const { gen } = cxt;
      return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
    }
    exports.getValidate = getValidate;
    function callRef(cxt, v, sch, $async) {
      const { gen, it } = cxt;
      const { allErrors, schemaEnv: env, opts } = it;
      const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
      if ($async)
        callAsyncRef();
      else
        callSyncRef();
      function callAsyncRef() {
        if (!env.$async)
          throw new Error("async schema referenced by sync schema");
        const valid = gen.let("valid");
        gen.try(() => {
          gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
          addEvaluatedFrom(v);
          if (!allErrors)
            gen.assign(valid, true);
        }, (e) => {
          gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
          addErrorsFrom(e);
          if (!allErrors)
            gen.assign(valid, false);
        });
        cxt.ok(valid);
      }
      function callSyncRef() {
        cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
      }
      function addErrorsFrom(source) {
        const errs = (0, codegen_1._)`${source}.errors`;
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
        gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
      }
      function addEvaluatedFrom(source) {
        var _a;
        if (!it.opts.unevaluated)
          return;
        const schEvaluated = (_a = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a === void 0 ? void 0 : _a.evaluated;
        if (it.props !== true) {
          if (schEvaluated && !schEvaluated.dynamicProps) {
            if (schEvaluated.props !== void 0) {
              it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
            }
          } else {
            const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
            it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
          }
        }
        if (it.items !== true) {
          if (schEvaluated && !schEvaluated.dynamicItems) {
            if (schEvaluated.items !== void 0) {
              it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
            }
          } else {
            const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
            it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
          }
        }
      }
    }
    exports.callRef = callRef;
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/core/index.js
var require_core2 = __commonJS({
  "../node_modules/ajv/dist/vocabularies/core/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var id_1 = require_id();
    var ref_1 = require_ref();
    var core = [
      "$schema",
      "$id",
      "$defs",
      "$vocabulary",
      { keyword: "$comment" },
      "definitions",
      id_1.default,
      ref_1.default
    ];
    exports.default = core;
  }
});

// ../node_modules/ajv/dist/vocabularies/validation/limitNumber.js
var require_limitNumber = __commonJS({
  "../node_modules/ajv/dist/vocabularies/validation/limitNumber.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var ops = codegen_1.operators;
    var KWDs = {
      maximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      minimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      exclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      exclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
    };
    var error = {
      message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
    };
    var def = {
      keyword: Object.keys(KWDs),
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/validation/multipleOf.js
var require_multipleOf = __commonJS({
  "../node_modules/ajv/dist/vocabularies/validation/multipleOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
      params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
    };
    var def = {
      keyword: "multipleOf",
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, schemaCode, it } = cxt;
        const prec = it.opts.multipleOfPrecision;
        const res = gen.let("res");
        const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
        cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS({
  "../node_modules/ajv/dist/runtime/ucs2length.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ucs2length(str) {
      const len = str.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
        length++;
        value = str.charCodeAt(pos++);
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str.charCodeAt(pos);
          if ((value & 64512) === 56320)
            pos++;
        }
      }
      return length;
    }
    exports.default = ucs2length;
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
  }
});

// ../node_modules/ajv/dist/vocabularies/validation/limitLength.js
var require_limitLength = __commonJS({
  "../node_modules/ajv/dist/vocabularies/validation/limitLength.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var ucs2length_1 = require_ucs2length();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxLength" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxLength", "minLength"],
      type: "string",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode, it } = cxt;
        const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
        const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
        cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/validation/pattern.js
var require_pattern = __commonJS({
  "../node_modules/ajv/dist/vocabularies/validation/pattern.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var util_1 = require_util();
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
    };
    var def = {
      keyword: "pattern",
      type: "string",
      schemaType: "string",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const u = it.opts.unicodeRegExp ? "u" : "";
        if ($data) {
          const { regExp } = it.opts.code;
          const regExpCode = regExp.code === "new RegExp" ? (0, codegen_1._)`new RegExp` : (0, util_1.useFunc)(gen, regExp);
          const valid = gen.let("valid");
          gen.try(() => gen.assign(valid, (0, codegen_1._)`${regExpCode}(${schemaCode}, ${u}).test(${data})`), () => gen.assign(valid, false));
          cxt.fail$data((0, codegen_1._)`!${valid}`);
        } else {
          const regExp = (0, code_1.usePattern)(cxt, schema);
          cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
        }
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/validation/limitProperties.js
var require_limitProperties = __commonJS({
  "../node_modules/ajv/dist/vocabularies/validation/limitProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxProperties" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxProperties", "minProperties"],
      type: "object",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/validation/required.js
var require_required = __commonJS({
  "../node_modules/ajv/dist/vocabularies/validation/required.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
      params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
    };
    var def = {
      keyword: "required",
      type: "object",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, schema, schemaCode, data, $data, it } = cxt;
        const { opts } = it;
        if (!$data && schema.length === 0)
          return;
        const useLoop = schema.length >= opts.loopRequired;
        if (it.allErrors)
          allErrorsMode();
        else
          exitOnErrorMode();
        if (opts.strictRequired) {
          const props = cxt.parentSchema.properties;
          const { definedProperties } = cxt.it;
          for (const requiredKey of schema) {
            if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
              const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
              const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
              (0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
            }
          }
        }
        function allErrorsMode() {
          if (useLoop || $data) {
            cxt.block$data(codegen_1.nil, loopAllRequired);
          } else {
            for (const prop of schema) {
              (0, code_1.checkReportMissingProp)(cxt, prop);
            }
          }
        }
        function exitOnErrorMode() {
          const missing = gen.let("missing");
          if (useLoop || $data) {
            const valid = gen.let("valid", true);
            cxt.block$data(valid, () => loopUntilMissing(missing, valid));
            cxt.ok(valid);
          } else {
            gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
            (0, code_1.reportMissingProp)(cxt, missing);
            gen.else();
          }
        }
        function loopAllRequired() {
          gen.forOf("prop", schemaCode, (prop) => {
            cxt.setParams({ missingProperty: prop });
            gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
          });
        }
        function loopUntilMissing(missing, valid) {
          cxt.setParams({ missingProperty: missing });
          gen.forOf(missing, schemaCode, () => {
            gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
            gen.if((0, codegen_1.not)(valid), () => {
              cxt.error();
              gen.break();
            });
          }, codegen_1.nil);
        }
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/validation/limitItems.js
var require_limitItems = __commonJS({
  "../node_modules/ajv/dist/vocabularies/validation/limitItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxItems" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxItems", "minItems"],
      type: "array",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/runtime/equal.js
var require_equal = __commonJS({
  "../node_modules/ajv/dist/runtime/equal.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var equal = require_fast_deep_equal();
    equal.code = 'require("ajv/dist/runtime/equal").default';
    exports.default = equal;
  }
});

// ../node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems = __commonJS({
  "../node_modules/ajv/dist/vocabularies/validation/uniqueItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dataType_1 = require_dataType();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
      params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
    };
    var def = {
      keyword: "uniqueItems",
      type: "array",
      schemaType: "boolean",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
        if (!$data && !schema)
          return;
        const valid = gen.let("valid");
        const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
        cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
        cxt.ok(valid);
        function validateUniqueItems() {
          const i = gen.let("i", (0, codegen_1._)`${data}.length`);
          const j = gen.let("j");
          cxt.setParams({ i, j });
          gen.assign(valid, true);
          gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
        }
        function canOptimize() {
          return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
        }
        function loopN(i, j) {
          const item = gen.name("item");
          const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
          const indices = gen.const("indices", (0, codegen_1._)`{}`);
          gen.for((0, codegen_1._)`;${i}--;`, () => {
            gen.let(item, (0, codegen_1._)`${data}[${i}]`);
            gen.if(wrongType, (0, codegen_1._)`continue`);
            if (itemTypes.length > 1)
              gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
            gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
              gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
              cxt.error();
              gen.assign(valid, false).break();
            }).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
          });
        }
        function loopN2(i, j) {
          const eql = (0, util_1.useFunc)(gen, equal_1.default);
          const outer = gen.name("outer");
          gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
            cxt.error();
            gen.assign(valid, false).break(outer);
          })));
        }
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/validation/const.js
var require_const = __commonJS({
  "../node_modules/ajv/dist/vocabularies/validation/const.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: "must be equal to constant",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
    };
    var def = {
      keyword: "const",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schemaCode, schema } = cxt;
        if ($data || schema && typeof schema == "object") {
          cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
        } else {
          cxt.fail((0, codegen_1._)`${schema} !== ${data}`);
        }
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/validation/enum.js
var require_enum = __commonJS({
  "../node_modules/ajv/dist/vocabularies/validation/enum.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
    };
    var def = {
      keyword: "enum",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        if (!$data && schema.length === 0)
          throw new Error("enum must have non-empty array");
        const useLoop = schema.length >= it.opts.loopEnum;
        let eql;
        const getEql = () => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default);
        let valid;
        if (useLoop || $data) {
          valid = gen.let("valid");
          cxt.block$data(valid, loopEnum);
        } else {
          if (!Array.isArray(schema))
            throw new Error("ajv implementation error");
          const vSchema = gen.const("vSchema", schemaCode);
          valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
        }
        cxt.pass(valid);
        function loopEnum() {
          gen.assign(valid, false);
          gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
        }
        function equalCode(vSchema, i) {
          const sch = schema[i];
          return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
        }
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation = __commonJS({
  "../node_modules/ajv/dist/vocabularies/validation/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var limitNumber_1 = require_limitNumber();
    var multipleOf_1 = require_multipleOf();
    var limitLength_1 = require_limitLength();
    var pattern_1 = require_pattern();
    var limitProperties_1 = require_limitProperties();
    var required_1 = require_required();
    var limitItems_1 = require_limitItems();
    var uniqueItems_1 = require_uniqueItems();
    var const_1 = require_const();
    var enum_1 = require_enum();
    var validation = [
      // number
      limitNumber_1.default,
      multipleOf_1.default,
      // string
      limitLength_1.default,
      pattern_1.default,
      // object
      limitProperties_1.default,
      required_1.default,
      // array
      limitItems_1.default,
      uniqueItems_1.default,
      // any
      { keyword: "type", schemaType: ["string", "array"] },
      { keyword: "nullable", schemaType: "boolean" },
      const_1.default,
      enum_1.default
    ];
    exports.default = validation;
  }
});

// ../node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems = __commonJS({
  "../node_modules/ajv/dist/vocabularies/applicator/additionalItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateAdditionalItems = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "additionalItems",
      type: "array",
      schemaType: ["boolean", "object"],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { parentSchema, it } = cxt;
        const { items } = parentSchema;
        if (!Array.isArray(items)) {
          (0, util_1.checkStrictMode)(it, '"additionalItems" is ignored when "items" is not an array of schemas');
          return;
        }
        validateAdditionalItems(cxt, items);
      }
    };
    function validateAdditionalItems(cxt, items) {
      const { gen, schema, data, keyword, it } = cxt;
      it.items = true;
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      if (schema === false) {
        cxt.setParams({ len: items.length });
        cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
      } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
        const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
        gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
        cxt.ok(valid);
      }
      function validateItems(valid) {
        gen.forRange("i", items.length, len, (i) => {
          cxt.subschema({ keyword, dataProp: i, dataPropType: util_1.Type.Num }, valid);
          if (!it.allErrors)
            gen.if((0, codegen_1.not)(valid), () => gen.break());
        });
      }
    }
    exports.validateAdditionalItems = validateAdditionalItems;
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/applicator/items.js
var require_items = __commonJS({
  "../node_modules/ajv/dist/vocabularies/applicator/items.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateTuple = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "array", "boolean"],
      before: "uniqueItems",
      code(cxt) {
        const { schema, it } = cxt;
        if (Array.isArray(schema))
          return validateTuple(cxt, "additionalItems", schema);
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    function validateTuple(cxt, extraItems, schArr = cxt.schema) {
      const { gen, parentSchema, data, keyword, it } = cxt;
      checkStrictTuple(parentSchema);
      if (it.opts.unevaluated && schArr.length && it.items !== true) {
        it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
      }
      const valid = gen.name("valid");
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      schArr.forEach((sch, i) => {
        if ((0, util_1.alwaysValidSchema)(it, sch))
          return;
        gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
          keyword,
          schemaProp: i,
          dataProp: i
        }, valid));
        cxt.ok(valid);
      });
      function checkStrictTuple(sch) {
        const { opts, errSchemaPath } = it;
        const l = schArr.length;
        const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
        if (opts.strictTuples && !fullTuple) {
          const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
          (0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
        }
      }
    }
    exports.validateTuple = validateTuple;
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems = __commonJS({
  "../node_modules/ajv/dist/vocabularies/applicator/prefixItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var items_1 = require_items();
    var def = {
      keyword: "prefixItems",
      type: "array",
      schemaType: ["array"],
      before: "uniqueItems",
      code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/applicator/items2020.js
var require_items2020 = __commonJS({
  "../node_modules/ajv/dist/vocabularies/applicator/items2020.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var additionalItems_1 = require_additionalItems();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { schema, parentSchema, it } = cxt;
        const { prefixItems } = parentSchema;
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        if (prefixItems)
          (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
        else
          cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/applicator/contains.js
var require_contains = __commonJS({
  "../node_modules/ajv/dist/vocabularies/applicator/contains.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
      params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
    };
    var def = {
      keyword: "contains",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        let min;
        let max;
        const { minContains, maxContains } = parentSchema;
        if (it.opts.next) {
          min = minContains === void 0 ? 1 : minContains;
          max = maxContains;
        } else {
          min = 1;
        }
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        cxt.setParams({ min, max });
        if (max === void 0 && min === 0) {
          (0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
          return;
        }
        if (max !== void 0 && min > max) {
          (0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
          cxt.fail();
          return;
        }
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          let cond = (0, codegen_1._)`${len} >= ${min}`;
          if (max !== void 0)
            cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
          cxt.pass(cond);
          return;
        }
        it.items = true;
        const valid = gen.name("valid");
        if (max === void 0 && min === 1) {
          validateItems(valid, () => gen.if(valid, () => gen.break()));
        } else if (min === 0) {
          gen.let(valid, true);
          if (max !== void 0)
            gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
        } else {
          gen.let(valid, false);
          validateItemsWithCount();
        }
        cxt.result(valid, () => cxt.reset());
        function validateItemsWithCount() {
          const schValid = gen.name("_valid");
          const count = gen.let("count", 0);
          validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
        }
        function validateItems(_valid, block) {
          gen.forRange("i", 0, len, (i) => {
            cxt.subschema({
              keyword: "contains",
              dataProp: i,
              dataPropType: util_1.Type.Num,
              compositeRule: true
            }, _valid);
            block();
          });
        }
        function checkLimits(count) {
          gen.code((0, codegen_1._)`${count}++`);
          if (max === void 0) {
            gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
          } else {
            gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
            if (min === 1)
              gen.assign(valid, true);
            else
              gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
          }
        }
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/applicator/dependencies.js
var require_dependencies = __commonJS({
  "../node_modules/ajv/dist/vocabularies/applicator/dependencies.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    exports.error = {
      message: ({ params: { property, depsCount, deps } }) => {
        const property_ies = depsCount === 1 ? "property" : "properties";
        return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
      },
      params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
      // TODO change to reference
    };
    var def = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: exports.error,
      code(cxt) {
        const [propDeps, schDeps] = splitDependencies(cxt);
        validatePropertyDeps(cxt, propDeps);
        validateSchemaDeps(cxt, schDeps);
      }
    };
    function splitDependencies({ schema }) {
      const propertyDeps = {};
      const schemaDeps = {};
      for (const key in schema) {
        if (key === "__proto__")
          continue;
        const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
        deps[key] = schema[key];
      }
      return [propertyDeps, schemaDeps];
    }
    function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
      const { gen, data, it } = cxt;
      if (Object.keys(propertyDeps).length === 0)
        return;
      const missing = gen.let("missing");
      for (const prop in propertyDeps) {
        const deps = propertyDeps[prop];
        if (deps.length === 0)
          continue;
        const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
        cxt.setParams({
          property: prop,
          depsCount: deps.length,
          deps: deps.join(", ")
        });
        if (it.allErrors) {
          gen.if(hasProperty, () => {
            for (const depProp of deps) {
              (0, code_1.checkReportMissingProp)(cxt, depProp);
            }
          });
        } else {
          gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
          (0, code_1.reportMissingProp)(cxt, missing);
          gen.else();
        }
      }
    }
    exports.validatePropertyDeps = validatePropertyDeps;
    function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      for (const prop in schemaDeps) {
        if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop]))
          continue;
        gen.if(
          (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties),
          () => {
            const schCxt = cxt.subschema({ keyword, schemaProp: prop }, valid);
            cxt.mergeValidEvaluated(schCxt, valid);
          },
          () => gen.var(valid, true)
          // TODO var
        );
        cxt.ok(valid);
      }
    }
    exports.validateSchemaDeps = validateSchemaDeps;
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames = __commonJS({
  "../node_modules/ajv/dist/vocabularies/applicator/propertyNames.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: "property name must be valid",
      params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
    };
    var def = {
      keyword: "propertyNames",
      type: "object",
      schemaType: ["object", "boolean"],
      error,
      code(cxt) {
        const { gen, schema, data, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        const valid = gen.name("valid");
        gen.forIn("key", data, (key) => {
          cxt.setParams({ propertyName: key });
          cxt.subschema({
            keyword: "propertyNames",
            data: key,
            dataTypes: ["string"],
            propertyName: key,
            compositeRule: true
          }, valid);
          gen.if((0, codegen_1.not)(valid), () => {
            cxt.error(true);
            if (!it.allErrors)
              gen.break();
          });
        });
        cxt.ok(valid);
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties = __commonJS({
  "../node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var util_1 = require_util();
    var error = {
      message: "must NOT have additional properties",
      params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
    };
    var def = {
      keyword: "additionalProperties",
      type: ["object"],
      schemaType: ["boolean", "object"],
      allowUndefined: true,
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data, errsCount, it } = cxt;
        if (!errsCount)
          throw new Error("ajv implementation error");
        const { allErrors, opts } = it;
        it.props = true;
        if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema))
          return;
        const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
        const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
        checkAdditionalProperties();
        cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
        function checkAdditionalProperties() {
          gen.forIn("key", data, (key) => {
            if (!props.length && !patProps.length)
              additionalPropertyCode(key);
            else
              gen.if(isAdditional(key), () => additionalPropertyCode(key));
          });
        }
        function isAdditional(key) {
          let definedProp;
          if (props.length > 8) {
            const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
            definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
          } else if (props.length) {
            definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
          } else {
            definedProp = codegen_1.nil;
          }
          if (patProps.length) {
            definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
          }
          return (0, codegen_1.not)(definedProp);
        }
        function deleteAdditional(key) {
          gen.code((0, codegen_1._)`delete ${data}[${key}]`);
        }
        function additionalPropertyCode(key) {
          if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
            deleteAdditional(key);
            return;
          }
          if (schema === false) {
            cxt.setParams({ additionalProperty: key });
            cxt.error();
            if (!allErrors)
              gen.break();
            return;
          }
          if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
            const valid = gen.name("valid");
            if (opts.removeAdditional === "failing") {
              applyAdditionalSchema(key, valid, false);
              gen.if((0, codegen_1.not)(valid), () => {
                cxt.reset();
                deleteAdditional(key);
              });
            } else {
              applyAdditionalSchema(key, valid);
              if (!allErrors)
                gen.if((0, codegen_1.not)(valid), () => gen.break());
            }
          }
        }
        function applyAdditionalSchema(key, valid, errors) {
          const subschema = {
            keyword: "additionalProperties",
            dataProp: key,
            dataPropType: util_1.Type.Str
          };
          if (errors === false) {
            Object.assign(subschema, {
              compositeRule: true,
              createErrors: false,
              allErrors: false
            });
          }
          cxt.subschema(subschema, valid);
        }
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/applicator/properties.js
var require_properties = __commonJS({
  "../node_modules/ajv/dist/vocabularies/applicator/properties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var validate_1 = require_validate();
    var code_1 = require_code2();
    var util_1 = require_util();
    var additionalProperties_1 = require_additionalProperties();
    var def = {
      keyword: "properties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) {
          additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
        }
        const allProps = (0, code_1.allSchemaProperties)(schema);
        for (const prop of allProps) {
          it.definedProperties.add(prop);
        }
        if (it.opts.unevaluated && allProps.length && it.props !== true) {
          it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
        }
        const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
        if (properties.length === 0)
          return;
        const valid = gen.name("valid");
        for (const prop of properties) {
          if (hasDefault(prop)) {
            applyPropertySchema(prop);
          } else {
            gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
            applyPropertySchema(prop);
            if (!it.allErrors)
              gen.else().var(valid, true);
            gen.endIf();
          }
          cxt.it.definedProperties.add(prop);
          cxt.ok(valid);
        }
        function hasDefault(prop) {
          return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== void 0;
        }
        function applyPropertySchema(prop) {
          cxt.subschema({
            keyword: "properties",
            schemaProp: prop,
            dataProp: prop
          }, valid);
        }
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties = __commonJS({
  "../node_modules/ajv/dist/vocabularies/applicator/patternProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var util_2 = require_util();
    var def = {
      keyword: "patternProperties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, data, parentSchema, it } = cxt;
        const { opts } = it;
        const patterns = (0, code_1.allSchemaProperties)(schema);
        const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
        if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) {
          return;
        }
        const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
        const valid = gen.name("valid");
        if (it.props !== true && !(it.props instanceof codegen_1.Name)) {
          it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
        }
        const { props } = it;
        validatePatternProperties();
        function validatePatternProperties() {
          for (const pat of patterns) {
            if (checkProperties)
              checkMatchingProperties(pat);
            if (it.allErrors) {
              validateProperties(pat);
            } else {
              gen.var(valid, true);
              validateProperties(pat);
              gen.if(valid);
            }
          }
        }
        function checkMatchingProperties(pat) {
          for (const prop in checkProperties) {
            if (new RegExp(pat).test(prop)) {
              (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
            }
          }
        }
        function validateProperties(pat) {
          gen.forIn("key", data, (key) => {
            gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
              const alwaysValid = alwaysValidPatterns.includes(pat);
              if (!alwaysValid) {
                cxt.subschema({
                  keyword: "patternProperties",
                  schemaProp: pat,
                  dataProp: key,
                  dataPropType: util_2.Type.Str
                }, valid);
              }
              if (it.opts.unevaluated && props !== true) {
                gen.assign((0, codegen_1._)`${props}[${key}]`, true);
              } else if (!alwaysValid && !it.allErrors) {
                gen.if((0, codegen_1.not)(valid), () => gen.break());
              }
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/applicator/not.js
var require_not = __commonJS({
  "../node_modules/ajv/dist/vocabularies/applicator/not.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "not",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      code(cxt) {
        const { gen, schema, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          cxt.fail();
          return;
        }
        const valid = gen.name("valid");
        cxt.subschema({
          keyword: "not",
          compositeRule: true,
          createErrors: false,
          allErrors: false
        }, valid);
        cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
      },
      error: { message: "must NOT be valid" }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/applicator/anyOf.js
var require_anyOf = __commonJS({
  "../node_modules/ajv/dist/vocabularies/applicator/anyOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var def = {
      keyword: "anyOf",
      schemaType: "array",
      trackErrors: true,
      code: code_1.validateUnion,
      error: { message: "must match a schema in anyOf" }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/applicator/oneOf.js
var require_oneOf = __commonJS({
  "../node_modules/ajv/dist/vocabularies/applicator/oneOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: "must match exactly one schema in oneOf",
      params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
    };
    var def = {
      keyword: "oneOf",
      schemaType: "array",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        if (it.opts.discriminator && parentSchema.discriminator)
          return;
        const schArr = schema;
        const valid = gen.let("valid", false);
        const passing = gen.let("passing", null);
        const schValid = gen.name("_valid");
        cxt.setParams({ passing });
        gen.block(validateOneOf);
        cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
        function validateOneOf() {
          schArr.forEach((sch, i) => {
            let schCxt;
            if ((0, util_1.alwaysValidSchema)(it, sch)) {
              gen.var(schValid, true);
            } else {
              schCxt = cxt.subschema({
                keyword: "oneOf",
                schemaProp: i,
                compositeRule: true
              }, schValid);
            }
            if (i > 0) {
              gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
            }
            gen.if(schValid, () => {
              gen.assign(valid, true);
              gen.assign(passing, i);
              if (schCxt)
                cxt.mergeEvaluated(schCxt, codegen_1.Name);
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/applicator/allOf.js
var require_allOf = __commonJS({
  "../node_modules/ajv/dist/vocabularies/applicator/allOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "allOf",
      schemaType: "array",
      code(cxt) {
        const { gen, schema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        const valid = gen.name("valid");
        schema.forEach((sch, i) => {
          if ((0, util_1.alwaysValidSchema)(it, sch))
            return;
          const schCxt = cxt.subschema({ keyword: "allOf", schemaProp: i }, valid);
          cxt.ok(valid);
          cxt.mergeEvaluated(schCxt);
        });
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/applicator/if.js
var require_if = __commonJS({
  "../node_modules/ajv/dist/vocabularies/applicator/if.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
      params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
    };
    var def = {
      keyword: "if",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, parentSchema, it } = cxt;
        if (parentSchema.then === void 0 && parentSchema.else === void 0) {
          (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
        }
        const hasThen = hasSchema(it, "then");
        const hasElse = hasSchema(it, "else");
        if (!hasThen && !hasElse)
          return;
        const valid = gen.let("valid", true);
        const schValid = gen.name("_valid");
        validateIf();
        cxt.reset();
        if (hasThen && hasElse) {
          const ifClause = gen.let("ifClause");
          cxt.setParams({ ifClause });
          gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
        } else if (hasThen) {
          gen.if(schValid, validateClause("then"));
        } else {
          gen.if((0, codegen_1.not)(schValid), validateClause("else"));
        }
        cxt.pass(valid, () => cxt.error(true));
        function validateIf() {
          const schCxt = cxt.subschema({
            keyword: "if",
            compositeRule: true,
            createErrors: false,
            allErrors: false
          }, schValid);
          cxt.mergeEvaluated(schCxt);
        }
        function validateClause(keyword, ifClause) {
          return () => {
            const schCxt = cxt.subschema({ keyword }, schValid);
            gen.assign(valid, schValid);
            cxt.mergeValidEvaluated(schCxt, valid);
            if (ifClause)
              gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
            else
              cxt.setParams({ ifClause: keyword });
          };
        }
      }
    };
    function hasSchema(it, keyword) {
      const schema = it.schema[keyword];
      return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema);
    }
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/applicator/thenElse.js
var require_thenElse = __commonJS({
  "../node_modules/ajv/dist/vocabularies/applicator/thenElse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: ["then", "else"],
      schemaType: ["object", "boolean"],
      code({ keyword, parentSchema, it }) {
        if (parentSchema.if === void 0)
          (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator = __commonJS({
  "../node_modules/ajv/dist/vocabularies/applicator/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var additionalItems_1 = require_additionalItems();
    var prefixItems_1 = require_prefixItems();
    var items_1 = require_items();
    var items2020_1 = require_items2020();
    var contains_1 = require_contains();
    var dependencies_1 = require_dependencies();
    var propertyNames_1 = require_propertyNames();
    var additionalProperties_1 = require_additionalProperties();
    var properties_1 = require_properties();
    var patternProperties_1 = require_patternProperties();
    var not_1 = require_not();
    var anyOf_1 = require_anyOf();
    var oneOf_1 = require_oneOf();
    var allOf_1 = require_allOf();
    var if_1 = require_if();
    var thenElse_1 = require_thenElse();
    function getApplicator(draft2020 = false) {
      const applicator = [
        // any
        not_1.default,
        anyOf_1.default,
        oneOf_1.default,
        allOf_1.default,
        if_1.default,
        thenElse_1.default,
        // object
        propertyNames_1.default,
        additionalProperties_1.default,
        dependencies_1.default,
        properties_1.default,
        patternProperties_1.default
      ];
      if (draft2020)
        applicator.push(prefixItems_1.default, items2020_1.default);
      else
        applicator.push(additionalItems_1.default, items_1.default);
      applicator.push(contains_1.default);
      return applicator;
    }
    exports.default = getApplicator;
  }
});

// ../node_modules/ajv/dist/vocabularies/dynamic/dynamicAnchor.js
var require_dynamicAnchor = __commonJS({
  "../node_modules/ajv/dist/vocabularies/dynamic/dynamicAnchor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dynamicAnchor = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var compile_1 = require_compile();
    var ref_1 = require_ref();
    var def = {
      keyword: "$dynamicAnchor",
      schemaType: "string",
      code: (cxt) => dynamicAnchor(cxt, cxt.schema)
    };
    function dynamicAnchor(cxt, anchor) {
      const { gen, it } = cxt;
      it.schemaEnv.root.dynamicAnchors[anchor] = true;
      const v = (0, codegen_1._)`${names_1.default.dynamicAnchors}${(0, codegen_1.getProperty)(anchor)}`;
      const validate2 = it.errSchemaPath === "#" ? it.validateName : _getValidate(cxt);
      gen.if((0, codegen_1._)`!${v}`, () => gen.assign(v, validate2));
    }
    exports.dynamicAnchor = dynamicAnchor;
    function _getValidate(cxt) {
      const { schemaEnv, schema, self } = cxt.it;
      const { root, baseId, localRefs, meta } = schemaEnv.root;
      const { schemaId } = self.opts;
      const sch = new compile_1.SchemaEnv({ schema, schemaId, root, baseId, localRefs, meta });
      compile_1.compileSchema.call(self, sch);
      return (0, ref_1.getValidate)(cxt, sch);
    }
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/dynamic/dynamicRef.js
var require_dynamicRef = __commonJS({
  "../node_modules/ajv/dist/vocabularies/dynamic/dynamicRef.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dynamicRef = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var ref_1 = require_ref();
    var def = {
      keyword: "$dynamicRef",
      schemaType: "string",
      code: (cxt) => dynamicRef(cxt, cxt.schema)
    };
    function dynamicRef(cxt, ref) {
      const { gen, keyword, it } = cxt;
      if (ref[0] !== "#")
        throw new Error(`"${keyword}" only supports hash fragment reference`);
      const anchor = ref.slice(1);
      if (it.allErrors) {
        _dynamicRef();
      } else {
        const valid = gen.let("valid", false);
        _dynamicRef(valid);
        cxt.ok(valid);
      }
      function _dynamicRef(valid) {
        if (it.schemaEnv.root.dynamicAnchors[anchor]) {
          const v = gen.let("_v", (0, codegen_1._)`${names_1.default.dynamicAnchors}${(0, codegen_1.getProperty)(anchor)}`);
          gen.if(v, _callRef(v, valid), _callRef(it.validateName, valid));
        } else {
          _callRef(it.validateName, valid)();
        }
      }
      function _callRef(validate2, valid) {
        return valid ? () => gen.block(() => {
          (0, ref_1.callRef)(cxt, validate2);
          gen.let(valid, true);
        }) : () => (0, ref_1.callRef)(cxt, validate2);
      }
    }
    exports.dynamicRef = dynamicRef;
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/dynamic/recursiveAnchor.js
var require_recursiveAnchor = __commonJS({
  "../node_modules/ajv/dist/vocabularies/dynamic/recursiveAnchor.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dynamicAnchor_1 = require_dynamicAnchor();
    var util_1 = require_util();
    var def = {
      keyword: "$recursiveAnchor",
      schemaType: "boolean",
      code(cxt) {
        if (cxt.schema)
          (0, dynamicAnchor_1.dynamicAnchor)(cxt, "");
        else
          (0, util_1.checkStrictMode)(cxt.it, "$recursiveAnchor: false is ignored");
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/dynamic/recursiveRef.js
var require_recursiveRef = __commonJS({
  "../node_modules/ajv/dist/vocabularies/dynamic/recursiveRef.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dynamicRef_1 = require_dynamicRef();
    var def = {
      keyword: "$recursiveRef",
      schemaType: "string",
      code: (cxt) => (0, dynamicRef_1.dynamicRef)(cxt, cxt.schema)
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/dynamic/index.js
var require_dynamic = __commonJS({
  "../node_modules/ajv/dist/vocabularies/dynamic/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dynamicAnchor_1 = require_dynamicAnchor();
    var dynamicRef_1 = require_dynamicRef();
    var recursiveAnchor_1 = require_recursiveAnchor();
    var recursiveRef_1 = require_recursiveRef();
    var dynamic = [dynamicAnchor_1.default, dynamicRef_1.default, recursiveAnchor_1.default, recursiveRef_1.default];
    exports.default = dynamic;
  }
});

// ../node_modules/ajv/dist/vocabularies/validation/dependentRequired.js
var require_dependentRequired = __commonJS({
  "../node_modules/ajv/dist/vocabularies/validation/dependentRequired.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dependencies_1 = require_dependencies();
    var def = {
      keyword: "dependentRequired",
      type: "object",
      schemaType: "object",
      error: dependencies_1.error,
      code: (cxt) => (0, dependencies_1.validatePropertyDeps)(cxt)
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/applicator/dependentSchemas.js
var require_dependentSchemas = __commonJS({
  "../node_modules/ajv/dist/vocabularies/applicator/dependentSchemas.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dependencies_1 = require_dependencies();
    var def = {
      keyword: "dependentSchemas",
      type: "object",
      schemaType: "object",
      code: (cxt) => (0, dependencies_1.validateSchemaDeps)(cxt)
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/validation/limitContains.js
var require_limitContains = __commonJS({
  "../node_modules/ajv/dist/vocabularies/validation/limitContains.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: ["maxContains", "minContains"],
      type: "array",
      schemaType: "number",
      code({ keyword, parentSchema, it }) {
        if (parentSchema.contains === void 0) {
          (0, util_1.checkStrictMode)(it, `"${keyword}" without "contains" is ignored`);
        }
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/next.js
var require_next = __commonJS({
  "../node_modules/ajv/dist/vocabularies/next.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dependentRequired_1 = require_dependentRequired();
    var dependentSchemas_1 = require_dependentSchemas();
    var limitContains_1 = require_limitContains();
    var next = [dependentRequired_1.default, dependentSchemas_1.default, limitContains_1.default];
    exports.default = next;
  }
});

// ../node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedProperties.js
var require_unevaluatedProperties = __commonJS({
  "../node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    var error = {
      message: "must NOT have unevaluated properties",
      params: ({ params }) => (0, codegen_1._)`{unevaluatedProperty: ${params.unevaluatedProperty}}`
    };
    var def = {
      keyword: "unevaluatedProperties",
      type: "object",
      schemaType: ["boolean", "object"],
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, data, errsCount, it } = cxt;
        if (!errsCount)
          throw new Error("ajv implementation error");
        const { allErrors, props } = it;
        if (props instanceof codegen_1.Name) {
          gen.if((0, codegen_1._)`${props} !== true`, () => gen.forIn("key", data, (key) => gen.if(unevaluatedDynamic(props, key), () => unevaluatedPropCode(key))));
        } else if (props !== true) {
          gen.forIn("key", data, (key) => props === void 0 ? unevaluatedPropCode(key) : gen.if(unevaluatedStatic(props, key), () => unevaluatedPropCode(key)));
        }
        it.props = true;
        cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
        function unevaluatedPropCode(key) {
          if (schema === false) {
            cxt.setParams({ unevaluatedProperty: key });
            cxt.error();
            if (!allErrors)
              gen.break();
            return;
          }
          if (!(0, util_1.alwaysValidSchema)(it, schema)) {
            const valid = gen.name("valid");
            cxt.subschema({
              keyword: "unevaluatedProperties",
              dataProp: key,
              dataPropType: util_1.Type.Str
            }, valid);
            if (!allErrors)
              gen.if((0, codegen_1.not)(valid), () => gen.break());
          }
        }
        function unevaluatedDynamic(evaluatedProps, key) {
          return (0, codegen_1._)`!${evaluatedProps} || !${evaluatedProps}[${key}]`;
        }
        function unevaluatedStatic(evaluatedProps, key) {
          const ps = [];
          for (const p in evaluatedProps) {
            if (evaluatedProps[p] === true)
              ps.push((0, codegen_1._)`${key} !== ${p}`);
          }
          return (0, codegen_1.and)(...ps);
        }
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedItems.js
var require_unevaluatedItems = __commonJS({
  "../node_modules/ajv/dist/vocabularies/unevaluated/unevaluatedItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "unevaluatedItems",
      type: "array",
      schemaType: ["boolean", "object"],
      error,
      code(cxt) {
        const { gen, schema, data, it } = cxt;
        const items = it.items || 0;
        if (items === true)
          return;
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        if (schema === false) {
          cxt.setParams({ len: items });
          cxt.fail((0, codegen_1._)`${len} > ${items}`);
        } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
          const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items}`);
          gen.if((0, codegen_1.not)(valid), () => validateItems(valid, items));
          cxt.ok(valid);
        }
        it.items = true;
        function validateItems(valid, from) {
          gen.forRange("i", from, len, (i) => {
            cxt.subschema({ keyword: "unevaluatedItems", dataProp: i, dataPropType: util_1.Type.Num }, valid);
            if (!it.allErrors)
              gen.if((0, codegen_1.not)(valid), () => gen.break());
          });
        }
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/unevaluated/index.js
var require_unevaluated = __commonJS({
  "../node_modules/ajv/dist/vocabularies/unevaluated/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var unevaluatedProperties_1 = require_unevaluatedProperties();
    var unevaluatedItems_1 = require_unevaluatedItems();
    var unevaluated = [unevaluatedProperties_1.default, unevaluatedItems_1.default];
    exports.default = unevaluated;
  }
});

// ../node_modules/ajv/dist/vocabularies/format/format.js
var require_format = __commonJS({
  "../node_modules/ajv/dist/vocabularies/format/format.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
    };
    var def = {
      keyword: "format",
      type: ["number", "string"],
      schemaType: "string",
      $data: true,
      error,
      code(cxt, ruleType) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const { opts, errSchemaPath, schemaEnv, self } = it;
        if (!opts.validateFormats)
          return;
        if ($data)
          validate$DataFormat();
        else
          validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats
          });
          const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
          const fType = gen.let("fType");
          const format2 = gen.let("format");
          gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format2, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format2, fDef));
          cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
          function unknownFmt() {
            if (opts.strictSchema === false)
              return codegen_1.nil;
            return (0, codegen_1._)`${schemaCode} && !${format2}`;
          }
          function invalidFmt() {
            const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format2}(${data}) : ${format2}(${data}))` : (0, codegen_1._)`${format2}(${data})`;
            const validData = (0, codegen_1._)`(typeof ${format2} == "function" ? ${callFormat} : ${format2}.test(${data}))`;
            return (0, codegen_1._)`${format2} && ${format2} !== true && ${fType} === ${ruleType} && !${validData}`;
          }
        }
        function validateFormat() {
          const formatDef = self.formats[schema];
          if (!formatDef) {
            unknownFormat();
            return;
          }
          if (formatDef === true)
            return;
          const [fmtType, format2, fmtRef] = getFormat(formatDef);
          if (fmtType === ruleType)
            cxt.pass(validCondition());
          function unknownFormat() {
            if (opts.strictSchema === false) {
              self.logger.warn(unknownMsg());
              return;
            }
            throw new Error(unknownMsg());
            function unknownMsg() {
              return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
            }
          }
          function getFormat(fmtDef) {
            const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : void 0;
            const fmt = gen.scopeValue("formats", { key: schema, ref: fmtDef, code });
            if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) {
              return [fmtDef.type || "string", fmtDef.validate, (0, codegen_1._)`${fmt}.validate`];
            }
            return ["string", fmtDef, fmt];
          }
          function validCondition() {
            if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
              if (!schemaEnv.$async)
                throw new Error("async format in sync schema");
              return (0, codegen_1._)`await ${fmtRef}(${data})`;
            }
            return typeof format2 == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
          }
        }
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/vocabularies/format/index.js
var require_format2 = __commonJS({
  "../node_modules/ajv/dist/vocabularies/format/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var format_1 = require_format();
    var format2 = [format_1.default];
    exports.default = format2;
  }
});

// ../node_modules/ajv/dist/vocabularies/metadata.js
var require_metadata = __commonJS({
  "../node_modules/ajv/dist/vocabularies/metadata.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.contentVocabulary = exports.metadataVocabulary = void 0;
    exports.metadataVocabulary = [
      "title",
      "description",
      "default",
      "deprecated",
      "readOnly",
      "writeOnly",
      "examples"
    ];
    exports.contentVocabulary = [
      "contentMediaType",
      "contentEncoding",
      "contentSchema"
    ];
  }
});

// ../node_modules/ajv/dist/vocabularies/draft2020.js
var require_draft2020 = __commonJS({
  "../node_modules/ajv/dist/vocabularies/draft2020.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require_core2();
    var validation_1 = require_validation();
    var applicator_1 = require_applicator();
    var dynamic_1 = require_dynamic();
    var next_1 = require_next();
    var unevaluated_1 = require_unevaluated();
    var format_1 = require_format2();
    var metadata_1 = require_metadata();
    var draft2020Vocabularies = [
      dynamic_1.default,
      core_1.default,
      validation_1.default,
      (0, applicator_1.default)(true),
      format_1.default,
      metadata_1.metadataVocabulary,
      metadata_1.contentVocabulary,
      next_1.default,
      unevaluated_1.default
    ];
    exports.default = draft2020Vocabularies;
  }
});

// ../node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types = __commonJS({
  "../node_modules/ajv/dist/vocabularies/discriminator/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiscrError = void 0;
    var DiscrError;
    (function(DiscrError2) {
      DiscrError2["Tag"] = "tag";
      DiscrError2["Mapping"] = "mapping";
    })(DiscrError || (exports.DiscrError = DiscrError = {}));
  }
});

// ../node_modules/ajv/dist/vocabularies/discriminator/index.js
var require_discriminator = __commonJS({
  "../node_modules/ajv/dist/vocabularies/discriminator/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var types_1 = require_types();
    var compile_1 = require_compile();
    var ref_error_1 = require_ref_error();
    var util_1 = require_util();
    var error = {
      message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
      params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
    };
    var def = {
      keyword: "discriminator",
      type: "object",
      schemaType: "object",
      error,
      code(cxt) {
        const { gen, data, schema, parentSchema, it } = cxt;
        const { oneOf } = parentSchema;
        if (!it.opts.discriminator) {
          throw new Error("discriminator: requires discriminator option");
        }
        const tagName = schema.propertyName;
        if (typeof tagName != "string")
          throw new Error("discriminator: requires propertyName");
        if (schema.mapping)
          throw new Error("discriminator: mapping is not supported");
        if (!oneOf)
          throw new Error("discriminator: requires oneOf keyword");
        const valid = gen.let("valid", false);
        const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
        gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, { discrError: types_1.DiscrError.Tag, tag, tagName }));
        cxt.ok(valid);
        function validateMapping() {
          const mapping = getMapping();
          gen.if(false);
          for (const tagValue in mapping) {
            gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
            gen.assign(valid, applyTagSchema(mapping[tagValue]));
          }
          gen.else();
          cxt.error(false, { discrError: types_1.DiscrError.Mapping, tag, tagName });
          gen.endIf();
        }
        function applyTagSchema(schemaProp) {
          const _valid = gen.name("valid");
          const schCxt = cxt.subschema({ keyword: "oneOf", schemaProp }, _valid);
          cxt.mergeEvaluated(schCxt, codegen_1.Name);
          return _valid;
        }
        function getMapping() {
          var _a;
          const oneOfMapping = {};
          const topRequired = hasRequired(parentSchema);
          let tagRequired = true;
          for (let i = 0; i < oneOf.length; i++) {
            let sch = oneOf[i];
            if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
              const ref = sch.$ref;
              sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref);
              if (sch instanceof compile_1.SchemaEnv)
                sch = sch.schema;
              if (sch === void 0)
                throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
            }
            const propSch = (_a = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a === void 0 ? void 0 : _a[tagName];
            if (typeof propSch != "object") {
              throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
            }
            tagRequired = tagRequired && (topRequired || hasRequired(sch));
            addMappings(propSch, i);
          }
          if (!tagRequired)
            throw new Error(`discriminator: "${tagName}" must be required`);
          return oneOfMapping;
          function hasRequired({ required }) {
            return Array.isArray(required) && required.includes(tagName);
          }
          function addMappings(sch, i) {
            if (sch.const) {
              addMapping(sch.const, i);
            } else if (sch.enum) {
              for (const tagValue of sch.enum) {
                addMapping(tagValue, i);
              }
            } else {
              throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
            }
          }
          function addMapping(tagValue, i) {
            if (typeof tagValue != "string" || tagValue in oneOfMapping) {
              throw new Error(`discriminator: "${tagName}" values must be unique strings`);
            }
            oneOfMapping[tagValue] = i;
          }
        }
      }
    };
    exports.default = def;
  }
});

// ../node_modules/ajv/dist/refs/json-schema-2020-12/schema.json
var require_schema4 = __commonJS({
  "../node_modules/ajv/dist/refs/json-schema-2020-12/schema.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/schema",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/core": true,
        "https://json-schema.org/draft/2020-12/vocab/applicator": true,
        "https://json-schema.org/draft/2020-12/vocab/unevaluated": true,
        "https://json-schema.org/draft/2020-12/vocab/validation": true,
        "https://json-schema.org/draft/2020-12/vocab/meta-data": true,
        "https://json-schema.org/draft/2020-12/vocab/format-annotation": true,
        "https://json-schema.org/draft/2020-12/vocab/content": true
      },
      $dynamicAnchor: "meta",
      title: "Core and Validation specifications meta-schema",
      allOf: [
        { $ref: "meta/core" },
        { $ref: "meta/applicator" },
        { $ref: "meta/unevaluated" },
        { $ref: "meta/validation" },
        { $ref: "meta/meta-data" },
        { $ref: "meta/format-annotation" },
        { $ref: "meta/content" }
      ],
      type: ["object", "boolean"],
      $comment: "This meta-schema also defines keywords that have appeared in previous drafts in order to prevent incompatible extensions as they remain in common use.",
      properties: {
        definitions: {
          $comment: '"definitions" has been replaced by "$defs".',
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" },
          deprecated: true,
          default: {}
        },
        dependencies: {
          $comment: '"dependencies" has been split and replaced by "dependentSchemas" and "dependentRequired" in order to serve their differing semantics.',
          type: "object",
          additionalProperties: {
            anyOf: [{ $dynamicRef: "#meta" }, { $ref: "meta/validation#/$defs/stringArray" }]
          },
          deprecated: true,
          default: {}
        },
        $recursiveAnchor: {
          $comment: '"$recursiveAnchor" has been replaced by "$dynamicAnchor".',
          $ref: "meta/core#/$defs/anchorString",
          deprecated: true
        },
        $recursiveRef: {
          $comment: '"$recursiveRef" has been replaced by "$dynamicRef".',
          $ref: "meta/core#/$defs/uriReferenceString",
          deprecated: true
        }
      }
    };
  }
});

// ../node_modules/ajv/dist/refs/json-schema-2020-12/meta/applicator.json
var require_applicator2 = __commonJS({
  "../node_modules/ajv/dist/refs/json-schema-2020-12/meta/applicator.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/applicator",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/applicator": true
      },
      $dynamicAnchor: "meta",
      title: "Applicator vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        prefixItems: { $ref: "#/$defs/schemaArray" },
        items: { $dynamicRef: "#meta" },
        contains: { $dynamicRef: "#meta" },
        additionalProperties: { $dynamicRef: "#meta" },
        properties: {
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" },
          default: {}
        },
        patternProperties: {
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" },
          propertyNames: { format: "regex" },
          default: {}
        },
        dependentSchemas: {
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" },
          default: {}
        },
        propertyNames: { $dynamicRef: "#meta" },
        if: { $dynamicRef: "#meta" },
        then: { $dynamicRef: "#meta" },
        else: { $dynamicRef: "#meta" },
        allOf: { $ref: "#/$defs/schemaArray" },
        anyOf: { $ref: "#/$defs/schemaArray" },
        oneOf: { $ref: "#/$defs/schemaArray" },
        not: { $dynamicRef: "#meta" }
      },
      $defs: {
        schemaArray: {
          type: "array",
          minItems: 1,
          items: { $dynamicRef: "#meta" }
        }
      }
    };
  }
});

// ../node_modules/ajv/dist/refs/json-schema-2020-12/meta/unevaluated.json
var require_unevaluated2 = __commonJS({
  "../node_modules/ajv/dist/refs/json-schema-2020-12/meta/unevaluated.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/unevaluated",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/unevaluated": true
      },
      $dynamicAnchor: "meta",
      title: "Unevaluated applicator vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        unevaluatedItems: { $dynamicRef: "#meta" },
        unevaluatedProperties: { $dynamicRef: "#meta" }
      }
    };
  }
});

// ../node_modules/ajv/dist/refs/json-schema-2020-12/meta/content.json
var require_content = __commonJS({
  "../node_modules/ajv/dist/refs/json-schema-2020-12/meta/content.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/content",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/content": true
      },
      $dynamicAnchor: "meta",
      title: "Content vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        contentEncoding: { type: "string" },
        contentMediaType: { type: "string" },
        contentSchema: { $dynamicRef: "#meta" }
      }
    };
  }
});

// ../node_modules/ajv/dist/refs/json-schema-2020-12/meta/core.json
var require_core3 = __commonJS({
  "../node_modules/ajv/dist/refs/json-schema-2020-12/meta/core.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/core",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/core": true
      },
      $dynamicAnchor: "meta",
      title: "Core vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        $id: {
          $ref: "#/$defs/uriReferenceString",
          $comment: "Non-empty fragments not allowed.",
          pattern: "^[^#]*#?$"
        },
        $schema: { $ref: "#/$defs/uriString" },
        $ref: { $ref: "#/$defs/uriReferenceString" },
        $anchor: { $ref: "#/$defs/anchorString" },
        $dynamicRef: { $ref: "#/$defs/uriReferenceString" },
        $dynamicAnchor: { $ref: "#/$defs/anchorString" },
        $vocabulary: {
          type: "object",
          propertyNames: { $ref: "#/$defs/uriString" },
          additionalProperties: {
            type: "boolean"
          }
        },
        $comment: {
          type: "string"
        },
        $defs: {
          type: "object",
          additionalProperties: { $dynamicRef: "#meta" }
        }
      },
      $defs: {
        anchorString: {
          type: "string",
          pattern: "^[A-Za-z_][-A-Za-z0-9._]*$"
        },
        uriString: {
          type: "string",
          format: "uri"
        },
        uriReferenceString: {
          type: "string",
          format: "uri-reference"
        }
      }
    };
  }
});

// ../node_modules/ajv/dist/refs/json-schema-2020-12/meta/format-annotation.json
var require_format_annotation = __commonJS({
  "../node_modules/ajv/dist/refs/json-schema-2020-12/meta/format-annotation.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/format-annotation",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/format-annotation": true
      },
      $dynamicAnchor: "meta",
      title: "Format vocabulary meta-schema for annotation results",
      type: ["object", "boolean"],
      properties: {
        format: { type: "string" }
      }
    };
  }
});

// ../node_modules/ajv/dist/refs/json-schema-2020-12/meta/meta-data.json
var require_meta_data = __commonJS({
  "../node_modules/ajv/dist/refs/json-schema-2020-12/meta/meta-data.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/meta-data",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/meta-data": true
      },
      $dynamicAnchor: "meta",
      title: "Meta-data vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        title: {
          type: "string"
        },
        description: {
          type: "string"
        },
        default: true,
        deprecated: {
          type: "boolean",
          default: false
        },
        readOnly: {
          type: "boolean",
          default: false
        },
        writeOnly: {
          type: "boolean",
          default: false
        },
        examples: {
          type: "array",
          items: true
        }
      }
    };
  }
});

// ../node_modules/ajv/dist/refs/json-schema-2020-12/meta/validation.json
var require_validation2 = __commonJS({
  "../node_modules/ajv/dist/refs/json-schema-2020-12/meta/validation.json"(exports, module) {
    module.exports = {
      $schema: "https://json-schema.org/draft/2020-12/schema",
      $id: "https://json-schema.org/draft/2020-12/meta/validation",
      $vocabulary: {
        "https://json-schema.org/draft/2020-12/vocab/validation": true
      },
      $dynamicAnchor: "meta",
      title: "Validation vocabulary meta-schema",
      type: ["object", "boolean"],
      properties: {
        type: {
          anyOf: [
            { $ref: "#/$defs/simpleTypes" },
            {
              type: "array",
              items: { $ref: "#/$defs/simpleTypes" },
              minItems: 1,
              uniqueItems: true
            }
          ]
        },
        const: true,
        enum: {
          type: "array",
          items: true
        },
        multipleOf: {
          type: "number",
          exclusiveMinimum: 0
        },
        maximum: {
          type: "number"
        },
        exclusiveMaximum: {
          type: "number"
        },
        minimum: {
          type: "number"
        },
        exclusiveMinimum: {
          type: "number"
        },
        maxLength: { $ref: "#/$defs/nonNegativeInteger" },
        minLength: { $ref: "#/$defs/nonNegativeIntegerDefault0" },
        pattern: {
          type: "string",
          format: "regex"
        },
        maxItems: { $ref: "#/$defs/nonNegativeInteger" },
        minItems: { $ref: "#/$defs/nonNegativeIntegerDefault0" },
        uniqueItems: {
          type: "boolean",
          default: false
        },
        maxContains: { $ref: "#/$defs/nonNegativeInteger" },
        minContains: {
          $ref: "#/$defs/nonNegativeInteger",
          default: 1
        },
        maxProperties: { $ref: "#/$defs/nonNegativeInteger" },
        minProperties: { $ref: "#/$defs/nonNegativeIntegerDefault0" },
        required: { $ref: "#/$defs/stringArray" },
        dependentRequired: {
          type: "object",
          additionalProperties: {
            $ref: "#/$defs/stringArray"
          }
        }
      },
      $defs: {
        nonNegativeInteger: {
          type: "integer",
          minimum: 0
        },
        nonNegativeIntegerDefault0: {
          $ref: "#/$defs/nonNegativeInteger",
          default: 0
        },
        simpleTypes: {
          enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
        },
        stringArray: {
          type: "array",
          items: { type: "string" },
          uniqueItems: true,
          default: []
        }
      }
    };
  }
});

// ../node_modules/ajv/dist/refs/json-schema-2020-12/index.js
var require_json_schema_2020_12 = __commonJS({
  "../node_modules/ajv/dist/refs/json-schema-2020-12/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var metaSchema = require_schema4();
    var applicator = require_applicator2();
    var unevaluated = require_unevaluated2();
    var content = require_content();
    var core = require_core3();
    var format2 = require_format_annotation();
    var metadata = require_meta_data();
    var validation = require_validation2();
    var META_SUPPORT_DATA = ["/properties"];
    function addMetaSchema2020($data) {
      ;
      [
        metaSchema,
        applicator,
        unevaluated,
        content,
        core,
        with$data(this, format2),
        metadata,
        with$data(this, validation)
      ].forEach((sch) => this.addMetaSchema(sch, void 0, false));
      return this;
      function with$data(ajv2, sch) {
        return $data ? ajv2.$dataMetaSchema(sch, META_SUPPORT_DATA) : sch;
      }
    }
    exports.default = addMetaSchema2020;
  }
});

// ../node_modules/ajv/dist/2020.js
var require__ = __commonJS({
  "../node_modules/ajv/dist/2020.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv2020 = void 0;
    var core_1 = require_core();
    var draft2020_1 = require_draft2020();
    var discriminator_1 = require_discriminator();
    var json_schema_2020_12_1 = require_json_schema_2020_12();
    var META_SCHEMA_ID = "https://json-schema.org/draft/2020-12/schema";
    var Ajv20202 = class extends core_1.default {
      constructor(opts = {}) {
        super({
          ...opts,
          dynamicRef: true,
          next: true,
          unevaluated: true
        });
      }
      _addVocabularies() {
        super._addVocabularies();
        draft2020_1.default.forEach((v) => this.addVocabulary(v));
        if (this.opts.discriminator)
          this.addKeyword(discriminator_1.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        const { $data, meta } = this.opts;
        if (!meta)
          return;
        json_schema_2020_12_1.default.call(this, $data);
        this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
      }
    };
    exports.Ajv2020 = Ajv20202;
    module.exports = exports = Ajv20202;
    module.exports.Ajv2020 = Ajv20202;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Ajv20202;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function() {
      return validation_error_1.default;
    } });
    var ref_error_1 = require_ref_error();
    Object.defineProperty(exports, "MissingRefError", { enumerable: true, get: function() {
      return ref_error_1.default;
    } });
  }
});

// ../node_modules/ajv-formats/dist/formats.js
var require_formats = __commonJS({
  "../node_modules/ajv-formats/dist/formats.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatNames = exports.fastFormats = exports.fullFormats = void 0;
    function fmtDef(validate2, compare2) {
      return { validate: validate2, compare: compare2 };
    }
    exports.fullFormats = {
      // date: http://tools.ietf.org/html/rfc3339#section-5.6
      date: fmtDef(date, compareDate),
      // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
      time: fmtDef(getTime(true), compareTime),
      "date-time": fmtDef(getDateTime(true), compareDateTime),
      "iso-time": fmtDef(getTime(), compareIsoTime),
      "iso-date-time": fmtDef(getDateTime(), compareIsoDateTime),
      // duration: https://tools.ietf.org/html/rfc3339#appendix-A
      duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
      uri,
      "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
      // uri-template: https://tools.ietf.org/html/rfc6570
      "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
      // For the source: https://gist.github.com/dperini/729294
      // For test cases: https://mathiasbynens.be/demo/url-regex
      url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
      email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
      // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
      ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
      ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
      regex,
      // uuid: http://tools.ietf.org/html/rfc4122
      uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
      // JSON-pointer: https://tools.ietf.org/html/rfc6901
      // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
      "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
      "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
      // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
      "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
      // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
      // byte: https://github.com/miguelmota/is-base64
      byte,
      // signed 32 bit integer
      int32: { type: "number", validate: validateInt32 },
      // signed 64 bit integer
      int64: { type: "number", validate: validateInt64 },
      // C-type float
      float: { type: "number", validate: validateNumber },
      // C-type double
      double: { type: "number", validate: validateNumber },
      // hint to the UI to hide input strings
      password: true,
      // unchecked string payload
      binary: true
    };
    exports.fastFormats = {
      ...exports.fullFormats,
      date: fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, compareDate),
      time: fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareTime),
      "date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, compareDateTime),
      "iso-time": fmtDef(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoTime),
      "iso-date-time": fmtDef(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, compareIsoDateTime),
      // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
      uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
      "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
      // email (sources from jsen validator):
      // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
      // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
      email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    };
    exports.formatNames = Object.keys(exports.fullFormats);
    function isLeapYear(year) {
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    }
    var DATE = /^(\d\d\d\d)-(\d\d)-(\d\d)$/;
    var DAYS = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function date(str) {
      const matches = DATE.exec(str);
      if (!matches)
        return false;
      const year = +matches[1];
      const month = +matches[2];
      const day = +matches[3];
      return month >= 1 && month <= 12 && day >= 1 && day <= (month === 2 && isLeapYear(year) ? 29 : DAYS[month]);
    }
    function compareDate(d1, d2) {
      if (!(d1 && d2))
        return void 0;
      if (d1 > d2)
        return 1;
      if (d1 < d2)
        return -1;
      return 0;
    }
    var TIME = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
    function getTime(strictTimeZone) {
      return function time(str) {
        const matches = TIME.exec(str);
        if (!matches)
          return false;
        const hr = +matches[1];
        const min = +matches[2];
        const sec = +matches[3];
        const tz = matches[4];
        const tzSign = matches[5] === "-" ? -1 : 1;
        const tzH = +(matches[6] || 0);
        const tzM = +(matches[7] || 0);
        if (tzH > 23 || tzM > 59 || strictTimeZone && !tz)
          return false;
        if (hr <= 23 && min <= 59 && sec < 60)
          return true;
        const utcMin = min - tzM * tzSign;
        const utcHr = hr - tzH * tzSign - (utcMin < 0 ? 1 : 0);
        return (utcHr === 23 || utcHr === -1) && (utcMin === 59 || utcMin === -1) && sec < 61;
      };
    }
    function compareTime(s1, s2) {
      if (!(s1 && s2))
        return void 0;
      const t1 = (/* @__PURE__ */ new Date("2020-01-01T" + s1)).valueOf();
      const t2 = (/* @__PURE__ */ new Date("2020-01-01T" + s2)).valueOf();
      if (!(t1 && t2))
        return void 0;
      return t1 - t2;
    }
    function compareIsoTime(t1, t2) {
      if (!(t1 && t2))
        return void 0;
      const a1 = TIME.exec(t1);
      const a2 = TIME.exec(t2);
      if (!(a1 && a2))
        return void 0;
      t1 = a1[1] + a1[2] + a1[3];
      t2 = a2[1] + a2[2] + a2[3];
      if (t1 > t2)
        return 1;
      if (t1 < t2)
        return -1;
      return 0;
    }
    var DATE_TIME_SEPARATOR = /t|\s/i;
    function getDateTime(strictTimeZone) {
      const time = getTime(strictTimeZone);
      return function date_time(str) {
        const dateTime = str.split(DATE_TIME_SEPARATOR);
        return dateTime.length === 2 && date(dateTime[0]) && time(dateTime[1]);
      };
    }
    function compareDateTime(dt1, dt2) {
      if (!(dt1 && dt2))
        return void 0;
      const d1 = new Date(dt1).valueOf();
      const d2 = new Date(dt2).valueOf();
      if (!(d1 && d2))
        return void 0;
      return d1 - d2;
    }
    function compareIsoDateTime(dt1, dt2) {
      if (!(dt1 && dt2))
        return void 0;
      const [d1, t1] = dt1.split(DATE_TIME_SEPARATOR);
      const [d2, t2] = dt2.split(DATE_TIME_SEPARATOR);
      const res = compareDate(d1, d2);
      if (res === void 0)
        return void 0;
      return res || compareTime(t1, t2);
    }
    var NOT_URI_FRAGMENT = /\/|:/;
    var URI = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    function uri(str) {
      return NOT_URI_FRAGMENT.test(str) && URI.test(str);
    }
    var BYTE = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
    function byte(str) {
      BYTE.lastIndex = 0;
      return BYTE.test(str);
    }
    var MIN_INT32 = -(2 ** 31);
    var MAX_INT32 = 2 ** 31 - 1;
    function validateInt32(value) {
      return Number.isInteger(value) && value <= MAX_INT32 && value >= MIN_INT32;
    }
    function validateInt64(value) {
      return Number.isInteger(value);
    }
    function validateNumber() {
      return true;
    }
    var Z_ANCHOR = /[^\\]\\Z/;
    function regex(str) {
      if (Z_ANCHOR.test(str))
        return false;
      try {
        new RegExp(str);
        return true;
      } catch (e) {
        return false;
      }
    }
  }
});

// ../node_modules/ajv/dist/vocabularies/draft7.js
var require_draft7 = __commonJS({
  "../node_modules/ajv/dist/vocabularies/draft7.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require_core2();
    var validation_1 = require_validation();
    var applicator_1 = require_applicator();
    var format_1 = require_format2();
    var metadata_1 = require_metadata();
    var draft7Vocabularies = [
      core_1.default,
      validation_1.default,
      (0, applicator_1.default)(),
      format_1.default,
      metadata_1.metadataVocabulary,
      metadata_1.contentVocabulary
    ];
    exports.default = draft7Vocabularies;
  }
});

// ../node_modules/ajv/dist/refs/json-schema-draft-07.json
var require_json_schema_draft_07 = __commonJS({
  "../node_modules/ajv/dist/refs/json-schema-draft-07.json"(exports, module) {
    module.exports = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://json-schema.org/draft-07/schema#",
      title: "Core schema meta-schema",
      definitions: {
        schemaArray: {
          type: "array",
          minItems: 1,
          items: { $ref: "#" }
        },
        nonNegativeInteger: {
          type: "integer",
          minimum: 0
        },
        nonNegativeIntegerDefault0: {
          allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }]
        },
        simpleTypes: {
          enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
        },
        stringArray: {
          type: "array",
          items: { type: "string" },
          uniqueItems: true,
          default: []
        }
      },
      type: ["object", "boolean"],
      properties: {
        $id: {
          type: "string",
          format: "uri-reference"
        },
        $schema: {
          type: "string",
          format: "uri"
        },
        $ref: {
          type: "string",
          format: "uri-reference"
        },
        $comment: {
          type: "string"
        },
        title: {
          type: "string"
        },
        description: {
          type: "string"
        },
        default: true,
        readOnly: {
          type: "boolean",
          default: false
        },
        examples: {
          type: "array",
          items: true
        },
        multipleOf: {
          type: "number",
          exclusiveMinimum: 0
        },
        maximum: {
          type: "number"
        },
        exclusiveMaximum: {
          type: "number"
        },
        minimum: {
          type: "number"
        },
        exclusiveMinimum: {
          type: "number"
        },
        maxLength: { $ref: "#/definitions/nonNegativeInteger" },
        minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        pattern: {
          type: "string",
          format: "regex"
        },
        additionalItems: { $ref: "#" },
        items: {
          anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }],
          default: true
        },
        maxItems: { $ref: "#/definitions/nonNegativeInteger" },
        minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        uniqueItems: {
          type: "boolean",
          default: false
        },
        contains: { $ref: "#" },
        maxProperties: { $ref: "#/definitions/nonNegativeInteger" },
        minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        required: { $ref: "#/definitions/stringArray" },
        additionalProperties: { $ref: "#" },
        definitions: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        properties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        patternProperties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          propertyNames: { format: "regex" },
          default: {}
        },
        dependencies: {
          type: "object",
          additionalProperties: {
            anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }]
          }
        },
        propertyNames: { $ref: "#" },
        const: true,
        enum: {
          type: "array",
          items: true,
          minItems: 1,
          uniqueItems: true
        },
        type: {
          anyOf: [
            { $ref: "#/definitions/simpleTypes" },
            {
              type: "array",
              items: { $ref: "#/definitions/simpleTypes" },
              minItems: 1,
              uniqueItems: true
            }
          ]
        },
        format: { type: "string" },
        contentMediaType: { type: "string" },
        contentEncoding: { type: "string" },
        if: { $ref: "#" },
        then: { $ref: "#" },
        else: { $ref: "#" },
        allOf: { $ref: "#/definitions/schemaArray" },
        anyOf: { $ref: "#/definitions/schemaArray" },
        oneOf: { $ref: "#/definitions/schemaArray" },
        not: { $ref: "#" }
      },
      default: true
    };
  }
});

// ../node_modules/ajv/dist/ajv.js
var require_ajv = __commonJS({
  "../node_modules/ajv/dist/ajv.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv = void 0;
    var core_1 = require_core();
    var draft7_1 = require_draft7();
    var discriminator_1 = require_discriminator();
    var draft7MetaSchema = require_json_schema_draft_07();
    var META_SUPPORT_DATA = ["/properties"];
    var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
    var Ajv = class extends core_1.default {
      _addVocabularies() {
        super._addVocabularies();
        draft7_1.default.forEach((v) => this.addVocabulary(v));
        if (this.opts.discriminator)
          this.addKeyword(discriminator_1.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        if (!this.opts.meta)
          return;
        const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
        this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
        this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
      }
    };
    exports.Ajv = Ajv;
    module.exports = exports = Ajv;
    module.exports.Ajv = Ajv;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Ajv;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function() {
      return validation_error_1.default;
    } });
    var ref_error_1 = require_ref_error();
    Object.defineProperty(exports, "MissingRefError", { enumerable: true, get: function() {
      return ref_error_1.default;
    } });
  }
});

// ../node_modules/ajv-formats/dist/limit.js
var require_limit = __commonJS({
  "../node_modules/ajv-formats/dist/limit.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.formatLimitDefinition = void 0;
    var ajv_1 = require_ajv();
    var codegen_1 = require_codegen();
    var ops = codegen_1.operators;
    var KWDs = {
      formatMaximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      formatMinimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      formatExclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      formatExclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
    };
    var error = {
      message: ({ keyword, schemaCode }) => (0, codegen_1.str)`should be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
    };
    exports.formatLimitDefinition = {
      keyword: Object.keys(KWDs),
      type: "string",
      schemaType: "string",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, schemaCode, keyword, it } = cxt;
        const { opts, self } = it;
        if (!opts.validateFormats)
          return;
        const fCxt = new ajv_1.KeywordCxt(it, self.RULES.all.format.definition, "format");
        if (fCxt.$data)
          validate$DataFormat();
        else
          validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats
          });
          const fmt = gen.const("fmt", (0, codegen_1._)`${fmts}[${fCxt.schemaCode}]`);
          cxt.fail$data((0, codegen_1.or)((0, codegen_1._)`typeof ${fmt} != "object"`, (0, codegen_1._)`${fmt} instanceof RegExp`, (0, codegen_1._)`typeof ${fmt}.compare != "function"`, compareCode(fmt)));
        }
        function validateFormat() {
          const format2 = fCxt.schema;
          const fmtDef = self.formats[format2];
          if (!fmtDef || fmtDef === true)
            return;
          if (typeof fmtDef != "object" || fmtDef instanceof RegExp || typeof fmtDef.compare != "function") {
            throw new Error(`"${keyword}": format "${format2}" does not define "compare" function`);
          }
          const fmt = gen.scopeValue("formats", {
            key: format2,
            ref: fmtDef,
            code: opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(format2)}` : void 0
          });
          cxt.fail$data(compareCode(fmt));
        }
        function compareCode(fmt) {
          return (0, codegen_1._)`${fmt}.compare(${data}, ${schemaCode}) ${KWDs[keyword].fail} 0`;
        }
      },
      dependencies: ["format"]
    };
    var formatLimitPlugin = (ajv2) => {
      ajv2.addKeyword(exports.formatLimitDefinition);
      return ajv2;
    };
    exports.default = formatLimitPlugin;
  }
});

// ../node_modules/ajv-formats/dist/index.js
var require_dist2 = __commonJS({
  "../node_modules/ajv-formats/dist/index.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var formats_1 = require_formats();
    var limit_1 = require_limit();
    var codegen_1 = require_codegen();
    var fullName = new codegen_1.Name("fullFormats");
    var fastName = new codegen_1.Name("fastFormats");
    var formatsPlugin = (ajv2, opts = { keywords: true }) => {
      if (Array.isArray(opts)) {
        addFormats2(ajv2, opts, formats_1.fullFormats, fullName);
        return ajv2;
      }
      const [formats, exportName] = opts.mode === "fast" ? [formats_1.fastFormats, fastName] : [formats_1.fullFormats, fullName];
      const list = opts.formats || formats_1.formatNames;
      addFormats2(ajv2, list, formats, exportName);
      if (opts.keywords)
        (0, limit_1.default)(ajv2);
      return ajv2;
    };
    formatsPlugin.get = (name, mode = "full") => {
      const formats = mode === "fast" ? formats_1.fastFormats : formats_1.fullFormats;
      const f = formats[name];
      if (!f)
        throw new Error(`Unknown format "${name}"`);
      return f;
    };
    function addFormats2(ajv2, list, fs, exportName) {
      var _a;
      var _b;
      (_a = (_b = ajv2.opts.code).formats) !== null && _a !== void 0 ? _a : _b.formats = (0, codegen_1._)`require("ajv-formats/dist/formats").${exportName}`;
      for (const f of list)
        ajv2.addFormat(f, fs[f]);
    }
    module.exports = exports = formatsPlugin;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = formatsPlugin;
  }
});

// src/lib/schema.ts
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
function findSchemaDir(start) {
  let dir = start;
  for (let i = 0; i < 8; i++) {
    const candidate = join(dir, "schema");
    try {
      if (readdirSync(candidate).some((f) => f === "_common.json")) return candidate;
    } catch {
    }
    const up = dirname(dir);
    if (up === dir) break;
    dir = up;
  }
  throw new Error(`schema directory not found above ${start}`);
}
function isSchemaFile(file) {
  return file.endsWith(".json") && file !== SURFACE_FILE;
}
function buildAjv() {
  const ajv2 = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv2);
  const files = readdirSync(SCHEMA_DIR).filter(isSchemaFile);
  for (const file of files) {
    const doc = JSON.parse(readFileSync(join(SCHEMA_DIR, file), "utf8"));
    ajv2.addSchema(doc, file);
  }
  return ajv2;
}
function ajv() {
  ajvSingleton ??= buildAjv();
  return ajvSingleton;
}
function validatorFor(name) {
  const cached = validators.get(name);
  if (cached) return cached;
  const got = ajv().getSchema(`${name}.json`);
  if (!got) throw new Error(`schema ${name}.json is not registered`);
  validators.set(name, got);
  return got;
}
function format(errors) {
  return (errors ?? []).map((e) => ({
    path: e.instancePath === "" ? "/" : e.instancePath,
    message: `${e.message ?? "invalid"}${e.params && Object.keys(e.params).length > 0 ? ` (${JSON.stringify(e.params)})` : ""}`
  }));
}
function validate(name, doc) {
  const v = validatorFor(name);
  if (v(doc)) return { ok: true };
  return { ok: false, errors: format(v.errors) };
}
function checkSchemaTag(name, doc) {
  if (typeof doc !== "object" || doc === null) {
    return { ok: false, errors: [{ path: "/", message: "not an object" }] };
  }
  const tag = doc.schema;
  if (typeof tag !== "string") {
    return { ok: false, errors: [{ path: "/schema", message: "missing schema tag" }] };
  }
  const [tagName, major] = tag.split("/");
  if (tagName !== name) {
    return { ok: false, errors: [{ path: "/schema", message: `expected ${name}/<major>, got ${tag}` }] };
  }
  const known = SCHEMA_MAJOR[name];
  if (Number(major) !== known) {
    return {
      ok: false,
      errors: [{ path: "/schema", message: `unknown major ${major}; this runner reads ${name}/${known}` }]
    };
  }
  return { ok: true };
}
function assertValid(name, doc) {
  const tag = checkSchemaTag(name, doc);
  if (!tag.ok) throw new SchemaError(name, tag.errors);
  const res = validate(name, doc);
  if (!res.ok) throw new SchemaError(name, res.errors);
  return doc;
}
var import__, import_ajv_formats, Ajv2020, addFormats, here, SCHEMA_DIR, SCHEMA_NAMES, SCHEMA_MAJOR, SURFACE_FILE, ajvSingleton, validators, SchemaError;
var init_schema = __esm({
  "src/lib/schema.ts"() {
    "use strict";
    import__ = __toESM(require__(), 1);
    import_ajv_formats = __toESM(require_dist2(), 1);
    Ajv2020 = typeof import__.default === "function" ? import__.default : import__.default.default;
    addFormats = typeof import_ajv_formats.default === "function" ? import_ajv_formats.default : import_ajv_formats.default.default;
    here = dirname(fileURLToPath(import.meta.url));
    SCHEMA_DIR = findSchemaDir(here);
    SCHEMA_NAMES = [
      "factory",
      "policy",
      "role",
      "work-item",
      "ledger",
      "run",
      "index",
      "live",
      "baselines",
      "coverage",
      "candidates",
      "rubric",
      "review",
      "benchmark-task",
      "step-report",
      "rulepack",
      "benchmark-result"
    ];
    SCHEMA_MAJOR = Object.freeze(
      Object.fromEntries(SCHEMA_NAMES.map((n) => [n, 1]))
    );
    SURFACE_FILE = "SURFACE.json";
    validators = /* @__PURE__ */ new Map();
    SchemaError = class extends Error {
      constructor(schemaName, failures) {
        super(
          `${schemaName} is invalid:
` + failures.map((f) => `  ${f.path}: ${f.message}`).join("\n")
        );
        this.schemaName = schemaName;
        this.failures = failures;
        this.name = "SchemaError";
      }
      schemaName;
      failures;
    };
  }
});

// src/lib/config.ts
var config_exports = {};
__export(config_exports, {
  BASELINES_PATH: () => BASELINES_PATH,
  COVERAGE_PATH: () => COVERAGE_PATH,
  DEFINITION_DIR: () => DEFINITION_DIR,
  DiskLoader: () => DiskLoader,
  FACTORY_PATH: () => FACTORY_PATH,
  GUARDRAILS_DIR: () => GUARDRAILS_DIR,
  POLICY_PATH: () => POLICY_PATH,
  RefLoader: () => RefLoader,
  changedFilesSince: () => changedFilesSince,
  loadBaselines: () => loadBaselines,
  loadCoverage: () => loadCoverage,
  loadFactory: () => loadFactory,
  loadPolicy: () => loadPolicy
});
import { readFileSync as readFileSync2, existsSync } from "node:fs";
import { join as join2 } from "node:path";
import { execFileSync } from "node:child_process";
async function loadPolicy(loader) {
  const text = await loader.read(POLICY_PATH);
  if (text === null) {
    throw new Error(
      `${POLICY_PATH} is missing. The gates read it from the default branch; without it there is nothing to enforce, so they fail rather than pass.`
    );
  }
  return assertValid("policy", (0, import_yaml.parse)(text));
}
async function loadFactory(loader) {
  const text = await loader.read(FACTORY_PATH);
  if (text === null) throw new Error(`${FACTORY_PATH} is missing`);
  return assertValid("factory", (0, import_yaml.parse)(text));
}
async function loadBaselines(loader) {
  const text = await loader.read(BASELINES_PATH);
  if (text === null) return { schema: "baselines/1", rules: {} };
  return assertValid("baselines", JSON.parse(text));
}
async function loadCoverage(loader) {
  const text = await loader.read(COVERAGE_PATH);
  if (text === null) {
    return {
      schema: "coverage/1",
      high_pct: 0,
      floor_pct: 0,
      tolerance_pts: 1,
      diff_min_pct: 80,
      skips: { count: 0, cap: 10 }
    };
  }
  return assertValid("coverage", JSON.parse(text));
}
function changedFilesSince(ref) {
  try {
    const out = execFileSync("git", ["diff", "--name-only", `${ref}...HEAD`], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"]
    });
    return out.split("\n").map((s) => s.trim()).filter((s) => s !== "");
  } catch {
    return [];
  }
}
var import_yaml, DEFINITION_DIR, GUARDRAILS_DIR, POLICY_PATH, FACTORY_PATH, BASELINES_PATH, COVERAGE_PATH, DiskLoader, RefLoader;
var init_config = __esm({
  "src/lib/config.ts"() {
    "use strict";
    import_yaml = __toESM(require_dist(), 1);
    init_schema();
    DEFINITION_DIR = ".factory/definition";
    GUARDRAILS_DIR = ".factory/guardrails";
    POLICY_PATH = `${DEFINITION_DIR}/policy.yaml`;
    FACTORY_PATH = `${DEFINITION_DIR}/factory.yaml`;
    BASELINES_PATH = `${GUARDRAILS_DIR}/baselines.json`;
    COVERAGE_PATH = `${GUARDRAILS_DIR}/coverage.json`;
    DiskLoader = class {
      constructor(root = process.cwd()) {
        this.root = root;
      }
      root;
      async read(path2) {
        const full = join2(this.root, path2);
        return existsSync(full) ? readFileSync2(full, "utf8") : null;
      }
    };
    RefLoader = class {
      constructor(ref, fallback) {
        this.ref = ref;
        this.fallback = fallback;
      }
      ref;
      fallback;
      async read(path2) {
        try {
          return execFileSync("git", ["show", `${this.ref}:${path2}`], {
            encoding: "utf8",
            stdio: ["ignore", "pipe", "pipe"]
          });
        } catch {
          if (this.fallback !== void 0) return this.fallback.read(path2, this.ref);
          return null;
        }
      }
    };
  }
});

// src/lib/dataref.ts
var DATA_REF, MEDIA_REF, RefMoved, DataRefStore;
var init_dataref = __esm({
  "src/lib/dataref.ts"() {
    "use strict";
    DATA_REF = "refs/factory/data";
    MEDIA_REF = "refs/factory/media";
    RefMoved = class extends Error {
      constructor(ref) {
        super(`${ref} moved while this write was in flight`);
        this.ref = ref;
        this.name = "RefMoved";
      }
      ref;
    };
    DataRefStore = class {
      constructor(gh, ref = DATA_REF) {
        this.gh = gh;
        this.ref = ref;
      }
      gh;
      ref;
      /** The commit the ref points at, or null when the ref does not exist yet. */
      async head() {
        try {
          const r = await this.gh.get(`${this.base}/git/ref/${this.shortRef}`);
          return r.object.sha;
        } catch {
          return null;
        }
      }
      get base() {
        return `repos/${this.gh.repo}`;
      }
      get shortRef() {
        return this.ref.replace(/^refs\//, "");
      }
      /** Every path on the ref, or the subset under a prefix. */
      async list(prefix2 = "") {
        const head = await this.head();
        if (head === null) return [];
        const tree = await this.treeOf(head);
        const paths = tree.tree.filter((e) => e.type === "blob").map((e) => e.path);
        if (tree.truncated === true) {
          throw new Error(
            `${this.ref} has more entries than one tree listing returns. Run the monthly rollup squash, or read a narrower prefix.`
          );
        }
        return prefix2 === "" ? paths : paths.filter((p) => p.startsWith(prefix2));
      }
      /** One file's text, or null when it is not on the ref. */
      async read(path2) {
        const head = await this.head();
        if (head === null) return null;
        return this.readAt(head, path2);
      }
      /** One file's text as of a given commit on this ref. */
      async readAt(commit, path2) {
        const tree = await this.treeOf(commit);
        const entry = tree.tree.find((e) => e.path === path2 && e.type === "blob");
        if (entry?.sha === void 0 || entry.sha === null) return null;
        const blob = await this.gh.get(`${this.base}/git/blobs/${entry.sha}`);
        if (blob.encoding !== "base64") return blob.content;
        return Buffer.from(blob.content, "base64").toString("utf8");
      }
      async treeOf(commit) {
        const c = await this.gh.get(`${this.base}/git/commits/${commit}`);
        return this.gh.get(
          `${this.base}/git/trees/${c.tree.sha}?recursive=1`
        );
      }
      /**
       * Write a set of files as one commit. Throws RefMoved if another writer got
       * there first, so the caller can re-read and retry rather than clobber.
       */
      async commit(changes, message) {
        if (changes.length === 0) throw new Error("nothing to commit");
        const parent = await this.head();
        const entries = [];
        for (const c of changes) {
          if (c.content === null) {
            entries.push({ path: c.path, mode: "100644", type: "blob", sha: null });
            continue;
          }
          const blob = await this.gh.send("POST", `${this.base}/git/blobs`, {
            content: Buffer.from(c.content, "utf8").toString("base64"),
            encoding: "base64"
          });
          entries.push({ path: c.path, mode: "100644", type: "blob", sha: blob.sha });
        }
        const base = parent === null ? void 0 : (await this.treeOf(parent)).sha;
        const tree = await this.gh.send("POST", `${this.base}/git/trees`, {
          tree: entries,
          ...base === void 0 ? {} : { base_tree: base }
        });
        const commit = await this.gh.send("POST", `${this.base}/git/commits`, {
          message,
          tree: tree.sha,
          parents: parent === null ? [] : [parent]
        });
        if (parent === null) {
          await this.gh.send("POST", `${this.base}/git/refs`, {
            ref: this.ref,
            sha: commit.sha
          });
          return commit.sha;
        }
        try {
          await this.gh.send("PATCH", `${this.base}/git/${this.shortRef}`, {
            sha: commit.sha,
            force: false
          });
        } catch (err) {
          const current = await this.head();
          if (current !== parent) throw new RefMoved(this.ref);
          throw err;
        }
        return commit.sha;
      }
      /** Write files, re-reading and reapplying once if another writer intervened. */
      async commitWithRetry(build2, message, attempts = 4) {
        let lastError;
        for (let i = 0; i < attempts; i++) {
          try {
            return await this.commit(await build2(), message);
          } catch (err) {
            if (!(err instanceof RefMoved)) throw err;
            lastError = err;
            await new Promise((r) => setTimeout(r, 150 * (i + 1)));
          }
        }
        throw lastError;
      }
      /**
       * Replace the ref with a single parentless commit holding exactly the paths
       * given, reusing their existing blobs. This is how the media ref is bounded
       * (doc 07): deleting a file in a child commit leaves its blob reachable from
       * history, so the repository keeps paying for it. A parentless commit drops
       * the history, and with it everything not listed.
       *
       * Force is correct and necessary here: the new commit is deliberately not a
       * descendant of the old head. It is only ever used on the media ref.
       */
      async replaceWith(keep, message) {
        const head = await this.head();
        if (head === null) throw new Error(`${this.ref} does not exist`);
        const tree = await this.treeOf(head);
        const bySha = new Map(tree.tree.filter((e) => e.type === "blob").map((e) => [e.path, e.sha]));
        const entries = keep.map((path2) => {
          const sha = bySha.get(path2);
          if (sha === void 0 || sha === null) throw new Error(`${path2} is not on ${this.ref}`);
          return { path: path2, mode: "100644", type: "blob", sha };
        });
        const newTree = await this.gh.send("POST", `${this.base}/git/trees`, {
          tree: entries
        });
        const commit = await this.gh.send("POST", `${this.base}/git/commits`, {
          message,
          tree: newTree.sha,
          parents: []
        });
        await this.gh.send("PATCH", `${this.base}/git/${this.shortRef}`, {
          sha: commit.sha,
          force: true
        });
        return commit.sha;
      }
      /** Read and parse a JSON file, or null when it is absent. */
      async readJson(path2) {
        const text = await this.read(path2);
        return text === null ? null : JSON.parse(text);
      }
    };
  }
});

// src/lib/store.ts
var store_exports = {};
__export(store_exports, {
  BUDGET: () => BUDGET,
  CURSOR: () => CURSOR,
  FactoryStore: () => FactoryStore,
  INCOMING: () => INCOMING,
  INDEX: () => INDEX,
  LEDGER: () => LEDGER,
  benchmarkResultPath: () => benchmarkResultPath,
  emptyLedger: () => emptyLedger,
  json: () => json,
  livePath: () => livePath,
  reviewPath: () => reviewPath,
  runPath: () => runPath,
  schemaFor: () => schemaFor,
  stepReportPath: () => stepReportPath,
  workItemPath: () => workItemPath
});
function schemaFor(path2) {
  if (path2 === LEDGER) return "ledger";
  if (path2 === INDEX) return "index";
  if (path2.startsWith("work-items/")) return "work-item";
  if (/^runs\/[^/]+\/steps\//.test(path2)) return "step-report";
  if (path2.startsWith("runs/")) return "run";
  if (path2.startsWith("live/")) return "live";
  if (path2.startsWith("reviews/")) return "review";
  if (path2.startsWith("benchmark-results/")) return "benchmark-result";
  if (path2.startsWith("benchmarks/")) return "benchmark-task";
  return null;
}
var LEDGER, INDEX, CURSOR, INCOMING, BUDGET, workItemPath, runPath, stepReportPath, reviewPath, benchmarkResultPath, livePath, emptyLedger, FactoryStore, json;
var init_store = __esm({
  "src/lib/store.ts"() {
    "use strict";
    init_dataref();
    init_schema();
    LEDGER = "ledger.json";
    INDEX = "index.json";
    CURSOR = "events/cursor.json";
    INCOMING = "events/incoming.jsonl";
    BUDGET = "budget.json";
    workItemPath = (id) => `work-items/${id}.json`;
    runPath = (id) => `runs/${id}.json`;
    stepReportPath = (runId, role) => `runs/${runId}/steps/${role}.json`;
    reviewPath = (at) => `reviews/${at}.json`;
    benchmarkResultPath = (id) => `benchmark-results/${id}.json`;
    livePath = (runId) => `live/${runId}.json`;
    emptyLedger = (now) => ({
      schema: "ledger/1",
      updated_at: now,
      open: [],
      recent: [],
      merge_queue: []
    });
    FactoryStore = class {
      data;
      constructor(gh, ref) {
        this.data = new DataRefStore(gh, ref);
      }
      /** Read and validate one file, or null when it is absent. */
      async get(path2, schema) {
        const doc = await this.data.readJson(path2);
        if (doc === null) return null;
        assertValid(schema, doc);
        return doc;
      }
      async ledger(now) {
        return await this.get(LEDGER, "ledger") ?? emptyLedger(now);
      }
      /** Validate every change that names a known schema, then commit them as one. */
      async put(changes, message) {
        for (const c of changes) {
          if (c.content === null || !c.path.endsWith(".json")) continue;
          const schema = schemaFor(c.path);
          if (schema === null) continue;
          assertValid(schema, JSON.parse(c.content));
        }
        return this.data.commit(changes, message);
      }
    };
    json = (doc) => `${JSON.stringify(doc, null, 2)}
`;
  }
});

// src/lib/github.ts
import { spawn } from "node:child_process";
function execWithInput(file, args, opts) {
  return new Promise((resolve2, reject) => {
    const child = spawn(file, [...args], { env: opts.env, stdio: ["pipe", "pipe", "pipe"] });
    let killed = false;
    const timer = setTimeout(
      () => {
        killed = true;
        child.kill("SIGKILL");
        reject(new Error(`${file} did not finish in time and was killed`));
      },
      opts.timeoutMs ?? 15 * 60 * 1e3
    );
    let stdout = "";
    let stderr = "";
    let overflow = false;
    child.stdout.setEncoding("utf8");
    child.stderr.setEncoding("utf8");
    child.stdout.on("data", (d) => {
      if (stdout.length + d.length > opts.maxBuffer) overflow = true;
      else stdout += d;
    });
    child.stderr.on("data", (d) => {
      stderr += d.slice(0, 8192);
    });
    child.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (killed) return;
      if (overflow) reject(new Error(`output exceeded ${opts.maxBuffer} bytes`));
      else if (code === 0) resolve2({ stdout });
      else reject(Object.assign(new Error(stderr.trim() || `${file} exited ${String(code)}`), { stderr }));
    });
    child.stdin.on("error", () => void 0);
    child.stdin.end(opts.input);
  });
}
var GitHubError = class extends Error {
  constructor(path2, detail) {
    super(`GitHub request failed: ${path2}
${detail}`);
    this.path = path2;
    this.detail = detail;
    this.name = "GitHubError";
  }
  path;
  detail;
};
var GitHub = class {
  constructor(opts) {
    this.opts = opts;
  }
  opts;
  /** The `owner/repo` this client acts on. */
  get repo() {
    return this.opts.repo;
  }
  env() {
    const env = { ...process.env };
    if (this.opts.token !== void 0) env["GH_TOKEN"] = this.opts.token;
    return env;
  }
  /** GET a REST path, paginating when asked. */
  async get(path2, { paginate = false } = {}) {
    const args = ["api", path2];
    if (paginate) args.push("--paginate", "--slurp");
    try {
      const { stdout } = await execWithInput("gh", args, {
        env: this.env(),
        input: "",
        maxBuffer: 64 * 1024 * 1024,
        ...this.opts.timeoutMs === void 0 ? {} : { timeoutMs: this.opts.timeoutMs }
      });
      const parsed = JSON.parse(String(stdout));
      if (paginate && Array.isArray(parsed)) {
        return parsed.flat();
      }
      return parsed;
    } catch (err) {
      throw new GitHubError(path2, errText(err));
    }
  }
  /** POST, PATCH or PUT a REST path with a JSON body. */
  async send(method, path2, body) {
    const args = ["api", "-X", method, path2];
    if (body !== void 0) args.push("--input", "-");
    try {
      const { stdout } = await execWithInput("gh", args, {
        env: this.env(),
        input: body === void 0 ? "" : JSON.stringify(body),
        maxBuffer: 16 * 1024 * 1024,
        ...this.opts.timeoutMs === void 0 ? {} : { timeoutMs: this.opts.timeoutMs }
      });
      const text = String(stdout).trim();
      return text === "" ? {} : JSON.parse(text);
    } catch (err) {
      throw new GitHubError(path2, errText(err));
    }
  }
  get base() {
    return `repos/${this.opts.repo}`;
  }
  /* ------------------------------------------------------------- pull requests */
  async pull(number) {
    return this.get(`${this.base}/pulls/${number}`);
  }
  async pullFiles(number) {
    return this.get(`${this.base}/pulls/${number}/files?per_page=100`, { paginate: true });
  }
  async pullReviews(number) {
    return this.get(`${this.base}/pulls/${number}/reviews?per_page=100`, { paginate: true });
  }
  /* --------------------------------------------------------------- check runs */
  /** Report a gate's verdict as a check run, which is what a required check reads. */
  async reportCheck(opts) {
    await this.send("POST", `${this.base}/check-runs`, {
      name: opts.name,
      head_sha: opts.headSha,
      status: "completed",
      conclusion: opts.conclusion,
      completed_at: (/* @__PURE__ */ new Date()).toISOString(),
      output: {
        title: opts.title,
        // GitHub caps the summary at 65535 characters.
        summary: opts.summary.slice(0, 65e3),
        ...opts.text === void 0 ? {} : { text: opts.text.slice(0, 65e3) }
      }
    });
  }
  /* ---------------------------------------------------------------- dispatches */
  /**
   * Start a workflow. With no ref, it runs on the repository's default branch.
   *
   * Seven callers used to pass a literal "main", so on any repository whose
   * default branch is anything else every dispatch the factory made failed.
   */
  async dispatchWorkflow(workflow, ref, inputs) {
    const on = ref ?? await this.defaultBranch();
    await this.send("POST", `${this.base}/actions/workflows/${workflow}/dispatches`, { ref: on, inputs });
  }
  /* ------------------------------------------------------------------ contents */
  /** Read a file at a ref. The gates read policy.yaml from the default branch. */
  async fileAtRef(path2, ref) {
    try {
      const res = await this.get(
        `${this.base}/contents/${encodeURI(path2)}?ref=${encodeURIComponent(ref)}`
      );
      if (res.content === void 0) return null;
      return Buffer.from(res.content, res.encoding ?? "base64").toString("utf8");
    } catch {
      return null;
    }
  }
  async defaultBranch() {
    const r = await this.get(this.base);
    return r.default_branch;
  }
  async openPull(opts) {
    return this.send(`POST`, `${this.base}/pulls`, {
      title: opts.title,
      head: opts.head,
      base: opts.base,
      body: opts.body
    });
  }
  /** The signed-in user, for recording who contributed. */
  async viewer() {
    try {
      const r = await this.get("user");
      return r.login ?? null;
    } catch {
      return null;
    }
  }
};
function errText(err) {
  const e = err;
  return (e.stderr ?? e.stdout ?? e.message ?? String(err)).toString().trim();
}

// src/cli.ts
init_config();

// src/commands/gates-run.ts
import { readFileSync as readFileSync4, existsSync as existsSync3, mkdirSync, writeFileSync } from "node:fs";
import { join as join4 } from "node:path";

// src/commands/gates.ts
function countsFromBaselines(b) {
  const out = {};
  for (const [rule, entry] of Object.entries(b.rules)) {
    out[rule] = byFileOf(entry);
  }
  return out;
}
function byFileOf(entry) {
  if (entry.by_file !== void 0 && Object.keys(entry.by_file).length > 0) {
    return { ...entry.by_file };
  }
  return { "": entry.count };
}
function totalOf(perFile) {
  return Object.values(perFile).reduce((a, b) => a + b, 0);
}
function checkRatchet(before, after) {
  const rises = [];
  const lowered = [];
  const rules = /* @__PURE__ */ new Set([...Object.keys(before), ...Object.keys(after)]);
  for (const rule of rules) {
    const b = before[rule] ?? {};
    const a = after[rule] ?? {};
    const files = /* @__PURE__ */ new Set([...Object.keys(b), ...Object.keys(a)]);
    for (const file of files) {
      const bc = b[file] ?? 0;
      const ac = a[file] ?? 0;
      if (ac > bc) rises.push({ rule, file, before: bc, after: ac });
    }
    const bt = totalOf(b);
    const at = totalOf(a);
    if (at < bt) lowered.push({ rule, by: bt - at });
  }
  return { ok: rises.length === 0, rises, lowered };
}
function checkWeakening(input, policy) {
  const detects = new Set(policy.weakening.detects);
  const found = [];
  const { before, after } = input;
  if (detects.has("rule_removed")) {
    for (const rule of before.rules) {
      if (!after.rules.includes(rule)) {
        found.push({ kind: "rule_removed", detail: `rule ${rule} was removed` });
      }
    }
    for (const rule of Object.keys(before.baselines.rules)) {
      const wasRetired = before.baselines.rules[rule]?.retired === true;
      if (!wasRetired && after.baselines.rules[rule] === void 0 && after.rules.includes(rule)) {
        found.push({ kind: "rule_removed", detail: `baseline entry for ${rule} was removed` });
      }
    }
  }
  if (detects.has("rule_loosened")) {
    for (const rule of input.loosenedRules ?? []) {
      found.push({ kind: "rule_loosened", detail: `rule ${rule} was loosened` });
    }
  }
  if (detects.has("baseline_raised")) {
    for (const [rule, afterEntry] of Object.entries(after.baselines.rules)) {
      const beforeEntry = before.baselines.rules[rule];
      if (beforeEntry === void 0) continue;
      if (afterEntry.count > beforeEntry.count) {
        found.push({
          kind: "baseline_raised",
          detail: `baseline for ${rule} rose from ${beforeEntry.count} to ${afterEntry.count}`
        });
      }
      if (beforeEntry.retired === true && afterEntry.retired !== true && afterEntry.count > 0) {
        found.push({
          kind: "baseline_raised",
          detail: `retired rule ${rule} was given a baseline of ${afterEntry.count} again`
        });
      }
      const bf = beforeEntry.by_file ?? {};
      const af = afterEntry.by_file ?? {};
      for (const file of Object.keys(af)) {
        const b = bf[file] ?? 0;
        const a = af[file] ?? 0;
        if (a > b) {
          found.push({
            kind: "baseline_raised",
            detail: `baseline for ${rule} in ${file} rose from ${b} to ${a}`
          });
        }
      }
    }
  }
  if (detects.has("native_suppressions_added")) {
    const b = before.nativeSuppressions ?? {};
    const a = after.nativeSuppressions ?? {};
    for (const key of Object.keys(a)) {
      const bc = b[key] ?? 0;
      const ac = a[key] ?? 0;
      if (ac > bc) {
        found.push({
          kind: "native_suppressions_added",
          detail: `native suppressions for ${key} rose from ${bc} to ${ac}`
        });
      }
    }
  }
  if (detects.has("unpruned_suppressions_allowed")) {
    if (after.passOnUnprunedSuppressions === true && before.passOnUnprunedSuppressions !== true) {
      found.push({
        kind: "unpruned_suppressions_allowed",
        detail: "a setting now lets stale suppressions pass"
      });
    }
  }
  if (detects.has("coverage_floor_lowered")) {
    if (after.coverage.floor_pct < before.coverage.floor_pct) {
      found.push({
        kind: "coverage_floor_lowered",
        detail: `coverage floor fell from ${before.coverage.floor_pct}% to ${after.coverage.floor_pct}%`
      });
    }
    if (after.coverage.diff_min_pct < before.coverage.diff_min_pct) {
      found.push({
        kind: "coverage_floor_lowered",
        detail: `diff-coverage minimum fell from ${before.coverage.diff_min_pct}% to ${after.coverage.diff_min_pct}%`
      });
    }
    if (after.coverage.skips.cap > before.coverage.skips.cap) {
      found.push({
        kind: "coverage_floor_lowered",
        detail: `skip cap rose from ${before.coverage.skips.cap} to ${after.coverage.skips.cap}`
      });
    }
  }
  if (detects.has("skip_without_reason")) {
    for (const where of input.skipsWithoutReason ?? []) {
      found.push({ kind: "skip_without_reason", detail: `skip without a reason at ${where}` });
    }
  }
  return found;
}
function checkCoverage(current, measured) {
  const failures = [];
  if (measured.diff_pct < current.diff_min_pct) {
    failures.push(
      `diff coverage ${measured.diff_pct}% is below the minimum ${current.diff_min_pct}%`
    );
  }
  if (measured.total_pct < current.floor_pct) {
    failures.push(
      `total coverage ${measured.total_pct}% is below the floor ${current.floor_pct}%`
    );
  }
  if (measured.skips > current.skips.cap) {
    failures.push(`${measured.skips} skips exceed the cap of ${current.skips.cap}`);
  }
  const high = Math.max(current.high_pct, measured.total_pct);
  const next = {
    schema: "coverage/1",
    high_pct: high,
    floor_pct: Math.max(current.floor_pct, round1(high - current.tolerance_pts)),
    tolerance_pts: current.tolerance_pts,
    diff_min_pct: current.diff_min_pct,
    skips: { count: measured.skips, cap: current.skips.cap }
  };
  return { ok: failures.length === 0, failures, next };
}
function round1(n) {
  return Math.round(n * 10) / 10;
}
function planGates(req) {
  const done = new Set(req.alreadyChecked[req.commit] ?? []);
  const reasons = [];
  if (done.has("static") && done.has("verification")) {
    reasons.push(`commit ${req.commit} was already checked; results are keyed by commit`);
    return { static: false, tests: false, coverage: false, agentVerification: false, reasons };
  }
  const runStatic = !done.has("static");
  const verificationDone = done.has("verification");
  if (req.actor === "human") {
    const labelled = req.labels.includes(req.verifyLabel);
    if (!labelled) reasons.push("human PR: deterministic gates only, nothing spent on models");
    else reasons.push(`human PR carries ${req.verifyLabel}: agent verification runs too`);
    return {
      static: runStatic,
      tests: !verificationDone,
      coverage: !verificationDone,
      agentVerification: labelled && !verificationDone,
      reasons
    };
  }
  if (req.isUpdateFromMain) {
    const agentVerification = req.mainTouchesFeatureFolders && !verificationDone;
    reasons.push(
      agentVerification ? "queue update, and main's changes touch this PR's feature folders: agent verification re-runs" : "queue update: static rules and tests re-run, agent verification does not"
    );
    return { static: runStatic, tests: true, coverage: true, agentVerification, reasons };
  }
  return {
    static: runStatic,
    tests: !verificationDone,
    coverage: !verificationDone,
    agentVerification: !verificationDone,
    reasons
  };
}

// src/lib/tools.ts
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { existsSync as existsSync2, readFileSync as readFileSync3 } from "node:fs";
import { join as join3, relative, isAbsolute } from "node:path";
var exec = promisify(execFile);
function addCount(counts, rule, file) {
  const byFile = counts[rule] ??= {};
  byFile[file] = (byFile[file] ?? 0) + 1;
}
function rel(root, file) {
  const p = isAbsolute(file) ? relative(root, file) : file;
  return p.split("\\").join("/");
}
async function runEslint(root, paths = ["."]) {
  const bin = join3(root, "node_modules", "eslint", "bin", "eslint.js");
  if (!existsSync2(bin)) {
    return { tool: "eslint", counts: {}, findings: [], unavailable: true, detail: "eslint is not installed" };
  }
  let stdout;
  try {
    const res = await exec(
      process.execPath,
      [bin, ...paths, "--format", "json"],
      { cwd: root, encoding: "utf8", maxBuffer: 128 * 1024 * 1024 }
    );
    stdout = String(res.stdout);
  } catch (err) {
    const e = err;
    if (typeof e.stdout === "string" && e.stdout.trim().startsWith("[")) {
      stdout = e.stdout;
    } else {
      return {
        tool: "eslint",
        counts: {},
        findings: [],
        unavailable: true,
        detail: (e.stderr ?? e.message ?? "eslint failed").toString().slice(0, 4e3)
      };
    }
  }
  const results = JSON.parse(stdout);
  const counts = {};
  const findings = [];
  for (const file of results) {
    const path2 = rel(root, file.filePath);
    for (const m of file.messages) {
      if (m.ruleId === null) continue;
      addCount(counts, m.ruleId, path2);
      findings.push({
        rule: m.ruleId,
        file: path2,
        ...m.line === void 0 ? {} : { line: m.line },
        message: m.message,
        severity: m.severity >= 2 ? "error" : "warning"
      });
    }
  }
  return { tool: "eslint", counts, findings, unavailable: false, detail: "" };
}
function eslintSuppressions(root) {
  const file = join3(root, "eslint-suppressions.json");
  if (!existsSync2(file)) return {};
  try {
    const doc = JSON.parse(readFileSync3(file, "utf8"));
    const out = {};
    for (const [path2, rules] of Object.entries(doc)) {
      for (const [rule, entry] of Object.entries(rules)) {
        const key = `eslint:${rule}`;
        out[key] = (out[key] ?? 0) + (entry?.count ?? 0);
        void path2;
      }
    }
    return out;
  } catch {
    return {};
  }
}
async function runRuff(root, paths = ["."]) {
  let stdout;
  try {
    const res = await exec("ruff", ["check", "--no-cache", "--output-format", "json", ...paths], {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 128 * 1024 * 1024
    });
    stdout = String(res.stdout);
  } catch (err) {
    const e = err;
    if (typeof e.stdout === "string" && e.stdout.trim().startsWith("[")) {
      stdout = e.stdout;
    } else {
      return {
        tool: "ruff",
        counts: {},
        findings: [],
        unavailable: true,
        detail: (e.stderr ?? e.message ?? "ruff failed").toString().slice(0, 4e3)
      };
    }
  }
  const hits = JSON.parse(stdout);
  const counts = {};
  const findings = [];
  for (const h of hits) {
    const rule = h.code ?? "ruff";
    const path2 = rel(root, h.filename);
    addCount(counts, rule, path2);
    findings.push({
      rule,
      file: path2,
      ...h.location?.row === void 0 ? {} : { line: h.location.row },
      message: h.message,
      severity: "error"
    });
  }
  return { tool: "ruff", counts, findings, unavailable: false, detail: "" };
}
function readCoverage(root) {
  const summary = join3(root, "coverage", "coverage-summary.json");
  if (existsSync2(summary)) return fromIstanbulSummary(root, summary);
  const lcov = join3(root, "coverage", "lcov.info");
  if (existsSync2(lcov)) return fromLcov(root, lcov);
  const py = join3(root, "coverage.xml");
  if (existsSync2(py)) return fromCoberturaish(root, py);
  return null;
}
function fromIstanbulSummary(root, file) {
  try {
    const doc = JSON.parse(readFileSync3(file, "utf8"));
    const byFile = {};
    for (const [key, entry] of Object.entries(doc)) {
      if (key === "total") continue;
      const lines = entry.lines ?? {};
      byFile[rel(root, key)] = { covered: lines.covered ?? 0, total: lines.total ?? 0 };
    }
    const total = doc["total"]?.lines?.pct;
    return { total_pct: typeof total === "number" ? total : overall(byFile), by_file: byFile };
  } catch {
    return null;
  }
}
function fromLcov(root, file) {
  try {
    const text = readFileSync3(file, "utf8");
    const byFile = {};
    let current = null;
    let found = 0;
    let hit = 0;
    for (const line of text.split("\n")) {
      if (line.startsWith("SF:")) {
        current = rel(root, line.slice(3).trim());
        found = 0;
        hit = 0;
      } else if (line.startsWith("LF:")) {
        found = Number(line.slice(3));
      } else if (line.startsWith("LH:")) {
        hit = Number(line.slice(3));
      } else if (line.startsWith("end_of_record") && current !== null) {
        byFile[current] = { covered: hit, total: found };
        current = null;
      }
    }
    return { total_pct: overall(byFile), by_file: byFile };
  } catch {
    return null;
  }
}
function fromCoberturaish(root, file) {
  try {
    const text = readFileSync3(file, "utf8");
    const byFile = {};
    const classRe = /<class[^>]*filename="([^"]+)"[\s\S]*?<\/class>/g;
    for (const m of text.matchAll(classRe)) {
      const path2 = rel(root, m[1] ?? "");
      const block = m[0];
      let covered = 0;
      let total = 0;
      for (const line of block.matchAll(/<line[^>]*hits="(\d+)"[^>]*\/>/g)) {
        total++;
        if (Number(line[1]) > 0) covered++;
      }
      byFile[path2] = { covered, total };
    }
    if (Object.keys(byFile).length === 0) return null;
    return { total_pct: overall(byFile), by_file: byFile };
  } catch {
    return null;
  }
}
function overall(byFile) {
  let covered = 0;
  let total = 0;
  for (const v of Object.values(byFile)) {
    covered += v.covered;
    total += v.total;
  }
  if (total === 0) return 0;
  return Math.round(covered / total * 1e3) / 10;
}
function diffCoverage(coverage, changedFiles2) {
  let covered = 0;
  let total = 0;
  for (const file of changedFiles2) {
    const entry = coverage.by_file[file];
    if (entry === void 0) continue;
    covered += entry.covered;
    total += entry.total;
  }
  if (total === 0) return null;
  return Math.round(covered / total * 1e3) / 10;
}
async function countSkips(root) {
  const patterns = [
    /\b(?:it|test|describe)\.skip\s*\(/g,
    /\b(?:it|test|describe)\.todo\s*\(/g,
    /@pytest\.mark\.skip/g,
    /\bt\.Skip\s*\(/g
  ];
  let count = 0;
  const files = await listSourceFiles(root);
  for (const f of files) {
    let text;
    try {
      text = readFileSync3(f, "utf8");
    } catch {
      continue;
    }
    for (const re of patterns) count += [...text.matchAll(re)].length;
  }
  return count;
}
var SKIP_DIRS = /* @__PURE__ */ new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  "target",
  "vendor",
  ".venv",
  "venv",
  "__pycache__",
  ".next",
  "coverage",
  ".bsf-rule-check"
]);
async function listSourceFiles(root) {
  const { readdirSync: readdirSync8 } = await import("node:fs");
  const out = [];
  const walk2 = (dir, depth) => {
    if (depth > 8) return;
    let entries;
    try {
      entries = readdirSync8(dir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const e of entries) {
      if (SKIP_DIRS.has(e.name)) continue;
      const full = join3(dir, e.name);
      if (e.isDirectory()) walk2(full, depth + 1);
      else if (/\.(ts|tsx|js|jsx|mjs|cjs|py|go)$/.test(e.name)) out.push(full);
    }
  };
  walk2(root, 0);
  return out;
}

// src/commands/gates-run.ts
function measuredCounts(results) {
  const merged = {};
  for (const r of results) {
    for (const [rule, byFile] of Object.entries(r.counts)) {
      const target = merged[rule] ??= {};
      for (const [file, n] of Object.entries(byFile)) {
        target[file] = (target[file] ?? 0) + n;
      }
    }
  }
  return merged;
}
function withZeroBaselines(baselines, measured) {
  const before = countsFromBaselines(baselines);
  const out = {};
  for (const [rule, byFile] of Object.entries(before)) out[rule] = { ...byFile };
  for (const rule of Object.keys(measured)) {
    if (out[rule] === void 0) out[rule] = {};
  }
  return out;
}
async function runStaticGate(input) {
  const { root } = input;
  const results = [];
  const unavailable2 = [];
  if (existsSync3(join4(root, "node_modules", "eslint", "bin", "eslint.js"))) {
    const r = await runEslint(root);
    if (r.unavailable) unavailable2.push({ tool: "eslint", detail: r.detail });
    else results.push(r);
  }
  if (existsSync3(join4(root, "pyproject.toml")) || existsSync3(join4(root, "ruff.toml"))) {
    const r = await runRuff(root);
    if (r.unavailable) unavailable2.push({ tool: "ruff", detail: r.detail });
    else results.push(r);
  }
  const measured = measuredCounts(results);
  const before = withZeroBaselines(input.baselineBefore, measured);
  const ratchet = checkRatchet(before, measured);
  const weakening = checkWeakening(
    {
      before: {
        baselines: input.baselineBefore,
        coverage: input.coverageBefore,
        rules: Object.keys(countsFromBaselines(input.baselineBefore)),
        nativeSuppressions: eslintSuppressions(root)
      },
      after: {
        baselines: input.baselineAfter,
        coverage: input.coverageAfter,
        rules: Object.keys(countsFromBaselines(input.baselineAfter)),
        nativeSuppressions: eslintSuppressions(root)
      },
      ...input.loosenedRules === void 0 ? {} : { loosenedRules: input.loosenedRules }
    },
    input.policy
  );
  const conclusion = ratchet.ok && weakening.length === 0 ? unavailable2.length > 0 && results.length === 0 ? "neutral" : "success" : "failure";
  return {
    conclusion,
    ratchet,
    weakening,
    findings: results.flatMap((r) => r.findings),
    toolsRun: results.map((r) => r.tool),
    toolsUnavailable: unavailable2,
    summary: summarizeStatic({ ratchet, weakening, results, unavailable: unavailable2 })
  };
}
function summarizeStatic(args) {
  const lines = [];
  if (args.weakening.length > 0) {
    lines.push("## A guardrail got weaker", "");
    lines.push("This needs a trusted human's approval, whatever the auto-merge toggles say.", "");
    for (const w of args.weakening) lines.push(`- **${w.kind}** \u2014 ${w.detail}`);
    lines.push("");
  }
  if (!args.ratchet.ok) {
    lines.push("## New violations", "");
    lines.push(
      "Counts are kept per file, so fixing one violation somewhere does not pay for a new one elsewhere.",
      ""
    );
    for (const r of args.ratchet.rises.slice(0, 50)) {
      lines.push(`- \`${r.file}\` \u2014 **${r.rule}** rose from ${r.before} to ${r.after}`);
    }
    if (args.ratchet.rises.length > 50) {
      lines.push(`- \u2026and ${args.ratchet.rises.length - 50} more`);
    }
    lines.push("");
  }
  if (args.ratchet.ok && args.weakening.length === 0) {
    lines.push("No rule's count rose in any file, and no guardrail got weaker.", "");
    if (args.ratchet.lowered.length > 0) {
      lines.push("Counts that fell:", "");
      for (const l of args.ratchet.lowered) lines.push(`- **${l.rule}** down by ${l.by}`);
      lines.push("");
    }
  }
  if (args.unavailable.length > 0) {
    lines.push("## Tools that could not run", "");
    for (const u of args.unavailable) lines.push(`- **${u.tool}** \u2014 ${u.detail.split("\n")[0] ?? ""}`);
    lines.push("", "A tool that cannot run is not a pass. Fix the toolchain.", "");
  }
  lines.push(`Ran: ${args.results.map((r) => r.tool).join(", ") || "nothing"}`);
  return lines.join("\n");
}
async function runCoverageGate(args) {
  const coverage = readCoverage(args.root);
  const skips = await countSkips(args.root);
  if (coverage === null) {
    return {
      conclusion: args.current.floor_pct === 0 ? "neutral" : "failure",
      diff_pct: null,
      total_pct: null,
      skips,
      failures: args.current.floor_pct === 0 ? [] : [`no coverage report found, but the floor is ${args.current.floor_pct}%`],
      next: null,
      summary: args.current.floor_pct === 0 ? "No coverage report, and no floor to meet yet. Gardening adds tests per feature folder." : `No coverage report was produced, so the ${args.current.floor_pct}% floor cannot be checked.`
    };
  }
  const diff = diffCoverage(coverage, args.changedFiles);
  const verdict = checkCoverage(args.current, {
    // Nothing measurable in the changed files is not zero coverage: it means
    // the change touched nothing the report covers, such as a config file.
    diff_pct: diff ?? 100,
    total_pct: coverage.total_pct,
    skips
  });
  const lines = [];
  lines.push(
    `| | measured | required |`,
    `| --- | --- | --- |`,
    `| diff coverage | ${diff === null ? "nothing measurable" : `${diff}%`} | ${args.current.diff_min_pct}% |`,
    `| total coverage | ${coverage.total_pct}% | ${args.current.floor_pct}% floor |`,
    `| skipped tests | ${skips} | ${args.current.skips.cap} cap |`,
    ""
  );
  if (diff === null) {
    lines.push(
      "None of the changed files appear in the coverage report, so there is no diff coverage to measure. That is different from measuring zero.",
      ""
    );
  }
  for (const f of verdict.failures) lines.push(`- ${f}`);
  if (verdict.ok && verdict.next.high_pct > args.current.high_pct) {
    lines.push("", `Total coverage rose, so the high mark moves to ${verdict.next.high_pct}% and the floor to ${verdict.next.floor_pct}%.`);
  }
  return {
    conclusion: verdict.ok ? "success" : "failure",
    diff_pct: diff,
    total_pct: coverage.total_pct,
    skips,
    failures: verdict.failures,
    next: verdict.next,
    summary: lines.join("\n")
  };
}
var RESULTS_DIR = ".factory/.gate-results";
function recordGateResult(root, record) {
  const dir = join4(root, RESULTS_DIR);
  mkdirSync(dir, { recursive: true });
  const file = join4(dir, `${record.commit}.json`);
  const existing = readGateResults(root, record.commit);
  const merged = [...existing.filter((r) => r.gate !== record.gate), record];
  writeFileSync(file, `${JSON.stringify(merged, null, 2)}
`);
}
function readGateResults(root, commit) {
  const file = join4(root, RESULTS_DIR, `${commit}.json`);
  if (!existsSync3(file)) return [];
  try {
    return JSON.parse(readFileSync4(file, "utf8"));
  } catch {
    return [];
  }
}
function alreadyChecked(root, commit) {
  return readGateResults(root, commit).filter((r) => r.result !== "skipped").map((r) => r.gate);
}

// src/commands/policy-run.ts
init_config();

// ../node_modules/balanced-match/dist/esm/index.js
var range = (a, b, str) => {
  let begs, beg, left, right = void 0, result;
  let ai = str.indexOf(a);
  let bi = str.indexOf(b, ai + 1);
  let i = ai;
  if (ai >= 0 && bi > 0) {
    if (a === b) {
      return [ai, bi];
    }
    begs = [];
    left = str.length;
    while (i >= 0 && !result) {
      if (i === ai) {
        begs.push(i);
        ai = str.indexOf(a, i + 1);
      } else if (begs.length === 1) {
        const r = begs.pop();
        if (r !== void 0)
          result = [r, bi];
      } else {
        beg = begs.pop();
        if (beg !== void 0 && beg < left) {
          left = beg;
          right = bi;
        }
        bi = str.indexOf(b, i + 1);
      }
      i = ai < bi && ai >= 0 ? ai : bi;
    }
    if (begs.length && right !== void 0) {
      result = [left, right];
    }
  }
  return result;
};

// ../node_modules/brace-expansion/dist/esm/index.js
var escSlash = "\0SLASH" + Math.random().toFixed(16) + "\0";
var escOpen = "\0OPEN" + Math.random().toFixed(16) + "\0";
var escClose = "\0CLOSE" + Math.random().toFixed(16) + "\0";
var escComma = "\0COMMA" + Math.random().toFixed(16) + "\0";
var escPeriod = "\0PERIOD" + Math.random().toFixed(16) + "\0";
var escSlashPattern = new RegExp(escSlash, "g");
var escOpenPattern = new RegExp(escOpen, "g");
var escClosePattern = new RegExp(escClose, "g");
var escCommaPattern = new RegExp(escComma, "g");
var escPeriodPattern = new RegExp(escPeriod, "g");
var slashPattern = /\\\\/g;
var openPattern = /\\{/g;
var closePattern = /\\}/g;
var commaPattern = /\\,/g;
var periodPattern = /\\\./g;
var EXPANSION_MAX = 1e5;
var EXPANSION_MAX_LENGTH = 4e6;
var EXPANSION_MAX_DEPTH = 1e3;
var EXPANSION_MAX_REWRITES = 1e3;
var EXPANSION_MAX_STEPS = 2e7;
var CALL_STEPS = 16;
function numeric(str) {
  return !isNaN(str) ? parseInt(str, 10) : str.charCodeAt(0);
}
function escapeBraces(str) {
  return str.replace(slashPattern, escSlash).replace(openPattern, escOpen).replace(closePattern, escClose).replace(commaPattern, escComma).replace(periodPattern, escPeriod);
}
function unescapeBraces(str) {
  return str.replace(escSlashPattern, "\\").replace(escOpenPattern, "{").replace(escClosePattern, "}").replace(escCommaPattern, ",").replace(escPeriodPattern, ".");
}
function pushAll(target, items) {
  for (let i = 0; i < items.length; i++) {
    target.push(items[i]);
  }
}
function balancedWithBudget(str, masked, budget) {
  if (budget.remaining < 0) {
    return void 0;
  }
  const r = range("{", "}", masked);
  const unmatched = r !== void 0 && masked.indexOf("{") < r[0];
  budget.remaining -= r && !unmatched ? r[1] + 1 : str.length;
  if (!r || budget.remaining < 0) {
    return void 0;
  }
  return {
    end: r[1],
    pre: str.slice(0, r[0]),
    body: str.slice(r[0] + 1, r[1]),
    post: str.slice(r[1] + 1),
    unmatched
  };
}
function maskUnmatchedOpens(masked, budget) {
  budget.remaining -= masked.length;
  const open = [];
  for (let i = 0; i < masked.length; i++) {
    const c = masked.charCodeAt(i);
    if (c === 123) {
      open.push(i);
    } else if (c === 125 && open.length) {
      open.pop();
    }
  }
  let out = "";
  let last = 0;
  for (let i = 0; i < open.length; i++) {
    const at = open[i];
    out += masked.slice(last, at) + "\0";
    last = at + 1;
  }
  return out + masked.slice(last);
}
function commaSetFollows(str, budget) {
  budget.remaining -= str.length;
  if (budget.remaining < 0) {
    return false;
  }
  let close = false;
  for (let i = str.length - 1; i >= 0; i--) {
    const c = str.charCodeAt(i);
    if (c === 125) {
      close = true;
    } else if (c === 10 || c === 13 || c === 8232 || c === 8233) {
      close = false;
    } else if (c === 44 && close && str.charCodeAt(i + 1) !== 44) {
      return true;
    }
  }
  return false;
}
function parseCommaParts(str, budget) {
  const parts = [];
  let carry = "";
  for (; ; ) {
    const m = balancedWithBudget(str, str, budget);
    if (budget.remaining < 0) {
      return void 0;
    }
    if (!m) {
      const tail2 = str.split(",");
      tail2[0] = carry + tail2[0];
      pushAll(parts, tail2);
      return parts;
    }
    const { pre, body, post } = m;
    const p = pre.split(",");
    p[0] = carry + p[0];
    p[p.length - 1] += "{" + body + "}";
    if (!post.length) {
      pushAll(parts, p);
      return parts;
    }
    carry = p.pop();
    pushAll(parts, p);
    str = post;
  }
}
function bound(value, fallback) {
  return value === void 0 || isNaN(value) ? fallback : value;
}
function expand(str, options = {}) {
  if (!str) {
    return [];
  }
  const max = bound(options.max, EXPANSION_MAX);
  const maxLength = bound(options.maxLength, EXPANSION_MAX_LENGTH);
  const maxDepth = bound(options.maxDepth, EXPANSION_MAX_DEPTH);
  const maxRewrites = bound(options.maxRewrites, EXPANSION_MAX_REWRITES);
  const maxSteps = bound(options.maxSteps, EXPANSION_MAX_STEPS);
  if (str.slice(0, 2) === "{}") {
    str = "\\{\\}" + str.slice(2);
  }
  return expand_(escapeBraces(str), max, maxLength, maxDepth, 0, maxRewrites, { remaining: maxSteps }, true).map(unescapeBraces);
}
function embrace(str) {
  return "{" + str + "}";
}
function isPadded(el) {
  return /^-?0\d/.test(el);
}
function lte(i, y) {
  return i <= y;
}
function gte(i, y) {
  return i >= y;
}
function combine(acc, pre, values, max, maxLength, dropEmpties, budget) {
  const out = [];
  let length = 0;
  let nonEmpty;
  outer: for (let a = 0; a < acc.length; a++) {
    const prefix2 = acc[a] + pre;
    let vs = values;
    if (dropEmpties && !prefix2) {
      if (!nonEmpty)
        nonEmpty = values.filter((v) => v);
      vs = nonEmpty;
    }
    for (let v = 0; v < vs.length; v++) {
      if (out.length >= max)
        break outer;
      const expansion = prefix2 + vs[v];
      if (length + expansion.length > maxLength)
        break outer;
      out.push(expansion);
      length += expansion.length;
    }
  }
  budget.remaining -= out.length;
  return out;
}
function expandSequence(body, isAlphaSequence, max, maxLength, budget) {
  const n = body.split(/\.\./);
  const N = [];
  if (n[0] === void 0 || n[1] === void 0) {
    return N;
  }
  const x = numeric(n[0]);
  const y = numeric(n[1]);
  const width = Math.max(n[0].length, n[1].length);
  let incr = n.length === 3 && n[2] !== void 0 ? Math.max(Math.abs(numeric(n[2])), 1) : 1;
  let test = lte;
  const reverse = y < x;
  if (reverse) {
    incr *= -1;
    test = gte;
  }
  const pad = n.some(isPadded);
  const cost = pad ? width : 1;
  let length = 0;
  for (let i = x; test(i, y) && N.length < max; i += incr) {
    budget.remaining -= cost;
    if (budget.remaining < 0) {
      return void 0;
    }
    let c;
    if (isAlphaSequence) {
      c = String.fromCharCode(i);
      if (c === "\\") {
        c = "";
      }
    } else {
      c = String(i);
      if (pad) {
        const need = width - c.length;
        if (need > 0) {
          const z = new Array(need + 1).join("0");
          if (i < 0) {
            c = "-" + z + c.slice(1);
          } else {
            c = z + c;
          }
        }
      }
    }
    if (length + c.length > maxLength)
      break;
    N.push(c);
    length += c.length;
  }
  return N;
}
function expand_(str, max, maxLength, maxDepth, depth, maxRewrites, budget, isTop) {
  budget.remaining -= CALL_STEPS;
  if (depth > maxDepth) {
    return [str];
  }
  let acc = [""];
  let rewrites = 0;
  let dropEmpties = false;
  let firstGroup = true;
  let masked = str;
  for (; ; ) {
    const m = balancedWithBudget(str, masked, budget);
    if (!m) {
      return combine(acc, str, [""], max, maxLength, dropEmpties, budget);
    }
    if (m.unmatched) {
      masked = maskUnmatchedOpens(masked, budget);
    }
    const pre = m.pre;
    const literal2 = () => combine(acc, pre + "{" + m.body + "}" + m.post, [""], max, maxLength, dropEmpties, budget);
    if (/\$$/.test(pre)) {
      acc = combine(acc, pre + "{" + m.body + "}", [""], max, maxLength, dropEmpties && !m.post.length, budget);
      firstGroup = false;
      if (!m.post.length)
        break;
      str = m.post;
      masked = masked.slice(m.end + 1);
      continue;
    }
    const isNumericSequence = /^-?\d+\.\.-?\d+(?:\.\.-?\d+)?$/.test(m.body);
    const isAlphaSequence = /^[a-zA-Z]\.\.[a-zA-Z](?:\.\.-?\d+)?$/.test(m.body);
    const isSequence = isNumericSequence || isAlphaSequence;
    const isOptions = m.body.indexOf(",") >= 0;
    if (!isSequence && !isOptions) {
      if (rewrites < maxRewrites && commaSetFollows(m.post, budget)) {
        rewrites++;
        str = m.pre + "{" + m.body + escClose + m.post;
        masked = masked.slice(0, m.end) + escClose + masked.slice(m.end + 1);
        isTop = true;
        continue;
      }
      return literal2();
    }
    if (firstGroup) {
      dropEmpties = isTop && !isSequence;
      firstGroup = false;
    }
    let values;
    if (isSequence) {
      values = expandSequence(m.body, isAlphaSequence, max, maxLength, budget);
      if (!values) {
        return literal2();
      }
    } else {
      let n = parseCommaParts(m.body, budget);
      if (!n) {
        return literal2();
      }
      if (n.length === 1 && n[0] !== void 0) {
        n = expand_(n[0], max, maxLength, maxDepth, depth + 1, maxRewrites, budget, false).map(embrace);
        if (budget.remaining < 0) {
          return literal2();
        }
        if (n.length === 1) {
          const next2 = combine(acc, pre + n[0], [""], max, maxLength, dropEmpties && !m.post.length, budget);
          if (budget.remaining < 0) {
            return literal2();
          }
          acc = next2;
          if (!m.post.length)
            break;
          str = m.post;
          masked = masked.slice(m.end + 1);
          continue;
        }
      }
      let dropsEmpties = dropEmpties && !m.post.length && !pre;
      for (let d = 0; dropsEmpties && d < acc.length; d++) {
        if (acc[d]) {
          dropsEmpties = false;
        }
      }
      values = [];
      let valuesLength = 0;
      outer: for (let j = 0; j < n.length; j++) {
        const expanded = expand_(n[j], max, maxLength, maxDepth, depth + 1, maxRewrites, budget, false);
        if (budget.remaining < 0) {
          return literal2();
        }
        for (let k = 0; k < expanded.length; k++) {
          const v = expanded[k];
          if (dropsEmpties && !v)
            continue;
          if (values.length >= max || valuesLength + v.length > maxLength) {
            break outer;
          }
          values.push(v);
          valuesLength += v.length;
        }
      }
    }
    const next = combine(acc, pre, values, max, maxLength, dropEmpties && !m.post.length, budget);
    if (budget.remaining < 0) {
      return literal2();
    }
    acc = next;
    if (!m.post.length)
      break;
    str = m.post;
    masked = masked.slice(m.end + 1);
  }
  return acc;
}

// ../node_modules/@isaacs/nonrecursive-glob-match/dist/esm/numeric-range.js
var digit = (a, b) => a === b ? { t: "lit", ch: String(a) } : { t: "class", re: new RegExp(`^[${a}-${b}]$`) };
var prefix = (d, alts) => alts.map((s) => [digit(d, d), ...s]);
var fixed = (a, b) => {
  if (!a)
    return [[]];
  let lo = +a[0];
  let hi = +b[0];
  const ra = a.slice(1);
  const rb = b.slice(1);
  if (lo === hi)
    return prefix(lo, fixed(ra, rb));
  const zeros = "0".repeat(ra.length);
  const nines = "9".repeat(ra.length);
  const out = [];
  if (ra !== zeros)
    out.push(...prefix(lo++, fixed(ra, nines)));
  const last = rb === nines ? [] : prefix(hi--, fixed(zeros, rb));
  if (lo <= hi) {
    out.push([digit(lo, hi), ...Array.from(ra, () => digit(0, 9))]);
  }
  out.push(...last);
  return out;
};
var nonneg = (a, b, width) => {
  if (width) {
    return fixed(String(a).padStart(width, "0"), String(b).padStart(width, "0"));
  }
  const out = [];
  for (let len = String(a).length; len <= String(b).length; len++) {
    const lo = Math.max(a, len === 1 ? 0 : 10 ** (len - 1));
    const hi = Math.min(b, 10 ** len - 1);
    out.push(...fixed(String(lo), String(hi)));
  }
  return out;
};
var numericRange = (loStr, hiStr) => {
  let lo = Number(loStr);
  let hi = Number(hiStr);
  if (!Number.isSafeInteger(lo) || !Number.isSafeInteger(hi))
    return;
  if (lo > hi)
    [lo, hi] = [hi, lo];
  const padded = /^-?0\d/.test(loStr) || /^-?0\d/.test(hiStr);
  const width = padded ? Math.max(loStr.length, hiStr.length) : 0;
  const out = [];
  if (lo < 0) {
    const neg = nonneg(Math.max(-hi, 1), -lo, width && width - 1);
    out.push(...neg.map((s) => [{ t: "lit", ch: "-" }, ...s]));
  }
  if (hi >= 0)
    out.push(...nonneg(Math.max(lo, 0), hi, width));
  return out;
};

// ../node_modules/@isaacs/nonrecursive-glob-match/dist/esm/parse-class.js
var posixClasses = {
  "[:alnum:]": ["\\p{L}\\p{Nl}\\p{Nd}"],
  "[:alpha:]": ["\\p{L}\\p{Nl}"],
  "[:ascii:]": ["\\x00-\\x7f"],
  "[:blank:]": ["\\p{Zs}\\t"],
  "[:cntrl:]": ["\\p{Cc}"],
  "[:digit:]": ["\\p{Nd}"],
  "[:graph:]": ["\\p{Z}\\p{C}", true],
  "[:lower:]": ["\\p{Ll}"],
  "[:print:]": ["\\p{C}", true],
  "[:punct:]": ["\\p{P}\\p{S}"],
  "[:space:]": ["\\p{Z}\\t\\r\\n\\v\\f"],
  "[:upper:]": ["\\p{Lu}"],
  "[:word:]": ["\\p{L}\\p{Nl}\\p{Nd}\\p{Pc}"],
  "[:xdigit:]": ["A-Fa-f0-9"]
};
var braceEscape = (s) => s.replace(/[[\]\\-]/g, "\\$&");
var noMatch = /$./;
var parseClass = (glob, position, nocase = false, form) => {
  const norm = (c) => {
    const n = form ? c.normalize(form) : c;
    return [...n].length === 1 ? n : c;
  };
  const pos = position;
  if (glob.charAt(pos) !== "[") {
    throw new Error("not in a brace expression");
  }
  const ranges = [];
  const negs = [];
  let i = pos + 1;
  let sawStart = false;
  let escaping = false;
  let negate = false;
  let endPos = pos;
  let rangeStart = "";
  WHILE: while (i < glob.length) {
    const c = String.fromCodePoint(glob.codePointAt(i));
    if ((c === "!" || c === "^") && i === pos + 1) {
      negate = true;
      i++;
      continue;
    }
    if (c === "]" && sawStart && !escaping) {
      endPos = i + 1;
      break;
    }
    sawStart = true;
    if (c === "\\") {
      if (!escaping) {
        escaping = true;
        i++;
        continue;
      }
    }
    if (c === "[" && !escaping) {
      for (const [cls, [unip, neg]] of Object.entries(posixClasses)) {
        if (glob.startsWith(cls, i)) {
          if (rangeStart) {
            return [noMatch, glob.length - pos];
          }
          i += cls.length;
          if (neg)
            negs.push(unip);
          else
            ranges.push(unip);
          continue WHILE;
        }
      }
    }
    escaping = false;
    const n = norm(c);
    if (rangeStart) {
      if (n.codePointAt(0) > rangeStart.codePointAt(0)) {
        ranges.push(braceEscape(rangeStart) + "-" + braceEscape(n));
      } else if (n === rangeStart) {
        ranges.push(braceEscape(n));
      }
      rangeStart = "";
      i += c.length;
      continue;
    }
    if (glob.startsWith("-]", i + c.length)) {
      ranges.push(braceEscape(n + "-"));
      i += c.length + 1;
      continue;
    }
    if (glob.startsWith("-", i + c.length)) {
      rangeStart = n;
      i += c.length + 1;
      continue;
    }
    ranges.push(braceEscape(n));
    i += c.length;
  }
  if (endPos < i) {
    return [noMatch, 0];
  }
  if (!ranges.length && !negs.length) {
    return [noMatch, glob.length - pos];
  }
  const sranges = "[" + (negate ? "^" : "") + ranges.join("") + "]";
  const snegs = "[" + (negate ? "" : "^") + negs.join("") + "]";
  const comb = "^" + (ranges.length && negs.length ? "(" + sranges + "|" + snegs + ")" : ranges.length ? sranges : snegs);
  return [new RegExp(comb, nocase ? "iu" : "u"), endPos - pos];
};

// ../node_modules/@isaacs/nonrecursive-glob-match/dist/esm/index.js
var MATCH = { t: "match", id: 0 };
var extTypes = "!?+*@";
var lit = (ch) => ({ t: "lit", ch });
var reEscape = (s) => s.replace(/[\\^$.*+?()[\]{}|/]/g, "\\$&");
var newFoldRe = (s) => new RegExp(`^${reEscape(s)}$`, "iu");
var foldCache = /* @__PURE__ */ new Map();
var foldRe = (ch) => {
  let re = foldCache.get(ch);
  if (!re) {
    re = newFoldRe(ch);
    if (foldCache.size >= 1e3)
      foldCache.clear();
    foldCache.set(ch, re);
  }
  return re;
};
var litMatch = (l, c) => {
  if (c === l.ch)
    return true;
  if (!l.re)
    return false;
  const code = c.charCodeAt(0);
  if (code >= 128)
    return l.re.test(c);
  const ascii = l.ascii ??= new Uint8Array(128);
  ascii[code] ||= l.re.test(c) ? 1 : 2;
  return ascii[code] === 1;
};
var tokenize = (p, nocase, noext, form, mark) => {
  const toks = [];
  for (let i = 0; i < p.length; ) {
    const c = String.fromCodePoint(p.codePointAt(i));
    if (mark) {
      const m = c === "\\" && p.startsWith(mark, i + 1) ? 1 : 0;
      if (m || c === mark) {
        const start = i + m + mark.length;
        const end = p.indexOf(mark, start);
        const r = /^(-?\d+)\.\.(-?\d+)$/.exec(p.slice(start, end));
        const alts = end !== -1 && r && numericRange(r[1], r[2]);
        if (alts) {
          toks.push({ t: "ext", type: "@", alts });
          i = end + mark.length;
          continue;
        }
      }
    }
    if (c === "\\") {
      const e = p.codePointAt(i + 1);
      const ch = e === void 0 ? c : String.fromCodePoint(e);
      toks.push(lit(ch));
      i += 1 + ch.length;
      continue;
    }
    if (c === "[") {
      const [re, consumed] = parseClass(p, i, nocase, form);
      if (consumed) {
        toks.push({ t: "class", re });
        i += consumed;
        continue;
      }
    }
    if (!noext && extTypes.includes(c) && p[i + 1] === "(") {
      toks.push({ t: "open", type: c });
      i += 2;
      continue;
    }
    toks.push(!noext && c === "|" ? { t: "bar" } : !noext && c === ")" ? { t: "close" } : c === "*" ? { t: "star" } : c === "?" ? { t: "any" } : lit(c));
    i += c.length;
  }
  return toks;
};
var pair = (toks) => {
  const pairs = /* @__PURE__ */ new Map();
  const stack = [];
  toks.forEach((tok, i) => {
    if (tok.t === "open")
      stack.push(i);
    else if (tok.t === "close" && stack.length)
      pairs.set(stack.pop(), i);
  });
  return pairs;
};
var build = (toks, pairs, start, end, top) => {
  let seq = [];
  const alts = [seq];
  for (let i = start; i < end; i++) {
    const tok = toks[i];
    const close = pairs.get(i);
    if (tok.t === "open" && close !== void 0) {
      const sub = build(toks, pairs, i + 1, close, false);
      seq.push({ t: "ext", type: tok.type, alts: sub });
      i = close;
    } else if (tok.t === "bar" && !top) {
      alts.push(seq = []);
    } else if (tok.t === "open") {
      seq.push(lit(tok.type), lit("("));
    } else if (tok.t === "bar") {
      seq.push(lit("|"));
    } else if (tok.t === "close") {
      seq.push(lit(")"));
    } else {
      seq.push(tok);
    }
  }
  return alts;
};
var normalize = (items, form) => {
  const out = [];
  let run = "";
  const flush = () => {
    for (const ch of run.normalize(form))
      out.push(lit(ch));
    run = "";
  };
  for (const it of items) {
    if (it.t === "lit") {
      run += it.ch;
      continue;
    }
    flush();
    out.push(it.t === "ext" ? { ...it, alts: it.alts.map((a) => normalize(a, form)) } : it);
  }
  flush();
  return out;
};
var compile = (items, nocase) => {
  let id = 1;
  const split = (out) => ({ t: "split", id: id++, out });
  const seq = (items2, next) => items2.reduceRight((next2, it) => item(it, next2), next);
  const item = (it, next) => {
    switch (it.t) {
      case "lit":
        const re = nocase ? foldRe(it.ch) : void 0;
        return { t: "lit", id: id++, ch: it.ch, re, next };
      case "any":
      case "star":
        return { t: it.t, id: id++, next };
      case "class":
        return { t: "class", id: id++, re: it.re, next };
    }
    const alts = (next2) => it.alts.map((a) => seq(a, next2));
    switch (it.type) {
      case "@":
        return split(alts(next));
      case "?":
        return split([next, ...alts(next)]);
      case "!":
        return { t: "neg", id: id++, sub: split(alts(MATCH)), next };
    }
    const after = split([]);
    const entry = split(alts(after));
    after.out.push(next, entry);
    return it.type === "*" ? after : entry;
  };
  const start = seq(items, MATCH);
  return [start, id];
};
var show = (start) => {
  const lines = [];
  const seen = /* @__PURE__ */ new Set();
  const ref = (n) => n.t === "match" ? "match" : String(n.id);
  const walk2 = (n, indent) => {
    if (n.t === "match" || seen.has(n))
      return;
    seen.add(n);
    const line = (desc) => lines.push(`${indent}${n.id}: ${desc}`);
    switch (n.t) {
      case "split":
        line(`split -> ${n.out.map(ref).join(", ")}`);
        for (const o of n.out)
          walk2(o, indent);
        return;
      case "neg":
        line(`!(${ref(n.sub)}) -> ${ref(n.next)}`);
        walk2(n.sub, indent + "  ");
        return walk2(n.next, indent);
      case "lit":
        line(`${JSON.stringify(n.ch)} -> ${ref(n.next)}`);
        break;
      case "class":
        line(`${n.re} -> ${ref(n.next)}`);
        break;
      default:
        line(`${n.t === "any" ? "?" : "*"} -> ${ref(n.next)}`);
    }
    walk2(n.next, indent);
  };
  walk2(start, "");
  return [`start -> ${ref(start)}`, ...lines].join("\n");
};
var State = class {
  // set by the Sim, to mark the nodes that this state has
  gen;
  threads = [];
  match = false;
  runs = [];
  // the sorted ids of the threads, with 0 for a match, once the
  // state is done
  ids = [];
  constructor(gen) {
    this.gen = gen;
  }
  // no threads, so nothing more can match
  get dead() {
    return !this.threads.length && !this.match && !this.runs.length;
  }
};
var sameState = (a, b) => {
  if (a.ids.length !== b.ids.length)
    return false;
  if (a.runs.length !== b.runs.length)
    return false;
  if (a.ids.some((id, i) => id !== b.ids[i]))
    return false;
  return a.runs.every((r) => b.runs.some((o) => o.neg === r.neg && sameState(o.state, r.state)));
};
var marks = (size) => ({
  has: new Float64Array(size),
  seen: new Float64Array(size),
  gen: 0
});
var Sim = class {
  // `.` and `..` only match literal dots, even with `dot:true`
  dots;
  // the string starts with `.`, and `dot:true` is not set
  dotStart;
  #marks;
  constructor(dots, dotStart, marks2) {
    this.dots = dots;
    this.dotStart = dotStart;
    this.#marks = marks2;
  }
  state() {
    return new State(++this.#marks.gen);
  }
  // sort the ids of a state, once it has all of its threads
  done(state) {
    state.ids = state.threads.map((n) => n.id).sort((a, b) => a - b);
    if (state.match)
      state.ids.unshift(MATCH.id);
    return state;
  }
  // true the first time that the state walks through the node, so
  // that loops in the graph stop
  #visit(state, node) {
    const { seen } = this.#marks;
    if (seen[node.id] === state.gen)
      return false;
    seen[node.id] = state.gen;
    return true;
  }
  #addThread(state, node) {
    const { has } = this.#marks;
    if (has[node.id] === state.gen)
      return false;
    has[node.id] = state.gen;
    state.threads.push(node);
    return true;
  }
  // wildcards only match a leading dot if `dot:true`. In a negated
  // sub-pattern, this does not apply, because the negation itself
  // can not match a leading dot.
  restricted(i, top) {
    return top && (this.dots || this.dotStart && i === 0);
  }
  add(state, node, i, top) {
    switch (node.t) {
      case "split":
        if (!this.#visit(state, node))
          return;
        for (const o of node.out)
          this.add(state, o, i, top);
        return;
      case "neg":
        if (!this.#visit(state, node))
          return;
        const sub = this.state();
        this.add(sub, node.sub, i, false);
        this.done(sub);
        return this.addRun(state, { t: "run", neg: node, state: sub }, i, top);
      case "star":
        if (this.restricted(i, top))
          return;
        if (this.#addThread(state, node))
          this.add(state, node.next, i, top);
        return;
      case "match":
        state.match = true;
        return;
      default:
        this.#addThread(state, node);
    }
  }
  addRun(state, run, i, top) {
    for (const r of state.runs) {
      if (r.neg === run.neg && sameState(r.state, run.state))
        return;
    }
    state.runs.push(run);
    if (!run.state.match) {
      this.add(state, run.neg.next, i, top);
    }
  }
  // the threads after char `c`, at index `i`
  step(state, c, i, top) {
    const next = this.state();
    for (const th of state.threads) {
      switch (th.t) {
        case "lit":
          if (litMatch(th, c)) {
            this.add(next, th.next, i + 1, top);
          }
          break;
        case "any":
          if (!this.restricted(i, top))
            this.add(next, th.next, i + 1, top);
          break;
        case "class":
          if (!this.restricted(i, top) && th.re.test(c)) {
            this.add(next, th.next, i + 1, top);
          }
          break;
        case "star":
          if (!this.restricted(i, top))
            this.add(next, th, i + 1, top);
      }
    }
    if (!this.restricted(i, top)) {
      for (const run of state.runs) {
        if (run.state.dead) {
          this.addRun(next, run, i + 1, top);
          continue;
        }
        const sub = this.step(run.state, c, i, false);
        this.addRun(next, { t: "run", neg: run.neg, state: sub }, i + 1, top);
      }
    }
    return this.done(next);
  }
};
var stateKey = (state) => {
  const ids = state.ids.join();
  if (!state.runs.length)
    return ids;
  const runs = state.runs.map((r) => `${r.neg.id}(${stateKey(r.state)})`);
  return `${ids}|${runs.sort().join("|")}`;
};
var DFA_BUDGET = 1 << 18;
var Dfa = class {
  #start;
  #states = /* @__PURE__ */ new Map();
  #size = 0;
  #plain;
  #dotStart;
  #sim;
  #dotSim;
  constructor(start, marks2) {
    this.#start = start;
    this.#sim = new Sim(false, false, marks2);
    this.#dotSim = new Sim(false, true, marks2);
  }
  #make(state) {
    return {
      state,
      match: state.match,
      dead: state.dead,
      next: /* @__PURE__ */ new Map()
    };
  }
  #intern(state) {
    const key = stateKey(state);
    const found = this.#states.get(key);
    if (found)
      return found;
    if (this.#size > DFA_BUDGET)
      this.#clear();
    const d = this.#make(state);
    this.#states.set(key, d);
    this.#size += key.length + 1;
    return d;
  }
  #clear() {
    this.#states.clear();
    this.#size = 0;
    this.#plain = void 0;
    this.#dotStart = void 0;
  }
  start(dotStart) {
    if (dotStart) {
      if (this.#dotStart)
        return this.#dotStart;
      const state2 = this.#dotSim.state();
      this.#dotSim.add(state2, this.#start, 0, true);
      return this.#dotStart = this.#make(this.#dotSim.done(state2));
    }
    if (this.#plain)
      return this.#plain;
    const state = this.#sim.state();
    this.#sim.add(state, this.#start, 0, true);
    return this.#plain = this.#intern(this.#sim.done(state));
  }
  // the next state, after a miss in `d.ascii`
  next(d, c) {
    const code = c.charCodeAt(0);
    const found = code < 128 ? void 0 : d.next.get(c);
    if (found)
      return found;
    const n = d === this.#dotStart ? this.#intern(this.#dotSim.step(d.state, c, 0, true)) : this.#intern(this.#sim.step(d.state, c, 1, true));
    if (code < 128) {
      if (!d.ascii) {
        d.ascii = new Array(128);
        this.#size += 128;
      }
      d.ascii[code] = n;
    } else {
      d.next.set(c, n);
    }
    this.#size++;
    return n;
  }
};
var linear = (start) => {
  const nodes = [];
  for (let n = start; n.t !== "match"; n = n.next) {
    if (n.t === "split" || n.t === "neg")
      return void 0;
    nodes.push(n);
  }
  return nodes;
};
var testLinear = (nodes, chars, start, end) => {
  let ni = 0;
  let ci = start;
  let starNi = -1;
  let starCi = 0;
  while (ci < end) {
    const n = nodes[ni];
    if (n?.t === "star") {
      starNi = ni++;
      starCi = ci;
      continue;
    }
    const c = chars[ci];
    if (n && (n.t === "any" || n.t === "lit" && litMatch(n, c) || n.t === "class" && n.re.test(c))) {
      ni++;
      ci++;
      continue;
    }
    if (starNi === -1)
      return false;
    ni = starNi + 1;
    ci = ++starCi;
  }
  while (nodes[ni]?.t === "star")
    ni++;
  return ni === nodes.length;
};
var lengths = (items) => {
  let min = 0;
  let max = 0;
  for (const it of items) {
    const [lo, hi] = itemLengths(it);
    min += lo;
    max += hi;
  }
  return [min, max];
};
var itemLengths = (it) => {
  if (it.t === "star")
    return [0, Infinity];
  if (it.t !== "ext")
    return [1, 1];
  if (it.type === "!")
    return [0, Infinity];
  const alts = it.alts.map(lengths);
  const min = Math.min(...alts.map((a) => a[0]));
  const max = Math.max(...alts.map((a) => a[1]));
  const loop = max === 0 ? 0 : Infinity;
  return it.type === "@" ? [min, max] : it.type === "?" ? [0, max] : it.type === "*" ? [0, loop] : [min, loop];
};
var hasAffix = (lits, chars, start) => {
  for (let j = 0; j < lits.length; j++) {
    if (!litMatch(lits[j], chars[start + j]))
      return false;
  }
  return true;
};
var slashOrSurrogate = /[/\ud800-\udfff]/;
var surrogate = /[\ud800-\udfff]/;
var codePoints = (s) => surrogate.test(s) ? [...s] : s;
var noSlash = (s) => {
  if (s.includes("/")) {
    throw new Error("can only match a single path portion, got: " + s);
  }
};
var Matcher = class {
  pattern;
  options;
  #start;
  // the number of node ids
  #size;
  #marks;
  // the Sim for strings that are only `.` or `..`
  #dotsSim;
  // the string to compare, if the pattern has no magic. With
  // `nocase:true`, the RegExp that folds case is made when it is
  // first used.
  #literal;
  #literalFold = false;
  #literalRe;
  // the nodes between the prefix and suffix, if the graph is a
  // single chain
  #linear;
  // the linear nodes are only `*` and `?`, so the length bounds and
  // the prefix and suffix decide the match
  #wild = false;
  // the least and most chars that a match can have
  #min = 0;
  #max = Infinity;
  // the literals that a match must start and end with. Each one
  // matches exactly one char, and they are distinct items in the
  // pattern, so a string that does not have them can not match.
  #prefix = [];
  #suffix = [];
  // the prefix and suffix as strings, if they do not fold case
  #prefixStr;
  #suffixStr;
  // there is a prefix or suffix to check
  #affix = false;
  #dfa;
  #form;
  constructor(pattern, options = {}) {
    if (pattern.includes("/")) {
      throw new Error("can only match a single path portion, got pattern: " + pattern);
    }
    this.pattern = pattern;
    this.options = options;
    const { nocase = false, noext = false, normalize: n } = options;
    this.#form = n === true ? "NFC" : n || void 0;
    const literal2 = /^[?*+@]\(\)$/.test(pattern);
    const toks = tokenize(pattern, nocase, noext || literal2, this.#form, options.rangeMark);
    let [items] = build(toks, pair(toks), 0, toks.length, true);
    if (this.#form)
      items = normalize(items, this.#form);
    const [start, size] = compile(items, nocase);
    this.#start = start;
    this.#size = size;
    if (items.every((it) => it.t === "lit")) {
      this.#literal = items.map((it) => it.ch).join("");
      this.#literalFold = nocase;
    } else {
      const lit2 = (it) => it.t !== "lit" ? void 0 : nocase ? { ch: it.ch, re: foldRe(it.ch) } : { ch: it.ch };
      for (const it of items) {
        const l = lit2(it);
        if (!l)
          break;
        this.#prefix.push(l);
      }
      for (let j = items.length - 1; j >= 0; j--) {
        const l = lit2(items[j]);
        if (!l)
          break;
        this.#suffix.unshift(l);
      }
      this.#affix = !!(this.#prefix.length || this.#suffix.length);
      if (!nocase) {
        this.#prefixStr = this.#prefix.map((l) => l.ch).join("");
        this.#suffixStr = this.#suffix.map((l) => l.ch).join("");
      }
      this.#linear = linear(this.#start)?.slice(this.#prefix.length, -this.#suffix.length || void 0);
      this.#wild = !!this.#linear?.every((n2) => n2.t === "star" || n2.t === "any");
      const [min, max] = lengths(items);
      this.#min = min;
      this.#max = max;
    }
  }
  test(s) {
    if (this.#form) {
      noSlash(s);
      return this.#test(s.normalize(this.#form));
    }
    if (slashOrSurrogate.test(s)) {
      noSlash(s);
      return this.#test(s, [...s]);
    }
    return this.#test(s, s);
  }
  /**
   * The same as {@link Matcher#test}, but the string is not checked
   * for `/` chars, so the result for a string that has one is not
   * defined. Only use it for a string that is known to be one path
   * portion, such as a part of a path that was split on `/`. It can
   * be faster, because some patterns do not need to look at each char
   * of the string.
   */
  testUnchecked(s) {
    return this.#test(this.#form ? s.normalize(this.#form) : s);
  }
  // Test a string that has no `/`. `chars` indexes it by code point.
  // If it is not given, it is only found if a step needs it.
  #test(s, chars) {
    if (this.#literal !== void 0) {
      return this.#literalFold ? (this.#literalRe ??= newFoldRe(this.#literal)).test(s) : s === this.#literal;
    }
    const min = this.#min;
    const max = this.#max;
    if (chars === void 0) {
      const most = s.length;
      const least = most + 1 >> 1;
      if (most < min || least > max)
        return false;
      if (least < min || most > max)
        chars = codePoints(s);
    }
    if (chars !== void 0 && (chars.length < min || chars.length > max)) {
      return false;
    }
    const prefix2 = this.#prefix.length;
    if (this.#affix) {
      if (this.#prefixStr !== void 0 && this.#suffixStr !== void 0) {
        if (!s.startsWith(this.#prefixStr) || !s.endsWith(this.#suffixStr)) {
          return false;
        }
      } else {
        chars ??= codePoints(s);
        const end = chars.length - this.#suffix.length;
        if (!hasAffix(this.#prefix, chars, 0) || !hasAffix(this.#suffix, chars, end)) {
          return false;
        }
      }
    }
    const dotStart = !this.options.dot && s.startsWith(".");
    if (this.#linear) {
      if (s === "." || s === "..")
        return false;
      if (dotStart && !prefix2)
        return false;
      if (this.#wild)
        return true;
      chars ??= codePoints(s);
      const end = chars.length - this.#suffix.length;
      return testLinear(this.#linear, chars, prefix2, end);
    }
    chars ??= codePoints(s);
    if (s === "." || s === "..") {
      this.#marks ??= marks(this.#size);
      const sim = this.#dotsSim ??= new Sim(true, false, this.#marks);
      const start = sim.state();
      sim.add(start, this.#start, 0, true);
      let state = sim.done(start);
      for (let i = 0; i < chars.length; i++) {
        state = sim.step(state, chars[i], i, true);
      }
      return state.match;
    }
    this.#marks ??= marks(this.#size);
    const dfa = this.#dfa ??= new Dfa(this.#start, this.#marks);
    let d = dfa.start(dotStart);
    const str = chars === s;
    for (let i = 0; i < chars.length; i++) {
      if (d.dead)
        return false;
      const code = str ? s.charCodeAt(i) : chars[i].charCodeAt(0);
      d = d.ascii?.[code] ?? dfa.next(d, chars[i]);
    }
    return d.match;
  }
  /** a readable listing of the state machine */
  toString() {
    return show(this.#start);
  }
};

// ../node_modules/minimatch/dist/esm/assert-valid-pattern.js
var MAX_PATTERN_LENGTH = 1024 * 64;
var assertValidPattern = (pattern) => {
  if (typeof pattern !== "string") {
    throw new TypeError("invalid pattern");
  }
  if (pattern.length > MAX_PATTERN_LENGTH) {
    throw new TypeError("pattern is too long");
  }
};

// ../node_modules/minimatch/dist/esm/escape.js
var escape2 = (s, { windowsPathsNoEscape = false, magicalBraces = false } = {}) => {
  const e = magicalBraces ? windowsPathsNoEscape ? s.replace(/[?*()[\]{}]/g, "[$&]") : s.replace(/[?*()[\]\\{}]/g, "\\$&") : windowsPathsNoEscape ? s.replace(/[?*()[\]]/g, "[$&]") : s.replace(/[?*()[\]\\]/g, "\\$&");
  const c = e.charAt(0);
  if (c === "#") {
    return (windowsPathsNoEscape ? "[#]" : "\\#") + e.slice(1);
  }
  if (c === "!") {
    return (windowsPathsNoEscape ? "@(!)" : "\\!") + e.slice(1);
  }
  return e;
};

// ../node_modules/minimatch/dist/esm/unescape.js
var unescape = (s, { windowsPathsNoEscape = false, magicalBraces = true } = {}) => {
  if (windowsPathsNoEscape && s.startsWith("@(!)")) {
    return "!" + unescape(s.slice(4), { windowsPathsNoEscape, magicalBraces });
  }
  if (magicalBraces) {
    return windowsPathsNoEscape ? s.replace(/\[([^/\\])\]/g, "$1") : s.replace(/((?!\\).|^)\[([^/\\])\]/g, "$1$2").replace(/\\([^/])/g, "$1");
  }
  return windowsPathsNoEscape ? s.replace(/\[([^/\\{}])\]/g, "$1") : s.replace(/((?!\\).|^)\[([^/\\{}])\]/g, "$1$2").replace(/\\([^/{}])/g, "$1");
};

// ../node_modules/minimatch/dist/esm/index.js
var DEFAULT_BRACE_EXPAND_MAX = 1e5;
var DEFAULT_GLOB_STAR_RECURSION_MAX = 200;
var AWE_KEY = "allowWindowsEscape";
var minimatch = (p, pattern, options) => {
  assertValidPattern(pattern);
  if (!options?.nocomment && pattern.charAt(0) === "#") {
    return false;
  }
  return cachedMinimatch(pattern, options).match(p);
};
var cache = /* @__PURE__ */ new Map();
var oldCache = /* @__PURE__ */ new Map();
var cacheSize = 0;
var cacheTotalWeight = 0;
var cacheMax = 256;
var cacheMaxWeight = 1 << 15;
var cacheMaxEntryWeight = 1 << 12;
var cacheWeight = (mm) => {
  let w = mm.pattern.length;
  for (const s of mm.globSet) {
    w += s.length + 1;
    if (w > cacheMaxEntryWeight)
      break;
  }
  return w;
};
var tri = (v) => v === void 0 ? 0 : v ? 2 : 1;
var booleanWeights = new Map(Object.keys({
  nobrace: 0,
  nocomment: 0,
  nonegate: 0,
  noglobstar: 0,
  noext: 0,
  nonull: 0,
  partial: 0,
  dot: 0,
  nocase: 0,
  nocaseMagicOnly: 0,
  magicalBraces: 0,
  matchBase: 0,
  flipNegate: 0,
  preserveMultipleSlashes: 0,
  windowsNoMagicRoot: 0
}).map((k, i) => [k, 24 * 3 ** i]));
var optionsKey = (o) => {
  let n = 0;
  let wpe = false;
  for (const k in o) {
    const v = o[k];
    switch (k) {
      // the same test as the Minimatch constructor
      case "windowsPathsNoEscape":
        if (v)
          wpe = true;
        break;
      case AWE_KEY:
        if (v === false)
          wpe = true;
        break;
      case "platform": {
        const p = v || defaultPlatform;
        if (p === defaultPlatform)
          break;
        if (p === "darwin")
          n += 3;
        else if (p === "win32")
          n += 6;
        else if (p === "linux")
          n += 9;
        else
          return JSON.stringify(o);
        break;
      }
      case "optimizationLevel":
        if (v === void 0)
          break;
        n += v >= 2 ? 1 : v >= 1 ? 0 : 2;
        break;
      case "braceExpandMax":
        if (v !== void 0 && v !== DEFAULT_BRACE_EXPAND_MAX) {
          return JSON.stringify(o);
        }
        break;
      case "maxGlobstarRecursion":
        if (v !== void 0 && v !== DEFAULT_GLOB_STAR_RECURSION_MAX) {
          return JSON.stringify(o);
        }
        break;
      case "normalize":
        if (v !== void 0)
          return JSON.stringify(o);
        break;
      default:
        n += (booleanWeights.get(k) ?? 0) * tri(v);
    }
  }
  return wpe ? n + 12 : n;
};
var copyOptions = (o) => {
  const copy = {};
  for (const k in o)
    copy[k] = o[k];
  return copy;
};
var cachedMinimatch = (pattern, options) => {
  const key = options ? optionsKey(options) : 0;
  let mm = cache.get(key)?.get(pattern);
  if (mm)
    return mm;
  mm = oldCache.get(key)?.get(pattern) ?? new Minimatch(pattern, copyOptions(options));
  const weight = cacheWeight(mm);
  if (weight > cacheMaxEntryWeight)
    return mm;
  if (cacheSize >= cacheMax || cacheTotalWeight + weight > cacheMaxWeight) {
    oldCache = cache;
    cache = /* @__PURE__ */ new Map();
    cacheSize = 0;
    cacheTotalWeight = 0;
  }
  let byPattern = cache.get(key);
  if (!byPattern)
    cache.set(key, byPattern = /* @__PURE__ */ new Map());
  byPattern.set(pattern, mm);
  cacheSize++;
  cacheTotalWeight += weight;
  return mm;
};
var defaultPlatform = typeof process === "object" && process ? process.env?.__MINIMATCH_TESTING_PLATFORM__ || process.platform : "posix";
var path = {
  win32: { sep: "\\" },
  posix: { sep: "/" }
};
var sep = defaultPlatform === "win32" ? path.win32.sep : path.posix.sep;
minimatch.sep = sep;
var GLOBSTAR = /* @__PURE__ */ Symbol("globstar **");
minimatch.GLOBSTAR = GLOBSTAR;
var filter = (pattern, options) => {
  let mm;
  return (p) => (mm ??= cachedMinimatch(pattern, options)).match(p);
};
minimatch.filter = filter;
var ext = (a, b = {}) => Object.assign({}, a, b);
var defaults = (def) => {
  if (!def || typeof def !== "object" || !Object.keys(def).length) {
    return minimatch;
  }
  const orig = minimatch;
  const m = (p, pattern, options = {}) => orig(p, pattern, ext(def, options));
  return Object.assign(m, {
    Minimatch: class Minimatch extends orig.Minimatch {
      constructor(pattern, options = {}) {
        super(pattern, ext(def, options));
      }
      static defaults(options) {
        return orig.defaults(ext(def, options)).Minimatch;
      }
    },
    unescape: (s, options = {}) => orig.unescape(s, ext(def, options)),
    escape: (s, options = {}) => orig.escape(s, ext(def, options)),
    filter: (pattern, options = {}) => orig.filter(pattern, ext(def, options)),
    defaults: (options) => orig.defaults(ext(def, options)),
    braceExpand: (pattern, options = {}) => orig.braceExpand(pattern, ext(def, options)),
    match: (list, pattern, options = {}) => orig.match(list, pattern, ext(def, options)),
    sep: orig.sep,
    GLOBSTAR
  });
};
minimatch.defaults = defaults;
var braceExpand = (pattern, options = {}) => {
  assertValidPattern(pattern);
  if (options.nobrace || !/\{(?:(?!\{).)*\}/.test(pattern)) {
    return [pattern];
  }
  let p = pattern.replace(/\\\\/g, "\\\\\\\\");
  if (options.windowsPathsNoEscape || options[AWE_KEY] === false) {
    p = p.replace(/\[([{}])\]/g, "[\\$1]");
  }
  return expand(p, { max: options.braceExpandMax });
};
minimatch.braceExpand = braceExpand;
var RANGE_MIN = 100;
var rangeRe = /(?<![\\$])\{(-?\d+)\.\.(-?\d+)\}/g;
var inRepeatOrNegExt = (portion, mark) => {
  const stack = [];
  for (let i = 0; i < portion.length; i++) {
    const c = portion.charAt(i);
    if (c === "\\") {
      i++;
    } else if (c === mark) {
      if (stack.some((t) => t !== "@" && t !== "?"))
        return true;
    } else if (portion.charAt(i + 1) === "(" && "!?+*@".includes(c)) {
      stack.push(c);
      i++;
    } else if (c === ")") {
      stack.pop();
    }
  }
  return false;
};
var match = (list, pattern, options = {}) => {
  const mm = new Minimatch(pattern, options);
  list = list.filter((f) => mm.match(f));
  if (mm.options.nonull && !list.length) {
    list.push(pattern);
  }
  return list;
};
minimatch.match = match;
var globMagic = /[?*]|[+@!]\(.*?\)|\[|\]/;
var classEnd = (pattern, start) => {
  let i = start + 1;
  if (pattern.charAt(i) === "!" || pattern.charAt(i) === "^")
    i++;
  let sawStart = false;
  for (; i < pattern.length; i++) {
    const c = pattern.charAt(i);
    if (c === "]" && sawStart)
      return i;
    sawStart = true;
    if (c === "\\")
      i++;
  }
  return -1;
};
var literal = (pattern, noext) => {
  if (!noext && (pattern === "+()" || pattern === "@()"))
    return pattern;
  let lit2 = "";
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern.charAt(i);
    if (c === "\\") {
      lit2 += pattern.charAt(++i) || c;
    } else if (c === "*" || c === "?") {
      return void 0;
    } else if (c === "[") {
      const close = classEnd(pattern, i);
      if (close === -1) {
        lit2 += c;
        continue;
      }
      let body = pattern.slice(i + 1, close);
      if (body.startsWith("\\"))
        body = body.slice(1);
      if ([...body].length !== 1 || "!^".includes(pattern.charAt(i + 1))) {
        return void 0;
      }
      lit2 += body;
      i = close;
    } else if (!noext && "+@!".includes(c) && pattern.charAt(i + 1) === "(" && pattern.includes(")", i + 2)) {
      return void 0;
    } else {
      lit2 += c;
    }
  }
  return lit2;
};
var MAX_EXTGLOBS = 256;
var extglobCount = (pattern) => {
  let n = 0;
  for (let i = 0; i < pattern.length - 1; i++) {
    const c = pattern.charAt(i);
    if (c === "\\") {
      i++;
    } else if ("+@!?*".includes(c) && pattern.charAt(i + 1) === "(") {
      n++;
      i++;
    }
  }
  return n;
};
var assertValidExtglobs = (pattern) => {
  if (extglobCount(pattern) > MAX_EXTGLOBS) {
    throw new TypeError("pattern has too many extglobs");
  }
};
var extSafe = (pattern) => {
  if (/^[?*+@]\(\)$/.test(pattern) || pattern.includes("[:"))
    return false;
  let depth = 0;
  for (let i = 0; i < pattern.length; i++) {
    const c = pattern.charAt(i);
    if (c === "\\") {
      if (++i === pattern.length)
        return false;
    } else if (c === "[") {
      const close = classEnd(pattern, i);
      if (close !== -1)
        i = close;
    } else if ("+@!?*".includes(c) && pattern.charAt(i + 1) === "(") {
      depth++;
      i++;
    } else if (c === ")") {
      if (!depth--)
        return false;
    } else if (c === "|" && !depth) {
      return false;
    }
  }
  return !depth;
};
var lastSplit;
var lastChecked;
var portionMatch = (p, f) => typeof p === "string" ? f === p : f !== "" && p.testUnchecked(f);
var endIndex = (p, last, lastStart, prev, prevStart) => portionMatch(p, last) ? lastStart : prev !== void 0 && portionMatch(p, prev) ? prevStart : -1;
var isDots = (p) => p === "." || p === "..";
var isDrive = (p) => typeof p === "string" && /^[a-z]:$/i.test(p);
var isLongUNC = (p) => typeof p === "string" && /^unc$/i.test(p);
var uncHost = (p) => {
  if (p[0] !== "" || p[1] !== "")
    return -1;
  const h = p[2] !== "?" ? 2 : isLongUNC(p[3]) ? 4 : -1;
  const host = p[h];
  const share = p[h + 1];
  return h !== -1 && host !== void 0 && host !== "" && host !== GLOBSTAR && share !== void 0 && share !== "" && share !== GLOBSTAR ? h : -1;
};
var walkable = (p, dot) => !isDots(p) && (dot || !p.startsWith("."));
var dotPortion = (f, start, end, dot, sep3) => {
  for (let k = start; k < end; ) {
    if (f.charCodeAt(k) === 46) {
      if (!dot)
        return true;
      const n = f.charCodeAt(k + 1) === 46 ? k + 2 : k + 1;
      if (n >= end || isSep(f.charCodeAt(n), sep3))
        return true;
    }
    const s = nextSep(f, k, sep3);
    if (s === -1)
      return false;
    k = s + 1;
    while (k < end && isSep(f.charCodeAt(k), sep3))
      k++;
  }
  return false;
};
var isSep = (c, sep3) => sep3 === "/" ? c === 47 : sep3 === "\\" ? c === 92 : c === 47 || c === 92;
var nextSep = (f, from, sep3) => {
  if (sep3 !== "both")
    return f.indexOf(sep3, from);
  const s = f.indexOf("/", from);
  const b = f.indexOf("\\", from);
  return s === -1 ? b : b === -1 ? s : Math.min(s, b);
};
var lastSep = (f, from, sep3) => sep3 !== "both" ? f.lastIndexOf(sep3, from) : Math.max(f.lastIndexOf("/", from), f.lastIndexOf("\\", from));
var PENDING = {};
var Minimatch = class {
  options;
  set;
  pattern;
  windowsPathsNoEscape;
  nonegate;
  negate;
  comment;
  empty;
  preserveMultipleSlashes;
  partial;
  globSet;
  globParts;
  nocase;
  isWindows;
  platform;
  windowsNoMagicRoot;
  maxGlobstarRecursion;
  // the path can be checked against the last portion, and the string
  // portions, of each row before it is split. See #canMatch.
  #endCheck;
  #literalCheck;
  // level 2 resolves `.` and `..` portions in the path
  #level2;
  // the unicode normalization form, if any
  #form;
  // the string portions of each row in the set
  #literals = [];
  // the rows that #canMatch can match without splitting the path
  #shapes = [];
  // the rows whose last portion can be checked against the path's
  #endRows = [];
  // brace expansion can make the same portion in many rows, so they
  // share one Matcher, and the states that it caches
  #matchers = /* @__PURE__ */ new Map();
  // parse() returns PENDING in place of a Matcher
  #pending = false;
  // the char that marks numeric ranges in globSet, if any
  #rangeMark;
  // the GlobstarParts of each pattern row, by start index and partial
  #globstarParts = /* @__PURE__ */ new WeakMap();
  constructor(pattern, options = {}) {
    assertValidPattern(pattern);
    options = options || {};
    this.options = options;
    this.maxGlobstarRecursion = options.maxGlobstarRecursion ?? DEFAULT_GLOB_STAR_RECURSION_MAX;
    this.pattern = pattern;
    this.platform = options.platform || defaultPlatform;
    this.isWindows = this.platform === "win32";
    this.windowsPathsNoEscape = !!options.windowsPathsNoEscape || options[AWE_KEY] === false;
    if (this.windowsPathsNoEscape) {
      this.pattern = this.pattern.replace(/\\/g, "/");
    }
    this.preserveMultipleSlashes = !!options.preserveMultipleSlashes;
    this.negate = false;
    this.nonegate = !!options.nonegate;
    this.comment = false;
    this.empty = false;
    this.partial = !!options.partial;
    this.nocase = !!this.options.nocase;
    this.windowsNoMagicRoot = options.windowsNoMagicRoot !== void 0 ? options.windowsNoMagicRoot : !!(this.isWindows && this.nocase);
    this.globSet = [];
    this.globParts = [];
    this.set = [];
    this.#endCheck = !this.preserveMultipleSlashes;
    this.#level2 = (options.optimizationLevel ?? 1) >= 2;
    const n = options.normalize;
    this.#form = n === true ? "NFC" : n || void 0;
    this.make();
    const drives = this.set.map((row) => this.#rootIndex(row));
    this.#endRows = this.set.map((row, r) => this.#endCheck && row.length - 1 > drives[r]);
    this.#literals = this.set.map((row, r) => {
      const end = this.#endRows[r] ? row.length - 1 : row.length;
      const lits = row.slice(drives[r] + 1, end).filter((p) => typeof p === "string" && !!p);
      return [...new Set(lits)];
    });
    this.#literalCheck = this.#literals.some((l) => l.length);
    this.#shapes = this.set.map((row, r) => {
      const [p0, p1, p2] = row;
      if (this.#endRows[r] && row.length === 2) {
        if (p0 === GLOBSTAR && p1 !== GLOBSTAR)
          return "tail";
      }
      if (this.#endRows[r] && options.matchBase && row.length === 1 && p0 !== GLOBSTAR && p0 !== "") {
        return "base";
      }
      if (!this.#endCheck || drives[r] !== -1)
        return void 0;
      if (row.length === 3 && p0 === GLOBSTAR && p2 === GLOBSTAR && p1 !== GLOBSTAR && p1 !== "" && // the portion between is only matched below this limit
      this.maxGlobstarRecursion > 0) {
        return "mid";
      }
      if (row.length === 2 && p1 === GLOBSTAR && p0 !== GLOBSTAR && p0 !== "") {
        return "head";
      }
      return void 0;
    });
  }
  // a string portion of a pattern, normalized if the option is set
  #norm(p) {
    return this.#form ? p.normalize(this.#form) : p;
  }
  // On Windows, the index of the last root portion of a row, as
  // #matchRow finds it: 0 for `c:/...`, 3 for `//?/c:/...` and
  // `//host/share/...`, and 5 for `//?/UNC/host/share/...`. Otherwise
  // -1.
  #rootIndex(row) {
    if (!this.isWindows)
      return -1;
    if (isDrive(row[0]))
      return 0;
    const uncDrive = row[0] === "" && row[1] === "" && row[2] === "?" && isDrive(row[3]);
    if (uncDrive)
      return 3;
    const h = uncHost(row);
    return h === -1 ? -1 : h + 1;
  }
  hasMagic() {
    if (this.options.magicalBraces && this.set.length > 1) {
      return true;
    }
    for (const pattern of this.set) {
      for (const part of pattern) {
        if (typeof part !== "string")
          return true;
      }
    }
    return false;
  }
  make() {
    const pattern = this.pattern;
    const options = this.options;
    if (!options.nocomment && pattern.charAt(0) === "#") {
      this.comment = true;
      return;
    }
    if (!pattern) {
      this.empty = true;
      return;
    }
    this.parseNegate();
    this.globSet = [...new Set(this.#expandBraces())];
    const rawGlobParts = this.globSet.map((s) => this.#slashSplit(s));
    this.globParts = this.preprocess(rawGlobParts);
    this.#pending = true;
    let set = this.globParts.map((s, _, __) => {
      if (this.isWindows && this.windowsNoMagicRoot) {
        const n = s[2] === "?" && isLongUNC(s[3]) ? 6 : 4;
        const isUNC = s[0] === "" && s[1] === "" && (s[2] === "?" || !globMagic.test(s[2])) && s.slice(3, n).every((p) => !globMagic.test(p));
        const isDrive2 = /^[a-z]:/i.test(s[0]);
        if (isUNC) {
          return [
            ...s.slice(0, n).map((p) => this.#norm(p)),
            ...s.slice(n).map((ss) => this.parse(ss))
          ];
        } else if (isDrive2) {
          return [
            this.#norm(s[0]),
            ...s.slice(1).map((ss) => this.parse(ss))
          ];
        }
      }
      return s.map((ss) => this.parse(ss));
    });
    this.set = set.filter((s) => s.indexOf(false) === -1);
    if (this.isWindows) {
      for (let i = 0; i < this.set.length; i++) {
        const p = this.set[i];
        if (p[0] === "" && p[1] === "" && this.globParts[i][2] === "?" && (isDrive(p[3]) || isLongUNC(this.globParts[i][3]))) {
          if (isLongUNC(this.globParts[i][3]))
            p[3] = "UNC";
          p[2] = "?";
        }
      }
    }
    if (!options.noext)
      this.mergeRows();
    this.#pending = false;
    this.set.forEach((row, i) => {
      for (let k = 0; k < row.length; k++) {
        if (row[k] === PENDING) {
          row[k] = this.parse(this.globParts[i][k]);
        }
      }
    });
  }
  // Merge rows that only differ in one portion, where each of them
  // is a Matcher, into one row that matches any of them with
  // `@(a|b|...)`. Then a path is only walked once for all of them,
  // for example with `**/*.{js,ts}`.
  mergeRows() {
    let merged = true;
    while (merged) {
      merged = false;
      if (this.set.length < 2)
        return;
      let keys = this.#mergeKeys();
      const len = Math.max(0, ...this.set.map((r) => r.length));
      for (let k = 0; k < len; k++) {
        const groups = /* @__PURE__ */ new Map();
        const R = this.set.length + 1;
        this.set.forEach((row, i) => {
          if (!(row[k] instanceof Matcher || row[k] === PENDING) || !extSafe(this.globParts[i][k])) {
            return;
          }
          const { pre, suf } = keys[i];
          const key = pre[k] * R + suf[k + 1];
          const g = groups.get(key);
          if (g)
            g.push(i);
          else
            groups.set(key, [i]);
        });
        const drop = /* @__PURE__ */ new Set();
        for (const g of groups.values()) {
          if (g.length < 2)
            continue;
          const [first, ...rest] = g;
          const alts = g.map((i) => this.globParts[i][k]);
          const glob = `@(${alts.join("|")})`;
          if (extglobCount(glob) > MAX_EXTGLOBS)
            continue;
          this.globParts[first][k] = glob;
          this.set[first][k] = this.parse(glob);
          for (const i of rest)
            drop.add(i);
        }
        if (drop.size) {
          merged = true;
          this.set = this.set.filter((_, i) => !drop.has(i));
          this.globParts = this.globParts.filter((_, i) => !drop.has(i));
          if (this.set.length < 2)
            return;
          keys = this.#mergeKeys();
        }
      }
    }
  }
  // For each row, number ids for its prefixes and suffixes, such that
  // pre[k] identifies parts[0..k) and suf[k] identifies parts[k..n).
  // Two rows are the same other than at portion k exactly when they
  // have the same pre[k] and suf[k + 1]. This is linear in the size of
  // the rows, where joining the whole row for every k was quadratic.
  #mergeKeys() {
    const partIds = /* @__PURE__ */ new Map();
    const ids = this.globParts.map((parts) => parts.map((s) => {
      let id = partIds.get(s);
      if (id === void 0)
        partIds.set(s, id = partIds.size);
      return id;
    }));
    const P = partIds.size;
    const len = Math.max(0, ...ids.map((r) => r.length));
    const keys = ids.map((r) => ({
      pre: [0],
      suf: new Array(r.length + 1).fill(0)
    }));
    for (let k = 0; k < len; k++) {
      const m = /* @__PURE__ */ new Map();
      ids.forEach((r, i) => {
        if (k >= r.length)
          return;
        const { pre } = keys[i];
        const key = pre[k] * P + r[k];
        let id = m.get(key);
        if (id === void 0)
          m.set(key, id = m.size + 1);
        pre.push(id);
      });
    }
    for (let k = len - 1; k >= 0; k--) {
      const m = /* @__PURE__ */ new Map();
      ids.forEach((r, i) => {
        if (k >= r.length)
          return;
        const { suf } = keys[i];
        const key = suf[k + 1] * P + r[k];
        let id = m.get(key);
        if (id === void 0)
          m.set(key, id = m.size + 1);
        suf[k] = id;
      });
    }
    return keys;
  }
  // various transforms to equivalent pattern sets that are
  // faster to process in a filesystem walk.  The goal is to
  // eliminate what we can, and push all ** patterns as far
  // to the right as possible, even if it increases the number
  // of patterns that we have to process.
  preprocess(globParts) {
    if (this.options.noglobstar) {
      for (const partset of globParts) {
        for (let j = 0; j < partset.length; j++) {
          if (partset[j] === "**") {
            partset[j] = "*";
          }
        }
      }
    }
    const { optimizationLevel = 1 } = this.options;
    if (optimizationLevel >= 2) {
      globParts = this.firstPhasePreProcess(globParts);
      globParts = this.secondPhasePreProcess(globParts);
    } else if (optimizationLevel >= 1) {
      globParts = this.levelOneOptimize(globParts);
    } else {
      globParts = this.adjascentGlobstarOptimize(globParts);
    }
    return globParts;
  }
  // just get rid of adjascent ** portions
  adjascentGlobstarOptimize(globParts) {
    return globParts.map((parts) => {
      let gs = -1;
      while (-1 !== (gs = parts.indexOf("**", gs + 1))) {
        let i = gs;
        while (parts[i + 1] === "**") {
          i++;
        }
        if (i !== gs) {
          parts.splice(gs, i - gs);
        }
      }
      return parts;
    });
  }
  // get rid of adjascent ** and resolve .. portions
  levelOneOptimize(globParts) {
    return globParts.map((parts) => {
      const root = this.#rootIndex(parts) + 1;
      parts = parts.reduce((set, part) => {
        const prev = set[set.length - 1];
        if (part === "**" && prev === "**") {
          return set;
        }
        if (part === "..") {
          if (set.length > root && prev && prev !== ".." && prev !== "." && prev !== "**") {
            set.pop();
            return set;
          }
        }
        set.push(part);
        return set;
      }, []);
      return parts.length === 0 ? [""] : parts;
    });
  }
  // Check the path against each row before it is split. 'no' if no
  // row can match, so it does not need to be split. 'yes' if a row of
  // `**` and one more portion matches. 'maybe' if it must be split to
  // know. None of this applies with partial, where the path can end
  // before the row does.
  //
  // On Windows, `\` is a separator in the path too, and the portions of
  // a row up to its drive letter or UNC share are not checked (see
  // #rootIndex).
  //
  // Each string portion of a row must be a portion of the path, so the
  // path must contain it. Level 2 can only take portions out of the
  // path, so this is still true then.
  //
  // The last portion of a row must match the last portion of the path,
  // or the one before a trailing `/` (as a/* and a/**/* match a/b/).
  // This does not apply to rows that end in **, rows that end in a
  // root, or preserveMultipleSlashes (which can leave more
  // than one '' at the end). At level 2, it does not apply if that
  // portion is `.` or `..`, which can be
  // resolved away. Level 2 only takes other portions out of the
  // middle of the path.
  //
  // A row of `**/x` then matches if the ** can walk the portions
  // before the one that x matches, the same as #matchGlobstar. At
  // level 2, this is only known if none of them are `.` or `..`, so
  // that the path does not change when it is resolved.
  #canMatch(f) {
    const sep3 = !this.isWindows || !f.includes("\\") ? "/" : f.includes("/") ? "both" : "\\";
    let ends = this.#endCheck ? 0 : -1;
    let last = "";
    let lastStart = 0;
    let prev;
    let prevStart = 0;
    const dot = !!this.options.dot;
    ROWS: for (let r = 0; r < this.set.length; r++) {
      const row = this.set[r];
      const p = row[row.length - 1];
      let end = ends !== -1 && this.#endRows[r] && p !== GLOBSTAR;
      if (end && ends === 0) {
        const i = lastSep(f, f.length, sep3);
        lastStart = i + 1;
        last = f.slice(lastStart);
        if (last === "" && i >= 0) {
          let j = i;
          while (j > 0 && isSep(f.charCodeAt(j - 1), sep3))
            j--;
          prevStart = j === 0 ? 0 : lastSep(f, j - 1, sep3) + 1;
          prev = f.slice(prevStart, j);
        }
        const resolves = this.#level2 && (isDots(last) || last === "" && prev !== void 0 && isDots(prev));
        ends = resolves ? -1 : 1;
        end = !resolves;
      }
      let tailStart = -1;
      if (end && typeof p === "string") {
        tailStart = endIndex(p, last, lastStart, prev, prevStart);
        if (tailStart === -1)
          continue;
      }
      if (this.#literalCheck) {
        for (const l of this.#literals[r]) {
          if (!f.includes(l))
            continue ROWS;
        }
      }
      if (end && typeof p === "object") {
        tailStart = endIndex(p, last, lastStart, prev, prevStart);
        if (tailStart === -1)
          continue;
      }
      const shape = this.#shapes[r];
      if (shape === "base" && end)
        return "yes";
      if (shape === "tail" && end) {
        if (this.#level2 && dotPortion(f, 0, tailStart, true, sep3)) {
          return "maybe";
        }
        if (!dotPortion(f, 0, tailStart, dot, sep3))
          return "yes";
        continue;
      }
      if (shape === "mid" || shape === "head") {
        const m = this.#walk(f, row, shape === "head", dot, sep3);
        if (m !== "no")
          return m;
        continue;
      }
      return "maybe";
    }
    return "no";
  }
  // Match a row of a known shape against the split path, the same as
  // #matchGlobstar and #matchGlobStarBodySections do. None of these
  // rows have a drive letter, so they start at the first portion.
  #matchShape(file, row, shape) {
    const dot = !!this.options.dot;
    const n = file.length;
    if (shape === "head") {
      if (n < 2 || !portionMatch(row[0], file[0])) {
        return false;
      }
      for (let i = 1; i < n; i++)
        if (!walkable(file[i], dot))
          return false;
      return true;
    }
    const x = row[1];
    if (shape === "tail") {
      let t = n - 1;
      if (!portionMatch(x, file[t])) {
        if (file[t] !== "" || n === 1 || !portionMatch(x, file[--t])) {
          return false;
        }
      }
      for (let i = 0; i < t; i++)
        if (!walkable(file[i], dot))
          return false;
      return true;
    }
    for (let k = 0; k < n; k++) {
      if (portionMatch(x, file[k]) && k + 1 < n) {
        let i = k + 1;
        while (i < n && walkable(file[i], dot))
          i++;
        if (i === n)
          return true;
      }
      if (!walkable(file[k], dot))
        return false;
    }
    return false;
  }
  // Match a row of `**/x/**` or `x/**` against the path, the same as
  // #matchGlobstar and #matchGlobStarBodySections do once it is split.
  // x must match a portion (the first one, for `x/**`), the ** before
  // it must be able to walk the portions before that one, and there
  // must be a portion after it, which the ** after it can walk. At
  // level 2, this is only known if no portion is `.` or `..`.
  #walk(f, row, head, dot, sep3) {
    if (this.#level2 && dotPortion(f, 0, f.length, true, sep3))
      return "maybe";
    const x = row[head ? 0 : 1];
    let s = 0;
    for (let e = nextSep(f, s, sep3); e !== -1; e = nextSep(f, s, sep3)) {
      let next = e + 1;
      while (next < f.length && isSep(f.charCodeAt(next), sep3))
        next++;
      const hit = typeof x === "string" ? e - s === x.length && f.startsWith(x, s) : e > s && x.testUnchecked(f.slice(s, e));
      if (hit && !dotPortion(f, next, f.length, dot, sep3))
        return "yes";
      if (head || dotPortion(f, s, next, dot, sep3))
        return "no";
      s = next;
    }
    return "no";
  }
  // the last split, if it was the same path with the same split
  // settings
  #cachedSplit(f) {
    const last = lastSplit;
    return last?.f === f && last.isWindows === this.isWindows && last.preserveMultipleSlashes === this.preserveMultipleSlashes && last.normalize === this.#form ? last : void 0;
  }
  // split a path for match(), and keep the parts for the next call
  #split(f) {
    const { isWindows, preserveMultipleSlashes } = this;
    let parts = this.#slashSplit(isWindows ? f.split("\\").join("/") : f);
    const normalize3 = this.#form;
    if (normalize3)
      parts = parts.map((p) => p.normalize(normalize3));
    lastSplit = {
      f,
      isWindows,
      preserveMultipleSlashes,
      normalize: normalize3,
      parts
    };
    return lastSplit;
  }
  // resolve `.` and `..` portions of a path, for level 2
  #levelTwoFileOptimize(file) {
    const parts = [...file];
    let didSomething = false;
    do {
      didSomething = false;
      if (!this.preserveMultipleSlashes) {
        for (let i = 1; i < parts.length - 1; i++) {
          const p = parts[i];
          if (i === 1 && p === "" && parts[0] === "")
            continue;
          if (p === "." || p === "") {
            didSomething = true;
            parts.splice(i, 1);
            i--;
          }
        }
        if (parts[0] === "." && parts.length === 2 && (parts[1] === "." || parts[1] === "")) {
          didSomething = true;
          parts.pop();
        }
      }
      const root = this.#rootIndex(parts) + 1;
      let dd = root;
      while (-1 !== (dd = parts.indexOf("..", dd + 1))) {
        const p = parts[dd - 1];
        if (p && p !== "." && p !== ".." && p !== "**") {
          didSomething = true;
          parts.splice(dd - 1, 2);
          dd = Math.max(dd - 2, root);
        }
      }
    } while (didSomething);
    return parts.length === 0 ? [""] : parts;
  }
  // First phase: single-pattern processing
  // <pre> is 1 or more portions
  // <rest> is 1 or more portions
  // <p> is any portion other than ., .., '', or **
  // <e> is . or ''
  //
  // **/.. is *brutal* for filesystem walking performance, because
  // it effectively resets the recursive walk each time it occurs,
  // and ** cannot be reduced out by a .. pattern part like a regexp
  // or most strings (other than .., ., and '') can be.
  //
  // <pre>/**/../<p>/<p>/<rest> -> {<pre>/../<p>/<p>/<rest>,<pre>/**/<p>/<p>/<rest>}
  // <pre>/<e>/<rest> -> <pre>/<rest>
  // <pre>/<p>/../<rest> -> <pre>/<rest>
  // **/**/<rest> -> **/<rest>
  //
  // **/*/<rest> -> */**/<rest> <== not valid because ** doesn't follow
  // this WOULD be allowed if ** did follow symlinks, or * didn't
  firstPhasePreProcess(globParts) {
    const { braceExpandMax = DEFAULT_BRACE_EXPAND_MAX } = this.options;
    let splitCells = 0;
    const maxSplitCells = 1e6;
    let didSomething = false;
    do {
      didSomething = false;
      for (let parts of globParts) {
        let gs = -1;
        while (-1 !== (gs = parts.indexOf("**", gs + 1))) {
          let gss = gs;
          while (parts[gss + 1] === "**") {
            gss++;
          }
          if (gss > gs) {
            parts.splice(gs + 1, gss - gs);
          }
          let next = parts[gs + 1];
          const p = parts[gs + 2];
          const p2 = parts[gs + 3];
          if (next !== "..")
            continue;
          if (!p || p === "." || p === ".." || !p2 || p2 === "." || p2 === "..") {
            continue;
          }
          const addedCells = parts.length - 1;
          if (globParts.length >= braceExpandMax || splitCells + addedCells > maxSplitCells) {
            throw new RangeError(`optimizationLevel 2: too many patterns from '**/..'`);
          }
          didSomething = true;
          parts.splice(gs, 1);
          const other = parts.slice(0);
          other[gs] = "**";
          splitCells += addedCells;
          globParts.push(other);
          gs--;
        }
        if (!this.preserveMultipleSlashes) {
          for (let i = 1; i < parts.length - 1; i++) {
            const p = parts[i];
            if (i === 1 && p === "" && parts[0] === "")
              continue;
            if (p === "." || p === "") {
              didSomething = true;
              parts.splice(i, 1);
              i--;
            }
          }
          if (parts[0] === "." && parts.length === 2 && (parts[1] === "." || parts[1] === "")) {
            didSomething = true;
            parts.pop();
          }
        }
        const root = this.#rootIndex(parts) + 1;
        let dd = root;
        while (-1 !== (dd = parts.indexOf("..", dd + 1))) {
          const p = parts[dd - 1];
          if (p && p !== "." && p !== ".." && p !== "**") {
            didSomething = true;
            const needDot = dd === 1 && parts[dd + 1] === "**";
            const splin = needDot ? ["."] : [];
            parts.splice(dd - 1, 2, ...splin);
            if (parts.length === 0)
              parts.push("");
            dd = Math.max(dd - 2, root);
          }
        }
      }
    } while (didSomething);
    return globParts;
  }
  // second phase: multi-pattern dedupes
  // {<pre>/<rest>,<pre>/<rest>} -> <pre>/<rest>
  // {<pre>/*/<rest>,<pre>/<p>/<rest>} -> <pre>/*/<rest>
  secondPhasePreProcess(globParts) {
    const keys = /* @__PURE__ */ new Set();
    const rows = globParts.filter((parts) => {
      const key = parts.join("/");
      if (keys.has(key))
        return false;
      keys.add(key);
      return true;
    });
    const stars = /* @__PURE__ */ new Map();
    for (const parts of rows) {
      const s = [];
      for (let i = 0; i < parts.length; i++) {
        if (parts[i] === "*")
          s.push(i);
      }
      if (s.length)
        stars.set(s.join(","), s);
    }
    if (!stars.size || rows.length * stars.size > 1e5)
      return rows;
    const { dot } = this.options;
    return rows.filter((parts) => {
      for (const s of stars.values()) {
        if (s[s.length - 1] >= parts.length)
          continue;
        const c = [...parts];
        let ok = true;
        let changed = false;
        for (const i of s) {
          const p = parts[i];
          if (p === "*")
            continue;
          if (!p || p === "**" || !dot && p.startsWith(".")) {
            ok = false;
            break;
          }
          c[i] = "*";
          changed = true;
        }
        if (ok && changed && keys.has(c.join("/")))
          return false;
      }
      return true;
    });
  }
  parseNegate() {
    if (this.nonegate)
      return;
    const pattern = this.pattern;
    let negate = false;
    let negateOffset = 0;
    for (let i = 0; i < pattern.length && pattern.charAt(i) === "!"; i++) {
      negate = !negate;
      negateOffset++;
    }
    if (negateOffset)
      this.pattern = pattern.slice(negateOffset);
    this.negate = negate;
  }
  // Match the parts of a path against one row of the set. `resolved`
  // is the parts after level 2 resolves `.` and `..` in them, or the
  // same parts below level 2. Set partial to true to test if, for
  // example, "/a/b" matches the start of "/*/b/*/d". Partial means, if
  // you run out of file before you run out of pattern, then that's
  // fine, as long as all the parts match.
  #matchRow(file, resolved, pattern, partial) {
    let fileStartIndex = 0;
    let patternStartIndex = 0;
    const fh = this.isWindows ? uncHost(resolved) : -1;
    const ph = fh === -1 ? -1 : uncHost(pattern);
    if (ph !== -1) {
      const host = pattern[ph];
      const share = pattern[ph + 1];
      if (typeof host !== "string" || typeof share !== "string") {
        fileStartIndex = fh;
        patternStartIndex = ph;
      } else if (resolved[fh].toLowerCase() === host.toLowerCase() && resolved[fh + 1].toLowerCase() === share.toLowerCase()) {
        fileStartIndex = fh + 2;
        patternStartIndex = ph + 2;
      }
    } else if (this.isWindows) {
      const fileDrive = typeof file[0] === "string" && /^[a-z]:$/i.test(file[0]);
      const fileUNC = !fileDrive && file[0] === "" && file[1] === "" && file[2] === "?" && /^[a-z]:$/i.test(file[3]);
      const patternDrive = typeof pattern[0] === "string" && /^[a-z]:$/i.test(pattern[0]);
      const patternUNC = !patternDrive && pattern[0] === "" && pattern[1] === "" && pattern[2] === "?" && typeof pattern[3] === "string" && /^[a-z]:$/i.test(pattern[3]);
      const fdi = fileUNC ? 3 : fileDrive ? 0 : void 0;
      const pdi = patternUNC ? 3 : patternDrive ? 0 : void 0;
      if (typeof fdi === "number" && typeof pdi === "number") {
        const [fd, pd] = [
          file[fdi],
          pattern[pdi]
        ];
        if (fd.toLowerCase() === pd.toLowerCase()) {
          patternStartIndex = pdi + 1;
          fileStartIndex = fdi + 1;
        }
      }
    }
    file = resolved;
    if (pattern.includes(GLOBSTAR)) {
      return this.#matchGlobstar(file, pattern, partial, fileStartIndex, patternStartIndex);
    }
    return this.#matchOne(file, pattern, partial, fileStartIndex, patternStartIndex);
  }
  #matchGlobstar(file, pattern, partial, fileIndex, patternIndex) {
    const { head, body, tail: tail2, segments } = this.#getGlobstarParts(pattern, partial, patternIndex);
    if (head.length) {
      const headEnd = fileIndex + head.length;
      if (!this.#matchOne(file, head, partial, fileIndex, 0, headEnd)) {
        return false;
      }
      fileIndex += head.length;
      patternIndex += head.length;
    }
    let fileTailMatch = 0;
    if (tail2.length) {
      if (tail2.length + fileIndex > file.length)
        return false;
      let tailStart = file.length - tail2.length;
      if (this.#matchOne(file, tail2, partial, tailStart, 0)) {
        fileTailMatch = tail2.length;
      } else {
        if (file[file.length - 1] !== "" || fileIndex + tail2.length === file.length) {
          return false;
        }
        tailStart--;
        if (!this.#matchOne(file, tail2, partial, tailStart, 0)) {
          return false;
        }
        fileTailMatch = tail2.length + 1;
      }
    }
    if (!body.length) {
      let sawSome = !!fileTailMatch;
      for (let i = fileIndex; i < file.length - fileTailMatch; i++) {
        const f = String(file[i]);
        sawSome = true;
        if (f === "." || f === ".." || !this.options.dot && f.startsWith(".")) {
          return false;
        }
      }
      return partial || sawSome;
    }
    return !!this.#matchGlobStarBodySections(file, segments, file.length - fileTailMatch, fileIndex, 0, partial, 0, !!fileTailMatch, /* @__PURE__ */ new Set());
  }
  // Split the pattern into head, tail, and middle of ** delimited
  // parts. The tail has to be at the end, and the others just have to
  // be found in order from the head. These only depend on the pattern
  // row, so they are kept for the next path.
  #getGlobstarParts(pattern, partial, patternIndex) {
    let byStart = this.#globstarParts.get(pattern);
    if (!byStart) {
      byStart = [];
      this.#globstarParts.set(pattern, byStart);
    }
    const key = patternIndex * 2 + (partial ? 1 : 0);
    const found = byStart[key];
    if (found)
      return found;
    const firstgs = pattern.indexOf(GLOBSTAR, patternIndex);
    const lastgs = pattern.lastIndexOf(GLOBSTAR);
    const head = pattern.slice(patternIndex, firstgs);
    const body = pattern.slice(firstgs + 1, partial ? void 0 : lastgs);
    const tail2 = partial ? [] : pattern.slice(lastgs + 1);
    const segments = [[[], 0]];
    let current = segments[0];
    let nonGsParts = 0;
    const nonGsPartsSums = [0];
    for (const b of body) {
      if (b === GLOBSTAR) {
        nonGsPartsSums.push(nonGsParts);
        current = [[], 0];
        segments.push(current);
      } else {
        current[0].push(b);
        nonGsParts++;
      }
    }
    segments.forEach((b, i) => {
      b[1] = nonGsParts - nonGsPartsSums[i];
    });
    const parts = { head, body, tail: tail2, segments };
    byStart[key] = parts;
    return parts;
  }
  // return false for "nope, not matching"
  // return null for "not matching, cannot keep trying"
  #matchGlobStarBodySections(file, bodySegments, fileLength, fileIndex, bodyIndex, partial, globStarDepth, sawTail, tried) {
    const bs = bodySegments[bodyIndex];
    if (!bs) {
      if (partial) {
        return fileIndex >= fileLength || fileIndex === fileLength - 1 && file[fileIndex] === "";
      }
      for (let i = fileIndex; i < fileLength; i++) {
        sawTail = true;
        const f = file[i];
        if (f === "." || f === ".." || !this.options.dot && f.startsWith(".")) {
          return false;
        }
      }
      return sawTail;
    }
    const [body, need] = bs;
    const after = partial ? fileLength : fileLength - need;
    while (fileIndex <= after) {
      const key = bodyIndex * (file.length + 1) + fileIndex;
      if (tried.has(key))
        return false;
      tried.add(key);
      const m = this.#matchOne(file, body, partial, fileIndex, 0, fileIndex + body.length);
      if (m && globStarDepth < this.maxGlobstarRecursion) {
        const sub = this.#matchGlobStarBodySections(file, bodySegments, fileLength, fileIndex + body.length, bodyIndex + 1, partial, globStarDepth + 1, sawTail, tried);
        if (sub !== false) {
          return sub;
        }
      }
      if (fileIndex === after)
        break;
      const f = file[fileIndex];
      if (f === "." || f === ".." || !this.options.dot && f.startsWith(".")) {
        return false;
      }
      fileIndex++;
    }
    return partial || null;
  }
  #matchOne(file, pattern, partial, fileIndex, patternIndex, fileEnd = file.length) {
    let fi;
    let pi;
    let pl;
    let fl;
    for (fi = fileIndex, pi = patternIndex, fl = Math.min(fileEnd, file.length), pl = pattern.length; fi < fl && pi < pl; fi++, pi++) {
      let p = pattern[pi];
      let f = file[fi];
      if (p === false || p === GLOBSTAR) {
        return false;
      }
      if (!portionMatch(p, f))
        return false;
    }
    if (fi === fl && pi === pl) {
      return true;
    } else if (fi === fl) {
      return partial;
    } else if (pi === pl) {
      return fi === fl - 1 && file[fi] === "";
    } else {
      throw new Error("wtf?");
    }
  }
  braceExpand() {
    return braceExpand(this.pattern, this.options);
  }
  // Expand braces, except numeric ranges such as {0..999} with at
  // least RANGE_MIN values. Each of those stays in its pattern as
  // `<mark>0..999<mark>`, for the Matcher to test. If a range might
  // be inside a [...] class, expand all of them instead.
  #expandBraces() {
    const { pattern } = this;
    if (this.options.nobrace)
      return this.braceExpand();
    let code = 57344;
    while (pattern.includes(String.fromCharCode(code))) {
      if (++code > 63743)
        return this.braceExpand();
    }
    const mark = String.fromCharCode(code);
    let found = false;
    const marked = pattern.replace(rangeRe, (m, lo, hi) => {
      const a = Number(lo);
      const b = Number(hi);
      if (!Number.isSafeInteger(a) || !Number.isSafeInteger(b) || Math.abs(a - b) + 1 < RANGE_MIN) {
        return m;
      }
      found = true;
      return `${mark}${lo}..${hi}${mark}`;
    });
    if (!found)
      return this.braceExpand();
    const set = braceExpand(marked, this.options);
    for (const p of set) {
      for (const portion of p.split("/")) {
        const c = portion.indexOf("[");
        if (c !== -1 && c < portion.lastIndexOf(mark)) {
          return this.braceExpand();
        }
        if (!this.options.noext && inRepeatOrNegExt(portion, mark)) {
          return this.braceExpand();
        }
      }
    }
    this.#rangeMark = mark;
    return set;
  }
  parse(pattern) {
    assertValidPattern(pattern);
    const options = this.options;
    if (pattern === "**")
      return GLOBSTAR;
    if (pattern === "")
      return "";
    const { nocase, nocaseMagicOnly, noext = false, dot, normalize: normalize3 } = options;
    const rangeMark = this.#rangeMark;
    const lit2 = rangeMark && pattern.includes(rangeMark) ? void 0 : literal(pattern, noext);
    if (lit2 !== void 0 && !(nocase && !nocaseMagicOnly && pattern.toUpperCase() !== pattern.toLowerCase())) {
      return this.#norm(lit2);
    }
    if (this.#pending)
      return PENDING;
    let m = this.#matchers.get(pattern);
    if (!m) {
      if (!noext)
        assertValidExtglobs(pattern);
      m = new Matcher(pattern, {
        nocase,
        noext,
        dot,
        normalize: normalize3,
        ...rangeMark && { rangeMark }
      });
      this.#matchers.set(pattern, m);
    }
    return m;
  }
  #slashSplit(p) {
    if (this.preserveMultipleSlashes) {
      return p.split("/");
    } else if (this.isWindows && /^\/\/[^/]+/.test(p)) {
      return ["", ...p.split(/\/+/)];
    } else {
      return p.split(/\/+/);
    }
  }
  match(f, partial = this.partial) {
    if (this.comment) {
      return false;
    }
    if (this.empty) {
      return f === "";
    }
    if (f === "/" && partial) {
      return true;
    }
    const options = this.options;
    let split = this.#cachedSplit(f);
    if (!split) {
      if (!partial && !this.#form && (this.#endCheck || this.#literalCheck) && lastChecked !== f) {
        lastChecked = f;
        const can = this.#canMatch(f);
        if (can === "no")
          return options.flipNegate ? false : this.negate;
        if (can === "yes")
          return options.flipNegate ? true : !this.negate;
      }
      split = this.#split(f);
    }
    const ff = split.parts;
    const resolved = this.#level2 ? split.resolved ??= this.#levelTwoFileOptimize(ff) : ff;
    const set = this.set;
    let filename = ff[ff.length - 1];
    if (!filename) {
      for (let i = ff.length - 2; !filename && i >= 0; i--) {
        filename = ff[i];
      }
    }
    for (let r = 0; r < set.length; r++) {
      const pattern = set[r];
      const shape = partial ? void 0 : this.#shapes[r];
      const hit = shape === "base" ? portionMatch(pattern[0], filename) : shape ? this.#matchShape(resolved, pattern, shape) : options.matchBase && pattern.length === 1 ? this.#matchRow([filename], [filename], pattern, partial) : this.#matchRow(ff, resolved, pattern, partial);
      if (hit) {
        if (options.flipNegate) {
          return true;
        }
        return !this.negate;
      }
    }
    if (options.flipNegate) {
      return false;
    }
    return this.negate;
  }
  static defaults(def) {
    return minimatch.defaults(def).Minimatch;
  }
};
minimatch.Minimatch = Minimatch;
minimatch.escape = escape2;
minimatch.unescape = unescape;

// src/lib/paths.ts
function patternPath(pattern) {
  const hash = pattern.indexOf("#");
  return hash === -1 ? pattern : pattern.slice(0, hash);
}
function normalize2(p) {
  return p.replace(/^\.\//, "").replace(/^\/+/, "");
}
function matchesPattern(file, pattern) {
  const f = normalize2(file);
  const raw = normalize2(patternPath(pattern));
  if (raw === "") return false;
  if (minimatch(f, raw, { dot: true })) return true;
  if (!raw.includes("*")) {
    const dir = raw.endsWith("/") ? raw : `${raw}/`;
    if (f.startsWith(dir)) return true;
    if (f === raw) return true;
  }
  return false;
}
function matchesAny(file, patterns) {
  return patterns.some((p) => matchesPattern(file, p));
}
function filesMatching(files, patterns) {
  return files.filter((f) => matchesAny(f, patterns));
}

// src/commands/policy.ts
function isTrustedActor(policy, actor, association, opts = {}) {
  const bots = policy.trust.integration_bots ?? [];
  if (opts.isBot === true) return false;
  if (bots.includes(actor)) return false;
  if (/\[bot\]$/.test(actor)) return false;
  return policy.trust.associations.includes(association);
}
function hasTrustedHumanApproval(ctx) {
  return ctx.pr.reviews.some((r) => approves(ctx, r));
}
function approves(ctx, r) {
  if (r.state !== "APPROVED") return false;
  if (r.is_app === true) return false;
  if ((ctx.appLogins ?? []).includes(r.author)) return false;
  if (/\[bot\]$/.test(r.author)) return false;
  if (!ctx.policy.trust.associations.includes(r.author_association)) return false;
  if (r.commit_sha !== void 0 && r.commit_sha !== ctx.pr.head_sha) return false;
  return true;
}
function appRequestedChanges(ctx) {
  return ctx.pr.reviews.filter(
    (r) => r.state === "CHANGES_REQUESTED" && (r.is_app === true || (ctx.appLogins ?? []).includes(r.author))
  );
}
function allowed(may, kind) {
  if (may.includes(kind)) return true;
  if (kind === "guardrails" && may.includes("guardrails:tighten")) return true;
  return false;
}
function isOneWayGuardrailFile(policy, file) {
  const baselines = policy.paths.baselines ?? [".factory/guardrails/baselines.json"];
  const coverage = policy.paths.coverage ?? [".factory/guardrails/coverage.json"];
  return matchesAny(file, baselines) || matchesAny(file, coverage);
}
function runPolicy(ctx) {
  const { policy, pr } = ctx;
  const failures = [];
  const notes = [];
  const approvedByHuman = hasTrustedHumanApproval(ctx);
  const appChanges = appRequestedChanges(ctx);
  if (appChanges.length > 0) {
    notes.push(
      "An App requested changes on this PR. That is gh-aw's protected-file check, not a human objection: either this pipeline's protected-files.exclude is wrong, or the attempt touched a path it may not."
    );
  }
  const upgrade = policy.runner_upgrades;
  if (upgrade?.author !== void 0 && pr.author === upgrade.author) {
    const workflowFiles = filesMatching(pr.changed_files, policy.paths.protected);
    const nonWorkflow = pr.changed_files.filter((f) => !matchesAny(f, policy.paths.protected));
    if (nonWorkflow.length > 0) {
      failures.push({
        kind: "runner_upgrade_scope",
        files: nonWorkflow,
        message: `A runner upgrade PR may change only the runner pin in workflow files; these are outside that scope: ${nonWorkflow.join(", ")}`
      });
    }
    if (!approvedByHuman) {
      failures.push({
        kind: "definition_without_approval",
        files: workflowFiles,
        message: "A runner upgrade needs a trusted human's approval and is never auto-merged."
      });
    }
    return failures.length > 0 ? { conclusion: "failure", failures, notes } : { conclusion: "success", notes };
  }
  const protectedHits = filesMatching(pr.changed_files, policy.paths.protected);
  if (protectedHits.length > 0 && !approvedByHuman) {
    failures.push({
      kind: "protected_path",
      files: protectedHits,
      message: `This PR changes protected paths, which needs a trusted human's approval: ${protectedHits.join(", ")}. The check that judges this runs from main's copy of the workflow, so editing it in the PR changes nothing.`
    });
  }
  const definitionHits = filesMatching(pr.changed_files, policy.paths.definition);
  if (definitionHits.length > 0) {
    const rule = policy.pipelines["definition"];
    const pipelineMayChangeDefinition = pr.pipeline !== void 0 && allowed(policy.pipelines[pr.pipeline]?.may_change ?? [], "definition");
    if (!pipelineMayChangeDefinition) {
      failures.push({
        kind: "path_not_allowed_for_pipeline",
        files: definitionHits,
        message: `The ${pr.pipeline ?? "unknown"} pipeline may not change the factory definition: ${definitionHits.join(", ")}`
      });
    } else if (rule?.requires === "trusted_human_approval" && !approvedByHuman) {
      failures.push({
        kind: "definition_without_approval",
        files: definitionHits,
        message: `Changes to the factory definition need a trusted human's approval: ${definitionHits.join(", ")}`
      });
    }
  }
  if (pr.pipeline !== void 0) {
    if (pr.from_fork) {
      failures.push({
        kind: "fork_agent_work",
        files: [],
        message: "Agent work never starts from a fork."
      });
    }
    const may = policy.pipelines[pr.pipeline]?.may_change ?? [];
    const guardrailHits = filesMatching(pr.changed_files, policy.paths.guardrails).filter(
      (f) => !isOneWayGuardrailFile(policy, f) && !matchesAny(f, policy.paths.definition)
    );
    if (guardrailHits.length > 0 && !allowed(may, "guardrails")) {
      failures.push({
        kind: "guardrail_change_not_allowed",
        files: guardrailHits,
        message: `The ${pr.pipeline} pipeline may not change guardrails: ${guardrailHits.join(", ")}. Only hardening may add or tighten them, and any weakening still needs a human.`
      });
    }
    const testHits = filesMatching(pr.changed_files, policy.paths.tests);
    if (!allowed(may, "tests") && testHits.length > 0) {
      failures.push({
        kind: "path_not_allowed_for_pipeline",
        files: testHits,
        message: `The ${pr.pipeline} pipeline may not change tests: ${testHits.join(", ")}`
      });
    }
    const codeHits = pr.changed_files.filter(
      (f) => !matchesAny(f, policy.paths.tests) && !matchesAny(f, policy.paths.guardrails) && !matchesAny(f, policy.paths.definition) && !matchesAny(f, policy.paths.protected)
    );
    if (codeHits.length > 0 && !allowed(may, "code")) {
      failures.push({
        kind: "path_not_allowed_for_pipeline",
        files: codeHits,
        message: `The ${pr.pipeline} pipeline may not change code: ${codeHits.join(", ")}`
      });
    }
  }
  if (policy.tests.declared_edits === "required" && pr.pipeline !== void 0) {
    const norm = (f) => f.replace(/^\.\//, "");
    const declared = new Set((pr.declared_test_edits ?? []).map(norm));
    const added = new Set((pr.added_files ?? []).map(norm));
    const existingTestEdits = filesMatching(pr.changed_files, policy.paths.tests).filter(
      (f) => !added.has(norm(f)) && !declared.has(norm(f))
    );
    if (existingTestEdits.length > 0) {
      failures.push({
        kind: "undeclared_test_edit",
        files: existingTestEdits,
        message: `These existing test files are not listed in the spec's tests_changed: ${existingTestEdits.join(", ")}. New test files are always allowed; editing or deleting an existing one must be declared.`
      });
    }
  }
  return failures.length > 0 ? { conclusion: "failure", failures, notes } : { conclusion: "success", notes };
}

// src/commands/policy-run.ts
var PIPELINE_LABELS = {
  "factory:product-work": "product_work",
  "factory:gardening": "gardening",
  "factory:hardening": "hardening",
  "factory:definition": "definition",
  "factory:conflict": "conflict"
};
function pipelineFromLabels(labels) {
  for (const l of labels) {
    const p = PIPELINE_LABELS[l];
    if (p !== void 0) return p;
  }
  return void 0;
}
async function gatherPullFacts(gh, prNumber, declaredTestEdits = []) {
  const [pr, files, reviews] = await Promise.all([
    gh.pull(prNumber),
    gh.pullFiles(prNumber),
    gh.pullReviews(prNumber)
  ]);
  const labels = pr.labels.map((l) => l.name);
  const headRepo = pr.head.repo?.full_name ?? null;
  const baseRepo = pr.base.repo.full_name;
  const fromFork = headRepo === null || headRepo !== baseRepo;
  const facts = {
    number: pr.number,
    head_sha: pr.head.sha,
    base_ref: pr.base.ref,
    author: pr.user.login,
    author_association: pr.author_association,
    from_fork: fromFork,
    labels,
    changed_files: changedPaths(files),
    added_files: files.filter((f) => f.status === "added").map((f) => f.filename),
    reviews: reviews.map(toReview),
    draft: pr.draft,
    declared_test_edits: declaredTestEdits
  };
  const pipeline = pipelineFromLabels(labels);
  return pipeline === void 0 ? facts : { ...facts, pipeline };
}
function changedPaths(files) {
  const out = /* @__PURE__ */ new Set();
  for (const f of files) {
    out.add(f.filename);
    if (f.previous_filename !== void 0) out.add(f.previous_filename);
  }
  return [...out];
}
function toReview(r) {
  const isApp = r.user?.type === "Bot" || /\[bot\]$/.test(r.user?.login ?? "");
  const state = r.state;
  return {
    author: r.user?.login ?? "unknown",
    author_association: r.author_association,
    state,
    submitted_at: r.submitted_at,
    ...r.commit_id === void 0 ? {} : { commit_sha: r.commit_id },
    is_app: isApp
  };
}
async function runPolicyCommand(opts) {
  const policy = await loadPolicy(opts.loader);
  const pr = await gatherPullFacts(opts.gh, opts.pr);
  const result = runPolicy({ policy, pr, appLogins: opts.appLogins });
  if (opts.report) {
    await opts.gh.reportCheck({
      name: opts.checkName,
      headSha: pr.head_sha,
      conclusion: result.conclusion === "success" ? "success" : "failure",
      title: result.conclusion === "success" ? "Policy passed" : "Policy failed",
      summary: summarize(result)
    });
  }
  return result;
}
function summarize(result) {
  const lines = [];
  if (result.conclusion === "success") {
    lines.push("Every changed path is one this pipeline may change.");
  } else {
    lines.push(`${result.failures.length} problem(s):`, "");
    for (const f of result.failures) {
      lines.push(`**${f.kind}**`, "", f.message, "");
      if (f.files.length > 0) {
        for (const file of f.files.slice(0, 50)) lines.push(`- \`${file}\``);
        if (f.files.length > 50) lines.push(`- \u2026and ${f.files.length - 50} more`);
        lines.push("");
      }
    }
  }
  if (result.notes.length > 0) {
    lines.push("---", "");
    for (const n of result.notes) lines.push(n, "");
  }
  return lines.join("\n");
}

// src/cli.ts
init_schema();

// src/commands/intake-run.ts
init_store();
import { readFileSync as readFileSync5 } from "node:fs";
import { createHash as createHash2 } from "node:crypto";

// src/commands/intake.ts
import { createHash } from "node:crypto";
var ROUTE = {
  issue_opened: { pipeline: "product_work", cls: "request" },
  issue_labeled: { pipeline: "product_work", cls: "request" },
  issue_comment: { pipeline: "product_work", cls: "request" },
  dashboard_dispatch: { pipeline: "product_work", cls: "request" },
  ci_failure_on_main: { pipeline: "product_work", cls: "dev_event", priority: "high" },
  review_comment: { pipeline: "product_work", cls: "dev_event" },
  correction: { pipeline: "hardening", cls: "self" },
  schedule_gardening: { pipeline: "gardening", cls: "scheduled" },
  review_routed: { pipeline: "hardening", cls: "self" },
  conflict_detected: { pipeline: "conflict", cls: "dev_event" }
};
function fingerprint(input) {
  const text = `${input.title ?? ""} ${input.body ?? ""}`;
  const normalized = text.toLowerCase().replace(/```[\s\S]*?```/g, " ").replace(/https?:\/\/\S+/g, " ").replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w)).sort().join(" ");
  const h = createHash("sha256");
  h.update(normalized);
  h.update("\0");
  h.update(input.area ?? "");
  return `sha256:${h.digest("hex")}`;
}
var STOP = /* @__PURE__ */ new Set([
  "the",
  "and",
  "for",
  "that",
  "this",
  "with",
  "from",
  "when",
  "then",
  "than",
  "but",
  "not",
  "are",
  "was",
  "were",
  "has",
  "have",
  "had",
  "its",
  "it's",
  "you",
  "your",
  "our",
  "can",
  "cant",
  "wont",
  "does",
  "doesnt",
  "did",
  "should",
  "would",
  "could",
  "there",
  "their",
  "they",
  "what",
  "which"
]);
function stripUntrustedText(body, trusted) {
  if (body === void 0 || body === "") return { body: null, stripped: false };
  if (trusted) return { body, stripped: false };
  return { body: null, stripped: true };
}
function runIntake(events, ctx) {
  const decisions = [];
  const pending = events.filter((e) => e.id > ctx.cursor).slice().sort((a, b) => a.id - b.id);
  let cursor = ctx.cursor;
  for (const event of pending) {
    decisions.push(decide(event, ctx));
    cursor = Math.max(cursor, event.id);
  }
  return { decisions, cursor, processed: pending.length };
}
function triggerEnabled(ctx, kind) {
  switch (kind) {
    case "issue_opened":
    case "issue_labeled":
      return ctx.triggers.issues;
    case "issue_comment":
    case "review_comment":
      return ctx.triggers.comments;
    case "ci_failure_on_main":
      return ctx.triggers.ci_failure_on_main;
    case "dashboard_dispatch":
      return ctx.triggers.dashboard_dispatch;
    default:
      return true;
  }
}
function decide(event, ctx) {
  const route = ROUTE[event.kind];
  if (event.from_fork === true) {
    return { event, workItem: null, outcome: "ignored_fork", reason: "fork events never start agent work", duplicateShortlist: [] };
  }
  if (!triggerEnabled(ctx, event.kind)) {
    return { event, workItem: null, outcome: "ignored_trigger_disabled", reason: `the ${event.kind} trigger is off`, duplicateShortlist: [] };
  }
  if (event.kind === "review_comment" && event.pr !== void 0) {
    return {
      event,
      workItem: null,
      outcome: "revision_of_existing_run",
      reason: `review comment on PR #${event.pr} goes back to that PR's run as a revision`,
      duplicateShortlist: []
    };
  }
  const machineOrigin = event.kind === "schedule_gardening" || event.kind === "review_routed" || event.kind === "conflict_detected";
  const trusted = machineOrigin || isTrustedActor(ctx.policy, event.actor, event.actor_association, { isBot: event.actor_is_bot === true });
  const accepted = (event.labels ?? []).includes(ctx.policy.trust.accept_label);
  const fp = fingerprint({ title: event.title, body: event.body, area: event.touched_area });
  const shortlist = shortlistDuplicates(fp, ctx);
  const { body } = stripUntrustedText(event.body, trusted || accepted);
  const priority = route.priority === "high" ? "high" : isFollowUpToMerged(fp, ctx) ? "high" : "normal";
  const related = relatedMerged(fp, ctx);
  const item = {
    schema: "work-item/1",
    id: ctx.newId(event),
    created_at: event.at,
    source: {
      kind: sourceKind(event.kind),
      ref: event.ref ?? null,
      actor: event.actor,
      via: event.via ?? null
    },
    trigger_class: route.cls,
    pipeline: route.pipeline,
    title: event.title ?? defaultTitle(event.kind),
    body,
    priority,
    fingerprint: fp,
    status: trusted || accepted ? "queued" : "waiting_trust",
    runs: [],
    pr: event.pr ?? null,
    parent: null,
    related,
    spec: null
  };
  if (!trusted && !accepted) {
    return {
      event,
      workItem: item,
      outcome: "waiting_trust",
      reason: `${event.actor} is not a trusted person, so nothing starts until a trusted person adds ${ctx.policy.trust.accept_label}. Its text is stripped from prompts until then.`,
      duplicateShortlist: shortlist
    };
  }
  return {
    event,
    workItem: item,
    outcome: "queued",
    reason: accepted && !trusted ? `admitted by ${ctx.policy.trust.accept_label}` : "trusted person",
    duplicateShortlist: shortlist
  };
}
function sourceKind(kind) {
  switch (kind) {
    case "issue_opened":
    case "issue_labeled":
      return "issue";
    case "issue_comment":
      return "issue_comment";
    case "review_comment":
      return "review_comment";
    case "ci_failure_on_main":
      return "ci_failure";
    case "dashboard_dispatch":
      return "dashboard";
    case "schedule_gardening":
      return "schedule";
    case "review_routed":
      return "review";
    case "conflict_detected":
      return "conflict";
    case "correction":
      return "correction";
  }
}
function defaultTitle(kind) {
  switch (kind) {
    case "schedule_gardening":
      return "Nightly gardening";
    case "ci_failure_on_main":
      return "CI is failing on main";
    case "conflict_detected":
      return "Resolve conflict on a factory PR";
    default:
      return "Untitled work item";
  }
}
function shortlistDuplicates(fp, ctx) {
  return ctx.openItems.filter((i) => i.fingerprint === fp).map((i) => i.work_item);
}
function isFollowUpToMerged(fp, ctx) {
  return (ctx.recentlyMerged ?? []).some((m) => m.fingerprint === fp);
}
function relatedMerged(fp, ctx) {
  return (ctx.recentlyMerged ?? []).filter((m) => m.fingerprint === fp).map((m) => m.work_item);
}
function chooseDispatches(queued, opts) {
  const slots = Math.max(0, opts.maxRuns - opts.running);
  const paused = new Set(opts.pausedPipelines);
  const eligible = queued.filter((q) => !paused.has(q.pipeline)).slice().sort((a, b) => {
    if (a.priority !== b.priority) return a.priority === "high" ? -1 : 1;
    return a.created_at.localeCompare(b.created_at);
  });
  const dispatch = eligible.slice(0, slots).map((q) => q.work_item);
  const dispatched = new Set(dispatch);
  const stayQueued = queued.map((q) => q.work_item).filter((id) => !dispatched.has(id));
  return {
    dispatch,
    stayQueued,
    reason: slots === 0 ? `no slots free (${opts.running}/${opts.maxRuns} running)` : `${slots} slot(s) free; dispatched ${dispatch.length}`
  };
}

// src/lib/ids.ts
import { randomBytes } from "node:crypto";
var ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
var TIME_CHARS = 10;
var RANDOM_CHARS = 16;
function ulid(now = Date.now(), random = randomBytes(10)) {
  if (!Number.isFinite(now) || now < 0) throw new Error(`invalid timestamp: ${now}`);
  if (random.length < 10) throw new Error("a ULID needs 10 random bytes");
  let time = "";
  let t = Math.floor(now);
  for (let i = TIME_CHARS - 1; i >= 0; i--) {
    time = ALPHABET[t % 32] + time;
    t = Math.floor(t / 32);
  }
  let bits = 0n;
  for (const b of random.slice(0, 10)) bits = bits << 8n | BigInt(b);
  let rand = "";
  for (let i = 0; i < RANDOM_CHARS; i++) {
    rand = ALPHABET[Number(bits & 31n)] + rand;
    bits >>= 5n;
  }
  return time + rand;
}
var workItemId = (now) => `wi_${ulid(now)}`;
var candidateId = (now) => `cand_${ulid(now)}`;
var benchmarkTaskId = (now) => `bt_${ulid(now)}`;
var benchmarkResultId = (now) => `bench_${ulid(now)}`;
function reviewId(iso) {
  const day = iso.slice(0, 10).replace(/-/g, "");
  if (!/^\d{8}$/.test(day)) throw new Error(`cannot make a review id from ${iso}`);
  return `rev_${day}`;
}

// src/commands/intake-run.ts
function eventId(payload, now) {
  const ms = Date.parse(now);
  const base = Number.isNaN(ms) ? Date.now() : ms;
  const h = createHash2("sha256").update(JSON.stringify(payload)).digest();
  return base * 1e3 + (h[0] << 2) % 1e3;
}
function normalizeEvent(eventName, payload, now) {
  const assoc = (s) => (s ?? "NONE").toUpperCase();
  const id = eventId(payload, now);
  if (eventName === "issues" && payload.issue !== void 0) {
    const kind = payload.action === "labeled" ? "issue_labeled" : "issue_opened";
    if (payload.action !== "opened" && payload.action !== "labeled") return null;
    return {
      id,
      kind,
      at: now,
      actor: payload.issue.user?.login ?? payload.sender?.login ?? "unknown",
      actor_association: assoc(payload.issue.author_association),
      actor_is_bot: (payload.issue.user?.type ?? payload.sender?.type) === "Bot",
      ...payload.issue.title === void 0 ? {} : { title: payload.issue.title },
      ...payload.issue.body == null ? {} : { body: payload.issue.body },
      ...payload.issue.number === void 0 ? {} : { ref: `#${payload.issue.number}` },
      labels: (payload.issue.labels ?? []).map((l) => l.name ?? "").filter((n) => n !== "")
    };
  }
  if ((eventName === "issue_comment" || eventName === "pull_request_review_comment") && payload.comment !== void 0) {
    if (payload.action !== "created") return null;
    const onPr = payload.pull_request !== void 0 || eventName === "pull_request_review_comment";
    return {
      id,
      kind: onPr ? "review_comment" : "issue_comment",
      at: payload.comment.created_at ?? now,
      actor: payload.comment.user?.login ?? "unknown",
      actor_association: assoc(payload.comment.author_association),
      actor_is_bot: payload.comment.user?.type === "Bot",
      ...payload.comment.body == null ? {} : { body: payload.comment.body },
      ...onPr ? { ref: `#${payload.pull_request?.number ?? payload.issue?.number ?? 0}`, pr: payload.pull_request?.number ?? payload.issue?.number ?? 0 } : { ref: `#${payload.issue?.number ?? 0}` },
      // A comment on a PR from a fork is still a fork event: the PR's head
      // repository, not the commenter, decides that.
      ...payload.pull_request === void 0 ? {} : { from_fork: isFork(payload.pull_request) }
    };
  }
  if (eventName === "workflow_run" && payload.workflow_run !== void 0) {
    const wr = payload.workflow_run;
    if (wr.conclusion !== "failure") return null;
    return {
      id,
      kind: "ci_failure_on_main",
      at: now,
      actor: "github-actions",
      actor_association: "NONE",
      actor_is_bot: true,
      title: `CI failed on ${wr.head_branch ?? "main"}: ${wr.name ?? "workflow"}`,
      ...wr.id === void 0 ? {} : { body: `Failing run: ${wr.id}` }
    };
  }
  if (eventName === "workflow_dispatch") {
    const inputs = payload.inputs ?? {};
    const kindInput = inputs["kind"];
    return {
      id,
      kind: kindInput ?? "dashboard_dispatch",
      at: now,
      actor: payload.sender?.login ?? "unknown",
      // A dispatch is only possible for someone with write access, so the
      // association GitHub would report is at least a collaborator's.
      actor_association: "COLLABORATOR",
      ...inputs["title"] === void 0 ? {} : { title: inputs["title"] },
      ...inputs["body"] === void 0 ? {} : { body: inputs["body"] },
      ...inputs["ref"] === void 0 ? {} : { ref: inputs["ref"] }
    };
  }
  return null;
}
function isFork(pr) {
  const head = pr.head?.repo?.full_name;
  const base = pr.base?.repo?.full_name;
  if (head === void 0 || head === null) return true;
  return base !== void 0 && head !== base;
}
async function runIntakeCommand(opts) {
  const store = new FactoryStore(opts.gh);
  const payload = JSON.parse(readFileSync5(opts.eventPath, "utf8"));
  const incoming = normalizeEvent(opts.eventName, payload, opts.now);
  const existing = await store.data.read(INCOMING) ?? "";
  const queued = existing.split("\n").filter((l) => l.trim() !== "").map((l) => JSON.parse(l));
  if (incoming !== null && !queued.some((e) => e.id === incoming.id)) {
    queued.push(incoming);
    await store.data.commitWithRetry(
      async () => {
        const text = await store.data.read(INCOMING) ?? "";
        return [{ path: INCOMING, content: `${text}${JSON.stringify(incoming)}
` }];
      },
      `intake: record ${incoming.kind}`
    );
  }
  const cursorDoc = await store.data.readJson(CURSOR);
  const cursor = cursorDoc?.cursor ?? 0;
  const ledger = await store.ledger(opts.now);
  const openItems = ledger.open.map((o) => ({
    work_item: o.work_item,
    status: o.status,
    pipeline: o.pipeline,
    ...o.fingerprint === void 0 ? {} : { fingerprint: o.fingerprint }
  }));
  const result = runIntake(queued, {
    policy: opts.policy,
    triggers: opts.triggers,
    cursor,
    openItems,
    recentlyMerged: ledger.recent.filter((r) => r.merged_at !== void 0).map((r) => ({
      work_item: r.work_item,
      ...r.fingerprint === void 0 ? {} : { fingerprint: r.fingerprint },
      ...r.pr == null ? {} : { pr: r.pr }
    })),
    // A ULID, so the id sorts chronologically and matches the schema's
    // pattern. The event's own timestamp seeds it, so re-running intake over
    // the same event queue produces ids in the same order.
    newId: (e) => workItemId(Date.parse(e.at) || Date.now())
  });
  const changes = [];
  const newItems = [];
  for (const d of result.decisions) {
    if (d.workItem === null) continue;
    changes.push({ path: workItemPath(d.workItem.id), content: json(d.workItem) });
    newItems.push({
      id: d.workItem.id,
      priority: d.workItem.priority,
      pipeline: d.workItem.pipeline,
      created_at: d.workItem.created_at,
      fingerprint: d.workItem.fingerprint,
      status: d.workItem.status
    });
  }
  if (newItems.length > 0 || result.cursor !== cursor) {
    const nextLedger = {
      ...ledger,
      updated_at: opts.now,
      open: [
        ...ledger.open,
        ...newItems.filter((i) => !ledger.open.some((o) => o.work_item === i.id)).map((i) => ({
          work_item: i.id,
          pipeline: i.pipeline,
          status: i.status,
          fingerprint: i.fingerprint,
          priority: i.priority,
          created_at: i.created_at
        }))
      ]
    };
    changes.push({ path: LEDGER, content: json(nextLedger) });
    changes.push({ path: CURSOR, content: json({ cursor: result.cursor, updated_at: opts.now }) });
    const remaining = queued.filter((e) => e.id > result.cursor);
    changes.push({
      path: INCOMING,
      content: remaining.map((e) => JSON.stringify(e)).join("\n") + (remaining.length > 0 ? "\n" : "")
    });
  }
  let commit = null;
  if (changes.length > 0) {
    commit = await store.put(changes, `intake: ${newItems.length} work item(s), cursor ${result.cursor}`);
  }
  const queuedItems = [
    ...newItems.filter((i) => i.status === "queued"),
    ...ledger.open.filter((o) => o.status === "queued" && !newItems.some((i) => i.id === o.work_item)).map((o) => ({
      id: o.work_item,
      pipeline: o.pipeline,
      priority: o.priority ?? "normal",
      created_at: o.created_at ?? opts.now,
      fingerprint: o.fingerprint ?? "",
      status: o.status
    }))
  ];
  const decision = chooseDispatches(
    queuedItems.map((i) => ({
      work_item: i.id,
      priority: i.priority,
      pipeline: i.pipeline,
      created_at: i.created_at
    })),
    { running: opts.runningRuns, maxRuns: opts.maxRuns, pausedPipelines: opts.pausedPipelines ?? [] }
  );
  const dispatched = [];
  if (opts.plan !== true) {
    for (const id of decision.dispatch) {
      await opts.gh.dispatchWorkflow(opts.runWorkflow ?? "factory-run.yml", opts.ref, {
        work_item: id
      });
      dispatched.push(id);
    }
  }
  return { result, dispatched, commit, decision };
}

// src/commands/rollup-run.ts
init_store();
init_dataref();

// src/commands/rollup.ts
var OPEN_STATUSES = /* @__PURE__ */ new Set(["queued", "running", "in_review", "queued_to_merge", "escalated", "waiting_trust", "needs_info"]);
function withinWindow(at, now, days) {
  const t = Date.parse(at);
  const n = Date.parse(now);
  if (Number.isNaN(t) || Number.isNaN(n)) return false;
  return n - t <= days * 864e5;
}
function percentile(sorted, p) {
  if (sorted.length === 0) return 0;
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil(p / 100 * sorted.length) - 1));
  return sorted[idx] ?? 0;
}
function runRollup(input) {
  const inWindow = input.runs.filter((r) => withinWindow(r.ended_at, input.now, input.windowDays));
  const merged = inWindow.filter((r) => r.outcome === "merged");
  const agentMerged = merged.filter((r) => r.actor_kind === "agent");
  const noHumanChanges = agentMerged.filter((r) => r.needed_no_human_changes === true);
  const reverted = agentMerged.filter((r) => r.reverted === true);
  const automation_rate = merged.length === 0 ? 0 : round3(noHumanChanges.length / merged.length);
  const revert_rate = agentMerged.length === 0 ? 0 : round3(reverted.length / agentMerged.length);
  const byPipeline = {};
  for (const r of inWindow) {
    const b = byPipeline[r.pipeline] ??= { runs: 0, merged: 0, spend_usd: 0, revert_rate: 0 };
    b.runs += 1;
    if (r.outcome === "merged") b.merged += 1;
    b.spend_usd = round2(b.spend_usd + r.cost_usd);
  }
  for (const [pipeline, b] of Object.entries(byPipeline)) {
    const pMerged = agentMerged.filter((r) => r.pipeline === pipeline);
    const pReverted = pMerged.filter((r) => r.reverted === true);
    b.revert_rate = pMerged.length === 0 ? 0 : round3(pReverted.length / pMerged.length);
  }
  const measured = agentMerged.map((r) => r.human_interactions?.total).filter((n) => typeof n === "number");
  const human_interactions_per_pr = measured.length === 0 ? null : round2(measured.reduce((a, b) => a + b, 0) / measured.length);
  const cycleTimes = [];
  for (const item of input.workItems) {
    if (item.merged_at === void 0) continue;
    if (!withinWindow(item.merged_at, input.now, input.windowDays)) continue;
    const d = (Date.parse(item.merged_at) - Date.parse(item.created_at)) / 1e3;
    if (Number.isFinite(d) && d >= 0) cycleTimes.push(Math.round(d));
  }
  cycleTimes.sort((a, b) => a - b);
  const openItems = input.workItems.filter((i) => OPEN_STATUSES.has(i.status));
  const recentItems = input.workItems.filter(
    (i) => i.merged_at !== void 0 && withinWindow(i.merged_at, input.now, 30)
  );
  const queued = openItems.filter((i) => i.status === "queued").map((i) => ({ work_item: i.id, pipeline: i.pipeline, priority: i.priority, created_at: i.created_at }));
  const dispatch = chooseDispatches(queued, {
    maxRuns: input.maxRuns,
    running: input.runningRuns,
    pausedPipelines: input.pausedPipelines
  });
  return {
    metrics: {
      window_days: input.windowDays,
      runs: inWindow.length,
      merged: merged.length,
      escalated: inWindow.filter((r) => r.escalated).length,
      automation_rate,
      human_interactions_per_pr,
      revert_rate,
      spend_usd: round2(inWindow.reduce((a, r) => a + r.cost_usd, 0)),
      cycle_time_p50_sec: percentile(cycleTimes, 50),
      cycle_time_p90_sec: percentile(cycleTimes, 90),
      by_pipeline: byPipeline
    },
    openItems,
    recentItems,
    dispatch: dispatch.dispatch,
    dispatchReason: dispatch.reason
  };
}
function round2(n) {
  return Math.round(n * 100) / 100;
}
function round3(n) {
  return Math.round(n * 1e3) / 1e3;
}
var SHARE_OF = {
  product_work: "product_work",
  conflict: "product_work",
  gardening: "gardening",
  hardening: "gardening",
  definition: "review_and_benchmarks"
};
function pausedPipelines(state) {
  const paused = [];
  const totalUsd = Object.values(state.spentUsd).reduce((a, b) => a + b, 0);
  const totalMin = Object.values(state.spentMinutes).reduce((a, b) => a + b, 0);
  for (const pipeline of Object.keys(SHARE_OF)) {
    const share = SHARE_OF[pipeline];
    const usdShare = state.limitUsd * state.shares[share] / 100;
    const spentUsd = state.spentUsd[share] ?? 0;
    const minShare = state.limitMinutes === null ? null : state.limitMinutes * state.shares[share] / 100;
    const spentMin = state.spentMinutes[share] ?? 0;
    if (share === "product_work") {
      const hardUsd = state.limitUsd * state.productHardStopPct / 100;
      const hardMin = state.limitMinutes === null ? null : state.limitMinutes * state.productHardStopPct / 100;
      if (totalUsd >= hardUsd) {
        paused.push(pipeline);
        continue;
      }
      if (hardMin !== null && totalMin >= hardMin) {
        paused.push(pipeline);
        continue;
      }
      continue;
    }
    if (spentUsd >= usdShare) {
      paused.push(pipeline);
      continue;
    }
    if (minShare !== null && spentMin >= minShare) {
      paused.push(pipeline);
      continue;
    }
  }
  return paused;
}

// src/commands/rollup-run.ts
async function readAll(store) {
  const paths = await store.data.list();
  const runPaths = paths.filter((p) => /^runs\/[^/]+\.json$/.test(p));
  const itemPaths = paths.filter((p) => p.startsWith("work-items/") && p.endsWith(".json"));
  const runs = [];
  for (const p of runPaths) {
    const doc = await store.get(p, "run");
    if (doc !== null) runs.push(doc);
  }
  const workItems = [];
  for (const p of itemPaths) {
    const doc = await store.get(p, "work-item");
    if (doc !== null) workItems.push(doc);
  }
  return { runs, workItems };
}
async function runRollupCommand(opts) {
  const store = new FactoryStore(opts.gh);
  const { runs, workItems } = await readAll(store);
  const ledger = await store.ledger(opts.now);
  const paused = pausedPipelines(opts.budget);
  const running = runs.filter((r) => r.outcome === "running").length;
  const result = runRollup({
    now: opts.now,
    runs,
    workItems,
    mergeQueue: ledger.merge_queue,
    runningRuns: running,
    maxRuns: opts.maxRuns,
    pausedPipelines: paused,
    windowDays: opts.windowDays
  });
  const index = {
    schema: "index/1",
    updated_at: opts.now,
    factory: { runner: opts.runnerPin, harness: opts.harness },
    metrics: result.metrics,
    recent_runs: runs.slice().sort((a, b) => b.ended_at.localeCompare(a.ended_at)).slice(0, 20).map((r) => ({
      id: r.id,
      pipeline: r.pipeline,
      outcome: r.outcome,
      ended_at: r.ended_at,
      cost_usd: r.cost_usd,
      ...r.pr == null ? {} : { pr: r.pr }
    })),
    guardrails: opts.guardrails,
    health: opts.health
  };
  const nextLedger = {
    schema: "ledger/1",
    updated_at: opts.now,
    open: result.openItems.map((i) => ({
      work_item: i.id,
      pipeline: i.pipeline,
      status: i.status,
      priority: i.priority,
      created_at: i.created_at,
      ...i.fingerprint === void 0 ? {} : { fingerprint: i.fingerprint },
      ...i.pr == null ? {} : { pr: i.pr },
      ...i.fixes === void 0 ? {} : { fixes: [...i.fixes] }
    })),
    recent: result.recentItems.map((i) => ({
      work_item: i.id,
      status: i.status,
      ...i.merged_at === void 0 ? {} : { merged_at: i.merged_at },
      ...i.fingerprint === void 0 ? {} : { fingerprint: i.fingerprint },
      ...i.pr == null ? {} : { pr: i.pr }
    })),
    merge_queue: ledger.merge_queue
  };
  const changes = [
    { path: INDEX, content: json(index) },
    { path: LEDGER, content: json(nextLedger) },
    { path: BUDGET, content: json({ updated_at: opts.now, paused, budget: opts.budget }) }
  ];
  const commit = await store.put(changes, `rollup: ${result.metrics.runs} run(s) in window`);
  const dispatched = [];
  if (opts.plan !== true) {
    for (const id of result.dispatch) {
      await opts.gh.dispatchWorkflow(opts.runWorkflow ?? "factory-run.yml", opts.ref, {
        work_item: id
      });
      dispatched.push(id);
    }
  }
  return {
    metrics: result.metrics,
    dispatched,
    dispatchReason: result.dispatchReason,
    paused,
    commit
  };
}
async function squashMedia(gh, now, retentionMonths) {
  const media = new FactoryStore(gh, MEDIA_REF);
  const paths = await media.data.list();
  const cutoff = new Date(now);
  cutoff.setMonth(cutoff.getMonth() - retentionMonths);
  const keep = [];
  const drop = [];
  for (const p of paths) {
    const m = /(\d{4}-\d{2}-\d{2})/.exec(p);
    const at = m?.[1] === void 0 ? null : Date.parse(m[1]);
    if (at === null || Number.isNaN(at) || at >= cutoff.getTime()) keep.push(p);
    else drop.push(p);
  }
  if (drop.length === 0) return { kept: keep.length, dropped: 0 };
  await media.data.replaceWith(
    keep,
    `media: keep ${keep.length} file(s), drop ${drop.length} past ${retentionMonths} months`
  );
  return { kept: keep.length, dropped: drop.length };
}

// src/commands/merge-run.ts
init_store();

// src/commands/interactions.ts
function countInteractions(input) {
  const machine = /* @__PURE__ */ new Set([
    ...input.appLogins.map((l) => l.toLowerCase()),
    input.prAuthor.toLowerCase()
  ]);
  const isHuman = (login) => {
    if (login === null || login === void 0) return false;
    const l = login.toLowerCase();
    return !machine.has(l) && !l.endsWith("[bot]");
  };
  const comments = input.issueComments.filter((c) => isHuman(c.user?.login)).length + input.reviewComments.filter((c) => isHuman(c.user?.login)).length + // A review left as a plain comment is a comment; an approval is the gate
  // working, not steering.
  input.reviews.filter((r) => isHuman(r.user?.login) && r.state === "COMMENTED").length;
  const change_requests = input.reviews.filter(
    (r) => isHuman(r.user?.login) && r.state === "CHANGES_REQUESTED"
  ).length;
  const human_commits = input.commits.filter(
    (c) => isHuman(c.author?.login) || isHuman(c.committer?.login)
  ).length;
  return { comments, change_requests, human_commits, total: comments + change_requests + human_commits };
}
async function fetchInteractions(opts) {
  const base = `repos/${opts.gh.repo}`;
  try {
    const [issueComments, reviewComments, reviews, commits] = await Promise.all([
      opts.gh.get(`${base}/issues/${opts.pr}/comments?per_page=100`, {
        paginate: true
      }),
      opts.gh.get(`${base}/pulls/${opts.pr}/comments?per_page=100`, {
        paginate: true
      }),
      opts.gh.get(`${base}/pulls/${opts.pr}/reviews?per_page=100`, {
        paginate: true
      }),
      opts.gh.get(`${base}/pulls/${opts.pr}/commits?per_page=100`, {
        paginate: true
      })
    ]);
    return countInteractions({
      issueComments,
      reviewComments,
      reviews,
      commits,
      prAuthor: opts.prAuthor,
      appLogins: opts.appLogins
    });
  } catch {
    return null;
  }
}

// src/commands/merge-queue.ts
function isEligible(c) {
  if (c.conflicting === true) return { ok: false, reason: "conflicting with main" };
  if (c.gates_passed_on === null) return { ok: false, reason: "gates have not passed" };
  if (c.gates_passed_on !== c.head_sha) {
    return { ok: false, reason: `gates passed on ${c.gates_passed_on}, not on the head commit ${c.head_sha}` };
  }
  if (c.needs_human_whatever_the_toggles && !c.approved_by_human) {
    return { ok: false, reason: "needs a trusted human's approval, whatever the toggles say" };
  }
  if (!c.approved_by_human && !c.auto_merge_on) {
    return { ok: false, reason: "no human approval and auto-merge is off for this pipeline" };
  }
  return { ok: true, reason: c.approved_by_human ? "approved by a trusted human" : "auto-merge is on" };
}
function queueOrder(candidates) {
  return candidates.filter((c) => isEligible(c).ok).slice().sort((a, b) => a.eligible_at.localeCompare(b.eligible_at) || a.pr - b.pr);
}
function nextAction(candidates) {
  const ordered = queueOrder(candidates);
  const head = ordered[0];
  if (head === void 0) {
    const firstBlocked = candidates[0];
    return {
      kind: "not_eligible",
      pr: firstBlocked?.pr ?? 0,
      reason: firstBlocked === void 0 ? "queue is empty" : isEligible(firstBlocked).reason
    };
  }
  if (head.conflicting === true) {
    return { kind: "resolve_conflict", pr: head.pr, reason: "conflicts with main; a resolution run rebases and re-clears" };
  }
  if (!head.up_to_date) {
    return {
      kind: "update_from_main",
      pr: head.pr,
      reason: "behind main: update, then re-run the gates against the latest main before merging"
    };
  }
  return { kind: "merge", pr: head.pr, reason: "up to date with gates passed on the head commit" };
}
function humanPrMayMerge(pr) {
  if (!pr.up_to_date) {
    return { ok: false, reason: "behind main: update the branch so it is re-checked against the latest main" };
  }
  if (pr.deterministic_gates_passed_on !== pr.head_sha) {
    return { ok: false, reason: "the deterministic gates have not passed on the head commit" };
  }
  return { ok: true, reason: "up to date and the deterministic gates passed" };
}

// src/commands/merge-run.ts
var ALWAYS_HUMAN = ["definition"];
async function runMergeCommand(opts) {
  const store = new FactoryStore(opts.gh);
  const ledger = await store.ledger(opts.now);
  const gatesCheck = opts.gatesCheck ?? "factory/gates";
  const policyCheck = opts.policyCheck ?? "factory/policy";
  const list = await opts.gh.get(
    `repos/${opts.gh.repo}/pulls?state=open&per_page=100`,
    { paginate: true }
  );
  const candidates = [];
  const humanPrs = [];
  for (const brief of list) {
    const pr = await opts.gh.pull(brief.number);
    const queued = ledger.merge_queue.find((q) => q.pr === pr.number);
    const item = ledger.open.find((o) => o.pr === pr.number);
    const pipeline = queued?.pipeline ?? item?.pipeline;
    const checks = await opts.gh.get(
      `repos/${opts.gh.repo}/commits/${pr.head.sha}/check-runs?per_page=100`
    );
    const conclusionOf = (name) => checks.check_runs.find((c) => c.name === name)?.conclusion ?? null;
    const gatesPassed = conclusionOf(gatesCheck) === "success";
    const policyPassed = conclusionOf(policyCheck) === "success";
    const reviews = await opts.gh.pullReviews(pr.number);
    const approvedByHuman = hasTrustedHumanApproval({
      policy: opts.policy,
      pr: {
        number: pr.number,
        head_sha: pr.head.sha,
        base_ref: pr.base.ref,
        author: pr.user.login,
        author_association: pr.author_association,
        from_fork: pr.head.repo === null || pr.head.repo.full_name !== pr.base.repo.full_name,
        labels: pr.labels.map((l) => l.name),
        changed_files: [],
        draft: pr.draft,
        reviews: reviews.map(toReview),
        ...pipeline === void 0 ? {} : { pipeline }
      },
      appLogins: opts.appLogins ?? []
    });
    if (pipeline === void 0) {
      const may = humanPrMayMerge({
        up_to_date: pr.mergeable_state !== "behind",
        deterministic_gates_passed_on: gatesPassed ? pr.head.sha : null,
        head_sha: pr.head.sha
      });
      humanPrs.push({ pr: pr.number, reason: may.reason });
      continue;
    }
    candidates.push({
      pr: pr.number,
      work_item: queued?.work_item ?? item?.work_item ?? "",
      pipeline,
      eligible_at: queued?.eligible_at ?? pr.updated_at ?? opts.now,
      gates_passed_on: gatesPassed && !pr.draft ? pr.head.sha : null,
      head_sha: pr.head.sha,
      approved_by_human: approvedByHuman,
      auto_merge_on: opts.autoMerge[pipeline] === true,
      up_to_date: pr.mergeable_state !== "behind",
      // A failed policy check is exactly the "needs a human whatever the
      // toggles say" case: it is what fires on a weakening or a protected path.
      needs_human_whatever_the_toggles: !policyPassed || ALWAYS_HUMAN.includes(pipeline),
      ...pr.mergeable_state === "dirty" ? { conflicting: true } : {}
    });
  }
  const action = nextAction(candidates);
  const eligible = queueOrder(candidates);
  const blocked = candidates.filter((c) => !eligible.some((e) => e.pr === c.pr)).map((c) => ({ pr: c.pr, reason: isEligible(c).reason }));
  let applied = null;
  if (opts.apply === true) {
    applied = await apply(opts, action, candidates);
    if (action.kind === "merge" && applied !== null) {
      const changes = [
        {
          path: LEDGER,
          content: json({
            ...ledger,
            updated_at: opts.now,
            merge_queue: ledger.merge_queue.filter((q) => q.pr !== action.pr)
          })
        },
        // Counted here because this is the moment the PR is finished: a count
        // taken earlier would miss the last round of review, and one taken
        // later costs API calls on every rollup forever.
        ...await interactionChanges(store, opts, action.pr, candidates)
      ];
      await store.put(changes, `merge-queue: #${action.pr} merged`);
    }
  }
  return { considered: candidates.length, action, applied, blocked, humanPrs };
}
async function interactionChanges(store, opts, pr, candidates) {
  const head = candidates.find((c) => c.pr === pr);
  if (head === void 0 || head.work_item === "") return [];
  const item = await store.get(
    workItemPath(head.work_item),
    "work-item"
  ).catch(() => null);
  const runId = item?.runs?.[item.runs.length - 1];
  if (runId === void 0) return [];
  const run = await store.get(runPath(runId), "run").catch(() => null);
  if (run === null) return [];
  const interactions = await fetchInteractions({
    gh: opts.gh,
    pr,
    prAuthor: run.actor ?? "",
    appLogins: opts.appLogins ?? []
  });
  if (interactions === null) return [];
  return [{ path: runPath(runId), content: json({ ...run, human_interactions: interactions }) }];
}
async function apply(opts, action, candidates) {
  const head = candidates.find((c) => c.pr === action.pr);
  if (head === void 0) return null;
  const repo = opts.gh.repo;
  switch (action.kind) {
    case "not_eligible":
      return null;
    case "resolve_conflict":
      await opts.gh.dispatchWorkflow("factory-run.yml", void 0, {
        work_item: head.work_item,
        reason: "conflict"
      });
      return `dispatched a resolution run for #${action.pr}`;
    case "update_from_main":
      await opts.gh.send("PUT", `repos/${repo}/pulls/${action.pr}/update-branch`, {
        expected_head_sha: head.head_sha
      });
      return `updated #${action.pr} from main`;
    case "recheck":
      await opts.gh.dispatchWorkflow("factory-gates.yml", void 0, { pr: String(action.pr) });
      return `re-ran the gates on #${action.pr}`;
    case "merge": {
      if (opts.nativeQueue) {
        await opts.gh.send("PUT", `repos/${repo}/pulls/${action.pr}/merge`, {
          merge_method: opts.mergeMethod ?? "squash",
          sha: head.head_sha
        });
        return `queued #${action.pr}`;
      }
      await opts.gh.send("PUT", `repos/${repo}/pulls/${action.pr}/merge`, {
        merge_method: opts.mergeMethod ?? "squash",
        sha: head.head_sha
      });
      return `merged #${action.pr}`;
    }
  }
}

// src/commands/garden.ts
init_store();
import { execFile as execFile2 } from "node:child_process";
import { promisify as promisify2 } from "node:util";
var exec2 = promisify2(execFile2);
function baselinedDrift(baselines) {
  const byRule = /* @__PURE__ */ new Map();
  for (const [rule, entry] of Object.entries(baselines.rules ?? {})) {
    if (entry.retired === true) continue;
    for (const [file, count] of Object.entries(byFileOf(entry))) {
      if (count <= 0 || file === "") continue;
      const e = byRule.get(rule) ?? { count: 0, files: [] };
      e.count += count;
      e.files.push(file);
      byRule.set(rule, e);
    }
  }
  return [...byRule.entries()].sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0])).map(([rule, e]) => ({
    kind: "baselined_violations",
    problem_class: rule,
    occurrences: e.count,
    // Capped at the per-PR file limit, so the item as filed is already
    // small enough to be one reviewable PR (doc 06: at most 20 files).
    files: e.files.slice(0, MAX_FILES_PER_PR),
    detail: `${e.count} baselined violation(s) of ${rule} across ${e.files.length} file(s)` + (e.files.length > MAX_FILES_PER_PR ? `; this PR takes the first ${MAX_FILES_PER_PR}` : "")
  }));
}
var MAX_FILES_PER_PR = 20;
var TEST_PATTERN = /(^|\/)(tests?|spec|__tests__)\//i;
var TEST_FILE = /\.(test|spec)\.[tj]sx?$|_test\.py$|^test_.*\.py$/i;
var isTest = (p) => TEST_PATTERN.test(p) || TEST_FILE.test(p.split("/").pop() ?? "");
async function untestedRecent(root, days, sourceGlobs = []) {
  let log;
  try {
    const { stdout } = await exec2(
      "git",
      ["log", `--since=${days} days ago`, "--first-parent", "--format=%H", "--no-merges"],
      { cwd: root, maxBuffer: 16 * 1024 * 1024 }
    );
    log = String(stdout);
  } catch {
    return [];
  }
  const untested = /* @__PURE__ */ new Map();
  for (const sha of log.split("\n").map((s) => s.trim()).filter((s) => s !== "")) {
    let files;
    try {
      const { stdout } = await exec2("git", ["show", "--name-only", "--format=", sha], { cwd: root });
      files = String(stdout).split("\n").map((s) => s.trim()).filter((s) => s !== "");
    } catch {
      continue;
    }
    if (files.some(isTest)) continue;
    const source = files.filter((f) => !isTest(f) && looksLikeSource(f, sourceGlobs));
    if (source.length === 0) continue;
    for (const f of source) {
      const dir = f.split("/").slice(0, -1).join("/") || ".";
      const list = untested.get(dir);
      if (list === void 0) untested.set(dir, [f]);
      else list.push(f);
    }
  }
  return [...untested.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])).map(([dir, files]) => ({
    kind: "untested_recent_behaviour",
    problem_class: `untested behaviour in ${dir}`,
    occurrences: files.length,
    files: [...new Set(files)].slice(0, MAX_FILES_PER_PR),
    detail: `${new Set(files).size} file(s) changed in the last ${days} days with no test in the same commit`
  }));
}
var SOURCE_EXT = /\.(ts|tsx|js|jsx|mjs|cjs|py|go|rb|java|kt|rs|cs|php|swift)$/i;
function looksLikeSource(path2, globs) {
  if (globs.length > 0) return globs.some((g) => path2.startsWith(g.replace(/\*+$/, "")));
  if (!SOURCE_EXT.test(path2)) return false;
  return !/(^|\/)(node_modules|dist|build|vendor|\.next|coverage|migrations)\//.test(path2);
}
var ORDER = {
  baselined_violations: 0,
  untested_recent_behaviour: 1,
  principle_drift: 2
};
async function runGardenCommand(opts) {
  const store = new FactoryStore(opts.gh);
  const ledger = await store.ledger(opts.now);
  const alreadyFixing = new Set(ledger.open.flatMap((o) => o.fixes ?? []));
  const found = [
    ...baselinedDrift(opts.baselines),
    ...await untestedRecent(opts.root, opts.windowDays ?? 14, opts.sourceGlobs ?? []),
    ...opts.extra ?? []
  ];
  const skipped = [];
  const eligible = found.filter((i) => {
    if (alreadyFixing.has(i.problem_class)) {
      skipped.push({ problem_class: i.problem_class, reason: "an open PR already fixes this" });
      return false;
    }
    return true;
  });
  const picked = eligible.slice().sort((a, b) => ORDER[a.kind] - ORDER[b.kind] || b.occurrences - a.occurrences).slice(0, Math.max(0, opts.maxPrs));
  const changes = [];
  const filed = [];
  const open = [...ledger.open];
  for (const item of picked) {
    const id = workItemId(Date.parse(opts.now) || Date.now());
    const workItem = {
      schema: "work-item/1",
      id,
      created_at: opts.now,
      source: { kind: sourceKind("schedule_gardening"), ref: null, actor: "factory", via: null },
      trigger_class: "scheduled",
      pipeline: "gardening",
      title: `Gardening: ${item.problem_class}`,
      body: `${item.detail}

Files:
${item.files.map((f) => `- ${f}`).join("\n")}`,
      priority: "normal",
      fingerprint: fingerprint({ title: item.problem_class, body: item.kind }),
      status: "queued",
      runs: [],
      pr: null,
      parent: null,
      related: [],
      spec: null
    };
    changes.push({ path: workItemPath(id), content: json(workItem) });
    open.push({
      work_item: id,
      pipeline: "gardening",
      status: "queued",
      fingerprint: workItem.fingerprint,
      priority: "normal",
      created_at: opts.now,
      // The ledger's `fixes` list is what stops the next night re-filing this.
      fixes: [item.problem_class]
    });
    filed.push(id);
  }
  if (changes.length > 0) {
    changes.push({ path: LEDGER, content: json({ ...ledger, updated_at: opts.now, open }) });
    await store.put(changes, `garden: file ${filed.length} item(s)`);
  }
  const slots = opts.freeSlots ?? filed.length;
  const dispatched = [];
  if (opts.plan !== true) {
    for (const id of filed.slice(0, Math.max(0, slots))) {
      await opts.gh.dispatchWorkflow("factory-run.yml", opts.ref, { work_item: id });
      dispatched.push(id);
    }
  }
  return { scan: { items: found, skipped }, picked, filed, dispatched };
}

// src/commands/conflicts.ts
init_store();
async function runConflictsCommand(opts) {
  const store = new FactoryStore(opts.gh);
  const ledger = await store.ledger(opts.now);
  const factoryPrs = /* @__PURE__ */ new Map();
  for (const o of ledger.open) if (o.pr != null) factoryPrs.set(o.pr, o.work_item);
  const conflicting = [];
  const clean = [];
  const unknown = [];
  for (const [pr, workItem] of factoryPrs) {
    const state = await mergeability(opts, pr);
    if (state === "conflicting") conflicting.push({ pr, work_item: workItem });
    else if (state === "clean") clean.push(pr);
    else unknown.push(pr);
  }
  const dispatched = [];
  if (opts.dispatch !== false) {
    for (const c of conflicting) {
      await opts.gh.dispatchWorkflow("factory-run.yml", opts.ref, {
        work_item: c.work_item,
        reason: "conflict"
      });
      dispatched.push(c.work_item);
    }
  }
  return { conflicting, clean, unknown, dispatched };
}
async function mergeability(opts, pr) {
  const retries = opts.retries ?? 3;
  const waitMs = opts.waitMs ?? 2e3;
  for (let i = 0; i <= retries; i++) {
    let doc;
    try {
      doc = await opts.gh.pull(pr);
    } catch {
      return "unknown";
    }
    if (doc.mergeable === true) return "clean";
    if (doc.mergeable === false) return "conflicting";
    if (i < retries) await new Promise((r) => setTimeout(r, waitMs));
  }
  return "unknown";
}

// src/commands/sync-settings.ts
async function runSyncCommand(opts) {
  const path2 = `repos/${opts.gh.repo}/branches/${opts.branch}/protection`;
  let current = null;
  try {
    current = await opts.gh.get(path2);
  } catch {
    current = null;
  }
  const existingChecks = [
    ...current?.required_status_checks?.contexts ?? [],
    ...(current?.required_status_checks?.checks ?? []).map((c) => c.context)
  ];
  const kept = [...new Set(existingChecks)];
  const added = opts.requiredChecks.filter((c) => !kept.includes(c));
  const declinedToLoosen = [];
  const existingReviews = current?.required_pull_request_reviews?.required_approving_review_count ?? 0;
  const reviewCount = Math.max(existingReviews, opts.requireReview ? 1 : 0);
  if (opts.requireReview === false && existingReviews > 0) {
    declinedToLoosen.push(`required_approving_review_count stays at ${existingReviews}`);
  }
  if (current?.enforce_admins?.enabled === true) {
    declinedToLoosen.push("enforce_admins stays on");
  }
  const body = {
    required_status_checks: {
      // "Strict" means a branch must be up to date with the base before it
      // merges. That is the setting behind "two PRs that pass alone cannot
      // break main together", so it is always on — it tightens, never loosens.
      strict: true,
      contexts: [...kept, ...added]
    },
    enforce_admins: current?.enforce_admins?.enabled ?? false,
    required_pull_request_reviews: reviewCount === 0 ? null : {
      required_approving_review_count: reviewCount,
      dismiss_stale_reviews: current?.required_pull_request_reviews?.dismiss_stale_reviews ?? true
    },
    restrictions: current?.restrictions ?? null,
    // Never widened: if force pushes were off, they stay off.
    allow_force_pushes: current?.allow_force_pushes?.enabled ?? false
  };
  let applied = false;
  if (opts.apply === true && (added.length > 0 || current === null)) {
    await opts.gh.send("PUT", path2, body);
    applied = true;
  }
  return { existed: current !== null, added, kept, declinedToLoosen, applied };
}

// src/commands/audit.ts
import { readFileSync as readFileSync6, existsSync as existsSync4, readdirSync as readdirSync2 } from "node:fs";
import { join as join5 } from "node:path";
import { createRequire } from "node:module";
async function runAuditCommand(opts) {
  const findings = [];
  const checked = [];
  const gatesCheck = opts.gatesCheck ?? "factory/gates";
  const policyCheck = opts.policyCheck ?? "factory/policy";
  checked.push("arrived through a pull request");
  const prs = await opts.gh.get(
    `search/issues?q=${encodeURIComponent(`repo:${opts.gh.repo} is:pr sha:${opts.commit}`)}`
  ).catch(() => null);
  const detail = await opts.gh.get(`repos/${opts.gh.repo}/commits/${opts.commit}`);
  const isMergeCommit = detail.parents.length > 1;
  if (prs === null) {
    findings.push({
      kind: "gate_not_run",
      detail: "could not ask GitHub which PR this commit came from, so nothing here is confirmed"
    });
  } else if (prs.total_count === 0 && !isMergeCommit) {
    findings.push({
      kind: "direct_push",
      detail: `${opts.commit.slice(0, 8)} is on main with no pull request: the gates never saw it`
    });
  }
  checked.push("the gate checks reported success on this commit");
  const runs = await opts.gh.get(
    `repos/${opts.gh.repo}/commits/${opts.commit}/check-runs?per_page=100`
  );
  for (const name of [gatesCheck, policyCheck]) {
    const run = runs.check_runs.find((c) => c.name === name);
    if (run === void 0) {
      findings.push({ kind: "gate_not_run", detail: `${name} never reported on ${opts.commit.slice(0, 8)}` });
    } else if (run.conclusion !== "success" && run.conclusion !== "neutral" && run.conclusion !== "skipped") {
      findings.push({
        kind: "gate_failed_but_merged",
        detail: `${name} concluded ${run.conclusion ?? "nothing"} and the commit is on main anyway`
      });
    }
  }
  checked.push("the configured App login matches the App's current slug");
  findings.push(...await appLoginDrift(opts));
  checked.push("every .lock.yml matches the .md it was compiled from");
  findings.push(...await staleLockFiles(opts.root, opts.workflowsDir ?? ".github/workflows"));
  return { commit: opts.commit, findings, checked };
}
async function appLoginDrift(opts) {
  const configured = opts.configuredAppLogins ?? [];
  if (configured.length === 0) {
    return [
      {
        kind: "app_login_stale",
        detail: "FACTORY_APP_LOGINS is not set, so an App's request for changes is not recognised as a gate signal. Setup stores it; set it to <app-slug>[bot] if setup predates that."
      }
    ];
  }
  let slug;
  try {
    const app = await opts.gh.get("app");
    if (typeof app.slug !== "string" || app.slug === "") return [];
    slug = app.slug;
  } catch {
    return [];
  }
  const expected = `${slug}[bot]`;
  if (configured.includes(expected)) return [];
  return [
    {
      kind: "app_login_stale",
      detail: `the App's login is now ${expected}, but FACTORY_APP_LOGINS says ${configured.join(", ")}. Renaming a GitHub App changes its slug; update the variable.`
    }
  ];
}
async function staleLockFiles(root, dir) {
  const full = join5(root, dir);
  if (!existsSync4(full)) return [];
  const findings = [];
  const hashes = loadHasher();
  for (const file of readdirSync2(full).filter((f) => f.startsWith("factory-role-") && f.endsWith(".md"))) {
    const md = join5(full, file);
    const lock = join5(full, file.replace(/\.md$/, ".lock.yml"));
    if (!existsSync4(lock)) {
      findings.push({ kind: "lock_file_missing", detail: `${file} has never been compiled` });
      continue;
    }
    const lockText = readFileSync6(lock, "utf8");
    const wantFrontmatter = hashes.extractHashFromLockFile(lockText);
    const wantBody = hashes.extractBodyHashFromLockFile(lockText);
    if (isBlank(wantFrontmatter) || isBlank(wantBody)) {
      findings.push({
        kind: "lock_file_stale",
        detail: `${file}: its lock file carries no gh-aw-metadata hashes, which means it was compiled by a gh-aw older than this check understands \u2014 recompile it`
      });
      continue;
    }
    const gotFrontmatter = await hashes.computeFrontmatterHash(md, {});
    const gotBody = await hashes.computeBodyHash(md, {});
    const drifted = [];
    if (gotFrontmatter !== wantFrontmatter) drifted.push("frontmatter");
    if (gotBody !== wantBody) drifted.push("body (the prompt)");
    if (drifted.length > 0) {
      findings.push({
        kind: "lock_file_stale",
        detail: `${file}: its ${drifted.join(" and ")} changed since it was compiled. The lock file is what runs, so the change is not in effect`
      });
    }
  }
  return findings;
}
function isBlank(value) {
  return value === null || value === void 0 || value.trim() === "";
}
function loadHasher() {
  const require_ = createRequire(import.meta.url);
  for (const rel2 of [
    "../../vendor/gh-aw/frontmatter_hash_pure.cjs",
    "../vendor/gh-aw/frontmatter_hash_pure.cjs",
    "./vendor/gh-aw/frontmatter_hash_pure.cjs"
  ]) {
    try {
      return require_(rel2);
    } catch {
    }
  }
  throw new Error("vendor/gh-aw/frontmatter_hash_pure.cjs not found");
}

// src/lib/yaml.ts
var import_yaml2 = __toESM(require_dist(), 1);
function parseYaml2(text) {
  return (0, import_yaml2.parse)(text);
}

// src/cli.ts
init_store();

// src/commands/doctor.ts
init_schema();
import { existsSync as existsSync5, readFileSync as readFileSync7, readdirSync as readdirSync3 } from "node:fs";
import { join as join6 } from "node:path";
var ROLES = ["triage", "spec", "builder", "verifier", "gardener", "hardener", "scorer"];
var CONTEXT = ["feature-map.md", "runbook.md", "fundamentals.md", "history.md"];
var TRIGGERS = [
  "factory-intake.yml",
  "factory-run.yml",
  "factory-gates.yml",
  "factory-policy.yml",
  "factory-rollup.yml",
  "factory-merge.yml",
  "factory-garden.yml",
  "factory-audit.yml",
  "factory-conflicts.yml",
  "factory-review.yml",
  "factory-sync.yml"
];
var FALLBACK_SECRETS = ["FACTORY_APP_PRIVATE_KEY"];
var FALLBACK_VARS = ["FACTORY_APP_CLIENT_ID"];
function referencedInWorkflows(root) {
  const dir = join6(root, ".github", "workflows");
  const secrets = /* @__PURE__ */ new Set();
  const required = /* @__PURE__ */ new Set();
  const seen = /* @__PURE__ */ new Set();
  if (!existsSync5(dir)) return { secrets: [], vars: [], optionalVars: [] };
  for (const f of readdirSync3(dir)) {
    if (!/^factory-.*\.(md|ya?ml)$/.test(f) || f.endsWith(".lock.yml")) continue;
    for (const line of readFileSync7(join6(dir, f), "utf8").split("\n")) {
      for (const m of line.matchAll(/\$\{\{[^}]*?\bsecrets\.([A-Za-z_][A-Za-z0-9_]*)/g)) {
        if (m[1] !== void 0 && m[1] !== "GITHUB_TOKEN") secrets.add(m[1]);
      }
      for (const m of line.matchAll(/\$\{\{[^}]*?\bvars\.([A-Za-z_][A-Za-z0-9_]*)/g)) {
        const name = m[1];
        if (name === void 0) continue;
        seen.add(name);
        const key = /^\s*([A-Za-z0-9_-]+)\s*:/.exec(line)?.[1] ?? "";
        if (!/^[A-Z][A-Z0-9_]*$/.test(key)) required.add(name);
      }
    }
  }
  return {
    secrets: [...secrets].sort(),
    vars: [...required].sort(),
    optionalVars: [...seen].filter((v) => !required.has(v)).sort()
  };
}
async function runDoctor(opts) {
  const findings = [];
  const checked = [];
  const def = join6(opts.root, ".factory/definition");
  const add = (check, severity, detail, repair) => void findings.push({ check, severity, detail, repair });
  const did = (check) => void checked.push(check);
  did("definition");
  if (!existsSync5(join6(def, "factory.yaml"))) {
    add(
      "definition",
      "note",
      ".factory/definition/factory.yaml is not there, so this repo has no factory yet",
      "run the setup skill to install one"
    );
    return { installed: false, findings, checked };
  }
  for (const [file, schema] of [
    ["factory.yaml", "factory"],
    ["policy.yaml", "policy"]
  ]) {
    const path2 = join6(def, file);
    if (!existsSync5(path2)) {
      add("definition", "broken", `${file} is missing`, "restore it from the template, or re-run setup");
      continue;
    }
    const problem = yamlProblem(path2, schema);
    if (problem !== null) {
      add(
        "definition",
        "broken",
        `${file} does not match its schema: ${problem}`,
        // Not repairable without a decision: the file holds the user's own
        // choices, and overwriting it with a template would discard them.
        null
      );
    }
  }
  const config = readYaml(join6(def, "factory.yaml"));
  const wantedRoles = rolesOf(config);
  did("roles");
  for (const role of wantedRoles) {
    if (!existsSync5(join6(def, "roles", `${role}.yaml`))) {
      add(
        "roles",
        // factory.yaml names a model for this role, so something expects to
        // run it; without its config that step fails rather than degrades.
        "broken",
        `roles/${role}.yaml is missing, but factory.yaml gives ${role} a model, so that step cannot run`,
        // Not "drop it from factory.yaml": the schema requires a model for
        // every role, so removing one makes factory.yaml invalid instead.
        "restore it from the template, or re-run setup"
      );
    }
  }
  did("context");
  for (const file of CONTEXT) {
    const path2 = join6(def, "context", file);
    if (!existsSync5(path2)) {
      add("context", "degraded", `context/${file} is missing`, "re-run setup");
    } else if (readFileSync7(path2, "utf8").trim() === "") {
      add("context", "degraded", `context/${file} is empty`, null);
    }
  }
  did("rubrics");
  for (const file of rubricsOf(config)) {
    if (!existsSync5(join6(def, "rubrics", file))) {
      add("rubrics", "degraded", `rubrics/${file} is missing, so that pipeline cannot be scored`, "re-run setup");
    }
  }
  did("guardrails");
  for (const [file, schema] of [
    ["baselines.json", "baselines"],
    ["candidates.json", "candidates"],
    ["coverage.json", "coverage"]
  ]) {
    const path2 = join6(opts.root, ".factory/guardrails", file);
    if (!existsSync5(path2)) continue;
    const problem = jsonProblem(path2, schema);
    if (problem !== null) {
      add(
        "guardrails",
        "broken",
        `guardrails/${file} does not match its schema: ${problem}`,
        // The gates read these every run; a broken one fails every PR.
        null
      );
    }
  }
  did("workflows");
  const wf = join6(opts.root, ".github/workflows");
  const roleWorkflows = wantedRoles;
  if (!existsSync5(wf)) {
    add("workflows", "broken", ".github/workflows is not there", "re-run setup");
  } else {
    const present = new Set(readdirSync3(wf));
    for (const file of TRIGGERS) {
      if (!present.has(file)) {
        add("workflows", "broken", `${file} is missing, so that part of the factory never fires`, "re-run setup");
      }
    }
    for (const role of roleWorkflows) {
      if (!present.has(`factory-role-${role}.md`)) {
        add("workflows", "broken", `factory-role-${role}.md is missing`, "re-run setup");
      }
    }
    findings.push(...(await staleLockFiles(opts.root, ".github/workflows")).map(lockFinding));
  }
  if (opts.gh === void 0) {
    add(
      "remote",
      "note",
      "secrets, variables and the data ref were not checked: no repo was given",
      "re-run with --repo OWNER/REPO"
    );
    return { installed: true, findings, checked };
  }
  const referenced = referencedInWorkflows(opts.root);
  const REQUIRED_SECRETS = referenced.secrets.length > 0 ? referenced.secrets : FALLBACK_SECRETS;
  const REQUIRED_VARS = referenced.vars.length > 0 ? referenced.vars : FALLBACK_VARS;
  did("secrets");
  const secretNames = await names(opts.gh, "actions/secrets", (r) => r.secrets);
  if (secretNames === null) {
    add("secrets", "note", "the secret list could not be read; the token may lack the scope", null);
  } else {
    for (const want of REQUIRED_SECRETS) {
      if (!secretNames.includes(want)) {
        add(
          "secrets",
          "broken",
          `the ${want} secret is not set, so every run that needs it fails`,
          // Only the user can: a secret's value must never pass through here.
          null
        );
      }
    }
  }
  did("variables");
  const varNames = await names(opts.gh, "actions/variables", (r) => r.variables);
  if (varNames === null) {
    add("variables", "note", "the variable list could not be read", null);
  } else {
    for (const want of REQUIRED_VARS) {
      if (!varNames.includes(want)) {
        add("variables", "broken", `the ${want} variable is not set`, "re-run the App setup step");
      }
    }
  }
  did("data ref");
  const ref = opts.dataRef ?? "refs/factory/data";
  const hasRef = await refExists(opts.gh, ref);
  if (hasRef === null) {
    add("data ref", "note", `${ref} could not be checked`, null);
  } else if (!hasRef) {
    add(
      "data ref",
      "degraded",
      `${ref} does not exist yet, so there is no run history to read`,
      // Not broken: the first run creates it.
      "nothing \u2014 the first run creates it"
    );
  }
  return { installed: true, findings, checked };
}
function lockFinding(f) {
  return {
    check: "workflows",
    // A stale lock file is the one gh-aw refuses to run, so the role silently
    // never starts. That is broken, not a note.
    severity: "broken",
    detail: f.detail,
    repair: "recompile with gh-aw, or let the recompiler App do it"
  };
}
function rolesOf(config) {
  const models = config?.models;
  if (models === void 0 || models === null) return ROLES;
  const named = ROLES.filter((r) => models[r] !== void 0);
  return named.length === 0 ? ROLES : named;
}
function rubricsOf(config) {
  const pipelines = config?.pipelines;
  const names2 = pipelines === void 0 || pipelines === null ? [] : Object.keys(pipelines);
  const wanted = names2.length === 0 ? ["product_work", "gardening", "hardening", "definition"] : names2;
  return [...wanted.map((n) => `${n}.yaml`), "shared.yaml"];
}
function readYaml(path2) {
  try {
    return parseYaml2(readFileSync7(path2, "utf8"));
  } catch {
    return null;
  }
}
function yamlProblem(path2, schema) {
  let doc;
  try {
    doc = parseYaml2(readFileSync7(path2, "utf8"));
  } catch (err) {
    return `could not be parsed (${String(err).slice(0, 120)})`;
  }
  return schemaProblem(schema, doc);
}
function jsonProblem(path2, schema) {
  let doc;
  try {
    doc = JSON.parse(readFileSync7(path2, "utf8"));
  } catch (err) {
    return `is not valid JSON (${String(err).slice(0, 120)})`;
  }
  return schemaProblem(schema, doc);
}
function schemaProblem(schema, doc) {
  const res = validate(schema, doc);
  if (res.ok) return null;
  return res.errors.slice(0, 3).map((e) => `${e.path} ${e.message}`).join("; ");
}
async function names(gh, path2, pick2) {
  try {
    const r = await gh.get(
      `repos/${gh.repo}/${path2}?per_page=100`
    );
    return (pick2(r) ?? []).map((s) => s.name);
  } catch {
    return null;
  }
}
async function refExists(gh, ref) {
  try {
    await gh.get(`repos/${gh.repo}/git/${ref}`);
    return true;
  } catch (err) {
    if (/not found/i.test(String(err))) return false;
    return null;
  }
}
function formatReport(report) {
  if (!report.installed) {
    return report.findings.map((f) => `${f.severity.padEnd(9)} ${f.detail}`).join("\n");
  }
  if (report.findings.length === 0) {
    return `nothing wrong (${report.checked.join(", ")} all checked)`;
  }
  const order = { broken: 0, degraded: 1, note: 2 };
  const lines = [...report.findings].sort((a, b) => order[a.severity] - order[b.severity]).map((f) => `${f.severity.padEnd(9)} ${f.check.padEnd(11)} ${f.detail}${f.repair === null ? "" : `
${" ".repeat(22)}\u2192 ${f.repair}`}`);
  const broken = report.findings.filter((f) => f.severity === "broken").length;
  return [
    ...lines,
    "",
    broken > 0 ? `${broken} thing(s) broken. Nothing has been changed; fix these before relying on the factory.` : "Nothing broken. Nothing has been changed."
  ].join("\n");
}

// src/commands/serve.ts
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { existsSync as existsSync6 } from "node:fs";
import { join as join7, extname, resolve, sep as sep2 } from "node:path";
var TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8"
};
function findDashboard(from) {
  for (const rel2 of ["dashboard/out", "../dashboard/out", "../../dashboard/out", "dashboard"]) {
    const dir = resolve(from, rel2);
    if (existsSync6(join7(dir, "index.html"))) return dir;
  }
  return null;
}
async function resolveFile(root, url) {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(url, "http://localhost").pathname);
  } catch {
    return null;
  }
  if (pathname.includes("\0")) return null;
  const candidate = resolve(root, `.${pathname}`);
  if (candidate !== root && !candidate.startsWith(root + sep2)) return null;
  for (const path2 of [candidate, join7(candidate, "index.html"), `${candidate}.html`]) {
    try {
      const info = await stat(path2);
      if (info.isFile()) return path2;
    } catch {
    }
  }
  return null;
}
function dashboardHandler(root) {
  return async (req, res) => {
    if (req.method !== "GET" && req.method !== "HEAD") {
      res.writeHead(405, { allow: "GET, HEAD" });
      res.end();
      return;
    }
    const file = await resolveFile(root, req.url ?? "/");
    if (file === null) {
      const notFound = join7(root, "404.html");
      const body2 = existsSync6(notFound) ? await readFile(notFound) : Buffer.from("not found\n");
      res.writeHead(404, { "content-type": existsSync6(notFound) ? TYPES[".html"] : TYPES[".txt"] });
      res.end(req.method === "HEAD" ? void 0 : body2);
      return;
    }
    const body = await readFile(file);
    res.writeHead(200, {
      "content-type": TYPES[extname(file).toLowerCase()] ?? "application/octet-stream",
      "content-length": String(body.length),
      // The page holds a GitHub token. These cost nothing and close the
      // obvious ways a local page gets turned against the person running it.
      "x-content-type-options": "nosniff",
      "referrer-policy": "no-referrer",
      // Served fresh: a cached build after an upgrade is a confusing bug.
      "cache-control": "no-store"
    });
    res.end(req.method === "HEAD" ? void 0 : body);
  };
}
async function serveDashboard(opts) {
  const server = createServer((req, res) => {
    void dashboardHandler(opts.root)(req, res).catch(() => {
      res.writeHead(500);
      res.end("error\n");
    });
  });
  const host = opts.host ?? "127.0.0.1";
  await new Promise((ok, fail) => {
    server.once("error", fail);
    server.listen(opts.port, host, ok);
  });
  const address = server.address();
  const port = typeof address === "object" && address !== null ? address.port : opts.port;
  return {
    url: `http://${host}:${port}`,
    close: () => new Promise((ok) => {
      server.close(() => ok());
    })
  };
}

// src/commands/consistency.ts
import { readFileSync as readFileSync8, existsSync as existsSync7 } from "node:fs";
import { join as join8 } from "node:path";

// src/lib/script_hazards.ts
var HAZARDS = [
  // Schema migrations. Each of these applies SQL to whatever the connection
  // string points at, and each is routinely wired into a build.
  { pattern: /\bdrizzle-kit\s+(migrate|push)\b/, effect: "applies database migrations", kind: "migration" },
  { pattern: /\bprisma\s+migrate\s+(deploy|dev)\b/, effect: "applies database migrations", kind: "migration" },
  { pattern: /\bprisma\s+db\s+push\b/, effect: "pushes the schema to the database", kind: "migration" },
  { pattern: /\bknex\s+migrate:(latest|up)\b/, effect: "applies database migrations", kind: "migration" },
  { pattern: /\bsequelize\s+db:migrate\b/, effect: "applies database migrations", kind: "migration" },
  { pattern: /\balembic\s+upgrade\b/, effect: "applies database migrations", kind: "migration" },
  { pattern: /\brails\s+db:migrate\b/, effect: "applies database migrations", kind: "migration" },
  { pattern: /\b(atlas\s+migrate\s+apply|flyway\s+migrate|goose\s+up|dbmate\s+up)\b/, effect: "applies database migrations", kind: "migration" },
  { pattern: /\bmikro-orm\s+migration:up\b/, effect: "applies database migrations", kind: "migration" },
  { pattern: /\btypeorm\s+migration:run\b/, effect: "applies database migrations", kind: "migration" },
  { pattern: /\bsupabase\s+db\s+push\b/, effect: "pushes the schema to the database", kind: "migration" },
  // Deploys. These make a change the public can see.
  { pattern: /\bvercel\s+(deploy|--prod)\b/, effect: "deploys to Vercel", kind: "deploy" },
  { pattern: /\bwrangler\s+(deploy|publish)\b/, effect: "deploys to Cloudflare", kind: "deploy" },
  { pattern: /\bfirebase\s+deploy\b/, effect: "deploys to Firebase", kind: "deploy" },
  { pattern: /\b(sls|serverless)\s+deploy\b/, effect: "deploys with Serverless", kind: "deploy" },
  { pattern: /\bnetlify\s+deploy\b/, effect: "deploys to Netlify", kind: "deploy" },
  { pattern: /\beb\s+deploy\b/, effect: "deploys to Elastic Beanstalk", kind: "deploy" },
  { pattern: /\bkubectl\s+(apply|delete)\b/, effect: "changes a Kubernetes cluster", kind: "infra" },
  { pattern: /\bhelm\s+(install|upgrade)\b/, effect: "changes a Kubernetes release", kind: "infra" },
  { pattern: /\bterraform\s+(apply|destroy)\b/, effect: "changes infrastructure", kind: "infra" },
  { pattern: /\bpulumi\s+up\b/, effect: "changes infrastructure", kind: "infra" },
  { pattern: /\baws\s+s3\s+(sync|cp|rm)\b/, effect: "writes to an S3 bucket", kind: "infra" },
  // Publishes. These are irreversible in the strongest sense: a registry
  // version, once taken, stays taken.
  { pattern: /\bnpm\s+publish\b/, effect: "publishes to the npm registry", kind: "publish" },
  { pattern: /\b(pnpm|yarn)\s+publish\b/, effect: "publishes to the npm registry", kind: "publish" },
  { pattern: /\btwine\s+upload\b/, effect: "publishes to PyPI", kind: "publish" },
  { pattern: /\bcargo\s+publish\b/, effect: "publishes to crates.io", kind: "publish" },
  { pattern: /\bgem\s+push\b/, effect: "publishes to RubyGems", kind: "publish" },
  { pattern: /\bdocker\s+push\b/, effect: "pushes a container image", kind: "publish" },
  { pattern: /\bgh\s+release\s+create\b/, effect: "creates a GitHub release", kind: "publish" }
];
var EXPECTED_SAFE = /^(build|test|tests|verify|check|ci|lint|typecheck|start|dev|serve|preview|compile|bundle)(:|$)/;
function invokedScripts(body, defined) {
  const out = /* @__PURE__ */ new Set();
  for (const m of body.matchAll(/\b(?:npm|pnpm|yarn|bun)\s+run\s+([a-zA-Z0-9:_.-]+)/g)) {
    const name = m[1];
    if (name !== void 0 && defined.has(name)) out.add(name);
  }
  for (const m of body.matchAll(/\b(?:run-s|run-p|npm-run-all)\s+([^&|;]+)/g)) {
    for (const word of (m[1] ?? "").split(/\s+/)) {
      if (word.startsWith("-") || word.includes("*")) continue;
      if (defined.has(word)) out.add(word);
    }
  }
  for (const m of body.matchAll(/\byarn\s+([a-zA-Z0-9:_.-]+)/g)) {
    const name = m[1];
    if (name !== void 0 && name !== "run" && defined.has(name)) out.add(name);
  }
  return [...out];
}
function hazardsIn(body) {
  const found = [];
  for (const h of HAZARDS) {
    const m = h.pattern.exec(body);
    if (m === null) continue;
    const start = m.index;
    const slice = body.slice(start).split(/\s*(?:&&|\|\||;|\|)\s*/)[0] ?? m[0];
    found.push({ command: slice.trim(), effect: h.effect, kind: h.kind });
  }
  return found;
}
function scriptHazards(scripts) {
  const defined = new Set(Object.keys(scripts));
  const out = [];
  for (const entry of Object.keys(scripts)) {
    if (!EXPECTED_SAFE.test(entry)) continue;
    const walk2 = (name, path2, seen) => {
      if (seen.has(name)) return;
      const body = scripts[name];
      if (body === void 0) return;
      const nextSeen = /* @__PURE__ */ new Set([...seen, name]);
      for (const h of hazardsIn(body)) {
        out.push({ script: entry, via: path2, command: h.command, effect: h.effect, kind: h.kind });
      }
      for (const hook of [`pre${name}`, `post${name}`]) {
        if (defined.has(hook)) walk2(hook, [...path2, hook], nextSeen);
      }
      for (const child of invokedScripts(body, defined)) {
        walk2(child, [...path2, child], nextSeen);
      }
    };
    walk2(entry, [entry], /* @__PURE__ */ new Set());
  }
  return out;
}
function describeHazard(h) {
  const chain = h.via.length > 1 ? ` (via ${h.via.join(" \u2192 ")})` : "";
  return `\`${h.script}\`${chain} ${h.effect}: \`${h.command}\``;
}

// src/commands/consistency.ts
function envVarsUsed(source) {
  const found = /* @__PURE__ */ new Set();
  const patterns = [
    // process.env.<name> and process.env["<name>"]
    /process\.env\.([A-Z][A-Z0-9_]{2,})/g,
    /process\.env\[\s*["'`]([A-Z][A-Z0-9_]{2,})["'`]\s*\]/g,
    // os.environ["<name>"], os.getenv("<name>"), os.environ.get("<name>")
    /os\.environ(?:\.get)?\[?\s*\(?\s*["']([A-Z][A-Z0-9_]{2,})["']/g,
    /os\.getenv\(\s*["']([A-Z][A-Z0-9_]{2,})["']/g,
    // os.Getenv("<name>") in Go
    /os\.Getenv\(\s*"([A-Z][A-Z0-9_]{2,})"/g,
    // The ${{ secrets.<name> }} and ${{ vars.<name> }} forms in workflows
    /\$\{\{\s*(?:secrets|vars)\.([A-Z][A-Z0-9_]{2,})\s*\}\}/g
  ];
  for (const re of patterns) {
    for (const m of source.matchAll(re)) {
      const name = m[1];
      if (name !== void 0) found.add(name);
    }
  }
  return [...found].sort();
}
function envVarsDeclared(text) {
  const names2 = /* @__PURE__ */ new Set();
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (trimmed === "" || trimmed.startsWith("#")) continue;
    const m = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=/.exec(trimmed);
    if (m?.[1] !== void 0) names2.add(m[1]);
  }
  return [...names2].sort();
}
function documentedScripts(markdown, runner = "npm") {
  const scripts = /* @__PURE__ */ new Set();
  for (const block of markdown.matchAll(/```[a-z]*\n([\s\S]*?)```/g)) {
    const body = block[1] ?? "";
    for (const m of body.matchAll(new RegExp(`\\b${runner}\\s+run\\s+([a-z0-9:_-]+)`, "g"))) {
      const name = m[1];
      if (name !== void 0) scripts.add(name);
    }
  }
  return [...scripts].sort();
}
var IGNORED_ENV = /* @__PURE__ */ new Set([
  // Set by the platform, never written down by a project.
  "NODE_ENV",
  "CI",
  "HOME",
  "PATH",
  "PWD",
  "USER",
  "SHELL",
  "TZ",
  "LANG",
  "TERM",
  "PORT",
  "HOSTNAME",
  "DEBUG",
  "NODE_OPTIONS",
  "GITHUB_TOKEN",
  "GITHUB_OUTPUT",
  "GITHUB_ENV",
  "GITHUB_REPOSITORY",
  "GITHUB_SHA",
  "GITHUB_REF",
  "GITHUB_ACTOR",
  "GITHUB_EVENT_NAME",
  "GITHUB_WORKSPACE",
  "RUNNER_OS",
  "RUNNER_TEMP",
  "GITHUB_EVENT_PATH",
  "GITHUB_HEAD_SHA",
  "GITHUB_BASE_REF",
  "GITHUB_RUN_ID",
  "GITHUB_API_URL",
  "GITHUB_SERVER_URL",
  "GITHUB_JOB",
  "GITHUB_REF_NAME",
  "DISPLAY",
  "WAYLAND_DISPLAY",
  "XDG_RUNTIME_DIR",
  "SSH_AUTH_SOCK"
]);
function isTestPath(path2) {
  return /(^|\/)(tests?|__tests__|spec|fixtures|e2e|testdata)(\/|$)/.test(path2) || /\.(test|spec)\.[a-z]+$/.test(path2) || /(^|\/)conftest\.py$/.test(path2);
}
function checkConsistency(input) {
  const read = input.read ?? ((p) => readFileSync8(join8(input.root, p), "utf8"));
  const exists = (p) => input.read === void 0 ? existsSync7(join8(input.root, p)) : safe(() => input.read?.(p)) !== null;
  const findings = [];
  const exampleFile = [".env.example", ".env.sample", ".env.template"].find(exists);
  const usedIn = /* @__PURE__ */ new Map();
  for (const file of input.files) {
    if (isTestPath(file)) continue;
    const text = safe(() => read(file));
    if (text === null) continue;
    for (const name of envVarsUsed(text)) {
      if (!usedIn.has(name) && !IGNORED_ENV.has(name)) usedIn.set(name, file);
    }
  }
  if (exampleFile === void 0) {
    const MIN_TO_REPORT = 3;
    if (usedIn.size >= MIN_TO_REPORT) {
      const names2 = [...usedIn.keys()].sort();
      findings.push({
        check: "env_no_example",
        // Repo-level, so naming one arbitrary source file would mislead.
        between: ["the source files scanned", ".env.example"],
        detail: `${usedIn.size} environment variable(s) are read and there is no .env.example to name them: ${names2.slice(0, 8).join(", ")}${names2.length > 8 ? `, and ${names2.length - 8} more` : ""}. A fresh checkout has no way to know what it needs.`
      });
    }
  }
  if (exampleFile !== void 0) {
    const declared = new Set(envVarsDeclared(read(exampleFile)));
    for (const [name, where] of usedIn) {
      if (declared.has(name)) continue;
      findings.push({
        check: "env_undocumented",
        between: [where, exampleFile],
        detail: `${where} reads ${name} from the environment, and ${exampleFile} does not mention it, so a fresh checkout starts without it`
      });
    }
    for (const name of declared) {
      if (usedIn.has(name) || IGNORED_ENV.has(name)) continue;
      findings.push({
        check: "env_unused",
        between: [exampleFile, "the source files scanned"],
        detail: `${exampleFile} asks for ${name}, which nothing scanned reads \u2014 either it is dead, or it is read somewhere this scan did not look`
      });
    }
  }
  const readme = ["README.md", "readme.md", "Readme.md"].find(exists);
  const manifest = exists("package.json") ? "package.json" : null;
  if (readme !== void 0 && manifest !== null) {
    const pkg = safeJson(() => read(manifest));
    const scripts = pkg === null ? null : new Set(Object.keys(pkg.scripts ?? {}));
    for (const name of scripts === null ? [] : documentedScripts(read(readme))) {
      if (scripts?.has(name) === true) continue;
      findings.push({
        check: "documented_script_missing",
        between: [readme, manifest],
        detail: `${readme} says to run \`npm run ${name}\`, which ${manifest} does not define`
      });
    }
  }
  if (manifest !== null && exists("package-lock.json")) {
    const pkg = safeJson(() => read(manifest));
    const lock = safeJson(() => read("package-lock.json"));
    if (pkg !== null && lock?.packages !== void 0) {
      const locked = new Set(
        Object.keys(lock.packages).filter((k) => k.startsWith("node_modules/")).map((k) => k.slice("node_modules/".length))
      );
      const declared = { ...pkg.dependencies, ...pkg.devDependencies };
      for (const name of Object.keys(declared)) {
        if (locked.has(name)) continue;
        findings.push({
          check: "dependency_unlocked",
          between: [manifest, "package-lock.json"],
          detail: `${manifest} declares ${name}, which package-lock.json does not carry, so an install resolves it fresh rather than reproducing what was reviewed`
        });
      }
    }
  }
  const runbook = ["context/runbook.md", "context/RUNBOOK.md"].find(exists);
  if (runbook !== void 0 && manifest !== null) {
    const pkg = safeJson(() => read(manifest));
    const text = safe(() => read(runbook));
    if (pkg?.scripts !== void 0 && text !== null) {
      for (const h of scriptHazards(pkg.scripts)) {
        const invoked = new RegExp(`\\b(?:npm|pnpm|yarn|bun)\\s+run\\s+${escapeRe(h.script)}\\b`).test(text);
        if (!invoked) continue;
        const classified = new RegExp(
          `${escapeRe(h.command.split(/\s+/)[0] ?? h.command)}[\\s\\S]{0,400}?(touches|mutates|persistent state|do not run|destructive|migrat)`,
          "i"
        ).test(text);
        if (classified) continue;
        findings.push({
          check: "runbook_command_touches_state",
          between: [runbook, manifest],
          detail: `${runbook} tells the factory to run \`npm run ${h.script}\`, and ${manifest} shows that ${describeHazard(h)}. The factory runs this on every verification, unattended, including on pull requests that generated the change being applied. Either give the factory a command without the side effect, or point it at a throwaway target and say so here.`
        });
      }
    }
  }
  return findings;
}
function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function safe(fn) {
  try {
    const v = fn();
    return v === void 0 ? null : v;
  } catch {
    return null;
  }
}
function safeJson(fn) {
  const text = safe(fn);
  if (text === null) return null;
  return safe(() => JSON.parse(text));
}

// src/commands/contribute.ts
import { randomBytes as randomBytes2 } from "node:crypto";
import { execFile as execFile4 } from "node:child_process";
import { promisify as promisify4 } from "node:util";
import { mkdtempSync, mkdirSync as mkdirSync2, writeFileSync as writeFileSync2, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join as join9, dirname as dirname2 } from "node:path";

// src/commands/mine.ts
import { execFile as execFile3 } from "node:child_process";
import { promisify as promisify3 } from "node:util";
var exec3 = promisify3(execFile3);
var SIGNALS = [
  { name: "explicit_no", re: /\b(no|nope),?\s+(don'?t|do not|that'?s|stop|wrong)\b/i, weight: 0.5 },
  { name: "prohibition", re: /\b(never|don'?t ever|do not ever|stop)\s+\w+/i, weight: 0.4 },
  { name: "undo", re: /\b(revert|undo|roll ?back|put (it|that) back)\b/i, weight: 0.45 },
  { name: "broke", re: /\byou (broke|deleted|removed|changed|overwrote)\b/i, weight: 0.45 },
  { name: "wrong", re: /\b(that'?s|this is|it'?s) (wrong|not right|incorrect|not what)\b/i, weight: 0.4 },
  // Having to say it twice is the strongest signal of all — repetition is
  // exactly what makes a correction worth a rule — so it stands on its own.
  { name: "repeated", re: /\b(i (already )?(told|said|asked)|as i (said|mentioned)|like i said)\b/i, weight: 0.45 },
  // "again" alone is not: "can you run that again" is a request.
  { name: "again", re: /\bagain\b/i, weight: 0.15 },
  { name: "instead", re: /\b(instead of|rather than|should (have|be) \w+)\b/i, weight: 0.25 },
  { name: "always", re: /\balways\s+(use|write|put|keep|run|prefer)\b/i, weight: 0.3 },
  { name: "why", re: /\bwhy (did|are) you\b/i, weight: 0.3 },
  { name: "actually", re: /\bactually\b/i, weight: 0.1 },
  { name: "not_like_that", re: /\bnot like (that|this)\b/i, weight: 0.4 }
];
var CORRECTION_THRESHOLD = 0.4;
function scoreCorrection(text) {
  const signals = [];
  let total = 0;
  for (const s of SIGNALS) {
    if (s.re.test(text)) {
      signals.push(s.name);
      total += s.weight;
    }
  }
  const words = text.trim().split(/\s+/).length;
  if (words < 3) total *= 0.3;
  if (words > 200) total *= 0.5;
  return { confidence: Math.min(1, total), signals };
}
async function listSessions(opts) {
  const run = opts.runMemex ?? defaultRunMemex;
  if (!await memexAvailable(run)) {
    return { available: false, sessions: [], note: "memex is not installed, so there are no sessions to list." };
  }
  const args = [
    "sessions",
    "--cwd",
    opts.repoPath,
    "--format",
    "json",
    ...opts.sources === void 0 ? [] : opts.sources.flatMap((s) => ["--source", s])
  ];
  let out;
  try {
    out = await run(args);
  } catch {
    return {
      available: true,
      sessions: [],
      note: "memex could not list sessions for this directory. Nothing was read."
    };
  }
  const sessions = parseHits(out).map((h) => ({
    session: h.session_id ?? "unknown",
    source: h.source ?? "unknown",
    at: typeof h.ts === "number" ? new Date(h.ts).toISOString() : null,
    opening: redact((h.text ?? h.snippet ?? "").slice(0, 160)).trim(),
    turns: typeof h.turn_id === "number" ? h.turn_id : null
  }));
  return {
    available: true,
    sessions,
    note: sessions.length === 0 ? "memex found no sessions for this directory." : `${sessions.length} session(s) found. Nothing has been read yet: exclude any you would rather keep private, then mining reads only the rest.`
  };
}
var SECRETS = [
  { re: /\bgh[pousr]_[A-Za-z0-9]{16,}\b/g, as: "[github-token]" },
  { re: /\bsk-[A-Za-z0-9_-]{16,}\b/g, as: "[api-key]" },
  { re: /\bsk-ant-[A-Za-z0-9_-]{16,}\b/g, as: "[api-key]" },
  { re: /\bAKIA[0-9A-Z]{16}\b/g, as: "[aws-key-id]" },
  { re: /\bAIza[0-9A-Za-z_-]{30,}\b/g, as: "[google-key]" },
  { re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g, as: "[slack-token]" },
  { re: /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g, as: "[private-key]" },
  { re: /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b/g, as: "[jwt]" },
  { re: /\b[a-z]+:\/\/[^\s:@/]+:[^\s:@/]+@[^\s/]+/gi, as: "[url-with-credentials]" },
  // Anything assigned to a secret-shaped name, whatever the value looks like:
  // the name is the evidence, so the value never needs inspecting.
  {
    re: /\b(password|passwd|secret|token|api[_-]?key)\b(\s*[:=]\s*)\S+/gi,
    as: (m) => `${m.split(/[:=]/)[0].trimEnd()}: [redacted]`
  }
];
function redact(text) {
  let out = text;
  for (const s of SECRETS) {
    out = typeof s.as === "string" ? out.replace(s.re, s.as) : out.replace(s.re, s.as);
  }
  return out;
}
var QUERIES = [
  "no don't do that",
  "that's wrong",
  "revert that change",
  "you broke the build",
  "I already told you",
  "always use",
  "never do this",
  "not like that, instead"
];
async function defaultRunMemex(args) {
  const { stdout } = await exec3("memex", args, { maxBuffer: 64 * 1024 * 1024 });
  return String(stdout);
}
async function memexAvailable(run = defaultRunMemex) {
  try {
    await run(["--version"]);
    return true;
  } catch {
    return false;
  }
}
async function mineCorrections(opts) {
  const run = opts.runMemex ?? defaultRunMemex;
  if (!await memexAvailable(run)) {
    return {
      available: false,
      corrections: [],
      searched: 0,
      note: "memex is not installed, so past sessions were not read. Guardrails start from the rule packs alone; install memex and re-run setup's guardrail phase to add the rest."
    };
  }
  const threshold = opts.threshold ?? CORRECTION_THRESHOLD;
  const excluded = new Set(opts.excludeSessions ?? []);
  const seen = /* @__PURE__ */ new Map();
  let searched = 0;
  for (const query of QUERIES) {
    for (const source of opts.sources ?? [void 0]) {
      const args = [
        "search",
        query,
        "--cwd",
        opts.repoPath,
        // Only the user's own turns: an agent apologizing is not a correction.
        "--role",
        "user",
        "--format",
        "json",
        "--limit",
        String(opts.limitPerQuery ?? 25),
        ...source === void 0 ? [] : ["--source", source]
      ];
      searched++;
      let out;
      try {
        out = await run(args);
      } catch {
        continue;
      }
      for (const hit of parseHits(out)) {
        const session = hit.session_id;
        if (excluded.size > 0) {
          if (session === void 0 || excluded.has(session)) continue;
        }
        const text = hit.text ?? hit.snippet ?? "";
        if (text.trim() === "") continue;
        const { confidence, signals } = scoreCorrection(text);
        if (confidence < threshold) continue;
        const clean = redact(text).trim();
        const key = `${hit.session_id ?? ""}:${hit.turn_id ?? clean.slice(0, 40)}`;
        const existing = seen.get(key);
        if (existing !== void 0 && existing.confidence >= confidence) continue;
        seen.set(key, {
          text: clean,
          source: hit.source ?? "unknown",
          session: hit.session_id ?? "unknown",
          at: typeof hit.ts === "number" ? new Date(hit.ts).toISOString() : null,
          confidence: Math.round(confidence * 100) / 100,
          signals
        });
      }
    }
  }
  const corrections = [...seen.values()].sort((a, b) => b.confidence - a.confidence);
  return {
    available: true,
    corrections,
    searched,
    note: corrections.length === 0 ? "memex found no corrections in this repository's past sessions. Either the sessions are elsewhere, or this repo has not been worked on with an agent that memex reads." : `${corrections.length} correction(s) found across ${searched} searches. Each is the user's own words, redacted of anything secret-shaped, and each is a rule they already wanted.`
  };
}
function parseHits(out) {
  const trimmed = out.trim();
  if (trimmed === "") return [];
  if (trimmed.startsWith("[")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return [];
    }
  }
  const hits = [];
  for (const line of trimmed.split("\n")) {
    const t = line.trim();
    if (t === "" || !t.startsWith("{")) continue;
    try {
      hits.push(JSON.parse(t));
    } catch {
    }
  }
  return hits;
}
var NOISE = /* @__PURE__ */ new Set([
  "that",
  "this",
  "the",
  "and",
  "you",
  "your",
  "for",
  "with",
  "not",
  "dont",
  "don",
  "should",
  "would",
  "could",
  "have",
  "has",
  "was",
  "were",
  "are",
  "but",
  "its",
  "it",
  "all",
  "any",
  "use",
  "using",
  "used",
  "just",
  "like",
  "please",
  "can",
  "will",
  "did",
  "does",
  "about",
  "what",
  "when",
  "why",
  "how",
  "again",
  "actually",
  "instead",
  "always",
  "never",
  "stop"
]);
function clusterCorrections(corrections) {
  const rawTerms = (c) => c.text.toLowerCase().replace(/\(#\d+\)|#\d+/g, " ").replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 3 && !NOISE.has(w));
  const frequency = /* @__PURE__ */ new Map();
  for (const c of corrections) {
    for (const w of new Set(rawTerms(c))) frequency.set(w, (frequency.get(w) ?? 0) + 1);
  }
  const MIN_CORPUS = 15;
  const tooCommon = Math.ceil(corrections.length * 0.4);
  const distinguishing = (w) => corrections.length < MIN_CORPUS || (frequency.get(w) ?? 0) < tooCommon;
  const terms = (c) => new Set(rawTerms(c).filter(distinguishing));
  const clusters = [];
  for (const c of corrections) {
    const t = terms(c);
    if (t.size === 0) continue;
    const match2 = clusters.find((cl) => {
      const shared = [...t].filter((w) => cl.seed.has(w)).length;
      return shared >= 2 || Math.min(t.size, cl.seed.size) <= 2 && shared >= 1;
    });
    if (match2 === void 0) clusters.push({ seed: t, items: [c] });
    else match2.items.push(c);
  }
  return clusters.map((cl) => ({
    // The most confident correction's own words name the cluster: a theme
    // built from keywords reads like a tag cloud and tells nobody anything.
    theme: cl.items[0].text.slice(0, 120),
    corrections: cl.items,
    occurrences: cl.items.length
  })).sort((a, b) => b.occurrences - a.occurrences || b.corrections[0].confidence - a.corrections[0].confidence);
}
var HARNESS_BY_MEMEX_SOURCE = {
  claude: "claude-code",
  cursor: "cursor-cli",
  pi: "pi",
  kilocode: "kilo-code",
  hermes: "hermes-agent"
};
function proposedFix(text) {
  const t = text.toLowerCase();
  if (/\b(type|types|interface|signature|argument|parameter|return|enum|schema)\b/.test(t)) {
    return "api_change";
  }
  if (/\b(import|lint|format|naming|convention|unused|any|console\.log|style|pattern)\b/.test(t)) {
    return "static_rule";
  }
  if (/\b(test|tests|screenshot|click|render|flow|behaviou?r|broke|regression|works)\b/.test(t)) {
    return "verification";
  }
  return "context";
}
function candidatesFrom(clusters, now) {
  return clusters.map((cl, i) => {
    const times = cl.corrections.map((c) => c.at).filter((a) => a !== null).sort();
    const quotes = cl.corrections.slice(0, 5);
    return {
      id: candidateId((Date.parse(now) || Date.now()) + i),
      problem_class: cl.theme,
      occurrences: cl.occurrences,
      ...times[0] === void 0 ? {} : { first_seen: times[0] },
      ...times[times.length - 1] === void 0 ? {} : { last_seen: times[times.length - 1] },
      sources: quotes.map((c) => {
        const harness = HARNESS_BY_MEMEX_SOURCE[c.source];
        return {
          kind: "agent_chat",
          ...harness === void 0 ? {} : { harness },
          session: c.session,
          // Already redacted when the correction was kept, not here.
          quote: c.text.slice(0, 500),
          ...c.at === null ? {} : { at: c.at }
        };
      }),
      proposed_fix: proposedFix(cl.corrections.map((c) => c.text).join(" ")),
      status: "pending"
    };
  });
}

// src/commands/contribute.ts
var execFileAsync = promisify4(execFile4);
function classKey(problemClass) {
  return problemClass.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((w) => w.length > 3 && !NOISE.has(w)).sort().join(" ");
}
var MAX_SOURCES = 8;
function mergeContribution(existing, incoming, contributedBy) {
  const byKey = /* @__PURE__ */ new Map();
  for (const c of existing.candidates) byKey.set(classKey(c.problem_class), c);
  const out = [...existing.candidates];
  const added = [];
  const folded = [];
  const skipped = [];
  for (const c of incoming) {
    const key = classKey(c.problem_class);
    const match2 = byKey.get(key);
    if (match2 === void 0) {
      const fresh = {
        ...c,
        status: "pending",
        ...contributedBy === null ? {} : { contributed_by: contributedBy }
      };
      out.push(fresh);
      added.push(fresh);
      byKey.set(key, fresh);
      continue;
    }
    if (match2.status !== "pending") {
      skipped.push({ problem_class: c.problem_class, status: match2.status });
      continue;
    }
    const at = out.findIndex((x) => x.id === match2.id);
    const sources = [...match2.sources, ...c.sources].slice(0, MAX_SOURCES);
    const firsts = [match2.first_seen, c.first_seen].filter((v) => v !== void 0).sort();
    const lasts = [match2.last_seen, c.last_seen].filter((v) => v !== void 0).sort();
    const updated = {
      ...match2,
      occurrences: match2.occurrences + c.occurrences,
      sources,
      ...firsts[0] === void 0 ? {} : { first_seen: firsts[0] },
      ...lasts.length === 0 ? {} : { last_seen: lasts[lasts.length - 1] }
    };
    out[at] = updated;
    byKey.set(key, updated);
    folded.push({ into: match2.id, occurrences: c.occurrences });
  }
  return {
    merged: { schema: "candidates/1", candidates: out },
    added,
    folded,
    skipped
  };
}
function contributionBranch(login, now = /* @__PURE__ */ new Date()) {
  const who = (login ?? "anon").toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 24);
  const day = now.toISOString().slice(0, 10);
  return `factory/corrections-${who}-${day}-${randomBytes2(3).toString("hex")}`;
}
function contributionBody(result, login, repoPath) {
  const lines = [];
  lines.push(
    `Corrections mined from agent sessions on ${login === null ? "a teammate's" : `@${login}'s`} machine, for \`${repoPath}\`.`,
    "",
    "Each one is a moment someone told an agent it had got something wrong. Accepting a candidate does not install anything by itself \u2014 hardening turns an accepted candidate into an API change, a static rule, a verification scenario or a line of context.",
    ""
  );
  if (result.added.length > 0) {
    lines.push(`### ${result.added.length} new candidate(s)`, "");
    lines.push("| Occurrences | Proposed fix | Problem class |", "| --- | --- | --- |");
    for (const c of result.added) {
      lines.push(`| ${c.occurrences} | \`${c.proposed_fix}\` | ${cell(c.problem_class)} |`);
    }
    lines.push("");
  }
  if (result.folded.length > 0) {
    lines.push(
      `### ${result.folded.length} already on the list`,
      "",
      "Seen on this machine too, so the occurrence counts went up rather than the same problem being listed twice:",
      ""
    );
    for (const f of result.folded) lines.push(`- \`${f.into}\` +${f.occurrences}`);
    lines.push("");
  }
  if (result.skipped.length > 0) {
    lines.push(
      `### ${result.skipped.length} skipped`,
      "",
      "Already decided, so not re-raised:",
      ""
    );
    for (const s of result.skipped) lines.push(`- ${cell(s.problem_class)} \u2014 already **${s.status}**`);
    lines.push("");
  }
  lines.push(
    "---",
    "",
    "The quotes come from private agent sessions on one person's machine. They chose what to include before this was submitted, and they are the person to ask about any of it."
  );
  return lines.join("\n");
}
function cell(text) {
  return text.replace(/\s+/g, " ").replace(/\|/g, "\\|").slice(0, 160);
}
async function submitContribution(opts) {
  const { gh, contribution, candidatesPath } = opts;
  const git2 = opts.git ?? runGit;
  const base = await gh.defaultBranch();
  const login = await gh.viewer();
  await git2(["fetch", "--quiet", "origin", base], opts.repoPath);
  const text = await readAtRef(git2, opts.repoPath, `origin/${base}`, candidatesPath);
  const existing = text === null ? { schema: "candidates/1", candidates: [] } : JSON.parse(text);
  const merge = mergeContribution(existing, contribution.candidates, login);
  if (merge.added.length === 0 && merge.folded.length === 0) {
    return {
      nothing: merge.skipped.length > 0 ? `every candidate here was already decided (${merge.skipped.length}); nothing to submit` : "nothing to submit"
    };
  }
  const branch = contributionBranch(login, opts.now);
  const work = mkdtempSync(join9(tmpdir(), "bsf-contribution-"));
  try {
    await git2(["worktree", "add", "--quiet", "-b", branch, work, `origin/${base}`], opts.repoPath);
    const file = join9(work, candidatesPath);
    mkdirSync2(dirname2(file), { recursive: true });
    writeFileSync2(file, `${JSON.stringify(merge.merged, null, 2)}
`);
    await git2(["add", "--", candidatesPath], work);
    await git2(
      [
        "commit",
        "--quiet",
        "-m",
        `Add ${merge.added.length} guardrail candidate(s) from ${login ?? "a teammate"}'s sessions`
      ],
      work
    );
    await git2(["push", "--quiet", "origin", `${branch}:${branch}`], work);
  } finally {
    await git2(["worktree", "remove", "--force", work], opts.repoPath).catch(() => "");
    rmSync(work, { recursive: true, force: true });
  }
  let pull;
  try {
    pull = await gh.openPull({
      title: `Guardrail candidates from ${login === null ? "a teammate" : `@${login}`}'s sessions`,
      head: branch,
      base,
      body: contributionBody(merge, login, contribution.repo)
    });
  } catch (err) {
    throw new Error(
      `the branch ${branch} was pushed, but opening the pull request failed: ${String(err)}
Open it by hand from ${branch} into ${base}, or delete that branch and run --submit again.`
    );
  }
  return { pull: pull.number, url: pull.html_url, branch, merge };
}
async function runGit(args, cwd) {
  const { stdout } = await execFileAsync("git", [...args], { cwd, encoding: "utf8" });
  return String(stdout);
}
async function readAtRef(git2, repoPath, ref, path2) {
  try {
    const out = await git2(["show", `${ref}:${path2}`], repoPath);
    return out.trim() === "" ? null : out;
  } catch {
    return null;
  }
}

// src/commands/schema-freeze.ts
init_schema();
import { readFileSync as readFileSync9, readdirSync as readdirSync4, writeFileSync as writeFileSync3 } from "node:fs";
import { join as join10 } from "node:path";
var BOUNDS = ["minimum", "maximum", "minLength", "maxLength", "minItems", "maxItems"];
var TIGHTENS_UPWARD = /* @__PURE__ */ new Set(["minimum", "minLength", "minItems"]);
function surfaceOf(node) {
  if (typeof node !== "object" || node === null || Array.isArray(node)) return null;
  const n = node;
  const out = {};
  if (typeof n["type"] === "string") out["type"] = n["type"];
  else if (Array.isArray(n["type"])) out["type"] = [...n["type"]].sort().join("|");
  if (typeof n["properties"] === "object" && n["properties"] !== null) {
    out["properties"] = Object.keys(n["properties"]).sort();
  }
  if (Array.isArray(n["required"])) out["required"] = [...n["required"]].sort();
  if (typeof n["additionalProperties"] === "boolean") out["additionalProperties"] = n["additionalProperties"];
  if (Array.isArray(n["enum"])) {
    out["enum"] = n["enum"].map((v) => JSON.stringify(v) ?? "undefined").sort();
  }
  if (n["const"] !== void 0) out["const"] = JSON.stringify(n["const"]);
  if (typeof n["pattern"] === "string") out["pattern"] = n["pattern"];
  if (typeof n["$ref"] === "string") out["ref"] = n["$ref"];
  for (const b of BOUNDS) if (typeof n[b] === "number") out[b] = n[b];
  return Object.keys(out).length === 0 ? null : out;
}
function surfaceForDocument(doc) {
  const nodes = {};
  const walk2 = (node, pointer) => {
    if (typeof node !== "object" || node === null) return;
    if (Array.isArray(node)) {
      node.forEach((child, i) => walk2(child, `${pointer}/${i}`));
      return;
    }
    const s = surfaceOf(node);
    if (s !== null) nodes[pointer === "" ? "/" : pointer] = s;
    for (const [key, child] of Object.entries(node)) {
      if (key === "enum" || key === "const" || key === "examples") continue;
      walk2(child, `${pointer}/${escapePointer(key)}`);
    }
  };
  walk2(doc, "");
  return nodes;
}
function escapePointer(key) {
  return key.replace(/~/g, "~0").replace(/\//g, "~1");
}
function surfaceForDirectory(dir) {
  const out = {};
  for (const file of readdirSync4(dir).filter(isSchemaFile).sort()) {
    out[file] = surfaceForDocument(JSON.parse(readFileSync9(join10(dir, file), "utf8")));
  }
  return out;
}
function compareSurface(frozen, live) {
  const drift = [];
  const add = (file, pointer, kind, what) => void drift.push({ file, pointer: pointer === "/" ? "/" : pointer, kind, what });
  for (const [file, frozenNodes] of Object.entries(frozen)) {
    const liveNodes = live[file];
    if (liveNodes === void 0) {
      add(file, "/", "breaking", "the schema file is gone");
      continue;
    }
    for (const [pointer, was] of Object.entries(frozenNodes)) {
      const now = liveNodes[pointer];
      if (now === void 0) {
        add(file, pointer, "breaking", "the node is gone");
        continue;
      }
      compareNode(file, pointer, was, now, add);
    }
    for (const pointer of Object.keys(liveNodes)) {
      if (frozenNodes[pointer] === void 0) add(file, pointer, "additive", "new node");
    }
  }
  for (const file of Object.keys(live)) {
    if (frozen[file] === void 0) add(file, "/", "additive", "new schema file");
  }
  const explained = drift.filter((d) => d.what === "property removed" || d.what === "new property").map((d) => `${d.file}${d.pointer}`);
  return drift.filter((d) => {
    if (d.what !== "the node is gone" && d.what !== "new node") return true;
    const key = `${d.file}${d.pointer}`;
    return !explained.some((e) => key === e || key.startsWith(`${e}/`));
  });
}
function compareNode(file, pointer, was, now, add) {
  if (was.type !== now.type) {
    add(file, pointer, "breaking", `type was ${was.type ?? "unset"}, is ${now.type ?? "unset"}`);
  }
  if (was.ref !== now.ref) {
    add(file, pointer, "breaking", `$ref was ${was.ref ?? "unset"}, is ${now.ref ?? "unset"}`);
  }
  if (was.pattern !== now.pattern) {
    add(file, pointer, "breaking", "pattern changed");
  }
  if (was.const !== now.const) {
    add(file, pointer, "breaking", `const was ${was.const ?? "unset"}, is ${now.const ?? "unset"}`);
  }
  const at = pointer === "/" ? "" : pointer;
  for (const gone of (was.properties ?? []).filter((p) => !(now.properties ?? []).includes(p))) {
    add(file, `${at}/properties/${gone}`, "breaking", "property removed");
  }
  for (const fresh of (now.properties ?? []).filter((p) => !(was.properties ?? []).includes(p))) {
    add(file, `${at}/properties/${fresh}`, "additive", "new property");
  }
  for (const req of (now.required ?? []).filter((r) => !(was.required ?? []).includes(r))) {
    add(file, pointer, "breaking", `\`${req}\` became required`);
  }
  for (const opt of (was.required ?? []).filter((r) => !(now.required ?? []).includes(r))) {
    add(file, pointer, "additive", `\`${opt}\` is no longer required`);
  }
  if (was.additionalProperties !== now.additionalProperties) {
    const closed = now.additionalProperties === false;
    add(
      file,
      pointer,
      closed ? "breaking" : "additive",
      `additionalProperties was ${String(was.additionalProperties)}, is ${String(now.additionalProperties)}`
    );
  }
  if (was.enum !== void 0 || now.enum !== void 0) {
    const before = was.enum ?? [];
    const after = now.enum ?? [];
    if (was.enum !== void 0 && now.enum === void 0) {
      add(file, pointer, "additive", "enum removed, so more values are legal");
    } else if (was.enum === void 0) {
      add(file, pointer, "breaking", "enum added where any value used to be legal");
    } else {
      for (const gone of before.filter((v) => !after.includes(v))) {
        add(file, pointer, "breaking", `enum member \`${gone}\` removed`);
      }
      for (const fresh of after.filter((v) => !before.includes(v))) {
        add(file, pointer, "widening", `enum member \`${fresh}\` added`);
      }
    }
  }
  for (const b of BOUNDS) {
    const before = was[b];
    const after = now[b];
    if (before === after) continue;
    if (before === void 0) {
      add(file, pointer, "breaking", `${b} added (${String(after)})`);
    } else if (after === void 0) {
      add(file, pointer, "additive", `${b} removed`);
    } else {
      const tighter = TIGHTENS_UPWARD.has(b) ? after > before : after < before;
      add(
        file,
        pointer,
        tighter ? "breaking" : "additive",
        `${b} was ${before}, is ${after}`
      );
    }
  }
}
function readFrozen(path2) {
  return JSON.parse(readFileSync9(path2, "utf8"));
}
function writeFrozen(path2, surface, frozenAt, major = 1) {
  const doc = {
    frozen_at: frozenAt,
    schema_major: major,
    note: "The shape of every schema at the frozen major. `bsf schema-surface --check` compares the live schemas against this and fails on a breaking change. Regenerate with `bsf schema-surface --freeze` only alongside an additive change, or alongside a major bump that ships a migration in `bsf migrate`.",
    surface
  };
  writeFileSync3(path2, `${JSON.stringify(doc, null, 2)}
`);
}

// src/commands/migrate.ts
init_schema();
import { readFileSync as readFileSync10, writeFileSync as writeFileSync4, existsSync as existsSync8, mkdirSync as mkdirSync3 } from "node:fs";
import { dirname as dirname3 } from "node:path";
var MIGRATIONS = [];
function majorOf(doc) {
  const tag = doc?.schema;
  if (typeof tag !== "string") return null;
  const m = /^([a-z-]+)\/(\d+)$/.exec(tag);
  if (m === null) return null;
  return { schema: m[1], major: Number(m[2]) };
}
function migratedPath(path2, to) {
  return path2.replace(/\.json$/, `.v${to}.json`);
}
function planMigration(files, registry = MIGRATIONS) {
  const items = [];
  const unknown = [];
  const current = [];
  for (const file of files) {
    let doc;
    try {
      doc = JSON.parse(file.text);
    } catch {
      unknown.push({ path: file.path, tag: "", why: "not readable as JSON" });
      continue;
    }
    const tagged = majorOf(doc);
    if (tagged === null) {
      unknown.push({ path: file.path, tag: "", why: "no `schema` tag, so its shape is not known" });
      continue;
    }
    const chain = chainFor(tagged.schema, tagged.major, registry);
    if (chain.length === 0) {
      const known = SCHEMA_NAMES.includes(tagged.schema);
      if (!known) {
        unknown.push({
          path: file.path,
          tag: `${tagged.schema}/${tagged.major}`,
          why: "this runner has no schema by that name"
        });
      } else if (newestMajor(tagged.schema, registry) === tagged.major) {
        current.push(file.path);
      } else {
        unknown.push({
          path: file.path,
          tag: `${tagged.schema}/${tagged.major}`,
          // A gap in the chain is worth naming: it means a migration was
          // skipped in a release, and guessing across it would corrupt data.
          why: `no migration from ${tagged.schema}/${tagged.major} to the version this runner writes`
        });
      }
      continue;
    }
    const last = chain[chain.length - 1];
    items.push({
      path: file.path,
      schema: tagged.schema,
      from: tagged.major,
      to: last.to,
      writesTo: migratedPath(file.path, last.to),
      summary: chain.map((m) => m.summary).join("; ")
    });
  }
  return { items, unknown, current };
}
function chainFor(schema, major, registry = MIGRATIONS) {
  const chain = [];
  let at = major;
  for (; ; ) {
    const next = registry.find((m) => m.schema === schema && m.from === at);
    if (next === void 0) return chain;
    chain.push(next);
    at = next.to;
    if (chain.length > 32) throw new Error(`migration chain for ${schema} does not terminate`);
  }
}
function newestMajor(schema, registry = MIGRATIONS) {
  return registry.filter((m) => m.schema === schema).reduce((a, m) => Math.max(a, m.to), 1);
}
function defaultCheck(schema, doc) {
  const name = schema;
  const tag = checkSchemaTag(name, doc);
  if (!tag.ok) return tag.errors.map((e) => e.message);
  const res = validate(name, doc);
  if (!res.ok) return res.errors.slice(0, 3).map((e) => `${e.path}: ${e.message}`);
  return [];
}
function applyMigration(plan, io) {
  const migrated = [];
  const failed = [];
  const registry = io.registry ?? MIGRATIONS;
  const check = io.check ?? defaultCheck;
  for (const item of plan.items) {
    try {
      let doc = JSON.parse(io.read(item.path));
      for (const m of chainFor(item.schema, item.from, registry)) doc = m.up(doc);
      const problems = check(item.schema, doc);
      if (problems.length > 0) {
        failed.push({ path: item.path, why: `the migrated file does not validate: ${problems.join("; ")}` });
        continue;
      }
      io.write(item.writesTo, `${JSON.stringify(doc, null, 2)}
`);
      migrated.push({ from: item.path, to: item.writesTo });
    } catch (err) {
      failed.push({ path: item.path, why: String(err).slice(0, 200) });
    }
  }
  return { migrated, failed };
}
var diskIo = {
  read: (path2) => readFileSync10(path2, "utf8"),
  write: (path2, text) => {
    if (existsSync8(path2)) {
      throw new Error(`${path2} already exists; a migration never overwrites`);
    }
    mkdirSync3(dirname3(path2), { recursive: true });
    writeFileSync4(path2, text);
  }
};
function schemaSupport(registry = MIGRATIONS) {
  return SCHEMA_NAMES.map((schema) => {
    const writes = newestMajor(schema, registry);
    const reads = [writes];
    for (let major = writes - 1; major >= 1; major--) {
      if (chainFor(schema, major, registry).length > 0) reads.unshift(major);
    }
    return { schema, writes, reads };
  });
}

// src/commands/review.ts
init_store();
function reviewDue(input) {
  const everyDays = input.everyDays ?? 3;
  const earlyAt = input.earlyAtRuns ?? 50;
  const minRuns = input.minRuns ?? 10;
  if (input.runsSinceLastReview < minRuns) {
    return {
      due: false,
      reason: `only ${input.runsSinceLastReview} run(s) since the last review; ${minRuns} are needed for the scores to mean anything`
    };
  }
  if (input.runsSinceLastReview >= earlyAt) {
    return { due: true, reason: `${input.runsSinceLastReview} runs have piled up, which is early-trigger territory` };
  }
  if (input.lastReviewAt === null) {
    return { due: true, reason: `first review, with ${input.runsSinceLastReview} runs to grade` };
  }
  const elapsedDays = (Date.parse(input.now) - Date.parse(input.lastReviewAt)) / 864e5;
  if (Number.isNaN(elapsedDays)) {
    return { due: true, reason: "the last review's date is unreadable, so treat a review as due" };
  }
  if (elapsedDays >= everyDays) {
    return { due: true, reason: `${elapsedDays.toFixed(1)} days since the last review` };
  }
  return {
    due: false,
    reason: `${elapsedDays.toFixed(1)} of ${everyDays} days since the last review, and ${input.runsSinceLastReview} runs is under the early trigger`
  };
}
var DEFINITION_TAGS = /* @__PURE__ */ new Set([
  "context_gap",
  "wrong_model_fit",
  "missing_evidence",
  "vague_spec",
  "unverifiable_checks"
]);
function groupAndRoute(failures) {
  const groups = /* @__PURE__ */ new Map();
  for (const f of failures) {
    const key = `${f.tag}::${f.area !== "" ? f.area : `role:${f.role}`}`;
    const list = groups.get(key);
    if (list === void 0) groups.set(key, [f]);
    else list.push(f);
  }
  return [...groups.entries()].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0])).map(([key, list]) => {
    const first = list[0];
    const toDefinition = DEFINITION_TAGS.has(first.tag);
    return {
      id: `p-${fingerprint({ title: key, body: first.tag }).slice(0, 12)}`,
      tag: first.tag,
      area: first.area,
      role: first.role,
      occurrences: list.length,
      runs: [...new Set(list.map((f) => f.run))],
      destination: toDefinition ? "definition" : "hardening",
      why: toDefinition ? `${first.tag} is something the agent did not know, which a context or model change addresses` : `${first.tag} is something a check can catch, which is cheaper and permanent`
    };
  });
}
var mean = (xs) => xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length;
var spread = (xs) => xs.length < 2 ? 0 : Math.max(...xs) - Math.min(...xs);
function admitDefinitionChange(c) {
  const reasons = [];
  if (c.taskCount < 10) reasons.push(`benchmarked on ${c.taskCount} task(s); at least 10 are needed`);
  if (c.repeats < 3) reasons.push(`${c.repeats} repeat(s) per side; at least 3 are needed to see the spread`);
  const failBefore = mean(c.failureTaskScores.before);
  const failAfter = mean(c.failureTaskScores.after);
  const gain = failAfter - failBefore;
  if (gain <= 0) reasons.push(`the failure tasks did not improve (${failBefore.toFixed(2)} \u2192 ${failAfter.toFixed(2)})`);
  const noise = Math.max(spread(c.failureTaskScores.before), spread(c.failureTaskScores.after));
  if (gain <= noise) {
    reasons.push(
      `the gain of ${gain.toFixed(2)} is inside the run-to-run spread of ${noise.toFixed(2)}, so it could be chance`
    );
  }
  const otherBefore = mean(c.otherTaskScores.before);
  const otherAfter = mean(c.otherTaskScores.after);
  if (otherAfter < otherBefore) {
    reasons.push(`other tasks regressed (${otherBefore.toFixed(2)} \u2192 ${otherAfter.toFixed(2)})`);
  }
  if (c.costBefore > 0 && c.costAfter > c.costBefore * 1.2) {
    const pct = ((c.costAfter / c.costBefore - 1) * 100).toFixed(0);
    reasons.push(`cost rises ${pct}%, over the 20% ceiling`);
  }
  return { admit: reasons.length === 0, reasons };
}
async function runReviewDue(opts) {
  const store = new FactoryStore(opts.gh);
  const paths = await store.data.list("reviews/");
  const last = paths.filter((p) => p.endsWith(".json")).sort().pop();
  const lastReviewAt = last === void 0 ? null : await lastReviewTimestamp(store, last);
  const { runs } = await readAll(store);
  const since = lastReviewAt === null ? runs.length : runs.filter((r) => Date.parse(r.ended_at) > Date.parse(lastReviewAt)).length;
  const result = reviewDue({
    now: opts.now,
    lastReviewAt,
    runsSinceLastReview: since,
    ...opts.everyDays === void 0 ? {} : { everyDays: opts.everyDays },
    ...opts.earlyAtRuns === void 0 ? {} : { earlyAtRuns: opts.earlyAtRuns },
    ...opts.minRuns === void 0 ? {} : { minRuns: opts.minRuns }
  });
  return { ...result, runsSinceLastReview: since, lastReviewAt };
}
async function lastReviewTimestamp(store, path2) {
  const doc = await store.data.readJson(path2);
  return doc?.at ?? doc?.created_at ?? null;
}
async function runReviewRoute(opts) {
  const store = new FactoryStore(opts.gh);
  const ledger = await store.ledger(opts.now);
  const problems = groupAndRoute(opts.failures);
  const changes = [];
  const filed = [];
  const open = [...ledger.open];
  for (const p of problems) {
    const pipeline = p.destination === "hardening" ? "hardening" : "definition";
    const id = workItemId(Date.parse(opts.now) || Date.now());
    const item = {
      schema: "work-item/1",
      id,
      created_at: opts.now,
      source: { kind: sourceKind("review_routed"), ref: null, actor: "factory", via: null },
      trigger_class: "self",
      pipeline,
      title: `${p.tag} in ${p.area !== "" ? p.area : p.role} (${p.occurrences}\xD7)`,
      body: `${p.why}

Runs:
${p.runs.map((r) => `- ${r}`).join("\n")}`,
      priority: p.occurrences >= 3 ? "high" : "normal",
      fingerprint: fingerprint({ title: p.tag, body: p.area }),
      status: "queued",
      runs: [...p.runs],
      pr: null,
      parent: null,
      related: [],
      spec: null
    };
    changes.push({ path: workItemPath(id), content: json(item) });
    open.push({
      work_item: id,
      pipeline,
      status: "queued",
      fingerprint: item.fingerprint,
      priority: item.priority,
      created_at: opts.now,
      fixes: [p.tag]
    });
    filed.push({ work_item: id, destination: p.destination });
  }
  if (changes.length > 0) {
    changes.push({ path: LEDGER, content: json({ ...ledger, updated_at: opts.now, open }) });
    changes.push({
      path: reviewPath(opts.now.slice(0, 10)),
      content: json({
        schema: "review/1",
        id: reviewId(opts.now),
        window: {
          from: opts.windowFrom ?? opts.now,
          to: opts.now,
          runs: [...new Set(opts.failures.map((f) => f.run))]
        },
        // Only scored criteria go in `scores`; escalations, reverts and
        // corrections are failures without a score, and they show up in the
        // problems they caused rather than as invented 1s.
        scores: opts.failures.filter((f) => f.score !== void 0).map((f) => ({
          run: f.run,
          criterion: f.role === "" ? f.tag : `${f.role}:${f.tag}`,
          score: f.score,
          tags: [f.tag],
          ...f.detail === void 0 ? {} : { note: f.detail }
        })),
        problems: problems.map((pr, i) => ({
          title: `${pr.tag} in ${pr.area !== "" ? pr.area : pr.role} (${pr.occurrences}\xD7)`,
          runs: [...pr.runs],
          route: pr.destination,
          work_item: filed[i]?.work_item ?? null,
          change: pr.why
        }))
      })
    });
    await store.put(changes, `review: ${problems.length} problem(s) routed`);
  }
  const dispatched = [];
  if (opts.plan !== true) {
    for (const f of filed) {
      if (f.destination === "definition") continue;
      await opts.gh.dispatchWorkflow("factory-run.yml", opts.ref, { work_item: f.work_item });
      dispatched.push(f.work_item);
    }
  }
  return { problems, filed, dispatched };
}

// src/commands/run-plan.ts
var SEQUENCE = {
  product_work: ["triage", "spec", "builder", "verifier"],
  gardening: ["gardener", "builder", "verifier"],
  hardening: ["hardener", "spec", "builder", "verifier"],
  // A conflict is a rebase and a re-clear: no new intent to triage or spec.
  conflict: ["builder", "verifier"],
  // A definition change is drafted by the review and benchmarked; the builder
  // writes the change itself, and a trusted human approves the PR.
  definition: ["builder"]
};
function planRun(input) {
  const maxAttempts = input.maxAttempts ?? 3;
  const full = SEQUENCE[input.pipeline];
  if (input.attempt > maxAttempts) {
    return {
      roles: [],
      skipped: full,
      attempt: input.attempt,
      maxAttempts,
      escalate: true,
      reason: `attempt ${input.attempt} is past the cap of ${maxAttempts}: escalate to a human rather than spend another run`
    };
  }
  if (input.attempt > 1 || input.revision === true) {
    const roles = full.filter((r) => r === "builder" || r === "verifier");
    return {
      roles,
      skipped: full.filter((r) => !roles.includes(r)),
      attempt: input.attempt,
      maxAttempts,
      escalate: false,
      reason: input.revision === true ? "a revision changes the code, not the intent: the builder applies it and the verifier re-checks" : `attempt ${input.attempt} after a ${input.lastFailure?.gate ?? "gate"} failure: the builder fixes and the verifier re-checks`
    };
  }
  return {
    roles: full,
    skipped: [],
    attempt: input.attempt,
    maxAttempts,
    escalate: false,
    reason: `first attempt at a ${input.pipeline} run`
  };
}
function afterGates(input) {
  const max = input.maxAttempts ?? 3;
  if (input.staticGate === "failed" || input.verificationGate === "failed") {
    const which = input.staticGate === "failed" ? "static" : "verification";
    if (input.attempt >= max) {
      return {
        next: "escalate",
        reason: `the ${which} gate failed on attempt ${input.attempt} of ${max}: a human takes it from here`
      };
    }
    return {
      next: "retry",
      attempt: input.attempt + 1,
      reason: `the ${which} gate failed${input.failureSummary === void 0 ? "" : `: ${input.failureSummary}`}`
    };
  }
  if (input.staticGate === "passed" && input.verificationGate === "not_run") {
    return { next: "verify", reason: "static gate passed; verification has not run yet" };
  }
  const staticOk = input.staticGate === "passed" || input.staticGate === "skipped";
  const verifyOk = input.verificationGate === "passed" || input.verificationGate === "skipped";
  if (staticOk && verifyOk) {
    return { next: "clear", reason: "both gates are satisfied on this commit" };
  }
  return {
    next: "verify",
    reason: `static ${input.staticGate}, verification ${input.verificationGate}: run what is outstanding`
  };
}

// src/commands/step-report.ts
import { execFileSync as execFileSync2 } from "node:child_process";
import { readFileSync as readFileSync12, existsSync as existsSync10, writeFileSync as writeFileSync5, mkdirSync as mkdirSync4 } from "node:fs";

// src/lib/session.ts
import { readFileSync as readFileSync11, existsSync as existsSync9 } from "node:fs";
import { join as join11 } from "node:path";
function pick(block, ...keys) {
  if (block === void 0) return 0;
  for (const k of keys) {
    const v = block[k];
    if (typeof v === "number" && Number.isFinite(v)) return v;
  }
  return 0;
}
function parseJsonl(text) {
  const out = [];
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (t === "") continue;
    try {
      out.push(JSON.parse(t));
    } catch {
    }
  }
  return out;
}
function usageFromSession(events, from) {
  let tokensIn = 0;
  let tokensOut = 0;
  let cacheRead = 0;
  let cacheWrite = 0;
  let cost = 0;
  let sawCost = false;
  let sawAny = false;
  for (const e of events) {
    const usage = e.usage ?? e.data?.usage;
    const eventCost = e.totalCostUsd ?? e.total_cost_usd ?? e.data?.totalCostUsd ?? e.data?.total_cost_usd;
    if (usage !== void 0) {
      tokensIn += pick(usage, "input_tokens", "inputTokens");
      tokensOut += pick(usage, "output_tokens", "outputTokens");
      cacheRead += pick(usage, "cache_read_input_tokens", "cacheReadInputTokens");
      cacheWrite += pick(usage, "cache_creation_input_tokens", "cacheCreationInputTokens");
      sawAny = true;
    }
    if (typeof eventCost === "number" && Number.isFinite(eventCost)) {
      cost += eventCost;
      sawCost = true;
      sawAny = true;
    }
  }
  if (!sawAny) return null;
  return {
    tokensIn,
    tokensOut,
    cacheRead,
    cacheWrite,
    costUsd: sawCost ? cost : null,
    from
  };
}
var SESSION_FILES = [
  { path: "agent-session.jsonl", from: "agent_session" },
  // The proxy's own metering. Second because it counts what crossed the
  // firewall, which can include gh-aw's own calls as well as the agent's.
  { path: "token-usage.jsonl", from: "token_usage" }
];
function readSessionUsage(dirs) {
  for (const { path: path2, from } of SESSION_FILES) {
    for (const dir of dirs) {
      const full = join11(dir, path2);
      if (!existsSync9(full)) continue;
      const usage = usageFromSession(parseJsonl(readFileSync11(full, "utf8")), from);
      if (usage !== null) return usage;
    }
  }
  return null;
}

// src/commands/step-report.ts
import { join as join12, dirname as dirname4 } from "node:path";
function readUsage(path2) {
  if (!existsSync10(path2)) return null;
  let doc;
  try {
    doc = JSON.parse(readFileSync12(path2, "utf8"));
  } catch {
    return null;
  }
  const tokensIn = doc.input_tokens ?? doc.usage?.input_tokens ?? 0;
  const tokensOut = doc.output_tokens ?? doc.usage?.output_tokens ?? 0;
  const costUsd = doc.total_cost_usd ?? doc.cost?.total_usd ?? null;
  if (tokensIn === 0 && tokensOut === 0 && costUsd === null) return null;
  return { tokensIn, tokensOut, costUsd };
}
function buildStepReport(input) {
  const session = input.sessionDirs === void 0 ? null : readSessionUsage(input.sessionDirs);
  const harnessLog = input.usagePath === void 0 ? null : readUsage(input.usagePath);
  const usage = session !== null ? { tokensIn: session.tokensIn, tokensOut: session.tokensOut, costUsd: session.costUsd, from: session.from } : harnessLog !== null ? { tokensIn: harnessLog.tokensIn, tokensOut: harnessLog.tokensOut, costUsd: harnessLog.costUsd, from: "harness_log" } : null;
  let cost = 0;
  let source = "unknown";
  if (usage?.costUsd != null) {
    cost = round4(usage.costUsd);
    source = "session_log";
  } else if (usage !== null && input.priceTable?.[input.model] !== void 0) {
    const price = input.priceTable[input.model];
    cost = round4(usage.tokensIn / 1e6 * price.in + usage.tokensOut / 1e6 * price.out);
    source = "price_table";
  }
  return {
    schema: "step-report/1",
    harness: input.harness,
    role: input.role,
    model: input.model,
    exit: input.exit,
    duration_sec: Math.max(0, Math.round(input.durationSec)),
    tokens: { in: usage?.tokensIn ?? 0, out: usage?.tokensOut ?? 0 },
    cost_usd: cost,
    cost_source: source,
    ...usage?.from === void 0 ? {} : { usage_source: usage.from },
    files_changed: [...input.filesChanged],
    transcript: input.transcript
  };
}
function writeStepReport(path2, report) {
  mkdirSync4(dirname4(path2), { recursive: true });
  writeFileSync5(path2, `${JSON.stringify(report, null, 2)}
`);
}
function round4(n) {
  return Math.round(n * 1e4) / 1e4;
}
function changedFilesFromGit(root) {
  try {
    const out = execFileSync2("git", ["status", "--porcelain=v1"], { cwd: root, encoding: "utf8" });
    return out.split("\n").map((l) => l.slice(3).trim()).filter((l) => l !== "").map((l) => l.includes(" -> ") ? l.split(" -> ")[1] : l);
  } catch {
    return [];
  }
}

// src/cli.ts
init_config();

// src/commands/role-io.ts
init_store();
init_dataref();
import { readFileSync as readFileSync13, writeFileSync as writeFileSync6, mkdirSync as mkdirSync5, existsSync as existsSync11, readdirSync as readdirSync5, statSync } from "node:fs";
import { dirname as dirname5, join as join13, relative as relative2 } from "node:path";
init_schema();
async function fetchWorkItem(opts) {
  const store = new FactoryStore(opts.gh);
  const item = await store.get(workItemPath(opts.id), "work-item");
  if (item === null) throw new Error(`${opts.id} is not on the data ref`);
  if (opts.specOnly === true) {
    const payload2 = {
      id: item.id,
      pipeline: item.pipeline,
      title: item.title,
      spec: item.spec
    };
    write(opts.out, json(payload2));
    return { id: item.id, wrote: opts.out, strippedBody: true, includedTriage: false, specOnly: true };
  }
  const trusted = item.status !== "waiting_trust";
  const { body, stripped } = stripUntrustedText(
    typeof item.body === "string" ? item.body : void 0,
    trusted
  );
  const triage = opts.withTriage === true ? await readTriageNotes(store, item) : null;
  const payload = {
    id: item.id,
    pipeline: item.pipeline,
    trigger_class: item.trigger_class,
    title: item.title,
    // Marked, not merely included: a prompt that cannot tell the request from
    // the instructions is one an issue can rewrite.
    request: body === null ? null : { source: "user-supplied, untrusted", text: body },
    body_withheld: stripped ? "this item's author is not a trusted member, so their text is withheld" : null,
    related: item.related ?? [],
    spec: item.spec,
    ...triage === null ? {} : { triage }
  };
  write(opts.out, json(payload));
  return {
    id: item.id,
    wrote: opts.out,
    strippedBody: stripped,
    includedTriage: triage !== null,
    specOnly: false
  };
}
async function readTriageNotes(store, item) {
  const runs = item.runs ?? [];
  const latest = runs[runs.length - 1];
  if (latest === void 0) return null;
  const report = await store.data.readJson(`runs/${latest}/steps/triage.json`);
  if (report === null) return null;
  return { role: report.role ?? "triage", files_changed: report.files_changed ?? [] };
}
async function writeSpec(gh, id, from, _now) {
  const store = new FactoryStore(gh);
  const item = await store.get(workItemPath(id), "work-item");
  if (item === null) throw new Error(`${id} is not on the data ref`);
  const spec = JSON.parse(readFileSync13(from, "utf8"));
  if (typeof spec.plan !== "string" || spec.plan.trim() === "") {
    throw new Error(`${from} has no plan`);
  }
  if (!Array.isArray(spec.acceptance_checks) || spec.acceptance_checks.length === 0) {
    throw new Error(`${from} lists no acceptance checks`);
  }
  const next = { ...item, spec };
  assertValid("work-item", next);
  const commit = await store.put(
    [{ path: workItemPath(id), content: json(next) }],
    `spec: ${id}`
  );
  return { id, declaredTestEdits: spec.tests_changed ?? [], commit };
}
async function fetchArtifact(gh, name, out, runId) {
  if (runId === void 0 || runId === "") {
    throw new Error("no run id: pass --run-id, or run inside Actions where GITHUB_RUN_ID is set");
  }
  const list = await gh.get(
    `repos/${gh.repo}/actions/runs/${runId}/artifacts?per_page=100`
  );
  const match2 = list.artifacts.find((a) => a.name === name && !a.expired);
  if (match2 === void 0) {
    write(out, json({ artifact: name, found: false, items: [] }));
    return { name, wrote: out, found: false };
  }
  const zip = await gh.get(`repos/${gh.repo}/actions/artifacts/${match2.id}/zip`);
  write(out, typeof zip === "string" ? zip : json(zip));
  return { name, wrote: out, found: true };
}
var MEDIA_EXT = /\.(png|jpe?g|webp|gif|mp4|webm|zip|json)$/i;
var MEDIA_FILE_CAP_BYTES = 10 * 1024 * 1024;
async function storeMedia(gh, runDir, runId, now) {
  if (!existsSync11(runDir)) return { files: [], bytes: 0, commit: null, skipped: [] };
  const media = new FactoryStore(gh, MEDIA_REF);
  const changes = [];
  const files = [];
  const skipped = [];
  let bytes = 0;
  for (const abs of walk(runDir)) {
    const rel2 = relative2(runDir, abs);
    if (!MEDIA_EXT.test(rel2)) {
      skipped.push({ file: rel2, why: "not an image, clip or trace" });
      continue;
    }
    const size = statSync(abs).size;
    if (size > MEDIA_FILE_CAP_BYTES) {
      skipped.push({ file: rel2, why: `${Math.round(size / 1024 / 1024)} MB is over the per-file cap` });
      continue;
    }
    const day = now.slice(0, 10);
    changes.push({ path: `media/${day}/${runId}/${rel2}`, content: readFileSync13(abs, "base64") });
    files.push(rel2);
    bytes += size;
  }
  if (changes.length === 0) return { files: [], bytes: 0, commit: null, skipped };
  const commit = await media.data.commit(changes, `media: ${runId} (${files.length} file(s))`);
  return { files, bytes, commit, skipped };
}
function* walk(dir) {
  for (const entry of readdirSync5(dir, { withFileTypes: true })) {
    const full = join13(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.isFile()) yield full;
  }
}
function write(path2, content) {
  mkdirSync5(dirname5(path2), { recursive: true });
  writeFileSync6(path2, content);
}

// src/commands/role-steps.ts
init_store();
import { readFileSync as readFileSync14, writeFileSync as writeFileSync7, mkdirSync as mkdirSync6, existsSync as existsSync12 } from "node:fs";
import { dirname as dirname6 } from "node:path";
async function gardenScan(opts) {
  const store = new FactoryStore(opts.gh);
  const ledger = await store.ledger(opts.now);
  const alreadyFixing = [...new Set(ledger.open.flatMap((o) => o.fixes ?? []))];
  const measured = [
    ...baselinedDrift(opts.baselines),
    ...await untestedRecent(opts.root, opts.windowDays ?? 14)
  ].filter((i) => !alreadyFixing.includes(i.problem_class));
  write2(
    opts.out,
    json({
      measured,
      already_fixing: alreadyFixing,
      note: "These two kinds were counted, not judged \u2014 baselined rule violations and behaviour merged in the window with no test in the same commit. The third kind, principle drift no rule catches, is yours to find. Anything in already_fixing is covered by an open PR; filing it again would mean two PRs racing on the same files."
    })
  );
  return { measured, alreadyFixing, wrote: opts.out };
}
async function gardenFile(opts) {
  const picks = JSON.parse(readFileSync14(opts.from, "utf8"));
  const list = Array.isArray(picks) ? picks : picks.picks ?? [];
  const store = new FactoryStore(opts.gh);
  const ledger = await store.ledger(opts.now);
  const alreadyFixing = new Set(ledger.open.flatMap((o) => o.fixes ?? []));
  const rejected = [];
  const accepted = [];
  const handedOff = [];
  for (const p of list) {
    if (typeof p.problem_class !== "string" || p.problem_class.trim() === "") {
      rejected.push({ problem_class: String(p.problem_class), why: "no problem class named" });
      continue;
    }
    if (alreadyFixing.has(p.problem_class)) {
      rejected.push({ problem_class: p.problem_class, why: "an open PR already fixes this" });
      continue;
    }
    if (p.hand_off_to_hardening === true) {
      handedOff.push(p.problem_class);
      continue;
    }
    accepted.push({
      kind: p.kind ?? "principle_drift",
      problem_class: p.problem_class,
      occurrences: p.occurrences ?? 1,
      files: p.files ?? [],
      detail: p.detail ?? "found by the gardener"
    });
  }
  const report = await runGardenCommand({
    gh: opts.gh,
    now: opts.now,
    root: opts.root,
    // The measured kinds were already handed to the agent; what comes back is
    // its picks, so nothing is re-scanned here.
    baselines: { schema: "baselines/1", rules: {} },
    maxPrs: opts.maxPrs,
    extra: accepted,
    ...opts.freeSlots === void 0 ? {} : { freeSlots: opts.freeSlots },
    ...opts.plan === true ? { plan: true } : {}
  });
  for (const cls of handedOff) {
    await fileHardeningItem(opts.gh, opts.now, cls, "a gardening hand-off: found in three runs");
  }
  return { filed: report.filed, dispatched: report.dispatched, handedOff, rejected };
}
async function fileHardeningItem(gh, now, problemClass, why) {
  const r = await runReviewRoute({
    gh,
    now,
    plan: true,
    failures: [
      { run: "", role: "gardener", area: "", tag: problemClass, kind: "low_score", detail: why }
    ]
  });
  return r.filed.map((f) => f.work_item);
}
async function hardenContext(opts) {
  const store = new FactoryStore(opts.gh);
  const ledger = await store.ledger(opts.now);
  const item = await store.get(
    `work-items/${opts.id}.json`,
    "work-item"
  );
  const candidates = opts.candidatesPath !== void 0 && existsSync12(opts.candidatesPath) ? JSON.parse(readFileSync14(opts.candidatesPath, "utf8")).candidates ?? [] : [];
  const existingRules = Object.keys(opts.baselines.rules ?? {});
  write2(
    opts.out,
    json({
      work_item: opts.id,
      title: item?.title ?? null,
      detail: item?.body ?? null,
      existing_rules: existingRules,
      existing_candidates: candidates,
      open_work: ledger.open.map((o) => ({ work_item: o.work_item, fixes: o.fixes ?? [] })),
      note: "Check existing_rules and existing_candidates before proposing anything: a second rule for a class already covered is a rule nobody can act on. The ordered check for the strongest fix is in the role prompt; the point of this file is that you are not guessing what already exists."
    })
  );
  return { wrote: opts.out, openRules: existingRules.length, candidates: candidates.length };
}
async function reviewCollect(opts) {
  const store = new FactoryStore(opts.gh);
  const reviews = (await store.data.list("reviews/")).filter((p) => p.endsWith(".json")).sort();
  const last = reviews[reviews.length - 1];
  const since = last === void 0 ? null : (await store.data.readJson(last))?.window?.to ?? null;
  const { runs } = await readAll(store);
  const toScore = runs.filter((r) => since === null || Date.parse(r.ended_at) > Date.parse(since)).map((r) => ({
    id: r.id,
    pipeline: r.pipeline,
    outcome: r.outcome,
    ended_at: r.ended_at,
    escalated: r.escalated,
    cost_usd: r.cost_usd,
    pr: r.pr
  }));
  write2(
    opts.out,
    json({
      since,
      runs: toScore,
      note: "Grade each run against its pipeline's rubric and the shared rubric, 1-5 per criterion, with failure tags from the rubric's own list. A tag you invent routes nowhere."
    })
  );
  return { runs: toScore.length, wrote: opts.out, since };
}
async function reviewWrite(opts) {
  const doc = JSON.parse(readFileSync14(opts.scores, "utf8"));
  const failures = Array.isArray(doc) ? doc : doc.failures ?? doc.scores ?? [];
  const real = failures.filter((f) => f.score === void 0 || f.score <= 2);
  const r = await runReviewRoute({
    gh: opts.gh,
    now: opts.now,
    failures: real,
    ...opts.plan === true ? { plan: true } : {}
  });
  return {
    scored: failures.length,
    problems: r.problems.length,
    filed: r.filed.map((f) => f.work_item),
    dispatched: r.dispatched
  };
}
function write2(path2, content) {
  mkdirSync6(dirname6(path2), { recursive: true });
  writeFileSync7(path2, content);
}

// src/commands/tests-gate.ts
import { execFile as execFile5 } from "node:child_process";
import { promisify as promisify5 } from "node:util";
var exec4 = promisify5(execFile5);
async function runTestsGate(opts) {
  if (opts.existingCheck !== null && opts.existingCheck !== "") {
    const read = await readExistingCheck(opts);
    if (read !== null) return read;
  }
  if (opts.command === null || opts.command.trim() === "") {
    return {
      conclusion: "neutral",
      source: "no_tests",
      summary: "This repo has no test command, so there was nothing to run.",
      detail: "Setup records this, sets the coverage floor to 0% and seeds gardening to add tests. Until then diff coverage is the only coverage check with teeth."
    };
  }
  return runCommand(opts);
}
async function readExistingCheck(opts) {
  const waitMs = opts.waitMs ?? 15 * 60 * 1e3;
  const pollMs = opts.pollMs ?? 15e3;
  const sleep = opts.sleep ?? ((ms) => new Promise((r) => setTimeout(r, ms)));
  const deadline = Date.now() + waitMs;
  for (; ; ) {
    let runs;
    try {
      const res = await opts.gh.get(
        `repos/${opts.gh.repo}/commits/${opts.commit}/check-runs?per_page=100`
      );
      runs = res.check_runs;
    } catch {
      return null;
    }
    const match2 = runs.find((c) => c.name === opts.existingCheck);
    if (match2 !== void 0 && match2.status === "completed") {
      const ok = match2.conclusion === "success";
      return {
        conclusion: ok ? "success" : "failure",
        source: "existing_check",
        summary: ok ? `${opts.existingCheck} passed on ${opts.commit.slice(0, 8)}.` : `${opts.existingCheck} concluded ${match2.conclusion ?? "nothing"} on ${opts.commit.slice(0, 8)}.`,
        detail: "Read from the repo's own test check rather than run again."
      };
    }
    if (Date.now() >= deadline) return null;
    await sleep(Math.min(pollMs, Math.max(0, deadline - Date.now())));
  }
}
async function runCommand(opts) {
  const command = opts.command;
  const [bin, ...args] = command.split(/\s+/);
  try {
    const { stdout, stderr } = await exec4(bin, args, {
      cwd: opts.root,
      maxBuffer: 64 * 1024 * 1024,
      env: { ...process.env, CI: "true", NO_COLOR: "1" }
    });
    return {
      conclusion: "success",
      source: "ran_tests",
      summary: `\`${command}\` passed.`,
      detail: tail(String(stdout) + String(stderr))
    };
  } catch (err) {
    const e = err;
    return {
      conclusion: "failure",
      source: "ran_tests",
      summary: `\`${command}\` failed with exit ${e.code ?? "unknown"}.`,
      // The tail, not the head: a test runner's failures are at the end, and
      // this text is what goes back to the builder for the next attempt.
      detail: tail(`${e.stdout ?? ""}${e.stderr ?? ""}`)
    };
  }
}
function tail(text, lines = 80, maxChars = 6e4) {
  const kept = text.split("\n").slice(-lines).join("\n");
  return kept.length <= maxChars ? kept : kept.slice(kept.length - maxChars);
}

// src/commands/mine-repo.ts
import { execFile as execFile6 } from "node:child_process";
import { promisify as promisify6 } from "node:util";
import { readFileSync as readFileSync15, existsSync as existsSync13 } from "node:fs";
import { join as join14 } from "node:path";
var exec5 = promisify6(execFile6);
async function git(root, args) {
  try {
    const { stdout } = await exec5("git", args, { cwd: root, maxBuffer: 64 * 1024 * 1024 });
    return String(stdout);
  } catch {
    return "";
  }
}
async function findReverts(root, days = 365) {
  const log = await git(root, [
    "log",
    `--since=${days} days ago`,
    "--format=%H%x1f%s%x1f%aI%x1f%b%x1e"
  ]);
  if (log === "") return [];
  const out = [];
  for (const entry of log.split("")) {
    const parts = entry.replace(/^\n/, "").split("");
    if (parts.length < 3) continue;
    const [sha, subject, at, body] = parts;
    if (!/^revert\b|^revert:/i.test(subject) && !/\bthis reverts commit\b/i.test(body ?? "")) continue;
    const reverted = /this reverts commit ([0-9a-f]{7,40})/i.exec(body ?? "")?.[1] ?? null;
    const files = (await git(root, ["show", "--name-only", "--format=", sha])).split("\n").map((f) => f.trim()).filter((f) => f !== "");
    out.push({ commit: sha, subject: redact(subject), reverted, at, files });
  }
  return out;
}
var FIX_SUBJECT = /^(fix|hotfix|bugfix|patch)\b|^fix[(:]|\bregression\b/i;
async function findFixCommits(root, days = 180, window = 14) {
  const log = await git(root, ["log", `--since=${days} days ago`, "--format=%H%x1f%s%x1f%aI"]);
  if (log === "") return [];
  const commits = log.split("\n").map((l) => l.split("")).filter((p) => p.length === 3);
  const out = [];
  for (const [sha, subject, at] of commits) {
    if (!FIX_SUBJECT.test(subject)) continue;
    const files = (await git(root, ["show", "--name-only", "--format=", sha])).split("\n").map((f) => f.trim()).filter((f) => f !== "");
    if (files.length === 0) continue;
    const fixes = /* @__PURE__ */ new Set();
    for (const file of files.slice(0, 20)) {
      const before = await git(root, [
        "log",
        "-2",
        "--format=%H%x1f%aI",
        `${sha}^`,
        "--",
        file
      ]);
      for (const line of before.split("\n")) {
        const [other, otherAt] = line.split("");
        if (other === void 0 || otherAt === void 0) continue;
        const gap = (Date.parse(at) - Date.parse(otherAt)) / 864e5;
        if (gap >= 0 && gap <= window) fixes.add(other);
      }
    }
    if (fixes.size === 0) continue;
    out.push({ commit: sha, subject: redact(subject), at, files, fixes: [...fixes] });
  }
  return out;
}
var PROSE_FILES = [
  "AGENTS.md",
  "CLAUDE.md",
  "CONTRIBUTING.md",
  "CONVENTIONS.md",
  "STYLE.md",
  "docs/style.md",
  "docs/conventions.md",
  "docs/CONTRIBUTING.md",
  ".cursorrules"
];
var RULE_SHAPE = [
  /\balways\b/i,
  /\bnever\b/i,
  /\bmust( not)?\b/i,
  /\bdo not\b|\bdon'?t\b/i,
  // Loose between the verb and the comparison, because real prose puts a
  // phrase there: "prefer the existing helper over a new one".
  /\buse\b.{0,40}?\binstead of\b/i,
  /\bprefer\b.{0,40}?\b(over|to|instead of)\b/i,
  /\bavoid\b/i,
  /\brequired\b.*\bbefore\b/i
];
function findProseRules(root, files = PROSE_FILES) {
  const out = [];
  for (const rel2 of files) {
    const full = join14(root, rel2);
    if (!existsSync13(full)) continue;
    let text;
    try {
      text = readFileSync15(full, "utf8");
    } catch {
      continue;
    }
    for (const block of readableBlocks(text)) {
      for (const sentence of sentences(block.text)) {
        if (sentence.length < 12 || sentence.length > 300) continue;
        if (!RULE_SHAPE.some((re) => re.test(sentence))) continue;
        out.push({ file: rel2, line: block.line, text: redact(sentence) });
      }
    }
  }
  return out;
}
function readableBlocks(text) {
  const out = [];
  let buffer = [];
  let bufferLine = 0;
  let generated = false;
  let fence = false;
  const flush = () => {
    if (buffer.length > 0) {
      out.push({ line: bufferLine, text: buffer.join(" ").replace(/\s+/g, " ").trim() });
      buffer = [];
    }
  };
  for (const [i, raw] of text.split("\n").entries()) {
    const line = raw.trim();
    if (/<!--\s*BEGIN[:_ ]/i.test(line) || /^#\s*BEGIN[:_ ]/i.test(line)) {
      flush();
      generated = true;
      continue;
    }
    if (/<!--\s*END[:_ ]/i.test(line) || /^#\s*END[:_ ]/i.test(line)) {
      generated = false;
      continue;
    }
    if (generated) continue;
    if (line.startsWith("```") || line.startsWith("~~~")) {
      flush();
      fence = !fence;
      continue;
    }
    if (fence) continue;
    if (line === "" || /^#{1,6}\s/.test(line) || line.startsWith("|") || /^[-=]{3,}$/.test(line)) {
      flush();
      continue;
    }
    if (/^([-*+]\s+|\d+\.\s+|>\s*)/.test(line)) {
      flush();
      bufferLine = i + 1;
      buffer.push(line.replace(/^([-*+]\s+|\d+\.\s+|>\s*)/, ""));
      continue;
    }
    if (buffer.length === 0) bufferLine = i + 1;
    buffer.push(line);
  }
  flush();
  return out;
}
function sentences(block) {
  return block.split(/(?<=[.!?])\s+(?=[A-Z`"'(])/).map((s) => s.trim()).filter((s) => s !== "");
}
async function mineRepo(root, days = 365) {
  const [reverts, fixes] = await Promise.all([findReverts(root, days), findFixCommits(root)]);
  const prose = findProseRules(root);
  const asCorrections = [
    ...reverts.map((r) => ({
      text: r.subject,
      source: "revert",
      session: r.commit.slice(0, 8),
      at: r.at,
      // A revert is a decision already taken, so it needs no classifier.
      confidence: 0.9,
      signals: ["revert"]
    })),
    // The subject alone, with no boilerplate prefix: the prefix's own words
    // are shared by every fix, so prefixing them clustered all 44 fixes in
    // gh-aw into one meaningless group.
    ...fixes.map((f) => ({
      text: f.subject,
      source: "fix_commit",
      session: f.commit.slice(0, 8),
      at: f.at,
      confidence: 0.6,
      signals: ["fix_within_window"]
    })),
    ...prose.map((p) => ({
      text: p.text,
      source: "prose_rule",
      session: `${p.file}:${p.line}`,
      at: null,
      // Someone wrote it down deliberately; it is a rule by construction.
      confidence: 0.8,
      signals: ["written_rule"]
    }))
  ];
  return { reverts, fixes, prose, asCorrections };
}

// src/commands/score.ts
var import_yaml4 = __toESM(require_dist(), 1);
import { execFile as execFile7 } from "node:child_process";
import { promisify as promisify7 } from "node:util";
import { readFileSync as readFileSync16, writeFileSync as writeFileSync8, mkdirSync as mkdirSync7, existsSync as existsSync14, readdirSync as readdirSync6 } from "node:fs";
import { join as join15, dirname as dirname7 } from "node:path";
var exec6 = promisify7(execFile7);
var toScale = (fraction) => Math.min(5, Math.max(1, Math.round(fraction * 5)));
function buildScoreConfig(opts) {
  const shared = opts.rubrics.filter((r) => r.shared === true);
  const byPipeline = new Map(
    opts.rubrics.filter((r) => r.pipeline !== void 0).map((r) => [r.pipeline, r])
  );
  const tests = opts.runs.map((run) => {
    const rubrics = [...shared, ...byPipeline.get(run.pipeline) === void 0 ? [] : [byPipeline.get(run.pipeline)]];
    return {
      description: `${run.run} (${run.pipeline})`,
      vars: {
        evidence: evidenceText(run),
        run: run.run,
        pipeline: run.pipeline
      },
      assert: rubrics.flatMap(
        (rubric) => rubric.criteria.map((c) => ({
          type: "llm-rubric",
          // The question, plus how to answer it on this scale. Without the
          // scale the grader returns its own idea of a score and the 1-5 in
          // the rubrics means nothing.
          value: `${c.question}

Answer on a 1-5 scale, where 1 is a clear failure and 5 is exemplary. Judge only what the evidence shows; absent evidence is not a pass.`,
          metric: c.id
        }))
      )
    };
  });
  return {
    description: "factory scorers",
    // Echo: the work is done, so there is nothing to generate — only grade.
    providers: [{ id: "echo" }],
    prompts: ["{{evidence}}"],
    defaultTest: { options: { provider: opts.graderProvider } },
    tests,
    ...opts.repeat === void 0 ? {} : { evaluateOptions: { repeat: opts.repeat } }
  };
}
function evidenceText(run) {
  const lines = [
    `Pipeline: ${run.pipeline}`,
    `Outcome: ${run.outcome}${run.escalated ? " (escalated to a human)" : ""}`,
    "",
    "## What was asked",
    run.request.trim() === "" ? "(nothing recorded)" : run.request,
    "",
    "## The spec it worked from",
    run.spec.trim() === "" ? "(no spec: this pipeline has none)" : run.spec,
    "",
    "## What changed",
    run.changed.length === 0 ? "(no files changed)" : run.changed.map((f) => `- ${f}`).join("\n"),
    "",
    "## What verification reported",
    run.verification.trim() === "" ? "(verification did not report)" : run.verification
  ];
  if (run.human_corrections.length > 0) {
    lines.push(
      "",
      "## What a human changed afterwards",
      ...run.human_corrections.map((c) => `- ${c}`)
    );
  }
  return lines.join("\n");
}
function readScores(output) {
  const doc = output;
  const samples = /* @__PURE__ */ new Map();
  const errors = [];
  for (const r of doc.results?.results ?? []) {
    const components = r.gradingResult?.componentResults ?? [];
    if (components.length === 0) {
      if (r.error !== void 0 && r.error !== "") errors.push(r.error);
      continue;
    }
    const run = typeof r.vars?.["run"] === "string" ? r.vars["run"] : r.description ?? "unknown";
    for (const comp of components) {
      const metric = comp.assertion?.metric;
      if (metric === void 0) continue;
      const key = `${run}\0${metric}`;
      const entry = samples.get(key) ?? { scores: [], reasons: [] };
      entry.scores.push(typeof comp.score === "number" ? comp.score : 0);
      if (comp.reason !== void 0 && comp.reason !== "") entry.reasons.push(comp.reason);
      samples.set(key, entry);
    }
  }
  const rows = [];
  const spread2 = /* @__PURE__ */ new Map();
  for (const [key, entry] of samples) {
    const [run, criterion] = key.split("\0");
    const mean2 = entry.scores.reduce((a, b) => a + b, 0) / entry.scores.length;
    rows.push({
      run,
      criterion,
      score: toScale(mean2),
      reason: entry.reasons[0] ?? ""
    });
    if (entry.scores.length > 1) {
      spread2.set(key, Math.max(...entry.scores) - Math.min(...entry.scores));
    }
  }
  return { rows, spread: spread2, errors };
}
function failuresFrom(rows, runs, rubrics) {
  const byRun = new Map(runs.map((r) => [r.run, r]));
  const tagFor = (criterion) => {
    for (const r of rubrics) {
      if (r.criteria.some((c) => c.id === criterion)) {
        return r.failure_tags.includes(criterion) ? criterion : criterion;
      }
    }
    return criterion;
  };
  const out = [];
  for (const row of rows) {
    if (row.score > 2) continue;
    const run = byRun.get(row.run);
    out.push({
      run: row.run,
      role: "",
      area: areaOf(run),
      tag: tagFor(row.criterion),
      score: row.score,
      kind: "low_score",
      ...row.reason === "" ? {} : { detail: row.reason }
    });
  }
  for (const run of runs) {
    if (run.escalated) {
      out.push({ run: run.run, role: "", area: areaOf(run), tag: "escalation", kind: "escalation" });
    }
    for (const c of run.human_corrections) {
      out.push({
        run: run.run,
        role: "",
        area: areaOf(run),
        tag: "human_correction",
        kind: "human_correction",
        detail: c
      });
    }
  }
  return out;
}
function areaOf(run) {
  if (run === void 0 || run.changed.length === 0) return "";
  const counts = /* @__PURE__ */ new Map();
  for (const f of run.changed) {
    const dir = f.split("/").slice(0, 2).join("/");
    counts.set(dir, (counts.get(dir) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "";
}
function resolvePromptfoo(from = process.cwd()) {
  const local = [
    join15(from, "node_modules/.bin/promptfoo"),
    join15(from, "../node_modules/.bin/promptfoo"),
    join15(from, "../../node_modules/.bin/promptfoo")
  ].find((p) => existsSync14(p));
  if (local !== void 0) return [local, []];
  for (const dir of (process.env["PATH"] ?? "").split(":")) {
    if (dir !== "" && existsSync14(join15(dir, "promptfoo"))) return [join15(dir, "promptfoo"), []];
  }
  return ["npx", ["--yes", "promptfoo"]];
}
function promptfooEnv(workDir) {
  return {
    ...process.env,
    PROMPTFOO_CONFIG_DIR: join15(workDir, ".promptfoo"),
    // Nothing here should phone home about a user's repository.
    PROMPTFOO_DISABLE_TELEMETRY: "1",
    PROMPTFOO_DISABLE_UPDATE: "1"
  };
}
var UNRELIABLE_SPREAD = 0.4;
async function runScorers(opts) {
  mkdirSync7(opts.workDir, { recursive: true });
  const configPath = join15(opts.workDir, "scorers.yaml");
  const outPath = join15(opts.workDir, "scores.json");
  const config = buildScoreConfig(opts);
  writeFileSync8(configPath, toYaml(config));
  let lastOutput = "";
  const run = opts.promptfoo ?? (async (args, cwd) => {
    const [bin, prefix2] = resolvePromptfoo();
    try {
      await exec6(bin, [...prefix2, ...args], {
        cwd,
        maxBuffer: 256 * 1024 * 1024,
        env: promptfooEnv(cwd)
      });
    } catch (err) {
      const e = err;
      if (typeof e.code === "number") {
        lastOutput = `${e.stdout ?? ""}
${e.stderr ?? ""}`.trim();
        return;
      }
      throw err;
    }
  });
  await run(
    [
      "eval",
      "-c",
      configPath,
      "-o",
      outPath,
      // Caching would return a previous run's grade for the same evidence,
      // which is right for repeats and wrong for a review that is meant to
      // re-grade; the review runs rarely enough that the cost is small.
      "--no-cache",
      ...opts.repeat === void 0 ? [] : ["--repeat", String(opts.repeat)]
    ],
    opts.workDir
  );
  if (!existsSync14(outPath)) {
    return {
      rows: [],
      failures: [],
      unreliable: [],
      errors: [`promptfoo wrote no output${lastOutput === "" ? "" : `: ${lastOutput.slice(-1200)}`}`],
      configPath
    };
  }
  const { rows, spread: spread2, errors } = readScores(JSON.parse(readFileSync16(outPath, "utf8")));
  const unreliable = [...spread2.entries()].filter(([, s]) => s >= UNRELIABLE_SPREAD).map(([key]) => key.replace("\0", " / "));
  const reliable = rows.filter(
    (r) => !unreliable.includes(`${r.run} / ${r.criterion}`)
  );
  return {
    rows,
    failures: failuresFrom(reliable, opts.runs, opts.rubrics),
    unreliable,
    errors,
    configPath
  };
}
function loadRubrics(dir) {
  if (!existsSync14(dir)) return [];
  return readdirSync6(dir).filter((f) => f.endsWith(".yaml") || f.endsWith(".yml")).map((f) => (0, import_yaml4.parse)(readFileSync16(join15(dir, f), "utf8"))).filter((r) => Array.isArray(r.criteria));
}
function toYaml(doc) {
  return (0, import_yaml4.stringify)(doc);
}

// src/commands/benchmark.ts
import { writeFileSync as writeFileSync9, mkdirSync as mkdirSync8, existsSync as existsSync15 } from "node:fs";
import { join as join16 } from "node:path";
function originOf(run) {
  if (run.representative === true) return "representative";
  if (run.escalated) return "escalated";
  if (run.human_corrections.length > 0) return "corrected";
  return "succeeded";
}
function buildTasks(opts) {
  const already = new Set((opts.existing ?? []).map((t) => t.source_run));
  const tasks = [];
  const skipped = [];
  for (const [i, run] of opts.runs.entries()) {
    if (already.has(run.run)) {
      skipped.push({ run: run.run, why: "already a benchmark task" });
      continue;
    }
    if (!/^[0-9a-f]{40}$/.test(run.base_commit) || !/^[0-9a-f]{40}$/.test(run.merged_commit)) {
      skipped.push({ run: run.run, why: "no base or merged commit recorded" });
      continue;
    }
    const mustPass = [...run.tests, ...run.acceptance_checks].filter((s) => s.trim() !== "");
    if (mustPass.length === 0) {
      skipped.push({
        run: run.run,
        why: "nothing to grade against: the merge added no test and the spec listed no acceptance check"
      });
      continue;
    }
    const origin = originOf(run);
    tasks.push({
      schema: "benchmark-task/1",
      id: benchmarkTaskId((Date.parse(opts.now) || Date.now()) + i),
      source_run: run.run,
      origin,
      pipeline: run.pipeline,
      base_commit: run.base_commit,
      created_at: opts.now,
      request: { title: run.title, ...run.body === void 0 ? {} : { body: run.body } },
      reference: { merged_commit: run.merged_commit, ...run.tests.length === 0 ? {} : { tests: [...run.tests] } },
      grading: {
        must_pass: mustPass,
        rubric: rubricFor(run, origin)
      },
      tags: [origin, run.pipeline]
    });
  }
  return { tasks, skipped };
}
function rubricFor(run, origin) {
  const base = `Did the run satisfy the request, with changes of a shape this codebase would accept, and with evidence that the acceptance checks pass?`;
  if (origin === "corrected" || origin === "escalated") {
    return `${base}

This task is one the factory previously got wrong: ${run.human_corrections.join("; ") || "it was escalated to a human"}. Judge in particular whether that specific problem is absent this time. A run that is good in general but repeats that problem has not passed.`;
  }
  return base;
}
function compare(before, after, repeats) {
  const isFailureTask = (r) => r.origin === "corrected" || r.origin === "escalated";
  const sum = (xs) => xs.reduce((a, r) => a + r.cost_usd, 0);
  const tasks = new Set([...before, ...after].map((r) => r.task));
  return {
    failureTaskScores: {
      before: before.filter(isFailureTask).map((r) => r.score),
      after: after.filter(isFailureTask).map((r) => r.score)
    },
    otherTaskScores: {
      before: before.filter((r) => !isFailureTask(r)).map((r) => r.score),
      after: after.filter((r) => !isFailureTask(r)).map((r) => r.score)
    },
    costBefore: sum(before),
    costAfter: sum(after),
    taskCount: tasks.size,
    repeats
  };
}
function regressedChecks(before, after) {
  const afterByTask = new Map(after.map((r) => [r.task, r]));
  return before.filter((b) => b.passed_must_pass && afterByTask.get(b.task)?.passed_must_pass === false).map((b) => b.task);
}
function admit(before, after, repeats) {
  const comparison = compare(before, after, repeats);
  const regressed = regressedChecks(before, after);
  const base = admitDefinitionChange(comparison);
  if (regressed.length === 0) return { ...base, comparison, regressed };
  return {
    admit: false,
    reasons: [
      ...base.reasons,
      `${regressed.length} task(s) stopped passing a check the reference merge passed: ${regressed.join(", ")}`
    ],
    comparison,
    regressed
  };
}
function buildBenchmarkConfig(opts) {
  return {
    description: "factory benchmarks",
    providers: opts.definitions.map((d) => ({
      id: opts.provider,
      label: d.label,
      // Also in config: promptfoo's `label` does not reliably reach a
      // file:// provider's constructor, and the label is the only thing that
      // tells the two sides of the comparison apart.
      config: { definition: d.path, label: d.label }
    })),
    prompts: ["{{task}}"],
    defaultTest: { options: { provider: opts.graderProvider } },
    evaluateOptions: { repeat: opts.repeats },
    tests: opts.tasks.map((t) => ({
      description: `${t.id} (${t.origin}/${t.pipeline})`,
      vars: {
        task: JSON.stringify({
          id: t.id,
          pipeline: t.pipeline,
          base_commit: t.base_commit,
          request: t.request,
          must_pass: t.grading.must_pass
        }),
        origin: t.origin
      },
      assert: [
        { type: "llm-rubric", value: `${t.grading.rubric}

Answer on a 1-5 scale.`, metric: "task_quality" },
        // Deterministic and so not a judgement: the provider reports which
        // must-pass checks it saw pass.
        { type: "javascript", value: "JSON.parse(output).must_pass_ok === true", metric: "must_pass" }
      ]
    }))
  };
}
async function runBenchmark(opts) {
  mkdirSync8(opts.workDir, { recursive: true });
  const configPath = join16(opts.workDir, "benchmark.yaml");
  const outPath = join16(opts.workDir, "benchmark.json");
  writeFileSync9(configPath, JSON.stringify(opts.config, null, 2));
  const run = opts.promptfoo ?? (async (args, cwd) => {
    const { execFile: execFile9 } = await import("node:child_process");
    const { promisify: promisify9 } = await import("node:util");
    const exec8 = promisify9(execFile9);
    const [bin, prefix2] = resolvePromptfoo();
    try {
      await exec8(bin, [...prefix2, ...args], {
        cwd,
        maxBuffer: 256 * 1024 * 1024,
        env: promptfooEnv(cwd)
      });
    } catch (err) {
      if (typeof err.code === "number") return;
      throw err;
    }
  });
  await run(["eval", "-c", configPath, "-o", outPath, "--no-cache"], opts.workDir);
  if (!existsSync15(outPath)) {
    return { outputPath: outPath, ran: false, note: "promptfoo produced no benchmark output" };
  }
  return { outputPath: outPath, ran: true, note: "benchmark complete" };
}
function readBenchmark(output, tasks) {
  const byId = new Map(tasks.map((t) => [t.id, t]));
  const doc = output;
  const sides = /* @__PURE__ */ new Map();
  for (const r of doc.results?.results ?? []) {
    const side = r.provider?.label ?? r.provider?.id ?? "unknown";
    const taskJson = r.vars?.["task"];
    let taskId = "";
    if (typeof taskJson === "string") {
      try {
        taskId = JSON.parse(taskJson).id ?? "";
      } catch {
      }
    }
    const task = byId.get(taskId);
    if (task === void 0) continue;
    const components = r.gradingResult?.componentResults ?? [];
    const quality = components.find((c) => c.assertion?.metric === "task_quality")?.score;
    const mustPass = components.find((c) => c.assertion?.metric === "must_pass")?.pass;
    const list = sides.get(side) ?? [];
    list.push({
      task: task.id,
      origin: task.origin,
      score: Math.min(5, Math.max(1, Math.round((quality ?? 0) * 5))),
      cost_usd: typeof r.response?.cost === "number" ? r.response.cost : 0,
      passed_must_pass: mustPass === true
    });
    sides.set(side, list);
  }
  return sides;
}
function sideSummary(label, runs, repeats, extra = {}) {
  const mean2 = (xs) => xs.length === 0 ? 0 : xs.reduce((a, b) => a + b, 0) / xs.length;
  const perRepeat = [];
  const size = repeats > 0 ? Math.ceil(runs.length / repeats) : runs.length;
  for (let i = 0; size > 0 && i < runs.length; i += size) {
    perRepeat.push(mean2(runs.slice(i, i + size).map((r) => r.score)));
  }
  const spread2 = perRepeat.length < 2 ? 0 : Math.max(...perRepeat) - Math.min(...perRepeat);
  const tasks = new Set(runs.map((r) => r.task)).size;
  const cost = runs.reduce((a, r) => a + r.cost_usd, 0);
  const decided = runs;
  return {
    label,
    ...extra.models === void 0 ? {} : { models: extra.models },
    score_mean: round22(mean2(runs.map((r) => r.score))),
    score_spread: round22(spread2),
    cost_usd: round22(cost),
    cost_per_task: tasks === 0 ? 0 : round22(cost / tasks),
    must_pass_rate: decided.length === 0 ? 0 : round22(decided.filter((r) => r.passed_must_pass).length / decided.length),
    ...extra.current === true ? { current: true } : {}
  };
}
function round22(n) {
  return Math.round(n * 100) / 100;
}

// src/commands/benchmark-run.ts
import { execFile as execFile8 } from "node:child_process";
import { promisify as promisify8 } from "node:util";
import { existsSync as existsSync16, readFileSync as readFileSync17 } from "node:fs";
import { join as join17 } from "node:path";
var exec7 = promisify8(execFile8);
async function runBenchmarkTask(opts) {
  const definition = readDefinition(opts.definitionPath);
  if (definition === null) {
    return unavailable(`the definition at ${opts.definitionPath} could not be read`, opts.task);
  }
  const plan = planRun({ pipeline: opts.task.pipeline, attempt: 1 });
  if (plan.roles.length === 0) {
    return unavailable(`no role sequence for the ${opts.task.pipeline} pipeline`, opts.task);
  }
  const harness = opts.runHarness ?? defaultHarness(opts);
  if (harness === null) {
    return unavailable(
      "no harness is available here: set FACTORY_HARNESS_COMMAND, or run the benchmark where the agent CLI is installed. Reporting unavailable rather than a pass.",
      opts.task
    );
  }
  const prompt = buildPrompt(opts.task, definition, plan.roles);
  process.stderr.write(`running ${plan.roles.join(" -> ")} on ${opts.task.id}
`);
  let result;
  try {
    result = await harness(prompt, opts.worktree);
  } catch (err) {
    return unavailable(`the harness failed to start: ${String(err).slice(0, 300)}`, opts.task);
  }
  const changed = await changedFiles(opts.worktree);
  const tests = await runTestsGate({
    gh: { repo: "benchmark/local" },
    commit: opts.task.base_commit,
    existingCheck: null,
    command: opts.testCommand ?? null,
    root: opts.worktree
  });
  const checks = opts.task.must_pass.map((check) => ({
    check,
    // A check the tests cover is decided by them; one phrased as a behaviour
    // nobody can run here is unknown, and unknown is not passed.
    passed: tests.source === "ran_tests" ? tests.conclusion === "success" : null
  }));
  const decided = checks.filter((c) => c.passed !== null);
  const allPassed = decided.length > 0 && decided.every((c) => c.passed === true);
  return {
    summary: `${plan.roles.join(" -> ")} with ${definition.label}: exit ${result.code}, ${changed.length} file(s) changed, tests ${tests.conclusion} (${tests.source}).
${result.stdout.slice(-2e3)}`,
    must_pass_ok: allPassed && result.code === 0,
    must_pass: checks,
    changed
  };
}
function unavailable(why, task) {
  return {
    summary: `could not run ${task.id}: ${why}`,
    must_pass_ok: false,
    must_pass: task.must_pass.map((check) => ({ check, passed: null })),
    changed: [],
    unavailable: why
  };
}
function readDefinition(path2) {
  if (!existsSync16(path2)) return null;
  const parts = [];
  for (const name of ["fundamentals.md", "feature-map.md", "runbook.md", "history.md"]) {
    const full = join17(path2, "context", name);
    if (existsSync16(full)) parts.push(`## ${name}

${readFileSync17(full, "utf8")}`);
  }
  if (parts.length === 0) {
    return { label: path2, context: "(this definition supplies no context)" };
  }
  return { label: path2, context: parts.join("\n\n") };
}
function buildPrompt(task, definition, roles) {
  return [
    `You are running the ${task.pipeline} pipeline's ${roles.join(", then ")} roles on one task.`,
    "",
    "## The request",
    task.request.title,
    task.request.body ?? "",
    "",
    "## What this has to achieve",
    task.must_pass.map((c) => `- ${c}`).join("\n"),
    "",
    "## The context this definition supplies",
    definition.context,
    "",
    "Work in this checkout. Change the code and its tests. Do not commit."
  ].join("\n");
}
function defaultHarness(opts) {
  const command = opts.harnessCommand ?? process.env["FACTORY_HARNESS_COMMAND"];
  if (command === void 0 || command === "") return null;
  const args = opts.harnessArgs ?? (process.env["FACTORY_HARNESS_ARGS"] ?? "").split(" ").filter((a) => a !== "");
  const timeout = opts.timeoutMs ?? 20 * 60 * 1e3;
  return async (prompt, cwd) => {
    try {
      const { stdout, stderr } = await exec7(command, args, {
        cwd,
        timeout,
        maxBuffer: 64 * 1024 * 1024,
        // The prompt goes on stdin, so nothing in it is shell-interpreted.
        input: prompt
      });
      return { code: 0, stdout: String(stdout), stderr: String(stderr) };
    } catch (err) {
      const e = err;
      return {
        code: typeof e.code === "number" ? e.code : 1,
        stdout: e.stdout ?? "",
        stderr: e.stderr ?? ""
      };
    }
  };
}
async function changedFiles(cwd) {
  try {
    const { stdout } = await exec7("git", ["status", "--porcelain=v1"], { cwd });
    return String(stdout).split("\n").map((l) => l.slice(3).trim()).filter((l) => l !== "").map((l) => l.includes(" -> ") ? l.split(" -> ")[1] : l);
  } catch {
    return [];
  }
}

// src/cli.ts
import { readFileSync as readFileSync18, appendFileSync, writeFileSync as writeFileSync10, mkdirSync as mkdirSync9, existsSync as existsSync17, readdirSync as readdirSync7 } from "node:fs";
import { dirname as dirname8, join as join18 } from "node:path";
import { fileURLToPath as fileURLToPath2 } from "node:url";
var VERSION = "0.1.0";
var USAGE = `bsf ${VERSION} \u2014 Build Software Factory runner

  bsf policy --pr N [--report-check NAME]
      Run the factory/policy check on a pull request. Reads the changed-file
      list, reviews and labels; never checks out the PR's code. policy.yaml
      comes from the default branch.

  bsf gates plan [--commit SHA] [--actor agent|human]
      Decide which gates to run for a commit, and say why.

  bsf gates static [--base REF] [--report-check NAME]
      Gate 1. Runs the repo's own linters, compares every rule's count per
      file against the baselines on the base ref, and checks for weakening.

  bsf gates coverage [--base REF] [--report-check NAME]
      Gate 2's coverage half. Diff coverage of the changed files is the main
      check; total coverage must stay above the floor.

  bsf gates tests [--report-check NAME]
      Gate 2's test half. Reads the repo's own test check for this commit when
      it has one; runs the tests itself if that check does not report in time.

  bsf gates record --gate static|verification --result pass|fail|skipped
      Record a gate's result against the head commit, so the same commit is
      never checked twice.

  bsf intake [--event-name NAME] [--event PATH] [--plan]
      Normalize every unprocessed event into work items and dispatch runs.
      Appends the incoming event to the data ref before deciding anything, so
      a dropped run costs a delay rather than a request.

  bsf run plan WORK_ITEM [--attempt N] [--revision] | --pipeline P
      Which roles run for this attempt, and why. factory-run reads this.

  bsf run after-gates --static S --verification V [--attempt N]
      What happens after the gates: verify, retry, escalate or clear.

  bsf rollup [--squash-media] [--plan]
      Rebuild index.json and ledger.json from the run files, and dispatch
      queued work when slots are free.

  bsf budget check
      Which pipelines are over their share of either monthly limit.

  bsf merge-queue [--apply]
      Work the queue: update the head PR from main, or merge it.

  bsf garden [--max N] [--plan]
      The nightly scan: file up to N gardening items and dispatch them.

  bsf conflicts scan [--no-dispatch]
      Find open factory PRs that became conflicting; dispatch resolution runs.

  bsf review due
      Whether the scheduled review should run, and why.

  bsf review route --failures PATH [--plan]
      Group scored failures into problems and file each where its fix belongs.

  bsf sync-settings [--branch NAME] [--apply]
      Apply branch protection from factory.yaml. Adds checks, never removes.

  bsf audit [--commit SHA]
      After a push to main: did anything reach main without passing the gates,
      and is every compiled role workflow current with its source?

  bsf schema-surface [--check] [--freeze]
      Compare the schemas against the frozen shape in schema/SURFACE.json.
      An additive change is reported and allowed; a change that would stop
      already-written data validating fails, because doc 09 asks for a major
      bump and a migration instead.

  bsf migrate [PATHS...] [--apply] [--support]
      Move stored data across a breaking schema change. Writes the new file
      next to the old one and never over it, so a half-finished migration
      leaves the data ref readable. --support prints what this runner reads
      and writes, which the dashboard uses to warn about an old runner.

  bsf step-report --role R --out PATH [--usage PATH] [--session-dir PATH]
      Write one role's step report. Reads gh-aw's own session evidence first,
      then the harness's log, then the price table \u2014 and says the cost is
      unknown rather than estimating one the budget would then pause on.

  bsf fetch-work-item ID --out PATH [--spec-only] [--with-triage]
      Write what a role may see into a file. Untrusted text is stripped here,
      not in the prompt.

  bsf write-spec ID --from PATH
      Store the spec role's plan and acceptance checks on the work item.

  bsf fetch-artifact NAME --out PATH [--run-id N]
      Read one of this run's artifacts, which is how role results travel.

  bsf store-media --run-dir DIR [--run-id ID]
      Put the verifier's screenshots and clips on the media ref.

  bsf garden-scan --out PATH
      The two measurable kinds of drift, for the gardener.

  bsf garden-file --from PATH [--max N] [--plan]
      Turn the gardener's picks into work items, re-checking the ledger.

  bsf harden-context ID --out PATH
      The existing rules, candidates and open work the hardener must check.

  bsf review-collect --out PATH
      The runs to grade since the last review, for the scorer.

  bsf review-write --scores PATH [--plan]
      Group the scorer's failures into problems and file each one.

  bsf mine-corrections --list [--repo-path PATH]
      List the sessions that would be read \u2014 date, harness, opening line \u2014 and
      read none of them. Phase 1 shows this to the user first, because these
      are their private conversations.

  bsf mine-corrections [--exclude ID,ID] [--out PATH] [--source NAME]
                       [--merge-into PATH]
      Read the sessions the user did not exclude and find the moments they
      corrected an agent. Each one is a rule they already wanted. Writes
      guardrail candidates; reports and continues if memex is not installed.
      With --merge-into, the existing list is kept and only genuinely new
      problems are added \u2014 what the skill's update mode needs, since one the
      user already rejected must not be offered again.

  bsf models
      Emit each role's model and the gardening budget from factory.yaml as step outputs.
  bsf consistency [--root PATH] [--json]
      Compare the artifacts that are supposed to agree: environment variables
      the code reads against the example file, commands the README tells
      people to run against the manifest's scripts, declared dependencies
      against the lockfile. Each file is fine on its own, which is why no
      linter catches these.

  bsf dashboard [--port N] [--dir PATH]
      Serve the dashboard from this machine, on the loopback interface only.
      It is a static export that talks to GitHub from your browser, so there
      is nothing else to run and no server sees your token.

  bsf doctor [--root PATH] [--repo OWNER/REPO] [--json]
      What is wrong with an installed factory: missing definition, role or
      context files, a guardrail file that no longer validates, a missing
      workflow, a lock file too stale for gh-aw to run, and \u2014 with --repo \u2014 a
      missing secret or variable and whether the data ref exists. Changes
      nothing: the skill's repair mode diagnoses before it touches anything.

  bsf contribute-corrections [--repo-path PATH] [--exclude ID,ID] [--out PATH]
      For a teammate: mine the corrections on *your* machine and write them to
      a file. Submits nothing. The quotes come from your own agent sessions, so
      you read the file, delete anything you would rather not share, and then:

  bsf contribute-corrections --submit [--from PATH] [--repo OWNER/REPO]
      Open a PR adding what is left in that file to the factory's candidate
      list. Merges rather than replaces, folds a problem already on the list
      into its existing candidate, and leaves a candidate someone has already
      accepted or rejected alone.

  bsf score --runs PATH --out PATH [--repeat N]
      Grade runs against their pipeline's rubric and the shared one, on
      promptfoo's LLM-rubric graders. Reports a criterion whose repeats
      disagree instead of routing it.

  bsf benchmark run --before PATH --after PATH [--tasks DIR] [--repeats N]
                    [--pr N] [--repo OWNER/REPO] [--result-out PATH]
      Run the frozen tasks against two definitions and say whether the change
      is admissible. Writes the comparison \u2014 each side's score, spread and
      cost \u2014 so the Improvement page can plot cost against quality; with
      --repo it also stores it in the factory's data ref.

  bsf benchmark build --runs PATH [--out DIR]
      Turn merged runs into frozen benchmark tasks, including the ones a human
      had to correct \u2014 those are what a definition change must show it fixes.

  bsf benchmark run --tasks DIR --before PATH --after PATH [--repeats N]
      Run both definitions over the same tasks and say whether the change is
      admissible. A must-pass check that regressed is a veto.

  bsf benchmark-run --task JSON --definition PATH [--json]
      One task, one definition, in this checkout. Called by the promptfoo
      provider; reports unavailable rather than a pass when it cannot run.

  bsf validate SCHEMA FILE
      Validate a file against one of the shared schemas.

  bsf schemas
      List the schemas this runner reads and writes.

  bsf version

Environment:
  GITHUB_REPOSITORY   owner/name (set by Actions)
  GH_TOKEN            the job's installation token
  FACTORY_APP_LOGINS  comma-separated App logins whose approvals never count
`;
function parse2(argv) {
  const command = [];
  const args = {};
  let i = 0;
  for (; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) break;
    command.push(a);
  }
  for (; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next !== void 0 && !next.startsWith("--")) {
      args[key] = next;
      i++;
    } else {
      args[key] = true;
    }
  }
  return { command, args };
}
function requireRepo() {
  const repo = process.env["GITHUB_REPOSITORY"];
  if (repo === void 0 || repo === "") {
    die("GITHUB_REPOSITORY is not set. Outside Actions, set it to owner/name.");
  }
  return repo;
}
function appLogins() {
  const raw = process.env["FACTORY_APP_LOGINS"] ?? "";
  return raw.split(",").map((s) => s.trim()).filter((s) => s !== "");
}
function die(message) {
  process.stderr.write(`bsf: ${message}
`);
  process.exit(2);
}
function setOutput(name, value) {
  const file = process.env["GITHUB_OUTPUT"];
  if (file === void 0) {
    process.stdout.write(`${name}=${value}
`);
    return;
  }
  const delim = `__bsf_${Math.random().toString(36).slice(2)}`;
  appendFileSync(file, `${name}<<${delim}
${value}
${delim}
`);
}
async function main(argv) {
  const { command, args } = parse2(argv);
  const [first, second] = command;
  if (args["version"] === true) {
    process.stdout.write(`${VERSION}
`);
    return 0;
  }
  if (first === void 0 || args["help"] === true || first === "help") {
    process.stdout.write(USAGE);
    return 0;
  }
  switch (first) {
    case "version":
      process.stdout.write(`${VERSION}
`);
      return 0;
    case "schemas": {
      for (const n of SCHEMA_NAMES) process.stdout.write(`${n}/1
`);
      return 0;
    }
    case "validate": {
      const [, name, file] = command;
      if (name === void 0 || file === void 0) die("usage: bsf validate SCHEMA FILE");
      if (!SCHEMA_NAMES.includes(name)) {
        die(`unknown schema ${name}. Run \`bsf schemas\` for the list.`);
      }
      const text = readFileSync18(file, "utf8");
      const doc = file.endsWith(".json") ? JSON.parse(text) : parseYaml2(text);
      try {
        assertValid(name, doc);
        process.stdout.write(`${file} is a valid ${name}
`);
        return 0;
      } catch (err) {
        process.stderr.write(`${err.message}
`);
        return 1;
      }
    }
    case "intake":
      return intakeCommand(args);
    case "run":
      return runCommand2(second, args, command[2]);
    case "rollup":
      return rollupCommand(args);
    case "budget":
      if (second !== "check") die("usage: bsf budget check");
      return budgetCommand();
    case "merge-queue":
      return mergeCommand(args);
    case "garden":
      return gardenCommand(args);
    case "conflicts":
      if (second !== "scan") die("usage: bsf conflicts scan");
      return conflictsCommand(args);
    case "review":
      return reviewCommand(second, args);
    case "sync-settings":
      return syncCommand(args);
    case "audit":
      return auditCommand(args);
    case "consistency":
      return consistencyCommand(args);
    case "models":
      return modelsCommand();
    case "dashboard":
      return dashboardCommand(args);
    case "doctor":
      return doctorCommand(args);
    case "contribute-corrections":
      return contributeCorrectionsCommand(args);
    case "schema-surface":
      return schemaSurfaceCommand(args);
    case "migrate":
      return migrateCommand(command.slice(1), args);
    case "step-report":
      return stepReportCommand(args);
    case "mine-corrections":
      return mineCommand(args);
    case "score":
      return scoreCommand(args);
    case "benchmark":
      return benchmarkCommand(second, args);
    case "benchmark-run":
      return benchmarkRunCommand(args);
    case "fetch-work-item":
      return fetchWorkItemCommand(command[1], args);
    case "write-spec":
      return writeSpecCommand(command[1], args);
    case "fetch-artifact":
      return fetchArtifactCommand(command[1], args);
    case "store-media":
      return storeMediaCommand(args);
    case "garden-scan":
      return gardenScanCommand(args);
    case "garden-file":
      return gardenFileCommand(args);
    case "harden-context":
      return hardenContextCommand(command[1], args);
    case "review-collect":
      return reviewCollectCommand(args);
    case "review-write":
      return reviewWriteCommand(args);
    case "policy": {
      const prRaw = args["pr"];
      if (typeof prRaw !== "string") die("usage: bsf policy --pr N");
      const pr = Number(prRaw);
      if (!Number.isInteger(pr) || pr < 1) die(`--pr must be a positive integer, got ${prRaw}`);
      const checkName = typeof args["report-check"] === "string" ? args["report-check"] : "factory/policy";
      const gh = new GitHub({ repo: requireRepo() });
      const result = await runPolicyCommand({
        gh,
        loader: new DiskLoader(),
        pr,
        checkName,
        appLogins: appLogins(),
        report: args["report-check"] !== void 0
      });
      if (result.conclusion === "success") {
        process.stdout.write("policy: pass\n");
        for (const n of result.notes) process.stdout.write(`  note: ${n}
`);
        return 0;
      }
      process.stdout.write("policy: fail\n");
      for (const f of result.failures) {
        process.stdout.write(`  ${f.kind}: ${f.message}
`);
      }
      for (const n of result.notes) process.stdout.write(`  note: ${n}
`);
      return 1;
    }
    case "gates": {
      if (second === "static") return await gatesStatic(args);
      if (second === "coverage") return await gatesCoverage(args);
      if (second === "record") return gatesRecord(args);
      if (second === "tests") return await gatesTests(args);
      if (second !== "plan") die("usage: bsf gates plan|static|coverage|tests|record");
      const commit = typeof args["commit"] === "string" ? args["commit"] : process.env["GITHUB_SHA"] ?? "";
      if (commit === "") die("no commit: pass --commit SHA or run inside Actions");
      const actor = args["actor"] === "human" ? "human" : "agent";
      const labels = typeof args["labels"] === "string" ? args["labels"].split(",") : [];
      const policy = await loadPolicy(new DiskLoader()).catch(() => null);
      const verifyLabel = typeof args["verify-label"] === "string" ? args["verify-label"] : "factory:verify";
      const checked = alreadyChecked(process.cwd(), commit);
      const plan = planGates({
        commit,
        actor,
        labels,
        alreadyChecked: { [commit]: checked },
        isUpdateFromMain: args["update-from-main"] === true,
        mainTouchesFeatureFolders: args["touches-feature-folders"] === true,
        verifyLabel
      });
      setOutput("static", String(plan.static));
      setOutput("tests", String(plan.tests));
      setOutput("coverage", String(plan.coverage));
      setOutput("agent_verification", String(plan.agentVerification));
      setOutput("commit", commit);
      for (const r of plan.reasons) process.stdout.write(`  ${r}
`);
      void policy;
      return 0;
    }
    default:
      die(`unknown command: ${[first, second].filter(Boolean).join(" ")}

${USAGE}`);
  }
}
function baseRef(args) {
  if (typeof args["base"] === "string") return args["base"];
  const envBase = process.env["GITHUB_BASE_REF"];
  if (envBase !== void 0 && envBase !== "") return `origin/${envBase}`;
  return "origin/HEAD";
}
function headSha() {
  return process.env["GITHUB_SHA"] ?? process.env["GITHUB_HEAD_SHA"] ?? "HEAD";
}
async function maybeReportCheck(args, conclusion, title, summary, fallbackName) {
  const name = typeof args["report-check"] === "string" ? args["report-check"] : null;
  if (name === null) return;
  const repo = process.env["GITHUB_REPOSITORY"];
  if (repo === void 0 || repo === "") {
    process.stderr.write("bsf: --report-check needs GITHUB_REPOSITORY\n");
    return;
  }
  const gh = new GitHub({ repo });
  await gh.reportCheck({ name: name === "" ? fallbackName : name, headSha: headSha(), conclusion, title, summary });
}
async function gatesStatic(args) {
  const root = process.cwd();
  const base = baseRef(args);
  const disk = new DiskLoader(root);
  const beforeLoader = new RefLoader(base);
  const policy = await loadPolicy(disk);
  const result = await runStaticGate({
    root,
    policy,
    baselineBefore: await loadBaselines(beforeLoader),
    baselineAfter: await loadBaselines(disk),
    coverageBefore: await loadCoverage(beforeLoader),
    coverageAfter: await loadCoverage(disk),
    changedFiles: changedFilesSince(base)
  });
  process.stdout.write(`${result.summary}
`);
  await maybeReportCheck(
    args,
    result.conclusion,
    result.conclusion === "success" ? "No new violations" : "Static rules failed",
    result.summary,
    "factory/gate-static"
  );
  setOutput("conclusion", result.conclusion);
  return result.conclusion === "failure" ? 1 : 0;
}
async function gatesCoverage(args) {
  const root = process.cwd();
  const base = baseRef(args);
  const result = await runCoverageGate({
    root,
    current: await loadCoverage(new DiskLoader(root)),
    changedFiles: changedFilesSince(base)
  });
  process.stdout.write(`${result.summary}
`);
  await maybeReportCheck(
    args,
    result.conclusion,
    result.conclusion === "success" ? "Coverage held" : "Coverage failed",
    result.summary,
    "factory/gate-coverage"
  );
  setOutput("diff_pct", String(result.diff_pct ?? ""));
  setOutput("total_pct", String(result.total_pct ?? ""));
  return result.conclusion === "failure" ? 1 : 0;
}
function gatesRecord(args) {
  const gate = args["gate"];
  const resultArg = args["result"];
  if (gate !== "static" && gate !== "verification") {
    die("usage: bsf gates record --gate static|verification --result pass|fail|skipped");
  }
  if (resultArg !== "pass" && resultArg !== "fail" && resultArg !== "skipped") {
    die("--result must be pass, fail or skipped");
  }
  const attempt = typeof args["attempt"] === "string" ? Number(args["attempt"]) : 1;
  recordGateResult(process.cwd(), {
    commit: headSha(),
    gate,
    attempt: Number.isInteger(attempt) && attempt > 0 ? attempt : 1,
    result: resultArg,
    recorded_at: (/* @__PURE__ */ new Date()).toISOString()
  });
  process.stdout.write(`recorded ${gate}=${resultArg} for ${headSha()}
`);
  return 0;
}
var ROLLUP_WINDOW_DAYS = 30;
var FACTORY_REQUIRED_CHECKS = ["factory/policy", "factory/gates"];
function runnerVersion() {
  try {
    const here2 = dirname8(fileURLToPath2(import.meta.url));
    return readFileSync18(join18(here2, "VERSION"), "utf8").trim();
  } catch {
    return `${VERSION} source`;
  }
}
function sandboxCommand(name) {
  try {
    const m = JSON.parse(readFileSync18(join18(process.cwd(), ".factory/sandbox/manifest.json"), "utf8"));
    const c = m.commands?.[name];
    return typeof c === "string" && c.trim() !== "" ? c : null;
  } catch {
    return null;
  }
}
async function factoryConfig() {
  const doc = await loadFactory(new DiskLoader(process.cwd()));
  return doc ?? {};
}
function nowIso() {
  return (/* @__PURE__ */ new Date()).toISOString();
}
async function runningRuns(gh) {
  const { FactoryStore: FactoryStore2 } = await Promise.resolve().then(() => (init_store(), store_exports));
  const store = new FactoryStore2(gh);
  try {
    const live = await store.data.list("live/");
    return live.filter((p) => p.endsWith(".json")).length;
  } catch {
    return 0;
  }
}
async function budgetState(cfg, gh) {
  const { FactoryStore: FactoryStore2, BUDGET: BUDGET2 } = await Promise.resolve().then(() => (init_store(), store_exports));
  const store = new FactoryStore2(gh);
  const spent = await store.data.readJson(BUDGET2);
  const shares = cfg.budget?.shares ?? {};
  return {
    limitUsd: cfg.budget?.monthly_usd ?? 0,
    limitMinutes: cfg.budget?.monthly_actions_minutes ?? null,
    shares: {
      product_work: shares["product_work"] ?? 60,
      gardening: shares["gardening"] ?? 25,
      review_and_benchmarks: shares["review_and_benchmarks"] ?? 15
    },
    spentUsd: spent?.spentUsd ?? {},
    spentMinutes: spent?.spentMinutes ?? {},
    productHardStopPct: cfg.budget?.product_work_hard_stop_pct ?? 110
  };
}
async function intakeCommand(args) {
  const cfg = await factoryConfig();
  const gh = new GitHub({ repo: requireRepo() });
  const eventName = typeof args["event-name"] === "string" ? args["event-name"] : process.env["GITHUB_EVENT_NAME"] ?? "";
  const eventPath = typeof args["event"] === "string" ? args["event"] : process.env["GITHUB_EVENT_PATH"] ?? "";
  if (eventName === "" || eventPath === "") {
    die("no event to read: pass --event-name and --event, or run inside Actions");
  }
  const triggers = cfg.triggers ?? {};
  const report = await runIntakeCommand({
    gh,
    eventName,
    eventPath,
    now: nowIso(),
    policy: await loadPolicy(new DiskLoader(process.cwd())),
    triggers: {
      issues: triggers["issues"] !== false,
      comments: triggers["comments"] !== false,
      ci_failure_on_main: triggers["ci_failure_on_main"] !== false,
      dashboard_dispatch: triggers["dashboard_dispatch"] !== false
    },
    maxRuns: cfg.limits?.concurrency?.max_runs ?? 5,
    runningRuns: await runningRuns(gh),
    pausedPipelines: pausedPipelines(await budgetState(cfg, gh)),
    ...args["plan"] === true ? { plan: true } : {}
  });
  for (const d of report.result.decisions) {
    process.stdout.write(`${d.event.kind}: ${d.outcome} \u2014 ${d.reason}
`);
  }
  process.stdout.write(
    `${report.result.processed} event(s) processed; dispatched ${report.dispatched.length}: ${report.decision.reason}
`
  );
  setOutput("dispatched", report.dispatched.join(","));
  return 0;
}
async function runCommand2(second, args, third) {
  if (second === "plan") {
    const workItemId2 = third;
    let pipeline = typeof args["pipeline"] === "string" ? args["pipeline"] : void 0;
    if (pipeline === void 0 && typeof workItemId2 === "string") {
      const { FactoryStore: FactoryStore2, workItemPath: workItemPath2 } = await Promise.resolve().then(() => (init_store(), store_exports));
      const store = new FactoryStore2(new GitHub({ repo: requireRepo() }));
      const item = await store.get(workItemPath2(workItemId2), "work-item");
      if (item === null) die(`${workItemId2} is not on the data ref`);
      pipeline = item.pipeline;
    }
    if (pipeline === void 0) die("usage: bsf run plan WORK_ITEM [--attempt N] | --pipeline P");
    const attempt = typeof args["attempt"] === "string" ? Number(args["attempt"]) : 1;
    const plan = planRun({
      pipeline,
      attempt: Number.isInteger(attempt) && attempt > 0 ? attempt : 1,
      ...args["revision"] === true ? { revision: true } : {}
    });
    let protectedFilesPolicy = "request-review";
    try {
      const policy = await loadPolicy(new DiskLoader(process.cwd()));
      protectedFilesPolicy = policy.protected_files?.policy ?? protectedFilesPolicy;
    } catch {
    }
    process.stdout.write(`${plan.reason}
roles: ${plan.roles.join(" -> ") || "(none)"}
`);
    setOutput("pipeline", pipeline);
    setOutput("roles", plan.roles.join(","));
    setOutput("needs_triage", String(plan.roles.includes("triage")));
    setOutput("needs_hardener", String(plan.roles.includes("hardener")));
    setOutput("needs_gardener", String(plan.roles.includes("gardener")));
    setOutput("needs_spec", String(plan.roles.includes("spec")));
    setOutput("protected_files_policy", protectedFilesPolicy);
    setOutput("proceed", String(!plan.escalate));
    setOutput("escalate", String(plan.escalate));
    setOutput("attempt", String(plan.attempt));
    return 0;
  }
  if (second === "after-gates") {
    const s = args["static"];
    const v = args["verification"];
    if (typeof s !== "string" || typeof v !== "string") {
      die("usage: bsf run after-gates --static passed|failed|skipped --verification passed|failed|skipped|not_run");
    }
    const attempt = typeof args["attempt"] === "string" ? Number(args["attempt"]) : 1;
    const decision = afterGates({
      staticGate: s,
      verificationGate: v,
      attempt: Number.isInteger(attempt) && attempt > 0 ? attempt : 1,
      ...typeof args["summary"] === "string" ? { failureSummary: args["summary"] } : {}
    });
    process.stdout.write(`${decision.next}: ${decision.reason}
`);
    setOutput("next", decision.next);
    setOutput("attempt", String("attempt" in decision ? decision.attempt : attempt));
    return 0;
  }
  die("usage: bsf run plan|after-gates");
}
async function rollupCommand(args) {
  const cfg = await factoryConfig();
  const gh = new GitHub({ repo: requireRepo() });
  const now = nowIso();
  const { loadBaselines: lb, loadCoverage: lc } = await Promise.resolve().then(() => (init_config(), config_exports));
  const loader = new DiskLoader(process.cwd());
  const baselines = await lb(loader);
  const coverage = await lc(loader);
  const ruleCount = Object.keys(baselines.rules ?? {}).length;
  const baselined = Object.values(baselines.rules ?? {}).reduce(
    (total, entry) => total + Object.values(byFileOf(entry)).reduce((x, y) => x + y, 0),
    0
  );
  const report = await runRollupCommand({
    gh,
    now,
    windowDays: ROLLUP_WINDOW_DAYS,
    maxRuns: cfg.limits?.concurrency?.max_runs ?? 5,
    runnerPin: runnerVersion(),
    harness: cfg.harness ?? "claude-code",
    budget: await budgetState(cfg, gh),
    guardrails: {
      rules: ruleCount,
      baselined,
      coverage_floor_pct: coverage.floor_pct,
      candidates_pending: 0
    },
    health: {
      gardening_schedule_active: true,
      last_review: null,
      lock_files_current: true,
      sandbox_profile: cfg.sandbox?.agent_runtime ?? "docker",
      enforcement: "deterministic"
    },
    ...args["plan"] === true ? { plan: true } : {}
  });
  process.stdout.write(
    `${report.metrics.runs} run(s) in the last ${report.metrics.window_days} days; ${report.metrics.merged} merged; $${report.metrics.spend_usd.toFixed(2)} spent
${report.dispatchReason}
`
  );
  if (report.paused.length > 0) {
    process.stdout.write(`paused: ${report.paused.join(", ")}
`);
  }
  if (args["squash-media"] === true) {
    const months = cfg.data?.media_retention_months ?? 12;
    const r = await squashMedia(gh, now, months);
    process.stdout.write(`media: kept ${r.kept}, dropped ${r.dropped}
`);
  }
  return 0;
}
async function budgetCommand() {
  const cfg = await factoryConfig();
  const gh = new GitHub({ repo: requireRepo() });
  const state = await budgetState(cfg, gh);
  const paused = pausedPipelines(state);
  if (paused.length === 0) {
    process.stdout.write("every pipeline is within its share\n");
  } else {
    process.stdout.write(`paused: ${paused.join(", ")}
`);
  }
  setOutput("paused", paused.join(","));
  return 0;
}
async function mergeCommand(args) {
  const cfg = await factoryConfig();
  const gh = new GitHub({ repo: requireRepo() });
  const autoMerge = {};
  for (const [name, p] of Object.entries(cfg.pipelines ?? {})) {
    autoMerge[name] = p.auto_merge === true;
  }
  const report = await runMergeCommand({
    gh,
    now: nowIso(),
    policy: await loadPolicy(new DiskLoader(process.cwd())),
    // "auto" falls back until native-queue detection exists; say "native" to use it.
    nativeQueue: cfg.enforcement?.merge_queue === "native",
    autoMerge,
    appLogins: appLogins(),
    ...args["apply"] === true ? { apply: true } : {}
  });
  process.stdout.write(`${report.considered} factory PR(s); next: ${report.action.kind} #${report.action.pr} \u2014 ${report.action.reason}
`);
  for (const b of report.blocked) process.stdout.write(`  #${b.pr} blocked: ${b.reason}
`);
  if (report.applied !== null) process.stdout.write(`${report.applied}
`);
  setOutput("action", report.action.kind);
  return 0;
}
async function gardenCommand(args) {
  const cfg = await factoryConfig();
  const gh = new GitHub({ repo: requireRepo() });
  const max = typeof args["max"] === "string" ? Number(args["max"]) : cfg.pipelines?.["gardening"]?.max_prs_per_run ?? 5;
  const state = await budgetState(cfg, gh);
  if (pausedPipelines(state).includes("gardening")) {
    process.stdout.write("gardening is over its budget share; nothing filed tonight\n");
    return 0;
  }
  const running = await runningRuns(gh);
  const report = await runGardenCommand({
    gh,
    now: nowIso(),
    root: process.cwd(),
    baselines: await loadBaselines(new DiskLoader(process.cwd())),
    maxPrs: Number.isInteger(max) && max > 0 ? max : 5,
    freeSlots: Math.max(0, (cfg.limits?.concurrency?.max_runs ?? 5) - running),
    ...args["plan"] === true ? { plan: true } : {}
  });
  process.stdout.write(
    `found ${report.scan.items.length} drift item(s); filed ${report.filed.length}; dispatched ${report.dispatched.length}
`
  );
  for (const s of report.scan.skipped) process.stdout.write(`  skipped ${s.problem_class}: ${s.reason}
`);
  return 0;
}
async function conflictsCommand(args) {
  const gh = new GitHub({ repo: requireRepo() });
  const report = await runConflictsCommand({
    gh,
    now: nowIso(),
    ...args["no-dispatch"] === true ? { dispatch: false } : {}
  });
  process.stdout.write(
    `${report.conflicting.length} conflicting, ${report.clean.length} clean, ${report.unknown.length} undetermined
`
  );
  if (report.unknown.length > 0) {
    process.stdout.write(`  still unknown after retries: ${report.unknown.map((p) => `#${p}`).join(", ")}
`);
  }
  return 0;
}
async function reviewCommand(second, args) {
  const cfg = await factoryConfig();
  const gh = new GitHub({ repo: requireRepo() });
  if (second === "due") {
    const r = await runReviewDue({
      gh,
      now: nowIso(),
      ...cfg.review?.every_days === void 0 ? {} : { everyDays: cfg.review.every_days },
      ...cfg.review?.run_early_at_runs === void 0 ? {} : { earlyAtRuns: cfg.review.run_early_at_runs },
      ...cfg.review?.skip_below_runs === void 0 ? {} : { minRuns: cfg.review.skip_below_runs }
    });
    process.stdout.write(`${r.due ? "due" : "not due"}: ${r.reason}
`);
    setOutput("due", String(r.due));
    setOutput("runs_since", String(r.runsSinceLastReview));
    return 0;
  }
  if (second === "route") {
    const file = args["failures"];
    if (typeof file !== "string") die("usage: bsf review route --failures PATH");
    const failures = JSON.parse(readFileSync18(file, "utf8"));
    const r = await runReviewRoute({
      gh,
      now: nowIso(),
      failures,
      ...args["plan"] === true ? { plan: true } : {}
    });
    for (const p of r.problems) {
      process.stdout.write(`${p.tag} (${p.occurrences}x) -> ${p.destination}: ${p.why}
`);
    }
    process.stdout.write(`filed ${r.filed.length}, dispatched ${r.dispatched.length}
`);
    return 0;
  }
  die("usage: bsf review due|route");
}
async function syncCommand(args) {
  const gh = new GitHub({ repo: requireRepo() });
  const branch = typeof args["branch"] === "string" ? args["branch"] : await gh.defaultBranch();
  const report = await runSyncCommand({
    gh,
    branch,
    requiredChecks: FACTORY_REQUIRED_CHECKS,
    requireReview: false,
    ...args["apply"] === true ? { apply: true } : {}
  });
  process.stdout.write(
    `${branch}: ${report.existed ? "protection exists" : "no protection yet"}; adding ${report.added.length} check(s), keeping ${report.kept.length}
`
  );
  for (const d of report.declinedToLoosen) process.stdout.write(`  left alone: ${d}
`);
  if (!report.applied) process.stdout.write("nothing applied (pass --apply)\n");
  return 0;
}
async function auditCommand(args) {
  const gh = new GitHub({ repo: requireRepo() });
  const commit = typeof args["commit"] === "string" ? args["commit"] : headSha();
  const report = await runAuditCommand({
    gh,
    commit,
    root: process.cwd(),
    configuredAppLogins: appLogins()
  });
  for (const c of report.checked) process.stdout.write(`checked: ${c}
`);
  if (report.findings.length === 0) {
    process.stdout.write(`${commit.slice(0, 8)} passed every gate it should have
`);
    return 0;
  }
  for (const f of report.findings) process.stderr.write(`${f.kind}: ${f.detail}
`);
  setOutput("findings", String(report.findings.length));
  return 1;
}
async function modelsCommand() {
  const cfg = await factoryConfig();
  const models = cfg.models ?? {};
  const roles = ["triage", "spec", "builder", "verifier", "gardener", "hardener", "scorer"];
  const missing = roles.filter((r) => typeof models[r] !== "string" || models[r] === "");
  if (missing.length > 0) {
    process.stderr.write(`bsf: factory.yaml has no model for: ${missing.join(", ")}
`);
    return 1;
  }
  for (const r of roles) setOutput(`model_${r}`, models[r] ?? "");
  setOutput("garden_max_prs", String(cfg.pipelines?.["gardening"]?.max_prs_per_run ?? 5));
  for (const r of roles) process.stdout.write(`${r}: ${models[r] ?? ""}
`);
  return 0;
}
async function consistencyCommand(args) {
  const root = typeof args["root"] === "string" ? args["root"] : process.cwd();
  const tracked = await trackedFiles(root);
  const files = tracked.filter(
    (f) => /\.(ts|tsx|js|jsx|mjs|cjs|py|go|rb|rs|cs|java|ya?ml)$/.test(f)
  );
  const findings = checkConsistency({ root, files });
  if (args["json"] === true) {
    process.stdout.write(`${JSON.stringify({ files: files.length, findings }, null, 2)}
`);
  } else if (findings.length === 0) {
    process.stdout.write(`nothing inconsistent across ${files.length} file(s)
`);
  } else {
    for (const f of findings) {
      process.stdout.write(`${f.check}
  ${f.detail}
  between ${f.between[0]} and ${f.between[1]}
`);
    }
    process.stdout.write(`
${findings.length} inconsistency(ies)
`);
  }
  setOutput("inconsistencies", String(findings.length));
  return 0;
}
async function trackedFiles(root) {
  try {
    const { execFile: execFile9 } = await import("node:child_process");
    const { promisify: promisify9 } = await import("node:util");
    const { stdout } = await promisify9(execFile9)("git", ["ls-files"], {
      cwd: root,
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024
    });
    return String(stdout).split("\n").filter((l) => l !== "");
  } catch {
    return [];
  }
}
async function dashboardCommand(args) {
  const dir = typeof args["dir"] === "string" ? args["dir"] : findDashboard(dirname8(fileURLToPath2(import.meta.url)));
  if (dir === null) {
    die(
      "the built dashboard was not found. In a checkout, run `npm -w @bsf/dashboard run build` first, or pass --dir PATH to the directory holding its index.html."
    );
  }
  const port = typeof args["port"] === "string" ? Number(args["port"]) : 7777;
  if (!Number.isInteger(port) || port < 0 || port > 65535) die(`${String(args["port"])} is not a port`);
  const server = await serveDashboard({ root: dir, port }).catch((err) => {
    if (/EADDRINUSE/.test(String(err))) {
      die(`port ${port} is already in use; pass --port with another one`);
    }
    throw err;
  });
  process.stdout.write(`${server.url}
`);
  process.stdout.write("Serving the dashboard on this machine only. Ctrl-C to stop.\n");
  await new Promise((resolve2) => {
    const stop = () => {
      void server.close().then(() => resolve2());
    };
    process.once("SIGINT", stop);
    process.once("SIGTERM", stop);
  });
  return 0;
}
async function doctorCommand(args) {
  const root = typeof args["root"] === "string" ? args["root"] : process.cwd();
  const repo = typeof args["repo"] === "string" ? args["repo"] : void 0;
  const report = await runDoctor({
    root,
    ...repo === void 0 ? {} : { gh: new GitHub({ repo }) }
  });
  if (args["json"] === true) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}
`);
  } else {
    process.stdout.write(`${formatReport(report)}
`);
  }
  const broken = report.findings.filter((f) => f.severity === "broken").length;
  setOutput("broken", String(broken));
  setOutput("installed", String(report.installed));
  return broken > 0 ? 1 : 0;
}
async function contributeCorrectionsCommand(args) {
  const file = typeof args["from"] === "string" ? args["from"] : typeof args["out"] === "string" ? args["out"] : "factory-contribution.json";
  if (args["submit"] === true) {
    if (!existsSync17(file)) {
      die(`${file} does not exist. Run \`bsf contribute-corrections\` first, read it, then --submit.`);
    }
    const contribution = JSON.parse(readFileSync18(file, "utf8"));
    if (contribution.schema !== "contribution/1") {
      die(`${file} is not a contribution file`);
    }
    if (contribution.candidates.length === 0) {
      process.stdout.write("that file has no candidates left in it; nothing submitted\n");
      return 0;
    }
    const repo = typeof args["repo"] === "string" ? args["repo"] : contribution.repo;
    const gh = new GitHub({ repo });
    const res = await submitContribution({
      gh,
      contribution,
      candidatesPath: ".factory/guardrails/candidates.json",
      repoPath: typeof args["repo-path"] === "string" ? args["repo-path"] : process.cwd()
    });
    if ("nothing" in res) {
      process.stdout.write(`${res.nothing}
`);
      return 0;
    }
    process.stdout.write(
      `${res.merge.added.length} new, ${res.merge.folded.length} folded into existing, ${res.merge.skipped.length} already decided
PR #${res.pull}  ${res.url}
`
    );
    setOutput("pull", String(res.pull));
    return 0;
  }
  const repoPath = typeof args["repo-path"] === "string" ? args["repo-path"] : process.cwd();
  const exclude = typeof args["exclude"] === "string" ? args["exclude"].split(",").map((x) => x.trim()).filter((x) => x !== "") : void 0;
  const report = await mineCorrections({
    repoPath,
    ...exclude === void 0 ? {} : { excludeSessions: exclude }
  });
  process.stdout.write(`${report.note}
`);
  if (report.corrections.length === 0) {
    process.stdout.write("nothing found in the sessions on this machine\n");
    return 0;
  }
  const candidates = candidatesFrom(clusterCorrections(report.corrections), nowIso());
  const doc = {
    schema: "contribution/1",
    repo: typeof args["repo"] === "string" ? args["repo"] : repoPath,
    mined_at: nowIso(),
    candidates
  };
  writeFileSync10(file, `${JSON.stringify(doc, null, 2)}
`);
  process.stdout.write(`
${candidates.length} candidate(s), written to ${file}:

`);
  for (const c of candidates) {
    process.stdout.write(`  ${String(c.occurrences).padStart(3)}x  ${c.problem_class.replace(/\s+/g, " ")}
`);
  }
  process.stdout.write(
    `
That text is from your own sessions and would be visible to everyone with
access to the repo. Open ${file}, delete any candidate you would rather not
share, then run:

  bsf contribute-corrections --submit --from ${file}
`
  );
  setOutput("mined", String(candidates.length));
  return 0;
}
function schemaSurfaceCommand(args) {
  const frozenPath = join18(SCHEMA_DIR, "SURFACE.json");
  const live = surfaceForDirectory(SCHEMA_DIR);
  if (args["freeze"] === true) {
    const at = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
    writeFrozen(frozenPath, live, at);
    const files = Object.keys(live).length;
    process.stdout.write(`froze ${files} schema files at ${at}
`);
    return 0;
  }
  if (!existsSync17(frozenPath)) {
    die(`${frozenPath} does not exist; run bsf schema-surface --freeze once to record the frozen shape`);
  }
  const drift = compareSurface(readFrozen(frozenPath).surface, live);
  const breaking = drift.filter((d) => d.kind === "breaking");
  const widening = drift.filter((d) => d.kind === "widening");
  const additive = drift.filter((d) => d.kind === "additive");
  for (const d of additive) process.stdout.write(`additive  ${d.file}${d.pointer} ${d.what}
`);
  for (const d of widening) {
    process.stdout.write(`widening  ${d.file}${d.pointer} ${d.what} (a reader on the frozen major rejects it)
`);
  }
  for (const d of breaking) process.stderr.write(`BREAKING  ${d.file}${d.pointer} ${d.what}
`);
  if (breaking.length > 0) {
    process.stderr.write(
      `
${breaking.length} breaking change(s). Either undo them, or bump the major and ship a migration in bsf migrate, then re-freeze.
`
    );
    setOutput("breaking", String(breaking.length));
    return 1;
  }
  if (drift.length === 0) process.stdout.write("the schemas match the frozen shape exactly\n");
  return 0;
}
function migrateCommand(paths, args) {
  if (args["support"] === true) {
    for (const s of schemaSupport()) {
      process.stdout.write(`${s.schema}: writes ${s.writes}, reads ${s.reads.join(", ")}
`);
    }
    return 0;
  }
  if (paths.length === 0) {
    die("usage: bsf migrate PATHS... [--apply]   (or --support)");
  }
  const files = paths.map((path2) => ({ path: path2, text: readFileSync18(path2, "utf8") }));
  const plan = planMigration(files);
  for (const p of plan.current) process.stdout.write(`current: ${p}
`);
  for (const u of plan.unknown) process.stderr.write(`skipped ${u.path}: ${u.why}
`);
  if (plan.items.length === 0) {
    const why = MIGRATIONS.length === 0 ? " (this runner ships no migrations)" : "";
    process.stdout.write(`nothing to migrate${why}
`);
    return plan.unknown.length > 0 ? 1 : 0;
  }
  for (const item of plan.items) {
    process.stdout.write(`${item.path} ${item.schema}/${item.from} -> ${item.to}: ${item.summary}
`);
    process.stdout.write(`  would write ${item.writesTo}
`);
  }
  if (args["apply"] !== true) {
    process.stdout.write("nothing written (pass --apply)\n");
    return 0;
  }
  const result = applyMigration(plan, diskIo);
  for (const m of result.migrated) process.stdout.write(`wrote ${m.to}
`);
  for (const f of result.failed) process.stderr.write(`failed ${f.path}: ${f.why}
`);
  return result.failed.length > 0 ? 1 : 0;
}
function stepReportCommand(args) {
  const role = args["role"];
  const out = args["out"];
  if (typeof role !== "string" || typeof out !== "string") {
    die("usage: bsf step-report --role R --out PATH [--usage PATH]");
  }
  const exit = typeof args["exit"] === "string" ? args["exit"] : "ok";
  const report = buildStepReport({
    harness: typeof args["harness"] === "string" ? args["harness"] : "claude-code",
    role,
    model: typeof args["model"] === "string" ? args["model"] : process.env["FACTORY_MODEL"] ?? "unknown",
    exit,
    durationSec: typeof args["duration"] === "string" ? Number(args["duration"]) : 0,
    filesChanged: changedFilesFromGit(process.cwd()),
    transcript: typeof args["transcript"] === "string" ? args["transcript"] : "",
    ...typeof args["usage"] === "string" ? { usagePath: args["usage"] } : {},
    // gh-aw writes its session evidence under RUNNER_TEMP in the agent job.
    sessionDirs: sessionDirs(args)
  });
  writeStepReport(out, report);
  process.stdout.write(
    `${role}: ${report.exit}, ${report.tokens.in}+${report.tokens.out} tokens, $${report.cost_usd.toFixed(4)} (${report.cost_source})
`
  );
  return 0;
}
function sessionDirs(args) {
  if (typeof args["session-dir"] === "string") return [args["session-dir"]];
  const temp = process.env["RUNNER_TEMP"];
  const dirs = ["/tmp/gh-aw"];
  if (temp !== void 0 && temp !== "") dirs.unshift(`${temp}/gh-aw`, `${temp}/gh-aw/agent`);
  return dirs;
}
function requireOut(args, usage) {
  const out = args["out"];
  if (typeof out !== "string") die(usage);
  return out;
}
async function fetchWorkItemCommand(id, args) {
  if (id === void 0) die("usage: bsf fetch-work-item ID --out PATH [--spec-only] [--with-triage]");
  const out = requireOut(args, "usage: bsf fetch-work-item ID --out PATH");
  const r = await fetchWorkItem({
    gh: new GitHub({ repo: requireRepo() }),
    id,
    out,
    ...args["spec-only"] === true ? { specOnly: true } : {},
    ...args["with-triage"] === true ? { withTriage: true } : {}
  });
  process.stdout.write(
    `${r.id} -> ${r.wrote}${r.specOnly ? " (spec only)" : ""}${r.strippedBody && !r.specOnly ? "; the author is not trusted, so their text was withheld" : ""}${r.includedTriage ? "; with triage's notes" : ""}
`
  );
  return 0;
}
async function writeSpecCommand(id, args) {
  const from = args["from"];
  if (id === void 0 || typeof from !== "string") die("usage: bsf write-spec ID --from PATH");
  const r = await writeSpec(new GitHub({ repo: requireRepo() }), id, from, nowIso());
  process.stdout.write(
    `spec stored on ${r.id}${r.declaredTestEdits.length > 0 ? `; declares ${r.declaredTestEdits.length} test edit(s)` : ""}
`
  );
  setOutput("declared_test_edits", r.declaredTestEdits.join(","));
  return 0;
}
async function fetchArtifactCommand(name, args) {
  if (name === void 0) die("usage: bsf fetch-artifact NAME --out PATH [--run-id N]");
  const out = requireOut(args, "usage: bsf fetch-artifact NAME --out PATH");
  const runId = typeof args["run-id"] === "string" ? args["run-id"] : process.env["GITHUB_RUN_ID"];
  const r = await fetchArtifact(new GitHub({ repo: requireRepo() }), name, out, runId);
  process.stdout.write(r.found ? `${r.name} -> ${r.wrote}
` : `${r.name} is not in this run; wrote an empty result
`);
  return 0;
}
async function storeMediaCommand(args) {
  const dir = args["run-dir"];
  if (typeof dir !== "string") die("usage: bsf store-media --run-dir DIR [--run-id ID]");
  const runId = typeof args["run-id"] === "string" ? args["run-id"] : process.env["GITHUB_RUN_ID"] ?? "unknown";
  const r = await storeMedia(new GitHub({ repo: requireRepo() }), dir, runId, nowIso());
  process.stdout.write(
    r.files.length === 0 ? "no media to store\n" : `stored ${r.files.length} file(s), ${Math.round(r.bytes / 1024)} KB
`
  );
  for (const s of r.skipped) process.stdout.write(`  skipped ${s.file}: ${s.why}
`);
  return 0;
}
async function gardenScanCommand(args) {
  const out = requireOut(args, "usage: bsf garden-scan --out PATH");
  const r = await gardenScan({
    gh: new GitHub({ repo: requireRepo() }),
    now: nowIso(),
    root: process.cwd(),
    baselines: await loadBaselines(new DiskLoader(process.cwd())),
    out
  });
  process.stdout.write(`${r.measured.length} measured drift item(s) -> ${r.wrote}
`);
  if (r.alreadyFixing.length > 0) {
    process.stdout.write(`  ${r.alreadyFixing.length} class(es) left out: an open PR already fixes them
`);
  }
  return 0;
}
async function gardenFileCommand(args) {
  const from = args["from"];
  if (typeof from !== "string") die("usage: bsf garden-file --from PATH [--max N] [--plan]");
  const cfg = await factoryConfig();
  const gh = new GitHub({ repo: requireRepo() });
  const max = typeof args["max"] === "string" ? Number(args["max"]) : cfg.pipelines?.["gardening"]?.max_prs_per_run ?? 5;
  const running = await runningRuns(gh);
  const r = await gardenFile({
    gh,
    now: nowIso(),
    root: process.cwd(),
    from,
    maxPrs: Number.isInteger(max) && max > 0 ? max : 5,
    freeSlots: Math.max(0, (cfg.limits?.concurrency?.max_runs ?? 5) - running),
    ...args["plan"] === true ? { plan: true } : {}
  });
  process.stdout.write(`filed ${r.filed.length}, dispatched ${r.dispatched.length}, handed to hardening ${r.handedOff.length}
`);
  for (const x of r.rejected) process.stdout.write(`  rejected ${x.problem_class}: ${x.why}
`);
  return 0;
}
async function hardenContextCommand(id, args) {
  if (id === void 0) die("usage: bsf harden-context ID --out PATH");
  const out = requireOut(args, "usage: bsf harden-context ID --out PATH");
  const r = await hardenContext({
    gh: new GitHub({ repo: requireRepo() }),
    now: nowIso(),
    id,
    out,
    baselines: await loadBaselines(new DiskLoader(process.cwd())),
    candidatesPath: ".factory/guardrails/candidates.json"
  });
  process.stdout.write(`${r.openRules} existing rule(s), ${r.candidates} candidate(s) -> ${r.wrote}
`);
  return 0;
}
async function reviewCollectCommand(args) {
  const out = requireOut(args, "usage: bsf review-collect --out PATH");
  const r = await reviewCollect({ gh: new GitHub({ repo: requireRepo() }), now: nowIso(), out });
  process.stdout.write(`${r.runs} run(s) to grade${r.since === null ? "" : ` since ${r.since}`} -> ${r.wrote}
`);
  return 0;
}
async function reviewWriteCommand(args) {
  const scores = args["scores"];
  if (typeof scores !== "string") die("usage: bsf review-write --scores PATH [--plan]");
  const r = await reviewWrite({
    gh: new GitHub({ repo: requireRepo() }),
    now: nowIso(),
    scores,
    ...args["plan"] === true ? { plan: true } : {}
  });
  process.stdout.write(
    `${r.scored} scored, ${r.problems} problem(s), filed ${r.filed.length}, dispatched ${r.dispatched.length}
`
  );
  return 0;
}
async function gatesTests(args) {
  const cfg = await factoryConfig();
  const gh = new GitHub({ repo: requireRepo() });
  const result = await runTestsGate({
    gh,
    commit: headSha(),
    existingCheck: cfg.existing_ci?.test_check ?? null,
    command: sandboxCommand("test"),
    root: process.cwd()
  });
  process.stdout.write(`${result.summary}
`);
  await maybeReportCheck(
    args,
    result.conclusion,
    result.conclusion === "success" ? "Tests passed" : result.conclusion === "neutral" ? "No tests" : "Tests failed",
    `${result.summary}

${result.detail ?? ""}`,
    "factory/gate-tests"
  );
  setOutput("tests_source", result.source);
  return result.conclusion === "failure" ? 1 : 0;
}
async function mineCommand(args) {
  const repoPath = typeof args["repo-path"] === "string" ? args["repo-path"] : process.cwd();
  const sources = typeof args["source"] === "string" ? args["source"].split(",").map((s) => s.trim()) : void 0;
  if (args["list"] === true) {
    const listing = await listSessions({ repoPath, ...sources === void 0 ? {} : { sources } });
    process.stdout.write(`${listing.note}
`);
    for (const s of listing.sessions) {
      process.stdout.write(
        `  ${(s.at ?? "unknown date").slice(0, 10)}  ${s.source.padEnd(10)} ${s.session}
${s.opening === "" ? "" : `      ${s.opening}
`}`
      );
    }
    setOutput("sessions", String(listing.sessions.length));
    return 0;
  }
  const exclude = typeof args["exclude"] === "string" ? args["exclude"].split(",").map((s) => s.trim()).filter((s) => s !== "") : void 0;
  const report = await mineCorrections({
    repoPath,
    ...sources === void 0 ? {} : { sources },
    ...exclude === void 0 ? {} : { excludeSessions: exclude }
  });
  process.stdout.write(`${report.note}
`);
  const fromRepo = await mineRepo(repoPath);
  process.stdout.write(
    `the repository itself: ${fromRepo.reverts.length} revert(s), ${fromRepo.fixes.length} quick fix(es), ${fromRepo.prose.length} written rule(s)
`
  );
  const all = [...report.corrections, ...fromRepo.asCorrections];
  if (all.length === 0) {
    setOutput("mined", "0");
    return 0;
  }
  const clusters = clusterCorrections(all);
  const mined = candidatesFrom(clusters, nowIso());
  const mergeInto = typeof args["merge-into"] === "string" ? args["merge-into"] : void 0;
  let doc = { schema: "candidates/1", candidates: mined };
  let added = mined.length;
  if (mergeInto !== void 0) {
    const existing = existsSync17(mergeInto) ? JSON.parse(readFileSync18(mergeInto, "utf8")) : { schema: "candidates/1", candidates: [] };
    const merge = mergeContribution(existing, mined, null);
    doc = merge.merged;
    added = merge.added.length;
    process.stdout.write(
      `${merge.added.length} new, ${merge.folded.length} already pending (counts raised), ${merge.skipped.length} already decided and not re-offered
`
    );
    for (const c of merge.added.slice(0, 10)) {
      process.stdout.write(`  ${c.occurrences}x  ${c.problem_class.slice(0, 90)}
`);
    }
  } else {
    for (const c of clusters.slice(0, 10)) {
      process.stdout.write(`  ${c.occurrences}x  ${c.theme.slice(0, 90)}
`);
    }
  }
  assertValid("candidates", doc);
  const out = typeof args["out"] === "string" ? args["out"] : mergeInto ?? ".factory/guardrails/candidates.json";
  mkdirSync9(dirname8(out), { recursive: true });
  writeFileSync10(out, `${JSON.stringify(doc, null, 2)}
`);
  process.stdout.write(`${doc.candidates.length} candidate(s) in ${out}
`);
  setOutput("mined", String(added));
  return 0;
}
async function scoreCommand(args) {
  const runsPath = args["runs"];
  const out = args["out"];
  if (typeof runsPath !== "string" || typeof out !== "string") {
    die("usage: bsf score --runs PATH --out PATH [--repeat N]");
  }
  const runs = JSON.parse(readFileSync18(runsPath, "utf8"));
  const rubrics = loadRubrics(".factory/definition/rubrics");
  if (rubrics.length === 0) die("no rubrics in .factory/definition/rubrics");
  const grader = process.env["FACTORY_GRADER_PROVIDER"] ?? "anthropic:messages:claude-opus-5";
  const repeat = typeof args["repeat"] === "string" ? Number(args["repeat"]) : 2;
  const report = await runScorers({
    rubrics,
    runs,
    graderProvider: grader,
    workDir: ".factory/work/scorers",
    repeat: Number.isInteger(repeat) && repeat > 0 ? repeat : 2
  });
  for (const e of report.errors) process.stderr.write(`grading error: ${e}
`);
  for (const u of report.unreliable) {
    process.stdout.write(`  not routed, the repeats disagreed: ${u}
`);
  }
  mkdirSync9(dirname8(out), { recursive: true });
  writeFileSync10(out, `${JSON.stringify({ failures: report.failures }, null, 2)}
`);
  process.stdout.write(
    `${report.rows.length} grade(s), ${report.failures.length} failure(s) -> ${out}
`
  );
  return 0;
}
async function benchmarkCommand(second, args) {
  if (second === "build") {
    const runsPath = args["runs"];
    if (typeof runsPath !== "string") die("usage: bsf benchmark build --runs PATH [--out DIR]");
    const dir = typeof args["out"] === "string" ? args["out"] : ".factory/benchmarks";
    const runs = JSON.parse(readFileSync18(runsPath, "utf8"));
    const existing = readTasks(dir);
    const { tasks, skipped } = buildTasks({ runs, now: nowIso(), existing });
    mkdirSync9(dir, { recursive: true });
    for (const t of tasks) {
      assertValid("benchmark-task", t);
      writeFileSync10(join18(dir, `${t.id}.json`), `${JSON.stringify(t, null, 2)}
`);
    }
    const byOrigin = /* @__PURE__ */ new Map();
    for (const t of [...existing, ...tasks]) byOrigin.set(t.origin, (byOrigin.get(t.origin) ?? 0) + 1);
    process.stdout.write(
      `${tasks.length} new task(s), ${existing.length + tasks.length} in all: ${[...byOrigin].map(([o, n]) => `${n} ${o}`).join(", ")}
`
    );
    for (const s of skipped) process.stdout.write(`  skipped ${s.run}: ${s.why}
`);
    return 0;
  }
  if (second === "run") {
    const dir = typeof args["tasks"] === "string" ? args["tasks"] : ".factory/benchmarks";
    const before = args["before"];
    const after = args["after"];
    if (typeof before !== "string" || typeof after !== "string") {
      die("usage: bsf benchmark run --before PATH --after PATH [--tasks DIR] [--repeats N]");
    }
    const tasks = readTasks(dir);
    if (tasks.length === 0) die(`no benchmark tasks in ${dir}`);
    const repeats = typeof args["repeats"] === "string" ? Number(args["repeats"]) : 3;
    const config = buildBenchmarkConfig({
      tasks,
      provider: `file://${join18(process.cwd(), "provider/pipeline.cjs")}`,
      definitions: [
        { label: "before", path: before },
        { label: "after", path: after }
      ],
      graderProvider: process.env["FACTORY_GRADER_PROVIDER"] ?? "anthropic:messages:claude-opus-5",
      repeats: Number.isInteger(repeats) && repeats > 0 ? repeats : 3
    });
    const result = await runBenchmark({ config, workDir: ".factory/work/benchmark" });
    if (!result.ran) {
      process.stderr.write(`${result.note}
`);
      return 1;
    }
    const sides = readBenchmark(JSON.parse(readFileSync18(result.outputPath, "utf8")), tasks);
    const beforeRuns = sides.get("before") ?? [];
    const afterRuns = sides.get("after") ?? [];
    const verdict = admit(beforeRuns, afterRuns, repeats);
    process.stdout.write(`${verdict.admit ? "admissible" : "not admissible"}
`);
    for (const r of verdict.reasons) process.stdout.write(`  ${r}
`);
    const doc = {
      schema: "benchmark-result/1",
      id: benchmarkResultId(),
      at: nowIso(),
      repeats,
      task_count: tasks.length,
      sides: [
        sideSummary("before", beforeRuns, repeats, {
          ...modelsOf(before) === null ? {} : { models: modelsOf(before) },
          current: true
        }),
        sideSummary("after", afterRuns, repeats, {
          ...modelsOf(after) === null ? {} : { models: modelsOf(after) }
        })
      ],
      admitted: verdict.admit,
      reasons: [...verdict.reasons],
      regressed: [...verdict.regressed],
      ...typeof args["pr"] === "string" && Number.isInteger(Number(args["pr"])) ? { pr: Number(args["pr"]) } : {}
    };
    assertValid("benchmark-result", doc);
    const resultOut = typeof args["result-out"] === "string" ? args["result-out"] : join18(".factory/work/benchmark", `${doc.id}.json`);
    mkdirSync9(dirname8(resultOut), { recursive: true });
    writeFileSync10(resultOut, `${JSON.stringify(doc, null, 2)}
`);
    process.stdout.write(`result -> ${resultOut}
`);
    if (typeof args["repo"] === "string") {
      const store = new FactoryStore(new GitHub({ repo: args["repo"] }));
      await store.put(
        [{ path: benchmarkResultPath(doc.id), content: json(doc) }],
        `benchmark: ${doc.admitted ? "admissible" : "not admissible"} over ${tasks.length} task(s)`
      );
      process.stdout.write(`stored at ${benchmarkResultPath(doc.id)}
`);
    }
    setOutput("admit", String(verdict.admit));
    setOutput("benchmark_result", doc.id);
    return verdict.admit ? 0 : 1;
  }
  die("usage: bsf benchmark build|run");
}
function modelsOf(definitionPath) {
  try {
    const doc = parseYaml2(readFileSync18(definitionPath, "utf8"));
    const models = doc.models;
    if (typeof models !== "object" || models === null) return null;
    const out = {};
    for (const [role, model] of Object.entries(models)) {
      if (typeof model === "string") out[role] = model;
    }
    return Object.keys(out).length === 0 ? null : out;
  } catch {
    return null;
  }
}
async function benchmarkRunCommand(args) {
  const taskJson = args["task"];
  const definition = args["definition"];
  if (typeof taskJson !== "string" || typeof definition !== "string") {
    die("usage: bsf benchmark-run --task JSON --definition PATH");
  }
  const report = await runBenchmarkTask({
    task: JSON.parse(taskJson),
    definitionPath: definition,
    worktree: process.cwd(),
    testCommand: sandboxCommand("test")
  });
  process.stdout.write(`${JSON.stringify(report)}
`);
  return 0;
}
function readTasks(dir) {
  if (!existsSync17(dir)) return [];
  return readdirSync7(dir).filter((f) => f.endsWith(".json")).map((f) => JSON.parse(readFileSync18(join18(dir, f), "utf8"))).filter((t) => t.schema === "benchmark-task/1");
}
main(process.argv.slice(2)).then((code) => process.exit(code)).catch((err) => {
  process.stderr.write(`bsf: ${err.message ?? String(err)}
`);
  process.exit(2);
});
