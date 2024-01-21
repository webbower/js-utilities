// deno-lint-ignore-file
import { describe } from 'riteway';

import { Model } from './Model.js';

describe('Model()', async assert => {
  {
    const inst = Model({ foo: 'bar' });
    assert({
      given: 'an object of data',
      should: 'return a Model instance with that data',
      actual: [
        Object.getPrototypeOf(inst), // Prototype is correct
        { ...inst }, // Confirm raw, enumerable data fields
        typeof inst.map, // Check for base Model method
        typeof inst.update, // Check for base Model method
      ],
      expected: [Model.prototype, { foo: 'bar' }, 'function', 'function'],
    });
  }
});

describe('Model#update()', async assert => {
  {
    const inst = Model({ foo: 'bar', quux: 'blah' });
    const updated = inst.update({ foo: 'baz', bar: 'sneh' });
    assert({
      given: 'an object with a subset of fields on the Model',
      should: 'return a new instance of the Model with the provided fields added or updated',
      actual: [
        inst !== updated, // Immutable: original and updated are not same reference
        Object.getPrototypeOf(updated), // Object wrapper is persisted
        { ...updated }, // Fields are set correctly
      ],
      expected: [true, Object.getPrototypeOf(inst), { foo: 'baz', bar: 'sneh', quux: 'blah' }],
    });
  }
  {
    const inst = Model({ foo: 'bar', quux: 'blah' });
    const updated = inst.update('foo', 'baz');
    assert({
      given: '2 argument signature with an existing field name and new value',
      should: 'return a new instance of the Model with the specified field updated',
      actual: [
        inst !== updated, // Immutable: original and updated are not same reference
        Object.getPrototypeOf(updated), // Object wrapper is persisted
        { ...updated }, // Fields are set correctly
      ],
      expected: [true, Object.getPrototypeOf(inst), { foo: 'baz', quux: 'blah' }],
    });
  }
  {
    const inst = Model({ foo: 'bar', quux: 'blah' });
    const updated = inst.update('bar', 'sneh');
    assert({
      given: '2 argument signature with a new field name and a value',
      should: 'return a new instance of the Model with the specified field added',
      actual: [
        inst !== updated, // Immutable: original and updated are not same reference
        Object.getPrototypeOf(updated), // Object wrapper is persisted
        { ...updated }, // Fields are set correctly
      ],
      expected: [true, Object.getPrototypeOf(inst), { foo: 'bar', quux: 'blah', bar: 'sneh' }],
    });
  }
  {
    const inst = Model({ foo: 'bar', quux: 'blah' });
    const updated = inst.update(current => ({
      foo: current.foo.length,
      bar: 'sneh',
    }));
    assert({
      given:
        'function argument signature that converts a string field to a number and adds a new field',
      should: 'return a new instance of the Model with the returned fields added and/or updated',
      actual: [
        inst !== updated, // Immutable: original and updated are not same reference
        Object.getPrototypeOf(updated), // Object wrapper is persisted
        { ...updated }, // Fields are set correctly
      ],
      expected: [true, Object.getPrototypeOf(inst), { foo: 3, quux: 'blah', bar: 'sneh' }],
    });
  }
});

describe('Model.extend()', async assert => {
  const rand = () => Math.random().toString().split('.')[1];
  const User = Model.extend(function User({
    id = rand(),
    username = 'anonymous',
    email = 'nobody@example.com',
  } = {}) {
    return { id, username, email };
  });

  assert({
    given: 'a named constructor function for the Model subclass',
    should: 'return a new Model constructor',
    actual: [
      { ...User({ id: '12345', username: 'testuser', email: 'somebody@example.com' }) },
      Object.getPrototypeOf(User()),
      User() instanceof User,
      User.name,
      User().update({ id: '12345' }),
    ],
    expected: [
      { id: '12345', username: 'testuser', email: 'somebody@example.com' },
      User.prototype,
      true,
      'UserModel',
      User({ id: '12345' }),
    ],
  });

  assert({
    given: 'a named constructor function with a `name` config value',
    should: 'set the resulting Model subclass name based on the `name` config',
    actual: Model.extend(
      function Foo() {
        return {};
      },
      { name: 'Bar' }
    ).name,
    expected: 'BarModel',
  });

  assert({
    given: 'an anonymous constructor function',
    should: 'set the resulting Model subclass name to the default name',
    actual: Model.extend(() => ({})).name,
    expected: 'UnnamedModel',
  });

  {
    const proto = {
      isEmpty() {
        return this.value === '';
      },
      [Symbol.toPrimitive]() {
        return this.value;
      },
    };
    const SubModel = Model.extend(
      function Sub({ value = '' }) {
        return { value };
      },
      { proto }
    );
    assert({
      given: 'extending with a `proto` config object',
      should:
        'set `proto` to be the prototype of the Model subclass with all properties and symbols',
      actual: [
        SubModel.prototype.isEmpty === proto.isEmpty,
        SubModel().isEmpty(),
        SubModel.prototype[Symbol.toPrimitive] === proto[Symbol.toPrimitive],
      ],
      expected: [true, true, true],
    });
  }

  {
    // TODO handle symbol keys
    const instSymbol = Symbol('SubModel');
    // const instSymbol = '@@SubModel';
    const stat = {
      isSubModel(value) {
        return value != null && value[instSymbol] === true;
      },
    };
    const proto = {
      [instSymbol]: true,
    };
    const SubModel = Model.extend(
      function Sub({ value = '' }) {
        return { value };
      },
      { proto, stat }
    );
    assert({
      given: 'a `stat` config object',
      should: 'add all defined properties to constructor as "static" values',
      actual: [SubModel.isSubModel === stat.isSubModel, SubModel.isSubModel(SubModel())],
      expected: [true, true],
    });
  }
});
