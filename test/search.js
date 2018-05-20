
import assert from 'assert';
import {iterateRules} from '../test/nameCheckingRules';

import CountryProvider from '../js/components/CountryProvider';

export default () => {
    describe('CountryProvider.checkCountryName()', function(){
        it ('matches all examples', function() {
            iterateRules((expectedResult, countryCode, inputName, searchResult) => {
                assert.equal(searchResult, expectedResult);
            });
        });
    });
}