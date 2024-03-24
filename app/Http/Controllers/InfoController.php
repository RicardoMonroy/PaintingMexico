<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Info;

class InfoController extends Controller
{
    public function show()
    {
        $info = Info::first();
        return Inertia::render('Welcome', ['info' => $info]);
    }
}
