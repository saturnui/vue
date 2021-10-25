export const isUrl = (v) => {
    let res = String(v).match(/https?:\/\/.*/g);
    return res ? true : 'is not valid';
};
