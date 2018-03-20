<?php

namespace app\components;


use yii\web\IdentityInterface;

class User extends \yii\web\User
{
    /**
     * @return IdentityInterface|null
     */
    public function getIdentityFromCookie()
    {
        $data = $this->getIdentityAndDurationFromCookie();

        return empty($data['identity'])
            ? null
            : $data['identity'];
    }
}