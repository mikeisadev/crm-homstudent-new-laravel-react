import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import Button from '../../ui/Button';

/**
 * Photos Tab Renderer
 * Displays and manages photos for a room
 * Photos are stored in storage/app/private/room_photos/{uuid}/
 *
 * Features:
 * - Upload photos (JPG, PNG only)
 * - View photos in gallery
 * - Delete photos
 * - Reorder photos (drag and drop)
 */
const PhotosTabRenderer = ({ entityId, entityType = 'room', apiEndpoint }) => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPhotos();
    }, [entityId]);

    const fetchPhotos = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/${apiEndpoint}/${entityId}/photos`);
            const data = response.data.data || [];
            // Ensure data is an array (defensive programming)
            setPhotos(Array.isArray(data) ? data : []);
            setError(null);
        } catch (err) {
            console.error('Error fetching photos:', err);
            setError('Errore nel caricamento delle foto');
        } finally {
            setLoading(false);
        }
    };

    const handleUploadPhoto = async (event) => {
        const files = Array.from(event.target.files);

        if (files.length === 0) return;

        // Validate file types (only JPG and PNG)
        const invalidFiles = files.filter(file => {
            const ext = file.name.split('.').pop().toLowerCase();
            return !['jpg', 'jpeg', 'png'].includes(ext);
        });

        if (invalidFiles.length > 0) {
            alert('Solo file JPG e PNG sono consentiti');
            return;
        }

        setUploading(true);

        try {
            for (const file of files) {
                const formData = new FormData();
                formData.append('photo', file);

                await api.post(`/${apiEndpoint}/${entityId}/photos`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }

            await fetchPhotos();
            setError(null);
        } catch (err) {
            console.error('Error uploading photos:', err);
            setError(err.response?.data?.message || 'Errore nel caricamento delle foto');
        } finally {
            setUploading(false);
            event.target.value = ''; // Reset input
        }
    };

    const handleDeletePhoto = async (photoId) => {
        if (!confirm('Sei sicuro di voler eliminare questa foto?')) {
            return;
        }

        try {
            await api.delete(`/${apiEndpoint}/${entityId}/photos/${photoId}`);
            await fetchPhotos();
            setError(null);
        } catch (err) {
            console.error('Error deleting photo:', err);
            setError('Errore nell\'eliminazione della foto');
        }
    };

    const handleViewPhoto = async (photoId) => {
        try {
            const response = await api.get(`/${apiEndpoint}/${entityId}/photos/${photoId}/view`, {
                responseType: 'blob'
            });
            const blob = new Blob([response.data], { type: response.headers['content-type'] });
            const url = window.URL.createObjectURL(blob);
            window.open(url, '_blank');
        } catch (err) {
            console.error('Error viewing photo:', err);
            setError('Errore nella visualizzazione della foto');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Caricamento foto...</div>
            </div>
        );
    }

    const isEmpty = photos.length === 0;

    return (
        <div className="flex flex-col h-full">
            {/* Action Buttons - ALWAYS VISIBLE */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
                <input
                    type="file"
                    id="photo-upload"
                    multiple
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handleUploadPhoto}
                    className="hidden"
                />
                <Button
                    onClick={() => document.getElementById('photo-upload').click()}
                    disabled={uploading}
                    className="flex items-center gap-2"
                >
                    <i className="material-icons text-sm">add_photo_alternate</i>
                    {uploading ? 'Caricamento...' : 'Aggiungi foto'}
                </Button>
            </div>

            {/* Error Message */}
            {error && (
                <div className="mx-4 mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
                    {error}
                </div>
            )}

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto">
                {isEmpty ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                        <i className="material-icons text-6xl mb-4">photo_library</i>
                        <p className="text-lg">Nessuna foto presente</p>
                        <p className="text-sm mt-2">Carica le prime foto per questa stanza</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                        {photos.map((photo) => (
                            <div
                                key={photo.id}
                                className="relative group bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Photo Preview */}
                                <div
                                    className="aspect-square bg-gray-100 cursor-pointer"
                                    onClick={() => handleViewPhoto(photo.id)}
                                >
                                    <img
                                        src={`/api/${apiEndpoint}/${entityId}/photos/${photo.id}/thumbnail`}
                                        alt={photo.original_name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5GT1RPPC90ZXh0Pjwvc3ZnPg==';
                                        }}
                                    />
                                </div>

                                {/* Photo Info */}
                                <div className="p-2 bg-white">
                                    <p className="text-xs text-gray-600 truncate" title={photo.original_name}>
                                        {photo.original_name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {(photo.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>

                                {/* Action Buttons - Visible on hover */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleDeletePhoto(photo.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow-lg"
                                        title="Elimina foto"
                                    >
                                        <i className="material-icons text-sm">delete</i>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Results Count */}
            {!isEmpty && (
                <div className="bg-gray-50 px-4 py-2 border-t border-gray-200 text-sm text-gray-600">
                    <span>{photos.length} {photos.length === 1 ? 'foto' : 'foto'}</span>
                </div>
            )}
        </div>
    );
};

export default PhotosTabRenderer;
