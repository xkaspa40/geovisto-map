/**
 * The Subject interface declares a set of methods for managing subscribers.
 */
export class Subject<CallbackParams> {
    private callbacks: Array<(params: CallbackParams) => void> = [];

    subscribe(callback: (params: CallbackParams) => void): void {
        this.callbacks.push(callback);
    }

    notify(params: CallbackParams): void {
        this.callbacks.forEach(callback => callback(params));
    }
}
