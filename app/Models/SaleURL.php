<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleURL extends Model
{
    use HasFactory;

    protected $fillable = ['store', 'url'];

    protected $table = 'sale_urls';
    protected $primaryKey = 'idsaleURLs';

    public function sale()
    {
        return $this->belongsTo(Sale::class, 'sales_idsales');
    }
}
