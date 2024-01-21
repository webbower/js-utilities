const createPrototypeDescriptor = value => {
  if (typeof value === 'function') {
    return {
      value,
      writable: true,
      configurable: true,
    };
  }

  // TODO handle object descriptor values to allow intermixing of proto definition
  return { value };
};

const AnonymousModel = (data = {}) => {
  return Object.assign(Object.create(AnonymousModel.prototype), data);
};

Object.assign(AnonymousModel, {
  prototype: Object.assign(Object.create(Object.prototype), {
    constructor: AnonymousModel,
    /**
     * Call signatures:
     * - inst.update('key', newValue)
     * - inst.update(inst => ({
     *     key: inst.key === 'foo' ? 1 : 2,
     *   }));
     * - inst.update({
     *     key: newValue,
     *     other: otherValue,
     *   });
     */
    update(...args) {
      const newFields =
        args.length === 2
          ? // 2-arg signature to update a single key
            { [args[0]]: args[1] }
          : typeof args[0] === 'function'
          ? // Function-style dynamic update
            args[0](this)
          : // Object partial merge
            Object(args[0]);

      return this.constructor({
        ...this,
        ...newFields,
      });
    },
    map(fn = x => x) {
      return this.constructor(fn(this));
    },
  }),
  /**
   * Create a subclass of the Model class that is connected in the prototype chain to all parent classes
   *
   * @param {Function} ctor The constructor function that returns an object with instance own props
   * @param {Object} [config={}] An object with additional definitions for the new Model
   * @param {string} config.name The name of the Model
   * @param {Object} config.proto The prototype object of the Model
   * @param {Object} config.stat Static properties and functions on the Model constructor
   * @returns {Function} The new Model constructor
   */
  extend(ctor, { name = null, proto = {}, stat = {} } = {}) {
    const parent = this;

    const constructor = (data = {}) => {
      return Object.create(
        constructor.prototype,
        Object.entries(ctor(data)).reduce(
          (descriptors, [key, value]) => ((descriptors[key] = { value, enumerable: true }), descriptors),
          {}
        )
      );
    };

    const protoDescriptors = Object.entries(proto).reduce(
      (final, [key, value]) => ((final[key] = createPrototypeDescriptor(value)), final),
      {}
    );

    // TODO Smarten prototype symbol handling
    Object.getOwnPropertySymbols(proto).forEach(sym => {
      if (sym === Symbol.iterator) {
        protoDescriptors[sym] = {
          value: proto[sym],
          writable: true,
          configurable: true,
        };
      } else if (sym === Symbol.toPrimitive) {
        protoDescriptors[sym] = {
          value: proto[sym],
          configurable: true,
        };
      } else {
        protoDescriptors[sym] = {
          value: proto[sym],
        };
      }
    });

    constructor.prototype = Object.create(parent.prototype, {
      constructor: createPrototypeDescriptor(constructor),
      ...protoDescriptors,
    });

    // TODO handle symbol keys
    const statDescriptors = Object.entries(stat).reduce(
      (final, [key, value]) => ((final[key] = createPrototypeDescriptor(value)), final),
      {}
    );

    const ctorName = `${name || ctor.name || 'Unnamed'}Model`;
    return Object.defineProperties(constructor, {
      name: { value: ctorName },
      ...statDescriptors,
    });
  },
});

export { AnonymousModel as Model };
