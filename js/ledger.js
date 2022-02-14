(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.NewLedger = {}));
})(this, (function (exports) { 'use strict';

	function _mergeNamespaces(n, m) {
		m.forEach(function (e) {
			e && typeof e !== 'string' && !Array.isArray(e) && Object.keys(e).forEach(function (k) {
				if (k !== 'default' && !(k in n)) {
					var d = Object.getOwnPropertyDescriptor(e, k);
					Object.defineProperty(n, k, d.get ? d : {
						enumerable: true,
						get: function () { return e[k]; }
					});
				}
			});
		});
		return Object.freeze(n);
	}

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function getAugmentedNamespace(n) {
		if (n.__esModule) return n;
		var a = Object.defineProperty({}, '__esModule', {value: true});
		Object.keys(n).forEach(function (k) {
			var d = Object.getOwnPropertyDescriptor(n, k);
			Object.defineProperty(a, k, d.get ? d : {
				enumerable: true,
				get: function () {
					return n[k];
				}
			});
		});
		return a;
	}

	var runtime = {exports: {}};

	/**
	 * Copyright (c) 2014-present, Facebook, Inc.
	 *
	 * This source code is licensed under the MIT license found in the
	 * LICENSE file in the root directory of this source tree.
	 */

	(function (module) {
	var runtime = (function (exports) {

	  var Op = Object.prototype;
	  var hasOwn = Op.hasOwnProperty;
	  var undefined$1; // More compressible than void 0.
	  var $Symbol = typeof Symbol === "function" ? Symbol : {};
	  var iteratorSymbol = $Symbol.iterator || "@@iterator";
	  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
	  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

	  function define(obj, key, value) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	    return obj[key];
	  }
	  try {
	    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
	    define({}, "");
	  } catch (err) {
	    define = function(obj, key, value) {
	      return obj[key] = value;
	    };
	  }

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
	  define(IteratorPrototype, iteratorSymbol, function () {
	    return this;
	  });

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
	  GeneratorFunction.prototype = GeneratorFunctionPrototype;
	  define(Gp, "constructor", GeneratorFunctionPrototype);
	  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
	  GeneratorFunction.displayName = define(
	    GeneratorFunctionPrototype,
	    toStringTagSymbol,
	    "GeneratorFunction"
	  );

	  // Helper for defining the .next, .throw, and .return methods of the
	  // Iterator interface in terms of a single ._invoke method.
	  function defineIteratorMethods(prototype) {
	    ["next", "throw", "return"].forEach(function(method) {
	      define(prototype, method, function(arg) {
	        return this._invoke(method, arg);
	      });
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
	      define(genFun, toStringTagSymbol, "GeneratorFunction");
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
	  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
	    return this;
	  });
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
	    if (method === undefined$1) {
	      // A .throw or .return when the delegate iterator has no .throw
	      // method always terminates the yield* loop.
	      context.delegate = null;

	      if (context.method === "throw") {
	        // Note: ["return"] must be used for ES3 parsing compatibility.
	        if (delegate.iterator["return"]) {
	          // If the delegate iterator has a return method, give it a
	          // chance to clean up.
	          context.method = "return";
	          context.arg = undefined$1;
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
	        context.arg = undefined$1;
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

	  define(Gp, toStringTagSymbol, "Generator");

	  // A Generator should always return itself as the iterator object when the
	  // @@iterator function is called on it. Some browsers' implementations of the
	  // iterator prototype chain incorrectly implement this, causing the Generator
	  // object to not be returned from this call. This ensures that doesn't happen.
	  // See https://github.com/facebook/regenerator/issues/274 for more details.
	  define(Gp, iteratorSymbol, function() {
	    return this;
	  });

	  define(Gp, "toString", function() {
	    return "[object Generator]";
	  });

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

	          next.value = undefined$1;
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
	    return { value: undefined$1, done: true };
	  }

	  Context.prototype = {
	    constructor: Context,

	    reset: function(skipTempReset) {
	      this.prev = 0;
	      this.next = 0;
	      // Resetting context._sent for legacy support of Babel's
	      // function.sent implementation.
	      this.sent = this._sent = undefined$1;
	      this.done = false;
	      this.delegate = null;

	      this.method = "next";
	      this.arg = undefined$1;

	      this.tryEntries.forEach(resetTryEntry);

	      if (!skipTempReset) {
	        for (var name in this) {
	          // Not sure about the optimal order of these conditions:
	          if (name.charAt(0) === "t" &&
	              hasOwn.call(this, name) &&
	              !isNaN(+name.slice(1))) {
	            this[name] = undefined$1;
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
	          context.arg = undefined$1;
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
	        this.arg = undefined$1;
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
	  module.exports 
	));

	try {
	  regeneratorRuntime = runtime;
	} catch (accidentalStrictMode) {
	  // This module should not be running in strict mode, so the above
	  // assignment should always work unless something is misconfigured. Just
	  // in case runtime.js accidentally runs in strict mode, in modern engines
	  // we can explicitly access globalThis. In older engines we can escape
	  // strict mode using a global Function call. This could conceivably fail
	  // if a Content Security Policy forbids using Function, but in that case
	  // the proper solution is to fix the accidental strict mode problem. If
	  // you've misconfigured your bundler to force strict mode and applied a
	  // CSP to forbid Function, and you're not willing to fix either of those
	  // problems, please detail your unique predicament in a GitHub issue.
	  if (typeof globalThis === "object") {
	    globalThis.regeneratorRuntime = runtime;
	  } else {
	    Function("r", "regeneratorRuntime = r")(runtime);
	  }
	}
	}(runtime));

	var global$1 = (typeof global !== "undefined" ? global :
	            typeof self !== "undefined" ? self :
	            typeof window !== "undefined" ? window : {});

	var lookup$1 = [];
	var revLookup$1 = [];
	var Arr$1 = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;
	var inited = false;
	function init () {
	  inited = true;
	  var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	  for (var i = 0, len = code.length; i < len; ++i) {
	    lookup$1[i] = code[i];
	    revLookup$1[code.charCodeAt(i)] = i;
	  }

	  revLookup$1['-'.charCodeAt(0)] = 62;
	  revLookup$1['_'.charCodeAt(0)] = 63;
	}

	function toByteArray$1 (b64) {
	  if (!inited) {
	    init();
	  }
	  var i, j, l, tmp, placeHolders, arr;
	  var len = b64.length;

	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // the number of equal signs (place holders)
	  // if there are two placeholders, than the two characters before it
	  // represent one byte
	  // if there is only one, then the three characters before it represent 2 bytes
	  // this is just a cheap hack to not do indexOf twice
	  placeHolders = b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0;

	  // base64 is 4/3 + up to two characters of the original data
	  arr = new Arr$1(len * 3 / 4 - placeHolders);

	  // if there are placeholders, only get up to the last complete 4 chars
	  l = placeHolders > 0 ? len - 4 : len;

	  var L = 0;

	  for (i = 0, j = 0; i < l; i += 4, j += 3) {
	    tmp = (revLookup$1[b64.charCodeAt(i)] << 18) | (revLookup$1[b64.charCodeAt(i + 1)] << 12) | (revLookup$1[b64.charCodeAt(i + 2)] << 6) | revLookup$1[b64.charCodeAt(i + 3)];
	    arr[L++] = (tmp >> 16) & 0xFF;
	    arr[L++] = (tmp >> 8) & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }

	  if (placeHolders === 2) {
	    tmp = (revLookup$1[b64.charCodeAt(i)] << 2) | (revLookup$1[b64.charCodeAt(i + 1)] >> 4);
	    arr[L++] = tmp & 0xFF;
	  } else if (placeHolders === 1) {
	    tmp = (revLookup$1[b64.charCodeAt(i)] << 10) | (revLookup$1[b64.charCodeAt(i + 1)] << 4) | (revLookup$1[b64.charCodeAt(i + 2)] >> 2);
	    arr[L++] = (tmp >> 8) & 0xFF;
	    arr[L++] = tmp & 0xFF;
	  }

	  return arr
	}

	function tripletToBase64$1 (num) {
	  return lookup$1[num >> 18 & 0x3F] + lookup$1[num >> 12 & 0x3F] + lookup$1[num >> 6 & 0x3F] + lookup$1[num & 0x3F]
	}

	function encodeChunk$1 (uint8, start, end) {
	  var tmp;
	  var output = [];
	  for (var i = start; i < end; i += 3) {
	    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
	    output.push(tripletToBase64$1(tmp));
	  }
	  return output.join('')
	}

	function fromByteArray$1 (uint8) {
	  if (!inited) {
	    init();
	  }
	  var tmp;
	  var len = uint8.length;
	  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
	  var output = '';
	  var parts = [];
	  var maxChunkLength = 16383; // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk$1(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1];
	    output += lookup$1[tmp >> 2];
	    output += lookup$1[(tmp << 4) & 0x3F];
	    output += '==';
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + (uint8[len - 1]);
	    output += lookup$1[tmp >> 10];
	    output += lookup$1[(tmp >> 4) & 0x3F];
	    output += lookup$1[(tmp << 2) & 0x3F];
	    output += '=';
	  }

	  parts.push(output);

	  return parts.join('')
	}

	function read (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? (nBytes - 1) : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];

	  i += d;

	  e = s & ((1 << (-nBits)) - 1);
	  s >>= (-nBits);
	  nBits += eLen;
	  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1);
	  e >>= (-nBits);
	  nBits += mLen;
	  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	}

	function write (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = nBytes * 8 - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
	  var i = isLE ? 0 : (nBytes - 1);
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = (value * c - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128;
	}

	var toString = {}.toString;

	var isArray$3 = Array.isArray || function (arr) {
	  return toString.call(arr) == '[object Array]';
	};

	var INSPECT_MAX_BYTES = 50;

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Use Object implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * Due to various browser bugs, sometimes the Object implementation will be used even
	 * when the browser supports typed arrays.
	 *
	 * Note:
	 *
	 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
	 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
	 *
	 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
	 *
	 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
	 *     incorrect length in some situations.

	 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
	 * get the Object implementation, which is slower but behaves correctly.
	 */
	Buffer$e.TYPED_ARRAY_SUPPORT = global$1.TYPED_ARRAY_SUPPORT !== undefined
	  ? global$1.TYPED_ARRAY_SUPPORT
	  : true;

	function kMaxLength () {
	  return Buffer$e.TYPED_ARRAY_SUPPORT
	    ? 0x7fffffff
	    : 0x3fffffff
	}

	function createBuffer (that, length) {
	  if (kMaxLength() < length) {
	    throw new RangeError('Invalid typed array length')
	  }
	  if (Buffer$e.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = new Uint8Array(length);
	    that.__proto__ = Buffer$e.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    if (that === null) {
	      that = new Buffer$e(length);
	    }
	    that.length = length;
	  }

	  return that
	}

	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */

	function Buffer$e (arg, encodingOrOffset, length) {
	  if (!Buffer$e.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer$e)) {
	    return new Buffer$e(arg, encodingOrOffset, length)
	  }

	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new Error(
	        'If encoding is specified then the first argument must be a string'
	      )
	    }
	    return allocUnsafe(this, arg)
	  }
	  return from(this, arg, encodingOrOffset, length)
	}

	Buffer$e.poolSize = 8192; // not used by this implementation

	// TODO: Legacy, not needed anymore. Remove in next major version.
	Buffer$e._augment = function (arr) {
	  arr.__proto__ = Buffer$e.prototype;
	  return arr
	};

	function from (that, value, encodingOrOffset, length) {
	  if (typeof value === 'number') {
	    throw new TypeError('"value" argument must not be a number')
	  }

	  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
	    return fromArrayBuffer(that, value, encodingOrOffset, length)
	  }

	  if (typeof value === 'string') {
	    return fromString(that, value, encodingOrOffset)
	  }

	  return fromObject(that, value)
	}

	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer$e.from = function (value, encodingOrOffset, length) {
	  return from(null, value, encodingOrOffset, length)
	};

	if (Buffer$e.TYPED_ARRAY_SUPPORT) {
	  Buffer$e.prototype.__proto__ = Uint8Array.prototype;
	  Buffer$e.__proto__ = Uint8Array;
	}

	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be a number')
	  } else if (size < 0) {
	    throw new RangeError('"size" argument must not be negative')
	  }
	}

	function alloc (that, size, fill, encoding) {
	  assertSize(size);
	  if (size <= 0) {
	    return createBuffer(that, size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpretted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(that, size).fill(fill, encoding)
	      : createBuffer(that, size).fill(fill)
	  }
	  return createBuffer(that, size)
	}

	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer$e.alloc = function (size, fill, encoding) {
	  return alloc(null, size, fill, encoding)
	};

	function allocUnsafe (that, size) {
	  assertSize(size);
	  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
	  if (!Buffer$e.TYPED_ARRAY_SUPPORT) {
	    for (var i = 0; i < size; ++i) {
	      that[i] = 0;
	    }
	  }
	  return that
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer$e.allocUnsafe = function (size) {
	  return allocUnsafe(null, size)
	};
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer$e.allocUnsafeSlow = function (size) {
	  return allocUnsafe(null, size)
	};

	function fromString (that, string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8';
	  }

	  if (!Buffer$e.isEncoding(encoding)) {
	    throw new TypeError('"encoding" must be a valid string encoding')
	  }

	  var length = byteLength$1(string, encoding) | 0;
	  that = createBuffer(that, length);

	  var actual = that.write(string, encoding);

	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    that = that.slice(0, actual);
	  }

	  return that
	}

	function fromArrayLike (that, array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0;
	  that = createBuffer(that, length);
	  for (var i = 0; i < length; i += 1) {
	    that[i] = array[i] & 255;
	  }
	  return that
	}

	function fromArrayBuffer (that, array, byteOffset, length) {
	  array.byteLength; // this throws if `array` is not a valid ArrayBuffer

	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('\'offset\' is out of bounds')
	  }

	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('\'length\' is out of bounds')
	  }

	  if (byteOffset === undefined && length === undefined) {
	    array = new Uint8Array(array);
	  } else if (length === undefined) {
	    array = new Uint8Array(array, byteOffset);
	  } else {
	    array = new Uint8Array(array, byteOffset, length);
	  }

	  if (Buffer$e.TYPED_ARRAY_SUPPORT) {
	    // Return an augmented `Uint8Array` instance, for best performance
	    that = array;
	    that.__proto__ = Buffer$e.prototype;
	  } else {
	    // Fallback: Return an object instance of the Buffer class
	    that = fromArrayLike(that, array);
	  }
	  return that
	}

	function fromObject (that, obj) {
	  if (internalIsBuffer(obj)) {
	    var len = checked(obj.length) | 0;
	    that = createBuffer(that, len);

	    if (that.length === 0) {
	      return that
	    }

	    obj.copy(that, 0, 0, len);
	    return that
	  }

	  if (obj) {
	    if ((typeof ArrayBuffer !== 'undefined' &&
	        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
	      if (typeof obj.length !== 'number' || isnan(obj.length)) {
	        return createBuffer(that, 0)
	      }
	      return fromArrayLike(that, obj)
	    }

	    if (obj.type === 'Buffer' && isArray$3(obj.data)) {
	      return fromArrayLike(that, obj.data)
	    }
	  }

	  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
	}

	function checked (length) {
	  // Note: cannot use `length < kMaxLength()` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= kMaxLength()) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
	  }
	  return length | 0
	}
	Buffer$e.isBuffer = isBuffer;
	function internalIsBuffer (b) {
	  return !!(b != null && b._isBuffer)
	}

	Buffer$e.compare = function compare (a, b) {
	  if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
	    throw new TypeError('Arguments must be Buffers')
	  }

	  if (a === b) return 0

	  var x = a.length;
	  var y = b.length;

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i];
	      y = b[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	Buffer$e.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	};

	Buffer$e.concat = function concat (list, length) {
	  if (!isArray$3(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }

	  if (list.length === 0) {
	    return Buffer$e.alloc(0)
	  }

	  var i;
	  if (length === undefined) {
	    length = 0;
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length;
	    }
	  }

	  var buffer = Buffer$e.allocUnsafe(length);
	  var pos = 0;
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i];
	    if (!internalIsBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    }
	    buf.copy(buffer, pos);
	    pos += buf.length;
	  }
	  return buffer
	};

	function byteLength$1 (string, encoding) {
	  if (internalIsBuffer(string)) {
	    return string.length
	  }
	  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
	      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    string = '' + string;
	  }

	  var len = string.length;
	  if (len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	      case undefined:
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) return utf8ToBytes(string).length // assume utf8
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	}
	Buffer$e.byteLength = byteLength$1;

	function slowToString (encoding, start, end) {
	  var loweredCase = false;

	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.

	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0;
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }

	  if (end === undefined || end > this.length) {
	    end = this.length;
	  }

	  if (end <= 0) {
	    return ''
	  }

	  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0;
	  start >>>= 0;

	  if (end <= start) {
	    return ''
	  }

	  if (!encoding) encoding = 'utf8';

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase();
	        loweredCase = true;
	    }
	  }
	}

	// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
	// Buffer instances.
	Buffer$e.prototype._isBuffer = true;

	function swap (b, n, m) {
	  var i = b[n];
	  b[n] = b[m];
	  b[m] = i;
	}

	Buffer$e.prototype.swap16 = function swap16 () {
	  var len = this.length;
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1);
	  }
	  return this
	};

	Buffer$e.prototype.swap32 = function swap32 () {
	  var len = this.length;
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3);
	    swap(this, i + 1, i + 2);
	  }
	  return this
	};

	Buffer$e.prototype.swap64 = function swap64 () {
	  var len = this.length;
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7);
	    swap(this, i + 1, i + 6);
	    swap(this, i + 2, i + 5);
	    swap(this, i + 3, i + 4);
	  }
	  return this
	};

	Buffer$e.prototype.toString = function toString () {
	  var length = this.length | 0;
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	};

	Buffer$e.prototype.equals = function equals (b) {
	  if (!internalIsBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer$e.compare(this, b) === 0
	};

	Buffer$e.prototype.inspect = function inspect () {
	  var str = '';
	  var max = INSPECT_MAX_BYTES;
	  if (this.length > 0) {
	    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ');
	    if (this.length > max) str += ' ... ';
	  }
	  return '<Buffer ' + str + '>'
	};

	Buffer$e.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (!internalIsBuffer(target)) {
	    throw new TypeError('Argument must be a Buffer')
	  }

	  if (start === undefined) {
	    start = 0;
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0;
	  }
	  if (thisStart === undefined) {
	    thisStart = 0;
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length;
	  }

	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }

	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }

	  start >>>= 0;
	  end >>>= 0;
	  thisStart >>>= 0;
	  thisEnd >>>= 0;

	  if (this === target) return 0

	  var x = thisEnd - thisStart;
	  var y = end - start;
	  var len = Math.min(x, y);

	  var thisCopy = this.slice(thisStart, thisEnd);
	  var targetCopy = target.slice(start, end);

	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i];
	      y = targetCopy[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1

	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset;
	    byteOffset = 0;
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff;
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000;
	  }
	  byteOffset = +byteOffset;  // Coerce to Number.
	  if (isNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1);
	  }

	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1;
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0;
	    else return -1
	  }

	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer$e.from(val, encoding);
	  }

	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (internalIsBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF; // Search for a byte value [0-255]
	    if (Buffer$e.TYPED_ARRAY_SUPPORT &&
	        typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1;
	  var arrLength = arr.length;
	  var valLength = val.length;

	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase();
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2;
	      arrLength /= 2;
	      valLength /= 2;
	      byteOffset /= 2;
	    }
	  }

	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }

	  var i;
	  if (dir) {
	    var foundIndex = -1;
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i;
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex;
	        foundIndex = -1;
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true;
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false;
	          break
	        }
	      }
	      if (found) return i
	    }
	  }

	  return -1
	}

	Buffer$e.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	};

	Buffer$e.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	};

	Buffer$e.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	};

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0;
	  var remaining = buf.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = Number(length);
	    if (length > remaining) {
	      length = remaining;
	    }
	  }

	  // must be an even number of digits
	  var strLen = string.length;
	  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

	  if (length > strLen / 2) {
	    length = strLen / 2;
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16);
	    if (isNaN(parsed)) return i
	    buf[offset + i] = parsed;
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function latin1Write (buf, string, offset, length) {
	  return asciiWrite(buf, string, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer$e.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8';
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset;
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset | 0;
	    if (isFinite(length)) {
	      length = length | 0;
	      if (encoding === undefined) encoding = 'utf8';
	    } else {
	      encoding = length;
	      length = undefined;
	    }
	  // legacy write(string, encoding, offset, length) - remove in v0.13
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }

	  var remaining = this.length - offset;
	  if (length === undefined || length > remaining) length = remaining;

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8';

	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	        return asciiWrite(this, string, offset, length)

	      case 'latin1':
	      case 'binary':
	        return latin1Write(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	};

	Buffer$e.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	};

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return fromByteArray$1(buf)
	  } else {
	    return fromByteArray$1(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end);
	  var res = [];

	  var i = start;
	  while (i < end) {
	    var firstByte = buf[i];
	    var codePoint = null;
	    var bytesPerSequence = (firstByte > 0xEF) ? 4
	      : (firstByte > 0xDF) ? 3
	      : (firstByte > 0xBF) ? 2
	      : 1;

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint;

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte;
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1];
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          fourthByte = buf[i + 3];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint;
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD;
	      bytesPerSequence = 1;
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000;
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
	      codePoint = 0xDC00 | codePoint & 0x3FF;
	    }

	    res.push(codePoint);
	    i += bytesPerSequence;
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000;

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length;
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = '';
	  var i = 0;
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    );
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F);
	  }
	  return ret
	}

	function latin1Slice (buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i]);
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length;

	  if (!start || start < 0) start = 0;
	  if (!end || end < 0 || end > len) end = len;

	  var out = '';
	  for (var i = start; i < end; ++i) {
	    out += toHex(buf[i]);
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end);
	  var res = '';
	  for (var i = 0; i < bytes.length; i += 2) {
	    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
	  }
	  return res
	}

	Buffer$e.prototype.slice = function slice (start, end) {
	  var len = this.length;
	  start = ~~start;
	  end = end === undefined ? len : ~~end;

	  if (start < 0) {
	    start += len;
	    if (start < 0) start = 0;
	  } else if (start > len) {
	    start = len;
	  }

	  if (end < 0) {
	    end += len;
	    if (end < 0) end = 0;
	  } else if (end > len) {
	    end = len;
	  }

	  if (end < start) end = start;

	  var newBuf;
	  if (Buffer$e.TYPED_ARRAY_SUPPORT) {
	    newBuf = this.subarray(start, end);
	    newBuf.__proto__ = Buffer$e.prototype;
	  } else {
	    var sliceLen = end - start;
	    newBuf = new Buffer$e(sliceLen, undefined);
	    for (var i = 0; i < sliceLen; ++i) {
	      newBuf[i] = this[i + start];
	    }
	  }

	  return newBuf
	};

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer$e.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }

	  return val
	};

	Buffer$e.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length);
	  }

	  var val = this[offset + --byteLength];
	  var mul = 1;
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul;
	  }

	  return val
	};

	Buffer$e.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  return this[offset]
	};

	Buffer$e.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] | (this[offset + 1] << 8)
	};

	Buffer$e.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return (this[offset] << 8) | this[offset + 1]
	};

	Buffer$e.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	};

	Buffer$e.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	};

	Buffer$e.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer$e.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var i = byteLength;
	  var mul = 1;
	  var val = this[offset + --i];
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer$e.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	};

	Buffer$e.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset] | (this[offset + 1] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer$e.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset + 1] | (this[offset] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer$e.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	};

	Buffer$e.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	};

	Buffer$e.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return read(this, offset, true, 23, 4)
	};

	Buffer$e.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return read(this, offset, false, 23, 4)
	};

	Buffer$e.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return read(this, offset, true, 52, 8)
	};

	Buffer$e.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return read(this, offset, false, 52, 8)
	};

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!internalIsBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}

	Buffer$e.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  var mul = 1;
	  var i = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer$e.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  byteLength = byteLength | 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer$e.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
	  if (!Buffer$e.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	function objectWriteUInt16 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
	    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
	      (littleEndian ? i : 1 - i) * 8;
	  }
	}

	Buffer$e.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer$e.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2
	};

	Buffer$e.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  if (Buffer$e.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8);
	    this[offset + 1] = (value & 0xff);
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2
	};

	function objectWriteUInt32 (buf, value, offset, littleEndian) {
	  if (value < 0) value = 0xffffffff + value + 1;
	  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
	    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff;
	  }
	}

	Buffer$e.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer$e.TYPED_ARRAY_SUPPORT) {
	    this[offset + 3] = (value >>> 24);
	    this[offset + 2] = (value >>> 16);
	    this[offset + 1] = (value >>> 8);
	    this[offset] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4
	};

	Buffer$e.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  if (Buffer$e.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24);
	    this[offset + 1] = (value >>> 16);
	    this[offset + 2] = (value >>> 8);
	    this[offset + 3] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4
	};

	Buffer$e.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = 0;
	  var mul = 1;
	  var sub = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer$e.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, 8 * byteLength - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  var sub = 0;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer$e.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
	  if (!Buffer$e.TYPED_ARRAY_SUPPORT) value = Math.floor(value);
	  if (value < 0) value = 0xff + value + 1;
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	Buffer$e.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer$e.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	  } else {
	    objectWriteUInt16(this, value, offset, true);
	  }
	  return offset + 2
	};

	Buffer$e.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  if (Buffer$e.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 8);
	    this[offset + 1] = (value & 0xff);
	  } else {
	    objectWriteUInt16(this, value, offset, false);
	  }
	  return offset + 2
	};

	Buffer$e.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (Buffer$e.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value & 0xff);
	    this[offset + 1] = (value >>> 8);
	    this[offset + 2] = (value >>> 16);
	    this[offset + 3] = (value >>> 24);
	  } else {
	    objectWriteUInt32(this, value, offset, true);
	  }
	  return offset + 4
	};

	Buffer$e.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset | 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (value < 0) value = 0xffffffff + value + 1;
	  if (Buffer$e.TYPED_ARRAY_SUPPORT) {
	    this[offset] = (value >>> 24);
	    this[offset + 1] = (value >>> 16);
	    this[offset + 2] = (value >>> 8);
	    this[offset + 3] = (value & 0xff);
	  } else {
	    objectWriteUInt32(this, value, offset, false);
	  }
	  return offset + 4
	};

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4);
	  }
	  write(buf, value, offset, littleEndian, 23, 4);
	  return offset + 4
	}

	Buffer$e.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	};

	Buffer$e.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	};

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8);
	  }
	  write(buf, value, offset, littleEndian, 52, 8);
	  return offset + 8
	}

	Buffer$e.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	};

	Buffer$e.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	};

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer$e.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!start) start = 0;
	  if (!end && end !== 0) end = this.length;
	  if (targetStart >= target.length) targetStart = target.length;
	  if (!targetStart) targetStart = 0;
	  if (end > 0 && end < start) end = start;

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length;
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start;
	  }

	  var len = end - start;
	  var i;

	  if (this === target && start < targetStart && targetStart < end) {
	    // descending copy from end
	    for (i = len - 1; i >= 0; --i) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else if (len < 1000 || !Buffer$e.TYPED_ARRAY_SUPPORT) {
	    // ascending copy from start
	    for (i = 0; i < len; ++i) {
	      target[i + targetStart] = this[i + start];
	    }
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, start + len),
	      targetStart
	    );
	  }

	  return len
	};

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer$e.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start;
	      start = 0;
	      end = this.length;
	    } else if (typeof end === 'string') {
	      encoding = end;
	      end = this.length;
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0);
	      if (code < 256) {
	        val = code;
	      }
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer$e.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255;
	  }

	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }

	  if (end <= start) {
	    return this
	  }

	  start = start >>> 0;
	  end = end === undefined ? this.length : end >>> 0;

	  if (!val) val = 0;

	  var i;
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val;
	    }
	  } else {
	    var bytes = internalIsBuffer(val)
	      ? val
	      : utf8ToBytes(new Buffer$e(val, encoding).toString());
	    var len = bytes.length;
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len];
	    }
	  }

	  return this
	};

	// HELPER FUNCTIONS
	// ================

	var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;

	function base64clean (str) {
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = stringtrim(str).replace(INVALID_BASE64_RE, '');
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '=';
	  }
	  return str
	}

	function stringtrim (str) {
	  if (str.trim) return str.trim()
	  return str.replace(/^\s+|\s+$/g, '')
	}

	function toHex (n) {
	  if (n < 16) return '0' + n.toString(16)
	  return n.toString(16)
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity;
	  var codePoint;
	  var length = string.length;
	  var leadSurrogate = null;
	  var bytes = [];

	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i);

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint;

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	        leadSurrogate = codePoint;
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	    }

	    leadSurrogate = null;

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint);
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF);
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo;
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i);
	    hi = c >> 8;
	    lo = c % 256;
	    byteArray.push(lo);
	    byteArray.push(hi);
	  }

	  return byteArray
	}


	function base64ToBytes (str) {
	  return toByteArray$1(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i];
	  }
	  return i
	}

	function isnan (val) {
	  return val !== val // eslint-disable-line no-self-compare
	}


	// the following is from is-buffer, also by Feross Aboukhadijeh and with same lisence
	// The _isBuffer check is for Safari 5-7 support, because it's missing
	// Object.prototype.constructor. Remove this eventually
	function isBuffer(obj) {
	  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj))
	}

	function isFastBuffer (obj) {
	  return !!obj.constructor && typeof obj.constructor.isBuffer === 'function' && obj.constructor.isBuffer(obj)
	}

	// For Node v0.10 support. Remove this eventually.
	function isSlowBuffer (obj) {
	  return typeof obj.readFloatLE === 'function' && typeof obj.slice === 'function' && isFastBuffer(obj.slice(0, 0))
	}

	/*
	 * Bitcoin BIP32 path helpers
	 * (C) 2016 Alex Beregszaszi
	 */

	const HARDENED = 0x80000000;

	var BIPPath = function (path) {
	  if (!Array.isArray(path)) {
	    throw new Error('Input must be an Array')
	  }
	  if (path.length === 0) {
	    throw new Error('Path must contain at least one level')
	  }
	  for (var i = 0; i < path.length; i++) {
	    if (typeof path[i] !== 'number') {
	      throw new Error('Path element is not a number')
	    }
	  }
	  this.path = path;
	};

	BIPPath.validatePathArray = function (path) {
	  try {
	    BIPPath.fromPathArray(path);
	    return true
	  } catch (e) {
	    return false
	  }
	};

	BIPPath.validateString = function (text, reqRoot) {
	  try {
	    BIPPath.fromString(text, reqRoot);
	    return true
	  } catch (e) {
	    return false
	  }
	};

	BIPPath.fromPathArray = function (path) {
	  return new BIPPath(path)
	};

	BIPPath.fromString = function (text, reqRoot) {
	  // skip the root
	  if (/^m\//i.test(text)) {
	    text = text.slice(2);
	  } else if (reqRoot) {
	    throw new Error('Root element is required')
	  }

	  var path = text.split('/');
	  var ret = new Array(path.length);
	  for (var i = 0; i < path.length; i++) {
	    var tmp = /(\d+)([hH\']?)/.exec(path[i]);
	    if (tmp === null) {
	      throw new Error('Invalid input')
	    }
	    ret[i] = parseInt(tmp[1], 10);

	    if (ret[i] >= HARDENED) {
	      throw new Error('Invalid child index')
	    }

	    if (tmp[2] === 'h' || tmp[2] === 'H' || tmp[2] === '\'') {
	      ret[i] += HARDENED;
	    } else if (tmp[2].length != 0) {
	      throw new Error('Invalid modifier')
	    }
	  }
	  return new BIPPath(ret)
	};

	BIPPath.prototype.toPathArray = function () {
	  return this.path
	};

	BIPPath.prototype.toString = function (noRoot, oldStyle) {
	  var ret = new Array(this.path.length);
	  for (var i = 0; i < this.path.length; i++) {
	    var tmp = this.path[i];
	    if (tmp & HARDENED) {
	      ret[i] = (tmp & ~HARDENED) + (oldStyle ? 'h' : '\'');
	    } else {
	      ret[i] = tmp;
	    }
	  }
	  return (noRoot ? '' : 'm/') + ret.join('/')
	};

	BIPPath.prototype.inspect = function () {
	  return 'BIPPath <' + this.toString() + '>'
	};

	var bip32Path = BIPPath;

	// flow
	var MAX_SCRIPT_BLOCK = 50;
	var DEFAULT_VERSION = 1;
	var DEFAULT_LOCKTIME = 0;
	var DEFAULT_SEQUENCE = 0xffffffff;
	var SIGHASH_ALL = 1;
	var OP_DUP = 0x76;
	var OP_HASH160 = 0xa9;
	var HASH_SIZE = 0x14;
	var OP_EQUALVERIFY = 0x88;
	var OP_CHECKSIG = 0xac;

	var __awaiter$a = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator$a = (undefined && undefined.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	function signMessage(transport, _a) {
	    var path = _a.path, messageHex = _a.messageHex;
	    return __awaiter$a(this, void 0, void 0, function () {
	        var paths, message, offset, _loop_1, res, v, r, s;
	        return __generator$a(this, function (_b) {
	            switch (_b.label) {
	                case 0:
	                    paths = bip32Path.fromString(path).toPathArray();
	                    message = Buffer$e.from(messageHex, "hex");
	                    offset = 0;
	                    _loop_1 = function () {
	                        var maxChunkSize, chunkSize, buffer;
	                        return __generator$a(this, function (_c) {
	                            switch (_c.label) {
	                                case 0:
	                                    maxChunkSize = offset === 0
	                                        ? MAX_SCRIPT_BLOCK - 1 - paths.length * 4 - 4
	                                        : MAX_SCRIPT_BLOCK;
	                                    chunkSize = offset + maxChunkSize > message.length
	                                        ? message.length - offset
	                                        : maxChunkSize;
	                                    buffer = Buffer$e.alloc(offset === 0 ? 1 + paths.length * 4 + 2 + chunkSize : chunkSize);
	                                    if (offset === 0) {
	                                        buffer[0] = paths.length;
	                                        paths.forEach(function (element, index) {
	                                            buffer.writeUInt32BE(element, 1 + 4 * index);
	                                        });
	                                        buffer.writeUInt16BE(message.length, 1 + 4 * paths.length);
	                                        message.copy(buffer, 1 + 4 * paths.length + 2, offset, offset + chunkSize);
	                                    }
	                                    else {
	                                        message.copy(buffer, 0, offset, offset + chunkSize);
	                                    }
	                                    return [4 /*yield*/, transport.send(0xe0, 0x4e, 0x00, offset === 0 ? 0x01 : 0x80, buffer)];
	                                case 1:
	                                    _c.sent();
	                                    offset += chunkSize;
	                                    return [2 /*return*/];
	                            }
	                        });
	                    };
	                    _b.label = 1;
	                case 1:
	                    if (!(offset !== message.length)) return [3 /*break*/, 3];
	                    return [5 /*yield**/, _loop_1()];
	                case 2:
	                    _b.sent();
	                    return [3 /*break*/, 1];
	                case 3: return [4 /*yield*/, transport.send(0xe0, 0x4e, 0x80, 0x00, Buffer$e.from([0x00]))];
	                case 4:
	                    res = _b.sent();
	                    v = res[0] - 0x30;
	                    r = res.slice(4, 4 + res[3]);
	                    if (r[0] === 0) {
	                        r = r.slice(1);
	                    }
	                    r = r.toString("hex");
	                    offset = 4 + res[3] + 2;
	                    s = res.slice(offset, offset + res[offset - 1]);
	                    if (s[0] === 0) {
	                        s = s.slice(1);
	                    }
	                    s = s.toString("hex");
	                    return [2 /*return*/, {
	                            v: v,
	                            r: r,
	                            s: s
	                        }];
	            }
	        });
	    });
	}

	function bip32asBuffer(path) {
	    var paths = !path ? [] : bip32Path.fromString(path).toPathArray();
	    var buffer = Buffer$e.alloc(1 + paths.length * 4);
	    buffer[0] = paths.length;
	    paths.forEach(function (element, index) {
	        buffer.writeUInt32BE(element, 1 + 4 * index);
	    });
	    return buffer;
	}

	var __assign$4 = (undefined && undefined.__assign) || function () {
	    __assign$4 = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign$4.apply(this, arguments);
	};
	var __awaiter$9 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator$9 = (undefined && undefined.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	var addressFormatMap = {
	    legacy: 0,
	    p2sh: 1,
	    bech32: 2,
	    cashaddr: 3
	};
	function getWalletPublicKey(transport, options) {
	    return __awaiter$9(this, void 0, void 0, function () {
	        var _a, path, verify, format, buffer, p1, p2, response, publicKeyLength, addressLength, publicKey, bitcoinAddress, chainCode;
	        return __generator$9(this, function (_b) {
	            switch (_b.label) {
	                case 0:
	                    _a = __assign$4({ verify: false, format: "legacy" }, options), path = _a.path, verify = _a.verify, format = _a.format;
	                    if (!(format in addressFormatMap)) {
	                        throw new Error("btc.getWalletPublicKey invalid format=" + format);
	                    }
	                    buffer = bip32asBuffer(path);
	                    p1 = verify ? 1 : 0;
	                    p2 = addressFormatMap[format];
	                    return [4 /*yield*/, transport.send(0xe0, 0x40, p1, p2, buffer)];
	                case 1:
	                    response = _b.sent();
	                    publicKeyLength = response[0];
	                    addressLength = response[1 + publicKeyLength];
	                    publicKey = response.slice(1, 1 + publicKeyLength).toString("hex");
	                    bitcoinAddress = response
	                        .slice(1 + publicKeyLength + 1, 1 + publicKeyLength + 1 + addressLength)
	                        .toString("ascii");
	                    chainCode = response
	                        .slice(1 + publicKeyLength + 1 + addressLength, 1 + publicKeyLength + 1 + addressLength + 32)
	                        .toString("hex");
	                    return [2 /*return*/, {
	                            publicKey: publicKey,
	                            bitcoinAddress: bitcoinAddress,
	                            chainCode: chainCode
	                        }];
	            }
	        });
	    });
	}

	var id$1 = 0;
	var subscribers = [];
	/**
	 * log something
	 * @param type a namespaced identifier of the log (it is not a level like "debug", "error" but more like "apdu-in", "apdu-out", etc...)
	 * @param message a clear message of the log associated to the type
	 */
	var log = function (type, message, data) {
	    var obj = {
	        type: type,
	        id: String(++id$1),
	        date: new Date()
	    };
	    if (message)
	        obj.message = message;
	    if (data)
	        obj.data = data;
	    dispatch(obj);
	};
	/**
	 * listen to logs.
	 * @param cb that is called for each future log() with the Log object
	 * @return a function that can be called to unsubscribe the listener
	 */
	var listen = function (cb) {
	    subscribers.push(cb);
	    return function () {
	        var i = subscribers.indexOf(cb);
	        if (i !== -1) {
	            // equivalent of subscribers.splice(i, 1) // https://twitter.com/Rich_Harris/status/1125850391155965952
	            subscribers[i] = subscribers[subscribers.length - 1];
	            subscribers.pop();
	        }
	    };
	};
	function dispatch(log) {
	    for (var i = 0; i < subscribers.length; i++) {
	        try {
	            subscribers[i](log);
	        }
	        catch (e) {
	            console.error(e);
	        }
	    }
	}
	if (typeof window !== "undefined") {
	    window.__ledgerLogsListen = listen;
	}

	var index = /*#__PURE__*/Object.freeze({
		__proto__: null,
		log: log,
		listen: listen
	});

	function getVarint(data, offset) {
	    if (data[offset] < 0xfd) {
	        return [data[offset], 1];
	    }
	    if (data[offset] === 0xfd) {
	        return [(data[offset + 2] << 8) + data[offset + 1], 3];
	    }
	    if (data[offset] === 0xfe) {
	        return [
	            (data[offset + 4] << 24) +
	                (data[offset + 3] << 16) +
	                (data[offset + 2] << 8) +
	                data[offset + 1],
	            5,
	        ];
	    }
	    throw new Error("getVarint called with unexpected parameters");
	}
	function createVarint(value) {
	    if (value < 0xfd) {
	        var buffer_1 = Buffer$e.alloc(1);
	        buffer_1[0] = value;
	        return buffer_1;
	    }
	    if (value <= 0xffff) {
	        var buffer_2 = Buffer$e.alloc(3);
	        buffer_2[0] = 0xfd;
	        buffer_2[1] = value & 0xff;
	        buffer_2[2] = (value >> 8) & 0xff;
	        return buffer_2;
	    }
	    var buffer = Buffer$e.alloc(5);
	    buffer[0] = 0xfe;
	    buffer[1] = value & 0xff;
	    buffer[2] = (value >> 8) & 0xff;
	    buffer[3] = (value >> 16) & 0xff;
	    buffer[4] = (value >> 24) & 0xff;
	    return buffer;
	}

	function formatTransactionDebug(transaction) {
	    var str = "TX";
	    str += " version " + transaction.version.toString("hex");
	    if (transaction.locktime) {
	        str += " locktime " + transaction.locktime.toString("hex");
	    }
	    if (transaction.witness) {
	        str += " witness " + transaction.witness.toString("hex");
	    }
	    if (transaction.timestamp) {
	        str += " timestamp " + transaction.timestamp.toString("hex");
	    }
	    if (transaction.nVersionGroupId) {
	        str += " nVersionGroupId " + transaction.nVersionGroupId.toString("hex");
	    }
	    if (transaction.nExpiryHeight) {
	        str += " nExpiryHeight " + transaction.nExpiryHeight.toString("hex");
	    }
	    if (transaction.extraData) {
	        str += " extraData " + transaction.extraData.toString("hex");
	    }
	    transaction.inputs.forEach(function (_a, i) {
	        var prevout = _a.prevout, script = _a.script, sequence = _a.sequence;
	        str += "\ninput ".concat(i, ":");
	        str += " prevout ".concat(prevout.toString("hex"));
	        str += " script ".concat(script.toString("hex"));
	        str += " sequence ".concat(sequence.toString("hex"));
	    });
	    (transaction.outputs || []).forEach(function (_a, i) {
	        var amount = _a.amount, script = _a.script;
	        str += "\noutput ".concat(i, ":");
	        str += " amount ".concat(amount.toString("hex"));
	        str += " script ".concat(script.toString("hex"));
	    });
	    return str;
	}

	function splitTransaction(transactionHex, isSegwitSupported, hasTimestamp, hasExtraData, additionals) {
	    if (isSegwitSupported === void 0) { isSegwitSupported = false; }
	    if (hasTimestamp === void 0) { hasTimestamp = false; }
	    if (hasExtraData === void 0) { hasExtraData = false; }
	    if (additionals === void 0) { additionals = []; }
	    var inputs = [];
	    var outputs = [];
	    var witness = false;
	    var offset = 0;
	    var timestamp = Buffer$e.alloc(0);
	    var nExpiryHeight = Buffer$e.alloc(0);
	    var nVersionGroupId = Buffer$e.alloc(0);
	    var extraData = Buffer$e.alloc(0);
	    var isDecred = additionals.includes("decred");
	    var transaction = Buffer$e.from(transactionHex, "hex");
	    var version = transaction.slice(offset, offset + 4);
	    var overwinter = version.equals(Buffer$e.from([0x03, 0x00, 0x00, 0x80])) ||
	        version.equals(Buffer$e.from([0x04, 0x00, 0x00, 0x80]));
	    offset += 4;
	    if (!hasTimestamp &&
	        isSegwitSupported &&
	        transaction[offset] === 0 &&
	        transaction[offset + 1] !== 0) {
	        offset += 2;
	        witness = true;
	    }
	    if (hasTimestamp) {
	        timestamp = transaction.slice(offset, 4 + offset);
	        offset += 4;
	    }
	    if (overwinter) {
	        nVersionGroupId = transaction.slice(offset, 4 + offset);
	        offset += 4;
	    }
	    var varint = getVarint(transaction, offset);
	    var numberInputs = varint[0];
	    offset += varint[1];
	    for (var i = 0; i < numberInputs; i++) {
	        var prevout = transaction.slice(offset, offset + 36);
	        offset += 36;
	        var script = Buffer$e.alloc(0);
	        var tree = Buffer$e.alloc(0);
	        //No script for decred, it has a witness
	        if (!isDecred) {
	            varint = getVarint(transaction, offset);
	            offset += varint[1];
	            script = transaction.slice(offset, offset + varint[0]);
	            offset += varint[0];
	        }
	        else {
	            //Tree field
	            tree = transaction.slice(offset, offset + 1);
	            offset += 1;
	        }
	        var sequence = transaction.slice(offset, offset + 4);
	        offset += 4;
	        inputs.push({
	            prevout: prevout,
	            script: script,
	            sequence: sequence,
	            tree: tree
	        });
	    }
	    varint = getVarint(transaction, offset);
	    var numberOutputs = varint[0];
	    offset += varint[1];
	    for (var i = 0; i < numberOutputs; i++) {
	        var amount = transaction.slice(offset, offset + 8);
	        offset += 8;
	        if (isDecred) {
	            //Script version
	            offset += 2;
	        }
	        varint = getVarint(transaction, offset);
	        offset += varint[1];
	        var script = transaction.slice(offset, offset + varint[0]);
	        offset += varint[0];
	        outputs.push({
	            amount: amount,
	            script: script
	        });
	    }
	    var witnessScript, locktime;
	    if (witness) {
	        witnessScript = transaction.slice(offset, -4);
	        locktime = transaction.slice(transaction.length - 4);
	    }
	    else {
	        locktime = transaction.slice(offset, offset + 4);
	    }
	    offset += 4;
	    if (overwinter || isDecred) {
	        nExpiryHeight = transaction.slice(offset, offset + 4);
	        offset += 4;
	    }
	    if (hasExtraData) {
	        extraData = transaction.slice(offset);
	    }
	    //Get witnesses for Decred
	    if (isDecred) {
	        varint = getVarint(transaction, offset);
	        offset += varint[1];
	        if (varint[0] !== numberInputs) {
	            throw new Error("splitTransaction: incoherent number of witnesses");
	        }
	        for (var i = 0; i < numberInputs; i++) {
	            //amount
	            offset += 8;
	            //block height
	            offset += 4;
	            //block index
	            offset += 4;
	            //Script size
	            varint = getVarint(transaction, offset);
	            offset += varint[1];
	            var script = transaction.slice(offset, offset + varint[0]);
	            offset += varint[0];
	            inputs[i].script = script;
	        }
	    }
	    var t = {
	        version: version,
	        inputs: inputs,
	        outputs: outputs,
	        locktime: locktime,
	        witness: witnessScript,
	        timestamp: timestamp,
	        nVersionGroupId: nVersionGroupId,
	        nExpiryHeight: nExpiryHeight,
	        extraData: extraData
	    };
	    log("btc", "splitTransaction ".concat(transactionHex, ":\n").concat(formatTransactionDebug(t)));
	    return t;
	}

	// shim for using process in browser
	// based off https://github.com/defunctzombie/node-process/blob/master/browser.js

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	var cachedSetTimeout = defaultSetTimout;
	var cachedClearTimeout = defaultClearTimeout;
	if (typeof global$1.setTimeout === 'function') {
	    cachedSetTimeout = setTimeout;
	}
	if (typeof global$1.clearTimeout === 'function') {
	    cachedClearTimeout = clearTimeout;
	}

	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}
	function nextTick(fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	}
	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	var title = 'browser';
	var platform = 'browser';
	var browser$3 = true;
	var env = {};
	var argv = [];
	var version = ''; // empty string to avoid regexp issues
	var versions = {};
	var release = {};
	var config = {};

	function noop() {}

	var on = noop;
	var addListener = noop;
	var once$1 = noop;
	var off = noop;
	var removeListener = noop;
	var removeAllListeners = noop;
	var emit = noop;

	function binding(name) {
	    throw new Error('process.binding is not supported');
	}

	function cwd () { return '/' }
	function chdir (dir) {
	    throw new Error('process.chdir is not supported');
	}function umask() { return 0; }

	// from https://github.com/kumavis/browser-process-hrtime/blob/master/index.js
	var performance = global$1.performance || {};
	var performanceNow =
	  performance.now        ||
	  performance.mozNow     ||
	  performance.msNow      ||
	  performance.oNow       ||
	  performance.webkitNow  ||
	  function(){ return (new Date()).getTime() };

	// generate timestamp or delta
	// see http://nodejs.org/api/process.html#process_process_hrtime
	function hrtime(previousTimestamp){
	  var clocktime = performanceNow.call(performance)*1e-3;
	  var seconds = Math.floor(clocktime);
	  var nanoseconds = Math.floor((clocktime%1)*1e9);
	  if (previousTimestamp) {
	    seconds = seconds - previousTimestamp[0];
	    nanoseconds = nanoseconds - previousTimestamp[1];
	    if (nanoseconds<0) {
	      seconds--;
	      nanoseconds += 1e9;
	    }
	  }
	  return [seconds,nanoseconds]
	}

	var startTime = new Date();
	function uptime() {
	  var currentTime = new Date();
	  var dif = currentTime - startTime;
	  return dif / 1000;
	}

	var process = {
	  nextTick: nextTick,
	  title: title,
	  browser: browser$3,
	  env: env,
	  argv: argv,
	  version: version,
	  versions: versions,
	  on: on,
	  addListener: addListener,
	  once: once$1,
	  off: off,
	  removeListener: removeListener,
	  removeAllListeners: removeAllListeners,
	  emit: emit,
	  binding: binding,
	  cwd: cwd,
	  chdir: chdir,
	  umask: umask,
	  hrtime: hrtime,
	  platform: platform,
	  release: release,
	  config: config,
	  uptime: uptime
	};

	/**
	 * Use invariant() to assert state which your program assumes to be true.
	 *
	 * Provide sprintf-style format (only %s is supported) and arguments
	 * to provide information about what broke and what you were
	 * expecting.
	 *
	 * The invariant message will be stripped in production, but the invariant
	 * will remain to ensure logic does not differ in production.
	 */

	var invariant = function(condition, format, a, b, c, d, e, f) {
	  {
	    if (format === undefined) {
	      throw new Error('invariant requires an error message argument');
	    }
	  }

	  if (!condition) {
	    var error;
	    if (format === undefined) {
	      error = new Error(
	        'Minified exception occurred; use the non-minified dev environment ' +
	        'for the full error message and additional helpful warnings.'
	      );
	    } else {
	      var args = [a, b, c, d, e, f];
	      var argIndex = 0;
	      error = new Error(
	        format.replace(/%s/g, function() { return args[argIndex++]; })
	      );
	      error.name = 'Invariant Violation';
	    }

	    error.framesToPop = 1; // we don't care about invariant's own frame
	    throw error;
	  }
	};

	var browser$2 = invariant;

	var __awaiter$8 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator$8 = (undefined && undefined.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	var __values$5 = (undefined && undefined.__values) || function(o) {
	    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	    if (m) return m.call(o);
	    if (o && typeof o.length === "number") return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	function getTrustedInputRaw(transport, transactionData, indexLookup) {
	    return __awaiter$8(this, void 0, void 0, function () {
	        var data, firstRound, prefix, trustedInput, res;
	        return __generator$8(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    firstRound = false;
	                    if (typeof indexLookup === "number") {
	                        firstRound = true;
	                        prefix = Buffer$e.alloc(4);
	                        prefix.writeUInt32BE(indexLookup, 0);
	                        data = Buffer$e.concat([prefix, transactionData], transactionData.length + 4);
	                    }
	                    else {
	                        data = transactionData;
	                    }
	                    return [4 /*yield*/, transport.send(0xe0, 0x42, firstRound ? 0x00 : 0x80, 0x00, data)];
	                case 1:
	                    trustedInput = _a.sent();
	                    res = trustedInput.slice(0, trustedInput.length - 2).toString("hex");
	                    return [2 /*return*/, res];
	            }
	        });
	    });
	}
	function getTrustedInput(transport, indexLookup, transaction, additionals) {
	    if (additionals === void 0) { additionals = []; }
	    return __awaiter$8(this, void 0, void 0, function () {
	        var version, inputs, outputs, locktime, nExpiryHeight, extraData, isDecred, isXST, processScriptBlocks, processWholeScriptBlock, inputs_1, inputs_1_1, input, isXSTV2, treeField, data, e_1_1, outputs_1, outputs_1_1, output, data, e_2_1, endData, extraPart, data, res;
	        var e_1, _a, e_2, _b;
	        var _this = this;
	        return __generator$8(this, function (_c) {
	            switch (_c.label) {
	                case 0:
	                    version = transaction.version, inputs = transaction.inputs, outputs = transaction.outputs, locktime = transaction.locktime, nExpiryHeight = transaction.nExpiryHeight, extraData = transaction.extraData;
	                    if (!outputs || !locktime) {
	                        throw new Error("getTrustedInput: locktime & outputs is expected");
	                    }
	                    isDecred = additionals.includes("decred");
	                    isXST = additionals.includes("stealthcoin");
	                    processScriptBlocks = function (script, sequence) { return __awaiter$8(_this, void 0, void 0, function () {
	                        var seq, scriptBlocks, offset, blockSize, res, scriptBlocks_1, scriptBlocks_1_1, scriptBlock, e_3_1;
	                        var e_3, _a;
	                        return __generator$8(this, function (_b) {
	                            switch (_b.label) {
	                                case 0:
	                                    seq = sequence || Buffer$e.alloc(0);
	                                    scriptBlocks = [];
	                                    offset = 0;
	                                    while (offset !== script.length) {
	                                        blockSize = script.length - offset > MAX_SCRIPT_BLOCK
	                                            ? MAX_SCRIPT_BLOCK
	                                            : script.length - offset;
	                                        if (offset + blockSize !== script.length) {
	                                            scriptBlocks.push(script.slice(offset, offset + blockSize));
	                                        }
	                                        else {
	                                            scriptBlocks.push(Buffer$e.concat([script.slice(offset, offset + blockSize), seq]));
	                                        }
	                                        offset += blockSize;
	                                    }
	                                    // Handle case when no script length: we still want to pass the sequence
	                                    // relatable: https://github.com/LedgerHQ/ledger-live-desktop/issues/1386
	                                    if (script.length === 0) {
	                                        scriptBlocks.push(seq);
	                                    }
	                                    _b.label = 1;
	                                case 1:
	                                    _b.trys.push([1, 6, 7, 8]);
	                                    scriptBlocks_1 = __values$5(scriptBlocks), scriptBlocks_1_1 = scriptBlocks_1.next();
	                                    _b.label = 2;
	                                case 2:
	                                    if (!!scriptBlocks_1_1.done) return [3 /*break*/, 5];
	                                    scriptBlock = scriptBlocks_1_1.value;
	                                    return [4 /*yield*/, getTrustedInputRaw(transport, scriptBlock)];
	                                case 3:
	                                    res = _b.sent();
	                                    _b.label = 4;
	                                case 4:
	                                    scriptBlocks_1_1 = scriptBlocks_1.next();
	                                    return [3 /*break*/, 2];
	                                case 5: return [3 /*break*/, 8];
	                                case 6:
	                                    e_3_1 = _b.sent();
	                                    e_3 = { error: e_3_1 };
	                                    return [3 /*break*/, 8];
	                                case 7:
	                                    try {
	                                        if (scriptBlocks_1_1 && !scriptBlocks_1_1.done && (_a = scriptBlocks_1["return"])) _a.call(scriptBlocks_1);
	                                    }
	                                    finally { if (e_3) throw e_3.error; }
	                                    return [7 /*endfinally*/];
	                                case 8: return [2 /*return*/, res];
	                            }
	                        });
	                    }); };
	                    processWholeScriptBlock = function (block) {
	                        return getTrustedInputRaw(transport, block);
	                    };
	                    return [4 /*yield*/, getTrustedInputRaw(transport, Buffer$e.concat([
	                            transaction.version,
	                            transaction.timestamp || Buffer$e.alloc(0),
	                            transaction.nVersionGroupId || Buffer$e.alloc(0),
	                            createVarint(inputs.length),
	                        ]), indexLookup)];
	                case 1:
	                    _c.sent();
	                    _c.label = 2;
	                case 2:
	                    _c.trys.push([2, 8, 9, 10]);
	                    inputs_1 = __values$5(inputs), inputs_1_1 = inputs_1.next();
	                    _c.label = 3;
	                case 3:
	                    if (!!inputs_1_1.done) return [3 /*break*/, 7];
	                    input = inputs_1_1.value;
	                    isXSTV2 = isXST &&
	                        Buffer$e.compare(version, Buffer$e.from([0x02, 0x00, 0x00, 0x00])) === 0;
	                    treeField = isDecred
	                        ? input.tree || Buffer$e.from([0x00])
	                        : Buffer$e.alloc(0);
	                    data = Buffer$e.concat([
	                        input.prevout,
	                        treeField,
	                        isXSTV2 ? Buffer$e.from([0x00]) : createVarint(input.script.length),
	                    ]);
	                    return [4 /*yield*/, getTrustedInputRaw(transport, data)];
	                case 4:
	                    _c.sent();
	                    // iteration (eachSeries) ended
	                    // TODO notify progress
	                    // deferred.notify("input");
	                    // Reference: https://github.com/StealthSend/Stealth/commit/5be35d6c2c500b32ed82e5d6913d66d18a4b0a7f#diff-e8db9b851adc2422aadfffca88f14c91R566
	                    return [4 /*yield*/, (isDecred
	                            ? processWholeScriptBlock(Buffer$e.concat([input.script, input.sequence]))
	                            : isXSTV2
	                                ? processWholeScriptBlock(input.sequence)
	                                : processScriptBlocks(input.script, input.sequence))];
	                case 5:
	                    // iteration (eachSeries) ended
	                    // TODO notify progress
	                    // deferred.notify("input");
	                    // Reference: https://github.com/StealthSend/Stealth/commit/5be35d6c2c500b32ed82e5d6913d66d18a4b0a7f#diff-e8db9b851adc2422aadfffca88f14c91R566
	                    _c.sent();
	                    _c.label = 6;
	                case 6:
	                    inputs_1_1 = inputs_1.next();
	                    return [3 /*break*/, 3];
	                case 7: return [3 /*break*/, 10];
	                case 8:
	                    e_1_1 = _c.sent();
	                    e_1 = { error: e_1_1 };
	                    return [3 /*break*/, 10];
	                case 9:
	                    try {
	                        if (inputs_1_1 && !inputs_1_1.done && (_a = inputs_1["return"])) _a.call(inputs_1);
	                    }
	                    finally { if (e_1) throw e_1.error; }
	                    return [7 /*endfinally*/];
	                case 10: return [4 /*yield*/, getTrustedInputRaw(transport, createVarint(outputs.length))];
	                case 11:
	                    _c.sent();
	                    _c.label = 12;
	                case 12:
	                    _c.trys.push([12, 17, 18, 19]);
	                    outputs_1 = __values$5(outputs), outputs_1_1 = outputs_1.next();
	                    _c.label = 13;
	                case 13:
	                    if (!!outputs_1_1.done) return [3 /*break*/, 16];
	                    output = outputs_1_1.value;
	                    data = Buffer$e.concat([
	                        output.amount,
	                        isDecred ? Buffer$e.from([0x00, 0x00]) : Buffer$e.alloc(0),
	                        createVarint(output.script.length),
	                        output.script,
	                    ]);
	                    return [4 /*yield*/, getTrustedInputRaw(transport, data)];
	                case 14:
	                    _c.sent();
	                    _c.label = 15;
	                case 15:
	                    outputs_1_1 = outputs_1.next();
	                    return [3 /*break*/, 13];
	                case 16: return [3 /*break*/, 19];
	                case 17:
	                    e_2_1 = _c.sent();
	                    e_2 = { error: e_2_1 };
	                    return [3 /*break*/, 19];
	                case 18:
	                    try {
	                        if (outputs_1_1 && !outputs_1_1.done && (_b = outputs_1["return"])) _b.call(outputs_1);
	                    }
	                    finally { if (e_2) throw e_2.error; }
	                    return [7 /*endfinally*/];
	                case 19:
	                    endData = [];
	                    if (nExpiryHeight && nExpiryHeight.length > 0) {
	                        endData.push(nExpiryHeight);
	                    }
	                    if (extraData && extraData.length > 0) {
	                        endData.push(extraData);
	                    }
	                    if (endData.length) {
	                        data = Buffer$e.concat(endData);
	                        extraPart = isDecred
	                            ? data
	                            : Buffer$e.concat([createVarint(data.length), data]);
	                    }
	                    return [4 /*yield*/, processScriptBlocks(Buffer$e.concat([locktime, extraPart || Buffer$e.alloc(0)]))];
	                case 20:
	                    res = _c.sent();
	                    browser$2(res, "missing result in processScriptBlocks");
	                    return [2 /*return*/, res];
	            }
	        });
	    });
	}

	var sha_js = {exports: {}};

	var inherits_browser = {exports: {}};

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  inherits_browser.exports = function inherits(ctor, superCtor) {
	    if (superCtor) {
	      ctor.super_ = superCtor;
	      ctor.prototype = Object.create(superCtor.prototype, {
	        constructor: {
	          value: ctor,
	          enumerable: false,
	          writable: true,
	          configurable: true
	        }
	      });
	    }
	  };
	} else {
	  // old school shim for old browsers
	  inherits_browser.exports = function inherits(ctor, superCtor) {
	    if (superCtor) {
	      ctor.super_ = superCtor;
	      var TempCtor = function () {};
	      TempCtor.prototype = superCtor.prototype;
	      ctor.prototype = new TempCtor();
	      ctor.prototype.constructor = ctor;
	    }
	  };
	}

	var safeBuffer = {exports: {}};

	var buffer = {};

	var base64Js = {};

	base64Js.byteLength = byteLength;
	base64Js.toByteArray = toByteArray;
	base64Js.fromByteArray = fromByteArray;

	var lookup = [];
	var revLookup = [];
	var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array;

	var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	for (var i$1 = 0, len = code.length; i$1 < len; ++i$1) {
	  lookup[i$1] = code[i$1];
	  revLookup[code.charCodeAt(i$1)] = i$1;
	}

	// Support decoding URL-safe base64 strings, as Node.js does.
	// See: https://en.wikipedia.org/wiki/Base64#URL_applications
	revLookup['-'.charCodeAt(0)] = 62;
	revLookup['_'.charCodeAt(0)] = 63;

	function getLens (b64) {
	  var len = b64.length;

	  if (len % 4 > 0) {
	    throw new Error('Invalid string. Length must be a multiple of 4')
	  }

	  // Trim off extra bytes after placeholder bytes are found
	  // See: https://github.com/beatgammit/base64-js/issues/42
	  var validLen = b64.indexOf('=');
	  if (validLen === -1) validLen = len;

	  var placeHoldersLen = validLen === len
	    ? 0
	    : 4 - (validLen % 4);

	  return [validLen, placeHoldersLen]
	}

	// base64 is 4/3 + up to two characters of the original data
	function byteLength (b64) {
	  var lens = getLens(b64);
	  var validLen = lens[0];
	  var placeHoldersLen = lens[1];
	  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
	}

	function _byteLength (b64, validLen, placeHoldersLen) {
	  return ((validLen + placeHoldersLen) * 3 / 4) - placeHoldersLen
	}

	function toByteArray (b64) {
	  var tmp;
	  var lens = getLens(b64);
	  var validLen = lens[0];
	  var placeHoldersLen = lens[1];

	  var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));

	  var curByte = 0;

	  // if there are placeholders, only get up to the last complete 4 chars
	  var len = placeHoldersLen > 0
	    ? validLen - 4
	    : validLen;

	  var i;
	  for (i = 0; i < len; i += 4) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 18) |
	      (revLookup[b64.charCodeAt(i + 1)] << 12) |
	      (revLookup[b64.charCodeAt(i + 2)] << 6) |
	      revLookup[b64.charCodeAt(i + 3)];
	    arr[curByte++] = (tmp >> 16) & 0xFF;
	    arr[curByte++] = (tmp >> 8) & 0xFF;
	    arr[curByte++] = tmp & 0xFF;
	  }

	  if (placeHoldersLen === 2) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 2) |
	      (revLookup[b64.charCodeAt(i + 1)] >> 4);
	    arr[curByte++] = tmp & 0xFF;
	  }

	  if (placeHoldersLen === 1) {
	    tmp =
	      (revLookup[b64.charCodeAt(i)] << 10) |
	      (revLookup[b64.charCodeAt(i + 1)] << 4) |
	      (revLookup[b64.charCodeAt(i + 2)] >> 2);
	    arr[curByte++] = (tmp >> 8) & 0xFF;
	    arr[curByte++] = tmp & 0xFF;
	  }

	  return arr
	}

	function tripletToBase64 (num) {
	  return lookup[num >> 18 & 0x3F] +
	    lookup[num >> 12 & 0x3F] +
	    lookup[num >> 6 & 0x3F] +
	    lookup[num & 0x3F]
	}

	function encodeChunk (uint8, start, end) {
	  var tmp;
	  var output = [];
	  for (var i = start; i < end; i += 3) {
	    tmp =
	      ((uint8[i] << 16) & 0xFF0000) +
	      ((uint8[i + 1] << 8) & 0xFF00) +
	      (uint8[i + 2] & 0xFF);
	    output.push(tripletToBase64(tmp));
	  }
	  return output.join('')
	}

	function fromByteArray (uint8) {
	  var tmp;
	  var len = uint8.length;
	  var extraBytes = len % 3; // if we have 1 byte left, pad 2 bytes
	  var parts = [];
	  var maxChunkLength = 16383; // must be multiple of 3

	  // go through the array every three bytes, we'll deal with trailing stuff later
	  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
	    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)));
	  }

	  // pad the end with zeros, but make sure to not forget the extra bytes
	  if (extraBytes === 1) {
	    tmp = uint8[len - 1];
	    parts.push(
	      lookup[tmp >> 2] +
	      lookup[(tmp << 4) & 0x3F] +
	      '=='
	    );
	  } else if (extraBytes === 2) {
	    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
	    parts.push(
	      lookup[tmp >> 10] +
	      lookup[(tmp >> 4) & 0x3F] +
	      lookup[(tmp << 2) & 0x3F] +
	      '='
	    );
	  }

	  return parts.join('')
	}

	var ieee754 = {};

	/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */

	ieee754.read = function (buffer, offset, isLE, mLen, nBytes) {
	  var e, m;
	  var eLen = (nBytes * 8) - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var nBits = -7;
	  var i = isLE ? (nBytes - 1) : 0;
	  var d = isLE ? -1 : 1;
	  var s = buffer[offset + i];

	  i += d;

	  e = s & ((1 << (-nBits)) - 1);
	  s >>= (-nBits);
	  nBits += eLen;
	  for (; nBits > 0; e = (e * 256) + buffer[offset + i], i += d, nBits -= 8) {}

	  m = e & ((1 << (-nBits)) - 1);
	  e >>= (-nBits);
	  nBits += mLen;
	  for (; nBits > 0; m = (m * 256) + buffer[offset + i], i += d, nBits -= 8) {}

	  if (e === 0) {
	    e = 1 - eBias;
	  } else if (e === eMax) {
	    return m ? NaN : ((s ? -1 : 1) * Infinity)
	  } else {
	    m = m + Math.pow(2, mLen);
	    e = e - eBias;
	  }
	  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
	};

	ieee754.write = function (buffer, value, offset, isLE, mLen, nBytes) {
	  var e, m, c;
	  var eLen = (nBytes * 8) - mLen - 1;
	  var eMax = (1 << eLen) - 1;
	  var eBias = eMax >> 1;
	  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0);
	  var i = isLE ? 0 : (nBytes - 1);
	  var d = isLE ? 1 : -1;
	  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

	  value = Math.abs(value);

	  if (isNaN(value) || value === Infinity) {
	    m = isNaN(value) ? 1 : 0;
	    e = eMax;
	  } else {
	    e = Math.floor(Math.log(value) / Math.LN2);
	    if (value * (c = Math.pow(2, -e)) < 1) {
	      e--;
	      c *= 2;
	    }
	    if (e + eBias >= 1) {
	      value += rt / c;
	    } else {
	      value += rt * Math.pow(2, 1 - eBias);
	    }
	    if (value * c >= 2) {
	      e++;
	      c /= 2;
	    }

	    if (e + eBias >= eMax) {
	      m = 0;
	      e = eMax;
	    } else if (e + eBias >= 1) {
	      m = ((value * c) - 1) * Math.pow(2, mLen);
	      e = e + eBias;
	    } else {
	      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
	      e = 0;
	    }
	  }

	  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

	  e = (e << mLen) | m;
	  eLen += mLen;
	  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

	  buffer[offset + i - d] |= s * 128;
	};

	/*!
	 * The buffer module from node.js, for the browser.
	 *
	 * @author   Feross Aboukhadijeh <https://feross.org>
	 * @license  MIT
	 */

	(function (exports) {

	var base64 = base64Js;
	var ieee754$1 = ieee754;
	var customInspectSymbol =
	  (typeof Symbol === 'function' && typeof Symbol['for'] === 'function') // eslint-disable-line dot-notation
	    ? Symbol['for']('nodejs.util.inspect.custom') // eslint-disable-line dot-notation
	    : null;

	exports.Buffer = Buffer;
	exports.SlowBuffer = SlowBuffer;
	exports.INSPECT_MAX_BYTES = 50;

	var K_MAX_LENGTH = 0x7fffffff;
	exports.kMaxLength = K_MAX_LENGTH;

	/**
	 * If `Buffer.TYPED_ARRAY_SUPPORT`:
	 *   === true    Use Uint8Array implementation (fastest)
	 *   === false   Print warning and recommend using `buffer` v4.x which has an Object
	 *               implementation (most compatible, even IE6)
	 *
	 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
	 * Opera 11.6+, iOS 4.2+.
	 *
	 * We report that the browser does not support typed arrays if the are not subclassable
	 * using __proto__. Firefox 4-29 lacks support for adding new properties to `Uint8Array`
	 * (See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438). IE 10 lacks support
	 * for __proto__ and has a buggy typed array implementation.
	 */
	Buffer.TYPED_ARRAY_SUPPORT = typedArraySupport();

	if (!Buffer.TYPED_ARRAY_SUPPORT && typeof console !== 'undefined' &&
	    typeof console.error === 'function') {
	  console.error(
	    'This browser lacks typed array (Uint8Array) support which is required by ' +
	    '`buffer` v5.x. Use `buffer` v4.x if you require old browser support.'
	  );
	}

	function typedArraySupport () {
	  // Can typed array instances can be augmented?
	  try {
	    var arr = new Uint8Array(1);
	    var proto = { foo: function () { return 42 } };
	    Object.setPrototypeOf(proto, Uint8Array.prototype);
	    Object.setPrototypeOf(arr, proto);
	    return arr.foo() === 42
	  } catch (e) {
	    return false
	  }
	}

	Object.defineProperty(Buffer.prototype, 'parent', {
	  enumerable: true,
	  get: function () {
	    if (!Buffer.isBuffer(this)) return undefined
	    return this.buffer
	  }
	});

	Object.defineProperty(Buffer.prototype, 'offset', {
	  enumerable: true,
	  get: function () {
	    if (!Buffer.isBuffer(this)) return undefined
	    return this.byteOffset
	  }
	});

	function createBuffer (length) {
	  if (length > K_MAX_LENGTH) {
	    throw new RangeError('The value "' + length + '" is invalid for option "size"')
	  }
	  // Return an augmented `Uint8Array` instance
	  var buf = new Uint8Array(length);
	  Object.setPrototypeOf(buf, Buffer.prototype);
	  return buf
	}

	/**
	 * The Buffer constructor returns instances of `Uint8Array` that have their
	 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
	 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
	 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
	 * returns a single octet.
	 *
	 * The `Uint8Array` prototype remains unmodified.
	 */

	function Buffer (arg, encodingOrOffset, length) {
	  // Common case.
	  if (typeof arg === 'number') {
	    if (typeof encodingOrOffset === 'string') {
	      throw new TypeError(
	        'The "string" argument must be of type string. Received type number'
	      )
	    }
	    return allocUnsafe(arg)
	  }
	  return from(arg, encodingOrOffset, length)
	}

	Buffer.poolSize = 8192; // not used by this implementation

	function from (value, encodingOrOffset, length) {
	  if (typeof value === 'string') {
	    return fromString(value, encodingOrOffset)
	  }

	  if (ArrayBuffer.isView(value)) {
	    return fromArrayView(value)
	  }

	  if (value == null) {
	    throw new TypeError(
	      'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
	      'or Array-like Object. Received type ' + (typeof value)
	    )
	  }

	  if (isInstance(value, ArrayBuffer) ||
	      (value && isInstance(value.buffer, ArrayBuffer))) {
	    return fromArrayBuffer(value, encodingOrOffset, length)
	  }

	  if (typeof SharedArrayBuffer !== 'undefined' &&
	      (isInstance(value, SharedArrayBuffer) ||
	      (value && isInstance(value.buffer, SharedArrayBuffer)))) {
	    return fromArrayBuffer(value, encodingOrOffset, length)
	  }

	  if (typeof value === 'number') {
	    throw new TypeError(
	      'The "value" argument must not be of type number. Received type number'
	    )
	  }

	  var valueOf = value.valueOf && value.valueOf();
	  if (valueOf != null && valueOf !== value) {
	    return Buffer.from(valueOf, encodingOrOffset, length)
	  }

	  var b = fromObject(value);
	  if (b) return b

	  if (typeof Symbol !== 'undefined' && Symbol.toPrimitive != null &&
	      typeof value[Symbol.toPrimitive] === 'function') {
	    return Buffer.from(
	      value[Symbol.toPrimitive]('string'), encodingOrOffset, length
	    )
	  }

	  throw new TypeError(
	    'The first argument must be one of type string, Buffer, ArrayBuffer, Array, ' +
	    'or Array-like Object. Received type ' + (typeof value)
	  )
	}

	/**
	 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
	 * if value is a number.
	 * Buffer.from(str[, encoding])
	 * Buffer.from(array)
	 * Buffer.from(buffer)
	 * Buffer.from(arrayBuffer[, byteOffset[, length]])
	 **/
	Buffer.from = function (value, encodingOrOffset, length) {
	  return from(value, encodingOrOffset, length)
	};

	// Note: Change prototype *after* Buffer.from is defined to workaround Chrome bug:
	// https://github.com/feross/buffer/pull/148
	Object.setPrototypeOf(Buffer.prototype, Uint8Array.prototype);
	Object.setPrototypeOf(Buffer, Uint8Array);

	function assertSize (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('"size" argument must be of type number')
	  } else if (size < 0) {
	    throw new RangeError('The value "' + size + '" is invalid for option "size"')
	  }
	}

	function alloc (size, fill, encoding) {
	  assertSize(size);
	  if (size <= 0) {
	    return createBuffer(size)
	  }
	  if (fill !== undefined) {
	    // Only pay attention to encoding if it's a string. This
	    // prevents accidentally sending in a number that would
	    // be interpreted as a start offset.
	    return typeof encoding === 'string'
	      ? createBuffer(size).fill(fill, encoding)
	      : createBuffer(size).fill(fill)
	  }
	  return createBuffer(size)
	}

	/**
	 * Creates a new filled Buffer instance.
	 * alloc(size[, fill[, encoding]])
	 **/
	Buffer.alloc = function (size, fill, encoding) {
	  return alloc(size, fill, encoding)
	};

	function allocUnsafe (size) {
	  assertSize(size);
	  return createBuffer(size < 0 ? 0 : checked(size) | 0)
	}

	/**
	 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
	 * */
	Buffer.allocUnsafe = function (size) {
	  return allocUnsafe(size)
	};
	/**
	 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
	 */
	Buffer.allocUnsafeSlow = function (size) {
	  return allocUnsafe(size)
	};

	function fromString (string, encoding) {
	  if (typeof encoding !== 'string' || encoding === '') {
	    encoding = 'utf8';
	  }

	  if (!Buffer.isEncoding(encoding)) {
	    throw new TypeError('Unknown encoding: ' + encoding)
	  }

	  var length = byteLength(string, encoding) | 0;
	  var buf = createBuffer(length);

	  var actual = buf.write(string, encoding);

	  if (actual !== length) {
	    // Writing a hex string, for example, that contains invalid characters will
	    // cause everything after the first invalid character to be ignored. (e.g.
	    // 'abxxcd' will be treated as 'ab')
	    buf = buf.slice(0, actual);
	  }

	  return buf
	}

	function fromArrayLike (array) {
	  var length = array.length < 0 ? 0 : checked(array.length) | 0;
	  var buf = createBuffer(length);
	  for (var i = 0; i < length; i += 1) {
	    buf[i] = array[i] & 255;
	  }
	  return buf
	}

	function fromArrayView (arrayView) {
	  if (isInstance(arrayView, Uint8Array)) {
	    var copy = new Uint8Array(arrayView);
	    return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength)
	  }
	  return fromArrayLike(arrayView)
	}

	function fromArrayBuffer (array, byteOffset, length) {
	  if (byteOffset < 0 || array.byteLength < byteOffset) {
	    throw new RangeError('"offset" is outside of buffer bounds')
	  }

	  if (array.byteLength < byteOffset + (length || 0)) {
	    throw new RangeError('"length" is outside of buffer bounds')
	  }

	  var buf;
	  if (byteOffset === undefined && length === undefined) {
	    buf = new Uint8Array(array);
	  } else if (length === undefined) {
	    buf = new Uint8Array(array, byteOffset);
	  } else {
	    buf = new Uint8Array(array, byteOffset, length);
	  }

	  // Return an augmented `Uint8Array` instance
	  Object.setPrototypeOf(buf, Buffer.prototype);

	  return buf
	}

	function fromObject (obj) {
	  if (Buffer.isBuffer(obj)) {
	    var len = checked(obj.length) | 0;
	    var buf = createBuffer(len);

	    if (buf.length === 0) {
	      return buf
	    }

	    obj.copy(buf, 0, 0, len);
	    return buf
	  }

	  if (obj.length !== undefined) {
	    if (typeof obj.length !== 'number' || numberIsNaN(obj.length)) {
	      return createBuffer(0)
	    }
	    return fromArrayLike(obj)
	  }

	  if (obj.type === 'Buffer' && Array.isArray(obj.data)) {
	    return fromArrayLike(obj.data)
	  }
	}

	function checked (length) {
	  // Note: cannot use `length < K_MAX_LENGTH` here because that fails when
	  // length is NaN (which is otherwise coerced to zero.)
	  if (length >= K_MAX_LENGTH) {
	    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
	                         'size: 0x' + K_MAX_LENGTH.toString(16) + ' bytes')
	  }
	  return length | 0
	}

	function SlowBuffer (length) {
	  if (+length != length) { // eslint-disable-line eqeqeq
	    length = 0;
	  }
	  return Buffer.alloc(+length)
	}

	Buffer.isBuffer = function isBuffer (b) {
	  return b != null && b._isBuffer === true &&
	    b !== Buffer.prototype // so Buffer.isBuffer(Buffer.prototype) will be false
	};

	Buffer.compare = function compare (a, b) {
	  if (isInstance(a, Uint8Array)) a = Buffer.from(a, a.offset, a.byteLength);
	  if (isInstance(b, Uint8Array)) b = Buffer.from(b, b.offset, b.byteLength);
	  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
	    throw new TypeError(
	      'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
	    )
	  }

	  if (a === b) return 0

	  var x = a.length;
	  var y = b.length;

	  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
	    if (a[i] !== b[i]) {
	      x = a[i];
	      y = b[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	Buffer.isEncoding = function isEncoding (encoding) {
	  switch (String(encoding).toLowerCase()) {
	    case 'hex':
	    case 'utf8':
	    case 'utf-8':
	    case 'ascii':
	    case 'latin1':
	    case 'binary':
	    case 'base64':
	    case 'ucs2':
	    case 'ucs-2':
	    case 'utf16le':
	    case 'utf-16le':
	      return true
	    default:
	      return false
	  }
	};

	Buffer.concat = function concat (list, length) {
	  if (!Array.isArray(list)) {
	    throw new TypeError('"list" argument must be an Array of Buffers')
	  }

	  if (list.length === 0) {
	    return Buffer.alloc(0)
	  }

	  var i;
	  if (length === undefined) {
	    length = 0;
	    for (i = 0; i < list.length; ++i) {
	      length += list[i].length;
	    }
	  }

	  var buffer = Buffer.allocUnsafe(length);
	  var pos = 0;
	  for (i = 0; i < list.length; ++i) {
	    var buf = list[i];
	    if (isInstance(buf, Uint8Array)) {
	      if (pos + buf.length > buffer.length) {
	        Buffer.from(buf).copy(buffer, pos);
	      } else {
	        Uint8Array.prototype.set.call(
	          buffer,
	          buf,
	          pos
	        );
	      }
	    } else if (!Buffer.isBuffer(buf)) {
	      throw new TypeError('"list" argument must be an Array of Buffers')
	    } else {
	      buf.copy(buffer, pos);
	    }
	    pos += buf.length;
	  }
	  return buffer
	};

	function byteLength (string, encoding) {
	  if (Buffer.isBuffer(string)) {
	    return string.length
	  }
	  if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
	    return string.byteLength
	  }
	  if (typeof string !== 'string') {
	    throw new TypeError(
	      'The "string" argument must be one of type string, Buffer, or ArrayBuffer. ' +
	      'Received type ' + typeof string
	    )
	  }

	  var len = string.length;
	  var mustMatch = (arguments.length > 2 && arguments[2] === true);
	  if (!mustMatch && len === 0) return 0

	  // Use a for loop to avoid recursion
	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return len
	      case 'utf8':
	      case 'utf-8':
	        return utf8ToBytes(string).length
	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return len * 2
	      case 'hex':
	        return len >>> 1
	      case 'base64':
	        return base64ToBytes(string).length
	      default:
	        if (loweredCase) {
	          return mustMatch ? -1 : utf8ToBytes(string).length // assume utf8
	        }
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	}
	Buffer.byteLength = byteLength;

	function slowToString (encoding, start, end) {
	  var loweredCase = false;

	  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
	  // property of a typed array.

	  // This behaves neither like String nor Uint8Array in that we set start/end
	  // to their upper/lower bounds if the value passed is out of range.
	  // undefined is handled specially as per ECMA-262 6th Edition,
	  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
	  if (start === undefined || start < 0) {
	    start = 0;
	  }
	  // Return early if start > this.length. Done here to prevent potential uint32
	  // coercion fail below.
	  if (start > this.length) {
	    return ''
	  }

	  if (end === undefined || end > this.length) {
	    end = this.length;
	  }

	  if (end <= 0) {
	    return ''
	  }

	  // Force coercion to uint32. This will also coerce falsey/NaN values to 0.
	  end >>>= 0;
	  start >>>= 0;

	  if (end <= start) {
	    return ''
	  }

	  if (!encoding) encoding = 'utf8';

	  while (true) {
	    switch (encoding) {
	      case 'hex':
	        return hexSlice(this, start, end)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Slice(this, start, end)

	      case 'ascii':
	        return asciiSlice(this, start, end)

	      case 'latin1':
	      case 'binary':
	        return latin1Slice(this, start, end)

	      case 'base64':
	        return base64Slice(this, start, end)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return utf16leSlice(this, start, end)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = (encoding + '').toLowerCase();
	        loweredCase = true;
	    }
	  }
	}

	// This property is used by `Buffer.isBuffer` (and the `is-buffer` npm package)
	// to detect a Buffer instance. It's not possible to use `instanceof Buffer`
	// reliably in a browserify context because there could be multiple different
	// copies of the 'buffer' package in use. This method works even for Buffer
	// instances that were created from another copy of the `buffer` package.
	// See: https://github.com/feross/buffer/issues/154
	Buffer.prototype._isBuffer = true;

	function swap (b, n, m) {
	  var i = b[n];
	  b[n] = b[m];
	  b[m] = i;
	}

	Buffer.prototype.swap16 = function swap16 () {
	  var len = this.length;
	  if (len % 2 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 16-bits')
	  }
	  for (var i = 0; i < len; i += 2) {
	    swap(this, i, i + 1);
	  }
	  return this
	};

	Buffer.prototype.swap32 = function swap32 () {
	  var len = this.length;
	  if (len % 4 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 32-bits')
	  }
	  for (var i = 0; i < len; i += 4) {
	    swap(this, i, i + 3);
	    swap(this, i + 1, i + 2);
	  }
	  return this
	};

	Buffer.prototype.swap64 = function swap64 () {
	  var len = this.length;
	  if (len % 8 !== 0) {
	    throw new RangeError('Buffer size must be a multiple of 64-bits')
	  }
	  for (var i = 0; i < len; i += 8) {
	    swap(this, i, i + 7);
	    swap(this, i + 1, i + 6);
	    swap(this, i + 2, i + 5);
	    swap(this, i + 3, i + 4);
	  }
	  return this
	};

	Buffer.prototype.toString = function toString () {
	  var length = this.length;
	  if (length === 0) return ''
	  if (arguments.length === 0) return utf8Slice(this, 0, length)
	  return slowToString.apply(this, arguments)
	};

	Buffer.prototype.toLocaleString = Buffer.prototype.toString;

	Buffer.prototype.equals = function equals (b) {
	  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
	  if (this === b) return true
	  return Buffer.compare(this, b) === 0
	};

	Buffer.prototype.inspect = function inspect () {
	  var str = '';
	  var max = exports.INSPECT_MAX_BYTES;
	  str = this.toString('hex', 0, max).replace(/(.{2})/g, '$1 ').trim();
	  if (this.length > max) str += ' ... ';
	  return '<Buffer ' + str + '>'
	};
	if (customInspectSymbol) {
	  Buffer.prototype[customInspectSymbol] = Buffer.prototype.inspect;
	}

	Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
	  if (isInstance(target, Uint8Array)) {
	    target = Buffer.from(target, target.offset, target.byteLength);
	  }
	  if (!Buffer.isBuffer(target)) {
	    throw new TypeError(
	      'The "target" argument must be one of type Buffer or Uint8Array. ' +
	      'Received type ' + (typeof target)
	    )
	  }

	  if (start === undefined) {
	    start = 0;
	  }
	  if (end === undefined) {
	    end = target ? target.length : 0;
	  }
	  if (thisStart === undefined) {
	    thisStart = 0;
	  }
	  if (thisEnd === undefined) {
	    thisEnd = this.length;
	  }

	  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
	    throw new RangeError('out of range index')
	  }

	  if (thisStart >= thisEnd && start >= end) {
	    return 0
	  }
	  if (thisStart >= thisEnd) {
	    return -1
	  }
	  if (start >= end) {
	    return 1
	  }

	  start >>>= 0;
	  end >>>= 0;
	  thisStart >>>= 0;
	  thisEnd >>>= 0;

	  if (this === target) return 0

	  var x = thisEnd - thisStart;
	  var y = end - start;
	  var len = Math.min(x, y);

	  var thisCopy = this.slice(thisStart, thisEnd);
	  var targetCopy = target.slice(start, end);

	  for (var i = 0; i < len; ++i) {
	    if (thisCopy[i] !== targetCopy[i]) {
	      x = thisCopy[i];
	      y = targetCopy[i];
	      break
	    }
	  }

	  if (x < y) return -1
	  if (y < x) return 1
	  return 0
	};

	// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
	// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
	//
	// Arguments:
	// - buffer - a Buffer to search
	// - val - a string, Buffer, or number
	// - byteOffset - an index into `buffer`; will be clamped to an int32
	// - encoding - an optional encoding, relevant is val is a string
	// - dir - true for indexOf, false for lastIndexOf
	function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
	  // Empty buffer means no match
	  if (buffer.length === 0) return -1

	  // Normalize byteOffset
	  if (typeof byteOffset === 'string') {
	    encoding = byteOffset;
	    byteOffset = 0;
	  } else if (byteOffset > 0x7fffffff) {
	    byteOffset = 0x7fffffff;
	  } else if (byteOffset < -0x80000000) {
	    byteOffset = -0x80000000;
	  }
	  byteOffset = +byteOffset; // Coerce to Number.
	  if (numberIsNaN(byteOffset)) {
	    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
	    byteOffset = dir ? 0 : (buffer.length - 1);
	  }

	  // Normalize byteOffset: negative offsets start from the end of the buffer
	  if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
	  if (byteOffset >= buffer.length) {
	    if (dir) return -1
	    else byteOffset = buffer.length - 1;
	  } else if (byteOffset < 0) {
	    if (dir) byteOffset = 0;
	    else return -1
	  }

	  // Normalize val
	  if (typeof val === 'string') {
	    val = Buffer.from(val, encoding);
	  }

	  // Finally, search either indexOf (if dir is true) or lastIndexOf
	  if (Buffer.isBuffer(val)) {
	    // Special case: looking for empty string/buffer always fails
	    if (val.length === 0) {
	      return -1
	    }
	    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
	  } else if (typeof val === 'number') {
	    val = val & 0xFF; // Search for a byte value [0-255]
	    if (typeof Uint8Array.prototype.indexOf === 'function') {
	      if (dir) {
	        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
	      } else {
	        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
	      }
	    }
	    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir)
	  }

	  throw new TypeError('val must be string, number or Buffer')
	}

	function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
	  var indexSize = 1;
	  var arrLength = arr.length;
	  var valLength = val.length;

	  if (encoding !== undefined) {
	    encoding = String(encoding).toLowerCase();
	    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
	        encoding === 'utf16le' || encoding === 'utf-16le') {
	      if (arr.length < 2 || val.length < 2) {
	        return -1
	      }
	      indexSize = 2;
	      arrLength /= 2;
	      valLength /= 2;
	      byteOffset /= 2;
	    }
	  }

	  function read (buf, i) {
	    if (indexSize === 1) {
	      return buf[i]
	    } else {
	      return buf.readUInt16BE(i * indexSize)
	    }
	  }

	  var i;
	  if (dir) {
	    var foundIndex = -1;
	    for (i = byteOffset; i < arrLength; i++) {
	      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
	        if (foundIndex === -1) foundIndex = i;
	        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
	      } else {
	        if (foundIndex !== -1) i -= i - foundIndex;
	        foundIndex = -1;
	      }
	    }
	  } else {
	    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
	    for (i = byteOffset; i >= 0; i--) {
	      var found = true;
	      for (var j = 0; j < valLength; j++) {
	        if (read(arr, i + j) !== read(val, j)) {
	          found = false;
	          break
	        }
	      }
	      if (found) return i
	    }
	  }

	  return -1
	}

	Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
	  return this.indexOf(val, byteOffset, encoding) !== -1
	};

	Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
	};

	Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
	  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
	};

	function hexWrite (buf, string, offset, length) {
	  offset = Number(offset) || 0;
	  var remaining = buf.length - offset;
	  if (!length) {
	    length = remaining;
	  } else {
	    length = Number(length);
	    if (length > remaining) {
	      length = remaining;
	    }
	  }

	  var strLen = string.length;

	  if (length > strLen / 2) {
	    length = strLen / 2;
	  }
	  for (var i = 0; i < length; ++i) {
	    var parsed = parseInt(string.substr(i * 2, 2), 16);
	    if (numberIsNaN(parsed)) return i
	    buf[offset + i] = parsed;
	  }
	  return i
	}

	function utf8Write (buf, string, offset, length) {
	  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
	}

	function asciiWrite (buf, string, offset, length) {
	  return blitBuffer(asciiToBytes(string), buf, offset, length)
	}

	function base64Write (buf, string, offset, length) {
	  return blitBuffer(base64ToBytes(string), buf, offset, length)
	}

	function ucs2Write (buf, string, offset, length) {
	  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
	}

	Buffer.prototype.write = function write (string, offset, length, encoding) {
	  // Buffer#write(string)
	  if (offset === undefined) {
	    encoding = 'utf8';
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, encoding)
	  } else if (length === undefined && typeof offset === 'string') {
	    encoding = offset;
	    length = this.length;
	    offset = 0;
	  // Buffer#write(string, offset[, length][, encoding])
	  } else if (isFinite(offset)) {
	    offset = offset >>> 0;
	    if (isFinite(length)) {
	      length = length >>> 0;
	      if (encoding === undefined) encoding = 'utf8';
	    } else {
	      encoding = length;
	      length = undefined;
	    }
	  } else {
	    throw new Error(
	      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
	    )
	  }

	  var remaining = this.length - offset;
	  if (length === undefined || length > remaining) length = remaining;

	  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
	    throw new RangeError('Attempt to write outside buffer bounds')
	  }

	  if (!encoding) encoding = 'utf8';

	  var loweredCase = false;
	  for (;;) {
	    switch (encoding) {
	      case 'hex':
	        return hexWrite(this, string, offset, length)

	      case 'utf8':
	      case 'utf-8':
	        return utf8Write(this, string, offset, length)

	      case 'ascii':
	      case 'latin1':
	      case 'binary':
	        return asciiWrite(this, string, offset, length)

	      case 'base64':
	        // Warning: maxLength not taken into account in base64Write
	        return base64Write(this, string, offset, length)

	      case 'ucs2':
	      case 'ucs-2':
	      case 'utf16le':
	      case 'utf-16le':
	        return ucs2Write(this, string, offset, length)

	      default:
	        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
	        encoding = ('' + encoding).toLowerCase();
	        loweredCase = true;
	    }
	  }
	};

	Buffer.prototype.toJSON = function toJSON () {
	  return {
	    type: 'Buffer',
	    data: Array.prototype.slice.call(this._arr || this, 0)
	  }
	};

	function base64Slice (buf, start, end) {
	  if (start === 0 && end === buf.length) {
	    return base64.fromByteArray(buf)
	  } else {
	    return base64.fromByteArray(buf.slice(start, end))
	  }
	}

	function utf8Slice (buf, start, end) {
	  end = Math.min(buf.length, end);
	  var res = [];

	  var i = start;
	  while (i < end) {
	    var firstByte = buf[i];
	    var codePoint = null;
	    var bytesPerSequence = (firstByte > 0xEF)
	      ? 4
	      : (firstByte > 0xDF)
	          ? 3
	          : (firstByte > 0xBF)
	              ? 2
	              : 1;

	    if (i + bytesPerSequence <= end) {
	      var secondByte, thirdByte, fourthByte, tempCodePoint;

	      switch (bytesPerSequence) {
	        case 1:
	          if (firstByte < 0x80) {
	            codePoint = firstByte;
	          }
	          break
	        case 2:
	          secondByte = buf[i + 1];
	          if ((secondByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F);
	            if (tempCodePoint > 0x7F) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 3:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F);
	            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
	              codePoint = tempCodePoint;
	            }
	          }
	          break
	        case 4:
	          secondByte = buf[i + 1];
	          thirdByte = buf[i + 2];
	          fourthByte = buf[i + 3];
	          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
	            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F);
	            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
	              codePoint = tempCodePoint;
	            }
	          }
	      }
	    }

	    if (codePoint === null) {
	      // we did not generate a valid codePoint so insert a
	      // replacement char (U+FFFD) and advance only 1 byte
	      codePoint = 0xFFFD;
	      bytesPerSequence = 1;
	    } else if (codePoint > 0xFFFF) {
	      // encode to utf16 (surrogate pair dance)
	      codePoint -= 0x10000;
	      res.push(codePoint >>> 10 & 0x3FF | 0xD800);
	      codePoint = 0xDC00 | codePoint & 0x3FF;
	    }

	    res.push(codePoint);
	    i += bytesPerSequence;
	  }

	  return decodeCodePointsArray(res)
	}

	// Based on http://stackoverflow.com/a/22747272/680742, the browser with
	// the lowest limit is Chrome, with 0x10000 args.
	// We go 1 magnitude less, for safety
	var MAX_ARGUMENTS_LENGTH = 0x1000;

	function decodeCodePointsArray (codePoints) {
	  var len = codePoints.length;
	  if (len <= MAX_ARGUMENTS_LENGTH) {
	    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
	  }

	  // Decode in chunks to avoid "call stack size exceeded".
	  var res = '';
	  var i = 0;
	  while (i < len) {
	    res += String.fromCharCode.apply(
	      String,
	      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
	    );
	  }
	  return res
	}

	function asciiSlice (buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i] & 0x7F);
	  }
	  return ret
	}

	function latin1Slice (buf, start, end) {
	  var ret = '';
	  end = Math.min(buf.length, end);

	  for (var i = start; i < end; ++i) {
	    ret += String.fromCharCode(buf[i]);
	  }
	  return ret
	}

	function hexSlice (buf, start, end) {
	  var len = buf.length;

	  if (!start || start < 0) start = 0;
	  if (!end || end < 0 || end > len) end = len;

	  var out = '';
	  for (var i = start; i < end; ++i) {
	    out += hexSliceLookupTable[buf[i]];
	  }
	  return out
	}

	function utf16leSlice (buf, start, end) {
	  var bytes = buf.slice(start, end);
	  var res = '';
	  // If bytes.length is odd, the last 8 bits must be ignored (same as node.js)
	  for (var i = 0; i < bytes.length - 1; i += 2) {
	    res += String.fromCharCode(bytes[i] + (bytes[i + 1] * 256));
	  }
	  return res
	}

	Buffer.prototype.slice = function slice (start, end) {
	  var len = this.length;
	  start = ~~start;
	  end = end === undefined ? len : ~~end;

	  if (start < 0) {
	    start += len;
	    if (start < 0) start = 0;
	  } else if (start > len) {
	    start = len;
	  }

	  if (end < 0) {
	    end += len;
	    if (end < 0) end = 0;
	  } else if (end > len) {
	    end = len;
	  }

	  if (end < start) end = start;

	  var newBuf = this.subarray(start, end);
	  // Return an augmented `Uint8Array` instance
	  Object.setPrototypeOf(newBuf, Buffer.prototype);

	  return newBuf
	};

	/*
	 * Need to make sure that buffer isn't trying to write out of bounds.
	 */
	function checkOffset (offset, ext, length) {
	  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
	  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
	}

	Buffer.prototype.readUintLE =
	Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
	  offset = offset >>> 0;
	  byteLength = byteLength >>> 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }

	  return val
	};

	Buffer.prototype.readUintBE =
	Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
	  offset = offset >>> 0;
	  byteLength = byteLength >>> 0;
	  if (!noAssert) {
	    checkOffset(offset, byteLength, this.length);
	  }

	  var val = this[offset + --byteLength];
	  var mul = 1;
	  while (byteLength > 0 && (mul *= 0x100)) {
	    val += this[offset + --byteLength] * mul;
	  }

	  return val
	};

	Buffer.prototype.readUint8 =
	Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  return this[offset]
	};

	Buffer.prototype.readUint16LE =
	Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return this[offset] | (this[offset + 1] << 8)
	};

	Buffer.prototype.readUint16BE =
	Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  return (this[offset] << 8) | this[offset + 1]
	};

	Buffer.prototype.readUint32LE =
	Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return ((this[offset]) |
	      (this[offset + 1] << 8) |
	      (this[offset + 2] << 16)) +
	      (this[offset + 3] * 0x1000000)
	};

	Buffer.prototype.readUint32BE =
	Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] * 0x1000000) +
	    ((this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    this[offset + 3])
	};

	Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
	  offset = offset >>> 0;
	  byteLength = byteLength >>> 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var val = this[offset];
	  var mul = 1;
	  var i = 0;
	  while (++i < byteLength && (mul *= 0x100)) {
	    val += this[offset + i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
	  offset = offset >>> 0;
	  byteLength = byteLength >>> 0;
	  if (!noAssert) checkOffset(offset, byteLength, this.length);

	  var i = byteLength;
	  var mul = 1;
	  var val = this[offset + --i];
	  while (i > 0 && (mul *= 0x100)) {
	    val += this[offset + --i] * mul;
	  }
	  mul *= 0x80;

	  if (val >= mul) val -= Math.pow(2, 8 * byteLength);

	  return val
	};

	Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 1, this.length);
	  if (!(this[offset] & 0x80)) return (this[offset])
	  return ((0xff - this[offset] + 1) * -1)
	};

	Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset] | (this[offset + 1] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 2, this.length);
	  var val = this[offset + 1] | (this[offset] << 8);
	  return (val & 0x8000) ? val | 0xFFFF0000 : val
	};

	Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset]) |
	    (this[offset + 1] << 8) |
	    (this[offset + 2] << 16) |
	    (this[offset + 3] << 24)
	};

	Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 4, this.length);

	  return (this[offset] << 24) |
	    (this[offset + 1] << 16) |
	    (this[offset + 2] << 8) |
	    (this[offset + 3])
	};

	Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754$1.read(this, offset, true, 23, 4)
	};

	Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 4, this.length);
	  return ieee754$1.read(this, offset, false, 23, 4)
	};

	Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754$1.read(this, offset, true, 52, 8)
	};

	Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
	  offset = offset >>> 0;
	  if (!noAssert) checkOffset(offset, 8, this.length);
	  return ieee754$1.read(this, offset, false, 52, 8)
	};

	function checkInt (buf, value, offset, ext, max, min) {
	  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
	  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	}

	Buffer.prototype.writeUintLE =
	Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  byteLength = byteLength >>> 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  var mul = 1;
	  var i = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeUintBE =
	Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  byteLength = byteLength >>> 0;
	  if (!noAssert) {
	    var maxBytes = Math.pow(2, 8 * byteLength) - 1;
	    checkInt(this, value, offset, byteLength, maxBytes, 0);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    this[offset + i] = (value / mul) & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeUint8 =
	Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0);
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	Buffer.prototype.writeUint16LE =
	Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  this[offset] = (value & 0xff);
	  this[offset + 1] = (value >>> 8);
	  return offset + 2
	};

	Buffer.prototype.writeUint16BE =
	Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0);
	  this[offset] = (value >>> 8);
	  this[offset + 1] = (value & 0xff);
	  return offset + 2
	};

	Buffer.prototype.writeUint32LE =
	Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  this[offset + 3] = (value >>> 24);
	  this[offset + 2] = (value >>> 16);
	  this[offset + 1] = (value >>> 8);
	  this[offset] = (value & 0xff);
	  return offset + 4
	};

	Buffer.prototype.writeUint32BE =
	Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0);
	  this[offset] = (value >>> 24);
	  this[offset + 1] = (value >>> 16);
	  this[offset + 2] = (value >>> 8);
	  this[offset + 3] = (value & 0xff);
	  return offset + 4
	};

	Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, (8 * byteLength) - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = 0;
	  var mul = 1;
	  var sub = 0;
	  this[offset] = value & 0xFF;
	  while (++i < byteLength && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) {
	    var limit = Math.pow(2, (8 * byteLength) - 1);

	    checkInt(this, value, offset, byteLength, limit - 1, -limit);
	  }

	  var i = byteLength - 1;
	  var mul = 1;
	  var sub = 0;
	  this[offset + i] = value & 0xFF;
	  while (--i >= 0 && (mul *= 0x100)) {
	    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
	      sub = 1;
	    }
	    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF;
	  }

	  return offset + byteLength
	};

	Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80);
	  if (value < 0) value = 0xff + value + 1;
	  this[offset] = (value & 0xff);
	  return offset + 1
	};

	Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  this[offset] = (value & 0xff);
	  this[offset + 1] = (value >>> 8);
	  return offset + 2
	};

	Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000);
	  this[offset] = (value >>> 8);
	  this[offset + 1] = (value & 0xff);
	  return offset + 2
	};

	Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  this[offset] = (value & 0xff);
	  this[offset + 1] = (value >>> 8);
	  this[offset + 2] = (value >>> 16);
	  this[offset + 3] = (value >>> 24);
	  return offset + 4
	};

	Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000);
	  if (value < 0) value = 0xffffffff + value + 1;
	  this[offset] = (value >>> 24);
	  this[offset + 1] = (value >>> 16);
	  this[offset + 2] = (value >>> 8);
	  this[offset + 3] = (value & 0xff);
	  return offset + 4
	};

	function checkIEEE754 (buf, value, offset, ext, max, min) {
	  if (offset + ext > buf.length) throw new RangeError('Index out of range')
	  if (offset < 0) throw new RangeError('Index out of range')
	}

	function writeFloat (buf, value, offset, littleEndian, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 4);
	  }
	  ieee754$1.write(buf, value, offset, littleEndian, 23, 4);
	  return offset + 4
	}

	Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, true, noAssert)
	};

	Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
	  return writeFloat(this, value, offset, false, noAssert)
	};

	function writeDouble (buf, value, offset, littleEndian, noAssert) {
	  value = +value;
	  offset = offset >>> 0;
	  if (!noAssert) {
	    checkIEEE754(buf, value, offset, 8);
	  }
	  ieee754$1.write(buf, value, offset, littleEndian, 52, 8);
	  return offset + 8
	}

	Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, true, noAssert)
	};

	Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
	  return writeDouble(this, value, offset, false, noAssert)
	};

	// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
	Buffer.prototype.copy = function copy (target, targetStart, start, end) {
	  if (!Buffer.isBuffer(target)) throw new TypeError('argument should be a Buffer')
	  if (!start) start = 0;
	  if (!end && end !== 0) end = this.length;
	  if (targetStart >= target.length) targetStart = target.length;
	  if (!targetStart) targetStart = 0;
	  if (end > 0 && end < start) end = start;

	  // Copy 0 bytes; we're done
	  if (end === start) return 0
	  if (target.length === 0 || this.length === 0) return 0

	  // Fatal error conditions
	  if (targetStart < 0) {
	    throw new RangeError('targetStart out of bounds')
	  }
	  if (start < 0 || start >= this.length) throw new RangeError('Index out of range')
	  if (end < 0) throw new RangeError('sourceEnd out of bounds')

	  // Are we oob?
	  if (end > this.length) end = this.length;
	  if (target.length - targetStart < end - start) {
	    end = target.length - targetStart + start;
	  }

	  var len = end - start;

	  if (this === target && typeof Uint8Array.prototype.copyWithin === 'function') {
	    // Use built-in when available, missing from IE11
	    this.copyWithin(targetStart, start, end);
	  } else {
	    Uint8Array.prototype.set.call(
	      target,
	      this.subarray(start, end),
	      targetStart
	    );
	  }

	  return len
	};

	// Usage:
	//    buffer.fill(number[, offset[, end]])
	//    buffer.fill(buffer[, offset[, end]])
	//    buffer.fill(string[, offset[, end]][, encoding])
	Buffer.prototype.fill = function fill (val, start, end, encoding) {
	  // Handle string cases:
	  if (typeof val === 'string') {
	    if (typeof start === 'string') {
	      encoding = start;
	      start = 0;
	      end = this.length;
	    } else if (typeof end === 'string') {
	      encoding = end;
	      end = this.length;
	    }
	    if (encoding !== undefined && typeof encoding !== 'string') {
	      throw new TypeError('encoding must be a string')
	    }
	    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
	      throw new TypeError('Unknown encoding: ' + encoding)
	    }
	    if (val.length === 1) {
	      var code = val.charCodeAt(0);
	      if ((encoding === 'utf8' && code < 128) ||
	          encoding === 'latin1') {
	        // Fast path: If `val` fits into a single byte, use that numeric value.
	        val = code;
	      }
	    }
	  } else if (typeof val === 'number') {
	    val = val & 255;
	  } else if (typeof val === 'boolean') {
	    val = Number(val);
	  }

	  // Invalid ranges are not set to a default, so can range check early.
	  if (start < 0 || this.length < start || this.length < end) {
	    throw new RangeError('Out of range index')
	  }

	  if (end <= start) {
	    return this
	  }

	  start = start >>> 0;
	  end = end === undefined ? this.length : end >>> 0;

	  if (!val) val = 0;

	  var i;
	  if (typeof val === 'number') {
	    for (i = start; i < end; ++i) {
	      this[i] = val;
	    }
	  } else {
	    var bytes = Buffer.isBuffer(val)
	      ? val
	      : Buffer.from(val, encoding);
	    var len = bytes.length;
	    if (len === 0) {
	      throw new TypeError('The value "' + val +
	        '" is invalid for argument "value"')
	    }
	    for (i = 0; i < end - start; ++i) {
	      this[i + start] = bytes[i % len];
	    }
	  }

	  return this
	};

	// HELPER FUNCTIONS
	// ================

	var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;

	function base64clean (str) {
	  // Node takes equal signs as end of the Base64 encoding
	  str = str.split('=')[0];
	  // Node strips out invalid characters like \n and \t from the string, base64-js does not
	  str = str.trim().replace(INVALID_BASE64_RE, '');
	  // Node converts strings with length < 2 to ''
	  if (str.length < 2) return ''
	  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
	  while (str.length % 4 !== 0) {
	    str = str + '=';
	  }
	  return str
	}

	function utf8ToBytes (string, units) {
	  units = units || Infinity;
	  var codePoint;
	  var length = string.length;
	  var leadSurrogate = null;
	  var bytes = [];

	  for (var i = 0; i < length; ++i) {
	    codePoint = string.charCodeAt(i);

	    // is surrogate component
	    if (codePoint > 0xD7FF && codePoint < 0xE000) {
	      // last char was a lead
	      if (!leadSurrogate) {
	        // no lead yet
	        if (codePoint > 0xDBFF) {
	          // unexpected trail
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        } else if (i + 1 === length) {
	          // unpaired lead
	          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	          continue
	        }

	        // valid lead
	        leadSurrogate = codePoint;

	        continue
	      }

	      // 2 leads in a row
	      if (codePoint < 0xDC00) {
	        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	        leadSurrogate = codePoint;
	        continue
	      }

	      // valid surrogate pair
	      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000;
	    } else if (leadSurrogate) {
	      // valid bmp char, but last char was a lead
	      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD);
	    }

	    leadSurrogate = null;

	    // encode utf8
	    if (codePoint < 0x80) {
	      if ((units -= 1) < 0) break
	      bytes.push(codePoint);
	    } else if (codePoint < 0x800) {
	      if ((units -= 2) < 0) break
	      bytes.push(
	        codePoint >> 0x6 | 0xC0,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x10000) {
	      if ((units -= 3) < 0) break
	      bytes.push(
	        codePoint >> 0xC | 0xE0,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else if (codePoint < 0x110000) {
	      if ((units -= 4) < 0) break
	      bytes.push(
	        codePoint >> 0x12 | 0xF0,
	        codePoint >> 0xC & 0x3F | 0x80,
	        codePoint >> 0x6 & 0x3F | 0x80,
	        codePoint & 0x3F | 0x80
	      );
	    } else {
	      throw new Error('Invalid code point')
	    }
	  }

	  return bytes
	}

	function asciiToBytes (str) {
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    // Node's code seems to be doing this and not & 0x7F..
	    byteArray.push(str.charCodeAt(i) & 0xFF);
	  }
	  return byteArray
	}

	function utf16leToBytes (str, units) {
	  var c, hi, lo;
	  var byteArray = [];
	  for (var i = 0; i < str.length; ++i) {
	    if ((units -= 2) < 0) break

	    c = str.charCodeAt(i);
	    hi = c >> 8;
	    lo = c % 256;
	    byteArray.push(lo);
	    byteArray.push(hi);
	  }

	  return byteArray
	}

	function base64ToBytes (str) {
	  return base64.toByteArray(base64clean(str))
	}

	function blitBuffer (src, dst, offset, length) {
	  for (var i = 0; i < length; ++i) {
	    if ((i + offset >= dst.length) || (i >= src.length)) break
	    dst[i + offset] = src[i];
	  }
	  return i
	}

	// ArrayBuffer or Uint8Array objects from other contexts (i.e. iframes) do not pass
	// the `instanceof` check but they should be treated as of that type.
	// See: https://github.com/feross/buffer/issues/166
	function isInstance (obj, type) {
	  return obj instanceof type ||
	    (obj != null && obj.constructor != null && obj.constructor.name != null &&
	      obj.constructor.name === type.name)
	}
	function numberIsNaN (obj) {
	  // For IE11 support
	  return obj !== obj // eslint-disable-line no-self-compare
	}

	// Create lookup table for `toString('hex')`
	// See: https://github.com/feross/buffer/issues/219
	var hexSliceLookupTable = (function () {
	  var alphabet = '0123456789abcdef';
	  var table = new Array(256);
	  for (var i = 0; i < 16; ++i) {
	    var i16 = i * 16;
	    for (var j = 0; j < 16; ++j) {
	      table[i16 + j] = alphabet[i] + alphabet[j];
	    }
	  }
	  return table
	})();
	}(buffer));

	/*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */

	(function (module, exports) {
	/* eslint-disable node/no-deprecated-api */
	var buffer$1 = buffer;
	var Buffer = buffer$1.Buffer;

	// alternative to using Object.keys for old browsers
	function copyProps (src, dst) {
	  for (var key in src) {
	    dst[key] = src[key];
	  }
	}
	if (Buffer.from && Buffer.alloc && Buffer.allocUnsafe && Buffer.allocUnsafeSlow) {
	  module.exports = buffer$1;
	} else {
	  // Copy properties from require('buffer')
	  copyProps(buffer$1, exports);
	  exports.Buffer = SafeBuffer;
	}

	function SafeBuffer (arg, encodingOrOffset, length) {
	  return Buffer(arg, encodingOrOffset, length)
	}

	SafeBuffer.prototype = Object.create(Buffer.prototype);

	// Copy static methods from Buffer
	copyProps(Buffer, SafeBuffer);

	SafeBuffer.from = function (arg, encodingOrOffset, length) {
	  if (typeof arg === 'number') {
	    throw new TypeError('Argument must not be a number')
	  }
	  return Buffer(arg, encodingOrOffset, length)
	};

	SafeBuffer.alloc = function (size, fill, encoding) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  var buf = Buffer(size);
	  if (fill !== undefined) {
	    if (typeof encoding === 'string') {
	      buf.fill(fill, encoding);
	    } else {
	      buf.fill(fill);
	    }
	  } else {
	    buf.fill(0);
	  }
	  return buf
	};

	SafeBuffer.allocUnsafe = function (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  return Buffer(size)
	};

	SafeBuffer.allocUnsafeSlow = function (size) {
	  if (typeof size !== 'number') {
	    throw new TypeError('Argument must be a number')
	  }
	  return buffer$1.SlowBuffer(size)
	};
	}(safeBuffer, safeBuffer.exports));

	var Buffer$d = safeBuffer.exports.Buffer;

	// prototype class for hash functions
	function Hash$7 (blockSize, finalSize) {
	  this._block = Buffer$d.alloc(blockSize);
	  this._finalSize = finalSize;
	  this._blockSize = blockSize;
	  this._len = 0;
	}

	Hash$7.prototype.update = function (data, enc) {
	  if (typeof data === 'string') {
	    enc = enc || 'utf8';
	    data = Buffer$d.from(data, enc);
	  }

	  var block = this._block;
	  var blockSize = this._blockSize;
	  var length = data.length;
	  var accum = this._len;

	  for (var offset = 0; offset < length;) {
	    var assigned = accum % blockSize;
	    var remainder = Math.min(length - offset, blockSize - assigned);

	    for (var i = 0; i < remainder; i++) {
	      block[assigned + i] = data[offset + i];
	    }

	    accum += remainder;
	    offset += remainder;

	    if ((accum % blockSize) === 0) {
	      this._update(block);
	    }
	  }

	  this._len += length;
	  return this
	};

	Hash$7.prototype.digest = function (enc) {
	  var rem = this._len % this._blockSize;

	  this._block[rem] = 0x80;

	  // zero (rem + 1) trailing bits, where (rem + 1) is the smallest
	  // non-negative solution to the equation (length + 1 + (rem + 1)) === finalSize mod blockSize
	  this._block.fill(0, rem + 1);

	  if (rem >= this._finalSize) {
	    this._update(this._block);
	    this._block.fill(0);
	  }

	  var bits = this._len * 8;

	  // uint32
	  if (bits <= 0xffffffff) {
	    this._block.writeUInt32BE(bits, this._blockSize - 4);

	  // uint64
	  } else {
	    var lowBits = (bits & 0xffffffff) >>> 0;
	    var highBits = (bits - lowBits) / 0x100000000;

	    this._block.writeUInt32BE(highBits, this._blockSize - 8);
	    this._block.writeUInt32BE(lowBits, this._blockSize - 4);
	  }

	  this._update(this._block);
	  var hash = this._hash();

	  return enc ? hash.toString(enc) : hash
	};

	Hash$7.prototype._update = function () {
	  throw new Error('_update must be implemented by subclass')
	};

	var hash = Hash$7;

	/*
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-0, as defined
	 * in FIPS PUB 180-1
	 * This source code is derived from sha1.js of the same repository.
	 * The difference between SHA-0 and SHA-1 is just a bitwise rotate left
	 * operation was added.
	 */

	var inherits$c = inherits_browser.exports;
	var Hash$6 = hash;
	var Buffer$c = safeBuffer.exports.Buffer;

	var K$3 = [
	  0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0
	];

	var W$5 = new Array(80);

	function Sha () {
	  this.init();
	  this._w = W$5;

	  Hash$6.call(this, 64, 56);
	}

	inherits$c(Sha, Hash$6);

	Sha.prototype.init = function () {
	  this._a = 0x67452301;
	  this._b = 0xefcdab89;
	  this._c = 0x98badcfe;
	  this._d = 0x10325476;
	  this._e = 0xc3d2e1f0;

	  return this
	};

	function rotl5$1 (num) {
	  return (num << 5) | (num >>> 27)
	}

	function rotl30$1 (num) {
	  return (num << 30) | (num >>> 2)
	}

	function ft$1 (s, b, c, d) {
	  if (s === 0) return (b & c) | ((~b) & d)
	  if (s === 2) return (b & c) | (b & d) | (c & d)
	  return b ^ c ^ d
	}

	Sha.prototype._update = function (M) {
	  var W = this._w;

	  var a = this._a | 0;
	  var b = this._b | 0;
	  var c = this._c | 0;
	  var d = this._d | 0;
	  var e = this._e | 0;

	  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4);
	  for (; i < 80; ++i) W[i] = W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16];

	  for (var j = 0; j < 80; ++j) {
	    var s = ~~(j / 20);
	    var t = (rotl5$1(a) + ft$1(s, b, c, d) + e + W[j] + K$3[s]) | 0;

	    e = d;
	    d = c;
	    c = rotl30$1(b);
	    b = a;
	    a = t;
	  }

	  this._a = (a + this._a) | 0;
	  this._b = (b + this._b) | 0;
	  this._c = (c + this._c) | 0;
	  this._d = (d + this._d) | 0;
	  this._e = (e + this._e) | 0;
	};

	Sha.prototype._hash = function () {
	  var H = Buffer$c.allocUnsafe(20);

	  H.writeInt32BE(this._a | 0, 0);
	  H.writeInt32BE(this._b | 0, 4);
	  H.writeInt32BE(this._c | 0, 8);
	  H.writeInt32BE(this._d | 0, 12);
	  H.writeInt32BE(this._e | 0, 16);

	  return H
	};

	var sha$2 = Sha;

	/*
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-1, as defined
	 * in FIPS PUB 180-1
	 * Version 2.1a Copyright Paul Johnston 2000 - 2002.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 * Distributed under the BSD License
	 * See http://pajhome.org.uk/crypt/md5 for details.
	 */

	var inherits$b = inherits_browser.exports;
	var Hash$5 = hash;
	var Buffer$b = safeBuffer.exports.Buffer;

	var K$2 = [
	  0x5a827999, 0x6ed9eba1, 0x8f1bbcdc | 0, 0xca62c1d6 | 0
	];

	var W$4 = new Array(80);

	function Sha1 () {
	  this.init();
	  this._w = W$4;

	  Hash$5.call(this, 64, 56);
	}

	inherits$b(Sha1, Hash$5);

	Sha1.prototype.init = function () {
	  this._a = 0x67452301;
	  this._b = 0xefcdab89;
	  this._c = 0x98badcfe;
	  this._d = 0x10325476;
	  this._e = 0xc3d2e1f0;

	  return this
	};

	function rotl1 (num) {
	  return (num << 1) | (num >>> 31)
	}

	function rotl5 (num) {
	  return (num << 5) | (num >>> 27)
	}

	function rotl30 (num) {
	  return (num << 30) | (num >>> 2)
	}

	function ft (s, b, c, d) {
	  if (s === 0) return (b & c) | ((~b) & d)
	  if (s === 2) return (b & c) | (b & d) | (c & d)
	  return b ^ c ^ d
	}

	Sha1.prototype._update = function (M) {
	  var W = this._w;

	  var a = this._a | 0;
	  var b = this._b | 0;
	  var c = this._c | 0;
	  var d = this._d | 0;
	  var e = this._e | 0;

	  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4);
	  for (; i < 80; ++i) W[i] = rotl1(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16]);

	  for (var j = 0; j < 80; ++j) {
	    var s = ~~(j / 20);
	    var t = (rotl5(a) + ft(s, b, c, d) + e + W[j] + K$2[s]) | 0;

	    e = d;
	    d = c;
	    c = rotl30(b);
	    b = a;
	    a = t;
	  }

	  this._a = (a + this._a) | 0;
	  this._b = (b + this._b) | 0;
	  this._c = (c + this._c) | 0;
	  this._d = (d + this._d) | 0;
	  this._e = (e + this._e) | 0;
	};

	Sha1.prototype._hash = function () {
	  var H = Buffer$b.allocUnsafe(20);

	  H.writeInt32BE(this._a | 0, 0);
	  H.writeInt32BE(this._b | 0, 4);
	  H.writeInt32BE(this._c | 0, 8);
	  H.writeInt32BE(this._d | 0, 12);
	  H.writeInt32BE(this._e | 0, 16);

	  return H
	};

	var sha1 = Sha1;

	/**
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
	 * in FIPS 180-2
	 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 *
	 */

	var inherits$a = inherits_browser.exports;
	var Hash$4 = hash;
	var Buffer$a = safeBuffer.exports.Buffer;

	var K$1 = [
	  0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5,
	  0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5,
	  0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3,
	  0x72BE5D74, 0x80DEB1FE, 0x9BDC06A7, 0xC19BF174,
	  0xE49B69C1, 0xEFBE4786, 0x0FC19DC6, 0x240CA1CC,
	  0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA,
	  0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7,
	  0xC6E00BF3, 0xD5A79147, 0x06CA6351, 0x14292967,
	  0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13,
	  0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85,
	  0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
	  0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070,
	  0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5,
	  0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3,
	  0x748F82EE, 0x78A5636F, 0x84C87814, 0x8CC70208,
	  0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2
	];

	var W$3 = new Array(64);

	function Sha256$1 () {
	  this.init();

	  this._w = W$3; // new Array(64)

	  Hash$4.call(this, 64, 56);
	}

	inherits$a(Sha256$1, Hash$4);

	Sha256$1.prototype.init = function () {
	  this._a = 0x6a09e667;
	  this._b = 0xbb67ae85;
	  this._c = 0x3c6ef372;
	  this._d = 0xa54ff53a;
	  this._e = 0x510e527f;
	  this._f = 0x9b05688c;
	  this._g = 0x1f83d9ab;
	  this._h = 0x5be0cd19;

	  return this
	};

	function ch (x, y, z) {
	  return z ^ (x & (y ^ z))
	}

	function maj$1 (x, y, z) {
	  return (x & y) | (z & (x | y))
	}

	function sigma0$1 (x) {
	  return (x >>> 2 | x << 30) ^ (x >>> 13 | x << 19) ^ (x >>> 22 | x << 10)
	}

	function sigma1$1 (x) {
	  return (x >>> 6 | x << 26) ^ (x >>> 11 | x << 21) ^ (x >>> 25 | x << 7)
	}

	function gamma0 (x) {
	  return (x >>> 7 | x << 25) ^ (x >>> 18 | x << 14) ^ (x >>> 3)
	}

	function gamma1 (x) {
	  return (x >>> 17 | x << 15) ^ (x >>> 19 | x << 13) ^ (x >>> 10)
	}

	Sha256$1.prototype._update = function (M) {
	  var W = this._w;

	  var a = this._a | 0;
	  var b = this._b | 0;
	  var c = this._c | 0;
	  var d = this._d | 0;
	  var e = this._e | 0;
	  var f = this._f | 0;
	  var g = this._g | 0;
	  var h = this._h | 0;

	  for (var i = 0; i < 16; ++i) W[i] = M.readInt32BE(i * 4);
	  for (; i < 64; ++i) W[i] = (gamma1(W[i - 2]) + W[i - 7] + gamma0(W[i - 15]) + W[i - 16]) | 0;

	  for (var j = 0; j < 64; ++j) {
	    var T1 = (h + sigma1$1(e) + ch(e, f, g) + K$1[j] + W[j]) | 0;
	    var T2 = (sigma0$1(a) + maj$1(a, b, c)) | 0;

	    h = g;
	    g = f;
	    f = e;
	    e = (d + T1) | 0;
	    d = c;
	    c = b;
	    b = a;
	    a = (T1 + T2) | 0;
	  }

	  this._a = (a + this._a) | 0;
	  this._b = (b + this._b) | 0;
	  this._c = (c + this._c) | 0;
	  this._d = (d + this._d) | 0;
	  this._e = (e + this._e) | 0;
	  this._f = (f + this._f) | 0;
	  this._g = (g + this._g) | 0;
	  this._h = (h + this._h) | 0;
	};

	Sha256$1.prototype._hash = function () {
	  var H = Buffer$a.allocUnsafe(32);

	  H.writeInt32BE(this._a, 0);
	  H.writeInt32BE(this._b, 4);
	  H.writeInt32BE(this._c, 8);
	  H.writeInt32BE(this._d, 12);
	  H.writeInt32BE(this._e, 16);
	  H.writeInt32BE(this._f, 20);
	  H.writeInt32BE(this._g, 24);
	  H.writeInt32BE(this._h, 28);

	  return H
	};

	var sha256 = Sha256$1;

	/**
	 * A JavaScript implementation of the Secure Hash Algorithm, SHA-256, as defined
	 * in FIPS 180-2
	 * Version 2.2-beta Copyright Angel Marin, Paul Johnston 2000 - 2009.
	 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
	 *
	 */

	var inherits$9 = inherits_browser.exports;
	var Sha256 = sha256;
	var Hash$3 = hash;
	var Buffer$9 = safeBuffer.exports.Buffer;

	var W$2 = new Array(64);

	function Sha224 () {
	  this.init();

	  this._w = W$2; // new Array(64)

	  Hash$3.call(this, 64, 56);
	}

	inherits$9(Sha224, Sha256);

	Sha224.prototype.init = function () {
	  this._a = 0xc1059ed8;
	  this._b = 0x367cd507;
	  this._c = 0x3070dd17;
	  this._d = 0xf70e5939;
	  this._e = 0xffc00b31;
	  this._f = 0x68581511;
	  this._g = 0x64f98fa7;
	  this._h = 0xbefa4fa4;

	  return this
	};

	Sha224.prototype._hash = function () {
	  var H = Buffer$9.allocUnsafe(28);

	  H.writeInt32BE(this._a, 0);
	  H.writeInt32BE(this._b, 4);
	  H.writeInt32BE(this._c, 8);
	  H.writeInt32BE(this._d, 12);
	  H.writeInt32BE(this._e, 16);
	  H.writeInt32BE(this._f, 20);
	  H.writeInt32BE(this._g, 24);

	  return H
	};

	var sha224 = Sha224;

	var inherits$8 = inherits_browser.exports;
	var Hash$2 = hash;
	var Buffer$8 = safeBuffer.exports.Buffer;

	var K = [
	  0x428a2f98, 0xd728ae22, 0x71374491, 0x23ef65cd,
	  0xb5c0fbcf, 0xec4d3b2f, 0xe9b5dba5, 0x8189dbbc,
	  0x3956c25b, 0xf348b538, 0x59f111f1, 0xb605d019,
	  0x923f82a4, 0xaf194f9b, 0xab1c5ed5, 0xda6d8118,
	  0xd807aa98, 0xa3030242, 0x12835b01, 0x45706fbe,
	  0x243185be, 0x4ee4b28c, 0x550c7dc3, 0xd5ffb4e2,
	  0x72be5d74, 0xf27b896f, 0x80deb1fe, 0x3b1696b1,
	  0x9bdc06a7, 0x25c71235, 0xc19bf174, 0xcf692694,
	  0xe49b69c1, 0x9ef14ad2, 0xefbe4786, 0x384f25e3,
	  0x0fc19dc6, 0x8b8cd5b5, 0x240ca1cc, 0x77ac9c65,
	  0x2de92c6f, 0x592b0275, 0x4a7484aa, 0x6ea6e483,
	  0x5cb0a9dc, 0xbd41fbd4, 0x76f988da, 0x831153b5,
	  0x983e5152, 0xee66dfab, 0xa831c66d, 0x2db43210,
	  0xb00327c8, 0x98fb213f, 0xbf597fc7, 0xbeef0ee4,
	  0xc6e00bf3, 0x3da88fc2, 0xd5a79147, 0x930aa725,
	  0x06ca6351, 0xe003826f, 0x14292967, 0x0a0e6e70,
	  0x27b70a85, 0x46d22ffc, 0x2e1b2138, 0x5c26c926,
	  0x4d2c6dfc, 0x5ac42aed, 0x53380d13, 0x9d95b3df,
	  0x650a7354, 0x8baf63de, 0x766a0abb, 0x3c77b2a8,
	  0x81c2c92e, 0x47edaee6, 0x92722c85, 0x1482353b,
	  0xa2bfe8a1, 0x4cf10364, 0xa81a664b, 0xbc423001,
	  0xc24b8b70, 0xd0f89791, 0xc76c51a3, 0x0654be30,
	  0xd192e819, 0xd6ef5218, 0xd6990624, 0x5565a910,
	  0xf40e3585, 0x5771202a, 0x106aa070, 0x32bbd1b8,
	  0x19a4c116, 0xb8d2d0c8, 0x1e376c08, 0x5141ab53,
	  0x2748774c, 0xdf8eeb99, 0x34b0bcb5, 0xe19b48a8,
	  0x391c0cb3, 0xc5c95a63, 0x4ed8aa4a, 0xe3418acb,
	  0x5b9cca4f, 0x7763e373, 0x682e6ff3, 0xd6b2b8a3,
	  0x748f82ee, 0x5defb2fc, 0x78a5636f, 0x43172f60,
	  0x84c87814, 0xa1f0ab72, 0x8cc70208, 0x1a6439ec,
	  0x90befffa, 0x23631e28, 0xa4506ceb, 0xde82bde9,
	  0xbef9a3f7, 0xb2c67915, 0xc67178f2, 0xe372532b,
	  0xca273ece, 0xea26619c, 0xd186b8c7, 0x21c0c207,
	  0xeada7dd6, 0xcde0eb1e, 0xf57d4f7f, 0xee6ed178,
	  0x06f067aa, 0x72176fba, 0x0a637dc5, 0xa2c898a6,
	  0x113f9804, 0xbef90dae, 0x1b710b35, 0x131c471b,
	  0x28db77f5, 0x23047d84, 0x32caab7b, 0x40c72493,
	  0x3c9ebe0a, 0x15c9bebc, 0x431d67c4, 0x9c100d4c,
	  0x4cc5d4be, 0xcb3e42b6, 0x597f299c, 0xfc657e2a,
	  0x5fcb6fab, 0x3ad6faec, 0x6c44198c, 0x4a475817
	];

	var W$1 = new Array(160);

	function Sha512 () {
	  this.init();
	  this._w = W$1;

	  Hash$2.call(this, 128, 112);
	}

	inherits$8(Sha512, Hash$2);

	Sha512.prototype.init = function () {
	  this._ah = 0x6a09e667;
	  this._bh = 0xbb67ae85;
	  this._ch = 0x3c6ef372;
	  this._dh = 0xa54ff53a;
	  this._eh = 0x510e527f;
	  this._fh = 0x9b05688c;
	  this._gh = 0x1f83d9ab;
	  this._hh = 0x5be0cd19;

	  this._al = 0xf3bcc908;
	  this._bl = 0x84caa73b;
	  this._cl = 0xfe94f82b;
	  this._dl = 0x5f1d36f1;
	  this._el = 0xade682d1;
	  this._fl = 0x2b3e6c1f;
	  this._gl = 0xfb41bd6b;
	  this._hl = 0x137e2179;

	  return this
	};

	function Ch (x, y, z) {
	  return z ^ (x & (y ^ z))
	}

	function maj (x, y, z) {
	  return (x & y) | (z & (x | y))
	}

	function sigma0 (x, xl) {
	  return (x >>> 28 | xl << 4) ^ (xl >>> 2 | x << 30) ^ (xl >>> 7 | x << 25)
	}

	function sigma1 (x, xl) {
	  return (x >>> 14 | xl << 18) ^ (x >>> 18 | xl << 14) ^ (xl >>> 9 | x << 23)
	}

	function Gamma0 (x, xl) {
	  return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ (x >>> 7)
	}

	function Gamma0l (x, xl) {
	  return (x >>> 1 | xl << 31) ^ (x >>> 8 | xl << 24) ^ (x >>> 7 | xl << 25)
	}

	function Gamma1 (x, xl) {
	  return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ (x >>> 6)
	}

	function Gamma1l (x, xl) {
	  return (x >>> 19 | xl << 13) ^ (xl >>> 29 | x << 3) ^ (x >>> 6 | xl << 26)
	}

	function getCarry (a, b) {
	  return (a >>> 0) < (b >>> 0) ? 1 : 0
	}

	Sha512.prototype._update = function (M) {
	  var W = this._w;

	  var ah = this._ah | 0;
	  var bh = this._bh | 0;
	  var ch = this._ch | 0;
	  var dh = this._dh | 0;
	  var eh = this._eh | 0;
	  var fh = this._fh | 0;
	  var gh = this._gh | 0;
	  var hh = this._hh | 0;

	  var al = this._al | 0;
	  var bl = this._bl | 0;
	  var cl = this._cl | 0;
	  var dl = this._dl | 0;
	  var el = this._el | 0;
	  var fl = this._fl | 0;
	  var gl = this._gl | 0;
	  var hl = this._hl | 0;

	  for (var i = 0; i < 32; i += 2) {
	    W[i] = M.readInt32BE(i * 4);
	    W[i + 1] = M.readInt32BE(i * 4 + 4);
	  }
	  for (; i < 160; i += 2) {
	    var xh = W[i - 15 * 2];
	    var xl = W[i - 15 * 2 + 1];
	    var gamma0 = Gamma0(xh, xl);
	    var gamma0l = Gamma0l(xl, xh);

	    xh = W[i - 2 * 2];
	    xl = W[i - 2 * 2 + 1];
	    var gamma1 = Gamma1(xh, xl);
	    var gamma1l = Gamma1l(xl, xh);

	    // W[i] = gamma0 + W[i - 7] + gamma1 + W[i - 16]
	    var Wi7h = W[i - 7 * 2];
	    var Wi7l = W[i - 7 * 2 + 1];

	    var Wi16h = W[i - 16 * 2];
	    var Wi16l = W[i - 16 * 2 + 1];

	    var Wil = (gamma0l + Wi7l) | 0;
	    var Wih = (gamma0 + Wi7h + getCarry(Wil, gamma0l)) | 0;
	    Wil = (Wil + gamma1l) | 0;
	    Wih = (Wih + gamma1 + getCarry(Wil, gamma1l)) | 0;
	    Wil = (Wil + Wi16l) | 0;
	    Wih = (Wih + Wi16h + getCarry(Wil, Wi16l)) | 0;

	    W[i] = Wih;
	    W[i + 1] = Wil;
	  }

	  for (var j = 0; j < 160; j += 2) {
	    Wih = W[j];
	    Wil = W[j + 1];

	    var majh = maj(ah, bh, ch);
	    var majl = maj(al, bl, cl);

	    var sigma0h = sigma0(ah, al);
	    var sigma0l = sigma0(al, ah);
	    var sigma1h = sigma1(eh, el);
	    var sigma1l = sigma1(el, eh);

	    // t1 = h + sigma1 + ch + K[j] + W[j]
	    var Kih = K[j];
	    var Kil = K[j + 1];

	    var chh = Ch(eh, fh, gh);
	    var chl = Ch(el, fl, gl);

	    var t1l = (hl + sigma1l) | 0;
	    var t1h = (hh + sigma1h + getCarry(t1l, hl)) | 0;
	    t1l = (t1l + chl) | 0;
	    t1h = (t1h + chh + getCarry(t1l, chl)) | 0;
	    t1l = (t1l + Kil) | 0;
	    t1h = (t1h + Kih + getCarry(t1l, Kil)) | 0;
	    t1l = (t1l + Wil) | 0;
	    t1h = (t1h + Wih + getCarry(t1l, Wil)) | 0;

	    // t2 = sigma0 + maj
	    var t2l = (sigma0l + majl) | 0;
	    var t2h = (sigma0h + majh + getCarry(t2l, sigma0l)) | 0;

	    hh = gh;
	    hl = gl;
	    gh = fh;
	    gl = fl;
	    fh = eh;
	    fl = el;
	    el = (dl + t1l) | 0;
	    eh = (dh + t1h + getCarry(el, dl)) | 0;
	    dh = ch;
	    dl = cl;
	    ch = bh;
	    cl = bl;
	    bh = ah;
	    bl = al;
	    al = (t1l + t2l) | 0;
	    ah = (t1h + t2h + getCarry(al, t1l)) | 0;
	  }

	  this._al = (this._al + al) | 0;
	  this._bl = (this._bl + bl) | 0;
	  this._cl = (this._cl + cl) | 0;
	  this._dl = (this._dl + dl) | 0;
	  this._el = (this._el + el) | 0;
	  this._fl = (this._fl + fl) | 0;
	  this._gl = (this._gl + gl) | 0;
	  this._hl = (this._hl + hl) | 0;

	  this._ah = (this._ah + ah + getCarry(this._al, al)) | 0;
	  this._bh = (this._bh + bh + getCarry(this._bl, bl)) | 0;
	  this._ch = (this._ch + ch + getCarry(this._cl, cl)) | 0;
	  this._dh = (this._dh + dh + getCarry(this._dl, dl)) | 0;
	  this._eh = (this._eh + eh + getCarry(this._el, el)) | 0;
	  this._fh = (this._fh + fh + getCarry(this._fl, fl)) | 0;
	  this._gh = (this._gh + gh + getCarry(this._gl, gl)) | 0;
	  this._hh = (this._hh + hh + getCarry(this._hl, hl)) | 0;
	};

	Sha512.prototype._hash = function () {
	  var H = Buffer$8.allocUnsafe(64);

	  function writeInt64BE (h, l, offset) {
	    H.writeInt32BE(h, offset);
	    H.writeInt32BE(l, offset + 4);
	  }

	  writeInt64BE(this._ah, this._al, 0);
	  writeInt64BE(this._bh, this._bl, 8);
	  writeInt64BE(this._ch, this._cl, 16);
	  writeInt64BE(this._dh, this._dl, 24);
	  writeInt64BE(this._eh, this._el, 32);
	  writeInt64BE(this._fh, this._fl, 40);
	  writeInt64BE(this._gh, this._gl, 48);
	  writeInt64BE(this._hh, this._hl, 56);

	  return H
	};

	var sha512 = Sha512;

	var inherits$7 = inherits_browser.exports;
	var SHA512 = sha512;
	var Hash$1 = hash;
	var Buffer$7 = safeBuffer.exports.Buffer;

	var W = new Array(160);

	function Sha384 () {
	  this.init();
	  this._w = W;

	  Hash$1.call(this, 128, 112);
	}

	inherits$7(Sha384, SHA512);

	Sha384.prototype.init = function () {
	  this._ah = 0xcbbb9d5d;
	  this._bh = 0x629a292a;
	  this._ch = 0x9159015a;
	  this._dh = 0x152fecd8;
	  this._eh = 0x67332667;
	  this._fh = 0x8eb44a87;
	  this._gh = 0xdb0c2e0d;
	  this._hh = 0x47b5481d;

	  this._al = 0xc1059ed8;
	  this._bl = 0x367cd507;
	  this._cl = 0x3070dd17;
	  this._dl = 0xf70e5939;
	  this._el = 0xffc00b31;
	  this._fl = 0x68581511;
	  this._gl = 0x64f98fa7;
	  this._hl = 0xbefa4fa4;

	  return this
	};

	Sha384.prototype._hash = function () {
	  var H = Buffer$7.allocUnsafe(48);

	  function writeInt64BE (h, l, offset) {
	    H.writeInt32BE(h, offset);
	    H.writeInt32BE(l, offset + 4);
	  }

	  writeInt64BE(this._ah, this._al, 0);
	  writeInt64BE(this._bh, this._bl, 8);
	  writeInt64BE(this._ch, this._cl, 16);
	  writeInt64BE(this._dh, this._dl, 24);
	  writeInt64BE(this._eh, this._el, 32);
	  writeInt64BE(this._fh, this._fl, 40);

	  return H
	};

	var sha384 = Sha384;

	var exports$1 = sha_js.exports = function SHA (algorithm) {
	  algorithm = algorithm.toLowerCase();

	  var Algorithm = exports$1[algorithm];
	  if (!Algorithm) throw new Error(algorithm + ' is not supported (we accept pull requests)')

	  return new Algorithm()
	};

	exports$1.sha = sha$2;
	exports$1.sha1 = sha1;
	exports$1.sha224 = sha224;
	exports$1.sha256 = sha256;
	exports$1.sha384 = sha384;
	exports$1.sha512 = sha512;

	var sha$1 = sha_js.exports;

	/**
	  @example
	const tx1 = btc.splitTransaction("01000000014ea60aeac5252c14291d428915bd7ccd1bfc4af009f4d4dc57ae597ed0420b71010000008a47304402201f36a12c240dbf9e566bc04321050b1984cd6eaf6caee8f02bb0bfec08e3354b022012ee2aeadcbbfd1e92959f57c15c1c6debb757b798451b104665aa3010569b49014104090b15bde569386734abf2a2b99f9ca6a50656627e77de663ca7325702769986cf26cc9dd7fdea0af432c8e2becc867c932e1b9dd742f2a108997c2252e2bdebffffffff0281b72e00000000001976a91472a5d75c8d2d0565b656a5232703b167d50d5a2b88aca0860100000000001976a9144533f5fb9b4817f713c48f0bfe96b9f50c476c9b88ac00000000");
	const outputScript = btc.serializeTransactionOutputs(tx1).toString('hex');
	  */
	function serializeTransactionOutputs(_a) {
	    var outputs = _a.outputs;
	    var outputBuffer = Buffer$e.alloc(0);
	    if (typeof outputs !== "undefined") {
	        outputBuffer = Buffer$e.concat([outputBuffer, createVarint(outputs.length)]);
	        outputs.forEach(function (output) {
	            outputBuffer = Buffer$e.concat([
	                outputBuffer,
	                output.amount,
	                createVarint(output.script.length),
	                output.script,
	            ]);
	        });
	    }
	    return outputBuffer;
	}
	function serializeTransaction(transaction, skipWitness, timestamp, additionals) {
	    if (additionals === void 0) { additionals = []; }
	    var isDecred = additionals.includes("decred");
	    var isBech32 = additionals.includes("bech32");
	    var inputBuffer = Buffer$e.alloc(0);
	    var useWitness = typeof transaction["witness"] != "undefined" && !skipWitness;
	    transaction.inputs.forEach(function (input) {
	        inputBuffer =
	            isDecred || isBech32
	                ? Buffer$e.concat([
	                    inputBuffer,
	                    input.prevout,
	                    Buffer$e.from([0x00]),
	                    input.sequence,
	                ])
	                : Buffer$e.concat([
	                    inputBuffer,
	                    input.prevout,
	                    createVarint(input.script.length),
	                    input.script,
	                    input.sequence,
	                ]);
	    });
	    var outputBuffer = serializeTransactionOutputs(transaction);
	    if (typeof transaction.outputs !== "undefined" &&
	        typeof transaction.locktime !== "undefined") {
	        outputBuffer = Buffer$e.concat([
	            outputBuffer,
	            (useWitness && transaction.witness) || Buffer$e.alloc(0),
	            transaction.locktime,
	            transaction.nExpiryHeight || Buffer$e.alloc(0),
	            transaction.extraData || Buffer$e.alloc(0),
	        ]);
	    }
	    return Buffer$e.concat([
	        transaction.version,
	        timestamp ? timestamp : Buffer$e.alloc(0),
	        transaction.nVersionGroupId || Buffer$e.alloc(0),
	        useWitness ? Buffer$e.from("0001", "hex") : Buffer$e.alloc(0),
	        createVarint(transaction.inputs.length),
	        inputBuffer,
	        outputBuffer,
	    ]);
	}

	function getTrustedInputBIP143(transport, indexLookup, transaction, additionals) {
	    if (additionals === void 0) { additionals = []; }
	    if (!transaction) {
	        throw new Error("getTrustedInputBIP143: missing tx");
	    }
	    var isDecred = additionals.includes("decred");
	    if (isDecred) {
	        throw new Error("Decred does not implement BIP143");
	    }
	    var hash = sha$1("sha256")
	        .update(sha$1("sha256").update(serializeTransaction(transaction, true)).digest())
	        .digest();
	    var data = Buffer$e.alloc(4);
	    data.writeUInt32LE(indexLookup, 0);
	    var outputs = transaction.outputs, locktime = transaction.locktime;
	    if (!outputs || !locktime) {
	        throw new Error("getTrustedInputBIP143: locktime & outputs is expected");
	    }
	    if (!outputs[indexLookup]) {
	        throw new Error("getTrustedInputBIP143: wrong index");
	    }
	    hash = Buffer$e.concat([hash, data, outputs[indexLookup].amount]);
	    return hash.toString("hex");
	}

	var readable = {exports: {}};

	var events = {exports: {}};

	var R = typeof Reflect === 'object' ? Reflect : null;
	var ReflectApply = R && typeof R.apply === 'function'
	  ? R.apply
	  : function ReflectApply(target, receiver, args) {
	    return Function.prototype.apply.call(target, receiver, args);
	  };

	var ReflectOwnKeys;
	if (R && typeof R.ownKeys === 'function') {
	  ReflectOwnKeys = R.ownKeys;
	} else if (Object.getOwnPropertySymbols) {
	  ReflectOwnKeys = function ReflectOwnKeys(target) {
	    return Object.getOwnPropertyNames(target)
	      .concat(Object.getOwnPropertySymbols(target));
	  };
	} else {
	  ReflectOwnKeys = function ReflectOwnKeys(target) {
	    return Object.getOwnPropertyNames(target);
	  };
	}

	function ProcessEmitWarning(warning) {
	  if (console && console.warn) console.warn(warning);
	}

	var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
	  return value !== value;
	};

	function EventEmitter() {
	  EventEmitter.init.call(this);
	}
	events.exports = EventEmitter;
	events.exports.once = once;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._eventsCount = 0;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	var defaultMaxListeners = 10;

	function checkListener(listener) {
	  if (typeof listener !== 'function') {
	    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
	  }
	}

	Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
	  enumerable: true,
	  get: function() {
	    return defaultMaxListeners;
	  },
	  set: function(arg) {
	    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
	      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
	    }
	    defaultMaxListeners = arg;
	  }
	});

	EventEmitter.init = function() {

	  if (this._events === undefined ||
	      this._events === Object.getPrototypeOf(this)._events) {
	    this._events = Object.create(null);
	    this._eventsCount = 0;
	  }

	  this._maxListeners = this._maxListeners || undefined;
	};

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
	  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
	    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
	  }
	  this._maxListeners = n;
	  return this;
	};

	function _getMaxListeners(that) {
	  if (that._maxListeners === undefined)
	    return EventEmitter.defaultMaxListeners;
	  return that._maxListeners;
	}

	EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
	  return _getMaxListeners(this);
	};

	EventEmitter.prototype.emit = function emit(type) {
	  var args = [];
	  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
	  var doError = (type === 'error');

	  var events = this._events;
	  if (events !== undefined)
	    doError = (doError && events.error === undefined);
	  else if (!doError)
	    return false;

	  // If there is no 'error' event listener then throw.
	  if (doError) {
	    var er;
	    if (args.length > 0)
	      er = args[0];
	    if (er instanceof Error) {
	      // Note: The comments on the `throw` lines are intentional, they show
	      // up in Node's output if this results in an unhandled exception.
	      throw er; // Unhandled 'error' event
	    }
	    // At least give some kind of context to the user
	    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
	    err.context = er;
	    throw err; // Unhandled 'error' event
	  }

	  var handler = events[type];

	  if (handler === undefined)
	    return false;

	  if (typeof handler === 'function') {
	    ReflectApply(handler, this, args);
	  } else {
	    var len = handler.length;
	    var listeners = arrayClone(handler, len);
	    for (var i = 0; i < len; ++i)
	      ReflectApply(listeners[i], this, args);
	  }

	  return true;
	};

	function _addListener(target, type, listener, prepend) {
	  var m;
	  var events;
	  var existing;

	  checkListener(listener);

	  events = target._events;
	  if (events === undefined) {
	    events = target._events = Object.create(null);
	    target._eventsCount = 0;
	  } else {
	    // To avoid recursion in the case that type === "newListener"! Before
	    // adding it to the listeners, first emit "newListener".
	    if (events.newListener !== undefined) {
	      target.emit('newListener', type,
	                  listener.listener ? listener.listener : listener);

	      // Re-assign `events` because a newListener handler could have caused the
	      // this._events to be assigned to a new object
	      events = target._events;
	    }
	    existing = events[type];
	  }

	  if (existing === undefined) {
	    // Optimize the case of one listener. Don't need the extra array object.
	    existing = events[type] = listener;
	    ++target._eventsCount;
	  } else {
	    if (typeof existing === 'function') {
	      // Adding the second element, need to change to array.
	      existing = events[type] =
	        prepend ? [listener, existing] : [existing, listener];
	      // If we've already got an array, just append.
	    } else if (prepend) {
	      existing.unshift(listener);
	    } else {
	      existing.push(listener);
	    }

	    // Check for listener leak
	    m = _getMaxListeners(target);
	    if (m > 0 && existing.length > m && !existing.warned) {
	      existing.warned = true;
	      // No error code for this since it is a Warning
	      // eslint-disable-next-line no-restricted-syntax
	      var w = new Error('Possible EventEmitter memory leak detected. ' +
	                          existing.length + ' ' + String(type) + ' listeners ' +
	                          'added. Use emitter.setMaxListeners() to ' +
	                          'increase limit');
	      w.name = 'MaxListenersExceededWarning';
	      w.emitter = target;
	      w.type = type;
	      w.count = existing.length;
	      ProcessEmitWarning(w);
	    }
	  }

	  return target;
	}

	EventEmitter.prototype.addListener = function addListener(type, listener) {
	  return _addListener(this, type, listener, false);
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.prependListener =
	    function prependListener(type, listener) {
	      return _addListener(this, type, listener, true);
	    };

	function onceWrapper() {
	  if (!this.fired) {
	    this.target.removeListener(this.type, this.wrapFn);
	    this.fired = true;
	    if (arguments.length === 0)
	      return this.listener.call(this.target);
	    return this.listener.apply(this.target, arguments);
	  }
	}

	function _onceWrap(target, type, listener) {
	  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
	  var wrapped = onceWrapper.bind(state);
	  wrapped.listener = listener;
	  state.wrapFn = wrapped;
	  return wrapped;
	}

	EventEmitter.prototype.once = function once(type, listener) {
	  checkListener(listener);
	  this.on(type, _onceWrap(this, type, listener));
	  return this;
	};

	EventEmitter.prototype.prependOnceListener =
	    function prependOnceListener(type, listener) {
	      checkListener(listener);
	      this.prependListener(type, _onceWrap(this, type, listener));
	      return this;
	    };

	// Emits a 'removeListener' event if and only if the listener was removed.
	EventEmitter.prototype.removeListener =
	    function removeListener(type, listener) {
	      var list, events, position, i, originalListener;

	      checkListener(listener);

	      events = this._events;
	      if (events === undefined)
	        return this;

	      list = events[type];
	      if (list === undefined)
	        return this;

	      if (list === listener || list.listener === listener) {
	        if (--this._eventsCount === 0)
	          this._events = Object.create(null);
	        else {
	          delete events[type];
	          if (events.removeListener)
	            this.emit('removeListener', type, list.listener || listener);
	        }
	      } else if (typeof list !== 'function') {
	        position = -1;

	        for (i = list.length - 1; i >= 0; i--) {
	          if (list[i] === listener || list[i].listener === listener) {
	            originalListener = list[i].listener;
	            position = i;
	            break;
	          }
	        }

	        if (position < 0)
	          return this;

	        if (position === 0)
	          list.shift();
	        else {
	          spliceOne(list, position);
	        }

	        if (list.length === 1)
	          events[type] = list[0];

	        if (events.removeListener !== undefined)
	          this.emit('removeListener', type, originalListener || listener);
	      }

	      return this;
	    };

	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

	EventEmitter.prototype.removeAllListeners =
	    function removeAllListeners(type) {
	      var listeners, events, i;

	      events = this._events;
	      if (events === undefined)
	        return this;

	      // not listening for removeListener, no need to emit
	      if (events.removeListener === undefined) {
	        if (arguments.length === 0) {
	          this._events = Object.create(null);
	          this._eventsCount = 0;
	        } else if (events[type] !== undefined) {
	          if (--this._eventsCount === 0)
	            this._events = Object.create(null);
	          else
	            delete events[type];
	        }
	        return this;
	      }

	      // emit removeListener for all listeners on all events
	      if (arguments.length === 0) {
	        var keys = Object.keys(events);
	        var key;
	        for (i = 0; i < keys.length; ++i) {
	          key = keys[i];
	          if (key === 'removeListener') continue;
	          this.removeAllListeners(key);
	        }
	        this.removeAllListeners('removeListener');
	        this._events = Object.create(null);
	        this._eventsCount = 0;
	        return this;
	      }

	      listeners = events[type];

	      if (typeof listeners === 'function') {
	        this.removeListener(type, listeners);
	      } else if (listeners !== undefined) {
	        // LIFO order
	        for (i = listeners.length - 1; i >= 0; i--) {
	          this.removeListener(type, listeners[i]);
	        }
	      }

	      return this;
	    };

	function _listeners(target, type, unwrap) {
	  var events = target._events;

	  if (events === undefined)
	    return [];

	  var evlistener = events[type];
	  if (evlistener === undefined)
	    return [];

	  if (typeof evlistener === 'function')
	    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

	  return unwrap ?
	    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
	}

	EventEmitter.prototype.listeners = function listeners(type) {
	  return _listeners(this, type, true);
	};

	EventEmitter.prototype.rawListeners = function rawListeners(type) {
	  return _listeners(this, type, false);
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  if (typeof emitter.listenerCount === 'function') {
	    return emitter.listenerCount(type);
	  } else {
	    return listenerCount$1.call(emitter, type);
	  }
	};

	EventEmitter.prototype.listenerCount = listenerCount$1;
	function listenerCount$1(type) {
	  var events = this._events;

	  if (events !== undefined) {
	    var evlistener = events[type];

	    if (typeof evlistener === 'function') {
	      return 1;
	    } else if (evlistener !== undefined) {
	      return evlistener.length;
	    }
	  }

	  return 0;
	}

	EventEmitter.prototype.eventNames = function eventNames() {
	  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
	};

	function arrayClone(arr, n) {
	  var copy = new Array(n);
	  for (var i = 0; i < n; ++i)
	    copy[i] = arr[i];
	  return copy;
	}

	function spliceOne(list, index) {
	  for (; index + 1 < list.length; index++)
	    list[index] = list[index + 1];
	  list.pop();
	}

	function unwrapListeners(arr) {
	  var ret = new Array(arr.length);
	  for (var i = 0; i < ret.length; ++i) {
	    ret[i] = arr[i].listener || arr[i];
	  }
	  return ret;
	}

	function once(emitter, name) {
	  return new Promise(function (resolve, reject) {
	    function errorListener(err) {
	      emitter.removeListener(name, resolver);
	      reject(err);
	    }

	    function resolver() {
	      if (typeof emitter.removeListener === 'function') {
	        emitter.removeListener('error', errorListener);
	      }
	      resolve([].slice.call(arguments));
	    }
	    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
	    if (name !== 'error') {
	      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
	    }
	  });
	}

	function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
	  if (typeof emitter.on === 'function') {
	    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
	  }
	}

	function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
	  if (typeof emitter.on === 'function') {
	    if (flags.once) {
	      emitter.once(name, listener);
	    } else {
	      emitter.on(name, listener);
	    }
	  } else if (typeof emitter.addEventListener === 'function') {
	    // EventTarget does not have `error` event semantics like Node
	    // EventEmitters, we do not listen for `error` events here.
	    emitter.addEventListener(name, function wrapListener(arg) {
	      // IE does not have builtin `{ once: true }` support so we
	      // have to do it manually.
	      if (flags.once) {
	        emitter.removeEventListener(name, wrapListener);
	      }
	      listener(arg);
	    });
	  } else {
	    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
	  }
	}

	var EventEmitter$1 = events.exports;

	var inherits$5;
	if (typeof Object.create === 'function'){
	  inherits$5 = function inherits(ctor, superCtor) {
	    // implementation from standard node.js 'util' module
	    ctor.super_ = superCtor;
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  inherits$5 = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor;
	    var TempCtor = function () {};
	    TempCtor.prototype = superCtor.prototype;
	    ctor.prototype = new TempCtor();
	    ctor.prototype.constructor = ctor;
	  };
	}
	var inherits$6 = inherits$5;

	var formatRegExp = /%[sdj%]/g;
	function format(f) {
	  if (!isString$1(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull$1(x) || !isObject$1(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	}

	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	function deprecate(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined$1(global$1.process)) {
	    return function() {
	      return deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	}

	var debugs = {};
	var debugEnviron;
	function debuglog(set) {
	  if (isUndefined$1(debugEnviron))
	    debugEnviron = '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = 0;
	      debugs[set] = function() {
	        var msg = format.apply(null, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	}

	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean$1(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    _extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined$1(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined$1(ctx.depth)) ctx.depth = 2;
	  if (isUndefined$1(ctx.colors)) ctx.colors = false;
	  if (isUndefined$1(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}

	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction$1(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString$1(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError$1(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction$1(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp$1(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate$1(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError$1(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray$2(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction$1(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp$1(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate$1(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError$1(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp$1(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined$1(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString$1(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber$1(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean$1(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull$1(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull$1(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined$1(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var length = output.reduce(function(prev, cur) {
	    if (cur.indexOf('\n') >= 0) ;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray$2(ar) {
	  return Array.isArray(ar);
	}

	function isBoolean$1(arg) {
	  return typeof arg === 'boolean';
	}

	function isNull$1(arg) {
	  return arg === null;
	}

	function isNumber$1(arg) {
	  return typeof arg === 'number';
	}

	function isString$1(arg) {
	  return typeof arg === 'string';
	}

	function isUndefined$1(arg) {
	  return arg === void 0;
	}

	function isRegExp$1(re) {
	  return isObject$1(re) && objectToString$1(re) === '[object RegExp]';
	}

	function isObject$1(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isDate$1(d) {
	  return isObject$1(d) && objectToString$1(d) === '[object Date]';
	}

	function isError$1(e) {
	  return isObject$1(e) &&
	      (objectToString$1(e) === '[object Error]' || e instanceof Error);
	}

	function isFunction$1(arg) {
	  return typeof arg === 'function';
	}

	function objectToString$1(o) {
	  return Object.prototype.toString.call(o);
	}

	function _extend(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject$1(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	}
	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	function BufferList() {
	  this.head = null;
	  this.tail = null;
	  this.length = 0;
	}

	BufferList.prototype.push = function (v) {
	  var entry = { data: v, next: null };
	  if (this.length > 0) this.tail.next = entry;else this.head = entry;
	  this.tail = entry;
	  ++this.length;
	};

	BufferList.prototype.unshift = function (v) {
	  var entry = { data: v, next: this.head };
	  if (this.length === 0) this.tail = entry;
	  this.head = entry;
	  ++this.length;
	};

	BufferList.prototype.shift = function () {
	  if (this.length === 0) return;
	  var ret = this.head.data;
	  if (this.length === 1) this.head = this.tail = null;else this.head = this.head.next;
	  --this.length;
	  return ret;
	};

	BufferList.prototype.clear = function () {
	  this.head = this.tail = null;
	  this.length = 0;
	};

	BufferList.prototype.join = function (s) {
	  if (this.length === 0) return '';
	  var p = this.head;
	  var ret = '' + p.data;
	  while (p = p.next) {
	    ret += s + p.data;
	  }return ret;
	};

	BufferList.prototype.concat = function (n) {
	  if (this.length === 0) return buffer.Buffer.alloc(0);
	  if (this.length === 1) return this.head.data;
	  var ret = buffer.Buffer.allocUnsafe(n >>> 0);
	  var p = this.head;
	  var i = 0;
	  while (p) {
	    p.data.copy(ret, i);
	    i += p.data.length;
	    p = p.next;
	  }
	  return ret;
	};

	var string_decoder = {};

	var StringDecoder_1;
	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var Buffer$6 = buffer.Buffer;

	var isBufferEncoding = Buffer$6.isEncoding
	  || function(encoding) {
	       switch (encoding && encoding.toLowerCase()) {
	         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
	         default: return false;
	       }
	     };


	function assertEncoding(encoding) {
	  if (encoding && !isBufferEncoding(encoding)) {
	    throw new Error('Unknown encoding: ' + encoding);
	  }
	}

	// StringDecoder provides an interface for efficiently splitting a series of
	// buffers into a series of JS strings without breaking apart multi-byte
	// characters. CESU-8 is handled as part of the UTF-8 encoding.
	//
	// @TODO Handling all encodings inside a single object makes it very difficult
	// to reason about this code, so it should be split up in the future.
	// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
	// points as used by CESU-8.
	var StringDecoder$2 = StringDecoder_1 = string_decoder.StringDecoder = function(encoding) {
	  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
	  assertEncoding(encoding);
	  switch (this.encoding) {
	    case 'utf8':
	      // CESU-8 represents each of Surrogate Pair by 3-bytes
	      this.surrogateSize = 3;
	      break;
	    case 'ucs2':
	    case 'utf16le':
	      // UTF-16 represents each of Surrogate Pair by 2-bytes
	      this.surrogateSize = 2;
	      this.detectIncompleteChar = utf16DetectIncompleteChar;
	      break;
	    case 'base64':
	      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
	      this.surrogateSize = 3;
	      this.detectIncompleteChar = base64DetectIncompleteChar;
	      break;
	    default:
	      this.write = passThroughWrite;
	      return;
	  }

	  // Enough space to store all bytes of a single character. UTF-8 needs 4
	  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
	  this.charBuffer = new Buffer$6(6);
	  // Number of bytes received for the current incomplete multi-byte character.
	  this.charReceived = 0;
	  // Number of bytes expected for the current incomplete multi-byte character.
	  this.charLength = 0;
	};


	// write decodes the given buffer and returns it as JS string that is
	// guaranteed to not contain any partial multi-byte characters. Any partial
	// character found at the end of the buffer is buffered up, and will be
	// returned when calling write again with the remaining bytes.
	//
	// Note: Converting a Buffer containing an orphan surrogate to a String
	// currently works, but converting a String to a Buffer (via `new Buffer`, or
	// Buffer#write) will replace incomplete surrogates with the unicode
	// replacement character. See https://codereview.chromium.org/121173009/ .
	StringDecoder$2.prototype.write = function(buffer) {
	  var charStr = '';
	  // if our last write ended with an incomplete multibyte character
	  while (this.charLength) {
	    // determine how many remaining bytes this buffer has to offer for this char
	    var available = (buffer.length >= this.charLength - this.charReceived) ?
	        this.charLength - this.charReceived :
	        buffer.length;

	    // add the new bytes to the char buffer
	    buffer.copy(this.charBuffer, this.charReceived, 0, available);
	    this.charReceived += available;

	    if (this.charReceived < this.charLength) {
	      // still not enough chars in this buffer? wait for more ...
	      return '';
	    }

	    // remove bytes belonging to the current character from the buffer
	    buffer = buffer.slice(available, buffer.length);

	    // get the character that was split
	    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);

	    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	    var charCode = charStr.charCodeAt(charStr.length - 1);
	    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	      this.charLength += this.surrogateSize;
	      charStr = '';
	      continue;
	    }
	    this.charReceived = this.charLength = 0;

	    // if there are no more bytes in this buffer, just emit our char
	    if (buffer.length === 0) {
	      return charStr;
	    }
	    break;
	  }

	  // determine and set charLength / charReceived
	  this.detectIncompleteChar(buffer);

	  var end = buffer.length;
	  if (this.charLength) {
	    // buffer the incomplete character bytes we got
	    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
	    end -= this.charReceived;
	  }

	  charStr += buffer.toString(this.encoding, 0, end);

	  var end = charStr.length - 1;
	  var charCode = charStr.charCodeAt(end);
	  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	    var size = this.surrogateSize;
	    this.charLength += size;
	    this.charReceived += size;
	    this.charBuffer.copy(this.charBuffer, size, 0, size);
	    buffer.copy(this.charBuffer, 0, 0, size);
	    return charStr.substring(0, end);
	  }

	  // or just emit the charStr
	  return charStr;
	};

	// detectIncompleteChar determines if there is an incomplete UTF-8 character at
	// the end of the given buffer. If so, it sets this.charLength to the byte
	// length that character, and sets this.charReceived to the number of bytes
	// that are available for this character.
	StringDecoder$2.prototype.detectIncompleteChar = function(buffer) {
	  // determine how many bytes we have to check at the end of this buffer
	  var i = (buffer.length >= 3) ? 3 : buffer.length;

	  // Figure out if one of the last i bytes of our buffer announces an
	  // incomplete char.
	  for (; i > 0; i--) {
	    var c = buffer[buffer.length - i];

	    // See http://en.wikipedia.org/wiki/UTF-8#Description

	    // 110XXXXX
	    if (i == 1 && c >> 5 == 0x06) {
	      this.charLength = 2;
	      break;
	    }

	    // 1110XXXX
	    if (i <= 2 && c >> 4 == 0x0E) {
	      this.charLength = 3;
	      break;
	    }

	    // 11110XXX
	    if (i <= 3 && c >> 3 == 0x1E) {
	      this.charLength = 4;
	      break;
	    }
	  }
	  this.charReceived = i;
	};

	StringDecoder$2.prototype.end = function(buffer) {
	  var res = '';
	  if (buffer && buffer.length)
	    res = this.write(buffer);

	  if (this.charReceived) {
	    var cr = this.charReceived;
	    var buf = this.charBuffer;
	    var enc = this.encoding;
	    res += buf.slice(0, cr).toString(enc);
	  }

	  return res;
	};

	function passThroughWrite(buffer) {
	  return buffer.toString(this.encoding);
	}

	function utf16DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 2;
	  this.charLength = this.charReceived ? 2 : 0;
	}

	function base64DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 3;
	  this.charLength = this.charReceived ? 3 : 0;
	}

	Readable$2.ReadableState = ReadableState$1;

	var debug$4 = debuglog('stream');
	inherits$6(Readable$2, EventEmitter$1);

	function prependListener(emitter, event, fn) {
	  // Sadly this is not cacheable as some libraries bundle their own
	  // event emitter implementation with them.
	  if (typeof emitter.prependListener === 'function') {
	    return emitter.prependListener(event, fn);
	  } else {
	    // This is a hack to make sure that our error handler is attached before any
	    // userland ones.  NEVER DO THIS. This is here only because this code needs
	    // to continue to work with older versions of Node.js that do not include
	    // the prependListener() method. The goal is to eventually remove this hack.
	    if (!emitter._events || !emitter._events[event])
	      emitter.on(event, fn);
	    else if (Array.isArray(emitter._events[event]))
	      emitter._events[event].unshift(fn);
	    else
	      emitter._events[event] = [fn, emitter._events[event]];
	  }
	}
	function listenerCount (emitter, type) {
	  return emitter.listeners(type).length;
	}
	function ReadableState$1(options, stream) {

	  options = options || {};

	  // object stream flag. Used to make read(n) ignore n and to
	  // make all the buffer merging and length checks go away
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex$2) this.objectMode = this.objectMode || !!options.readableObjectMode;

	  // the point at which it stops calling _read() to fill the buffer
	  // Note: 0 is a valid value, means "don't call _read preemptively ever"
	  var hwm = options.highWaterMark;
	  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

	  // cast to ints.
	  this.highWaterMark = ~ ~this.highWaterMark;

	  // A linked list is used to store data chunks instead of an array because the
	  // linked list can remove elements from the beginning faster than
	  // array.shift()
	  this.buffer = new BufferList();
	  this.length = 0;
	  this.pipes = null;
	  this.pipesCount = 0;
	  this.flowing = null;
	  this.ended = false;
	  this.endEmitted = false;
	  this.reading = false;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // whenever we return null, then we set a flag to say
	  // that we're awaiting a 'readable' event emission.
	  this.needReadable = false;
	  this.emittedReadable = false;
	  this.readableListening = false;
	  this.resumeScheduled = false;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // when piping, we only care about 'readable' events that happen
	  // after read()ing all the bytes and not getting any pushback.
	  this.ranOut = false;

	  // the number of writers that are awaiting a drain event in .pipe()s
	  this.awaitDrain = 0;

	  // if true, a maybeReadMore has been scheduled
	  this.readingMore = false;

	  this.decoder = null;
	  this.encoding = null;
	  if (options.encoding) {
	    this.decoder = new StringDecoder_1(options.encoding);
	    this.encoding = options.encoding;
	  }
	}
	function Readable$2(options) {

	  if (!(this instanceof Readable$2)) return new Readable$2(options);

	  this._readableState = new ReadableState$1(options, this);

	  // legacy
	  this.readable = true;

	  if (options && typeof options.read === 'function') this._read = options.read;

	  EventEmitter$1.call(this);
	}

	// Manually shove something into the read() buffer.
	// This returns true if the highWaterMark has not been hit yet,
	// similar to how Writable.write() returns true if you should
	// write() some more.
	Readable$2.prototype.push = function (chunk, encoding) {
	  var state = this._readableState;

	  if (!state.objectMode && typeof chunk === 'string') {
	    encoding = encoding || state.defaultEncoding;
	    if (encoding !== state.encoding) {
	      chunk = Buffer$e.from(chunk, encoding);
	      encoding = '';
	    }
	  }

	  return readableAddChunk$1(this, state, chunk, encoding, false);
	};

	// Unshift should *always* be something directly out of read()
	Readable$2.prototype.unshift = function (chunk) {
	  var state = this._readableState;
	  return readableAddChunk$1(this, state, chunk, '', true);
	};

	Readable$2.prototype.isPaused = function () {
	  return this._readableState.flowing === false;
	};

	function readableAddChunk$1(stream, state, chunk, encoding, addToFront) {
	  var er = chunkInvalid$1(state, chunk);
	  if (er) {
	    stream.emit('error', er);
	  } else if (chunk === null) {
	    state.reading = false;
	    onEofChunk$1(stream, state);
	  } else if (state.objectMode || chunk && chunk.length > 0) {
	    if (state.ended && !addToFront) {
	      var e = new Error('stream.push() after EOF');
	      stream.emit('error', e);
	    } else if (state.endEmitted && addToFront) {
	      var _e = new Error('stream.unshift() after end event');
	      stream.emit('error', _e);
	    } else {
	      var skipAdd;
	      if (state.decoder && !addToFront && !encoding) {
	        chunk = state.decoder.write(chunk);
	        skipAdd = !state.objectMode && chunk.length === 0;
	      }

	      if (!addToFront) state.reading = false;

	      // Don't add to the buffer if we've decoded to an empty string chunk and
	      // we're not in object mode
	      if (!skipAdd) {
	        // if we want the data now, just emit it.
	        if (state.flowing && state.length === 0 && !state.sync) {
	          stream.emit('data', chunk);
	          stream.read(0);
	        } else {
	          // update the buffer info.
	          state.length += state.objectMode ? 1 : chunk.length;
	          if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);

	          if (state.needReadable) emitReadable$1(stream);
	        }
	      }

	      maybeReadMore$1(stream, state);
	    }
	  } else if (!addToFront) {
	    state.reading = false;
	  }

	  return needMoreData$1(state);
	}

	// if it's past the high water mark, we can push in some more.
	// Also, if we have no data yet, we can stand some
	// more bytes.  This is to work around cases where hwm=0,
	// such as the repl.  Also, if the push() triggered a
	// readable event, and the user called read(largeNumber) such that
	// needReadable was set, then we ought to push more, so that another
	// 'readable' event will be triggered.
	function needMoreData$1(state) {
	  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
	}

	// backwards compatibility.
	Readable$2.prototype.setEncoding = function (enc) {
	  this._readableState.decoder = new StringDecoder_1(enc);
	  this._readableState.encoding = enc;
	  return this;
	};

	// Don't raise the hwm > 8MB
	var MAX_HWM$1 = 0x800000;
	function computeNewHighWaterMark(n) {
	  if (n >= MAX_HWM$1) {
	    n = MAX_HWM$1;
	  } else {
	    // Get the next highest power of 2 to prevent increasing hwm excessively in
	    // tiny amounts
	    n--;
	    n |= n >>> 1;
	    n |= n >>> 2;
	    n |= n >>> 4;
	    n |= n >>> 8;
	    n |= n >>> 16;
	    n++;
	  }
	  return n;
	}

	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function howMuchToRead$1(n, state) {
	  if (n <= 0 || state.length === 0 && state.ended) return 0;
	  if (state.objectMode) return 1;
	  if (n !== n) {
	    // Only flow one buffer at a time
	    if (state.flowing && state.length) return state.buffer.head.data.length;else return state.length;
	  }
	  // If we're asking for more than the current hwm, then raise the hwm.
	  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
	  if (n <= state.length) return n;
	  // Don't have enough
	  if (!state.ended) {
	    state.needReadable = true;
	    return 0;
	  }
	  return state.length;
	}

	// you can override either this method, or the async _read(n) below.
	Readable$2.prototype.read = function (n) {
	  debug$4('read', n);
	  n = parseInt(n, 10);
	  var state = this._readableState;
	  var nOrig = n;

	  if (n !== 0) state.emittedReadable = false;

	  // if we're doing read(0) to trigger a readable event, but we
	  // already have a bunch of data in the buffer, then just trigger
	  // the 'readable' event and move on.
	  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
	    debug$4('read: emitReadable', state.length, state.ended);
	    if (state.length === 0 && state.ended) endReadable$1(this);else emitReadable$1(this);
	    return null;
	  }

	  n = howMuchToRead$1(n, state);

	  // if we've ended, and we're now clear, then finish it up.
	  if (n === 0 && state.ended) {
	    if (state.length === 0) endReadable$1(this);
	    return null;
	  }

	  // All the actual chunk generation logic needs to be
	  // *below* the call to _read.  The reason is that in certain
	  // synthetic stream cases, such as passthrough streams, _read
	  // may be a completely synchronous operation which may change
	  // the state of the read buffer, providing enough data when
	  // before there was *not* enough.
	  //
	  // So, the steps are:
	  // 1. Figure out what the state of things will be after we do
	  // a read from the buffer.
	  //
	  // 2. If that resulting state will trigger a _read, then call _read.
	  // Note that this may be asynchronous, or synchronous.  Yes, it is
	  // deeply ugly to write APIs this way, but that still doesn't mean
	  // that the Readable class should behave improperly, as streams are
	  // designed to be sync/async agnostic.
	  // Take note if the _read call is sync or async (ie, if the read call
	  // has returned yet), so that we know whether or not it's safe to emit
	  // 'readable' etc.
	  //
	  // 3. Actually pull the requested chunks out of the buffer and return.

	  // if we need a readable event, then we need to do some reading.
	  var doRead = state.needReadable;
	  debug$4('need readable', doRead);

	  // if we currently have less than the highWaterMark, then also read some
	  if (state.length === 0 || state.length - n < state.highWaterMark) {
	    doRead = true;
	    debug$4('length less than watermark', doRead);
	  }

	  // however, if we've ended, then there's no point, and if we're already
	  // reading, then it's unnecessary.
	  if (state.ended || state.reading) {
	    doRead = false;
	    debug$4('reading or ended', doRead);
	  } else if (doRead) {
	    debug$4('do read');
	    state.reading = true;
	    state.sync = true;
	    // if the length is currently zero, then we *need* a readable event.
	    if (state.length === 0) state.needReadable = true;
	    // call internal read method
	    this._read(state.highWaterMark);
	    state.sync = false;
	    // If _read pushed data synchronously, then `reading` will be false,
	    // and we need to re-evaluate how much data we can return to the user.
	    if (!state.reading) n = howMuchToRead$1(nOrig, state);
	  }

	  var ret;
	  if (n > 0) ret = fromList$1(n, state);else ret = null;

	  if (ret === null) {
	    state.needReadable = true;
	    n = 0;
	  } else {
	    state.length -= n;
	  }

	  if (state.length === 0) {
	    // If we have nothing in the buffer, then we want to know
	    // as soon as we *do* get something into the buffer.
	    if (!state.ended) state.needReadable = true;

	    // If we tried to read() past the EOF, then emit end on the next tick.
	    if (nOrig !== n && state.ended) endReadable$1(this);
	  }

	  if (ret !== null) this.emit('data', ret);

	  return ret;
	};

	function chunkInvalid$1(state, chunk) {
	  var er = null;
	  if (!isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  return er;
	}

	function onEofChunk$1(stream, state) {
	  if (state.ended) return;
	  if (state.decoder) {
	    var chunk = state.decoder.end();
	    if (chunk && chunk.length) {
	      state.buffer.push(chunk);
	      state.length += state.objectMode ? 1 : chunk.length;
	    }
	  }
	  state.ended = true;

	  // emit 'readable' now to make sure it gets picked up.
	  emitReadable$1(stream);
	}

	// Don't emit readable right away in sync mode, because this can trigger
	// another read() call => stack overflow.  This way, it might trigger
	// a nextTick recursion warning, but that's not so bad.
	function emitReadable$1(stream) {
	  var state = stream._readableState;
	  state.needReadable = false;
	  if (!state.emittedReadable) {
	    debug$4('emitReadable', state.flowing);
	    state.emittedReadable = true;
	    if (state.sync) nextTick(emitReadable_$1, stream);else emitReadable_$1(stream);
	  }
	}

	function emitReadable_$1(stream) {
	  debug$4('emit readable');
	  stream.emit('readable');
	  flow$1(stream);
	}

	// at this point, the user has presumably seen the 'readable' event,
	// and called read() to consume some data.  that may have triggered
	// in turn another _read(n) call, in which case reading = true if
	// it's in progress.
	// However, if we're not ended, or reading, and the length < hwm,
	// then go ahead and try to read some more preemptively.
	function maybeReadMore$1(stream, state) {
	  if (!state.readingMore) {
	    state.readingMore = true;
	    nextTick(maybeReadMore_$1, stream, state);
	  }
	}

	function maybeReadMore_$1(stream, state) {
	  var len = state.length;
	  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
	    debug$4('maybeReadMore read 0');
	    stream.read(0);
	    if (len === state.length)
	      // didn't get any data, stop spinning.
	      break;else len = state.length;
	  }
	  state.readingMore = false;
	}

	// abstract method.  to be overridden in specific implementation classes.
	// call cb(er, data) where data is <= n in length.
	// for virtual (non-string, non-buffer) streams, "length" is somewhat
	// arbitrary, and perhaps not very meaningful.
	Readable$2.prototype._read = function (n) {
	  this.emit('error', new Error('not implemented'));
	};

	Readable$2.prototype.pipe = function (dest, pipeOpts) {
	  var src = this;
	  var state = this._readableState;

	  switch (state.pipesCount) {
	    case 0:
	      state.pipes = dest;
	      break;
	    case 1:
	      state.pipes = [state.pipes, dest];
	      break;
	    default:
	      state.pipes.push(dest);
	      break;
	  }
	  state.pipesCount += 1;
	  debug$4('pipe count=%d opts=%j', state.pipesCount, pipeOpts);

	  var doEnd = (!pipeOpts || pipeOpts.end !== false);

	  var endFn = doEnd ? onend : cleanup;
	  if (state.endEmitted) nextTick(endFn);else src.once('end', endFn);

	  dest.on('unpipe', onunpipe);
	  function onunpipe(readable) {
	    debug$4('onunpipe');
	    if (readable === src) {
	      cleanup();
	    }
	  }

	  function onend() {
	    debug$4('onend');
	    dest.end();
	  }

	  // when the dest drains, it reduces the awaitDrain counter
	  // on the source.  This would be more elegant with a .once()
	  // handler in flow(), but adding and removing repeatedly is
	  // too slow.
	  var ondrain = pipeOnDrain$1(src);
	  dest.on('drain', ondrain);

	  var cleanedUp = false;
	  function cleanup() {
	    debug$4('cleanup');
	    // cleanup event handlers once the pipe is broken
	    dest.removeListener('close', onclose);
	    dest.removeListener('finish', onfinish);
	    dest.removeListener('drain', ondrain);
	    dest.removeListener('error', onerror);
	    dest.removeListener('unpipe', onunpipe);
	    src.removeListener('end', onend);
	    src.removeListener('end', cleanup);
	    src.removeListener('data', ondata);

	    cleanedUp = true;

	    // if the reader is waiting for a drain event from this
	    // specific writer, then it would cause it to never start
	    // flowing again.
	    // So, if this is awaiting a drain, then we just call it now.
	    // If we don't know, then assume that we are waiting for one.
	    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
	  }

	  // If the user pushes more data while we're writing to dest then we'll end up
	  // in ondata again. However, we only want to increase awaitDrain once because
	  // dest will only emit one 'drain' event for the multiple writes.
	  // => Introduce a guard on increasing awaitDrain.
	  var increasedAwaitDrain = false;
	  src.on('data', ondata);
	  function ondata(chunk) {
	    debug$4('ondata');
	    increasedAwaitDrain = false;
	    var ret = dest.write(chunk);
	    if (false === ret && !increasedAwaitDrain) {
	      // If the user unpiped during `dest.write()`, it is possible
	      // to get stuck in a permanently paused state if that write
	      // also returned false.
	      // => Check whether `dest` is still a piping destination.
	      if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf$1(state.pipes, dest) !== -1) && !cleanedUp) {
	        debug$4('false write response, pause', src._readableState.awaitDrain);
	        src._readableState.awaitDrain++;
	        increasedAwaitDrain = true;
	      }
	      src.pause();
	    }
	  }

	  // if the dest has an error, then stop piping into it.
	  // however, don't suppress the throwing behavior for this.
	  function onerror(er) {
	    debug$4('onerror', er);
	    unpipe();
	    dest.removeListener('error', onerror);
	    if (listenerCount(dest, 'error') === 0) dest.emit('error', er);
	  }

	  // Make sure our error handler is attached before userland ones.
	  prependListener(dest, 'error', onerror);

	  // Both close and finish should trigger unpipe, but only once.
	  function onclose() {
	    dest.removeListener('finish', onfinish);
	    unpipe();
	  }
	  dest.once('close', onclose);
	  function onfinish() {
	    debug$4('onfinish');
	    dest.removeListener('close', onclose);
	    unpipe();
	  }
	  dest.once('finish', onfinish);

	  function unpipe() {
	    debug$4('unpipe');
	    src.unpipe(dest);
	  }

	  // tell the dest that it's being piped to
	  dest.emit('pipe', src);

	  // start the flow if it hasn't been started already.
	  if (!state.flowing) {
	    debug$4('pipe resume');
	    src.resume();
	  }

	  return dest;
	};

	function pipeOnDrain$1(src) {
	  return function () {
	    var state = src._readableState;
	    debug$4('pipeOnDrain', state.awaitDrain);
	    if (state.awaitDrain) state.awaitDrain--;
	    if (state.awaitDrain === 0 && src.listeners('data').length) {
	      state.flowing = true;
	      flow$1(src);
	    }
	  };
	}

	Readable$2.prototype.unpipe = function (dest) {
	  var state = this._readableState;

	  // if we're not piping anywhere, then do nothing.
	  if (state.pipesCount === 0) return this;

	  // just one destination.  most common case.
	  if (state.pipesCount === 1) {
	    // passed in one, but it's not the right one.
	    if (dest && dest !== state.pipes) return this;

	    if (!dest) dest = state.pipes;

	    // got a match.
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;
	    if (dest) dest.emit('unpipe', this);
	    return this;
	  }

	  // slow case. multiple pipe destinations.

	  if (!dest) {
	    // remove all.
	    var dests = state.pipes;
	    var len = state.pipesCount;
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;

	    for (var _i = 0; _i < len; _i++) {
	      dests[_i].emit('unpipe', this);
	    }return this;
	  }

	  // try to find the right one.
	  var i = indexOf$1(state.pipes, dest);
	  if (i === -1) return this;

	  state.pipes.splice(i, 1);
	  state.pipesCount -= 1;
	  if (state.pipesCount === 1) state.pipes = state.pipes[0];

	  dest.emit('unpipe', this);

	  return this;
	};

	// set up data events if they are asked for
	// Ensure readable listeners eventually get something
	Readable$2.prototype.on = function (ev, fn) {
	  var res = EventEmitter$1.prototype.on.call(this, ev, fn);

	  if (ev === 'data') {
	    // Start flowing on next tick if stream isn't explicitly paused
	    if (this._readableState.flowing !== false) this.resume();
	  } else if (ev === 'readable') {
	    var state = this._readableState;
	    if (!state.endEmitted && !state.readableListening) {
	      state.readableListening = state.needReadable = true;
	      state.emittedReadable = false;
	      if (!state.reading) {
	        nextTick(nReadingNextTick, this);
	      } else if (state.length) {
	        emitReadable$1(this);
	      }
	    }
	  }

	  return res;
	};
	Readable$2.prototype.addListener = Readable$2.prototype.on;

	function nReadingNextTick(self) {
	  debug$4('readable nexttick read 0');
	  self.read(0);
	}

	// pause() and resume() are remnants of the legacy readable stream API
	// If the user uses them, then switch into old mode.
	Readable$2.prototype.resume = function () {
	  var state = this._readableState;
	  if (!state.flowing) {
	    debug$4('resume');
	    state.flowing = true;
	    resume(this, state);
	  }
	  return this;
	};

	function resume(stream, state) {
	  if (!state.resumeScheduled) {
	    state.resumeScheduled = true;
	    nextTick(resume_, stream, state);
	  }
	}

	function resume_(stream, state) {
	  if (!state.reading) {
	    debug$4('resume read 0');
	    stream.read(0);
	  }

	  state.resumeScheduled = false;
	  state.awaitDrain = 0;
	  stream.emit('resume');
	  flow$1(stream);
	  if (state.flowing && !state.reading) stream.read(0);
	}

	Readable$2.prototype.pause = function () {
	  debug$4('call pause flowing=%j', this._readableState.flowing);
	  if (false !== this._readableState.flowing) {
	    debug$4('pause');
	    this._readableState.flowing = false;
	    this.emit('pause');
	  }
	  return this;
	};

	function flow$1(stream) {
	  var state = stream._readableState;
	  debug$4('flow', state.flowing);
	  while (state.flowing && stream.read() !== null) {}
	}

	// wrap an old-style stream as the async data source.
	// This is *not* part of the readable stream interface.
	// It is an ugly unfortunate mess of history.
	Readable$2.prototype.wrap = function (stream) {
	  var state = this._readableState;
	  var paused = false;

	  var self = this;
	  stream.on('end', function () {
	    debug$4('wrapped end');
	    if (state.decoder && !state.ended) {
	      var chunk = state.decoder.end();
	      if (chunk && chunk.length) self.push(chunk);
	    }

	    self.push(null);
	  });

	  stream.on('data', function (chunk) {
	    debug$4('wrapped data');
	    if (state.decoder) chunk = state.decoder.write(chunk);

	    // don't skip over falsy values in objectMode
	    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;

	    var ret = self.push(chunk);
	    if (!ret) {
	      paused = true;
	      stream.pause();
	    }
	  });

	  // proxy all the other methods.
	  // important when wrapping filters and duplexes.
	  for (var i in stream) {
	    if (this[i] === undefined && typeof stream[i] === 'function') {
	      this[i] = function (method) {
	        return function () {
	          return stream[method].apply(stream, arguments);
	        };
	      }(i);
	    }
	  }

	  // proxy certain important events.
	  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
	  forEach$2(events, function (ev) {
	    stream.on(ev, self.emit.bind(self, ev));
	  });

	  // when we try to consume some more bytes, simply unpause the
	  // underlying stream.
	  self._read = function (n) {
	    debug$4('wrapped _read', n);
	    if (paused) {
	      paused = false;
	      stream.resume();
	    }
	  };

	  return self;
	};

	// exposed for testing purposes only.
	Readable$2._fromList = fromList$1;

	// Pluck off n bytes from an array of buffers.
	// Length is the combined lengths of all the buffers in the list.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function fromList$1(n, state) {
	  // nothing buffered
	  if (state.length === 0) return null;

	  var ret;
	  if (state.objectMode) ret = state.buffer.shift();else if (!n || n >= state.length) {
	    // read it all, truncate the list
	    if (state.decoder) ret = state.buffer.join('');else if (state.buffer.length === 1) ret = state.buffer.head.data;else ret = state.buffer.concat(state.length);
	    state.buffer.clear();
	  } else {
	    // read part of list
	    ret = fromListPartial(n, state.buffer, state.decoder);
	  }

	  return ret;
	}

	// Extracts only enough buffered data to satisfy the amount requested.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function fromListPartial(n, list, hasStrings) {
	  var ret;
	  if (n < list.head.data.length) {
	    // slice is the same for buffers and strings
	    ret = list.head.data.slice(0, n);
	    list.head.data = list.head.data.slice(n);
	  } else if (n === list.head.data.length) {
	    // first chunk is a perfect match
	    ret = list.shift();
	  } else {
	    // result spans more than one buffer
	    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
	  }
	  return ret;
	}

	// Copies a specified amount of characters from the list of buffered data
	// chunks.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function copyFromBufferString(n, list) {
	  var p = list.head;
	  var c = 1;
	  var ret = p.data;
	  n -= ret.length;
	  while (p = p.next) {
	    var str = p.data;
	    var nb = n > str.length ? str.length : n;
	    if (nb === str.length) ret += str;else ret += str.slice(0, n);
	    n -= nb;
	    if (n === 0) {
	      if (nb === str.length) {
	        ++c;
	        if (p.next) list.head = p.next;else list.head = list.tail = null;
	      } else {
	        list.head = p;
	        p.data = str.slice(nb);
	      }
	      break;
	    }
	    ++c;
	  }
	  list.length -= c;
	  return ret;
	}

	// Copies a specified amount of bytes from the list of buffered data chunks.
	// This function is designed to be inlinable, so please take care when making
	// changes to the function body.
	function copyFromBuffer(n, list) {
	  var ret = Buffer$e.allocUnsafe(n);
	  var p = list.head;
	  var c = 1;
	  p.data.copy(ret);
	  n -= p.data.length;
	  while (p = p.next) {
	    var buf = p.data;
	    var nb = n > buf.length ? buf.length : n;
	    buf.copy(ret, ret.length - n, 0, nb);
	    n -= nb;
	    if (n === 0) {
	      if (nb === buf.length) {
	        ++c;
	        if (p.next) list.head = p.next;else list.head = list.tail = null;
	      } else {
	        list.head = p;
	        p.data = buf.slice(nb);
	      }
	      break;
	    }
	    ++c;
	  }
	  list.length -= c;
	  return ret;
	}

	function endReadable$1(stream) {
	  var state = stream._readableState;

	  // If we get here before consuming all the bytes, then that is a
	  // bug in node.  Should never happen.
	  if (state.length > 0) throw new Error('"endReadable()" called on non-empty stream');

	  if (!state.endEmitted) {
	    state.ended = true;
	    nextTick(endReadableNT, state, stream);
	  }
	}

	function endReadableNT(state, stream) {
	  // Check that we didn't get one last unshift.
	  if (!state.endEmitted && state.length === 0) {
	    state.endEmitted = true;
	    stream.readable = false;
	    stream.emit('end');
	  }
	}

	function forEach$2(xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

	function indexOf$1(xs, x) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    if (xs[i] === x) return i;
	  }
	  return -1;
	}

	// A bit simpler than readable streams.
	Writable$2.WritableState = WritableState$1;
	inherits$6(Writable$2, events.exports.EventEmitter);

	function nop() {}

	function WriteReq$1(chunk, encoding, cb) {
	  this.chunk = chunk;
	  this.encoding = encoding;
	  this.callback = cb;
	  this.next = null;
	}

	function WritableState$1(options, stream) {
	  Object.defineProperty(this, 'buffer', {
	    get: deprecate(function () {
	      return this.getBuffer();
	    }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
	  });
	  options = options || {};

	  // object stream flag to indicate whether or not this stream
	  // contains buffers or objects.
	  this.objectMode = !!options.objectMode;

	  if (stream instanceof Duplex$2) this.objectMode = this.objectMode || !!options.writableObjectMode;

	  // the point at which write() starts returning false
	  // Note: 0 is a valid value, means that we always return false if
	  // the entire buffer is not flushed immediately on write()
	  var hwm = options.highWaterMark;
	  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;

	  // cast to ints.
	  this.highWaterMark = ~ ~this.highWaterMark;

	  this.needDrain = false;
	  // at the start of calling end()
	  this.ending = false;
	  // when end() has been called, and returned
	  this.ended = false;
	  // when 'finish' is emitted
	  this.finished = false;

	  // should we decode strings into buffers before passing to _write?
	  // this is here so that some node-core streams can optimize string
	  // handling at a lower level.
	  var noDecode = options.decodeStrings === false;
	  this.decodeStrings = !noDecode;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // not an actual buffer we keep track of, but a measurement
	  // of how much we're waiting to get pushed to some underlying
	  // socket or file.
	  this.length = 0;

	  // a flag to see when we're in the middle of a write.
	  this.writing = false;

	  // when true all writes will be buffered until .uncork() call
	  this.corked = 0;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // a flag to know if we're processing previously buffered items, which
	  // may call the _write() callback in the same tick, so that we don't
	  // end up in an overlapped onwrite situation.
	  this.bufferProcessing = false;

	  // the callback that's passed to _write(chunk,cb)
	  this.onwrite = function (er) {
	    onwrite$1(stream, er);
	  };

	  // the callback that the user supplies to write(chunk,encoding,cb)
	  this.writecb = null;

	  // the amount that is being written when _write is called.
	  this.writelen = 0;

	  this.bufferedRequest = null;
	  this.lastBufferedRequest = null;

	  // number of pending user-supplied write callbacks
	  // this must be 0 before 'finish' can be emitted
	  this.pendingcb = 0;

	  // emit prefinish if the only thing we're waiting for is _write cbs
	  // This is relevant for synchronous Transform streams
	  this.prefinished = false;

	  // True if the error was already emitted and should not be thrown again
	  this.errorEmitted = false;

	  // count buffered requests
	  this.bufferedRequestCount = 0;

	  // allocate the first CorkedRequest, there is always
	  // one allocated and free to use, and we maintain at most two
	  this.corkedRequestsFree = new CorkedRequest(this);
	}

	WritableState$1.prototype.getBuffer = function writableStateGetBuffer() {
	  var current = this.bufferedRequest;
	  var out = [];
	  while (current) {
	    out.push(current);
	    current = current.next;
	  }
	  return out;
	};
	function Writable$2(options) {

	  // Writable ctor is applied to Duplexes, though they're not
	  // instanceof Writable, they're instanceof Readable.
	  if (!(this instanceof Writable$2) && !(this instanceof Duplex$2)) return new Writable$2(options);

	  this._writableState = new WritableState$1(options, this);

	  // legacy.
	  this.writable = true;

	  if (options) {
	    if (typeof options.write === 'function') this._write = options.write;

	    if (typeof options.writev === 'function') this._writev = options.writev;
	  }

	  events.exports.EventEmitter.call(this);
	}

	// Otherwise people can pipe Writable streams, which is just wrong.
	Writable$2.prototype.pipe = function () {
	  this.emit('error', new Error('Cannot pipe, not readable'));
	};

	function writeAfterEnd$1(stream, cb) {
	  var er = new Error('write after end');
	  // TODO: defer error events consistently everywhere, not just the cb
	  stream.emit('error', er);
	  nextTick(cb, er);
	}

	// If we get something that is not a buffer, string, null, or undefined,
	// and we're not in objectMode, then that's an error.
	// Otherwise stream chunks are all considered to be of length=1, and the
	// watermarks determine how many objects to keep in the buffer, rather than
	// how many bytes or characters.
	function validChunk$1(stream, state, chunk, cb) {
	  var valid = true;
	  var er = false;
	  // Always throw error if a null is written
	  // if we are not in object mode then throw
	  // if it is not a buffer, string, or undefined.
	  if (chunk === null) {
	    er = new TypeError('May not write null values to stream');
	  } else if (!buffer.Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== undefined && !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  if (er) {
	    stream.emit('error', er);
	    nextTick(cb, er);
	    valid = false;
	  }
	  return valid;
	}

	Writable$2.prototype.write = function (chunk, encoding, cb) {
	  var state = this._writableState;
	  var ret = false;

	  if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = null;
	  }

	  if (buffer.Buffer.isBuffer(chunk)) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;

	  if (typeof cb !== 'function') cb = nop;

	  if (state.ended) writeAfterEnd$1(this, cb);else if (validChunk$1(this, state, chunk, cb)) {
	    state.pendingcb++;
	    ret = writeOrBuffer$1(this, state, chunk, encoding, cb);
	  }

	  return ret;
	};

	Writable$2.prototype.cork = function () {
	  var state = this._writableState;

	  state.corked++;
	};

	Writable$2.prototype.uncork = function () {
	  var state = this._writableState;

	  if (state.corked) {
	    state.corked--;

	    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer$1(this, state);
	  }
	};

	Writable$2.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
	  // node::ParseEncoding() requires lower case.
	  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
	  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
	  this._writableState.defaultEncoding = encoding;
	  return this;
	};

	function decodeChunk$1(state, chunk, encoding) {
	  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
	    chunk = buffer.Buffer.from(chunk, encoding);
	  }
	  return chunk;
	}

	// if we're already writing something, then just put this
	// in the queue, and wait our turn.  Otherwise, call _write
	// If we return false, then we need a drain event, so set that flag.
	function writeOrBuffer$1(stream, state, chunk, encoding, cb) {
	  chunk = decodeChunk$1(state, chunk, encoding);

	  if (buffer.Buffer.isBuffer(chunk)) encoding = 'buffer';
	  var len = state.objectMode ? 1 : chunk.length;

	  state.length += len;

	  var ret = state.length < state.highWaterMark;
	  // we must ensure that previous needDrain will not be reset to false.
	  if (!ret) state.needDrain = true;

	  if (state.writing || state.corked) {
	    var last = state.lastBufferedRequest;
	    state.lastBufferedRequest = new WriteReq$1(chunk, encoding, cb);
	    if (last) {
	      last.next = state.lastBufferedRequest;
	    } else {
	      state.bufferedRequest = state.lastBufferedRequest;
	    }
	    state.bufferedRequestCount += 1;
	  } else {
	    doWrite$1(stream, state, false, len, chunk, encoding, cb);
	  }

	  return ret;
	}

	function doWrite$1(stream, state, writev, len, chunk, encoding, cb) {
	  state.writelen = len;
	  state.writecb = cb;
	  state.writing = true;
	  state.sync = true;
	  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
	  state.sync = false;
	}

	function onwriteError$1(stream, state, sync, er, cb) {
	  --state.pendingcb;
	  if (sync) nextTick(cb, er);else cb(er);

	  stream._writableState.errorEmitted = true;
	  stream.emit('error', er);
	}

	function onwriteStateUpdate$1(state) {
	  state.writing = false;
	  state.writecb = null;
	  state.length -= state.writelen;
	  state.writelen = 0;
	}

	function onwrite$1(stream, er) {
	  var state = stream._writableState;
	  var sync = state.sync;
	  var cb = state.writecb;

	  onwriteStateUpdate$1(state);

	  if (er) onwriteError$1(stream, state, sync, er, cb);else {
	    // Check if we're actually ready to finish, but don't emit yet
	    var finished = needFinish$1(state);

	    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
	      clearBuffer$1(stream, state);
	    }

	    if (sync) {
	      /*<replacement>*/
	        nextTick(afterWrite$1, stream, state, finished, cb);
	      /*</replacement>*/
	    } else {
	        afterWrite$1(stream, state, finished, cb);
	      }
	  }
	}

	function afterWrite$1(stream, state, finished, cb) {
	  if (!finished) onwriteDrain$1(stream, state);
	  state.pendingcb--;
	  cb();
	  finishMaybe$1(stream, state);
	}

	// Must force callback to be called on nextTick, so that we don't
	// emit 'drain' before the write() consumer gets the 'false' return
	// value, and has a chance to attach a 'drain' listener.
	function onwriteDrain$1(stream, state) {
	  if (state.length === 0 && state.needDrain) {
	    state.needDrain = false;
	    stream.emit('drain');
	  }
	}

	// if there's something in the buffer waiting, then process it
	function clearBuffer$1(stream, state) {
	  state.bufferProcessing = true;
	  var entry = state.bufferedRequest;

	  if (stream._writev && entry && entry.next) {
	    // Fast case, write everything using _writev()
	    var l = state.bufferedRequestCount;
	    var buffer = new Array(l);
	    var holder = state.corkedRequestsFree;
	    holder.entry = entry;

	    var count = 0;
	    while (entry) {
	      buffer[count] = entry;
	      entry = entry.next;
	      count += 1;
	    }

	    doWrite$1(stream, state, true, state.length, buffer, '', holder.finish);

	    // doWrite is almost always async, defer these to save a bit of time
	    // as the hot path ends with doWrite
	    state.pendingcb++;
	    state.lastBufferedRequest = null;
	    if (holder.next) {
	      state.corkedRequestsFree = holder.next;
	      holder.next = null;
	    } else {
	      state.corkedRequestsFree = new CorkedRequest(state);
	    }
	  } else {
	    // Slow case, write chunks one-by-one
	    while (entry) {
	      var chunk = entry.chunk;
	      var encoding = entry.encoding;
	      var cb = entry.callback;
	      var len = state.objectMode ? 1 : chunk.length;

	      doWrite$1(stream, state, false, len, chunk, encoding, cb);
	      entry = entry.next;
	      // if we didn't call the onwrite immediately, then
	      // it means that we need to wait until it does.
	      // also, that means that the chunk and cb are currently
	      // being processed, so move the buffer counter past them.
	      if (state.writing) {
	        break;
	      }
	    }

	    if (entry === null) state.lastBufferedRequest = null;
	  }

	  state.bufferedRequestCount = 0;
	  state.bufferedRequest = entry;
	  state.bufferProcessing = false;
	}

	Writable$2.prototype._write = function (chunk, encoding, cb) {
	  cb(new Error('not implemented'));
	};

	Writable$2.prototype._writev = null;

	Writable$2.prototype.end = function (chunk, encoding, cb) {
	  var state = this._writableState;

	  if (typeof chunk === 'function') {
	    cb = chunk;
	    chunk = null;
	    encoding = null;
	  } else if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = null;
	  }

	  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);

	  // .end() fully uncorks
	  if (state.corked) {
	    state.corked = 1;
	    this.uncork();
	  }

	  // ignore unnecessary end() calls.
	  if (!state.ending && !state.finished) endWritable$1(this, state, cb);
	};

	function needFinish$1(state) {
	  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
	}

	function prefinish(stream, state) {
	  if (!state.prefinished) {
	    state.prefinished = true;
	    stream.emit('prefinish');
	  }
	}

	function finishMaybe$1(stream, state) {
	  var need = needFinish$1(state);
	  if (need) {
	    if (state.pendingcb === 0) {
	      prefinish(stream, state);
	      state.finished = true;
	      stream.emit('finish');
	    } else {
	      prefinish(stream, state);
	    }
	  }
	  return need;
	}

	function endWritable$1(stream, state, cb) {
	  state.ending = true;
	  finishMaybe$1(stream, state);
	  if (cb) {
	    if (state.finished) nextTick(cb);else stream.once('finish', cb);
	  }
	  state.ended = true;
	  stream.writable = false;
	}

	// It seems a linked list but it is not
	// there will be only 2 of these for each stream
	function CorkedRequest(state) {
	  var _this = this;

	  this.next = null;
	  this.entry = null;

	  this.finish = function (err) {
	    var entry = _this.entry;
	    _this.entry = null;
	    while (entry) {
	      var cb = entry.callback;
	      state.pendingcb--;
	      cb(err);
	      entry = entry.next;
	    }
	    if (state.corkedRequestsFree) {
	      state.corkedRequestsFree.next = _this;
	    } else {
	      state.corkedRequestsFree = _this;
	    }
	  };
	}

	inherits$6(Duplex$2, Readable$2);

	var keys = Object.keys(Writable$2.prototype);
	for (var v = 0; v < keys.length; v++) {
	  var method = keys[v];
	  if (!Duplex$2.prototype[method]) Duplex$2.prototype[method] = Writable$2.prototype[method];
	}
	function Duplex$2(options) {
	  if (!(this instanceof Duplex$2)) return new Duplex$2(options);

	  Readable$2.call(this, options);
	  Writable$2.call(this, options);

	  if (options && options.readable === false) this.readable = false;

	  if (options && options.writable === false) this.writable = false;

	  this.allowHalfOpen = true;
	  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;

	  this.once('end', onend$1);
	}

	// the no-half-open enforcer
	function onend$1() {
	  // if we allow half-open state, or if the writable side ended,
	  // then we're ok.
	  if (this.allowHalfOpen || this._writableState.ended) return;

	  // no more data can be written.
	  // But allow more writes to happen in this tick.
	  nextTick(onEndNT, this);
	}

	function onEndNT(self) {
	  self.end();
	}

	// a transform stream is a readable/writable stream where you do
	inherits$6(Transform$4, Duplex$2);

	function TransformState$1(stream) {
	  this.afterTransform = function (er, data) {
	    return afterTransform$1(stream, er, data);
	  };

	  this.needTransform = false;
	  this.transforming = false;
	  this.writecb = null;
	  this.writechunk = null;
	  this.writeencoding = null;
	}

	function afterTransform$1(stream, er, data) {
	  var ts = stream._transformState;
	  ts.transforming = false;

	  var cb = ts.writecb;

	  if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));

	  ts.writechunk = null;
	  ts.writecb = null;

	  if (data !== null && data !== undefined) stream.push(data);

	  cb(er);

	  var rs = stream._readableState;
	  rs.reading = false;
	  if (rs.needReadable || rs.length < rs.highWaterMark) {
	    stream._read(rs.highWaterMark);
	  }
	}
	function Transform$4(options) {
	  if (!(this instanceof Transform$4)) return new Transform$4(options);

	  Duplex$2.call(this, options);

	  this._transformState = new TransformState$1(this);

	  // when the writable side finishes, then flush out anything remaining.
	  var stream = this;

	  // start out asking for a readable event once data is transformed.
	  this._readableState.needReadable = true;

	  // we have implemented the _read method, and done the other things
	  // that Readable wants before the first _read call, so unset the
	  // sync guard flag.
	  this._readableState.sync = false;

	  if (options) {
	    if (typeof options.transform === 'function') this._transform = options.transform;

	    if (typeof options.flush === 'function') this._flush = options.flush;
	  }

	  this.once('prefinish', function () {
	    if (typeof this._flush === 'function') this._flush(function (er) {
	      done$1(stream, er);
	    });else done$1(stream);
	  });
	}

	Transform$4.prototype.push = function (chunk, encoding) {
	  this._transformState.needTransform = false;
	  return Duplex$2.prototype.push.call(this, chunk, encoding);
	};

	// This is the part where you do stuff!
	// override this function in implementation classes.
	// 'chunk' is an input chunk.
	//
	// Call `push(newChunk)` to pass along transformed output
	// to the readable side.  You may call 'push' zero or more times.
	//
	// Call `cb(err)` when you are done with this chunk.  If you pass
	// an error, then that'll put the hurt on the whole operation.  If you
	// never call cb(), then you'll never get another chunk.
	Transform$4.prototype._transform = function (chunk, encoding, cb) {
	  throw new Error('Not implemented');
	};

	Transform$4.prototype._write = function (chunk, encoding, cb) {
	  var ts = this._transformState;
	  ts.writecb = cb;
	  ts.writechunk = chunk;
	  ts.writeencoding = encoding;
	  if (!ts.transforming) {
	    var rs = this._readableState;
	    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
	  }
	};

	// Doesn't matter what the args are here.
	// _transform does all the work.
	// That we got here means that the readable side wants more data.
	Transform$4.prototype._read = function (n) {
	  var ts = this._transformState;

	  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
	    ts.transforming = true;
	    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
	  } else {
	    // mark that we need a transform, so that any data that comes in
	    // will get processed, now that we've asked for it.
	    ts.needTransform = true;
	  }
	};

	function done$1(stream, er) {
	  if (er) return stream.emit('error', er);

	  // if there's nothing in the write buffer, then that means
	  // that nothing more will ever be provided
	  var ws = stream._writableState;
	  var ts = stream._transformState;

	  if (ws.length) throw new Error('Calling transform done when ws.length != 0');

	  if (ts.transforming) throw new Error('Calling transform done when still transforming');

	  return stream.push(null);
	}

	inherits$6(PassThrough$1, Transform$4);
	function PassThrough$1(options) {
	  if (!(this instanceof PassThrough$1)) return new PassThrough$1(options);

	  Transform$4.call(this, options);
	}

	PassThrough$1.prototype._transform = function (chunk, encoding, cb) {
	  cb(null, chunk);
	};

	inherits$6(Stream$2, EventEmitter$1);
	Stream$2.Readable = Readable$2;
	Stream$2.Writable = Writable$2;
	Stream$2.Duplex = Duplex$2;
	Stream$2.Transform = Transform$4;
	Stream$2.PassThrough = PassThrough$1;

	// Backwards-compat with node 0.4.x
	Stream$2.Stream = Stream$2;

	// old-style streams.  Note that the pipe method (the only relevant
	// part of this class) is overridden in the Readable class.

	function Stream$2() {
	  EventEmitter$1.call(this);
	}

	Stream$2.prototype.pipe = function(dest, options) {
	  var source = this;

	  function ondata(chunk) {
	    if (dest.writable) {
	      if (false === dest.write(chunk) && source.pause) {
	        source.pause();
	      }
	    }
	  }

	  source.on('data', ondata);

	  function ondrain() {
	    if (source.readable && source.resume) {
	      source.resume();
	    }
	  }

	  dest.on('drain', ondrain);

	  // If the 'end' option is not supplied, dest.end() will be called when
	  // source gets the 'end' or 'close' events.  Only dest.end() once.
	  if (!dest._isStdio && (!options || options.end !== false)) {
	    source.on('end', onend);
	    source.on('close', onclose);
	  }

	  var didOnEnd = false;
	  function onend() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    dest.end();
	  }


	  function onclose() {
	    if (didOnEnd) return;
	    didOnEnd = true;

	    if (typeof dest.destroy === 'function') dest.destroy();
	  }

	  // don't leave dangling pipes when there are errors.
	  function onerror(er) {
	    cleanup();
	    if (EventEmitter$1.listenerCount(this, 'error') === 0) {
	      throw er; // Unhandled stream error in pipe.
	    }
	  }

	  source.on('error', onerror);
	  dest.on('error', onerror);

	  // remove all the event listeners that were added.
	  function cleanup() {
	    source.removeListener('data', ondata);
	    dest.removeListener('drain', ondrain);

	    source.removeListener('end', onend);
	    source.removeListener('close', onclose);

	    source.removeListener('error', onerror);
	    dest.removeListener('error', onerror);

	    source.removeListener('end', cleanup);
	    source.removeListener('close', cleanup);

	    dest.removeListener('close', cleanup);
	  }

	  source.on('end', cleanup);
	  source.on('close', cleanup);

	  dest.on('close', cleanup);

	  dest.emit('pipe', source);

	  // Allow for unix-like usage: A.pipe(B).pipe(C)
	  return dest;
	};

	var stream = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': Stream$2,
		Readable: Readable$2,
		Writable: Writable$2,
		Duplex: Duplex$2,
		Transform: Transform$4,
		PassThrough: PassThrough$1,
		Stream: Stream$2
	});

	var require$$1 = /*@__PURE__*/getAugmentedNamespace(stream);

	var isarray = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};

	var util$5 = {};

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.

	function isArray$1(arg) {
	  if (Array.isArray) {
	    return Array.isArray(arg);
	  }
	  return objectToString(arg) === '[object Array]';
	}
	util$5.isArray = isArray$1;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	util$5.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	util$5.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	util$5.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	util$5.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	util$5.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	util$5.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	util$5.isUndefined = isUndefined;

	function isRegExp(re) {
	  return objectToString(re) === '[object RegExp]';
	}
	util$5.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	util$5.isObject = isObject;

	function isDate(d) {
	  return objectToString(d) === '[object Date]';
	}
	util$5.isDate = isDate;

	function isError(e) {
	  return (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	util$5.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	util$5.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	util$5.isPrimitive = isPrimitive;

	util$5.isBuffer = buffer.Buffer.isBuffer;

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var _stream_readable = Readable$1;

	/*<replacement>*/
	var isArray = isarray;
	/*</replacement>*/


	/*<replacement>*/
	var Buffer$5 = buffer.Buffer;
	/*</replacement>*/

	Readable$1.ReadableState = ReadableState;

	var EE = events.exports.EventEmitter;

	/*<replacement>*/
	if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
	  return emitter.listeners(type).length;
	};
	/*</replacement>*/

	var Stream$1 = require$$1;

	/*<replacement>*/
	var util$4 = util$5;
	util$4.inherits = inherits_browser.exports;
	/*</replacement>*/

	var StringDecoder$1;

	util$4.inherits(Readable$1, Stream$1);

	function ReadableState(options, stream) {
	  options = options || {};

	  // the point at which it stops calling _read() to fill the buffer
	  // Note: 0 is a valid value, means "don't call _read preemptively ever"
	  var hwm = options.highWaterMark;
	  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

	  // cast to ints.
	  this.highWaterMark = ~~this.highWaterMark;

	  this.buffer = [];
	  this.length = 0;
	  this.pipes = null;
	  this.pipesCount = 0;
	  this.flowing = false;
	  this.ended = false;
	  this.endEmitted = false;
	  this.reading = false;

	  // In streams that never have any data, and do push(null) right away,
	  // the consumer can miss the 'end' event if they do some I/O before
	  // consuming the stream.  So, we don't emit('end') until some reading
	  // happens.
	  this.calledRead = false;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, becuase any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // whenever we return null, then we set a flag to say
	  // that we're awaiting a 'readable' event emission.
	  this.needReadable = false;
	  this.emittedReadable = false;
	  this.readableListening = false;


	  // object stream flag. Used to make read(n) ignore n and to
	  // make all the buffer merging and length checks go away
	  this.objectMode = !!options.objectMode;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // when piping, we only care about 'readable' events that happen
	  // after read()ing all the bytes and not getting any pushback.
	  this.ranOut = false;

	  // the number of writers that are awaiting a drain event in .pipe()s
	  this.awaitDrain = 0;

	  // if true, a maybeReadMore has been scheduled
	  this.readingMore = false;

	  this.decoder = null;
	  this.encoding = null;
	  if (options.encoding) {
	    if (!StringDecoder$1)
	      StringDecoder$1 = string_decoder.StringDecoder;
	    this.decoder = new StringDecoder$1(options.encoding);
	    this.encoding = options.encoding;
	  }
	}

	function Readable$1(options) {
	  if (!(this instanceof Readable$1))
	    return new Readable$1(options);

	  this._readableState = new ReadableState(options, this);

	  // legacy
	  this.readable = true;

	  Stream$1.call(this);
	}

	// Manually shove something into the read() buffer.
	// This returns true if the highWaterMark has not been hit yet,
	// similar to how Writable.write() returns true if you should
	// write() some more.
	Readable$1.prototype.push = function(chunk, encoding) {
	  var state = this._readableState;

	  if (typeof chunk === 'string' && !state.objectMode) {
	    encoding = encoding || state.defaultEncoding;
	    if (encoding !== state.encoding) {
	      chunk = new Buffer$5(chunk, encoding);
	      encoding = '';
	    }
	  }

	  return readableAddChunk(this, state, chunk, encoding, false);
	};

	// Unshift should *always* be something directly out of read()
	Readable$1.prototype.unshift = function(chunk) {
	  var state = this._readableState;
	  return readableAddChunk(this, state, chunk, '', true);
	};

	function readableAddChunk(stream, state, chunk, encoding, addToFront) {
	  var er = chunkInvalid(state, chunk);
	  if (er) {
	    stream.emit('error', er);
	  } else if (chunk === null || chunk === undefined) {
	    state.reading = false;
	    if (!state.ended)
	      onEofChunk(stream, state);
	  } else if (state.objectMode || chunk && chunk.length > 0) {
	    if (state.ended && !addToFront) {
	      var e = new Error('stream.push() after EOF');
	      stream.emit('error', e);
	    } else if (state.endEmitted && addToFront) {
	      var e = new Error('stream.unshift() after end event');
	      stream.emit('error', e);
	    } else {
	      if (state.decoder && !addToFront && !encoding)
	        chunk = state.decoder.write(chunk);

	      // update the buffer info.
	      state.length += state.objectMode ? 1 : chunk.length;
	      if (addToFront) {
	        state.buffer.unshift(chunk);
	      } else {
	        state.reading = false;
	        state.buffer.push(chunk);
	      }

	      if (state.needReadable)
	        emitReadable(stream);

	      maybeReadMore(stream, state);
	    }
	  } else if (!addToFront) {
	    state.reading = false;
	  }

	  return needMoreData(state);
	}



	// if it's past the high water mark, we can push in some more.
	// Also, if we have no data yet, we can stand some
	// more bytes.  This is to work around cases where hwm=0,
	// such as the repl.  Also, if the push() triggered a
	// readable event, and the user called read(largeNumber) such that
	// needReadable was set, then we ought to push more, so that another
	// 'readable' event will be triggered.
	function needMoreData(state) {
	  return !state.ended &&
	         (state.needReadable ||
	          state.length < state.highWaterMark ||
	          state.length === 0);
	}

	// backwards compatibility.
	Readable$1.prototype.setEncoding = function(enc) {
	  if (!StringDecoder$1)
	    StringDecoder$1 = string_decoder.StringDecoder;
	  this._readableState.decoder = new StringDecoder$1(enc);
	  this._readableState.encoding = enc;
	};

	// Don't raise the hwm > 128MB
	var MAX_HWM = 0x800000;
	function roundUpToNextPowerOf2(n) {
	  if (n >= MAX_HWM) {
	    n = MAX_HWM;
	  } else {
	    // Get the next highest power of 2
	    n--;
	    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
	    n++;
	  }
	  return n;
	}

	function howMuchToRead(n, state) {
	  if (state.length === 0 && state.ended)
	    return 0;

	  if (state.objectMode)
	    return n === 0 ? 0 : 1;

	  if (n === null || isNaN(n)) {
	    // only flow one buffer at a time
	    if (state.flowing && state.buffer.length)
	      return state.buffer[0].length;
	    else
	      return state.length;
	  }

	  if (n <= 0)
	    return 0;

	  // If we're asking for more than the target buffer level,
	  // then raise the water mark.  Bump up to the next highest
	  // power of 2, to prevent increasing it excessively in tiny
	  // amounts.
	  if (n > state.highWaterMark)
	    state.highWaterMark = roundUpToNextPowerOf2(n);

	  // don't have that much.  return null, unless we've ended.
	  if (n > state.length) {
	    if (!state.ended) {
	      state.needReadable = true;
	      return 0;
	    } else
	      return state.length;
	  }

	  return n;
	}

	// you can override either this method, or the async _read(n) below.
	Readable$1.prototype.read = function(n) {
	  var state = this._readableState;
	  state.calledRead = true;
	  var nOrig = n;
	  var ret;

	  if (typeof n !== 'number' || n > 0)
	    state.emittedReadable = false;

	  // if we're doing read(0) to trigger a readable event, but we
	  // already have a bunch of data in the buffer, then just trigger
	  // the 'readable' event and move on.
	  if (n === 0 &&
	      state.needReadable &&
	      (state.length >= state.highWaterMark || state.ended)) {
	    emitReadable(this);
	    return null;
	  }

	  n = howMuchToRead(n, state);

	  // if we've ended, and we're now clear, then finish it up.
	  if (n === 0 && state.ended) {
	    ret = null;

	    // In cases where the decoder did not receive enough data
	    // to produce a full chunk, then immediately received an
	    // EOF, state.buffer will contain [<Buffer >, <Buffer 00 ...>].
	    // howMuchToRead will see this and coerce the amount to
	    // read to zero (because it's looking at the length of the
	    // first <Buffer > in state.buffer), and we'll end up here.
	    //
	    // This can only happen via state.decoder -- no other venue
	    // exists for pushing a zero-length chunk into state.buffer
	    // and triggering this behavior. In this case, we return our
	    // remaining data and end the stream, if appropriate.
	    if (state.length > 0 && state.decoder) {
	      ret = fromList(n, state);
	      state.length -= ret.length;
	    }

	    if (state.length === 0)
	      endReadable(this);

	    return ret;
	  }

	  // All the actual chunk generation logic needs to be
	  // *below* the call to _read.  The reason is that in certain
	  // synthetic stream cases, such as passthrough streams, _read
	  // may be a completely synchronous operation which may change
	  // the state of the read buffer, providing enough data when
	  // before there was *not* enough.
	  //
	  // So, the steps are:
	  // 1. Figure out what the state of things will be after we do
	  // a read from the buffer.
	  //
	  // 2. If that resulting state will trigger a _read, then call _read.
	  // Note that this may be asynchronous, or synchronous.  Yes, it is
	  // deeply ugly to write APIs this way, but that still doesn't mean
	  // that the Readable class should behave improperly, as streams are
	  // designed to be sync/async agnostic.
	  // Take note if the _read call is sync or async (ie, if the read call
	  // has returned yet), so that we know whether or not it's safe to emit
	  // 'readable' etc.
	  //
	  // 3. Actually pull the requested chunks out of the buffer and return.

	  // if we need a readable event, then we need to do some reading.
	  var doRead = state.needReadable;

	  // if we currently have less than the highWaterMark, then also read some
	  if (state.length - n <= state.highWaterMark)
	    doRead = true;

	  // however, if we've ended, then there's no point, and if we're already
	  // reading, then it's unnecessary.
	  if (state.ended || state.reading)
	    doRead = false;

	  if (doRead) {
	    state.reading = true;
	    state.sync = true;
	    // if the length is currently zero, then we *need* a readable event.
	    if (state.length === 0)
	      state.needReadable = true;
	    // call internal read method
	    this._read(state.highWaterMark);
	    state.sync = false;
	  }

	  // If _read called its callback synchronously, then `reading`
	  // will be false, and we need to re-evaluate how much data we
	  // can return to the user.
	  if (doRead && !state.reading)
	    n = howMuchToRead(nOrig, state);

	  if (n > 0)
	    ret = fromList(n, state);
	  else
	    ret = null;

	  if (ret === null) {
	    state.needReadable = true;
	    n = 0;
	  }

	  state.length -= n;

	  // If we have nothing in the buffer, then we want to know
	  // as soon as we *do* get something into the buffer.
	  if (state.length === 0 && !state.ended)
	    state.needReadable = true;

	  // If we happened to read() exactly the remaining amount in the
	  // buffer, and the EOF has been seen at this point, then make sure
	  // that we emit 'end' on the very next tick.
	  if (state.ended && !state.endEmitted && state.length === 0)
	    endReadable(this);

	  return ret;
	};

	function chunkInvalid(state, chunk) {
	  var er = null;
	  if (!Buffer$5.isBuffer(chunk) &&
	      'string' !== typeof chunk &&
	      chunk !== null &&
	      chunk !== undefined &&
	      !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  return er;
	}


	function onEofChunk(stream, state) {
	  if (state.decoder && !state.ended) {
	    var chunk = state.decoder.end();
	    if (chunk && chunk.length) {
	      state.buffer.push(chunk);
	      state.length += state.objectMode ? 1 : chunk.length;
	    }
	  }
	  state.ended = true;

	  // if we've ended and we have some data left, then emit
	  // 'readable' now to make sure it gets picked up.
	  if (state.length > 0)
	    emitReadable(stream);
	  else
	    endReadable(stream);
	}

	// Don't emit readable right away in sync mode, because this can trigger
	// another read() call => stack overflow.  This way, it might trigger
	// a nextTick recursion warning, but that's not so bad.
	function emitReadable(stream) {
	  var state = stream._readableState;
	  state.needReadable = false;
	  if (state.emittedReadable)
	    return;

	  state.emittedReadable = true;
	  if (state.sync)
	    nextTick(function() {
	      emitReadable_(stream);
	    });
	  else
	    emitReadable_(stream);
	}

	function emitReadable_(stream) {
	  stream.emit('readable');
	}


	// at this point, the user has presumably seen the 'readable' event,
	// and called read() to consume some data.  that may have triggered
	// in turn another _read(n) call, in which case reading = true if
	// it's in progress.
	// However, if we're not ended, or reading, and the length < hwm,
	// then go ahead and try to read some more preemptively.
	function maybeReadMore(stream, state) {
	  if (!state.readingMore) {
	    state.readingMore = true;
	    nextTick(function() {
	      maybeReadMore_(stream, state);
	    });
	  }
	}

	function maybeReadMore_(stream, state) {
	  var len = state.length;
	  while (!state.reading && !state.flowing && !state.ended &&
	         state.length < state.highWaterMark) {
	    stream.read(0);
	    if (len === state.length)
	      // didn't get any data, stop spinning.
	      break;
	    else
	      len = state.length;
	  }
	  state.readingMore = false;
	}

	// abstract method.  to be overridden in specific implementation classes.
	// call cb(er, data) where data is <= n in length.
	// for virtual (non-string, non-buffer) streams, "length" is somewhat
	// arbitrary, and perhaps not very meaningful.
	Readable$1.prototype._read = function(n) {
	  this.emit('error', new Error('not implemented'));
	};

	Readable$1.prototype.pipe = function(dest, pipeOpts) {
	  var src = this;
	  var state = this._readableState;

	  switch (state.pipesCount) {
	    case 0:
	      state.pipes = dest;
	      break;
	    case 1:
	      state.pipes = [state.pipes, dest];
	      break;
	    default:
	      state.pipes.push(dest);
	      break;
	  }
	  state.pipesCount += 1;

	  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
	              dest !== process.stdout &&
	              dest !== process.stderr;

	  var endFn = doEnd ? onend : cleanup;
	  if (state.endEmitted)
	    nextTick(endFn);
	  else
	    src.once('end', endFn);

	  dest.on('unpipe', onunpipe);
	  function onunpipe(readable) {
	    if (readable !== src) return;
	    cleanup();
	  }

	  function onend() {
	    dest.end();
	  }

	  // when the dest drains, it reduces the awaitDrain counter
	  // on the source.  This would be more elegant with a .once()
	  // handler in flow(), but adding and removing repeatedly is
	  // too slow.
	  var ondrain = pipeOnDrain(src);
	  dest.on('drain', ondrain);

	  function cleanup() {
	    // cleanup event handlers once the pipe is broken
	    dest.removeListener('close', onclose);
	    dest.removeListener('finish', onfinish);
	    dest.removeListener('drain', ondrain);
	    dest.removeListener('error', onerror);
	    dest.removeListener('unpipe', onunpipe);
	    src.removeListener('end', onend);
	    src.removeListener('end', cleanup);

	    // if the reader is waiting for a drain event from this
	    // specific writer, then it would cause it to never start
	    // flowing again.
	    // So, if this is awaiting a drain, then we just call it now.
	    // If we don't know, then assume that we are waiting for one.
	    if (!dest._writableState || dest._writableState.needDrain)
	      ondrain();
	  }

	  // if the dest has an error, then stop piping into it.
	  // however, don't suppress the throwing behavior for this.
	  function onerror(er) {
	    unpipe();
	    dest.removeListener('error', onerror);
	    if (EE.listenerCount(dest, 'error') === 0)
	      dest.emit('error', er);
	  }
	  // This is a brutally ugly hack to make sure that our error handler
	  // is attached before any userland ones.  NEVER DO THIS.
	  if (!dest._events || !dest._events.error)
	    dest.on('error', onerror);
	  else if (isArray(dest._events.error))
	    dest._events.error.unshift(onerror);
	  else
	    dest._events.error = [onerror, dest._events.error];



	  // Both close and finish should trigger unpipe, but only once.
	  function onclose() {
	    dest.removeListener('finish', onfinish);
	    unpipe();
	  }
	  dest.once('close', onclose);
	  function onfinish() {
	    dest.removeListener('close', onclose);
	    unpipe();
	  }
	  dest.once('finish', onfinish);

	  function unpipe() {
	    src.unpipe(dest);
	  }

	  // tell the dest that it's being piped to
	  dest.emit('pipe', src);

	  // start the flow if it hasn't been started already.
	  if (!state.flowing) {
	    // the handler that waits for readable events after all
	    // the data gets sucked out in flow.
	    // This would be easier to follow with a .once() handler
	    // in flow(), but that is too slow.
	    this.on('readable', pipeOnReadable);

	    state.flowing = true;
	    nextTick(function() {
	      flow(src);
	    });
	  }

	  return dest;
	};

	function pipeOnDrain(src) {
	  return function() {
	    var state = src._readableState;
	    state.awaitDrain--;
	    if (state.awaitDrain === 0)
	      flow(src);
	  };
	}

	function flow(src) {
	  var state = src._readableState;
	  var chunk;
	  state.awaitDrain = 0;

	  function write(dest, i, list) {
	    var written = dest.write(chunk);
	    if (false === written) {
	      state.awaitDrain++;
	    }
	  }

	  while (state.pipesCount && null !== (chunk = src.read())) {

	    if (state.pipesCount === 1)
	      write(state.pipes);
	    else
	      forEach$1(state.pipes, write);

	    src.emit('data', chunk);

	    // if anyone needs a drain, then we have to wait for that.
	    if (state.awaitDrain > 0)
	      return;
	  }

	  // if every destination was unpiped, either before entering this
	  // function, or in the while loop, then stop flowing.
	  //
	  // NB: This is a pretty rare edge case.
	  if (state.pipesCount === 0) {
	    state.flowing = false;

	    // if there were data event listeners added, then switch to old mode.
	    if (EE.listenerCount(src, 'data') > 0)
	      emitDataEvents(src);
	    return;
	  }

	  // at this point, no one needed a drain, so we just ran out of data
	  // on the next readable event, start it over again.
	  state.ranOut = true;
	}

	function pipeOnReadable() {
	  if (this._readableState.ranOut) {
	    this._readableState.ranOut = false;
	    flow(this);
	  }
	}


	Readable$1.prototype.unpipe = function(dest) {
	  var state = this._readableState;

	  // if we're not piping anywhere, then do nothing.
	  if (state.pipesCount === 0)
	    return this;

	  // just one destination.  most common case.
	  if (state.pipesCount === 1) {
	    // passed in one, but it's not the right one.
	    if (dest && dest !== state.pipes)
	      return this;

	    if (!dest)
	      dest = state.pipes;

	    // got a match.
	    state.pipes = null;
	    state.pipesCount = 0;
	    this.removeListener('readable', pipeOnReadable);
	    state.flowing = false;
	    if (dest)
	      dest.emit('unpipe', this);
	    return this;
	  }

	  // slow case. multiple pipe destinations.

	  if (!dest) {
	    // remove all.
	    var dests = state.pipes;
	    var len = state.pipesCount;
	    state.pipes = null;
	    state.pipesCount = 0;
	    this.removeListener('readable', pipeOnReadable);
	    state.flowing = false;

	    for (var i = 0; i < len; i++)
	      dests[i].emit('unpipe', this);
	    return this;
	  }

	  // try to find the right one.
	  var i = indexOf(state.pipes, dest);
	  if (i === -1)
	    return this;

	  state.pipes.splice(i, 1);
	  state.pipesCount -= 1;
	  if (state.pipesCount === 1)
	    state.pipes = state.pipes[0];

	  dest.emit('unpipe', this);

	  return this;
	};

	// set up data events if they are asked for
	// Ensure readable listeners eventually get something
	Readable$1.prototype.on = function(ev, fn) {
	  var res = Stream$1.prototype.on.call(this, ev, fn);

	  if (ev === 'data' && !this._readableState.flowing)
	    emitDataEvents(this);

	  if (ev === 'readable' && this.readable) {
	    var state = this._readableState;
	    if (!state.readableListening) {
	      state.readableListening = true;
	      state.emittedReadable = false;
	      state.needReadable = true;
	      if (!state.reading) {
	        this.read(0);
	      } else if (state.length) {
	        emitReadable(this);
	      }
	    }
	  }

	  return res;
	};
	Readable$1.prototype.addListener = Readable$1.prototype.on;

	// pause() and resume() are remnants of the legacy readable stream API
	// If the user uses them, then switch into old mode.
	Readable$1.prototype.resume = function() {
	  emitDataEvents(this);
	  this.read(0);
	  this.emit('resume');
	};

	Readable$1.prototype.pause = function() {
	  emitDataEvents(this, true);
	  this.emit('pause');
	};

	function emitDataEvents(stream, startPaused) {
	  var state = stream._readableState;

	  if (state.flowing) {
	    // https://github.com/isaacs/readable-stream/issues/16
	    throw new Error('Cannot switch to old mode now.');
	  }

	  var paused = startPaused || false;
	  var readable = false;

	  // convert to an old-style stream.
	  stream.readable = true;
	  stream.pipe = Stream$1.prototype.pipe;
	  stream.on = stream.addListener = Stream$1.prototype.on;

	  stream.on('readable', function() {
	    readable = true;

	    var c;
	    while (!paused && (null !== (c = stream.read())))
	      stream.emit('data', c);

	    if (c === null) {
	      readable = false;
	      stream._readableState.needReadable = true;
	    }
	  });

	  stream.pause = function() {
	    paused = true;
	    this.emit('pause');
	  };

	  stream.resume = function() {
	    paused = false;
	    if (readable)
	      nextTick(function() {
	        stream.emit('readable');
	      });
	    else
	      this.read(0);
	    this.emit('resume');
	  };

	  // now make it start, just in case it hadn't already.
	  stream.emit('readable');
	}

	// wrap an old-style stream as the async data source.
	// This is *not* part of the readable stream interface.
	// It is an ugly unfortunate mess of history.
	Readable$1.prototype.wrap = function(stream) {
	  var state = this._readableState;
	  var paused = false;

	  var self = this;
	  stream.on('end', function() {
	    if (state.decoder && !state.ended) {
	      var chunk = state.decoder.end();
	      if (chunk && chunk.length)
	        self.push(chunk);
	    }

	    self.push(null);
	  });

	  stream.on('data', function(chunk) {
	    if (state.decoder)
	      chunk = state.decoder.write(chunk);

	    // don't skip over falsy values in objectMode
	    //if (state.objectMode && util.isNullOrUndefined(chunk))
	    if (state.objectMode && (chunk === null || chunk === undefined))
	      return;
	    else if (!state.objectMode && (!chunk || !chunk.length))
	      return;

	    var ret = self.push(chunk);
	    if (!ret) {
	      paused = true;
	      stream.pause();
	    }
	  });

	  // proxy all the other methods.
	  // important when wrapping filters and duplexes.
	  for (var i in stream) {
	    if (typeof stream[i] === 'function' &&
	        typeof this[i] === 'undefined') {
	      this[i] = function(method) { return function() {
	        return stream[method].apply(stream, arguments);
	      }}(i);
	    }
	  }

	  // proxy certain important events.
	  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
	  forEach$1(events, function(ev) {
	    stream.on(ev, self.emit.bind(self, ev));
	  });

	  // when we try to consume some more bytes, simply unpause the
	  // underlying stream.
	  self._read = function(n) {
	    if (paused) {
	      paused = false;
	      stream.resume();
	    }
	  };

	  return self;
	};



	// exposed for testing purposes only.
	Readable$1._fromList = fromList;

	// Pluck off n bytes from an array of buffers.
	// Length is the combined lengths of all the buffers in the list.
	function fromList(n, state) {
	  var list = state.buffer;
	  var length = state.length;
	  var stringMode = !!state.decoder;
	  var objectMode = !!state.objectMode;
	  var ret;

	  // nothing in the list, definitely empty.
	  if (list.length === 0)
	    return null;

	  if (length === 0)
	    ret = null;
	  else if (objectMode)
	    ret = list.shift();
	  else if (!n || n >= length) {
	    // read it all, truncate the array.
	    if (stringMode)
	      ret = list.join('');
	    else
	      ret = Buffer$5.concat(list, length);
	    list.length = 0;
	  } else {
	    // read just some of it.
	    if (n < list[0].length) {
	      // just take a part of the first list item.
	      // slice is the same for buffers and strings.
	      var buf = list[0];
	      ret = buf.slice(0, n);
	      list[0] = buf.slice(n);
	    } else if (n === list[0].length) {
	      // first list is a perfect match
	      ret = list.shift();
	    } else {
	      // complex case.
	      // we have enough to cover it, but it spans past the first buffer.
	      if (stringMode)
	        ret = '';
	      else
	        ret = new Buffer$5(n);

	      var c = 0;
	      for (var i = 0, l = list.length; i < l && c < n; i++) {
	        var buf = list[0];
	        var cpy = Math.min(n - c, buf.length);

	        if (stringMode)
	          ret += buf.slice(0, cpy);
	        else
	          buf.copy(ret, c, 0, cpy);

	        if (cpy < buf.length)
	          list[0] = buf.slice(cpy);
	        else
	          list.shift();

	        c += cpy;
	      }
	    }
	  }

	  return ret;
	}

	function endReadable(stream) {
	  var state = stream._readableState;

	  // If we get here before consuming all the bytes, then that is a
	  // bug in node.  Should never happen.
	  if (state.length > 0)
	    throw new Error('endReadable called on non-empty stream');

	  if (!state.endEmitted && state.calledRead) {
	    state.ended = true;
	    nextTick(function() {
	      // Check that we didn't get one last unshift.
	      if (!state.endEmitted && state.length === 0) {
	        state.endEmitted = true;
	        stream.readable = false;
	        stream.emit('end');
	      }
	    });
	  }
	}

	function forEach$1 (xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

	function indexOf (xs, x) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    if (xs[i] === x) return i;
	  }
	  return -1;
	}

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// a duplex stream is just a stream that is both readable and writable.
	// Since JS doesn't have multiple prototypal inheritance, this class
	// prototypally inherits from Readable, and then parasitically from
	// Writable.

	var _stream_duplex = Duplex$1;

	/*<replacement>*/
	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) keys.push(key);
	  return keys;
	};
	/*</replacement>*/


	/*<replacement>*/
	var util$3 = util$5;
	util$3.inherits = inherits_browser.exports;
	/*</replacement>*/

	var Readable = _stream_readable;
	var Writable$1 = _stream_writable;

	util$3.inherits(Duplex$1, Readable);

	forEach(objectKeys(Writable$1.prototype), function(method) {
	  if (!Duplex$1.prototype[method])
	    Duplex$1.prototype[method] = Writable$1.prototype[method];
	});

	function Duplex$1(options) {
	  if (!(this instanceof Duplex$1))
	    return new Duplex$1(options);

	  Readable.call(this, options);
	  Writable$1.call(this, options);

	  if (options && options.readable === false)
	    this.readable = false;

	  if (options && options.writable === false)
	    this.writable = false;

	  this.allowHalfOpen = true;
	  if (options && options.allowHalfOpen === false)
	    this.allowHalfOpen = false;

	  this.once('end', onend);
	}

	// the no-half-open enforcer
	function onend() {
	  // if we allow half-open state, or if the writable side ended,
	  // then we're ok.
	  if (this.allowHalfOpen || this._writableState.ended)
	    return;

	  // no more data can be written.
	  // But allow more writes to happen in this tick.
	  nextTick(this.end.bind(this));
	}

	function forEach (xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// A bit simpler than readable streams.
	// Implement an async ._write(chunk, cb), and it'll handle all
	// the drain event emission and buffering.

	var _stream_writable = Writable;

	/*<replacement>*/
	var Buffer$4 = buffer.Buffer;
	/*</replacement>*/

	Writable.WritableState = WritableState;


	/*<replacement>*/
	var util$2 = util$5;
	util$2.inherits = inherits_browser.exports;
	/*</replacement>*/

	var Stream = require$$1;

	util$2.inherits(Writable, Stream);

	function WriteReq(chunk, encoding, cb) {
	  this.chunk = chunk;
	  this.encoding = encoding;
	  this.callback = cb;
	}

	function WritableState(options, stream) {
	  options = options || {};

	  // the point at which write() starts returning false
	  // Note: 0 is a valid value, means that we always return false if
	  // the entire buffer is not flushed immediately on write()
	  var hwm = options.highWaterMark;
	  this.highWaterMark = (hwm || hwm === 0) ? hwm : 16 * 1024;

	  // object stream flag to indicate whether or not this stream
	  // contains buffers or objects.
	  this.objectMode = !!options.objectMode;

	  // cast to ints.
	  this.highWaterMark = ~~this.highWaterMark;

	  this.needDrain = false;
	  // at the start of calling end()
	  this.ending = false;
	  // when end() has been called, and returned
	  this.ended = false;
	  // when 'finish' is emitted
	  this.finished = false;

	  // should we decode strings into buffers before passing to _write?
	  // this is here so that some node-core streams can optimize string
	  // handling at a lower level.
	  var noDecode = options.decodeStrings === false;
	  this.decodeStrings = !noDecode;

	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';

	  // not an actual buffer we keep track of, but a measurement
	  // of how much we're waiting to get pushed to some underlying
	  // socket or file.
	  this.length = 0;

	  // a flag to see when we're in the middle of a write.
	  this.writing = false;

	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, becuase any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;

	  // a flag to know if we're processing previously buffered items, which
	  // may call the _write() callback in the same tick, so that we don't
	  // end up in an overlapped onwrite situation.
	  this.bufferProcessing = false;

	  // the callback that's passed to _write(chunk,cb)
	  this.onwrite = function(er) {
	    onwrite(stream, er);
	  };

	  // the callback that the user supplies to write(chunk,encoding,cb)
	  this.writecb = null;

	  // the amount that is being written when _write is called.
	  this.writelen = 0;

	  this.buffer = [];

	  // True if the error was already emitted and should not be thrown again
	  this.errorEmitted = false;
	}

	function Writable(options) {
	  var Duplex = _stream_duplex;

	  // Writable ctor is applied to Duplexes, though they're not
	  // instanceof Writable, they're instanceof Readable.
	  if (!(this instanceof Writable) && !(this instanceof Duplex))
	    return new Writable(options);

	  this._writableState = new WritableState(options, this);

	  // legacy.
	  this.writable = true;

	  Stream.call(this);
	}

	// Otherwise people can pipe Writable streams, which is just wrong.
	Writable.prototype.pipe = function() {
	  this.emit('error', new Error('Cannot pipe. Not readable.'));
	};


	function writeAfterEnd(stream, state, cb) {
	  var er = new Error('write after end');
	  // TODO: defer error events consistently everywhere, not just the cb
	  stream.emit('error', er);
	  nextTick(function() {
	    cb(er);
	  });
	}

	// If we get something that is not a buffer, string, null, or undefined,
	// and we're not in objectMode, then that's an error.
	// Otherwise stream chunks are all considered to be of length=1, and the
	// watermarks determine how many objects to keep in the buffer, rather than
	// how many bytes or characters.
	function validChunk(stream, state, chunk, cb) {
	  var valid = true;
	  if (!Buffer$4.isBuffer(chunk) &&
	      'string' !== typeof chunk &&
	      chunk !== null &&
	      chunk !== undefined &&
	      !state.objectMode) {
	    var er = new TypeError('Invalid non-string/buffer chunk');
	    stream.emit('error', er);
	    nextTick(function() {
	      cb(er);
	    });
	    valid = false;
	  }
	  return valid;
	}

	Writable.prototype.write = function(chunk, encoding, cb) {
	  var state = this._writableState;
	  var ret = false;

	  if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = null;
	  }

	  if (Buffer$4.isBuffer(chunk))
	    encoding = 'buffer';
	  else if (!encoding)
	    encoding = state.defaultEncoding;

	  if (typeof cb !== 'function')
	    cb = function() {};

	  if (state.ended)
	    writeAfterEnd(this, state, cb);
	  else if (validChunk(this, state, chunk, cb))
	    ret = writeOrBuffer(this, state, chunk, encoding, cb);

	  return ret;
	};

	function decodeChunk(state, chunk, encoding) {
	  if (!state.objectMode &&
	      state.decodeStrings !== false &&
	      typeof chunk === 'string') {
	    chunk = new Buffer$4(chunk, encoding);
	  }
	  return chunk;
	}

	// if we're already writing something, then just put this
	// in the queue, and wait our turn.  Otherwise, call _write
	// If we return false, then we need a drain event, so set that flag.
	function writeOrBuffer(stream, state, chunk, encoding, cb) {
	  chunk = decodeChunk(state, chunk, encoding);
	  if (Buffer$4.isBuffer(chunk))
	    encoding = 'buffer';
	  var len = state.objectMode ? 1 : chunk.length;

	  state.length += len;

	  var ret = state.length < state.highWaterMark;
	  // we must ensure that previous needDrain will not be reset to false.
	  if (!ret)
	    state.needDrain = true;

	  if (state.writing)
	    state.buffer.push(new WriteReq(chunk, encoding, cb));
	  else
	    doWrite(stream, state, len, chunk, encoding, cb);

	  return ret;
	}

	function doWrite(stream, state, len, chunk, encoding, cb) {
	  state.writelen = len;
	  state.writecb = cb;
	  state.writing = true;
	  state.sync = true;
	  stream._write(chunk, encoding, state.onwrite);
	  state.sync = false;
	}

	function onwriteError(stream, state, sync, er, cb) {
	  if (sync)
	    nextTick(function() {
	      cb(er);
	    });
	  else
	    cb(er);

	  stream._writableState.errorEmitted = true;
	  stream.emit('error', er);
	}

	function onwriteStateUpdate(state) {
	  state.writing = false;
	  state.writecb = null;
	  state.length -= state.writelen;
	  state.writelen = 0;
	}

	function onwrite(stream, er) {
	  var state = stream._writableState;
	  var sync = state.sync;
	  var cb = state.writecb;

	  onwriteStateUpdate(state);

	  if (er)
	    onwriteError(stream, state, sync, er, cb);
	  else {
	    // Check if we're actually ready to finish, but don't emit yet
	    var finished = needFinish(stream, state);

	    if (!finished && !state.bufferProcessing && state.buffer.length)
	      clearBuffer(stream, state);

	    if (sync) {
	      nextTick(function() {
	        afterWrite(stream, state, finished, cb);
	      });
	    } else {
	      afterWrite(stream, state, finished, cb);
	    }
	  }
	}

	function afterWrite(stream, state, finished, cb) {
	  if (!finished)
	    onwriteDrain(stream, state);
	  cb();
	  if (finished)
	    finishMaybe(stream, state);
	}

	// Must force callback to be called on nextTick, so that we don't
	// emit 'drain' before the write() consumer gets the 'false' return
	// value, and has a chance to attach a 'drain' listener.
	function onwriteDrain(stream, state) {
	  if (state.length === 0 && state.needDrain) {
	    state.needDrain = false;
	    stream.emit('drain');
	  }
	}


	// if there's something in the buffer waiting, then process it
	function clearBuffer(stream, state) {
	  state.bufferProcessing = true;

	  for (var c = 0; c < state.buffer.length; c++) {
	    var entry = state.buffer[c];
	    var chunk = entry.chunk;
	    var encoding = entry.encoding;
	    var cb = entry.callback;
	    var len = state.objectMode ? 1 : chunk.length;

	    doWrite(stream, state, len, chunk, encoding, cb);

	    // if we didn't call the onwrite immediately, then
	    // it means that we need to wait until it does.
	    // also, that means that the chunk and cb are currently
	    // being processed, so move the buffer counter past them.
	    if (state.writing) {
	      c++;
	      break;
	    }
	  }

	  state.bufferProcessing = false;
	  if (c < state.buffer.length)
	    state.buffer = state.buffer.slice(c);
	  else
	    state.buffer.length = 0;
	}

	Writable.prototype._write = function(chunk, encoding, cb) {
	  cb(new Error('not implemented'));
	};

	Writable.prototype.end = function(chunk, encoding, cb) {
	  var state = this._writableState;

	  if (typeof chunk === 'function') {
	    cb = chunk;
	    chunk = null;
	    encoding = null;
	  } else if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = null;
	  }

	  if (typeof chunk !== 'undefined' && chunk !== null)
	    this.write(chunk, encoding);

	  // ignore unnecessary end() calls.
	  if (!state.ending && !state.finished)
	    endWritable(this, state, cb);
	};


	function needFinish(stream, state) {
	  return (state.ending &&
	          state.length === 0 &&
	          !state.finished &&
	          !state.writing);
	}

	function finishMaybe(stream, state) {
	  var need = needFinish(stream, state);
	  if (need) {
	    state.finished = true;
	    stream.emit('finish');
	  }
	  return need;
	}

	function endWritable(stream, state, cb) {
	  state.ending = true;
	  finishMaybe(stream, state);
	  if (cb) {
	    if (state.finished)
	      nextTick(cb);
	    else
	      stream.once('finish', cb);
	  }
	  state.ended = true;
	}

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.


	// a transform stream is a readable/writable stream where you do
	// something with the data.  Sometimes it's called a "filter",
	// but that's not a great name for it, since that implies a thing where
	// some bits pass through, and others are simply ignored.  (That would
	// be a valid example of a transform, of course.)
	//
	// While the output is causally related to the input, it's not a
	// necessarily symmetric or synchronous transformation.  For example,
	// a zlib stream might take multiple plain-text writes(), and then
	// emit a single compressed chunk some time in the future.
	//
	// Here's how this works:
	//
	// The Transform stream has all the aspects of the readable and writable
	// stream classes.  When you write(chunk), that calls _write(chunk,cb)
	// internally, and returns false if there's a lot of pending writes
	// buffered up.  When you call read(), that calls _read(n) until
	// there's enough pending readable data buffered up.
	//
	// In a transform stream, the written data is placed in a buffer.  When
	// _read(n) is called, it transforms the queued up data, calling the
	// buffered _write cb's as it consumes chunks.  If consuming a single
	// written chunk would result in multiple output chunks, then the first
	// outputted bit calls the readcb, and subsequent chunks just go into
	// the read buffer, and will cause it to emit 'readable' if necessary.
	//
	// This way, back-pressure is actually determined by the reading side,
	// since _read has to be called to start processing a new chunk.  However,
	// a pathological inflate type of transform can cause excessive buffering
	// here.  For example, imagine a stream where every byte of input is
	// interpreted as an integer from 0-255, and then results in that many
	// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
	// 1kb of data being output.  In this case, you could write a very small
	// amount of input, and end up with a very large amount of output.  In
	// such a pathological inflating mechanism, there'd be no way to tell
	// the system to stop doing the transform.  A single 4MB write could
	// cause the system to run out of memory.
	//
	// However, even in such a pathological case, only a single written chunk
	// would be consumed, and then the rest would wait (un-transformed) until
	// the results of the previous transformed chunk were consumed.

	var _stream_transform = Transform$3;

	var Duplex = _stream_duplex;

	/*<replacement>*/
	var util$1 = util$5;
	util$1.inherits = inherits_browser.exports;
	/*</replacement>*/

	util$1.inherits(Transform$3, Duplex);


	function TransformState(options, stream) {
	  this.afterTransform = function(er, data) {
	    return afterTransform(stream, er, data);
	  };

	  this.needTransform = false;
	  this.transforming = false;
	  this.writecb = null;
	  this.writechunk = null;
	}

	function afterTransform(stream, er, data) {
	  var ts = stream._transformState;
	  ts.transforming = false;

	  var cb = ts.writecb;

	  if (!cb)
	    return stream.emit('error', new Error('no writecb in Transform class'));

	  ts.writechunk = null;
	  ts.writecb = null;

	  if (data !== null && data !== undefined)
	    stream.push(data);

	  if (cb)
	    cb(er);

	  var rs = stream._readableState;
	  rs.reading = false;
	  if (rs.needReadable || rs.length < rs.highWaterMark) {
	    stream._read(rs.highWaterMark);
	  }
	}


	function Transform$3(options) {
	  if (!(this instanceof Transform$3))
	    return new Transform$3(options);

	  Duplex.call(this, options);

	  this._transformState = new TransformState(options, this);

	  // when the writable side finishes, then flush out anything remaining.
	  var stream = this;

	  // start out asking for a readable event once data is transformed.
	  this._readableState.needReadable = true;

	  // we have implemented the _read method, and done the other things
	  // that Readable wants before the first _read call, so unset the
	  // sync guard flag.
	  this._readableState.sync = false;

	  this.once('finish', function() {
	    if ('function' === typeof this._flush)
	      this._flush(function(er) {
	        done(stream, er);
	      });
	    else
	      done(stream);
	  });
	}

	Transform$3.prototype.push = function(chunk, encoding) {
	  this._transformState.needTransform = false;
	  return Duplex.prototype.push.call(this, chunk, encoding);
	};

	// This is the part where you do stuff!
	// override this function in implementation classes.
	// 'chunk' is an input chunk.
	//
	// Call `push(newChunk)` to pass along transformed output
	// to the readable side.  You may call 'push' zero or more times.
	//
	// Call `cb(err)` when you are done with this chunk.  If you pass
	// an error, then that'll put the hurt on the whole operation.  If you
	// never call cb(), then you'll never get another chunk.
	Transform$3.prototype._transform = function(chunk, encoding, cb) {
	  throw new Error('not implemented');
	};

	Transform$3.prototype._write = function(chunk, encoding, cb) {
	  var ts = this._transformState;
	  ts.writecb = cb;
	  ts.writechunk = chunk;
	  ts.writeencoding = encoding;
	  if (!ts.transforming) {
	    var rs = this._readableState;
	    if (ts.needTransform ||
	        rs.needReadable ||
	        rs.length < rs.highWaterMark)
	      this._read(rs.highWaterMark);
	  }
	};

	// Doesn't matter what the args are here.
	// _transform does all the work.
	// That we got here means that the readable side wants more data.
	Transform$3.prototype._read = function(n) {
	  var ts = this._transformState;

	  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
	    ts.transforming = true;
	    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
	  } else {
	    // mark that we need a transform, so that any data that comes in
	    // will get processed, now that we've asked for it.
	    ts.needTransform = true;
	  }
	};


	function done(stream, er) {
	  if (er)
	    return stream.emit('error', er);

	  // if there's nothing in the write buffer, then that means
	  // that nothing more will ever be provided
	  var ws = stream._writableState;
	  stream._readableState;
	  var ts = stream._transformState;

	  if (ws.length)
	    throw new Error('calling transform done when ws.length != 0');

	  if (ts.transforming)
	    throw new Error('calling transform done when still transforming');

	  return stream.push(null);
	}

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	// a passthrough stream.
	// basically just the most minimal sort of Transform stream.
	// Every written chunk gets output as-is.

	var _stream_passthrough = PassThrough;

	var Transform$2 = _stream_transform;

	/*<replacement>*/
	var util = util$5;
	util.inherits = inherits_browser.exports;
	/*</replacement>*/

	util.inherits(PassThrough, Transform$2);

	function PassThrough(options) {
	  if (!(this instanceof PassThrough))
	    return new PassThrough(options);

	  Transform$2.call(this, options);
	}

	PassThrough.prototype._transform = function(chunk, encoding, cb) {
	  cb(null, chunk);
	};

	(function (module, exports) {
	var Stream = require$$1; // hack to fix a circular dependency issue when used with browserify
	exports = module.exports = _stream_readable;
	exports.Stream = Stream;
	exports.Readable = exports;
	exports.Writable = _stream_writable;
	exports.Duplex = _stream_duplex;
	exports.Transform = _stream_transform;
	exports.PassThrough = _stream_passthrough;
	}(readable, readable.exports));

	var Buffer$3 = safeBuffer.exports.Buffer;
	var Transform$1 = readable.exports.Transform;
	var inherits$4 = inherits_browser.exports;

	function throwIfNotStringOrBuffer (val, prefix) {
	  if (!Buffer$3.isBuffer(val) && typeof val !== 'string') {
	    throw new TypeError(prefix + ' must be a string or a buffer')
	  }
	}

	function HashBase$2 (blockSize) {
	  Transform$1.call(this);

	  this._block = Buffer$3.allocUnsafe(blockSize);
	  this._blockSize = blockSize;
	  this._blockOffset = 0;
	  this._length = [0, 0, 0, 0];

	  this._finalized = false;
	}

	inherits$4(HashBase$2, Transform$1);

	HashBase$2.prototype._transform = function (chunk, encoding, callback) {
	  var error = null;
	  try {
	    this.update(chunk, encoding);
	  } catch (err) {
	    error = err;
	  }

	  callback(error);
	};

	HashBase$2.prototype._flush = function (callback) {
	  var error = null;
	  try {
	    this.push(this.digest());
	  } catch (err) {
	    error = err;
	  }

	  callback(error);
	};

	HashBase$2.prototype.update = function (data, encoding) {
	  throwIfNotStringOrBuffer(data, 'Data');
	  if (this._finalized) throw new Error('Digest already called')
	  if (!Buffer$3.isBuffer(data)) data = Buffer$3.from(data, encoding);

	  // consume data
	  var block = this._block;
	  var offset = 0;
	  while (this._blockOffset + data.length - offset >= this._blockSize) {
	    for (var i = this._blockOffset; i < this._blockSize;) block[i++] = data[offset++];
	    this._update();
	    this._blockOffset = 0;
	  }
	  while (offset < data.length) block[this._blockOffset++] = data[offset++];

	  // update length
	  for (var j = 0, carry = data.length * 8; carry > 0; ++j) {
	    this._length[j] += carry;
	    carry = (this._length[j] / 0x0100000000) | 0;
	    if (carry > 0) this._length[j] -= 0x0100000000 * carry;
	  }

	  return this
	};

	HashBase$2.prototype._update = function () {
	  throw new Error('_update is not implemented')
	};

	HashBase$2.prototype.digest = function (encoding) {
	  if (this._finalized) throw new Error('Digest already called')
	  this._finalized = true;

	  var digest = this._digest();
	  if (encoding !== undefined) digest = digest.toString(encoding);

	  // reset state
	  this._block.fill(0);
	  this._blockOffset = 0;
	  for (var i = 0; i < 4; ++i) this._length[i] = 0;

	  return digest
	};

	HashBase$2.prototype._digest = function () {
	  throw new Error('_digest is not implemented')
	};

	var hashBase = HashBase$2;

	var Buffer$2 = buffer.Buffer;
	var inherits$3 = inherits_browser.exports;
	var HashBase$1 = hashBase;

	var ARRAY16$1 = new Array(16);

	var zl = [
	  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
	  7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8,
	  3, 10, 14, 4, 9, 15, 8, 1, 2, 7, 0, 6, 13, 11, 5, 12,
	  1, 9, 11, 10, 0, 8, 12, 4, 13, 3, 7, 15, 14, 5, 6, 2,
	  4, 0, 5, 9, 7, 12, 2, 10, 14, 1, 3, 8, 11, 6, 15, 13
	];

	var zr = [
	  5, 14, 7, 0, 9, 2, 11, 4, 13, 6, 15, 8, 1, 10, 3, 12,
	  6, 11, 3, 7, 0, 13, 5, 10, 14, 15, 8, 12, 4, 9, 1, 2,
	  15, 5, 1, 3, 7, 14, 6, 9, 11, 8, 12, 2, 10, 0, 4, 13,
	  8, 6, 4, 1, 3, 11, 15, 0, 5, 12, 2, 13, 9, 7, 10, 14,
	  12, 15, 10, 4, 1, 5, 8, 7, 6, 2, 13, 14, 0, 3, 9, 11
	];

	var sl = [
	  11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8,
	  7, 6, 8, 13, 11, 9, 7, 15, 7, 12, 15, 9, 11, 7, 13, 12,
	  11, 13, 6, 7, 14, 9, 13, 15, 14, 8, 13, 6, 5, 12, 7, 5,
	  11, 12, 14, 15, 14, 15, 9, 8, 9, 14, 5, 6, 8, 6, 5, 12,
	  9, 15, 5, 11, 6, 8, 13, 12, 5, 12, 13, 14, 11, 8, 5, 6
	];

	var sr = [
	  8, 9, 9, 11, 13, 15, 15, 5, 7, 7, 8, 11, 14, 14, 12, 6,
	  9, 13, 15, 7, 12, 8, 9, 11, 7, 7, 12, 7, 6, 15, 13, 11,
	  9, 7, 15, 11, 8, 6, 6, 14, 12, 13, 5, 14, 13, 13, 7, 5,
	  15, 5, 8, 11, 14, 14, 6, 14, 6, 9, 12, 9, 12, 5, 15, 8,
	  8, 5, 12, 9, 12, 5, 14, 6, 8, 13, 6, 5, 15, 13, 11, 11
	];

	var hl = [0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e];
	var hr = [0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000];

	function RIPEMD160$1 () {
	  HashBase$1.call(this, 64);

	  // state
	  this._a = 0x67452301;
	  this._b = 0xefcdab89;
	  this._c = 0x98badcfe;
	  this._d = 0x10325476;
	  this._e = 0xc3d2e1f0;
	}

	inherits$3(RIPEMD160$1, HashBase$1);

	RIPEMD160$1.prototype._update = function () {
	  var words = ARRAY16$1;
	  for (var j = 0; j < 16; ++j) words[j] = this._block.readInt32LE(j * 4);

	  var al = this._a | 0;
	  var bl = this._b | 0;
	  var cl = this._c | 0;
	  var dl = this._d | 0;
	  var el = this._e | 0;

	  var ar = this._a | 0;
	  var br = this._b | 0;
	  var cr = this._c | 0;
	  var dr = this._d | 0;
	  var er = this._e | 0;

	  // computation
	  for (var i = 0; i < 80; i += 1) {
	    var tl;
	    var tr;
	    if (i < 16) {
	      tl = fn1(al, bl, cl, dl, el, words[zl[i]], hl[0], sl[i]);
	      tr = fn5(ar, br, cr, dr, er, words[zr[i]], hr[0], sr[i]);
	    } else if (i < 32) {
	      tl = fn2(al, bl, cl, dl, el, words[zl[i]], hl[1], sl[i]);
	      tr = fn4(ar, br, cr, dr, er, words[zr[i]], hr[1], sr[i]);
	    } else if (i < 48) {
	      tl = fn3(al, bl, cl, dl, el, words[zl[i]], hl[2], sl[i]);
	      tr = fn3(ar, br, cr, dr, er, words[zr[i]], hr[2], sr[i]);
	    } else if (i < 64) {
	      tl = fn4(al, bl, cl, dl, el, words[zl[i]], hl[3], sl[i]);
	      tr = fn2(ar, br, cr, dr, er, words[zr[i]], hr[3], sr[i]);
	    } else { // if (i<80) {
	      tl = fn5(al, bl, cl, dl, el, words[zl[i]], hl[4], sl[i]);
	      tr = fn1(ar, br, cr, dr, er, words[zr[i]], hr[4], sr[i]);
	    }

	    al = el;
	    el = dl;
	    dl = rotl$1(cl, 10);
	    cl = bl;
	    bl = tl;

	    ar = er;
	    er = dr;
	    dr = rotl$1(cr, 10);
	    cr = br;
	    br = tr;
	  }

	  // update state
	  var t = (this._b + cl + dr) | 0;
	  this._b = (this._c + dl + er) | 0;
	  this._c = (this._d + el + ar) | 0;
	  this._d = (this._e + al + br) | 0;
	  this._e = (this._a + bl + cr) | 0;
	  this._a = t;
	};

	RIPEMD160$1.prototype._digest = function () {
	  // create padding and handle blocks
	  this._block[this._blockOffset++] = 0x80;
	  if (this._blockOffset > 56) {
	    this._block.fill(0, this._blockOffset, 64);
	    this._update();
	    this._blockOffset = 0;
	  }

	  this._block.fill(0, this._blockOffset, 56);
	  this._block.writeUInt32LE(this._length[0], 56);
	  this._block.writeUInt32LE(this._length[1], 60);
	  this._update();

	  // produce result
	  var buffer = Buffer$2.alloc ? Buffer$2.alloc(20) : new Buffer$2(20);
	  buffer.writeInt32LE(this._a, 0);
	  buffer.writeInt32LE(this._b, 4);
	  buffer.writeInt32LE(this._c, 8);
	  buffer.writeInt32LE(this._d, 12);
	  buffer.writeInt32LE(this._e, 16);
	  return buffer
	};

	function rotl$1 (x, n) {
	  return (x << n) | (x >>> (32 - n))
	}

	function fn1 (a, b, c, d, e, m, k, s) {
	  return (rotl$1((a + (b ^ c ^ d) + m + k) | 0, s) + e) | 0
	}

	function fn2 (a, b, c, d, e, m, k, s) {
	  return (rotl$1((a + ((b & c) | ((~b) & d)) + m + k) | 0, s) + e) | 0
	}

	function fn3 (a, b, c, d, e, m, k, s) {
	  return (rotl$1((a + ((b | (~c)) ^ d) + m + k) | 0, s) + e) | 0
	}

	function fn4 (a, b, c, d, e, m, k, s) {
	  return (rotl$1((a + ((b & d) | (c & (~d))) + m + k) | 0, s) + e) | 0
	}

	function fn5 (a, b, c, d, e, m, k, s) {
	  return (rotl$1((a + (b ^ (c | (~d))) + m + k) | 0, s) + e) | 0
	}

	var ripemd160 = RIPEMD160$1;

	function hashPublicKey(buffer) {
	    return new ripemd160().update(sha$1("sha256").update(buffer).digest()).digest();
	}

	var __awaiter$7 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator$7 = (undefined && undefined.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	var __values$4 = (undefined && undefined.__values) || function(o) {
	    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	    if (m) return m.call(o);
	    if (o && typeof o.length === "number") return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	function startUntrustedHashTransactionInputRaw(transport, newTransaction, firstRound, transactionData, bip143, overwinter, additionals) {
	    if (bip143 === void 0) { bip143 = false; }
	    if (overwinter === void 0) { overwinter = false; }
	    if (additionals === void 0) { additionals = []; }
	    var p2 = additionals.includes("cashaddr")
	        ? 0x03
	        : bip143
	            ? additionals.includes("sapling")
	                ? 0x05
	                : overwinter
	                    ? 0x04
	                    : 0x02
	            : 0x00;
	    return transport.send(0xe0, 0x44, firstRound ? 0x00 : 0x80, newTransaction ? p2 : 0x80, transactionData);
	}
	function startUntrustedHashTransactionInput(transport, newTransaction, transaction, inputs, bip143, overwinter, additionals, useTrustedInputForSegwit) {
	    if (bip143 === void 0) { bip143 = false; }
	    if (overwinter === void 0) { overwinter = false; }
	    if (additionals === void 0) { additionals = []; }
	    if (useTrustedInputForSegwit === void 0) { useTrustedInputForSegwit = false; }
	    return __awaiter$7(this, void 0, void 0, function () {
	        var data, i, isDecred, _a, _b, input, prefix, inputValue, scriptBlocks, offset, blockSize, scriptBlocks_1, scriptBlocks_1_1, scriptBlock, e_1_1, e_2_1;
	        var e_2, _c, e_1, _d;
	        return __generator$7(this, function (_e) {
	            switch (_e.label) {
	                case 0:
	                    data = Buffer$e.concat([
	                        transaction.version,
	                        transaction.timestamp || Buffer$e.alloc(0),
	                        transaction.nVersionGroupId || Buffer$e.alloc(0),
	                        createVarint(transaction.inputs.length),
	                    ]);
	                    return [4 /*yield*/, startUntrustedHashTransactionInputRaw(transport, newTransaction, true, data, bip143, overwinter, additionals)];
	                case 1:
	                    _e.sent();
	                    i = 0;
	                    isDecred = additionals.includes("decred");
	                    _e.label = 2;
	                case 2:
	                    _e.trys.push([2, 15, 16, 17]);
	                    _a = __values$4(transaction.inputs), _b = _a.next();
	                    _e.label = 3;
	                case 3:
	                    if (!!_b.done) return [3 /*break*/, 14];
	                    input = _b.value;
	                    prefix = void 0;
	                    inputValue = inputs[i].value;
	                    if (bip143) {
	                        if (useTrustedInputForSegwit && inputs[i].trustedInput) {
	                            prefix = Buffer$e.from([0x01, inputValue.length]);
	                        }
	                        else {
	                            prefix = Buffer$e.from([0x02]);
	                        }
	                    }
	                    else {
	                        if (inputs[i].trustedInput) {
	                            prefix = Buffer$e.from([0x01, inputs[i].value.length]);
	                        }
	                        else {
	                            prefix = Buffer$e.from([0x00]);
	                        }
	                    }
	                    data = Buffer$e.concat([
	                        prefix,
	                        inputValue,
	                        isDecred ? Buffer$e.from([0x00]) : Buffer$e.alloc(0),
	                        createVarint(input.script.length),
	                    ]);
	                    return [4 /*yield*/, startUntrustedHashTransactionInputRaw(transport, newTransaction, false, data, bip143, overwinter, additionals)];
	                case 4:
	                    _e.sent();
	                    scriptBlocks = [];
	                    offset = 0;
	                    if (input.script.length === 0) {
	                        scriptBlocks.push(input.sequence);
	                    }
	                    else {
	                        while (offset !== input.script.length) {
	                            blockSize = input.script.length - offset > MAX_SCRIPT_BLOCK
	                                ? MAX_SCRIPT_BLOCK
	                                : input.script.length - offset;
	                            if (offset + blockSize !== input.script.length) {
	                                scriptBlocks.push(input.script.slice(offset, offset + blockSize));
	                            }
	                            else {
	                                scriptBlocks.push(Buffer$e.concat([
	                                    input.script.slice(offset, offset + blockSize),
	                                    input.sequence,
	                                ]));
	                            }
	                            offset += blockSize;
	                        }
	                    }
	                    _e.label = 5;
	                case 5:
	                    _e.trys.push([5, 10, 11, 12]);
	                    scriptBlocks_1 = (e_1 = void 0, __values$4(scriptBlocks)), scriptBlocks_1_1 = scriptBlocks_1.next();
	                    _e.label = 6;
	                case 6:
	                    if (!!scriptBlocks_1_1.done) return [3 /*break*/, 9];
	                    scriptBlock = scriptBlocks_1_1.value;
	                    return [4 /*yield*/, startUntrustedHashTransactionInputRaw(transport, newTransaction, false, scriptBlock, bip143, overwinter, additionals)];
	                case 7:
	                    _e.sent();
	                    _e.label = 8;
	                case 8:
	                    scriptBlocks_1_1 = scriptBlocks_1.next();
	                    return [3 /*break*/, 6];
	                case 9: return [3 /*break*/, 12];
	                case 10:
	                    e_1_1 = _e.sent();
	                    e_1 = { error: e_1_1 };
	                    return [3 /*break*/, 12];
	                case 11:
	                    try {
	                        if (scriptBlocks_1_1 && !scriptBlocks_1_1.done && (_d = scriptBlocks_1["return"])) _d.call(scriptBlocks_1);
	                    }
	                    finally { if (e_1) throw e_1.error; }
	                    return [7 /*endfinally*/];
	                case 12:
	                    i++;
	                    _e.label = 13;
	                case 13:
	                    _b = _a.next();
	                    return [3 /*break*/, 3];
	                case 14: return [3 /*break*/, 17];
	                case 15:
	                    e_2_1 = _e.sent();
	                    e_2 = { error: e_2_1 };
	                    return [3 /*break*/, 17];
	                case 16:
	                    try {
	                        if (_b && !_b.done && (_c = _a["return"])) _c.call(_a);
	                    }
	                    finally { if (e_2) throw e_2.error; }
	                    return [7 /*endfinally*/];
	                case 17: return [2 /*return*/];
	            }
	        });
	    });
	}

	function compressPublicKey(publicKey) {
	    var prefix = (publicKey[64] & 1) !== 0 ? 0x03 : 0x02;
	    var prefixBuffer = Buffer$e.alloc(1);
	    prefixBuffer[0] = prefix;
	    return Buffer$e.concat([prefixBuffer, publicKey.slice(1, 1 + 32)]);
	}

	function signTransaction(transport, path, lockTime, sigHashType, expiryHeight, additionals) {
	    if (additionals === void 0) { additionals = []; }
	    var isDecred = additionals.includes("decred");
	    var pathsBuffer = bip32asBuffer(path);
	    var lockTimeBuffer = Buffer$e.alloc(4);
	    lockTimeBuffer.writeUInt32BE(lockTime, 0);
	    var buffer = isDecred
	        ? Buffer$e.concat([
	            pathsBuffer,
	            lockTimeBuffer,
	            expiryHeight || Buffer$e.from([0x00, 0x00, 0x00, 0x00]),
	            Buffer$e.from([sigHashType]),
	        ])
	        : Buffer$e.concat([
	            pathsBuffer,
	            Buffer$e.from([0x00]),
	            lockTimeBuffer,
	            Buffer$e.from([sigHashType]),
	        ]);
	    if (expiryHeight && !isDecred) {
	        buffer = Buffer$e.concat([buffer, expiryHeight]);
	    }
	    return transport.send(0xe0, 0x48, 0x00, 0x00, buffer).then(function (result) {
	        if (result.length > 0) {
	            result[0] = 0x30;
	            return result.slice(0, result.length - 2);
	        }
	        return result;
	    });
	}

	var __awaiter$6 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator$6 = (undefined && undefined.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	function provideOutputFullChangePath(transport, path) {
	    var buffer = bip32asBuffer(path);
	    return transport.send(0xe0, 0x4a, 0xff, 0x00, buffer);
	}
	function hashOutputFull(transport, outputScript, additionals) {
	    if (additionals === void 0) { additionals = []; }
	    return __awaiter$6(this, void 0, void 0, function () {
	        var offset, p1, isDecred, blockSize, p1_1, data;
	        return __generator$6(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    offset = 0;
	                    p1 = Number(0x80);
	                    isDecred = additionals.includes("decred");
	                    ///WARNING: Decred works only with one call (without chunking)
	                    //TODO: test without this for Decred
	                    if (isDecred) {
	                        return [2 /*return*/, transport.send(0xe0, 0x4a, p1, 0x00, outputScript)];
	                    }
	                    _a.label = 1;
	                case 1:
	                    if (!(offset < outputScript.length)) return [3 /*break*/, 3];
	                    blockSize = offset + MAX_SCRIPT_BLOCK >= outputScript.length
	                        ? outputScript.length - offset
	                        : MAX_SCRIPT_BLOCK;
	                    p1_1 = offset + blockSize === outputScript.length ? 0x80 : 0x00;
	                    data = outputScript.slice(offset, offset + blockSize);
	                    return [4 /*yield*/, transport.send(0xe0, 0x4a, p1_1, 0x00, data)];
	                case 2:
	                    _a.sent();
	                    offset += blockSize;
	                    return [3 /*break*/, 1];
	                case 3: return [2 /*return*/];
	            }
	        });
	    });
	}

	var __awaiter$5 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator$5 = (undefined && undefined.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	var getAppAndVersion = function (transport) { return __awaiter$5(void 0, void 0, void 0, function () {
	    var r, i, format, nameLength, name, versionLength, version, flagLength, flags;
	    return __generator$5(this, function (_a) {
	        switch (_a.label) {
	            case 0: return [4 /*yield*/, transport.send(0xb0, 0x01, 0x00, 0x00)];
	            case 1:
	                r = _a.sent();
	                i = 0;
	                format = r[i++];
	                browser$2(format === 1, "getAppAndVersion: format not supported");
	                nameLength = r[i++];
	                name = r.slice(i, (i += nameLength)).toString("ascii");
	                versionLength = r[i++];
	                version = r.slice(i, (i += versionLength)).toString("ascii");
	                flagLength = r[i++];
	                flags = r.slice(i, (i += flagLength));
	                return [2 /*return*/, {
	                        name: name,
	                        version: version,
	                        flags: flags
	                    }];
	        }
	    });
	}); };

	var re$5 = {exports: {}};

	// Note: this is the semver.org version of the spec that it implements
	// Not necessarily the package version of this code.
	const SEMVER_SPEC_VERSION = '2.0.0';

	const MAX_LENGTH$2 = 256;
	const MAX_SAFE_INTEGER$1 = Number.MAX_SAFE_INTEGER ||
	  /* istanbul ignore next */ 9007199254740991;

	// Max safe segment length for coercion.
	const MAX_SAFE_COMPONENT_LENGTH = 16;

	var constants = {
	  SEMVER_SPEC_VERSION,
	  MAX_LENGTH: MAX_LENGTH$2,
	  MAX_SAFE_INTEGER: MAX_SAFE_INTEGER$1,
	  MAX_SAFE_COMPONENT_LENGTH
	};

	const debug$3 = (
	  typeof process === 'object' &&
	  process.env &&
	  process.env.NODE_DEBUG &&
	  /\bsemver\b/i.test(process.env.NODE_DEBUG)
	) ? (...args) => console.error('SEMVER', ...args)
	  : () => {};

	var debug_1 = debug$3;

	(function (module, exports) {
	const { MAX_SAFE_COMPONENT_LENGTH } = constants;
	const debug = debug_1;
	exports = module.exports = {};

	// The actual regexps go on exports.re
	const re = exports.re = [];
	const src = exports.src = [];
	const t = exports.t = {};
	let R = 0;

	const createToken = (name, value, isGlobal) => {
	  const index = R++;
	  debug(index, value);
	  t[name] = index;
	  src[index] = value;
	  re[index] = new RegExp(value, isGlobal ? 'g' : undefined);
	};

	// The following Regular Expressions can be used for tokenizing,
	// validating, and parsing SemVer version strings.

	// ## Numeric Identifier
	// A single `0`, or a non-zero digit followed by zero or more digits.

	createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*');
	createToken('NUMERICIDENTIFIERLOOSE', '[0-9]+');

	// ## Non-numeric Identifier
	// Zero or more digits, followed by a letter or hyphen, and then zero or
	// more letters, digits, or hyphens.

	createToken('NONNUMERICIDENTIFIER', '\\d*[a-zA-Z-][a-zA-Z0-9-]*');

	// ## Main Version
	// Three dot-separated numeric identifiers.

	createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` +
	                   `(${src[t.NUMERICIDENTIFIER]})\\.` +
	                   `(${src[t.NUMERICIDENTIFIER]})`);

	createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
	                        `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` +
	                        `(${src[t.NUMERICIDENTIFIERLOOSE]})`);

	// ## Pre-release Version Identifier
	// A numeric identifier, or a non-numeric identifier.

	createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]
}|${src[t.NONNUMERICIDENTIFIER]})`);

	createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]
}|${src[t.NONNUMERICIDENTIFIER]})`);

	// ## Pre-release Version
	// Hyphen, followed by one or more dot-separated pre-release version
	// identifiers.

	createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]
}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);

	createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]
}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);

	// ## Build Metadata Identifier
	// Any combination of digits, letters, or hyphens.

	createToken('BUILDIDENTIFIER', '[0-9A-Za-z-]+');

	// ## Build Metadata
	// Plus sign, followed by one or more period-separated build metadata
	// identifiers.

	createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]
}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);

	// ## Full Version String
	// A main version, followed optionally by a pre-release version and
	// build metadata.

	// Note that the only major, minor, patch, and pre-release sections of
	// the version string are capturing groups.  The build metadata is not a
	// capturing group, because it should not ever be used in version
	// comparison.

	createToken('FULLPLAIN', `v?${src[t.MAINVERSION]
}${src[t.PRERELEASE]}?${
  src[t.BUILD]}?`);

	createToken('FULL', `^${src[t.FULLPLAIN]}$`);

	// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
	// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
	// common in the npm registry.
	createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]
}${src[t.PRERELEASELOOSE]}?${
  src[t.BUILD]}?`);

	createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`);

	createToken('GTLT', '((?:<|>)?=?)');

	// Something like "2.*" or "1.2.x".
	// Note that "x.x" is a valid xRange identifer, meaning "any version"
	// Only the first item is strictly required.
	createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
	createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);

	createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` +
	                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
	                   `(?:\\.(${src[t.XRANGEIDENTIFIER]})` +
	                   `(?:${src[t.PRERELEASE]})?${
                     src[t.BUILD]}?` +
	                   `)?)?`);

	createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` +
	                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
	                        `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` +
	                        `(?:${src[t.PRERELEASELOOSE]})?${
                          src[t.BUILD]}?` +
	                        `)?)?`);

	createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
	createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);

	// Coercion.
	// Extract anything that could conceivably be a part of a valid semver
	createToken('COERCE', `${'(^|[^\\d])' +
              '(\\d{1,'}${MAX_SAFE_COMPONENT_LENGTH}})` +
	              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
	              `(?:\\.(\\d{1,${MAX_SAFE_COMPONENT_LENGTH}}))?` +
	              `(?:$|[^\\d])`);
	createToken('COERCERTL', src[t.COERCE], true);

	// Tilde ranges.
	// Meaning is "reasonably at or greater than"
	createToken('LONETILDE', '(?:~>?)');

	createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true);
	exports.tildeTrimReplace = '$1~';

	createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
	createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);

	// Caret ranges.
	// Meaning is "at least and backwards compatible with"
	createToken('LONECARET', '(?:\\^)');

	createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true);
	exports.caretTrimReplace = '$1^';

	createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
	createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);

	// A simple gt/lt/eq thing, or just "" to indicate "any version"
	createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
	createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);

	// An expression to strip any whitespace between the gtlt and the thing
	// it modifies, so that `> 1.2.3` ==> `>1.2.3`
	createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]
}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
	exports.comparatorTrimReplace = '$1$2$3';

	// Something like `1.2.3 - 1.2.4`
	// Note that these all use the loose form, because they'll be
	// checked against either the strict or loose comparator form
	// later.
	createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` +
	                   `\\s+-\\s+` +
	                   `(${src[t.XRANGEPLAIN]})` +
	                   `\\s*$`);

	createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` +
	                        `\\s+-\\s+` +
	                        `(${src[t.XRANGEPLAINLOOSE]})` +
	                        `\\s*$`);

	// Star ranges basically just allow anything at all.
	createToken('STAR', '(<|>)?=?\\s*\\*');
	// >=0.0.0 is like a star
	createToken('GTE0', '^\\s*>=\\s*0\.0\.0\\s*$');
	createToken('GTE0PRE', '^\\s*>=\\s*0\.0\.0-0\\s*$');
	}(re$5, re$5.exports));

	// parse out just the options we care about so we always get a consistent
	// obj with keys in a consistent order.
	const opts = ['includePrerelease', 'loose', 'rtl'];
	const parseOptions$4 = options =>
	  !options ? {}
	  : typeof options !== 'object' ? { loose: true }
	  : opts.filter(k => options[k]).reduce((options, k) => {
	    options[k] = true;
	    return options
	  }, {});
	var parseOptions_1 = parseOptions$4;

	const numeric = /^[0-9]+$/;
	const compareIdentifiers$1 = (a, b) => {
	  const anum = numeric.test(a);
	  const bnum = numeric.test(b);

	  if (anum && bnum) {
	    a = +a;
	    b = +b;
	  }

	  return a === b ? 0
	    : (anum && !bnum) ? -1
	    : (bnum && !anum) ? 1
	    : a < b ? -1
	    : 1
	};

	const rcompareIdentifiers = (a, b) => compareIdentifiers$1(b, a);

	var identifiers = {
	  compareIdentifiers: compareIdentifiers$1,
	  rcompareIdentifiers
	};

	const debug$2 = debug_1;
	const { MAX_LENGTH: MAX_LENGTH$1, MAX_SAFE_INTEGER } = constants;
	const { re: re$4, t: t$4 } = re$5.exports;

	const parseOptions$3 = parseOptions_1;
	const { compareIdentifiers } = identifiers;
	class SemVer$e {
	  constructor (version, options) {
	    options = parseOptions$3(options);

	    if (version instanceof SemVer$e) {
	      if (version.loose === !!options.loose &&
	          version.includePrerelease === !!options.includePrerelease) {
	        return version
	      } else {
	        version = version.version;
	      }
	    } else if (typeof version !== 'string') {
	      throw new TypeError(`Invalid Version: ${version}`)
	    }

	    if (version.length > MAX_LENGTH$1) {
	      throw new TypeError(
	        `version is longer than ${MAX_LENGTH$1} characters`
	      )
	    }

	    debug$2('SemVer', version, options);
	    this.options = options;
	    this.loose = !!options.loose;
	    // this isn't actually relevant for versions, but keep it so that we
	    // don't run into trouble passing this.options around.
	    this.includePrerelease = !!options.includePrerelease;

	    const m = version.trim().match(options.loose ? re$4[t$4.LOOSE] : re$4[t$4.FULL]);

	    if (!m) {
	      throw new TypeError(`Invalid Version: ${version}`)
	    }

	    this.raw = version;

	    // these are actually numbers
	    this.major = +m[1];
	    this.minor = +m[2];
	    this.patch = +m[3];

	    if (this.major > MAX_SAFE_INTEGER || this.major < 0) {
	      throw new TypeError('Invalid major version')
	    }

	    if (this.minor > MAX_SAFE_INTEGER || this.minor < 0) {
	      throw new TypeError('Invalid minor version')
	    }

	    if (this.patch > MAX_SAFE_INTEGER || this.patch < 0) {
	      throw new TypeError('Invalid patch version')
	    }

	    // numberify any prerelease numeric ids
	    if (!m[4]) {
	      this.prerelease = [];
	    } else {
	      this.prerelease = m[4].split('.').map((id) => {
	        if (/^[0-9]+$/.test(id)) {
	          const num = +id;
	          if (num >= 0 && num < MAX_SAFE_INTEGER) {
	            return num
	          }
	        }
	        return id
	      });
	    }

	    this.build = m[5] ? m[5].split('.') : [];
	    this.format();
	  }

	  format () {
	    this.version = `${this.major}.${this.minor}.${this.patch}`;
	    if (this.prerelease.length) {
	      this.version += `-${this.prerelease.join('.')}`;
	    }
	    return this.version
	  }

	  toString () {
	    return this.version
	  }

	  compare (other) {
	    debug$2('SemVer.compare', this.version, this.options, other);
	    if (!(other instanceof SemVer$e)) {
	      if (typeof other === 'string' && other === this.version) {
	        return 0
	      }
	      other = new SemVer$e(other, this.options);
	    }

	    if (other.version === this.version) {
	      return 0
	    }

	    return this.compareMain(other) || this.comparePre(other)
	  }

	  compareMain (other) {
	    if (!(other instanceof SemVer$e)) {
	      other = new SemVer$e(other, this.options);
	    }

	    return (
	      compareIdentifiers(this.major, other.major) ||
	      compareIdentifiers(this.minor, other.minor) ||
	      compareIdentifiers(this.patch, other.patch)
	    )
	  }

	  comparePre (other) {
	    if (!(other instanceof SemVer$e)) {
	      other = new SemVer$e(other, this.options);
	    }

	    // NOT having a prerelease is > having one
	    if (this.prerelease.length && !other.prerelease.length) {
	      return -1
	    } else if (!this.prerelease.length && other.prerelease.length) {
	      return 1
	    } else if (!this.prerelease.length && !other.prerelease.length) {
	      return 0
	    }

	    let i = 0;
	    do {
	      const a = this.prerelease[i];
	      const b = other.prerelease[i];
	      debug$2('prerelease compare', i, a, b);
	      if (a === undefined && b === undefined) {
	        return 0
	      } else if (b === undefined) {
	        return 1
	      } else if (a === undefined) {
	        return -1
	      } else if (a === b) {
	        continue
	      } else {
	        return compareIdentifiers(a, b)
	      }
	    } while (++i)
	  }

	  compareBuild (other) {
	    if (!(other instanceof SemVer$e)) {
	      other = new SemVer$e(other, this.options);
	    }

	    let i = 0;
	    do {
	      const a = this.build[i];
	      const b = other.build[i];
	      debug$2('prerelease compare', i, a, b);
	      if (a === undefined && b === undefined) {
	        return 0
	      } else if (b === undefined) {
	        return 1
	      } else if (a === undefined) {
	        return -1
	      } else if (a === b) {
	        continue
	      } else {
	        return compareIdentifiers(a, b)
	      }
	    } while (++i)
	  }

	  // preminor will bump the version up to the next minor release, and immediately
	  // down to pre-release. premajor and prepatch work the same way.
	  inc (release, identifier) {
	    switch (release) {
	      case 'premajor':
	        this.prerelease.length = 0;
	        this.patch = 0;
	        this.minor = 0;
	        this.major++;
	        this.inc('pre', identifier);
	        break
	      case 'preminor':
	        this.prerelease.length = 0;
	        this.patch = 0;
	        this.minor++;
	        this.inc('pre', identifier);
	        break
	      case 'prepatch':
	        // If this is already a prerelease, it will bump to the next version
	        // drop any prereleases that might already exist, since they are not
	        // relevant at this point.
	        this.prerelease.length = 0;
	        this.inc('patch', identifier);
	        this.inc('pre', identifier);
	        break
	      // If the input is a non-prerelease version, this acts the same as
	      // prepatch.
	      case 'prerelease':
	        if (this.prerelease.length === 0) {
	          this.inc('patch', identifier);
	        }
	        this.inc('pre', identifier);
	        break

	      case 'major':
	        // If this is a pre-major version, bump up to the same major version.
	        // Otherwise increment major.
	        // 1.0.0-5 bumps to 1.0.0
	        // 1.1.0 bumps to 2.0.0
	        if (
	          this.minor !== 0 ||
	          this.patch !== 0 ||
	          this.prerelease.length === 0
	        ) {
	          this.major++;
	        }
	        this.minor = 0;
	        this.patch = 0;
	        this.prerelease = [];
	        break
	      case 'minor':
	        // If this is a pre-minor version, bump up to the same minor version.
	        // Otherwise increment minor.
	        // 1.2.0-5 bumps to 1.2.0
	        // 1.2.1 bumps to 1.3.0
	        if (this.patch !== 0 || this.prerelease.length === 0) {
	          this.minor++;
	        }
	        this.patch = 0;
	        this.prerelease = [];
	        break
	      case 'patch':
	        // If this is not a pre-release version, it will increment the patch.
	        // If it is a pre-release it will bump up to the same patch version.
	        // 1.2.0-5 patches to 1.2.0
	        // 1.2.0 patches to 1.2.1
	        if (this.prerelease.length === 0) {
	          this.patch++;
	        }
	        this.prerelease = [];
	        break
	      // This probably shouldn't be used publicly.
	      // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
	      case 'pre':
	        if (this.prerelease.length === 0) {
	          this.prerelease = [0];
	        } else {
	          let i = this.prerelease.length;
	          while (--i >= 0) {
	            if (typeof this.prerelease[i] === 'number') {
	              this.prerelease[i]++;
	              i = -2;
	            }
	          }
	          if (i === -1) {
	            // didn't increment anything
	            this.prerelease.push(0);
	          }
	        }
	        if (identifier) {
	          // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
	          // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
	          if (this.prerelease[0] === identifier) {
	            if (isNaN(this.prerelease[1])) {
	              this.prerelease = [identifier, 0];
	            }
	          } else {
	            this.prerelease = [identifier, 0];
	          }
	        }
	        break

	      default:
	        throw new Error(`invalid increment argument: ${release}`)
	    }
	    this.format();
	    this.raw = this.version;
	    return this
	  }
	}

	var semver$1 = SemVer$e;

	const {MAX_LENGTH} = constants;
	const { re: re$3, t: t$3 } = re$5.exports;
	const SemVer$d = semver$1;

	const parseOptions$2 = parseOptions_1;
	const parse$5 = (version, options) => {
	  options = parseOptions$2(options);

	  if (version instanceof SemVer$d) {
	    return version
	  }

	  if (typeof version !== 'string') {
	    return null
	  }

	  if (version.length > MAX_LENGTH) {
	    return null
	  }

	  const r = options.loose ? re$3[t$3.LOOSE] : re$3[t$3.FULL];
	  if (!r.test(version)) {
	    return null
	  }

	  try {
	    return new SemVer$d(version, options)
	  } catch (er) {
	    return null
	  }
	};

	var parse_1 = parse$5;

	const parse$4 = parse_1;
	const valid$1 = (version, options) => {
	  const v = parse$4(version, options);
	  return v ? v.version : null
	};
	var valid_1 = valid$1;

	const parse$3 = parse_1;
	const clean = (version, options) => {
	  const s = parse$3(version.trim().replace(/^[=v]+/, ''), options);
	  return s ? s.version : null
	};
	var clean_1 = clean;

	const SemVer$c = semver$1;

	const inc = (version, release, options, identifier) => {
	  if (typeof (options) === 'string') {
	    identifier = options;
	    options = undefined;
	  }

	  try {
	    return new SemVer$c(version, options).inc(release, identifier).version
	  } catch (er) {
	    return null
	  }
	};
	var inc_1 = inc;

	const SemVer$b = semver$1;
	const compare$a = (a, b, loose) =>
	  new SemVer$b(a, loose).compare(new SemVer$b(b, loose));

	var compare_1 = compare$a;

	const compare$9 = compare_1;
	const eq$2 = (a, b, loose) => compare$9(a, b, loose) === 0;
	var eq_1 = eq$2;

	const parse$2 = parse_1;
	const eq$1 = eq_1;

	const diff = (version1, version2) => {
	  if (eq$1(version1, version2)) {
	    return null
	  } else {
	    const v1 = parse$2(version1);
	    const v2 = parse$2(version2);
	    const hasPre = v1.prerelease.length || v2.prerelease.length;
	    const prefix = hasPre ? 'pre' : '';
	    const defaultResult = hasPre ? 'prerelease' : '';
	    for (const key in v1) {
	      if (key === 'major' || key === 'minor' || key === 'patch') {
	        if (v1[key] !== v2[key]) {
	          return prefix + key
	        }
	      }
	    }
	    return defaultResult // may be undefined
	  }
	};
	var diff_1 = diff;

	const SemVer$a = semver$1;
	const major = (a, loose) => new SemVer$a(a, loose).major;
	var major_1 = major;

	const SemVer$9 = semver$1;
	const minor = (a, loose) => new SemVer$9(a, loose).minor;
	var minor_1 = minor;

	const SemVer$8 = semver$1;
	const patch = (a, loose) => new SemVer$8(a, loose).patch;
	var patch_1 = patch;

	const parse$1 = parse_1;
	const prerelease = (version, options) => {
	  const parsed = parse$1(version, options);
	  return (parsed && parsed.prerelease.length) ? parsed.prerelease : null
	};
	var prerelease_1 = prerelease;

	const compare$8 = compare_1;
	const rcompare = (a, b, loose) => compare$8(b, a, loose);
	var rcompare_1 = rcompare;

	const compare$7 = compare_1;
	const compareLoose = (a, b) => compare$7(a, b, true);
	var compareLoose_1 = compareLoose;

	const SemVer$7 = semver$1;
	const compareBuild$2 = (a, b, loose) => {
	  const versionA = new SemVer$7(a, loose);
	  const versionB = new SemVer$7(b, loose);
	  return versionA.compare(versionB) || versionA.compareBuild(versionB)
	};
	var compareBuild_1 = compareBuild$2;

	const compareBuild$1 = compareBuild_1;
	const sort = (list, loose) => list.sort((a, b) => compareBuild$1(a, b, loose));
	var sort_1 = sort;

	const compareBuild = compareBuild_1;
	const rsort = (list, loose) => list.sort((a, b) => compareBuild(b, a, loose));
	var rsort_1 = rsort;

	const compare$6 = compare_1;
	const gt$3 = (a, b, loose) => compare$6(a, b, loose) > 0;
	var gt_1 = gt$3;

	const compare$5 = compare_1;
	const lt$2 = (a, b, loose) => compare$5(a, b, loose) < 0;
	var lt_1 = lt$2;

	const compare$4 = compare_1;
	const neq$1 = (a, b, loose) => compare$4(a, b, loose) !== 0;
	var neq_1 = neq$1;

	const compare$3 = compare_1;
	const gte$2 = (a, b, loose) => compare$3(a, b, loose) >= 0;
	var gte_1 = gte$2;

	const compare$2 = compare_1;
	const lte$2 = (a, b, loose) => compare$2(a, b, loose) <= 0;
	var lte_1 = lte$2;

	const eq = eq_1;
	const neq = neq_1;
	const gt$2 = gt_1;
	const gte$1 = gte_1;
	const lt$1 = lt_1;
	const lte$1 = lte_1;

	const cmp$1 = (a, op, b, loose) => {
	  switch (op) {
	    case '===':
	      if (typeof a === 'object')
	        a = a.version;
	      if (typeof b === 'object')
	        b = b.version;
	      return a === b

	    case '!==':
	      if (typeof a === 'object')
	        a = a.version;
	      if (typeof b === 'object')
	        b = b.version;
	      return a !== b

	    case '':
	    case '=':
	    case '==':
	      return eq(a, b, loose)

	    case '!=':
	      return neq(a, b, loose)

	    case '>':
	      return gt$2(a, b, loose)

	    case '>=':
	      return gte$1(a, b, loose)

	    case '<':
	      return lt$1(a, b, loose)

	    case '<=':
	      return lte$1(a, b, loose)

	    default:
	      throw new TypeError(`Invalid operator: ${op}`)
	  }
	};
	var cmp_1 = cmp$1;

	const SemVer$6 = semver$1;
	const parse = parse_1;
	const {re: re$2, t: t$2} = re$5.exports;

	const coerce = (version, options) => {
	  if (version instanceof SemVer$6) {
	    return version
	  }

	  if (typeof version === 'number') {
	    version = String(version);
	  }

	  if (typeof version !== 'string') {
	    return null
	  }

	  options = options || {};

	  let match = null;
	  if (!options.rtl) {
	    match = version.match(re$2[t$2.COERCE]);
	  } else {
	    // Find the right-most coercible string that does not share
	    // a terminus with a more left-ward coercible string.
	    // Eg, '1.2.3.4' wants to coerce '2.3.4', not '3.4' or '4'
	    //
	    // Walk through the string checking with a /g regexp
	    // Manually set the index so as to pick up overlapping matches.
	    // Stop when we get a match that ends at the string end, since no
	    // coercible string can be more right-ward without the same terminus.
	    let next;
	    while ((next = re$2[t$2.COERCERTL].exec(version)) &&
	        (!match || match.index + match[0].length !== version.length)
	    ) {
	      if (!match ||
	            next.index + next[0].length !== match.index + match[0].length) {
	        match = next;
	      }
	      re$2[t$2.COERCERTL].lastIndex = next.index + next[1].length + next[2].length;
	    }
	    // leave it in a clean state
	    re$2[t$2.COERCERTL].lastIndex = -1;
	  }

	  if (match === null)
	    return null

	  return parse(`${match[2]}.${match[3] || '0'}.${match[4] || '0'}`, options)
	};
	var coerce_1 = coerce;

	var yallist = Yallist$1;

	Yallist$1.Node = Node;
	Yallist$1.create = Yallist$1;

	function Yallist$1 (list) {
	  var self = this;
	  if (!(self instanceof Yallist$1)) {
	    self = new Yallist$1();
	  }

	  self.tail = null;
	  self.head = null;
	  self.length = 0;

	  if (list && typeof list.forEach === 'function') {
	    list.forEach(function (item) {
	      self.push(item);
	    });
	  } else if (arguments.length > 0) {
	    for (var i = 0, l = arguments.length; i < l; i++) {
	      self.push(arguments[i]);
	    }
	  }

	  return self
	}

	Yallist$1.prototype.removeNode = function (node) {
	  if (node.list !== this) {
	    throw new Error('removing node which does not belong to this list')
	  }

	  var next = node.next;
	  var prev = node.prev;

	  if (next) {
	    next.prev = prev;
	  }

	  if (prev) {
	    prev.next = next;
	  }

	  if (node === this.head) {
	    this.head = next;
	  }
	  if (node === this.tail) {
	    this.tail = prev;
	  }

	  node.list.length--;
	  node.next = null;
	  node.prev = null;
	  node.list = null;

	  return next
	};

	Yallist$1.prototype.unshiftNode = function (node) {
	  if (node === this.head) {
	    return
	  }

	  if (node.list) {
	    node.list.removeNode(node);
	  }

	  var head = this.head;
	  node.list = this;
	  node.next = head;
	  if (head) {
	    head.prev = node;
	  }

	  this.head = node;
	  if (!this.tail) {
	    this.tail = node;
	  }
	  this.length++;
	};

	Yallist$1.prototype.pushNode = function (node) {
	  if (node === this.tail) {
	    return
	  }

	  if (node.list) {
	    node.list.removeNode(node);
	  }

	  var tail = this.tail;
	  node.list = this;
	  node.prev = tail;
	  if (tail) {
	    tail.next = node;
	  }

	  this.tail = node;
	  if (!this.head) {
	    this.head = node;
	  }
	  this.length++;
	};

	Yallist$1.prototype.push = function () {
	  for (var i = 0, l = arguments.length; i < l; i++) {
	    push(this, arguments[i]);
	  }
	  return this.length
	};

	Yallist$1.prototype.unshift = function () {
	  for (var i = 0, l = arguments.length; i < l; i++) {
	    unshift(this, arguments[i]);
	  }
	  return this.length
	};

	Yallist$1.prototype.pop = function () {
	  if (!this.tail) {
	    return undefined
	  }

	  var res = this.tail.value;
	  this.tail = this.tail.prev;
	  if (this.tail) {
	    this.tail.next = null;
	  } else {
	    this.head = null;
	  }
	  this.length--;
	  return res
	};

	Yallist$1.prototype.shift = function () {
	  if (!this.head) {
	    return undefined
	  }

	  var res = this.head.value;
	  this.head = this.head.next;
	  if (this.head) {
	    this.head.prev = null;
	  } else {
	    this.tail = null;
	  }
	  this.length--;
	  return res
	};

	Yallist$1.prototype.forEach = function (fn, thisp) {
	  thisp = thisp || this;
	  for (var walker = this.head, i = 0; walker !== null; i++) {
	    fn.call(thisp, walker.value, i, this);
	    walker = walker.next;
	  }
	};

	Yallist$1.prototype.forEachReverse = function (fn, thisp) {
	  thisp = thisp || this;
	  for (var walker = this.tail, i = this.length - 1; walker !== null; i--) {
	    fn.call(thisp, walker.value, i, this);
	    walker = walker.prev;
	  }
	};

	Yallist$1.prototype.get = function (n) {
	  for (var i = 0, walker = this.head; walker !== null && i < n; i++) {
	    // abort out of the list early if we hit a cycle
	    walker = walker.next;
	  }
	  if (i === n && walker !== null) {
	    return walker.value
	  }
	};

	Yallist$1.prototype.getReverse = function (n) {
	  for (var i = 0, walker = this.tail; walker !== null && i < n; i++) {
	    // abort out of the list early if we hit a cycle
	    walker = walker.prev;
	  }
	  if (i === n && walker !== null) {
	    return walker.value
	  }
	};

	Yallist$1.prototype.map = function (fn, thisp) {
	  thisp = thisp || this;
	  var res = new Yallist$1();
	  for (var walker = this.head; walker !== null;) {
	    res.push(fn.call(thisp, walker.value, this));
	    walker = walker.next;
	  }
	  return res
	};

	Yallist$1.prototype.mapReverse = function (fn, thisp) {
	  thisp = thisp || this;
	  var res = new Yallist$1();
	  for (var walker = this.tail; walker !== null;) {
	    res.push(fn.call(thisp, walker.value, this));
	    walker = walker.prev;
	  }
	  return res
	};

	Yallist$1.prototype.reduce = function (fn, initial) {
	  var acc;
	  var walker = this.head;
	  if (arguments.length > 1) {
	    acc = initial;
	  } else if (this.head) {
	    walker = this.head.next;
	    acc = this.head.value;
	  } else {
	    throw new TypeError('Reduce of empty list with no initial value')
	  }

	  for (var i = 0; walker !== null; i++) {
	    acc = fn(acc, walker.value, i);
	    walker = walker.next;
	  }

	  return acc
	};

	Yallist$1.prototype.reduceReverse = function (fn, initial) {
	  var acc;
	  var walker = this.tail;
	  if (arguments.length > 1) {
	    acc = initial;
	  } else if (this.tail) {
	    walker = this.tail.prev;
	    acc = this.tail.value;
	  } else {
	    throw new TypeError('Reduce of empty list with no initial value')
	  }

	  for (var i = this.length - 1; walker !== null; i--) {
	    acc = fn(acc, walker.value, i);
	    walker = walker.prev;
	  }

	  return acc
	};

	Yallist$1.prototype.toArray = function () {
	  var arr = new Array(this.length);
	  for (var i = 0, walker = this.head; walker !== null; i++) {
	    arr[i] = walker.value;
	    walker = walker.next;
	  }
	  return arr
	};

	Yallist$1.prototype.toArrayReverse = function () {
	  var arr = new Array(this.length);
	  for (var i = 0, walker = this.tail; walker !== null; i++) {
	    arr[i] = walker.value;
	    walker = walker.prev;
	  }
	  return arr
	};

	Yallist$1.prototype.slice = function (from, to) {
	  to = to || this.length;
	  if (to < 0) {
	    to += this.length;
	  }
	  from = from || 0;
	  if (from < 0) {
	    from += this.length;
	  }
	  var ret = new Yallist$1();
	  if (to < from || to < 0) {
	    return ret
	  }
	  if (from < 0) {
	    from = 0;
	  }
	  if (to > this.length) {
	    to = this.length;
	  }
	  for (var i = 0, walker = this.head; walker !== null && i < from; i++) {
	    walker = walker.next;
	  }
	  for (; walker !== null && i < to; i++, walker = walker.next) {
	    ret.push(walker.value);
	  }
	  return ret
	};

	Yallist$1.prototype.sliceReverse = function (from, to) {
	  to = to || this.length;
	  if (to < 0) {
	    to += this.length;
	  }
	  from = from || 0;
	  if (from < 0) {
	    from += this.length;
	  }
	  var ret = new Yallist$1();
	  if (to < from || to < 0) {
	    return ret
	  }
	  if (from < 0) {
	    from = 0;
	  }
	  if (to > this.length) {
	    to = this.length;
	  }
	  for (var i = this.length, walker = this.tail; walker !== null && i > to; i--) {
	    walker = walker.prev;
	  }
	  for (; walker !== null && i > from; i--, walker = walker.prev) {
	    ret.push(walker.value);
	  }
	  return ret
	};

	Yallist$1.prototype.splice = function (start, deleteCount, ...nodes) {
	  if (start > this.length) {
	    start = this.length - 1;
	  }
	  if (start < 0) {
	    start = this.length + start;
	  }

	  for (var i = 0, walker = this.head; walker !== null && i < start; i++) {
	    walker = walker.next;
	  }

	  var ret = [];
	  for (var i = 0; walker && i < deleteCount; i++) {
	    ret.push(walker.value);
	    walker = this.removeNode(walker);
	  }
	  if (walker === null) {
	    walker = this.tail;
	  }

	  if (walker !== this.head && walker !== this.tail) {
	    walker = walker.prev;
	  }

	  for (var i = 0; i < nodes.length; i++) {
	    walker = insert(this, walker, nodes[i]);
	  }
	  return ret;
	};

	Yallist$1.prototype.reverse = function () {
	  var head = this.head;
	  var tail = this.tail;
	  for (var walker = head; walker !== null; walker = walker.prev) {
	    var p = walker.prev;
	    walker.prev = walker.next;
	    walker.next = p;
	  }
	  this.head = tail;
	  this.tail = head;
	  return this
	};

	function insert (self, node, value) {
	  var inserted = node === self.head ?
	    new Node(value, null, node, self) :
	    new Node(value, node, node.next, self);

	  if (inserted.next === null) {
	    self.tail = inserted;
	  }
	  if (inserted.prev === null) {
	    self.head = inserted;
	  }

	  self.length++;

	  return inserted
	}

	function push (self, item) {
	  self.tail = new Node(item, self.tail, null, self);
	  if (!self.head) {
	    self.head = self.tail;
	  }
	  self.length++;
	}

	function unshift (self, item) {
	  self.head = new Node(item, null, self.head, self);
	  if (!self.tail) {
	    self.tail = self.head;
	  }
	  self.length++;
	}

	function Node (value, prev, next, list) {
	  if (!(this instanceof Node)) {
	    return new Node(value, prev, next, list)
	  }

	  this.list = list;
	  this.value = value;

	  if (prev) {
	    prev.next = this;
	    this.prev = prev;
	  } else {
	    this.prev = null;
	  }

	  if (next) {
	    next.prev = this;
	    this.next = next;
	  } else {
	    this.next = null;
	  }
	}

	try {
	  // add if support for Symbol.iterator is present
	  require('./iterator.js')(Yallist$1);
	} catch (er) {}

	// A linked list to keep track of recently-used-ness
	const Yallist = yallist;

	const MAX = Symbol('max');
	const LENGTH = Symbol('length');
	const LENGTH_CALCULATOR = Symbol('lengthCalculator');
	const ALLOW_STALE = Symbol('allowStale');
	const MAX_AGE = Symbol('maxAge');
	const DISPOSE = Symbol('dispose');
	const NO_DISPOSE_ON_SET = Symbol('noDisposeOnSet');
	const LRU_LIST = Symbol('lruList');
	const CACHE = Symbol('cache');
	const UPDATE_AGE_ON_GET = Symbol('updateAgeOnGet');

	const naiveLength = () => 1;

	// lruList is a yallist where the head is the youngest
	// item, and the tail is the oldest.  the list contains the Hit
	// objects as the entries.
	// Each Hit object has a reference to its Yallist.Node.  This
	// never changes.
	//
	// cache is a Map (or PseudoMap) that matches the keys to
	// the Yallist.Node object.
	class LRUCache {
	  constructor (options) {
	    if (typeof options === 'number')
	      options = { max: options };

	    if (!options)
	      options = {};

	    if (options.max && (typeof options.max !== 'number' || options.max < 0))
	      throw new TypeError('max must be a non-negative number')
	    // Kind of weird to have a default max of Infinity, but oh well.
	    this[MAX] = options.max || Infinity;

	    const lc = options.length || naiveLength;
	    this[LENGTH_CALCULATOR] = (typeof lc !== 'function') ? naiveLength : lc;
	    this[ALLOW_STALE] = options.stale || false;
	    if (options.maxAge && typeof options.maxAge !== 'number')
	      throw new TypeError('maxAge must be a number')
	    this[MAX_AGE] = options.maxAge || 0;
	    this[DISPOSE] = options.dispose;
	    this[NO_DISPOSE_ON_SET] = options.noDisposeOnSet || false;
	    this[UPDATE_AGE_ON_GET] = options.updateAgeOnGet || false;
	    this.reset();
	  }

	  // resize the cache when the max changes.
	  set max (mL) {
	    if (typeof mL !== 'number' || mL < 0)
	      throw new TypeError('max must be a non-negative number')

	    this[MAX] = mL || Infinity;
	    trim(this);
	  }
	  get max () {
	    return this[MAX]
	  }

	  set allowStale (allowStale) {
	    this[ALLOW_STALE] = !!allowStale;
	  }
	  get allowStale () {
	    return this[ALLOW_STALE]
	  }

	  set maxAge (mA) {
	    if (typeof mA !== 'number')
	      throw new TypeError('maxAge must be a non-negative number')

	    this[MAX_AGE] = mA;
	    trim(this);
	  }
	  get maxAge () {
	    return this[MAX_AGE]
	  }

	  // resize the cache when the lengthCalculator changes.
	  set lengthCalculator (lC) {
	    if (typeof lC !== 'function')
	      lC = naiveLength;

	    if (lC !== this[LENGTH_CALCULATOR]) {
	      this[LENGTH_CALCULATOR] = lC;
	      this[LENGTH] = 0;
	      this[LRU_LIST].forEach(hit => {
	        hit.length = this[LENGTH_CALCULATOR](hit.value, hit.key);
	        this[LENGTH] += hit.length;
	      });
	    }
	    trim(this);
	  }
	  get lengthCalculator () { return this[LENGTH_CALCULATOR] }

	  get length () { return this[LENGTH] }
	  get itemCount () { return this[LRU_LIST].length }

	  rforEach (fn, thisp) {
	    thisp = thisp || this;
	    for (let walker = this[LRU_LIST].tail; walker !== null;) {
	      const prev = walker.prev;
	      forEachStep(this, fn, walker, thisp);
	      walker = prev;
	    }
	  }

	  forEach (fn, thisp) {
	    thisp = thisp || this;
	    for (let walker = this[LRU_LIST].head; walker !== null;) {
	      const next = walker.next;
	      forEachStep(this, fn, walker, thisp);
	      walker = next;
	    }
	  }

	  keys () {
	    return this[LRU_LIST].toArray().map(k => k.key)
	  }

	  values () {
	    return this[LRU_LIST].toArray().map(k => k.value)
	  }

	  reset () {
	    if (this[DISPOSE] &&
	        this[LRU_LIST] &&
	        this[LRU_LIST].length) {
	      this[LRU_LIST].forEach(hit => this[DISPOSE](hit.key, hit.value));
	    }

	    this[CACHE] = new Map(); // hash of items by key
	    this[LRU_LIST] = new Yallist(); // list of items in order of use recency
	    this[LENGTH] = 0; // length of items in the list
	  }

	  dump () {
	    return this[LRU_LIST].map(hit =>
	      isStale(this, hit) ? false : {
	        k: hit.key,
	        v: hit.value,
	        e: hit.now + (hit.maxAge || 0)
	      }).toArray().filter(h => h)
	  }

	  dumpLru () {
	    return this[LRU_LIST]
	  }

	  set (key, value, maxAge) {
	    maxAge = maxAge || this[MAX_AGE];

	    if (maxAge && typeof maxAge !== 'number')
	      throw new TypeError('maxAge must be a number')

	    const now = maxAge ? Date.now() : 0;
	    const len = this[LENGTH_CALCULATOR](value, key);

	    if (this[CACHE].has(key)) {
	      if (len > this[MAX]) {
	        del(this, this[CACHE].get(key));
	        return false
	      }

	      const node = this[CACHE].get(key);
	      const item = node.value;

	      // dispose of the old one before overwriting
	      // split out into 2 ifs for better coverage tracking
	      if (this[DISPOSE]) {
	        if (!this[NO_DISPOSE_ON_SET])
	          this[DISPOSE](key, item.value);
	      }

	      item.now = now;
	      item.maxAge = maxAge;
	      item.value = value;
	      this[LENGTH] += len - item.length;
	      item.length = len;
	      this.get(key);
	      trim(this);
	      return true
	    }

	    const hit = new Entry(key, value, len, now, maxAge);

	    // oversized objects fall out of cache automatically.
	    if (hit.length > this[MAX]) {
	      if (this[DISPOSE])
	        this[DISPOSE](key, value);

	      return false
	    }

	    this[LENGTH] += hit.length;
	    this[LRU_LIST].unshift(hit);
	    this[CACHE].set(key, this[LRU_LIST].head);
	    trim(this);
	    return true
	  }

	  has (key) {
	    if (!this[CACHE].has(key)) return false
	    const hit = this[CACHE].get(key).value;
	    return !isStale(this, hit)
	  }

	  get (key) {
	    return get(this, key, true)
	  }

	  peek (key) {
	    return get(this, key, false)
	  }

	  pop () {
	    const node = this[LRU_LIST].tail;
	    if (!node)
	      return null

	    del(this, node);
	    return node.value
	  }

	  del (key) {
	    del(this, this[CACHE].get(key));
	  }

	  load (arr) {
	    // reset the cache
	    this.reset();

	    const now = Date.now();
	    // A previous serialized cache has the most recent items first
	    for (let l = arr.length - 1; l >= 0; l--) {
	      const hit = arr[l];
	      const expiresAt = hit.e || 0;
	      if (expiresAt === 0)
	        // the item was created without expiration in a non aged cache
	        this.set(hit.k, hit.v);
	      else {
	        const maxAge = expiresAt - now;
	        // dont add already expired items
	        if (maxAge > 0) {
	          this.set(hit.k, hit.v, maxAge);
	        }
	      }
	    }
	  }

	  prune () {
	    this[CACHE].forEach((value, key) => get(this, key, false));
	  }
	}

	const get = (self, key, doUse) => {
	  const node = self[CACHE].get(key);
	  if (node) {
	    const hit = node.value;
	    if (isStale(self, hit)) {
	      del(self, node);
	      if (!self[ALLOW_STALE])
	        return undefined
	    } else {
	      if (doUse) {
	        if (self[UPDATE_AGE_ON_GET])
	          node.value.now = Date.now();
	        self[LRU_LIST].unshiftNode(node);
	      }
	    }
	    return hit.value
	  }
	};

	const isStale = (self, hit) => {
	  if (!hit || (!hit.maxAge && !self[MAX_AGE]))
	    return false

	  const diff = Date.now() - hit.now;
	  return hit.maxAge ? diff > hit.maxAge
	    : self[MAX_AGE] && (diff > self[MAX_AGE])
	};

	const trim = self => {
	  if (self[LENGTH] > self[MAX]) {
	    for (let walker = self[LRU_LIST].tail;
	      self[LENGTH] > self[MAX] && walker !== null;) {
	      // We know that we're about to delete this one, and also
	      // what the next least recently used key will be, so just
	      // go ahead and set it now.
	      const prev = walker.prev;
	      del(self, walker);
	      walker = prev;
	    }
	  }
	};

	const del = (self, node) => {
	  if (node) {
	    const hit = node.value;
	    if (self[DISPOSE])
	      self[DISPOSE](hit.key, hit.value);

	    self[LENGTH] -= hit.length;
	    self[CACHE].delete(hit.key);
	    self[LRU_LIST].removeNode(node);
	  }
	};

	class Entry {
	  constructor (key, value, length, now, maxAge) {
	    this.key = key;
	    this.value = value;
	    this.length = length;
	    this.now = now;
	    this.maxAge = maxAge || 0;
	  }
	}

	const forEachStep = (self, fn, node, thisp) => {
	  let hit = node.value;
	  if (isStale(self, hit)) {
	    del(self, node);
	    if (!self[ALLOW_STALE])
	      hit = undefined;
	  }
	  if (hit)
	    fn.call(thisp, hit.value, hit.key, self);
	};

	var lruCache = LRUCache;

	// hoisted class for cyclic dependency
	class Range$a {
	  constructor (range, options) {
	    options = parseOptions$1(options);

	    if (range instanceof Range$a) {
	      if (
	        range.loose === !!options.loose &&
	        range.includePrerelease === !!options.includePrerelease
	      ) {
	        return range
	      } else {
	        return new Range$a(range.raw, options)
	      }
	    }

	    if (range instanceof Comparator$3) {
	      // just put it in the set and return
	      this.raw = range.value;
	      this.set = [[range]];
	      this.format();
	      return this
	    }

	    this.options = options;
	    this.loose = !!options.loose;
	    this.includePrerelease = !!options.includePrerelease;

	    // First, split based on boolean or ||
	    this.raw = range;
	    this.set = range
	      .split(/\s*\|\|\s*/)
	      // map the range to a 2d array of comparators
	      .map(range => this.parseRange(range.trim()))
	      // throw out any comparator lists that are empty
	      // this generally means that it was not a valid range, which is allowed
	      // in loose mode, but will still throw if the WHOLE range is invalid.
	      .filter(c => c.length);

	    if (!this.set.length) {
	      throw new TypeError(`Invalid SemVer Range: ${range}`)
	    }

	    // if we have any that are not the null set, throw out null sets.
	    if (this.set.length > 1) {
	      // keep the first one, in case they're all null sets
	      const first = this.set[0];
	      this.set = this.set.filter(c => !isNullSet(c[0]));
	      if (this.set.length === 0)
	        this.set = [first];
	      else if (this.set.length > 1) {
	        // if we have any that are *, then the range is just *
	        for (const c of this.set) {
	          if (c.length === 1 && isAny(c[0])) {
	            this.set = [c];
	            break
	          }
	        }
	      }
	    }

	    this.format();
	  }

	  format () {
	    this.range = this.set
	      .map((comps) => {
	        return comps.join(' ').trim()
	      })
	      .join('||')
	      .trim();
	    return this.range
	  }

	  toString () {
	    return this.range
	  }

	  parseRange (range) {
	    range = range.trim();

	    // memoize range parsing for performance.
	    // this is a very hot path, and fully deterministic.
	    const memoOpts = Object.keys(this.options).join(',');
	    const memoKey = `parseRange:${memoOpts}:${range}`;
	    const cached = cache.get(memoKey);
	    if (cached)
	      return cached

	    const loose = this.options.loose;
	    // `1.2.3 - 1.2.4` => `>=1.2.3 <=1.2.4`
	    const hr = loose ? re$1[t$1.HYPHENRANGELOOSE] : re$1[t$1.HYPHENRANGE];
	    range = range.replace(hr, hyphenReplace(this.options.includePrerelease));
	    debug$1('hyphen replace', range);
	    // `> 1.2.3 < 1.2.5` => `>1.2.3 <1.2.5`
	    range = range.replace(re$1[t$1.COMPARATORTRIM], comparatorTrimReplace);
	    debug$1('comparator trim', range, re$1[t$1.COMPARATORTRIM]);

	    // `~ 1.2.3` => `~1.2.3`
	    range = range.replace(re$1[t$1.TILDETRIM], tildeTrimReplace);

	    // `^ 1.2.3` => `^1.2.3`
	    range = range.replace(re$1[t$1.CARETTRIM], caretTrimReplace);

	    // normalize spaces
	    range = range.split(/\s+/).join(' ');

	    // At this point, the range is completely trimmed and
	    // ready to be split into comparators.

	    const compRe = loose ? re$1[t$1.COMPARATORLOOSE] : re$1[t$1.COMPARATOR];
	    const rangeList = range
	      .split(' ')
	      .map(comp => parseComparator(comp, this.options))
	      .join(' ')
	      .split(/\s+/)
	      // >=0.0.0 is equivalent to *
	      .map(comp => replaceGTE0(comp, this.options))
	      // in loose mode, throw out any that are not valid comparators
	      .filter(this.options.loose ? comp => !!comp.match(compRe) : () => true)
	      .map(comp => new Comparator$3(comp, this.options));

	    // if any comparators are the null set, then replace with JUST null set
	    // if more than one comparator, remove any * comparators
	    // also, don't include the same comparator more than once
	    rangeList.length;
	    const rangeMap = new Map();
	    for (const comp of rangeList) {
	      if (isNullSet(comp))
	        return [comp]
	      rangeMap.set(comp.value, comp);
	    }
	    if (rangeMap.size > 1 && rangeMap.has(''))
	      rangeMap.delete('');

	    const result = [...rangeMap.values()];
	    cache.set(memoKey, result);
	    return result
	  }

	  intersects (range, options) {
	    if (!(range instanceof Range$a)) {
	      throw new TypeError('a Range is required')
	    }

	    return this.set.some((thisComparators) => {
	      return (
	        isSatisfiable(thisComparators, options) &&
	        range.set.some((rangeComparators) => {
	          return (
	            isSatisfiable(rangeComparators, options) &&
	            thisComparators.every((thisComparator) => {
	              return rangeComparators.every((rangeComparator) => {
	                return thisComparator.intersects(rangeComparator, options)
	              })
	            })
	          )
	        })
	      )
	    })
	  }

	  // if ANY of the sets match ALL of its comparators, then pass
	  test (version) {
	    if (!version) {
	      return false
	    }

	    if (typeof version === 'string') {
	      try {
	        version = new SemVer$5(version, this.options);
	      } catch (er) {
	        return false
	      }
	    }

	    for (let i = 0; i < this.set.length; i++) {
	      if (testSet(this.set[i], version, this.options)) {
	        return true
	      }
	    }
	    return false
	  }
	}
	var range = Range$a;

	const LRU = lruCache;
	const cache = new LRU({ max: 1000 });

	const parseOptions$1 = parseOptions_1;
	const Comparator$3 = comparator;
	const debug$1 = debug_1;
	const SemVer$5 = semver$1;
	const {
	  re: re$1,
	  t: t$1,
	  comparatorTrimReplace,
	  tildeTrimReplace,
	  caretTrimReplace
	} = re$5.exports;

	const isNullSet = c => c.value === '<0.0.0-0';
	const isAny = c => c.value === '';

	// take a set of comparators and determine whether there
	// exists a version which can satisfy it
	const isSatisfiable = (comparators, options) => {
	  let result = true;
	  const remainingComparators = comparators.slice();
	  let testComparator = remainingComparators.pop();

	  while (result && remainingComparators.length) {
	    result = remainingComparators.every((otherComparator) => {
	      return testComparator.intersects(otherComparator, options)
	    });

	    testComparator = remainingComparators.pop();
	  }

	  return result
	};

	// comprised of xranges, tildes, stars, and gtlt's at this point.
	// already replaced the hyphen ranges
	// turn into a set of JUST comparators.
	const parseComparator = (comp, options) => {
	  debug$1('comp', comp, options);
	  comp = replaceCarets(comp, options);
	  debug$1('caret', comp);
	  comp = replaceTildes(comp, options);
	  debug$1('tildes', comp);
	  comp = replaceXRanges(comp, options);
	  debug$1('xrange', comp);
	  comp = replaceStars(comp, options);
	  debug$1('stars', comp);
	  return comp
	};

	const isX = id => !id || id.toLowerCase() === 'x' || id === '*';

	// ~, ~> --> * (any, kinda silly)
	// ~2, ~2.x, ~2.x.x, ~>2, ~>2.x ~>2.x.x --> >=2.0.0 <3.0.0-0
	// ~2.0, ~2.0.x, ~>2.0, ~>2.0.x --> >=2.0.0 <2.1.0-0
	// ~1.2, ~1.2.x, ~>1.2, ~>1.2.x --> >=1.2.0 <1.3.0-0
	// ~1.2.3, ~>1.2.3 --> >=1.2.3 <1.3.0-0
	// ~1.2.0, ~>1.2.0 --> >=1.2.0 <1.3.0-0
	const replaceTildes = (comp, options) =>
	  comp.trim().split(/\s+/).map((comp) => {
	    return replaceTilde(comp, options)
	  }).join(' ');

	const replaceTilde = (comp, options) => {
	  const r = options.loose ? re$1[t$1.TILDELOOSE] : re$1[t$1.TILDE];
	  return comp.replace(r, (_, M, m, p, pr) => {
	    debug$1('tilde', comp, _, M, m, p, pr);
	    let ret;

	    if (isX(M)) {
	      ret = '';
	    } else if (isX(m)) {
	      ret = `>=${M}.0.0 <${+M + 1}.0.0-0`;
	    } else if (isX(p)) {
	      // ~1.2 == >=1.2.0 <1.3.0-0
	      ret = `>=${M}.${m}.0 <${M}.${+m + 1}.0-0`;
	    } else if (pr) {
	      debug$1('replaceTilde pr', pr);
	      ret = `>=${M}.${m}.${p}-${pr
      } <${M}.${+m + 1}.0-0`;
	    } else {
	      // ~1.2.3 == >=1.2.3 <1.3.0-0
	      ret = `>=${M}.${m}.${p
      } <${M}.${+m + 1}.0-0`;
	    }

	    debug$1('tilde return', ret);
	    return ret
	  })
	};

	// ^ --> * (any, kinda silly)
	// ^2, ^2.x, ^2.x.x --> >=2.0.0 <3.0.0-0
	// ^2.0, ^2.0.x --> >=2.0.0 <3.0.0-0
	// ^1.2, ^1.2.x --> >=1.2.0 <2.0.0-0
	// ^1.2.3 --> >=1.2.3 <2.0.0-0
	// ^1.2.0 --> >=1.2.0 <2.0.0-0
	const replaceCarets = (comp, options) =>
	  comp.trim().split(/\s+/).map((comp) => {
	    return replaceCaret(comp, options)
	  }).join(' ');

	const replaceCaret = (comp, options) => {
	  debug$1('caret', comp, options);
	  const r = options.loose ? re$1[t$1.CARETLOOSE] : re$1[t$1.CARET];
	  const z = options.includePrerelease ? '-0' : '';
	  return comp.replace(r, (_, M, m, p, pr) => {
	    debug$1('caret', comp, _, M, m, p, pr);
	    let ret;

	    if (isX(M)) {
	      ret = '';
	    } else if (isX(m)) {
	      ret = `>=${M}.0.0${z} <${+M + 1}.0.0-0`;
	    } else if (isX(p)) {
	      if (M === '0') {
	        ret = `>=${M}.${m}.0${z} <${M}.${+m + 1}.0-0`;
	      } else {
	        ret = `>=${M}.${m}.0${z} <${+M + 1}.0.0-0`;
	      }
	    } else if (pr) {
	      debug$1('replaceCaret pr', pr);
	      if (M === '0') {
	        if (m === '0') {
	          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${m}.${+p + 1}-0`;
	        } else {
	          ret = `>=${M}.${m}.${p}-${pr
          } <${M}.${+m + 1}.0-0`;
	        }
	      } else {
	        ret = `>=${M}.${m}.${p}-${pr
        } <${+M + 1}.0.0-0`;
	      }
	    } else {
	      debug$1('no pr');
	      if (M === '0') {
	        if (m === '0') {
	          ret = `>=${M}.${m}.${p
          }${z} <${M}.${m}.${+p + 1}-0`;
	        } else {
	          ret = `>=${M}.${m}.${p
          }${z} <${M}.${+m + 1}.0-0`;
	        }
	      } else {
	        ret = `>=${M}.${m}.${p
        } <${+M + 1}.0.0-0`;
	      }
	    }

	    debug$1('caret return', ret);
	    return ret
	  })
	};

	const replaceXRanges = (comp, options) => {
	  debug$1('replaceXRanges', comp, options);
	  return comp.split(/\s+/).map((comp) => {
	    return replaceXRange(comp, options)
	  }).join(' ')
	};

	const replaceXRange = (comp, options) => {
	  comp = comp.trim();
	  const r = options.loose ? re$1[t$1.XRANGELOOSE] : re$1[t$1.XRANGE];
	  return comp.replace(r, (ret, gtlt, M, m, p, pr) => {
	    debug$1('xRange', comp, ret, gtlt, M, m, p, pr);
	    const xM = isX(M);
	    const xm = xM || isX(m);
	    const xp = xm || isX(p);
	    const anyX = xp;

	    if (gtlt === '=' && anyX) {
	      gtlt = '';
	    }

	    // if we're including prereleases in the match, then we need
	    // to fix this to -0, the lowest possible prerelease value
	    pr = options.includePrerelease ? '-0' : '';

	    if (xM) {
	      if (gtlt === '>' || gtlt === '<') {
	        // nothing is allowed
	        ret = '<0.0.0-0';
	      } else {
	        // nothing is forbidden
	        ret = '*';
	      }
	    } else if (gtlt && anyX) {
	      // we know patch is an x, because we have any x at all.
	      // replace X with 0
	      if (xm) {
	        m = 0;
	      }
	      p = 0;

	      if (gtlt === '>') {
	        // >1 => >=2.0.0
	        // >1.2 => >=1.3.0
	        gtlt = '>=';
	        if (xm) {
	          M = +M + 1;
	          m = 0;
	          p = 0;
	        } else {
	          m = +m + 1;
	          p = 0;
	        }
	      } else if (gtlt === '<=') {
	        // <=0.7.x is actually <0.8.0, since any 0.7.x should
	        // pass.  Similarly, <=7.x is actually <8.0.0, etc.
	        gtlt = '<';
	        if (xm) {
	          M = +M + 1;
	        } else {
	          m = +m + 1;
	        }
	      }

	      if (gtlt === '<')
	        pr = '-0';

	      ret = `${gtlt + M}.${m}.${p}${pr}`;
	    } else if (xm) {
	      ret = `>=${M}.0.0${pr} <${+M + 1}.0.0-0`;
	    } else if (xp) {
	      ret = `>=${M}.${m}.0${pr
      } <${M}.${+m + 1}.0-0`;
	    }

	    debug$1('xRange return', ret);

	    return ret
	  })
	};

	// Because * is AND-ed with everything else in the comparator,
	// and '' means "any version", just remove the *s entirely.
	const replaceStars = (comp, options) => {
	  debug$1('replaceStars', comp, options);
	  // Looseness is ignored here.  star is always as loose as it gets!
	  return comp.trim().replace(re$1[t$1.STAR], '')
	};

	const replaceGTE0 = (comp, options) => {
	  debug$1('replaceGTE0', comp, options);
	  return comp.trim()
	    .replace(re$1[options.includePrerelease ? t$1.GTE0PRE : t$1.GTE0], '')
	};

	// This function is passed to string.replace(re[t.HYPHENRANGE])
	// M, m, patch, prerelease, build
	// 1.2 - 3.4.5 => >=1.2.0 <=3.4.5
	// 1.2.3 - 3.4 => >=1.2.0 <3.5.0-0 Any 3.4.x will do
	// 1.2 - 3.4 => >=1.2.0 <3.5.0-0
	const hyphenReplace = incPr => ($0,
	  from, fM, fm, fp, fpr, fb,
	  to, tM, tm, tp, tpr, tb) => {
	  if (isX(fM)) {
	    from = '';
	  } else if (isX(fm)) {
	    from = `>=${fM}.0.0${incPr ? '-0' : ''}`;
	  } else if (isX(fp)) {
	    from = `>=${fM}.${fm}.0${incPr ? '-0' : ''}`;
	  } else if (fpr) {
	    from = `>=${from}`;
	  } else {
	    from = `>=${from}${incPr ? '-0' : ''}`;
	  }

	  if (isX(tM)) {
	    to = '';
	  } else if (isX(tm)) {
	    to = `<${+tM + 1}.0.0-0`;
	  } else if (isX(tp)) {
	    to = `<${tM}.${+tm + 1}.0-0`;
	  } else if (tpr) {
	    to = `<=${tM}.${tm}.${tp}-${tpr}`;
	  } else if (incPr) {
	    to = `<${tM}.${tm}.${+tp + 1}-0`;
	  } else {
	    to = `<=${to}`;
	  }

	  return (`${from} ${to}`).trim()
	};

	const testSet = (set, version, options) => {
	  for (let i = 0; i < set.length; i++) {
	    if (!set[i].test(version)) {
	      return false
	    }
	  }

	  if (version.prerelease.length && !options.includePrerelease) {
	    // Find the set of versions that are allowed to have prereleases
	    // For example, ^1.2.3-pr.1 desugars to >=1.2.3-pr.1 <2.0.0
	    // That should allow `1.2.3-pr.2` to pass.
	    // However, `1.2.4-alpha.notready` should NOT be allowed,
	    // even though it's within the range set by the comparators.
	    for (let i = 0; i < set.length; i++) {
	      debug$1(set[i].semver);
	      if (set[i].semver === Comparator$3.ANY) {
	        continue
	      }

	      if (set[i].semver.prerelease.length > 0) {
	        const allowed = set[i].semver;
	        if (allowed.major === version.major &&
	            allowed.minor === version.minor &&
	            allowed.patch === version.patch) {
	          return true
	        }
	      }
	    }

	    // Version has a -pre, but it's not one of the ones we like.
	    return false
	  }

	  return true
	};

	const ANY$2 = Symbol('SemVer ANY');
	// hoisted class for cyclic dependency
	class Comparator$2 {
	  static get ANY () {
	    return ANY$2
	  }
	  constructor (comp, options) {
	    options = parseOptions(options);

	    if (comp instanceof Comparator$2) {
	      if (comp.loose === !!options.loose) {
	        return comp
	      } else {
	        comp = comp.value;
	      }
	    }

	    debug('comparator', comp, options);
	    this.options = options;
	    this.loose = !!options.loose;
	    this.parse(comp);

	    if (this.semver === ANY$2) {
	      this.value = '';
	    } else {
	      this.value = this.operator + this.semver.version;
	    }

	    debug('comp', this);
	  }

	  parse (comp) {
	    const r = this.options.loose ? re[t.COMPARATORLOOSE] : re[t.COMPARATOR];
	    const m = comp.match(r);

	    if (!m) {
	      throw new TypeError(`Invalid comparator: ${comp}`)
	    }

	    this.operator = m[1] !== undefined ? m[1] : '';
	    if (this.operator === '=') {
	      this.operator = '';
	    }

	    // if it literally is just '>' or '' then allow anything.
	    if (!m[2]) {
	      this.semver = ANY$2;
	    } else {
	      this.semver = new SemVer$4(m[2], this.options.loose);
	    }
	  }

	  toString () {
	    return this.value
	  }

	  test (version) {
	    debug('Comparator.test', version, this.options.loose);

	    if (this.semver === ANY$2 || version === ANY$2) {
	      return true
	    }

	    if (typeof version === 'string') {
	      try {
	        version = new SemVer$4(version, this.options);
	      } catch (er) {
	        return false
	      }
	    }

	    return cmp(version, this.operator, this.semver, this.options)
	  }

	  intersects (comp, options) {
	    if (!(comp instanceof Comparator$2)) {
	      throw new TypeError('a Comparator is required')
	    }

	    if (!options || typeof options !== 'object') {
	      options = {
	        loose: !!options,
	        includePrerelease: false
	      };
	    }

	    if (this.operator === '') {
	      if (this.value === '') {
	        return true
	      }
	      return new Range$9(comp.value, options).test(this.value)
	    } else if (comp.operator === '') {
	      if (comp.value === '') {
	        return true
	      }
	      return new Range$9(this.value, options).test(comp.semver)
	    }

	    const sameDirectionIncreasing =
	      (this.operator === '>=' || this.operator === '>') &&
	      (comp.operator === '>=' || comp.operator === '>');
	    const sameDirectionDecreasing =
	      (this.operator === '<=' || this.operator === '<') &&
	      (comp.operator === '<=' || comp.operator === '<');
	    const sameSemVer = this.semver.version === comp.semver.version;
	    const differentDirectionsInclusive =
	      (this.operator === '>=' || this.operator === '<=') &&
	      (comp.operator === '>=' || comp.operator === '<=');
	    const oppositeDirectionsLessThan =
	      cmp(this.semver, '<', comp.semver, options) &&
	      (this.operator === '>=' || this.operator === '>') &&
	        (comp.operator === '<=' || comp.operator === '<');
	    const oppositeDirectionsGreaterThan =
	      cmp(this.semver, '>', comp.semver, options) &&
	      (this.operator === '<=' || this.operator === '<') &&
	        (comp.operator === '>=' || comp.operator === '>');

	    return (
	      sameDirectionIncreasing ||
	      sameDirectionDecreasing ||
	      (sameSemVer && differentDirectionsInclusive) ||
	      oppositeDirectionsLessThan ||
	      oppositeDirectionsGreaterThan
	    )
	  }
	}

	var comparator = Comparator$2;

	const parseOptions = parseOptions_1;
	const {re, t} = re$5.exports;
	const cmp = cmp_1;
	const debug = debug_1;
	const SemVer$4 = semver$1;
	const Range$9 = range;

	const Range$8 = range;
	const satisfies$3 = (version, range, options) => {
	  try {
	    range = new Range$8(range, options);
	  } catch (er) {
	    return false
	  }
	  return range.test(version)
	};
	var satisfies_1 = satisfies$3;

	const Range$7 = range;

	// Mostly just for testing and legacy API reasons
	const toComparators = (range, options) =>
	  new Range$7(range, options).set
	    .map(comp => comp.map(c => c.value).join(' ').trim().split(' '));

	var toComparators_1 = toComparators;

	const SemVer$3 = semver$1;
	const Range$6 = range;

	const maxSatisfying = (versions, range, options) => {
	  let max = null;
	  let maxSV = null;
	  let rangeObj = null;
	  try {
	    rangeObj = new Range$6(range, options);
	  } catch (er) {
	    return null
	  }
	  versions.forEach((v) => {
	    if (rangeObj.test(v)) {
	      // satisfies(v, range, options)
	      if (!max || maxSV.compare(v) === -1) {
	        // compare(max, v, true)
	        max = v;
	        maxSV = new SemVer$3(max, options);
	      }
	    }
	  });
	  return max
	};
	var maxSatisfying_1 = maxSatisfying;

	const SemVer$2 = semver$1;
	const Range$5 = range;
	const minSatisfying = (versions, range, options) => {
	  let min = null;
	  let minSV = null;
	  let rangeObj = null;
	  try {
	    rangeObj = new Range$5(range, options);
	  } catch (er) {
	    return null
	  }
	  versions.forEach((v) => {
	    if (rangeObj.test(v)) {
	      // satisfies(v, range, options)
	      if (!min || minSV.compare(v) === 1) {
	        // compare(min, v, true)
	        min = v;
	        minSV = new SemVer$2(min, options);
	      }
	    }
	  });
	  return min
	};
	var minSatisfying_1 = minSatisfying;

	const SemVer$1 = semver$1;
	const Range$4 = range;
	const gt$1 = gt_1;

	const minVersion = (range, loose) => {
	  range = new Range$4(range, loose);

	  let minver = new SemVer$1('0.0.0');
	  if (range.test(minver)) {
	    return minver
	  }

	  minver = new SemVer$1('0.0.0-0');
	  if (range.test(minver)) {
	    return minver
	  }

	  minver = null;
	  for (let i = 0; i < range.set.length; ++i) {
	    const comparators = range.set[i];

	    let setMin = null;
	    comparators.forEach((comparator) => {
	      // Clone to avoid manipulating the comparator's semver object.
	      const compver = new SemVer$1(comparator.semver.version);
	      switch (comparator.operator) {
	        case '>':
	          if (compver.prerelease.length === 0) {
	            compver.patch++;
	          } else {
	            compver.prerelease.push(0);
	          }
	          compver.raw = compver.format();
	          /* fallthrough */
	        case '':
	        case '>=':
	          if (!setMin || gt$1(compver, setMin)) {
	            setMin = compver;
	          }
	          break
	        case '<':
	        case '<=':
	          /* Ignore maximum versions */
	          break
	        /* istanbul ignore next */
	        default:
	          throw new Error(`Unexpected operation: ${comparator.operator}`)
	      }
	    });
	    if (setMin && (!minver || gt$1(minver, setMin)))
	      minver = setMin;
	  }

	  if (minver && range.test(minver)) {
	    return minver
	  }

	  return null
	};
	var minVersion_1 = minVersion;

	const Range$3 = range;
	const validRange = (range, options) => {
	  try {
	    // Return '*' instead of '' so that truthiness works.
	    // This will throw if it's invalid anyway
	    return new Range$3(range, options).range || '*'
	  } catch (er) {
	    return null
	  }
	};
	var valid = validRange;

	const SemVer = semver$1;
	const Comparator$1 = comparator;
	const {ANY: ANY$1} = Comparator$1;
	const Range$2 = range;
	const satisfies$2 = satisfies_1;
	const gt = gt_1;
	const lt = lt_1;
	const lte = lte_1;
	const gte = gte_1;

	const outside$2 = (version, range, hilo, options) => {
	  version = new SemVer(version, options);
	  range = new Range$2(range, options);

	  let gtfn, ltefn, ltfn, comp, ecomp;
	  switch (hilo) {
	    case '>':
	      gtfn = gt;
	      ltefn = lte;
	      ltfn = lt;
	      comp = '>';
	      ecomp = '>=';
	      break
	    case '<':
	      gtfn = lt;
	      ltefn = gte;
	      ltfn = gt;
	      comp = '<';
	      ecomp = '<=';
	      break
	    default:
	      throw new TypeError('Must provide a hilo val of "<" or ">"')
	  }

	  // If it satisfies the range it is not outside
	  if (satisfies$2(version, range, options)) {
	    return false
	  }

	  // From now on, variable terms are as if we're in "gtr" mode.
	  // but note that everything is flipped for the "ltr" function.

	  for (let i = 0; i < range.set.length; ++i) {
	    const comparators = range.set[i];

	    let high = null;
	    let low = null;

	    comparators.forEach((comparator) => {
	      if (comparator.semver === ANY$1) {
	        comparator = new Comparator$1('>=0.0.0');
	      }
	      high = high || comparator;
	      low = low || comparator;
	      if (gtfn(comparator.semver, high.semver, options)) {
	        high = comparator;
	      } else if (ltfn(comparator.semver, low.semver, options)) {
	        low = comparator;
	      }
	    });

	    // If the edge version comparator has a operator then our version
	    // isn't outside it
	    if (high.operator === comp || high.operator === ecomp) {
	      return false
	    }

	    // If the lowest version comparator has an operator and our version
	    // is less than it then it isn't higher than the range
	    if ((!low.operator || low.operator === comp) &&
	        ltefn(version, low.semver)) {
	      return false
	    } else if (low.operator === ecomp && ltfn(version, low.semver)) {
	      return false
	    }
	  }
	  return true
	};

	var outside_1 = outside$2;

	// Determine if version is greater than all the versions possible in the range.
	const outside$1 = outside_1;
	const gtr = (version, range, options) => outside$1(version, range, '>', options);
	var gtr_1 = gtr;

	const outside = outside_1;
	// Determine if version is less than all the versions possible in the range
	const ltr = (version, range, options) => outside(version, range, '<', options);
	var ltr_1 = ltr;

	const Range$1 = range;
	const intersects = (r1, r2, options) => {
	  r1 = new Range$1(r1, options);
	  r2 = new Range$1(r2, options);
	  return r1.intersects(r2)
	};
	var intersects_1 = intersects;

	// given a set of versions and a range, create a "simplified" range
	// that includes the same versions that the original range does
	// If the original range is shorter than the simplified one, return that.
	const satisfies$1 = satisfies_1;
	const compare$1 = compare_1;
	var simplify = (versions, range, options) => {
	  const set = [];
	  let min = null;
	  let prev = null;
	  const v = versions.sort((a, b) => compare$1(a, b, options));
	  for (const version of v) {
	    const included = satisfies$1(version, range, options);
	    if (included) {
	      prev = version;
	      if (!min)
	        min = version;
	    } else {
	      if (prev) {
	        set.push([min, prev]);
	      }
	      prev = null;
	      min = null;
	    }
	  }
	  if (min)
	    set.push([min, null]);

	  const ranges = [];
	  for (const [min, max] of set) {
	    if (min === max)
	      ranges.push(min);
	    else if (!max && min === v[0])
	      ranges.push('*');
	    else if (!max)
	      ranges.push(`>=${min}`);
	    else if (min === v[0])
	      ranges.push(`<=${max}`);
	    else
	      ranges.push(`${min} - ${max}`);
	  }
	  const simplified = ranges.join(' || ');
	  const original = typeof range.raw === 'string' ? range.raw : String(range);
	  return simplified.length < original.length ? simplified : range
	};

	const Range = range;
	const Comparator = comparator;
	const { ANY } = Comparator;
	const satisfies = satisfies_1;
	const compare = compare_1;

	// Complex range `r1 || r2 || ...` is a subset of `R1 || R2 || ...` iff:
	// - Every simple range `r1, r2, ...` is a null set, OR
	// - Every simple range `r1, r2, ...` which is not a null set is a subset of
	//   some `R1, R2, ...`
	//
	// Simple range `c1 c2 ...` is a subset of simple range `C1 C2 ...` iff:
	// - If c is only the ANY comparator
	//   - If C is only the ANY comparator, return true
	//   - Else if in prerelease mode, return false
	//   - else replace c with `[>=0.0.0]`
	// - If C is only the ANY comparator
	//   - if in prerelease mode, return true
	//   - else replace C with `[>=0.0.0]`
	// - Let EQ be the set of = comparators in c
	// - If EQ is more than one, return true (null set)
	// - Let GT be the highest > or >= comparator in c
	// - Let LT be the lowest < or <= comparator in c
	// - If GT and LT, and GT.semver > LT.semver, return true (null set)
	// - If any C is a = range, and GT or LT are set, return false
	// - If EQ
	//   - If GT, and EQ does not satisfy GT, return true (null set)
	//   - If LT, and EQ does not satisfy LT, return true (null set)
	//   - If EQ satisfies every C, return true
	//   - Else return false
	// - If GT
	//   - If GT.semver is lower than any > or >= comp in C, return false
	//   - If GT is >=, and GT.semver does not satisfy every C, return false
	//   - If GT.semver has a prerelease, and not in prerelease mode
	//     - If no C has a prerelease and the GT.semver tuple, return false
	// - If LT
	//   - If LT.semver is greater than any < or <= comp in C, return false
	//   - If LT is <=, and LT.semver does not satisfy every C, return false
	//   - If GT.semver has a prerelease, and not in prerelease mode
	//     - If no C has a prerelease and the LT.semver tuple, return false
	// - Else return true

	const subset = (sub, dom, options = {}) => {
	  if (sub === dom)
	    return true

	  sub = new Range(sub, options);
	  dom = new Range(dom, options);
	  let sawNonNull = false;

	  OUTER: for (const simpleSub of sub.set) {
	    for (const simpleDom of dom.set) {
	      const isSub = simpleSubset(simpleSub, simpleDom, options);
	      sawNonNull = sawNonNull || isSub !== null;
	      if (isSub)
	        continue OUTER
	    }
	    // the null set is a subset of everything, but null simple ranges in
	    // a complex range should be ignored.  so if we saw a non-null range,
	    // then we know this isn't a subset, but if EVERY simple range was null,
	    // then it is a subset.
	    if (sawNonNull)
	      return false
	  }
	  return true
	};

	const simpleSubset = (sub, dom, options) => {
	  if (sub === dom)
	    return true

	  if (sub.length === 1 && sub[0].semver === ANY) {
	    if (dom.length === 1 && dom[0].semver === ANY)
	      return true
	    else if (options.includePrerelease)
	      sub = [ new Comparator('>=0.0.0-0') ];
	    else
	      sub = [ new Comparator('>=0.0.0') ];
	  }

	  if (dom.length === 1 && dom[0].semver === ANY) {
	    if (options.includePrerelease)
	      return true
	    else
	      dom = [ new Comparator('>=0.0.0') ];
	  }

	  const eqSet = new Set();
	  let gt, lt;
	  for (const c of sub) {
	    if (c.operator === '>' || c.operator === '>=')
	      gt = higherGT(gt, c, options);
	    else if (c.operator === '<' || c.operator === '<=')
	      lt = lowerLT(lt, c, options);
	    else
	      eqSet.add(c.semver);
	  }

	  if (eqSet.size > 1)
	    return null

	  let gtltComp;
	  if (gt && lt) {
	    gtltComp = compare(gt.semver, lt.semver, options);
	    if (gtltComp > 0)
	      return null
	    else if (gtltComp === 0 && (gt.operator !== '>=' || lt.operator !== '<='))
	      return null
	  }

	  // will iterate one or zero times
	  for (const eq of eqSet) {
	    if (gt && !satisfies(eq, String(gt), options))
	      return null

	    if (lt && !satisfies(eq, String(lt), options))
	      return null

	    for (const c of dom) {
	      if (!satisfies(eq, String(c), options))
	        return false
	    }

	    return true
	  }

	  let higher, lower;
	  let hasDomLT, hasDomGT;
	  // if the subset has a prerelease, we need a comparator in the superset
	  // with the same tuple and a prerelease, or it's not a subset
	  let needDomLTPre = lt &&
	    !options.includePrerelease &&
	    lt.semver.prerelease.length ? lt.semver : false;
	  let needDomGTPre = gt &&
	    !options.includePrerelease &&
	    gt.semver.prerelease.length ? gt.semver : false;
	  // exception: <1.2.3-0 is the same as <1.2.3
	  if (needDomLTPre && needDomLTPre.prerelease.length === 1 &&
	      lt.operator === '<' && needDomLTPre.prerelease[0] === 0) {
	    needDomLTPre = false;
	  }

	  for (const c of dom) {
	    hasDomGT = hasDomGT || c.operator === '>' || c.operator === '>=';
	    hasDomLT = hasDomLT || c.operator === '<' || c.operator === '<=';
	    if (gt) {
	      if (needDomGTPre) {
	        if (c.semver.prerelease && c.semver.prerelease.length &&
	            c.semver.major === needDomGTPre.major &&
	            c.semver.minor === needDomGTPre.minor &&
	            c.semver.patch === needDomGTPre.patch) {
	          needDomGTPre = false;
	        }
	      }
	      if (c.operator === '>' || c.operator === '>=') {
	        higher = higherGT(gt, c, options);
	        if (higher === c && higher !== gt)
	          return false
	      } else if (gt.operator === '>=' && !satisfies(gt.semver, String(c), options))
	        return false
	    }
	    if (lt) {
	      if (needDomLTPre) {
	        if (c.semver.prerelease && c.semver.prerelease.length &&
	            c.semver.major === needDomLTPre.major &&
	            c.semver.minor === needDomLTPre.minor &&
	            c.semver.patch === needDomLTPre.patch) {
	          needDomLTPre = false;
	        }
	      }
	      if (c.operator === '<' || c.operator === '<=') {
	        lower = lowerLT(lt, c, options);
	        if (lower === c && lower !== lt)
	          return false
	      } else if (lt.operator === '<=' && !satisfies(lt.semver, String(c), options))
	        return false
	    }
	    if (!c.operator && (lt || gt) && gtltComp !== 0)
	      return false
	  }

	  // if there was a < or >, and nothing in the dom, then must be false
	  // UNLESS it was limited by another range in the other direction.
	  // Eg, >1.0.0 <1.0.1 is still a subset of <2.0.0
	  if (gt && hasDomLT && !lt && gtltComp !== 0)
	    return false

	  if (lt && hasDomGT && !gt && gtltComp !== 0)
	    return false

	  // we needed a prerelease range in a specific tuple, but didn't get one
	  // then this isn't a subset.  eg >=1.2.3-pre is not a subset of >=1.0.0,
	  // because it includes prereleases in the 1.2.3 tuple
	  if (needDomGTPre || needDomLTPre)
	    return false

	  return true
	};

	// >=1.2.3 is lower than >1.2.3
	const higherGT = (a, b, options) => {
	  if (!a)
	    return b
	  const comp = compare(a.semver, b.semver, options);
	  return comp > 0 ? a
	    : comp < 0 ? b
	    : b.operator === '>' && a.operator === '>=' ? b
	    : a
	};

	// <=1.2.3 is higher than <1.2.3
	const lowerLT = (a, b, options) => {
	  if (!a)
	    return b
	  const comp = compare(a.semver, b.semver, options);
	  return comp < 0 ? a
	    : comp > 0 ? b
	    : b.operator === '<' && a.operator === '<=' ? b
	    : a
	};

	var subset_1 = subset;

	// just pre-load all the stuff that index.js lazily exports
	const internalRe = re$5.exports;
	var semver = {
	  re: internalRe.re,
	  src: internalRe.src,
	  tokens: internalRe.t,
	  SEMVER_SPEC_VERSION: constants.SEMVER_SPEC_VERSION,
	  SemVer: semver$1,
	  compareIdentifiers: identifiers.compareIdentifiers,
	  rcompareIdentifiers: identifiers.rcompareIdentifiers,
	  parse: parse_1,
	  valid: valid_1,
	  clean: clean_1,
	  inc: inc_1,
	  diff: diff_1,
	  major: major_1,
	  minor: minor_1,
	  patch: patch_1,
	  prerelease: prerelease_1,
	  compare: compare_1,
	  rcompare: rcompare_1,
	  compareLoose: compareLoose_1,
	  compareBuild: compareBuild_1,
	  sort: sort_1,
	  rsort: rsort_1,
	  gt: gt_1,
	  lt: lt_1,
	  eq: eq_1,
	  neq: neq_1,
	  gte: gte_1,
	  lte: lte_1,
	  cmp: cmp_1,
	  coerce: coerce_1,
	  Comparator: comparator,
	  Range: range,
	  satisfies: satisfies_1,
	  toComparators: toComparators_1,
	  maxSatisfying: maxSatisfying_1,
	  minSatisfying: minSatisfying_1,
	  minVersion: minVersion_1,
	  validRange: valid,
	  outside: outside_1,
	  gtr: gtr_1,
	  ltr: ltr_1,
	  intersects: intersects_1,
	  simplifyRange: simplify,
	  subset: subset_1,
	};

	function shouldUseTrustedInputForSegwit(_a) {
	    var version = _a.version, name = _a.name;
	    if (name === "Decred")
	        return false;
	    if (name === "Exchange")
	        return true;
	    return semver.gte(version, "1.4.0");
	}

	var __assign$3 = (undefined && undefined.__assign) || function () {
	    __assign$3 = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign$3.apply(this, arguments);
	};
	var __awaiter$4 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator$4 = (undefined && undefined.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	var __values$3 = (undefined && undefined.__values) || function(o) {
	    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	    if (m) return m.call(o);
	    if (o && typeof o.length === "number") return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	var defaultsSignTransaction = {
	    lockTime: DEFAULT_LOCKTIME,
	    sigHashType: SIGHASH_ALL,
	    segwit: false,
	    additionals: [],
	    onDeviceStreaming: function (_e) { },
	    onDeviceSignatureGranted: function () { },
	    onDeviceSignatureRequested: function () { }
	};
	function createTransaction(transport, arg) {
	    return __awaiter$4(this, void 0, void 0, function () {
	        var signTx, inputs, associatedKeysets, changePath, outputScriptHex, lockTime, sigHashType, segwit, initialTimestamp, additionals, expiryHeight, onDeviceStreaming, onDeviceSignatureGranted, onDeviceSignatureRequested, useTrustedInputForSegwit, a, e_1, notify, isDecred, isXST, startTime, sapling, bech32, useBip143, nullScript, nullPrevout, defaultVersion, trustedInputs, regularOutputs, signatures, publicKeys, firstRun, resuming, targetTransaction, getTrustedInputCall, outputScript, inputs_1, inputs_1_1, input, trustedInput, sequence, outputs, index, e_2_1, result_1, i, r, i, i, input, script, pseudoTX, pseudoTrustedInputs, signature, i, signatureSize, keySize, offset, lockTimeBuffer, result, witness, i, tmpScriptData, decredWitness_1;
	        var e_2, _a;
	        return __generator$4(this, function (_b) {
	            switch (_b.label) {
	                case 0:
	                    signTx = __assign$3(__assign$3({}, defaultsSignTransaction), arg);
	                    inputs = signTx.inputs, associatedKeysets = signTx.associatedKeysets, changePath = signTx.changePath, outputScriptHex = signTx.outputScriptHex, lockTime = signTx.lockTime, sigHashType = signTx.sigHashType, segwit = signTx.segwit, initialTimestamp = signTx.initialTimestamp, additionals = signTx.additionals, expiryHeight = signTx.expiryHeight, onDeviceStreaming = signTx.onDeviceStreaming, onDeviceSignatureGranted = signTx.onDeviceSignatureGranted, onDeviceSignatureRequested = signTx.onDeviceSignatureRequested;
	                    useTrustedInputForSegwit = signTx.useTrustedInputForSegwit;
	                    if (!(useTrustedInputForSegwit === undefined)) return [3 /*break*/, 4];
	                    _b.label = 1;
	                case 1:
	                    _b.trys.push([1, 3, , 4]);
	                    return [4 /*yield*/, getAppAndVersion(transport)];
	                case 2:
	                    a = _b.sent();
	                    useTrustedInputForSegwit = shouldUseTrustedInputForSegwit(a);
	                    return [3 /*break*/, 4];
	                case 3:
	                    e_1 = _b.sent();
	                    if (e_1.statusCode === 0x6d00) {
	                        useTrustedInputForSegwit = false;
	                    }
	                    else {
	                        throw e_1;
	                    }
	                    return [3 /*break*/, 4];
	                case 4:
	                    notify = function (loop, i) {
	                        var length = inputs.length;
	                        if (length < 3)
	                            return; // there is not enough significant event to worth notifying (aka just use a spinner)
	                        var index = length * loop + i;
	                        var total = 2 * length;
	                        var progress = index / total;
	                        onDeviceStreaming({
	                            progress: progress,
	                            total: total,
	                            index: index
	                        });
	                    };
	                    isDecred = additionals.includes("decred");
	                    isXST = additionals.includes("stealthcoin");
	                    startTime = Date.now();
	                    sapling = additionals.includes("sapling");
	                    bech32 = segwit && additionals.includes("bech32");
	                    useBip143 = segwit ||
	                        (!!additionals &&
	                            (additionals.includes("abc") ||
	                                additionals.includes("gold") ||
	                                additionals.includes("bip143"))) ||
	                        (!!expiryHeight && !isDecred);
	                    nullScript = Buffer$e.alloc(0);
	                    nullPrevout = Buffer$e.alloc(0);
	                    defaultVersion = Buffer$e.alloc(4);
	                    !!expiryHeight && !isDecred
	                        ? defaultVersion.writeUInt32LE(sapling ? 0x80000004 : 0x80000003, 0)
	                        : isXST
	                            ? defaultVersion.writeUInt32LE(2, 0)
	                            : defaultVersion.writeUInt32LE(1, 0);
	                    trustedInputs = [];
	                    regularOutputs = [];
	                    signatures = [];
	                    publicKeys = [];
	                    firstRun = true;
	                    resuming = false;
	                    targetTransaction = {
	                        inputs: [],
	                        version: defaultVersion,
	                        timestamp: Buffer$e.alloc(0)
	                    };
	                    getTrustedInputCall = useBip143 && !useTrustedInputForSegwit
	                        ? getTrustedInputBIP143
	                        : getTrustedInput;
	                    outputScript = Buffer$e.from(outputScriptHex, "hex");
	                    notify(0, 0);
	                    _b.label = 5;
	                case 5:
	                    _b.trys.push([5, 11, 12, 13]);
	                    inputs_1 = __values$3(inputs), inputs_1_1 = inputs_1.next();
	                    _b.label = 6;
	                case 6:
	                    if (!!inputs_1_1.done) return [3 /*break*/, 10];
	                    input = inputs_1_1.value;
	                    if (!!resuming) return [3 /*break*/, 8];
	                    return [4 /*yield*/, getTrustedInputCall(transport, input[1], input[0], additionals)];
	                case 7:
	                    trustedInput = _b.sent();
	                    log("hw", "got trustedInput=" + trustedInput);
	                    sequence = Buffer$e.alloc(4);
	                    sequence.writeUInt32LE(input.length >= 4 && typeof input[3] === "number"
	                        ? input[3]
	                        : DEFAULT_SEQUENCE, 0);
	                    trustedInputs.push({
	                        trustedInput: true,
	                        value: Buffer$e.from(trustedInput, "hex"),
	                        sequence: sequence
	                    });
	                    _b.label = 8;
	                case 8:
	                    outputs = input[0].outputs;
	                    index = input[1];
	                    if (outputs && index <= outputs.length - 1) {
	                        regularOutputs.push(outputs[index]);
	                    }
	                    if (expiryHeight && !isDecred) {
	                        targetTransaction.nVersionGroupId = Buffer$e.from(sapling ? [0x85, 0x20, 0x2f, 0x89] : [0x70, 0x82, 0xc4, 0x03]);
	                        targetTransaction.nExpiryHeight = expiryHeight;
	                        // For sapling : valueBalance (8), nShieldedSpend (1), nShieldedOutput (1), nJoinSplit (1)
	                        // Overwinter : use nJoinSplit (1)
	                        targetTransaction.extraData = Buffer$e.from(sapling
	                            ? [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]
	                            : [0x00]);
	                    }
	                    else if (isDecred) {
	                        targetTransaction.nExpiryHeight = expiryHeight;
	                    }
	                    _b.label = 9;
	                case 9:
	                    inputs_1_1 = inputs_1.next();
	                    return [3 /*break*/, 6];
	                case 10: return [3 /*break*/, 13];
	                case 11:
	                    e_2_1 = _b.sent();
	                    e_2 = { error: e_2_1 };
	                    return [3 /*break*/, 13];
	                case 12:
	                    try {
	                        if (inputs_1_1 && !inputs_1_1.done && (_a = inputs_1["return"])) _a.call(inputs_1);
	                    }
	                    finally { if (e_2) throw e_2.error; }
	                    return [7 /*endfinally*/];
	                case 13:
	                    targetTransaction.inputs = inputs.map(function (input) {
	                        var sequence = Buffer$e.alloc(4);
	                        sequence.writeUInt32LE(input.length >= 4 && typeof input[3] === "number"
	                            ? input[3]
	                            : DEFAULT_SEQUENCE, 0);
	                        return {
	                            script: nullScript,
	                            prevout: nullPrevout,
	                            sequence: sequence
	                        };
	                    });
	                    if (!!resuming) return [3 /*break*/, 18];
	                    result_1 = [];
	                    i = 0;
	                    _b.label = 14;
	                case 14:
	                    if (!(i < inputs.length)) return [3 /*break*/, 17];
	                    return [4 /*yield*/, getWalletPublicKey(transport, {
	                            path: associatedKeysets[i]
	                        })];
	                case 15:
	                    r = _b.sent();
	                    notify(0, i + 1);
	                    result_1.push(r);
	                    _b.label = 16;
	                case 16:
	                    i++;
	                    return [3 /*break*/, 14];
	                case 17:
	                    for (i = 0; i < result_1.length; i++) {
	                        publicKeys.push(compressPublicKey(Buffer$e.from(result_1[i].publicKey, "hex")));
	                    }
	                    _b.label = 18;
	                case 18:
	                    if (initialTimestamp !== undefined) {
	                        targetTransaction.timestamp = Buffer$e.alloc(4);
	                        targetTransaction.timestamp.writeUInt32LE(Math.floor(initialTimestamp + (Date.now() - startTime) / 1000), 0);
	                    }
	                    onDeviceSignatureRequested();
	                    if (!useBip143) return [3 /*break*/, 23];
	                    // Do the first run with all inputs
	                    return [4 /*yield*/, startUntrustedHashTransactionInput(transport, true, targetTransaction, trustedInputs, true, !!expiryHeight, additionals, useTrustedInputForSegwit)];
	                case 19:
	                    // Do the first run with all inputs
	                    _b.sent();
	                    if (!(!resuming && changePath)) return [3 /*break*/, 21];
	                    return [4 /*yield*/, provideOutputFullChangePath(transport, changePath)];
	                case 20:
	                    _b.sent();
	                    _b.label = 21;
	                case 21: return [4 /*yield*/, hashOutputFull(transport, outputScript)];
	                case 22:
	                    _b.sent();
	                    _b.label = 23;
	                case 23:
	                    if (!(!!expiryHeight && !isDecred)) return [3 /*break*/, 25];
	                    return [4 /*yield*/, signTransaction(transport, "", lockTime, SIGHASH_ALL, expiryHeight)];
	                case 24:
	                    _b.sent();
	                    _b.label = 25;
	                case 25:
	                    i = 0;
	                    _b.label = 26;
	                case 26:
	                    if (!(i < inputs.length)) return [3 /*break*/, 34];
	                    input = inputs[i];
	                    script = inputs[i].length >= 3 && typeof input[2] === "string"
	                        ? Buffer$e.from(input[2], "hex")
	                        : !segwit
	                            ? regularOutputs[i].script
	                            : Buffer$e.concat([
	                                Buffer$e.from([OP_DUP, OP_HASH160, HASH_SIZE]),
	                                hashPublicKey(publicKeys[i]),
	                                Buffer$e.from([OP_EQUALVERIFY, OP_CHECKSIG]),
	                            ]);
	                    pseudoTX = Object.assign({}, targetTransaction);
	                    pseudoTrustedInputs = useBip143 ? [trustedInputs[i]] : trustedInputs;
	                    if (useBip143) {
	                        pseudoTX.inputs = [__assign$3(__assign$3({}, pseudoTX.inputs[i]), { script: script })];
	                    }
	                    else {
	                        pseudoTX.inputs[i].script = script;
	                    }
	                    return [4 /*yield*/, startUntrustedHashTransactionInput(transport, !useBip143 && firstRun, pseudoTX, pseudoTrustedInputs, useBip143, !!expiryHeight && !isDecred, additionals, useTrustedInputForSegwit)];
	                case 27:
	                    _b.sent();
	                    if (!!useBip143) return [3 /*break*/, 31];
	                    if (!(!resuming && changePath)) return [3 /*break*/, 29];
	                    return [4 /*yield*/, provideOutputFullChangePath(transport, changePath)];
	                case 28:
	                    _b.sent();
	                    _b.label = 29;
	                case 29: return [4 /*yield*/, hashOutputFull(transport, outputScript, additionals)];
	                case 30:
	                    _b.sent();
	                    _b.label = 31;
	                case 31:
	                    if (firstRun) {
	                        onDeviceSignatureGranted();
	                        notify(1, 0);
	                    }
	                    return [4 /*yield*/, signTransaction(transport, associatedKeysets[i], lockTime, sigHashType, expiryHeight, additionals)];
	                case 32:
	                    signature = _b.sent();
	                    notify(1, i + 1);
	                    signatures.push(signature);
	                    targetTransaction.inputs[i].script = nullScript;
	                    if (firstRun) {
	                        firstRun = false;
	                    }
	                    _b.label = 33;
	                case 33:
	                    i++;
	                    return [3 /*break*/, 26];
	                case 34:
	                    // Populate the final input scripts
	                    for (i = 0; i < inputs.length; i++) {
	                        if (segwit) {
	                            targetTransaction.witness = Buffer$e.alloc(0);
	                            if (!bech32) {
	                                targetTransaction.inputs[i].script = Buffer$e.concat([
	                                    Buffer$e.from("160014", "hex"),
	                                    hashPublicKey(publicKeys[i]),
	                                ]);
	                            }
	                        }
	                        else {
	                            signatureSize = Buffer$e.alloc(1);
	                            keySize = Buffer$e.alloc(1);
	                            signatureSize[0] = signatures[i].length;
	                            keySize[0] = publicKeys[i].length;
	                            targetTransaction.inputs[i].script = Buffer$e.concat([
	                                signatureSize,
	                                signatures[i],
	                                keySize,
	                                publicKeys[i],
	                            ]);
	                        }
	                        offset = useBip143 && !useTrustedInputForSegwit ? 0 : 4;
	                        targetTransaction.inputs[i].prevout = trustedInputs[i].value.slice(offset, offset + 0x24);
	                    }
	                    lockTimeBuffer = Buffer$e.alloc(4);
	                    lockTimeBuffer.writeUInt32LE(lockTime, 0);
	                    result = Buffer$e.concat([
	                        serializeTransaction(targetTransaction, false, targetTransaction.timestamp, additionals),
	                        outputScript,
	                    ]);
	                    if (segwit && !isDecred) {
	                        witness = Buffer$e.alloc(0);
	                        for (i = 0; i < inputs.length; i++) {
	                            tmpScriptData = Buffer$e.concat([
	                                Buffer$e.from("02", "hex"),
	                                Buffer$e.from([signatures[i].length]),
	                                signatures[i],
	                                Buffer$e.from([publicKeys[i].length]),
	                                publicKeys[i],
	                            ]);
	                            witness = Buffer$e.concat([witness, tmpScriptData]);
	                        }
	                        result = Buffer$e.concat([result, witness]);
	                    }
	                    // FIXME: In ZEC or KMD sapling lockTime is serialized before expiryHeight.
	                    // expiryHeight is used only in overwinter/sapling so I moved lockTimeBuffer here
	                    // and it should not break other coins because expiryHeight is false for them.
	                    // Don't know about Decred though.
	                    result = Buffer$e.concat([result, lockTimeBuffer]);
	                    if (expiryHeight) {
	                        result = Buffer$e.concat([
	                            result,
	                            targetTransaction.nExpiryHeight || Buffer$e.alloc(0),
	                            targetTransaction.extraData || Buffer$e.alloc(0),
	                        ]);
	                    }
	                    if (isDecred) {
	                        decredWitness_1 = Buffer$e.from([targetTransaction.inputs.length]);
	                        inputs.forEach(function (input, inputIndex) {
	                            decredWitness_1 = Buffer$e.concat([
	                                decredWitness_1,
	                                Buffer$e.from([0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00]),
	                                Buffer$e.from([0x00, 0x00, 0x00, 0x00]),
	                                Buffer$e.from([0xff, 0xff, 0xff, 0xff]),
	                                Buffer$e.from([targetTransaction.inputs[inputIndex].script.length]),
	                                targetTransaction.inputs[inputIndex].script,
	                            ]);
	                        });
	                        result = Buffer$e.concat([result, decredWitness_1]);
	                    }
	                    return [2 /*return*/, result.toString("hex")];
	            }
	        });
	    });
	}

	var __assign$2 = (undefined && undefined.__assign) || function () {
	    __assign$2 = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign$2.apply(this, arguments);
	};
	var __awaiter$3 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator$3 = (undefined && undefined.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	var __values$2 = (undefined && undefined.__values) || function(o) {
	    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	    if (m) return m.call(o);
	    if (o && typeof o.length === "number") return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	var defaultArg = {
	    lockTime: DEFAULT_LOCKTIME,
	    sigHashType: SIGHASH_ALL,
	    segwit: false,
	    transactionVersion: DEFAULT_VERSION
	};
	function signP2SHTransaction(transport, arg) {
	    return __awaiter$3(this, void 0, void 0, function () {
	        var _a, inputs, associatedKeysets, outputScriptHex, lockTime, sigHashType, segwit, transactionVersion, initialTimestamp, nullScript, nullPrevout, defaultVersion, trustedInputs, regularOutputs, signatures, firstRun, resuming, startTime, targetTransaction, getTrustedInputCall, outputScript, inputs_1, inputs_1_1, input, trustedInput, sequence, outputs, index, e_1_1, i, sequence, i, input, script, pseudoTX, pseudoTrustedInputs, signature;
	        var e_1, _b;
	        return __generator$3(this, function (_c) {
	            switch (_c.label) {
	                case 0:
	                    _a = __assign$2(__assign$2({}, defaultArg), arg), inputs = _a.inputs, associatedKeysets = _a.associatedKeysets, outputScriptHex = _a.outputScriptHex, lockTime = _a.lockTime, sigHashType = _a.sigHashType, segwit = _a.segwit, transactionVersion = _a.transactionVersion, initialTimestamp = _a.initialTimestamp;
	                    nullScript = Buffer$e.alloc(0);
	                    nullPrevout = Buffer$e.alloc(0);
	                    defaultVersion = Buffer$e.alloc(4);
	                    defaultVersion.writeUInt32LE(transactionVersion, 0);
	                    trustedInputs = [];
	                    regularOutputs = [];
	                    signatures = [];
	                    firstRun = true;
	                    resuming = false;
	                    startTime = Date.now();
	                    targetTransaction = {
	                        inputs: [],
	                        timestamp: Buffer$e.alloc(0),
	                        version: defaultVersion
	                    };
	                    getTrustedInputCall = segwit ? getTrustedInputBIP143 : getTrustedInput;
	                    outputScript = Buffer$e.from(outputScriptHex, "hex");
	                    _c.label = 1;
	                case 1:
	                    _c.trys.push([1, 7, 8, 9]);
	                    inputs_1 = __values$2(inputs), inputs_1_1 = inputs_1.next();
	                    _c.label = 2;
	                case 2:
	                    if (!!inputs_1_1.done) return [3 /*break*/, 6];
	                    input = inputs_1_1.value;
	                    if (!!resuming) return [3 /*break*/, 4];
	                    return [4 /*yield*/, getTrustedInputCall(transport, input[1], input[0])];
	                case 3:
	                    trustedInput = _c.sent();
	                    sequence = Buffer$e.alloc(4);
	                    sequence.writeUInt32LE(input.length >= 4 && typeof input[3] === "number"
	                        ? input[3]
	                        : DEFAULT_SEQUENCE, 0);
	                    trustedInputs.push({
	                        trustedInput: false,
	                        value: segwit
	                            ? Buffer$e.from(trustedInput, "hex")
	                            : Buffer$e.from(trustedInput, "hex").slice(4, 4 + 0x24),
	                        sequence: sequence
	                    });
	                    _c.label = 4;
	                case 4:
	                    outputs = input[0].outputs;
	                    index = input[1];
	                    if (outputs && index <= outputs.length - 1) {
	                        regularOutputs.push(outputs[index]);
	                    }
	                    _c.label = 5;
	                case 5:
	                    inputs_1_1 = inputs_1.next();
	                    return [3 /*break*/, 2];
	                case 6: return [3 /*break*/, 9];
	                case 7:
	                    e_1_1 = _c.sent();
	                    e_1 = { error: e_1_1 };
	                    return [3 /*break*/, 9];
	                case 8:
	                    try {
	                        if (inputs_1_1 && !inputs_1_1.done && (_b = inputs_1["return"])) _b.call(inputs_1);
	                    }
	                    finally { if (e_1) throw e_1.error; }
	                    return [7 /*endfinally*/];
	                case 9:
	                    // Pre-build the target transaction
	                    for (i = 0; i < inputs.length; i++) {
	                        sequence = Buffer$e.alloc(4);
	                        sequence.writeUInt32LE(inputs[i].length >= 4 && typeof inputs[i][3] === "number"
	                            ? inputs[i][3]
	                            : DEFAULT_SEQUENCE, 0);
	                        targetTransaction.inputs.push({
	                            script: nullScript,
	                            prevout: nullPrevout,
	                            sequence: sequence
	                        });
	                    }
	                    if (!segwit) return [3 /*break*/, 12];
	                    return [4 /*yield*/, startUntrustedHashTransactionInput(transport, true, targetTransaction, trustedInputs, true)];
	                case 10:
	                    _c.sent();
	                    return [4 /*yield*/, hashOutputFull(transport, outputScript)];
	                case 11:
	                    _c.sent();
	                    _c.label = 12;
	                case 12:
	                    i = 0;
	                    _c.label = 13;
	                case 13:
	                    if (!(i < inputs.length)) return [3 /*break*/, 19];
	                    input = inputs[i];
	                    script = inputs[i].length >= 3 && typeof input[2] === "string"
	                        ? Buffer$e.from(input[2], "hex")
	                        : regularOutputs[i].script;
	                    pseudoTX = Object.assign({}, targetTransaction);
	                    pseudoTrustedInputs = segwit ? [trustedInputs[i]] : trustedInputs;
	                    if (initialTimestamp !== undefined) {
	                        pseudoTX.timestamp = Buffer$e.alloc(4);
	                        pseudoTX.timestamp.writeUInt32LE(Math.floor(initialTimestamp + (Date.now() - startTime) / 1000), 0);
	                    }
	                    if (segwit) {
	                        pseudoTX.inputs = [__assign$2(__assign$2({}, pseudoTX.inputs[i]), { script: script })];
	                    }
	                    else {
	                        pseudoTX.inputs[i].script = script;
	                    }
	                    return [4 /*yield*/, startUntrustedHashTransactionInput(transport, firstRun, pseudoTX, pseudoTrustedInputs, segwit)];
	                case 14:
	                    _c.sent();
	                    if (!!segwit) return [3 /*break*/, 16];
	                    return [4 /*yield*/, hashOutputFull(transport, outputScript)];
	                case 15:
	                    _c.sent();
	                    _c.label = 16;
	                case 16: return [4 /*yield*/, signTransaction(transport, associatedKeysets[i], lockTime, sigHashType)];
	                case 17:
	                    signature = _c.sent();
	                    signatures.push(segwit
	                        ? signature.toString("hex")
	                        : signature.slice(0, signature.length - 1).toString("hex"));
	                    targetTransaction.inputs[i].script = nullScript;
	                    if (firstRun) {
	                        firstRun = false;
	                    }
	                    _c.label = 18;
	                case 18:
	                    i++;
	                    return [3 /*break*/, 13];
	                case 19: return [2 /*return*/, signatures];
	            }
	        });
	    });
	}

	var __assign$1 = (undefined && undefined.__assign) || function () {
	    __assign$1 = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign$1.apply(this, arguments);
	};
	/**
	 * Bitcoin API.
	 *
	 * @example
	 * import Btc from "@ledgerhq/hw-app-btc";
	 * const btc = new Btc(transport)
	 */
	var Btc = /** @class */ (function () {
	    function Btc(transport, scrambleKey) {
	        if (scrambleKey === void 0) { scrambleKey = "BTC"; }
	        this.transport = transport;
	        transport.decorateAppAPIMethods(this, [
	            "getWalletPublicKey",
	            "signP2SHTransaction",
	            "signMessageNew",
	            "createPaymentTransactionNew",
	            "getTrustedInput",
	            "getTrustedInputBIP143",
	        ], scrambleKey);
	    }
	    /**
	     * @param path a BIP 32 path
	     * @param options an object with optional these fields:
	     *
	     * - verify (boolean) will ask user to confirm the address on the device
	     *
	     * - format ("legacy" | "p2sh" | "bech32" | "cashaddr") to use different bitcoin address formatter.
	     *
	     * NB The normal usage is to use:
	     *
	     * - legacy format with 44' paths
	     *
	     * - p2sh format with 49' paths
	     *
	     * - bech32 format with 173' paths
	     *
	     * - cashaddr in case of Bitcoin Cash
	     *
	     * @example
	     * btc.getWalletPublicKey("44'/0'/0'/0/0").then(o => o.bitcoinAddress)
	     * btc.getWalletPublicKey("49'/0'/0'/0/0", { format: "p2sh" }).then(o => o.bitcoinAddress)
	     */
	    Btc.prototype.getWalletPublicKey = function (path, opts) {
	        var options;
	        if (arguments.length > 2 || typeof opts === "boolean") {
	            console.warn("btc.getWalletPublicKey deprecated signature used. Please switch to getWalletPublicKey(path, { format, verify })");
	            options = {
	                verify: !!opts,
	                // eslint-disable-next-line prefer-rest-params
	                format: arguments[2] ? "p2sh" : "legacy"
	            };
	        }
	        else {
	            options = opts || {};
	        }
	        return getWalletPublicKey(this.transport, __assign$1(__assign$1({}, options), { path: path }));
	    };
	    /**
	     * You can sign a message according to the Bitcoin Signature format and retrieve v, r, s given the message and the BIP 32 path of the account to sign.
	     * @example
	     btc.signMessageNew_async("44'/60'/0'/0'/0", Buffer.from("test").toString("hex")).then(function(result) {
	       var v = result['v'] + 27 + 4;
	       var signature = Buffer.from(v.toString(16) + result['r'] + result['s'], 'hex').toString('base64');
	       console.log("Signature : " + signature);
	     }).catch(function(ex) {console.log(ex);});
	     */
	    Btc.prototype.signMessageNew = function (path, messageHex) {
	        return signMessage(this.transport, {
	            path: path,
	            messageHex: messageHex
	        });
	    };
	    /**
	     * To sign a transaction involving standard (P2PKH) inputs, call createTransaction with the following parameters
	     * @param inputs is an array of [ transaction, output_index, optional redeem script, optional sequence ] where
	     *
	     * * transaction is the previously computed transaction object for this UTXO
	     * * output_index is the output in the transaction used as input for this UTXO (counting from 0)
	     * * redeem script is the optional redeem script to use when consuming a Segregated Witness input
	     * * sequence is the sequence number to use for this input (when using RBF), or non present
	     * @param associatedKeysets is an array of BIP 32 paths pointing to the path to the private key used for each UTXO
	     * @param changePath is an optional BIP 32 path pointing to the path to the public key used to compute the change address
	     * @param outputScriptHex is the hexadecimal serialized outputs of the transaction to sign
	     * @param lockTime is the optional lockTime of the transaction to sign, or default (0)
	     * @param sigHashType is the hash type of the transaction to sign, or default (all)
	     * @param segwit is an optional boolean indicating wether to use segwit or not
	     * @param initialTimestamp is an optional timestamp of the function call to use for coins that necessitate timestamps only, (not the one that the tx will include)
	     * @param additionals list of additionnal options
	     *
	     * - "bech32" for spending native segwit outputs
	     * - "abc" for bch
	     * - "gold" for btg
	     * - "bipxxx" for using BIPxxx
	     * - "sapling" to indicate a zec transaction is supporting sapling (to be set over block 419200)
	     * @param expiryHeight is an optional Buffer for zec overwinter / sapling Txs
	     * @param useTrustedInputForSegwit trust inputs for segwit transactions
	     * @return the signed transaction ready to be broadcast
	     * @example
	    btc.createTransaction({
	     inputs: [ [tx1, 1] ],
	     associatedKeysets: ["0'/0/0"],
	     outputScriptHex: "01905f0100000000001976a91472a5d75c8d2d0565b656a5232703b167d50d5a2b88ac"
	    }).then(res => ...);
	     */
	    Btc.prototype.createPaymentTransactionNew = function (arg) {
	        if (arguments.length > 1) {
	            console.warn("@ledgerhq/hw-app-btc: createPaymentTransactionNew multi argument signature is deprecated. please switch to named parameters.");
	        }
	        return createTransaction(this.transport, arg);
	    };
	    /**
	     * To obtain the signature of multisignature (P2SH) inputs, call signP2SHTransaction_async with the folowing parameters
	     * @param inputs is an array of [ transaction, output_index, redeem script, optional sequence ] where
	     * * transaction is the previously computed transaction object for this UTXO
	     * * output_index is the output in the transaction used as input for this UTXO (counting from 0)
	     * * redeem script is the mandatory redeem script associated to the current P2SH input
	     * * sequence is the sequence number to use for this input (when using RBF), or non present
	     * @param associatedKeysets is an array of BIP 32 paths pointing to the path to the private key used for each UTXO
	     * @param outputScriptHex is the hexadecimal serialized outputs of the transaction to sign
	     * @param lockTime is the optional lockTime of the transaction to sign, or default (0)
	     * @param sigHashType is the hash type of the transaction to sign, or default (all)
	     * @return the signed transaction ready to be broadcast
	     * @example
	    btc.signP2SHTransaction({
	    inputs: [ [tx, 1, "52210289b4a3ad52a919abd2bdd6920d8a6879b1e788c38aa76f0440a6f32a9f1996d02103a3393b1439d1693b063482c04bd40142db97bdf139eedd1b51ffb7070a37eac321030b9a409a1e476b0d5d17b804fcdb81cf30f9b99c6f3ae1178206e08bc500639853ae"] ],
	    associatedKeysets: ["0'/0/0"],
	    outputScriptHex: "01905f0100000000001976a91472a5d75c8d2d0565b656a5232703b167d50d5a2b88ac"
	    }).then(result => ...);
	     */
	    Btc.prototype.signP2SHTransaction = function (arg) {
	        if (arguments.length > 1) {
	            console.warn("@ledgerhq/hw-app-btc: signP2SHTransaction multi argument signature is deprecated. please switch to named parameters.");
	        }
	        return signP2SHTransaction(this.transport, arg);
	    };
	    /**
	     * For each UTXO included in your transaction, create a transaction object from the raw serialized version of the transaction used in this UTXO.
	     * @example
	    const tx1 = btc.splitTransaction("01000000014ea60aeac5252c14291d428915bd7ccd1bfc4af009f4d4dc57ae597ed0420b71010000008a47304402201f36a12c240dbf9e566bc04321050b1984cd6eaf6caee8f02bb0bfec08e3354b022012ee2aeadcbbfd1e92959f57c15c1c6debb757b798451b104665aa3010569b49014104090b15bde569386734abf2a2b99f9ca6a50656627e77de663ca7325702769986cf26cc9dd7fdea0af432c8e2becc867c932e1b9dd742f2a108997c2252e2bdebffffffff0281b72e00000000001976a91472a5d75c8d2d0565b656a5232703b167d50d5a2b88aca0860100000000001976a9144533f5fb9b4817f713c48f0bfe96b9f50c476c9b88ac00000000");
	     */
	    Btc.prototype.splitTransaction = function (transactionHex, isSegwitSupported, hasTimestamp, hasExtraData, additionals) {
	        if (isSegwitSupported === void 0) { isSegwitSupported = false; }
	        if (hasTimestamp === void 0) { hasTimestamp = false; }
	        if (hasExtraData === void 0) { hasExtraData = false; }
	        if (additionals === void 0) { additionals = []; }
	        return splitTransaction(transactionHex, isSegwitSupported, hasTimestamp, hasExtraData, additionals);
	    };
	    /**
	    @example
	    const tx1 = btc.splitTransaction("01000000014ea60aeac5252c14291d428915bd7ccd1bfc4af009f4d4dc57ae597ed0420b71010000008a47304402201f36a12c240dbf9e566bc04321050b1984cd6eaf6caee8f02bb0bfec08e3354b022012ee2aeadcbbfd1e92959f57c15c1c6debb757b798451b104665aa3010569b49014104090b15bde569386734abf2a2b99f9ca6a50656627e77de663ca7325702769986cf26cc9dd7fdea0af432c8e2becc867c932e1b9dd742f2a108997c2252e2bdebffffffff0281b72e00000000001976a91472a5d75c8d2d0565b656a5232703b167d50d5a2b88aca0860100000000001976a9144533f5fb9b4817f713c48f0bfe96b9f50c476c9b88ac00000000");
	    const outputScript = btc.serializeTransactionOutputs(tx1).toString('hex');
	    */
	    Btc.prototype.serializeTransactionOutputs = function (t) {
	        return serializeTransactionOutputs(t);
	    };
	    Btc.prototype.getTrustedInput = function (indexLookup, transaction, additionals) {
	        if (additionals === void 0) { additionals = []; }
	        return getTrustedInput(this.transport, indexLookup, transaction, additionals);
	    };
	    Btc.prototype.getTrustedInputBIP143 = function (indexLookup, transaction, additionals) {
	        if (additionals === void 0) { additionals = []; }
	        return getTrustedInputBIP143(this.transport, indexLookup, transaction, additionals);
	    };
	    return Btc;
	}());

	var Btc$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': Btc
	});

	/* eslint-disable no-continue */
	/* eslint-disable no-unused-vars */
	/* eslint-disable no-param-reassign */
	/* eslint-disable no-prototype-builtins */
	var __values$1 = (undefined && undefined.__values) || function(o) {
	    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	    if (m) return m.call(o);
	    if (o && typeof o.length === "number") return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	var errorClasses = {};
	var deserializers = {};
	var addCustomErrorDeserializer = function (name, deserializer) {
	    deserializers[name] = deserializer;
	};
	var createCustomErrorClass = function (name) {
	    var C = function CustomError(message, fields) {
	        Object.assign(this, fields);
	        this.name = name;
	        this.message = message || name;
	        this.stack = new Error().stack;
	    };
	    C.prototype = new Error();
	    errorClasses[name] = C;
	    return C;
	};
	// inspired from https://github.com/programble/errio/blob/master/index.js
	var deserializeError = function (object) {
	    if (typeof object === "object" && object) {
	        try {
	            // $FlowFixMe FIXME HACK
	            var msg = JSON.parse(object.message);
	            if (msg.message && msg.name) {
	                object = msg;
	            }
	        }
	        catch (e) {
	            // nothing
	        }
	        var error = void 0;
	        if (typeof object.name === "string") {
	            var name_1 = object.name;
	            var des = deserializers[name_1];
	            if (des) {
	                error = des(object);
	            }
	            else {
	                var constructor = name_1 === "Error" ? Error : errorClasses[name_1];
	                if (!constructor) {
	                    console.warn("deserializing an unknown class '" + name_1 + "'");
	                    constructor = createCustomErrorClass(name_1);
	                }
	                error = Object.create(constructor.prototype);
	                try {
	                    for (var prop in object) {
	                        if (object.hasOwnProperty(prop)) {
	                            error[prop] = object[prop];
	                        }
	                    }
	                }
	                catch (e) {
	                    // sometimes setting a property can fail (e.g. .name)
	                }
	            }
	        }
	        else {
	            error = new Error(object.message);
	        }
	        if (!error.stack && Error.captureStackTrace) {
	            Error.captureStackTrace(error, deserializeError);
	        }
	        return error;
	    }
	    return new Error(String(object));
	};
	// inspired from https://github.com/sindresorhus/serialize-error/blob/master/index.js
	var serializeError = function (value) {
	    if (!value)
	        return value;
	    if (typeof value === "object") {
	        return destroyCircular(value, []);
	    }
	    if (typeof value === "function") {
	        return "[Function: " + (value.name || "anonymous") + "]";
	    }
	    return value;
	};
	// https://www.npmjs.com/package/destroy-circular
	function destroyCircular(from, seen) {
	    var e_1, _a;
	    var to = {};
	    seen.push(from);
	    try {
	        for (var _b = __values$1(Object.keys(from)), _c = _b.next(); !_c.done; _c = _b.next()) {
	            var key = _c.value;
	            var value = from[key];
	            if (typeof value === "function") {
	                continue;
	            }
	            if (!value || typeof value !== "object") {
	                to[key] = value;
	                continue;
	            }
	            if (seen.indexOf(from[key]) === -1) {
	                to[key] = destroyCircular(from[key], seen.slice(0));
	                continue;
	            }
	            to[key] = "[Circular]";
	        }
	    }
	    catch (e_1_1) { e_1 = { error: e_1_1 }; }
	    finally {
	        try {
	            if (_c && !_c.done && (_a = _b["return"])) _a.call(_b);
	        }
	        finally { if (e_1) throw e_1.error; }
	    }
	    if (typeof from.name === "string") {
	        to.name = from.name;
	    }
	    if (typeof from.message === "string") {
	        to.message = from.message;
	    }
	    if (typeof from.stack === "string") {
	        to.stack = from.stack;
	    }
	    return to;
	}

	var AccountNameRequiredError = createCustomErrorClass("AccountNameRequired");
	var AccountNotSupported = createCustomErrorClass("AccountNotSupported");
	var AmountRequired = createCustomErrorClass("AmountRequired");
	var BluetoothRequired = createCustomErrorClass("BluetoothRequired");
	var BtcUnmatchedApp = createCustomErrorClass("BtcUnmatchedApp");
	var CantOpenDevice = createCustomErrorClass("CantOpenDevice");
	var CashAddrNotSupported = createCustomErrorClass("CashAddrNotSupported");
	var CurrencyNotSupported = createCustomErrorClass("CurrencyNotSupported");
	var DeviceAppVerifyNotSupported = createCustomErrorClass("DeviceAppVerifyNotSupported");
	var DeviceGenuineSocketEarlyClose = createCustomErrorClass("DeviceGenuineSocketEarlyClose");
	var DeviceNotGenuineError = createCustomErrorClass("DeviceNotGenuine");
	var DeviceOnDashboardExpected = createCustomErrorClass("DeviceOnDashboardExpected");
	var DeviceOnDashboardUnexpected = createCustomErrorClass("DeviceOnDashboardUnexpected");
	var DeviceInOSUExpected = createCustomErrorClass("DeviceInOSUExpected");
	var DeviceHalted = createCustomErrorClass("DeviceHalted");
	var DeviceNameInvalid = createCustomErrorClass("DeviceNameInvalid");
	var DeviceSocketFail = createCustomErrorClass("DeviceSocketFail");
	var DeviceSocketNoBulkStatus = createCustomErrorClass("DeviceSocketNoBulkStatus");
	var DisconnectedDevice = createCustomErrorClass("DisconnectedDevice");
	var DisconnectedDeviceDuringOperation = createCustomErrorClass("DisconnectedDeviceDuringOperation");
	var EnpointConfigError = createCustomErrorClass("EnpointConfig");
	var EthAppPleaseEnableContractData = createCustomErrorClass("EthAppPleaseEnableContractData");
	var FeeEstimationFailed = createCustomErrorClass("FeeEstimationFailed");
	var FirmwareNotRecognized = createCustomErrorClass("FirmwareNotRecognized");
	var HardResetFail = createCustomErrorClass("HardResetFail");
	var InvalidXRPTag = createCustomErrorClass("InvalidXRPTag");
	var InvalidAddress = createCustomErrorClass("InvalidAddress");
	var InvalidAddressBecauseDestinationIsAlsoSource = createCustomErrorClass("InvalidAddressBecauseDestinationIsAlsoSource");
	var LatestMCUInstalledError = createCustomErrorClass("LatestMCUInstalledError");
	var UnknownMCU = createCustomErrorClass("UnknownMCU");
	var LedgerAPIError = createCustomErrorClass("LedgerAPIError");
	var LedgerAPIErrorWithMessage = createCustomErrorClass("LedgerAPIErrorWithMessage");
	var LedgerAPINotAvailable = createCustomErrorClass("LedgerAPINotAvailable");
	var ManagerAppAlreadyInstalledError = createCustomErrorClass("ManagerAppAlreadyInstalled");
	var ManagerAppRelyOnBTCError = createCustomErrorClass("ManagerAppRelyOnBTC");
	var ManagerAppDepInstallRequired = createCustomErrorClass("ManagerAppDepInstallRequired");
	var ManagerAppDepUninstallRequired = createCustomErrorClass("ManagerAppDepUninstallRequired");
	var ManagerDeviceLockedError = createCustomErrorClass("ManagerDeviceLocked");
	var ManagerFirmwareNotEnoughSpaceError = createCustomErrorClass("ManagerFirmwareNotEnoughSpace");
	var ManagerNotEnoughSpaceError = createCustomErrorClass("ManagerNotEnoughSpace");
	var ManagerUninstallBTCDep = createCustomErrorClass("ManagerUninstallBTCDep");
	var NetworkDown = createCustomErrorClass("NetworkDown");
	var NoAddressesFound = createCustomErrorClass("NoAddressesFound");
	var NotEnoughBalance = createCustomErrorClass("NotEnoughBalance");
	var NotEnoughBalanceToDelegate = createCustomErrorClass("NotEnoughBalanceToDelegate");
	var NotEnoughBalanceInParentAccount = createCustomErrorClass("NotEnoughBalanceInParentAccount");
	var NotEnoughSpendableBalance = createCustomErrorClass("NotEnoughSpendableBalance");
	var NotEnoughBalanceBecauseDestinationNotCreated = createCustomErrorClass("NotEnoughBalanceBecauseDestinationNotCreated");
	var NoAccessToCamera = createCustomErrorClass("NoAccessToCamera");
	var NotEnoughGas = createCustomErrorClass("NotEnoughGas");
	var NotSupportedLegacyAddress = createCustomErrorClass("NotSupportedLegacyAddress");
	var GasLessThanEstimate = createCustomErrorClass("GasLessThanEstimate");
	var PasswordsDontMatchError = createCustomErrorClass("PasswordsDontMatch");
	var PasswordIncorrectError = createCustomErrorClass("PasswordIncorrect");
	var RecommendSubAccountsToEmpty = createCustomErrorClass("RecommendSubAccountsToEmpty");
	var RecommendUndelegation = createCustomErrorClass("RecommendUndelegation");
	var TimeoutTagged = createCustomErrorClass("TimeoutTagged");
	var UnexpectedBootloader = createCustomErrorClass("UnexpectedBootloader");
	var MCUNotGenuineToDashboard = createCustomErrorClass("MCUNotGenuineToDashboard");
	var RecipientRequired = createCustomErrorClass("RecipientRequired");
	var UnavailableTezosOriginatedAccountReceive = createCustomErrorClass("UnavailableTezosOriginatedAccountReceive");
	var UnavailableTezosOriginatedAccountSend = createCustomErrorClass("UnavailableTezosOriginatedAccountSend");
	var UpdateFetchFileFail = createCustomErrorClass("UpdateFetchFileFail");
	var UpdateIncorrectHash = createCustomErrorClass("UpdateIncorrectHash");
	var UpdateIncorrectSig = createCustomErrorClass("UpdateIncorrectSig");
	var UpdateYourApp = createCustomErrorClass("UpdateYourApp");
	var UserRefusedDeviceNameChange = createCustomErrorClass("UserRefusedDeviceNameChange");
	var UserRefusedAddress = createCustomErrorClass("UserRefusedAddress");
	var UserRefusedFirmwareUpdate = createCustomErrorClass("UserRefusedFirmwareUpdate");
	var UserRefusedAllowManager = createCustomErrorClass("UserRefusedAllowManager");
	var UserRefusedOnDevice = createCustomErrorClass("UserRefusedOnDevice"); // TODO rename because it's just for transaction refusal
	var TransportOpenUserCancelled = createCustomErrorClass("TransportOpenUserCancelled");
	var TransportInterfaceNotAvailable = createCustomErrorClass("TransportInterfaceNotAvailable");
	var TransportRaceCondition = createCustomErrorClass("TransportRaceCondition");
	var TransportWebUSBGestureRequired = createCustomErrorClass("TransportWebUSBGestureRequired");
	var DeviceShouldStayInApp = createCustomErrorClass("DeviceShouldStayInApp");
	var WebsocketConnectionError = createCustomErrorClass("WebsocketConnectionError");
	var WebsocketConnectionFailed = createCustomErrorClass("WebsocketConnectionFailed");
	var WrongDeviceForAccount = createCustomErrorClass("WrongDeviceForAccount");
	var WrongAppForCurrency = createCustomErrorClass("WrongAppForCurrency");
	var ETHAddressNonEIP = createCustomErrorClass("ETHAddressNonEIP");
	var CantScanQRCode = createCustomErrorClass("CantScanQRCode");
	var FeeNotLoaded = createCustomErrorClass("FeeNotLoaded");
	var FeeRequired = createCustomErrorClass("FeeRequired");
	var FeeTooHigh = createCustomErrorClass("FeeTooHigh");
	var SyncError = createCustomErrorClass("SyncError");
	var PairingFailed = createCustomErrorClass("PairingFailed");
	var GenuineCheckFailed = createCustomErrorClass("GenuineCheckFailed");
	var LedgerAPI4xx = createCustomErrorClass("LedgerAPI4xx");
	var LedgerAPI5xx = createCustomErrorClass("LedgerAPI5xx");
	var FirmwareOrAppUpdateRequired = createCustomErrorClass("FirmwareOrAppUpdateRequired");
	// db stuff, no need to translate
	var NoDBPathGiven = createCustomErrorClass("NoDBPathGiven");
	var DBWrongPassword = createCustomErrorClass("DBWrongPassword");
	var DBNotReset = createCustomErrorClass("DBNotReset");
	/**
	 * TransportError is used for any generic transport errors.
	 * e.g. Error thrown when data received by exchanges are incorrect or if exchanged failed to communicate with the device for various reason.
	 */
	function TransportError(message, id) {
	    this.name = "TransportError";
	    this.message = message;
	    this.stack = new Error().stack;
	    this.id = id;
	}
	TransportError.prototype = new Error();
	addCustomErrorDeserializer("TransportError", function (e) { return new TransportError(e.message, e.id); });
	var StatusCodes = {
	    PIN_REMAINING_ATTEMPTS: 0x63c0,
	    INCORRECT_LENGTH: 0x6700,
	    MISSING_CRITICAL_PARAMETER: 0x6800,
	    COMMAND_INCOMPATIBLE_FILE_STRUCTURE: 0x6981,
	    SECURITY_STATUS_NOT_SATISFIED: 0x6982,
	    CONDITIONS_OF_USE_NOT_SATISFIED: 0x6985,
	    INCORRECT_DATA: 0x6a80,
	    NOT_ENOUGH_MEMORY_SPACE: 0x6a84,
	    REFERENCED_DATA_NOT_FOUND: 0x6a88,
	    FILE_ALREADY_EXISTS: 0x6a89,
	    INCORRECT_P1_P2: 0x6b00,
	    INS_NOT_SUPPORTED: 0x6d00,
	    CLA_NOT_SUPPORTED: 0x6e00,
	    TECHNICAL_PROBLEM: 0x6f00,
	    OK: 0x9000,
	    MEMORY_PROBLEM: 0x9240,
	    NO_EF_SELECTED: 0x9400,
	    INVALID_OFFSET: 0x9402,
	    FILE_NOT_FOUND: 0x9404,
	    INCONSISTENT_FILE: 0x9408,
	    ALGORITHM_NOT_SUPPORTED: 0x9484,
	    INVALID_KCV: 0x9485,
	    CODE_NOT_INITIALIZED: 0x9802,
	    ACCESS_CONDITION_NOT_FULFILLED: 0x9804,
	    CONTRADICTION_SECRET_CODE_STATUS: 0x9808,
	    CONTRADICTION_INVALIDATION: 0x9810,
	    CODE_BLOCKED: 0x9840,
	    MAX_VALUE_REACHED: 0x9850,
	    GP_AUTH_FAILED: 0x6300,
	    LICENSING: 0x6f42,
	    HALTED: 0x6faa
	};
	function getAltStatusMessage(code) {
	    switch (code) {
	        // improve text of most common errors
	        case 0x6700:
	            return "Incorrect length";
	        case 0x6800:
	            return "Missing critical parameter";
	        case 0x6982:
	            return "Security not satisfied (dongle locked or have invalid access rights)";
	        case 0x6985:
	            return "Condition of use not satisfied (denied by the user?)";
	        case 0x6a80:
	            return "Invalid data received";
	        case 0x6b00:
	            return "Invalid parameter received";
	    }
	    if (0x6f00 <= code && code <= 0x6fff) {
	        return "Internal error, please report";
	    }
	}
	/**
	 * Error thrown when a device returned a non success status.
	 * the error.statusCode is one of the `StatusCodes` exported by this library.
	 */
	function TransportStatusError(statusCode) {
	    this.name = "TransportStatusError";
	    var statusText = Object.keys(StatusCodes).find(function (k) { return StatusCodes[k] === statusCode; }) ||
	        "UNKNOWN_ERROR";
	    var smsg = getAltStatusMessage(statusCode) || statusText;
	    var statusCodeStr = statusCode.toString(16);
	    this.message = "Ledger device: " + smsg + " (0x" + statusCodeStr + ")";
	    this.stack = new Error().stack;
	    this.statusCode = statusCode;
	    this.statusText = statusText;
	}
	TransportStatusError.prototype = new Error();
	addCustomErrorDeserializer("TransportStatusError", function (e) { return new TransportStatusError(e.statusCode); });

	var libEs = /*#__PURE__*/Object.freeze({
		__proto__: null,
		serializeError: serializeError,
		deserializeError: deserializeError,
		createCustomErrorClass: createCustomErrorClass,
		addCustomErrorDeserializer: addCustomErrorDeserializer,
		AccountNameRequiredError: AccountNameRequiredError,
		AccountNotSupported: AccountNotSupported,
		AmountRequired: AmountRequired,
		BluetoothRequired: BluetoothRequired,
		BtcUnmatchedApp: BtcUnmatchedApp,
		CantOpenDevice: CantOpenDevice,
		CashAddrNotSupported: CashAddrNotSupported,
		CurrencyNotSupported: CurrencyNotSupported,
		DeviceAppVerifyNotSupported: DeviceAppVerifyNotSupported,
		DeviceGenuineSocketEarlyClose: DeviceGenuineSocketEarlyClose,
		DeviceNotGenuineError: DeviceNotGenuineError,
		DeviceOnDashboardExpected: DeviceOnDashboardExpected,
		DeviceOnDashboardUnexpected: DeviceOnDashboardUnexpected,
		DeviceInOSUExpected: DeviceInOSUExpected,
		DeviceHalted: DeviceHalted,
		DeviceNameInvalid: DeviceNameInvalid,
		DeviceSocketFail: DeviceSocketFail,
		DeviceSocketNoBulkStatus: DeviceSocketNoBulkStatus,
		DisconnectedDevice: DisconnectedDevice,
		DisconnectedDeviceDuringOperation: DisconnectedDeviceDuringOperation,
		EnpointConfigError: EnpointConfigError,
		EthAppPleaseEnableContractData: EthAppPleaseEnableContractData,
		FeeEstimationFailed: FeeEstimationFailed,
		FirmwareNotRecognized: FirmwareNotRecognized,
		HardResetFail: HardResetFail,
		InvalidXRPTag: InvalidXRPTag,
		InvalidAddress: InvalidAddress,
		InvalidAddressBecauseDestinationIsAlsoSource: InvalidAddressBecauseDestinationIsAlsoSource,
		LatestMCUInstalledError: LatestMCUInstalledError,
		UnknownMCU: UnknownMCU,
		LedgerAPIError: LedgerAPIError,
		LedgerAPIErrorWithMessage: LedgerAPIErrorWithMessage,
		LedgerAPINotAvailable: LedgerAPINotAvailable,
		ManagerAppAlreadyInstalledError: ManagerAppAlreadyInstalledError,
		ManagerAppRelyOnBTCError: ManagerAppRelyOnBTCError,
		ManagerAppDepInstallRequired: ManagerAppDepInstallRequired,
		ManagerAppDepUninstallRequired: ManagerAppDepUninstallRequired,
		ManagerDeviceLockedError: ManagerDeviceLockedError,
		ManagerFirmwareNotEnoughSpaceError: ManagerFirmwareNotEnoughSpaceError,
		ManagerNotEnoughSpaceError: ManagerNotEnoughSpaceError,
		ManagerUninstallBTCDep: ManagerUninstallBTCDep,
		NetworkDown: NetworkDown,
		NoAddressesFound: NoAddressesFound,
		NotEnoughBalance: NotEnoughBalance,
		NotEnoughBalanceToDelegate: NotEnoughBalanceToDelegate,
		NotEnoughBalanceInParentAccount: NotEnoughBalanceInParentAccount,
		NotEnoughSpendableBalance: NotEnoughSpendableBalance,
		NotEnoughBalanceBecauseDestinationNotCreated: NotEnoughBalanceBecauseDestinationNotCreated,
		NoAccessToCamera: NoAccessToCamera,
		NotEnoughGas: NotEnoughGas,
		NotSupportedLegacyAddress: NotSupportedLegacyAddress,
		GasLessThanEstimate: GasLessThanEstimate,
		PasswordsDontMatchError: PasswordsDontMatchError,
		PasswordIncorrectError: PasswordIncorrectError,
		RecommendSubAccountsToEmpty: RecommendSubAccountsToEmpty,
		RecommendUndelegation: RecommendUndelegation,
		TimeoutTagged: TimeoutTagged,
		UnexpectedBootloader: UnexpectedBootloader,
		MCUNotGenuineToDashboard: MCUNotGenuineToDashboard,
		RecipientRequired: RecipientRequired,
		UnavailableTezosOriginatedAccountReceive: UnavailableTezosOriginatedAccountReceive,
		UnavailableTezosOriginatedAccountSend: UnavailableTezosOriginatedAccountSend,
		UpdateFetchFileFail: UpdateFetchFileFail,
		UpdateIncorrectHash: UpdateIncorrectHash,
		UpdateIncorrectSig: UpdateIncorrectSig,
		UpdateYourApp: UpdateYourApp,
		UserRefusedDeviceNameChange: UserRefusedDeviceNameChange,
		UserRefusedAddress: UserRefusedAddress,
		UserRefusedFirmwareUpdate: UserRefusedFirmwareUpdate,
		UserRefusedAllowManager: UserRefusedAllowManager,
		UserRefusedOnDevice: UserRefusedOnDevice,
		TransportOpenUserCancelled: TransportOpenUserCancelled,
		TransportInterfaceNotAvailable: TransportInterfaceNotAvailable,
		TransportRaceCondition: TransportRaceCondition,
		TransportWebUSBGestureRequired: TransportWebUSBGestureRequired,
		DeviceShouldStayInApp: DeviceShouldStayInApp,
		WebsocketConnectionError: WebsocketConnectionError,
		WebsocketConnectionFailed: WebsocketConnectionFailed,
		WrongDeviceForAccount: WrongDeviceForAccount,
		WrongAppForCurrency: WrongAppForCurrency,
		ETHAddressNonEIP: ETHAddressNonEIP,
		CantScanQRCode: CantScanQRCode,
		FeeNotLoaded: FeeNotLoaded,
		FeeRequired: FeeRequired,
		FeeTooHigh: FeeTooHigh,
		SyncError: SyncError,
		PairingFailed: PairingFailed,
		GenuineCheckFailed: GenuineCheckFailed,
		LedgerAPI4xx: LedgerAPI4xx,
		LedgerAPI5xx: LedgerAPI5xx,
		FirmwareOrAppUpdateRequired: FirmwareOrAppUpdateRequired,
		NoDBPathGiven: NoDBPathGiven,
		DBWrongPassword: DBWrongPassword,
		DBNotReset: DBNotReset,
		TransportError: TransportError,
		StatusCodes: StatusCodes,
		getAltStatusMessage: getAltStatusMessage,
		TransportStatusError: TransportStatusError
	});

	var __awaiter$2 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator$2 = (undefined && undefined.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	var __read = (undefined && undefined.__read) || function (o, n) {
	    var m = typeof Symbol === "function" && o[Symbol.iterator];
	    if (!m) return o;
	    var i = m.call(o), r, ar = [], e;
	    try {
	        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	    }
	    catch (error) { e = { error: error }; }
	    finally {
	        try {
	            if (r && !r.done && (m = i["return"])) m.call(i);
	        }
	        finally { if (e) throw e.error; }
	    }
	    return ar;
	};
	var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
	    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
	        if (ar || !(i in from)) {
	            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
	            ar[i] = from[i];
	        }
	    }
	    return to.concat(ar || Array.prototype.slice.call(from));
	};
	var __values = (undefined && undefined.__values) || function(o) {
	    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	    if (m) return m.call(o);
	    if (o && typeof o.length === "number") return {
	        next: function () {
	            if (o && i >= o.length) o = void 0;
	            return { value: o && o[i++], done: !o };
	        }
	    };
	    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
	};
	/**
	 * Transport defines the generic interface to share between node/u2f impl
	 * A **Descriptor** is a parametric type that is up to be determined for the implementation.
	 * it can be for instance an ID, an file path, a URL,...
	 */
	var Transport = /** @class */ (function () {
	    function Transport() {
	        var _this = this;
	        this.exchangeTimeout = 30000;
	        this.unresponsiveTimeout = 15000;
	        this.deviceModel = null;
	        this._events = new EventEmitter$1();
	        /**
	         * wrapper on top of exchange to simplify work of the implementation.
	         * @param cla
	         * @param ins
	         * @param p1
	         * @param p2
	         * @param data
	         * @param statusList is a list of accepted status code (shorts). [0x9000] by default
	         * @return a Promise of response buffer
	         */
	        this.send = function (cla, ins, p1, p2, data, statusList) {
	            if (data === void 0) { data = Buffer$e.alloc(0); }
	            if (statusList === void 0) { statusList = [StatusCodes.OK]; }
	            return __awaiter$2(_this, void 0, void 0, function () {
	                var response, sw;
	                return __generator$2(this, function (_a) {
	                    switch (_a.label) {
	                        case 0:
	                            if (data.length >= 256) {
	                                throw new TransportError("data.length exceed 256 bytes limit. Got: " + data.length, "DataLengthTooBig");
	                            }
	                            return [4 /*yield*/, this.exchange(Buffer$e.concat([
	                                    Buffer$e.from([cla, ins, p1, p2]),
	                                    Buffer$e.from([data.length]),
	                                    data,
	                                ]))];
	                        case 1:
	                            response = _a.sent();
	                            sw = response.readUInt16BE(response.length - 2);
	                            if (!statusList.some(function (s) { return s === sw; })) {
	                                throw new TransportStatusError(sw);
	                            }
	                            return [2 /*return*/, response];
	                    }
	                });
	            });
	        };
	        this.exchangeAtomicImpl = function (f) { return __awaiter$2(_this, void 0, void 0, function () {
	            var resolveBusy, busyPromise, unresponsiveReached, timeout, res;
	            var _this = this;
	            return __generator$2(this, function (_a) {
	                switch (_a.label) {
	                    case 0:
	                        if (this.exchangeBusyPromise) {
	                            throw new TransportRaceCondition("An action was already pending on the Ledger device. Please deny or reconnect.");
	                        }
	                        busyPromise = new Promise(function (r) {
	                            resolveBusy = r;
	                        });
	                        this.exchangeBusyPromise = busyPromise;
	                        unresponsiveReached = false;
	                        timeout = setTimeout(function () {
	                            unresponsiveReached = true;
	                            _this.emit("unresponsive");
	                        }, this.unresponsiveTimeout);
	                        _a.label = 1;
	                    case 1:
	                        _a.trys.push([1, , 3, 4]);
	                        return [4 /*yield*/, f()];
	                    case 2:
	                        res = _a.sent();
	                        if (unresponsiveReached) {
	                            this.emit("responsive");
	                        }
	                        return [2 /*return*/, res];
	                    case 3:
	                        clearTimeout(timeout);
	                        if (resolveBusy)
	                            resolveBusy();
	                        this.exchangeBusyPromise = null;
	                        return [7 /*endfinally*/];
	                    case 4: return [2 /*return*/];
	                }
	            });
	        }); };
	        this._appAPIlock = null;
	    }
	    /**
	     * low level api to communicate with the device
	     * This method is for implementations to implement but should not be directly called.
	     * Instead, the recommanded way is to use send() method
	     * @param apdu the data to send
	     * @return a Promise of response data
	     */
	    Transport.prototype.exchange = function (_apdu) {
	        throw new Error("exchange not implemented");
	    };
	    /**
	     * set the "scramble key" for the next exchanges with the device.
	     * Each App can have a different scramble key and they internally will set it at instanciation.
	     * @param key the scramble key
	     */
	    Transport.prototype.setScrambleKey = function (_key) { };
	    /**
	     * close the exchange with the device.
	     * @return a Promise that ends when the transport is closed.
	     */
	    Transport.prototype.close = function () {
	        return Promise.resolve();
	    };
	    /**
	     * Listen to an event on an instance of transport.
	     * Transport implementation can have specific events. Here is the common events:
	     * * `"disconnect"` : triggered if Transport is disconnected
	     */
	    Transport.prototype.on = function (eventName, cb) {
	        this._events.on(eventName, cb);
	    };
	    /**
	     * Stop listening to an event on an instance of transport.
	     */
	    Transport.prototype.off = function (eventName, cb) {
	        this._events.removeListener(eventName, cb);
	    };
	    Transport.prototype.emit = function (event) {
	        var _a;
	        var args = [];
	        for (var _i = 1; _i < arguments.length; _i++) {
	            args[_i - 1] = arguments[_i];
	        }
	        (_a = this._events).emit.apply(_a, __spreadArray([event], __read(args), false));
	    };
	    /**
	     * Enable or not logs of the binary exchange
	     */
	    Transport.prototype.setDebugMode = function () {
	        console.warn("setDebugMode is deprecated. use @ledgerhq/logs instead. No logs are emitted in this anymore.");
	    };
	    /**
	     * Set a timeout (in milliseconds) for the exchange call. Only some transport might implement it. (e.g. U2F)
	     */
	    Transport.prototype.setExchangeTimeout = function (exchangeTimeout) {
	        this.exchangeTimeout = exchangeTimeout;
	    };
	    /**
	     * Define the delay before emitting "unresponsive" on an exchange that does not respond
	     */
	    Transport.prototype.setExchangeUnresponsiveTimeout = function (unresponsiveTimeout) {
	        this.unresponsiveTimeout = unresponsiveTimeout;
	    };
	    /**
	     * create() allows to open the first descriptor available or
	     * throw if there is none or if timeout is reached.
	     * This is a light helper, alternative to using listen() and open() (that you may need for any more advanced usecase)
	     * @example
	    TransportFoo.create().then(transport => ...)
	     */
	    Transport.create = function (openTimeout, listenTimeout) {
	        var _this = this;
	        if (openTimeout === void 0) { openTimeout = 3000; }
	        return new Promise(function (resolve, reject) {
	            var found = false;
	            var sub = _this.listen({
	                next: function (e) {
	                    found = true;
	                    if (sub)
	                        sub.unsubscribe();
	                    if (listenTimeoutId)
	                        clearTimeout(listenTimeoutId);
	                    _this.open(e.descriptor, openTimeout).then(resolve, reject);
	                },
	                error: function (e) {
	                    if (listenTimeoutId)
	                        clearTimeout(listenTimeoutId);
	                    reject(e);
	                },
	                complete: function () {
	                    if (listenTimeoutId)
	                        clearTimeout(listenTimeoutId);
	                    if (!found) {
	                        reject(new TransportError(_this.ErrorMessage_NoDeviceFound, "NoDeviceFound"));
	                    }
	                }
	            });
	            var listenTimeoutId = listenTimeout
	                ? setTimeout(function () {
	                    sub.unsubscribe();
	                    reject(new TransportError(_this.ErrorMessage_ListenTimeout, "ListenTimeout"));
	                }, listenTimeout)
	                : null;
	        });
	    };
	    Transport.prototype.decorateAppAPIMethods = function (self, methods, scrambleKey) {
	        var e_1, _a;
	        try {
	            for (var methods_1 = __values(methods), methods_1_1 = methods_1.next(); !methods_1_1.done; methods_1_1 = methods_1.next()) {
	                var methodName = methods_1_1.value;
	                self[methodName] = this.decorateAppAPIMethod(methodName, self[methodName], self, scrambleKey);
	            }
	        }
	        catch (e_1_1) { e_1 = { error: e_1_1 }; }
	        finally {
	            try {
	                if (methods_1_1 && !methods_1_1.done && (_a = methods_1["return"])) _a.call(methods_1);
	            }
	            finally { if (e_1) throw e_1.error; }
	        }
	    };
	    Transport.prototype.decorateAppAPIMethod = function (methodName, f, ctx, scrambleKey) {
	        var _this = this;
	        return function () {
	            var args = [];
	            for (var _i = 0; _i < arguments.length; _i++) {
	                args[_i] = arguments[_i];
	            }
	            return __awaiter$2(_this, void 0, void 0, function () {
	                var _appAPIlock;
	                return __generator$2(this, function (_a) {
	                    switch (_a.label) {
	                        case 0:
	                            _appAPIlock = this._appAPIlock;
	                            if (_appAPIlock) {
	                                return [2 /*return*/, Promise.reject(new TransportError("Ledger Device is busy (lock " + _appAPIlock + ")", "TransportLocked"))];
	                            }
	                            _a.label = 1;
	                        case 1:
	                            _a.trys.push([1, , 3, 4]);
	                            this._appAPIlock = methodName;
	                            this.setScrambleKey(scrambleKey);
	                            return [4 /*yield*/, f.apply(ctx, args)];
	                        case 2: return [2 /*return*/, _a.sent()];
	                        case 3:
	                            this._appAPIlock = null;
	                            return [7 /*endfinally*/];
	                        case 4: return [2 /*return*/];
	                    }
	                });
	            });
	        };
	    };
	    Transport.ErrorMessage_ListenTimeout = "No Ledger device found (timeout)";
	    Transport.ErrorMessage_NoDeviceFound = "No Ledger device found";
	    return Transport;
	}());

	var hidFraming$1 = {};

	var require$$0 = /*@__PURE__*/getAugmentedNamespace(libEs);

	(function (exports) {
	exports.__esModule = true;
	var errors_1 = require$$0;
	var Tag = 0x05;
	function asUInt16BE(value) {
	    var b = Buffer$e.alloc(2);
	    b.writeUInt16BE(value, 0);
	    return b;
	}
	var initialAcc = {
	    data: Buffer$e.alloc(0),
	    dataLength: 0,
	    sequence: 0
	};
	/**
	 *
	 */
	var createHIDframing = function (channel, packetSize) {
	    return {
	        makeBlocks: function (apdu) {
	            var data = Buffer$e.concat([asUInt16BE(apdu.length), apdu]);
	            var blockSize = packetSize - 5;
	            var nbBlocks = Math.ceil(data.length / blockSize);
	            data = Buffer$e.concat([
	                data,
	                Buffer$e.alloc(nbBlocks * blockSize - data.length + 1).fill(0),
	            ]);
	            var blocks = [];
	            for (var i = 0; i < nbBlocks; i++) {
	                var head = Buffer$e.alloc(5);
	                head.writeUInt16BE(channel, 0);
	                head.writeUInt8(Tag, 2);
	                head.writeUInt16BE(i, 3);
	                var chunk = data.slice(i * blockSize, (i + 1) * blockSize);
	                blocks.push(Buffer$e.concat([head, chunk]));
	            }
	            return blocks;
	        },
	        reduceResponse: function (acc, chunk) {
	            var _a = acc || initialAcc, data = _a.data, dataLength = _a.dataLength, sequence = _a.sequence;
	            if (chunk.readUInt16BE(0) !== channel) {
	                throw new errors_1.TransportError("Invalid channel", "InvalidChannel");
	            }
	            if (chunk.readUInt8(2) !== Tag) {
	                throw new errors_1.TransportError("Invalid tag", "InvalidTag");
	            }
	            if (chunk.readUInt16BE(3) !== sequence) {
	                throw new errors_1.TransportError("Invalid sequence", "InvalidSequence");
	            }
	            if (!acc) {
	                dataLength = chunk.readUInt16BE(5);
	            }
	            sequence++;
	            var chunkData = chunk.slice(acc ? 5 : 7);
	            data = Buffer$e.concat([data, chunkData]);
	            if (data.length > dataLength) {
	                data = data.slice(0, dataLength);
	            }
	            return {
	                data: data,
	                dataLength: dataLength,
	                sequence: sequence
	            };
	        },
	        getReducedResult: function (acc) {
	            if (acc && acc.dataLength === acc.data.length) {
	                return acc.data;
	            }
	        }
	    };
	};
	exports["default"] = createHIDframing;

	}(hidFraming$1));

	var hidFraming = /*@__PURE__*/getDefaultExportFromCjs(hidFraming$1);

	var __assign = (undefined && undefined.__assign) || function () {
	    __assign = Object.assign || function(t) {
	        for (var s, i = 1, n = arguments.length; i < n; i++) {
	            s = arguments[i];
	            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
	                t[p] = s[p];
	        }
	        return t;
	    };
	    return __assign.apply(this, arguments);
	};
	var _a;
	var DeviceModelId;
	(function (DeviceModelId) {
	    DeviceModelId["blue"] = "blue";
	    DeviceModelId["nanoS"] = "nanoS";
	    DeviceModelId["nanoSP"] = "nanoSP";
	    DeviceModelId["nanoX"] = "nanoX";
	})(DeviceModelId || (DeviceModelId = {}));
	var devices = (_a = {},
	    _a[DeviceModelId.blue] = {
	        id: DeviceModelId.blue,
	        productName: "Ledger Blue",
	        productIdMM: 0x00,
	        legacyUsbProductId: 0x0000,
	        usbOnly: true,
	        memorySize: 480 * 1024,
	        masks: [0x31000000, 0x31010000],
	        getBlockSize: function (_firwareVersion) { return 4 * 1024; }
	    },
	    _a[DeviceModelId.nanoS] = {
	        id: DeviceModelId.nanoS,
	        productName: "Ledger Nano S",
	        productIdMM: 0x10,
	        legacyUsbProductId: 0x0001,
	        usbOnly: true,
	        memorySize: 320 * 1024,
	        masks: [0x31100000],
	        getBlockSize: function (firmwareVersion) {
	            var _a;
	            return semver.lt((_a = semver.coerce(firmwareVersion)) !== null && _a !== void 0 ? _a : "", "2.0.0")
	                ? 4 * 1024
	                : 2 * 1024;
	        }
	    },
	    _a[DeviceModelId.nanoSP] = {
	        id: DeviceModelId.nanoSP,
	        productName: "Ledger Nano S Plus",
	        productIdMM: 0x50,
	        legacyUsbProductId: 0x0005,
	        usbOnly: true,
	        memorySize: 1533 * 1024,
	        masks: [0x33100000],
	        getBlockSize: function (_firmwareVersion) { return 32; }
	    },
	    _a[DeviceModelId.nanoX] = {
	        id: DeviceModelId.nanoX,
	        productName: "Ledger Nano X",
	        productIdMM: 0x40,
	        legacyUsbProductId: 0x0004,
	        usbOnly: false,
	        memorySize: 2 * 1024 * 1024,
	        masks: [0x33000000],
	        getBlockSize: function (_firwareVersion) { return 4 * 1024; },
	        bluetoothSpec: [
	            {
	                // this is the legacy one (prototype version). we will eventually drop it.
	                serviceUuid: "d973f2e0-b19e-11e2-9e96-0800200c9a66",
	                notifyUuid: "d973f2e1-b19e-11e2-9e96-0800200c9a66",
	                writeUuid: "d973f2e2-b19e-11e2-9e96-0800200c9a66",
	                writeCmdUuid: "d973f2e3-b19e-11e2-9e96-0800200c9a66"
	            },
	            {
	                serviceUuid: "13d63400-2c97-0004-0000-4c6564676572",
	                notifyUuid: "13d63400-2c97-0004-0001-4c6564676572",
	                writeUuid: "13d63400-2c97-0004-0002-4c6564676572",
	                writeCmdUuid: "13d63400-2c97-0004-0003-4c6564676572"
	            },
	        ]
	    },
	    _a);
	({
	    Blue: DeviceModelId.blue,
	    "Nano S": DeviceModelId.nanoS,
	    "Nano X": DeviceModelId.nanoX
	});
	var devicesList = Object.values(devices);
	/**
	 *
	 */
	var ledgerUSBVendorId = 0x2c97;
	/**
	 *
	 */
	var identifyUSBProductId = function (usbProductId) {
	    var legacy = devicesList.find(function (d) { return d.legacyUsbProductId === usbProductId; });
	    if (legacy)
	        return legacy;
	    var mm = usbProductId >> 8;
	    var deviceModel = devicesList.find(function (d) { return d.productIdMM === mm; });
	    return deviceModel;
	};
	var bluetoothServices = [];
	var serviceUuidToInfos = {};
	for (var id in devices) {
	    var deviceModel = devices[id];
	    var bluetoothSpec = deviceModel.bluetoothSpec;
	    if (bluetoothSpec) {
	        for (var i = 0; i < bluetoothSpec.length; i++) {
	            var spec = bluetoothSpec[i];
	            bluetoothServices.push(spec.serviceUuid);
	            serviceUuidToInfos[spec.serviceUuid] = serviceUuidToInfos[spec.serviceUuid.replace(/-/g, "")] = __assign({ deviceModel: deviceModel }, spec);
	        }
	    }
	}

	var __awaiter$1 = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator$1 = (undefined && undefined.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	var ledgerDevices = [
	    {
	        vendorId: ledgerUSBVendorId
	    },
	];
	function requestLedgerDevice() {
	    return __awaiter$1(this, void 0, void 0, function () {
	        var device;
	        return __generator$1(this, function (_a) {
	            switch (_a.label) {
	                case 0: return [4 /*yield*/, navigator.usb.requestDevice({
	                        filters: ledgerDevices
	                    })];
	                case 1:
	                    device = _a.sent();
	                    return [2 /*return*/, device];
	            }
	        });
	    });
	}
	function getLedgerDevices() {
	    return __awaiter$1(this, void 0, void 0, function () {
	        var devices;
	        return __generator$1(this, function (_a) {
	            switch (_a.label) {
	                case 0: return [4 /*yield*/, navigator.usb.getDevices()];
	                case 1:
	                    devices = _a.sent();
	                    return [2 /*return*/, devices.filter(function (d) { return d.vendorId === ledgerUSBVendorId; })];
	            }
	        });
	    });
	}
	function getFirstLedgerDevice() {
	    return __awaiter$1(this, void 0, void 0, function () {
	        var existingDevices;
	        return __generator$1(this, function (_a) {
	            switch (_a.label) {
	                case 0: return [4 /*yield*/, getLedgerDevices()];
	                case 1:
	                    existingDevices = _a.sent();
	                    if (existingDevices.length > 0)
	                        return [2 /*return*/, existingDevices[0]];
	                    return [2 /*return*/, requestLedgerDevice()];
	            }
	        });
	    });
	}
	var isSupported = function () {
	    return Promise.resolve(!!navigator &&
	        !!navigator.usb &&
	        typeof navigator.usb.getDevices === "function");
	};

	var __extends = (undefined && undefined.__extends) || (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        if (typeof b !== "function" && b !== null)
	            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
	    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
	    return new (P || (P = Promise))(function (resolve, reject) {
	        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
	        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
	        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
	        step((generator = generator.apply(thisArg, _arguments || [])).next());
	    });
	};
	var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
	    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
	    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
	    function verb(n) { return function (v) { return step([n, v]); }; }
	    function step(op) {
	        if (f) throw new TypeError("Generator is already executing.");
	        while (_) try {
	            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
	            if (y = 0, t) op = [op[0] & 2, t.value];
	            switch (op[0]) {
	                case 0: case 1: t = op; break;
	                case 4: _.label++; return { value: op[1], done: false };
	                case 5: _.label++; y = op[1]; op = [0]; continue;
	                case 7: op = _.ops.pop(); _.trys.pop(); continue;
	                default:
	                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
	                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
	                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
	                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
	                    if (t[2]) _.ops.pop();
	                    _.trys.pop(); continue;
	            }
	            op = body.call(thisArg, _);
	        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
	        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
	    }
	};
	var configurationValue = 1;
	var endpointNumber = 3;
	/**
	 * WebUSB Transport implementation
	 * @example
	 * import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
	 * ...
	 * TransportWebUSB.create().then(transport => ...)
	 */
	var TransportWebUSB = /** @class */ (function (_super) {
	    __extends(TransportWebUSB, _super);
	    function TransportWebUSB(device, interfaceNumber) {
	        var _this = _super.call(this) || this;
	        _this.channel = Math.floor(Math.random() * 0xffff);
	        _this.packetSize = 64;
	        _this._disconnectEmitted = false;
	        _this._emitDisconnect = function (e) {
	            if (_this._disconnectEmitted)
	                return;
	            _this._disconnectEmitted = true;
	            _this.emit("disconnect", e);
	        };
	        _this.device = device;
	        _this.interfaceNumber = interfaceNumber;
	        _this.deviceModel = identifyUSBProductId(device.productId);
	        return _this;
	    }
	    /**
	     * Similar to create() except it will always display the device permission (even if some devices are already accepted).
	     */
	    TransportWebUSB.request = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            var device;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, requestLedgerDevice()];
	                    case 1:
	                        device = _a.sent();
	                        return [2 /*return*/, TransportWebUSB.open(device)];
	                }
	            });
	        });
	    };
	    /**
	     * Similar to create() except it will never display the device permission (it returns a Promise<?Transport>, null if it fails to find a device).
	     */
	    TransportWebUSB.openConnected = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            var devices;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, getLedgerDevices()];
	                    case 1:
	                        devices = _a.sent();
	                        if (devices.length === 0)
	                            return [2 /*return*/, null];
	                        return [2 /*return*/, TransportWebUSB.open(devices[0])];
	                }
	            });
	        });
	    };
	    /**
	     * Create a Ledger transport with a USBDevice
	     */
	    TransportWebUSB.open = function (device) {
	        return __awaiter(this, void 0, void 0, function () {
	            var iface, interfaceNumber, e_1, transport, onDisconnect;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, device.open()];
	                    case 1:
	                        _a.sent();
	                        if (!(device.configuration === null)) return [3 /*break*/, 3];
	                        return [4 /*yield*/, device.selectConfiguration(configurationValue)];
	                    case 2:
	                        _a.sent();
	                        _a.label = 3;
	                    case 3: return [4 /*yield*/, gracefullyResetDevice(device)];
	                    case 4:
	                        _a.sent();
	                        iface = device.configurations[0].interfaces.find(function (_a) {
	                            var alternates = _a.alternates;
	                            return alternates.some(function (a) { return a.interfaceClass === 255; });
	                        });
	                        if (!iface) {
	                            throw new TransportInterfaceNotAvailable("No WebUSB interface found for your Ledger device. Please upgrade firmware or contact techsupport.");
	                        }
	                        interfaceNumber = iface.interfaceNumber;
	                        _a.label = 5;
	                    case 5:
	                        _a.trys.push([5, 7, , 9]);
	                        return [4 /*yield*/, device.claimInterface(interfaceNumber)];
	                    case 6:
	                        _a.sent();
	                        return [3 /*break*/, 9];
	                    case 7:
	                        e_1 = _a.sent();
	                        return [4 /*yield*/, device.close()];
	                    case 8:
	                        _a.sent();
	                        throw new TransportInterfaceNotAvailable(e_1.message);
	                    case 9:
	                        transport = new TransportWebUSB(device, interfaceNumber);
	                        onDisconnect = function (e) {
	                            if (device === e.device) {
	                                // $FlowFixMe
	                                navigator.usb.removeEventListener("disconnect", onDisconnect);
	                                transport._emitDisconnect(new DisconnectedDevice());
	                            }
	                        };
	                        // $FlowFixMe
	                        navigator.usb.addEventListener("disconnect", onDisconnect);
	                        return [2 /*return*/, transport];
	                }
	            });
	        });
	    };
	    /**
	     * Release the transport device
	     */
	    TransportWebUSB.prototype.close = function () {
	        return __awaiter(this, void 0, void 0, function () {
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, this.exchangeBusyPromise];
	                    case 1:
	                        _a.sent();
	                        return [4 /*yield*/, this.device.releaseInterface(this.interfaceNumber)];
	                    case 2:
	                        _a.sent();
	                        return [4 /*yield*/, gracefullyResetDevice(this.device)];
	                    case 3:
	                        _a.sent();
	                        return [4 /*yield*/, this.device.close()];
	                    case 4:
	                        _a.sent();
	                        return [2 /*return*/];
	                }
	            });
	        });
	    };
	    /**
	     * Exchange with the device using APDU protocol.
	     * @param apdu
	     * @returns a promise of apdu response
	     */
	    TransportWebUSB.prototype.exchange = function (apdu) {
	        return __awaiter(this, void 0, void 0, function () {
	            var b;
	            var _this = this;
	            return __generator(this, function (_a) {
	                switch (_a.label) {
	                    case 0: return [4 /*yield*/, this.exchangeAtomicImpl(function () { return __awaiter(_this, void 0, void 0, function () {
	                            var _a, channel, packetSize, framing, blocks, i, result, acc, r, buffer;
	                            return __generator(this, function (_b) {
	                                switch (_b.label) {
	                                    case 0:
	                                        _a = this, channel = _a.channel, packetSize = _a.packetSize;
	                                        log("apdu", "=> " + apdu.toString("hex"));
	                                        framing = hidFraming(channel, packetSize);
	                                        blocks = framing.makeBlocks(apdu);
	                                        i = 0;
	                                        _b.label = 1;
	                                    case 1:
	                                        if (!(i < blocks.length)) return [3 /*break*/, 4];
	                                        return [4 /*yield*/, this.device.transferOut(endpointNumber, blocks[i])];
	                                    case 2:
	                                        _b.sent();
	                                        _b.label = 3;
	                                    case 3:
	                                        i++;
	                                        return [3 /*break*/, 1];
	                                    case 4:
	                                        if (!!(result = framing.getReducedResult(acc))) return [3 /*break*/, 6];
	                                        return [4 /*yield*/, this.device.transferIn(endpointNumber, packetSize)];
	                                    case 5:
	                                        r = _b.sent();
	                                        buffer = Buffer$e.from(r.data.buffer);
	                                        acc = framing.reduceResponse(acc, buffer);
	                                        return [3 /*break*/, 4];
	                                    case 6:
	                                        log("apdu", "<= " + result.toString("hex"));
	                                        return [2 /*return*/, result];
	                                }
	                            });
	                        }); })["catch"](function (e) {
	                            if (e && e.message && e.message.includes("disconnected")) {
	                                _this._emitDisconnect(e);
	                                throw new DisconnectedDeviceDuringOperation(e.message);
	                            }
	                            throw e;
	                        })];
	                    case 1:
	                        b = _a.sent();
	                        return [2 /*return*/, b];
	                }
	            });
	        });
	    };
	    TransportWebUSB.prototype.setScrambleKey = function () { };
	    /**
	     * Check if WebUSB transport is supported.
	     */
	    TransportWebUSB.isSupported = isSupported;
	    /**
	     * List the WebUSB devices that was previously authorized by the user.
	     */
	    TransportWebUSB.list = getLedgerDevices;
	    /**
	     * Actively listen to WebUSB devices and emit ONE device
	     * that was either accepted before, if not it will trigger the native permission UI.
	     *
	     * Important: it must be called in the context of a UI click!
	     */
	    TransportWebUSB.listen = function (observer) {
	        var unsubscribed = false;
	        getFirstLedgerDevice().then(function (device) {
	            if (!unsubscribed) {
	                var deviceModel = identifyUSBProductId(device.productId);
	                observer.next({
	                    type: "add",
	                    descriptor: device,
	                    deviceModel: deviceModel
	                });
	                observer.complete();
	            }
	        }, function (error) {
	            if (window.DOMException &&
	                error instanceof window.DOMException &&
	                error.code === 18) {
	                observer.error(new TransportWebUSBGestureRequired(error.message));
	            }
	            else {
	                observer.error(new TransportOpenUserCancelled(error.message));
	            }
	        });
	        function unsubscribe() {
	            unsubscribed = true;
	        }
	        return {
	            unsubscribe: unsubscribe
	        };
	    };
	    return TransportWebUSB;
	}(Transport));
	function gracefullyResetDevice(device) {
	    return __awaiter(this, void 0, void 0, function () {
	        var err_1;
	        return __generator(this, function (_a) {
	            switch (_a.label) {
	                case 0:
	                    _a.trys.push([0, 2, , 3]);
	                    return [4 /*yield*/, device.reset()];
	                case 1:
	                    _a.sent();
	                    return [3 /*break*/, 3];
	                case 2:
	                    err_1 = _a.sent();
	                    console.warn(err_1);
	                    return [3 /*break*/, 3];
	                case 3: return [2 /*return*/];
	            }
	        });
	    });
	}

	var TransportWebUSB$1 = /*#__PURE__*/Object.freeze({
		__proto__: null,
		'default': TransportWebUSB
	});

	var inherits$2 = inherits_browser.exports;
	var HashBase = hashBase;
	var Buffer$1 = safeBuffer.exports.Buffer;

	var ARRAY16 = new Array(16);

	function MD5$1 () {
	  HashBase.call(this, 64);

	  // state
	  this._a = 0x67452301;
	  this._b = 0xefcdab89;
	  this._c = 0x98badcfe;
	  this._d = 0x10325476;
	}

	inherits$2(MD5$1, HashBase);

	MD5$1.prototype._update = function () {
	  var M = ARRAY16;
	  for (var i = 0; i < 16; ++i) M[i] = this._block.readInt32LE(i * 4);

	  var a = this._a;
	  var b = this._b;
	  var c = this._c;
	  var d = this._d;

	  a = fnF(a, b, c, d, M[0], 0xd76aa478, 7);
	  d = fnF(d, a, b, c, M[1], 0xe8c7b756, 12);
	  c = fnF(c, d, a, b, M[2], 0x242070db, 17);
	  b = fnF(b, c, d, a, M[3], 0xc1bdceee, 22);
	  a = fnF(a, b, c, d, M[4], 0xf57c0faf, 7);
	  d = fnF(d, a, b, c, M[5], 0x4787c62a, 12);
	  c = fnF(c, d, a, b, M[6], 0xa8304613, 17);
	  b = fnF(b, c, d, a, M[7], 0xfd469501, 22);
	  a = fnF(a, b, c, d, M[8], 0x698098d8, 7);
	  d = fnF(d, a, b, c, M[9], 0x8b44f7af, 12);
	  c = fnF(c, d, a, b, M[10], 0xffff5bb1, 17);
	  b = fnF(b, c, d, a, M[11], 0x895cd7be, 22);
	  a = fnF(a, b, c, d, M[12], 0x6b901122, 7);
	  d = fnF(d, a, b, c, M[13], 0xfd987193, 12);
	  c = fnF(c, d, a, b, M[14], 0xa679438e, 17);
	  b = fnF(b, c, d, a, M[15], 0x49b40821, 22);

	  a = fnG(a, b, c, d, M[1], 0xf61e2562, 5);
	  d = fnG(d, a, b, c, M[6], 0xc040b340, 9);
	  c = fnG(c, d, a, b, M[11], 0x265e5a51, 14);
	  b = fnG(b, c, d, a, M[0], 0xe9b6c7aa, 20);
	  a = fnG(a, b, c, d, M[5], 0xd62f105d, 5);
	  d = fnG(d, a, b, c, M[10], 0x02441453, 9);
	  c = fnG(c, d, a, b, M[15], 0xd8a1e681, 14);
	  b = fnG(b, c, d, a, M[4], 0xe7d3fbc8, 20);
	  a = fnG(a, b, c, d, M[9], 0x21e1cde6, 5);
	  d = fnG(d, a, b, c, M[14], 0xc33707d6, 9);
	  c = fnG(c, d, a, b, M[3], 0xf4d50d87, 14);
	  b = fnG(b, c, d, a, M[8], 0x455a14ed, 20);
	  a = fnG(a, b, c, d, M[13], 0xa9e3e905, 5);
	  d = fnG(d, a, b, c, M[2], 0xfcefa3f8, 9);
	  c = fnG(c, d, a, b, M[7], 0x676f02d9, 14);
	  b = fnG(b, c, d, a, M[12], 0x8d2a4c8a, 20);

	  a = fnH(a, b, c, d, M[5], 0xfffa3942, 4);
	  d = fnH(d, a, b, c, M[8], 0x8771f681, 11);
	  c = fnH(c, d, a, b, M[11], 0x6d9d6122, 16);
	  b = fnH(b, c, d, a, M[14], 0xfde5380c, 23);
	  a = fnH(a, b, c, d, M[1], 0xa4beea44, 4);
	  d = fnH(d, a, b, c, M[4], 0x4bdecfa9, 11);
	  c = fnH(c, d, a, b, M[7], 0xf6bb4b60, 16);
	  b = fnH(b, c, d, a, M[10], 0xbebfbc70, 23);
	  a = fnH(a, b, c, d, M[13], 0x289b7ec6, 4);
	  d = fnH(d, a, b, c, M[0], 0xeaa127fa, 11);
	  c = fnH(c, d, a, b, M[3], 0xd4ef3085, 16);
	  b = fnH(b, c, d, a, M[6], 0x04881d05, 23);
	  a = fnH(a, b, c, d, M[9], 0xd9d4d039, 4);
	  d = fnH(d, a, b, c, M[12], 0xe6db99e5, 11);
	  c = fnH(c, d, a, b, M[15], 0x1fa27cf8, 16);
	  b = fnH(b, c, d, a, M[2], 0xc4ac5665, 23);

	  a = fnI(a, b, c, d, M[0], 0xf4292244, 6);
	  d = fnI(d, a, b, c, M[7], 0x432aff97, 10);
	  c = fnI(c, d, a, b, M[14], 0xab9423a7, 15);
	  b = fnI(b, c, d, a, M[5], 0xfc93a039, 21);
	  a = fnI(a, b, c, d, M[12], 0x655b59c3, 6);
	  d = fnI(d, a, b, c, M[3], 0x8f0ccc92, 10);
	  c = fnI(c, d, a, b, M[10], 0xffeff47d, 15);
	  b = fnI(b, c, d, a, M[1], 0x85845dd1, 21);
	  a = fnI(a, b, c, d, M[8], 0x6fa87e4f, 6);
	  d = fnI(d, a, b, c, M[15], 0xfe2ce6e0, 10);
	  c = fnI(c, d, a, b, M[6], 0xa3014314, 15);
	  b = fnI(b, c, d, a, M[13], 0x4e0811a1, 21);
	  a = fnI(a, b, c, d, M[4], 0xf7537e82, 6);
	  d = fnI(d, a, b, c, M[11], 0xbd3af235, 10);
	  c = fnI(c, d, a, b, M[2], 0x2ad7d2bb, 15);
	  b = fnI(b, c, d, a, M[9], 0xeb86d391, 21);

	  this._a = (this._a + a) | 0;
	  this._b = (this._b + b) | 0;
	  this._c = (this._c + c) | 0;
	  this._d = (this._d + d) | 0;
	};

	MD5$1.prototype._digest = function () {
	  // create padding and handle blocks
	  this._block[this._blockOffset++] = 0x80;
	  if (this._blockOffset > 56) {
	    this._block.fill(0, this._blockOffset, 64);
	    this._update();
	    this._blockOffset = 0;
	  }

	  this._block.fill(0, this._blockOffset, 56);
	  this._block.writeUInt32LE(this._length[0], 56);
	  this._block.writeUInt32LE(this._length[1], 60);
	  this._update();

	  // produce result
	  var buffer = Buffer$1.allocUnsafe(16);
	  buffer.writeInt32LE(this._a, 0);
	  buffer.writeInt32LE(this._b, 4);
	  buffer.writeInt32LE(this._c, 8);
	  buffer.writeInt32LE(this._d, 12);
	  return buffer
	};

	function rotl (x, n) {
	  return (x << n) | (x >>> (32 - n))
	}

	function fnF (a, b, c, d, m, k, s) {
	  return (rotl((a + ((b & c) | ((~b) & d)) + m + k) | 0, s) + b) | 0
	}

	function fnG (a, b, c, d, m, k, s) {
	  return (rotl((a + ((b & d) | (c & (~d))) + m + k) | 0, s) + b) | 0
	}

	function fnH (a, b, c, d, m, k, s) {
	  return (rotl((a + (b ^ c ^ d) + m + k) | 0, s) + b) | 0
	}

	function fnI (a, b, c, d, m, k, s) {
	  return (rotl((a + ((c ^ (b | (~d)))) + m + k) | 0, s) + b) | 0
	}

	var md5_js = MD5$1;

	var Buffer = safeBuffer.exports.Buffer;
	var Transform = require$$1.Transform;
	var StringDecoder = string_decoder.StringDecoder;
	var inherits$1 = inherits_browser.exports;

	function CipherBase (hashMode) {
	  Transform.call(this);
	  this.hashMode = typeof hashMode === 'string';
	  if (this.hashMode) {
	    this[hashMode] = this._finalOrDigest;
	  } else {
	    this.final = this._finalOrDigest;
	  }
	  if (this._final) {
	    this.__final = this._final;
	    this._final = null;
	  }
	  this._decoder = null;
	  this._encoding = null;
	}
	inherits$1(CipherBase, Transform);

	CipherBase.prototype.update = function (data, inputEnc, outputEnc) {
	  if (typeof data === 'string') {
	    data = Buffer.from(data, inputEnc);
	  }

	  var outData = this._update(data);
	  if (this.hashMode) return this

	  if (outputEnc) {
	    outData = this._toString(outData, outputEnc);
	  }

	  return outData
	};

	CipherBase.prototype.setAutoPadding = function () {};
	CipherBase.prototype.getAuthTag = function () {
	  throw new Error('trying to get auth tag in unsupported state')
	};

	CipherBase.prototype.setAuthTag = function () {
	  throw new Error('trying to set auth tag in unsupported state')
	};

	CipherBase.prototype.setAAD = function () {
	  throw new Error('trying to set aad in unsupported state')
	};

	CipherBase.prototype._transform = function (data, _, next) {
	  var err;
	  try {
	    if (this.hashMode) {
	      this._update(data);
	    } else {
	      this.push(this._update(data));
	    }
	  } catch (e) {
	    err = e;
	  } finally {
	    next(err);
	  }
	};
	CipherBase.prototype._flush = function (done) {
	  var err;
	  try {
	    this.push(this.__final());
	  } catch (e) {
	    err = e;
	  }

	  done(err);
	};
	CipherBase.prototype._finalOrDigest = function (outputEnc) {
	  var outData = this.__final() || Buffer.alloc(0);
	  if (outputEnc) {
	    outData = this._toString(outData, outputEnc, true);
	  }
	  return outData
	};

	CipherBase.prototype._toString = function (value, enc, fin) {
	  if (!this._decoder) {
	    this._decoder = new StringDecoder(enc);
	    this._encoding = enc;
	  }

	  if (this._encoding !== enc) throw new Error('can\'t switch encodings')

	  var out = this._decoder.write(value);
	  if (fin) {
	    out += this._decoder.end();
	  }

	  return out
	};

	var cipherBase = CipherBase;

	var inherits = inherits_browser.exports;
	var MD5 = md5_js;
	var RIPEMD160 = ripemd160;
	var sha = sha_js.exports;
	var Base = cipherBase;

	function Hash (hash) {
	  Base.call(this, 'digest');

	  this._hash = hash;
	}

	inherits(Hash, Base);

	Hash.prototype._update = function (data) {
	  this._hash.update(data);
	};

	Hash.prototype._final = function () {
	  return this._hash.digest()
	};

	var browser = function createHash (alg) {
	  alg = alg.toLowerCase();
	  if (alg === 'md5') return new MD5()
	  if (alg === 'rmd160' || alg === 'ripemd160') return new RIPEMD160()

	  return new Hash(sha(alg))
	};

	var browser$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/_mergeNamespaces({
		__proto__: null,
		'default': browser
	}, [browser]));

	exports.Btc = Btc$1;
	exports.Log = index;
	exports.TransportWebUSB = TransportWebUSB$1;
	exports.createHash = browser$1;

	Object.defineProperty(exports, '__esModule', { value: true });

}));

window.Btc = NewLedger.Btc.default;
window.TransportWebUSB = NewLedger.TransportWebUSB.default;
window.Log = NewLedger.Log.default;
window.createHash = NewLedger.createHash.default;
