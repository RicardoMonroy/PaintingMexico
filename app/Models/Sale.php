<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = ['cover'];

    protected $table = 'sales';
    protected $primaryKey = 'idsales';

    public function saleURLs()
    {
        return $this->hasMany(SaleURL::class, 'sales_idsales');
    }

    public function saleTranslates()
    {
        return $this->hasMany(SaleTranslate::class, 'sales_idsales');
    }

    public function saleGalleries()
    {
        return $this->hasMany(SaleGallery::class, 'sales_idsales');
    }
}
