<?php

namespace App\Listeners;

use Carbon\Carbon;
use App\Events\CalculateRental;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class CalculateRentalListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(CalculateRental $event): void
    {
        $sum = 0;
        $sum += $event->rental->items()->sum('price');

        $dateRental = Carbon::parse($event->rental->date_rental);
        $dateDeadline = Carbon::parse($event->rental->date_deadline);
        $sum *= $dateRental->diffInDays($dateDeadline) + 1;
        $sum += $event->rental->delivery == 2 || $event->rental->delivery ==  "dostawa_na_adres" ? 50 : 0;
        $sum += $event->rental->payment == 2 || $event->rental->payment ==  "przelew" ? 5 : 0;

        $event->rental->update(['total_price' => $sum]);
    }
}
