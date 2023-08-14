<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum Payment: int
{
    use EnumToArray;

    case przy_odbiorze = 1;
    case przelew = 2;
}
