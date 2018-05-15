<?php

namespace app\enums;


class GameMode
{
    const MIN2 = 'min2';
    const MIN10 = 'min10';

    public static function getKeys()
    {
        return [
            self::MIN2,
            self::MIN10,
        ];
    }

    public static function getLengths()
    {
        return [
            self::MIN2 => 120,
            self::MIN10 => 600,
        ];
    }

    public static function getGameModeLength($gameModeId)
    {
        return isset(self::getLengths()[$gameModeId])
            ? self::getLengths()[$gameModeId]
            : null;
    }
}