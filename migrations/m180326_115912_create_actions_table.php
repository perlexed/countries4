<?php

use yii\db\Migration;

/**
 * Handles the creation of table `actions`.
 */
class m180326_115912_create_actions_table extends Migration
{
    /**
     * @inheritdoc
     */
    public function up()
    {
        $this->createTable('actions', [
            'id' => $this->primaryKey(),
            'createdAt' => $this->integer(11),
            'userId' => $this->integer(),
            'gameUid' => $this->string(),
            'actionType' => $this->string(),
            'countryName' => $this->string(),
        ]);
    }

    /**
     * @inheritdoc
     */
    public function down()
    {
        $this->dropTable('actions');
    }
}
