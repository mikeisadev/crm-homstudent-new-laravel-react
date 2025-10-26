<?php

namespace App\Http\Controllers\Api;

use App\Models\Property;

/**
 * Property Document Controller
 *
 * Handles document management for properties
 * Extends GenericDocumentController for polymorphic functionality
 */
class PropertyDocumentController extends GenericDocumentController
{
    /**
     * Get property instance
     *
     * @param int $id
     * @return Property
     */
    protected function getEntity($id)
    {
        return Property::findOrFail($id);
    }

    /**
     * Get entity class name
     *
     * @return string
     */
    protected function getEntityClass()
    {
        return Property::class;
    }
}
