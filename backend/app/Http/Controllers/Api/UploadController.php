<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class UploadController extends Controller
{
    /**
     * Upload a file.
     */
    public function upload(Request $request): JsonResponse
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB max
        ]);

        $file = $request->file('file');
        $path = $file->store('uploads', 'public');

        return response()->json([
            'status' => 'success',
            'message' => 'File uploaded successfully',
            'data' => [
                'url' => Storage::url($path),
                'path' => $path,
                'filename' => $file->getClientOriginalName(),
                'size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
            ],
        ]);
    }

    /**
     * List uploaded files (public gallery)
     */
    public function index(): JsonResponse
    {
        $disk = Storage::disk('public');
        $dir = 'uploads';
        if (!$disk->exists($dir)) {
            return response()->json([
                'status' => 'success',
                'data' => [],
            ]);
        }

        $files = collect($disk->files($dir))
            ->filter(function ($path) use ($disk) {
                $mime = $disk->mimeType($path);
                return str_starts_with((string) $mime, 'image/');
            })
            ->map(function ($path) use ($disk) {
                return [
                    'url' => Storage::url($path),
                    'path' => $path,
                    'size' => $disk->size($path),
                    'last_modified' => $disk->lastModified($path),
                    'mime_type' => $disk->mimeType($path),
                    'filename' => basename($path),
                ];
            })
            ->sortByDesc('last_modified')
            ->values()
            ->all();

        return response()->json([
            'status' => 'success',
            'data' => $files,
        ]);
    }
}
