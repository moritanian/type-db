"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessQueue = void 0;
class ProcessQueue {
    constructor() {
        this.isProcessing = false;
        this.queue = [];
    }
    push(fn) {
        return new Promise((resolve) => {
            this.queue.push(() => {
                return fn().then(() => {
                    resolve();
                });
            });
            this.process();
        });
    }
    process() {
        if (this.isProcessing || this.queue.length === 0) {
            return;
        }
        this.isProcessing = true;
        const fn = this.queue.shift();
        if (fn) {
            fn().then(() => {
                this.isProcessing = false;
                this.process();
            });
        }
    }
}
exports.ProcessQueue = ProcessQueue;
//# sourceMappingURL=processQueue.js.map