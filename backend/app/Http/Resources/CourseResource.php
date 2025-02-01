<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CourseResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'subcategory_id' => $this->subcategory_id,
            'school_id' => $this->school_id,
            'name' => $this->name,
            'description' => $this->description,
            'price' => $this->price,
            'url' => $this->url,
            'link' => $this->link,
            'link-more' => $this->{'link-more'},
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}