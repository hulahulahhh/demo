const PENDING = 'PENDING'
const FULLFILLED = 'FULLFILLED'
const REJECTED = 'REJECTED'

class MyPromise {
    constructor(executor) {
        if (typeof executor !== 'function') {
            throw 
        }
        this.$state = PENDING
        this.$chained = []
        const resolve = (res) => {
            if (this.$state !== PENDING) {
                return;
            }
            this.$state = FULLFILLED
            this.$internalValue = res
            for (const { onFulfilled } of this.$chained) {
                onFulfilled(res);
            }
        }
        const reject = (res) => {
            if (this.$state !== PENDING) {
                return;
            }
            this.$state = REJECTED
            this.$internalValue = res
            for (const { onRejected } of this.$chained) {
                onRejected(err);
            }
        }

        try {
            executor(resolve, reject)  
        } catch (error) {
            reject(error)
        }
    }

    then(onFullfilled, onRejected) {
        if (this.$state === PENDING) {
            this.$chained.push({onFullfilled, onRejected})
        } else if (this.$state === REJECTED) {
            onRejected(this.$internalValue)
        } else {
            onFullfilled(this.$internalValue)
        }
    }
}