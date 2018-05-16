
import preparedList from '../../countriesList/countriesPrepared.json';

export default class CountryProvider {

    /**
     * Checks whether the given countryName corresponds to any real countries
     *
     * If country is found, then return it's country code. Return null otherwise
     *
     * @param {string} countryName
     * @returns null|string
     */
    static checkCountryName(countryName) {

        if (!countryName) {
            return null;
        }

        countryName = CountryProvider.prepareName(countryName.toString().trim());

        if (!countryName.length) {
            return null;
        }

        return Object.keys(preparedList).find(countryCode => {
            const countryData = preparedList[countryCode];

            return countryName === CountryProvider.prepareName(countryData.shortName)
                || countryName === CountryProvider.prepareName(countryData.fullName)
                || countryData.aliases.find(alias => countryName === CountryProvider.prepareName(alias));
        });
    }

    static prepareName(countryName) {
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

