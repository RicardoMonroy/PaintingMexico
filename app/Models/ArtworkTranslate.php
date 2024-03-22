<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ArtworkTranslate extends Model
{
    use HasFactory;

    protected $fillable = ['artwork_id', 'locale', 'title', 'description'];

    public function artwork()
    {
        return $this->belongsTo(Artwork::class);
    }
}
