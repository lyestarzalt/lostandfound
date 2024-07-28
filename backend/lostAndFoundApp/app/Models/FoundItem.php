<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
class FoundItem extends Model
{
    use HasFactory;
     protected $fillable = [
        'user_id',
        'title',
        'description',
        'latitude',
        'longitude',
        'picture',
    ];

   public function getPictureAttribute($value)
    {
        return $value ? url('storage/' . $value) : null;
    }
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
