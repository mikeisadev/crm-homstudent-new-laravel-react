<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Models\ManagementContract;
use App\Http\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Http\Resources\ManagementContractResource;

class ManagementContractController extends Controller
{
    use ApiResponse;

    public function index(Request $request) {
        try {
            $query = ManagementContract::query();

            $query->orderBy('contract_number', 'asc');

            return $this->success([
                'management_contracts' => ManagementContractResource::collection( $query->get() )
            ], 'Contratti di gestione recuperati con successo');
        } catch (\Exception $e) {
            return $this->error($e, 500);
        }
    }
}
