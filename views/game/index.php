<?php

use app\assets\GameAsset;

/** @var \yii\web\View $this */
/** @var array $history */

$this->registerAssetBundle(GameAsset::className());

$this->registerJs('window.HISTORY = ' . json_encode($history), $this::POS_HEAD);

?>
<div id="gameContainer"></div>