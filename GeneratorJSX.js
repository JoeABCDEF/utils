import { modifyParams } from './utils';

// 实现绑定多级
export function bindMultilevel(opt, keys){
    if(!opt || !keys) return { value: opt, key: keys };
    typeof keys === 'string' && (keys = keys.split('.'));
    return keys.length === 1 ? { value: opt, key: keys[0] } : bindMultilevel(opt[keys[0]], keys.slice(1));
}

export function addDynamicComponent (tagName, { props, attrs, ons } = {}, modelData, data){
    const h = this?.$createElement;
    if(!h) return;

    let { value, key } = bindMultilevel(modelData.value, modelData.key);

    return <div
        onDrop={ ons.drop ? el => ons.drop(el, modelData, data) : () => {} }
        onDragover={ ons.allowDrop ? el => ons.allowDrop(el, modelData, data) : () => {} }
    >
        <tagName
            vModel_sync={ value[key] }
            { ...{
                props: { ...props },
                attrs: { ...attrs },
                on: {
                    ...modifyParams({ ...ons }, data)
                }
            } }
        />
    </div>;
}

export function addDynamicComponent_ (tagName, { props, attrs, ons } = {}, modelData, data){
    const h = this?.$createElement;
    if(!h) return;

    let { value, key } = bindMultilevel(modelData.value, modelData.key);
    return <tagName
        vModel_sync={ value[key] }
        { ...{
            props: { ...props },
            attrs: { ...attrs },
            on: { ...modifyParams({ ...ons }, data) }
        } }
    />;
}

function add_select({ props, attrs, ons } = {}, args, data, modelData){
    const h = this?.$createElement;
    if(!h) return;

    let { value, key } = bindMultilevel(modelData.value, modelData.key);

    return <el-select
        vModel_sync={ value[key] }
        { ...{
            props: { ...props },
            attrs: { ...attrs },
            on: { ...modifyParams({ ...ons }, data) }
        } }
    >
        {
            Array.isArray(args?.options) && args.options.map(opt =>
                <el-option
                    key={ opt[args?.key] }
                    label={ opt[args?.label] }
                    value={ opt[args?.value] }
                />)
        }
    </el-select>;
};

// 不对
function add_slot({ props, attrs, ons } = {}, { mode }, scope){
    return <slot
        name={ `_${ mode }` }
        { ...{
            props: { ...props },
            attrs: { ...attrs },
            on: { ...ons }
        } }
        scope={ scope }
    />;
}

function add_radioGroup({ props, attrs, ons, childTagName, childAttrs } = {}, args, data, modelData){
    const h = this?.$createElement;
    if(!h) return;

    let { value, key } = bindMultilevel(modelData.value, modelData.key);

    return <el-radio-group
        vModel={ value[key] }
        { ...{
            props: { ...props },
            attrs: { ...attrs },
            on: { ...ons }
        } }
    >
        {
            Array.isArray(args?.options) && args.options.map(opt =>
                <childTagName
                    label={ opt.label }
                    { ...{
                        props: { ...childAttrs?.props },
                        attrs: { ...childAttrs?.attrs },
                        on: { ...childAttrs?.ons }
                    } }
                >
                    { opt.name }
                </childTagName>
            )
        }
    </el-radio-group>;
}

export default{
    add_select,
    add_slot,
    add_radioGroup
};