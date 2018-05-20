
import {iterateRules} from '../test/nameCheckingRules';

/**
 * Iterate over the name checking rules and show mismatches
 */
iterateRules((expectedResult, countryCode, inputName, searchResult) => {
    if (expectedResult !== searchResult) {
        console.log(`input '${inputName}', expected ${expectedResult} got ${searchResult}`);
    }
});