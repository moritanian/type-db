export declare class ProcessQueue {
    private isProcessing;
    private queue;
    push(fn: () => Promise<void>): Promise<void>;
    private process;
}
