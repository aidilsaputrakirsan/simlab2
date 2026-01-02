<?php

namespace App\Export;

use Illuminate\Contracts\View\View;
use App\Models\User;
use Maatwebsite\Excel\Concerns\FromView;

class UsersExport implements FromView
{
    public function view(): View
    {
        return view('exports.users', [
            'users' => User::all()
        ]);
    }
}
