<?php

namespace app\controllers;


use app\models\Action;
use app\models\FeedbackForm;
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

        return \Yii::$app->user->login($userIdentity, 365 * 24 * 60 * 60);
    }

    public function actionIndex()
    {
        return $this->render('index', [
            'history' => Action::getHistoryForUser(Yii::$app->user->getIdentity()->getId()),
        ]);
    }

    public function actionApiLogAction()
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        $action = new Action([
            'userId' => Yii::$app->user->getIdentity()->getId(),
            'gameUid' => Yii::$app->request->post('gameUid'),
            'actionType' => Yii::$app->request->post('actionType'),
            'countryName' => Yii::$app->request->post('countryName'),
            'gameMode' => Yii::$app->request->post('gameMode'),
        ]);

        return $action->save();
    }

    public function actionApiUpdateHistory()
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        return Action::getHistoryForUser(Yii::$app->user->getIdentity()->getId());
    }

    public function actionSendFeedback()
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        $feedbackForm = new FeedbackForm([
            'text' => Yii::$app->request->post('text'),
            'visitorEmail' => Yii::$app->request->post('email'),
        ]);

        return $feedbackForm->sendFeedback();
    }

}