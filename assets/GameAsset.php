<?php

namespace app\assets;


use yii\web\AssetBundle;

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
            'csrfToken' => \Yii::$app->request->getCsrfToken(),
        ];
    }

    public function registerAssetFiles($view)
    {
        parent::registerAssetFiles($view);

        $countriesJson = file_get_contents(__DIR__ . '/../countriesList/countries.json');

        $view->registerJs("window.COUNTRIES_LIST = {$countriesJson};", $view::POS_HEAD);
    }

}