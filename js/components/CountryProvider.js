
import levenshtein from 'fast-levenshtein';

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

        const fuzzySearchResult = CountryProvider._levenshteinSearch(countryName);

        if (!fuzzySearchResult.length) {
            return {
                exactMatch: false,
                result: null,
            }
        }

        const fuzzySearchItem = fuzzySearchResult[0];

        return {
            exactMatch: fuzzySearchItem.minimumDistance === 0,
            result: fuzzySearchItem.code,
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
     * Fuzzy search using the Levenshtein distance
     *
     * @param inputCountryName
     * @returns {{code: string, minimumDistance: number}[]}
     * @private
     */
    static _levenshteinSearch(inputCountryName) {

        // Search softens with the larger input string
        const minSearchDistance = (stringLength => {
            if (stringLength < 16) {
                return 1;
            } else if (stringLength < 30) {
                return 2;
            } else {
                return 3;
            }
        })(inputCountryName.length);

        return Object.entries(preparedList).map(countryArray => {
            /** @var {{shortName: string, fullName: string, aliases: string[]}} countryData **/
            const countyData = countryArray[1];

            // Collect all the counry names
            const stringsToCompare = [
                countyData.shortName,
                ...countyData.aliases,
            ].concat(countyData.fullName ? [countyData.fullName] : []);

            const minimumDistance = stringsToCompare.reduce(
                (currentMinimumDistance, countryName) => {
                    const nameDistance = levenshtein.get(inputCountryName, CountryProvider._prepareName(countryName));

                    return currentMinimumDistance === -1 || nameDistance < currentMinimumDistance
                        ? nameDistance
                        : currentMinimumDistance;
                }, -1
            );

            return {
                code: countryArray[0],
                minimumDistance: minimumDistance,
            };
        })
        .filter(distancesData => distancesData.minimumDistance <= minSearchDistance)
        .sort((distancesData1, distancesData2) => {
            if (distancesData1.minimumDistance > distancesData2.minimumDistance) {
                return 1;
            } else if (distancesData1.minimumDistance < distancesData2.minimumDistance) {
                return -1;
            } else {
                return 0;
            }
        });
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

