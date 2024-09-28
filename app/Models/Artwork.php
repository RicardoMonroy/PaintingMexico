<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Artwork extends Model
{
    use HasFactory;

    protected $fillable = ['front', 'background_color', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function translations()
    {
        return $this->hasMany(ArtworkTranslate::class);
    }

    public function images()
    {
        return $this->hasMany(Image::class);
    }

    public function videos()
    {
        return $this->hasMany(Video::class);
    }

    // public function section()
    // {
    //     return $this->belongsTo(Section::class);
    // }
    public function sections()
    {
        return $this->belongsToMany(Section::class, 'artwork_section');
    }
}
