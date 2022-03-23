/**
 * Extracted from source package because it included "tslib" as a dependency
 * "tslib" ended up taking about ~40% of the resulting package size of brynja
 * Source package: https://github.com/blakeembrey/change-case
 * Source license:
 * The MIT License (MIT)
 *
 * Copyright (c) 2014 Blake Embrey (hello@blakeembrey.com)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

// Support camel case ("camelCase" -> "camel Case" and "CAMELCase" -> "CAMEL Case").
const DEFAULT_SPLIT_REGEXP = [/([a-z0-9])([A-Z])/g, /([A-Z])([A-Z][a-z])/g];

// Remove all non-word characters.
const DEFAULT_STRIP_REGEXP = /[^A-Z0-9]+/gi;


const replace = (input: string, re: RegExp | RegExp[], value: string) => {
    if (re instanceof RegExp) return input.replace(re, value);
    return re.reduce((input, re) => input.replace(re, value), input);
}

export const paramCase = (input: string) => {
    const splitRegexp = DEFAULT_SPLIT_REGEXP;
    const stripRegexp = DEFAULT_STRIP_REGEXP;
    const transform = (v: string) => v.toLowerCase();
    const delimiter = '-';

    const result = replace(
        replace(input, splitRegexp, '$1\0$2'),
        stripRegexp,
        '\0'
    );
    let start = 0;
    let end = result.length;

    // Trim the delimiter from around the output string.
    while (result.charAt(start) === '\0') start++;
    while (result.charAt(end - 1) === '\0') end--;

    // Transform each token independently.
    return result.slice(start, end).split('\0').map(transform).join(delimiter);
}
