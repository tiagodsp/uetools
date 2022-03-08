declare global {
	interface Window {
		acquireVsCodeApi: Function;
        WORKSPACE_URI: string;
        EXTENSION_URI: string;
	}
}

interface VSCodeApi {
    getState(): any;
    setState(state: any): void;
    postMessage(message: any): void;
}

export default class VSCodeWrapper {
    private static readonly _vscodeApi: VSCodeApi = window.acquireVsCodeApi();

    /**
     * Send a message to the VsCode.
     * @param message The message to send.
     */
    public static postMessage(message: any) {
        this._vscodeApi.postMessage(message);
    }

    /**
     * Add a listener for message from the VsCode to the extension.
     * @param callback The callback to be invoked when a message is received.
     * @return A function that can be invoked to remove the listener.
    */
    public static onMessage(callback: (message: any) => void) {
        window.addEventListener('message', callback);
        return () => window.removeEventListener('message', callback);
    }

    public static get workspaceUri() {
        return window.WORKSPACE_URI;
    }

    public static get extensionUri() {
        return window.EXTENSION_URI;
    }
}