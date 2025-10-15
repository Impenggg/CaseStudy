<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

// Placeholder image route for fallback images
Route::get('/api/placeholder/{width}/{height}', function ($width, $height) {
    $width = min(max(intval($width), 50), 2000);
    $height = min(max(intval($height), 50), 2000);
    
    $image = imagecreate($width, $height);
    $bgColor = imagecolorallocate($image, 139, 119, 101); // heritage-600 color
    $textColor = imagecolorallocate($image, 255, 255, 255);
    
    // Add some texture
    for ($i = 0; $i < 100; $i++) {
        $x = rand(0, $width);
        $y = rand(0, $height);
        $color = imagecolorallocate($image, rand(120, 160), rand(100, 140), rand(80, 120));
        imagesetpixel($image, $x, $y, $color);
    }
    
    // Add text
    $text = "Image";
    $font = 5;
    $textWidth = imagefontwidth($font) * strlen($text);
    $textHeight = imagefontheight($font);
    $x = ($width - $textWidth) / 2;
    $y = ($height - $textHeight) / 2;
    imagestring($image, $font, $x, $y, $text, $textColor);
    
    header('Content-Type: image/png');
    imagepng($image);
    imagedestroy($image);
})->where(['width' => '[0-9]+', 'height' => '[0-9]+']);