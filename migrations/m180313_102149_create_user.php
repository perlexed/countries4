<?php

use yii\db\Migration;

/**
 * Class m180313_102149_create_user
 */
class m180313_102149_create_user extends Migration
{
    /**
     * @inheritdoc
     */
    public function safeUp()
    {
        $this->createTable('user', [
            'id' => $this->primaryKey(),
            'authKey' => $this->string(),
            'createdAt' => $this->integer(11),
        ]);
    }

    /**
     * @inheritdoc
     */
    public function safeDown()
    {
        $this->dropTable('user');
    }
}
