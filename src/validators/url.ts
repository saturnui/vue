export const isUrl = (v: string) => {
  let res = String(v).match(/https?:\/\/.*/g)
  return res ? true : 'is not valid'
}
