<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum ItemStatus: int
{
    use EnumToArray;

    case dostępny = 1;
    case wypożyczony = 2;
    case w_przeglądzie = 3;
}
