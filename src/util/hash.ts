/**
 * Source: https://gist.github.com/jlevy/c246006675becc446360a798e2b2d781
 * This is a simple, *insecure* hash that's short, fast, and has no dependencies.
 * For algorithmic use, where security isn't needed, it's way simpler than sha1 (and all its deps)
 * or similar, and with a short, clean (base 36 alphanumeric) result.
 * Loosely based on the Java version; see
 * https://stackoverflow.com/questions/6122571/simple-non-secure-hash-function-for-javascript
 */
 const hashString = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash &= hash; // Convert to 32bit integer
    }
    return new Uint32Array([hash])[0].toString(36);
};

// This is used to ensure that no hash begins with a number, since CSS selectors cant start with numbers
const prefix = 'brynja-';
export const objHash = (obj: object) => prefix + hashString(JSON.stringify(obj));
