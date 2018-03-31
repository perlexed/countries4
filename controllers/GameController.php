<?php

namespace app\controllers;


use app\enums\ActionType;
use app\models\Action;
use app\models\User;
use yii\helpers\ArrayHelper;
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
            'history' => $this->getHistory(),
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
        ]);

        return $action->save();
    }

    public function actionApiUpdateHistory()
    {
        Yii::$app->response->format = Response::FORMAT_JSON;

        return $this->getHistory();
    }

    /**
     * @return array
     */
    protected function getHistory()
    {
        $userActions = Action::find()->where([
            'userId' => \Yii::$app->user->getIdentity()->getId(),
        ])->asArray()->all();

        if (!count($userActions)) {
            return [];
        }

        $actionsByGame = ArrayHelper::index($userActions, null, 'gameUid');

        $actionsByGame = array_filter($actionsByGame, function($key) {
            return !!$key;
        }, ARRAY_FILTER_USE_KEY);

        if (!count($actionsByGame)) {
            return [];
        }

        $gamesData = array_reduce($actionsByGame, function($correctGames, $gameActions) {
            $actionTypes = ArrayHelper::getColumn($gameActions, 'actionType');

            if (!ArrayHelper::isSubset([ActionType::GAME_START, ActionType::GAME_STOP], $actionTypes)) {
                return $correctGames;
            }

            $indexedActions = ArrayHelper::index($gameActions, null, 'actionType');
            $startAction = $indexedActions[ActionType::GAME_START][0];

            $correctGames[$startAction['gameUid']] = [
                'startTimestamp' => (int) $startAction['createdAt'],
                'startDate' => date('Y-m-d H:i', (int) $startAction['createdAt']),
                'gameLength' => $indexedActions[ActionType::GAME_STOP][0]['createdAt'] - $startAction['createdAt'],
                'countriesMatched' => count($indexedActions[ActionType::COUNTRY_SUCCESS_SUBMIT]),
            ];

            return $correctGames;
        }, []);

        ArrayHelper::multisort($gamesData, 'startTimestamp', SORT_DESC);



        return $gamesData;
    }

}