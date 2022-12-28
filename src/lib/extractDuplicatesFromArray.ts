const extractDuplicates = (arr: any[], key: string) => {
    const duplicates = arr.filter((item, index) => {
        return arr.indexOf(item) !== index;
    })

    const dupes = [...new Set(duplicates)];
    const rest = arr.filter(item => !dupes.includes(item));
    return [dupes, rest];
}

export default extractDuplicates;