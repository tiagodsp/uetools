export type Handler<E> = (event: E) => void;

export class EventEmitter<E>{
    private _callbacks: Handler<E>[] = [];

    emit(e: E) {
        this._callbacks.forEach(callback => callback(e));
    }

    on(callback: (e: E) => void) {
        this._callbacks.push(callback);
    }
}