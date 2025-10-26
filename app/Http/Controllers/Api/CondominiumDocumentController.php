<?php

namespace App\Http\Controllers\Api;

use App\Models\Condominium;

/**
 * Condominium Document Controller
 *
 * Handles document management for condominiums
 * Extends GenericDocumentController for polymorphic functionality
 */
class CondominiumDocumentController extends GenericDocumentController
{
    /**
     * Get condominium instance
     *
     * @param int $id
     * @return Condominium
     */
    protected function getEntity($id)
    {
        return Condominium::findOrFail($id);
    }

    /**
     * Get entity class name
     *
     * @return string
     */
    protected function getEntityClass()
    {
        return Condominium::class;
    }
}
