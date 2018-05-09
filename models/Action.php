<?php

namespace app\models;

use app\enums\ActionType;
use app\enums\GameMode;
use yii\behaviors\TimestampBehavior;
use yii\helpers\ArrayHelper;
use yii\db\ActiveRecord;

/**
 * This is the model class for table "actions".
 *
 * @property integer $id
 * @property integer $createdAt
 * @property integer $userId
 * @property string $gameUid
 * @property string $actionType
 * @property string $countryName
 * @property string $gameMode
 */
class Action extends ActiveRecord
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
            [['gameUid', 'actionType', 'countryName', 'gameMode'], 'string', 'max' => 255],
            ['gameMode', 'in', 'range' => GameMode::getKeys()],
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
            'gameMode' => 'Game Mode',
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

        // Group action by gameUid
        $actionsByGame = ArrayHelper::index($userActions, null, 'gameUid');

        if (!count($actionsByGame)) {
            return [];
        }

        $gamesData = array_reduce($actionsByGame, function($correctGames, $gameActions) {
            $actionTypes = ArrayHelper::getColumn($gameActions, 'actionType');

            // Consider a game correct if it has beginning and end
            if (!ArrayHelper::isSubset([ActionType::GAME_START, ActionType::GAME_STOP], $actionTypes)) {
                return $correctGames;
            }

            $indexedActions = ArrayHelper::index($gameActions, null, 'actionType');
            $startAction = $indexedActions[ActionType::GAME_START][0];

            $gameMode = $startAction['gameMode'];

            // Skip game if game mode is wrong
            if (!in_array($gameMode, GameMode::getKeys())) {
                return $correctGames;
            }

            // Skip game if no actions with the correct country submit
            if (empty($indexedActions[ActionType::COUNTRY_SUCCESS_SUBMIT])) {
                return $correctGames;
            }

            $gameLength = $indexedActions[ActionType::GAME_STOP][0]['createdAt'] - $startAction['createdAt'];


            if ($gameLength > GameMode::getGameModeLength($gameMode)) {
                $gameLength = GameMode::getGameModeLength($gameMode);
            }

            $correctGames[$startAction['gameUid']] = [
                'startTimestamp' => (int) $startAction['createdAt'],
                'startDate' => date('Y-m-d H:i', (int) $startAction['createdAt']),
                'gameLength' => $gameLength,
                'countriesMatched' => count($indexedActions[ActionType::COUNTRY_SUCCESS_SUBMIT]),
            ];

            return $correctGames;
        }, []);

        ArrayHelper::multisort($gamesData, 'startTimestamp', SORT_DESC);

        return $gamesData;
    }
}
