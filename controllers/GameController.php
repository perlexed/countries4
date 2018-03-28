<?php

namespace app\controllers;


use app\models\Action;
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

    public function actionApiLogAction()
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        $action = new Action([
            'userId' => \Yii::$app->user->getIdentity()->getId(),
            'gameUid' => \Yii::$app->request->post('gameUid'),
            'actionType' => \Yii::$app->request->post('actionType'),
            'countryName' => \Yii::$app->request->post('countryName'),
        ]);

        return $action->save();
    }

}