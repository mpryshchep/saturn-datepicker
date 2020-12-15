(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/cdk/platform'), require('@angular/core'), require('rxjs'), require('@angular/cdk/a11y'), require('@angular/cdk/overlay'), require('@angular/cdk/portal'), require('@angular/common'), require('@angular/material/button'), require('@angular/material/dialog'), require('@angular/cdk/keycodes'), require('@angular/cdk/bidi'), require('rxjs/operators'), require('@angular/cdk/coercion'), require('@angular/material/core'), require('@angular/animations'), require('@angular/forms'), require('@angular/material/form-field'), require('@angular/material/input')) :
    typeof define === 'function' && define.amd ? define('saturn-datepicker', ['exports', '@angular/cdk/platform', '@angular/core', 'rxjs', '@angular/cdk/a11y', '@angular/cdk/overlay', '@angular/cdk/portal', '@angular/common', '@angular/material/button', '@angular/material/dialog', '@angular/cdk/keycodes', '@angular/cdk/bidi', 'rxjs/operators', '@angular/cdk/coercion', '@angular/material/core', '@angular/animations', '@angular/forms', '@angular/material/form-field', '@angular/material/input'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['saturn-datepicker'] = {}, global.ng.cdk.platform, global.ng.core, global.rxjs, global.ng.cdk.a11y, global.ng.cdk.overlay, global.ng.cdk.portal, global.ng.common, global.ng.material.button, global.ng.material.dialog, global.ng.cdk.keycodes, global.ng.cdk.bidi, global.rxjs.operators, global.ng.cdk.coercion, global.ng.material.core, global.ng.animations, global.ng.forms, global.ng.material.formField, global.ng.material.input));
}(this, (function (exports, platform, i0, rxjs, a11y, overlay, portal, common, button, dialog, keycodes, bidi, operators, coercion, core, animations, forms, formField, input) { 'use strict';

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** InjectionToken for datepicker that can be used to override default locale code. */
    var MAT_DATE_LOCALE = new i0.InjectionToken('MAT_DATE_LOCALE', {
        providedIn: 'root',
        factory: MAT_DATE_LOCALE_FACTORY,
    });
    /** @docs-private */
    function MAT_DATE_LOCALE_FACTORY() {
        return i0.inject(i0.LOCALE_ID);
    }
    /**
     * No longer needed since MAT_DATE_LOCALE has been changed to a scoped injectable.
     * If you are importing and providing this in your code you can simply remove it.
     * @deprecated
     * @breaking-change 8.0.0
     */
    var MAT_DATE_LOCALE_PROVIDER = { provide: MAT_DATE_LOCALE, useExisting: i0.LOCALE_ID };
    /** Adapts type `D` to be usable as a date by cdk-based components that work with dates. */
    var DateAdapter = /** @class */ (function () {
        function DateAdapter() {
            this._localeChanges = new rxjs.Subject();
        }
        Object.defineProperty(DateAdapter.prototype, "localeChanges", {
            /** A stream that emits when the locale changes. */
            get: function () { return this._localeChanges; },
            enumerable: false,
            configurable: true
        });
        /**
         * Attempts to deserialize a value to a valid date object. This is different from parsing in that
         * deserialize should only accept non-ambiguous, locale-independent formats (e.g. a ISO 8601
         * string). The default implementation does not allow any deserialization, it simply checks that
         * the given value is already a valid date object or null. The `<sat-datepicker>` will call this
         * method on all of its `@Input()` properties that accept dates. It is therefore possible to
         * support passing values from your backend directly to these properties by overriding this method
         * to also deserialize the format used by your backend.
         * @param value The value to be deserialized into a date object.
         * @returns The deserialized date object, either a valid date, null if the value can be
         *     deserialized into a null date (e.g. the empty string), or an invalid date.
         */
        DateAdapter.prototype.deserialize = function (value) {
            if (value == null || this.isDateInstance(value) && this.isValid(value)) {
                return value;
            }
            return this.invalid();
        };
        /**
         * Sets the locale used for all dates.
         * @param locale The new locale.
         */
        DateAdapter.prototype.setLocale = function (locale) {
            this.locale = locale;
            this._localeChanges.next();
        };
        /**
         * Compares two dates.
         * @param first The first date to compare.
         * @param second The second date to compare.
         * @returns 0 if the dates are equal, a number less than 0 if the first date is earlier,
         *     a number greater than 0 if the first date is later.
         */
        DateAdapter.prototype.compareDate = function (first, second) {
            return this.getYear(first) - this.getYear(second) ||
                this.getMonth(first) - this.getMonth(second) ||
                this.getDate(first) - this.getDate(second);
        };
        /**
         * Checks if two dates are equal.
         * @param first The first date to check.
         * @param second The second date to check.
         * @returns Whether the two dates are equal.
         *     Null dates are considered equal to other null dates.
         */
        DateAdapter.prototype.sameDate = function (first, second) {
            if (first && second) {
                var firstValid = this.isValid(first);
                var secondValid = this.isValid(second);
                if (firstValid && secondValid) {
                    return !this.compareDate(first, second);
                }
                return firstValid == secondValid;
            }
            return first == second;
        };
        /**
         * Clamp the given date between min and max dates.
         * @param date The date to clamp.
         * @param min The minimum value to allow. If null or omitted no min is enforced.
         * @param max The maximum value to allow. If null or omitted no max is enforced.
         * @returns `min` if `date` is less than `min`, `max` if date is greater than `max`,
         *     otherwise `date`.
         */
        DateAdapter.prototype.clampDate = function (date, min, max) {
            if (min && this.compareDate(date, min) < 0) {
                return min;
            }
            if (max && this.compareDate(date, max) > 0) {
                return max;
            }
            return date;
        };
        return DateAdapter;
    }());

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var MAT_DATE_FORMATS = new i0.InjectionToken('mat-date-formats');

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (b.hasOwnProperty(p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    function __createBinding(o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    }
    function __exportStar(m, exports) {
        for (var p in m)
            if (p !== "default" && !exports.hasOwnProperty(p))
                exports[p] = m[p];
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    ;
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (Object.hasOwnProperty.call(mod, k))
                    result[k] = mod[k];
        result.default = mod;
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    // TODO(mmalerba): Remove when we no longer support safari 9.
    /** Whether the browser supports the Intl API. */
    var SUPPORTS_INTL_API;
    // We need a try/catch around the reference to `Intl`, because accessing it in some cases can
    // cause IE to throw. These cases are tied to particular versions of Windows and can happen if
    // the consumer is providing a polyfilled `Map`. See:
    // https://github.com/Microsoft/ChakraCore/issues/3189
    // https://github.com/angular/components/issues/15687
    try {
        SUPPORTS_INTL_API = typeof Intl != 'undefined';
    }
    catch (_a) {
        SUPPORTS_INTL_API = false;
    }
    /** The default month names to use if Intl API is not available. */
    var DEFAULT_MONTH_NAMES = {
        'long': [
            'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September',
            'October', 'November', 'December'
        ],
        'short': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        'narrow': ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']
    };
    var ɵ0 = function (i) { return String(i + 1); };
    /** The default date names to use if Intl API is not available. */
    var DEFAULT_DATE_NAMES = range(31, ɵ0);
    /** The default day of the week names to use if Intl API is not available. */
    var DEFAULT_DAY_OF_WEEK_NAMES = {
        'long': ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        'short': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        'narrow': ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    };
    /** First day of week according locale.
     * Taken form moment.js source code https://github.com/moment/moment/tree/develop/src/locale
     */
    var FIRST_DAY_OF_WEEK = {
        af: 1, ar: 6, 'ar-ly': 6, 'ar-ma': 6, 'ar-tn': 1, az: 1, be: 1, bg: 1, bm: 1, br: 1, bs: 1, ca: 1, cs: 1, cv: 1,
        cy: 1, da: 1, de: 1, 'de-at': 1, 'de-ch': 1, el: 1, 'en-au': 1, 'en-gb': 1, 'en-ie': 1, 'en-nz': 1, eo: 1,
        es: 1, 'es-do': 1, et: 1, eu: 1, fa: 6, fi: 1, fo: 1, fr: 1, 'fr-ch': 1, fy: 1, gd: 1, gl: 1, 'gom-latn': 1,
        hr: 1, hu: 1, 'hy-am': 1, id: 1, is: 1, it: 1, jv: 1, ka: 1, kk: 1, km: 1, ky: 1, lb: 1, lt: 1, lv: 1, me: 1,
        mi: 1, mk: 1, ms: 1, 'ms-my': 1, mt: 1, my: 1, nb: 1, nl: 1, 'nl-be': 1, nn: 1, pl: 1, pt: 1, 'pt-BR': 0, ro: 1, ru: 1,
        sd: 1, se: 1, sk: 1, sl: 1, sq: 1, sr: 1, 'sr-cyrl': 1, ss: 1, sv: 1, sw: 1, 'tet': 1, tg: 1, 'tl-ph': 1,
        'tlh': 1, tr: 1, 'tzl': 1, 'tzm': 6, 'tzm-latn': 6, 'ug-cn': 1, uk: 1, ur: 1, uz: 1, 'uz-latn': 1, vi: 1,
        'x-pseudo': 1, yo: 1, 'zh-cn': 1,
    };
    /**
     * Matches strings that have the form of a valid RFC 3339 string
     * (https://tools.ietf.org/html/rfc3339). Note that the string may not actually be a valid date
     * because the regex will match strings an with out of bounds month, date, etc.
     */
    var ISO_8601_REGEX = /^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|(?:(?:\+|-)\d{2}:\d{2}))?)?$/;
    /** Creates an array and fills it with values. */
    function range(length, valueFunction) {
        var valuesArray = Array(length);
        for (var i = 0; i < length; i++) {
            valuesArray[i] = valueFunction(i);
        }
        return valuesArray;
    }
    /** Adapts the native JS Date for use with cdk-based components that work with dates. */
    var NativeDateAdapter = /** @class */ (function (_super) {
        __extends(NativeDateAdapter, _super);
        function NativeDateAdapter(matDateLocale, platform) {
            var _this = _super.call(this) || this;
            /**
             * Whether to use `timeZone: 'utc'` with `Intl.DateTimeFormat` when formatting dates.
             * Without this `Intl.DateTimeFormat` sometimes chooses the wrong timeZone, which can throw off
             * the result. (e.g. in the en-US locale `new Date(1800, 7, 14).toLocaleDateString()`
             * will produce `'8/13/1800'`.
             *
             * TODO(mmalerba): drop this variable. It's not being used in the code right now. We're now
             * getting the string representation of a Date object from it's utc representation. We're keeping
             * it here for sometime, just for precaution, in case we decide to revert some of these changes
             * though.
             */
            _this.useUtcForDisplay = true;
            _super.prototype.setLocale.call(_this, matDateLocale);
            // IE does its own time zone correction, so we disable this on IE.
            _this.useUtcForDisplay = !platform.TRIDENT;
            _this._clampDate = platform.TRIDENT || platform.EDGE;
            return _this;
        }
        NativeDateAdapter.prototype.getYear = function (date) {
            return date.getFullYear();
        };
        NativeDateAdapter.prototype.getMonth = function (date) {
            return date.getMonth();
        };
        NativeDateAdapter.prototype.getDate = function (date) {
            return date.getDate();
        };
        NativeDateAdapter.prototype.getDayOfWeek = function (date) {
            return date.getDay();
        };
        NativeDateAdapter.prototype.getMonthNames = function (style) {
            var _this = this;
            if (SUPPORTS_INTL_API) {
                var dtf_1 = new Intl.DateTimeFormat(this.locale, { month: style, timeZone: 'utc' });
                return range(12, function (i) { return _this._stripDirectionalityCharacters(_this._format(dtf_1, new Date(2017, i, 1))); });
            }
            return DEFAULT_MONTH_NAMES[style];
        };
        NativeDateAdapter.prototype.getDateNames = function () {
            var _this = this;
            if (SUPPORTS_INTL_API) {
                var dtf_2 = new Intl.DateTimeFormat(this.locale, { day: 'numeric', timeZone: 'utc' });
                return range(31, function (i) { return _this._stripDirectionalityCharacters(_this._format(dtf_2, new Date(2017, 0, i + 1))); });
            }
            return DEFAULT_DATE_NAMES;
        };
        NativeDateAdapter.prototype.getDayOfWeekNames = function (style) {
            var _this = this;
            if (SUPPORTS_INTL_API) {
                var dtf_3 = new Intl.DateTimeFormat(this.locale, { weekday: style, timeZone: 'utc' });
                return range(7, function (i) { return _this._stripDirectionalityCharacters(_this._format(dtf_3, new Date(2017, 0, i + 1))); });
            }
            return DEFAULT_DAY_OF_WEEK_NAMES[style];
        };
        NativeDateAdapter.prototype.getYearName = function (date) {
            if (SUPPORTS_INTL_API) {
                var dtf = new Intl.DateTimeFormat(this.locale, { year: 'numeric', timeZone: 'utc' });
                return this._stripDirectionalityCharacters(this._format(dtf, date));
            }
            return String(this.getYear(date));
        };
        NativeDateAdapter.prototype.getFirstDayOfWeek = function () {
            // We can't tell using native JS Date what the first day of the week is.
            // Sometimes people use excess language definition, e.g. ru-RU,
            // so we use fallback to two-letter language code
            var locale = this.locale.toLowerCase();
            return FIRST_DAY_OF_WEEK[locale] || FIRST_DAY_OF_WEEK[locale.substr(0, 2)] || 0;
        };
        NativeDateAdapter.prototype.getNumDaysInMonth = function (date) {
            return this.getDate(this._createDateWithOverflow(this.getYear(date), this.getMonth(date) + 1, 0));
        };
        NativeDateAdapter.prototype.clone = function (date) {
            return new Date(date.getTime());
        };
        NativeDateAdapter.prototype.createDate = function (year, month, date) {
            // Check for invalid month and date (except upper bound on date which we have to check after
            // creating the Date).
            if (month < 0 || month > 11) {
                throw Error("Invalid month index \"" + month + "\". Month index has to be between 0 and 11.");
            }
            if (date < 1) {
                throw Error("Invalid date \"" + date + "\". Date has to be greater than 0.");
            }
            var result = this._createDateWithOverflow(year, month, date);
            // Check that the date wasn't above the upper bound for the month, causing the month to overflow
            if (result.getMonth() != month) {
                throw Error("Invalid date \"" + date + "\" for month with index \"" + month + "\".");
            }
            return result;
        };
        NativeDateAdapter.prototype.today = function () {
            return new Date();
        };
        NativeDateAdapter.prototype.parse = function (value) {
            // We have no way using the native JS Date to set the parse format or locale, so we ignore these
            // parameters.
            if (typeof value == 'number') {
                return new Date(value);
            }
            return value ? new Date(Date.parse(value)) : null;
        };
        NativeDateAdapter.prototype.format = function (date, displayFormat) {
            if (!this.isValid(date)) {
                throw Error('NativeDateAdapter: Cannot format invalid date.');
            }
            if (SUPPORTS_INTL_API) {
                // On IE and Edge the i18n API will throw a hard error that can crash the entire app
                // if we attempt to format a date whose year is less than 1 or greater than 9999.
                if (this._clampDate && (date.getFullYear() < 1 || date.getFullYear() > 9999)) {
                    date = this.clone(date);
                    date.setFullYear(Math.max(1, Math.min(9999, date.getFullYear())));
                }
                displayFormat = Object.assign(Object.assign({}, displayFormat), { timeZone: 'utc' });
                var dtf = new Intl.DateTimeFormat(this.locale, displayFormat);
                return this._stripDirectionalityCharacters(this._format(dtf, date));
            }
            return this._stripDirectionalityCharacters(date.toDateString());
        };
        NativeDateAdapter.prototype.addCalendarYears = function (date, years) {
            return this.addCalendarMonths(date, years * 12);
        };
        NativeDateAdapter.prototype.addCalendarMonths = function (date, months) {
            var newDate = this._createDateWithOverflow(this.getYear(date), this.getMonth(date) + months, this.getDate(date));
            // It's possible to wind up in the wrong month if the original month has more days than the new
            // month. In this case we want to go to the last day of the desired month.
            // Note: the additional + 12 % 12 ensures we end up with a positive number, since JS % doesn't
            // guarantee this.
            if (this.getMonth(newDate) != ((this.getMonth(date) + months) % 12 + 12) % 12) {
                newDate = this._createDateWithOverflow(this.getYear(newDate), this.getMonth(newDate), 0);
            }
            return newDate;
        };
        NativeDateAdapter.prototype.addCalendarDays = function (date, days) {
            return this._createDateWithOverflow(this.getYear(date), this.getMonth(date), this.getDate(date) + days);
        };
        NativeDateAdapter.prototype.toIso8601 = function (date) {
            return [
                date.getUTCFullYear(),
                this._2digit(date.getUTCMonth() + 1),
                this._2digit(date.getUTCDate())
            ].join('-');
        };
        /**
         * Returns the given value if given a valid Date or null. Deserializes valid ISO 8601 strings
         * (https://www.ietf.org/rfc/rfc3339.txt) into valid Dates and empty string into null. Returns an
         * invalid date for all other values.
         */
        NativeDateAdapter.prototype.deserialize = function (value) {
            if (typeof value === 'string') {
                if (!value) {
                    return null;
                }
                // The `Date` constructor accepts formats other than ISO 8601, so we need to make sure the
                // string is the right format first.
                if (ISO_8601_REGEX.test(value)) {
                    var date = new Date(value);
                    if (this.isValid(date)) {
                        return date;
                    }
                }
            }
            return _super.prototype.deserialize.call(this, value);
        };
        NativeDateAdapter.prototype.isDateInstance = function (obj) {
            return obj instanceof Date;
        };
        NativeDateAdapter.prototype.isValid = function (date) {
            return !isNaN(date.getTime());
        };
        NativeDateAdapter.prototype.invalid = function () {
            return new Date(NaN);
        };
        /** Creates a date but allows the month and date to overflow. */
        NativeDateAdapter.prototype._createDateWithOverflow = function (year, month, date) {
            var result = new Date(year, month, date);
            // We need to correct for the fact that JS native Date treats years in range [0, 99] as
            // abbreviations for 19xx.
            if (year >= 0 && year < 100) {
                result.setFullYear(this.getYear(result) - 1900);
            }
            return result;
        };
        /**
         * Pads a number to make it two digits.
         * @param n The number to pad.
         * @returns The padded number.
         */
        NativeDateAdapter.prototype._2digit = function (n) {
            return ('00' + n).slice(-2);
        };
        /**
         * Strip out unicode LTR and RTL characters. Edge and IE insert these into formatted dates while
         * other browsers do not. We remove them to make output consistent and because they interfere with
         * date parsing.
         * @param str The string to strip direction characters from.
         * @returns The stripped string.
         */
        NativeDateAdapter.prototype._stripDirectionalityCharacters = function (str) {
            return str.replace(/[\u200e\u200f]/g, '');
        };
        /**
         * When converting Date object to string, javascript built-in functions may return wrong
         * results because it applies its internal DST rules. The DST rules around the world change
         * very frequently, and the current valid rule is not always valid in previous years though.
         * We work around this problem building a new Date object which has its internal UTC
         * representation with the local date and time.
         * @param dtf Intl.DateTimeFormat object, containg the desired string format. It must have
         *    timeZone set to 'utc' to work fine.
         * @param date Date from which we want to get the string representation according to dtf
         * @returns A Date object with its UTC representation based on the passed in date info
         */
        NativeDateAdapter.prototype._format = function (dtf, date) {
            var d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds(), date.getMilliseconds()));
            return dtf.format(d);
        };
        return NativeDateAdapter;
    }(DateAdapter));
    NativeDateAdapter.decorators = [
        { type: i0.Injectable }
    ];
    NativeDateAdapter.ctorParameters = function () { return [
        { type: String, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [MAT_DATE_LOCALE,] }] },
        { type: platform.Platform }
    ]; };

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var MAT_NATIVE_DATE_FORMATS = {
        parse: {
            dateInput: null,
        },
        display: {
            dateInput: { year: 'numeric', month: 'numeric', day: 'numeric' },
            monthYearLabel: { year: 'numeric', month: 'short' },
            dateA11yLabel: { year: 'numeric', month: 'long', day: 'numeric' },
            monthYearA11yLabel: { year: 'numeric', month: 'long' },
        }
    };

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var NativeDateModule = /** @class */ (function () {
        function NativeDateModule() {
        }
        return NativeDateModule;
    }());
    NativeDateModule.decorators = [
        { type: i0.NgModule, args: [{
                    imports: [platform.PlatformModule],
                    providers: [
                        { provide: DateAdapter, useClass: NativeDateAdapter },
                    ],
                },] }
    ];
    var ɵ0$1 = MAT_NATIVE_DATE_FORMATS;
    var SatNativeDateModule = /** @class */ (function () {
        function SatNativeDateModule() {
        }
        return SatNativeDateModule;
    }());
    SatNativeDateModule.decorators = [
        { type: i0.NgModule, args: [{
                    imports: [NativeDateModule],
                    providers: [{ provide: MAT_DATE_FORMATS, useValue: ɵ0$1 }],
                },] }
    ];

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** @docs-private */
    function createMissingDateImplError(provider) {
        return Error("SatDatepicker: No provider found for " + provider + ". You must import one of the following " +
            "modules at your application root: SatNativeDateModule, MatMomentDateModule, or provide a " +
            "custom implementation.");
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Datepicker data that requires internationalization. */
    var SatDatepickerIntl = /** @class */ (function () {
        function SatDatepickerIntl() {
            /**
             * Stream that emits whenever the labels here are changed. Use this to notify
             * components if the labels have changed after initialization.
             */
            this.changes = new rxjs.Subject();
            /** A label for the calendar popup (used by screen readers). */
            this.calendarLabel = 'Calendar';
            /** A label for the button used to open the calendar popup (used by screen readers). */
            this.openCalendarLabel = 'Open calendar';
            /** A label for the previous month button (used by screen readers). */
            this.prevMonthLabel = 'Previous month';
            /** A label for the next month button (used by screen readers). */
            this.nextMonthLabel = 'Next month';
            /** A label for the previous year button (used by screen readers). */
            this.prevYearLabel = 'Previous year';
            /** A label for the next year button (used by screen readers). */
            this.nextYearLabel = 'Next year';
            /** A label for the previous multi-year button (used by screen readers). */
            this.prevMultiYearLabel = 'Previous 20 years';
            /** A label for the next multi-year button (used by screen readers). */
            this.nextMultiYearLabel = 'Next 20 years';
            /** A label for the 'switch to month view' button (used by screen readers). */
            this.switchToMonthViewLabel = 'Choose date';
            /** A label for the 'switch to year view' button (used by screen readers). */
            this.switchToMultiYearViewLabel = 'Choose month and year';
        }
        return SatDatepickerIntl;
    }());
    SatDatepickerIntl.ɵprov = i0.ɵɵdefineInjectable({ factory: function SatDatepickerIntl_Factory() { return new SatDatepickerIntl(); }, token: SatDatepickerIntl, providedIn: "root" });
    SatDatepickerIntl.decorators = [
        { type: i0.Injectable, args: [{ providedIn: 'root' },] }
    ];

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * An internal class that represents the data corresponding to a single calendar cell.
     * @docs-private
     */
    var SatCalendarCell = /** @class */ (function () {
        function SatCalendarCell(value, displayValue, ariaLabel, enabled, cssClasses) {
            this.value = value;
            this.displayValue = displayValue;
            this.ariaLabel = ariaLabel;
            this.enabled = enabled;
            this.cssClasses = cssClasses;
        }
        return SatCalendarCell;
    }());
    /**
     * An internal component used to display calendar data in a table.
     * @docs-private
     */
    var SatCalendarBody = /** @class */ (function () {
        function SatCalendarBody(_elementRef, _ngZone) {
            this._elementRef = _elementRef;
            this._ngZone = _ngZone;
            /** Enables datepicker MouseOver effect on range mode */
            this.rangeHoverEffect = true;
            /** Whether to use date range selection behaviour.*/
            this.rangeMode = false;
            /** The number of columns in the table. */
            this.numCols = 7;
            /** The cell number of the active cell in the table. */
            this.activeCell = 0;
            /**
             * The aspect ratio (width / height) to use for the cells in the table. This aspect ratio will be
             * maintained even as the table resizes.
             */
            this.cellAspectRatio = 1;
            /** Emits when a new value is selected. */
            this.selectedValueChange = new i0.EventEmitter();
        }
        SatCalendarBody.prototype._cellClicked = function (cell) {
            if (cell.enabled) {
                this.selectedValueChange.emit(cell.value);
            }
        };
        SatCalendarBody.prototype._mouseOverCell = function (cell) {
            if (this.rangeHoverEffect) {
                this._cellOver = cell.value;
            }
        };
        SatCalendarBody.prototype.ngOnChanges = function (changes) {
            var columnChanges = changes['numCols'];
            var _a = this, rows = _a.rows, numCols = _a.numCols;
            if (changes['rows'] || columnChanges) {
                this._firstRowOffset = rows && rows.length && rows[0].length ? numCols - rows[0].length : 0;
            }
            if (changes['cellAspectRatio'] || columnChanges || !this._cellPadding) {
                this._cellPadding = 50 * this.cellAspectRatio / numCols + "%";
            }
            if (columnChanges || !this._cellWidth) {
                this._cellWidth = 100 / numCols + "%";
            }
            if (changes.activeCell) {
                // Only modify hovered cell variable when rangeHoverEffect is enabled
                if (this.rangeHoverEffect) {
                    this._cellOver = this.activeCell + 1;
                }
            }
        };
        SatCalendarBody.prototype._isActiveCell = function (rowIndex, colIndex) {
            var cellNumber = rowIndex * this.numCols + colIndex;
            // Account for the fact that the first row may not have as many cells.
            if (rowIndex) {
                cellNumber -= this._firstRowOffset;
            }
            return cellNumber == this.activeCell;
        };
        /** Whenever to mark cell as semi-selected (inside dates interval). */
        SatCalendarBody.prototype._isSemiSelected = function (date) {
            if (!this.rangeMode) {
                return false;
            }
            if (this.rangeFull) {
                return true;
            }
            /** Do not mark start and end of interval. */
            if (date === this.begin || date === this.end) {
                return false;
            }
            if (this.begin && !this.end) {
                return date > this.begin;
            }
            if (this.end && !this.begin) {
                return date < this.end;
            }
            return date > this.begin && date < this.end;
        };
        /** Whenever to mark cell as semi-selected before the second date is selected (between the begin cell and the hovered cell). */
        SatCalendarBody.prototype._isBetweenOverAndBegin = function (date) {
            if (!this._cellOver || !this.rangeMode || !this.beginSelected) {
                return false;
            }
            if (this.isBeforeSelected && !this.begin) {
                return date > this._cellOver;
            }
            if (this._cellOver > this.begin) {
                return date > this.begin && date < this._cellOver;
            }
            if (this._cellOver < this.begin) {
                return date < this.begin && date > this._cellOver;
            }
            return false;
        };
        /** Whenever to mark cell as begin of the range. */
        SatCalendarBody.prototype._isBegin = function (date) {
            if (this.rangeMode && this.beginSelected && this._cellOver) {
                if (this.isBeforeSelected && !this.begin) {
                    return this._cellOver === date;
                }
                else {
                    return (this.begin === date && !(this._cellOver < this.begin)) ||
                        (this._cellOver === date && this._cellOver < this.begin);
                }
            }
            return this.begin === date;
        };
        /** Whenever to mark cell as end of the range. */
        SatCalendarBody.prototype._isEnd = function (date) {
            if (this.rangeMode && this.beginSelected && this._cellOver) {
                if (this.isBeforeSelected && !this.begin) {
                    return false;
                }
                else {
                    return (this.end === date && !(this._cellOver > this.begin)) ||
                        (this._cellOver === date && this._cellOver > this.begin);
                }
            }
            return this.end === date;
        };
        /** Focuses the active cell after the microtask queue is empty. */
        SatCalendarBody.prototype._focusActiveCell = function () {
            var _this = this;
            this._ngZone.runOutsideAngular(function () {
                _this._ngZone.onStable.asObservable().pipe(operators.take(1)).subscribe(function () {
                    var activeCell = _this._elementRef.nativeElement.querySelector('.mat-calendar-body-active');
                    if (activeCell) {
                        activeCell.focus();
                    }
                });
            });
        };
        /** Whenever to highlight the target cell when selecting the second date in range mode */
        SatCalendarBody.prototype._previewCellOver = function (date) {
            return this._cellOver === date && this.rangeMode && this.beginSelected;
        };
        return SatCalendarBody;
    }());
    SatCalendarBody.decorators = [
        { type: i0.Component, args: [{
                    selector: '[sat-calendar-body]',
                    template: "<!--\r\n  If there's not enough space in the first row, create a separate label row. We mark this row as\r\n  aria-hidden because we don't want it to be read out as one of the weeks in the month.\r\n-->\r\n<tr *ngIf=\"_firstRowOffset < labelMinRequiredCells\" aria-hidden=\"true\">\r\n  <td class=\"mat-calendar-body-label\"\r\n      [attr.colspan]=\"numCols\"\r\n      [style.paddingTop]=\"_cellPadding\"\r\n      [style.paddingBottom]=\"_cellPadding\">\r\n    {{label}}\r\n  </td>\r\n</tr>\r\n\r\n<!-- Create the first row separately so we can include a special spacer cell. -->\r\n<tr *ngFor=\"let row of rows; let rowIndex = index\" role=\"row\">\r\n  <!--\r\n    We mark this cell as aria-hidden so it doesn't get read out as one of the days in the week.\r\n    The aspect ratio of the table cells is maintained by setting the top and bottom padding as a\r\n    percentage of the width (a variant of the trick described here:\r\n    https://www.w3schools.com/howto/howto_css_aspect_ratio.asp).\r\n  -->\r\n  <td *ngIf=\"rowIndex === 0 && _firstRowOffset\"\r\n      aria-hidden=\"true\"\r\n      class=\"mat-calendar-body-label\"\r\n      [attr.colspan]=\"_firstRowOffset\"\r\n      [style.paddingTop]=\"_cellPadding\"\r\n      [style.paddingBottom]=\"_cellPadding\">\r\n    {{_firstRowOffset >= labelMinRequiredCells ? label : ''}}\r\n  </td>\r\n  <td *ngFor=\"let item of row; let colIndex = index\"\r\n      role=\"gridcell\"\r\n      class=\"mat-calendar-body-cell\"\r\n      [ngClass]=\"item.cssClasses\"\r\n      [tabindex]=\"_isActiveCell(rowIndex, colIndex) ? 0 : -1\"\r\n      [class.mat-calendar-body-disabled]=\"!item.enabled\"\r\n      [class.mat-calendar-body-active]=\"_isActiveCell(rowIndex, colIndex)\"\r\n      [class.mat-calendar-body-begin-range]=\"_isBegin(item.value)\"\r\n      [class.mat-calendar-body-end-range]=\"_isEnd(item.value)\"\r\n      [class.mat-calendar-cell-semi-selected]=\"_isSemiSelected(item.value) || _isBetweenOverAndBegin(item.value)\"\r\n      [class.mat-calendar-cell-over]=\"_previewCellOver(item.value)\"\r\n      [attr.aria-label]=\"item.ariaLabel\"\r\n      [attr.aria-disabled]=\"!item.enabled || null\"\r\n      [attr.aria-selected]=\"selectedValue === item.value\"\r\n      (click)=\"_cellClicked(item)\"\r\n      (mouseover)=\"_mouseOverCell(item)\"\r\n      [style.width]=\"_cellWidth\"\r\n      [style.paddingTop]=\"_cellPadding\"\r\n      [style.paddingBottom]=\"_cellPadding\">\r\n    <div class=\"mat-calendar-body-cell-content\"\r\n         [class.mat-calendar-body-selected]=\"begin === item.value || end === item.value || selectedValue === item.value\"\r\n         [class.mat-calendar-body-semi-selected]=\"_isSemiSelected(item.value)\"\r\n         [class.mat-calendar-body-today]=\"todayValue === item.value\">\r\n      {{item.displayValue}}\r\n    </div>\r\n  </td>\r\n</tr>\r\n",
                    host: {
                        'class': 'mat-calendar-body',
                        'role': 'grid',
                        'aria-readonly': 'true'
                    },
                    exportAs: 'matCalendarBody',
                    encapsulation: i0.ViewEncapsulation.None,
                    changeDetection: i0.ChangeDetectionStrategy.OnPush,
                    styles: [".mat-calendar-body{min-width:224px}.mat-calendar-body-label{height:0;line-height:0;padding-left:4.71429%;padding-right:4.71429%;text-align:left}.mat-calendar-body-cell{cursor:pointer;height:0;line-height:0;outline:0;position:relative;text-align:center}.mat-calendar-body-disabled{cursor:default}.mat-calendar-body-cell-content{align-items:center;border-radius:999px;border-style:solid;border-width:1px;box-sizing:border-box;display:flex;height:90%;justify-content:center;left:5%;line-height:1;position:absolute;top:5%;width:90%}[dir=rtl] .mat-calendar-body-label{text-align:right}"]
                },] }
    ];
    SatCalendarBody.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: i0.NgZone }
    ]; };
    SatCalendarBody.propDecorators = {
        label: [{ type: i0.Input }],
        rangeHoverEffect: [{ type: i0.Input }],
        rows: [{ type: i0.Input }],
        todayValue: [{ type: i0.Input }],
        selectedValue: [{ type: i0.Input }],
        begin: [{ type: i0.Input }],
        end: [{ type: i0.Input }],
        beginSelected: [{ type: i0.Input }],
        isBeforeSelected: [{ type: i0.Input }],
        rangeFull: [{ type: i0.Input }],
        rangeMode: [{ type: i0.Input }],
        labelMinRequiredCells: [{ type: i0.Input }],
        numCols: [{ type: i0.Input }],
        activeCell: [{ type: i0.Input }],
        cellAspectRatio: [{ type: i0.Input }],
        selectedValueChange: [{ type: i0.Output }]
    };

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var DAYS_PER_WEEK = 7;
    /**
     * An internal component used to display a single month in the datepicker.
     * @docs-private
     */
    var SatMonthView = /** @class */ (function () {
        function SatMonthView(_changeDetectorRef, _dateFormats, _dateAdapter, _dir) {
            this._changeDetectorRef = _changeDetectorRef;
            this._dateFormats = _dateFormats;
            this._dateAdapter = _dateAdapter;
            this._dir = _dir;
            /** Allow selecting range of dates. */
            this.rangeMode = false;
            /** Enables datepicker MouseOver effect on range mode */
            this.rangeHoverEffect = true;
            /** Enables datepicker closing after selection */
            this.closeAfterSelection = true;
            /** Whenever full month is inside dates interval. */
            this._rangeFull = false;
            /** Emits when a new date is selected. */
            this.selectedChange = new i0.EventEmitter();
            /** Emits when any date is selected. */
            this._userSelection = new i0.EventEmitter();
            /** Emits when any date is activated. */
            this.activeDateChange = new i0.EventEmitter();
            if (!this._dateAdapter) {
                throw createMissingDateImplError('DateAdapter');
            }
            if (!this._dateFormats) {
                throw createMissingDateImplError('MAT_DATE_FORMATS');
            }
            this._activeDate = this._dateAdapter.today();
        }
        Object.defineProperty(SatMonthView.prototype, "beginDate", {
            /** Current start of interval. */
            get: function () { return this._beginDate; },
            set: function (value) {
                this._beginDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
                this.updateRangeSpecificValues();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatMonthView.prototype, "endDate", {
            /** Current end of interval. */
            get: function () { return this._endDate; },
            set: function (value) {
                this._endDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
                this.updateRangeSpecificValues();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatMonthView.prototype, "beginDateSelected", {
            /** Whenever user already selected start of dates interval. */
            set: function (value) { this._beginDateSelected = value; },
            enumerable: false,
            configurable: true
        });
        ;
        Object.defineProperty(SatMonthView.prototype, "activeDate", {
            /**
             * The date to display in this month view (everything other than the month and year is ignored).
             */
            get: function () { return this._activeDate; },
            set: function (value) {
                var oldActiveDate = this._activeDate;
                var validDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value)) || this._dateAdapter.today();
                this._activeDate = this._dateAdapter.clampDate(validDate, this.minDate, this.maxDate);
                if (!this._hasSameMonthAndYear(oldActiveDate, this._activeDate)) {
                    this._init();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatMonthView.prototype, "selected", {
            /** The currently selected date. */
            get: function () { return this._selected; },
            set: function (value) {
                this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
                this._selectedDate = this._getDateInCurrentMonth(this._selected);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatMonthView.prototype, "minDate", {
            /** The minimum selectable date. */
            get: function () { return this._minDate; },
            set: function (value) {
                this._minDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatMonthView.prototype, "maxDate", {
            /** The maximum selectable date. */
            get: function () { return this._maxDate; },
            set: function (value) {
                this._maxDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            },
            enumerable: false,
            configurable: true
        });
        SatMonthView.prototype.ngAfterContentInit = function () {
            this._init();
        };
        /** Handles when a new date is selected. */
        SatMonthView.prototype._dateSelected = function (date) {
            if (this.rangeMode) {
                var selectedYear = this._dateAdapter.getYear(this.activeDate);
                var selectedMonth = this._dateAdapter.getMonth(this.activeDate);
                var selectedDate = this._dateAdapter.createDate(selectedYear, selectedMonth, date);
                if (!this._beginDateSelected) { // At first click emit the same start and end of interval
                    this._beginDateSelected = selectedDate;
                    this.selectedChange.emit(selectedDate);
                }
                else {
                    this._beginDateSelected = null;
                    this.selectedChange.emit(selectedDate);
                    this._userSelection.emit();
                }
                this._createWeekCells();
                this.activeDate = selectedDate;
                this._focusActiveCell();
            }
            else if (this._selectedDate != date) {
                var selectedYear = this._dateAdapter.getYear(this.activeDate);
                var selectedMonth = this._dateAdapter.getMonth(this.activeDate);
                var selectedDate = this._dateAdapter.createDate(selectedYear, selectedMonth, date);
                this.selectedChange.emit(selectedDate);
                this._userSelection.emit();
                this._createWeekCells();
            }
        };
        /** Handles keydown events on the calendar body when calendar is in month view. */
        SatMonthView.prototype._handleCalendarBodyKeydown = function (event) {
            // TODO(mmalerba): We currently allow keyboard navigation to disabled dates, but just prevent
            // disabled ones from being selected. This may not be ideal, we should look into whether
            // navigation should skip over disabled dates, and if so, how to implement that efficiently.
            var oldActiveDate = this._activeDate;
            var isRtl = this._isRtl();
            switch (event.keyCode) {
                case keycodes.LEFT_ARROW:
                    this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, isRtl ? 1 : -1);
                    break;
                case keycodes.RIGHT_ARROW:
                    this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, isRtl ? -1 : 1);
                    break;
                case keycodes.UP_ARROW:
                    this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, -7);
                    break;
                case keycodes.DOWN_ARROW:
                    this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 7);
                    break;
                case keycodes.HOME:
                    this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, 1 - this._dateAdapter.getDate(this._activeDate));
                    break;
                case keycodes.END:
                    this.activeDate = this._dateAdapter.addCalendarDays(this._activeDate, (this._dateAdapter.getNumDaysInMonth(this._activeDate) -
                        this._dateAdapter.getDate(this._activeDate)));
                    break;
                case keycodes.PAGE_UP:
                    this.activeDate = event.altKey ?
                        this._dateAdapter.addCalendarYears(this._activeDate, -1) :
                        this._dateAdapter.addCalendarMonths(this._activeDate, -1);
                    break;
                case keycodes.PAGE_DOWN:
                    this.activeDate = event.altKey ?
                        this._dateAdapter.addCalendarYears(this._activeDate, 1) :
                        this._dateAdapter.addCalendarMonths(this._activeDate, 1);
                    break;
                case keycodes.ENTER:
                case keycodes.SPACE:
                    if (!this.dateFilter || this.dateFilter(this._activeDate)) {
                        this._dateSelected(this._dateAdapter.getDate(this._activeDate));
                        if (!this._beginDateSelected) {
                            this._userSelection.emit();
                        }
                        if (this._beginDateSelected || !this.closeAfterSelection) {
                            this._focusActiveCell();
                        }
                        // Prevent unexpected default actions such as form submission.
                        event.preventDefault();
                    }
                    return;
                default:
                    // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                    return;
            }
            if (this._dateAdapter.compareDate(oldActiveDate, this.activeDate)) {
                this.activeDateChange.emit(this.activeDate);
            }
            this._focusActiveCell();
            // Prevent unexpected default actions such as form submission.
            event.preventDefault();
        };
        /** Initializes this month view. */
        SatMonthView.prototype._init = function () {
            this.updateRangeSpecificValues();
            this._selectedDate = this._getDateInCurrentMonth(this.selected);
            this._todayDate = this._getDateInCurrentMonth(this._dateAdapter.today());
            this._monthLabel =
                this._dateAdapter.getMonthNames('short')[this._dateAdapter.getMonth(this.activeDate)]
                    .toLocaleUpperCase();
            var firstOfMonth = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), 1);
            this._firstWeekOffset =
                (DAYS_PER_WEEK + this._dateAdapter.getDayOfWeek(firstOfMonth) -
                    this._dateAdapter.getFirstDayOfWeek()) % DAYS_PER_WEEK;
            this._initWeekdays();
            this._createWeekCells();
            this._changeDetectorRef.markForCheck();
        };
        /** Focuses the active cell after the microtask queue is empty. */
        SatMonthView.prototype._focusActiveCell = function () {
            this._matCalendarBody._focusActiveCell();
        };
        /** Initializes the weekdays. */
        SatMonthView.prototype._initWeekdays = function () {
            var firstDayOfWeek = this._dateAdapter.getFirstDayOfWeek();
            var narrowWeekdays = this._dateAdapter.getDayOfWeekNames('narrow');
            var longWeekdays = this._dateAdapter.getDayOfWeekNames('long');
            // Rotate the labels for days of the week based on the configured first day of the week.
            var weekdays = longWeekdays.map(function (long, i) {
                return { long: long, narrow: narrowWeekdays[i] };
            });
            this._weekdays = weekdays.slice(firstDayOfWeek).concat(weekdays.slice(0, firstDayOfWeek));
        };
        /** Creates SatCalendarCells for the dates in this month. */
        SatMonthView.prototype._createWeekCells = function () {
            var daysInMonth = this._dateAdapter.getNumDaysInMonth(this.activeDate);
            var dateNames = this._dateAdapter.getDateNames();
            this._weeks = [[]];
            for (var i = 0, cell = this._firstWeekOffset; i < daysInMonth; i++, cell++) {
                if (cell == DAYS_PER_WEEK) {
                    this._weeks.push([]);
                    cell = 0;
                }
                var date = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), this._dateAdapter.getMonth(this.activeDate), i + 1);
                var enabled = this._shouldEnableDate(date);
                var ariaLabel = this._dateAdapter.format(date, this._dateFormats.display.dateA11yLabel);
                var cellClasses = this.dateClass ? this.dateClass(date) : undefined;
                this._weeks[this._weeks.length - 1]
                    .push(new SatCalendarCell(i + 1, dateNames[i], ariaLabel, enabled, cellClasses));
            }
        };
        /** Date filter for the month */
        SatMonthView.prototype._shouldEnableDate = function (date) {
            return !!date &&
                (!this.dateFilter || this.dateFilter(date)) &&
                (!this.minDate || this._dateAdapter.compareDate(date, this.minDate) >= 0) &&
                (!this.maxDate || this._dateAdapter.compareDate(date, this.maxDate) <= 0);
        };
        /**
         * Gets the date in this month that the given Date falls on.
         * Returns null if the given Date is in another month.
         */
        SatMonthView.prototype._getDateInCurrentMonth = function (date) {
            return date && this._hasSameMonthAndYear(date, this.activeDate) ?
                this._dateAdapter.getDate(date) : null;
        };
        /** Checks whether the 2 dates are non-null and fall within the same month of the same year. */
        SatMonthView.prototype._hasSameMonthAndYear = function (d1, d2) {
            return !!(d1 && d2 && this._dateAdapter.getMonth(d1) == this._dateAdapter.getMonth(d2) &&
                this._dateAdapter.getYear(d1) == this._dateAdapter.getYear(d2));
        };
        /**
         * @param obj The object to check.
         * @returns The given object if it is both a date instance and valid, otherwise null.
         */
        SatMonthView.prototype._getValidDateOrNull = function (obj) {
            return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
        };
        /** Determines whether the user has the RTL layout direction. */
        SatMonthView.prototype._isRtl = function () {
            return this._dir && this._dir.value === 'rtl';
        };
        /** Updates range full parameter on each begin or end of interval update.
         * Necessary to display calendar-body correctly
         */
        SatMonthView.prototype.updateRangeSpecificValues = function () {
            if (this.rangeMode) {
                this._beginDateNumber = this._getDateInCurrentMonth(this._beginDate);
                this._endDateNumber = this._getDateInCurrentMonth(this._endDate);
                this._rangeFull = this.beginDate && this.endDate && !this._beginDateNumber &&
                    !this._endDateNumber &&
                    this._dateAdapter.compareDate(this.beginDate, this.activeDate) <= 0 &&
                    this._dateAdapter.compareDate(this.activeDate, this.endDate) <= 0;
            }
            else {
                this._beginDateNumber = this._endDateNumber = null;
                this._rangeFull = false;
            }
        };
        return SatMonthView;
    }());
    SatMonthView.decorators = [
        { type: i0.Component, args: [{
                    selector: 'sat-month-view',
                    template: "<table class=\"mat-calendar-table\">\r\n  <thead class=\"mat-calendar-table-header\">\r\n    <tr><th *ngFor=\"let day of _weekdays\" [attr.aria-label]=\"day.long\">{{day.narrow}}</th></tr>\r\n    <tr><th class=\"mat-calendar-table-header-divider\" colspan=\"7\" aria-hidden=\"true\"></th></tr>\r\n  </thead>\r\n  <tbody sat-calendar-body\r\n         [label]=\"_monthLabel\"\r\n         [rows]=\"_weeks\"\r\n         [todayValue]=\"_todayDate\"\r\n         [selectedValue]=\"_selectedDate\"\r\n         [begin]=\"_beginDateNumber\"\r\n         [end]=\"_endDateNumber\"\r\n         [beginSelected]=\"_beginDateSelected\"\r\n         [isBeforeSelected]=\"_beginDateSelected && _dateAdapter.compareDate(activeDate, _beginDateSelected) < 0\"\r\n         [rangeFull]=\"_rangeFull\"\r\n         [rangeMode]=\"rangeMode\"\r\n         [rangeHoverEffect]=\"rangeHoverEffect\"\r\n         [labelMinRequiredCells]=\"3\"\r\n         [activeCell]=\"_dateAdapter.getDate(activeDate) - 1\"\r\n         (selectedValueChange)=\"_dateSelected($event)\"\r\n         (keydown)=\"_handleCalendarBodyKeydown($event)\">\r\n  </tbody>\r\n</table>\r\n",
                    exportAs: 'matMonthView',
                    encapsulation: i0.ViewEncapsulation.None,
                    changeDetection: i0.ChangeDetectionStrategy.OnPush
                },] }
    ];
    SatMonthView.ctorParameters = function () { return [
        { type: i0.ChangeDetectorRef },
        { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [MAT_DATE_FORMATS,] }] },
        { type: DateAdapter, decorators: [{ type: i0.Optional }] },
        { type: bidi.Directionality, decorators: [{ type: i0.Optional }] }
    ]; };
    SatMonthView.propDecorators = {
        beginDate: [{ type: i0.Input }],
        endDate: [{ type: i0.Input }],
        rangeMode: [{ type: i0.Input }],
        rangeHoverEffect: [{ type: i0.Input }],
        closeAfterSelection: [{ type: i0.Input }],
        beginDateSelected: [{ type: i0.Input }],
        activeDate: [{ type: i0.Input }],
        selected: [{ type: i0.Input }],
        minDate: [{ type: i0.Input }],
        maxDate: [{ type: i0.Input }],
        dateFilter: [{ type: i0.Input }],
        dateClass: [{ type: i0.Input }],
        selectedChange: [{ type: i0.Output }],
        _userSelection: [{ type: i0.Output }],
        activeDateChange: [{ type: i0.Output }],
        _matCalendarBody: [{ type: i0.ViewChild, args: [SatCalendarBody, { static: false },] }]
    };

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var yearsPerPage = 24;
    var yearsPerRow = 4;
    /**
     * An internal component used to display a year selector in the datepicker.
     * @docs-private
     */
    var SatMultiYearView = /** @class */ (function () {
        function SatMultiYearView(_changeDetectorRef, _dateAdapter, _dir) {
            this._changeDetectorRef = _changeDetectorRef;
            this._dateAdapter = _dateAdapter;
            this._dir = _dir;
            /** Emits when a new year is selected. */
            this.selectedChange = new i0.EventEmitter();
            /** Emits the selected year. This doesn't imply a change on the selected date */
            this.yearSelected = new i0.EventEmitter();
            /** Emits when any date is activated. */
            this.activeDateChange = new i0.EventEmitter();
            if (!this._dateAdapter) {
                throw createMissingDateImplError('DateAdapter');
            }
            this._activeDate = this._dateAdapter.today();
        }
        Object.defineProperty(SatMultiYearView.prototype, "activeDate", {
            /** The date to display in this multi-year view (everything other than the year is ignored). */
            get: function () { return this._activeDate; },
            set: function (value) {
                var oldActiveDate = this._activeDate;
                var validDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value)) || this._dateAdapter.today();
                this._activeDate = this._dateAdapter.clampDate(validDate, this.minDate, this.maxDate);
                if (!isSameMultiYearView(this._dateAdapter, oldActiveDate, this._activeDate, this.minDate, this.maxDate)) {
                    this._init();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatMultiYearView.prototype, "selected", {
            /** The currently selected date. */
            get: function () { return this._selected; },
            set: function (value) {
                this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
                this._selectedYear = this._selected && this._dateAdapter.getYear(this._selected);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatMultiYearView.prototype, "minDate", {
            /** The minimum selectable date. */
            get: function () { return this._minDate; },
            set: function (value) {
                this._minDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatMultiYearView.prototype, "maxDate", {
            /** The maximum selectable date. */
            get: function () { return this._maxDate; },
            set: function (value) {
                this._maxDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            },
            enumerable: false,
            configurable: true
        });
        SatMultiYearView.prototype.ngAfterContentInit = function () {
            this._init();
        };
        /** Initializes this multi-year view. */
        SatMultiYearView.prototype._init = function () {
            var _this = this;
            this._todayYear = this._dateAdapter.getYear(this._dateAdapter.today());
            // We want a range years such that we maximize the number of
            // enabled dates visible at once. This prevents issues where the minimum year
            // is the last item of a page OR the maximum year is the first item of a page.
            // The offset from the active year to the "slot" for the starting year is the
            // *actual* first rendered year in the multi-year view.
            var activeYear = this._dateAdapter.getYear(this._activeDate);
            var minYearOfPage = activeYear - getActiveOffset(this._dateAdapter, this.activeDate, this.minDate, this.maxDate);
            this._years = [];
            for (var i = 0, row = []; i < yearsPerPage; i++) {
                row.push(minYearOfPage + i);
                if (row.length == yearsPerRow) {
                    this._years.push(row.map(function (year) { return _this._createCellForYear(year); }));
                    row = [];
                }
            }
            this._changeDetectorRef.markForCheck();
        };
        /** Handles when a new year is selected. */
        SatMultiYearView.prototype._yearSelected = function (year) {
            this.yearSelected.emit(this._dateAdapter.createDate(year, 0, 1));
            var month = this._dateAdapter.getMonth(this.activeDate);
            var daysInMonth = this._dateAdapter.getNumDaysInMonth(this._dateAdapter.createDate(year, month, 1));
            this.selectedChange.emit(this._dateAdapter.createDate(year, month, Math.min(this._dateAdapter.getDate(this.activeDate), daysInMonth)));
        };
        /** Handles keydown events on the calendar body when calendar is in multi-year view. */
        SatMultiYearView.prototype._handleCalendarBodyKeydown = function (event) {
            var oldActiveDate = this._activeDate;
            var isRtl = this._isRtl();
            switch (event.keyCode) {
                case keycodes.LEFT_ARROW:
                    this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, isRtl ? 1 : -1);
                    break;
                case keycodes.RIGHT_ARROW:
                    this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, isRtl ? -1 : 1);
                    break;
                case keycodes.UP_ARROW:
                    this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, -yearsPerRow);
                    break;
                case keycodes.DOWN_ARROW:
                    this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, yearsPerRow);
                    break;
                case keycodes.HOME:
                    this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, -getActiveOffset(this._dateAdapter, this.activeDate, this.minDate, this.maxDate));
                    break;
                case keycodes.END:
                    this.activeDate = this._dateAdapter.addCalendarYears(this._activeDate, yearsPerPage - getActiveOffset(this._dateAdapter, this.activeDate, this.minDate, this.maxDate) - 1);
                    break;
                case keycodes.PAGE_UP:
                    this.activeDate =
                        this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? -yearsPerPage * 10 : -yearsPerPage);
                    break;
                case keycodes.PAGE_DOWN:
                    this.activeDate =
                        this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? yearsPerPage * 10 : yearsPerPage);
                    break;
                case keycodes.ENTER:
                case keycodes.SPACE:
                    this._yearSelected(this._dateAdapter.getYear(this._activeDate));
                    break;
                default:
                    // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                    return;
            }
            if (this._dateAdapter.compareDate(oldActiveDate, this.activeDate)) {
                this.activeDateChange.emit(this.activeDate);
            }
            this._focusActiveCell();
            // Prevent unexpected default actions such as form submission.
            event.preventDefault();
        };
        SatMultiYearView.prototype._getActiveCell = function () {
            return getActiveOffset(this._dateAdapter, this.activeDate, this.minDate, this.maxDate);
        };
        /** Focuses the active cell after the microtask queue is empty. */
        SatMultiYearView.prototype._focusActiveCell = function () {
            this._matCalendarBody._focusActiveCell();
        };
        /** Creates an SatCalendarCell for the given year. */
        SatMultiYearView.prototype._createCellForYear = function (year) {
            var yearName = this._dateAdapter.getYearName(this._dateAdapter.createDate(year, 0, 1));
            return new SatCalendarCell(year, yearName, yearName, this._shouldEnableYear(year));
        };
        /** Whether the given year is enabled. */
        SatMultiYearView.prototype._shouldEnableYear = function (year) {
            // disable if the year is greater than maxDate lower than minDate
            if (year === undefined || year === null ||
                (this.maxDate && year > this._dateAdapter.getYear(this.maxDate)) ||
                (this.minDate && year < this._dateAdapter.getYear(this.minDate))) {
                return false;
            }
            // enable if it reaches here and there's no filter defined
            if (!this.dateFilter) {
                return true;
            }
            var firstOfYear = this._dateAdapter.createDate(year, 0, 1);
            // If any date in the year is enabled count the year as enabled.
            for (var date = firstOfYear; this._dateAdapter.getYear(date) == year; date = this._dateAdapter.addCalendarDays(date, 1)) {
                if (this.dateFilter(date)) {
                    return true;
                }
            }
            return false;
        };
        /**
         * @param obj The object to check.
         * @returns The given object if it is both a date instance and valid, otherwise null.
         */
        SatMultiYearView.prototype._getValidDateOrNull = function (obj) {
            return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
        };
        /** Determines whether the user has the RTL layout direction. */
        SatMultiYearView.prototype._isRtl = function () {
            return this._dir && this._dir.value === 'rtl';
        };
        return SatMultiYearView;
    }());
    SatMultiYearView.decorators = [
        { type: i0.Component, args: [{
                    selector: 'sat-multi-year-view',
                    template: "<table class=\"mat-calendar-table\" role=\"presentation\">\r\n  <thead class=\"mat-calendar-table-header\">\r\n    <tr><th class=\"mat-calendar-table-header-divider\" colspan=\"4\"></th></tr>\r\n  </thead>\r\n  <tbody sat-calendar-body\r\n         [rows]=\"_years\"\r\n         [todayValue]=\"_todayYear\"\r\n         [selectedValue]=\"_selectedYear\"\r\n         [numCols]=\"4\"\r\n         [cellAspectRatio]=\"4 / 7\"\r\n         [activeCell]=\"_getActiveCell()\"\r\n         (selectedValueChange)=\"_yearSelected($event)\"\r\n         (keydown)=\"_handleCalendarBodyKeydown($event)\">\r\n  </tbody>\r\n</table>\r\n",
                    exportAs: 'matMultiYearView',
                    encapsulation: i0.ViewEncapsulation.None,
                    changeDetection: i0.ChangeDetectionStrategy.OnPush
                },] }
    ];
    SatMultiYearView.ctorParameters = function () { return [
        { type: i0.ChangeDetectorRef },
        { type: DateAdapter, decorators: [{ type: i0.Optional }] },
        { type: bidi.Directionality, decorators: [{ type: i0.Optional }] }
    ]; };
    SatMultiYearView.propDecorators = {
        activeDate: [{ type: i0.Input }],
        selected: [{ type: i0.Input }],
        minDate: [{ type: i0.Input }],
        maxDate: [{ type: i0.Input }],
        dateFilter: [{ type: i0.Input }],
        selectedChange: [{ type: i0.Output }],
        yearSelected: [{ type: i0.Output }],
        activeDateChange: [{ type: i0.Output }],
        _matCalendarBody: [{ type: i0.ViewChild, args: [SatCalendarBody, { static: false },] }]
    };
    function isSameMultiYearView(dateAdapter, date1, date2, minDate, maxDate) {
        var year1 = dateAdapter.getYear(date1);
        var year2 = dateAdapter.getYear(date2);
        var startingYear = getStartingYear(dateAdapter, minDate, maxDate);
        return Math.floor((year1 - startingYear) / yearsPerPage) ===
            Math.floor((year2 - startingYear) / yearsPerPage);
    }
    /**
     * When the multi-year view is first opened, the active year will be in view.
     * So we compute how many years are between the active year and the *slot* where our
     * "startingYear" will render when paged into view.
     */
    function getActiveOffset(dateAdapter, activeDate, minDate, maxDate) {
        var activeYear = dateAdapter.getYear(activeDate);
        return euclideanModulo((activeYear - getStartingYear(dateAdapter, minDate, maxDate)), yearsPerPage);
    }
    /**
     * We pick a "starting" year such that either the maximum year would be at the end
     * or the minimum year would be at the beginning of a page.
     */
    function getStartingYear(dateAdapter, minDate, maxDate) {
        var startingYear = 0;
        if (maxDate) {
            var maxYear = dateAdapter.getYear(maxDate);
            startingYear = maxYear - yearsPerPage + 1;
        }
        else if (minDate) {
            startingYear = dateAdapter.getYear(minDate);
        }
        return startingYear;
    }
    /** Gets remainder that is non-negative, even if first number is negative */
    function euclideanModulo(a, b) {
        return (a % b + b) % b;
    }

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * An internal component used to display a single year in the datepicker.
     * @docs-private
     */
    var SatYearView = /** @class */ (function () {
        function SatYearView(_changeDetectorRef, _dateFormats, _dateAdapter, _dir) {
            this._changeDetectorRef = _changeDetectorRef;
            this._dateFormats = _dateFormats;
            this._dateAdapter = _dateAdapter;
            this._dir = _dir;
            /** Emits when a new month is selected. */
            this.selectedChange = new i0.EventEmitter();
            /** Emits the selected month. This doesn't imply a change on the selected date */
            this.monthSelected = new i0.EventEmitter();
            /** Emits when any date is activated. */
            this.activeDateChange = new i0.EventEmitter();
            if (!this._dateAdapter) {
                throw createMissingDateImplError('DateAdapter');
            }
            if (!this._dateFormats) {
                throw createMissingDateImplError('MAT_DATE_FORMATS');
            }
            this._activeDate = this._dateAdapter.today();
        }
        Object.defineProperty(SatYearView.prototype, "activeDate", {
            /** The date to display in this year view (everything other than the year is ignored). */
            get: function () { return this._activeDate; },
            set: function (value) {
                var oldActiveDate = this._activeDate;
                var validDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value)) || this._dateAdapter.today();
                this._activeDate = this._dateAdapter.clampDate(validDate, this.minDate, this.maxDate);
                if (this._dateAdapter.getYear(oldActiveDate) !== this._dateAdapter.getYear(this._activeDate)) {
                    this._init();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatYearView.prototype, "selected", {
            /** The currently selected date. */
            get: function () { return this._selected; },
            set: function (value) {
                this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
                this._selectedMonth = this._getMonthInCurrentYear(this._selected);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatYearView.prototype, "minDate", {
            /** The minimum selectable date. */
            get: function () { return this._minDate; },
            set: function (value) {
                this._minDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatYearView.prototype, "maxDate", {
            /** The maximum selectable date. */
            get: function () { return this._maxDate; },
            set: function (value) {
                this._maxDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            },
            enumerable: false,
            configurable: true
        });
        SatYearView.prototype.ngAfterContentInit = function () {
            this._init();
        };
        /** Handles when a new month is selected. */
        SatYearView.prototype._monthSelected = function (month) {
            var normalizedDate = this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1);
            this.monthSelected.emit(normalizedDate);
            var daysInMonth = this._dateAdapter.getNumDaysInMonth(normalizedDate);
            this.selectedChange.emit(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, Math.min(this._dateAdapter.getDate(this.activeDate), daysInMonth)));
        };
        /** Handles keydown events on the calendar body when calendar is in year view. */
        SatYearView.prototype._handleCalendarBodyKeydown = function (event) {
            // TODO(mmalerba): We currently allow keyboard navigation to disabled dates, but just prevent
            // disabled ones from being selected. This may not be ideal, we should look into whether
            // navigation should skip over disabled dates, and if so, how to implement that efficiently.
            var oldActiveDate = this._activeDate;
            var isRtl = this._isRtl();
            switch (event.keyCode) {
                case keycodes.LEFT_ARROW:
                    this.activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, isRtl ? 1 : -1);
                    break;
                case keycodes.RIGHT_ARROW:
                    this.activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, isRtl ? -1 : 1);
                    break;
                case keycodes.UP_ARROW:
                    this.activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -4);
                    break;
                case keycodes.DOWN_ARROW:
                    this.activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 4);
                    break;
                case keycodes.HOME:
                    this.activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, -this._dateAdapter.getMonth(this._activeDate));
                    break;
                case keycodes.END:
                    this.activeDate = this._dateAdapter.addCalendarMonths(this._activeDate, 11 - this._dateAdapter.getMonth(this._activeDate));
                    break;
                case keycodes.PAGE_UP:
                    this.activeDate =
                        this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? -10 : -1);
                    break;
                case keycodes.PAGE_DOWN:
                    this.activeDate =
                        this._dateAdapter.addCalendarYears(this._activeDate, event.altKey ? 10 : 1);
                    break;
                case keycodes.ENTER:
                case keycodes.SPACE:
                    this._monthSelected(this._dateAdapter.getMonth(this._activeDate));
                    break;
                default:
                    // Don't prevent default or focus active cell on keys that we don't explicitly handle.
                    return;
            }
            if (this._dateAdapter.compareDate(oldActiveDate, this.activeDate)) {
                this.activeDateChange.emit(this.activeDate);
            }
            this._focusActiveCell();
            // Prevent unexpected default actions such as form submission.
            event.preventDefault();
        };
        /** Initializes this year view. */
        SatYearView.prototype._init = function () {
            var _this = this;
            this._selectedMonth = this._getMonthInCurrentYear(this.selected);
            this._todayMonth = this._getMonthInCurrentYear(this._dateAdapter.today());
            this._yearLabel = this._dateAdapter.getYearName(this.activeDate);
            var monthNames = this._dateAdapter.getMonthNames('short');
            // First row of months only contains 5 elements so we can fit the year label on the same row.
            this._months = [[0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11]].map(function (row) { return row.map(function (month) { return _this._createCellForMonth(month, monthNames[month]); }); });
            this._changeDetectorRef.markForCheck();
        };
        /** Focuses the active cell after the microtask queue is empty. */
        SatYearView.prototype._focusActiveCell = function () {
            this._matCalendarBody._focusActiveCell();
        };
        /**
         * Gets the month in this year that the given Date falls on.
         * Returns null if the given Date is in another year.
         */
        SatYearView.prototype._getMonthInCurrentYear = function (date) {
            return date && this._dateAdapter.getYear(date) == this._dateAdapter.getYear(this.activeDate) ?
                this._dateAdapter.getMonth(date) : null;
        };
        /** Creates an SatCalendarCell for the given month. */
        SatYearView.prototype._createCellForMonth = function (month, monthName) {
            var ariaLabel = this._dateAdapter.format(this._dateAdapter.createDate(this._dateAdapter.getYear(this.activeDate), month, 1), this._dateFormats.display.monthYearA11yLabel);
            return new SatCalendarCell(month, monthName.toLocaleUpperCase(), ariaLabel, this._shouldEnableMonth(month));
        };
        /** Whether the given month is enabled. */
        SatYearView.prototype._shouldEnableMonth = function (month) {
            var activeYear = this._dateAdapter.getYear(this.activeDate);
            if (month === undefined || month === null ||
                this._isYearAndMonthAfterMaxDate(activeYear, month) ||
                this._isYearAndMonthBeforeMinDate(activeYear, month)) {
                return false;
            }
            if (!this.dateFilter) {
                return true;
            }
            var firstOfMonth = this._dateAdapter.createDate(activeYear, month, 1);
            // If any date in the month is enabled count the month as enabled.
            for (var date = firstOfMonth; this._dateAdapter.getMonth(date) == month; date = this._dateAdapter.addCalendarDays(date, 1)) {
                if (this.dateFilter(date)) {
                    return true;
                }
            }
            return false;
        };
        /**
         * Tests whether the combination month/year is after this.maxDate, considering
         * just the month and year of this.maxDate
         */
        SatYearView.prototype._isYearAndMonthAfterMaxDate = function (year, month) {
            if (this.maxDate) {
                var maxYear = this._dateAdapter.getYear(this.maxDate);
                var maxMonth = this._dateAdapter.getMonth(this.maxDate);
                return year > maxYear || (year === maxYear && month > maxMonth);
            }
            return false;
        };
        /**
         * Tests whether the combination month/year is before this.minDate, considering
         * just the month and year of this.minDate
         */
        SatYearView.prototype._isYearAndMonthBeforeMinDate = function (year, month) {
            if (this.minDate) {
                var minYear = this._dateAdapter.getYear(this.minDate);
                var minMonth = this._dateAdapter.getMonth(this.minDate);
                return year < minYear || (year === minYear && month < minMonth);
            }
            return false;
        };
        /**
         * @param obj The object to check.
         * @returns The given object if it is both a date instance and valid, otherwise null.
         */
        SatYearView.prototype._getValidDateOrNull = function (obj) {
            return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
        };
        /** Determines whether the user has the RTL layout direction. */
        SatYearView.prototype._isRtl = function () {
            return this._dir && this._dir.value === 'rtl';
        };
        return SatYearView;
    }());
    SatYearView.decorators = [
        { type: i0.Component, args: [{
                    selector: 'sat-year-view',
                    template: "<table class=\"mat-calendar-table\" role=\"presentation\">\r\n  <thead class=\"mat-calendar-table-header\">\r\n    <tr><th class=\"mat-calendar-table-header-divider\" colspan=\"4\"></th></tr>\r\n  </thead>\r\n  <tbody sat-calendar-body\r\n         [label]=\"_yearLabel\"\r\n         [rows]=\"_months\"\r\n         [todayValue]=\"_todayMonth\"\r\n         [selectedValue]=\"_selectedMonth\"\r\n         [labelMinRequiredCells]=\"2\"\r\n         [numCols]=\"4\"\r\n         [cellAspectRatio]=\"4 / 7\"\r\n         [activeCell]=\"_dateAdapter.getMonth(activeDate)\"\r\n         (selectedValueChange)=\"_monthSelected($event)\"\r\n         (keydown)=\"_handleCalendarBodyKeydown($event)\">\r\n  </tbody>\r\n</table>\r\n",
                    exportAs: 'matYearView',
                    encapsulation: i0.ViewEncapsulation.None,
                    changeDetection: i0.ChangeDetectionStrategy.OnPush
                },] }
    ];
    SatYearView.ctorParameters = function () { return [
        { type: i0.ChangeDetectorRef },
        { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [MAT_DATE_FORMATS,] }] },
        { type: DateAdapter, decorators: [{ type: i0.Optional }] },
        { type: bidi.Directionality, decorators: [{ type: i0.Optional }] }
    ]; };
    SatYearView.propDecorators = {
        activeDate: [{ type: i0.Input }],
        selected: [{ type: i0.Input }],
        minDate: [{ type: i0.Input }],
        maxDate: [{ type: i0.Input }],
        dateFilter: [{ type: i0.Input }],
        selectedChange: [{ type: i0.Output }],
        monthSelected: [{ type: i0.Output }],
        activeDateChange: [{ type: i0.Output }],
        _matCalendarBody: [{ type: i0.ViewChild, args: [SatCalendarBody, { static: false },] }]
    };

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Default header for SatCalendar */
    var SatCalendarHeader = /** @class */ (function () {
        function SatCalendarHeader(_intl, calendar, _dateAdapter, _dateFormats, changeDetectorRef) {
            this._intl = _intl;
            this.calendar = calendar;
            this._dateAdapter = _dateAdapter;
            this._dateFormats = _dateFormats;
            this.calendar.stateChanges.subscribe(function () { return changeDetectorRef.markForCheck(); });
        }
        Object.defineProperty(SatCalendarHeader.prototype, "periodButtonText", {
            /** The label for the current calendar view. */
            get: function () {
                if (this.calendar.currentView == 'month') {
                    return this._dateAdapter
                        .format(this.calendar.activeDate, this._dateFormats.display.monthYearLabel)
                        .toLocaleUpperCase();
                }
                if (this.calendar.currentView == 'year') {
                    return this._dateAdapter.getYearName(this.calendar.activeDate);
                }
                // The offset from the active year to the "slot" for the starting year is the
                // *actual* first rendered year in the multi-year view, and the last year is
                // just yearsPerPage - 1 away.
                var activeYear = this._dateAdapter.getYear(this.calendar.activeDate);
                var minYearOfPage = activeYear - getActiveOffset(this._dateAdapter, this.calendar.activeDate, this.calendar.minDate, this.calendar.maxDate);
                var maxYearOfPage = minYearOfPage + yearsPerPage - 1;
                return this._dateAdapter.getYearName(this._dateAdapter.createDate(minYearOfPage, 0, 1)) + "\n      \u2013 " + this._dateAdapter.getYearName(this._dateAdapter.createDate(maxYearOfPage, 0, 1));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatCalendarHeader.prototype, "periodButtonLabel", {
            get: function () {
                return this.calendar.currentView == 'month' ?
                    this._intl.switchToMultiYearViewLabel : this._intl.switchToMonthViewLabel;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatCalendarHeader.prototype, "prevButtonLabel", {
            /** The label for the previous button. */
            get: function () {
                return {
                    'month': this._intl.prevMonthLabel,
                    'year': this._intl.prevYearLabel,
                    'multi-year': this._intl.prevMultiYearLabel
                }[this.calendar.currentView];
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatCalendarHeader.prototype, "nextButtonLabel", {
            /** The label for the next button. */
            get: function () {
                return {
                    'month': this._intl.nextMonthLabel,
                    'year': this._intl.nextYearLabel,
                    'multi-year': this._intl.nextMultiYearLabel
                }[this.calendar.currentView];
            },
            enumerable: false,
            configurable: true
        });
        /** Handles user clicks on the period label.
         * Option`calendar.orderPeriodLabel` sort the label period views.
         * - Default [multi-year]: multi-year then back to month
         * - Month [month]: month > year > multi-year
         */
        SatCalendarHeader.prototype.currentPeriodClicked = function () {
            var mouthFirstOrder = ['month', 'year', 'multi-year'];
            var defaultOrder = ['month', 'multi-year', 'month'];
            var orderPeriod = this.calendar.orderPeriodLabel === 'month' ? mouthFirstOrder : defaultOrder;
            switch (this.calendar.currentView) {
                case 'month':
                    this.calendar.currentView = orderPeriod[1];
                    break;
                case 'year':
                    this.calendar.currentView = orderPeriod[2];
                    break;
                default:
                    this.calendar.currentView = orderPeriod[0];
                    break;
            }
        };
        /** Handles user clicks on the previous button. */
        SatCalendarHeader.prototype.previousClicked = function () {
            this.calendar.activeDate = this.calendar.currentView == 'month' ?
                this._dateAdapter.addCalendarMonths(this.calendar.activeDate, -1) :
                this._dateAdapter.addCalendarYears(this.calendar.activeDate, this.calendar.currentView == 'year' ? -1 : -yearsPerPage);
        };
        /** Handles user clicks on the next button. */
        SatCalendarHeader.prototype.nextClicked = function () {
            this.calendar.activeDate = this.calendar.currentView == 'month' ?
                this._dateAdapter.addCalendarMonths(this.calendar.activeDate, 1) :
                this._dateAdapter.addCalendarYears(this.calendar.activeDate, this.calendar.currentView == 'year' ? 1 : yearsPerPage);
        };
        /** Whether the previous period button is enabled. */
        SatCalendarHeader.prototype.previousEnabled = function () {
            if (!this.calendar.minDate) {
                return true;
            }
            return !this.calendar.minDate ||
                !this._isSameView(this.calendar.activeDate, this.calendar.minDate);
        };
        /** Whether the next period button is enabled. */
        SatCalendarHeader.prototype.nextEnabled = function () {
            return !this.calendar.maxDate ||
                !this._isSameView(this.calendar.activeDate, this.calendar.maxDate);
        };
        /** Whether the two dates represent the same view in the current view mode (month or year). */
        SatCalendarHeader.prototype._isSameView = function (date1, date2) {
            if (this.calendar.currentView == 'month') {
                return this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2) &&
                    this._dateAdapter.getMonth(date1) == this._dateAdapter.getMonth(date2);
            }
            if (this.calendar.currentView == 'year') {
                return this._dateAdapter.getYear(date1) == this._dateAdapter.getYear(date2);
            }
            // Otherwise we are in 'multi-year' view.
            return isSameMultiYearView(this._dateAdapter, date1, date2, this.calendar.minDate, this.calendar.maxDate);
        };
        return SatCalendarHeader;
    }());
    SatCalendarHeader.decorators = [
        { type: i0.Component, args: [{
                    selector: 'sat-calendar-header',
                    template: "<div class=\"mat-calendar-header\">\r\n  <div class=\"mat-calendar-controls\">\r\n    <button mat-button type=\"button\" class=\"mat-calendar-period-button\"\r\n            (click)=\"currentPeriodClicked()\" [attr.aria-label]=\"periodButtonLabel\"\r\n            cdkAriaLive=\"polite\">\r\n      {{periodButtonText}}\r\n      <div class=\"mat-calendar-arrow\"\r\n           [class.mat-calendar-invert]=\"calendar.currentView != 'month'\"></div>\r\n    </button>\r\n\r\n    <div class=\"mat-calendar-spacer\"></div>\r\n\r\n    <ng-content></ng-content>\r\n\r\n    <button mat-icon-button type=\"button\" class=\"mat-calendar-previous-button\"\r\n            [disabled]=\"!previousEnabled()\" (click)=\"previousClicked()\"\r\n            [attr.aria-label]=\"prevButtonLabel\">\r\n    </button>\r\n\r\n    <button mat-icon-button type=\"button\" class=\"mat-calendar-next-button\"\r\n            [disabled]=\"!nextEnabled()\" (click)=\"nextClicked()\"\r\n            [attr.aria-label]=\"nextButtonLabel\">\r\n    </button>\r\n  </div>\r\n</div>\r\n",
                    exportAs: 'matCalendarHeader',
                    encapsulation: i0.ViewEncapsulation.None,
                    changeDetection: i0.ChangeDetectionStrategy.OnPush
                },] }
    ];
    SatCalendarHeader.ctorParameters = function () { return [
        { type: SatDatepickerIntl },
        { type: SatCalendar, decorators: [{ type: i0.Inject, args: [i0.forwardRef(function () { return SatCalendar; }),] }] },
        { type: DateAdapter, decorators: [{ type: i0.Optional }] },
        { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [MAT_DATE_FORMATS,] }] },
        { type: i0.ChangeDetectorRef }
    ]; };
    /** Default footer for SatCalendar */
    var SatCalendarFooter = /** @class */ (function () {
        function SatCalendarFooter() {
        }
        return SatCalendarFooter;
    }());
    SatCalendarFooter.decorators = [
        { type: i0.Component, args: [{
                    moduleId: module.id,
                    selector: 'sat-calendar-footer',
                    template: "",
                    exportAs: 'matCalendarFooter',
                    encapsulation: i0.ViewEncapsulation.None,
                    changeDetection: i0.ChangeDetectionStrategy.OnPush
                },] }
    ];
    /**
     * A calendar that is used as part of the datepicker.
     * @docs-private
     */
    var SatCalendar = /** @class */ (function () {
        function SatCalendar(_intl, _dateAdapter, _dateFormats, _changeDetectorRef) {
            var _this = this;
            this._dateAdapter = _dateAdapter;
            this._dateFormats = _dateFormats;
            this._changeDetectorRef = _changeDetectorRef;
            /** Whenever datepicker is for selecting range of dates. */
            this.rangeMode = false;
            /** Enables datepicker MouseOver effect on range mode */
            this.rangeHoverEffect = true;
            /** Enables datepicker closing after selection */
            this.closeAfterSelection = true;
            /** Emits when new pair of dates selected. */
            this.dateRangesChange = new i0.EventEmitter();
            /** Whenever user already selected start of dates interval. */
            this.beginDateSelected = false;
            /** Emits when a new start date has been selected in range mode. */
            this.beginDateSelectedChange = new i0.EventEmitter();
            /**
             * Used for scheduling that focus should be moved to the active cell on the next tick.
             * We need to schedule it, rather than do it immediately, because we have to wait
             * for Angular to re-evaluate the view children.
             */
            this._moveFocusOnNextTick = false;
            /** Whether the calendar should be started in month or year view. */
            this.startView = 'month';
            /** Order the views when clicking on period label button */
            this.orderPeriodLabel = 'multi-year';
            /** Emits when the currently selected date changes. */
            this.selectedChange = new i0.EventEmitter();
            /**
             * Emits the year chosen in multiyear view.
             * This doesn't imply a change on the selected date.
             */
            this.yearSelected = new i0.EventEmitter();
            /**
             * Emits the month chosen in year view.
             * This doesn't imply a change on the selected date.
             */
            this.monthSelected = new i0.EventEmitter();
            /** Emits when any date is selected. */
            this._userSelection = new i0.EventEmitter();
            /**
             * Emits whenever there is a state change that the header may need to respond to.
             */
            this.stateChanges = new rxjs.Subject();
            if (!this._dateAdapter) {
                throw createMissingDateImplError('DateAdapter');
            }
            if (!this._dateFormats) {
                throw createMissingDateImplError('MAT_DATE_FORMATS');
            }
            this._intlChanges = _intl.changes.subscribe(function () {
                _changeDetectorRef.markForCheck();
                _this.stateChanges.next();
            });
        }
        Object.defineProperty(SatCalendar.prototype, "beginDate", {
            /** Beginning of date range. */
            get: function () { return this._beginDate; },
            set: function (value) {
                this._beginDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatCalendar.prototype, "endDate", {
            /** Date range end. */
            get: function () { return this._endDate; },
            set: function (value) {
                this._endDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatCalendar.prototype, "startAt", {
            /** A date representing the period (month or year) to start the calendar in. */
            get: function () { return this._startAt; },
            set: function (value) {
                this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatCalendar.prototype, "selected", {
            /** The currently selected date. */
            get: function () { return this._selected; },
            set: function (value) {
                this._selected = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatCalendar.prototype, "minDate", {
            /** The minimum selectable date. */
            get: function () { return this._minDate; },
            set: function (value) {
                this._minDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatCalendar.prototype, "maxDate", {
            /** The maximum selectable date. */
            get: function () { return this._maxDate; },
            set: function (value) {
                this._maxDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatCalendar.prototype, "activeDate", {
            /**
             * The current active date. This determines which time period is shown and which date is
             * highlighted when using keyboard navigation.
             */
            get: function () { return this._clampedActiveDate; },
            set: function (value) {
                this._clampedActiveDate = this._dateAdapter.clampDate(value, this.minDate, this.maxDate);
                this.stateChanges.next();
                this._changeDetectorRef.markForCheck();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatCalendar.prototype, "currentView", {
            /** Whether the calendar is in month view. */
            get: function () { return this._currentView; },
            set: function (value) {
                this._currentView = value;
                this._moveFocusOnNextTick = true;
                this._changeDetectorRef.markForCheck();
            },
            enumerable: false,
            configurable: true
        });
        SatCalendar.prototype.ngAfterContentInit = function () {
            this._calendarHeaderPortal = new portal.ComponentPortal(this.headerComponent || SatCalendarHeader);
            this._calendarFooterPortal = new portal.ComponentPortal(this.footerComponent || SatCalendarFooter);
            this.activeDate = this.startAt || this._dateAdapter.today();
            // Assign to the private property since we don't want to move focus on init.
            this._currentView = this.startView;
        };
        SatCalendar.prototype.ngAfterViewChecked = function () {
            if (this._moveFocusOnNextTick) {
                this._moveFocusOnNextTick = false;
                this.focusActiveCell();
            }
        };
        SatCalendar.prototype.ngOnDestroy = function () {
            this._intlChanges.unsubscribe();
            this.stateChanges.complete();
        };
        SatCalendar.prototype.ngOnChanges = function (changes) {
            var change = changes['minDate'] || changes['maxDate'] || changes['dateFilter'];
            if (change && !change.firstChange) {
                var view = this._getCurrentViewComponent();
                if (view) {
                    // We need to `detectChanges` manually here, because the `minDate`, `maxDate` etc. are
                    // passed down to the view via data bindings which won't be up-to-date when we call `_init`.
                    this._changeDetectorRef.detectChanges();
                    view._init();
                }
            }
            this.stateChanges.next();
        };
        SatCalendar.prototype.focusActiveCell = function () {
            this._getCurrentViewComponent()._focusActiveCell();
        };
        /** Updates today's date after an update of the active date */
        SatCalendar.prototype.updateTodaysDate = function () {
            var view = this.currentView == 'month' ? this.monthView :
                (this.currentView == 'year' ? this.yearView : this.multiYearView);
            view.ngAfterContentInit();
        };
        /** Handles date selection in the month view. */
        SatCalendar.prototype._dateSelected = function (date) {
            if (this.rangeMode) {
                if (!this.beginDateSelected) {
                    this.beginDateSelected = date;
                    this.beginDate = date;
                    this.endDate = date;
                    this.beginDateSelectedChange.emit(date);
                }
                else {
                    this.beginDateSelected = false;
                    if (this._dateAdapter.compareDate(this.beginDate, date) <= 0) {
                        this.endDate = date;
                    }
                    else {
                        this.endDate = this.beginDate;
                        this.beginDate = date;
                    }
                    this.dateRangesChange.emit({ begin: this.beginDate, end: this.endDate });
                }
            }
            else if (!this._dateAdapter.sameDate(date, this.selected)) {
                this.selected = date;
                this.selectedChange.emit(date);
            }
        };
        /** Handles year selection in the multiyear view. */
        SatCalendar.prototype._yearSelectedInMultiYearView = function (normalizedYear) {
            this.yearSelected.emit(normalizedYear);
        };
        /** Handles month selection in the year view. */
        SatCalendar.prototype._monthSelectedInYearView = function (normalizedMonth) {
            this.monthSelected.emit(normalizedMonth);
        };
        SatCalendar.prototype._userSelected = function () {
            this._userSelection.emit();
        };
        /** Handles year/month selection in the multi-year/year views. */
        SatCalendar.prototype._goToDateInView = function (date, view) {
            this.activeDate = date;
            this.currentView = view;
        };
        /**
         * @param obj The object to check.
         * @returns The given object if it is both a date instance and valid, otherwise null.
         */
        SatCalendar.prototype._getValidDateOrNull = function (obj) {
            return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
        };
        /** Returns the component instance that corresponds to the current calendar view. */
        SatCalendar.prototype._getCurrentViewComponent = function () {
            return this.monthView || this.yearView || this.multiYearView;
        };
        /** Reset inserted values */
        SatCalendar.prototype._reset = function () {
            if (!this.rangeMode) {
                this._selected = null;
                return this.selectedChange.emit(null);
            }
            this._beginDate = null;
            this._endDate = null;
            this.beginDateSelected = null;
            this.dateRangesChange.emit(null);
        };
        return SatCalendar;
    }());
    SatCalendar.decorators = [
        { type: i0.Component, args: [{
                    selector: 'sat-calendar',
                    template: "\r\n<ng-template [cdkPortalOutlet]=\"_calendarHeaderPortal\"></ng-template>\r\n\r\n<div class=\"mat-calendar-content\" [ngSwitch]=\"currentView\" cdkMonitorSubtreeFocus tabindex=\"-1\">\r\n  <sat-month-view\r\n      *ngSwitchCase=\"'month'\"\r\n      [(activeDate)]=\"activeDate\"\r\n      [selected]=\"selected\"\r\n      [beginDate]=\"beginDate\"\r\n      [endDate]=\"endDate\"\r\n      [rangeMode]=\"rangeMode\"\r\n      [closeAfterSelection]=\"closeAfterSelection\"\r\n      [rangeHoverEffect]=\"rangeHoverEffect\"\r\n      [dateFilter]=\"dateFilter\"\r\n      [maxDate]=\"maxDate\"\r\n      [minDate]=\"minDate\"\r\n      [dateClass]=\"dateClass\"\r\n      [beginDateSelected]=\"beginDateSelected\"\r\n      (selectedChange)=\"_dateSelected($event)\"\r\n      (_userSelection)=\"_userSelected()\">\r\n  </sat-month-view>\r\n\r\n  <sat-year-view\r\n      *ngSwitchCase=\"'year'\"\r\n      [(activeDate)]=\"activeDate\"\r\n      [selected]=\"selected\"\r\n      [dateFilter]=\"dateFilter\"\r\n      [maxDate]=\"maxDate\"\r\n      [minDate]=\"minDate\"\r\n      (monthSelected)=\"_monthSelectedInYearView($event)\"\r\n      (selectedChange)=\"_goToDateInView($event, 'month')\">\r\n  </sat-year-view>\r\n\r\n  <sat-multi-year-view\r\n      *ngSwitchCase=\"'multi-year'\"\r\n      [(activeDate)]=\"activeDate\"\r\n      [selected]=\"selected\"\r\n      [dateFilter]=\"dateFilter\"\r\n      [maxDate]=\"maxDate\"\r\n      [minDate]=\"minDate\"\r\n      (yearSelected)=\"_yearSelectedInMultiYearView($event)\"\r\n      (selectedChange)=\"_goToDateInView($event, 'year')\">\r\n  </sat-multi-year-view>\r\n</div>\r\n\r\n<ng-template [cdkPortalOutlet]=\"_calendarFooterPortal\"></ng-template>\r\n",
                    host: {
                        'class': 'mat-calendar',
                    },
                    exportAs: 'matCalendar',
                    encapsulation: i0.ViewEncapsulation.None,
                    changeDetection: i0.ChangeDetectionStrategy.OnPush,
                    styles: [".mat-calendar{display:block}.mat-calendar-header{padding:8px 8px 0}.mat-calendar-content{outline:0;padding:0 8px 8px}.mat-calendar-controls{display:flex;margin:5% calc(4.71429% - 16px)}.mat-calendar-spacer{flex:1 1 auto}.mat-calendar-period-button{min-width:0}.mat-calendar-arrow{border-left:5px solid transparent;border-right:5px solid transparent;border-top-style:solid;border-top-width:5px;display:inline-block;height:0;margin:0 0 0 5px;vertical-align:middle;width:0}.mat-calendar-arrow.mat-calendar-invert{transform:rotate(180deg)}[dir=rtl] .mat-calendar-arrow{margin:0 5px 0 0}.mat-calendar-next-button,.mat-calendar-previous-button{position:relative}.mat-calendar-next-button:after,.mat-calendar-previous-button:after{border:solid;border-width:2px 0 0;bottom:0;content:\"\";left:0;margin:15.5px;position:absolute;right:0;top:0}[dir=rtl] .mat-calendar-next-button,[dir=rtl] .mat-calendar-previous-button{transform:rotate(180deg)}.mat-calendar-previous-button:after{border-left-width:2px;transform:translateX(2px) rotate(-45deg)}.mat-calendar-next-button:after{border-right-width:2px;transform:translateX(-2px) rotate(45deg)}.mat-calendar-table{border-collapse:collapse;border-spacing:0;width:100%}.mat-calendar-table-header th{padding:0 0 8px;text-align:center}.mat-calendar-table-header-divider{height:1px;position:relative}.mat-calendar-table-header-divider:after{content:\"\";height:1px;left:-8px;position:absolute;right:-8px;top:0}"]
                },] }
    ];
    SatCalendar.ctorParameters = function () { return [
        { type: SatDatepickerIntl },
        { type: DateAdapter, decorators: [{ type: i0.Optional }] },
        { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [MAT_DATE_FORMATS,] }] },
        { type: i0.ChangeDetectorRef }
    ]; };
    SatCalendar.propDecorators = {
        beginDate: [{ type: i0.Input }],
        endDate: [{ type: i0.Input }],
        rangeMode: [{ type: i0.Input }],
        rangeHoverEffect: [{ type: i0.Input }],
        closeAfterSelection: [{ type: i0.Input }],
        dateRangesChange: [{ type: i0.Output }],
        beginDateSelectedChange: [{ type: i0.Output }],
        headerComponent: [{ type: i0.Input }],
        footerComponent: [{ type: i0.Input }],
        startAt: [{ type: i0.Input }],
        startView: [{ type: i0.Input }],
        selected: [{ type: i0.Input }],
        minDate: [{ type: i0.Input }],
        maxDate: [{ type: i0.Input }],
        dateFilter: [{ type: i0.Input }],
        dateClass: [{ type: i0.Input }],
        orderPeriodLabel: [{ type: i0.Input }],
        selectedChange: [{ type: i0.Output }],
        yearSelected: [{ type: i0.Output }],
        monthSelected: [{ type: i0.Output }],
        _userSelection: [{ type: i0.Output }],
        monthView: [{ type: i0.ViewChild, args: [SatMonthView, { static: false },] }],
        yearView: [{ type: i0.ViewChild, args: [SatYearView, { static: false },] }],
        multiYearView: [{ type: i0.ViewChild, args: [SatMultiYearView, { static: false },] }]
    };

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /**
     * Animations used by the Material datepicker.
     * @docs-private
     */
    var matDatepickerAnimations = {
        /** Transforms the height of the datepicker's calendar. */
        transformPanel: animations.trigger('transformPanel', [
            animations.state('void', animations.style({
                opacity: 0,
                transform: 'scale(1, 0.8)'
            })),
            animations.transition('void => enter', animations.animate('120ms cubic-bezier(0, 0, 0.2, 1)', animations.style({
                opacity: 1,
                transform: 'scale(1, 1)'
            }))),
            animations.transition('* => void', animations.animate('100ms linear', animations.style({ opacity: 0 })))
        ]),
        /** Fades in the content of the calendar. */
        fadeInCalendar: animations.trigger('fadeInCalendar', [
            animations.state('void', animations.style({ opacity: 0 })),
            animations.state('enter', animations.style({ opacity: 1 })),
            // TODO(crisbeto): this animation should be removed since it isn't quite on spec, but we
            // need to keep it until #12440 gets in, otherwise the exit animation will look glitchy.
            animations.transition('void => *', animations.animate('120ms 100ms cubic-bezier(0.55, 0, 0.55, 0.2)'))
        ])
    };

    /** Used to generate a unique ID for each datepicker instance. */
    var datepickerUid = 0;
    /** Injection token that determines the scroll handling while the calendar is open. */
    var MAT_DATEPICKER_SCROLL_STRATEGY = new i0.InjectionToken('sat-datepicker-scroll-strategy');
    /** @docs-private */
    function MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY(overlay) {
        return function () { return overlay.scrollStrategies.reposition(); };
    }
    /** @docs-private */
    var MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER = {
        provide: MAT_DATEPICKER_SCROLL_STRATEGY,
        deps: [overlay.Overlay],
        useFactory: MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY,
    };
    // Boilerplate for applying mixins to SatDatepickerContent.
    /** @docs-private */
    var SatDatepickerContentBase = /** @class */ (function () {
        function SatDatepickerContentBase(_elementRef) {
            this._elementRef = _elementRef;
        }
        return SatDatepickerContentBase;
    }());
    var _SatDatepickerContentMixinBase = core.mixinColor(SatDatepickerContentBase);
    /**
     * Component used as the content for the datepicker dialog and popup. We use this instead of using
     * SatCalendar directly as the content so we can control the initial focus. This also gives us a
     * place to put additional features of the popup that are not part of the calendar itself in the
     * future. (e.g. confirmation buttons).
     * @docs-private
     */
    var SatDatepickerContent = /** @class */ (function (_super) {
        __extends(SatDatepickerContent, _super);
        function SatDatepickerContent(elementRef) {
            var _this = _super.call(this, elementRef) || this;
            /** Will emit whenever the begin date is selected */
            _this.beginDateSelected = new i0.EventEmitter();
            return _this;
        }
        SatDatepickerContent.prototype.ngAfterViewInit = function () {
            this._calendar.focusActiveCell();
        };
        SatDatepickerContent.prototype.setBeginDateSelected = function (beginDate) {
            this.datepicker.setBeginDateSelected(beginDate);
            this.beginDateSelected.emit(beginDate);
        };
        SatDatepickerContent.prototype.close = function () {
            if (this.datepicker.closeAfterSelection) {
                this.datepicker.close();
            }
        };
        return SatDatepickerContent;
    }(_SatDatepickerContentMixinBase));
    SatDatepickerContent.decorators = [
        { type: i0.Component, args: [{
                    selector: 'sat-datepicker-content',
                    template: "<sat-calendar cdkTrapFocus\r\n    [id]=\"datepicker.id\"\r\n    [ngClass]=\"datepicker.panelClass\"\r\n    [startAt]=\"datepicker.startAt\"\r\n    [startView]=\"datepicker.startView\"\r\n    [minDate]=\"datepicker._minDate\"\r\n    [maxDate]=\"datepicker._maxDate\"\r\n    [dateFilter]=\"datepicker._dateFilter\"\r\n    [rangeHoverEffect]=\"datepicker.rangeHoverEffect\"\r\n    [headerComponent]=\"datepicker.calendarHeaderComponent\"\r\n    [footerComponent]=\"datepicker.calendarFooterComponent\"\r\n    [selected]=\"datepicker._selected\"\r\n    [dateClass]=\"datepicker.dateClass\"\r\n    [@fadeInCalendar]=\"'enter'\"\r\n    (selectedChange)=\"datepicker.select($event)\"\r\n    (yearSelected)=\"datepicker._selectYear($event)\"\r\n    (monthSelected)=\"datepicker._selectMonth($event)\"\r\n    [beginDate]=\"datepicker._beginDate\"\r\n    [endDate]=\"datepicker._endDate\"\r\n    [rangeMode]=\"datepicker.rangeMode\"\r\n    [closeAfterSelection]=\"datepicker.closeAfterSelection\"\r\n    [orderPeriodLabel]=\"datepicker.orderPeriodLabel\"\r\n    (dateRangesChange)=\"datepicker._selectRange($event)\"\r\n    (beginDateSelectedChange)=\"setBeginDateSelected($event)\"\r\n    (_userSelection)=\"close()\">\r\n</sat-calendar>\r\n",
                    host: {
                        'class': 'mat-datepicker-content',
                        '[@transformPanel]': '"enter"',
                        '[class.mat-datepicker-content-touch]': 'datepicker.touchUi',
                    },
                    animations: [
                        matDatepickerAnimations.transformPanel,
                        matDatepickerAnimations.fadeInCalendar,
                    ],
                    exportAs: 'matDatepickerContent',
                    encapsulation: i0.ViewEncapsulation.None,
                    changeDetection: i0.ChangeDetectionStrategy.OnPush,
                    inputs: ['color'],
                    styles: [".mat-datepicker-content{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12);display:block}.mat-datepicker-content .mat-calendar{height:354px;width:296px}.mat-datepicker-content-touch{box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12);display:block;margin:-24px;max-height:80vh;overflow:auto}.mat-datepicker-content-touch .mat-calendar{max-height:788px;max-width:750px;min-height:312px;min-width:250px}@media (orientation:landscape){.mat-datepicker-content-touch .mat-calendar{height:80vh;width:64vh}}@media (orientation:portrait){.mat-datepicker-content-touch .mat-calendar{height:100vw;width:80vw}}"]
                },] }
    ];
    SatDatepickerContent.ctorParameters = function () { return [
        { type: i0.ElementRef }
    ]; };
    SatDatepickerContent.propDecorators = {
        beginDateSelected: [{ type: i0.Output }],
        _calendar: [{ type: i0.ViewChild, args: [SatCalendar, { static: false },] }]
    };
    // TODO(mmalerba): We use a component instead of a directive here so the user can use implicit
    // template reference variables (e.g. #d vs #d="matDatepicker"). We can change this to a directive
    // if angular adds support for `exportAs: '$implicit'` on directives.
    /** Component responsible for managing the datepicker popup/dialog. */
    var SatDatepicker = /** @class */ (function () {
        function SatDatepicker(_dialog, _overlay, _ngZone, _viewContainerRef, scrollStrategy, _dateAdapter, _dir, _document) {
            this._dialog = _dialog;
            this._overlay = _overlay;
            this._ngZone = _ngZone;
            this._viewContainerRef = _viewContainerRef;
            this._dateAdapter = _dateAdapter;
            this._dir = _dir;
            this._document = _document;
            /** The view that the calendar should start in. */
            this.startView = 'month';
            this._touchUi = false;
            /**
             * Emits selected year in multiyear view.
             * This doesn't imply a change on the selected date.
             */
            this.yearSelected = new i0.EventEmitter();
            /**
             * Emits selected month in year view.
             * This doesn't imply a change on the selected date.
             */
            this.monthSelected = new i0.EventEmitter();
            /** Emits when the datepicker has been opened. */
            this.openedStream = new i0.EventEmitter();
            /** Emits when the datepicker has been closed. */
            this.closedStream = new i0.EventEmitter();
            /** Emits when the begin date has been selected. */
            this.beginDateSelected = new i0.EventEmitter();
            /** Enables datepicker closing after selection */
            this.closeAfterSelection = true;
            /** Enables datepicker MouseOver effect on range mode */
            this.rangeHoverEffect = true;
            /** In range mod, enable datepicker to select the first date selected as a one-day-range,
             * if the user closes the picker before selecting another date
             */
            this.selectFirstDateOnClose = false;
            /** Order the views when clicking on period label button */
            this.orderPeriodLabel = 'multi-year';
            this._opened = false;
            /** The id for the datepicker calendar. */
            this.id = "sat-datepicker-" + datepickerUid++;
            this._validSelected = null;
            /** The element that was focused before the datepicker was opened. */
            this._focusedElementBeforeOpen = null;
            /** Subscription to value changes in the associated input element. */
            this._inputSubscription = rxjs.Subscription.EMPTY;
            /** Emits when the datepicker is disabled. */
            this._disabledChange = new rxjs.Subject();
            /** Emits new selected date when selected date changes. */
            this._selectedChanged = new rxjs.Subject();
            /** Default color to fall back to if no value is set. */
            this.defaultColor = 'primary';
            if (!this._dateAdapter) {
                throw createMissingDateImplError('DateAdapter');
            }
            this._scrollStrategy = scrollStrategy;
        }
        Object.defineProperty(SatDatepicker.prototype, "rangeMode", {
            /** Whenever datepicker is for selecting range of dates. */
            get: function () {
                return this._rangeMode;
            },
            set: function (mode) {
                this._rangeMode = mode;
                if (this.rangeMode) {
                    this._validSelected = null;
                }
                else {
                    this._beginDate = this._endDate = null;
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatDatepicker.prototype, "beginDate", {
            /** Start of dates interval. */
            get: function () { return this._beginDate; },
            set: function (value) {
                this._validSelected = null;
                this._beginDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatDatepicker.prototype, "endDate", {
            /** End of dates interval. */
            get: function () { return this._endDate; },
            set: function (value) {
                this._validSelected = null;
                this._endDate = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatDatepicker.prototype, "startAt", {
            /** The date to open the calendar to initially. */
            get: function () {
                // If an explicit startAt is set we start there, otherwise we start at whatever the currently
                // selected value is.
                if (this.rangeMode) {
                    return this._startAt || (this._datepickerInput && this._datepickerInput.value ?
                        this._datepickerInput.value.begin : null);
                }
                return this._startAt || (this._datepickerInput ? this._datepickerInput.value : null);
            },
            set: function (value) {
                this._startAt = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatDatepicker.prototype, "color", {
            /** Color palette to use on the datepicker's calendar. */
            get: function () {
                return this._color ||
                    (this._datepickerInput ? this._datepickerInput._getThemePalette() : undefined);
            },
            set: function (value) {
                this._color = value;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatDatepicker.prototype, "touchUi", {
            /**
             * Whether the calendar UI is in touch mode. In touch mode the calendar opens in a dialog rather
             * than a popup and elements have more padding to allow for bigger touch targets.
             */
            get: function () { return this._touchUi; },
            set: function (value) {
                this._touchUi = coercion.coerceBooleanProperty(value);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatDatepicker.prototype, "disabled", {
            /** Whether the datepicker pop-up should be disabled. */
            get: function () {
                return this._disabled === undefined && this._datepickerInput ?
                    this._datepickerInput.disabled : !!this._disabled;
            },
            set: function (value) {
                var newValue = coercion.coerceBooleanProperty(value);
                if (newValue !== this._disabled) {
                    this._disabled = newValue;
                    this._disabledChange.next(newValue);
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatDatepicker.prototype, "opened", {
            /** Whether the calendar is open. */
            get: function () { return this._opened; },
            set: function (value) { value ? this.open() : this.close(); },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatDatepicker.prototype, "_selected", {
            /** The currently selected date. */
            get: function () { return this._validSelected; },
            set: function (value) { this._validSelected = value; },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatDatepicker.prototype, "_minDate", {
            /** The minimum selectable date. */
            get: function () {
                return this._datepickerInput && this._datepickerInput.min;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatDatepicker.prototype, "_maxDate", {
            /** The maximum selectable date. */
            get: function () {
                return this._datepickerInput && this._datepickerInput.max;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatDatepicker.prototype, "_dateFilter", {
            get: function () {
                return this._datepickerInput && this._datepickerInput._dateFilter;
            },
            enumerable: false,
            configurable: true
        });
        SatDatepicker.prototype.ngOnDestroy = function () {
            this.close();
            this._inputSubscription.unsubscribe();
            this._disabledChange.complete();
            if (this._popupRef) {
                this._popupRef.dispose();
                this._popupComponentRef = null;
            }
        };
        /** Selects the given date */
        SatDatepicker.prototype.select = function (date) {
            var oldValue = this._selected;
            this._selected = date;
            if (!this._dateAdapter.sameDate(oldValue, this._selected)) {
                this._selectedChanged.next(date);
            }
        };
        /** Selects the given date range */
        SatDatepicker.prototype._selectRange = function (dates) {
            this._beginDateSelected = null;
            if (!this._dateAdapter.sameDate(dates.begin, this.beginDate) ||
                !this._dateAdapter.sameDate(dates.end, this.endDate)) {
                this._selectedChanged.next(dates);
            }
            this._beginDate = dates.begin;
            this._endDate = dates.end;
        };
        /** Emits the selected year in multiyear view */
        SatDatepicker.prototype._selectYear = function (normalizedYear) {
            this.yearSelected.emit(normalizedYear);
        };
        /** Emits selected month in year view */
        SatDatepicker.prototype._selectMonth = function (normalizedMonth) {
            this.monthSelected.emit(normalizedMonth);
        };
        /**
         * Register an input with this datepicker.
         * @param input The datepicker input to register with this datepicker.
         */
        SatDatepicker.prototype._registerInput = function (input) {
            var _this = this;
            if (this._datepickerInput) {
                throw Error('A SatDatepicker can only be associated with a single input.');
            }
            this._datepickerInput = input;
            this._inputSubscription =
                this._datepickerInput._valueChange
                    .subscribe(function (value) {
                    if (value === null) {
                        _this.beginDate = _this.endDate = _this._selected = null;
                        return;
                    }
                    if (value && value.hasOwnProperty('begin') && value.hasOwnProperty('end')) {
                        value = value;
                        if (value.begin && value.end &&
                            _this._dateAdapter.compareDate(value.begin, value.end) <= 0) {
                            _this.beginDate = value.begin;
                            _this.endDate = value.end;
                        }
                        else {
                            _this.beginDate = _this.endDate = null;
                        }
                    }
                    else {
                        _this._selected = value;
                    }
                });
        };
        /** Open the calendar. */
        SatDatepicker.prototype.open = function () {
            if (this._opened || this.disabled) {
                return;
            }
            if (!this._datepickerInput) {
                throw Error('Attempted to open an SatDatepicker with no associated input.');
            }
            if (this._document) {
                this._focusedElementBeforeOpen = this._document.activeElement;
            }
            this.touchUi ? this._openAsDialog() : this._openAsPopup();
            this._opened = true;
            this.openedStream.emit();
        };
        /** Close the calendar. */
        SatDatepicker.prototype.close = function () {
            var _this = this;
            if (!this._opened) {
                return;
            }
            if (this._popupRef && this._popupRef.hasAttached()) {
                this._popupRef.detach();
            }
            if (this._dialogRef) {
                this._dialogRef.close();
                this._dialogRef = null;
            }
            if (this._calendarPortal && this._calendarPortal.isAttached) {
                this._calendarPortal.detach();
            }
            if (this._beginDateSelected && this.selectFirstDateOnClose) {
                this._selectRange({ begin: this._beginDateSelected, end: this._beginDateSelected });
            }
            var completeClose = function () {
                // The `_opened` could've been reset already if
                // we got two events in quick succession.
                if (_this._opened) {
                    _this._opened = false;
                    _this.closedStream.emit();
                    _this._focusedElementBeforeOpen = null;
                }
            };
            if (this._focusedElementBeforeOpen &&
                typeof this._focusedElementBeforeOpen.focus === 'function') {
                // Because IE moves focus asynchronously, we can't count on it being restored before we've
                // marked the datepicker as closed. If the event fires out of sequence and the element that
                // we're refocusing opens the datepicker on focus, the user could be stuck with not being
                // able to close the calendar at all. We work around it by making the logic, that marks
                // the datepicker as closed, async as well.
                this._focusedElementBeforeOpen.focus();
                setTimeout(completeClose);
            }
            else {
                completeClose();
            }
        };
        SatDatepicker.prototype.setBeginDateSelected = function (date) {
            this._beginDateSelected = date;
        };
        /** Open the calendar as a dialog. */
        SatDatepicker.prototype._openAsDialog = function () {
            var _this = this;
            // Usually this would be handled by `open` which ensures that we can only have one overlay
            // open at a time, however since we reset the variables in async handlers some overlays
            // may slip through if the user opens and closes multiple times in quick succession (e.g.
            // by holding down the enter key).
            if (this._dialogRef) {
                this._dialogRef.close();
            }
            this._dialogRef = this._dialog.open(SatDatepickerContent, {
                direction: this._dir ? this._dir.value : 'ltr',
                viewContainerRef: this._viewContainerRef,
                panelClass: 'mat-datepicker-dialog',
            });
            this._dialogRef.componentInstance.beginDateSelected.subscribe(function (beginDate) {
                _this.beginDateSelected.emit(beginDate);
            });
            this._dialogRef.afterClosed().subscribe(function () { return _this.close(); });
            this._dialogRef.componentInstance.datepicker = this;
            this._setColor();
        };
        /** Open the calendar as a popup. */
        SatDatepicker.prototype._openAsPopup = function () {
            var _this = this;
            if (!this._calendarPortal) {
                this._calendarPortal = new portal.ComponentPortal(SatDatepickerContent, this._viewContainerRef);
            }
            if (!this._popupRef) {
                this._createPopup();
            }
            if (!this._popupRef.hasAttached()) {
                this._popupComponentRef = this._popupRef.attach(this._calendarPortal);
                this._popupComponentRef.instance.datepicker = this;
                this._popupComponentRef.instance.beginDateSelected.subscribe(function (beginDate) {
                    _this.beginDateSelected.emit(beginDate);
                });
                this._setColor();
                // Update the position once the calendar has rendered.
                this._ngZone.onStable.asObservable().pipe(operators.take(1)).subscribe(function () {
                    _this._popupRef.updatePosition();
                });
            }
        };
        /** Create the popup. */
        SatDatepicker.prototype._createPopup = function () {
            var _this = this;
            var overlayConfig = new overlay.OverlayConfig({
                positionStrategy: this._createPopupPositionStrategy(),
                hasBackdrop: true,
                backdropClass: 'mat-overlay-transparent-backdrop',
                direction: this._dir,
                scrollStrategy: this._scrollStrategy(),
                panelClass: 'mat-datepicker-popup',
            });
            this._popupRef = this._overlay.create(overlayConfig);
            this._popupRef.overlayElement.setAttribute('role', 'dialog');
            rxjs.merge(this._popupRef.backdropClick(), this._popupRef.detachments(), this._popupRef.keydownEvents().pipe(operators.filter(function (event) {
                // Closing on alt + up is only valid when there's an input associated with the datepicker.
                return event.keyCode === keycodes.ESCAPE ||
                    (_this._datepickerInput && event.altKey && event.keyCode === keycodes.UP_ARROW);
            }))).subscribe(function (event) {
                if (event) {
                    event.preventDefault();
                }
                _this.close();
            });
        };
        /** Create the popup PositionStrategy. */
        SatDatepicker.prototype._createPopupPositionStrategy = function () {
            return this._overlay.position()
                .flexibleConnectedTo(this._datepickerInput.getConnectedOverlayOrigin())
                .withTransformOriginOn('.mat-datepicker-content')
                .withFlexibleDimensions(false)
                .withViewportMargin(8)
                .withLockedPosition()
                .withPositions([
                {
                    originX: 'start',
                    originY: 'bottom',
                    overlayX: 'start',
                    overlayY: 'top'
                },
                {
                    originX: 'start',
                    originY: 'top',
                    overlayX: 'start',
                    overlayY: 'bottom'
                },
                {
                    originX: 'end',
                    originY: 'bottom',
                    overlayX: 'end',
                    overlayY: 'top'
                },
                {
                    originX: 'end',
                    originY: 'top',
                    overlayX: 'end',
                    overlayY: 'bottom'
                }
            ]);
        };
        /**
         * @param obj The object to check.
         * @returns The given object if it is both a date instance and valid, otherwise null.
         */
        SatDatepicker.prototype._getValidDateOrNull = function (obj) {
            return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
        };
        /** Passes the current theme color along to the calendar overlay. */
        SatDatepicker.prototype._setColor = function () {
            var color = this.color;
            if (this._popupComponentRef) {
                this._popupComponentRef.instance.color = color;
            }
            if (this._dialogRef) {
                this._dialogRef.componentInstance.color = color;
            }
        };
        return SatDatepicker;
    }());
    SatDatepicker.decorators = [
        { type: i0.Component, args: [{
                    selector: 'sat-datepicker',
                    template: '',
                    exportAs: 'matDatepicker',
                    changeDetection: i0.ChangeDetectionStrategy.OnPush,
                    encapsulation: i0.ViewEncapsulation.None
                },] }
    ];
    SatDatepicker.ctorParameters = function () { return [
        { type: dialog.MatDialog },
        { type: overlay.Overlay },
        { type: i0.NgZone },
        { type: i0.ViewContainerRef },
        { type: undefined, decorators: [{ type: i0.Inject, args: [MAT_DATEPICKER_SCROLL_STRATEGY,] }] },
        { type: DateAdapter, decorators: [{ type: i0.Optional }] },
        { type: bidi.Directionality, decorators: [{ type: i0.Optional }] },
        { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [common.DOCUMENT,] }] }
    ]; };
    SatDatepicker.propDecorators = {
        rangeMode: [{ type: i0.Input }],
        beginDate: [{ type: i0.Input }],
        endDate: [{ type: i0.Input }],
        calendarHeaderComponent: [{ type: i0.Input }],
        calendarFooterComponent: [{ type: i0.Input }],
        startAt: [{ type: i0.Input }],
        startView: [{ type: i0.Input }],
        color: [{ type: i0.Input }],
        touchUi: [{ type: i0.Input }],
        disabled: [{ type: i0.Input }],
        yearSelected: [{ type: i0.Output }],
        monthSelected: [{ type: i0.Output }],
        panelClass: [{ type: i0.Input }],
        dateClass: [{ type: i0.Input }],
        openedStream: [{ type: i0.Output, args: ['opened',] }],
        closedStream: [{ type: i0.Output, args: ['closed',] }],
        beginDateSelected: [{ type: i0.Output }],
        closeAfterSelection: [{ type: i0.Input }],
        rangeHoverEffect: [{ type: i0.Input }],
        selectFirstDateOnClose: [{ type: i0.Input }],
        orderPeriodLabel: [{ type: i0.Input }],
        opened: [{ type: i0.Input }]
    };

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** @docs-private */
    var MAT_DATEPICKER_VALUE_ACCESSOR = {
        provide: forms.NG_VALUE_ACCESSOR,
        useExisting: i0.forwardRef(function () { return SatDatepickerInput; }),
        multi: true
    };
    /** @docs-private */
    var MAT_DATEPICKER_VALIDATORS = {
        provide: forms.NG_VALIDATORS,
        useExisting: i0.forwardRef(function () { return SatDatepickerInput; }),
        multi: true
    };
    /**
     * An event used for datepicker input and change events. We don't always have access to a native
     * input or change event because the event may have been triggered by the user clicking on the
     * calendar popup. For consistency, we always use SatDatepickerInputEvent instead.
     */
    var SatDatepickerInputEvent = /** @class */ (function () {
        function SatDatepickerInputEvent(
        /** Reference to the datepicker input component that emitted the event. */
        target, 
        /** Reference to the native input element associated with the datepicker input. */
        targetElement) {
            this.target = target;
            this.targetElement = targetElement;
            this.value = this.target.value;
        }
        return SatDatepickerInputEvent;
    }());
    /** Directive used to connect an input to a SatDatepicker. */
    var SatDatepickerInput = /** @class */ (function () {
        function SatDatepickerInput(_elementRef, _dateAdapter, _dateFormats, _formField) {
            var _this = this;
            this._elementRef = _elementRef;
            this._dateAdapter = _dateAdapter;
            this._dateFormats = _dateFormats;
            this._formField = _formField;
            /** Emits when a `change` event is fired on this `<input>`. */
            this.dateChange = new i0.EventEmitter();
            /** Emits when an `input` event is fired on this `<input>`. */
            this.dateInput = new i0.EventEmitter();
            /** Emits when the value changes (either due to user input or programmatic change). */
            this._valueChange = new i0.EventEmitter();
            /** Emits when the disabled state has changed */
            this._disabledChange = new i0.EventEmitter();
            this._onTouched = function () { };
            this._cvaOnChange = function () { };
            this._validatorOnChange = function () { };
            this._datepickerSubscription = rxjs.Subscription.EMPTY;
            this._localeSubscription = rxjs.Subscription.EMPTY;
            /** The form control validator for whether the input parses. */
            this._parseValidator = function () {
                return _this._lastValueValid ?
                    null : { 'matDatepickerParse': { 'text': _this._elementRef.nativeElement.value } };
            };
            /** The form control validator for the min date. */
            this._minValidator = function (control) {
                if (_this._datepicker.rangeMode && control.value) {
                    var beginDate = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value.begin));
                    var endDate = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value.end));
                    if (_this.min) {
                        if (beginDate && _this._dateAdapter.compareDate(_this.min, beginDate) > 0) {
                            return { 'matDatepickerMin': { 'min': _this.min, 'actual': beginDate } };
                        }
                        if (endDate && _this._dateAdapter.compareDate(_this.min, endDate) > 0) {
                            return { 'matDatepickerMin': { 'min': _this.min, 'actual': endDate } };
                        }
                    }
                    return null;
                }
                var controlValue = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value));
                return (!_this.min || !controlValue ||
                    _this._dateAdapter.compareDate(_this.min, controlValue) <= 0) ?
                    null : { 'matDatepickerMin': { 'min': _this.min, 'actual': controlValue } };
            };
            /** The form control validator for the max date. */
            this._maxValidator = function (control) {
                if (_this._datepicker.rangeMode && control.value) {
                    var beginDate = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value.begin));
                    var endDate = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value.end));
                    if (_this.max) {
                        if (beginDate && _this._dateAdapter.compareDate(_this.max, beginDate) < 0) {
                            return { 'matDatepickerMax': { 'max': _this.max, 'actual': beginDate } };
                        }
                        if (endDate && _this._dateAdapter.compareDate(_this.max, endDate) < 0) {
                            return { 'matDatepickerMax': { 'max': _this.max, 'actual': endDate } };
                        }
                    }
                    return null;
                }
                var controlValue = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value));
                return (!_this.max || !controlValue ||
                    _this._dateAdapter.compareDate(_this.max, controlValue) >= 0) ?
                    null : { 'matDatepickerMax': { 'max': _this.max, 'actual': controlValue } };
            };
            /** The form control validator for the date filter. */
            this._filterValidator = function (control) {
                if (_this._datepicker.rangeMode && control.value) {
                    var beginDate = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value.begin));
                    var endDate = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value.end));
                    return !_this._dateFilter || !beginDate && !endDate ||
                        _this._dateFilter(beginDate) && _this._dateFilter(endDate) ?
                        null : { 'matDatepickerFilter': true };
                }
                var controlValue = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value));
                return !_this._dateFilter || !controlValue || _this._dateFilter(controlValue) ?
                    null : { 'matDatepickerFilter': true };
            };
            /** The form control validator for the date filter. */
            this._rangeValidator = function (control) {
                if (_this._datepicker.rangeMode && control.value) {
                    var beginDate = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value.begin));
                    var endDate = _this._getValidDateOrNull(_this._dateAdapter.deserialize(control.value.end));
                    return !beginDate || !endDate || _this._dateAdapter.compareDate(beginDate, endDate) <= 0 ?
                        null : { 'matDatepickerRange': true };
                }
                return null;
            };
            /** The combined form control validator for this input. */
            this._validator = forms.Validators.compose([this._parseValidator, this._minValidator, this._maxValidator,
                this._filterValidator, this._rangeValidator]);
            /** Whether the last value set on the input was valid. */
            this._lastValueValid = false;
            if (!this._dateAdapter) {
                throw createMissingDateImplError('DateAdapter');
            }
            if (!this._dateFormats) {
                throw createMissingDateImplError('MAT_DATE_FORMATS');
            }
            // Update the displayed date when the locale changes.
            this._localeSubscription = _dateAdapter.localeChanges.subscribe(function () {
                _this.value = _this.value;
            });
        }
        Object.defineProperty(SatDatepickerInput.prototype, "satDatepicker", {
            /** The datepicker that this input is associated with. */
            set: function (value) {
                var _this = this;
                if (!value) {
                    return;
                }
                this._datepicker = value;
                this._datepicker._registerInput(this);
                this._datepickerSubscription.unsubscribe();
                this._datepickerSubscription = this._datepicker._selectedChanged.subscribe(function (selected) {
                    _this.value = selected;
                    _this._cvaOnChange(selected);
                    _this._onTouched();
                    _this.dateInput.emit(new SatDatepickerInputEvent(_this, _this._elementRef.nativeElement));
                    _this.dateChange.emit(new SatDatepickerInputEvent(_this, _this._elementRef.nativeElement));
                });
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatDatepickerInput.prototype, "matDatepickerFilter", {
            /** Function that can be used to filter out dates within the datepicker. */
            set: function (value) {
                this._dateFilter = value;
                this._validatorOnChange();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatDatepickerInput.prototype, "value", {
            /** The value of the input. */
            get: function () {
                return this._value;
            },
            set: function (value) {
                if (value && value.hasOwnProperty('begin') && value.hasOwnProperty('end')) {
                    /** Range mode */
                    var rangeValue = value;
                    rangeValue.begin = this._dateAdapter.deserialize(rangeValue.begin);
                    rangeValue.end = this._dateAdapter.deserialize(rangeValue.end);
                    this._lastValueValid = !rangeValue.begin || !rangeValue.end ||
                        this._dateAdapter.isValid(rangeValue.begin) && this._dateAdapter.isValid(rangeValue.end);
                    rangeValue.begin = this._getValidDateOrNull(rangeValue.begin);
                    rangeValue.end = this._getValidDateOrNull(rangeValue.end);
                    var oldDate = this.value;
                    this._elementRef.nativeElement.value =
                        rangeValue && rangeValue.begin && rangeValue.end
                            ? this._dateAdapter.format(rangeValue.begin, this._dateFormats.display.dateInput) +
                                ' - ' +
                                this._dateAdapter.format(rangeValue.end, this._dateFormats.display.dateInput)
                            : '';
                    if (oldDate == null && rangeValue != null || oldDate != null && rangeValue == null ||
                        !this._dateAdapter.sameDate(oldDate.begin, rangeValue.begin) ||
                        !this._dateAdapter.sameDate(oldDate.end, rangeValue.end)) {
                        if (rangeValue.end && rangeValue.begin &&
                            this._dateAdapter
                                .compareDate(rangeValue.begin, rangeValue.end) > 0) { // if begin > end
                            value = null;
                        }
                        this._value = value;
                        this._valueChange.emit(value);
                    }
                }
                else {
                    /** Not range mode */
                    value = this._dateAdapter.deserialize(value);
                    this._lastValueValid = !value || this._dateAdapter.isValid(value);
                    value = this._getValidDateOrNull(value);
                    var oldDate = this.value;
                    this._value = value;
                    this._elementRef.nativeElement.value =
                        value ? this._dateAdapter.format(value, this._dateFormats.display.dateInput) : '';
                    if (!this._dateAdapter.sameDate(oldDate, value)) {
                        this._valueChange.emit(value);
                    }
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatDatepickerInput.prototype, "min", {
            /** The minimum valid date. */
            get: function () { return this._min; },
            set: function (value) {
                this._min = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
                this._validatorOnChange();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatDatepickerInput.prototype, "max", {
            /** The maximum valid date. */
            get: function () { return this._max; },
            set: function (value) {
                this._max = this._getValidDateOrNull(this._dateAdapter.deserialize(value));
                this._validatorOnChange();
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(SatDatepickerInput.prototype, "disabled", {
            /** Whether the datepicker-input is disabled. */
            get: function () { return !!this._disabled; },
            set: function (value) {
                var newValue = coercion.coerceBooleanProperty(value);
                var element = this._elementRef.nativeElement;
                if (this._disabled !== newValue) {
                    this._disabled = newValue;
                    this._disabledChange.emit(newValue);
                }
                // We need to null check the `blur` method, because it's undefined during SSR.
                if (newValue && element.blur) {
                    // Normally, native input elements automatically blur if they turn disabled. This behavior
                    // is problematic, because it would mean that it triggers another change detection cycle,
                    // which then causes a changed after checked error if the input element was focused before.
                    element.blur();
                }
            },
            enumerable: false,
            configurable: true
        });
        SatDatepickerInput.prototype.ngOnDestroy = function () {
            this._datepickerSubscription.unsubscribe();
            this._localeSubscription.unsubscribe();
            this._valueChange.complete();
            this._disabledChange.complete();
        };
        /** @docs-private */
        SatDatepickerInput.prototype.registerOnValidatorChange = function (fn) {
            this._validatorOnChange = fn;
        };
        /** @docs-private */
        SatDatepickerInput.prototype.validate = function (c) {
            return this._validator ? this._validator(c) : null;
        };
        /**
         * @deprecated
         * @breaking-change 8.0.0 Use `getConnectedOverlayOrigin` instead
         */
        SatDatepickerInput.prototype.getPopupConnectionElementRef = function () {
            return this.getConnectedOverlayOrigin();
        };
        /**
         * Gets the element that the datepicker popup should be connected to.
         * @return The element to connect the popup to.
         */
        SatDatepickerInput.prototype.getConnectedOverlayOrigin = function () {
            return this._formField ? this._formField.getConnectedOverlayOrigin() : this._elementRef;
        };
        // Implemented as part of ControlValueAccessor
        SatDatepickerInput.prototype.writeValue = function (value) {
            this.value = value;
        };
        // Implemented as part of ControlValueAccessor.
        SatDatepickerInput.prototype.registerOnChange = function (fn) {
            this._cvaOnChange = fn;
        };
        // Implemented as part of ControlValueAccessor.
        SatDatepickerInput.prototype.registerOnTouched = function (fn) {
            this._onTouched = fn;
        };
        // Implemented as part of ControlValueAccessor.
        SatDatepickerInput.prototype.setDisabledState = function (isDisabled) {
            this.disabled = isDisabled;
        };
        SatDatepickerInput.prototype._onKeydown = function (event) {
            var isAltDownArrow = event.altKey && event.keyCode === keycodes.DOWN_ARROW;
            if (this._datepicker && isAltDownArrow && !this._elementRef.nativeElement.readOnly) {
                this._datepicker.open();
                event.preventDefault();
            }
        };
        SatDatepickerInput.prototype._onInput = function (value) {
            var date = null;
            if (this._datepicker.rangeMode) {
                var parts = value.split('-');
                if (parts.length > 1) {
                    var position = Math.floor(parts.length / 2);
                    var beginDateString = parts.slice(0, position).join('-');
                    var endDateString = parts.slice(position).join('-');
                    var beginDate = this._dateAdapter.parse(beginDateString, this._dateFormats.parse.dateInput);
                    var endDate = this._dateAdapter.parse(endDateString, this._dateFormats.parse.dateInput);
                    this._lastValueValid = !beginDate || !endDate || this._dateAdapter.isValid(beginDate) &&
                        this._dateAdapter.isValid(endDate);
                    beginDate = this._getValidDateOrNull(beginDate);
                    endDate = this._getValidDateOrNull(endDate);
                    if (beginDate && endDate) {
                        date = { begin: beginDate, end: endDate };
                    }
                }
            }
            else {
                date = this._dateAdapter.parse(value, this._dateFormats.parse.dateInput);
                this._lastValueValid = !date || this._dateAdapter.isValid(date);
                date = this._getValidDateOrNull(date);
            }
            this._value = date;
            this._cvaOnChange(date);
            this._valueChange.emit(date);
            this.dateInput.emit(new SatDatepickerInputEvent(this, this._elementRef.nativeElement));
        };
        SatDatepickerInput.prototype._onChange = function () {
            this.dateChange.emit(new SatDatepickerInputEvent(this, this._elementRef.nativeElement));
        };
        /** Returns the palette used by the input's form field, if any. */
        SatDatepickerInput.prototype._getThemePalette = function () {
            return this._formField ? this._formField.color : undefined;
        };
        /** Handles blur events on the input. */
        SatDatepickerInput.prototype._onBlur = function () {
            // Reformat the input only if we have a valid value.
            if (this.value) {
                this._formatValue(this.value);
            }
            this._onTouched();
        };
        /** Formats a value and sets it on the input element. */
        SatDatepickerInput.prototype._formatValue = function (value) {
            if (value && value.hasOwnProperty('begin') && value.hasOwnProperty('end')) {
                value = value;
                this._elementRef.nativeElement.value =
                    value && value.begin && value.end
                        ? this._dateAdapter.format(value.begin, this._dateFormats.display.dateInput) +
                            ' - ' +
                            this._dateAdapter.format(value.end, this._dateFormats.display.dateInput)
                        : '';
            }
            else {
                value = value;
                this._elementRef.nativeElement.value =
                    value ? this._dateAdapter.format(value, this._dateFormats.display.dateInput) : '';
            }
        };
        /**
         * @param obj The object to check.
         * @returns The given object if it is both a date instance and valid, otherwise null.
         */
        SatDatepickerInput.prototype._getValidDateOrNull = function (obj) {
            return (this._dateAdapter.isDateInstance(obj) && this._dateAdapter.isValid(obj)) ? obj : null;
        };
        return SatDatepickerInput;
    }());
    SatDatepickerInput.decorators = [
        { type: i0.Directive, args: [{
                    selector: 'input[satDatepicker]',
                    providers: [
                        MAT_DATEPICKER_VALUE_ACCESSOR,
                        MAT_DATEPICKER_VALIDATORS,
                        { provide: input.MAT_INPUT_VALUE_ACCESSOR, useExisting: SatDatepickerInput },
                    ],
                    host: {
                        '[attr.aria-haspopup]': '_datepicker ? "dialog" : null',
                        '[attr.aria-owns]': '(_datepicker?.opened && _datepicker.id) || null',
                        '[attr.min]': 'min ? _dateAdapter.toIso8601(min) : null',
                        '[attr.max]': 'max ? _dateAdapter.toIso8601(max) : null',
                        '[disabled]': 'disabled',
                        '(input)': '_onInput($event.target.value)',
                        '(change)': '_onChange()',
                        '(blur)': '_onBlur()',
                        '(keydown)': '_onKeydown($event)',
                    },
                    exportAs: 'matDatepickerInput',
                },] }
    ];
    SatDatepickerInput.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: DateAdapter, decorators: [{ type: i0.Optional }] },
        { type: undefined, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [MAT_DATE_FORMATS,] }] },
        { type: formField.MatFormField, decorators: [{ type: i0.Optional }] }
    ]; };
    SatDatepickerInput.propDecorators = {
        satDatepicker: [{ type: i0.Input }],
        matDatepickerFilter: [{ type: i0.Input }],
        value: [{ type: i0.Input }],
        min: [{ type: i0.Input }],
        max: [{ type: i0.Input }],
        disabled: [{ type: i0.Input }],
        dateChange: [{ type: i0.Output }],
        dateInput: [{ type: i0.Output }]
    };

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    /** Can be used to override the icon of a `matDatepickerToggle`. */
    var SatDatepickerToggleIcon = /** @class */ (function () {
        function SatDatepickerToggleIcon() {
        }
        return SatDatepickerToggleIcon;
    }());
    SatDatepickerToggleIcon.decorators = [
        { type: i0.Directive, args: [{
                    selector: '[matDatepickerToggleIcon]'
                },] }
    ];
    var SatDatepickerToggle = /** @class */ (function () {
        function SatDatepickerToggle(_intl, _changeDetectorRef, defaultTabIndex) {
            this._intl = _intl;
            this._changeDetectorRef = _changeDetectorRef;
            this._stateChanges = rxjs.Subscription.EMPTY;
            var parsedTabIndex = Number(defaultTabIndex);
            this.tabIndex = (parsedTabIndex || parsedTabIndex === 0) ? parsedTabIndex : null;
        }
        Object.defineProperty(SatDatepickerToggle.prototype, "disabled", {
            /** Whether the toggle button is disabled. */
            get: function () {
                if (this._disabled === undefined && this.datepicker) {
                    return this.datepicker.disabled;
                }
                return !!this._disabled;
            },
            set: function (value) {
                this._disabled = coercion.coerceBooleanProperty(value);
            },
            enumerable: false,
            configurable: true
        });
        SatDatepickerToggle.prototype.ngOnChanges = function (changes) {
            if (changes['datepicker']) {
                this._watchStateChanges();
            }
        };
        SatDatepickerToggle.prototype.ngOnDestroy = function () {
            this._stateChanges.unsubscribe();
        };
        SatDatepickerToggle.prototype.ngAfterContentInit = function () {
            this._watchStateChanges();
        };
        SatDatepickerToggle.prototype._open = function (event) {
            if (this.datepicker && !this.disabled) {
                this.datepicker.open();
                event.stopPropagation();
            }
        };
        SatDatepickerToggle.prototype._watchStateChanges = function () {
            var _this = this;
            var datepickerDisabled = this.datepicker ? this.datepicker._disabledChange : rxjs.of();
            var inputDisabled = this.datepicker && this.datepicker._datepickerInput ?
                this.datepicker._datepickerInput._disabledChange : rxjs.of();
            var datepickerToggled = this.datepicker ?
                rxjs.merge(this.datepicker.openedStream, this.datepicker.closedStream) :
                rxjs.of();
            this._stateChanges.unsubscribe();
            this._stateChanges = rxjs.merge(this._intl.changes, datepickerDisabled, inputDisabled, datepickerToggled).subscribe(function () { return _this._changeDetectorRef.markForCheck(); });
        };
        return SatDatepickerToggle;
    }());
    SatDatepickerToggle.decorators = [
        { type: i0.Component, args: [{
                    selector: 'sat-datepicker-toggle',
                    template: "<button\r\n  #button\r\n  mat-icon-button\r\n  type=\"button\"\r\n  [attr.aria-haspopup]=\"datepicker ? 'dialog' : null\"\r\n  [attr.aria-label]=\"_intl.openCalendarLabel\"\r\n  [attr.tabindex]=\"disabled ? -1 : tabIndex\"\r\n  [disabled]=\"disabled\"\r\n  [disableRipple]=\"disableRipple\"\r\n  (click)=\"_open($event)\">\r\n\r\n  <svg\r\n    *ngIf=\"!_customIcon\"\r\n    class=\"mat-datepicker-toggle-default-icon\"\r\n    viewBox=\"0 0 24 24\"\r\n    width=\"24px\"\r\n    height=\"24px\"\r\n    fill=\"currentColor\"\r\n    focusable=\"false\">\r\n    <path d=\"M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z\"/>\r\n  </svg>\r\n\r\n  <ng-content select=\"[matDatepickerToggleIcon]\"></ng-content>\r\n</button>\r\n",
                    host: {
                        'class': 'mat-datepicker-toggle',
                        // Always set the tabindex to -1 so that it doesn't overlap with any custom tabindex the
                        // consumer may have provided, while still being able to receive focus.
                        '[attr.tabindex]': '-1',
                        '[class.mat-datepicker-toggle-active]': 'datepicker && datepicker.opened',
                        '[class.mat-accent]': 'datepicker && datepicker.color === "accent"',
                        '[class.mat-warn]': 'datepicker && datepicker.color === "warn"',
                        '(focus)': '_button.focus()',
                    },
                    exportAs: 'matDatepickerToggle',
                    encapsulation: i0.ViewEncapsulation.None,
                    changeDetection: i0.ChangeDetectionStrategy.OnPush,
                    styles: [".mat-form-field-appearance-legacy .mat-form-field-prefix .mat-datepicker-toggle-default-icon,.mat-form-field-appearance-legacy .mat-form-field-suffix .mat-datepicker-toggle-default-icon{width:1em}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-datepicker-toggle-default-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-datepicker-toggle-default-icon{display:block;height:1.5em;width:1.5em}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button .mat-datepicker-toggle-default-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button .mat-datepicker-toggle-default-icon{margin:auto}"]
                },] }
    ];
    SatDatepickerToggle.ctorParameters = function () { return [
        { type: SatDatepickerIntl },
        { type: i0.ChangeDetectorRef },
        { type: String, decorators: [{ type: i0.Attribute, args: ['tabindex',] }] }
    ]; };
    SatDatepickerToggle.propDecorators = {
        datepicker: [{ type: i0.Input, args: ['for',] }],
        tabIndex: [{ type: i0.Input }],
        disabled: [{ type: i0.Input }],
        disableRipple: [{ type: i0.Input }],
        _customIcon: [{ type: i0.ContentChild, args: [SatDatepickerToggleIcon, { static: false },] }],
        _button: [{ type: i0.ViewChild, args: ['button', { static: false },] }]
    };

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */
    var SatDatepickerModule = /** @class */ (function () {
        function SatDatepickerModule() {
        }
        return SatDatepickerModule;
    }());
    SatDatepickerModule.decorators = [
        { type: i0.NgModule, args: [{
                    imports: [
                        common.CommonModule,
                        button.MatButtonModule,
                        dialog.MatDialogModule,
                        overlay.OverlayModule,
                        a11y.A11yModule,
                        portal.PortalModule,
                    ],
                    exports: [
                        SatCalendar,
                        SatCalendarBody,
                        SatDatepicker,
                        SatDatepickerContent,
                        SatDatepickerInput,
                        SatDatepickerToggle,
                        SatDatepickerToggleIcon,
                        SatMonthView,
                        SatYearView,
                        SatMultiYearView,
                        SatCalendarHeader,
                        SatCalendarFooter,
                    ],
                    declarations: [
                        SatCalendar,
                        SatCalendarBody,
                        SatDatepicker,
                        SatDatepickerContent,
                        SatDatepickerInput,
                        SatDatepickerToggle,
                        SatDatepickerToggleIcon,
                        SatMonthView,
                        SatYearView,
                        SatMultiYearView,
                        SatCalendarHeader,
                        SatCalendarFooter,
                    ],
                    providers: [
                        SatDatepickerIntl,
                        MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER,
                    ],
                    entryComponents: [
                        SatDatepickerContent,
                        SatCalendarHeader,
                        SatCalendarFooter,
                    ]
                },] }
    ];

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * @license
     * Copyright Google LLC All Rights Reserved.
     *
     * Use of this source code is governed by an MIT-style license that can be
     * found in the LICENSE file at https://angular.io/license
     */

    /**
     * Generated bundle index. Do not edit.
     */

    exports.DateAdapter = DateAdapter;
    exports.MAT_DATEPICKER_SCROLL_STRATEGY = MAT_DATEPICKER_SCROLL_STRATEGY;
    exports.MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY = MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY;
    exports.MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER = MAT_DATEPICKER_SCROLL_STRATEGY_FACTORY_PROVIDER;
    exports.MAT_DATEPICKER_VALIDATORS = MAT_DATEPICKER_VALIDATORS;
    exports.MAT_DATEPICKER_VALUE_ACCESSOR = MAT_DATEPICKER_VALUE_ACCESSOR;
    exports.MAT_DATE_FORMATS = MAT_DATE_FORMATS;
    exports.MAT_DATE_LOCALE = MAT_DATE_LOCALE;
    exports.MAT_DATE_LOCALE_FACTORY = MAT_DATE_LOCALE_FACTORY;
    exports.MAT_DATE_LOCALE_PROVIDER = MAT_DATE_LOCALE_PROVIDER;
    exports.MAT_NATIVE_DATE_FORMATS = MAT_NATIVE_DATE_FORMATS;
    exports.NativeDateAdapter = NativeDateAdapter;
    exports.NativeDateModule = NativeDateModule;
    exports.SatCalendar = SatCalendar;
    exports.SatCalendarBody = SatCalendarBody;
    exports.SatCalendarCell = SatCalendarCell;
    exports.SatCalendarFooter = SatCalendarFooter;
    exports.SatCalendarHeader = SatCalendarHeader;
    exports.SatDatepicker = SatDatepicker;
    exports.SatDatepickerContent = SatDatepickerContent;
    exports.SatDatepickerInput = SatDatepickerInput;
    exports.SatDatepickerInputEvent = SatDatepickerInputEvent;
    exports.SatDatepickerIntl = SatDatepickerIntl;
    exports.SatDatepickerModule = SatDatepickerModule;
    exports.SatDatepickerToggle = SatDatepickerToggle;
    exports.SatDatepickerToggleIcon = SatDatepickerToggleIcon;
    exports.SatMonthView = SatMonthView;
    exports.SatMultiYearView = SatMultiYearView;
    exports.SatNativeDateModule = SatNativeDateModule;
    exports.SatYearView = SatYearView;
    exports.matDatepickerAnimations = matDatepickerAnimations;
    exports.yearsPerPage = yearsPerPage;
    exports.yearsPerRow = yearsPerRow;
    exports.ɵ0 = ɵ0$1;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=saturn-datepicker.umd.js.map
