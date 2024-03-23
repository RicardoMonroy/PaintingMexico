<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SaleGallery extends Model
{
    use HasFactory;

    protected $fillable = ['url', 'sales_idsales'];

    public function sale()
    {
        return $this->belongsTo(Sale::class, 'sales_idsales');
    }
}
