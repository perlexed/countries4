<?php

namespace app\assets;


use app\models\Action;
use yii\helpers\Url;
use yii\web\AssetBundle;
use Yii;

class GameAsset extends AssetBundle
{
    public $basePath = '@webroot';
    public $baseUrl = '@web';
    public $css = [
        'css/game.css',
    ];
    public $js = [
        'js/bundle.js',
    ];

    public function init()
    {
        parent::init();

        $this->jsOptions = [
            'csrfToken' => Yii::$app->request->getCsrfToken(),
        ];
    }

    public function registerAssetFiles($view)
    {
        parent::registerAssetFiles($view);

        $contextUser = Yii::$app->user->getIdentity();

        $config = json_encode([
            'userUid' => $contextUser->getAuthKey(),
            'baseUrl' => Yii::$app->request->baseUrl,
            'history' => Action::getHistoryForUser($contextUser->getId()),
            'version' => Yii::$app->getVersion(),
        ]);

        $view->registerJs("window.APPLICATION_CONFIG = '{$config}';", $view::POS_HEAD);

        $urlPath = Url::base() . '/images/favicon';

        $view->registerLinkTag(['rel' => 'apple-touch-icon', 'sizes' => '180x180', 'href' => $urlPath . '/apple-touch-icon.png']);
        $view->registerLinkTag(['rel' => 'icon', 'type' => 'image/png', 'sizes' => '32x32', 'href' => $urlPath . '/favicon-32x32.png']);
        $view->registerLinkTag(['rel' => 'icon', 'type' => 'image/png', 'sizes' => '16x16', 'href' => $urlPath . '/favicon-16x16.png']);
        $view->registerLinkTag(['rel' => 'manifest', 'href' => Url::base() . '/site.webmanifest']);
        $view->registerLinkTag(['rel' => 'mask-icon', 'color' => '5bbad5', 'href' => $urlPath . '/safari-pinned-tab.svg']);
        $view->registerMetaTag(['name' => 'msapplication-TileColor', 'content' => '#da532c']);
        $view->registerMetaTag(['name' => 'theme-color', 'content' => '#ffffff']);
    }

}