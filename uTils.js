/**
 * @desc 根据 枚举 生成 Array<Object>
 */
const AccordingEnumToList = (_enum, cb) =>
    Object.entries(_enum).map(
        cb
        ||
        (([key, val]) => ({
            value: key,
            label: val
        }))
    )

export {
    AccordingEnumToList
}