
export class ProcessQueue {
  private isProcessing: boolean = false;
  private queue: (() => Promise<void>)[] = [];
  push(fn: () => Promise<void>) {
    return new Promise<void>((resolve) => {
      this.queue.push(() => {
        return fn().then(() => {
          resolve();
        });
      });
      this.process();
    });

  }
  private process() {
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
