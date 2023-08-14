<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum RentStatus: int
{
    use EnumToArray;

    case oczekujący = 1;
    case zatwierdzony = 2;
    case w_trakcie = 3;
    case zakończony = 4;
}
