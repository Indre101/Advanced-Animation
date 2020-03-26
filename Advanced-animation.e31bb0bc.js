// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
  typeof module === "object" ? module.exports : {}
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  Function("r", "regeneratorRuntime = r")(runtime);
}

},{}],"node_modules/@babel/runtime/regenerator/index.js":[function(require,module,exports) {
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":"node_modules/regenerator-runtime/runtime.js"}],"node_modules/@babel/runtime/helpers/asyncToGenerator.js":[function(require,module,exports) {
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

module.exports = _asyncToGenerator;
},{}],"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;

function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }

  return bundleURL;
}

function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);

    if (matches) {
      return getBaseURL(matches[0]);
    }
  }

  return '/';
}

function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)\/[^/]+$/, '$1') + '/';
}

exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/css-loader.js":[function(require,module,exports) {
var bundle = require('./bundle-url');

function updateLink(link) {
  var newLink = link.cloneNode();

  newLink.onload = function () {
    link.remove();
  };

  newLink.href = link.href.split('?')[0] + '?' + Date.now();
  link.parentNode.insertBefore(newLink, link.nextSibling);
}

var cssTimeout = null;

function reloadCSS() {
  if (cssTimeout) {
    return;
  }

  cssTimeout = setTimeout(function () {
    var links = document.querySelectorAll('link[rel="stylesheet"]');

    for (var i = 0; i < links.length; i++) {
      if (bundle.getBaseURL(links[i].href) === bundle.getBundleURL()) {
        updateLink(links[i]);
      }
    }

    cssTimeout = null;
  }, 50);
}

module.exports = reloadCSS;
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"style.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"./static/font/Montserrat/Montserrat-Regular.ttf":[["Montserrat-Regular.55f9fd62.ttf","static/font/Montserrat/Montserrat-Regular.ttf"],"static/font/Montserrat/Montserrat-Regular.ttf"],"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"levelTwoAndThree.scss":[function(require,module,exports) {
var reloadCSS = require('_css_loader');

module.hot.dispose(reloadCSS);
module.hot.accept(reloadCSS);
},{"_css_loader":"node_modules/parcel-bundler/src/builtins/css-loader.js"}],"modules/ImportJson.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GetJsonData = GetJsonData;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function GetJsonData(_x, _x2) {
  return _GetJsonData.apply(this, arguments);
}

function _GetJsonData() {
  _GetJsonData = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(index, part) {
    var response, json;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return fetch("data/data.json");

          case 2:
            response = _context.sent;
            _context.next = 5;
            return response.json();

          case 5:
            json = _context.sent;

            if (!(part == null)) {
              _context.next = 10;
              break;
            }

            return _context.abrupt("return", [json[index]]);

          case 10:
            if (!(index == null)) {
              _context.next = 14;
              break;
            }

            return _context.abrupt("return", [parts[part]]);

          case 14:
            return _context.abrupt("return", [json[index].parts[part]]);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _GetJsonData.apply(this, arguments);
}
},{"@babel/runtime/regenerator":"node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"node_modules/@babel/runtime/helpers/asyncToGenerator.js"}],"node_modules/gsap/gsap-core.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._getCache = exports._getSetter = exports._missingPlugin = exports._round = exports._roundModifier = exports._config = exports._ticker = exports._plugins = exports._checkPlugin = exports._replaceRandom = exports._colorStringFilter = exports._sortPropTweensByPriority = exports._forEachName = exports._removeLinkedListItem = exports._setDefaults = exports._relExp = exports._renderComplexString = exports._isUndefined = exports._isString = exports._numWithUnitExp = exports._numExp = exports._getProperty = exports.shuffle = exports.interpolate = exports.unitize = exports.pipe = exports.mapRange = exports.toArray = exports.splitColor = exports.clamp = exports.getUnit = exports.normalize = exports.snap = exports.random = exports.distribute = exports.wrapYoyo = exports.wrap = exports.Circ = exports.Expo = exports.Sine = exports.Bounce = exports.SteppedEase = exports.Back = exports.Elastic = exports.Strong = exports.Quint = exports.Quart = exports.Cubic = exports.Quad = exports.Linear = exports.Power4 = exports.Power3 = exports.Power2 = exports.Power1 = exports.Power0 = exports.default = exports.gsap = exports.PropTween = exports.TweenLite = exports.TweenMax = exports.Tween = exports.TimelineLite = exports.TimelineMax = exports.Timeline = exports.Animation = exports.GSCache = void 0;

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}
/*!
 * GSAP 3.2.4
 * https://greensock.com
 *
 * @license Copyright 2008-2020, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */


var _config = {
  autoSleep: 120,
  force3D: "auto",
  nullTargetWarn: 1,
  units: {
    lineHeight: ""
  }
},
    _defaults = {
  duration: .5,
  overwrite: false,
  delay: 0
},
    _bigNum = 1e8,
    _tinyNum = 1 / _bigNum,
    _2PI = Math.PI * 2,
    _HALF_PI = _2PI / 4,
    _gsID = 0,
    _sqrt = Math.sqrt,
    _cos = Math.cos,
    _sin = Math.sin,
    _isString = function _isString(value) {
  return typeof value === "string";
},
    _isFunction = function _isFunction(value) {
  return typeof value === "function";
},
    _isNumber = function _isNumber(value) {
  return typeof value === "number";
},
    _isUndefined = function _isUndefined(value) {
  return typeof value === "undefined";
},
    _isObject = function _isObject(value) {
  return typeof value === "object";
},
    _isNotFalse = function _isNotFalse(value) {
  return value !== false;
},
    _windowExists = function _windowExists() {
  return typeof window !== "undefined";
},
    _isFuncOrString = function _isFuncOrString(value) {
  return _isFunction(value) || _isString(value);
},
    _isArray = Array.isArray,
    _strictNumExp = /(?:-?\.?\d|\.)+/gi,
    //only numbers (including negatives and decimals) but NOT relative values.
_numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-\+]*\d*/g,
    //finds any numbers, including ones that start with += or -=, negative numbers, and ones in scientific notation like 1e-8.
_numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g,
    _complexStringNumExp = /[-+=.]*\d+(?:\.|e-|e)*\d*/gi,
    //duplicate so that while we're looping through matches from exec(), it doesn't contaminate the lastIndex of _numExp which we use to search for colors too.
_parenthesesExp = /\(([^()]+)\)/i,
    //finds the string between parentheses.
_relExp = /[+-]=-?[\.\d]+/,
    _delimitedValueExp = /[#\-+.]*\b[a-z\d-=+%.]+/gi,
    _globalTimeline,
    _win,
    _coreInitted,
    _doc,
    _globals = {},
    _installScope = {},
    _coreReady,
    _install = function _install(scope) {
  return (_installScope = _merge(scope, _globals)) && gsap;
},
    _missingPlugin = function _missingPlugin(property, value) {
  return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
},
    _warn = function _warn(message, suppress) {
  return !suppress && console.warn(message);
},
    _addGlobal = function _addGlobal(name, obj) {
  return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
},
    _emptyFunc = function _emptyFunc() {
  return 0;
},
    _reservedProps = {},
    _lazyTweens = [],
    _lazyLookup = {},
    _lastRenderedFrame,
    _plugins = {},
    _effects = {},
    _nextGCFrame = 30,
    _harnessPlugins = [],
    _callbackNames = "",
    _harness = function _harness(targets) {
  var target = targets[0],
      harnessPlugin,
      i;

  if (!_isObject(target) && !_isFunction(target)) {
    targets = [targets];
  }

  if (!(harnessPlugin = (target._gsap || {}).harness)) {
    i = _harnessPlugins.length;

    while (i-- && !_harnessPlugins[i].targetTest(target)) {}

    harnessPlugin = _harnessPlugins[i];
  }

  i = targets.length;

  while (i--) {
    targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1);
  }

  return targets;
},
    _getCache = function _getCache(target) {
  return target._gsap || _harness(toArray(target))[0]._gsap;
},
    _getProperty = function _getProperty(target, property) {
  var currentValue = target[property];
  return _isFunction(currentValue) ? target[property]() : _isUndefined(currentValue) && target.getAttribute(property) || currentValue;
},
    _forEachName = function _forEachName(names, func) {
  return (names = names.split(",")).forEach(func) || names;
},
    //split a comma-delimited list of names into an array, then run a forEach() function and return the split array (this is just a way to consolidate/shorten some code).
_round = function _round(value) {
  return Math.round(value * 100000) / 100000 || 0;
},
    _arrayContainsAny = function _arrayContainsAny(toSearch, toFind) {
  //searches one array to find matches for any of the items in the toFind array. As soon as one is found, it returns true. It does NOT return all the matches; it's simply a boolean search.
  var l = toFind.length,
      i = 0;

  for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l;) {}

  return i < l;
},
    _parseVars = function _parseVars(params, type, parent) {
  //reads the arguments passed to one of the key methods and figures out if the user is defining things with the OLD/legacy syntax where the duration is the 2nd parameter, and then it adjusts things accordingly and spits back the corrected vars object (with the duration added if necessary, as well as runBackwards or startAt or immediateRender). type 0 = to()/staggerTo(), 1 = from()/staggerFrom(), 2 = fromTo()/staggerFromTo()
  var isLegacy = _isNumber(params[1]),
      varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1),
      vars = params[varsIndex],
      irVars;

  if (isLegacy) {
    vars.duration = params[1];
  }

  vars.parent = parent;

  if (type) {
    irVars = vars;

    while (parent && !("immediateRender" in irVars)) {
      // inheritance hasn't happened yet, but someone may have set a default in an ancestor timeline. We could do vars.immediateRender = _isNotFalse(_inheritDefaults(vars).immediateRender) but that'd exact a slight performance penalty because _inheritDefaults() also runs in the Tween constructor. We're paying a small kb price here to gain speed.
      irVars = parent.vars.defaults || {};
      parent = _isNotFalse(parent.vars.inherit) && parent.parent;
    }

    vars.immediateRender = _isNotFalse(irVars.immediateRender);

    if (type < 2) {
      vars.runBackwards = 1;
    } else {
      vars.startAt = params[varsIndex - 1]; // "from" vars
    }
  }

  return vars;
},
    _lazyRender = function _lazyRender() {
  var l = _lazyTweens.length,
      a = _lazyTweens.slice(0),
      i,
      tween;

  _lazyLookup = {};
  _lazyTweens.length = 0;

  for (i = 0; i < l; i++) {
    tween = a[i];

    if (tween && tween._lazy) {
      tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0;
    }
  }
},
    _lazySafeRender = function _lazySafeRender(animation, time, suppressEvents, force) {
  if (_lazyTweens.length) {
    _lazyRender();
  }

  animation.render(time, suppressEvents, force);

  if (_lazyTweens.length) {
    //in case rendering caused any tweens to lazy-init, we should render them because typically when someone calls seek() or time() or progress(), they expect an immediate render.
    _lazyRender();
  }
},
    _numericIfPossible = function _numericIfPossible(value) {
  var n = parseFloat(value);
  return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : value;
},
    _passThrough = function _passThrough(p) {
  return p;
},
    _setDefaults = function _setDefaults(obj, defaults) {
  for (var p in defaults) {
    if (!(p in obj)) {
      obj[p] = defaults[p];
    }
  }

  return obj;
},
    _setKeyframeDefaults = function _setKeyframeDefaults(obj, defaults) {
  for (var p in defaults) {
    if (!(p in obj) && p !== "duration" && p !== "ease") {
      obj[p] = defaults[p];
    }
  }
},
    _merge = function _merge(base, toMerge) {
  for (var p in toMerge) {
    base[p] = toMerge[p];
  }

  return base;
},
    _mergeDeep = function _mergeDeep(base, toMerge) {
  for (var p in toMerge) {
    base[p] = _isObject(toMerge[p]) ? _mergeDeep(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p];
  }

  return base;
},
    _copyExcluding = function _copyExcluding(obj, excluding) {
  var copy = {},
      p;

  for (p in obj) {
    if (!(p in excluding)) {
      copy[p] = obj[p];
    }
  }

  return copy;
},
    _inheritDefaults = function _inheritDefaults(vars) {
  var parent = vars.parent || _globalTimeline,
      func = vars.keyframes ? _setKeyframeDefaults : _setDefaults;

  if (_isNotFalse(vars.inherit)) {
    while (parent) {
      func(vars, parent.vars.defaults);
      parent = parent.parent;
    }
  }

  return vars;
},
    _arraysMatch = function _arraysMatch(a1, a2) {
  var i = a1.length,
      match = i === a2.length;

  while (match && i-- && a1[i] === a2[i]) {}

  return i < 0;
},
    _addLinkedListItem = function _addLinkedListItem(parent, child, firstProp, lastProp, sortBy) {
  if (firstProp === void 0) {
    firstProp = "_first";
  }

  if (lastProp === void 0) {
    lastProp = "_last";
  }

  var prev = parent[lastProp],
      t;

  if (sortBy) {
    t = child[sortBy];

    while (prev && prev[sortBy] > t) {
      prev = prev._prev;
    }
  }

  if (prev) {
    child._next = prev._next;
    prev._next = child;
  } else {
    child._next = parent[firstProp];
    parent[firstProp] = child;
  }

  if (child._next) {
    child._next._prev = child;
  } else {
    parent[lastProp] = child;
  }

  child._prev = prev;
  child.parent = child._dp = parent;
  return child;
},
    _removeLinkedListItem = function _removeLinkedListItem(parent, child, firstProp, lastProp) {
  if (firstProp === void 0) {
    firstProp = "_first";
  }

  if (lastProp === void 0) {
    lastProp = "_last";
  }

  var prev = child._prev,
      next = child._next;

  if (prev) {
    prev._next = next;
  } else if (parent[firstProp] === child) {
    parent[firstProp] = next;
  }

  if (next) {
    next._prev = prev;
  } else if (parent[lastProp] === child) {
    parent[lastProp] = prev;
  }

  child._next = child._prev = child.parent = null; // don't delete the _dp just so we can revert if necessary. But parent should be null to indicate the item isn't in a linked list.
},
    _removeFromParent = function _removeFromParent(child, onlyIfParentHasAutoRemove) {
  if (child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren)) {
    child.parent.remove(child);
  }

  child._act = 0;
},
    _uncache = function _uncache(animation) {
  var a = animation;

  while (a) {
    a._dirty = 1;
    a = a.parent;
  }

  return animation;
},
    _recacheAncestors = function _recacheAncestors(animation) {
  var parent = animation.parent;

  while (parent && parent.parent) {
    //sometimes we must force a re-sort of all children and update the duration/totalDuration of all ancestor timelines immediately in case, for example, in the middle of a render loop, one tween alters another tween's timeScale which shoves its startTime before 0, forcing the parent timeline to shift around and shiftChildren() which could affect that next tween's render (startTime). Doesn't matter for the root timeline though.
    parent._dirty = 1;
    parent.totalDuration();
    parent = parent.parent;
  }

  return animation;
},
    _hasNoPausedAncestors = function _hasNoPausedAncestors(animation) {
  return !animation || animation._ts && _hasNoPausedAncestors(animation.parent);
},
    _elapsedCycleDuration = function _elapsedCycleDuration(animation) {
  return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
},
    // feed in the totalTime and cycleDuration and it'll return the cycle (iteration minus 1) and if the playhead is exactly at the very END, it will NOT bump up to the next cycle.
_animationCycle = function _animationCycle(tTime, cycleDuration) {
  return (tTime /= cycleDuration) && ~~tTime === tTime ? ~~tTime - 1 : ~~tTime;
},
    _parentToChildTotalTime = function _parentToChildTotalTime(parentTime, child) {
  return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur);
},
    _setEnd = function _setEnd(animation) {
  return animation._end = _round(animation._start + (animation._tDur / Math.abs(animation._ts || animation._pauseTS || _tinyNum) || 0));
},

/*
_totalTimeToTime = (clampedTotalTime, duration, repeat, repeatDelay, yoyo) => {
	let cycleDuration = duration + repeatDelay,
		time = _round(clampedTotalTime % cycleDuration);
	if (time > duration) {
		time = duration;
	}
	return (yoyo && (~~(clampedTotalTime / cycleDuration) & 1)) ? duration - time : time;
},
*/
_postAddChecks = function _postAddChecks(timeline, child) {
  var t;

  if (child._time || child._initted && !child._dur) {
    //in case, for example, the _start is moved on a tween that has already rendered. Imagine it's at its end state, then the startTime is moved WAY later (after the end of this timeline), it should render at its beginning.
    t = _parentToChildTotalTime(timeline.rawTime(), child);

    if (!child._dur || _clamp(0, child.totalDuration(), t) - child._tTime > _tinyNum) {
      child.render(t, true);
    }
  } //if the timeline has already ended but the inserted tween/timeline extends the duration, we should enable this timeline again so that it renders properly. We should also align the playhead with the parent timeline's when appropriate.


  if (_uncache(timeline)._dp && timeline._initted && timeline._time >= timeline._dur && timeline._ts) {
    //in case any of the ancestors had completed but should now be enabled...
    if (timeline._dur < timeline.duration()) {
      t = timeline;

      while (t._dp) {
        t.rawTime() >= 0 && t.totalTime(t._tTime); //moves the timeline (shifts its startTime) if necessary, and also enables it. If it's currently zero, though, it may not be scheduled to render until later so there's no need to force it to align with the current playhead position. Only move to catch up with the playhead.

        t = t._dp;
      }
    }

    timeline._zTime = -_tinyNum; // helps ensure that the next render() will be forced (crossingStart = true in render()), even if the duration hasn't changed (we're adding a child which would need to get rendered). Definitely an edge case. Note: we MUST do this AFTER the loop above where the totalTime() might trigger a render() because this _addToTimeline() method gets called from the Animation constructor, BEFORE tweens even record their targets, etc. so we wouldn't want things to get triggered in the wrong order.
  }
},
    _addToTimeline = function _addToTimeline(timeline, child, position, skipChecks) {
  child.parent && _removeFromParent(child);
  child._start = _round(position + child._delay);
  child._end = _round(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));

  _addLinkedListItem(timeline, child, "_first", "_last", timeline._sort ? "_start" : 0);

  timeline._recent = child;
  skipChecks || _postAddChecks(timeline, child);
  return timeline;
},
    _attemptInitTween = function _attemptInitTween(tween, totalTime, force, suppressEvents) {
  _initTween(tween, totalTime);

  if (!tween._initted) {
    return 1;
  }

  if (!force && tween._pt && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
    _lazyTweens.push(tween);

    tween._lazy = [totalTime, suppressEvents];
    return 1;
  }
},
    _renderZeroDurationTween = function _renderZeroDurationTween(tween, totalTime, suppressEvents, force) {
  var prevRatio = tween._zTime < 0 ? 0 : 1,
      ratio = totalTime < 0 ? 0 : 1,
      repeatDelay = tween._rDelay,
      tTime = 0,
      pt,
      iteration,
      prevIteration;

  if (repeatDelay && tween._repeat) {
    //in case there's a zero-duration tween that has a repeat with a repeatDelay
    tTime = _clamp(0, tween._tDur, totalTime);
    iteration = _animationCycle(tTime, repeatDelay);
    prevIteration = _animationCycle(tween._tTime, repeatDelay);

    if (iteration !== prevIteration) {
      prevRatio = 1 - ratio;

      if (tween.vars.repeatRefresh && tween._initted) {
        tween.invalidate();
      }
    }
  }

  if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents)) {
    //if we render the very beginning (time == 0) of a fromTo(), we must force the render (normal tweens wouldn't need to render at a time of 0 when the prevTime was also 0). This is also mandatory to make sure overwriting kicks in immediately.
    return;
  }

  if (ratio !== prevRatio || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
    tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0); //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration tween, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect.

    tween.ratio = ratio;

    if (tween._from) {
      ratio = 1 - ratio;
    }

    tween._time = 0;
    tween._tTime = tTime;
    suppressEvents || _callback(tween, "onStart");
    pt = tween._pt;

    while (pt) {
      pt.r(ratio, pt.d);
      pt = pt._next;
    }

    if (!ratio && tween._startAt && !tween._onUpdate && tween._start) {
      //if the tween is positioned at the VERY beginning (_start 0) of its parent timeline, it's illegal for the playhead to go back further, so we should not render the recorded startAt values.
      tween._startAt.render(totalTime, true, force);
    }

    tween._onUpdate && (suppressEvents || _callback(tween, "onUpdate"));

    if (tTime && tween._repeat && !suppressEvents && tween.parent) {
      _callback(tween, "onRepeat");
    }

    if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
      tween.ratio && _removeFromParent(tween, 1);

      if (!suppressEvents) {
        _callback(tween, tween.ratio ? "onComplete" : "onReverseComplete", true);

        tween._prom && tween._prom();
      }
    }
  }
},
    _findNextPauseTween = function _findNextPauseTween(animation, prevTime, time) {
  var child;

  if (time > prevTime) {
    child = animation._first;

    while (child && child._start <= time) {
      if (!child._dur && child.data === "isPause" && child._start > prevTime) {
        return child;
      }

      child = child._next;
    }
  } else {
    child = animation._last;

    while (child && child._start >= time) {
      if (!child._dur && child.data === "isPause" && child._start < prevTime) {
        return child;
      }

      child = child._prev;
    }
  }
},
    _setDuration = function _setDuration(animation, duration, skipUncache) {
  var repeat = animation._repeat,
      dur = _round(duration);

  animation._dur = dur;
  animation._tDur = !repeat ? dur : repeat < 0 ? 1e12 : _round(dur * (repeat + 1) + animation._rDelay * repeat);
  !skipUncache && _uncache(animation.parent);
  animation.parent && _setEnd(animation);
  return animation;
},
    _onUpdateTotalDuration = function _onUpdateTotalDuration(animation) {
  return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur);
},
    _zeroPosition = {
  _start: 0,
  endTime: _emptyFunc
},
    _parsePosition = function _parsePosition(animation, position) {
  var labels = animation.labels,
      recent = animation._recent || _zeroPosition,
      clippedDuration = animation.duration() >= _bigNum ? recent.endTime(false) : animation._dur,
      //in case there's a child that infinitely repeats, users almost never intend for the insertion point of a new child to be based on a SUPER long value like that so we clip it and assume the most recently-added child's endTime should be used instead.
  i,
      offset;

  if (_isString(position) && (isNaN(position) || position in labels)) {
    //if the string is a number like "1", check to see if there's a label with that name, otherwise interpret it as a number (absolute value).
    i = position.charAt(0);

    if (i === "<" || i === ">") {
      return (i === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0);
    }

    i = position.indexOf("=");

    if (i < 0) {
      if (!(position in labels)) {
        labels[position] = clippedDuration;
      }

      return labels[position];
    }

    offset = +(position.charAt(i - 1) + position.substr(i + 1));
    return i > 1 ? _parsePosition(animation, position.substr(0, i - 1)) + offset : clippedDuration + offset;
  }

  return position == null ? clippedDuration : +position;
},
    _conditionalReturn = function _conditionalReturn(value, func) {
  return value || value === 0 ? func(value) : func;
},
    _clamp = function _clamp(min, max, value) {
  return value < min ? min : value > max ? max : value;
},
    getUnit = function getUnit(value) {
  return (value + "").substr((parseFloat(value) + "").length);
},
    clamp = function clamp(min, max, value) {
  return _conditionalReturn(value, function (v) {
    return _clamp(min, max, v);
  });
},
    _slice = [].slice,
    _isArrayLike = function _isArrayLike(value, nonEmpty) {
  return value && _isObject(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject(value[0])) && !value.nodeType && value !== _win;
},
    _flatten = function _flatten(ar, leaveStrings, accumulator) {
  if (accumulator === void 0) {
    accumulator = [];
  }

  return ar.forEach(function (value) {
    var _accumulator;

    return _isString(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray(value)) : accumulator.push(value);
  }) || accumulator;
},
    //takes any value and returns an array. If it's a string (and leaveStrings isn't true), it'll use document.querySelectorAll() and convert that to an array. It'll also accept iterables like jQuery objects.
toArray = function toArray(value, leaveStrings) {
  return _isString(value) && !leaveStrings && (_coreInitted || !_wake()) ? _slice.call(_doc.querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
},
    shuffle = function shuffle(a) {
  return a.sort(function () {
    return .5 - Math.random();
  });
},
    // alternative that's a bit faster and more reliably diverse but bigger:   for (let j, v, i = a.length; i; j = ~~(Math.random() * i), v = a[--i], a[i] = a[j], a[j] = v); return a;
//for distributing values across an array. Can accept a number, a function or (most commonly) a function which can contain the following properties: {base, amount, from, ease, grid, axis, length, each}. Returns a function that expects the following parameters: index, target, array. Recognizes the following
distribute = function distribute(v) {
  if (_isFunction(v)) {
    return v;
  }

  var vars = _isObject(v) ? v : {
    each: v
  },
      //n:1 is just to indicate v was a number; we leverage that later to set v according to the length we get. If a number is passed in, we treat it like the old stagger value where 0.1, for example, would mean that things would be distributed with 0.1 between each element in the array rather than a total "amount" that's chunked out among them all.
  ease = _parseEase(vars.ease),
      from = vars.from || 0,
      base = parseFloat(vars.base) || 0,
      cache = {},
      isDecimal = from > 0 && from < 1,
      ratios = isNaN(from) || isDecimal,
      axis = vars.axis,
      ratioX = from,
      ratioY = from;

  if (_isString(from)) {
    ratioX = ratioY = {
      center: .5,
      edges: .5,
      end: 1
    }[from] || 0;
  } else if (!isDecimal && ratios) {
    ratioX = from[0];
    ratioY = from[1];
  }

  return function (i, target, a) {
    var l = (a || vars).length,
        distances = cache[l],
        originX,
        originY,
        x,
        y,
        d,
        j,
        max,
        min,
        wrapAt;

    if (!distances) {
      wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum])[1];

      if (!wrapAt) {
        max = -_bigNum;

        while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) {}

        wrapAt--;
      }

      distances = cache[l] = [];
      originX = ratios ? Math.min(wrapAt, l) * ratioX - .5 : from % wrapAt;
      originY = ratios ? l * ratioY / wrapAt - .5 : from / wrapAt | 0;
      max = 0;
      min = _bigNum;

      for (j = 0; j < l; j++) {
        x = j % wrapAt - originX;
        y = originY - (j / wrapAt | 0);
        distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);

        if (d > max) {
          max = d;
        }

        if (d < min) {
          min = d;
        }
      }

      from === "random" && shuffle(distances);
      distances.max = max - min;
      distances.min = min;
      distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
      distances.b = l < 0 ? base - l : base;
      distances.u = getUnit(vars.amount || vars.each) || 0; //unit

      ease = ease && l < 0 ? _invertEase(ease) : ease;
    }

    l = (distances[i] - distances.min) / distances.max || 0;
    return _round(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u; //round in order to work around floating point errors
  };
},
    _roundModifier = function _roundModifier(v) {
  //pass in 0.1 get a function that'll round to the nearest tenth, or 5 to round to the closest 5, or 0.001 to the closest 1000th, etc.
  var p = v < 1 ? Math.pow(10, (v + "").length - 2) : 1; //to avoid floating point math errors (like 24 * 0.1 == 2.4000000000000004), we chop off at a specific number of decimal places (much faster than toFixed()

  return function (raw) {
    return ~~(Math.round(parseFloat(raw) / v) * v * p) / p + (_isNumber(raw) ? 0 : getUnit(raw));
  };
},
    snap = function snap(snapTo, value) {
  var isArray = _isArray(snapTo),
      radius,
      is2D;

  if (!isArray && _isObject(snapTo)) {
    radius = isArray = snapTo.radius || _bigNum;

    if (snapTo.values) {
      snapTo = toArray(snapTo.values);

      if (is2D = !_isNumber(snapTo[0])) {
        radius *= radius; //performance optimization so we don't have to Math.sqrt() in the loop.
      }
    } else {
      snapTo = _roundModifier(snapTo.increment);
    }
  }

  return _conditionalReturn(value, !isArray ? _roundModifier(snapTo) : _isFunction(snapTo) ? function (raw) {
    is2D = snapTo(raw);
    return Math.abs(is2D - raw) <= radius ? is2D : raw;
  } : function (raw) {
    var x = parseFloat(is2D ? raw.x : raw),
        y = parseFloat(is2D ? raw.y : 0),
        min = _bigNum,
        closest = 0,
        i = snapTo.length,
        dx,
        dy;

    while (i--) {
      if (is2D) {
        dx = snapTo[i].x - x;
        dy = snapTo[i].y - y;
        dx = dx * dx + dy * dy;
      } else {
        dx = Math.abs(snapTo[i] - x);
      }

      if (dx < min) {
        min = dx;
        closest = i;
      }
    }

    closest = !radius || min <= radius ? snapTo[closest] : raw;
    return is2D || closest === raw || _isNumber(raw) ? closest : closest + getUnit(raw);
  });
},
    random = function random(min, max, roundingIncrement, returnFunction) {
  return _conditionalReturn(_isArray(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, function () {
    return _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && ~~(Math.round((min + Math.random() * (max - min)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
  });
},
    pipe = function pipe() {
  for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
    functions[_key] = arguments[_key];
  }

  return function (value) {
    return functions.reduce(function (v, f) {
      return f(v);
    }, value);
  };
},
    unitize = function unitize(func, unit) {
  return function (value) {
    return func(parseFloat(value)) + (unit || getUnit(value));
  };
},
    normalize = function normalize(min, max, value) {
  return mapRange(min, max, 0, 1, value);
},
    _wrapArray = function _wrapArray(a, wrapper, value) {
  return _conditionalReturn(value, function (index) {
    return a[~~wrapper(index)];
  });
},
    wrap = function wrap(min, max, value) {
  // NOTE: wrap() CANNOT be an arrow function! A very odd compiling bug causes problems (unrelated to GSAP).
  var range = max - min;
  return _isArray(min) ? _wrapArray(min, wrap(0, min.length), max) : _conditionalReturn(value, function (value) {
    return (range + (value - min) % range) % range + min;
  });
},
    wrapYoyo = function wrapYoyo(min, max, value) {
  var range = max - min,
      total = range * 2;
  return _isArray(min) ? _wrapArray(min, wrapYoyo(0, min.length - 1), max) : _conditionalReturn(value, function (value) {
    value = (total + (value - min) % total) % total;
    return min + (value > range ? total - value : value);
  });
},
    _replaceRandom = function _replaceRandom(value) {
  //replaces all occurrences of random(...) in a string with the calculated random value. can be a range like random(-100, 100, 5) or an array like random([0, 100, 500])
  var prev = 0,
      s = "",
      i,
      nums,
      end,
      isArray;

  while (~(i = value.indexOf("random(", prev))) {
    end = value.indexOf(")", i);
    isArray = value.charAt(i + 7) === "[";
    nums = value.substr(i + 7, end - i - 7).match(isArray ? _delimitedValueExp : _strictNumExp);
    s += value.substr(prev, i - prev) + random(isArray ? nums : +nums[0], +nums[1], +nums[2] || 1e-5);
    prev = end + 1;
  }

  return s + value.substr(prev, value.length - prev);
},
    mapRange = function mapRange(inMin, inMax, outMin, outMax, value) {
  var inRange = inMax - inMin,
      outRange = outMax - outMin;
  return _conditionalReturn(value, function (value) {
    return outMin + (value - inMin) / inRange * outRange;
  });
},
    interpolate = function interpolate(start, end, progress, mutate) {
  var func = isNaN(start + end) ? 0 : function (p) {
    return (1 - p) * start + p * end;
  };

  if (!func) {
    var isString = _isString(start),
        master = {},
        p,
        i,
        interpolators,
        l,
        il;

    progress === true && (mutate = 1) && (progress = null);

    if (isString) {
      start = {
        p: start
      };
      end = {
        p: end
      };
    } else if (_isArray(start) && !_isArray(end)) {
      interpolators = [];
      l = start.length;
      il = l - 2;

      for (i = 1; i < l; i++) {
        interpolators.push(interpolate(start[i - 1], start[i])); //build the interpolators up front as a performance optimization so that when the function is called many times, it can just reuse them.
      }

      l--;

      func = function func(p) {
        p *= l;
        var i = Math.min(il, ~~p);
        return interpolators[i](p - i);
      };

      progress = end;
    } else if (!mutate) {
      start = _merge(_isArray(start) ? [] : {}, start);
    }

    if (!interpolators) {
      for (p in end) {
        _addPropTween.call(master, start, p, "get", end[p]);
      }

      func = function func(p) {
        return _renderPropTweens(p, master) || (isString ? start.p : start);
      };
    }
  }

  return _conditionalReturn(progress, func);
},
    _getLabelInDirection = function _getLabelInDirection(timeline, fromTime, backward) {
  //used for nextLabel() and previousLabel()
  var labels = timeline.labels,
      min = _bigNum,
      p,
      distance,
      label;

  for (p in labels) {
    distance = labels[p] - fromTime;

    if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
      label = p;
      min = distance;
    }
  }

  return label;
},
    _callback = function _callback(animation, type, executeLazyFirst) {
  var v = animation.vars,
      callback = v[type],
      params,
      scope;

  if (!callback) {
    return;
  }

  params = v[type + "Params"];
  scope = v.callbackScope || animation;
  executeLazyFirst && _lazyTweens.length && _lazyRender(); //in case rendering caused any tweens to lazy-init, we should render them because typically when a timeline finishes, users expect things to have rendered fully. Imagine an onUpdate on a timeline that reports/checks tweened values.

  return params ? callback.apply(scope, params) : callback.call(scope);
},
    _interrupt = function _interrupt(animation) {
  _removeFromParent(animation);

  if (animation.progress() < 1) {
    _callback(animation, "onInterrupt");
  }

  return animation;
},
    _quickTween,
    _createPlugin = function _createPlugin(config) {
  config = !config.name && config["default"] || config; //UMD packaging wraps things oddly, so for example MotionPathHelper becomes {MotionPathHelper:MotionPathHelper, default:MotionPathHelper}.

  var name = config.name,
      isFunc = _isFunction(config),
      Plugin = name && !isFunc && config.init ? function () {
    this._props = [];
  } : config,
      //in case someone passes in an object that's not a plugin, like CustomEase
  instanceDefaults = {
    init: _emptyFunc,
    render: _renderPropTweens,
    add: _addPropTween,
    kill: _killPropTweensOf,
    modifier: _addPluginModifier,
    rawVars: 0
  },
      statics = {
    targetTest: 0,
    get: 0,
    getSetter: _getSetter,
    aliases: {},
    register: 0
  };

  _wake();

  if (config !== Plugin) {
    if (_plugins[name]) {
      return;
    }

    _setDefaults(Plugin, _setDefaults(_copyExcluding(config, instanceDefaults), statics)); //static methods


    _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config, statics))); //instance methods


    _plugins[Plugin.prop = name] = Plugin;

    if (config.targetTest) {
      _harnessPlugins.push(Plugin);

      _reservedProps[name] = 1;
    }

    name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin"; //for the global name. "motionPath" should become MotionPathPlugin
  }

  _addGlobal(name, Plugin);

  if (config.register) {
    config.register(gsap, Plugin, PropTween);
  }
},

/*
 * --------------------------------------------------------------------------------------
 * COLORS
 * --------------------------------------------------------------------------------------
 */
_255 = 255,
    _colorLookup = {
  aqua: [0, _255, _255],
  lime: [0, _255, 0],
  silver: [192, 192, 192],
  black: [0, 0, 0],
  maroon: [128, 0, 0],
  teal: [0, 128, 128],
  blue: [0, 0, _255],
  navy: [0, 0, 128],
  white: [_255, _255, _255],
  olive: [128, 128, 0],
  yellow: [_255, _255, 0],
  orange: [_255, 165, 0],
  gray: [128, 128, 128],
  purple: [128, 0, 128],
  green: [0, 128, 0],
  red: [_255, 0, 0],
  pink: [_255, 192, 203],
  cyan: [0, _255, _255],
  transparent: [_255, _255, _255, 0]
},
    _hue = function _hue(h, m1, m2) {
  h = h < 0 ? h + 1 : h > 1 ? h - 1 : h;
  return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < .5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + .5 | 0;
},
    splitColor = function splitColor(v, toHSL, forceAlpha) {
  var a = !v ? _colorLookup.black : _isNumber(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0,
      r,
      g,
      b,
      h,
      s,
      l,
      max,
      min,
      d,
      wasHSL;

  if (!a) {
    if (v.substr(-1) === ",") {
      //sometimes a trailing comma is included and we should chop it off (typically from a comma-delimited list of values like a textShadow:"2px 2px 2px blue, 5px 5px 5px rgb(255,0,0)" - in this example "blue," has a trailing comma. We could strip it out inside parseComplex() but we'd need to do it to the beginning and ending values plus it wouldn't provide protection from other potential scenarios like if the user passes in a similar value.
      v = v.substr(0, v.length - 1);
    }

    if (_colorLookup[v]) {
      a = _colorLookup[v];
    } else if (v.charAt(0) === "#") {
      if (v.length === 4) {
        //for shorthand like #9F0
        r = v.charAt(1);
        g = v.charAt(2);
        b = v.charAt(3);
        v = "#" + r + r + g + g + b + b;
      }

      v = parseInt(v.substr(1), 16);
      a = [v >> 16, v >> 8 & _255, v & _255];
    } else if (v.substr(0, 3) === "hsl") {
      a = wasHSL = v.match(_strictNumExp);

      if (!toHSL) {
        h = +a[0] % 360 / 360;
        s = +a[1] / 100;
        l = +a[2] / 100;
        g = l <= .5 ? l * (s + 1) : l + s - l * s;
        r = l * 2 - g;

        if (a.length > 3) {
          a[3] *= 1; //cast as number
        }

        a[0] = _hue(h + 1 / 3, r, g);
        a[1] = _hue(h, r, g);
        a[2] = _hue(h - 1 / 3, r, g);
      } else if (~v.indexOf("=")) {
        //if relative values are found, just return the raw strings with the relative prefixes in place.
        a = v.match(_numExp);
        forceAlpha && a.length < 4 && (a[3] = 1);
        return a;
      }
    } else {
      a = v.match(_strictNumExp) || _colorLookup.transparent;
    }

    a = a.map(Number);
  }

  if (toHSL && !wasHSL) {
    r = a[0] / _255;
    g = a[1] / _255;
    b = a[2] / _255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60;
    }

    a[0] = ~~(h + .5);
    a[1] = ~~(s * 100 + .5);
    a[2] = ~~(l * 100 + .5);
  }

  forceAlpha && a.length < 4 && (a[3] = 1);
  return a;
},
    _colorOrderData = function _colorOrderData(v) {
  // strips out the colors from the string, finds all the numeric slots (with units) and returns an array of those. The Array also has a "c" property which is an Array of the index values where the colors belong. This is to help work around issues where there's a mis-matched order of color/numeric data like drop-shadow(#f00 0px 1px 2px) and drop-shadow(0x 1px 2px #f00). This is basically a helper function used in _formatColors()
  var values = [],
      c = [],
      i = -1;
  v.split(_colorExp).forEach(function (v) {
    var a = v.match(_numWithUnitExp) || [];
    values.push.apply(values, a);
    c.push(i += a.length + 1);
  });
  values.c = c;
  return values;
},
    _formatColors = function _formatColors(s, toHSL, orderMatchData) {
  var result = "",
      colors = (s + result).match(_colorExp),
      type = toHSL ? "hsla(" : "rgba(",
      i = 0,
      c,
      shell,
      d,
      l;

  if (!colors) {
    return s;
  }

  colors = colors.map(function (color) {
    return (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")";
  });

  if (orderMatchData) {
    d = _colorOrderData(s);
    c = orderMatchData.c;

    if (c.join(result) !== d.c.join(result)) {
      shell = s.replace(_colorExp, "1").split(_numWithUnitExp);
      l = shell.length - 1;

      for (; i < l; i++) {
        result += shell[i] + (~c.indexOf(i) ? colors.shift() || type + "0,0,0,0)" : (d.length ? d : colors.length ? colors : orderMatchData).shift());
      }
    }
  }

  if (!shell) {
    shell = s.split(_colorExp);
    l = shell.length - 1;

    for (; i < l; i++) {
      result += shell[i] + colors[i];
    }
  }

  return result + shell[l];
},
    _colorExp = function () {
  var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3}){1,2}\\b",
      //we'll dynamically build this Regular Expression to conserve file size. After building it, it will be able to find rgb(), rgba(), # (hexadecimal), and named color values like red, blue, purple, etc.,
  p;

  for (p in _colorLookup) {
    s += "|" + p + "\\b";
  }

  return new RegExp(s + ")", "gi");
}(),
    _hslExp = /hsl[a]?\(/,
    _colorStringFilter = function _colorStringFilter(a) {
  var combined = a.join(" "),
      toHSL;
  _colorExp.lastIndex = 0;

  if (_colorExp.test(combined)) {
    toHSL = _hslExp.test(combined);
    a[1] = _formatColors(a[1], toHSL);
    a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1])); // make sure the order of numbers/colors match with the END value.

    return true;
  }
},

/*
 * --------------------------------------------------------------------------------------
 * TICKER
 * --------------------------------------------------------------------------------------
 */
_tickerActive,
    _ticker = function () {
  var _getTime = Date.now,
      _lagThreshold = 500,
      _adjustedLag = 33,
      _startTime = _getTime(),
      _lastUpdate = _startTime,
      _gap = 1 / 240,
      _nextTime = _gap,
      _listeners = [],
      _id,
      _req,
      _raf,
      _self,
      _tick = function _tick(v) {
    var elapsed = _getTime() - _lastUpdate,
        manual = v === true,
        overlap,
        dispatch;

    if (elapsed > _lagThreshold) {
      _startTime += elapsed - _adjustedLag;
    }

    _lastUpdate += elapsed;
    _self.time = (_lastUpdate - _startTime) / 1000;
    overlap = _self.time - _nextTime;

    if (overlap > 0 || manual) {
      _self.frame++;
      _nextTime += overlap + (overlap >= _gap ? 0.004 : _gap - overlap);
      dispatch = 1;
    }

    if (!manual) {
      //make sure the request is made before we dispatch the "tick" event so that timing is maintained. Otherwise, if processing the "tick" requires a bunch of time (like 15ms) and we're using a setTimeout() that's based on 16.7ms, it'd technically take 31.7ms between frames otherwise.
      _id = _req(_tick);
    }

    if (dispatch) {
      _listeners.forEach(function (l) {
        return l(_self.time, elapsed, _self.frame, v);
      });
    }
  };

  _self = {
    time: 0,
    frame: 0,
    tick: function tick() {
      _tick(true);
    },
    wake: function wake() {
      if (_coreReady) {
        if (!_coreInitted && _windowExists()) {
          _win = _coreInitted = window;
          _doc = _win.document || {};
          _globals.gsap = gsap;
          (_win.gsapVersions || (_win.gsapVersions = [])).push(gsap.version);

          _install(_installScope || _win.GreenSockGlobals || !_win.gsap && _win || {});

          _raf = _win.requestAnimationFrame;
        }

        _id && _self.sleep();

        _req = _raf || function (f) {
          return setTimeout(f, (_nextTime - _self.time) * 1000 + 1 | 0);
        };

        _tickerActive = 1;

        _tick(2);
      }
    },
    sleep: function sleep() {
      (_raf ? _win.cancelAnimationFrame : clearTimeout)(_id);
      _tickerActive = 0;
      _req = _emptyFunc;
    },
    lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
      _lagThreshold = threshold || 1 / _tinyNum; //zero should be interpreted as basically unlimited

      _adjustedLag = Math.min(adjustedLag, _lagThreshold, 0);
    },
    fps: function fps(_fps) {
      _gap = 1 / (_fps || 240);
      _nextTime = _self.time + _gap;
    },
    add: function add(callback) {
      _listeners.indexOf(callback) < 0 && _listeners.push(callback);

      _wake();
    },
    remove: function remove(callback) {
      var i;
      ~(i = _listeners.indexOf(callback)) && _listeners.splice(i, 1);
    },
    _listeners: _listeners
  };
  return _self;
}(),
    _wake = function _wake() {
  return !_tickerActive && _ticker.wake();
},
    //also ensures the core classes are initialized.

/*
* -------------------------------------------------
* EASING
* -------------------------------------------------
*/
_easeMap = {},
    _customEaseExp = /^[\d.\-M][\d.\-,\s]/,
    _quotesExp = /["']/g,
    _parseObjectInString = function _parseObjectInString(value) {
  //takes a string like "{wiggles:10, type:anticipate})" and turns it into a real object. Notice it ends in ")" and includes the {} wrappers. This is because we only use this function for parsing ease configs and prioritized optimization rather than reusability.
  var obj = {},
      split = value.substr(1, value.length - 3).split(":"),
      key = split[0],
      i = 1,
      l = split.length,
      index,
      val,
      parsedVal;

  for (; i < l; i++) {
    val = split[i];
    index = i !== l - 1 ? val.lastIndexOf(",") : val.length;
    parsedVal = val.substr(0, index);
    obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
    key = val.substr(index + 1).trim();
  }

  return obj;
},
    _configEaseFromString = function _configEaseFromString(name) {
  //name can be a string like "elastic.out(1,0.5)", and pass in _easeMap as obj and it'll parse it out and call the actual function like _easeMap.Elastic.easeOut.config(1,0.5). It will also parse custom ease strings as long as CustomEase is loaded and registered (internally as _easeMap._CE).
  var split = (name + "").split("("),
      ease = _easeMap[split[0]];
  return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _parenthesesExp.exec(name)[1].split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
},
    _invertEase = function _invertEase(ease) {
  return function (p) {
    return 1 - ease(1 - p);
  };
},
    // potential future feature - allow yoyoEase to be set in children and have those affected when the parent/ancestor timeline yoyos. Not sure it's worth the kb.
// _propagateYoyoEase = (timeline, isYoyo) => {
// 	let child = timeline._first, ease;
// 	while (child) {
// 		if (child instanceof Timeline) {
// 			_propagateYoyoEase(child, isYoyo);
// 		} else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) {
// 			if (child.timeline) {
// 				_propagateYoyoEase(child.timeline, isYoyo);
// 			} else {
// 				ease = child._ease;
// 				child._ease = child._yEase;
// 				child._yEase = ease;
// 				child._yoyo = isYoyo;
// 			}
// 		}
// 		child = child._next;
// 	}
// },
_parseEase = function _parseEase(ease, defaultEase) {
  return !ease ? defaultEase : (_isFunction(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
},
    _insertEase = function _insertEase(names, easeIn, easeOut, easeInOut) {
  if (easeOut === void 0) {
    easeOut = function easeOut(p) {
      return 1 - easeIn(1 - p);
    };
  }

  if (easeInOut === void 0) {
    easeInOut = function easeInOut(p) {
      return p < .5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
    };
  }

  var ease = {
    easeIn: easeIn,
    easeOut: easeOut,
    easeInOut: easeInOut
  },
      lowercaseName;

  _forEachName(names, function (name) {
    _easeMap[name] = _globals[name] = ease;
    _easeMap[lowercaseName = name.toLowerCase()] = easeOut;

    for (var p in ease) {
      _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
    }
  });

  return ease;
},
    _easeInOutFromOut = function _easeInOutFromOut(easeOut) {
  return function (p) {
    return p < .5 ? (1 - easeOut(1 - p * 2)) / 2 : .5 + easeOut((p - .5) * 2) / 2;
  };
},
    _configElastic = function _configElastic(type, amplitude, period) {
  var p1 = amplitude >= 1 ? amplitude : 1,
      //note: if amplitude is < 1, we simply adjust the period for a more natural feel. Otherwise the math doesn't work right and the curve starts at 1.
  p2 = (period || (type ? .3 : .45)) / (amplitude < 1 ? amplitude : 1),
      p3 = p2 / _2PI * (Math.asin(1 / p1) || 0),
      easeOut = function easeOut(p) {
    return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
  },
      ease = type === "out" ? easeOut : type === "in" ? function (p) {
    return 1 - easeOut(1 - p);
  } : _easeInOutFromOut(easeOut);

  p2 = _2PI / p2; //precalculate to optimize

  ease.config = function (amplitude, period) {
    return _configElastic(type, amplitude, period);
  };

  return ease;
},
    _configBack = function _configBack(type, overshoot) {
  if (overshoot === void 0) {
    overshoot = 1.70158;
  }

  var easeOut = function easeOut(p) {
    return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
  },
      ease = type === "out" ? easeOut : type === "in" ? function (p) {
    return 1 - easeOut(1 - p);
  } : _easeInOutFromOut(easeOut);

  ease.config = function (overshoot) {
    return _configBack(type, overshoot);
  };

  return ease;
}; // a cheaper (kb and cpu) but more mild way to get a parameterized weighted ease by feeding in a value between -1 (easeIn) and 1 (easeOut) where 0 is linear.
// _weightedEase = ratio => {
// 	let y = 0.5 + ratio / 2;
// 	return p => (2 * (1 - p) * p * y + p * p);
// },
// a stronger (but more expensive kb/cpu) parameterized weighted ease that lets you feed in a value between -1 (easeIn) and 1 (easeOut) where 0 is linear.
// _weightedEaseStrong = ratio => {
// 	ratio = .5 + ratio / 2;
// 	let o = 1 / 3 * (ratio < .5 ? ratio : 1 - ratio),
// 		b = ratio - o,
// 		c = ratio + o;
// 	return p => p === 1 ? p : 3 * b * (1 - p) * (1 - p) * p + 3 * c * (1 - p) * p * p + p * p * p;
// };


exports._ticker = _ticker;
exports._colorStringFilter = _colorStringFilter;
exports.splitColor = splitColor;
exports.interpolate = interpolate;
exports.mapRange = mapRange;
exports._replaceRandom = _replaceRandom;
exports.wrapYoyo = wrapYoyo;
exports.wrap = wrap;
exports.normalize = normalize;
exports.unitize = unitize;
exports.pipe = pipe;
exports.random = random;
exports.snap = snap;
exports._roundModifier = _roundModifier;
exports.distribute = distribute;
exports.shuffle = shuffle;
exports.toArray = toArray;
exports.clamp = clamp;
exports.getUnit = getUnit;
exports._removeLinkedListItem = _removeLinkedListItem;
exports._setDefaults = _setDefaults;
exports._round = _round;
exports._forEachName = _forEachName;
exports._getProperty = _getProperty;
exports._getCache = _getCache;
exports._plugins = _plugins;
exports._missingPlugin = _missingPlugin;
exports._relExp = _relExp;
exports._numWithUnitExp = _numWithUnitExp;
exports._numExp = _numExp;
exports._isUndefined = _isUndefined;
exports._isString = _isString;
exports._config = _config;

_forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function (name, i) {
  var power = i < 5 ? i + 1 : i;

  _insertEase(name + ",Power" + (power - 1), i ? function (p) {
    return Math.pow(p, power);
  } : function (p) {
    return p;
  }, function (p) {
    return 1 - Math.pow(1 - p, power);
  }, function (p) {
    return p < .5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
  });
});

_easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;

_insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());

(function (n, c) {
  var n1 = 1 / c,
      n2 = 2 * n1,
      n3 = 2.5 * n1,
      easeOut = function easeOut(p) {
    return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + .75 : p < n3 ? n * (p -= 2.25 / c) * p + .9375 : n * Math.pow(p - 2.625 / c, 2) + .984375;
  };

  _insertEase("Bounce", function (p) {
    return 1 - easeOut(1 - p);
  }, easeOut);
})(7.5625, 2.75);

_insertEase("Expo", function (p) {
  return p ? Math.pow(2, 10 * (p - 1)) : 0;
});

_insertEase("Circ", function (p) {
  return -(_sqrt(1 - p * p) - 1);
});

_insertEase("Sine", function (p) {
  return -_cos(p * _HALF_PI) + 1;
});

_insertEase("Back", _configBack("in"), _configBack("out"), _configBack());

_easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
  config: function config(steps, immediateStart) {
    if (steps === void 0) {
      steps = 1;
    }

    var p1 = 1 / steps,
        p2 = steps + (immediateStart ? 0 : 1),
        p3 = immediateStart ? 1 : 0,
        max = 1 - _tinyNum;
    return function (p) {
      return ((p2 * _clamp(0, max, p) | 0) + p3) * p1;
    };
  }
};
_defaults.ease = _easeMap["quad.out"];

_forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function (name) {
  return _callbackNames += name + "," + name + "Params,";
});
/*
 * --------------------------------------------------------------------------------------
 * CACHE
 * --------------------------------------------------------------------------------------
 */


var GSCache = function GSCache(target, harness) {
  this.id = _gsID++;
  target._gsap = this;
  this.target = target;
  this.harness = harness;
  this.get = harness ? harness.get : _getProperty;
  this.set = harness ? harness.getSetter : _getSetter;
};
/*
 * --------------------------------------------------------------------------------------
 * ANIMATION
 * --------------------------------------------------------------------------------------
 */


exports.GSCache = GSCache;

var Animation = /*#__PURE__*/function () {
  function Animation(vars, time) {
    var parent = vars.parent || _globalTimeline;
    this.vars = vars;
    this._delay = +vars.delay || 0;

    if (this._repeat = vars.repeat || 0) {
      this._rDelay = vars.repeatDelay || 0;
      this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
    }

    this._ts = vars.reversed ? -1 : 1;

    _setDuration(this, +vars.duration, 1);

    this.data = vars.data;
    _tickerActive || _ticker.wake();
    parent && _addToTimeline(parent, this, time || time === 0 ? time : parent._time, 1);
    vars.paused && this.paused(true);
  }

  var _proto = Animation.prototype;

  _proto.delay = function delay(value) {
    if (value || value === 0) {
      this._delay = value;
      return this;
    }

    return this._delay;
  };

  _proto.duration = function duration(value) {
    return arguments.length ? _setDuration(this, value) : this.totalDuration() && this._dur;
  };

  _proto.totalDuration = function totalDuration(value) {
    if (!arguments.length) {
      return this._tDur;
    }

    this._dirty = 0;
    return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1));
  };

  _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
    _wake();

    if (!arguments.length) {
      return this._tTime;
    }

    var parent = this.parent || this._dp;

    if (parent && parent.smoothChildTiming && this._ts) {
      // if (!parent._dp && parent._time === parent._dur) { // if a root timeline completes...and then a while later one of its children resumes, we must shoot the playhead forward to where it should be raw-wise, otherwise the child will jump to the end. Down side: this assumes it's using the _ticker.time as a reference.
      // 	parent._time = _ticker.time - parent._start;
      // }
      this._start = _round(parent._time - (this._ts > 0 ? _totalTime / this._ts : ((this._dirty ? this.totalDuration() : this._tDur) - _totalTime) / -this._ts));

      _setEnd(this);

      if (!parent._dirty) {
        //for performance improvement. If the parent's cache is already dirty, it already took care of marking the ancestors as dirty too, so skip the function call here.
        _uncache(parent);
      } //in case any of the ancestor timelines had completed but should now be enabled, we should reset their totalTime() which will also ensure that they're lined up properly and enabled. Skip for animations that are on the root (wasteful). Example: a TimelineLite.exportRoot() is performed when there's a paused tween on the root, the export will not complete until that tween is unpaused, but imagine a child gets restarted later, after all [unpaused] tweens have completed. The start of that child would get pushed out, but one of the ancestors may have completed.


      while (parent.parent) {
        if (parent.parent._time !== parent._start + (parent._ts >= 0 ? parent._tTime / parent._ts : (parent.totalDuration() - parent._tTime) / -parent._ts)) {
          parent.totalTime(parent._tTime, true);
        }

        parent = parent.parent;
      }

      if (!this.parent && this._dp.autoRemoveChildren) {
        //if the animation doesn't have a parent, put it back into its last parent (recorded as _dp for exactly cases like this). Limit to parents with autoRemoveChildren (like globalTimeline) so that if the user manually removes an animation from a timeline and then alters its playhead, it doesn't get added back in.
        _addToTimeline(this._dp, this, this._start - this._delay);
      }
    }

    if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum) {
      this._ts || (this._pTime = _totalTime); // otherwise, if an animation is paused, then the playhead is moved back to zero, then resumed, it'd revert back to the original time at the pause

      _lazySafeRender(this, _totalTime, suppressEvents);
    }

    return this;
  };

  _proto.time = function time(value, suppressEvents) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % this._dur || (value ? this._dur : 0), suppressEvents) : this._time; // note: if the modulus results in 0, the playhead could be exactly at the end or the beginning, and we always defer to the END with a non-zero value, otherwise if you set the time() to the very end (duration()), it would render at the START!
  };

  _proto.totalProgress = function totalProgress(value, suppressEvents) {
    return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.ratio;
  };

  _proto.progress = function progress(value, suppressEvents) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.ratio;
  };

  _proto.iteration = function iteration(value, suppressEvents) {
    var cycleDuration = this.duration() + this._rDelay;

    return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
  };

  _proto.timeScale = function timeScale(value) {
    if (!arguments.length) {
      return this._ts || this._pauseTS || 0;
    }

    if (this._pauseTS !== null) {
      this._pauseTS = value;
      return this;
    }

    var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime; // make sure to do the parentToChildTotalTime() BEFORE setting the new _ts because the old one must be used in that calculation.

    this._ts = value; // prioritize rendering where the parent's playhead lines up instead of this._tTime because there could be a tween that's animating another tween's timeScale in the same rendering loop (same parent), thus if the timeScale tween renders first, it would alter _start BEFORE _tTime was set on that tick (in the rendering loop), effectively freezing it until the timeScale tween finishes.

    return _recacheAncestors(this.totalTime(tTime, true));
  };

  _proto.paused = function paused(value) {
    var isPaused = !this._ts;

    if (!arguments.length) {
      return isPaused;
    }

    if (isPaused !== value) {
      if (value) {
        this._pauseTS = this._ts;
        this._pTime = this._tTime || Math.max(-this._delay, this.rawTime()); // if the pause occurs during the delay phase, make sure that's factored in when resuming.

        this._ts = this._act = 0; //we use a timeScale of 0 to indicate a paused state, but we record the old "real" timeScale as _pauseTS so we can revert when unpaused.
      } else {
        _wake();

        this._ts = this._pauseTS || 1;
        this._pauseTS = null; //only defer to _pTime (pauseTime) if tTime is zero. Remember, someone could pause() an animation, then scrub the playhead and resume(). If the parent doesn't have smoothChildTiming, we render at the rawTime() because the startTime won't get updated.

        this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && (this._tTime -= _tinyNum) && Math.abs(this._zTime) !== _tinyNum); // edge case: animation.progress(1).pause().play() wouldn't render again because the playhead is already at the end, but the call to totalTime() below will add it back to its parent...and not remove it again (since removing only happens upon rendering at a new time). Offsetting the _tTime slightly is done simply to cause the final render in totalTime() that'll pop it off its timeline (if autoRemoveChildren is true, of course). Check to make sure _zTime isn't -_tinyNum to avoid an edge case where the playhead is pushed to the end but INSIDE a tween/callback, the timeline itself is paused thus halting rendering and leaving a few unrendered. When resuming, it wouldn't render those otherwise.
      }
    }

    return this;
  };

  _proto.startTime = function startTime(value) {
    if (arguments.length) {
      if (this.parent && this.parent._sort) {
        _addToTimeline(this.parent, this, value - this._delay);
      }

      return this;
    }

    return this._start;
  };

  _proto.endTime = function endTime(includeRepeats) {
    return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts);
  };

  _proto.rawTime = function rawTime(wrapRepeats) {
    var parent = this.parent || this._dp; // _dp = detatched parent

    return !parent ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent.rawTime(wrapRepeats), this);
  } // globalTime(rawTime) {
  // 	let animation = this,
  // 		time = arguments.length ? rawTime : animation.rawTime();
  // 	while (animation) {
  // 		time = animation._start + time / (animation._ts || 1);
  // 		animation = animation.parent;
  // 	}
  // 	return time;
  // }
  ;

  _proto.repeat = function repeat(value) {
    if (arguments.length) {
      this._repeat = value;
      return _onUpdateTotalDuration(this);
    }

    return this._repeat;
  };

  _proto.repeatDelay = function repeatDelay(value) {
    if (arguments.length) {
      this._rDelay = value;
      return _onUpdateTotalDuration(this);
    }

    return this._rDelay;
  };

  _proto.yoyo = function yoyo(value) {
    if (arguments.length) {
      this._yoyo = value;
      return this;
    }

    return this._yoyo;
  };

  _proto.seek = function seek(position, suppressEvents) {
    return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents));
  };

  _proto.restart = function restart(includeDelay, suppressEvents) {
    return this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
  };

  _proto.play = function play(from, suppressEvents) {
    if (from != null) {
      this.seek(from, suppressEvents);
    }

    return this.reversed(false).paused(false);
  };

  _proto.reverse = function reverse(from, suppressEvents) {
    if (from != null) {
      this.seek(from || this.totalDuration(), suppressEvents);
    }

    return this.reversed(true).paused(false);
  };

  _proto.pause = function pause(atTime, suppressEvents) {
    if (atTime != null) {
      this.seek(atTime, suppressEvents);
    }

    return this.paused(true);
  };

  _proto.resume = function resume() {
    return this.paused(false);
  };

  _proto.reversed = function reversed(value) {
    var ts = this._ts || this._pauseTS || 0;

    if (arguments.length) {
      if (value !== this.reversed()) {
        this[this._pauseTS === null ? "_ts" : "_pauseTS"] = Math.abs(ts) * (value ? -1 : 1);
        this.totalTime(this._tTime, true);
      }

      return this;
    }

    return ts < 0;
  };

  _proto.invalidate = function invalidate() {
    this._initted = 0;
    this._zTime = -_tinyNum;
    return this;
  };

  _proto.isActive = function isActive(hasStarted) {
    var parent = this.parent || this._dp,
        start = this._start,
        rawTime;
    return !!(!parent || this._ts && (this._initted || !hasStarted) && parent.isActive(hasStarted) && (rawTime = parent.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum);
  };

  _proto.eventCallback = function eventCallback(type, callback, params) {
    var vars = this.vars;

    if (arguments.length > 1) {
      if (!callback) {
        delete vars[type];
      } else {
        vars[type] = callback;

        if (params) {
          vars[type + "Params"] = params;
        }

        if (type === "onUpdate") {
          this._onUpdate = callback;
        }
      }

      return this;
    }

    return vars[type];
  };

  _proto.then = function then(onFulfilled) {
    var self = this;
    return new Promise(function (resolve) {
      var f = _isFunction(onFulfilled) ? onFulfilled : _passThrough,
          _resolve = function _resolve() {
        var _then = self.then;
        self.then = null; // temporarily null the then() method to avoid an infinite loop (see https://github.com/greensock/GSAP/issues/322)

        _isFunction(f) && (f = f(self)) && (f.then || f === self) && (self.then = _then);
        resolve(f);
        self.then = _then;
      };

      if (self._initted && self.totalProgress() === 1 && self._ts >= 0 || !self._tTime && self._ts < 0) {
        _resolve();
      } else {
        self._prom = _resolve;
      }
    });
  };

  _proto.kill = function kill() {
    _interrupt(this);
  };

  return Animation;
}();

exports.Animation = Animation;

_setDefaults(Animation.prototype, {
  _time: 0,
  _start: 0,
  _end: 0,
  _tTime: 0,
  _tDur: 0,
  _dirty: 0,
  _repeat: 0,
  _yoyo: false,
  parent: null,
  _initted: false,
  _rDelay: 0,
  _ts: 1,
  _dp: 0,
  ratio: 0,
  _zTime: -_tinyNum,
  _prom: 0,
  _pauseTS: null
});
/*
 * -------------------------------------------------
 * TIMELINE
 * -------------------------------------------------
 */


var Timeline = /*#__PURE__*/function (_Animation) {
  _inheritsLoose(Timeline, _Animation);

  function Timeline(vars, time) {
    var _this;

    if (vars === void 0) {
      vars = {};
    }

    _this = _Animation.call(this, vars, time) || this;
    _this.labels = {};
    _this.smoothChildTiming = !!vars.smoothChildTiming;
    _this.autoRemoveChildren = !!vars.autoRemoveChildren;
    _this._sort = _isNotFalse(vars.sortChildren);
    _this.parent && _postAddChecks(_this.parent, _assertThisInitialized(_this));
    return _this;
  }

  var _proto2 = Timeline.prototype;

  _proto2.to = function to(targets, vars, position) {
    new Tween(targets, _parseVars(arguments, 0, this), _parsePosition(this, _isNumber(vars) ? arguments[3] : position));
    return this;
  };

  _proto2.from = function from(targets, vars, position) {
    new Tween(targets, _parseVars(arguments, 1, this), _parsePosition(this, _isNumber(vars) ? arguments[3] : position));
    return this;
  };

  _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
    new Tween(targets, _parseVars(arguments, 2, this), _parsePosition(this, _isNumber(fromVars) ? arguments[4] : position));
    return this;
  };

  _proto2.set = function set(targets, vars, position) {
    vars.duration = 0;
    vars.parent = this;
    _inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
    vars.immediateRender = !!vars.immediateRender;
    new Tween(targets, vars, _parsePosition(this, position), 1);
    return this;
  };

  _proto2.call = function call(callback, params, position) {
    return _addToTimeline(this, Tween.delayedCall(0, callback, params), _parsePosition(this, position));
  } //ONLY for backward compatibility! Maybe delete?
  ;

  _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
    vars.duration = duration;
    vars.stagger = vars.stagger || stagger;
    vars.onComplete = onCompleteAll;
    vars.onCompleteParams = onCompleteAllParams;
    vars.parent = this;
    new Tween(targets, vars, _parsePosition(this, position));
    return this;
  };

  _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
    vars.runBackwards = 1;
    _inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
    return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
  };

  _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
    toVars.startAt = fromVars;
    _inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
    return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
  };

  _proto2.render = function render(totalTime, suppressEvents, force) {
    var prevTime = this._time,
        tDur = this._dirty ? this.totalDuration() : this._tDur,
        dur = this._dur,
        tTime = this !== _globalTimeline && totalTime > tDur - _tinyNum && totalTime >= 0 ? tDur : totalTime < _tinyNum ? 0 : totalTime,
        crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur),
        time,
        child,
        next,
        iteration,
        cycleDuration,
        prevPaused,
        pauseTween,
        timeScale,
        prevStart,
        prevIteration,
        yoyo,
        isYoyo;

    if (tTime !== this._tTime || force || crossingStart) {
      if (prevTime !== this._time && dur) {
        //if totalDuration() finds a child with a negative startTime and smoothChildTiming is true, things get shifted around internally so we need to adjust the time accordingly. For example, if a tween starts at -30 we must shift EVERYTHING forward 30 seconds and move this timeline's startTime backward by 30 seconds so that things align with the playhead (no jump).
        tTime += this._time - prevTime;
        totalTime += this._time - prevTime;
      }

      time = tTime;
      prevStart = this._start;
      timeScale = this._ts;
      prevPaused = !timeScale;

      if (crossingStart) {
        if (!dur) {
          prevTime = this._zTime;
        }

        if (totalTime || !suppressEvents) {
          //when the playhead arrives at EXACTLY time 0 (right on top) of a zero-duration timeline, we need to discern if events are suppressed so that when the playhead moves again (next time), it'll trigger the callback. If events are NOT suppressed, obviously the callback would be triggered in this render. Basically, the callback should fire either when the playhead ARRIVES or LEAVES this exact spot, not both. Imagine doing a timeline.seek(0) and there's a callback that sits at 0. Since events are suppressed on that seek() by default, nothing will fire, but when the playhead moves off of that position, the callback should fire. This behavior is what people intuitively expect.
          this._zTime = totalTime;
        }
      }

      if (this._repeat) {
        //adjust the time for repeats and yoyos
        yoyo = this._yoyo;
        cycleDuration = dur + this._rDelay;
        time = _round(tTime % cycleDuration); //round to avoid floating point errors. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)

        if (time > dur || tDur === tTime) {
          time = dur;
        }

        iteration = ~~(tTime / cycleDuration);

        if (iteration && iteration === tTime / cycleDuration) {
          time = dur;
          iteration--;
        }

        prevIteration = _animationCycle(this._tTime, cycleDuration);

        if (yoyo && iteration & 1) {
          time = dur - time;
          isYoyo = 1;
        }
        /*
        make sure children at the end/beginning of the timeline are rendered properly. If, for example,
        a 3-second long timeline rendered at 2.9 seconds previously, and now renders at 3.2 seconds (which
        would get translated to 2.8 seconds if the timeline yoyos or 0.2 seconds if it just repeats), there
        could be a callback or a short tween that's at 2.95 or 3 seconds in which wouldn't render. So
        we need to push the timeline to the end (and/or beginning depending on its yoyo value). Also we must
        ensure that zero-duration tweens at the very beginning or end of the Timeline work.
        */


        if (iteration !== prevIteration && !this._lock) {
          var rewinding = yoyo && prevIteration & 1,
              doesWrap = rewinding === (yoyo && iteration & 1);

          if (iteration < prevIteration) {
            rewinding = !rewinding;
          }

          prevTime = rewinding ? 0 : dur;
          this._lock = 1;
          this.render(prevTime, suppressEvents, !dur)._lock = 0;

          if (!suppressEvents && this.parent) {
            _callback(this, "onRepeat");
          }

          this.vars.repeatRefresh && !isYoyo && (this.invalidate()._lock = 1);

          if (prevTime !== this._time || prevPaused !== !this._ts) {
            return this;
          }

          if (doesWrap) {
            this._lock = 2;
            prevTime = rewinding ? dur + 0.0001 : -0.0001;
            this.render(prevTime, true);
            this.vars.repeatRefresh && !isYoyo && this.invalidate();
          }

          this._lock = 0;

          if (!this._ts && !prevPaused) {
            return this;
          } //in order for yoyoEase to work properly when there's a stagger, we must swap out the ease in each sub-tween.
          //_propagateYoyoEase(this, isYoyo);

        }
      }

      if (this._hasPause && !this._forcing && this._lock < 2) {
        pauseTween = _findNextPauseTween(this, _round(prevTime), _round(time));

        if (pauseTween) {
          tTime -= time - (time = pauseTween._start);
        }
      }

      this._tTime = tTime;
      this._time = time;
      this._act = !timeScale; //as long as it's not paused, force it to be active so that if the user renders independent of the parent timeline, it'll be forced to re-render on the next tick.

      if (!this._initted) {
        this._onUpdate = this.vars.onUpdate;
        this._initted = 1;
        this._zTime = totalTime;
      }

      if (!prevTime && time && !suppressEvents) {
        _callback(this, "onStart");
      }

      if (time >= prevTime && totalTime >= 0) {
        child = this._first;

        while (child) {
          next = child._next;

          if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
            if (child.parent !== this) {
              // an extreme edge case - the child's render could do something like kill() the "next" one in the linked list, or reparent it. In that case we must re-initiate the whole render to be safe.
              return this.render(totalTime, suppressEvents, force);
            }

            child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);

            if (time !== this._time || !this._ts && !prevPaused) {
              //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
              pauseTween = 0;
              next && (tTime += this._zTime = -_tinyNum); // it didn't finish rendering, so flag zTime as negative so that so that the next time render() is called it'll be forced (to render any remaining children)

              break;
            }
          }

          child = next;
        }
      } else {
        child = this._last;
        var adjustedTime = totalTime < 0 ? totalTime : time; //when the playhead goes backward beyond the start of this timeline, we must pass that information down to the child animations so that zero-duration tweens know whether to render their starting or ending values.

        while (child) {
          next = child._prev;

          if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
            if (child.parent !== this) {
              // an extreme edge case - the child's render could do something like kill() the "next" one in the linked list, or reparent it. In that case we must re-initiate the whole render to be safe.
              return this.render(totalTime, suppressEvents, force);
            }

            child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force);

            if (time !== this._time || !this._ts && !prevPaused) {
              //in case a tween pauses or seeks the timeline when rendering, like inside of an onUpdate/onComplete
              pauseTween = 0;
              next && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum); // it didn't finish rendering, so adjust zTime so that so that the next time render() is called it'll be forced (to render any remaining children)

              break;
            }
          }

          child = next;
        }
      }

      if (pauseTween && !suppressEvents) {
        this.pause();
        pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;

        if (this._ts) {
          //the callback resumed playback! So since we may have held back the playhead due to where the pause is positioned, go ahead and jump to where it's SUPPOSED to be (if no pause happened).
          this._start = prevStart; //if the pause was at an earlier time and the user resumed in the callback, it could reposition the timeline (changing its startTime), throwing things off slightly, so we make sure the _start doesn't shift.

          _setEnd(this);

          return this.render(totalTime, suppressEvents, force);
        }
      }

      if (this._onUpdate && !suppressEvents) {
        _callback(this, "onUpdate", true);
      }

      if (tTime === tDur && tDur >= this.totalDuration() || !tTime && this._ts < 0) if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) {
        (totalTime || !dur) && (totalTime && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1); // don't remove if the timeline is reversed and the playhead isn't at 0, otherwise tl.progress(1).reverse() won't work. Only remove if the playhead is at the end and timeScale is positive, or if the playhead is at 0 and the timeScale is negative.

        if (!suppressEvents && !(totalTime < 0 && !prevTime)) {
          _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);

          this._prom && this._prom();
        }
      }
    }

    return this;
  };

  _proto2.add = function add(child, position) {
    var _this2 = this;

    if (!_isNumber(position)) {
      position = _parsePosition(this, position);
    }

    if (!(child instanceof Animation)) {
      if (_isArray(child)) {
        child.forEach(function (obj) {
          return _this2.add(obj, position);
        });
        return _uncache(this);
      }

      if (_isString(child)) {
        return this.addLabel(child, position);
      }

      if (_isFunction(child)) {
        child = Tween.delayedCall(0, child);
      } else {
        return this;
      }
    }

    return this !== child ? _addToTimeline(this, child, position) : this; //don't allow a timeline to be added to itself as a child!
  };

  _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
    if (nested === void 0) {
      nested = true;
    }

    if (tweens === void 0) {
      tweens = true;
    }

    if (timelines === void 0) {
      timelines = true;
    }

    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = -_bigNum;
    }

    var a = [],
        child = this._first;

    while (child) {
      if (child._start >= ignoreBeforeTime) {
        if (child instanceof Tween) {
          if (tweens) {
            a.push(child);
          }
        } else {
          if (timelines) {
            a.push(child);
          }

          if (nested) {
            a.push.apply(a, child.getChildren(true, tweens, timelines));
          }
        }
      }

      child = child._next;
    }

    return a;
  };

  _proto2.getById = function getById(id) {
    var animations = this.getChildren(1, 1, 1),
        i = animations.length;

    while (i--) {
      if (animations[i].vars.id === id) {
        return animations[i];
      }
    }
  };

  _proto2.remove = function remove(child) {
    if (_isString(child)) {
      return this.removeLabel(child);
    }

    if (_isFunction(child)) {
      return this.killTweensOf(child);
    }

    _removeLinkedListItem(this, child);

    if (child === this._recent) {
      this._recent = this._last;
    }

    return _uncache(this);
  };

  _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
    if (!arguments.length) {
      return this._tTime;
    }

    this._forcing = 1;

    if (!this.parent && !this._dp && this._ts) {
      //special case for the global timeline (or any other that has no parent or detached parent).
      this._start = _round(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
    }

    _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);

    this._forcing = 0;
    return this;
  };

  _proto2.addLabel = function addLabel(label, position) {
    this.labels[label] = _parsePosition(this, position);
    return this;
  };

  _proto2.removeLabel = function removeLabel(label) {
    delete this.labels[label];
    return this;
  };

  _proto2.addPause = function addPause(position, callback, params) {
    var t = Tween.delayedCall(0, callback || _emptyFunc, params);
    t.data = "isPause";
    this._hasPause = 1;
    return _addToTimeline(this, t, _parsePosition(this, position));
  };

  _proto2.removePause = function removePause(position) {
    var child = this._first;
    position = _parsePosition(this, position);

    while (child) {
      if (child._start === position && child.data === "isPause") {
        _removeFromParent(child);
      }

      child = child._next;
    }
  };

  _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    var tweens = this.getTweensOf(targets, onlyActive),
        i = tweens.length;

    while (i--) {
      _overwritingTween !== tweens[i] && tweens[i].kill(targets, props);
    }

    return this;
  };

  _proto2.getTweensOf = function getTweensOf(targets, onlyActive) {
    var a = [],
        parsedTargets = toArray(targets),
        child = this._first,
        children;

    while (child) {
      if (child instanceof Tween) {
        if (_arrayContainsAny(child._targets, parsedTargets) && (!onlyActive || child.isActive(onlyActive === "started"))) {
          a.push(child);
        }
      } else if ((children = child.getTweensOf(parsedTargets, onlyActive)).length) {
        a.push.apply(a, children);
      }

      child = child._next;
    }

    return a;
  };

  _proto2.tweenTo = function tweenTo(position, vars) {
    vars = vars || {};

    var tl = this,
        endTime = _parsePosition(tl, position),
        _vars = vars,
        startAt = _vars.startAt,
        _onStart = _vars.onStart,
        onStartParams = _vars.onStartParams,
        tween = Tween.to(tl, _setDefaults(vars, {
      ease: "none",
      lazy: false,
      time: endTime,
      duration: vars.duration || Math.abs(endTime - (startAt && "time" in startAt ? startAt.time : tl._time)) / tl.timeScale() || _tinyNum,
      onStart: function onStart() {
        tl.pause();
        var duration = vars.duration || Math.abs(endTime - tl._time) / tl.timeScale();

        if (tween._dur !== duration) {
          _setDuration(tween, duration).render(tween._time, true, true);
        }

        if (_onStart) {
          //in case the user had an onStart in the vars - we don't want to overwrite it.
          _onStart.apply(tween, onStartParams || []);
        }
      }
    }));

    return tween;
  };

  _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
    return this.tweenTo(toPosition, _setDefaults({
      startAt: {
        time: _parsePosition(this, fromPosition)
      }
    }, vars));
  };

  _proto2.recent = function recent() {
    return this._recent;
  };

  _proto2.nextLabel = function nextLabel(afterTime) {
    if (afterTime === void 0) {
      afterTime = this._time;
    }

    return _getLabelInDirection(this, _parsePosition(this, afterTime));
  };

  _proto2.previousLabel = function previousLabel(beforeTime) {
    if (beforeTime === void 0) {
      beforeTime = this._time;
    }

    return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1);
  };

  _proto2.currentLabel = function currentLabel(value) {
    return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
  };

  _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = 0;
    }

    var child = this._first,
        labels = this.labels,
        p;

    while (child) {
      if (child._start >= ignoreBeforeTime) {
        child._start += amount;
      }

      child = child._next;
    }

    if (adjustLabels) {
      for (p in labels) {
        if (labels[p] >= ignoreBeforeTime) {
          labels[p] += amount;
        }
      }
    }

    return _uncache(this);
  };

  _proto2.invalidate = function invalidate() {
    var child = this._first;
    this._lock = 0;

    while (child) {
      child.invalidate();
      child = child._next;
    }

    return _Animation.prototype.invalidate.call(this);
  };

  _proto2.clear = function clear(includeLabels) {
    if (includeLabels === void 0) {
      includeLabels = true;
    }

    var child = this._first,
        next;

    while (child) {
      next = child._next;
      this.remove(child);
      child = next;
    }

    this._time = this._tTime = 0;

    if (includeLabels) {
      this.labels = {};
    }

    return _uncache(this);
  };

  _proto2.totalDuration = function totalDuration(value) {
    var max = 0,
        self = this,
        child = self._last,
        prevStart = _bigNum,
        prev,
        end,
        start,
        parent;

    if (arguments.length) {
      return self._repeat < 0 ? self : self.timeScale(self.totalDuration() / value);
    }

    if (self._dirty) {
      parent = self.parent;

      while (child) {
        prev = child._prev; //record it here in case the tween changes position in the sequence...

        if (child._dirty) {
          child.totalDuration(); //could change the tween._startTime, so make sure the animation's cache is clean before analyzing it.
        }

        start = child._start;

        if (start > prevStart && self._sort && child._ts && !self._lock) {
          //in case one of the tweens shifted out of order, it needs to be re-inserted into the correct position in the sequence
          self._lock = 1; //prevent endless recursive calls - there are methods that get triggered that check duration/totalDuration when we add().

          _addToTimeline(self, child, start - child._delay, 1)._lock = 0;
        } else {
          prevStart = start;
        }

        if (start < 0 && child._ts) {
          //children aren't allowed to have negative startTimes unless smoothChildTiming is true, so adjust here if one is found.
          max -= start;

          if (!parent && !self._dp || parent && parent.smoothChildTiming) {
            self._start += start / self._ts;
            self._time -= start;
            self._tTime -= start;
          }

          self.shiftChildren(-start, false, -1e20);
          prevStart = 0;
        }

        end = _setEnd(child);

        if (end > max && child._ts) {
          max = end;
        }

        child = prev;
      }

      _setDuration(self, self === _globalTimeline && self._time > max ? self._time : Math.min(_bigNum, max), 1);

      self._dirty = 0;
    }

    return self._tDur;
  };

  Timeline.updateRoot = function updateRoot(time) {
    if (_globalTimeline._ts) {
      _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));

      _lastRenderedFrame = _ticker.frame;
    }

    if (_ticker.frame >= _nextGCFrame) {
      _nextGCFrame += _config.autoSleep || 120;
      var child = _globalTimeline._first;
      if (!child || !child._ts) if (_config.autoSleep && _ticker._listeners.length < 2) {
        while (child && !child._ts) {
          child = child._next;
        }

        if (!child) {
          _ticker.sleep();
        }
      }
    }
  };

  return Timeline;
}(Animation);

exports.TimelineLite = exports.TimelineMax = exports.Timeline = Timeline;

_setDefaults(Timeline.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});

var _addComplexStringPropTween = function _addComplexStringPropTween(target, prop, start, end, setter, stringFilter, funcParam) {
  //note: we call _addComplexStringPropTween.call(tweenInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.
  var pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter),
      index = 0,
      matchIndex = 0,
      result,
      startNums,
      color,
      endNum,
      chunk,
      startNum,
      hasRandom,
      a;
  pt.b = start;
  pt.e = end;
  start += ""; //ensure values are strings

  end += "";

  if (hasRandom = ~end.indexOf("random(")) {
    end = _replaceRandom(end);
  }

  if (stringFilter) {
    a = [start, end];
    stringFilter(a, target, prop); //pass an array with the starting and ending values and let the filter do whatever it needs to the values.

    start = a[0];
    end = a[1];
  }

  startNums = start.match(_complexStringNumExp) || [];

  while (result = _complexStringNumExp.exec(end)) {
    endNum = result[0];
    chunk = end.substring(index, result.index);

    if (color) {
      color = (color + 1) % 5;
    } else if (chunk.substr(-5) === "rgba(") {
      color = 1;
    }

    if (endNum !== startNums[matchIndex++]) {
      startNum = parseFloat(startNums[matchIndex - 1]) || 0; //these nested PropTweens are handled in a special way - we'll never actually call a render or setter method on them. We'll just loop through them in the parent complex string PropTween's render method.

      pt._pt = {
        _next: pt._pt,
        p: chunk || matchIndex === 1 ? chunk : ",",
        //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
        s: startNum,
        c: endNum.charAt(1) === "=" ? parseFloat(endNum.substr(2)) * (endNum.charAt(0) === "-" ? -1 : 1) : parseFloat(endNum) - startNum,
        m: color && color < 4 ? Math.round : 0
      };
      index = _complexStringNumExp.lastIndex;
    }
  }

  pt.c = index < end.length ? end.substring(index, end.length) : ""; //we use the "c" of the PropTween to store the final part of the string (after the last number)

  pt.fp = funcParam;

  if (_relExp.test(end) || hasRandom) {
    pt.e = 0; //if the end string contains relative values or dynamic random(...) values, delete the end it so that on the final render we don't actually set it to the string with += or -= characters (forces it to use the calculated value).
  }

  this._pt = pt; //start the linked list with this new PropTween. Remember, we call _addComplexStringPropTween.call(tweenInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.

  return pt;
},
    _addPropTween = function _addPropTween(target, prop, start, end, index, targets, modifier, stringFilter, funcParam) {
  if (_isFunction(end)) {
    end = end(index || 0, target, targets);
  }

  var currentValue = target[prop],
      parsedStart = start !== "get" ? start : !_isFunction(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](),
      setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc,
      pt;

  if (_isString(end)) {
    if (~end.indexOf("random(")) {
      end = _replaceRandom(end);
    }

    if (end.charAt(1) === "=") {
      end = parseFloat(parsedStart) + parseFloat(end.substr(2)) * (end.charAt(0) === "-" ? -1 : 1) + (getUnit(parsedStart) || 0);
    }
  }

  if (parsedStart !== end) {
    if (!isNaN(parsedStart + end)) {
      pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);

      if (funcParam) {
        pt.fp = funcParam;
      }

      if (modifier) {
        pt.modifier(modifier, this, target);
      }

      return this._pt = pt;
    }

    !currentValue && !(prop in target) && _missingPlugin(prop, end);
    return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
  }
},
    //creates a copy of the vars object and processes any function-based values (putting the resulting values directly into the copy) as well as strings with "random()" in them. It does NOT process relative values.
_processVars = function _processVars(vars, index, target, targets, tween) {
  if (_isFunction(vars)) {
    vars = _parseFuncOrString(vars, tween, index, target, targets);
  }

  if (!_isObject(vars) || vars.style && vars.nodeType || _isArray(vars)) {
    return _isString(vars) ? _parseFuncOrString(vars, tween, index, target, targets) : vars;
  }

  var copy = {},
      p;

  for (p in vars) {
    copy[p] = _parseFuncOrString(vars[p], tween, index, target, targets);
  }

  return copy;
},
    _checkPlugin = function _checkPlugin(property, vars, tween, index, target, targets) {
  var plugin, pt, ptLookup, i;

  if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index, target, targets, tween), tween, index, targets) !== false) {
    tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);

    if (tween !== _quickTween) {
      ptLookup = tween._ptLookup[tween._targets.indexOf(target)]; //note: we can't use tween._ptLookup[index] because for staggered tweens, the index from the fullTargets array won't match what it is in each individual tween that spawns from the stagger.

      i = plugin._props.length;

      while (i--) {
        ptLookup[plugin._props[i]] = pt;
      }
    }
  }

  return plugin;
},
    _overwritingTween,
    //store a reference temporarily so we can avoid overwriting itself.
_initTween = function _initTween(tween, time) {
  var vars = tween.vars,
      ease = vars.ease,
      startAt = vars.startAt,
      immediateRender = vars.immediateRender,
      lazy = vars.lazy,
      onUpdate = vars.onUpdate,
      onUpdateParams = vars.onUpdateParams,
      callbackScope = vars.callbackScope,
      runBackwards = vars.runBackwards,
      yoyoEase = vars.yoyoEase,
      keyframes = vars.keyframes,
      autoRevert = vars.autoRevert,
      dur = tween._dur,
      prevStartAt = tween._startAt,
      targets = tween._targets,
      parent = tween.parent,
      fullTargets = parent && parent.data === "nested" ? parent.parent._targets : targets,
      autoOverwrite = tween._overwrite === "auto",
      tl = tween.timeline,
      cleanVars,
      i,
      p,
      pt,
      target,
      hasPriority,
      gsData,
      harness,
      plugin,
      ptLookup,
      index,
      harnessVars;

  if (tl && (!keyframes || !ease)) {
    ease = "none";
  }

  tween._ease = _parseEase(ease, _defaults.ease);
  tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease)) : 0;

  if (yoyoEase && tween._yoyo && !tween._repeat) {
    //there must have been a parent timeline with yoyo:true that is currently in its yoyo phase, so flip the eases.
    yoyoEase = tween._yEase;
    tween._yEase = tween._ease;
    tween._ease = yoyoEase;
  }

  if (!tl) {
    //if there's an internal timeline, skip all the parsing because we passed that task down the chain.
    if (prevStartAt) {
      prevStartAt.render(-1, true).kill();
    }

    if (startAt) {
      _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({
        data: "isStart",
        overwrite: false,
        parent: parent,
        immediateRender: true,
        lazy: _isNotFalse(lazy),
        startAt: null,
        delay: 0,
        onUpdate: onUpdate,
        onUpdateParams: onUpdateParams,
        callbackScope: callbackScope,
        stagger: 0
      }, startAt))); //copy the properties/values into a new object to avoid collisions, like var to = {x:0}, from = {x:500}; timeline.fromTo(e, from, to).fromTo(e, to, from);


      if (immediateRender) {
        if (time > 0) {
          !autoRevert && (tween._startAt = 0); //tweens that render immediately (like most from() and fromTo() tweens) shouldn't revert when their parent timeline's playhead goes backward past the startTime because the initial render could have happened anytime and it shouldn't be directly correlated to this tween's startTime. Imagine setting up a complex animation where the beginning states of various objects are rendered immediately but the tween doesn't happen for quite some time - if we revert to the starting values as soon as the playhead goes backward past the tween's startTime, it will throw things off visually. Reversion should only happen in Timeline instances where immediateRender was false or when autoRevert is explicitly set to true.
        } else if (dur) {
          return; //we skip initialization here so that overwriting doesn't occur until the tween actually begins. Otherwise, if you create several immediateRender:true tweens of the same target/properties to drop into a Timeline, the last one created would overwrite the first ones because they didn't get placed into the timeline yet before the first render occurs and kicks in overwriting.
        }
      }
    } else if (runBackwards && dur) {
      //from() tweens must be handled uniquely: their beginning values must be rendered but we don't want overwriting to occur yet (when time is still 0). Wait until the tween actually begins before doing all the routines like overwriting. At that time, we should render at the END of the tween to ensure that things initialize correctly (remember, from() tweens go backwards)
      if (prevStartAt) {
        !autoRevert && (tween._startAt = 0);
      } else {
        if (time) {
          //in rare cases (like if a from() tween runs and then is invalidate()-ed), immediateRender could be true but the initial forced-render gets skipped, so there's no need to force the render in this context when the _time is greater than 0
          immediateRender = false;
        }

        _removeFromParent(tween._startAt = Tween.set(targets, _merge(_copyExcluding(vars, _reservedProps), {
          overwrite: false,
          data: "isFromStart",
          //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
          lazy: immediateRender && _isNotFalse(lazy),
          immediateRender: immediateRender,
          //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
          stagger: 0,
          parent: parent //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y:gsap.utils.wrap([-100,100])})

        })));

        if (!immediateRender) {
          _initTween(tween._startAt, _tinyNum); //ensures that the initial values are recorded

        } else if (!time) {
          return;
        }
      }
    }

    cleanVars = _copyExcluding(vars, _reservedProps);
    tween._pt = 0;
    harness = targets[0] ? _getCache(targets[0]).harness : 0;
    harnessVars = harness && vars[harness.prop]; //someone may need to specify CSS-specific values AND non-CSS values, like if the element has an "x" property plus it's a standard DOM element. We allow people to distinguish by wrapping plugin-specific stuff in a css:{} object for example.

    lazy = dur && _isNotFalse(lazy) || lazy && !dur;

    for (i = 0; i < targets.length; i++) {
      target = targets[i];
      gsData = target._gsap || _harness(targets)[i]._gsap;
      tween._ptLookup[i] = ptLookup = {};

      if (_lazyLookup[gsData.id]) {
        _lazyRender(); //if other tweens of the same target have recently initted but haven't rendered yet, we've got to force the render so that the starting values are correct (imagine populating a timeline with a bunch of sequential tweens and then jumping to the end)

      }

      index = fullTargets === targets ? i : fullTargets.indexOf(target);

      if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index, fullTargets) !== false) {
        tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);

        plugin._props.forEach(function (name) {
          ptLookup[name] = pt;
        });

        if (plugin.priority) {
          hasPriority = 1;
        }
      }

      if (!harness || harnessVars) {
        for (p in cleanVars) {
          if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index, target, fullTargets))) {
            if (plugin.priority) {
              hasPriority = 1;
            }
          } else {
            ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index, fullTargets, 0, vars.stringFilter);
          }
        }
      }

      if (tween._op && tween._op[i]) {
        tween.kill(target, tween._op[i]);
      }

      if (autoOverwrite && tween._pt) {
        _overwritingTween = tween;

        _globalTimeline.killTweensOf(target, ptLookup, "started"); //Also make sure the overwriting doesn't overwrite THIS tween!!!


        _overwritingTween = 0;
      }

      if (tween._pt && lazy) {
        _lazyLookup[gsData.id] = 1;
      }
    }

    if (hasPriority) {
      _sortPropTweensByPriority(tween);
    }

    if (tween._onInit) {
      //plugins like RoundProps must wait until ALL of the PropTweens are instantiated. In the plugin's init() function, it sets the _onInit on the tween instance. May not be pretty/intuitive, but it's fast and keeps file size down.
      tween._onInit(tween);
    }
  }

  tween._from = !tl && !!vars.runBackwards; //nested timelines should never run backwards - the backwards-ness is in the child tweens.

  tween._onUpdate = onUpdate;
  tween._initted = 1;
},
    _addAliasesToVars = function _addAliasesToVars(targets, vars) {
  var harness = targets[0] ? _getCache(targets[0]).harness : 0,
      propertyAliases = harness && harness.aliases,
      copy,
      p,
      i,
      aliases;

  if (!propertyAliases) {
    return vars;
  }

  copy = _merge({}, vars);

  for (p in propertyAliases) {
    if (p in copy) {
      aliases = propertyAliases[p].split(",");
      i = aliases.length;

      while (i--) {
        copy[aliases[i]] = copy[p];
      }
    }
  }

  return copy;
},
    _parseFuncOrString = function _parseFuncOrString(value, tween, i, target, targets) {
  return _isFunction(value) ? value.call(tween, i, target, targets) : _isString(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
},
    _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase",
    _staggerPropsToSkip = (_staggerTweenProps + ",id,stagger,delay,duration,paused").split(",");
/*
 * --------------------------------------------------------------------------------------
 * TWEEN
 * --------------------------------------------------------------------------------------
 */


exports._checkPlugin = _checkPlugin;

var Tween = /*#__PURE__*/function (_Animation2) {
  _inheritsLoose(Tween, _Animation2);

  function Tween(targets, vars, time, skipInherit) {
    var _this3;

    if (typeof vars === "number") {
      time.duration = vars;
      vars = time;
      time = null;
    }

    _this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars), time) || this;
    var _this3$vars = _this3.vars,
        duration = _this3$vars.duration,
        delay = _this3$vars.delay,
        immediateRender = _this3$vars.immediateRender,
        stagger = _this3$vars.stagger,
        overwrite = _this3$vars.overwrite,
        keyframes = _this3$vars.keyframes,
        defaults = _this3$vars.defaults,
        parent = _this3.parent,
        parsedTargets = (_isArray(targets) ? _isNumber(targets[0]) : "length" in vars) ? [targets] : toArray(targets),
        tl,
        i,
        copy,
        l,
        p,
        curTarget,
        staggerFunc,
        staggerVarsToMerge;
    _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://greensock.com", !_config.nullTargetWarn) || [];
    _this3._ptLookup = []; //PropTween lookup. An array containing an object for each target, having keys for each tweening property

    _this3._overwrite = overwrite;

    if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
      vars = _this3.vars;
      tl = _this3.timeline = new Timeline({
        data: "nested",
        defaults: defaults || {}
      });
      tl.kill();
      tl.parent = _assertThisInitialized(_this3);

      if (keyframes) {
        _setDefaults(tl.vars.defaults, {
          ease: "none"
        });

        keyframes.forEach(function (frame) {
          return tl.to(parsedTargets, frame, ">");
        });
      } else {
        l = parsedTargets.length;
        staggerFunc = stagger ? distribute(stagger) : _emptyFunc;

        if (_isObject(stagger)) {
          //users can pass in callbacks like onStart/onComplete in the stagger object. These should fire with each individual tween.
          for (p in stagger) {
            if (~_staggerTweenProps.indexOf(p)) {
              if (!staggerVarsToMerge) {
                staggerVarsToMerge = {};
              }

              staggerVarsToMerge[p] = stagger[p];
            }
          }
        }

        for (i = 0; i < l; i++) {
          copy = {};

          for (p in vars) {
            if (_staggerPropsToSkip.indexOf(p) < 0) {
              copy[p] = vars[p];
            }
          }

          copy.stagger = 0;

          if (staggerVarsToMerge) {
            _merge(copy, staggerVarsToMerge);
          }

          if (vars.yoyoEase && !vars.repeat) {
            //so that propagation works properly when a ancestor timeline yoyos
            copy.yoyoEase = vars.yoyoEase;
          }

          curTarget = parsedTargets[i]; //don't just copy duration or delay because if they're a string or function, we'd end up in an infinite loop because _isFuncOrString() would evaluate as true in the child tweens, entering this loop, etc. So we parse the value straight from vars and default to 0.

          copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i, curTarget, parsedTargets);
          copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay;

          if (!stagger && l === 1 && copy.delay) {
            // if someone does delay:"random(1, 5)", repeat:-1, for example, the delay shouldn't be inside the repeat.
            _this3._delay = delay = copy.delay;
            _this3._start += delay;
            copy.delay = 0;
          }

          tl.to(curTarget, copy, staggerFunc(i, curTarget, parsedTargets));
        }

        duration = delay = 0;
      }

      duration || _this3.duration(duration = tl.duration());
    } else {
      _this3.timeline = 0; //speed optimization, faster lookups (no going up the prototype chain)
    }

    if (overwrite === true) {
      _overwritingTween = _assertThisInitialized(_this3);

      _globalTimeline.killTweensOf(parsedTargets);

      _overwritingTween = 0;
    }

    parent && _postAddChecks(parent, _assertThisInitialized(_this3));

    if (immediateRender || !duration && !keyframes && _this3._start === parent._time && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent.data !== "nested") {
      _this3._tTime = -_tinyNum; //forces a render without having to set the render() "force" parameter to true because we want to allow lazying by default (using the "force" parameter always forces an immediate full render)

      _this3.render(Math.max(0, -delay)); //in case delay is negative

    }

    return _this3;
  }

  var _proto3 = Tween.prototype;

  _proto3.render = function render(totalTime, suppressEvents, force) {
    var prevTime = this._time,
        tDur = this._tDur,
        dur = this._dur,
        tTime = totalTime > tDur - _tinyNum && totalTime >= 0 ? tDur : totalTime < _tinyNum ? 0 : totalTime,
        time,
        pt,
        iteration,
        cycleDuration,
        prevIteration,
        isYoyo,
        ratio,
        timeline,
        yoyoEase;

    if (!dur) {
      _renderZeroDurationTween(this, totalTime, suppressEvents, force);
    } else if (tTime !== this._tTime || !totalTime || force || this._startAt && this._zTime < 0 !== totalTime < 0) {
      //this senses if we're crossing over the start time, in which case we must record _zTime and force the render, but we do it in this lengthy conditional way for performance reasons (usually we can skip the calculations): this._initted && (this._zTime < 0) !== (totalTime < 0)
      time = tTime;
      timeline = this.timeline;

      if (this._repeat) {
        //adjust the time for repeats and yoyos
        cycleDuration = dur + this._rDelay;
        time = _round(tTime % cycleDuration); //round to avoid floating point errors. (4 % 0.8 should be 0 but some browsers report it as 0.79999999!)

        if (time > dur || tDur === tTime) {
          // the tDur === tTime is for edge cases where there's a lengthy decimal on the duration and it may reach the very end but the time is rendered as not-quite-there (remember, tDur is rounded to 4 decimals whereas dur isn't)
          time = dur;
        }

        iteration = ~~(tTime / cycleDuration);

        if (iteration && iteration === tTime / cycleDuration) {
          time = dur;
          iteration--;
        }

        isYoyo = this._yoyo && iteration & 1;

        if (isYoyo) {
          yoyoEase = this._yEase;
          time = dur - time;
        }

        prevIteration = _animationCycle(this._tTime, cycleDuration);

        if (time === prevTime && !force && this._initted) {
          //could be during the repeatDelay part. No need to render and fire callbacks.
          return this;
        }

        if (iteration !== prevIteration) {
          //timeline && this._yEase && _propagateYoyoEase(timeline, isYoyo);
          //repeatRefresh functionality
          if (this.vars.repeatRefresh && !isYoyo && !this._lock) {
            this._lock = force = 1; //force, otherwise if lazy is true, the _attemptInitTween() will return and we'll jump out and get caught bouncing on each tick.

            this.render(cycleDuration * iteration, true).invalidate()._lock = 0;
          }
        }
      }

      if (!this._initted && _attemptInitTween(this, time, force, suppressEvents)) {
        this._tTime = 0; // in constructor if immediateRender is true, we set _tTime to -_tinyNum to have the playhead cross the starting point but we can't leave _tTime as a negative number.

        return this;
      }

      this._tTime = tTime;
      this._time = time;

      if (!this._act && this._ts) {
        this._act = 1; //as long as it's not paused, force it to be active so that if the user renders independent of the parent timeline, it'll be forced to re-render on the next tick.

        this._lazy = 0;
      }

      this.ratio = ratio = (yoyoEase || this._ease)(time / dur);

      if (this._from) {
        this.ratio = ratio = 1 - ratio;
      }

      if (!prevTime && time && !suppressEvents) {
        _callback(this, "onStart");
      }

      pt = this._pt;

      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }

      timeline && timeline.render(totalTime < 0 ? totalTime : !time && isYoyo ? -_tinyNum : timeline._dur * ratio, suppressEvents, force) || this._startAt && (this._zTime = totalTime);

      if (this._onUpdate && !suppressEvents) {
        if (totalTime < 0 && this._startAt) {
          this._startAt.render(totalTime, true, force); //note: for performance reasons, we tuck this conditional logic inside less traveled areas (most tweens don't have an onUpdate). We'd just have it at the end before the onComplete, but the values should be updated before any onUpdate is called, so we ALSO put it here and then if it's not called, we do so later near the onComplete.

        }

        _callback(this, "onUpdate");
      }

      if (this._repeat) if (iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent) {
        _callback(this, "onRepeat");
      }

      if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
        if (totalTime < 0 && this._startAt && !this._onUpdate) {
          this._startAt.render(totalTime, true, force);
        }

        (totalTime || !dur) && (totalTime && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1); // don't remove if we're rendering at exactly a time of 0, as there could be autoRevert values that should get set on the next tick (if the playhead goes backward beyond the startTime, negative totalTime). Don't remove if the timeline is reversed and the playhead isn't at 0, otherwise tl.progress(1).reverse() won't work. Only remove if the playhead is at the end and timeScale is positive, or if the playhead is at 0 and the timeScale is negative.

        if (!suppressEvents && !(totalTime < 0 && !prevTime) && !(tTime < tDur && this.timeScale() > 0)) {
          _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);

          this._prom && this._prom();
        }
      }
    }

    return this;
  };

  _proto3.targets = function targets() {
    return this._targets;
  };

  _proto3.invalidate = function invalidate() {
    this._pt = this._op = this._startAt = this._onUpdate = this._act = this._lazy = 0;
    this._ptLookup = [];
    this.timeline && this.timeline.invalidate();
    return _Animation2.prototype.invalidate.call(this);
  };

  _proto3.kill = function kill(targets, vars) {
    if (vars === void 0) {
      vars = "all";
    }

    if (!targets && (!vars || vars === "all")) {
      this._lazy = 0;

      if (this.parent) {
        return _interrupt(this);
      }
    }

    if (this.timeline) {
      this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true);
      return this;
    }

    var parsedTargets = this._targets,
        killingTargets = targets ? toArray(targets) : parsedTargets,
        propTweenLookup = this._ptLookup,
        firstPT = this._pt,
        overwrittenProps,
        curLookup,
        curOverwriteProps,
        props,
        p,
        pt,
        i;

    if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
      return _interrupt(this);
    }

    overwrittenProps = this._op = this._op || [];

    if (vars !== "all") {
      //so people can pass in a comma-delimited list of property names
      if (_isString(vars)) {
        p = {};

        _forEachName(vars, function (name) {
          return p[name] = 1;
        });

        vars = p;
      }

      vars = _addAliasesToVars(parsedTargets, vars);
    }

    i = parsedTargets.length;

    while (i--) {
      if (~killingTargets.indexOf(parsedTargets[i])) {
        curLookup = propTweenLookup[i];

        if (vars === "all") {
          overwrittenProps[i] = vars;
          props = curLookup;
          curOverwriteProps = {};
        } else {
          curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
          props = vars;
        }

        for (p in props) {
          pt = curLookup && curLookup[p];

          if (pt) {
            if (!("kill" in pt.d) || pt.d.kill(p) === true) {
              _removeLinkedListItem(this, pt, "_pt");
            }

            delete curLookup[p];
          }

          if (curOverwriteProps !== "all") {
            curOverwriteProps[p] = 1;
          }
        }
      }
    }

    if (this._initted && !this._pt && firstPT) {
      //if all tweening properties are killed, kill the tween. Without this line, if there's a tween with multiple targets and then you killTweensOf() each target individually, the tween would technically still remain active and fire its onComplete even though there aren't any more properties tweening.
      _interrupt(this);
    }

    return this;
  };

  Tween.to = function to(targets, vars) {
    return new Tween(targets, vars, arguments[2]);
  };

  Tween.from = function from(targets, vars) {
    return new Tween(targets, _parseVars(arguments, 1));
  };

  Tween.delayedCall = function delayedCall(delay, callback, params, scope) {
    return new Tween(callback, 0, {
      immediateRender: false,
      lazy: false,
      overwrite: false,
      delay: delay,
      onComplete: callback,
      onReverseComplete: callback,
      onCompleteParams: params,
      onReverseCompleteParams: params,
      callbackScope: scope
    });
  };

  Tween.fromTo = function fromTo(targets, fromVars, toVars) {
    return new Tween(targets, _parseVars(arguments, 2));
  };

  Tween.set = function set(targets, vars) {
    vars.duration = 0;
    vars.repeatDelay || (vars.repeat = 0);
    return new Tween(targets, vars);
  };

  Tween.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    return _globalTimeline.killTweensOf(targets, props, onlyActive);
  };

  return Tween;
}(Animation);

exports.TweenLite = exports.TweenMax = exports.Tween = Tween;

_setDefaults(Tween.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
}); //add the pertinent timeline methods to Tween instances so that users can chain conveniently and create a timeline automatically. (removed due to concerns that it'd ultimately add to more confusion especially for beginners)
// _forEachName("to,from,fromTo,set,call,add,addLabel,addPause", name => {
// 	Tween.prototype[name] = function() {
// 		let tl = new Timeline();
// 		return _addToTimeline(tl, this)[name].apply(tl, toArray(arguments));
// 	}
// });
//for backward compatibility. Leverage the timeline calls.


_forEachName("staggerTo,staggerFrom,staggerFromTo", function (name) {
  Tween[name] = function () {
    var tl = new Timeline(),
        params = _slice.call(arguments, 0);

    params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
    return tl[name].apply(tl, params);
  };
});
/*
 * --------------------------------------------------------------------------------------
 * PROPTWEEN
 * --------------------------------------------------------------------------------------
 */


var _setterPlain = function _setterPlain(target, property, value) {
  return target[property] = value;
},
    _setterFunc = function _setterFunc(target, property, value) {
  return target[property](value);
},
    _setterFuncWithParam = function _setterFuncWithParam(target, property, value, data) {
  return target[property](data.fp, value);
},
    _setterAttribute = function _setterAttribute(target, property, value) {
  return target.setAttribute(property, value);
},
    _getSetter = function _getSetter(target, property) {
  return _isFunction(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
},
    _renderPlain = function _renderPlain(ratio, data) {
  return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 10000) / 10000, data);
},
    _renderBoolean = function _renderBoolean(ratio, data) {
  return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
},
    _renderComplexString = function _renderComplexString(ratio, data) {
  var pt = data._pt,
      s = "";

  if (!ratio && data.b) {
    //b = beginning string
    s = data.b;
  } else if (ratio === 1 && data.e) {
    //e = ending string
    s = data.e;
  } else {
    while (pt) {
      s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 10000) / 10000) + s; //we use the "p" property for the text inbetween (like a suffix). And in the context of a complex string, the modifier (m) is typically just Math.round(), like for RGB colors.

      pt = pt._next;
    }

    s += data.c; //we use the "c" of the PropTween to store the final chunk of non-numeric text.
  }

  data.set(data.t, data.p, s, data);
},
    _renderPropTweens = function _renderPropTweens(ratio, data) {
  var pt = data._pt;

  while (pt) {
    pt.r(ratio, pt.d);
    pt = pt._next;
  }
},
    _addPluginModifier = function _addPluginModifier(modifier, tween, target, property) {
  var pt = this._pt,
      next;

  while (pt) {
    next = pt._next;

    if (pt.p === property) {
      pt.modifier(modifier, tween, target);
    }

    pt = next;
  }
},
    _killPropTweensOf = function _killPropTweensOf(property) {
  var pt = this._pt,
      hasNonDependentRemaining,
      next;

  while (pt) {
    next = pt._next;

    if (pt.p === property && !pt.op || pt.op === property) {
      _removeLinkedListItem(this, pt, "_pt");
    } else if (!pt.dep) {
      hasNonDependentRemaining = 1;
    }

    pt = next;
  }

  return !hasNonDependentRemaining;
},
    _setterWithModifier = function _setterWithModifier(target, property, value, data) {
  data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
},
    _sortPropTweensByPriority = function _sortPropTweensByPriority(parent) {
  var pt = parent._pt,
      next,
      pt2,
      first,
      last; //sorts the PropTween linked list in order of priority because some plugins need to do their work after ALL of the PropTweens were created (like RoundPropsPlugin and ModifiersPlugin)

  while (pt) {
    next = pt._next;
    pt2 = first;

    while (pt2 && pt2.pr > pt.pr) {
      pt2 = pt2._next;
    }

    if (pt._prev = pt2 ? pt2._prev : last) {
      pt._prev._next = pt;
    } else {
      first = pt;
    }

    if (pt._next = pt2) {
      pt2._prev = pt;
    } else {
      last = pt;
    }

    pt = next;
  }

  parent._pt = first;
}; //PropTween key: t = target, p = prop, r = renderer, d = data, s = start, c = change, op = overwriteProperty (ONLY populated when it's different than p), pr = priority, _next/_prev for the linked list siblings, set = setter, m = modifier, mSet = modifierSetter (the original setter, before a modifier was added)


exports._sortPropTweensByPriority = _sortPropTweensByPriority;
exports._renderComplexString = _renderComplexString;
exports._getSetter = _getSetter;

var PropTween = /*#__PURE__*/function () {
  function PropTween(next, target, prop, start, change, renderer, data, setter, priority) {
    this.t = target;
    this.s = start;
    this.c = change;
    this.p = prop;
    this.r = renderer || _renderPlain;
    this.d = data || this;
    this.set = setter || _setterPlain;
    this.pr = priority || 0;
    this._next = next;

    if (next) {
      next._prev = this;
    }
  }

  var _proto4 = PropTween.prototype;

  _proto4.modifier = function modifier(func, tween, target) {
    this.mSet = this.mSet || this.set; //in case it was already set (a PropTween can only have one modifier)

    this.set = _setterWithModifier;
    this.m = func;
    this.mt = target; //modifier target

    this.tween = tween;
  };

  return PropTween;
}(); //Initialization tasks


exports.PropTween = PropTween;

_forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert", function (name) {
  return _reservedProps[name] = 1;
});

_globals.TweenMax = _globals.TweenLite = Tween;
_globals.TimelineLite = _globals.TimelineMax = Timeline;
_globalTimeline = new Timeline({
  sortChildren: false,
  defaults: _defaults,
  autoRemoveChildren: true,
  id: "root",
  smoothChildTiming: true
});
_config.stringFilter = _colorStringFilter;
/*
 * --------------------------------------------------------------------------------------
 * GSAP
 * --------------------------------------------------------------------------------------
 */

var _gsap = {
  registerPlugin: function registerPlugin() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }

    args.forEach(function (config) {
      return _createPlugin(config);
    });
  },
  timeline: function timeline(vars) {
    return new Timeline(vars);
  },
  getTweensOf: function getTweensOf(targets, onlyActive) {
    return _globalTimeline.getTweensOf(targets, onlyActive);
  },
  getProperty: function getProperty(target, property, unit, uncache) {
    if (_isString(target)) {
      //in case selector text or an array is passed in
      target = toArray(target)[0];
    }

    var getter = _getCache(target || {}).get,
        format = unit ? _passThrough : _numericIfPossible;

    if (unit === "native") {
      unit = "";
    }

    return !target ? target : !property ? function (property, unit, uncache) {
      return format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
    } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
  },
  quickSetter: function quickSetter(target, property, unit) {
    target = toArray(target);

    if (target.length > 1) {
      var setters = target.map(function (t) {
        return gsap.quickSetter(t, property, unit);
      }),
          l = setters.length;
      return function (value) {
        var i = l;

        while (i--) {
          setters[i](value);
        }
      };
    }

    target = target[0] || {};

    var Plugin = _plugins[property],
        cache = _getCache(target),
        setter = Plugin ? function (value) {
      var p = new Plugin();
      _quickTween._pt = 0;
      p.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
      p.render(1, p);
      _quickTween._pt && _renderPropTweens(1, _quickTween);
    } : cache.set(target, property);

    return Plugin ? setter : function (value) {
      return setter(target, property, unit ? value + unit : value, cache, 1);
    };
  },
  isTweening: function isTweening(targets) {
    return _globalTimeline.getTweensOf(targets, true).length > 0;
  },
  defaults: function defaults(value) {
    if (value && value.ease) {
      value.ease = _parseEase(value.ease, _defaults.ease);
    }

    return _mergeDeep(_defaults, value || {});
  },
  config: function config(value) {
    return _mergeDeep(_config, value || {});
  },
  registerEffect: function registerEffect(_ref) {
    var name = _ref.name,
        effect = _ref.effect,
        plugins = _ref.plugins,
        defaults = _ref.defaults,
        extendTimeline = _ref.extendTimeline;
    (plugins || "").split(",").forEach(function (pluginName) {
      return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
    });

    _effects[name] = function (targets, vars) {
      return effect(toArray(targets), _setDefaults(vars || {}, defaults));
    };

    if (extendTimeline) {
      Timeline.prototype[name] = function (targets, vars, position) {
        return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}), position);
      };
    }
  },
  registerEase: function registerEase(name, ease) {
    _easeMap[name] = _parseEase(ease);
  },
  parseEase: function parseEase(ease, defaultEase) {
    return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
  },
  getById: function getById(id) {
    return _globalTimeline.getById(id);
  },
  exportRoot: function exportRoot(vars, includeDelayedCalls) {
    if (vars === void 0) {
      vars = {};
    }

    var tl = new Timeline(vars),
        child,
        next;
    tl.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);

    _globalTimeline.remove(tl);

    tl._dp = 0; //otherwise it'll get re-activated when adding children and be re-introduced into _globalTimeline's linked list (then added to itself).

    tl._time = tl._tTime = _globalTimeline._time;
    child = _globalTimeline._first;

    while (child) {
      next = child._next;

      if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
        _addToTimeline(tl, child, child._start - child._delay);
      }

      child = next;
    }

    _addToTimeline(_globalTimeline, tl, 0);

    return tl;
  },
  utils: {
    wrap: wrap,
    wrapYoyo: wrapYoyo,
    distribute: distribute,
    random: random,
    snap: snap,
    normalize: normalize,
    getUnit: getUnit,
    clamp: clamp,
    splitColor: splitColor,
    toArray: toArray,
    mapRange: mapRange,
    pipe: pipe,
    unitize: unitize,
    interpolate: interpolate,
    shuffle: shuffle
  },
  install: _install,
  effects: _effects,
  ticker: _ticker,
  updateRoot: Timeline.updateRoot,
  plugins: _plugins,
  globalTimeline: _globalTimeline,
  core: {
    PropTween: PropTween,
    globals: _addGlobal,
    Tween: Tween,
    Timeline: Timeline,
    Animation: Animation,
    getCache: _getCache,
    _removeLinkedListItem: _removeLinkedListItem
  }
};

_forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function (name) {
  return _gsap[name] = Tween[name];
});

_ticker.add(Timeline.updateRoot);

_quickTween = _gsap.to({}, {
  duration: 0
}); // ---- EXTRA PLUGINS --------------------------------------------------------

var _getPluginPropTween = function _getPluginPropTween(plugin, prop) {
  var pt = plugin._pt;

  while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
    pt = pt._next;
  }

  return pt;
},
    _addModifiers = function _addModifiers(tween, modifiers) {
  var targets = tween._targets,
      p,
      i,
      pt;

  for (p in modifiers) {
    i = targets.length;

    while (i--) {
      pt = tween._ptLookup[i][p];

      if (pt && (pt = pt.d)) {
        if (pt._pt) {
          // is a plugin
          pt = _getPluginPropTween(pt, p);
        }

        pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
      }
    }
  }
},
    _buildModifierPlugin = function _buildModifierPlugin(name, modifier) {
  return {
    name: name,
    rawVars: 1,
    //don't pre-process function-based values or "random()" strings.
    init: function init(target, vars, tween) {
      tween._onInit = function (tween) {
        var temp, p;

        if (_isString(vars)) {
          temp = {};

          _forEachName(vars, function (name) {
            return temp[name] = 1;
          }); //if the user passes in a comma-delimited list of property names to roundProps, like "x,y", we round to whole numbers.


          vars = temp;
        }

        if (modifier) {
          temp = {};

          for (p in vars) {
            temp[p] = modifier(vars[p]);
          }

          vars = temp;
        }

        _addModifiers(tween, vars);
      };
    }
  };
}; //register core plugins


var gsap = _gsap.registerPlugin({
  name: "attr",
  init: function init(target, vars, tween, index, targets) {
    for (var p in vars) {
      this.add(target, "setAttribute", (target.getAttribute(p) || 0) + "", vars[p], index, targets, 0, 0, p); //this.add(target, "setAttribute", (target.getAttribute((p in target.dataset ? (p = "data-" + p) : p)) || 0) + "", vars[p], index, targets, 0, 0, p);

      this._props.push(p);
    }
  }
}, {
  name: "endArray",
  init: function init(target, value) {
    var i = value.length;

    while (i--) {
      this.add(target, i, target[i] || 0, value[i]);
    }
  }
}, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap; //to prevent the core plugins from being dropped via aggressive tree shaking, we must include them in the variable declaration in this way.


exports.default = exports.gsap = gsap;
Tween.version = Timeline.version = gsap.version = "3.2.4";
_coreReady = 1;

if (_windowExists()) {
  _wake();
}

var Power0 = _easeMap.Power0,
    Power1 = _easeMap.Power1,
    Power2 = _easeMap.Power2,
    Power3 = _easeMap.Power3,
    Power4 = _easeMap.Power4,
    Linear = _easeMap.Linear,
    Quad = _easeMap.Quad,
    Cubic = _easeMap.Cubic,
    Quart = _easeMap.Quart,
    Quint = _easeMap.Quint,
    Strong = _easeMap.Strong,
    Elastic = _easeMap.Elastic,
    Back = _easeMap.Back,
    SteppedEase = _easeMap.SteppedEase,
    Bounce = _easeMap.Bounce,
    Sine = _easeMap.Sine,
    Expo = _easeMap.Expo,
    Circ = _easeMap.Circ;
exports.Circ = Circ;
exports.Expo = Expo;
exports.Sine = Sine;
exports.Bounce = Bounce;
exports.SteppedEase = SteppedEase;
exports.Back = Back;
exports.Elastic = Elastic;
exports.Strong = Strong;
exports.Quint = Quint;
exports.Quart = Quart;
exports.Cubic = Cubic;
exports.Quad = Quad;
exports.Linear = Linear;
exports.Power4 = Power4;
exports.Power3 = Power3;
exports.Power2 = Power2;
exports.Power1 = Power1;
exports.Power0 = Power0;
},{}],"node_modules/gsap/CSSPlugin.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkPrefix = exports._createElement = exports._getBBox = exports.default = exports.CSSPlugin = void 0;

var _gsapCore = require("./gsap-core.js");

/*!
 * CSSPlugin 3.2.4
 * https://greensock.com
 *
 * Copyright 2008-2020, GreenSock. All rights reserved.
 * Subject to the terms at https://greensock.com/standard-license or for
 * Club GreenSock members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/

/* eslint-disable */
var _win,
    _doc,
    _docElement,
    _pluginInitted,
    _tempDiv,
    _tempDivStyler,
    _recentSetterPlugin,
    _windowExists = function _windowExists() {
  return typeof window !== "undefined";
},
    _transformProps = {},
    _RAD2DEG = 180 / Math.PI,
    _DEG2RAD = Math.PI / 180,
    _atan2 = Math.atan2,
    _bigNum = 1e8,
    _capsExp = /([A-Z])/g,
    _horizontalExp = /(?:left|right|width|margin|padding|x)/i,
    _complexExp = /[\s,\(]\S/,
    _propertyAliases = {
  autoAlpha: "opacity,visibility",
  scale: "scaleX,scaleY",
  alpha: "opacity"
},
    _renderCSSProp = function _renderCSSProp(ratio, data) {
  return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u, data);
},
    _renderPropWithEnd = function _renderPropWithEnd(ratio, data) {
  return data.set(data.t, data.p, ratio === 1 ? data.e : Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u, data);
},
    _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning(ratio, data) {
  return data.set(data.t, data.p, ratio ? Math.round((data.s + data.c * ratio) * 10000) / 10000 + data.u : data.b, data);
},
    //if units change, we need a way to render the original unit/value when the tween goes all the way back to the beginning (ratio:0)
_renderRoundedCSSProp = function _renderRoundedCSSProp(ratio, data) {
  var value = data.s + data.c * ratio;
  data.set(data.t, data.p, ~~(value + (value < 0 ? -.5 : .5)) + data.u, data);
},
    _renderNonTweeningValue = function _renderNonTweeningValue(ratio, data) {
  return data.set(data.t, data.p, ratio ? data.e : data.b, data);
},
    _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd(ratio, data) {
  return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
},
    _setterCSSStyle = function _setterCSSStyle(target, property, value) {
  return target.style[property] = value;
},
    _setterCSSProp = function _setterCSSProp(target, property, value) {
  return target.style.setProperty(property, value);
},
    _setterTransform = function _setterTransform(target, property, value) {
  return target._gsap[property] = value;
},
    _setterScale = function _setterScale(target, property, value) {
  return target._gsap.scaleX = target._gsap.scaleY = value;
},
    _setterScaleWithRender = function _setterScaleWithRender(target, property, value, data, ratio) {
  var cache = target._gsap;
  cache.scaleX = cache.scaleY = value;
  cache.renderTransform(ratio, cache);
},
    _setterTransformWithRender = function _setterTransformWithRender(target, property, value, data, ratio) {
  var cache = target._gsap;
  cache[property] = value;
  cache.renderTransform(ratio, cache);
},
    _transformProp = "transform",
    _transformOriginProp = _transformProp + "Origin",
    _supports3D,
    _createElement = function _createElement(type, ns) {
  var e = _doc.createElementNS ? _doc.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc.createElement(type); //some servers swap in https for http in the namespace which can break things, making "style" inaccessible.

  return e.style ? e : _doc.createElement(type); //some environments won't allow access to the element's style when created with a namespace in which case we default to the standard createElement() to work around the issue. Also note that when GSAP is embedded directly inside an SVG file, createElement() won't allow access to the style object in Firefox (see https://greensock.com/forums/topic/20215-problem-using-tweenmax-in-standalone-self-containing-svg-file-err-cannot-set-property-csstext-of-undefined/).
},
    _getComputedProperty = function _getComputedProperty(target, property, skipPrefixFallback) {
  var cs = getComputedStyle(target);
  return cs[property] || cs.getPropertyValue(property.replace(_capsExp, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty(target, _checkPropPrefix(property) || property, 1) || ""; //css variables may not need caps swapped out for dashes and lowercase.
},
    _prefixes = "O,Moz,ms,Ms,Webkit".split(","),
    _checkPropPrefix = function _checkPropPrefix(property, element, preferPrefix) {
  var e = element || _tempDiv,
      s = e.style,
      i = 5;

  if (property in s && !preferPrefix) {
    return property;
  }

  property = property.charAt(0).toUpperCase() + property.substr(1);

  while (i-- && !(_prefixes[i] + property in s)) {}

  return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? _prefixes[i] : "") + property;
},
    _initCore = function _initCore() {
  if (_windowExists()) {
    _win = window;
    _doc = _win.document;
    _docElement = _doc.documentElement;
    _tempDiv = _createElement("div") || {
      style: {}
    };
    _tempDivStyler = _createElement("div");
    _transformProp = _checkPropPrefix(_transformProp);
    _transformOriginProp = _checkPropPrefix(_transformOriginProp);
    _tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0"; //make sure to override certain properties that may contaminate measurements, in case the user has overreaching style sheets.

    _supports3D = !!_checkPropPrefix("perspective");
    _pluginInitted = 1;
  }
},
    _getBBoxHack = function _getBBoxHack(swapIfPossible) {
  //works around issues in some browsers (like Firefox) that don't correctly report getBBox() on SVG elements inside a <defs> element and/or <mask>. We try creating an SVG, adding it to the documentElement and toss the element in there so that it's definitely part of the rendering tree, then grab the bbox and if it works, we actually swap out the original getBBox() method for our own that does these extra steps whenever getBBox is needed. This helps ensure that performance is optimal (only do all these extra steps when absolutely necessary...most elements don't need it).
  var svg = _createElement("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"),
      oldParent = this.parentNode,
      oldSibling = this.nextSibling,
      oldCSS = this.style.cssText,
      bbox;

  _docElement.appendChild(svg);

  svg.appendChild(this);
  this.style.display = "block";

  if (swapIfPossible) {
    try {
      bbox = this.getBBox();
      this._gsapBBox = this.getBBox; //store the original

      this.getBBox = _getBBoxHack;
    } catch (e) {}
  } else if (this._gsapBBox) {
    bbox = this._gsapBBox();
  }

  if (oldParent) {
    if (oldSibling) {
      oldParent.insertBefore(this, oldSibling);
    } else {
      oldParent.appendChild(this);
    }
  }

  _docElement.removeChild(svg);

  this.style.cssText = oldCSS;
  return bbox;
},
    _getAttributeFallbacks = function _getAttributeFallbacks(target, attributesArray) {
  var i = attributesArray.length;

  while (i--) {
    if (target.hasAttribute(attributesArray[i])) {
      return target.getAttribute(attributesArray[i]);
    }
  }
},
    _getBBox = function _getBBox(target) {
  var bounds;

  try {
    bounds = target.getBBox(); //Firefox throws errors if you try calling getBBox() on an SVG element that's not rendered (like in a <symbol> or <defs>). https://bugzilla.mozilla.org/show_bug.cgi?id=612118
  } catch (error) {
    bounds = _getBBoxHack.call(target, true);
  }

  bounds && (bounds.width || bounds.height) || target.getBBox === _getBBoxHack || (bounds = _getBBoxHack.call(target, true)); //some browsers (like Firefox) misreport the bounds if the element has zero width and height (it just assumes it's at x:0, y:0), thus we need to manually grab the position in that case.

  return bounds && !bounds.width && !bounds.x && !bounds.y ? {
    x: +_getAttributeFallbacks(target, ["x", "cx", "x1"]) || 0,
    y: +_getAttributeFallbacks(target, ["y", "cy", "y1"]) || 0,
    width: 0,
    height: 0
  } : bounds;
},
    _isSVG = function _isSVG(e) {
  return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
},
    //reports if the element is an SVG on which getBBox() actually works
_removeProperty = function _removeProperty(target, property) {
  if (property) {
    var style = target.style;

    if (property in _transformProps) {
      property = _transformProp;
    }

    if (style.removeProperty) {
      if (property.substr(0, 2) === "ms" || property.substr(0, 6) === "webkit") {
        //Microsoft and some Webkit browsers don't conform to the standard of capitalizing the first prefix character, so we adjust so that when we prefix the caps with a dash, it's correct (otherwise it'd be "ms-transform" instead of "-ms-transform" for IE9, for example)
        property = "-" + property;
      }

      style.removeProperty(property.replace(_capsExp, "-$1").toLowerCase());
    } else {
      //note: old versions of IE use "removeAttribute()" instead of "removeProperty()"
      style.removeAttribute(property);
    }
  }
},
    _addNonTweeningPT = function _addNonTweeningPT(plugin, target, property, beginning, end, onlySetAtEnd) {
  var pt = new _gsapCore.PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
  plugin._pt = pt;
  pt.b = beginning;
  pt.e = end;

  plugin._props.push(property);

  return pt;
},
    _nonConvertibleUnits = {
  deg: 1,
  rad: 1,
  turn: 1
},
    //takes a single value like 20px and converts it to the unit specified, like "%", returning only the numeric amount.
_convertToUnit = function _convertToUnit(target, property, value, unit) {
  var curValue = parseFloat(value) || 0,
      curUnit = (value + "").trim().substr((curValue + "").length) || "px",
      // some browsers leave extra whitespace at the beginning of CSS variables, hence the need to trim()
  style = _tempDiv.style,
      horizontal = _horizontalExp.test(property),
      isRootSVG = target.tagName.toLowerCase() === "svg",
      measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"),
      amount = 100,
      toPixels = unit === "px",
      px,
      parent,
      cache,
      isSVG;

  if (unit === curUnit || !curValue || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) {
    return curValue;
  }

  isSVG = target.getCTM && _isSVG(target);

  if (unit === "%" && (_transformProps[property] || ~property.indexOf("adius"))) {
    //transforms and borderRadius are relative to the size of the element itself!
    return (0, _gsapCore._round)(curValue / (isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty]) * amount);
  }

  style[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
  parent = ~property.indexOf("adius") || unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;

  if (isSVG) {
    parent = (target.ownerSVGElement || {}).parentNode;
  }

  if (!parent || parent === _doc || !parent.appendChild) {
    parent = _doc.body;
  }

  cache = parent._gsap;

  if (cache && unit === "%" && cache.width && horizontal && cache.time === _gsapCore._ticker.time) {
    return (0, _gsapCore._round)(curValue / cache.width * amount);
  } else {
    parent === target && (style.position = "static"); // like for borderRadius, if it's a % we must have it relative to the target itself but that may not have position: relative or position: absolute in which case it'd go up the chain until it finds its offsetParent (bad). position: static protects against that.

    parent.appendChild(_tempDiv);
    px = _tempDiv[measureProperty];
    parent.removeChild(_tempDiv);
    style.position = "absolute";

    if (horizontal && unit === "%") {
      cache = (0, _gsapCore._getCache)(parent);
      cache.time = _gsapCore._ticker.time;
      cache.width = parent[measureProperty];
    }
  }

  return (0, _gsapCore._round)(toPixels ? px * curValue / amount : amount / px * curValue);
},
    _get = function _get(target, property, unit, uncache) {
  var value;

  if (!_pluginInitted) {
    _initCore();
  }

  if (property in _propertyAliases && property !== "transform") {
    property = _propertyAliases[property];

    if (~property.indexOf(",")) {
      property = property.split(",")[0];
    }
  }

  if (_transformProps[property] && property !== "transform") {
    value = _parseTransform(target, uncache);
    value = property !== "transformOrigin" ? value[property] : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) + " " + value.zOrigin + "px";
  } else {
    value = target.style[property];

    if (!value || value === "auto" || uncache || ~(value + "").indexOf("calc(")) {
      value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || (0, _gsapCore._getProperty)(target, property) || (property === "opacity" ? 1 : 0); // note: some browsers, like Firefox, don't report borderRadius correctly! Instead, it only reports every corner like  borderTopLeftRadius
    }
  }

  return unit && !~(value + "").indexOf(" ") ? _convertToUnit(target, property, value, unit) + unit : value;
},
    _tweenComplexCSSString = function _tweenComplexCSSString(target, prop, start, end) {
  //note: we call _tweenComplexCSSString.call(pluginInstance...) to ensure that it's scoped properly. We may call it from within a plugin too, thus "this" would refer to the plugin.
  if (!start || start === "none") {
    // some browsers like Safari actually PREFER the prefixed property and mis-report the unprefixed value like clipPath (BUG). In other words, even though clipPath exists in the style ("clipPath" in target.style) and it's set in the CSS properly (along with -webkit-clip-path), Safari reports clipPath as "none" whereas WebkitClipPath reports accurately like "ellipse(100% 0% at 50% 0%)", so in this case we must SWITCH to using the prefixed property instead. See https://greensock.com/forums/topic/18310-clippath-doesnt-work-on-ios/
    var p = _checkPropPrefix(prop, target, 1),
        s = p && _getComputedProperty(target, p, 1);

    if (s && s !== start) {
      prop = p;
      start = s;
    }
  }

  var pt = new _gsapCore.PropTween(this._pt, target.style, prop, 0, 1, _gsapCore._renderComplexString),
      index = 0,
      matchIndex = 0,
      a,
      result,
      startValues,
      startNum,
      color,
      startValue,
      endValue,
      endNum,
      chunk,
      endUnit,
      startUnit,
      relative,
      endValues;
  pt.b = start;
  pt.e = end;
  start += ""; //ensure values are strings

  end += "";

  if (end === "auto") {
    target.style[prop] = end;
    end = _getComputedProperty(target, prop) || end;
    target.style[prop] = start;
  }

  a = [start, end];
  (0, _gsapCore._colorStringFilter)(a); //pass an array with the starting and ending values and let the filter do whatever it needs to the values. If colors are found, it returns true and then we must match where the color shows up order-wise because for things like boxShadow, sometimes the browser provides the computed values with the color FIRST, but the user provides it with the color LAST, so flip them if necessary. Same for drop-shadow().

  start = a[0];
  end = a[1];
  startValues = start.match(_gsapCore._numWithUnitExp) || [];
  endValues = end.match(_gsapCore._numWithUnitExp) || [];

  if (endValues.length) {
    while (result = _gsapCore._numWithUnitExp.exec(end)) {
      endValue = result[0];
      chunk = end.substring(index, result.index);

      if (color) {
        color = (color + 1) % 5;
      } else if (chunk.substr(-5) === "rgba(" || chunk.substr(-5) === "hsla(") {
        color = 1;
      }

      if (endValue !== (startValue = startValues[matchIndex++] || "")) {
        startNum = parseFloat(startValue) || 0;
        startUnit = startValue.substr((startNum + "").length);
        relative = endValue.charAt(1) === "=" ? +(endValue.charAt(0) + "1") : 0;

        if (relative) {
          endValue = endValue.substr(2);
        }

        endNum = parseFloat(endValue);
        endUnit = endValue.substr((endNum + "").length);
        index = _gsapCore._numWithUnitExp.lastIndex - endUnit.length;

        if (!endUnit) {
          //if something like "perspective:300" is passed in and we must add a unit to the end
          endUnit = endUnit || _gsapCore._config.units[prop] || startUnit;

          if (index === end.length) {
            end += endUnit;
            pt.e += endUnit;
          }
        }

        if (startUnit !== endUnit) {
          startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
        } //these nested PropTweens are handled in a special way - we'll never actually call a render or setter method on them. We'll just loop through them in the parent complex string PropTween's render method.


        pt._pt = {
          _next: pt._pt,
          p: chunk || matchIndex === 1 ? chunk : ",",
          //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
          s: startNum,
          c: relative ? relative * endNum : endNum - startNum,
          m: color && color < 4 ? Math.round : 0
        };
      }
    }

    pt.c = index < end.length ? end.substring(index, end.length) : ""; //we use the "c" of the PropTween to store the final part of the string (after the last number)
  } else {
    pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
  }

  if (_gsapCore._relExp.test(end)) {
    pt.e = 0; //if the end string contains relative values or dynamic random(...) values, delete the end it so that on the final render we don't actually set it to the string with += or -= characters (forces it to use the calculated value).
  }

  this._pt = pt; //start the linked list with this new PropTween. Remember, we call _tweenComplexCSSString.call(pluginInstance...) to ensure that it's scoped properly. We may call it from within another plugin too, thus "this" would refer to the plugin.

  return pt;
},
    _keywordToPercent = {
  top: "0%",
  bottom: "100%",
  left: "0%",
  right: "100%",
  center: "50%"
},
    _convertKeywordsToPercentages = function _convertKeywordsToPercentages(value) {
  var split = value.split(" "),
      x = split[0],
      y = split[1] || "50%";

  if (x === "top" || x === "bottom" || y === "left" || y === "right") {
    //the user provided them in the wrong order, so flip them
    value = x;
    x = y;
    y = value;
  }

  split[0] = _keywordToPercent[x] || x;
  split[1] = _keywordToPercent[y] || y;
  return split.join(" ");
},
    _renderClearProps = function _renderClearProps(ratio, data) {
  if (data.tween && data.tween._time === data.tween._dur) {
    var target = data.t,
        style = target.style,
        props = data.u,
        cache = target._gsap,
        prop,
        clearTransforms,
        i;

    if (props === "all" || props === true) {
      style.cssText = "";
      clearTransforms = 1;
    } else {
      props = props.split(",");
      i = props.length;

      while (--i > -1) {
        prop = props[i];

        if (_transformProps[prop]) {
          clearTransforms = 1;
          prop = prop === "transformOrigin" ? _transformOriginProp : _transformProp;
        }

        _removeProperty(target, prop);
      }
    }

    if (clearTransforms) {
      _removeProperty(target, _transformProp);

      if (cache) {
        cache.svg && target.removeAttribute("transform");

        _parseTransform(target, 1); // force all the cached values back to "normal"/identity, otherwise if there's another tween that's already set to render transforms on this element, it could display the wrong values.


        cache.uncache = 1;
      }
    }
  }
},
    // note: specialProps should return 1 if (and only if) they have a non-zero priority. It indicates we need to sort the linked list.
_specialProps = {
  clearProps: function clearProps(plugin, target, property, endValue, tween) {
    if (tween.data !== "isFromStart") {
      var pt = plugin._pt = new _gsapCore.PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
      pt.u = endValue;
      pt.pr = -10;
      pt.tween = tween;

      plugin._props.push(property);

      return 1;
    }
  }
  /* className feature (about 0.4kb gzipped).
  , className(plugin, target, property, endValue, tween) {
  	let _renderClassName = (ratio, data) => {
  			data.css.render(ratio, data.css);
  			if (!ratio || ratio === 1) {
  				let inline = data.rmv,
  					target = data.t,
  					p;
  				target.setAttribute("class", ratio ? data.e : data.b);
  				for (p in inline) {
  					_removeProperty(target, p);
  				}
  			}
  		},
  		_getAllStyles = (target) => {
  			let styles = {},
  				computed = getComputedStyle(target),
  				p;
  			for (p in computed) {
  				if (isNaN(p) && p !== "cssText" && p !== "length") {
  					styles[p] = computed[p];
  				}
  			}
  			_setDefaults(styles, _parseTransform(target, 1));
  			return styles;
  		},
  		startClassList = target.getAttribute("class"),
  		style = target.style,
  		cssText = style.cssText,
  		cache = target._gsap,
  		classPT = cache.classPT,
  		inlineToRemoveAtEnd = {},
  		data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
  		changingVars = {},
  		startVars = _getAllStyles(target),
  		transformRelated = /(transform|perspective)/i,
  		endVars, p;
  	if (classPT) {
  		classPT.r(1, classPT.d);
  		_removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
  	}
  	target.setAttribute("class", data.e);
  	endVars = _getAllStyles(target, true);
  	target.setAttribute("class", startClassList);
  	for (p in endVars) {
  		if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
  			changingVars[p] = endVars[p];
  			if (!style[p] && style[p] !== "0") {
  				inlineToRemoveAtEnd[p] = 1;
  			}
  		}
  	}
  	cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
  	if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://greensock.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
  		style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
  	}
  	_parseTransform(target, true); //to clear the caching of transforms
  	data.css = new gsap.plugins.css();
  	data.css.init(target, changingVars, tween);
  	plugin._props.push(...data.css._props);
  	return 1;
  }
  */

},

/*
 * --------------------------------------------------------------------------------------
 * TRANSFORMS
 * --------------------------------------------------------------------------------------
 */
_identity2DMatrix = [1, 0, 0, 1, 0, 0],
    _rotationalProperties = {},
    _isNullTransform = function _isNullTransform(value) {
  return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
},
    _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray(target) {
  var matrixString = _getComputedProperty(target, _transformProp);

  return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_gsapCore._numExp).map(_gsapCore._round);
},
    _getMatrix = function _getMatrix(target, force2D) {
  var cache = target._gsap || (0, _gsapCore._getCache)(target),
      style = target.style,
      matrix = _getComputedTransformMatrixAsArray(target),
      parent,
      nextSibling,
      temp,
      addedToDOM;

  if (cache.svg && target.getAttribute("transform")) {
    temp = target.transform.baseVal.consolidate().matrix; //ensures that even complex values like "translate(50,60) rotate(135,0,0)" are parsed because it mashes it into a matrix.

    matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
    return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
  } else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache.svg) {
    //note: if offsetParent is null, that means the element isn't in the normal document flow, like if it has display:none or one of its ancestors has display:none). Firefox returns null for getComputedStyle() if the element is in an iframe that has display:none. https://bugzilla.mozilla.org/show_bug.cgi?id=548397
    //browsers don't report transforms accurately unless the element is in the DOM and has a display value that's not "none". Firefox and Microsoft browsers have a partial bug where they'll report transforms even if display:none BUT not any percentage-based values like translate(-50%, 8px) will be reported as if it's translate(0, 8px).
    temp = style.display;
    style.display = "block";
    parent = target.parentNode;

    if (!parent || !target.offsetParent) {
      addedToDOM = 1; //flag

      nextSibling = target.nextSibling;

      _docElement.appendChild(target); //we must add it to the DOM in order to get values properly

    }

    matrix = _getComputedTransformMatrixAsArray(target);

    if (temp) {
      style.display = temp;
    } else {
      _removeProperty(target, "display");
    }

    if (addedToDOM) {
      if (nextSibling) {
        parent.insertBefore(target, nextSibling);
      } else if (parent) {
        parent.appendChild(target);
      } else {
        _docElement.removeChild(target);
      }
    }
  }

  return force2D && matrix.length > 6 ? [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]] : matrix;
},
    _applySVGOrigin = function _applySVGOrigin(target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
  var cache = target._gsap,
      matrix = matrixArray || _getMatrix(target, true),
      xOriginOld = cache.xOrigin || 0,
      yOriginOld = cache.yOrigin || 0,
      xOffsetOld = cache.xOffset || 0,
      yOffsetOld = cache.yOffset || 0,
      a = matrix[0],
      b = matrix[1],
      c = matrix[2],
      d = matrix[3],
      tx = matrix[4],
      ty = matrix[5],
      originSplit = origin.split(" "),
      xOrigin = parseFloat(originSplit[0]) || 0,
      yOrigin = parseFloat(originSplit[1]) || 0,
      bounds,
      determinant,
      x,
      y;

  if (!originIsAbsolute) {
    bounds = _getBBox(target);
    xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
    yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin);
  } else if (matrix !== _identity2DMatrix && (determinant = a * d - b * c)) {
    //if it's zero (like if scaleX and scaleY are zero), skip it to avoid errors with dividing by zero.
    x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
    y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant;
    xOrigin = x;
    yOrigin = y;
  }

  if (smooth || smooth !== false && cache.smooth) {
    tx = xOrigin - xOriginOld;
    ty = yOrigin - yOriginOld;
    cache.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
    cache.yOffset = yOffsetOld + (tx * b + ty * d) - ty;
  } else {
    cache.xOffset = cache.yOffset = 0;
  }

  cache.xOrigin = xOrigin;
  cache.yOrigin = yOrigin;
  cache.smooth = !!smooth;
  cache.origin = origin;
  cache.originIsAbsolute = !!originIsAbsolute;
  target.style[_transformOriginProp] = "0px 0px"; //otherwise, if someone sets  an origin via CSS, it will likely interfere with the SVG transform attribute ones (because remember, we're baking the origin into the matrix() value).

  if (pluginToAddPropTweensTo) {
    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOrigin", xOriginOld, xOrigin);

    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOrigin", yOriginOld, yOrigin);

    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "xOffset", xOffsetOld, cache.xOffset);

    _addNonTweeningPT(pluginToAddPropTweensTo, cache, "yOffset", yOffsetOld, cache.yOffset);
  }

  target.setAttribute("data-svg-origin", xOrigin + " " + yOrigin);
},
    _parseTransform = function _parseTransform(target, uncache) {
  var cache = target._gsap || new _gsapCore.GSCache(target);

  if ("x" in cache && !uncache && !cache.uncache) {
    return cache;
  }

  var style = target.style,
      invertedScaleX = cache.scaleX < 0,
      px = "px",
      deg = "deg",
      origin = _getComputedProperty(target, _transformOriginProp) || "0",
      x,
      y,
      z,
      scaleX,
      scaleY,
      rotation,
      rotationX,
      rotationY,
      skewX,
      skewY,
      perspective,
      xOrigin,
      yOrigin,
      matrix,
      angle,
      cos,
      sin,
      a,
      b,
      c,
      d,
      a12,
      a22,
      t1,
      t2,
      t3,
      a13,
      a23,
      a33,
      a42,
      a43,
      a32;
  x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0;
  scaleX = scaleY = 1;
  cache.svg = !!(target.getCTM && _isSVG(target));
  matrix = _getMatrix(target, cache.svg);

  if (cache.svg) {
    t1 = !cache.uncache && target.getAttribute("data-svg-origin");

    _applySVGOrigin(target, t1 || origin, !!t1 || cache.originIsAbsolute, cache.smooth !== false, matrix);
  }

  xOrigin = cache.xOrigin || 0;
  yOrigin = cache.yOrigin || 0;

  if (matrix !== _identity2DMatrix) {
    a = matrix[0]; //a11

    b = matrix[1]; //a21

    c = matrix[2]; //a31

    d = matrix[3]; //a41

    x = a12 = matrix[4];
    y = a22 = matrix[5]; //2D matrix

    if (matrix.length === 6) {
      scaleX = Math.sqrt(a * a + b * b);
      scaleY = Math.sqrt(d * d + c * c);
      rotation = a || b ? _atan2(b, a) * _RAD2DEG : 0; //note: if scaleX is 0, we cannot accurately measure rotation. Same for skewX with a scaleY of 0. Therefore, we default to the previously recorded value (or zero if that doesn't exist).

      skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : 0;
      skewX && (scaleY *= Math.cos(skewX * _DEG2RAD));

      if (cache.svg) {
        x -= xOrigin - (xOrigin * a + yOrigin * c);
        y -= yOrigin - (xOrigin * b + yOrigin * d);
      } //3D matrix

    } else {
      a32 = matrix[6];
      a42 = matrix[7];
      a13 = matrix[8];
      a23 = matrix[9];
      a33 = matrix[10];
      a43 = matrix[11];
      x = matrix[12];
      y = matrix[13];
      z = matrix[14];
      angle = _atan2(a32, a33);
      rotationX = angle * _RAD2DEG; //rotationX

      if (angle) {
        cos = Math.cos(-angle);
        sin = Math.sin(-angle);
        t1 = a12 * cos + a13 * sin;
        t2 = a22 * cos + a23 * sin;
        t3 = a32 * cos + a33 * sin;
        a13 = a12 * -sin + a13 * cos;
        a23 = a22 * -sin + a23 * cos;
        a33 = a32 * -sin + a33 * cos;
        a43 = a42 * -sin + a43 * cos;
        a12 = t1;
        a22 = t2;
        a32 = t3;
      } //rotationY


      angle = _atan2(-c, a33);
      rotationY = angle * _RAD2DEG;

      if (angle) {
        cos = Math.cos(-angle);
        sin = Math.sin(-angle);
        t1 = a * cos - a13 * sin;
        t2 = b * cos - a23 * sin;
        t3 = c * cos - a33 * sin;
        a43 = d * sin + a43 * cos;
        a = t1;
        b = t2;
        c = t3;
      } //rotationZ


      angle = _atan2(b, a);
      rotation = angle * _RAD2DEG;

      if (angle) {
        cos = Math.cos(angle);
        sin = Math.sin(angle);
        t1 = a * cos + b * sin;
        t2 = a12 * cos + a22 * sin;
        b = b * cos - a * sin;
        a22 = a22 * cos - a12 * sin;
        a = t1;
        a12 = t2;
      }

      if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
        //when rotationY is set, it will often be parsed as 180 degrees different than it should be, and rotationX and rotation both being 180 (it looks the same), so we adjust for that here.
        rotationX = rotation = 0;
        rotationY = 180 - rotationY;
      }

      scaleX = (0, _gsapCore._round)(Math.sqrt(a * a + b * b + c * c));
      scaleY = (0, _gsapCore._round)(Math.sqrt(a22 * a22 + a32 * a32));
      angle = _atan2(a12, a22);
      skewX = Math.abs(angle) > 0.0002 ? angle * _RAD2DEG : 0;
      perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
    }

    if (cache.svg) {
      //sense if there are CSS transforms applied on an SVG element in which case we must overwrite them when rendering. The transform attribute is more reliable cross-browser, but we can't just remove the CSS ones because they may be applied in a CSS rule somewhere (not just inline).
      matrix = target.getAttribute("transform");
      cache.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp));
      matrix && target.setAttribute("transform", matrix);
    }
  }

  if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
    if (invertedScaleX) {
      scaleX *= -1;
      skewX += rotation <= 0 ? 180 : -180;
      rotation += rotation <= 0 ? 180 : -180;
    } else {
      scaleY *= -1;
      skewX += skewX <= 0 ? 180 : -180;
    }
  }

  cache.x = ((cache.xPercent = x && Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0) ? 0 : x) + px;
  cache.y = ((cache.yPercent = y && Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0) ? 0 : y) + px;
  cache.z = z + px;
  cache.scaleX = (0, _gsapCore._round)(scaleX);
  cache.scaleY = (0, _gsapCore._round)(scaleY);
  cache.rotation = (0, _gsapCore._round)(rotation) + deg;
  cache.rotationX = (0, _gsapCore._round)(rotationX) + deg;
  cache.rotationY = (0, _gsapCore._round)(rotationY) + deg;
  cache.skewX = skewX + deg;
  cache.skewY = skewY + deg;
  cache.transformPerspective = perspective + px;

  if (cache.zOrigin = parseFloat(origin.split(" ")[2]) || 0) {
    style[_transformOriginProp] = _firstTwoOnly(origin);
  }

  cache.xOffset = cache.yOffset = 0;
  cache.force3D = _gsapCore._config.force3D;
  cache.renderTransform = cache.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
  cache.uncache = 0;
  return cache;
},
    _firstTwoOnly = function _firstTwoOnly(value) {
  return (value = value.split(" "))[0] + " " + value[1];
},
    //for handling transformOrigin values, stripping out the 3rd dimension
_addPxTranslate = function _addPxTranslate(target, start, value) {
  var unit = (0, _gsapCore.getUnit)(start);
  return (0, _gsapCore._round)(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit;
},
    _renderNon3DTransforms = function _renderNon3DTransforms(ratio, cache) {
  cache.z = "0px";
  cache.rotationY = cache.rotationX = "0deg";
  cache.force3D = 0;

  _renderCSSTransforms(ratio, cache);
},
    _zeroDeg = "0deg",
    _zeroPx = "0px",
    _endParenthesis = ") ",
    _renderCSSTransforms = function _renderCSSTransforms(ratio, cache) {
  var _ref = cache || this,
      xPercent = _ref.xPercent,
      yPercent = _ref.yPercent,
      x = _ref.x,
      y = _ref.y,
      z = _ref.z,
      rotation = _ref.rotation,
      rotationY = _ref.rotationY,
      rotationX = _ref.rotationX,
      skewX = _ref.skewX,
      skewY = _ref.skewY,
      scaleX = _ref.scaleX,
      scaleY = _ref.scaleY,
      transformPerspective = _ref.transformPerspective,
      force3D = _ref.force3D,
      target = _ref.target,
      zOrigin = _ref.zOrigin,
      transforms = "",
      use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true; // Safari has a bug that causes it not to render 3D transform-origin values properly, so we force the z origin to 0, record it in the cache, and then do the math here to offset the translate values accordingly (basically do the 3D transform-origin part manually)


  if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
    var angle = parseFloat(rotationY) * _DEG2RAD,
        a13 = Math.sin(angle),
        a33 = Math.cos(angle),
        cos;

    angle = parseFloat(rotationX) * _DEG2RAD;
    cos = Math.cos(angle);
    x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
    y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin);
    z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
  }

  if (transformPerspective !== _zeroPx) {
    transforms += "perspective(" + transformPerspective + _endParenthesis;
  }

  if (xPercent || yPercent) {
    transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
  }

  if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) {
    transforms += z !== _zeroPx || use3D ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + _endParenthesis;
  }

  if (rotation !== _zeroDeg) {
    transforms += "rotate(" + rotation + _endParenthesis;
  }

  if (rotationY !== _zeroDeg) {
    transforms += "rotateY(" + rotationY + _endParenthesis;
  }

  if (rotationX !== _zeroDeg) {
    transforms += "rotateX(" + rotationX + _endParenthesis;
  }

  if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
    transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
  }

  if (scaleX !== 1 || scaleY !== 1) {
    transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
  }

  target.style[_transformProp] = transforms || "translate(0, 0)";
},
    _renderSVGTransforms = function _renderSVGTransforms(ratio, cache) {
  var _ref2 = cache || this,
      xPercent = _ref2.xPercent,
      yPercent = _ref2.yPercent,
      x = _ref2.x,
      y = _ref2.y,
      rotation = _ref2.rotation,
      skewX = _ref2.skewX,
      skewY = _ref2.skewY,
      scaleX = _ref2.scaleX,
      scaleY = _ref2.scaleY,
      target = _ref2.target,
      xOrigin = _ref2.xOrigin,
      yOrigin = _ref2.yOrigin,
      xOffset = _ref2.xOffset,
      yOffset = _ref2.yOffset,
      forceCSS = _ref2.forceCSS,
      tx = parseFloat(x),
      ty = parseFloat(y),
      a11,
      a21,
      a12,
      a22,
      temp;

  rotation = parseFloat(rotation);
  skewX = parseFloat(skewX);
  skewY = parseFloat(skewY);

  if (skewY) {
    //for performance reasons, we combine all skewing into the skewX and rotation values. Remember, a skewY of 10 degrees looks the same as a rotation of 10 degrees plus a skewX of 10 degrees.
    skewY = parseFloat(skewY);
    skewX += skewY;
    rotation += skewY;
  }

  if (rotation || skewX) {
    rotation *= _DEG2RAD;
    skewX *= _DEG2RAD;
    a11 = Math.cos(rotation) * scaleX;
    a21 = Math.sin(rotation) * scaleX;
    a12 = Math.sin(rotation - skewX) * -scaleY;
    a22 = Math.cos(rotation - skewX) * scaleY;

    if (skewX) {
      skewY *= _DEG2RAD;
      temp = Math.tan(skewX - skewY);
      temp = Math.sqrt(1 + temp * temp);
      a12 *= temp;
      a22 *= temp;

      if (skewY) {
        temp = Math.tan(skewY);
        temp = Math.sqrt(1 + temp * temp);
        a11 *= temp;
        a21 *= temp;
      }
    }

    a11 = (0, _gsapCore._round)(a11);
    a21 = (0, _gsapCore._round)(a21);
    a12 = (0, _gsapCore._round)(a12);
    a22 = (0, _gsapCore._round)(a22);
  } else {
    a11 = scaleX;
    a22 = scaleY;
    a21 = a12 = 0;
  }

  if (tx && !~(x + "").indexOf("px") || ty && !~(y + "").indexOf("px")) {
    tx = _convertToUnit(target, "x", x, "px");
    ty = _convertToUnit(target, "y", y, "px");
  }

  if (xOrigin || yOrigin || xOffset || yOffset) {
    tx = (0, _gsapCore._round)(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
    ty = (0, _gsapCore._round)(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
  }

  if (xPercent || yPercent) {
    //The SVG spec doesn't support percentage-based translation in the "transform" attribute, so we merge it into the translation to simulate it.
    temp = target.getBBox();
    tx = (0, _gsapCore._round)(tx + xPercent / 100 * temp.width);
    ty = (0, _gsapCore._round)(ty + yPercent / 100 * temp.height);
  }

  temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
  target.setAttribute("transform", temp);

  if (forceCSS) {
    //some browsers prioritize CSS transforms over the transform attribute. When we sense that the user has CSS transforms applied, we must overwrite them this way (otherwise some browser simply won't render the  transform attribute changes!)
    target.style[_transformProp] = temp;
  }
},
    _addRotationalPropTween = function _addRotationalPropTween(plugin, target, property, startNum, endValue, relative) {
  var cap = 360,
      isString = (0, _gsapCore._isString)(endValue),
      endNum = parseFloat(endValue) * (isString && ~endValue.indexOf("rad") ? _RAD2DEG : 1),
      change = relative ? endNum * relative : endNum - startNum,
      finalValue = startNum + change + "deg",
      direction,
      pt;

  if (isString) {
    direction = endValue.split("_")[1];

    if (direction === "short") {
      change %= cap;

      if (change !== change % (cap / 2)) {
        change += change < 0 ? cap : -cap;
      }
    }

    if (direction === "cw" && change < 0) {
      change = (change + cap * _bigNum) % cap - ~~(change / cap) * cap;
    } else if (direction === "ccw" && change > 0) {
      change = (change - cap * _bigNum) % cap - ~~(change / cap) * cap;
    }
  }

  plugin._pt = pt = new _gsapCore.PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
  pt.e = finalValue;
  pt.u = "deg";

  plugin._props.push(property);

  return pt;
},
    _addRawTransformPTs = function _addRawTransformPTs(plugin, transforms, target) {
  //for handling cases where someone passes in a whole transform string, like transform: "scale(2, 3) rotate(20deg) translateY(30em)"
  var style = _tempDivStyler.style,
      startCache = target._gsap,
      exclude = "perspective,force3D,transformOrigin,svgOrigin",
      endCache,
      p,
      startValue,
      endValue,
      startNum,
      endNum,
      startUnit,
      endUnit;
  style.cssText = getComputedStyle(target).cssText + ";position:absolute;display:block;"; //%-based translations will fail unless we set the width/height to match the original target (and padding/borders can affect it)

  style[_transformProp] = transforms;

  _doc.body.appendChild(_tempDivStyler);

  endCache = _parseTransform(_tempDivStyler, 1);

  for (p in _transformProps) {
    startValue = startCache[p];
    endValue = endCache[p];

    if (startValue !== endValue && exclude.indexOf(p) < 0) {
      //tweening to no perspective gives very unintuitive results - just keep the same perspective in that case.
      startUnit = (0, _gsapCore.getUnit)(startValue);
      endUnit = (0, _gsapCore.getUnit)(endValue);
      startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
      endNum = parseFloat(endValue);
      plugin._pt = new _gsapCore.PropTween(plugin._pt, startCache, p, startNum, endNum - startNum, _renderCSSProp);
      plugin._pt.u = endUnit || 0;

      plugin._props.push(p);
    }
  }

  _doc.body.removeChild(_tempDivStyler);
}; // handle splitting apart padding, margin, borderWidth, and borderRadius into their 4 components. Firefox, for example, won't report borderRadius correctly - it will only do borderTopLeftRadius and the other corners. We also want to handle paddingTop, marginLeft, borderRightWidth, etc.


exports._getBBox = _getBBox;
exports.checkPrefix = _checkPropPrefix;
exports._createElement = _createElement;
(0, _gsapCore._forEachName)("padding,margin,Width,Radius", function (name, index) {
  var t = "Top",
      r = "Right",
      b = "Bottom",
      l = "Left",
      props = (index < 3 ? [t, r, b, l] : [t + l, t + r, b + r, b + l]).map(function (side) {
    return index < 2 ? name + side : "border" + side + name;
  });

  _specialProps[index > 1 ? "border" + name : name] = function (plugin, target, property, endValue, tween) {
    var a, vars;

    if (arguments.length < 4) {
      // getter, passed target, property, and unit (from _get())
      a = props.map(function (prop) {
        return _get(plugin, prop, property);
      });
      vars = a.join(" ");
      return vars.split(a[0]).length === 5 ? a[0] : vars;
    }

    a = (endValue + "").split(" ");
    vars = {};
    props.forEach(function (prop, i) {
      return vars[prop] = a[i] = a[i] || a[(i - 1) / 2 | 0];
    });
    plugin.init(target, vars, tween);
  };
});
var CSSPlugin = {
  name: "css",
  register: _initCore,
  targetTest: function targetTest(target) {
    return target.style && target.nodeType;
  },
  init: function init(target, vars, tween, index, targets) {
    var props = this._props,
        style = target.style,
        startValue,
        endValue,
        endNum,
        startNum,
        type,
        specialProp,
        p,
        startUnit,
        endUnit,
        relative,
        isTransformRelated,
        transformPropTween,
        cache,
        smooth,
        hasPriority;

    if (!_pluginInitted) {
      _initCore();
    }

    for (p in vars) {
      if (p === "autoRound") {
        continue;
      }

      endValue = vars[p];

      if (_gsapCore._plugins[p] && (0, _gsapCore._checkPlugin)(p, vars, tween, index, target, targets)) {
        //plugins
        continue;
      }

      type = typeof endValue;
      specialProp = _specialProps[p];

      if (type === "function") {
        endValue = endValue.call(tween, index, target, targets);
        type = typeof endValue;
      }

      if (type === "string" && ~endValue.indexOf("random(")) {
        endValue = (0, _gsapCore._replaceRandom)(endValue);
      }

      if (specialProp) {
        if (specialProp(this, target, p, endValue, tween)) {
          hasPriority = 1;
        }
      } else if (p.substr(0, 2) === "--") {
        //CSS variable
        this.add(style, "setProperty", getComputedStyle(target).getPropertyValue(p) + "", endValue + "", index, targets, 0, 0, p);
      } else {
        startValue = _get(target, p);
        startNum = parseFloat(startValue);
        relative = type === "string" && endValue.charAt(1) === "=" ? +(endValue.charAt(0) + "1") : 0;

        if (relative) {
          endValue = endValue.substr(2);
        }

        endNum = parseFloat(endValue);

        if (p in _propertyAliases) {
          if (p === "autoAlpha") {
            //special case where we control the visibility along with opacity. We still allow the opacity value to pass through and get tweened.
            if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) {
              //if visibility is initially set to "hidden", we should interpret that as intent to make opacity 0 (a convenience)
              startNum = 0;
            }

            _addNonTweeningPT(this, style, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
          }

          if (p !== "scale" && p !== "transform") {
            p = _propertyAliases[p];

            if (~p.indexOf(",")) {
              p = p.split(",")[0];
            }
          }
        }

        isTransformRelated = p in _transformProps; //--- TRANSFORM-RELATED ---

        if (isTransformRelated) {
          if (!transformPropTween) {
            cache = target._gsap;
            cache.renderTransform || _parseTransform(target); // if, for example, gsap.set(... {transform:"translateX(50vw)"}), the _get() call doesn't parse the transform, thus cache.renderTransform won't be set yet so force the parsing of the transform here.

            smooth = vars.smoothOrigin !== false && cache.smooth;
            transformPropTween = this._pt = new _gsapCore.PropTween(this._pt, style, _transformProp, 0, 1, cache.renderTransform, cache, 0, -1); //the first time through, create the rendering PropTween so that it runs LAST (in the linked list, we keep adding to the beginning)

            transformPropTween.dep = 1; //flag it as dependent so that if things get killed/overwritten and this is the only PropTween left, we can safely kill the whole tween.
          }

          if (p === "scale") {
            this._pt = new _gsapCore.PropTween(this._pt, cache, "scaleY", cache.scaleY, relative ? relative * endNum : endNum - cache.scaleY);
            props.push("scaleY", p);
            p += "X";
          } else if (p === "transformOrigin") {
            endValue = _convertKeywordsToPercentages(endValue); //in case something like "left top" or "bottom right" is passed in. Convert to percentages.

            if (cache.svg) {
              _applySVGOrigin(target, endValue, 0, smooth, 0, this);
            } else {
              endUnit = parseFloat(endValue.split(" ")[2]) || 0; //handle the zOrigin separately!

              if (endUnit !== cache.zOrigin) {
                _addNonTweeningPT(this, cache, "zOrigin", cache.zOrigin, endUnit);
              }

              _addNonTweeningPT(this, style, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue));
            }

            continue;
          } else if (p === "svgOrigin") {
            _applySVGOrigin(target, endValue, 1, smooth, 0, this);

            continue;
          } else if (p in _rotationalProperties) {
            _addRotationalPropTween(this, cache, p, startNum, endValue, relative);

            continue;
          } else if (p === "smoothOrigin") {
            _addNonTweeningPT(this, cache, "smooth", cache.smooth, endValue);

            continue;
          } else if (p === "force3D") {
            cache[p] = endValue;
            continue;
          } else if (p === "transform") {
            _addRawTransformPTs(this, endValue, target);

            continue;
          }
        } else if (!(p in style)) {
          p = _checkPropPrefix(p) || p;
        }

        if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style) {
          startUnit = (startValue + "").substr((startNum + "").length);
          endNum || (endNum = 0); // protect against NaN

          endUnit = (endValue + "").substr((endNum + "").length) || (p in _gsapCore._config.units ? _gsapCore._config.units[p] : startUnit);

          if (startUnit !== endUnit) {
            startNum = _convertToUnit(target, p, startValue, endUnit);
          }

          this._pt = new _gsapCore.PropTween(this._pt, isTransformRelated ? cache : style, p, startNum, relative ? relative * endNum : endNum - startNum, endUnit === "px" && vars.autoRound !== false && !isTransformRelated ? _renderRoundedCSSProp : _renderCSSProp);
          this._pt.u = endUnit || 0;

          if (startUnit !== endUnit) {
            //when the tween goes all the way back to the beginning, we need to revert it to the OLD/ORIGINAL value (with those units). We record that as a "b" (beginning) property and point to a render method that handles that. (performance optimization)
            this._pt.b = startValue;
            this._pt.r = _renderCSSPropWithBeginning;
          }
        } else if (!(p in style)) {
          if (p in target) {
            //maybe it's not a style - it could be a property added directly to an element in which case we'll try to animate that.
            this.add(target, p, target[p], endValue, index, targets);
          } else {
            (0, _gsapCore._missingPlugin)(p, endValue);
            continue;
          }
        } else {
          _tweenComplexCSSString.call(this, target, p, startValue, endValue);
        }

        props.push(p);
      }
    }

    if (hasPriority) {
      (0, _gsapCore._sortPropTweensByPriority)(this);
    }
  },
  get: _get,
  aliases: _propertyAliases,
  getSetter: function getSetter(target, property, plugin) {
    //returns a setter function that accepts target, property, value and applies it accordingly. Remember, properties like "x" aren't as simple as target.style.property = value because they've got to be applied to a proxy object and then merged into a transform string in a renderer.
    var p = _propertyAliases[property];
    p && p.indexOf(",") < 0 && (property = p);
    return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !(0, _gsapCore._isUndefined)(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : (0, _gsapCore._getSetter)(target, property);
  },
  core: {
    _removeProperty: _removeProperty,
    _getMatrix: _getMatrix
  }
};
exports.default = exports.CSSPlugin = CSSPlugin;
_gsapCore.gsap.utils.checkPrefix = _checkPropPrefix;

(function (positionAndScale, rotation, others, aliases) {
  var all = (0, _gsapCore._forEachName)(positionAndScale + "," + rotation + "," + others, function (name) {
    _transformProps[name] = 1;
  });
  (0, _gsapCore._forEachName)(rotation, function (name) {
    _gsapCore._config.units[name] = "deg";
    _rotationalProperties[name] = 1;
  });
  _propertyAliases[all[13]] = positionAndScale + "," + rotation;
  (0, _gsapCore._forEachName)(aliases, function (name) {
    var split = name.split(":");
    _propertyAliases[split[1]] = all[split[0]];
  });
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");

(0, _gsapCore._forEachName)("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function (name) {
  _gsapCore._config.units[name] = "px";
});

_gsapCore.gsap.registerPlugin(CSSPlugin);
},{"./gsap-core.js":"node_modules/gsap/gsap-core.js"}],"node_modules/gsap/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Power0", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power0;
  }
});
Object.defineProperty(exports, "Power1", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power1;
  }
});
Object.defineProperty(exports, "Power2", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power2;
  }
});
Object.defineProperty(exports, "Power3", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power3;
  }
});
Object.defineProperty(exports, "Power4", {
  enumerable: true,
  get: function () {
    return _gsapCore.Power4;
  }
});
Object.defineProperty(exports, "Linear", {
  enumerable: true,
  get: function () {
    return _gsapCore.Linear;
  }
});
Object.defineProperty(exports, "Quad", {
  enumerable: true,
  get: function () {
    return _gsapCore.Quad;
  }
});
Object.defineProperty(exports, "Cubic", {
  enumerable: true,
  get: function () {
    return _gsapCore.Cubic;
  }
});
Object.defineProperty(exports, "Quart", {
  enumerable: true,
  get: function () {
    return _gsapCore.Quart;
  }
});
Object.defineProperty(exports, "Quint", {
  enumerable: true,
  get: function () {
    return _gsapCore.Quint;
  }
});
Object.defineProperty(exports, "Strong", {
  enumerable: true,
  get: function () {
    return _gsapCore.Strong;
  }
});
Object.defineProperty(exports, "Elastic", {
  enumerable: true,
  get: function () {
    return _gsapCore.Elastic;
  }
});
Object.defineProperty(exports, "Back", {
  enumerable: true,
  get: function () {
    return _gsapCore.Back;
  }
});
Object.defineProperty(exports, "SteppedEase", {
  enumerable: true,
  get: function () {
    return _gsapCore.SteppedEase;
  }
});
Object.defineProperty(exports, "Bounce", {
  enumerable: true,
  get: function () {
    return _gsapCore.Bounce;
  }
});
Object.defineProperty(exports, "Sine", {
  enumerable: true,
  get: function () {
    return _gsapCore.Sine;
  }
});
Object.defineProperty(exports, "Expo", {
  enumerable: true,
  get: function () {
    return _gsapCore.Expo;
  }
});
Object.defineProperty(exports, "Circ", {
  enumerable: true,
  get: function () {
    return _gsapCore.Circ;
  }
});
Object.defineProperty(exports, "TweenLite", {
  enumerable: true,
  get: function () {
    return _gsapCore.TweenLite;
  }
});
Object.defineProperty(exports, "TimelineLite", {
  enumerable: true,
  get: function () {
    return _gsapCore.TimelineLite;
  }
});
Object.defineProperty(exports, "TimelineMax", {
  enumerable: true,
  get: function () {
    return _gsapCore.TimelineMax;
  }
});
Object.defineProperty(exports, "CSSPlugin", {
  enumerable: true,
  get: function () {
    return _CSSPlugin.CSSPlugin;
  }
});
exports.TweenMax = exports.default = exports.gsap = void 0;

var _gsapCore = require("./gsap-core.js");

var _CSSPlugin = require("./CSSPlugin.js");

var gsapWithCSS = _gsapCore.gsap.registerPlugin(_CSSPlugin.CSSPlugin) || _gsapCore.gsap,
    // to protect from tree shaking
TweenMaxWithCSS = gsapWithCSS.core.Tween;

exports.TweenMax = TweenMaxWithCSS;
exports.default = exports.gsap = gsapWithCSS;
},{"./gsap-core.js":"node_modules/gsap/gsap-core.js","./CSSPlugin.js":"node_modules/gsap/CSSPlugin.js"}],"modules/appendText.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppendText = void 0;

var _gsap = require("gsap");

var AppendText = function AppendText(data) {
  var upperText = document.querySelector(".UpperText");
  var bottomText = document.querySelector(".Instructions");

  _gsap.gsap.to(upperText, {
    duration: 1,
    opacity: 0
  });

  _gsap.gsap.to(bottomText, {
    duration: 1,
    opacity: 0
  });

  setTimeout(function () {
    _gsap.gsap.to(upperText, {
      duration: 1,
      opacity: 1
    });

    _gsap.gsap.to(bottomText, {
      duration: 1,
      opacity: 1
    });

    upperText.textContent = data[0].textUpper;
    bottomText.textContent = data[0].instruction;
  }, 1000);
};

exports.AppendText = AppendText;
},{"gsap":"node_modules/gsap/index.js"}],"node_modules/eve/eve.js":[function(require,module,exports) {
var define;
// Copyright (c) 2017 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// ┌────────────────────────────────────────────────────────────┐ \\
// │ Eve 0.5.4 - JavaScript Events Library                      │ \\
// ├────────────────────────────────────────────────────────────┤ \\
// │ Author Dmitry Baranovskiy (http://dmitry.baranovskiy.com/) │ \\
// └────────────────────────────────────────────────────────────┘ \\

(function (glob) {
    var version = "0.5.4",
        has = "hasOwnProperty",
        separator = /[\.\/]/,
        comaseparator = /\s*,\s*/,
        wildcard = "*",
        numsort = function (a, b) {
            return a - b;
        },
        current_event,
        stop,
        events = {n: {}},
        firstDefined = function () {
            for (var i = 0, ii = this.length; i < ii; i++) {
                if (typeof this[i] != "undefined") {
                    return this[i];
                }
            }
        },
        lastDefined = function () {
            var i = this.length;
            while (--i) {
                if (typeof this[i] != "undefined") {
                    return this[i];
                }
            }
        },
        objtos = Object.prototype.toString,
        Str = String,
        isArray = Array.isArray || function (ar) {
            return ar instanceof Array || objtos.call(ar) == "[object Array]";
        },
    /*\
     * eve
     [ method ]

     * Fires event with given `name`, given scope and other parameters.

     - name (string) name of the *event*, dot (`.`) or slash (`/`) separated
     - scope (object) context for the event handlers
     - varargs (...) the rest of arguments will be sent to event handlers

     = (object) array of returned values from the listeners. Array has two methods `.firstDefined()` and `.lastDefined()` to get first or last not `undefined` value.
    \*/
        eve = function (name, scope) {
            var oldstop = stop,
                args = Array.prototype.slice.call(arguments, 2),
                listeners = eve.listeners(name),
                z = 0,
                l,
                indexed = [],
                queue = {},
                out = [],
                ce = current_event;
            out.firstDefined = firstDefined;
            out.lastDefined = lastDefined;
            current_event = name;
            stop = 0;
            for (var i = 0, ii = listeners.length; i < ii; i++) if ("zIndex" in listeners[i]) {
                indexed.push(listeners[i].zIndex);
                if (listeners[i].zIndex < 0) {
                    queue[listeners[i].zIndex] = listeners[i];
                }
            }
            indexed.sort(numsort);
            while (indexed[z] < 0) {
                l = queue[indexed[z++]];
                out.push(l.apply(scope, args));
                if (stop) {
                    stop = oldstop;
                    return out;
                }
            }
            for (i = 0; i < ii; i++) {
                l = listeners[i];
                if ("zIndex" in l) {
                    if (l.zIndex == indexed[z]) {
                        out.push(l.apply(scope, args));
                        if (stop) {
                            break;
                        }
                        do {
                            z++;
                            l = queue[indexed[z]];
                            l && out.push(l.apply(scope, args));
                            if (stop) {
                                break;
                            }
                        } while (l)
                    } else {
                        queue[l.zIndex] = l;
                    }
                } else {
                    out.push(l.apply(scope, args));
                    if (stop) {
                        break;
                    }
                }
            }
            stop = oldstop;
            current_event = ce;
            return out;
        };
    // Undocumented. Debug only.
    eve._events = events;
    /*\
     * eve.listeners
     [ method ]

     * Internal method which gives you array of all event handlers that will be triggered by the given `name`.

     - name (string) name of the event, dot (`.`) or slash (`/`) separated

     = (array) array of event handlers
    \*/
    eve.listeners = function (name) {
        var names = isArray(name) ? name : name.split(separator),
            e = events,
            item,
            items,
            k,
            i,
            ii,
            j,
            jj,
            nes,
            es = [e],
            out = [];
        for (i = 0, ii = names.length; i < ii; i++) {
            nes = [];
            for (j = 0, jj = es.length; j < jj; j++) {
                e = es[j].n;
                items = [e[names[i]], e[wildcard]];
                k = 2;
                while (k--) {
                    item = items[k];
                    if (item) {
                        nes.push(item);
                        out = out.concat(item.f || []);
                    }
                }
            }
            es = nes;
        }
        return out;
    };
    /*\
     * eve.separator
     [ method ]

     * If for some reasons you don’t like default separators (`.` or `/`) you can specify yours
     * here. Be aware that if you pass a string longer than one character it will be treated as
     * a list of characters.

     - separator (string) new separator. Empty string resets to default: `.` or `/`.
    \*/
    eve.separator = function (sep) {
        if (sep) {
            sep = Str(sep).replace(/(?=[\.\^\]\[\-])/g, "\\");
            sep = "[" + sep + "]";
            separator = new RegExp(sep);
        } else {
            separator = /[\.\/]/;
        }
    };
    /*\
     * eve.on
     [ method ]
     **
     * Binds given event handler with a given name. You can use wildcards “`*`” for the names:
     | eve.on("*.under.*", f);
     | eve("mouse.under.floor"); // triggers f
     * Use @eve to trigger the listener.
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
     **
     - name (array) if you don’t want to use separators, you can use array of strings
     - f (function) event handler function
     **
     = (function) returned function accepts a single numeric parameter that represents z-index of the handler. It is an optional feature and only used when you need to ensure that some subset of handlers will be invoked in a given order, despite of the order of assignment.
     > Example:
     | eve.on("mouse", eatIt)(2);
     | eve.on("mouse", scream);
     | eve.on("mouse", catchIt)(1);
     * This will ensure that `catchIt` function will be called before `eatIt`.
     *
     * If you want to put your handler before non-indexed handlers, specify a negative value.
     * Note: I assume most of the time you don’t need to worry about z-index, but it’s nice to have this feature “just in case”.
    \*/
    eve.on = function (name, f) {
        if (typeof f != "function") {
            return function () {};
        }
        var names = isArray(name) ? isArray(name[0]) ? name : [name] : Str(name).split(comaseparator);
        for (var i = 0, ii = names.length; i < ii; i++) {
            (function (name) {
                var names = isArray(name) ? name : Str(name).split(separator),
                    e = events,
                    exist;
                for (var i = 0, ii = names.length; i < ii; i++) {
                    e = e.n;
                    e = e.hasOwnProperty(names[i]) && e[names[i]] || (e[names[i]] = {n: {}});
                }
                e.f = e.f || [];
                for (i = 0, ii = e.f.length; i < ii; i++) if (e.f[i] == f) {
                    exist = true;
                    break;
                }
                !exist && e.f.push(f);
            }(names[i]));
        }
        return function (zIndex) {
            if (+zIndex == +zIndex) {
                f.zIndex = +zIndex;
            }
        };
    };
    /*\
     * eve.f
     [ method ]
     **
     * Returns function that will fire given event with optional arguments.
     * Arguments that will be passed to the result function will be also
     * concated to the list of final arguments.
     | el.onclick = eve.f("click", 1, 2);
     | eve.on("click", function (a, b, c) {
     |     console.log(a, b, c); // 1, 2, [event object]
     | });
     - event (string) event name
     - varargs (…) and any other arguments
     = (function) possible event handler function
    \*/
    eve.f = function (event) {
        var attrs = [].slice.call(arguments, 1);
        return function () {
            eve.apply(null, [event, null].concat(attrs).concat([].slice.call(arguments, 0)));
        };
    };
    /*\
     * eve.stop
     [ method ]
     **
     * Is used inside an event handler to stop the event, preventing any subsequent listeners from firing.
    \*/
    eve.stop = function () {
        stop = 1;
    };
    /*\
     * eve.nt
     [ method ]
     **
     * Could be used inside event handler to figure out actual name of the event.
     **
     - subname (string) #optional subname of the event
     **
     = (string) name of the event, if `subname` is not specified
     * or
     = (boolean) `true`, if current event’s name contains `subname`
    \*/
    eve.nt = function (subname) {
        var cur = isArray(current_event) ? current_event.join(".") : current_event;
        if (subname) {
            return new RegExp("(?:\\.|\\/|^)" + subname + "(?:\\.|\\/|$)").test(cur);
        }
        return cur;
    };
    /*\
     * eve.nts
     [ method ]
     **
     * Could be used inside event handler to figure out actual name of the event.
     **
     **
     = (array) names of the event
    \*/
    eve.nts = function () {
        return isArray(current_event) ? current_event : current_event.split(separator);
    };
    /*\
     * eve.off
     [ method ]
     **
     * Removes given function from the list of event listeners assigned to given name.
     * If no arguments specified all the events will be cleared.
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
    \*/
    /*\
     * eve.unbind
     [ method ]
     **
     * See @eve.off
    \*/
    eve.off = eve.unbind = function (name, f) {
        if (!name) {
            eve._events = events = {n: {}};
            return;
        }
        var names = isArray(name) ? isArray(name[0]) ? name : [name] : Str(name).split(comaseparator);
        if (names.length > 1) {
            for (var i = 0, ii = names.length; i < ii; i++) {
                eve.off(names[i], f);
            }
            return;
        }
        names = isArray(name) ? name : Str(name).split(separator);
        var e,
            key,
            splice,
            i, ii, j, jj,
            cur = [events],
            inodes = [];
        for (i = 0, ii = names.length; i < ii; i++) {
            for (j = 0; j < cur.length; j += splice.length - 2) {
                splice = [j, 1];
                e = cur[j].n;
                if (names[i] != wildcard) {
                    if (e[names[i]]) {
                        splice.push(e[names[i]]);
                        inodes.unshift({
                            n: e,
                            name: names[i]
                        });
                    }
                } else {
                    for (key in e) if (e[has](key)) {
                        splice.push(e[key]);
                        inodes.unshift({
                            n: e,
                            name: key
                        });
                    }
                }
                cur.splice.apply(cur, splice);
            }
        }
        for (i = 0, ii = cur.length; i < ii; i++) {
            e = cur[i];
            while (e.n) {
                if (f) {
                    if (e.f) {
                        for (j = 0, jj = e.f.length; j < jj; j++) if (e.f[j] == f) {
                            e.f.splice(j, 1);
                            break;
                        }
                        !e.f.length && delete e.f;
                    }
                    for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                        var funcs = e.n[key].f;
                        for (j = 0, jj = funcs.length; j < jj; j++) if (funcs[j] == f) {
                            funcs.splice(j, 1);
                            break;
                        }
                        !funcs.length && delete e.n[key].f;
                    }
                } else {
                    delete e.f;
                    for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                        delete e.n[key].f;
                    }
                }
                e = e.n;
            }
        }
        // prune inner nodes in path
        prune: for (i = 0, ii = inodes.length; i < ii; i++) {
            e = inodes[i];
            for (key in e.n[e.name].f) {
                // not empty (has listeners)
                continue prune;
            }
            for (key in e.n[e.name].n) {
                // not empty (has children)
                continue prune;
            }
            // is empty
            delete e.n[e.name];
        }
    };
    /*\
     * eve.once
     [ method ]
     **
     * Binds given event handler with a given name to only run once then unbind itself.
     | eve.once("login", f);
     | eve("login"); // triggers f
     | eve("login"); // no listeners
     * Use @eve to trigger the listener.
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
     **
     = (function) same return function as @eve.on
    \*/
    eve.once = function (name, f) {
        var f2 = function () {
            eve.off(name, f2);
            return f.apply(this, arguments);
        };
        return eve.on(name, f2);
    };
    /*\
     * eve.version
     [ property (string) ]
     **
     * Current version of the library.
    \*/
    eve.version = version;
    eve.toString = function () {
        return "You are running Eve " + version;
    };
    glob.eve = eve;
    typeof module != "undefined" && module.exports ? module.exports = eve : typeof define === "function" && define.amd ? define("eve", [], function () { return eve; }) : glob.eve = eve;
})(typeof window != "undefined" ? window : this);

},{}],"node_modules/snapsvg/dist/snap.svg.js":[function(require,module,exports) {
var define;
var global = arguments[3];
// Snap.svg 0.5.0
//
// Copyright (c) 2013 – 2017 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// build: 2017-02-06

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
// http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
// ┌────────────────────────────────────────────────────────────┐ \\
// │ Eve 0.5.0 - JavaScript Events Library                      │ \\
// ├────────────────────────────────────────────────────────────┤ \\
// │ Author Dmitry Baranovskiy (http://dmitry.baranovskiy.com/) │ \\
// └────────────────────────────────────────────────────────────┘ \\

(function (glob) {
    var version = "0.5.0",
        has = "hasOwnProperty",
        separator = /[\.\/]/,
        comaseparator = /\s*,\s*/,
        wildcard = "*",
        fun = function () {},
        numsort = function (a, b) {
            return a - b;
        },
        current_event,
        stop,
        events = {n: {}},
        firstDefined = function () {
            for (var i = 0, ii = this.length; i < ii; i++) {
                if (typeof this[i] != "undefined") {
                    return this[i];
                }
            }
        },
        lastDefined = function () {
            var i = this.length;
            while (--i) {
                if (typeof this[i] != "undefined") {
                    return this[i];
                }
            }
        },
        objtos = Object.prototype.toString,
        Str = String,
        isArray = Array.isArray || function (ar) {
            return ar instanceof Array || objtos.call(ar) == "[object Array]";
        };
    /*\
     * eve
     [ method ]

     * Fires event with given `name`, given scope and other parameters.

     > Arguments

     - name (string) name of the *event*, dot (`.`) or slash (`/`) separated
     - scope (object) context for the event handlers
     - varargs (...) the rest of arguments will be sent to event handlers

     = (object) array of returned values from the listeners. Array has two methods `.firstDefined()` and `.lastDefined()` to get first or last not `undefined` value.
    \*/
        eve = function (name, scope) {
            var e = events,
                oldstop = stop,
                args = Array.prototype.slice.call(arguments, 2),
                listeners = eve.listeners(name),
                z = 0,
                f = false,
                l,
                indexed = [],
                queue = {},
                out = [],
                ce = current_event,
                errors = [];
            out.firstDefined = firstDefined;
            out.lastDefined = lastDefined;
            current_event = name;
            stop = 0;
            for (var i = 0, ii = listeners.length; i < ii; i++) if ("zIndex" in listeners[i]) {
                indexed.push(listeners[i].zIndex);
                if (listeners[i].zIndex < 0) {
                    queue[listeners[i].zIndex] = listeners[i];
                }
            }
            indexed.sort(numsort);
            while (indexed[z] < 0) {
                l = queue[indexed[z++]];
                out.push(l.apply(scope, args));
                if (stop) {
                    stop = oldstop;
                    return out;
                }
            }
            for (i = 0; i < ii; i++) {
                l = listeners[i];
                if ("zIndex" in l) {
                    if (l.zIndex == indexed[z]) {
                        out.push(l.apply(scope, args));
                        if (stop) {
                            break;
                        }
                        do {
                            z++;
                            l = queue[indexed[z]];
                            l && out.push(l.apply(scope, args));
                            if (stop) {
                                break;
                            }
                        } while (l)
                    } else {
                        queue[l.zIndex] = l;
                    }
                } else {
                    out.push(l.apply(scope, args));
                    if (stop) {
                        break;
                    }
                }
            }
            stop = oldstop;
            current_event = ce;
            return out;
        };
        // Undocumented. Debug only.
        eve._events = events;
    /*\
     * eve.listeners
     [ method ]

     * Internal method which gives you array of all event handlers that will be triggered by the given `name`.

     > Arguments

     - name (string) name of the event, dot (`.`) or slash (`/`) separated

     = (array) array of event handlers
    \*/
    eve.listeners = function (name) {
        var names = isArray(name) ? name : name.split(separator),
            e = events,
            item,
            items,
            k,
            i,
            ii,
            j,
            jj,
            nes,
            es = [e],
            out = [];
        for (i = 0, ii = names.length; i < ii; i++) {
            nes = [];
            for (j = 0, jj = es.length; j < jj; j++) {
                e = es[j].n;
                items = [e[names[i]], e[wildcard]];
                k = 2;
                while (k--) {
                    item = items[k];
                    if (item) {
                        nes.push(item);
                        out = out.concat(item.f || []);
                    }
                }
            }
            es = nes;
        }
        return out;
    };
    /*\
     * eve.separator
     [ method ]

     * If for some reasons you don’t like default separators (`.` or `/`) you can specify yours
     * here. Be aware that if you pass a string longer than one character it will be treated as
     * a list of characters.

     - separator (string) new separator. Empty string resets to default: `.` or `/`.
    \*/
    eve.separator = function (sep) {
        if (sep) {
            sep = Str(sep).replace(/(?=[\.\^\]\[\-])/g, "\\");
            sep = "[" + sep + "]";
            separator = new RegExp(sep);
        } else {
            separator = /[\.\/]/;
        }
    };
    /*\
     * eve.on
     [ method ]
     **
     * Binds given event handler with a given name. You can use wildcards “`*`” for the names:
     | eve.on("*.under.*", f);
     | eve("mouse.under.floor"); // triggers f
     * Use @eve to trigger the listener.
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
     **
     - name (array) if you don’t want to use separators, you can use array of strings
     - f (function) event handler function
     **
     = (function) returned function accepts a single numeric parameter that represents z-index of the handler. It is an optional feature and only used when you need to ensure that some subset of handlers will be invoked in a given order, despite of the order of assignment. 
     > Example:
     | eve.on("mouse", eatIt)(2);
     | eve.on("mouse", scream);
     | eve.on("mouse", catchIt)(1);
     * This will ensure that `catchIt` function will be called before `eatIt`.
     *
     * If you want to put your handler before non-indexed handlers, specify a negative value.
     * Note: I assume most of the time you don’t need to worry about z-index, but it’s nice to have this feature “just in case”.
    \*/
    eve.on = function (name, f) {
        if (typeof f != "function") {
            return function () {};
        }
        var names = isArray(name) ? (isArray(name[0]) ? name : [name]) : Str(name).split(comaseparator);
        for (var i = 0, ii = names.length; i < ii; i++) {
            (function (name) {
                var names = isArray(name) ? name : Str(name).split(separator),
                    e = events,
                    exist;
                for (var i = 0, ii = names.length; i < ii; i++) {
                    e = e.n;
                    e = e.hasOwnProperty(names[i]) && e[names[i]] || (e[names[i]] = {n: {}});
                }
                e.f = e.f || [];
                for (i = 0, ii = e.f.length; i < ii; i++) if (e.f[i] == f) {
                    exist = true;
                    break;
                }
                !exist && e.f.push(f);
            }(names[i]));
        }
        return function (zIndex) {
            if (+zIndex == +zIndex) {
                f.zIndex = +zIndex;
            }
        };
    };
    /*\
     * eve.f
     [ method ]
     **
     * Returns function that will fire given event with optional arguments.
     * Arguments that will be passed to the result function will be also
     * concated to the list of final arguments.
     | el.onclick = eve.f("click", 1, 2);
     | eve.on("click", function (a, b, c) {
     |     console.log(a, b, c); // 1, 2, [event object]
     | });
     > Arguments
     - event (string) event name
     - varargs (…) and any other arguments
     = (function) possible event handler function
    \*/
    eve.f = function (event) {
        var attrs = [].slice.call(arguments, 1);
        return function () {
            eve.apply(null, [event, null].concat(attrs).concat([].slice.call(arguments, 0)));
        };
    };
    /*\
     * eve.stop
     [ method ]
     **
     * Is used inside an event handler to stop the event, preventing any subsequent listeners from firing.
    \*/
    eve.stop = function () {
        stop = 1;
    };
    /*\
     * eve.nt
     [ method ]
     **
     * Could be used inside event handler to figure out actual name of the event.
     **
     > Arguments
     **
     - subname (string) #optional subname of the event
     **
     = (string) name of the event, if `subname` is not specified
     * or
     = (boolean) `true`, if current event’s name contains `subname`
    \*/
    eve.nt = function (subname) {
        var cur = isArray(current_event) ? current_event.join(".") : current_event;
        if (subname) {
            return new RegExp("(?:\\.|\\/|^)" + subname + "(?:\\.|\\/|$)").test(cur);
        }
        return cur;
    };
    /*\
     * eve.nts
     [ method ]
     **
     * Could be used inside event handler to figure out actual name of the event.
     **
     **
     = (array) names of the event
    \*/
    eve.nts = function () {
        return isArray(current_event) ? current_event : current_event.split(separator);
    };
    /*\
     * eve.off
     [ method ]
     **
     * Removes given function from the list of event listeners assigned to given name.
     * If no arguments specified all the events will be cleared.
     **
     > Arguments
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
    \*/
    /*\
     * eve.unbind
     [ method ]
     **
     * See @eve.off
    \*/
    eve.off = eve.unbind = function (name, f) {
        if (!name) {
            eve._events = events = {n: {}};
            return;
        }
        var names = isArray(name) ? (isArray(name[0]) ? name : [name]) : Str(name).split(comaseparator);
        if (names.length > 1) {
            for (var i = 0, ii = names.length; i < ii; i++) {
                eve.off(names[i], f);
            }
            return;
        }
        names = isArray(name) ? name : Str(name).split(separator);
        var e,
            key,
            splice,
            i, ii, j, jj,
            cur = [events],
            inodes = [];
        for (i = 0, ii = names.length; i < ii; i++) {
            for (j = 0; j < cur.length; j += splice.length - 2) {
                splice = [j, 1];
                e = cur[j].n;
                if (names[i] != wildcard) {
                    if (e[names[i]]) {
                        splice.push(e[names[i]]);
                        inodes.unshift({
                            n: e,
                            name: names[i]
                        });
                    }
                } else {
                    for (key in e) if (e[has](key)) {
                        splice.push(e[key]);
                        inodes.unshift({
                            n: e,
                            name: key
                        });
                    }
                }
                cur.splice.apply(cur, splice);
            }
        }
        for (i = 0, ii = cur.length; i < ii; i++) {
            e = cur[i];
            while (e.n) {
                if (f) {
                    if (e.f) {
                        for (j = 0, jj = e.f.length; j < jj; j++) if (e.f[j] == f) {
                            e.f.splice(j, 1);
                            break;
                        }
                        !e.f.length && delete e.f;
                    }
                    for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                        var funcs = e.n[key].f;
                        for (j = 0, jj = funcs.length; j < jj; j++) if (funcs[j] == f) {
                            funcs.splice(j, 1);
                            break;
                        }
                        !funcs.length && delete e.n[key].f;
                    }
                } else {
                    delete e.f;
                    for (key in e.n) if (e.n[has](key) && e.n[key].f) {
                        delete e.n[key].f;
                    }
                }
                e = e.n;
            }
        }
        // prune inner nodes in path
        prune: for (i = 0, ii = inodes.length; i < ii; i++) {
            e = inodes[i];
            for (key in e.n[e.name].f) {
                // not empty (has listeners)
                continue prune;
            }
            for (key in e.n[e.name].n) {
                // not empty (has children)
                continue prune;
            }
            // is empty
            delete e.n[e.name];
        }
    };
    /*\
     * eve.once
     [ method ]
     **
     * Binds given event handler with a given name to only run once then unbind itself.
     | eve.once("login", f);
     | eve("login"); // triggers f
     | eve("login"); // no listeners
     * Use @eve to trigger the listener.
     **
     > Arguments
     **
     - name (string) name of the event, dot (`.`) or slash (`/`) separated, with optional wildcards
     - f (function) event handler function
     **
     = (function) same return function as @eve.on
    \*/
    eve.once = function (name, f) {
        var f2 = function () {
            eve.off(name, f2);
            return f.apply(this, arguments);
        };
        return eve.on(name, f2);
    };
    /*\
     * eve.version
     [ property (string) ]
     **
     * Current version of the library.
    \*/
    eve.version = version;
    eve.toString = function () {
        return "You are running Eve " + version;
    };
    (typeof module != "undefined" && module.exports) ? (module.exports = eve) : (typeof define === "function" && define.amd ? (define("eve", [], function() { return eve; })) : (glob.eve = eve));
})(this);

(function (glob, factory) {
    // AMD support
    if (typeof define == "function" && define.amd) {
        // Define as an anonymous module
        define(["eve"], function (eve) {
            return factory(glob, eve);
        });
    } else if (typeof exports != "undefined") {
        // Next for Node.js or CommonJS
        var eve = require("eve");
        module.exports = factory(glob, eve);
    } else {
        // Browser globals (glob is window)
        // Snap adds itself to window
        factory(glob, glob.eve);
    }
}(window || this, function (window, eve) {

// Copyright (c) 2017 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
var mina = (function (eve) {
    var animations = {},
    requestAnimFrame = window.requestAnimationFrame       ||
                       window.webkitRequestAnimationFrame ||
                       window.mozRequestAnimationFrame    ||
                       window.oRequestAnimationFrame      ||
                       window.msRequestAnimationFrame     ||
                       function (callback) {
                           setTimeout(callback, 16, new Date().getTime());
                           return true;
                       },
    requestID,
    isArray = Array.isArray || function (a) {
        return a instanceof Array ||
            Object.prototype.toString.call(a) == "[object Array]";
    },
    idgen = 0,
    idprefix = "M" + (+new Date).toString(36),
    ID = function () {
        return idprefix + (idgen++).toString(36);
    },
    diff = function (a, b, A, B) {
        if (isArray(a)) {
            res = [];
            for (var i = 0, ii = a.length; i < ii; i++) {
                res[i] = diff(a[i], b, A[i], B);
            }
            return res;
        }
        var dif = (A - a) / (B - b);
        return function (bb) {
            return a + dif * (bb - b);
        };
    },
    timer = Date.now || function () {
        return +new Date;
    },
    sta = function (val) {
        var a = this;
        if (val == null) {
            return a.s;
        }
        var ds = a.s - val;
        a.b += a.dur * ds;
        a.B += a.dur * ds;
        a.s = val;
    },
    speed = function (val) {
        var a = this;
        if (val == null) {
            return a.spd;
        }
        a.spd = val;
    },
    duration = function (val) {
        var a = this;
        if (val == null) {
            return a.dur;
        }
        a.s = a.s * val / a.dur;
        a.dur = val;
    },
    stopit = function () {
        var a = this;
        delete animations[a.id];
        a.update();
        eve("mina.stop." + a.id, a);
    },
    pause = function () {
        var a = this;
        if (a.pdif) {
            return;
        }
        delete animations[a.id];
        a.update();
        a.pdif = a.get() - a.b;
    },
    resume = function () {
        var a = this;
        if (!a.pdif) {
            return;
        }
        a.b = a.get() - a.pdif;
        delete a.pdif;
        animations[a.id] = a;
        frame();
    },
    update = function () {
        var a = this,
            res;
        if (isArray(a.start)) {
            res = [];
            for (var j = 0, jj = a.start.length; j < jj; j++) {
                res[j] = +a.start[j] +
                    (a.end[j] - a.start[j]) * a.easing(a.s);
            }
        } else {
            res = +a.start + (a.end - a.start) * a.easing(a.s);
        }
        a.set(res);
    },
    frame = function (timeStamp) {
        // Manual invokation?
        if (!timeStamp) {
            // Frame loop stopped?
            if (!requestID) {
                // Start frame loop...
                requestID = requestAnimFrame(frame);
            }
            return;
        }
        var len = 0;
        for (var i in animations) if (animations.hasOwnProperty(i)) {
            var a = animations[i],
                b = a.get(),
                res;
            len++;
            a.s = (b - a.b) / (a.dur / a.spd);
            if (a.s >= 1) {
                delete animations[i];
                a.s = 1;
                len--;
                (function (a) {
                    setTimeout(function () {
                        eve("mina.finish." + a.id, a);
                    });
                }(a));
            }
            a.update();
        }
        requestID = len ? requestAnimFrame(frame) : false;
    },
    /*\
     * mina
     [ method ]
     **
     * Generic animation of numbers
     **
     - a (number) start _slave_ number
     - A (number) end _slave_ number
     - b (number) start _master_ number (start time in general case)
     - B (number) end _master_ number (end time in general case)
     - get (function) getter of _master_ number (see @mina.time)
     - set (function) setter of _slave_ number
     - easing (function) #optional easing function, default is @mina.linear
     = (object) animation descriptor
     o {
     o         id (string) animation id,
     o         start (number) start _slave_ number,
     o         end (number) end _slave_ number,
     o         b (number) start _master_ number,
     o         s (number) animation status (0..1),
     o         dur (number) animation duration,
     o         spd (number) animation speed,
     o         get (function) getter of _master_ number (see @mina.time),
     o         set (function) setter of _slave_ number,
     o         easing (function) easing function, default is @mina.linear,
     o         status (function) status getter/setter,
     o         speed (function) speed getter/setter,
     o         duration (function) duration getter/setter,
     o         stop (function) animation stopper
     o         pause (function) pauses the animation
     o         resume (function) resumes the animation
     o         update (function) calles setter with the right value of the animation
     o }
    \*/
    mina = function (a, A, b, B, get, set, easing) {
        var anim = {
            id: ID(),
            start: a,
            end: A,
            b: b,
            s: 0,
            dur: B - b,
            spd: 1,
            get: get,
            set: set,
            easing: easing || mina.linear,
            status: sta,
            speed: speed,
            duration: duration,
            stop: stopit,
            pause: pause,
            resume: resume,
            update: update
        };
        animations[anim.id] = anim;
        var len = 0, i;
        for (i in animations) if (animations.hasOwnProperty(i)) {
            len++;
            if (len == 2) {
                break;
            }
        }
        len == 1 && frame();
        return anim;
    };
    /*\
     * mina.time
     [ method ]
     **
     * Returns the current time. Equivalent to:
     | function () {
     |     return (new Date).getTime();
     | }
    \*/
    mina.time = timer;
    /*\
     * mina.getById
     [ method ]
     **
     * Returns an animation by its id
     - id (string) animation's id
     = (object) See @mina
    \*/
    mina.getById = function (id) {
        return animations[id] || null;
    };

    /*\
     * mina.linear
     [ method ]
     **
     * Default linear easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.linear = function (n) {
        return n;
    };
    /*\
     * mina.easeout
     [ method ]
     **
     * Easeout easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.easeout = function (n) {
        return Math.pow(n, 1.7);
    };
    /*\
     * mina.easein
     [ method ]
     **
     * Easein easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.easein = function (n) {
        return Math.pow(n, .48);
    };
    /*\
     * mina.easeinout
     [ method ]
     **
     * Easeinout easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.easeinout = function (n) {
        if (n == 1) {
            return 1;
        }
        if (n == 0) {
            return 0;
        }
        var q = .48 - n / 1.04,
            Q = Math.sqrt(.1734 + q * q),
            x = Q - q,
            X = Math.pow(Math.abs(x), 1 / 3) * (x < 0 ? -1 : 1),
            y = -Q - q,
            Y = Math.pow(Math.abs(y), 1 / 3) * (y < 0 ? -1 : 1),
            t = X + Y + .5;
        return (1 - t) * 3 * t * t + t * t * t;
    };
    /*\
     * mina.backin
     [ method ]
     **
     * Backin easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.backin = function (n) {
        if (n == 1) {
            return 1;
        }
        var s = 1.70158;
        return n * n * ((s + 1) * n - s);
    };
    /*\
     * mina.backout
     [ method ]
     **
     * Backout easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.backout = function (n) {
        if (n == 0) {
            return 0;
        }
        n = n - 1;
        var s = 1.70158;
        return n * n * ((s + 1) * n + s) + 1;
    };
    /*\
     * mina.elastic
     [ method ]
     **
     * Elastic easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.elastic = function (n) {
        if (n == !!n) {
            return n;
        }
        return Math.pow(2, -10 * n) * Math.sin((n - .075) *
            (2 * Math.PI) / .3) + 1;
    };
    /*\
     * mina.bounce
     [ method ]
     **
     * Bounce easing
     - n (number) input 0..1
     = (number) output 0..1
    \*/
    mina.bounce = function (n) {
        var s = 7.5625,
            p = 2.75,
            l;
        if (n < 1 / p) {
            l = s * n * n;
        } else {
            if (n < 2 / p) {
                n -= 1.5 / p;
                l = s * n * n + .75;
            } else {
                if (n < 2.5 / p) {
                    n -= 2.25 / p;
                    l = s * n * n + .9375;
                } else {
                    n -= 2.625 / p;
                    l = s * n * n + .984375;
                }
            }
        }
        return l;
    };
    window.mina = mina;
    return mina;
})(typeof eve == "undefined" ? function () {} : eve);

// Copyright (c) 2013 - 2017 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

var Snap = (function(root) {
Snap.version = "0.5.1";
/*\
 * Snap
 [ method ]
 **
 * Creates a drawing surface or wraps existing SVG element.
 **
 - width (number|string) width of surface
 - height (number|string) height of surface
 * or
 - DOM (SVGElement) element to be wrapped into Snap structure
 * or
 - array (array) array of elements (will return set of elements)
 * or
 - query (string) CSS query selector
 = (object) @Element
\*/
function Snap(w, h) {
    if (w) {
        if (w.nodeType) {
            return wrap(w);
        }
        if (is(w, "array") && Snap.set) {
            return Snap.set.apply(Snap, w);
        }
        if (w instanceof Element) {
            return w;
        }
        if (h == null) {
            // try {
                w = glob.doc.querySelector(String(w));
                return wrap(w);
            // } catch (e) {
                // return null;
            // }
        }
    }
    w = w == null ? "100%" : w;
    h = h == null ? "100%" : h;
    return new Paper(w, h);
}
Snap.toString = function () {
    return "Snap v" + this.version;
};
Snap._ = {};
var glob = {
    win: root.window,
    doc: root.window.document
};
Snap._.glob = glob;
var has = "hasOwnProperty",
    Str = String,
    toFloat = parseFloat,
    toInt = parseInt,
    math = Math,
    mmax = math.max,
    mmin = math.min,
    abs = math.abs,
    pow = math.pow,
    PI = math.PI,
    round = math.round,
    E = "",
    S = " ",
    objectToString = Object.prototype.toString,
    ISURL = /^url\(['"]?([^\)]+?)['"]?\)$/i,
    colourRegExp = /^\s*((#[a-f\d]{6})|(#[a-f\d]{3})|rgba?\(\s*([\d\.]+%?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+%?(?:\s*,\s*[\d\.]+%?)?)\s*\)|hsba?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\)|hsla?\(\s*([\d\.]+(?:deg|\xb0|%)?\s*,\s*[\d\.]+%?\s*,\s*[\d\.]+(?:%?\s*,\s*[\d\.]+)?%?)\s*\))\s*$/i,
    bezierrg = /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,
    separator = Snap._.separator = /[,\s]+/,
    whitespace = /[\s]/g,
    commaSpaces = /[\s]*,[\s]*/,
    hsrg = {hs: 1, rg: 1},
    pathCommand = /([a-z])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/ig,
    tCommand = /([rstm])[\s,]*((-?\d*\.?\d*(?:e[\-+]?\d+)?[\s]*,?[\s]*)+)/ig,
    pathValues = /(-?\d*\.?\d*(?:e[\-+]?\d+)?)[\s]*,?[\s]*/ig,
    idgen = 0,
    idprefix = "S" + (+new Date).toString(36),
    ID = function (el) {
        return (el && el.type ? el.type : E) + idprefix + (idgen++).toString(36);
    },
    xlink = "http://www.w3.org/1999/xlink",
    xmlns = "http://www.w3.org/2000/svg",
    hub = {},
    /*\
     * Snap.url
     [ method ]
     **
     * Wraps path into `"url('<path>')"`.
     - value (string) path
     = (string) wrapped path
    \*/
    URL = Snap.url = function (url) {
        return "url('#" + url + "')";
    };

function $(el, attr) {
    if (attr) {
        if (el == "#text") {
            el = glob.doc.createTextNode(attr.text || attr["#text"] || "");
        }
        if (el == "#comment") {
            el = glob.doc.createComment(attr.text || attr["#text"] || "");
        }
        if (typeof el == "string") {
            el = $(el);
        }
        if (typeof attr == "string") {
            if (el.nodeType == 1) {
                if (attr.substring(0, 6) == "xlink:") {
                    return el.getAttributeNS(xlink, attr.substring(6));
                }
                if (attr.substring(0, 4) == "xml:") {
                    return el.getAttributeNS(xmlns, attr.substring(4));
                }
                return el.getAttribute(attr);
            } else if (attr == "text") {
                return el.nodeValue;
            } else {
                return null;
            }
        }
        if (el.nodeType == 1) {
            for (var key in attr) if (attr[has](key)) {
                var val = Str(attr[key]);
                if (val) {
                    if (key.substring(0, 6) == "xlink:") {
                        el.setAttributeNS(xlink, key.substring(6), val);
                    } else if (key.substring(0, 4) == "xml:") {
                        el.setAttributeNS(xmlns, key.substring(4), val);
                    } else {
                        el.setAttribute(key, val);
                    }
                } else {
                    el.removeAttribute(key);
                }
            }
        } else if ("text" in attr) {
            el.nodeValue = attr.text;
        }
    } else {
        el = glob.doc.createElementNS(xmlns, el);
    }
    return el;
}
Snap._.$ = $;
Snap._.id = ID;
function getAttrs(el) {
    var attrs = el.attributes,
        name,
        out = {};
    for (var i = 0; i < attrs.length; i++) {
        if (attrs[i].namespaceURI == xlink) {
            name = "xlink:";
        } else {
            name = "";
        }
        name += attrs[i].name;
        out[name] = attrs[i].textContent;
    }
    return out;
}
function is(o, type) {
    type = Str.prototype.toLowerCase.call(type);
    if (type == "finite") {
        return isFinite(o);
    }
    if (type == "array" &&
        (o instanceof Array || Array.isArray && Array.isArray(o))) {
        return true;
    }
    return  type == "null" && o === null ||
            type == typeof o && o !== null ||
            type == "object" && o === Object(o) ||
            objectToString.call(o).slice(8, -1).toLowerCase() == type;
}
/*\
 * Snap.format
 [ method ]
 **
 * Replaces construction of type `{<name>}` to the corresponding argument
 **
 - token (string) string to format
 - json (object) object which properties are used as a replacement
 = (string) formatted string
 > Usage
 | // this draws a rectangular shape equivalent to "M10,20h40v50h-40z"
 | paper.path(Snap.format("M{x},{y}h{dim.width}v{dim.height}h{dim['negative width']}z", {
 |     x: 10,
 |     y: 20,
 |     dim: {
 |         width: 40,
 |         height: 50,
 |         "negative width": -40
 |     }
 | }));
\*/
Snap.format = (function () {
    var tokenRegex = /\{([^\}]+)\}/g,
        objNotationRegex = /(?:(?:^|\.)(.+?)(?=\[|\.|$|\()|\[('|")(.+?)\2\])(\(\))?/g, // matches .xxxxx or ["xxxxx"] to run over object properties
        replacer = function (all, key, obj) {
            var res = obj;
            key.replace(objNotationRegex, function (all, name, quote, quotedName, isFunc) {
                name = name || quotedName;
                if (res) {
                    if (name in res) {
                        res = res[name];
                    }
                    typeof res == "function" && isFunc && (res = res());
                }
            });
            res = (res == null || res == obj ? all : res) + "";
            return res;
        };
    return function (str, obj) {
        return Str(str).replace(tokenRegex, function (all, key) {
            return replacer(all, key, obj);
        });
    };
})();
function clone(obj) {
    if (typeof obj == "function" || Object(obj) !== obj) {
        return obj;
    }
    var res = new obj.constructor;
    for (var key in obj) if (obj[has](key)) {
        res[key] = clone(obj[key]);
    }
    return res;
}
Snap._.clone = clone;
function repush(array, item) {
    for (var i = 0, ii = array.length; i < ii; i++) if (array[i] === item) {
        return array.push(array.splice(i, 1)[0]);
    }
}
function cacher(f, scope, postprocessor) {
    function newf() {
        var arg = Array.prototype.slice.call(arguments, 0),
            args = arg.join("\u2400"),
            cache = newf.cache = newf.cache || {},
            count = newf.count = newf.count || [];
        if (cache[has](args)) {
            repush(count, args);
            return postprocessor ? postprocessor(cache[args]) : cache[args];
        }
        count.length >= 1e3 && delete cache[count.shift()];
        count.push(args);
        cache[args] = f.apply(scope, arg);
        return postprocessor ? postprocessor(cache[args]) : cache[args];
    }
    return newf;
}
Snap._.cacher = cacher;
function angle(x1, y1, x2, y2, x3, y3) {
    if (x3 == null) {
        var x = x1 - x2,
            y = y1 - y2;
        if (!x && !y) {
            return 0;
        }
        return (180 + math.atan2(-y, -x) * 180 / PI + 360) % 360;
    } else {
        return angle(x1, y1, x3, y3) - angle(x2, y2, x3, y3);
    }
}
function rad(deg) {
    return deg % 360 * PI / 180;
}
function deg(rad) {
    return rad * 180 / PI % 360;
}
function x_y() {
    return this.x + S + this.y;
}
function x_y_w_h() {
    return this.x + S + this.y + S + this.width + " \xd7 " + this.height;
}

/*\
 * Snap.rad
 [ method ]
 **
 * Transform angle to radians
 - deg (number) angle in degrees
 = (number) angle in radians
\*/
Snap.rad = rad;
/*\
 * Snap.deg
 [ method ]
 **
 * Transform angle to degrees
 - rad (number) angle in radians
 = (number) angle in degrees
\*/
Snap.deg = deg;
/*\
 * Snap.sin
 [ method ]
 **
 * Equivalent to `Math.sin()` only works with degrees, not radians.
 - angle (number) angle in degrees
 = (number) sin
\*/
Snap.sin = function (angle) {
    return math.sin(Snap.rad(angle));
};
/*\
 * Snap.tan
 [ method ]
 **
 * Equivalent to `Math.tan()` only works with degrees, not radians.
 - angle (number) angle in degrees
 = (number) tan
\*/
Snap.tan = function (angle) {
    return math.tan(Snap.rad(angle));
};
/*\
 * Snap.cos
 [ method ]
 **
 * Equivalent to `Math.cos()` only works with degrees, not radians.
 - angle (number) angle in degrees
 = (number) cos
\*/
Snap.cos = function (angle) {
    return math.cos(Snap.rad(angle));
};
/*\
 * Snap.asin
 [ method ]
 **
 * Equivalent to `Math.asin()` only works with degrees, not radians.
 - num (number) value
 = (number) asin in degrees
\*/
Snap.asin = function (num) {
    return Snap.deg(math.asin(num));
};
/*\
 * Snap.acos
 [ method ]
 **
 * Equivalent to `Math.acos()` only works with degrees, not radians.
 - num (number) value
 = (number) acos in degrees
\*/
Snap.acos = function (num) {
    return Snap.deg(math.acos(num));
};
/*\
 * Snap.atan
 [ method ]
 **
 * Equivalent to `Math.atan()` only works with degrees, not radians.
 - num (number) value
 = (number) atan in degrees
\*/
Snap.atan = function (num) {
    return Snap.deg(math.atan(num));
};
/*\
 * Snap.atan2
 [ method ]
 **
 * Equivalent to `Math.atan2()` only works with degrees, not radians.
 - num (number) value
 = (number) atan2 in degrees
\*/
Snap.atan2 = function (num) {
    return Snap.deg(math.atan2(num));
};
/*\
 * Snap.angle
 [ method ]
 **
 * Returns an angle between two or three points
 - x1 (number) x coord of first point
 - y1 (number) y coord of first point
 - x2 (number) x coord of second point
 - y2 (number) y coord of second point
 - x3 (number) #optional x coord of third point
 - y3 (number) #optional y coord of third point
 = (number) angle in degrees
\*/
Snap.angle = angle;
/*\
 * Snap.len
 [ method ]
 **
 * Returns distance between two points
 - x1 (number) x coord of first point
 - y1 (number) y coord of first point
 - x2 (number) x coord of second point
 - y2 (number) y coord of second point
 = (number) distance
\*/
Snap.len = function (x1, y1, x2, y2) {
    return Math.sqrt(Snap.len2(x1, y1, x2, y2));
};
/*\
 * Snap.len2
 [ method ]
 **
 * Returns squared distance between two points
 - x1 (number) x coord of first point
 - y1 (number) y coord of first point
 - x2 (number) x coord of second point
 - y2 (number) y coord of second point
 = (number) distance
\*/
Snap.len2 = function (x1, y1, x2, y2) {
    return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
};
/*\
 * Snap.closestPoint
 [ method ]
 **
 * Returns closest point to a given one on a given path.
 - path (Element) path element
 - x (number) x coord of a point
 - y (number) y coord of a point
 = (object) in format
 {
    x (number) x coord of the point on the path
    y (number) y coord of the point on the path
    length (number) length of the path to the point
    distance (number) distance from the given point to the path
 }
\*/
// Copied from http://bl.ocks.org/mbostock/8027637
Snap.closestPoint = function (path, x, y) {
    function distance2(p) {
        var dx = p.x - x,
            dy = p.y - y;
        return dx * dx + dy * dy;
    }
    var pathNode = path.node,
        pathLength = pathNode.getTotalLength(),
        precision = pathLength / pathNode.pathSegList.numberOfItems * .125,
        best,
        bestLength,
        bestDistance = Infinity;

    // linear scan for coarse approximation
    for (var scan, scanLength = 0, scanDistance; scanLength <= pathLength; scanLength += precision) {
        if ((scanDistance = distance2(scan = pathNode.getPointAtLength(scanLength))) < bestDistance) {
            best = scan;
            bestLength = scanLength;
            bestDistance = scanDistance;
        }
    }

    // binary search for precise estimate
    precision *= .5;
    while (precision > .5) {
        var before,
            after,
            beforeLength,
            afterLength,
            beforeDistance,
            afterDistance;
        if ((beforeLength = bestLength - precision) >= 0 && (beforeDistance = distance2(before = pathNode.getPointAtLength(beforeLength))) < bestDistance) {
            best = before;
            bestLength = beforeLength;
            bestDistance = beforeDistance;
        } else if ((afterLength = bestLength + precision) <= pathLength && (afterDistance = distance2(after = pathNode.getPointAtLength(afterLength))) < bestDistance) {
            best = after;
            bestLength = afterLength;
            bestDistance = afterDistance;
        } else {
            precision *= .5;
        }
    }

    best = {
        x: best.x,
        y: best.y,
        length: bestLength,
        distance: Math.sqrt(bestDistance)
    };
    return best;
}
/*\
 * Snap.is
 [ method ]
 **
 * Handy replacement for the `typeof` operator
 - o (…) any object or primitive
 - type (string) name of the type, e.g., `string`, `function`, `number`, etc.
 = (boolean) `true` if given value is of given type
\*/
Snap.is = is;
/*\
 * Snap.snapTo
 [ method ]
 **
 * Snaps given value to given grid
 - values (array|number) given array of values or step of the grid
 - value (number) value to adjust
 - tolerance (number) #optional maximum distance to the target value that would trigger the snap. Default is `10`.
 = (number) adjusted value
\*/
Snap.snapTo = function (values, value, tolerance) {
    tolerance = is(tolerance, "finite") ? tolerance : 10;
    if (is(values, "array")) {
        var i = values.length;
        while (i--) if (abs(values[i] - value) <= tolerance) {
            return values[i];
        }
    } else {
        values = +values;
        var rem = value % values;
        if (rem < tolerance) {
            return value - rem;
        }
        if (rem > values - tolerance) {
            return value - rem + values;
        }
    }
    return value;
};
// Colour
/*\
 * Snap.getRGB
 [ method ]
 **
 * Parses color string as RGB object
 - color (string) color string in one of the following formats:
 # <ul>
 #     <li>Color name (<code>red</code>, <code>green</code>, <code>cornflowerblue</code>, etc)</li>
 #     <li>#••• — shortened HTML color: (<code>#000</code>, <code>#fc0</code>, etc.)</li>
 #     <li>#•••••• — full length HTML color: (<code>#000000</code>, <code>#bd2300</code>)</li>
 #     <li>rgb(•••, •••, •••) — red, green and blue channels values: (<code>rgb(200,&nbsp;100,&nbsp;0)</code>)</li>
 #     <li>rgba(•••, •••, •••, •••) — also with opacity</li>
 #     <li>rgb(•••%, •••%, •••%) — same as above, but in %: (<code>rgb(100%,&nbsp;175%,&nbsp;0%)</code>)</li>
 #     <li>rgba(•••%, •••%, •••%, •••%) — also with opacity</li>
 #     <li>hsb(•••, •••, •••) — hue, saturation and brightness values: (<code>hsb(0.5,&nbsp;0.25,&nbsp;1)</code>)</li>
 #     <li>hsba(•••, •••, •••, •••) — also with opacity</li>
 #     <li>hsb(•••%, •••%, •••%) — same as above, but in %</li>
 #     <li>hsba(•••%, •••%, •••%, •••%) — also with opacity</li>
 #     <li>hsl(•••, •••, •••) — hue, saturation and luminosity values: (<code>hsb(0.5,&nbsp;0.25,&nbsp;0.5)</code>)</li>
 #     <li>hsla(•••, •••, •••, •••) — also with opacity</li>
 #     <li>hsl(•••%, •••%, •••%) — same as above, but in %</li>
 #     <li>hsla(•••%, •••%, •••%, •••%) — also with opacity</li>
 # </ul>
 * Note that `%` can be used any time: `rgb(20%, 255, 50%)`.
 = (object) RGB object in the following format:
 o {
 o     r (number) red,
 o     g (number) green,
 o     b (number) blue,
 o     hex (string) color in HTML/CSS format: #••••••,
 o     error (boolean) true if string can't be parsed
 o }
\*/
Snap.getRGB = cacher(function (colour) {
    if (!colour || !!((colour = Str(colour)).indexOf("-") + 1)) {
        return {r: -1, g: -1, b: -1, hex: "none", error: 1, toString: rgbtoString};
    }
    if (colour == "none") {
        return {r: -1, g: -1, b: -1, hex: "none", toString: rgbtoString};
    }
    !(hsrg[has](colour.toLowerCase().substring(0, 2)) || colour.charAt() == "#") && (colour = toHex(colour));
    if (!colour) {
        return {r: -1, g: -1, b: -1, hex: "none", error: 1, toString: rgbtoString};
    }
    var res,
        red,
        green,
        blue,
        opacity,
        t,
        values,
        rgb = colour.match(colourRegExp);
    if (rgb) {
        if (rgb[2]) {
            blue = toInt(rgb[2].substring(5), 16);
            green = toInt(rgb[2].substring(3, 5), 16);
            red = toInt(rgb[2].substring(1, 3), 16);
        }
        if (rgb[3]) {
            blue = toInt((t = rgb[3].charAt(3)) + t, 16);
            green = toInt((t = rgb[3].charAt(2)) + t, 16);
            red = toInt((t = rgb[3].charAt(1)) + t, 16);
        }
        if (rgb[4]) {
            values = rgb[4].split(commaSpaces);
            red = toFloat(values[0]);
            values[0].slice(-1) == "%" && (red *= 2.55);
            green = toFloat(values[1]);
            values[1].slice(-1) == "%" && (green *= 2.55);
            blue = toFloat(values[2]);
            values[2].slice(-1) == "%" && (blue *= 2.55);
            rgb[1].toLowerCase().slice(0, 4) == "rgba" && (opacity = toFloat(values[3]));
            values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
        }
        if (rgb[5]) {
            values = rgb[5].split(commaSpaces);
            red = toFloat(values[0]);
            values[0].slice(-1) == "%" && (red /= 100);
            green = toFloat(values[1]);
            values[1].slice(-1) == "%" && (green /= 100);
            blue = toFloat(values[2]);
            values[2].slice(-1) == "%" && (blue /= 100);
            (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
            rgb[1].toLowerCase().slice(0, 4) == "hsba" && (opacity = toFloat(values[3]));
            values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
            return Snap.hsb2rgb(red, green, blue, opacity);
        }
        if (rgb[6]) {
            values = rgb[6].split(commaSpaces);
            red = toFloat(values[0]);
            values[0].slice(-1) == "%" && (red /= 100);
            green = toFloat(values[1]);
            values[1].slice(-1) == "%" && (green /= 100);
            blue = toFloat(values[2]);
            values[2].slice(-1) == "%" && (blue /= 100);
            (values[0].slice(-3) == "deg" || values[0].slice(-1) == "\xb0") && (red /= 360);
            rgb[1].toLowerCase().slice(0, 4) == "hsla" && (opacity = toFloat(values[3]));
            values[3] && values[3].slice(-1) == "%" && (opacity /= 100);
            return Snap.hsl2rgb(red, green, blue, opacity);
        }
        red = mmin(math.round(red), 255);
        green = mmin(math.round(green), 255);
        blue = mmin(math.round(blue), 255);
        opacity = mmin(mmax(opacity, 0), 1);
        rgb = {r: red, g: green, b: blue, toString: rgbtoString};
        rgb.hex = "#" + (16777216 | blue | green << 8 | red << 16).toString(16).slice(1);
        rgb.opacity = is(opacity, "finite") ? opacity : 1;
        return rgb;
    }
    return {r: -1, g: -1, b: -1, hex: "none", error: 1, toString: rgbtoString};
}, Snap);
/*\
 * Snap.hsb
 [ method ]
 **
 * Converts HSB values to a hex representation of the color
 - h (number) hue
 - s (number) saturation
 - b (number) value or brightness
 = (string) hex representation of the color
\*/
Snap.hsb = cacher(function (h, s, b) {
    return Snap.hsb2rgb(h, s, b).hex;
});
/*\
 * Snap.hsl
 [ method ]
 **
 * Converts HSL values to a hex representation of the color
 - h (number) hue
 - s (number) saturation
 - l (number) luminosity
 = (string) hex representation of the color
\*/
Snap.hsl = cacher(function (h, s, l) {
    return Snap.hsl2rgb(h, s, l).hex;
});
/*\
 * Snap.rgb
 [ method ]
 **
 * Converts RGB values to a hex representation of the color
 - r (number) red
 - g (number) green
 - b (number) blue
 = (string) hex representation of the color
\*/
Snap.rgb = cacher(function (r, g, b, o) {
    if (is(o, "finite")) {
        var round = math.round;
        return "rgba(" + [round(r), round(g), round(b), +o.toFixed(2)] + ")";
    }
    return "#" + (16777216 | b | g << 8 | r << 16).toString(16).slice(1);
});
var toHex = function (color) {
    var i = glob.doc.getElementsByTagName("head")[0] || glob.doc.getElementsByTagName("svg")[0],
        red = "rgb(255, 0, 0)";
    toHex = cacher(function (color) {
        if (color.toLowerCase() == "red") {
            return red;
        }
        i.style.color = red;
        i.style.color = color;
        var out = glob.doc.defaultView.getComputedStyle(i, E).getPropertyValue("color");
        return out == red ? null : out;
    });
    return toHex(color);
},
hsbtoString = function () {
    return "hsb(" + [this.h, this.s, this.b] + ")";
},
hsltoString = function () {
    return "hsl(" + [this.h, this.s, this.l] + ")";
},
rgbtoString = function () {
    return this.opacity == 1 || this.opacity == null ?
            this.hex :
            "rgba(" + [this.r, this.g, this.b, this.opacity] + ")";
},
prepareRGB = function (r, g, b) {
    if (g == null && is(r, "object") && "r" in r && "g" in r && "b" in r) {
        b = r.b;
        g = r.g;
        r = r.r;
    }
    if (g == null && is(r, string)) {
        var clr = Snap.getRGB(r);
        r = clr.r;
        g = clr.g;
        b = clr.b;
    }
    if (r > 1 || g > 1 || b > 1) {
        r /= 255;
        g /= 255;
        b /= 255;
    }

    return [r, g, b];
},
packageRGB = function (r, g, b, o) {
    r = math.round(r * 255);
    g = math.round(g * 255);
    b = math.round(b * 255);
    var rgb = {
        r: r,
        g: g,
        b: b,
        opacity: is(o, "finite") ? o : 1,
        hex: Snap.rgb(r, g, b),
        toString: rgbtoString
    };
    is(o, "finite") && (rgb.opacity = o);
    return rgb;
};
/*\
 * Snap.color
 [ method ]
 **
 * Parses the color string and returns an object featuring the color's component values
 - clr (string) color string in one of the supported formats (see @Snap.getRGB)
 = (object) Combined RGB/HSB object in the following format:
 o {
 o     r (number) red,
 o     g (number) green,
 o     b (number) blue,
 o     hex (string) color in HTML/CSS format: #••••••,
 o     error (boolean) `true` if string can't be parsed,
 o     h (number) hue,
 o     s (number) saturation,
 o     v (number) value (brightness),
 o     l (number) lightness
 o }
\*/
Snap.color = function (clr) {
    var rgb;
    if (is(clr, "object") && "h" in clr && "s" in clr && "b" in clr) {
        rgb = Snap.hsb2rgb(clr);
        clr.r = rgb.r;
        clr.g = rgb.g;
        clr.b = rgb.b;
        clr.opacity = 1;
        clr.hex = rgb.hex;
    } else if (is(clr, "object") && "h" in clr && "s" in clr && "l" in clr) {
        rgb = Snap.hsl2rgb(clr);
        clr.r = rgb.r;
        clr.g = rgb.g;
        clr.b = rgb.b;
        clr.opacity = 1;
        clr.hex = rgb.hex;
    } else {
        if (is(clr, "string")) {
            clr = Snap.getRGB(clr);
        }
        if (is(clr, "object") && "r" in clr && "g" in clr && "b" in clr && !("error" in clr)) {
            rgb = Snap.rgb2hsl(clr);
            clr.h = rgb.h;
            clr.s = rgb.s;
            clr.l = rgb.l;
            rgb = Snap.rgb2hsb(clr);
            clr.v = rgb.b;
        } else {
            clr = {hex: "none"};
            clr.r = clr.g = clr.b = clr.h = clr.s = clr.v = clr.l = -1;
            clr.error = 1;
        }
    }
    clr.toString = rgbtoString;
    return clr;
};
/*\
 * Snap.hsb2rgb
 [ method ]
 **
 * Converts HSB values to an RGB object
 - h (number) hue
 - s (number) saturation
 - v (number) value or brightness
 = (object) RGB object in the following format:
 o {
 o     r (number) red,
 o     g (number) green,
 o     b (number) blue,
 o     hex (string) color in HTML/CSS format: #••••••
 o }
\*/
Snap.hsb2rgb = function (h, s, v, o) {
    if (is(h, "object") && "h" in h && "s" in h && "b" in h) {
        v = h.b;
        s = h.s;
        o = h.o;
        h = h.h;
    }
    h *= 360;
    var R, G, B, X, C;
    h = h % 360 / 60;
    C = v * s;
    X = C * (1 - abs(h % 2 - 1));
    R = G = B = v - C;

    h = ~~h;
    R += [C, X, 0, 0, X, C][h];
    G += [X, C, C, X, 0, 0][h];
    B += [0, 0, X, C, C, X][h];
    return packageRGB(R, G, B, o);
};
/*\
 * Snap.hsl2rgb
 [ method ]
 **
 * Converts HSL values to an RGB object
 - h (number) hue
 - s (number) saturation
 - l (number) luminosity
 = (object) RGB object in the following format:
 o {
 o     r (number) red,
 o     g (number) green,
 o     b (number) blue,
 o     hex (string) color in HTML/CSS format: #••••••
 o }
\*/
Snap.hsl2rgb = function (h, s, l, o) {
    if (is(h, "object") && "h" in h && "s" in h && "l" in h) {
        l = h.l;
        s = h.s;
        h = h.h;
    }
    if (h > 1 || s > 1 || l > 1) {
        h /= 360;
        s /= 100;
        l /= 100;
    }
    h *= 360;
    var R, G, B, X, C;
    h = h % 360 / 60;
    C = 2 * s * (l < .5 ? l : 1 - l);
    X = C * (1 - abs(h % 2 - 1));
    R = G = B = l - C / 2;

    h = ~~h;
    R += [C, X, 0, 0, X, C][h];
    G += [X, C, C, X, 0, 0][h];
    B += [0, 0, X, C, C, X][h];
    return packageRGB(R, G, B, o);
};
/*\
 * Snap.rgb2hsb
 [ method ]
 **
 * Converts RGB values to an HSB object
 - r (number) red
 - g (number) green
 - b (number) blue
 = (object) HSB object in the following format:
 o {
 o     h (number) hue,
 o     s (number) saturation,
 o     b (number) brightness
 o }
\*/
Snap.rgb2hsb = function (r, g, b) {
    b = prepareRGB(r, g, b);
    r = b[0];
    g = b[1];
    b = b[2];

    var H, S, V, C;
    V = mmax(r, g, b);
    C = V - mmin(r, g, b);
    H = C == 0 ? null :
        V == r ? (g - b) / C :
        V == g ? (b - r) / C + 2 :
                 (r - g) / C + 4;
    H = (H + 360) % 6 * 60 / 360;
    S = C == 0 ? 0 : C / V;
    return {h: H, s: S, b: V, toString: hsbtoString};
};
/*\
 * Snap.rgb2hsl
 [ method ]
 **
 * Converts RGB values to an HSL object
 - r (number) red
 - g (number) green
 - b (number) blue
 = (object) HSL object in the following format:
 o {
 o     h (number) hue,
 o     s (number) saturation,
 o     l (number) luminosity
 o }
\*/
Snap.rgb2hsl = function (r, g, b) {
    b = prepareRGB(r, g, b);
    r = b[0];
    g = b[1];
    b = b[2];

    var H, S, L, M, m, C;
    M = mmax(r, g, b);
    m = mmin(r, g, b);
    C = M - m;
    H = C == 0 ? null :
        M == r ? (g - b) / C :
        M == g ? (b - r) / C + 2 :
                 (r - g) / C + 4;
    H = (H + 360) % 6 * 60 / 360;
    L = (M + m) / 2;
    S = C == 0 ? 0 :
         L < .5 ? C / (2 * L) :
                  C / (2 - 2 * L);
    return {h: H, s: S, l: L, toString: hsltoString};
};

// Transformations
/*\
 * Snap.parsePathString
 [ method ]
 **
 * Utility method
 **
 * Parses given path string into an array of arrays of path segments
 - pathString (string|array) path string or array of segments (in the last case it is returned straight away)
 = (array) array of segments
\*/
Snap.parsePathString = function (pathString) {
    if (!pathString) {
        return null;
    }
    var pth = Snap.path(pathString);
    if (pth.arr) {
        return Snap.path.clone(pth.arr);
    }

    var paramCounts = {a: 7, c: 6, o: 2, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, u: 3, z: 0},
        data = [];
    if (is(pathString, "array") && is(pathString[0], "array")) { // rough assumption
        data = Snap.path.clone(pathString);
    }
    if (!data.length) {
        Str(pathString).replace(pathCommand, function (a, b, c) {
            var params = [],
                name = b.toLowerCase();
            c.replace(pathValues, function (a, b) {
                b && params.push(+b);
            });
            if (name == "m" && params.length > 2) {
                data.push([b].concat(params.splice(0, 2)));
                name = "l";
                b = b == "m" ? "l" : "L";
            }
            if (name == "o" && params.length == 1) {
                data.push([b, params[0]]);
            }
            if (name == "r") {
                data.push([b].concat(params));
            } else while (params.length >= paramCounts[name]) {
                data.push([b].concat(params.splice(0, paramCounts[name])));
                if (!paramCounts[name]) {
                    break;
                }
            }
        });
    }
    data.toString = Snap.path.toString;
    pth.arr = Snap.path.clone(data);
    return data;
};
/*\
 * Snap.parseTransformString
 [ method ]
 **
 * Utility method
 **
 * Parses given transform string into an array of transformations
 - TString (string|array) transform string or array of transformations (in the last case it is returned straight away)
 = (array) array of transformations
\*/
var parseTransformString = Snap.parseTransformString = function (TString) {
    if (!TString) {
        return null;
    }
    var paramCounts = {r: 3, s: 4, t: 2, m: 6},
        data = [];
    if (is(TString, "array") && is(TString[0], "array")) { // rough assumption
        data = Snap.path.clone(TString);
    }
    if (!data.length) {
        Str(TString).replace(tCommand, function (a, b, c) {
            var params = [],
                name = b.toLowerCase();
            c.replace(pathValues, function (a, b) {
                b && params.push(+b);
            });
            data.push([b].concat(params));
        });
    }
    data.toString = Snap.path.toString;
    return data;
};
function svgTransform2string(tstr) {
    var res = [];
    tstr = tstr.replace(/(?:^|\s)(\w+)\(([^)]+)\)/g, function (all, name, params) {
        params = params.split(/\s*,\s*|\s+/);
        if (name == "rotate" && params.length == 1) {
            params.push(0, 0);
        }
        if (name == "scale") {
            if (params.length > 2) {
                params = params.slice(0, 2);
            } else if (params.length == 2) {
                params.push(0, 0);
            }
            if (params.length == 1) {
                params.push(params[0], 0, 0);
            }
        }
        if (name == "skewX") {
            res.push(["m", 1, 0, math.tan(rad(params[0])), 1, 0, 0]);
        } else if (name == "skewY") {
            res.push(["m", 1, math.tan(rad(params[0])), 0, 1, 0, 0]);
        } else {
            res.push([name.charAt(0)].concat(params));
        }
        return all;
    });
    return res;
}
Snap._.svgTransform2string = svgTransform2string;
Snap._.rgTransform = /^[a-z][\s]*-?\.?\d/i;
function transform2matrix(tstr, bbox) {
    var tdata = parseTransformString(tstr),
        m = new Snap.Matrix;
    if (tdata) {
        for (var i = 0, ii = tdata.length; i < ii; i++) {
            var t = tdata[i],
                tlen = t.length,
                command = Str(t[0]).toLowerCase(),
                absolute = t[0] != command,
                inver = absolute ? m.invert() : 0,
                x1,
                y1,
                x2,
                y2,
                bb;
            if (command == "t" && tlen == 2){
                m.translate(t[1], 0);
            } else if (command == "t" && tlen == 3) {
                if (absolute) {
                    x1 = inver.x(0, 0);
                    y1 = inver.y(0, 0);
                    x2 = inver.x(t[1], t[2]);
                    y2 = inver.y(t[1], t[2]);
                    m.translate(x2 - x1, y2 - y1);
                } else {
                    m.translate(t[1], t[2]);
                }
            } else if (command == "r") {
                if (tlen == 2) {
                    bb = bb || bbox;
                    m.rotate(t[1], bb.x + bb.width / 2, bb.y + bb.height / 2);
                } else if (tlen == 4) {
                    if (absolute) {
                        x2 = inver.x(t[2], t[3]);
                        y2 = inver.y(t[2], t[3]);
                        m.rotate(t[1], x2, y2);
                    } else {
                        m.rotate(t[1], t[2], t[3]);
                    }
                }
            } else if (command == "s") {
                if (tlen == 2 || tlen == 3) {
                    bb = bb || bbox;
                    m.scale(t[1], t[tlen - 1], bb.x + bb.width / 2, bb.y + bb.height / 2);
                } else if (tlen == 4) {
                    if (absolute) {
                        x2 = inver.x(t[2], t[3]);
                        y2 = inver.y(t[2], t[3]);
                        m.scale(t[1], t[1], x2, y2);
                    } else {
                        m.scale(t[1], t[1], t[2], t[3]);
                    }
                } else if (tlen == 5) {
                    if (absolute) {
                        x2 = inver.x(t[3], t[4]);
                        y2 = inver.y(t[3], t[4]);
                        m.scale(t[1], t[2], x2, y2);
                    } else {
                        m.scale(t[1], t[2], t[3], t[4]);
                    }
                }
            } else if (command == "m" && tlen == 7) {
                m.add(t[1], t[2], t[3], t[4], t[5], t[6]);
            }
        }
    }
    return m;
}
Snap._.transform2matrix = transform2matrix;
Snap._unit2px = unit2px;
var contains = glob.doc.contains || glob.doc.compareDocumentPosition ?
    function (a, b) {
        var adown = a.nodeType == 9 ? a.documentElement : a,
            bup = b && b.parentNode;
            return a == bup || !!(bup && bup.nodeType == 1 && (
                adown.contains ?
                    adown.contains(bup) :
                    a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16
            ));
    } :
    function (a, b) {
        if (b) {
            while (b) {
                b = b.parentNode;
                if (b == a) {
                    return true;
                }
            }
        }
        return false;
    };
function getSomeDefs(el) {
    var p = el.node.ownerSVGElement && wrap(el.node.ownerSVGElement) ||
            el.node.parentNode && wrap(el.node.parentNode) ||
            Snap.select("svg") ||
            Snap(0, 0),
        pdefs = p.select("defs"),
        defs  = pdefs == null ? false : pdefs.node;
    if (!defs) {
        defs = make("defs", p.node).node;
    }
    return defs;
}
function getSomeSVG(el) {
    return el.node.ownerSVGElement && wrap(el.node.ownerSVGElement) || Snap.select("svg");
}
Snap._.getSomeDefs = getSomeDefs;
Snap._.getSomeSVG = getSomeSVG;
function unit2px(el, name, value) {
    var svg = getSomeSVG(el).node,
        out = {},
        mgr = svg.querySelector(".svg---mgr");
    if (!mgr) {
        mgr = $("rect");
        $(mgr, {x: -9e9, y: -9e9, width: 10, height: 10, "class": "svg---mgr", fill: "none"});
        svg.appendChild(mgr);
    }
    function getW(val) {
        if (val == null) {
            return E;
        }
        if (val == +val) {
            return val;
        }
        $(mgr, {width: val});
        try {
            return mgr.getBBox().width;
        } catch (e) {
            return 0;
        }
    }
    function getH(val) {
        if (val == null) {
            return E;
        }
        if (val == +val) {
            return val;
        }
        $(mgr, {height: val});
        try {
            return mgr.getBBox().height;
        } catch (e) {
            return 0;
        }
    }
    function set(nam, f) {
        if (name == null) {
            out[nam] = f(el.attr(nam) || 0);
        } else if (nam == name) {
            out = f(value == null ? el.attr(nam) || 0 : value);
        }
    }
    switch (el.type) {
        case "rect":
            set("rx", getW);
            set("ry", getH);
        case "image":
            set("width", getW);
            set("height", getH);
        case "text":
            set("x", getW);
            set("y", getH);
        break;
        case "circle":
            set("cx", getW);
            set("cy", getH);
            set("r", getW);
        break;
        case "ellipse":
            set("cx", getW);
            set("cy", getH);
            set("rx", getW);
            set("ry", getH);
        break;
        case "line":
            set("x1", getW);
            set("x2", getW);
            set("y1", getH);
            set("y2", getH);
        break;
        case "marker":
            set("refX", getW);
            set("markerWidth", getW);
            set("refY", getH);
            set("markerHeight", getH);
        break;
        case "radialGradient":
            set("fx", getW);
            set("fy", getH);
        break;
        case "tspan":
            set("dx", getW);
            set("dy", getH);
        break;
        default:
            set(name, getW);
    }
    svg.removeChild(mgr);
    return out;
}
/*\
 * Snap.select
 [ method ]
 **
 * Wraps a DOM element specified by CSS selector as @Element
 - query (string) CSS selector of the element
 = (Element) the current element
\*/
Snap.select = function (query) {
    query = Str(query).replace(/([^\\]):/g, "$1\\:");
    return wrap(glob.doc.querySelector(query));
};
/*\
 * Snap.selectAll
 [ method ]
 **
 * Wraps DOM elements specified by CSS selector as set or array of @Element
 - query (string) CSS selector of the element
 = (Element) the current element
\*/
Snap.selectAll = function (query) {
    var nodelist = glob.doc.querySelectorAll(query),
        set = (Snap.set || Array)();
    for (var i = 0; i < nodelist.length; i++) {
        set.push(wrap(nodelist[i]));
    }
    return set;
};

function add2group(list) {
    if (!is(list, "array")) {
        list = Array.prototype.slice.call(arguments, 0);
    }
    var i = 0,
        j = 0,
        node = this.node;
    while (this[i]) delete this[i++];
    for (i = 0; i < list.length; i++) {
        if (list[i].type == "set") {
            list[i].forEach(function (el) {
                node.appendChild(el.node);
            });
        } else {
            node.appendChild(list[i].node);
        }
    }
    var children = node.childNodes;
    for (i = 0; i < children.length; i++) {
        this[j++] = wrap(children[i]);
    }
    return this;
}
// Hub garbage collector every 10s
setInterval(function () {
    for (var key in hub) if (hub[has](key)) {
        var el = hub[key],
            node = el.node;
        if (el.type != "svg" && !node.ownerSVGElement || el.type == "svg" && (!node.parentNode || "ownerSVGElement" in node.parentNode && !node.ownerSVGElement)) {
            delete hub[key];
        }
    }
}, 1e4);
function Element(el) {
    if (el.snap in hub) {
        return hub[el.snap];
    }
    var svg;
    try {
        svg = el.ownerSVGElement;
    } catch(e) {}
    /*\
     * Element.node
     [ property (object) ]
     **
     * Gives you a reference to the DOM object, so you can assign event handlers or just mess around.
     > Usage
     | // draw a circle at coordinate 10,10 with radius of 10
     | var c = paper.circle(10, 10, 10);
     | c.node.onclick = function () {
     |     c.attr("fill", "red");
     | };
    \*/
    this.node = el;
    if (svg) {
        this.paper = new Paper(svg);
    }
    /*\
     * Element.type
     [ property (string) ]
     **
     * SVG tag name of the given element.
    \*/
    this.type = el.tagName || el.nodeName;
    var id = this.id = ID(this);
    this.anims = {};
    this._ = {
        transform: []
    };
    el.snap = id;
    hub[id] = this;
    if (this.type == "g") {
        this.add = add2group;
    }
    if (this.type in {g: 1, mask: 1, pattern: 1, symbol: 1}) {
        for (var method in Paper.prototype) if (Paper.prototype[has](method)) {
            this[method] = Paper.prototype[method];
        }
    }
}
   /*\
     * Element.attr
     [ method ]
     **
     * Gets or sets given attributes of the element.
     **
     - params (object) contains key-value pairs of attributes you want to set
     * or
     - param (string) name of the attribute
     = (Element) the current element
     * or
     = (string) value of attribute
     > Usage
     | el.attr({
     |     fill: "#fc0",
     |     stroke: "#000",
     |     strokeWidth: 2, // CamelCase...
     |     "fill-opacity": 0.5, // or dash-separated names
     |     width: "*=2" // prefixed values
     | });
     | console.log(el.attr("fill")); // #fc0
     * Prefixed values in format `"+=10"` supported. All four operations
     * (`+`, `-`, `*` and `/`) could be used. Optionally you can use units for `+`
     * and `-`: `"+=2em"`.
    \*/
    Element.prototype.attr = function (params, value) {
        var el = this,
            node = el.node;
        if (!params) {
            if (node.nodeType != 1) {
                return {
                    text: node.nodeValue
                };
            }
            var attr = node.attributes,
                out = {};
            for (var i = 0, ii = attr.length; i < ii; i++) {
                out[attr[i].nodeName] = attr[i].nodeValue;
            }
            return out;
        }
        if (is(params, "string")) {
            if (arguments.length > 1) {
                var json = {};
                json[params] = value;
                params = json;
            } else {
                return eve("snap.util.getattr." + params, el).firstDefined();
            }
        }
        for (var att in params) {
            if (params[has](att)) {
                eve("snap.util.attr." + att, el, params[att]);
            }
        }
        return el;
    };
/*\
 * Snap.parse
 [ method ]
 **
 * Parses SVG fragment and converts it into a @Fragment
 **
 - svg (string) SVG string
 = (Fragment) the @Fragment
\*/
Snap.parse = function (svg) {
    var f = glob.doc.createDocumentFragment(),
        full = true,
        div = glob.doc.createElement("div");
    svg = Str(svg);
    if (!svg.match(/^\s*<\s*svg(?:\s|>)/)) {
        svg = "<svg>" + svg + "</svg>";
        full = false;
    }
    div.innerHTML = svg;
    svg = div.getElementsByTagName("svg")[0];
    if (svg) {
        if (full) {
            f = svg;
        } else {
            while (svg.firstChild) {
                f.appendChild(svg.firstChild);
            }
        }
    }
    return new Fragment(f);
};
function Fragment(frag) {
    this.node = frag;
}
/*\
 * Snap.fragment
 [ method ]
 **
 * Creates a DOM fragment from a given list of elements or strings
 **
 - varargs (…) SVG string
 = (Fragment) the @Fragment
\*/
Snap.fragment = function () {
    var args = Array.prototype.slice.call(arguments, 0),
        f = glob.doc.createDocumentFragment();
    for (var i = 0, ii = args.length; i < ii; i++) {
        var item = args[i];
        if (item.node && item.node.nodeType) {
            f.appendChild(item.node);
        }
        if (item.nodeType) {
            f.appendChild(item);
        }
        if (typeof item == "string") {
            f.appendChild(Snap.parse(item).node);
        }
    }
    return new Fragment(f);
};

function make(name, parent) {
    var res = $(name);
    parent.appendChild(res);
    var el = wrap(res);
    return el;
}
function Paper(w, h) {
    var res,
        desc,
        defs,
        proto = Paper.prototype;
    if (w && w.tagName && w.tagName.toLowerCase() == "svg") {
        if (w.snap in hub) {
            return hub[w.snap];
        }
        var doc = w.ownerDocument;
        res = new Element(w);
        desc = w.getElementsByTagName("desc")[0];
        defs = w.getElementsByTagName("defs")[0];
        if (!desc) {
            desc = $("desc");
            desc.appendChild(doc.createTextNode("Created with Snap"));
            res.node.appendChild(desc);
        }
        if (!defs) {
            defs = $("defs");
            res.node.appendChild(defs);
        }
        res.defs = defs;
        for (var key in proto) if (proto[has](key)) {
            res[key] = proto[key];
        }
        res.paper = res.root = res;
    } else {
        res = make("svg", glob.doc.body);
        $(res.node, {
            height: h,
            version: 1.1,
            width: w,
            xmlns: xmlns
        });
    }
    return res;
}
function wrap(dom) {
    if (!dom) {
        return dom;
    }
    if (dom instanceof Element || dom instanceof Fragment) {
        return dom;
    }
    if (dom.tagName && dom.tagName.toLowerCase() == "svg") {
        return new Paper(dom);
    }
    if (dom.tagName && dom.tagName.toLowerCase() == "object" && dom.type == "image/svg+xml") {
        return new Paper(dom.contentDocument.getElementsByTagName("svg")[0]);
    }
    return new Element(dom);
}

Snap._.make = make;
Snap._.wrap = wrap;
/*\
 * Paper.el
 [ method ]
 **
 * Creates an element on paper with a given name and no attributes
 **
 - name (string) tag name
 - attr (object) attributes
 = (Element) the current element
 > Usage
 | var c = paper.circle(10, 10, 10); // is the same as...
 | var c = paper.el("circle").attr({
 |     cx: 10,
 |     cy: 10,
 |     r: 10
 | });
 | // and the same as
 | var c = paper.el("circle", {
 |     cx: 10,
 |     cy: 10,
 |     r: 10
 | });
\*/
Paper.prototype.el = function (name, attr) {
    var el = make(name, this.node);
    attr && el.attr(attr);
    return el;
};
/*\
 * Element.children
 [ method ]
 **
 * Returns array of all the children of the element.
 = (array) array of Elements
\*/
Element.prototype.children = function () {
    var out = [],
        ch = this.node.childNodes;
    for (var i = 0, ii = ch.length; i < ii; i++) {
        out[i] = Snap(ch[i]);
    }
    return out;
};
function jsonFiller(root, o) {
    for (var i = 0, ii = root.length; i < ii; i++) {
        var item = {
                type: root[i].type,
                attr: root[i].attr()
            },
            children = root[i].children();
        o.push(item);
        if (children.length) {
            jsonFiller(children, item.childNodes = []);
        }
    }
}
/*\
 * Element.toJSON
 [ method ]
 **
 * Returns object representation of the given element and all its children.
 = (object) in format
 o {
 o     type (string) this.type,
 o     attr (object) attributes map,
 o     childNodes (array) optional array of children in the same format
 o }
\*/
Element.prototype.toJSON = function () {
    var out = [];
    jsonFiller([this], out);
    return out[0];
};
// default
eve.on("snap.util.getattr", function () {
    var att = eve.nt();
    att = att.substring(att.lastIndexOf(".") + 1);
    var css = att.replace(/[A-Z]/g, function (letter) {
        return "-" + letter.toLowerCase();
    });
    if (cssAttr[has](css)) {
        return this.node.ownerDocument.defaultView.getComputedStyle(this.node, null).getPropertyValue(css);
    } else {
        return $(this.node, att);
    }
});
var cssAttr = {
    "alignment-baseline": 0,
    "baseline-shift": 0,
    "clip": 0,
    "clip-path": 0,
    "clip-rule": 0,
    "color": 0,
    "color-interpolation": 0,
    "color-interpolation-filters": 0,
    "color-profile": 0,
    "color-rendering": 0,
    "cursor": 0,
    "direction": 0,
    "display": 0,
    "dominant-baseline": 0,
    "enable-background": 0,
    "fill": 0,
    "fill-opacity": 0,
    "fill-rule": 0,
    "filter": 0,
    "flood-color": 0,
    "flood-opacity": 0,
    "font": 0,
    "font-family": 0,
    "font-size": 0,
    "font-size-adjust": 0,
    "font-stretch": 0,
    "font-style": 0,
    "font-variant": 0,
    "font-weight": 0,
    "glyph-orientation-horizontal": 0,
    "glyph-orientation-vertical": 0,
    "image-rendering": 0,
    "kerning": 0,
    "letter-spacing": 0,
    "lighting-color": 0,
    "marker": 0,
    "marker-end": 0,
    "marker-mid": 0,
    "marker-start": 0,
    "mask": 0,
    "opacity": 0,
    "overflow": 0,
    "pointer-events": 0,
    "shape-rendering": 0,
    "stop-color": 0,
    "stop-opacity": 0,
    "stroke": 0,
    "stroke-dasharray": 0,
    "stroke-dashoffset": 0,
    "stroke-linecap": 0,
    "stroke-linejoin": 0,
    "stroke-miterlimit": 0,
    "stroke-opacity": 0,
    "stroke-width": 0,
    "text-anchor": 0,
    "text-decoration": 0,
    "text-rendering": 0,
    "unicode-bidi": 0,
    "visibility": 0,
    "word-spacing": 0,
    "writing-mode": 0
};

eve.on("snap.util.attr", function (value) {
    var att = eve.nt(),
        attr = {};
    att = att.substring(att.lastIndexOf(".") + 1);
    attr[att] = value;
    var style = att.replace(/-(\w)/gi, function (all, letter) {
            return letter.toUpperCase();
        }),
        css = att.replace(/[A-Z]/g, function (letter) {
            return "-" + letter.toLowerCase();
        });
    if (cssAttr[has](css)) {
        this.node.style[style] = value == null ? E : value;
    } else {
        $(this.node, attr);
    }
});
(function (proto) {}(Paper.prototype));

// simple ajax
/*\
 * Snap.ajax
 [ method ]
 **
 * Simple implementation of Ajax
 **
 - url (string) URL
 - postData (object|string) data for post request
 - callback (function) callback
 - scope (object) #optional scope of callback
 * or
 - url (string) URL
 - callback (function) callback
 - scope (object) #optional scope of callback
 = (XMLHttpRequest) the XMLHttpRequest object, just in case
\*/
Snap.ajax = function (url, postData, callback, scope){
    var req = new XMLHttpRequest,
        id = ID();
    if (req) {
        if (is(postData, "function")) {
            scope = callback;
            callback = postData;
            postData = null;
        } else if (is(postData, "object")) {
            var pd = [];
            for (var key in postData) if (postData.hasOwnProperty(key)) {
                pd.push(encodeURIComponent(key) + "=" + encodeURIComponent(postData[key]));
            }
            postData = pd.join("&");
        }
        req.open(postData ? "POST" : "GET", url, true);
        if (postData) {
            req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        }
        if (callback) {
            eve.once("snap.ajax." + id + ".0", callback);
            eve.once("snap.ajax." + id + ".200", callback);
            eve.once("snap.ajax." + id + ".304", callback);
        }
        req.onreadystatechange = function() {
            if (req.readyState != 4) return;
            eve("snap.ajax." + id + "." + req.status, scope, req);
        };
        if (req.readyState == 4) {
            return req;
        }
        req.send(postData);
        return req;
    }
};
/*\
 * Snap.load
 [ method ]
 **
 * Loads external SVG file as a @Fragment (see @Snap.ajax for more advanced AJAX)
 **
 - url (string) URL
 - callback (function) callback
 - scope (object) #optional scope of callback
\*/
Snap.load = function (url, callback, scope) {
    Snap.ajax(url, function (req) {
        var f = Snap.parse(req.responseText);
        scope ? callback.call(scope, f) : callback(f);
    });
};
var getOffset = function (elem) {
    var box = elem.getBoundingClientRect(),
        doc = elem.ownerDocument,
        body = doc.body,
        docElem = doc.documentElement,
        clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
        top  = box.top  + (g.win.pageYOffset || docElem.scrollTop || body.scrollTop ) - clientTop,
        left = box.left + (g.win.pageXOffset || docElem.scrollLeft || body.scrollLeft) - clientLeft;
    return {
        y: top,
        x: left
    };
};
/*\
 * Snap.getElementByPoint
 [ method ]
 **
 * Returns you topmost element under given point.
 **
 = (object) Snap element object
 - x (number) x coordinate from the top left corner of the window
 - y (number) y coordinate from the top left corner of the window
 > Usage
 | Snap.getElementByPoint(mouseX, mouseY).attr({stroke: "#f00"});
\*/
Snap.getElementByPoint = function (x, y) {
    var paper = this,
        svg = paper.canvas,
        target = glob.doc.elementFromPoint(x, y);
    if (glob.win.opera && target.tagName == "svg") {
        var so = getOffset(target),
            sr = target.createSVGRect();
        sr.x = x - so.x;
        sr.y = y - so.y;
        sr.width = sr.height = 1;
        var hits = target.getIntersectionList(sr, null);
        if (hits.length) {
            target = hits[hits.length - 1];
        }
    }
    if (!target) {
        return null;
    }
    return wrap(target);
};
/*\
 * Snap.plugin
 [ method ]
 **
 * Let you write plugins. You pass in a function with five arguments, like this:
 | Snap.plugin(function (Snap, Element, Paper, global, Fragment) {
 |     Snap.newmethod = function () {};
 |     Element.prototype.newmethod = function () {};
 |     Paper.prototype.newmethod = function () {};
 | });
 * Inside the function you have access to all main objects (and their
 * prototypes). This allow you to extend anything you want.
 **
 - f (function) your plugin body
\*/
Snap.plugin = function (f) {
    f(Snap, Element, Paper, glob, Fragment);
};
glob.win.Snap = Snap;
return Snap;
}(window || this));

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var elproto = Element.prototype,
        is = Snap.is,
        Str = String,
        unit2px = Snap._unit2px,
        $ = Snap._.$,
        make = Snap._.make,
        getSomeDefs = Snap._.getSomeDefs,
        has = "hasOwnProperty",
        wrap = Snap._.wrap;
    /*\
     * Element.getBBox
     [ method ]
     **
     * Returns the bounding box descriptor for the given element
     **
     = (object) bounding box descriptor:
     o {
     o     cx: (number) x of the center,
     o     cy: (number) x of the center,
     o     h: (number) height,
     o     height: (number) height,
     o     path: (string) path command for the box,
     o     r0: (number) radius of a circle that fully encloses the box,
     o     r1: (number) radius of the smallest circle that can be enclosed,
     o     r2: (number) radius of the largest circle that can be enclosed,
     o     vb: (string) box as a viewbox command,
     o     w: (number) width,
     o     width: (number) width,
     o     x2: (number) x of the right side,
     o     x: (number) x of the left side,
     o     y2: (number) y of the bottom edge,
     o     y: (number) y of the top edge
     o }
    \*/
    elproto.getBBox = function (isWithoutTransform) {
        if (this.type == "tspan") {
            return Snap._.box(this.node.getClientRects().item(0));
        }
        if (!Snap.Matrix || !Snap.path) {
            return this.node.getBBox();
        }
        var el = this,
            m = new Snap.Matrix;
        if (el.removed) {
            return Snap._.box();
        }
        while (el.type == "use") {
            if (!isWithoutTransform) {
                m = m.add(el.transform().localMatrix.translate(el.attr("x") || 0, el.attr("y") || 0));
            }
            if (el.original) {
                el = el.original;
            } else {
                var href = el.attr("xlink:href");
                el = el.original = el.node.ownerDocument.getElementById(href.substring(href.indexOf("#") + 1));
            }
        }
        var _ = el._,
            pathfinder = Snap.path.get[el.type] || Snap.path.get.deflt;
        try {
            if (isWithoutTransform) {
                _.bboxwt = pathfinder ? Snap.path.getBBox(el.realPath = pathfinder(el)) : Snap._.box(el.node.getBBox());
                return Snap._.box(_.bboxwt);
            } else {
                el.realPath = pathfinder(el);
                el.matrix = el.transform().localMatrix;
                _.bbox = Snap.path.getBBox(Snap.path.map(el.realPath, m.add(el.matrix)));
                return Snap._.box(_.bbox);
            }
        } catch (e) {
            // Firefox doesn’t give you bbox of hidden element
            return Snap._.box();
        }
    };
    var propString = function () {
        return this.string;
    };
    function extractTransform(el, tstr) {
        if (tstr == null) {
            var doReturn = true;
            if (el.type == "linearGradient" || el.type == "radialGradient") {
                tstr = el.node.getAttribute("gradientTransform");
            } else if (el.type == "pattern") {
                tstr = el.node.getAttribute("patternTransform");
            } else {
                tstr = el.node.getAttribute("transform");
            }
            if (!tstr) {
                return new Snap.Matrix;
            }
            tstr = Snap._.svgTransform2string(tstr);
        } else {
            if (!Snap._.rgTransform.test(tstr)) {
                tstr = Snap._.svgTransform2string(tstr);
            } else {
                tstr = Str(tstr).replace(/\.{3}|\u2026/g, el._.transform || "");
            }
            if (is(tstr, "array")) {
                tstr = Snap.path ? Snap.path.toString.call(tstr) : Str(tstr);
            }
            el._.transform = tstr;
        }
        var m = Snap._.transform2matrix(tstr, el.getBBox(1));
        if (doReturn) {
            return m;
        } else {
            el.matrix = m;
        }
    }
    /*\
     * Element.transform
     [ method ]
     **
     * Gets or sets transformation of the element
     **
     - tstr (string) transform string in Snap or SVG format
     = (Element) the current element
     * or
     = (object) transformation descriptor:
     o {
     o     string (string) transform string,
     o     globalMatrix (Matrix) matrix of all transformations applied to element or its parents,
     o     localMatrix (Matrix) matrix of transformations applied only to the element,
     o     diffMatrix (Matrix) matrix of difference between global and local transformations,
     o     global (string) global transformation as string,
     o     local (string) local transformation as string,
     o     toString (function) returns `string` property
     o }
    \*/
    elproto.transform = function (tstr) {
        var _ = this._;
        if (tstr == null) {
            var papa = this,
                global = new Snap.Matrix(this.node.getCTM()),
                local = extractTransform(this),
                ms = [local],
                m = new Snap.Matrix,
                i,
                localString = local.toTransformString(),
                string = Str(local) == Str(this.matrix) ?
                            Str(_.transform) : localString;
            while (papa.type != "svg" && (papa = papa.parent())) {
                ms.push(extractTransform(papa));
            }
            i = ms.length;
            while (i--) {
                m.add(ms[i]);
            }
            return {
                string: string,
                globalMatrix: global,
                totalMatrix: m,
                localMatrix: local,
                diffMatrix: global.clone().add(local.invert()),
                global: global.toTransformString(),
                total: m.toTransformString(),
                local: localString,
                toString: propString
            };
        }
        if (tstr instanceof Snap.Matrix) {
            this.matrix = tstr;
            this._.transform = tstr.toTransformString();
        } else {
            extractTransform(this, tstr);
        }

        if (this.node) {
            if (this.type == "linearGradient" || this.type == "radialGradient") {
                $(this.node, {gradientTransform: this.matrix});
            } else if (this.type == "pattern") {
                $(this.node, {patternTransform: this.matrix});
            } else {
                $(this.node, {transform: this.matrix});
            }
        }

        return this;
    };
    /*\
     * Element.parent
     [ method ]
     **
     * Returns the element's parent
     **
     = (Element) the parent element
    \*/
    elproto.parent = function () {
        return wrap(this.node.parentNode);
    };
    /*\
     * Element.append
     [ method ]
     **
     * Appends the given element to current one
     **
     - el (Element|Set) element to append
     = (Element) the parent element
    \*/
    /*\
     * Element.add
     [ method ]
     **
     * See @Element.append
    \*/
    elproto.append = elproto.add = function (el) {
        if (el) {
            if (el.type == "set") {
                var it = this;
                el.forEach(function (el) {
                    it.add(el);
                });
                return this;
            }
            el = wrap(el);
            this.node.appendChild(el.node);
            el.paper = this.paper;
        }
        return this;
    };
    /*\
     * Element.appendTo
     [ method ]
     **
     * Appends the current element to the given one
     **
     - el (Element) parent element to append to
     = (Element) the child element
    \*/
    elproto.appendTo = function (el) {
        if (el) {
            el = wrap(el);
            el.append(this);
        }
        return this;
    };
    /*\
     * Element.prepend
     [ method ]
     **
     * Prepends the given element to the current one
     **
     - el (Element) element to prepend
     = (Element) the parent element
    \*/
    elproto.prepend = function (el) {
        if (el) {
            if (el.type == "set") {
                var it = this,
                    first;
                el.forEach(function (el) {
                    if (first) {
                        first.after(el);
                    } else {
                        it.prepend(el);
                    }
                    first = el;
                });
                return this;
            }
            el = wrap(el);
            var parent = el.parent();
            this.node.insertBefore(el.node, this.node.firstChild);
            this.add && this.add();
            el.paper = this.paper;
            this.parent() && this.parent().add();
            parent && parent.add();
        }
        return this;
    };
    /*\
     * Element.prependTo
     [ method ]
     **
     * Prepends the current element to the given one
     **
     - el (Element) parent element to prepend to
     = (Element) the child element
    \*/
    elproto.prependTo = function (el) {
        el = wrap(el);
        el.prepend(this);
        return this;
    };
    /*\
     * Element.before
     [ method ]
     **
     * Inserts given element before the current one
     **
     - el (Element) element to insert
     = (Element) the parent element
    \*/
    elproto.before = function (el) {
        if (el.type == "set") {
            var it = this;
            el.forEach(function (el) {
                var parent = el.parent();
                it.node.parentNode.insertBefore(el.node, it.node);
                parent && parent.add();
            });
            this.parent().add();
            return this;
        }
        el = wrap(el);
        var parent = el.parent();
        this.node.parentNode.insertBefore(el.node, this.node);
        this.parent() && this.parent().add();
        parent && parent.add();
        el.paper = this.paper;
        return this;
    };
    /*\
     * Element.after
     [ method ]
     **
     * Inserts given element after the current one
     **
     - el (Element) element to insert
     = (Element) the parent element
    \*/
    elproto.after = function (el) {
        el = wrap(el);
        var parent = el.parent();
        if (this.node.nextSibling) {
            this.node.parentNode.insertBefore(el.node, this.node.nextSibling);
        } else {
            this.node.parentNode.appendChild(el.node);
        }
        this.parent() && this.parent().add();
        parent && parent.add();
        el.paper = this.paper;
        return this;
    };
    /*\
     * Element.insertBefore
     [ method ]
     **
     * Inserts the element after the given one
     **
     - el (Element) element next to whom insert to
     = (Element) the parent element
    \*/
    elproto.insertBefore = function (el) {
        el = wrap(el);
        var parent = this.parent();
        el.node.parentNode.insertBefore(this.node, el.node);
        this.paper = el.paper;
        parent && parent.add();
        el.parent() && el.parent().add();
        return this;
    };
    /*\
     * Element.insertAfter
     [ method ]
     **
     * Inserts the element after the given one
     **
     - el (Element) element next to whom insert to
     = (Element) the parent element
    \*/
    elproto.insertAfter = function (el) {
        el = wrap(el);
        var parent = this.parent();
        el.node.parentNode.insertBefore(this.node, el.node.nextSibling);
        this.paper = el.paper;
        parent && parent.add();
        el.parent() && el.parent().add();
        return this;
    };
    /*\
     * Element.remove
     [ method ]
     **
     * Removes element from the DOM
     = (Element) the detached element
    \*/
    elproto.remove = function () {
        var parent = this.parent();
        this.node.parentNode && this.node.parentNode.removeChild(this.node);
        delete this.paper;
        this.removed = true;
        parent && parent.add();
        return this;
    };
    /*\
     * Element.select
     [ method ]
     **
     * Gathers the nested @Element matching the given set of CSS selectors
     **
     - query (string) CSS selector
     = (Element) result of query selection
    \*/
    elproto.select = function (query) {
        return wrap(this.node.querySelector(query));
    };
    /*\
     * Element.selectAll
     [ method ]
     **
     * Gathers nested @Element objects matching the given set of CSS selectors
     **
     - query (string) CSS selector
     = (Set|array) result of query selection
    \*/
    elproto.selectAll = function (query) {
        var nodelist = this.node.querySelectorAll(query),
            set = (Snap.set || Array)();
        for (var i = 0; i < nodelist.length; i++) {
            set.push(wrap(nodelist[i]));
        }
        return set;
    };
    /*\
     * Element.asPX
     [ method ]
     **
     * Returns given attribute of the element as a `px` value (not %, em, etc.)
     **
     - attr (string) attribute name
     - value (string) #optional attribute value
     = (Element) result of query selection
    \*/
    elproto.asPX = function (attr, value) {
        if (value == null) {
            value = this.attr(attr);
        }
        return +unit2px(this, attr, value);
    };
    // SIERRA Element.use(): I suggest adding a note about how to access the original element the returned <use> instantiates. It's a part of SVG with which ordinary web developers may be least familiar.
    /*\
     * Element.use
     [ method ]
     **
     * Creates a `<use>` element linked to the current element
     **
     = (Element) the `<use>` element
    \*/
    elproto.use = function () {
        var use,
            id = this.node.id;
        if (!id) {
            id = this.id;
            $(this.node, {
                id: id
            });
        }
        if (this.type == "linearGradient" || this.type == "radialGradient" ||
            this.type == "pattern") {
            use = make(this.type, this.node.parentNode);
        } else {
            use = make("use", this.node.parentNode);
        }
        $(use.node, {
            "xlink:href": "#" + id
        });
        use.original = this;
        return use;
    };
    function fixids(el) {
        var els = el.selectAll("*"),
            it,
            url = /^\s*url\(("|'|)(.*)\1\)\s*$/,
            ids = [],
            uses = {};
        function urltest(it, name) {
            var val = $(it.node, name);
            val = val && val.match(url);
            val = val && val[2];
            if (val && val.charAt() == "#") {
                val = val.substring(1);
            } else {
                return;
            }
            if (val) {
                uses[val] = (uses[val] || []).concat(function (id) {
                    var attr = {};
                    attr[name] = Snap.url(id);
                    $(it.node, attr);
                });
            }
        }
        function linktest(it) {
            var val = $(it.node, "xlink:href");
            if (val && val.charAt() == "#") {
                val = val.substring(1);
            } else {
                return;
            }
            if (val) {
                uses[val] = (uses[val] || []).concat(function (id) {
                    it.attr("xlink:href", "#" + id);
                });
            }
        }
        for (var i = 0, ii = els.length; i < ii; i++) {
            it = els[i];
            urltest(it, "fill");
            urltest(it, "stroke");
            urltest(it, "filter");
            urltest(it, "mask");
            urltest(it, "clip-path");
            linktest(it);
            var oldid = $(it.node, "id");
            if (oldid) {
                $(it.node, {id: it.id});
                ids.push({
                    old: oldid,
                    id: it.id
                });
            }
        }
        for (i = 0, ii = ids.length; i < ii; i++) {
            var fs = uses[ids[i].old];
            if (fs) {
                for (var j = 0, jj = fs.length; j < jj; j++) {
                    fs[j](ids[i].id);
                }
            }
        }
    }
    /*\
     * Element.clone
     [ method ]
     **
     * Creates a clone of the element and inserts it after the element
     **
     = (Element) the clone
    \*/
    elproto.clone = function () {
        var clone = wrap(this.node.cloneNode(true));
        if ($(clone.node, "id")) {
            $(clone.node, {id: clone.id});
        }
        fixids(clone);
        clone.insertAfter(this);
        return clone;
    };
    /*\
     * Element.toDefs
     [ method ]
     **
     * Moves element to the shared `<defs>` area
     **
     = (Element) the element
    \*/
    elproto.toDefs = function () {
        var defs = getSomeDefs(this);
        defs.appendChild(this.node);
        return this;
    };
    /*\
     * Element.toPattern
     [ method ]
     **
     * Creates a `<pattern>` element from the current element
     **
     * To create a pattern you have to specify the pattern rect:
     - x (string|number)
     - y (string|number)
     - width (string|number)
     - height (string|number)
     = (Element) the `<pattern>` element
     * You can use pattern later on as an argument for `fill` attribute:
     | var p = paper.path("M10-5-10,15M15,0,0,15M0-5-20,15").attr({
     |         fill: "none",
     |         stroke: "#bada55",
     |         strokeWidth: 5
     |     }).pattern(0, 0, 10, 10),
     |     c = paper.circle(200, 200, 100);
     | c.attr({
     |     fill: p
     | });
    \*/
    elproto.pattern = elproto.toPattern = function (x, y, width, height) {
        var p = make("pattern", getSomeDefs(this));
        if (x == null) {
            x = this.getBBox();
        }
        if (is(x, "object") && "x" in x) {
            y = x.y;
            width = x.width;
            height = x.height;
            x = x.x;
        }
        $(p.node, {
            x: x,
            y: y,
            width: width,
            height: height,
            patternUnits: "userSpaceOnUse",
            id: p.id,
            viewBox: [x, y, width, height].join(" ")
        });
        p.node.appendChild(this.node);
        return p;
    };
// SIERRA Element.marker(): clarify what a reference point is. E.g., helps you offset the object from its edge such as when centering it over a path.
// SIERRA Element.marker(): I suggest the method should accept default reference point values.  Perhaps centered with (refX = width/2) and (refY = height/2)? Also, couldn't it assume the element's current _width_ and _height_? And please specify what _x_ and _y_ mean: offsets? If so, from where?  Couldn't they also be assigned default values?
    /*\
     * Element.marker
     [ method ]
     **
     * Creates a `<marker>` element from the current element
     **
     * To create a marker you have to specify the bounding rect and reference point:
     - x (number)
     - y (number)
     - width (number)
     - height (number)
     - refX (number)
     - refY (number)
     = (Element) the `<marker>` element
     * You can specify the marker later as an argument for `marker-start`, `marker-end`, `marker-mid`, and `marker` attributes. The `marker` attribute places the marker at every point along the path, and `marker-mid` places them at every point except the start and end.
    \*/
    // TODO add usage for markers
    elproto.marker = function (x, y, width, height, refX, refY) {
        var p = make("marker", getSomeDefs(this));
        if (x == null) {
            x = this.getBBox();
        }
        if (is(x, "object") && "x" in x) {
            y = x.y;
            width = x.width;
            height = x.height;
            refX = x.refX || x.cx;
            refY = x.refY || x.cy;
            x = x.x;
        }
        $(p.node, {
            viewBox: [x, y, width, height].join(" "),
            markerWidth: width,
            markerHeight: height,
            orient: "auto",
            refX: refX || 0,
            refY: refY || 0,
            id: p.id
        });
        p.node.appendChild(this.node);
        return p;
    };
    var eldata = {};
    /*\
     * Element.data
     [ method ]
     **
     * Adds or retrieves given value associated with given key. (Don’t confuse
     * with `data-` attributes)
     *
     * See also @Element.removeData
     - key (string) key to store data
     - value (any) #optional value to store
     = (object) @Element
     * or, if value is not specified:
     = (any) value
     > Usage
     | for (var i = 0, i < 5, i++) {
     |     paper.circle(10 + 15 * i, 10, 10)
     |          .attr({fill: "#000"})
     |          .data("i", i)
     |          .click(function () {
     |             alert(this.data("i"));
     |          });
     | }
    \*/
    elproto.data = function (key, value) {
        var data = eldata[this.id] = eldata[this.id] || {};
        if (arguments.length == 0){
            eve("snap.data.get." + this.id, this, data, null);
            return data;
        }
        if (arguments.length == 1) {
            if (Snap.is(key, "object")) {
                for (var i in key) if (key[has](i)) {
                    this.data(i, key[i]);
                }
                return this;
            }
            eve("snap.data.get." + this.id, this, data[key], key);
            return data[key];
        }
        data[key] = value;
        eve("snap.data.set." + this.id, this, value, key);
        return this;
    };
    /*\
     * Element.removeData
     [ method ]
     **
     * Removes value associated with an element by given key.
     * If key is not provided, removes all the data of the element.
     - key (string) #optional key
     = (object) @Element
    \*/
    elproto.removeData = function (key) {
        if (key == null) {
            eldata[this.id] = {};
        } else {
            eldata[this.id] && delete eldata[this.id][key];
        }
        return this;
    };
    /*\
     * Element.outerSVG
     [ method ]
     **
     * Returns SVG code for the element, equivalent to HTML's `outerHTML`.
     *
     * See also @Element.innerSVG
     = (string) SVG code for the element
    \*/
    /*\
     * Element.toString
     [ method ]
     **
     * See @Element.outerSVG
    \*/
    elproto.outerSVG = elproto.toString = toString(1);
    /*\
     * Element.innerSVG
     [ method ]
     **
     * Returns SVG code for the element's contents, equivalent to HTML's `innerHTML`
     = (string) SVG code for the element
    \*/
    elproto.innerSVG = toString();
    function toString(type) {
        return function () {
            var res = type ? "<" + this.type : "",
                attr = this.node.attributes,
                chld = this.node.childNodes;
            if (type) {
                for (var i = 0, ii = attr.length; i < ii; i++) {
                    res += " " + attr[i].name + '="' +
                            attr[i].value.replace(/"/g, '\\"') + '"';
                }
            }
            if (chld.length) {
                type && (res += ">");
                for (i = 0, ii = chld.length; i < ii; i++) {
                    if (chld[i].nodeType == 3) {
                        res += chld[i].nodeValue;
                    } else if (chld[i].nodeType == 1) {
                        res += wrap(chld[i]).toString();
                    }
                }
                type && (res += "</" + this.type + ">");
            } else {
                type && (res += "/>");
            }
            return res;
        };
    }
    elproto.toDataURL = function () {
        if (window && window.btoa) {
            var bb = this.getBBox(),
                svg = Snap.format('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="{width}" height="{height}" viewBox="{x} {y} {width} {height}">{contents}</svg>', {
                x: +bb.x.toFixed(3),
                y: +bb.y.toFixed(3),
                width: +bb.width.toFixed(3),
                height: +bb.height.toFixed(3),
                contents: this.outerSVG()
            });
            return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svg)));
        }
    };
    /*\
     * Fragment.select
     [ method ]
     **
     * See @Element.select
    \*/
    Fragment.prototype.select = elproto.select;
    /*\
     * Fragment.selectAll
     [ method ]
     **
     * See @Element.selectAll
    \*/
    Fragment.prototype.selectAll = elproto.selectAll;
});

// Copyright (c) 2016 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var elproto = Element.prototype,
        is = Snap.is,
        Str = String,
        has = "hasOwnProperty";
    function slice(from, to, f) {
        return function (arr) {
            var res = arr.slice(from, to);
            if (res.length == 1) {
                res = res[0];
            }
            return f ? f(res) : res;
        };
    }
    var Animation = function (attr, ms, easing, callback) {
        if (typeof easing == "function" && !easing.length) {
            callback = easing;
            easing = mina.linear;
        }
        this.attr = attr;
        this.dur = ms;
        easing && (this.easing = easing);
        callback && (this.callback = callback);
    };
    Snap._.Animation = Animation;
    /*\
     * Snap.animation
     [ method ]
     **
     * Creates an animation object
     **
     - attr (object) attributes of final destination
     - duration (number) duration of the animation, in milliseconds
     - easing (function) #optional one of easing functions of @mina or custom one
     - callback (function) #optional callback function that fires when animation ends
     = (object) animation object
    \*/
    Snap.animation = function (attr, ms, easing, callback) {
        return new Animation(attr, ms, easing, callback);
    };
    /*\
     * Element.inAnim
     [ method ]
     **
     * Returns a set of animations that may be able to manipulate the current element
     **
     = (object) in format:
     o {
     o     anim (object) animation object,
     o     mina (object) @mina object,
     o     curStatus (number) 0..1 — status of the animation: 0 — just started, 1 — just finished,
     o     status (function) gets or sets the status of the animation,
     o     stop (function) stops the animation
     o }
    \*/
    elproto.inAnim = function () {
        var el = this,
            res = [];
        for (var id in el.anims) if (el.anims[has](id)) {
            (function (a) {
                res.push({
                    anim: new Animation(a._attrs, a.dur, a.easing, a._callback),
                    mina: a,
                    curStatus: a.status(),
                    status: function (val) {
                        return a.status(val);
                    },
                    stop: function () {
                        a.stop();
                    }
                });
            }(el.anims[id]));
        }
        return res;
    };
    /*\
     * Snap.animate
     [ method ]
     **
     * Runs generic animation of one number into another with a caring function
     **
     - from (number|array) number or array of numbers
     - to (number|array) number or array of numbers
     - setter (function) caring function that accepts one number argument
     - duration (number) duration, in milliseconds
     - easing (function) #optional easing function from @mina or custom
     - callback (function) #optional callback function to execute when animation ends
     = (object) animation object in @mina format
     o {
     o     id (string) animation id, consider it read-only,
     o     duration (function) gets or sets the duration of the animation,
     o     easing (function) easing,
     o     speed (function) gets or sets the speed of the animation,
     o     status (function) gets or sets the status of the animation,
     o     stop (function) stops the animation
     o }
     | var rect = Snap().rect(0, 0, 10, 10);
     | Snap.animate(0, 10, function (val) {
     |     rect.attr({
     |         x: val
     |     });
     | }, 1000);
     | // in given context is equivalent to
     | rect.animate({x: 10}, 1000);
    \*/
    Snap.animate = function (from, to, setter, ms, easing, callback) {
        if (typeof easing == "function" && !easing.length) {
            callback = easing;
            easing = mina.linear;
        }
        var now = mina.time(),
            anim = mina(from, to, now, now + ms, mina.time, setter, easing);
        callback && eve.once("mina.finish." + anim.id, callback);
        return anim;
    };
    /*\
     * Element.stop
     [ method ]
     **
     * Stops all the animations for the current element
     **
     = (Element) the current element
    \*/
    elproto.stop = function () {
        var anims = this.inAnim();
        for (var i = 0, ii = anims.length; i < ii; i++) {
            anims[i].stop();
        }
        return this;
    };
    /*\
     * Element.animate
     [ method ]
     **
     * Animates the given attributes of the element
     **
     - attrs (object) key-value pairs of destination attributes
     - duration (number) duration of the animation in milliseconds
     - easing (function) #optional easing function from @mina or custom
     - callback (function) #optional callback function that executes when the animation ends
     = (Element) the current element
    \*/
    elproto.animate = function (attrs, ms, easing, callback) {
        if (typeof easing == "function" && !easing.length) {
            callback = easing;
            easing = mina.linear;
        }
        if (attrs instanceof Animation) {
            callback = attrs.callback;
            easing = attrs.easing;
            ms = attrs.dur;
            attrs = attrs.attr;
        }
        var fkeys = [], tkeys = [], keys = {}, from, to, f, eq,
            el = this;
        for (var key in attrs) if (attrs[has](key)) {
            if (el.equal) {
                eq = el.equal(key, Str(attrs[key]));
                from = eq.from;
                to = eq.to;
                f = eq.f;
            } else {
                from = +el.attr(key);
                to = +attrs[key];
            }
            var len = is(from, "array") ? from.length : 1;
            keys[key] = slice(fkeys.length, fkeys.length + len, f);
            fkeys = fkeys.concat(from);
            tkeys = tkeys.concat(to);
        }
        var now = mina.time(),
            anim = mina(fkeys, tkeys, now, now + ms, mina.time, function (val) {
                var attr = {};
                for (var key in keys) if (keys[has](key)) {
                    attr[key] = keys[key](val);
                }
                el.attr(attr);
            }, easing);
        el.anims[anim.id] = anim;
        anim._attrs = attrs;
        anim._callback = callback;
        eve("snap.animcreated." + el.id, anim);
        eve.once("mina.finish." + anim.id, function () {
            eve.off("mina.*." + anim.id);
            delete el.anims[anim.id];
            callback && callback.call(el);
        });
        eve.once("mina.stop." + anim.id, function () {
            eve.off("mina.*." + anim.id);
            delete el.anims[anim.id];
        });
        return el;
    };
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var objectToString = Object.prototype.toString,
        Str = String,
        math = Math,
        E = "";
    function Matrix(a, b, c, d, e, f) {
        if (b == null && objectToString.call(a) == "[object SVGMatrix]") {
            this.a = a.a;
            this.b = a.b;
            this.c = a.c;
            this.d = a.d;
            this.e = a.e;
            this.f = a.f;
            return;
        }
        if (a != null) {
            this.a = +a;
            this.b = +b;
            this.c = +c;
            this.d = +d;
            this.e = +e;
            this.f = +f;
        } else {
            this.a = 1;
            this.b = 0;
            this.c = 0;
            this.d = 1;
            this.e = 0;
            this.f = 0;
        }
    }
    (function (matrixproto) {
        /*\
         * Matrix.add
         [ method ]
         **
         * Adds the given matrix to existing one
         - a (number)
         - b (number)
         - c (number)
         - d (number)
         - e (number)
         - f (number)
         * or
         - matrix (object) @Matrix
        \*/
        matrixproto.add = function (a, b, c, d, e, f) {
            if (a && a instanceof Matrix) {
                return this.add(a.a, a.b, a.c, a.d, a.e, a.f);
            }
            var aNew = a * this.a + b * this.c,
                bNew = a * this.b + b * this.d;
            this.e += e * this.a + f * this.c;
            this.f += e * this.b + f * this.d;
            this.c = c * this.a + d * this.c;
            this.d = c * this.b + d * this.d;

            this.a = aNew;
            this.b = bNew;
            return this;
        };
        /*\
         * Matrix.multLeft
         [ method ]
         **
         * Multiplies a passed affine transform to the left: M * this.
         - a (number)
         - b (number)
         - c (number)
         - d (number)
         - e (number)
         - f (number)
         * or
         - matrix (object) @Matrix
        \*/
        Matrix.prototype.multLeft = function (a, b, c, d, e, f) {
            if (a && a instanceof Matrix) {
                return this.multLeft(a.a, a.b, a.c, a.d, a.e, a.f);
            }
            var aNew = a * this.a + c * this.b,
                cNew = a * this.c + c * this.d,
                eNew = a * this.e + c * this.f + e;
            this.b = b * this.a + d * this.b;
            this.d = b * this.c + d * this.d;
            this.f = b * this.e + d * this.f + f;

            this.a = aNew;
            this.c = cNew;
            this.e = eNew;
            return this;
        };
        /*\
         * Matrix.invert
         [ method ]
         **
         * Returns an inverted version of the matrix
         = (object) @Matrix
        \*/
        matrixproto.invert = function () {
            var me = this,
                x = me.a * me.d - me.b * me.c;
            return new Matrix(me.d / x, -me.b / x, -me.c / x, me.a / x, (me.c * me.f - me.d * me.e) / x, (me.b * me.e - me.a * me.f) / x);
        };
        /*\
         * Matrix.clone
         [ method ]
         **
         * Returns a copy of the matrix
         = (object) @Matrix
        \*/
        matrixproto.clone = function () {
            return new Matrix(this.a, this.b, this.c, this.d, this.e, this.f);
        };
        /*\
         * Matrix.translate
         [ method ]
         **
         * Translate the matrix
         - x (number) horizontal offset distance
         - y (number) vertical offset distance
        \*/
        matrixproto.translate = function (x, y) {
            this.e += x * this.a + y * this.c;
            this.f += x * this.b + y * this.d;
            return this;
        };
        /*\
         * Matrix.scale
         [ method ]
         **
         * Scales the matrix
         - x (number) amount to be scaled, with `1` resulting in no change
         - y (number) #optional amount to scale along the vertical axis. (Otherwise `x` applies to both axes.)
         - cx (number) #optional horizontal origin point from which to scale
         - cy (number) #optional vertical origin point from which to scale
         * Default cx, cy is the middle point of the element.
        \*/
        matrixproto.scale = function (x, y, cx, cy) {
            y == null && (y = x);
            (cx || cy) && this.translate(cx, cy);
            this.a *= x;
            this.b *= x;
            this.c *= y;
            this.d *= y;
            (cx || cy) && this.translate(-cx, -cy);
            return this;
        };
        /*\
         * Matrix.rotate
         [ method ]
         **
         * Rotates the matrix
         - a (number) angle of rotation, in degrees
         - x (number) horizontal origin point from which to rotate
         - y (number) vertical origin point from which to rotate
        \*/
        matrixproto.rotate = function (a, x, y) {
            a = Snap.rad(a);
            x = x || 0;
            y = y || 0;
            var cos = +math.cos(a).toFixed(9),
                sin = +math.sin(a).toFixed(9);
            this.add(cos, sin, -sin, cos, x, y);
            return this.add(1, 0, 0, 1, -x, -y);
        };
        /*\
         * Matrix.skewX
         [ method ]
         **
         * Skews the matrix along the x-axis
         - x (number) Angle to skew along the x-axis (in degrees).
        \*/
        matrixproto.skewX = function (x) {
            return this.skew(x, 0);
        };
        /*\
         * Matrix.skewY
         [ method ]
         **
         * Skews the matrix along the y-axis
         - y (number) Angle to skew along the y-axis (in degrees).
        \*/
        matrixproto.skewY = function (y) {
            return this.skew(0, y);
        };
        /*\
         * Matrix.skew
         [ method ]
         **
         * Skews the matrix
         - y (number) Angle to skew along the y-axis (in degrees).
         - x (number) Angle to skew along the x-axis (in degrees).
        \*/
        matrixproto.skew = function (x, y) {
            x = x || 0;
            y = y || 0;
            x = Snap.rad(x);
            y = Snap.rad(y);
            var c = math.tan(x).toFixed(9);
            var b = math.tan(y).toFixed(9);
            return this.add(1, b, c, 1, 0, 0);
        };
        /*\
         * Matrix.x
         [ method ]
         **
         * Returns x coordinate for given point after transformation described by the matrix. See also @Matrix.y
         - x (number)
         - y (number)
         = (number) x
        \*/
        matrixproto.x = function (x, y) {
            return x * this.a + y * this.c + this.e;
        };
        /*\
         * Matrix.y
         [ method ]
         **
         * Returns y coordinate for given point after transformation described by the matrix. See also @Matrix.x
         - x (number)
         - y (number)
         = (number) y
        \*/
        matrixproto.y = function (x, y) {
            return x * this.b + y * this.d + this.f;
        };
        matrixproto.get = function (i) {
            return +this[Str.fromCharCode(97 + i)].toFixed(4);
        };
        matrixproto.toString = function () {
            return "matrix(" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)].join() + ")";
        };
        matrixproto.offset = function () {
            return [this.e.toFixed(4), this.f.toFixed(4)];
        };
        function norm(a) {
            return a[0] * a[0] + a[1] * a[1];
        }
        function normalize(a) {
            var mag = math.sqrt(norm(a));
            a[0] && (a[0] /= mag);
            a[1] && (a[1] /= mag);
        }
        /*\
         * Matrix.determinant
         [ method ]
         **
         * Finds determinant of the given matrix.
         = (number) determinant
        \*/
        matrixproto.determinant = function () {
            return this.a * this.d - this.b * this.c;
        };
        /*\
         * Matrix.split
         [ method ]
         **
         * Splits matrix into primitive transformations
         = (object) in format:
         o dx (number) translation by x
         o dy (number) translation by y
         o scalex (number) scale by x
         o scaley (number) scale by y
         o shear (number) shear
         o rotate (number) rotation in deg
         o isSimple (boolean) could it be represented via simple transformations
        \*/
        matrixproto.split = function () {
            var out = {};
            // translation
            out.dx = this.e;
            out.dy = this.f;

            // scale and shear
            var row = [[this.a, this.b], [this.c, this.d]];
            out.scalex = math.sqrt(norm(row[0]));
            normalize(row[0]);

            out.shear = row[0][0] * row[1][0] + row[0][1] * row[1][1];
            row[1] = [row[1][0] - row[0][0] * out.shear, row[1][1] - row[0][1] * out.shear];

            out.scaley = math.sqrt(norm(row[1]));
            normalize(row[1]);
            out.shear /= out.scaley;

            if (this.determinant() < 0) {
                out.scalex = -out.scalex;
            }

            // rotation
            var sin = row[0][1],
                cos = row[1][1];
            if (cos < 0) {
                out.rotate = Snap.deg(math.acos(cos));
                if (sin < 0) {
                    out.rotate = 360 - out.rotate;
                }
            } else {
                out.rotate = Snap.deg(math.asin(sin));
            }

            out.isSimple = !+out.shear.toFixed(9) && (out.scalex.toFixed(9) == out.scaley.toFixed(9) || !out.rotate);
            out.isSuperSimple = !+out.shear.toFixed(9) && out.scalex.toFixed(9) == out.scaley.toFixed(9) && !out.rotate;
            out.noRotation = !+out.shear.toFixed(9) && !out.rotate;
            return out;
        };
        /*\
         * Matrix.toTransformString
         [ method ]
         **
         * Returns transform string that represents given matrix
         = (string) transform string
        \*/
        matrixproto.toTransformString = function (shorter) {
            var s = shorter || this.split();
            if (!+s.shear.toFixed(9)) {
                s.scalex = +s.scalex.toFixed(4);
                s.scaley = +s.scaley.toFixed(4);
                s.rotate = +s.rotate.toFixed(4);
                return  (s.dx || s.dy ? "t" + [+s.dx.toFixed(4), +s.dy.toFixed(4)] : E) +
                        (s.rotate ? "r" + [+s.rotate.toFixed(4), 0, 0] : E) +
                        (s.scalex != 1 || s.scaley != 1 ? "s" + [s.scalex, s.scaley, 0, 0] : E);
            } else {
                return "m" + [this.get(0), this.get(1), this.get(2), this.get(3), this.get(4), this.get(5)];
            }
        };
    })(Matrix.prototype);
    /*\
     * Snap.Matrix
     [ method ]
     **
     * Matrix constructor, extend on your own risk.
     * To create matrices use @Snap.matrix.
    \*/
    Snap.Matrix = Matrix;
    /*\
     * Snap.matrix
     [ method ]
     **
     * Utility method
     **
     * Returns a matrix based on the given parameters
     - a (number)
     - b (number)
     - c (number)
     - d (number)
     - e (number)
     - f (number)
     * or
     - svgMatrix (SVGMatrix)
     = (object) @Matrix
    \*/
    Snap.matrix = function (a, b, c, d, e, f) {
        return new Matrix(a, b, c, d, e, f);
    };
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var has = "hasOwnProperty",
        make = Snap._.make,
        wrap = Snap._.wrap,
        is = Snap.is,
        getSomeDefs = Snap._.getSomeDefs,
        reURLValue = /^url\((['"]?)([^)]+)\1\)$/,
        $ = Snap._.$,
        URL = Snap.url,
        Str = String,
        separator = Snap._.separator,
        E = "";
    /*\
     * Snap.deurl
     [ method ]
     **
     * Unwraps path from `"url(<path>)"`.
     - value (string) url path
     = (string) unwrapped path
    \*/
    Snap.deurl = function (value) {
        var res = String(value).match(reURLValue);
        return res ? res[2] : value;
    }
    // Attributes event handlers
    eve.on("snap.util.attr.mask", function (value) {
        if (value instanceof Element || value instanceof Fragment) {
            eve.stop();
            if (value instanceof Fragment && value.node.childNodes.length == 1) {
                value = value.node.firstChild;
                getSomeDefs(this).appendChild(value);
                value = wrap(value);
            }
            if (value.type == "mask") {
                var mask = value;
            } else {
                mask = make("mask", getSomeDefs(this));
                mask.node.appendChild(value.node);
            }
            !mask.node.id && $(mask.node, {
                id: mask.id
            });
            $(this.node, {
                mask: URL(mask.id)
            });
        }
    });
    (function (clipIt) {
        eve.on("snap.util.attr.clip", clipIt);
        eve.on("snap.util.attr.clip-path", clipIt);
        eve.on("snap.util.attr.clipPath", clipIt);
    }(function (value) {
        if (value instanceof Element || value instanceof Fragment) {
            eve.stop();
            var clip,
                node = value.node;
            while (node) {
                if (node.nodeName === "clipPath") {
                    clip = new Element(node);
                    break;
                }
                if (node.nodeName === "svg") {
                    clip = undefined;
                    break;
                }
                node = node.parentNode;
            }
            if (!clip) {
                clip = make("clipPath", getSomeDefs(this));
                clip.node.appendChild(value.node);
                !clip.node.id && $(clip.node, {
                    id: clip.id
                });
            }
            $(this.node, {
                "clip-path": URL(clip.node.id || clip.id)
            });
        }
    }));
    function fillStroke(name) {
        return function (value) {
            eve.stop();
            if (value instanceof Fragment && value.node.childNodes.length == 1 &&
                (value.node.firstChild.tagName == "radialGradient" ||
                value.node.firstChild.tagName == "linearGradient" ||
                value.node.firstChild.tagName == "pattern")) {
                value = value.node.firstChild;
                getSomeDefs(this).appendChild(value);
                value = wrap(value);
            }
            if (value instanceof Element) {
                if (value.type == "radialGradient" || value.type == "linearGradient"
                   || value.type == "pattern") {
                    if (!value.node.id) {
                        $(value.node, {
                            id: value.id
                        });
                    }
                    var fill = URL(value.node.id);
                } else {
                    fill = value.attr(name);
                }
            } else {
                fill = Snap.color(value);
                if (fill.error) {
                    var grad = Snap(getSomeDefs(this).ownerSVGElement).gradient(value);
                    if (grad) {
                        if (!grad.node.id) {
                            $(grad.node, {
                                id: grad.id
                            });
                        }
                        fill = URL(grad.node.id);
                    } else {
                        fill = value;
                    }
                } else {
                    fill = Str(fill);
                }
            }
            var attrs = {};
            attrs[name] = fill;
            $(this.node, attrs);
            this.node.style[name] = E;
        };
    }
    eve.on("snap.util.attr.fill", fillStroke("fill"));
    eve.on("snap.util.attr.stroke", fillStroke("stroke"));
    var gradrg = /^([lr])(?:\(([^)]*)\))?(.*)$/i;
    eve.on("snap.util.grad.parse", function parseGrad(string) {
        string = Str(string);
        var tokens = string.match(gradrg);
        if (!tokens) {
            return null;
        }
        var type = tokens[1],
            params = tokens[2],
            stops = tokens[3];
        params = params.split(/\s*,\s*/).map(function (el) {
            return +el == el ? +el : el;
        });
        if (params.length == 1 && params[0] == 0) {
            params = [];
        }
        stops = stops.split("-");
        stops = stops.map(function (el) {
            el = el.split(":");
            var out = {
                color: el[0]
            };
            if (el[1]) {
                out.offset = parseFloat(el[1]);
            }
            return out;
        });
        var len = stops.length,
            start = 0,
            j = 0;
        function seed(i, end) {
            var step = (end - start) / (i - j);
            for (var k = j; k < i; k++) {
                stops[k].offset = +(+start + step * (k - j)).toFixed(2);
            }
            j = i;
            start = end;
        }
        len--;
        for (var i = 0; i < len; i++) if ("offset" in stops[i]) {
            seed(i, stops[i].offset);
        }
        stops[len].offset = stops[len].offset || 100;
        seed(len, stops[len].offset);
        return {
            type: type,
            params: params,
            stops: stops
        };
    });

    eve.on("snap.util.attr.d", function (value) {
        eve.stop();
        if (is(value, "array") && is(value[0], "array")) {
            value = Snap.path.toString.call(value);
        }
        value = Str(value);
        if (value.match(/[ruo]/i)) {
            value = Snap.path.toAbsolute(value);
        }
        $(this.node, {d: value});
    })(-1);
    eve.on("snap.util.attr.#text", function (value) {
        eve.stop();
        value = Str(value);
        var txt = glob.doc.createTextNode(value);
        while (this.node.firstChild) {
            this.node.removeChild(this.node.firstChild);
        }
        this.node.appendChild(txt);
    })(-1);
    eve.on("snap.util.attr.path", function (value) {
        eve.stop();
        this.attr({d: value});
    })(-1);
    eve.on("snap.util.attr.class", function (value) {
        eve.stop();
        this.node.className.baseVal = value;
    })(-1);
    eve.on("snap.util.attr.viewBox", function (value) {
        var vb;
        if (is(value, "object") && "x" in value) {
            vb = [value.x, value.y, value.width, value.height].join(" ");
        } else if (is(value, "array")) {
            vb = value.join(" ");
        } else {
            vb = value;
        }
        $(this.node, {
            viewBox: vb
        });
        eve.stop();
    })(-1);
    eve.on("snap.util.attr.transform", function (value) {
        this.transform(value);
        eve.stop();
    })(-1);
    eve.on("snap.util.attr.r", function (value) {
        if (this.type == "rect") {
            eve.stop();
            $(this.node, {
                rx: value,
                ry: value
            });
        }
    })(-1);
    eve.on("snap.util.attr.textpath", function (value) {
        eve.stop();
        if (this.type == "text") {
            var id, tp, node;
            if (!value && this.textPath) {
                tp = this.textPath;
                while (tp.node.firstChild) {
                    this.node.appendChild(tp.node.firstChild);
                }
                tp.remove();
                delete this.textPath;
                return;
            }
            if (is(value, "string")) {
                var defs = getSomeDefs(this),
                    path = wrap(defs.parentNode).path(value);
                defs.appendChild(path.node);
                id = path.id;
                path.attr({id: id});
            } else {
                value = wrap(value);
                if (value instanceof Element) {
                    id = value.attr("id");
                    if (!id) {
                        id = value.id;
                        value.attr({id: id});
                    }
                }
            }
            if (id) {
                tp = this.textPath;
                node = this.node;
                if (tp) {
                    tp.attr({"xlink:href": "#" + id});
                } else {
                    tp = $("textPath", {
                        "xlink:href": "#" + id
                    });
                    while (node.firstChild) {
                        tp.appendChild(node.firstChild);
                    }
                    node.appendChild(tp);
                    this.textPath = wrap(tp);
                }
            }
        }
    })(-1);
    eve.on("snap.util.attr.text", function (value) {
        if (this.type == "text") {
            var i = 0,
                node = this.node,
                tuner = function (chunk) {
                    var out = $("tspan");
                    if (is(chunk, "array")) {
                        for (var i = 0; i < chunk.length; i++) {
                            out.appendChild(tuner(chunk[i]));
                        }
                    } else {
                        out.appendChild(glob.doc.createTextNode(chunk));
                    }
                    out.normalize && out.normalize();
                    return out;
                };
            while (node.firstChild) {
                node.removeChild(node.firstChild);
            }
            var tuned = tuner(value);
            while (tuned.firstChild) {
                node.appendChild(tuned.firstChild);
            }
        }
        eve.stop();
    })(-1);
    function setFontSize(value) {
        eve.stop();
        if (value == +value) {
            value += "px";
        }
        this.node.style.fontSize = value;
    }
    eve.on("snap.util.attr.fontSize", setFontSize)(-1);
    eve.on("snap.util.attr.font-size", setFontSize)(-1);


    eve.on("snap.util.getattr.transform", function () {
        eve.stop();
        return this.transform();
    })(-1);
    eve.on("snap.util.getattr.textpath", function () {
        eve.stop();
        return this.textPath;
    })(-1);
    // Markers
    (function () {
        function getter(end) {
            return function () {
                eve.stop();
                var style = glob.doc.defaultView.getComputedStyle(this.node, null).getPropertyValue("marker-" + end);
                if (style == "none") {
                    return style;
                } else {
                    return Snap(glob.doc.getElementById(style.match(reURLValue)[1]));
                }
            };
        }
        function setter(end) {
            return function (value) {
                eve.stop();
                var name = "marker" + end.charAt(0).toUpperCase() + end.substring(1);
                if (value == "" || !value) {
                    this.node.style[name] = "none";
                    return;
                }
                if (value.type == "marker") {
                    var id = value.node.id;
                    if (!id) {
                        $(value.node, {id: value.id});
                    }
                    this.node.style[name] = URL(id);
                    return;
                }
            };
        }
        eve.on("snap.util.getattr.marker-end", getter("end"))(-1);
        eve.on("snap.util.getattr.markerEnd", getter("end"))(-1);
        eve.on("snap.util.getattr.marker-start", getter("start"))(-1);
        eve.on("snap.util.getattr.markerStart", getter("start"))(-1);
        eve.on("snap.util.getattr.marker-mid", getter("mid"))(-1);
        eve.on("snap.util.getattr.markerMid", getter("mid"))(-1);
        eve.on("snap.util.attr.marker-end", setter("end"))(-1);
        eve.on("snap.util.attr.markerEnd", setter("end"))(-1);
        eve.on("snap.util.attr.marker-start", setter("start"))(-1);
        eve.on("snap.util.attr.markerStart", setter("start"))(-1);
        eve.on("snap.util.attr.marker-mid", setter("mid"))(-1);
        eve.on("snap.util.attr.markerMid", setter("mid"))(-1);
    }());
    eve.on("snap.util.getattr.r", function () {
        if (this.type == "rect" && $(this.node, "rx") == $(this.node, "ry")) {
            eve.stop();
            return $(this.node, "rx");
        }
    })(-1);
    function textExtract(node) {
        var out = [];
        var children = node.childNodes;
        for (var i = 0, ii = children.length; i < ii; i++) {
            var chi = children[i];
            if (chi.nodeType == 3) {
                out.push(chi.nodeValue);
            }
            if (chi.tagName == "tspan") {
                if (chi.childNodes.length == 1 && chi.firstChild.nodeType == 3) {
                    out.push(chi.firstChild.nodeValue);
                } else {
                    out.push(textExtract(chi));
                }
            }
        }
        return out;
    }
    eve.on("snap.util.getattr.text", function () {
        if (this.type == "text" || this.type == "tspan") {
            eve.stop();
            var out = textExtract(this.node);
            return out.length == 1 ? out[0] : out;
        }
    })(-1);
    eve.on("snap.util.getattr.#text", function () {
        return this.node.textContent;
    })(-1);
    eve.on("snap.util.getattr.fill", function (internal) {
        if (internal) {
            return;
        }
        eve.stop();
        var value = eve("snap.util.getattr.fill", this, true).firstDefined();
        return Snap(Snap.deurl(value)) || value;
    })(-1);
    eve.on("snap.util.getattr.stroke", function (internal) {
        if (internal) {
            return;
        }
        eve.stop();
        var value = eve("snap.util.getattr.stroke", this, true).firstDefined();
        return Snap(Snap.deurl(value)) || value;
    })(-1);
    eve.on("snap.util.getattr.viewBox", function () {
        eve.stop();
        var vb = $(this.node, "viewBox");
        if (vb) {
            vb = vb.split(separator);
            return Snap._.box(+vb[0], +vb[1], +vb[2], +vb[3]);
        } else {
            return;
        }
    })(-1);
    eve.on("snap.util.getattr.points", function () {
        var p = $(this.node, "points");
        eve.stop();
        if (p) {
            return p.split(separator);
        } else {
            return;
        }
    })(-1);
    eve.on("snap.util.getattr.path", function () {
        var p = $(this.node, "d");
        eve.stop();
        return p;
    })(-1);
    eve.on("snap.util.getattr.class", function () {
        return this.node.className.baseVal;
    })(-1);
    function getFontSize() {
        eve.stop();
        return this.node.style.fontSize;
    }
    eve.on("snap.util.getattr.fontSize", getFontSize)(-1);
    eve.on("snap.util.getattr.font-size", getFontSize)(-1);
});

// Copyright (c) 2014 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var rgNotSpace = /\S+/g,
        rgBadSpace = /[\t\r\n\f]/g,
        rgTrim = /(^\s+|\s+$)/g,
        Str = String,
        elproto = Element.prototype;
    /*\
     * Element.addClass
     [ method ]
     **
     * Adds given class name or list of class names to the element.
     - value (string) class name or space separated list of class names
     **
     = (Element) original element.
    \*/
    elproto.addClass = function (value) {
        var classes = Str(value || "").match(rgNotSpace) || [],
            elem = this.node,
            className = elem.className.baseVal,
            curClasses = className.match(rgNotSpace) || [],
            j,
            pos,
            clazz,
            finalValue;

        if (classes.length) {
            j = 0;
            while (clazz = classes[j++]) {
                pos = curClasses.indexOf(clazz);
                if (!~pos) {
                    curClasses.push(clazz);
                }
            }

            finalValue = curClasses.join(" ");
            if (className != finalValue) {
                elem.className.baseVal = finalValue;
            }
        }
        return this;
    };
    /*\
     * Element.removeClass
     [ method ]
     **
     * Removes given class name or list of class names from the element.
     - value (string) class name or space separated list of class names
     **
     = (Element) original element.
    \*/
    elproto.removeClass = function (value) {
        var classes = Str(value || "").match(rgNotSpace) || [],
            elem = this.node,
            className = elem.className.baseVal,
            curClasses = className.match(rgNotSpace) || [],
            j,
            pos,
            clazz,
            finalValue;
        if (curClasses.length) {
            j = 0;
            while (clazz = classes[j++]) {
                pos = curClasses.indexOf(clazz);
                if (~pos) {
                    curClasses.splice(pos, 1);
                }
            }

            finalValue = curClasses.join(" ");
            if (className != finalValue) {
                elem.className.baseVal = finalValue;
            }
        }
        return this;
    };
    /*\
     * Element.hasClass
     [ method ]
     **
     * Checks if the element has a given class name in the list of class names applied to it.
     - value (string) class name
     **
     = (boolean) `true` if the element has given class
    \*/
    elproto.hasClass = function (value) {
        var elem = this.node,
            className = elem.className.baseVal,
            curClasses = className.match(rgNotSpace) || [];
        return !!~curClasses.indexOf(value);
    };
    /*\
     * Element.toggleClass
     [ method ]
     **
     * Add or remove one or more classes from the element, depending on either
     * the class’s presence or the value of the `flag` argument.
     - value (string) class name or space separated list of class names
     - flag (boolean) value to determine whether the class should be added or removed
     **
     = (Element) original element.
    \*/
    elproto.toggleClass = function (value, flag) {
        if (flag != null) {
            if (flag) {
                return this.addClass(value);
            } else {
                return this.removeClass(value);
            }
        }
        var classes = (value || "").match(rgNotSpace) || [],
            elem = this.node,
            className = elem.className.baseVal,
            curClasses = className.match(rgNotSpace) || [],
            j,
            pos,
            clazz,
            finalValue;
        j = 0;
        while (clazz = classes[j++]) {
            pos = curClasses.indexOf(clazz);
            if (~pos) {
                curClasses.splice(pos, 1);
            } else {
                curClasses.push(clazz);
            }
        }

        finalValue = curClasses.join(" ");
        if (className != finalValue) {
            elem.className.baseVal = finalValue;
        }
        return this;
    };
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var operators = {
            "+": function (x, y) {
                    return x + y;
                },
            "-": function (x, y) {
                    return x - y;
                },
            "/": function (x, y) {
                    return x / y;
                },
            "*": function (x, y) {
                    return x * y;
                }
        },
        Str = String,
        reUnit = /[a-z]+$/i,
        reAddon = /^\s*([+\-\/*])\s*=\s*([\d.eE+\-]+)\s*([^\d\s]+)?\s*$/;
    function getNumber(val) {
        return val;
    }
    function getUnit(unit) {
        return function (val) {
            return +val.toFixed(3) + unit;
        };
    }
    eve.on("snap.util.attr", function (val) {
        var plus = Str(val).match(reAddon);
        if (plus) {
            var evnt = eve.nt(),
                name = evnt.substring(evnt.lastIndexOf(".") + 1),
                a = this.attr(name),
                atr = {};
            eve.stop();
            var unit = plus[3] || "",
                aUnit = a.match(reUnit),
                op = operators[plus[1]];
            if (aUnit && aUnit == unit) {
                val = op(parseFloat(a), +plus[2]);
            } else {
                a = this.asPX(name);
                val = op(this.asPX(name), this.asPX(name, plus[2] + unit));
            }
            if (isNaN(a) || isNaN(val)) {
                return;
            }
            atr[name] = val;
            this.attr(atr);
        }
    })(-10);
    eve.on("snap.util.equal", function (name, b) {
        var A, B, a = Str(this.attr(name) || ""),
            el = this,
            bplus = Str(b).match(reAddon);
        if (bplus) {
            eve.stop();
            var unit = bplus[3] || "",
                aUnit = a.match(reUnit),
                op = operators[bplus[1]];
            if (aUnit && aUnit == unit) {
                return {
                    from: parseFloat(a),
                    to: op(parseFloat(a), +bplus[2]),
                    f: getUnit(aUnit)
                };
            } else {
                a = this.asPX(name);
                return {
                    from: a,
                    to: op(a, this.asPX(name, bplus[2] + unit)),
                    f: getNumber
                };
            }
        }
    })(-10);
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var proto = Paper.prototype,
        is = Snap.is;
    /*\
     * Paper.rect
     [ method ]
     *
     * Draws a rectangle
     **
     - x (number) x coordinate of the top left corner
     - y (number) y coordinate of the top left corner
     - width (number) width
     - height (number) height
     - rx (number) #optional horizontal radius for rounded corners, default is 0
     - ry (number) #optional vertical radius for rounded corners, default is rx or 0
     = (object) the `rect` element
     **
     > Usage
     | // regular rectangle
     | var c = paper.rect(10, 10, 50, 50);
     | // rectangle with rounded corners
     | var c = paper.rect(40, 40, 50, 50, 10);
    \*/
    proto.rect = function (x, y, w, h, rx, ry) {
        var attr;
        if (ry == null) {
            ry = rx;
        }
        if (is(x, "object") && x == "[object Object]") {
            attr = x;
        } else if (x != null) {
            attr = {
                x: x,
                y: y,
                width: w,
                height: h
            };
            if (rx != null) {
                attr.rx = rx;
                attr.ry = ry;
            }
        }
        return this.el("rect", attr);
    };
    /*\
     * Paper.circle
     [ method ]
     **
     * Draws a circle
     **
     - x (number) x coordinate of the centre
     - y (number) y coordinate of the centre
     - r (number) radius
     = (object) the `circle` element
     **
     > Usage
     | var c = paper.circle(50, 50, 40);
    \*/
    proto.circle = function (cx, cy, r) {
        var attr;
        if (is(cx, "object") && cx == "[object Object]") {
            attr = cx;
        } else if (cx != null) {
            attr = {
                cx: cx,
                cy: cy,
                r: r
            };
        }
        return this.el("circle", attr);
    };

    var preload = (function () {
        function onerror() {
            this.parentNode.removeChild(this);
        }
        return function (src, f) {
            var img = glob.doc.createElement("img"),
                body = glob.doc.body;
            img.style.cssText = "position:absolute;left:-9999em;top:-9999em";
            img.onload = function () {
                f.call(img);
                img.onload = img.onerror = null;
                body.removeChild(img);
            };
            img.onerror = onerror;
            body.appendChild(img);
            img.src = src;
        };
    }());

    /*\
     * Paper.image
     [ method ]
     **
     * Places an image on the surface
     **
     - src (string) URI of the source image
     - x (number) x offset position
     - y (number) y offset position
     - width (number) width of the image
     - height (number) height of the image
     = (object) the `image` element
     * or
     = (object) Snap element object with type `image`
     **
     > Usage
     | var c = paper.image("apple.png", 10, 10, 80, 80);
    \*/
    proto.image = function (src, x, y, width, height) {
        var el = this.el("image");
        if (is(src, "object") && "src" in src) {
            el.attr(src);
        } else if (src != null) {
            var set = {
                "xlink:href": src,
                preserveAspectRatio: "none"
            };
            if (x != null && y != null) {
                set.x = x;
                set.y = y;
            }
            if (width != null && height != null) {
                set.width = width;
                set.height = height;
            } else {
                preload(src, function () {
                    Snap._.$(el.node, {
                        width: this.offsetWidth,
                        height: this.offsetHeight
                    });
                });
            }
            Snap._.$(el.node, set);
        }
        return el;
    };
    /*\
     * Paper.ellipse
     [ method ]
     **
     * Draws an ellipse
     **
     - x (number) x coordinate of the centre
     - y (number) y coordinate of the centre
     - rx (number) horizontal radius
     - ry (number) vertical radius
     = (object) the `ellipse` element
     **
     > Usage
     | var c = paper.ellipse(50, 50, 40, 20);
    \*/
    proto.ellipse = function (cx, cy, rx, ry) {
        var attr;
        if (is(cx, "object") && cx == "[object Object]") {
            attr = cx;
        } else if (cx != null) {
            attr ={
                cx: cx,
                cy: cy,
                rx: rx,
                ry: ry
            };
        }
        return this.el("ellipse", attr);
    };
    // SIERRA Paper.path(): Unclear from the link what a Catmull-Rom curveto is, and why it would make life any easier.
    /*\
     * Paper.path
     [ method ]
     **
     * Creates a `<path>` element using the given string as the path's definition
     - pathString (string) #optional path string in SVG format
     * Path string consists of one-letter commands, followed by comma seprarated arguments in numerical form. Example:
     | "M10,20L30,40"
     * This example features two commands: `M`, with arguments `(10, 20)` and `L` with arguments `(30, 40)`. Uppercase letter commands express coordinates in absolute terms, while lowercase commands express them in relative terms from the most recently declared coordinates.
     *
     # <p>Here is short list of commands available, for more details see <a href="http://www.w3.org/TR/SVG/paths.html#PathData" title="Details of a path's data attribute's format are described in the SVG specification.">SVG path string format</a> or <a href="https://developer.mozilla.org/en/SVG/Tutorial/Paths">article about path strings at MDN</a>.</p>
     # <table><thead><tr><th>Command</th><th>Name</th><th>Parameters</th></tr></thead><tbody>
     # <tr><td>M</td><td>moveto</td><td>(x y)+</td></tr>
     # <tr><td>Z</td><td>closepath</td><td>(none)</td></tr>
     # <tr><td>L</td><td>lineto</td><td>(x y)+</td></tr>
     # <tr><td>H</td><td>horizontal lineto</td><td>x+</td></tr>
     # <tr><td>V</td><td>vertical lineto</td><td>y+</td></tr>
     # <tr><td>C</td><td>curveto</td><td>(x1 y1 x2 y2 x y)+</td></tr>
     # <tr><td>S</td><td>smooth curveto</td><td>(x2 y2 x y)+</td></tr>
     # <tr><td>Q</td><td>quadratic Bézier curveto</td><td>(x1 y1 x y)+</td></tr>
     # <tr><td>T</td><td>smooth quadratic Bézier curveto</td><td>(x y)+</td></tr>
     # <tr><td>A</td><td>elliptical arc</td><td>(rx ry x-axis-rotation large-arc-flag sweep-flag x y)+</td></tr>
     # <tr><td>R</td><td><a href="http://en.wikipedia.org/wiki/Catmull–Rom_spline#Catmull.E2.80.93Rom_spline">Catmull-Rom curveto</a>*</td><td>x1 y1 (x y)+</td></tr></tbody></table>
     * * _Catmull-Rom curveto_ is a not standard SVG command and added to make life easier.
     * Note: there is a special case when a path consists of only three commands: `M10,10R…z`. In this case the path connects back to its starting point.
     > Usage
     | var c = paper.path("M10 10L90 90");
     | // draw a diagonal line:
     | // move to 10,10, line to 90,90
    \*/
    proto.path = function (d) {
        var attr;
        if (is(d, "object") && !is(d, "array")) {
            attr = d;
        } else if (d) {
            attr = {d: d};
        }
        return this.el("path", attr);
    };
    /*\
     * Paper.g
     [ method ]
     **
     * Creates a group element
     **
     - varargs (…) #optional elements to nest within the group
     = (object) the `g` element
     **
     > Usage
     | var c1 = paper.circle(),
     |     c2 = paper.rect(),
     |     g = paper.g(c2, c1); // note that the order of elements is different
     * or
     | var c1 = paper.circle(),
     |     c2 = paper.rect(),
     |     g = paper.g();
     | g.add(c2, c1);
    \*/
    /*\
     * Paper.group
     [ method ]
     **
     * See @Paper.g
    \*/
    proto.group = proto.g = function (first) {
        var attr,
            el = this.el("g");
        if (arguments.length == 1 && first && !first.type) {
            el.attr(first);
        } else if (arguments.length) {
            el.add(Array.prototype.slice.call(arguments, 0));
        }
        return el;
    };
    /*\
     * Paper.svg
     [ method ]
     **
     * Creates a nested SVG element.
     - x (number) @optional X of the element
     - y (number) @optional Y of the element
     - width (number) @optional width of the element
     - height (number) @optional height of the element
     - vbx (number) @optional viewbox X
     - vby (number) @optional viewbox Y
     - vbw (number) @optional viewbox width
     - vbh (number) @optional viewbox height
     **
     = (object) the `svg` element
     **
    \*/
    proto.svg = function (x, y, width, height, vbx, vby, vbw, vbh) {
        var attrs = {};
        if (is(x, "object") && y == null) {
            attrs = x;
        } else {
            if (x != null) {
                attrs.x = x;
            }
            if (y != null) {
                attrs.y = y;
            }
            if (width != null) {
                attrs.width = width;
            }
            if (height != null) {
                attrs.height = height;
            }
            if (vbx != null && vby != null && vbw != null && vbh != null) {
                attrs.viewBox = [vbx, vby, vbw, vbh];
            }
        }
        return this.el("svg", attrs);
    };
    /*\
     * Paper.mask
     [ method ]
     **
     * Equivalent in behaviour to @Paper.g, except it’s a mask.
     **
     = (object) the `mask` element
     **
    \*/
    proto.mask = function (first) {
        var attr,
            el = this.el("mask");
        if (arguments.length == 1 && first && !first.type) {
            el.attr(first);
        } else if (arguments.length) {
            el.add(Array.prototype.slice.call(arguments, 0));
        }
        return el;
    };
    /*\
     * Paper.ptrn
     [ method ]
     **
     * Equivalent in behaviour to @Paper.g, except it’s a pattern.
     - x (number) @optional X of the element
     - y (number) @optional Y of the element
     - width (number) @optional width of the element
     - height (number) @optional height of the element
     - vbx (number) @optional viewbox X
     - vby (number) @optional viewbox Y
     - vbw (number) @optional viewbox width
     - vbh (number) @optional viewbox height
     **
     = (object) the `pattern` element
     **
    \*/
    proto.ptrn = function (x, y, width, height, vx, vy, vw, vh) {
        if (is(x, "object")) {
            var attr = x;
        } else {
            attr = {patternUnits: "userSpaceOnUse"};
            if (x) {
                attr.x = x;
            }
            if (y) {
                attr.y = y;
            }
            if (width != null) {
                attr.width = width;
            }
            if (height != null) {
                attr.height = height;
            }
            if (vx != null && vy != null && vw != null && vh != null) {
                attr.viewBox = [vx, vy, vw, vh];
            } else {
                attr.viewBox = [x || 0, y || 0, width || 0, height || 0];
            }
        }
        return this.el("pattern", attr);
    };
    /*\
     * Paper.use
     [ method ]
     **
     * Creates a <use> element.
     - id (string) @optional id of element to link
     * or
     - id (Element) @optional element to link
     **
     = (object) the `use` element
     **
    \*/
    proto.use = function (id) {
        if (id != null) {
            if (id instanceof Element) {
                if (!id.attr("id")) {
                    id.attr({id: Snap._.id(id)});
                }
                id = id.attr("id");
            }
            if (String(id).charAt() == "#") {
                id = id.substring(1);
            }
            return this.el("use", {"xlink:href": "#" + id});
        } else {
            return Element.prototype.use.call(this);
        }
    };
    /*\
     * Paper.symbol
     [ method ]
     **
     * Creates a <symbol> element.
     - vbx (number) @optional viewbox X
     - vby (number) @optional viewbox Y
     - vbw (number) @optional viewbox width
     - vbh (number) @optional viewbox height
     = (object) the `symbol` element
     **
    \*/
    proto.symbol = function (vx, vy, vw, vh) {
        var attr = {};
        if (vx != null && vy != null && vw != null && vh != null) {
            attr.viewBox = [vx, vy, vw, vh];
        }

        return this.el("symbol", attr);
    };
    /*\
     * Paper.text
     [ method ]
     **
     * Draws a text string
     **
     - x (number) x coordinate position
     - y (number) y coordinate position
     - text (string|array) The text string to draw or array of strings to nest within separate `<tspan>` elements
     = (object) the `text` element
     **
     > Usage
     | var t1 = paper.text(50, 50, "Snap");
     | var t2 = paper.text(50, 50, ["S","n","a","p"]);
     | // Text path usage
     | t1.attr({textpath: "M10,10L100,100"});
     | // or
     | var pth = paper.path("M10,10L100,100");
     | t1.attr({textpath: pth});
    \*/
    proto.text = function (x, y, text) {
        var attr = {};
        if (is(x, "object")) {
            attr = x;
        } else if (x != null) {
            attr = {
                x: x,
                y: y,
                text: text || ""
            };
        }
        return this.el("text", attr);
    };
    /*\
     * Paper.line
     [ method ]
     **
     * Draws a line
     **
     - x1 (number) x coordinate position of the start
     - y1 (number) y coordinate position of the start
     - x2 (number) x coordinate position of the end
     - y2 (number) y coordinate position of the end
     = (object) the `line` element
     **
     > Usage
     | var t1 = paper.line(50, 50, 100, 100);
    \*/
    proto.line = function (x1, y1, x2, y2) {
        var attr = {};
        if (is(x1, "object")) {
            attr = x1;
        } else if (x1 != null) {
            attr = {
                x1: x1,
                x2: x2,
                y1: y1,
                y2: y2
            };
        }
        return this.el("line", attr);
    };
    /*\
     * Paper.polyline
     [ method ]
     **
     * Draws a polyline
     **
     - points (array) array of points
     * or
     - varargs (…) points
     = (object) the `polyline` element
     **
     > Usage
     | var p1 = paper.polyline([10, 10, 100, 100]);
     | var p2 = paper.polyline(10, 10, 100, 100);
    \*/
    proto.polyline = function (points) {
        if (arguments.length > 1) {
            points = Array.prototype.slice.call(arguments, 0);
        }
        var attr = {};
        if (is(points, "object") && !is(points, "array")) {
            attr = points;
        } else if (points != null) {
            attr = {points: points};
        }
        return this.el("polyline", attr);
    };
    /*\
     * Paper.polygon
     [ method ]
     **
     * Draws a polygon. See @Paper.polyline
    \*/
    proto.polygon = function (points) {
        if (arguments.length > 1) {
            points = Array.prototype.slice.call(arguments, 0);
        }
        var attr = {};
        if (is(points, "object") && !is(points, "array")) {
            attr = points;
        } else if (points != null) {
            attr = {points: points};
        }
        return this.el("polygon", attr);
    };
    // gradients
    (function () {
        var $ = Snap._.$;
        // gradients' helpers
        /*\
         * Element.stops
         [ method ]
         **
         * Only for gradients!
         * Returns array of gradient stops elements.
         = (array) the stops array.
        \*/
        function Gstops() {
            return this.selectAll("stop");
        }
        /*\
         * Element.addStop
         [ method ]
         **
         * Only for gradients!
         * Adds another stop to the gradient.
         - color (string) stops color
         - offset (number) stops offset 0..100
         = (object) gradient element
        \*/
        function GaddStop(color, offset) {
            var stop = $("stop"),
                attr = {
                    offset: +offset + "%"
                };
            color = Snap.color(color);
            attr["stop-color"] = color.hex;
            if (color.opacity < 1) {
                attr["stop-opacity"] = color.opacity;
            }
            $(stop, attr);
            var stops = this.stops(),
                inserted;
            for (var i = 0; i < stops.length; i++) {
                var stopOffset = parseFloat(stops[i].attr("offset"));
                if (stopOffset > offset) {
                    this.node.insertBefore(stop, stops[i].node);
                    inserted = true;
                    break;
                }
            }
            if (!inserted) {
                this.node.appendChild(stop);
            }
            return this;
        }
        function GgetBBox() {
            if (this.type == "linearGradient") {
                var x1 = $(this.node, "x1") || 0,
                    x2 = $(this.node, "x2") || 1,
                    y1 = $(this.node, "y1") || 0,
                    y2 = $(this.node, "y2") || 0;
                return Snap._.box(x1, y1, math.abs(x2 - x1), math.abs(y2 - y1));
            } else {
                var cx = this.node.cx || .5,
                    cy = this.node.cy || .5,
                    r = this.node.r || 0;
                return Snap._.box(cx - r, cy - r, r * 2, r * 2);
            }
        }
        /*\
         * Element.setStops
         [ method ]
         **
         * Only for gradients!
         * Updates stops of the gradient based on passed gradient descriptor. See @Ppaer.gradient
         - str (string) gradient descriptor part after `()`.
         = (object) gradient element
         | var g = paper.gradient("l(0, 0, 1, 1)#000-#f00-#fff");
         | g.setStops("#fff-#000-#f00-#fc0");
        \*/
        function GsetStops(str) {
            var grad = str,
                stops = this.stops();
            if (typeof str == "string") {
                grad = eve("snap.util.grad.parse", null, "l(0,0,0,1)" + str).firstDefined().stops;
            }
            if (!Snap.is(grad, "array")) {
                return;
            }
            for (var i = 0; i < stops.length; i++) {
                if (grad[i]) {
                    var color = Snap.color(grad[i].color),
                        attr = {"offset": grad[i].offset + "%"};
                    attr["stop-color"] = color.hex;
                    if (color.opacity < 1) {
                        attr["stop-opacity"] = color.opacity;
                    }
                    stops[i].attr(attr);
                } else {
                    stops[i].remove();
                }
            }
            for (i = stops.length; i < grad.length; i++) {
                this.addStop(grad[i].color, grad[i].offset);
            }
            return this;
        }
        function gradient(defs, str) {
            var grad = eve("snap.util.grad.parse", null, str).firstDefined(),
                el;
            if (!grad) {
                return null;
            }
            grad.params.unshift(defs);
            if (grad.type.toLowerCase() == "l") {
                el = gradientLinear.apply(0, grad.params);
            } else {
                el = gradientRadial.apply(0, grad.params);
            }
            if (grad.type != grad.type.toLowerCase()) {
                $(el.node, {
                    gradientUnits: "userSpaceOnUse"
                });
            }
            var stops = grad.stops,
                len = stops.length;
            for (var i = 0; i < len; i++) {
                var stop = stops[i];
                el.addStop(stop.color, stop.offset);
            }
            return el;
        }
        function gradientLinear(defs, x1, y1, x2, y2) {
            var el = Snap._.make("linearGradient", defs);
            el.stops = Gstops;
            el.addStop = GaddStop;
            el.getBBox = GgetBBox;
            el.setStops = GsetStops;
            if (x1 != null) {
                $(el.node, {
                    x1: x1,
                    y1: y1,
                    x2: x2,
                    y2: y2
                });
            }
            return el;
        }
        function gradientRadial(defs, cx, cy, r, fx, fy) {
            var el = Snap._.make("radialGradient", defs);
            el.stops = Gstops;
            el.addStop = GaddStop;
            el.getBBox = GgetBBox;
            if (cx != null) {
                $(el.node, {
                    cx: cx,
                    cy: cy,
                    r: r
                });
            }
            if (fx != null && fy != null) {
                $(el.node, {
                    fx: fx,
                    fy: fy
                });
            }
            return el;
        }
        /*\
         * Paper.gradient
         [ method ]
         **
         * Creates a gradient element
         **
         - gradient (string) gradient descriptor
         > Gradient Descriptor
         * The gradient descriptor is an expression formatted as
         * follows: `<type>(<coords>)<colors>`.  The `<type>` can be
         * either linear or radial.  The uppercase `L` or `R` letters
         * indicate absolute coordinates offset from the SVG surface.
         * Lowercase `l` or `r` letters indicate coordinates
         * calculated relative to the element to which the gradient is
         * applied.  Coordinates specify a linear gradient vector as
         * `x1`, `y1`, `x2`, `y2`, or a radial gradient as `cx`, `cy`,
         * `r` and optional `fx`, `fy` specifying a focal point away
         * from the center of the circle. Specify `<colors>` as a list
         * of dash-separated CSS color values.  Each color may be
         * followed by a custom offset value, separated with a colon
         * character.
         > Examples
         * Linear gradient, relative from top-left corner to bottom-right
         * corner, from black through red to white:
         | var g = paper.gradient("l(0, 0, 1, 1)#000-#f00-#fff");
         * Linear gradient, absolute from (0, 0) to (100, 100), from black
         * through red at 25% to white:
         | var g = paper.gradient("L(0, 0, 100, 100)#000-#f00:25-#fff");
         * Radial gradient, relative from the center of the element with radius
         * half the width, from black to white:
         | var g = paper.gradient("r(0.5, 0.5, 0.5)#000-#fff");
         * To apply the gradient:
         | paper.circle(50, 50, 40).attr({
         |     fill: g
         | });
         = (object) the `gradient` element
        \*/
        proto.gradient = function (str) {
            return gradient(this.defs, str);
        };
        proto.gradientLinear = function (x1, y1, x2, y2) {
            return gradientLinear(this.defs, x1, y1, x2, y2);
        };
        proto.gradientRadial = function (cx, cy, r, fx, fy) {
            return gradientRadial(this.defs, cx, cy, r, fx, fy);
        };
        /*\
         * Paper.toString
         [ method ]
         **
         * Returns SVG code for the @Paper
         = (string) SVG code for the @Paper
        \*/
        proto.toString = function () {
            var doc = this.node.ownerDocument,
                f = doc.createDocumentFragment(),
                d = doc.createElement("div"),
                svg = this.node.cloneNode(true),
                res;
            f.appendChild(d);
            d.appendChild(svg);
            Snap._.$(svg, {xmlns: "http://www.w3.org/2000/svg"});
            res = d.innerHTML;
            f.removeChild(f.firstChild);
            return res;
        };
        /*\
         * Paper.toDataURL
         [ method ]
         **
         * Returns SVG code for the @Paper as Data URI string.
         = (string) Data URI string
        \*/
        proto.toDataURL = function () {
            if (window && window.btoa) {
                return "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(this)));
            }
        };
        /*\
         * Paper.clear
         [ method ]
         **
         * Removes all child nodes of the paper, except <defs>.
        \*/
        proto.clear = function () {
            var node = this.node.firstChild,
                next;
            while (node) {
                next = node.nextSibling;
                if (node.tagName != "defs") {
                    node.parentNode.removeChild(node);
                } else {
                    proto.clear.call({node: node});
                }
                node = next;
            }
        };
    }());
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob) {
    var elproto = Element.prototype,
        is = Snap.is,
        clone = Snap._.clone,
        has = "hasOwnProperty",
        p2s = /,?([a-z]),?/gi,
        toFloat = parseFloat,
        math = Math,
        PI = math.PI,
        mmin = math.min,
        mmax = math.max,
        pow = math.pow,
        abs = math.abs;
    function paths(ps) {
        var p = paths.ps = paths.ps || {};
        if (p[ps]) {
            p[ps].sleep = 100;
        } else {
            p[ps] = {
                sleep: 100
            };
        }
        setTimeout(function () {
            for (var key in p) if (p[has](key) && key != ps) {
                p[key].sleep--;
                !p[key].sleep && delete p[key];
            }
        });
        return p[ps];
    }
    function box(x, y, width, height) {
        if (x == null) {
            x = y = width = height = 0;
        }
        if (y == null) {
            y = x.y;
            width = x.width;
            height = x.height;
            x = x.x;
        }
        return {
            x: x,
            y: y,
            width: width,
            w: width,
            height: height,
            h: height,
            x2: x + width,
            y2: y + height,
            cx: x + width / 2,
            cy: y + height / 2,
            r1: math.min(width, height) / 2,
            r2: math.max(width, height) / 2,
            r0: math.sqrt(width * width + height * height) / 2,
            path: rectPath(x, y, width, height),
            vb: [x, y, width, height].join(" ")
        };
    }
    function toString() {
        return this.join(",").replace(p2s, "$1");
    }
    function pathClone(pathArray) {
        var res = clone(pathArray);
        res.toString = toString;
        return res;
    }
    function getPointAtSegmentLength(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length) {
        if (length == null) {
            return bezlen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y);
        } else {
            return findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y,
                getTotLen(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, length));
        }
    }
    function getLengthFactory(istotal, subpath) {
        function O(val) {
            return +(+val).toFixed(3);
        }
        return Snap._.cacher(function (path, length, onlystart) {
            if (path instanceof Element) {
                path = path.attr("d");
            }
            path = path2curve(path);
            var x, y, p, l, sp = "", subpaths = {}, point,
                len = 0;
            for (var i = 0, ii = path.length; i < ii; i++) {
                p = path[i];
                if (p[0] == "M") {
                    x = +p[1];
                    y = +p[2];
                } else {
                    l = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                    if (len + l > length) {
                        if (subpath && !subpaths.start) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            sp += [
                                "C" + O(point.start.x),
                                O(point.start.y),
                                O(point.m.x),
                                O(point.m.y),
                                O(point.x),
                                O(point.y)
                            ];
                            if (onlystart) {return sp;}
                            subpaths.start = sp;
                            sp = [
                                "M" + O(point.x),
                                O(point.y) + "C" + O(point.n.x),
                                O(point.n.y),
                                O(point.end.x),
                                O(point.end.y),
                                O(p[5]),
                                O(p[6])
                            ].join();
                            len += l;
                            x = +p[5];
                            y = +p[6];
                            continue;
                        }
                        if (!istotal && !subpath) {
                            point = getPointAtSegmentLength(x, y, p[1], p[2], p[3], p[4], p[5], p[6], length - len);
                            return point;
                        }
                    }
                    len += l;
                    x = +p[5];
                    y = +p[6];
                }
                sp += p.shift() + p;
            }
            subpaths.end = sp;
            point = istotal ? len : subpath ? subpaths : findDotsAtSegment(x, y, p[0], p[1], p[2], p[3], p[4], p[5], 1);
            return point;
        }, null, Snap._.clone);
    }
    var getTotalLength = getLengthFactory(1),
        getPointAtLength = getLengthFactory(),
        getSubpathsAtLength = getLengthFactory(0, 1);
    function findDotsAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
        var t1 = 1 - t,
            t13 = pow(t1, 3),
            t12 = pow(t1, 2),
            t2 = t * t,
            t3 = t2 * t,
            x = t13 * p1x + t12 * 3 * t * c1x + t1 * 3 * t * t * c2x + t3 * p2x,
            y = t13 * p1y + t12 * 3 * t * c1y + t1 * 3 * t * t * c2y + t3 * p2y,
            mx = p1x + 2 * t * (c1x - p1x) + t2 * (c2x - 2 * c1x + p1x),
            my = p1y + 2 * t * (c1y - p1y) + t2 * (c2y - 2 * c1y + p1y),
            nx = c1x + 2 * t * (c2x - c1x) + t2 * (p2x - 2 * c2x + c1x),
            ny = c1y + 2 * t * (c2y - c1y) + t2 * (p2y - 2 * c2y + c1y),
            ax = t1 * p1x + t * c1x,
            ay = t1 * p1y + t * c1y,
            cx = t1 * c2x + t * p2x,
            cy = t1 * c2y + t * p2y,
            alpha = 90 - math.atan2(mx - nx, my - ny) * 180 / PI;
        // (mx > nx || my < ny) && (alpha += 180);
        return {
            x: x,
            y: y,
            m: {x: mx, y: my},
            n: {x: nx, y: ny},
            start: {x: ax, y: ay},
            end: {x: cx, y: cy},
            alpha: alpha
        };
    }
    function bezierBBox(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y) {
        if (!Snap.is(p1x, "array")) {
            p1x = [p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y];
        }
        var bbox = curveDim.apply(null, p1x);
        return box(
            bbox.min.x,
            bbox.min.y,
            bbox.max.x - bbox.min.x,
            bbox.max.y - bbox.min.y
        );
    }
    function isPointInsideBBox(bbox, x, y) {
        return  x >= bbox.x &&
                x <= bbox.x + bbox.width &&
                y >= bbox.y &&
                y <= bbox.y + bbox.height;
    }
    function isBBoxIntersect(bbox1, bbox2) {
        bbox1 = box(bbox1);
        bbox2 = box(bbox2);
        return isPointInsideBBox(bbox2, bbox1.x, bbox1.y)
            || isPointInsideBBox(bbox2, bbox1.x2, bbox1.y)
            || isPointInsideBBox(bbox2, bbox1.x, bbox1.y2)
            || isPointInsideBBox(bbox2, bbox1.x2, bbox1.y2)
            || isPointInsideBBox(bbox1, bbox2.x, bbox2.y)
            || isPointInsideBBox(bbox1, bbox2.x2, bbox2.y)
            || isPointInsideBBox(bbox1, bbox2.x, bbox2.y2)
            || isPointInsideBBox(bbox1, bbox2.x2, bbox2.y2)
            || (bbox1.x < bbox2.x2 && bbox1.x > bbox2.x
                || bbox2.x < bbox1.x2 && bbox2.x > bbox1.x)
            && (bbox1.y < bbox2.y2 && bbox1.y > bbox2.y
                || bbox2.y < bbox1.y2 && bbox2.y > bbox1.y);
    }
    function base3(t, p1, p2, p3, p4) {
        var t1 = -3 * p1 + 9 * p2 - 9 * p3 + 3 * p4,
            t2 = t * t1 + 6 * p1 - 12 * p2 + 6 * p3;
        return t * t2 - 3 * p1 + 3 * p2;
    }
    function bezlen(x1, y1, x2, y2, x3, y3, x4, y4, z) {
        if (z == null) {
            z = 1;
        }
        z = z > 1 ? 1 : z < 0 ? 0 : z;
        var z2 = z / 2,
            n = 12,
            Tvalues = [-.1252,.1252,-.3678,.3678,-.5873,.5873,-.7699,.7699,-.9041,.9041,-.9816,.9816],
            Cvalues = [0.2491,0.2491,0.2335,0.2335,0.2032,0.2032,0.1601,0.1601,0.1069,0.1069,0.0472,0.0472],
            sum = 0;
        for (var i = 0; i < n; i++) {
            var ct = z2 * Tvalues[i] + z2,
                xbase = base3(ct, x1, x2, x3, x4),
                ybase = base3(ct, y1, y2, y3, y4),
                comb = xbase * xbase + ybase * ybase;
            sum += Cvalues[i] * math.sqrt(comb);
        }
        return z2 * sum;
    }
    function getTotLen(x1, y1, x2, y2, x3, y3, x4, y4, ll) {
        if (ll < 0 || bezlen(x1, y1, x2, y2, x3, y3, x4, y4) < ll) {
            return;
        }
        var t = 1,
            step = t / 2,
            t2 = t - step,
            l,
            e = .01;
        l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
        while (abs(l - ll) > e) {
            step /= 2;
            t2 += (l < ll ? 1 : -1) * step;
            l = bezlen(x1, y1, x2, y2, x3, y3, x4, y4, t2);
        }
        return t2;
    }
    function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
        if (
            mmax(x1, x2) < mmin(x3, x4) ||
            mmin(x1, x2) > mmax(x3, x4) ||
            mmax(y1, y2) < mmin(y3, y4) ||
            mmin(y1, y2) > mmax(y3, y4)
        ) {
            return;
        }
        var nx = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4),
            ny = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4),
            denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);

        if (!denominator) {
            return;
        }
        var px = nx / denominator,
            py = ny / denominator,
            px2 = +px.toFixed(2),
            py2 = +py.toFixed(2);
        if (
            px2 < +mmin(x1, x2).toFixed(2) ||
            px2 > +mmax(x1, x2).toFixed(2) ||
            px2 < +mmin(x3, x4).toFixed(2) ||
            px2 > +mmax(x3, x4).toFixed(2) ||
            py2 < +mmin(y1, y2).toFixed(2) ||
            py2 > +mmax(y1, y2).toFixed(2) ||
            py2 < +mmin(y3, y4).toFixed(2) ||
            py2 > +mmax(y3, y4).toFixed(2)
        ) {
            return;
        }
        return {x: px, y: py};
    }
    function inter(bez1, bez2) {
        return interHelper(bez1, bez2);
    }
    function interCount(bez1, bez2) {
        return interHelper(bez1, bez2, 1);
    }
    function interHelper(bez1, bez2, justCount) {
        var bbox1 = bezierBBox(bez1),
            bbox2 = bezierBBox(bez2);
        if (!isBBoxIntersect(bbox1, bbox2)) {
            return justCount ? 0 : [];
        }
        var l1 = bezlen.apply(0, bez1),
            l2 = bezlen.apply(0, bez2),
            n1 = ~~(l1 / 8),
            n2 = ~~(l2 / 8),
            dots1 = [],
            dots2 = [],
            xy = {},
            res = justCount ? 0 : [];
        for (var i = 0; i < n1 + 1; i++) {
            var p = findDotsAtSegment.apply(0, bez1.concat(i / n1));
            dots1.push({x: p.x, y: p.y, t: i / n1});
        }
        for (i = 0; i < n2 + 1; i++) {
            p = findDotsAtSegment.apply(0, bez2.concat(i / n2));
            dots2.push({x: p.x, y: p.y, t: i / n2});
        }
        for (i = 0; i < n1; i++) {
            for (var j = 0; j < n2; j++) {
                var di = dots1[i],
                    di1 = dots1[i + 1],
                    dj = dots2[j],
                    dj1 = dots2[j + 1],
                    ci = abs(di1.x - di.x) < .001 ? "y" : "x",
                    cj = abs(dj1.x - dj.x) < .001 ? "y" : "x",
                    is = intersect(di.x, di.y, di1.x, di1.y, dj.x, dj.y, dj1.x, dj1.y);
                if (is) {
                    if (xy[is.x.toFixed(4)] == is.y.toFixed(4)) {
                        continue;
                    }
                    xy[is.x.toFixed(4)] = is.y.toFixed(4);
                    var t1 = di.t + abs((is[ci] - di[ci]) / (di1[ci] - di[ci])) * (di1.t - di.t),
                        t2 = dj.t + abs((is[cj] - dj[cj]) / (dj1[cj] - dj[cj])) * (dj1.t - dj.t);
                    if (t1 >= 0 && t1 <= 1 && t2 >= 0 && t2 <= 1) {
                        if (justCount) {
                            res++;
                        } else {
                            res.push({
                                x: is.x,
                                y: is.y,
                                t1: t1,
                                t2: t2
                            });
                        }
                    }
                }
            }
        }
        return res;
    }
    function pathIntersection(path1, path2) {
        return interPathHelper(path1, path2);
    }
    function pathIntersectionNumber(path1, path2) {
        return interPathHelper(path1, path2, 1);
    }
    function interPathHelper(path1, path2, justCount) {
        path1 = path2curve(path1);
        path2 = path2curve(path2);
        var x1, y1, x2, y2, x1m, y1m, x2m, y2m, bez1, bez2,
            res = justCount ? 0 : [];
        for (var i = 0, ii = path1.length; i < ii; i++) {
            var pi = path1[i];
            if (pi[0] == "M") {
                x1 = x1m = pi[1];
                y1 = y1m = pi[2];
            } else {
                if (pi[0] == "C") {
                    bez1 = [x1, y1].concat(pi.slice(1));
                    x1 = bez1[6];
                    y1 = bez1[7];
                } else {
                    bez1 = [x1, y1, x1, y1, x1m, y1m, x1m, y1m];
                    x1 = x1m;
                    y1 = y1m;
                }
                for (var j = 0, jj = path2.length; j < jj; j++) {
                    var pj = path2[j];
                    if (pj[0] == "M") {
                        x2 = x2m = pj[1];
                        y2 = y2m = pj[2];
                    } else {
                        if (pj[0] == "C") {
                            bez2 = [x2, y2].concat(pj.slice(1));
                            x2 = bez2[6];
                            y2 = bez2[7];
                        } else {
                            bez2 = [x2, y2, x2, y2, x2m, y2m, x2m, y2m];
                            x2 = x2m;
                            y2 = y2m;
                        }
                        var intr = interHelper(bez1, bez2, justCount);
                        if (justCount) {
                            res += intr;
                        } else {
                            for (var k = 0, kk = intr.length; k < kk; k++) {
                                intr[k].segment1 = i;
                                intr[k].segment2 = j;
                                intr[k].bez1 = bez1;
                                intr[k].bez2 = bez2;
                            }
                            res = res.concat(intr);
                        }
                    }
                }
            }
        }
        return res;
    }
    function isPointInsidePath(path, x, y) {
        var bbox = pathBBox(path);
        return isPointInsideBBox(bbox, x, y) &&
               interPathHelper(path, [["M", x, y], ["H", bbox.x2 + 10]], 1) % 2 == 1;
    }
    function pathBBox(path) {
        var pth = paths(path);
        if (pth.bbox) {
            return clone(pth.bbox);
        }
        if (!path) {
            return box();
        }
        path = path2curve(path);
        var x = 0,
            y = 0,
            X = [],
            Y = [],
            p;
        for (var i = 0, ii = path.length; i < ii; i++) {
            p = path[i];
            if (p[0] == "M") {
                x = p[1];
                y = p[2];
                X.push(x);
                Y.push(y);
            } else {
                var dim = curveDim(x, y, p[1], p[2], p[3], p[4], p[5], p[6]);
                X = X.concat(dim.min.x, dim.max.x);
                Y = Y.concat(dim.min.y, dim.max.y);
                x = p[5];
                y = p[6];
            }
        }
        var xmin = mmin.apply(0, X),
            ymin = mmin.apply(0, Y),
            xmax = mmax.apply(0, X),
            ymax = mmax.apply(0, Y),
            bb = box(xmin, ymin, xmax - xmin, ymax - ymin);
        pth.bbox = clone(bb);
        return bb;
    }
    function rectPath(x, y, w, h, r) {
        if (r) {
            return [
                ["M", +x + +r, y],
                ["l", w - r * 2, 0],
                ["a", r, r, 0, 0, 1, r, r],
                ["l", 0, h - r * 2],
                ["a", r, r, 0, 0, 1, -r, r],
                ["l", r * 2 - w, 0],
                ["a", r, r, 0, 0, 1, -r, -r],
                ["l", 0, r * 2 - h],
                ["a", r, r, 0, 0, 1, r, -r],
                ["z"]
            ];
        }
        var res = [["M", x, y], ["l", w, 0], ["l", 0, h], ["l", -w, 0], ["z"]];
        res.toString = toString;
        return res;
    }
    function ellipsePath(x, y, rx, ry, a) {
        if (a == null && ry == null) {
            ry = rx;
        }
        x = +x;
        y = +y;
        rx = +rx;
        ry = +ry;
        if (a != null) {
            var rad = Math.PI / 180,
                x1 = x + rx * Math.cos(-ry * rad),
                x2 = x + rx * Math.cos(-a * rad),
                y1 = y + rx * Math.sin(-ry * rad),
                y2 = y + rx * Math.sin(-a * rad),
                res = [["M", x1, y1], ["A", rx, rx, 0, +(a - ry > 180), 0, x2, y2]];
        } else {
            res = [
                ["M", x, y],
                ["m", 0, -ry],
                ["a", rx, ry, 0, 1, 1, 0, 2 * ry],
                ["a", rx, ry, 0, 1, 1, 0, -2 * ry],
                ["z"]
            ];
        }
        res.toString = toString;
        return res;
    }
    var unit2px = Snap._unit2px,
        getPath = {
        path: function (el) {
            return el.attr("path");
        },
        circle: function (el) {
            var attr = unit2px(el);
            return ellipsePath(attr.cx, attr.cy, attr.r);
        },
        ellipse: function (el) {
            var attr = unit2px(el);
            return ellipsePath(attr.cx || 0, attr.cy || 0, attr.rx, attr.ry);
        },
        rect: function (el) {
            var attr = unit2px(el);
            return rectPath(attr.x || 0, attr.y || 0, attr.width, attr.height, attr.rx, attr.ry);
        },
        image: function (el) {
            var attr = unit2px(el);
            return rectPath(attr.x || 0, attr.y || 0, attr.width, attr.height);
        },
        line: function (el) {
            return "M" + [el.attr("x1") || 0, el.attr("y1") || 0, el.attr("x2"), el.attr("y2")];
        },
        polyline: function (el) {
            return "M" + el.attr("points");
        },
        polygon: function (el) {
            return "M" + el.attr("points") + "z";
        },
        deflt: function (el) {
            var bbox = el.node.getBBox();
            return rectPath(bbox.x, bbox.y, bbox.width, bbox.height);
        }
    };
    function pathToRelative(pathArray) {
        var pth = paths(pathArray),
            lowerCase = String.prototype.toLowerCase;
        if (pth.rel) {
            return pathClone(pth.rel);
        }
        if (!Snap.is(pathArray, "array") || !Snap.is(pathArray && pathArray[0], "array")) {
            pathArray = Snap.parsePathString(pathArray);
        }
        var res = [],
            x = 0,
            y = 0,
            mx = 0,
            my = 0,
            start = 0;
        if (pathArray[0][0] == "M") {
            x = pathArray[0][1];
            y = pathArray[0][2];
            mx = x;
            my = y;
            start++;
            res.push(["M", x, y]);
        }
        for (var i = start, ii = pathArray.length; i < ii; i++) {
            var r = res[i] = [],
                pa = pathArray[i];
            if (pa[0] != lowerCase.call(pa[0])) {
                r[0] = lowerCase.call(pa[0]);
                switch (r[0]) {
                    case "a":
                        r[1] = pa[1];
                        r[2] = pa[2];
                        r[3] = pa[3];
                        r[4] = pa[4];
                        r[5] = pa[5];
                        r[6] = +(pa[6] - x).toFixed(3);
                        r[7] = +(pa[7] - y).toFixed(3);
                        break;
                    case "v":
                        r[1] = +(pa[1] - y).toFixed(3);
                        break;
                    case "m":
                        mx = pa[1];
                        my = pa[2];
                    default:
                        for (var j = 1, jj = pa.length; j < jj; j++) {
                            r[j] = +(pa[j] - (j % 2 ? x : y)).toFixed(3);
                        }
                }
            } else {
                r = res[i] = [];
                if (pa[0] == "m") {
                    mx = pa[1] + x;
                    my = pa[2] + y;
                }
                for (var k = 0, kk = pa.length; k < kk; k++) {
                    res[i][k] = pa[k];
                }
            }
            var len = res[i].length;
            switch (res[i][0]) {
                case "z":
                    x = mx;
                    y = my;
                    break;
                case "h":
                    x += +res[i][len - 1];
                    break;
                case "v":
                    y += +res[i][len - 1];
                    break;
                default:
                    x += +res[i][len - 2];
                    y += +res[i][len - 1];
            }
        }
        res.toString = toString;
        pth.rel = pathClone(res);
        return res;
    }
    function pathToAbsolute(pathArray) {
        var pth = paths(pathArray);
        if (pth.abs) {
            return pathClone(pth.abs);
        }
        if (!is(pathArray, "array") || !is(pathArray && pathArray[0], "array")) { // rough assumption
            pathArray = Snap.parsePathString(pathArray);
        }
        if (!pathArray || !pathArray.length) {
            return [["M", 0, 0]];
        }
        var res = [],
            x = 0,
            y = 0,
            mx = 0,
            my = 0,
            start = 0,
            pa0;
        if (pathArray[0][0] == "M") {
            x = +pathArray[0][1];
            y = +pathArray[0][2];
            mx = x;
            my = y;
            start++;
            res[0] = ["M", x, y];
        }
        var crz = pathArray.length == 3 &&
            pathArray[0][0] == "M" &&
            pathArray[1][0].toUpperCase() == "R" &&
            pathArray[2][0].toUpperCase() == "Z";
        for (var r, pa, i = start, ii = pathArray.length; i < ii; i++) {
            res.push(r = []);
            pa = pathArray[i];
            pa0 = pa[0];
            if (pa0 != pa0.toUpperCase()) {
                r[0] = pa0.toUpperCase();
                switch (r[0]) {
                    case "A":
                        r[1] = pa[1];
                        r[2] = pa[2];
                        r[3] = pa[3];
                        r[4] = pa[4];
                        r[5] = pa[5];
                        r[6] = +pa[6] + x;
                        r[7] = +pa[7] + y;
                        break;
                    case "V":
                        r[1] = +pa[1] + y;
                        break;
                    case "H":
                        r[1] = +pa[1] + x;
                        break;
                    case "R":
                        var dots = [x, y].concat(pa.slice(1));
                        for (var j = 2, jj = dots.length; j < jj; j++) {
                            dots[j] = +dots[j] + x;
                            dots[++j] = +dots[j] + y;
                        }
                        res.pop();
                        res = res.concat(catmullRom2bezier(dots, crz));
                        break;
                    case "O":
                        res.pop();
                        dots = ellipsePath(x, y, pa[1], pa[2]);
                        dots.push(dots[0]);
                        res = res.concat(dots);
                        break;
                    case "U":
                        res.pop();
                        res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
                        r = ["U"].concat(res[res.length - 1].slice(-2));
                        break;
                    case "M":
                        mx = +pa[1] + x;
                        my = +pa[2] + y;
                    default:
                        for (j = 1, jj = pa.length; j < jj; j++) {
                            r[j] = +pa[j] + (j % 2 ? x : y);
                        }
                }
            } else if (pa0 == "R") {
                dots = [x, y].concat(pa.slice(1));
                res.pop();
                res = res.concat(catmullRom2bezier(dots, crz));
                r = ["R"].concat(pa.slice(-2));
            } else if (pa0 == "O") {
                res.pop();
                dots = ellipsePath(x, y, pa[1], pa[2]);
                dots.push(dots[0]);
                res = res.concat(dots);
            } else if (pa0 == "U") {
                res.pop();
                res = res.concat(ellipsePath(x, y, pa[1], pa[2], pa[3]));
                r = ["U"].concat(res[res.length - 1].slice(-2));
            } else {
                for (var k = 0, kk = pa.length; k < kk; k++) {
                    r[k] = pa[k];
                }
            }
            pa0 = pa0.toUpperCase();
            if (pa0 != "O") {
                switch (r[0]) {
                    case "Z":
                        x = +mx;
                        y = +my;
                        break;
                    case "H":
                        x = r[1];
                        break;
                    case "V":
                        y = r[1];
                        break;
                    case "M":
                        mx = r[r.length - 2];
                        my = r[r.length - 1];
                    default:
                        x = r[r.length - 2];
                        y = r[r.length - 1];
                }
            }
        }
        res.toString = toString;
        pth.abs = pathClone(res);
        return res;
    }
    function l2c(x1, y1, x2, y2) {
        return [x1, y1, x2, y2, x2, y2];
    }
    function q2c(x1, y1, ax, ay, x2, y2) {
        var _13 = 1 / 3,
            _23 = 2 / 3;
        return [
                _13 * x1 + _23 * ax,
                _13 * y1 + _23 * ay,
                _13 * x2 + _23 * ax,
                _13 * y2 + _23 * ay,
                x2,
                y2
            ];
    }
    function a2c(x1, y1, rx, ry, angle, large_arc_flag, sweep_flag, x2, y2, recursive) {
        // for more information of where this math came from visit:
        // http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
        var _120 = PI * 120 / 180,
            rad = PI / 180 * (+angle || 0),
            res = [],
            xy,
            rotate = Snap._.cacher(function (x, y, rad) {
                var X = x * math.cos(rad) - y * math.sin(rad),
                    Y = x * math.sin(rad) + y * math.cos(rad);
                return {x: X, y: Y};
            });
        if (!rx || !ry) {
            return [x1, y1, x2, y2, x2, y2];
        }
        if (!recursive) {
            xy = rotate(x1, y1, -rad);
            x1 = xy.x;
            y1 = xy.y;
            xy = rotate(x2, y2, -rad);
            x2 = xy.x;
            y2 = xy.y;
            var cos = math.cos(PI / 180 * angle),
                sin = math.sin(PI / 180 * angle),
                x = (x1 - x2) / 2,
                y = (y1 - y2) / 2;
            var h = x * x / (rx * rx) + y * y / (ry * ry);
            if (h > 1) {
                h = math.sqrt(h);
                rx = h * rx;
                ry = h * ry;
            }
            var rx2 = rx * rx,
                ry2 = ry * ry,
                k = (large_arc_flag == sweep_flag ? -1 : 1) *
                    math.sqrt(abs((rx2 * ry2 - rx2 * y * y - ry2 * x * x) / (rx2 * y * y + ry2 * x * x))),
                cx = k * rx * y / ry + (x1 + x2) / 2,
                cy = k * -ry * x / rx + (y1 + y2) / 2,
                f1 = math.asin(((y1 - cy) / ry).toFixed(9)),
                f2 = math.asin(((y2 - cy) / ry).toFixed(9));

            f1 = x1 < cx ? PI - f1 : f1;
            f2 = x2 < cx ? PI - f2 : f2;
            f1 < 0 && (f1 = PI * 2 + f1);
            f2 < 0 && (f2 = PI * 2 + f2);
            if (sweep_flag && f1 > f2) {
                f1 = f1 - PI * 2;
            }
            if (!sweep_flag && f2 > f1) {
                f2 = f2 - PI * 2;
            }
        } else {
            f1 = recursive[0];
            f2 = recursive[1];
            cx = recursive[2];
            cy = recursive[3];
        }
        var df = f2 - f1;
        if (abs(df) > _120) {
            var f2old = f2,
                x2old = x2,
                y2old = y2;
            f2 = f1 + _120 * (sweep_flag && f2 > f1 ? 1 : -1);
            x2 = cx + rx * math.cos(f2);
            y2 = cy + ry * math.sin(f2);
            res = a2c(x2, y2, rx, ry, angle, 0, sweep_flag, x2old, y2old, [f2, f2old, cx, cy]);
        }
        df = f2 - f1;
        var c1 = math.cos(f1),
            s1 = math.sin(f1),
            c2 = math.cos(f2),
            s2 = math.sin(f2),
            t = math.tan(df / 4),
            hx = 4 / 3 * rx * t,
            hy = 4 / 3 * ry * t,
            m1 = [x1, y1],
            m2 = [x1 + hx * s1, y1 - hy * c1],
            m3 = [x2 + hx * s2, y2 - hy * c2],
            m4 = [x2, y2];
        m2[0] = 2 * m1[0] - m2[0];
        m2[1] = 2 * m1[1] - m2[1];
        if (recursive) {
            return [m2, m3, m4].concat(res);
        } else {
            res = [m2, m3, m4].concat(res).join().split(",");
            var newres = [];
            for (var i = 0, ii = res.length; i < ii; i++) {
                newres[i] = i % 2 ? rotate(res[i - 1], res[i], rad).y : rotate(res[i], res[i + 1], rad).x;
            }
            return newres;
        }
    }
    function findDotAtSegment(p1x, p1y, c1x, c1y, c2x, c2y, p2x, p2y, t) {
        var t1 = 1 - t;
        return {
            x: pow(t1, 3) * p1x + pow(t1, 2) * 3 * t * c1x + t1 * 3 * t * t * c2x + pow(t, 3) * p2x,
            y: pow(t1, 3) * p1y + pow(t1, 2) * 3 * t * c1y + t1 * 3 * t * t * c2y + pow(t, 3) * p2y
        };
    }

    // Returns bounding box of cubic bezier curve.
    // Source: http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
    // Original version: NISHIO Hirokazu
    // Modifications: https://github.com/timo22345
    function curveDim(x0, y0, x1, y1, x2, y2, x3, y3) {
        var tvalues = [],
            bounds = [[], []],
            a, b, c, t, t1, t2, b2ac, sqrtb2ac;
        for (var i = 0; i < 2; ++i) {
            if (i == 0) {
                b = 6 * x0 - 12 * x1 + 6 * x2;
                a = -3 * x0 + 9 * x1 - 9 * x2 + 3 * x3;
                c = 3 * x1 - 3 * x0;
            } else {
                b = 6 * y0 - 12 * y1 + 6 * y2;
                a = -3 * y0 + 9 * y1 - 9 * y2 + 3 * y3;
                c = 3 * y1 - 3 * y0;
            }
            if (abs(a) < 1e-12) {
                if (abs(b) < 1e-12) {
                    continue;
                }
                t = -c / b;
                if (0 < t && t < 1) {
                    tvalues.push(t);
                }
                continue;
            }
            b2ac = b * b - 4 * c * a;
            sqrtb2ac = math.sqrt(b2ac);
            if (b2ac < 0) {
                continue;
            }
            t1 = (-b + sqrtb2ac) / (2 * a);
            if (0 < t1 && t1 < 1) {
                tvalues.push(t1);
            }
            t2 = (-b - sqrtb2ac) / (2 * a);
            if (0 < t2 && t2 < 1) {
                tvalues.push(t2);
            }
        }

        var x, y, j = tvalues.length,
            jlen = j,
            mt;
        while (j--) {
            t = tvalues[j];
            mt = 1 - t;
            bounds[0][j] = mt * mt * mt * x0 + 3 * mt * mt * t * x1 + 3 * mt * t * t * x2 + t * t * t * x3;
            bounds[1][j] = mt * mt * mt * y0 + 3 * mt * mt * t * y1 + 3 * mt * t * t * y2 + t * t * t * y3;
        }

        bounds[0][jlen] = x0;
        bounds[1][jlen] = y0;
        bounds[0][jlen + 1] = x3;
        bounds[1][jlen + 1] = y3;
        bounds[0].length = bounds[1].length = jlen + 2;


        return {
          min: {x: mmin.apply(0, bounds[0]), y: mmin.apply(0, bounds[1])},
          max: {x: mmax.apply(0, bounds[0]), y: mmax.apply(0, bounds[1])}
        };
    }

    function path2curve(path, path2) {
        var pth = !path2 && paths(path);
        if (!path2 && pth.curve) {
            return pathClone(pth.curve);
        }
        var p = pathToAbsolute(path),
            p2 = path2 && pathToAbsolute(path2),
            attrs = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
            attrs2 = {x: 0, y: 0, bx: 0, by: 0, X: 0, Y: 0, qx: null, qy: null},
            processPath = function (path, d, pcom) {
                var nx, ny;
                if (!path) {
                    return ["C", d.x, d.y, d.x, d.y, d.x, d.y];
                }
                !(path[0] in {T: 1, Q: 1}) && (d.qx = d.qy = null);
                switch (path[0]) {
                    case "M":
                        d.X = path[1];
                        d.Y = path[2];
                        break;
                    case "A":
                        path = ["C"].concat(a2c.apply(0, [d.x, d.y].concat(path.slice(1))));
                        break;
                    case "S":
                        if (pcom == "C" || pcom == "S") { // In "S" case we have to take into account, if the previous command is C/S.
                            nx = d.x * 2 - d.bx;          // And reflect the previous
                            ny = d.y * 2 - d.by;          // command's control point relative to the current point.
                        }
                        else {                            // or some else or nothing
                            nx = d.x;
                            ny = d.y;
                        }
                        path = ["C", nx, ny].concat(path.slice(1));
                        break;
                    case "T":
                        if (pcom == "Q" || pcom == "T") { // In "T" case we have to take into account, if the previous command is Q/T.
                            d.qx = d.x * 2 - d.qx;        // And make a reflection similar
                            d.qy = d.y * 2 - d.qy;        // to case "S".
                        }
                        else {                            // or something else or nothing
                            d.qx = d.x;
                            d.qy = d.y;
                        }
                        path = ["C"].concat(q2c(d.x, d.y, d.qx, d.qy, path[1], path[2]));
                        break;
                    case "Q":
                        d.qx = path[1];
                        d.qy = path[2];
                        path = ["C"].concat(q2c(d.x, d.y, path[1], path[2], path[3], path[4]));
                        break;
                    case "L":
                        path = ["C"].concat(l2c(d.x, d.y, path[1], path[2]));
                        break;
                    case "H":
                        path = ["C"].concat(l2c(d.x, d.y, path[1], d.y));
                        break;
                    case "V":
                        path = ["C"].concat(l2c(d.x, d.y, d.x, path[1]));
                        break;
                    case "Z":
                        path = ["C"].concat(l2c(d.x, d.y, d.X, d.Y));
                        break;
                }
                return path;
            },
            fixArc = function (pp, i) {
                if (pp[i].length > 7) {
                    pp[i].shift();
                    var pi = pp[i];
                    while (pi.length) {
                        pcoms1[i] = "A"; // if created multiple C:s, their original seg is saved
                        p2 && (pcoms2[i] = "A"); // the same as above
                        pp.splice(i++, 0, ["C"].concat(pi.splice(0, 6)));
                    }
                    pp.splice(i, 1);
                    ii = mmax(p.length, p2 && p2.length || 0);
                }
            },
            fixM = function (path1, path2, a1, a2, i) {
                if (path1 && path2 && path1[i][0] == "M" && path2[i][0] != "M") {
                    path2.splice(i, 0, ["M", a2.x, a2.y]);
                    a1.bx = 0;
                    a1.by = 0;
                    a1.x = path1[i][1];
                    a1.y = path1[i][2];
                    ii = mmax(p.length, p2 && p2.length || 0);
                }
            },
            pcoms1 = [], // path commands of original path p
            pcoms2 = [], // path commands of original path p2
            pfirst = "", // temporary holder for original path command
            pcom = ""; // holder for previous path command of original path
        for (var i = 0, ii = mmax(p.length, p2 && p2.length || 0); i < ii; i++) {
            p[i] && (pfirst = p[i][0]); // save current path command

            if (pfirst != "C") // C is not saved yet, because it may be result of conversion
            {
                pcoms1[i] = pfirst; // Save current path command
                i && ( pcom = pcoms1[i - 1]); // Get previous path command pcom
            }
            p[i] = processPath(p[i], attrs, pcom); // Previous path command is inputted to processPath

            if (pcoms1[i] != "A" && pfirst == "C") pcoms1[i] = "C"; // A is the only command
            // which may produce multiple C:s
            // so we have to make sure that C is also C in original path

            fixArc(p, i); // fixArc adds also the right amount of A:s to pcoms1

            if (p2) { // the same procedures is done to p2
                p2[i] && (pfirst = p2[i][0]);
                if (pfirst != "C") {
                    pcoms2[i] = pfirst;
                    i && (pcom = pcoms2[i - 1]);
                }
                p2[i] = processPath(p2[i], attrs2, pcom);

                if (pcoms2[i] != "A" && pfirst == "C") {
                    pcoms2[i] = "C";
                }

                fixArc(p2, i);
            }
            fixM(p, p2, attrs, attrs2, i);
            fixM(p2, p, attrs2, attrs, i);
            var seg = p[i],
                seg2 = p2 && p2[i],
                seglen = seg.length,
                seg2len = p2 && seg2.length;
            attrs.x = seg[seglen - 2];
            attrs.y = seg[seglen - 1];
            attrs.bx = toFloat(seg[seglen - 4]) || attrs.x;
            attrs.by = toFloat(seg[seglen - 3]) || attrs.y;
            attrs2.bx = p2 && (toFloat(seg2[seg2len - 4]) || attrs2.x);
            attrs2.by = p2 && (toFloat(seg2[seg2len - 3]) || attrs2.y);
            attrs2.x = p2 && seg2[seg2len - 2];
            attrs2.y = p2 && seg2[seg2len - 1];
        }
        if (!p2) {
            pth.curve = pathClone(p);
        }
        return p2 ? [p, p2] : p;
    }
    function mapPath(path, matrix) {
        if (!matrix) {
            return path;
        }
        var x, y, i, j, ii, jj, pathi;
        path = path2curve(path);
        for (i = 0, ii = path.length; i < ii; i++) {
            pathi = path[i];
            for (j = 1, jj = pathi.length; j < jj; j += 2) {
                x = matrix.x(pathi[j], pathi[j + 1]);
                y = matrix.y(pathi[j], pathi[j + 1]);
                pathi[j] = x;
                pathi[j + 1] = y;
            }
        }
        return path;
    }

    // http://schepers.cc/getting-to-the-point
    function catmullRom2bezier(crp, z) {
        var d = [];
        for (var i = 0, iLen = crp.length; iLen - 2 * !z > i; i += 2) {
            var p = [
                        {x: +crp[i - 2], y: +crp[i - 1]},
                        {x: +crp[i],     y: +crp[i + 1]},
                        {x: +crp[i + 2], y: +crp[i + 3]},
                        {x: +crp[i + 4], y: +crp[i + 5]}
                    ];
            if (z) {
                if (!i) {
                    p[0] = {x: +crp[iLen - 2], y: +crp[iLen - 1]};
                } else if (iLen - 4 == i) {
                    p[3] = {x: +crp[0], y: +crp[1]};
                } else if (iLen - 2 == i) {
                    p[2] = {x: +crp[0], y: +crp[1]};
                    p[3] = {x: +crp[2], y: +crp[3]};
                }
            } else {
                if (iLen - 4 == i) {
                    p[3] = p[2];
                } else if (!i) {
                    p[0] = {x: +crp[i], y: +crp[i + 1]};
                }
            }
            d.push(["C",
                  (-p[0].x + 6 * p[1].x + p[2].x) / 6,
                  (-p[0].y + 6 * p[1].y + p[2].y) / 6,
                  (p[1].x + 6 * p[2].x - p[3].x) / 6,
                  (p[1].y + 6*p[2].y - p[3].y) / 6,
                  p[2].x,
                  p[2].y
            ]);
        }

        return d;
    }

    // export
    Snap.path = paths;

    /*\
     * Snap.path.getTotalLength
     [ method ]
     **
     * Returns the length of the given path in pixels
     **
     - path (string) SVG path string
     **
     = (number) length
    \*/
    Snap.path.getTotalLength = getTotalLength;
    /*\
     * Snap.path.getPointAtLength
     [ method ]
     **
     * Returns the coordinates of the point located at the given length along the given path
     **
     - path (string) SVG path string
     - length (number) length, in pixels, from the start of the path, excluding non-rendering jumps
     **
     = (object) representation of the point:
     o {
     o     x: (number) x coordinate,
     o     y: (number) y coordinate,
     o     alpha: (number) angle of derivative
     o }
    \*/
    Snap.path.getPointAtLength = getPointAtLength;
    /*\
     * Snap.path.getSubpath
     [ method ]
     **
     * Returns the subpath of a given path between given start and end lengths
     **
     - path (string) SVG path string
     - from (number) length, in pixels, from the start of the path to the start of the segment
     - to (number) length, in pixels, from the start of the path to the end of the segment
     **
     = (string) path string definition for the segment
    \*/
    Snap.path.getSubpath = function (path, from, to) {
        if (this.getTotalLength(path) - to < 1e-6) {
            return getSubpathsAtLength(path, from).end;
        }
        var a = getSubpathsAtLength(path, to, 1);
        return from ? getSubpathsAtLength(a, from).end : a;
    };
    /*\
     * Element.getTotalLength
     [ method ]
     **
     * Returns the length of the path in pixels (only works for `path` elements)
     = (number) length
    \*/
    elproto.getTotalLength = function () {
        if (this.node.getTotalLength) {
            return this.node.getTotalLength();
        }
    };
    // SIERRA Element.getPointAtLength()/Element.getTotalLength(): If a <path> is broken into different segments, is the jump distance to the new coordinates set by the _M_ or _m_ commands calculated as part of the path's total length?
    /*\
     * Element.getPointAtLength
     [ method ]
     **
     * Returns coordinates of the point located at the given length on the given path (only works for `path` elements)
     **
     - length (number) length, in pixels, from the start of the path, excluding non-rendering jumps
     **
     = (object) representation of the point:
     o {
     o     x: (number) x coordinate,
     o     y: (number) y coordinate,
     o     alpha: (number) angle of derivative
     o }
    \*/
    elproto.getPointAtLength = function (length) {
        return getPointAtLength(this.attr("d"), length);
    };
    // SIERRA Element.getSubpath(): Similar to the problem for Element.getPointAtLength(). Unclear how this would work for a segmented path. Overall, the concept of _subpath_ and what I'm calling a _segment_ (series of non-_M_ or _Z_ commands) is unclear.
    /*\
     * Element.getSubpath
     [ method ]
     **
     * Returns subpath of a given element from given start and end lengths (only works for `path` elements)
     **
     - from (number) length, in pixels, from the start of the path to the start of the segment
     - to (number) length, in pixels, from the start of the path to the end of the segment
     **
     = (string) path string definition for the segment
    \*/
    elproto.getSubpath = function (from, to) {
        return Snap.path.getSubpath(this.attr("d"), from, to);
    };
    Snap._.box = box;
    /*\
     * Snap.path.findDotsAtSegment
     [ method ]
     **
     * Utility method
     **
     * Finds dot coordinates on the given cubic beziér curve at the given t
     - p1x (number) x of the first point of the curve
     - p1y (number) y of the first point of the curve
     - c1x (number) x of the first anchor of the curve
     - c1y (number) y of the first anchor of the curve
     - c2x (number) x of the second anchor of the curve
     - c2y (number) y of the second anchor of the curve
     - p2x (number) x of the second point of the curve
     - p2y (number) y of the second point of the curve
     - t (number) position on the curve (0..1)
     = (object) point information in format:
     o {
     o     x: (number) x coordinate of the point,
     o     y: (number) y coordinate of the point,
     o     m: {
     o         x: (number) x coordinate of the left anchor,
     o         y: (number) y coordinate of the left anchor
     o     },
     o     n: {
     o         x: (number) x coordinate of the right anchor,
     o         y: (number) y coordinate of the right anchor
     o     },
     o     start: {
     o         x: (number) x coordinate of the start of the curve,
     o         y: (number) y coordinate of the start of the curve
     o     },
     o     end: {
     o         x: (number) x coordinate of the end of the curve,
     o         y: (number) y coordinate of the end of the curve
     o     },
     o     alpha: (number) angle of the curve derivative at the point
     o }
    \*/
    Snap.path.findDotsAtSegment = findDotsAtSegment;
    /*\
     * Snap.path.bezierBBox
     [ method ]
     **
     * Utility method
     **
     * Returns the bounding box of a given cubic beziér curve
     - p1x (number) x of the first point of the curve
     - p1y (number) y of the first point of the curve
     - c1x (number) x of the first anchor of the curve
     - c1y (number) y of the first anchor of the curve
     - c2x (number) x of the second anchor of the curve
     - c2y (number) y of the second anchor of the curve
     - p2x (number) x of the second point of the curve
     - p2y (number) y of the second point of the curve
     * or
     - bez (array) array of six points for beziér curve
     = (object) bounding box
     o {
     o     x: (number) x coordinate of the left top point of the box,
     o     y: (number) y coordinate of the left top point of the box,
     o     x2: (number) x coordinate of the right bottom point of the box,
     o     y2: (number) y coordinate of the right bottom point of the box,
     o     width: (number) width of the box,
     o     height: (number) height of the box
     o }
    \*/
    Snap.path.bezierBBox = bezierBBox;
    /*\
     * Snap.path.isPointInsideBBox
     [ method ]
     **
     * Utility method
     **
     * Returns `true` if given point is inside bounding box
     - bbox (string) bounding box
     - x (string) x coordinate of the point
     - y (string) y coordinate of the point
     = (boolean) `true` if point is inside
    \*/
    Snap.path.isPointInsideBBox = isPointInsideBBox;
    Snap.closest = function (x, y, X, Y) {
        var r = 100,
            b = box(x - r / 2, y - r / 2, r, r),
            inside = [],
            getter = X[0].hasOwnProperty("x") ? function (i) {
                return {
                    x: X[i].x,
                    y: X[i].y
                };
            } : function (i) {
                return {
                    x: X[i],
                    y: Y[i]
                };
            },
            found = 0;
        while (r <= 1e6 && !found) {
            for (var i = 0, ii = X.length; i < ii; i++) {
                var xy = getter(i);
                if (isPointInsideBBox(b, xy.x, xy.y)) {
                    found++;
                    inside.push(xy);
                    break;
                }
            }
            if (!found) {
                r *= 2;
                b = box(x - r / 2, y - r / 2, r, r)
            }
        }
        if (r == 1e6) {
            return;
        }
        var len = Infinity,
            res;
        for (i = 0, ii = inside.length; i < ii; i++) {
            var l = Snap.len(x, y, inside[i].x, inside[i].y);
            if (len > l) {
                len = l;
                inside[i].len = l;
                res = inside[i];
            }
        }
        return res;
    };
    /*\
     * Snap.path.isBBoxIntersect
     [ method ]
     **
     * Utility method
     **
     * Returns `true` if two bounding boxes intersect
     - bbox1 (string) first bounding box
     - bbox2 (string) second bounding box
     = (boolean) `true` if bounding boxes intersect
    \*/
    Snap.path.isBBoxIntersect = isBBoxIntersect;
    /*\
     * Snap.path.intersection
     [ method ]
     **
     * Utility method
     **
     * Finds intersections of two paths
     - path1 (string) path string
     - path2 (string) path string
     = (array) dots of intersection
     o [
     o     {
     o         x: (number) x coordinate of the point,
     o         y: (number) y coordinate of the point,
     o         t1: (number) t value for segment of path1,
     o         t2: (number) t value for segment of path2,
     o         segment1: (number) order number for segment of path1,
     o         segment2: (number) order number for segment of path2,
     o         bez1: (array) eight coordinates representing beziér curve for the segment of path1,
     o         bez2: (array) eight coordinates representing beziér curve for the segment of path2
     o     }
     o ]
    \*/
    Snap.path.intersection = pathIntersection;
    Snap.path.intersectionNumber = pathIntersectionNumber;
    /*\
     * Snap.path.isPointInside
     [ method ]
     **
     * Utility method
     **
     * Returns `true` if given point is inside a given closed path.
     *
     * Note: fill mode doesn’t affect the result of this method.
     - path (string) path string
     - x (number) x of the point
     - y (number) y of the point
     = (boolean) `true` if point is inside the path
    \*/
    Snap.path.isPointInside = isPointInsidePath;
    /*\
     * Snap.path.getBBox
     [ method ]
     **
     * Utility method
     **
     * Returns the bounding box of a given path
     - path (string) path string
     = (object) bounding box
     o {
     o     x: (number) x coordinate of the left top point of the box,
     o     y: (number) y coordinate of the left top point of the box,
     o     x2: (number) x coordinate of the right bottom point of the box,
     o     y2: (number) y coordinate of the right bottom point of the box,
     o     width: (number) width of the box,
     o     height: (number) height of the box
     o }
    \*/
    Snap.path.getBBox = pathBBox;
    Snap.path.get = getPath;
    /*\
     * Snap.path.toRelative
     [ method ]
     **
     * Utility method
     **
     * Converts path coordinates into relative values
     - path (string) path string
     = (array) path string
    \*/
    Snap.path.toRelative = pathToRelative;
    /*\
     * Snap.path.toAbsolute
     [ method ]
     **
     * Utility method
     **
     * Converts path coordinates into absolute values
     - path (string) path string
     = (array) path string
    \*/
    Snap.path.toAbsolute = pathToAbsolute;
    /*\
     * Snap.path.toCubic
     [ method ]
     **
     * Utility method
     **
     * Converts path to a new path where all segments are cubic beziér curves
     - pathString (string|array) path string or array of segments
     = (array) array of segments
    \*/
    Snap.path.toCubic = path2curve;
    /*\
     * Snap.path.map
     [ method ]
     **
     * Transform the path string with the given matrix
     - path (string) path string
     - matrix (object) see @Matrix
     = (string) transformed path string
    \*/
    Snap.path.map = mapPath;
    Snap.path.toString = toString;
    Snap.path.clone = pathClone;
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob) {
    var mmax = Math.max,
        mmin = Math.min;

    // Set
    var Set = function (items) {
        this.items = [];
	this.bindings = {};
        this.length = 0;
        this.type = "set";
        if (items) {
            for (var i = 0, ii = items.length; i < ii; i++) {
                if (items[i]) {
                    this[this.items.length] = this.items[this.items.length] = items[i];
                    this.length++;
                }
            }
        }
    },
    setproto = Set.prototype;
    /*\
     * Set.push
     [ method ]
     **
     * Adds each argument to the current set
     = (object) original element
    \*/
    setproto.push = function () {
        var item,
            len;
        for (var i = 0, ii = arguments.length; i < ii; i++) {
            item = arguments[i];
            if (item) {
                len = this.items.length;
                this[len] = this.items[len] = item;
                this.length++;
            }
        }
        return this;
    };
    /*\
     * Set.pop
     [ method ]
     **
     * Removes last element and returns it
     = (object) element
    \*/
    setproto.pop = function () {
        this.length && delete this[this.length--];
        return this.items.pop();
    };
    /*\
     * Set.forEach
     [ method ]
     **
     * Executes given function for each element in the set
     *
     * If the function returns `false`, the loop stops running.
     **
     - callback (function) function to run
     - thisArg (object) context object for the callback
     = (object) Set object
    \*/
    setproto.forEach = function (callback, thisArg) {
        for (var i = 0, ii = this.items.length; i < ii; i++) {
            if (callback.call(thisArg, this.items[i], i) === false) {
                return this;
            }
        }
        return this;
    };
    /*\
     * Set.animate
     [ method ]
     **
     * Animates each element in set in sync.
     *
     **
     - attrs (object) key-value pairs of destination attributes
     - duration (number) duration of the animation in milliseconds
     - easing (function) #optional easing function from @mina or custom
     - callback (function) #optional callback function that executes when the animation ends
     * or
     - animation (array) array of animation parameter for each element in set in format `[attrs, duration, easing, callback]`
     > Usage
     | // animate all elements in set to radius 10
     | set.animate({r: 10}, 500, mina.easein);
     | // or
     | // animate first element to radius 10, but second to radius 20 and in different time
     | set.animate([{r: 10}, 500, mina.easein], [{r: 20}, 1500, mina.easein]);
     = (Element) the current element
    \*/
    setproto.animate = function (attrs, ms, easing, callback) {
        if (typeof easing == "function" && !easing.length) {
            callback = easing;
            easing = mina.linear;
        }
        if (attrs instanceof Snap._.Animation) {
            callback = attrs.callback;
            easing = attrs.easing;
            ms = easing.dur;
            attrs = attrs.attr;
        }
        var args = arguments;
        if (Snap.is(attrs, "array") && Snap.is(args[args.length - 1], "array")) {
            var each = true;
        }
        var begin,
            handler = function () {
                if (begin) {
                    this.b = begin;
                } else {
                    begin = this.b;
                }
            },
            cb = 0,
            set = this,
            callbacker = callback && function () {
                if (++cb == set.length) {
                    callback.call(this);
                }
            };
        return this.forEach(function (el, i) {
            eve.once("snap.animcreated." + el.id, handler);
            if (each) {
                args[i] && el.animate.apply(el, args[i]);
            } else {
                el.animate(attrs, ms, easing, callbacker);
            }
        });
    };
    /*\
     * Set.remove
     [ method ]
     **
     * Removes all children of the set.
     *
     = (object) Set object
    \*/
    setproto.remove = function () {
        while (this.length) {
            this.pop().remove();
        }
        return this;
    };
    /*\
     * Set.bind
     [ method ]
     **
     * Specifies how to handle a specific attribute when applied
     * to a set.
     *
     **
     - attr (string) attribute name
     - callback (function) function to run
     * or
     - attr (string) attribute name
     - element (Element) specific element in the set to apply the attribute to
     * or
     - attr (string) attribute name
     - element (Element) specific element in the set to apply the attribute to
     - eattr (string) attribute on the element to bind the attribute to
     = (object) Set object
    \*/
    setproto.bind = function (attr, a, b) {
        var data = {};
        if (typeof a == "function") {
            this.bindings[attr] = a;
        } else {
            var aname = b || attr;
            this.bindings[attr] = function (v) {
                data[aname] = v;
                a.attr(data);
            };
        }
        return this;
    };
    /*\
     * Set.attr
     [ method ]
     **
     * Equivalent of @Element.attr.
     = (object) Set object
    \*/
    setproto.attr = function (value) {
        var unbound = {};
        for (var k in value) {
            if (this.bindings[k]) {
                this.bindings[k](value[k]);
            } else {
                unbound[k] = value[k];
            }
        }
        for (var i = 0, ii = this.items.length; i < ii; i++) {
            this.items[i].attr(unbound);
        }
        return this;
    };
    /*\
     * Set.clear
     [ method ]
     **
     * Removes all elements from the set
    \*/
    setproto.clear = function () {
        while (this.length) {
            this.pop();
        }
    };
    /*\
     * Set.splice
     [ method ]
     **
     * Removes range of elements from the set
     **
     - index (number) position of the deletion
     - count (number) number of element to remove
     - insertion… (object) #optional elements to insert
     = (object) set elements that were deleted
    \*/
    setproto.splice = function (index, count, insertion) {
        index = index < 0 ? mmax(this.length + index, 0) : index;
        count = mmax(0, mmin(this.length - index, count));
        var tail = [],
            todel = [],
            args = [],
            i;
        for (i = 2; i < arguments.length; i++) {
            args.push(arguments[i]);
        }
        for (i = 0; i < count; i++) {
            todel.push(this[index + i]);
        }
        for (; i < this.length - index; i++) {
            tail.push(this[index + i]);
        }
        var arglen = args.length;
        for (i = 0; i < arglen + tail.length; i++) {
            this.items[index + i] = this[index + i] = i < arglen ? args[i] : tail[i - arglen];
        }
        i = this.items.length = this.length -= count - arglen;
        while (this[i]) {
            delete this[i++];
        }
        return new Set(todel);
    };
    /*\
     * Set.exclude
     [ method ]
     **
     * Removes given element from the set
     **
     - element (object) element to remove
     = (boolean) `true` if object was found and removed from the set
    \*/
    setproto.exclude = function (el) {
        for (var i = 0, ii = this.length; i < ii; i++) if (this[i] == el) {
            this.splice(i, 1);
            return true;
        }
        return false;
    };
    /*\
     * Set.insertAfter
     [ method ]
     **
     * Inserts set elements after given element.
     **
     - element (object) set will be inserted after this element
     = (object) Set object
    \*/
    setproto.insertAfter = function (el) {
        var i = this.items.length;
        while (i--) {
            this.items[i].insertAfter(el);
        }
        return this;
    };
    /*\
     * Set.getBBox
     [ method ]
     **
     * Union of all bboxes of the set. See @Element.getBBox.
     = (object) bounding box descriptor. See @Element.getBBox.
    \*/
    setproto.getBBox = function () {
        var x = [],
            y = [],
            x2 = [],
            y2 = [];
        for (var i = this.items.length; i--;) if (!this.items[i].removed) {
            var box = this.items[i].getBBox();
            x.push(box.x);
            y.push(box.y);
            x2.push(box.x + box.width);
            y2.push(box.y + box.height);
        }
        x = mmin.apply(0, x);
        y = mmin.apply(0, y);
        x2 = mmax.apply(0, x2);
        y2 = mmax.apply(0, y2);
        return {
            x: x,
            y: y,
            x2: x2,
            y2: y2,
            width: x2 - x,
            height: y2 - y,
            cx: x + (x2 - x) / 2,
            cy: y + (y2 - y) / 2
        };
    };
    /*\
     * Set.insertAfter
     [ method ]
     **
     * Creates a clone of the set.
     **
     = (object) New Set object
    \*/
    setproto.clone = function (s) {
        s = new Set;
        for (var i = 0, ii = this.items.length; i < ii; i++) {
            s.push(this.items[i].clone());
        }
        return s;
    };
    setproto.toString = function () {
        return "Snap\u2018s set";
    };
    setproto.type = "set";
    // export
    /*\
     * Snap.Set
     [ property ]
     **
     * Set constructor.
    \*/
    Snap.Set = Set;
    /*\
     * Snap.set
     [ method ]
     **
     * Creates a set and fills it with list of arguments.
     **
     = (object) New Set object
     | var r = paper.rect(0, 0, 10, 10),
     |     s1 = Snap.set(), // empty set
     |     s2 = Snap.set(r, paper.circle(100, 100, 20)); // prefilled set
    \*/
    Snap.set = function () {
        var set = new Set;
        if (arguments.length) {
            set.push.apply(set, Array.prototype.slice.call(arguments, 0));
        }
        return set;
    };
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob) {
    var names = {},
        reUnit = /[%a-z]+$/i,
        Str = String;
    names.stroke = names.fill = "colour";
    function getEmpty(item) {
        var l = item[0];
        switch (l.toLowerCase()) {
            case "t": return [l, 0, 0];
            case "m": return [l, 1, 0, 0, 1, 0, 0];
            case "r": if (item.length == 4) {
                return [l, 0, item[2], item[3]];
            } else {
                return [l, 0];
            }
            case "s": if (item.length == 5) {
                return [l, 1, 1, item[3], item[4]];
            } else if (item.length == 3) {
                return [l, 1, 1];
            } else {
                return [l, 1];
            }
        }
    }
    function equaliseTransform(t1, t2, getBBox) {
        t1 = t1 || new Snap.Matrix;
        t2 = t2 || new Snap.Matrix;
        t1 = Snap.parseTransformString(t1.toTransformString()) || [];
        t2 = Snap.parseTransformString(t2.toTransformString()) || [];
        var maxlength = Math.max(t1.length, t2.length),
            from = [],
            to = [],
            i = 0, j, jj,
            tt1, tt2;
        for (; i < maxlength; i++) {
            tt1 = t1[i] || getEmpty(t2[i]);
            tt2 = t2[i] || getEmpty(tt1);
            if (tt1[0] != tt2[0] ||
                tt1[0].toLowerCase() == "r" && (tt1[2] != tt2[2] || tt1[3] != tt2[3]) ||
                tt1[0].toLowerCase() == "s" && (tt1[3] != tt2[3] || tt1[4] != tt2[4])
                ) {
                    t1 = Snap._.transform2matrix(t1, getBBox());
                    t2 = Snap._.transform2matrix(t2, getBBox());
                    from = [["m", t1.a, t1.b, t1.c, t1.d, t1.e, t1.f]];
                    to = [["m", t2.a, t2.b, t2.c, t2.d, t2.e, t2.f]];
                    break;
            }
            from[i] = [];
            to[i] = [];
            for (j = 0, jj = Math.max(tt1.length, tt2.length); j < jj; j++) {
                j in tt1 && (from[i][j] = tt1[j]);
                j in tt2 && (to[i][j] = tt2[j]);
            }
        }
        return {
            from: path2array(from),
            to: path2array(to),
            f: getPath(from)
        };
    }
    function getNumber(val) {
        return val;
    }
    function getUnit(unit) {
        return function (val) {
            return +val.toFixed(3) + unit;
        };
    }
    function getViewBox(val) {
        return val.join(" ");
    }
    function getColour(clr) {
        return Snap.rgb(clr[0], clr[1], clr[2], clr[3]);
    }
    function getPath(path) {
        var k = 0, i, ii, j, jj, out, a, b = [];
        for (i = 0, ii = path.length; i < ii; i++) {
            out = "[";
            a = ['"' + path[i][0] + '"'];
            for (j = 1, jj = path[i].length; j < jj; j++) {
                a[j] = "val[" + k++ + "]";
            }
            out += a + "]";
            b[i] = out;
        }
        return Function("val", "return Snap.path.toString.call([" + b + "])");
    }
    function path2array(path) {
        var out = [];
        for (var i = 0, ii = path.length; i < ii; i++) {
            for (var j = 1, jj = path[i].length; j < jj; j++) {
                out.push(path[i][j]);
            }
        }
        return out;
    }
    function isNumeric(obj) {
        return isFinite(obj);
    }
    function arrayEqual(arr1, arr2) {
        if (!Snap.is(arr1, "array") || !Snap.is(arr2, "array")) {
            return false;
        }
        return arr1.toString() == arr2.toString();
    }
    Element.prototype.equal = function (name, b) {
        return eve("snap.util.equal", this, name, b).firstDefined();
    };
    eve.on("snap.util.equal", function (name, b) {
        var A, B, a = Str(this.attr(name) || ""),
            el = this;
        if (names[name] == "colour") {
            A = Snap.color(a);
            B = Snap.color(b);
            return {
                from: [A.r, A.g, A.b, A.opacity],
                to: [B.r, B.g, B.b, B.opacity],
                f: getColour
            };
        }
        if (name == "viewBox") {
            A = this.attr(name).vb.split(" ").map(Number);
            B = b.split(" ").map(Number);
            return {
                from: A,
                to: B,
                f: getViewBox
            };
        }
        if (name == "transform" || name == "gradientTransform" || name == "patternTransform") {
            if (typeof b == "string") {
                b = Str(b).replace(/\.{3}|\u2026/g, a);
            }
            a = this.matrix;
            if (!Snap._.rgTransform.test(b)) {
                b = Snap._.transform2matrix(Snap._.svgTransform2string(b), this.getBBox());
            } else {
                b = Snap._.transform2matrix(b, this.getBBox());
            }
            return equaliseTransform(a, b, function () {
                return el.getBBox(1);
            });
        }
        if (name == "d" || name == "path") {
            A = Snap.path.toCubic(a, b);
            return {
                from: path2array(A[0]),
                to: path2array(A[1]),
                f: getPath(A[0])
            };
        }
        if (name == "points") {
            A = Str(a).split(Snap._.separator);
            B = Str(b).split(Snap._.separator);
            return {
                from: A,
                to: B,
                f: function (val) { return val; }
            };
        }
        if (isNumeric(a) && isNumeric(b)) {
            return {
                from: parseFloat(a),
                to: parseFloat(b),
                f: getNumber
            };
        }
        var aUnit = a.match(reUnit),
            bUnit = Str(b).match(reUnit);
        if (aUnit && arrayEqual(aUnit, bUnit)) {
            return {
                from: parseFloat(a),
                to: parseFloat(b),
                f: getUnit(aUnit)
            };
        } else {
            return {
                from: this.asPX(name),
                to: this.asPX(name, b),
                f: getNumber
            };
        }
    });
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
// 
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// 
// http://www.apache.org/licenses/LICENSE-2.0
// 
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob) {
    var elproto = Element.prototype,
    has = "hasOwnProperty",
    supportsTouch = "createTouch" in glob.doc,
    events = [
        "click", "dblclick", "mousedown", "mousemove", "mouseout",
        "mouseover", "mouseup", "touchstart", "touchmove", "touchend",
        "touchcancel"
    ],
    touchMap = {
        mousedown: "touchstart",
        mousemove: "touchmove",
        mouseup: "touchend"
    },
    getScroll = function (xy, el) {
        var name = xy == "y" ? "scrollTop" : "scrollLeft",
            doc = el && el.node ? el.node.ownerDocument : glob.doc;
        return doc[name in doc.documentElement ? "documentElement" : "body"][name];
    },
    preventDefault = function () {
        this.returnValue = false;
    },
    preventTouch = function () {
        return this.originalEvent.preventDefault();
    },
    stopPropagation = function () {
        this.cancelBubble = true;
    },
    stopTouch = function () {
        return this.originalEvent.stopPropagation();
    },
    addEvent = function (obj, type, fn, element) {
        var realName = supportsTouch && touchMap[type] ? touchMap[type] : type,
            f = function (e) {
                var scrollY = getScroll("y", element),
                    scrollX = getScroll("x", element);
                if (supportsTouch && touchMap[has](type)) {
                    for (var i = 0, ii = e.targetTouches && e.targetTouches.length; i < ii; i++) {
                        if (e.targetTouches[i].target == obj || obj.contains(e.targetTouches[i].target)) {
                            var olde = e;
                            e = e.targetTouches[i];
                            e.originalEvent = olde;
                            e.preventDefault = preventTouch;
                            e.stopPropagation = stopTouch;
                            break;
                        }
                    }
                }
                var x = e.clientX + scrollX,
                    y = e.clientY + scrollY;
                return fn.call(element, e, x, y);
            };

        if (type !== realName) {
            obj.addEventListener(type, f, false);
        }

        obj.addEventListener(realName, f, false);

        return function () {
            if (type !== realName) {
                obj.removeEventListener(type, f, false);
            }

            obj.removeEventListener(realName, f, false);
            return true;
        };
    },
    drag = [],
    dragMove = function (e) {
        var x = e.clientX,
            y = e.clientY,
            scrollY = getScroll("y"),
            scrollX = getScroll("x"),
            dragi,
            j = drag.length;
        while (j--) {
            dragi = drag[j];
            if (supportsTouch) {
                var i = e.touches && e.touches.length,
                    touch;
                while (i--) {
                    touch = e.touches[i];
                    if (touch.identifier == dragi.el._drag.id || dragi.el.node.contains(touch.target)) {
                        x = touch.clientX;
                        y = touch.clientY;
                        (e.originalEvent ? e.originalEvent : e).preventDefault();
                        break;
                    }
                }
            } else {
                e.preventDefault();
            }
            var node = dragi.el.node,
                o,
                next = node.nextSibling,
                parent = node.parentNode,
                display = node.style.display;
            // glob.win.opera && parent.removeChild(node);
            // node.style.display = "none";
            // o = dragi.el.paper.getElementByPoint(x, y);
            // node.style.display = display;
            // glob.win.opera && (next ? parent.insertBefore(node, next) : parent.appendChild(node));
            // o && eve("snap.drag.over." + dragi.el.id, dragi.el, o);
            x += scrollX;
            y += scrollY;
            eve("snap.drag.move." + dragi.el.id, dragi.move_scope || dragi.el, x - dragi.el._drag.x, y - dragi.el._drag.y, x, y, e);
        }
    },
    dragUp = function (e) {
        Snap.unmousemove(dragMove).unmouseup(dragUp);
        var i = drag.length,
            dragi;
        while (i--) {
            dragi = drag[i];
            dragi.el._drag = {};
            eve("snap.drag.end." + dragi.el.id, dragi.end_scope || dragi.start_scope || dragi.move_scope || dragi.el, e);
            eve.off("snap.drag.*." + dragi.el.id);
        }
        drag = [];
    };
    /*\
     * Element.click
     [ method ]
     **
     * Adds a click event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.unclick
     [ method ]
     **
     * Removes a click event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.dblclick
     [ method ]
     **
     * Adds a double click event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.undblclick
     [ method ]
     **
     * Removes a double click event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.mousedown
     [ method ]
     **
     * Adds a mousedown event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.unmousedown
     [ method ]
     **
     * Removes a mousedown event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.mousemove
     [ method ]
     **
     * Adds a mousemove event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.unmousemove
     [ method ]
     **
     * Removes a mousemove event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.mouseout
     [ method ]
     **
     * Adds a mouseout event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.unmouseout
     [ method ]
     **
     * Removes a mouseout event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.mouseover
     [ method ]
     **
     * Adds a mouseover event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.unmouseover
     [ method ]
     **
     * Removes a mouseover event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.mouseup
     [ method ]
     **
     * Adds a mouseup event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.unmouseup
     [ method ]
     **
     * Removes a mouseup event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.touchstart
     [ method ]
     **
     * Adds a touchstart event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.untouchstart
     [ method ]
     **
     * Removes a touchstart event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.touchmove
     [ method ]
     **
     * Adds a touchmove event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.untouchmove
     [ method ]
     **
     * Removes a touchmove event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.touchend
     [ method ]
     **
     * Adds a touchend event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.untouchend
     [ method ]
     **
     * Removes a touchend event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    
    /*\
     * Element.touchcancel
     [ method ]
     **
     * Adds a touchcancel event handler to the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    /*\
     * Element.untouchcancel
     [ method ]
     **
     * Removes a touchcancel event handler from the element
     - handler (function) handler for the event
     = (object) @Element
    \*/
    for (var i = events.length; i--;) {
        (function (eventName) {
            Snap[eventName] = elproto[eventName] = function (fn, scope) {
                if (Snap.is(fn, "function")) {
                    this.events = this.events || [];
                    this.events.push({
                        name: eventName,
                        f: fn,
                        unbind: addEvent(this.node || document, eventName, fn, scope || this)
                    });
                } else {
                    for (var i = 0, ii = this.events.length; i < ii; i++) if (this.events[i].name == eventName) {
                        try {
                            this.events[i].f.call(this);
                        } catch (e) {}
                    }
                }
                return this;
            };
            Snap["un" + eventName] =
            elproto["un" + eventName] = function (fn) {
                var events = this.events || [],
                    l = events.length;
                while (l--) if (events[l].name == eventName &&
                               (events[l].f == fn || !fn)) {
                    events[l].unbind();
                    events.splice(l, 1);
                    !events.length && delete this.events;
                    return this;
                }
                return this;
            };
        })(events[i]);
    }
    /*\
     * Element.hover
     [ method ]
     **
     * Adds hover event handlers to the element
     - f_in (function) handler for hover in
     - f_out (function) handler for hover out
     - icontext (object) #optional context for hover in handler
     - ocontext (object) #optional context for hover out handler
     = (object) @Element
    \*/
    elproto.hover = function (f_in, f_out, scope_in, scope_out) {
        return this.mouseover(f_in, scope_in).mouseout(f_out, scope_out || scope_in);
    };
    /*\
     * Element.unhover
     [ method ]
     **
     * Removes hover event handlers from the element
     - f_in (function) handler for hover in
     - f_out (function) handler for hover out
     = (object) @Element
    \*/
    elproto.unhover = function (f_in, f_out) {
        return this.unmouseover(f_in).unmouseout(f_out);
    };
    var draggable = [];
    // SIERRA unclear what _context_ refers to for starting, ending, moving the drag gesture.
    // SIERRA Element.drag(): _x position of the mouse_: Where are the x/y values offset from?
    // SIERRA Element.drag(): much of this member's doc appears to be duplicated for some reason.
    // SIERRA Unclear about this sentence: _Additionally following drag events will be triggered: drag.start.<id> on start, drag.end.<id> on end and drag.move.<id> on every move._ Is there a global _drag_ object to which you can assign handlers keyed by an element's ID?
    /*\
     * Element.drag
     [ method ]
     **
     * Adds event handlers for an element's drag gesture
     **
     - onmove (function) handler for moving
     - onstart (function) handler for drag start
     - onend (function) handler for drag end
     - mcontext (object) #optional context for moving handler
     - scontext (object) #optional context for drag start handler
     - econtext (object) #optional context for drag end handler
     * Additionaly following `drag` events are triggered: `drag.start.<id>` on start, 
     * `drag.end.<id>` on end and `drag.move.<id>` on every move. When element is dragged over another element 
     * `drag.over.<id>` fires as well.
     *
     * Start event and start handler are called in specified context or in context of the element with following parameters:
     o x (number) x position of the mouse
     o y (number) y position of the mouse
     o event (object) DOM event object
     * Move event and move handler are called in specified context or in context of the element with following parameters:
     o dx (number) shift by x from the start point
     o dy (number) shift by y from the start point
     o x (number) x position of the mouse
     o y (number) y position of the mouse
     o event (object) DOM event object
     * End event and end handler are called in specified context or in context of the element with following parameters:
     o event (object) DOM event object
     = (object) @Element
    \*/
    elproto.drag = function (onmove, onstart, onend, move_scope, start_scope, end_scope) {
        var el = this;
        if (!arguments.length) {
            var origTransform;
            return el.drag(function (dx, dy) {
                this.attr({
                    transform: origTransform + (origTransform ? "T" : "t") + [dx, dy]
                });
            }, function () {
                origTransform = this.transform().local;
            });
        }
        function start(e, x, y) {
            (e.originalEvent || e).preventDefault();
            el._drag.x = x;
            el._drag.y = y;
            el._drag.id = e.identifier;
            !drag.length && Snap.mousemove(dragMove).mouseup(dragUp);
            drag.push({el: el, move_scope: move_scope, start_scope: start_scope, end_scope: end_scope});
            onstart && eve.on("snap.drag.start." + el.id, onstart);
            onmove && eve.on("snap.drag.move." + el.id, onmove);
            onend && eve.on("snap.drag.end." + el.id, onend);
            eve("snap.drag.start." + el.id, start_scope || move_scope || el, x, y, e);
        }
        function init(e, x, y) {
            eve("snap.draginit." + el.id, el, e, x, y);
        }
        eve.on("snap.draginit." + el.id, start);
        el._drag = {};
        draggable.push({el: el, start: start, init: init});
        el.mousedown(init);
        return el;
    };
    /*
     * Element.onDragOver
     [ method ]
     **
     * Shortcut to assign event handler for `drag.over.<id>` event, where `id` is the element's `id` (see @Element.id)
     - f (function) handler for event, first argument would be the element you are dragging over
    \*/
    // elproto.onDragOver = function (f) {
    //     f ? eve.on("snap.drag.over." + this.id, f) : eve.unbind("snap.drag.over." + this.id);
    // };
    /*\
     * Element.undrag
     [ method ]
     **
     * Removes all drag event handlers from the given element
    \*/
    elproto.undrag = function () {
        var i = draggable.length;
        while (i--) if (draggable[i].el == this) {
            this.unmousedown(draggable[i].init);
            draggable.splice(i, 1);
            eve.unbind("snap.drag.*." + this.id);
            eve.unbind("snap.draginit." + this.id);
        }
        !draggable.length && Snap.unmousemove(dragMove).unmouseup(dragUp);
        return this;
    };
});

// Copyright (c) 2013 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob) {
    var elproto = Element.prototype,
        pproto = Paper.prototype,
        rgurl = /^\s*url\((.+)\)/,
        Str = String,
        $ = Snap._.$;
    Snap.filter = {};
    /*\
     * Paper.filter
     [ method ]
     **
     * Creates a `<filter>` element
     **
     - filstr (string) SVG fragment of filter provided as a string
     = (object) @Element
     * Note: It is recommended to use filters embedded into the page inside an empty SVG element.
     > Usage
     | var f = paper.filter('<feGaussianBlur stdDeviation="2"/>'),
     |     c = paper.circle(10, 10, 10).attr({
     |         filter: f
     |     });
    \*/
    pproto.filter = function (filstr) {
        var paper = this;
        if (paper.type != "svg") {
            paper = paper.paper;
        }
        var f = Snap.parse(Str(filstr)),
            id = Snap._.id(),
            width = paper.node.offsetWidth,
            height = paper.node.offsetHeight,
            filter = $("filter");
        $(filter, {
            id: id,
            filterUnits: "userSpaceOnUse"
        });
        filter.appendChild(f.node);
        paper.defs.appendChild(filter);
        return new Element(filter);
    };

    eve.on("snap.util.getattr.filter", function () {
        eve.stop();
        var p = $(this.node, "filter");
        if (p) {
            var match = Str(p).match(rgurl);
            return match && Snap.select(match[1]);
        }
    });
    eve.on("snap.util.attr.filter", function (value) {
        if (value instanceof Element && value.type == "filter") {
            eve.stop();
            var id = value.node.id;
            if (!id) {
                $(value.node, {id: value.id});
                id = value.id;
            }
            $(this.node, {
                filter: Snap.url(id)
            });
        }
        if (!value || value == "none") {
            eve.stop();
            this.node.removeAttribute("filter");
        }
    });
    /*\
     * Snap.filter.blur
     [ method ]
     **
     * Returns an SVG markup string for the blur filter
     **
     - x (number) amount of horizontal blur, in pixels
     - y (number) #optional amount of vertical blur, in pixels
     = (string) filter representation
     > Usage
     | var f = paper.filter(Snap.filter.blur(5, 10)),
     |     c = paper.circle(10, 10, 10).attr({
     |         filter: f
     |     });
    \*/
    Snap.filter.blur = function (x, y) {
        if (x == null) {
            x = 2;
        }
        var def = y == null ? x : [x, y];
        return Snap.format('\<feGaussianBlur stdDeviation="{def}"/>', {
            def: def
        });
    };
    Snap.filter.blur.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.shadow
     [ method ]
     **
     * Returns an SVG markup string for the shadow filter
     **
     - dx (number) #optional horizontal shift of the shadow, in pixels
     - dy (number) #optional vertical shift of the shadow, in pixels
     - blur (number) #optional amount of blur
     - color (string) #optional color of the shadow
     - opacity (number) #optional `0..1` opacity of the shadow
     * or
     - dx (number) #optional horizontal shift of the shadow, in pixels
     - dy (number) #optional vertical shift of the shadow, in pixels
     - color (string) #optional color of the shadow
     - opacity (number) #optional `0..1` opacity of the shadow
     * which makes blur default to `4`. Or
     - dx (number) #optional horizontal shift of the shadow, in pixels
     - dy (number) #optional vertical shift of the shadow, in pixels
     - opacity (number) #optional `0..1` opacity of the shadow
     = (string) filter representation
     > Usage
     | var f = paper.filter(Snap.filter.shadow(0, 2, .3)),
     |     c = paper.circle(10, 10, 10).attr({
     |         filter: f
     |     });
    \*/
    Snap.filter.shadow = function (dx, dy, blur, color, opacity) {
        if (opacity == null) {
            if (color == null) {
                opacity = blur;
                blur = 4;
                color = "#000";
            } else {
                opacity = color;
                color = blur;
                blur = 4;
            }
        }
        if (blur == null) {
            blur = 4;
        }
        if (opacity == null) {
            opacity = 1;
        }
        if (dx == null) {
            dx = 0;
            dy = 2;
        }
        if (dy == null) {
            dy = dx;
        }
        color = Snap.color(color);
        return Snap.format('<feGaussianBlur in="SourceAlpha" stdDeviation="{blur}"/><feOffset dx="{dx}" dy="{dy}" result="offsetblur"/><feFlood flood-color="{color}"/><feComposite in2="offsetblur" operator="in"/><feComponentTransfer><feFuncA type="linear" slope="{opacity}"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>', {
            color: color,
            dx: dx,
            dy: dy,
            blur: blur,
            opacity: opacity
        });
    };
    Snap.filter.shadow.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.grayscale
     [ method ]
     **
     * Returns an SVG markup string for the grayscale filter
     **
     - amount (number) amount of filter (`0..1`)
     = (string) filter representation
    \*/
    Snap.filter.grayscale = function (amount) {
        if (amount == null) {
            amount = 1;
        }
        return Snap.format('<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {b} {h} 0 0 0 0 0 1 0"/>', {
            a: 0.2126 + 0.7874 * (1 - amount),
            b: 0.7152 - 0.7152 * (1 - amount),
            c: 0.0722 - 0.0722 * (1 - amount),
            d: 0.2126 - 0.2126 * (1 - amount),
            e: 0.7152 + 0.2848 * (1 - amount),
            f: 0.0722 - 0.0722 * (1 - amount),
            g: 0.2126 - 0.2126 * (1 - amount),
            h: 0.0722 + 0.9278 * (1 - amount)
        });
    };
    Snap.filter.grayscale.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.sepia
     [ method ]
     **
     * Returns an SVG markup string for the sepia filter
     **
     - amount (number) amount of filter (`0..1`)
     = (string) filter representation
    \*/
    Snap.filter.sepia = function (amount) {
        if (amount == null) {
            amount = 1;
        }
        return Snap.format('<feColorMatrix type="matrix" values="{a} {b} {c} 0 0 {d} {e} {f} 0 0 {g} {h} {i} 0 0 0 0 0 1 0"/>', {
            a: 0.393 + 0.607 * (1 - amount),
            b: 0.769 - 0.769 * (1 - amount),
            c: 0.189 - 0.189 * (1 - amount),
            d: 0.349 - 0.349 * (1 - amount),
            e: 0.686 + 0.314 * (1 - amount),
            f: 0.168 - 0.168 * (1 - amount),
            g: 0.272 - 0.272 * (1 - amount),
            h: 0.534 - 0.534 * (1 - amount),
            i: 0.131 + 0.869 * (1 - amount)
        });
    };
    Snap.filter.sepia.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.saturate
     [ method ]
     **
     * Returns an SVG markup string for the saturate filter
     **
     - amount (number) amount of filter (`0..1`)
     = (string) filter representation
    \*/
    Snap.filter.saturate = function (amount) {
        if (amount == null) {
            amount = 1;
        }
        return Snap.format('<feColorMatrix type="saturate" values="{amount}"/>', {
            amount: 1 - amount
        });
    };
    Snap.filter.saturate.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.hueRotate
     [ method ]
     **
     * Returns an SVG markup string for the hue-rotate filter
     **
     - angle (number) angle of rotation
     = (string) filter representation
    \*/
    Snap.filter.hueRotate = function (angle) {
        angle = angle || 0;
        return Snap.format('<feColorMatrix type="hueRotate" values="{angle}"/>', {
            angle: angle
        });
    };
    Snap.filter.hueRotate.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.invert
     [ method ]
     **
     * Returns an SVG markup string for the invert filter
     **
     - amount (number) amount of filter (`0..1`)
     = (string) filter representation
    \*/
    Snap.filter.invert = function (amount) {
        if (amount == null) {
            amount = 1;
        }
//        <feColorMatrix type="matrix" values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0" color-interpolation-filters="sRGB"/>
        return Snap.format('<feComponentTransfer><feFuncR type="table" tableValues="{amount} {amount2}"/><feFuncG type="table" tableValues="{amount} {amount2}"/><feFuncB type="table" tableValues="{amount} {amount2}"/></feComponentTransfer>', {
            amount: amount,
            amount2: 1 - amount
        });
    };
    Snap.filter.invert.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.brightness
     [ method ]
     **
     * Returns an SVG markup string for the brightness filter
     **
     - amount (number) amount of filter (`0..1`)
     = (string) filter representation
    \*/
    Snap.filter.brightness = function (amount) {
        if (amount == null) {
            amount = 1;
        }
        return Snap.format('<feComponentTransfer><feFuncR type="linear" slope="{amount}"/><feFuncG type="linear" slope="{amount}"/><feFuncB type="linear" slope="{amount}"/></feComponentTransfer>', {
            amount: amount
        });
    };
    Snap.filter.brightness.toString = function () {
        return this();
    };
    /*\
     * Snap.filter.contrast
     [ method ]
     **
     * Returns an SVG markup string for the contrast filter
     **
     - amount (number) amount of filter (`0..1`)
     = (string) filter representation
    \*/
    Snap.filter.contrast = function (amount) {
        if (amount == null) {
            amount = 1;
        }
        return Snap.format('<feComponentTransfer><feFuncR type="linear" slope="{amount}" intercept="{amount2}"/><feFuncG type="linear" slope="{amount}" intercept="{amount2}"/><feFuncB type="linear" slope="{amount}" intercept="{amount2}"/></feComponentTransfer>', {
            amount: amount,
            amount2: .5 - amount / 2
        });
    };
    Snap.filter.contrast.toString = function () {
        return this();
    };
});

// Copyright (c) 2014 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob, Fragment) {
    var box = Snap._.box,
        is = Snap.is,
        firstLetter = /^[^a-z]*([tbmlrc])/i,
        toString = function () {
            return "T" + this.dx + "," + this.dy;
        };
    /*\
     * Element.getAlign
     [ method ]
     **
     * Returns shift needed to align the element relatively to given element.
     * If no elements specified, parent `<svg>` container will be used.
     - el (object) @optional alignment element
     - way (string) one of six values: `"top"`, `"middle"`, `"bottom"`, `"left"`, `"center"`, `"right"`
     = (object|string) Object in format `{dx: , dy: }` also has a string representation as a transformation string
     > Usage
     | el.transform(el.getAlign(el2, "top"));
     * or
     | var dy = el.getAlign(el2, "top").dy;
    \*/
    Element.prototype.getAlign = function (el, way) {
        if (way == null && is(el, "string")) {
            way = el;
            el = null;
        }
        el = el || this.paper;
        var bx = el.getBBox ? el.getBBox() : box(el),
            bb = this.getBBox(),
            out = {};
        way = way && way.match(firstLetter);
        way = way ? way[1].toLowerCase() : "c";
        switch (way) {
            case "t":
                out.dx = 0;
                out.dy = bx.y - bb.y;
            break;
            case "b":
                out.dx = 0;
                out.dy = bx.y2 - bb.y2;
            break;
            case "m":
                out.dx = 0;
                out.dy = bx.cy - bb.cy;
            break;
            case "l":
                out.dx = bx.x - bb.x;
                out.dy = 0;
            break;
            case "r":
                out.dx = bx.x2 - bb.x2;
                out.dy = 0;
            break;
            default:
                out.dx = bx.cx - bb.cx;
                out.dy = 0;
            break;
        }
        out.toString = toString;
        return out;
    };
    /*\
     * Element.align
     [ method ]
     **
     * Aligns the element relatively to given one via transformation.
     * If no elements specified, parent `<svg>` container will be used.
     - el (object) @optional alignment element
     - way (string) one of six values: `"top"`, `"middle"`, `"bottom"`, `"left"`, `"center"`, `"right"`
     = (object) this element
     > Usage
     | el.align(el2, "top");
     * or
     | el.align("middle");
    \*/
    Element.prototype.align = function (el, way) {
        return this.transform("..." + this.getAlign(el, way));
    };
});

// Copyright (c) 2017 Adobe Systems Incorporated. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Snap.plugin(function (Snap, Element, Paper, glob) {
    // Colours are from https://www.materialui.co
    var red         = "#ffebee#ffcdd2#ef9a9a#e57373#ef5350#f44336#e53935#d32f2f#c62828#b71c1c#ff8a80#ff5252#ff1744#d50000",
        pink        = "#FCE4EC#F8BBD0#F48FB1#F06292#EC407A#E91E63#D81B60#C2185B#AD1457#880E4F#FF80AB#FF4081#F50057#C51162",
        purple      = "#F3E5F5#E1BEE7#CE93D8#BA68C8#AB47BC#9C27B0#8E24AA#7B1FA2#6A1B9A#4A148C#EA80FC#E040FB#D500F9#AA00FF",
        deeppurple  = "#EDE7F6#D1C4E9#B39DDB#9575CD#7E57C2#673AB7#5E35B1#512DA8#4527A0#311B92#B388FF#7C4DFF#651FFF#6200EA",
        indigo      = "#E8EAF6#C5CAE9#9FA8DA#7986CB#5C6BC0#3F51B5#3949AB#303F9F#283593#1A237E#8C9EFF#536DFE#3D5AFE#304FFE",
        blue        = "#E3F2FD#BBDEFB#90CAF9#64B5F6#64B5F6#2196F3#1E88E5#1976D2#1565C0#0D47A1#82B1FF#448AFF#2979FF#2962FF",
        lightblue   = "#E1F5FE#B3E5FC#81D4FA#4FC3F7#29B6F6#03A9F4#039BE5#0288D1#0277BD#01579B#80D8FF#40C4FF#00B0FF#0091EA",
        cyan        = "#E0F7FA#B2EBF2#80DEEA#4DD0E1#26C6DA#00BCD4#00ACC1#0097A7#00838F#006064#84FFFF#18FFFF#00E5FF#00B8D4",
        teal        = "#E0F2F1#B2DFDB#80CBC4#4DB6AC#26A69A#009688#00897B#00796B#00695C#004D40#A7FFEB#64FFDA#1DE9B6#00BFA5",
        green       = "#E8F5E9#C8E6C9#A5D6A7#81C784#66BB6A#4CAF50#43A047#388E3C#2E7D32#1B5E20#B9F6CA#69F0AE#00E676#00C853",
        lightgreen  = "#F1F8E9#DCEDC8#C5E1A5#AED581#9CCC65#8BC34A#7CB342#689F38#558B2F#33691E#CCFF90#B2FF59#76FF03#64DD17",
        lime        = "#F9FBE7#F0F4C3#E6EE9C#DCE775#D4E157#CDDC39#C0CA33#AFB42B#9E9D24#827717#F4FF81#EEFF41#C6FF00#AEEA00",
        yellow      = "#FFFDE7#FFF9C4#FFF59D#FFF176#FFEE58#FFEB3B#FDD835#FBC02D#F9A825#F57F17#FFFF8D#FFFF00#FFEA00#FFD600",
        amber       = "#FFF8E1#FFECB3#FFE082#FFD54F#FFCA28#FFC107#FFB300#FFA000#FF8F00#FF6F00#FFE57F#FFD740#FFC400#FFAB00",
        orange      = "#FFF3E0#FFE0B2#FFCC80#FFB74D#FFA726#FF9800#FB8C00#F57C00#EF6C00#E65100#FFD180#FFAB40#FF9100#FF6D00",
        deeporange  = "#FBE9E7#FFCCBC#FFAB91#FF8A65#FF7043#FF5722#F4511E#E64A19#D84315#BF360C#FF9E80#FF6E40#FF3D00#DD2C00",
        brown       = "#EFEBE9#D7CCC8#BCAAA4#A1887F#8D6E63#795548#6D4C41#5D4037#4E342E#3E2723",
        grey        = "#FAFAFA#F5F5F5#EEEEEE#E0E0E0#BDBDBD#9E9E9E#757575#616161#424242#212121",
        bluegrey    = "#ECEFF1#CFD8DC#B0BEC5#90A4AE#78909C#607D8B#546E7A#455A64#37474F#263238";
    /*\
     * Snap.mui
     [ property ]
     **
     * Contain Material UI colours.
     | Snap().rect(0, 0, 10, 10).attr({fill: Snap.mui.deeppurple, stroke: Snap.mui.amber[600]});
     # For colour reference: <a href="https://www.materialui.co">https://www.materialui.co</a>.
    \*/
    Snap.mui = {};
    /*\
     * Snap.flat
     [ property ]
     **
     * Contain Flat UI colours.
     | Snap().rect(0, 0, 10, 10).attr({fill: Snap.flat.carrot, stroke: Snap.flat.wetasphalt});
     # For colour reference: <a href="https://www.materialui.co">https://www.materialui.co</a>.
    \*/
    Snap.flat = {};
    function saveColor(colors) {
        colors = colors.split(/(?=#)/);
        var color = new String(colors[5]);
        color[50] = colors[0];
        color[100] = colors[1];
        color[200] = colors[2];
        color[300] = colors[3];
        color[400] = colors[4];
        color[500] = colors[5];
        color[600] = colors[6];
        color[700] = colors[7];
        color[800] = colors[8];
        color[900] = colors[9];
        if (colors[10]) {
            color.A100 = colors[10];
            color.A200 = colors[11];
            color.A400 = colors[12];
            color.A700 = colors[13];
        }
        return color;
    }
    Snap.mui.red = saveColor(red);
    Snap.mui.pink = saveColor(pink);
    Snap.mui.purple = saveColor(purple);
    Snap.mui.deeppurple = saveColor(deeppurple);
    Snap.mui.indigo = saveColor(indigo);
    Snap.mui.blue = saveColor(blue);
    Snap.mui.lightblue = saveColor(lightblue);
    Snap.mui.cyan = saveColor(cyan);
    Snap.mui.teal = saveColor(teal);
    Snap.mui.green = saveColor(green);
    Snap.mui.lightgreen = saveColor(lightgreen);
    Snap.mui.lime = saveColor(lime);
    Snap.mui.yellow = saveColor(yellow);
    Snap.mui.amber = saveColor(amber);
    Snap.mui.orange = saveColor(orange);
    Snap.mui.deeporange = saveColor(deeporange);
    Snap.mui.brown = saveColor(brown);
    Snap.mui.grey = saveColor(grey);
    Snap.mui.bluegrey = saveColor(bluegrey);
    Snap.flat.turquoise = "#1abc9c";
    Snap.flat.greensea = "#16a085";
    Snap.flat.sunflower = "#f1c40f";
    Snap.flat.orange = "#f39c12";
    Snap.flat.emerland = "#2ecc71";
    Snap.flat.nephritis = "#27ae60";
    Snap.flat.carrot = "#e67e22";
    Snap.flat.pumpkin = "#d35400";
    Snap.flat.peterriver = "#3498db";
    Snap.flat.belizehole = "#2980b9";
    Snap.flat.alizarin = "#e74c3c";
    Snap.flat.pomegranate = "#c0392b";
    Snap.flat.amethyst = "#9b59b6";
    Snap.flat.wisteria = "#8e44ad";
    Snap.flat.clouds = "#ecf0f1";
    Snap.flat.silver = "#bdc3c7";
    Snap.flat.wetasphalt = "#34495e";
    Snap.flat.midnightblue = "#2c3e50";
    Snap.flat.concrete = "#95a5a6";
    Snap.flat.asbestos = "#7f8c8d";
    /*\
     * Snap.importMUIColors
     [ method ]
     **
     * Imports Material UI colours into global object.
     | Snap.importMUIColors();
     | Snap().rect(0, 0, 10, 10).attr({fill: deeppurple, stroke: amber[600]});
     # For colour reference: <a href="https://www.materialui.co">https://www.materialui.co</a>.
    \*/
    Snap.importMUIColors = function () {
        for (var color in Snap.mui) {
            if (Snap.mui.hasOwnProperty(color)) {
                window[color] = Snap.mui[color];
            }
        }
    };
});

return Snap;
}));
},{"eve":"node_modules/eve/eve.js"}],"node_modules/interactjs/dist/interact.min.js":[function(require,module,exports) {
var define;
var global = arguments[3];
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.interact = f()}})(function(){var define,module,exports;
var createModuleFactory = function createModuleFactory(t){var e;return function(r){return e||t(e={exports:{},parent:r},e.exports),e.exports}};
var _$Interactable_20 = createModuleFactory(function (module, exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.Interactable = void 0;

var arr = _interopRequireWildcard(_$arr_64);

var _browser = _interopRequireDefault(_$browser_65);

var _clone = _interopRequireDefault(_$clone_66);

/* removed: var _$domUtils_69 = require("@interactjs/utils/domUtils"); */;

var _events = _interopRequireDefault(_$events_70);

var _extend = _interopRequireDefault(_$extend_72);

var is = _interopRequireWildcard(_$is_76);

var _normalizeListeners = _interopRequireDefault(_$normalizeListeners_78);

/* removed: var _$window_83 = require("@interactjs/utils/window"); */;

var _Eventable = _interopRequireDefault(_$Eventable_17);

var _scope = _$scope_28({});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/** */
var Interactable = /*#__PURE__*/function () {
  _createClass(Interactable, [{
    key: "_defaults",
    get: function get() {
      return {
        base: {},
        perAction: {},
        actions: {}
      };
    }
  }]);

  /** */
  function Interactable(target, options, defaultContext) {
    _classCallCheck(this, Interactable);

    _defineProperty(this, "options", void 0);

    _defineProperty(this, "_actions", void 0);

    _defineProperty(this, "target", void 0);

    _defineProperty(this, "events", new _Eventable["default"]());

    _defineProperty(this, "_context", void 0);

    _defineProperty(this, "_win", void 0);

    _defineProperty(this, "_doc", void 0);

    this._actions = options.actions;
    this.target = target;
    this._context = options.context || defaultContext;
    this._win = (0, _$window_83.getWindow)((0, _$domUtils_69.trySelector)(target) ? this._context : target);
    this._doc = this._win.document;
    this.set(options);
  }

  _createClass(Interactable, [{
    key: "setOnEvents",
    value: function setOnEvents(actionName, phases) {
      if (is.func(phases.onstart)) {
        this.on("".concat(actionName, "start"), phases.onstart);
      }

      if (is.func(phases.onmove)) {
        this.on("".concat(actionName, "move"), phases.onmove);
      }

      if (is.func(phases.onend)) {
        this.on("".concat(actionName, "end"), phases.onend);
      }

      if (is.func(phases.oninertiastart)) {
        this.on("".concat(actionName, "inertiastart"), phases.oninertiastart);
      }

      return this;
    }
  }, {
    key: "updatePerActionListeners",
    value: function updatePerActionListeners(actionName, prev, cur) {
      if (is.array(prev) || is.object(prev)) {
        this.off(actionName, prev);
      }

      if (is.array(cur) || is.object(cur)) {
        this.on(actionName, cur);
      }
    }
  }, {
    key: "setPerAction",
    value: function setPerAction(actionName, options) {
      var defaults = this._defaults; // for all the default per-action options

      for (var optionName_ in options) {
        var optionName = optionName_;
        var actionOptions = this.options[actionName];
        var optionValue = options[optionName]; // remove old event listeners and add new ones

        if (optionName === 'listeners') {
          this.updatePerActionListeners(actionName, actionOptions.listeners, optionValue);
        } // if the option value is an array


        if (is.array(optionValue)) {
          actionOptions[optionName] = arr.from(optionValue);
        } // if the option value is an object
        else if (is.plainObject(optionValue)) {
            // copy the object
            actionOptions[optionName] = (0, _extend["default"])(actionOptions[optionName] || {}, (0, _clone["default"])(optionValue)); // set anabled field to true if it exists in the defaults

            if (is.object(defaults.perAction[optionName]) && 'enabled' in defaults.perAction[optionName]) {
              actionOptions[optionName].enabled = optionValue.enabled !== false;
            }
          } // if the option value is a boolean and the default is an object
          else if (is.bool(optionValue) && is.object(defaults.perAction[optionName])) {
              actionOptions[optionName].enabled = optionValue;
            } // if it's anything else, do a plain assignment
            else {
                actionOptions[optionName] = optionValue;
              }
      }
    }
    /**
     * The default function to get an Interactables bounding rect. Can be
     * overridden using {@link Interactable.rectChecker}.
     *
     * @param {Element} [element] The element to measure.
     * @return {object} The object's bounding rectangle.
     */

  }, {
    key: "getRect",
    value: function getRect(element) {
      element = element || (is.element(this.target) ? this.target : null);

      if (is.string(this.target)) {
        element = element || this._context.querySelector(this.target);
      }

      return (0, _$domUtils_69.getElementRect)(element);
    }
    /**
     * Returns or sets the function used to calculate the interactable's
     * element's rectangle
     *
     * @param {function} [checker] A function which returns this Interactable's
     * bounding rectangle. See {@link Interactable.getRect}
     * @return {function | object} The checker function or this Interactable
     */

  }, {
    key: "rectChecker",
    value: function rectChecker(checker) {
      if (is.func(checker)) {
        this.getRect = checker;
        return this;
      }

      if (checker === null) {
        delete this.getRect;
        return this;
      }

      return this.getRect;
    }
  }, {
    key: "_backCompatOption",
    value: function _backCompatOption(optionName, newValue) {
      if ((0, _$domUtils_69.trySelector)(newValue) || is.object(newValue)) {
        this.options[optionName] = newValue;

        for (var action in this._actions.map) {
          this.options[action][optionName] = newValue;
        }

        return this;
      }

      return this.options[optionName];
    }
    /**
     * Gets or sets the origin of the Interactable's element.  The x and y
     * of the origin will be subtracted from action event coordinates.
     *
     * @param {Element | object | string} [origin] An HTML or SVG Element whose
     * rect will be used, an object eg. { x: 0, y: 0 } or string 'parent', 'self'
     * or any CSS selector
     *
     * @return {object} The current origin or this Interactable
     */

  }, {
    key: "origin",
    value: function origin(newValue) {
      return this._backCompatOption('origin', newValue);
    }
    /**
     * Returns or sets the mouse coordinate types used to calculate the
     * movement of the pointer.
     *
     * @param {string} [newValue] Use 'client' if you will be scrolling while
     * interacting; Use 'page' if you want autoScroll to work
     * @return {string | object} The current deltaSource or this Interactable
     */

  }, {
    key: "deltaSource",
    value: function deltaSource(newValue) {
      if (newValue === 'page' || newValue === 'client') {
        this.options.deltaSource = newValue;
        return this;
      }

      return this.options.deltaSource;
    }
    /**
     * Gets the selector context Node of the Interactable. The default is
     * `window.document`.
     *
     * @return {Node} The context Node of this Interactable
     */

  }, {
    key: "context",
    value: function context() {
      return this._context;
    }
  }, {
    key: "inContext",
    value: function inContext(element) {
      return this._context === element.ownerDocument || (0, _$domUtils_69.nodeContains)(this._context, element);
    }
  }, {
    key: "testIgnoreAllow",
    value: function testIgnoreAllow(options, targetNode, eventTarget) {
      return !this.testIgnore(options.ignoreFrom, targetNode, eventTarget) && this.testAllow(options.allowFrom, targetNode, eventTarget);
    }
  }, {
    key: "testAllow",
    value: function testAllow(allowFrom, targetNode, element) {
      if (!allowFrom) {
        return true;
      }

      if (!is.element(element)) {
        return false;
      }

      if (is.string(allowFrom)) {
        return (0, _$domUtils_69.matchesUpTo)(element, allowFrom, targetNode);
      } else if (is.element(allowFrom)) {
        return (0, _$domUtils_69.nodeContains)(allowFrom, element);
      }

      return false;
    }
  }, {
    key: "testIgnore",
    value: function testIgnore(ignoreFrom, targetNode, element) {
      if (!ignoreFrom || !is.element(element)) {
        return false;
      }

      if (is.string(ignoreFrom)) {
        return (0, _$domUtils_69.matchesUpTo)(element, ignoreFrom, targetNode);
      } else if (is.element(ignoreFrom)) {
        return (0, _$domUtils_69.nodeContains)(ignoreFrom, element);
      }

      return false;
    }
    /**
     * Calls listeners for the given InteractEvent type bound globally
     * and directly to this Interactable
     *
     * @param {InteractEvent} iEvent The InteractEvent object to be fired on this
     * Interactable
     * @return {Interactable} this Interactable
     */

  }, {
    key: "fire",
    value: function fire(iEvent) {
      this.events.fire(iEvent);
      return this;
    }
  }, {
    key: "_onOff",
    value: function _onOff(method, typeArg, listenerArg, options) {
      if (is.object(typeArg) && !is.array(typeArg)) {
        options = listenerArg;
        listenerArg = null;
      }

      var addRemove = method === 'on' ? 'add' : 'remove';
      var listeners = (0, _normalizeListeners["default"])(typeArg, listenerArg);

      for (var type in listeners) {
        if (type === 'wheel') {
          type = _browser["default"].wheelEvent;
        }

        for (var _i = 0; _i < listeners[type].length; _i++) {
          var _ref;

          _ref = listeners[type][_i];
          var listener = _ref;

          // if it is an action event type
          if ((0, _scope.isNonNativeEvent)(type, this._actions)) {
            this.events[method](type, listener);
          } // delegated event
          else if (is.string(this.target)) {
              _events["default"]["".concat(addRemove, "Delegate")](this.target, this._context, type, listener, options);
            } // remove listener from this Interactable's element
            else {
                _events["default"][addRemove](this.target, type, listener, options);
              }
        }
      }

      return this;
    }
    /**
     * Binds a listener for an InteractEvent, pointerEvent or DOM event.
     *
     * @param {string | array | object} types The types of events to listen
     * for
     * @param {function | array | object} [listener] The event listener function(s)
     * @param {object | boolean} [options] options object or useCapture flag for
     * addEventListener
     * @return {Interactable} This Interactable
     */

  }, {
    key: "on",
    value: function on(types, listener, options) {
      return this._onOff('on', types, listener, options);
    }
    /**
     * Removes an InteractEvent, pointerEvent or DOM event listener.
     *
     * @param {string | array | object} types The types of events that were
     * listened for
     * @param {function | array | object} [listener] The event listener function(s)
     * @param {object | boolean} [options] options object or useCapture flag for
     * removeEventListener
     * @return {Interactable} This Interactable
     */

  }, {
    key: "off",
    value: function off(types, listener, options) {
      return this._onOff('off', types, listener, options);
    }
    /**
     * Reset the options of this Interactable
     *
     * @param {object} options The new settings to apply
     * @return {object} This Interactable
     */

  }, {
    key: "set",
    value: function set(options) {
      var defaults = this._defaults;

      if (!is.object(options)) {
        options = {};
      }

      this.options = (0, _clone["default"])(defaults.base);

      for (var actionName_ in this._actions.methodDict) {
        var actionName = actionName_;
        var methodName = this._actions.methodDict[actionName];
        this.options[actionName] = {};
        this.setPerAction(actionName, (0, _extend["default"])((0, _extend["default"])({}, defaults.perAction), defaults.actions[actionName]));
        this[methodName](options[actionName]);
      }

      for (var setting in options) {
        if (is.func(this[setting])) {
          this[setting](options[setting]);
        }
      }

      return this;
    }
    /**
     * Remove this interactable from the list of interactables and remove it's
     * action capabilities and event listeners
     *
     * @return {interact}
     */

  }, {
    key: "unset",
    value: function unset() {
      _events["default"].remove(this.target, 'all');

      if (is.string(this.target)) {
        // remove delegated events
        for (var type in _events["default"].delegatedEvents) {
          var delegated = _events["default"].delegatedEvents[type];

          if (delegated.selectors[0] === this.target && delegated.contexts[0] === this._context) {
            delegated.selectors.splice(0, 1);
            delegated.contexts.splice(0, 1);
            delegated.listeners.splice(0, 1);
          }

          _events["default"].remove(this._context, type, _events["default"].delegateListener);

          _events["default"].remove(this._context, type, _events["default"].delegateUseCapture, true);
        }
      } else {
        _events["default"].remove(this.target, 'all');
      }
    }
  }]);

  return Interactable;
}();

exports.Interactable = Interactable;
var _default = Interactable;
exports["default"] = _default;

});
var _$scope_28 = createModuleFactory(function (module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isNonNativeEvent = isNonNativeEvent;
exports.initScope = initScope;
exports.Scope = exports["default"] = void 0;

var _domObjects = _interopRequireDefault(_$domObjects_68);

var utils = _interopRequireWildcard(_$index_75);

var _Eventable = _interopRequireDefault(_$Eventable_17);

var _InteractEvent = _interopRequireDefault(_$InteractEvent_18);

var _InteractStatic = _interopRequireDefault(_$InteractStatic_19({}));

var _Interactable = _interopRequireDefault(_$Interactable_20({}));

var _InteractableSet = _interopRequireDefault(_$InteractableSet_21);

var _defaultOptions = _interopRequireDefault(_$defaultOptions_24);

var _interactions = _interopRequireDefault(_$interactions_27({}));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var win = utils.win,
    browser = utils.browser,
    raf = utils.raf,
    events = utils.events; // eslint-disable-next-line @typescript-eslint/no-empty-interface

var Scope = /*#__PURE__*/function () {
  // main window
  // main document
  // main window
  // all documents being listened to
  function Scope() {
    var _this = this;

    _classCallCheck(this, Scope);

    _defineProperty(this, "id", "__interact_scope_".concat(Math.floor(Math.random() * 100)));

    _defineProperty(this, "isInitialized", false);

    _defineProperty(this, "listenerMaps", []);

    _defineProperty(this, "browser", browser);

    _defineProperty(this, "events", events);

    _defineProperty(this, "utils", utils);

    _defineProperty(this, "defaults", utils.clone(_defaultOptions["default"]));

    _defineProperty(this, "Eventable", _Eventable["default"]);

    _defineProperty(this, "actions", {
      map: {},
      phases: {
        start: true,
        move: true,
        end: true
      },
      methodDict: {},
      phaselessTypes: {}
    });

    _defineProperty(this, "interactStatic", new _InteractStatic["default"](this));

    _defineProperty(this, "InteractEvent", _InteractEvent["default"]);

    _defineProperty(this, "Interactable", void 0);

    _defineProperty(this, "interactables", new _InteractableSet["default"](this));

    _defineProperty(this, "_win", void 0);

    _defineProperty(this, "document", void 0);

    _defineProperty(this, "window", void 0);

    _defineProperty(this, "documents", []);

    _defineProperty(this, "_plugins", {
      list: [],
      map: {}
    });

    _defineProperty(this, "onWindowUnload", function (event) {
      return _this.removeDocument(event.target);
    });

    var scope = this;

    this.Interactable = /*#__PURE__*/function (_InteractableBase) {
      _inherits(_class, _InteractableBase);

      function _class() {
        _classCallCheck(this, _class);

        return _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
      }

      _createClass(_class, [{
        key: "set",
        value: function set(options) {
          _get(_getPrototypeOf(_class.prototype), "set", this).call(this, options);

          scope.fire('interactable:set', {
            options: options,
            interactable: this
          });
          return this;
        }
      }, {
        key: "unset",
        value: function unset() {
          _get(_getPrototypeOf(_class.prototype), "unset", this).call(this);

          scope.interactables.list.splice(scope.interactables.list.indexOf(this), 1);
          scope.fire('interactable:unset', {
            interactable: this
          });
        }
      }, {
        key: "_defaults",
        get: function get() {
          return scope.defaults;
        }
      }]);

      return _class;
    }(_Interactable["default"]);
  }

  _createClass(Scope, [{
    key: "addListeners",
    value: function addListeners(map, id) {
      this.listenerMaps.push({
        id: id,
        map: map
      });
    }
  }, {
    key: "fire",
    value: function fire(name, arg) {
      for (var _i = 0; _i < this.listenerMaps.length; _i++) {
        var _ref;

        _ref = this.listenerMaps[_i];
        var _ref2 = _ref,
            listener = _ref2.map[name];

        if (!!listener && listener(arg, this, name) === false) {
          return false;
        }
      }
    }
  }, {
    key: "init",
    value: function init(window) {
      return this.isInitialized ? this : initScope(this, window);
    }
  }, {
    key: "pluginIsInstalled",
    value: function pluginIsInstalled(plugin) {
      return this._plugins.map[plugin.id] || this._plugins.list.indexOf(plugin) !== -1;
    }
  }, {
    key: "usePlugin",
    value: function usePlugin(plugin, options) {
      if (this.pluginIsInstalled(plugin)) {
        return this;
      }

      if (plugin.id) {
        this._plugins.map[plugin.id] = plugin;
      }

      this._plugins.list.push(plugin);

      if (plugin.install) {
        plugin.install(this, options);
      }

      if (plugin.listeners && plugin.before) {
        var _index = 0;
        var len = this.listenerMaps.length;
        var before = plugin.before.reduce(function (acc, id) {
          acc[id] = true;
          return acc;
        }, {});

        for (; _index < len; _index++) {
          var otherId = this.listenerMaps[_index].id;

          if (before[otherId]) {
            break;
          }
        }

        this.listenerMaps.splice(_index, 0, {
          id: plugin.id,
          map: plugin.listeners
        });
      } else if (plugin.listeners) {
        this.listenerMaps.push({
          id: plugin.id,
          map: plugin.listeners
        });
      }

      return this;
    }
  }, {
    key: "addDocument",
    value: function addDocument(doc, options) {
      // do nothing if document is already known
      if (this.getDocIndex(doc) !== -1) {
        return false;
      }

      var window = win.getWindow(doc);
      options = options ? utils.extend({}, options) : {};
      this.documents.push({
        doc: doc,
        options: options
      });
      events.documents.push(doc); // don't add an unload event for the main document
      // so that the page may be cached in browser history

      if (doc !== this.document) {
        events.add(window, 'unload', this.onWindowUnload);
      }

      this.fire('scope:add-document', {
        doc: doc,
        window: window,
        scope: this,
        options: options
      });
    }
  }, {
    key: "removeDocument",
    value: function removeDocument(doc) {
      var index = this.getDocIndex(doc);
      var window = win.getWindow(doc);
      var options = this.documents[index].options;
      events.remove(window, 'unload', this.onWindowUnload);
      this.documents.splice(index, 1);
      events.documents.splice(index, 1);
      this.fire('scope:remove-document', {
        doc: doc,
        window: window,
        scope: this,
        options: options
      });
    }
  }, {
    key: "getDocIndex",
    value: function getDocIndex(doc) {
      for (var i = 0; i < this.documents.length; i++) {
        if (this.documents[i].doc === doc) {
          return i;
        }
      }

      return -1;
    }
  }, {
    key: "getDocOptions",
    value: function getDocOptions(doc) {
      var docIndex = this.getDocIndex(doc);
      return docIndex === -1 ? null : this.documents[docIndex].options;
    }
  }, {
    key: "now",
    value: function now() {
      return (this.window.Date || Date).now();
    }
  }]);

  return Scope;
}();

exports.Scope = exports["default"] = Scope;

function isNonNativeEvent(type, actions) {
  if (actions.phaselessTypes[type]) {
    return true;
  }

  for (var name in actions.map) {
    if (type.indexOf(name) === 0 && type.substr(name.length) in actions.phases) {
      return true;
    }
  }

  return false;
}

function initScope(scope, window) {
  scope.isInitialized = true;
  win.init(window);

  _domObjects["default"].init(window);

  browser.init(window);
  raf.init(window);
  events.init(window);
  scope.usePlugin(_interactions["default"]);
  scope.document = window.document;
  scope.window = window;
  return scope;
}

});
var _$interactions_27 = createModuleFactory(function (module, exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _browser = _interopRequireDefault(_$browser_65);

var _domObjects = _interopRequireDefault(_$domObjects_68);

/* removed: var _$domUtils_69 = require("@interactjs/utils/domUtils"); */;

var _events = _interopRequireDefault(_$events_70);

var pointerUtils = _interopRequireWildcard(_$pointerUtils_80);

var _Interaction = _interopRequireDefault(_$Interaction_22);

var _interactablePreventDefault = _interopRequireDefault(_$interactablePreventDefault_25);

var _interactionFinder = _interopRequireDefault(_$interactionFinder_26);

var _scope = _interopRequireDefault(_$scope_28({}));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var methodNames = ['pointerDown', 'pointerMove', 'pointerUp', 'updatePointer', 'removePointer', 'windowBlur'];

function install(scope) {
  var listeners = {};

  for (var _i = 0; _i < methodNames.length; _i++) {
    var _ref;

    _ref = methodNames[_i];
    var method = _ref;
    listeners[method] = doOnInteractions(method, scope);
  }

  var pEventTypes = _browser["default"].pEventTypes;
  var docEvents;

  if (_domObjects["default"].PointerEvent) {
    docEvents = [{
      type: pEventTypes.down,
      listener: releasePointersOnRemovedEls
    }, {
      type: pEventTypes.down,
      listener: listeners.pointerDown
    }, {
      type: pEventTypes.move,
      listener: listeners.pointerMove
    }, {
      type: pEventTypes.up,
      listener: listeners.pointerUp
    }, {
      type: pEventTypes.cancel,
      listener: listeners.pointerUp
    }];
  } else {
    docEvents = [{
      type: 'mousedown',
      listener: listeners.pointerDown
    }, {
      type: 'mousemove',
      listener: listeners.pointerMove
    }, {
      type: 'mouseup',
      listener: listeners.pointerUp
    }, {
      type: 'touchstart',
      listener: releasePointersOnRemovedEls
    }, {
      type: 'touchstart',
      listener: listeners.pointerDown
    }, {
      type: 'touchmove',
      listener: listeners.pointerMove
    }, {
      type: 'touchend',
      listener: listeners.pointerUp
    }, {
      type: 'touchcancel',
      listener: listeners.pointerUp
    }];
  }

  docEvents.push({
    type: 'blur',
    listener: function listener(event) {
      for (var _i2 = 0; _i2 < scope.interactions.list.length; _i2++) {
        var _ref2;

        _ref2 = scope.interactions.list[_i2];
        var interaction = _ref2;
        interaction.documentBlur(event);
      }
    }
  }); // for ignoring browser's simulated mouse events

  scope.prevTouchTime = 0;

  scope.Interaction = /*#__PURE__*/function (_InteractionBase) {
    _inherits(_class, _InteractionBase);

    function _class() {
      _classCallCheck(this, _class);

      return _possibleConstructorReturn(this, _getPrototypeOf(_class).apply(this, arguments));
    }

    _createClass(_class, [{
      key: "_now",
      value: function _now() {
        return scope.now();
      }
    }, {
      key: "pointerMoveTolerance",
      get: function get() {
        return scope.interactions.pointerMoveTolerance;
      },
      set: function set(value) {
        scope.interactions.pointerMoveTolerance = value;
      }
    }]);

    return _class;
  }(_Interaction["default"]);

  scope.interactions = {
    // all active and idle interactions
    list: [],
    "new": function _new(options) {
      options.scopeFire = function (name, arg) {
        return scope.fire(name, arg);
      };

      var interaction = new scope.Interaction(options);
      scope.interactions.list.push(interaction);
      return interaction;
    },
    listeners: listeners,
    docEvents: docEvents,
    pointerMoveTolerance: 1
  };

  function releasePointersOnRemovedEls() {
    // for all inactive touch interactions with pointers down
    for (var _i3 = 0; _i3 < scope.interactions.list.length; _i3++) {
      var _ref3;

      _ref3 = scope.interactions.list[_i3];
      var interaction = _ref3;

      if (!interaction.pointerIsDown || interaction.pointerType !== 'touch' || interaction._interacting) {
        continue;
      } // if a pointer is down on an element that is no longer in the DOM tree


      var _loop = function _loop() {
        _ref4 = interaction.pointers[_i4];
        var pointer = _ref4;

        if (!scope.documents.some(function (_ref5) {
          var doc = _ref5.doc;
          return (0, _$domUtils_69.nodeContains)(doc, pointer.downTarget);
        })) {
          // remove the pointer from the interaction
          interaction.removePointer(pointer.pointer, pointer.event);
        }
      };

      for (var _i4 = 0; _i4 < interaction.pointers.length; _i4++) {
        var _ref4;

        _loop();
      }
    }
  }

  scope.usePlugin(_interactablePreventDefault["default"]);
}

function doOnInteractions(method, scope) {
  return function (event) {
    var interactions = scope.interactions.list;
    var pointerType = pointerUtils.getPointerType(event);

    var _pointerUtils$getEven = pointerUtils.getEventTargets(event),
        _pointerUtils$getEven2 = _slicedToArray(_pointerUtils$getEven, 2),
        eventTarget = _pointerUtils$getEven2[0],
        curEventTarget = _pointerUtils$getEven2[1];

    var matches = []; // [ [pointer, interaction], ...]

    if (/^touch/.test(event.type)) {
      scope.prevTouchTime = scope.now();

      for (var _i5 = 0; _i5 < event.changedTouches.length; _i5++) {
        var _ref6;

        _ref6 = event.changedTouches[_i5];
        var changedTouch = _ref6;
        var pointer = changedTouch;
        var pointerId = pointerUtils.getPointerId(pointer);
        var searchDetails = {
          pointer: pointer,
          pointerId: pointerId,
          pointerType: pointerType,
          eventType: event.type,
          eventTarget: eventTarget,
          curEventTarget: curEventTarget,
          scope: scope
        };
        var interaction = getInteraction(searchDetails);
        matches.push([searchDetails.pointer, searchDetails.eventTarget, searchDetails.curEventTarget, interaction]);
      }
    } else {
      var invalidPointer = false;

      if (!_browser["default"].supportsPointerEvent && /mouse/.test(event.type)) {
        // ignore mouse events while touch interactions are active
        for (var i = 0; i < interactions.length && !invalidPointer; i++) {
          invalidPointer = interactions[i].pointerType !== 'mouse' && interactions[i].pointerIsDown;
        } // try to ignore mouse events that are simulated by the browser
        // after a touch event


        invalidPointer = invalidPointer || scope.now() - scope.prevTouchTime < 500 || // on iOS and Firefox Mobile, MouseEvent.timeStamp is zero if simulated
        event.timeStamp === 0;
      }

      if (!invalidPointer) {
        var _searchDetails = {
          pointer: event,
          pointerId: pointerUtils.getPointerId(event),
          pointerType: pointerType,
          eventType: event.type,
          curEventTarget: curEventTarget,
          eventTarget: eventTarget,
          scope: scope
        };

        var _interaction = getInteraction(_searchDetails);

        matches.push([_searchDetails.pointer, _searchDetails.eventTarget, _searchDetails.curEventTarget, _interaction]);
      }
    } // eslint-disable-next-line no-shadow


    for (var _i6 = 0; _i6 < matches.length; _i6++) {
      var _matches$_i = _slicedToArray(matches[_i6], 4),
          _pointer = _matches$_i[0],
          _eventTarget = _matches$_i[1],
          _curEventTarget = _matches$_i[2],
          _interaction2 = _matches$_i[3];

      _interaction2[method](_pointer, event, _eventTarget, _curEventTarget);
    }
  };
}

function getInteraction(searchDetails) {
  var pointerType = searchDetails.pointerType,
      scope = searchDetails.scope;

  var foundInteraction = _interactionFinder["default"].search(searchDetails);

  var signalArg = {
    interaction: foundInteraction,
    searchDetails: searchDetails
  };
  scope.fire('interactions:find', signalArg);
  return signalArg.interaction || scope.interactions["new"]({
    pointerType: pointerType
  });
}

function onDocSignal(_ref7, eventMethodName) {
  var doc = _ref7.doc,
      scope = _ref7.scope,
      options = _ref7.options;
  var docEvents = scope.interactions.docEvents;
  var eventMethod = _events["default"][eventMethodName];

  if (scope.browser.isIOS && !options.events) {
    options.events = {
      passive: false
    };
  } // delegate event listener


  for (var eventType in _events["default"].delegatedEvents) {
    eventMethod(doc, eventType, _events["default"].delegateListener);
    eventMethod(doc, eventType, _events["default"].delegateUseCapture, true);
  }

  var eventOptions = options && options.events;

  for (var _i7 = 0; _i7 < docEvents.length; _i7++) {
    var _ref8;

    _ref8 = docEvents[_i7];
    var _ref9 = _ref8,
        _type = _ref9.type,
        listener = _ref9.listener;
    eventMethod(doc, _type, listener, eventOptions);
  }
}

var interactions = {
  id: 'core/interactions',
  install: install,
  listeners: {
    'scope:add-document': function scopeAddDocument(arg) {
      return onDocSignal(arg, 'add');
    },
    'scope:remove-document': function scopeRemoveDocument(arg) {
      return onDocSignal(arg, 'remove');
    },
    'interactable:unset': function interactableUnset(_ref10, scope) {
      var interactable = _ref10.interactable;

      // Stop and destroy related interactions when an Interactable is unset
      for (var i = scope.interactions.list.length - 1; i >= 0; i--) {
        var interaction = scope.interactions.list[i];

        if (interaction.interactable !== interactable) {
          continue;
        }

        interaction.stop();
        scope.fire('interactions:destroy', {
          interaction: interaction
        });
        interaction.destroy();

        if (scope.interactions.list.length > 2) {
          scope.interactions.list.splice(i, 1);
        }
      }
    }
  },
  onDocSignal: onDocSignal,
  doOnInteractions: doOnInteractions,
  methodNames: methodNames
};
var _default = interactions;
exports["default"] = _default;

});
var _$InteractStatic_19 = createModuleFactory(function (module, exports) {
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.InteractStatic = void 0;

var _browser = _interopRequireDefault(_$browser_65);

var _events = _interopRequireDefault(_$events_70);

var utils = _interopRequireWildcard(_$index_75);

var _scope = _$scope_28({});

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var InteractStatic = /*#__PURE__*/function () {
  // expose the functions used to calculate multi-touch properties
  // eslint-disable-next-line no-undef
  function InteractStatic(scope) {
    var _this = this;

    _classCallCheck(this, InteractStatic);

    this.scope = scope;

    _defineProperty(this, "getPointerAverage", utils.pointer.pointerAverage);

    _defineProperty(this, "getTouchBBox", utils.pointer.touchBBox);

    _defineProperty(this, "getTouchDistance", utils.pointer.touchDistance);

    _defineProperty(this, "getTouchAngle", utils.pointer.touchAngle);

    _defineProperty(this, "getElementRect", utils.dom.getElementRect);

    _defineProperty(this, "getElementClientRect", utils.dom.getElementClientRect);

    _defineProperty(this, "matchesSelector", utils.dom.matchesSelector);

    _defineProperty(this, "closest", utils.dom.closest);

    _defineProperty(this, "globalEvents", {});

    _defineProperty(this, "dynamicDrop", void 0);

    _defineProperty(this, "version", "1.9.7");

    _defineProperty(this, "interact", void 0);

    var prototype = this.constructor.prototype;
    /**
     * ```js
     * interact('#draggable').draggable(true)
     *
     * var rectables = interact('rect')
     * rectables
     *   .gesturable(true)
     *   .on('gesturemove', function (event) {
     *       // ...
     *   })
     * ```
     *
     * The methods of this variable can be used to set elements as interactables
     * and also to change various default settings.
     *
     * Calling it as a function and passing an element or a valid CSS selector
     * string returns an Interactable object which has various methods to configure
     * it.
     *
     * @global
     *
     * @param {Element | string} target The HTML or SVG Element to interact with
     * or CSS selector
     * @return {Interactable}
     */

    var interact = function interact(target, options) {
      var interactable = scope.interactables.get(target, options);

      if (!interactable) {
        interactable = scope.interactables["new"](target, options);
        interactable.events.global = _this.globalEvents;
      }

      return interactable;
    };

    for (var _i = 0; _i < Object.getOwnPropertyNames(this.constructor.prototype).length; _i++) {
      var _ref;

      _ref = Object.getOwnPropertyNames(this.constructor.prototype)[_i];
      var _key = _ref;
      interact[_key] = prototype[_key];
    }

    utils.extend(interact, this);
    interact.constructor = this.constructor;
    this.interact = interact;
    return interact;
  }
  /**
   * Use a plugin
   *
   * @alias module:interact.use
   *
   * @param {Object} plugin
   * @param {function} plugin.install
   * @return {InteractStatic}
   */


  _createClass(InteractStatic, [{
    key: "use",
    value: function use(plugin, options) {
      this.scope.usePlugin(plugin, options);
      return this;
    }
    /**
     * Check if an element or selector has been set with the {@link interact}
     * function
     *
     * @alias module:interact.isSet
     *
     * @param {Element} element The Element being searched for
     * @return {boolean} Indicates if the element or CSS selector was previously
     * passed to interact
     */

  }, {
    key: "isSet",
    value: function isSet(target, options) {
      return !!this.scope.interactables.get(target, options && options.context);
    }
    /**
     * Add a global listener for an InteractEvent or adds a DOM event to `document`
     *
     * @alias module:interact.on
     *
     * @param {string | array | object} type The types of events to listen for
     * @param {function} listener The function event (s)
     * @param {object | boolean} [options] object or useCapture flag for
     * addEventListener
     * @return {object} interact
     */

  }, {
    key: "on",
    value: function on(type, listener, options) {
      if (utils.is.string(type) && type.search(' ') !== -1) {
        type = type.trim().split(/ +/);
      }

      if (utils.is.array(type)) {
        for (var _i2 = 0; _i2 < type.length; _i2++) {
          var _ref2;

          _ref2 = type[_i2];
          var eventType = _ref2;
          this.on(eventType, listener, options);
        }

        return this;
      }

      if (utils.is.object(type)) {
        for (var prop in type) {
          this.on(prop, type[prop], listener);
        }

        return this;
      } // if it is an InteractEvent type, add listener to globalEvents


      if ((0, _scope.isNonNativeEvent)(type, this.scope.actions)) {
        // if this type of event was never bound
        if (!this.globalEvents[type]) {
          this.globalEvents[type] = [listener];
        } else {
          this.globalEvents[type].push(listener);
        }
      } // If non InteractEvent type, addEventListener to document
      else {
          _events["default"].add(this.scope.document, type, listener, {
            options: options
          });
        }

      return this;
    }
    /**
     * Removes a global InteractEvent listener or DOM event from `document`
     *
     * @alias module:interact.off
     *
     * @param {string | array | object} type The types of events that were listened
     * for
     * @param {function} listener The listener function to be removed
     * @param {object | boolean} options [options] object or useCapture flag for
     * removeEventListener
     * @return {object} interact
     */

  }, {
    key: "off",
    value: function off(type, listener, options) {
      if (utils.is.string(type) && type.search(' ') !== -1) {
        type = type.trim().split(/ +/);
      }

      if (utils.is.array(type)) {
        for (var _i3 = 0; _i3 < type.length; _i3++) {
          var _ref3;

          _ref3 = type[_i3];
          var eventType = _ref3;
          this.off(eventType, listener, options);
        }

        return this;
      }

      if (utils.is.object(type)) {
        for (var prop in type) {
          this.off(prop, type[prop], listener);
        }

        return this;
      }

      if ((0, _scope.isNonNativeEvent)(type, this.scope.actions)) {
        var index;

        if (type in this.globalEvents && (index = this.globalEvents[type].indexOf(listener)) !== -1) {
          this.globalEvents[type].splice(index, 1);
        }
      } else {
        _events["default"].remove(this.scope.document, type, listener, options);
      }

      return this;
    }
  }, {
    key: "debug",
    value: function debug() {
      return this.scope;
    }
    /**
     * @alias module:interact.supportsTouch
     *
     * @return {boolean} Whether or not the browser supports touch input
     */

  }, {
    key: "supportsTouch",
    value: function supportsTouch() {
      return _browser["default"].supportsTouch;
    }
    /**
     * @alias module:interact.supportsPointerEvent
     *
     * @return {boolean} Whether or not the browser supports PointerEvents
     */

  }, {
    key: "supportsPointerEvent",
    value: function supportsPointerEvent() {
      return _browser["default"].supportsPointerEvent;
    }
    /**
     * Cancels all interactions (end events are not fired)
     *
     * @alias module:interact.stop
     *
     * @return {object} interact
     */

  }, {
    key: "stop",
    value: function stop() {
      for (var _i4 = 0; _i4 < this.scope.interactions.list.length; _i4++) {
        var _ref4;

        _ref4 = this.scope.interactions.list[_i4];
        var interaction = _ref4;
        interaction.stop();
      }

      return this;
    }
    /**
     * Returns or sets the distance the pointer must be moved before an action
     * sequence occurs. This also affects tolerance for tap events.
     *
     * @alias module:interact.pointerMoveTolerance
     *
     * @param {number} [newValue] The movement from the start position must be greater than this value
     * @return {interact | number}
     */

  }, {
    key: "pointerMoveTolerance",
    value: function pointerMoveTolerance(newValue) {
      if (utils.is.number(newValue)) {
        this.scope.interactions.pointerMoveTolerance = newValue;
        return this;
      }

      return this.scope.interactions.pointerMoveTolerance;
    }
  }, {
    key: "addDocument",
    value: function addDocument(doc, options) {
      this.scope.addDocument(doc, options);
    }
  }, {
    key: "removeDocument",
    value: function removeDocument(doc) {
      this.scope.removeDocument(doc);
    }
  }]);

  return InteractStatic;
}();

exports.InteractStatic = InteractStatic;
var _default = InteractStatic;
exports["default"] = _default;

});
var _$index_63 = {};
/// <reference path="./types.d.ts" />
"use strict";

var _$isWindow_77 = {};
"use strict";

Object.defineProperty(_$isWindow_77, "__esModule", {
  value: true
});
_$isWindow_77["default"] = void 0;

var _default = function _default(thing) {
  return !!(thing && thing.Window) && thing instanceof thing.Window;
};

_$isWindow_77["default"] = _default;

var _$window_83 = {};
"use strict";

Object.defineProperty(_$window_83, "__esModule", {
  value: true
});
_$window_83.init = init;
_$window_83.getWindow = getWindow;
_$window_83["default"] = void 0;

var _isWindow = _interopRequireDefault(_$isWindow_77);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var win = {
  realWindow: undefined,
  window: undefined,
  getWindow: getWindow,
  init: init
};

function init(window) {
  // get wrapped window if using Shadow DOM polyfill
  win.realWindow = window; // create a TextNode

  var el = window.document.createTextNode(''); // check if it's wrapped by a polyfill

  if (el.ownerDocument !== window.document && typeof window.wrap === 'function' && window.wrap(el) === el) {
    // use wrapped window
    window = window.wrap(window);
  }

  win.window = window;
}

if (typeof window === 'undefined') {
  win.window = undefined;
  win.realWindow = undefined;
} else {
  init(window);
}

function getWindow(node) {
  if ((0, _isWindow["default"])(node)) {
    return node;
  }

  var rootNode = node.ownerDocument || node;
  return rootNode.defaultView || win.window;
}

win.init = init;
var ___default_83 = win;
_$window_83["default"] = ___default_83;

var _$is_76 = {};
"use strict";

Object.defineProperty(_$is_76, "__esModule", {
  value: true
});
_$is_76.array = _$is_76.plainObject = _$is_76.element = _$is_76.string = _$is_76.bool = _$is_76.number = _$is_76.func = _$is_76.object = _$is_76.docFrag = _$is_76.window = void 0;

var ___isWindow_76 = ___interopRequireDefault_76(_$isWindow_77);

var _window2 = ___interopRequireDefault_76(_$window_83);

function ___interopRequireDefault_76(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var __window_76 = function window(thing) {
  return thing === _window2["default"].window || (0, ___isWindow_76["default"])(thing);
};

_$is_76.window = __window_76;

var docFrag = function docFrag(thing) {
  return object(thing) && thing.nodeType === 11;
};

_$is_76.docFrag = docFrag;

var object = function object(thing) {
  return !!thing && _typeof(thing) === 'object';
};

_$is_76.object = object;

var func = function func(thing) {
  return typeof thing === 'function';
};

_$is_76.func = func;

var number = function number(thing) {
  return typeof thing === 'number';
};

_$is_76.number = number;

var bool = function bool(thing) {
  return typeof thing === 'boolean';
};

_$is_76.bool = bool;

var string = function string(thing) {
  return typeof thing === 'string';
};

_$is_76.string = string;

var element = function element(thing) {
  if (!thing || _typeof(thing) !== 'object') {
    return false;
  }

  var _window = _window2["default"].getWindow(thing) || _window2["default"].window;

  return /object|function/.test(_typeof(_window.Element)) ? thing instanceof _window.Element // DOM2
  : thing.nodeType === 1 && typeof thing.nodeName === 'string';
};

_$is_76.element = element;

var plainObject = function plainObject(thing) {
  return object(thing) && !!thing.constructor && /function Object\b/.test(thing.constructor.toString());
};

_$is_76.plainObject = plainObject;

var array = function array(thing) {
  return object(thing) && typeof thing.length !== 'undefined' && func(thing.splice);
};

_$is_76.array = array;

var _$drag_1 = {};
"use strict";

function ___typeof_1(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_1 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_1 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_1(obj); }

Object.defineProperty(_$drag_1, "__esModule", {
  value: true
});
_$drag_1["default"] = void 0;

var is = _interopRequireWildcard(_$is_76);

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_1(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function install(scope) {
  var actions = scope.actions,
      Interactable = scope.Interactable,
      defaults = scope.defaults;
  Interactable.prototype.draggable = drag.draggable;
  actions.map.drag = drag;
  actions.methodDict.drag = 'draggable';
  defaults.actions.drag = drag.defaults;
}

function beforeMove(_ref) {
  var interaction = _ref.interaction;

  if (interaction.prepared.name !== 'drag') {
    return;
  }

  var axis = interaction.prepared.axis;

  if (axis === 'x') {
    interaction.coords.cur.page.y = interaction.coords.start.page.y;
    interaction.coords.cur.client.y = interaction.coords.start.client.y;
    interaction.coords.velocity.client.y = 0;
    interaction.coords.velocity.page.y = 0;
  } else if (axis === 'y') {
    interaction.coords.cur.page.x = interaction.coords.start.page.x;
    interaction.coords.cur.client.x = interaction.coords.start.client.x;
    interaction.coords.velocity.client.x = 0;
    interaction.coords.velocity.page.x = 0;
  }
}

function move(_ref2) {
  var iEvent = _ref2.iEvent,
      interaction = _ref2.interaction;

  if (interaction.prepared.name !== 'drag') {
    return;
  }

  var axis = interaction.prepared.axis;

  if (axis === 'x' || axis === 'y') {
    var opposite = axis === 'x' ? 'y' : 'x';
    iEvent.page[opposite] = interaction.coords.start.page[opposite];
    iEvent.client[opposite] = interaction.coords.start.client[opposite];
    iEvent.delta[opposite] = 0;
  }
}
/**
 * ```js
 * interact(element).draggable({
 *     onstart: function (event) {},
 *     onmove : function (event) {},
 *     onend  : function (event) {},
 *
 *     // the axis in which the first movement must be
 *     // for the drag sequence to start
 *     // 'xy' by default - any direction
 *     startAxis: 'x' || 'y' || 'xy',
 *
 *     // 'xy' by default - don't restrict to one axis (move in any direction)
 *     // 'x' or 'y' to restrict movement to either axis
 *     // 'start' to restrict movement to the axis the drag started in
 *     lockAxis: 'x' || 'y' || 'xy' || 'start',
 *
 *     // max number of drags that can happen concurrently
 *     // with elements of this Interactable. Infinity by default
 *     max: Infinity,
 *
 *     // max number of drags that can target the same element+Interactable
 *     // 1 by default
 *     maxPerElement: 2
 * })
 *
 * var isDraggable = interact('element').draggable(); // true
 * ```
 *
 * Get or set whether drag actions can be performed on the target
 *
 * @alias Interactable.prototype.draggable
 *
 * @param {boolean | object} [options] true/false or An object with event
 * listeners to be fired on drag events (object makes the Interactable
 * draggable)
 * @return {boolean | Interactable} boolean indicating if this can be the
 * target of drag events, or this Interctable
 */


var draggable = function draggable(options) {
  if (is.object(options)) {
    this.options.drag.enabled = options.enabled !== false;
    this.setPerAction('drag', options);
    this.setOnEvents('drag', options);

    if (/^(xy|x|y|start)$/.test(options.lockAxis)) {
      this.options.drag.lockAxis = options.lockAxis;
    }

    if (/^(xy|x|y)$/.test(options.startAxis)) {
      this.options.drag.startAxis = options.startAxis;
    }

    return this;
  }

  if (is.bool(options)) {
    this.options.drag.enabled = options;
    return this;
  }

  return this.options.drag;
};

var drag = {
  id: 'actions/drag',
  install: install,
  listeners: {
    'interactions:before-action-move': beforeMove,
    'interactions:action-resume': beforeMove,
    // dragmove
    'interactions:action-move': move,
    'auto-start:check': function autoStartCheck(arg) {
      var interaction = arg.interaction,
          interactable = arg.interactable,
          buttons = arg.buttons;
      var dragOptions = interactable.options.drag;

      if (!(dragOptions && dragOptions.enabled) || // check mouseButton setting if the pointer is down
      interaction.pointerIsDown && /mouse|pointer/.test(interaction.pointerType) && (buttons & interactable.options.drag.mouseButtons) === 0) {
        return undefined;
      }

      arg.action = {
        name: 'drag',
        axis: dragOptions.lockAxis === 'start' ? dragOptions.startAxis : dragOptions.lockAxis
      };
      return false;
    }
  },
  draggable: draggable,
  beforeMove: beforeMove,
  move: move,
  defaults: {
    startAxis: 'xy',
    lockAxis: 'xy'
  },
  getCursor: function getCursor() {
    return 'move';
  }
};
var ___default_1 = drag;
_$drag_1["default"] = ___default_1;

var _$arr_64 = {};
"use strict";

Object.defineProperty(_$arr_64, "__esModule", {
  value: true
});
_$arr_64.find = _$arr_64.findIndex = _$arr_64.from = _$arr_64.merge = _$arr_64.remove = _$arr_64.contains = void 0;

var contains = function contains(array, target) {
  return array.indexOf(target) !== -1;
};

_$arr_64.contains = contains;

var remove = function remove(array, target) {
  return array.splice(array.indexOf(target), 1);
};

_$arr_64.remove = remove;

var merge = function merge(target, source) {
  for (var _i = 0; _i < source.length; _i++) {
    var _ref;

    _ref = source[_i];
    var item = _ref;
    target.push(item);
  }

  return target;
};

_$arr_64.merge = merge;

var from = function from(source) {
  return merge([], source);
};

_$arr_64.from = from;

var findIndex = function findIndex(array, func) {
  for (var i = 0; i < array.length; i++) {
    if (func(array[i], i, array)) {
      return i;
    }
  }

  return -1;
};

_$arr_64.findIndex = findIndex;

var find = function find(array, func) {
  return array[findIndex(array, func)];
};

_$arr_64.find = find;

var _$domObjects_68 = {};
"use strict";

Object.defineProperty(_$domObjects_68, "__esModule", {
  value: true
});
_$domObjects_68["default"] = void 0;
var domObjects = {
  init: __init_68,
  document: null,
  DocumentFragment: null,
  SVGElement: null,
  SVGSVGElement: null,
  SVGElementInstance: null,
  Element: null,
  HTMLElement: null,
  Event: null,
  Touch: null,
  PointerEvent: null
};

function blank() {}

var ___default_68 = domObjects;
_$domObjects_68["default"] = ___default_68;

function __init_68(window) {
  var win = window;
  domObjects.document = win.document;
  domObjects.DocumentFragment = win.DocumentFragment || blank;
  domObjects.SVGElement = win.SVGElement || blank;
  domObjects.SVGSVGElement = win.SVGSVGElement || blank;
  domObjects.SVGElementInstance = win.SVGElementInstance || blank;
  domObjects.Element = win.Element || blank;
  domObjects.HTMLElement = win.HTMLElement || domObjects.Element;
  domObjects.Event = win.Event;
  domObjects.Touch = win.Touch || blank;
  domObjects.PointerEvent = win.PointerEvent || win.MSPointerEvent;
}

var _$browser_65 = {};
"use strict";

function ___typeof_65(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_65 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_65 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_65(obj); }

Object.defineProperty(_$browser_65, "__esModule", {
  value: true
});
_$browser_65["default"] = void 0;

var _domObjects = ___interopRequireDefault_65(_$domObjects_68);

var __is_65 = ___interopRequireWildcard_65(_$is_76);

var _window = ___interopRequireDefault_65(_$window_83);

function ___getRequireWildcardCache_65() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_65 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_65(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_65(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_65(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___interopRequireDefault_65(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var browser = {
  init: __init_65,
  supportsTouch: null,
  supportsPointerEvent: null,
  isIOS7: null,
  isIOS: null,
  isIe9: null,
  isOperaMobile: null,
  prefixedMatchesSelector: null,
  pEventTypes: null,
  wheelEvent: null
};

function __init_65(window) {
  var Element = _domObjects["default"].Element;
  var navigator = _window["default"].window.navigator; // Does the browser support touch input?

  browser.supportsTouch = 'ontouchstart' in window || __is_65.func(window.DocumentTouch) && _domObjects["default"].document instanceof window.DocumentTouch; // Does the browser support PointerEvents

  browser.supportsPointerEvent = navigator.pointerEnabled !== false && !!_domObjects["default"].PointerEvent;
  browser.isIOS = /iP(hone|od|ad)/.test(navigator.platform); // scrolling doesn't change the result of getClientRects on iOS 7

  browser.isIOS7 = /iP(hone|od|ad)/.test(navigator.platform) && /OS 7[^\d]/.test(navigator.appVersion);
  browser.isIe9 = /MSIE 9/.test(navigator.userAgent); // Opera Mobile must be handled differently

  browser.isOperaMobile = navigator.appName === 'Opera' && browser.supportsTouch && /Presto/.test(navigator.userAgent); // prefix matchesSelector

  browser.prefixedMatchesSelector = 'matches' in Element.prototype ? 'matches' : 'webkitMatchesSelector' in Element.prototype ? 'webkitMatchesSelector' : 'mozMatchesSelector' in Element.prototype ? 'mozMatchesSelector' : 'oMatchesSelector' in Element.prototype ? 'oMatchesSelector' : 'msMatchesSelector';
  browser.pEventTypes = browser.supportsPointerEvent ? _domObjects["default"].PointerEvent === window.MSPointerEvent ? {
    up: 'MSPointerUp',
    down: 'MSPointerDown',
    over: 'mouseover',
    out: 'mouseout',
    move: 'MSPointerMove',
    cancel: 'MSPointerCancel'
  } : {
    up: 'pointerup',
    down: 'pointerdown',
    over: 'pointerover',
    out: 'pointerout',
    move: 'pointermove',
    cancel: 'pointercancel'
  } : null; // because Webkit and Opera still use 'mousewheel' event type

  browser.wheelEvent = 'onmousewheel' in _domObjects["default"].document ? 'mousewheel' : 'wheel';
}

var ___default_65 = browser;
_$browser_65["default"] = ___default_65;

var _$clone_66 = {};
"use strict";

function ___typeof_66(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_66 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_66 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_66(obj); }

Object.defineProperty(_$clone_66, "__esModule", {
  value: true
});
_$clone_66["default"] = clone;

var arr = ___interopRequireWildcard_66(_$arr_64);

var __is_66 = ___interopRequireWildcard_66(_$is_76);

function ___getRequireWildcardCache_66() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_66 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_66(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_66(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_66(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// tslint:disable-next-line ban-types
function clone(source) {
  var dest = {};

  for (var prop in source) {
    var value = source[prop];

    if (__is_66.plainObject(value)) {
      dest[prop] = clone(value);
    } else if (__is_66.array(value)) {
      dest[prop] = arr.from(value);
    } else {
      dest[prop] = value;
    }
  }

  return dest;
}

var _$domUtils_69 = {};
"use strict";

function ___typeof_69(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_69 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_69 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_69(obj); }

Object.defineProperty(_$domUtils_69, "__esModule", {
  value: true
});
_$domUtils_69.nodeContains = nodeContains;
_$domUtils_69.closest = closest;
_$domUtils_69.parentNode = parentNode;
_$domUtils_69.matchesSelector = matchesSelector;
_$domUtils_69.indexOfDeepestElement = indexOfDeepestElement;
_$domUtils_69.matchesUpTo = matchesUpTo;
_$domUtils_69.getActualElement = getActualElement;
_$domUtils_69.getScrollXY = getScrollXY;
_$domUtils_69.getElementClientRect = getElementClientRect;
_$domUtils_69.getElementRect = getElementRect;
_$domUtils_69.getPath = getPath;
_$domUtils_69.trySelector = trySelector;

var _browser = ___interopRequireDefault_69(_$browser_65);

var ___domObjects_69 = ___interopRequireDefault_69(_$domObjects_68);

var __is_69 = ___interopRequireWildcard_69(_$is_76);

var ___window_69 = ___interopRequireWildcard_69(_$window_83);

function ___getRequireWildcardCache_69() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_69 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_69(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_69(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_69(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___interopRequireDefault_69(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function nodeContains(parent, child) {
  while (child) {
    if (child === parent) {
      return true;
    }

    child = child.parentNode;
  }

  return false;
}

function closest(element, selector) {
  while (__is_69.element(element)) {
    if (matchesSelector(element, selector)) {
      return element;
    }

    element = parentNode(element);
  }

  return null;
}

function parentNode(node) {
  var parent = node.parentNode;

  if (__is_69.docFrag(parent)) {
    // skip past #shado-root fragments
    // tslint:disable-next-line
    while ((parent = parent.host) && __is_69.docFrag(parent)) {
      continue;
    }

    return parent;
  }

  return parent;
}

function matchesSelector(element, selector) {
  // remove /deep/ from selectors if shadowDOM polyfill is used
  if (___window_69["default"].window !== ___window_69["default"].realWindow) {
    selector = selector.replace(/\/deep\//g, ' ');
  }

  return element[_browser["default"].prefixedMatchesSelector](selector);
}

var getParent = function getParent(el) {
  return el.parentNode ? el.parentNode : el.host;
}; // Test for the element that's "above" all other qualifiers


function indexOfDeepestElement(elements) {
  var deepestZoneParents = [];
  var deepestZone = elements[0];
  var index = deepestZone ? 0 : -1;
  var i;
  var n;

  for (i = 1; i < elements.length; i++) {
    var dropzone = elements[i]; // an element might belong to multiple selector dropzones

    if (!dropzone || dropzone === deepestZone) {
      continue;
    }

    if (!deepestZone) {
      deepestZone = dropzone;
      index = i;
      continue;
    } // check if the deepest or current are document.documentElement or document.rootElement
    // - if the current dropzone is, do nothing and continue


    if (dropzone.parentNode === dropzone.ownerDocument) {
      continue;
    } // - if deepest is, update with the current dropzone and continue to next
    else if (deepestZone.parentNode === dropzone.ownerDocument) {
        deepestZone = dropzone;
        index = i;
        continue;
      } // compare zIndex of siblings


    if (dropzone.parentNode === deepestZone.parentNode) {
      var deepestZIndex = parseInt((0, ___window_69.getWindow)(deepestZone).getComputedStyle(deepestZone).zIndex, 10) || 0;
      var dropzoneZIndex = parseInt((0, ___window_69.getWindow)(dropzone).getComputedStyle(dropzone).zIndex, 10) || 0;

      if (dropzoneZIndex >= deepestZIndex) {
        deepestZone = dropzone;
        index = i;
      }

      continue;
    } // populate the ancestry array for the latest deepest dropzone


    if (!deepestZoneParents.length) {
      var _parent = deepestZone;
      var parentParent = void 0;

      while ((parentParent = getParent(_parent)) && parentParent !== _parent.ownerDocument) {
        deepestZoneParents.unshift(_parent);
        _parent = parentParent;
      }
    }

    var parent = void 0; // if this element is an svg element and the current deepest is an
    // HTMLElement

    if (deepestZone instanceof ___domObjects_69["default"].HTMLElement && dropzone instanceof ___domObjects_69["default"].SVGElement && !(dropzone instanceof ___domObjects_69["default"].SVGSVGElement)) {
      if (dropzone === deepestZone.parentNode) {
        continue;
      }

      parent = dropzone.ownerSVGElement;
    } else {
      parent = dropzone;
    }

    var dropzoneParents = [];

    while (parent.parentNode !== parent.ownerDocument) {
      dropzoneParents.unshift(parent);
      parent = getParent(parent);
    }

    n = 0; // get (position of last common ancestor) + 1

    while (dropzoneParents[n] && dropzoneParents[n] === deepestZoneParents[n]) {
      n++;
    }

    var parents = [dropzoneParents[n - 1], dropzoneParents[n], deepestZoneParents[n]];
    var child = parents[0].lastChild;

    while (child) {
      if (child === parents[1]) {
        deepestZone = dropzone;
        index = i;
        deepestZoneParents = dropzoneParents;
        break;
      } else if (child === parents[2]) {
        break;
      }

      child = child.previousSibling;
    }
  }

  return index;
}

function matchesUpTo(element, selector, limit) {
  while (__is_69.element(element)) {
    if (matchesSelector(element, selector)) {
      return true;
    }

    element = parentNode(element);

    if (element === limit) {
      return matchesSelector(element, selector);
    }
  }

  return false;
}

function getActualElement(element) {
  return element instanceof ___domObjects_69["default"].SVGElementInstance ? element.correspondingUseElement : element;
}

function getScrollXY(relevantWindow) {
  relevantWindow = relevantWindow || ___window_69["default"].window;
  return {
    x: relevantWindow.scrollX || relevantWindow.document.documentElement.scrollLeft,
    y: relevantWindow.scrollY || relevantWindow.document.documentElement.scrollTop
  };
}

function getElementClientRect(element) {
  var clientRect = element instanceof ___domObjects_69["default"].SVGElement ? element.getBoundingClientRect() : element.getClientRects()[0];
  return clientRect && {
    left: clientRect.left,
    right: clientRect.right,
    top: clientRect.top,
    bottom: clientRect.bottom,
    width: clientRect.width || clientRect.right - clientRect.left,
    height: clientRect.height || clientRect.bottom - clientRect.top
  };
}

function getElementRect(element) {
  var clientRect = getElementClientRect(element);

  if (!_browser["default"].isIOS7 && clientRect) {
    var scroll = getScrollXY(___window_69["default"].getWindow(element));
    clientRect.left += scroll.x;
    clientRect.right += scroll.x;
    clientRect.top += scroll.y;
    clientRect.bottom += scroll.y;
  }

  return clientRect;
}

function getPath(node) {
  var path = [];

  while (node) {
    path.push(node);
    node = parentNode(node);
  }

  return path;
}

function trySelector(value) {
  if (!__is_69.string(value)) {
    return false;
  } // an exception will be raised if it is invalid


  ___domObjects_69["default"].document.querySelector(value);

  return true;
}

var _$pointerExtend_79 = {};
"use strict";

Object.defineProperty(_$pointerExtend_79, "__esModule", {
  value: true
});
_$pointerExtend_79["default"] = void 0;

function pointerExtend(dest, source) {
  for (var prop in source) {
    var prefixedPropREs = pointerExtend.prefixedPropREs;
    var deprecated = false; // skip deprecated prefixed properties

    for (var vendor in prefixedPropREs) {
      if (prop.indexOf(vendor) === 0 && prefixedPropREs[vendor].test(prop)) {
        deprecated = true;
        break;
      }
    }

    if (!deprecated && typeof source[prop] !== 'function') {
      dest[prop] = source[prop];
    }
  }

  return dest;
}

pointerExtend.prefixedPropREs = {
  webkit: /(Movement[XY]|Radius[XY]|RotationAngle|Force)$/,
  moz: /(Pressure)$/
};
var ___default_79 = pointerExtend;
_$pointerExtend_79["default"] = ___default_79;

var _$hypot_74 = {};
"use strict";

Object.defineProperty(_$hypot_74, "__esModule", {
  value: true
});
_$hypot_74["default"] = void 0;

var ___default_74 = function _default(x, y) {
  return Math.sqrt(x * x + y * y);
};

_$hypot_74["default"] = ___default_74;

var _$pointerUtils_80 = {};
"use strict";

function ___typeof_80(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_80 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_80 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_80(obj); }

Object.defineProperty(_$pointerUtils_80, "__esModule", {
  value: true
});
_$pointerUtils_80.copyCoords = copyCoords;
_$pointerUtils_80.setCoordDeltas = setCoordDeltas;
_$pointerUtils_80.setCoordVelocity = setCoordVelocity;
_$pointerUtils_80.setZeroCoords = setZeroCoords;
_$pointerUtils_80.isNativePointer = isNativePointer;
_$pointerUtils_80.getXY = getXY;
_$pointerUtils_80.getPageXY = getPageXY;
_$pointerUtils_80.getClientXY = getClientXY;
_$pointerUtils_80.getPointerId = getPointerId;
_$pointerUtils_80.setCoords = setCoords;
_$pointerUtils_80.getTouchPair = getTouchPair;
_$pointerUtils_80.pointerAverage = pointerAverage;
_$pointerUtils_80.touchBBox = touchBBox;
_$pointerUtils_80.touchDistance = touchDistance;
_$pointerUtils_80.touchAngle = touchAngle;
_$pointerUtils_80.getPointerType = getPointerType;
_$pointerUtils_80.getEventTargets = getEventTargets;
_$pointerUtils_80.newCoords = newCoords;
_$pointerUtils_80.coordsToEvent = coordsToEvent;
Object.defineProperty(_$pointerUtils_80, "pointerExtend", {
  enumerable: true,
  get: function get() {
    return _pointerExtend["default"];
  }
});

var ___browser_80 = ___interopRequireDefault_80(_$browser_65);

var ___domObjects_80 = ___interopRequireDefault_80(_$domObjects_68);

var domUtils = ___interopRequireWildcard_80(_$domUtils_69);

var _hypot = ___interopRequireDefault_80(_$hypot_74);

var __is_80 = ___interopRequireWildcard_80(_$is_76);

var _pointerExtend = ___interopRequireDefault_80(_$pointerExtend_79);

function ___getRequireWildcardCache_80() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_80 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_80(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_80(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_80(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___interopRequireDefault_80(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function copyCoords(dest, src) {
  dest.page = dest.page || {};
  dest.page.x = src.page.x;
  dest.page.y = src.page.y;
  dest.client = dest.client || {};
  dest.client.x = src.client.x;
  dest.client.y = src.client.y;
  dest.timeStamp = src.timeStamp;
}

function setCoordDeltas(targetObj, prev, cur) {
  targetObj.page.x = cur.page.x - prev.page.x;
  targetObj.page.y = cur.page.y - prev.page.y;
  targetObj.client.x = cur.client.x - prev.client.x;
  targetObj.client.y = cur.client.y - prev.client.y;
  targetObj.timeStamp = cur.timeStamp - prev.timeStamp;
}

function setCoordVelocity(targetObj, delta) {
  var dt = Math.max(delta.timeStamp / 1000, 0.001);
  targetObj.page.x = delta.page.x / dt;
  targetObj.page.y = delta.page.y / dt;
  targetObj.client.x = delta.client.x / dt;
  targetObj.client.y = delta.client.y / dt;
  targetObj.timeStamp = dt;
}

function setZeroCoords(targetObj) {
  targetObj.page.x = 0;
  targetObj.page.y = 0;
  targetObj.client.x = 0;
  targetObj.client.y = 0;
}

function isNativePointer(pointer) {
  return pointer instanceof ___domObjects_80["default"].Event || pointer instanceof ___domObjects_80["default"].Touch;
} // Get specified X/Y coords for mouse or event.touches[0]


function getXY(type, pointer, xy) {
  xy = xy || {};
  type = type || 'page';
  xy.x = pointer[type + 'X'];
  xy.y = pointer[type + 'Y'];
  return xy;
}

function getPageXY(pointer, page) {
  page = page || {
    x: 0,
    y: 0
  }; // Opera Mobile handles the viewport and scrolling oddly

  if (___browser_80["default"].isOperaMobile && isNativePointer(pointer)) {
    getXY('screen', pointer, page);
    page.x += window.scrollX;
    page.y += window.scrollY;
  } else {
    getXY('page', pointer, page);
  }

  return page;
}

function getClientXY(pointer, client) {
  client = client || {};

  if (___browser_80["default"].isOperaMobile && isNativePointer(pointer)) {
    // Opera Mobile handles the viewport and scrolling oddly
    getXY('screen', pointer, client);
  } else {
    getXY('client', pointer, client);
  }

  return client;
}

function getPointerId(pointer) {
  return __is_80.number(pointer.pointerId) ? pointer.pointerId : pointer.identifier;
}

function setCoords(targetObj, pointers, timeStamp) {
  var pointer = pointers.length > 1 ? pointerAverage(pointers) : pointers[0];
  var tmpXY = {};
  getPageXY(pointer, tmpXY);
  targetObj.page.x = tmpXY.x;
  targetObj.page.y = tmpXY.y;
  getClientXY(pointer, tmpXY);
  targetObj.client.x = tmpXY.x;
  targetObj.client.y = tmpXY.y;
  targetObj.timeStamp = timeStamp;
}

function getTouchPair(event) {
  var touches = []; // array of touches is supplied

  if (__is_80.array(event)) {
    touches[0] = event[0];
    touches[1] = event[1];
  } // an event
  else {
      if (event.type === 'touchend') {
        if (event.touches.length === 1) {
          touches[0] = event.touches[0];
          touches[1] = event.changedTouches[0];
        } else if (event.touches.length === 0) {
          touches[0] = event.changedTouches[0];
          touches[1] = event.changedTouches[1];
        }
      } else {
        touches[0] = event.touches[0];
        touches[1] = event.touches[1];
      }
    }

  return touches;
}

function pointerAverage(pointers) {
  var average = {
    pageX: 0,
    pageY: 0,
    clientX: 0,
    clientY: 0,
    screenX: 0,
    screenY: 0
  };

  for (var _i = 0; _i < pointers.length; _i++) {
    var _ref;

    _ref = pointers[_i];
    var pointer = _ref;

    for (var _prop in average) {
      average[_prop] += pointer[_prop];
    }
  }

  for (var prop in average) {
    average[prop] /= pointers.length;
  }

  return average;
}

function touchBBox(event) {
  if (!event.length && !(event.touches && event.touches.length > 1)) {
    return null;
  }

  var touches = getTouchPair(event);
  var minX = Math.min(touches[0].pageX, touches[1].pageX);
  var minY = Math.min(touches[0].pageY, touches[1].pageY);
  var maxX = Math.max(touches[0].pageX, touches[1].pageX);
  var maxY = Math.max(touches[0].pageY, touches[1].pageY);
  return {
    x: minX,
    y: minY,
    left: minX,
    top: minY,
    right: maxX,
    bottom: maxY,
    width: maxX - minX,
    height: maxY - minY
  };
}

function touchDistance(event, deltaSource) {
  var sourceX = deltaSource + 'X';
  var sourceY = deltaSource + 'Y';
  var touches = getTouchPair(event);
  var dx = touches[0][sourceX] - touches[1][sourceX];
  var dy = touches[0][sourceY] - touches[1][sourceY];
  return (0, _hypot["default"])(dx, dy);
}

function touchAngle(event, deltaSource) {
  var sourceX = deltaSource + 'X';
  var sourceY = deltaSource + 'Y';
  var touches = getTouchPair(event);
  var dx = touches[1][sourceX] - touches[0][sourceX];
  var dy = touches[1][sourceY] - touches[0][sourceY];
  var angle = 180 * Math.atan2(dy, dx) / Math.PI;
  return angle;
}

function getPointerType(pointer) {
  return __is_80.string(pointer.pointerType) ? pointer.pointerType : __is_80.number(pointer.pointerType) ? [undefined, undefined, 'touch', 'pen', 'mouse'][pointer.pointerType] // if the PointerEvent API isn't available, then the "pointer" must
  // be either a MouseEvent, TouchEvent, or Touch object
  : /touch/.test(pointer.type) || pointer instanceof ___domObjects_80["default"].Touch ? 'touch' : 'mouse';
} // [ event.target, event.currentTarget ]


function getEventTargets(event) {
  var path = __is_80.func(event.composedPath) ? event.composedPath() : event.path;
  return [domUtils.getActualElement(path ? path[0] : event.target), domUtils.getActualElement(event.currentTarget)];
}

function newCoords() {
  return {
    page: {
      x: 0,
      y: 0
    },
    client: {
      x: 0,
      y: 0
    },
    timeStamp: 0
  };
}

function coordsToEvent(coords) {
  var event = {
    coords: coords,

    get page() {
      return this.coords.page;
    },

    get client() {
      return this.coords.client;
    },

    get timeStamp() {
      return this.coords.timeStamp;
    },

    get pageX() {
      return this.coords.page.x;
    },

    get pageY() {
      return this.coords.page.y;
    },

    get clientX() {
      return this.coords.client.x;
    },

    get clientY() {
      return this.coords.client.y;
    },

    get pointerId() {
      return this.coords.pointerId;
    },

    get target() {
      return this.coords.target;
    },

    get type() {
      return this.coords.type;
    },

    get pointerType() {
      return this.coords.pointerType;
    },

    get buttons() {
      return this.coords.buttons;
    },

    preventDefault: function preventDefault() {}
  };
  return event;
}

var _$events_70 = {};
"use strict";

function ___typeof_70(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_70 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_70 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_70(obj); }

Object.defineProperty(_$events_70, "__esModule", {
  value: true
});
_$events_70["default"] = _$events_70.FakeEvent = void 0;

/* removed: var _$arr_64 = require("./arr"); */;

var __domUtils_70 = ___interopRequireWildcard_70(_$domUtils_69);

var __is_70 = ___interopRequireWildcard_70(_$is_76);

var ___pointerExtend_70 = ___interopRequireDefault_70(_$pointerExtend_79);

var pointerUtils = ___interopRequireWildcard_70(_$pointerUtils_80);

function ___interopRequireDefault_70(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ___getRequireWildcardCache_70() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_70 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_70(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_70(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_70(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var elements = [];
var targets = [];
var delegatedEvents = {};
var documents = [];

function add(element, type, listener, optionalArg) {
  var options = getOptions(optionalArg);
  var elementIndex = elements.indexOf(element);
  var target = targets[elementIndex];

  if (!target) {
    target = {
      events: {},
      typeCount: 0
    };
    elementIndex = elements.push(element) - 1;
    targets.push(target);
  }

  if (!target.events[type]) {
    target.events[type] = [];
    target.typeCount++;
  }

  if (element.removeEventListener && !(0, _$arr_64.contains)(target.events[type], listener)) {
    element.addEventListener(type, listener, events.supportsOptions ? options : !!options.capture);
    target.events[type].push(listener);
  }
}

function __remove_70(element, type, listener, optionalArg) {
  var options = getOptions(optionalArg);
  var elementIndex = elements.indexOf(element);
  var target = targets[elementIndex];

  if (!target || !target.events) {
    return;
  }

  if (type === 'all') {
    for (type in target.events) {
      if (target.events.hasOwnProperty(type)) {
        __remove_70(element, type, 'all');
      }
    }

    return;
  }

  if (target.events[type]) {
    var len = target.events[type].length;

    if (listener === 'all') {
      for (var i = 0; i < len; i++) {
        __remove_70(element, type, target.events[type][i], options);
      }

      return;
    } else {
      for (var _i = 0; _i < len; _i++) {
        if (element.removeEventListener && target.events[type][_i] === listener) {
          element.removeEventListener(type, listener, events.supportsOptions ? options : !!options.capture);
          target.events[type].splice(_i, 1);
          break;
        }
      }
    }

    if (target.events[type] && target.events[type].length === 0) {
      target.events[type] = null;
      target.typeCount--;
    }
  }

  if (!target.typeCount) {
    targets.splice(elementIndex, 1);
    elements.splice(elementIndex, 1);
  }
}

function addDelegate(selector, context, type, listener, optionalArg) {
  var options = getOptions(optionalArg);

  if (!delegatedEvents[type]) {
    delegatedEvents[type] = {
      contexts: [],
      listeners: [],
      selectors: []
    }; // add delegate listener functions

    for (var _i2 = 0; _i2 < documents.length; _i2++) {
      var _ref;

      _ref = documents[_i2];
      var doc = _ref;
      add(doc, type, delegateListener);
      add(doc, type, delegateUseCapture, true);
    }
  }

  var delegated = delegatedEvents[type];
  var index;

  for (index = delegated.selectors.length - 1; index >= 0; index--) {
    if (delegated.selectors[index] === selector && delegated.contexts[index] === context) {
      break;
    }
  }

  if (index === -1) {
    index = delegated.selectors.length;
    delegated.selectors.push(selector);
    delegated.contexts.push(context);
    delegated.listeners.push([]);
  } // keep listener and capture and passive flags


  delegated.listeners[index].push([listener, !!options.capture, options.passive]);
}

function removeDelegate(selector, context, type, listener, optionalArg) {
  var options = getOptions(optionalArg);
  var delegated = delegatedEvents[type];
  var matchFound = false;
  var index;

  if (!delegated) {
    return;
  } // count from last index of delegated to 0


  for (index = delegated.selectors.length - 1; index >= 0; index--) {
    // look for matching selector and context Node
    if (delegated.selectors[index] === selector && delegated.contexts[index] === context) {
      var listeners = delegated.listeners[index]; // each item of the listeners array is an array: [function, capture, passive]

      for (var i = listeners.length - 1; i >= 0; i--) {
        var _listeners$i = _slicedToArray(listeners[i], 3),
            fn = _listeners$i[0],
            capture = _listeners$i[1],
            passive = _listeners$i[2]; // check if the listener functions and capture and passive flags match


        if (fn === listener && capture === !!options.capture && passive === options.passive) {
          // remove the listener from the array of listeners
          listeners.splice(i, 1); // if all listeners for this interactable have been removed
          // remove the interactable from the delegated arrays

          if (!listeners.length) {
            delegated.selectors.splice(index, 1);
            delegated.contexts.splice(index, 1);
            delegated.listeners.splice(index, 1); // remove delegate function from context

            __remove_70(context, type, delegateListener);
            __remove_70(context, type, delegateUseCapture, true); // remove the arrays if they are empty

            if (!delegated.selectors.length) {
              delegatedEvents[type] = null;
            }
          } // only remove one listener


          matchFound = true;
          break;
        }
      }

      if (matchFound) {
        break;
      }
    }
  }
} // bound to the interactable context when a DOM event
// listener is added to a selector interactable


function delegateListener(event, optionalArg) {
  var options = getOptions(optionalArg);
  var fakeEvent = new FakeEvent(event);
  var delegated = delegatedEvents[event.type];

  var _pointerUtils$getEven = pointerUtils.getEventTargets(event),
      _pointerUtils$getEven2 = _slicedToArray(_pointerUtils$getEven, 1),
      eventTarget = _pointerUtils$getEven2[0];

  var element = eventTarget; // climb up document tree looking for selector matches

  while (__is_70.element(element)) {
    for (var i = 0; i < delegated.selectors.length; i++) {
      var selector = delegated.selectors[i];
      var context = delegated.contexts[i];

      if (__domUtils_70.matchesSelector(element, selector) && __domUtils_70.nodeContains(context, eventTarget) && __domUtils_70.nodeContains(context, element)) {
        var listeners = delegated.listeners[i];
        fakeEvent.currentTarget = element;

        for (var _i3 = 0; _i3 < listeners.length; _i3++) {
          var _ref2;

          _ref2 = listeners[_i3];

          var _ref3 = _ref2,
              _ref4 = _slicedToArray(_ref3, 3),
              fn = _ref4[0],
              capture = _ref4[1],
              passive = _ref4[2];

          if (capture === !!options.capture && passive === options.passive) {
            fn(fakeEvent);
          }
        }
      }
    }

    element = __domUtils_70.parentNode(element);
  }
}

function delegateUseCapture(event) {
  return delegateListener.call(this, event, true);
}

function getOptions(param) {
  return __is_70.object(param) ? param : {
    capture: param
  };
}

var FakeEvent = /*#__PURE__*/function () {
  function FakeEvent(originalEvent) {
    _classCallCheck(this, FakeEvent);

    this.originalEvent = originalEvent;

    _defineProperty(this, "currentTarget", void 0);

    // duplicate the event so that currentTarget can be changed
    (0, ___pointerExtend_70["default"])(this, originalEvent);
  }

  _createClass(FakeEvent, [{
    key: "preventOriginalDefault",
    value: function preventOriginalDefault() {
      this.originalEvent.preventDefault();
    }
  }, {
    key: "stopPropagation",
    value: function stopPropagation() {
      this.originalEvent.stopPropagation();
    }
  }, {
    key: "stopImmediatePropagation",
    value: function stopImmediatePropagation() {
      this.originalEvent.stopImmediatePropagation();
    }
  }]);

  return FakeEvent;
}();

_$events_70.FakeEvent = FakeEvent;
var events = {
  add: add,
  remove: __remove_70,
  addDelegate: addDelegate,
  removeDelegate: removeDelegate,
  delegateListener: delegateListener,
  delegateUseCapture: delegateUseCapture,
  delegatedEvents: delegatedEvents,
  documents: documents,
  supportsOptions: false,
  supportsPassive: false,
  _elements: elements,
  _targets: targets,
  init: function init(window) {
    window.document.createElement('div').addEventListener('test', null, {
      get capture() {
        return events.supportsOptions = true;
      },

      get passive() {
        return events.supportsPassive = true;
      }

    });
  }
};
var ___default_70 = events;
_$events_70["default"] = ___default_70;

var _$extend_72 = {};
"use strict";

Object.defineProperty(_$extend_72, "__esModule", {
  value: true
});
_$extend_72["default"] = extend;

function extend(dest, source) {
  for (var prop in source) {
    dest[prop] = source[prop];
  }

  var ret = dest;
  return ret;
}

var _$normalizeListeners_78 = {};
"use strict";

function ___typeof_78(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_78 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_78 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_78(obj); }

Object.defineProperty(_$normalizeListeners_78, "__esModule", {
  value: true
});
_$normalizeListeners_78["default"] = normalize;

var _extend = ___interopRequireDefault_78(_$extend_72);

var __is_78 = ___interopRequireWildcard_78(_$is_76);

function ___getRequireWildcardCache_78() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_78 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_78(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_78(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_78(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___interopRequireDefault_78(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function normalize(type, listeners, result) {
  result = result || {};

  if (__is_78.string(type) && type.search(' ') !== -1) {
    type = split(type);
  }

  if (__is_78.array(type)) {
    return type.reduce(function (acc, t) {
      return (0, _extend["default"])(acc, normalize(t, listeners, result));
    }, result);
  } // ({ type: fn }) -> ('', { type: fn })


  if (__is_78.object(type)) {
    listeners = type;
    type = '';
  }

  if (__is_78.func(listeners)) {
    result[type] = result[type] || [];
    result[type].push(listeners);
  } else if (__is_78.array(listeners)) {
    for (var _i = 0; _i < listeners.length; _i++) {
      var _ref;

      _ref = listeners[_i];
      var l = _ref;
      normalize(type, l, result);
    }
  } else if (__is_78.object(listeners)) {
    for (var prefix in listeners) {
      var combinedTypes = split(prefix).map(function (p) {
        return "".concat(type).concat(p);
      });
      normalize(combinedTypes, listeners[prefix], result);
    }
  }

  return result;
}

function split(type) {
  return type.trim().split(/ +/);
}

var _$Eventable_17 = {};
"use strict";

function ___typeof_17(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_17 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_17 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_17(obj); }

Object.defineProperty(_$Eventable_17, "__esModule", {
  value: true
});
_$Eventable_17["default"] = void 0;

var __arr_17 = ___interopRequireWildcard_17(_$arr_64);

var ___extend_17 = ___interopRequireDefault_17(_$extend_72);

var _normalizeListeners = ___interopRequireDefault_17(_$normalizeListeners_78);

function ___interopRequireDefault_17(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ___getRequireWildcardCache_17() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_17 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_17(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_17(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_17(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___classCallCheck_17(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ___defineProperties_17(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ___createClass_17(Constructor, protoProps, staticProps) { if (protoProps) ___defineProperties_17(Constructor.prototype, protoProps); if (staticProps) ___defineProperties_17(Constructor, staticProps); return Constructor; }

function ___defineProperty_17(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function fireUntilImmediateStopped(event, listeners) {
  for (var _i = 0; _i < listeners.length; _i++) {
    var _ref;

    _ref = listeners[_i];
    var listener = _ref;

    if (event.immediatePropagationStopped) {
      break;
    }

    listener(event);
  }
}

var Eventable = /*#__PURE__*/function () {
  function Eventable(options) {
    ___classCallCheck_17(this, Eventable);

    ___defineProperty_17(this, "options", void 0);

    ___defineProperty_17(this, "types", {});

    ___defineProperty_17(this, "propagationStopped", false);

    ___defineProperty_17(this, "immediatePropagationStopped", false);

    ___defineProperty_17(this, "global", void 0);

    this.options = (0, ___extend_17["default"])({}, options || {});
  }

  ___createClass_17(Eventable, [{
    key: "fire",
    value: function fire(event) {
      var listeners;
      var global = this.global; // Interactable#on() listeners
      // tslint:disable no-conditional-assignment

      if (listeners = this.types[event.type]) {
        fireUntilImmediateStopped(event, listeners);
      } // interact.on() listeners


      if (!event.propagationStopped && global && (listeners = global[event.type])) {
        fireUntilImmediateStopped(event, listeners);
      }
    }
  }, {
    key: "on",
    value: function on(type, listener) {
      var listeners = (0, _normalizeListeners["default"])(type, listener);

      for (type in listeners) {
        this.types[type] = __arr_17.merge(this.types[type] || [], listeners[type]);
      }
    }
  }, {
    key: "off",
    value: function off(type, listener) {
      var listeners = (0, _normalizeListeners["default"])(type, listener);

      for (type in listeners) {
        var eventList = this.types[type];

        if (!eventList || !eventList.length) {
          continue;
        }

        for (var _i2 = 0; _i2 < listeners[type].length; _i2++) {
          var _ref2;

          _ref2 = listeners[type][_i2];
          var subListener = _ref2;

          var _index = eventList.indexOf(subListener);

          if (_index !== -1) {
            eventList.splice(_index, 1);
          }
        }
      }
    }
  }, {
    key: "getRect",
    value: function getRect(_element) {
      return null;
    }
  }]);

  return Eventable;
}();

var ___default_17 = Eventable;
_$Eventable_17["default"] = ___default_17;

var _$rect_82 = {};
"use strict";

function ___typeof_82(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_82 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_82 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_82(obj); }

Object.defineProperty(_$rect_82, "__esModule", {
  value: true
});
_$rect_82.getStringOptionResult = getStringOptionResult;
_$rect_82.resolveRectLike = resolveRectLike;
_$rect_82.rectToXY = rectToXY;
_$rect_82.xywhToTlbr = xywhToTlbr;
_$rect_82.tlbrToXywh = tlbrToXywh;
_$rect_82.addEdges = addEdges;

/* removed: var _$domUtils_69 = require("./domUtils"); */;

var ___extend_82 = ___interopRequireDefault_82(_$extend_72);

var __is_82 = ___interopRequireWildcard_82(_$is_76);

function ___getRequireWildcardCache_82() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_82 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_82(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_82(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_82(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___interopRequireDefault_82(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function getStringOptionResult(value, target, element) {
  if (value === 'parent') {
    return (0, _$domUtils_69.parentNode)(element);
  }

  if (value === 'self') {
    return target.getRect(element);
  }

  return (0, _$domUtils_69.closest)(element, value);
}

function resolveRectLike(value, target, element, functionArgs) {
  var returnValue = value;

  if (__is_82.string(returnValue)) {
    returnValue = getStringOptionResult(returnValue, target, element);
  } else if (__is_82.func(returnValue)) {
    returnValue = returnValue.apply(void 0, _toConsumableArray(functionArgs));
  }

  if (__is_82.element(returnValue)) {
    returnValue = (0, _$domUtils_69.getElementRect)(returnValue);
  }

  return returnValue;
}

function rectToXY(rect) {
  return rect && {
    x: 'x' in rect ? rect.x : rect.left,
    y: 'y' in rect ? rect.y : rect.top
  };
}

function xywhToTlbr(rect) {
  if (rect && !('left' in rect && 'top' in rect)) {
    rect = (0, ___extend_82["default"])({}, rect);
    rect.left = rect.x || 0;
    rect.top = rect.y || 0;
    rect.right = rect.right || rect.left + rect.width;
    rect.bottom = rect.bottom || rect.top + rect.height;
  }

  return rect;
}

function tlbrToXywh(rect) {
  if (rect && !('x' in rect && 'y' in rect)) {
    rect = (0, ___extend_82["default"])({}, rect);
    rect.x = rect.left || 0;
    rect.y = rect.top || 0;
    rect.width = rect.width || rect.right || 0 - rect.x;
    rect.height = rect.height || rect.bottom || 0 - rect.y;
  }

  return rect;
}

function addEdges(edges, rect, delta) {
  if (edges.left) {
    rect.left += delta.x;
  }

  if (edges.right) {
    rect.right += delta.x;
  }

  if (edges.top) {
    rect.top += delta.y;
  }

  if (edges.bottom) {
    rect.bottom += delta.y;
  }

  rect.width = rect.right - rect.left;
  rect.height = rect.bottom - rect.top;
}

var _$getOriginXY_73 = {};
"use strict";

Object.defineProperty(_$getOriginXY_73, "__esModule", {
  value: true
});
_$getOriginXY_73["default"] = ___default_73;

/* removed: var _$rect_82 = require("./rect"); */;

function ___default_73(target, element, actionName) {
  var actionOptions = target.options[actionName];
  var actionOrigin = actionOptions && actionOptions.origin;
  var origin = actionOrigin || target.options.origin;
  var originRect = (0, _$rect_82.resolveRectLike)(origin, target, element, [target && element]);
  return (0, _$rect_82.rectToXY)(originRect) || {
    x: 0,
    y: 0
  };
}

var _$raf_81 = {};
"use strict";

Object.defineProperty(_$raf_81, "__esModule", {
  value: true
});
_$raf_81["default"] = void 0;
var lastTime = 0;

var _request;

var _cancel;

function __init_81(window) {
  _request = window.requestAnimationFrame;
  _cancel = window.cancelAnimationFrame;

  if (!_request) {
    var vendors = ['ms', 'moz', 'webkit', 'o'];

    for (var _i = 0; _i < vendors.length; _i++) {
      var vendor = vendors[_i];
      _request = window["".concat(vendor, "RequestAnimationFrame")];
      _cancel = window["".concat(vendor, "CancelAnimationFrame")] || window["".concat(vendor, "CancelRequestAnimationFrame")];
    }
  }

  if (!_request) {
    _request = function request(callback) {
      var currTime = Date.now();
      var timeToCall = Math.max(0, 16 - (currTime - lastTime)); // eslint-disable-next-line standard/no-callback-literal

      var token = setTimeout(function () {
        callback(currTime + timeToCall);
      }, timeToCall);
      lastTime = currTime + timeToCall;
      return token;
    };

    _cancel = function cancel(token) {
      return clearTimeout(token);
    };
  }
}

var ___default_81 = {
  request: function request(callback) {
    return _request(callback);
  },
  cancel: function cancel(token) {
    return _cancel(token);
  },
  init: __init_81
};
_$raf_81["default"] = ___default_81;

var _$index_75 = {};
"use strict";

function ___typeof_75(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_75 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_75 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_75(obj); }

Object.defineProperty(_$index_75, "__esModule", {
  value: true
});
_$index_75.warnOnce = warnOnce;
_$index_75.copyAction = copyAction;
Object.defineProperty(_$index_75, "win", {
  enumerable: true,
  get: function get() {
    return ___window_75["default"];
  }
});
Object.defineProperty(_$index_75, "browser", {
  enumerable: true,
  get: function get() {
    return ___browser_75["default"];
  }
});
Object.defineProperty(_$index_75, "clone", {
  enumerable: true,
  get: function get() {
    return _clone["default"];
  }
});
Object.defineProperty(_$index_75, "events", {
  enumerable: true,
  get: function get() {
    return _events["default"];
  }
});
Object.defineProperty(_$index_75, "extend", {
  enumerable: true,
  get: function get() {
    return ___extend_75["default"];
  }
});
Object.defineProperty(_$index_75, "getOriginXY", {
  enumerable: true,
  get: function get() {
    return _getOriginXY["default"];
  }
});
Object.defineProperty(_$index_75, "hypot", {
  enumerable: true,
  get: function get() {
    return ___hypot_75["default"];
  }
});
Object.defineProperty(_$index_75, "normalizeListeners", {
  enumerable: true,
  get: function get() {
    return ___normalizeListeners_75["default"];
  }
});
Object.defineProperty(_$index_75, "raf", {
  enumerable: true,
  get: function get() {
    return _raf["default"];
  }
});
_$index_75.rect = _$index_75.pointer = _$index_75.is = _$index_75.dom = _$index_75.arr = void 0;

var __arr_75 = ___interopRequireWildcard_75(_$arr_64);

_$index_75.arr = __arr_75;

var dom = ___interopRequireWildcard_75(_$domUtils_69);

_$index_75.dom = dom;

var __is_75 = ___interopRequireWildcard_75(_$is_76);

_$index_75.is = __is_75;

var pointer = ___interopRequireWildcard_75(_$pointerUtils_80);

_$index_75.pointer = pointer;

var rect = ___interopRequireWildcard_75(_$rect_82);

_$index_75.rect = rect;

var ___window_75 = ___interopRequireDefault_75(_$window_83);

var ___browser_75 = ___interopRequireDefault_75(_$browser_65);

var _clone = ___interopRequireDefault_75(_$clone_66);

var _events = ___interopRequireDefault_75(_$events_70);

var ___extend_75 = ___interopRequireDefault_75(_$extend_72);

var _getOriginXY = ___interopRequireDefault_75(_$getOriginXY_73);

var ___hypot_75 = ___interopRequireDefault_75(_$hypot_74);

var ___normalizeListeners_75 = ___interopRequireDefault_75(_$normalizeListeners_78);

var _raf = ___interopRequireDefault_75(_$raf_81);

function ___interopRequireDefault_75(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ___getRequireWildcardCache_75() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_75 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_75(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_75(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_75(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function warnOnce(method, message) {
  var warned = false; // eslint-disable-next-line no-shadow

  return function () {
    if (!warned) {
      ___window_75["default"].window.console.warn(message);

      warned = true;
    }

    return method.apply(this, arguments);
  };
}

function copyAction(dest, src) {
  dest.name = src.name;
  dest.axis = src.axis;
  dest.edges = src.edges;
  return dest;
}

var _$BaseEvent_16 = {};
"use strict";

Object.defineProperty(_$BaseEvent_16, "__esModule", {
  value: true
});
_$BaseEvent_16["default"] = _$BaseEvent_16.BaseEvent = void 0;

function ___classCallCheck_16(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ___defineProperties_16(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ___createClass_16(Constructor, protoProps, staticProps) { if (protoProps) ___defineProperties_16(Constructor.prototype, protoProps); if (staticProps) ___defineProperties_16(Constructor, staticProps); return Constructor; }

function ___defineProperty_16(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var BaseEvent = /*#__PURE__*/function () {
  ___createClass_16(BaseEvent, [{
    key: "interaction",
    get: function get() {
      return this._interaction._proxy;
    }
  }]);

  function BaseEvent(interaction) {
    ___classCallCheck_16(this, BaseEvent);

    ___defineProperty_16(this, "type", void 0);

    ___defineProperty_16(this, "target", void 0);

    ___defineProperty_16(this, "currentTarget", void 0);

    ___defineProperty_16(this, "interactable", void 0);

    ___defineProperty_16(this, "_interaction", void 0);

    ___defineProperty_16(this, "timeStamp", void 0);

    ___defineProperty_16(this, "immediatePropagationStopped", false);

    ___defineProperty_16(this, "propagationStopped", false);

    this._interaction = interaction;
  }

  ___createClass_16(BaseEvent, [{
    key: "preventDefault",
    value: function preventDefault() {}
    /**
     * Don't call any other listeners (even on the current target)
     */

  }, {
    key: "stopPropagation",
    value: function stopPropagation() {
      this.propagationStopped = true;
    }
    /**
     * Don't call listeners on the remaining targets
     */

  }, {
    key: "stopImmediatePropagation",
    value: function stopImmediatePropagation() {
      this.immediatePropagationStopped = this.propagationStopped = true;
    }
  }]);

  return BaseEvent;
}();

_$BaseEvent_16.BaseEvent = BaseEvent;
var ___default_16 = BaseEvent;
_$BaseEvent_16["default"] = ___default_16;

var _$defaultOptions_24 = {};
"use strict";

Object.defineProperty(_$defaultOptions_24, "__esModule", {
  value: true
});
_$defaultOptions_24["default"] = _$defaultOptions_24.defaults = void 0;
// tslint:disable no-empty-interface
// eslint-disable-next-line @typescript-eslint/no-empty-interface
// export interface Options extends BaseDefaults, PerActionDefaults {}
var defaults = {
  base: {
    preventDefault: 'auto',
    deltaSource: 'page'
  },
  perAction: {
    enabled: false,
    origin: {
      x: 0,
      y: 0
    }
  },
  actions: {}
};
_$defaultOptions_24.defaults = defaults;
var ___default_24 = defaults;
_$defaultOptions_24["default"] = ___default_24;

var _$InteractEvent_18 = {};
"use strict";

Object.defineProperty(_$InteractEvent_18, "__esModule", {
  value: true
});
_$InteractEvent_18["default"] = _$InteractEvent_18.InteractEvent = void 0;

var ___extend_18 = ___interopRequireDefault_18(_$extend_72);

var ___getOriginXY_18 = ___interopRequireDefault_18(_$getOriginXY_73);

var ___hypot_18 = ___interopRequireDefault_18(_$hypot_74);

var _BaseEvent2 = ___interopRequireDefault_18(_$BaseEvent_16);

var _defaultOptions = ___interopRequireDefault_18(_$defaultOptions_24);

function ___interopRequireDefault_18(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ___typeof_18(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_18 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_18 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_18(obj); }

function ___classCallCheck_18(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ___defineProperties_18(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ___createClass_18(Constructor, protoProps, staticProps) { if (protoProps) ___defineProperties_18(Constructor.prototype, protoProps); if (staticProps) ___defineProperties_18(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (___typeof_18(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function ___defineProperty_18(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var InteractEvent = /*#__PURE__*/function (_BaseEvent) {
  _inherits(InteractEvent, _BaseEvent);

  // drag
  // resize

  /** */
  function InteractEvent(interaction, event, actionName, phase, element, preEnd, type) {
    var _this;

    ___classCallCheck_18(this, InteractEvent);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(InteractEvent).call(this, interaction));

    ___defineProperty_18(_assertThisInitialized(_this), "target", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "currentTarget", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "relatedTarget", null);

    ___defineProperty_18(_assertThisInitialized(_this), "screenX", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "screenY", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "button", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "buttons", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "ctrlKey", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "shiftKey", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "altKey", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "metaKey", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "page", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "client", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "delta", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "rect", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "x0", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "y0", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "t0", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "dt", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "duration", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "clientX0", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "clientY0", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "velocity", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "speed", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "swipe", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "timeStamp", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "dragEnter", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "dragLeave", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "axes", void 0);

    ___defineProperty_18(_assertThisInitialized(_this), "preEnd", void 0);

    element = element || interaction.element;
    var target = interaction.interactable;
    var deltaSource = (target && target.options || _defaultOptions["default"]).deltaSource;
    var origin = (0, ___getOriginXY_18["default"])(target, element, actionName);
    var starting = phase === 'start';
    var ending = phase === 'end';
    var prevEvent = starting ? _assertThisInitialized(_this) : interaction.prevEvent;
    var coords = starting ? interaction.coords.start : ending ? {
      page: prevEvent.page,
      client: prevEvent.client,
      timeStamp: interaction.coords.cur.timeStamp
    } : interaction.coords.cur;
    _this.page = (0, ___extend_18["default"])({}, coords.page);
    _this.client = (0, ___extend_18["default"])({}, coords.client);
    _this.rect = (0, ___extend_18["default"])({}, interaction.rect);
    _this.timeStamp = coords.timeStamp;

    if (!ending) {
      _this.page.x -= origin.x;
      _this.page.y -= origin.y;
      _this.client.x -= origin.x;
      _this.client.y -= origin.y;
    }

    _this.ctrlKey = event.ctrlKey;
    _this.altKey = event.altKey;
    _this.shiftKey = event.shiftKey;
    _this.metaKey = event.metaKey;
    _this.button = event.button;
    _this.buttons = event.buttons;
    _this.target = element;
    _this.currentTarget = element;
    _this.preEnd = preEnd;
    _this.type = type || actionName + (phase || '');
    _this.interactable = target;
    _this.t0 = starting ? interaction.pointers[interaction.pointers.length - 1].downTime : prevEvent.t0;
    _this.x0 = interaction.coords.start.page.x - origin.x;
    _this.y0 = interaction.coords.start.page.y - origin.y;
    _this.clientX0 = interaction.coords.start.client.x - origin.x;
    _this.clientY0 = interaction.coords.start.client.y - origin.y;

    if (starting || ending) {
      _this.delta = {
        x: 0,
        y: 0
      };
    } else {
      _this.delta = {
        x: _this[deltaSource].x - prevEvent[deltaSource].x,
        y: _this[deltaSource].y - prevEvent[deltaSource].y
      };
    }

    _this.dt = interaction.coords.delta.timeStamp;
    _this.duration = _this.timeStamp - _this.t0; // velocity and speed in pixels per second

    _this.velocity = (0, ___extend_18["default"])({}, interaction.coords.velocity[deltaSource]);
    _this.speed = (0, ___hypot_18["default"])(_this.velocity.x, _this.velocity.y);
    _this.swipe = ending || phase === 'inertiastart' ? _this.getSwipe() : null;
    return _this;
  }

  ___createClass_18(InteractEvent, [{
    key: "getSwipe",
    value: function getSwipe() {
      var interaction = this._interaction;

      if (interaction.prevEvent.speed < 600 || this.timeStamp - interaction.prevEvent.timeStamp > 150) {
        return null;
      }

      var angle = 180 * Math.atan2(interaction.prevEvent.velocityY, interaction.prevEvent.velocityX) / Math.PI;
      var overlap = 22.5;

      if (angle < 0) {
        angle += 360;
      }

      var left = 135 - overlap <= angle && angle < 225 + overlap;
      var up = 225 - overlap <= angle && angle < 315 + overlap;
      var right = !left && (315 - overlap <= angle || angle < 45 + overlap);
      var down = !up && 45 - overlap <= angle && angle < 135 + overlap;
      return {
        up: up,
        down: down,
        left: left,
        right: right,
        angle: angle,
        speed: interaction.prevEvent.speed,
        velocity: {
          x: interaction.prevEvent.velocityX,
          y: interaction.prevEvent.velocityY
        }
      };
    }
  }, {
    key: "preventDefault",
    value: function preventDefault() {}
    /**
     * Don't call listeners on the remaining targets
     */

  }, {
    key: "stopImmediatePropagation",
    value: function stopImmediatePropagation() {
      this.immediatePropagationStopped = this.propagationStopped = true;
    }
    /**
     * Don't call any other listeners (even on the current target)
     */

  }, {
    key: "stopPropagation",
    value: function stopPropagation() {
      this.propagationStopped = true;
    }
  }, {
    key: "pageX",
    get: function get() {
      return this.page.x;
    },
    set: function set(value) {
      this.page.x = value;
    }
  }, {
    key: "pageY",
    get: function get() {
      return this.page.y;
    },
    set: function set(value) {
      this.page.y = value;
    }
  }, {
    key: "clientX",
    get: function get() {
      return this.client.x;
    },
    set: function set(value) {
      this.client.x = value;
    }
  }, {
    key: "clientY",
    get: function get() {
      return this.client.y;
    },
    set: function set(value) {
      this.client.y = value;
    }
  }, {
    key: "dx",
    get: function get() {
      return this.delta.x;
    },
    set: function set(value) {
      this.delta.x = value;
    }
  }, {
    key: "dy",
    get: function get() {
      return this.delta.y;
    },
    set: function set(value) {
      this.delta.y = value;
    }
  }, {
    key: "velocityX",
    get: function get() {
      return this.velocity.x;
    },
    set: function set(value) {
      this.velocity.x = value;
    }
  }, {
    key: "velocityY",
    get: function get() {
      return this.velocity.y;
    },
    set: function set(value) {
      this.velocity.y = value;
    }
  }]);

  return InteractEvent;
}(_BaseEvent2["default"]);

_$InteractEvent_18.InteractEvent = InteractEvent;
var ___default_18 = InteractEvent;
_$InteractEvent_18["default"] = ___default_18;

var _$InteractableSet_21 = {};
"use strict";

function ___typeof_21(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_21 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_21 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_21(obj); }

Object.defineProperty(_$InteractableSet_21, "__esModule", {
  value: true
});
_$InteractableSet_21["default"] = void 0;

var __arr_21 = ___interopRequireWildcard_21(_$arr_64);

var __domUtils_21 = ___interopRequireWildcard_21(_$domUtils_69);

var ___extend_21 = ___interopRequireDefault_21(_$extend_72);

var __is_21 = ___interopRequireWildcard_21(_$is_76);

function ___interopRequireDefault_21(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ___getRequireWildcardCache_21() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_21 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_21(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_21(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_21(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___classCallCheck_21(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ___defineProperties_21(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ___createClass_21(Constructor, protoProps, staticProps) { if (protoProps) ___defineProperties_21(Constructor.prototype, protoProps); if (staticProps) ___defineProperties_21(Constructor, staticProps); return Constructor; }

function ___defineProperty_21(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var InteractableSet = /*#__PURE__*/function () {
  // all set interactables
  function InteractableSet(scope) {
    var _this = this;

    ___classCallCheck_21(this, InteractableSet);

    this.scope = scope;

    ___defineProperty_21(this, "list", []);

    ___defineProperty_21(this, "selectorMap", {});

    scope.addListeners({
      'interactable:unset': function interactableUnset(_ref) {
        var interactable = _ref.interactable;
        var target = interactable.target,
            context = interactable._context;
        var targetMappings = __is_21.string(target) ? _this.selectorMap[target] : target[_this.scope.id];
        var targetIndex = targetMappings.findIndex(function (m) {
          return m.context === context;
        });

        if (targetMappings[targetIndex]) {
          // Destroying mappingInfo's context and interactable
          targetMappings[targetIndex].context = null;
          targetMappings[targetIndex].interactable = null;
        }

        targetMappings.splice(targetIndex, 1);
      }
    });
  }

  ___createClass_21(InteractableSet, [{
    key: "new",
    value: function _new(target, options) {
      options = (0, ___extend_21["default"])(options || {}, {
        actions: this.scope.actions
      });
      var interactable = new this.scope.Interactable(target, options, this.scope.document);
      var mappingInfo = {
        context: interactable._context,
        interactable: interactable
      };
      this.scope.addDocument(interactable._doc);
      this.list.push(interactable);

      if (__is_21.string(target)) {
        if (!this.selectorMap[target]) {
          this.selectorMap[target] = [];
        }

        this.selectorMap[target].push(mappingInfo);
      } else {
        if (!interactable.target[this.scope.id]) {
          Object.defineProperty(target, this.scope.id, {
            value: [],
            configurable: true
          });
        }

        target[this.scope.id].push(mappingInfo);
      }

      this.scope.fire('interactable:new', {
        target: target,
        options: options,
        interactable: interactable,
        win: this.scope._win
      });
      return interactable;
    }
  }, {
    key: "get",
    value: function get(target, options) {
      var context = options && options.context || this.scope.document;
      var isSelector = __is_21.string(target);
      var targetMappings = isSelector ? this.selectorMap[target] : target[this.scope.id];

      if (!targetMappings) {
        return null;
      }

      var found = __arr_21.find(targetMappings, function (m) {
        return m.context === context && (isSelector || m.interactable.inContext(target));
      });
      return found && found.interactable;
    }
  }, {
    key: "forEachMatch",
    value: function forEachMatch(node, callback) {
      for (var _i = 0; _i < this.list.length; _i++) {
        var _ref2;

        _ref2 = this.list[_i];
        var _interactable = _ref2;
        var ret = void 0;

        if ((__is_21.string(_interactable.target) // target is a selector and the element matches
        ? __is_21.element(node) && __domUtils_21.matchesSelector(node, _interactable.target) : // target is the element
        node === _interactable.target) && // the element is in context
        _interactable.inContext(node)) {
          ret = callback(_interactable);
        }

        if (ret !== undefined) {
          return ret;
        }
      }
    }
  }]);

  return InteractableSet;
}();

_$InteractableSet_21["default"] = InteractableSet;

var _$PointerInfo_23 = {};
"use strict";

Object.defineProperty(_$PointerInfo_23, "__esModule", {
  value: true
});
_$PointerInfo_23["default"] = _$PointerInfo_23.PointerInfo = void 0;

function ___classCallCheck_23(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* eslint-disable @typescript-eslint/no-parameter-properties */
var PointerInfo = function PointerInfo(id, pointer, event, downTime, downTarget) {
  ___classCallCheck_23(this, PointerInfo);

  this.id = id;
  this.pointer = pointer;
  this.event = event;
  this.downTime = downTime;
  this.downTarget = downTarget;
};

_$PointerInfo_23.PointerInfo = PointerInfo;
var ___default_23 = PointerInfo;
_$PointerInfo_23["default"] = ___default_23;

var _$Interaction_22 = {};
"use strict";

function ___typeof_22(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_22 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_22 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_22(obj); }

Object.defineProperty(_$Interaction_22, "__esModule", {
  value: true
});
Object.defineProperty(_$Interaction_22, "PointerInfo", {
  enumerable: true,
  get: function get() {
    return _PointerInfo["default"];
  }
});
_$Interaction_22["default"] = _$Interaction_22.Interaction = _$Interaction_22._ProxyMethods = _$Interaction_22._ProxyValues = void 0;

var __utils_22 = ___interopRequireWildcard_22(_$index_75);

var _InteractEvent = ___interopRequireDefault_22(_$InteractEvent_18);

var _PointerInfo = ___interopRequireDefault_22(_$PointerInfo_23);

function ___interopRequireDefault_22(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ___getRequireWildcardCache_22() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_22 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_22(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_22(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_22(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___classCallCheck_22(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ___defineProperties_22(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ___createClass_22(Constructor, protoProps, staticProps) { if (protoProps) ___defineProperties_22(Constructor.prototype, protoProps); if (staticProps) ___defineProperties_22(Constructor, staticProps); return Constructor; }

function ___defineProperty_22(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _ProxyValues;

_$Interaction_22._ProxyValues = _ProxyValues;

(function (_ProxyValues) {
  _ProxyValues["interactable"] = "";
  _ProxyValues["element"] = "";
  _ProxyValues["prepared"] = "";
  _ProxyValues["pointerIsDown"] = "";
  _ProxyValues["pointerWasMoved"] = "";
  _ProxyValues["_proxy"] = "";
})(_ProxyValues || (_$Interaction_22._ProxyValues = _ProxyValues = {}));

var _ProxyMethods;

_$Interaction_22._ProxyMethods = _ProxyMethods;

(function (_ProxyMethods) {
  _ProxyMethods["start"] = "";
  _ProxyMethods["move"] = "";
  _ProxyMethods["end"] = "";
  _ProxyMethods["stop"] = "";
  _ProxyMethods["interacting"] = "";
})(_ProxyMethods || (_$Interaction_22._ProxyMethods = _ProxyMethods = {}));

var idCounter = 0;

var Interaction = /*#__PURE__*/function () {
  ___createClass_22(Interaction, [{
    key: "pointerMoveTolerance",
    // current interactable being interacted with
    // the target element of the interactable
    // action that's ready to be fired on next move event
    // keep track of added pointers
    // pointerdown/mousedown/touchstart event
    // previous action event
    get: function get() {
      return 1;
    }
    /**
     * @alias Interaction.prototype.move
     */

  }]);

  /** */
  function Interaction(_ref) {
    var _this = this;

    var pointerType = _ref.pointerType,
        scopeFire = _ref.scopeFire;

    ___classCallCheck_22(this, Interaction);

    ___defineProperty_22(this, "interactable", null);

    ___defineProperty_22(this, "element", null);

    ___defineProperty_22(this, "rect", void 0);

    ___defineProperty_22(this, "_rects", void 0);

    ___defineProperty_22(this, "edges", void 0);

    ___defineProperty_22(this, "_scopeFire", void 0);

    ___defineProperty_22(this, "prepared", {
      name: null,
      axis: null,
      edges: null
    });

    ___defineProperty_22(this, "pointerType", void 0);

    ___defineProperty_22(this, "pointers", []);

    ___defineProperty_22(this, "downEvent", null);

    ___defineProperty_22(this, "downPointer", {});

    ___defineProperty_22(this, "_latestPointer", {
      pointer: null,
      event: null,
      eventTarget: null
    });

    ___defineProperty_22(this, "prevEvent", null);

    ___defineProperty_22(this, "pointerIsDown", false);

    ___defineProperty_22(this, "pointerWasMoved", false);

    ___defineProperty_22(this, "_interacting", false);

    ___defineProperty_22(this, "_ending", false);

    ___defineProperty_22(this, "_stopped", true);

    ___defineProperty_22(this, "_proxy", null);

    ___defineProperty_22(this, "simulation", null);

    ___defineProperty_22(this, "doMove", __utils_22.warnOnce(function (signalArg) {
      this.move(signalArg);
    }, 'The interaction.doMove() method has been renamed to interaction.move()'));

    ___defineProperty_22(this, "coords", {
      // Starting InteractEvent pointer coordinates
      start: __utils_22.pointer.newCoords(),
      // Previous native pointer move event coordinates
      prev: __utils_22.pointer.newCoords(),
      // current native pointer move event coordinates
      cur: __utils_22.pointer.newCoords(),
      // Change in coordinates and time of the pointer
      delta: __utils_22.pointer.newCoords(),
      // pointer velocity
      velocity: __utils_22.pointer.newCoords()
    });

    ___defineProperty_22(this, "_id", idCounter++);

    this._scopeFire = scopeFire;
    this.pointerType = pointerType;
    var that = this;
    this._proxy = {};

    var _loop = function _loop(key) {
      Object.defineProperty(_this._proxy, key, {
        get: function get() {
          return that[key];
        }
      });
    };

    for (var key in _ProxyValues) {
      _loop(key);
    }

    var _loop2 = function _loop2(_key) {
      Object.defineProperty(_this._proxy, _key, {
        value: function value() {
          return that[_key].apply(that, arguments);
        }
      });
    };

    for (var _key in _ProxyMethods) {
      _loop2(_key);
    }

    this._scopeFire('interactions:new', {
      interaction: this
    });
  }

  ___createClass_22(Interaction, [{
    key: "pointerDown",
    value: function pointerDown(pointer, event, eventTarget) {
      var pointerIndex = this.updatePointer(pointer, event, eventTarget, true);
      var pointerInfo = this.pointers[pointerIndex];

      this._scopeFire('interactions:down', {
        pointer: pointer,
        event: event,
        eventTarget: eventTarget,
        pointerIndex: pointerIndex,
        pointerInfo: pointerInfo,
        type: 'down',
        interaction: this
      });
    }
    /**
     * ```js
     * interact(target)
     *   .draggable({
     *     // disable the default drag start by down->move
     *     manualStart: true
     *   })
     *   // start dragging after the user holds the pointer down
     *   .on('hold', function (event) {
     *     var interaction = event.interaction
     *
     *     if (!interaction.interacting()) {
     *       interaction.start({ name: 'drag' },
     *                         event.interactable,
     *                         event.currentTarget)
     *     }
     * })
     * ```
     *
     * Start an action with the given Interactable and Element as tartgets. The
     * action must be enabled for the target Interactable and an appropriate
     * number of pointers must be held down - 1 for drag/resize, 2 for gesture.
     *
     * Use it with `interactable.<action>able({ manualStart: false })` to always
     * [start actions manually](https://github.com/taye/interact.js/issues/114)
     *
     * @param {object} action   The action to be performed - drag, resize, etc.
     * @param {Interactable} target  The Interactable to target
     * @param {Element} element The DOM Element to target
     * @return {object} interact
     */

  }, {
    key: "start",
    value: function start(action, interactable, element) {
      if (this.interacting() || !this.pointerIsDown || this.pointers.length < (action.name === 'gesture' ? 2 : 1) || !interactable.options[action.name].enabled) {
        return false;
      }

      __utils_22.copyAction(this.prepared, action);
      this.interactable = interactable;
      this.element = element;
      this.rect = interactable.getRect(element);
      this.edges = this.prepared.edges ? __utils_22.extend({}, this.prepared.edges) : {
        left: true,
        right: true,
        top: true,
        bottom: true
      };
      this._stopped = false;
      this._interacting = this._doPhase({
        interaction: this,
        event: this.downEvent,
        phase: 'start'
      }) && !this._stopped;
      return this._interacting;
    }
  }, {
    key: "pointerMove",
    value: function pointerMove(pointer, event, eventTarget) {
      if (!this.simulation && !(this.modification && this.modification.endResult)) {
        this.updatePointer(pointer, event, eventTarget, false);
      }

      var duplicateMove = this.coords.cur.page.x === this.coords.prev.page.x && this.coords.cur.page.y === this.coords.prev.page.y && this.coords.cur.client.x === this.coords.prev.client.x && this.coords.cur.client.y === this.coords.prev.client.y;
      var dx;
      var dy; // register movement greater than pointerMoveTolerance

      if (this.pointerIsDown && !this.pointerWasMoved) {
        dx = this.coords.cur.client.x - this.coords.start.client.x;
        dy = this.coords.cur.client.y - this.coords.start.client.y;
        this.pointerWasMoved = __utils_22.hypot(dx, dy) > this.pointerMoveTolerance;
      }

      var pointerIndex = this.getPointerIndex(pointer);
      var signalArg = {
        pointer: pointer,
        pointerIndex: pointerIndex,
        pointerInfo: this.pointers[pointerIndex],
        event: event,
        type: 'move',
        eventTarget: eventTarget,
        dx: dx,
        dy: dy,
        duplicate: duplicateMove,
        interaction: this
      };

      if (!duplicateMove) {
        // set pointer coordinate, time changes and velocity
        __utils_22.pointer.setCoordVelocity(this.coords.velocity, this.coords.delta);
      }

      this._scopeFire('interactions:move', signalArg);

      if (!duplicateMove && !this.simulation) {
        // if interacting, fire an 'action-move' signal etc
        if (this.interacting()) {
          signalArg.type = null;
          this.move(signalArg);
        }

        if (this.pointerWasMoved) {
          __utils_22.pointer.copyCoords(this.coords.prev, this.coords.cur);
        }
      }
    }
    /**
     * ```js
     * interact(target)
     *   .draggable(true)
     *   .on('dragmove', function (event) {
     *     if (someCondition) {
     *       // change the snap settings
     *       event.interactable.draggable({ snap: { targets: [] }})
     *       // fire another move event with re-calculated snap
     *       event.interaction.move()
     *     }
     *   })
     * ```
     *
     * Force a move of the current action at the same coordinates. Useful if
     * snap/restrict has been changed and you want a movement with the new
     * settings.
     */

  }, {
    key: "move",
    value: function move(signalArg) {
      if (!signalArg || !signalArg.event) {
        __utils_22.pointer.setZeroCoords(this.coords.delta);
      }

      signalArg = __utils_22.extend({
        pointer: this._latestPointer.pointer,
        event: this._latestPointer.event,
        eventTarget: this._latestPointer.eventTarget,
        interaction: this
      }, signalArg || {});
      signalArg.phase = 'move';

      this._doPhase(signalArg);
    } // End interact move events and stop auto-scroll unless simulation is running

  }, {
    key: "pointerUp",
    value: function pointerUp(pointer, event, eventTarget, curEventTarget) {
      var pointerIndex = this.getPointerIndex(pointer);

      if (pointerIndex === -1) {
        pointerIndex = this.updatePointer(pointer, event, eventTarget, false);
      }

      var type = /cancel$/i.test(event.type) ? 'cancel' : 'up';

      this._scopeFire("interactions:".concat(type), {
        pointer: pointer,
        pointerIndex: pointerIndex,
        pointerInfo: this.pointers[pointerIndex],
        event: event,
        eventTarget: eventTarget,
        type: type,
        curEventTarget: curEventTarget,
        interaction: this
      });

      if (!this.simulation) {
        this.end(event);
      }

      this.pointerIsDown = false;
      this.removePointer(pointer, event);
    }
  }, {
    key: "documentBlur",
    value: function documentBlur(event) {
      this.end(event);

      this._scopeFire('interactions:blur', {
        event: event,
        type: 'blur',
        interaction: this
      });
    }
    /**
     * ```js
     * interact(target)
     *   .draggable(true)
     *   .on('move', function (event) {
     *     if (event.pageX > 1000) {
     *       // end the current action
     *       event.interaction.end()
     *       // stop all further listeners from being called
     *       event.stopImmediatePropagation()
     *     }
     *   })
     * ```
     *
     * @param {PointerEvent} [event]
     */

  }, {
    key: "end",
    value: function end(event) {
      this._ending = true;
      event = event || this._latestPointer.event;
      var endPhaseResult;

      if (this.interacting()) {
        endPhaseResult = this._doPhase({
          event: event,
          interaction: this,
          phase: 'end'
        });
      }

      this._ending = false;

      if (endPhaseResult === true) {
        this.stop();
      }
    }
  }, {
    key: "currentAction",
    value: function currentAction() {
      return this._interacting ? this.prepared.name : null;
    }
  }, {
    key: "interacting",
    value: function interacting() {
      return this._interacting;
    }
    /** */

  }, {
    key: "stop",
    value: function stop() {
      this._scopeFire('interactions:stop', {
        interaction: this
      });

      this.interactable = this.element = null;
      this._interacting = false;
      this._stopped = true;
      this.prepared.name = this.prevEvent = null;
    }
  }, {
    key: "getPointerIndex",
    value: function getPointerIndex(pointer) {
      var pointerId = __utils_22.pointer.getPointerId(pointer); // mouse and pen interactions may have only one pointer

      return this.pointerType === 'mouse' || this.pointerType === 'pen' ? this.pointers.length - 1 : __utils_22.arr.findIndex(this.pointers, function (curPointer) {
        return curPointer.id === pointerId;
      });
    }
  }, {
    key: "getPointerInfo",
    value: function getPointerInfo(pointer) {
      return this.pointers[this.getPointerIndex(pointer)];
    }
  }, {
    key: "updatePointer",
    value: function updatePointer(pointer, event, eventTarget, down) {
      var id = __utils_22.pointer.getPointerId(pointer);
      var pointerIndex = this.getPointerIndex(pointer);
      var pointerInfo = this.pointers[pointerIndex];
      down = down === false ? false : down || /(down|start)$/i.test(event.type);

      if (!pointerInfo) {
        pointerInfo = new _PointerInfo["default"](id, pointer, event, null, null);
        pointerIndex = this.pointers.length;
        this.pointers.push(pointerInfo);
      } else {
        pointerInfo.pointer = pointer;
      }

      __utils_22.pointer.setCoords(this.coords.cur, this.pointers.map(function (p) {
        return p.pointer;
      }), this._now());
      __utils_22.pointer.setCoordDeltas(this.coords.delta, this.coords.prev, this.coords.cur);

      if (down) {
        this.pointerIsDown = true;
        pointerInfo.downTime = this.coords.cur.timeStamp;
        pointerInfo.downTarget = eventTarget;
        __utils_22.pointer.pointerExtend(this.downPointer, pointer);

        if (!this.interacting()) {
          __utils_22.pointer.copyCoords(this.coords.start, this.coords.cur);
          __utils_22.pointer.copyCoords(this.coords.prev, this.coords.cur);
          this.downEvent = event;
          this.pointerWasMoved = false;
        }
      }

      this._updateLatestPointer(pointer, event, eventTarget);

      this._scopeFire('interactions:update-pointer', {
        pointer: pointer,
        event: event,
        eventTarget: eventTarget,
        down: down,
        pointerInfo: pointerInfo,
        pointerIndex: pointerIndex,
        interaction: this
      });

      return pointerIndex;
    }
  }, {
    key: "removePointer",
    value: function removePointer(pointer, event) {
      var pointerIndex = this.getPointerIndex(pointer);

      if (pointerIndex === -1) {
        return;
      }

      var pointerInfo = this.pointers[pointerIndex];

      this._scopeFire('interactions:remove-pointer', {
        pointer: pointer,
        event: event,
        eventTarget: null,
        pointerIndex: pointerIndex,
        pointerInfo: pointerInfo,
        interaction: this
      });

      this.pointers.splice(pointerIndex, 1);
    }
  }, {
    key: "_updateLatestPointer",
    value: function _updateLatestPointer(pointer, event, eventTarget) {
      this._latestPointer.pointer = pointer;
      this._latestPointer.event = event;
      this._latestPointer.eventTarget = eventTarget;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      this._latestPointer.pointer = null;
      this._latestPointer.event = null;
      this._latestPointer.eventTarget = null;
    }
  }, {
    key: "_createPreparedEvent",
    value: function _createPreparedEvent(event, phase, preEnd, type) {
      return new _InteractEvent["default"](this, event, this.prepared.name, phase, this.element, preEnd, type);
    }
  }, {
    key: "_fireEvent",
    value: function _fireEvent(iEvent) {
      this.interactable.fire(iEvent);

      if (!this.prevEvent || iEvent.timeStamp >= this.prevEvent.timeStamp) {
        this.prevEvent = iEvent;
      }
    }
  }, {
    key: "_doPhase",
    value: function _doPhase(signalArg) {
      var event = signalArg.event,
          phase = signalArg.phase,
          preEnd = signalArg.preEnd,
          type = signalArg.type;
      var rect = this.rect;

      if (rect && phase === 'move') {
        // update the rect changes due to pointer move
        __utils_22.rect.addEdges(this.edges, rect, this.coords.delta[this.interactable.options.deltaSource]);
        rect.width = rect.right - rect.left;
        rect.height = rect.bottom - rect.top;
      }

      var beforeResult = this._scopeFire("interactions:before-action-".concat(phase), signalArg);

      if (beforeResult === false) {
        return false;
      }

      var iEvent = signalArg.iEvent = this._createPreparedEvent(event, phase, preEnd, type);

      this._scopeFire("interactions:action-".concat(phase), signalArg);

      if (phase === 'start') {
        this.prevEvent = iEvent;
      }

      this._fireEvent(iEvent);

      this._scopeFire("interactions:after-action-".concat(phase), signalArg);

      return true;
    }
  }, {
    key: "_now",
    value: function _now() {
      return Date.now();
    }
  }]);

  return Interaction;
}();

_$Interaction_22.Interaction = Interaction;
var ___default_22 = Interaction;
_$Interaction_22["default"] = ___default_22;

var _$interactablePreventDefault_25 = {};
"use strict";

function ___typeof_25(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_25 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_25 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_25(obj); }

Object.defineProperty(_$interactablePreventDefault_25, "__esModule", {
  value: true
});
_$interactablePreventDefault_25.install = __install_25;
_$interactablePreventDefault_25["default"] = void 0;

/* removed: var _$domUtils_69 = require("@interactjs/utils/domUtils"); */;

var ___events_25 = ___interopRequireDefault_25(_$events_70);

var __is_25 = ___interopRequireWildcard_25(_$is_76);

/* removed: var _$window_83 = require("@interactjs/utils/window"); */;

function ___getRequireWildcardCache_25() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_25 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_25(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_25(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_25(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___interopRequireDefault_25(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function preventDefault(newValue) {
  if (/^(always|never|auto)$/.test(newValue)) {
    this.options.preventDefault = newValue;
    return this;
  }

  if (__is_25.bool(newValue)) {
    this.options.preventDefault = newValue ? 'always' : 'never';
    return this;
  }

  return this.options.preventDefault;
}

function checkAndPreventDefault(interactable, scope, event) {
  var setting = interactable.options.preventDefault;

  if (setting === 'never') {
    return;
  }

  if (setting === 'always') {
    event.preventDefault();
    return;
  } // setting === 'auto'
  // if the browser supports passive event listeners and isn't running on iOS,
  // don't preventDefault of touch{start,move} events. CSS touch-action and
  // user-select should be used instead of calling event.preventDefault().


  if (___events_25["default"].supportsPassive && /^touch(start|move)$/.test(event.type)) {
    var doc = (0, _$window_83.getWindow)(event.target).document;
    var docOptions = scope.getDocOptions(doc);

    if (!(docOptions && docOptions.events) || docOptions.events.passive !== false) {
      return;
    }
  } // don't preventDefault of pointerdown events


  if (/^(mouse|pointer|touch)*(down|start)/i.test(event.type)) {
    return;
  } // don't preventDefault on editable elements


  if (__is_25.element(event.target) && (0, _$domUtils_69.matchesSelector)(event.target, 'input,select,textarea,[contenteditable=true],[contenteditable=true] *')) {
    return;
  }

  event.preventDefault();
}

function onInteractionEvent(_ref) {
  var interaction = _ref.interaction,
      event = _ref.event;

  if (interaction.interactable) {
    interaction.interactable.checkAndPreventDefault(event);
  }
}

function __install_25(scope) {
  /** @lends Interactable */
  var Interactable = scope.Interactable;
  /**
   * Returns or sets whether to prevent the browser's default behaviour in
   * response to pointer events. Can be set to:
   *  - `'always'` to always prevent
   *  - `'never'` to never prevent
   *  - `'auto'` to let interact.js try to determine what would be best
   *
   * @param {string} [newValue] `'always'`, `'never'` or `'auto'`
   * @return {string | Interactable} The current setting or this Interactable
   */

  Interactable.prototype.preventDefault = preventDefault;

  Interactable.prototype.checkAndPreventDefault = function (event) {
    return checkAndPreventDefault(this, scope, event);
  }; // prevent native HTML5 drag on interact.js target elements


  scope.interactions.docEvents.push({
    type: 'dragstart',
    listener: function listener(event) {
      for (var _i = 0; _i < scope.interactions.list.length; _i++) {
        var _ref2;

        _ref2 = scope.interactions.list[_i];
        var interaction = _ref2;

        if (interaction.element && (interaction.element === event.target || (0, _$domUtils_69.nodeContains)(interaction.element, event.target))) {
          interaction.interactable.checkAndPreventDefault(event);
          return;
        }
      }
    }
  });
}

var ___default_25 = {
  id: 'core/interactablePreventDefault',
  install: __install_25,
  listeners: ['down', 'move', 'up', 'cancel'].reduce(function (acc, eventType) {
    acc["interactions:".concat(eventType)] = onInteractionEvent;
    return acc;
  }, {})
};
_$interactablePreventDefault_25["default"] = ___default_25;

var _$interactionFinder_26 = {};
"use strict";

function ___typeof_26(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_26 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_26 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_26(obj); }

Object.defineProperty(_$interactionFinder_26, "__esModule", {
  value: true
});
_$interactionFinder_26["default"] = void 0;

var __dom_26 = ___interopRequireWildcard_26(_$domUtils_69);

function ___getRequireWildcardCache_26() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_26 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_26(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_26(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_26(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var finder = {
  methodOrder: ['simulationResume', 'mouseOrPen', 'hasPointer', 'idle'],
  search: function search(details) {
    for (var _i = 0; _i < finder.methodOrder.length; _i++) {
      var _ref;

      _ref = finder.methodOrder[_i];
      var method = _ref;
      var interaction = finder[method](details);

      if (interaction) {
        return interaction;
      }
    }

    return null;
  },
  // try to resume simulation with a new pointer
  simulationResume: function simulationResume(_ref2) {
    var pointerType = _ref2.pointerType,
        eventType = _ref2.eventType,
        eventTarget = _ref2.eventTarget,
        scope = _ref2.scope;

    if (!/down|start/i.test(eventType)) {
      return null;
    }

    for (var _i2 = 0; _i2 < scope.interactions.list.length; _i2++) {
      var _ref3;

      _ref3 = scope.interactions.list[_i2];
      var interaction = _ref3;
      var element = eventTarget;

      if (interaction.simulation && interaction.simulation.allowResume && interaction.pointerType === pointerType) {
        while (element) {
          // if the element is the interaction element
          if (element === interaction.element) {
            return interaction;
          }

          element = __dom_26.parentNode(element);
        }
      }
    }

    return null;
  },
  // if it's a mouse or pen interaction
  mouseOrPen: function mouseOrPen(_ref4) {
    var pointerId = _ref4.pointerId,
        pointerType = _ref4.pointerType,
        eventType = _ref4.eventType,
        scope = _ref4.scope;

    if (pointerType !== 'mouse' && pointerType !== 'pen') {
      return null;
    }

    var firstNonActive;

    for (var _i3 = 0; _i3 < scope.interactions.list.length; _i3++) {
      var _ref5;

      _ref5 = scope.interactions.list[_i3];
      var interaction = _ref5;

      if (interaction.pointerType === pointerType) {
        // if it's a down event, skip interactions with running simulations
        if (interaction.simulation && !hasPointerId(interaction, pointerId)) {
          continue;
        } // if the interaction is active, return it immediately


        if (interaction.interacting()) {
          return interaction;
        } // otherwise save it and look for another active interaction
        else if (!firstNonActive) {
            firstNonActive = interaction;
          }
      }
    } // if no active mouse interaction was found use the first inactive mouse
    // interaction


    if (firstNonActive) {
      return firstNonActive;
    } // find any mouse or pen interaction.
    // ignore the interaction if the eventType is a *down, and a simulation
    // is active


    for (var _i4 = 0; _i4 < scope.interactions.list.length; _i4++) {
      var _ref6;

      _ref6 = scope.interactions.list[_i4];
      var _interaction = _ref6;

      if (_interaction.pointerType === pointerType && !(/down/i.test(eventType) && _interaction.simulation)) {
        return _interaction;
      }
    }

    return null;
  },
  // get interaction that has this pointer
  hasPointer: function hasPointer(_ref7) {
    var pointerId = _ref7.pointerId,
        scope = _ref7.scope;

    for (var _i5 = 0; _i5 < scope.interactions.list.length; _i5++) {
      var _ref8;

      _ref8 = scope.interactions.list[_i5];
      var interaction = _ref8;

      if (hasPointerId(interaction, pointerId)) {
        return interaction;
      }
    }

    return null;
  },
  // get first idle interaction with a matching pointerType
  idle: function idle(_ref9) {
    var pointerType = _ref9.pointerType,
        scope = _ref9.scope;

    for (var _i6 = 0; _i6 < scope.interactions.list.length; _i6++) {
      var _ref10;

      _ref10 = scope.interactions.list[_i6];
      var interaction = _ref10;

      // if there's already a pointer held down
      if (interaction.pointers.length === 1) {
        var target = interaction.interactable; // don't add this pointer if there is a target interactable and it
        // isn't gesturable

        if (target && !(target.options.gesture && target.options.gesture.enabled)) {
          continue;
        }
      } // maximum of 2 pointers per interaction
      else if (interaction.pointers.length >= 2) {
          continue;
        }

      if (!interaction.interacting() && pointerType === interaction.pointerType) {
        return interaction;
      }
    }

    return null;
  }
};

function hasPointerId(interaction, pointerId) {
  return interaction.pointers.some(function (_ref11) {
    var id = _ref11.id;
    return id === pointerId;
  });
}

var ___default_26 = finder;
_$interactionFinder_26["default"] = ___default_26;

var _$DropEvent_2 = {};
"use strict";

Object.defineProperty(_$DropEvent_2, "__esModule", {
  value: true
});
_$DropEvent_2["default"] = void 0;

var ___BaseEvent2_2 = ___interopRequireDefault_2(_$BaseEvent_16);

var __arr_2 = ___interopRequireWildcard_2(_$arr_64);

function ___getRequireWildcardCache_2() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_2 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_2(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_2(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_2(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___interopRequireDefault_2(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ___typeof_2(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_2 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_2 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_2(obj); }

function ___classCallCheck_2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ___defineProperties_2(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ___createClass_2(Constructor, protoProps, staticProps) { if (protoProps) ___defineProperties_2(Constructor.prototype, protoProps); if (staticProps) ___defineProperties_2(Constructor, staticProps); return Constructor; }

function ___possibleConstructorReturn_2(self, call) { if (call && (___typeof_2(call) === "object" || typeof call === "function")) { return call; } return ___assertThisInitialized_2(self); }

function ___getPrototypeOf_2(o) { ___getPrototypeOf_2 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return ___getPrototypeOf_2(o); }

function ___assertThisInitialized_2(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function ___inherits_2(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) ___setPrototypeOf_2(subClass, superClass); }

function ___setPrototypeOf_2(o, p) { ___setPrototypeOf_2 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return ___setPrototypeOf_2(o, p); }

function ___defineProperty_2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var DropEvent = /*#__PURE__*/function (_BaseEvent) {
  ___inherits_2(DropEvent, _BaseEvent);

  /**
   * Class of events fired on dropzones during drags with acceptable targets.
   */
  function DropEvent(dropState, dragEvent, type) {
    var _this;

    ___classCallCheck_2(this, DropEvent);

    _this = ___possibleConstructorReturn_2(this, ___getPrototypeOf_2(DropEvent).call(this, dragEvent._interaction));

    ___defineProperty_2(___assertThisInitialized_2(_this), "target", void 0);

    ___defineProperty_2(___assertThisInitialized_2(_this), "dropzone", void 0);

    ___defineProperty_2(___assertThisInitialized_2(_this), "dragEvent", void 0);

    ___defineProperty_2(___assertThisInitialized_2(_this), "relatedTarget", void 0);

    ___defineProperty_2(___assertThisInitialized_2(_this), "draggable", void 0);

    ___defineProperty_2(___assertThisInitialized_2(_this), "timeStamp", void 0);

    ___defineProperty_2(___assertThisInitialized_2(_this), "propagationStopped", false);

    ___defineProperty_2(___assertThisInitialized_2(_this), "immediatePropagationStopped", false);

    var _ref = type === 'dragleave' ? dropState.prev : dropState.cur,
        element = _ref.element,
        dropzone = _ref.dropzone;

    _this.type = type;
    _this.target = element;
    _this.currentTarget = element;
    _this.dropzone = dropzone;
    _this.dragEvent = dragEvent;
    _this.relatedTarget = dragEvent.target;
    _this.draggable = dragEvent.interactable;
    _this.timeStamp = dragEvent.timeStamp;
    return _this;
  }
  /**
   * If this is a `dropactivate` event, the dropzone element will be
   * deactivated.
   *
   * If this is a `dragmove` or `dragenter`, a `dragleave` will be fired on the
   * dropzone element and more.
   */


  ___createClass_2(DropEvent, [{
    key: "reject",
    value: function reject() {
      var _this2 = this;

      var dropState = this._interaction.dropState;

      if (this.type !== 'dropactivate' && (!this.dropzone || dropState.cur.dropzone !== this.dropzone || dropState.cur.element !== this.target)) {
        return;
      }

      dropState.prev.dropzone = this.dropzone;
      dropState.prev.element = this.target;
      dropState.rejected = true;
      dropState.events.enter = null;
      this.stopImmediatePropagation();

      if (this.type === 'dropactivate') {
        var activeDrops = dropState.activeDrops;
        var index = __arr_2.findIndex(activeDrops, function (_ref2) {
          var dropzone = _ref2.dropzone,
              element = _ref2.element;
          return dropzone === _this2.dropzone && element === _this2.target;
        });
        dropState.activeDrops.splice(index, 1);
        var deactivateEvent = new DropEvent(dropState, this.dragEvent, 'dropdeactivate');
        deactivateEvent.dropzone = this.dropzone;
        deactivateEvent.target = this.target;
        this.dropzone.fire(deactivateEvent);
      } else {
        this.dropzone.fire(new DropEvent(dropState, this.dragEvent, 'dragleave'));
      }
    }
  }, {
    key: "preventDefault",
    value: function preventDefault() {}
  }, {
    key: "stopPropagation",
    value: function stopPropagation() {
      this.propagationStopped = true;
    }
  }, {
    key: "stopImmediatePropagation",
    value: function stopImmediatePropagation() {
      this.immediatePropagationStopped = this.propagationStopped = true;
    }
  }]);

  return DropEvent;
}(___BaseEvent2_2["default"]);

var ___default_2 = DropEvent;
_$DropEvent_2["default"] = ___default_2;

var _$index_3 = {};
"use strict";

function ___typeof_3(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_3 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_3 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_3(obj); }

Object.defineProperty(_$index_3, "__esModule", {
  value: true
});
_$index_3["default"] = void 0;

var ___Interactable_3 = ___interopRequireDefault_3(_$Interactable_20({}));

var ___scope_3 = ___interopRequireDefault_3(_$scope_28({}));

var __utils_3 = ___interopRequireWildcard_3(_$index_75);

var _drag = ___interopRequireDefault_3(_$drag_1);

var _DropEvent = ___interopRequireDefault_3(_$DropEvent_2);

function ___getRequireWildcardCache_3() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_3 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_3(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_3(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_3(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___interopRequireDefault_3(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function __install_3(scope) {
  var actions = scope.actions,
      interact = scope.interactStatic,
      Interactable = scope.Interactable,
      defaults = scope.defaults;
  scope.usePlugin(_drag["default"]);
  /**
   *
   * ```js
   * interact('.drop').dropzone({
   *   accept: '.can-drop' || document.getElementById('single-drop'),
   *   overlap: 'pointer' || 'center' || zeroToOne
   * }
   * ```
   *
   * Returns or sets whether draggables can be dropped onto this target to
   * trigger drop events
   *
   * Dropzones can receive the following events:
   *  - `dropactivate` and `dropdeactivate` when an acceptable drag starts and ends
   *  - `dragenter` and `dragleave` when a draggable enters and leaves the dropzone
   *  - `dragmove` when a draggable that has entered the dropzone is moved
   *  - `drop` when a draggable is dropped into this dropzone
   *
   * Use the `accept` option to allow only elements that match the given CSS
   * selector or element. The value can be:
   *
   *  - **an Element** - only that element can be dropped into this dropzone.
   *  - **a string**, - the element being dragged must match it as a CSS selector.
   *  - **`null`** - accept options is cleared - it accepts any element.
   *
   * Use the `overlap` option to set how drops are checked for. The allowed
   * values are:
   *
   *   - `'pointer'`, the pointer must be over the dropzone (default)
   *   - `'center'`, the draggable element's center must be over the dropzone
   *   - a number from 0-1 which is the `(intersection area) / (draggable area)`.
   *   e.g. `0.5` for drop to happen when half of the area of the draggable is
   *   over the dropzone
   *
   * Use the `checker` option to specify a function to check if a dragged element
   * is over this Interactable.
   *
   * @param {boolean | object | null} [options] The new options to be set.
   * @return {boolean | Interactable} The current setting or this Interactable
   */

  Interactable.prototype.dropzone = function (options) {
    return dropzoneMethod(this, options);
  };
  /**
   * ```js
   * interact(target)
   * .dropChecker(function(dragEvent,         // related dragmove or dragend event
   *                       event,             // TouchEvent/PointerEvent/MouseEvent
   *                       dropped,           // bool result of the default checker
   *                       dropzone,          // dropzone Interactable
   *                       dropElement,       // dropzone elemnt
   *                       draggable,         // draggable Interactable
   *                       draggableElement) {// draggable element
   *
   *   return dropped && event.target.hasAttribute('allow-drop')
   * }
   * ```
   */


  Interactable.prototype.dropCheck = function (dragEvent, event, draggable, draggableElement, dropElement, rect) {
    return dropCheckMethod(this, dragEvent, event, draggable, draggableElement, dropElement, rect);
  };
  /**
   * Returns or sets whether the dimensions of dropzone elements are calculated
   * on every dragmove or only on dragstart for the default dropChecker
   *
   * @param {boolean} [newValue] True to check on each move. False to check only
   * before start
   * @return {boolean | interact} The current setting or interact
   */


  interact.dynamicDrop = function (newValue) {
    if (__utils_3.is.bool(newValue)) {
      // if (dragging && scope.dynamicDrop !== newValue && !newValue) {
      //  calcRects(dropzones)
      // }
      scope.dynamicDrop = newValue;
      return interact;
    }

    return scope.dynamicDrop;
  };

  __utils_3.extend(actions.phaselessTypes, {
    dragenter: true,
    dragleave: true,
    dropactivate: true,
    dropdeactivate: true,
    dropmove: true,
    drop: true
  });
  actions.methodDict.drop = 'dropzone';
  scope.dynamicDrop = false;
  defaults.actions.drop = drop.defaults;
}

function collectDrops(_ref, draggableElement) {
  var interactables = _ref.interactables;
  var drops = []; // collect all dropzones and their elements which qualify for a drop

  for (var _i = 0; _i < interactables.list.length; _i++) {
    var _ref2;

    _ref2 = interactables.list[_i];
    var dropzone = _ref2;

    if (!dropzone.options.drop.enabled) {
      continue;
    }

    var accept = dropzone.options.drop.accept; // test the draggable draggableElement against the dropzone's accept setting

    if (__utils_3.is.element(accept) && accept !== draggableElement || __utils_3.is.string(accept) && !__utils_3.dom.matchesSelector(draggableElement, accept) || __utils_3.is.func(accept) && !accept({
      dropzone: dropzone,
      draggableElement: draggableElement
    })) {
      continue;
    } // query for new elements if necessary


    var dropElements = __utils_3.is.string(dropzone.target) ? dropzone._context.querySelectorAll(dropzone.target) : __utils_3.is.array(dropzone.target) ? dropzone.target : [dropzone.target];

    for (var _i2 = 0; _i2 < dropElements.length; _i2++) {
      var _ref3;

      _ref3 = dropElements[_i2];
      var dropzoneElement = _ref3;

      if (dropzoneElement !== draggableElement) {
        drops.push({
          dropzone: dropzone,
          element: dropzoneElement
        });
      }
    }
  }

  return drops;
}

function fireActivationEvents(activeDrops, event) {
  // loop through all active dropzones and trigger event
  for (var _i3 = 0; _i3 < activeDrops.slice().length; _i3++) {
    var _ref4;

    _ref4 = activeDrops.slice()[_i3];
    var _ref5 = _ref4,
        dropzone = _ref5.dropzone,
        element = _ref5.element;
    event.dropzone = dropzone; // set current element as event target

    event.target = element;
    dropzone.fire(event);
    event.propagationStopped = event.immediatePropagationStopped = false;
  }
} // return a new array of possible drops. getActiveDrops should always be
// called when a drag has just started or a drag event happens while
// dynamicDrop is true


function getActiveDrops(scope, dragElement) {
  // get dropzones and their elements that could receive the draggable
  var activeDrops = collectDrops(scope, dragElement);

  for (var _i4 = 0; _i4 < activeDrops.length; _i4++) {
    var _ref6;

    _ref6 = activeDrops[_i4];
    var activeDrop = _ref6;
    activeDrop.rect = activeDrop.dropzone.getRect(activeDrop.element);
  }

  return activeDrops;
}

function getDrop(_ref7, dragEvent, pointerEvent) {
  var dropState = _ref7.dropState,
      draggable = _ref7.interactable,
      dragElement = _ref7.element;
  var validDrops = []; // collect all dropzones and their elements which qualify for a drop

  for (var _i5 = 0; _i5 < dropState.activeDrops.length; _i5++) {
    var _ref8;

    _ref8 = dropState.activeDrops[_i5];
    var _ref9 = _ref8,
        dropzone = _ref9.dropzone,
        dropzoneElement = _ref9.element,
        _rect = _ref9.rect;
    validDrops.push(dropzone.dropCheck(dragEvent, pointerEvent, draggable, dragElement, dropzoneElement, _rect) ? dropzoneElement : null);
  } // get the most appropriate dropzone based on DOM depth and order


  var dropIndex = __utils_3.dom.indexOfDeepestElement(validDrops);
  return dropState.activeDrops[dropIndex] || null;
}

function getDropEvents(interaction, _pointerEvent, dragEvent) {
  var dropState = interaction.dropState;
  var dropEvents = {
    enter: null,
    leave: null,
    activate: null,
    deactivate: null,
    move: null,
    drop: null
  };

  if (dragEvent.type === 'dragstart') {
    dropEvents.activate = new _DropEvent["default"](dropState, dragEvent, 'dropactivate');
    dropEvents.activate.target = null;
    dropEvents.activate.dropzone = null;
  }

  if (dragEvent.type === 'dragend') {
    dropEvents.deactivate = new _DropEvent["default"](dropState, dragEvent, 'dropdeactivate');
    dropEvents.deactivate.target = null;
    dropEvents.deactivate.dropzone = null;
  }

  if (dropState.rejected) {
    return dropEvents;
  }

  if (dropState.cur.element !== dropState.prev.element) {
    // if there was a previous dropzone, create a dragleave event
    if (dropState.prev.dropzone) {
      dropEvents.leave = new _DropEvent["default"](dropState, dragEvent, 'dragleave');
      dragEvent.dragLeave = dropEvents.leave.target = dropState.prev.element;
      dragEvent.prevDropzone = dropEvents.leave.dropzone = dropState.prev.dropzone;
    } // if dropzone is not null, create a dragenter event


    if (dropState.cur.dropzone) {
      dropEvents.enter = new _DropEvent["default"](dropState, dragEvent, 'dragenter');
      dragEvent.dragEnter = dropState.cur.element;
      dragEvent.dropzone = dropState.cur.dropzone;
    }
  }

  if (dragEvent.type === 'dragend' && dropState.cur.dropzone) {
    dropEvents.drop = new _DropEvent["default"](dropState, dragEvent, 'drop');
    dragEvent.dropzone = dropState.cur.dropzone;
    dragEvent.relatedTarget = dropState.cur.element;
  }

  if (dragEvent.type === 'dragmove' && dropState.cur.dropzone) {
    dropEvents.move = new _DropEvent["default"](dropState, dragEvent, 'dropmove');
    dropEvents.move.dragmove = dragEvent;
    dragEvent.dropzone = dropState.cur.dropzone;
  }

  return dropEvents;
}

function fireDropEvents(interaction, events) {
  var dropState = interaction.dropState;
  var activeDrops = dropState.activeDrops,
      cur = dropState.cur,
      prev = dropState.prev;

  if (events.leave) {
    prev.dropzone.fire(events.leave);
  }

  if (events.move) {
    cur.dropzone.fire(events.move);
  }

  if (events.enter) {
    cur.dropzone.fire(events.enter);
  }

  if (events.drop) {
    cur.dropzone.fire(events.drop);
  }

  if (events.deactivate) {
    fireActivationEvents(activeDrops, events.deactivate);
  }

  dropState.prev.dropzone = cur.dropzone;
  dropState.prev.element = cur.element;
}

function onEventCreated(_ref10, scope) {
  var interaction = _ref10.interaction,
      iEvent = _ref10.iEvent,
      event = _ref10.event;

  if (iEvent.type !== 'dragmove' && iEvent.type !== 'dragend') {
    return;
  }

  var dropState = interaction.dropState;

  if (scope.dynamicDrop) {
    dropState.activeDrops = getActiveDrops(scope, interaction.element);
  }

  var dragEvent = iEvent;
  var dropResult = getDrop(interaction, dragEvent, event); // update rejected status

  dropState.rejected = dropState.rejected && !!dropResult && dropResult.dropzone === dropState.cur.dropzone && dropResult.element === dropState.cur.element;
  dropState.cur.dropzone = dropResult && dropResult.dropzone;
  dropState.cur.element = dropResult && dropResult.element;
  dropState.events = getDropEvents(interaction, event, dragEvent);
}

function dropzoneMethod(interactable, options) {
  if (__utils_3.is.object(options)) {
    interactable.options.drop.enabled = options.enabled !== false;

    if (options.listeners) {
      var normalized = __utils_3.normalizeListeners(options.listeners); // rename 'drop' to '' as it will be prefixed with 'drop'

      var corrected = Object.keys(normalized).reduce(function (acc, type) {
        var correctedType = /^(enter|leave)/.test(type) ? "drag".concat(type) : /^(activate|deactivate|move)/.test(type) ? "drop".concat(type) : type;
        acc[correctedType] = normalized[type];
        return acc;
      }, {});
      interactable.off(interactable.options.drop.listeners);
      interactable.on(corrected);
      interactable.options.drop.listeners = corrected;
    }

    if (__utils_3.is.func(options.ondrop)) {
      interactable.on('drop', options.ondrop);
    }

    if (__utils_3.is.func(options.ondropactivate)) {
      interactable.on('dropactivate', options.ondropactivate);
    }

    if (__utils_3.is.func(options.ondropdeactivate)) {
      interactable.on('dropdeactivate', options.ondropdeactivate);
    }

    if (__utils_3.is.func(options.ondragenter)) {
      interactable.on('dragenter', options.ondragenter);
    }

    if (__utils_3.is.func(options.ondragleave)) {
      interactable.on('dragleave', options.ondragleave);
    }

    if (__utils_3.is.func(options.ondropmove)) {
      interactable.on('dropmove', options.ondropmove);
    }

    if (/^(pointer|center)$/.test(options.overlap)) {
      interactable.options.drop.overlap = options.overlap;
    } else if (__utils_3.is.number(options.overlap)) {
      interactable.options.drop.overlap = Math.max(Math.min(1, options.overlap), 0);
    }

    if ('accept' in options) {
      interactable.options.drop.accept = options.accept;
    }

    if ('checker' in options) {
      interactable.options.drop.checker = options.checker;
    }

    return interactable;
  }

  if (__utils_3.is.bool(options)) {
    interactable.options.drop.enabled = options;
    return interactable;
  }

  return interactable.options.drop;
}

function dropCheckMethod(interactable, dragEvent, event, draggable, draggableElement, dropElement, rect) {
  var dropped = false; // if the dropzone has no rect (eg. display: none)
  // call the custom dropChecker or just return false

  if (!(rect = rect || interactable.getRect(dropElement))) {
    return interactable.options.drop.checker ? interactable.options.drop.checker(dragEvent, event, dropped, interactable, dropElement, draggable, draggableElement) : false;
  }

  var dropOverlap = interactable.options.drop.overlap;

  if (dropOverlap === 'pointer') {
    var origin = __utils_3.getOriginXY(draggable, draggableElement, 'drag');
    var page = __utils_3.pointer.getPageXY(dragEvent);
    page.x += origin.x;
    page.y += origin.y;
    var horizontal = page.x > rect.left && page.x < rect.right;
    var vertical = page.y > rect.top && page.y < rect.bottom;
    dropped = horizontal && vertical;
  }

  var dragRect = draggable.getRect(draggableElement);

  if (dragRect && dropOverlap === 'center') {
    var cx = dragRect.left + dragRect.width / 2;
    var cy = dragRect.top + dragRect.height / 2;
    dropped = cx >= rect.left && cx <= rect.right && cy >= rect.top && cy <= rect.bottom;
  }

  if (dragRect && __utils_3.is.number(dropOverlap)) {
    var overlapArea = Math.max(0, Math.min(rect.right, dragRect.right) - Math.max(rect.left, dragRect.left)) * Math.max(0, Math.min(rect.bottom, dragRect.bottom) - Math.max(rect.top, dragRect.top));
    var overlapRatio = overlapArea / (dragRect.width * dragRect.height);
    dropped = overlapRatio >= dropOverlap;
  }

  if (interactable.options.drop.checker) {
    dropped = interactable.options.drop.checker(dragEvent, event, dropped, interactable, dropElement, draggable, draggableElement);
  }

  return dropped;
}

var drop = {
  id: 'actions/drop',
  install: __install_3,
  listeners: {
    'interactions:before-action-start': function interactionsBeforeActionStart(_ref11) {
      var interaction = _ref11.interaction;

      if (interaction.prepared.name !== 'drag') {
        return;
      }

      interaction.dropState = {
        cur: {
          dropzone: null,
          element: null
        },
        prev: {
          dropzone: null,
          element: null
        },
        rejected: null,
        events: null,
        activeDrops: []
      };
    },
    'interactions:after-action-start': function interactionsAfterActionStart(_ref12, scope) {
      var interaction = _ref12.interaction,
          event = _ref12.event,
          dragEvent = _ref12.iEvent;

      if (interaction.prepared.name !== 'drag') {
        return;
      }

      var dropState = interaction.dropState; // reset active dropzones

      dropState.activeDrops = null;
      dropState.events = null;
      dropState.activeDrops = getActiveDrops(scope, interaction.element);
      dropState.events = getDropEvents(interaction, event, dragEvent);

      if (dropState.events.activate) {
        fireActivationEvents(dropState.activeDrops, dropState.events.activate);
        scope.fire('actions/drop:start', {
          interaction: interaction,
          dragEvent: dragEvent
        });
      }
    },
    // FIXME proper signal types
    'interactions:action-move': onEventCreated,
    'interactions:action-end': onEventCreated,
    'interactions:after-action-move': function fireDropAfterMove(_ref13, scope) {
      var interaction = _ref13.interaction,
          dragEvent = _ref13.iEvent;

      if (interaction.prepared.name !== 'drag') {
        return;
      }

      fireDropEvents(interaction, interaction.dropState.events);
      scope.fire('actions/drop:move', {
        interaction: interaction,
        dragEvent: dragEvent
      });
      interaction.dropState.events = {};
    },
    'interactions:after-action-end': function interactionsAfterActionEnd(_ref14, scope) {
      var interaction = _ref14.interaction,
          dragEvent = _ref14.iEvent;

      if (interaction.prepared.name !== 'drag') {
        return;
      }

      fireDropEvents(interaction, interaction.dropState.events);
      scope.fire('actions/drop:end', {
        interaction: interaction,
        dragEvent: dragEvent
      });
    },
    'interactions:stop': function interactionsStop(_ref15) {
      var interaction = _ref15.interaction;

      if (interaction.prepared.name !== 'drag') {
        return;
      }

      var dropState = interaction.dropState;

      if (dropState) {
        dropState.activeDrops = null;
        dropState.events = null;
        dropState.cur.dropzone = null;
        dropState.cur.element = null;
        dropState.prev.dropzone = null;
        dropState.prev.element = null;
        dropState.rejected = false;
      }
    }
  },
  getActiveDrops: getActiveDrops,
  getDrop: getDrop,
  getDropEvents: getDropEvents,
  fireDropEvents: fireDropEvents,
  defaults: {
    enabled: false,
    accept: null,
    overlap: 'pointer'
  }
};
var ___default_3 = drop;
_$index_3["default"] = ___default_3;

var _$gesture_4 = {};
"use strict";

function ___typeof_4(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_4 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_4 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_4(obj); }

Object.defineProperty(_$gesture_4, "__esModule", {
  value: true
});
_$gesture_4["default"] = void 0;

var __utils_4 = ___interopRequireWildcard_4(_$index_75);

function ___getRequireWildcardCache_4() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_4 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_4(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_4(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_4(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function __install_4(scope) {
  var actions = scope.actions,
      Interactable = scope.Interactable,
      defaults = scope.defaults;
  /**
   * ```js
   * interact(element).gesturable({
   *     onstart: function (event) {},
   *     onmove : function (event) {},
   *     onend  : function (event) {},
   *
   *     // limit multiple gestures.
   *     // See the explanation in {@link Interactable.draggable} example
   *     max: Infinity,
   *     maxPerElement: 1,
   * })
   *
   * var isGestureable = interact(element).gesturable()
   * ```
   *
   * Gets or sets whether multitouch gestures can be performed on the target
   *
   * @param {boolean | object} [options] true/false or An object with event
   * listeners to be fired on gesture events (makes the Interactable gesturable)
   * @return {boolean | Interactable} A boolean indicating if this can be the
   * target of gesture events, or this Interactable
   */

  Interactable.prototype.gesturable = function (options) {
    if (__utils_4.is.object(options)) {
      this.options.gesture.enabled = options.enabled !== false;
      this.setPerAction('gesture', options);
      this.setOnEvents('gesture', options);
      return this;
    }

    if (__utils_4.is.bool(options)) {
      this.options.gesture.enabled = options;
      return this;
    }

    return this.options.gesture;
  };

  actions.map.gesture = gesture;
  actions.methodDict.gesture = 'gesturable';
  defaults.actions.gesture = gesture.defaults;
}

function updateGestureProps(_ref) {
  var interaction = _ref.interaction,
      iEvent = _ref.iEvent,
      phase = _ref.phase;

  if (interaction.prepared.name !== 'gesture') {
    return;
  }

  var pointers = interaction.pointers.map(function (p) {
    return p.pointer;
  });
  var starting = phase === 'start';
  var ending = phase === 'end';
  var deltaSource = interaction.interactable.options.deltaSource;
  iEvent.touches = [pointers[0], pointers[1]];

  if (starting) {
    iEvent.distance = __utils_4.pointer.touchDistance(pointers, deltaSource);
    iEvent.box = __utils_4.pointer.touchBBox(pointers);
    iEvent.scale = 1;
    iEvent.ds = 0;
    iEvent.angle = __utils_4.pointer.touchAngle(pointers, deltaSource);
    iEvent.da = 0;
    interaction.gesture.startDistance = iEvent.distance;
    interaction.gesture.startAngle = iEvent.angle;
  } else if (ending) {
    var prevEvent = interaction.prevEvent;
    iEvent.distance = prevEvent.distance;
    iEvent.box = prevEvent.box;
    iEvent.scale = prevEvent.scale;
    iEvent.ds = 0;
    iEvent.angle = prevEvent.angle;
    iEvent.da = 0;
  } else {
    iEvent.distance = __utils_4.pointer.touchDistance(pointers, deltaSource);
    iEvent.box = __utils_4.pointer.touchBBox(pointers);
    iEvent.scale = iEvent.distance / interaction.gesture.startDistance;
    iEvent.angle = __utils_4.pointer.touchAngle(pointers, deltaSource);
    iEvent.ds = iEvent.scale - interaction.gesture.scale;
    iEvent.da = iEvent.angle - interaction.gesture.angle;
  }

  interaction.gesture.distance = iEvent.distance;
  interaction.gesture.angle = iEvent.angle;

  if (__utils_4.is.number(iEvent.scale) && iEvent.scale !== Infinity && !isNaN(iEvent.scale)) {
    interaction.gesture.scale = iEvent.scale;
  }
}

var gesture = {
  id: 'actions/gesture',
  before: ['actions/drag', 'actions/resize'],
  install: __install_4,
  listeners: {
    'interactions:action-start': updateGestureProps,
    'interactions:action-move': updateGestureProps,
    'interactions:action-end': updateGestureProps,
    'interactions:new': function interactionsNew(_ref2) {
      var interaction = _ref2.interaction;
      interaction.gesture = {
        angle: 0,
        distance: 0,
        scale: 1,
        startAngle: 0,
        startDistance: 0
      };
    },
    'auto-start:check': function autoStartCheck(arg) {
      if (arg.interaction.pointers.length < 2) {
        return undefined;
      }

      var gestureOptions = arg.interactable.options.gesture;

      if (!(gestureOptions && gestureOptions.enabled)) {
        return undefined;
      }

      arg.action = {
        name: 'gesture'
      };
      return false;
    }
  },
  defaults: {},
  getCursor: function getCursor() {
    return '';
  }
};
var ___default_4 = gesture;
_$gesture_4["default"] = ___default_4;

var _$resize_6 = {};
"use strict";

function ___typeof_6(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_6 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_6 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_6(obj); }

Object.defineProperty(_$resize_6, "__esModule", {
  value: true
});
_$resize_6["default"] = void 0;

/* removed: var _$Interaction_22 = require("@interactjs/core/Interaction"); */;

var __dom_6 = ___interopRequireWildcard_6(_$domUtils_69);

var ___extend_6 = ___interopRequireDefault_6(_$extend_72);

var __is_6 = ___interopRequireWildcard_6(_$is_76);

function ___interopRequireDefault_6(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ___getRequireWildcardCache_6() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_6 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_6(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_6(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_6(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function __install_6(scope) {
  var actions = scope.actions,
      browser = scope.browser,
      Interactable = scope.Interactable,
      defaults = scope.defaults; // Less Precision with touch input

  resize.cursors = initCursors(browser);
  resize.defaultMargin = browser.supportsTouch || browser.supportsPointerEvent ? 20 : 10;
  /**
   * ```js
   * interact(element).resizable({
   *   onstart: function (event) {},
   *   onmove : function (event) {},
   *   onend  : function (event) {},
   *
   *   edges: {
   *     top   : true,       // Use pointer coords to check for resize.
   *     left  : false,      // Disable resizing from left edge.
   *     bottom: '.resize-s',// Resize if pointer target matches selector
   *     right : handleEl    // Resize if pointer target is the given Element
   *   },
   *
   *     // Width and height can be adjusted independently. When `true`, width and
   *     // height are adjusted at a 1:1 ratio.
   *     square: false,
   *
   *     // Width and height can be adjusted independently. When `true`, width and
   *     // height maintain the aspect ratio they had when resizing started.
   *     preserveAspectRatio: false,
   *
   *   // a value of 'none' will limit the resize rect to a minimum of 0x0
   *   // 'negate' will allow the rect to have negative width/height
   *   // 'reposition' will keep the width/height positive by swapping
   *   // the top and bottom edges and/or swapping the left and right edges
   *   invert: 'none' || 'negate' || 'reposition'
   *
   *   // limit multiple resizes.
   *   // See the explanation in the {@link Interactable.draggable} example
   *   max: Infinity,
   *   maxPerElement: 1,
   * })
   *
   * var isResizeable = interact(element).resizable()
   * ```
   *
   * Gets or sets whether resize actions can be performed on the target
   *
   * @param {boolean | object} [options] true/false or An object with event
   * listeners to be fired on resize events (object makes the Interactable
   * resizable)
   * @return {boolean | Interactable} A boolean indicating if this can be the
   * target of resize elements, or this Interactable
   */

  Interactable.prototype.resizable = function (options) {
    return resizable(this, options, scope);
  };

  actions.map.resize = resize;
  actions.methodDict.resize = 'resizable';
  defaults.actions.resize = resize.defaults;
}

function resizeChecker(arg) {
  var interaction = arg.interaction,
      interactable = arg.interactable,
      element = arg.element,
      rect = arg.rect,
      buttons = arg.buttons;

  if (!rect) {
    return undefined;
  }

  var page = (0, ___extend_6["default"])({}, interaction.coords.cur.page);
  var resizeOptions = interactable.options.resize;

  if (!(resizeOptions && resizeOptions.enabled) || // check mouseButton setting if the pointer is down
  interaction.pointerIsDown && /mouse|pointer/.test(interaction.pointerType) && (buttons & resizeOptions.mouseButtons) === 0) {
    return undefined;
  } // if using resize.edges


  if (__is_6.object(resizeOptions.edges)) {
    var resizeEdges = {
      left: false,
      right: false,
      top: false,
      bottom: false
    };

    for (var edge in resizeEdges) {
      resizeEdges[edge] = checkResizeEdge(edge, resizeOptions.edges[edge], page, interaction._latestPointer.eventTarget, element, rect, resizeOptions.margin || resize.defaultMargin);
    }

    resizeEdges.left = resizeEdges.left && !resizeEdges.right;
    resizeEdges.top = resizeEdges.top && !resizeEdges.bottom;

    if (resizeEdges.left || resizeEdges.right || resizeEdges.top || resizeEdges.bottom) {
      arg.action = {
        name: 'resize',
        edges: resizeEdges
      };
    }
  } else {
    var right = resizeOptions.axis !== 'y' && page.x > rect.right - resize.defaultMargin;
    var bottom = resizeOptions.axis !== 'x' && page.y > rect.bottom - resize.defaultMargin;

    if (right || bottom) {
      arg.action = {
        name: 'resize',
        axes: (right ? 'x' : '') + (bottom ? 'y' : '')
      };
    }
  }

  return arg.action ? false : undefined;
}

function resizable(interactable, options, scope) {
  if (__is_6.object(options)) {
    interactable.options.resize.enabled = options.enabled !== false;
    interactable.setPerAction('resize', options);
    interactable.setOnEvents('resize', options);

    if (__is_6.string(options.axis) && /^x$|^y$|^xy$/.test(options.axis)) {
      interactable.options.resize.axis = options.axis;
    } else if (options.axis === null) {
      interactable.options.resize.axis = scope.defaults.actions.resize.axis;
    }

    if (__is_6.bool(options.preserveAspectRatio)) {
      interactable.options.resize.preserveAspectRatio = options.preserveAspectRatio;
    } else if (__is_6.bool(options.square)) {
      interactable.options.resize.square = options.square;
    }

    return interactable;
  }

  if (__is_6.bool(options)) {
    interactable.options.resize.enabled = options;
    return interactable;
  }

  return interactable.options.resize;
}

function checkResizeEdge(name, value, page, element, interactableElement, rect, margin) {
  // false, '', undefined, null
  if (!value) {
    return false;
  } // true value, use pointer coords and element rect


  if (value === true) {
    // if dimensions are negative, "switch" edges
    var width = __is_6.number(rect.width) ? rect.width : rect.right - rect.left;
    var height = __is_6.number(rect.height) ? rect.height : rect.bottom - rect.top; // don't use margin greater than half the relevent dimension

    margin = Math.min(margin, (name === 'left' || name === 'right' ? width : height) / 2);

    if (width < 0) {
      if (name === 'left') {
        name = 'right';
      } else if (name === 'right') {
        name = 'left';
      }
    }

    if (height < 0) {
      if (name === 'top') {
        name = 'bottom';
      } else if (name === 'bottom') {
        name = 'top';
      }
    }

    if (name === 'left') {
      return page.x < (width >= 0 ? rect.left : rect.right) + margin;
    }

    if (name === 'top') {
      return page.y < (height >= 0 ? rect.top : rect.bottom) + margin;
    }

    if (name === 'right') {
      return page.x > (width >= 0 ? rect.right : rect.left) - margin;
    }

    if (name === 'bottom') {
      return page.y > (height >= 0 ? rect.bottom : rect.top) - margin;
    }
  } // the remaining checks require an element


  if (!__is_6.element(element)) {
    return false;
  }

  return __is_6.element(value) // the value is an element to use as a resize handle
  ? value === element // otherwise check if element matches value as selector
  : __dom_6.matchesUpTo(element, value, interactableElement);
}

function initCursors(browser) {
  return browser.isIe9 ? {
    x: 'e-resize',
    y: 's-resize',
    xy: 'se-resize',
    top: 'n-resize',
    left: 'w-resize',
    bottom: 's-resize',
    right: 'e-resize',
    topleft: 'se-resize',
    bottomright: 'se-resize',
    topright: 'ne-resize',
    bottomleft: 'ne-resize'
  } : {
    x: 'ew-resize',
    y: 'ns-resize',
    xy: 'nwse-resize',
    top: 'ns-resize',
    left: 'ew-resize',
    bottom: 'ns-resize',
    right: 'ew-resize',
    topleft: 'nwse-resize',
    bottomright: 'nwse-resize',
    topright: 'nesw-resize',
    bottomleft: 'nesw-resize'
  };
}

function start(_ref) {
  var iEvent = _ref.iEvent,
      interaction = _ref.interaction;

  if (interaction.prepared.name !== 'resize' || !interaction.prepared.edges) {
    return;
  }

  var resizeEvent = iEvent;
  var rect = interaction.rect;
  interaction._rects = {
    start: (0, ___extend_6["default"])({}, rect),
    corrected: (0, ___extend_6["default"])({}, rect),
    previous: (0, ___extend_6["default"])({}, rect),
    delta: {
      left: 0,
      right: 0,
      width: 0,
      top: 0,
      bottom: 0,
      height: 0
    }
  };
  resizeEvent.edges = interaction.prepared.edges;
  resizeEvent.rect = interaction._rects.corrected;
  resizeEvent.deltaRect = interaction._rects.delta;
}

function __move_6(_ref2) {
  var iEvent = _ref2.iEvent,
      interaction = _ref2.interaction;

  if (interaction.prepared.name !== 'resize' || !interaction.prepared.edges) {
    return;
  }

  var resizeEvent = iEvent;
  var resizeOptions = interaction.interactable.options.resize;
  var invert = resizeOptions.invert;
  var invertible = invert === 'reposition' || invert === 'negate'; // eslint-disable-next-line no-shadow

  var current = interaction.rect;
  var _interaction$_rects = interaction._rects,
      startRect = _interaction$_rects.start,
      corrected = _interaction$_rects.corrected,
      deltaRect = _interaction$_rects.delta,
      previous = _interaction$_rects.previous;
  (0, ___extend_6["default"])(previous, corrected);

  if (invertible) {
    // if invertible, copy the current rect
    (0, ___extend_6["default"])(corrected, current);

    if (invert === 'reposition') {
      // swap edge values if necessary to keep width/height positive
      if (corrected.top > corrected.bottom) {
        var swap = corrected.top;
        corrected.top = corrected.bottom;
        corrected.bottom = swap;
      }

      if (corrected.left > corrected.right) {
        var _swap = corrected.left;
        corrected.left = corrected.right;
        corrected.right = _swap;
      }
    }
  } else {
    // if not invertible, restrict to minimum of 0x0 rect
    corrected.top = Math.min(current.top, startRect.bottom);
    corrected.bottom = Math.max(current.bottom, startRect.top);
    corrected.left = Math.min(current.left, startRect.right);
    corrected.right = Math.max(current.right, startRect.left);
  }

  corrected.width = corrected.right - corrected.left;
  corrected.height = corrected.bottom - corrected.top;

  for (var edge in corrected) {
    deltaRect[edge] = corrected[edge] - previous[edge];
  }

  resizeEvent.edges = interaction.prepared.edges;
  resizeEvent.rect = corrected;
  resizeEvent.deltaRect = deltaRect;
}

function end(_ref3) {
  var iEvent = _ref3.iEvent,
      interaction = _ref3.interaction;

  if (interaction.prepared.name !== 'resize' || !interaction.prepared.edges) {
    return;
  }

  var resizeEvent = iEvent;
  resizeEvent.edges = interaction.prepared.edges;
  resizeEvent.rect = interaction._rects.corrected;
  resizeEvent.deltaRect = interaction._rects.delta;
}

function updateEventAxes(_ref4) {
  var iEvent = _ref4.iEvent,
      interaction = _ref4.interaction;

  if (interaction.prepared.name !== 'resize' || !interaction.resizeAxes) {
    return;
  }

  var options = interaction.interactable.options;
  var resizeEvent = iEvent;

  if (options.resize.square) {
    if (interaction.resizeAxes === 'y') {
      resizeEvent.delta.x = resizeEvent.delta.y;
    } else {
      resizeEvent.delta.y = resizeEvent.delta.x;
    }

    resizeEvent.axes = 'xy';
  } else {
    resizeEvent.axes = interaction.resizeAxes;

    if (interaction.resizeAxes === 'x') {
      resizeEvent.delta.y = 0;
    } else if (interaction.resizeAxes === 'y') {
      resizeEvent.delta.x = 0;
    }
  }
}

var resize = {
  id: 'actions/resize',
  before: ['actions/drag'],
  install: __install_6,
  listeners: {
    'interactions:new': function interactionsNew(_ref5) {
      var interaction = _ref5.interaction;
      interaction.resizeAxes = 'xy';
    },
    'interactions:action-start': function interactionsActionStart(arg) {
      start(arg);
      updateEventAxes(arg);
    },
    'interactions:action-move': function interactionsActionMove(arg) {
      __move_6(arg);
      updateEventAxes(arg);
    },
    'interactions:action-end': end,
    'auto-start:check': resizeChecker
  },
  defaults: {
    square: false,
    preserveAspectRatio: false,
    axis: 'xy',
    // use default margin
    margin: NaN,
    // object with props left, right, top, bottom which are
    // true/false values to resize when the pointer is over that edge,
    // CSS selectors to match the handles for each direction
    // or the Elements for each handle
    edges: null,
    // a value of 'none' will limit the resize rect to a minimum of 0x0
    // 'negate' will alow the rect to have negative width/height
    // 'reposition' will keep the width/height positive by swapping
    // the top and bottom edges and/or swapping the left and right edges
    invert: 'none'
  },
  cursors: null,
  getCursor: function getCursor(_ref6) {
    var edges = _ref6.edges,
        axis = _ref6.axis,
        name = _ref6.name;
    var cursors = resize.cursors;
    var result = null;

    if (axis) {
      result = cursors[name + axis];
    } else if (edges) {
      var cursorKey = '';
      var _arr = ['top', 'bottom', 'left', 'right'];

      for (var _i = 0; _i < _arr.length; _i++) {
        var edge = _arr[_i];

        if (edges[edge]) {
          cursorKey += edge;
        }
      }

      result = cursors[cursorKey];
    }

    return result;
  },
  defaultMargin: null
};
var ___default_6 = resize;
_$resize_6["default"] = ___default_6;

var _$index_5 = {};
"use strict";

Object.defineProperty(_$index_5, "__esModule", {
  value: true
});
Object.defineProperty(_$index_5, "drag", {
  enumerable: true,
  get: function get() {
    return ___drag_5["default"];
  }
});
Object.defineProperty(_$index_5, "drop", {
  enumerable: true,
  get: function get() {
    return _index["default"];
  }
});
Object.defineProperty(_$index_5, "gesture", {
  enumerable: true,
  get: function get() {
    return _gesture["default"];
  }
});
Object.defineProperty(_$index_5, "resize", {
  enumerable: true,
  get: function get() {
    return _resize["default"];
  }
});
_$index_5["default"] = void 0;

var ___drag_5 = ___interopRequireDefault_5(_$drag_1);

var _index = ___interopRequireDefault_5(_$index_3);

var _gesture = ___interopRequireDefault_5(_$gesture_4);

var _resize = ___interopRequireDefault_5(_$resize_6);

function ___interopRequireDefault_5(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ___default_5 = {
  id: 'actions',
  install: function install(scope) {
    scope.usePlugin(_gesture["default"]);
    scope.usePlugin(_resize["default"]);
    scope.usePlugin(___drag_5["default"]);
    scope.usePlugin(_index["default"]);
  }
};
_$index_5["default"] = ___default_5;

var _$index_7 = {};
"use strict";

Object.defineProperty(_$index_7, "__esModule", {
  value: true
});
_$index_7["default"] = void 0;
var ___default_7 = {};
_$index_7["default"] = ___default_7;

var _$index_8 = {};
"use strict";

function ___typeof_8(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_8 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_8 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_8(obj); }

Object.defineProperty(_$index_8, "__esModule", {
  value: true
});
_$index_8.getContainer = getContainer;
_$index_8.getScroll = getScroll;
_$index_8.getScrollSize = getScrollSize;
_$index_8.getScrollSizeDelta = getScrollSizeDelta;
_$index_8["default"] = void 0;

var __domUtils_8 = ___interopRequireWildcard_8(_$domUtils_69);

var __is_8 = ___interopRequireWildcard_8(_$is_76);

var ___raf_8 = ___interopRequireDefault_8(_$raf_81);

/* removed: var _$rect_82 = require("@interactjs/utils/rect"); */;

/* removed: var _$window_83 = require("@interactjs/utils/window"); */;

function ___interopRequireDefault_8(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ___getRequireWildcardCache_8() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_8 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_8(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_8(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_8(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function __install_8(scope) {
  var defaults = scope.defaults,
      actions = scope.actions;
  scope.autoScroll = autoScroll;

  autoScroll.now = function () {
    return scope.now();
  };

  actions.phaselessTypes.autoscroll = true;
  defaults.perAction.autoScroll = autoScroll.defaults;
}

var autoScroll = {
  defaults: {
    enabled: false,
    margin: 60,
    // the item that is scrolled (Window or HTMLElement)
    container: null,
    // the scroll speed in pixels per second
    speed: 300
  },
  now: Date.now,
  interaction: null,
  i: 0,
  // the handle returned by window.setInterval
  // Direction each pulse is to scroll in
  x: 0,
  y: 0,
  isScrolling: false,
  prevTime: 0,
  margin: 0,
  speed: 0,
  start: function start(interaction) {
    autoScroll.isScrolling = true;

    ___raf_8["default"].cancel(autoScroll.i);

    interaction.autoScroll = autoScroll;
    autoScroll.interaction = interaction;
    autoScroll.prevTime = autoScroll.now();
    autoScroll.i = ___raf_8["default"].request(autoScroll.scroll);
  },
  stop: function stop() {
    autoScroll.isScrolling = false;

    if (autoScroll.interaction) {
      autoScroll.interaction.autoScroll = null;
    }

    ___raf_8["default"].cancel(autoScroll.i);
  },
  // scroll the window by the values in scroll.x/y
  scroll: function scroll() {
    var interaction = autoScroll.interaction;
    var interactable = interaction.interactable,
        element = interaction.element;
    var actionName = interaction.prepared.name;
    var options = interactable.options[actionName].autoScroll;
    var container = getContainer(options.container, interactable, element);
    var now = autoScroll.now(); // change in time in seconds

    var dt = (now - autoScroll.prevTime) / 1000; // displacement

    var s = options.speed * dt;

    if (s >= 1) {
      var scrollBy = {
        x: autoScroll.x * s,
        y: autoScroll.y * s
      };

      if (scrollBy.x || scrollBy.y) {
        var prevScroll = getScroll(container);

        if (__is_8.window(container)) {
          container.scrollBy(scrollBy.x, scrollBy.y);
        } else if (container) {
          container.scrollLeft += scrollBy.x;
          container.scrollTop += scrollBy.y;
        }

        var curScroll = getScroll(container);
        var delta = {
          x: curScroll.x - prevScroll.x,
          y: curScroll.y - prevScroll.y
        };

        if (delta.x || delta.y) {
          interactable.fire({
            type: 'autoscroll',
            target: element,
            interactable: interactable,
            delta: delta,
            interaction: interaction,
            container: container
          });
        }
      }

      autoScroll.prevTime = now;
    }

    if (autoScroll.isScrolling) {
      ___raf_8["default"].cancel(autoScroll.i);

      autoScroll.i = ___raf_8["default"].request(autoScroll.scroll);
    }
  },
  check: function check(interactable, actionName) {
    var options = interactable.options;
    return options[actionName].autoScroll && options[actionName].autoScroll.enabled;
  },
  onInteractionMove: function onInteractionMove(_ref) {
    var interaction = _ref.interaction,
        pointer = _ref.pointer;

    if (!(interaction.interacting() && autoScroll.check(interaction.interactable, interaction.prepared.name))) {
      return;
    }

    if (interaction.simulation) {
      autoScroll.x = autoScroll.y = 0;
      return;
    }

    var top;
    var right;
    var bottom;
    var left;
    var interactable = interaction.interactable,
        element = interaction.element;
    var actionName = interaction.prepared.name;
    var options = interactable.options[actionName].autoScroll;
    var container = getContainer(options.container, interactable, element);

    if (__is_8.window(container)) {
      left = pointer.clientX < autoScroll.margin;
      top = pointer.clientY < autoScroll.margin;
      right = pointer.clientX > container.innerWidth - autoScroll.margin;
      bottom = pointer.clientY > container.innerHeight - autoScroll.margin;
    } else {
      var rect = __domUtils_8.getElementClientRect(container);
      left = pointer.clientX < rect.left + autoScroll.margin;
      top = pointer.clientY < rect.top + autoScroll.margin;
      right = pointer.clientX > rect.right - autoScroll.margin;
      bottom = pointer.clientY > rect.bottom - autoScroll.margin;
    }

    autoScroll.x = right ? 1 : left ? -1 : 0;
    autoScroll.y = bottom ? 1 : top ? -1 : 0;

    if (!autoScroll.isScrolling) {
      // set the autoScroll properties to those of the target
      autoScroll.margin = options.margin;
      autoScroll.speed = options.speed;
      autoScroll.start(interaction);
    }
  }
};

function getContainer(value, interactable, element) {
  return (__is_8.string(value) ? (0, _$rect_82.getStringOptionResult)(value, interactable, element) : value) || (0, _$window_83.getWindow)(element);
}

function getScroll(container) {
  if (__is_8.window(container)) {
    container = window.document.body;
  }

  return {
    x: container.scrollLeft,
    y: container.scrollTop
  };
}

function getScrollSize(container) {
  if (__is_8.window(container)) {
    container = window.document.body;
  }

  return {
    x: container.scrollWidth,
    y: container.scrollHeight
  };
}

function getScrollSizeDelta(_ref2, func) {
  var interaction = _ref2.interaction,
      element = _ref2.element;
  var scrollOptions = interaction && interaction.interactable.options[interaction.prepared.name].autoScroll;

  if (!scrollOptions || !scrollOptions.enabled) {
    func();
    return {
      x: 0,
      y: 0
    };
  }

  var scrollContainer = getContainer(scrollOptions.container, interaction.interactable, element);
  var prevSize = getScroll(scrollContainer);
  func();
  var curSize = getScroll(scrollContainer);
  return {
    x: curSize.x - prevSize.x,
    y: curSize.y - prevSize.y
  };
}

var autoScrollPlugin = {
  id: 'auto-scroll',
  install: __install_8,
  listeners: {
    'interactions:new': function interactionsNew(_ref3) {
      var interaction = _ref3.interaction;
      interaction.autoScroll = null;
    },
    'interactions:destroy': function interactionsDestroy(_ref4) {
      var interaction = _ref4.interaction;
      interaction.autoScroll = null;
      autoScroll.stop();

      if (autoScroll.interaction) {
        autoScroll.interaction = null;
      }
    },
    'interactions:stop': autoScroll.stop,
    'interactions:action-move': function interactionsActionMove(arg) {
      return autoScroll.onInteractionMove(arg);
    }
  }
};
var ___default_8 = autoScrollPlugin;
_$index_8["default"] = ___default_8;

var _$InteractableMethods_9 = {};
"use strict";

function ___typeof_9(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_9 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_9 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_9(obj); }

Object.defineProperty(_$InteractableMethods_9, "__esModule", {
  value: true
});
_$InteractableMethods_9["default"] = void 0;

/* removed: var _$index_75 = require("@interactjs/utils/index"); */;

var __is_9 = ___interopRequireWildcard_9(_$is_76);

function ___getRequireWildcardCache_9() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_9 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_9(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_9(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_9(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function __install_9(scope) {
  var Interactable = scope.Interactable;

  Interactable.prototype.getAction = function getAction(pointer, event, interaction, element) {
    var action = defaultActionChecker(this, event, interaction, element, scope);

    if (this.options.actionChecker) {
      return this.options.actionChecker(pointer, event, action, this, element, interaction);
    }

    return action;
  };
  /**
   * ```js
   * interact(element, { ignoreFrom: document.getElementById('no-action') })
   * // or
   * interact(element).ignoreFrom('input, textarea, a')
   * ```
   * @deprecated
   * If the target of the `mousedown`, `pointerdown` or `touchstart` event or any
   * of it's parents match the given CSS selector or Element, no
   * drag/resize/gesture is started.
   *
   * Don't use this method. Instead set the `ignoreFrom` option for each action
   * or for `pointerEvents`
   *
   * @example
   * interact(targett)
   *   .draggable({
   *     ignoreFrom: 'input, textarea, a[href]'',
   *   })
   *   .pointerEvents({
   *     ignoreFrom: '[no-pointer]',
   *   })
   *
   * @param {string | Element | null} [newValue] a CSS selector string, an
   * Element or `null` to not ignore any elements
   * @return {string | Element | object} The current ignoreFrom value or this
   * Interactable
   */


  Interactable.prototype.ignoreFrom = (0, _$index_75.warnOnce)(function (newValue) {
    return this._backCompatOption('ignoreFrom', newValue);
  }, 'Interactable.ignoreFrom() has been deprecated. Use Interactble.draggable({ignoreFrom: newValue}).');
  /**
   * @deprecated
   *
   * A drag/resize/gesture is started only If the target of the `mousedown`,
   * `pointerdown` or `touchstart` event or any of it's parents match the given
   * CSS selector or Element.
   *
   * Don't use this method. Instead set the `allowFrom` option for each action
   * or for `pointerEvents`
   *
   * @example
   * interact(targett)
   *   .resizable({
   *     allowFrom: '.resize-handle',
   *   .pointerEvents({
   *     allowFrom: '.handle',,
   *   })
   *
   * @param {string | Element | null} [newValue] a CSS selector string, an
   * Element or `null` to allow from any element
   * @return {string | Element | object} The current allowFrom value or this
   * Interactable
   */

  Interactable.prototype.allowFrom = (0, _$index_75.warnOnce)(function (newValue) {
    return this._backCompatOption('allowFrom', newValue);
  }, 'Interactable.allowFrom() has been deprecated. Use Interactble.draggable({allowFrom: newValue}).');
  /**
   * ```js
   * interact('.resize-drag')
   *   .resizable(true)
   *   .draggable(true)
   *   .actionChecker(function (pointer, event, action, interactable, element, interaction) {
   *
   *   if (interact.matchesSelector(event.target, '.drag-handle')) {
   *     // force drag with handle target
   *     action.name = drag
   *   }
   *   else {
   *     // resize from the top and right edges
   *     action.name  = 'resize'
   *     action.edges = { top: true, right: true }
   *   }
   *
   *   return action
   * })
   * ```
   *
   * Returns or sets the function used to check action to be performed on
   * pointerDown
   *
   * @param {function | null} [checker] A function which takes a pointer event,
   * defaultAction string, interactable, element and interaction as parameters
   * and returns an object with name property 'drag' 'resize' or 'gesture' and
   * optionally an `edges` object with boolean 'top', 'left', 'bottom' and right
   * props.
   * @return {Function | Interactable} The checker function or this Interactable
   */

  Interactable.prototype.actionChecker = actionChecker;
  /**
   * Returns or sets whether the the cursor should be changed depending on the
   * action that would be performed if the mouse were pressed and dragged.
   *
   * @param {boolean} [newValue]
   * @return {boolean | Interactable} The current setting or this Interactable
   */

  Interactable.prototype.styleCursor = styleCursor;
}

function defaultActionChecker(interactable, event, interaction, element, scope) {
  var rect = interactable.getRect(element);
  var buttons = event.buttons || {
    0: 1,
    1: 4,
    3: 8,
    4: 16
  }[event.button];
  var arg = {
    action: null,
    interactable: interactable,
    interaction: interaction,
    element: element,
    rect: rect,
    buttons: buttons
  };
  scope.fire('auto-start:check', arg);
  return arg.action;
}

function styleCursor(newValue) {
  if (__is_9.bool(newValue)) {
    this.options.styleCursor = newValue;
    return this;
  }

  if (newValue === null) {
    delete this.options.styleCursor;
    return this;
  }

  return this.options.styleCursor;
}

function actionChecker(checker) {
  if (__is_9.func(checker)) {
    this.options.actionChecker = checker;
    return this;
  }

  if (checker === null) {
    delete this.options.actionChecker;
    return this;
  }

  return this.options.actionChecker;
}

var ___default_9 = {
  id: 'auto-start/interactableMethods',
  install: __install_9
};
_$InteractableMethods_9["default"] = ___default_9;

var _$base_10 = {};
"use strict";

function ___typeof_10(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_10 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_10 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_10(obj); }

Object.defineProperty(_$base_10, "__esModule", {
  value: true
});
_$base_10["default"] = void 0;

var __utils_10 = ___interopRequireWildcard_10(_$index_75);

var _InteractableMethods = ___interopRequireDefault_10(_$InteractableMethods_9);

function ___interopRequireDefault_10(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ___getRequireWildcardCache_10() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_10 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_10(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_10(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_10(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function __install_10(scope) {
  var interact = scope.interactStatic,
      defaults = scope.defaults;
  scope.usePlugin(_InteractableMethods["default"]);
  defaults.base.actionChecker = null;
  defaults.base.styleCursor = true;
  __utils_10.extend(defaults.perAction, {
    manualStart: false,
    max: Infinity,
    maxPerElement: 1,
    allowFrom: null,
    ignoreFrom: null,
    // only allow left button by default
    // see https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/buttons#Return_value
    mouseButtons: 1
  });
  /**
   * Returns or sets the maximum number of concurrent interactions allowed.  By
   * default only 1 interaction is allowed at a time (for backwards
   * compatibility). To allow multiple interactions on the same Interactables and
   * elements, you need to enable it in the draggable, resizable and gesturable
   * `'max'` and `'maxPerElement'` options.
   *
   * @alias module:interact.maxInteractions
   *
   * @param {number} [newValue] Any number. newValue <= 0 means no interactions.
   */

  interact.maxInteractions = function (newValue) {
    return maxInteractions(newValue, scope);
  };

  scope.autoStart = {
    // Allow this many interactions to happen simultaneously
    maxInteractions: Infinity,
    withinInteractionLimit: withinInteractionLimit,
    cursorElement: null
  };
}

function prepareOnDown(_ref, scope) {
  var interaction = _ref.interaction,
      pointer = _ref.pointer,
      event = _ref.event,
      eventTarget = _ref.eventTarget;

  if (interaction.interacting()) {
    return;
  }

  var actionInfo = getActionInfo(interaction, pointer, event, eventTarget, scope);
  prepare(interaction, actionInfo, scope);
}

function prepareOnMove(_ref2, scope) {
  var interaction = _ref2.interaction,
      pointer = _ref2.pointer,
      event = _ref2.event,
      eventTarget = _ref2.eventTarget;

  if (interaction.pointerType !== 'mouse' || interaction.pointerIsDown || interaction.interacting()) {
    return;
  }

  var actionInfo = getActionInfo(interaction, pointer, event, eventTarget, scope);
  prepare(interaction, actionInfo, scope);
}

function startOnMove(arg, scope) {
  var interaction = arg.interaction;

  if (!interaction.pointerIsDown || interaction.interacting() || !interaction.pointerWasMoved || !interaction.prepared.name) {
    return;
  }

  scope.fire('autoStart:before-start', arg);
  var interactable = interaction.interactable;
  var actionName = interaction.prepared.name;

  if (actionName && interactable) {
    // check manualStart and interaction limit
    if (interactable.options[actionName].manualStart || !withinInteractionLimit(interactable, interaction.element, interaction.prepared, scope)) {
      interaction.stop();
    } else {
      interaction.start(interaction.prepared, interactable, interaction.element);
      setInteractionCursor(interaction, scope);
    }
  }
}

function clearCursorOnStop(_ref3, scope) {
  var interaction = _ref3.interaction;
  var interactable = interaction.interactable;

  if (interactable && interactable.options.styleCursor) {
    setCursor(interaction.element, '', scope);
  }
} // Check if the current interactable supports the action.
// If so, return the validated action. Otherwise, return null


function validateAction(action, interactable, element, eventTarget, scope) {
  if (interactable.testIgnoreAllow(interactable.options[action.name], element, eventTarget) && interactable.options[action.name].enabled && withinInteractionLimit(interactable, element, action, scope)) {
    return action;
  }

  return null;
}

function validateMatches(interaction, pointer, event, matches, matchElements, eventTarget, scope) {
  for (var i = 0, len = matches.length; i < len; i++) {
    var match = matches[i];
    var matchElement = matchElements[i];
    var matchAction = match.getAction(pointer, event, interaction, matchElement);

    if (!matchAction) {
      continue;
    }

    var action = validateAction(matchAction, match, matchElement, eventTarget, scope);

    if (action) {
      return {
        action: action,
        interactable: match,
        element: matchElement
      };
    }
  }

  return {
    action: null,
    interactable: null,
    element: null
  };
}

function getActionInfo(interaction, pointer, event, eventTarget, scope) {
  var matches = [];
  var matchElements = [];
  var element = eventTarget;

  function pushMatches(interactable) {
    matches.push(interactable);
    matchElements.push(element);
  }

  while (__utils_10.is.element(element)) {
    matches = [];
    matchElements = [];
    scope.interactables.forEachMatch(element, pushMatches);
    var actionInfo = validateMatches(interaction, pointer, event, matches, matchElements, eventTarget, scope);

    if (actionInfo.action && !actionInfo.interactable.options[actionInfo.action.name].manualStart) {
      return actionInfo;
    }

    element = __utils_10.dom.parentNode(element);
  }

  return {
    action: null,
    interactable: null,
    element: null
  };
}

function prepare(interaction, _ref4, scope) {
  var action = _ref4.action,
      interactable = _ref4.interactable,
      element = _ref4.element;
  action = action || {
    name: null
  };
  interaction.interactable = interactable;
  interaction.element = element;
  __utils_10.copyAction(interaction.prepared, action);
  interaction.rect = interactable && action.name ? interactable.getRect(element) : null;
  setInteractionCursor(interaction, scope);
  scope.fire('autoStart:prepared', {
    interaction: interaction
  });
}

function withinInteractionLimit(interactable, element, action, scope) {
  var options = interactable.options;
  var maxActions = options[action.name].max;
  var maxPerElement = options[action.name].maxPerElement;
  var autoStartMax = scope.autoStart.maxInteractions;
  var activeInteractions = 0;
  var interactableCount = 0;
  var elementCount = 0; // no actions if any of these values == 0

  if (!(maxActions && maxPerElement && autoStartMax)) {
    return false;
  }

  for (var _i = 0; _i < scope.interactions.list.length; _i++) {
    var _ref5;

    _ref5 = scope.interactions.list[_i];
    var interaction = _ref5;
    var otherAction = interaction.prepared.name;

    if (!interaction.interacting()) {
      continue;
    }

    activeInteractions++;

    if (activeInteractions >= autoStartMax) {
      return false;
    }

    if (interaction.interactable !== interactable) {
      continue;
    }

    interactableCount += otherAction === action.name ? 1 : 0;

    if (interactableCount >= maxActions) {
      return false;
    }

    if (interaction.element === element) {
      elementCount++;

      if (otherAction === action.name && elementCount >= maxPerElement) {
        return false;
      }
    }
  }

  return autoStartMax > 0;
}

function maxInteractions(newValue, scope) {
  if (__utils_10.is.number(newValue)) {
    scope.autoStart.maxInteractions = newValue;
    return this;
  }

  return scope.autoStart.maxInteractions;
}

function setCursor(element, cursor, scope) {
  var prevCursorElement = scope.autoStart.cursorElement;

  if (prevCursorElement && prevCursorElement !== element) {
    prevCursorElement.style.cursor = '';
  }

  element.ownerDocument.documentElement.style.cursor = cursor;
  element.style.cursor = cursor;
  scope.autoStart.cursorElement = cursor ? element : null;
}

function setInteractionCursor(interaction, scope) {
  var interactable = interaction.interactable,
      element = interaction.element,
      prepared = interaction.prepared;

  if (!(interaction.pointerType === 'mouse' && interactable && interactable.options.styleCursor)) {
    // clear previous target element cursor
    if (scope.autoStart.cursorElement) {
      setCursor(scope.autoStart.cursorElement, '', scope);
    }

    return;
  }

  var cursor = '';

  if (prepared.name) {
    var cursorChecker = interactable.options[prepared.name].cursorChecker;

    if (__utils_10.is.func(cursorChecker)) {
      cursor = cursorChecker(prepared, interactable, element, interaction._interacting);
    } else {
      cursor = scope.actions.map[prepared.name].getCursor(prepared);
    }
  }

  setCursor(interaction.element, cursor || '', scope);
}

var autoStart = {
  id: 'auto-start/base',
  before: ['actions', 'actions/drag', 'actions/resize', 'actions/gesture'],
  install: __install_10,
  listeners: {
    'interactions:down': prepareOnDown,
    'interactions:move': function interactionsMove(arg, scope) {
      prepareOnMove(arg, scope);
      startOnMove(arg, scope);
    },
    'interactions:stop': clearCursorOnStop
  },
  maxInteractions: maxInteractions,
  withinInteractionLimit: withinInteractionLimit,
  validateAction: validateAction
};
var ___default_10 = autoStart;
_$base_10["default"] = ___default_10;

var _$dragAxis_11 = {};
"use strict";

function ___typeof_11(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_11 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_11 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_11(obj); }

Object.defineProperty(_$dragAxis_11, "__esModule", {
  value: true
});
_$dragAxis_11["default"] = void 0;

/* removed: var _$domUtils_69 = require("@interactjs/utils/domUtils"); */;

var __is_11 = ___interopRequireWildcard_11(_$is_76);

var _base = ___interopRequireDefault_11(_$base_10);

function ___interopRequireDefault_11(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ___getRequireWildcardCache_11() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_11 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_11(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_11(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_11(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function beforeStart(_ref, scope) {
  var interaction = _ref.interaction,
      eventTarget = _ref.eventTarget,
      dx = _ref.dx,
      dy = _ref.dy;

  if (interaction.prepared.name !== 'drag') {
    return;
  } // check if a drag is in the correct axis


  var absX = Math.abs(dx);
  var absY = Math.abs(dy);
  var targetOptions = interaction.interactable.options.drag;
  var startAxis = targetOptions.startAxis;
  var currentAxis = absX > absY ? 'x' : absX < absY ? 'y' : 'xy';
  interaction.prepared.axis = targetOptions.lockAxis === 'start' ? currentAxis[0] // always lock to one axis even if currentAxis === 'xy'
  : targetOptions.lockAxis; // if the movement isn't in the startAxis of the interactable

  if (currentAxis !== 'xy' && startAxis !== 'xy' && startAxis !== currentAxis) {
    // cancel the prepared action
    interaction.prepared.name = null; // then try to get a drag from another ineractable

    var element = eventTarget;

    var getDraggable = function getDraggable(interactable) {
      if (interactable === interaction.interactable) {
        return;
      }

      var options = interaction.interactable.options.drag;

      if (!options.manualStart && interactable.testIgnoreAllow(options, element, eventTarget)) {
        var action = interactable.getAction(interaction.downPointer, interaction.downEvent, interaction, element);

        if (action && action.name === 'drag' && checkStartAxis(currentAxis, interactable) && _base["default"].validateAction(action, interactable, element, eventTarget, scope)) {
          return interactable;
        }
      }
    }; // check all interactables


    while (__is_11.element(element)) {
      var interactable = scope.interactables.forEachMatch(element, getDraggable);

      if (interactable) {
        interaction.prepared.name = 'drag';
        interaction.interactable = interactable;
        interaction.element = element;
        break;
      }

      element = (0, _$domUtils_69.parentNode)(element);
    }
  }
}

function checkStartAxis(startAxis, interactable) {
  if (!interactable) {
    return false;
  }

  var thisAxis = interactable.options.drag.startAxis;
  return startAxis === 'xy' || thisAxis === 'xy' || thisAxis === startAxis;
}

var ___default_11 = {
  id: 'auto-start/dragAxis',
  listeners: {
    'autoStart:before-start': beforeStart
  }
};
_$dragAxis_11["default"] = ___default_11;

var _$hold_12 = {};
"use strict";

Object.defineProperty(_$hold_12, "__esModule", {
  value: true
});
_$hold_12["default"] = void 0;

var ___base_12 = ___interopRequireDefault_12(_$base_10);

function ___interopRequireDefault_12(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function __install_12(scope) {
  var defaults = scope.defaults;
  scope.usePlugin(___base_12["default"]);
  defaults.perAction.hold = 0;
  defaults.perAction.delay = 0;
}

function getHoldDuration(interaction) {
  var actionName = interaction.prepared && interaction.prepared.name;

  if (!actionName) {
    return null;
  }

  var options = interaction.interactable.options;
  return options[actionName].hold || options[actionName].delay;
}

var ___default_12 = {
  id: 'auto-start/hold',
  install: __install_12,
  listeners: {
    'interactions:new': function interactionsNew(_ref) {
      var interaction = _ref.interaction;
      interaction.autoStartHoldTimer = null;
    },
    'autoStart:prepared': function autoStartPrepared(_ref2) {
      var interaction = _ref2.interaction;
      var hold = getHoldDuration(interaction);

      if (hold > 0) {
        interaction.autoStartHoldTimer = setTimeout(function () {
          interaction.start(interaction.prepared, interaction.interactable, interaction.element);
        }, hold);
      }
    },
    'interactions:move': function interactionsMove(_ref3) {
      var interaction = _ref3.interaction,
          duplicate = _ref3.duplicate;

      if (interaction.pointerWasMoved && !duplicate) {
        clearTimeout(interaction.autoStartHoldTimer);
      }
    },
    // prevent regular down->move autoStart
    'autoStart:before-start': function autoStartBeforeStart(_ref4) {
      var interaction = _ref4.interaction;
      var hold = getHoldDuration(interaction);

      if (hold > 0) {
        interaction.prepared.name = null;
      }
    }
  },
  getHoldDuration: getHoldDuration
};
_$hold_12["default"] = ___default_12;

var _$index_13 = {};
"use strict";

Object.defineProperty(_$index_13, "__esModule", {
  value: true
});
Object.defineProperty(_$index_13, "autoStart", {
  enumerable: true,
  get: function get() {
    return ___base_13["default"];
  }
});
Object.defineProperty(_$index_13, "dragAxis", {
  enumerable: true,
  get: function get() {
    return _dragAxis["default"];
  }
});
Object.defineProperty(_$index_13, "hold", {
  enumerable: true,
  get: function get() {
    return _hold["default"];
  }
});
_$index_13["default"] = void 0;

var ___base_13 = ___interopRequireDefault_13(_$base_10);

var _dragAxis = ___interopRequireDefault_13(_$dragAxis_11);

var _hold = ___interopRequireDefault_13(_$hold_12);

function ___interopRequireDefault_13(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var ___default_13 = {
  id: 'auto-start',
  install: function install(scope) {
    scope.usePlugin(___base_13["default"]);
    scope.usePlugin(_hold["default"]);
    scope.usePlugin(_dragAxis["default"]);
  }
};
_$index_13["default"] = ___default_13;

var _$index_14 = {};
"use strict";

Object.defineProperty(_$index_14, "__esModule", {
  value: true
});
_$index_14["default"] = void 0;
var ___default_14 = {};
_$index_14["default"] = ___default_14;

var _$index_15 = {};
"use strict";

Object.defineProperty(_$index_15, "__esModule", {
  value: true
});
_$index_15["default"] = void 0;
var ___default_15 = {};
_$index_15["default"] = ___default_15;

var _$index_29 = {};
"use strict";

function ___typeof_29(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_29 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_29 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_29(obj); }

Object.defineProperty(_$index_29, "__esModule", {
  value: true
});
_$index_29["default"] = void 0;

var ___domObjects_29 = ___interopRequireDefault_29(_$domObjects_68);

/* removed: var _$domUtils_69 = require("@interactjs/utils/domUtils"); */;

var ___extend_29 = ___interopRequireDefault_29(_$extend_72);

var __is_29 = ___interopRequireWildcard_29(_$is_76);

var ___window_29 = ___interopRequireDefault_29(_$window_83);

function ___getRequireWildcardCache_29() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_29 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_29(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_29(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_29(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___interopRequireDefault_29(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ___toConsumableArray_29(arr) { return ___arrayWithoutHoles_29(arr) || ___iterableToArray_29(arr) || ___nonIterableSpread_29(); }

function ___nonIterableSpread_29() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function ___iterableToArray_29(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function ___arrayWithoutHoles_29(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var CheckName;

(function (CheckName) {
  CheckName["touchAction"] = "touchAction";
  CheckName["boxSizing"] = "boxSizing";
  CheckName["noListeners"] = "noListeners";
})(CheckName || (CheckName = {}));

var prefix = '[interact.js] ';
var links = {
  touchAction: 'https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action',
  boxSizing: 'https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing'
};
var isProduction = "production" === 'production'; // eslint-disable-next-line no-restricted-syntax

function __install_29(scope) {
  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
      logger = _ref.logger;

  var Interactable = scope.Interactable,
      defaults = scope.defaults;
  scope.logger = logger || console;
  defaults.base.devTools = {
    ignore: {}
  };

  Interactable.prototype.devTools = function (options) {
    if (options) {
      (0, ___extend_29["default"])(this.options.devTools, options);
      return this;
    }

    return this.options.devTools;
  };
}

var checks = [{
  name: CheckName.touchAction,
  perform: function perform(_ref2) {
    var element = _ref2.element;
    return !parentHasStyle(element, 'touchAction', /pan-|pinch|none/);
  },
  getInfo: function getInfo(_ref3) {
    var element = _ref3.element;
    return [element, links.touchAction];
  },
  text: 'Consider adding CSS "touch-action: none" to this element\n'
}, {
  name: CheckName.boxSizing,
  perform: function perform(interaction) {
    var element = interaction.element;
    return interaction.prepared.name === 'resize' && element instanceof ___domObjects_29["default"].HTMLElement && !hasStyle(element, 'boxSizing', /border-box/);
  },
  text: 'Consider adding CSS "box-sizing: border-box" to this resizable element',
  getInfo: function getInfo(_ref4) {
    var element = _ref4.element;
    return [element, links.boxSizing];
  }
}, {
  name: CheckName.noListeners,
  perform: function perform(interaction) {
    var actionName = interaction.prepared.name;
    var moveListeners = interaction.interactable.events.types["".concat(actionName, "move")] || [];
    return !moveListeners.length;
  },
  getInfo: function getInfo(interaction) {
    return [interaction.prepared.name, interaction.interactable];
  },
  text: 'There are no listeners set for this action'
}];

function hasStyle(element, prop, styleRe) {
  return styleRe.test(element.style[prop] || ___window_29["default"].window.getComputedStyle(element)[prop]);
}

function parentHasStyle(element, prop, styleRe) {
  var parent = element;

  while (__is_29.element(parent)) {
    if (hasStyle(parent, prop, styleRe)) {
      return true;
    }

    parent = (0, _$domUtils_69.parentNode)(parent);
  }

  return false;
}

var id = 'dev-tools';
var defaultExport = isProduction ? {
  id: id,
  install: function install() {}
} : {
  id: id,
  install: __install_29,
  listeners: {
    'interactions:action-start': function interactionsActionStart(_ref5, scope) {
      var interaction = _ref5.interaction;

      for (var _i = 0; _i < checks.length; _i++) {
        var _ref6;

        _ref6 = checks[_i];
        var check = _ref6;
        var options = interaction.interactable && interaction.interactable.options;

        if (!(options && options.devTools && options.devTools.ignore[check.name]) && check.perform(interaction)) {
          var _scope$logger;

          (_scope$logger = scope.logger).warn.apply(_scope$logger, [prefix + check.text].concat(___toConsumableArray_29(check.getInfo(interaction))));
        }
      }
    }
  },
  checks: checks,
  CheckName: CheckName,
  links: links,
  prefix: prefix
};
var ___default_29 = defaultExport;
_$index_29["default"] = ___default_29;

var _$index_30 = {};
"use strict";

Object.defineProperty(_$index_30, "__esModule", {
  value: true
});
_$index_30["default"] = void 0;
var ___default_30 = {};
_$index_30["default"] = ___default_30;

var _$Modification_34 = {};
"use strict";

function ___typeof_34(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_34 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_34 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_34(obj); }

Object.defineProperty(_$Modification_34, "__esModule", {
  value: true
});
_$Modification_34.getRectOffset = getRectOffset;
_$Modification_34["default"] = void 0;

var ___clone_34 = ___interopRequireDefault_34(_$clone_66);

var ___extend_34 = ___interopRequireDefault_34(_$extend_72);

var rectUtils = ___interopRequireWildcard_34(_$rect_82);

function ___getRequireWildcardCache_34() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_34 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_34(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_34(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_34(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___interopRequireDefault_34(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ___slicedToArray_34(arr, i) { return ___arrayWithHoles_34(arr) || ___iterableToArrayLimit_34(arr, i) || ___nonIterableRest_34(); }

function ___nonIterableRest_34() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function ___iterableToArrayLimit_34(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function ___arrayWithHoles_34(arr) { if (Array.isArray(arr)) return arr; }

function ___classCallCheck_34(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ___defineProperties_34(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ___createClass_34(Constructor, protoProps, staticProps) { if (protoProps) ___defineProperties_34(Constructor.prototype, protoProps); if (staticProps) ___defineProperties_34(Constructor, staticProps); return Constructor; }

function ___defineProperty_34(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Modification = /*#__PURE__*/function () {
  function Modification(interaction) {
    ___classCallCheck_34(this, Modification);

    this.interaction = interaction;

    ___defineProperty_34(this, "states", []);

    ___defineProperty_34(this, "startOffset", {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    });

    ___defineProperty_34(this, "startDelta", null);

    ___defineProperty_34(this, "result", null);

    ___defineProperty_34(this, "endResult", null);

    ___defineProperty_34(this, "edges", void 0);

    this.result = createResult();
  }

  ___createClass_34(Modification, [{
    key: "start",
    value: function start(_ref, pageCoords) {
      var phase = _ref.phase;
      var interaction = this.interaction;
      var modifierList = getModifierList(interaction);
      this.prepareStates(modifierList);
      this.edges = (0, ___extend_34["default"])({}, interaction.edges);
      this.startOffset = getRectOffset(interaction.rect, pageCoords);
      this.startDelta = {
        x: 0,
        y: 0
      };
      var arg = {
        phase: phase,
        pageCoords: pageCoords,
        preEnd: false
      };
      this.result = createResult();
      this.startAll(arg);
      var result = this.result = this.setAll(arg);
      return result;
    }
  }, {
    key: "fillArg",
    value: function fillArg(arg) {
      var interaction = this.interaction;
      arg.interaction = interaction;
      arg.interactable = interaction.interactable;
      arg.element = interaction.element;
      arg.rect = arg.rect || interaction.rect;
      arg.edges = this.edges;
      arg.startOffset = this.startOffset;
    }
  }, {
    key: "startAll",
    value: function startAll(arg) {
      this.fillArg(arg);

      for (var _i = 0; _i < this.states.length; _i++) {
        var _ref2;

        _ref2 = this.states[_i];
        var state = _ref2;

        if (state.methods.start) {
          arg.state = state;
          state.methods.start(arg);
        }
      }
    }
  }, {
    key: "setAll",
    value: function setAll(arg) {
      this.fillArg(arg);
      var phase = arg.phase,
          preEnd = arg.preEnd,
          skipModifiers = arg.skipModifiers,
          unmodifiedRect = arg.rect;
      arg.coords = (0, ___extend_34["default"])({}, arg.pageCoords);
      arg.rect = (0, ___extend_34["default"])({}, unmodifiedRect);
      var states = skipModifiers ? this.states.slice(skipModifiers) : this.states;
      var newResult = createResult(arg.coords, arg.rect);

      for (var _i2 = 0; _i2 < states.length; _i2++) {
        var _ref3;

        _ref3 = states[_i2];
        var state = _ref3;
        var options = state.options;
        var lastModifierCoords = (0, ___extend_34["default"])({}, arg.coords);
        var returnValue = null;

        if (state.methods.set && this.shouldDo(options, preEnd, phase)) {
          arg.state = state;
          returnValue = state.methods.set(arg);
          rectUtils.addEdges(this.interaction.edges, arg.rect, {
            x: arg.coords.x - lastModifierCoords.x,
            y: arg.coords.y - lastModifierCoords.y
          });
        }

        newResult.eventProps.push(returnValue);
      }

      newResult.delta.x = arg.coords.x - arg.pageCoords.x;
      newResult.delta.y = arg.coords.y - arg.pageCoords.y;
      newResult.rectDelta.left = arg.rect.left - unmodifiedRect.left;
      newResult.rectDelta.right = arg.rect.right - unmodifiedRect.right;
      newResult.rectDelta.top = arg.rect.top - unmodifiedRect.top;
      newResult.rectDelta.bottom = arg.rect.bottom - unmodifiedRect.bottom;
      var prevCoords = this.result.coords;
      var prevRect = this.result.rect;

      if (prevCoords && prevRect) {
        var rectChanged = newResult.rect.left !== prevRect.left || newResult.rect.right !== prevRect.right || newResult.rect.top !== prevRect.top || newResult.rect.bottom !== prevRect.bottom;
        newResult.changed = rectChanged || prevCoords.x !== newResult.coords.x || prevCoords.y !== newResult.coords.y;
      }

      return newResult;
    }
  }, {
    key: "applyToInteraction",
    value: function applyToInteraction(arg) {
      var interaction = this.interaction;
      var phase = arg.phase;
      var curCoords = interaction.coords.cur;
      var startCoords = interaction.coords.start;
      var result = this.result,
          startDelta = this.startDelta;
      var curDelta = result.delta;

      if (phase === 'start') {
        (0, ___extend_34["default"])(this.startDelta, result.delta);
      }

      for (var _i3 = 0; _i3 < [[startCoords, startDelta], [curCoords, curDelta]].length; _i3++) {
        var _ref4;

        _ref4 = [[startCoords, startDelta], [curCoords, curDelta]][_i3];

        var _ref5 = _ref4,
            _ref6 = ___slicedToArray_34(_ref5, 2),
            coordsSet = _ref6[0],
            delta = _ref6[1];

        coordsSet.page.x += delta.x;
        coordsSet.page.y += delta.y;
        coordsSet.client.x += delta.x;
        coordsSet.client.y += delta.y;
      }

      var rectDelta = this.result.rectDelta;
      var rect = arg.rect || interaction.rect;
      rect.left += rectDelta.left;
      rect.right += rectDelta.right;
      rect.top += rectDelta.top;
      rect.bottom += rectDelta.bottom;
      rect.width = rect.right - rect.left;
      rect.height = rect.bottom - rect.top;
    }
  }, {
    key: "setAndApply",
    value: function setAndApply(arg) {
      var interaction = this.interaction;
      var phase = arg.phase,
          preEnd = arg.preEnd,
          skipModifiers = arg.skipModifiers;
      var result = this.setAll({
        preEnd: preEnd,
        phase: phase,
        pageCoords: arg.modifiedCoords || interaction.coords.cur.page
      });
      this.result = result; // don't fire an action move if a modifier would keep the event in the same
      // cordinates as before

      if (!result.changed && (!skipModifiers || skipModifiers < this.states.length) && interaction.interacting()) {
        return false;
      }

      if (arg.modifiedCoords) {
        var page = interaction.coords.cur.page;
        var adjustment = {
          x: arg.modifiedCoords.x - page.x,
          y: arg.modifiedCoords.y - page.y
        };
        result.coords.x += adjustment.x;
        result.coords.y += adjustment.y;
        result.delta.x += adjustment.x;
        result.delta.y += adjustment.y;
      }

      this.applyToInteraction(arg);
    }
  }, {
    key: "beforeEnd",
    value: function beforeEnd(arg) {
      var interaction = arg.interaction,
          event = arg.event;
      var states = this.states;

      if (!states || !states.length) {
        return;
      }

      var doPreend = false;

      for (var _i4 = 0; _i4 < states.length; _i4++) {
        var _ref7;

        _ref7 = states[_i4];
        var state = _ref7;
        arg.state = state;
        var options = state.options,
            methods = state.methods;
        var endPosition = methods.beforeEnd && methods.beforeEnd(arg);

        if (endPosition) {
          this.endResult = endPosition;
          return false;
        }

        doPreend = doPreend || !doPreend && this.shouldDo(options, true, arg.phase, true);
      }

      if (doPreend) {
        // trigger a final modified move before ending
        interaction.move({
          event: event,
          preEnd: true
        });
      }
    }
  }, {
    key: "stop",
    value: function stop(arg) {
      var interaction = arg.interaction;

      if (!this.states || !this.states.length) {
        return;
      }

      var modifierArg = (0, ___extend_34["default"])({
        states: this.states,
        interactable: interaction.interactable,
        element: interaction.element,
        rect: null
      }, arg);
      this.fillArg(modifierArg);

      for (var _i5 = 0; _i5 < this.states.length; _i5++) {
        var _ref8;

        _ref8 = this.states[_i5];
        var state = _ref8;
        modifierArg.state = state;

        if (state.methods.stop) {
          state.methods.stop(modifierArg);
        }
      }

      this.states = null;
      this.endResult = null;
    }
  }, {
    key: "prepareStates",
    value: function prepareStates(modifierList) {
      this.states = [];

      for (var index = 0; index < modifierList.length; index++) {
        var _modifierList$index = modifierList[index],
            options = _modifierList$index.options,
            methods = _modifierList$index.methods,
            name = _modifierList$index.name;

        if (options && options.enabled === false) {
          continue;
        }

        this.states.push({
          options: options,
          methods: methods,
          index: index,
          name: name
        });
      }

      return this.states;
    }
  }, {
    key: "restoreInteractionCoords",
    value: function restoreInteractionCoords(_ref9) {
      var _ref9$interaction = _ref9.interaction,
          coords = _ref9$interaction.coords,
          rect = _ref9$interaction.rect,
          modification = _ref9$interaction.modification;

      if (!modification.result) {
        return;
      }

      var startDelta = modification.startDelta;
      var _modification$result = modification.result,
          curDelta = _modification$result.delta,
          rectDelta = _modification$result.rectDelta;
      var coordsAndDeltas = [[coords.start, startDelta], [coords.cur, curDelta]];

      for (var _i6 = 0; _i6 < coordsAndDeltas.length; _i6++) {
        var _ref10;

        _ref10 = coordsAndDeltas[_i6];

        var _ref11 = _ref10,
            _ref12 = ___slicedToArray_34(_ref11, 2),
            coordsSet = _ref12[0],
            delta = _ref12[1];

        coordsSet.page.x -= delta.x;
        coordsSet.page.y -= delta.y;
        coordsSet.client.x -= delta.x;
        coordsSet.client.y -= delta.y;
      }

      rect.left -= rectDelta.left;
      rect.right -= rectDelta.right;
      rect.top -= rectDelta.top;
      rect.bottom -= rectDelta.bottom;
    }
  }, {
    key: "shouldDo",
    value: function shouldDo(options, preEnd, phase, requireEndOnly) {
      if ( // ignore disabled modifiers
      !options || options.enabled === false || // check if we require endOnly option to fire move before end
      requireEndOnly && !options.endOnly || // don't apply endOnly modifiers when not ending
      options.endOnly && !preEnd || // check if modifier should run be applied on start
      phase === 'start' && !options.setStart) {
        return false;
      }

      return true;
    }
  }, {
    key: "copyFrom",
    value: function copyFrom(other) {
      this.startOffset = other.startOffset;
      this.startDelta = other.startDelta;
      this.edges = other.edges;
      this.states = other.states.map(function (s) {
        return (0, ___clone_34["default"])(s);
      });
      this.result = createResult((0, ___extend_34["default"])({}, other.result.coords), (0, ___extend_34["default"])({}, other.result.rect));
    }
  }, {
    key: "destroy",
    value: function destroy() {
      for (var prop in this) {
        this[prop] = null;
      }
    }
  }]);

  return Modification;
}();

_$Modification_34["default"] = Modification;

function createResult(coords, rect) {
  return {
    rect: rect,
    coords: coords,
    delta: {
      x: 0,
      y: 0
    },
    rectDelta: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    },
    eventProps: [],
    changed: true
  };
}

function getModifierList(interaction) {
  var actionOptions = interaction.interactable.options[interaction.prepared.name];
  var actionModifiers = actionOptions.modifiers;

  if (actionModifiers && actionModifiers.length) {
    return actionModifiers.filter(function (modifier) {
      return !modifier.options || modifier.options.enabled !== false;
    });
  }

  return ['snap', 'snapSize', 'snapEdges', 'restrict', 'restrictEdges', 'restrictSize'].map(function (type) {
    var options = actionOptions[type];
    return options && options.enabled && {
      options: options,
      methods: options._methods
    };
  }).filter(function (m) {
    return !!m;
  });
}

function getRectOffset(rect, coords) {
  return rect ? {
    left: coords.x - rect.left,
    top: coords.y - rect.top,
    right: rect.right - coords.x,
    bottom: rect.bottom - coords.y
  } : {
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  };
}

var _$base_38 = {};
"use strict";

Object.defineProperty(_$base_38, "__esModule", {
  value: true
});
_$base_38.makeModifier = makeModifier;
_$base_38.addEventModifiers = addEventModifiers;
_$base_38["default"] = void 0;

var _Modification = ___interopRequireDefault_38(_$Modification_34);

function ___interopRequireDefault_38(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function makeModifier(module, name) {
  var defaults = module.defaults;
  var methods = {
    start: module.start,
    set: module.set,
    beforeEnd: module.beforeEnd,
    stop: module.stop
  };

  var modifier = function modifier(_options) {
    var options = _options || {};
    options.enabled = options.enabled !== false; // add missing defaults to options

    for (var _prop in defaults) {
      if (!(_prop in options)) {
        options[_prop] = defaults[_prop];
      }
    }

    var m = {
      options: options,
      methods: methods,
      name: name
    };
    return m;
  };

  if (name && typeof name === 'string') {
    // for backwrads compatibility
    modifier._defaults = defaults;
    modifier._methods = methods;
  }

  return modifier;
}

function addEventModifiers(_ref) {
  var iEvent = _ref.iEvent,
      result = _ref.interaction.modification.result;

  if (result) {
    iEvent.modifiers = result.eventProps;
  }
}

var modifiersBase = {
  id: 'modifiers/base',
  install: function install(scope) {
    scope.defaults.perAction.modifiers = [];
  },
  listeners: {
    'interactions:new': function interactionsNew(_ref2) {
      var interaction = _ref2.interaction;
      interaction.modification = new _Modification["default"](interaction);
    },
    'interactions:before-action-start': function interactionsBeforeActionStart(arg) {
      var modification = arg.interaction.modification;
      modification.start(arg, arg.interaction.coords.start.page);
      arg.interaction.edges = modification.edges;
      modification.applyToInteraction(arg);
    },
    'interactions:before-action-move': function interactionsBeforeActionMove(arg) {
      return arg.interaction.modification.setAndApply(arg);
    },
    'interactions:before-action-end': function interactionsBeforeActionEnd(arg) {
      return arg.interaction.modification.beforeEnd(arg);
    },
    'interactions:action-start': addEventModifiers,
    'interactions:action-move': addEventModifiers,
    'interactions:action-end': addEventModifiers,
    'interactions:after-action-start': function interactionsAfterActionStart(arg) {
      return arg.interaction.modification.restoreInteractionCoords(arg);
    },
    'interactions:after-action-move': function interactionsAfterActionMove(arg) {
      return arg.interaction.modification.restoreInteractionCoords(arg);
    },
    'interactions:stop': function interactionsStop(arg) {
      return arg.interaction.modification.stop(arg);
    }
  },
  before: ['actions', 'action/drag', 'actions/resize', 'actions/gesture']
};
var ___default_38 = modifiersBase;
_$base_38["default"] = ___default_38;

var _$index_51 = {};
"use strict";

function ___typeof_51(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_51 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_51 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_51(obj); }

Object.defineProperty(_$index_51, "__esModule", {
  value: true
});
_$index_51.addTotal = addTotal;
_$index_51.applyPending = applyPending;
_$index_51["default"] = void 0;

/* removed: var _$Interaction_22 = require("@interactjs/core/Interaction"); */;

var __rectUtils_51 = ___interopRequireWildcard_51(_$rect_82);

function ___getRequireWildcardCache_51() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_51 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_51(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_51(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_51(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

_$Interaction_22._ProxyMethods.offsetBy = '';

function addTotal(interaction) {
  if (!interaction.pointerIsDown) {
    return;
  }

  addToCoords(interaction.coords.cur, interaction.offset.total);
  interaction.offset.pending.x = 0;
  interaction.offset.pending.y = 0;
}

function beforeAction(_ref) {
  var interaction = _ref.interaction;
  applyPending(interaction);
}

function beforeEnd(_ref2) {
  var interaction = _ref2.interaction;
  var hadPending = applyPending(interaction);

  if (!hadPending) {
    return;
  }

  interaction.move({
    offset: true
  });
  interaction.end();
  return false;
}

function __end_51(_ref3) {
  var interaction = _ref3.interaction;
  interaction.offset.total.x = 0;
  interaction.offset.total.y = 0;
  interaction.offset.pending.x = 0;
  interaction.offset.pending.y = 0;
}

function applyPending(interaction) {
  if (!hasPending(interaction)) {
    return false;
  }

  var pending = interaction.offset.pending;
  addToCoords(interaction.coords.cur, pending);
  addToCoords(interaction.coords.delta, pending);
  __rectUtils_51.addEdges(interaction.edges, interaction.rect, pending);
  pending.x = 0;
  pending.y = 0;
  return true;
}

function offsetBy(_ref4) {
  var x = _ref4.x,
      y = _ref4.y;
  this.offset.pending.x += x;
  this.offset.pending.y += y;
  this.offset.total.x += x;
  this.offset.total.y += y;
}

function addToCoords(_ref5, _ref6) {
  var page = _ref5.page,
      client = _ref5.client;
  var x = _ref6.x,
      y = _ref6.y;
  page.x += x;
  page.y += y;
  client.x += x;
  client.y += y;
}

function hasPending(interaction) {
  return !!(interaction.offset.pending.x || interaction.offset.pending.y);
}

var offset = {
  id: 'offset',
  install: function install(scope) {
    scope.Interaction.prototype.offsetBy = offsetBy;
  },
  listeners: {
    'interactions:new': function interactionsNew(_ref7) {
      var interaction = _ref7.interaction;
      interaction.offset = {
        total: {
          x: 0,
          y: 0
        },
        pending: {
          x: 0,
          y: 0
        }
      };
    },
    'interactions:update-pointer': function interactionsUpdatePointer(_ref8) {
      var interaction = _ref8.interaction;
      return addTotal(interaction);
    },
    'interactions:before-action-start': beforeAction,
    'interactions:before-action-move': beforeAction,
    'interactions:before-action-end': beforeEnd,
    'interactions:stop': __end_51
  }
};
var ___default_51 = offset;
_$index_51["default"] = ___default_51;

var _$index_31 = {};
"use strict";

function ___typeof_31(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_31 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_31 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_31(obj); }

Object.defineProperty(_$index_31, "__esModule", {
  value: true
});
_$index_31["default"] = _$index_31.InertiaState = void 0;

var ___Modification_31 = ___interopRequireDefault_31(_$Modification_34);

var modifiers = ___interopRequireWildcard_31(_$base_38);

var ___index_31 = ___interopRequireDefault_31(_$index_51);

var __dom_31 = ___interopRequireWildcard_31(_$domUtils_69);

var ___hypot_31 = ___interopRequireDefault_31(_$hypot_74);

var __is_31 = ___interopRequireWildcard_31(_$is_76);

/* removed: var _$pointerUtils_80 = require("@interactjs/utils/pointerUtils"); */;

var ___raf_31 = ___interopRequireDefault_31(_$raf_81);

function ___getRequireWildcardCache_31() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_31 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_31(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_31(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_31(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___interopRequireDefault_31(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ___classCallCheck_31(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ___defineProperties_31(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ___createClass_31(Constructor, protoProps, staticProps) { if (protoProps) ___defineProperties_31(Constructor.prototype, protoProps); if (staticProps) ___defineProperties_31(Constructor, staticProps); return Constructor; }

function ___defineProperty_31(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function __install_31(scope) {
  var defaults = scope.defaults;
  scope.usePlugin(___index_31["default"]);
  scope.usePlugin(modifiers["default"]);
  scope.actions.phases.inertiastart = true;
  scope.actions.phases.resume = true;
  defaults.perAction.inertia = {
    enabled: false,
    resistance: 10,
    // the lambda in exponential decay
    minSpeed: 100,
    // target speed must be above this for inertia to start
    endSpeed: 10,
    // the speed at which inertia is slow enough to stop
    allowResume: true,
    // allow resuming an action in inertia phase
    smoothEndDuration: 300 // animate to snap/restrict endOnly if there's no inertia

  };
}

var InertiaState = /*#__PURE__*/function () {
  // eslint-disable-line camelcase
  // eslint-disable-line camelcase
  function InertiaState(interaction) {
    ___classCallCheck_31(this, InertiaState);

    this.interaction = interaction;

    ___defineProperty_31(this, "active", false);

    ___defineProperty_31(this, "isModified", false);

    ___defineProperty_31(this, "smoothEnd", false);

    ___defineProperty_31(this, "allowResume", false);

    ___defineProperty_31(this, "modification", null);

    ___defineProperty_31(this, "modifierCount", 0);

    ___defineProperty_31(this, "modifierArg", null);

    ___defineProperty_31(this, "startCoords", null);

    ___defineProperty_31(this, "t0", 0);

    ___defineProperty_31(this, "v0", 0);

    ___defineProperty_31(this, "te", 0);

    ___defineProperty_31(this, "targetOffset", null);

    ___defineProperty_31(this, "modifiedOffset", null);

    ___defineProperty_31(this, "currentOffset", null);

    ___defineProperty_31(this, "lambda_v0", 0);

    ___defineProperty_31(this, "one_ve_v0", 0);

    ___defineProperty_31(this, "timeout", null);
  }

  ___createClass_31(InertiaState, [{
    key: "start",
    value: function start(event) {
      var interaction = this.interaction;
      var options = __getOptions_31(interaction);

      if (!options || !options.enabled) {
        return false;
      }

      var velocityClient = interaction.coords.velocity.client;
      var pointerSpeed = (0, ___hypot_31["default"])(velocityClient.x, velocityClient.y);
      var modification = this.modification || (this.modification = new ___Modification_31["default"](interaction));
      modification.copyFrom(interaction.modification);
      this.t0 = interaction._now();
      this.allowResume = options.allowResume;
      this.v0 = pointerSpeed;
      this.currentOffset = {
        x: 0,
        y: 0
      };
      this.startCoords = interaction.coords.cur.page;
      this.modifierArg = {
        interaction: interaction,
        interactable: interaction.interactable,
        element: interaction.element,
        rect: interaction.rect,
        edges: interaction.edges,
        pageCoords: this.startCoords,
        preEnd: true,
        phase: 'inertiastart'
      };
      var thrown = this.t0 - interaction.coords.cur.timeStamp < 50 && pointerSpeed > options.minSpeed && pointerSpeed > options.endSpeed;

      if (thrown) {
        this.startInertia();
      } else {
        modification.result = modification.setAll(this.modifierArg);

        if (!modification.result.changed) {
          return false;
        }

        this.startSmoothEnd();
      } // force modification change


      interaction.modification.result.rect = null; // bring inertiastart event to the target coords

      interaction.offsetBy(this.targetOffset);

      interaction._doPhase({
        interaction: interaction,
        event: event,
        phase: 'inertiastart'
      });

      interaction.offsetBy({
        x: -this.targetOffset.x,
        y: -this.targetOffset.y
      }); // force modification change

      interaction.modification.result.rect = null;
      this.active = true;
      interaction.simulation = this;
      return true;
    }
  }, {
    key: "startInertia",
    value: function startInertia() {
      var _this = this;

      var startVelocity = this.interaction.coords.velocity.client;
      var options = __getOptions_31(this.interaction);
      var lambda = options.resistance;
      var inertiaDur = -Math.log(options.endSpeed / this.v0) / lambda;
      this.targetOffset = {
        x: (startVelocity.x - inertiaDur) / lambda,
        y: (startVelocity.y - inertiaDur) / lambda
      };
      this.te = inertiaDur;
      this.lambda_v0 = lambda / this.v0;
      this.one_ve_v0 = 1 - options.endSpeed / this.v0;
      var modification = this.modification,
          modifierArg = this.modifierArg;
      modifierArg.pageCoords = {
        x: this.startCoords.x + this.targetOffset.x,
        y: this.startCoords.y + this.targetOffset.y
      };
      modification.result = modification.setAll(modifierArg);

      if (modification.result.changed) {
        this.isModified = true;
        this.modifiedOffset = {
          x: this.targetOffset.x + modification.result.delta.x,
          y: this.targetOffset.y + modification.result.delta.y
        };
      }

      this.timeout = ___raf_31["default"].request(function () {
        return _this.inertiaTick();
      });
    }
  }, {
    key: "startSmoothEnd",
    value: function startSmoothEnd() {
      var _this2 = this;

      this.smoothEnd = true;
      this.isModified = true;
      this.targetOffset = {
        x: this.modification.result.delta.x,
        y: this.modification.result.delta.y
      };
      this.timeout = ___raf_31["default"].request(function () {
        return _this2.smoothEndTick();
      });
    }
  }, {
    key: "inertiaTick",
    value: function inertiaTick() {
      var _this3 = this;

      var interaction = this.interaction;
      var options = __getOptions_31(interaction);
      var lambda = options.resistance;
      var t = (interaction._now() - this.t0) / 1000;

      if (t < this.te) {
        var progress = 1 - (Math.exp(-lambda * t) - this.lambda_v0) / this.one_ve_v0;
        var newOffset;

        if (this.isModified) {
          newOffset = getQuadraticCurvePoint(0, 0, this.targetOffset.x, this.targetOffset.y, this.modifiedOffset.x, this.modifiedOffset.y, progress);
        } else {
          newOffset = {
            x: this.targetOffset.x * progress,
            y: this.targetOffset.y * progress
          };
        }

        var delta = {
          x: newOffset.x - this.currentOffset.x,
          y: newOffset.y - this.currentOffset.y
        };
        this.currentOffset.x += delta.x;
        this.currentOffset.y += delta.y;
        interaction.offsetBy(delta);
        interaction.move();
        this.timeout = ___raf_31["default"].request(function () {
          return _this3.inertiaTick();
        });
      } else {
        interaction.offsetBy({
          x: this.modifiedOffset.x - this.currentOffset.x,
          y: this.modifiedOffset.y - this.currentOffset.y
        });
        this.end();
      }
    }
  }, {
    key: "smoothEndTick",
    value: function smoothEndTick() {
      var _this4 = this;

      var interaction = this.interaction;
      var t = interaction._now() - this.t0;

      var _getOptions = __getOptions_31(interaction),
          duration = _getOptions.smoothEndDuration;

      if (t < duration) {
        var newOffset = {
          x: easeOutQuad(t, 0, this.targetOffset.x, duration),
          y: easeOutQuad(t, 0, this.targetOffset.y, duration)
        };
        var delta = {
          x: newOffset.x - this.currentOffset.x,
          y: newOffset.y - this.currentOffset.y
        };
        this.currentOffset.x += delta.x;
        this.currentOffset.y += delta.y;
        interaction.offsetBy(delta);
        interaction.move({
          skipModifiers: this.modifierCount
        });
        this.timeout = ___raf_31["default"].request(function () {
          return _this4.smoothEndTick();
        });
      } else {
        interaction.offsetBy({
          x: this.targetOffset.x - this.currentOffset.x,
          y: this.targetOffset.y - this.currentOffset.y
        });
        this.end();
      }
    }
  }, {
    key: "resume",
    value: function resume(_ref) {
      var pointer = _ref.pointer,
          event = _ref.event,
          eventTarget = _ref.eventTarget;
      var interaction = this.interaction; // undo inertia changes to interaction coords

      interaction.offsetBy({
        x: -this.currentOffset.x,
        y: -this.currentOffset.y
      }); // update pointer at pointer down position

      interaction.updatePointer(pointer, event, eventTarget, true); // fire resume signals and event

      interaction._doPhase({
        interaction: interaction,
        event: event,
        phase: 'resume'
      });

      (0, _$pointerUtils_80.copyCoords)(interaction.coords.prev, interaction.coords.cur);
      this.stop();
    }
  }, {
    key: "end",
    value: function end() {
      this.interaction.move();
      this.interaction.end();
      this.stop();
    }
  }, {
    key: "stop",
    value: function stop() {
      this.active = this.smoothEnd = false;
      this.interaction.simulation = null;

      ___raf_31["default"].cancel(this.timeout);
    }
  }]);

  return InertiaState;
}();

_$index_31.InertiaState = InertiaState;

function __start_31(_ref2) {
  var interaction = _ref2.interaction,
      event = _ref2.event;

  if (!interaction._interacting || interaction.simulation) {
    return null;
  }

  var started = interaction.inertia.start(event); // prevent action end if inertia or smoothEnd

  return started ? false : null;
} // Check if the down event hits the current inertia target
// control should be return to the user


function resume(arg) {
  var interaction = arg.interaction,
      eventTarget = arg.eventTarget;
  var state = interaction.inertia;

  if (!state.active) {
    return;
  }

  var element = eventTarget; // climb up the DOM tree from the event target

  while (__is_31.element(element)) {
    // if interaction element is the current inertia target element
    if (element === interaction.element) {
      state.resume(arg);
      break;
    }

    element = __dom_31.parentNode(element);
  }
}

function stop(_ref3) {
  var interaction = _ref3.interaction;
  var state = interaction.inertia;

  if (state.active) {
    state.stop();
  }
}

function __getOptions_31(_ref4) {
  var interactable = _ref4.interactable,
      prepared = _ref4.prepared;
  return interactable && interactable.options && prepared.name && interactable.options[prepared.name].inertia;
}

var inertia = {
  id: 'inertia',
  before: ['modifiers/base'],
  install: __install_31,
  listeners: {
    'interactions:new': function interactionsNew(_ref5) {
      var interaction = _ref5.interaction;
      interaction.inertia = new InertiaState(interaction);
    },
    'interactions:before-action-end': __start_31,
    'interactions:down': resume,
    'interactions:stop': stop,
    'interactions:before-action-resume': function interactionsBeforeActionResume(arg) {
      var modification = arg.interaction.modification;
      modification.stop(arg);
      modification.start(arg, arg.interaction.coords.cur.page);
      modification.applyToInteraction(arg);
    },
    'interactions:before-action-inertiastart': function interactionsBeforeActionInertiastart(arg) {
      return arg.interaction.modification.setAndApply(arg);
    },
    'interactions:action-resume': modifiers.addEventModifiers,
    'interactions:action-inertiastart': modifiers.addEventModifiers,
    'interactions:after-action-inertiastart': function interactionsAfterActionInertiastart(arg) {
      return arg.interaction.modification.restoreInteractionCoords(arg);
    },
    'interactions:after-action-resume': function interactionsAfterActionResume(arg) {
      return arg.interaction.modification.restoreInteractionCoords(arg);
    }
  }
}; // http://stackoverflow.com/a/5634528/2280888

function _getQBezierValue(t, p1, p2, p3) {
  var iT = 1 - t;
  return iT * iT * p1 + 2 * iT * t * p2 + t * t * p3;
}

function getQuadraticCurvePoint(startX, startY, cpX, cpY, endX, endY, position) {
  return {
    x: _getQBezierValue(position, startX, cpX, endX),
    y: _getQBezierValue(position, startY, cpY, endY)
  };
} // http://gizma.com/easing/


function easeOutQuad(t, b, c, d) {
  t /= d;
  return -c * t * (t - 2) + b;
}

var ___default_31 = inertia;
_$index_31["default"] = ___default_31;

var _$index_32 = {};
"use strict";

Object.defineProperty(_$index_32, "__esModule", {
  value: true
});
_$index_32.init = _$index_32["default"] = void 0;

_$index_63;

var ___scope_32 = ___interopRequireDefault_32(_$scope_28({}));

function ___interopRequireDefault_32(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ___typeof_32(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_32 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_32 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_32(obj); }

var scope = new ___scope_32["default"]();
var interact = scope.interactStatic;
var ___default_32 = interact;
_$index_32["default"] = ___default_32;

var __init_32 = function init(win) {
  return scope.init(win);
};

_$index_32.init = __init_32;

if ((typeof window === "undefined" ? "undefined" : ___typeof_32(window)) === 'object' && !!window) {
  __init_32(window);
}

var _$edgeTarget_59 = {};
"use strict";

Object.defineProperty(_$edgeTarget_59, "__esModule", {
  value: true
});
_$edgeTarget_59["default"] = void 0;
var ___default_59 = {};
_$edgeTarget_59["default"] = ___default_59;

var _$elements_60 = {};
"use strict";

Object.defineProperty(_$elements_60, "__esModule", {
  value: true
});
_$elements_60["default"] = void 0;
var ___default_60 = {};
_$elements_60["default"] = ___default_60;

var _$grid_61 = {};
"use strict";

Object.defineProperty(_$grid_61, "__esModule", {
  value: true
});
_$grid_61["default"] = void 0;

function ___slicedToArray_61(arr, i) { return ___arrayWithHoles_61(arr) || ___iterableToArrayLimit_61(arr, i) || ___nonIterableRest_61(); }

function ___nonIterableRest_61() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function ___iterableToArrayLimit_61(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function ___arrayWithHoles_61(arr) { if (Array.isArray(arr)) return arr; }

var ___default_61 = function _default(grid) {
  var coordFields = [['x', 'y'], ['left', 'top'], ['right', 'bottom'], ['width', 'height']].filter(function (_ref) {
    var _ref2 = ___slicedToArray_61(_ref, 2),
        xField = _ref2[0],
        yField = _ref2[1];

    return xField in grid || yField in grid;
  });

  var gridFunc = function gridFunc(x, y) {
    var range = grid.range,
        _grid$limits = grid.limits,
        limits = _grid$limits === void 0 ? {
      left: -Infinity,
      right: Infinity,
      top: -Infinity,
      bottom: Infinity
    } : _grid$limits,
        _grid$offset = grid.offset,
        offset = _grid$offset === void 0 ? {
      x: 0,
      y: 0
    } : _grid$offset;
    var result = {
      range: range,
      grid: grid,
      x: null,
      y: null
    };

    for (var _i2 = 0; _i2 < coordFields.length; _i2++) {
      var _ref3;

      _ref3 = coordFields[_i2];

      var _ref4 = _ref3,
          _ref5 = ___slicedToArray_61(_ref4, 2),
          xField = _ref5[0],
          yField = _ref5[1];

      var gridx = Math.round((x - offset.x) / grid[xField]);
      var gridy = Math.round((y - offset.y) / grid[yField]);
      result[xField] = Math.max(limits.left, Math.min(limits.right, gridx * grid[xField] + offset.x));
      result[yField] = Math.max(limits.top, Math.min(limits.bottom, gridy * grid[yField] + offset.y));
    }

    return result;
  };

  gridFunc.grid = grid;
  gridFunc.coordFields = coordFields;
  return gridFunc;
};

_$grid_61["default"] = ___default_61;

var _$all_58 = {};
"use strict";

Object.defineProperty(_$all_58, "__esModule", {
  value: true
});
Object.defineProperty(_$all_58, "edgeTarget", {
  enumerable: true,
  get: function get() {
    return _edgeTarget["default"];
  }
});
Object.defineProperty(_$all_58, "elements", {
  enumerable: true,
  get: function get() {
    return _elements["default"];
  }
});
Object.defineProperty(_$all_58, "grid", {
  enumerable: true,
  get: function get() {
    return _grid["default"];
  }
});

var _edgeTarget = ___interopRequireDefault_58(_$edgeTarget_59);

var _elements = ___interopRequireDefault_58(_$elements_60);

var _grid = ___interopRequireDefault_58(_$grid_61);

function ___interopRequireDefault_58(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _$index_62 = {};
"use strict";

function ___typeof_62(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_62 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_62 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_62(obj); }

Object.defineProperty(_$index_62, "__esModule", {
  value: true
});
_$index_62["default"] = void 0;

var ___extend_62 = ___interopRequireDefault_62(_$extend_72);

var allSnappers = ___interopRequireWildcard_62(_$all_58);

function ___getRequireWildcardCache_62() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_62 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_62(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_62(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_62(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___interopRequireDefault_62(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var snappersPlugin = {
  id: 'snappers',
  install: function install(scope) {
    var interact = scope.interactStatic;
    interact.snappers = (0, ___extend_62["default"])(interact.snappers || {}, allSnappers);
    interact.createSnapGrid = interact.snappers.grid;
  }
};
var ___default_62 = snappersPlugin;
_$index_62["default"] = ___default_62;

var _$aspectRatio_36 = {};
"use strict";

Object.defineProperty(_$aspectRatio_36, "__esModule", {
  value: true
});
_$aspectRatio_36.aspectRatio = _$aspectRatio_36["default"] = void 0;

var ___extend_36 = ___interopRequireDefault_36(_$extend_72);

/* removed: var _$rect_82 = require("@interactjs/utils/rect"); */;

var ___Modification_36 = ___interopRequireDefault_36(_$Modification_34);

/* removed: var _$base_38 = require("./base"); */;

function ___interopRequireDefault_36(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { ___defineProperty_36(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function ___defineProperty_36(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var aspectRatio = {
  start: function start(arg) {
    var state = arg.state,
        rect = arg.rect,
        originalEdges = arg.edges,
        coords = arg.pageCoords;
    var ratio = state.options.ratio;
    var _state$options = state.options,
        equalDelta = _state$options.equalDelta,
        modifiers = _state$options.modifiers;

    if (ratio === 'preserve') {
      ratio = rect.width / rect.height;
    }

    state.startCoords = (0, ___extend_36["default"])({}, coords);
    state.startRect = (0, ___extend_36["default"])({}, rect);
    state.ratio = ratio;
    state.equalDelta = equalDelta;
    var linkedEdges = state.linkedEdges = {
      top: originalEdges.top || originalEdges.left && !originalEdges.bottom,
      left: originalEdges.left || originalEdges.top && !originalEdges.right,
      bottom: originalEdges.bottom || originalEdges.right && !originalEdges.top,
      right: originalEdges.right || originalEdges.bottom && !originalEdges.left
    };
    state.xIsPrimaryAxis = !!(originalEdges.left || originalEdges.right);

    if (state.equalDelta) {
      state.edgeSign = (linkedEdges.left ? 1 : -1) * (linkedEdges.top ? 1 : -1);
    } else {
      var negativeSecondaryEdge = state.xIsPrimaryAxis ? linkedEdges.top : linkedEdges.left;
      state.edgeSign = negativeSecondaryEdge ? -1 : 1;
    }

    (0, ___extend_36["default"])(arg.edges, linkedEdges);

    if (!modifiers || !modifiers.length) {
      return;
    }

    var subModification = new ___Modification_36["default"](arg.interaction);
    subModification.copyFrom(arg.interaction.modification);
    subModification.prepareStates(modifiers);
    state.subModification = subModification;
    subModification.startAll(_objectSpread({}, arg));
  },
  set: function set(arg) {
    var state = arg.state,
        rect = arg.rect,
        coords = arg.coords;
    var initialCoords = (0, ___extend_36["default"])({}, coords);
    var aspectMethod = state.equalDelta ? setEqualDelta : setRatio;
    aspectMethod(state, state.xIsPrimaryAxis, coords, rect);

    if (!state.subModification) {
      return null;
    }

    var correctedRect = (0, ___extend_36["default"])({}, rect);
    (0, _$rect_82.addEdges)(state.linkedEdges, correctedRect, {
      x: coords.x - initialCoords.x,
      y: coords.y - initialCoords.y
    });
    var result = state.subModification.setAll(_objectSpread({}, arg, {
      rect: correctedRect,
      edges: state.linkedEdges,
      pageCoords: coords,
      prevCoords: coords,
      prevRect: correctedRect
    }));
    var delta = result.delta;

    if (result.changed) {
      var xIsCriticalAxis = Math.abs(delta.x) > Math.abs(delta.y); // do aspect modification again with critical edge axis as primary

      aspectMethod(state, xIsCriticalAxis, result.coords, result.rect);
      (0, ___extend_36["default"])(coords, result.coords);
    }

    return result.eventProps;
  },
  defaults: {
    ratio: 'preserve',
    equalDelta: false,
    modifiers: [],
    enabled: false
  }
};
_$aspectRatio_36.aspectRatio = aspectRatio;

function setEqualDelta(_ref, xIsPrimaryAxis, coords) {
  var startCoords = _ref.startCoords,
      edgeSign = _ref.edgeSign;

  if (xIsPrimaryAxis) {
    coords.y = startCoords.y + (coords.x - startCoords.x) * edgeSign;
  } else {
    coords.x = startCoords.x + (coords.y - startCoords.y) * edgeSign;
  }
}

function setRatio(_ref2, xIsPrimaryAxis, coords, rect) {
  var startRect = _ref2.startRect,
      startCoords = _ref2.startCoords,
      ratio = _ref2.ratio,
      edgeSign = _ref2.edgeSign;

  if (xIsPrimaryAxis) {
    var newHeight = rect.width / ratio;
    coords.y = startCoords.y + (newHeight - startRect.height) * edgeSign;
  } else {
    var newWidth = rect.height * ratio;
    coords.x = startCoords.x + (newWidth - startRect.width) * edgeSign;
  }
}

var ___default_36 = (0, _$base_38.makeModifier)(aspectRatio, 'aspectRatio');

_$aspectRatio_36["default"] = ___default_36;

var _$avoid_37 = {};
"use strict";

Object.defineProperty(_$avoid_37, "__esModule", {
  value: true
});
_$avoid_37["default"] = void 0;

var avoid = function avoid() {};

avoid._defaults = {};
var ___default_37 = avoid;
_$avoid_37["default"] = ___default_37;

var _$pointer_41 = {};
"use strict";

function ___typeof_41(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_41 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_41 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_41(obj); }

Object.defineProperty(_$pointer_41, "__esModule", {
  value: true
});
_$pointer_41.getRestrictionRect = getRestrictionRect;
_$pointer_41.restrict = _$pointer_41["default"] = void 0;

var ___extend_41 = ___interopRequireDefault_41(_$extend_72);

var __is_41 = ___interopRequireWildcard_41(_$is_76);

var __rectUtils_41 = ___interopRequireWildcard_41(_$rect_82);

/* removed: var _$base_38 = require("../base"); */;

function ___getRequireWildcardCache_41() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_41 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_41(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_41(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_41(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___interopRequireDefault_41(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function __start_41(_ref) {
  var rect = _ref.rect,
      startOffset = _ref.startOffset,
      state = _ref.state,
      interaction = _ref.interaction,
      pageCoords = _ref.pageCoords;
  var options = state.options;
  var elementRect = options.elementRect;
  var offset = (0, ___extend_41["default"])({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  }, options.offset || {});

  if (rect && elementRect) {
    var restriction = getRestrictionRect(options.restriction, interaction, pageCoords);

    if (restriction) {
      var widthDiff = restriction.right - restriction.left - rect.width;
      var heightDiff = restriction.bottom - restriction.top - rect.height;

      if (widthDiff < 0) {
        offset.left += widthDiff;
        offset.right += widthDiff;
      }

      if (heightDiff < 0) {
        offset.top += heightDiff;
        offset.bottom += heightDiff;
      }
    }

    offset.left += startOffset.left - rect.width * elementRect.left;
    offset.top += startOffset.top - rect.height * elementRect.top;
    offset.right += startOffset.right - rect.width * (1 - elementRect.right);
    offset.bottom += startOffset.bottom - rect.height * (1 - elementRect.bottom);
  }

  state.offset = offset;
}

function set(_ref2) {
  var coords = _ref2.coords,
      interaction = _ref2.interaction,
      state = _ref2.state;
  var options = state.options,
      offset = state.offset;
  var restriction = getRestrictionRect(options.restriction, interaction, coords);

  if (!restriction) {
    return;
  }

  var rect = __rectUtils_41.xywhToTlbr(restriction);
  coords.x = Math.max(Math.min(rect.right - offset.right, coords.x), rect.left + offset.left);
  coords.y = Math.max(Math.min(rect.bottom - offset.bottom, coords.y), rect.top + offset.top);
}

function getRestrictionRect(value, interaction, coords) {
  if (__is_41.func(value)) {
    return __rectUtils_41.resolveRectLike(value, interaction.interactable, interaction.element, [coords.x, coords.y, interaction]);
  } else {
    return __rectUtils_41.resolveRectLike(value, interaction.interactable, interaction.element);
  }
}

var __defaults_41 = {
  restriction: null,
  elementRect: null,
  offset: null,
  endOnly: false,
  enabled: false
};
var restrict = {
  start: __start_41,
  set: set,
  defaults: __defaults_41
};
_$pointer_41.restrict = restrict;

var ___default_41 = (0, _$base_38.makeModifier)(restrict, 'restrict');

_$pointer_41["default"] = ___default_41;

var _$edges_40 = {};
"use strict";

function ___typeof_40(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_40 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_40 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_40(obj); }

Object.defineProperty(_$edges_40, "__esModule", {
  value: true
});
_$edges_40.restrictEdges = _$edges_40["default"] = void 0;

var ___extend_40 = ___interopRequireDefault_40(_$extend_72);

var __rectUtils_40 = ___interopRequireWildcard_40(_$rect_82);

/* removed: var _$base_38 = require("../base"); */;

/* removed: var _$pointer_41 = require("./pointer"); */;

function ___getRequireWildcardCache_40() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_40 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_40(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_40(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_40(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___interopRequireDefault_40(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

// This module adds the options.resize.restrictEdges setting which sets min and
// max for the top, left, bottom and right edges of the target being resized.
//
// interact(target).resize({
//   edges: { top: true, left: true },
//   restrictEdges: {
//     inner: { top: 200, left: 200, right: 400, bottom: 400 },
//     outer: { top:   0, left:   0, right: 600, bottom: 600 },
//   },
// })
var noInner = {
  top: +Infinity,
  left: +Infinity,
  bottom: -Infinity,
  right: -Infinity
};
var noOuter = {
  top: -Infinity,
  left: -Infinity,
  bottom: +Infinity,
  right: +Infinity
};

function __start_40(_ref) {
  var interaction = _ref.interaction,
      startOffset = _ref.startOffset,
      state = _ref.state;
  var options = state.options;
  var offset;

  if (options) {
    var offsetRect = (0, _$pointer_41.getRestrictionRect)(options.offset, interaction, interaction.coords.start.page);
    offset = __rectUtils_40.rectToXY(offsetRect);
  }

  offset = offset || {
    x: 0,
    y: 0
  };
  state.offset = {
    top: offset.y + startOffset.top,
    left: offset.x + startOffset.left,
    bottom: offset.y - startOffset.bottom,
    right: offset.x - startOffset.right
  };
}

function __set_40(_ref2) {
  var coords = _ref2.coords,
      edges = _ref2.edges,
      interaction = _ref2.interaction,
      state = _ref2.state;
  var offset = state.offset,
      options = state.options;

  if (!edges) {
    return;
  }

  var page = (0, ___extend_40["default"])({}, coords);
  var inner = (0, _$pointer_41.getRestrictionRect)(options.inner, interaction, page) || {};
  var outer = (0, _$pointer_41.getRestrictionRect)(options.outer, interaction, page) || {};
  fixRect(inner, noInner);
  fixRect(outer, noOuter);

  if (edges.top) {
    coords.y = Math.min(Math.max(outer.top + offset.top, page.y), inner.top + offset.top);
  } else if (edges.bottom) {
    coords.y = Math.max(Math.min(outer.bottom + offset.bottom, page.y), inner.bottom + offset.bottom);
  }

  if (edges.left) {
    coords.x = Math.min(Math.max(outer.left + offset.left, page.x), inner.left + offset.left);
  } else if (edges.right) {
    coords.x = Math.max(Math.min(outer.right + offset.right, page.x), inner.right + offset.right);
  }
}

function fixRect(rect, defaults) {
  var _arr = ['top', 'left', 'bottom', 'right'];

  for (var _i = 0; _i < _arr.length; _i++) {
    var edge = _arr[_i];

    if (!(edge in rect)) {
      rect[edge] = defaults[edge];
    }
  }

  return rect;
}

var __defaults_40 = {
  inner: null,
  outer: null,
  offset: null,
  endOnly: false,
  enabled: false
};
var restrictEdges = {
  noInner: noInner,
  noOuter: noOuter,
  start: __start_40,
  set: __set_40,
  defaults: __defaults_40
};
_$edges_40.restrictEdges = restrictEdges;

var ___default_40 = (0, _$base_38.makeModifier)(restrictEdges, 'restrictEdges');

_$edges_40["default"] = ___default_40;

var _$rect_42 = {};
"use strict";

Object.defineProperty(_$rect_42, "__esModule", {
  value: true
});
_$rect_42.restrictRect = _$rect_42["default"] = void 0;

var ___extend_42 = ___interopRequireDefault_42(_$extend_72);

/* removed: var _$base_38 = require("../base"); */;

/* removed: var _$pointer_41 = require("./pointer"); */;

function ___interopRequireDefault_42(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var __defaults_42 = (0, ___extend_42["default"])({
  get elementRect() {
    return {
      top: 0,
      left: 0,
      bottom: 1,
      right: 1
    };
  },

  set elementRect(_) {}

}, _$pointer_41.restrict.defaults);
var restrictRect = {
  start: _$pointer_41.restrict.start,
  set: _$pointer_41.restrict.set,
  defaults: __defaults_42
};
_$rect_42.restrictRect = restrictRect;

var ___default_42 = (0, _$base_38.makeModifier)(restrictRect, 'restrictRect');

_$rect_42["default"] = ___default_42;

var _$size_43 = {};
"use strict";

function ___typeof_43(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_43 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_43 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_43(obj); }

Object.defineProperty(_$size_43, "__esModule", {
  value: true
});
_$size_43.restrictSize = _$size_43["default"] = void 0;

var ___extend_43 = ___interopRequireDefault_43(_$extend_72);

var __rectUtils_43 = ___interopRequireWildcard_43(_$rect_82);

/* removed: var _$base_38 = require("../base"); */;

/* removed: var _$edges_40 = require("./edges"); */;

/* removed: var _$pointer_41 = require("./pointer"); */;

function ___getRequireWildcardCache_43() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_43 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_43(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_43(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_43(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___interopRequireDefault_43(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var noMin = {
  width: -Infinity,
  height: -Infinity
};
var noMax = {
  width: +Infinity,
  height: +Infinity
};

function __start_43(arg) {
  return _$edges_40.restrictEdges.start(arg);
}

function __set_43(arg) {
  var interaction = arg.interaction,
      state = arg.state,
      rect = arg.rect,
      edges = arg.edges;
  var options = state.options;

  if (!edges) {
    return;
  }

  var minSize = __rectUtils_43.tlbrToXywh((0, _$pointer_41.getRestrictionRect)(options.min, interaction, arg.coords)) || noMin;
  var maxSize = __rectUtils_43.tlbrToXywh((0, _$pointer_41.getRestrictionRect)(options.max, interaction, arg.coords)) || noMax;
  state.options = {
    endOnly: options.endOnly,
    inner: (0, ___extend_43["default"])({}, _$edges_40.restrictEdges.noInner),
    outer: (0, ___extend_43["default"])({}, _$edges_40.restrictEdges.noOuter)
  };

  if (edges.top) {
    state.options.inner.top = rect.bottom - minSize.height;
    state.options.outer.top = rect.bottom - maxSize.height;
  } else if (edges.bottom) {
    state.options.inner.bottom = rect.top + minSize.height;
    state.options.outer.bottom = rect.top + maxSize.height;
  }

  if (edges.left) {
    state.options.inner.left = rect.right - minSize.width;
    state.options.outer.left = rect.right - maxSize.width;
  } else if (edges.right) {
    state.options.inner.right = rect.left + minSize.width;
    state.options.outer.right = rect.left + maxSize.width;
  }

  _$edges_40.restrictEdges.set(arg);

  state.options = options;
}

var __defaults_43 = {
  min: null,
  max: null,
  endOnly: false,
  enabled: false
};
var restrictSize = {
  start: __start_43,
  set: __set_43,
  defaults: __defaults_43
};
_$size_43.restrictSize = restrictSize;

var ___default_43 = (0, _$base_38.makeModifier)(restrictSize, 'restrictSize');

_$size_43["default"] = ___default_43;

var _$rubberband_44 = {};
"use strict";

Object.defineProperty(_$rubberband_44, "__esModule", {
  value: true
});
_$rubberband_44["default"] = void 0;

var rubberband = function rubberband() {};

rubberband._defaults = {};
var ___default_44 = rubberband;
_$rubberband_44["default"] = ___default_44;

var _$pointer_46 = {};
"use strict";

function ___typeof_46(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_46 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_46 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_46(obj); }

Object.defineProperty(_$pointer_46, "__esModule", {
  value: true
});
_$pointer_46.snap = _$pointer_46["default"] = void 0;

var __utils_46 = ___interopRequireWildcard_46(_$index_75);

/* removed: var _$base_38 = require("../base"); */;

function ___getRequireWildcardCache_46() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_46 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_46(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_46(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_46(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function __start_46(arg) {
  var interaction = arg.interaction,
      interactable = arg.interactable,
      element = arg.element,
      rect = arg.rect,
      state = arg.state,
      startOffset = arg.startOffset;
  var options = state.options;
  var origin = options.offsetWithOrigin ? getOrigin(arg) : {
    x: 0,
    y: 0
  };
  var snapOffset;

  if (options.offset === 'startCoords') {
    snapOffset = {
      x: interaction.coords.start.page.x,
      y: interaction.coords.start.page.y
    };
  } else {
    var offsetRect = __utils_46.rect.resolveRectLike(options.offset, interactable, element, [interaction]);
    snapOffset = __utils_46.rect.rectToXY(offsetRect) || {
      x: 0,
      y: 0
    };
    snapOffset.x += origin.x;
    snapOffset.y += origin.y;
  }

  var relativePoints = options.relativePoints;
  state.offsets = rect && relativePoints && relativePoints.length ? relativePoints.map(function (relativePoint, index) {
    return {
      index: index,
      relativePoint: relativePoint,
      x: startOffset.left - rect.width * relativePoint.x + snapOffset.x,
      y: startOffset.top - rect.height * relativePoint.y + snapOffset.y
    };
  }) : [__utils_46.extend({
    index: 0,
    relativePoint: null
  }, snapOffset)];
}

function __set_46(arg) {
  var interaction = arg.interaction,
      coords = arg.coords,
      state = arg.state;
  var options = state.options,
      offsets = state.offsets;
  var origin = __utils_46.getOriginXY(interaction.interactable, interaction.element, interaction.prepared.name);
  var page = __utils_46.extend({}, coords);
  var targets = [];

  if (!options.offsetWithOrigin) {
    page.x -= origin.x;
    page.y -= origin.y;
  }

  for (var _i = 0; _i < offsets.length; _i++) {
    var _ref;

    _ref = offsets[_i];
    var _offset = _ref;
    var relativeX = page.x - _offset.x;
    var relativeY = page.y - _offset.y;

    for (var _index = 0, len = options.targets.length; _index < len; _index++) {
      var snapTarget = options.targets[_index];
      var target = void 0;

      if (__utils_46.is.func(snapTarget)) {
        target = snapTarget(relativeX, relativeY, interaction, _offset, _index);
      } else {
        target = snapTarget;
      }

      if (!target) {
        continue;
      }

      targets.push({
        x: (__utils_46.is.number(target.x) ? target.x : relativeX) + _offset.x,
        y: (__utils_46.is.number(target.y) ? target.y : relativeY) + _offset.y,
        range: __utils_46.is.number(target.range) ? target.range : options.range,
        source: snapTarget,
        index: _index,
        offset: _offset
      });
    }
  }

  var closest = {
    target: null,
    inRange: false,
    distance: 0,
    range: 0,
    delta: {
      x: 0,
      y: 0
    }
  };

  for (var _i2 = 0; _i2 < targets.length; _i2++) {
    var _target = targets[_i2];
    var range = _target.range;
    var dx = _target.x - page.x;
    var dy = _target.y - page.y;
    var distance = __utils_46.hypot(dx, dy);
    var inRange = distance <= range; // Infinite targets count as being out of range
    // compared to non infinite ones that are in range

    if (range === Infinity && closest.inRange && closest.range !== Infinity) {
      inRange = false;
    }

    if (!closest.target || (inRange // is the closest target in range?
    ? closest.inRange && range !== Infinity // the pointer is relatively deeper in this target
    ? distance / range < closest.distance / closest.range // this target has Infinite range and the closest doesn't
    : range === Infinity && closest.range !== Infinity || // OR this target is closer that the previous closest
    distance < closest.distance : // The other is not in range and the pointer is closer to this target
    !closest.inRange && distance < closest.distance)) {
      closest.target = _target;
      closest.distance = distance;
      closest.range = range;
      closest.inRange = inRange;
      closest.delta.x = dx;
      closest.delta.y = dy;
    }
  }

  if (closest.inRange) {
    coords.x = closest.target.x;
    coords.y = closest.target.y;
  }

  state.closest = closest;
  return closest;
}

function getOrigin(arg) {
  var element = arg.interaction.element;
  var optionsOrigin = __utils_46.rect.rectToXY(__utils_46.rect.resolveRectLike(arg.state.options.origin, null, null, [element]));
  var origin = optionsOrigin || __utils_46.getOriginXY(arg.interactable, element, arg.interaction.prepared.name);
  return origin;
}

var __defaults_46 = {
  range: Infinity,
  targets: null,
  offset: null,
  offsetWithOrigin: true,
  origin: null,
  relativePoints: null,
  endOnly: false,
  enabled: false
};
var snap = {
  start: __start_46,
  set: __set_46,
  defaults: __defaults_46
};
_$pointer_46.snap = snap;

var ___default_46 = (0, _$base_38.makeModifier)(snap, 'snap');

_$pointer_46["default"] = ___default_46;

var _$size_47 = {};
"use strict";

function ___typeof_47(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_47 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_47 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_47(obj); }

Object.defineProperty(_$size_47, "__esModule", {
  value: true
});
_$size_47.snapSize = _$size_47["default"] = void 0;

var ___extend_47 = ___interopRequireDefault_47(_$extend_72);

var __is_47 = ___interopRequireWildcard_47(_$is_76);

/* removed: var _$base_38 = require("../base"); */;

/* removed: var _$pointer_46 = require("./pointer"); */;

function ___getRequireWildcardCache_47() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_47 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_47(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_47(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_47(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___interopRequireDefault_47(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ___slicedToArray_47(arr, i) { return ___arrayWithHoles_47(arr) || ___iterableToArrayLimit_47(arr, i) || ___nonIterableRest_47(); }

function ___nonIterableRest_47() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function ___iterableToArrayLimit_47(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function ___arrayWithHoles_47(arr) { if (Array.isArray(arr)) return arr; }

function __start_47(arg) {
  var state = arg.state,
      edges = arg.edges;
  var options = state.options;

  if (!edges) {
    return null;
  }

  arg.state = {
    options: {
      targets: null,
      relativePoints: [{
        x: edges.left ? 0 : 1,
        y: edges.top ? 0 : 1
      }],
      offset: options.offset || 'self',
      origin: {
        x: 0,
        y: 0
      },
      range: options.range
    }
  };
  state.targetFields = state.targetFields || [['width', 'height'], ['x', 'y']];

  _$pointer_46.snap.start(arg);

  state.offsets = arg.state.offsets;
  arg.state = state;
}

function __set_47(arg) {
  var interaction = arg.interaction,
      state = arg.state,
      coords = arg.coords;
  var options = state.options,
      offsets = state.offsets;
  var relative = {
    x: coords.x - offsets[0].x,
    y: coords.y - offsets[0].y
  };
  state.options = (0, ___extend_47["default"])({}, options);
  state.options.targets = [];

  for (var _i = 0; _i < (options.targets || []).length; _i++) {
    var _ref;

    _ref = (options.targets || [])[_i];
    var snapTarget = _ref;
    var target = void 0;

    if (__is_47.func(snapTarget)) {
      target = snapTarget(relative.x, relative.y, interaction);
    } else {
      target = snapTarget;
    }

    if (!target) {
      continue;
    }

    for (var _i2 = 0; _i2 < state.targetFields.length; _i2++) {
      var _ref2;

      _ref2 = state.targetFields[_i2];

      var _ref3 = _ref2,
          _ref4 = ___slicedToArray_47(_ref3, 2),
          xField = _ref4[0],
          yField = _ref4[1];

      if (xField in target || yField in target) {
        target.x = target[xField];
        target.y = target[yField];
        break;
      }
    }

    state.options.targets.push(target);
  }

  var returnValue = _$pointer_46.snap.set(arg);

  state.options = options;
  return returnValue;
}

var __defaults_47 = {
  range: Infinity,
  targets: null,
  offset: null,
  endOnly: false,
  enabled: false
};
var snapSize = {
  start: __start_47,
  set: __set_47,
  defaults: __defaults_47
};
_$size_47.snapSize = snapSize;

var ___default_47 = (0, _$base_38.makeModifier)(snapSize, 'snapSize');

_$size_47["default"] = ___default_47;

var _$edges_45 = {};
"use strict";

Object.defineProperty(_$edges_45, "__esModule", {
  value: true
});
_$edges_45.snapEdges = _$edges_45["default"] = void 0;

var ___clone_45 = ___interopRequireDefault_45(_$clone_66);

var ___extend_45 = ___interopRequireDefault_45(_$extend_72);

/* removed: var _$base_38 = require("../base"); */;

/* removed: var _$size_47 = require("./size"); */;

function ___interopRequireDefault_45(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/**
 * @module modifiers/snapEdges
 *
 * @description
 * This module allows snapping of the edges of targets during resize
 * interactions.
 *
 * @example
 * interact(target).resizable({
 *   snapEdges: {
 *     targets: [interact.snappers.grid({ x: 100, y: 50 })],
 *   },
 * })
 *
 * interact(target).resizable({
 *   snapEdges: {
 *     targets: [
 *       interact.snappers.grid({
 *        top: 50,
 *        left: 50,
 *        bottom: 100,
 *        right: 100,
 *       }),
 *     ],
 *   },
 * })
 */
function __start_45(arg) {
  var edges = arg.edges;

  if (!edges) {
    return null;
  }

  arg.state.targetFields = arg.state.targetFields || [[edges.left ? 'left' : 'right', edges.top ? 'top' : 'bottom']];
  return _$size_47.snapSize.start(arg);
}

var snapEdges = {
  start: __start_45,
  set: _$size_47.snapSize.set,
  defaults: (0, ___extend_45["default"])((0, ___clone_45["default"])(_$size_47.snapSize.defaults), {
    targets: null,
    range: null,
    offset: {
      x: 0,
      y: 0
    }
  })
};
_$edges_45.snapEdges = snapEdges;

var ___default_45 = (0, _$base_38.makeModifier)(snapEdges, 'snapEdges');

_$edges_45["default"] = ___default_45;

var _$spring_48 = {};
"use strict";

Object.defineProperty(_$spring_48, "__esModule", {
  value: true
});
_$spring_48["default"] = void 0;

var spring = function spring() {};

spring._defaults = {};
var ___default_48 = spring;
_$spring_48["default"] = ___default_48;

var _$transform_49 = {};
"use strict";

Object.defineProperty(_$transform_49, "__esModule", {
  value: true
});
_$transform_49["default"] = void 0;

var transform = function transform() {};

transform._defaults = {};
var ___default_49 = transform;
_$transform_49["default"] = ___default_49;

var _$all_35 = {};
"use strict";

Object.defineProperty(_$all_35, "__esModule", {
  value: true
});
_$all_35["default"] = void 0;

var _aspectRatio = ___interopRequireDefault_35(_$aspectRatio_36);

var _avoid = ___interopRequireDefault_35(_$avoid_37);

var ___edges_35 = ___interopRequireDefault_35(_$edges_40);

var ___pointer_35 = ___interopRequireDefault_35(_$pointer_41);

var ___rect_35 = ___interopRequireDefault_35(_$rect_42);

var ___size_35 = ___interopRequireDefault_35(_$size_43);

var _rubberband = ___interopRequireDefault_35(_$rubberband_44);

var _edges2 = ___interopRequireDefault_35(_$edges_45);

var _pointer2 = ___interopRequireDefault_35(_$pointer_46);

var _size2 = ___interopRequireDefault_35(_$size_47);

var _spring = ___interopRequireDefault_35(_$spring_48);

var _transform = ___interopRequireDefault_35(_$transform_49);

function ___interopRequireDefault_35(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable node/no-extraneous-import */
var ___default_35 = {
  aspectRatio: _aspectRatio["default"],
  restrictEdges: ___edges_35["default"],
  restrict: ___pointer_35["default"],
  restrictRect: ___rect_35["default"],
  restrictSize: ___size_35["default"],
  snapEdges: _edges2["default"],
  snap: _pointer2["default"],
  snapSize: _size2["default"],
  spring: _spring["default"],
  avoid: _avoid["default"],
  transform: _transform["default"],
  rubberband: _rubberband["default"]
};
_$all_35["default"] = ___default_35;

var _$index_39 = {};
"use strict";

Object.defineProperty(_$index_39, "__esModule", {
  value: true
});
_$index_39["default"] = void 0;

var ___index_39 = ___interopRequireDefault_39(_$index_62);

var _all2 = ___interopRequireDefault_39(_$all_35);

var ___base_39 = ___interopRequireDefault_39(_$base_38);

function ___interopRequireDefault_39(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var __modifiers_39 = {
  id: 'modifiers',
  install: function install(scope) {
    var interact = scope.interactStatic;
    scope.usePlugin(___base_39["default"]);
    scope.usePlugin(___index_39["default"]);
    interact.modifiers = _all2["default"]; // for backwrads compatibility

    for (var type in _all2["default"]) {
      var _all = _all2["default"][type],
          _defaults = _all._defaults,
          _methods = _all._methods;
      _defaults._methods = _methods;
      scope.defaults.perAction[type] = _defaults;
    }
  }
};
var ___default_39 = __modifiers_39;
_$index_39["default"] = ___default_39;

var _$index_50 = {};
"use strict";

Object.defineProperty(_$index_50, "__esModule", {
  value: true
});
_$index_50["default"] = void 0;
var ___default_50 = {};
_$index_50["default"] = ___default_50;

var _$PointerEvent_52 = {};
"use strict";

Object.defineProperty(_$PointerEvent_52, "__esModule", {
  value: true
});
_$PointerEvent_52.PointerEvent = _$PointerEvent_52["default"] = void 0;

var ___BaseEvent2_52 = ___interopRequireDefault_52(_$BaseEvent_16);

var __pointerUtils_52 = ___interopRequireWildcard_52(_$pointerUtils_80);

function ___getRequireWildcardCache_52() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_52 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_52(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_52(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_52(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___interopRequireDefault_52(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ___typeof_52(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_52 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_52 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_52(obj); }

function ___classCallCheck_52(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function ___defineProperties_52(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function ___createClass_52(Constructor, protoProps, staticProps) { if (protoProps) ___defineProperties_52(Constructor.prototype, protoProps); if (staticProps) ___defineProperties_52(Constructor, staticProps); return Constructor; }

function ___possibleConstructorReturn_52(self, call) { if (call && (___typeof_52(call) === "object" || typeof call === "function")) { return call; } return ___assertThisInitialized_52(self); }

function ___getPrototypeOf_52(o) { ___getPrototypeOf_52 = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return ___getPrototypeOf_52(o); }

function ___assertThisInitialized_52(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function ___inherits_52(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) ___setPrototypeOf_52(subClass, superClass); }

function ___setPrototypeOf_52(o, p) { ___setPrototypeOf_52 = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return ___setPrototypeOf_52(o, p); }

function ___defineProperty_52(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var PointerEvent = /*#__PURE__*/function (_BaseEvent) {
  ___inherits_52(PointerEvent, _BaseEvent);

  /** */
  function PointerEvent(type, pointer, event, eventTarget, interaction, timeStamp) {
    var _this;

    ___classCallCheck_52(this, PointerEvent);

    _this = ___possibleConstructorReturn_52(this, ___getPrototypeOf_52(PointerEvent).call(this, interaction));

    ___defineProperty_52(___assertThisInitialized_52(_this), "type", void 0);

    ___defineProperty_52(___assertThisInitialized_52(_this), "originalEvent", void 0);

    ___defineProperty_52(___assertThisInitialized_52(_this), "pointerId", void 0);

    ___defineProperty_52(___assertThisInitialized_52(_this), "pointerType", void 0);

    ___defineProperty_52(___assertThisInitialized_52(_this), "double", void 0);

    ___defineProperty_52(___assertThisInitialized_52(_this), "pageX", void 0);

    ___defineProperty_52(___assertThisInitialized_52(_this), "pageY", void 0);

    ___defineProperty_52(___assertThisInitialized_52(_this), "clientX", void 0);

    ___defineProperty_52(___assertThisInitialized_52(_this), "clientY", void 0);

    ___defineProperty_52(___assertThisInitialized_52(_this), "dt", void 0);

    ___defineProperty_52(___assertThisInitialized_52(_this), "eventable", void 0);

    __pointerUtils_52.pointerExtend(___assertThisInitialized_52(_this), event);

    if (event !== pointer) {
      __pointerUtils_52.pointerExtend(___assertThisInitialized_52(_this), pointer);
    }

    _this.timeStamp = timeStamp;
    _this.originalEvent = event;
    _this.type = type;
    _this.pointerId = __pointerUtils_52.getPointerId(pointer);
    _this.pointerType = __pointerUtils_52.getPointerType(pointer);
    _this.target = eventTarget;
    _this.currentTarget = null;

    if (type === 'tap') {
      var pointerIndex = interaction.getPointerIndex(pointer);
      _this.dt = _this.timeStamp - interaction.pointers[pointerIndex].downTime;
      var interval = _this.timeStamp - interaction.tapTime;
      _this["double"] = !!(interaction.prevTap && interaction.prevTap.type !== 'doubletap' && interaction.prevTap.target === _this.target && interval < 500);
    } else if (type === 'doubletap') {
      _this.dt = pointer.timeStamp - interaction.tapTime;
    }

    return _this;
  }

  ___createClass_52(PointerEvent, [{
    key: "_subtractOrigin",
    value: function _subtractOrigin(_ref) {
      var originX = _ref.x,
          originY = _ref.y;
      this.pageX -= originX;
      this.pageY -= originY;
      this.clientX -= originX;
      this.clientY -= originY;
      return this;
    }
  }, {
    key: "_addOrigin",
    value: function _addOrigin(_ref2) {
      var originX = _ref2.x,
          originY = _ref2.y;
      this.pageX += originX;
      this.pageY += originY;
      this.clientX += originX;
      this.clientY += originY;
      return this;
    }
    /**
     * Prevent the default behaviour of the original Event
     */

  }, {
    key: "preventDefault",
    value: function preventDefault() {
      this.originalEvent.preventDefault();
    }
  }]);

  return PointerEvent;
}(___BaseEvent2_52["default"]);

_$PointerEvent_52.PointerEvent = _$PointerEvent_52["default"] = PointerEvent;

var _$base_53 = {};
"use strict";

function ___typeof_53(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_53 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_53 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_53(obj); }

Object.defineProperty(_$base_53, "__esModule", {
  value: true
});
_$base_53["default"] = void 0;

var ___Interaction_53 = ___interopRequireDefault_53(_$Interaction_22);

var ___scope_53 = ___interopRequireDefault_53(_$scope_28({}));

var __utils_53 = ___interopRequireWildcard_53(_$index_75);

var _PointerEvent = ___interopRequireDefault_53(_$PointerEvent_52);

function ___getRequireWildcardCache_53() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_53 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_53(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_53(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_53(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___interopRequireDefault_53(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var __defaults_53 = {
  holdDuration: 600,
  ignoreFrom: null,
  allowFrom: null,
  origin: {
    x: 0,
    y: 0
  }
};
var pointerEvents = {
  id: 'pointer-events/base',
  install: __install_53,
  listeners: {
    'interactions:new': addInteractionProps,
    'interactions:update-pointer': addHoldInfo,
    'interactions:move': moveAndClearHold,
    'interactions:down': function interactionsDown(arg, scope) {
      downAndStartHold(arg, scope);
      fire(arg, scope);
    },
    'interactions:up': function interactionsUp(arg, scope) {
      clearHold(arg);
      fire(arg, scope);
      tapAfterUp(arg, scope);
    },
    'interactions:cancel': function interactionsCancel(arg, scope) {
      clearHold(arg);
      fire(arg, scope);
    }
  },
  PointerEvent: _PointerEvent["default"],
  fire: fire,
  collectEventTargets: collectEventTargets,
  defaults: __defaults_53,
  types: {
    down: true,
    move: true,
    up: true,
    cancel: true,
    tap: true,
    doubletap: true,
    hold: true
  }
};

function fire(arg, scope) {
  var interaction = arg.interaction,
      pointer = arg.pointer,
      event = arg.event,
      eventTarget = arg.eventTarget,
      type = arg.type,
      _arg$targets = arg.targets,
      targets = _arg$targets === void 0 ? collectEventTargets(arg, scope) : _arg$targets;
  var pointerEvent = new _PointerEvent["default"](type, pointer, event, eventTarget, interaction, scope.now());
  scope.fire('pointerEvents:new', {
    pointerEvent: pointerEvent
  });
  var signalArg = {
    interaction: interaction,
    pointer: pointer,
    event: event,
    eventTarget: eventTarget,
    targets: targets,
    type: type,
    pointerEvent: pointerEvent
  };

  for (var i = 0; i < targets.length; i++) {
    var target = targets[i];

    for (var prop in target.props || {}) {
      pointerEvent[prop] = target.props[prop];
    }

    var origin = __utils_53.getOriginXY(target.eventable, target.node);

    pointerEvent._subtractOrigin(origin);

    pointerEvent.eventable = target.eventable;
    pointerEvent.currentTarget = target.node;
    target.eventable.fire(pointerEvent);

    pointerEvent._addOrigin(origin);

    if (pointerEvent.immediatePropagationStopped || pointerEvent.propagationStopped && i + 1 < targets.length && targets[i + 1].node !== pointerEvent.currentTarget) {
      break;
    }
  }

  scope.fire('pointerEvents:fired', signalArg);

  if (type === 'tap') {
    // if pointerEvent should make a double tap, create and fire a doubletap
    // PointerEvent and use that as the prevTap
    var prevTap = pointerEvent["double"] ? fire({
      interaction: interaction,
      pointer: pointer,
      event: event,
      eventTarget: eventTarget,
      type: 'doubletap'
    }, scope) : pointerEvent;
    interaction.prevTap = prevTap;
    interaction.tapTime = prevTap.timeStamp;
  }

  return pointerEvent;
}

function collectEventTargets(_ref, scope) {
  var interaction = _ref.interaction,
      pointer = _ref.pointer,
      event = _ref.event,
      eventTarget = _ref.eventTarget,
      type = _ref.type;
  var pointerIndex = interaction.getPointerIndex(pointer);
  var pointerInfo = interaction.pointers[pointerIndex]; // do not fire a tap event if the pointer was moved before being lifted

  if (type === 'tap' && (interaction.pointerWasMoved || // or if the pointerup target is different to the pointerdown target
  !(pointerInfo && pointerInfo.downTarget === eventTarget))) {
    return [];
  }

  var path = __utils_53.dom.getPath(eventTarget);
  var signalArg = {
    interaction: interaction,
    pointer: pointer,
    event: event,
    eventTarget: eventTarget,
    type: type,
    path: path,
    targets: [],
    node: null
  };

  for (var _i = 0; _i < path.length; _i++) {
    var _ref2;

    _ref2 = path[_i];
    var node = _ref2;
    signalArg.node = node;
    scope.fire('pointerEvents:collect-targets', signalArg);
  }

  if (type === 'hold') {
    signalArg.targets = signalArg.targets.filter(function (target) {
      return target.eventable.options.holdDuration === interaction.pointers[pointerIndex].hold.duration;
    });
  }

  return signalArg.targets;
}

function addInteractionProps(_ref3) {
  var interaction = _ref3.interaction;
  interaction.prevTap = null; // the most recent tap event on this interaction

  interaction.tapTime = 0; // time of the most recent tap event
}

function addHoldInfo(_ref4) {
  var down = _ref4.down,
      pointerInfo = _ref4.pointerInfo;

  if (!down && pointerInfo.hold) {
    return;
  }

  pointerInfo.hold = {
    duration: Infinity,
    timeout: null
  };
}

function clearHold(_ref5) {
  var interaction = _ref5.interaction,
      pointerIndex = _ref5.pointerIndex;

  if (interaction.pointers[pointerIndex].hold) {
    clearTimeout(interaction.pointers[pointerIndex].hold.timeout);
  }
}

function moveAndClearHold(_ref6, scope) {
  var interaction = _ref6.interaction,
      pointer = _ref6.pointer,
      event = _ref6.event,
      eventTarget = _ref6.eventTarget,
      duplicate = _ref6.duplicate;
  var pointerIndex = interaction.getPointerIndex(pointer);

  if (!duplicate && (!interaction.pointerIsDown || interaction.pointerWasMoved)) {
    if (interaction.pointerIsDown) {
      clearTimeout(interaction.pointers[pointerIndex].hold.timeout);
    }

    fire({
      interaction: interaction,
      pointer: pointer,
      event: event,
      eventTarget: eventTarget,
      type: 'move'
    }, scope);
  }
}

function downAndStartHold(_ref7, scope) {
  var interaction = _ref7.interaction,
      pointer = _ref7.pointer,
      event = _ref7.event,
      eventTarget = _ref7.eventTarget,
      pointerIndex = _ref7.pointerIndex;
  var timer = interaction.pointers[pointerIndex].hold;
  var path = __utils_53.dom.getPath(eventTarget);
  var signalArg = {
    interaction: interaction,
    pointer: pointer,
    event: event,
    eventTarget: eventTarget,
    type: 'hold',
    targets: [],
    path: path,
    node: null
  };

  for (var _i2 = 0; _i2 < path.length; _i2++) {
    var _ref8;

    _ref8 = path[_i2];
    var node = _ref8;
    signalArg.node = node;
    scope.fire('pointerEvents:collect-targets', signalArg);
  }

  if (!signalArg.targets.length) {
    return;
  }

  var minDuration = Infinity;

  for (var _i3 = 0; _i3 < signalArg.targets.length; _i3++) {
    var _ref9;

    _ref9 = signalArg.targets[_i3];
    var target = _ref9;
    var holdDuration = target.eventable.options.holdDuration;

    if (holdDuration < minDuration) {
      minDuration = holdDuration;
    }
  }

  timer.duration = minDuration;
  timer.timeout = setTimeout(function () {
    fire({
      interaction: interaction,
      eventTarget: eventTarget,
      pointer: pointer,
      event: event,
      type: 'hold'
    }, scope);
  }, minDuration);
}

function tapAfterUp(_ref10, scope) {
  var interaction = _ref10.interaction,
      pointer = _ref10.pointer,
      event = _ref10.event,
      eventTarget = _ref10.eventTarget;

  if (!interaction.pointerWasMoved) {
    fire({
      interaction: interaction,
      eventTarget: eventTarget,
      pointer: pointer,
      event: event,
      type: 'tap'
    }, scope);
  }
}

function __install_53(scope) {
  scope.pointerEvents = pointerEvents;
  scope.defaults.actions.pointerEvents = pointerEvents.defaults;
  __utils_53.extend(scope.actions.phaselessTypes, pointerEvents.types);
}

var ___default_53 = pointerEvents;
_$base_53["default"] = ___default_53;

var _$holdRepeat_54 = {};
"use strict";

Object.defineProperty(_$holdRepeat_54, "__esModule", {
  value: true
});
_$holdRepeat_54["default"] = void 0;

var ___PointerEvent_54 = ___interopRequireDefault_54(_$PointerEvent_52);

var ___base_54 = ___interopRequireDefault_54(_$base_53);

function ___interopRequireDefault_54(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function __install_54(scope) {
  scope.usePlugin(___base_54["default"]);
  var pointerEvents = scope.pointerEvents; // don't repeat by default

  pointerEvents.defaults.holdRepeatInterval = 0;
  pointerEvents.types.holdrepeat = scope.actions.phaselessTypes.holdrepeat = true;
}

function onNew(_ref) {
  var pointerEvent = _ref.pointerEvent;

  if (pointerEvent.type !== 'hold') {
    return;
  }

  pointerEvent.count = (pointerEvent.count || 0) + 1;
}

function onFired(_ref2, scope) {
  var interaction = _ref2.interaction,
      pointerEvent = _ref2.pointerEvent,
      eventTarget = _ref2.eventTarget,
      targets = _ref2.targets;

  if (pointerEvent.type !== 'hold' || !targets.length) {
    return;
  } // get the repeat interval from the first eventable


  var interval = targets[0].eventable.options.holdRepeatInterval; // don't repeat if the interval is 0 or less

  if (interval <= 0) {
    return;
  } // set a timeout to fire the holdrepeat event


  interaction.holdIntervalHandle = setTimeout(function () {
    scope.pointerEvents.fire({
      interaction: interaction,
      eventTarget: eventTarget,
      type: 'hold',
      pointer: pointerEvent,
      event: pointerEvent
    }, scope);
  }, interval);
}

function endHoldRepeat(_ref3) {
  var interaction = _ref3.interaction;

  // set the interaction's holdStopTime property
  // to stop further holdRepeat events
  if (interaction.holdIntervalHandle) {
    clearInterval(interaction.holdIntervalHandle);
    interaction.holdIntervalHandle = null;
  }
}

var holdRepeat = {
  id: 'pointer-events/holdRepeat',
  install: __install_54,
  listeners: ['move', 'up', 'cancel', 'endall'].reduce(function (acc, enderTypes) {
    acc["pointerEvents:".concat(enderTypes)] = endHoldRepeat;
    return acc;
  }, {
    'pointerEvents:new': onNew,
    'pointerEvents:fired': onFired
  })
};
var ___default_54 = holdRepeat;
_$holdRepeat_54["default"] = ___default_54;

var _$interactableTargets_56 = {};
"use strict";

Object.defineProperty(_$interactableTargets_56, "__esModule", {
  value: true
});
_$interactableTargets_56["default"] = void 0;

var ___extend_56 = ___interopRequireDefault_56(_$extend_72);

function ___interopRequireDefault_56(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function __install_56(scope) {
  var Interactable = scope.Interactable;
  Interactable.prototype.pointerEvents = pointerEventsMethod;
  var __backCompatOption = Interactable.prototype._backCompatOption;

  Interactable.prototype._backCompatOption = function (optionName, newValue) {
    var ret = __backCompatOption.call(this, optionName, newValue);

    if (ret === this) {
      this.events.options[optionName] = newValue;
    }

    return ret;
  };
}

function pointerEventsMethod(options) {
  (0, ___extend_56["default"])(this.events.options, options);
  return this;
}

var plugin = {
  id: 'pointer-events/interactableTargets',
  install: __install_56,
  listeners: {
    'pointerEvents:collect-targets': function pointerEventsCollectTargets(_ref, scope) {
      var targets = _ref.targets,
          node = _ref.node,
          type = _ref.type,
          eventTarget = _ref.eventTarget;
      scope.interactables.forEachMatch(node, function (interactable) {
        var eventable = interactable.events;
        var options = eventable.options;

        if (eventable.types[type] && eventable.types[type].length && interactable.testIgnoreAllow(options, node, eventTarget)) {
          targets.push({
            node: node,
            eventable: eventable,
            props: {
              interactable: interactable
            }
          });
        }
      });
    },
    'interactable:new': function interactableNew(_ref2) {
      var interactable = _ref2.interactable;

      interactable.events.getRect = function (element) {
        return interactable.getRect(element);
      };
    },
    'interactable:set': function interactableSet(_ref3, scope) {
      var interactable = _ref3.interactable,
          options = _ref3.options;
      (0, ___extend_56["default"])(interactable.events.options, scope.pointerEvents.defaults);
      (0, ___extend_56["default"])(interactable.events.options, options.pointerEvents || {});
    }
  }
};
var ___default_56 = plugin;
_$interactableTargets_56["default"] = ___default_56;

var _$index_55 = {};
"use strict";

function ___typeof_55(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_55 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_55 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_55(obj); }

Object.defineProperty(_$index_55, "__esModule", {
  value: true
});
Object.defineProperty(_$index_55, "holdRepeat", {
  enumerable: true,
  get: function get() {
    return _holdRepeat["default"];
  }
});
Object.defineProperty(_$index_55, "interactableTargets", {
  enumerable: true,
  get: function get() {
    return _interactableTargets["default"];
  }
});
_$index_55.pointerEvents = _$index_55["default"] = void 0;

var __pointerEvents_55 = ___interopRequireWildcard_55(_$base_53);

_$index_55.pointerEvents = __pointerEvents_55;

var _holdRepeat = ___interopRequireDefault_55(_$holdRepeat_54);

var _interactableTargets = ___interopRequireDefault_55(_$interactableTargets_56);

function ___interopRequireDefault_55(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ___getRequireWildcardCache_55() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_55 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_55(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_55(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_55(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var ___default_55 = {
  id: 'pointer-events',
  install: function install(scope) {
    scope.usePlugin(__pointerEvents_55);
    scope.usePlugin(_holdRepeat["default"]);
    scope.usePlugin(_interactableTargets["default"]);
  }
};
_$index_55["default"] = ___default_55;

var _$index_57 = {};
"use strict";

Object.defineProperty(_$index_57, "__esModule", {
  value: true
});
_$index_57.install = __install_57;
_$index_57["default"] = void 0;

var ___Interactable_57 = ___interopRequireDefault_57(_$Interactable_20({}));

/* removed: var _$Interaction_22 = require("@interactjs/core/Interaction"); */;

/* removed: var _$index_75 = require("@interactjs/utils/index"); */;

function ___interopRequireDefault_57(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function __install_57(scope) {
  var Interactable = scope.Interactable;
  scope.actions.phases.reflow = true;
  /**
   * ```js
   * const interactable = interact(target)
   * const drag = { name: drag, axis: 'x' }
   * const resize = { name: resize, edges: { left: true, bottom: true }
   *
   * interactable.reflow(drag)
   * interactable.reflow(resize)
   * ```
   *
   * Start an action sequence to re-apply modifiers, check drops, etc.
   *
   * @param { Object } action The action to begin
   * @param { string } action.name The name of the action
   * @returns { Promise } A promise that resolves to the `Interactable` when actions on all targets have ended
   */

  Interactable.prototype.reflow = function (action) {
    return reflow(this, action, scope);
  };
}

function reflow(interactable, action, scope) {
  var elements = _$index_75.is.string(interactable.target) ? _$index_75.arr.from(interactable._context.querySelectorAll(interactable.target)) : [interactable.target]; // tslint:disable-next-line variable-name

  var Promise = _$index_75.win.window.Promise;
  var promises = Promise ? [] : null;

  var _loop = function _loop() {
    _ref = elements[_i];
    var element = _ref;
    var rect = interactable.getRect(element);

    if (!rect) {
      return "break";
    }

    var runningInteraction = _$index_75.arr.find(scope.interactions.list, function (interaction) {
      return interaction.interacting() && interaction.interactable === interactable && interaction.element === element && interaction.prepared.name === action.name;
    });

    var reflowPromise = void 0;

    if (runningInteraction) {
      runningInteraction.move();

      if (promises) {
        reflowPromise = runningInteraction._reflowPromise || new Promise(function (resolve) {
          runningInteraction._reflowResolve = resolve;
        });
      }
    } else {
      var xywh = _$index_75.rect.tlbrToXywh(rect);

      var coords = {
        page: {
          x: xywh.x,
          y: xywh.y
        },
        client: {
          x: xywh.x,
          y: xywh.y
        },
        timeStamp: scope.now()
      };

      var event = _$index_75.pointer.coordsToEvent(coords);

      reflowPromise = startReflow(scope, interactable, element, action, event);
    }

    if (promises) {
      promises.push(reflowPromise);
    }
  };

  for (var _i = 0; _i < elements.length; _i++) {
    var _ref;

    var _ret = _loop();

    if (_ret === "break") break;
  }

  return promises && Promise.all(promises).then(function () {
    return interactable;
  });
}

function startReflow(scope, interactable, element, action, event) {
  var interaction = scope.interactions["new"]({
    pointerType: 'reflow'
  });
  var signalArg = {
    interaction: interaction,
    event: event,
    pointer: event,
    eventTarget: element,
    phase: 'reflow'
  };
  interaction.interactable = interactable;
  interaction.element = element;
  interaction.prepared = (0, _$index_75.extend)({}, action);
  interaction.prevEvent = event;
  interaction.updatePointer(event, event, element, true);

  interaction._doPhase(signalArg);

  var reflowPromise = _$index_75.win.window.Promise ? new _$index_75.win.window.Promise(function (resolve) {
    interaction._reflowResolve = resolve;
  }) : null;
  interaction._reflowPromise = reflowPromise;
  interaction.start(action, interactable, element);

  if (interaction._interacting) {
    interaction.move(signalArg);
    interaction.end(event);
  } else {
    interaction.stop();
  }

  interaction.removePointer(event, event);
  interaction.pointerIsDown = false;
  return reflowPromise;
}

var ___default_57 = {
  id: 'reflow',
  install: __install_57,
  listeners: {
    // remove completed reflow interactions
    'interactions:stop': function interactionsStop(_ref2, scope) {
      var interaction = _ref2.interaction;

      if (interaction.pointerType === 'reflow') {
        if (interaction._reflowResolve) {
          interaction._reflowResolve();
        }

        _$index_75.arr.remove(scope.interactions.list, interaction);
      }
    }
  }
};
_$index_57["default"] = ___default_57;

var _$displace_67 = {};
"use strict";

Object.defineProperty(_$displace_67, "__esModule", {
  value: true
});
_$displace_67["default"] = void 0;
var ___default_67 = {};
_$displace_67["default"] = ___default_67;

var _$exchange_71 = {};
"use strict";

Object.defineProperty(_$exchange_71, "__esModule", {
  value: true
});
_$exchange_71.exchange = void 0;
var exchange = {};
_$exchange_71.exchange = exchange;

var _$index_84 = {};
"use strict";

Object.defineProperty(_$index_84, "__esModule", {
  value: true
});
_$index_84["default"] = void 0;
var ___default_84 = {};
_$index_84["default"] = ___default_84;

var _$index_33 = {};
"use strict";

function ___typeof_33(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_33 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_33 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_33(obj); }

Object.defineProperty(_$index_33, "__esModule", {
  value: true
});
_$index_33["default"] = void 0;

_$index_63;

var _actions = ___interopRequireDefault_33(_$index_5);

var _arrange = ___interopRequireDefault_33(_$index_7);

var _autoScroll = ___interopRequireDefault_33(_$index_8);

var _autoStart = ___interopRequireDefault_33(_$index_13);

var ___clone_33 = ___interopRequireDefault_33(_$index_14);

var _components = ___interopRequireDefault_33(_$index_15);

var ___interactablePreventDefault_33 = ___interopRequireDefault_33(_$interactablePreventDefault_25);

var _devTools = ___interopRequireDefault_33(_$index_29);

var feedback = ___interopRequireWildcard_33(_$index_30);

var _inertia = ___interopRequireDefault_33(_$index_31);

var _interact = ___interopRequireDefault_33(_$index_32);

var ___index_33 = ___interopRequireDefault_33(_$index_39);

var _multiTarget = ___interopRequireDefault_33(_$index_50);

var _offset = ___interopRequireDefault_33(_$index_51);

var _pointerEvents = ___interopRequireDefault_33(_$index_55);

var _reflow = ___interopRequireDefault_33(_$index_57);

var displace = ___interopRequireWildcard_33(_$displace_67);

/* removed: var _$exchange_71 = require("@interactjs/utils/exchange"); */;

var __pointerUtils_33 = ___interopRequireWildcard_33(_$pointerUtils_80);

var vueComponents = ___interopRequireWildcard_33(_$index_84);

function ___getRequireWildcardCache_33() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); ___getRequireWildcardCache_33 = function _getRequireWildcardCache() { return cache; }; return cache; }

function ___interopRequireWildcard_33(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || ___typeof_33(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = ___getRequireWildcardCache_33(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ___interopRequireDefault_33(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_interact["default"].use(_multiTarget["default"]);

_interact["default"].use(___interactablePreventDefault_33["default"]);

_interact["default"].use(_offset["default"]); // interaction element cloning


_interact["default"].use(___clone_33["default"]); // sortable and swappable


_interact["default"].use(_arrange["default"]); // pointerEvents


_interact["default"].use(_pointerEvents["default"]); // inertia


_interact["default"].use(_inertia["default"]); // snap, resize, etc.


_interact["default"].use(___index_33["default"]); // autoStart, hold


_interact["default"].use(_autoStart["default"]); // drag and drop, resize, gesture


_interact["default"].use(_actions["default"]); // autoScroll


_interact["default"].use(_autoScroll["default"]); // reflow


_interact["default"].use(_reflow["default"]);

_interact["default"].feedback = feedback;

_interact["default"].use(_components["default"]);

_interact["default"].vue = {
  components: vueComponents
};
_interact["default"].__utils = {
  exchange: _$exchange_71.exchange,
  displace: displace,
  pointer: __pointerUtils_33
}; // eslint-disable-next-line no-undef

if ("production" !== 'production') {
  _interact["default"].use(_devTools["default"]);
}

var ___default_33 = _interact["default"];
_$index_33["default"] = ___default_33;

var _$index_85 = { exports: {} };
"use strict";

Object.defineProperty(_$index_85.exports, "__esModule", {
  value: true
});
_$index_85.exports["default"] = void 0;

var ___index_85 = ___interopRequireDefault_85(_$index_33);

function ___interopRequireDefault_85(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ___typeof_85(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { ___typeof_85 = function _typeof(obj) { return typeof obj; }; } else { ___typeof_85 = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return ___typeof_85(obj); }

if (("object" === "undefined" ? "undefined" : ___typeof_85(_$index_85)) === 'object' && !!_$index_85) {
  try {
    _$index_85.exports = ___index_85["default"];
  } catch (_unused) {}
}

___index_85["default"]["default"] = ___index_85["default"];
var ___default_85 = ___index_85["default"];
_$index_85.exports["default"] = ___default_85;

_$index_85 = _$index_85.exports
return _$index_85;

});



},{}],"modules/appendImg.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clickedImage = clickedImage;
exports.AppendImg = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _gsap = _interopRequireDefault(require("gsap"));

var _snapsvg = _interopRequireDefault(require("snapsvg"));

var _interactjs = _interopRequireDefault(require("interactjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AppendImg = function AppendImg(data) {
  var ImageContainer = document.querySelector(".ImageContainer");

  _gsap.default.to(ImageContainer, {
    duration: 1,
    opacity: 0
  });

  setTimeout(function () {
    ImageContainer.innerHTML = "";

    _gsap.default.to(ImageContainer, {
      duration: 1,
      opacity: 1
    });

    ImageContainer.dataset.chapter = data[0].id;

    if (data[0].media.length > 0) {
      data[0].media.forEach(function (e) {
        createSvg(e, ImageContainer);
      });
    } else {
      createSvg(data[0].media[0], ImageContainer);
    }
  }, 1000);
};

exports.AppendImg = AppendImg;

function createSvg(_x, _x2) {
  return _createSvg.apply(this, arguments);
}

function _createSvg() {
  _createSvg = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(img, container) {
    var parent, svg, responseSvg, svgText, addName;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            parent = document.createElement("div");
            svg = document.createElementNS("http://www.w3.org/2000/svg", "svg"); // Append timeline  to a div

            _context.next = 4;
            return fetch("images/level-images/".concat(img.src));

          case 4:
            responseSvg = _context.sent;
            _context.next = 7;
            return responseSvg.text();

          case 7:
            svgText = _context.sent;
            // svg.setAttribute("href", `images/level-images/${img}`);
            svg.setAttribute("class", "IMGclicked");
            svg.setAttribute("viewBox", "0 0 300 300");
            svg.setAttribute("class", "svgContainer");
            svg.dataset.name = img.src.substring(0, img.src.length - 4);
            svg.innerHTML = svgText;
            addName = img.src.substring(0, img.src.length - 4);
            img.draggable ? createDraggableContainer(svg, parent, container, img) : createNONContainer(parent, addName);
            parent.appendChild(svg);
            container.appendChild(parent);
            addAnimationsToElements();

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _createSvg.apply(this, arguments);
}

function createDraggableContainer(createdSvg, parent, container, img) {
  parent.classList.add("movableitemContainer");
  parent.dataset.name = img.src.substring(0, img.src.length - 4);
  createdSvg.classList.add("draggableItem");
  createDropZone(img, container);
}

function createDropZone(_x3, _x4) {
  return _createDropZone.apply(this, arguments);
}

function _createDropZone() {
  _createDropZone = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2(img, container) {
    var parent, responseSvg, svgText;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            parent = document.createElement("div"); // const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

            _context2.next = 3;
            return fetch("images/level-images/".concat(img.src));

          case 3:
            responseSvg = _context2.sent;
            _context2.next = 6;
            return responseSvg.text();

          case 6:
            svgText = _context2.sent;
            parent.innerHTML = svgText;
            parent.classList.add("dropzone");
            parent.dataset.moving = "";
            parent.dataset.name = img.src.substring(0, img.src.length - 4); // parent.appendChild(svg);

            container.appendChild(parent);

          case 12:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _createDropZone.apply(this, arguments);
}

function createNONContainer(parent, addName) {
  parent.classList.add("NOTmovableitemContainer");
  parent.classList.add("click");
  parent.dataset.name = addName;
} // ANIMATION PARTS


function addAnimationsToElements() {
  if (document.querySelector(".ImageContainer[data-chapter=lvl2-p1]")) {
    document.querySelector("#lamp_lid").dataset.lifted = "true";
  } else if (document.querySelector(".ImageContainer[data-chapter=lvl2-p4]")) {
    AnimateColloredOilLamp();
  } else if (document.querySelector(".ImageContainer[data-chapter=lvl3-p2]")) {
    var svgpaths = document.querySelectorAll("path");
    svgpaths.forEach(function (pathItem) {
      pathItem.setAttribute("pathLength", 1);
      pathItem.dataset.show = "true";
    });
    var e = document.querySelector(".Instructions");
    var d = document.createElement("a");
    d.setAttribute("href", "index.html");
    d.textContent = e.textContent;
    e.parentNode.replaceChild(d, e);
  } else if (document.querySelector(".ImageContainer[data-chapter=lvl3-p1]")) {
    var switchElement = document.querySelector("#switchPart");
    switchElement.addEventListener("click", clickedImage);
  }
} // LEVEL THREE


function clickedImage() {
  var onBtn = document.querySelector("#oneSquare");
  var offBtn = document.querySelector("#squareSwitchOn");
  var lightsOne = document.querySelector("#Light-dashesGroupOne");
  var lightsTwo = document.querySelector("#Light-dashesGroupTwo");
  var lightBulb = document.querySelector("#LightBulbCirlce");

  _gsap.default.to(onBtn, {
    fill: "black",
    duration: 0.3,
    ease: "bounce"
  });

  _gsap.default.to(offBtn, {
    fill: "white",
    duration: 0.3,
    ease: "bounce"
  });

  setTimeout(function () {
    document.querySelector("#wire").dataset.show = "true";
    setTimeout(function () {
      lightsOne.dataset.show = "true";
      lightsTwo.dataset.show = "true";
      lightBulb.dataset.show = "true";
    }, 2000);
  }, 300);
} // LEVELTWO


function AnimateColloredOilLamp() {
  repeatingMorphing("#oiLampColorised", "#smallLight", "#lightStrokeLarge", 1200);
  setTimeout(function () {
    _gsap.default.fromTo(".firedot", {
      y: 100,
      scale: 0.2,
      duration: 5,
      opacity: 0,
      ease: "stepped",
      repeat: -1
    }, {
      y: 0,
      scale: 1.2,
      duration: 5,
      opacity: 1,
      stagger: 0.5,
      ease: "stepped",
      repeat: -1
    });
  }, 1000);
} // ANIMATIONS


function repeatingMorphing(svgId, firstPath, pathToMorphto, duration) {
  document.querySelector("#light").dataset.show = "true";
  var svg = document.querySelector(svgId);
  var s = (0, _snapsvg.default)(svg);

  var firstElement = _snapsvg.default.select(firstPath);

  var secondElement = _snapsvg.default.select(pathToMorphto);

  var firstElementPoints = firstElement.node.getAttribute("d");
  var secondElementPoints = secondElement.node.getAttribute("d");

  var toPreviousPath = function toPreviousPath() {
    firstElement.animate({
      d: secondElementPoints
    }, duration, mina.backout, toNextPath);
  };

  var toNextPath = function toNextPath() {
    firstElement.animate({
      d: firstElementPoints
    }, duration, mina.backout, toPreviousPath);
  };

  toNextPath();
}

function toMorph(svgId, firstPath, pathToMorphto, duration) {
  var svg = document.querySelector(svgId);
  var s = (0, _snapsvg.default)(svg);

  var firstElement = _snapsvg.default.select(firstPath);

  var secondElement = _snapsvg.default.select(pathToMorphto);

  var firstElementPoints = firstElement.node.getAttribute("d");
  var secondElementPoints = secondElement.node.getAttribute("d");

  var morphing = function morphing() {
    firstElement.animate({
      d: secondElementPoints
    }, duration, mina.easeout);
  };

  morphing();
}
},{"@babel/runtime/regenerator":"node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"node_modules/@babel/runtime/helpers/asyncToGenerator.js","gsap":"node_modules/gsap/index.js","snapsvg":"node_modules/snapsvg/dist/snap.svg.js","interactjs":"node_modules/interactjs/dist/interact.min.js"}],"modules/Draggable.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DraggElement = DraggElement;
exports.AnimateLightingTheWick = AnimateLightingTheWick;
exports.AnimateFlask = AnimateFlask;

var _interactjs = _interopRequireDefault(require("interactjs"));

var _gsap = _interopRequireDefault(require("gsap"));

var _snapsvg = _interopRequireDefault(require("snapsvg"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// enable draggables to be dropped into this
function DraggElement(moveForwards) {
  (0, _interactjs.default)(".draggableItem").draggable({
    listeners: {
      // call this function on every dragmoveevent
      move: dragMoveListener
    }
  });
  (0, _interactjs.default)(".dropzone").dropzone({
    accept: ".draggableItem",
    // Require a 75% element overlap for a drop to be possible
    overlap: 0.5,
    ondragenter: function ondragenter(event) {
      // feedback the possibility of a drop
      event.target.dataset.moving = "hovering";
    },
    ondragleave: function ondragleave(event) {
      // remove the drop feedback style
      event.target.dataset.moving = "activeMoving";
    },
    ondrop: function ondrop(event) {
      event.target.dataset.moving = "dropped";
      AnimateDraggableObjects(moveForwards); // interact(".draggableItem").unset();
    },
    ondropactivate: function ondropactivate(event) {
      event.target.dataset.moving = "activeMoving";
    }
  });
}

function dragMoveListener(event) {
  var target = event.target; // keep the dragged position in the data-x/data-y attributes

  var x = (parseFloat(target.getAttribute("data-x")) || 0) + event.dx;
  var y = (parseFloat(target.getAttribute("data-y")) || 0) + event.dy; // translate the element

  target.style.webkitTransform = target.style.transform = "translate(" + x + "px, " + y + "px)"; // update the posiion attributes

  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
} // ANIMATIONS LEVEL 2


function AnimateDraggableObjects(moveForwards) {
  var ImageContainerChaptervalue = document.querySelector(".ImageContainer").dataset.chapter;

  if (ImageContainerChaptervalue === "lvl2-p2") {
    AnimateFlask(moveForwards);
  } else if (ImageContainerChaptervalue === "lvl2-p3") {
    AnimateLightingTheWick(moveForwards);
  }
}

function AnimateLightingTheWick(moveForwards) {
  var theMatch = document.querySelector(".draggableItem");
  var theMatchContainer = document.querySelector(".movableitemContainer"); // theMatchContainer.dataset.droppedmatch = "true";

  var tl = _gsap.default.timeline();

  tl.to(theMatchContainer, {
    x: -15,
    y: 105,
    duration: 0.4
  }).to(theMatch, {
    rotation: 30,
    duration: 1,
    onComplete: function onComplete() {
      document.querySelector("#light").dataset.show = "true";
      removeItemFromDisplay("#theMatch");
      repeatingMorphing("#oilLampFull", "#smallLight", "#lightStrokeLarge", 1500, true);
      setTimeout(function () {
        moveForwards();
      }, 2500);
    }
  });

  _gsap.default.fromTo(".firedot", {
    y: 100,
    scale: 0.2,
    duration: 5,
    opacity: 0,
    ease: "stepped",
    repeat: -1
  }, {
    y: 0,
    scale: 1.2,
    duration: 5,
    opacity: 1,
    stagger: 0.5,
    ease: "stepped",
    repeat: -1
  });
} // THE FLASK ITEM


function AnimateFlask(moveForwards) {
  var flask = document.querySelector(".draggableItem");
  var flaskContainer = document.querySelector(".movableitemContainer");
  flaskContainer.dataset.dropped = "true"; // const tl = gsap.timeline();
  // tl.to(flaskContainer, { x: +50, y: +50 });
  // flask.dataset.dropped = "true";

  _gsap.default.to(flask, {
    rotation: 100,
    duration: 3
  });

  toMorph("flaskSVG", "#liquid", "#ShiftedLiquid", 1000);
  setTimeout(function () {
    document.querySelector("#startingPoint").dataset.show = "true";
    toMorph("flaskSVG", "#startingPoint", "#pouringliquidOne", 1000);
    turnTheLid();
    fillTheLamp();
    setTimeout(function () {
      document.querySelector("#pouringliquidOne").dataset.show = "true";
      repeatingMorphing("flaskSVG", "#pouringliquidOne", "#pouringLiquid2", 800, flask, moveForwards);
    }, 1000);
  }, 1000);
}

function turnTheLid() {
  var lampLid = document.querySelector("#lamp_lid");

  _gsap.default.to(lampLid, {
    rotation: 90,
    transformOrigin: "bottom right",
    duration: 0.5,
    ease: "bounce"
  });
}

function closeTheLampLid() {
  var lampLid = document.querySelector("#lamp_lid");

  _gsap.default.to(lampLid, {
    rotation: 0,
    transformOrigin: "bottom right",
    duration: 0.5,
    ease: "bounce"
  });
}

function fillTheLamp() {
  // THE LAMP LIQUID
  var oilLamp = document.querySelector("#theSquare");

  _gsap.default.fromTo(oilLamp, 0.8, {
    attr: {
      x: -400
    }
  }, {
    attr: {
      x: 0
    },
    repeat: 30
  }); // "Fill up" animation


  _gsap.default.fromTo(oilLamp, 10, {
    attr: {
      y: 420,
      height: 0
    }
  }, {
    attr: {
      y: -20,
      height: 440
    }
  });
}

function toMorph(svgId, firstPath, pathToMorphto, duration) {
  var svg = document.querySelector(svgId);
  var s = (0, _snapsvg.default)(svg);

  var firstElement = _snapsvg.default.select(firstPath);

  var secondElement = _snapsvg.default.select(pathToMorphto);

  var firstElementPoints = firstElement.node.getAttribute("d");
  var secondElementPoints = secondElement.node.getAttribute("d");

  var morphing = function morphing() {
    firstElement.animate({
      d: secondElementPoints
    }, duration, mina.easeout);
  };

  morphing();
}

function repeatingMorphing(svgId, firstPath, pathToMorphto, duration, infiniteRepeat, moveForwards) {
  var svg = document.querySelector(svgId);
  var s = (0, _snapsvg.default)(svg);

  var firstElement = _snapsvg.default.select(firstPath);

  var secondElement = _snapsvg.default.select(pathToMorphto);

  var firstElementPoints = firstElement.node.getAttribute("d");
  var secondElementPoints = secondElement.node.getAttribute("d");

  var toPreviousPath = function toPreviousPath() {
    firstElement.animate({
      d: secondElementPoints
    }, duration, mina.backout, toNextPath);
  };

  var toNextPath = function toNextPath() {
    firstElement.animate({
      d: firstElementPoints
    }, duration, mina.backout, toPreviousPath);
  };

  setTimeout(function () {
    if (infiniteRepeat === true) {
      return;
    } else {
      firstElement.stop();
      closeTheLampLid();
      removeItemFromDisplay(".draggableItem");
      setTimeout(function () {
        moveForwards();
      }, 1000);
    }
  }, 4000);
  toNextPath();
}

function removeItemFromDisplay(itemIdOrClass) {
  var item = document.querySelector(itemIdOrClass);

  _gsap.default.to(item, {
    opacity: 0,
    duration: 0.3,
    ease: "easeout"
  });
}
},{"interactjs":"node_modules/interactjs/dist/interact.min.js","gsap":"node_modules/gsap/index.js","snapsvg":"node_modules/snapsvg/dist/snap.svg.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

require("./style.scss");

require("./levelTwoAndThree.scss");

var _ImportJson = require("./modules/ImportJson.js");

var _appendText = require("./modules/appendText.js");

var _appendImg = require("./modules/appendImg.js");

var _Draggable = require("./modules/Draggable");

var _gsap = require("gsap");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Stage = 0;
var Part = 0;
document.addEventListener("DOMContentLoaded", datacheck(0, 0));
document.addEventListener("DOMContentLoaded", listen);

function datacheck(_x, _x2) {
  return _datacheck.apply(this, arguments);
}

function _datacheck() {
  _datacheck = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee(Stages, Parts) {
    var data;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return (0, _ImportJson.GetJsonData)(Stage, Part);

          case 2:
            data = _context.sent;
            (0, _appendText.AppendText)(data);
            (0, _appendImg.AppendImg)(data);
            activateAnimation();

          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _datacheck.apply(this, arguments);
}

function moveForwards() {
  return _moveForwards.apply(this, arguments);
}

function _moveForwards() {
  _moveForwards = (0, _asyncToGenerator2.default)( /*#__PURE__*/_regenerator.default.mark(function _callee2() {
    var where;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return (0, _ImportJson.GetJsonData)(Stage);

          case 2:
            where = _context2.sent;
            setTimeout(function () {
              if (Stage === 1 && Part === 5) {
                window.open("./nextLevels.html", "_self");
                Stage = 0;
                Part = 0;
              } else if (Part + 1 < where[0].parts.length) {
                Part++;
                datacheck();
              } else if (Stage == 3 && Part + 1 == where[0].parts.length) {
                document.querySelector(".Instructions").textContent = "";
              } else {
                Part = 0;
                Stage++;
                datacheck();
              }
            }, 50);
            chapterAnimation();
            listen();

          case 6:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return _moveForwards.apply(this, arguments);
}

var clickFunc = function clickFunc() {
  (0, _Draggable.DraggElement)();
  var level = document.querySelector(".ImageContainer").dataset.chapter;

  if (level === "lvl1-p5") {} else if (level != "lvl1-p5" && level != "lvl1-p3") {
    moveForwards();
  } // if (this.dataset.what == "bottom" || this.dataset.what == "[img]") {
  // }

};

function chapterAnimation() {
  var container = document.querySelector(".ImageContainer");

  if (container.dataset.chapter == "lvl1-p2") {
    setTimeout(function () {
      var check = setInterval(isDropped, 1000);

      function isDropped() {
        var dropZone = document.querySelector(".dropzone");

        if (dropZone.dataset.moving == "dropped") {
          clearInterval(check);
          var whichOne = "chop";
          activateAnimation(whichOne);
        }
      }
    }, 1000);
  } //// All of these if statements are checking the current one when beign clicked, after clicking it's moved forwards and the level is higher
  //// For example here lvl1-p3 is the level before I activate the animation After.


  if (container.dataset.chapter == "lvl1-p3") {
    setTimeout(function () {
      var whichOne = "After";
      activateAnimation(whichOne);
    }, 1000);
  }

  if (container.dataset.chapter == "lvl1-p4") {
    var whichOne = "friction";
    activateAnimation(whichOne);
  }

  if (container.dataset.chapter == "lvl1-p5") {
    setTimeout(function () {
      var camp = document.querySelector("#camp"); // const girls = camp.querySelector("#Girls");
      // girls.setAttribute("fill", "none");
    }, 1500);
  }
}

var count = 0;

var dofriction = function dofriction() {
  var condition = isOdd(count);

  if (condition == false) {
    _gsap.gsap.to(this, {
      duration: 0.2,
      y: +20
    });

    _gsap.gsap.to(this, {
      duration: 0.2,
      x: -50
    });
  } else if (count == 12) {
    moveForwards();
  } else {
    _gsap.gsap.to(this, {
      duration: 0.2,
      x: +100
    });

    _gsap.gsap.to(this, {
      duration: 0.2,
      y: +20
    });
  }

  function isOdd(num) {
    count++;
    return num % 2 == 1;
  }
};

function activateAnimation(whichOne) {
  listen();

  if (whichOne == "chop") {
    _gsap.gsap.to(".movableitemContainer", {
      ease: "back.out(2)",
      duration: 0.5,
      y: -120,
      x: -140,
      rotation: 40
    });

    _gsap.gsap.to(".movableitemContainer", {
      delay: 0.5,
      duration: 0.5,
      y: -130,
      x: -120
    });

    _gsap.gsap.to(".movableitemContainer", {
      delay: 1,
      duration: 0.5,
      y: -120,
      x: -140
    });

    _gsap.gsap.to(".movableitemContainer", {
      delay: 1.5,
      duration: 0.5,
      y: -250,
      x: -250,
      rotation: 0
    });

    _gsap.gsap.to(".movableitemContainer", {
      delay: 2,
      duration: 0.3,
      ease: "expo.out",
      y: +100,
      x: +150,
      rotation: 90
    });

    _gsap.gsap.to("[data-name=\"woodChopped-2\"]", {
      delay: 2.1,
      duration: 0.3,
      ease: "expo.out",
      y: -90,
      x: +150,
      rotation: 90
    });

    _gsap.gsap.to("[data-name=\"woodChopped-1\"]", {
      delay: 2.1,
      duration: 0.3,
      ease: "expo.out",
      y: -10,
      x: -100,
      rotation: 30
    });

    setTimeout(function () {
      moveForwards();
    }, 3000);
    setTimeout(function () {
      activateAnimation("After");
    }, 4000); //find this
  } else if (whichOne == "After") {
    setTimeout(function () {
      _gsap.gsap.to("[data-name=\"stick\"]", {
        repeat: -1,
        duration: 1,
        ease: "bounce.out",
        y: 10
      });
    }, 1000);
  } else if (whichOne == "friction") {
    setTimeout(function () {
      var hands = document.querySelector("[data-name=\"firctionHands\"]");
      hands.addEventListener("click", dofriction);
    }, 2000);
  }
}

function listen() {
  setTimeout(function () {
    var element2 = document.querySelectorAll(".NOTmovableitemContainer");
    element2.forEach(function (e) {
      e.addEventListener("click", e = clickFunc);
    });
  }, 1500);
}
},{"@babel/runtime/regenerator":"node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"node_modules/@babel/runtime/helpers/asyncToGenerator.js","./style.scss":"style.scss","./levelTwoAndThree.scss":"levelTwoAndThree.scss","./modules/ImportJson.js":"modules/ImportJson.js","./modules/appendText.js":"modules/appendText.js","./modules/appendImg.js":"modules/appendImg.js","./modules/Draggable":"modules/Draggable.js","gsap":"node_modules/gsap/index.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60891" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/Advanced-animation.e31bb0bc.js.map