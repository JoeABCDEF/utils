/**
 * @desc 根据 枚举 生成 Array<Object>
 */
export const AccordingEnumToList = (_enum, cb) =>
    Object.entries(_enum).map(
        cb
        ||
        (([key, val]) => ({
            value: key,
            label: val
        }))
    )

/**
* @desc 节流
* @param {*} fn
* @param {*} wait
* @returns
*/
export const throttle = (fn, wait = 600, IsDefaultThisArgs = true) => {
    let timeId = null;
    let context = this;
    return function () {
        let args = arguments;
        clearTimeout(timeId);
        timeId = setTimeout(() => fn.apply(IsDefaultThisArgs ? context : this, args), wait);
    };
}

export function resizeObserver (el, cb = () => { }, time = 720) {
    if (!el) return;
    const resizeObserver = new ResizeObserver(throttle(cb, time));
    // resizeObserver?.observe(el);
    resizeObserver ? resizeObserver.observe(el) : '';
    return resizeObserver;
}

export class interval {
    static #timeIds = new Map();
    static #id = 0;

    /**
     * time 1000时间
     * isAhead 是否先行
     */
    static #options = { time: 1000, isAhead: true };
    static _interval (fn, { time, isAhead } = this.#options, id) {
        clearTimeout(this.#timeIds.get(id));
        isAhead && fn();
        this.#timeIds.set(id, setTimeout(() => {
            !isAhead && fn();
            this._interval(fn, { time, isAhead }, id)
        }, time));
    }
    static setInterval (fn, options) {
        this.#id ++;
        if (typeof fn !== 'function') throw new Error(`${fn} is not a function`)
        this.#timeIds.set(this.#id, this._interval(fn, options, this.#id));
        return this.#id;
    }
    static clearInterval (id) {
        clearTimeout(this.#timeIds.get(id));
        this.#timeIds.delete(id);
    }
}

/**
 * @description 找到并且返回当前的 并且可以终止
 * @param {Object} arr
 * @param {Object} cb
 */
function find (arr, cb) {
    if (!Array.isArray(arr)) return null;
    for (let i = 0; i < arr.length; i++) {
        if (!cb) return null;
        let res = cb && cb(arr[i]);
        if (res) return res;
    }
}

/**
 * @description 获取对应的ID
 * @param {Object} url
 * @param {Object} type
 */
export function getElementAuthId (url, type = "BUTTON") {
    const Authority = JSON.parse(localStorage.getItem('Admin-Authority') || sessionStorage.getItem('Admin-Authority'));

    function findId (arr, url) {
        return find(arr, o => {
            if (o.type === type && o.url === url) return o;
            return findId(o.childrenElement, url) || findId(o.childrenPage, url) || findId(o.children, url) || null;
        })
    }

    return findId(Authority, url);
}