<?php

namespace App\Http\Controllers\Api;

use App\Models\ManagementContract;

/**
 * Management Contract Document Controller
 *
 * Handles document management for management contracts
 * Extends GenericDocumentController for polymorphic functionality
 */
class ManagementContractDocumentController extends GenericDocumentController
{
    /**
     * Get management contract instance
     *
     * @param int $id
     * @return ManagementContract
     */
    protected function getEntity($id)
    {
        return ManagementContract::findOrFail($id);
    }

    /**
     * Get entity class name
     *
     * @return string
     */
    protected function getEntityClass()
    {
        return ManagementContract::class;
    }
}
