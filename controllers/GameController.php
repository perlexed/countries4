<?php

namespace app\controllers;


use app\models\User;
use yii\web\Controller;
use yii\web\Response;
use Yii;

class GameController extends Controller
{
    public function beforeAction($action)
    {
        if (!parent::beforeAction($action)) {
            return false;
        }

        if (\Yii::$app->user->getIdentityFromCookie() !== null) {
            return true;
        }

        $userIdentity = new User();
        $userIdentity->save();

        return \Yii::$app->user->login($userIdentity, 1000);
    }

    public function actionIndex()
    {
        return $this->render('index');
    }

    public function actionApiSendCountry()
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        return [
            'checkResult' => $this->checkCountry(Yii::$app->request->post('country')) === true,
        ];
    }

    protected function checkCountry($countryInputString)
    {
        if (!$countryInputString) {
            return false;
        }

        return in_array($countryInputString, [
            'qwe',
            'asd',
            'zxc',
        ]);
    }
}