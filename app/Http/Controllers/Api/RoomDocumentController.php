<?php

namespace App\Http\Controllers\Api;

use App\Models\Room;

/**
 * Room Document Controller
 *
 * Handles document management for rooms
 * Extends GenericDocumentController for polymorphic functionality
 */
class RoomDocumentController extends GenericDocumentController
{
    /**
     * Get room instance
     *
     * @param int $id
     * @return Room
     */
    protected function getEntity($id)
    {
        return Room::findOrFail($id);
    }

    /**
     * Get entity class name
     *
     * @return string
     */
    protected function getEntityClass()
    {
        return Room::class;
    }
}
