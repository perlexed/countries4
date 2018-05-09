<?php

use yii\db\Migration;

/**
 * Class m180508_144918_action_add_game_mode
 */
class m180508_144918_action_add_game_mode extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $this->addColumn('actions', 'gameMode', $this->string());
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        $this->dropColumn('actions', 'gameMode');
    }
}
