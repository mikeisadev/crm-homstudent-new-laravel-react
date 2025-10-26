<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FolderResource extends JsonResource
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
            'path' => $this->path,
            'parent_folder_id' => $this->parent_folder_id,
            'documents_count' => $this->when(isset($this->documents_count), $this->documents_count),
            'subfolders_count' => $this->when(isset($this->subfolders_count), $this->subfolders_count),
            'breadcrumbs' => $this->when($request->query('include_breadcrumbs'), function () {
                return $this->getBreadcrumbs();
            }),
            'parent' => $this->when($this->parent, function () {
                return [
                    'id' => $this->parent->id,
                    'name' => $this->parent->name,
                ];
            }),
            'created_at' => $this->created_at?->toISOString(),
            'updated_at' => $this->updated_at?->toISOString(),
        ];
    }
}
