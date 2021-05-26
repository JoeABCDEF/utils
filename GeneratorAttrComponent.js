/**
 * 简单的生成
 * @param {*} param0
 * @param {*} param1
 * @returns
 */
export const formItemGenerator = params => {
    if(!params.tagName) return;
    let { formProps, formAttrs, formOns } = params.formItemAttrs || {};
    let { tagProps, tagAttrs, tagOns, childTagName, childAttrs } = params.tagAttrs || {};

    return {
        ...params,
        formItemAttrs: {
            props: {
                ...formProps
            },
            attrs: {
                ...formAttrs
            },
            ons: {
                ...formOns
            }
        },
        tagAttrs: {
            childTagName,
            childAttrs: {
                props: {
                    ...childAttrs?.props
                },
                attrs: {
                    ...childAttrs?.tagAttrs
                },
                ons: {
                    ...childAttrs?.tagOns
                }
            },
            props: {
                ...tagProps
            },
            attrs: {
                ...tagAttrs
            },
            ons: {
                ...tagOns
            }
        }
    };
};

// 表单 Input 简化操作 函数 简单的初始化默认
export const formItemInput = ({ model, label }) => formItemGenerator(
    {
        tagName: 'el-input',
        model,
        formItemAttrs: {
            formProps: {
                label
            }
        },
        tagAttrs: {
            tagProps: {
                label,
                clearable: true,
                placeholder: "请输入",
            }
        }
    }
);

// 表单 Input-Number 简化操作 函数
export const formItemInputNumber = ({ model, label, max, min, step, precision }) => formItemGenerator(
    {
        tagName: 'el-input-number',
        model,
        formItemAttrs: {
            formProps: {
                label
            }
        },
        tagAttrs: {
            tagProps: {
                placeholder: "请输入",
                max: max || 999999,
                min: min || 0,
                step: step || 1,
                precision: precision || 0
            }
        }
    }
);

// 表单 el-color-picker 简化操作 函数
export const formItemColorPicker = ({ model, label }) => formItemGenerator(
    {
        tagName: 'el-color-picker',
        model,
        formItemAttrs: {
            formProps: {
                label
            }
        }
    }
);

// 表单 el-switch 简化操作 函数
export const formItemSwitch = ({ model, label }) => formItemGenerator(
    {
        tagName: 'el-switch',
        model,
        formItemAttrs: {
            formProps: {
                label
            }
        }
    }
);

// 表单 el-select 简化操作 函数
export const formItemSelect = ({ model, label, key, value, label_, options }) => formItemGenerator(
    {
        tagName: 'select',
        model,
        key: key || 'value',
        label: label_ || 'label',
        value: value || 'value',
        options: options || [],
        formItemAttrs: {
            formProps: {
                label
            }
        },
        tagAttrs: {
            tagProps: {
                placeholder: "请输入",
            }
        }
    }
);

// 表单 el-radio-group 简化操作 函数
export const formItemRadioGroupRadio = ({ model, label, childTagName, options }) => formItemGenerator(
    {
        tagName: 'radio-group',
        model,
        options: options || [],// { label: '', name:'' }  固定写法
        formItemAttrs: {
            formProps: {
                label
            }
        },
        tagAttrs: {
            childTagName: childTagName || 'el-radio',
        }
    }
);