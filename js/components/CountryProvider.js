
import Fuse from 'fuse.js';

import preparedList from '../../countriesList/countriesPrepared.json';

export default class CountryProvider {

    /**
     * Checks whether the given countryName corresponds to any real countries
     *
     * If country is found, then return it's country code. Return null otherwise
     *
     * @param {string} countryName
     * @returns {{exactMatch: boolean, result: string|null}}
     *          exactMatch - is the match exact (symbol by symbol) or fuzzy. false when there's no result found
     *          result - the check result itself
     */
    static checkCountryName(countryName) {
        countryName = countryName.trim();

        if (!countryName) {
            return {
                exactMatch: false,
                result: null,
            };
        }

        // Use simple strict search for short strings
        if (countryName.length <= 7) {
            const strictSearchResult = CountryProvider._strictNameCheck(countryName);
            return {
                exactMatch: strictSearchResult !== null,
                result: strictSearchResult,
            };
        }

        const fuzzySearchResult = CountryProvider._fuzzySearch(countryName);

        if (!fuzzySearchResult.length) {
            return {
                exactMatch: false,
                result: null,
            }
        }

        const fuzzySearchItem = fuzzySearchResult[0];

        return {
            exactMatch: fuzzySearchItem.score === 0,
            result: fuzzySearchItem.item.code,
        };
    }

    /**
     * Strict check (but trim/remove punctuation)
     *
     * @param {string} countryName
     * @returns {string|null}
     * @private
     */
    static _strictNameCheck(countryName) {
        countryName = CountryProvider._prepareName(countryName);

        if (!countryName.length) {
            return null;
        }

        const matchingCountryHash = Object.entries(preparedList).find(countryArray => {
            return countryName === CountryProvider._prepareName(countryArray[1].shortName)
                || countryName === CountryProvider._prepareName(countryArray[1].fullName)
                || countryArray[1].aliases.find(alias => countryName === CountryProvider._prepareName(alias));
        });

        return matchingCountryHash ? matchingCountryHash[0] : null;
    }

    /**
     * Fuzzy search countries
     * Return the result of the Fuse.search() function (array of the matching countries object along with search score)
     *
     * @param {string} countryName
     * @returns {array}
     * @private
     */
    static _fuzzySearch(countryName) {
        const fuseCountriesList = Object.entries(preparedList).map(countryArray => ({
            code: countryArray[0],
            info: countryArray[1],
        }));

        // Variate search sensitivity with the input string length
        const getThreshold = stringLength => {
            if (stringLength < 12) {
                return 0.15;
            }

            if (stringLength < 18) {
                return 0.12;
            }

            return 0.07;
        };

        const fuse = new Fuse(fuseCountriesList, {
            shouldSort: true,
            includeScore: true,
            maxPatternLength: 50,
            threshold: getThreshold(countryName.length),
            location: 0,
            distance: 0,
            keys: [
                'info.fullName',
                'info.shortName',
                'info.aliases',
            ]
        });

        return fuse.search(countryName);
    }

    /**
     * Simplify country name input to soften the strict search
     *
     * @param countryName
     * @returns {string}
     * @private
     */
    static _prepareName(countryName) {
        return countryName
            .toLowerCase()
            // Removing punctuation
            .replace(new RegExp('[\'\-\,\-]', 'g'), ' ')
            // Trimming multiple spaces
            .replace(new RegExp(' {2,}', 'g'), ' ')
            .replace(new RegExp('ё', 'g'), 'е')
            .replace(new RegExp('й', 'g'), 'и')
            ;
    }

    static getPreparedByCode(countryCode) {
        return preparedList[countryCode];
    }

    static getRestCountries(matchedCountriesCodes) {
        return Object.keys(preparedList)
            .filter(countryCode => matchedCountriesCodes.indexOf(countryCode) === -1)
            .map(countryCode => CountryProvider.getNameByCode(countryCode)).sort();
    }

    static getNameByCode(countryCode) {
        return preparedList[countryCode].aliases.length
            ? preparedList[countryCode].aliases[0]
            : preparedList[countryCode].shortName;
    }

}

