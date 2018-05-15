<?php

namespace app\helpers;


use app\enums\ActionType;
use app\enums\GameMode;
use app\models\Action;
use yii\db\Query;

class StatisticsHelper
{
    public static function getStatistics()
    {
        // @todo consider only correct games (has a beginning and an end, and has at least 1 country)

        return [
            'avgCountriesCount' => self::getAverageCountriesCount(),
            'popularCountries' => self::getPopularCountries(),
        ];
    }

    /**
     * Get average countries count for each game mode
     *
     * @return array [
     *      'min2' => <averageCountriesNumber>,
     *      'min10' => <averageCountriesNumber>,
     * ]
     */
    protected static function getAverageCountriesCount()
    {
        $gameModes = [GameMode::MIN2, GameMode::MIN10];

        return array_map(function($gameMode) {
            return (int) Action::find()
                ->select('gameUid')
                ->where(['gameMode' => $gameMode])
                ->distinct()
                ->count();
        }, array_combine($gameModes, $gameModes));
    }

    /**
     * Calculate for each country the percentage of it's frequency - the percentage of games that this country is
     * entered in
     *
     * Countries are ordered by the percentage
     *
     * @return array
     */
    protected static function getPopularCountries()
    {
        $totalGamesCount = Action::find()
            ->select('gameUid')
            ->where(['actionType' => ActionType::COUNTRY_SUCCESS_SUBMIT])
            ->distinct()
            ->count();

        if (!$totalGamesCount) {
            return [];
        }

        $popularCountriesRawData = (new Query())
            ->select(['countryName', 'count' => 'COUNT(*)'])
            ->from(Action::tableName())
            ->where(['actionType' => ActionType::COUNTRY_SUCCESS_SUBMIT])
            ->groupBy('countryName')
            ->orderBy(['count' => SORT_DESC])
            ->limit(5)
            ->all();

        return array_map(function($countryData) use ($totalGamesCount) {
            return [
                'code' => $countryData['countryName'],
                'percentage' => round((((int) $countryData['count']) * 100) / $totalGamesCount),
            ];
        }, $popularCountriesRawData);
    }

}