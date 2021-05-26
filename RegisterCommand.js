
/**
 * 一个简单的
 */
export class RegisterCommand {
    #commands = new Map();
    constructor(name, callback, thisArg) {
    }

    /**
     * 只调用一次
     */
    once () { }

    /**
     * 
     * @param {*} filterInternal 
     */
    getCommands (filterInternal) {
        return this.#commands.keys();
    }

    /**
     * 
     * @param {*} name 
     * @param {*} callback 
     * @param {*} thisArg this
     */
    registerCommand (name, callback, thisArg) {
        if (!name || typeof name !== 'string') return new Error('第一个参数类型错误, 应为 String');
        if (typeof callback !== 'function') return new Error('第二个参数类型错误, 应为 Function');

        this.#commands.set(name, callback.bind(thisArg))
    }

    /**
     * 
     * @param {*} name 
     */
    dispose (name) {
        if (!name || typeof name !== 'string') return new Error('第一个参数类型错误, 应为 String');

        this.#commands.delete(name);
    }

    /**
     * 
     * @param {*} name 
     * @param  {...any} args 
     */
    executeCommand (name, ...args) {
        if (!name || typeof name !== 'string') return new Error('第一个参数类型错误, 应为 String');

        let callback = this.#commands.get(name);
        callback && callback(args);
    }
}