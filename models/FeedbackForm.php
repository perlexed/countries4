<?php

namespace app\models;

use Yii;
use yii\base\Model;

class FeedbackForm extends Model
{
    public $visitorEmail;
    public $text;

    /**
     * @return array the validation rules.
     */
    public function rules()
    {
        return [
            [['visitorEmail', 'text'], 'string'],
            ['text', 'required'],
            ['visitorEmail', 'email', 'skipOnEmpty' => true],
        ];
    }

    public function sendFeedback()
    {
        return $this->validate()
            && Yii::$app->mailer->compose()
                ->setTo(Yii::$app->params['adminEmail'])
                ->setSubject('New \'Countries\' feedback')
                ->setFrom([Yii::$app->params['appEmail'] => Yii::$app->name])
                ->setTextBody(<<<EOT
User email: {$this->visitorEmail}


User feedback:
{$this->text}
EOT
                )
                ->send();
    }
}
