interface FileObject {
    type?: string;
    extension?: string;
}
declare const fileTypeAcceptable: (accepts: string[] | null, file: FileObject) => boolean;
export default fileTypeAcceptable;
