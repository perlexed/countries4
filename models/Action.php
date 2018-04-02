<?php

namespace app\models;

use app\enums\ActionType;
use yii\behaviors\TimestampBehavior;
use yii\helpers\ArrayHelper;

/**
 * This is the model class for table "actions".
 *
 * @property integer $id
 * @property integer $createdAt
 * @property integer $userId
 * @property string $gameUid
 * @property string $actionType
 * @property string $countryName
 */
class Action extends \yii\db\ActiveRecord
{
    /**
     * @inheritdoc
     */
    public static function tableName()
    {
        return 'actions';
    }

    public function behaviors()
    {
        return [
            [
                'class' => TimestampBehavior::className(),
                'updatedAtAttribute' => false,
                'createdAtAttribute' => 'createdAt',
            ],
        ];
    }

    /**
     * @inheritdoc
     */
    public function rules()
    {
        return [
            [['createdAt', 'userId'], 'integer'],
            [['gameUid', 'actionType', 'countryName'], 'string', 'max' => 255],
        ];
    }

    /**
     * @inheritdoc
     */
    public function attributeLabels()
    {
        return [
            'id' => 'ID',
            'createdAt' => 'Created At',
            'userId' => 'User ID',
            'gameUid' => 'Game Uid',
            'actionType' => 'Action Type',
            'countryName' => 'Country Name',
        ];
    }

    /**
     * @param integer $userId
     * @return array
     */
    public static function getHistoryForUser($userId)
    {
        $userActions = self::find()->where([
            'userId' => $userId,
        ])->asArray()->all();

        if (!count($userActions)) {
            return [];
        }

        $actionsByGame = ArrayHelper::index($userActions, null, 'gameUid');

        $actionsByGame = array_filter($actionsByGame, function($key) {
            return !!$key;
        }, ARRAY_FILTER_USE_KEY);

        if (!count($actionsByGame)) {
            return [];
        }

        $gamesData = array_reduce($actionsByGame, function($correctGames, $gameActions) {
            $actionTypes = ArrayHelper::getColumn($gameActions, 'actionType');

            if (!ArrayHelper::isSubset([ActionType::GAME_START, ActionType::GAME_STOP], $actionTypes)) {
                return $correctGames;
            }

            $indexedActions = ArrayHelper::index($gameActions, null, 'actionType');
            $startAction = $indexedActions[ActionType::GAME_START][0];

            $correctGames[$startAction['gameUid']] = [
                'startTimestamp' => (int) $startAction['createdAt'],
                'startDate' => date('Y-m-d H:i', (int) $startAction['createdAt']),
                'gameLength' => $indexedActions[ActionType::GAME_STOP][0]['createdAt'] - $startAction['createdAt'],
                'countriesMatched' => count($indexedActions[ActionType::COUNTRY_SUCCESS_SUBMIT]),
            ];

            return $correctGames;
        }, []);

        ArrayHelper::multisort($gamesData, 'startTimestamp', SORT_DESC);

        return $gamesData;
    }
}
