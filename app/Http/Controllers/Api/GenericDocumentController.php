<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\DocumentService;
use Illuminate\Http\Request;

/**
 * Generic Document Controller
 *
 * Base controller for document management across all entities
 * Provides CRUD operations for documents and folders
 *
 * To be extended by entity-specific controllers
 */
abstract class GenericDocumentController extends Controller
{
    protected $documentService;

    public function __construct(DocumentService $documentService)
    {
        $this->documentService = $documentService;
    }

    /**
     * Get the entity instance - must be implemented by child controllers
     *
     * @param mixed $id
     * @return mixed
     */
    abstract protected function getEntity($id);

    /**
     * Get entity class name - must be implemented by child controllers
     *
     * @return string
     */
    abstract protected function getEntityClass();

    // ==================== DOCUMENTS ====================

    /**
     * Get list of documents
     *
     * GET /{entity}/{id}/documents?folder_id={folderId}
     */
    public function index(Request $request, $id)
    {
        try {
            $entity = $this->getEntity($id);
            $folderId = $request->query('folder_id');

            $documents = $this->documentService->getDocuments($entity, $folderId);

            return response()->json([
                'success' => true,
                'data' => $documents,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Upload a document
     *
     * POST /{entity}/{id}/documents
     */
    public function store(Request $request, $id)
    {
        $request->validate([
            'file' => 'required|file|max:10240|mimes:pdf,doc,docx,jpg,jpeg,png',
            'folder_id' => 'nullable|exists:document_folders,id',
        ]);

        try {
            $entity = $this->getEntity($id);
            $file = $request->file('file');
            $folderId = $request->input('folder_id');

            $document = $this->documentService->uploadDocument($entity, $file, $folderId);

            return response()->json([
                'success' => true,
                'message' => 'Document uploaded successfully',
                'data' => $document,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get document details
     *
     * GET /{entity}/{id}/documents/{documentId}
     */
    public function show($id, $documentId)
    {
        try {
            $entity = $this->getEntity($id);
            $document = $this->documentService->getDocument($entity, $documentId);

            return response()->json([
                'success' => true,
                'data' => $document,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * View document in browser
     *
     * GET /{entity}/{id}/documents/{documentId}/view
     */
    public function view($id, $documentId)
    {
        try {
            $entity = $this->getEntity($id);
            $fileData = $this->documentService->getFileContents($entity, $documentId);

            return response($fileData['contents'])
                ->header('Content-Type', $fileData['mimeType'])
                ->header('Content-Disposition', 'inline; filename="' . $fileData['filename'] . '"');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Download document
     *
     * GET /{entity}/{id}/documents/{documentId}/download
     */
    public function download($id, $documentId)
    {
        try {
            $entity = $this->getEntity($id);
            $fileData = $this->documentService->getFileContents($entity, $documentId);

            return response($fileData['contents'])
                ->header('Content-Type', $fileData['mimeType'])
                ->header('Content-Disposition', 'attachment; filename="' . $fileData['filename'] . '"');
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Delete document
     *
     * DELETE /{entity}/{id}/documents/{documentId}
     */
    public function destroy($id, $documentId)
    {
        try {
            $entity = $this->getEntity($id);
            $this->documentService->deleteDocument($entity, $documentId);

            return response()->json([
                'success' => true,
                'message' => 'Document deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    // ==================== FOLDERS ====================

    /**
     * Get list of folders
     *
     * GET /{entity}/{id}/folders?parent_id={parentId}
     */
    public function indexFolders(Request $request, $id)
    {
        try {
            $entity = $this->getEntity($id);
            $parentId = $request->query('parent_id');

            $folders = $this->documentService->getFolders($entity, $parentId);

            return response()->json([
                'success' => true,
                'data' => $folders,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Create a folder
     *
     * POST /{entity}/{id}/folders
     */
    public function storeFolder(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'parent_folder_id' => 'nullable|exists:document_folders,id',
        ]);

        try {
            $entity = $this->getEntity($id);
            $name = $request->input('name');
            $parentId = $request->input('parent_folder_id');

            $folder = $this->documentService->createFolder($entity, $name, $parentId);

            return response()->json([
                'success' => true,
                'message' => 'Folder created successfully',
                'data' => $folder,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
                'errors' => [
                    'name' => [$e->getMessage()],
                ],
            ], 422);
        }
    }

    /**
     * Get folder details
     *
     * GET /{entity}/{id}/folders/{folderId}
     */
    public function showFolder($id, $folderId)
    {
        try {
            $entity = $this->getEntity($id);
            $folder = $this->documentService->getFolder($entity, $folderId);

            return response()->json([
                'success' => true,
                'data' => $folder,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 404);
        }
    }

    /**
     * Delete folder
     *
     * DELETE /{entity}/{id}/folders/{folderId}
     */
    public function destroyFolder($id, $folderId)
    {
        try {
            $entity = $this->getEntity($id);
            $this->documentService->deleteFolder($entity, $folderId);

            return response()->json([
                'success' => true,
                'message' => 'Folder deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
