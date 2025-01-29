/* eslint-disable prefer-template */
const fileSizeReadable = (size: number): string => {
    if (size >= 1_000_000_000) {
       return Math.ceil(size / 1_000_000_000) + 'GB'
    }
 
    if (size >= 1_000_000) {
       return Math.ceil(size / 1_000_000) + 'MB'
    }
 
    if (size >= 1_000) {
       return Math.ceil(size / 1_000) + 'KB'
    }
 
    return Math.ceil(size) + 'B'
 }
 /* eslint-enable prefer-template */
 
 export default fileSizeReadable
 