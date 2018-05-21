import CountryProvider from "../js/components/CountryProvider";

/**
 * Array of string check assumptions
 * key is the country code
 * first array is the strings that should match the country of the given country code
 * second array is the strings that should not match the country (i.e. return 'null' as a result)
 */
export const defaultRules = {
    TCD: [
        ['чад'],
        ['чак', 'ад', 'сад'],
    ],
    IRQ: [
        ['ирак'],
        ['ирас', 'ира', 'иракк'],
    ],
    BRB: [
        ['барбадос', 'бврбадос', 'ьарбадос'],
        ['брбадос', 'ьврбадос'],
    ],
    BLR: [
        ['беларусь', 'беларусб', 'республика беларусь'],
        ['белпрусб', 'беларус'],
    ],
    BEN: [
        ['республика белиз', 'республик бенин', 'республика бениз'],
        ['респблика бениз']
    ],
    VGB: [
        ['британские виргинские острова', 'британские виригнские острова'],
        ['британсские виргнские остров'],
    ],
    IOT: [
        ['британская территория в индийском океане', 'британская территория в индийском окане'],
        []
    ],
};

export const iterateRules = (callback, rules = defaultRules) => {
    for (const countryRule of Object.entries(rules)) {
        const countryCode = countryRule[0];
        const matchingNames = countryRule[1][0];
        const mismatchingNames = countryRule[1][1];

        for (const name of matchingNames) {
            const checkResult = CountryProvider.checkCountryName(name).result;

            callback(countryCode, countryCode, name, checkResult);
        }

        for (const name of mismatchingNames) {
            const checkResult = CountryProvider.checkCountryName(name).result;

            callback(null, countryCode, name, checkResult);
        }
    }

};
