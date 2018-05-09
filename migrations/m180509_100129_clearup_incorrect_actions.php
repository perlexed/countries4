<?php

use yii\db\Migration;

/**
 * Class m180509_100129_clearup_incorrect_actions
 */
class m180509_100129_clearup_incorrect_actions extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $this->delete('actions', [ 'gameUid' => null ]);
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        echo "m180509_100129_clearup_incorrect_actions cannot be reverted.\n";

        return false;
    }
}
