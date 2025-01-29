const fileExtension = (file: { name: string }): string => {
    const extensionSplit = file.name.split('.')
    if (extensionSplit.length > 1) {
       return extensionSplit[extensionSplit.length - 1]
    }
 
    return 'none'
 }
 
 export default fileExtension
 