import { EventEmitter } from "./EventDispatcher";
import { UnrealEngineProject } from "../types";

/**
 * Uunreal Tools context singleton class
 */
export class Context {
    // members
    private static _instance: Context;

    private _data: Map<string, any> = new Map();

    private _events = {
        onProjectChanged: new EventEmitter<UnrealEngineProject>(),
    };

    // methods

    private constructor() { }

    public static instance() {
        if (!Context._instance) {
            Context._instance = new Context();
        }
        return this._instance;
    }

    public static get(key: string) {
        return Context.instance()._data.get(key);
    }

    public static set(key: string, value: any) {
        Context.instance()._data.set(key, value);
    }

    public static get events() {
        return Context.instance()._events;
    }
}