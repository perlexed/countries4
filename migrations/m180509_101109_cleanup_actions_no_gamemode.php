<?php

use yii\db\Migration;

/**
 * Class m180509_101109_cleanup_actions_no_gamemode
 */
class m180509_101109_cleanup_actions_no_gamemode extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $this->delete('actions', [
            'gameMode' => null,
        ]);
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        echo "m180509_101109_cleanup_actions_no_gamemode cannot be reverted.\n";

        return false;
    }
}
