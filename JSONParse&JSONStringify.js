/**
 * 自己stringify 配合 自己的 parse
 */


class StringifyValue {
    #as; //私有属性
    static groupN = 0;// 增加平衡组
    constructor() { }

    static getStringify (val, num) {
        this.groupN = num || 0;
        let typeName = Object.prototype.toString.call(val);
        return `${this[typeName] ? this[typeName](val) : ''}`;
    }

    // 标识符
    static getIdent (num) {
        return num && `&${num}&` || '';
    }

    static '[object Array]' (obj) {
        const _num = ++this.groupN;
        const ident = this.getIdent(_num);
        return `${ident}[${obj.reduce((all, val, i) => {
            all += `${this.getStringify(val, _num)}${i !== obj.length - 1 && ',' || ''}`;
            return all;
        }, "")
            }]${ident}`;
    }
    static '[object Object]' (obj) {
        const _num = ++this.groupN;
        const ident = this.getIdent(_num);
        return `${ident}{${Object.keys(obj).reduce((all, val, i) => {
            all += `"${val}":${this.getStringify(obj[val], _num)}${i !== Object.keys(obj).length - 1 && ',' || ''}`;
            return all;
        }, "")
            }}${ident}`;
    }
    static '[object Function]' (val) {
        // return `"return ${val}"`;
        return `"${val}"`;
    }
    static '[object Boolean]' (val) {
        return val;
    }
    static '[object Null]' (val) {
        return val;
    }
    static '[object Undefined]' (val) {
        return val;
    }
    static '[object String]' (val) {
        return `"${val}"`;
    }
    static '[object Number]' (val) {
        return val;
    }
    // static '[object Symbol]'(val){
    //     return `${ val }`;
    // }
}
/**
 * str.replace(/\"(\w+)\": \"(.+?)\"(}|,)/gi,function(a,b,c){
 *  console.log(b,c)
 *  obj[b]=c
 *  })
 */
// [...'$1GROUP1${a: 456}$1GROUP1$,$1GROUP1${a: 123}$1GROUP1$'.matchAll(/(?<=\$1GROUP1\$)(?![,]).*?(?=\$1GROUP1\$)/g)]
/**在进行设计前先做好 草稿
 * 数组 组合正则
 *      Number Boolean Null Undefined 型 ,null|undefined|true|false|[0-9].[0-9]|[0-9], null|undefined|true|false|[0-9].[0-9]|[0-9], ,null|undefined|true|false|[0-9].[0-9]|[0-9]
 *
 *      String ,\".*\", ,\".*\" \".*\",
 *
 *      Array  ,\[.*\], \[.*\], ,\[.*\] \[\[.*\]\]
 *
 *      Object  ,{.*}, {.*}, ,\{.*\} \[\{.*\}\]
 * [...a.matchAll(/\".*\":\".*\"|({|\[.*\]|})|{.*}|null|undefined|true|false|[0-9].[0-9]|[0-9]/g)]
 * 对象 组合正则
 *      \".*\":
 *      \".*\"|^[_0-9a-zA-Z]*$:
 *                              \".*\"|({|\[.*\]|})|{.*}|null|undefined|true|false|[0-9].[0-9]|[0-9]
 */
// [...`"asd":"sasd", "123":"312", "123sadas ":"312","asd":true`
// .matchAll(/(?=\").*?\":((\".*?\")|true)/g)]
class ParseJSON {
    // static isObjectRegTest = new RegExp(/^{.*}$/);
    // static objectRegMatch = new RegExp(/(?<=\").*?\":\".*?\"|(?<=\").*?\":true|false|null|undefined|(?<=\").*?\":(?=\&\{2\}\&\{|\&\[2\]\&\[).*?(?<=\}\&\{2\}\&|\]\&\[2\]\&)/g);
    // static objectRegMatch = new RegExp(/(?<=^{\").*?:.*?(?<=\])|(?<=^{\").*?:.*?(?=}$|,\")|(?<=,\").*?:.*?(?=}$|,\")/g);
    // static isArrayRegTest = new RegExp(/^\[.*\]$/);
    // static arrayRegMatch = new RegExp(/(?<=\[|,|,\"|,\[).*?((?=,|\])|(?<=}))|(?<=\[|,\[).*?(?<=\]|\],)/g);
    static isFuncRegTest = new RegExp(/^return .*$/);

    static groupN = 1;// 增加平衡组
    // static isStringRegTest = new RegExp(/^\".*\"$/);
    constructor() { }

    static getParseJSON (obj, num) {
        this.groupN = num || 1;
        // let { isObjectRegTest, isArrayRegTest } = this;
        const ident = this.getObjectTestRegExp(this.groupN);
        const isObjectRegTest = new RegExp(`^${ident[0]}{.*}${ident[1]}$`);
        const isArrayRegTest = new RegExp(`^${ident[0]}\\[.*\\]${ident[1]}$`);
        console.dir('-----------------getParseJSON-----------------');
        console.dir(ident);
        const funcName = isObjectRegTest.test(obj) && 'parseObject' || isArrayRegTest.test(obj) && 'parseArray';
        console.dir(obj);
        console.dir(funcName);
        console.dir(isArrayRegTest);
        console.dir('-----------------getParseJSON-----------------');
        if (funcName)
            return this[funcName] && this[funcName](obj);
        else
            return this.ordinaryFunc(obj);
    }

    // 标识符
    static getObjectTestRegExp (num) {
        return num && [`\\&${num}\\&`, `\\&${num}\\&`] || ['!', '!'];
    }

    static parseObject (val) {
        const _num = ++this.groupN;
        let ident = this.getObjectTestRegExp(_num);
        const objectRegMatch = new RegExp(`(?=\").*?\":\".*?\"|(?=\").*?\":true|false|null|undefined|(?=\").*?\":[0-9]*(?=,|\})|(?=\").*?\":${ident[0]}.*?${ident[1]}`, 'g');
        console.log('------------parseObject-----------');
        console.dir(_num);
        return [...val.matchAll(objectRegMatch)].reduce((all, res) => {
            if (!res || !res[0]) return all;
            let key = /(?<=\").*?(?=\":)/g.exec(res[0])[0];
            let val = /(?<=\":).*((?=\"$)|(.*))/g.exec(res[0]);
            console.dir(res);
            console.dir(key);
            console.dir(val);
            console.log('-----------parseObject------------');
            // let val_ = new RegExp(`(?<=${ ident[0] }).*(?=${ ident[1] })`,'g').exec(val)
            all[key] = this.getParseJSON(val ? val[0] : '', _num);
            return all;
        }, {});
    }
    static parseArray (val) {
        const _num = ++this.groupN;
        let ident = this.getObjectTestRegExp(_num);
        const arrayRegMatch = new RegExp(`${ident[0]}.*?${ident[1]}|true|false|undefined|null|\".*?\"|[0-9]{1,}(?=,|\])`, 'g');
        console.log('-----------parseArray------------');
        console.dir([...val.matchAll(arrayRegMatch)]);
        return [...val.matchAll(arrayRegMatch)].reduce((all, res) => {
            console.dir(all);
            console.dir(res);
            if (!res || !res[0] || res[0] === ',') return all;
            console.log('-----------parseArray------------');
            all.push(this.getParseJSON(res[0], _num));
            return all;
        }, []);
    }
    static ordinaryFunc (val) {
        console.dir(val);
        // return this.isFuncRegTest.test(val) && new Function(val)() || new Function(`return ${val}`)();
        return new Function(`return ${val}`)();
    }
}
[...'"asd":&2&{}&2&'.matchAll(/\".*\":\&2\&{}\&2\&/g)];
// 模拟 平衡组 可以在生产 JSON的时候 实现 存在问题
// let N = 0;
// '{{}{{}}{{}}}'.replace(/({|})/g, function($0,$1){
//     if($1=="{"){ return "<b"+(++N)+">"}
//     if($1=="}"){ return "</b"+ (N--) +">"}
// });

// (?=\").*?(?<=\")|(true|false|null|undefined)

// `&{1}&{
//     "a":"123",
//     "d":&{2}&{}&{2}&,
//     "sd":&[2]&[&{3}&{"a":&{4}&{"d":&[5]&[123,123,&[6]&[]&[6]&]&[5]&}&{4}&}&{3}&]&[2]&,
//     "c":&{2}&{"sd":&[3]&[]&[3]&,"c":&{3}&{}&{3}&,"d":&{3}&{}&{3}&}&{2}&
// }&{1}&`

// `&{1}&{"a":"123","d":&{2}&{}&{2}&,"sd":&[2]&[&{3}&{"a":&{4}&{"d":&[5]&[123,123,&[6]&[]&[6]&]&[5]&}&{4}&}&{3}&]&[2]&,"c":&{2}&{"sd":&[3]&[]&[3]&,"c":&{3}&{}&{3}&,"d":&{3}&{}&{3}&}&{2}&}&{1}&

// \&\{2\}\&`

// `"sd":&[2]&[&{3}&{"a":&{4}&{"d":&[5]&[123,123,&[6]&[]&[6]&]&[5]&}&{4}&}&{3}&]&[2]&,"c":&{2}&{"sd":&[3]&[]&[3]&,"c":&{3}&{}&{3}&,"d":&{3}&{}&{3}&}&{2}&`
// .matchAll(/(?<=\").*?\":(?=\&\{2\}\&\{|\&\[2\]\&\[).*?(?<=\}\&\{2\}\&|\]\&\[2\]\&)/g)

export const parseJSON = ParseJSON.getParseJSON.bind(ParseJSON);
export const stringifyValue = StringifyValue.getStringify.bind(StringifyValue);