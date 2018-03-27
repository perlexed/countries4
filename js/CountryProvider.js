
import _isArray from 'lodash/isArray';
import _filter from 'lodash/filter';
import _forEach from 'lodash/forEach';

export default class CountryProvider {

    static countryAliases = {
        BOL: 'Боливия',
        VEN: 'Венесуэла',
        IRN: 'Иран',
        FSM: 'Микронезия',
        MDA: 'Молдова',
        PSE: 'Палестина',
        VAT: 'Ватикан',
        GBR: 'Великобритания',
        SYR: 'Сирия',
        CZE: 'Чехия',
        CAF: 'ЦАР',
        TZA: 'Танзания',
        TWN: 'Тайвань',
        MKD: 'Македония',
        PRK: ['Северная Корея', 'КНДР'],
        KOR: 'Южная Корея',
        LBY: 'Ливия',
        DOM: 'Доминикана',
        BRN: 'Бруней',
        CCK: 'Кокосовые острова',
        GUF: 'Гвиана',
        PYF: 'Полинезия',
        FLK: 'Фолклендские острова'
    };

    // @todo Add aliases to these countries if needed
    static exceptionalCountries = [
        {
            "name": "Американское Самоа",
            "fullName": "",
            "code": "ASM"
        },
        {
            "name": "Антигуа и Барбуда",
            "fullName": "",
            "code": "ATG"
        },
        {
            "name": "Бонайре, Саба и Синт-Эстатиус",
            "fullName": "",
            "code": "BES"
        },
        {
            "name": "Британская территория в Индийском океане",
            "fullName": "",
            "code": "IOT"
        },
        {
            "name": "Виргинские острова, Британские",
            "fullName": "Британские Виргинские острова",
            "code": "VGB"
        },
        {
            "name": "Виргинские острова, США",
            "fullName": "Виргинские острова Соединенных Штатов",
            "code": "VIR"
        },
        {
            "name": "Коморы",
            "fullName": "Союз Коморы",
            "code": "COM"
        },
        {
            "name": "Конго",
            "fullName": "Республика Конго",
            "code": "COG"
        },
        {
            "name": "Конго, Демократическая Республика",
            "fullName": "Демократическая Республика Конго",
            "code": "COD"
        },
        {
            "name": "Кот д'Ивуар",
            "fullName": "Республика Кот д'Ивуар",
            "code": "CIV"
        },
        {
            "name": "Малые Тихоокеанские отдаленные острова Соединенных Штатов",
            "fullName": "",
            "code": "UMI"
        },
        {
            "name": "Маршалловы острова",
            "fullName": "Республика Маршалловы острова",
            "code": "MHL"
        },
        {
            "name": "Остров Мэн",
            "fullName": "",
            "code": "IMN"
        },
        {
            "name": "Остров Норфолк",
            "fullName": "",
            "code": "NFK"
        },
        {
            "name": "Остров Рождества",
            "fullName": "",
            "code": "CXR"
        },
        {
            "name": "Остров Херд и острова Макдональд",
            "fullName": "",
            "code": "HMD"
        },
        {
            "name": "Острова Кайман",
            "fullName": "",
            "code": "CYM"
        },
        {
            "name": "Острова Кука",
            "fullName": "",
            "code": "COK"
        },
        {
            "name": "Острова Теркс и Кайкос",
            "fullName": "",
            "code": "TCA"
        },
        {
            "name": "Папуа-Новая Гвинея",
            "fullName": "",
            "code": "PNG"
        },
        {
            "name": "Сан-Томе и Принсипи",
            "fullName": "Демократическая Республика Сан-Томе и Принсипи",
            "code": "STP"
        },
        {
            "name": "Святая Елена, Остров вознесения, Тристан-да-Кунья",
            "fullName": "",
            "code": "SHN"
        },
        {
            "name": "Северные Марианские острова",
            "fullName": "Содружество Северных Марианских островов",
            "code": "MNP"
        },
        {
            "name": "Сент-Винсент и Гренадины",
            "fullName": "",
            "code": "VCT"
        },
        {
            "name": "Сент-Китс и Невис",
            "fullName": "",
            "code": "KNA"
        },
        {
            "name": "Сент-Пьер и Микелон",
            "fullName": "",
            "code": "SPM"
        },
        {
            "name": "Французские Южные территории",
            "fullName": "",
            "code": "ATF"
        },
        {
            "name": "Шпицберген и Ян Майен",
            "fullName": "",
            "code": "SJM"
        },
        {
            "name": "Южная Джорджия и Южные Сандвичевы острова",
            "fullName": "",
            "code": "SGS"
        },
    ];

    constructor() {
        this._sourceList = window.COUNTRIES_LIST;
        this._preparedList = this.prepareList(this._sourceList);
    }

    /**
     * Checks whether the given countryName corresponds to any real countries
     *
     * If country is found, then return it's country code. Return null otherwise
     *
     * @param {string} countryName
     * @returns null|string
     */
    check(countryName) {

        if (!countryName) {
            return null;
        }

        countryName = CountryProvider.prepareName(countryName.toString().trim());

        if (!countryName.length) {
            return null;
        }

        return Object.keys(this._preparedList).find(countryCode => {
            const countryData = this._preparedList[countryCode];

            return countryName === CountryProvider.prepareName(countryData.shortName)
                || countryName === CountryProvider.prepareName(countryData.fullName)
                || countryData.aliases.find(alias => countryName === CountryProvider.prepareName(alias));
        });
    }

    prepareList(sourceList) {
        return sourceList.reduce((countriesObject, countryElement) => {

            const aliases = CountryProvider.countryAliases[countryElement.code] || [];

            return Object.assign(countriesObject, {
                [countryElement.code]: {
                    shortName: countryElement.name,
                    fullName: countryElement.fullName,
                    aliases: _isArray(aliases) ? aliases : [aliases],
                }
            });
        }, {})
    }

    getHumanName(countryCode) {
        const countryData = this._preparedList[countryCode];

        return countryData.aliases.length ? countryData.aliases[0] : countryData.shortName;
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

    getByCode(countryCode) {
        return this._sourceList.find(countryData => countryData.code === countryCode);
    }

    getRestCountries(matchedCountriesCodes) {
        return Object.keys(this._preparedList)
            .filter(countryCode => matchedCountriesCodes.indexOf(countryCode) === -1)
            .map(countryCode => this._preparedList[countryCode].aliases.length
                ? this._preparedList[countryCode].aliases[0]
                : this._preparedList[countryCode].shortName).sort();
    }

}

