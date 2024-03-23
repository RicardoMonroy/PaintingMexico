<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Info extends Model
{
    use HasFactory;

    use HasFactory;

    protected $table = 'info';
    protected $primaryKey = 'idinfo';
    protected $fillable = ['banner', 'email'];
}
