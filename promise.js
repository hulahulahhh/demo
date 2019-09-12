const PENDING = "PENDING";
const FULLFILLED = "FULLFILLED";
const REJECTED = "REJECTED";

class MyPromise {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new Error("executor must be a function");
    }
    this.$state = PENDING;
    this.$chained = [];
    const resolve = res => {
      if (this.$state !== PENDING) {
        return;
      }
      this.$state = FULLFILLED;
      this.$internalValue = res;
      for (const { onFulfilled } of this.$chained) {
        onFulfilled(res);
      }
    };
    const reject = res => {
      if (this.$state !== PENDING) {
        return;
      }
      this.$state = REJECTED;
      this.$internalValue = res;
      for (const { onRejected } of this.$chained) {
        onRejected(err);
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFullfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const _onRejected = err => {
        try {
          reject(onRejected(err));
        } catch (_err) {
          reject(_err);
        }
      };
      const _onFullfilled = res => {
        try {
          resolve(onFullfilled(this.$internalValue));
        } catch (err) {
          reject(err);
        }
      };
      if (this.$state === PENDING) {
        this.$chained.push({ onFullfilled, onRejected });
      } else if (this.$state === REJECTED) {
        _onRejected(this.$internalValue);
      } else {
        _onFullfilled(this.$internalValue);
      }
    });
  }
}

const p = new MyPromise((resolve, reject) => {
  resolve(1);
});

p.then(res => {
  console.log(res);
  return new MyPromise((resolve, reject) => {
    resolve("new");
  });
}).then(res => {
  console.log(res);
});
