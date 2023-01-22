// deno-fmt-ignore-file
// deno-lint-ignore-file
// This code was bundled using `deno bundle` and it's not recommended to edit it manually

function dedent(templateStrings, ...values) {
    const matches = [];
    const strings = typeof templateStrings === 'string' ? [
        templateStrings
    ] : templateStrings.slice();
    strings[strings.length - 1] = strings[strings.length - 1].replace(/\r?\n([\t ]*)$/, '');
    for (const string of strings){
        const match = string.match(/\n[\t ]+/g);
        match && matches.push(...match);
    }
    if (matches.length) {
        const size = Math.min(...matches.map((value)=>value.length - 1));
        const pattern = new RegExp(`\n[\t ]{${size}}`, 'g');
        for(let i = 0; i < strings.length; i++){
            strings[i] = strings[i].replace(pattern, '\n');
        }
    }
    strings[0] = strings[0].replace(/^\r?\n/, '');
    let string1 = strings[0];
    for(let i1 = 0; i1 < values.length; i1++){
        string1 += values[i1] + strings[i1 + 1];
    }
    return string1;
}
var __global$ = globalThis || (typeof window !== "undefined" ? window : self);
var Q = Object.create;
var B = Object.defineProperty;
var V = Object.getOwnPropertyDescriptor;
var ee = Object.getOwnPropertyNames;
var ae = Object.getPrototypeOf, te = Object.prototype.hasOwnProperty;
var ne = (o, c)=>()=>(c || o((c = {
            exports: {}
        }).exports, c), c.exports);
var re = (o, c, p, F)=>{
    if (c && typeof c == "object" || typeof c == "function") for (let i of ee(c))!te.call(o, i) && i !== p && B(o, i, {
        get: ()=>c[i],
        enumerable: !(F = V(c, i)) || F.enumerable
    });
    return o;
};
var ie = (o, c, p)=>(p = o != null ? Q(ae(o)) : {}, re(c || !o || !o.__esModule ? B(p, "default", {
        value: o,
        enumerable: !0
    }) : p, o));
var W = ne((ge, M)=>{
    var se = typeof document < "u" ? window : typeof WorkerGlobalScope < "u" && self instanceof WorkerGlobalScope ? self : {};
    var s = function(o) {
        var c = /(?:^|\s)lang(?:uage)?-([\w-]+)(?=\s|$)/i, p = 0, F = {}, i = {
            manual: o.Prism && o.Prism.manual,
            disableWorkerMessageHandler: o.Prism && o.Prism.disableWorkerMessageHandler,
            util: {
                encode: function a(e) {
                    return e instanceof b ? new b(e.type, a(e.content), e.alias) : Array.isArray(e) ? e.map(a) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
                },
                type: function(a) {
                    return Object.prototype.toString.call(a).slice(8, -1);
                },
                objId: function(a) {
                    return a.__id || Object.defineProperty(a, "__id", {
                        value: ++p
                    }), a.__id;
                },
                clone: function a(e, t) {
                    t = t || {};
                    var n, r;
                    switch(i.util.type(e)){
                        case "Object":
                            if (r = i.util.objId(e), t[r]) return t[r];
                            n = {}, t[r] = n;
                            for(var l in e)e.hasOwnProperty(l) && (n[l] = a(e[l], t));
                            return n;
                        case "Array":
                            return r = i.util.objId(e), t[r] ? t[r] : (n = [], t[r] = n, e.forEach(function(g, u) {
                                n[u] = a(g, t);
                            }), n);
                        default:
                            return e;
                    }
                },
                getLanguage: function(a) {
                    for(; a;){
                        var e = c.exec(a.className);
                        if (e) return e[1].toLowerCase();
                        a = a.parentElement;
                    }
                    return "none";
                },
                setLanguage: function(a, e) {
                    a.className = a.className.replace(RegExp(c, "gi"), ""), a.classList.add("language-" + e);
                },
                currentScript: function() {
                    if (typeof document > "u") return null;
                    if ("currentScript" in document && 1 < 2) return document.currentScript;
                    try {
                        throw new Error;
                    } catch (n) {
                        var a = (/at [^(\r\n]*\((.*):[^:]+:[^:]+\)$/i.exec(n.stack) || [])[1];
                        if (a) {
                            var e = document.getElementsByTagName("script");
                            for(var t in e)if (e[t].src == a) return e[t];
                        }
                        return null;
                    }
                },
                isActive: function(a, e, t) {
                    for(var n = "no-" + e; a;){
                        var r = a.classList;
                        if (r.contains(e)) return !0;
                        if (r.contains(n)) return !1;
                        a = a.parentElement;
                    }
                    return !!t;
                }
            },
            languages: {
                plain: F,
                plaintext: F,
                text: F,
                txt: F,
                extend: function(a, e) {
                    var t = i.util.clone(i.languages[a]);
                    for(var n in e)t[n] = e[n];
                    return t;
                },
                insertBefore: function(a, e, t, n) {
                    n = n || i.languages;
                    var r = n[a], l = {};
                    for(var g in r)if (r.hasOwnProperty(g)) {
                        if (g == e) for(var u in t)t.hasOwnProperty(u) && (l[u] = t[u]);
                        t.hasOwnProperty(g) || (l[g] = r[g]);
                    }
                    var f = n[a];
                    return n[a] = l, i.languages.DFS(i.languages, function(m, w) {
                        w === f && m != a && (this[m] = l);
                    }), l;
                },
                DFS: function a(e, t, n, r) {
                    r = r || {};
                    var l = i.util.objId;
                    for(var g in e)if (e.hasOwnProperty(g)) {
                        t.call(e, g, e[g], n || g);
                        var u = e[g], f = i.util.type(u);
                        f === "Object" && !r[l(u)] ? (r[l(u)] = !0, a(u, t, null, r)) : f === "Array" && !r[l(u)] && (r[l(u)] = !0, a(u, t, g, r));
                    }
                }
            },
            plugins: {},
            highlightAll: function(a, e) {
                i.highlightAllUnder(document, a, e);
            },
            highlightAllUnder: function(a, e, t) {
                var n = {
                    callback: t,
                    container: a,
                    selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
                };
                i.hooks.run("before-highlightall", n), n.elements = Array.prototype.slice.apply(n.container.querySelectorAll(n.selector)), i.hooks.run("before-all-elements-highlight", n);
                for(var r = 0, l; l = n.elements[r++];)i.highlightElement(l, e === !0, n.callback);
            },
            highlightElement: function(a, e, t) {
                var n = i.util.getLanguage(a), r = i.languages[n];
                i.util.setLanguage(a, n);
                var l = a.parentElement;
                l && l.nodeName.toLowerCase() === "pre" && i.util.setLanguage(l, n);
                var g = a.textContent, u = {
                    element: a,
                    language: n,
                    grammar: r,
                    code: g
                };
                function f(w) {
                    u.highlightedCode = w, i.hooks.run("before-insert", u), u.element.innerHTML = u.highlightedCode, i.hooks.run("after-highlight", u), i.hooks.run("complete", u), t && t.call(u.element);
                }
                if (i.hooks.run("before-sanity-check", u), l = u.element.parentElement, l && l.nodeName.toLowerCase() === "pre" && !l.hasAttribute("tabindex") && l.setAttribute("tabindex", "0"), !u.code) {
                    i.hooks.run("complete", u), t && t.call(u.element);
                    return;
                }
                if (i.hooks.run("before-highlight", u), !u.grammar) {
                    f(i.util.encode(u.code));
                    return;
                }
                if (e && o.Worker) {
                    var m = new Worker(i.filename);
                    m.onmessage = function(w) {
                        f(w.data);
                    }, m.postMessage(JSON.stringify({
                        language: u.language,
                        code: u.code,
                        immediateClose: !0
                    }));
                } else f(i.highlight(u.code, u.grammar, u.language));
            },
            highlight: function(a, e, t) {
                var n = {
                    code: a,
                    grammar: e,
                    language: t
                };
                if (i.hooks.run("before-tokenize", n), !n.grammar) throw new Error('The language "' + n.language + '" has no grammar.');
                return n.tokens = i.tokenize(n.code, n.grammar), i.hooks.run("after-tokenize", n), b.stringify(i.util.encode(n.tokens), n.language);
            },
            tokenize: function(a, e) {
                var t = e.rest;
                if (t) {
                    for(var n in t)e[n] = t[n];
                    delete e.rest;
                }
                var r = new _;
                return S(r, r.head, a), C(a, r, e, r.head, 0), L(r);
            },
            hooks: {
                all: {},
                add: function(a, e) {
                    var t = i.hooks.all;
                    t[a] = t[a] || [], t[a].push(e);
                },
                run: function(a, e) {
                    var t = i.hooks.all[a];
                    if (!(!t || !t.length)) for(var n = 0, r; r = t[n++];)r(e);
                }
            },
            Token: b
        };
        o.Prism = i;
        function b(a, e, t, n) {
            this.type = a, this.content = e, this.alias = t, this.length = (n || "").length | 0;
        }
        b.stringify = function a(e, t) {
            if (typeof e == "string") return e;
            if (Array.isArray(e)) {
                var n = "";
                return e.forEach(function(f) {
                    n += a(f, t);
                }), n;
            }
            var r = {
                type: e.type,
                content: a(e.content, t),
                tag: "span",
                classes: [
                    "token",
                    e.type
                ],
                attributes: {},
                language: t
            }, l = e.alias;
            l && (Array.isArray(l) ? Array.prototype.push.apply(r.classes, l) : r.classes.push(l)), i.hooks.run("wrap", r);
            var g = "";
            for(var u in r.attributes)g += " " + u + '="' + (r.attributes[u] || "").replace(/"/g, "&quot;") + '"';
            return "<" + r.tag + ' class="' + r.classes.join(" ") + '"' + g + ">" + r.content + "</" + r.tag + ">";
        };
        function $(a, e, t, n) {
            a.lastIndex = e;
            var r = a.exec(t);
            if (r && n && r[1]) {
                var l = r[1].length;
                r.index += l, r[0] = r[0].slice(l);
            }
            return r;
        }
        function C(a, e, t, n, r, l) {
            for(var g in t)if (!(!t.hasOwnProperty(g) || !t[g])) {
                var u = t[g];
                u = Array.isArray(u) ? u : [
                    u
                ];
                for(var f = 0; f < u.length; ++f){
                    if (l && l.cause == g + "," + f) return;
                    var m = u[f], w = m.inside, G = !!m.lookbehind, q = !!m.greedy, Y = m.alias;
                    if (q && !m.pattern.global) {
                        var J = m.pattern.toString().match(/[imsuy]*$/)[0];
                        m.pattern = RegExp(m.pattern.source, J + "g");
                    }
                    for(var U = m.pattern || m, y = n.next, A = r; y !== e.tail && !(l && A >= l.reach); A += y.value.length, y = y.next){
                        var E = y.value;
                        if (e.length > a.length) return;
                        if (!(E instanceof b)) {
                            var z = 1, x;
                            if (q) {
                                if (x = $(U, A, a, G), !x || x.index >= a.length) break;
                                var I = x.index, K = x.index + x[0].length, k = A;
                                for(k += y.value.length; I >= k;)y = y.next, k += y.value.length;
                                if (k -= y.value.length, A = k, y.value instanceof b) continue;
                                for(var T = y; T !== e.tail && (k < K || typeof T.value == "string"); T = T.next)z++, k += T.value.length;
                                z--, E = a.slice(A, k), x.index -= A;
                            } else if (x = $(U, 0, E, G), !x) continue;
                            var I = x.index, P = x[0], R = E.slice(0, I), Z = E.slice(I + P.length), j = A + E.length;
                            l && j > l.reach && (l.reach = j);
                            var D = y.prev;
                            R && (D = S(e, D, R), A += R.length), O(e, D, z);
                            var N = new b(g, w ? i.tokenize(P, w) : P, Y, P);
                            if (y = S(e, D, N), Z && S(e, y, Z), z > 1) {
                                var H = {
                                    cause: g + "," + f,
                                    reach: j
                                };
                                C(a, e, t, y.prev, A, H), l && H.reach > l.reach && (l.reach = H.reach);
                            }
                        }
                    }
                }
            }
        }
        function _() {
            var a = {
                value: null,
                prev: null,
                next: null
            }, e = {
                value: null,
                prev: a,
                next: null
            };
            a.next = e, this.head = a, this.tail = e, this.length = 0;
        }
        function S(a, e, t) {
            var n = e.next, r = {
                value: t,
                prev: e,
                next: n
            };
            return e.next = r, n.prev = r, a.length++, r;
        }
        function O(a, e, t) {
            for(var n = e.next, r = 0; r < t && n !== a.tail; r++)n = n.next;
            e.next = n, n.prev = e, a.length -= r;
        }
        function L(a) {
            for(var e = [], t = a.head.next; t !== a.tail;)e.push(t.value), t = t.next;
            return e;
        }
        if (!o.document) return o.addEventListener && (i.disableWorkerMessageHandler || o.addEventListener("message", function(a) {
            var e = JSON.parse(a.data), t = e.language, n = e.code, r = e.immediateClose;
            o.postMessage(i.highlight(n, i.languages[t], t)), r && o.close();
        }, !1)), i;
        var h = i.util.currentScript();
        h && (i.filename = h.src, h.hasAttribute("data-manual") && (i.manual = !0));
        function d() {
            i.manual || i.highlightAll();
        }
        if (!i.manual) {
            var v = document.readyState;
            v === "loading" || v === "interactive" && h && h.defer ? document.addEventListener("DOMContentLoaded", d) : window.requestAnimationFrame ? window.requestAnimationFrame(d) : window.setTimeout(d, 16);
        }
        return i;
    }(se);
    typeof M < "u" && M.exports && (M.exports = s);
    typeof __global$ < "u" && (__global$.Prism = s);
    s.languages.markup = {
        comment: {
            pattern: /<!--(?:(?!<!--)[\s\S])*?-->/,
            greedy: !0
        },
        prolog: {
            pattern: /<\?[\s\S]+?\?>/,
            greedy: !0
        },
        doctype: {
            pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
            greedy: !0,
            inside: {
                "internal-subset": {
                    pattern: /(^[^\[]*\[)[\s\S]+(?=\]>$)/,
                    lookbehind: !0,
                    greedy: !0,
                    inside: null
                },
                string: {
                    pattern: /"[^"]*"|'[^']*'/,
                    greedy: !0
                },
                punctuation: /^<!|>$|[[\]]/,
                "doctype-tag": /^DOCTYPE/i,
                name: /[^\s<>'"]+/
            }
        },
        cdata: {
            pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
            greedy: !0
        },
        tag: {
            pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
            greedy: !0,
            inside: {
                tag: {
                    pattern: /^<\/?[^\s>\/]+/,
                    inside: {
                        punctuation: /^<\/?/,
                        namespace: /^[^\s>\/:]+:/
                    }
                },
                "special-attr": [],
                "attr-value": {
                    pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
                    inside: {
                        punctuation: [
                            {
                                pattern: /^=/,
                                alias: "attr-equals"
                            },
                            {
                                pattern: /^(\s*)["']|["']$/,
                                lookbehind: !0
                            }
                        ]
                    }
                },
                punctuation: /\/?>/,
                "attr-name": {
                    pattern: /[^\s>\/]+/,
                    inside: {
                        namespace: /^[^\s>\/:]+:/
                    }
                }
            }
        },
        entity: [
            {
                pattern: /&[\da-z]{1,8};/i,
                alias: "named-entity"
            },
            /&#x?[\da-f]{1,8};/i
        ]
    };
    s.languages.markup.tag.inside["attr-value"].inside.entity = s.languages.markup.entity;
    s.languages.markup.doctype.inside["internal-subset"].inside = s.languages.markup;
    s.hooks.add("wrap", function(o) {
        o.type === "entity" && (o.attributes.title = o.content.replace(/&amp;/, "&"));
    });
    Object.defineProperty(s.languages.markup.tag, "addInlined", {
        value: function(c, p) {
            var F = {};
            F["language-" + p] = {
                pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
                lookbehind: !0,
                inside: s.languages[p]
            }, F.cdata = /^<!\[CDATA\[|\]\]>$/i;
            var i = {
                "included-cdata": {
                    pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
                    inside: F
                }
            };
            i["language-" + p] = {
                pattern: /[\s\S]+/,
                inside: s.languages[p]
            };
            var b = {};
            b[c] = {
                pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function() {
                    return c;
                }), "i"),
                lookbehind: !0,
                greedy: !0,
                inside: i
            }, s.languages.insertBefore("markup", "cdata", b);
        }
    });
    Object.defineProperty(s.languages.markup.tag, "addAttribute", {
        value: function(o, c) {
            s.languages.markup.tag.inside["special-attr"].push({
                pattern: RegExp(/(^|["'\s])/.source + "(?:" + o + ")" + /\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))/.source, "i"),
                lookbehind: !0,
                inside: {
                    "attr-name": /^[^\s=]+/,
                    "attr-value": {
                        pattern: /=[\s\S]+/,
                        inside: {
                            value: {
                                pattern: /(^=\s*(["']|(?!["'])))\S[\s\S]*(?=\2$)/,
                                lookbehind: !0,
                                alias: [
                                    c,
                                    "language-" + c
                                ],
                                inside: s.languages[c]
                            },
                            punctuation: [
                                {
                                    pattern: /^=/,
                                    alias: "attr-equals"
                                },
                                /"|'/
                            ]
                        }
                    }
                }
            });
        }
    });
    s.languages.html = s.languages.markup;
    s.languages.mathml = s.languages.markup;
    s.languages.svg = s.languages.markup;
    s.languages.xml = s.languages.extend("markup", {});
    s.languages.ssml = s.languages.xml;
    s.languages.atom = s.languages.xml;
    s.languages.rss = s.languages.xml;
    (function(o) {
        var c = /(?:"(?:\\(?:\r\n|[\s\S])|[^"\\\r\n])*"|'(?:\\(?:\r\n|[\s\S])|[^'\\\r\n])*')/;
        o.languages.css = {
            comment: /\/\*[\s\S]*?\*\//,
            atrule: {
                pattern: RegExp("@[\\w-](?:" + /[^;{\s"']|\s+(?!\s)/.source + "|" + c.source + ")*?" + /(?:;|(?=\s*\{))/.source),
                inside: {
                    rule: /^@[\w-]+/,
                    "selector-function-argument": {
                        pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
                        lookbehind: !0,
                        alias: "selector"
                    },
                    keyword: {
                        pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
                        lookbehind: !0
                    }
                }
            },
            url: {
                pattern: RegExp("\\burl\\((?:" + c.source + "|" + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ")\\)", "i"),
                greedy: !0,
                inside: {
                    function: /^url/i,
                    punctuation: /^\(|\)$/,
                    string: {
                        pattern: RegExp("^" + c.source + "$"),
                        alias: "url"
                    }
                }
            },
            selector: {
                pattern: RegExp(`(^|[{}\\s])[^{}\\s](?:[^{};"'\\s]|\\s+(?![\\s{])|` + c.source + ")*(?=\\s*\\{)"),
                lookbehind: !0
            },
            string: {
                pattern: c,
                greedy: !0
            },
            property: {
                pattern: /(^|[^-\w\xA0-\uFFFF])(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
                lookbehind: !0
            },
            important: /!important\b/i,
            function: {
                pattern: /(^|[^-a-z0-9])[-a-z0-9]+(?=\()/i,
                lookbehind: !0
            },
            punctuation: /[(){};:,]/
        }, o.languages.css.atrule.inside.rest = o.languages.css;
        var p = o.languages.markup;
        p && (p.tag.addInlined("style", "css"), p.tag.addAttribute("style", "css"));
    })(s);
    s.languages.clike = {
        comment: [
            {
                pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
                lookbehind: !0,
                greedy: !0
            },
            {
                pattern: /(^|[^\\:])\/\/.*/,
                lookbehind: !0,
                greedy: !0
            }
        ],
        string: {
            pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
            greedy: !0
        },
        "class-name": {
            pattern: /(\b(?:class|extends|implements|instanceof|interface|new|trait)\s+|\bcatch\s+\()[\w.\\]+/i,
            lookbehind: !0,
            inside: {
                punctuation: /[.\\]/
            }
        },
        keyword: /\b(?:break|catch|continue|do|else|finally|for|function|if|in|instanceof|new|null|return|throw|try|while)\b/,
        boolean: /\b(?:false|true)\b/,
        function: /\b\w+(?=\()/,
        number: /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
        operator: /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
        punctuation: /[{}[\];(),.:]/
    };
    s.languages.javascript = s.languages.extend("clike", {
        "class-name": [
            s.languages.clike["class-name"],
            {
                pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:constructor|prototype))/,
                lookbehind: !0
            }
        ],
        keyword: [
            {
                pattern: /((?:^|\})\s*)catch\b/,
                lookbehind: !0
            },
            {
                pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|assert(?=\s*\{)|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally(?=\s*(?:\{|$))|for|from(?=\s*(?:['"]|$))|function|(?:get|set)(?=\s*(?:[#\[$\w\xA0-\uFFFF]|$))|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
                lookbehind: !0
            }
        ],
        function: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
        number: {
            pattern: RegExp(/(^|[^\w$])/.source + "(?:" + (/NaN|Infinity/.source + "|" + /0[bB][01]+(?:_[01]+)*n?/.source + "|" + /0[oO][0-7]+(?:_[0-7]+)*n?/.source + "|" + /0[xX][\dA-Fa-f]+(?:_[\dA-Fa-f]+)*n?/.source + "|" + /\d+(?:_\d+)*n/.source + "|" + /(?:\d+(?:_\d+)*(?:\.(?:\d+(?:_\d+)*)?)?|\.\d+(?:_\d+)*)(?:[Ee][+-]?\d+(?:_\d+)*)?/.source) + ")" + /(?![\w$])/.source),
            lookbehind: !0
        },
        operator: /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
    });
    s.languages.javascript["class-name"][0].pattern = /(\b(?:class|extends|implements|instanceof|interface|new)\s+)[\w.\\]+/;
    s.languages.insertBefore("javascript", "keyword", {
        regex: {
            pattern: RegExp(/((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)/.source + /\//.source + "(?:" + /(?:\[(?:[^\]\\\r\n]|\\.)*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}/.source + "|" + /(?:\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.|\[(?:[^[\]\\\r\n]|\\.)*\])*\])*\]|\\.|[^/\\\[\r\n])+\/[dgimyus]{0,7}v[dgimyus]{0,7}/.source + ")" + /(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/.source),
            lookbehind: !0,
            greedy: !0,
            inside: {
                "regex-source": {
                    pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
                    lookbehind: !0,
                    alias: "language-regex",
                    inside: s.languages.regex
                },
                "regex-delimiter": /^\/|\/$/,
                "regex-flags": /^[a-z]+$/
            }
        },
        "function-variable": {
            pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
            alias: "function"
        },
        parameter: [
            {
                pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
                lookbehind: !0,
                inside: s.languages.javascript
            },
            {
                pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$a-z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
                lookbehind: !0,
                inside: s.languages.javascript
            },
            {
                pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
                lookbehind: !0,
                inside: s.languages.javascript
            },
            {
                pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
                lookbehind: !0,
                inside: s.languages.javascript
            }
        ],
        constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/
    });
    s.languages.insertBefore("javascript", "string", {
        hashbang: {
            pattern: /^#!.*/,
            greedy: !0,
            alias: "comment"
        },
        "template-string": {
            pattern: /`(?:\\[\s\S]|\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}|(?!\$\{)[^\\`])*`/,
            greedy: !0,
            inside: {
                "template-punctuation": {
                    pattern: /^`|`$/,
                    alias: "string"
                },
                interpolation: {
                    pattern: /((?:^|[^\\])(?:\\{2})*)\$\{(?:[^{}]|\{(?:[^{}]|\{[^}]*\})*\})+\}/,
                    lookbehind: !0,
                    inside: {
                        "interpolation-punctuation": {
                            pattern: /^\$\{|\}$/,
                            alias: "punctuation"
                        },
                        rest: s.languages.javascript
                    }
                },
                string: /[\s\S]+/
            }
        },
        "string-property": {
            pattern: /((?:^|[,{])[ \t]*)(["'])(?:\\(?:\r\n|[\s\S])|(?!\2)[^\\\r\n])*\2(?=\s*:)/m,
            lookbehind: !0,
            greedy: !0,
            alias: "property"
        }
    });
    s.languages.insertBefore("javascript", "operator", {
        "literal-property": {
            pattern: /((?:^|[,{])[ \t]*)(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*:)/m,
            lookbehind: !0,
            alias: "property"
        }
    });
    s.languages.markup && (s.languages.markup.tag.addInlined("script", "javascript"), s.languages.markup.tag.addAttribute(/on(?:abort|blur|change|click|composition(?:end|start|update)|dblclick|error|focus(?:in|out)?|key(?:down|up)|load|mouse(?:down|enter|leave|move|out|over|up)|reset|resize|scroll|select|slotchange|submit|unload|wheel)/.source, "javascript"));
    s.languages.js = s.languages.javascript;
    (function() {
        if (typeof s > "u" || typeof document > "u") return;
        Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector);
        var o = "Loading\u2026", c = function(h, d) {
            return "\u2716 Error " + h + " while fetching file: " + d;
        }, p = "\u2716 Error: File does not exist or is empty", F = {
            js: "javascript",
            py: "python",
            rb: "ruby",
            ps1: "powershell",
            psm1: "powershell",
            sh: "bash",
            bat: "batch",
            h: "c",
            tex: "latex"
        }, i = "data-src-status", b = "loading", $ = "loaded", C = "failed", _ = "pre[data-src]:not([" + i + '="' + $ + '"]):not([' + i + '="' + b + '"])';
        function S(h, d, v) {
            var a = new XMLHttpRequest;
            a.open("GET", h, !0), a.onreadystatechange = function() {
                a.readyState == 4 && (a.status < 400 && a.responseText ? d(a.responseText) : a.status >= 400 ? v(c(a.status, a.statusText)) : v(p));
            }, a.send(null);
        }
        function O(h) {
            var d = /^\s*(\d+)\s*(?:(,)\s*(?:(\d+)\s*)?)?$/.exec(h || "");
            if (d) {
                var v = Number(d[1]), a = d[2], e = d[3];
                return a ? e ? [
                    v,
                    Number(e)
                ] : [
                    v,
                    void 0
                ] : [
                    v,
                    v
                ];
            }
        }
        s.hooks.add("before-highlightall", function(h) {
            h.selector += ", " + _;
        }), s.hooks.add("before-sanity-check", function(h) {
            var d = h.element;
            if (d.matches(_)) {
                h.code = "", d.setAttribute(i, b);
                var v = d.appendChild(document.createElement("CODE"));
                v.textContent = o;
                var a = d.getAttribute("data-src"), e = h.language;
                if (e === "none") {
                    var t = (/\.(\w+)$/.exec(a) || [
                        ,
                        "none"
                    ])[1];
                    e = F[t] || t;
                }
                s.util.setLanguage(v, e), s.util.setLanguage(d, e);
                var n = s.plugins.autoloader;
                n && n.loadLanguages(e), S(a, function(r) {
                    d.setAttribute(i, $);
                    var l = O(d.getAttribute("data-range"));
                    if (l) {
                        var g = r.split(/\r\n?|\n/g), u = l[0], f = l[1] == null ? g.length : l[1];
                        u < 0 && (u += g.length), u = Math.max(0, Math.min(u - 1, g.length)), f < 0 && (f += g.length), f = Math.max(0, Math.min(f, g.length)), r = g.slice(u, f).join(`
`), d.hasAttribute("data-start") || d.setAttribute("data-start", String(u + 1));
                    }
                    v.textContent = r, s.highlightElement(v);
                }, function(r) {
                    d.setAttribute(i, C), v.textContent = r;
                });
            }
        }), s.plugins.fileHighlight = {
            highlight: function(d) {
                for(var v = (d || document).querySelectorAll(_), a = 0, e; e = v[a++];)s.highlightElement(e);
            }
        };
        var L = !1;
        s.fileHighlight = function() {
            L || (console.warn("Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead."), L = !0), s.plugins.fileHighlight.highlight.apply(this, arguments);
        };
    })();
});
var ue = ie(W()), { default: X , ...le } = ue;
var m = Object.create;
var d = Object.defineProperty;
var c = Object.getOwnPropertyDescriptor;
var k = Object.getOwnPropertyNames;
var g = Object.getPrototypeOf, P = Object.prototype.hasOwnProperty;
var C = (r, n)=>()=>(n || r((n = {
            exports: {}
        }).exports, n), n.exports);
var E = (r, n, p, e)=>{
    if (n && typeof n == "object" || typeof n == "function") for (let s of k(n))!P.call(r, s) && s !== p && d(r, s, {
        get: ()=>n[s],
        enumerable: !(e = c(n, s)) || e.enumerable
    });
    return r;
};
var M = (r, n, p)=>(p = r != null ? m(g(r)) : {}, E(n || !r || !r.__esModule ? d(p, "default", {
        value: r,
        enumerable: !0
    }) : p, r));
var l = C(()=>{
    (function() {
        typeof Prism > "u" || typeof document > "u" || !document.createRange || (Prism.plugins.KeepMarkup = !0, Prism.hooks.add("before-highlight", function(r) {
            if (!r.element.children.length || !Prism.util.isActive(r.element, "keep-markup", !0)) return;
            var n = Prism.util.isActive(r.element, "drop-tokens", !1);
            function p(o) {
                return !(n && o.nodeName.toLowerCase() === "span" && o.classList.contains("token"));
            }
            var e = 0, s = [];
            function f(o) {
                if (!p(o)) {
                    i(o);
                    return;
                }
                var t = {
                    element: o,
                    posOpen: e
                };
                s.push(t), i(o), t.posClose = e;
            }
            function i(o) {
                for(var t = 0, h = o.childNodes.length; t < h; t++){
                    var u = o.childNodes[t];
                    u.nodeType === 1 ? f(u) : u.nodeType === 3 && (e += u.data.length);
                }
            }
            i(r.element), s.length && (r.keepMarkup = s);
        }), Prism.hooks.add("after-highlight", function(r) {
            if (r.keepMarkup && r.keepMarkup.length) {
                var n = function(p, e) {
                    for(var s = 0, f = p.childNodes.length; s < f; s++){
                        var i = p.childNodes[s];
                        if (i.nodeType === 1) {
                            if (!n(i, e)) return !1;
                        } else i.nodeType === 3 && (!e.nodeStart && e.pos + i.data.length > e.node.posOpen && (e.nodeStart = i, e.nodeStartPos = e.node.posOpen - e.pos), e.nodeStart && e.pos + i.data.length >= e.node.posClose && (e.nodeEnd = i, e.nodeEndPos = e.node.posClose - e.pos), e.pos += i.data.length);
                        if (e.nodeStart && e.nodeEnd) {
                            var o = document.createRange();
                            return o.setStart(e.nodeStart, e.nodeStartPos), o.setEnd(e.nodeEnd, e.nodeEndPos), e.node.element.innerHTML = "", e.node.element.appendChild(o.extractContents()), o.insertNode(e.node.element), o.detach(), !1;
                        }
                    }
                    return !0;
                };
                r.keepMarkup.forEach(function(p) {
                    n(r.element, {
                        node: p,
                        pos: 0
                    });
                }), r.highlightedCode = r.element.innerHTML;
            }
        }));
    })();
});
var T = M(l()), { default: a , ...y } = T;
document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('pre code').forEach((el)=>{
        const html = el.innerHTML;
        const lines = html.split("\n");
        const minSpaces = lines.filter((line)=>line.trim() !== "").reduce((acc, line)=>Math.min(line.search(/\S|$/), acc), Infinity);
        el.innerHTML = lines.map((line)=>line.substring(minSpaces)).join("\n").trim();
    });
});
const reactElementNameChange = (event)=>{
    const componentName = event.target.closest(".component-name-edit");
    if (componentName == null) {
        return false;
    }
    const newText = componentName.textContent;
    document.body.querySelectorAll(".component-name-ref").forEach((ref)=>ref.textContent = newText);
    return true;
};
const reactUIModeChange = (event)=>{
    const uiMode = event.target.closest(".example .ui-mode-edit");
    if (uiMode == null) {
        return false;
    }
    const uiModeText = uiMode.textContent;
    const example = uiMode.closest(".example");
    example?.querySelectorAll("color-wheel").forEach((ref)=>ref.style.setProperty("--ui-mode", `"${uiModeText}"`));
    return true;
};
const reactInnerRadiusChange = (event)=>{
    const innerRadius = event.target.closest(".example .inner-radius-edit");
    if (innerRadius == null) {
        return false;
    }
    const innerRadiusText = innerRadius.textContent;
    const example = innerRadius.closest(".example");
    example?.querySelectorAll("color-wheel").forEach((ref)=>ref.style.setProperty("--color-wheel--inner-radius", `${innerRadiusText}%`));
    return true;
};
const reactLightnessChange = (event)=>{
    const lightness = event.target.closest(".example .lightness-edit");
    if (lightness == null) {
        return false;
    }
    const lightnessText = lightness.textContent;
    const example = lightness.closest(".example");
    example?.querySelectorAll("color-wheel").forEach((ref)=>ref.setAttribute("lightness", lightnessText ?? ""));
    return true;
};
const reactValueChange = (event)=>{
    const value = event.target.closest(".example .value-edit");
    if (value == null) {
        return false;
    }
    const valueText = value.textContent;
    const example = value.closest(".example");
    example?.querySelectorAll("color-wheel").forEach((ref)=>ref.setAttribute("value", valueText ?? ""));
    return true;
};
document.body.addEventListener("input", (event)=>{
    reactElementNameChange(event) || reactUIModeChange(event) || reactLightnessChange(event) || reactValueChange(event) || reactInnerRadiusChange(event);
});
const exampleCode = (strings, ...expr)=>{
    let statement = strings[0];
    for(let i = 0; i < expr.length; i++){
        statement += String(expr[i]).replace(/</g, "&lt").replaceAll("{{elementName}}", '<span class="component-name-ref">color-wheel</span>').replace(/{{([^:]+):ui-mode}}/, '<span contenteditable="true" class="ui-mode-edit">$1</span>').replace(/{{([^:]+):inner-radius}}/, '<span contenteditable="true" class="inner-radius-edit">$1</span>').replace(/{{([^:]+):lightness}}/, '<span contenteditable="true" class="lightness-edit">$1</span>').replace(/{{([^:]+):value}}/, '<span contenteditable="true" class="value-edit">$1</span>');
        statement += strings[i + 1];
    }
    return statement;
};
document.body.querySelectorAll("script.html-example").forEach((element)=>{
    element.outerHTML = exampleCode`<pre><code class="language-markup keep-markup">${dedent(element.innerHTML)}</code></pre>`;
});
document.body.querySelectorAll("script.css-example").forEach((element)=>{
    element.outerHTML = exampleCode`<pre><code class="language-css keep-markup">${dedent(element.innerHTML)}</code></pre>`;
});

