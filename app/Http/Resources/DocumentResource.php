<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class DocumentResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'extension' => $this->extension,
            'mime_type' => $this->mime_type,
            'size' => $this->size,
            'formatted_size' => $this->formatted_size,
            'is_viewable' => $this->isViewable(),
            'is_image' => $this->isImage(),
            'is_pdf' => $this->isPdf(),
            'folder' => $this->when($this->folder, function () {
                return [
                    'id' => $this->folder->id,
                    'name' => $this->folder->name,
                ];
            }),
            'download_url' => $this->download_url,
            'view_url' => $this->view_url,
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
