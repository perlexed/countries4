<?php

namespace app\controllers;


use yii\web\Controller;
use yii\web\Response;
use Yii;

class GameController extends Controller
{
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