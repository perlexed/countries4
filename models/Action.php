<?php

namespace app\models;

use Yii;
use yii\behaviors\TimestampBehavior;

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
}
