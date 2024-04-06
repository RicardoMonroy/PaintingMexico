<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleTranslate extends Model
{
    use HasFactory;

    protected $fillable = ['locale', 'title', 'description'];

    protected $table = 'sale_translates';
    protected $primaryKey = 'idsaleTranslates';

    public function sale()
    {
        return $this->belongsTo(Sale::class, 'sales_idsales');
    }
}
