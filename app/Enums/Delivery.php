<?php

namespace App\Enums;

use App\Traits\EnumToArray;

enum Delivery: int
{
    use EnumToArray;

    case odbiór_osobisty = 1;
    case dostawa_na_adres = 2;
}
