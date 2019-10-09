import sha1 from 'sha1';

// This is used to ensure that no hash begins with a number, since CSS selectors cant start with numbers
const prefix = 'brynja-';
export const objHash = (obj: object) => prefix + sha1(JSON.stringify(obj));
