<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Section extends Model
{
    use HasFactory;

    protected $fillable = ['id'];

    public function translations()
    {
        return $this->hasMany(SectionTranslation::class);
    }

    public function artworks()
    {
        return $this->hasMany(Artwork::class);
    }
}
