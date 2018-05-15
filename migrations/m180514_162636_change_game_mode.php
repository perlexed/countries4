<?php

use yii\db\Migration;

/**
 * Class m180514_162636_change_game_mode
 */
class m180514_162636_change_game_mode extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $this->update('actions', [
            'gameMode' => 'min2',
        ], [
            'gameMode' => '2min',
        ]);
        $this->update('actions', [
            'gameMode' => 'min10',
        ], [
            'gameMode' => '10min',
        ]);
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        $this->update('actions', [
            'gameMode' => '2min',
        ], [
            'gameMode' => 'min2',
        ]);
        $this->update('actions', [
            'gameMode' => '10min',
        ], [
            'gameMode' => 'min10',
        ]);
    }
}
