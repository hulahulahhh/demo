// 部署iterator接口例子
const iteratorDemo = {
  [Symbol.iterator]() {
    // Symbol.iterator就是一个遍历器生成函数
    // return的必须是一个遍历器对象（包含next方法），因此实现Symbol.iterator最简单方式还是通过generator函数， generator函数本身也是遍历器生成函数
    // 因为调用generator函数本身就会返回一个遍历器对象
    return {
      next: function() {
        return {
          value: 1,
          done: false
        };
      }
    };
  }
};

const helloWorld = {
  *[Symbol.iterator]() {
    yield "hello";
    yield "world";
    return "ending";
  }
};

for (const x of helloWorld) {
  console.log(x);
}

// 通过部署iterator接口实现斐波那次序列
const fibonacci = {
  *[Symbol.iterator]() {
    let [prev, curr] = [0, 1];
    for (;;) {
      yield curr;
      [prev, curr] = [curr, prev + curr];
    }
  }
};

for (const x of fibonacci) {
  if (x > 1000) break;
  console.log(x);
}

// 使得对象可迭代
function* objectIterator() {
  const keys = Object.keys(this);
  // ReferenceError: yield is not defined
  //   不能在普通函数里使用yield关键字
  //   keys.forEach(key => {
  //     yield[(key, this[key])];
  //   });

  for (const key of keys) {
    yield [key, this[key]];
  }
}

let obj = {
  a: "1",
  b: "2",
  c: "3"
};

let obj1 = {
  val1: "sss",
  val2: "hhh",
  val3: "uuu"
};

Object.prototype[Symbol.iterator] = objectIterator;
// Object.prototype[Symbol.iterator] = 'not a function'

for (const [key] of obj) {
  console.log(key);
}

for (const [key] of obj1) {
  console.log(key);
}

// test 外部传人iterator是否会覆盖里面的iterator  result： 不会
class MyClass {
  constructor(obj) {
    this.name = "shu";
    Object.assign(this, obj);
  }

  [Symbol.iterator]() {
    const keys = Object.keys(this);
    let i = 0;
    return (function*() {
      if (i >= keys.length) {
        return;
      }
      yield keys[i++];
    })();
  }
}

const obj3 = new MyClass({ [Symbol.iterator]: "not a function" });

MyClass.prototype = {
  [Symbol.iterator]: "not a function"
};

for (const key in obj3) {
  console.log(key);
}

console.log(obj3);
console.log(Symbol.iterator);

const symbol1 = Symbol();
const obj4 = {
  [symbol1]: 1
};
obj4[symbol1] = 2;
console.log(Object.getOwnPropertySymbols(obj4));
